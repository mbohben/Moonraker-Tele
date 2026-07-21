---
name: observability
description: >-
  OpenTelemetry-based observability: unified logs, metrics, and distributed traces.
  Use when setting up monitoring, adding telemetry, or configuring observability stacks.
  NOT for server management (use server-ops) or performance optimization (use perf-optimizer).
metadata:
  author: pikakit
  version: "3.9.206"
  category: devops-architect
  triggers: ["monitoring", "observability", "OpenTelemetry", "telemetry", "instrumentation"]
  coordinates_with: ["server-ops", "cicd-pipeline", "problem-checker"]
  success_metrics: ["0 Telemetry Errors", "100% Correlation"]
---

# Observability — Unified Telemetry with OpenTelemetry

> 3 pillars. Vendor-agnostic. Fixed sampling. Auto-instrumentation first.

**Key:** Set up once, benefit everywhere (logs, metrics, traces share same SDK).

---

## 5 Must-Ask Questions (Before Any Setup)

| # | Question | Options |
|---|----------|---------|
| 1 | Runtime Environment? | Node.js, Python, Go |
| 2 | Telemetry Provider? | Datadog, Grafana, Sentry, OSS |
| 3 | Desired Coverage? | Logs, Metrics, Traces or All |
| 4 | Deployment Target? | K8s, Serverless, VM |
| 5 | Privacy Constraints? | PII masking, GDPR, HIPAA |

---

## Prerequisites

| Runtime | Install Command |
|---------|----------------|
| Node.js | `npm install @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node` |
| Python | `pip install opentelemetry-sdk opentelemetry-instrumentation` |

---

## When to Use

| Situation | Action |
|-----------|--------|
| Need unified telemetry | Set up OpenTelemetry SDK |
| Debug production issues | Check traces (trace_id) |
| Monitor performance | Use metrics |
| Track errors | Configure structured logging |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| SDK configuration (Node.js, Python) | Infrastructure provisioning (→ server-ops) |
| Sampling strategy (3 environments) | Alerting rules (→ /monitor workflow) |
| Provider routing (3 providers) | CI/CD monitoring (→ cicd-pipeline) |
| Auto-instrumentation guidance | Dashboard design |

**Expert decision skill:** Produces configuration guidance. Does not install packages.

---

## Three Pillars (Unified via trace_id)

| Pillar | Purpose | Example |
|--------|---------|---------|
| **Logs** | Events with context | "User login failed" |
| **Metrics** | Numerical measurements | "CPU usage: 45%" |
| **Traces** | Request flow | "API call took 250ms" |

---

## Sampling by Environment (Fixed)

| Environment | Rate | Rationale |
|-------------|------|-----------|
| Development | 100% | Full visibility for debugging |
| Staging | 50% | Balance cost vs visibility |
| Production | 1-10% | Cost control |

---

## Auto-Instrumented Libraries (Fixed)

| Library | Data Captured |
|---------|--------------|
| HTTP | Request/response, status codes |
| Express | Routes, middleware timing |
| Prisma | Database queries |
| Redis | Commands, latency |
| Next.js | Page loads, API routes |

---

## Provider Integration (Fixed)

| Provider | Exporter |
|----------|----------|
| Datadog | `@opentelemetry/exporter-datadog` |
| Grafana | OTLP HTTP with auth |
| Sentry | `@sentry/node` |

---

## Audit Logging (OpenTelemetry)

| Event | Metadata Payload | Severity |
|-------|------------------|----------|
| `architecture_decision` | `{"runtime": "...", "provider": "..."}` | `INFO` |
| `instrumentation_plan` | `{"auto_captured": 5, "manual": 2}` | `INFO` |
| `build_verification` | `{"status": "pass|fail", "metrics_met": true}` | `INFO` |

All executions MUST emit the `build_verification` span before reporting completion.

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_RUNTIME` | Yes | Runtime not nodejs or python |
| `ERR_UNKNOWN_ENVIRONMENT` | Yes | Environment not recognized |
| `ERR_UNKNOWN_PROVIDER` | Yes | Provider not one of 3 |

**Zero internal retries.** Deterministic; same context = same configuration.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Create excessive custom spans | Use auto-instrumentation first |
| Put sensitive data in span tags | Sanitize all tags before export |
| Hardcode SERVICE_NAME | Use environment variable |
| Sample 100% in production | Use 1-10% for production |
| Ignore errors in telemetry | Log all exceptions |
| Ignore IDE warnings/errors | Call `problem-checker` to auto-fix |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| No traces appearing | Check `OTEL_EXPORTER_OTLP_ENDPOINT` is set |
| High cardinality metrics | Reduce label values, use histograms |
| Missing spans | Verify auto-instrumentation is loaded |
| Prometheus scrape fails | Check `/metrics` endpoint and firewall |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `/monitor` | Workflow | Monitoring setup |
| `server-ops` | Skill | Server management |
| `cicd-pipeline` | Skill | Deployment monitoring |

---

⚡ PikaKit v3.9.206
