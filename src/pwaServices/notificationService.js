// notificationService.js
// Backend communication layer for push notification subscriptions.
// All calls are guarded by the REACT_APP_PUSH_NOTIFICATIONS_ENABLED env flag
// and by navigator.onLine to avoid failures in offline scenarios.

const AUTH_API = process.env.REACT_APP_AUTHSERVICE;
const isPushEnabled =
  process.env.REACT_APP_PUSH_NOTIFICATIONS_ENABLED === "true";

/**
 * Sends the PushSubscription object to the backend so the server
 * can send push messages to this device.
 */
export const subscribe = async (subscription, loggedInObject) => {
  if (!isPushEnabled) {
    console.log("Push notifications disabled via env flag");
    return null;
  }

  if (!navigator.onLine) {
    console.warn("Offline: skipping push subscription POST");
    return null;
  }

  const deviceInfo = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
  };

  try {
    const response = await fetch(
      `${AUTH_API}/auth/pushNotification/subscribe`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: loggedInObject.userID,
          tenantId: loggedInObject.tenantId,
          subscription,
          deviceInfo,
        }),
      },
    );

    return response.ok ? response : null;
  } catch (err) {
    console.warn("subscribe fetch failed (non-blocking):", err.message);
    return null;
  }
};

/**
 * Unsubscribes the current device from push notifications.
 * Unsubscribes locally via the PushManager and returns the
 * subscription JSON so the caller can remove it from the backend if needed.
 */
export const unSubscribe = async () => {
  if (!isPushEnabled) {
    console.log("Push notifications disabled via env flag");
    return null;
  }

  if (!("serviceWorker" in navigator)) return null;

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      console.warn("No SW registration found during unsubscribe");
      return null;
    }

    // Race with a 2s timeout to avoid hanging on slow/broken SW
    const subscription = await Promise.race([
      registration.pushManager.getSubscription(),
      new Promise((resolve) => setTimeout(() => resolve(null), 2000)),
    ]);

    if (!subscription) return null;

    const subscriptionJson = subscription.toJSON();

    if (navigator.onLine) {
      try {
        await Promise.race([
          subscription.unsubscribe(),
          new Promise((resolve) => setTimeout(() => resolve(false), 2000)),
        ]);
        console.log("Unsubscribed from push notifications");
      } catch (err) {
        console.warn("subscription.unsubscribe() failed:", err.message);
      }
    } else {
      console.warn("Offline: skipping remote push unsubscribe");
    }

    return subscriptionJson;
  } catch (err) {
    console.warn("unSubscribe error (non-blocking):", err.message);
    return null;
  }
};
