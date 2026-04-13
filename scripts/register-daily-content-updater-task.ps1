param(
  [string]$TaskName  = "AICompareContentUpdater",
  [string]$StartTime = "00:00"
)

$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent $PSScriptRoot
$Runner   = Join-Path $RepoRoot "scripts\run-daily-content-updater.ps1"

if (-not (Test-Path $Runner)) {
  throw "Runner script not found at $Runner."
}

$PowerShellExe   = Join-Path $PSHOME "powershell.exe"
$ParsedStartTime = [DateTime]::ParseExact($StartTime, "HH:mm", $null)
$StartBoundary   = (Get-Date).Date.AddHours($ParsedStartTime.Hour).AddMinutes($ParsedStartTime.Minute)
$CommandXml      = [System.Security.SecurityElement]::Escape($PowerShellExe)
$ArgumentsXml    = [System.Security.SecurityElement]::Escape("-NoProfile -ExecutionPolicy Bypass -File `"$Runner`"")
$TaskXmlPath     = Join-Path $env:TEMP "$TaskName.xml"

$TaskXml = @"
<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.4" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo>
    <Description>Reviews and updates AI Compare content pages nightly using Claude AI.</Description>
  </RegistrationInfo>
  <Triggers>
    <CalendarTrigger>
      <StartBoundary>$($StartBoundary.ToString("yyyy-MM-dd'T'HH:mm:ss"))</StartBoundary>
      <Enabled>true</Enabled>
      <ScheduleByDay>
        <DaysInterval>1</DaysInterval>
      </ScheduleByDay>
    </CalendarTrigger>
  </Triggers>
  <Principals>
    <Principal id="Author">
      <RunLevel>LeastPrivilege</RunLevel>
      <LogonType>InteractiveToken</LogonType>
    </Principal>
  </Principals>
  <Settings>
    <MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy>
    <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>
    <StopIfGoingOnBatteries>false</StopIfGoingOnBatteries>
    <AllowHardTerminate>true</AllowHardTerminate>
    <StartWhenAvailable>true</StartWhenAvailable>
    <RunOnlyIfNetworkAvailable>true</RunOnlyIfNetworkAvailable>
    <IdleSettings>
      <StopOnIdleEnd>false</StopOnIdleEnd>
      <RestartOnIdle>false</RestartOnIdle>
    </IdleSettings>
    <AllowStartOnDemand>true</AllowStartOnDemand>
    <Enabled>true</Enabled>
    <Hidden>false</Hidden>
    <RunOnlyIfIdle>false</RunOnlyIfIdle>
    <WakeToRun>false</WakeToRun>
    <ExecutionTimeLimit>PT30M</ExecutionTimeLimit>
    <Priority>7</Priority>
  </Settings>
  <Actions Context="Author">
    <Exec>
      <Command>$CommandXml</Command>
      <Arguments>$ArgumentsXml</Arguments>
    </Exec>
  </Actions>
</Task>
"@

try {
  Set-Content -Path $TaskXmlPath -Value $TaskXml -Encoding Unicode
  & schtasks.exe /Create /TN $TaskName /XML $TaskXmlPath /F | Out-Null

  if ($LASTEXITCODE -ne 0) {
    throw "schtasks.exe failed with exit code $LASTEXITCODE."
  }
} finally {
  if (Test-Path $TaskXmlPath) {
    Remove-Item -LiteralPath $TaskXmlPath -Force
  }
}

Write-Host "Registered scheduled task '$TaskName' to run daily at $StartTime using $Runner"
Write-Host "To test manually: powershell -File `"$Runner`" -DryRun"
