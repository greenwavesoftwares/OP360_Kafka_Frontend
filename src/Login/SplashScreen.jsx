// SplashScreen.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import GreenwaveLogoPNG from "../Image/gw-logo.png";

function SplashScreen({ visible, error }) {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        transition: "opacity 0.6s ease",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "all" : "none",
      }}
    >
      <img
        src={GreenwaveLogoPNG}
        alt="Greenwave Logo"
        style={{ width: 120, marginBottom: 16 }}
      />
      <img
        src="/logo.png"
        alt="Operations360 Logo"
        style={{ width: 50, marginBottom: 12 }}
      />
      <Typography
        sx={{ fontSize: "1.5rem", color: "#499CF6", fontWeight: 600 }}
      >
        Operations360™
      </Typography>
      {error ? (
        <Typography
          sx={{
            mt: 1,
            color: "#d32f2f",
            fontSize: "0.85rem",
            textAlign: "center",
            px: 2,
          }}
        >
          {error}
        </Typography>
      ) : (
        <Typography sx={{ mt: 1, color: "#aaa", fontSize: "0.85rem" }}>
          Loading, please wait...
        </Typography>
      )}
    </Box>
  );
}

export default SplashScreen;
