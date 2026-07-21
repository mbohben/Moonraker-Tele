---
name: testing-patterns
description: Python testing patterns — pytest, async tests, fixtures, mocking, FastAPI/Django test clients, coverage
title: "Python Testing Patterns"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: testing, patterns
---

# Python Testing Patterns

> pytest for everything. Fixtures for setup. Mock at boundaries. Test behavior, not implementation.

---

## Testing Strategy

| Type | Purpose | Tools | Speed |
|------|---------|-------|:-----:|
| **Unit** | Business logic / services | pytest | ⚡ Fast |
| **Integration** | API endpoints + DB | pytest + httpx/TestClient | 🔄 Medium |
| **E2E** | Full workflows | pytest + real DB | 🐢 Slow |

---

## FastAPI Testing

```python
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.dependencies import get_db

# Override database dependency for tests
async def get_test_db():
    async with test_session_maker() as session:
        yield session

app.dependency_overrides[get_db] = get_test_db

@pytest.mark.asyncio
async def test_create_user():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post("/api/v1/users/", json={
            "email": "test@example.com",
            "name": "Test User",
        })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data

@pytest.mark.asyncio
async def test_get_user_not_found():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/users/99999")
    assert response.status_code == 404
    assert response.json()["error"] == "NOT_FOUND"
```

---

## Django Testing

```python
from django.test import TestCase
from rest_framework.test import APIClient

class UserAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="test@test.com", password="testpass123"
        )

    def test_list_users(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/users/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_create_user_unauthenticated(self):
        response = self.client.post("/api/users/", {"email": "new@test.com"})
        self.assertEqual(response.status_code, 401)
```

---

## Fixtures (conftest.py)

```python
# tests/conftest.py
import pytest
from app.models import User

@pytest.fixture
def sample_user(db) -> User:
    """Create a test user — available to all tests."""
    return User.objects.create(
        email="fixture@test.com",
        name="Fixture User",
    )

@pytest.fixture
def auth_client(sample_user) -> APIClient:
    """Authenticated API client."""
    client = APIClient()
    client.force_authenticate(user=sample_user)
    return client

@pytest.fixture
async def async_client() -> AsyncClient:
    """Async client for FastAPI."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client
```

---

## Mocking

```python
from unittest.mock import AsyncMock, patch

@pytest.mark.asyncio
async def test_send_email_on_signup():
    """Mock external services at boundaries."""
    with patch("app.services.email.send_welcome_email", new_callable=AsyncMock) as mock_email:
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            await client.post("/api/v1/users/", json={
                "email": "new@test.com",
                "name": "New User",
            })

        mock_email.assert_called_once_with("new@test.com", "New User")

@pytest.mark.asyncio
async def test_external_api_failure():
    """Test error handling when external service fails."""
    with patch("app.services.payment.charge", side_effect=Exception("Payment failed")):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/v1/orders/", json={"amount": 100})
        assert response.status_code == 500
```

---

## Test Configuration

```toml
# pyproject.toml
[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]
python_files = "test_*.py"
python_functions = "test_*"
addopts = "-v --tb=short --strict-markers"
markers = [
    "slow: marks tests as slow",
    "integration: marks integration tests",
]

[tool.coverage.run]
source = ["app"]
omit = ["tests/*", "*/migrations/*"]

[tool.coverage.report]
fail_under = 80
show_missing = true
```

```bash
# Run tests
pytest                          # All tests
pytest -x                       # Stop on first failure
pytest -k "test_user"           # Filter by name
pytest --cov=app --cov-report=html  # With coverage
pytest -m "not slow"            # Skip slow tests
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Test implementation details | Test behavior (inputs → outputs) |
| Mock everything | Mock only boundaries (DB, APIs, email) |
| Share state between tests | Each test is independent |
| Skip error path tests | Test both success AND failure |
| Ignore coverage | Aim for ≥80% with `fail_under` |
| Use `print()` for debugging | Use `pytest --pdb` or `breakpoint()` |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [fastapi-patterns.md](fastapi-patterns.md) | FastAPI patterns |
| [django-patterns.md](django-patterns.md) | Django patterns |
| [async-patterns.md](async-patterns.md) | Testing async code |
| [type-hints.md](type-hints.md) | Typed test fixtures |

---

⚡ PikaKit v3.9.206
