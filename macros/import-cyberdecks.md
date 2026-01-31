(async () => {
  // Must be reachable from the Foundry data directory.
  const baseDir = "modules/sinlesscsb/docs-internal/templateJSONS/Decking/cyberDecks";

  const deckingFolder = game.folders?.find?.(f => f.type === "Item" && f.name === "Decking" && !f.folder) || null;
  const cyberFolder = game.folders?.find?.(
    f => f.type === "Item" && f.name === "Cyberdecks" && f.folder?.id === deckingFolder?.id
  ) || null;

  if (!deckingFolder || !cyberFolder) {
    ui.notifications?.error?.("Import cyberdeck JSONs: Decking/Cyberdecks folder not found. Run create-cyberdecks first.");
    return;
  }

  const itemsByName = new Map(
    (game.items?.filter?.(i => i.folder?.id === cyberFolder.id) ?? []).map(i => [i.name, i])
  );

  let files = [];
  const FP = foundry?.applications?.apps?.FilePicker?.implementation || FilePicker;
  try {
    const browse = await FP.browse("data", baseDir);
    files = (browse?.files ?? [])
      .filter(f => f.toLowerCase().endsWith(".json"));
  } catch (e) {
    console.error(e);
    ui.notifications?.error?.(`Import cyberdeck JSONs: could not browse ${baseDir}.`);
    return;
  }

  if (!files.length) {
    ui.notifications?.warn?.(`Import cyberdeck JSONs: no JSON files found in ${baseDir}.`);
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
      console.warn(`Import cyberdeck JSONs: failed to read ${file}`, e);
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
      "system.props.mcpDeck": p.mcpDeck ?? "",
      "system.props.hardeningDeck": p.hardeningDeck ?? "",
      "system.props.threadsDeck": p.threadsDeck ?? "",
      "system.props.coreDeck": p.coreDeck ?? "",
      "system.props.modsDeck": p.modsDeck ?? "",
      "system.props.ioDeck": p.ioDeck ?? "",
      "system.props.deckCost": p.deckCost ?? "",
      "system.props.deckMod1": p.deckMod1 ?? "",
      "system.props.deckMod2": p.deckMod2 ?? "",
      "system.props.deckMod3": p.deckMod3 ?? "",
      "system.props.deckMod4": p.deckMod4 ?? "",
      "system.props.deckMod5": p.deckMod5 ?? "",
      "system.props.threadsLoaded": p.threadsLoaded ?? ""
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
      `Import cyberdeck JSONs: ${missing.length} item(s) not found in Decking/Cyberdecks (see console).`
    );
    console.warn("Import cyberdeck JSONs missing items:", missing);
  }

  ui.notifications?.info?.(
    `Import cyberdeck JSONs: updated ${updated} item(s). Refreshed ${refreshed} open sheet(s).`
  );
})();
