(async () => {
  const fileCandidates = [
    "modules/sinlesscsb/docs-internal/templateJSONS/Decking/Software/rulesStaging.md",
    "modules/sinlesscsb/docs-internal/templateJSONS/Decking/Software/rulesStaging.txt"
  ];

  const readText = async () => {
    for (const file of fileCandidates) {
      try {
        const res = await fetch(file, { cache: "no-store" });
        if (!res.ok) continue;
        const text = await res.text();
        if (text && text.trim()) return { file, text };
      } catch (_e) {
        // Try next candidate
      }
    }
    return null;
  };

  const loaded = await readText();
  if (!loaded) {
    ui.notifications?.error?.(
      "Import Software Rules: could not read rulesStaging.md or rulesStaging.txt in modules/sinlesscsb/docs-internal/templateJSONS/Decking/Software."
    );
    return;
  }

  const lines = String(loaded.text ?? "").split(/\r?\n/);
  const rulesByName = new Map();
  let currentName = null;
  let buffer = [];

  const flush = () => {
    if (!currentName) {
      buffer = [];
      return;
    }
    const html = buffer.join("\n").trim();
    if (html) rulesByName.set(currentName, html);
    buffer = [];
  };

  for (const line of lines) {
    const match = line.match(/^##\s+(.+?)\s*$/);
    if (match) {
      flush();
      currentName = match[1].trim();
      continue;
    }
    if (currentName) buffer.push(line);
  }
  flush();

  if (!rulesByName.size) {
    ui.notifications?.error?.("Import Software Rules: no sections found in rules staging file.");
    return;
  }

  const deckingFolder = game.folders?.find?.(f => f.type === "Item" && f.name === "Decking" && !f.folder) || null;
  const ewarFolder = game.folders?.find?.(
    f => f.type === "Item" && f.name === "E War Threads" && f.folder?.id === deckingFolder?.id
  ) || null;
  const hackingFolder = game.folders?.find?.(
    f => f.type === "Item" && f.name === "Hacking Threads" && f.folder?.id === deckingFolder?.id
  ) || null;

  if (!deckingFolder || !ewarFolder || !hackingFolder) {
    ui.notifications?.error?.(
      "Import Software Rules: Decking/E War Threads or Decking/Hacking Threads folder not found. Run create macros first."
    );
    return;
  }

  const targetFolderIds = new Set([ewarFolder.id, hackingFolder.id]);
  const items = (game.items?.filter?.(i => targetFolderIds.has(i.folder?.id)) ?? []);

  let updated = 0;
  let refreshed = 0;
  const missingRules = [];

  for (const item of items) {
    const html = rulesByName.get(item.name);
    if (!html) {
      missingRules.push(item.name);
      continue;
    }

    const current = String(item?.system?.props?.programRulestext ?? "");
    if (current !== html) {
      await item.update({ "system.props.programRulestext": html });
      updated += 1;

      if (item.sheet?.rendered) {
        item.sheet.render(true);
        refreshed += 1;
      }
    }
  }

  const extraRules = [];
  for (const name of rulesByName.keys()) {
    if (!items.some(i => i.name === name)) extraRules.push(name);
  }

  if (missingRules.length) {
    console.warn("Import Software Rules: missing rules for items:", missingRules);
    ui.notifications?.warn?.(
      `Import Software Rules: ${missingRules.length} item(s) had no matching rules section (see console).`
    );
  }

  if (extraRules.length) {
    console.warn("Import Software Rules: rules sections with no matching item:", extraRules);
  }

  ui.notifications?.info?.(
    `Import Software Rules: updated ${updated} item(s). Refreshed ${refreshed} open sheet(s). Source: ${loaded.file}`
  );
})();
