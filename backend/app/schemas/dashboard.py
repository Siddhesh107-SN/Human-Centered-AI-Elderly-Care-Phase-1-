from typing import List, Optional
from pydantic import BaseModel
from backend.app.schemas.medicine import TodayScheduleItem
from backend.app.schemas.activity import DailyActivitySummary
from backend.app.schemas.prediction import PredictionResponse


class DashboardVitals(BaseModel):
    heart_rate_bpm: float = 72.0
    blood_pressure: str = "120/80"
    blood_oxygen_pct: float = 98.0
    temperature_f: float = 98.4
    last_synced_minutes_ago: int = 15
    status_label: str = "Good"


class DashboardAlertItem(BaseModel):
    id: str
    type: str  # medication, appointment, message, warning
    title: str
    description: str
    is_urgent: bool = False
    timestamp: Optional[str] = None


class DashboardSummary(BaseModel):
    user_name: str
    greeting: str
    role: str
    vitals: DashboardVitals
    today_medications: List[TodayScheduleItem]
    medications_taken_count: int
    medications_total_count: int
    activity_summary: DailyActivitySummary
    latest_prediction: Optional[PredictionResponse] = None
    alerts: List[DashboardAlertItem]
