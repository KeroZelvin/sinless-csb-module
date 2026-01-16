// scripts/api/table-to-tile.js
// Foundry v13: draw a RollTable result and place the card face as a Tile.
// Preferences:
// 1) Use result.img if it's a real image (not the d20 placeholder)
// 2) Else, parse <img src="..."> from result.description or result.text
// Optional hardening:
// - strictModuleAssets: require src to start with "modules/sinlesscsb/"

const MOD_ID = "sinlesscsb";

function normalizeStr(x) {
  const s = String(x ?? "").trim();
  return s.length ? s : null;
}

function isPlaceholderImg(src) {
  const s = String(src ?? "");
  return !s || s === "icons/svg/d20-black.svg" || s.endsWith("/d20-black.svg");
}

function looksLikeImagePath(src) {
  const s = String(src ?? "").toLowerCase();
  // Foundry supports webp/png/jpg/jpeg/svg and also videos (webm/mp4) for tiles,
  // but here we expect webp/png/jpg commonly.
  return (
    s.endsWith(".webp") ||
    s.endsWith(".png") ||
    s.endsWith(".jpg") ||
    s.endsWith(".jpeg") ||
    s.endsWith(".svg") ||
    s.endsWith(".webm") ||
    s.endsWith(".mp4")
  );
}

function extractFirstImgSrcFromHTML(html) {
  const s = normalizeStr(html);
  if (!s) return null;

  try {
    const doc = new DOMParser().parseFromString(s, "text/html");
    const img = doc.querySelector("img");
    return normalizeStr(img?.getAttribute("src"));
  } catch (_) {
    const m = s.match(/<img[^>]+src=["']([^"']+)["']/i);
    return normalizeStr(m?.[1]);
  }
}

function enforceStrictModuleAssets(src, strictModuleAssets) {
  if (!strictModuleAssets) return src;
  return src?.startsWith(`modules/${MOD_ID}/`) ? src : null;
}

function pickCardImageFromResult(result, { strictModuleAssets = false } = {}) {
  // 1) Prefer result.img, if it is not placeholder
  const img = normalizeStr(result?.img);
  if (img && !isPlaceholderImg(img) && looksLikeImagePath(img)) {
    return enforceStrictModuleAssets(img, strictModuleAssets);
  }

  // 2) Fallback: parse from description
  const descSrc = extractFirstImgSrcFromHTML(result?.description);
  if (descSrc && looksLikeImagePath(descSrc)) {
    return enforceStrictModuleAssets(descSrc, strictModuleAssets);
  }

  // 3) Fallback: parse from text
  const textSrc = extractFirstImgSrcFromHTML(result?.text);
  if (textSrc && looksLikeImagePath(textSrc)) {
    return enforceStrictModuleAssets(textSrc, strictModuleAssets);
  }

  return null;
}

function getSceneCenterXY(scene) {
  const d = scene?.dimensions;
  const rect = d?.sceneRect;
  if (rect?.center) return { x: rect.center.x, y: rect.center.y };
  const w = d?.sceneWidth ?? 4000;
  const h = d?.sceneHeight ?? 3000;
  return { x: w / 2, y: h / 2 };
}

async function resolveRollTable({ tableUuid, tableName } = {}) {
  const u = normalizeStr(tableUuid);
  if (u) {
    const doc = await fromUuid(u);
    if (doc?.documentName === "RollTable") return doc;
    throw new Error(`tableUuid did not resolve to a RollTable: ${u}`);
  }

  const n = normalizeStr(tableName);
  if (!n) throw new Error("No tableUuid or tableName provided.");

  // World table lookup (exact name, then case-insensitive)
  const exact = game.tables?.getName?.(n);
  if (exact) return exact;

  const lower = n.toLowerCase();
  const found = (game.tables?.contents ?? []).find(t => String(t.name ?? "").trim().toLowerCase() === lower);
  if (found) return found;

  throw new Error(`RollTable not found by name: "${n}"`);
}

/**
 * Draw a RollTable result and place as a Tile.
 *
 * cfg:
 * - tableUuid/tableName
 * - sceneId (defaults to canvas.scene)
 * - x/y/width/height/rotation/hidden
 * - center: treat x/y as center (default true)
 * - tag: if provided, and replaceTag true, deletes previous tiles with same tag
 * - replaceTag: default true
 * - extraFlags: merged into flags[MOD_ID]
 * - strictModuleAssets: default false; if true, requires src under modules/sinlesscsb/
 */
export async function drawTableResultTile(cfg = {}) {
  if (!game.user?.isGM) {
    ui.notifications?.warn?.("SinlessCSB | drawTableResultTile requires GM permissions (creating tiles).");
    return null;
  }

  const table = await resolveRollTable(cfg);
  const scene =
    (cfg.sceneId && game.scenes?.get(cfg.sceneId)) ||
    canvas?.scene ||
    null;

  if (!scene) throw new Error("No active scene and no sceneId provided.");

  // Draw without chat spam
  const draw = await table.draw({ displayChat: false });
  const result = draw?.results?.[0] ?? null;
  if (!result) throw new Error(`RollTable.draw returned no results for table: ${table.name}`);

  const strictModuleAssets = Boolean(cfg.strictModuleAssets);
  const src = pickCardImageFromResult(result, { strictModuleAssets });

  if (!src) {
    const strictMsg = strictModuleAssets
      ? ` (strictModuleAssets enabled: expected src under modules/${MOD_ID}/...)`
      : "";
    throw new Error(
      `No usable card image found on result. Ensure result.img is set to your card face, or include <img src="..."> in description.${strictMsg} Table="${table.name}"`
    );
  }

  const width = Number.isFinite(Number(cfg.width)) ? Number(cfg.width) : 480;
  const height = Number.isFinite(Number(cfg.height)) ? Number(cfg.height) : 720;
  const rotation = Number.isFinite(Number(cfg.rotation)) ? Number(cfg.rotation) : 0;
  const hidden = Boolean(cfg.hidden);
  const center = (cfg.center ?? false) === true; // default: top-left coordinates


  const sceneCenter = getSceneCenterXY(scene);
  let x = Number.isFinite(Number(cfg.x)) ? Number(cfg.x) : sceneCenter.x;
  let y = Number.isFinite(Number(cfg.y)) ? Number(cfg.y) : sceneCenter.y;

  if (center) {
    x -= (width / 2);
    y -= (height / 2);
  }

  const tag = normalizeStr(cfg.tag);
  const replaceTag = (cfg.replaceTag ?? true) !== false;

  // Safe replacement: remove only tiles with matching tag
  if (tag && replaceTag) {
    const priorIds = (scene.tiles ?? [])
      .filter(t => t?.flags?.[MOD_ID]?.tag === tag)
      .map(t => t.id);

    if (priorIds.length) await scene.deleteEmbeddedDocuments("Tile", priorIds);
  }

const isChase = cfg?.extraFlags?.chase === true;

  const tileData = {
    x, y, width, height, rotation,
    hidden,
    locked: !isChase, // chase tiles draggable; other uses remain locked
    texture: { src }, // v13 uses texture.src
    flags: {
      [MOD_ID]: {
        tag: tag ?? null,
        ...(cfg.extraFlags ?? {}),
        tableUuid: table.uuid,
        resultId: result.id ?? null,
        resultName: result.name ?? null,
        resultImg: normalizeStr(result?.img) ?? null
      }
    }
  };

  const created = await scene.createEmbeddedDocuments("Tile", [tileData]);
  const tile = created?.[0] ?? null;
  if (!tile) throw new Error("Failed to create tile.");

  return { tile, result, roll: draw.roll ?? null, src };
}
