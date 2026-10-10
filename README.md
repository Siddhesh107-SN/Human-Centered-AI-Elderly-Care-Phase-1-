# CarePulse AI — Human-Centered Elderly Care & Remote Health Monitoring

CarePulse AI is an accessible, production-ready full-stack web application designed for senior citizens and their caregivers. It combines an intuitive Bento Grid interface with a real Machine Learning physiological stress and health risk prediction engine, persistent MySQL database storage, and trilingual language support (English, Hindi, and Marathi).

---

## 🌟 Key Features

### 1. Human-Centered & Accessible Interface
- **Bento Grid Architecture:** Clean, high-contrast dashboard with large readable typography and generous touch/click targets.
- **Multilingual Support:** Instant language switching between **English**, **हिंदी (Hindi)**, and **मराठी (Marathi)** without page reloads.
- **Accessibility Controls:** One-click font scaling (`100%`, `115%`, `130%`) with persistent localStorage and user profile synchronization.
- **Senior & Caregiver Mode:** Seamless switching between senior-focused daily views and caregiver oversight views.

### 2. Machine Learning Health Risk & Stress Engine
- **Trained Classifiers:** Powered by the genuine `SmartHealth_Stress_Prediction` models (**XGBoost**, **Random Forest**, **Decision Tree**, and **Logistic Regression**).
- **Physiological Biometrics:** Evaluates Heart Rate (BPM), Blood Oxygen (SpO₂ %), Step Count, Sleep Duration, Activity Level, and Stress Biomarkers.
- **Quantified Risk Scoring:** Computes risk probability percentages (0–100%) categorized into 4 risk tiers (*Low*, *Moderate*, *Elevated*, *Critical*).
- **Explainable AI (XAI):** Local feature importance attribution via SHAP.
- **Zero Mock Data:** Real inference pipeline running against pre-trained `scikit-learn` and `xgboost` artifacts.

### 3. Comprehensive Health & Daily Care Tracking
- **Medication Management:** Daily schedules, dose timings, meal relations, one-tap "Mark as taken" actions, and pharmacy refill tracking.
- **Empathetic Activity Meter:** Tracks gentle movement and steps with positive, non-shaming motivational messages based on real data.
- **Emergency Action Box:** One-touch direct caregiver notification with designated phone line and confirmation alerts.
- **Appointments & Consultations:** Clinic transport coordination and telehealth video room integration.

### 4. Enterprise-Grade Database Architecture
- **MySQL Exclusively:** Normalized relational schema (`users`, `medicine_library`, `medicine_schedules`, `medicine_logs`, `activity_logs`, `health_predictions`).
- **Alembic Migrations:** Safe database migrations without resetting existing data.
- **MySQL Workbench Ready:** Comprehensive diagnostic SQL queries provided in `docs/database_queries.sql`.

---

## 🏗️ Technology Stack

| Tier | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, JavaScript, CSS3 Design Tokens, Devanagari Typography |
| **Backend** | Python 3.14 / 3.10+, FastAPI, Uvicorn, Pydantic v2, SQLAlchemy 2.0, Alembic |
| **Machine Learning** | XGBoost, Scikit-learn, Pandas, NumPy, SHAP, Joblib |
| **Database** | MySQL 8.0+, PyMySQL driver, MySQL Workbench |
| **Automation** | PowerShell scripts (`start.ps1`, `check.ps1`, `test.ps1`, `stop.ps1`, `backup-db.ps1`) |

---

## 📁 Project Structure

```
Human-Centered AI Elderly Care Websit/
├── frontend/                     # React + Vite Application
│   ├── public/                   # Static assets & icons
│   ├── src/
│   │   ├── components/           # Reusable UI components & modals
│   │   ├── hooks/                # useTranslation, useFontSize hooks
│   │   ├── pages/                # Bento Grid views & pages
│   │   ├── services/             # Centralized API service layer
│   │   ├── styles/               # Preserved design tokens & CSS
│   │   ├── translations/         # English, Hindi, Marathi dictionaries
│   │   ├── App.jsx               # Root application component
│   │   └── main.jsx              # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # FastAPI Backend & ML Pipeline
│   ├── app/
│   │   ├── api/v1/endpoints/     # REST routes (auth, predictions, medicines, activities, dashboard)
│   │   ├── core/                 # Config, security, JWT authentication
│   │   ├── database/             # SQLAlchemy session & Base
│   │   ├── models/               # MySQL database models
│   │   ├── schemas/              # Pydantic request/response schemas
│   │   ├── services/             # ModelService & PredictionService
│   │   └── main.py               # FastAPI application entry point
│   ├── ml/                       # Trained ML models & preprocessors
│   │   ├── models/               # xgboost.pkl, random_forest.pkl, etc.
│   │   └── preprocessing/        # scaler.pkl, encoder.pkl, background_sample.pkl
│   ├── migrations/               # Alembic migrations
│   ├── tests/                    # Pytest test suites (ML & REST API)
│   ├── alembic.ini
│   └── requirements.txt
│
├── scripts/                      # PowerShell Automation Suite
│   ├── check.ps1                 # Environment & prerequisite diagnostics
│   ├── test.ps1                  # Automated test runner (Pytest + Vite)
│   ├── stop.ps1                  # Safe application process shutdown
│   └── backup-db.ps1             # Automated MySQL database backup
│
├── docs/                         # Detailed Documentation
│   ├── SETUP.md                  # First-time Windows setup guide
│   ├── DATABASE.md               # MySQL Server & Workbench guide
│   ├── API.md                    # REST API specifications
│   ├── DEPLOYMENT.md             # Production deployment guide
│   ├── TEST_REPORT.md            # Automated test execution report
│   └── database_queries.sql      # Read-only MySQL Workbench queries
│
├── .env.example                  # Environment configuration template
├── .env                          # Local environment settings
├── .gitignore                    # Secrets & build exclusion rules
├── start.ps1                     # One-Command Windows Application Launcher
└── README.md                     # Project README
```

---

## 🚀 Quick Start on Windows

### 1. One-Command Launch
In PowerShell, simply run:

```powershell
.\start.ps1
```

The script will automatically check prerequisites, configure environments, apply pending database migrations, start the FastAPI backend and React frontend, and launch your default browser.

### Access URLs:
- **Frontend Dashboard:** [http://localhost:5173](http://localhost:5173)
- **FastAPI Backend:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive Swagger API Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Health & Readiness Endpoint:** [http://127.0.0.1:8000/health/ready](http://127.0.0.1:8000/health/ready)

### 2. Safe Shutdown
To stop the running services:
```powershell
.\scripts\stop.ps1
```

---

## 🧪 Automated Testing

Run the automated test suite verifying ML inference, REST endpoints, and the React production build:

```powershell
.\scripts\test.ps1
```

**Results:** 12/12 backend tests passed, Vite build completed in ~1 second. (See `docs/TEST_REPORT.md` for details).

---

## 🗄️ MySQL Database & Workbench

1. Configure your MySQL credentials in `.env`:
   ```env
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_DB=elderly_care_db
   MYSQL_USER=elderly_care_user
   MYSQL_PASSWORD=ElderlyCare@2026
   ```

2. Open **MySQL Workbench 8.0** and connect to `127.0.0.1:3306`.
3. Open `docs/database_queries.sql` in Workbench to inspect saved predictions, medication adherence logs, and activity records.
4. For step-by-step database setup instructions, see `docs/DATABASE.md`.

---

## 📄 Documentation Index

- [First-Time Setup Guide](docs/SETUP.md)
- [Database & MySQL Workbench Guide](docs/DATABASE.md)
- [REST API Specification](docs/API.md)
- [Test & Verification Report](docs/TEST_REPORT.md)
- [Production Deployment Guide](docs/DEPLOYMENT.md)
- [Diagnostic SQL Queries](docs/database_queries.sql)
