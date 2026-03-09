param(
  [string]$ProjectRoot = "C:\Users\User\Documents\Playground\fishing-assistant-prototype",
  [string]$TaskName = "Santiago-FishBase-Nightly",
  [string]$AtTime = "02:30"
)

$scriptPath = Join-Path $ProjectRoot "tools\run-fishbase-nightly.ps1"
if (!(Test-Path $scriptPath)) {
  throw "Missing script: $scriptPath"
}

$action = "powershell.exe -NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`" -ProjectRoot `"$ProjectRoot`""
schtasks /Create /F /SC DAILY /ST $AtTime /TN $TaskName /TR $action | Out-Host
Write-Host "Task '$TaskName' created. Runs daily at $AtTime"
