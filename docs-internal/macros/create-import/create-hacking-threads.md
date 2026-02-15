(async () => {
  const TEMPLATE_ID = "8CMq8JmyHbRCglOv";
  const TEMPLATE_NAME = "Hacking Threads Template";

  const itemNames = [
    "Alert Monitor",
    "Crack Encryption",
    "Encrypt File",
    "Ghost Protocol",
    "Shadow Protocols",
    "Decoy",
    "Electric Strike",
    "Emotional Influence",
    "Situational Advantage",
    "Sonic Sickness",
    "Universal Translator",
    "Vent Gas"
  ];

  const template =
    game.items?.get?.(TEMPLATE_ID) ||
    game.items?.find?.(i => i?.name === TEMPLATE_NAME && i?.type === "_equippableItemTemplate") ||
    null;

  if (!template) {
    ui.notifications?.error?.(
      `Hacking Threads create: template not found. Expected id ${TEMPLATE_ID} or name "${TEMPLATE_NAME}".`
    );
    return;
  }

  let deckingFolder = game.folders?.find?.(f => f.type === "Item" && f.name === "Decking" && !f.folder) || null;
  if (!deckingFolder) {
    deckingFolder = await Folder.create({ name: "Decking", type: "Item" });
  }

  let hackingFolder = game.folders?.find?.(
    f => f.type === "Item" && f.name === "Hacking Threads" && f.folder?.id === deckingFolder.id
  ) || null;
  if (!hackingFolder) {
    hackingFolder = await Folder.create({ name: "Hacking Threads", type: "Item", folder: deckingFolder.id });
  }

  const existing = new Set(
    (game.items?.filter?.(i => i.folder?.id === hackingFolder.id) ?? []).map(i => i.name)
  );

  const toCreate = itemNames
    .filter(name => !existing.has(name))
    .map(name => ({
      name,
      type: "equippableItem",
      folder: hackingFolder.id,
      img: "modules/sinlesscsb/assets/icons/cpRed/default/Default_Program.svg",
      system: {
        template: template.id,
        templateSystemUniqueVersion: template.system?.templateSystemUniqueVersion
      }
    }));

  if (!toCreate.length) {
    ui.notifications?.info?.("Hacking Threads create: all items already exist in Decking/Hacking Threads.");
    return;
  }

  await Item.createDocuments(toCreate);
  ui.notifications?.info?.(`Hacking Threads create: created ${toCreate.length} item(s) in Decking/Hacking Threads.`);
})();
