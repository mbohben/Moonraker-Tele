---
name: trade-off-analysis
description: Trade-off analysis framework — ADR template, common trade-off dimensions, filled example, and decision storage
---

# Trade-off Analysis & ADR

> Document every architectural decision with trade-offs. Future-you will thank present-you.

---

## Common Trade-off Dimensions

| Dimension | Trade-off |
|-----------|-----------|
| **Simplicity ↔ Flexibility** | Simple code is rigid; flexible code is complex |
| **Speed ↔ Quality** | Ship fast = tech debt; polish = slower delivery |
| **Consistency ↔ Availability** | Strong consistency = lower availability (CAP) |
| **Coupling ↔ Complexity** | Tight coupling = simple; loose coupling = more infra |
| **Build ↔ Buy** | Build = control + maintenance; Buy = cost + vendor lock |
| **Monolith ↔ Microservices** | Monolith = simple ops; Micro = independent scale + deploy complexity |
| **SQL ↔ NoSQL** | SQL = consistency + joins; NoSQL = scale + flexibility |

---

## Decision Framework

For EACH architectural component, document:

```markdown
## Architecture Decision Record

### Context
- **Problem**: [What problem are we solving?]
- **Constraints**: [Team size, scale, timeline, budget]

### Options Considered

| Option | Pros | Cons | Complexity | When Valid |
|--------|------|------|------------|-----------|
| Option A | Benefit 1 | Cost 1 | Low | [Conditions] |
| Option B | Benefit 2 | Cost 2 | High | [Conditions] |

### Decision
**Chosen**: [Option X]

### Rationale
1. [Reason 1 — tied to constraints]
2. [Reason 2 — tied to requirements]

### Trade-offs Accepted
- [What we're giving up]
- [Why this is acceptable]

### Consequences
- **Positive**: [Benefits we gain]
- **Negative**: [Costs/risks we accept]
- **Mitigation**: [How we'll address negatives]

### Revisit Trigger
- [When to reconsider this decision]
```

---

## Filled Example: Database Selection

```markdown
# ADR-002: PostgreSQL over MongoDB

## Status
Accepted

## Context
E-commerce SaaS with orders, inventory, and user management.
Team of 5, all familiar with SQL. Need ACID for financial transactions.

## Options Considered

| Option | Pros | Cons | Complexity |
|--------|------|------|-----------|
| PostgreSQL | ACID, joins, mature, JSON support | Harder horizontal scale | Low |
| MongoDB | Flexible schema, horizontal scale | No joins, eventual consistency | Medium |
| CockroachDB | Distributed SQL, ACID | Newer, smaller ecosystem | High |

## Decision
**Chosen**: PostgreSQL

## Rationale
1. Financial transactions require ACID (orders + payments)
2. Team already proficient in SQL — no learning curve
3. JSON column covers semi-structured data needs
4. Supabase/Neon provide managed PG with good DX

## Trade-offs Accepted
- Horizontal scaling harder → acceptable at <100K users
- Single point of failure → mitigated by managed hosting + replicas

## Consequences
- **Positive**: Strong consistency for orders, familiar tooling, Prisma/Drizzle support
- **Negative**: Must shard manually if >100K concurrent writes
- **Mitigation**: Read replicas for read scaling, revisit if write-heavy

## Revisit Trigger
- Write throughput >10K/sec consistently
- Need geo-distributed database
- Schema flexibility becomes painful
```

---

## ADR Compact Template

```markdown
# ADR-[XXX]: [Decision Title]

## Status
Proposed | Accepted | Deprecated | Superseded by [ADR-YYY]

## Context
[What problem? What constraints?]

## Decision
[What we chose — be specific]

## Rationale
[Why — tie to requirements and constraints]

## Trade-offs
[What we're giving up — be honest]

## Consequences
- **Positive**: [Benefits]
- **Negative**: [Costs]
- **Mitigation**: [How to address]
```

---

## ADR Storage

```
docs/
└── architecture/
    ├── adr-001-use-nextjs.md
    ├── adr-002-postgresql-over-mongodb.md
    ├── adr-003-modular-monolith.md
    └── adr-004-jwt-over-session.md
```

**Rules:**
- Sequential numbering (never reuse numbers)
- Deprecated ADRs stay (append "Superseded by ADR-XXX")
- Review ADRs quarterly against revisit triggers

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [context-discovery.md](context-discovery.md) | Gather context first |
| [pattern-selection.md](pattern-selection.md) | Choose patterns |
| [patterns-reference.md](patterns-reference.md) | Pattern comparison |
| [examples.md](examples.md) | See full architecture examples |

---

⚡ PikaKit v3.9.206
