# SinlessCSB – Current State (API-first)

## Runtime and constraints
- Foundry: **v13**
- System: **CSB v5**
- Live values: **`actor.system.props`** (CSB props root may be configurable; default `system.props`)

## Module direction
We are consolidating all “game logic” into a module API surface:
- `game.modules.get("sinlesscsb").api.castSpell(scope)`
- `game.modules.get("sinlesscsb").api.rollItem(scope)`
- `game.modules.get("sinlesscsb").api.rollPools(scope)`
- `game.modules.get("sinlesscsb").api.rollInitiative(scope)` (PC + NPC)

World macros and CSB template scripts should become **thin callers** into the API.

## Implemented API functions
### Item Roll
- File: `scripts/api/item-roll.js`
- Entry:
  - `rollItem({ itemUuid })`
  - `rollItem({ actorUuid, itemId })` (back-compat for older callers)
- Features implemented:
  - Session Settings integration:
    - `TN_Global` from Actor named **“Session Settings”**
    - `SkillMeta_JSON` mapping for `{ Skill_X: { pool, groupId, isAsterisked } }`
  - Group defaulting (−2) and “untrained pool” fallback (every 4 successes = 1)
  - Spend cap = `min(poolCur, limit)` for trained/defaulted modes
  - Dialog: DialogV2 via `openDialogV2` helper, with stepper buttons
  - Pool depletion: writes `Pool_Cur` back and mirrors across canonical/token-synthetic actors

### Cast Spell
- File: `scripts/api/cast-spell.js`
- Entry:
  - `castSpell({ itemUuid, actorUuid? })`
- Features implemented:
  - Force selection + cast spend + drain resist spend
  - Live derived UI (“remaining resolve after cast”, “drain max”) via dialog render handlers
  - Drain formula evaluation (via `evaluateDrainFormula`)
  - Track updates: `Resolve_Cur`, `stunCur`, `physicalCur` (remaining-track model)
  - Mirroring updates across canonical actor + token-synthetics

### Pools Roll
- File: `scripts/api/pools-roll.js`
- Entry:
  - `rollPools({ actorUuid? })`
  - `refreshPools({ actorUuid? })`
- Features implemented:
  - DialogV2 via `openDialogV2` (inline steppers + refresh + roll)
  - Session Settings integration (`TN_Global`)
  - Canonical actor resolution + mirror-safe updates
  - Refresh prefers rules module when available; falls back to computed pools

### Initiative Roll
- File: `scripts/api/initiative-roll.js`
- Entry:
  - `rollInitiative({ actorUuid? })` (PC)
  - `rollNpcInitiative({ sceneId? })` (NPC fixed)
- Features implemented:
  - TN_Global + Focus_Max d6 successes + REA
  - NPC initiative from `system.props.NPCinit`
  - Actor-only combatants + de-dupe in Encounter 1
  - Canonical actor resolution

## Shared utilities
- File: `scripts/api/_util.js`
- Key exported helpers:
  - `resolveActorForContext({ scope, item })`
  - `resolveCanonicalActor(actor)`
  - `resolveItemDoc({ itemUuid, actorUuid, itemId })`
  - `openDialogV2({ title, content, buttons, onRender, rejectClose })`
  - `getDialogFormFromCallbackArgs(...)`
  - `rollXd6Successes({ dice, tn })`
  - CSB helpers: `readProps`, `propPath`, `poolCurKey`, `propsRoot`

## Canonical actor resolution (critical)
Use this exact priority for any API call that mutates actor state:

### A) Resolve “sheetActor” (the actor we will definitely update)
1. `scope.actorUuid` (explicit) → `fromUuid(actorUuid)`
2. `item.parent` if embedded in an Actor
3. `canvas.tokens.controlled[0].actor`
4. `game.user.character`

### B) Resolve “canonActor” (the stable backing actor doc)
1. `sheetActor.system.props.ActorUuid` (string UUID) → `fromUuid(...)`
2. If `sheetActor.isToken` and `sheetActor.parent?.baseActor`, use `baseActor`
3. Else use `sheetActor`

### C) Update/mirror strategy
Always:
1. `await sheetActor.update(updateData)`
2. If `canonActor.uuid !== sheetActor.uuid`, also update `canonActor`
3. If any controlled token actor resolves to the same canonical actor but is a different document, also update that token actor

This is required to prevent the “token-synthetic drift” issues we have repeatedly observed.

## How CSB templates should call the API
**Item buttons / rollMessage formula pattern (recommended):**
```js
%{
  // Prefer linkedEntity (inventory row) then entity (item sheet)
  const doc = (typeof linkedEntity !== "undefined" && linkedEntity) ? linkedEntity
            : (typeof entity !== "undefined" && entity) ? entity
            : null;

  const itemUuid = String(doc?.uuid ?? "").trim();

  // Actor resolution: embedded parent wins; otherwise token/character fallbacks.
  const embeddedActorUuid =
    (doc?.parent?.documentName === "Actor" && doc?.parent?.uuid) ? String(doc.parent.uuid) : "";

  const scopeActorUuid =
    (typeof actor !== "undefined" && actor?.documentName === "Actor" && actor?.uuid) ? String(actor.uuid) : "";

  const controlledActorUuid = (() => {
    const t = canvas?.tokens?.controlled?.[0];
    return t?.actor?.uuid ? String(t.actor.uuid) : "";
  })();

  const targetedActorUuid = (() => {
    const t = game.user?.targets ? Array.from(game.user.targets)[0] : null;
    return t?.actor?.uuid ? String(t.actor.uuid) : "";
  })();

  const userCharUuid = game.user?.character?.uuid ? String(game.user.character.uuid) : "";

  const actorUuid = String(
    embeddedActorUuid ||
    scopeActorUuid ||
    controlledActorUuid ||
    targetedActorUuid ||
    userCharUuid ||
    ""
  ).trim();

  if (!itemUuid) {
    ui.notifications?.warn?.("SinlessCSB: missing item context (itemUuid).");
    return "";
  }

  if (!actorUuid) {
    ui.notifications?.warn?.("SinlessCSB: No actor context. Control or target a token, then try again.");
    return "";
  }

  const api = game.modules.get("sinlesscsb")?.api;
  if (typeof api?.rollItem !== "function") {
    ui.notifications?.error?.("SinlessCSB: rollItem API not available (module not ready / not exposed).");
    return "";
  }

  api.rollItem({ itemUuid, actorUuid });
  return "";
}%

```

## DialogV2 standard (critical)
- Do not call `DialogV2.wait()` directly.
- Always call `_util.openDialogV2(...)`.
- In `onRender`, bind handlers once per root using `root.dataset.<flag> = "1"`.

## Recent completions
- Pools roller is now API-backed (`scripts/api/pools-roll.js`) with DialogV2 and refresh.
- Initiative (PC + NPC) is now API-backed (`scripts/api/initiative-roll.js`).

## Test checklist (fast)
- Call item-roll from:
  - actor sheet item row
  - a clicked token belonging to player
- Verify:
  - pool cur decreases correctly on the correct actor document
  - chat card displays correct actor name (not “Character (8)” style drift)
- Call cast-spell from:
  - actor sheet
  - token action
- Verify:
  - Resolve spend and drain spend clamp correctly
  - stun/physical remaining values update correctly

  ### ActorUuid alias plan (transition safety)

We historically used `system.props.ActorUuid` (capital A) as the canonical reference, and some newer code paths may look for `system.props.actorUuid` (lowercase a). Case mismatches are easy to introduce and can silently break canonical resolution.

**Project policy (effective now)**
- **Write** both keys during the transition:
  - `system.props.ActorUuid` (authoritative)
  - `system.props.actorUuid` (alias / compatibility)
- **Read** with fallback:
  - prefer `ActorUuid`, else `actorUuid`

**Why**
- Prevent “works on some sheets, fails on others” when a template, injection script, or older world data uses only one casing.
- Reduce regression risk while we refactor macros → API (especially initiative).

**Implementation points**
- In `sheets.js` (or wherever we ensure the canonical uuid on sheet open), set both keys to the same canonical value (`Actor.<id>` UUID).
- In `_util.js resolveCanonicalActor`, resolve from `ActorUuid ?? actorUuid`, then normalize.

**Normalization rule**
- Stored canonical should be the full UUID string (e.g., `Actor.eMbezua6UThIStwT`), not a bare id.
- If a bare id is found, normalize to `Actor.<id>` before `fromUuid()`.

**Exit criteria (when we can remove the alias)**
- After we confirm:
  1) all actor templates and existing actors in the active worlds have `system.props.ActorUuid` populated
  2) initiative + pools + item-roll + cast-spell are fully on API and consistently resolving canonical actors
  3) no production sheets or compendiums rely on `actorUuid`
- Then we can stop writing `actorUuid` and keep only the read fallback for one release cycle before removing it.

DialogV2 policy: never use DialogV2.wait in SinlessCSB

Decision: In SinlessCSB (Foundry v13 + CSB v5), we do not use foundry.applications.api.DialogV2.wait() anywhere in production code.

Why: Across our runtime variants (local + Forge, CSB sheet contexts, and some v13 builds), DialogV2.wait() has been unreliable for interactive dialogs:

The render callback signature is inconsistent between builds, so our onRender binding sometimes receives the wrong arguments or no usable root element.

Event binding (e.g., stepper +/- buttons) frequently fails when relying on the wait() render callback; handlers may attach to the wrong node or never fire due to DialogV2 DOM/wrapper differences.

Result resolution behavior is inconsistent (“cancel” vs null, close/X/ESC behavior), causing downstream logic to mis-handle user cancellation.

Canonical approach (required): Use our wrapper openDialogV2() in _util.js, but force the instance-render path (subclass of DialogV2 + _onRender) for any dialog that needs DOM binding (onRender), rather than using DialogV2.wait.

Implementation standard:

openDialogV2(cfg) must:

Prefer DialogV2.wait only for simple dialogs with no DOM interactions, OR

In SinlessCSB, we standardize further: always use the instance path to avoid runtime drift.

Binding rules inside onRender(dialog, root):

Guard against double-binding via root.dataset.<flag>.

Attach click handlers using delegated events + closest() for buttons.

Prefer attaching to root (or stable container) and use capture phase only if bubbling is blocked by wrappers.

Clean up listeners and hooks on dialog close (best-effort; do not assume dialog instance is always passed).

Known symptom when violated: Stepper buttons render but do not change inputs; dialog still submits but without expected interactive behavior. This almost always indicates accidental use of DialogV2.wait or incorrect root detection from the wait-render callback.

Files impacted: _util.js (openDialogV2), any API function that opens dialogs (e.g., item-roll.js, cast-spell.js, pools-roll.js).

Canonical Guide: Fixing Broken DialogV2 Steppers and Layout in Foundry v13 (SinlessCSB)
Scope

This guide covers a recurring class of issues in SinlessCSB where +/- stepper buttons inside DialogV2 dialogs:

Render correctly (DOM elements exist), but clicks do nothing, or

Clicks register but numeric inputs never change, or

Buttons work but stack vertically above/below the input due to Foundry dialog CSS.

This applies to Item Roll and Cast Spell dialogs; same patterns should be used for Pools Roll and any future DialogV2 UI.

Non-negotiable project constraints

Do not use DialogV2.wait() (render callback / timing differs across builds and breaks event binding).

Standardize on instance-based DialogV2 render path via openDialogV2() and onRender(dialog, root).

Actor live values are under actor.system.props.

Canonical actor resolution uses system.props.ActorUuid to avoid token-synthetic drift (not part of this guide unless it affects DOM binding).

What “broken steppers” looks like
Symptom A — Buttons exist, but clicks do nothing

Query shows buttons exist, e.g.:

document.querySelectorAll('.dialog [data-action="step"]').length returns expected count

Clicking produces no changes and no logs from your handler.

Most likely causes:

You bound events to the wrong DOM root (binding to a detached element).

onRender ran before content was in the subtree and your binding code returned early.

A “bind guard” (dataset flag) was set too early, preventing later rebinding.

Symptom B — Click handler fires but value never changes (stuck at 0)

Observed directly in Item Roll:

Logs show handler firing for sit field, but value stayed "0" for both +1 and -1.

Root cause:

Using Number(input.min) / Number(input.max) is incorrect when the attribute is missing:

input.min and input.max are "" when unset

Number("") becomes 0

Result: min=0 and max=0, so value clamps to 0 forever

Symptom C — Buttons work but stack vertically above/below input

Observed in Cast Spell UI:

Even with display:grid rules, computed style remained display: block

Foundry dialog form CSS overrides the intended layout.

Root cause:

Foundry DialogV2 wraps content in its own outer form and applies strong CSS that can override author styles.

Selector mismatch is common because the inner <form class="sinlesscsb spell-dialog"> may be normalized/rewrapped.

In some cases, even !important rules lose due to higher specificity or Foundry’s cascade.

Canonical debugging checklist (fast path)
1) Confirm the button is actually clickable (not overlayed)

While the dialog is open:

const btn = document.querySelector('.dialog button[data-action="step"], .dialog button.sinlesscsb-step');
const r = btn.getBoundingClientRect();
document.elementFromPoint(r.left + r.width/2, r.top + r.height/2);


If elementFromPoint returns the button (or a child), overlay/pointer-events is not the issue.

2) Confirm clicks reach the document at all

Install a document capture probe:

window.__sinlessClickProbe?.remove?.();
window.__sinlessClickProbe = (() => {
  const handler = (ev) => {
    const t = ev.target;
    const stepBtn =
      t?.closest?.('button[data-action="step"]') ||
      t?.closest?.('button.sinlesscsb-step');
    if (stepBtn) console.log("CAPTURE saw step click", stepBtn.outerHTML);
  };
  document.addEventListener("click", handler, true);
  return { remove: () => document.removeEventListener("click", handler, true) };
})();


If this logs but your handler does not: you bound to the wrong root, or never bound at all.

3) Confirm onRender is actually running and root is correct

In onRender, log:

root

root.querySelectorAll('button[data-action="step"],button.sinlesscsb-step').length

root.querySelectorAll("form").length

This distinguishes “no onRender” vs “wrong root” vs “content not present yet”.

Canonical binding pattern (use everywhere)
Rule 1 — Bind to a deterministic container, not assumptions about inner forms

In Foundry v13 DialogV2, the most stable container is:

const bindRoot = root.querySelector("form") || root;


Do NOT require form.sinlesscsb.<whatever> to exist; Foundry may rewrap/normalize it.

Rule 2 — Guard on the bind root, not on transient roots or assumptions

Use a dataset guard on bindRoot:

if (bindRoot.dataset.sinlessBound === "1") return;
bindRoot.dataset.sinlessBound = "1";

Rule 3 — Use delegated click handling in capture phase

Capture phase is more resilient under Foundry UI:

bindRoot.addEventListener("click", handler, true);


Inside handler, match the button via closest(...):

Item Roll: button[data-action="step"]

Cast Spell: button.sinlesscsb-step

Rule 4 — Locate the target input relative to the clicked button first

This prevents wrong input matches when multiple inputs share the same name or layout is complex:

Try local container (tr, td, div)

Fallback to bindRoot

const localContainer = btn.closest("tr") || btn.closest("td") || btn.closest("div");
const input =
  localContainer?.querySelector(`input[name="${CSS.escape(field)}"]`) ||
  bindRoot.querySelector(`input[name="${CSS.escape(field)}"]`);

Rule 5 — Clamp correctly: use getAttribute() for min/max

Never do Number(input.min) when attribute may be missing.

Canonical clamp logic:

const minAttr = input.getAttribute("min");
const maxAttr = input.getAttribute("max");

const minRaw = (minAttr == null || minAttr === "") ? NaN : Number(minAttr);
const maxRaw = (maxAttr == null || maxAttr === "") ? NaN : Number(maxAttr);

const min = Number.isFinite(minRaw) ? minRaw : -Infinity;
const max = Number.isFinite(maxRaw) ? maxRaw : Infinity;


Then clamp and floor.

This was the direct fix for Item Roll sit not incrementing (stuck at 0).

Rule 6 — Always dispatch input/change after programmatic updates

After setting input.value, dispatch:

input.dispatchEvent(new Event("input", { bubbles: true }));
input.dispatchEvent(new Event("change", { bubbles: true }));


This ensures derived values update and FormData reads correctly.

Rule 7 — Cleanup on close (prevent accumulation)

Wrap close once and remove the listener:

if (!dialog._sinlessCloseWrapped) {
  dialog._sinlessCloseWrapped = true;
  const origClose = dialog.close.bind(dialog);
  dialog.close = async (...args) => {
    try { bindRoot.removeEventListener("click", handler, true); } catch (_e) {}
    return await origClose(...args);
  };
}

Rule 8 — Avoid unsafe re-entry patterns

Do not use:

arguments.callee (breaks in arrow functions / strict mode)

calling dialog._onRender() manually

If you truly need “retry binding,” prefer a single queueMicrotask(() => attemptBind()), but ideally avoid timing sensitivity by binding to bindRoot and using delegated matching.

Canonical CSS/layout fix for vertical stacking steppers (Cast Spell)

Even when the HTML is - input +, Foundry’s dialog styles may force stacking.

Preferred fix: inline grid on the row container

This is the most deterministic fix we used successfully.

Add inline style to the row wrapper:

<div class="sinlesscsb-spell-row"
     style="display:grid !important; grid-template-columns:2rem 1fr 2rem; gap:8px; align-items:center;">
  ...
</div>


This defeated Foundry’s dialog form CSS when selector-based CSS continued to compute as display: block.

Notes

Selector-based CSS may fail because Foundry rewraps inner form elements, and specificity may outcompete your injected style block.

Inline style should be reserved for “Foundry CSS wins no matter what” cases. When possible, prefer a stable selector with adequate specificity, but use inline as the canonical fallback.

Proven resolutions from this project (summary)
Item Roll dialog

Buttons existed but did nothing: fixed by binding to bindRoot = root.querySelector("form") || root and using delegated capture-phase click.

sit (situational modifier) stuck at 0: fixed by correcting min/max parsing via getAttribute() so missing bounds do not clamp to 0.

Cast Spell dialog

Stepper clicks: stabilized using the same binding approach as Item Roll (bindRoot + delegated capture + correct clamp).

Stepper UI stacked vertically: fixed by adding inline grid layout to .sinlesscsb-spell-row containers.

Canonical implementation recommendations

Standardize a shared helper in _util.js to provide:

getBindRoot(root) (root.querySelector("form") || root)

clampNumberInput(input, value) using getAttribute min/max

bindDialogSteppers({ dialog, root, buttonSelector, fieldResolver })

Cleanup-on-close wrapper

Every DialogV2 should:

Bind in onRender(dialog, root) only

Use delegated capture-phase click handling

Never rely on nested form selectors being preserved by Foundry

For any numeric inputs without explicit min/max:

Assume unbounded unless rules specify otherwise

Ensure clamp logic treats missing attributes as ±Infinity

For any layout issues with steppers:

First attempt selector-based grid on .sinlesscsb-*-row

If computed style still shows block, use inline grid on the row container.

