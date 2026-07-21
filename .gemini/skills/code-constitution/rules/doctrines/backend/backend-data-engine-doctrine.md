---
name: backend-data-engine-doctrine
version: "3.9.206"
status: LOCKED
authority: CONSTITUTIONAL
parent: architecture-doctrine
---

# 🧱 PikaKit Backend Data Engine Doctrine  
**(Data Truth · Ingestion · Persistence Law)**

This doctrine defines the **backend data engine laws** governing how PikaKit
ingests, normalizes, persists, caches, and serves data.

The backend is **NOT** an API relay.  
The backend is a **data truth engine**.

If backend authority is bypassed,  
the system is **COMPROMISED** — even if it appears functional.

---

## 1. Data Engine Purpose

The backend exists to protect:

- Data correctness
- Historical integrity
- Cost and rate limits
- Deterministic behavior
- Long-term scalability

The backend is the **only layer** allowed to interpret external data.

---

## 2. Truth Ownership Law (NON-NEGOTIABLE)

The backend is the **single authoritative owner** of:

- External data ingestion
- Normalization and aggregation
- Validation and correction
- Persistence and storage
- Cache and freshness policy

The frontend MUST NEVER:

- Call third-party APIs directly (production)
- Normalize or aggregate raw data
- Guess, synthesize, or “fix” missing values
- Persist authoritative data

Any violation is a **DATA INTEGRITY BREACH**.

---

## 3. External Dependency Isolation Law

All third-party data sources MUST be:

- Isolated behind backend APIs
- Rate-limited centrally
- Cached and buffered
- Replaceable without frontend changes

External systems are treated as:

- Unreliable
- Rate-limited
- Non-authoritative

They are **inputs**, never system components.

---

## 4. Ingestion Taxonomy Law

All ingestion MUST be explicitly classified.  
Unclassified ingestion is **FORBIDDEN**.

### 4.1 Backfill Ingestion

- One-time or rare execution
- Writes immutable historical data
- Fully auditable and traceable
- NEVER overwritten

### 4.2 Incremental / Scheduled Ingestion

- Periodic execution
- Append-only or deterministic overwrite
- Idempotent by design
- Safe to retry

### 4.3 Realtime Ingestion

- Ephemeral and transient
- MUST NEVER be persisted as history
- Used only for live indicators
- Discarded after use

Mixing ingestion categories  
is a **HARD VIOLATION**.

---

## 5. Persistence & Immutability Law

Historical data:

- MUST be immutable once written
- MUST NOT be smoothed or interpolated
- MUST NOT be retroactively edited

Corrections MUST occur via:

- Append-only records
- Explicit correction events

Silent mutation is considered **DATA CORRUPTION**.

---

## 6. Caching & Cost Control Law

Caching is **NOT** an optimization.  
Caching is a **cost, stability, and safety mechanism**.

The backend MUST:

- Serve cached data by default
- Refresh data asynchronously
- Prevent cache stampedes
- Absorb traffic spikes without amplification

Freshness MUST NEVER:

- Block responses
- Amplify third-party API usage
- Compromise system stability

---

## 7. Scaling Invariant

External API usage MUST NOT scale with user count.

The correct model is:

```txt
External APIs
      ↓
   Backend
      ↓
Unlimited Clients
````

If user growth increases third-party calls,
the architecture is **INVALID**.

---

## 8. Backend Anti-Patterns (ZERO TOLERANCE)

The following are considered **backend violations**:

* Client-side third-party API calls
* Treating backend as a thin proxy
* Persisting realtime data as history
* Per-request external fetches
* Silent retries hiding corruption
* Backend logic conditional on frontend behavior

These patterns MUST be **REJECTED**, not patched.

---

## 9. Enforcement Rule

Any backend implementation that:

* Blurs data ownership
* Leaks external dependency semantics
* Requires frontend fixes to be “correct”
* Introduces hidden coupling

**MUST NOT BE MERGED**.

Correctness overrides convenience.

---

## Final Authority

This doctrine overrides:

* Performance shortcuts
* Framework defaults
* “Temporary” backend logic
* Cost-driven compromises that weaken truth

The backend exists to protect:

**Truth · Integrity · Scalability**

Not developer speed.

---

**Status:** LOCKED
**Version:** 1.0.0
**Parent:** PikaKit Architecture Doctrine
**Override Permission:** NONE

---

⚡ PikaKit v3.9.206
