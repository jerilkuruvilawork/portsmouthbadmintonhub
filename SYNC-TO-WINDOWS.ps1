# Run in PowerShell to refresh C:\Side\portsmouthbadmintonhub from GitHub
# Usage:  powershell -ExecutionPolicy Bypass -File SYNC-TO-WINDOWS.ps1

$Target = "C:\Side\portsmouthbadmintonhub"
$Temp = Join-Path $env:TEMP "portsmouthbadmintonhub-dl"
$Zip = Join-Path $env:TEMP "portsmouthbadmintonhub-main.zip"
$Url = "https://github.com/jerilkuruvilawork/pompeysmashers/archive/refs/heads/main.zip"

Write-Host "Downloading latest from GitHub..."
Invoke-WebRequest -Uri $Url -OutFile $Zip -UseBasicParsing

if (Test-Path $Temp) { Remove-Item $Temp -Recurse -Force }
Expand-Archive -Path $Zip -DestinationPath $Temp -Force

$Source = Join-Path $Temp "pompeysmashers-main\portsmouthbadmintonhub"
if (-not (Test-Path $Source)) {
  Write-Error "Expected folder not found in zip: $Source"
  exit 1
}

New-Item -ItemType Directory -Force -Path $Target | Out-Null
Write-Host "Copying to $Target ..."
robocopy $Source $Target /E /XD node_modules dist .git /NFL /NDL /NJH /NJS /nc /ns /np
if ($LASTEXITCODE -ge 8) { exit $LASTEXITCODE }

Write-Host "Done. Next:"
Write-Host "  cd $Target"
Write-Host "  npm install"
Write-Host "  npm run dev"
