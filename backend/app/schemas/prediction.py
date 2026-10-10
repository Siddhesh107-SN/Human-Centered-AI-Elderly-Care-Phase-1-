from enum import Enum
from typing import Any, Dict, List, Optional, Union
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, field_validator


class ModelNameEnum(str, Enum):
    LOGISTIC_REGRESSION = "logistic_regression"
    DECISION_TREE = "decision_tree"
    RANDOM_FOREST = "random_forest"
    XGBOOST = "xgboost"


class ActivityLevelEnum(str, Enum):
    SEDENTARY = "sedentary"
    ACTIVE = "active"
    HIGHLY_ACTIVE = "highly active"


class HealthDataInput(BaseModel):
    """
    Validated input biometric schema for SmartHealth physiological health risk prediction.
    Accepts standard snake_case and dataset alias keys.
    """
    heart_rate_bpm: float = Field(
        ...,
        alias="Heart Rate (BPM)",
        ge=30.0,
        le=250.0,
        description="Heart rate in beats per minute (BPM). Realistic range: 30-250.",
        json_schema_extra={"example": 75.0},
    )
    blood_oxygen_level: float = Field(
        ...,
        alias="Blood Oxygen Level (%)",
        ge=50.0,
        le=100.0,
        description="Blood oxygen saturation percentage (SpO2). Realistic range: 50-100%.",
        json_schema_extra={"example": 98.0},
    )
    step_count: float = Field(
        ...,
        alias="Step Count",
        ge=0.0,
        le=150000.0,
        description="Daily step count. Range: 0-150,000.",
        json_schema_extra={"example": 5000.0},
    )
    sleep_duration_hours: float = Field(
        ...,
        alias="Sleep Duration (hours)",
        ge=0.0,
        le=24.0,
        description="Sleep duration in hours. Range: 0-24.",
        json_schema_extra={"example": 7.0},
    )
    activity_level: Union[str, int, float] = Field(
        ...,
        alias="Activity Level",
        description="Activity level category ('sedentary', 'active', 'highly active' or numeric 0, 1, 2).",
        json_schema_extra={"example": "active"},
    )
    stress_level: float = Field(
        ...,
        alias="Stress Level",
        ge=0.0,
        le=10.0,
        description="Subjective or sensor-calculated stress level score on a scale of 0 to 10 as a contributing biomarker.",
        json_schema_extra={"example": 4.0},
    )

    model_config = ConfigDict(
        populate_by_name=True,
        extra="ignore",
        json_schema_extra={
            "example": {
                "Heart Rate (BPM)": 75.0,
                "Blood Oxygen Level (%)": 98.0,
                "Step Count": 5000.0,
                "Sleep Duration (hours)": 7.0,
                "Activity Level": "active",
                "Stress Level": 4.0,
            }
        },
    )

    @field_validator("activity_level", mode="before")
    @classmethod
    def validate_activity_level(cls, v: Any) -> Union[str, int, float]:
        if isinstance(v, (int, float)):
            if int(v) not in (0, 1, 2):
                raise ValueError("Numeric activity level must be 0 (sedentary), 1 (active), or 2 (highly active).")
            return v
        if isinstance(v, str):
            cleaned = v.strip().lower().replace("_", " ")
            typos = {"actve": "active", "seddentary": "sedentary", "highlyactive": "highly active"}
            cleaned = typos.get(cleaned, cleaned)
            if cleaned not in ("sedentary", "active", "highly active"):
                raise ValueError(
                    f"Invalid activity level: '{v}'. Must be one of: 'sedentary', 'active', 'highly active' or 0, 1, 2."
                )
            return cleaned
        raise ValueError("Activity level must be a string or integer/float.")

    def to_raw_dict(self) -> Dict[str, Any]:
        return {
            "Heart Rate (BPM)": self.heart_rate_bpm,
            "Blood Oxygen Level (%)": self.blood_oxygen_level,
            "Step Count": self.step_count,
            "Sleep Duration (hours)": self.sleep_duration_hours,
            "Activity Level": self.activity_level,
            "Stress Level": self.stress_level,
        }


class PredictionResponse(BaseModel):
    success: bool = True
    model: str
    prediction: int = Field(..., description="0 for Low Health Risk, 1 for Elevated Health Risk")
    label: str
    probability: float
    health_risk_score: Optional[float] = None
    risk_tier: Optional[str] = None
    risk_assessment: Optional[str] = None
    probabilities: Optional[Dict[str, float]] = None
    id: Optional[int] = None
    created_at: Optional[datetime] = None


class ModelPredictionDetail(BaseModel):
    prediction: int
    label: Optional[str] = None
    probability: float
    health_risk_score: Optional[float] = None
    risk_tier: Optional[str] = None


class AllModelsPredictionResponse(BaseModel):
    success: bool = True
    predictions: Dict[str, ModelPredictionDetail]


class FeatureExplanation(BaseModel):
    feature: str
    value: float
    shap_value: float
    impact: str


class ExplanationResponse(BaseModel):
    model: str
    prediction: int
    label: str
    base_value: Optional[float] = None
    explanation: List[FeatureExplanation]


class PredictionHistoryItem(BaseModel):
    id: int
    model_name: str
    heart_rate_bpm: float
    blood_oxygen_level: float
    step_count: float
    sleep_duration_hours: float
    activity_level: str
    stress_level: float
    prediction: int
    label: str
    probability: float
    health_risk_score: Optional[float]
    risk_tier: Optional[str]
    risk_assessment: Optional[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
