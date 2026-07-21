---
trigger: always_on
---

# Pikakit - Dynamic Skill Detection Protocol (Phase 0)

> **Purpose:** Automatically detect domain-relevant skills from `$ARGUMENTS` and inject them alongside workflow-default skills. This ensures task-specific expertise is always loaded — even when the user doesn't explicitly mention skill keywords.

---

## How It Works

Before any workflow execution, scan `$ARGUMENTS` for **domain signals** and inject matching skills into the active skill set.

### Domain Signal → Skill Mapping

| Domain Signal (in $ARGUMENTS) | Skills to Inject | Priority |
|-------------------------------|------------------|----------|
| **SEO / search / ranking / meta tag / sitemap / schema markup / E-E-A-T** | `seo-optimizer` | High |
| **blog / article / content / landing page / headline / copy** | `seo-optimizer`, `copywriting` | High |
| **color / font / typography / design / theme / dark mode / UI / UX** | `design-system`, `studio` | High |
| **tailwind / utility class / responsive** | `tailwind-kit` | Medium |
| **auth / login / session / JWT / OAuth / password** | `auth-patterns` | High |
| **security / vulnerability / OWASP / XSS / CSRF** | `security-scanner` | High |
| **test / coverage / unit test / e2e / playwright** | `test-architect`, `e2e-automation` | Medium |
| **deploy / CI / CD / pipeline / production / staging** | `cicd-pipeline`, `vercel-deploy` | Medium |
| **database / schema / migration / SQL / Prisma / Drizzle** | `data-modeler` | High |
| **API / REST / GraphQL / endpoint / route** | `api-architect` | Medium |
| **performance / lighthouse / bundle / Core Web Vitals / speed** | `perf-optimizer` | Medium |
| **mobile / React Native / Flutter / iOS / Android** | `mobile-developer`, `mobile-design` | High |
| **game / physics / sprite / canvas / collision** | `game-development` | High |
| **doc / README / changelog / Mermaid / documentation** | `doc-templates` | Low |
| **git / commit / branch / PR / merge** | `git-workflow` | Low |
| **MCP / Model Context Protocol / tool server** | `mcp-builder` | Medium |
| **image / video / FFmpeg / media / compress** | `media-processing` | Medium |
| **prompt / DALL-E / Midjourney / Stable Diffusion** | `ai-artist` | Medium |
| **Python / FastAPI / Django / Flask** | `python-pro` | High |
| **Node / Express / Fastify / Hono / backend** | `nodejs-pro` | High |
| **React / component / hook / state / JSX** | `react-pro` | High |
| **Next.js / App Router / SSR / RSC** | `nextjs-pro` | High |
| **TypeScript / generics / type / tsconfig** | `typescript-expert` | Medium |
| **server / PM2 / nginx / monitoring / scaling** | `server-ops` | Medium |
| **observability / logging / tracing / OpenTelemetry** | `observability` | Low |

### Detection Rules

1. **Case-insensitive matching** — scan all of `$ARGUMENTS` text
2. **Multi-match allowed** — a single request can trigger 3+ skill injections
3. **No duplicates** — if skill already in workflow default list, skip it
4. **Max injection: 5 skills** — prevent context overload; pick by priority (High > Medium > Low)
5. **Announce injected skills** — display which extra skills were dynamically loaded

### Announcement Format

```
[⚡PikaKit] Dynamic Skills Detected:
  + seo-optimizer (signal: "SEO", "blog post")
  + copywriting (signal: "landing page", "content")
  Base skills: [workflow defaults]
  Total active: [count]
```

---

## Integration Point

This protocol runs as **Phase 0** in every execution workflow:

```
Phase 0: Dynamic Skill Detection  ← NEW
Phase 1: Pre-flight & Knowledge Context
Phase 2: [workflow-specific]
...
```

### Workflow Coverage

| Workflow | Has Phase 0 | Notes |
|----------|-------------|-------|
| `/think` | ✅ | Inject domain skills for better option generation |
| `/plan` | ✅ | Inject domain skills for better architecture decisions |
| `/build` | ✅ | Inject domain skills for implementation quality |
| `/cook` | ✅ | Inject domain skills for targeted implementation |
| `/fix` | ✅ | Inject domain skills for context-aware fixes |
| `/autopilot` | ✅ | Inject domain skills for comprehensive orchestration |
| `/diagnose` | ✅ | Inject domain skills for faster root cause identification |

---

## Examples

**Input:** `/plan Build an SEO blog post series for an e-commerce store`
```
Detected signals: "SEO", "blog post", "e-commerce"
Injected: seo-optimizer, copywriting
```

**Input:** `/build landing page with auth and dark mode`
```
Detected signals: "landing page", "auth", "dark mode"
Injected: seo-optimizer, copywriting, auth-patterns, design-system
```

**Input:** `/fix TypeScript error in Prisma migration`
```
Detected signals: "TypeScript", "Prisma", "migration"
Injected: typescript-expert, data-modeler
```

**Input:** `/diagnose login returns 401 even with correct OAuth token`
```
Detected signals: "login", "401", "OAuth"
Injected: auth-patterns
```

---

> ⚡ PikaKit Dynamic Skill Detection v1.0
