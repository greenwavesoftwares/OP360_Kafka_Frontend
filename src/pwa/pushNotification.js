// pushNotification.js
// Handles requesting notification permission and subscribing the user
// to Web Push via the PushManager API.

import axios from "axios";
import { subscribe } from "../pwaServices/notificationService";

const VAPID_PUBLIC_KEY = process.env.REACT_APP_VAPID_PUBLIC_KEY;
const REACT_APP_AUTHSERVICE = process.env.REACT_APP_AUTHSERVICE;
/**
 * Converts a URL-safe base64 VAPID key to a Uint8Array
 * as required by pushManager.subscribe().
 */
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Requests notification permission from the user.
 * Returns "granted", "denied", or "default".
 */
export const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error(`Notification permission ${permission}`);
  }
  return permission;
};

/**
 * Subscribes the user to push notifications via the service worker's PushManager.
 * Reuses an existing subscription if one already exists.
 * Sends the subscription to the backend via notificationService.subscribe().
 */
export const subscribeUser = async (registration, loggedInObject) => {
  // Require an active SW — pushManager.subscribe() will throw without one
  if (!registration.active) {
    console.warn("SW not active, skipping push subscription");
    return null;
  }

  try {
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      console.log("New push subscription created");
    } else {
      console.log("Reusing existing push subscription");
    }

    const response = await subscribe(subscription, loggedInObject);

    if (response) {
      console.log("Push subscription saved to backend");
      return response;
    } else {
      console.warn("Backend failed to save push subscription");
      return null;
    }
  } catch (err) {
    // Non-blocking — push failing should never break the app
    console.warn("subscribeUser failed (non-blocking):", err.message);
    return null;
  }
};

export async function showLocalNotification({
  title = "Notification",
  body = "Something happened!",
  icon = "/icon-192.png",
  badge = "/icon-72.png",
  url = "/",
  tag = "local-notification",
} = {}) {
  // Check support
  if (!("serviceWorker" in navigator) || !("Notification" in window)) {
    console.warn("Notifications are not supported");
    return;
  }

  // Request permission if needed
  let permission = Notification.permission;

  if (permission !== "granted") {
    permission = await Notification.requestPermission();
  }

  if (permission !== "granted") {
    console.warn("Notification permission denied");
    return;
  }

  // Wait for active service worker
  const registration = await navigator.serviceWorker.ready;

  // Show notification using the SW
  registration.showNotification(title, {
    body,
    icon,
    badge,
    tag,
    renotify: true,
    data: {
      url,
    },
  });
}

export async function sendNotification(tenantId, userId, notificationBody) {
  try {
    // Making GET request to get menu details
    const response = await axios.post(
      `${REACT_APP_AUTHSERVICE}/auth/pushNotification/send/${userId}/${tenantId}`,
      notificationBody,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.log("Error in sendNotification:", error);
  }
}
