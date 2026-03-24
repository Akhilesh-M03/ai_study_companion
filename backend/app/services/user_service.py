"""User authentication service using SQLAlchemy."""

import secrets

from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.models import User


def _generate_student_id(db: Session) -> str:
    """Generate a non-sequential, human-readable student id."""

    while True:
        # 8 hex chars gives high enough entropy and stays readable.
        candidate = f"STU-{secrets.token_hex(4).upper()}"
        exists = db.query(User).filter(User.student_id == candidate).first()
        if not exists:
            return candidate


def get_user_by_username(db: Session, username: str) -> User | None:
    """Get user by username."""
    return db.query(User).filter(User.username == username).first()


def get_user_by_email(db: Session, email: str) -> User | None:
    """Get user by email."""
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int) -> User | None:
    """Get user by ID."""
    return db.query(User).filter(User.id == user_id).first()


def create_user(
    db: Session,
    username: str,
    password: str,
    email: str | None = None,
) -> User:
    """Create a new user."""
    hashed_password = hash_password(password)
    user = User(
        username=username,
        email=email,
        full_name=username.title(),
        hashed_password=hashed_password,
        disabled=False,
        student_id=_generate_student_id(db),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def ensure_user_student_id(db: Session, user: User) -> User:
    """Backfill a non-sequential student id for existing users if missing."""

    if user.student_id:
        return user

    user.student_id = _generate_student_id(db)
    db.commit()
    db.refresh(user)
    return user


def verify_user_password(user: User, password: str) -> bool:
    """Verify user password."""
    return verify_password(password, user.hashed_password)
