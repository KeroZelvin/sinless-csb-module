(async () => {
  const baseDir = "modules/sinlesscsb/docs-internal/templateJSONS/Magic/Amplification";

  const manonFolder = game.folders?.find?.(f => f.type === "Item" && f.name === "Manon" && !f.folder) || null;
  const ampFolder = game.folders?.find?.(
    f => f.type === "Item" && f.name === "Amplification" && f.folder?.id === manonFolder?.id
  ) || null;

  if (!manonFolder || !ampFolder) {
    ui.notifications?.error?.("Import Amps: Manon/Amplification folder not found. Run create-amps first.");
    return;
  }

  const itemsByName = new Map(
    (game.items?.filter?.(i => i.folder?.id === ampFolder.id) ?? []).map(i => [i.name, i])
  );

  let files = [];
  const FP = foundry?.applications?.apps?.FilePicker?.implementation || FilePicker;
  try {
    const browse = await FP.browse("data", baseDir);
    files = (browse?.files ?? []).filter(f => f.toLowerCase().endsWith(".json"));
  } catch (e) {
    console.error(e);
    ui.notifications?.error?.(`Import Amps: could not browse ${baseDir}.`);
    return;
  }

  if (!files.length) {
    ui.notifications?.warn?.(`Import Amps: no JSON files found in ${baseDir}.`);
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
      console.warn(`Import Amps: failed to read ${file}`, e);
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
      "system.props.ampzoeticCost": p.ampzoeticCost ?? "",
      "system.props.ampRulestext": p.ampRulestext ?? "",
      "system.props.ampSummary": p.ampSummary ?? ""
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
      `Import Amps: ${missing.length} item(s) not found in Manon/Amplification (see console).`
    );
    console.warn("Import Amps missing items:", missing);
  }

  ui.notifications?.info?.(`Import Amps: updated ${updated} item(s). Refreshed ${refreshed} open sheet(s).`);
})();
