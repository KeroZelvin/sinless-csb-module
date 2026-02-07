(async () => {
  const BALLISTIC_TEMPLATE_ID = "8L2WHN9Spx1TyIys";
  const BALLISTIC_TEMPLATE_NAME = "Drone Ballistic Template";
  const ENERGY_TEMPLATE_ID = "jM4PHhDREfU7OUZ4";
  const ENERGY_TEMPLATE_NAME = "Vehicle Energy Weapon Template";

  const items = [
    { name: "Oil Slick", templateId: BALLISTIC_TEMPLATE_ID },
    { name: "Machine Guns", templateId: BALLISTIC_TEMPLATE_ID },
    { name: "Autocannons", templateId: BALLISTIC_TEMPLATE_ID },
    { name: "25mm Cannon", templateId: BALLISTIC_TEMPLATE_ID },
    { name: "30mm Cannon", templateId: BALLISTIC_TEMPLATE_ID },
    { name: "Tank Cannon", templateId: BALLISTIC_TEMPLATE_ID },
    { name: "Vulcan Cannon", templateId: BALLISTIC_TEMPLATE_ID },
    { name: "Rocket Propelled Grenade Launcher", templateId: BALLISTIC_TEMPLATE_ID },
    { name: "Missile Launcher", templateId: BALLISTIC_TEMPLATE_ID },

    { name: "Pulse Cannon", templateId: ENERGY_TEMPLATE_ID },
    { name: "Tactical Tsunami", templateId: ENERGY_TEMPLATE_ID },
    { name: "Plasma Cannons", templateId: ENERGY_TEMPLATE_ID },
    { name: "Railgun", templateId: ENERGY_TEMPLATE_ID },
    { name: "Particle Projection Cannon", templateId: ENERGY_TEMPLATE_ID }
  ];

  const templateById = new Map();

  const ballisticTemplate =
    game.items?.get?.(BALLISTIC_TEMPLATE_ID) ||
    game.items?.find?.(i => i?.name === BALLISTIC_TEMPLATE_NAME && i?.type === "_equippableItemTemplate") ||
    null;

  const energyTemplate =
    game.items?.get?.(ENERGY_TEMPLATE_ID) ||
    game.items?.find?.(i => i?.name === ENERGY_TEMPLATE_NAME && i?.type === "_equippableItemTemplate") ||
    null;

  if (!ballisticTemplate || !energyTemplate) {
    ui.notifications?.error?.("Vehicle weapons create: missing ballistic or energy template.");
    return;
  }

  templateById.set(BALLISTIC_TEMPLATE_ID, ballisticTemplate);
  templateById.set(ENERGY_TEMPLATE_ID, energyTemplate);

  let weaponsFolder = game.folders?.find?.(f => f.type === "Item" && f.name === "Weapons" && !f.folder) || null;
  if (!weaponsFolder) {
    weaponsFolder = await Folder.create({ name: "Weapons", type: "Item" });
  }

  let vehicleFolder = game.folders?.find?.(
    f => f.type === "Item" && f.name === "Vehicle Weapons" && f.folder?.id === weaponsFolder.id
  ) || null;
  if (!vehicleFolder) {
    vehicleFolder = await Folder.create({ name: "Vehicle Weapons", type: "Item", folder: weaponsFolder.id });
  }

  const existing = new Set(
    (game.items?.filter?.(i => i.folder?.id === vehicleFolder.id) ?? []).map(i => i.name)
  );

  const toCreate = items
    .filter(i => !existing.has(i.name))
    .map(i => {
      const tmpl = templateById.get(i.templateId);
      return {
        name: i.name,
        type: "equippableItem",
        folder: vehicleFolder.id,
        img: "icons/svg/item-bag.svg",
        system: {
          template: tmpl.id,
          templateSystemUniqueVersion: tmpl.system?.templateSystemUniqueVersion
        }
      };
    });

  if (!toCreate.length) {
    ui.notifications?.info?.("Vehicle weapons create: all items already exist in Weapons/Vehicle Weapons.");
    return;
  }

  await Item.createDocuments(toCreate);
  ui.notifications?.info?.(`Vehicle weapons create: created ${toCreate.length} item(s) in Weapons/Vehicle Weapons.`);
})();
