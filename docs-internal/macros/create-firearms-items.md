(async () => {
  const TEMPLATE_ID = "WpDhy1PMWFkO6tOc";
  const TEMPLATE_NAME = "Firearms Template";

  const itemNames = [
    "Syncsight Hunter",
    "Goliath TRGT-9 \"Target\"",
    "Warhammer H40mm-ER",
    "DV-662 Devotion",
    "KL-.89 Klaw",
    "Ironbark SMT",
    "Sentinel",
    "Reaper",
    "Kaos-9x",
    "Slimline Defender",
    "Viper",
    "450 Tek-Urban",
    "V-100 Vigilant",
    "Highwayman",
    "Defender",
    "Hardliner",
    "Tiger Beat",
    "Ripper",
    "Neon Fang",
    "Thunderbolt Vanguard",
    "Photon Reaver Ei-7"
  ];

  const template =
    game.items?.get?.(TEMPLATE_ID) ||
    game.items?.find?.(i => i?.name === TEMPLATE_NAME && i?.type === "_equippableItemTemplate") ||
    null;

  if (!template) {
    ui.notifications?.error?.(
      `Firearms item create: template not found. Expected id ${TEMPLATE_ID} or name "${TEMPLATE_NAME}".`
    );
    return;
  }

  let weaponsFolder = game.folders?.find?.(f => f.type === "Item" && f.name === "Weapons" && !f.folder) || null;
  if (!weaponsFolder) {
    weaponsFolder = await Folder.create({ name: "Weapons", type: "Item" });
  }

  let firearmsFolder = game.folders?.find?.(
    f => f.type === "Item" && f.name === "Firearms" && f.folder?.id === weaponsFolder.id
  ) || null;
  if (!firearmsFolder) {
    firearmsFolder = await Folder.create({ name: "Firearms", type: "Item", folder: weaponsFolder.id });
  }

  const existing = new Set(
    (game.items?.filter?.(i => i.folder?.id === firearmsFolder.id) ?? []).map(i => i.name)
  );

  const toCreate = itemNames
    .filter(name => !existing.has(name))
    .map(name => ({
      name,
      type: "equippableItem",
      folder: firearmsFolder.id,
      img: "icons/svg/item-bag.svg",
      system: {
        template: template.id,
        templateSystemUniqueVersion: template.system?.templateSystemUniqueVersion
      }
    }));

  if (!toCreate.length) {
    ui.notifications?.info?.("Firearms item create: all items already exist.");
    return;
  }

  await Item.createDocuments(toCreate);
  ui.notifications?.info?.(`Firearms item create: created ${toCreate.length} items in Weapons/Firearms.`);
})();
