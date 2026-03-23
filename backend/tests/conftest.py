import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Ensure imports like "from app..." resolve when running tests from repo root.
BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.core.database import Base, get_db
from app.main import create_app
from app.services.user_service import create_user


@pytest.fixture(scope="function")
def test_db():
    """Create a test database using SQLite."""
    # Use in-memory SQLite for tests with thread-safe connection
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=__import__("sqlalchemy.pool", fromlist=["StaticPool"]).StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app = create_app()
    app.dependency_overrides[get_db] = override_get_db
    yield TestingSessionLocal, app


@pytest.fixture
def client(test_db):
    """Create a test client with test database."""
    session_local, app = test_db
    return TestClient(app)


@pytest.fixture
def seed_users(test_db):
    """Seed test database with sample users."""
    session_local, _ = test_db
    db = session_local()

    user1 = create_user(
        db,
        username="user1",
        password="password123",
        email="user1@example.com",
    )

    user2 = create_user(
        db,
        username="user2",
        password="securepass456",
        email="user2@example.com",
    )

    db.close()
    return {"user1": user1, "user2": user2}
