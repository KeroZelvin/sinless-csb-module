# SinlessCSB – Current State (API-first)

## Runtime and constraints
- Foundry: **v13**
- System: **CSB v5**
- Live values: **`actor.system.props`** (CSB props root may be configurable; default `system.props`)

## Module direction
We are consolidating all “game logic” into a module API surface:
- `game.modules.get("sinlesscsb").api.castSpell(scope)`
- `game.modules.get("sinlesscsb").api.rollItem(scope)`
- (pending) `game.modules.get("sinlesscsb").api.rollPools(scope)`
- (pending) `game.modules.get("sinlesscsb").api.rollInitiative(scope)` (PC + NPC)

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
  const itemUuid = String(linkedEntity?.uuid ?? entity?.uuid ?? "");
  const actorUuid = String(
    linkedEntity?.parent?.uuid ??
    rollActor?.uuid ??
    actor?.uuid ??
    ""
  );

  game.modules.get("sinlesscsb")?.api?.rollItem?.({ itemUuid, actorUuid });
  return "";
}%
```

## DialogV2 standard (critical)
- Do not call `DialogV2.wait()` directly.
- Always call `_util.openDialogV2(...)`.
- In `onRender`, bind handlers once per root using `root.dataset.<flag> = "1"`.

## Next major refactors
1. **Pools roller → API**
   - Create `scripts/api/pools-roll.js`
   - Reuse `openDialogV2` for complex delegated click handlers and live refresh
   - Preserve the existing Pools dialog UI (table layout + refresh + roll/clear buttons)

2. **Initiative (PC + NPC) → API**
   - Move initiative logic into API functions.
   - Preserve current caller behaviors (sheet buttons and/or rollMessage).
   - Must use the canonical actor resolution + mirroring strategy above.

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

