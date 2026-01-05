const MOD_ID = "sinlesscsb";

function num(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
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

  // Derived max pools
  const brawn =
    STR + Math.floor(BOD / 2) + Math.floor(WIL / 4) + (qN === 1 ? chaQ : 0);

  const finesse =
    REA + Math.floor(BOD / 2) + Math.floor(INT / 4) + (qN === 2 ? chaQ : 0);

  const resolve =
    WIL + Math.floor(INT / 2) + Math.floor(CHA / 2) + (qN === 3 ? chaQ : 0);

  const focus =
    INT + Math.floor(REA / 2) + Math.floor(WIL / 4) + (qN === 4 ? chaQ : 0);

  const update = {};

  // Always refresh current pools at round start (refill behavior)
  update[writePropUpdate("Brawn_Cur")] = brawn;
  update[writePropUpdate("Finesse_Cur")] = finesse;
  update[writePropUpdate("Resolve_Cur")] = resolve;
  update[writePropUpdate("Focus_Cur")] = focus;

  // Only update Max pools if they have changed (attribute changes are rare)
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

  // Avoid a no-op update call (optional, but clean)
  if (Object.keys(update).length === 0) return;

  await actor.update(update);
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
