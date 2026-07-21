# Auto-Knowledge Ingest Protocol

> **Purpose:** Automatically capture project-specific lessons into the knowledge wiki with zero user effort.
> **Referenced by:** All 19 workflows via Phase 0.5 and Post-Completion hooks.

---

## Channel 1: Git Commit Scanner (Session Start)

> **When:** Every workflow Phase 0.5, after Dynamic Skill Detection.

```
1. Check if .agent/knowledge/ exists — if not, skip
2. Read .agent/knowledge/_index.md → get `last_git_scan` SHA
3. Run: git log --since="7 days ago" --format="%H|%s" -n 20
4. Filter commits matching: fix:, feat:, refactor: prefixes
5. For each qualifying commit:
   a. Check if signal with this SHA already exists → skip if yes
   b. Evaluate significance:
      - Files changed ≥ 2? → INGEST
      - Message contains: fallback, guard, workaround, CORS, rate-limit, cache, migration? → INGEST
      - Single file typo/import fix? → SKIP
   c. If INGEST: generate signal to raw-signals/SIG-{NNN}.md
6. Update _index.md with latest scanned SHA
7. If uncompiled signals > 5 → auto-compile (max 10 per batch)
```

### Signal Template (Git Channel)

```markdown
---
id: SIG-{NNN}
type: git-commit
date: {ISO date}
compiled: false
tags: [{extracted from commit msg and files}]
source: git-scanner
commit_sha: {SHA}
---

# SIG-{NNN}: {commit message}

## Signal
{Summarize what the commit fixed/built based on commit message}

## Context
Files changed: {file list from git show --stat}

## Resolution
{Extract from commit message and diff summary}

## Lesson
{Generalize: what should be remembered for future similar situations?}
```

---

## Channel 2: Session-End Auto-Summary (Task Completion)

> **When:** After Problem Verification passes, before marking task COMPLETED.

```
1. Self-reflect on session:
   - "Did I fix a non-trivial bug?" (multi-file, >1 attempt, regression)
   - "Did I discover a framework/API gotcha?"
   - "Did I make an architectural decision?"
   - "Did I work around a platform limitation?"
2. If ALL answers are NO → skip (trivial session)
3. If ANY answer is YES:
   a. Generate signal with full AI context (highest quality)
   b. Write to raw-signals/SIG-{NNN}.md
   c. Type: session-summary
4. If uncompiled signals > 5 → auto-compile
```

### Quality Gate — INGEST vs SKIP

| INGEST (score ≥ 3) | SKIP (score < 3) |
|---------------------|-------------------|
| Multi-file fix (score: +2) | Typo fix (score: +0) |
| Framework workaround (score: +3) | Simple import add (score: +0) |
| API quirk/rate-limit (score: +3) | Formatting change (score: +0) |
| Architectural decision (score: +3) | Single-line edit (score: +1) |
| Required >1 attempt (score: +2) | Copy-paste code (score: +0) |
| Platform-specific gotcha (score: +2) | Documentation-only (score: +1) |

### Signal Template (Session Channel)

```markdown
---
id: SIG-{NNN}
type: session-summary
date: {ISO date}
compiled: false
tags: [{domain tags}]
source: session-end
quality_score: {1-5}
---

# SIG-{NNN}: {one-line lesson title}

## Signal
{What happened in this session that is worth remembering?}

## Context
{What was the user trying to do? What stack/framework/API was involved?}

## Resolution
{What was the solution? Include specific code patterns if applicable.}

## Lesson
{Generalized takeaway for future sessions.}
```

---

## Dedup Rules

1. **Same commit SHA** → skip (Channel 1)
2. **Same error pattern + same resolution** → increment `occurrences` in existing signal
3. **Similar topic, different context** → allow (new signal with cross-link)

---

## Auto-Compile Trigger

When `uncompiled_count > 5`:
1. Read all `compiled: false` signals (max 10)
2. Cluster by tags/domain
3. For each cluster:
   - Existing concept? → UPDATE with new insights
   - New topic? → CREATE concept article
   - Architectural decision? → CREATE ADR
4. Mark processed signals as `compiled: true`
5. Regenerate `_index.md` and `_graph.md`

---

## Next Signal ID

To determine {NNN}:
1. Read existing files in `raw-signals/`
2. Find highest SIG-{NNN} number
3. Use {NNN + 1}
4. If directory is empty, start at SIG-001

---

> ⚡ PikaKit v3.9.206
