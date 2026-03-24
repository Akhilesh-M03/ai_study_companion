"""Authentication-related request and response schemas."""

from typing import Optional

from pydantic import BaseModel


class Token(BaseModel):
    """JWT login response."""

    access_token: str
    token_type: str


class TokenData(BaseModel):
    """Decoded JWT payload content."""

    username: Optional[str] = None


class LoginRequest(BaseModel):
    """JSON login request body."""

    username: str
    password: str


class UserCreate(BaseModel):
    """User registration request body."""

    username: str
    email: Optional[str] = None
    password: str


class UserResponse(BaseModel):
    """Public user profile response."""

    username: str
    email: str
    full_name: Optional[str] = None
    disabled: bool = False
    student_id: Optional[str] = None
    daily_study_hours: int = 1
    dsa_problems_per_day: int = 5
    revision_minutes_per_day: int = 30
    weekly_streak: int = 0
    quizzes_completed: int = 0


class UpdateProfileRequest(BaseModel):
    """User profile update request."""

    email: Optional[str] = None
    full_name: Optional[str] = None
    daily_study_hours: Optional[int] = None
    dsa_problems_per_day: Optional[int] = None
    revision_minutes_per_day: Optional[int] = None
    weekly_streak: Optional[int] = None
    quizzes_completed: Optional[int] = None
