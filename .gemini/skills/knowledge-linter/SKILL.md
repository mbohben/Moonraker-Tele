---
name: knowledge-linter
description: >-
  Health checks for the knowledge wiki: find stale articles, orphan concepts,
  inconsistencies, missing cross-links, and knowledge gaps.
  Use when "check knowledge", "knowledge health", "lint wiki", or periodically
  after many compiles. NOT for compiling knowledge (use knowledge-compiler).
metadata:
  author: pikakit
  version: "3.9.206"
  category: autonomous-learning
  triggers: ["knowledge health", "check wiki", "lint knowledge", "stale knowledge", "wiki health"]
  coordinates_with: ["knowledge-compiler", "knowledge-compiler"]
  success_metrics: ["Issue Detection Rate", "Auto-Fix Rate", "Knowledge Coverage"]
---

# Knowledge Linter — Wiki Health Checker

> Find stale knowledge, orphan articles, and gaps before they cause repeated mistakes.

---

## Prerequisites

**Required:** `.agent/knowledge/` directory with compiled articles.
**Minimum:** At least 3 concept articles for meaningful health checks.

---

## When to Use

| Situation | Approach |
|-----------|----------|
| After many compiles (>10 articles) | Full health check |
| Suspecting outdated knowledge | Staleness scan |
| After major refactoring | Consistency check |
| Periodic maintenance | Full health check |
| Before starting new feature | Coverage gap check |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Staleness detection | Article compilation (→ knowledge-compiler) |
| Orphan link detection | Signal ingestion (→ knowledge-compiler) |
| Consistency verification | Pattern storage (→ knowledge-compiler) |
| Gap identification | Error detection (→ problem-checker) |
| Health report generation | Skill generation (→ skill-generator) |

---

## Health Checks (5)

### 1. Staleness Check

**Finds:** Articles not updated in >30 days that have related recent signals.

```
1. Read all articles in concepts/ — extract `updated:` date
2. Read uncompiled signals in raw/ — extract dates + tags
3. Match signal tags to article tags
4. If article.updated + 30 days < today AND matching signals exist → STALE
5. Output: ⚠️ Stale: {article} — {N} new signals since last update
```

**Auto-fixable:** Suggest recompile targeting stale articles.

### 2. Orphan Check

**Finds:** Articles with zero incoming backlinks from other articles.

```
1. Build link graph: for each article, extract [[references]]
2. Find articles that are never referenced by any other article
3. Orphans with signal_count >= 3 → suggest links
4. Orphans with signal_count < 3 → flag for potential merge
5. Output: 🔗 Orphan: {article} — not referenced by any other concept
```

**Auto-fixable:** Suggest which articles should link to the orphan.

### 3. Inconsistency Check

**Finds:** Contradicting information across articles.

```
1. Extract key claims from each article (facts, patterns, gotchas)
2. Cross-reference claims across articles
3. Flag contradictions: Article A says X, Article B says NOT X
4. Output: ❌ Conflict: {article-a} vs {article-b} on "{topic}"
```

**NOT auto-fixable:** Requires human judgment. Flag for review.

### 4. Gap Check

**Finds:** Raw signals that match no existing concept article.

```
1. Read all signals in raw/ (both compiled and uncompiled)
2. Extract tag sets from signals
3. Extract tag sets from existing articles
4. Find signal tags with no matching article
5. If >= 3 signals share an unmatched tag → knowledge gap
6. Output: 📭 Gap: {N} signals about "{topic}" but no concept article exists
```

**Auto-fixable:** Suggest running `/knowledge compile` with focus on gap topics.

### 5. Dead Link Check

**Finds:** `[[references]]` pointing to non-existent articles.

```
1. Extract all [[article-name]] references from all articles
2. Check if referenced file exists in concepts/ or decisions/
3. If not exists → dead link
4. Output: 💀 Dead link: {article} references [[{missing}]]
```

**Auto-fixable:** Remove dead link or suggest correct target.

---

## Health Report Format

```markdown
## 🏥 Knowledge Health Report

**Generated:** {ISO date}
**Wiki:** .agent/knowledge/

### Overview

| Metric | Value | Status |
|--------|-------|--------|
| Total concept articles | {N} | — |
| Total ADRs | {N} | — |
| Avg. signal density | {N}/article | {✅ ≥3 | ⚠️ <3} |
| Cross-link density | {N} links | {✅ ≥1/article | ⚠️ <1} |

### Issues Found

| # | Type | Severity | Item | Details |
|---|------|----------|------|---------|
| 1 | Stale | ⚠️ | {article} | {N} new signals, last updated {date} |
| 2 | Orphan | ⚠️ | {article} | Zero backlinks |
| 3 | Gap | 📭 | {topic} | {N} signals, no article |

### Health Score

**{score}/100** — {rating}

| Range | Rating |
|-------|--------|
| 90-100 | ✅ Excellent — wiki is well-maintained |
| 70-89 | 🟢 Good — minor issues |
| 50-69 | ⚠️ Fair — needs attention |
| 0-49 | 🔴 Poor — significant gaps or staleness |

### Recommendations

1. {Priority action 1}
2. {Priority action 2}
3. {Priority action 3}
```

---

## Scoring Formula

```
health_score = 100
  - (stale_articles × 5)
  - (orphan_articles × 3)
  - (inconsistencies × 10)
  - (knowledge_gaps × 4)
  - (dead_links × 2)
  + min(cross_link_bonus, 10)    # +1 per cross-link, max 10
```

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_NO_ARTICLES` | Yes | No concept articles to lint |
| `ERR_INDEX_MISSING` | Yes | `_index.md` not found → suggest reindex |
| `ERR_PARSE_FRONTMATTER` | Yes | Article frontmatter malformed |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Run lint on empty wiki | Wait for ≥3 articles |
| Auto-fix inconsistencies | Flag for human review |
| Ignore staleness warnings | Recompile stale articles promptly |
| Delete orphan articles | Find proper links first |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `knowledge-compiler` | Skill | Compiles signals into articles |
| `knowledge-compiler` | Skill | Pattern storage |
| `/knowledge` | Workflow | CLI interface |

---

⚡ PikaKit v3.9.206
