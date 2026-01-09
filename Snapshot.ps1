# --- Snapshot overview (best entrypoint for a new ChatGPT thread)
$overviewPath = Join-Path $stage "SNAPSHOT-OVERVIEW.md"

$overviewLines = New-Object System.Collections.Generic.List[string]
$overviewLines.Add('# Snapshot Overview (Start Here)')
$overviewLines.Add('')
$overviewLines.Add('This snapshot is a review bundle for ChatGPT and collaborators.')
$overviewLines.Add('It includes code + CSB templates + key project state docs, and excludes LevelDB compendium contents.')
$overviewLines.Add('')
$overviewLines.Add('## Read Order')
$overviewLines.Add('')
$overviewLines.Add('1. `docs-internal/current_state.md`')
$overviewLines.Add('2. `docs-internal/known_good_patterns.md`')
$overviewLines.Add('3. `docs-internal/compendium-index.md` (generated; lists pack contents by name/UUID)')
$overviewLines.Add('4. `packs-index.md` (pack declarations + folder diagnostics)')
$overviewLines.Add('5. `scripts/` and `csb/`')
$overviewLines.Add('')

if ($missingDocs.Count -gt 0) {
  $overviewLines.Add('## Warnings')
  $overviewLines.Add('')
  $overviewLines.Add('**Missing required docs at snapshot time:**')
  foreach ($m in $missingDocs) { $overviewLines.Add("- $m") }
  $overviewLines.Add('')
  $overviewLines.Add('See `MISSING-REQUIRED-DOCS.md` for remediation.')
  $overviewLines.Add('')
}

$overviewLines.Add('## Notes')
$overviewLines.Add('')
$overviewLines.Add('- To keep snapshots small, `packs/**` is excluded. Maintain `docs-internal/compendium-index.md` via the Foundry export macro.')
$overviewLines.Add('- Snapshot outputs are written to `dist-snapshot/` so they do not overwrite your release build outputs (typically `dist/`).')
$overviewLines.Add('')

Write-Utf8 $overviewPath $overviewLines
