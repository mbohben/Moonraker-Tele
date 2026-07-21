---
name: component-patterns
description: React.FC with TypeScript — Suspense-first, useCallback rules, props patterns, named/default exports
title: "React.FC with TypeScript, useCallback for handlers, default export."
impact: HIGH
impactDescription: "Important architectural or correctness impact"
tags: component, patterns
---

# Component Patterns

> React.FC with TypeScript, useCallback for handlers, default export.

---

## Standard Component Structure

```typescript
import React, { useState, useCallback } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { useSuspenseQuery } from '@tanstack/react-query';
import { featureApi } from '../api/featureApi';
import type { FeatureData } from '~types/feature';

interface MyComponentProps {
  id: number;
  title?: string;
  onAction?: (id: number) => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ 
  id, 
  title = 'Default Title',
  onAction 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data } = useSuspenseQuery({
    queryKey: ['feature', id],
    queryFn: () => featureApi.getById(id),
  });

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleAction = useCallback(() => {
    onAction?.(id);
  }, [id, onAction]);

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">{title}</Typography>
        <Typography>{data.content}</Typography>
        <Button onClick={handleAction}>Action</Button>
      </Paper>
    </Box>
  );
};

export default MyComponent;
```

---

## Key Patterns

| Pattern | Rule |
|---------|------|
| Props Interface | Explicit, named `ComponentNameProps` |
| Default Props | Destructure with defaults |
| Event Handlers | `useCallback` if passed to children |
| Named Export | `export const Component` |
| Default Export | At bottom for lazy loading |

---

## useCallback Rules

```typescript
// ✅ USE - Handler passed to child component
const handleClick = useCallback(() => {
  doSomething();
}, []);
<ChildComponent onClick={handleClick} />

// ✅ USE - Handler depends on props/state
const handleSubmit = useCallback(() => {
  onSubmit(formData);
}, [onSubmit, formData]);

// ❌ SKIP - Handler used inline only
<Button onClick={() => setOpen(true)}>
```

---

## Props Patterns

```typescript
// Required vs Optional
interface Props {
  id: number;           // Required
  title?: string;       // Optional
  onChange?: () => void; // Optional callback
}

// Children
interface Props {
  children: React.ReactNode;
}

// Render Props
interface Props {
  renderItem: (item: Item) => React.ReactNode;
}
```

---

## Exports

```typescript
// Named export (for direct imports)
export const MyComponent: React.FC<Props> = () => { ... };

// Default export (for lazy loading)
export default MyComponent;
```

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [data-fetching.md](data-fetching.md) | useSuspenseQuery for data layer |
| [mui-styling.md](mui-styling.md) | MUI v7 sx prop patterns |
| [file-organization.md](file-organization.md) | Where to place components |
| [../SKILL.md](../SKILL.md) | Core rules and anti-patterns |

---

⚡ PikaKit v3.9.206
