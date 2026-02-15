(async () => {
  // Must be reachable from the Foundry data directory.
  const baseDir = "modules/sinlesscsb/docs-internal/templateJSONS/Melee";

  const weaponsFolder = game.folders?.find?.(f => f.type === "Item" && f.name === "Weapons" && !f.folder) || null;
  const meleeFolder = game.folders?.find?.(
    f => f.type === "Item" && f.name === "Melee" && f.folder?.id === weaponsFolder?.id
  ) || null;

  if (!weaponsFolder || !meleeFolder) {
    ui.notifications?.error?.("Import melee JSONs: Weapons/Melee folder not found. Run create-melee-items first.");
    return;
  }

  const itemsByName = new Map(
    (game.items?.filter?.(i => i.folder?.id === meleeFolder.id) ?? []).map(i => [i.name, i])
  );

  let files = [];
  const FP = foundry?.applications?.apps?.FilePicker?.implementation || FilePicker;
  try {
    const browse = await FP.browse("data", baseDir);
    files = (browse?.files ?? []).filter(f => f.toLowerCase().endsWith(".json"));
  } catch (e) {
    console.error(e);
    ui.notifications?.error?.(`Import melee JSONs: could not browse ${baseDir}.`);
    return;
  }

  if (!files.length) {
    ui.notifications?.warn?.(`Import melee JSONs: no JSON files found in ${baseDir}.`);
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
      console.warn(`Import melee JSONs: failed to read ${file}`, e);
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
      "system.props.itemDamage": p.itemDamage ?? "",
      "system.props.meleeReach": p.meleeReach ?? "",
      "system.props.weight": p.weight ?? "",
      "system.props.armorPierce": p.armorPierce ?? "",
      "system.props.conceal": p.conceal ?? "",
      "system.props.itemRarity": p.itemRarity ?? ""
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
      `Import melee JSONs: ${missing.length} items not found in Weapons/Melee (see console).`
    );
    console.warn("Import melee JSONs missing items:", missing);
  }

  ui.notifications?.info?.(
    `Import melee JSONs: updated ${updated} item(s). Refreshed ${refreshed} open sheet(s).`
  );
})();
