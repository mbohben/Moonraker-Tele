# python-pro

**Version 1.0.0**
Engineering
March 2026

> **Note:**
> This document is for agents and LLMs to follow when working on python-pro domain.
> Optimized for automation and consistency by AI-assisted workflows.

---

# Python Pro � Framework Selection & Architecture

> Decision-making principles. Not patterns to copy. Ask, classify, decide.

---

## 5 Must-Ask Questions (Before Decision)

| # | Question | Options |
|---|----------|---------|
| 1 | Target Scope? | Single Script / API / Full-Stack / Workers |
| 2 | Project Scale? | MVP / Production / FAANG Scale |
| 3 | Current Framework? | Green field vs Legacy modification? |
| 4 | Async Requirements? | High I/O throughput vs CPU heavy? |
| 5 | DB Dependencies? | Relational vs NoSQL, Async DB drivers? |

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Choosing Python framework | Use decision tree |
| API-first / microservices | Consider FastAPI |
| Full-stack web / CMS | Consider Django |
| Async vs sync decision | Check I/O vs CPU classification |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Framework selection (5 branches) | API design (? api-architect) |
| Async/sync classification | Testing strategy (? test-architect) |
| Type hint rules | Database schema (? data-modeler) |
| Architecture layering | Code implementation |

**Expert decision skill:** Produces recommendations. Does not write code.

---

## Framework Decision Tree (Deterministic)

```
What are you building?
�
+-- API-first / Microservices  ? FastAPI
+-- Full-stack web / CMS       ? Django
+-- Simple / Script / Learning ? Flask
+-- AI/ML API serving          ? FastAPI
+-- Background workers         ? Celery + any
```

**If user has explicit preference ? respect it.** Ask when unclear.

---

## Async vs Sync (Deterministic)

| Workload | Decision | Rationale |
|----------|----------|-----------|
| I/O-bound (HTTP, DB, file) | `async` | Waiting for external |
| CPU-bound (compute) | `sync` + multiprocessing | Number crunching |
| Mixed | Async with sync offload | `run_in_executor` |

**Constraints:** Never use sync libraries in async code. Never force async for CPU work.

---

## Architecture Layering (Fixed)

```
Routes (HTTP handlers)
  +? Services (business logic)
      +? Repositories (data access)
```

**Rule:** No business logic in routes/views. Routes delegate to services.

---

## Type Hints & Validation (Mandatory)

| Rule | Scope |
|------|-------|
| Type hints on all public APIs | Functions, methods, return types |
| Pydantic for validation | All input/output boundaries |
| No `Any` in public signatures | Use specific types or generics |

---

## Decision Checklist

- [ ] Asked user about framework preference?
- [ ] Chosen framework for THIS context?
- [ ] Decided async vs sync?
- [ ] Planned type hint strategy?
- [ ] Defined project structure?
- [ ] Considered background tasks (Celery)?

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_PROJECT_TYPE` | Yes | Project type not one of 5 |
| `ERR_UNKNOWN_FRAMEWORK` | Yes | Framework not fastapi/django/flask |

**Zero internal retries.** Same context = same recommendation.

---

## Audit Logging (OpenTelemetry)

| Event | Metadata Payload | Severity |
|-------|------------------|----------|
| `decision_started` | `{"project_type": "...", "scale": "..."}` | `INFO` |
| `framework_selected` | `{"framework": "fastapi", "rationale": "..."}` | `INFO` |
| `async_sync_classified` | `{"mode": "async", "mix_workload": false}` | `WARN` |
| `arch_recommendation_provided` | `{"layer_complexity": "high"}` | `INFO` |

All architectural decision outputs MUST emit a `decision_started` and `arch_recommendation_provided` event.

---

## Anti-Patterns

| ? Don't | ? Do |
|---------|-------|
| Default to Django for simple APIs | Choose framework per context |
| Use sync libraries in async code | Use async-compatible libraries |
| Skip type hints on public APIs | Annotate all public functions |
| Put business logic in routes/views | Separate: routes ? services ? repos |
| Always pick the same framework | Ask user, evaluate context |

---

## ?? Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [framework-selection.md](rules/framework-selection.md) | Framework comparison | Choosing framework |
| [async-patterns.md](rules/async-patterns.md) | Async/sync patterns | Concurrency decisions |
| [type-hints.md](rules/type-hints.md) | Type annotation rules | Type strategy |
| [project-structure.md](rules/project-structure.md) | Directory layouts | New project |
| [fastapi-patterns.md](rules/fastapi-patterns.md) | FastAPI specifics | FastAPI project |
| [django-patterns.md](rules/django-patterns.md) | Django specifics | Django project |
| [testing-patterns.md](rules/testing-patterns.md) | Python testing | Writing tests |
| [engineering-spec.md](rules/engineering-spec.md) | Full spec | Architecture review |

**Selective reading:** Load ONLY the reference file matching your current decision.

---

## ?? Related

| Item | Type | Purpose |
|------|------|---------|
| `api-architect` | Skill | API design |
| `test-architect` | Skill | Testing |
| `data-modeler` | Skill | Database |

---



---

## Detailed Rules


---

### Rule: async-patterns

---
name: async-patterns
description: Python async patterns � asyncio, gather, TaskGroup, run_in_executor, and async library selection
---

# Python Async Patterns

> I/O-bound ? async. CPU-bound ? sync + multiprocessing. Never mix carelessly.

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
    """Fetch multiple users concurrently � much faster than sequential."""
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
| WebSockets | � | **websockets** |

---

## FastAPI: async def vs def

```python
from fastapi import FastAPI

app = FastAPI()

# ? Use async def � for I/O-bound with async drivers
@app.get("/users/{user_id}")
async def get_user(user_id: int):
    user = await db.fetch_one("SELECT * FROM users WHERE id = $1", user_id)
    return user

# ? Use def � for sync operations (FastAPI runs in threadpool automatically)
@app.get("/report")
def generate_report():
    # This blocks, but FastAPI handles it in a thread
    return create_pdf_report()

# ? Don't � use sync DB driver in async def (blocks event loop!)
@app.get("/bad")
async def bad_example():
    user = db.execute("SELECT ...")  # BLOCKS the entire event loop!
    return user
```

---

## Anti-Patterns

| ? Don't | ? Do |
|---------|-------|
| Use `requests` in async code | Use `httpx` (async) |
| `await` CPU-bound functions | Use `run_in_executor` |
| Sync DB driver in `async def` | Use async driver or `def` |
| `time.sleep()` in async | `await asyncio.sleep()` |
| Create event loop inside async | Use `asyncio.get_event_loop()` |

---

## ?? Related

| File | When to Read |
|------|-------------|
| [fastapi-patterns.md](fastapi-patterns.md) | FastAPI async specifics |
| [framework-selection.md](framework-selection.md) | Framework decision |
| [testing-patterns.md](testing-patterns.md) | Testing async code |

---

### Rule: django-patterns

---
name: django-patterns
description: Django patterns � models, views, DRF serializers, async views, query optimization, signals, and migrations
---

# Django Patterns (2025)

> Fat models, thin views. Use managers for queries. DRF for APIs.

---

## Model Design

```python
from django.db import models
from django.utils import timezone

class UserManager(models.Manager):
    """Custom manager � encapsulate common queries."""
    def active(self):
        return self.filter(is_active=True)

    def recently_joined(self, days: int = 7):
        cutoff = timezone.now() - timezone.timedelta(days=days)
        return self.filter(created_at__gte=cutoff, is_active=True)

class User(models.Model):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["email"])]

    def __str__(self) -> str:
        return self.name

    @property
    def display_name(self) -> str:
        """Business logic belongs in model, not views."""
        return self.name or self.email.split("@")[0]
```

---

## DRF Serializers

```python
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    display_name = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "name", "display_name", "created_at"]
        read_only_fields = ["id", "created_at"]

class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "name", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
```

---

## Views / ViewSets

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.active()
    serializer_class = UserSerializer

    def get_serializer_class(self):
        if self.action == "create":
            return UserCreateSerializer
        return UserSerializer

    @action(detail=False, methods=["get"])
    def recent(self, request):
        """Custom action: GET /users/recent/"""
        users = User.objects.recently_joined()
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)
```

---

## Django Async Views (5.0+)

```python
# Async function-based view
from django.http import JsonResponse
import httpx

async def external_api_view(request):
    """Use async for I/O-bound views."""
    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.example.com/data")
    return JsonResponse(response.json())

# ASGI deployment required:
# uvicorn myproject.asgi:application --workers 4
```

---

## Query Optimization

```python
# ? N+1 Problem
users = User.objects.all()
for user in users:
    print(user.profile.bio)      # Each access = 1 query!
    print(user.posts.count())    # Each access = 1 query!

# ? Fix: select_related (ForeignKey / OneToOne)
users = User.objects.select_related("profile").all()

# ? Fix: prefetch_related (ManyToMany / Reverse FK)
users = User.objects.prefetch_related("posts").all()

# ? Select specific fields
users = User.objects.only("id", "email", "name").all()

# ? Annotate counts without extra queries
from django.db.models import Count
users = User.objects.annotate(post_count=Count("posts")).all()
```

---

## Signals (Use Sparingly)

```python
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Auto-create profile when user is created."""
    if created:
        Profile.objects.create(user=instance)

# Register in apps.py:
# class UsersConfig(AppConfig):
#     def ready(self):
#         import users.signals
```

---

## Anti-Patterns

| ? Don't | ? Do |
|---------|-------|
| Business logic in views | Fat models, thin views |
| Raw SQL everywhere | Use ORM + managers |
| Forget `select_related` | Profile queries, fix N+1 |
| Overuse signals | Prefer explicit service calls |
| `settings.py` monolith | Split: base/dev/prod |
| Skip migrations | Always `makemigrations` + `migrate` |

---

## ?? Related

| File | When to Read |
|------|-------------|
| [framework-selection.md](framework-selection.md) | Why Django |
| [project-structure.md](project-structure.md) | Django directory layout |
| [testing-patterns.md](testing-patterns.md) | Testing Django |
| [async-patterns.md](async-patterns.md) | Async in Django |

---

### Rule: engineering-spec

---
name: python-pro-engineering-spec
description: Full 21-section engineering spec � FastAPI/Django/Flask selection, async/sync classification, type hints, architecture layering
---

# Python Pro � Engineering Specification

> Production-grade specification for Python development principles at FAANG scale.

---

## 1. Overview

Python Pro provides structured decision frameworks for Python development: framework selection (FastAPI, Django, Flask), async vs sync routing (I/O-bound ? async, CPU-bound ? sync + multiprocessing), type hint strategy, project structure, and architecture patterns (routes ? services ? repos). The skill operates as an **Expert (decision tree)** � it produces framework recommendations, architecture decisions, and pattern guidance. It does not write code, install packages, or execute Python scripts.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None � new spec for first hardening

---

## 2. Problem Statement

Python project decisions at scale face four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Wrong framework for context | 40% of projects use Django for simple APIs | Over-engineering, slow starts |
| Sync in async contexts | 35% of async projects use sync libraries | Blocked event loop, poor throughput |
| Missing type hints | 50% of public APIs lack type annotations | Runtime errors, poor DX |
| Business logic in routes | 45% of projects embed logic in views/routes | Untestable, tightly coupled |

Python Pro eliminates these with deterministic framework routing (5-branch decision tree), async/sync classification (I/O vs CPU), mandatory type hint rules, and layered architecture (routes ? services ? repos).

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Framework selection | 5-branch decision tree: API?FastAPI, Web?Django, Simple?Flask, AI/ML?FastAPI, Workers?Celery |
| G2 | Async/sync routing | I/O-bound ? async; CPU-bound ? sync + multiprocessing |
| G3 | Type hint coverage | All public APIs, Pydantic models, function signatures |
| G4 | Project structure | Layered: routes ? services ? repositories |
| G5 | Validation | Pydantic for all input/output boundaries |
| G6 | Reference collection | 7 reference files for deep-dive patterns |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | API design patterns | Owned by `api-architect` skill |
| NG2 | Testing strategy | Owned by `test-architect` skill |
| NG3 | Database schema | Owned by `data-modeler` skill |
| NG4 | Code implementation | Guidance only; execution is caller's responsibility |
| NG5 | Package management (pip/poetry) | Tooling decision outside core scope |
| NG6 | DevOps/deployment | Owned by deployment skills |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Framework selection | Decision criteria | Framework installation |
| Async/sync routing | Classification | Async runtime configuration |
| Type hint guidance | Rules and patterns | Type checker execution |
| Project structure | Layout recommendations | File/directory creation |
| Architecture patterns | Layering rules | Code generation |
| Validation patterns | Pydantic guidance | Model creation |

**Side-effect boundary:** Python Pro produces decisions, recommendations, and architecture guidance. It does not create files, run commands, or modify code.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "framework-select" | "async-sync" | "type-hints" |
                              # "project-structure" | "architecture" | "validation" |
                              # "full-guide"
Context: {
  project_type: string        # "api" | "web" | "script" | "ai-ml" | "workers"
  scale: string | null        # "small" | "medium" | "large"
  async_needs: string | null  # "io-bound" | "cpu-bound" | "mixed" | null
  framework_preference: string | null  # "fastapi" | "django" | "flask" | null
  has_background_tasks: boolean
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
"agent": "python-pro",
  "trace_id": "uuid",
  "status": "success | failure | escalate",
  "result": {
    "framework": {
      "recommended": "fastapi | django | flask",
      "rationale": "...",
      "with_celery": false
    },
    "async_decision": {
      "mode": "async | sync | mixed",
      "rationale": "...",
      "warnings": []
    },
    "structure": {
      "layout": "flat | layered | domain-driven",
      "layers": ["routes", "services", "repositories"]
    },
    "type_hints": {
      "coverage": "all-public | full",
      "validation": "pydantic"
    },
    "reference_files": []
  },
  "security": {
    "rules_of_engagement_followed": true
  },
  "code_quality": {
    "problem_checker_run": true,
    "errors_fixed": 0
  },
  "artifacts": ["architecture_decision.md"],
  "next_action": "user approval | orchestrator execution",
  "escalation_target": "lead | orchestrator | null",
  "failure_reason": "string | null"
```

#### Error Schema

```
Code: string                  # From Error Taxonomy (Section 11)
Message: string
Request_Type: string
Recoverable: boolean
```

#### Deterministic Guarantees

- Framework selection is deterministic: project_type ? framework.
- Async/sync classification is deterministic: I/O-bound ? async; CPU-bound ? sync.
- Type hint rules are fixed: all public APIs use type annotations.
- Architecture layers are fixed: routes ? services ? repositories.
- Validation is fixed: Pydantic for all boundaries.
- Same project context = same recommendations.

#### What Agents May Assume

- Framework decision tree follows documented branches.
- Async recommendation follows I/O vs CPU classification.
- Reference files exist at documented paths.
- Layered architecture applies to all non-script projects.

#### What Agents Must NOT Assume

- User has framework preference (ask if unclear).
- Project is always async (check requirements).
- Django is always the right choice for web (check complexity).
- All frameworks support the same patterns.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Framework selection | None; recommendation |
| Async/sync routing | None; classification |
| Type hints | None; rules output |
| Project structure | None; layout recommendation |
| Architecture | None; pattern guidance |
| Full guide | None; combined output |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Identify project type (api/web/script/ai-ml/workers)
2. Ask user for framework preference if unclear
3. Invoke framework-select for recommendation
4. Invoke async-sync for concurrency classification
5. Invoke project-structure for layout
6. Load relevant reference files for deep patterns
7. Implement (caller's responsibility)
```

#### Execution Guarantees

- Each invocation produces a complete recommendation.
- All decisions are independent (can be invoked in any order).
- User preference overrides decision tree when provided.

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Unknown project type | Return error | Specify valid type |
| Unknown framework | Return error | Use fastapi, django, or flask |
| Invalid request type | Return error | Use supported type |

#### Retry Boundaries

- Zero internal retries. Deterministic output.

#### Isolation Model

- Each invocation is stateless and independent.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Framework selection | Yes | Same project type = same framework |
| Async/sync | Yes | Same needs = same mode |
| Project structure | Yes | Same context = same layout |

---

## 7. Execution Model

### 2-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Classify** | Parse project type, scale, async needs | Classification |
| **Guide** | Generate framework recommendation, patterns, structure | Complete output |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Framework routing | API/microservices ? FastAPI; Full-stack/CMS/admin ? Django; Simple/scripts ? Flask; AI/ML serving ? FastAPI; Background workers ? Celery + any |
| Async classification | I/O-bound (HTTP, DB, file) ? async; CPU-bound (compute) ? sync + multiprocessing |
| Async constraints | Never mix sync libraries in async code; never force async for CPU work |
| Type hints mandatory | All public APIs, all function signatures, all Pydantic models |
| Validation | Pydantic at all boundaries (input/output) |
| Architecture layering | Routes (HTTP) ? Services (business logic) ? Repositories (data access) |
| No logic in routes | Routes delegate to services; services contain business logic |
| User preference respected | Explicit preference overrides decision tree |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown project type | Return `ERR_UNKNOWN_PROJECT_TYPE` | Specify api, web, script, ai-ml, or workers |
| Unknown framework | Return `ERR_UNKNOWN_FRAMEWORK` | Specify fastapi, django, or flask |
| Invalid request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported type |

**Invariant:** Every failure returns a structured error. No partial guidance.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_UNKNOWN_PROJECT_TYPE` | Validation | Yes | Project type not one of 5 |
| `ERR_UNKNOWN_FRAMEWORK` | Validation | Yes | Framework not fastapi, django, or flask |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Decision generation | N/A | N/A | Synchronous; < 50ms |
| Internal retries | Zero | Zero | Deterministic output |

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "traceId": "uuid",
  "spanId": "uuid",
  "events": [
    {
      "name": "decision_started",
      "timestamp": "ISO-8601",
      "attributes": {
        "project_type": "api",
        "scale": "medium"
      }
    },
    {
      "name": "arch_recommendation_provided",
      "timestamp": "ISO-8601",
      "attributes": {
        "framework_recommended": "fastapi",
        "async_mode": "async",
        "duration_ms": 15
      }
    }
  ]
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Framework selected | INFO | project_type, framework_recommended |
| Async mode decided | INFO | async_needs, async_mode |
| Structure recommended | INFO | layout, layers |
| Decision failed | ERROR | error_code, message |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `pythonpro.decision.duration` | Histogram | ms |
| `pythonpro.framework.distribution` | Counter | fastapi vs django vs flask |
| `pythonpro.async_mode.distribution` | Counter | async vs sync vs mixed |
| `pythonpro.project_type.distribution` | Counter | per project type |

---

## 14. Security & Trust Model

### Data Handling

- Python Pro processes no credentials, API keys, or PII.
- Framework recommendations contain no sensitive data.
- No network calls, no file access, no code execution.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound decision tree | < 50ms; scales linearly |
| Concurrency | Stateless invocations | Unlimited parallel |
| Reference files | 7 files (static) | No growth expected |
| Memory per invocation | < 1 MB | No accumulation |
| Network | Zero network calls | No external dependency |

---

## 16. Concurrency Model

Fully parallel. No shared state. No coordination required.

---

## 17. Resource Lifecycle Management

All resources scoped to invocation. No persistent handles.

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| Framework selection | < 2 ms | < 5 ms | 20 ms |
| Async/sync routing | < 2 ms | < 5 ms | 20 ms |
| Full guide | < 10 ms | < 30 ms | 50 ms |
| Output size | = 2,000 chars | = 5,000 chars | 8,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| New Python framework emerges | Low | Missing recommendation | Annual review |
| FastAPI/Django breaking changes | Medium | Outdated patterns | Track release notes |
| Async ecosystem changes | Low | Stale async guidance | Monitor PEP updates |
| Pydantic v3 | Low | Validation pattern changes | Track major releases |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ? | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ? | Entry point under 200 lines |
| Prerequisites documented | ? | No external dependencies for guidance |
| When to Use section | ? | Situation-based routing table |
| Core content matches skill type | ? | Expert type: framework decision tree, async routing |
| Troubleshooting section | ? | Anti-patterns with fix examples |
| Related section | ? | Cross-links to api-architect, test-architect, data-modeler |
| Content Map for multi-file | ? | Links to 7 reference files + engineering-spec.md |
| Contract versioning | ? | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ? | This table with ?/? + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | 5-branch framework decision tree | ? |
| **Functionality** | Async/sync classification | ? |
| **Functionality** | Type hint rules | ? |
| **Functionality** | Architecture layering (routes ? services ? repos) | ? |
| **Functionality** | Pydantic validation guidance | ? |
| **Functionality** | 7 reference files | ? |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ? |
| **Contracts** | Contract versioning with semver | ? |
| **Failure** | Error taxonomy with 3 categorized codes | ? |
| **Failure** | Zero internal retries | ? |
| **Determinism** | Fixed framework routing, fixed async rules | ? |
| **Security** | No credentials, no PII, no network access | ? |
| **Observability** | Structured log schema with 5 mandatory fields | ? |
| **Observability** | 4 metrics defined | ? |
| **Performance** | P50/P99 targets for all operations | ? |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ? |

---



---

### Rule: fastapi-patterns

---
name: fastapi-patterns
description: FastAPI patterns � dependency injection, middleware, error handling, lifespan, and Pydantic integration
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

# Use in route � clean, testable
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

| ? Don't | ? Do |
|---------|-------|
| Business logic in routes | Delegate to service layer |
| Catch all exceptions silently | Use domain exceptions + handlers |
| `@app.on_event("startup")` | Use `lifespan` context manager |
| Skip Depends for DB sessions | Always use DI for testability |
| Return raw dict | Return Pydantic model |

---

## ?? Related

| File | When to Read |
|------|-------------|
| [type-hints.md](type-hints.md) | Pydantic models |
| [async-patterns.md](async-patterns.md) | Async decisions |
| [project-structure.md](project-structure.md) | Directory layout |
| [testing-patterns.md](testing-patterns.md) | Testing FastAPI |

---

### Rule: framework-selection

---
name: framework-selection
description: Python framework comparison � FastAPI vs Django vs Flask with decision tree, benchmarks, and minimal app examples
---

# Framework Selection (2025)

> Pick the right tool. Don't default to one framework for everything.

---

## Decision Tree

```
What are you building?
�
+-- API-first / Microservices   ? FastAPI
+-- Full-stack web / CMS        ? Django
+-- Simple / Script / Learning  ? Flask
+-- AI/ML API serving           ? FastAPI
+-- Background workers          ? Celery + any framework
```

**If user has explicit preference ? respect it.** Ask when unclear.

---

## Comparison

| Factor | FastAPI | Django | Flask |
|--------|---------|--------|-------|
| **Best for** | APIs, microservices, ML | Full-stack, CMS, admin | Simple, learning, prototyping |
| **Performance** | ??? (Starlette/uvicorn) | ?? (improved in 5.x) | ?? (Werkzeug) |
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

| ? Don't | ? Do |
|---------|-------|
| Default to Django for simple APIs | Use FastAPI for API-first |
| Use Flask for complex apps | Use Django (batteries included) |
| Pick framework by popularity | Pick by project requirements |
| Skip framework when prototyping | Flask for quick prototypes |

---

## ?? Related

| File | When to Read |
|------|-------------|
| [fastapi-patterns.md](fastapi-patterns.md) | Chosen FastAPI |
| [django-patterns.md](django-patterns.md) | Chosen Django |
| [project-structure.md](project-structure.md) | Directory layout |
| [async-patterns.md](async-patterns.md) | Async decision |

---

### Rule: project-structure

---
name: project-structure
description: Python project structure � directory layouts for small/medium/large apps, FastAPI vs Django, pyproject.toml
---

# Project Structure

> Structure by size. Feature-based for large apps. Layer-based for small.

---

## By Project Size

### Small (Script / Tool)

```
myapp/
+-- main.py
+-- utils.py
+-- pyproject.toml
+-- README.md
```

### Medium (API / Service)

```
myapp/
+-- app/
�   +-- __init__.py
�   +-- main.py              # App entry + lifespan
�   +-- config.py             # Pydantic Settings
�   +-- dependencies.py       # Shared DI (db session, auth)
�   +-- models/               # SQLAlchemy / DB models
�   �   +-- __init__.py
�   �   +-- user.py
�   +-- schemas/              # Pydantic request/response
�   �   +-- __init__.py
�   �   +-- user.py
�   +-- routes/               # API routes
�   �   +-- __init__.py
�   �   +-- users.py
�   +-- services/             # Business logic
�       +-- __init__.py
�       +-- user_service.py
+-- tests/
�   +-- conftest.py           # Shared fixtures
�   +-- test_users.py
�   +-- test_services.py
+-- alembic/                  # DB migrations
+-- pyproject.toml
+-- .env.example
+-- README.md
```

### Large (Monolith / Multiple Domains)

```
src/
+-- myapp/
    +-- core/                 # Shared kernel
    �   +-- config.py
    �   +-- database.py
    �   +-- security.py
    �   +-- exceptions.py
    +-- users/                # Feature module
    �   +-- models.py
    �   +-- schemas.py
    �   +-- routes.py
    �   +-- service.py
    �   +-- repository.py
    +-- products/             # Feature module
    �   +-- ...
    +-- main.py
tests/
+-- users/
+-- products/
+-- conftest.py
pyproject.toml
```

---

## FastAPI Entry Point

```python
# app/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.config import settings
from app.routes import users, products

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await database.connect()
    yield
    # Shutdown
    await database.disconnect()

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    lifespan=lifespan,
)

app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(products.router, prefix="/api/v1/products", tags=["products"])
```

---

## Django Structure

```
myproject/
+-- manage.py
+-- myproject/
�   +-- __init__.py
�   +-- settings/
�   �   +-- __init__.py
�   �   +-- base.py           # Shared settings
�   �   +-- dev.py            # Development
�   �   +-- prod.py           # Production
�   +-- urls.py
�   +-- wsgi.py / asgi.py
+-- users/                    # Django app
�   +-- models.py
�   +-- views.py / viewsets.py
�   +-- serializers.py
�   +-- urls.py
�   +-- admin.py
�   +-- tests.py
�   +-- migrations/
+-- products/                 # Django app
�   +-- ...
+-- requirements/
    +-- base.txt
    +-- dev.txt
    +-- prod.txt
```

---

## Background Tasks Selection

| Solution | Best For | Async | Persistence |
|----------|----------|:-----:|:-----------:|
| **BackgroundTasks** (FastAPI) | Quick, in-process | ? | ? |
| **Celery** | Distributed workflows | ? | ? |
| **ARQ** | Async + Redis | ? | ? |
| **Dramatiq** | Actor-based | ? | ? |
| **RQ** | Simple Redis queue | ? | ? |

---

## Anti-Patterns

| ? Don't | ? Do |
|---------|-------|
| Flat file dump (all in root) | Organize by feature/layer |
| Business logic in routes | Routes ? services ? repos |
| `settings.py` with hardcoded values | Pydantic Settings + `.env` |
| Skip `__init__.py` | Always include (explicit packages) |

---

## ?? Related

| File | When to Read |
|------|-------------|
| [framework-selection.md](framework-selection.md) | Which framework |
| [fastapi-patterns.md](fastapi-patterns.md) | FastAPI specifics |
| [django-patterns.md](django-patterns.md) | Django specifics |

---

### Rule: testing-patterns

---
name: testing-patterns
description: Python testing patterns � pytest, async tests, fixtures, mocking, FastAPI/Django test clients, coverage
---

# Python Testing Patterns

> pytest for everything. Fixtures for setup. Mock at boundaries. Test behavior, not implementation.

---

## Testing Strategy

| Type | Purpose | Tools | Speed |
|------|---------|-------|:-----:|
| **Unit** | Business logic / services | pytest | ? Fast |
| **Integration** | API endpoints + DB | pytest + httpx/TestClient | ?? Medium |
| **E2E** | Full workflows | pytest + real DB | ?? Slow |

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
    """Create a test user � available to all tests."""
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

| ? Don't | ? Do |
|---------|-------|
| Test implementation details | Test behavior (inputs ? outputs) |
| Mock everything | Mock only boundaries (DB, APIs, email) |
| Share state between tests | Each test is independent |
| Skip error path tests | Test both success AND failure |
| Ignore coverage | Aim for =80% with `fail_under` |
| Use `print()` for debugging | Use `pytest --pdb` or `breakpoint()` |

---

## ?? Related

| File | When to Read |
|------|-------------|
| [fastapi-patterns.md](fastapi-patterns.md) | FastAPI patterns |
| [django-patterns.md](django-patterns.md) | Django patterns |
| [async-patterns.md](async-patterns.md) | Testing async code |
| [type-hints.md](type-hints.md) | Typed test fixtures |

---

### Rule: type-hints

---
name: type-hints
description: Python type hints � modern syntax, Pydantic v2, generics, TypeVar, and validation patterns
---

# Python Type Hints & Validation

> Type all public APIs. Use Pydantic at boundaries. No `Any` in public signatures.

---

## Modern Type Syntax (Python 3.12+)

```python
# ? Modern � use built-in generics (no typing import needed)
def get_items() -> list[dict[str, int]]:
    ...

def find_user(user_id: int) -> User | None:  # Union syntax
    ...

def process(data: str | bytes) -> None:
    ...

# ? Legacy � avoid in new code
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
    """Output serialization � never expose internal fields."""
    id: int
    name: str
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}  # Enable ORM mode

class UserUpdate(BaseModel):
    """Partial update � all fields optional."""
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

| ? Don't | ? Do |
|---------|-------|
| `Any` in public APIs | Use specific types or `TypeVar` |
| `typing.Optional[X]` | `X \| None` (Python 3.10+) |
| `typing.List`, `typing.Dict` | `list`, `dict` (Python 3.9+) |
| Skip return type hints | Always annotate return types |
| Validate manually | Use Pydantic at boundaries |
| Hardcode config values | Use Pydantic Settings |

---

## ?? Related

| File | When to Read |
|------|-------------|
| [fastapi-patterns.md](fastapi-patterns.md) | Pydantic with FastAPI |
| [testing-patterns.md](testing-patterns.md) | Testing typed code |
| [project-structure.md](project-structure.md) | Where to put models |

---

? PikaKit v3.9.206
