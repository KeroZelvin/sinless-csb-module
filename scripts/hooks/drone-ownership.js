// scripts/hooks/drone-ownership.js
// Auto-create owned drone actors when drone items are added to actors.

import { MOD_ID } from "../api/_util.js";
import { ensureOwnedDroneForItem, registerDroneSocketHandler } from "../api/drone-ops.js";

export function registerDroneOwnershipHooks() {
  registerDroneSocketHandler();

  Hooks.on("createItem", (item, _options, userId) => {
    try {
      if (!game.settings?.get?.(MOD_ID, "enableAutomation")) return;
      if (!item?.parent || item.parent.documentName !== "Actor") return;

      // Only the initiating client should run creation logic.
      if (userId && game.user?.id && userId !== game.user.id) return;

      const findKey = String(item?.system?.props?.findItemdrone ?? "").trim();
      if (!findKey) return;

      ensureOwnedDroneForItem({
        itemUuid: item.uuid,
        actorUuid: item.parent.uuid,
        userId: userId || game.user?.id,
        forceCreate: true
      }).catch((e) => console.warn("SinlessCSB | ensureOwnedDroneForItem(createItem) failed", e));
    } catch (e) {
      console.warn("SinlessCSB | createItem(drone) hook failed", e);
    }
  });
}
