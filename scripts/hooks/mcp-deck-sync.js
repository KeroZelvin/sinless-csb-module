// scripts/hooks/mcp-deck-sync.js
// Maintain actor.system.props.mcpDeck (max) and mcpCur (clamped) from cyberdeck items

import { MOD_ID, num, propPath, readProps, resolveCanonicalActor } from "../api/_util.js";

const MCP_KEY = "mcpDeck";
const MCP_CUR_KEY = "mcpCur";

function int(x, fallback = 0) {
  return Math.floor(num(x, fallback));
}

function hasMcpProp(item) {
  const p = item?.system?.props ?? {};
  return Object.prototype.hasOwnProperty.call(p, MCP_KEY);
}

function computeMcpMax(actor) {
  let max = 0;
  for (const it of actor?.items ?? []) {
    const p = it?.system?.props ?? {};
    if (!Object.prototype.hasOwnProperty.call(p, MCP_KEY)) continue;
    const v = int(p[MCP_KEY], 0);
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

async function syncMcpForActor(actor) {
  if (!actor || actor.documentName !== "Actor") return;

  const props = readProps(actor);
  const current = int(props?.[MCP_KEY], 0);
  const next = computeMcpMax(actor);

  const curRaw = props?.[MCP_CUR_KEY];
  const curVal = Number.isFinite(Number(curRaw)) ? int(curRaw, 0) : next;
  const curNext = Math.min(curVal, next);

  const update = {};
  if (current != next) update[propPath(MCP_KEY)] = next;
  if (!Number.isFinite(Number(curRaw)) || curNext !== curVal) {
    update[propPath(MCP_CUR_KEY)] = curNext;
  }

  if (Object.keys(update).length === 0) return;
  await updateActorWithMirrors(actor, update);

  if (game.settings?.get?.(MOD_ID, "debugLogs")) {
    console.log("SinlessCSB | MCP deck sync", {
      actor: actor.name,
      current,
      next,
      cur: curVal,
      curNext
    });
  }
}

function getParentActor(item) {
  const a = item?.parent ?? null;
  return (a?.documentName === "Actor") ? a : null;
}

export function registerMcpDeckHooks() {
  Hooks.on("createItem", (item) => {
    const actor = getParentActor(item);
    if (!actor) return;
    if (!hasMcpProp(item)) return;
    syncMcpForActor(actor).catch((e) =>
      console.warn("SinlessCSB | MCP sync (createItem) failed", e)
    );
  });

  Hooks.on("updateItem", (item, changes) => {
    const actor = getParentActor(item);
    if (!actor) return;

    const changed = changes?.system?.props?.[MCP_KEY];
    if (!hasMcpProp(item) && changed === undefined) return;

    syncMcpForActor(actor).catch((e) =>
      console.warn("SinlessCSB | MCP sync (updateItem) failed", e)
    );
  });

  Hooks.on("deleteItem", (item) => {
    const actor = getParentActor(item);
    if (!actor) return;
    if (!hasMcpProp(item)) return;
    syncMcpForActor(actor).catch((e) =>
      console.warn("SinlessCSB | MCP sync (deleteItem) failed", e)
    );
  });

  Hooks.once("ready", () => {
    for (const a of game.actors?.contents ?? []) {
      if (!game.user?.isGM && !a.isOwner) continue;
      syncMcpForActor(a).catch((e) =>
        console.warn("SinlessCSB | MCP sync (ready sweep) failed", e)
      );
    }
  });
}
