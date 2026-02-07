(async () => {
  const TEMPLATE_ID = "SpelTplSinlssA1X";
  const TEMPLATE_NAME = "Sorcery Template";

  const spellGroups = {
    "Incantor": [
      "Create Barrier",
      "Disguise Astral Aura",
      "Flight",
      "Light",
      "Haste",
      "Manon Ball",
      "Manon Bolt",
      "Mind Link",
      "Shatter Ward",
      "Powerball",
      "Power Bolt"
    ],
    "Auralurgy": [
      "Rune of the Unspeakable Alarm",
      "The Charm of Raucous Cacophony",
      "Forbidden Glamour of Accord",
      "Chant of Dire Malady",
      "Rune of Vicious Rage and Sorrow",
      "The Blessed Chime of Glorious Release",
      "The Ancestral Working of the Savage Peal",
      "The Horrid Call of Za'lota",
      "The Seven Chimes of Forceful Approbation",
      "The Confounding Rhythms of Dire Doom",
      "The Infinite Illusion of Spiritual Separation"
    ],
    "Mentalism": [
      "Calm",
      "Charm",
      "Command",
      "Confusion",
      "Despair",
      "Enthrall",
      "Ensorcell",
      "Forget",
      "Fumble",
      "Geas",
      "Laughter",
      "Hold",
      "Insight",
      "Suggestion",
      "Taunt"
    ],
    "Astral Umbra": [
      "Moment of Eclipse",
      "Cloak of Night",
      "Horrors of the Unknown Dark",
      "Night's Chill",
      "Black Bolt of Uthal",
      "Shadow Path of Vile Ether",
      "Shadow Anchor",
      "The Uncountable Tendrils of Ehon",
      "Create Darkenbeast",
      "Dire Touch of Ennui",
      "Evocation of the Frail Beam of Debility",
      "The Thirty Cursed Servant of Athozog",
      "The Serene Conjuration of Ehon's Gate",
      "Sorcery of the Wraith's Flight",
      "The Marvelous Cursed Sigil of Athozog"
    ],
    "The Bound": [
      "Massage the Bones of the Earth",
      "Fires of the Earth",
      "Grasp of Spring",
      "Fiery Lash",
      "Lightning Strike",
      "Summon Elemental",
      "Shapeshift",
      "Healing",
      "Natural Fury",
      "Firestorm",
      "Blight"
    ]
  };

  const template =
    game.items?.get?.(TEMPLATE_ID) ||
    game.items?.find?.(i => i?.name === TEMPLATE_NAME && i?.type === "_equippableItemTemplate") ||
    null;

  if (!template) {
    ui.notifications?.error?.(
      `Sorcery create: template not found. Expected id ${TEMPLATE_ID} or name "${TEMPLATE_NAME}".`
    );
    return;
  }

  let createdTotal = 0;

  for (const [groupName, spellNames] of Object.entries(spellGroups)) {
    let groupFolder = game.folders?.find?.(
      f => f.type === "Item" && f.name === groupName && !f.folder
    ) || null;

    if (!groupFolder) {
      groupFolder = await Folder.create({ name: groupName, type: "Item" });
    }

    const existing = new Set(
      (game.items?.filter?.(i => i.folder?.id === groupFolder.id) ?? []).map(i => i.name)
    );

    const toCreate = spellNames
      .filter(name => !existing.has(name))
      .map(name => ({
        name,
        type: "equippableItem",
        folder: groupFolder.id,
        img: "modules/sinlesscsb/assets/icons/SR6/default/Default_Skill.svg",
        system: {
          template: template.id,
          templateSystemUniqueVersion: template.system?.templateSystemUniqueVersion
        }
      }));

    if (!toCreate.length) {
      continue;
    }

    await Item.createDocuments(toCreate);
    createdTotal += toCreate.length;
  }

  if (!createdTotal) {
    ui.notifications?.info?.("Sorcery create: all items already exist in top-level school folders.");
    return;
  }

  ui.notifications?.info?.(`Sorcery create: created ${createdTotal} item(s) in top-level school folders.`);
})();
