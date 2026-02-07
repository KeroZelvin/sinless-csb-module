(async () => {
  const TEMPLATE_ID = "b2F3cWZSzUeZvam8";
  const TEMPLATE_NAME = "Cyberdeck Template";

  const itemNames = [
    "MasterDeck",
    "Shingo Activa",
    "Semi Point Razor",
    "Fujitsu Edge",
    "Orb Epsilon",
    "Orpheus Dreamweaver",
    "Royal Durandal"
  ];

  const template =
    game.items?.get?.(TEMPLATE_ID) ||
    game.items?.find?.(i => i?.name === TEMPLATE_NAME && i?.type === "_equippableItemTemplate") ||
    null;

  if (!template) {
    ui.notifications?.error?.(
      `Cyberdeck create: template not found. Expected id ${TEMPLATE_ID} or name "${TEMPLATE_NAME}".`
    );
    return;
  }

  let deckingFolder = game.folders?.find?.(f => f.type === "Item" && f.name === "Decking" && !f.folder) || null;
  if (!deckingFolder) {
    deckingFolder = await Folder.create({ name: "Decking", type: "Item" });
  }

  let cyberFolder = game.folders?.find?.(
    f => f.type === "Item" && f.name === "Cyberdecks" && f.folder?.id === deckingFolder.id
  ) || null;
  if (!cyberFolder) {
    cyberFolder = await Folder.create({ name: "Cyberdecks", type: "Item", folder: deckingFolder.id });
  }

  const existing = new Set(
    (game.items?.filter?.(i => i.folder?.id === cyberFolder.id) ?? []).map(i => i.name)
  );

  const toCreate = itemNames
    .filter(name => !existing.has(name))
    .map(name => ({
      name,
      type: "equippableItem",
      folder: cyberFolder.id,
      img: "modules/sinlesscsb/assets/icons/cpRed/gear/radar_detector.svg",
      system: {
        template: template.id,
        templateSystemUniqueVersion: template.system?.templateSystemUniqueVersion
      }
    }));

  if (!toCreate.length) {
    ui.notifications?.info?.("Cyberdeck create: all items already exist in Decking/Cyberdecks.");
    return;
  }

  await Item.createDocuments(toCreate);
  ui.notifications?.info?.(`Cyberdeck create: created ${toCreate.length} item(s) in Decking/Cyberdecks.`);
})();
