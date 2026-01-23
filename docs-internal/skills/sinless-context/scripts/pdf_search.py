#!/usr/bin/env python
"""Search text inside Sinless PDFs.

Examples:
  python scripts/pdf_search.py --list
  python scripts/pdf_search.py --id core --query "combat" --max-hits 5
  python scripts/pdf_search.py --id quickstart --query "sector phase" --pages 1-10
  python scripts/pdf_search.py --path "C:\\path\\to\\file.pdf" --query "magic"
"""

import argparse
import re
import sys
from pathlib import Path

# Force UTF-8 output on Windows terminals
try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

try:
    from pypdf import PdfReader
except Exception as exc:
    print("Missing dependency: pypdf. Install with: python -m pip install --user pypdf")
    raise

LIBRARY = {
    "core": r"C:\Users\mytha\OneDrive\Sinless\Sinless.pdf",
    "quickstart": r"C:\Users\mytha\OneDrive\Sinless\Sinless_Quickstart.pdf",
    "character-sheet": r"C:\Users\mytha\OneDrive\Sinless\SINLESS-Character-Sheet-High-Res.pdf",
    "character-worksheet": r"C:\Users\mytha\OneDrive\Sinless\Sinless_Character_Worksheet_v2.pdf",
    "bounty": r"C:\Users\mytha\OneDrive\Sinless\BilionaireBountyDigital.pdf",
    "asset-pack-1": r"C:\Users\mytha\OneDrive\Sinless\Asset Pack 1.pdf",
    "asset-pack-2": r"C:\Users\mytha\OneDrive\Sinless\Asset Pack 2.pdf",
    "gear-tarot": r"C:\Users\mytha\OneDrive\Sinless\gear tarot cards.pdf",
    "brand-record": r"C:\Users\mytha\OneDrive\Sinless\brandrecord.pdf",
    "sector-tracker": r"C:\Users\mytha\OneDrive\Sinless\sectortracker(blan)k.pdf",
}

ALIASES = {
    "crb": "core",
    "rulebook": "core",
    "core": "core",
    "quick": "quickstart",
    "qs": "quickstart",
    "quickstart": "quickstart",
    "billionaire": "bounty",
    "bounty": "bounty",
    "bb": "bounty",
    "sheet": "character-sheet",
    "worksheet": "character-worksheet",
    "brand": "brand-record",
    "sector": "sector-tracker",
    "assets1": "asset-pack-1",
    "assets2": "asset-pack-2",
    "gear": "gear-tarot",
}


def parse_pages(pages_str, total_pages):
    if not pages_str:
        return list(range(total_pages))
    pages = set()
    for part in pages_str.split(','):
        part = part.strip()
        if not part:
            continue
        if '-' in part:
            start_s, end_s = part.split('-', 1)
            start = int(start_s)
            end = int(end_s)
            for p in range(start, end + 1):
                pages.add(p - 1)
        else:
            pages.add(int(part) - 1)
    return [p for p in sorted(pages) if 0 <= p < total_pages]


def normalize_ws(s):
    return re.sub(r"\s+", " ", s).strip()


def main():
    parser = argparse.ArgumentParser(description="Search text inside a PDF or the Sinless PDF library")
    parser.add_argument("--list", action="store_true", help="List library keys and paths")
    parser.add_argument("--id", help="Library key (use --list)")
    parser.add_argument("--alias", help="Alias such as crb, quickstart, bounty")
    parser.add_argument("--path", help="Explicit PDF path")
    parser.add_argument("--query", action="append", help="Search query (can be repeated)")
    parser.add_argument("--pages", help="Page range like 1-5,10,12-14 (1-based)")
    parser.add_argument("--max-hits", type=int, default=8, help="Stop after this many hits")
    parser.add_argument("--context", type=int, default=90, help="Characters of context on each side")
    args = parser.parse_args()

    if args.list:
        for key, path in LIBRARY.items():
            print(f"{key}: {path}")
        return 0

    path = None
    if args.path:
        path = args.path
    elif args.id:
        path = LIBRARY.get(args.id)
    elif args.alias:
        resolved = ALIASES.get(args.alias.lower())
        if resolved:
            path = LIBRARY.get(resolved)

    if not path:
        print("Provide --path, --id, or --alias. Use --list to see library keys.")
        return 2

    pdf_path = Path(path)
    if not pdf_path.exists():
        print(f"File not found: {pdf_path}")
        return 2

    reader = PdfReader(str(pdf_path))
    total_pages = len(reader.pages)
    print(f"File: {pdf_path}")
    print(f"Pages: {total_pages}")

    if not args.query:
        return 0

    queries = [q.lower() for q in args.query]
    page_indices = parse_pages(args.pages, total_pages)

    hits = 0
    for i in page_indices:
        text = reader.pages[i].extract_text() or ""
        if not text:
            continue
        low = text.lower()
        for q in queries:
            pos = low.find(q)
            if pos == -1:
                continue
            start = max(0, pos - args.context)
            end = min(len(text), pos + len(q) + args.context)
            snippet = normalize_ws(text[start:end])
            snippet = snippet.encode("utf-8", "replace").decode("utf-8")
            print(f"Page {i+1} | {q} | {snippet}")
            hits += 1
            if hits >= args.max_hits:
                return 0

    if hits == 0:
        print("No hits found. Try a shorter query, a different term, or limit pages.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
