import { registerCombatHooks } from "./hooks/combat.js";

const MOD_ID = "sinlesscsb";

Hooks.once("init", () => {
  // Core toggles
  game.settings.register(MOD_ID, "enableAutomation", {
    name: "Enable SinlessCSB automation",
    hint: "Master toggle for all automated behaviors provided by SinlessCSB.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  // Pool refresh toggles
  game.settings.register(MOD_ID, "poolsEnable", {
    name: "Auto-refresh pools",
    hint: "Automatically refresh PC attribute pools from base stats.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MOD_ID, "poolsOnCombatStart", {
    name: "Refresh pools on combat start",
    hint: "Refresh PC pools when combat begins (combatStart).",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MOD_ID, "poolsOnNewRound", {
    name: "Refresh pools at start of each new round",
    hint: "Refresh PC pools whenever the combat round increments (round change).",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  // CSB data path toggle (kept simple, but avoids hardcoding forever)
  game.settings.register(MOD_ID, "csbPropsRoot", {
    name: "CSB props root",
    hint: "Where SinlessCSB reads/writes values on the Actor. Default is system.props (typical for CSB). Advanced users can change if their template differs.",
    scope: "world",
    config: true,
    type: String,
    default: "system.props"
  });

  console.log("SinlessCSB | init");
});

Hooks.once("ready", () => {
  console.log("SinlessCSB | ready");
  registerCombatHooks();
});
