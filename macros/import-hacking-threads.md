(async () => {
  // Must be reachable from the Foundry data directory.
  const baseDir = "modules/sinlesscsb/docs-internal/templateJSONS/Decking/Software/Hacking";

  const deckingFolder = game.folders?.find?.(f => f.type === "Item" && f.name === "Decking" && !f.folder) || null;
  const hackingFolder = game.folders?.find?.(
    f => f.type === "Item" && f.name === "Hacking Threads" && f.folder?.id === deckingFolder?.id
  ) || null;

  if (!deckingFolder || !hackingFolder) {
    ui.notifications?.error?.("Import Hacking Threads JSONs: Decking/Hacking Threads folder not found. Run create-hacking-threads first.");
    return;
  }

  const itemsByName = new Map(
    (game.items?.filter?.(i => i.folder?.id === hackingFolder.id) ?? []).map(i => [i.name, i])
  );

  let files = [];
  const FP = foundry?.applications?.apps?.FilePicker?.implementation || FilePicker;
  try {
    const browse = await FP.browse("data", baseDir);
    files = (browse?.files ?? []).filter(f => f.toLowerCase().endsWith(".json"));
  } catch (e) {
    console.error(e);
    ui.notifications?.error?.(`Import Hacking Threads JSONs: could not browse ${baseDir}.`);
    return;
  }

  if (!files.length) {
    ui.notifications?.warn?.(`Import Hacking Threads JSONs: no JSON files found in ${baseDir}.`);
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
      console.warn(`Import Hacking Threads JSONs: failed to read ${file}`, e);
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
      "system.props.deckactionType": p.deckactionType ?? "",
      "system.props.actionSpecial": p.actionSpecial ?? "",
      "system.props.ioSoftware": p.ioSoftware ?? "",
      "system.props.softwareCost": p.softwareCost ?? "",
      "system.props.softwareAlert": p.softwareAlert ?? "",
      "system.props.programRulestext": p.programRulestext ?? "",
      "system.props.skillKey": p.skillKey ?? "",
      "system.props.actionLabel": p.actionLabel ?? ""
    };

    const rollMessage = data?.system?.header?.contents?.[0]?.contents?.[0]?.rollMessage;
    if (typeof rollMessage === "string" && rollMessage.trim()) {
      update["system.header.contents.0.contents.0.rollMessage"] = rollMessage;
    }

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
      `Import Hacking Threads JSONs: ${missing.length} item(s) not found in Decking/Hacking Threads (see console).`
    );
    console.warn("Import Hacking Threads JSONs missing items:", missing);
  }

  ui.notifications?.info?.(
    `Import Hacking Threads JSONs: updated ${updated} item(s). Refreshed ${refreshed} open sheet(s).`
  );
})();
