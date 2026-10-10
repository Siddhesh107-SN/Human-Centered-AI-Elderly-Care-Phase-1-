from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.api.deps import get_db, get_current_user
from backend.app.models.user import User
from backend.app.models.prediction import HealthPrediction
from backend.app.schemas.prediction import (
    HealthDataInput,
    PredictionResponse,
    AllModelsPredictionResponse,
    ExplanationResponse,
    PredictionHistoryItem,
)
from backend.app.services.prediction_service import PredictionService

router = APIRouter()


@router.post("/stress", response_model=PredictionResponse, summary="Predict Physiological Stress & Health Risk")
def predict_stress_risk(
    payload: HealthDataInput,
    model: str = Query("xgboost", description="ML Model name (xgboost, random_forest, decision_tree, logistic_regression)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = PredictionService()
    try:
        user_id_val = getattr(current_user, "id", 1) if current_user else 1
        result = service.predict_single(
            input_data=payload,
            model_name=model,
            db=db,
            user_id=user_id_val,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error: {str(e)}",
        )


@router.post("/all", response_model=AllModelsPredictionResponse, summary="Run All ML Models Simultaneously")
def predict_all_models(
    payload: HealthDataInput,
):
    service = PredictionService()
    try:
        return service.predict_all(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Multi-model inference failed: {str(e)}")


@router.post("/explain", response_model=ExplanationResponse, summary="SHAP Local Feature Explanation")
def explain_health_prediction(
    payload: HealthDataInput,
    model: str = Query("xgboost"),
):
    service = PredictionService()
    try:
        return service.explain_prediction(payload, model_name=model)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SHAP explanation failed: {str(e)}")


@router.get("/history", response_model=List[PredictionHistoryItem], summary="Get Past Prediction History")
def get_prediction_history(
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        records = (
            db.query(HealthPrediction)
            .filter(HealthPrediction.user_id == current_user.id)
            .order_by(HealthPrediction.created_at.desc())
            .limit(limit)
            .all()
        )
        return records
    except Exception:
        return []
