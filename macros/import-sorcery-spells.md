(async () => {
  const baseDir = "modules/sinlesscsb/docs-internal/templateJSONS/Magic/Sorcery";

  const groupDirs = [
    { name: "Incantor", dir: "Incantor" },
    { name: "Auralurgy", dir: "Auralurgy" },
    { name: "Mentalism", dir: "Mentalism" },
    { name: "Astral Umbra", dir: "AstralUmbra" },
    { name: "The Bound", dir: "TheBound" }
  ];

  const FP = foundry?.applications?.apps?.FilePicker?.implementation || FilePicker;

  let updated = 0;
  let refreshed = 0;
  const missing = [];

  for (const group of groupDirs) {
    const groupFolder = game.folders?.find?.(
      f => f.type === "Item" && f.name === group.name && !f.folder
    ) || null;

    if (!groupFolder) {
      ui.notifications?.warn?.(`Import Sorcery Spells: folder Items/${group.name} not found.`);
      continue;
    }

    const itemsByName = new Map(
      (game.items?.filter?.(i => i.folder?.id === groupFolder.id) ?? []).map(i => [i.name, i])
    );

    let files = [];
    try {
      const browse = await FP.browse("data", `${baseDir}/${group.dir}`);
      files = (browse?.files ?? []).filter(f => f.toLowerCase().endsWith(".json"));
    } catch (e) {
      console.error(e);
      ui.notifications?.error?.(`Import Sorcery Spells: could not browse ${baseDir}/${group.dir}.`);
      continue;
    }

    if (!files.length) {
      ui.notifications?.warn?.(`Import Sorcery Spells: no JSON files found in ${baseDir}/${group.dir}.`);
      continue;
    }

    for (const file of files) {
      let data;
      try {
        const res = await fetch(file);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        data = await res.json();
      } catch (e) {
        console.warn(`Import Sorcery Spells: failed to read ${file}`, e);
        continue;
      }

      const name = String(data?.name ?? "").trim();
      if (!name) continue;

      const item = itemsByName.get(name);
      if (!item) {
        missing.push(`${group.name}: ${name}`);
        continue;
      }

      const p = data?.system?.props ?? {};
      const update = {
        "system.props.forceCost": p.forceCost ?? "",
        "system.props.spellResistance": p.spellResistance ?? "",
        "system.props.spellDuration": p.spellDuration ?? "",
        "system.props.drainFormula": p.drainFormula ?? "",
        "system.props.spellRulestext": p.spellRulestext ?? "",
        "system.props.spellCategory": p.spellCategory ?? group.name,
        "system.props.spellTags": p.spellTags ?? "",
        "system.props.actionLabel": p.actionLabel ?? "Cast"
      };

      if (data?.img) {
        update.img = data.img;
      }

      await item.update(update);
      updated += 1;

      if (item.sheet?.rendered) {
        item.sheet.render(true);
        refreshed += 1;
      }
    }
  }

  if (missing.length) {
    ui.notifications?.warn?.(
      `Import Sorcery Spells: ${missing.length} item(s) not found in top-level school folders (see console).`
    );
    console.warn("Import Sorcery Spells missing items:", missing);
  }

  ui.notifications?.info?.(
    `Import Sorcery Spells: updated ${updated} item(s). Refreshed ${refreshed} open sheet(s).`
  );
})();
