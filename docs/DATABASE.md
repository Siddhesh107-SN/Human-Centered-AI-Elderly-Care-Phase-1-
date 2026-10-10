# CarePulse AI - MySQL Database Architecture & Workbench Guide

This document explains how to set up, connect, migrate, inspect, and maintain the **MySQL** database for the CarePulse AI Elderly Care application on Windows.

---

## 1. Install & Configure MySQL Server on Windows

### Option A: MySQL Community Server (Recommended)
1. Download **MySQL Community Server 8.0+** from [dev.mysql.com/downloads/installer/](https://dev.mysql.com/downloads/installer/).
2. Launch the installer and choose **Server only** or **Developer Default**.
3. During Configuration:
   - Config Type: **Development Computer**
   - Port: `3306`
   - Authentication: **Use Strong Password Encryption** (or Legacy if preferred)
   - Set a strong MySQL Root Password.
4. Verify the Windows Service is set to start automatically:
   ```powershell
   Get-Service -Name MySQL*
   Start-Service -Name MySQL80
   ```

### Option B: XAMPP / WAMP MySQL
1. Start XAMPP Control Panel.
2. Click **Start** next to MySQL (Port `3306`).

---

## 2. Connect Using MySQL Workbench

1. Open **MySQL Workbench 8.0** (`C:\Program Files\MySQL\MySQL Workbench 8.0\MySQLWorkbench.exe`).
2. On the home screen, click the **`+`** icon next to *MySQL Connections*.
3. Configure the connection parameters:
   - **Connection Name:** `CarePulse AI - Local`
   - **Hostname:** `127.0.0.1` (or `localhost`)
   - **Port:** `3306`
   - **Username:** `root` (or `elderly_care_user`)
4. Click **Test Connection** to confirm connectivity.
5. Click **OK** to save the connection and open the SQL Editor tab.

---

## 3. Create Application Database & Dedicated User

In MySQL Workbench SQL Editor, execute:

```sql
-- 1. Create dedicated database
CREATE DATABASE IF NOT EXISTS elderly_care_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 2. Create dedicated database user (Principle of Least Privilege)
CREATE USER IF NOT EXISTS 'elderly_care_user'@'localhost' IDENTIFIED BY 'ElderlyCare@2026';
CREATE USER IF NOT EXISTS 'elderly_care_user'@'127.0.0.1' IDENTIFIED BY 'ElderlyCare@2026';

-- 3. Grant required privileges on elderly_care_db
GRANT ALL PRIVILEGES ON elderly_care_db.* TO 'elderly_care_user'@'localhost';
GRANT ALL PRIVILEGES ON elderly_care_db.* TO 'elderly_care_user'@'127.0.0.1';

-- 4. Apply changes
FLUSH PRIVILEGES;
```

---

## 4. Configure Application Connection

Update `.env` in the project root:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DB=elderly_care_db
MYSQL_USER=elderly_care_user
MYSQL_PASSWORD=ElderlyCare@2026
```

---

## 5. Run Database Migrations (Alembic)

To apply the normalized database schema without resetting data:

```powershell
# From project root
& "..\SmartHealt_Stress Pridiction\myenv\Scripts\python.exe" -m alembic -c backend/alembic.ini upgrade head
```

---

## 6. Verify Database Connection

Run the built-in diagnostic script:

```powershell
.\scripts\check.ps1
```

Or test the live readiness check endpoint:

```
GET http://127.0.0.1:8000/health/ready
```

---

## 7. Open Schema & Browse Tables in Workbench

In MySQL Workbench:
1. In the left **Navigator** pane, click the **Schemas** tab.
2. Expand `elderly_care_db` -> `Tables`.
3. You will see:
   - `users`
   - `medicine_library`
   - `medicine_schedules`
   - `medicine_logs`
   - `activity_logs`
   - `health_predictions`
   - `alembic_version`

---

## 8. Inspect Saved Records

Right-click any table (e.g. `health_predictions` or `medicine_logs`) and select **Select Rows - Limit 1000**.

You can also run pre-built queries from `docs/database_queries.sql`:

```sql
USE elderly_care_db;

-- View recent health predictions
SELECT id, model_name, heart_rate_bpm, blood_oxygen_level, step_count, label, health_risk_score, risk_tier, created_at 
FROM health_predictions 
ORDER BY created_at DESC;
```

---

## 9. Backup & Safe Restore

### Automated Backup Script
Run the PowerShell backup script:
```powershell
.\scripts\backup-db.ps1
```
Backups are timestamped and saved to `backups/db_backup_YYYYMMDD_HHMMSS.sql`.

### Restore Procedure
In MySQL Workbench:
1. Go to **Server** -> **Data Import / Restore**.
2. Select **Import from Self-Contained File**.
3. Choose the `.sql` backup file.
4. Target Schema: `elderly_care_db`.
5. Click **Start Import**.

---

## 10. Troubleshooting

| Issue | Cause | Resolution |
| :--- | :--- | :--- |
| `Can't connect to MySQL server on '127.0.0.1:3306'` | MySQL Windows service is stopped. | Run `Start-Service MySQL80` or start MySQL in XAMPP. |
| `Access denied for user 'elderly_care_user'` | Password mismatch or host permission. | Re-run the `CREATE USER` and `GRANT` queries above. |
| `Unknown database 'elderly_care_db'` | Database was not created yet. | Execute `CREATE DATABASE elderly_care_db;`. |
| `Table 'alembic_version' doesn't exist` | Migrations haven't been run. | Execute `alembic -c backend/alembic.ini upgrade head`. |
