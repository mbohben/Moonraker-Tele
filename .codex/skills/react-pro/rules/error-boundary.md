---
title: "Error Boundary Pattern"
impact: HIGH
impactDescription: "Error boundaries prevent entire app crashes from component errors"
tags: error, boundary, fallback, catch
---

# Error Boundary Pattern

> Class-based error boundary that catches render errors and shows fallback UI.

---

## Implementation

```tsx
import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean; error: Error | null }

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
    // Send to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div role="alert">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
```

## Usage

```tsx
// Wrap at route/feature level
<ErrorBoundary fallback={<ErrorPage />}>
  <UserDashboard />
</ErrorBoundary>
```

---

⚡ PikaKit v3.9.206
