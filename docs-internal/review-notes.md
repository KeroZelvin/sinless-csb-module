# SinlessCSB – Review Notes

This document captures architectural observations, design intent, and review notes
for the Sinless Custom System Builder (CSB) Foundry VTT module.

It is intended to be:
- a living review log,
- a reference for future refactors,
- and a fast orientation document for new ChatGPT threads or collaborators.

---

## Snapshot Context

This review is based on a snapshot ZIP generated via `Snapshot.ps1`, which includes:

- Source code (`scripts/**`)
- CSB templates (`csb/**`)
- Styles (`styles/**`)
- Macro exports (`macros/**`)
- Continuity docs:
  - `docs-internal/current_state.md`
  - `docs-internal/known_good_patterns.md`
  - `docs-internal/compendium-index.md`
- Diagnostic/meta files:
  - `packs-index.md`
  - `SNAPSHOT-OVERVIEW.md`
  - `SNAPSHOT-META.md`

The snapshot intentionally **excludes LevelDB compendium contents** (`packs/**`)
to keep the bundle small, reviewable, and Forge-safe.

---

## Core Architectural Decisions (Confirmed)

### 1. CSB Templates Are First-Class Module Assets

Actor and Item templates are stored under:

- `csb/actor-templates/`
- `csb/item-templates/`

These templates are **required for the module to function**, not optional examples.
In particular:
- PC and NPC actor templates include critical UUID-backed fields used by macros.
- Session / settings actor templates act as global state carriers.

**Implication:**  
The module is not usable unless these templates are present. Treat them as part of
the system’s runtime contract, not content.

---

### 2. Compendiums Are Source-of-Truth for Content, Not Runtime State

Weapons, skills, spells, and macros are expected to live in compendiums and be
dragged into worlds as needed.

However:
- LevelDB files are noisy, heavy, and unsuitable for Git or review.
- Forge storage quotas make in-world duplication undesirable.

**Resolution:**  
A generated Markdown index (`docs-internal/compendium-index.md`) is the authoritative
inventory of compendium contents for review and reasoning.

This index is:
- generated via a Foundry macro,
- downloaded locally,
- committed to Git,
- and included in snapshots.

---

### 3. Snapshot-Based Review Is the Primary ChatGPT Workflow

A dedicated snapshot process (`Snapshot.ps1`) exists to create a **review bundle**
without polluting the release build or the Foundry world.

Key properties:
- Output directory: `dist-snapshot/` (never overlaps with release `dist/`)
- Includes only human-reviewable artifacts
- Emits orientation files:
  - `SNAPSHOT-OVERVIEW.md`
  - `SNAPSHOT-META.md`
  - `packs-index.md`

**This snapshot ZIP is the preferred artifact for starting new ChatGPT threads.**

---

### 4. No In-World Journals for Development Metadata

Early versions considered creating JournalEntries inside Foundry to store indexes.
This was explicitly rejected because:
- it adds clutter to worlds,
- consumes Forge storage quota,
- and duplicates information better kept in Git.

**Rule:**  
Development metadata lives in the repo, not in Foundry worlds.

---

## Code Organization Review

### `scripts/`
- `main.js` appears to be the module entry point.
- Logic is split cleanly into:
  - hooks (`scripts/hooks/**`)
  - rules (`scripts/rules/**`)
  - shared pool logic (`scripts/pools.js`)
- Roll macros (item, pool, initiative) exist both as JS sources and JSON exports.

This structure is sane and scales well.

---

### `macros/`
- JSON macro exports are included for reference and portability.
- These are not required at runtime but are useful for:
  - diffing,
  - migration,
  - and re-importing into worlds.

Future decision:
- Decide whether JSON exports remain canonical or are treated as artifacts only.

---

### `styles/`
- CSS is modularized (global UI + themes).
- Indicates expectation of UI customization and sheet styling.

No action needed; structure is appropriate.

---

## Known Risks / Watch Items

### 1. Template UUID Stability
Because macros depend on CSB template-defined fields:
- UUID changes or template deletion will break runtime behavior.
- Versioning of templates must be deliberate.

Consider:
- documenting template version expectations,
- or adding guard checks in macros.

---

### 2. Compendium Growth
As item/skill/spell counts grow:
- `compendium-index.md` will become long.
- That is acceptable, but consider:
  - grouping conventions,
  - or per-pack notes sections.

---

### 3. Macro ↔ Template Coupling
Some macros implicitly assume:
- presence of specific actor templates,
- presence of session/global actors.

This coupling is acceptable but should remain **explicitly documented**
rather than “tribal knowledge.”

---

## Open Questions (To Revisit)

- Should template versions be encoded explicitly?
- Should there be a minimal “bootstrap” checklist for new worlds?
- Should some runtime guards be added to detect missing templates early?
- Long-term: does this module eventually replace CSB entirely, or remain layered on top?

---

## Reviewer Notes (Freeform)

_Add ongoing observations here as the system evolves._

- Snapshot workflow is now stable and repeatable.
- CSB template inclusion was a critical missing piece that is now resolved.
- Markdown-based indexes dramatically improve reviewability and ChatGPT effectiveness.

Below are the Skill Keys actually present on your Sinless PC Actor template (from sinlesscsb-snapshot\csb\actor-templates\fvtt-Actor-sinless-pc-409875cd45a544c0.json). These are the exact strings you should use in items/macros when you mean “the actor’s skill field key”.

Skill Keys on the Sinless PC sheet (33)
Combat / Weapons

Skill_Archery

Skill_EnergyWeapons

Skill_Firearms

Skill_Gunnery

Skill_HeavyWeapons

Skill_MartialArts

Skill_MeleeWeapons

Skill_ThrowingWeapons

Skill_UnarmedCombat

Physical / Movement / Survival

Skill_Athletics

Skill_ArticulatedManeuvers

Skill_Drive

Skill_Fly

Skill_Survival

Stealth / Perception / Fieldcraft

Skill_Observation

Skill_Reconnaissance

Skill_Safecracking

Skill_Shadow

Social / Influence

Skill_Coercion

Skill_Fascination

Skill_Leadership

Skill_Negotiation

Skill_Subterfuge

Matrix / Tech

Skill_CyberCombat

Skill_EWarfare

Skill_Hacking

Skill_Engineering

Skill_Biotech

Skill_Artificing

Magic

Skill_AstralSenses

Skill_Channeling

Skill_Conjuring

Skill_Sorcery

Guidance doc note: your spell items should default skillKey to Skill_Sorcery (not "Sorcery"), since the sheet uses the Skill_* keys.

---

Font Awesome icon keys in CSB templates must be lowercase.
CSB does not normalize or validate icon strings.

Valid

"icon": "dice"


Invalid (breaks CSB silently)

"icon": "Dice"


Other safe examples:

"dice"

"dice-d6"

"bolt"

"book"

"magic" (if available in your FA version)

---

_End of review notes._
