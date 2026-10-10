import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_health_check_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "carepulse-backend"


def test_readiness_check_endpoint():
    response = client.get("/health/ready")
    assert response.status_code in (200, 503)
    data = response.json()
    assert "ml_models_loaded" in data
    assert "database" in data


def test_predict_stress_api_endpoint():
    payload = {
        "Heart Rate (BPM)": 76.0,
        "Blood Oxygen Level (%)": 98.0,
        "Step Count": 3200.0,
        "Sleep Duration (hours)": 7.0,
        "Activity Level": "active",
        "Stress Level": 3.0,
    }
    response = client.post("/api/v1/predictions/stress?model=xgboost", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["model"] == "xgboost"
    assert "health_risk_score" in data
    assert "risk_tier" in data


def test_predict_stress_legacy_alias():
    payload = {
        "heart_rate_bpm": 74.0,
        "blood_oxygen_level": 99.0,
        "step_count": 4000.0,
        "sleep_duration_hours": 8.0,
        "activity_level": "active",
        "stress_level": 2.0,
    }
    response = client.post("/api/predictions/stress", json=payload)
    assert response.status_code == 200
    assert response.json()["success"] is True


def test_invalid_input_validation_error():
    payload = {
        "heart_rate_bpm": 10.0,  # invalid biologically
        "blood_oxygen_level": 98.0,
        "step_count": 1000.0,
        "sleep_duration_hours": 7.0,
        "activity_level": "active",
        "stress_level": 2.0,
    }
    response = client.post("/api/v1/predictions/stress", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False


def test_dashboard_summary_endpoint():
    response = client.get("/api/v1/dashboard/summary")
    assert response.status_code == 200
    data = response.json()
    assert "vitals" in data
    assert "today_medications" in data
    assert "activity_summary" in data


def test_today_medications_endpoint():
    response = client.get("/api/v1/medicines/today")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
