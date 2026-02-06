(async () => {
  const TEMPLATE_ID = "GHO6zyIPQXdSYR8a";
  const TEMPLATE_NAME = "VehicleItems Template";

  const vehicles = [
    { name: "Skate", icon: "bike" },
    { name: "Motorcycle", icon: "bike" },
    { name: "Chopper", icon: "bike" },
    { name: "Battle Cycle", icon: "bike" },
    { name: "Racing Bike", icon: "bike" },
    { name: "Two-Seater", icon: "car" },
    { name: "Sports Sedan", icon: "car" },
    { name: "Sports Car", icon: "car" },
    { name: "Family Sedan", icon: "car" },
    { name: "Luxury Sedan", icon: "car" },
    { name: "Limo", icon: "car" },
    { name: "Pickup", icon: "truck" },
    { name: "Delivery Van", icon: "truck" },
    { name: "Luxury Van", icon: "truck" },
    { name: "Armored Car", icon: "military" },
    { name: "Small Boat", icon: "boat" },
    { name: "Speedboat", icon: "boat" },
    { name: "Patrol Boat", icon: "boat" },
    { name: "Nightwing", icon: "vtol" },
    { name: "Cessna", icon: "airplane" },
    { name: "Seaplane", icon: "airplane" },
    { name: "Cargo Heli", icon: "rotorcraft" },
    { name: "Transport Heli", icon: "rotorcraft" }
  ];

  const template =
    game.items?.get?.(TEMPLATE_ID) ||
    game.items?.find?.(i => i?.name === TEMPLATE_NAME && i?.type === "_equippableItemTemplate") ||
    null;

  if (!template) {
    ui.notifications?.error?.(
      `Vehicle item create: template not found. Expected id ${TEMPLATE_ID} or name "${TEMPLATE_NAME}".`
    );
    return;
  }

  let vehicleFolder = game.folders?.find?.(f => f.type === "Item" && f.name === "VehicleItems" && !f.folder) || null;
  if (!vehicleFolder) {
    vehicleFolder = await Folder.create({ name: "VehicleItems", type: "Item" });
  }

  const existing = new Set(
    (game.items?.filter?.(i => i.folder?.id === vehicleFolder.id) ?? []).map(i => i.name)
  );

  const toCreate = vehicles
    .filter(v => !existing.has(v.name))
    .map(v => {
      const img = `modules/sinlesscsb/assets/icons/SR5/importer/vehicle/${v.icon}.svg`;

      return {
        name: v.name,
        type: "equippableItem",
        folder: vehicleFolder.id,
        img,
        system: {
          template: template.id,
          templateSystemUniqueVersion: template.system?.templateSystemUniqueVersion
        }
      };
    });

  if (!toCreate.length) {
    ui.notifications?.info?.("Vehicle item create: all items already exist in VehicleItems.");
    return;
  }

  await Item.createDocuments(toCreate);
  ui.notifications?.info?.(`Vehicle item create: created ${toCreate.length} item(s) in VehicleItems.`);
})();
