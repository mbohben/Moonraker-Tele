---
name: google-adk-python
description: >-
  Build AI agents with Google Agent Development Kit: tool integration and multi-agent orchestration.
  Use when building Google ADK agents, configuring agent tools, or deploying agent workflows.
  NOT for general Python development (use python-pro) or non-Google agent frameworks.
metadata:
  author: pikakit
  version: "3.9.206"
  category: ai-agent-framework
  triggers: ["Google ADK", "agent development", "multi-agent", "agent orchestration"]
  coordinates_with: ["python-pro", "api-architect", "ai-artist"]
  success_metrics: ["100% typed parameters", "< 5 tools per agent"]
---

# Google ADK Python — AI Agent Development

> Code-first. ≤ 5 tools per agent. Typed functions. Deterministic type selection.

---

## Prerequisites

**Required:** `pip install google-adk`. Set `GEMINI_API_KEY` or `GOOGLE_CLOUD_PROJECT` + `GOOGLE_CLOUD_LOCATION`.

---

## When to Use

| Situation | Action |
|-----------|--------|
| Single agent with tools | Follow quick start + agent type table |
| Multi-agent coordination | Read `rules/multi-agent.md` |
| Custom tool creation | Read `rules/tools.md` |
| Deployment patterns | Read `rules/deployment.md` |
| Architecture review | Read `rules/engineering-spec.md` |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Agent type selection (4 types) | Python project setup (→ python-pro) |
| Model selection (3 tiers) | API architecture (→ api-architect) |
| Tool creation patterns | Prompt engineering (→ ai-artist) |
| Multi-agent composition | Cloud project config |
| Deployment guidance | Model hosting |

**Expert decision skill:** Produces agent architecture decisions and code patterns. No execution.

---

## Agent Type Selection (Deterministic)

| Task Type | Agent Type | When |
|-----------|-----------|------|
| Conversational | `LlmAgent` | Unpredictable inputs, dialogue |
| Pipeline | `SequentialAgent` | Ordered step execution |
| Fan-out | `ParallelAgent` | Concurrent independent tasks |
| Iterative | `LoopAgent` | Repeat until condition met |

---

## Model Selection (Cost-Based)

| Complexity | Model | Tier |
|-----------|-------|------|
| Simple | `gemini-3-flash` | Fast, low cost |
| Balanced | `gemini-3-pro-low` | Moderate reasoning |
| Complex | `gemini-3-pro-high` | Deep reasoning |

---

## Quick Start

```python
from google.adk.agents import LlmAgent

agent = LlmAgent(
    name="assistant",
    model="gemini-3-flash",
    instruction="You are a helpful assistant."
)
```

---

## Tool Creation (Mandatory Contract)

```python
def calculate_roi(revenue: float, cost: float) -> float:
    """Calculate return on investment."""
    return ((revenue - cost) / cost) * 100
```

**Rules:** Typed parameters + docstring + return type annotation. Always.

---

## Multi-Agent Rules

| Rule | Limit |
|------|-------|
| Max tools per agent | 5 |
| Max sub-agents per coordinator | 5 |
| Tool count > 5 | Split into sub-agents |

```python
coordinator = LlmAgent(
    name="Coordinator",
    instruction="Delegate to specialists.",
    sub_agents=[researcher, writer]  # ≤ 5
)
```

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_MISSING_TASK_TYPE` | Yes | Task type not provided |
| `ERR_INVALID_COMPLEXITY` | Yes | Not simple/balanced/complex |
| `ERR_REFERENCE_NOT_FOUND` | No | Reference file missing |
| `ERR_PACKAGE_MISSING` | Yes | google-adk not installed |
| `WARN_TOOL_LIMIT` | Yes | Tool count exceeds 20 |

**Zero internal retries.** Deterministic; same context = same pattern.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Use pro-high for simple tasks | Match complexity to model tier |
| Put > 5 tools on one agent | Split into coordinator + specialists |
| Skip type annotations on tools | Typed params + docstring + return type |
| Use LlmAgent for pipelines | SequentialAgent for ordered steps |
| Hardcode API keys | Use environment variables |


## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [multi-agent.md](rules/multi-agent.md) | Multi-agent patterns | Agent composition |
| [tools.md](rules/tools.md) | Tool integration | Custom tools |
| [deployment.md](rules/deployment.md) | Production deploy | Deployment |
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec | Architecture review |

**Selective reading:** Read ONLY files relevant to the request.

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `python-pro` | Skill | Python patterns |
| `api-architect` | Skill | API design |
| `ai-artist` | Skill | Prompt engineering |

---

⚡ PikaKit v3.9.206
