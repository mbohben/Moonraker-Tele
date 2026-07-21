---
name: type-hints
description: Python type hints — modern syntax, Pydantic v2, generics, TypeVar, and validation patterns
title: "Python Type Hints & Validation"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: type, hints
---

# Python Type Hints & Validation

> Type all public APIs. Use Pydantic at boundaries. No `Any` in public signatures.

---

## Modern Type Syntax (Python 3.12+)

```python
# ✅ Modern — use built-in generics (no typing import needed)
def get_items() -> list[dict[str, int]]:
    ...

def find_user(user_id: int) -> User | None:  # Union syntax
    ...

def process(data: str | bytes) -> None:
    ...

# ❌ Legacy — avoid in new code
from typing import Optional, Union, List, Dict
def get_items() -> List[Dict[str, int]]:  # Old style
    ...
```

---

## Common Patterns

```python
from typing import TypeVar, Generic, Callable
from collections.abc import Sequence, Mapping

# TypeVar for generics
T = TypeVar("T")

def first(items: Sequence[T]) -> T | None:
    return items[0] if items else None

# Callable types
def apply(fn: Callable[[int], str], value: int) -> str:
    return fn(value)

# Generic class
class Repository(Generic[T]):
    def __init__(self, model: type[T]) -> None:
        self.model = model

    async def get(self, id: int) -> T | None:
        ...

    async def list(self, limit: int = 20) -> list[T]:
        ...
```

---

## Pydantic v2 Models

```python
from pydantic import BaseModel, Field, EmailStr, field_validator
from datetime import datetime

class UserCreate(BaseModel):
    """Input validation at API boundary."""
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    age: int = Field(ge=0, le=150)
    role: str = "user"

    @field_validator("name")
    @classmethod
    def name_must_not_be_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Name cannot be blank")
        return v.strip()

class UserResponse(BaseModel):
    """Output serialization — never expose internal fields."""
    id: int
    name: str
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}  # Enable ORM mode

class UserUpdate(BaseModel):
    """Partial update — all fields optional."""
    name: str | None = None
    email: EmailStr | None = None
    age: int | None = Field(default=None, ge=0, le=150)
```

### Pydantic Settings (Configuration)

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Load from environment variables automatically."""
    database_url: str
    redis_url: str = "redis://localhost:6379"
    secret_key: str
    debug: bool = False
    allowed_origins: list[str] = ["http://localhost:3000"]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}

settings = Settings()  # Auto-reads from .env + environment
```

---

## When to Type

| Scope | Rule |
|-------|------|
| Function parameters | Always |
| Return types | Always |
| Class attributes | Always |
| Local variables | Let inference work (skip) |
| Tests | Optional (usually skip) |
| Scripts | Minimal |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| `Any` in public APIs | Use specific types or `TypeVar` |
| `typing.Optional[X]` | `X \| None` (Python 3.10+) |
| `typing.List`, `typing.Dict` | `list`, `dict` (Python 3.9+) |
| Skip return type hints | Always annotate return types |
| Validate manually | Use Pydantic at boundaries |
| Hardcode config values | Use Pydantic Settings |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [fastapi-patterns.md](fastapi-patterns.md) | Pydantic with FastAPI |
| [testing-patterns.md](testing-patterns.md) | Testing typed code |
| [project-structure.md](project-structure.md) | Where to put models |

---

⚡ PikaKit v3.9.206
