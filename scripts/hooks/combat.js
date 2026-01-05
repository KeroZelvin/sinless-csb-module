// scripts/hooks/combat.js
import { refreshPoolsForCombat } from "../rules/pools.js";

/**
 * Prevent duplicate refreshes:
 * - once when combat "starts" (started flips false->true)
 * - once per round number
 */
const _combatRefreshState = new Map(); // combatId -> { startedSeen: boolean, lastRoundRefreshed: number }

function _getState(combat) {
  const id = combat?.id ?? combat?._id;
  if (!id) return null;
  if (!_combatRefreshState.has(id)) _combatRefreshState.set(id, { startedSeen: false, lastRoundRefreshed: 0 });
  return _combatRefreshState.get(id);
}

async function _refreshIfNeeded(combat, changed) {
  if (!combat) return;

  const st = _getState(combat);
  if (!st) return;

  const startedNow = !!combat.started;
  const roundNow = Number(combat.round ?? 0);

  const startedFlippedOn = (changed?.started === true) && startedNow;
  const roundChanged = (typeof changed?.round === "number") && (changed.round !== st.lastRoundRefreshed);

  // Decide when to refresh:
  // A) Combat start: when started flips on (covers the “click initiative die to begin” path)
  // B) Round increment: when changed.round is present and we haven't done this round
  const shouldRefresh =
    startedFlippedOn ||
    (startedNow && roundChanged && roundNow >= 1);

  // Debug (keep until stable)
  console.log("SinlessCSB | Pools hook check", {
    combatId: combat.id,
    startedNow,
    roundNow,
    turnNow: combat.turn,
    changed,
    state: { ...st },
    decision: shouldRefresh ? "REFRESH" : "skip"
  });

  if (!shouldRefresh) return;

  // Update guards BEFORE awaiting, so rapid consecutive updates don't double-fire.
  if (startedFlippedOn) st.startedSeen = true;
  st.lastRoundRefreshed = roundNow;

  try {
    await refreshPoolsForCombat(combat);
    console.log("SinlessCSB | Pools refreshed", { combatId: combat.id, roundNow });
  } catch (e) {
    console.error("SinlessCSB | refreshPoolsForCombat failed", e);
  }
}

export function registerCombatHooks() {
  Hooks.on("updateCombat", (combat, changed /*, options, userId */) => {
    // Fire-and-forget; we handle internal dedupe.
    _refreshIfNeeded(combat, changed);
  });

  // Optional: clear state when combat ends/deletes (keeps memory clean)
  Hooks.on("deleteCombat", (combat) => {
    const id = combat?.id ?? combat?._id;
    if (id) _combatRefreshState.delete(id);
  });
}
