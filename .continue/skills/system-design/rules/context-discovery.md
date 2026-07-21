---
name: context-discovery
description: Architecture context discovery — question hierarchy, NFR checklist, project classification matrix, and output template
---

# Context Discovery

> Before suggesting any architecture, gather context. Never assume scale, team, or constraints.

---

## Question Hierarchy (Ask User FIRST)

### 1. Scale

| Question | Why It Matters |
|----------|---------------|
| How many users? (10, 1K, 100K, 1M+) | Determines infrastructure complexity |
| Data volume? (MB, GB, TB) | Database selection, sharding |
| Transaction rate? (per second/minute) | Caching, queue, read/write split |
| Growth projection? (10x in 1 year?) | Over-provisioning vs auto-scaling |

### 2. Team

| Question | Why It Matters |
|----------|---------------|
| Solo developer or team? | Monolith vs modular decision |
| Team size and expertise? | Pattern complexity ceiling |
| Distributed or co-located? | Microservices viability |
| DevOps maturity? | Deployment complexity budget |

### 3. Timeline

| Question | Why It Matters |
|----------|---------------|
| MVP/Prototype or long-term product? | Architecture investment level |
| Time to market pressure? | Build vs buy decisions |
| Maintenance horizon? (1 year, 5 years) | Tech debt tolerance |

### 4. Domain

| Question | Why It Matters |
|----------|---------------|
| CRUD-heavy or business logic complex? | Transaction Script vs DDD |
| Real-time requirements? | Event-driven vs REST |
| Compliance/regulations? (GDPR, HIPAA) | Security, audit, data residency |
| Multi-tenancy? | Data isolation strategy |

### 5. Non-Functional Requirements (NFR)

| Requirement | Question | Impact |
|-------------|----------|--------|
| **Availability** | SLA target? (99.9% = 8.7h downtime/year) | Redundancy, failover |
| **Latency** | p99 target? (50ms, 200ms, 1s) | Caching, CDN, DB proximity |
| **Security** | Auth model? Data sensitivity? | Encryption, access control |
| **Observability** | Logging, tracing, alerting needs? | Stack selection |
| **Cost** | Cloud budget? Managed vs self-hosted? | Technology constraints |

---

## Project Classification Matrix

| Dimension | MVP | SaaS | Enterprise |
|-----------|-----|------|-----------|
| **Scale** | <1K users | 1K-100K users | 100K+ users |
| **Team** | Solo / 1-2 | 2-10 | 10+ |
| **Timeline** | Weeks | Months | Years |
| **Architecture** | Simple monolith | Modular monolith | Distributed / microservices |
| **Patterns** | Minimal | Selective | Comprehensive |
| **Database** | SQLite / single PG | PostgreSQL + Redis | Polyglot (right tool per job) |
| **Auth** | JWT simple | OAuth + JWT | OAuth + SAML + SSO |
| **Deployment** | Vercel / Railway | Docker + CI/CD | Kubernetes + Helm |
| **Monitoring** | Console logs | Structured logging | Full observability stack |
| **Example** | Next.js API routes | NestJS modular | Microservices + API Gateway |

---

## Discovery Output Template

After gathering context, produce this summary:

```markdown
## Architecture Context Summary

**Project type:** [MVP / SaaS / Enterprise]
**Scale:** [Current users] → [Projected users in 12 months]
**Team:** [Size] / [Expertise level] / [Co-located?]
**Timeline:** [Weeks/Months/Years] / [Hard deadline?]

### Key Constraints
- [Constraint 1: e.g., solo developer → no microservices]
- [Constraint 2: e.g., HIPAA → encryption + audit logs]

### NFR Targets
| Requirement | Target |
|-------------|--------|
| Availability | 99.9% |
| p99 Latency | <200ms |
| Data retention | 7 years (compliance) |

### Recommended Classification → [MVP / SaaS / Enterprise]
→ Read [pattern-selection.md](pattern-selection.md) for architecture patterns
```

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [pattern-selection.md](pattern-selection.md) | After classifying project |
| [trade-off-analysis.md](trade-off-analysis.md) | Documenting decisions |
| [examples.md](examples.md) | Reference implementations |

---

⚡ PikaKit v3.9.206
