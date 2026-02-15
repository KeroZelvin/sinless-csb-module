(async () => {
  const TEMPLATE_ID = "XtU8rTt7uOjlTxx0";
  const TEMPLATE_NAME = "Amps Template";

  const ampNames = [
    "Adrenaline Boost",
    "Aspect of the Chelonian",
    "Astral Resistance",
    "Attribute Boost",
    "Attribute Increase",
    "Body Equilibrium",
    "Combat Mastery",
    "Eyes of the Raptor",
    "Expertise",
    "Fade From Vision",
    "Far Sight",
    "Flash Step",
    "Flying Crane",
    "Ghost",
    "Hidden Presence",
    "Iron Fist",
    "Perfect Situational Awareness",
    "Rasputin's Blessing",
    "Returning the Fang",
    "Self-healing",
    "Shadow Double",
    "Suspended Animation",
    "Telekinesis",
    "Touch of the Spider"
  ];

  const template =
    game.items?.get?.(TEMPLATE_ID) ||
    game.items?.find?.(i => i?.name === TEMPLATE_NAME && i?.type === "_equippableItemTemplate") ||
    null;

  if (!template) {
    ui.notifications?.error?.(
      `Amps create: template not found. Expected id ${TEMPLATE_ID} or name "${TEMPLATE_NAME}".`
    );
    return;
  }

  let manonFolder = game.folders?.find?.(f => f.type === "Item" && f.name === "Manon" && !f.folder) || null;
  if (!manonFolder) {
    manonFolder = await Folder.create({ name: "Manon", type: "Item" });
  }

  let ampFolder = game.folders?.find?.(
    f => f.type === "Item" && f.name === "Amplification" && f.folder?.id === manonFolder.id
  ) || null;
  if (!ampFolder) {
    ampFolder = await Folder.create({ name: "Amplification", type: "Item", folder: manonFolder.id });
  }

  const existing = new Set(
    (game.items?.filter?.(i => i.folder?.id === ampFolder.id) ?? []).map(i => i.name)
  );

  const toCreate = ampNames
    .filter(name => !existing.has(name))
    .map(name => ({
      name,
      type: "equippableItem",
      folder: ampFolder.id,
      img: "modules/sinlesscsb/assets/icons/SR6/default/Default_Skill.svg",
      system: {
        template: template.id,
        templateSystemUniqueVersion: template.system?.templateSystemUniqueVersion
      }
    }));

  if (!toCreate.length) {
    ui.notifications?.info?.("Amps create: all items already exist in Manon/Amplification.");
    return;
  }

  await Item.createDocuments(toCreate);
  ui.notifications?.info?.(`Amps create: created ${toCreate.length} item(s) in Manon/Amplification.`);
})();
