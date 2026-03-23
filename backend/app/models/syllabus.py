"""SQLAlchemy models for uploaded syllabus content."""

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Syllabus(Base):
    """Stores one uploaded syllabus document and extracted metadata."""

    __tablename__ = "syllabi"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)
    source_filename = Column(String, nullable=False)
    source_filetype = Column(String, nullable=False)
    raw_text = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    topics = relationship(
        "SyllabusTopic",
        back_populates="syllabus",
        cascade="all, delete-orphan",
        lazy="selectin",
    )


class SyllabusTopic(Base):
    """Stores normalized subject/topic pairs extracted from one syllabus."""

    __tablename__ = "syllabus_topics"

    id = Column(Integer, primary_key=True, index=True)
    syllabus_id = Column(
        Integer,
        ForeignKey("syllabi.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    subject = Column(String, nullable=False, index=True)
    topic = Column(String, nullable=False, index=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    syllabus = relationship("Syllabus", back_populates="topics")
