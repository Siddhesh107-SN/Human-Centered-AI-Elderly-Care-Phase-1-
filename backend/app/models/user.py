from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.orm import relationship
from backend.app.database.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False, default="Senior User")
    age = Column(Integer, nullable=True, default=70)
    role = Column(String(50), nullable=False, default="senior")  # senior, caregiver, family
    emergency_contact_name = Column(String(255), nullable=True, default="Rahul (Son)")
    emergency_contact_phone = Column(String(50), nullable=True, default="(555) 019-2834")
    preferred_language = Column(String(10), nullable=False, default="en")  # en, hi, mr
    font_size_preference = Column(Float, nullable=False, default=1.0)  # 1.0, 1.15, 1.3
    daily_step_goal = Column(Integer, nullable=False, default=2000)
    daily_activity_goal_minutes = Column(Integer, nullable=False, default=30)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    medicines = relationship("MedicineLibrary", back_populates="user", cascade="all, delete-orphan")
    schedules = relationship("MedicineSchedule", back_populates="user", cascade="all, delete-orphan")
    medicine_logs = relationship("MedicineLog", back_populates="user", cascade="all, delete-orphan")
    activities = relationship("ActivityLog", back_populates="user", cascade="all, delete-orphan")
    predictions = relationship("HealthPrediction", back_populates="user", cascade="all, delete-orphan")
