# Enforcement Guide

## How to Enforce Governance Doctrines

This guide explains how to actively enforce constitutional and doctrinal requirements in code reviews, architecture decisions, and AI agent behavior.

## Enforcement Levels

### Level 1: Constitutional (IMMUTABLE)
**Source**: `constitution/master-constitution.md`

**Violations at this level are FATAL**. The work must be rejected entirely.

**Examples**:
- Modifying historical data in place (violates Law 2)
- Frontend making truth decisions (violates Law 1)
- Injecting realtime ticks into charts (violates Law 3)

**Response**: Stop, cite, refuse.

---

### Level 2: Architectural (NON-NEGOTIABLE)
**Source**: `doctrines/architecture/`, `doctrines/backend/`, `doctrines/data/`

**Violations at this level compromise system integrity**.

**Examples**:
- Blurred ownership between layers
- Client-side data reconstruction
- Implicit dependencies

**Response**: Require architectural redesign before proceeding.

---

### Level 3: Domain-Specific (STRICT)
**Source**: `doctrines/frontend/`, `doctrines/performance/`, `doctrines/commercial/`

**Violations at this level create technical debt or risk**.

**Examples**:
- Not following swipe-tab architecture
- Missing caching strategy
- No rollback plan for breaking changes

**Response**: Block until compliance is demonstrated.

---

### Level 4: Process (ENFORCED)
**Source**: `enforcement/checklists/`, `doctrines/review/`

**Violations at this level indicate incomplete work**.

**Examples**:
- Skipping code review checklist
- Missing test coverage
- Undocumented breaking changes

**Response**: Return for completion.

---

## Enforcement Workflow

### 1. Pre-Review
Before reviewing code/design:

1. ✅ Load `SKILL.md` to identify applicable doctrines
2. ✅ Load `constitution/` for Prime Directives and System Laws
3. ✅ Load relevant `doctrines/` based on domain
4. ✅ Select appropriate `enforcement/checklists/`

### 2. During Review
While reviewing:

1. **Check Constitutional Compliance**
   - Are Prime Directives violated?
   - Are System Laws (1-4) upheld?
   - Is learning subordinate to Constitution?

2. **Check Architectural Compliance**
   - Clear ownership boundaries?
   - Proper dependency direction?
   - No implicit coupling?

3. **Check Domain Compliance**
   - Backend: Data engine rules followed?
   - Frontend: Mobile UX patterns correct?
   - Data: Chart integrity maintained?
   - Performance: Caching strategy defined?

4. **Check Process Compliance**
   - Checklist completed?
   - Breaking changes documented?
   - Rollback plan exists?

### 3. Post-Review
After violations found:

1. **Stop execution**
2. **Cite specific doctrine** (with file path)
3. **Explain systemic risk**
4. **Refuse or request redesign**

### 4. Approval
Only approve if:
- ✅ All constitutional laws upheld
- ✅ All architectural boundaries respected
- ✅ All domain rules followed
- ✅ All checklists completed

**Remember**: Partial compliance is not compliance.

---

## Enforcement Examples

### Example 1: Backend API Adding Chart Data

**Request**: "Add a new endpoint to serve sparkline data"

**Enforcement Checklist**:
1. Load `doctrines/backend/backend-data-engine-doctrine.md`
2. Load `doctrines/data/data-integrity-doctrine.md`
3. Load `enforcement/checklists/backend-api-review-checklist.md`

**Key Checks**:
- ✅ Historical data is immutable (Law 2)?
- ✅ Realtime data separated from history (Law 3)?
- ✅ Chart truthfulness maintained (Law 4)?
- ✅ Caching strategy defined (Performance)?
- ✅ Rate limiting implemented (Performance)?

**Cite if violated**: "This violates Law 3 (Realtime Ephemerality) from `constitution/master-constitution.md`. Realtime ticks must not be persisted as historical aggregates."

---

### Example 2: Frontend Mobile Gesture Change

**Request**: "Modify swipe behavior on Portfolio page"

**Enforcement Checklist**:
1. Load `doctrines/frontend/frontend-mobile-doctrine.md`
2. Load `doctrines/frontend/interaction-patterns-doctrine.md`
3. Load `enforcement/checklists/mobile-gesture-review-checklist.md`

**Key Checks**:
- ✅ Native gesture precedence maintained?
- ✅ No gesture conflicts introduced?
- ✅ Swipe-tab architecture followed?
- ✅ Predictable behavior guaranteed?

**Cite if violated**: "This violates the Native Gesture Precedence rule from `doctrines/frontend/frontend-mobile-doctrine.md`. Native scrolling must never be blocked."

---

### Example 3: AI Agent Proposing "Smart Fix"

**Request**: Agent suggests "Let's cache prices in localStorage for offline mode"

**Enforcement Checklist**:
1. Load `constitution/` (Law 1: Truth Ownership)
2. Load `doctrines/architecture/` (Dependency Direction Law)
3. Load `doctrines/learning/learning-engine-doctrine.md`

**Key Checks**:
- ❌ Frontend managing truth? (Violates Law 1)
- ❌ Client-side caching of financial data? (Violates Architecture)
- ❌ Agent proposing architectural change without approval? (Violates Learning)

**Response**: "This violates Law 1 (Truth Ownership) from the Master Constitution. The backend must remain the single source of truth for all financial data. Frontend caching of prices is architecturally forbidden. Please propose a backend-first caching strategy instead."

---

## Agent-Specific Enforcement

### When AI Agent Violates Doctrine

If an agent:
- Produces unsafe output
- Violates doctrine repeatedly
- Shows unpredictable drift
- Argues against constitutional decisions

Then:
1. **Reject output immediately**
2. **Cite violation** with doctrine reference
3. **Restrict agent autonomy** if repeated
4. **Audit past outputs** if severity is high

### Agent Learning Boundaries

Agents MAY learn:
- ✅ Better reasoning patterns
- ✅ Improved architectural judgment
- ✅ More accurate risk assessment

Agents MUST NOT learn:
- ❌ Code style preferences
- ❌ Naming conventions
- ❌ Temporary workarounds
- ❌ Exceptions to laws

**All learning is subordinate to the Constitution.**

---

## Enforcement Tools

### Automated Enforcement

Use validation scripts when available:
```bash
# Validate doctrine compliance
node scripts/validate_doctrine.ts <file-path>

# Audit PR for violations
node scripts/audit_pr.ts <pr-branch>

# Check system boundaries
node scripts/check_boundaries.ts <directory>
```

### Manual Enforcement

Use checklists:
- `enforcement/checklists/backend-api-review-checklist.md`
- `enforcement/checklists/chart-component-review-checklist.md`
- `enforcement/checklists/mobile-gesture-review-checklist.md`
- `enforcement/checklists/frontend-gesture-review-checklist.md`

---

## Final Enforcement Principle

> Agents exist to reduce human load, increase consistency, and surface risks early.
> 
> Agents do NOT exist to replace architectural judgment, accelerate unsafe change, or bypass review or law.
> 
> **If in doubt — REFUSE.**

---

⚡ PikaKit v3.9.206
