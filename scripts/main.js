Hooks.on("renderActorSheet", (app, html) => {
  console.log("SinlessCSB | renderActorSheet FIRED", {
    ctor: app?.constructor?.name,
    actor: app?.actor?.name,
    hasElement: !!app?.element
  });
  // ...existing code...
});

import { registerSheetHooks } from "./hooks/sheets.js";

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

game.settings.register("sinlesscsb", "initiativeMacroName", {
  name: "Initiative macro name",
  hint: "World macro to execute when clicking Roll Initiative on actor sheets.",
  scope: "world",
  config: true,
  type: String,
  default: "Sinless Roll Initiative"
});



  console.log("SinlessCSB | init");
});

Hooks.once("ready", () => {
  console.log("SinlessCSB | ready");
  registerSheetHooks();
  registerCombatHooks();
});
