param(
  [string]$ProjectRoot = "C:\Users\User\Documents\Playground\fishing-assistant-prototype"
)

$ErrorActionPreference = "Stop"
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$logDir = Join-Path $ProjectRoot "logs"
$logPath = Join-Path $logDir "fishbase-sync-$timestamp.log"

if (!(Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }

Push-Location $ProjectRoot
try {
  "[$(Get-Date -Format s)] FishBase nightly sync started" | Tee-Object -FilePath $logPath
  node tools/fishbase-sync.mjs 2>&1 | Tee-Object -FilePath $logPath -Append
  "[$(Get-Date -Format s)] FishBase nightly sync done" | Tee-Object -FilePath $logPath -Append
} finally {
  Pop-Location
}
