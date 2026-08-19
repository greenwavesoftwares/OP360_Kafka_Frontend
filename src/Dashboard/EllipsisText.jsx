import React from "react";

const EllipsisText = ({ text, maxWidth }) => {
  const ellipsisStyle = {
    width: maxWidth, // Set the desired width
    whiteSpace: "nowrap", // Prevent text from wrapping
    overflow: "hidden", // Hide the overflowing text
    textOverflow: "ellipsis", // Add the ellipsis
    // border: "1px solid #ccc", // Optional: Add a border to see the container
    padding: "5px", // Optional: Add some padding
  };

  return <div style={ellipsisStyle}>{text}</div>;
};

export default EllipsisText;
