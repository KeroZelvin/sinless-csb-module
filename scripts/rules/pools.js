const MOD_ID = "sinlesscsb";
const CYBERDECK_TEMPLATE = "b2F3cWZSzUeZvam8";

/**
 * Parse numbers robustly from CSB props.
 * CSB sometimes stores numeric fields as strings with trailing newlines.
 * Examples: "11\n", "21\n\n\n"
 */
function num(v, fallback = 0) {
  if (typeof v === "string") v = v.trim();
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function hasItemProp(item, key) {
  const p = item?.system?.props ?? {};
  return Object.prototype.hasOwnProperty.call(p, key);
}

function computeItemMax(actor, key) {
  let max = 0;
  for (const it of actor?.items ?? []) {
    if (!hasItemProp(it, key)) continue;
    const v = Math.floor(num(it.system.props[key], 0));
    if (v > max) max = v;
  }
  return Math.max(0, max);
}

const SOUL_KEYS = {
  brawn: "soulBrawn",
  finesse: "soulFinesse",
  resolve: "soulResolve",
  focus: "soulFocus"
};

function computeSoulBonuses(actor) {
  const out = { brawn: 0, finesse: 0, resolve: 0, focus: 0 };
  for (const it of actor?.items ?? []) {
    const p = it?.system?.props ?? {};
    if (Object.prototype.hasOwnProperty.call(p, SOUL_KEYS.brawn)) {
      out.brawn += Math.floor(num(p[SOUL_KEYS.brawn], 0));
    }
    if (Object.prototype.hasOwnProperty.call(p, SOUL_KEYS.finesse)) {
      out.finesse += Math.floor(num(p[SOUL_KEYS.finesse], 0));
    }
    if (Object.prototype.hasOwnProperty.call(p, SOUL_KEYS.resolve)) {
      out.resolve += Math.floor(num(p[SOUL_KEYS.resolve], 0));
    }
    if (Object.prototype.hasOwnProperty.call(p, SOUL_KEYS.focus)) {
      out.focus += Math.floor(num(p[SOUL_KEYS.focus], 0));
    }
  }
  return {
    brawn: Math.max(0, out.brawn),
    finesse: Math.max(0, out.finesse),
    resolve: Math.max(0, out.resolve),
    focus: Math.max(0, out.focus)
  };
}

function getPropsRoot() {
  // e.g. "system.props"
  return String(game.settings.get(MOD_ID, "csbPropsRoot") || "system.props");
}

function getAtPath(obj, path) {
  if (!obj || !path) return undefined;
  return path.split(".").reduce((acc, k) => (acc && k in acc ? acc[k] : undefined), obj);
}

function props(actor) {
  return getAtPath(actor, getPropsRoot());
}

function readProp(actor, key) {
  return props(actor)?.[key];
}

function writePropUpdate(key) {
  // Build update keys like: "system.props.Brawn_Cur"
  return `${getPropsRoot()}.${key}`.replace(/\.+/g, ".");
}

function shouldIncludeActor(actor) {
  // Sinless rule: pools are a PC mechanic. Only refresh actors with a player owner.
  return !!actor?.hasPlayerOwner;
}

/* -------------------------------------------- */
/*  Canonical Actor Resolution (ActorUuid first) */
/* -------------------------------------------- */

function normalizeUuid(u) {
  const s = String(u ?? "").trim();
  return s.length ? s : null;
}

/**
 * Resolve the canonical base Actor for updates.
 * Priority:
 *  1) actor.system.props.ActorUuid (sheet-injected canonical Actor.<id>)
 *  2) token synthetic actor -> TokenDocument.baseActor
 *  3) actor itself
 */
async function resolveCanonicalActor(actor) {
  if (!actor) return null;

  // 1) Prefer injected canonical ActorUuid
  const actorUuid = normalizeUuid(readProp(actor, "ActorUuid"));
  if (actorUuid) {
    try {
      const doc = await fromUuid(actorUuid);
      if (doc?.documentName === "Actor") return doc;
    } catch (e) {
      console.warn("SinlessCSB | resolveCanonicalActor fromUuid failed", { actorUuid, e });
    }
  }

  // 2) Token synthetic actor -> baseActor
  if (actor.isToken && actor.parent?.baseActor) return actor.parent.baseActor;

  // 3) Fallback
  return actor;
}

export async function refreshPoolsForActor(actor) {
  if (!shouldIncludeActor(actor)) return;

  // Base stats
  const STR = num(readProp(actor, "STR"));
  const BOD = num(readProp(actor, "BOD"));
  const WIL = num(readProp(actor, "WIL"));
  const REA = num(readProp(actor, "REA"));
  const INT = num(readProp(actor, "INT"));
  const CHA = num(readProp(actor, "CHA"));

  // Sinless quarter-pool selector (1..4)
  const qN = num(readProp(actor, "chaQuarterPoolN"), 0);
  const chaQ = Math.floor(CHA / 4);

  const soul = computeSoulBonuses(actor);

  // Derived max pools
  const brawnBase =
    STR + Math.floor(BOD / 2) + Math.floor(WIL / 4) + (qN === 1 ? chaQ : 0);

  const finesseBase =
    REA + Math.floor(BOD / 2) + Math.floor(INT / 4) + (qN === 2 ? chaQ : 0);

  const resolveBase =
    WIL + Math.floor(INT / 2) + Math.floor(CHA / 2) + (qN === 3 ? chaQ : 0);

  const focusBase =
    INT + Math.floor(REA / 2) + Math.floor(WIL / 4) + (qN === 4 ? chaQ : 0);

  const brawn = Math.max(0, Math.floor(brawnBase + soul.brawn));
  const finesse = Math.max(0, Math.floor(finesseBase + soul.finesse));
  const resolve = Math.max(0, Math.floor(resolveBase + soul.resolve));
  const focus = Math.max(0, Math.floor(focusBase + soul.focus));

  const update = {};

  // Always refresh current pools at round start (refill behavior)
  update[writePropUpdate("Brawn_Cur")] = brawn;
  update[writePropUpdate("Finesse_Cur")] = finesse;
  update[writePropUpdate("Resolve_Cur")] = resolve;
  update[writePropUpdate("Focus_Cur")] = focus;

  // Persist computed max values for CSB formulas and API use
  const brawnComputedNow = Math.floor(num(readProp(actor, "brawnComputed"), NaN));
  const finesseComputedNow = Math.floor(num(readProp(actor, "finesseComputed"), NaN));
  const resolveComputedNow = Math.floor(num(readProp(actor, "resolveComputed"), NaN));
  const focusComputedNow = Math.floor(num(readProp(actor, "focusComputed"), NaN));

  if (!Number.isFinite(brawnComputedNow) || brawnComputedNow !== brawn) {
    update[writePropUpdate("brawnComputed")] = brawn;
  }
  if (!Number.isFinite(finesseComputedNow) || finesseComputedNow !== finesse) {
    update[writePropUpdate("finesseComputed")] = finesse;
  }
  if (!Number.isFinite(resolveComputedNow) || resolveComputedNow !== resolve) {
    update[writePropUpdate("resolveComputed")] = resolve;
  }
  if (!Number.isFinite(focusComputedNow) || focusComputedNow !== focus) {
    update[writePropUpdate("focusComputed")] = focus;
  }

  // Only update Max pools if they have changed (attribute changes are rare)
  // Note: num() now trims strings like "21\n\n" safely.
  const brawnMaxNow = Math.floor(num(readProp(actor, "Brawn_Max"), NaN));
  const finesseMaxNow = Math.floor(num(readProp(actor, "Finesse_Max"), NaN));
  const resolveMaxNow = Math.floor(num(readProp(actor, "Resolve_Max"), NaN));
  const focusMaxNow = Math.floor(num(readProp(actor, "Focus_Max"), NaN));

  if (!Number.isFinite(brawnMaxNow) || brawnMaxNow !== brawn) {
    update[writePropUpdate("Brawn_Max")] = brawn;
  }
  if (!Number.isFinite(finesseMaxNow) || finesseMaxNow !== finesse) {
    update[writePropUpdate("Finesse_Max")] = finesse;
  }
  if (!Number.isFinite(resolveMaxNow) || resolveMaxNow !== resolve) {
    update[writePropUpdate("Resolve_Max")] = resolve;
  }
  if (!Number.isFinite(focusMaxNow) || focusMaxNow !== focus) {
    update[writePropUpdate("Focus_Max")] = focus;
  }

  const mcpFromItems = computeItemMax(actor, "mcpDeck");
  const mcpProp = Math.floor(num(readProp(actor, "mcpDeck"), 0));
  const mcpMax = Math.max(0, Math.max(mcpProp, mcpFromItems));

  update[writePropUpdate("mcpDeck")] = mcpMax;
  update[writePropUpdate("mcpCur")] = mcpMax;

  const vcrFromItems = computeItemMax(actor, "vcrBonusDice");
  const vcrProp = Math.floor(num(readProp(actor, "vcrBonusDice"), 0));
  const vcrMax = Math.max(0, Math.max(vcrProp, vcrFromItems));

  update[writePropUpdate("vcrBonusDice")] = vcrMax;
  update[writePropUpdate("vcrbonusCur")] = vcrMax;

  // Avoid a no-op update call (optional, but clean)
  if (Object.keys(update).length === 0) return;

  await actor.update(update);

  // Keep cyberdeck and VCR item display in sync with refresh
  const updates = [];
  for (const it of actor.items ?? []) {
    const tpl = String(it?.system?.template ?? "").trim();
    const p = it?.system?.props ?? {};

    if (tpl === CYBERDECK_TEMPLATE && Object.prototype.hasOwnProperty.call(p, "mcpCur")) {
      updates.push({ _id: it.id, "system.props.mcpCur": mcpMax });
      continue;
    }

    const hasVcr = Object.prototype.hasOwnProperty.call(p, "vcrbonusCur") ||
      Object.prototype.hasOwnProperty.call(p, "vcrBonusDice");
    if (hasVcr) {
      updates.push({ _id: it.id, "system.props.vcrbonusCur": vcrMax });
    }
  }
  if (updates.length) {
    try { await actor.updateEmbeddedDocuments("Item", updates); } catch (_e) {}
  }
}

export async function refreshPoolsForCombat(combat) {
  if (!combat) return;

  // Deduplicate canonical actors (ActorUuid first) in case multiple combatants reference the same actor
  const actors = new Set();

  for (const c of combat.combatants) {
    const a = c?.actor;
    if (!a) continue;

    const canonical = await resolveCanonicalActor(a);
    if (canonical) actors.add(canonical);
  }

  for (const actor of actors) {
    try {
      await refreshPoolsForActor(actor);
    } catch (e) {
      console.error(`SinlessCSB | refreshPoolsForActor failed for ${actor?.name}`, e);
    }
  }
}
