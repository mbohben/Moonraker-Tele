---
name: mui-styling
description: MUI v7 styling — sx prop, Grid size syntax, inline vs separate files, theme access
title: "MUI v7 Styling"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: mui, styling
---

# MUI v7 Styling

> sx prop for styling, Grid with size prop, inline vs separate files.

---

## sx Prop Pattern

```typescript
import { Box, Paper } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

// Define styles object
const styles: Record<string, SxProps<Theme>> = {
  container: {
    p: 2,
    bgcolor: 'background.paper',
    borderRadius: 2,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 3,
  },
  content: {
    p: 3,
    minHeight: 200,
  },
};

// Apply in component
<Box sx={styles.container}>
  <Box sx={styles.header}>Header</Box>
  <Paper sx={styles.content}>Content</Paper>
</Box>
```

---

## MUI v7 Grid (Breaking Change!)

```typescript
import { Grid } from '@mui/material';

// ✅ MUI v7 syntax
<Grid container spacing={2}>
  <Grid size={{ xs: 12, md: 6, lg: 4 }}>
    <Paper>Item 1</Paper>
  </Grid>
  <Grid size={{ xs: 12, md: 6, lg: 4 }}>
    <Paper>Item 2</Paper>
  </Grid>
</Grid>

// ❌ OLD syntax (wrong in v7)
<Grid xs={12} md={6}>  // DON'T USE
```

---

## Inline vs Separate Styles

| Lines | Location |
|-------|----------|
| <100 | Inline in component file |
| >100 | Separate `.styles.ts` file |

```typescript
// MyComponent.styles.ts (for >100 lines)
import type { SxProps, Theme } from '@mui/material';

export const styles: Record<string, SxProps<Theme>> = {
  container: { ... },
  header: { ... },
  // ... many more styles
};
```

```typescript
// MyComponent.tsx
import { styles } from './MyComponent.styles';

<Box sx={styles.container}>
```

---

## Theme Access

```typescript
// Access theme in sx
sx={{
  bgcolor: 'primary.main',
  color: 'text.secondary',
  p: theme => theme.spacing(2),
  
  // Responsive
  width: { xs: '100%', md: '50%' },
}}
```

---

## Common sx Properties

| Short | CSS Property |
|-------|--------------|
| `p` | padding |
| `m` | margin |
| `px`, `py` | padding x/y |
| `mx`, `my` | margin x/y |
| `bgcolor` | backgroundColor |
| `display` | display |
| `gap` | gap |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [component-patterns.md](component-patterns.md) | Component structure with MUI |
| [performance.md](performance.md) | Lazy load heavy MUI components |
| [../SKILL.md](../SKILL.md) | MUI v7 Grid breaking change |

---

⚡ PikaKit v3.9.206
