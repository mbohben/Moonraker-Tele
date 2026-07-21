---
name: react-native-patterns
description: React Native and Expo best practices, New Architecture, navigation, performance, testing, and security
title: "React Native Patterns"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: react, native
---

# React Native Patterns

> **Philosophy:** Native-first thinking. Expo when possible. New Architecture by default.

---

## Framework Decision

| Scenario | Recommendation |
|----------|----------------|
| Rapid prototyping | Expo managed workflow |
| OTA updates needed | Expo EAS Update |
| Deep native modules | Bare workflow + native code |
| Existing native app | React Native for specific screens |

---

## New Architecture (Fabric + TurboModules)

> Default since RN 0.76. All new projects should use New Architecture.

### Key Changes

| Legacy | New Architecture |
|--------|-----------------|
| Bridge (async, JSON serialization) | JSI (synchronous, direct memory access) |
| Old Renderer | Fabric (concurrent rendering) |
| Native Modules (bridge) | TurboModules (lazy, typed) |
| No codegen | Codegen from TypeScript specs |

### TurboModule Example

```typescript
// specs/NativeCalculator.ts
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  multiply(a: number, b: number): number; // synchronous via JSI
}

export default TurboModuleRegistry.getEnforcing<Spec>('Calculator');
```

### Migration Checklist

| Step | Action |
|------|--------|
| 1 | Enable in `react-native.config.js`: `newArchEnabled: true` |
| 2 | Replace `requireNativeComponent` with `codegenNativeComponent` |
| 3 | Replace `NativeModules` with TurboModule specs |
| 4 | Test all native modules for JSI compatibility |

---

## Navigation Patterns

### React Navigation (Standard)

```typescript
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}

// Deep linking config
const linking = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    screens: { Home: 'home', Profile: 'user/:id' },
  },
};
```

### Navigation Patterns Matrix

| Pattern | When to Use |
|---------|-------------|
| Stack | Linear flows (auth, checkout) |
| Tab | 3-5 main sections |
| Drawer | Many sections, less frequent access |
| Modal | Overlays, confirmations |

---

## State Management

| Complexity | Solution | When |
|------------|----------|------|
| Simple | React Context + useReducer | < 5 screens |
| Medium | Zustand | Cross-component, persistent |
| Complex | TanStack Query + Zustand | API-heavy apps |
| Offline-first | WatermelonDB | Large datasets, sync |

---

## Architecture Patterns (MVVM)

```
src/
├── features/
│   └── user/
│       ├── screens/        # Views (React components)
│       ├── hooks/           # ViewModels (useUser, useAuth)
│       ├── services/        # Model (API calls, business logic)
│       ├── types/           # TypeScript interfaces
│       └── __tests__/       # Co-located tests
├── shared/
│   ├── components/          # Reusable UI
│   ├── hooks/               # Shared hooks
│   └── utils/               # Helpers
└── navigation/              # Navigation config
```

| Layer | Responsibility | Example |
|-------|---------------|---------|
| View | UI rendering only | `UserScreen.tsx` |
| ViewModel | State + logic | `useUser()` hook |
| Model | Data access | `userService.ts` |

---

## Performance Optimization

### Critical Rules

1. **Stable references in render**
   ```typescript
   // ❌ Bad — new function every render
   <Button onPress={() => handlePress(id)} />

   // ✅ Good — stable reference
   const handleItemPress = useCallback(() => handlePress(id), [id]);
   <Button onPress={handleItemPress} />
   ```

2. **FlashList for large lists**
   ```typescript
   import { FlashList } from "@shopify/flash-list";

   <FlashList
     data={items}
     renderItem={({ item }) => <ItemComponent item={item} />}
     estimatedItemSize={80}
   />
   ```

3. **Memoize expensive components**
   ```typescript
   const MemoizedItem = React.memo(ItemComponent, (prev, next) =>
     prev.item.id === next.item.id
   );
   ```

### JSI Performance (New Architecture)

| Avoid | Prefer |
|-------|--------|
| Frequent bridge calls | JSI synchronous calls |
| Large JSON over bridge | Direct memory sharing via JSI |
| Synchronous native calls (legacy) | TurboModules with async/sync as needed |
| Hermes disabled | Hermes enabled (default since RN 0.70) |

---

## Testing

### Testing Stack

| Type | Tool | Purpose |
|------|------|---------|
| Unit | Jest | Business logic, hooks |
| Component | React Native Testing Library | UI behavior |
| E2E | Detox / Maestro | Full device flows |
| Snapshot | Jest | UI regression |

### Component Test Example

```typescript
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Counter } from '../Counter';

test('increments counter on press', () => {
  render(<Counter />);

  fireEvent.press(screen.getByRole('button', { name: 'Increment' }));

  expect(screen.getByText('Count: 1')).toBeTruthy();
});
```

### Hook Test Example

```typescript
import { renderHook, act } from '@testing-library/react-native';
import { useCounter } from '../useCounter';

test('increments value', () => {
  const { result } = renderHook(() => useCounter());

  act(() => result.current.increment());

  expect(result.current.count).toBe(1);
});
```

---

## Error Handling

### Error Boundary

```typescript
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <View style={styles.center}>
      <Text>Something went wrong</Text>
      <Button title="Try Again" onPress={resetErrorBoundary} />
    </View>
  );
}

// Wrap screens
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <HomeScreen />
</ErrorBoundary>
```

### Crash Reporting

```typescript
// Initialize in app entry
import crashlytics from '@react-native-firebase/crashlytics';

// Global unhandled JS errors
ErrorUtils.setGlobalHandler((error, isFatal) => {
  crashlytics().recordError(error);
  if (isFatal) crashlytics().log('Fatal JS error');
});
```

### API Error Pattern

```typescript
async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const response = await api.get(`/users/${id}`);
    return { ok: true, data: response.data };
  } catch (error) {
    crashlytics().recordError(error);
    return { ok: false, error: parseApiError(error) };
  }
}
```

---

## Accessibility

| Element | Implementation |
|---------|---------------|
| Labels | `accessibilityLabel="Submit order"` |
| Roles | `accessibilityRole="button"` |
| State | `accessibilityState={{ disabled: true }}` |
| Hints | `accessibilityHint="Double tap to submit"` |
| Live regions | `accessibilityLiveRegion="polite"` |

### Dynamic Type

```typescript
import { useWindowDimensions } from 'react-native';

// Respect system font scale
const { fontScale } = useWindowDimensions();
const dynamicFontSize = 16 * fontScale;
```

### Testing A11y

```bash
# iOS: Accessibility Inspector (Xcode → Open Developer Tool)
# Android: Accessibility Scanner from Play Store
# Automated: detox --configuration ios.sim.debug --testNamePattern "a11y"
```

---

## Offline Patterns

| Strategy | Library | Use Case |
|----------|---------|----------|
| Simple cache | `@tanstack/react-query` `persistQueryClient` | API response caching |
| Key-value | `react-native-mmkv` | Settings, tokens |
| Relational | WatermelonDB | Large datasets with sync |
| Queue | NetInfo + custom queue | Offline write operations |

### Offline Queue Pattern

```typescript
import NetInfo from '@react-native-community/netinfo';

const offlineQueue: QueueItem[] = [];

async function enqueueOrExecute(action: () => Promise<void>) {
  const { isConnected } = await NetInfo.fetch();
  if (isConnected) {
    await action();
  } else {
    offlineQueue.push({ action, timestamp: Date.now() });
  }
}

// Flush on reconnect
NetInfo.addEventListener(({ isConnected }) => {
  if (isConnected) flushQueue(offlineQueue);
});
```

---

## Security

| Concern | Solution |
|---------|----------|
| Secrets storage | `react-native-keychain` (Keychain/Keystore) |
| API keys | `.env` via `react-native-config` (never in JS bundle) |
| SSL pinning | `react-native-ssl-pinning` |
| Root/Jailbreak detection | `jail-monkey` |
| Code obfuscation | Hermes bytecode (default) |
| Secure network | Certificate pinning + TLS 1.3 |

---

## CI/CD & Build

### Expo EAS

```bash
# Development build
eas build --profile development --platform ios

# Production build
eas build --profile production --platform all

# OTA update (no app store review)
eas update --branch production --message "Bug fix v1.2.1"
```

### Fastlane (Bare Workflow)

```bash
# iOS
fastlane ios beta     # TestFlight
fastlane ios release  # App Store

# Android
fastlane android beta     # Internal testing
fastlane android release  # Play Store
```

---

## Expo-Specific Patterns

### Config Plugins

```javascript
// app.config.js
export default {
  expo: {
    plugins: [
      ['expo-camera', { cameraPermission: 'Allow camera for scanning' }],
      ['expo-location', { locationAlwaysPermission: false }],
    ],
  },
};
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Use `index` as key in lists | Use unique IDs |
| Store large data in AsyncStorage | Use MMKV or WatermelonDB |
| Ignore New Architecture | Enable Fabric + TurboModules |
| Mix business logic in components | Separate hooks/services (MVVM) |
| Skip error boundaries | Wrap every navigator with ErrorBoundary |
| Hardcode API keys in JS | Use `react-native-config` + Keychain |

---

## 🔗 Related Sub-Skills

| File | When to Read |
|------|-------------|
| [publishing/app-store-optimization.md](../publishing/app-store-optimization.md) | Preparing for App Store / Play Store |
| [publishing/deep-linking.md](../publishing/deep-linking.md) | Universal links, app links |
| [publishing/push-notifications.md](../publishing/push-notifications.md) | FCM / APNs setup |

---

⚡ PikaKit v3.9.206
