---
name: pattern-selection
description: Architecture pattern selection — decision trees for data access, domain logic, distribution, communication, with validation questions
---

# Pattern Selection Guidelines

> Decision trees for choosing architectural patterns. Always ask: Is there a simpler solution?

---

## The 3 Questions (Before ANY Pattern)

1. **Problem Solved**: What SPECIFIC problem does this pattern solve?
2. **Simpler Alternative**: Is there a simpler solution?
3. **Deferred Complexity**: Can we add this LATER when needed?

> If you can't answer #1 clearly → don't use the pattern.

---

## Main Decision Tree

```
START: What's your MAIN concern?

┌─ Data Access Complexity?
│  ├─ HIGH (complex queries, testing needed)
│  │  → Repository Pattern + Unit of Work
│  │  VALIDATE: Will data source change frequently?
│  │     ├─ YES → Repository worth the indirection
│  │     └─ NO  → Consider simpler ORM direct access
│  └─ LOW (simple CRUD, single database)
│     → ORM directly (Prisma, Drizzle)
│     Simpler = Better, Faster
│
├─ Business Rules Complexity?
│  ├─ HIGH (domain logic, rules vary by context)
│  │  → Domain-Driven Design
│  │  VALIDATE: Do you have domain experts on team?
│  │     ├─ YES → Full DDD (Aggregates, Value Objects)
│  │     └─ NO  → Partial DDD (rich entities, clear boundaries)
│  └─ LOW (mostly CRUD, simple validation)
│     → Transaction Script pattern
│     Simpler = Better, Faster
│
├─ Independent Scaling Needed?
│  ├─ YES (different components scale differently)
│  │  → Microservices WORTH the complexity
│  │  REQUIREMENTS (ALL must be true):
│  │    - Clear domain boundaries
│  │    - Team > 10 developers
│  │    - Different scaling needs per service
│  │  IF NOT ALL MET → Modular Monolith instead
│  └─ NO (everything scales together)
│     → Modular Monolith
│     Can extract services later when proven needed
│
└─ Real-time Requirements?
   ├─ HIGH (immediate updates, multi-user sync)
   │  → Event-Driven Architecture
   │  → Message Queue (RabbitMQ, Redis, Kafka)
   │  VALIDATE: Can you handle eventual consistency?
   │     ├─ YES → Event-driven valid
   │     └─ NO  → Synchronous with polling
   └─ LOW (eventual consistency acceptable)
      → Synchronous (REST/GraphQL)
      Simpler = Better, Faster
```

---

## Communication Pattern Selection

```
How do services communicate?

┌─ Synchronous (request-response)?
│  ├─ Public API → REST (standard, cacheable)
│  ├─ Internal services → gRPC (fast, typed)
│  ├─ Flexible queries → GraphQL (client-driven)
│  └─ Real-time bidirectional → WebSocket
│
└─ Asynchronous (fire-and-forget)?
   ├─ Simple job queue → BullMQ (Redis-based)
   ├─ Point-to-point → RabbitMQ (routing, reliability)
   ├─ High throughput stream → Kafka (log, replay)
   └─ Cloud-native → AWS SQS/SNS, GCP Pub/Sub
```

### Message Broker Selection

| Factor | BullMQ | RabbitMQ | Kafka |
|--------|--------|----------|-------|
| **Best for** | Background jobs | Task routing | Event streaming |
| **Throughput** | Medium | Medium | Very High |
| **Ordering** | Per queue | Per queue | Per partition |
| **Replay** | ❌ | ❌ | ✅ |
| **Complexity** | Low | Medium | High |
| **Persistence** | Redis | Disk | Disk (replicated) |
| **Use when** | <10K msgs/sec | Routing logic | >10K msgs/sec, audit |

---

## Red Flags (Anti-patterns)

| Pattern | Anti-pattern Signal | Simpler Alternative |
|---------|-------------------|---------------------|
| Microservices | "We might need to scale someday" | Start monolith, extract later |
| Clean/Hexagonal | Dozens of interfaces for simple CRUD | Concrete first, interfaces later |
| Event Sourcing | "Audit trail would be nice" | Append-only audit log table |
| CQRS | Read/write look the same | Single model, add CQRS when diverged |
| Repository | Single database, simple queries | ORM direct access |
| DDD | No domain experts, simple CRUD | Transaction Script |
| GraphQL | Single client, simple queries | REST |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [context-discovery.md](context-discovery.md) | Classify project first |
| [patterns-reference.md](patterns-reference.md) | Quick pattern lookup |
| [trade-off-analysis.md](trade-off-analysis.md) | Document your choice |
| [examples.md](examples.md) | See real implementations |

---

⚡ PikaKit v3.9.206
