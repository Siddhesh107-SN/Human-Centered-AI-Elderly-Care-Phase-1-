# =====================================================================
# CarePulse AI - Safe Application Process Shutdown
# =====================================================================

Write-Host "Stopping CarePulse AI local services..." -ForegroundColor Cyan

# Stop process listening on Port 8000 (FastAPI Backend)
$backendPort = 8000
$netstat8000 = Get-NetTCPConnection -LocalPort $backendPort -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($netstat8000) {
    foreach ($pidNum in $netstat8000) {
        if ($pidNum -gt 4) {
            $p = Get-Process -Id $pidNum -ErrorAction SilentlyContinue
            if ($p -and $p.ProcessName -match "python|uvicorn") {
                Write-Host "Stopping Backend process (PID $pidNum - $($p.ProcessName))..." -ForegroundColor Yellow
                Stop-Process -Id $pidNum -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

# Stop process listening on Port 5173 (Vite Dev Server)
$frontendPort = 5173
$netstat5173 = Get-NetTCPConnection -LocalPort $frontendPort -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($netstat5173) {
    foreach ($pidNum in $netstat5173) {
        if ($pidNum -gt 4) {
            $p = Get-Process -Id $pidNum -ErrorAction SilentlyContinue
            if ($p -and $p.ProcessName -match "node|npm") {
                Write-Host "Stopping Frontend process (PID $pidNum - $($p.ProcessName))..." -ForegroundColor Yellow
                Stop-Process -Id $pidNum -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

Write-Host "CarePulse AI services stopped cleanly." -ForegroundColor Green
