---
name: components
description: Tailwind CSS v4 component patterns — cva variants, cn() utility, Button/Card/Input extraction, class ordering, TypeScript props
title: "Component Extraction"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: components
---

# Component Extraction

> React components first. @apply only for truly static patterns. Use cva for variants.

---

## When to Extract

| Signal | Action |
|--------|--------|
| Same class combo 3+ times | Extract component |
| Complex state variants | Use `cva` for variant map |
| Design system element | Extract + document + type |

---

## cn() Utility (Essential)

```typescript
// lib/utils.ts — merge Tailwind classes safely
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Usage — last class wins, no conflicts
cn('px-4 py-2', 'px-6')        // → 'py-2 px-6'
cn('text-red-500', false && 'hidden')  // → 'text-red-500'
```

---

## Button (cva + TypeScript)

```tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base classes (always applied)
  'inline-flex items-center justify-center rounded-md font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:   'bg-primary text-white hover:bg-primary/90',
        secondary: 'bg-surface border border-zinc-200 hover:bg-zinc-50',
        ghost:     'hover:bg-zinc-100 dark:hover:bg-zinc-800',
        danger:    'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
}

// Usage
<Button variant="primary" size="lg">Save</Button>
<Button variant="ghost">Cancel</Button>
<Button variant="danger" disabled>Delete</Button>
```

---

## Card

```tsx
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-zinc-200 bg-white shadow-sm',
        'dark:border-zinc-800 dark:bg-zinc-950',
        className,
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: CardProps) {
  return <div className={cn('p-6 pb-0', className)} {...props} />
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={cn('p-6', className)} {...props} />
}

// Usage
<Card>
  <CardHeader><h3>Title</h3></CardHeader>
  <CardContent><p>Content</p></CardContent>
</Card>
```

---

## Input

```tsx
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          'h-10 w-full rounded-md border px-3 text-sm',
          'bg-white dark:bg-zinc-950',
          'border-zinc-200 dark:border-zinc-800',
          'placeholder:text-zinc-400',
          'focus:outline-none focus:ring-2 focus:ring-primary/50',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus:ring-red-500/50',
          className,
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

// Usage
<Input label="Email" type="email" placeholder="you@example.com" />
<Input label="Password" error="Required" />
```

---

## @apply (Static Only — Use Sparingly)

```css
/* Only for patterns that never need props or state */
.prose-content h2 {
  @apply text-2xl font-bold mt-8 mb-4 text-zinc-900 dark:text-white;
}

.prose-content p {
  @apply text-base leading-relaxed text-zinc-600 dark:text-zinc-400;
}
```

> ⚠️ **Avoid heavy @apply.** If it needs variants, props, or state → use React component + cva.

---

## Class Ordering Convention

```html
<div class="
  /* 1. Layout */     flex items-center justify-between
  /* 2. Sizing */     w-full h-12
  /* 3. Spacing */    px-4 py-2 gap-4
  /* 4. Typography */ text-sm font-medium
  /* 5. Colors */     bg-white text-zinc-900
  /* 6. Borders */    border border-zinc-200 rounded-lg
  /* 7. Effects */    shadow-sm
  /* 8. Transitions */transition-all duration-200
  /* 9. States */     hover:bg-zinc-50 focus:ring-2
  /* 10. Dark */      dark:bg-zinc-900 dark:text-white
  /* 11. Responsive */md:flex-row md:text-base
">
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| String concat for variants | `cva` + variant map |
| `className={condition ? 'a' : 'b'}` | `cn()` with conditional |
| Heavy @apply for everything | React component + cva |
| Skip TypeScript on props | Type all component props |
| Duplicate class sets | Extract shared component |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [responsive.md](responsive.md) | Responsive patterns |
| [v4-config.md](v4-config.md) | @theme setup |
| [SKILL.md](../SKILL.md) | Patterns overview |

---

⚡ PikaKit v3.9.206
