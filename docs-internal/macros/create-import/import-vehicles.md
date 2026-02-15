(async () => {
  // Must be reachable from the Foundry data directory.
  const baseDir = "modules/sinlesscsb/docs-internal/templateJSONS/Vehicles";

  const hangarFolder = game.folders?.find?.(f => f.type === "Actor" && f.name === "VehicleHangar" && !f.folder) || null;

  if (!hangarFolder) {
    ui.notifications?.error?.("Import vehicle JSONs: VehicleHangar folder not found. Run create-vehicles first.");
    return;
  }

  const actorsByName = new Map(
    (game.actors?.filter?.(a => a.folder?.id === hangarFolder.id) ?? []).map(a => [a.name, a])
  );

  let files = [];
  const FP = foundry?.applications?.apps?.FilePicker?.implementation || FilePicker;
  try {
    const browse = await FP.browse("data", baseDir);
    files = (browse?.files ?? [])
      .filter(f => f.toLowerCase().endsWith(".json"))
      .filter(f => f.toLowerCase().includes("fvtt-actor-vehicle-"));
  } catch (e) {
    console.error(e);
    ui.notifications?.error?.(`Import vehicle JSONs: could not browse ${baseDir}.`);
    return;
  }

  if (!files.length) {
    ui.notifications?.warn?.(`Import vehicle JSONs: no vehicle actor JSON files found in ${baseDir}.`);
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
      console.warn(`Import vehicle JSONs: failed to read ${file}`, e);
      continue;
    }

    const name = String(data?.name ?? "").trim();
    if (!name) continue;

    const actor = actorsByName.get(name);
    if (!actor) {
      missing.push(name);
      continue;
    }

    const p = data?.system?.props ?? {};
    const update = {
      "system.props.physicalMax": p.physicalMax ?? "",
      "system.props.actorMovement": p.actorMovement ?? "",
      "system.props.rigHandling": p.rigHandling ?? "",
      "system.props.vehicleCargo": p.vehicleCargo ?? "",
      "system.props.itemRarity": p.itemRarity ?? "",
      "system.props.droneBallistic": p.droneBallistic ?? "",
      "system.props.droneImpact": p.droneImpact ?? "",
      "system.props.vehicleCost": p.vehicleCost ?? "",
      "system.props.findVehicle": p.findVehicle ?? ""
    };

    await actor.update(update);
    updated += 1;

    if (actor.sheet?.rendered) {
      actor.sheet.render(true);
      refreshed += 1;
    }
  }

  if (missing.length) {
    ui.notifications?.warn?.(
      `Import vehicle JSONs: ${missing.length} actor(s) not found in VehicleHangar (see console).`
    );
    console.warn("Import vehicle JSONs missing actors:", missing);
  }

  ui.notifications?.info?.(
    `Import vehicle JSONs: updated ${updated} actor(s). Refreshed ${refreshed} open sheet(s).`
  );
})();
