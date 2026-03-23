"""Schemas for syllabus upload and retrieval."""

from datetime import datetime

from pydantic import BaseModel, Field


class SubjectTopics(BaseModel):
    """One subject with its extracted topic list."""

    name: str = Field(min_length=1)
    topics: list[str]


class SyllabusResponse(BaseModel):
    """Normalized syllabus response shape for frontend usage."""

    syllabus_id: int
    user_id: str
    source_filename: str
    source_filetype: str
    subjects: list[SubjectTopics]
    created_at: datetime


class SyllabusListResponse(BaseModel):
    """Response wrapper for listing user syllabi."""

    user_id: str
    syllabi: list[SyllabusResponse]
