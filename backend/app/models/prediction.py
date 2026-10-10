from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.app.database.base import Base


class HealthPrediction(Base):
    __tablename__ = "health_predictions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    model_name = Column(String(100), nullable=False, default="xgboost")  # xgboost, random_forest, decision_tree, logistic_regression
    heart_rate_bpm = Column(Float, nullable=False)
    blood_oxygen_level = Column(Float, nullable=False)
    step_count = Column(Float, nullable=False)
    sleep_duration_hours = Column(Float, nullable=False)
    activity_level = Column(String(50), nullable=False)
    stress_level = Column(Float, nullable=False)
    prediction = Column(Integer, nullable=False)  # 0 (Low Risk) or 1 (Elevated Risk)
    label = Column(String(100), nullable=False)
    probability = Column(Float, nullable=False)
    health_risk_score = Column(Float, nullable=True)
    risk_tier = Column(String(50), nullable=True)  # Low, Moderate, Elevated, Critical
    risk_assessment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)

    # Relationships
    user = relationship("User", back_populates="predictions")
