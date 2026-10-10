from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str = "Meera Patel"
    age: Optional[int] = 72
    role: str = "senior"  # senior, caregiver
    emergency_contact_name: Optional[str] = "Rahul (Son)"
    emergency_contact_phone: Optional[str] = "(555) 019-2834"
    preferred_language: Optional[str] = "en"  # en, hi, mr


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"


class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    age: Optional[int]
    role: str
    emergency_contact_name: Optional[str]
    emergency_contact_phone: Optional[str]
    preferred_language: str
    font_size_preference: float
    daily_step_goal: int
    daily_activity_goal_minutes: int
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = None
    role: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    preferred_language: Optional[str] = None
    font_size_preference: Optional[float] = None
    daily_step_goal: Optional[int] = None
    daily_activity_goal_minutes: Optional[int] = None


# Resolve forward references
TokenResponse.model_rebuild()
