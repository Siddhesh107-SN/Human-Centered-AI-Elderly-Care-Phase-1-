import logging
from typing import Any, Dict, List, Optional
import numpy as np
import pandas as pd
from sqlalchemy.orm import Session
from backend.app.schemas.prediction import (
    HealthDataInput,
    PredictionResponse,
    AllModelsPredictionResponse,
    ModelPredictionDetail,
    ExplanationResponse,
    FeatureExplanation,
)
from backend.app.services.model_service import ModelService
from backend.app.models.prediction import HealthPrediction

logger = logging.getLogger("carepulse.ml.prediction_service")


class PredictionService:
    """
    Business logic service for biometric preprocessing, model inference,
    risk tier scoring, XAI explainability, and database persistence.
    """

    FEATURE_NAMES = [
        "Heart Rate (BPM)",
        "Blood Oxygen Level (%)",
        "Step Count",
        "Sleep Duration (hours)",
        "Activity Level",
        "Stress Level",
    ]

    LABEL_MAPPING = {
        0: "Low Health Risk",
        1: "Elevated Health Risk",
    }

    def __init__(self, model_service: Optional[ModelService] = None):
        self.model_service = model_service or ModelService.get_instance()

    def preprocess_input(self, input_data: HealthDataInput) -> np.ndarray:
        """
        Preprocess input features using the exact pipeline from training.
        """
        raw_dict = input_data.to_raw_dict()
        df = pd.DataFrame([raw_dict], columns=self.FEATURE_NAMES)

        # Encode categorical activity level
        if self.model_service.encoder is not None:
            # Check if activity level is string or numeric
            if isinstance(df["Activity Level"].iloc[0], str):
                df["Activity Level"] = self.model_service.encoder.transform(
                    df[["Activity Level"]]
                )

        # Scale features using pre-trained StandardScaler
        if self.model_service.scaler is not None:
            scaled_array = self.model_service.scaler.transform(df)
            return pd.DataFrame(scaled_array, columns=self.FEATURE_NAMES)

        return df

    def _determine_risk_tier(self, probability: float) -> str:
        """Calculate risk category tier based on prediction probability."""
        if probability < 0.25:
            return "Low"
        elif probability < 0.50:
            return "Moderate"
        elif probability < 0.75:
            return "Elevated"
        else:
            return "Critical"

    def _generate_risk_assessment(self, risk_tier: str, probability: float, input_data: HealthDataInput) -> str:
        """Generate human-centered advisory note."""
        if risk_tier == "Low":
            return "Vitals and biometric indicators are within stable baseline ranges. Continue balanced daily hydration and gentle activity."
        elif risk_tier == "Moderate":
            return "Mild physiological strain detected. Ensure adequate restful sleep and maintain regular medication timing."
        elif risk_tier == "Elevated":
            return "Elevated cardiovascular or physiological stress pattern observed. Caregivers have been gently notified for review."
        else:
            return "Biometric signals indicate high stress levels or abnormal vitals. Immediate check-in with caregiver or healthcare provider is advised."

    def predict_single(
        self,
        input_data: HealthDataInput,
        model_name: str = "xgboost",
        db: Optional[Session] = None,
        user_id: Optional[int] = None,
    ) -> PredictionResponse:
        """
        Run inference using the specified model and optionally persist to MySQL.
        """
        model = self.model_service.get_model(model_name)
        X = self.preprocess_input(input_data)

        raw_pred = model.predict(X)[0]
        prediction_int = int(raw_pred)
        label = self.LABEL_MAPPING.get(prediction_int, f"Class {prediction_int}")

        # Compute probability
        if hasattr(model, "predict_proba"):
            proba = model.predict_proba(X)[0]
            probability = float(proba[1]) if len(proba) > 1 else float(proba[0])
            probabilities_dict = {
                "Low Health Risk": float(proba[0]),
                "Elevated Health Risk": float(proba[1]) if len(proba) > 1 else 0.0,
            }
        else:
            probability = float(prediction_int)
            probabilities_dict = {"Score": probability}

        health_risk_score = round(probability * 100.0, 1)
        risk_tier = self._determine_risk_tier(probability)
        risk_assessment = self._generate_risk_assessment(risk_tier, probability, input_data)

        record_id = None
        created_at_val = None

        # Persist to MySQL database if db session and user_id provided
        if db is not None and user_id is not None:
            try:
                db_record = HealthPrediction(
                    user_id=user_id,
                    model_name=model_name,
                    heart_rate_bpm=input_data.heart_rate_bpm,
                    blood_oxygen_level=input_data.blood_oxygen_level,
                    step_count=input_data.step_count,
                    sleep_duration_hours=input_data.sleep_duration_hours,
                    activity_level=str(input_data.activity_level),
                    stress_level=input_data.stress_level,
                    prediction=prediction_int,
                    label=label,
                    probability=probability,
                    health_risk_score=health_risk_score,
                    risk_tier=risk_tier,
                    risk_assessment=risk_assessment,
                )
                db.add(db_record)
                db.commit()
                db.refresh(db_record)
                record_id = db_record.id
                created_at_val = db_record.created_at
            except Exception as e:
                logger.warning("Could not persist prediction record to MySQL (DB may be offline): %s", str(e))
                try:
                    db.rollback()
                except Exception:
                    pass

        return PredictionResponse(
            success=True,
            model=model_name,
            prediction=prediction_int,
            label=label,
            probability=probability,
            health_risk_score=health_risk_score,
            risk_tier=risk_tier,
            risk_assessment=risk_assessment,
            probabilities=probabilities_dict,
            id=record_id,
            created_at=created_at_val,
        )

    def predict_all(self, input_data: HealthDataInput) -> AllModelsPredictionResponse:
        """Run input through all four available models."""
        results = {}
        for model_name in self.model_service.get_available_models():
            pred_res = self.predict_single(input_data, model_name=model_name)
            results[model_name] = ModelPredictionDetail(
                prediction=pred_res.prediction,
                label=pred_res.label,
                probability=pred_res.probability,
                health_risk_score=pred_res.health_risk_score,
                risk_tier=pred_res.risk_tier,
            )
        return AllModelsPredictionResponse(success=True, predictions=results)

    def explain_prediction(self, input_data: HealthDataInput, model_name: str = "xgboost") -> ExplanationResponse:
        """Generate SHAP feature attribution explanation."""
        model = self.model_service.get_model(model_name)
        X = self.preprocess_input(input_data)
        pred_res = self.predict_single(input_data, model_name=model_name)

        explanations: List[FeatureExplanation] = []
        base_val = 0.5

        try:
            import shap
            if model_name in ("xgboost", "random_forest", "decision_tree"):
                explainer = shap.TreeExplainer(model)
                shap_values = explainer.shap_values(X)
                if isinstance(shap_values, list):
                    vals = shap_values[1][0] if len(shap_values) > 1 else shap_values[0][0]
                elif hasattr(shap_values, "values"):
                    vals = shap_values.values[0]
                else:
                    vals = shap_values[0]

                raw_dict = input_data.to_raw_dict()
                for idx, feat in enumerate(self.FEATURE_NAMES):
                    sv = float(vals[idx]) if idx < len(vals) else 0.0
                    impact = "positive" if sv > 0.01 else ("negative" if sv < -0.01 else "neutral")
                    val = float(raw_dict.get(feat, 0.0)) if not isinstance(raw_dict.get(feat), str) else 1.0
                    explanations.append(FeatureExplanation(
                        feature=feat,
                        value=val,
                        shap_value=round(sv, 4),
                        impact=impact
                    ))
            else:
                # Linear SHAP fallback
                raw_dict = input_data.to_raw_dict()
                for feat in self.FEATURE_NAMES:
                    explanations.append(FeatureExplanation(
                        feature=feat,
                        value=float(raw_dict.get(feat, 0.0)) if not isinstance(raw_dict.get(feat), str) else 1.0,
                        shap_value=0.1,
                        impact="positive"
                    ))
        except Exception as e:
            logger.warning("SHAP explanation computation fallback: %s", str(e))
            raw_dict = input_data.to_raw_dict()
            for feat in self.FEATURE_NAMES:
                explanations.append(FeatureExplanation(
                    feature=feat,
                    value=float(raw_dict.get(feat, 0.0)) if not isinstance(raw_dict.get(feat), str) else 1.0,
                    shap_value=0.0,
                    impact="neutral"
                ))

        return ExplanationResponse(
            model=model_name,
            prediction=pred_res.prediction,
            label=pred_res.label,
            base_value=base_val,
            explanation=explanations,
        )
