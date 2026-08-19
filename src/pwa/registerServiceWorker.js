export const registerServiceWorker = async () => {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service workers not supported");
  }

  const registration = await navigator.serviceWorker.register("/sw.js");

  // If SW is already active, return immediately
  if (
    registration.active &&
    !registration.installing &&
    !registration.waiting
  ) {
    console.log("Service Worker already active:", registration);
    return registration;
  }

  // Wait for the installing SW to become activated
  // This prevents pushManager.subscribe() from being called too early
  await waitForServiceWorkerActivation(registration);

  console.log("Service Worker registered and activated:", registration);
  return registration;
};

const waitForServiceWorkerActivation = (registration) => {
  return new Promise((resolve, reject) => {
    // Timeout to prevent infinite wait
    const timeout = setTimeout(() => {
      reject(new Error("Service Worker activation timed out"));
    }, 10000);

    const sw =
      registration.installing || registration.waiting || registration.active;

    if (!sw) {
      clearTimeout(timeout);
      // check explicitly before resolving
      if (registration.active) {
        resolve(registration);
      } else {
        reject(new Error("No service worker found to activate"));
      }
      return;
    }

    // SW is already activated
    if (sw.state === "activated") {
      clearTimeout(timeout);
      resolve(registration);
      return;
    }

    // Listen for state changes until activated
    sw.addEventListener("statechange", function onStateChange(event) {
      if (event.target.state === "activated") {
        clearTimeout(timeout);
        sw.removeEventListener("statechange", onStateChange);
        resolve(registration);
      } else if (event.target.state === "redundant") {
        clearTimeout(timeout);
        sw.removeEventListener("statechange", onStateChange);
        reject(new Error("Service Worker became redundant"));
      }
    });
  });
};
