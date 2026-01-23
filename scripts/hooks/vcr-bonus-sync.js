// scripts/hooks/vcr-bonus-sync.js
// Maintain actor.system.props.vcrBonusDice from VCR items (highest wins)

import { MOD_ID, num, propPath, readProps, resolveCanonicalActor } from "../api/_util.js";

const VCR_KEY = "vcrBonusDice";

function int(x, fallback = 0) {
  return Math.floor(num(x, fallback));
}

function hasVcrBonusProp(item) {
  const p = item?.system?.props ?? {};
  return Object.prototype.hasOwnProperty.call(p, VCR_KEY);
}

function computeVcrMax(actor) {
  let max = 0;
  for (const it of actor?.items ?? []) {
    const p = it?.system?.props ?? {};
    if (!Object.prototype.hasOwnProperty.call(p, VCR_KEY)) continue;
    const v = int(p[VCR_KEY], 0);
    if (v > max) max = v;
  }
  return Math.max(0, max);
}

async function updateActorWithMirrors(sheetActor, update) {
  await sheetActor.update(update);

  const canon = await resolveCanonicalActor(sheetActor);
  if (canon && canon.uuid !== sheetActor.uuid) {
    try { await canon.update(update); } catch (_e) {}
  }

  for (const t of canvas?.tokens?.controlled ?? []) {
    const ta = t?.actor;
    if (!ta || ta.documentName !== "Actor") continue;
    const taCanon = await resolveCanonicalActor(ta);
    const matches = (taCanon?.uuid && (taCanon.uuid === sheetActor.uuid || taCanon.uuid === canon?.uuid));
    if (!matches) continue;
    if (ta.uuid === sheetActor.uuid || ta.uuid === canon?.uuid) continue;
    try { await ta.update(update); } catch (_e) {}
  }
}

async function syncVcrBonusForActor(actor) {
  if (!actor || actor.documentName !== "Actor") return;

  const props = readProps(actor);
  const current = int(props?.[VCR_KEY], 0);
  const next = computeVcrMax(actor);

  if (current == next) return;

  const update = { [propPath(VCR_KEY)]: next };
  await updateActorWithMirrors(actor, update);

  if (game.settings?.get?.(MOD_ID, "debugLogs")) {
    console.log("SinlessCSB | VCR bonus sync", {
      actor: actor.name,
      current,
      next
    });
  }
}

function getParentActor(item) {
  const a = item?.parent ?? null;
  return (a?.documentName === "Actor") ? a : null;
}

export function registerVcrBonusHooks() {
  Hooks.on("createItem", (item) => {
    const actor = getParentActor(item);
    if (!actor) return;
    if (!hasVcrBonusProp(item)) return;
    syncVcrBonusForActor(actor).catch((e) =>
      console.warn("SinlessCSB | VCR sync (createItem) failed", e)
    );
  });

  Hooks.on("updateItem", (item, changes) => {
    const actor = getParentActor(item);
    if (!actor) return;

    const changed = changes?.system?.props?.[VCR_KEY];
    if (!hasVcrBonusProp(item) && changed === undefined) return;

    syncVcrBonusForActor(actor).catch((e) =>
      console.warn("SinlessCSB | VCR sync (updateItem) failed", e)
    );
  });

  Hooks.on("deleteItem", (item) => {
    const actor = getParentActor(item);
    if (!actor) return;
    if (!hasVcrBonusProp(item)) return;
    syncVcrBonusForActor(actor).catch((e) =>
      console.warn("SinlessCSB | VCR sync (deleteItem) failed", e)
    );
  });

  // Ready sweep to initialize cached value for owned actors
  Hooks.once("ready", () => {
    for (const a of game.actors?.contents ?? []) {
      if (!game.user?.isGM && !a.isOwner) continue;
      syncVcrBonusForActor(a).catch((e) =>
        console.warn("SinlessCSB | VCR sync (ready sweep) failed", e)
      );
    }
  });
}
