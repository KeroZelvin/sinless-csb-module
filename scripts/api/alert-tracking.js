// scripts/api/alert-tracking.js
// Track Alert helpers + GM socket relay (Foundry v13 + CSB v5)

import {
  MOD_ID,
  num,
  propPath,
  openDialogV2,
  getDialogFormFromCallbackArgs,
  readDialogNumber
} from "./_util.js";

const SOCKET_CHANNEL = `module.${MOD_ID}`;
const pendingRequests = new Map();
let socketBound = false;

function getSessionSettingsActor() {
  const exact = game.actors?.getName?.("Session Settings");
  if (exact) return exact;
  const lower = "session settings";
  return (game.actors?.contents ?? []).find(a => (a.name ?? "").trim().toLowerCase() === lower) ?? null;
}

function canUpdateActor(actor) {
  if (!actor) return false;
  if (game.user?.isGM) return true;
  const OWNER = CONST?.DOCUMENT_OWNERSHIP_LEVELS?.OWNER ?? 3;
  try {
    return !!actor.testUserPermission?.(game.user, OWNER);
  } catch (_e) {
    return false;
  }
}

async function setTrackAlertValue(sessionActor, value, reason = "") {
  if (!sessionActor) return null;
  const next = Math.max(0, Math.floor(num(value, 0)));
  const current = Math.max(0, Math.floor(num(sessionActor?.system?.props?.trackAlert, 0)));

  if (current === next) return next;

  await sessionActor.update({ [propPath("trackAlert")]: String(next) });
  if (reason) {
    console.log("SinlessCSB | trackAlert set", { reason, value: next });
  }
  return next;
}

async function addTrackAlertLocal(sessionActor, delta, reason = "") {
  if (!sessionActor) return null;
  const d = Math.floor(num(delta, NaN));
  if (!Number.isFinite(d) || d === 0) return Math.max(0, Math.floor(num(sessionActor?.system?.props?.trackAlert, 0)));
  const current = Math.max(0, Math.floor(num(sessionActor?.system?.props?.trackAlert, 0)));
  const next = Math.max(0, current + d);
  return await setTrackAlertValue(sessionActor, next, reason);
}

async function resetTrackAlertLocal(sessionActor, reason = "") {
  return await setTrackAlertValue(sessionActor, 0, reason);
}

async function requestTrackAlertViaSocket(payload) {
  if (!game.socket?.emit) return { ok: false, value: null, viaSocket: true };
  const activeGm = game.users?.activeGM ?? null;
  if (!activeGm) {
    ui.notifications?.warn?.("Track Alert: no active GM to process alert updates.");
    return { ok: false, value: null, viaSocket: true };
  }

  const requestId = (globalThis.crypto?.randomUUID?.() || foundry?.utils?.randomID?.() || `${Date.now()}-${Math.random()}`);

  const value = await new Promise((resolve) => {
    const timeout = setTimeout(() => {
      pendingRequests.delete(requestId);
      resolve(null);
    }, 8000);

    pendingRequests.set(requestId, { resolve, timeout });

    game.socket.emit(SOCKET_CHANNEL, { ...payload, requestId });
  });

  return { ok: Number.isFinite(value), value, viaSocket: true };
}

async function promptFileSecurityRatingGM({ defaultValue = 1 } = {}) {
  const content = `
    <form class="sinlesscsb alert-file-security" autocomplete="off">
      <p style="margin:0 0 8px 0;">
        File Security rating varies, from 1 for a public library site file to 6 for a classified military document.
      </p>
      <div style="display:flex; gap:8px; align-items:center; justify-content:space-between;">
        <label for="sl-file-security" style="font-weight:600;">File Security Rating</label>
        <input id="sl-file-security" name="fileSecurity" type="number" min="1" max="6" step="1"
               value="${Math.max(1, Math.min(6, Math.floor(num(defaultValue, 1))))}"
               style="width:6em; text-align:right;" />
      </div>
    </form>
  `;

  const result = await openDialogV2({
    title: "File Security Rating",
    content,
    rejectClose: false,
    buttons: [
      {
        action: "ok",
        label: "OK",
        default: true,
        callback: (event, button, dialog) => {
          const formEl = getDialogFormFromCallbackArgs(event, button, dialog);
          const fd = formEl ? new FormData(formEl) : null;
          const val = readDialogNumber(fd, "fileSecurity", NaN);
          return Number.isFinite(val) ? Math.floor(val) : null;
        }
      },
      { action: "cancel", label: "Cancel", callback: () => null }
    ]
  });

  return Number.isFinite(result) ? result : null;
}

async function requestFileSecurityViaSocket({ defaultValue = 1, reason = "" } = {}) {
  if (!game.socket?.emit) return { ok: false, value: defaultValue, viaSocket: true };
  const activeGm = game.users?.activeGM ?? null;
  if (!activeGm) {
    ui.notifications?.warn?.("File Security: no active GM to provide a rating.");
    return { ok: false, value: defaultValue, viaSocket: true };
  }

  const requestId = (globalThis.crypto?.randomUUID?.() || foundry?.utils?.randomID?.() || `${Date.now()}-${Math.random()}`);

  const value = await new Promise((resolve) => {
    const timeout = setTimeout(() => {
      pendingRequests.delete(requestId);
      resolve(null);
    }, 10000);

    pendingRequests.set(requestId, { resolve, timeout });

    game.socket.emit(SOCKET_CHANNEL, {
      type: "trackAlertFileSecurityRequest",
      requestId,
      defaultValue,
      reason: reason || ""
    });
  });

  return { ok: Number.isFinite(value), value: Number.isFinite(value) ? value : defaultValue, viaSocket: true };
}

export async function addTrackAlert({ delta, allowSocket = true, reason = "" } = {}) {
  const sessionActor = getSessionSettingsActor();
  if (!sessionActor) {
    console.warn("SinlessCSB | addTrackAlert: Session Settings actor not found.");
    return { ok: false, value: null, viaSocket: false };
  }

  if (canUpdateActor(sessionActor)) {
    const value = await addTrackAlertLocal(sessionActor, delta, reason);
    return { ok: Number.isFinite(value), value, viaSocket: false };
  }

  if (!allowSocket) return { ok: false, value: null, viaSocket: false };
  return await requestTrackAlertViaSocket({ type: "trackAlertAddRequest", delta, reason });
}

export function addTrackAlertAsync({ delta, allowSocket = true, reason = "" } = {}) {
  void addTrackAlert({ delta, allowSocket, reason });
}

export async function resetTrackAlert({ allowSocket = true, reason = "" } = {}) {
  const sessionActor = getSessionSettingsActor();
  if (!sessionActor) {
    ui.notifications?.warn?.("Track Alert: Session Settings actor not found.");
    return { ok: false, value: null, viaSocket: false };
  }

  if (canUpdateActor(sessionActor)) {
    const value = await resetTrackAlertLocal(sessionActor, reason);
    return { ok: Number.isFinite(value), value, viaSocket: false };
  }

  if (!allowSocket) return { ok: false, value: null, viaSocket: false };
  return await requestTrackAlertViaSocket({ type: "trackAlertResetRequest", reason });
}

export async function requestFileSecurityRating({ defaultValue = 1, reason = "" } = {}) {
  if (game.user?.isGM) {
    const val = await promptFileSecurityRatingGM({ defaultValue });
    const out = Number.isFinite(val) ? val : Math.max(1, Math.floor(num(defaultValue, 1)));
    return { ok: true, value: out, viaSocket: false };
  }

  return await requestFileSecurityViaSocket({ defaultValue, reason });
}

export function registerAlertSocketHandler() {
  if (socketBound) return;
  if (!game.socket?.on) return;
  socketBound = true;

  game.socket.on(SOCKET_CHANNEL, async (payload) => {
    if (!payload || payload.type == null) return;

    if (payload.type === "trackAlertResponse" || payload.type === "trackAlertFileSecurityResponse") {
      const pending = pendingRequests.get(payload.requestId);
      if (!pending) return;
      pendingRequests.delete(payload.requestId);
      try { clearTimeout(pending.timeout); } catch (_e) {}
      pending.resolve(Number.isFinite(payload.value) ? payload.value : null);
      return;
    }

    if (
      payload.type !== "trackAlertAddRequest" &&
      payload.type !== "trackAlertResetRequest" &&
      payload.type !== "trackAlertFileSecurityRequest"
    ) return;
    if (!game.user?.isGM) return;
    const activeGm = game.users?.activeGM ?? null;
    if (activeGm && activeGm.id !== game.user.id) return;

    const sessionActor = getSessionSettingsActor();
    let value = null;
    try {
      if (payload.type === "trackAlertAddRequest") {
        value = await addTrackAlertLocal(sessionActor, payload.delta, payload.reason || "");
      } else if (payload.type === "trackAlertResetRequest") {
        value = await resetTrackAlertLocal(sessionActor, payload.reason || "");
      } else if (payload.type === "trackAlertFileSecurityRequest") {
        const promptVal = await promptFileSecurityRatingGM({ defaultValue: payload.defaultValue });
        value = Number.isFinite(promptVal)
          ? promptVal
          : Math.max(1, Math.floor(num(payload.defaultValue, 1)));
      }
    } catch (e) {
      console.warn("SinlessCSB | GM trackAlert update failed", e);
    }

    game.socket.emit(SOCKET_CHANNEL, {
      type: payload.type === "trackAlertFileSecurityRequest" ? "trackAlertFileSecurityResponse" : "trackAlertResponse",
      requestId: payload.requestId,
      value: Number.isFinite(value) ? value : null
    });
  });
}
