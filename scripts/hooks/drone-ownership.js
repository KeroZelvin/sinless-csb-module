// scripts/hooks/drone-ownership.js
// Auto-create owned rig assets (drones/vehicles) when rig items are added to actors.

import { MOD_ID } from "../api/_util.js";
import { ensureOwnedRigAssetForItem, registerDroneSocketHandler } from "../api/drone-ops.js";

export function registerDroneOwnershipHooks() {
  registerDroneSocketHandler();

  Hooks.on("createItem", (item, _options, userId) => {
    try {
      if (!game.settings?.get?.(MOD_ID, "enableAutomation")) return;
      if (!item?.parent || item.parent.documentName !== "Actor") return;

      // Only the initiating client should run creation logic.
      if (userId && game.user?.id && userId !== game.user.id) return;

      const findDrone = String(item?.system?.props?.findItemdrone ?? "").trim();
      const findVehicle = String(item?.system?.props?.findItemvehicle ?? "").trim();
      const rigType = findVehicle ? "vehicle" : (findDrone ? "drone" : null);
      if (!rigType) return;

      ensureOwnedRigAssetForItem({
        itemUuid: item.uuid,
        actorUuid: item.parent.uuid,
        userId: userId || game.user?.id,
        forceCreate: true,
        type: rigType
      }).catch((e) => console.warn("SinlessCSB | ensureOwnedRigAssetForItem(createItem) failed", e));
    } catch (e) {
      console.warn("SinlessCSB | createItem(rig) hook failed", e);
    }
  });
}
