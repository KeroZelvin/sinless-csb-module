# SinlessCSB Pack Modifier Census (CSB 5 → CSB 6)

**Date:** 2026-08-24 · **Branch:** `feat/v14-csb6-migration` · **Repo:** `/home/kerozelvin/git/sinless-csb-module` @ `8539359`

## Method

- Tool: **python3 + plyvel 1.5.1** (proper LevelDB reads — plyvel was already installed; raw `.ldb` string extraction was NOT needed).
- All six packs were **copied to `/tmp/sinless-census/<pack>` first** and the copies were opened read-only (`plyvel.DB(..., create_if_missing=False)`). Nothing was written inside `packs/` — verified by `git status` staying clean during the scan.
- Every LevelDB value was parsed as JSON and walked recursively for any key containing `modifier` (case-insensitive), plus regex sweeps of raw bytes for `"modifiers":`, `"itemModifier"`, `"statusEffectModifier"`, and `"conditionalModifier"` patterns, plus every case-insensitive prose occurrence of "modifier".

## Per-pack results

| Pack | Documents | Doc types | `"modifiers"` keys | Non-empty modifier entries | `activeConditionalModifierGroups` | Other modifier refs |
|---|---|---|---|---|---|---|
| `sinlesscsb-actor-templates` | 315 | 201 `equippableItem`, 95 `character`, 13 `Actor`, 6 `_template` | **201** | **0** | **95** (all `[]`) | 0 |
| `sinlesscsb-item-templates` | 469 | 411 `equippableItem`, 33 `Item`, 24 `_equippableItemTemplate`, 1 `subTemplate` | **435** | **0** | — (not present) | 0 |
| `sinlesscsb-macros` | 11 | 9 `script`, 2 `Macro` | 0 | 0 | 0 | 0 |
| `sinlesscsb-journal` | **0** (empty pack) | — | 0 | 0 | 0 | 0 |
| `sinlesscsb-rollabletables` | 23 | RollTable docs | 0 | 0 | 0 | 0 |
| `sinlesscsb-scenes` | 3 | Scene docs | 0 | 0 | 0 | 0 |
| **Total** | **821** | | **636 keys** | **0 entries** | **95 keys** | **0** |

## Findings

1. **No actual modifier data exists anywhere in the packs.** All 636 `"modifiers"` arrays and all 95 `"activeConditionalModifierGroups"` fields are **empty (`[]`)**. There are zero `itemModifier` / `statusEffectModifier` component types, zero non-empty modifier entries, and zero prose mentions of "modifier" in any pack document.
   - Example (typical shape, identical in every hit):
     `"...stunBar":{"value":0,"max":0}},"activeConditionalModifierGroups":[]},...`
     `"...system":{"modifiers":[],...}`
2. **Module scripts are clean too.** `grep -rniE "modifier" scripts/` yields exactly one hit: `scripts/api/cast-spell.js:337` — `<label>Static dice modifiers</label>`, a cosmetic dialog label for static roll bonuses, unrelated to the removed CSB Item/Status Effect Modifier feature. No API surface reads or writes CSB modifier structures.
3. **Affected templates: none.** Because no template carries modifier logic, no actor/item template loses behavior under CSB 6.0.0's removal of Item Modifiers and Status Effect Modifiers.
4. Side observation: `sinlesscsb-journal` contains **zero documents** (empty compendium) — flagged separately, not a modifier issue.

## Proposed Active Effect conversion mapping

**Trivial / no-op.** There is nothing to convert:

| Legacy structure | Instances with data | Conversion required |
|---|---|---|
| `system.modifiers[]` (Item Modifiers) | 0 of 636 keys | None |
| `system.activeConditionalModifierGroups` | 0 of 95 keys | None |
| Status Effect Modifiers | 0 | None |

The only residual risk is **structural**: CSB 6 may reject or warn on unknown legacy keys (`modifiers`, `activeConditionalModifierGroups`) when importing v5-era documents. This is validated empirically in Phase B (import all six packs into the v14 test world and watch console output); if CSB 6 strips the empty keys silently, no action is needed. If it errors, the remediation is a mechanical key-strip on re-export inside the test world — no semantic judgment required.

Phase B4 (Active Effect conversion) therefore reduces to: import packs into the test world, confirm zero conversion work is needed, and re-export candidate packs so the repo gains a CSB-6-native copy without legacy keys (only if exports differ from sources).
