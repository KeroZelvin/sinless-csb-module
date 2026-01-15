// scripts/hooks/actor-init.js
// Purpose:
// - Ensure stunMax/physicalMax are persisted as real numeric props (CSB maxVal formulas need this)
// - Initialize stunCur/physicalCur ONLY when truly unset (NOT when 0), and only during "pending"
// - Clamp cur values downward if max decreases (never heals)

const MOD_ID = "sinlesscsb";

/* =========================
 * Utilities
 * ========================= */
function num(x, fallback = 0) {
  const n = Number(x);
  return Number.isFinite(n) ? n : fallback;
}
function int(x, fallback = 0) {
  return Math.floor(num(x, fallback));
}
function isUnset(v) {
  return v === undefined || v === null || v === "";
}

function normalizeUuid(u) {
  const s = String(u ?? "").trim();
  return s.length ? s : null;
}

/**
 * Ensure system.props.ActorUuid AND system.props.actorUuid are set to the base Actor UUID.
 * - Never runs on non-owners (except GM)
 * - Safe against re-entrancy (no update if already correct)
 */
async function ensureActorUuidDualKeys(actor) {
  if (!actor || actor.documentName !== "Actor") return;

  // Only GM or owner should attempt updates
  if (!game.user?.isGM && !actor.isOwner) return;

  const baseActor = actor.isToken && actor.parent?.baseActor ? actor.parent.baseActor : actor;
  if (!baseActor || baseActor.documentName !== "Actor") return;

  const canonical = normalizeUuid(baseActor.uuid);
  if (!canonical) return;

  const props = baseActor.system?.props ?? {};
  const currentA = normalizeUuid(props.ActorUuid);
  const currenta = normalizeUuid(props.actorUuid);

  if (currentA === canonical && currenta === canonical) return;

  const update = {};
  if (currentA !== canonical) update["system.props.ActorUuid"] = canonical;
  if (currenta !== canonical) update["system.props.actorUuid"] = canonical;

  await baseActor.update(update);

  if (game.settings?.get?.(MOD_ID, "debugLogs")) {
    console.log("SinlessCSB | ActorUuid ensured (dual keys)", {
      name: baseActor.name,
      canonical,
      wrote: Object.keys(update)
    });
  }
}

function computeStunMax(actor) {
  const WIL = num(actor?.system?.props?.WIL, 0);
  return 6 + Math.floor(WIL / 2);
}
function computePhysicalMax(actor) {
  const BOD = num(actor?.system?.props?.BOD, 0);
  return 6 + Math.floor(BOD / 2);
}

/* =========================
 * Init once, after CSB templating
 * ========================= */
async function initTracksIfPending(actor) {
  if (!actor || actor.documentName !== "Actor") return;

  const initialized = await actor.getFlag(MOD_ID, "tracksInitialized");
  if (initialized) return;

  const pending = await actor.getFlag(MOD_ID, "tracksInitPending");
  if (!pending) return;

  const props = actor.system?.props ?? {};

  // Compute maxes and ensure they exist as persisted props
  const stunMax = int(props.stunMax, computeStunMax(actor));
  const physicalMax = int(props.physicalMax, computePhysicalMax(actor));

  const update = {};

  // Persist max props so CSB formulas like ${physicalMax}$ resolve everywhere
  if (int(props.stunMax, -999999) !== stunMax) update["system.props.stunMax"] = stunMax;
  if (int(props.physicalMax, -999999) !== physicalMax) update["system.props.physicalMax"] = physicalMax;

  // Initialize cur ONLY if truly unset (undefined/null/"")
  // Do NOT treat 0 as "missing" — 0 is a valid remaining-track value.
  if (isUnset(props.stunCur)) update["system.props.stunCur"] = stunMax;
  if (isUnset(props.physicalCur)) update["system.props.physicalCur"] = physicalMax;

  if (Object.keys(update).length) {
    console.log("SinlessCSB | init tracks (pending)", { actor: actor.name, stunMax, physicalMax, update });
    await actor.update(update);
  }

  await actor.setFlag(MOD_ID, "tracksInitialized", true);
  await actor.unsetFlag(MOD_ID, "tracksInitPending");
}

/* =========================
 * Clamp downwards if max decreases
 * ========================= */
async function clampTracksToMax(actor) {
  if (!actor || actor.documentName !== "Actor") return;

  const props = actor.system?.props ?? {};

  const stunMax = int(props.stunMax, computeStunMax(actor));
  const physicalMax = int(props.physicalMax, computePhysicalMax(actor));

  const stunCur = int(props.stunCur, stunMax);
  const physicalCur = int(props.physicalCur, physicalMax);

  const update = {};

  // Keep max props persisted (helps CSB maxVal formulas)
  if (int(props.stunMax, -999999) !== stunMax) update["system.props.stunMax"] = stunMax;
  if (int(props.physicalMax, -999999) !== physicalMax) update["system.props.physicalMax"] = physicalMax;

  // Only clamp downward; never heal upward
  if (stunCur > stunMax) update["system.props.stunCur"] = stunMax;
  if (physicalCur > physicalMax) update["system.props.physicalCur"] = physicalMax;

  if (Object.keys(update).length) {
    console.log("SinlessCSB | clamp tracks to max", { actor: actor.name, stunMax, physicalMax, update });
    await actor.update(update);
  }
}

/* =========================
 * Hook registration
 * ========================= */
export function registerActorInitHooks() {
    // Ensure ActorUuid keys on create (GM-owned)
  Hooks.on("createActor", (actor) => {
    ensureActorUuidDualKeys(actor).catch((e) =>
      console.warn("SinlessCSB | ensureActorUuidDualKeys(create) failed", e)
    );
  });

  // Ensure ActorUuid keys on update when props might have changed
  Hooks.on("updateActor", (actor) => {
    ensureActorUuidDualKeys(actor).catch((e) =>
      console.warn("SinlessCSB | ensureActorUuidDualKeys(update) failed", e)
    );
  });

  // One-time ready sweep (GM only) for existing actors missing keys
  Hooks.once("ready", () => {
    if (!game.user?.isGM) return;
    for (const a of game.actors?.contents ?? []) {
      ensureActorUuidDualKeys(a).catch((e) =>
        console.warn("SinlessCSB | ensureActorUuidDualKeys(ready sweep) failed", e)
      );
    }
  });
  
  Hooks.on("createActor", (actor) => {
    // Mark pending; CSB/template will usually apply an update immediately after create.
    actor
      .setFlag(MOD_ID, "tracksInitPending", true)
      .catch((e) => console.warn("SinlessCSB | set tracksInitPending failed", e));
  });

  // After CSB has pushed template stats (first update), init once.
  Hooks.on("updateActor", (actor) => {
    initTracksIfPending(actor).catch((e) => console.warn("SinlessCSB | initTracksIfPending failed", e));
  });

  // Also try on first sheet render (covers imported/copy cases)
  Hooks.on("renderActorSheet", (app) => {
    const actor = app?.actor ?? app?.document ?? null;
    initTracksIfPending(actor).catch((e) => console.warn("SinlessCSB | initTracksIfPending(render) failed", e));
  });

  // Clamp when max changes later (never heals)
  Hooks.on("updateActor", (actor, changed) => {
    const p = changed?.system?.props ?? {};
    const relevant =
      p.WIL !== undefined ||
      p.BOD !== undefined ||
      p.stunMax !== undefined ||
      p.physicalMax !== undefined;

    if (!relevant) return;
    clampTracksToMax(actor).catch((e) => console.warn("SinlessCSB | clampTracksToMax failed", e));
  });
}
