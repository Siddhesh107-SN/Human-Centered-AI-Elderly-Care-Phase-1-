# =====================================================================
# CarePulse AI - One-Command Application Launcher (Windows)
# =====================================================================

param(
    [switch]$NoBrowser,
    [switch]$Prod
)

$ErrorActionPreference = "Continue"
$rootPath = $PSScriptRoot
Set-Location $rootPath

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  CarePulse AI - Human-Centered Elderly Care Launcher" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Environment and Path Resolution
$pythonExe = "..\SmartHealt_Stress Pridiction\myenv\Scripts\python.exe"
if (-not (Test-Path $pythonExe)) {
    $pythonExe = "python"
}

# 2. Check Configuration
if (-not (Test-Path ".env")) {
    Write-Host "[*] Creating default .env from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
}

# 3. Check MySQL Status
Write-Host "[*] Checking MySQL connectivity..." -ForegroundColor Gray
$isMySqlListening = Test-NetConnection -ComputerName 127.0.0.1 -Port 3306 -InformationLevel Quiet
if ($isMySqlListening) {
    Write-Host "    [OK] MySQL is listening on port 3306." -ForegroundColor Green
    
    # Run pending migrations
    Write-Host "[*] Applying pending database migrations..." -ForegroundColor Gray
    try {
        & $pythonExe -m alembic -c backend/alembic.ini upgrade head | Out-Null
    } catch {
        Write-Host "    [WARN] Migration check completed." -ForegroundColor Gray
    }
} else {
    Write-Host "    [NOTICE] MySQL Server is not detected on port 3306." -ForegroundColor Yellow
    Write-Host "             (The backend will run with mock session memory for UI testing until MySQL service is started.)" -ForegroundColor Gray
}

# 4. Check & Stop Previous Running Instances on Ports
$portsToCheck = @(8000, 5173)
foreach ($port in $portsToCheck) {
    $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    if ($conns) {
        foreach ($pidNum in $conns) {
            if ($pidNum -gt 4) {
                $proc = Get-Process -Id $pidNum -ErrorAction SilentlyContinue
                if ($proc -and ($proc.ProcessName -match "python|uvicorn|node")) {
                    Write-Host "[*] Releasing port $port (Stopping existing process PID $pidNum)..." -ForegroundColor Yellow
                    Stop-Process -Id $pidNum -Force -ErrorAction SilentlyContinue
                }
            }
        }
    }
}

# 5. Start Backend Process (FastAPI / Uvicorn)
Write-Host "[*] Starting FastAPI Backend on http://127.0.0.1:8000..." -ForegroundColor Cyan
$backendProc = Start-Process -FilePath $pythonExe -ArgumentList "-m", "uvicorn", "backend.app.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload" -PassThru -NoNewWindow

# 6. Wait for Backend Health Check
Write-Host "[*] Waiting for backend services to initialize..." -NoNewline
$backendReady = $false
for ($i = 0; $i -lt 15; $i++) {
    Start-Sleep -Seconds 1
    Write-Host "." -NoNewline
    try {
        $res = Invoke-RestMethod -Uri "http://127.0.0.1:8000/health" -Method Get -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($res -and $res.status -eq "healthy") {
            $backendReady = $true
            break
        }
    } catch {
        # Continue waiting
    }
}
Write-Host ""

if ($backendReady) {
    Write-Host "    [OK] Backend successfully initialized." -ForegroundColor Green
} else {
    Write-Host "    [INFO] Backend starting up in background..." -ForegroundColor Yellow
}

# 7. Start Frontend Process (Vite Dev Server or Production Build)
$frontendProc = $null
if (-not $Prod) {
    Write-Host "[*] Starting Vite React Frontend on http://localhost:5173..." -ForegroundColor Cyan
    $npmCmd = "npm.cmd"
    $frontendProc = Start-Process -FilePath $npmCmd -ArgumentList "run", "dev" -WorkingDirectory (Join-Path $rootPath "frontend") -PassThru -NoNewWindow
    Start-Sleep -Seconds 2
} else {
    Write-Host "[*] Production mode: Serving built frontend directly from FastAPI backend." -ForegroundColor Green
}

# 8. Display Access URLs
Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "  CarePulse AI Elderly Care Application is LIVE!" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend Application:   http://localhost:5173" -ForegroundColor White
Write-Host "  Backend API Service:     http://127.0.0.1:8000" -ForegroundColor White
Write-Host "  Interactive API Docs:    http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host "  Health Readiness Check:  http://127.0.0.1:8000/health/ready" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C or run .\scripts\stop.ps1 to stop all services." -ForegroundColor Gray
Write-Host ""

# 9. Optionally Open in Browser
if (-not $NoBrowser) {
    $urlToOpen = "http://localhost:5173"
    if ($Prod) {
        $urlToOpen = "http://localhost:8000"
    }
    Start-Process $urlToOpen
}

# 10. Process Monitoring Loop
try {
    while ($true) {
        if ($backendProc -and $backendProc.HasExited) {
            $exitCode = $backendProc.ExitCode
            Write-Host "[WARN] Backend process exited (Exit Code: $exitCode)." -ForegroundColor Red
            break
        }
        if ($frontendProc -and $frontendProc.HasExited) {
            $exitCode = $frontendProc.ExitCode
            Write-Host "[WARN] Frontend process exited (Exit Code: $exitCode)." -ForegroundColor Red
            break
        }
        Start-Sleep -Seconds 2
    }
} finally {
    Write-Host ""
    Write-Host "Stopping application services..." -ForegroundColor Yellow
    if ($backendProc -and (-not $backendProc.HasExited)) {
        Stop-Process -Id $backendProc.Id -Force -ErrorAction SilentlyContinue
    }
    if ($frontendProc -and (-not $frontendProc.HasExited)) {
        Stop-Process -Id $frontendProc.Id -Force -ErrorAction SilentlyContinue
    }
    $stopScript = Join-Path $rootPath "scripts\stop.ps1"
    if (Test-Path $stopScript) {
        & $stopScript
    }
    Write-Host "All CarePulse AI processes stopped." -ForegroundColor Green
}
