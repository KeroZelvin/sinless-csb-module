// scripts/api/pools-roll.js
// SinlessCSB API — Pools Roller (Foundry v13 + CSB v5)
//
// Entry points:
//   rollPools({ actorUuid? })      // opens dialog
//   refreshPools({ actorUuid? })   // no dialog; recompute pools and set Cur/Max
//
// Notes:
// - Uses openDialogV2 wrapper (no direct DialogV2.wait())
// - Uses canonical Actor via system.props.ActorUuid (or actorUuid) to avoid token-synthetic drift
// - Writes to system.props.* keys (CSB live values)

import {
  num,
  escapeHTML,
  normalizeUuid,
  readProps,
  propPath,
  resolveCanonicalActor,
  openDialogV2
} from "./_util.js";

/* ----------------------------- */
/* Session Settings helpers      */
/* ----------------------------- */

function clampTN(tn, fallback = 4) {
  return [4, 5, 6].includes(tn) ? tn : fallback;
}

function getSessionSettingsActor() {
  const exact = game.actors?.getName?.("Session Settings");
  if (exact) return exact;
  const lower = "session settings";
  return (game.actors?.contents ?? []).find(a => (a.name ?? "").trim().toLowerCase() === lower) ?? null;
}

function readTN(sessionActor) {
  const raw = num(sessionActor?.system?.props?.TN_Global, NaN);
  return clampTN(Number.isFinite(raw) ? raw : 4, 4);
}

/* ----------------------------- */
/* Actor resolution + mirroring  */
/* ----------------------------- */

/**
 * Resolve the “sheet actor candidate”:
 *  1) scope.actorUuid
 *  2) controlled token actor
 *  3) user character
 */
async function resolveActorCandidate(scope = {}) {
  const actorUuid = normalizeUuid(scope?.actorUuid);
  const bound = actorUuid ? await fromUuid(actorUuid) : null;
  if (bound?.documentName === "Actor") return bound;

  const tokA = canvas?.tokens?.controlled?.[0]?.actor ?? null;
  if (tokA?.documentName === "Actor") return tokA;

  const charA = game.user?.character ?? null;
  if (charA?.documentName === "Actor") return charA;

  return null;
}

/**
 * Mirror-safe update:
 * - Update sheetActor (what user is “looking at”)
 * - Update canonical actor if different
 * - Update any controlled token-synthetic actors that map to same canonical
 */
async function updateActorWithMirrors(sheetActor, update) {
  await sheetActor.update(update);

  const canon = await resolveCanonicalActor(sheetActor);
  if (canon && canon.uuid !== sheetActor.uuid) {
    try { await canon.update(update); } catch (_e) {}
  }

  for (const t of (canvas?.tokens?.controlled ?? [])) {
    const ta = t?.actor;
    if (!ta || ta.documentName !== "Actor") continue;

    const taCanon = await resolveCanonicalActor(ta);
    const matches = taCanon?.uuid && canon?.uuid && (taCanon.uuid === canon.uuid);
    if (!matches) continue;

    if (ta.uuid === sheetActor.uuid || ta.uuid === canon.uuid) continue;
    try { await ta.update(update); } catch (_e) {}
  }

  // Best-effort rerender (helps CSB sheets refresh immediately)
  const rerender = (a) => {
    for (const app of Object.values(a?.apps ?? {})) {
      try { app.render(false); } catch (_e) {}
    }
  };
  rerender(sheetActor);
  if (canon && canon.uuid !== sheetActor.uuid) rerender(canon);
  for (const t of (canvas?.tokens?.controlled ?? [])) rerender(t?.actor);
}

/* ----------------------------- */
/* Pools + refresh math          */
/* ----------------------------- */

function poolDefs() {
  return [
    { name: "Brawn",   curKey: "Brawn_Cur",   maxKey: "Brawn_Max" },
    { name: "Finesse", curKey: "Finesse_Cur", maxKey: "Finesse_Max" },
    { name: "Resolve", curKey: "Resolve_Cur", maxKey: "Resolve_Max" },
    { name: "Focus",   curKey: "Focus_Cur",   maxKey: "Focus_Max" }
  ];
}

function computePoolsFromAttrs(actor) {
  const p = readProps(actor);

  const STR = num(p.STR, 0);
  const BOD = num(p.BOD, 0);
  const WIL = num(p.WIL, 0);
  const REA = num(p.REA, 0);
  const INT = num(p.INT, 0);
  const CHA = num(p.CHA, 0);

  // Quarter-CHA selector
  const qN = num(p.chaQuarterPoolN, 0);
  const chaQ = Math.floor(CHA / 4);

  const brawn   = STR + Math.floor(BOD / 2) + Math.floor(WIL / 4) + (qN === 1 ? chaQ : 0);
  const finesse = REA + Math.floor(BOD / 2) + Math.floor(INT / 4) + (qN === 2 ? chaQ : 0);
  const resolve = WIL + Math.floor(INT / 2) + Math.floor(CHA / 2) + (qN === 3 ? chaQ : 0);
  const focus   = INT + Math.floor(REA / 2) + Math.floor(WIL / 4) + (qN === 4 ? chaQ : 0);

  return {
    brawn:   Math.max(0, Math.floor(brawn)),
    finesse: Math.max(0, Math.floor(finesse)),
    resolve: Math.max(0, Math.floor(resolve)),
    focus:   Math.max(0, Math.floor(focus))
  };
}

/**
 * Build a Cur/Max update object from computed pools.
 */
function buildPoolsUpdate({ brawn, finesse, resolve, focus }) {
  return {
    [propPath("Brawn_Max")]: brawn,
    [propPath("Brawn_Cur")]: brawn,
    [propPath("Finesse_Max")]: finesse,
    [propPath("Finesse_Cur")]: finesse,
    [propPath("Resolve_Max")]: resolve,
    [propPath("Resolve_Cur")]: resolve,
    [propPath("Focus_Max")]: focus,
    [propPath("Focus_Cur")]: focus
  };
}

/* ----------------------------- */
/* API: refreshPools (no dialog) */
/* ----------------------------- */

export async function refreshPools(scope = {}) {
  const sheetActor = await resolveActorCandidate(scope);
  if (!sheetActor) {
    ui.notifications?.warn?.("Select a token or set a User Character (or pass actorUuid).");
    return null;
  }

  const canon = await resolveCanonicalActor(sheetActor);
  if (!canon) return null;

  // Prefer rules module if present
  try {
    const poolsMod = await import("/modules/sinlesscsb/scripts/rules/pools.js");
    if (typeof poolsMod?.refreshPoolsForActor === "function") {
      // Run on sheetActor and canonical (and controlled synthetics) to preserve mirrors
      await poolsMod.refreshPoolsForActor(sheetActor);
      if (canon.uuid !== sheetActor.uuid) {
        try { await poolsMod.refreshPoolsForActor(canon); } catch (_e) {}
      }

      for (const t of (canvas?.tokens?.controlled ?? [])) {
        const ta = t?.actor;
        if (!ta || ta.documentName !== "Actor") continue;

        const taCanon = await resolveCanonicalActor(ta);
        if (!taCanon?.uuid || taCanon.uuid !== canon.uuid) continue;

        if (ta.uuid !== sheetActor.uuid && ta.uuid !== canon.uuid) {
          try { await poolsMod.refreshPoolsForActor(ta); } catch (_e) {}
        }
      }

      // Enforce Cur=Max (rules module often sets Max but leaves Cur)
      const defs = poolDefs();
      const p = readProps(canon);
      const enforce = {};
      for (const def of defs) {
        const maxV = Math.max(0, Math.floor(num(p?.[def.maxKey], 0)));
        const curV = Math.max(0, Math.floor(num(p?.[def.curKey], 0)));
        if (curV !== maxV) enforce[propPath(def.curKey)] = maxV;
      }
      if (Object.keys(enforce).length) {
        await updateActorWithMirrors(sheetActor, enforce);
      }

      ui.notifications?.info?.("Pools refreshed.");
      return { actorUuid: canon.uuid, mode: "rulesModule" };
    }
  } catch (_e) {
    // fall through to fallback
  }

  // Fallback compute + mirror-safe update
  const computed = computePoolsFromAttrs(canon);
  const update = buildPoolsUpdate(computed);

  console.log("SinlessCSB | refreshPools fallback update", {
    sheetActor: { name: sheetActor.name, uuid: sheetActor.uuid },
    canon: { name: canon.name, uuid: canon.uuid },
    update
  });

  await updateActorWithMirrors(sheetActor, update);

  ui.notifications?.info?.("Pools refreshed.");
  return { actorUuid: canon.uuid, mode: "fallback", update };
}

/* ----------------------------- */
/* API: rollPools (dialog)       */
/* ----------------------------- */

export async function rollPools(scope = {}) {
  const sheetActor = await resolveActorCandidate(scope);
  if (!sheetActor) {
    ui.notifications?.warn?.("Select a token or set a User Character (or pass actorUuid).");
    return null;
  }

  // Canonical for rules truth; updates mirrored from sheetActor
  const actor = await resolveCanonicalActor(sheetActor);
  if (!actor) return null;

  const sessionActor = getSessionSettingsActor();
  if (!sessionActor) {
    ui.notifications?.error?.('Actor "Session Settings" not found (needed for TN_Global).');
    return null;
  }

  const pools = poolDefs();
  const getCur = (p) => Math.floor(num(readProps(actor)?.[p.curKey], 0));
  const getMax = (p) => Math.floor(num(readProps(actor)?.[p.maxKey], 0));

  const tn = readTN(sessionActor);

  const content = `
    <div class="sinlesscsb sinless-pools-dialog">
      <style>
        .sinlesscsb.sinless-pools-dialog table tbody tr:nth-child(odd) { background: rgba(255,255,255,0.03); }
        .sinlesscsb.sinless-pools-dialog table tbody tr:nth-child(even){ background: rgba(0,0,0,0.06); }
        .sinlesscsb.sinless-pools-dialog table td,
        .sinlesscsb.sinless-pools-dialog table th { border-bottom: 1px solid rgba(242,243,245,0.10); }
      </style>

      <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom: 0.5rem;">
        <div><strong>Target Number (Session Settings):</strong> <span data-tn>${escapeHTML(tn)}</span>+</div>
        <div><button type="button" data-action="refresh">Refresh Pools</button></div>
      </div>

      <table style="width:100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="text-align:left; padding:4px 6px;">Pool</th>
            <th style="text-align:right; padding:4px 6px;">Cur / Max</th>
            <th style="text-align:right; padding:4px 6px;">Spend</th>
            <th style="text-align:right; padding:4px 6px;">Mod</th>
            <th style="text-align:left; padding:4px 6px;">Action</th>
          </tr>
        </thead>
        <tbody>
          ${pools.map(p => {
            const cur = getCur(p);
            const max = getMax(p);
            return `
              <tr data-pool="${p.curKey}">
                <td style="padding:4px 6px;"><strong>${escapeHTML(p.name)}</strong></td>
                <td style="padding:4px 6px; text-align:right;">
                  <span data-cur="${p.curKey}">${escapeHTML(cur)}</span>
                  /
                  <span data-max="${p.maxKey}">${escapeHTML(max)}</span>
                </td>
                <td style="padding:4px 6px; text-align:right;">
                  <input type="number" name="${p.curKey}_spend" value="0" min="0" step="1" style="width:6em; text-align:right;" />
                </td>
                <td style="padding:4px 6px; text-align:right;">
                  <input type="number" name="${p.curKey}_mod" value="0" step="1" style="width:6em; text-align:right;" />
                </td>
                <td style="padding:4px 6px;">
                  <button type="button" data-action="roll" data-pool="${p.curKey}">Roll</button>
                  <button type="button" data-action="clear" data-pool="${p.curKey}" style="margin-left:6px;">Clear</button>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>

      <p style="margin-top:0.75rem; opacity:0.85;">
        Spend depletes the pool; Mod adds/removes dice but does not deplete.
      </p>
    </div>
  `;

  await openDialogV2({
    title: `Sinless Pools — ${actor.name}`,
    content,
    rejectClose: false,
    buttons: [{ action: "close", label: "Close", default: true, callback: () => "close" }],

    onRender: (dialog, root) => {
      if (root?.dataset?.sinlessPoolsBound === "1") return;
      root.dataset.sinlessPoolsBound = "1";

      const qInput = (name) => root.querySelector(`input[name="${CSS.escape(name)}"]`);

      const updateTNDisplay = () => {
        const newTN = readTN(sessionActor);
        const tnEl = root.querySelector("[data-tn]");
        if (tnEl) tnEl.textContent = String(newTN);
        return newTN;
      };

      const updateRow = (p) => {
        const curEl = root.querySelector(`[data-cur="${CSS.escape(p.curKey)}"]`);
        const maxEl = root.querySelector(`[data-max="${CSS.escape(p.maxKey)}"]`);
        if (curEl) curEl.textContent = String(getCur(p));
        if (maxEl) maxEl.textContent = String(getMax(p));
      };

      const updateAllRows = () => {
        updateTNDisplay();
        for (const p of pools) updateRow(p);
      };

      const clearInputs = (poolKey) => {
        const spend = qInput(`${poolKey}_spend`);
        const mod = qInput(`${poolKey}_mod`);
        if (spend) spend.value = 0;
        if (mod) mod.value = 0;
      };

      const doRefresh = async () => {
        await refreshPools({ actorUuid: sheetActor.uuid });
        updateAllRows();
      };

      const doRoll = async (poolKey) => {
        const p = pools.find(x => x.curKey === poolKey);
        if (!p) return;

        const TN = updateTNDisplay();
        const curVal = getCur(p);

        const spendEl = qInput(`${poolKey}_spend`);
        const modEl = qInput(`${poolKey}_mod`);

        const spend = num(spendEl?.value, 0);
        const mod = num(modEl?.value, 0);

        const spendClamped = Math.max(0, Math.min(curVal, spend));
        const totalDice = Math.max(0, spendClamped + mod);

        if (totalDice <= 0) {
          ui.notifications?.warn?.("No dice to roll (Spend + Mod is 0).");
          clearInputs(poolKey);
          return;
        }

        const roll = new Roll(`${totalDice}d6`);
        await roll.evaluate();

        const results = roll.dice?.[0]?.results ?? [];
        const successes = results.reduce((acc, r) => acc + (num(r.result, 0) >= TN ? 1 : 0), 0);

        const newCur = Math.max(0, curVal - spendClamped);

        await updateActorWithMirrors(sheetActor, { [propPath(p.curKey)]: newCur });

        updateRow(p);
        clearInputs(poolKey);

        const diceList = results.map(r => r.result).join(", ") || "—";

        const flavor = `
          <div class="sinlesscsb pool-roll-card">
            <h2 style="margin:0 0 6px 0;">${escapeHTML(p.name)} Test</h2>
            <p style="margin:0 0 6px 0;"><strong>Actor:</strong> ${escapeHTML(actor.name)}</p>
            <p style="margin:0 0 6px 0;"><strong>TN (Session Settings):</strong> ${escapeHTML(TN)}+</p>
            <p style="margin:0 0 6px 0;">
              <strong>Spend:</strong> ${escapeHTML(spendClamped)} (depletes) &nbsp;|&nbsp;
              <strong>Mod:</strong> ${escapeHTML(mod)} (free) &nbsp;|&nbsp;
              <strong>Total:</strong> ${escapeHTML(totalDice)}d6
            </p>
            <p style="margin:0 0 6px 0;"><strong>Successes:</strong> ${escapeHTML(successes)}</p>
            <p style="margin:0 0 6px 0;"><strong>${escapeHTML(p.name)}:</strong> ${escapeHTML(curVal)} → ${escapeHTML(newCur)}</p>
            <details>
              <summary>Dice Results</summary>
              <div style="margin-top:6px;">${escapeHTML(diceList)}</div>
            </details>
          </div>
        `;

        await roll.toMessage(
          { speaker: ChatMessage.getSpeaker({ actor }), flavor },
          { create: true }
        );
      };

      // Live refresh: update dialog when EITHER sheetActor or canonical updates
      if (!dialog._sinlessPoolsActorHookId) {
        const sheetId = sheetActor?.id;
        const canonId = actor?.id;

        dialog._sinlessPoolsActorHookId = Hooks.on("updateActor", (updatedActor, changed) => {
          if (!updatedActor?.id) return;
          if (updatedActor.id !== sheetId && updatedActor.id !== canonId) return;
          if (!changed?.system?.props) return;
          queueMicrotask(() => updateAllRows());
        });
      }

      const handler = async (ev) => {
        const t = ev.target;
        if (!(t instanceof HTMLElement)) return;

        const action = t.dataset.action;
        if (!action) return;

        ev.preventDefault();

        try {
          if (action === "refresh") return await doRefresh();
          if (action === "clear") return clearInputs(t.dataset.pool);
          if (action === "roll") return await doRoll(t.dataset.pool);
        } catch (e) {
          console.error(e);
          ui.notifications?.error?.("Sinless Pools failed. See console (F12).");
        }
      };

      root.addEventListener("click", handler);

      const origClose = dialog.close?.bind(dialog);
      dialog.close = async (...args) => {
        try { root.removeEventListener("click", handler); } catch (_e) {}
        try {
          if (dialog._sinlessPoolsActorHookId) {
            Hooks.off("updateActor", dialog._sinlessPoolsActorHookId);
            dialog._sinlessPoolsActorHookId = null;
          }
        } catch (_e) {}
        return origClose ? await origClose(...args) : undefined;
      };

      updateAllRows();
    }
  });

  return { actorUuid: actor.uuid };
}
