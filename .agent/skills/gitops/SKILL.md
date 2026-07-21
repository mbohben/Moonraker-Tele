---
name: gitops
description: >-
  GitOps workflows with ArgoCD and Flux for declarative Kubernetes deployments.
  Use when setting up GitOps, ArgoCD sync, or Kubernetes declarative infrastructure.
  NOT for simple deploys (use vercel-deploy) or general CI/CD (use cicd-pipeline).
metadata:
  author: pikakit
  version: "3.9.206"
  category: devops-architect
  triggers: ["GitOps", "ArgoCD", "Flux", "Kubernetes", "declarative deployment"]
  coordinates_with: ["cicd-pipeline", "server-ops"]
  success_metrics: ["100% manual sync for production", "0 secrets in git repo"]
---

# GitOps Workflow — Declarative Kubernetes Delivery

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
| Multi-environment | Set up staging → production promotion |
| Architecture review | Read `rules/engineering-spec.md` |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| ArgoCD vs Flux decision (4 criteria) | CI pipeline (→ cicd-pipeline) |
| Sync policy selection (4 policies) | Server management (→ server-ops) |
| Repository structure template | Git operations (→ git-workflow) |
| OpenGitOps compliance (4 principles) | Cluster provisioning |
| Secret management strategy | Helm chart development |

**Expert decision skill:** Produces architecture decisions. No cluster modifications.

---

## OpenGitOps Principles (4 — All Required)

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
| Web UI | ✅ Rich dashboard | ❌ CLI only |
| Multi-cluster | ✅ Native support | ⚠️ Requires setup |
| Helm support | ✅ Native | ✅ Native |
| Learning curve | Medium | Lower |

**Rule:** needs_ui=true OR cluster_count>1 → **ArgoCD**. Otherwise → **Flux**.

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
├── apps/
│   ├── production/
│   └── staging/
├── infrastructure/
│   ├── ingress-nginx/
│   └── cert-manager/
└── argocd/
    └── applications/
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

| ❌ Don't | ✅ Do |
|---------|-------|
| Auto-sync to production | Manual sync with approval |
| Store secrets in Git | Sealed Secrets / External Secrets |
| Push-based deployment | Pull-based reconciliation |
| Skip rollback testing | Test rollback on every release |
| Use imperative `kubectl apply` | Declarative manifests in Git |


## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [argocd-setup.md](rules/argocd-setup.md) | ArgoCD installation and config | ArgoCD selected |
| [sync-policies.md](rules/sync-policies.md) | Sync policy deep dive | Policy configuration |
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `cicd-pipeline` | Skill | CI/CD pipeline |
| `server-ops` | Skill | Server management |
| `git-workflow` | Skill | Git operations |
| `/launch` | Workflow | Deployment |

---

⚡ PikaKit v3.9.206
