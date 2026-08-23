import os

os.environ.setdefault("JWT_SECRET_KEY", "test-secret-that-is-at-least-32-bytes")

from app import create_app
from app.extensions import db
from app.models import User


def make_app():
    return create_app(
        {
            "TESTING": True,
            "SQLALCHEMY_DATABASE_URI": "sqlite://",
            "JWT_SECRET_KEY": "test-secret-that-is-at-least-32-bytes",
            "CORS_ORIGINS": ["http://localhost:5173"],
        }
    )


def registration_payload():
    return {
        "fullName": "Test Student",
        "email": "student@example.com",
        "studentId": "ST-100",
        "course": "Computer Science",
        "year": "2",
        "password": "safe-password-123",
    }


def test_register_login_and_current_user():
    app = make_app()
    client = app.test_client()

    registered = client.post("/api/auth/register", json=registration_payload())
    assert registered.status_code == 201
    token = registered.get_json()["token"]

    with app.app_context():
        user = User.query.filter_by(email="student@example.com").one()
        assert user.password_hash != "safe-password-123"
        assert "safe-password-123" not in user.password_hash

    logged_in = client.post(
        "/api/auth/login",
        json={"email": "student@example.com", "password": "safe-password-123"},
    )
    assert logged_in.status_code == 200

    current = client.get(
        "/api/auth/me", headers={"Authorization": f"Bearer {token}"}
    )
    assert current.status_code == 200
    assert current.get_json()["studentId"] == "ST-100"

    with app.app_context():
        db.drop_all()


def test_user_state_is_private_and_persistent():
    app = make_app()
    client = app.test_client()
    token = client.post(
        "/api/auth/register", json=registration_payload()
    ).get_json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    state = {
        "xp": 125,
        "completedLessons": ["lesson-1"],
        "bookmarks": [{"kind": "lesson", "id": "lesson-1"}],
        "user": {"email": "must-not-be-stored-in-state@example.com"},
    }

    saved = client.put("/api/state", json=state, headers=headers)
    assert saved.status_code == 200

    loaded = client.get("/api/state", headers=headers)
    assert loaded.status_code == 200
    assert loaded.get_json()["xp"] == 125
    assert "user" not in loaded.get_json()

    anonymous = client.get("/api/state")
    assert anonymous.status_code == 401

    with app.app_context():
        db.drop_all()
