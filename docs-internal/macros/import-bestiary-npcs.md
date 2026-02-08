(async () => {
  const baseDir = "modules/sinlesscsb/docs-internal/templateJSONS/Bestiary";
  const categories = ["Goons", "Drones", "Spirits", "Programs", "Iniquitates", "Animals"];

  const npcRoot = game.folders?.find?.(f => f.type === "Actor" && f.name === "NPCs" && !f.folder) || null;
  if (!npcRoot) {
    ui.notifications?.error?.("Import Bestiary NPC JSONs: NPCs root folder not found. Run create-bestiary-npcs first.");
    return;
  }

  const FP = foundry?.applications?.apps?.FilePicker?.implementation || FilePicker;

  let updated = 0;
  let refreshed = 0;
  const missingFolders = [];
  const missingActors = [];
  const categorySummary = [];

  for (const category of categories) {
    const actorFolder = game.folders?.find?.(
      f => f.type === "Actor" && f.name === category && f.folder?.id === npcRoot.id
    ) || null;

    if (!actorFolder) {
      missingFolders.push(category);
      continue;
    }

    const actorsByName = new Map(
      (game.actors?.filter?.(a => a.folder?.id === actorFolder.id) ?? []).map(a => [a.name, a])
    );

    const categoryDir = `${baseDir}/${category}`;
    let files = [];
    try {
      const browse = await FP.browse("data", categoryDir);
      files = (browse?.files ?? []).filter(f => f.toLowerCase().endsWith(".json"));
    } catch (e) {
      console.warn(`Import Bestiary NPC JSONs: could not browse ${categoryDir}`, e);
      categorySummary.push(`${category}: 0`);
      continue;
    }

    let categoryUpdated = 0;

    for (const file of files) {
      let data;
      try {
        const res = await fetch(file);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        data = await res.json();
      } catch (e) {
        console.warn(`Import Bestiary NPC JSONs: failed to read ${file}`, e);
        continue;
      }

      const name = String(data?.name ?? "").trim();
      if (!name) continue;

      const actor = actorsByName.get(name);
      if (!actor) {
        missingActors.push(`${category}/${name}`);
        continue;
      }

      const p = data?.system?.props ?? {};
      const update = {};

      for (const [k, v] of Object.entries(p)) {
        if (k === "ActorUuid" || k === "actorUuid") continue;
        update[`system.props.${k}`] = v;
      }

      const flavor = data?.system?.header?.contents?.[0]?.value;
      if (typeof flavor === "string") {
        update["system.header.contents.0.value"] = flavor;
      }

      if (data?.img) {
        update.img = data.img;
      }

      update["prototypeToken.name"] = name;
      if (data?.prototypeToken?.texture?.src) {
        update["prototypeToken.texture.src"] = data.prototypeToken.texture.src;
      }

      await actor.update(update);
      updated += 1;
      categoryUpdated += 1;

      if (actor.sheet?.rendered) {
        actor.sheet.render(true);
        refreshed += 1;
      }
    }

    categorySummary.push(`${category}: ${categoryUpdated}`);
  }

  if (missingFolders.length) {
    ui.notifications?.warn?.(
      `Import Bestiary NPC JSONs: missing NPC subfolder(s) under NPCs: ${missingFolders.join(", ")}.`
    );
  }

  if (missingActors.length) {
    ui.notifications?.warn?.(
      `Import Bestiary NPC JSONs: ${missingActors.length} actor(s) not found in expected folders (see console).`
    );
    console.warn("Import Bestiary NPC JSONs missing actors:", missingActors);
  }

  ui.notifications?.info?.(
    `Import Bestiary NPC JSONs: updated ${updated} actor(s). Refreshed ${refreshed} open sheet(s). ${categorySummary.join(", ")}`
  );
})();
