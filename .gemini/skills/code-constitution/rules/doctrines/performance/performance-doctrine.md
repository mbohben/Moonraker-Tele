---
name: performance-doctrine
version: "3.9.206"
status: LOCKED
authority: CONSTITUTIONAL
parent: architecture-doctrine
---

# ⚡ PikaKit Performance Doctrine  
**(Perceived Speed · Stability · Trust Law)**

This doctrine defines the **non-negotiable performance laws**
governing how PikaKit loads, renders, updates, and feels to users.

Performance is **NOT a metric**.  
Performance is **user trust over time**.

A fast but unstable system erodes trust.  
A slightly stale but stable system preserves trust.

---

## 1. Performance Philosophy

PikaKit prioritizes **perceived performance** over raw technical freshness.

Users judge speed by:

- How fast something appears
- How stable it feels
- Whether it surprises them

Not by how fresh the data is at the millisecond level.

---

## 2. Immediate Feedback Law (NON-NEGOTIABLE)

If cached or previously known data exists:

- It MUST be rendered immediately
- It MUST NOT wait for the network
- It MUST NOT show loading spinners

Waiting for the network when usable data exists  
is a **UX FAILURE**.

---

## 3. Background Freshness Law

Data freshness MUST be resolved **asynchronously**.

Rules:

- UI MUST NOT block initial render
- UI MUST NOT flicker or reflow
- UI MUST NOT clear existing content
- UI MUST NOT replace data with spinners

Freshness is corrected quietly in the background.

---

## 4. Stability Over Accuracy Law

A stable UI with slightly stale data is preferable to:

- Loading spinners
- Flickering content
- Layout shifts
- Jarring re-renders

Accuracy matters —  
but NEVER at the cost of visual stability.

---

## 5. No Synchronous Network Dependency Law

The UI MUST NEVER synchronously depend on
network responses for initial render.

The ONLY allowed exceptions are:

- Authentication flows
- Security-critical validation

Everything else MUST degrade gracefully.

---

## 6. Consistency Across States Law

Performance behavior MUST be consistent across:

- Cold load
- Warm load
- Page refresh
- Navigation transitions

If performance differs between these states,  
the system is **INCONSISTENT**.

Inconsistency erodes trust faster than slowness.

---

## 7. Performance Anti-Patterns (ZERO TOLERANCE)

The following are considered **performance violations**:

- Blocking render on data freshness
- Replacing cached data with loading states
- Clearing content during background refresh
- Triggering full re-renders on incremental updates
- Using spinners where cached data exists
- Treating “loading” as a default state

These patterns MUST be **REJECTED**, not optimized.

---

## 8. Decision Priority Order

When performance trade-offs exist,
decisions MUST be made in this order:

1. User-perceived speed
2. Visual stability
3. Predictability
4. Data freshness
5. Technical elegance

If a solution violates **#1 or #2**,  
it is **INVALID** — regardless of benchmarks.

---

## 9. Enforcement Rule

Any change that:

- Makes the UI feel slower
- Introduces flicker or instability
- Surprises returning users
- Improves metrics but degrades experience

**MUST NOT BE MERGED**.

Missed performance metrics are recoverable.  
Lost user trust is not.

---

## Final Authority

This doctrine overrides:

- Framework defaults
- Micro-optimizations
- Blog-driven “best practices”
- Benchmark obsession

PikaKit performance exists to protect:

**Speed Perception · Stability · User Trust**

Not numbers on a dashboard.

---

**Status:** LOCKED  
**Version:** 1.0.0  
**Parent:** PikaKit Architecture Doctrine  
**Override Permission:** NONE

---

⚡ PikaKit v3.9.206
