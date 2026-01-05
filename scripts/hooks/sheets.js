const MOD_ID = "sinlesscsb";

/**
 * CSB v5 component key anchor (underscores required in your config)
 * Place a CSB Text Field (or similar component) with Component Key:
 *   sinlesscsb_anchor_init
 * Then this module will inject the Roll Initiative button into that component's DOM wrapper.
 */
const INIT_ANCHOR_KEY = "sinlesscsb_anchor_init";

function getTemplatePath(app) {
  return String(
    app?.options?.template ??
      app?.template ??
      app?._options?.template ??
      ""
  );
}

function getActor(app, context) {
  const ctxDoc = context?.document ?? null;
  if (ctxDoc?.documentName === "Actor") return ctxDoc;

  if (app?.document?.documentName === "Actor") return app.document;
  if (app?.actor?.documentName === "Actor") return app.actor;

  return null;
}

function normalizeUuid(u) {
  const s = String(u ?? "").trim();
  return s.length ? s : null;
}

/**
 * Ensure system.props.ActorUuid is set to the canonical base Actor UUID (Actor.<id>).
 * Safe against CSB multi-pass renders:
 * - no update if already correct
 * - defers actual update to microtask (caller does the microtask)
 */
async function ensureActorUuidOnOpen(actor) {
  if (!actor) return;

  const baseActor =
    actor.isToken && actor.parent?.baseActor ? actor.parent.baseActor : actor;

  if (!baseActor || baseActor.documentName !== "Actor") return;

  const canonical = normalizeUuid(baseActor.uuid);
  if (!canonical) return;

  const current = normalizeUuid(baseActor.system?.props?.ActorUuid);
  if (current === canonical) return;

  await baseActor.update({
    system: {
      props: {
        ...(baseActor.system?.props ?? {}),
        ActorUuid: canonical
      }
    }
  });

  console.log("SinlessCSB | ActorUuid ensured", {
    name: baseActor.name,
    ActorUuid: canonical
  });
}

/**
 * Try to locate the CSB component wrapper that corresponds to the anchor component key.
 * CSB has used different attribute names across versions; we check common possibilities.
 */
function findCSBAnchorNode(root) {
  if (!root) return null;

  // 1) Common CSB wrapper attributes (varies by version)
  const wrapper =
    root.querySelector(`[data-key="${INIT_ANCHOR_KEY}"]`) ||
    root.querySelector(`[data-component-key="${INIT_ANCHOR_KEY}"]`) ||
    root.querySelector(`.custom-system-field[data-key="${INIT_ANCHOR_KEY}"]`) ||
    root.querySelector(`.custom-system-field[data-component-key="${INIT_ANCHOR_KEY}"]`);

  if (wrapper) return wrapper;

  // 2) Very common: the key appears on the INPUT itself (name/id/data-*)
  const input =
    root.querySelector(`input[name*="${INIT_ANCHOR_KEY}"]`) ||
    root.querySelector(`input[id*="${INIT_ANCHOR_KEY}"]`) ||
    root.querySelector(`input[data-key*="${INIT_ANCHOR_KEY}"]`) ||
    root.querySelector(`input[data-component-key*="${INIT_ANCHOR_KEY}"]`) ||
    root.querySelector(`input[data-path*="${INIT_ANCHOR_KEY}"]`) ||
    root.querySelector(`input[data-field*="${INIT_ANCHOR_KEY}"]`);

  if (input) return input;

  // 3) Fallback: any element that includes the key in a data attribute
  const any =
    root.querySelector(`[data-key*="${INIT_ANCHOR_KEY}"]`) ||
    root.querySelector(`[data-component-key*="${INIT_ANCHOR_KEY}"]`) ||
    root.querySelector(`[data-path*="${INIT_ANCHOR_KEY}"]`) ||
    root.querySelector(`[data-field*="${INIT_ANCHOR_KEY}"]`);

  return any ?? null;
}

/**
 * Resolve a stable root element. In Foundry v13 ApplicationV2, app.element is the live root.
 * The hook-provided `element` is often correct, but can be swapped during CSB re-renders.
 */
function getRootElement(app, element) {
  if (app?.element instanceof HTMLElement) return app.element;
  if (Array.isArray(app?.element) && app.element[0] instanceof HTMLElement) return app.element[0];
  if (element instanceof HTMLElement) return element;
  if (element?.[0] instanceof HTMLElement) return element[0];
  return null;
}

function injectInitiativeButton(rootEl, actor) {
  if (!rootEl || !actor) return;

  const anchorNode = findCSBAnchorNode(rootEl);
  if (!anchorNode) return;

  // Decide where the button should live
  let hostEl = anchorNode;

  // If we matched the INPUT itself, inject into a stable parent wrapper
  if (anchorNode instanceof HTMLInputElement) {
    // Hide the textbox so only the button shows
    anchorNode.style.display = "none";

    // Prefer a field wrapper if present, otherwise use parent
    hostEl =
      anchorNode.closest(".custom-system-field") ||
      anchorNode.closest(".form-group") ||
      anchorNode.parentElement;

    if (!hostEl) return;
  }

  // Temporary debug: inspect what we matched
  console.log("SinlessCSB | Anchor matched", {
    key: INIT_ANCHOR_KEY,
    tag: anchorNode?.tagName,
    classes: anchorNode?.className,
    name: anchorNode?.getAttribute?.("name"),
    id: anchorNode?.id
  });

  // Prevent duplicates across CSB re-renders
  if (hostEl.querySelector(".sinlesscsb-init-btn")) return;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "sinlesscsb-init-btn";
  btn.textContent = "Roll Initiative";

  btn.addEventListener("click", async () => {
    console.log("SinlessCSB | Initiative click", {
      actorName: actor.name,
      actorUuid: actor.uuid
    });

    const m = game.macros.getName("Sinless Roll Initiative");
    if (!m) return ui.notifications.error("Macro not found: Sinless Roll Initiative");
    await m.execute({ actorUuid: String(actor.uuid) });
  });

  hostEl.appendChild(btn);
}

export function registerSheetHooks() {
  // Log the setting value at registration time (to catch “wrong key/undefined”)
  let settingValue;
  try {
    settingValue = game.settings.get(MOD_ID, "enableAutomation");
  } catch (e) {
    settingValue = `ERROR: ${e?.message ?? e}`;
  }
  console.log("SinlessCSB | registerSheetHooks | enableAutomation =", settingValue);

  const logFire = (hookName, app, element, context, options) => {
    const tpl = getTemplatePath(app);
    const actor = getActor(app, context);
    const root = getRootElement(app, element);

    console.log(`SinlessCSB | HOOK FIRED: ${hookName}`, {
      ctor: app?.constructor?.name,
      id: app?.id,
      template: tpl,
      actor: actor ? { name: actor.name, uuid: actor.uuid } : null,
      isFirstRender: options?.isFirstRender,
      anchorKey: INIT_ANCHOR_KEY
    });

    if (!actor || !root) return;

    // CSB often does multi-pass re-renders; do work after the current microtask so the DOM is settled.
    queueMicrotask(() => {
      // 1) Ensure ActorUuid is set on the canonical (base) Actor for cross-token/combat consistency
      ensureActorUuidOnOpen(actor).catch(e =>
        console.error("SinlessCSB | ensureActorUuidOnOpen failed", e)
      );

      // 2) Inject the Roll Initiative button
      injectInitiativeButton(root, actor);
    });
  };

  Hooks.on("renderCharacterSheetV2", (app, element, context, options) =>
    logFire("renderCharacterSheetV2", app, element, context, options)
  );

  Hooks.on("renderCustomActorSheetV2", (app, element, context, options) =>
    logFire("renderCustomActorSheetV2", app, element, context, options)
  );

  Hooks.on("renderActorSheetV2", (app, element, context, options) =>
    logFire("renderActorSheetV2", app, element, context, options)
  );

  Hooks.on("renderApplicationV2", (app, element, context, options) => {
    // Keep this one quieter—log only if it looks actor-sheet-ish
    const ctor = String(app?.constructor?.name ?? "");
    const tpl = getTemplatePath(app);
    if (ctor.includes("Sheet") || tpl.includes("/actor/")) {
      logFire("renderApplicationV2", app, element, context, options);
    }
  });

  console.log(
    "SinlessCSB | Sheet injection registered (diagnostic mode) | anchor=",
    INIT_ANCHOR_KEY
  );
}
