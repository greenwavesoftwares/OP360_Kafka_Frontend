import { Box, TextField } from "@mui/material";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardIcon from "@mui/icons-material/Keyboard";
function NumberBox({
  label,
  value,
  disabled,
  onNumberChange,
  onValueNumberChange,
  required,
  max,
  min,
  error,
  helperText,
  handleTextFieldClick,
  isHandwritingMode,
}) {
  return (
    <TextField
      fullWidth
      // label={label}
      type="number"
      value={value} // Use value for controlled component
      onChange={(e) => onValueNumberChange(e)} // Real-time value updates
      onBlur={(e) => onNumberChange(e)} // Additional logic on blur
      disabled={disabled}
      required={required}
      InputProps={{
        inputProps: {
          max: max,
          min: min,
        },
        readOnly: isHandwritingMode,

        style: {
          cursor: isHandwritingMode ? "pointer" : "text",
        },
      }}
      onClick={handleTextFieldClick}
      slotProps={{
        inputLabel: {
          shrink: true,
        },
      }}
      error={error && (value === null || value === undefined || value === "")}
      helperText={helperText} // Pass helperText to display error message
    />
  );
}

export default NumberBox;
