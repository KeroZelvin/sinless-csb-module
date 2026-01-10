%{
  const doc = linkedEntity ?? entity;         // row vs item sheet
  const itemUuid = String(doc?.uuid ?? "");
  if (!itemUuid) {
    ui.notifications?.warn("Cast Spell: no item context (linkedEntity/entity missing).");
    return "";
  }

  game.modules.get("sinlesscsb")?.api?.castSpell?.({ itemUuid });
  return "";
}%