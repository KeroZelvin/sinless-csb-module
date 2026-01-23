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
3) Note the template JSON location for Foundry exports: `docs-internal/templateJSONS/`.
4) If the task is CSB-specific and internet access is allowed, consult the CSB wiki:
   `https://gitlab.com/custom-system-builder/custom-system-builder/-/wikis/stable/en/Home`

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
- `docs-internal/templateJSONS/`
- `styles/sinlesscsb-ui-global.css`
- `macros/`
