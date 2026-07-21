# gitops-workflow

**Version 1.0.0**
Engineering
March 2026

> **Note:**
> This document is for agents and LLMs to follow when working on gitops domain.
> Optimized for automation and consistency by AI-assisted workflows.

---

# GitOps Workflow � Declarative Kubernetes Delivery

> Git is the single source of truth. Continuous reconciliation. No auto-sync to production.

---

## Prerequisites

**Required:** Kubernetes cluster, `kubectl`, ArgoCD or Flux installed.

---

## When to Use

| Situation | Action |
|-----------|--------|
| K8s deployment needed | Choose ArgoCD or Flux via decision tree |
| CD pipeline setup | Configure sync policies per environment |
| Secret management | Use Sealed Secrets or External Secrets (no plaintext) |
| Multi-environment | Set up staging ? production promotion |
| Architecture review | Read `rules/engineering-spec.md` |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| ArgoCD vs Flux decision (4 criteria) | CI pipeline (? cicd-pipeline) |
| Sync policy selection (4 policies) | Server management (? server-ops) |
| Repository structure template | Git operations (? git-workflow) |
| OpenGitOps compliance (4 principles) | Cluster provisioning |
| Secret management strategy | Helm chart development |

**Expert decision skill:** Produces architecture decisions. No cluster modifications.

---

## OpenGitOps Principles (4 � All Required)

| # | Principle | Requirement |
|---|-----------|-------------|
| 1 | Declarative | Entire system described declaratively |
| 2 | Versioned | Desired state stored in Git |
| 3 | Pulled | Agents pull desired state (not pushed) |
| 4 | Reconciled | Agents continuously reconcile actual vs desired |

---

## ArgoCD vs Flux Decision Tree

| Criterion | ArgoCD | Flux |
|-----------|--------|------|
| Web UI | ? Rich dashboard | ? CLI only |
| Multi-cluster | ? Native support | ?? Requires setup |
| Helm support | ? Native | ? Native |
| Learning curve | Medium | Lower |

**Rule:** needs_ui=true OR cluster_count>1 ? **ArgoCD**. Otherwise ? **Flux**.

---

## Sync Policies (4)

| Policy | Environment | Behavior |
|--------|-------------|----------|
| **Manual** | Production | Requires explicit approval |
| **Auto** | Dev, Staging | Deploys on Git push |
| **Prune** | All | Removes resources not in Git |
| **Self-Heal** | All | Reverts manual cluster changes |

**Safety:** Production is ALWAYS manual sync. No exceptions.

---

## Repository Structure

```
gitops-repo/
+-- apps/
�   +-- production/
�   +-- staging/
+-- infrastructure/
�   +-- ingress-nginx/
�   +-- cert-manager/
+-- argocd/
    +-- applications/
```

---

## Safety Rules (Non-Negotiable)

| Rule | Enforcement |
|------|-------------|
| No auto-sync to production | Sync policy = manual |
| No secrets in Git | Sealed Secrets / External Secrets |
| Rollback tested | Rollback procedure in promotion workflow |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_MISSING_CLUSTER_COUNT` | Yes | Cluster count not provided |
| `ERR_MISSING_ENVIRONMENTS` | Yes | Environment list not provided |
| `ERR_INVALID_ENVIRONMENT` | Yes | Environment name not recognized |
| `ERR_REFERENCE_NOT_FOUND` | No | Reference file missing |

**Zero internal retries.** Deterministic; same context = same recommendation.

---

## Anti-Patterns

| ? Don't | ? Do |
|---------|-------|
| Auto-sync to production | Manual sync with approval |
| Store secrets in Git | Sealed Secrets / External Secrets |
| Push-based deployment | Pull-based reconciliation |
| Skip rollback testing | Test rollback on every release |
| Use imperative `kubectl apply` | Declarative manifests in Git |

---

## ?? Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [argocd-setup.md](rules/argocd-setup.md) | ArgoCD installation and config | ArgoCD selected |
| [sync-policies.md](rules/sync-policies.md) | Sync policy deep dive | Policy configuration |
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec | Architecture review |

---

## ?? Related

| Item | Type | Purpose |
|------|------|---------|
| `cicd-pipeline` | Skill | CI/CD pipeline |
| `server-ops` | Skill | Server management |
| `git-workflow` | Skill | Git operations |
| `/launch` | Workflow | Deployment |

---



---

## Detailed Rules


---

### Rule: argocd-setup

---
title: ArgoCD Setup and Configuration
impact: MEDIUM
tags: gitops
---

# ArgoCD Setup and Configuration

> Installation, access, SSO, and RBAC configuration for ArgoCD.

---

## Installation Methods

### 1. Standard Installation
```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

### 2. High Availability Installation
```bash
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/ha/install.yaml
```

### 3. Helm Installation
```bash
helm repo add argo https://argoproj.github.io/argo-helm
helm install argocd argo/argo-cd -n argocd --create-namespace
```

## Initial Configuration

### Access ArgoCD UI
```bash
# Port forward
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Get initial admin password
argocd admin initial-password -n argocd
```

### Configure Ingress
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: argocd-server-ingress
  namespace: argocd
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-passthrough: "true"
    nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
spec:
  ingressClassName: nginx
  rules:
  - host: argocd.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: argocd-server
            port:
              number: 443
  tls:
  - hosts:
    - argocd.example.com
    secretName: argocd-secret
```

## CLI Configuration

### Login
```bash
argocd login argocd.example.com --username admin
```

### Add Repository
```bash
argocd repo add https://github.com/org/repo --username user --password token
```

### Create Application
```bash
argocd app create my-app \
  --repo https://github.com/org/repo \
  --path apps/my-app \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace production
```

## SSO Configuration

### GitHub OAuth
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-cm
  namespace: argocd
data:
  url: https://argocd.example.com
  dex.config: |
    connectors:
      - type: github
        id: github
        name: GitHub
        config:
          clientID: $GITHUB_CLIENT_ID
          clientSecret: $GITHUB_CLIENT_SECRET
          orgs:
          - name: my-org
```

## RBAC Configuration
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-rbac-cm
  namespace: argocd
data:
  policy.default: role:readonly
  policy.csv: |
    p, role:developers, applications, *, */dev, allow
    p, role:operators, applications, *, */*, allow
    g, my-org:devs, role:developers
    g, my-org:ops, role:operators
```

## Best Practices

1. Enable SSO for production
2. Implement RBAC policies
3. Use separate projects for teams
4. Enable audit logging
5. Configure notifications
6. Use ApplicationSets for multi-cluster
7. Implement resource hooks
8. Configure health checks
9. Use sync windows for maintenance
10. Monitor with Prometheus metrics

---



---

### Rule: engineering-spec

---
title: GitOps Workflow � Engineering Specification
impact: MEDIUM
tags: gitops
---

# GitOps Workflow � Engineering Specification

> Production-grade specification for declarative Kubernetes deployment with ArgoCD and Flux at FAANG scale.

---

## 1. Overview

GitOps Workflow provides structured decision frameworks for declarative, Git-based Kubernetes continuous delivery: ArgoCD vs Flux tool selection, sync policy configuration (manual/auto/prune/self-heal), repository structure, OpenGitOps compliance, secret management strategy, and multi-environment promotion. The skill operates as an expert knowledge base with reference files � it produces architecture decisions and configuration guidance. It does not install tools, configure clusters, or modify Kubernetes resources.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None � new spec for first hardening

---

## 2. Problem Statement

Kubernetes deployment at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Imperative deployments | 45% of K8s deployments use `kubectl apply` ad-hoc | No audit trail, no rollback |
| Cluster drift | 35% of production clusters drift from declared state within 24h | State inconsistency |
| Secrets in Git | 20% of GitOps repos contain plaintext secrets | Credential exposure |
| No promotion workflow | 40% of multi-env setups lack structured promotion | Staging ? production |

GitOps Workflow eliminates these with declarative Git-as-source-of-truth, continuous reconciliation, sealed secrets, and environment promotion patterns.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Git as single source of truth | 100% of cluster state tracked in Git |
| G2 | Continuous reconciliation | Drift detected within reconciliation interval (default: 3 min) |
| G3 | ArgoCD vs Flux selection | Decision tree with 4 criteria (UI, multi-cluster, learning curve, team size) |
| G4 | Sync policy selection | 4 policies mapped to environment type |
| G5 | No secrets in Git | Sealed Secrets or External Secrets required |
| G6 | Multi-env promotion | staging ? production with approval gate |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | Kubernetes cluster provisioning | Infrastructure concern |
| NG2 | CI pipeline configuration | Owned by `cicd-pipeline` skill |
| NG3 | Server management | Owned by `server-ops` skill |
| NG4 | Git operations (commit, push) | Owned by `git-workflow` skill |
| NG5 | Helm chart development | Specialized concern |
| NG6 | Service mesh configuration | Infrastructure concern |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| ArgoCD vs Flux decision (4 criteria) | Selection framework | Tool installation |
| Sync policy selection (4 policies) | Policy recommendation | ArgoCD/Flux configuration |
| Repository structure template | Directory layout | File creation |
| OpenGitOps compliance (4 principles) | Compliance checklist | Reconciliation implementation |
| Secret management strategy | Approach selection (Sealed/External Secrets) | Secret rotation |
| Multi-env promotion | Promotion workflow pattern | Approval system |

**Side-effect boundary:** GitOps Workflow produces architecture decisions and configuration guidance. It does not install ArgoCD/Flux, create Kubernetes resources, or modify cluster state.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "tool-select" | "sync-policy" | "repo-structure" |
                              # "secret-strategy" | "promotion" | "full-guide"
Context: {
  cluster_count: number       # 1 = single, 2+ = multi-cluster
  team_size: string           # "small" (<5) | "medium" (5-20) | "large" (20+)
  needs_ui: boolean           # Whether web UI is required
  environments: Array<string> # ["dev", "staging", "production"]
  has_helm: boolean           # Whether Helm charts are used
  secret_manager: string | null  # "sealed-secrets" | "external-secrets" | "vault" | null
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  tool: {
    recommended: string       # "argocd" | "flux"
    rationale: string
    comparison: Array<{
      feature: string
      argocd: string
      flux: string
    }>
  } | null
  sync_policy: {
    environment: string
    policy: string            # "manual" | "auto" | "prune" | "self-heal"
    rationale: string
  } | null
  repo_structure: {
    directories: Array<string>
    description: string
  } | null
  secret_strategy: {
    approach: string          # "sealed-secrets" | "external-secrets" | "vault"
    rationale: string
  } | null
  promotion: {
    workflow: Array<string>   # Ordered promotion steps
    approval_required: boolean
  } | null
  reference_file: string | null
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

- Tool selection is deterministic: needs_ui=true OR cluster_count>1 ? ArgoCD; else ? Flux.
- Sync policy mapping is fixed: production ? manual; dev/staging ? auto; cleanup ? prune; drift ? self-heal.
- Repository structure is fixed: apps/{env}/, infrastructure/, argocd/applications/.
- Secret strategy: null ? sealed-secrets (default).
- Promotion: always staging ? production with approval gate for production.
- OpenGitOps compliance: 4 principles (declarative, versioned, pulled, reconciled) � binary pass/fail.

#### What Agents May Assume

- Tool recommendation reflects current ArgoCD vs Flux capabilities.
- Sync policies are mutually compatible (can combine auto + prune + self-heal).
- Repo structure works for both ArgoCD and Flux.
- Production always requires manual sync (no auto-sync to production).

#### What Agents Must NOT Assume

- ArgoCD/Flux are installed.
- Kubernetes cluster exists.
- The skill creates files, resources, or configurations.
- Secret management is configured.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Tool select | None; decision output |
| Sync policy | None; recommendation |
| Repo structure | None; template output |
| Secret strategy | None; recommendation |
| Promotion | None; workflow output |
| Full guide | None; combined output |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Define cluster count, team size, environments
2. Invoke tool-select for ArgoCD vs Flux decision
3. Invoke repo-structure for directory layout
4. Invoke sync-policy per environment
5. Invoke secret-strategy for secret management
6. Invoke promotion for multi-env workflow
7. Implement decisions (caller's responsibility)
```

#### Execution Guarantees

- Each invocation produces a complete recommendation.
- No dependencies between request types (can invoke any individually).

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Invalid request type | Return error to caller | Use supported type |
| Missing cluster count | Return error to caller | Supply count |
| Missing environments | Return error to caller | Supply env list |

#### Retry Boundaries

- Zero internal retries. Deterministic output.

#### Isolation Model

- Each invocation is stateless and independent.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Tool select | Yes | Same context = same tool |
| Sync policy | Yes | Same env = same policy |
| Repo structure | Yes | Fixed template |
| Secret strategy | Yes | Same input = same recommendation |
| Promotion | Yes | Same envs = same workflow |

---

## 7. Execution Model

### 2-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Parse** | Validate request type, context fields | Validated input or error |
| **Evaluate** | Traverse decision tree for request type | Recommendation |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Fixed tool selection | needs_ui OR multi-cluster ? ArgoCD; else ? Flux |
| Fixed sync policies | 4 policies with fixed env mapping |
| Fixed repo structure | apps/{env}/, infrastructure/, argocd/applications/ |
| Fixed safety rules | No auto-sync production; no plaintext secrets; rollback tested |
| OpenGitOps compliance | 4 principles: declarative, versioned, pulled, reconciled |
| Production approval | Production promotion always requires explicit approval |
| No external calls | All decisions from embedded rules |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported type |
| Missing cluster count | Return `ERR_MISSING_CLUSTER_COUNT` | Supply count |
| Missing environments | Return `ERR_MISSING_ENVIRONMENTS` | Supply env list |
| Invalid environment name | Return `ERR_INVALID_ENVIRONMENT` | Use dev/staging/production |
| Reference file missing | Return `ERR_REFERENCE_NOT_FOUND` | Verify installation |

**Invariant:** Every failure returns a structured error. No fallback to default recommendations.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_MISSING_CLUSTER_COUNT` | Validation | Yes | Cluster count not provided |
| `ERR_MISSING_ENVIRONMENTS` | Validation | Yes | Environment list not provided |
| `ERR_INVALID_ENVIRONMENT` | Validation | Yes | Environment name not recognized |
| `ERR_REFERENCE_NOT_FOUND` | Infrastructure | No | Reference file missing |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Decision timeout | N/A | N/A | Synchronous; < 50ms |
| Internal retries | Zero | Zero | Deterministic output |

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "gitops-workflow",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "cluster_count": "number",
  "tool_recommended": "string|null",
  "environments": "Array<string>|null",
  "sync_policy": "string|null",
  "status": "success|error",
  "error_code": "string|null",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Tool selected | INFO | tool_recommended, rationale |
| Sync policy selected | INFO | environment, policy |
| Auto-sync production blocked | WARN | environment |
| Decision failed | ERROR | error_code, message |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `gitops.decision.duration` | Histogram | ms |
| `gitops.tool.distribution` | Counter | argocd vs flux |
| `gitops.sync_policy.distribution` | Counter | per policy |
| `gitops.environment.count` | Histogram | per invocation |

---

## 14. Security & Trust Model

### Data Handling

- GitOps Workflow does not access clusters, credentials, or kubeconfig.
- No secrets, tokens, or certificates are processed.
- Repo structure templates contain no sensitive data.

### Safety Rules (Enforced)

| Rule | Enforcement |
|------|-------------|
| No auto-sync to production | Sync policy for production is always "manual" |
| No plaintext secrets in Git | Sealed Secrets or External Secrets recommended |
| Rollback procedure required | Included in promotion workflow |

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound decision tree | < 50ms; scales linearly |
| Concurrency | Stateless invocations | Unlimited parallel |
| Reference storage | 2 files (~6 KB) | Static; no growth |
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
| Full guide | < 10 ms | < 30 ms | 50 ms |
| Output size | = 1,000 chars | = 3,000 chars | 5,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| ArgoCD/Flux feature changes | Medium | Stale comparison | Version-pinned comparison |
| Auto-sync to production | Low (blocked) | Unverified deployment | Manual sync enforced |
| Secrets in Git | Medium | Credential leakage | Sealed/External Secrets mandate |
| Cluster drift undetected | Low | State inconsistency | Reconciliation interval (3 min) |
| Promotion without approval | Low | Untested production | Approval gate mandatory |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ? | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ? | Entry point under 200 lines |
| Prerequisites documented | ? | Kubernetes cluster, kubectl, ArgoCD or Flux |
| When to Use section | ? | Situation-based routing table |
| Core content matches skill type | ? | Expert type: decision trees, tool selection |
| Troubleshooting section | ? | Anti-patterns table |
| Related section | ? | Cross-links to cicd-pipeline, server-ops, git-workflow |
| Content Map for multi-file | ? | Links to 2 reference files + engineering-spec.md |
| Contract versioning | ? | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ? | This table with ?/? + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | ArgoCD vs Flux decision tree (4 criteria) | ? |
| **Functionality** | 4 sync policies with fixed env mapping | ? |
| **Functionality** | Repository structure template | ? |
| **Functionality** | Secret management strategy | ? |
| **Functionality** | Multi-env promotion with approval | ? |
| **Functionality** | OpenGitOps compliance (4 principles) | ? |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ? |
| **Contracts** | Contract versioning with semver | ? |
| **Failure** | Error taxonomy with 5 categorized codes | ? |
| **Failure** | No fallback to default recommendation | ? |
| **Failure** | Zero internal retries | ? |
| **Determinism** | Fixed tool selection, fixed policies, fixed structure | ? |
| **Security** | No auto-sync production, no plaintext secrets | ? |
| **Observability** | Structured log schema with 5 mandatory fields | ? |
| **Observability** | 4 metrics defined | ? |
| **Performance** | P50/P99 targets for all operations | ? |
| **Scalability** | Stateless; unlimited parallel | ? |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ? |

---



---

### Rule: sync-policies

---
title: GitOps Sync Policies
impact: MEDIUM
tags: gitops
---

# GitOps Sync Policies

> Sync strategies, windows, retry policies, and health checks for ArgoCD and Flux.

---

## ArgoCD Sync Policies

### Automated Sync
```yaml
syncPolicy:
  automated:
    prune: true       # Delete resources removed from Git
    selfHeal: true    # Reconcile manual changes
    allowEmpty: false # Prevent empty sync
```

### Manual Sync
```yaml
syncPolicy:
  syncOptions:
  - PrunePropagationPolicy=foreground
  - CreateNamespace=true
```

### Sync Windows
```yaml
syncWindows:
- kind: allow
  schedule: "0 8 * * *"
  duration: 1h
  applications:
  - my-app
- kind: deny
  schedule: "0 22 * * *"
  duration: 8h
  applications:
  - '*'
```

### Retry Policy
```yaml
syncPolicy:
  retry:
    limit: 5
    backoff:
      duration: 5s
      factor: 2
      maxDuration: 3m
```

## Flux Sync Policies

### Kustomization Sync
```yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: my-app
spec:
  interval: 5m
  prune: true
  wait: true
  timeout: 5m
  retryInterval: 1m
  force: false
```

### Source Sync Interval
```yaml
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: my-app
spec:
  interval: 1m
  timeout: 60s
```

## Health Assessment

### Custom Health Checks
```yaml
# ArgoCD
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-cm
  namespace: argocd
data:
  resource.customizations.health.MyCustomResource: |
    hs = {}
    if obj.status ~= nil then
      if obj.status.conditions ~= nil then
        for i, condition in ipairs(obj.status.conditions) do
          if condition.type == "Ready" and condition.status == "False" then
            hs.status = "Degraded"
            hs.message = condition.message
            return hs
          end
          if condition.type == "Ready" and condition.status == "True" then
            hs.status = "Healthy"
            hs.message = condition.message
            return hs
          end
        end
      end
    end
    hs.status = "Progressing"
    hs.message = "Waiting for status"
    return hs
```

## Sync Options

### Common Sync Options
- `PrunePropagationPolicy=foreground` - Wait for pruned resources to be deleted
- `CreateNamespace=true` - Auto-create namespace
- `Validate=false` - Skip kubectl validation
- `PruneLast=true` - Prune resources after sync
- `RespectIgnoreDifferences=true` - Honor ignore differences
- `ApplyOutOfSyncOnly=true` - Only apply out-of-sync resources

## Best Practices

1. Use automated sync for non-production
2. Require manual approval for production
3. Configure sync windows for maintenance
4. Implement health checks for custom resources
5. Use selective sync for large applications
6. Configure appropriate retry policies
7. Monitor sync failures with alerts
8. Use prune with caution in production
9. Test sync policies in staging
10. Document sync behavior for teams

---

---

? PikaKit v3.9.206
