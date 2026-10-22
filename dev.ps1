param(
    [ValidateSet('setup', 'api', 'web', 'configure')]
    [string]$Mode = 'setup',
    [string]$CommonPath = (Join-Path $PSScriptRoot '..\WitcherKM.Common')
)
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

function Invoke-Checked {
    param([string]$Executable, [string[]]$Arguments)
    & $Executable @Arguments
    if ($LASTEXITCODE -ne 0) { throw "Command failed: $Executable $Arguments" }
}

function Set-DevelopmentLicense {
    $secureKey = Read-Host 'Enter the MediatR license key' -AsSecureString
    $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)
    try { $licenseKey = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer) }
    finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer) }
    if ([string]::IsNullOrWhiteSpace($licenseKey) -or $licenseKey -match '[\r\n]') {
        throw 'A non-empty, single-line MediatR license key is required.'
    }

    $settings = @{ 'MediatR:LicenseKey' = $licenseKey } | ConvertTo-Json -Compress
    $settings | & $dotnetExe user-secrets set --project 'src\WitcherKM.Planner.Api'
    if ($LASTEXITCODE -ne 0) { throw 'Could not save the MediatR key to .NET User Secrets.' }
}

if ($Mode -ne 'web') {
    $dotnetCandidates = @((Join-Path $env:USERPROFILE '.dotnet\dotnet.exe'))
    $installedDotnet = Get-Command dotnet -ErrorAction SilentlyContinue
    if ($installedDotnet) { $dotnetCandidates += $installedDotnet.Source }
    $dotnetExe = $null
    foreach ($candidate in $dotnetCandidates) {
        if ((Test-Path $candidate) -and ((& $candidate --version) -match '^10\.')) {
            $dotnetExe = $candidate
            break
        }
    }
    if (-not $dotnetExe) { throw 'Install .NET SDK 10 and reopen your terminal.' }
}
if ($Mode -in @('setup', 'web')) {
    $nodeDirectory = Join-Path $env:ProgramFiles 'nodejs'
    if (Test-Path $nodeDirectory) { $env:Path = "$nodeDirectory;$env:Path" }
    $npmCommand = Get-Command npm.cmd -ErrorAction SilentlyContinue
    if (-not $npmCommand) { throw 'Install Node.js LTS with npm and reopen your terminal.' }
}
switch ($Mode) {
    'setup' {
        foreach ($name in @('Core', 'Domain', 'Orm')) {
            $project = Join-Path $CommonPath "WitcherKM.Common.$name\WitcherKM.Common.$name.csproj"
            if (-not (Test-Path $project)) { throw "Clone WitcherKM.Common beside Planner or pass -CommonPath. Missing: $project" }
            Invoke-Checked $dotnetExe @('pack', $project, '-c', 'Release', '-o', (Join-Path $PSScriptRoot 'artifacts\nuget'))
        }
        Invoke-Checked $dotnetExe @('build', 'WitcherKM.Planner.sln')
        Push-Location scripts
        try {
            Invoke-Checked $npmCommand.Source @('ci', '--include=dev')
            Invoke-Checked $npmCommand.Source @('run', 'build')
        } finally { Pop-Location }
    }
    'api' {
        Invoke-Checked $dotnetExe @('run', '--project', 'src\WitcherKM.Planner.Api', '--launch-profile', 'http')
    }
    'web' {
        Push-Location scripts
        try { Invoke-Checked $npmCommand.Source @('run', 'dev') } finally { Pop-Location }
    }
    'configure' {
        Set-DevelopmentLicense
    }
}
