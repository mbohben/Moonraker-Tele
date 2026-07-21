---
name: push-notifications
description: FCM, APNs, server-side sending, cross-framework setup, notification strategies, and compliance
title: "Philosophy: Respect the user's attention. Every notification should provide value."
impact: MEDIUM
impactDescription: "Moderate improvement to quality or maintainability"
tags: push, notifications
---

# Push Notifications

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Platform Services

| Platform | Service | Transport |
|----------|---------|-----------| 
| iOS | APNs (Apple Push Notification service) | HTTP/2 |
| Android | FCM (Firebase Cloud Messaging) | HTTP v1 API |
| Cross-platform | FCM (handles both) | Recommended |

---

## React Native Setup (FCM)

### 1. Install

```bash
npm install @react-native-firebase/app @react-native-firebase/messaging
npm install @notifee/react-native  # Local notification display & channels
```

> **@notifee** provides local notification creation, Android channels, grouping, and foreground display — complementing FCM's remote delivery.

### 2. Request Permission

```typescript
import messaging from '@react-native-firebase/messaging';

async function requestPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    const token = await messaging().getToken();
    await saveTokenToServer(token);
  }
}
```

### 3. Handle Notifications

```typescript
// Foreground — display via notifee
import notifee from '@notifee/react-native';

messaging().onMessage(async remoteMessage => {
  await notifee.displayNotification({
    title: remoteMessage.notification?.title,
    body: remoteMessage.notification?.body,
    android: { channelId: 'messages' },
  });
});

// Background — app opened via notification
messaging().onNotificationOpenedApp(remoteMessage => {
  navigation.navigate(remoteMessage.data.screen);
});

// App opened from quit state
messaging().getInitialNotification().then(remoteMessage => {
  if (remoteMessage) {
    navigation.navigate(remoteMessage.data.screen);
  }
});
```

---

## Flutter Setup (firebase_messaging)

### 1. Install

```yaml
# pubspec.yaml
dependencies:
  firebase_core: ^latest
  firebase_messaging: ^latest
  flutter_local_notifications: ^latest
```

### 2. Request Permission & Handle

```dart
import 'package:firebase_messaging/firebase_messaging.dart';

Future<void> initPush() async {
  final messaging = FirebaseMessaging.instance;

  // Request permission
  final settings = await messaging.requestPermission(
    alert: true,
    badge: true,
    sound: true,
    provisional: false, // Set true for provisional (iOS)
  );

  if (settings.authorizationStatus == AuthorizationStatus.authorized) {
    final token = await messaging.getToken();
    await saveTokenToServer(token!);
  }

  // Foreground messages
  FirebaseMessaging.onMessage.listen((RemoteMessage message) {
    showLocalNotification(message);
  });

  // Background tap → navigate
  FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
    navigateToScreen(message.data['screen']);
  });
}

// Background handler — must be top-level function
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  // Handle background data
}

void main() {
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  runApp(const MyApp());
}
```

---

## Native iOS Setup (SwiftUI)

### UNUserNotificationCenter

```swift
import UserNotifications
import FirebaseMessaging

class AppDelegate: NSObject, UIApplicationDelegate, UNUserNotificationCenterDelegate {
    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        UNUserNotificationCenter.current().delegate = self
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, _ in
            if granted {
                DispatchQueue.main.async { application.registerForRemoteNotifications() }
            }
        }
        return true
    }

    func application(_ application: UIApplication,
                     didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        Messaging.messaging().apnsToken = deviceToken
    }

    // Foreground display
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                willPresent notification: UNNotification) async -> UNNotificationPresentationOptions {
        return [.banner, .badge, .sound]
    }

    // Tap handler
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                didReceive response: UNNotificationResponse) async {
        let data = response.notification.request.content.userInfo
        handleDeepLink(data)
    }
}

@main
struct MyApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate
    var body: some Scene { WindowGroup { ContentView() } }
}
```

---

## Native Android Setup (Compose)

### FirebaseMessagingService

```kotlin
class MyFirebaseMessagingService : FirebaseMessagingService() {
    override fun onNewToken(token: String) {
        saveTokenToServer(token)
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        remoteMessage.notification?.let { notification ->
            showNotification(
                title = notification.title ?: "",
                body = notification.body ?: "",
                data = remoteMessage.data
            )
        }
    }

    private fun showNotification(title: String, body: String, data: Map<String, String>) {
        val intent = Intent(this, MainActivity::class.java).apply {
            putExtra("screen", data["screen"])
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }

        val notification = NotificationCompat.Builder(this, "messages")
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(title)
            .setContentText(body)
            .setContentIntent(PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_IMMUTABLE))
            .setAutoCancel(true)
            .build()

        NotificationManagerCompat.from(this).notify(System.currentTimeMillis().toInt(), notification)
    }
}
```

---

## Server-Side Sending (FCM Admin SDK)

### Node.js

```typescript
import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

// Send to single device
async function sendPush(token: string, title: string, body: string, data?: Record<string, string>) {
  const message: admin.messaging.Message = {
    token,
    notification: { title, body },
    data,
    android: {
      priority: 'high',
      notification: { channelId: 'messages' },
    },
    apns: {
      payload: { aps: { badge: 1, sound: 'default' } },
    },
  };

  const response = await admin.messaging().send(message);
  console.log('Sent:', response);
}

// Send to topic
async function sendToTopic(topic: string, title: string, body: string) {
  await admin.messaging().send({
    topic,
    notification: { title, body },
  });
}

// Send to multiple devices (batch)
async function sendMulticast(tokens: string[], title: string, body: string) {
  const response = await admin.messaging().sendEachForMulticast({
    tokens,
    notification: { title, body },
  });
  console.log(`${response.successCount} sent, ${response.failureCount} failed`);
}
```

### Python

```python
from firebase_admin import messaging, initialize_app

initialize_app()

message = messaging.Message(
    token="device_token",
    notification=messaging.Notification(title="Hello", body="World"),
    android=messaging.AndroidConfig(priority="high"),
    apns=messaging.APNSConfig(payload=messaging.APNSPayload(
        aps=messaging.Aps(badge=1, sound="default")
    )),
)

response = messaging.send(message)
```

---

## Notification Payload

### Data vs Notification Message

| Type | Behavior | When to Use |
|------|----------|-------------|
| **Notification** | System shows automatically | Simple alerts |
| **Data** | App handles in code | Custom handling, silent updates |
| **Both** | Notification shown, data accessible | Most common |

### Payload Structure

```json
{
  "message": {
    "token": "device_token_here",
    "notification": {
      "title": "New Message",
      "body": "You have a new message from John"
    },
    "data": {
      "screen": "chat",
      "chatId": "123",
      "senderId": "user_456"
    },
    "android": {
      "priority": "high",
      "notification": {
        "channel_id": "messages",
        "click_action": "OPEN_CHAT"
      }
    },
    "apns": {
      "payload": {
        "aps": {
          "badge": 1,
          "sound": "default",
          "category": "MESSAGE"
        }
      }
    }
  }
}
```

---

## Android Notification Channels

Required for Android 8.0+:

```typescript
// React Native (notifee)
import notifee, { AndroidImportance } from '@notifee/react-native';

async function createChannels() {
  await notifee.createChannel({
    id: 'messages',
    name: 'Messages',
    importance: AndroidImportance.HIGH,
    sound: 'default',
    vibration: true,
  });

  await notifee.createChannel({
    id: 'promotions',
    name: 'Promotions',
    importance: AndroidImportance.LOW,
  });
}
```

---

## Notification Grouping

### iOS (Thread Identifier)

```json
{
  "apns": {
    "payload": {
      "aps": {
        "thread-id": "chat-123",
        "summary-arg": "John"
      }
    }
  }
}
```

### Android (Group Key)

```kotlin
NotificationCompat.Builder(this, "messages")
    .setGroup("chat_123")
    .setGroupSummary(false)
    .build()

// Summary notification
NotificationCompat.Builder(this, "messages")
    .setGroup("chat_123")
    .setGroupSummary(true)
    .setStyle(NotificationCompat.InboxStyle()
        .addLine("John: Hey!")
        .addLine("Jane: Hello!")
        .setSummaryText("2 new messages"))
    .build()
```

---

## iOS Rich Notifications

### Notification Service Extension

```swift
class NotificationService: UNNotificationServiceExtension {
    override func didReceive(_ request: UNNotificationRequest,
                           withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
        guard let bestAttempt = request.content.mutableCopy() as? UNMutableNotificationContent else { return }

        if let imageURL = request.content.userInfo["image"] as? String {
            downloadImage(imageURL) { attachment in
                bestAttempt.attachments = [attachment]
                contentHandler(bestAttempt)
            }
        }
    }
}
```

---

## Provisional Authorization (iOS 12+)

> Deliver notifications quietly (Notification Center only) without explicit permission prompt.

```typescript
// React Native
const authStatus = await messaging().requestPermission({
  provisional: true, // No prompt — delivers quietly
});
```

```swift
// Native iOS
UNUserNotificationCenter.current().requestAuthorization(options: [.provisional]) { granted, _ in
    // Always returns true — notifications go to Notification Center quietly
}
```

**Strategy:** Start provisional → user engages → prompt for full authorization later.

---

## Local & Scheduled Notifications

```typescript
// React Native (notifee)
import notifee, { TriggerType, TimestampTrigger } from '@notifee/react-native';

// Immediate local notification
await notifee.displayNotification({
  title: 'Reminder',
  body: 'Time to check in!',
  android: { channelId: 'reminders' },
});

// Scheduled notification
const trigger: TimestampTrigger = {
  type: TriggerType.TIMESTAMP,
  timestamp: Date.now() + 60 * 60 * 1000, // 1 hour from now
};

await notifee.createTriggerNotification(
  { title: 'Reminder', body: 'Time to check in!', android: { channelId: 'reminders' } },
  trigger,
);
```

---

## Silent Push (Background Updates)

```json
{
  "apns": {
    "payload": {
      "aps": { "content-available": 1 }
    }
  },
  "data": {
    "type": "sync",
    "resource": "messages"
  }
}
```

```typescript
messaging().setBackgroundMessageHandler(async remoteMessage => {
  await syncMessages(remoteMessage.data.resource);
});
```

---

## Engagement Best Practices

### When to Send

| Good Timing | Bad Timing |
|-------------|------------|
| User's active hours (analyze data) | 3 AM |
| After meaningful event | Random promotional |
| Time-sensitive info | Same message daily |
| Personalized content | Generic blast |

### Segmentation

| Segment | Strategy |
|---------|----------|
| New users (0-7 days) | Onboarding tips |
| Active users | New features, achievements |
| Dormant users (7+ days) | Re-engagement, incentives |
| Power users | Early access, feedback requests |

### A/B Testing Elements

1. **Title** — length, emojis, personalization
2. **Body** — benefit-focused vs action-focused
3. **Timing** — morning vs evening
4. **Frequency** — daily vs weekly

---

## Privacy & Compliance

| Requirement | Detail |
|-------------|--------|
| **iOS permission** | Required before any push (except provisional) |
| **Android 13+** | `POST_NOTIFICATIONS` runtime permission required |
| **GDPR** | Consent before marketing notifications; unsubscribe mechanism |
| **CAN-SPAM** | Commercial push must allow opt-out |
| **ATT** | Not required for push itself, but needed if tracking attribution |
| **Token storage** | Encrypt device tokens at rest; delete on user account deletion |

---

## Opt-Out Metrics

| Metric | Warning Threshold |
|--------|-------------------|
| Opt-out rate | > 5% per campaign |
| Uninstall after notification | > 1% |
| Click-through rate | < 2% |

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Not receiving on iOS | Missing APNs certificate/key | Upload p8 key in Firebase Console |
| Not receiving on Android | Missing channel (8.0+) | Create channel before sending |
| Delayed delivery | Low priority | Set `priority: "high"` (Android) |
| Token expired | User reinstalled / long inactive | Handle `onNewToken` callback |
| Foreground not displaying | Not handled | Use notifee/flutter_local_notifications |
| Background handler not firing | Not registered at top level | Register before `runApp()` / `AppRegistry` |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Ask permission immediately | Ask after user sees value |
| Send same notification to all | Segment and personalize |
| Only promotional content | Mix value + promotional |
| Ignore opt-out signals | Reduce frequency for disengaged |
| Deep link to home screen | Deep link to relevant content |
| Store tokens in plaintext | Encrypt at rest |
| Skip Android 13 permission | Request POST_NOTIFICATIONS |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [app-store-optimization.md](app-store-optimization.md) | Re-engagement strategy |
| [deep-linking.md](deep-linking.md) | Push → deep link routing |
| [../frameworks/react-native.md](../frameworks/react-native.md) | RN notification setup |
| [../frameworks/flutter.md](../frameworks/flutter.md) | Flutter notification setup |
| [../frameworks/native.md](../frameworks/native.md) | Native iOS/Android handlers |

---

⚡ PikaKit v3.9.206
