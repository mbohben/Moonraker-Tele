---
name: performance
description: React performance — lazy loading, React.memo, useMemo, useCallback, bundle analysis
title: "Performance Optimization"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: performance
---

# Performance Optimization

> Lazy load heavy components, memoize expensive computations.

---

## Lazy Loading

```typescript
import React, { lazy } from 'react';
import { SuspenseLoader } from '~components/SuspenseLoader';

// Lazy load heavy components
const DataGrid = lazy(() => 
  import('@mui/x-data-grid').then(m => ({ default: m.DataGrid }))
);
const RichTextEditor = lazy(() => import('./RichTextEditor'));
const ChartComponent = lazy(() => import('./Chart'));

// Usage with SuspenseLoader
<SuspenseLoader>
  <DataGrid rows={data} columns={columns} />
</SuspenseLoader>
```

---

## What to Lazy Load

| Component Type | Lazy Load? |
|----------------|------------|
| DataGrid, Tables | ✅ Yes |
| Charts (Recharts, Chart.js) | ✅ Yes |
| Rich Text Editors | ✅ Yes |
| Code Editors (Monaco) | ✅ Yes |
| Map Components | ✅ Yes |
| Dialog/Modal content | ✅ Yes |
| Simple buttons, inputs | ❌ No |
| Layout components | ❌ No |

---

## useMemo

```typescript
import { useMemo } from 'react';

// ✅ Expensive computation
const filteredData = useMemo(() => {
  return data
    .filter(item => item.status === filter)
    .sort((a, b) => b.date - a.date)
    .map(item => ({ ...item, computed: heavyFn(item) }));
}, [data, filter]);

// ❌ Don't memoize simple values
const label = `Hello ${name}`; // No useMemo needed
```

---

## useCallback

```typescript
import { useCallback } from 'react';

// ✅ Handler passed to children
const handleClick = useCallback(() => {
  console.log('clicked');
}, []);

<MemoizedChild onClick={handleClick} />

// ❌ Inline handler (no memoization needed)
<button onClick={() => setOpen(true)}>
```

---

## React.memo

```typescript
import React from 'react';

// For expensive pure components
const ExpensiveList = React.memo(({ items }) => {
  return items.map(item => <ExpensiveItem key={item.id} item={item} />);
});

// With custom comparison
const OptimizedComponent = React.memo(
  ({ data }) => <div>{data.value}</div>,
  (prevProps, nextProps) => prevProps.data.id === nextProps.data.id
);
```

---

## Bundle Analysis

```bash
# Vite bundle analyzer
npm install -D rollup-plugin-visualizer

# In vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

plugins: [
  visualizer({ open: true })
]

# Build and analyze
npm run build
```

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [component-patterns.md](component-patterns.md) | useCallback rules for components |
| [data-fetching.md](data-fetching.md) | Query caching for performance |
| [../SKILL.md](../SKILL.md) | Lazy load heavy components rule |

---

⚡ PikaKit v3.9.206
