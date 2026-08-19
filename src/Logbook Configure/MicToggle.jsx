import React, { useState } from "react";

const MicToggle = () => {
  const [isMicOn, setIsMicOn] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);

  const handleToggle = async () => {
    if (!isMicOn) {
      try {
        // Request access to the microphone
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicEnabled(true);
      } catch (error) {
        console.error("Microphone access denied or error occurred:", error);
        setMicEnabled(false);
        return;
      }
    } else {
      // Stop microphone (this is a placeholder, you can manage media streams further if needed)
      setMicEnabled(false);
    }
    setIsMicOn(!isMicOn);
  };

  const handleStart = async () => {
    try {
      const response = await fetch("http://192.168.68.68:8000/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("Start response:", data);
    } catch (error) {
      console.error("Error starting:", error);
    }
  };

  const handleStop = async () => {
    try {
      const response = await fetch("http://192.168.68.68:8000/stop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("Stop response:", data);
    } catch (error) {
      console.error("Error stopping:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <button
        onClick={handleToggle}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        {isMicOn ? "Off" : "On"}
      </button>
      {micEnabled && (
        <p style={{ marginTop: "10px", color: "green" }}>Mic is enabled</p>
      )}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handleStart}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            marginRight: "10px",
          }}
        >
          Start
        </button>
        <button
          onClick={handleStop}
          style={{ padding: "10px 20px", fontSize: "16px" }}
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default MicToggle;
