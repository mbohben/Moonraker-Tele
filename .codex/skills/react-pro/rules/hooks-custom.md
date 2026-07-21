---
title: "Custom Hooks Patterns"
impact: MEDIUM
impactDescription: "Reusable hooks reduce duplication and improve testability"
tags: hooks, useDebounce, useLocalStorage, custom
---

# Custom Hooks Patterns

> Reusable hooks for common patterns: debounce, localStorage, and more.

---

## useDebounce

```tsx
function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}
```

## useLocalStorage

```tsx
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}
```

## Usage

```tsx
function SearchPage() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)
  const [theme, setTheme] = useLocalStorage('theme', 'dark')
  // ...
}
```

---

⚡ PikaKit v3.9.206
