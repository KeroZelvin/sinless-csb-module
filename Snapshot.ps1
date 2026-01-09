param(
  # Keep snapshot outputs separate so you don't clobber release build outputs (e.g., dist/)
  [string]$OutDir = "dist-snapshot",

  # Snapshot bundle name (zip will be: dist-snapshot/<Name>.zip)
  [string]$Name = "sinlesscsb-snapshot",

  # If set, fail when required snapshot docs are missing (default: warn but continue)
  [switch]$Strict = $false,

  # Include a repo tree listing (can be disabled if it gets slow later)
  [switch]$IncludeTree = $true
)

$ErrorActionPreference = "Stop"

function New-DirIfMissing($path) {
  New-Item -ItemType Directory -Path $path -Force | Out-Null
}

function Write-Utf8($path, $lines) {
  Set-Content -Path $path -Value $lines -Encoding UTF8
}

function Copy-IfExists($relativePath, $destRoot) {
  $src = Join-Path (Get-Location) $relativePath
  if (Test-Path $src) {
    $dst = Join-Path $destRoot $relativePath
    New-DirIfMissing (Split-Path $dst -Parent)
    Copy-Item $src $dst -Recurse -Force
    return $true
  }
  return $false
}

function Get-GitInfo() {
  $git = @{
    available = $false
    branch = ""
    commit = ""
    tag = ""
    status = ""
  }

  try {
    $null = git --version 2>$null
    $git.available = $true
    try { $git.branch = (git rev-parse --abbrev-ref HEAD 2>$null).Trim() } catch {}
    try { $git.commit = (git rev-parse HEAD 2>$null).Trim() } catch {}
    try { $git.tag    = (git describe --tags --exact-match 2>$null).Trim() } catch {}
    try { $git.status = (git status --porcelain 2>$null | Out-String).Trim() } catch {}
  } catch {
    # Git not available; ignore
  }

  return $git
}

function Get-FolderStats($folderPath) {
  if (-not (Test-Path $folderPath)) {
    return @{
      exists = $false
      files = 0
      bytes = 0
      lastWrite = ""
    }
  }

  $items = Get-ChildItem -Path $folderPath -Recurse -File -Force -ErrorAction SilentlyContinue
  $bytes = 0
  foreach ($i in $items) { $bytes += $i.Length }

  $lastWrite = (Get-ChildItem -Path $folderPath -Recurse -Force -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1).LastWriteTime

  return @{
    exists = $true
    files = @($items).Count
    bytes = $bytes
    lastWrite = if ($lastWrite) { $lastWrite.ToString("s") } else { "" }
  }
}

function Format-Bytes($bytes) {
  if ($bytes -ge 1GB) { return "{0:N2} GB" -f ($bytes / 1GB) }
  if ($bytes -ge 1MB) { return "{0:N2} MB" -f ($bytes / 1MB) }
  if ($bytes -ge 1KB) { return "{0:N2} KB" -f ($bytes / 1KB) }
  return "$bytes B"
}

# --- Paths
$root = Get-Location
$stageRoot = Join-Path $root $OutDir
$stage = Join-Path $stageRoot $Name
$zipPath = Join-Path $stageRoot "$Name.zip"

Write-Host "Repo root:    $root"
Write-Host "Snapshot dir: $stage"
Write-Host "ZIP output:   $zipPath"

# Clean ONLY the snapshot output directory (prevents clobbering release build output dir)
if (Test-Path $stageRoot) {
  Remove-Item -Recurse -Force $stageRoot -ErrorAction SilentlyContinue
}
New-DirIfMissing $stage

# --- Copy core reviewable content (exclude packs LevelDB by design)
$included = @()

if (Copy-IfExists "module.json" $stage) { $included += "module.json" } else { $included += "module.json (MISSING!)" }
if (Copy-IfExists "scripts" $stage)     { $included += "scripts/**" }     else { $included += "scripts/** (MISSING!)" }
if (Copy-IfExists "csb" $stage)         { $included += "csb/**" }         else { $included += "csb/** (missing is OK if not exported yet)" }

if (Test-Path (Join-Path $root "styles")) {
  if (Copy-IfExists "styles" $stage) { $included += "styles/**" }
}

if (Test-Path (Join-Path $root "macros")) {
  Copy-IfExists "macros" $stage | Out-Null
  $included += "macros/** (if present)"
}

# docs-internal continuity files (note: known_good_patterns is lowercase)
$requiredDocs = @(
  "docs-internal\current_state.md",
  "docs-internal\known_good_patterns.md",
  "docs-internal\compendium-index.md"
)

$missingDocs = @()

foreach ($d in $requiredDocs) {
  $ok = Copy-IfExists $d $stage
  if ($ok) {
    $included += $d
  } else {
    $missingDocs += $d
    $included += "$d (MISSING!)"
  }
}

# --- If docs are missing, create a warning file inside the snapshot
if ($missingDocs.Count -gt 0) {
  $warnPath = Join-Path $stage "MISSING-REQUIRED-DOCS.md"
  $warn = @()
  $warn += "# Missing Required Snapshot Docs"
  $warn += ""
  $warn += "The following files were not found in the repo at snapshot time:"
  $warn += ""
  foreach ($m in $missingDocs) { $warn += "- $m" }
  $warn += ""
  $warn += "Recommended action:"
  $warn += "- Ensure these files exist in the repo before creating a snapshot."
  $warn += "- For compendium-index.md: run the Foundry export macro, then copy the downloaded file into docs-internal/."
  $warn += ""
  Write-Utf8 $warnPath $warn

  if ($Strict) {
    throw "Strict mode: missing required docs. See $warnPath"
  }
}

# --- Snapshot metadata
$git = Get-GitInfo
$metaPath = Join-Path $stage "SNAPSHOT-META.md"

$meta = @()
$meta += "# Snapshot Meta"
$meta += ""
$meta += "- Created: $(Get-Date -Format s)"
$meta += "- Repo Root: $root"
if ($git.available) {
  $meta += "- Git Branch: $($git.branch)"
  $meta += "- Git Commit: $($git.commit)"
  if ($git.tag) { $meta += "- Git Tag: $($git.tag)" }
  if ($git.status) { $meta += "- Working Tree: DIRTY (uncommitted changes present)" } else { $meta += "- Working Tree: CLEAN" }
} else {
  $meta += "- Git: not available"
}
$meta += ""
$meta += "## Included Content"
$meta += ""
foreach ($c in $included) { $meta += "- $c" }

Write-Utf8 $metaPath $meta

# --- Repo tree for orientation (optional)
if ($IncludeTree) {
  $treePath = Join-Path $stage "repo-tree.txt"
  try {
    cmd /c "tree /F" | Out-File -FilePath $treePath -Encoding utf8
  } catch {
    "tree command failed: $($_.Exception.Message)" | Out-File -FilePath $treePath -Encoding utf8
  }
}

# --- Packs index (declared + diagnostics), WITHOUT copying packs content
$pIndexPath = Join-Path $stage "packs-index.md"
$pIndex = @()
$pIndex += "# Packs Index (Snapshot excludes LevelDB contents)"
$pIndex += ""
$pIndex += "This snapshot deliberately excludes `packs/**` LevelDB content to keep the bundle small and review-focused."
$pIndex += "It includes pack declarations from `module.json` and lightweight diagnostics of pack folders on disk."
$pIndex += ""

# Parse module.json declared packs
$moduleJsonPath = Join-Path $root "module.json"
$declaredPacks = @()
if (Test-Path $moduleJsonPath) {
  try {
    $mj = Get-Content $moduleJsonPath -Raw | ConvertFrom-Json
    if ($mj.packs) { $declaredPacks = @($mj.packs) }
  } catch {
    $pIndex += "**Warning:** Could not parse module.json packs section:"
    $pIndex += ""
    $pIndex += "- $($_.Exception.Message)"
    $pIndex += ""
  }
} else {
  $pIndex += "**Warning:** module.json not found at repo root."
  $pIndex += ""
}

$pIndex += "## Declared Packs in module.json"
$pIndex += ""
if ($declaredPacks.Count -eq 0) {
  $pIndex += "_None declared._"
  $pIndex += ""
} else {
  foreach ($p in $declaredPacks) {
    $pIndex += "### $($p.label) (`$($p.name)`)"
    $pIndex += ""
    $pIndex += "- Type: $($p.type)"
    if ($p.system) { $pIndex += "- System: $($p.system)" }
    $pIndex += "- Path: $($p.path)"
    $pIndex += ""
  }
}

# On-disk pack folder diagnostics
$packsRoot = Join-Path $root "packs"
$pIndex += "## Pack Folders Present on Disk (diagnostics only)"
$pIndex += ""

if (-not (Test-Path $packsRoot)) {
  $pIndex += "_No `packs/` folder found in repo root._"
  $pIndex += ""
} else {
  $packFolders = Get-ChildItem -Path $packsRoot -Directory -Force -ErrorAction SilentlyContinue | Sort-Object Name
  if ($packFolders.Count -eq 0) {
    $pIndex += "_`packs/` exists but contains no subfolders._"
    $pIndex += ""
  } else {
    foreach ($pf in $packFolders) {
      $stats = Get-FolderStats $pf.FullName

      $hasCURRENT  = Test-Path (Join-Path $pf.FullName "CURRENT")
      $hasLOG      = Test-Path (Join-Path $pf.FullName "LOG")
      $hasLOGold   = Test-Path (Join-Path $pf.FullName "LOG.old")
      $hasLOCK     = Test-Path (Join-Path $pf.FullName "LOCK")
      $manifest    = Get-ChildItem -Path $pf.FullName -Filter "MANIFEST-*" -File -Force -ErrorAction SilentlyContinue |
        Sort-Object Name -Descending |
        Select-Object -First 1

      $pIndex += "### $($pf.Name)"
      $pIndex += ""
      $pIndex += "- Exists: $($stats.exists)"
      $pIndex += "- File Count: $($stats.files)"
      $pIndex += "- Total Size: $(Format-Bytes $stats.bytes)"
      if ($stats.lastWrite) { $pIndex += "- Last Modified: $($stats.lastWrite)" }
      $pIndex += "- CURRENT: $hasCURRENT"
      $pIndex += "- LOG: $hasLOG"
      $pIndex += "- LOG.old: $hasLOGold"
      $pIndex += "- LOCK (transient): $hasLOCK"
      $pIndex += "- Latest MANIFEST: $($manifest.Name)"
      $pIndex += ""
    }
  }
}

Write-Utf8 $pIndexPath $pIndex

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

# --- Create the zip (stage/* contents; no nested folder in zip)
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Compress-Archive -Path (Join-Path $stage "*") -DestinationPath $zipPath

Write-Host ""
Write-Host "Snapshot bundle created:"
Write-Host " - $zipPath"
Write-Host ""
Write-Host "Reminder: This snapshot excludes packs LevelDB content by design."
if ($missingDocs.Count -gt 0) {
  Write-Host "WARNING: Missing required docs (see snapshot warning files)."
}
