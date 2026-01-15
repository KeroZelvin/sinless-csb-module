// scripts/hooks/sheet-theme.js
// Purpose: Promote theme class onto the CSB root form when a marker exists.
// - Detect `.sinlesscsb-marker` anywhere in the sheet DOM
// - Add `.sinlesscsb` to nearest `.custom-system` root
// No initiative logic, no macro handoff, minimal/no logging.

const MOD_ID = "sinlesscsb";

const THEME_MARKER_CLASS = "sinlesscsb-marker";
const THEME_ROOT_CLASS = "sinlesscsb";

function getRootElement(app, element) {
  if (app?.element instanceof HTMLElement) return app.element;
  if (Array.isArray(app?.element) && app.element[0] instanceof HTMLElement) return app.element[0];
  if (element instanceof HTMLElement) return element;
  if (element?.[0] instanceof HTMLElement) return element[0];
  return null;
}

function promoteThemeRootClass(rootEl) {
  if (!rootEl?.querySelector) return;

  const hasMarker = !!rootEl.querySelector(`.${THEME_MARKER_CLASS}`);
  if (!hasMarker) return;

  const customSystemRoot =
    (rootEl.matches?.(".custom-system") ? rootEl : null) ||
    rootEl.closest?.(".custom-system") ||
    rootEl.querySelector?.("form.custom-system, .custom-system");

  if (!customSystemRoot) return;

  if (!customSystemRoot.classList.contains(THEME_ROOT_CLASS)) {
    customSystemRoot.classList.add(THEME_ROOT_CLASS);

    // Optional debug only
    if (game.settings?.get?.(MOD_ID, "debugLogs")) {
      console.log("SinlessCSB | theme root promoted", {
        marker: THEME_MARKER_CLASS,
        addedClass: THEME_ROOT_CLASS
      });
    }
  }
}

export function registerSheetThemeHooks() {
  const handler = (app, element) => {
    const root = getRootElement(app, element);
    if (!root) return;

    // Let CSB finish any multi-pass DOM writes first
    queueMicrotask(() => promoteThemeRootClass(root));
  };

  // Broad and robust: catches Actor and Item sheets (and other V2 apps)
  Hooks.on("renderApplicationV2", handler);

  // Extra coverage for some installations where specific hooks fire earlier
  Hooks.on("renderActorSheetV2", handler);
  Hooks.on("renderItemSheetV2", handler);
}
