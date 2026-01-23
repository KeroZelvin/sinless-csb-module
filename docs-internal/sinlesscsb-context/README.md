# SinlessCSB Context Skill (local)

This folder stores the `sinlesscsb-context` Codex skill in-repo so it can be tracked
without shipping in official module releases.

## Files
- `SKILL.md`: the skill instructions read by Codex.

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
