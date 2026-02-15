(async () => {
  const TEMPLATE_ID = "25Qy5a7maYi8KQOX";
  const TEMPLATE_NAME = "Rituals Template";

  const ritualNames = [
    "Break Ward",
    "Cottage Refuge",
    "Locating a Person",
    "Preservation",
    "Raise Ward",
    "Recall Device",
    "Sterilize",
    "Travel Over Distance",
    "Weather Protection"
  ];

  const template =
    game.items?.get?.(TEMPLATE_ID) ||
    game.items?.find?.(i => i?.name === TEMPLATE_NAME && i?.type === "_equippableItemTemplate") ||
    null;

  if (!template) {
    ui.notifications?.error?.(
      `Rituals create: template not found. Expected id ${TEMPLATE_ID} or name "${TEMPLATE_NAME}".`
    );
    return;
  }

  let manonFolder = game.folders?.find?.(f => f.type === "Item" && f.name === "Manon" && !f.folder) || null;
  if (!manonFolder) {
    manonFolder = await Folder.create({ name: "Manon", type: "Item" });
  }

  let ritualsFolder = game.folders?.find?.(
    f => f.type === "Item" && f.name === "Rituals" && f.folder?.id === manonFolder.id
  ) || null;
  if (!ritualsFolder) {
    ritualsFolder = await Folder.create({ name: "Rituals", type: "Item", folder: manonFolder.id });
  }

  const existing = new Set(
    (game.items?.filter?.(i => i.folder?.id === ritualsFolder.id) ?? []).map(i => i.name)
  );

  const toCreate = ritualNames
    .filter(name => !existing.has(name))
    .map(name => ({
      name,
      type: "equippableItem",
      folder: ritualsFolder.id,
      img: "modules/sinlesscsb/assets/icons/SR6/default/Default_Skill.svg",
      system: {
        template: template.id,
        templateSystemUniqueVersion: template.system?.templateSystemUniqueVersion
      }
    }));

  if (!toCreate.length) {
    ui.notifications?.info?.("Rituals create: all items already exist in Manon/Rituals.");
    return;
  }

  await Item.createDocuments(toCreate);
  ui.notifications?.info?.(`Rituals create: created ${toCreate.length} item(s) in Manon/Rituals.`);
})();
