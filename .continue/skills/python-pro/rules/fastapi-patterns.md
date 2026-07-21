---
name: fastapi-patterns
description: FastAPI patterns — dependency injection, middleware, error handling, lifespan, and Pydantic integration
title: "Dependency injection for testability. Pydantic at boundaries. Async by default."
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: fastapi, patterns
---

# FastAPI Patterns

> Dependency injection for testability. Pydantic at boundaries. Async by default.

---

## Dependency Injection

```python
from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

app = FastAPI()

# Database session dependency
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()

# Current user dependency (reusable)
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    user = await user_service.get_by_token(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user

# Use in route — clean, testable
@app.get("/users/me")
async def get_me(user: User = Depends(get_current_user)) -> UserResponse:
    return UserResponse.model_validate(user)
```

---

## Router Organization

```python
# app/routes/users.py
from fastapi import APIRouter, Depends
from app.dependencies import get_db, get_current_user
from app.services.user_service import UserService
from app.schemas.user import UserCreate, UserResponse

router = APIRouter()

@router.post("/", status_code=201)
async def create_user(
    data: UserCreate,
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    service = UserService(db)
    user = await service.create(data)
    return UserResponse.model_validate(user)

@router.get("/{user_id}")
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    service = UserService(db)
    user = await service.get_or_404(user_id)
    return UserResponse.model_validate(user)
```

---

## Error Handling

```python
from fastapi import Request
from fastapi.responses import JSONResponse

# Custom domain exception
class AppError(Exception):
    def __init__(self, message: str, code: str, status_code: int = 400):
        self.message = message
        self.code = code
        self.status_code = status_code

class NotFoundError(AppError):
    def __init__(self, resource: str, id: int):
        super().__init__(f"{resource} {id} not found", "NOT_FOUND", 404)

# Register handler
@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.code, "message": exc.message},
    )

# Usage in service layer
class UserService:
    async def get_or_404(self, user_id: int) -> User:
        user = await self.repo.get(user_id)
        if not user:
            raise NotFoundError("User", user_id)
        return user
```

---

## Middleware

```python
import time
from fastapi import Request

@app.middleware("http")
async def add_timing_header(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    elapsed = time.perf_counter() - start
    response.headers["X-Process-Time"] = f"{elapsed:.3f}s"
    return response
```

---

## Lifespan (Startup/Shutdown)

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize resources
    app.state.db = await create_db_pool()
    app.state.redis = await create_redis_pool()
    yield
    # Shutdown: cleanup
    await app.state.db.close()
    await app.state.redis.close()

app = FastAPI(lifespan=lifespan)
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Business logic in routes | Delegate to service layer |
| Catch all exceptions silently | Use domain exceptions + handlers |
| `@app.on_event("startup")` | Use `lifespan` context manager |
| Skip Depends for DB sessions | Always use DI for testability |
| Return raw dict | Return Pydantic model |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [type-hints.md](type-hints.md) | Pydantic models |
| [async-patterns.md](async-patterns.md) | Async decisions |
| [project-structure.md](project-structure.md) | Directory layout |
| [testing-patterns.md](testing-patterns.md) | Testing FastAPI |

---

⚡ PikaKit v3.9.206
