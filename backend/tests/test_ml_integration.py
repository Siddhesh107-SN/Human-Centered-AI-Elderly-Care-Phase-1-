import pytest
import numpy as np
from backend.app.services.model_service import ModelService
from backend.app.services.prediction_service import PredictionService
from backend.app.schemas.prediction import HealthDataInput


@pytest.fixture(scope="module")
def model_service():
    ms = ModelService.get_instance()
    ms.load_artifacts()
    return ms


@pytest.fixture
def prediction_service(model_service):
    return PredictionService(model_service)


def test_model_service_loads_all_four_models(model_service):
    available = model_service.get_available_models()
    assert "xgboost" in available
    assert "random_forest" in available
    assert "decision_tree" in available
    assert "logistic_regression" in available
    assert model_service.encoder is not None
    assert model_service.scaler is not None


def test_xgboost_valid_inference(prediction_service):
    sample = HealthDataInput(
        heart_rate_bpm=72.0,
        blood_oxygen_level=98.0,
        step_count=3500.0,
        sleep_duration_hours=7.5,
        activity_level="active",
        stress_level=3.0,
    )
    result = prediction_service.predict_single(sample, model_name="xgboost")
    assert result.success is True
    assert result.model == "xgboost"
    assert result.prediction in (0, 1)
    assert result.label in ("Low Health Risk", "Elevated Health Risk")
    assert 0.0 <= result.probability <= 1.0
    assert 0.0 <= result.health_risk_score <= 100.0
    assert result.risk_tier in ("Low", "Moderate", "Elevated", "Critical")
    assert len(result.risk_assessment) > 10


def test_all_models_multi_prediction(prediction_service):
    sample = HealthDataInput(
        heart_rate_bpm=80.0,
        blood_oxygen_level=97.0,
        step_count=4200.0,
        sleep_duration_hours=6.5,
        activity_level="sedentary",
        stress_level=5.0,
    )
    all_res = prediction_service.predict_all(sample)
    assert all_res.success is True
    assert len(all_res.predictions) == 4
    for model_name in ["xgboost", "random_forest", "decision_tree", "logistic_regression"]:
        assert model_name in all_res.predictions
        pred_item = all_res.predictions[model_name]
        assert pred_item.prediction in (0, 1)


def test_invalid_biometric_bounds_rejected():
    with pytest.raises(ValueError):
        HealthDataInput(
            heart_rate_bpm=15.0,  # Below minimum biological bound (30 BPM)
            blood_oxygen_level=98.0,
            step_count=1000.0,
            sleep_duration_hours=7.0,
            activity_level="active",
            stress_level=2.0,
        )

    with pytest.raises(ValueError):
        HealthDataInput(
            heart_rate_bpm=75.0,
            blood_oxygen_level=120.0,  # Above maximum 100%
            step_count=1000.0,
            sleep_duration_hours=7.0,
            activity_level="active",
            stress_level=2.0,
        )


def test_explain_prediction_shap(prediction_service):
    sample = HealthDataInput(
        heart_rate_bpm=75.0,
        blood_oxygen_level=98.0,
        step_count=5000.0,
        sleep_duration_hours=7.0,
        activity_level="active",
        stress_level=4.0,
    )
    res = prediction_service.explain_prediction(sample, model_name="xgboost")
    assert res.model == "xgboost"
    assert len(res.explanation) == 6
