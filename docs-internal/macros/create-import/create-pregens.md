(async () => {
  const TEMPLATE_ID = "409875cd45a544c0";
  const TEMPLATE_NAME = "Sinless PC";
  const baseDir = "modules/sinlesscsb/docs-internal/templateJSONS/PreGens";

  const template =
    game.actors?.get?.(TEMPLATE_ID) ||
    game.actors?.find?.(a => a?.name === TEMPLATE_NAME && a?.type === "_template") ||
    null;

  if (!template) {
    ui.notifications?.error?.(
      `PreGens create: template not found. Expected id ${TEMPLATE_ID} or name "${TEMPLATE_NAME}".`
    );
    return;
  }

  let pcsFolder = game.folders?.find?.(f => f.type === "Actor" && f.name === "PCs" && !f.folder) || null;
  if (!pcsFolder) {
    pcsFolder = await Folder.create({ name: "PCs", type: "Actor" });
  }

  let pregensFolder = game.folders?.find?.(
    f => f.type === "Actor" && f.name === "PreGens" && f.folder?.id === pcsFolder.id
  ) || null;
  if (!pregensFolder) {
    pregensFolder = await Folder.create({ name: "PreGens", type: "Actor", folder: pcsFolder.id });
  }

  const FP = foundry?.applications?.apps?.FilePicker?.implementation || FilePicker;
  let files = [];
  try {
    const browse = await FP.browse("data", baseDir);
    files = (browse?.files ?? []).filter(f => f.toLowerCase().endsWith(".json"));
  } catch (e) {
    console.error(e);
    ui.notifications?.error?.(`PreGens create: could not browse ${baseDir}.`);
    return;
  }

  if (!files.length) {
    ui.notifications?.warn?.(`PreGens create: no JSON files found in ${baseDir}.`);
    return;
  }

  const existing = new Set(
    (game.actors?.filter?.(a => a.folder?.id === pregensFolder.id) ?? []).map(a => a.name)
  );

  const toCreate = [];

  for (const file of files) {
    let data;
    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data = await res.json();
    } catch (e) {
      console.warn(`PreGens create: failed to read ${file}`, e);
      continue;
    }

    const name = String(data?.name ?? "").trim();
    if (!name || existing.has(name)) continue;

    const img = data?.img || "icons/svg/mystery-man.svg";
    toCreate.push({
      name,
      type: "character",
      folder: pregensFolder.id,
      img,
      prototypeToken: {
        name,
        texture: { src: img }
      },
      system: {
        template: template.id,
        templateSystemUniqueVersion: template.system?.templateSystemUniqueVersion
      }
    });
  }

  if (!toCreate.length) {
    ui.notifications?.info?.("PreGens create: all actors already exist in PCs/PreGens.");
    return;
  }

  await Actor.createDocuments(toCreate);
  ui.notifications?.info?.(`PreGens create: created ${toCreate.length} actor(s) in PCs/PreGens.`);
})();
