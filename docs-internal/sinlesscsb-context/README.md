# SinlessCSB Context Skill (local)

This folder stores the `sinlesscsb-context` Codex skill in-repo so it can be tracked
without shipping in official module releases.

## Files
- `SKILL.md`: the skill instructions read by Codex.
- `../skills/sinlesscsb-context/scripts/sync-recent-foundry-exports.ps1`: sync recent Foundry JSON exports from Downloads into `docs-internal/templateJSONS`.
- `../skills/sinlesscsb-context/scripts/select-latest-folder-tree.ps1`: pick the newest folder-tree snapshot and prune tracked older ones.
- `../temp/export-sync-last-run.md`: one-line status summary written on each export-sync run.

## Install / update in Codex
Copy this folder into your Codex skills directory and restart Codex:

```powershell
Copy-Item -Recurse -Force d:\Git\sinlesscsb\docs-internal\sinlesscsb-context C:\Users\mytha\.codex\skills\sinlesscsb-context
```

## Package to a .skill file (optional)
If you need a distributable `.skill` file:

```powershell
python C:\Users\mytha\.codex\skills\.system\skill-creator\scripts\package_skill.py d:\Git\sinlesscsb\docs-internal\sinlesscsb-context d:\Git\sinlesscsb
```

This produces: `d:\Git\sinlesscsb\sinlesscsb-context.skill`

## Optional workspace auto-check on open (VS Code)
This repo includes `.vscode/tasks.json` with a `runOn: folderOpen` task that runs:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File ${workspaceFolder}/docs-internal/skills/sinlesscsb-context/scripts/sync-recent-foundry-exports.ps1 -LookbackDays 2 -Apply
```

VS Code may prompt once to allow automatic tasks for this workspace.
