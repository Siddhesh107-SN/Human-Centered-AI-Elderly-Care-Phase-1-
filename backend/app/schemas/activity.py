from typing import Optional, List
from datetime import datetime, date
from pydantic import BaseModel, ConfigDict


class ActivityCreate(BaseModel):
    activity_type: str = "walking"  # walking, light_exercise, stretching, gardening, other
    duration_minutes: int
    step_count: Optional[int] = 0
    calories_burned: Optional[float] = 0.0
    is_automatic: Optional[bool] = False
    recorded_date: Optional[date] = None
    notes: Optional[str] = None


class ActivityOut(BaseModel):
    id: int
    user_id: int
    activity_type: str
    duration_minutes: int
    step_count: Optional[int]
    calories_burned: Optional[float]
    is_automatic: bool
    recorded_date: date
    recorded_at: datetime
    notes: Optional[str]

    model_config = ConfigDict(from_attributes=True)


class DailyActivitySummary(BaseModel):
    date: date
    total_minutes: int
    total_steps: int
    goal_steps: int
    goal_minutes: int
    step_progress_pct: float
    minute_progress_pct: float
    encouragement_message: str
    status: str  # reached_goal, improved, moderate, light, none
    activities: List[ActivityOut]


class WeeklyActivitySummary(BaseModel):
    days: List[DailyActivitySummary]
    weekly_total_minutes: int
    weekly_total_steps: int
    average_daily_steps: float
    overall_encouragement: str
