---
title: Observability � Engineering Specification
impact: MEDIUM
tags: observability
---

# Observability � Engineering Specification

> Production-grade specification for OpenTelemetry-based observability at FAANG scale.

---

## 1. Overview

Observability provides structured decision frameworks for production telemetry: three pillars (logs, metrics, traces), OpenTelemetry SDK setup (Node.js, Python), auto-instrumentation routing, environment-based sampling, provider integration, and troubleshooting. The skill operates as an **Expert (decision tree)** � it produces SDK configuration decisions, sampling strategies, provider selection, and instrumentation guidance. It does not install packages, configure infrastructure, or deploy collectors.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None � new spec for first hardening

---

## 2. Problem Statement

Production observability at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| No telemetry correlation | 55% of apps lack trace-log-metric linking | Cannot trace request flow |
| Vendor lock-in | 40% of apps use proprietary SDKs | Costly migration |
| Trace oversampling in production | 30% of apps sample 100% in prod | Excessive cost |
| Missing auto-instrumentation | 45% of apps rely on manual spans | Incomplete coverage |

Observability eliminates these with OpenTelemetry (vendor-agnostic), unified correlation (trace_id across all pillars), fixed sampling rates by environment, and auto-instrumentation-first guidance.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Three pillars unified | Logs + Metrics + Traces via single SDK |
| G2 | Vendor-agnostic | OpenTelemetry SDK; switchable exporters |
| G3 | Fixed sampling | Dev: 100%, Staging: 50%, Prod: 1-10% |
| G4 | Auto-instrumentation first | 5+ libraries auto-captured |
| G5 | Provider routing | 3 providers: Datadog, Grafana, Sentry |
| G6 | SDK quickstart | Node.js + Python setup in < 10 lines |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | Infrastructure provisioning | Owned by `server-ops` skill |
| NG2 | Alerting rules | Owned by `/monitor` workflow |
| NG3 | Incident response | Owned by incident-response patterns |
| NG4 | CI/CD monitoring | Owned by `cicd-pipeline` skill |
| NG5 | Custom collector deployment | Infrastructure concern |
| NG6 | Dashboard design | Provider-specific UI |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| SDK configuration (Node.js, Python) | Setup guidance | Package installation |
| Sampling strategy (3 environments) | Rate selection | Collector configuration |
| Provider integration (3 providers) | Exporter selection | Provider account setup |
| Auto-instrumentation routing | Library list | Library internals |
| Three-pillar correlation | trace_id propagation guidance | Collector pipeline |

**Side-effect boundary:** Observability produces SDK configuration guidance, sampling decisions, and provider recommendations. It does not install packages, modify infrastructure, or create dashboards.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "sdk-setup" | "sampling" | "provider" | "instrumentation" |
                              # "troubleshoot" | "full-guide"
Context: {
  runtime: string             # "nodejs" | "python"
  environment: string         # "development" | "staging" | "production"
  provider: string | null     # "datadog" | "grafana" | "sentry" | null
  libraries: Array<string> | null  # Libraries in use (e.g., ["express", "prisma"])
  issue: string | null        # Troubleshooting issue description
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  sdk_setup: {
    runtime: string           # "nodejs" | "python"
    install_command: string
    config_snippet: string    # SDK initialization code
    service_name_env: string  # "SERVICE_NAME"
  } | null
  sampling: {
    environment: string
    rate_percent: number      # 1-100
    rationale: string
  } | null
  provider: {
    name: string
    exporter_package: string
    config_notes: string
  } | null
  instrumentation: {
    auto_captured: Array<{
      library: string
      data_captured: string
    }>
    manual_required: Array<string> | null
  } | null
  troubleshooting: {
    problem: string
    solution: string
  } | null
  metadata: {
    contract_version: string
    backward_compatibility: string
  }
}
Error: ErrorSchema | null
```

#### Error Schema

```
Code: string                  # From Error Taxonomy (Section 11)
Message: string
Request_Type: string
Recoverable: boolean
```

#### Deterministic Guarantees

- Sampling is fixed: development ? 100%, staging ? 50%, production ? 1-10%.
- SDK setup is deterministic per runtime: Node.js ? `@opentelemetry/sdk-node`, Python ? `opentelemetry-sdk`.
- Provider mapping is fixed: Datadog ? `@opentelemetry/exporter-datadog`, Grafana ? OTLP HTTP, Sentry ? `@sentry/node`.
- Auto-instrumentation libraries are fixed: HTTP, Express, Prisma, Redis, Next.js.
- Three pillars always unified via trace_id.

#### What Agents May Assume

- OpenTelemetry is the standard SDK for all telemetry.
- Auto-instrumentation captures HTTP, Express, Prisma, Redis, Next.js without manual code.
- Sampling rates are fixed per environment.
- trace_id correlates logs, metrics, and traces.

#### What Agents Must NOT Assume

- Packages are installed.
- Collector infrastructure exists.
- Provider accounts are configured.
- 100% sampling is acceptable in production.
- Custom spans are needed when auto-instrumentation covers the library.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| SDK setup | None; code snippet output |
| Sampling | None; rate recommendation |
| Provider | None; exporter recommendation |
| Instrumentation | None; library list |
| Troubleshoot | None; solution text |
| Full guide | None; combined output |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Identify runtime (Node.js or Python) and environment
2. Invoke sdk-setup for configuration
3. Invoke sampling for rate selection
4. Invoke provider for exporter selection (if provider known)
5. Invoke instrumentation for auto-captured library list
6. Install and configure (caller's responsibility)
```

#### Execution Guarantees

- Each invocation produces a complete recommendation.
- All decisions are independent (can be invoked in any order).

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Unknown runtime | Return error | Specify nodejs or python |
| Unknown environment | Return error | Specify dev, staging, or production |
| Unknown provider | Return error | Specify datadog, grafana, or sentry |

#### Retry Boundaries

- Zero internal retries. Deterministic output.

#### Isolation Model

- Each invocation is stateless and independent.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| SDK setup | Yes | Same runtime = same config |
| Sampling | Yes | Same environment = same rate |
| Provider | Yes | Same provider = same exporter |
| Instrumentation | Yes | Fixed library list |
| Troubleshoot | Yes | Same issue = same solution |

---

## 7. Execution Model

### 2-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Classify** | Validate runtime, environment, request type | Classification |
| **Recommend** | Generate SDK config, sampling rate, or provider guidance | Complete output |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Three pillars unified | Logs + Metrics + Traces via single SDK; always correlated via trace_id |
| Vendor-agnostic | OpenTelemetry SDK only; never proprietary SDK |
| Fixed sampling rates | Dev: 100%, Staging: 50%, Prod: 1-10% |
| Auto-instrumentation first | Use auto-instrumentation; add manual spans only for business logic |
| Fixed provider mapping | Datadog, Grafana (OTLP), Sentry � fixed exporter packages |
| SERVICE_NAME required | Always set via environment variable |
| No sensitive data in spans | Sanitize all tag values before export |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown runtime | Return `ERR_UNKNOWN_RUNTIME` | Specify nodejs or python |
| Unknown environment | Return `ERR_UNKNOWN_ENVIRONMENT` | Specify dev, staging, or production |
| Unknown provider | Return `ERR_UNKNOWN_PROVIDER` | Specify datadog, grafana, or sentry |
| Invalid request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported type |

**Invariant:** Every failure returns a structured error. No partial recommendations.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_UNKNOWN_RUNTIME` | Validation | Yes | Runtime not nodejs or python |
| `ERR_UNKNOWN_ENVIRONMENT` | Validation | Yes | Environment not recognized |
| `ERR_UNKNOWN_PROVIDER` | Validation | Yes | Provider not one of 3 |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Decision generation | N/A | N/A | Synchronous; < 50ms |
| Internal retries | Zero | Zero | Deterministic output |

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "observability",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "runtime": "string",
  "environment": "string",
  "provider": "string|null",
  "sampling_rate": "number|null",
  "status": "success|error",
  "error_code": "string|null",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| SDK config generated | INFO | runtime, service_name |
| Sampling rate selected | INFO | environment, rate_percent |
| Provider recommended | INFO | provider, exporter_package |
| Instrumentation listed | INFO | libraries_count |
| Decision failed | ERROR | error_code, message |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `observability.decision.duration` | Histogram | ms |
| `observability.runtime.distribution` | Counter | nodejs vs python |
| `observability.environment.distribution` | Counter | dev vs staging vs prod |
| `observability.provider.distribution` | Counter | per provider |

---

## 14. Security & Trust Model

### Data Handling

- Observability processes no credentials, API keys, or PII.
- SDK configuration snippets contain no secrets (SERVICE_NAME via env var).
- No network calls, no file access.

### Telemetry Security Guidance

| Rule | Enforcement |
|------|-------------|
| No sensitive data in span tags | Sanitize before export |
| SERVICE_NAME via environment variable | Never hardcoded |
| OTEL_EXPORTER_OTLP_ENDPOINT via env var | Never in code |
| Provider API keys via env vars | Never in config snippets |

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound decision tree | < 50ms; scales linearly |
| Concurrency | Stateless invocations | Unlimited parallel |
| Memory per invocation | < 1 MB | No accumulation |
| Network | Zero network calls | No external dependency |

---

## 16. Concurrency Model

Fully parallel. No shared state. No coordination required.

---

## 17. Resource Lifecycle Management

All resources scoped to invocation. No persistent handles.

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| SDK config generation | < 2 ms | < 5 ms | 20 ms |
| Sampling decision | < 1 ms | < 3 ms | 10 ms |
| Full guide | < 10 ms | < 30 ms | 50 ms |
| Output size | = 2,000 chars | = 5,000 chars | 8,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| OpenTelemetry SDK breaking changes | Low | Config snippets outdated | Track OTel releases |
| Provider exporter deprecation | Medium | Wrong package name | Review annually |
| Sampling rate too high in prod | High | Excessive cost | Fixed 1-10% enforced |
| Auto-instrumentation coverage gaps | Low | Missing spans | Manual spans for business logic |
| High cardinality metrics | Medium | Storage explosion | Reduce label values; use histograms |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ? | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ? | Entry point under 200 lines |
| Prerequisites documented | ? | OpenTelemetry SDK packages listed |
| When to Use section | ? | Situation-based routing table |
| Core content matches skill type | ? | Expert type: decision trees, configuration guidance |
| Troubleshooting section | ? | Troubleshooting table with 4 solutions |
| Related section | ? | Cross-links to server-ops, cicd-pipeline, /monitor |
| Content Map for multi-file | ? | Link to engineering-spec.md |
| Contract versioning | ? | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ? | This table with ?/? + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | Three pillars (logs, metrics, traces) unified via OTel | ? |
| **Functionality** | SDK setup for Node.js and Python | ? |
| **Functionality** | Fixed sampling (100% / 50% / 1-10%) | ? |
| **Functionality** | Auto-instrumentation (5+ libraries) | ? |
| **Functionality** | Provider routing (3 providers) | ? |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ? |
| **Contracts** | Contract versioning with semver | ? |
| **Failure** | Error taxonomy with 4 categorized codes | ? |
| **Failure** | Zero internal retries | ? |
| **Determinism** | Fixed sampling rates, fixed provider map, fixed SDK config | ? |
| **Security** | No credentials in snippets; all via env vars | ? |
| **Observability** | Structured log schema with 5 mandatory fields | ? |
| **Observability** | 4 metrics defined | ? |
| **Performance** | P50/P99 targets for all operations | ? |
| **Scalability** | Stateless; unlimited parallel | ? |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ? |

---

? PikaKit v3.9.206
