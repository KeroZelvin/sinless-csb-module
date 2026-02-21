(async () => {
  const baseDir = "modules/sinlesscsb/docs-internal/templateJSONS/Resources";
  const normName = (s) => String(s ?? "").trim().toLowerCase();

  const brandFolder = game.folders?.find?.((f) => f.type === "Item" && f.name === "Brand" && !f.folder) || null;
  const resourcesFolder = game.folders?.find?.(
    (f) => f.type === "Item" && f.name === "Resources" && f.folder?.id === brandFolder?.id
  ) || null;

  if (!brandFolder || !resourcesFolder) {
    ui.notifications?.error?.("Import Resources: Brand/Resources folder not found. Run create-resources first.");
    return;
  }

  const folderItems = game.items?.filter?.((i) => i.folder?.id === resourcesFolder.id) ?? [];
  const itemsByName = new Map(folderItems.map((i) => [i.name, i]));
  const itemsByNameKey = new Map(folderItems.map((i) => [normName(i.name), i]));

  const FP = foundry?.applications?.apps?.FilePicker?.implementation || FilePicker;
  let files = [];
  try {
    const browse = await FP.browse("data", baseDir);
    files = (browse?.files ?? []).filter((f) => f.toLowerCase().endsWith(".json"));
  } catch (e) {
    console.error(e);
    ui.notifications?.error?.(`Import Resources: could not browse ${baseDir}.`);
    return;
  }

  const resourceFiles = files.filter((f) =>
    /fvtt-Item-resource-.*\.json$/i.test(String(f).split(/[\\/]/).pop() ?? "")
  );
  if (!resourceFiles.length) {
    ui.notifications?.warn?.(`Import Resources: no resource JSON files found in ${baseDir}.`);
    return;
  }

  let updated = 0;
  let refreshed = 0;
  const missing = [];

  for (const file of resourceFiles) {
    let data;
    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data = await res.json();
    } catch (e) {
      console.warn(`Import Resources: failed to read ${file}`, e);
      continue;
    }

    const name = String(data?.name ?? "").trim();
    if (!name) continue;

    const item = itemsByName.get(name) ?? itemsByNameKey.get(normName(name));
    if (!item) {
      missing.push(name);
      continue;
    }

    const p = data?.system?.props ?? {};
    const update = {
      "system.props.buildingTags": p.buildingTags ?? "",
      "system.props.mcA": p.mcA ?? "",
      "system.props.upA": p.upA ?? "",
      "system.props.mcB": p.mcB ?? "",
      "system.props.upB": p.upB ?? "",
      "system.props.mcC": p.mcC ?? "",
      "system.props.upC": p.upC ?? "",
      "system.props.mcD": p.mcD ?? "",
      "system.props.upD": p.upD ?? "",
      "system.props.mcE": p.mcE ?? "",
      "system.props.upE": p.upE ?? "",
      "system.props.resourceNotes": p.resourceNotes ?? "",
      "system.props.resourceXtra": p.resourceXtra ?? ""
    };

    if (item.name !== name) update.name = name;
    update.img = String(data?.img ?? "").trim() || item.img;

    await item.update(update);
    updated += 1;

    if (item.sheet?.rendered) {
      item.sheet.render(true);
      refreshed += 1;
    }
  }

  if (missing.length) {
    ui.notifications?.warn?.(
      `Import Resources: ${missing.length} item(s) not found in Brand/Resources (see console).`
    );
    console.warn("Import Resources missing items:", missing);
  }

  ui.notifications?.info?.(`Import Resources: updated ${updated} item(s). Refreshed ${refreshed} open sheet(s).`);
})();
