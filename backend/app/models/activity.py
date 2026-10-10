from datetime import datetime, date, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.app.database.base import Base


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    activity_type = Column(String(100), nullable=False, default="walking")  # walking, light_exercise, stretching, gardening, other
    duration_minutes = Column(Integer, nullable=False, default=15)
    step_count = Column(Integer, nullable=True, default=0)
    calories_burned = Column(Float, nullable=True, default=0.0)
    is_automatic = Column(Boolean, nullable=False, default=False)
    recorded_date = Column(Date, nullable=False, default=lambda: datetime.now(timezone.utc).date(), index=True)
    recorded_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    notes = Column(Text, nullable=True)

    # Relationships
    user = relationship("User", back_populates="activities")
