---
description: Production observability stack — OpenTelemetry instrumentation, structured logging, Prometheus/Grafana dashboards, distributed tracing, and PagerDuty incident alerting.
skills: [observability, server-ops, problem-checker, context-engineering, knowledge-compiler]
agents: [orchestrator, assessor, recovery, learner, devops-engineer]
---


# /monitor - Production Observability

$ARGUMENTS

---

## Purpose

Set up production observability infrastructure — OpenTelemetry SDK, structured logging, Prometheus metrics, distributed tracing, and incident alerting with runbooks. **Differs from `/launch` (production deployment) and `/diagnose` (root cause analysis) by establishing the full observability foundation for production monitoring.** Uses `cicd-pipeline` with `observability` for instrumentation and `server-ops` for infrastructure configuration.

---

## 🤖 Meta-Agents Integration

| Phase | Agent | Action |
| ----- | ----- | ------ |
| **Pre-Flight** | `assessor` | Evaluate monitoring scope, providers, and knowledge-compiler patterns |
| **Execution** | `orchestrator` | Coordinate OpenTelemetry, metrics, logs, traces, and alerts |
| **Safety** | `recovery` | Save state checkpoint before infrastructure changes |
| **Post-Setup** | `learner` | Log monitoring patterns for future setups |

```
Flow:
assessor.evaluate(scope, provider) → recovery.save()
       ↓
setup OpenTelemetry → logs → metrics → traces → alerts
       ↓
learner.log(monitoring_patterns)
```

---

## Sub-Commands

| Command | Action |
|---------|--------|
| `/monitor` | Full observability setup (all 5 phases) |
| `/monitor <app-name>` | Setup for specific application |
| `/monitor --provider datadog` | Use specific provider |

---

## 🔴 MANDATORY: Observability Setup Protocol

### Phase 0: Dynamic Skill Detection & Pre-flight

> **Protocol:** `.agent/rules/dynamic-skill-detection.md`
> **Rule 0.5-K:** knowledge-compiler pattern check.

1. Scan `$ARGUMENTS` for domain signals and inject matched skills.
2. Read `.agent/knowledge/patterns/` for past failures before proceeding.
3. Trigger `recovery` agent to run Checkpoint (`git commit -m "chore(checkpoint): pre-monitor"`).


### Phase 0.5: Auto-Knowledge Ingest (Git Scanner)

> **Protocol:** `.agent/rules/auto-knowledge-ingest.md`
> **Channel 1:** Scans recent git commits for project-specific lessons.

```
1. Check if .agent/knowledge/ exists — if not, skip
2. Read _index.md → get last_git_scan SHA
3. Run: git log --since="7 days ago" --grep="^fix:\|^feat:" -n 20
4. For qualifying commits (≥2 files changed OR keywords: fallback, guard, CORS, rate-limit):
   a. Skip if signal with same commit SHA exists
   b. Generate signal to raw-signals/SIG-{NNN}.md
5. Update last_git_scan in _index.md
6. If uncompiled signals > 5 → auto-compile (max 10 per batch)
```

### Phase 2: Foundation (OpenTelemetry)

| Field | Value |
|-------|-------|
| **INPUT** | $ARGUMENTS (app name + optional provider/requirements) |
| **OUTPUT** | OpenTelemetry SDK initialized, provider configured, auto-instrumentation enabled |
| **AGENTS** | `cicd-pipeline`, `assessor` |
| **SKILLS** | `observability`, `context-engineering` |

// turbo — telemetry: phase-2-foundation

1. `assessor` evaluates monitoring scope
2. Select provider:

| Provider | Use Case |
|----------|----------|
| **Datadog** | Full-stack monitoring |
| **New Relic** | APM and infrastructure |
| **Sentry** | Error tracking and performance |
| **Grafana Cloud** | Open-source stack |
| **Self-hosted** | Prometheus + Jaeger + Loki |

3. Install OpenTelemetry SDK and configure exporters
4. Enable auto-instrumentation (HTTP, DB, Redis)

### Phase 3: Structured Logging

| Field | Value |
|-------|-------|
| **INPUT** | OpenTelemetry foundation from Phase 2 |
| **OUTPUT** | Structured logger with PII masking, correlation IDs, cloud aggregation |
| **AGENTS** | `orchestrator`, `cicd-pipeline` |
| **SKILLS** | `observability` |

// turbo — telemetry: phase-3-logging

1. Setup Pino/Winston with JSON formatting
2. Configure PII redaction (email, phone, SSN, credit card)
3. Cloud aggregation (Datadog Logs, CloudWatch, Loki)
4. Enable correlation IDs for request tracing

### Phase 4: Metrics & Dashboards

| Field | Value |
|-------|-------|
| **INPUT** | Logger from Phase 3 |
| **OUTPUT** | Prometheus `/metrics` endpoint, Golden Signals dashboard |
| **AGENTS** | `cicd-pipeline` |
| **SKILLS** | `observability`, `server-ops` |

// turbo — telemetry: phase-4-metrics

1. Expose Prometheus `/metrics` endpoint
2. Configure Golden Signals:

| Signal | Metrics |
|--------|---------|
| **Latency** | p50, p95, p99 response times |
| **Traffic** | Requests/sec |
| **Errors** | Error rate (%) |
| **Saturation** | CPU, memory usage |

3. Add custom business metrics (signups, orders, revenue)
4. Create Grafana/Datadog dashboard

### Phase 5: Distributed Tracing (optional)

| Field | Value |
|-------|-------|
| **INPUT** | Metrics from Phase 4 |
| **OUTPUT** | Auto-instrumented traces with context propagation |
| **AGENTS** | `cicd-pipeline` |
| **SKILLS** | `observability` |

1. Enable auto-instrumentation (HTTP, Prisma, Redis)
2. Configure sampling (10% production, 100% dev)
3. Enable W3C trace context propagation
4. Verify traces visible in APM provider

### Phase 6: Alerting & Incident Response

| Field | Value |
|-------|-------|
| **INPUT** | Full observability stack from Phases 2-5 |
| **OUTPUT** | Alert rules, Slack/PagerDuty integration, runbooks |
| **AGENTS** | `cicd-pipeline`, `learner` |
| **SKILLS** | `observability`, `server-ops`, `problem-checker`, `knowledge-compiler` |

Default alert rules:

| Alert | Threshold | Severity | Notification |
|-------|-----------|----------|-------------|
| High Error Rate | >1% for 5min | Critical | Slack + PagerDuty |
| High Latency | p95 >500ms | High | Slack |
| Health Check Failed | <100% | Critical | Slack + PagerDuty |
| Memory Usage | >90% | High | Slack |
| Database Timeout | >3 in 5min | High | Slack |

Runbooks generated:
- High error rate investigation
- High latency debugging
- Health check failure response
- Database timeout resolution
- Memory leak investigation

---

## ⛔ MANDATORY: Problem Verification Before Completion

> **CRITICAL:** This check MUST be performed before any `notify_user` or task completion.

### Check @[current_problems]

```
1. Read @[current_problems] from IDE
2. If errors/warnings > 0:
   a. Auto-fix: imports, types, lint errors
   b. Re-check @[current_problems]
   c. If still > 0 → STOP → Notify user
3. If count = 0 → Proceed to completion
```

### Auto-Fixable

| Type | Fix |
|------|-----|
| Missing import | Add import statement |
| Type mismatch | Fix type annotation |
| Lint errors | Run eslint --fix |

> **Rule:** Never mark complete with errors in `@[current_problems]`.



---

## 📚 MANDATORY: Post-Completion Knowledge Check

> **Protocol:** `.agent/rules/auto-knowledge-ingest.md`
> **Channel 2:** AI self-reflects on session to capture non-trivial lessons.

```
1. Self-reflect: "Was this session non-trivial?"
   - Did I fix a multi-file bug?
   - Did I discover a framework/API gotcha?
   - Did I make an architectural decision?
   - Did I work around a platform limitation?
2. If ALL answers are NO → skip (trivial session)
3. If ANY answer is YES:
   a. Score significance (multi-file: +2, workaround: +3, API quirk: +3)
   b. If score ≥ 3 → generate signal to raw-signals/SIG-{NNN}.md
   c. If uncompiled signals > 5 → auto-compile
4. Proceed to "Suggest Next Workflow"
```

---

## ⏭️ MANDATORY: Suggest Next Workflow

> **After completing /monitor, you MUST suggest the feedback loop to the user.**

```
✅ /monitor complete → Suggest: "Run `/think` to plan next iteration (feedback loop)."
```

---

## 🔙 Rollback & Recovery

If observability setup causes application crashes or aggressive memory leaks:
1. Revert infrastructure configs/SDK wrappers using `recovery` meta-agent.
2. Remove any auto-instrumentation hooks from startup scripts.
3. Fallback to previous safe state before generating Output Format.

---

---

## Examples

```
/monitor setup OpenTelemetry for Node.js Express API
/monitor add structured logging with Winston
/monitor create Grafana dashboard for API latency
/monitor configure PagerDuty alerting for 5xx errors
/monitor trace distributed request across microservices
```

---

## 🔗 Workflow Chain

```mermaid
graph LR
    A["/launch"] --> B["/monitor"]
    B --> C["/diagnose"]
    B -.->|feedback| D["/think"]
    style B fill:#10b981
```

| After /monitor | Run | Purpose |
|---------------|-----|---------|
| Issues detected | `/diagnose` | Root cause analysis using traces |
| Performance issues | `/optimize` | Optimize using collected metrics |
| Cycle complete | `/think` | **Feedback loop** — plan next iteration |

**Handoff to /think (feedback loop):**

```markdown
📊 Monitoring active! All systems healthy.
Metrics: [summary]. Alerts: [count] configured.
Run `/think` to plan next iteration or `/diagnose` if issues arise.
```
