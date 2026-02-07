// Macro: reload all Actor + Item sheets (open, refresh, close)
// Use after template changes to force sheets to re-render.

(async () => {
  const INCLUDE_ACTORS = true;
  const INCLUDE_ITEMS = true;
  const OPEN_IF_CLOSED = true;
  const CLOSE_AFTER_OPEN = true;
  const RENDER_DELAY_MS = 50;

  const queue = [];
  const seen = new Set();

  const addDoc = (doc) => {
    if (!doc?.uuid || seen.has(doc.uuid)) return;
    seen.add(doc.uuid);
    queue.push(doc);
  };

  if (INCLUDE_ACTORS) {
    for (const a of game.actors ?? []) addDoc(a);
  }
  if (INCLUDE_ITEMS) {
    for (const i of game.items ?? []) addDoc(i);
    for (const a of game.actors ?? []) {
      for (const i of a.items ?? []) addDoc(i);
    }
  }

  let refreshed = 0;
  let opened = 0;
  let closed = 0;

  for (const doc of queue) {
    const sheet = doc.sheet;
    if (!sheet) continue;

    if (sheet.rendered) {
      sheet.render(true);
      refreshed += 1;
      continue;
    }

    if (OPEN_IF_CLOSED) {
      await sheet.render(true);
      opened += 1;
      if (RENDER_DELAY_MS > 0) {
        await new Promise(r => setTimeout(r, RENDER_DELAY_MS));
      }
      if (CLOSE_AFTER_OPEN) {
        try { await sheet.close(); } catch (_e) { sheet.close(); }
        closed += 1;
      }
    }
  }

  ui.notifications?.info?.(
    `Reload sheets complete. Refreshed ${refreshed} open, opened ${opened}, closed ${closed}.`
  );
})();
