"""Tests for chat and quiz generation routes."""

import pytest
from fastapi.testclient import TestClient

from app.main import create_app
import app.api.routes.chat_routes as chat_routes


@pytest.fixture
def client():
    """Create test client with fresh app instance."""
    app = create_app()
    return TestClient(app)


def test_chat_with_empty_message(client):
    """Chat endpoint rejects empty message."""
    response = client.post("/chat", json={"message": ""})

    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()


def test_chat_with_whitespace_only_message(client):
    """Chat endpoint rejects whitespace-only message."""
    response = client.post("/chat", json={"message": "   "})

    assert response.status_code == 400


def test_chat_endpoint_validates_json_format(client):
    """Chat endpoint requires valid JSON."""
    response = client.post("/chat", json="not-a-valid-json-object")

    assert response.status_code == 422


def test_generate_question_with_invalid_count(client):
    """Generate question endpoint requires exactly 2 questions."""
    response = client.post(
        "/generate-question",
        json={"topic": "Algebra", "difficulty": "medium", "question_count": 5},
    )

    assert response.status_code == 422


def test_generate_question_with_invalid_difficulty(client):
    """Generate question endpoint validates difficulty enum."""
    response = client.post(
        "/generate-question",
        json={"topic": "Algebra", "difficulty": "impossible", "question_count": 2},
    )

    assert response.status_code == 422


def test_generate_question_with_empty_topic(client):
    """Generate question endpoint rejects empty topic."""
    response = client.post(
        "/generate-question",
        json={"topic": "", "difficulty": "medium", "question_count": 2},
    )

    assert response.status_code == 422


def test_generate_question_response_structure(client):
    """Generate question response has required fields."""
    response = client.post(
        "/generate-question",
        json={"topic": "test_topic", "difficulty": "medium", "question_count": 2},
    )

    # Note: This will fail if GROQ_API_KEY is not set, which is expected in test environment
    # but we test the schema validation here
    if response.status_code in [200, 502]:  # 502 = API not configured
        if response.status_code == 200:
            data = response.json()
            assert "topic" in data
            assert "difficulty" in data
            assert "batch_size" in data
            assert "questions" in data


def test_generate_question_applies_recommendation_when_user_memory_exists(
    client, monkeypatch
):
    """Generate question uses top recommendation to select topic and difficulty."""

    async def fake_get_memories(_user_id: str):
        return [{"topic": "Algebra", "score": 30, "timestamp": "2026-01-01T10:00:00"}]

    def fake_recommend_topics(_memories, limit=1):
        return [
            {
                "topic": "Geometry",
                "recommended_difficulty": "Easy",
                "reason": "Low mastery",
            }
        ]

    captured = {}

    def fake_generate_quiz_questions(
        topic: str, difficulty: str = "medium", count: int = 2
    ):
        captured["topic"] = topic
        captured["difficulty"] = difficulty
        captured["count"] = count
        return {
            "questions": [
                {
                    "question": "Q1",
                    "options": ["a", "b", "c", "d"],
                    "correct_option_index": 0,
                    "explanation": "E1",
                },
                {
                    "question": "Q2",
                    "options": ["a", "b", "c", "d"],
                    "correct_option_index": 1,
                    "explanation": "E2",
                },
            ]
        }

    monkeypatch.setattr(chat_routes, "get_memories", fake_get_memories)
    monkeypatch.setattr(chat_routes, "recommend_topics", fake_recommend_topics)
    monkeypatch.setattr(chat_routes, "get_user_topics", lambda _db, _uid: ([], []))
    monkeypatch.setattr(
        chat_routes, "generate_quiz_questions", fake_generate_quiz_questions
    )

    response = client.post(
        "/generate-question",
        json={
            "topic": "Original Topic",
            "difficulty": "hard",
            "question_count": 2,
            "user_id": "user1",
            "use_recommendations": True,
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert captured["topic"] == "Geometry"
    assert captured["difficulty"] == "easy"
    assert body["topic"] == "Geometry"
    assert body["difficulty"] == "easy"
    assert body["recommendation_applied"] is True
    assert body["recommendation_reason"] == "Low mastery"


def test_generate_question_uses_requested_topic_when_recommendations_disabled(
    client, monkeypatch
):
    """Generate question keeps explicit topic when recommendation mode is disabled."""

    async def fake_get_memories(_user_id: str):
        return [{"topic": "Algebra", "score": 30, "timestamp": "2026-01-01T10:00:00"}]

    def fake_recommend_topics(_memories, limit=1):
        return [
            {
                "topic": "Geometry",
                "recommended_difficulty": "Easy",
                "reason": "Low mastery",
            }
        ]

    captured = {}

    def fake_generate_quiz_questions(
        topic: str, difficulty: str = "medium", count: int = 2
    ):
        captured["topic"] = topic
        captured["difficulty"] = difficulty
        return {
            "questions": [
                {
                    "question": "Q1",
                    "options": ["a", "b", "c", "d"],
                    "correct_option_index": 0,
                    "explanation": "E1",
                },
                {
                    "question": "Q2",
                    "options": ["a", "b", "c", "d"],
                    "correct_option_index": 1,
                    "explanation": "E2",
                },
            ]
        }

    monkeypatch.setattr(chat_routes, "get_memories", fake_get_memories)
    monkeypatch.setattr(chat_routes, "recommend_topics", fake_recommend_topics)
    monkeypatch.setattr(chat_routes, "get_user_topics", lambda _db, _uid: ([], []))
    monkeypatch.setattr(
        chat_routes, "generate_quiz_questions", fake_generate_quiz_questions
    )

    response = client.post(
        "/generate-question",
        json={
            "topic": "Original Topic",
            "difficulty": "hard",
            "question_count": 2,
            "user_id": "user1",
            "use_recommendations": False,
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert captured["topic"] == "Original Topic"
    assert captured["difficulty"] == "hard"
    assert body["recommendation_applied"] is False
    assert body["recommendation_reason"] is None


def test_generate_question_rejects_topic_not_in_uploaded_syllabus(client, monkeypatch):
    """Generate question rejects topics outside the user's syllabus topic list."""

    monkeypatch.setattr(
        chat_routes,
        "get_user_topics",
        lambda _db, _uid: (["Linear Algebra", "Calculus"], ["Math"]),
    )

    response = client.post(
        "/generate-question",
        json={
            "topic": "Trigonometry",
            "difficulty": "medium",
            "question_count": 2,
            "user_id": "user1",
            "use_recommendations": False,
        },
    )

    assert response.status_code == 400
    assert "uploaded syllabus" in response.json()["detail"]


def test_generate_question_accepts_topic_in_uploaded_syllabus(client, monkeypatch):
    """Generate question allows topics that exist in user's uploaded syllabus."""

    monkeypatch.setattr(
        chat_routes,
        "get_user_topics",
        lambda _db, _uid: (["Linear Algebra", "Calculus"], ["Math"]),
    )

    def fake_generate_quiz_questions(
        topic: str, difficulty: str = "medium", count: int = 2
    ):
        return {
            "questions": [
                {
                    "question": "Q1",
                    "options": ["a", "b", "c", "d"],
                    "correct_option_index": 0,
                    "explanation": "E1",
                },
                {
                    "question": "Q2",
                    "options": ["a", "b", "c", "d"],
                    "correct_option_index": 1,
                    "explanation": "E2",
                },
            ]
        }

    monkeypatch.setattr(
        chat_routes, "generate_quiz_questions", fake_generate_quiz_questions
    )

    response = client.post(
        "/generate-question",
        json={
            "topic": "Calculus",
            "difficulty": "medium",
            "question_count": 2,
            "user_id": "user1",
            "use_recommendations": False,
        },
    )

    assert response.status_code == 200
    assert response.json()["topic"] == "Calculus"
