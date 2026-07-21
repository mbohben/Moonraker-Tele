---
name: patterns-reference
description: Architecture patterns quick reference — data access, domain, distributed, communication, resilience, and observability patterns
---

# Architecture Patterns Reference

> Quick lookup for common patterns. Check When to Use vs When NOT to Use before adopting.

---

## Data Access Patterns

| Pattern | What It Does | When to Use | When NOT to Use | Complexity |
|---------|-------------|-------------|-----------------|:----------:|
| **Active Record** | Object = row, methods = queries | Simple CRUD, rapid prototyping | Complex queries, multiple sources | Low |
| **Repository** | Abstract data access behind interface | Testing, multiple sources, complex queries | Simple CRUD, single DB | Medium |
| **Unit of Work** | Track changes, commit as single transaction | Complex multi-entity writes | Simple single-table operations | High |
| **Data Mapper** | Separate domain from persistence | Rich domain model, performance tuning | Simple CRUD, rapid dev | High |

**Decision:** Start with Active Record / ORM direct. Add Repository when testing demands or source changes.

---

## Domain Logic Patterns

| Pattern | What It Does | When to Use | When NOT to Use | Complexity |
|---------|-------------|-------------|-----------------|:----------:|
| **Transaction Script** | Procedural — one function per operation | Simple CRUD, thin business logic | Complex rules, many edge cases | Low |
| **Table Module** | One class per table with record logic | Record-based validation | Rich behavior across entities | Low |
| **Domain Model** | Objects with behavior (OOP) | Complex business logic, state machines | Simple CRUD, no invariants | Medium |
| **DDD (Full)** | Aggregates, Value Objects, bounded contexts | Complex domain, domain experts available | Simple domain, no experts | High |

**Decision:** Transaction Script is default. Upgrade to Domain Model when rules exceed simple validation.

---

## Distributed System Patterns

| Pattern | What It Does | When to Use | When NOT to Use | Complexity |
|---------|-------------|-------------|-----------------|:----------:|
| **Modular Monolith** | Single deployment, internal module boundaries | Small-medium teams, unclear boundaries | Clear contexts, different scales | Medium |
| **Microservices** | Independent services, independent deploy | Different scales, large teams (10+) | Small teams, simple domain | Very High |
| **Event-Driven** | Publish events, subscribers react | Loose coupling, real-time, audit trail | Simple workflows, strong consistency required | High |
| **CQRS** | Separate read/write models | Read/write performance diverges | Same data shape for read/write | High |
| **Saga** | Distributed transactions via compensation | Cross-service transactions | Single database, simple ACID | High |
| **Event Sourcing** | Store events, derive state | Full audit trail, temporal queries | Simple state, no replay needs | Very High |

**Decision:** Modular Monolith is default. Extract microservices only when 3 criteria met (clear boundaries + team >10 + different scaling).

---

## Communication Patterns

| Pattern | What It Does | When to Use | When NOT to Use | Complexity |
|---------|-------------|-------------|-----------------|:----------:|
| **REST** | Resource-based HTTP API | Standard CRUD, public APIs, caching | Real-time, complex queries | Low |
| **GraphQL** | Client-driven queries, single endpoint | Multi-client, flexible queries | Simple CRUD, heavy caching | Medium |
| **gRPC** | Binary protocol, code-gen, streaming | Internal services, high perf | Public APIs, browser clients | Medium |
| **WebSocket** | Persistent bidirectional connection | Real-time updates, chat, collaboration | Simple request-response | Medium |
| **SSE** | Server-push, one-directional | Live feeds, notifications | Bidirectional communication | Low |

---

## Resilience Patterns

| Pattern | What It Does | When to Use |
|---------|-------------|-------------|
| **Circuit Breaker** | Stop calling failing service, fallback | External service calls |
| **Retry with Backoff** | Retry transient failures with delay | Network errors, 503s |
| **Bulkhead** | Isolate failure to prevent cascade | Multiple service dependencies |
| **Timeout** | Limit wait time for external calls | Every external call |
| **Rate Limiter** | Limit request throughput | API endpoints, external APIs |

---

## Observability Patterns

| Pattern | What It Does | Tool Examples |
|---------|-------------|---------------|
| **Structured Logging** | JSON logs with context | Pino, Winston → Loki |
| **Distributed Tracing** | Track requests across services | OpenTelemetry → Jaeger/Tempo |
| **Metrics** | Numeric measurements over time | Prometheus → Grafana |
| **Health Checks** | Endpoint reporting service health | `/health`, `/ready` |
| **Alerting** | Notify on threshold breach | PagerDuty, Grafana Alerting |

---

## Simplicity Principle

**"Start simple, add complexity only when proven necessary."**

- You can always add patterns later
- Removing complexity is MUCH harder than adding it
- When in doubt, choose the simpler option
- If you can't explain why you need a pattern in one sentence → you don't need it

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [pattern-selection.md](pattern-selection.md) | Decision trees |
| [examples.md](examples.md) | Real implementations |
| [trade-off-analysis.md](trade-off-analysis.md) | Document choices |

---

⚡ PikaKit v3.9.206
