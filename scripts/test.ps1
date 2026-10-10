# =====================================================================
# CarePulse AI - Automated Test Suite Runner
# =====================================================================

$rootPath = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $rootPath

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  CarePulse AI - Automated Test Verification" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$pythonExe = "..\SmartHealt_Stress Pridiction\myenv\Scripts\python.exe"
if (-not (Test-Path $pythonExe)) {
    $pythonExe = "python"
}

# 1. Backend ML Integration & API Pytest
Write-Host "[1/2] Running Backend ML Integration Tests (pytest)..." -ForegroundColor Cyan
& $pythonExe -m pytest backend/tests -v
$backendExit = $LASTEXITCODE

# 2. Frontend React Production Build Test
Write-Host ""
Write-Host "[2/2] Running Frontend Production Build Test (Vite)..." -ForegroundColor Cyan
Set-Location (Join-Path $rootPath "frontend")
npm run build
$frontendExit = $LASTEXITCODE
Set-Location $rootPath

# Summary Report
Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Test Summary Report" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

if ($backendExit -eq 0) {
    Write-Host "  [PASS] Backend ML and API Tests: PASSED" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] Backend ML and API Tests: FAILED" -ForegroundColor Red
}

if ($frontendExit -eq 0) {
    Write-Host "  [PASS] Frontend React Build:     PASSED" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] Frontend React Build:     FAILED" -ForegroundColor Red
}

Write-Host ""
if ($backendExit -eq 0 -and $frontendExit -eq 0) {
    Write-Host "All automated tests completed successfully!" -ForegroundColor Green
} else {
    Write-Host "Some tests reported issues. Please review output above." -ForegroundColor Yellow
}
