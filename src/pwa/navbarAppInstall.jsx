// Navbar.jsx (install button snippet)
// Drop this into your existing Navbar component.

import React from "react";
import { Tooltip, IconButton } from "@mui/material";
import InstallDesktopIcon from "@mui/icons-material/InstallDesktop";
import { initializePWAInstallPrompt, installPWA } from "../pwa/installPrompt";
import { isIOS, isInStandaloneMode } from "../pwa/iosInstall";

// --- Add these to your component's state ---
// const [canInstall, setCanInstall] = React.useState(false);
// const [showIOSBanner, setShowIOSBanner] = React.useState(false);

// --- Add this useEffect ---
// React.useEffect(() => {
//   // Show manual instructions for iOS Safari (no beforeinstallprompt support)
//   if (isIOS() && !isInStandaloneMode()) {
//     setShowIOSBanner(true);
//   }
//   // For Android/desktop Chrome
//   initializePWAInstallPrompt(setCanInstall);
// }, []);

// --- Replace your handleInstall ---
// const handleInstall = async () => {
//   if (isIOS()) {
//     setShowIOSBanner(true); // re-show banner if dismissed
//     return;
//   }
//   await installPWA();
// };

// --- iOS Banner (render near the top of your layout) ---
export const IOSInstallBanner = ({ onDismiss }) => (
  <div
    style={{
      background: "#1e3a4f",
      color: "#fff",
      padding: "10px 16px",
      textAlign: "center",
      fontSize: "0.85rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    }}
  >
    <span>
      To install: tap the <strong>Share</strong> button, then{" "}
      <strong>Add to Home Screen</strong>
    </span>
    <button
      onClick={onDismiss}
      style={{
        background: "transparent",
        border: "1px solid #fff",
        color: "#fff",
        borderRadius: 4,
        padding: "2px 8px",
        cursor: "pointer",
        fontSize: "0.8rem",
      }}
    >
      ✕
    </button>
  </div>
);

// --- Install button (render inside your AppBar/Toolbar) ---
// Only visible when installation is available (Android/desktop)
// or when on iOS and not yet installed
export const InstallButton = ({ canInstall, showIOSBanner, onClick }) => {
  if (!canInstall && !showIOSBanner) return null;

  return (
    <Tooltip title="Install App">
      <IconButton onClick={onClick} color="inherit" aria-label="install app">
        <InstallDesktopIcon
          sx={{
            color: "#fff",
            background: "#36444a",
            padding: "0.2rem",
            borderRadius: "50%",
            width: "1.3em",
            height: "1.3em",
          }}
        />
      </IconButton>
    </Tooltip>
  );
};
