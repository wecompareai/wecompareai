param(
  [string]$TaskName = "AICompareDailyBlogAgent",
  [string]$StartTime = "00:00",
  [int]$EveryMinutes = 60
)

$ErrorActionPreference = "Stop"

if ($EveryMinutes -lt 1) {
  throw "EveryMinutes must be 1 or greater."
}

$RepoRoot = Split-Path -Parent $PSScriptRoot
$Runner = Join-Path $RepoRoot "scripts\run-daily-blog-agent.ps1"

if (-not (Test-Path $Runner)) {
  throw "Runner script not found at $Runner."
}

$PowerShellExe = Join-Path $PSHOME "powershell.exe"
$ParsedStartTime = [DateTime]::ParseExact($StartTime, "HH:mm", $null)
$StartBoundary = (Get-Date).Date.AddHours($ParsedStartTime.Hour).AddMinutes($ParsedStartTime.Minute)
$CommandXml = [System.Security.SecurityElement]::Escape($PowerShellExe)
$ArgumentsXml = [System.Security.SecurityElement]::Escape("-NoProfile -ExecutionPolicy Bypass -File `"$Runner`"")
$TaskXmlPath = Join-Path $env:TEMP "$TaskName.xml"
$TaskXml = @"
<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.4" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo>
    <Description>Publishes AI Compare blog articles on a repeating schedule.</Description>
  </RegistrationInfo>
  <Triggers>
    <CalendarTrigger>
      <StartBoundary>$($StartBoundary.ToString("yyyy-MM-dd'T'HH:mm:ss"))</StartBoundary>
      <Enabled>true</Enabled>
      <ScheduleByDay>
        <DaysInterval>1</DaysInterval>
      </ScheduleByDay>
      <Repetition>
        <Interval>PT$($EveryMinutes)M</Interval>
        <Duration>P1D</Duration>
        <StopAtDurationEnd>false</StopAtDurationEnd>
      </Repetition>
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
    <RunOnlyIfNetworkAvailable>false</RunOnlyIfNetworkAvailable>
    <IdleSettings>
      <StopOnIdleEnd>false</StopOnIdleEnd>
      <RestartOnIdle>false</RestartOnIdle>
    </IdleSettings>
    <AllowStartOnDemand>true</AllowStartOnDemand>
    <Enabled>true</Enabled>
    <Hidden>false</Hidden>
    <RunOnlyIfIdle>false</RunOnlyIfIdle>
    <WakeToRun>false</WakeToRun>
    <ExecutionTimeLimit>PT1H</ExecutionTimeLimit>
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
}
finally {
  if (Test-Path $TaskXmlPath) {
    Remove-Item -LiteralPath $TaskXmlPath -Force
  }
}

Write-Host "Registered scheduled task '$TaskName' starting at $StartTime and repeating every $EveryMinutes minutes using $Runner"
