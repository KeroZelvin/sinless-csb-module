(async () => {
  // Must be reachable from the Foundry data directory.
  const baseDir = "modules/sinlesscsb/docs-internal/templateJSONS/DroneWeapons";

  const weaponsFolder = game.folders?.find?.(f => f.type === "Item" && f.name === "Weapons" && !f.folder) || null;
  const droneFolder = game.folders?.find?.(
    f => f.type === "Item" && f.name === "Drone Weapons" && f.folder?.id === weaponsFolder?.id
  ) || null;

  if (!weaponsFolder || !droneFolder) {
    ui.notifications?.error?.("Import drone weapon JSONs: Weapons/Drone Weapons folder not found. Run create-droneweapons first.");
    return;
  }

  const itemsByName = new Map(
    (game.items?.filter?.(i => i.folder?.id === droneFolder.id) ?? []).map(i => [i.name, i])
  );

  let files = [];
  const FP = foundry?.applications?.apps?.FilePicker?.implementation || FilePicker;
  try {
    const browse = await FP.browse("data", baseDir);
    files = (browse?.files ?? [])
      .filter(f => f.toLowerCase().endsWith(".json"))
      .filter(f => f.toLowerCase().includes("fvtt-item-drone-weapon-"));
  } catch (e) {
    console.error(e);
    ui.notifications?.error?.(`Import drone weapon JSONs: could not browse ${baseDir}.`);
    return;
  }

  if (!files.length) {
    ui.notifications?.warn?.(`Import drone weapon JSONs: no JSON files found in ${baseDir}.`);
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
      console.warn(`Import drone weapon JSONs: failed to read ${file}`, e);
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
    const update = {};
    for (const [k, v] of Object.entries(p)) {
      update[`system.props.${k}`] = (v ?? "");
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
      `Import drone weapon JSONs: ${missing.length} item(s) not found in Weapons/Drone Weapons (see console).`
    );
    console.warn("Import drone weapon JSONs missing items:", missing);
  }

  ui.notifications?.info?.(
    `Import drone weapon JSONs: updated ${updated} item(s). Refreshed ${refreshed} open sheet(s).`
  );
})();
