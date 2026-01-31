(async () => {
  // Must be reachable from the Foundry data directory.
  const baseDir = "modules/sinlesscsb/docs-internal/templateJSONS/Vehicles";

  const vehicleFolder = game.folders?.find?.(f => f.type === "Item" && f.name === "VehicleItems" && !f.folder) || null;

  if (!vehicleFolder) {
    ui.notifications?.error?.("Import vehicle item JSONs: VehicleItems folder not found. Run create-vehicleitems first.");
    return;
  }

  const itemsByName = new Map(
    (game.items?.filter?.(i => i.folder?.id === vehicleFolder.id) ?? []).map(i => [i.name, i])
  );

  let files = [];
  const FP = foundry?.applications?.apps?.FilePicker?.implementation || FilePicker;
  try {
    const browse = await FP.browse("data", baseDir);
    files = (browse?.files ?? [])
      .filter(f => f.toLowerCase().endsWith(".json"))
      .filter(f => f.toLowerCase().includes("fvtt-item-vehicle-"));
  } catch (e) {
    console.error(e);
    ui.notifications?.error?.(`Import vehicle item JSONs: could not browse ${baseDir}.`);
    return;
  }

  if (!files.length) {
    ui.notifications?.warn?.(`Import vehicle item JSONs: no vehicle item JSON files found in ${baseDir}.`);
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
      console.warn(`Import vehicle item JSONs: failed to read ${file}`, e);
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
      "system.props.findItemvehicle": p.findItemvehicle ?? ""
    };

    await item.update(update);
    updated += 1;

    if (item.sheet?.rendered) {
      item.sheet.render(true);
      refreshed += 1;
    }
  }

  if (missing.length) {
    ui.notifications?.warn?.(
      `Import vehicle item JSONs: ${missing.length} item(s) not found in VehicleItems (see console).`
    );
    console.warn("Import vehicle item JSONs missing items:", missing);
  }

  ui.notifications?.info?.(
    `Import vehicle item JSONs: updated ${updated} item(s). Refreshed ${refreshed} open sheet(s).`
  );
})();
