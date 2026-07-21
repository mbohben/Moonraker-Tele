# Governance Doctrine Pack - Load Order

## Progressive Disclosure Model

This skill follows **Progressive Disclosure** to optimize context window usage.

### Load Order (MANDATORY)

1. **SKILL.md + metadata/*** (Always loaded)
   - Lightweight routing & intent matching
   - YAML frontmatter for semantic discovery
   - Quick reference guide

2. **constitution/*** (Load when architectural decisions needed)
   - `master-constitution.md` - Supreme authority
   - Prime Directives (immutable)
   - System Laws (non-negotiable)
   - Learning constraints

3. **doctrines/*** (Load by domain)
   - `architecture/` - System boundaries & ownership
   - `backend/` - Data engine & persistence
   - `data/` - Chart & financial data integrity
   - `frontend/` - Mobile UX & gestures
   - `performance/` - Caching & scalability
   - `commercial/` - Risk & rollback guardrails
   - `review/` - Code review standards
   - `learning/` - AI learning constraints

4. **enforcement/*** (Load on-demand)
   - `checklists/` - Domain-specific review checklists
   - `agents/` - Agent control protocols
   - `playbooks/` - Violation response procedures

5. **proposals/*** (Advanced usage only)
   - Change proposal templates
   - Constitutional amendment process

### Layering Principle

If a lower layer conflicts with a higher layer, **the higher layer always wins**.

Example precedence:
```
constitution/master-constitution.md  (HIGHEST)
  ↓
doctrines/architecture/architecture-doctrine.md
  ↓
enforcement/checklists/backend-api-review-checklist.md
  ↓
Developer preference  (LOWEST)
```

## When to Load What

### Scenario: Backend API Changes
1. Load `SKILL.md` (intent matching)
2. Load `constitution/master-constitution.md` (Laws 1-3)
3. Load `doctrines/architecture/` (boundary laws)
4. Load `doctrines/backend/` (data engine rules)
5. Reference `enforcement/checklists/backend-api-review-checklist.md`

### Scenario: Mobile UI/Gesture Changes
1. Load `SKILL.md` (intent matching)
2. Load `constitution/` (Prime Directives)
3. Load `doctrines/frontend/frontend-mobile-doctrine.md`
4. Load `doctrines/frontend/interaction-patterns-doctrine.md`
5. Reference `enforcement/checklists/mobile-gesture-review-checklist.md`

### Scenario: Chart/Financial Data
1. Load `SKILL.md` (intent matching)
2. Load `constitution/` (Laws 2-4: immutability, ephemerality, truthfulness)
3. Load `doctrines/data/data-integrity-doctrine.md`
4. Load `doctrines/backend/` (aggregation rules)
5. Reference `enforcement/checklists/chart-component-review-checklist.md`

## Optimization Tips

- **Don't preload everything**: Load on-demand based on user intent
- **Cache constitution**: It's referenced frequently
- **Use specific doctrines**: Don't load all doctrines, only relevant ones
- **Checklists last**: Only when performing actual review

---

⚡ PikaKit v3.9.206
