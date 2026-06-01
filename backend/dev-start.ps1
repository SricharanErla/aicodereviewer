# dev-start.ps1
# Kills any process listening on configured PORT (if any) and starts the backend dev server in a detached process.
# Usage: Run from repository root with PowerShell: ./backend/dev-start.ps1

$port = $env:PORT -as [int]
if (-not $port) { $port = 5000 }

Write-Host "Using PORT=$port"

# Find processes listening on the port
$lines = netstat -ano | Select-String ":$port"
if ($lines) {
  foreach ($l in $lines) {
    $parts = $l -split '\s+' | Where-Object { $_ -ne '' }
    $pid = $parts[-1]
    try {
      Write-Host "Killing process PID=$pid listening on port $port"
      Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    } catch {
      Write-Warning "Failed to kill PID $pid"
    }
  }
} else {
  Write-Host "No process found listening on port $port"
}

# Start the dev server detached
Write-Host "Starting backend dev server (nodemon) in background..."
Start-Process -FilePath npm -ArgumentList 'run','dev' -WorkingDirectory (Split-Path -Parent $MyInvocation.MyCommand.Definition) -NoNewWindow
Write-Host "Started. Use 'netstat -ano | Select-String ":$port"' to verify or check nodemon output in spawned process."