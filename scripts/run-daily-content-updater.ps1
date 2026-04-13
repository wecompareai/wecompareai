param(
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$PSNativeCommandUseErrorActionPreference = $false

$RepoRoot = Split-Path -Parent $PSScriptRoot
$NodeCandidates = @()

$NodeFromPath = Get-Command node -ErrorAction SilentlyContinue
if ($NodeFromPath) {
  $NodeCandidates += $NodeFromPath.Source
}

$NodeCandidates += @(
  "C:\Program Files\nodejs\node.exe",
  "C:\Program Files (x86)\nodejs\node.exe",
  (Join-Path $env:LOCALAPPDATA "Programs\nodejs\node.exe")
)

$NodeExe = $NodeCandidates | Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1
if (-not $NodeExe) {
  throw "Node.js was not found. Install Node.js or add it to PATH."
}

$TsxCli     = Join-Path $RepoRoot "node_modules\tsx\dist\cli.mjs"
$AgentScript = Join-Path $RepoRoot "scripts\daily-content-updater.ts"

if (-not (Test-Path $TsxCli))     { throw "tsx CLI not found at $TsxCli. Run npm install first." }
if (-not (Test-Path $AgentScript)) { throw "Agent script not found at $AgentScript." }

$LogDir = Join-Path $RepoRoot "logs"
if (-not (Test-Path $LogDir)) { New-Item -ItemType Directory -Path $LogDir | Out-Null }

$LogFile = Join-Path $LogDir "daily-content-updater.log"
$Args = @($TsxCli, $AgentScript)
if ($DryRun) { $Args += "--dry-run" }

$Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
"[$Timestamp] Starting daily content updater" | Tee-Object -FilePath $LogFile -Append

try {
  & $NodeExe @Args 2>&1 | Tee-Object -FilePath $LogFile -Append
  $ExitCode = $LASTEXITCODE
} catch {
  $_ | Out-String | Tee-Object -FilePath $LogFile -Append | Out-Null
  $ExitCode = if ($LASTEXITCODE) { $LASTEXITCODE } else { 1 }
} finally {
  $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  "[$Timestamp] Finished with exit code $ExitCode" | Tee-Object -FilePath $LogFile -Append
}

exit $ExitCode
