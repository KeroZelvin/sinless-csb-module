(async () => {
  const TEMPLATE_ID = "UOzfdwCey4axeP6O";
  const TEMPLATE_NAME = "DroneItems Template";

  const drones = [
    { name: "Bug-Spy", frame: "Micro" },
    { name: "Disc", frame: "Micro" },
    { name: "Orb", frame: "Mini" },
    { name: "VSTOL Bird", frame: "Mini" },
    { name: "Roto-Drone", frame: "Small" },
    { name: "Shield Drone", frame: "Small" },
    { name: "Dog-Patrol Drone", frame: "Small" },
    { name: "Anthrodroid", frame: "Small" },
    { name: "Mobile Sentinel", frame: "Medium" },
    { name: "Hawk", frame: "Medium" },
    { name: "Shield-Wall Drone", frame: "Medium" },
    { name: "Anthrobrute", frame: "Medium" },
    { name: "Gladiator", frame: "Large" },
    { name: "Aerial Warden", frame: "Large" }
  ];

  const iconByFrame = {
    Micro: "micro",
    Mini: "mini",
    Small: "small",
    Medium: "medium",
    Large: "large"
  };

  const template =
    game.items?.get?.(TEMPLATE_ID) ||
    game.items?.find?.(i => i?.name === TEMPLATE_NAME && i?.type === "_equippableItemTemplate") ||
    null;

  if (!template) {
    ui.notifications?.error?.(
      `Drone item create: template not found. Expected id ${TEMPLATE_ID} or name "${TEMPLATE_NAME}".`
    );
    return;
  }

  let droneFolder = game.folders?.find?.(f => f.type === "Item" && f.name === "DroneItems" && !f.folder) || null;
  if (!droneFolder) {
    droneFolder = await Folder.create({ name: "DroneItems", type: "Item" });
  }

  const existing = new Set(
    (game.items?.filter?.(i => i.folder?.id === droneFolder.id) ?? []).map(i => i.name)
  );

  const toCreate = drones
    .filter(d => !existing.has(d.name))
    .map(d => {
      const icon = iconByFrame[d.frame] || "small";
      const img = `modules/sinlesscsb/assets/icons/SR5/importer/drone/${icon}.svg`;

      return {
        name: d.name,
        type: "equippableItem",
        folder: droneFolder.id,
        img,
        system: {
          template: template.id,
          templateSystemUniqueVersion: template.system?.templateSystemUniqueVersion
        }
      };
    });

  if (!toCreate.length) {
    ui.notifications?.info?.("Drone item create: all items already exist in DroneItems.");
    return;
  }

  await Item.createDocuments(toCreate);
  ui.notifications?.info?.(`Drone item create: created ${toCreate.length} item(s) in DroneItems.`);
})();
