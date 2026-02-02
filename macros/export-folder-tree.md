// Macro: export Actor + Item folder tree to Markdown (Foundry v13)
// Saves a .md file via browser download (typically your Downloads folder).

(async () => {
  const now = new Date();
  const dateStamp = now.toISOString().slice(0, 10);
  const worldTitle = game.world?.title ?? game.world?.id ?? "world";

  const safeName = (s) =>
    String(s ?? "")
      .trim()
      .replace(/[\\/:*?"<>|]+/g, "-")
      .replace(/\s+/g, "_")
      .slice(0, 80) || "world";

  const fileName = `folder-tree_${safeName(worldTitle)}_${dateStamp}.md`;

  const getFolders = (docType) => {
    const all = game.folders?.contents ?? game.folders ?? [];
    return all.filter(f => f.type === docType);
  };

  const getDocs = (docType) => {
    if (docType === "Actor") return game.actors?.contents ?? game.actors ?? [];
    if (docType === "Item") return game.items?.contents ?? game.items ?? [];
    return [];
  };

  const sortByOrder = (a, b) => {
    const sa = Number.isFinite(a.sort) ? a.sort : 0;
    const sb = Number.isFinite(b.sort) ? b.sort : 0;
    if (sa !== sb) return sa - sb;
    return String(a.name ?? "").localeCompare(String(b.name ?? ""));
  };

  const renderTree = (docType) => {
    const folders = getFolders(docType);
    const docs = getDocs(docType);

    const children = new Map(); // parentId -> [folder]
    for (const f of folders) {
      const pid = f.parent?.id ?? null;
      if (!children.has(pid)) children.set(pid, []);
      children.get(pid).push(f);
    }
    for (const [, list] of children) list.sort(sortByOrder);

    const docsByFolder = new Map(); // folderId -> [doc]
    for (const d of docs) {
      const fid = d.folder?.id ?? null;
      if (!docsByFolder.has(fid)) docsByFolder.set(fid, []);
      docsByFolder.get(fid).push(d);
    }
    for (const [, list] of docsByFolder) list.sort(sortByOrder);

    const lines = [];
    const rootFolders = children.get(null) ?? [];
    const unfoldered = docsByFolder.get(null) ?? [];

    const pushDocs = (list, depth) => {
      const pad = "  ".repeat(depth);
      for (const d of list) {
        lines.push(`${pad}- ${d.name}`);
      }
    };

    const walk = (folder, depth) => {
      const pad = "  ".repeat(depth);
      lines.push(`${pad}- **${folder.name}**`);
      const inFolder = docsByFolder.get(folder.id) ?? [];
      if (inFolder.length) pushDocs(inFolder, depth + 1);
      const kids = children.get(folder.id) ?? [];
      for (const k of kids) walk(k, depth + 1);
    };

    if (rootFolders.length === 0 && unfoldered.length === 0) {
      lines.push("- _(none)_");
      return lines;
    }

    for (const f of rootFolders) walk(f, 0);
    if (unfoldered.length) {
      lines.push("- **(Unfoldered)**");
      pushDocs(unfoldered, 1);
    }

    return lines;
  };

  const md = [
    `# Folder Tree (Actors + Items)`,
    ``,
    `- World: **${worldTitle}**`,
    `- Generated: ${now.toLocaleString()}`,
    ``,
    `## Actors`,
    ...renderTree("Actor"),
    ``,
    `## Items`,
    ...renderTree("Item"),
    ``
  ].join("\n");

  try {
    const saver = foundry?.utils?.saveDataToFile ?? saveDataToFile;
    if (typeof saver !== "function") {
      ui.notifications?.warn?.("No saveDataToFile available in this Foundry build.");
      console.warn("saveDataToFile not found.");
      return;
    }
    saver(md, "text/markdown", fileName);
    ui.notifications?.info?.(`Folder tree exported: ${fileName}`);
  } catch (e) {
    console.error("Folder tree export failed", e);
    ui.notifications?.error?.("Folder tree export failed. See console.");
  }
})();
