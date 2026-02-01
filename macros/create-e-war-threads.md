(async () => {
  const TEMPLATE_ID = "lBNLLAeL3gcJs2RQ";
  const TEMPLATE_NAME = "E War Threads Template";

  const itemNames = [
    "Acid Burn",
    "Analysis Locus",
    "Corrupt IFF",
    "De-Rez",
    "Device Control",
    "Hypnotic Projection",
    "Refraction Field",
    "Targeted Disruption",
    "Vermin Call"
  ];

  const template =
    game.items?.get?.(TEMPLATE_ID) ||
    game.items?.find?.(i => i?.name === TEMPLATE_NAME && i?.type === "_equippableItemTemplate") ||
    null;

  if (!template) {
    ui.notifications?.error?.(
      `E War Threads create: template not found. Expected id ${TEMPLATE_ID} or name "${TEMPLATE_NAME}".`
    );
    return;
  }

  let deckingFolder = game.folders?.find?.(f => f.type === "Item" && f.name === "Decking" && !f.folder) || null;
  if (!deckingFolder) {
    deckingFolder = await Folder.create({ name: "Decking", type: "Item" });
  }

  let ewarFolder = game.folders?.find?.(
    f => f.type === "Item" && f.name === "E War Threads" && f.folder?.id === deckingFolder.id
  ) || null;
  if (!ewarFolder) {
    ewarFolder = await Folder.create({ name: "E War Threads", type: "Item", folder: deckingFolder.id });
  }

  const existing = new Set(
    (game.items?.filter?.(i => i.folder?.id === ewarFolder.id) ?? []).map(i => i.name)
  );

  const toCreate = itemNames
    .filter(name => !existing.has(name))
    .map(name => ({
      name,
      type: "equippableItem",
      folder: ewarFolder.id,
      img: "modules/sinlesscsb/assets/icons/cpRed/default/Default_Program.svg",
      system: {
        template: template.id,
        templateSystemUniqueVersion: template.system?.templateSystemUniqueVersion
      }
    }));

  if (!toCreate.length) {
    ui.notifications?.info?.("E War Threads create: all items already exist in Decking/E War Threads.");
    return;
  }

  await Item.createDocuments(toCreate);
  ui.notifications?.info?.(`E War Threads create: created ${toCreate.length} item(s) in Decking/E War Threads.`);
})();
