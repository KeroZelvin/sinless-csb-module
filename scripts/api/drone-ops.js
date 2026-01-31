// scripts/api/drone-ops.js
// SinlessCSB API — Drone ownership + deployment helpers (Foundry v13 + CSB v5)

import {
  MOD_ID,
  resolveActorForContext,
  resolveCanonicalActor,
  resolveItemDoc,
  propPath
} from "./_util.js";

const DRONE_HANGAR_NAME = "DroneHangar";
const DRONE_FOLDER_SUFFIX = " Drones";
const SOCKET_CHANNEL = `module.${MOD_ID}`;

const pendingRequests = new Map();
let socketBound = false;

function getFindItemDrone(item) {
  return String(item?.system?.props?.findItemdrone ?? "").trim();
}

function getFindDrone(actor) {
  return String(actor?.system?.props?.findDrone ?? "").trim();
}

function pickDroneOwnerUserId(ownerActor, fallbackUserId) {
  const users = game.users?.contents ?? [];

  const nonGmOwners = users.filter(u =>
    !u.isGM && (ownerActor?.ownership?.[u.id] ?? 0) >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER
  );

  if (fallbackUserId && nonGmOwners.some(u => u.id === fallbackUserId)) {
    return fallbackUserId;
  }

  if (nonGmOwners.length) return nonGmOwners[0].id;

  const fbUser = users.find(u => u.id === fallbackUserId);
  if (fbUser && !fbUser.isGM) return fbUser.id;

  return null;
}

function buildOwnership(ownerUserId) {
  const ownership = { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE };
  if (ownerUserId) ownership[ownerUserId] = CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER;

  for (const u of game.users?.contents ?? []) {
    if (u.isGM) ownership[u.id] = CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER;
  }

  return ownership;
}

async function getPilotActorUuid(ownerActor) {
  const canon = await resolveCanonicalActor(ownerActor);
  const props = canon?.system?.props ?? {};
  return String(props.ActorUuid ?? props.actorUuid ?? canon?.uuid ?? "").trim();
}

async function ensureDroneFolderForOwner(ownerActor, ownerUserId) {
  const canon = await resolveCanonicalActor(ownerActor);
  if (!canon) return null;

  const ownerUuid = await getPilotActorUuid(canon);
  if (!ownerUuid) return null;

  const folders = game.folders?.contents ?? [];
  const flagged = folders.find(f =>
    f.type === "Actor" && f.flags?.[MOD_ID]?.droneOwnerActorUuid === ownerUuid
  );
  if (flagged) return flagged;

  const name = `${canon.name}${DRONE_FOLDER_SUFFIX}`;
  const byName = folders.find(f => f.type === "Actor" && f.name === name);
  if (byName) return byName;

  try {
    return await Folder.create({
      name,
      type: "Actor",
      flags: {
        [MOD_ID]: {
          droneOwnerActorUuid: ownerUuid,
          droneOwnerUserId: ownerUserId || null
        }
      }
    });
  } catch (e) {
    console.warn("SinlessCSB | ensureDroneFolderForOwner failed", e);
    return null;
  }
}

async function findSourceDroneActor(findKey) {
  if (!findKey) return null;

  const actors = game.actors?.contents ?? [];
  const matches = actors.filter(a => getFindDrone(a) === findKey);
  if (!matches.length) return null;

  const hangarFolder = game.folders?.contents?.find(f => f.type === "Actor" && f.name === DRONE_HANGAR_NAME) ?? null;
  if (!hangarFolder) return matches[0];

  const inHangar = matches.filter(a => a.folder?.id === hangarFolder.id);
  return inHangar[0] ?? matches[0] ?? null;
}

async function updateItemDroneLink(item, droneActor, pilotUuid, findKey, ownerUserId) {
  if (!item?.update || !droneActor?.uuid) return;

  const update = {
    [`flags.${MOD_ID}.droneActorUuid`]: droneActor.uuid
  };

  if (pilotUuid) update[`flags.${MOD_ID}.droneOwnerActorUuid`] = pilotUuid;
  if (ownerUserId) update[`flags.${MOD_ID}.droneOwnerUserId`] = ownerUserId;
  if (findKey) update[`flags.${MOD_ID}.droneSourceFindDrone`] = findKey;

  try {
    await item.update(update);
  } catch (e) {
    console.warn("SinlessCSB | updateItemDroneLink failed", e);
  }
}

async function createOwnedDroneActor({ item, ownerActor, userId }) {
  const findKey = getFindItemDrone(item);
  if (!findKey) {
    ui.notifications?.warn?.("Drone item missing findItemdrone; cannot create owned drone.");
    return null;
  }

  const source = await findSourceDroneActor(findKey);
  if (!source) {
    ui.notifications?.error?.(`Drone source not found for findDrone "${findKey}" in ${DRONE_HANGAR_NAME}.`);
    return null;
  }

  const ownerUserId = pickDroneOwnerUserId(ownerActor, userId);
  const folder = await ensureDroneFolderForOwner(ownerActor, ownerUserId);
  const pilotUuid = await getPilotActorUuid(ownerActor);

  const data = source.toObject();
  delete data._id;
  delete data.id;

  data.name = String(item?.name ?? source?.name ?? "Drone").trim();
  if (folder?.id) data.folder = folder.id;
  data.ownership = buildOwnership(ownerUserId);

  data.flags = data.flags ?? {};
  data.flags[MOD_ID] = {
    ...(data.flags[MOD_ID] ?? {}),
    droneOwnerActorUuid: pilotUuid || ownerActor?.uuid || "",
    droneOwnerUserId: ownerUserId || null,
    droneSourceFindDrone: findKey,
    droneItemUuid: item?.uuid || ""
  };

  if (pilotUuid) {
    foundry.utils.setProperty(data, propPath("pilotActorUuid"), pilotUuid);
  }

  const created = await Actor.create(data, { renderSheet: false });
  if (!created) return null;

  await updateItemDroneLink(item, created, pilotUuid, findKey, ownerUserId);
  return created;
}

async function requestDroneCreateViaSocket({ itemUuid, actorUuid, userId }) {
  if (!game.socket?.emit) {
    ui.notifications?.error?.("SinlessCSB: socket unavailable; cannot request GM drone creation.");
    return null;
  }

  const requestId = (globalThis.crypto?.randomUUID?.() || foundry?.utils?.randomID?.() || `${Date.now()}-${Math.random()}`);

  const actorUuidOut = await new Promise((resolve) => {
    const timeout = setTimeout(() => {
      pendingRequests.delete(requestId);
      resolve(null);
    }, 15000);

    pendingRequests.set(requestId, { resolve, timeout });

    game.socket.emit(SOCKET_CHANNEL, {
      type: "droneCreateRequest",
      requestId,
      itemUuid,
      actorUuid,
      userId: userId || null
    });
  });

  if (!actorUuidOut) {
    ui.notifications?.warn?.("SinlessCSB: GM did not respond to drone creation request.");
    return null;
  }

  try {
    const doc = await fromUuid(actorUuidOut);
    return (doc?.documentName === "Actor") ? doc : null;
  } catch (_e) {
    return null;
  }
}

export function registerDroneSocketHandler() {
  if (socketBound) return;
  if (!game.socket?.on) return;
  socketBound = true;

  game.socket.on(SOCKET_CHANNEL, async (payload) => {
    if (!payload || payload.type == null) return;

    if (payload.type === "droneCreateResponse") {
      const pending = pendingRequests.get(payload.requestId);
      if (!pending) return;

      pendingRequests.delete(payload.requestId);
      try { clearTimeout(pending.timeout); } catch (_e) {}
      pending.resolve(payload.actorUuid ?? null);
      return;
    }

    if (payload.type !== "droneCreateRequest") return;

    if (!game.user?.isGM) return;
    const activeGm = game.users?.activeGM ?? null;
    if (activeGm && activeGm.id !== game.user.id) return;

    const { requestId, itemUuid, actorUuid, userId } = payload;
    let actorDoc = null;

    try {
      actorDoc = await ensureOwnedDroneForItem({
        itemUuid,
        actorUuid,
        userId,
        allowSocket: false
      });
    } catch (e) {
      console.warn("SinlessCSB | GM socket drone create failed", e);
    }

    game.socket.emit(SOCKET_CHANNEL, {
      type: "droneCreateResponse",
      requestId,
      actorUuid: actorDoc?.uuid ?? null,
      userId: userId || null
    });
  });
}

function gridCellKey(x, y, size) {
  const gx = Math.round(x / size);
  const gy = Math.round(y / size);
  return `${gx},${gy}`;
}

function findAdjacentSpawnPosition(anchor, scene, maxRadius = 3) {
  const gridSize = canvas?.grid?.size ?? 100;
  const baseX = anchor?.document?.x ?? 0;
  const baseY = anchor?.document?.y ?? 0;

  const occupied = new Set();
  for (const t of scene?.tokens?.contents ?? []) {
    const x = t?.x ?? t?.document?.x ?? 0;
    const y = t?.y ?? t?.document?.y ?? 0;
    occupied.add(gridCellKey(x, y, gridSize));
  }

  for (let r = 1; r <= maxRadius; r += 1) {
    const offsets = [];
    for (let dx = -r; dx <= r; dx += 1) {
      for (let dy = -r; dy <= r; dy += 1) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        offsets.push([dx, dy]);
      }
    }

    for (const [dx, dy] of offsets) {
      const x = baseX + dx * gridSize;
      const y = baseY + dy * gridSize;
      const key = gridCellKey(x, y, gridSize);
      if (occupied.has(key)) continue;
      return { x, y };
    }
  }

  // Fallback: place to the right of anchor
  return { x: baseX + gridSize, y: baseY };
}

export async function ensureOwnedDroneForItem({
  itemUuid,
  actorUuid,
  userId,
  allowSocket = true,
  forceCreate = false
} = {}) {
  const item = await resolveItemDoc({ itemUuid, actorUuid });
  if (!item || item.documentName !== "Item") {
    ui.notifications?.warn?.("SinlessCSB: could not resolve drone item.");
    return null;
  }

  const ownerActor = await resolveActorForContext({ scope: { actorUuid }, item });
  if (!ownerActor || ownerActor.documentName !== "Actor") {
    ui.notifications?.warn?.("SinlessCSB: could not resolve owning actor for drone item.");
    return null;
  }

  const findKey = getFindItemDrone(item);
  if (!findKey) {
    ui.notifications?.warn?.("Drone item missing findItemdrone; cannot create owned drone.");
    return null;
  }

  const existing = String(item.getFlag?.(MOD_ID, "droneActorUuid") ?? "").trim();
  if (!forceCreate && existing) {
    try {
      const doc = await fromUuid(existing);
      if (doc?.documentName === "Actor") return doc;
    } catch (_e) {}
  }

  try {
    return await createOwnedDroneActor({ item, ownerActor, userId });
  } catch (e) {
    if (!allowSocket) {
      console.warn("SinlessCSB | createOwnedDroneActor failed", e);
      return null;
    }

    return await requestDroneCreateViaSocket({
      itemUuid: item.uuid,
      actorUuid: ownerActor.uuid,
      userId: userId || null
    });
  }
}

export async function openOwnedDroneSheet({ itemUuid, actorUuid } = {}) {
  const item = await resolveItemDoc({ itemUuid, actorUuid });
  if (!item) {
    ui.notifications?.warn?.("SinlessCSB: could not resolve drone item.");
    return null;
  }

  const ownerActor = await resolveActorForContext({ scope: { actorUuid }, item });
  if (!ownerActor) {
    ui.notifications?.warn?.("SinlessCSB: could not resolve owning actor for drone item.");
    return null;
  }

  const droneActor = await ensureOwnedDroneForItem({
    itemUuid: item.uuid,
    actorUuid: ownerActor.uuid,
    userId: game.user?.id
  });

  if (!droneActor) return null;

  try {
    droneActor.sheet?.render?.(true);
  } catch (_e) {}

  return droneActor;
}

export async function deployOwnedDrone({ itemUuid, actorUuid } = {}) {
  const item = await resolveItemDoc({ itemUuid, actorUuid });
  if (!item) {
    ui.notifications?.warn?.("SinlessCSB: could not resolve drone item.");
    return null;
  }

  const ownerActor = await resolveActorForContext({ scope: { actorUuid }, item });
  if (!ownerActor) {
    ui.notifications?.warn?.("SinlessCSB: could not resolve owning actor for drone item.");
    return null;
  }

  const droneActor = await ensureOwnedDroneForItem({
    itemUuid: item.uuid,
    actorUuid: ownerActor.uuid,
    userId: game.user?.id
  });

  if (!droneActor) return null;

  const pilotUuid = await getPilotActorUuid(ownerActor);
  if (pilotUuid) {
    const current = String(droneActor?.system?.props?.pilotActorUuid ?? "").trim();
    if (current !== pilotUuid) {
      await droneActor.update({ [propPath("pilotActorUuid")]: pilotUuid });
    }
  }

  const anchor = canvas?.tokens?.controlled?.[0];
  if (!anchor) {
    ui.notifications?.warn?.("Select an actor token to spawn drone next to.");
    return null;
  }

  if (!canvas?.scene) {
    ui.notifications?.warn?.("No active scene available to spawn the drone.");
    return null;
  }

  const { x, y } = findAdjacentSpawnPosition(anchor, canvas.scene);

  const proto = droneActor.prototypeToken;
  const tokenData = proto?.toObject ? proto.toObject() : foundry.utils.deepClone(proto ?? {});

  tokenData.x = x;
  tokenData.y = y;
  tokenData.actorId = droneActor.id;
  tokenData.name = droneActor.name;

  await canvas.scene.createEmbeddedDocuments("Token", [tokenData]);
  return droneActor;
}
