import React, { useState } from "react";
import { Button, Snackbar, Typography } from "@mui/material";

const ButtonHover = () => {
  // State to manage the position of the "No" button
  const [noButtonPosition, setNoButtonPosition] = useState({
    top: "50%",
    left: "50%",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Function to generate random position
  const getRandomPosition = () => {
    const x = Math.random() * 100; // Random percentage for left
    const y = Math.random() * 100; // Random percentage for top
    return { top: `${y}%`, left: `${x}%` };
  };

  // Function to handle mouse enter event for the "No" button
  const handleNoMouseEnter = () => {
    let newPosition = getRandomPosition();

    // Ensure the new position is not the same as the current one
    while (
      newPosition.top === noButtonPosition.top &&
      newPosition.left === noButtonPosition.left
    ) {
      newPosition = getRandomPosition();
    }

    setNoButtonPosition(newPosition); // Set a random position on hover
  };

  // Function to handle "Yes" button click
  const handleYesClick = () => {
    setSnackbarOpen(true); // Show snackbar
  };

  // Function to close the snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <center>
        <h1> Will you go for lunch ?</h1>
      </center>
      <div
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          style={{
            position: "absolute",
            top: "55%", // Fixed position for the "Yes" button
            left: "55%",
            transform: "translate(-50%, -50%)", // Centering the "Yes" button
          }}
          onClick={handleYesClick}
        >
          Yes
        </Button>
        <br></br>
        <br></br> <br></br>
        <Button
          variant="contained"
          color="secondary"
          style={{
            position: "absolute",
            top: noButtonPosition.top,
            left: noButtonPosition.left,
            transform: "translate(-50%, -50%)", // Centering the "No" button
          }}
          onMouseEnter={handleNoMouseEnter} // Change position on hover
        >
          No
        </Button>
        <Snackbar
          typeof="success"
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          message="Lets Goo... I am Too Hungry !"
        />
      </div>
    </>
  );
};

export default ButtonHover;
