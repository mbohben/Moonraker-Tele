---
name: frontend-review-checklist
version: "3.9.206"
status: LOCKED
authority: ENFORCEMENT
parent: frontend-mobile-doctrine
---

# 🧾 PikaKit Frontend Gesture Review Checklist  
**(Hard Merge Gate · Mobile UX Enforcement)**

This checklist is a **MANDATORY enforcement gate** for any change involving:

- Mobile layout
- Scroll behavior
- Swipe gestures
- Tab navigation
- Touch interaction
- iOS / Android gesture handling

If **ANY** item fails,  
the change **MUST NOT BE MERGED**.

This checklist enforces:
- PikaKit Frontend Mobile Doctrine
- PikaKit Swipe Tabs Doctrine
- PikaKit Performance Doctrine
- PikaKit Architecture Doctrine

---

## 1. Scope Declaration (MANDATORY)

- [ ] This change explicitly declares whether it affects gestures or scroll
- [ ] No gesture or scroll behavior is introduced implicitly
- [ ] Scope is fully understood by the reviewer

Unclear scope = **AUTOMATIC REJECTION**.

---

## 2. Scroll Ownership Verification

Confirm ALL of the following:

- [ ] Page root does **NOT** scroll
- [ ] Swipe container does **NOT** scroll
- [ ] Exactly **ONE** vertical scroll container exists
- [ ] The scroll container is `ScrollContent`

Multiple scroll containers = **CRITICAL UX VIOLATION**.

---

## 3. Swipe Architecture Compliance

- [ ] The universal swipe implementation is used
- [ ] No page-specific swipe overrides exist
- [ ] Swipe logic is not duplicated
- [ ] Swipe thresholds are global and unchanged

If swipe behavior differs between pages → **REJECT**.

---

## 4. Gesture Arbitration Correctness

- [ ] Horizontal intent triggers swipe
- [ ] Vertical intent triggers scroll
- [ ] Swipe cancels when vertical movement dominates
- [ ] Gesture resolution is deterministic (no heuristics)

Ambiguous gesture behavior = **INVALID IMPLEMENTATION**.

---

## 5. Structural Hierarchy Check

Verify the layout order:

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

* [ ] Header is outside the swipe layer
* [ ] TabBar is outside the swipe layer
* [ ] Only ScrollContent scrolls

Hierarchy violations break sticky and gestures.

---

## 6. iOS Stability Verification (MANDATORY)

* [ ] Tested on real iOS device or simulator
* [ ] No scroll bounce amplification
* [ ] No gesture lock-ups or stuck states
* [ ] Swipe + scroll interaction feels identical to other pages

Not tested on iOS = **REJECT**.

---

## 7. Forbidden Pattern Scan (ZERO TOLERANCE)

Confirm NONE of the following exist:

* [ ] Swipe logic attached to scroll containers
* [ ] Conditional gesture behavior per page
* [ ] Gesture logic based on content height
* [ ] JavaScript hacks to “fix” gestures
* [ ] Mixing transform-based swipe with native scroll
* [ ] Using `100vh` without subtracting system UI heights

Presence of ANY item above = **AUTOMATIC REJECTION**.

---

## 8. Performance & Stability Check

* [ ] No new layout shift introduced
* [ ] No flicker during gesture
* [ ] Cached content is not cleared
* [ ] Gesture does not trigger unnecessary re-renders

If the UI feels less stable → **REJECT**.

---

## 9. Cross-Page Consistency Check

* [ ] Gesture feels identical across all pages
* [ ] Scroll behavior is consistent
* [ ] No page feels “special” or different

If one page feels different,
the **system has drifted**.

---

## 10. Reviewer Assertion (MANDATORY)

The reviewer MUST be able to state:

* [ ] Which doctrine this change complies with
* [ ] Why no new invariant is introduced
* [ ] Why future engineers need no special context
* [ ] Why this change will not surprise users

If the reviewer cannot explain this confidently → **REJECT**.

---

## Final Enforcement Gate

* [ ] ALL checklist items pass
* [ ] No doctrine is violated
* [ ] No local patch is used to fix a systemic issue

If **ANY** checkbox is unchecked,
**DO NOT MERGE**.

---

## Enforcement Statement

Gesture consistency is a **SYSTEM INVARIANT**, not a UI detail.

Broken gestures:

* Break navigation
* Break trust
* Break mobile UX irreversibly

When in doubt — **REJECT THE CHANGE**.

---

**Status:** LOCKED
**Version:** 1.0.0
**Parent:** PikaKit Frontend Mobile Doctrine
**Override Permission:** NONE

---

⚡ PikaKit v3.9.206
