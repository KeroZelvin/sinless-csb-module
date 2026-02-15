/**
 * SinlessCSB - Export Compendium Index (Markdown, download-only)
 * Foundry v13+
 *
 * Output file: docs-internal/compendium-index.md (you will move it into the repo)
 *
 * This export is folder-aware:
 * - Includes compendium folder tree + folder index per pack
 * - Includes per-document folder path + image fields for batch art swaps
 */

(async () => {
  const MODULE_ID = "sinlesscsb";
  const FILE_NAME = "compendium-index.md";
  const INDEX_FIELDS = [
    "name",
    "type",
    "folder",
    "img",
    "thumb",
    "texture.src",
    "prototypeToken.texture.src"
  ];

  if (!game.user?.isGM) {
    ui.notifications.warn("GM only: exporting compendium indices requires GM permissions.");
    return;
  }

  const toArray = (collectionLike) => {
    if (!collectionLike) return [];
    if (Array.isArray(collectionLike)) return collectionLike;
    if (Array.isArray(collectionLike.contents)) return collectionLike.contents;
    if (typeof collectionLike.values === "function") return Array.from(collectionLike.values());
    return Array.from(collectionLike);
  };

  const asId = (value) => {
    if (!value) return null;
    if (typeof value === "string") return value || null;
    if (typeof value === "object") {
      if (typeof value.id === "string") return value.id || null;
      if (typeof value._id === "string") return value._id || null;
    }
    return null;
  };

  const getProp = (obj, path) => {
    if (!obj || !path) return undefined;
    if (foundry?.utils?.getProperty) return foundry.utils.getProperty(obj, path);
    return String(path)
      .split(".")
      .reduce((acc, part) => (acc == null ? acc : acc[part]), obj);
  };

  const escapePipe = (value) => String(value ?? "").replaceAll("|", "\\|");
  const asText = (value, fallback = "") => String(value ?? fallback);
  const sortByName = (a, b) => asText(a?.name).localeCompare(asText(b?.name));

  const packs = toArray(game.packs).filter((p) => p.metadata?.packageName === MODULE_ID);
  if (!packs.length) {
    ui.notifications.warn(`No packs found for module "${MODULE_ID}".`);
    return;
  }

  // Group packs by document type (Actor/Item/Macro/JournalEntry/etc.)
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
  lines.push(`Module: ${MODULE_ID}`);
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

  for (const type of orderedTypes) {
    const packList = groups.get(type) ?? [];
    packList.sort((a, b) =>
      asText(a.metadata?.label ?? a.collection).localeCompare(asText(b.metadata?.label ?? b.collection))
    );

    lines.push(`## ${type} Packs`);
    lines.push("");

    for (const pack of packList) {
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
        // Compendium folders may be lazy; initialize tree first if available.
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

        const index = await pack.getIndex({ fields: INDEX_FIELDS });
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

  const md = lines.join("\n");
  const saver = foundry?.utils?.saveDataToFile ?? saveDataToFile;
  saver(md, "text/markdown", FILE_NAME);

  ui.notifications.info(`Downloaded ${FILE_NAME}. Move it into your repo at docs-internal/${FILE_NAME}.`);
})();
