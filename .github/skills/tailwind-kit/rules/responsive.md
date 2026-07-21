---
name: responsive
description: Tailwind CSS v4 responsive patterns — breakpoints, container queries, responsive grid/typography/images, hide/show, full layout example
title: "Responsive & Container Queries"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: responsive
---

# Responsive & Container Queries

> Mobile-first always. Container queries for components. Viewport breakpoints for page layout.

---

## Breakpoint System

| Prefix | Min Width | Target |
|--------|-----------|--------|
| (none) | 0px | Mobile-first base |
| `sm:` | 640px | Large phone |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Laptop |
| `xl:` | 1280px | Desktop |
| `2xl:` | 1536px | Large desktop |

---

## Mobile-First Pattern

```html
<!-- Base = mobile, then override for larger -->
<div class="flex flex-col md:flex-row gap-4">
  <div class="w-full md:w-1/2 lg:w-1/3">
    <p class="text-sm md:text-base lg:text-lg">
      Responsive text
    </p>
  </div>
</div>
```

---

## Container Queries (v4 Native)

| Type | Prefix | Responds To |
|------|--------|-------------|
| Viewport | `md:` | Browser window width |
| Container | `@md:` | Parent container width |

```html
<!-- Define container on parent -->
<div class="@container">
  <!-- Children respond to parent width, not viewport -->
  <div class="flex flex-col @sm:flex-row @md:grid @md:grid-cols-3 gap-4">
    <div>Card 1</div>
    <div>Card 2</div>
    <div>Card 3</div>
  </div>
</div>

<!-- Named containers for nested contexts -->
<div class="@container/sidebar">
  <nav class="@sm/sidebar:flex @md/sidebar:flex-col">
    Links
  </nav>
</div>
```

**When to use which:**

| Scenario | Use |
|----------|-----|
| Page-level layout (header, sidebar) | Viewport `md:` |
| Reusable components (card, widget) | Container `@md:` |
| Dashboard panels | Container `@md:` |

---

## Responsive Grid Patterns

```html
<!-- Auto-fit: fills available space, wraps naturally -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  <!-- Cards -->
</div>

<!-- Auto-fit with minmax (no breakpoints needed) -->
<div class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
  <!-- Cards auto-wrap based on available space -->
</div>

<!-- Sidebar + content layout -->
<div class="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
  <aside class="hidden lg:block">Sidebar</aside>
  <main>Content</main>
</div>
```

---

## Responsive Typography

```html
<!-- Fluid heading -->
<h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
  Responsive Heading
</h1>

<!-- Fluid body with line height -->
<p class="text-sm md:text-base lg:text-lg leading-relaxed md:leading-loose">
  Body text that adapts to screen size
</p>

<!-- Clamp (v4 arbitrary) — smooth scaling without breakpoints -->
<h1 class="text-[clamp(1.5rem,4vw,3rem)] font-bold">
  Fluid without breakpoints
</h1>
```

---

## Show / Hide

```html
<!-- Hide on mobile, show on desktop -->
<nav class="hidden lg:flex">Desktop nav</nav>

<!-- Show on mobile, hide on desktop -->
<button class="lg:hidden">☰ Menu</button>

<!-- Show only on specific range -->
<div class="hidden md:block xl:hidden">Tablet only</div>
```

---

## Responsive Images

```html
<!-- Aspect ratio container -->
<div class="aspect-video overflow-hidden rounded-lg">
  <img
    src="/hero.jpg"
    alt="Hero"
    class="h-full w-full object-cover"
  />
</div>

<!-- Responsive image with srcset (HTML) -->
<img
  srcset="/img-400.jpg 400w, /img-800.jpg 800w, /img-1200.jpg 1200w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  src="/img-800.jpg"
  alt="Responsive"
  class="w-full rounded-lg"
/>
```

---

## Full Layout Example

```html
<div class="min-h-screen flex flex-col">
  <!-- Header -->
  <header class="sticky top-0 z-50 border-b bg-white/80 backdrop-blur dark:bg-zinc-950/80">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
      <div class="font-bold text-lg">Logo</div>
      <nav class="hidden md:flex gap-6 text-sm">
        <a href="#">Features</a>
        <a href="#">Pricing</a>
      </nav>
      <button class="md:hidden">☰</button>
    </div>
  </header>

  <!-- Main with optional sidebar -->
  <div class="mx-auto flex w-full max-w-7xl flex-1 px-4 lg:px-8">
    <aside class="hidden lg:block w-64 shrink-0 border-r py-8 pr-6">
      Sidebar
    </aside>
    <main class="flex-1 py-8 lg:pl-8">
      Content
    </main>
  </div>

  <!-- Footer -->
  <footer class="border-t py-8">
    <div class="mx-auto max-w-7xl px-4 lg:px-8 text-sm text-zinc-500">
      © 2025
    </div>
  </footer>
</div>
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Desktop-first (override down) | Mobile-first (build up) |
| Viewport breakpoints for components | Container queries `@md:` |
| Fixed pixel widths everywhere | Use `max-w-7xl`, `w-full` |
| Skip `aspect-ratio` | Use `aspect-video`, `aspect-square` |
| Hard-code show/hide in JS | Use `hidden md:block` |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [components.md](components.md) | Component extraction |
| [v4-config.md](v4-config.md) | @theme setup + breakpoints |
| [SKILL.md](../SKILL.md) | Layout patterns |

---

⚡ PikaKit v3.9.206
