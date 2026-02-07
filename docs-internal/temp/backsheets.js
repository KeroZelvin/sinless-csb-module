const MOD_ID = "sinlesscsb";

function getTemplatePath(app) {
  return String(
    app?.options?.template ??
    app?.template ??
    app?._options?.template ??
    ""
  );
}

function isCSBActorV2Sheet(app) {
  const template = getTemplatePath(app);
  return template.includes("custom-system-builder") && template.includes("/actor/v2/");
}

function getActor(app, context) {
  // For your debug output, this is the best source:
  // context.document === CustomActor
  const ctxDoc = context?.document ?? null;
  if (ctxDoc?.documentName === "Actor") return ctxDoc;

  // Fallbacks
  if (app?.document?.documentName === "Actor") return app.document;
  if (app?.actor?.documentName === "Actor") return app.actor;

  return null;
}

function injectInitiativeButton(rootEl, actor) {
  if (!rootEl || !actor) return;

  // Avoid duplicates on re-render
  if (rootEl.querySelector(".sinlesscsb-init-btn")) return;

  const host =
    rootEl.querySelector("section.window-content") ||
    rootEl.querySelector(".window-content") ||
    rootEl;

  const wrap = document.createElement("div");
  wrap.className = "sinlesscsb-init-wrap";
  wrap.style.display = "flex";
  wrap.style.gap = "8px";
  wrap.style.padding = "6px 6px 0 6px";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "sinlesscsb-init-btn";
  btn.textContent = "Roll Initiative";

  btn.addEventListener("click", async () => {
    const m = game.macros.getName("Sinless Roll Initiative");
    if (!m) return ui.notifications.error("Macro not found: Sinless Roll Initiative");
    await m.execute({ actorUuid: String(actor.uuid) });
  });

  wrap.appendChild(btn);
  host.prepend(wrap);
}

export function registerSheetHooks() {
  const enabled = () => game.settings.get(MOD_ID, "enableAutomation");

  // Primary: this is explicitly firing in your debug logs for CSB v2 sheets
  Hooks.on("renderCustomActorSheetV2", (app, element, context, options) => {
    if (!enabled()) return;
    if (!isCSBActorV2Sheet(app)) return;

    const actor = getActor(app, context);
    if (!actor) return console.warn("SinlessCSB | Actor not resolved", { app, context });

    console.log("SinlessCSB | renderCustomActorSheetV2 -> injecting", {
      actor: actor.name,
      uuid: actor.uuid,
      template: getTemplatePath(app),
      isFirstRender: options?.isFirstRender
    });

    injectInitiativeButton(element, actor);
  });

  // Fallback: also firing in your logs
  Hooks.on("renderActorSheetV2", (app, element, context, options) => {
    if (!enabled()) return;
    if (!isCSBActorV2Sheet(app)) return;

    const actor = getActor(app, context);
    if (!actor) return;

    console.log("SinlessCSB | renderActorSheetV2 -> injecting", {
      actor: actor.name,
      uuid: actor.uuid
    });

    injectInitiativeButton(element, actor);
  });

  console.log("SinlessCSB | Sheet injection registered (renderCustomActorSheetV2/renderActorSheetV2)");
}
