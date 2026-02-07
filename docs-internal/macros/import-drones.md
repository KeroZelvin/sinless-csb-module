(async () => {
  // Must be reachable from the Foundry data directory.
  const baseDir = "modules/sinlesscsb/docs-internal/templateJSONS/Drones";

  const hangarFolder = game.folders?.find?.(f => f.type === "Actor" && f.name === "DroneHangar" && !f.folder) || null;

  if (!hangarFolder) {
    ui.notifications?.error?.("Import drone JSONs: DroneHangar folder not found. Run create-drones first.");
    return;
  }

  const actorsByName = new Map(
    (game.actors?.filter?.(a => a.folder?.id === hangarFolder.id) ?? []).map(a => [a.name, a])
  );

  let files = [];
  const FP = foundry?.applications?.apps?.FilePicker?.implementation || FilePicker;
  try {
    const browse = await FP.browse("data", baseDir);
    files = (browse?.files ?? []).filter(f => f.toLowerCase().endsWith(".json"));
  } catch (e) {
    console.error(e);
    ui.notifications?.error?.(`Import drone JSONs: could not browse ${baseDir}.`);
    return;
  }

  if (!files.length) {
    ui.notifications?.warn?.(`Import drone JSONs: no JSON files found in ${baseDir}.`);
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
      console.warn(`Import drone JSONs: failed to read ${file}`, e);
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
      "system.props.droneFrame": p.droneFrame ?? "",
      "system.props.physicalMax": p.physicalMax ?? "",
      "system.props.wepWeight": p.wepWeight ?? "",
      "system.props.actorMovement": p.actorMovement ?? "",
      "system.props.rigHandling": p.rigHandling ?? "",
      "system.props.droneHardpoints": p.droneHardpoints ?? "",
      "system.props.itemRarity": p.itemRarity ?? "",
      "system.props.droneBallistic": p.droneBallistic ?? "",
      "system.props.droneImpact": p.droneImpact ?? "",
      "system.props.droneCost": p.droneCost ?? "",
      "system.props.findDrone": p.findDrone ?? ""
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
      `Import drone JSONs: ${missing.length} actor(s) not found in DroneHangar (see console).`
    );
    console.warn("Import drone JSONs missing actors:", missing);
  }

  ui.notifications?.info?.(
    `Import drone JSONs: updated ${updated} actor(s). Refreshed ${refreshed} open sheet(s).`
  );
})();
