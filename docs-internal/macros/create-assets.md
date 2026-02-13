(async () => {
  const baseDir = "modules/sinlesscsb/docs-internal/templateJSONS/Assets";
  const TEMPLATE_ID = "uGhQTkXb74uXkwPd";
  const TEMPLATE_NAME = "Asset Template";
  const normName = (s) => String(s ?? "").trim().toLowerCase();

  const template =
    game.items?.get?.(TEMPLATE_ID) ||
    game.items?.find?.((i) => i?.name === TEMPLATE_NAME && i?.type === "_equippableItemTemplate") ||
    null;

  if (!template) {
    ui.notifications?.error?.(
      `Create Assets: template not found. Expected id ${TEMPLATE_ID} or name "${TEMPLATE_NAME}".`
    );
    return;
  }

  let assetsFolder = game.folders?.find?.((f) => f.type === "Item" && f.name === "Assets" && !f.folder) || null;
  if (!assetsFolder) {
    assetsFolder = await Folder.create({ name: "Assets", type: "Item" });
  }

  const FP = foundry?.applications?.apps?.FilePicker?.implementation || FilePicker;
  let files = [];
  try {
    const browse = await FP.browse("data", baseDir);
    files = (browse?.files ?? []).filter((f) => f.toLowerCase().endsWith(".json"));
  } catch (e) {
    console.error(e);
    ui.notifications?.error?.(`Create Assets: could not browse ${baseDir}.`);
    return;
  }

  if (!files.length) {
    ui.notifications?.warn?.(`Create Assets: no JSON files found in ${baseDir}.`);
    return;
  }

  const existingNameKeys = new Set(
    (game.items?.filter?.((i) => i.folder?.id === assetsFolder.id) ?? []).map((i) => normName(i.name))
  );

  const createData = [];
  for (const file of files) {
    let data;
    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data = await res.json();
    } catch (e) {
      console.warn(`Create Assets: failed to read ${file}`, e);
      continue;
    }

    const name = String(data?.name ?? "").trim();
    const nameKey = normName(name);
    if (!name || existingNameKeys.has(nameKey)) continue;

    createData.push({
      name,
      type: "equippableItem",
      folder: assetsFolder.id,
      img: String(data?.img ?? "").trim(),
      system: {
        template: template.id,
        templateSystemUniqueVersion: template.system?.templateSystemUniqueVersion
      }
    });
    existingNameKeys.add(nameKey);
  }

  if (!createData.length) {
    ui.notifications?.info?.("Create Assets: all items already exist in Assets folder.");
    return;
  }

  await Item.createDocuments(createData);
  ui.notifications?.info?.(`Create Assets: created ${createData.length} item(s) in Assets.`);
})();
