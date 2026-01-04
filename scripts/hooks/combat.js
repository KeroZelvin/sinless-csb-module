import { refreshPoolsForCombat } from "../rules/pools.js";

const MOD_ID = "sinlesscsb";

function enabled() {
  return game.user.isGM
    && game.settings.get(MOD_ID, "enableAutomation")
    && game.settings.get(MOD_ID, "poolsEnable");
}

export function registerCombatHooks() {
  // Refresh when combat starts
  Hooks.on("combatStart", async (combat) => {
    if (!enabled()) return;
    if (!game.settings.get(MOD_ID, "poolsOnCombatStart")) return;

    try {
      await refreshPoolsForCombat(combat);
    } catch (e) {
      console.error("SinlessCSB | combatStart pool refresh failed", e);
    }
  });

  // Refresh when the round increments
  Hooks.on("updateCombat", async (combat, changed) => {
    if (!enabled()) return;
    if (!game.settings.get(MOD_ID, "poolsOnNewRound")) return;

    // Only act when the round changes
    if (typeof changed?.round !== "number") return;

    try {
      await refreshPoolsForCombat(combat);
    } catch (e) {
      console.error("SinlessCSB | new-round pool refresh failed", e);
    }
  });

  console.log("SinlessCSB | Combat hooks registered");
}
