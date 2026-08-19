// installPrompt.js
// Unified PWA install prompt handler.
// Stores the deferred prompt on window.__deferredInstallPrompt (set in index.js).
// initializePWAInstallPrompt() reuses it if already captured, or listens for it.

export const initializePWAInstallPrompt = (setCanInstall) => {
  // Already captured by the index.js listener — use it immediately
  if (window.__deferredInstallPrompt) {
    setCanInstall(true);
    return;
  }

  // Listen for it if it hasn't fired yet
  const handler = (e) => {
    e.preventDefault();
    window.__deferredInstallPrompt = e;
    setCanInstall(true);
  };

  window.addEventListener("beforeinstallprompt", handler);

  // Track app installation to hide the button afterward
  window.addEventListener("appinstalled", () => {
    window.__deferredInstallPrompt = null;
    setCanInstall(false);
    console.log("PWA installed successfully");
  });
};

export const installPWA = async () => {
  const deferredPrompt = window.__deferredInstallPrompt;

  if (!deferredPrompt) {
    console.warn("No deferred install prompt available");
    return false;
  }

  deferredPrompt.prompt();
  const result = await deferredPrompt.userChoice;

  console.log("Install result:", result.outcome);
  window.__deferredInstallPrompt = null;

  return result.outcome === "accepted";
};
