[CmdletBinding()]
param(
  [string]$RepoRoot,
  [string]$DownloadsPath,
  [string]$TemplateJsonPath,
  [string]$SummaryPath,
  [double]$LookbackDays = 2,
  [switch]$Apply,
  [switch]$RecurseDownloads
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Resolve-RootPath {
  param([string]$Hint)
  if ($Hint) {
    return (Resolve-Path -LiteralPath $Hint).Path
  }

  $defaultRoot = Join-Path $PSScriptRoot "..\..\..\.."
  return (Resolve-Path -LiteralPath $defaultRoot).Path
}

function Resolve-DownloadsPath {
  param([string]$Hint)
  if ($Hint) {
    return (Resolve-Path -LiteralPath $Hint).Path
  }

  $fromUserProfile = Join-Path $env:USERPROFILE "Downloads"
  if (Test-Path -LiteralPath $fromUserProfile -PathType Container) {
    return (Resolve-Path -LiteralPath $fromUserProfile).Path
  }

  throw "Downloads folder not found. Pass -DownloadsPath explicitly."
}

function Get-RelativeRepoPath {
  param(
    [string]$Root,
    [string]$FullPath
  )

  $rootNormalized = $Root
  if (-not $rootNormalized.EndsWith("\")) {
    $rootNormalized = "$rootNormalized\"
  }

  $rootUri = [System.Uri]$rootNormalized
  $fullUri = [System.Uri]$FullPath
  $relativeUri = $rootUri.MakeRelativeUri($fullUri)

  return [System.Uri]::UnescapeDataString($relativeUri.ToString()).Replace("\", "/")
}

function Get-MaxTime {
  param(
    [datetime]$A,
    [datetime]$B
  )
  if ($A -gt $B) { return $A }
  return $B
}

function Get-ZoneIdentifierInfo {
  param([string]$Path)

  try {
    $streamLines = @(Get-Content -LiteralPath $Path -Stream "Zone.Identifier" -ErrorAction Stop)
    if ($streamLines.Count -eq 0) {
      return [pscustomobject]@{
        present = $false
        zoneId = $null
        referrerUrl = $null
        hostUrl = $null
      }
    }

    $kv = @{}
    foreach ($line in $streamLines) {
      if ($line -match "^\s*([^=]+?)\s*=\s*(.*)\s*$") {
        $kv[$Matches[1].Trim()] = $Matches[2].Trim()
      }
    }

    return [pscustomobject]@{
      present = $true
      zoneId = if ($kv.ContainsKey("ZoneId")) { $kv["ZoneId"] } else { $null }
      referrerUrl = if ($kv.ContainsKey("ReferrerUrl")) { $kv["ReferrerUrl"] } else { $null }
      hostUrl = if ($kv.ContainsKey("HostUrl")) { $kv["HostUrl"] } else { $null }
    }
  } catch {
    return [pscustomobject]@{
      present = $false
      zoneId = $null
      referrerUrl = $null
      hostUrl = $null
    }
  }
}

function Test-IsLikelyFoundryExport {
  param([System.IO.FileInfo]$File)

  if ($File.Name -like "fvtt-*.json") { return $true }

  try {
    $json = (Get-Content -LiteralPath $File.FullName -Raw | ConvertFrom-Json -ErrorAction Stop)
  } catch {
    return $false
  }

  $props = @($json.PSObject.Properties.Name)
  $hasSystem = $props -contains "system"
  $hasName = $props -contains "name"
  $hasType = $props -contains "type"
  $hasFlags = $props -contains "flags"

  if ($hasSystem -and $hasName) { return $true }
  if ($hasSystem -and $hasType) { return $true }
  if ($hasFlags -and $hasName -and $hasType) { return $true }

  return $false
}

$repoRootPath = Resolve-RootPath -Hint $RepoRoot
$downloadsRoot = Resolve-DownloadsPath -Hint $DownloadsPath

if ($TemplateJsonPath) {
  $templateRoot = (Resolve-Path -LiteralPath $TemplateJsonPath).Path
} else {
  $templateRoot = Join-Path $repoRootPath "docs-internal/templateJSONS"
}

if ($SummaryPath) {
  if ([System.IO.Path]::IsPathRooted($SummaryPath)) {
    $summaryFile = $SummaryPath
  } else {
    $summaryFile = Join-Path $repoRootPath $SummaryPath
  }
} else {
  $summaryFile = Join-Path $repoRootPath "docs-internal/temp/export-sync-last-run.md"
}

if (-not (Test-Path -LiteralPath $templateRoot -PathType Container)) {
  throw "Template JSON directory not found: $templateRoot"
}

$lookback = [Math]::Abs([double]$LookbackDays)
$cutoff = (Get-Date).AddDays(-$lookback)

$scanArgs = @{
  LiteralPath = $downloadsRoot
  File = $true
  Filter = "*.json"
}
if ($RecurseDownloads.IsPresent) {
  $scanArgs["Recurse"] = $true
}

$allJson = @(Get-ChildItem @scanArgs)
$recentJson = @()
foreach ($f in $allJson) {
  $observed = Get-MaxTime -A $f.CreationTime -B $f.LastWriteTime
  if ($observed -lt $cutoff) { continue }
  $recentJson += [pscustomobject]@{
    file = $f
    observedTime = $observed
    sourceKind = "json"
  }
}

$scanMarkdownArgs = @{
  LiteralPath = $downloadsRoot
  File = $true
  Filter = "compendium-index.md"
}
if ($RecurseDownloads.IsPresent) {
  $scanMarkdownArgs["Recurse"] = $true
}

$allMarkdown = @(Get-ChildItem @scanMarkdownArgs)
$recentMarkdown = @()
foreach ($f in $allMarkdown) {
  $observed = Get-MaxTime -A $f.CreationTime -B $f.LastWriteTime
  if ($observed -lt $cutoff) { continue }
  $recentMarkdown += [pscustomobject]@{
    file = $f
    observedTime = $observed
    sourceKind = "compendium_index_markdown"
  }
}

$recentCandidates = @($recentJson + $recentMarkdown)

$entries = New-Object System.Collections.Generic.List[object]
$copied = New-Object System.Collections.Generic.List[string]
$pending = New-Object System.Collections.Generic.List[string]

foreach ($r in $recentCandidates) {
  $f = $r.file
  $isJsonCandidate = $r.sourceKind -eq "json"
  if ($isJsonCandidate -and -not (Test-IsLikelyFoundryExport -File $f)) { continue }

  $sourceHash = (Get-FileHash -LiteralPath $f.FullName -Algorithm SHA256).Hash
  $zone = Get-ZoneIdentifierInfo -Path $f.FullName

  $targetPath = if ($isJsonCandidate) {
    Join-Path $templateRoot $f.Name
  } else {
    Join-Path $repoRootPath "docs-internal/compendium-index.md"
  }
  $targetExists = Test-Path -LiteralPath $targetPath -PathType Leaf
  $targetItem = $null
  $targetHash = $null
  if ($targetExists) {
    $targetItem = Get-Item -LiteralPath $targetPath
    $targetHash = (Get-FileHash -LiteralPath $targetPath -Algorithm SHA256).Hash
  }

  $statusBefore = if (-not $targetExists) {
    "missing_in_repo"
  } elseif ($sourceHash -eq $targetHash) {
    "already_synced"
  } elseif ($r.observedTime -gt $targetItem.LastWriteTime) {
    "newer_download"
  } else {
    "different_content_download_not_newer"
  }

  $action = "none"
  $reason = "up_to_date"

  if ($Apply.IsPresent) {
    $shouldCopy = $false
    if (-not $targetExists) {
      $shouldCopy = $true
      $reason = "missing_in_repo"
    } elseif ($sourceHash -ne $targetHash -and $r.observedTime -ge $targetItem.LastWriteTime) {
      $shouldCopy = $true
      $reason = "download_is_newer_or_same_time"
    } elseif ($sourceHash -ne $targetHash) {
      $reason = "download_older_than_repo"
    }

    if ($shouldCopy) {
      Copy-Item -LiteralPath $f.FullName -Destination $targetPath -Force
      $action = "copied_to_repo"
      $copied.Add($f.Name) | Out-Null
    } elseif ($statusBefore -ne "already_synced") {
      $pending.Add($f.Name) | Out-Null
    }
  } elseif ($statusBefore -ne "already_synced") {
    $pending.Add($f.Name) | Out-Null
  }

  $targetRelative = Get-RelativeRepoPath -Root $repoRootPath -FullPath $targetPath

  $entries.Add([pscustomobject]@{
    sourceKind = $r.sourceKind
    fileName = $f.Name
    downloadPath = $f.FullName
    observedTime = $r.observedTime.ToString("o")
    creationTime = $f.CreationTime.ToString("o")
    lastWriteTime = $f.LastWriteTime.ToString("o")
    zoneIdentifierPresent = [bool]$zone.present
    zoneId = $zone.zoneId
    referrerUrl = $zone.referrerUrl
    hostUrl = $zone.hostUrl
    repoPath = $targetPath
    repoRelative = $targetRelative
    repoExists = [bool]$targetExists
    repoLastWriteTime = if ($targetItem) { $targetItem.LastWriteTime.ToString("o") } else { $null }
    statusBefore = $statusBefore
    action = $action
    reason = $reason
  }) | Out-Null
}

$copiedArray = @($copied | ForEach-Object { [string]$_ })
$pendingArray = @($pending | ForEach-Object { [string]$_ })
$pendingUnique = @($pendingArray | Sort-Object -Unique)
$matchedJsonExports = @($entries | Where-Object { $_.sourceKind -eq "json" }).Count
$matchedMarkdownExports = @($entries | Where-Object { $_.sourceKind -eq "compendium_index_markdown" }).Count

$result = [ordered]@{}
$result.repoRoot = $repoRootPath
$result.downloadsPath = $downloadsRoot
$result.templateJsonPath = $templateRoot
$result.compendiumIndexPath = (Join-Path $repoRootPath "docs-internal/compendium-index.md")
$result.lookbackDays = $lookback
$result.cutoffIso = $cutoff.ToString("o")
$result.apply = [bool]$Apply.IsPresent
$result.scannedJsonFiles = $allJson.Count
$result.recentJsonFiles = $recentJson.Count
$result.scannedMarkdownFiles = $allMarkdown.Count
$result.recentMarkdownFiles = $recentMarkdown.Count
$result.matchedJsonExports = $matchedJsonExports
$result.matchedMarkdownExports = $matchedMarkdownExports
$result.foundryExportMatches = $entries.Count
$result.copiedCount = $copied.Count
$result.pendingCount = $pending.Count
$result.copied = $copiedArray
$result.pending = $pendingUnique
$result.entries = @($entries.ToArray())
$result.summaryFile = $summaryFile

$summaryDir = Split-Path -Parent $summaryFile
if ($summaryDir -and -not (Test-Path -LiteralPath $summaryDir -PathType Container)) {
  New-Item -ItemType Directory -Path $summaryDir -Force | Out-Null
}

$runIso = (Get-Date).ToString("o")
$summaryLine = "$runIso | apply=$([bool]$Apply.IsPresent) lookbackDays=$lookback scannedJson=$($allJson.Count) recentJson=$($recentJson.Count) scannedMd=$($allMarkdown.Count) recentMd=$($recentMarkdown.Count) matches=$($entries.Count) copied=$($copied.Count) pending=$($pendingUnique.Count)"
Set-Content -LiteralPath $summaryFile -Value $summaryLine -Encoding utf8
$result.summaryLine = $summaryLine

$result | ConvertTo-Json -Depth 8
