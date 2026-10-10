from typing import Optional, List
from datetime import datetime, date
from pydantic import BaseModel, ConfigDict


class MedicineCreate(BaseModel):
    name: str
    purpose: Optional[str] = None
    dosage: str
    form: str = "tablet"
    instructions: Optional[str] = None
    doctor_name: Optional[str] = "Dr. Sharma"
    refill_days_remaining: Optional[int] = 30


class MedicineUpdate(BaseModel):
    name: Optional[str] = None
    purpose: Optional[str] = None
    dosage: Optional[str] = None
    form: Optional[str] = None
    instructions: Optional[str] = None
    doctor_name: Optional[str] = None
    refill_days_remaining: Optional[int] = None


class MedicineOut(BaseModel):
    id: int
    user_id: int
    name: str
    purpose: Optional[str]
    dosage: str
    form: str
    instructions: Optional[str]
    doctor_name: Optional[str]
    refill_days_remaining: Optional[int]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ScheduleCreate(BaseModel):
    medicine_id: int
    time_of_day: str = "morning"  # morning, afternoon, evening, night, custom
    scheduled_time: str = "08:00"
    days_of_week: str = "mon,tue,wed,thu,fri,sat,sun"
    meal_relation: Optional[str] = "after_food"
    start_date: date
    end_date: Optional[date] = None


class ScheduleUpdate(BaseModel):
    time_of_day: Optional[str] = None
    scheduled_time: Optional[str] = None
    days_of_week: Optional[str] = None
    meal_relation: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_active: Optional[bool] = None


class ScheduleOut(BaseModel):
    id: int
    user_id: int
    medicine_id: int
    time_of_day: str
    scheduled_time: str
    days_of_week: str
    meal_relation: Optional[str]
    start_date: date
    end_date: Optional[date]
    is_active: bool
    created_at: datetime
    medicine: Optional[MedicineOut] = None

    model_config = ConfigDict(from_attributes=True)


class MedicineLogCreate(BaseModel):
    schedule_id: int
    status: str = "taken"  # taken, skipped, pending
    scheduled_for: datetime
    notes: Optional[str] = None


class MedicineLogOut(BaseModel):
    id: int
    user_id: int
    schedule_id: int
    status: str
    scheduled_for: datetime
    logged_at: datetime
    notes: Optional[str]

    model_config = ConfigDict(from_attributes=True)


class TodayScheduleItem(BaseModel):
    schedule_id: int
    medicine_id: int
    medicine_name: str
    purpose: Optional[str]
    dosage: str
    time_of_day: str
    scheduled_time: str
    meal_relation: Optional[str]
    instructions: Optional[str]
    status: str  # taken, skipped, pending
    log_id: Optional[int] = None
