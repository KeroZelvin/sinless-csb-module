(async () => {
  const baseDir = "modules/sinlesscsb/docs-internal/templateJSONS/Magic/Rituals";

  const manonFolder = game.folders?.find?.(f => f.type === "Item" && f.name === "Manon" && !f.folder) || null;
  const ritualsFolder = game.folders?.find?.(
    f => f.type === "Item" && f.name === "Rituals" && f.folder?.id === manonFolder?.id
  ) || null;

  if (!manonFolder || !ritualsFolder) {
    ui.notifications?.error?.("Import Rituals: Manon/Rituals folder not found. Run create-rituals first.");
    return;
  }

  const itemsByName = new Map(
    (game.items?.filter?.(i => i.folder?.id === ritualsFolder.id) ?? []).map(i => [i.name, i])
  );

  let files = [];
  const FP = foundry?.applications?.apps?.FilePicker?.implementation || FilePicker;
  try {
    const browse = await FP.browse("data", baseDir);
    files = (browse?.files ?? []).filter(f => f.toLowerCase().endsWith(".json"));
  } catch (e) {
    console.error(e);
    ui.notifications?.error?.(`Import Rituals: could not browse ${baseDir}.`);
    return;
  }

  if (!files.length) {
    ui.notifications?.warn?.(`Import Rituals: no JSON files found in ${baseDir}.`);
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
      console.warn(`Import Rituals: failed to read ${file}`, e);
      continue;
    }

    const name = String(data?.name ?? "").trim();
    if (!name) continue;

    const item = itemsByName.get(name);
    if (!item) {
      missing.push(name);
      continue;
    }

    const p = data?.system?.props ?? {};
    const update = {
      "system.props.ritualDrain": p.ritualDrain ?? "",
      "system.props.ritualRulestext": p.ritualRulestext ?? ""
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

  if (missing.length) {
    ui.notifications?.warn?.(
      `Import Rituals: ${missing.length} item(s) not found in Manon/Rituals (see console).`
    );
    console.warn("Import Rituals missing items:", missing);
  }

  ui.notifications?.info?.(`Import Rituals: updated ${updated} item(s). Refreshed ${refreshed} open sheet(s).`);
})();
