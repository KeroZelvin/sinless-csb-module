// scripts/hooks/cyberdeck-single.js
// Enforce a single cyberdeck per actor.

const MOD_ID = "sinlesscsb";
const CYBERDECK_TEMPLATE = "b2F3cWZSzUeZvam8";

function isCyberdeckItem(data) {
  const tpl =
    data?.system?.template ??
    data?.system?.templateId ??
    data?.system?.props?.template ??
    null;
  return String(tpl ?? "").trim() === CYBERDECK_TEMPLATE;
}

function getParentActorFromItemData(item, context) {
  const actor = item?.parent ?? context?.parent ?? null;
  return (actor?.documentName === "Actor") ? actor : null;
}

export function registerCyberdeckSingleHooks() {
  Hooks.on("preCreateItem", (item, data, _options, _userId) => {
    if (!game.settings?.get?.(MOD_ID, "enableAutomation")) return true;
    if (!isCyberdeckItem(data)) return true;

    const actor = getParentActorFromItemData(item, data);
    if (!actor) return true;

    const existing = (actor.items ?? []).filter(i =>
      String(i?.system?.template ?? "").trim() === CYBERDECK_TEMPLATE
    );

    if (existing.length >= 1) {
      ui.notifications?.warn?.(
        "Only one CyberDeck may be used at a time, delete current deck to use a new one."
      );
      return false;
    }
    return true;
  });
}
