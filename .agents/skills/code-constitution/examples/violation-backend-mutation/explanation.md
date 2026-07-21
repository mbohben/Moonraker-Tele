# Backend Mutation Violation Example

## Why This Matters

This example demonstrates **Law 1: Truth Ownership** from the Master Constitution.

### The Problem (before.tsx)

The frontend is:
1. ❌ Making truth decisions about prices
2. ❌ Managing historical data locally
3. ❌ Calculating financial aggregates
4. ❌ Persisting data to localStorage
5. ❌ Calling external APIs directly

### The Systemic Risks

1. **Data Inconsistency**
   - Different users see different "truths"
   - No single source of historical accuracy
   - Aggregates vary by client state

2. **Correctness Failure**
   - Frontend can be manipulated via DevTools
   - localStorage can be corrupted
   - No data validation or normalization

3. **Scalability Failure**
   - Every client directly hammers external APIs
   - No rate limiting or caching
   - Amplification under load

4. **Commercial Risk**
   - Users making financial decisions on unverified data
   - Potential for data manipulation
   - No audit trail

### The Solution (after.tsx)

The backend:
- ✅ Owns all truth
- ✅ Manages historical data
- ✅ Calculates aggregates
- ✅ Validates and normalizes external data
- ✅ Provides cacheable, rate-limited API

The frontend:
- ✅ Only displays backend-provided data
- ✅ Has no local truth
- ✅ Cannot manipulate financial data
- ✅ Stateless and predictable

## Constitutional Justification

> **Law 1 — Truth Ownership**
> 
> The backend is the **single source of truth**.
> 
> If the frontend can alter financial meaning, the system is architecturally broken.

From: Code Constitution — Master Laws

## Architecture Doctrine

> The frontend MUST NEVER:
> - Depend directly on external APIs (production)
> - Reconstruct backend meaning
> - Patch missing data
> 
> If the frontend can "fix" backend data, the architecture is invalid.

From: Code Constitution — Architecture Doctrine

## When to Apply This Pattern

- Any financial data (prices, volumes, balances)
- Any historical data (charts, aggregates, trends)
- Any calculated data (averages, percentiles, rankings)
- Any persistent data (portfolios, watchlists, settings with financial impact)

## Key Takeaway

**The frontend is a VIEW, not a CALCULATOR.**

If you're writing `localStorage.setItem()` with financial data, or calculating aggregates in a React component, you're violating the Constitution.

Stop, redesign, and move the logic to the backend.

---

⚡ PikaKit v3.9.206
