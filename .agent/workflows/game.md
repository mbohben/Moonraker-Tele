---
description: Full-lifecycle game development — platform-specific engine routing, core loop architecture, asset pipeline optimization, multiplayer networking, and store-ready builds.
skills: [game-development, perf-optimizer, idea-storm, problem-checker, smart-router, knowledge-compiler, context-engineering]
agents: [orchestrator, assessor, recovery, critic, learner, project-planner, game-developer, backend-specialist, test-engineer]
---

# /game - Game Development

$ARGUMENTS

---

## Purpose

Orchestrate game development from concept to published game — routing to platform-specific engines, implementing core game loops, managing asset pipelines, and handling multiplayer networking. **Differs from `/build` (general web/mobile apps) by focusing on game-specific concerns: frame budgets, physics, ECS architecture, networking models, and store submission.** Uses `game-development` with `game-development` skill, coordinated by `orchestrator` for parallel art + audio + code pipelines.

---

## 🤖 Meta-Agents Integration

| Phase | Agent | Action |
| ----- | ----- | ------ |
| **Pre-Flight** | `assessor` | Evaluate scope, risks, and knowledge-compiler patterns |
| **Execution** | `orchestrator` | Coordinate parallel tasks (art, audio, code) |
| **Safety** | `recovery` | Save checkpoint before major game logic changes |
| **Conflict** | `critic` | Resolve design vs performance trade-offs |
| **Post-Build** | `learner` | Log game patterns for reuse |

```
Flow:
assessor.evaluate(scope, platform) → recovery.save()
       ↓
orchestrator.parallel(art, audio, code)
       → conflict
critic.resolve(design_vs_perf)
       ↓
verify → learner.log(patterns)
```

---

## Platform Routing

| Target | Engine | Sub-Skill |
|--------|--------|-----------|
| Web | Phaser / PixiJS / Three.js | `game-development` (web) |
| Mobile | Unity / Godot | `game-development` (mobile) |
| PC | Unity / Godot / Unreal | `game-development` (PC) |
| VR/AR | Unity XR / A-Frame | `game-development` (VR/AR) |

| Dimension | Key Concerns |
|-----------|-------------|
| 2D | Sprite batching, atlas, tile maps |
| 3D | LOD, occlusion culling, lighting |

---

## ⚡ MANDATORY: Game Development Protocol


### Phase 0: Dynamic Skill Detection

> **Protocol:** `.agent/rules/dynamic-skill-detection.md`

1. Scan `$ARGUMENTS` for domain signals (case-insensitive).
2. Match signals against the Domain Signal → Skill Mapping table.
3. Inject matched skills (max 5, priority: High > Medium > Low) into active skill set.
4. Skip skills already in workflow defaults.
5. Announce injected skills:

```
[⚡PikaKit] Dynamic Skills Detected:
  + {skill-name} (signal: "{matched keywords}")
  Base skills: [workflow defaults]
  Total active: [count]
```


### Phase 0.5: Auto-Knowledge Ingest (Git Scanner)

> **Protocol:** `.agent/rules/auto-knowledge-ingest.md`
> **Channel 1:** Scans recent git commits for project-specific lessons.

```
1. Check if .agent/knowledge/ exists — if not, skip
2. Read _index.md → get last_git_scan SHA
3. Run: git log --since="7 days ago" --grep="^fix:\|^feat:" -n 20
4. For qualifying commits (≥2 files changed OR keywords: fallback, guard, CORS, rate-limit):
   a. Skip if signal with same commit SHA exists
   b. Generate signal to raw-signals/SIG-{NNN}.md
5. Update last_git_scan in _index.md
6. If uncompiled signals > 5 → auto-compile (max 10 per batch)
```
### Phase 1: Pre-flight & knowledge-compiler Context

> **Rule 0.5-K:** knowledge-compiler pattern check.

1. Read `.agent/skills/knowledge-compiler/patterns/` for past failures before proceeding.
2. Trigger `recovery` agent to run Checkpoint (`git commit -m "chore(checkpoint): pre-game"`).

### Phase 2: Requirements & Scope

| Field | Value |
|-------|-------|
| **INPUT** | $ARGUMENTS (game concept description) |
| **OUTPUT** | Game design doc: platform, dimension, genre, multiplayer model, target FPS |
| **AGENTS** | `project-planner`, `assessor` |
| **SKILLS** | `game-development`, `idea-storm`, `context-engineering` |

1. Ask critical questions:

| Question | Options | Impact |
|----------|---------|--------|
| Platform? | Web / Mobile / PC / Console / VR-AR | Engine + build pipeline |
| Dimension? | 2D / 2.5D / 3D | Rendering pipeline |
| Genre? | Platformer / Puzzle / Shooter / RPG / Sandbox | Core mechanics |
| Multiplayer? | Solo / Local co-op / Online PvP / MMO | Networking stack |
| Target FPS? | 30 / 60 / 120 | Performance budget |

2. `assessor` evaluates scope and platform risks
3. Select engine and architecture pattern

### Phase 3: Core Game Loop & Architecture

| Field | Value |
|-------|-------|
| **INPUT** | Game design doc from Phase 2 |
| **OUTPUT** | Game loop implementation, architecture scaffold |
| **AGENTS** | `orchestrator`, `game-development` |
| **SKILLS** | `game-development`, `smart-router` |

1. Implement fixed timestep game loop:

| Target | Budget/Frame | Breakdown |
|--------|-------------|-----------|
| **60 FPS** | 16.67ms | Input 1ms  Physics 3ms  AI 2ms  Logic 4ms  Render 5ms |
| **30 FPS** | 33.33ms | Input 1ms  Physics 5ms  AI 5ms  Logic 10ms  Render 10ms |

2. Select architecture pattern:

| Pattern | Use When |
|---------|----------|
| **State Machine** | 3-5 discrete states (Idle?Run?Jump) |
| **Object Pooling** | Frequent spawn/destroy (bullets, particles) |
| **ECS** | Thousands of similar entities |
| **Behavior Tree** | Complex AI decisions |

3. Abstract input layer (keyboard → gamepad → touch)

### Phase 4: Asset Pipeline & Audio

| Field | Value |
|-------|-------|
| **INPUT** | Architecture scaffold from Phase 3 |
| **OUTPUT** | Optimized assets in `assets/`, audio system |
| **AGENTS** | `game-development` |
| **SKILLS** | `game-development` |

1. Set up asset directory structure and optimization targets:

| Asset | Optimization | Target |
|-------|-------------|--------|
| Sprites | Texture atlasing | <40964096 per atlas |
| 3D Models | LOD, mesh simplification | <10K tris (mobile) |
| Audio SFX | Mono, 22kHz, OGG | <100KB per sound |
| Shaders | GPU-efficient | Platform-appropriate |

2. Audio system: pool sources (max 32), priority UI > Player > Enemies > Ambient

### Phase 5: Multiplayer & Networking (if applicable)

| Field | Value |
|-------|-------|
| **INPUT** | Multiplayer model from Phase 2 design doc |
| **OUTPUT** | Networking layer, lobby system, anti-cheat |
| **AGENTS** | `game-development`, `nodejs-pro` |
| **SKILLS** | `game-development` |

| Model | Use When | Complexity |
|-------|----------|------------|
| **Lock-step** | Turn-based, RTS | Low |
| **Client-server** | FPS, action, MMO | High |
| **Client prediction** | Fast-paced PvP | Very high |
| **Relay (P2P)** | Co-op, casual | Medium |

Networking checklist:
- [ ] State serialization / delta compression
- [ ] Client prediction + server reconciliation
- [ ] Lobby + matchmaking
- [ ] Anti-cheat (server-authoritative)
- [ ] Graceful disconnect / reconnection

### Phase 6: Build & Export

| Field | Value |
|-------|-------|
| **INPUT** | Complete game from Phases 3-5 |
| **OUTPUT** | Platform-specific builds, optimized bundles |
| **AGENTS** | `game-development` |
| **SKILLS** | `game-development`, `perf-optimizer` |

| Platform | Build Tool | Distribution |
|----------|-----------|-------------|
| Web | Vite / esbuild | itch.io / Newgrounds |
| Android | Gradle / Unity | Google Play |
| iOS | Xcode / Unity | App Store |
| Windows | Electron / Unity / Godot | Steam |

Optimization: Tree shake → Minify → Compress assets → Code split → CDN

### Phase 7: Testing & Verification

| Field | Value |
|-------|-------|
| **INPUT** | Built game from Phase 6 |
| **OUTPUT** | Test results: FPS, memory, platform compatibility |
| **AGENTS** | `test-architect`, `learner` |
| **SKILLS** | `game-development`, `perf-optimizer`, `problem-checker`, `knowledge-compiler` |

Test checklist:
- [ ] Maintains target FPS on lowest-spec device
- [ ] No memory leaks after 10+ minutes
- [ ] Works on all target platforms
- [ ] Input responsive (<100ms lag)
- [ ] Save/load works correctly
- [ ] Multiplayer sync verified (if applicable)

---

## → MANDATORY: Problem Verification Before Completion

> **CRITICAL:** This check MUST be performed before any `notify_user` or task completion.

### Check @[current_problems]

```
1. Read @[current_problems] from IDE
2. If errors/warnings > 0:
   a. Auto-fix: imports, types, lint errors
   b. Re-check @[current_problems]
   c. If still > 0 → STOP → Notify user
3. If count = 0 → Proceed to completion
```

### Auto-Fixable

| Type | Fix |
|------|-----|
| Missing import | Add import statement |
| Unused variable | Remove or prefix `_` |
| Type mismatch | Fix type annotation |
| Lint errors | Run eslint --fix |

> **Rule:** Never mark complete with errors in `@[current_problems]`.

---



---

## MANDATORY: Post-Completion Knowledge Check

> **Protocol:** `.agent/rules/auto-knowledge-ingest.md`
> **Channel 2:** AI self-reflects on session to capture non-trivial lessons.

```
1. Self-reflect: "Was this session non-trivial?"
   - Did I fix a multi-file bug?
   - Did I discover a framework/API gotcha?
   - Did I make an architectural decision?
2. If ALL answers are NO - skip
3. If ANY answer is YES and score >= 3:
   Generate signal to raw-signals/SIG-{NNN}.md
   If uncompiled > 5 - auto-compile
```

## u{2B50}u{FE0F} MANDATORY: Suggest Next Workflow

> **After completing /game, you MUST suggest the next pipeline step to the user.**

```
u{2705} /game complete u{2192} Suggest: "Run `/validate` to test game mechanics."
```

---

## 🔄 Rollback & Recovery

If game loop, physics engine, or multiplayer netcode breaks functionality:
1. Restore to pre-game checkpoint (`git checkout -- .` or `git stash pop`).
2. Log architecture failure via `learner` meta-agent.
3. Bring in `critic` to evaluate trade-offs before retrying implementation.

---

## Output Format

```markdown
## 🎮 Game Built: [Game Name]

### Configuration

| Setting | Value |
|---------|-------|
| Platform | Web (Phaser) |
| Dimension | 2D |
| Genre | Platformer |
| Multiplayer | Solo |
| Target FPS | 60 |

### Components

| Component | Status |
|-----------|--------|
| Game loop | → |
| Asset pipeline | → |
| Audio system | → |
| Input abstraction | → |
| Multiplayer | → N/A |
| Platform build | → |

### Performance

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| FPS | 60 | 62 | → |
| Memory | <256MB | 180MB | → |
| Load time | <3s | 2.1s | → |

### Next Steps

- [ ] Playtest on target devices
- [ ] Run `/optimize` for performance tuning
- [ ] Run `/launch` to publish to store
```

---

## Examples

```
/game 2D platformer for web browser with Phaser
/game mobile puzzle game with Unity and Google Play submission
/game 3D RPG with online multiplayer support
/game retro arcade game with leaderboard
/game multiplayer shooter with client prediction
```

---

## Key Principles

- **Profile before optimizing** — measure with profiler, don't guess bottlenecks
- **Data-driven design** — levels, configs, and balancing in JSON, not hardcoded
- **Abstract input** — map actions to inputs, support keyboard + gamepad + touch
- **Object pooling** — never create/destroy in hot loops, pool everything
- **Fixed timestep** — deterministic physics separate from render framerate

---

## 🔗 Workflow Chain

**Skills Loaded (7):**

- `game-development` - Core game development patterns and engine routing
- `perf-optimizer` - Performance profiling and optimization
- `idea-storm` - Requirements gathering and scope definition
- `problem-checker` - IDE problem verification
- `smart-router` - Request classifier and agent routing
- `context-engineering` - Codebase parsing and context gathering
- `knowledge-compiler` - Learning and logging game patterns

```mermaid
graph LR
    A["/plan"] --> B["/game"]
    B --> C["/validate"]
    style B fill:#10b981
```

| After /game | Run | Purpose |
|------------|-----|---------|
| Need testing | `/validate` | Run game test suite |
| Performance tuning | `/optimize` | Profile and fix bottlenecks |
| UI polish | `/studio` | Design game UI/HUD |
| Ready to ship | `/launch` | Publish to store |

**Handoff to /validate:**

```markdown
✅ Game built! Platform: [platform], FPS: [fps], Components: [count].
Run `/validate` to test or `/optimize` for performance tuning.
```
