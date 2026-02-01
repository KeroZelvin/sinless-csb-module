// scripts/hooks/software-slot-refresh.js
// Refresh actor sheets when softwareSlot changes so item displayers update immediately.

const MOD_ID = "sinlesscsb";
const SLOT_KEY = "softwareSlot";

function getParentActor(item) {
  const a = item?.parent ?? null;
  return (a?.documentName === "Actor") ? a : null;
}

function refreshActorSheets(actor) {
  try { actor?.sheet?.render?.(true); } catch (_e) {}
  for (const app of Object.values(actor?.apps ?? {})) {
    try { app?.render?.(true); } catch (_e) {}
  }
}

export function registerSoftwareSlotRefreshHooks() {
  Hooks.on("updateItem", (item, changes) => {
    if (!game.settings?.get?.(MOD_ID, "enableAutomation")) return;
    const changed = changes?.system?.props?.[SLOT_KEY];
    if (changed === undefined) return;

    const actor = getParentActor(item);
    if (!actor) return;

    refreshActorSheets(actor);
  });
}
