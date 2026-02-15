import { MOD_ID } from "./_util.js";

const DEFAULT_COMPENDIUM_FILE = "compendium-index.md";
const COMPENDIUM_INDEX_FIELDS = [
  "name",
  "type",
  "folder",
  "img",
  "thumb",
  "texture.src",
  "prototypeToken.texture.src"
];

const DEFAULT_ACTOR_ROOT_ALLOWLIST = new Set([
  "PCs",
  "NPCs",
  "DroneHangar",
  "VehicleHangar",
  "Templates"
]);

function toArray(collectionLike) {
  if (!collectionLike) return [];
  if (Array.isArray(collectionLike)) return collectionLike;
  if (Array.isArray(collectionLike.contents)) return collectionLike.contents;
  if (typeof collectionLike.values === "function") return Array.from(collectionLike.values());
  return Array.from(collectionLike);
}

function asId(value) {
  if (!value) return null;
  if (typeof value === "string") return value || null;
  if (typeof value === "object") {
    if (typeof value.id === "string") return value.id || null;
    if (typeof value._id === "string") return value._id || null;
  }
  return null;
}

function asText(value, fallback = "") {
  return String(value ?? fallback);
}

function escapePipe(value) {
  return asText(value).replaceAll("|", "\\|");
}

function sortByName(a, b) {
  return asText(a?.name).localeCompare(asText(b?.name));
}

function getProp(obj, path) {
  if (!obj || !path) return undefined;
  if (foundry?.utils?.getProperty) return foundry.utils.getProperty(obj, path);
  return String(path)
    .split(".")
    .reduce((acc, part) => (acc == null ? acc : acc[part]), obj);
}

function safeName(s) {
  return (
    String(s ?? "")
      .trim()
      .replace(/[\\/:*?"<>|]+/g, "-")
      .replace(/\s+/g, "_")
      .slice(0, 80) || "world"
  );
}

function ensureGmOrWarn(contextLabel) {
  if (game.user?.isGM) return true;
  ui.notifications?.warn?.(`SinlessCSB | ${contextLabel} requires GM permissions.`);
  return false;
}

function getSaver() {
  const saver = foundry?.utils?.saveDataToFile ?? globalThis.saveDataToFile;
  if (typeof saver !== "function") throw new Error("No saveDataToFile available in this Foundry build.");
  return saver;
}

export async function exportCompendiumIndexMarkdown({
  moduleId = MOD_ID,
  fileName = DEFAULT_COMPENDIUM_FILE,
  notify = true
} = {}) {
  if (!ensureGmOrWarn("Compendium index export")) return null;

  const packs = toArray(game.packs).filter((p) => p.metadata?.packageName === moduleId);
  if (!packs.length) {
    ui.notifications?.warn?.(`SinlessCSB | No packs found for module "${moduleId}".`);
    return null;
  }

  const groups = new Map();
  for (const p of packs) {
    const t = p.metadata?.type ?? "Unknown";
    if (!groups.has(t)) groups.set(t, []);
    groups.get(t).push(p);
  }

  const orderedTypes = Array.from(groups.keys()).sort((a, b) => asText(a).localeCompare(asText(b)));
  const generatedAtISO = new Date().toISOString();
  const lines = [];

  lines.push("# SinlessCSB - Compendium Index");
  lines.push("");
  lines.push(`Generated: ${generatedAtISO}`);
  lines.push(`Module: ${moduleId}`);
  lines.push(`Foundry: ${game.version ?? "unknown"}`);
  lines.push("- Format: `sinlesscsb-compendium-index-v2`");
  lines.push("");
  lines.push("> Note: This file is generated. Add your human notes in the \"Notes\" sections, then keep it in Git under docs-internal/.");
  lines.push("");
  lines.push("## Parse Rules");
  lines.push("- Folder hierarchy is keyed by `folderId` + `parentFolderId`.");
  lines.push("- `folderPath` is convenience text; duplicates can exist.");
  lines.push("- Use UUID as canonical ID for batch updates.");
  lines.push("- Actor packs include both portrait image (`img`) and token image (`prototypeToken.texture.src`) when available.");
  lines.push("");

  let totalDocumentCount = 0;
  let totalPackCount = 0;

  for (const type of orderedTypes) {
    const packList = groups.get(type) ?? [];
    packList.sort((a, b) =>
      asText(a.metadata?.label ?? a.collection).localeCompare(asText(b.metadata?.label ?? b.collection))
    );

    lines.push(`## ${type} Packs`);
    lines.push("");

    for (const pack of packList) {
      totalPackCount += 1;
      const meta = pack.metadata ?? {};
      const label = meta.label ?? pack.title ?? pack.collection;
      const collection = pack.collection;

      lines.push(`### ${label}`);
      lines.push(`- Collection: \`${collection}\``);
      lines.push(`- Declared Type: \`${meta.type ?? "unknown"}\``);
      if (meta.system) lines.push(`- System: \`${meta.system}\``);
      if (meta.packageName) lines.push(`- Package: \`${meta.packageName}\``);
      lines.push("");

      try {
        if (typeof pack.initializeTree === "function") {
          await pack.initializeTree();
        }

        const rawFolders = toArray(pack.folders);
        const folderById = new Map();

        for (const folder of rawFolders) {
          const folderId = asId(folder?.id ?? folder?._id);
          if (!folderId) continue;
          folderById.set(folderId, folder);
        }

        const parentFolderIdOf = (folderDoc) => {
          const rawParent = folderDoc?.folder ?? folderDoc?._source?.folder ?? null;
          const parentId = asId(rawParent);
          return parentId && folderById.has(parentId) ? parentId : null;
        };

        const folderPathById = new Map();
        const folderDepthById = new Map();

        const resolveFolderPath = (folderId, trail = new Set()) => {
          if (!folderId) return null;
          if (folderPathById.has(folderId)) return folderPathById.get(folderId);
          if (trail.has(folderId)) {
            const cyc = `[cycle:${folderId}]`;
            folderPathById.set(folderId, cyc);
            folderDepthById.set(folderId, 0);
            return cyc;
          }

          const folder = folderById.get(folderId);
          if (!folder) return null;

          trail.add(folderId);
          const parentId = parentFolderIdOf(folder);
          const parentPath = parentId ? resolveFolderPath(parentId, trail) : null;
          const name = asText(folder.name);
          const path = parentPath ? `${parentPath}/${name}` : name;
          folderPathById.set(folderId, path);
          folderDepthById.set(folderId, parentId ? (folderDepthById.get(parentId) ?? 0) + 1 : 0);
          trail.delete(folderId);
          return path;
        };

        for (const folderId of folderById.keys()) {
          resolveFolderPath(folderId);
        }

        const folderRecords = Array.from(folderById.values())
          .map((folder) => {
            const folderId = asId(folder?.id ?? folder?._id);
            if (!folderId) return null;
            const parentFolderId = parentFolderIdOf(folder);
            return {
              folderId,
              parentFolderId,
              name: asText(folder.name),
              depth: folderDepthById.get(folderId) ?? 0,
              sort: Number.isFinite(folder?.sort) ? folder.sort : 0,
              path: folderPathById.get(folderId) ?? asText(folder.name)
            };
          })
          .filter(Boolean)
          .sort((a, b) => a.path.localeCompare(b.path));

        const childrenByParentId = new Map();
        for (const record of folderRecords) {
          const key = record.parentFolderId ?? null;
          if (!childrenByParentId.has(key)) childrenByParentId.set(key, []);
          childrenByParentId.get(key).push(record);
        }
        for (const list of childrenByParentId.values()) {
          list.sort((a, b) => {
            if (a.sort !== b.sort) return a.sort - b.sort;
            return a.name.localeCompare(b.name);
          });
        }

        const treeLines = [];
        const walkTree = (record, depth) => {
          const pad = "  ".repeat(depth);
          treeLines.push(
            `${pad}- [FOLDER] ${record.name} {folderId:${record.folderId}, parentFolderId:${record.parentFolderId ?? "null"}, depth:${depth}, path:${JSON.stringify(record.path)}}`
          );
          const kids = childrenByParentId.get(record.folderId) ?? [];
          for (const child of kids) walkTree(child, depth + 1);
        };

        const roots = childrenByParentId.get(null) ?? [];
        for (const root of roots) walkTree(root, 0);
        if (!treeLines.length) treeLines.push("- (none)");

        const index = await pack.getIndex({ fields: COMPENDIUM_INDEX_FIELDS });
        const rawIndexEntries = toArray(index);

        let missingIdCount = 0;
        const entries = [];
        for (const entry of rawIndexEntries) {
          const id = asId(entry?._id ?? entry?.id);
          if (!id) {
            missingIdCount += 1;
            continue;
          }

          const folderId = asId(entry?.folder ?? entry?._source?.folder ?? getProp(entry, "folder._id"));
          const folderPath = folderId ? folderPathById.get(folderId) ?? `[missing-folder:${folderId}]` : "(Unfoldered)";
          const img = asText(entry?.img ?? getProp(entry, "texture.src") ?? entry?.thumb ?? "");
          const tokenImg = asText(getProp(entry, "prototypeToken.texture.src") ?? "");
          const uuid = `Compendium.${collection}.${id}`;

          entries.push({
            id,
            uuid,
            name: asText(entry?.name),
            subtype: asText(entry?.type),
            folderId,
            folderPath,
            img,
            tokenImg
          });
        }

        entries.sort((a, b) => {
          const p = a.folderPath.localeCompare(b.folderPath);
          if (p) return p;
          return a.name.localeCompare(b.name);
        });

        totalDocumentCount += entries.length;

        const foldersReferencedByEntries = new Set(entries.map((e) => e.folderId).filter(Boolean));
        const missingFolderIds = Array.from(foldersReferencedByEntries).filter((id) => !folderById.has(id));

        const byName = new Map();
        for (const entry of entries) {
          const key = entry.name.trim().toLowerCase();
          if (!key) continue;
          if (!byName.has(key)) byName.set(key, []);
          byName.get(key).push(entry);
        }
        const duplicateNameGroups = Array.from(byName.values()).filter((list) => list.length > 1);

        const totalCount = entries.length;
        const folderedCount = entries.filter((e) => !!e.folderId).length;
        const unfolderedCount = totalCount - folderedCount;
        const imageCount = entries.filter((e) => !!e.img).length;
        const tokenImageCount = entries.filter((e) => !!e.tokenImg).length;

        lines.push(`**Count:** ${totalCount}`);
        lines.push(`- Folders detected: ${folderRecords.length}`);
        lines.push(`- Entries in folders: ${folderedCount}`);
        lines.push(`- Entries unfoldered: ${unfolderedCount}`);
        lines.push(`- Entries with \`img\`: ${imageCount}`);
        if (type === "Actor") lines.push(`- Actors with token image: ${tokenImageCount}`);
        if (missingFolderIds.length) lines.push(`- Missing folder metadata for folderId(s): ${missingFolderIds.join(", ")}`);
        if (missingIdCount > 0) lines.push(`- Entries skipped due to missing ID: ${missingIdCount}`);
        lines.push(`- Duplicate names in this pack: ${duplicateNameGroups.length}`);
        lines.push("");

        lines.push("#### Folder Tree");
        lines.push(...treeLines);
        lines.push("");

        lines.push("#### Folder Index");
        if (folderRecords.length) {
          lines.push("| path | folderId | parentFolderId | depth | sort |");
          lines.push("| --- | --- | --- | ---: | ---: |");
          for (const folder of folderRecords) {
            lines.push(
              `| ${escapePipe(folder.path)} | ${folder.folderId} | ${folder.parentFolderId ?? ""} | ${folder.depth} | ${folder.sort} |`
            );
          }
        } else {
          lines.push("(none)");
        }
        lines.push("");

        lines.push("#### Document Index");
        lines.push("| Name | UUID | folderPath | folderId | subtype | img | tokenImg |");
        lines.push("| --- | --- | --- | --- | --- | --- | --- |");
        for (const entry of entries) {
          lines.push(
            `| ${escapePipe(entry.name)} | \`${entry.uuid}\` | ${escapePipe(entry.folderPath)} | ${entry.folderId ?? ""} | ${escapePipe(entry.subtype)} | ${escapePipe(entry.img)} | ${escapePipe(entry.tokenImg)} |`
          );
        }
        lines.push("");

        if (duplicateNameGroups.length) {
          lines.push("#### Duplicate Name Warnings");
          lines.push("| name | count | folderPaths |");
          lines.push("| --- | ---: | --- |");
          for (const dupes of duplicateNameGroups.sort((a, b) => a[0].name.localeCompare(b[0].name))) {
            const displayName = dupes[0].name;
            const folderPaths = dupes.map((d) => d.folderPath).join(" ; ");
            lines.push(`| ${escapePipe(displayName)} | ${dupes.length} | ${escapePipe(folderPaths)} |`);
          }
          lines.push("");
        }

        lines.push("**Notes:**");
        lines.push("- _Add notes here in VS Code (e.g., curation status, dependencies, do-not-edit guidance, image swap notes)._");
        lines.push("");
      } catch (err) {
        lines.push(`**Error:** ${asText(err?.message ?? err, "Unknown error")}`);
        lines.push("");
      }
    }
  }

  const markdown = lines.join("\n");
  const saver = getSaver();
  saver(markdown, "text/markdown", fileName);

  if (notify) {
    ui.notifications?.info?.(`SinlessCSB | Downloaded ${fileName}.`);
  }

  return {
    type: "compendiumIndex",
    fileName,
    generatedAtISO,
    packCount: totalPackCount,
    documentCount: totalDocumentCount
  };
}

function getFolders(docType) {
  const all = toArray(game.folders);
  return all.filter((f) => String(f?.type ?? "") === docType);
}

function getDocs(docType) {
  if (docType === "Actor") return toArray(game.actors);
  if (docType === "Item") return toArray(game.items);
  return [];
}

function sortBySortThenName(a, b) {
  const sa = Number.isFinite(a?.sort) ? a.sort : 0;
  const sb = Number.isFinite(b?.sort) ? b.sort : 0;
  if (sa !== sb) return sa - sb;
  return sortByName(a, b);
}

function buildFolderTreeData(docType, options = {}) {
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
  for (const list of childrenByParentId.values()) list.sort(sortBySortThenName);

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
    treeLines.push("- [FOLDER] (Unfoldered) {id:null, parent:null, depth:0, path:\"(Unfoldered)\"}");
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
}

export async function exportFolderTreeMarkdown({
  fileName = null,
  actorRootAllowlist = null,
  notify = true
} = {}) {
  if (!ensureGmOrWarn("Folder tree export")) return null;

  const now = new Date();
  const generatedAtISO = now.toISOString();
  const dateStamp = generatedAtISO.slice(0, 10);
  const worldTitle = game.world?.title ?? game.world?.id ?? "world";
  const roots = actorRootAllowlist ? new Set(actorRootAllowlist) : new Set(DEFAULT_ACTOR_ROOT_ALLOWLIST);

  const resolvedFileName = fileName || `folder-tree_${safeName(worldTitle)}_${dateStamp}.md`;

  const actorData = buildFolderTreeData("Actor", {
    rootNameAllowlist: roots,
    includeUnfoldered: false
  });
  const itemData = buildFolderTreeData("Item");

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
        topLevelFolderNames: Array.from(roots),
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

  const markdown = [
    "# Folder Tree (Actors + Items)",
    "",
    `- World: **${worldTitle}**`,
    `- Generated (ISO): ${generatedAtISO}`,
    "- Format: `sinlesscsb-folder-tree-v2`",
    "",
    "## Parse Rules",
    "- Treat `folderId` and `parentFolderId` as canonical hierarchy keys.",
    "- Use `path` only as a convenience label; duplicate names can exist.",
    `- Actors are filtered to top-level folders: ${Array.from(roots).join(", ")}.`,
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

  const saver = getSaver();
  saver(markdown, "text/markdown", resolvedFileName);

  if (notify) {
    ui.notifications?.info?.(`SinlessCSB | Folder tree exported: ${resolvedFileName}`);
  }

  return {
    type: "folderTree",
    fileName: resolvedFileName,
    generatedAtISO,
    actorDocumentCount: actorData.documentRecords.length,
    itemDocumentCount: itemData.documentRecords.length
  };
}

export async function exportDevReferenceMarkdowns({
  moduleId = MOD_ID,
  compendiumFileName = DEFAULT_COMPENDIUM_FILE,
  folderTreeFileName = null,
  notify = true
} = {}) {
  if (!ensureGmOrWarn("Dev exports")) return null;

  const output = {
    compendium: null,
    folderTree: null,
    errors: []
  };

  try {
    output.compendium = await exportCompendiumIndexMarkdown({
      moduleId,
      fileName: compendiumFileName,
      notify: false
    });
  } catch (err) {
    output.errors.push({
      step: "compendium",
      message: asText(err?.message ?? err, "Unknown error")
    });
    console.error("SinlessCSB | exportCompendiumIndexMarkdown failed", err);
  }

  try {
    output.folderTree = await exportFolderTreeMarkdown({
      fileName: folderTreeFileName,
      notify: false
    });
  } catch (err) {
    output.errors.push({
      step: "folderTree",
      message: asText(err?.message ?? err, "Unknown error")
    });
    console.error("SinlessCSB | exportFolderTreeMarkdown failed", err);
  }

  if (notify) {
    if (output.errors.length === 0) {
      const folderName = output.folderTree?.fileName ?? "(none)";
      ui.notifications?.info?.(
        `SinlessCSB | Dev exports downloaded: ${compendiumFileName} + ${folderName}`
      );
    } else {
      ui.notifications?.warn?.(
        `SinlessCSB | Dev exports completed with ${output.errors.length} error(s). See console.`
      );
    }
  }

  return output;
}
