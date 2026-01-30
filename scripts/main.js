/**
 * SinlessCSB — main.js
 *
 * Theme:
 *   document.documentElement.dataset.sinlessTheme = "crimson" | "purple"
 *
 * CSS scopes:
 *   html[data-sinless-theme="crimson"] ...
 *   html[data-sinless-theme="purple"]  ...
 */

import { registerSheetThemeHooks } from "./hooks/sheet-theme.js";
import { registerCombatHooks } from "./hooks/combat.js";
import { registerActorInitHooks } from "./hooks/actor-init.js";
import { registerVcrBonusHooks } from "./hooks/vcr-bonus-sync.js";

// NEW: Token bar mirroring + token-HUD editing for stunCur/physicalCur
import { registerTokenBarsBidirectionalHooks } from "./hooks/token-bars-bidirectional.js";

// API
import { castSpell } from "./api/cast-spell.js";
import { rollItem } from "./api/item-roll.js";
import { rollPools, refreshPools } from "./api/pools-roll.js";
import { rollInitiative, rollNpcInitiative } from "./api/initiative-roll.js";
import { registerChatThemeHooks } from "./hooks/chat-theme.js";
import { drawTableResultTile } from "./api/table-to-tile.js";
import { drawChasePath, clearChaseBoard } from "./api/chase-controls.js";
import { ensureOwnedDroneForItem, deployOwnedDrone, openOwnedDroneSheet } from "./api/drone-ops.js";
import { registerDroneOwnershipHooks } from "./hooks/drone-ownership.js";

const MOD_ID = "sinlesscsb";

/* ===============================
 * Force-load module CSS (robust)
 * =============================== */

/**
 * Foundry routes can make relative URLs resolve incorrectly (e.g. relative to /game).
 * Always inject with a leading "/" so it resolves from the site root:
 *   /modules/<id>/styles/<file>.css
 */
function ensureStyleLink(path) {
  try {
    const rooted = path.startsWith("/") ? path : `/${path}`;
    const abs = new URL(rooted, window.location.origin).toString();

    const existing = [...document.querySelectorAll('link[rel="stylesheet"]')]
      .some(l => String(l.href) === abs);

    if (existing) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = abs;
    document.head.appendChild(link);

    // Keep this log; it’s useful when CSS “goes missing”.
    console.log("SinlessCSB | stylesheet injected", abs);
  } catch (e) {
    console.error("SinlessCSB | ensureStyleLink failed", path, e);
  }
}

function ensureSinlessStylesLoaded() {
  // IMPORTANT: these should be /modules/... not modules/... (missing slash breaks on some routes)
  ensureStyleLink(`/modules/${MOD_ID}/styles/sinlesscsb-fonts.css`);
  ensureStyleLink(`/modules/${MOD_ID}/styles/sinlesscsb-ui-global.css`);
  ensureStyleLink(`/modules/${MOD_ID}/styles/sinlesscsb-theme-crimson.css`);
  ensureStyleLink(`/modules/${MOD_ID}/styles/sinlesscsb-theme-purple.css`);
}

/* ===============================
 * Client Theme Toggle (per-user)
 * =============================== */

function applyThemeToDOM() {
  const theme = game.settings.get(MOD_ID, "theme") || "purple";
  document.documentElement.dataset.sinlessTheme = theme;
}

function rerenderOpenWindows() {
  for (const app of Object.values(ui.windows ?? {})) {
    try { app.render?.(false); } catch (_e) {}
  }
}

/* ===============================
 * Module API surface
 * =============================== */

function exposeModuleAPI() {
  const mod = game.modules?.get(MOD_ID);
  if (!mod) {
    console.warn("SinlessCSB | cannot expose API: module not found", MOD_ID);
    return;
  }

  // Preserve existing keys if anything attached earlier
  mod.api = mod.api ?? {};

  Object.assign(mod.api, {
    castSpell,
    rollItem,
    rollPools,
    refreshPools,
    rollInitiative,
    rollNpcInitiative,
    drawTableResultTile,
    drawChasePath,
    clearChaseBoard,
    ensureOwnedDroneForItem,
    deployOwnedDrone,
    openOwnedDroneSheet
  });

  console.log("SinlessCSB | API exposed", Object.keys(mod.api));
}

/* ===============================
 * Hooks
 * =============================== */

Hooks.once("init", () => {
  console.log("SinlessCSB | init");

  // Load styles early so first-rendered sheets/dialogs are themed.
  ensureSinlessStylesLoaded();

  // Expose API as early as possible so CSB buttons can call it.
  exposeModuleAPI();

  // Actor init/clamp hooks (remaining-track model)
  registerActorInitHooks();

  // VCR bonus sync (highest vcrBonusDice from VCR items)
  registerVcrBonusHooks();

  // Drone ownership + deploy helpers
  registerDroneOwnershipHooks();

  // NEW: Enables token bars bound to system.props.*Bar and allows token HUD edits
  // to write back into stunCur / physicalCur while keeping your canonical keys.
  registerTokenBarsBidirectionalHooks();

  /* ---------------------------
   * Settings
   * --------------------------- */
  game.settings.register(MOD_ID, "enableAutomation", {
    name: "Enable SinlessCSB automation",
    hint: "Master toggle for all automated behaviors provided by SinlessCSB.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

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

  game.settings.register(MOD_ID, "csbPropsRoot", {
    name: "CSB props root",
    hint: "Where SinlessCSB reads/writes values on the Actor. Default is system.props (typical for CSB). Advanced users can change if their template differs.",
    scope: "world",
    config: true,
    type: String,
    default: "system.props"
  });

  game.settings.register(MOD_ID, "theme", {
    name: "Sinless Theme",
    hint: "Choose your SinlessCSB theme (applies only to your client).",
    scope: "client",
    config: true,
    type: String,
    choices: {
      crimson: "Crimson",
      purple: "Purple"
    },
    default: "purple",
    onChange: () => {
      ensureSinlessStylesLoaded();
      applyThemeToDOM();
      rerenderOpenWindows();
      ui.notifications?.info?.("SinlessCSB theme updated for your client.");
    }
  });

  game.settings.register(MOD_ID, "debugLogs", {
    name: "Debug logs",
    hint: "Enable verbose console logging for SinlessCSB (developer use).",
    scope: "client",
    config: true,
    type: Boolean,
    default: false
  });

  Hooks.on("renderActorSheet", (app) => {
    if (!game.settings.get(MOD_ID, "debugLogs")) return;
    console.log("SinlessCSB | renderActorSheet FIRED", {
      ctor: app?.constructor?.name,
      actor: app?.actor?.name,
      hasElement: !!app?.element
    });
  });
});

Hooks.once("ready", () => {
  console.log("SinlessCSB | ready");

  // Re-ensure CSS in this runtime (covers some Forge/local load edge cases)
  ensureSinlessStylesLoaded();

  // Apply theme on the client
  applyThemeToDOM();

  // Verify API is present after everything is live
  try {
    const apiKeys = Object.keys(game.modules?.get(MOD_ID)?.api ?? {});
    console.log("SinlessCSB | API keys (ready)", apiKeys);
  } catch (_e) {}

  registerSheetThemeHooks();
  registerCombatHooks();
  registerChatThemeHooks();
});
