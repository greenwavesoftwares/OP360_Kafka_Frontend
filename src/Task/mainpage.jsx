// MainPage.js
import React, { useState } from "react";

import { TextField, Button, Box } from "@mui/material";
import DeleteEdgeDropTest from "./flowTest";

const MainPageTest = () => {
  const [nodeName, setNodeName] = useState("");
  const [nodeId, setNodeId] = useState("");

  const handleAddNode = (name, id) => {
    // Handle node addition if needed
    console.log(`Added node: ${name} with ID: ${id}`);
    setNodeName(""); // Clear input fields after adding node
    setNodeId("");
  };

  const handleNodeNameChange = (event) => {
    setNodeName(event.target.value);
  };

  const handleNodeIdChange = (event) => {
    setNodeId(event.target.value);
  };

  const handleAddClick = () => {
    // Handle button click if needed
    console.log("Add button clicked");
    // You can optionally call handleAddNode here to handle node addition directly
  };

  return (
    <div>
      <h1>Main Page</h1>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <TextField
          label="Enter node ID"
          value={nodeId}
          onChange={handleNodeIdChange}
          variant="outlined"
        />
        <TextField
          label="Enter node name"
          value={nodeName}
          onChange={handleNodeNameChange}
          variant="outlined"
        />
        <Button variant="contained" color="primary" onClick={handleAddClick}>
          Add
        </Button>
      </Box>
      <DeleteEdgeDropTest
        nodeName={nodeName}
        nodeId={nodeId}
        onAddNode={handleAddNode}
      />
    </div>
  );
};

export default MainPageTest;
