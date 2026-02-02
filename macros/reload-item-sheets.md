// Macro: reload item sheets (templates + items)
// Renders open sheets, with optional open/close for closed sheets.

(async () => {
  const MODE = "items"; // "items" | "templates" | "both"
  const RELOAD_OPEN_ONLY = true;
  const OPEN_IF_CLOSED = false; // if true, will open closed sheets
  const CLOSE_AFTER_OPEN = false; // only used when OPEN_IF_CLOSED is true

  // Optional filter by template name (case-sensitive). Leave empty to include all.
  const TEMPLATE_NAMES = new Set([
    // "Sinless PC",
    // "Sinless NPC",
    // "Firearms Template"
  ]);

  const shouldIncludeTemplate = (doc) =>
    TEMPLATE_NAMES.size === 0 || TEMPLATE_NAMES.has(String(doc?.name ?? ""));

  const isTemplate = (doc) => doc?.type === "_template";
  const wantsTemplates = MODE === "templates" || MODE === "both";
  const wantsItems = MODE === "items" || MODE === "both";

  const seen = new Set();
  const queue = [];

  const addDoc = (doc) => {
    if (!doc?.uuid || seen.has(doc.uuid)) return;
    if (isTemplate(doc) && !wantsTemplates) return;
    if (!isTemplate(doc) && !wantsItems) return;
    if (isTemplate(doc) && !shouldIncludeTemplate(doc)) return;
    seen.add(doc.uuid);
    queue.push(doc);
  };

  for (const item of game.items ?? []) addDoc(item);

  for (const actor of game.actors ?? []) {
    for (const item of actor.items ?? []) addDoc(item);
  }

  let refreshed = 0;
  let opened = 0;

  for (const doc of queue) {
    const sheet = doc.sheet;
    if (!sheet) continue;

    if (sheet.rendered) {
      sheet.render(true);
      refreshed += 1;
      continue;
    }

    if (!RELOAD_OPEN_ONLY && OPEN_IF_CLOSED) {
      await sheet.render(true);
      opened += 1;
      if (CLOSE_AFTER_OPEN) sheet.close();
    }
  }

  ui.notifications?.info?.(
    `Reload item sheets: refreshed ${refreshed} open, opened ${opened}.`
  );
})();
