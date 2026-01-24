(async () => {
  const TEMPLATE_ID = "beEN7M4Y3hg8U06n";
  const TEMPLATE_NAME = "Melee Weapon Template";

  const itemNames = [
    "Arm-Blades",
    "Axe",
    "Plasma Axe",
    "Vibroaxe",
    "Baton",
    "Brass Knuckles",
    "Cudgel",
    "Knife",
    "Katana",
    "Polearm",
    "Sickstick",
    "Staff",
    "Stun Baton",
    "Sword",
    "Vibrosword",
    "Plasma Sword",
    "Power Fist",
    "Monofilament Whip"
  ];

  const template =
    game.items?.get?.(TEMPLATE_ID) ||
    game.items?.find?.(i => i?.name === TEMPLATE_NAME && i?.type === "_equippableItemTemplate") ||
    null;

  if (!template) {
    ui.notifications?.error?.(
      `Melee item create: template not found. Expected id ${TEMPLATE_ID} or name "${TEMPLATE_NAME}".`
    );
    return;
  }

  let weaponsFolder = game.folders?.find?.(f => f.type === "Item" && f.name === "Weapons" && !f.folder) || null;
  if (!weaponsFolder) {
    weaponsFolder = await Folder.create({ name: "Weapons", type: "Item" });
  }

  let meleeFolder = game.folders?.find?.(
    f => f.type === "Item" && f.name === "Melee" && f.folder?.id === weaponsFolder.id
  ) || null;
  if (!meleeFolder) {
    meleeFolder = await Folder.create({ name: "Melee", type: "Item", folder: weaponsFolder.id });
  }

  const existing = new Set(
    (game.items?.filter?.(i => i.folder?.id === meleeFolder.id) ?? []).map(i => i.name)
  );

  const toCreate = itemNames
    .filter(name => !existing.has(name))
    .map(name => ({
      name,
      type: "equippableItem",
      folder: meleeFolder.id,
      img: "icons/svg/item-bag.svg",
      system: {
        template: template.id,
        templateSystemUniqueVersion: template.system?.templateSystemUniqueVersion
      }
    }));

  if (!toCreate.length) {
    ui.notifications?.info?.("Melee item create: all items already exist.");
    return;
  }

  await Item.createDocuments(toCreate);
  ui.notifications?.info?.(`Melee item create: created ${toCreate.length} items in Weapons/Melee.`);
})();
