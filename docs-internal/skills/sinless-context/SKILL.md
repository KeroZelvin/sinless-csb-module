---
name: sinless-context
description: Use only for Sinless rules/lore review from local PDFs (core rules, quickstart, tools). Trigger when the user asks to interpret/implement rules or locate rule text.
---

# Sinless Rules Context

## Overview
Use this skill to map natural-language Sinless rules questions to the correct local PDF and extract the specific pages or sections requested.

## Workflow
1) Identify the target PDF using `references/sinless-pdf-catalog.md` (tags, common asks, and absolute paths).
2) Locate the requested section with `scripts/pdf_search.py` or direct page extraction with pypdf.
3) Extract only the relevant pages or paragraphs; summarize in your own words; quote short passages only when asked.
4) If the request is ambiguous, ask one focused follow-up (doc? section? rule name? page?).

## Notes
- Use the absolute paths from the catalog; do not ask the user to paste paths.
- Some PDFs are image-based (sheets or cards). Expect little or no text extraction; describe them as forms or art assets and ask for a specific page or screenshot if needed.
- When a user says "core rules" or "CRB", default to `Sinless.pdf` unless they specify otherwise.
- When a user provides page numbers, extract exactly those pages.

## Resources
- `references/sinless-pdf-catalog.md`
- `scripts/pdf_search.py`

