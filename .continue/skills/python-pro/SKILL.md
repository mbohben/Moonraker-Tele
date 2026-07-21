---
name: python-pro
description: >-
  Python development with FastAPI, Django, or Flask. Async patterns, type hints, project structure.
  Use when building Python backends, scripts, or choosing Python frameworks.
  NOT for Node.js projects (use nodejs-pro) or general AI agents (use google-adk-python).
metadata:
  author: pikakit
  version: "3.9.206"
  category: backend-specialist
  triggers: ["Python", "pip", "FastAPI", "Django", "Flask"]
  coordinates_with: ["api-architect", "test-architect", "data-modeler", "problem-checker", "knowledge-compiler"]
  success_metrics: ["Correct Framework Selection", "Type Hint Coverage"]
---

# Python Pro — Framework Selection & Architecture

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
| Framework selection (5 branches) | API design (→ api-architect) |
| Async/sync classification | Testing strategy (→ test-architect) |
| Type hint rules | Database schema (→ data-modeler) |
| Architecture layering | Code implementation |

**Expert decision skill:** Produces recommendations. Does not write code.

---

## Framework Decision Tree (Deterministic)

```
What are you building?
│
├── API-first / Microservices  → FastAPI
├── Full-stack web / CMS       → Django
├── Simple / Script / Learning → Flask
├── AI/ML API serving          → FastAPI
└── Background workers         → Celery + any
```

**If user has explicit preference → respect it.** Ask when unclear.

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
  └→ Services (business logic)
      └→ Repositories (data access)
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

| ❌ Don't | ✅ Do |
|---------|-------|
| Default to Django for simple APIs | Choose framework per context |
| Use sync libraries in async code | Use async-compatible libraries |
| Skip type hints on public APIs | Annotate all public functions |
| Put business logic in routes/views | Separate: routes → services → repos |
| Always pick the same framework | Ask user, evaluate context |


## 📑 Content Map

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

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `api-architect` | Skill | API design |
| `test-architect` | Skill | Testing |
| `data-modeler` | Skill | Database |

---

⚡ PikaKit v3.9.206
