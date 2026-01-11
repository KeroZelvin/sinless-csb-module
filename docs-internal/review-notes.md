# SinlessCSB – Review Notes (API-first)

## Snapshot context
- Runtime: **Foundry VTT v13** + **Custom System Builder (CSB) v5**
- Project direction: migrate from “large world macros” to a **module API** surface (`game.modules.get("sinlesscsb").api.*`)
- Still true: “snapshot-based review” is the safest workflow for ChatGPT—paste code, console errors, and JSON fragments into repo docs, not Foundry journals.

## Core architectural decisions (current)
### 1) CSB templates call module API (not world macros)
- CSB item templates should call `game.modules.get("sinlesscsb")?.api?...` directly from rollMessage formulas.
- World macros are still acceptable as **thin wrappers**, but the **logic belongs in `/scripts/api/*`**.

### 2) Canonical Actor resolution is mandatory
Foundry token-synthetic actors and sheet actors can drift. The module standard is:
1. Prefer **explicit** `actorUuid` from the caller (CSB rollMessage, macro wrapper, etc.).
2. Otherwise, if `item.parent` is an Actor, use that.
3. Otherwise, fall back to controlled token actor, then `game.user.character`.

Then, before writing updates, resolve **canonical** actor via:
- `actor.system.props.ActorUuid` (preferred, sheet-injected) → `fromUuid(ActorUuid)`
- Else: token-synthetic → base actor
- Else: the actor itself

Updates should be **mirrored** to:
- the resolved actor (sheetActor),
- canonical actor (if different),
- any controlled token-synthetic actors that represent the same canonical actor (optional but recommended).

### 3) DialogV2 is required; DialogV1 is fallback-only
Foundry v13 deprecates ApplicationV1/DialogV1. Some runtimes expose `DialogV2` but **do not expose** `DialogV2.wait()`.
- Standardize on a helper: `openDialogV2(...)` in `_util.js`.
- All interactive workflows (Item Roll, Cast Spell, Pools, Initiative prompts) should use this helper.

### 4) “Remaining track” model is the live convention
For Sinless CSB:
- `*_Cur` pools are “remaining” (spend decreases).
- `stunCur` / `physicalCur` are also treated as **remaining** (drain decreases; overflow handled explicitly).

## Code organization (current)
- `scripts/api/_util.js`  
  Shared helpers: numeric parsing, actor/item resolution, dialog helpers, dice rolling.
- `scripts/api/item-roll.js`  
  API: `rollItem({ itemUuid })` or `{ actorUuid, itemId }`
- `scripts/api/cast-spell.js`  
  API: `castSpell({ itemUuid, actorUuid? })`
- `hooks/*`  
  Sheet/combat/actor-init hooks (automation, pool refresh, sheet binding)

## Known risks / watch items
1. **Duplicate exports** in `_util.js`  
   Ensure there is exactly **one** exported `openDialogV2` helper. Copy/paste merges can accidentally create duplicates.
2. **Imports must be top-level**  
   The JS error “An import declaration can only be used at the top level of a module” means an `import ...` was pasted inside a function/IIFE. Use `await import(...)` for runtime-only imports.
3. **Dialog event binding leaks**  
   When using `onRender`, protect against double-binding via `root.dataset.* = "1"` and/or remove listeners on close.

## Open items (near-term)
- Refactor **Pools** dialog into `scripts/api/pools-roll.js` using the same `openDialogV2` helper (complex click handlers + live refresh).
- Refactor **Initiative** (PC + NPC) into API:
  - Keep rollMessage / sheet button calls thin; push logic to API.
  - Reuse the canonical actor + mirroring pattern.
