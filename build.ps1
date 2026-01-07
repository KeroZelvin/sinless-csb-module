param (
  [string]$OutDir = "dist",
  [string]$ModuleName = "sinlesscsb"
)

$ErrorActionPreference = "Stop"

$root = Get-Location
$stage = Join-Path $root "$OutDir\$ModuleName"
$zipPath = Join-Path $root "$OutDir\$ModuleName.zip"

Write-Host "Building $ModuleName module..."

# Clean
Remove-Item -Recurse -Force $OutDir -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $stage | Out-Null

# Copy runtime files
Copy-Item "module.json" $stage
Copy-Item "scripts" (Join-Path $stage "scripts") -Recurse
Copy-Item "packs"   (Join-Path $stage "packs")   -Recurse
Copy-Item "csb"    (Join-Path $stage "csb")    -Recurse
Copy-Item "styles"(Join-Path $stage "styles") -Recurse

# Remove transient files
Get-ChildItem -Path (Join-Path $stage "packs") -Recurse -Filter "LOCK" -ErrorAction SilentlyContinue |
  Remove-Item -Force -ErrorAction SilentlyContinue

# Zip
Compress-Archive -Path (Join-Path $stage "*") -DestinationPath $zipPath

Write-Host "Build complete:"
Write-Host " - $zipPath"
