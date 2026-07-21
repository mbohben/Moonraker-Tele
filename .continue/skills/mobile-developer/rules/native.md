---
name: native-patterns
description: SwiftUI (iOS) and Kotlin Compose (Android) native development patterns, testing, accessibility, and security
title: "Native Development Patterns"
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: native
---

# Native Development Patterns

> **Philosophy:** Platform-first. Use native when you need the deepest integration.

---

## When to Go Native

| Scenario | Recommendation |
|----------|----------------|
| Camera/AR heavy | Native |
| Complex animations | Native |
| System integrations | Native |
| Performance critical | Native |
| Rapid cross-platform | Flutter/RN |

---

# SwiftUI (iOS)

## View Hierarchy

```swift
struct ContentView: View {
    @State private var count = 0

    var body: some View {
        VStack(spacing: 16) {
            Text("Count: \(count)")
                .font(.largeTitle)

            Button("Increment") {
                count += 1
            }
            .buttonStyle(.borderedProminent)
        }
        .padding()
    }
}
```

---

## State Management (iOS)

| Property Wrapper | Use Case |
|-----------------|----------|
| `@State` | Local view state |
| `@Binding` | Two-way child binding |
| `@StateObject` | Own ObservableObject |
| `@ObservedObject` | Passed ObservableObject |
| `@EnvironmentObject` | Shared across hierarchy |

### Observable Pattern (iOS 17+)

```swift
@Observable
class UserStore {
    var currentUser: User?
    var isLoading = false

    func fetchUser() async {
        isLoading = true
        currentUser = await api.getUser()
        isLoading = false
    }
}

struct ProfileView: View {
    @State private var store = UserStore()

    var body: some View {
        if store.isLoading {
            ProgressView()
        } else {
            Text(store.currentUser?.name ?? "")
        }
    }
}
```

---

## Navigation (iOS 16+)

```swift
struct ContentView: View {
    @State private var path = NavigationPath()

    var body: some View {
        NavigationStack(path: $path) {
            List(items) { item in
                NavigationLink(value: item) {
                    Text(item.title)
                }
            }
            .navigationDestination(for: Item.self) { item in
                DetailView(item: item)
            }
        }
    }
}
```

---

## Testing (iOS)

### Testing Stack

| Type | Tool | Purpose |
|------|------|---------|
| Unit | XCTest | Business logic, models |
| UI | XCUITest | Full UI flows |
| Snapshot | swift-snapshot-testing | UI regression |
| Preview | Xcode Previews | Rapid iteration |

### XCTest Example

```swift
final class UserStoreTests: XCTestCase {
    func testFetchUser() async throws {
        let store = UserStore(api: MockAPI())

        await store.fetchUser()

        XCTAssertNotNil(store.currentUser)
        XCTAssertEqual(store.currentUser?.name, "John")
        XCTAssertFalse(store.isLoading)
    }
}
```

### SwiftUI View Test

```swift
func testProfileView() throws {
    let view = ProfileView()
    let inspector = try view.inspect()

    XCTAssertNoThrow(try inspector.find(text: "Profile"))
}
```

---

## Error Handling (iOS)

### Structured Error Types

```swift
enum AppError: LocalizedError {
    case network(URLError)
    case decoding(DecodingError)
    case unauthorized
    case unknown(Error)

    var errorDescription: String? {
        switch self {
        case .network(let error): return "Network: \(error.localizedDescription)"
        case .decoding: return "Data format error"
        case .unauthorized: return "Session expired"
        case .unknown(let error): return error.localizedDescription
        }
    }
}
```

### Result Pattern

```swift
func fetchUser(id: String) async -> Result<User, AppError> {
    do {
        let user = try await api.getUser(id)
        return .success(user)
    } catch let error as URLError {
        return .failure(.network(error))
    } catch {
        return .failure(.unknown(error))
    }
}
```

---

## Accessibility (iOS)

```swift
Button("Submit Order") {
    submitOrder()
}
.accessibilityLabel("Submit your order")
.accessibilityHint("Double tap to confirm and place order")
.accessibilityAddTraits(.isButton)

// Dynamic Type
Text("Hello")
    .font(.body)     // Scales automatically with system settings
    .dynamicTypeSize(...DynamicTypeSize.xxxLarge)  // Cap max size
```

---

## Offline Patterns (iOS)

| Strategy | Framework | Use Case |
|----------|-----------|----------|
| Key-value | UserDefaults / Keychain | Settings, tokens |
| Database | SwiftData / Core Data | Structured data |
| File cache | URLCache | HTTP response cache |
| Sync | CloudKit | iCloud sync |

```swift
// SwiftData (iOS 17+)
@Model
class Task {
    var title: String
    var isComplete: Bool
    var createdAt: Date

    init(title: String) {
        self.title = title
        self.isComplete = false
        self.createdAt = .now
    }
}
```

---

## Security (iOS)

| Concern | Solution |
|---------|----------|
| Secrets | Keychain Services API |
| Network | App Transport Security (ATS) enforced |
| SSL pinning | `URLSessionDelegate` certificate validation |
| Biometrics | LocalAuthentication framework (Face ID / Touch ID) |
| Code signing | Automatic via Xcode |
| Jailbreak detection | `FileManager` checks + `canOpenURL` |

---

## CI/CD (iOS)

| Tool | Use Case |
|------|----------|
| Xcode Cloud | Native CI/CD, TestFlight distribution |
| Fastlane | `fastlane ios beta` / `fastlane ios release` |
| GitHub Actions | `macos-latest` runner with `xcodebuild` |

---

## Best Practices (iOS)

| ✅ Do | ❌ Don't |
|----|-------|
| Use async/await | Completion handlers |
| Prefer @Observable (iOS 17+) | @Published everywhere |
| Extract subviews | Massive body methods |
| Use ViewModifiers | Repeated styling |
| Structured error types | Generic catches |
| SwiftData for persistence | Raw UserDefaults for data |

---

# Kotlin Compose (Android)

## Composable Functions

```kotlin
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }

    Column(
        modifier = Modifier.padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Text(
            text = "Count: $count",
            style = MaterialTheme.typography.headlineLarge
        )

        Button(onClick = { count++ }) {
            Text("Increment")
        }
    }
}
```

---

## State Management (Android)

| API | Use Case |
|-----|----------|
| `remember` | Survive recomposition |
| `rememberSaveable` | Survive config changes |
| `collectAsState()` | Flow to State |
| `ViewModel` | Business logic container |

### ViewModel Pattern

```kotlin
class UserViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(UserUiState())
    val uiState: StateFlow<UserUiState> = _uiState.asStateFlow()

    fun loadUser(id: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            val user = repository.getUser(id)
            _uiState.update { it.copy(user = user, isLoading = false) }
        }
    }
}

@Composable
fun UserScreen(viewModel: UserViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsState()

    if (uiState.isLoading) {
        CircularProgressIndicator()
    } else {
        Text(uiState.user?.name ?: "")
    }
}
```

---

## Navigation (Android)

```kotlin
NavHost(navController = navController, startDestination = "home") {
    composable("home") { HomeScreen(navController) }
    composable(
        "user/{userId}",
        arguments = listOf(navArgument("userId") { type = NavType.StringType })
    ) { backStackEntry ->
        UserScreen(userId = backStackEntry.arguments?.getString("userId"))
    }
}

navController.navigate("user/123")
```

---

## Testing (Android)

### Testing Stack

| Type | Tool | Purpose |
|------|------|---------|
| Unit | JUnit 5 + MockK | Business logic, ViewModels |
| UI | Compose UI Testing | Composable behavior |
| Integration | Espresso | Full app flows |
| Screenshot | Paparazzi | UI regression |

### Compose UI Test Example

```kotlin
@get:Rule
val composeTestRule = createComposeRule()

@Test
fun counter_increments() {
    composeTestRule.setContent { Counter() }

    composeTestRule.onNodeWithText("Count: 0").assertExists()

    composeTestRule.onNodeWithText("Increment").performClick()

    composeTestRule.onNodeWithText("Count: 1").assertExists()
}
```

### ViewModel Test Example

```kotlin
@Test
fun `loadUser updates uiState`() = runTest {
    val viewModel = UserViewModel(FakeUserRepository())

    viewModel.loadUser("123")

    val state = viewModel.uiState.first { !it.isLoading }
    assertEquals("John", state.user?.name)
}
```

---

## Error Handling (Android)

### Sealed Result

```kotlin
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val exception: AppException) : Result<Nothing>()
}

suspend fun getUser(id: String): Result<User> {
    return try {
        val user = api.fetchUser(id)
        Result.Success(user)
    } catch (e: HttpException) {
        Result.Error(AppException.fromHttp(e))
    } catch (e: IOException) {
        Result.Error(AppException.Network(e))
    }
}
```

### Global Crash Handler

```kotlin
class App : Application() {
    override fun onCreate() {
        super.onCreate()
        Thread.setDefaultUncaughtExceptionHandler { _, throwable ->
            Firebase.crashlytics.recordException(throwable)
        }
    }
}
```

---

## Accessibility (Android)

```kotlin
Button(
    onClick = { submitOrder() },
    modifier = Modifier.semantics {
        contentDescription = "Submit your order"
    }
) {
    Text("Submit")
}

// Dynamic font scaling — Material3 handles automatically
Text(
    text = "Hello",
    style = MaterialTheme.typography.bodyLarge  // Scales with system
)
```

---

## Offline Patterns (Android)

| Strategy | Library | Use Case |
|----------|---------|----------|
| Key-value | DataStore | Settings, preferences |
| Database | Room | Structured data, offline-first |
| File cache | OkHttp cache | HTTP response cache |
| Work | WorkManager | Background sync |

```kotlin
// Room entity
@Entity
data class Task(
    @PrimaryKey val id: String,
    val title: String,
    val isComplete: Boolean,
    val createdAt: Long
)

@Dao
interface TaskDao {
    @Query("SELECT * FROM task ORDER BY createdAt DESC")
    fun observeAll(): Flow<List<Task>>

    @Upsert
    suspend fun upsert(task: Task)
}
```

---

## Security (Android)

| Concern | Solution |
|---------|----------|
| Secrets | EncryptedSharedPreferences / Android Keystore |
| Network | Network Security Config (TLS enforcement) |
| SSL pinning | OkHttp `CertificatePinner` |
| Biometrics | BiometricPrompt API |
| Code obfuscation | R8/ProGuard (default in release) |
| Root detection | SafetyNet / Play Integrity API |

---

## CI/CD (Android)

| Tool | Use Case |
|------|----------|
| GitHub Actions | `ubuntu-latest` + Gradle build |
| Fastlane | `fastlane android beta` / `release` |
| Firebase App Distribution | Internal testing |
| Play Console | Staged rollout (1% → 10% → 100%) |

---

## Best Practices (Android)

| ✅ Do | ❌ Don't |
|----|-------|
| Use `remember` wisely | Remember everything |
| Hoist state up | State in leaf composables |
| Use LazyColumn | Column with many items |
| Side effects in LaunchedEffect | Side effects in composition |
| Sealed Result for errors | Generic try-catch |
| Room for persistence | Raw SharedPreferences for data |

---

## Modifier Chain

```kotlin
// Order matters!
Text(
    text = "Hello",
    modifier = Modifier
        .padding(16.dp)          // Padding inside
        .background(Color.Blue)   // Background
        .padding(8.dp)            // Padding outside
        .clickable { }            // Click area
)
```

---

## Cross-Platform Comparison

| Feature | SwiftUI | Compose |
|---------|---------|---------|
| UI Declaration | `var body: some View` | `@Composable fun` |
| Local State | `@State` | `remember` |
| Side Effects | `.task {}` | `LaunchedEffect` |
| Lists | `List` / `LazyVStack` | `LazyColumn` |
| Theming | Environment | MaterialTheme |
| Testing | XCTest + XCUITest | JUnit + Compose Testing |
| Error Pattern | `Result<T, AppError>` | `sealed class Result<T>` |
| Offline | SwiftData / Core Data | Room |

---

## 🔗 Related Sub-Skills

| File | When to Read |
|------|-------------|
| [publishing/app-store-optimization.md](../publishing/app-store-optimization.md) | Preparing for App Store / Play Store |
| [publishing/deep-linking.md](../publishing/deep-linking.md) | Universal links, app links |
| [publishing/push-notifications.md](../publishing/push-notifications.md) | FCM / APNs setup |

---

⚡ PikaKit v3.9.206
