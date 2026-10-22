param(
    [ValidateSet('deploy', 'check', 'start', 'update', 'stop', 'logs')]
    [string]$Mode = 'deploy'
)

$ErrorActionPreference = 'Stop'
Push-Location $PSScriptRoot
try {

$dockerCommand = Get-Command docker -ErrorAction SilentlyContinue
if ($dockerCommand) {
    $dockerExe = $dockerCommand.Source
} else {
    $dockerExe = @(
        (Join-Path $env:LOCALAPPDATA 'Programs\DockerDesktop\resources\bin\docker.exe'),
        'C:\Program Files\Docker\Docker\resources\bin\docker.exe'
    ) | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
}
if (-not $dockerExe) {
    throw 'Install Docker Desktop and start it before running this script.'
}

function Invoke-Docker {
    param([string[]]$Arguments)
    & $dockerExe @Arguments
    if ($LASTEXITCODE -ne 0) { throw "Docker failed: $($Arguments -join ' ')" }
}

function Invoke-DockerCompose {
    param([string[]]$Arguments)
    Invoke-Docker (@('compose') + $Arguments)
}

function Assert-CommonRepository {
    $commonProject = Join-Path $PSScriptRoot '..\WitcherKM.Common\WitcherKM.Common.Core\WitcherKM.Common.Core.csproj'
    if (-not (Test-Path -LiteralPath $commonProject)) {
        throw 'Clone WitcherKM.Common beside WitcherKM.Planner before building the API image.'
    }
}

function Ensure-LicenseKey {
    $envPath = Join-Path $PSScriptRoot '.env'
    $contents = if (Test-Path -LiteralPath $envPath) { [IO.File]::ReadAllText($envPath) } else { '' }
    $keyPattern = '(?m)^[ \t]*MEDIATR_LICENSE_KEY[ \t]*=[ \t]*([^\r\n]*)'
    $match = [regex]::Match($contents, $keyPattern)
    if ($match.Success) {
        $value = $match.Groups[1].Value.Trim().Trim('"').Trim("'")
        if ($value -and $value -ne 'replace-with-your-license-key') { return }
    }

    $secureKey = Read-Host 'Enter your MediatR license key (saved only in the local .env)' -AsSecureString
    $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)
    try { $key = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer) }
    finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer) }
    if ([string]::IsNullOrWhiteSpace($key) -or $key -match '[\r\n]') {
        throw 'A non-empty, single-line MediatR license key is required.'
    }

    $keyLine = "MEDIATR_LICENSE_KEY=$key"
    if ($match.Success) {
        $contents = $contents.Remove($match.Index, $match.Length).Insert($match.Index, $keyLine)
    } else {
        if ($contents -and -not $contents.EndsWith("`n")) { $contents += "`n" }
        $contents += "$keyLine`n"
    }
    [IO.File]::WriteAllText($envPath, $contents, [Text.UTF8Encoding]::new($false))
}

function Invoke-Checks {
    Write-Host 'Checking API build and backend tests...'
    Invoke-Docker @('build', '--pull', '--build-context', 'common=../WitcherKM.Common', '-f', 'docker/api.Dockerfile', '--target', 'test', '-t', 'witcherkm-planner-api-check', '.')
    Write-Host 'Checking frontend build, lint, and tests...'
    Invoke-Docker @('build', '--pull', '-f', 'docker/web.Dockerfile', '--target', 'test', '-t', 'witcherkm-planner-web-check', '.')
    Write-Host 'All container checks passed.'
}

function Wait-ForPlanner {
    $paths = @('/', '/api/projects/get-projects')
    foreach ($path in $paths) {
        $url = "http://127.0.0.1:8080$path"
        $ready = $false
        for ($attempt = 0; $attempt -lt 30; $attempt++) {
            try {
                $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5
                if ($response.StatusCode -eq 200) { $ready = $true; break }
            } catch {
                Start-Sleep -Seconds 2
            }
        }
        if (-not $ready) {
            Invoke-DockerCompose @('ps')
            throw "Planner did not become ready at $url. Inspect logs with: powershell -File .\docker.ps1 logs"
        }
    }
}

if ($Mode -eq 'logs') {
    Invoke-DockerCompose @('logs', '-f')
    return
}
if ($Mode -eq 'stop') {
    Invoke-DockerCompose @('down')
    Write-Host 'Planner stopped; the SQLite volume was kept.'
    return
}

Assert-CommonRepository
Invoke-Docker @('info', '--format', '{{.ServerVersion}}')
if ($Mode -ne 'check') { Ensure-LicenseKey }
Invoke-Checks
if ($Mode -eq 'check') { return }

Write-Host 'Building and updating Planner containers...'
Invoke-DockerCompose @('build')
Invoke-DockerCompose @('up', '-d', '--no-build')
Wait-ForPlanner
Write-Host 'Planner is ready at http://localhost:8080'
} finally {
    Pop-Location
}
