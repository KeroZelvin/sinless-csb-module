// scripts/hooks/pool-max-sync.js
// Keep pool max values (and computed mirrors) in sync with base stats + Spirit Map soul bonuses.

import { MOD_ID, num, propPath, readProps, resolveCanonicalActor } from "../api/_util.js";

const ATTR_KEYS = ["STR", "BOD", "WIL", "REA", "INT", "CHA", "chaQuarterPoolN"];

const SOUL_KEYS = {
  brawn: "soulBrawn",
  finesse: "soulFinesse",
  resolve: "soulResolve",
  focus: "soulFocus"
};

function int(x, fallback = 0) {
  return Math.floor(num(x, fallback));
}

function hasSoulProps(item) {
  const p = item?.system?.props ?? {};
  return (
    Object.prototype.hasOwnProperty.call(p, SOUL_KEYS.brawn) ||
    Object.prototype.hasOwnProperty.call(p, SOUL_KEYS.finesse) ||
    Object.prototype.hasOwnProperty.call(p, SOUL_KEYS.resolve) ||
    Object.prototype.hasOwnProperty.call(p, SOUL_KEYS.focus)
  );
}

function shouldIncludeActor(actor) {
  // Sinless rule: pools are a PC mechanic. Only refresh actors with a player owner.
  return !!actor?.hasPlayerOwner;
}

function computeSoulBonuses(actor) {
  const out = { brawn: 0, finesse: 0, resolve: 0, focus: 0 };
  for (const it of actor?.items ?? []) {
    const p = it?.system?.props ?? {};
    if (Object.prototype.hasOwnProperty.call(p, SOUL_KEYS.brawn)) {
      out.brawn += int(p[SOUL_KEYS.brawn], 0);
    }
    if (Object.prototype.hasOwnProperty.call(p, SOUL_KEYS.finesse)) {
      out.finesse += int(p[SOUL_KEYS.finesse], 0);
    }
    if (Object.prototype.hasOwnProperty.call(p, SOUL_KEYS.resolve)) {
      out.resolve += int(p[SOUL_KEYS.resolve], 0);
    }
    if (Object.prototype.hasOwnProperty.call(p, SOUL_KEYS.focus)) {
      out.focus += int(p[SOUL_KEYS.focus], 0);
    }
  }
  return {
    brawn: Math.max(0, out.brawn),
    finesse: Math.max(0, out.finesse),
    resolve: Math.max(0, out.resolve),
    focus: Math.max(0, out.focus)
  };
}

function computePools(actor) {
  const p = readProps(actor);

  const STR = int(p.STR, 0);
  const BOD = int(p.BOD, 0);
  const WIL = int(p.WIL, 0);
  const REA = int(p.REA, 0);
  const INT = int(p.INT, 0);
  const CHA = int(p.CHA, 0);

  const qN = int(p.chaQuarterPoolN, 0);
  const chaQ = Math.floor(CHA / 4);

  const baseBrawn = STR + Math.floor(BOD / 2) + Math.floor(WIL / 4) + (qN === 1 ? chaQ : 0);
  const baseFinesse = REA + Math.floor(BOD / 2) + Math.floor(INT / 4) + (qN === 2 ? chaQ : 0);
  const baseResolve = WIL + Math.floor(INT / 2) + Math.floor(CHA / 2) + (qN === 3 ? chaQ : 0);
  const baseFocus = INT + Math.floor(REA / 2) + Math.floor(WIL / 4) + (qN === 4 ? chaQ : 0);

  const soul = computeSoulBonuses(actor);

  return {
    brawn: Math.max(0, Math.floor(baseBrawn + soul.brawn)),
    finesse: Math.max(0, Math.floor(baseFinesse + soul.finesse)),
    resolve: Math.max(0, Math.floor(baseResolve + soul.resolve)),
    focus: Math.max(0, Math.floor(baseFocus + soul.focus))
  };
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

function buildUpdate(actor, pools) {
  const p = readProps(actor);
  const update = {};

  const setIfChanged = (key, value) => {
    const now = Math.floor(num(p?.[key], NaN));
    if (!Number.isFinite(now) || now !== value) update[propPath(key)] = value;
  };

  const adjustCur = (curKey, maxKey, newMax) => {
    const curNow = Math.floor(num(p?.[curKey], NaN));
    const maxNow = Math.floor(num(p?.[maxKey], NaN));
    if (!Number.isFinite(curNow)) return;

    if (Number.isFinite(maxNow) && newMax > maxNow) {
      const delta = newMax - maxNow;
      const next = Math.min(newMax, Math.max(0, Math.floor(curNow + delta)));
      if (next !== curNow) update[propPath(curKey)] = next;
      return;
    }

    if (curNow > newMax) update[propPath(curKey)] = Math.max(0, newMax);
  };

  setIfChanged("brawnComputed", pools.brawn);
  setIfChanged("finesseComputed", pools.finesse);
  setIfChanged("resolveComputed", pools.resolve);
  setIfChanged("focusComputed", pools.focus);

  setIfChanged("Brawn_Max", pools.brawn);
  setIfChanged("Finesse_Max", pools.finesse);
  setIfChanged("Resolve_Max", pools.resolve);
  setIfChanged("Focus_Max", pools.focus);

  // Adjust Cur by delta when Max increases; clamp down if Max decreases.
  adjustCur("Brawn_Cur", "Brawn_Max", pools.brawn);
  adjustCur("Finesse_Cur", "Finesse_Max", pools.finesse);
  adjustCur("Resolve_Cur", "Resolve_Max", pools.resolve);
  adjustCur("Focus_Cur", "Focus_Max", pools.focus);

  return update;
}

async function syncPoolsForActor(actor) {
  if (!actor || actor.documentName !== "Actor") return;
  if (!shouldIncludeActor(actor)) return;
  if (!game.user?.isGM && !actor.isOwner) return;

  const pools = computePools(actor);
  const update = buildUpdate(actor, pools);
  if (Object.keys(update).length === 0) return;

  await updateActorWithMirrors(actor, update);

  if (game.settings?.get?.(MOD_ID, "debugLogs")) {
    console.log("SinlessCSB | pool max sync", {
      actor: actor.name,
      update
    });
  }
}

function getParentActor(item) {
  const a = item?.parent ?? null;
  return (a?.documentName === "Actor") ? a : null;
}

export function registerPoolMaxSyncHooks() {
  Hooks.on("updateActor", (actor, changed) => {
    const p = changed?.system?.props ?? {};
    const relevant = ATTR_KEYS.some((k) => Object.prototype.hasOwnProperty.call(p, k));
    if (!relevant) return;
    syncPoolsForActor(actor).catch((e) =>
      console.warn("SinlessCSB | pool max sync (updateActor) failed", e)
    );
  });

  Hooks.on("createItem", (item) => {
    if (!hasSoulProps(item)) return;
    const actor = getParentActor(item);
    if (!actor) return;
    syncPoolsForActor(actor).catch((e) =>
      console.warn("SinlessCSB | pool max sync (createItem) failed", e)
    );
  });

  Hooks.on("updateItem", (item, changes) => {
    const actor = getParentActor(item);
    if (!actor) return;

    const p = changes?.system?.props ?? {};
    const relevantNested = Object.values(SOUL_KEYS).some((k) =>
      Object.prototype.hasOwnProperty.call(p, k)
    );
    const relevantFlat = Object.values(SOUL_KEYS).some((k) =>
      Object.prototype.hasOwnProperty.call(changes ?? {}, `system.props.${k}`)
    );
    const relevant = relevantNested || relevantFlat;
    if (!relevant && !hasSoulProps(item)) return;

    syncPoolsForActor(actor).catch((e) =>
      console.warn("SinlessCSB | pool max sync (updateItem) failed", e)
    );
  });

  Hooks.on("deleteItem", (item) => {
    if (!hasSoulProps(item)) return;
    const actor = getParentActor(item);
    if (!actor) return;
    syncPoolsForActor(actor).catch((e) =>
      console.warn("SinlessCSB | pool max sync (deleteItem) failed", e)
    );
  });

  Hooks.once("ready", () => {
    for (const a of game.actors?.contents ?? []) {
      if (!game.user?.isGM && !a.isOwner) continue;
      syncPoolsForActor(a).catch((e) =>
        console.warn("SinlessCSB | pool max sync (ready sweep) failed", e)
      );
    }
  });
}
