// scripts/api/drone-ops.js
// SinlessCSB API — Drone ownership + deployment helpers (Foundry v13 + CSB v5)

import {
  MOD_ID,
  resolveActorForContext,
  resolveCanonicalActor,
  resolveItemDoc,
  propPath
} from "./_util.js";

const SOCKET_CHANNEL = `module.${MOD_ID}`;

const pendingRequests = new Map();
let socketBound = false;

const RIG_ASSET_TYPES = {
  drone: {
    itemFindKey: "findItemdrone",
    actorFindKey: "findDrone",
    hangarFolder: "DroneHangar",
    ownedFolderSuffix: " Drones",
    flagKey: "droneActorUuid"
  },
  vehicle: {
    itemFindKey: "findItemvehicle",
    actorFindKey: "findVehicle",
    hangarFolder: "VehicleHangar",
    ownedFolderSuffix: " Vehicles",
    flagKey: "vehicleActorUuid"
  }
};

function detectAssetTypeFromItem(item) {
  const props = item?.system?.props ?? {};
  if (String(props.findItemvehicle ?? "").trim()) return "vehicle";
  if (String(props.findItemdrone ?? "").trim()) return "drone";
  return null;
}

function getFindItemKey(item, type) {
  const key = RIG_ASSET_TYPES?.[type]?.itemFindKey;
  if (!key) return "";
  return String(item?.system?.props?.[key] ?? "").trim();
}

function getFindActorKey(actor, type) {
  const key = RIG_ASSET_TYPES?.[type]?.actorFindKey;
  if (!key) return "";
  return String(actor?.system?.props?.[key] ?? "").trim();
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

async function ensureRigFolderForOwner(ownerActor, ownerUserId, type) {
  const canon = await resolveCanonicalActor(ownerActor);
  if (!canon) return null;

  const ownerUuid = await getPilotActorUuid(canon);
  if (!ownerUuid) return null;

  const cfg = RIG_ASSET_TYPES?.[type];
  if (!cfg) return null;

  const folders = game.folders?.contents ?? [];
  const flagged = folders.find(f =>
    f.type === "Actor" &&
    f.flags?.[MOD_ID]?.rigOwnerActorUuid === ownerUuid &&
    f.flags?.[MOD_ID]?.rigType === type
  );
  if (flagged) return flagged;

  // Legacy drone folders
  if (type === "drone") {
    const legacy = folders.find(f =>
      f.type === "Actor" && f.flags?.[MOD_ID]?.droneOwnerActorUuid === ownerUuid
    );
    if (legacy) return legacy;
  }

  const name = `${canon.name}${cfg.ownedFolderSuffix}`;
  const byName = folders.find(f => f.type === "Actor" && f.name === name);
  if (byName) return byName;

  try {
    return await Folder.create({
      name,
      type: "Actor",
      flags: {
        [MOD_ID]: {
          rigOwnerActorUuid: ownerUuid,
          rigOwnerUserId: ownerUserId || null,
          rigType: type
        }
      }
    });
  } catch (e) {
    console.warn("SinlessCSB | ensureRigFolderForOwner failed", e);
    return null;
  }
}

async function findSourceRigActor(findKey, type) {
  if (!findKey) return null;
  const cfg = RIG_ASSET_TYPES?.[type];
  if (!cfg) return null;

  const actors = game.actors?.contents ?? [];
  const matches = actors.filter(a => getFindActorKey(a, type) === findKey);
  if (!matches.length) return null;

  const hangarFolder = game.folders?.contents?.find(f => f.type === "Actor" && f.name === cfg.hangarFolder) ?? null;
  if (!hangarFolder) return matches[0];

  const inHangar = matches.filter(a => a.folder?.id === hangarFolder.id);
  return inHangar[0] ?? matches[0] ?? null;
}

async function updateItemRigLink(item, rigActor, pilotUuid, findKey, ownerUserId, type) {
  if (!item?.update || !rigActor?.uuid) return;
  const cfg = RIG_ASSET_TYPES?.[type];
  if (!cfg) return;

  const update = {
    [`flags.${MOD_ID}.${cfg.flagKey}`]: rigActor.uuid,
    [`flags.${MOD_ID}.rigType`]: type
  };

  if (pilotUuid) update[`flags.${MOD_ID}.rigOwnerActorUuid`] = pilotUuid;
  if (ownerUserId) update[`flags.${MOD_ID}.rigOwnerUserId`] = ownerUserId;
  if (findKey) update[`flags.${MOD_ID}.rigSourceFindKey`] = findKey;

  if (type === "drone") {
    if (pilotUuid) update[`flags.${MOD_ID}.droneOwnerActorUuid`] = pilotUuid;
    if (ownerUserId) update[`flags.${MOD_ID}.droneOwnerUserId`] = ownerUserId;
    if (findKey) update[`flags.${MOD_ID}.droneSourceFindDrone`] = findKey;
  }

  try {
    await item.update(update);
  } catch (e) {
    console.warn("SinlessCSB | updateItemRigLink failed", e);
  }
}

async function createOwnedRigActor({ item, ownerActor, userId, type }) {
  const cfg = RIG_ASSET_TYPES?.[type];
  if (!cfg) return null;

  const findKey = getFindItemKey(item, type);
  if (!findKey) {
    ui.notifications?.warn?.("Rig item missing findItem* key; cannot create owned rig asset.");
    return null;
  }

  const source = await findSourceRigActor(findKey, type);
  if (!source) {
    ui.notifications?.error?.(`Rig source not found for ${cfg.actorFindKey} "${findKey}" in ${cfg.hangarFolder}.`);
    return null;
  }

  const ownerUserId = pickDroneOwnerUserId(ownerActor, userId);
  const folder = await ensureRigFolderForOwner(ownerActor, ownerUserId, type);
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
    rigOwnerActorUuid: pilotUuid || ownerActor?.uuid || "",
    rigOwnerUserId: ownerUserId || null,
    rigSourceFindKey: findKey,
    rigItemUuid: item?.uuid || "",
    rigType: type
  };

  if (type === "drone") {
    data.flags[MOD_ID].droneOwnerActorUuid = pilotUuid || ownerActor?.uuid || "";
    data.flags[MOD_ID].droneOwnerUserId = ownerUserId || null;
    data.flags[MOD_ID].droneSourceFindDrone = findKey;
  }

  if (pilotUuid) {
    foundry.utils.setProperty(data, propPath("pilotActorUuid"), pilotUuid);
  }

  const created = await Actor.create(data, { renderSheet: false });
  if (!created) return null;

  await updateItemRigLink(item, created, pilotUuid, findKey, ownerUserId, type);
  return created;
}

async function requestDroneCreateViaSocket({ itemUuid, actorUuid, userId, type }) {
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
      userId: userId || null,
      rigType: type || null
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

    const { requestId, itemUuid, actorUuid, userId, rigType } = payload;
    let actorDoc = null;

    try {
      actorDoc = await ensureOwnedRigAssetForItem({
        itemUuid,
        actorUuid,
        userId,
        allowSocket: false,
        type: rigType || null
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

export async function ensureOwnedRigAssetForItem({
  itemUuid,
  actorUuid,
  userId,
  allowSocket = true,
  forceCreate = false,
  type = null
} = {}) {
  const item = await resolveItemDoc({ itemUuid, actorUuid });
  if (!item || item.documentName !== "Item") {
    ui.notifications?.warn?.("SinlessCSB: could not resolve rig item.");
    return null;
  }

  const ownerActor = await resolveActorForContext({ scope: { actorUuid }, item });
  if (!ownerActor || ownerActor.documentName !== "Actor") {
    ui.notifications?.warn?.("SinlessCSB: could not resolve owning actor for rig item.");
    return null;
  }

  const resolvedType = type || detectAssetTypeFromItem(item);
  const cfg = RIG_ASSET_TYPES?.[resolvedType];
  if (!cfg) {
    ui.notifications?.warn?.("SinlessCSB: rig item missing findItem key (drone/vehicle).");
    return null;
  }

  const findKey = getFindItemKey(item, resolvedType);
  if (!findKey) {
    ui.notifications?.warn?.("SinlessCSB: rig item missing findItem key (drone/vehicle).");
    return null;
  }

  const existing = String(item.getFlag?.(MOD_ID, cfg.flagKey) ?? "").trim();
  if (!forceCreate && existing) {
    try {
      const doc = await fromUuid(existing);
      if (doc?.documentName === "Actor") return doc;
    } catch (_e) {}
  }

  try {
    return await createOwnedRigActor({ item, ownerActor, userId, type: resolvedType });
  } catch (e) {
    if (!allowSocket) {
      console.warn("SinlessCSB | createOwnedRigActor failed", e);
      return null;
    }

    return await requestDroneCreateViaSocket({
      itemUuid: item.uuid,
      actorUuid: ownerActor.uuid,
      userId: userId || null,
      type: resolvedType
    });
  }
}

export async function ensureOwnedDroneForItem(opts = {}) {
  return await ensureOwnedRigAssetForItem({ ...opts, type: "drone" });
}

export async function ensureOwnedVehicleForItem(opts = {}) {
  return await ensureOwnedRigAssetForItem({ ...opts, type: "vehicle" });
}

async function openOwnedRigAssetSheet({ itemUuid, actorUuid, type }) {
  const item = await resolveItemDoc({ itemUuid, actorUuid });
  if (!item) {
    ui.notifications?.warn?.("SinlessCSB: could not resolve rig item.");
    return null;
  }

  const ownerActor = await resolveActorForContext({ scope: { actorUuid }, item });
  if (!ownerActor) {
    ui.notifications?.warn?.("SinlessCSB: could not resolve owning actor for rig item.");
    return null;
  }

  const rigActor = await ensureOwnedRigAssetForItem({
    itemUuid: item.uuid,
    actorUuid: ownerActor.uuid,
    userId: game.user?.id,
    type
  });

  if (!rigActor) return null;

  try {
    rigActor.sheet?.render?.(true);
  } catch (_e) {}

  return rigActor;
}

export async function openOwnedDroneSheet({ itemUuid, actorUuid } = {}) {
  return await openOwnedRigAssetSheet({ itemUuid, actorUuid, type: "drone" });
}

export async function openOwnedVehicleSheet({ itemUuid, actorUuid } = {}) {
  return await openOwnedRigAssetSheet({ itemUuid, actorUuid, type: "vehicle" });
}

async function deployOwnedRigAsset({ itemUuid, actorUuid, type }) {
  const item = await resolveItemDoc({ itemUuid, actorUuid });
  if (!item) {
    ui.notifications?.warn?.("SinlessCSB: could not resolve rig item.");
    return null;
  }

  const ownerActor = await resolveActorForContext({ scope: { actorUuid }, item });
  if (!ownerActor) {
    ui.notifications?.warn?.("SinlessCSB: could not resolve owning actor for rig item.");
    return null;
  }

  const rigActor = await ensureOwnedRigAssetForItem({
    itemUuid: item.uuid,
    actorUuid: ownerActor.uuid,
    userId: game.user?.id,
    type
  });

  if (!rigActor) return null;

  const pilotUuid = await getPilotActorUuid(ownerActor);
  if (pilotUuid) {
    const current = String(rigActor?.system?.props?.pilotActorUuid ?? "").trim();
    if (current !== pilotUuid) {
      await rigActor.update({ [propPath("pilotActorUuid")]: pilotUuid });
    }
  }

  const anchor = canvas?.tokens?.controlled?.[0];
  if (!anchor) {
    ui.notifications?.warn?.("Select an actor token to spawn rig asset next to.");
    return null;
  }

  if (!canvas?.scene) {
    ui.notifications?.warn?.("No active scene available to spawn the rig asset.");
    return null;
  }

  const { x, y } = findAdjacentSpawnPosition(anchor, canvas.scene);

  const proto = rigActor.prototypeToken;
  const tokenData = proto?.toObject ? proto.toObject() : foundry.utils.deepClone(proto ?? {});

  tokenData.x = x;
  tokenData.y = y;
  tokenData.actorId = rigActor.id;
  tokenData.name = rigActor.name;

  await canvas.scene.createEmbeddedDocuments("Token", [tokenData]);
  return rigActor;
}

export async function deployOwnedDrone({ itemUuid, actorUuid } = {}) {
  return await deployOwnedRigAsset({ itemUuid, actorUuid, type: "drone" });
}

export async function deployOwnedVehicle({ itemUuid, actorUuid } = {}) {
  return await deployOwnedRigAsset({ itemUuid, actorUuid, type: "vehicle" });
}
