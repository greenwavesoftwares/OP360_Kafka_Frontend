// iosInstall.js
// iOS Safari does NOT support the beforeinstallprompt event.
// Use these helpers to detect iOS and show a manual install banner instead.

/**
 * Returns true if the user is on an iOS device (iPhone, iPad, iPod).
 */
export const isIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;

/**
 * Returns true if the app is already running in standalone (installed) mode.
 * Works for both iOS (navigator.standalone) and Android/desktop (display-mode media query).
 */
export const isInStandaloneMode = () =>
  window.navigator.standalone === true ||
  window.matchMedia("(display-mode: standalone)").matches;
