"""SQLAlchemy User model for authentication."""

from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, String, Integer
from sqlalchemy.sql import func

from app.core.database import Base


class User(Base):
    """User model for database storage."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    disabled = Column(Boolean, default=False)
    student_id = Column(String, unique=True, index=True, nullable=True)
    daily_study_hours = Column(Integer, default=1, nullable=False)
    dsa_problems_per_day = Column(Integer, default=5, nullable=False)
    revision_minutes_per_day = Column(Integer, default=30, nullable=False)
    weekly_streak = Column(Integer, default=0, nullable=False)
    quizzes_completed = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    def dict(self):
        """Convert model to dictionary for compatibility with auth logic."""
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email or "",
            "full_name": self.full_name,
            "hashed_password": self.hashed_password,
            "disabled": self.disabled,
            "student_id": self.student_id,
            "daily_study_hours": self.daily_study_hours,
            "dsa_problems_per_day": self.dsa_problems_per_day,
            "revision_minutes_per_day": self.revision_minutes_per_day,
            "weekly_streak": self.weekly_streak,
            "quizzes_completed": self.quizzes_completed,
            "created_at": self.created_at,
        }
