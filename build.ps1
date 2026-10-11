[CmdletBinding()]
param(
    [int]$Port = 4321,
    [switch]$NoOpen
)

$ErrorActionPreference = "Stop"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " High Prairie Church - Build & Launch" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Ensure Node.js and npm are on PATH
if (-not (Get-Command "npm" -ErrorAction SilentlyContinue)) {
    $nodePaths = @(
        "C:\Program Files\nodejs",
        "C:\Program Files (x86)\nodejs",
        "$env:LOCALAPPDATA\Programs\nodejs",
        "$env:APPDATA\npm"
    )
    foreach ($path in $nodePaths) {
        if (Test-Path $path) {
            Write-Host "Adding $path to PATH..." -ForegroundColor Yellow
            $env:PATH = "$path;$env:PATH"
        }
    }
}

if (-not (Get-Command "npm" -ErrorAction SilentlyContinue)) {
    Write-Error "Could not find 'npm'. Please ensure Node.js is installed."
    exit 1
}

$repoRoot = $PSScriptRoot
if ($repoRoot) {
    Set-Location $repoRoot
}

# 2. Build the Astro static site
Write-Host "`n[1/3] Building static website..." -ForegroundColor Green
& npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed with exit code $LASTEXITCODE."
    exit $LASTEXITCODE
}

# 3. Determine URL
$siteUrl = "http://127.0.0.1:$Port/highprairiechurch/"

# 4. Launch in default browser
if (-not $NoOpen) {
    Write-Host "`n[2/3] Opening default browser at $siteUrl..." -ForegroundColor Green
    try {
        Start-Process $siteUrl
    } catch {
        Write-Warning "Could not automatically launch browser: $_"
    }
}

# 5. Launch preview server
Write-Host "`n[3/3] Starting preview server on port $Port..." -ForegroundColor Green
Write-Host "Serving at: $siteUrl" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server.`n" -ForegroundColor Gray

& npm run preview -- --host 127.0.0.1 --port $Port
