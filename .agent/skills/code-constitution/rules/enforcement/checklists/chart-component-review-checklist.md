# Chart Component Review Checklist

Use this checklist when reviewing chart components, data visualization, or financial time-series displays.

## Constitutional Compliance

### Law 2: Historical Integrity
- [ ] **Immutable data**: Chart data never mutated after load?
- [ ] **No array mutations**: No `.splice()`, `.push()`, `.shift()`, etc. on chart data?
- [ ] **Append-only**: New data appended, not inserted?

### Law 3: Realtime Ephemerality
- [ ] **No realtime injection**: WebSocket data never added to chart?
- [ ] **Separate display**: Realtime price shown separately from chart?
- [ ] **Clear labeling**: Realtime data clearly marked as "Live" or "Ephemeral"?

### Law 4: Chart Truthfulness
- [ ] **Historical only**: Chart displays only backend-aggregated historical data?
- [ ] **No mixing**: No mix of historical aggregates + realtime ticks?
- [ ] **User can distinguish**: Clear visual separation between history and realtime?

## Chart Data Doctrine

### Data Source
- [ ] **Backend-aggregated**: Chart data comes from backend API, pre-aggregated?
- [ ] **Consistent timeframe**: Candle intervals consistent (5m, 1h, 1d)?
- [ ] **Complete data**: No gaps or missing candles?

### Realtime Handling
- [ ] **If realtime shown**: Displayed in separate component (ticker, badge)?
- [ ] **Not in chart**: Realtime NEVER extends chart line or updates last candle?
- [ ] **Change calculation**: Realtime change calculated from last historical close?

### Data Integrity
- [ ] **No frontend calculations**: OHLCV calculations done backend?
- [ ] **No data patching**: Frontend doesn't "fix" missing data?
- [ ] **Truthful representation**: Chart accurately represents backend data?

## Frontend Mobile Doctrine (if applicable)

### Gesture Conflicts
- [ ] **Native scroll first**: Chart gestures don't block native scroll?
- [ ] **Pinch-to-zoom**: Proper pinch gesture handling?
- [ ] **Touch responsiveness**: Touch interactions feel native?

### Performance
- [ ] **Lazy loading**: Large datasets virtualized or paginated?
- [ ] **Smooth rendering**: 60fps maintained during scroll/zoom?
- [ ] **Memory management**: Chart instances cleaned up on unmount?

## Performance Doctrine

### Rendering
- [ ] **Data limit**: Chart has max data points limit (e.g., 1000)?
- [ ] **Downsampling**: Large datasets downsampled for display?
- [ ] **Canvas/SVG choice**: Appropriate rendering tech chosen?

### Caching
- [ ] **Chart data cached**: API responses cached appropriately?
- [ ] **Stale-while-revalidate**: Background refresh implemented?
- [ ] **Cache invalidation**: Cache busted when data updates?

### Loading States
- [ ] **Skeleton loader**: Loading state shown while fetching?
- [ ] **Error handling**: Network errors handled gracefully?
- [ ] **Empty state**: No-data state designed?

## User Experience

### Visual Design
- [ ] **Axis labels**: X and Y axes properly labeled?
- [ ] **Tooltips**: Hover shows price, time, volume?
- [ ] **Color coding**: Green for up, red for down (if applicable)?
- [ ] **Legend**: Chart legend clear and accurate?

### Interactivity
- [ ] **Crosshair**: Crosshair shows accurate values?
- [ ] **Zoom**: Zoom maintains data integrity?
- [ ] **Pan**: Panning smooth and predictable?

### Accessibility
- [ ] **Alt text**: Chart has descriptive alt text?
- [ ] **Keyboard navigation**: Tab/arrow keys work?
- [ ] **Screen reader**: Important data points announced?

## Testing

### Data Integrity Tests
- [ ] **Correct rendering**: Chart displays test data correctly?
- [ ] **No mutations**: Data unchanged after chart renders?
- [ ] **Edge cases**: Empty data, single point, large dataset tested?

### Performance Tests
- [ ] **Large datasets**: Tested with 10k+ data points?
- [ ] **Animation**: Smooth transitions tested?
- [ ] **Memory leaks**: Chart cleanup verified?

### Visual Regression
- [ ] **Screenshot tests**: Visual regression tests pass?
- [ ] **Cross-browser**: Tested in Chrome/Safari/Firefox?
- [ ] **Mobile**: Tested on actual mobile devices?

## Commercial Guardrails

### Financial Accuracy
- [ ] **Price precision**: Sufficient decimal places shown?
- [ ] **Volume accuracy**: Volume numbers accurate?
- [ ] **Date/time correct**: Timezone handling correct?

### User Trust
- [ ] **Data source**: Data source/timestamp shown?
- [ ] **Disclaimer**: If delayed data, delay noted?
- [ ] **Error transparency**: Data errors shown to user?

## Code Quality

### Dependencies
- [ ] **Chart library**: Using approved library (TradingView, Recharts, etc.)?
- [ ] **Version pinned**: Library version pinned in package.json?
- [ ] **Bundle size**: Chart library size acceptable?

### Code Structure
- [ ] **Component split**: Chart logic separated from business logic?
- [ ] **Prop types**: All props typed (TypeScript)?
- [ ] **Error boundaries**: React error boundary wraps chart?

## Final Approval

Before approving:

- [ ] **Chart displays only historical data**
- [ ] **Realtime data (if any) clearly separated**
- [ ] **No data mutations**
- [ ] **Performance acceptable**
- [ ] **Financial data accurate**

**If realtime data appears in the chart itself, REJECT immediately. This is non-negotiable.**

---

**Checklist Version:** 1.0.0  
**Last Updated:** 2026-01-23  
**Status:** OFFICIAL

---

⚡ PikaKit v3.9.206
