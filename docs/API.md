# CarePulse AI - REST API Documentation

Base URL: `http://127.0.0.1:8000/api/v1`  
Interactive Swagger Docs: `http://127.0.0.1:8000/docs`  
OpenAPI Specification: `http://127.0.0.1:8000/openapi.json`  

---

## 1. System Health

### `GET /health`
Liveness probe.
```json
{
  "status": "healthy",
  "service": "carepulse-backend",
  "version": "2.0.0"
}
```

### `GET /health/ready`
Readiness probe verifying ML models and MySQL database connection.
```json
{
  "ready": true,
  "ml_models_loaded": true,
  "available_models": ["logistic_regression", "decision_tree", "random_forest", "xgboost"],
  "database": {
    "connected": true,
    "database": "elderly_care_db",
    "status": "ready"
  }
}
```

---

## 2. ML Stress & Health Risk Prediction

### `POST /api/v1/predictions/stress` (Alias: `POST /api/predictions/stress`)
Runs single-model physiological stress and health risk prediction.

**Query Parameter:** `model` (`xgboost` [default], `random_forest`, `decision_tree`, `logistic_regression`)

**Request Body:**
```json
{
  "Heart Rate (BPM)": 75.0,
  "Blood Oxygen Level (%)": 98.0,
  "Step Count": 3500.0,
  "Sleep Duration (hours)": 7.5,
  "Activity Level": "active",
  "Stress Level": 3.0
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "model": "xgboost",
  "prediction": 0,
  "label": "Low Health Risk",
  "probability": 0.12,
  "health_risk_score": 12.0,
  "risk_tier": "Low",
  "risk_assessment": "Vitals and biometric indicators are within stable baseline ranges. Continue balanced daily hydration and gentle activity.",
  "probabilities": {
    "Low Health Risk": 0.88,
    "Elevated Health Risk": 0.12
  },
  "id": 1,
  "created_at": "2026-10-09T12:00:00Z"
}
```

### `POST /api/v1/predictions/all`
Runs prediction across all 4 machine learning models simultaneously.

### `POST /api/v1/predictions/explain`
Generates SHAP local feature attribution explanations.

### `GET /api/v1/predictions/history`
Returns past predictions for the authenticated user from MySQL.

---

## 3. Dashboard Aggregation

### `GET /api/v1/dashboard/summary`
Returns full aggregated dashboard overview:
- Current Vitals (Heart Rate, BP, SpO2, Temp)
- Today's Scheduled Medications with taken/pending status
- Daily Activity Progress & Motivational Encouragement Message
- Active Notifications and Alerts

---

## 4. Medication Management

- `GET /api/v1/medicines/` — List saved prescription medicines
- `POST /api/v1/medicines/` — Add new prescription to library
- `GET /api/v1/medicines/schedules` — List schedules
- `POST /api/v1/medicines/schedules` — Create new schedule
- `GET /api/v1/medicines/today` — List today's medicines with adherence status
- `POST /api/v1/medicines/logs` — Log medicine status (`taken`, `skipped`, `pending`)

---

## 5. Activity Tracking & Encouragement

- `POST /api/v1/activities/` — Record physical movement session
- `GET /api/v1/activities/summary/today` — Daily summary, step progress, and personalized encouragement
- `GET /api/v1/activities/summary/weekly` — 7-day activity curve and trend analysis

---

## 6. Authentication & User Profile

- `POST /api/v1/auth/register` — Register account
- `POST /api/v1/auth/login` — Log in and get JWT token
- `GET /api/v1/auth/me` — Get current profile & accessibility settings
- `PUT /api/v1/auth/me` — Update font size, language, or emergency contact
