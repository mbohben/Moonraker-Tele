---
name: game-development
description: >-
  Game development orchestrator: game loop, physics, AI, collision, and platform-specific routing.
  Use when building 2D/3D games, game mechanics, or game-specific performance optimization.
  NOT for web applications (use react-pro) or general performance (use perf-optimizer).
metadata:
  author: pikakit
  version: "3.9.206"
  category: game-development-subskill
  triggers: ["game", "game development", "Unity", "Godot", "Phaser", "game engine"]
  coordinates_with: ["perf-optimizer", "mobile-developer"]
  success_metrics: ["100% correct sub-skill routing", "<5ms routing latency"]
---

# Game Development — Orchestrator

> Route to right sub-skill. Fixed timestep. 16.67ms budget. Input abstraction.

---

## Prerequisites

**Required:** None — Game Development is a routing and principles skill.

---

## When to Use

| Situation | Action |
|-----------|--------|
| Starting a game project | Route by platform + dimension below |
| Need game loop architecture | Read game loop section |
| Performance questions | Read performance budget section |
| Architecture review | Read `rules/engineering-spec.md` |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Sub-skill routing (10 sub-skills) | Platform-specific code (→ sub-skills) |
| Game loop pattern (INPUT→UPDATE→RENDER) | Engine configuration |
| Performance budget (16.67ms at 60 FPS) | Profiling tools (→ perf-optimizer) |
| Pattern selection (6 patterns) | Shader code (→ shader) |
| AI type selection (4 types) | Mobile builds (→ mobile-developer) |

**Orchestrator skill:** Routes to sub-skills. Does NOT invoke them automatically.

---

## Sub-Skill Routing

### By Platform

| Platform | Sub-Skill |
|----------|-----------|
| Web (HTML5, WebGL) | `game-development/web-games` |
| Mobile (iOS, Android) | `game-development/mobile-games` |
| PC (Steam, Desktop) | `game-development/pc-games` |
| VR/AR headsets | `game-development/vr-ar` |

### By Dimension

| Dimension | Sub-Skill |
|-----------|-----------|
| 2D (sprites, tilemaps) | `game-development/2d-games` |
| 3D (meshes, shaders) | `game-development/3d-games` |

### By Specialty

| Specialty | Sub-Skill |
|-----------|-----------|
| GDD, balancing, psychology | `game-development/game-design` |
| Multiplayer networking | `game-development/multiplayer` |
| Visual style, assets, animation | `game-development/game-art` |
| Sound design, music, adaptive audio | `game-development/game-audio` |

---

## Game Loop (Universal)

```
INPUT  → Read player actions
UPDATE → Process game logic (fixed timestep: 50Hz)
RENDER → Draw the frame (interpolated)
```

**Fixed timestep mandatory.** Physics at 50Hz. Render interpolated. No variable delta for physics.

---

## Performance Budget (60 FPS = 16.67ms)

| System | Budget |
|--------|--------|
| Input | 1 ms |
| Physics | 3 ms |
| AI | 2 ms |
| Game Logic | 4 ms |
| Rendering | 5 ms |
| Buffer | 1.67 ms |

---

## Pattern Selection

| Pattern | Use When |
|---------|----------|
| **State Machine** | 3-5 discrete states (DEFAULT — start here) |
| **Object Pooling** | Frequent spawn/destroy (bullets, particles) |
| **Observer/Events** | Cross-system communication |
| **ECS** | 1000+ similar entities (RTS units) |
| **Command** | Undo, replay, networking |
| **Behavior Tree** | Complex AI decisions |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_PLATFORM` | No | Platform not web/mobile/pc/vr-ar |
| `ERR_INVALID_DIMENSION` | No | Dimension not 2d/3d |
| `ERR_INVALID_FPS` | No | FPS target not 30/60/120 |
| `ERR_SUBSKILL_NOT_FOUND` | No | Sub-skill directory missing |
| `ERR_MISSING_CONTEXT` | Yes | Required field missing |

**Zero internal retries.** Deterministic; same context = same routing.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Update everything every frame | Use events, dirty flags |
| Create objects in hot loops | Object pooling |
| Use variable delta for physics | Fixed timestep (50Hz) |
| Hardcode key bindings | Abstract input into actions |
| Start with ECS | State Machine first; ECS for 1000+ entities |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec | Architecture review |

| Sub-Skill | Directory |
|-----------|-----------|
| Web Games | `game-development/web-games/` |
| Mobile Games | `game-development/mobile-games/` |
| PC Games | `game-development/pc-games/` |
| VR/AR | `game-development/vr-ar/` |
| 2D Games | `game-development/2d-games/` |
| 3D Games | `game-development/3d-games/` |
| Game Design | `game-development/game-design/` |
| Multiplayer | `game-development/multiplayer/` |
| Game Art | `game-development/game-art/` |
| Game Audio | `game-development/game-audio/` |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `/game` | Workflow | Game development workflow |
| `mobile-developer` | Skill | Mobile game builds |
| `perf-optimizer` | Skill | Game performance |
| `shader` | Skill | GLSL shader programming |

---

⚡ PikaKit v3.9.206
