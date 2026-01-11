Below is an updated **known_good_patterns.md** that preserves your existing structure (A/B/C) and adds the new “canonical actor identity” + “live UI refresh” patterns we validated in this thread. I kept everything copy-pasteable and in the same style as your doc.

---

## Known-Good Patterns (SinlessCSB / Foundry v13 / CSB v5)

Below are canonical, copy-paste code snippets for the moving parts that matter:

* (A) CSB anchor placement (layout-only)
* (B) Module sheet injection + anchor mount (Foundry v13 / ActorSheetV2)
* (C) Initiative macro actorUuid-first resolution + speaker
* (D) **NEW:** Canonical ActorUuid “ensure” on sheet open (prevents token-synthetic drift)
* (E) **NEW:** Combat pool refresh canonicalization (ActorUuid-first)
* (F) **NEW:** DialogV2 live refresh pattern (Pools dialog updates automatically when actor props change)

---

# A) CSB Anchor Component (Layout-only)

In CSB actor sheet editor, add a Text Field component:

* Component Key: `sinlesscsb_anchor_init` (underscores required)
* Label: empty (or a single space)
* Default value: empty
* Place it wherever you want the initiative button

This component is the “mount point” only; its value is never used.

---

# B) Module Canonical Snippet (Foundry v13 / CSB v5 / ActorSheetV2)

Use `renderCustomActorSheetV2` and mount into the CSB anchor.

```js
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
  if (Array.isArray(app?.element) && app.element[0] instanceof HTMLElement) return app.element[0];
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
```

---

# C) Macro Canonical Snippet (ActorUuid-First + Speaker)

At the top of Sinless Roll Initiative macro:

```js
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

// Set speaker (token optional; actor-only is stable)
const speaker = ChatMessage.getSpeaker({ actor });

console.log("Sinless Roll Initiative | Using actor", { name: actor.name, uuid: actor.uuid, actorUuidParam: actorUuid });

// ...initiative logic...
```

Token-name issue reminder (not a macro fix):

* Chat card header may display token name. Fix by setting Actor → Prototype Token “Use Actor Name / Link Actor Data”.

---

# D) NEW: Ensure Canonical ActorUuid on Sheet Open (Prevents Token-Synthetic Drift)

**Problem:** token-synthetic actors (UUID like `Scene...Token...Actor...`) can cause UI/macro drift.
**Solution:** store canonical base actor UUID in `system.props.ActorUuid` and always prefer it.

**Where to run:** in your sheet render hook (module layer), after resolving the actor.

```js
function normalizeUuid(u) {
  const s = String(u ?? "").trim();
  return s.length ? s : null;
}

/**
 * Ensure system.props.ActorUuid exists and equals the canonical base Actor uuid (Actor.<id>).
 * Important: create system.props object if missing (CSB timing can mean props isn't initialized yet).
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

  console.log("SinlessCSB | ActorUuid ensured", { name: baseActor.name, ActorUuid: canonical });
}
```

Call it inside your render hook, before injecting buttons:

```js
queueMicrotask(async () => {
  await ensureActorUuidOnOpen(actor);
  mountInitiativeButton(root, actor);
});
```

---

# E) NEW: Canonicalization in Combat Pool Refresh (ActorUuid-first)

**Problem:** combatants often reference token-synthetic actors; pool refresh must target the base actor consistently.

In `scripts/rules/pools.js`, prefer `system.props.ActorUuid`:

```js
function normalizeUuid(u) {
  const s = String(u ?? "").trim();
  return s.length ? s : null;
}

async function resolveCanonicalActor(actor) {
  if (!actor) return null;

  const actorUuid = normalizeUuid(actor?.system?.props?.ActorUuid);
  if (actorUuid) {
    try {
      const doc = await fromUuid(actorUuid);
      if (doc?.documentName === "Actor") return doc;
    } catch (e) {
      console.warn("SinlessCSB | resolveCanonicalActor fromUuid failed", { actorUuid, e });
    }
  }

  if (actor.isToken && actor.parent?.baseActor) return actor.parent.baseActor;
  return actor;
}

export async function refreshPoolsForCombat(combat) {
  if (!combat) return;

  const actors = new Set();
  for (const c of combat.combatants) {
    const a = c?.actor;
    if (!a) continue;

    const canonical = await resolveCanonicalActor(a);
    if (canonical) actors.add(canonical);
  }

  for (const actor of actors) {
    await refreshPoolsForActor(actor);
  }
}
```

---

# F) NEW: DialogV2 Live Refresh Pattern (Pools Dialog Updates Without Reopen)

**Problem:** Dialog displays stale pool values unless closed/reopened, because actor updates occur outside the dialog.

**Solution:** subscribe to `updateActor` and refresh the DOM when `changed.system.props` is present. Unregister on close.

```js
class MyDialog extends foundry.applications.api.DialogV2 {
  constructor(...args) {
    super(...args);
    this._actorId = actor?.id ?? null;
    this._actorUpdateHookId = null;
    this._clickBound = false;
  }

  async close(options) {
    if (this._actorUpdateHookId) {
      Hooks.off("updateActor", this._actorUpdateHookId);
      this._actorUpdateHookId = null;
    }
    return super.close(options);
  }

  _onRender(context, options) {
    super._onRender(context, options);

    const root = this.element;
    if (!(root instanceof HTMLElement)) return;

    const updateAllRows = () => {
      // recompute from actor.system.props + update DOM elements
    };

    // Register once per dialog instance (DialogV2 can re-render)
    if (!this._actorUpdateHookId && this._actorId) {
      this._actorUpdateHookId = Hooks.on("updateActor", (updatedActor, changed) => {
        if (updatedActor?.id !== this._actorId) return;
        if (!changed?.system?.props) return; // cheap filter
        updateAllRows();
      });
    }

    // Bind click handler once if needed
    if (!this._clickBound) {
      this._clickBound = true;
      root.addEventListener("click", async (ev) => {
        // handle dialog actions
      });
    }

    // Initial sync
    updateAllRows();
  }
}
```

This was applied to **Sinless Pool Roll** so that when combat round refresh refills pools, the dialog updates immediately.

---

# Optional: CSS to hide the anchor textbox (if desired)

If your anchor is a Text Field and you don’t want to see the empty input:

```css
.custom-system-field[data-key="sinlesscsb_anchor_init"] input,
.custom-system-field[data-key="sinlesscsb_anchor_init"] label {
  display: none;
}

/* If CSB uses data-component-key in your build, duplicate selectors accordingly */
.custom-system-field[data-component-key="sinlesscsb_anchor_init"] input,
.custom-system-field[data-component-key="sinlesscsb_anchor_init"] label {
  display: none;
}
```

---

## Operational Note (Debugging “Everything is gone”)

If actors/items/templates vanish after reload, confirm you are logged in as **GM**, not a player. Player permissions can make world content appear missing even though nothing was deleted.

---
Canonical Actor Resolution (REQUIRED)
async function resolveCanonicalActor(actor) {
  const u = actor?.system?.props?.ActorUuid?.trim();
  if (u) {
    const doc = await fromUuid(u);
    if (doc?.documentName === "Actor") return doc;
  }
  if (actor.isToken && actor.parent?.baseActor) return actor.parent.baseActor;
  return actor;
}


Use this everywhere actors are resolved.

ActorUuid Injection on Sheet Open

Inject ActorUuid when sheet renders

Safe against CSB multi-render passes

Never overwrite if already correct

This prevents:

Token-synthetic drift

Cross-browser GM/player desync

Combat pool refresh inconsistencies

Safe Sheet → Macro Communication (v13)

Pattern:

// Sheet
game.sinlesscsb._initActorUuid = actor.uuid;
await macro.execute({ actorUuid: actor.uuid });
delete game.sinlesscsb._initActorUuid;

// Macro
const actorUuid =
  args?.actorUuid ??
  game?.sinlesscsb?._initActorUuid ??
  null;


Rationale: Macro args are unreliable in v13; this is the safest bridge.

Actor-Only Combatants

Prefer actorId combatants

Avoid tokenId unless visually required

Prevents duplicate combatants and token-scene coupling

DialogV2 Event Binding Pattern

Dialog roots can change across renders

Always:

Remove old event listeners

Rebind on _onRender

Store handler references on the dialog instance

Live UI Sync via updateActor

Listen only for:

Matching actor ID

changed.system.props

Update UI via queueMicrotask() to avoid render races

Roll API (v13 Safe)

✅ Correct:

await roll.evaluate();


❌ Incorrect:

roll.evaluate({ async: true });

Final Notes

This thread resolved three major architectural risks:

Actor identity drift

v13 macro argument loss

DialogV2 re-render instability

All current solutions are:

Tested

Reproducible

Compatible with Foundry v13+

Safe for future module refactors

## CSB Pattern: Using `%{ ... }%` scripts in component fields (linkedEntity-first)

### Why this exists
In CSB, simple token substitutions (e.g., `actionLabel`, `:actionLabel:`, `${...}$`) may fail in certain component contexts—especially **Actor sheet Item Container / inventory rows**. In those rows, the reliable way to access the row’s owned Item is `linkedEntity`. Therefore, prefer **script-eval blocks** using:

- **`%{ ... }%`** for JS execution (buttons, rollMessage, dynamic labels).
- Always `return` a value for display fields (e.g., `value`).
- In `rollMessage`, `return ""` to prevent extra chat output.

---

### Inventory row rule (hard requirement)
For **Actor inventory / Item Container row buttons**, use **`linkedEntity` only**.

Do NOT rely on `entity` fallbacks for these buttons; it may be missing or not reference the owned Item in this context.

---

### Canonical: Inventory row button label from Item `actionLabel`
Use this in a label/button component’s `value` field:

```js
%{ return (linkedEntity?.system?.props?.actionLabel ?? "Use"); }%
linkedEntity = owned Item for the row

system.props.actionLabel = custom field defined on the Item template

fallback "Use" prevents blank labels

Canonical: Inventory row rollMessage calling module API (linkedEntity-only)
Use this in the component’s rollMessage field:

js
Copy code
%{
  // Inventory/Item Container row context: use linkedEntity only.
  const itemUuid = String(linkedEntity?.uuid ?? "");
  const actorUuid = String(linkedEntity?.parent?.uuid ?? "");

  if (!itemUuid) {
    ui.notifications?.warn("Cast Spell: no linkedEntity item context (inventory row).");
    return "";
  }

  game.modules.get("sinlesscsb")?.api?.castSpell?.({ itemUuid, actorUuid });
  return "";
}%
Notes:

linkedEntity.parent is typically the owning Actor when the item is embedded.

Guard itemUuid and exit early if missing.

Use optional chaining (?.) and nullish coalescing (??) to avoid evaluator crashes.

Button component checklist (typical)
For a “label button” with icon + text:

style: "button"

icon: e.g. "dice" (or desired icon)

value: script-eval label (see above)

rollMessage: script-eval action (see above)

General guidance
Display fields (value, etc.): return a string (use String(...) if needed).

Action fields (rollMessage): execute code, then return "".

Treat linkedEntity as the canonical context variable for inventory rows.

makefile
Copy code
::contentReference[oaicite:0]{index=0}





You said:
my working version had the const doc = linkedEntity ?? entity;

I want to understand why you pulled that out of the canonical version?

%{
  const doc = linkedEntity ?? entity;
  const itemUuid = String(doc?.uuid ?? "");
  const actorUuid = String(doc?.parent?.uuid ?? "");

  if (!itemUuid) {
    ui.notifications?.warn("Cast Spell: no item context (linkedEntity/entity missing).");
    return "";
  }

  game.modules.get("sinlesscsb")?.api?.castSpell?.({ itemUuid, actorUuid });
  return "";
}%



ChatGPT said:

Thought for 14s
I removed the linkedEntity ?? entity fallback in the “canonical inventory-row” version for one specific reason: defensive correctness in the inventory row context.

In an Actor sheet Item Container row, linkedEntity is the reliable “row item.” When linkedEntity is present, your version and my linkedEntity-only version behave identically because:

doc = linkedEntity ?? entity resolves to linkedEntity anyway.

So the question is what happens when linkedEntity is not present (misconfigured row, different component context, or CSB scope variance). In that case, falling back to entity can produce false positives:

entity might be the Actor, the sheet, or another document with a valid .uuid.

Your code would then set itemUuid to that non-Item UUID (because it exists), pass the guard, and call castSpell with the wrong UUID and possibly an empty actorUuid (because doc.parent may be undefined).

That failure mode is worse than a clean “no linkedEntity” warning because it can look like “the button ran but nothing happened,” or it can call the API with an invalid item context.

The practical reconciliation
You have two “known good” patterns, depending on what you want to optimize:

Inventory-row strict (recommended for Item Container rows): require linkedEntity so the button never fires with the wrong document.

Context-agnostic (your working pattern): allow entity fallback, but add a type check so you only accept a real Item.

Safer canonical that keeps your fallback (with validation)
This preserves your working structure but prevents the “entity is an Actor” trap:

js
Copy code
%{
  const doc = linkedEntity ?? entity;

  // Only proceed if doc is actually an Item document.
  // (Foundry documents typically expose documentName; "Item" is the expected value.)
  if (doc?.documentName !== "Item") {
    ui.notifications?.warn("Cast Spell: no Item context (linkedEntity/entity is not an Item).");
    return "";
  }

  const itemUuid = String(doc?.uuid ?? "");
  const actorUuid = String(doc?.parent?.uuid ?? "");

  if (!itemUuid) {
    ui.notifications?.warn("Cast Spell: no itemUuid (linkedEntity/entity missing).");
    return "";
  }

  game.modules.get("sinlesscsb")?.api?.castSpell?.({ itemUuid, actorUuid });
  return "";
}%
Why this is “canonical” in practice
In inventory rows, linkedEntity is used (same behavior you already have).

In other contexts where only entity exists, it still works if entity is actually an Item.

If CSB gives you a non-item entity, you get a clear warning instead of a misleading API call.

If you want, I can also provide a paired “canonical label” snippet that uses the same doc resolution and type check, so your icon+text button label remains consistent with the rollMessage behavior.






You said:
yes



ChatGPT said:
md
Copy code
## CSB Pattern: `%{ ... }%` scripts for dynamic UI + button actions (linkedEntity-first, entity fallback with Item validation)

### Why this exists
In CSB, simple substitutions (e.g., `actionLabel`, `:actionLabel:`, `${...}$`) can fail depending on component context—especially in **Actor sheet Item Container / inventory rows**. The most reliable way to access the row’s owned Item is `linkedEntity`. In other contexts, CSB may provide `entity` instead.  
Therefore, standardize on:

- Use `%{ ... }%` to execute JavaScript in CSB component fields.
- For display fields (e.g., `value`), **return a string**.
- For action fields (e.g., `rollMessage`), execute logic and **return `""`** to avoid extra chat output.
- Prefer `linkedEntity`, but allow `entity` fallback **only when it is actually an Item**.

---

### Key context variables (practical)
- `linkedEntity`: Owned Item for an inventory row (most reliable in Actor Item Containers)
- `entity`: Context-provided document in some components (may be an Item, but can also be an Actor/other doc)

---

### Canonical resolution pattern: `doc` with Item validation
Use this pattern whenever you need to support both inventory rows and other contexts:

```js
%{
  const doc = linkedEntity ?? entity;

  // Guard: only proceed if we actually have an Item document.
  if (doc?.documentName !== "Item") {
    ui.notifications?.warn("No Item context (linkedEntity/entity is not an Item).");
    return "";
  }

  // From here on, doc is safe to treat as an Item.
  const itemUuid = String(doc?.uuid ?? "");
  const actorUuid = String(doc?.parent?.uuid ?? ""); // embedded Item => parent is Actor

  // Guard: itemUuid must exist.
  if (!itemUuid) {
    ui.notifications?.warn("No itemUuid (linkedEntity/entity missing).");
    return "";
  }

  // Do the action. Return empty string to suppress extra chat output.
  game.modules.get("sinlesscsb")?.api?.castSpell?.({ itemUuid, actorUuid });
  return "";
}%
Why validate?

In some contexts, entity can be an Actor (or other doc) with a UUID.

Without validation, a button may “run” but pass the wrong UUID to your API, leading to silent failures.

Canonical: Button label text from Item actionLabel (paired with the same doc logic)
Use this in a label/button component’s value field:

js
Copy code
%{
  const doc = linkedEntity ?? entity;
  if (doc?.documentName !== "Item") return "Use";
  return (doc?.system?.props?.actionLabel ?? "Use");
}%
Notes:

Always return a string for UI labels.

Fallback to "Use" if context is missing or actionLabel is empty.

Inventory-row strict variant (only when you explicitly want to hard-require linkedEntity)
Use this when the component is guaranteed to be an inventory row and you want to fail fast:

Label

js
Copy code
%{ return (linkedEntity?.system?.props?.actionLabel ?? "Use"); }%
rollMessage

js
Copy code
%{
  const itemUuid = String(linkedEntity?.uuid ?? "");
  const actorUuid = String(linkedEntity?.parent?.uuid ?? "");

  if (!itemUuid) {
    ui.notifications?.warn("No linkedEntity item context (inventory row).");
    return "";
  }

  game.modules.get("sinlesscsb")?.api?.castSpell?.({ itemUuid, actorUuid });
  return "";
}%
Button component checklist (typical)
For a “label button” with icon + text:

style: "button"

icon: e.g., "dice"

value: %{ return ... }% label script (above)

rollMessage: %{ ... return "" }% action script (above)

Operational guidance
Use optional chaining (?.) and nullish coalescing (??) everywhere to avoid evaluator runtime errors.

Prefer “doc resolution + Item validation” as the default canonical pattern.

Use the linkedEntity-only strict variant only when you are certain the component is an inventory row.

makefile
Copy code
::contentReference[oaicite:0]{index=0}