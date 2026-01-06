Below is a refined **CURRENT_STATE.md** incorporating what we learned/implemented in this thread, while preserving your existing architecture and decisions.

---

# SinlessCSB / Foundry v13 – Roll Initiative, Actor Binding, and Pool Refresh

## Current Working State Summary

### Environment

* **Foundry VTT:** v13
* **Custom System Builder (CSB):** v5
* **Actor Sheets:** CSB v2 templates (`actor-character-sheet.hbs`)
* **Module:** `sinlesscsb` (local dev, injected via module JS)

---

## Roll Initiative Button & Actor Binding

### Goal (Achieved)

Add a “Roll Initiative” button to CSB actor sheets that:

* Always rolls for the **actor whose sheet is open**
* Works with **multiple actors per user** (PCs, NPCs, drones, pets)
* Does **not** rely on:

  * selected tokens
  * `game.user.character`
  * CSB compute context (`linkedEntity`, `props`, etc.)
* Calls the existing world macro: **Sinless Roll Initiative**
* Correctly updates combat + chat speaker

### Key Discoveries

#### 1. CSB Buttons Cannot Bind Actors Reliably

CSB v5 button / computable scripts:

* `linkedEntity` is undefined
* `props` unavailable
* No access to actor/document
* Hidden/data-only fields are not supported

**Conclusion:** actor binding must be done outside CSB, at the **module layer**.

#### 2. Correct Hooks for CSB v2 Actor Sheets (Foundry v13)

CSB v2 actor sheets do not reliably fire legacy `renderApplication`.

Confirmed working hooks:

* `renderCharacterSheetV2`
* `renderCustomActorSheetV2` ✅ (primary)
* `renderActorSheetV2`
* `renderApplicationV2`

Debug:

* `CONFIG.debug.hooks = true;`

#### 3. Stable Actor Resolution in Hooks

Correct pattern inside render hooks:

```js
const actor =
  context?.document?.documentName === "Actor"
    ? context.document
    : app?.document;
```

This binds reliably to the **open sheet’s actor**, independent of token state.

#### 4. Correct Root Element for Injection

* In ApplicationV2, `app.element` is the stable DOM root.
* Hook `element` can be replaced during CSB re-renders.

Resolve root:

```js
const root =
  app?.element instanceof HTMLElement ? app.element : element;
```

---

## Anchor-Based Placement (Best Practice)

### Problem

Direct DOM injection into `.window-content` is fragile due to CSB re-renders.

### Solution (Working)

Use CSB as layout only, module as logic.

In CSB, add a **Text Field component**:

* **Component Key:** `sinlesscsb_anchor_init`
* Label empty, value unused
* Place it where the button should appear

In module:

* Locate anchor via DOM search
* Inject button into wrapper
* Hide the text input if necessary

Robust anchor detection includes:

* wrapper `data-key`
* wrapper `data-component-key`
* `<input name|id|data-*>` containing the key

Injection delayed via `queueMicrotask()` to survive CSB multi-pass rendering.

### Button Injection Behavior

* On each render, avoid duplicates and stale closures:

  * remove existing button **or**
  * check presence and reinject safely
* Ensures click handler binds to current actor

---

## Initiative Macro: Critical Fixes (v1.4)

### Root Cause of “Wrong Actor” Rolls

Macro previously preferred:

* `game.user.character`
* selected token actor
  before `{ actorUuid }`

### Fix Implemented

Priority order:

1. `actorUuid` (passed from sheet button) ✅
2. selected token actor
3. `game.user.character`

Macro: **Sinless Roll Initiative v1.4**

* Always uses correct actor
* Updates combatant correctly
* Uses CSB props for REA/Focus
* Posts chat with explicit actor speaker

---

## Chat Showing “Character (8)” – Root Cause & Fix

Cause:

* Chat header uses **token name**, not actor name
* Duplicated tokens can retain old auto-generated names

Permanent fix:

* Actor → **Prototype Token**

  * Name = Actor name
  * enable “Use Actor Name” / “Link Actor Data” (PCs)

Result:

* New tokens inherit correct name
* Chat header displays correctly (no macro hacks)
* Manual token rename only affects that one token

---

## NEW: Canonical Actor UUID Strategy (ActorUuid)

### Problem Observed

Token-synthetic actor UUIDs (`Scene...Token...Actor...`) cause drift:

* combat updates may refresh base actor
* macros/dialogs may bind to token actor
* UI can appear “stale” even though data updated

### Solution (Implemented)

Store the canonical base actor UUID into **CSB props**:

* **Field:** `system.props.ActorUuid`
* **Value:** `Actor.<id>` (base actor uuid)

#### How ActorUuid is populated (Module)

In `sheets.js`, on sheet render (via `renderCustomActorSheetV2` etc.):

* ensure `system.props.ActorUuid` is set to base actor UUID
* must be done at module layer (CSB compute layer cannot do it)
* important detail: create the `system.props` object if missing using an object update (CSB timing)

This removed the need for a manual macro like:

```js
await actor.update({ "system.props.ActorUuid": actor.uuid });
```

(which could write token synthetic UUIDs and/or fail due to timing).

---

## Current Known-Good Architecture

### CSB

* Layout only
* Provides anchor points via component keys (`sinlesscsb_anchor_init`)
* Stores `ActorUuid` as a visible CSB prop field (component key: `ActorUuid`) for downstream resolution

### Module (`sinlesscsb`)

* All logic
* Actor binding
* DOM injection
* ActorUuid “ensure” on sheet open
* Pool refresh automation

### World Macros

* Initiative math, combat management, chat output
* Pool roll dialog
* All macros should prefer canonical actor resolution (ActorUuid first)

This separation is stable, scalable, and Foundry-v13-correct.

---

# SinlessCSB – Pool Refresh per Combat Round (Testing & Fixing Summary)

## Design Intent (Rules-Level)

* Pools are **PC-only** in Sinless.
* NPCs do not use pools and must be ignored.
* At the start of each combat round, all PCs should:

  * Recalculate max pools from attributes
  * Reset current pools to max
* Pool Max values only change when attributes change; recalculating at round start is acceptable.

## Pools Involved

* Brawn
* Finesse
* Resolve
* Focus

Each pool has:

* `*_Max`
* `*_Cur`

Stored in:

* `actor.system.props`

---

## Implementation (Module Code)

### File

`scripts/rules/pools.js`

### PC filtering

```js
return !!actor?.hasPlayerOwner;
```

### Refresh for one actor

* recompute pools
* set `*_Cur = computed`
* set `*_Max` only if changed (or missing)

### NEW: refreshPoolsForCombat canonicalization (ActorUuid first)

**Fix implemented:** `refreshPoolsForCombat()` now resolves canonical base actors before refreshing:

* Prefer `system.props.ActorUuid` (via `fromUuid`)
* Else token actor → base actor
* Else actor itself

Purpose:

* combatants often reference token-synthetic actors
* updates must land on the canonical base actor consistently

---

## Combat Hook (Module)

### File

`scripts/hooks/combat.js`

Expected behavior:

* On combat start and each new round:

  * call `refreshPoolsForCombat(combat)`

Foundry v13 hooks to use/verify:

* `updateCombat` (when `changed.round` increments)

Constraints:

* Combat does not “start” until a combatant is set as current turn
* Round advancement is driven by:

  * clicking initiative die on first combatant
  * clicking Next Turn

---

## Testing Flow (Manual QA Checklist)

### Setup

* Create PC actor (must have `hasPlayerOwner = true`)
* Open PC sheet once to ensure `system.props.ActorUuid` is populated
* Place PC token on scene
* Ensure pools have `_Max` populated
* Reduce `_Cur` (simulate spending)
* Add NPC to same combat (NPC must NOT refresh pools)

### Test 1 – Combat Start

* Add PC and NPC to combat tracker
* Roll initiative
* Click initiative die on first combatant (starts combat)

Expected:

* PC pools refresh to max
* NPC unaffected
* no console errors

### Test 2 – New Round

* Spend pools (reduce `_Cur`)
* Next Turn until round increments

Expected:

* on round change: all PC pools reset (`*_Cur = *_Max`)
* NPC ignored
* refresh occurs once per round

### Test 3 – Multi-PC Combat

* Add multiple PCs
* Reduce pools on all
* Advance round

Expected:

* each PC refreshed once
* no partial updates/races

---

## NEW: Pool Roller Macro (DialogV2) – Canonicalization + Live Refresh

### Problem Found

Pools were refreshing (verified on base actor), but the **Pools dialog UI** did not update unless closed/reopened due to:

* dialog binding to token synthetic actor or stale values
* dialog not listening for actor updates

### Fixes Implemented in Sinless Pool Roll macro

1. **Canonical Actor Resolution** inside macro:

   * resolve to base actor using `system.props.ActorUuid` (fromUuid) first
   * fallback token baseActor
2. **Live UI refresh**:

   * dialog registers a `Hooks.on("updateActor", ...)` listener scoped to the actor id
   * when `changed.system.props` updates, it refreshes the displayed Cur/Max in-place
   * hook is removed on dialog close to avoid leaks

Result:

* During combat, when round refresh updates pools, the Pools dialog updates immediately without reopening.

---

## Operational Note: GM vs Player View Confusion

Symptom observed:

* after reload, “all actors/items/templates are gone”

Root cause:

* logged in as **player** rather than **GM**, so content was hidden by permissions

Fix:

* log in as GM account

---

## Open Questions / Remaining Verification

* confirm combat hook refresh triggers exactly once on round 1 start (not skipped)
* confirm double-firing protection in `combat.js` is correct and does not suppress valid round-1 refresh
* confirm player clients receive pool refresh updates consistently (they should via actor updates)

---
Combat Pool Refresh (Status: Working)

Pool refresh on combat start is confirmed working.

refreshPoolsForCombat():

Fires exactly once at Round 1 start

Fires again on subsequent rounds as expected

Uses ActorUuid canonicalization to avoid token-synthetic drift

Double-fire protection is working correctly and does not suppress valid Round 1 refresh.

Player clients receive updated pool values correctly via Actor.update() propagation.

Actor Canonicalization (Critical Architecture)

Canonical Actor identity is now defined as:

actor.system.props.ActorUuid (highest priority)

token.parent.baseActor (token-synthetic fallback)

actor itself (last resort)

ActorUuid is:

Injected automatically when an actor sheet opens (ensureActorUuidOnOpen)

Stored in system.props.ActorUuid

Used consistently across:

Combat pool refresh

Initiative rolling

Pool rolling dialogs

This fully resolves multi-token, multi-scene, and player/GM desync issues.

Initiative System (v1.5, Status: Working)

Initiative can now be rolled:

From the sheet

Without a token selected

Without the actor already in combat

Combatants are actor-only (no tokenId required).

Initiative macro behavior:

Canonical actor resolved via ActorUuid

Actor added to combat automatically if missing

Initiative correctly set and visible in tracker

Chat speaker:

Uses token if present

Falls back to actor safely

Sheet → Macro Argument Passing (Foundry v13 Reality)

Foundry v13 does not reliably pass arguments to Macro.execute({ ... })

Implemented one-shot global handoff:

Sheet sets game.sinlesscsb._initActorUuid

Macro reads it if args are missing

Sheet cleans it up immediately after execution

This pattern is now stable and verified.

Pool Roll Dialog (DialogV2, Status: Working)

Uses DialogV2 (ApplicationV2-safe)

Live updates correctly when:

Combat round refresh runs

Pools are refreshed manually

Pools are spent

Dialog listens to updateActor and refreshes only when:

Actor IDs match

system.props changes

Foundry v13 Compatibility Notes (Important)

Roll.evaluate({ async: true }) is deprecated and errors

Correct v13 usage:

const roll = new Roll("Xd6");
await roll.evaluate();


Added guard for 0d6 rolls to prevent invalid evaluations.

## Non-Goals (Already Decided)

* ❌ do not refresh NPC pools
* ❌ do not rely on CSB compute formulas
* ❌ do not require manual macro clicks
* ✅ pool refresh is fully automatic
* ✅ module-level hooks are the correct layer

---

## Recommended Starting Instruction for New Threads

“We have a working Foundry v13 + CSB v5 setup where actor sheet buttons are injected via module hooks (`renderCustomActorSheetV2`), actors are bound via `context.document/app.document`, placement uses CSB anchor components (`sinlesscsb_anchor_init`), canonical actor identity is stored as `system.props.ActorUuid` and must be used to resolve base actors (avoid token-synthetic drift), initiative is handled by Sinless Roll Initiative v1.4 (actorUuid-first), and pool refresh runs automatically each round via combat hooks calling `refreshPoolsForCombat()` which canonicalizes actors by ActorUuid. The Sinless Pool Roll DialogV2 macro also canonicalizes actor resolution and live-refreshes UI via `updateActor` hooks. Please continue from this architecture.”
