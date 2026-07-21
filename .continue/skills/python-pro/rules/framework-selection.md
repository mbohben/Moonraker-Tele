---
name: framework-selection
description: Python framework comparison — FastAPI vs Django vs Flask with decision tree, benchmarks, and minimal app examples
title: "Framework Selection (2025)"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: framework, selection
---

# Framework Selection (2025)

> Pick the right tool. Don't default to one framework for everything.

---

## Decision Tree

```
What are you building?
│
├── API-first / Microservices   → FastAPI
├── Full-stack web / CMS        → Django
├── Simple / Script / Learning  → Flask
├── AI/ML API serving           → FastAPI
└── Background workers          → Celery + any framework
```

**If user has explicit preference → respect it.** Ask when unclear.

---

## Comparison

| Factor | FastAPI | Django | Flask |
|--------|---------|--------|-------|
| **Best for** | APIs, microservices, ML | Full-stack, CMS, admin | Simple, learning, prototyping |
| **Performance** | ⭐⭐⭐ (Starlette/uvicorn) | ⭐⭐ (improved in 5.x) | ⭐⭐ (Werkzeug) |
| **Async** | Native | Django 5.0+ (partial) | Via extensions (Quart) |
| **Admin** | Manual | Built-in (excellent) | Flask-Admin |
| **ORM** | SQLAlchemy / Tortoise | Django ORM (built-in) | SQLAlchemy |
| **Validation** | Pydantic (built-in) | Django Forms / DRF | Manual / Marshmallow |
| **Auth** | Manual / FastAPI-Users | Built-in | Flask-Login |
| **Learning curve** | Low | Medium | Low |
| **Type safety** | Excellent (Pydantic) | Good (mypy support) | Manual |
| **OpenAPI docs** | Auto-generated | DRF (drf-spectacular) | Flask-RESTX |

---

## Minimal App Examples

### FastAPI

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float
    in_stock: bool = True

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/items")
async def create_item(item: Item) -> Item:
    return item

# Run: uvicorn main:app --reload
```

### Django (with DRF)

```python
# views.py
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(["GET"])
def root(request):
    return Response({"message": "Hello World"})

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

# Run: python manage.py runserver
```

### Flask

```python
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.get("/")
def root():
    return jsonify(message="Hello World")

@app.post("/items")
def create_item():
    data = request.get_json()
    return jsonify(data), 201

# Run: flask run --debug
```

---

## pyproject.toml (Modern Python)

```toml
[project]
name = "myapp"
version = "0.1.0"
requires-python = ">=3.12"

dependencies = [
    # FastAPI stack
    "fastapi>=0.115",
    "uvicorn[standard]>=0.32",
    "pydantic>=2.0",
    # Or Django stack
    # "django>=5.1",
    # "djangorestframework>=3.15",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0",
    "pytest-asyncio>=0.24",
    "httpx>=0.27",
    "ruff>=0.8",
    "mypy>=1.13",
]
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Default to Django for simple APIs | Use FastAPI for API-first |
| Use Flask for complex apps | Use Django (batteries included) |
| Pick framework by popularity | Pick by project requirements |
| Skip framework when prototyping | Flask for quick prototypes |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [fastapi-patterns.md](fastapi-patterns.md) | Chosen FastAPI |
| [django-patterns.md](django-patterns.md) | Chosen Django |
| [project-structure.md](project-structure.md) | Directory layout |
| [async-patterns.md](async-patterns.md) | Async decision |

---

⚡ PikaKit v3.9.206
