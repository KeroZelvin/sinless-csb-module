// scripts/api/_util.js
// Shared utilities for SinlessCSB API functions (Foundry v13 + CSB v5)

export const MOD_ID = "sinlesscsb";

/* -------------------------------------------- */
/* Basic numeric + string utilities             */
/* -------------------------------------------- */

export function num(x, fallback = 0) {
  const n = Number(x);
  return Number.isFinite(n) ? n : fallback;
}

export function clamp(n, lo, hi) {
  const v = num(n, lo);
  return Math.max(lo, Math.min(hi, v));
}

export function clampInt(n, lo, hi) {
  return Math.floor(clamp(Math.floor(num(n, lo)), lo, hi));
}

export function normalizeUuid(u) {
  const s = String(u ?? "").trim();
  return s.length ? s : null;
}

export function escapeHTML(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* -------------------------------------------- */
/* CSB props helpers                            */
/* -------------------------------------------- */

export function propsRoot() {
  // You have a setting, but default is system.props
  try {
    return game.settings?.get?.(MOD_ID, "csbPropsRoot") || "system.props";
  } catch (_e) {
    return "system.props";
  }
}

export function readProps(doc) {
  return doc?.system?.props ?? {};
}

export function propPath(key) {
  // e.g. propPath("Resolve_Cur") => "system.props.Resolve_Cur"
  const root = propsRoot(); // "system.props"
  return `${root}.${key}`;
}

export function poolCurKey(poolKey) {
  // Item.poolKey: "Resolve" => "Resolve_Cur"
  const k = String(poolKey ?? "").trim();
  if (!k) return null;
  return k.endsWith("_Cur") ? k : `${k}_Cur`;
}

/* -------------------------------------------- */
/* Foundry document resolution helpers          */
/* -------------------------------------------- */

/**
 * Resolve canonical Actor if ActorUuid is stored on system.props.ActorUuid.
 * Also handles token-synthetic actor fallback.
 */
export async function resolveCanonicalActor(actor) {
  if (!actor) return null;

  // Prefer sheet-injected canonical ActorUuid (your best practice)
  const u = normalizeUuid(actor?.system?.props?.ActorUuid);
  if (u) {
    try {
      const doc = await fromUuid(u);
      if (doc?.documentName === "Actor") return doc;
    } catch (e) {
      console.warn("SinlessCSB | resolveCanonicalActor fromUuid failed", { ActorUuid: u, e });
    }
  }

  // Token synthetic actor -> base actor
  if (actor.isToken && actor.parent?.baseActor) return actor.parent.baseActor;

  return actor;
}

/**
 * Resolve an Actor to update, with the priority learned in debugging:
 *  1) scope.actorUuid (explicit, GM/sheet-safe)
 *  2) item.parent (embedded owner)
 *  3) controlled token actor
 *  4) user character
 */
export async function resolveActorForContext({ scope = {}, item = null } = {}) {
  const actorUuid = normalizeUuid(scope?.actorUuid);
  if (actorUuid) {
    const a = await fromUuid(actorUuid);
    if (a?.documentName === "Actor") return a;
    console.warn("SinlessCSB | resolveActorForContext: actorUuid did not resolve to Actor", { actorUuid, resolved: a });
  }

  if (item?.parent?.documentName === "Actor") return item.parent;

  const tokA = canvas?.tokens?.controlled?.[0]?.actor ?? null;
  if (tokA?.documentName === "Actor") return tokA;

  const charA = game.user.character ?? null;
  if (charA?.documentName === "Actor") return charA;

  return null;
}

/**
 * Resolve an Item document from:
 *  - itemUuid (supports "Item.<id>" or "Actor.<id>.Item.<id>")
 *  - OR { actorUuid, itemId } fallback (build embedded uuid)
 */
export async function resolveItemDoc({ itemUuid = null, actorUuid = null, itemId = null } = {}) {
  const u = normalizeUuid(itemUuid);
  if (u) {
    const doc = await fromUuid(u);
    if (doc?.documentName === "Item") return doc;
  }

  const aUuid = normalizeUuid(actorUuid);
  const iId = normalizeUuid(itemId);
  if (aUuid && iId) {
    // actorUuid may be "Actor.X" already; handle both
    const actorDoc = await fromUuid(aUuid);
    if (actorDoc?.documentName === "Actor") {
      const embeddedUuid = `Actor.${actorDoc.id}.Item.${iId}`;
      const doc2 = await fromUuid(embeddedUuid);
      if (doc2?.documentName === "Item") return doc2;
    }
  }

  return null;
}

/* -------------------------------------------- */
/* DialogV2 helpers                             */
/* -------------------------------------------- */

/**
 * Read FormData from a DialogV2 callback (v13 signature),
 * without relying on button.form or global document selectors.
 *
 * Accepts (event, buttonEl, dialog) or (button) variants safely.
 */
export function getDialogFormFromCallbackArgs(...args) {
  // v13 DialogV2 commonly: (event, buttonEl, dialog)
  const dialog = args?.[2] ?? args?.[0]?.dialog ?? null;
  const root = dialog?.element?.[0] ?? dialog?.element ?? null;
  if (!root?.querySelector) return null;
  return (
    root.querySelector("form") ??
    null
  );
}

export function readDialogNumber(fd, key, fallback = 0) {
  // fd can be FormData or null
  try {
    return num(fd?.get?.(key), fallback);
  } catch (_e) {
    return fallback;
  }
}

/* -------------------------------------------- */
/* Dice rolling helpers (v13-safe)              */
/* -------------------------------------------- */

export async function rollXd6Successes({ dice = 0, tn = 4 } = {}) {
  const d = Math.max(0, Math.floor(num(dice, 0)));
  const roll = new Roll(`${d}d6`);
  await roll.evaluate(); // v13 safe

  const results = roll.dice?.[0]?.results ?? [];
  const successes = results.reduce((acc, r) => acc + (num(r.result, 0) >= tn ? 1 : 0), 0);

  return { roll, dice: d, tn, results, successes };
}
