// Macro: update template portrait size (CSB v5)
// Sets profile picture size on Actor/Item templates (and optionally existing docs).

(async () => {
  const SIZE = 200;

  // Toggle these as needed
  const UPDATE_TEMPLATES = true;
  const UPDATE_ACTORS = true; // set true to update existing actor docs
  const UPDATE_ITEMS = true;  // set true to update existing item docs

  // Optional name filter (case-sensitive). Leave empty to update all.
  const TEMPLATE_NAMES = new Set([
    // "Sinless PC",
    // "Sinless NPC",
    // "Session Settings",
    // "Firearms Template",
    // "Melee Weapon Template",
    // "Cyberdeck Template"
  ]);

  const shouldUpdateName = (doc) =>
    TEMPLATE_NAMES.size === 0 || TEMPLATE_NAMES.has(String(doc?.name ?? ""));

  const isTemplate = (doc) => doc?.type === "_template" && doc?.system?.display;

  async function updateDoc(doc, label) {
    if (!doc) return false;
    if (!shouldUpdateName(doc)) return false;
    const updateData = {
      "system.display.pp_width": 200,
      "system.display.pp_height": 200
    };
    try {
      await doc.update(updateData);
      return true;
    } catch (e) {
      console.warn(`${label}: failed`, doc?.name, e);
      return false;
    }
  }

  let updated = 0;

  if (UPDATE_TEMPLATES) {
    for (const a of game.actors ?? []) {
      if (!isTemplate(a)) continue;
      if (await updateDoc(a, "Actor template")) updated += 1;
    }
    for (const i of game.items ?? []) {
      if (!isTemplate(i)) continue;
      if (await updateDoc(i, "Item template")) updated += 1;
    }
  }

  if (UPDATE_ACTORS) {
    for (const a of game.actors ?? []) {
      if (a?.type === "_template") continue;
      if (!a?.system?.display) continue;
      if (await updateDoc(a, "Actor")) updated += 1;
    }
  }

  if (UPDATE_ITEMS) {
    for (const i of game.items ?? []) {
      if (i?.type === "_template") continue;
      if (!i?.system?.display) continue;
      if (await updateDoc(i, "Item")) updated += 1;
    }
  }

  ui.notifications?.info?.(`Portrait size update complete. Updated ${updated} document(s).`);
})();
