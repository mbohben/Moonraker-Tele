---
name: deep-linking
description: Universal Links (iOS), App Links (Android), deferred deep linking, and cross-framework configuration
title: "Philosophy: Every screen should be linkable. Users expect seamless web-to-app transitions."
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: deep, linking
---

# Deep Linking

> **Philosophy:** Every screen should be linkable. Users expect seamless web-to-app transitions.

---

## Deep Link Types

| Type | Description | Use Case |
|------|-------------|----------|
| **URI Scheme** | `myapp://path` | App-to-app, legacy |
| **Universal Links** (iOS) | `https://example.com/path` | Web-to-app, secure |
| **App Links** (Android) | `https://example.com/path` | Web-to-app, verified |
| **Deferred Deep Links** | Works even if app not installed | Marketing campaigns |

---

## Universal Links (iOS)

### 1. Host AASA File

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.com.example.myapp",
        "paths": [
          "/product/*",
          "/user/*",
          "NOT /admin/*"
        ]
      }
    ]
  }
}
```

**Host at:** `https://example.com/.well-known/apple-app-site-association`

**Critical:**
- Must be HTTPS, no redirects
- Must be valid JSON (no comments allowed)
- Content-Type: `application/json`
- File must be at root or `.well-known` path

### 2. Configure Entitlements

```xml
<!-- MyApp.entitlements -->
<key>com.apple.developer.associated-domains</key>
<array>
  <string>applinks:example.com</string>
  <string>applinks:www.example.com</string>
</array>
```

### 3. Handle in App (SwiftUI)

```swift
@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .onOpenURL { url in
                    DeepLinkRouter.handle(url)
                }
        }
    }
}
```

---

## App Links (Android)

### 1. Host assetlinks.json

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.example.myapp",
    "sha256_cert_fingerprints": [
      "AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99"
    ]
  }
}]
```

**Host at:** `https://example.com/.well-known/assetlinks.json`

### 2. Configure AndroidManifest

```xml
<activity android:name=".MainActivity">
  <intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https"
          android:host="example.com"
          android:pathPrefix="/product" />
  </intent-filter>
</activity>
```

### 3. Handle Intent (Compose)

```kotlin
@Composable
fun DeepLinkHandler(navController: NavController) {
    val context = LocalContext.current
    val activity = context as? Activity

    LaunchedEffect(Unit) {
        activity?.intent?.data?.let { uri ->
            when {
                uri.path?.startsWith("/product/") == true -> {
                    val id = uri.lastPathSegment
                    navController.navigate("product/$id")
                }
                uri.path?.startsWith("/user/") == true -> {
                    val id = uri.lastPathSegment
                    navController.navigate("user/$id")
                }
            }
        }
    }
}
```

---

## React Native Configuration

### React Navigation Deep Linking

```typescript
const linking = {
  prefixes: ['myapp://', 'https://example.com'],
  config: {
    screens: {
      Home: '',
      Product: 'product/:id',
      User: {
        path: 'user/:userId',
        parse: { userId: (id: string) => id },
      },
    },
  },
};

<NavigationContainer linking={linking}>
  {/* ... */}
</NavigationContainer>
```

### Listening for Links

```typescript
import { Linking } from 'react-native';

useEffect(() => {
  const subscription = Linking.addEventListener('url', ({ url }) => {
    handleDeepLink(url);
  });

  Linking.getInitialURL().then(url => {
    if (url) handleDeepLink(url);
  });

  return () => subscription.remove();
}, []);
```

---

## Expo Configuration

### expo-router (Recommended)

```typescript
// app/_layout.tsx — automatic file-based deep linking
export default function RootLayout() {
  return <Stack />;
}

// app/product/[id].tsx — matches /product/:id
export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ProductDetail id={id} />;
}
```

### app.json Configuration

```json
{
  "expo": {
    "scheme": "myapp",
    "web": { "bundler": "metro" },
    "plugins": [
      ["expo-router", { "origin": "https://example.com" }]
    ],
    "ios": {
      "associatedDomains": ["applinks:example.com"]
    },
    "android": {
      "intentFilters": [{
        "action": "VIEW",
        "autoVerify": true,
        "data": [{ "scheme": "https", "host": "example.com", "pathPrefix": "/product" }],
        "category": ["BROWSABLE", "DEFAULT"]
      }]
    }
  }
}
```

---

## Flutter Configuration

### GoRouter Deep Linking

```dart
final router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeScreen(),
      routes: [
        GoRoute(
          path: 'product/:id',
          builder: (context, state) {
            final id = state.pathParameters['id']!;
            return ProductScreen(productId: id);
          },
        ),
        GoRoute(
          path: 'user/:userId',
          builder: (context, state) {
            final userId = state.pathParameters['userId']!;
            return UserScreen(userId: userId);
          },
        ),
      ],
    ),
  ],
);
```

### AndroidManifest (Flutter)

```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<meta-data android:name="flutter_deeplinking_enabled" android:value="true" />

<intent-filter android:autoVerify="true">
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="https" android:host="example.com" />
</intent-filter>
```

### iOS (Flutter)

Add associated domains in Xcode Runner target → Signing & Capabilities → Associated Domains: `applinks:example.com`

---

## Deferred Deep Linking

For users who don't have the app installed:

### Flow

```
1. User clicks link on web
2. Link detected: app not installed
3. Redirect to App Store / Play Store
4. User installs app
5. App opens and receives original deep link data
```

### Solutions

| Service | Features | Status |
|---------|----------|--------|
| **Branch.io** | Full attribution, deferred links | ✅ Active, recommended |
| **Adjust** | Analytics + attribution | ✅ Active |
| **AppsFlyer** | Marketing attribution focus | ✅ Active |
| ~~Firebase Dynamic Links~~ | ~~Free, Google ecosystem~~ | ❌ **Deprecated Aug 2025** |

### Branch.io Example

```typescript
import branch from 'react-native-branch';

// Listen for deep links
branch.subscribe(({ error, params }) => {
  if (error) return console.error(error);
  if (params['+clicked_branch_link']) {
    const productId = params.productId;
    navigation.navigate('Product', { id: productId });
  }
});

// Create deep link
const branchObject = await branch.createBranchUniversalObject('product/123', {
  title: 'Cool Product',
  contentDescription: 'Check out this product',
});

const { url } = await branchObject.generateShortUrl({
  feature: 'sharing',
  channel: 'sms',
});
```

---

## QR Code Deep Links

| Library | Platform | Purpose |
|---------|----------|---------|
| `react-native-qrcode-svg` | RN | Generate QR codes |
| `qr_flutter` | Flutter | Generate QR codes |
| Core Image (`CIFilter`) | iOS Native | Generate QR codes |
| `zxing` | Android | Generate/scan QR codes |

```typescript
// React Native QR generation
import QRCode from 'react-native-qrcode-svg';

<QRCode value="https://example.com/product/123" size={200} />
```

---

## Link Preview (OG Tags)

Universal Links display previews on social media. Add meta tags to your web pages:

```html
<meta property="og:title" content="Cool Product" />
<meta property="og:description" content="Check out this amazing product" />
<meta property="og:image" content="https://example.com/images/product.jpg" />
<meta property="og:url" content="https://example.com/product/123" />
```

---

## Privacy & Compliance

| Concern | Guidance |
|---------|---------|
| **ATT (iOS)** | Deep link attribution may require ATT prompt if tracking across apps |
| **GDPR** | Store referral data only with consent; honor right-to-erasure |
| **Fingerprinting** | Probabilistic matching (IP/UA) is restricted on iOS — avoid |
| **Data minimization** | Pass only necessary params in deep link URLs |

---

## Testing Deep Links

### iOS Simulator

```bash
xcrun simctl openurl booted "https://example.com/product/123"
```

### Android Emulator

```bash
adb shell am start -a android.intent.action.VIEW -d "https://example.com/product/123"
```

### Validation Tools

| Platform | Tool |
|----------|------|
| iOS | [Apple AASA Validator](https://search.developer.apple.com/appsearch-validation-tool/) |
| Android | `adb shell pm verify-app-links --re-verify com.example.myapp` |
| Branch | Branch link debugger dashboard |

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Links open in browser | AASA/assetlinks not found | Check file hosting, HTTPS, no redirects |
| Intermittent failures | System caching | Clear link cache, reinstall app |
| Only works on some links | Path matching wrong | Check path patterns in AASA/manifest |
| Doesn't work after install | Deferred linking not set up | Use Branch.io |
| AASA not found by Apple | Invalid JSON | Validate JSON (no comments), check Content-Type |
| App Links not verified | SHA256 mismatch | Re-generate fingerprint: `keytool -list -v` |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Use URI schemes for web-to-app | Use Universal Links / App Links |
| Rely on Firebase Dynamic Links | Migrate to Branch.io or custom |
| Put comments in AASA JSON | Valid JSON only |
| Skip deferred deep linking | Handle install-then-open flow |
| Ignore link previews | Add OG meta tags |
| Track without consent | ATT + GDPR compliance |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [app-store-optimization.md](app-store-optimization.md) | Store listing with deep link targets |
| [push-notifications.md](push-notifications.md) | Push → deep link to screen |
| [../frameworks/react-native.md](../frameworks/react-native.md) | RN navigation config |
| [../frameworks/flutter.md](../frameworks/flutter.md) | GoRouter deep linking |
| [../frameworks/native.md](../frameworks/native.md) | SwiftUI/Compose navigation |

---

⚡ PikaKit v3.9.206
