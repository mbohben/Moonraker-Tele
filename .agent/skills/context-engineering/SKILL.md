---
name: context-engineering
description: >-
  Monitor context usage, control token consumption with four-bucket strategy.
  Use when designing agent architectures, managing context budgets, or optimizing token usage.
  NOT for code writing or feature implementation.
metadata:
  author: pikakit
  version: "3.9.206"
  category: agent-infrastructure
  triggers: ["context usage", "token limit", "agent architecture", "memory system"]
  coordinates_with: ["lifecycle-orchestrator", "system-design"]
  success_metrics: ["< 70% token utilization", "> 70% cache hit rate"]
---

# Context Engineering

> Smallest high-signal token set = maximum reasoning quality. Thresholds: 70% warning, 80% critical.

---

## Prerequisites

**Knowledge:**
- LLM context window behavior (attention U-curve)
- Token counting basics
- Agent architecture patterns

---

## When to Use

| Situation | Action |
|-----------|--------|
| Context > 70% full | Invoke utilization-check; plan reduction |
| Agent failing on large inputs | Diagnose degradation pattern |
| Multi-agent coordination needed | Select isolation pattern |
| Cross-session memory required | Apply Write bucket (external persistence) |
| Architecture review | Read `rules/engineering-spec.md` |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Token utilization thresholds (70%/80%) | Token counting implementation |
| Four-bucket strategy selection | Compression execution |
| Degradation pattern detection (4 patterns) | Automatic detection tooling |
| Compression technique selection (3 strategies) | Summarization models |
| Multi-agent isolation patterns (4 patterns) | Agent instantiation (→ lifecycle-orchestrator) |

**Pure decision skill:** Produces context management recommendations. Zero side effects.

---

## Core Principles

| Principle | Rule |
|-----------|------|
| **Quality > Quantity** | High-signal tokens over exhaustive content |
| **Attention is Finite** | U-curve: beginning/end of context get more attention |
| **Progressive Disclosure** | Load just-in-time; remove after use |
| **Isolation Prevents Degradation** | Partition across sub-agents at boundaries |
| **Measure Before Acting** | Know utilization baseline before applying strategy |

---

## Four-Bucket Strategy (Escalating Intervention)

| # | Bucket | Strategy | Expected Reduction | Quality Risk |
|---|--------|----------|--------------------|-------------|
| 1 | **Write** | Save to files/scratchpads | 20–40% | None |
| 2 | **Select** | Pull only relevant content | 30–50% | Low |
| 3 | **Compress** | Hierarchical summarization | 50–70% | Medium (< 5%) |
| 4 | **Isolate** | Split across sub-agents | 60–80% | Medium |

**Escalation order:** Write → Select → Compress → Isolate. Apply least invasive first.

---

## Key Metrics (Fixed Thresholds)

| Metric | Target | Trigger |
|--------|--------|---------|
| Token utilization | < 70% | ≥ 70% = warning; ≥ 80% = critical |
| Compression ratio | 50–70% reduction | < 5% quality loss |
| Cache hit rate | > 70% | Stable workloads only |
| Multi-agent overhead | ~15x baseline | Per sub-agent |

---

## Degradation Patterns

| Pattern | Symptom | Fix |
|---------|---------|-----|
| **Lost-in-Middle** | Middle content ignored | Move critical content to beginning/end |
| **Context Poisoning** | Bad examples corrupt output | Filter low-quality examples |
| **Attention Dilution** | Too much noise, vague responses | Compress + select high-signal content |
| **Token Exhaustion** | Truncation mid-task | Checkpoint + isolate into sub-agents |

---

## Multi-Agent Isolation Patterns

| Pattern | Use When |
|---------|----------|
| **Orchestrator** | Central coordinator delegates independent tasks |
| **Pipeline** | Sequential processing; output of one = input of next |
| **Parallel** | Independent workers; merge results |
| **Hierarchical** | Nested agents for deeply complex tasks |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_MISSING_UTILIZATION` | Yes | Utilization not provided |
| `ERR_INVALID_RANGE` | No | Utilization outside 0.0–1.0 |
| `ERR_MISSING_WINDOW_SIZE` | Yes | Context window size not provided |
| `ERR_MISSING_SYMPTOMS` | Yes | No symptoms for degradation diagnosis |
| `WARN_UNKNOWN_CONTENT` | Yes | Content type not recognized; generic applied |

**Zero internal retries.** Deterministic output; same context = same recommendation.

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec: contracts, security, scalability | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `lifecycle-orchestrator` | Skill | Task lifecycle and multi-agent coordination |
| `system-design` | Skill | Architecture decision framework |

---

⚡ PikaKit v3.9.206
