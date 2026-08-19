import React, { useState, useEffect, useRef } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";

const MessageComponent = () => {
  const [message, setMessage] = useState("");
  const [displayedMessage, setDisplayedMessage] = useState("");
  const [ws, setWs] = useState(null);

  // Create a ref to store the WebSocket connection
  const wsRef = useRef(null);

  // Open WebSocket connection when the component mounts
  useEffect(() => {
    const socket = new WebSocket("wss://echo.websocket.org");

    socket.onopen = () => {
      console.log("WebSocket connected!");
    };

    socket.onmessage = (event) => {
      setDisplayedMessage(event.data); // Set the displayed message as the response from the WebSocket server
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    wsRef.current = socket;

    // Cleanup WebSocket connection when the component unmounts
    return () => {
      socket.close();
    };
  }, []);

  const handleSend = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(message); // Send the message to the WebSocket server
    }
    setMessage(""); // Clear the text field after sending
  };

  return (
    <Box sx={{ p: 2, maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
      <TextField
        label="Enter your message"
        variant="outlined"
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSend}
        disabled={!message.trim()}
      >
        Send
      </Button>
      {displayedMessage && (
        <Typography variant="h6" sx={{ mt: 3 }}>
          Response: {displayedMessage}
        </Typography>
      )}
    </Box>
  );
};

export default MessageComponent;
