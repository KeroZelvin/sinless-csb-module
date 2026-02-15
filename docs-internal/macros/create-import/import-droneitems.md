(async () => {
  // Must be reachable from the Foundry data directory.
  const baseDir = "modules/sinlesscsb/docs-internal/templateJSONS/DroneItems";

  const droneFolder = game.folders?.find?.(f => f.type === "Item" && f.name === "DroneItems" && !f.folder) || null;

  if (!droneFolder) {
    ui.notifications?.error?.("Import drone item JSONs: DroneItems folder not found. Run create-droneitems first.");
    return;
  }

  const itemsByName = new Map(
    (game.items?.filter?.(i => i.folder?.id === droneFolder.id) ?? []).map(i => [i.name, i])
  );

  let files = [];
  const FP = foundry?.applications?.apps?.FilePicker?.implementation || FilePicker;
  try {
    const browse = await FP.browse("data", baseDir);
    files = (browse?.files ?? []).filter(f => f.toLowerCase().endsWith(".json"));
  } catch (e) {
    console.error(e);
    ui.notifications?.error?.(`Import drone item JSONs: could not browse ${baseDir}.`);
    return;
  }

  if (!files.length) {
    ui.notifications?.warn?.(`Import drone item JSONs: no JSON files found in ${baseDir}.`);
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
      console.warn(`Import drone item JSONs: failed to read ${file}`, e);
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
      "system.props.findItemdrone": p.findItemdrone ?? ""
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
      `Import drone item JSONs: ${missing.length} item(s) not found in DroneItems (see console).`
    );
    console.warn("Import drone item JSONs missing items:", missing);
  }

  ui.notifications?.info?.(
    `Import drone item JSONs: updated ${updated} item(s). Refreshed ${refreshed} open sheet(s).`
  );
})();
