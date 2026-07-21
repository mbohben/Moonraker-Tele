---
name: system-design
description: >-
  Architectural decision framework: requirements analysis, trade-off evaluation, and ADR documentation.
  Use when making architecture decisions, evaluating trade-offs, or documenting design choices.
  NOT for code implementation or quick fixes.
metadata:
  author: pikakit
  version: "3.9.206"
  category: architectural-decision
  triggers: ["architecture", "system design", "scalability", "microservices"]
  coordinates_with: ["api-architect", "data-modeler", "cicd-pipeline"]
  success_metrics: ["Architecture Robustness", "ADR Coverage", "Simplicity Score"]
---

# System Design — Architecture Decision Framework

> Requirements drive architecture. Trade-offs inform decisions. ADRs capture rationale.

---

## 5 Must-Ask Questions (Socratic Gate)

| # | Question | Options |
|---|----------|---------|
| 1 | Project Type? | MVP / SaaS / Enterprise Internal |
| 2 | Scale Target? | Startup (1k) / Growth (100k) / Enterprise (1M+) |
| 3 | Constraints? | Latency / Security / Budget / Team Size |
| 4 | Current Stack? | Typescript / Python / Go / Legacy Java |
| 5 | Key Non-Functional Req? | High Availability / Eventual Consistency / Strong Consistency |

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Starting architecture | Read context-discovery.md |
| Documenting decisions | Use ADR template |
| Choosing patterns | Check pattern-selection.md |
| Reference examples | See examples.md |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Context discovery (project classification) | API design (→ api-architect) |
| Trade-off analysis (ADR format) | Database design (→ data-modeler) |
| Pattern selection (decision trees) | Deployment (→ cicd-pipeline) |
| Architecture validation (6-item checklist) | Code implementation |

**Expert decision skill:** Produces architecture recommendations. Does not write code.

---

## Core Principle (Fixed)

**"Simplicity is the ultimate sophistication."**

1. Start simple
2. Add complexity ONLY when proven necessary
3. You can always add patterns later
4. Removing complexity is MUCH harder than adding it

---

## ADR Format (6 Sections — Fixed)

| Section | Purpose |
|---------|---------|
| Title | Decision being made |
| Status | proposed / accepted / deprecated |
| Context | Why this decision is needed |
| Options | Each option with pros and cons |
| Decision | Selected option with rationale |
| Consequences | Impact of the decision |

---

## Validation Checklist (6 Items — Fixed)

- [ ] Requirements clearly understood
- [ ] Constraints identified
- [ ] Each decision has trade-off analysis
- [ ] Simpler alternatives considered
- [ ] ADRs written for significant decisions
- [ ] Team expertise matches chosen patterns

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_PROJECT_TYPE` | Yes | Project type not one of 3 |
| `ERR_MISSING_TOPIC` | Yes | Trade-off requires decision topic |
| `ERR_UNKNOWN_SCALE` | Yes | Scale not startup, growth, or enterprise |

**Zero internal retries.** Same project type + constraints = same recommendation.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Over-engineer from day one | Start simple, add complexity when needed |
| Skip trade-off analysis | Document pros/cons for every option |
| Copy architecture from tutorials | Match patterns to actual constraints |
| Ignore team expertise | Choose patterns team can maintain |

---

## Audit Logging (OpenTelemetry)

| Event | Metadata Payload | Severity |
|-------|------------------|----------|
| `architecture_analysis_started` | `{"project_type": "saas", "scale": "growth"}` | `INFO` |
| `pattern_recommended` | `{"pattern": "event-driven", "rationale": "decoupling"}` | `INFO` |
| `adr_generated` | `{"decision_topic": "database_selection", "status": "proposed"}` | `INFO` |
| `analysis_completed` | `{"validation_passed": true, "trade_offs_analyzed": 3}` | `INFO` |

All system-design outputs MUST emit `architecture_analysis_started` and `analysis_completed` events.

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [context-discovery.md](rules/context-discovery.md) | Project classification questions | Starting architecture |
| [trade-off-analysis.md](rules/trade-off-analysis.md) | ADR templates, trade-off framework | Documenting decisions |
| [pattern-selection.md](rules/pattern-selection.md) | Decision trees, anti-patterns | Choosing patterns |
| [patterns-reference.md](rules/patterns-reference.md) | Quick pattern lookup | Pattern comparison |
| [examples.md](rules/examples.md) | MVP, SaaS, Enterprise examples | Reference implementations |
| [engineering-spec.md](rules/engineering-spec.md) | Full spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `api-architect` | Skill | API design patterns |
| `data-modeler` | Skill | Database schema design |
| `cicd-pipeline` | Skill | Deployment architecture |

---

⚡ PikaKit v3.9.206
