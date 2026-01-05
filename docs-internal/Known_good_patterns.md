Below are canonical, copy-paste code snippets for the three moving parts that matter: (A) CSB anchor placement, (B) module sheet injection + anchor mount, and (C) initiative macro actorUuid-first resolution + speaker.

You can paste these into your repo docs as “known-good patterns.”

A) CSB Anchor Component (Layout-only)

In CSB actor sheet editor, add a Text Field component:

Component Key: sinlesscsb_anchor_init (underscores required)

Label: empty (or a single space)

Default value: empty

Place it wherever you want the initiative button

This component is the “mount point” only; its value is never used.

B) Module Canonical Snippet (Foundry v13 / CSB v5 / ActorSheetV2)

Use renderCustomActorSheetV2 and mount into the CSB anchor.

// sheets.js (canonical snippet)

const MOD_ID = "sinlesscsb";
const INIT_ANCHOR_KEY = "sinlesscsb_anchor_init";

function getActor(app, context) {
  const ctxDoc = context?.document ?? null;
  if (ctxDoc?.documentName === "Actor") return ctxDoc;
  if (app?.document?.documentName === "Actor") return app.document;
  if (app?.actor?.documentName === "Actor") return app.actor;
  return null;
}

function getRootElement(app, element) {
  if (app?.element instanceof HTMLElement) return app.element;
  if (element instanceof HTMLElement) return element;
  if (element?.[0] instanceof HTMLElement) return element[0]; // safety if something hands jQuery-like
  return null;
}

/**
 * Robust anchor finder:
 * - Works whether CSB puts the key on a wrapper (data-key / data-component-key)
 * - Or on the input (name/id/data-*)
 */
function findCSBAnchorNode(root) {
  if (!root) return null;

  // wrapper variants
  const wrapper =
    root.querySelector(`[data-key="${INIT_ANCHOR_KEY}"]`) ||
    root.querySelector(`[data-component-key="${INIT_ANCHOR_KEY}"]`) ||
    root.querySelector(`.custom-system-field[data-key="${INIT_ANCHOR_KEY}"]`) ||
    root.querySelector(`.custom-system-field[data-component-key="${INIT_ANCHOR_KEY}"]`);
  if (wrapper) return wrapper;

  // input variants
  const input =
    root.querySelector(`input[name*="${INIT_ANCHOR_KEY}"]`) ||
    root.querySelector(`input[id*="${INIT_ANCHOR_KEY}"]`) ||
    root.querySelector(`input[data-key*="${INIT_ANCHOR_KEY}"]`) ||
    root.querySelector(`input[data-component-key*="${INIT_ANCHOR_KEY}"]`) ||
    root.querySelector(`input[data-path*="${INIT_ANCHOR_KEY}"]`) ||
    root.querySelector(`input[data-field*="${INIT_ANCHOR_KEY}"]`);
  if (input) return input;

  // loose fallback
  return (
    root.querySelector(`[data-key*="${INIT_ANCHOR_KEY}"]`) ||
    root.querySelector(`[data-component-key*="${INIT_ANCHOR_KEY}"]`) ||
    root.querySelector(`[data-path*="${INIT_ANCHOR_KEY}"]`) ||
    root.querySelector(`[data-field*="${INIT_ANCHOR_KEY}"]`) ||
    null
  );
}

function mountInitiativeButton(rootEl, actor) {
  if (!rootEl || !actor) return;

  const anchorNode = findCSBAnchorNode(rootEl);
  if (!anchorNode) return;

  // host is wrapper; if we matched the <input>, hide it and use a parent wrapper
  let hostEl = anchorNode;
  if (anchorNode instanceof HTMLInputElement) {
    anchorNode.style.display = "none";
    hostEl =
      anchorNode.closest(".custom-system-field") ||
      anchorNode.closest(".form-group") ||
      anchorNode.parentElement;
    if (!hostEl) return;
  }

  // IMPORTANT: remove existing to avoid stale closure binding
  hostEl.querySelector(".sinlesscsb-init-btn")?.remove();

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "sinlesscsb-init-btn";
  btn.textContent = "Roll Initiative";

  btn.addEventListener("click", async () => {
    const m = game.macros.getName("Sinless Roll Initiative");
    if (!m) return ui.notifications.error("Macro not found: Sinless Roll Initiative");
    await m.execute({ actorUuid: String(actor.uuid) });
  });

  hostEl.appendChild(btn);
}

export function registerSheetHooks() {
  Hooks.on("renderCustomActorSheetV2", (app, element, context, options) => {
    if (!game.settings.get(MOD_ID, "enableAutomation")) return;

    const actor = getActor(app, context);
    const root = getRootElement(app, element);
    if (!actor || !root) return;

    // CSB can multi-pass render; inject after DOM settles
    queueMicrotask(() => mountInitiativeButton(root, actor));
  });

  console.log("SinlessCSB | Initiative anchor injection registered", { anchor: INIT_ANCHOR_KEY });
}

C) Macro Canonical Snippet (ActorUuid-First + Speaker)

At the top of Sinless Roll Initiative macro:

// Sinless Roll Initiative (canonical actor resolution + speaker)

const scope = (arguments?.length && typeof arguments[0] === "object") ? arguments[0] : {};
const actorUuid = (typeof scope.actorUuid === "string" && scope.actorUuid.length) ? scope.actorUuid : null;

let actor = null;

// 1) Strict priority: actorUuid
if (actorUuid) actor = await fromUuid(actorUuid);

// 2) Fallbacks only if actorUuid missing/invalid
actor ??= canvas?.tokens?.controlled?.[0]?.actor ?? null;
actor ??= game.user.character ?? null;

if (!actor) {
  ui.notifications.error("Sinless Roll Initiative: No actor resolved. Provide actorUuid or select a token.");
  return;
}

// If you have a token (for combatant), locate it; then set speaker with actor+token
// const token = findTokenForActorOnScene(actor); // your helper
// const speaker = ChatMessage.getSpeaker({ actor, token });
const speaker = ChatMessage.getSpeaker({ actor });

// If chat header ever uses wrong alias due to token naming, you can force:
// speaker.alias = actor.name;

console.log("Sinless Roll Initiative | Using actor", { name: actor.name, uuid: actor.uuid, actorUuidParam: actorUuid });

// ...initiative logic continues using `actor`...
// ChatMessage.create({ speaker, content });

Optional: CSS to hide the anchor textbox (if desired)

If your anchor is a Text Field and you don’t want to see the empty input:

.custom-system-field[data-key="sinlesscsb_anchor_init"] input,
.custom-system-field[data-key="sinlesscsb_anchor_init"] label {
  display: none;
}


(If CSB uses data-component-key in your build, duplicate the selector accordingly.)