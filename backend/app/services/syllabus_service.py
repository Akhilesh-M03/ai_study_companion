"""Syllabus parsing and persistence utilities."""

from collections import defaultdict
from io import BytesIO
import re

from docx import Document
from fastapi import HTTPException, UploadFile, status
from pypdf import PdfReader
from sqlalchemy.orm import Session, selectinload

from app.models.syllabus import Syllabus, SyllabusTopic
from app.schemas.syllabus import SubjectTopics, SyllabusResponse
from app.services.llm_service import extract_subject_topic_outline

SUPPORTED_EXTENSIONS = {".pdf", ".docx", ".txt"}
MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024


def _file_extension(filename: str) -> str:
    """Return lowercase file extension including dot."""

    if not filename or "." not in filename:
        return ""
    return "." + filename.rsplit(".", 1)[-1].lower()


def _extract_text_from_pdf(content: bytes) -> str:
    """Extract raw text from PDF bytes."""

    reader = PdfReader(BytesIO(content))
    extracted = []
    for page in reader.pages:
        page_text = page.extract_text() or ""
        if page_text.strip():
            extracted.append(page_text)
    return "\n".join(extracted).strip()


def _extract_text_from_docx(content: bytes) -> str:
    """Extract raw text from DOCX bytes."""

    document = Document(BytesIO(content))
    parts = [
        paragraph.text.strip()
        for paragraph in document.paragraphs
        if paragraph.text and paragraph.text.strip()
    ]
    return "\n".join(parts).strip()


def _extract_text_from_txt(content: bytes) -> str:
    """Extract text from plain text file bytes."""

    return content.decode("utf-8", errors="ignore").strip()


def _normalize_whitespace(text: str) -> str:
    """Collapse repeated blank lines and strip noisy spacing."""

    text = re.sub(r"\r\n?", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def extract_text_from_upload(filename: str, content: bytes) -> tuple[str, str]:
    """Extract text from supported file payload and return text + extension."""

    extension = _file_extension(filename)
    if extension not in SUPPORTED_EXTENSIONS:
        supported = ", ".join(sorted(SUPPORTED_EXTENSIONS))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type. Use one of: {supported}",
        )

    if extension == ".pdf":
        text = _extract_text_from_pdf(content)
    elif extension == ".docx":
        text = _extract_text_from_docx(content)
    else:
        text = _extract_text_from_txt(content)

    text = _normalize_whitespace(text)
    if not text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract text from file",
        )

    return text, extension


def _fallback_outline(text: str) -> dict:
    """Build a best-effort outline when LLM extraction fails."""

    lines = [line.strip() for line in text.split("\n") if line.strip()]
    if not lines:
        return {"subjects": []}

    current_subject = "General"
    subjects: dict[str, list[str]] = defaultdict(list)

    for line in lines[:200]:
        header_match = re.match(
            r"^(?:unit|module|chapter)\s*\d*[:\-.]?\s*(.+)$", line, flags=re.IGNORECASE
        )
        if line.endswith(":") and len(line) <= 80:
            current_subject = line[:-1].strip() or current_subject
            continue
        if header_match:
            possible_subject = header_match.group(1).strip()
            if possible_subject:
                current_subject = possible_subject
            continue

        bullet_match = re.match(r"^(?:[-*]\s+|\d+[.)]\s+)(.+)$", line)
        if bullet_match:
            topic = bullet_match.group(1).strip()
        else:
            topic = line

        if len(topic) > 2 and topic.lower() != current_subject.lower():
            subjects[current_subject].append(topic)

    normalized_subjects = []
    for subject, topics in subjects.items():
        deduped = []
        seen = set()
        for topic in topics:
            key = topic.lower()
            if key in seen:
                continue
            seen.add(key)
            deduped.append(topic)
        if deduped:
            normalized_subjects.append({"name": subject, "topics": deduped[:30]})

    if not normalized_subjects:
        return {
            "subjects": [
                {
                    "name": "General",
                    "topics": lines[:15],
                }
            ]
        }

    return {"subjects": normalized_subjects[:12]}


async def parse_upload_to_outline(upload_file: UploadFile) -> tuple[dict, str, str]:
    """Parse uploaded file into subject/topic outline plus metadata."""

    content = await upload_file.read()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty",
        )
    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File too large. Maximum size is 5MB",
        )

    text, extension = extract_text_from_upload(upload_file.filename or "", content)

    try:
        outline = extract_subject_topic_outline(text)
    except Exception:
        outline = _fallback_outline(text)

    if not outline.get("subjects"):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Could not extract subjects/topics from the file",
        )

    return outline, text, extension


def _to_response(model: Syllabus) -> SyllabusResponse:
    """Convert ORM model to API schema."""

    grouped: dict[str, list[str]] = defaultdict(list)
    for row in sorted(
        model.topics, key=lambda item: (item.subject.lower(), item.topic.lower())
    ):
        grouped[row.subject].append(row.topic)

    subjects = [
        SubjectTopics(name=subject, topics=topics)
        for subject, topics in grouped.items()
    ]

    return SyllabusResponse(
        syllabus_id=model.id,
        user_id=model.user_id,
        source_filename=model.source_filename,
        source_filetype=model.source_filetype,
        subjects=subjects,
        created_at=model.created_at,
    )


def save_syllabus(
    db: Session,
    *,
    user_id: str,
    source_filename: str,
    source_filetype: str,
    raw_text: str,
    outline: dict,
) -> SyllabusResponse:
    """Persist one extracted syllabus and return normalized response."""

    syllabus = Syllabus(
        user_id=user_id,
        source_filename=source_filename,
        source_filetype=source_filetype,
        raw_text=raw_text,
    )
    db.add(syllabus)
    db.flush()

    for subject in outline.get("subjects", []):
        subject_name = (subject.get("name") or "").strip()
        if not subject_name:
            continue
        for topic in subject.get("topics", []):
            topic_name = (topic or "").strip()
            if not topic_name:
                continue
            db.add(
                SyllabusTopic(
                    syllabus_id=syllabus.id,
                    subject=subject_name,
                    topic=topic_name,
                )
            )

    db.commit()

    refreshed = (
        db.query(Syllabus)
        .options(selectinload(Syllabus.topics))
        .filter(Syllabus.id == syllabus.id)
        .first()
    )
    if not refreshed:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Syllabus saved but failed to reload",
        )

    return _to_response(refreshed)


def get_latest_user_syllabus(db: Session, user_id: str) -> SyllabusResponse | None:
    """Fetch latest uploaded syllabus for a user."""

    syllabus = (
        db.query(Syllabus)
        .options(selectinload(Syllabus.topics))
        .filter(Syllabus.user_id == user_id)
        .order_by(Syllabus.created_at.desc(), Syllabus.id.desc())
        .first()
    )
    if not syllabus:
        return None

    return _to_response(syllabus)


def list_user_syllabi(db: Session, user_id: str) -> list[SyllabusResponse]:
    """List all uploaded syllabi for a user, newest first."""

    syllabi = (
        db.query(Syllabus)
        .options(selectinload(Syllabus.topics))
        .filter(Syllabus.user_id == user_id)
        .order_by(Syllabus.created_at.desc(), Syllabus.id.desc())
        .all()
    )
    return [_to_response(item) for item in syllabi]


def get_user_topics(db: Session, user_id: str) -> tuple[list[str], list[str]]:
    """Get all unique topics and subjects from user's latest syllabus.

    Returns tuple of (topics, subjects) or ([], []) if no syllabus found.
    """

    syllabi = (
        db.query(Syllabus)
        .options(selectinload(Syllabus.topics))
        .filter(Syllabus.user_id == user_id)
        .order_by(Syllabus.created_at.desc(), Syllabus.id.desc())
        .first()
    )
    if not syllabi or not syllabi.topics:
        return [], []

    topics_set = set()
    subjects_set = set()
    for topic_row in syllabi.topics:
        topics_set.add(topic_row.topic)
        subjects_set.add(topic_row.subject)

    return sorted(list(topics_set)), sorted(list(subjects_set))
