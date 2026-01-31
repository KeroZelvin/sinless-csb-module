(async () => {
  const BALLISTIC_TEMPLATE_ID = "8L2WHN9Spx1TyIys";
  const BALLISTIC_TEMPLATE_NAME = "Drone Ballistic Template";
  const ENERGY_TEMPLATE_ID = "lOAPMavVjtRre3OI";
  const ENERGY_TEMPLATE_NAME = "Drone Energy Weapon Template";

  const items = [
    { name: "Missile Launcher", templateId: BALLISTIC_TEMPLATE_ID },
    { name: "Sentry Gun*", templateId: BALLISTIC_TEMPLATE_ID },
    { name: "Recoilless Gun", templateId: BALLISTIC_TEMPLATE_ID },
    { name: "Mini gun", templateId: BALLISTIC_TEMPLATE_ID },
    { name: "Grenade Launcher", templateId: BALLISTIC_TEMPLATE_ID },
    { name: "Autocannon", templateId: BALLISTIC_TEMPLATE_ID },
    { name: "Recoilless Rifle", templateId: BALLISTIC_TEMPLATE_ID },
    { name: "Oil Slick", templateId: BALLISTIC_TEMPLATE_ID },
    { name: "Smokescreen", templateId: BALLISTIC_TEMPLATE_ID },

    { name: "Dazzleray", templateId: ENERGY_TEMPLATE_ID },
    { name: "Heavy Swell", templateId: ENERGY_TEMPLATE_ID },
    { name: "Sonic Disruption", templateId: ENERGY_TEMPLATE_ID },
    { name: "Pulse Rifle", templateId: ENERGY_TEMPLATE_ID },
    { name: "Pulse Minigun", templateId: ENERGY_TEMPLATE_ID },
    { name: "Railgun", templateId: ENERGY_TEMPLATE_ID },
    { name: "Particle Projectile Cannon", templateId: ENERGY_TEMPLATE_ID }
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
    ui.notifications?.error?.("Drone weapons create: missing ballistic or energy template.");
    return;
  }

  templateById.set(BALLISTIC_TEMPLATE_ID, ballisticTemplate);
  templateById.set(ENERGY_TEMPLATE_ID, energyTemplate);

  let weaponsFolder = game.folders?.find?.(f => f.type === "Item" && f.name === "Weapons" && !f.folder) || null;
  if (!weaponsFolder) {
    weaponsFolder = await Folder.create({ name: "Weapons", type: "Item" });
  }

  let droneFolder = game.folders?.find?.(
    f => f.type === "Item" && f.name === "Drone Weapons" && f.folder?.id === weaponsFolder.id
  ) || null;
  if (!droneFolder) {
    droneFolder = await Folder.create({ name: "Drone Weapons", type: "Item", folder: weaponsFolder.id });
  }

  const existing = new Set(
    (game.items?.filter?.(i => i.folder?.id === droneFolder.id) ?? []).map(i => i.name)
  );

  const toCreate = items
    .filter(i => !existing.has(i.name))
    .map(i => {
      const tmpl = templateById.get(i.templateId);
      return {
        name: i.name,
        type: "equippableItem",
        folder: droneFolder.id,
        img: "icons/svg/item-bag.svg",
        system: {
          template: tmpl.id,
          templateSystemUniqueVersion: tmpl.system?.templateSystemUniqueVersion
        }
      };
    });

  if (!toCreate.length) {
    ui.notifications?.info?.("Drone weapons create: all items already exist in Weapons/Drone Weapons.");
    return;
  }

  await Item.createDocuments(toCreate);
  ui.notifications?.info?.(`Drone weapons create: created ${toCreate.length} item(s) in Weapons/Drone Weapons.`);
})();
