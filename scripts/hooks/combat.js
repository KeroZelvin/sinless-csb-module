// scripts/hooks/combat.js
import { refreshPoolsForCombat } from "../rules/pools.js";

const MOD_ID = "sinlesscsb";

// Per-combat state: refresh once per round
const POOL_REFRESH_STATE = new Map(); // combatId -> { lastRoundRefreshed: number }

function getState(combatId) {
  if (!POOL_REFRESH_STATE.has(combatId)) {
    POOL_REFRESH_STATE.set(combatId, { lastRoundRefreshed: 0 });
  }
  return POOL_REFRESH_STATE.get(combatId);
}

function automationEnabled() {
  // GM-only: players receive updates via actor.update replication
  if (!game.user?.isGM) return false;

  // If you use this module setting, keep honoring it
  try {
    return !!game.settings.get(MOD_ID, "enableAutomation");
  } catch {
    // If setting is missing in some dev state, default on for GM
    return true;
  }
}

async function maybeRefreshPools(combat, changed = {}) {
  if (!combat) return;
  if (!automationEnabled()) return;

  const started = !!combat.started;
  const roundNow = Number(combat.round ?? 0);
  if (!started) return;
  if (!Number.isFinite(roundNow) || roundNow < 1) return;

  const state = getState(combat.id);

  // If combat rewinds/resets rounds, clear the remembered value
  if (state.lastRoundRefreshed > roundNow) state.lastRoundRefreshed = 0;

  // Refresh once per round
  if (state.lastRoundRefreshed === roundNow) return;

  await refreshPoolsForCombat(combat);

  state.lastRoundRefreshed = roundNow;

  // Keep a single concise log (optional—remove if you want silence)
  console.log("SinlessCSB | Pools refreshed", { combatId: combat.id, roundNow });
}

export function registerCombatHooks() {
  Hooks.on("updateCombat", async (combat, changed, options, userId) => {
    try {
      await maybeRefreshPools(combat, changed);
    } catch (e) {
      console.error("SinlessCSB | Pools refresh failed", e);
    }
  });

  // Cleanup state when an encounter is deleted
  Hooks.on("deleteCombat", (combat) => {
    if (combat?.id) POOL_REFRESH_STATE.delete(combat.id);
  });

  console.log("SinlessCSB | Combat hooks registered (pools)");
}
