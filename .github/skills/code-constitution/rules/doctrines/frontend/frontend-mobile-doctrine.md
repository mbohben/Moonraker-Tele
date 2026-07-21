---
name: frontend-mobile-doctrine
version: "3.9.206"
status: LOCKED
authority: CONSTITUTIONAL
parent: architecture-doctrine
---

# 📱 PikaKit Frontend Mobile Doctrine  
**(Mobile UX · Layout · Gesture Integrity Law)**

This doctrine defines the **non-negotiable laws** governing how PikaKit’s
mobile interface is structured, rendered, scrolled, and interacted with.

Mobile UX is **NOT a collection of components**.  
Mobile UX is a **system of invariants**.

If mobile invariants are violated,  
the UI may render — but the system is **BROKEN**.

---

## 1. Mobile-First Law

PikaKit is **mobile-first**, not mobile-compatible.

Mobile defines:

- Layout hierarchy
- Scroll behavior
- Gesture expectations
- Performance constraints

Desktop adapts from mobile.  
Mobile **NEVER** adapts from desktop.

---

## 2. Layout Invariants (NON-NEGOTIABLE)

The following dimensions are **global system invariants**:

- Header height: **56px**
- TabBar height: **44px**
- Bottom navigation height: **56px**

Rules:

- Values MUST be consistent across all pages
- Values MUST NOT be overridden locally
- Values MUST NOT be duplicated as magic numbers
- Values MUST be defined in a single global source

Changing any invariant requires  
**system-wide architectural coordination**.

---

## 3. Scroll Ownership Law

Scroll is a **system-level responsibility**,  
not a component-level decision.

Hard rules:

- The page root MUST NOT scroll
- Swipe containers MUST NOT scroll
- Vertical scrolling MUST exist **ONLY** inside `ScrollContent`
- Exactly **ONE** vertical scroll container is allowed per screen

Nested or competing scroll containers  
are **CRITICAL UX VIOLATIONS**.

---

## 4. Structural Hierarchy Law

The mobile layout hierarchy is fixed:

```txt
Header (non-scrolling)
  ↓
TabBar (non-scrolling)
  ↓
Swipe / Content Container (non-scrolling)
  ↓
ScrollContent (ONLY scrollable layer)
  ↓
Bottom Navigation (non-scrolling)
````

Violating this hierarchy causes:

* Sticky failures
* Gesture conflicts
* Scroll desynchronization
* Platform-specific bugs (especially iOS)

---

## 5. Gesture & Scroll Separation Law

Gestures and scrolling MUST be **strictly separated**.

Rules:

* Gesture handling MUST live outside scroll containers
* Scroll containers MUST NOT interpret horizontal gestures
* Swipe logic MUST NOT depend on scroll position or state

Mixing gesture logic with scrolling
creates undefined behavior and is **FORBIDDEN**.

---

## 6. Mobile UX Anti-Patterns (ZERO TOLERANCE)

The following are considered **critical UX violations**:

* Multiple vertical scroll containers
* Scrolling headers or tab bars
* Page-specific layout exceptions
* Gesture logic inside scroll containers
* Wrapper components that alter scroll context
* Using `100vh` without subtracting system UI heights

These patterns MUST be **REMOVED**, not patched.

---

## 7. Consistency Enforcement Rule

If any of the following occur:

* Scroll behavior differs between pages
* Sticky elements behave inconsistently
* Gestures feel different across screens
* iOS and Android behavior diverges

Then the **layout system is broken**
and MUST be fixed at the architectural level.

Local fixes are **FORBIDDEN**.

---

## Final Authority

This doctrine overrides:

* Framework defaults
* Component convenience
* One-off bug fixes
* Visual experimentation

If a layout solution is easy
but violates these laws,
**it is the WRONG solution**.

---

**Status:** LOCKED
**Version:** 1.0.0
**Parent:** PikaKit Architecture Doctrine
**Override Permission:** NONE

---

⚡ PikaKit v3.9.206
