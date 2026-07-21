# Chart Injection Violation Example

## Why This Matters

This example demonstrates **Law 3: Realtime Ephemerality** and **Law 4: Chart Truthfulness**.

### The Problem (before.tsx)

The implementation:
1. ❌ Mixes realtime ticks with historical aggregates
2. ❌ Mutates historical chart data
3. ❌ Persists ephemeral realtime as permanent history
4. ❌ Misleads users about data accuracy

### The Systemic Risks

1. **Data Corruption**
   - Historical chart contains individual ticks (millisecond resolution)
   - Mixed with 5-minute aggregated candles
   - Impossible to distinguish which is which
   - Chart appears "more accurate" but is actually lying

2. **Financial Incorrectness**
   - Users making decisions on fake "historical" data
   - Backtesting on contaminated data produces wrong signals
   - Aggregates (MA, RSI) calculated on mixed data are invalid

3. **Performance Degradation**
   - Chart contains thousands of individual ticks
   - Memory bloat as realtime data accumulates
   - Rendering lag from excessive data points

4. **Predictability Failure**
   - Refresh page → different data (depends on when you connected to WebSocket)
   - Users see different "history"
   - No reproducibility

### The Solution (after.tsx)

**Separation of Concerns**:

1. **Historical Chart** (Immutable)
   - Only contains backend-aggregated data
   - Consistent across all users
   - Never modified by frontend
   - Refreshing shows same data

2. **Realtime Display** (Ephemeral)
   - Separate visual component
   - Clearly labeled "Live Price"
   - Not persisted
   - Not in chart
   - Shows change from last historical close

3. **Backend Aggregation** (Truth)
   - Backend collects realtime ticks
   - Aggregates at fixed intervals (5min)
   - Appends to historical table
   - Frontend receives pre-aggregated data

## Constitutional Justification

> **Law 3 — Realtime Ephemerality**
> 
> Realtime data is transient and display-only.
> It MUST NOT:
> - Be persisted as history
> - Affect aggregates
> - Contaminate charts

> **Law 4 — Chart Truthfulness**
> 
> Charts represent historical financial truth, not realtime excitement.
> Realtime ticks MUST NEVER be injected into charts.

From: Code Constitution — Master Laws

## Chart Data Doctrine

> Historical data and realtime data MUST be visually and architecturally separated.
> 
> If a user cannot distinguish historical from realtime, the system is broken.

From: Code Constitution — Data Integrity Doctrine

## Visual Separation Examples

### ✅ Good Patterns
- Separate "Live Price" badge above/below chart
- Realtime ticker with "ephemeral" label
- Crosshair showing "last close" vs "current price"
- Explicit timestamp showing historical data ends

### ❌ Bad Patterns
- Extending chart line with realtime ticks
- Updating last candle with realtime data
- Showing realtime on same Y-axis scale without separation
- Any approach where user can't tell what's historical

## When to Apply This Pattern

- **Always** when displaying charts
- **Always** when showing financial time-series
- **Always** when mixing historical + realtime
- **Always** when users make trading decisions

## Key Takeaway

**Charts show HISTORY. Realtime shows NOW. Never mix them.**

If your chart is "updating in realtime," you're violating Laws 3 and 4.

Historical data is **append-only from the backend**.  
Realtime data is **ephemeral display-only in the frontend**.

Stop, separate, and preserve chart truthfulness.

---

⚡ PikaKit v3.9.206
