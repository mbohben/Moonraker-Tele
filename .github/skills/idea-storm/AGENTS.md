# Idea Storm

**Version 3.9.121**
Engineering
April 2026

> **Note:**
> This document is for agents and LLMs to follow when working on idea-storm tasks.
> Optimized for automation and consistency by AI-assisted workflows.

---

## Abstract

This document compiles 3 rules across 3 categories for the Idea Storm skill. Socratic questioning protocol for complex requirements and unclear user requests.

---

## Table of Contents

1. [Architecture](#1-architecture) — **LOW**
   - 1.1 [Architecture Debate](#11-architecture-debate)
2. [Dynamic](#2-dynamic) — **LOW**
   - 2.1 [Dynamic Questioning](#21-dynamic-questioning)
3. [Engineering](#3-engineering) — **MEDIUM**
   - 3.1 [Engineering Spec](#31-engineering-spec)

---

## 1. Architecture

**Impact: LOW**

Architecture patterns and best practices.


# Architecture Debate Process

> 8-phase process for technical decisions. YAGNI + KISS + DRY = holy trinity.

---

## Phase Overview

| Phase | Purpose | Output |
|-------|---------|--------|
| **1. Scout** | Understand project state | Project context |
| **2. Discovery** | Clarify requirements | Requirements list |
| **3. Research** | Gather information | Technical options |
| **4. Analysis** | Evaluate approaches | Pros/cons matrix |
| **5. Debate** | Challenge assumptions | Refined options |
| **6. Consensus** | Align on solution | Decision made |
| **7. Documentation** | Create summary | Decision report |
| **8. Finalize** | Handoff to planner | Implementation plan |

---

## Holy Trinity Principles

| Principle | Question | Apply When |
|-----------|----------|------------|
| **YAGNI** | Do we need this now? | Adding features |
| **KISS** | Is there a simpler way? | Choosing approach |
| **DRY** | Are we repeating ourselves? | Code structure |

---

## Analysis Template

```markdown
## Problem Statement
[Clear 1-2 sentence description]

## Constraints
- Budget: [time/resources]
- Scale: [users/data size]
- Integration: [existing systems]

## Options Evaluated

### Option A: [Name]
**Approach:** [Brief description]
| Pros | Cons |
|------|------|
| + Fast to implement | - Limited scalability |
| + Team familiar | - Vendor lock-in |

**YAGNI:** ✅ / ❌
**KISS:** ✅ / ❌
**DRY:** ✅ / ❌

### Option B: [Name]
...

## Recommendation
**Selected:** Option A
**Rationale:** [1-2 sentences]
**Trade-offs Accepted:** [what we're giving up]

## Next Steps
1. [Immediate action]
2. [Follow-up task]
```

---

## Debate Tactics

### Challenge Assumptions

```markdown
❓ "Why do we need [X]?"
❓ "What if we don't do [Y]?"
❓ "Is the complexity worth it?"
❓ "Who asked for this feature?"
```

### Brutally Honest Questions

| If They Say | Ask |
|-------------|-----|
| "We might need..." | "Do we need it NOW?" |
| "It would be nice..." | "Is it must-have or nice-to-have?" |
| "Everyone does it..." | "Does it solve OUR problem?" |
| "Future-proof..." | "YAGNI - real requirement or speculation?" |

---

## Example Prompts

- "Should we use microservices or modular monolith?"
- "Help me evaluate these 3 database options"
- "Is adding this feature worth the complexity?"
- "What's the best approach for real-time notifications?"

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [../SKILL.md](../SKILL.md) | Socratic gate protocol, question format |
| [dynamic-questioning.md](dynamic-questioning.md) | Domain-specific question banks, algorithm |
| [engineering-spec.md](engineering-spec.md) | Full engineering spec, contracts |
| `system-design` | Architecture decision frameworks |

---

⚡ PikaKit v3.9.206

---

## 2. Dynamic

**Impact: LOW**

Dynamic patterns and best practices.


# Dynamic Question Generation

> **PRINCIPLE:** Questions are not about gathering data—they are about **revealing architectural consequences**.
>
> Every question must connect to a concrete implementation decision that affects cost, complexity, or timeline.

---

## 🧠 Core Principles

### 1. Questions Reveal Consequences

A good question is not "What color do you want?" but:

```markdown
❌ BAD: "What authentication method?"
✅ GOOD: "Should users sign up with email/password or social login?

   Impact:
   - Email/Pass → Need password reset, hashing, 2FA infrastructure
   - Social → OAuth providers, user profile mapping, less control

   Trade-off: Security vs. Development time vs. User friction"
```

### 2. Context Before Content

First understand **where** this request fits:

| Context | Question Focus |
|---------|----------------|
| **Greenfield** (new project) | Foundation decisions: stack, hosting, scale |
| **Feature Addition** | Integration points, existing patterns, breaking changes |
| **Refactor** | Why refactor? Performance? Maintainability? What's broken? |
| **Debug** | Symptoms → Root cause → Reproduction path |

### 3. Minimum Viable Questions

**PRINCIPLE:** Each question must eliminate a fork in the implementation road.

```
Before Question:
├── Path A: Do X (5 min)
├── Path B: Do Y (15 min)
└── Path C: Do Z (1 hour)

After Question:
└── Path Confirmed: Do X (5 min)
```

If a question doesn't reduce implementation paths → **DELETE IT**.

### 4. Questions Generate Data, Not Assumptions

```markdown
❌ ASSUMPTION: "User probably wants Stripe for payments"
✅ QUESTION: "Which payment provider fits your needs?

   Stripe → Best documentation, 2.9% + $0.30, US-centric
   LemonSqueezy → Merchant of Record, 5% + $0.50, global taxes
   Paddle → Complex pricing, handles EU VAT, enterprise focus"
```

---

## 📋 Question Generation Algorithm

```
INPUT: User request + Context (greenfield/feature/refactor/debug)
│
├── STEP 1: Parse Request
│   ├── Extract domain (ecommerce, auth, realtime, cms, etc.)
│   ├── Extract features (explicit and implied)
│   └── Extract scale indicators (users, data volume, frequency)
│
├── STEP 2: Identify Decision Points
│   ├── What MUST be decided before coding? (blocking)
│   ├── What COULD be decided later? (deferable)
│   └── What has ARCHITECTURAL impact? (high-leverage)
│
├── STEP 3: Generate Questions (Priority Order)
│   ├── P0: Blocking decisions (cannot proceed without answer)
│   ├── P1: High-leverage (affects >30% of implementation)
│   ├── P2: Medium-leverage (affects specific features)
│   └── P3: Nice-to-have (edge cases, optimization)
│
└── STEP 4: Format Each Question
    ├── What: Clear question
    ├── Why: Impact on implementation
    ├── Options: Trade-offs (not just A vs B)
    └── Default: What happens if user doesn't answer
```

---

## 🎯 Domain-Specific Question Banks

### E-Commerce

| Question | Why It Matters | Trade-offs |
|----------|----------------|------------|
| **Single or Multi-vendor?** | Multi-vendor → Commission logic, vendor dashboards, split payments | +Revenue, -Complexity |
| **Inventory Tracking?** | Needs stock tables, reservation logic, low-stock alerts | +Accuracy, -Development time |
| **Digital or Physical Products?** | Digital → Download links, no shipping | Physical → Shipping APIs, tracking |
| **Subscription or One-time?** | Subscription → Recurring billing, dunning, proration | +Revenue, -Complexity |

### Authentication

| Question | Why It Matters | Trade-offs |
|----------|----------------|------------|
| **Social Login Needed?** | OAuth providers vs. password reset infrastructure | +UX, -Control |
| **Role-Based Permissions?** | RBAC tables, policy enforcement, admin UI | +Security, -Development time |
| **2FA Required?** | TOTP/SMI infrastructure, backup codes, recovery flow | +Security, -UX friction |
| **Email Verification?** | Verification tokens, email service, resend logic | +Security, -Sign-up friction |

### Real-time

| Question | Why It Matters | Trade-offs |
|----------|----------------|------------|
| **WebSocket or Polling?** | WS → Server scaling, connection management | Polling → Simpler, higher latency |
| **Expected Concurrent Users?** | <100 → Single server, >1000 → Redis pub/sub, >10k → specialized infra | +Scale, -Complexity |
| **Message Persistence?** | History tables, storage costs, pagination | +UX, -Storage |
| **Ephemeral or Durable?** | Ephemeral → In-memory, Durable → Database write before emit | +Reliability, -Latency |

### Content/CMS

| Question | Why It Matters | Trade-offs |
|----------|----------------|------------|
| **Rich Text or Markdown?** | Rich Text → Sanitization, XSS risks | Markdown → Simple, no WYSIWYG |
| **Draft/Publish Workflow?** | Status field, scheduled jobs, versioning | +Control, -Complexity |
| **Media Handling?** | Upload endpoints, storage, optimization | +Features, -Development time |
| **Multi-language?** | i18n tables, translation UI, fallback logic | +Reach, -Complexity |

---

## 📐 Dynamic Question Template

```markdown
Based on your request for [DOMAIN] [FEATURE]:

## 🔴 CRITICAL (Blocking Decisions)

### 1. **[DECISION POINT]**

**Question:** [Clear, specific question]

**Why This Matters:**
- [Explain architectural consequence]
- [Affects: cost / complexity / timeline / scale]

**Options:**
| Option | Pros | Cons | Best For |
|--------|------|------|----------|
| A | [Advantage] | [Disadvantage] | [Use case] |
| B | [Advantage] | [Disadvantage] | [Use case] |

**If Not Specified:** [Default choice + rationale]

---

## 🟡 HIGH-LEVERAGE (Affects Implementation)

### 2. **[DECISION POINT]**
[Same format]

---

## 🟢 NICE-TO-HAVE (Edge Cases)

### 3. **[DECISION POINT]**
[Same format]
```

---

## 🔄 Iterative Questioning

### First Pass (3-5 Questions)
Focus on **blocking decisions**. Don't proceed without answers.

### Second Pass (After Initial Implementation)
As patterns emerge, ask:
- "This feature implies [X]. Should we handle [edge case] now or defer?"
- "We're using [Pattern A]. Should [Feature B] follow the same pattern?"

### Third Pass (Optimization)
When functionality works:
- "Performance bottleneck at [X]. Optimize now or acceptable for now?"
- "Refactor [Y] for maintainability or ship as-is?"

---

## 🎭 Example: Full Question Generation

```
USER REQUEST: "Build an Instagram clone"

STEP 1: Parse
├── Domain: Social Media
├── Features: Photo sharing, engagement (likes/comments), user profiles
├── Implied: Feed, following, authentication
└── Scale: Potentially high (social apps go viral)

STEP 2: Decision Points
├── Blocking: Storage strategy, authentication method, feed type
├── High-leverage: Real-time notifications, data model complexity
└── Deferable: Analytics, advanced search, reels/video

STEP 3: Generate Questions (Priority)

P0 (Blocking):
1. Storage Strategy → Affects architecture, cost, speed
2. Feed Algorithm → Affects database queries, complexity
3. Auth Method → Affects dev time, UX, security

P1 (High-leverage):
4. Real-time Notifications → WebSocket vs polling
5. Media Processing → Client-side vs server-side optimization

P2 (Deferable):
6. Story/Reels → Major feature creep, defer to v2
7. DM/Chat → Separate subsystem, defer to v2

STEP 4: Format Output
```

---

## 📊 Generated Output (Example)

```
Based on your Instagram clone request:

## 🔴 CRITICAL DECISIONS (Cannot Proceed Without Answers)

### 1. **Photo Storage Strategy**

**Question:** Where will user photos be stored and served?

**Why This Matters:**
- Affects: Monthly hosting costs, page load speed, CDN complexity
- High-volume social apps: 1000 users × 10 photos × 2MB = 20GB storage

**Options:**
| Option | Cost | Speed | Complexity | Best For |
|--------|------|-------|------------|----------|
| **Cloudinary** | $89/mo (25GB) | Fast (CDN) | Low | MVP, rapid launch |
| **AWS S3 + CloudFront** | $0.023/GB | Fast (CDN) | Medium | Production, cost-optimized |
| **Supabase Storage** | Free tier 1GB | Medium | Low | Small scale, simple |
| **Local Storage** | Server cost | Slow | Low | Development only |

**If Not Specified:** Cloudinary (balanced for MVP)

---

### 2. **Feed Algorithm Choice**

**Question:** How should the main feed work?

**Why This Matters:**
- Affects: Database query complexity, caching strategy, development time
- Algorithmic feeds require ML infrastructure, ranking signals

**Options:**
| Option | Complexity | Database Impact | Best For |
|--------|------------|-----------------|----------|
| **Chronological** | Low | Simple query | Early stage, transparency |
| **Follow-Only** | Medium | JOIN with pagination | Most social apps |
| **Algorithmic** | High | Pre-computed feed tables | Instagram competitor |

**If Not Specified:** Follow-Only (balanced for social app)

---

### 3. **Authentication Approach**

**Question:** How do users sign up and login?

**Why This Matters:**
- Affects: Development time (2-5 hours), security posture, UX friction

**Options:**
| Option | Dev Time | Security | UX | Best For |
|--------|----------|----------|-----|----------|
| **Email/Password** | 4-5 hrs | High (if 2FA) | Medium | Full control needed |
| **Social Only** | 1-2 hrs | Provider-dependent | Smooth | B2C, rapid launch |
| **Magic Link** | 2-3 hrs | Medium | Very smooth | Security-focused |
| **Clerk/Auth0** | 1 hr | High | Smooth | Fastest to market |

**If Not Specified:** Clerk (fastest for MVP)

---

## 🟡 HIGH-LEVERAGE (Affects Architecture)

### 4. **Real-time Notifications**

**Question:** Do users need instant notifications for likes/comments?

**Why This Matters:**
- WebSocket adds infrastructure complexity (Redis pub/sub for scaling)
- Polling is simpler but higher latency

**Options:**
| Option | Complexity | Scale Cost | Best For |
|--------|------------|------------|----------|
| **WebSocket + Redis** | High | $10+/mo | >1000 concurrent users |
| **Polling (30s)** | Low | DB queries | <1000 users |
| **No Real-time** | None | None | MVP, validate first |

**If Not Specified:** Polling for MVP (defer WebSocket until validated)

---

## 🟢 NICE-TO-HAVE (Defer to v2)

### 5. **Video/Reels Support**
- Major complexity (video processing, streaming infrastructure)
- Recommendation: Launch with photos only, add video after validation

### 6. **Direct Messaging**
- Separate subsystem (chat infrastructure different from feed)
- Recommendation: Use Pusher/Stream for real-time or defer entirely

---

## 📋 Summary

| Decision | Recommendation | If Changed |
|----------|----------------|------------|
| Storage | Cloudinary | +3 hrs setup |
| Feed | Follow-only | +2 hrs query optimization |
| Auth | Clerk | -3 hrs dev time |
| Real-time | Polling | +5 hrs WebSocket setup |
| Video | Defer to v2 | N/A |
| DM | Defer to v2 | N/A |

**Total Estimated MVP Time:** 15-20 hours with recommendations above
```

---

## 🎯 Principles Recap

1. **Every question = Architectural decision** → Not data gathering
2. **Show trade-offs** → User understands consequences
3. **Prioritize blocking decisions** → Cannot proceed without
4. **Provide defaults** → If user doesn't answer, we proceed anyway
5. **Domain-aware** → Ecommerce questions ≠ Auth questions ≠ Real-time questions
6. **Iterative** → More questions as patterns emerge during implementation

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [../SKILL.md](../SKILL.md) | Socratic gate protocol, progress icons |
| [architecture-debate.md](architecture-debate.md) | 8-phase debate, YAGNI/KISS/DRY |
| [engineering-spec.md](engineering-spec.md) | Full engineering spec, contracts |
| `project-planner` | Post-gate task planning |

---

⚡ PikaKit v3.9.206

---

## 3. Engineering

**Impact: MEDIUM**

Full engineering specification covering contracts, security, and scalability.


# Idea Storm — Engineering Specification

> Production-grade specification for Socratic requirement clarification before implementation at FAANG scale.

---

## 1. Overview

Idea Storm provides a structured Socratic questioning protocol for requirement clarification: mandatory 3-question gate before implementation, structured question format with options and defaults, progress reporting with fixed icons, and error handling with trade-off presentation. The skill operates as an expert pure function — it produces structured questions, not answers. It does not implement features, create files, or make architecture decisions.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None — new spec for first hardening

---

## 2. Problem Statement

Requirement clarification at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Premature implementation | 60% of complex features start without requirements clarification | Wasted work, rework |
| Assumed requirements | 45% of developers assume scope instead of asking | Wrong features built |
| Over-engineered v1 | 35% of first versions include unnecessary complexity | Delayed delivery |
| Vague error communication | 50% of error reports lack trade-off options | User cannot decide |

Idea Storm eliminates these with a mandatory 3-question gate (STOP → ASK → WAIT), structured question format with options table and defaults, and error communication with explicit trade-offs.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Mandatory questioning gate | Minimum 3 questions before any implementation |
| G2 | Structured question format | Each question has: priority, decision point, options table, default |
| G3 | Three core dimensions | Purpose (why), Users (who), Scope (what — must-have vs nice-to-have) |
| G4 | Options with trade-offs | Every question provides ≥ 2 options with pros/cons |
| G5 | Default when unspecified | Every question has a "If Not Specified" default with rationale |
| G6 | Progress icons | 5 fixed icons for status reporting |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | Task planning and breakdown | Owned by `project-planner` skill |
| NG2 | Architecture decisions | Owned by `system-design` skill |
| NG3 | Project scaffolding | Owned by `app-scaffold` skill |
| NG4 | Implementation code | Post-clarification concern |
| NG5 | User research | Business concern |
| NG6 | Creative ideation (divergent brainstorming) | Different cognitive mode |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| 3-question gate protocol (STOP → ASK → WAIT) | Gate enforcement | Implementation start |
| Structured question format | Template generation | Answer processing |
| Options with trade-offs | Trade-off table generation | Option recommendation |
| Progress reporting (5 icons) | Icon assignment | Task execution |
| Error communication pattern | 4-step error format | Error resolution |
| Architecture debate process | 8-phase debate (reference file) | Architecture implementation |

**Side-effect boundary:** Idea Storm produces structured questions and progress reports. It does not create files, start implementations, or make decisions on behalf of the user.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "socratic-gate" | "question-format" | "progress-report" |
                              # "error-report" | "architecture-debate"
Context: {
  user_request: string        # The original user request text
  request_complexity: string  # "simple" | "complex" | "vague"
  domain: string | null       # "frontend" | "backend" | "full-stack" | "mobile" | "infra"
  existing_answers: Array<{
    dimension: string         # "purpose" | "users" | "scope"
    answer: string
  }> | null
  error_context: {
    error_type: string
    error_message: string
  } | null
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "gate-active" | "gate-passed" | "error-report" | "error"
Data: {
  gate: {
    questions_required: number  # Always ≥ 3
    questions: Array<{
      priority: string        # "P0" | "P1" | "P2"
      dimension: string       # "purpose" | "users" | "scope" | custom
      question: string
      why_it_matters: string
      options: Array<{
        name: string
        pros: Array<string>
        cons: Array<string>
      }>
      default: string         # "If Not Specified" value
      default_rationale: string
    }>
    answers_received: number
  } | null
  progress: {
    icon: string              # "✅" | "🔄" | "⏳" | "❌" | "⚠️"
    status: string
    detail: string
  } | null
  error_report: {
    acknowledgment: string
    explanation: string       # User-friendly
    solutions: Array<{
      option: string
      trade_off: string
    }>
    recommended: string | null
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

- Gate always requires minimum 3 questions.
- First 3 questions always cover: Purpose (P0), Users (P0), Scope (P1).
- Every question includes options table with ≥ 2 options.
- Every question includes "If Not Specified" default with rationale.
- Progress icons are fixed: ✅ completed, 🔄 running, ⏳ waiting, ❌ error, ⚠️ warning.
- Error reports always follow 4-step format: acknowledge, explain, offer solutions, ask.
- Question format is fixed markdown template.

#### What Agents May Assume

- Gate blocks implementation until ≥ 3 answers received.
- Questions cover the 3 core dimensions (purpose, users, scope).
- Options table provides decision support for the user.
- Progress icons are consistent across all PikaKit skills.

#### What Agents Must NOT Assume

- The skill answers questions on behalf of the user.
- The skill makes architecture or implementation decisions.
- Fewer than 3 questions are acceptable for complex requests.
- The user's first answer is always complete (follow-up may be needed).

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Socratic gate | None; questions generated |
| Question format | None; template output |
| Progress report | None; icon + status |
| Error report | None; 4-step communication |
| Architecture debate | None; 8-phase process reference |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Receive user request
2. Evaluate complexity (simple/complex/vague)
3. If complex or vague → invoke socratic-gate
4. Present ≥ 3 structured questions to user
5. Wait for user responses
6. If all 3 dimensions answered → gate-passed
7. Hand off to project-planner or app-scaffold
```

#### Execution Guarantees

- Gate always produces ≥ 3 questions.
- Questions are ordered by priority (P0 first).
- Gate does not pass until minimum 3 answers received.

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Invalid request type | Return error to caller | Use supported type |
| Missing user request | Return error to caller | Supply request text |
| Insufficient answers | Gate remains active | Continue asking |

#### Retry Boundaries

- Zero internal retries. Questions are deterministic.

#### Isolation Model

- Each invocation is stateless and independent.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Socratic gate | Yes | Same request = same questions |
| Question format | Yes | Fixed template |
| Progress report | Yes | Same status = same icon |
| Error report | Yes | Same error = same 4-step format |

---

## 7. Execution Model

### 2-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Classify** | Evaluate request complexity (simple/complex/vague) | Classification |
| **Generate** | Produce structured questions or reports | Complete output |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Fixed gate size | Minimum 3 questions; never fewer |
| Fixed dimensions | Purpose (P0), Users (P0), Scope (P1) — always first 3 |
| Fixed question template | Priority, decision point, question, why, options, default |
| Fixed option minimum | ≥ 2 options per question with pros/cons |
| Fixed default | Every question has "If Not Specified" + rationale |
| Fixed progress icons | 5 icons: ✅ 🔄 ⏳ ❌ ⚠️ |
| Fixed error format | 4 steps: acknowledge, explain, offer solutions, ask |
| No implementation | Questions only; never code or architecture |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

Gate tracking (how many answers received) is the caller's responsibility.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported type |
| Missing user request | Return `ERR_MISSING_REQUEST` | Supply request text |
| Invalid complexity | Return `ERR_INVALID_COMPLEXITY` | Use simple/complex/vague |
| Reference file missing | Return `ERR_REFERENCE_NOT_FOUND` | Verify installation |

**Invariant:** Every failure returns a structured error. No partial question sets.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_MISSING_REQUEST` | Validation | Yes | User request text not provided |
| `ERR_INVALID_COMPLEXITY` | Validation | Yes | Complexity not simple/complex/vague |
| `ERR_REFERENCE_NOT_FOUND` | Infrastructure | No | Reference file missing |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Question generation | N/A | N/A | Synchronous; < 50ms |
| Internal retries | Zero | Zero | Deterministic output |

---

## 13. Observability & Logging Schema

### OpenTelemetry Observability (MANDATORY)

- **Socratic Gate Telemetry**: The agent MUST emit an OpenTelemetry Span (`socratic_gate_duration`) encompassing the entire interaction from intercepting the vague request to receiving all mandatory answers.
- **Clarification Events**: Each time the agent asks a structured question (Purpose, Users, Scope), it MUST emit an OTel Event (`QUESTION_GENERATED`) containing the dimension and priority.

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "idea-storm",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "request_complexity": "string",
  "questions_generated": "number",
  "dimensions_covered": "Array<string>",
  "status": "gate-active|gate-passed|error",
  "error_code": "string|null",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Gate activated | INFO | questions_generated, dimensions_covered |
| Gate passed | INFO | answers_received |
| Error reported | INFO | error_type, solutions_count |
| Decision failed | ERROR | error_code, message |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `ideastorm.gate.duration` | Histogram | ms |
| `ideastorm.questions.generated` | Histogram | count |
| `ideastorm.complexity.distribution` | Counter | per level |
| `ideastorm.gate.pass_rate` | Gauge | 0.0-1.0 |

---

## 14. Security & Trust Model

### Data Handling

- User request text is treated as input data; no persistence.
- Questions contain no secrets, credentials, or PII.
- Options and trade-offs are generic architectural guidance.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound template generation | < 50ms; scales linearly |
| Concurrency | Stateless invocations | Unlimited parallel |
| Reference storage | 1 file (~12 KB) | Static; no growth |
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
| Question generation | < 5 ms | < 15 ms | 50 ms |
| Error report | < 3 ms | < 10 ms | 30 ms |
| Output size (questions) | ≤ 1,500 chars | ≤ 3,000 chars | 5,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Gate skipped for "urgent" requests | Medium | Wrong features built | Gate is mandatory; no bypass |
| Too many questions overwhelm user | Low | User disengages | Minimum 3, maximum 5 per round |
| Questions too generic | Medium | No useful clarification | Fixed dimensions: purpose, users, scope |
| User answers incompletely | Medium | Partial requirements | Follow-up questions on missing dimensions |
| Gate treated as formality | Medium | Rubber-stamped answers | Options table forces meaningful choices |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ✅ | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ✅ | Entry point under 200 lines |
| Prerequisites documented | ✅ | No external dependencies |
| When to Use section | ✅ | Situation-based routing table |
| Core content matches skill type | ✅ | Expert type: questioning protocol, fixed templates |
| Troubleshooting section | ✅ | Anti-patterns table |
| Related section | ✅ | Cross-links to /think, project-planner, app-scaffold |
| Content Map for multi-file | ✅ | Links to reference file + engineering-spec.md |
| Contract versioning | ✅ | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ✅ | This table with ✅/❌ + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | 3-question gate (purpose, users, scope) | ✅ |
| **Functionality** | Structured question format with options/defaults | ✅ |
| **Functionality** | Progress reporting (5 fixed icons) | ✅ |
| **Functionality** | Error communication (4-step format) | ✅ |
| **Functionality** | Architecture debate reference | ✅ |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ✅ |
| **Contracts** | Contract versioning with semver | ✅ |
| **Failure** | Error taxonomy with 4 categorized codes | ✅ |
| **Failure** | No partial question sets on error | ✅ |
| **Failure** | Zero internal retries | ✅ |
| **Determinism** | Fixed gate size, fixed dimensions, fixed template | ✅ |
| **Security** | No PII, no credentials | ✅ |
| **Observability** | Structured log schema with 5 mandatory fields | ✅ |
| **Observability** | 4 metrics defined | ✅ |
| **Performance** | P50/P99 targets for all operations | ✅ |
| **Scalability** | Stateless; unlimited parallel | ✅ |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ✅ |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [../SKILL.md](../SKILL.md) | Quick reference, gate protocol, anti-patterns |
| [architecture-debate.md](architecture-debate.md) | 8-phase debate process |
| [dynamic-questioning.md](dynamic-questioning.md) | Domain question banks, algorithm |
| `project-planner` | Post-gate task planning |
| `app-scaffold` | Post-gate project scaffolding |

---

⚡ PikaKit v3.9.206

---

⚡ PikaKit v3.9.206
