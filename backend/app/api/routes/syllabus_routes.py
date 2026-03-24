"""Routes for syllabus upload, extraction, and retrieval."""

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.schemas.auth import TokenData
from app.schemas.syllabus import SyllabusListResponse, SyllabusResponse
from app.services.syllabus_service import (
    get_latest_user_syllabus,
    get_user_topics,
    list_user_syllabi,
    parse_upload_to_outline,
    save_syllabus,
)


class AvailableTopicsResponse(BaseModel):
    """Response with unique topics from user's latest syllabus."""

    user_id: str
    has_syllabus: bool
    topics: list[str]
    subjects: list[str]


router = APIRouter()


def _validate_user_scope(requested_user_id: str, current_user: TokenData) -> str:
    clean_user_id = requested_user_id.strip()
    if not clean_user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="user_id cannot be empty",
        )

    if current_user.username != clean_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access syllabus for this user_id",
        )

    return clean_user_id


@router.post("/syllabus/upload", response_model=SyllabusResponse)
async def upload_syllabus(
    user_id: str = Form(...),
    file: UploadFile = File(...),
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Upload syllabus document, extract subjects/topics, and persist them."""

    clean_user_id = _validate_user_scope(user_id, current_user)

    outline, raw_text, source_filetype = await parse_upload_to_outline(file)
    return save_syllabus(
        db,
        user_id=clean_user_id,
        source_filename=file.filename or "uploaded_file",
        source_filetype=source_filetype,
        raw_text=raw_text,
        outline=outline,
    )


@router.get("/syllabus/{user_id}/latest", response_model=SyllabusResponse)
async def get_latest_syllabus(
    user_id: str,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return the newest syllabus for a given user."""

    clean_user_id = _validate_user_scope(user_id, current_user)

    syllabus = get_latest_user_syllabus(db, clean_user_id)
    if not syllabus:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No syllabus found for this user",
        )

    return syllabus


@router.get("/syllabus/{user_id}", response_model=SyllabusListResponse)
async def get_user_syllabi(
    user_id: str,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return all uploaded syllabi for a given user."""

    clean_user_id = _validate_user_scope(user_id, current_user)

    return SyllabusListResponse(
        user_id=clean_user_id,
        syllabi=list_user_syllabi(db, clean_user_id),
    )


@router.get("/syllabus/{user_id}/topics", response_model=AvailableTopicsResponse)
async def get_available_topics(
    user_id: str,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return unique topics and subjects from user's latest syllabus for quiz generation."""

    clean_user_id = _validate_user_scope(user_id, current_user)

    topics, subjects = get_user_topics(db, clean_user_id)
    return AvailableTopicsResponse(
        user_id=clean_user_id,
        has_syllabus=bool(topics),
        topics=topics,
        subjects=subjects,
    )
