from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database.base import Base


class MedicineLibrary(Base):
    __tablename__ = "medicine_library"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False, index=True)
    purpose = Column(String(255), nullable=True)  # e.g., "Blood Pressure", "Glucose Control"
    dosage = Column(String(100), nullable=False)   # e.g., "5 mg", "1 Tablet"
    form = Column(String(50), nullable=False, default="tablet")  # tablet, capsule, syrup, drops, injection
    instructions = Column(Text, nullable=True)     # e.g., "Take with a full glass of water after meals"
    doctor_name = Column(String(255), nullable=True, default="Dr. Sharma")
    refill_days_remaining = Column(Integer, nullable=True, default=30)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    user = relationship("User", back_populates="medicines")
    schedules = relationship("MedicineSchedule", back_populates="medicine", cascade="all, delete-orphan")


class MedicineSchedule(Base):
    __tablename__ = "medicine_schedules"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    medicine_id = Column(Integer, ForeignKey("medicine_library.id", ondelete="CASCADE"), nullable=False, index=True)
    time_of_day = Column(String(50), nullable=False, default="morning")  # morning, afternoon, evening, night, custom
    scheduled_time = Column(String(20), nullable=False, default="08:00")  # HH:MM format
    days_of_week = Column(String(100), nullable=False, default="mon,tue,wed,thu,fri,sat,sun")
    meal_relation = Column(String(100), nullable=True, default="after_food")  # before_food, after_food, with_food, none
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    user = relationship("User", back_populates="schedules")
    medicine = relationship("MedicineLibrary", back_populates="schedules")
    logs = relationship("MedicineLog", back_populates="schedule", cascade="all, delete-orphan")


class MedicineLog(Base):
    __tablename__ = "medicine_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    schedule_id = Column(Integer, ForeignKey("medicine_schedules.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String(50), nullable=False, default="pending")  # taken, skipped, pending
    scheduled_for = Column(DateTime, nullable=False, index=True)
    logged_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    notes = Column(Text, nullable=True)

    # Relationships
    user = relationship("User", back_populates="medicine_logs")
    schedule = relationship("MedicineSchedule", back_populates="logs")
