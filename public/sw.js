/* eslint-disable no-restricted-globals */
/* global self, clients */

// sw.js — Service Worker
// Handles push notifications, notification clicks, install, and activate events.

self.addEventListener("install", () => {
  console.log("Service Worker installing...");
  // Skip waiting so the new SW activates immediately
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated");
  // Claim all open clients so the SW controls them without a reload
  event.waitUntil(clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {
    title: "Notification",
    body: "New update available",
    url: "/",
  };

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    console.error("Invalid push data : ", e);
  }

  const options = {
    body: data.body,
    icon: data.icon || "/icon-192.png",
    badge: data.badge || "/icon-72.png",
    data: {
      url: data.url || "/",
    },
    tag: data.tag || "default", // 👈 prevents duplicate spam
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(url) && "focus" in client) {
            return client.focus(); // 👈 reuse tab
          }
        }
        return clients.openWindow(url); // 👈 fallback
      }),
  );
});
