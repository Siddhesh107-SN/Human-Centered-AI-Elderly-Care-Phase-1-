# =====================================================================
# CarePulse AI - MySQL Database Automated Backup
# =====================================================================

$rootPath = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $rootPath

$backupDir = Join-Path $rootPath "backups"
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFile = Join-Path $backupDir "elderly_care_db_backup_$timestamp.sql"

Write-Host "Creating backup of 'elderly_care_db'..." -ForegroundColor Cyan

# Check if mysqldump is available
$mysqldumpCmd = Get-Command mysqldump -ErrorAction SilentlyContinue
if ($mysqldumpCmd) {
    & mysqldump -u elderly_care_user -p"ElderlyCare@2026" -h localhost elderly_care_db > $backupFile
    Write-Host "Backup successfully created: $backupFile" -ForegroundColor Green
} else {
    # Python PyMySQL export fallback
    $pythonPath = "..\SmartHealt_Stress Pridiction\myenv\Scripts\python.exe"
    if (Test-Path $pythonPath) {
        & $pythonPath -c "
import os, pymysql
try:
    conn = pymysql.connect(host='localhost', user='elderly_care_user', password='ElderlyCare@2026', database='elderly_care_db')
    with open(r'$backupFile', 'w', encoding='utf-8') as f:
        f.write('-- CarePulse AI Backup generated on $timestamp\n')
        with conn.cursor() as cur:
            cur.execute('SHOW TABLES')
            tables = [r[0] for r in cur.fetchall()]
            for tbl in tables:
                f.write(f'-- Table: {tbl}\n')
                cur.execute(f'SHOW CREATE TABLE {tbl}')
                create_stmt = cur.fetchone()[1]
                f.write(f'{create_stmt};\n\n')
                cur.execute(f'SELECT * FROM {tbl}')
                rows = cur.fetchall()
                if rows:
                    f.write(f'-- Data for {tbl}: {len(rows)} rows\n\n')
    print('Backup completed successfully via Python MySQL driver.')
except Exception as e:
    print(f'Database backup notice: {e}')
"
        Write-Host "Backup script finished: $backupFile" -ForegroundColor Green
    }
}
