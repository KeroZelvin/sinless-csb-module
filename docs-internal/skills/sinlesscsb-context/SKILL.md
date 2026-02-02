---
name: sinlesscsb-context
description: Synthesize and apply SinlessCSB repo context for Foundry v13 + CSB v5; use when working on the sinlesscsb module, API, dialogs, macros, CSS, templates, or when bootstrapping a task without re-stating project background.
---

# SinlessCSB Context

## Scope
Bootstrap new tasks by synthesizing repo context, known-good patterns, and review notes for the SinlessCSB module.

## Startup checklist
1) Confirm you are in the SinlessCSB repo. If not, locate it by searching for `module.json` and `scripts/main.js`, or ask the user for the repo path.
2) Read the three context sources, in order:
   - `docs-internal/current_state.md`
   - `docs-internal/review-notes.md`
   - `docs-internal/known_good_patterns.md`
3) If the task involves routing Create/Import JSON macros or locating content by folder,
   also read: `docs-internal/folder-tree.md`.
4) Note the template JSON location for Foundry exports: `docs-internal/templateJSONS/`.
5) If the task is CSB-specific, consult the CSB wiki:
   - Preferred (online): `https://gitlab.com/custom-system-builder/custom-system-builder/-/wikis/stable/en/Home`
   - Fallback (local clone): `D:/Git/sinlesscsb/.tmp/csb-wiki/stable/en/Home.md`
     - If the clone is missing, create it with:
       `git clone --depth 1 https://gitlab.com/custom-system-builder/custom-system-builder.wiki.git D:/Git/sinlesscsb/.tmp/csb-wiki`
     - If the clone exists, refresh it with:
       `git -C D:/Git/sinlesscsb/.tmp/csb-wiki pull --ff-only`
     - Local page paths mirror the URL path, e.g.:
       `.../stable/en/Component-Library/Item-Displayer.md`

## Use the context
- Prefer API-first implementations: keep logic in `scripts/api/*`; macros/rollMessage should be thin callers.
- Treat docs as potentially stale; verify against current code (`scripts/api`, `hooks`, `styles`, `module.json`) and call out mismatches.
- For dialogs, use the `openDialogV2` helper in `scripts/api/_util.js` and avoid `DialogV2.wait()` unless the docs explicitly permit it.
- For actor updates, follow canonical actor resolution and mirroring patterns from the docs.

## Output convention
At the start of a task, produce a concise "Context Brief" (5-10 bullets) that captures:
- runtime/version assumptions
- relevant API files and entrypoints
- known patterns or pitfalls that affect the task
- any stale or uncertain areas to verify
Keep it short unless the user asks for a full synthesis.

## Key paths (repo-relative)
- `module.json`
- `scripts/main.js`
- `scripts/api/_util.js`
- `docs-internal/current_state.md`
- `docs-internal/review-notes.md`
- `docs-internal/known_good_patterns.md`
- `docs-internal/folder-tree.md`
- `docs-internal/templateJSONS/`
- `styles/sinlesscsb-ui-global.css`
- `macros/`
