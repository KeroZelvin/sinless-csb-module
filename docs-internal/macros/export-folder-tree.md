// Macro: export Actor + Item folder tree to Markdown (Foundry v13)
// Saves a .md file via browser download (typically your Downloads folder).
// Output includes a machine-readable JSON section for robust parsing.

(async () => {
  const now = new Date();
  const generatedAtISO = now.toISOString();
  const dateStamp = generatedAtISO.slice(0, 10);
  const worldTitle = game.world?.title ?? game.world?.id ?? "world";

  const safeName = (s) =>
    String(s ?? "")
      .trim()
      .replace(/[\\/:*?"<>|]+/g, "-")
      .replace(/\s+/g, "_")
      .slice(0, 80) || "world";

  const fileName = `folder-tree_${safeName(worldTitle)}_${dateStamp}.md`;
  const ACTOR_ROOT_ALLOWLIST = new Set([
    "PCs",
    "NPCs",
    "DroneHangar",
    "VehicleHangar",
    "Templates"
  ]);

  const toArray = (collectionLike) => {
    if (!collectionLike) return [];
    if (Array.isArray(collectionLike)) return collectionLike;
    if (Array.isArray(collectionLike.contents)) return collectionLike.contents;
    return Array.from(collectionLike);
  };

  const asId = (value) => {
    if (!value) return null;
    if (typeof value === "string") return value || null;
    if (typeof value === "object" && typeof value.id === "string") return value.id;
    return null;
  };

  const sortByName = (a, b) =>
    String(a?.name ?? "").localeCompare(String(b?.name ?? ""));

  const sortBySortThenName = (a, b) => {
    const sa = Number.isFinite(a?.sort) ? a.sort : 0;
    const sb = Number.isFinite(b?.sort) ? b.sort : 0;
    if (sa !== sb) return sa - sb;
    return sortByName(a, b);
  };

  const escapePipe = (s) => String(s ?? "").replace(/\|/g, "\\|");

  const getFolders = (docType) => {
    const all = toArray(game.folders);
    return all.filter((f) => String(f?.type ?? "") === docType);
  };

  const getDocs = (docType) => {
    if (docType === "Actor") return toArray(game.actors);
    if (docType === "Item") return toArray(game.items);
    return [];
  };

  const buildTreeData = (docType, options = {}) => {
    const rootNameAllowlist = options.rootNameAllowlist ?? null;
    const includeUnfoldered = options.includeUnfoldered ?? true;
    const folders = getFolders(docType);
    const docs = getDocs(docType);
    const folderById = new Map(folders.map((f) => [f.id, f]));

    const parentFolderIdOf = (folderDoc) => {
      const raw = folderDoc?.folder ?? folderDoc?._source?.folder ?? null;
      const parentId = asId(raw);
      return parentId && folderById.has(parentId) ? parentId : null;
    };

    const folderIdOfDoc = (doc) => {
      const raw = doc?.folder ?? doc?._source?.folder ?? null;
      const folderId = asId(raw);
      return folderId && folderById.has(folderId) ? folderId : null;
    };

    const childrenByParentId = new Map();
    for (const f of folders) {
      const parentId = parentFolderIdOf(f);
      if (!childrenByParentId.has(parentId)) childrenByParentId.set(parentId, []);
      childrenByParentId.get(parentId).push(f);
    }
    for (const [, list] of childrenByParentId) list.sort(sortBySortThenName);

    const allRoots = childrenByParentId.get(null) ?? [];
    const roots = rootNameAllowlist
      ? allRoots.filter((f) => rootNameAllowlist.has(String(f.name ?? "").trim()))
      : allRoots;

    const includedFolderIds = new Set();
    const collectIncluded = (folder) => {
      if (!folder || includedFolderIds.has(folder.id)) return;
      includedFolderIds.add(folder.id);
      const kids = childrenByParentId.get(folder.id) ?? [];
      for (const k of kids) collectIncluded(k);
    };

    if (rootNameAllowlist) {
      for (const r of roots) collectIncluded(r);
    } else {
      for (const f of folders) includedFolderIds.add(f.id);
    }

    const docsByFolderId = new Map();
    for (const d of docs) {
      const folderId = folderIdOfDoc(d);
      if (!docsByFolderId.has(folderId)) docsByFolderId.set(folderId, []);
      docsByFolderId.get(folderId).push(d);
    }

    for (const [folderId, list] of docsByFolderId) {
      const folder = folderId ? folderById.get(folderId) : null;
      if (folder?.sorting === "a") list.sort(sortByName);
      else list.sort(sortBySortThenName);
    }

    const folderPathById = new Map();
    const folderDepthById = new Map();

    const resolveFolderPath = (folderId, trail = new Set()) => {
      if (!folderId) return null;
      if (folderPathById.has(folderId)) return folderPathById.get(folderId);
      if (trail.has(folderId)) {
        const cyc = `[cycle:${folderId}]`;
        folderPathById.set(folderId, cyc);
        return cyc;
      }

      const folder = folderById.get(folderId);
      if (!folder) return null;

      trail.add(folderId);
      const parentId = parentFolderIdOf(folder);
      const parentPath = parentId ? resolveFolderPath(parentId, trail) : null;
      const path = parentPath ? `${parentPath}/${folder.name}` : String(folder.name ?? "");
      folderPathById.set(folderId, path);

      const depth = parentId ? (folderDepthById.get(parentId) ?? 0) + 1 : 0;
      folderDepthById.set(folderId, depth);
      trail.delete(folderId);
      return path;
    };

    for (const f of folders) resolveFolderPath(f.id);

    const folderRecords = folders
      .filter((f) => includedFolderIds.has(f.id))
      .map((f) => {
        const parentFolderId = parentFolderIdOf(f);
        return {
          folderId: f.id,
          uuid: f.uuid ?? null,
          docType,
          name: String(f.name ?? ""),
          parentFolderId,
          depth: folderDepthById.get(f.id) ?? 0,
          sort: Number.isFinite(f.sort) ? f.sort : 0,
          sorting: String(f.sorting ?? "m"),
          path: folderPathById.get(f.id) ?? String(f.name ?? "")
        };
      })
      .sort((a, b) => {
        if (a.depth !== b.depth) return a.depth - b.depth;
        return a.path.localeCompare(b.path);
      });

    const documentRecords = docs
      .map((d) => {
        const folderId = folderIdOfDoc(d);
        if (!includeUnfoldered && !folderId) return null;
        if (folderId && !includedFolderIds.has(folderId)) return null;
        if (!folderId && rootNameAllowlist) return null;
        const folderPath = folderId ? folderPathById.get(folderId) ?? null : null;
        return {
          documentId: d.id,
          uuid: d.uuid ?? null,
          docType,
          subtype: String(d.type ?? ""),
          name: String(d.name ?? ""),
          folderId,
          folderPath,
          path: folderPath ? `${folderPath}/${d.name}` : String(d.name ?? ""),
          sort: Number.isFinite(d.sort) ? d.sort : 0
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.path.localeCompare(b.path));

    const treeLines = [];

    const pushDocs = (folderId, depth) => {
      const docsInFolder = docsByFolderId.get(folderId) ?? [];
      const pad = "  ".repeat(depth);
      for (const d of docsInFolder) {
        treeLines.push(
          `${pad}- [${docType.toUpperCase()}] ${d.name} {id:${d.id}, type:${String(d.type ?? "")}, folderId:${folderId ?? "null"}}`
        );
      }
    };

    const walk = (folder, depth) => {
      const parentFolderId = parentFolderIdOf(folder);
      const path = folderPathById.get(folder.id) ?? String(folder.name ?? "");
      const pad = "  ".repeat(depth);
      treeLines.push(
        `${pad}- [FOLDER] ${folder.name} {id:${folder.id}, parent:${parentFolderId ?? "null"}, depth:${depth}, path:${JSON.stringify(path)}}`
      );
      pushDocs(folder.id, depth + 1);
      const kids = childrenByParentId.get(folder.id) ?? [];
      for (const k of kids) walk(k, depth + 1);
    };

    for (const f of roots) walk(f, 0);

    const unfoldered = includeUnfoldered ? docsByFolderId.get(null) ?? [] : [];
    if (includeUnfoldered && unfoldered.length) {
      treeLines.push(`- [FOLDER] (Unfoldered) {id:null, parent:null, depth:0, path:"(Unfoldered)"}`);
      pushDocs(null, 1);
    }
    if (!treeLines.length) treeLines.push("- (none)");

    const folderTableLines = folderRecords.length
      ? [
          "| path | folderId | parentFolderId | depth | sort | sorting |",
          "| --- | --- | --- | ---: | ---: | --- |",
          ...folderRecords.map(
            (r) =>
              `| ${escapePipe(r.path)} | ${r.folderId} | ${r.parentFolderId ?? ""} | ${r.depth} | ${r.sort} | ${r.sorting} |`
          )
        ]
      : ["(none)"];

    const documentTableLines = documentRecords.length
      ? [
          "| path | documentId | name | subtype | folderId |",
          "| --- | --- | --- | --- | --- |",
          ...documentRecords.map(
            (r) =>
              `| ${escapePipe(r.path)} | ${r.documentId} | ${escapePipe(r.name)} | ${escapePipe(r.subtype)} | ${r.folderId ?? ""} |`
          )
        ]
      : ["(none)"];

    return {
      treeLines,
      folderTableLines,
      documentTableLines,
      folderRecords,
      documentRecords
    };
  };

  const actorData = buildTreeData("Actor", {
    rootNameAllowlist: ACTOR_ROOT_ALLOWLIST,
    includeUnfoldered: false
  });
  const itemData = buildTreeData("Item");

  const machineData = {
    format: "sinlesscsb-folder-tree-v2",
    world: {
      id: game.world?.id ?? null,
      title: worldTitle
    },
    generatedAtISO,
    guidance:
      "Use folderId + parentFolderId for hierarchy; do not infer hierarchy solely from indentation.",
    actor: {
      filter: {
        topLevelFolderNames: Array.from(ACTOR_ROOT_ALLOWLIST),
        includeUnfoldered: false
      },
      folders: actorData.folderRecords,
      documents: actorData.documentRecords
    },
    item: {
      folders: itemData.folderRecords,
      documents: itemData.documentRecords
    }
  };

  const md = [
    "# Folder Tree (Actors + Items)",
    "",
    `- World: **${worldTitle}**`,
    `- Generated (ISO): ${generatedAtISO}`,
    "- Format: `sinlesscsb-folder-tree-v2`",
    "",
    "## Parse Rules",
    "- Treat `folderId` and `parentFolderId` as canonical hierarchy keys.",
    "- Use `path` only as a convenience label; duplicate names can exist.",
    `- Actors are filtered to top-level folders: ${Array.from(ACTOR_ROOT_ALLOWLIST).join(", ")}.`,
    "- Use the JSON section for deterministic machine parsing.",
    "",
    "## Actors - Tree",
    ...actorData.treeLines,
    "",
    "### Actors - Folder Index",
    ...actorData.folderTableLines,
    "",
    "### Actors - Document Index",
    ...actorData.documentTableLines,
    "",
    "## Items - Tree",
    ...itemData.treeLines,
    "",
    "### Items - Folder Index",
    ...itemData.folderTableLines,
    "",
    "### Items - Document Index",
    ...itemData.documentTableLines,
    "",
    "## Machine Data (JSON)",
    "```json",
    JSON.stringify(machineData, null, 2),
    "```",
    ""
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
