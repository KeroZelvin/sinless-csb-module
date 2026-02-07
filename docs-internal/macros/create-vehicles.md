(async () => {
  const TEMPLATE_ID = "9YbyOSIZBhfekbLK";
  const TEMPLATE_NAME = "Vehicle Template";

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
    game.actors?.get?.(TEMPLATE_ID) ||
    game.actors?.find?.(a => a?.name === TEMPLATE_NAME && a?.type === "_template") ||
    null;

  if (!template) {
    ui.notifications?.error?.(
      `Vehicle create: template not found. Expected id ${TEMPLATE_ID} or name "${TEMPLATE_NAME}".`
    );
    return;
  }

  let hangarFolder = game.folders?.find?.(f => f.type === "Actor" && f.name === "VehicleHangar" && !f.folder) || null;
  if (!hangarFolder) {
    hangarFolder = await Folder.create({ name: "VehicleHangar", type: "Actor" });
  }

  const existing = new Set(
    (game.actors?.filter?.(a => a.folder?.id === hangarFolder.id) ?? []).map(a => a.name)
  );

  const toCreate = vehicles
    .filter(v => !existing.has(v.name))
    .map(v => {
      const img = `modules/sinlesscsb/assets/icons/SR5/importer/vehicle/${v.icon}.svg`;

      return {
        name: v.name,
        type: "character",
        folder: hangarFolder.id,
        img,
        prototypeToken: {
          name: v.name,
          texture: { src: img }
        },
        system: {
          template: template.id,
          templateSystemUniqueVersion: template.system?.templateSystemUniqueVersion
        }
      };
    });

  if (!toCreate.length) {
    ui.notifications?.info?.("Vehicle create: all vehicles already exist in VehicleHangar.");
    return;
  }

  await Actor.createDocuments(toCreate);
  ui.notifications?.info?.(`Vehicle create: created ${toCreate.length} vehicle(s) in VehicleHangar.`);
})();
