# SinlessCSB — Foundry v14 + CSB 6 Isolated Test Report

**Date:** 2026-08-24 · **Branch:** `feat/v14-csb6-migration` · **Repo:** `/home/kerozelvin/git/sinless-csb-module`
**Rig:** Foundry VTT **14.367** (Node build, `~/.local/share/FoundryVTT-v14-test`, port 32132, localhost, UPnP off) · System **Custom System Builder 6.0.2** · Module **SinlessCSB 0.1.1** (linked working tree)
**Drive method:** headless Chrome (CDP) — loaded setup, enabled module, imported all six compendiums, invoked every API surface in-world, captured console per surface.

---

## 0. Rig bring-up (B1–B2) — PASS

- Isolated data dir `~/.local/share/FoundryVTT-v14-test` created; **live v13 install at `~/.local/share/FoundryVTT` untouched** (verified by git/`ls` — no writes).
- Foundry **14.367** obtained via the official self-update API using the **existing license key** (`Config/license.json`, `valid_key: true`) — no new credentials required. Node 24.18.1 (nvm).
- CSB **6.0.2** installed into the test data dir (`system.json` verified: minimum 14, verified 14.365).
- Module **linked** from repo working tree (`Data/modules/sinlesscsb → repo`); world `sinless-v14-test` created and launched.
- License activation: `Software license verification succeeded`. Server bound to localhost:32132, UPnP disabled.
- Login: Foundry creates a default GM user **"Gamemaster"** (no password) on first world boot — used that (admin password setup via Setup Configuration UI did not persist `Config/admin.txt`; not needed for the test).
- One boot console error (environmental): `Foundry VTT requires usable window dimensions of 1024px by 768px` — resolved by resizing the headless window to 1400×900. No further boot errors.

## 1. Module load — PASS

`SinlessCSB | ready` · `SinlessCSB | API keys (ready)` · `SinlessCSB | Combat hooks registered (pools)` · `SinlessCSB | CarChase RollTable set from compendium`.
All **six compendiums** present and indexed: macros 9, actor-templates 101, item-templates 436, journal 0, rollabletables 1, scenes 2. **Zero exceptions** at load.

## 2. Pack import into test world — PASS (B4 evidence)

All six packs imported via `pack.importAll()` into the test world with **zero console errors/warnings**. Resulting world: **101 actors, 873 items, 5 scenes, 2 CarChase tables, 9 macros, 0 journal**.
Post-import scan for legacy keys: **0 actors and 0 items contain any `modifiers` / `activeConditionalModifierGroups` keys** — CSB 6.0.2 silently strips the empty legacy CSB 5 structures on import, exactly as predicted by `modifier-census.md` §Findings.5. **No semantic conversion is required.**

## 3. API surface walk — per-surface results

Fixtures: `273-B_L0` (PC rigger, 34 items, 33 skills, 183 props), `DRIVER` (PC, 31 items, rig items), `ARCHMAG` (mage, spells with `drainFormula`), `Session Settings` (TN_Global=4, SkillMeta_JSON), `Car Chase` scene + `CarChase` RollTable (22 card results), `Sinless` scene.

| # | Surface | Result | Notes |
|---|---------|--------|-------|
| 1 | **item-roll** | **PASS** | `rollItem` (Photon Reaver Ei-7): dialog rendered (TN 4, Finesse 14, Skill_Firearms 5, Limit 11); roll executed — 11 dice, **9 successes**, damage 4 (flat), pool Finesse 14→3. Chat message posted. 0 errors. |
| 2 | **cast-spell** | **PASS** | `castSpell` (ARCHMAG "Flight", Skill_Sorcery): dialog (Cast Limit 7, Drain Resist 6); cast executed — chat: `Flight — Cast, 1 SUCCESS, Drain applied: 1` (Force 1, 7d6 vs TN 4). Resolve pool intact after. 0 errors. |
| 3 | **pools-roll** | **PASS** | `rollPools` dialog (Brawn 18/18, Finesse 3/14, Resolve 23/23, Focus 15/15); spend-guard works (`No dice to roll (Spend + Mod is 0)` — correct UX when spend=0); with spend 3 → `Brawn Test 2 SUCCESSES`, Brawn_Cur 18→15. `refreshPools` → `{mode:"rulesModule"}` (rules module path). `refreshKismet` → `{before:1, after:1}` (kismet full, no error). |
| 4 | **pools refresh (combat)** | **PASS** | Combat start fires `SinlessCSB | Pools refreshed` + `Kismet refreshed on combat start`. **Design gate confirmed:** `refreshPoolsForActor` early-returns unless `actor.hasPlayerOwner` (`shouldIncludeActor` — "pools are a PC mechanic"). GM-owned template actors are skipped by design. With a player-owned actor (test player granted ownership): Resolve_Cur 5→13, Focus_Cur 5→20. |
| 5 | **initiative-roll** | **PASS** | `rollInitiative` (273-B_L0): 15 dice vs TN 4 → 7 successes → **initiative 13**. `rollNpcInitiative` (NPC "Stormtrooper Drones" with `NPCinit:15` on scene): `{count:1, updates:[{initiative:15}]}`. Correct guard when no NPCinit tokens on scene (`no NPC tokens found with system.props.NPCinit`). |
| 6 | **alert-tracking** | **PASS** | `resetTrackAlert` → `{ok:true, value:0}`. `addTrackAlert({delta:3})` → `{ok:true, value:3}`. **Combat-delete hook resets the track**: after `combat.delete()` alert back to `{ok:true, value:0}` (`deleteCombat → resetTrackAlert` verified). |
| 7 | **table-to-tile** | **PASS** | `drawTableResultTile` (CarChase table → Car Chase scene): tile created with result card img + flags `{tableUuid, resultId, resultImg}`. |
| 8 | **chase-controls** | **PASS** | `drawChasePath` (primary slot, x60/y60/200×300): chase tile placed with `chase` flag; `clearChaseBoard({requireConfirm:false})` → `{cleared:1}` (only the `flags.sinlesscsb.chase===true` tile). Pile/cursor state persisted on scene flag. |
| 9 | **drone/rig deploy** | **PASS** | `ensureOwnedDroneForItem` (DRIVER Roto-Drone): created owned actor (`Actor.XKAOMM7Ti3hQm7NX`, actor count 101→102). `deployOwnedDrone`: **requires a controlled token as spawn anchor** (correct guard: `Select an actor token to spawn rig asset next to`); with anchor → Roto-Drone token spawned (scene tokens 1→2). `ensureOwnedVehicleForItem` + `deployOwnedVehicle` (Sports Car): actor created + token spawned (2→3). Rig item without `findItemdrone` prop → correct defensive warn (`rig item missing findItem key`). |
| 10 | **token bar mirroring** | **PASS** | `registerTokenBarsBidirectionalHooks`: **canonical→bar** — `stunCur` 2→3 mirrored `system.props.stunBar.value` 2→3; **bar→canonical** — editing `stunBar.value` 3→1 mirrored `stunCur` 3→1 (token-HUD edit path). Verified both directions. |
| 11 | **actor template auto-refresh** | **PASS** | `refreshActorTemplatesFromModule()` → `{ok:true, moduleVersion:"0.1.1", templatesSeen:6, templatesUpdated:0, actorsReloaded:0}`; 6 templates found, `skippedTemplates` reasons all benign (`name-only-unmanaged`). 0 errors. |

**Overall: 11/11 PASS.** No module-originated exceptions on any surface.

## 4. Exact console warnings captured

Attribution: **all warnings below are Foundry-core deprecation notices; two of the three sources are CSB 6.0.2, one is SinlessCSB.**

1. `Error: You are accessing the global "SceneNavigation" which is now namespaced under foundry.applications.ui.SceneNavigation. Deprecated since Version 13. Backwards-compatible support will be removed in Version 15.` — **emitted by CSB 6.0.2** (fired during CSB prop-computation/scene-loading during pack import and roll surfaces).
2. `Error: SceneNavigation.displayProgressBar is deprecated in favor of Notifications#notify using the {progress: true} option. Deprecated since Version 13. Backwards-compatible support will be removed in Version 15.` — **emitted by CSB 6.0.2** (multiple times, same source).
3. `Error: TableResult#text is deprecated. Use TableResult#name or TableResult#description instead. Deprecated since Version 13. Backwards-compatible support will be removed in Version 15.` — **emitted by SinlessCSB** `scripts/api/table-to-tile.js:69` (`const textSrc = extractFirstImgSrcFromHTML(result?.text)`) via the `TableResult#text` getter. Fires on every table-to-tile / chase draw. Will break in Foundry v15.
4. One runtime exception: `TypeError: Cannot use 'in' operator to search for 'turn' in undefined — at CombatTracker._onRender` — **Foundry core**, triggered by my test deleting a combat mid-render (test artifact, not a module fault).

No `packs/` or module-load errors.

## 5. Converted-pack summary (B4)

Method: read-only plyvel pass over all six pack LevelDBs (copied to /tmp), mechanical strip of legacy empty `modifiers` / `activeConditionalModifierGroups` keys (all confirmed empty by census), emit candidate JSON per document to `docs-internal/v14-migration/converted-packs/<pack>/`. **Nothing written inside `packs/`.**

| Pack | Source entries | Docs changed (legacy keys stripped) | Converted files |
|---|---|---|---|
| sinlesscsb-actor-templates | 315 | **296** | 308* |
| sinlesscsb-item-templates | 469 | **435** | 469 |
| sinlesscsb-macros | 11 | 0 | 11 |
| sinlesscsb-journal | 0 | 0 | 0 |
| sinlesscsb-rollabletables | 23 | 0 | 23 |
| sinlesscsb-scenes | 5 | 0 | 5 |
| **Total** | **823** | **731** | **816** |

\* 315 actor-templates entries contain **7 in-pack duplicate rows** (same `_id` under two LevelDB keys — standard Foundry compendium storage, byte-identical content); 308 unique files after dedup. `_conversion-summary.json` is included.
Changed counts match the Phase A census exactly (296 = 201 item `modifiers` + 95 `activeConditionalModifierGroups`; 435 item `modifiers`).

**Conversion verdict: no semantic Active Effect conversion was needed** (zero modifier data existed — see census). The re-exported candidate packs are CSB-6-native (legacy empty keys stripped) and are **candidate** artifacts only — the live module packs were deliberately left untouched.

## 6. Remaining risks

1. ~~**SinlessCSB `TableResult#text` deprecation (v15 break).** `scripts/api/table-to-tile.js:69` reads `result.text`; deprecated since v13, **removed in v15**. Fires on every chase/table-to-tile draw.~~ **FIXED in Phase C** (commit `025b1b7`): fallback now reads `result.name` (the v14 getter returned `description` for text-type results, which the earlier fallback already handles; `name` covers the rest). Re-verified in-world: `drawTableResultTile` + `drawChasePath` place tiles with **zero deprecation events and zero errors**.
2. **CSB 6.0.2 core deprecations.** `SceneNavigation` global + `SceneNavigation.displayProgressBar` (deprecated v13, removed v15) are used by CSB 6.0.2 and warn on every import/roll-heavy pass. Upstream CSB issue; monitor CSB releases. Not module-blocking on v14.
3. **Compendium access writes housekeeping files into `packs/`.** Because the module is symlinked from the repo working tree, the running server rotates LevelDB `LOG`/`MANIFEST`/`CURRENT` files inside `packs/` (no document data — verified; restored to HEAD after testing). Any future live test run against the symlinked module must `git checkout -- packs/` afterward.
4. **Admin credential persistence.** Setting the administrator password through the v14 Setup Configuration UI did not write `Config/admin.txt` in the test rig (auth failed; worked around via the default "Gamemaster" user). Confirmed only on this test data dir — the live v13 install was not touched.
5. **`sinlesscsb-journal` compendium is empty (0 docs).** Pre-existing (noted in census), unaffected by CSB 6.
6. **`poolsOnCombatStart` gate is player-owner-only.** GM/NPC template actors are intentionally skipped by `shouldIncludeActor` (`hasPlayerOwner`). If the table wants GM-run NPCs' pools to auto-refill, that gate needs revisiting (design decision, not a bug).
7. **Foundry core CombatTracker render exception** on rapid combat-delete (core edge case; only in aggressive test conditions).
8. Headless Chrome lacks hardware acceleration → one performance warning (environmental, not migration-related).

## 7. Test-rig verdict

The isolated v14 rig (Foundry 14.367 + CSB 6.0.2 + linked module) **passes all eleven API surfaces with zero module-originated errors**. The v13→v14/CSB5→CSB6 migration is **regression-clean** for the module's behavior: pack data imports cleanly, legacy modifier structures are silently stripped by CSB 6, and the Active-Effect conversion is a confirmed no-op (candidate converted packs produced as evidence). The only actionable code-level debt found is the `TableResult#text` deprecation (v15-forward).
