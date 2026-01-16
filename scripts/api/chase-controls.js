// scripts/api/chase-controls.js
import { drawTableResultTile } from "./table-to-tile.js";
import { openDialogV2 } from "./_util.js";

const MOD_ID = "sinlesscsb";
const PILES_FLAG_KEY = "carchasePilesV1";   // scene flag: dealt piles + cursors
const PATHS_FLAG_KEY = "carchasePaths";     // scene flag: 2 or 3 (GM-controlled)

/* ----------------------------- Dialog helpers ----------------------------- */

async function confirmClearChaseBoard() {
  const out = await openDialogV2({
    title: "Clear Car Chase Board",
    content: `
      <p>This will remove chase card tiles from the scene and reset the chase piles (fresh shuffle/deal).</p>
      <p><strong>Continue?</strong></p>
    `,
    rejectClose: false,
    buttons: [
      { action: "confirm", label: "Yes", default: false, callback: () => "confirm" },
      { action: "cancel", label: "Cancel", default: true, callback: () => "cancel" }
    ]
  });
  return out === "confirm";
}

/* ----------------------------- Utility helpers ---------------------------- */

function clampPaths(n) {
  const x = Number(n);
  return x === 3 ? 3 : 2;
}

function slotsForPaths(paths) {
  return (paths === 3) ? ["primary", "secondary", "tertiary"] : ["primary", "secondary"];
}

async function getActivePaths(scene, requestedPaths, slot) {
  // If tertiary is invoked, we must be in 3-path mode.
  const implied = (String(slot) === "tertiary") ? 3 : null;

  const sceneVal = clampPaths(scene.getFlag(MOD_ID, PATHS_FLAG_KEY));
  const reqVal = (requestedPaths != null) ? clampPaths(requestedPaths) : null;

  // precedence: implied (tertiary) > requested > scene flag > default 2
  const active = clampPaths(implied ?? reqVal ?? sceneVal ?? 2);

  // Persist if different (keeps state stable across calls)
  if (active !== sceneVal) {
    await scene.setFlag(MOD_ID, PATHS_FLAG_KEY, active);
  }

  return active;
}

function shuffleArrayInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

function num(x, fallback = 0) {
  const n = Number(x);
  return Number.isFinite(n) ? n : fallback;
}

function tileMatchesSlotRect(tile, { x, y, width, height }, tol = 2) {
  if (!tile) return false;
  return (
    Math.abs(num(tile.x) - num(x)) <= tol &&
    Math.abs(num(tile.y) - num(y)) <= tol &&
    Math.abs(num(tile.width) - num(width)) <= tol &&
    Math.abs(num(tile.height) - num(height)) <= tol
  );
}

async function resolveRollTableByUuid(tableUuid) {
  const u = String(tableUuid ?? "");
  const doc = await fromUuid(u);
  if (doc?.documentName !== "RollTable") throw new Error(`Not a RollTable UUID: ${u}`);
  return doc;
}

/* ---------------------------- Pile state logic ---------------------------- */

function buildFreshPiles(table, slots) {
  // Use TableResult ids as the canonical "card identities"
  const ids = (table.results ?? []).map(r => String(r.id));
  shuffleArrayInPlace(ids);

  const piles = {};
  const cursor = {};
  for (const s of slots) {
    piles[s] = [];
    cursor[s] = 0;
  }

  // Deal round-robin into piles (like physical piles)
  for (let i = 0; i < ids.length; i++) {
    piles[slots[i % slots.length]].push(ids[i]);
  }

  return {
    version: 1,
    tableUuid: table.uuid,
    slots: [...slots],
    piles,
    cursor
  };
}

// Re-deal remaining cards into new slot set (2<->3) WITHOUT resetting the deck
function migratePiles(state, newSlots) {
  const oldSlots = Array.isArray(state?.slots) ? state.slots : [];
  const piles = state?.piles ?? {};
  const cursor = state?.cursor ?? {};

  // Preserve remaining order by concatenating remaining cards pile-by-pile
  const remaining = [];
  for (const s of oldSlots) {
    const list = Array.isArray(piles[s]) ? piles[s] : [];
    const idx = Number.isFinite(Number(cursor[s])) ? Number(cursor[s]) : 0;
    remaining.push(...list.slice(idx));
  }

  const newPiles = {};
  const newCursor = {};
  for (const s of newSlots) {
    newPiles[s] = [];
    newCursor[s] = 0;
  }

  // Deal remaining round-robin into new piles
  for (let i = 0; i < remaining.length; i++) {
    newPiles[newSlots[i % newSlots.length]].push(remaining[i]);
  }

  return {
    version: 1,
    tableUuid: state.tableUuid,
    slots: [...newSlots],
    piles: newPiles,
    cursor: newCursor
  };
}

async function ensurePiles(scene, table, slots) {
  const cur = scene.getFlag(MOD_ID, PILES_FLAG_KEY);

  const curSlots = Array.isArray(cur?.slots) ? cur.slots : null;
  const sameSlots = curSlots && curSlots.join("|") === slots.join("|");
  const sameTable = cur?.tableUuid === table.uuid;

  // Valid existing piles
  if (cur && cur.version === 1 && sameTable && sameSlots && cur.piles && cur.cursor) {
    return cur;
  }

  // Migrate if table same but slots differ
  if (cur && cur.version === 1 && sameTable && cur.piles && cur.cursor && curSlots) {
    const migrated = migratePiles(cur, slots);
    await scene.setFlag(MOD_ID, PILES_FLAG_KEY, migrated);
    return migrated;
  }

  // Otherwise fresh (new chase / after reset)
  const fresh = buildFreshPiles(table, slots);
  await scene.setFlag(MOD_ID, PILES_FLAG_KEY, fresh);
  return fresh;
}

/* ------------------------------- API exports ------------------------------ */

/**
 * Draw a chase card into a slot rectangle (TOP-LEFT coordinates).
 * - Deck is dealt into 2 piles by default; upgrades to 3 on tertiary usage or if scene flag is set to 3.
 * - No repeats across all piles (single deck distributed).
 * - Does NOT delete cards you dragged away; it only replaces the tile still in the slot rectangle.
 *
 * Params:
 * - slot: "primary"|"secondary"|"tertiary"
 * - tableUuid: compendium RollTable UUID
 * - x,y,width,height: TOP-LEFT rect for the slot
 * - tol: matching tolerance (pixels) for “tile currently in slot”
 * - paths: optional override (2/3). Tertiary implies 3 regardless.
 * - strictModuleAssets: forwarded to drawTableResultTile (optional hardening)
 */
export async function drawChasePath({
  slot = "primary",
  tableUuid,
  sceneId,
  x, y, width, height,
  hidden = false,
  strictModuleAssets = false,
  tol = 2,
  paths = null
} = {}) {
  if (!game.user?.isGM) {
    ui.notifications?.warn?.("SinlessCSB | drawChasePath requires GM permissions.");
    return null;
  }

  const scene = (sceneId && game.scenes?.get(sceneId)) || canvas?.scene || null;
  if (!scene) throw new Error("No active scene and no sceneId provided.");
  if (!tableUuid) throw new Error("drawChasePath requires tableUuid.");

  const table = await resolveRollTableByUuid(tableUuid);

  const activePaths = await getActivePaths(scene, paths, slot);
  const slots = slotsForPaths(activePaths);

  slot = String(slot);
  if (!slots.includes(slot)) {
    throw new Error(`Slot "${slot}" not available in ${activePaths}-path mode.`);
  }

  // Ensure pile state exists (or migrate if switching 2<->3)
  let state = await ensurePiles(scene, table, slots);

  // If pile exhausted, reshuffle/deal fresh (mode preserved)
  const pile = Array.isArray(state.piles?.[slot]) ? state.piles[slot] : [];
  let idx = Number.isFinite(Number(state.cursor?.[slot])) ? Number(state.cursor[slot]) : 0;

  if (idx >= pile.length) {
    state = buildFreshPiles(table, slots);
    await scene.setFlag(MOD_ID, PILES_FLAG_KEY, state);
    idx = 0;
  }

  const resultId = pile[idx];
  const picked = (table.results ?? []).find(r => String(r.id) === String(resultId));
  if (!picked) {
    throw new Error(`TableResult not found for id ${resultId} (slot "${slot}").`);
  }

  // Delete ONLY the chase tile currently occupying this slot rect (do not delete dragged peeks)
  const toDelete = (scene.tiles ?? [])
    .filter(t => t?.flags?.[MOD_ID]?.chase === true)
    .filter(t => String(t?.flags?.[MOD_ID]?.chaseSlot ?? "") === slot)
    .filter(t => tileMatchesSlotRect(t, { x, y, width, height }, tol))
    .map(t => t.id);

  if (toDelete.length) await scene.deleteEmbeddedDocuments("Tile", toDelete);

  // Place the chosen card as a tile (TOP-LEFT coords; no tag replacement)
  const out = await drawTableResultTile({
    tableUuid,
    sceneId: scene.id,
    x, y, width, height,
    center: false,               // top-left semantics
    hidden: Boolean(hidden),
    replaceTag: false,           // critical: don't auto-delete by tag (dragged peeks persist)
    strictModuleAssets: Boolean(strictModuleAssets),
    forcedResult: picked,
    extraFlags: {
      chase: true,
      chaseSlot: slot
    }
  });

  // Advance pile cursor and persist
  state.cursor[slot] = idx + 1;
  await scene.setFlag(MOD_ID, PILES_FLAG_KEY, state);

  return out;
}

/**
 * Clear ONLY chase tiles created by this API (flags.sinlesscsb.chase === true),
 * and reset the dealt piles/deck state.
 *
 * IMPORTANT: Preserves current mode (carchasePaths). GM can change mode separately.
 */
export async function clearChaseBoard({
  sceneId,
  slots = null,
  requireConfirm = true
} = {}) {
  if (!game.user?.isGM) {
    ui.notifications?.warn?.("SinlessCSB | clearChaseBoard requires GM permissions.");
    return null;
  }

  const scene = (sceneId && game.scenes?.get(sceneId)) || canvas?.scene || null;
  if (!scene) throw new Error("No active scene and no sceneId provided.");

  if (requireConfirm) {
    const ok = await confirmClearChaseBoard();
    if (!ok) return { cleared: 0, cancelled: true };
  }

  const slotSet = Array.isArray(slots) && slots.length
    ? new Set(slots.map(s => String(s)))
    : null;

  const toDelete = (scene.tiles ?? [])
    .filter(t => t?.flags?.[MOD_ID]?.chase === true)
    .filter(t => !slotSet || slotSet.has(String(t?.flags?.[MOD_ID]?.chaseSlot)))
    .map(t => t.id);

  if (toDelete.length) await scene.deleteEmbeddedDocuments("Tile", toDelete);

  // Reset pile/deck state ONLY; preserve carchasePaths mode.
  await scene.unsetFlag(MOD_ID, PILES_FLAG_KEY);

  return { cleared: toDelete.length };
}
