(async () => {
  const TEMPLATE_ID = "694838d341f4407b";
  const TEMPLATE_NAME = "Sinless NPC";
  const baseDir = "modules/sinlesscsb/docs-internal/templateJSONS/Bestiary";
  const categories = ["Goons", "Drones", "Spirits", "Programs", "Iniquitates", "Animals"];

  const template =
    game.actors?.get?.(TEMPLATE_ID) ||
    game.actors?.find?.(a => a?.name === TEMPLATE_NAME && a?.type === "_template") ||
    null;

  if (!template) {
    ui.notifications?.error?.(
      `Bestiary create: template not found. Expected id ${TEMPLATE_ID} or name "${TEMPLATE_NAME}".`
    );
    return;
  }

  let npcRoot = game.folders?.find?.(f => f.type === "Actor" && f.name === "NPCs" && !f.folder) || null;
  if (!npcRoot) {
    npcRoot = await Folder.create({ name: "NPCs", type: "Actor" });
  }

  const FP = foundry?.applications?.apps?.FilePicker?.implementation || FilePicker;

  let totalCreated = 0;
  const categorySummary = [];

  for (const category of categories) {
    let categoryFolder = game.folders?.find?.(
      f => f.type === "Actor" && f.name === category && f.folder?.id === npcRoot.id
    ) || null;

    if (!categoryFolder) {
      categoryFolder = await Folder.create({ name: category, type: "Actor", folder: npcRoot.id });
    }

    const categoryDir = `${baseDir}/${category}`;
    let files = [];
    try {
      const browse = await FP.browse("data", categoryDir);
      files = (browse?.files ?? []).filter(f => f.toLowerCase().endsWith(".json"));
    } catch (e) {
      console.warn(`Bestiary create: could not browse ${categoryDir}`, e);
      categorySummary.push(`${category}: 0`);
      continue;
    }

    const existing = new Set(
      (game.actors?.filter?.(a => a.folder?.id === categoryFolder.id) ?? []).map(a => a.name)
    );

    const toCreate = [];

    for (const file of files) {
      let data;
      try {
        const res = await fetch(file);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        data = await res.json();
      } catch (e) {
        console.warn(`Bestiary create: failed to read ${file}`, e);
        continue;
      }

      const name = String(data?.name ?? "").trim();
      if (!name || existing.has(name)) continue;

      const img = data?.img || "icons/svg/mystery-man.svg";
      toCreate.push({
        name,
        type: "character",
        folder: categoryFolder.id,
        img,
        prototypeToken: {
          name,
          texture: { src: img }
        },
        system: {
          template: template.id,
          templateSystemUniqueVersion: template.system?.templateSystemUniqueVersion
        }
      });
    }

    if (toCreate.length) {
      await Actor.createDocuments(toCreate);
    }

    totalCreated += toCreate.length;
    categorySummary.push(`${category}: ${toCreate.length}`);
  }

  if (!totalCreated) {
    ui.notifications?.info?.("Bestiary create: all NPC actors already exist in NPCs/<Category> folders.");
    return;
  }

  ui.notifications?.info?.(
    `Bestiary create: created ${totalCreated} actor(s). ${categorySummary.join(", ")}`
  );
})();
