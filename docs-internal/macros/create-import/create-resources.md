(async () => {
  const baseDir = "modules/sinlesscsb/docs-internal/templateJSONS/Resources";
  const TEMPLATE_ID = "wi8dx0sNDbpFXrKU";
  const TEMPLATE_NAME = "Resources Template";
  const normName = (s) => String(s ?? "").trim().toLowerCase();

  const template =
    game.items?.get?.(TEMPLATE_ID) ||
    game.items?.find?.((i) => i?.name === TEMPLATE_NAME && i?.type === "_equippableItemTemplate") ||
    null;

  if (!template) {
    ui.notifications?.error?.(
      `Create Resources: template not found. Expected id ${TEMPLATE_ID} or name "${TEMPLATE_NAME}".`
    );
    return;
  }

  let brandFolder = game.folders?.find?.((f) => f.type === "Item" && f.name === "Brand" && !f.folder) || null;
  if (!brandFolder) {
    brandFolder = await Folder.create({ name: "Brand", type: "Item" });
  }

  let resourcesFolder = game.folders?.find?.(
    (f) => f.type === "Item" && f.name === "Resources" && f.folder?.id === brandFolder.id
  ) || null;
  if (!resourcesFolder) {
    resourcesFolder = await Folder.create({ name: "Resources", type: "Item", folder: brandFolder.id });
  }

  const FP = foundry?.applications?.apps?.FilePicker?.implementation || FilePicker;
  let files = [];
  try {
    const browse = await FP.browse("data", baseDir);
    files = (browse?.files ?? []).filter((f) => f.toLowerCase().endsWith(".json"));
  } catch (e) {
    console.error(e);
    ui.notifications?.error?.(`Create Resources: could not browse ${baseDir}.`);
    return;
  }

  const resourceFiles = files.filter((f) =>
    /fvtt-Item-resource-.*\.json$/i.test(String(f).split(/[\\/]/).pop() ?? "")
  );
  if (!resourceFiles.length) {
    ui.notifications?.warn?.(`Create Resources: no resource JSON files found in ${baseDir}.`);
    return;
  }

  const existingNameKeys = new Set(
    (game.items?.filter?.((i) => i.folder?.id === resourcesFolder.id) ?? []).map((i) => normName(i.name))
  );

  const createData = [];
  for (const file of resourceFiles) {
    let data;
    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data = await res.json();
    } catch (e) {
      console.warn(`Create Resources: failed to read ${file}`, e);
      continue;
    }

    const name = String(data?.name ?? "").trim();
    if (!name) continue;

    const nameKey = normName(name);
    if (existingNameKeys.has(nameKey)) continue;

    createData.push({
      name,
      type: "equippableItem",
      folder: resourcesFolder.id,
      img: String(data?.img ?? "").trim() || "icons/svg/item-bag.svg",
      system: {
        template: template.id,
        templateSystemUniqueVersion: template.system?.templateSystemUniqueVersion
      }
    });
    existingNameKeys.add(nameKey);
  }

  if (!createData.length) {
    ui.notifications?.info?.("Create Resources: all items already exist in Brand/Resources.");
    return;
  }

  await Item.createDocuments(createData);
  ui.notifications?.info?.(`Create Resources: created ${createData.length} item(s) in Brand/Resources.`);
})();
