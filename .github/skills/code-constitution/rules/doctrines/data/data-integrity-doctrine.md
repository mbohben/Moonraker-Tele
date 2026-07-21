---
name: data-integrity-doctrine
version: "3.9.206"
status: LOCKED
authority: CONSTITUTIONAL
parent: architecture-doctrine
---

# 📈 PikaKit Chart Data Doctrine  
**(Financial Truth · Historical Integrity · Visualization Law)**

This doctrine defines the **non-negotiable laws** governing how
price data is classified, stored, and visualized in PikaKit charts.

Charts are **NOT visual components**.  
Charts are **financial statements**.

If chart data integrity is violated,  
user trust is **PERMANENTLY DAMAGED**.

---

## 1. Chart Truth Philosophy

A PikaKit chart represents **historical financial truth**.

It MUST be:

- Accurate
- Stable
- Auditable
- Non-deceptive

Visual excitement MUST NEVER  
compromise data truth.

---

## 2. Data Classification Law (MANDATORY)

All price data MUST be explicitly classified as **one** of the following.

### 2.1 Historical Data

Historical data is:

- Immutable once written
- Backfilled from authoritative sources
- Fully auditable and traceable
- Used **EXCLUSIVELY** for charts and aggregates

### 2.2 Realtime Data

Realtime data is:

- Ephemeral and transient
- Non-auditable
- Display-only
- NEVER persisted as historical truth

Mixing historical and realtime data  
is a **HARD VIOLATION**.

---

## 3. Historical Immutability Law (NON-NEGOTIABLE)

Once historical data is written:

- It MUST NEVER be mutated
- It MUST NEVER be smoothed or interpolated
- It MUST NEVER be retroactively edited

Corrections MUST occur via:

- Append-only correction records
- Explicit correction events

Silent mutation is considered  
**FINANCIAL DATA CORRUPTION**.

---

## 4. Realtime Separation Law

Realtime price data:

- MUST NOT be injected into chart datasets
- MUST NOT trigger chart re-renders
- MUST NOT alter historical ranges, highs, or lows
- MUST NOT affect chart scaling or aggregation

Realtime data exists to inform **the present**,  
not to rewrite **the past**.

---

## 5. Visualization Integrity Law

Charts MUST:

- Render **ONLY historical data**
- Maintain stable visual structure
- Preserve consistent scaling per timeframe
- Avoid jitter, flicker, or rescaling due to realtime signals

If a chart visually changes due to realtime ticks,  
the implementation is **INVALID**.

---

## 6. Aggregation & Timeframe Law

All chart aggregation MUST:

- Be derived solely from historical data
- Use deterministic, documented rules
- Produce repeatable results for the same input

Timeframe changes MUST:

- Re-aggregate from historical data
- NEVER rely on realtime ticks
- NEVER approximate missing points

Approximation for aesthetics  
is **FORBIDDEN**.

---

## 7. Auditability Requirement

Every chart MUST be defensible under audit.

A chart is INVALID if:

- Any data point cannot be explained individually
- Any value cannot be traced to a source
- Any correction lacks historical justification
- Any aggregation hides raw data inconsistencies

If the data cannot be defended,  
it MUST NOT be shown.

---

## 8. Chart Anti-Patterns (ZERO TOLERANCE)

The following are considered **chart violations**:

- Mixing realtime ticks into historical series
- Smoothing or interpolating missing data
- Rewriting historical points for aesthetics
- “Fixing” spikes without audit evidence
- Rebuilding full chart series on every update
- Letting animation logic influence data structure

These patterns MUST be **REJECTED**, not patched.

---

## 9. Enforcement Rule

Any chart implementation that:

- Misrepresents historical truth
- Hides data inconsistencies
- Optimizes visuals over correctness
- Surprises an experienced analyst

**MUST NOT BE MERGED OR DEPLOYED**.

A misleading chart  
is worse than no chart.

---

## Final Authority

This doctrine overrides:

- UI convenience
- Animation preferences
- Performance shortcuts that alter truth
- “Looks better” arguments

PikaKit charts exist to protect:

**Truth · Auditability · User Trust**

Not visual flair.

---

**Status:** LOCKED  
**Version:** 1.0.0  
**Parent:** PikaKit Architecture Doctrine  
**Override Permission:** NONE

---

⚡ PikaKit v3.9.206
