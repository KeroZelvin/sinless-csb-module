// scripts/hooks/actor-init.js

const MOD_ID = "sinlesscsb";

function num(x, fallback = 0) {
  const n = Number(x);
  return Number.isFinite(n) ? n : fallback;
}

function computeStunMax(actor) {
  const WIL = num(actor?.system?.props?.WIL, 0);
  return 6 + Math.floor(WIL / 2);
}

function computePhysicalMax(actor) {
  const BOD = num(actor?.system?.props?.BOD, 0);
  return 6 + Math.floor(BOD / 2);
}

/**
 * On createActor ONLY:
 * - force-init remaining tracks to full (max), regardless of template default (even 0)
 * - set a module flag so we never do this again for that actor
 */
async function initTracksOnCreate(actor) {
  if (!actor || actor.documentName !== "Actor") return;

  const already = await actor.getFlag(MOD_ID, "tracksInitialized");
  if (already) return;

  const props = actor.system?.props ?? {};
  const stunMax = Math.max(0, Math.floor(num(props.stunMax, computeStunMax(actor))));
  const physicalMax = Math.max(0, Math.floor(num(props.physicalMax, computePhysicalMax(actor))));

  const update = {
    "system.props.stunCur": stunMax,
    "system.props.physicalCur": physicalMax
  };

  console.log("SinlessCSB | initTracksOnCreate", { actor: actor.name, stunMax, physicalMax });

  await actor.update(update);
  await actor.setFlag(MOD_ID, "tracksInitialized", true);
}

/**
 * Clamp (never heal): if max decreases, reduce cur down to max.
 * Triggered when relevant keys change.
 */
async function clampTracksToMax(actor) {
  if (!actor || actor.documentName !== "Actor") return;

  const props = actor.system?.props ?? {};

  const stunMax = Math.max(0, Math.floor(num(props.stunMax, computeStunMax(actor))));
  const physicalMax = Math.max(0, Math.floor(num(props.physicalMax, computePhysicalMax(actor))));

  const stunCur = Math.max(0, Math.floor(num(props.stunCur, stunMax)));
  const physicalCur = Math.max(0, Math.floor(num(props.physicalCur, physicalMax)));

  const update = {};
  if (stunCur > stunMax) update["system.props.stunCur"] = stunMax;
  if (physicalCur > physicalMax) update["system.props.physicalCur"] = physicalMax;

  if (Object.keys(update).length) {
    console.log("SinlessCSB | clampTracksToMax", { actor: actor.name, ...update });
    await actor.update(update);
  }
}

export function registerActorInitHooks() {
  Hooks.on("createActor", (actor) => {
    initTracksOnCreate(actor).catch((e) => console.warn("SinlessCSB | initTracksOnCreate failed", e));
  });

  // Clamp when WIL/BOD or max fields change (adjust if your keys differ)
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
