"""Tests for syllabus upload and retrieval routes."""

from datetime import datetime, timezone

import app.api.routes.syllabus_routes as syllabus_routes


def _auth_headers(client, username: str, password: str) -> dict[str, str]:
    login_response = client.post(
        "/login", json={"username": username, "password": password}
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def _sample_syllabus(user_id: str) -> dict:
    return {
        "syllabus_id": 1,
        "user_id": user_id,
        "source_filename": "syllabus.pdf",
        "source_filetype": "pdf",
        "subjects": [
            {"name": "Math", "topics": ["Calculus", "Linear Algebra"]},
            {"name": "CS", "topics": ["Data Structures"]},
        ],
        "created_at": datetime.now(timezone.utc).isoformat(),
    }


def test_upload_syllabus_requires_auth(client, seed_users):
    """Syllabus upload rejects unauthenticated requests."""

    response = client.post(
        "/syllabus/upload",
        data={"user_id": "user1"},
        files={"file": ("sample.pdf", b"dummy", "application/pdf")},
    )

    assert response.status_code == 401


def test_upload_syllabus_rejects_cross_user_access(client, seed_users):
    """Syllabus upload rejects token user mismatch with form user_id."""

    response = client.post(
        "/syllabus/upload",
        headers=_auth_headers(client, "user1", "password123"),
        data={"user_id": "user2"},
        files={"file": ("sample.pdf", b"dummy", "application/pdf")},
    )

    assert response.status_code == 403


def test_upload_syllabus_success(client, seed_users, monkeypatch):
    """Syllabus upload accepts valid authenticated request."""

    async def fake_parse_upload_to_outline(_file):
        return (
            [{"name": "Math", "topics": ["Calculus", "Linear Algebra"]}],
            "raw text",
            "pdf",
        )

    monkeypatch.setattr(
        syllabus_routes, "parse_upload_to_outline", fake_parse_upload_to_outline
    )
    monkeypatch.setattr(
        syllabus_routes,
        "save_syllabus",
        lambda _db, **kwargs: {
            **_sample_syllabus(kwargs["user_id"]),
            "source_filename": kwargs["source_filename"],
            "source_filetype": kwargs["source_filetype"],
            "subjects": kwargs["outline"],
        },
    )

    response = client.post(
        "/syllabus/upload",
        headers=_auth_headers(client, "user1", "password123"),
        data={"user_id": "user1"},
        files={"file": ("sample.pdf", b"dummy", "application/pdf")},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["user_id"] == "user1"
    assert body["source_filetype"] == "pdf"


def test_syllabus_topics_requires_matching_user(client, seed_users):
    """Topics endpoint rejects token user mismatch."""

    response = client.get(
        "/syllabus/user2/topics", headers=_auth_headers(client, "user1", "password123")
    )

    assert response.status_code == 403


def test_syllabus_topics_success(client, seed_users, monkeypatch):
    """Topics endpoint returns latest syllabus topic list for authenticated user."""

    monkeypatch.setattr(
        syllabus_routes,
        "get_user_topics",
        lambda _db, _uid: (["Calculus", "Data Structures"], ["Math", "CS"]),
    )

    response = client.get(
        "/syllabus/user1/topics", headers=_auth_headers(client, "user1", "password123")
    )

    assert response.status_code == 200
    body = response.json()
    assert body["user_id"] == "user1"
    assert body["has_syllabus"] is True
    assert body["topics"] == ["Calculus", "Data Structures"]
    assert body["subjects"] == ["Math", "CS"]


def test_syllabus_latest_success(client, seed_users, monkeypatch):
    """Latest endpoint returns syllabus for authenticated owner."""

    monkeypatch.setattr(
        syllabus_routes,
        "get_latest_user_syllabus",
        lambda _db, uid: _sample_syllabus(uid),
    )

    response = client.get(
        "/syllabus/user1/latest", headers=_auth_headers(client, "user1", "password123")
    )

    assert response.status_code == 200
    assert response.json()["user_id"] == "user1"


def test_syllabus_list_success(client, seed_users, monkeypatch):
    """List endpoint returns syllabus list for authenticated owner."""

    monkeypatch.setattr(
        syllabus_routes,
        "list_user_syllabi",
        lambda _db, uid: [_sample_syllabus(uid)],
    )

    response = client.get(
        "/syllabus/user1", headers=_auth_headers(client, "user1", "password123")
    )

    assert response.status_code == 200
    body = response.json()
    assert body["user_id"] == "user1"
    assert len(body["syllabi"]) == 1
