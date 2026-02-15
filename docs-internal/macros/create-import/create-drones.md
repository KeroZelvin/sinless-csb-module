(async () => {
  const TEMPLATE_ID = "lL9MiN64F7mRGhuj";
  const TEMPLATE_NAME = "Drone Template";

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
    game.actors?.get?.(TEMPLATE_ID) ||
    game.actors?.find?.(a => a?.name === TEMPLATE_NAME && a?.type === "_template") ||
    null;

  if (!template) {
    ui.notifications?.error?.(
      `Drone create: template not found. Expected id ${TEMPLATE_ID} or name "${TEMPLATE_NAME}".`
    );
    return;
  }

  let hangarFolder = game.folders?.find?.(f => f.type === "Actor" && f.name === "DroneHangar" && !f.folder) || null;
  if (!hangarFolder) {
    hangarFolder = await Folder.create({ name: "DroneHangar", type: "Actor" });
  }

  const existing = new Set(
    (game.actors?.filter?.(a => a.folder?.id === hangarFolder.id) ?? []).map(a => a.name)
  );

  const toCreate = drones
    .filter(d => !existing.has(d.name))
    .map(d => {
      const icon = iconByFrame[d.frame] || "small";
      const img = `modules/sinlesscsb/assets/icons/SR5/importer/drone/${icon}.svg`;

      return {
        name: d.name,
        type: "character",
        folder: hangarFolder.id,
        img,
        prototypeToken: {
          name: d.name,
          texture: { src: img }
        },
        system: {
          template: template.id,
          templateSystemUniqueVersion: template.system?.templateSystemUniqueVersion
        }
      };
    });

  if (!toCreate.length) {
    ui.notifications?.info?.("Drone create: all drones already exist in DroneHangar.");
    return;
  }

  await Actor.createDocuments(toCreate);
  ui.notifications?.info?.(`Drone create: created ${toCreate.length} drone(s) in DroneHangar.`);
})();
