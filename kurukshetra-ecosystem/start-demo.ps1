<#
.SYNOPSIS
    1-Click Demo Launcher for Kurukshetra Agentic Guardian (PS09)
.DESCRIPTION
    Launches the consolidated full-stack ecosystem:
    - FastAPI Backend + Risk Engine on http://localhost:8000
    - Citizen GPay Payment App + SOC Observer mounted at http://localhost:8000/main/
    - Marketing Landing Page mounted at http://localhost:8000/
#>

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Clear-Host

Write-Host "=========================================================================" -ForegroundColor Cyan
Write-Host "   KURUKSHETRA // AGENTIC GUARDIAN FOR REAL-TIME PAYMENT SCAM INTERCEPTION" -ForegroundColor Yellow
Write-Host "   PS09 Hackathon Monorepo Demonstration Launcher" -ForegroundColor Green
Write-Host "=========================================================================" -ForegroundColor Cyan
Write-Host ""

$ScriptDir = if ($PSScriptRoot) { $PSScriptRoot } elseif ($MyInvocation.MyCommand.Definition) { Split-Path -Parent $MyInvocation.MyCommand.Definition } else { Get-Location }
Set-Location $ScriptDir

# 1. Locate Python executable (.venv preferred)
$PythonPath = Join-Path $ScriptDir ".venv\Scripts\python.exe"
if (-not (Test-Path $PythonPath)) {
    $PythonPath = "python"
    Write-Host "[!] Local .venv not found, falling back to system python: $PythonPath" -ForegroundColor Yellow
} else {
    Write-Host "[✓] Utilizing Python Virtual Environment: $PythonPath" -ForegroundColor Green
}

# 2. Check pre-built frontend artifacts
$DistIndex = Join-Path $ScriptDir "frontend\dist\index.html"
$DistApp = Join-Path $ScriptDir "frontend\dist\app\index.html"

if (-not (Test-Path $DistIndex) -or -not (Test-Path $DistApp)) {
    Write-Host "[*] Pre-compiled frontend bundle missing. Checking dependencies and building Vite applications..." -ForegroundColor Yellow
    
    # Landing Page
    Set-Location (Join-Path $ScriptDir "frontend\landing")
    if (-not (Test-Path "node_modules")) {
        Write-Host "[*] Installing npm dependencies for landing page..." -ForegroundColor Gray
        npm install
    }
    npm run build

    # Citizen GPay App
    Set-Location (Join-Path $ScriptDir "frontend\gpay-app")
    if (-not (Test-Path "node_modules")) {
        Write-Host "[*] Installing npm dependencies for citizen payment app..." -ForegroundColor Gray
        npm install
    }
    npm run build

    Set-Location $ScriptDir
    Write-Host "[✓] Frontend applications compiled to frontend/dist/" -ForegroundColor Green
} else {
    Write-Host "[✓] Production UI bundles verified in frontend/dist/" -ForegroundColor Green
}

# 3. Environment check
$envFile = Join-Path $ScriptDir ".env"
if (Test-Path $envFile) {
    Write-Host "[✓] Environment credentials configured (.env loaded)" -ForegroundColor Green
}

Write-Host ""
Write-Host "-------------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "🚀 STARTING FASTAPI BACKEND & AGENTIC GUARDIAN RISK ENGINE..." -ForegroundColor Cyan
Write-Host "-------------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  👉 Marketing Landing Page:         http://localhost:8000/" -ForegroundColor White
Write-Host "  👉 Citizen GPay Demo & SOC Center: http://localhost:8000/main/" -ForegroundColor Yellow
Write-Host "  👉 Citizen Public Scam Lookup:     http://localhost:8000/api/ecosystem/public/lookup/mule.syndicate@axis" -ForegroundColor Magenta
Write-Host "  👉 Live API OpenAPI Docs:          http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "-------------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "🎮 5 PRE-CONFIGURED DEMO SCENARIOS TO SHOWCASE TO JUDGES:" -ForegroundColor Yellow
Write-Host "   1. GREEN:  grocer.local@oksbi      -> Everyday trusted merchant (ALLOW zone, <15ms)" -ForegroundColor Green
Write-Host "   2. YELLOW: newshop.mumbai@oksbi    -> Unregistered merchant (STEP_UP zone, cooling-off)" -ForegroundColor Yellow
Write-Host "   3. ORANGE: cbi.clearance.cell@sbi  -> Digital arrest extortion (COACH zone, anti-coercion UI)" -ForegroundColor DarkYellow
Write-Host "   4. RED:    mule.syndicate@axis     -> Rapid drain mule account (FREEZE zone, zero money moved)" -ForegroundColor Red
Write-Host "   5. BLUE:   unknown.crypto.trader   -> High-value extreme outlier (COACH zone, Z-score > 3.0)" -ForegroundColor Cyan
Write-Host "-------------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Opening your default browser to the demo app in 3 seconds... (Press Ctrl+C to stop)" -ForegroundColor Gray

# Open browser after short delay in background
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 3
    Start-Process "http://localhost:8000/main/"
} | Out-Null

# Run server with backend/src on PYTHONPATH
$env:PYTHONPATH = (Join-Path $ScriptDir "backend\src")
& $PythonPath -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload --app-dir (Join-Path $ScriptDir "backend\src")
