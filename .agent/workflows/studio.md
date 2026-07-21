---
description: AI-powered design system generator — 50+ styles, 97 color palettes, 57 font pairings, and anti-AI-slop intelligence across 10 technology stacks with searchable database.
skills: [studio, design-system, frontend-design, idea-storm, context-engineering, problem-checker, knowledge-compiler]
agents: [orchestrator, assessor, recovery, learner, frontend-specialist]
---

# /studio - Design Intelligence

$ARGUMENTS

---

## Purpose

Generate comprehensive design systems for web and mobile applications — 50+ styles, 97 color palettes, 57 font pairings, 99 UX guidelines, and chart recommendations across 10 technology stacks with AI-powered searchable database. **Differs from `/build` (implements full apps) and `/plan` (creates task breakdown) by focusing exclusively on design system generation and UI quality standards with anti-AI-slop intelligence.** Uses `react-pro` with `studio` for design search and `design-system` for color theory and typography.

---

## 🤖 Meta-Agents Integration

| Phase | Agent | Action |
| ----- | ----- | ------ |
| **Pre-Flight** | `assessor` | Evaluate design risks and knowledge-compiler UX patterns |
| **Execution** | `orchestrator` | Coordinate style selection, search, and UI generation |
| **Safety** | `recovery` | Save state checkpoint before design system implementation |
| **Post-Design** | `learner` | Log successful design decisions and slop patterns |

```
Flow:
learner.analyze(past_designs) → recommendations
       ↓
search(product, style, color, typography) → design system
       ↓
verify(accessibility, contrast) → learner.log(patterns)
```

---

## ⚡ MANDATORY: Design System Protocol


### Phase 0: Dynamic Skill Detection

> **Protocol:** `.agent/rules/dynamic-skill-detection.md`

1. Scan `$ARGUMENTS` for domain signals (case-insensitive).
2. Match signals against the Domain Signal → Skill Mapping table.
3. Inject matched skills (max 5, priority: High > Medium > Low) into active skill set.
4. Skip skills already in workflow defaults.
5. Announce injected skills:

```
[⚡PikaKit] Dynamic Skills Detected:
  + {skill-name} (signal: "{matched keywords}")
  Base skills: [workflow defaults]
  Total active: [count]
```


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
### Phase 1: Pre-flight & knowledge-compiler Context

> **Rule 0.5-K:** knowledge-compiler pattern check.

1. Read `.agent/skills/knowledge-compiler/patterns/` for past failures before proceeding.
2. Trigger `recovery` agent to run Checkpoint (`git commit -m "chore(checkpoint): pre-studio"`).

### Phase 2: Requirements Analysis

| Field | Value |
|-------|-------|
| **INPUT** | $ARGUMENTS (UI/UX request with product type, style, industry) |
| **OUTPUT** | Extracted requirements: product type, style keywords, industry, stack |
| **AGENTS** | `react-pro`, `assessor` |
| **SKILLS** | `studio`, `idea-storm`, `context-engineering` |

// turbo — telemetry: phase-2-requirements

Extract from user request:

| Extract | Examples |
|---------|---------|
| Product type | SaaS, e-commerce, portfolio, dashboard, landing page |
| Style keywords | minimal, playful, professional, elegant, dark mode |
| Industry | healthcare, fintech, gaming, education, beauty |
| Stack | html-tailwind (default), react, nextjs, vue, svelte |

### Phase 3: Design System Generation

| Field | Value |
|-------|-------|
| **INPUT** | Requirements from Phase 2 |
| **OUTPUT** | Complete design system: pattern, style, colors, typography, effects |
| **AGENTS** | `react-pro`, `orchestrator` |
| **SKILLS** | `studio`, `design-system` |

// turbo — telemetry: phase-3-generation

1. Generate design system (always start here):

// turbo
```bash
npx cross-env OTEL_SERVICE_NAME="workflow:studio" TRACE_ID="$TRACE_ID" node .agent/skills/studio/scripts/search.ts "<product_type> <industry> <keywords>" --design-system -p "Project Name"
```

2. Optionally persist for hierarchical retrieval:

// turbo
```bash
npx cross-env OTEL_SERVICE_NAME="workflow:studio" TRACE_ID="$TRACE_ID" node .agent/skills/studio/scripts/search.ts "<query>" --design-system --persist -p "Project Name"
```

Creates `design-system/MASTER.md` + optional `design-system/pages/<page>.md` overrides.

3. Supplement with domain searches as needed:

| Need | Domain | Command |
|------|--------|---------|
| More style options | `style` | `--domain style "glassmorphism dark"` |
| Chart types | `chart` | `--domain chart "real-time dashboard"` |
| UX guidelines | `ux` | `--domain ux "animation accessibility"` |
| Font alternatives | `typography` | `--domain typography "elegant luxury"` |
| Landing structure | `landing` | `--domain landing "hero social-proof"` |

Available domains: `product`, `style`, `typography`, `color`, `landing`, `chart`, `ux`, `react`, `web`, `prompt`

### Phase 4: Stack Guidelines & Implementation

| Field | Value |
|-------|-------|
| **INPUT** | Design system from Phase 3 |
| **OUTPUT** | Stack-specific implementation guidelines |
| **AGENTS** | `react-pro` |
| **SKILLS** | `studio`, `design-system` |

// turbo — telemetry: phase-4-implementation

// turbo
```bash
npx cross-env OTEL_SERVICE_NAME="workflow:studio" TRACE_ID="$TRACE_ID" node .agent/skills/studio/scripts/search.ts "<keyword>" --stack html-tailwind
```

Available stacks: html-tailwind, `react`, `nextjs`, `vue`, `svelte`, `swiftui`, react-native, `flutter`, `shadcn`, jetpack-compose

### Phase 5: Pre-Delivery Verification

| Field | Value |
|-------|-------|
| **INPUT** | Implemented UI from Phase 4 |
| **OUTPUT** | Verified design: accessibility, contrast, responsiveness |
| **AGENTS** | `react-pro`, `learner` |
| **SKILLS** | `design-system`, `design-system`, `problem-checker`, `knowledge-compiler` |

// turbo — telemetry: phase-5-verification

Pre-delivery checklist:

| Category | Checks |
|----------|--------|
| Visual | No emoji icons (use SVG), consistent icon set, correct brand logos |
| Interaction | cursor-pointer on clickable, hover feedback, smooth transitions (150-300ms) |
| Contrast | Light mode text =4.5:1, glass elements visible, borders in both modes |
| Layout | Floating navbar spacing, no hidden content, responsive (375-1440px) |
| Accessibility | Alt text, labeled inputs, color not sole indicator, prefers-reduced-motion |

---

## → MANDATORY: Problem Verification Before Completion

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
| Unused variable | Remove or prefix `_` |
| Lint errors | Run eslint --fix |
| CSS issues | Fix class names, contrast |

> **Rule:** Never mark complete with errors in `@[current_problems]`.

---



---

## MANDATORY: Post-Completion Knowledge Check

> **Protocol:** `.agent/rules/auto-knowledge-ingest.md`
> **Channel 2:** AI self-reflects on session to capture non-trivial lessons.

```
1. Self-reflect: "Was this session non-trivial?"
   - Did I fix a multi-file bug?
   - Did I discover a framework/API gotcha?
   - Did I make an architectural decision?
2. If ALL answers are NO - skip
3. If ANY answer is YES and score >= 3:
   Generate signal to raw-signals/SIG-{NNN}.md
   If uncompiled > 5 - auto-compile
```

## u{2B50}u{FE0F} MANDATORY: Suggest Next Workflow

> **After completing /studio, you MUST suggest the next pipeline step to the user.**

```
u{2705} /studio complete u{2192} Suggest: "Run `/build` to implement the design system."
```

---

## 🔄 Rollback & Recovery

If AI generates slop, inconsistent patterns, or hallucinates styling components:
1. Revert UI file changes using `recovery` meta-agent.
2. Provide feedback to `learner` about specific styling failures (e.g., bad contrast, unwanted emojis).
3. Retry Phase 2 with more restrictive style constraints or specific domain filters.

---

## Output Format

```markdown
## 🎨 Design System: [Project Name]

### Configuration

| Setting | Value |
|---------|-------|
| Product | [type] |
| Style | [style name] |
| Stack | html-tailwind |

### Design Tokens

| Token | Value |
|-------|-------|
| Primary | [color] |
| Typography | [font pairing] |
| Effects | [style effects] |

### Quality Check

| Check | Status |
|-------|--------|
| Accessibility | → WCAG AA |
| Responsive | → 375-1440px |
| Dark mode | → Contrast verified |

### Next Steps

- [ ] Review design system
- [ ] Run `/build` to implement
- [ ] Run `/validate` for accessibility audit
```

---

## Examples

```
/studio SaaS dashboard with dark mode
/studio e-commerce product page elegant
/studio healthcare portal accessible
/studio fintech crypto modern
/studio beauty spa wellness landing page
```

---

## Key Principles

- **Design system first** — always generate `--design-system` before implementation
- **Anti-AI-slop** — no emoji icons, no generic colors, no layout shifts on hover
- **Accessibility mandatory** — WCAG AA contrast, keyboard navigation, alt text
- **Persist for consistency** — use `--persist` for multi-page projects
- **SVG icons only** — use Heroicons/Lucide, never emoji as UI elements

---

## 🔗 Workflow Chain

**Skills Loaded (7):**

- `studio` - 50+ styles, 97 color palettes, 57 font pairings, searchable database
- `design-system` - Color theory, typography, visual effects
- `design-system` - Anti-AI-slop aesthetics and bold design
- `idea-storm` - Requirements clarification
- `context-engineering` - Codebase parsing and context extraction
- `problem-checker` - Code problem verification
- `knowledge-compiler` - Learning and logging design patterns

```mermaid
graph LR
    A["/plan"] --> B["/studio"]
    B --> C["/build"]
    C --> D["/validate"]
    style B fill:#ec4899
```

| After /studio | Run | Purpose |
|--------------|-----|---------|
| Design ready | `/build` | Implement the design |
| Need review | `/inspect` | Code review |
| Ready to ship | `/launch` | Deploy |

**Handoff to /build:**

```markdown
✅ Design system generated! Style: [style], Palette: [palette], Fonts: [fonts].
Run `/build` to implement the UI.
```
