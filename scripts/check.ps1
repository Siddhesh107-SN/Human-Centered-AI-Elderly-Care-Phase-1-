# =====================================================================
# CarePulse AI - Environment & Dependency Diagnostic Checker
# =====================================================================

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  CarePulse AI - Environment & Diagnostic Check" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$rootPath = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $rootPath

$allPassed = $true

# 1. Check Python
Write-Host "[1/6] Checking Python Runtime..." -NoNewline
$pythonPath = "..\SmartHealt_Stress Pridiction\myenv\Scripts\python.exe"
if (Test-Path $pythonPath) {
    $pyVer = & $pythonPath --version
    Write-Host " [PASS] Found $pyVer ($pythonPath)" -ForegroundColor Green
} else {
    $sysPy = Get-Command python -ErrorAction SilentlyContinue
    if ($sysPy) {
        $pyVer = python --version
        Write-Host " [PASS] Found System $pyVer" -ForegroundColor Green
        $pythonPath = "python"
    } else {
        Write-Host " [FAIL] Python runtime not found!" -ForegroundColor Red
        $allPassed = $false
    }
}

# 2. Check Node.js & npm
Write-Host "[2/6] Checking Node.js & npm..." -NoNewline
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
$npmCmd = Get-Command npm -ErrorAction SilentlyContinue
if ($nodeCmd -and $npmCmd) {
    $nodeVer = node -v
    $npmVer = npm -v
    Write-Host " [PASS] Node $nodeVer, npm $npmVer" -ForegroundColor Green
} else {
    Write-Host " [FAIL] Node.js or npm missing in PATH." -ForegroundColor Red
    $allPassed = $false
}

# 3. Check ML Models & Artifacts
Write-Host "[3/6] Checking ML Artifacts..." -NoNewline
$mlModels = @("xgboost.pkl", "random_forest.pkl", "decision_tree.pkl", "logistic_regression.pkl")
$mlPrep = @("encoder.pkl", "scaler.pkl", "background_sample.pkl")
$missingML = @()

foreach ($m in $mlModels) {
    if (-not (Test-Path "backend\ml\models\$m")) { $missingML += $m }
}
foreach ($p in $mlPrep) {
    if (-not (Test-Path "backend\ml\preprocessing\$p")) { $missingML += $p }
}

if ($missingML.Count -eq 0) {
    Write-Host " [PASS] All 7 ML models & preprocessing artifacts present." -ForegroundColor Green
} else {
    Write-Host " [FAIL] Missing artifacts: $($missingML -join ', ')" -ForegroundColor Red
    $allPassed = $false
}

# 4. Check Frontend Build Dependencies
Write-Host "[4/6] Checking Frontend Modules..." -NoNewline
if (Test-Path "frontend\node_modules") {
    Write-Host " [PASS] frontend\node_modules installed." -ForegroundColor Green
} else {
    Write-Host " [WARN] frontend\node_modules not found. Run 'npm install' in frontend." -ForegroundColor Yellow
}

# 5. Check MySQL Server Port 3306
Write-Host "[5/6] Checking MySQL Server Connectivity (Port 3306)..." -NoNewline
$portTest = Test-NetConnection -ComputerName 127.0.0.1 -Port 3306 -InformationLevel Quiet
if ($portTest) {
    Write-Host " [PASS] MySQL Server listening on 127.0.0.1:3306" -ForegroundColor Green
} else {
    Write-Host " [NOTICE] Port 3306 not active. MySQL service may need to be started for full DB persistence." -ForegroundColor Yellow
    Write-Host "         (To start: Start-Service MySQL80 or launch MySQL from XAMPP Control Panel)" -ForegroundColor Gray
}

# 6. Check Configuration
Write-Host "[6/6] Checking Configuration Files..." -NoNewline
if (Test-Path ".env") {
    Write-Host " [PASS] .env file configured." -ForegroundColor Green
} else {
    Write-Host " [NOTICE] .env not found. Copying .env.example to .env..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
}

Write-Host ""
Write-Host "Diagnostic check completed." -ForegroundColor Cyan
