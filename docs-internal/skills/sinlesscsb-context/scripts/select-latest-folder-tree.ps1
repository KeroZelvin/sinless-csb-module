[CmdletBinding()]
param(
  [string]$RepoRoot,
  [string]$DocsInternalPath,
  [switch]$PruneTracked
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

function Parse-DateFromFileName {
  param([string]$Name)

  if ($Name -match "_(\d{4}-\d{2}-\d{2})\.md$") {
    return [datetime]::ParseExact(
      $Matches[1],
      "yyyy-MM-dd",
      [System.Globalization.CultureInfo]::InvariantCulture,
      [System.Globalization.DateTimeStyles]::None
    )
  }

  return [datetime]::MinValue
}

function Test-IsTracked {
  param(
    [string]$Root,
    [string]$RelativePath
  )

  & git -C $Root ls-files --error-unmatch -- $RelativePath *> $null
  return ($LASTEXITCODE -eq 0)
}

function Test-IsDirty {
  param(
    [string]$Root,
    [string]$RelativePath
  )

  $status = & git -C $Root status --porcelain -- $RelativePath
  return -not [string]::IsNullOrWhiteSpace(($status -join "`n"))
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

$repoRootPath = Resolve-RootPath -Hint $RepoRoot

if ($DocsInternalPath) {
  $docsPath = (Resolve-Path -LiteralPath $DocsInternalPath).Path
} else {
  $docsPath = Join-Path $repoRootPath "docs-internal"
}

if (-not (Test-Path -LiteralPath $docsPath -PathType Container)) {
  throw "docs-internal path not found: $docsPath"
}

$dated = @(Get-ChildItem -LiteralPath $docsPath -File -Filter "folder-tree_*.md" |
  ForEach-Object {
    [pscustomobject]@{
      File = $_
      ParsedDate = Parse-DateFromFileName -Name $_.Name
    }
  })

if (-not $dated -or $dated.Count -eq 0) {
  $legacyPath = Join-Path $docsPath "folder-tree.md"
  if (Test-Path -LiteralPath $legacyPath -PathType Leaf) {
    $legacyItem = Get-Item -LiteralPath $legacyPath
    $dated = @(
      [pscustomobject]@{
        File = $legacyItem
        ParsedDate = Parse-DateFromFileName -Name $legacyItem.Name
      }
    )
  } else {
    throw "No folder-tree markdown files found in $docsPath"
  }
}

$sorted = @($dated | Sort-Object `
  @{ Expression = { $_.ParsedDate }; Descending = $true }, `
  @{ Expression = { $_.File.LastWriteTimeUtc }; Descending = $true }, `
  @{ Expression = { $_.File.Name }; Descending = $false })

$latest = $sorted[0].File
$prunedTracked = New-Object System.Collections.Generic.List[string]
$skippedDirty = New-Object System.Collections.Generic.List[string]

if ($PruneTracked.IsPresent -and $sorted.Count -gt 1) {
  foreach ($entry in ($sorted | Select-Object -Skip 1)) {
    $candidate = $entry.File
    $relative = Get-RelativeRepoPath -Root $repoRootPath -FullPath $candidate.FullName

    if (-not (Test-IsTracked -Root $repoRootPath -RelativePath $relative)) {
      continue
    }

    if (Test-IsDirty -Root $repoRootPath -RelativePath $relative) {
      $skippedDirty.Add($relative) | Out-Null
      continue
    }

    Remove-Item -LiteralPath $candidate.FullName -Force
    $prunedTracked.Add($relative) | Out-Null
  }
}

$latestRelative = Get-RelativeRepoPath -Root $repoRootPath -FullPath $latest.FullName

$result = [ordered]@{
  repoRoot = $repoRootPath
  docsInternal = $docsPath
  latestFile = $latest.FullName
  latestRelative = $latestRelative
  allCandidates = @($sorted | ForEach-Object { $_.File.FullName })
  prunedTracked = @($prunedTracked)
  skippedDirty = @($skippedDirty)
}

$result | ConvertTo-Json -Depth 6
