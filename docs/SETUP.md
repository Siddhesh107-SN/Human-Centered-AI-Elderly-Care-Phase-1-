# CarePulse AI - First-Time Setup Guide (Windows)

Follow these step-by-step instructions to set up and run CarePulse AI on a Windows computer.

---

## 1. Prerequisites

Ensure the following tools are installed:
1. **Python 3.10+** (Tested on Python 3.14.3)
2. **Node.js 18+** & **npm** (Tested on Node v24.19.0)
3. **MySQL Server 8.0+** & **MySQL Workbench**

---

## 2. Environment Configuration

1. Clone or navigate to the project directory:
   ```powershell
   cd "C:\Users\siddhesh\OneDrive\Desktop\Human-Centered AI Elderly Care Websit"
   ```

2. Copy the environment configuration template:
   ```powershell
   Copy-Item .env.example .env
   ```

3. Open `.env` and set your MySQL credentials:
   ```env
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_DB=elderly_care_db
   MYSQL_USER=elderly_care_user
   MYSQL_PASSWORD=ElderlyCare@2026
   ```

---

## 3. Setup Python Backend Dependencies

```powershell
# Using the project's virtual environment
& "..\SmartHealt_Stress Pridiction\myenv\Scripts\python.exe" -m pip install -r backend/requirements.txt
```

---

## 4. Setup Frontend Dependencies

```powershell
cd frontend
npm install
cd ..
```

---

## 5. Initialize MySQL Database

In **MySQL Workbench**, run the setup script:

```sql
CREATE DATABASE IF NOT EXISTS elderly_care_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'elderly_care_user'@'localhost' IDENTIFIED BY 'ElderlyCare@2026';
GRANT ALL PRIVILEGES ON elderly_care_db.* TO 'elderly_care_user'@'localhost';
FLUSH PRIVILEGES;
```

Apply database migrations:

```powershell
& "..\SmartHealt_Stress Pridiction\myenv\Scripts\python.exe" -m alembic -c backend/alembic.ini upgrade head
```

---

## 6. Run Diagnostic Check

Verify all components with:

```powershell
.\scripts\check.ps1
```

---

## 7. Start the Application

Launch everything in one command:

```powershell
.\start.ps1
```

Your browser will automatically open to `http://localhost:5173`.
Interactive Swagger API documentation is available at `http://127.0.0.1:8000/docs`.
