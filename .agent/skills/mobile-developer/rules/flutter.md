---
name: flutter-patterns
description: Flutter and Dart best practices, Riverpod state management, widget patterns, testing, and security
title: "Flutter Patterns"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: flutter
---

# Flutter Patterns

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

---

## Widget Architecture

### Widget Selection Matrix

| Need | Widget Type |
|------|-------------|
| Static content | StatelessWidget |
| Local state | StatefulWidget |
| Inherited data | InheritedWidget / Provider |
| Animations | AnimatedWidget / AnimatedBuilder |

### Composition Pattern

```dart
// ✅ Good — composed small widgets
class UserCard extends StatelessWidget {
  final User user;
  const UserCard({required this.user});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Column(
        children: [
          UserAvatar(url: user.avatarUrl),
          UserName(name: user.name),
          UserBio(bio: user.bio),
        ],
      ),
    );
  }
}

// ❌ Bad — monolithic widget with everything inline
```

---

## State Management

### Riverpod (Recommended)

```dart
// 1. Define provider
@riverpod
Future<List<User>> fetchUsers(FetchUsersRef ref) async {
  final response = await ref.watch(apiClientProvider).get('/users');
  return response.data.map(User.fromJson).toList();
}

// 2. Consume in widget
class UserList extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final users = ref.watch(fetchUsersProvider);
    return users.when(
      data: (data) => ListView.builder(
        itemCount: data.length,
        itemBuilder: (_, i) => UserTile(user: data[i]),
      ),
      loading: () => const CircularProgressIndicator(),
      error: (e, st) => ErrorDisplay(error: e),
    );
  }
}
```

### State Management Selection

| Complexity | Solution | Status |
|------------|----------|--------|
| Simple | setState + InheritedWidget | Built-in |
| Medium | **Riverpod** | ✅ Recommended |
| Complex | **Riverpod + freezed** | ✅ Recommended |
| Legacy | Provider | Maintenance mode |
| Very Large | Bloc | Enterprise alternative |

---

## Dart 3 Features

### Sealed Classes (Exhaustive Patterns)

```dart
sealed class AuthState {}
class Authenticated extends AuthState {
  final User user;
  Authenticated(this.user);
}
class Unauthenticated extends AuthState {}
class Loading extends AuthState {}

// Exhaustive switch — compiler enforces all cases
Widget buildAuth(AuthState state) => switch (state) {
  Authenticated(:final user) => HomeScreen(user: user),
  Unauthenticated() => LoginScreen(),
  Loading() => const CircularProgressIndicator(),
};
```

### Records & Destructuring

```dart
// Named record fields
typedef UserResult = ({User user, DateTime fetchedAt});

Future<UserResult> getUser(String id) async {
  final user = await api.fetchUser(id);
  return (user: user, fetchedAt: DateTime.now());
}

// Destructure
final (:user, :fetchedAt) = await getUser('123');
```

### Pattern Matching

```dart
// Guard clauses with patterns
String describe(Object obj) => switch (obj) {
  int n when n < 0 => 'negative',
  int n when n == 0 => 'zero',
  int n => 'positive: $n',
  String s when s.isEmpty => 'empty string',
  String s => 'string: $s',
  _ => 'unknown',
};
```

---

## Architecture Patterns (Clean Architecture)

```
lib/
├── features/
│   └── user/
│       ├── presentation/    # Widgets, pages, controllers
│       ├── domain/          # Entities, use cases, repository interfaces
│       ├── data/            # Repository implementations, DTOs, data sources
│       └── providers/       # Riverpod providers for this feature
├── core/
│   ├── network/             # Dio client, interceptors
│   ├── error/               # Failure classes, error handling
│   └── utils/               # Extensions, helpers
└── main.dart
```

| Layer | Rule | Example |
|-------|------|---------|
| Presentation | Depends on Domain only | `UserPage`, `UserController` |
| Domain | No dependencies | `User`, `GetUserUseCase` |
| Data | Implements Domain interfaces | `UserRepositoryImpl`, `UserDto` |

---

## Navigation (GoRouter)

```dart
final router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => HomeScreen(),
      routes: [
        GoRoute(
          path: 'user/:id',
          builder: (context, state) {
            final id = state.pathParameters['id']!;
            return UserScreen(userId: id);
          },
        ),
      ],
    ),
  ],
);

// Deep linking automatic with GoRouter
```

---

## Performance Optimization

### const Constructors

```dart
// ✅ Good — const prevents rebuilds
const Padding(
  padding: EdgeInsets.all(16),
  child: Text('Hello'),
)

class MyIcon extends StatelessWidget {
  const MyIcon({super.key}); // const constructor
}
```

### ListView Optimization

```dart
// ✅ Good — lazy loading
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) => ItemTile(item: items[index]),
)

// ❌ Bad — loads all at once
ListView(
  children: items.map((i) => ItemTile(item: i)).toList(),
)
```

### Image Caching

```dart
CachedNetworkImage(
  imageUrl: url,
  placeholder: (context, url) => CircularProgressIndicator(),
  errorWidget: (context, url, error) => Icon(Icons.error),
)
```

---

## Testing

### Testing Stack

| Type | Tool | Purpose |
|------|------|---------|
| Unit | `flutter_test` | Business logic, models |
| Widget | `flutter_test` + `mocktail` | UI components |
| Integration | `integration_test` | Full app flows |
| Golden | `golden_toolkit` | UI regression screenshots |

### Widget Test Example

```dart
testWidgets('Counter increments', (tester) async {
  await tester.pumpWidget(const MaterialApp(home: CounterPage()));

  expect(find.text('0'), findsOneWidget);

  await tester.tap(find.byIcon(Icons.add));
  await tester.pump();

  expect(find.text('1'), findsOneWidget);
});
```

### Riverpod Test Example

```dart
test('fetchUsers returns list', () async {
  final container = ProviderContainer(overrides: [
    apiClientProvider.overrideWithValue(MockApiClient()),
  ]);

  final users = await container.read(fetchUsersProvider.future);
  expect(users, isNotEmpty);
  expect(users.first.name, equals('John'));
});
```

---

## Error Handling

### Global Error Handler

```dart
void main() {
  FlutterError.onError = (details) {
    FirebaseCrashlytics.instance.recordFlutterFatalError(details);
  };

  PlatformDispatcher.instance.onError = (error, stack) {
    FirebaseCrashlytics.instance.recordError(error, stack, fatal: true);
    return true;
  };

  runApp(const MyApp());
}
```

### Result Type Pattern

```dart
sealed class Result<T> {
  const Result();
}
class Success<T> extends Result<T> {
  final T data;
  const Success(this.data);
}
class Failure<T> extends Result<T> {
  final AppException error;
  const Failure(this.error);
}

// Usage
Future<Result<User>> getUser(String id) async {
  try {
    final user = await api.fetchUser(id);
    return Success(user);
  } on DioException catch (e) {
    return Failure(AppException.fromDio(e));
  }
}
```

---

## Accessibility

| Element | Implementation |
|---------|---------------|
| Labels | `Semantics(label: 'Submit order', child: ...)` |
| Exclude | `ExcludeSemantics(child: decorativeIcon)` |
| Merge | `MergeSemantics(child: row)` |
| Custom actions | `SemanticsAction.tap`, `.scrollUp` |
| Focus order | `FocusTraversalOrder` |

### Dynamic Type

```dart
// Respect system text scale
final textScale = MediaQuery.textScaleFactorOf(context);

// Use relative sizes
Text('Hello', style: Theme.of(context).textTheme.bodyLarge)
```

### Testing A11y

```dart
testWidgets('has correct semantics', (tester) async {
  await tester.pumpWidget(const MyApp());
  final semantics = tester.getSemantics(find.byType(SubmitButton));
  expect(semantics.label, 'Submit order');
});
```

---

## Offline Patterns

| Strategy | Package | Use Case |
|----------|---------|----------|
| API cache | `dio_cache_interceptor` | HTTP response caching |
| Key-value | `hive` / `shared_preferences` | Settings, tokens |
| Relational | `drift` (SQLite) | Complex queries, offline-first |
| Sync | `brick_offline_first` | Bi-directional sync |

### Connectivity-Aware Pattern

```dart
final connectivityProvider = StreamProvider<bool>((ref) {
  return Connectivity().onConnectivityChanged.map(
    (result) => result != ConnectivityResult.none,
  );
});

// In widget
final isOnline = ref.watch(connectivityProvider).valueOrNull ?? true;
if (!isOnline) showOfflineBanner();
```

---

## Security

| Concern | Solution |
|---------|----------|
| Secrets storage | `flutter_secure_storage` (Keychain/Keystore) |
| API keys | `--dart-define=KEY=value` (compile-time) |
| SSL pinning | `dio` + `SecurityContext` |
| Root detection | `flutter_jailbreak_detection` |
| Code obfuscation | `flutter build --obfuscate --split-debug-info=debug/` |
| Secure network | Certificate pinning + TLS 1.3 |

---

## CI/CD & Build

### Fastlane

```bash
# iOS
fastlane ios beta     # TestFlight
fastlane ios release  # App Store

# Android
fastlane android beta     # Internal testing
fastlane android release  # Play Store
```

### Codemagic / GitHub Actions

```yaml
# codemagic.yaml
workflows:
  flutter-release:
    triggering:
      events: [push]
      branch_patterns: [main]
    scripts:
      - name: Build
        script: flutter build appbundle --release
    publishing:
      google_play:
        track: internal
```

---

## Platform-Specific Code

```dart
import 'dart:io' show Platform;

Widget build(BuildContext context) {
  if (Platform.isIOS) {
    return CupertinoButton(child: Text('iOS Style'));
  }
  return ElevatedButton(child: Text('Material Style'));
}

// Or use flutter_platform_widgets for automatic switching
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Deep widget nesting | Extract to smaller widgets |
| Business logic in widgets | Clean Architecture layers |
| Ignore widget keys | Use keys for list items |
| Blocking main isolate | Use `compute()` for heavy work |
| Use Provider for new projects | Use Riverpod |
| Ignore sealed classes | Use exhaustive pattern matching |
| Skip error handling | Result type + global handlers |
| Hardcode API keys in code | Use `--dart-define` |

---

## 🔗 Related Sub-Skills

| File | When to Read |
|------|-------------|
| [publishing/app-store-optimization.md](../publishing/app-store-optimization.md) | Preparing for App Store / Play Store |
| [publishing/deep-linking.md](../publishing/deep-linking.md) | Universal links, app links |
| [publishing/push-notifications.md](../publishing/push-notifications.md) | FCM / APNs setup |

---

⚡ PikaKit v3.9.206
