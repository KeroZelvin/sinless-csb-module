// OCR-based best-guess mapping of Firearms item names -> TarotLand card images.
// Updates system.props.weaponCard on items in Weapons/Firearms.
(async () => {
  const baseDir = "modules/sinlesscsb/assets/images/TarotLand";

  const weaponsFolder = game.folders?.find?.(f => f.type === "Item" && f.name === "Weapons" && !f.folder) || null;
  const firearmsFolder = game.folders?.find?.(
    f => f.type === "Item" && f.name === "Firearms" && f.folder?.id === weaponsFolder?.id
  ) || null;

  if (!weaponsFolder || !firearmsFolder) {
    ui.notifications?.error?.("Apply firearm cards: Weapons/Firearms folder not found.");
    return;
  }

  const itemsByName = new Map(
    (game.items?.filter?.(i => i.folder?.id === firearmsFolder.id) ?? []).map(i => [i.name, i])
  );

  const mapping = {
    "450 Tek-Urban": "gear+tarot+cards+-+14_result.webp",
    "DV-662 Devotion": "gear+tarot+cards+-+16_result.webp",
    "Defender": "gear+tarot+cards+-+40_result.webp",
    "Goliath TRGT-9 \"Target\"": "gear+tarot+cards+-+22_result.webp",
    "Hardliner": "gear+tarot+cards+-+28_result.webp",
    "Highwayman": "gear+tarot+cards+-+18_result.webp",
    "Ironbark SMT": "gear+tarot+cards+-+34_result.webp",
    "KL-.89 Klaw": "gear+tarot+cards+-+30_result.webp",
    "Kaos-9x": "gear+tarot+cards+-+42_result.webp",
    "Neon Fang": "gear+tarot+cards+-+6_result.webp",
    "Photon Reaver Ei-7": "gear+tarot+cards+-+8_result.webp",
    "Reaper": "gear+tarot+cards+-+32_result.webp",
    "Ripper": "gear+tarot+cards+-+48_result.webp",
    "Sentinel": "gear+tarot+cards+-+36_result.webp",
    "Slimline Defender": "gear+tarot+cards+-+50_result.webp",
    "Syncsight Hunter": "gear+tarot+cards+-+12_result.webp",
    "Thunderbolt Vanguard": "gear+tarot+cards+-+52_result.webp",
    "Tiger Beat": "gear+tarot+cards+-+26_result.webp",
    "V-100 Vigilant": "gear+tarot+cards+-+54_result.webp",
    "Viper": "gear+tarot+cards+-+56_result.webp",
    "Warhammer H40mm-ER": "gear+tarot+cards+-+24_result.webp"
  };

  let updated = 0;
  let refreshed = 0;
  let skipped = 0;
  const missing = [];

  for (const [name, fileName] of Object.entries(mapping)) {
    const item = itemsByName.get(name);
    if (!item) {
      missing.push(name);
      continue;
    }

    const src = `${baseDir}/${encodeURIComponent(fileName)}`;
    const html = `<img src="${src}">`;
    const cur = String(item.system?.props?.weaponCard ?? "").trim();

    if (cur === html) {
      skipped += 1;
      continue;
    }

    await item.update({ "system.props.weaponCard": html });
    updated += 1;

    if (item.sheet?.rendered) {
      item.sheet.render(true);
      refreshed += 1;
    }
  }

  if (missing.length) {
    ui.notifications?.warn?.(
      `Apply firearm cards: ${missing.length} item(s) not found in Weapons/Firearms (see console).`
    );
    console.warn("Apply firearm cards missing items:", missing);
  }

  ui.notifications?.info?.(
    `Apply firearm cards: updated ${updated} item(s), skipped ${skipped} unchanged. Refreshed ${refreshed} open sheet(s).`
  );
})();
