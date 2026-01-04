Sinless CSB – Macro Registry

This document is the authoritative registry for all Foundry macros
tracked in this repository.

RULES:
- Foundry Macro Name must match EXACTLY (case + punctuation)
- JS files in /scripts are canonical sources
- JSON files in /macros are Foundry-generated export artifacts
- Do NOT rename Foundry macros without updating this file


====================
Sinless Item Roll
====================

Foundry Macro Name:
Sinless Item Roll
(do not rename without auditing callers)

Purpose:
Primary item-use resolution macro for the Sinless system.
Handles:
- SkillMeta lookup
- Dice pool construction
- Attribute + skill + situational modifiers
- Item-driven roll logic

Canonical Source (edit this):
scripts/sinless-item-roll.js

Foundry Export (do not hand-edit):
macros/sinless-item-roll.json

Called By:
- CSB item buttons
- Inline roll buttons using linkedEntity
- Other macros (future audit recommended)

Dependencies / Assumptions:
- SkillMeta_JSON injected at runtime
- Actor data conforms to CSB v5.x structure
- Pool max values are not recalculated automatically

Versioning Notes:
- Repo tracks logic version via JS header
- Foundry macro name is considered a runtime contract


====================
Sinless Pool Roll
====================

Foundry Macro Name:
Sinless Pool Roll
(verify exact spelling in Foundry)

Purpose:
Generic dice pool roller for Sinless tests not tied to an item.
Used for:
- Attribute-only rolls
- Pool-based actions
- Ad-hoc GM tests

Canonical Source (edit this):
scripts/sinless-pool-roll.js

Foundry Export (do not hand-edit):
macros/sinless-pool-roll.json

Called By:
- Character sheet buttons
- GM macros
- Ad-hoc chat commands

Dependencies / Assumptions:
- Actor pool current/max values are maintained separately
- Zero-dice edge cases handled explicitly

Versioning Notes:
- Intended to share helper logic with Item Roll in future refactor


====================
Conventions
====================

- Never call macros by filename — only by Foundry name or UUID
- Never hand-edit JSON exports
- If a macro starts calling another macro:
  - Document it under “Called By”
  - Prefer UUID-based execution


====================
Future Work
====================

- Migrate macro calls to UUID-based resolution
- Consolidate shared helper functions
- Convert macros into module auto-registration
