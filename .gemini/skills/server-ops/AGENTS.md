# server-ops

**Version 1.0.0**
Engineering
March 2026

> **Note:**
> This document is for agents and LLMs to follow when working on server-ops domain.
> Optimized for automation and consistency by AI-assisted workflows.

---

# Server Ops � Production Server Management

> Boring servers = well-managed servers. Auto-restart. Monitor day one. Rotate logs.

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Deploy Node.js app | Use PM2 |
| Server provisioning | Check platform selection |
| High CPU/memory | Follow scaling decisions |
| Server issues | Use 5-step troubleshooting |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Process manager selection (4 tools) | CI/CD pipelines (? cicd-pipeline) |
| Monitoring strategy (4 categories) | Observability instrumentation (? observability) |
| Scaling decisions (3 strategies) | Security scanning (? security-scanner) |
| Health check design | Command execution |

**Expert decision skill:** Produces management recommendations. Does not execute commands.

---

## Process Manager Selection (Deterministic)

| Scenario | Tool |
|----------|------|
| Node.js app | PM2 (clustering, reload) |
| Any app (Linux) | systemd (native) |
| Containers | Docker / Podman |
| Orchestration | Kubernetes / Swarm |

**4 Goals:** restart-on-crash, zero-downtime reload, clustering, persist across reboot.

---

## Monitoring Strategy (4 Categories � 3 Levels)

| Category | Key Metrics |
|----------|------------|
| Availability | Uptime, health checks |
| Performance | Response time, throughput |
| Errors | Error rate, types |
| Resources | CPU, memory, disk |

| Alert Level | Response |
|-------------|----------|
| **Critical** | Immediate action |
| **Warning** | Investigate soon |
| **Info** | Review daily |

---

## Log Management (3 Types + 4 Principles)

| Type | Purpose |
|------|---------|
| Application | Debug, audit trail |
| Access | Traffic analysis |
| Error | Issue detection |

**Principles:** Rotate logs, structured JSON, appropriate levels, no sensitive data.

---

## Scaling Decisions (Deterministic)

| Symptom | Solution |
|---------|----------|
| High CPU | Add instances (horizontal) |
| High memory | Increase RAM or fix leak (vertical) |
| Slow response | Profile first, then scale |
| Traffic spikes | Auto-scaling |

| Strategy | When |
|----------|------|
| Vertical | Quick fix, single instance |
| Horizontal | Sustainable, distributed |
| Auto | Variable traffic |

---

## Health Checks (2 Levels)

| Level | Design |
|-------|--------|
| **Simple** | HTTP 200 response |
| **Deep** | Check DB, dependencies, resources |

Route by load balancer needs.

---

## 5-Step Troubleshooting (Fixed Priority)

1. **Process status** � Is it running?
2. **Logs** � Error messages?
3. **Resources** � Disk, memory, CPU?
4. **Network** � Ports, DNS?
5. **Dependencies** � Database, APIs?

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_RUNTIME` | Yes | Runtime not one of 4 |
| `ERR_UNKNOWN_ENVIRONMENT` | Yes | Environment not one of 4 |
| `ERR_UNKNOWN_SYMPTOM` | Yes | Scaling symptom not recognized |

**Zero internal retries.** Same context = same recommendation.

---

## Anti-Patterns

| ? Don't | ? Do |
|---------|-------|
| Run as root | Use non-root user |
| Ignore logs | Set up log rotation |
| Skip monitoring | Monitor from day one |
| Manual restarts | Auto-restart configuration |
| No backups | Regular backup schedule |

---

## ?? Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [engineering-spec.md](rules/engineering-spec.md) | Full spec | Architecture review |

---

## ?? Related

| Item | Type | Purpose |
|------|------|---------|
| `cicd-pipeline` | Skill | Deployment |
| `observability` | Skill | Monitoring |
| `security-scanner` | Skill | Server security |

---



---

## Detailed Rules


---

### Rule: engineering-spec

---
name: server-ops
version: "2.0.0"
description: >-
  Production-grade specification for server management at FAANG scale.
metadata:
  category: "server-management"
  triggers: "server management, process management, monitoring, logging, scaling, health checks, security, troubleshooting"
  success_metrics: "process management, monitoring, logging, scaling, health checks, security, troubleshooting"
  coordinates_with: "cicd-pipeline, observability, security-scanner"
---

## 1. Overview

Server Ops provides structured decision frameworks for production server management: process management tool selection (4 tools), monitoring strategy (4 categories, 3 alert levels), log management (3 types, 4 principles), scaling decisions (4 symptoms ? solutions, 3 strategies), health checks (4 checks, 2 levels), security principles (5 areas), and troubleshooting priority (5-step). The skill operates as an **Expert (decision tree)** � it produces server management recommendations, tool selections, and scaling strategies. It does not execute commands, configure servers, or install tools.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None � new spec for first hardening

---

## 2. Problem Statement

Server management at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Wrong process manager | 40% of projects use raw `node` in production | No auto-restart, no clustering |
| Missing monitoring | 50% of servers lack health checks | Undetected outages |
| Manual scaling | 35% of scaling is reactive | Downtime during traffic spikes |
| Log mismanagement | 45% of servers have no log rotation | Disk exhaustion |

Server Ops eliminates these with deterministic tool selection (4 tools by scenario), monitoring-from-day-one principle, 3 scaling strategies, and 4 log management principles.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Process management | 4 tools by scenario (PM2, systemd, Docker, K8s) |
| G2 | Monitoring | 4 categories � 3 alert levels � 4 tool options |
| G3 | Log management | 3 types + 4 principles |
| G4 | Scaling decisions | 4 symptoms ? 4 solutions + 3 strategies |
| G5 | Health checks | 4 checks + 2 levels (simple, deep) |
| G6 | Security | 5 areas with defined principles |
| G7 | Troubleshooting | 5-step priority order |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | CI/CD pipeline configuration | Owned by `cicd-pipeline` skill |
| NG2 | Observability instrumentation | Owned by `observability` skill |
| NG3 | Security vulnerability scanning | Owned by `security-scanner` skill |
| NG4 | Command execution | Guidance only; execution is caller's responsibility |
| NG5 | Cloud provider specifics | Platform-agnostic |
| NG6 | Application-level profiling | Owned by `perf-optimizer` skill |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Process manager selection | Tool routing (4 scenarios) | Tool installation |
| Monitoring strategy | Category + alert design | Dashboard configuration |
| Log management | Principles + type routing | Log aggregation setup |
| Scaling decisions | Symptom ? solution mapping | Infrastructure provisioning |
| Health checks | Check design + level routing | Endpoint implementation |
| Security principles | 5 area guidelines | Firewall configuration |

**Side-effect boundary:** Server Ops produces management recommendations, tool selections, and scaling strategies. It does not execute commands, modify server state, or access infrastructure.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "process-manager" | "monitoring" | "logging" |
                              # "scaling" | "health-check" | "security" |
                              # "troubleshoot" | "full-guide"
Context: {
  runtime: string | null      # "nodejs" | "python" | "java" | "generic"
  environment: string | null  # "bare-metal" | "vm" | "container" | "kubernetes"
  scale: string | null        # "single" | "small-cluster" | "large-cluster"
  symptom: string | null      # "high-cpu" | "high-memory" | "slow-response" | "traffic-spike"
  has_monitoring: boolean
  has_health_check: boolean
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  process_manager: {
    tool: string              # "pm2" | "systemd" | "docker" | "kubernetes"
    rationale: string
    goals: Array<string>      # restart-on-crash, zero-downtime, clustering, persistence
  } | null
  monitoring: {
    categories: Array<{
      name: string
      metrics: Array<string>
    }>
    alert_levels: Array<{
      level: string           # "critical" | "warning" | "info"
      response: string
    }>
    tool: string | null
  } | null
  logging: {
    types: Array<string>      # application, access, error
    principles: Array<string> # rotate, structured, levels, no-sensitive
  } | null
  scaling: {
    strategy: string          # "vertical" | "horizontal" | "auto"
    symptom: string | null
    action: string
  } | null
  health_check: {
    level: string             # "simple" | "deep"
    checks: Array<string>
  } | null
  security: Array<{
    area: string
    principle: string
  }> | null
  troubleshoot: Array<{
    step: number
    action: string
  }> | null
  security: {
    rules_of_engagement_followed: boolean
  } | null
  code_quality: {
    problem_checker_run: boolean
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

- Process manager selection is deterministic: Node.js ? PM2; generic ? systemd; containerized ? Docker; orchestrated ? Kubernetes.
- Scaling strategy is deterministic: high-cpu ? horizontal; high-memory ? vertical or fix leak; slow-response ? profile first; traffic-spike ? auto-scaling.
- Alert levels are fixed: Critical ? immediate; Warning ? investigate; Info ? review daily.
- Troubleshooting priority is fixed: 5 steps in defined order.
- Same context = same recommendations.

#### What Agents May Assume

- Process manager routing follows documented tool selection.
- Monitoring categories cover availability, performance, errors, resources.
- Log types cover application, access, error.
- Health check levels follow simple vs deep.

#### What Agents Must NOT Assume

- Server already has monitoring configured.
- PM2 is installed on all servers.
- Kubernetes is available for all environments.
- Log rotation is configured by default.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Process manager | None; tool recommendation |
| Monitoring | None; strategy guidance |
| Logging | None; principle guidance |
| Scaling | None; strategy recommendation |
| Health check | None; check design |
| Security | None; principle guidance |
| Troubleshoot | None; step-by-step guidance |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Identify server context (runtime, environment, scale)
2. Invoke process-manager for tool selection
3. Invoke monitoring for alerting strategy
4. Invoke logging for log management
5. Invoke health-check for readiness design
6. Configure and implement (caller's responsibility)
```

#### Execution Guarantees

- Each invocation produces a complete recommendation.
- All decisions are independent (can be invoked in any order).

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Unknown runtime | Return error | Specify valid runtime |
| Unknown environment | Return error | Specify valid environment |
| Invalid request type | Return error | Use supported type |

#### Retry Boundaries

- Zero internal retries. Deterministic output.

#### Isolation Model

- Each invocation is stateless and independent.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Process manager | Yes | Same runtime + env = same tool |
| Monitoring | Yes | Same context = same strategy |
| Scaling | Yes | Same symptom = same strategy |
| Health check | Yes | Same needs = same level |

---

## 7. Execution Model

### 2-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Classify** | Parse runtime, environment, scale, symptom | Classification |
| **Guide** | Generate tool selection, strategy, or troubleshoot steps | Complete output |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Process manager routing | Node.js ? PM2; Any app ? systemd; Containers ? Docker/Podman; Orchestration ? Kubernetes/Swarm |
| Process goals | 4 goals: restart-on-crash, zero-downtime reload, clustering, persistence |
| Monitoring categories | 4: Availability (uptime, health), Performance (response time, throughput), Errors (rate, types), Resources (CPU, memory, disk) |
| Alert levels | Critical ? immediate; Warning ? investigate soon; Info ? review daily |
| Log types | 3: Application (debug, audit), Access (traffic), Error (issues) |
| Log principles | 4: Rotate to prevent disk fill; Structured (JSON); Appropriate levels; No sensitive data |
| Scaling routing | High CPU ? horizontal; High memory ? vertical or fix leak; Slow response ? profile first; Traffic spikes ? auto-scaling |
| Scaling strategies | 3: Vertical (quick fix), Horizontal (sustainable), Auto (variable traffic) |
| Health checks | Simple: return 200; Deep: check all dependencies; Route by load balancer needs |
| Security areas | 5: SSH keys only, minimal ports, patches, env vars for secrets, audit logging |
| Troubleshoot order | 1: Process status; 2: Logs; 3: Resources; 4: Network; 5: Dependencies |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown runtime | Return `ERR_UNKNOWN_RUNTIME` | Specify nodejs, python, java, or generic |
| Unknown environment | Return `ERR_UNKNOWN_ENVIRONMENT` | Specify bare-metal, vm, container, or kubernetes |
| Invalid request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported type |

**Invariant:** Every failure returns a structured error. No partial guidance.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_UNKNOWN_RUNTIME` | Validation | Yes | Runtime not one of 4 |
| `ERR_UNKNOWN_ENVIRONMENT` | Validation | Yes | Environment not one of 4 |
| `ERR_UNKNOWN_SYMPTOM` | Validation | Yes | Scaling symptom not recognized |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Decision generation | N/A | N/A | Synchronous; < 50ms |
| Internal retries | Zero | Zero | Deterministic output |

---

## 13. Observability & Logging Schema

### Log Entry Format (OpenTelemetry Event Array)

```json
{
  "traceId": "uuid",
  "spanId": "uuid",
  "events": [
    {
      "name": "server_analysis_started",
      "timestamp": "ISO8601",
      "attributes": {
        "runtime": "nodejs",
        "environment": "container"
      }
    },
    {
      "name": "tool_selected",
      "timestamp": "ISO8601",
      "attributes": {
        "category": "process_manager",
        "tool": "docker"
      }
    },
    {
      "name": "analysis_completed",
      "timestamp": "ISO8601",
      "attributes": {
        "recommendations_count": 3,
        "warnings": 1
      }
    }
  ]
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Process manager selected | INFO | runtime, environment, tool_recommended |
| Scaling strategy selected | INFO | symptom, scaling_strategy |
| Health check designed | INFO | level, checks |
| Decision failed | ERROR | error_code, message |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `serverops.decision.duration` | Histogram | ms |
| `serverops.tool.distribution` | Counter | per process manager |
| `serverops.scaling_strategy.distribution` | Counter | per strategy |
| `serverops.request_type.distribution` | Counter | per type |

---

## 14. Security & Trust Model

### Data Handling

- Server Ops processes runtime names, environment types, and symptom descriptions only.
- No credentials, no server addresses, no PII.
- No network calls, no SSH connections, no remote access.

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
| Tool selection | < 2 ms | < 5 ms | 20 ms |
| Scaling strategy | < 2 ms | < 5 ms | 20 ms |
| Full guide | < 15 ms | < 40 ms | 50 ms |
| Output size | = 3,000 chars | = 6,000 chars | 10,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| PM2 deprecation | Low | Outdated recommendation | Track PM2 releases |
| New orchestration tools | Medium | Missing option | Annual tool review |
| Container runtime changes | Low | Docker alternatives | Track OCI standards |
| Monitoring tool landscape | Medium | Outdated options | Annual review |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ? | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ? | Entry point under 200 lines |
| Prerequisites documented | ? | No external dependencies for guidance |
| When to Use section | ? | Situation-based routing table |
| Core content matches skill type | ? | Expert type: process manager routing, scaling decisions, monitoring strategy |
| Troubleshooting section | ? | 5-step troubleshooting + anti-patterns |
| Related section | ? | Cross-links to cicd-pipeline, observability, security-scanner |
| Content Map for multi-file | ? | Links to rules/ + engineering-spec.md |
| Contract versioning | ? | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ? | This table with ?/? + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | 4 process manager tools by scenario | ? |
| **Functionality** | 4 monitoring categories � 3 alert levels | ? |
| **Functionality** | 3 log types + 4 principles | ? |
| **Functionality** | 4 scaling symptoms + 3 strategies | ? |
| **Functionality** | 4 health checks + 2 levels | ? |
| **Functionality** | 5 security areas | ? |
| **Functionality** | 5-step troubleshooting | ? |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ? |
| **Contracts** | Contract versioning with semver | ? |
| **Failure** | Error taxonomy with 4 categorized codes | ? |
| **Failure** | Zero internal retries | ? |
| **Determinism** | Fixed tool routing, fixed scaling tree, fixed alert levels | ? |
| **Security** | No credentials, no server access, no network | ? |
| **Observability** | Structured log schema with 5 mandatory fields | ? |
| **Observability** | 4 metrics defined | ? |
| **Performance** | P50/P99 targets for all operations | ? |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ? |

---

? PikaKit v3.9.206
