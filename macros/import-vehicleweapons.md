(async () => {
  // Must be reachable from the Foundry data directory.
  const baseDir = "modules/sinlesscsb/docs-internal/templateJSONS/VehicleWeapons";

  const weaponsFolder = game.folders?.find?.(f => f.type === "Item" && f.name === "Weapons" && !f.folder) || null;
  const vehicleFolder = game.folders?.find?.(
    f => f.type === "Item" && f.name === "Vehicle Weapons" && f.folder?.id === weaponsFolder?.id
  ) || null;

  if (!weaponsFolder || !vehicleFolder) {
    ui.notifications?.error?.("Import vehicle weapon JSONs: Weapons/Vehicle Weapons folder not found. Run create-vehicleweapons first.");
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
      .filter(f => f.toLowerCase().includes("fvtt-item-vehicle-weapon-"));
  } catch (e) {
    console.error(e);
    ui.notifications?.error?.(`Import vehicle weapon JSONs: could not browse ${baseDir}.`);
    return;
  }

  if (!files.length) {
    ui.notifications?.warn?.(`Import vehicle weapon JSONs: no JSON files found in ${baseDir}.`);
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
      console.warn(`Import vehicle weapon JSONs: failed to read ${file}`, e);
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
      `Import vehicle weapon JSONs: ${missing.length} item(s) not found in Weapons/Vehicle Weapons (see console).`
    );
    console.warn("Import vehicle weapon JSONs missing items:", missing);
  }

  ui.notifications?.info?.(
    `Import vehicle weapon JSONs: updated ${updated} item(s). Refreshed ${refreshed} open sheet(s).`
  );
})();

###

all mappings are good, except skate is apparently a seperate item that I will just hand make, so make the art skate.png and I'll add it later and just skip scooter.  

On the drones, you didn't make the background alpha 0 full transparency, you made the drone line art full transparency.  Can you swap the current transparency alpha 0 and color for all drones in both while and black folders so they can be used?

For the vehicles, the image must have card and actual picture image in one layer.  I pasted the actual image portion of Battle Cycle to give you a sense of what we want.

![alt text](image.png)

I edited the Cargo Helicopter to show you what I am looking for:
"D:\Git\sinlesscsb\assets\images\SinlessVehicles\white\p159_img2_xref881.png"

the hope is to use these as icons, so that is why we need to clear away the text and card material lweaving a 1024x1024 square icon with the image centered.

When you re-process the Drones, please also make them all 1024x1024 squares suitable for use as an icon.
