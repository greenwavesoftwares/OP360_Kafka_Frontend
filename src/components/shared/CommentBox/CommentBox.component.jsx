import { TextField } from "@mui/material";
import React from "react";

function CommentBox({
  elem,
  label,
  value,
  onCommentChange,
  required,
  error,
  helperText,
}) {
  return (
    <>
      <TextField
        fullWidth
        // label={label}
        multiline
        rows={4} // Adjust the number of rows as needed
        defaultValue={value ? value : ""}
        // value={elem.value ? elem.value : ""}
        onChange={onCommentChange}
        // onBlur={() => onCellValueChange(col)}
        required={required}
        // disabled={elem.disabled}
        error={error && (value === null || value === undefined || value === "")}
        helperText={helperText} // Pass helperText to display error message
      />
    </>
  );
}

export default CommentBox;
