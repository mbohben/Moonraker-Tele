---
name: vercel-deploy
description: >-
  Deploy applications to Vercel with preview URLs and production releases.
  Use when user says "deploy", "push live", "preview deployment", or "deploy to Vercel".
  NOT for other platforms (use cicd-pipeline) or GitOps (use gitops).
metadata:
  author: pikakit
  version: "3.9.206"
  category: cicd-deployment
  triggers: ["deploy", "vercel", "production", "preview", "push live"]
  coordinates_with: ["cicd-pipeline", "nextjs-pro", "test-architect"]
  success_metrics: ["Deployment Success Rate", "Time to Preview", "Framework Detection Accuracy"]
---

# Vercel Deploy — Zero-Auth Deployment

> Package → Detect Framework → Upload → Preview URL + Claim URL

---

## 5 Must-Ask Questions (Socratic Gate)

| # | Question | Options |
|---|----------|---------|
| 1 | Framework/Tooling? | Next.js / Vite / Nuxt / Static |
| 2 | Build Output Directory? | `.next` / `dist` / `build` |
| 3 | Environment Variables? | Required / None |
| 4 | Egress Network Allowed? | Yes (deploy now) / No |
| 5 | Pre-deploy Checks Passed? | Lint+Test Passed / Skip Checks |

---

## Prerequisites

| Requirement | Type |
|-------------|------|
| Bash shell (Linux/macOS/WSL) | Required |
| `tar` command | Required |
| `curl` command | Required |
| Vercel account | Optional (for claiming) |

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Deploy app | `npx vercel [path]` |
| Preview deployment | Deploy → get preview URL |
| Production deploy | Deploy → claim via claim URL |
| Quick demo | Instant deploy, no auth |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Tarball packaging (excl. node_modules/.git) | CI/CD pipeline (→ cicd-pipeline) |
| Framework auto-detection (40+ frameworks) | Release workflow (→ /launch) |
| Upload to Vercel API | Custom domains / env vars |
| Preview URL + Claim URL output | Deployment claiming |

**Automation skill:** Creates tarball, makes network requests. Has side effects.

---

## 4-Stage Pipeline

```
INIT → PACKAGING [path provided]
PACKAGING → DETECTING [tarball created]
DETECTING → UPLOADING [framework identified]
UPLOADING → DEPLOYED [upload successful]     // terminal
UPLOADING → FAILED [upload error]            // terminal
PACKAGING → FAILED [no project files]        // terminal
```

---

## Usage

```bash
npx vercel [path]
```

| Argument | Description |
|----------|-------------|
| `path` | Directory or `.tgz` file (default: current directory) |

### Output (JSON to stdout)

```json
{
  "previewUrl": "https://skill-deploy-abc123.vercel.app",
  "claimUrl": "https://vercel.com/claim-deployment?code=...",
  "deploymentId": "dpl_...",
  "projectId": "prj_..."
}
```

---

## Framework Detection

Auto-detects from `package.json`:
- **React:** Next.js, Gatsby, CRA, Remix, React Router
- **Vue:** Nuxt, Vitepress, Vuepress, Gridsome
- **Svelte:** SvelteKit, Svelte, Sapper
- **Other:** Astro, Solid, Angular, Ember, Preact, Docusaurus
- **Backend:** Express, Hono, Fastify, NestJS, Elysia, h3
- **Build:** Vite, Parcel
- **Static HTML:** No package.json → framework: null

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_MISSING_PREREQ` | No | bash, tar, or curl not available |
| `ERR_NO_PROJECT` | Yes | No project files in path |
| `ERR_NETWORK_BLOCKED` | Yes | Egress to *.vercel.com blocked |
| `ERR_UPLOAD_TIMEOUT` | Yes | Upload exceeded 300s |
| `ERR_UPLOAD_FAILED` | Yes | HTTP error during upload |
| `ERR_INVALID_TARBALL` | Yes | Provided .tgz is invalid |

**Upload retry:** 1 retry on timeout. All other errors: zero retries.

---

## Audit Logging (OpenTelemetry)

| Event | Metadata Payload | Severity |
|-------|------------------|----------|
| `packaging_started` | `{"directory": "src", "framework_hint": "react"}` | `INFO` |
| `upload_completed` | `{"deploymentId": "dpl_abc", "bytes": 102400}` | `INFO` |
| `deployment_failed` | `{"error_code": "ERR_UPLOAD_TIMEOUT", "retry": 1}` | `ERROR` |

All vercel-deploy outputs MUST emit `packaging_started` and either `upload_completed` or `deployment_failed`.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Network egress error | Allowlist `*.vercel.com` in network settings |
| Large project timeout | Exclude node_modules (automatic); increase timeout |
| Static HTML not at root | Single non-index.html auto-renamed to index.html |
| Claude.ai egress blocked | Settings → Capabilities → Add *.vercel.com |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [engineering-spec.md](rules/engineering-spec.md) | Full spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `cicd-pipeline` | Skill | Deployment pipelines |
| `/launch` | Workflow | Release workflow |
| `nextjs-pro` | Skill | Next.js apps |

---

⚡ PikaKit v3.9.206
