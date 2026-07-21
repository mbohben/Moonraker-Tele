---
name: async-patterns
description: Python async patterns — asyncio, gather, TaskGroup, run_in_executor, and async library selection
title: "Python Async Patterns"
impact: CRITICAL
impactDescription: "Significant performance or security impact"
tags: async, patterns
---

# Python Async Patterns

> I/O-bound → async. CPU-bound → sync + multiprocessing. Never mix carelessly.

---

## When to Use

| Workload | Decision | Example |
|----------|----------|---------|
| I/O-bound | `async def` | DB queries, HTTP calls, file I/O |
| CPU-bound | `def` + multiprocessing | ML inference, image processing |
| Mixed | Async + `run_in_executor` | Web scraping + parsing |

---

## Core Patterns

### Basic Async Function

```python
import asyncio
import httpx

async def fetch_user(user_id: int) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://api.example.com/users/{user_id}")
        response.raise_for_status()
        return response.json()
```

### Concurrent Execution (asyncio.gather)

```python
async def fetch_all_users(user_ids: list[int]) -> list[dict]:
    """Fetch multiple users concurrently — much faster than sequential."""
    async with httpx.AsyncClient() as client:
        tasks = [
            client.get(f"https://api.example.com/users/{uid}")
            for uid in user_ids
        ]
        responses = await asyncio.gather(*tasks, return_exceptions=True)

    results = []
    for resp in responses:
        if isinstance(resp, Exception):
            continue  # Skip failed requests
        results.append(resp.json())
    return results
```

### TaskGroup (Python 3.11+, preferred)

```python
async def fetch_all_users_v2(user_ids: list[int]) -> list[dict]:
    """TaskGroup: structured concurrency with automatic cancellation on failure."""
    results: list[dict] = []

    async with asyncio.TaskGroup() as tg:
        async def fetch_one(uid: int):
            async with httpx.AsyncClient() as client:
                resp = await client.get(f"https://api.example.com/users/{uid}")
                results.append(resp.json())

        for uid in user_ids:
            tg.create_task(fetch_one(uid))

    return results
```

### CPU-Bound Offload (run_in_executor)

```python
import asyncio
from concurrent.futures import ProcessPoolExecutor

# CPU-heavy work runs in separate process
def compute_hash(data: bytes) -> str:
    import hashlib
    return hashlib.sha256(data).hexdigest()

async def process_file(file_path: str) -> str:
    """Offload CPU work to avoid blocking the event loop."""
    loop = asyncio.get_event_loop()
    data = await asyncio.to_thread(open(file_path, 'rb').read)

    with ProcessPoolExecutor() as pool:
        result = await loop.run_in_executor(pool, compute_hash, data)
    return result
```

---

## Async Library Selection

| Need | Sync Library | Async Library |
|------|-------------|---------------|
| HTTP client | requests | **httpx** |
| PostgreSQL | psycopg2 | **asyncpg** / psycopg3 async |
| MySQL | mysql-connector | **aiomysql** |
| Redis | redis-py (sync) | **redis-py** (async mode) / aioredis |
| File I/O | open() | **aiofiles** |
| ORM | SQLAlchemy sync | **SQLAlchemy 2.0** async / **Tortoise** |
| MongoDB | pymongo | **motor** |
| WebSockets | — | **websockets** |

---

## FastAPI: async def vs def

```python
from fastapi import FastAPI

app = FastAPI()

# ✅ Use async def — for I/O-bound with async drivers
@app.get("/users/{user_id}")
async def get_user(user_id: int):
    user = await db.fetch_one("SELECT * FROM users WHERE id = $1", user_id)
    return user

# ✅ Use def — for sync operations (FastAPI runs in threadpool automatically)
@app.get("/report")
def generate_report():
    # This blocks, but FastAPI handles it in a thread
    return create_pdf_report()

# ❌ Don't — use sync DB driver in async def (blocks event loop!)
@app.get("/bad")
async def bad_example():
    user = db.execute("SELECT ...")  # BLOCKS the entire event loop!
    return user
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Use `requests` in async code | Use `httpx` (async) |
| `await` CPU-bound functions | Use `run_in_executor` |
| Sync DB driver in `async def` | Use async driver or `def` |
| `time.sleep()` in async | `await asyncio.sleep()` |
| Create event loop inside async | Use `asyncio.get_event_loop()` |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [fastapi-patterns.md](fastapi-patterns.md) | FastAPI async specifics |
| [framework-selection.md](framework-selection.md) | Framework decision |
| [testing-patterns.md](testing-patterns.md) | Testing async code |

---

⚡ PikaKit v3.9.206
