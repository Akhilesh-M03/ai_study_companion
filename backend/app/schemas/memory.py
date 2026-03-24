"""Memory and insights schemas."""

from typing import Literal, Optional

from pydantic import BaseModel, Field, field_validator


class BatchMemoryItem(BaseModel):
    """Single quiz attempt record for batch memory storage."""

    topic: str = Field(min_length=1)
    mistake_type: Literal["Correct", "Conceptual", "Calculation", "Careless"]
    difficulty: Literal["Easy", "Medium", "Hard"]
    score: int = Field(ge=0, le=100)
    question_id: Optional[str] = None
    subtopic: Optional[str] = None
    confidence: Optional[int] = Field(default=None, ge=1, le=5)
    time_spent_seconds: Optional[int] = Field(default=None, ge=0)
    source: Optional[Literal["quiz", "chat", "flashcard"]] = None
    session_id: Optional[str] = None
    user_answer: Optional[str] = None
    correct_answer: Optional[str] = None


class StoreMemoryRequest(BaseModel):
    """Single quiz attempt record with optional learning signals."""

    user_id: str = Field(min_length=1)
    topic: str = Field(min_length=1)
    mistake_type: Literal["Correct", "Conceptual", "Calculation", "Careless"]
    difficulty: Literal["Easy", "Medium", "Hard"]
    score: int = Field(ge=0, le=100)
    question_id: Optional[str] = None
    subtopic: Optional[str] = None
    confidence: Optional[int] = Field(default=None, ge=1, le=5)
    time_spent_seconds: Optional[int] = Field(default=None, ge=0)
    source: Optional[Literal["quiz", "chat", "flashcard"]] = None
    session_id: Optional[str] = None
    user_answer: Optional[str] = None
    correct_answer: Optional[str] = None


class StoreMemoryBatchRequest(BaseModel):
    """Batch memory request with exactly two quiz attempts."""

    user_id: str = Field(min_length=1)
    attempts: list[BatchMemoryItem]

    @field_validator("attempts")
    @classmethod
    def validate_attempt_count(
        cls, value: list[BatchMemoryItem]
    ) -> list[BatchMemoryItem]:
        if len(value) != 2:
            raise ValueError("Exactly 2 attempts are required")
        return value
