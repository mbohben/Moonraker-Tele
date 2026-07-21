---
name: smart-router
description: >-
  Intelligent agent routing: maps user intent to specialist agents using domain detection.
  Use for request classification, multi-domain routing, or agent selection decisions.
  NOT for task execution or skill implementation.
metadata:
  author: pikakit
  version: "3.9.206"
  category: meta-agent
  triggers: ["agent routing", "request classification", "multi-agent selection"]
  coordinates_with: ["lifecycle-orchestrator", "execution-reporter"]
  success_metrics: ["Routing Accuracy", "Routing Latency", "Tool Execution Success"]
---

# Smart Router

Intelligent agent routing protocol embedded in `GEMINI.md → TIER 0: INTELLIGENT AGENT ROUTING`.

## Internal Validation Checklist (Silent)

> **SILENT MODE REQUIRED:** Do NOT ask the user these questions! The router must internally assess these 5 axes from the user's prompt *before* selecting an agent:

| # | Check | Example Thought Process |
|---|-------|-------------------------|
| 1 | Domain? | Is this Web, Mobile, Data, Ops, or Security? |
| 2 | Action? | Are we building, fixing, planning, or just answering? |
| 3 | Language? | Is the stack Node, Python, generic shell, etc.? |
| 4 | Complexity? | Multi-file architecture or single-file typo? |
| 5 | Constraints? | Did the user explicitly specify `@agent` or overrides? |

---

## Scope

| In Scope | Out of Scope |
|----------|-------------|
| Request classification (6 types) | Agent implementation |
| Domain detection from keywords | Skill execution |
| Agent selection (26 agents) | Runtime orchestration (→ lifecycle-orchestrator) |
| Routing notification format | Checkpoint/recovery |

## Protocol

```
1. ANALYZE (Silent) → Detect domains from request keywords
2. SELECT → Choose specialist agent(s) from routing table
3. INFORM → Display: 🤖 **Engaging** ◆ @{agent}
4. APPLY → Load agent persona, rules, and skills
```

## Routing Table

| Request Type | Trigger Keywords | Agent |
|-------------|-----------------|-------|
| QUESTION | "what is", "explain" | - (direct response) |
| SURVEY | "analyze", "overview" | `explorer` |
| SIMPLE CODE | "fix", "add" (single file) | Domain agent |
| COMPLEX CODE | "build", "create" | `planner` → domain agents |
| DESIGN/UI | "design", "UI" | `frontend` / `mobile` |
| SLASH CMD | /build, /autopilot | Command-specific |

## Rules

- Silent analysis (no "I am analyzing...")
- Professional tone
- Respect `@agent` overrides from user
- Multi-domain → engage primary + secondary agents

## Integration

| Dependency | Type | Purpose |
|-----------|------|---------|
| `GEMINI.md` | Config | Master routing rules |
| `lifecycle-orchestrator` | Skill | Multi-agent coordination |
| `execution-reporter` | Skill | Routing transparency |

> **Note:** This skill codifies the routing logic defined in GEMINI.md § INTELLIGENT AGENT ROUTING.
> It does NOT contain executable scripts — routing is performed inline by the AI agent.

---

## Audit Logging (OpenTelemetry)

Even while operating silently, the router must emit routing telemetry:

| Event | Metadata Payload | Severity |
|-------|------------------|----------|
| `routing_analysis_started` | `{"prompt_length": 150, "keywords_detected": ["react", "api"]}` | `DEBUG` |
| `domain_detected` | `{"primary_domain": "frontend", "secondary_domain": "backend"}` | `DEBUG` |
| `agent_engaged` | `{"agent_id": "react-pro", "confidence_score": 0.95}` | `INFO` |

---

⚡ PikaKit v3.9.206
