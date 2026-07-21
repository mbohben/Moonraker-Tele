---
name: interaction-patterns-doctrine
version: "3.9.206"
status: LOCKED
authority: CONSTITUTIONAL
parent: frontend-mobile-doctrine
---

# 👉 PikaKit Swipe Tabs Doctrine  
**(Universal Swipe · Gesture · Navigation Law)**

This doctrine defines the **single, universal swipe-tab architecture**
used across PikaKit.

Swipe is **NOT** a visual effect.  
Swipe is a **navigation primitive**.

If swipe behavior differs between pages,  
the system is **BROKEN**.

---

## 1. Core Intent

The swipe-tabs system exists to guarantee:

- Predictable gestures
- Identical interaction across screens
- iOS-safe scrolling behavior
- Zero page-specific exceptions

Consistency is more important than animation smoothness.

---

## 2. Single Implementation Law (NON-NEGOTIABLE)

PikaKit MUST have:

- **Exactly ONE swipe implementation**
- Shared across **ALL** pages
- No page-specific overrides
- No conditional gesture logic

Duplicated or specialized swipe logic  
is a **SYSTEM VIOLATION**.

---

## 3. Swipe vs Scroll Responsibility Law

Swipe and scroll are **mutually exclusive responsibilities**.

Rules:

- Swipe containers MUST NEVER scroll
- Scroll containers MUST NEVER swipe
- Swipe logic MUST NOT depend on scroll state
- Scroll logic MUST NOT interpret horizontal gestures

Violation of separation  
creates undefined behavior.

---

## 4. Structural Placement Law

Swipe MUST live in the following structure:

```txt
Header (non-scrolling)
  ↓
TabBar (non-scrolling)
  ↓
Swipe Container (horizontal only)
  ↓
Tab Panel
  ↓
ScrollContent (vertical only)
````

Rules:

* Header and TabBar MUST live OUTSIDE the swipe layer
* Swipe container MUST NOT be transformed vertically
* ScrollContent is the ONLY scrollable element

---

## 5. Gesture Arbitration Law

Gesture intent MUST be resolved deterministically.

Rules:

* Horizontal intent → swipe
* Vertical intent → scroll
* If vertical movement dominates → swipe MUST cancel
* Thresholds and velocity rules MUST be global and consistent

Gesture logic MUST be deterministic.
“Heuristic” behavior is **FORBIDDEN**.

---

## 6. Platform Consistency Law

Swipe behavior MUST:

* Feel identical on every page
* Behave consistently on iOS and Android
* Remain stable under partial or aborted gestures
* Never break sticky layout behavior

If swipe feels different anywhere,
the implementation is **INVALID**.

---

## 7. Forbidden Patterns (ZERO TOLERANCE)

The following patterns are **STRICTLY FORBIDDEN**:

* Swipe logic attached to scrollable containers
* Page-specific gesture hacks
* Conditional swipe enable/disable per screen
* Mixing `transform`-based swipe with native scrolling
* Gesture logic based on content height
* JavaScript hacks that “almost fix” gestures

If swipe feels unreliable,
the architecture is wrong.

---

## 8. Enforcement Rule

Any swipe-related change that:

* Alters gesture consistency
* Introduces page-specific behavior
* Breaks iOS scrolling stability
* Requires local fixes

**MUST NOT BE MERGED**.

Local patches are forbidden.
Fixes must occur at the system level.

---

## Final Authority

This doctrine overrides:

* Component convenience
* Animation experiments
* Framework gesture defaults
* Visual polish preferences

PikaKit swipe exists to protect:

**Predictability · Consistency · Navigation Trust**

Not visual flair.

---

**Status:** LOCKED
**Version:** 1.0.0
**Parent:** PikaKit Frontend Mobile Doctrine
**Override Permission:** NONE

---

⚡ PikaKit v3.9.206
