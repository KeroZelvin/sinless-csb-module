// scripts/hooks/combat.js
import { refreshPoolsForCombat, refreshKismetForCombat } from "../rules/pools.js";
import { resetTrackAlert } from "../api/alert-tracking.js";

const MOD_ID = "sinlesscsb";

// Per-combat state
// combatId -> { lastRoundRefreshed: number, kismetRefreshedForStart: boolean }
const POOL_REFRESH_STATE = new Map();

function getState(combatId) {
  if (!POOL_REFRESH_STATE.has(combatId)) {
    POOL_REFRESH_STATE.set(combatId, {
      lastRoundRefreshed: 0,
      kismetRefreshedForStart: false
    });
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

async function maybeRefreshKismetOnCombatStart(combat) {
  if (!combat) return;
  if (!automationEnabled()) return;

  const state = getState(combat.id);
  const started = !!combat.started;

  // Allow refresh again next time this combat is started.
  if (!started) {
    state.kismetRefreshedForStart = false;
    return;
  }

  // Exactly once per "started" lifecycle for this combat.
  if (state.kismetRefreshedForStart) return;

  // Set the guard before awaiting to avoid duplicate refreshes on rapid updateCombat bursts.
  state.kismetRefreshedForStart = true;

  let refreshed = [];
  try {
    refreshed = await refreshKismetForCombat(combat);
  } catch (e) {
    state.kismetRefreshedForStart = false;
    throw e;
  }

  const total = refreshed.length;
  const updated = refreshed.filter(r => r?.updated).length;
  console.log("SinlessCSB | Kismet refreshed on combat start", {
    combatId: combat.id,
    actors: total,
    updated
  });
}

export function registerCombatHooks() {
  Hooks.on("updateCombat", async (combat, changed, options, userId) => {
    try {
      await maybeRefreshKismetOnCombatStart(combat);
      await maybeRefreshPools(combat, changed);

      if (!automationEnabled()) return;
      if (
        (Object.prototype.hasOwnProperty.call(changed ?? {}, "active") && changed.active === false) ||
        (Object.prototype.hasOwnProperty.call(changed ?? {}, "started") && changed.started === false)
      ) {
        await resetTrackAlert({ allowSocket: false, reason: "combatEnd" });
      }
    } catch (e) {
      console.error("SinlessCSB | Combat automation failed", e);
    }
  });

  // Cleanup state when an encounter is deleted
  Hooks.on("deleteCombat", async (combat) => {
    if (combat?.id) POOL_REFRESH_STATE.delete(combat.id);
    try {
      if (automationEnabled()) {
        await resetTrackAlert({ allowSocket: false, reason: "deleteCombat" });
      }
    } catch (e) {
      console.warn("SinlessCSB | Track Alert reset (deleteCombat) failed", e);
    }
  });

  console.log("SinlessCSB | Combat hooks registered (pools)");
}
