(async () => {
  const baseDir = "modules/sinlesscsb/docs-internal/templateJSONS/Assets";
  const normName = (s) => String(s ?? "").trim().toLowerCase();

  const assetsFolder = game.folders?.find?.((f) => f.type === "Item" && f.name === "Assets" && !f.folder) || null;
  if (!assetsFolder) {
    ui.notifications?.error?.("Import Assets: Assets folder not found. Run create-assets first.");
    return;
  }

  const folderItems = game.items?.filter?.((i) => i.folder?.id === assetsFolder.id) ?? [];
  const itemsByName = new Map(folderItems.map((i) => [i.name, i]));
  const itemsByNameKey = new Map(folderItems.map((i) => [normName(i.name), i]));

  const FP = foundry?.applications?.apps?.FilePicker?.implementation || FilePicker;
  let files = [];
  try {
    const browse = await FP.browse("data", baseDir);
    files = (browse?.files ?? []).filter((f) => f.toLowerCase().endsWith(".json"));
  } catch (e) {
    console.error(e);
    ui.notifications?.error?.(`Import Assets: could not browse ${baseDir}.`);
    return;
  }

  if (!files.length) {
    ui.notifications?.warn?.(`Import Assets: no JSON files found in ${baseDir}.`);
    return;
  }

  let updated = 0;
  let refreshed = 0;
  const missing = [];

  for (const file of files) {
    let data;
    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data = await res.json();
    } catch (e) {
      console.warn(`Import Assets: failed to read ${file}`, e);
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
      "system.props.assetPic": p.assetPic ?? "",
      "system.props.assetEtiquette": p.assetEtiquette ?? "",
      "system.props.assetUpkeep": p.assetUpkeep ?? "",
      "system.props.assetPrice": p.assetPrice ?? "",
      "system.props.assetOp": p.assetOp ?? "",
      "system.props.assetSector": p.assetSector ?? "",
      "system.props.assetNotes": p.assetNotes ?? ""
    };
    if (item.name !== name) update.name = name;

    update.img = String(data?.img ?? "").trim();

    await item.update(update);
    updated += 1;

    if (item.sheet?.rendered) {
      item.sheet.render(true);
      refreshed += 1;
    }
  }

  if (missing.length) {
    ui.notifications?.warn?.(`Import Assets: ${missing.length} item(s) not found in Assets folder (see console).`);
    console.warn("Import Assets missing items:", missing);
  }

  ui.notifications?.info?.(`Import Assets: updated ${updated} item(s). Refreshed ${refreshed} open sheet(s).`);
})();
