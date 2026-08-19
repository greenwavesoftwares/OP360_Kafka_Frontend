// initPushNotifications.js
// Top-level orchestrator for push notification setup.
// Call this once after login with the logged-in user object.

import { registerServiceWorker } from "./registerServiceWorker";
import {
  requestNotificationPermission,
  subscribeUser,
} from "./pushNotification";

/**
 * Initializes push notifications for the current user.
 * Steps:
 *  1. Check env flag + online status
 *  2. Register (or reuse) the service worker
 *  3. Wait for SW activation
 *  4. Request notification permission
 *  5. Subscribe to push and save to backend
 *
 * Returns the backend subscription response, or null if any step fails/is skipped.
 */
export const initPushNotifications = async (loggedInObject) => {
  const isPushEnabled =
    process.env.REACT_APP_PUSH_NOTIFICATIONS_ENABLED === "true";

  if (!isPushEnabled) {
    console.log("Push notifications disabled via env flag");
    return null;
  }

  if (!navigator.onLine) {
    console.warn("Offline: skipping push notification initialization");
    return null;
  }

  if (!("serviceWorker" in navigator)) {
    console.warn("Service workers not supported in this browser");
    return null;
  }

  try {
    const registration = await registerServiceWorker();

    if (!registration.active) {
      console.warn("SW not active after registration, skipping push init");
      return null;
    }

    const permission = await requestNotificationPermission();
    if (permission !== "granted") return null;

    return await subscribeUser(registration, loggedInObject);
  } catch (error) {
    console.error("Push notification initialization failed:", error);
    return null;
  }
};
