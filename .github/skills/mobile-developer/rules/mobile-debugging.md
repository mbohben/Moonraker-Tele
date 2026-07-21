---
name: mobile-debugging
description: Mobile crash triage, native profiling, memory leak detection, network debugging, and platform-specific tools
title: "Mobile Debugging Guide"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: mobile, debugging
---

# Mobile Debugging Guide

> **Stop console.log() debugging!**
> Mobile apps have complex native layers. Text logs are not enough.

---

## Debugging Mindset

```
Web Debugging:      Mobile Debugging:
┌──────────────┐    ┌──────────────┐
│  Browser     │    │  JS Bridge   │
│  DevTools    │    │  Native UI   │
│  Network Tab │    │  GPU/Memory  │
└──────────────┘    │  Threads     │
                    └──────────────┘
```

**Key Differences:**
1. **Native Layer** — JS code works, but app crashes? It's likely native (Java/Obj-C/Swift/Kotlin).
2. **Deployment** — You can't just "refresh". State gets lost or stuck.
3. **Network** — SSL Pinning, proxy settings are harder.
4. **Device Logs** — `adb logcat` and Console.app are your truth.

---

## Crash Triage: Red Screen vs Crash to Home

### JS Error (Red Screen / LogBox)

```
SYMPTOMS:
├── Red error screen (dev mode)
├── LogBox warning or error
├── "undefined is not an object"
├── "Cannot read property of null"

DIAGNOSIS:
├── Read the stack trace on screen
├── Check component tree
├── Look for missing imports / undefined props
└── Usually clear from the error message
```

### Native Crash (App Closes to Home Screen)

```
SYMPTOMS:
├── App disappears without JS error
├── White flash then home screen
├── Hang → force close

DIAGNOSIS:
├── Android: adb logcat *:E | grep -i 'fatal\|crash'
├── iOS: Xcode → Window → Devices → View Device Logs
├── Check Info.plist / AndroidManifest.xml
└── Check native module compatibility

COMMON CAUSES:
├── Missing permission declaration
├── Native module version mismatch
├── Memory exhaustion (OOM)
├── Incorrect entitlements (iOS)
└── ProGuard/R8 stripping required classes (Android)
```

> **💡 Pro Tip:** If app crashes immediately on launch, it's almost 100% a native configuration issue.

---

## React Native Debugging Tools

### Primary Tools

| Tool | Purpose | Status |
|------|---------|--------|
| **React DevTools** | Component tree, props, state inspection | ✅ Active (recommended) |
| **React Native DevTools** | Integrated debugger (RN 0.76+) | ✅ Active |
| **Reactotron** | State/API/Redux/AsyncStorage inspection | ✅ Active |
| **Expo Dev Tools** | Element inspector, network, performance | ✅ Active (Expo projects) |
| ~~Flipper~~ | ~~Layout/Network/DB~~ | ❌ **Deprecated for RN** |

> **Note:** Flipper was deprecated from React Native in late 2024. Use React Native DevTools (built-in) or Reactotron instead.

### React Native DevTools (RN 0.76+)

```
Access: press j in Metro terminal
├── Component Inspector
├── Network Inspector  
├── Console
├── Profiler
└── Works in dev mode only
```

### Reactotron Setup

```bash
npm install reactotron-react-native
```

```typescript
// ReactotronConfig.ts
import Reactotron from 'reactotron-react-native';

Reactotron.configure()
  .useReactNative({
    networking: { ignoreUrls: /symbolicate/ },
    storybook: true,
  })
  .connect();
```

Features: API requests, state snapshots, Redux actions, AsyncStorage, custom logs.

---

## Flutter Debugging Tools

### Flutter DevTools

```
Access: flutter run → press v (opens DevTools in browser)

Available tabs:
├── Flutter Inspector — Widget tree, layout explorer
├── Performance — Frame rendering, jank detection
├── CPU Profiler — Function-level CPU usage
├── Memory — Allocation tracking, leak detection
├── Network — HTTP requests
├── Logging — Structured logs
└── App Size — Bundle analysis
```

### Flutter-Specific Debugging

```dart
// Layout debugging
debugPaintSizeEnabled = true;       // Show widget boundaries
debugPaintBaselinesEnabled = true;  // Show text baselines
debugPaintPointersEnabled = true;   // Show touch points

// Performance debugging
debugProfileBuildsEnabled = true;   // Log widget builds
debugPrintRebuildDirtyWidgets = true; // Print rebuild reasons

// Always run in profile mode for perf testing:
// flutter run --profile
```

### Widget Inspector

```
Access: press i in terminal (or DevTools)
├── Select widget on device
├── See widget tree hierarchy
├── View properties and constraints
├── Hot-reload after changes
└── Debug layout overflow issues
```

---

## Native Platform Debugging

### iOS (Xcode)

| Tool | Purpose | Access |
|------|---------|--------|
| **Console.app** | System logs, crash reports | Applications → Utilities |
| **Xcode Instruments** | Time Profiler, Allocations, Leaks | Product → Profile |
| **View Debugger** | 3D UI hierarchy | Debug → View Debugging |
| **Memory Graph** | Retain cycle detection | Debug → Debug Memory Graph |
| **Network Link Conditioner** | Simulate slow networks | Settings → Developer |

### Android (Android Studio)

| Tool | Purpose | Access |
|------|---------|--------|
| **Logcat** | System logs, crash traces | `adb logcat` or Android Studio |
| **Android Profiler** | CPU, Memory, Network, Energy | View → Tool Windows → Profiler |
| **Layout Inspector** | UI hierarchy debugging | Tools → Layout Inspector |
| **StrictMode** | Detect disk/network on main thread | Enable in Developer Options |
| **GPU Rendering** | Frame rendering profiler | Developer Options → Profile GPU |

### Key Native Commands

```bash
# Android — filter for crashes
adb logcat *:E | grep -i 'fatal\|crash\|exception'

# Android — clear and watch
adb logcat -c && adb logcat *:W

# Android — specific app
adb logcat --pid=$(adb shell pidof -s com.example.myapp)

# iOS — open device logs
open /Applications/Utilities/Console.app

# iOS — view crash logs
xcrun simctl spawn booted log stream --predicate 'process == "MyApp"'
```

---

## Network Debugging

### Problem: No Browser DevTools Network Tab

**Solution 1: Built-in tools**
- React Native DevTools (RN 0.76+): Network tab
- Reactotron: Auto-captures all requests
- Flutter DevTools: Network tab

**Solution 2: Proxy (see ALL traffic including native SDKs)**

| Tool | Platform | Free | SSL Support |
|------|----------|:----:|:-----------:|
| **Proxyman** | macOS | ✅ (basic) | ✅ |
| **Charles Proxy** | All | Trial | ✅ |
| **mitmproxy** | All | ✅ | ✅ |

```
Setup:
1. Install proxy tool
2. Install SSL certificate on device/simulator
3. Configure device proxy settings → proxy IP:port
4. See ALL HTTP/HTTPS traffic
```

---

## Memory Leak Detection

### Common Leak Sources

| Source | Platform | Detection |
|--------|----------|-----------|
| Uncleared timers | RN/Flutter | Profiler → steady memory growth |
| Event listeners not removed | RN | Profiler + useEffect cleanup |
| Stream subscriptions | Flutter | DevTools Memory tab |
| Large image cache | Both | Memory tab → allocation timeline |
| Async after unmount | RN | LogBox warning + AbortController |
| AnimationController not disposed | Flutter | DevTools Memory + lint |

### Memory Profiling Workflow

```
1. Open profiler (DevTools / Instruments / Android Profiler)
2. Perform suspected leaking action
3. Navigate away from screen
4. Force garbage collection (GC button)
5. Check: does memory return to baseline?
6. If NO → leak detected
7. Take heap snapshot to find retained objects
```

### React Native Memory Check

```typescript
// Check for cleanup
useEffect(() => {
  const subscription = eventEmitter.addListener('event', handler);
  const interval = setInterval(fetchData, 5000);
  const controller = new AbortController();

  return () => {
    subscription.remove();     // ✅ Clean listener
    clearInterval(interval);   // ✅ Clean timer
    controller.abort();        // ✅ Cancel async
  };
}, []);
```

### Flutter Memory Check

```dart
@override
void dispose() {
  _controller.dispose();       // ✅ Animation controller
  _subscription.cancel();      // ✅ Stream subscription
  _textController.dispose();   // ✅ Text controller
  _focusNode.dispose();        // ✅ Focus node
  super.dispose();
}
```

---

## Platform-Specific Nightmares

### Android

| Problem | Cause | Fix |
|---------|-------|-----|
| Gradle sync fail | Java version mismatch | Check `JAVA_HOME`, use JDK 17 |
| Emulator `localhost` | Different network | Use `10.0.2.2` instead of `127.0.0.1` |
| Cached builds | Stale native artifacts | `./gradlew clean` |
| Duplicate classes | Dependency conflict | Check `./gradlew dependencies` |
| R8/ProGuard | Strips used classes | Add keep rules |

### iOS

| Problem | Cause | Fix |
|---------|-------|-----|
| Pod issues | Cache/version mismatch | `pod deintegrate && pod install` |
| Signing errors | Team ID / bundle ID | Check Signing & Capabilities |
| Build cache | Stale artifacts | Product → Clean Build Folder |
| Simulator crash | Missing entitlements | Check .entitlements file |
| Archive fails | Debug-only code | Check `#if DEBUG` guards |

### React Native Build Cleaning

```bash
# Nuclear clean (when nothing works)
# Android
cd android && ./gradlew clean && cd ..

# iOS
cd ios && pod deintegrate && pod install && cd ..

# Metro cache
npx react-native start --reset-cache

# Watchman
watchman watch-del-all
```

### Flutter Build Cleaning

```bash
flutter clean
flutter pub get
cd ios && pod install && cd ..
```

---

## Performance Debugging

### "The UI is Laggy" — Don't Guess, Measure

| Framework | Tool | Access |
|-----------|------|--------|
| React Native | Performance Monitor | Shake menu → Show Perf Monitor |
| React Native | React DevTools Profiler | Press `j` in Metro |
| Flutter | Performance Overlay | `flutter run --profile`, press `P` |
| Flutter | DevTools Performance tab | Press `v` in terminal |
| Android | GPU Rendering bars | Developer Options |
| iOS | Core Animation FPS | Instruments |

### What to Look For

```
JS Thread drops (React Native):
├── Heavy computation in render
├── Large JSON parsing
├── Complex filtering/sorting
└── Fix: move to useMemo, workers

UI Thread drops (Both):
├── Too many views
├── Heavy images
├── Layout thrashing
└── Fix: reduce views, optimize images

Main Thread jank (Flutter):
├── Heavy build() methods
├── Synchronous I/O
├── Large widget trees
└── Fix: const constructors, isolates
```

---

## Troubleshooting

| Symptom | First Check | Second Check | Third Check |
|---------|-------------|--------------|-------------|
| Crash on launch | Info.plist / Manifest | Native module versions | Clean build |
| White screen | JS bundle loading | Metro/build errors | Entry point |
| Slow startup | Bundle size | Initialization code | Lazy loading |
| Network fails | SSL/Certificate | Proxy settings | ATS config (iOS) |
| Memory growing | Timer cleanup | Image cache limits | Heap snapshot |
| Laggy scroll | List virtualization | Image sizes | Re-render count |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| `console.log` everything | Use Reactotron / DevTools |
| "It works on simulator" | Test on real device |
| "Reinstall node_modules" | Clean native build first |
| Ignore native logs | Read logcat / Console.app |
| Guess at performance | Measure with profiler |
| Debug in dev mode | Profile in release/profile mode |
| Skip memory profiling | Check for leaks before release |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [mobile-performance.md](mobile-performance.md) | Performance optimization techniques |
| [mobile-testing.md](mobile-testing.md) | Testing strategies including E2E |
| [mobile-backend.md](mobile-backend.md) | API/network debugging context |
| [platform-ios.md](platform-ios.md) | iOS-specific debugging tools |
| [platform-android.md](platform-android.md) | Android-specific debugging tools |
| [../frameworks/react-native.md](../frameworks/react-native.md) | RN architecture and error handling |
| [../frameworks/flutter.md](../frameworks/flutter.md) | Flutter architecture and error handling |

---

⚡ PikaKit v3.9.206
