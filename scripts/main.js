/**
 * SinlessCSB — main.js
 * Adds client-selectable theme toggle:
 *   - "Crimson" (default) = SR5-inspired theme
 *   - "Purple"           = SR6-inspired dark theme
 *
 * Theme is applied by setting:
 *   document.documentElement.dataset.sinlessTheme = "crimson" | "purple"
 *
 * Your CSS should scope like:
 *   html[data-sinless-theme="crimson"] .custom-system.sinlesscsb { ... }
 *   html[data-sinless-theme="purple"]  .custom-system.sinlesscsb { ... }
 */

import { registerSheetHooks } from "./hooks/sheets.js";
import { registerCombatHooks } from "./hooks/combat.js";
import { registerActorInitHooks } from "./hooks/actor-init.js"; // NEW

// Spell API
import { castSpell } from "./api/cast-spell.js";

const MOD_ID = "sinlesscsb";

/* ===============================
 * Force-load module CSS (robust)
 * =============================== */
function ensureStyleLink(href) {
  try {
    const abs = new URL(href, window.location.href).toString();

    // Already present?
    const existing = [...document.querySelectorAll('link[rel="stylesheet"]')]
      .some(l => l.href === abs);
    if (existing) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = href;
    document.head.appendChild(link);

    console.log("SinlessCSB | stylesheet injected", href);
  } catch (e) {
    console.error("SinlessCSB | ensureStyleLink failed", href, e);
  }
}

function ensureSinlessStylesLoaded() {
  // These files are served and reachable; inject them so theme applies even if
  // Foundry's module "styles" loader doesn't create <link> tags in this runtime.
  ensureStyleLink("modules/sinlesscsb/styles/sinlesscsb-fonts.css");
  ensureStyleLink("modules/sinlesscsb/styles/sinlesscsb-ui-global.css");
  ensureStyleLink("modules/sinlesscsb/styles/sinlesscsb-theme-crimson.css");
  ensureStyleLink("modules/sinlesscsb/styles/sinlesscsb-theme-purple.css");
}

/* ===============================
 * Client Theme Toggle (per-user)
 * =============================== */
function applyThemeToDOM() {
  const theme = game.settings.get(MOD_ID, "theme") || "crimson";
  document.documentElement.dataset.sinlessTheme = theme;
}

function rerenderOpenWindows() {
  for (const app of Object.values(ui.windows)) {
    try {
      app.render?.(false);
    } catch (_e) {}
  }
}

/* ===============================
 * Debug hook (optional)
 * =============================== */
Hooks.on("renderActorSheet", (app, html) => {
  console.log("SinlessCSB | renderActorSheet FIRED", {
    ctor: app?.constructor?.name,
    actor: app?.actor?.name,
    hasElement: !!app?.element
  });
  // ...existing code...
});

/* ===============================
 * Module API surface
 * =============================== */
function exposeModuleAPI() {
  const mod = game.modules?.get(MOD_ID);
  if (!mod) {
    console.warn("SinlessCSB | cannot expose API: module not found", MOD_ID);
    return;
  }

  // Merge to avoid overwriting existing keys (future-proof).
  mod.api = {
    ...(mod.api ?? {}),
    castSpell
  };

  console.log("SinlessCSB | API exposed", Object.keys(mod.api));
}

Hooks.once("init", () => {
  // Expose API as early as possible so CSB buttons can call it.
  exposeModuleAPI();

  // NEW: Track initialization/clamping hooks (remaining-track model)
  registerActorInitHooks();

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

  // Initiative macro name (world)
  game.settings.register(MOD_ID, "initiativeMacroName", {
    name: "Initiative macro name",
    hint: "World macro to execute when clicking Roll Initiative on actor sheets.",
    scope: "world",
    config: true,
    type: String,
    default: "Sinless Roll Initiative"
  });

  // Theme toggle (client)
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
    default: "crimson",
    onChange: () => {
      // Ensure styles exist before applying (covers toggling before ready)
      ensureSinlessStylesLoaded();
      applyThemeToDOM();
      rerenderOpenWindows();
      ui.notifications?.info?.("SinlessCSB theme updated for your client.");
    }
  });

  console.log("SinlessCSB | init");
});

Hooks.once("ready", () => {
  console.log("SinlessCSB | ready");

  // Force-load CSS in this runtime (robust across local + Forge)
  ensureSinlessStylesLoaded();

  // Apply theme as early as possible on the client
  applyThemeToDOM();

  // Optional: verify API is present after everything is live
  try {
    const apiKeys = Object.keys(game.modules?.get(MOD_ID)?.api ?? {});
    console.log("SinlessCSB | API keys (ready)", apiKeys);
  } catch (_e) {}

  registerSheetHooks();
  registerCombatHooks();
});
