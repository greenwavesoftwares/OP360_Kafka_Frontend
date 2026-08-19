// src/components/InputTextBox.jsx
import React, { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import QRScannerDialog from "../../../Logbook Configure/QRScannerDialog";

/**
 * Default behavior for `onTextChange` (Triggered on Blur)
 * @param {object} e - The event object.
 * @param {object} elem - The element object containing the input properties.
 */
const defaultOnTextChange = (e, elem) => {
  console.log(
    `onBlur: ${elem.aliasId} field lost focus. Current value: ${elem.value}`,
  );
};

/**
 * Default behavior for `onValueTextChange` (Triggered on Change)
 * @param {object} e - The event object.
 * @param {object} elem - The element object containing the input properties.
 */
const defaultOnValueTextChange = (e, elem) => {
  const updatedValue = e.target.value;
  console.log("Value updated:", updatedValue);
};

function InputTextBox({
  elem,
  onTextChange = defaultOnTextChange,
  onValueTextChange = defaultOnValueTextChange,
  error,
  helperText,
  handleTextFieldClick,
  isHandwritingMode,
  gridDataTest,
  setGridDataTest,
}) {
  // State for QR Scanner
  const [scannerOpen, setScannerOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // console.log("my elem in textbox: ", elem);

  // Handle QR scan icon click
  const handleQRScanClick = (e) => {
    e.stopPropagation(); // Prevent triggering handleTextFieldClick
    if (!elem?.disabled) {
      setScannerOpen(true);
    }
  };

  // Handle successful QR/Barcode scan
  const handleScanSuccess = (decodedText, decodedResult) => {
    const formatName =
      decodedResult?.result?.format?.formatName || "Unknown Format";

    // Create synthetic event to match your existing onChange pattern
    const syntheticEvent = {
      target: {
        value: decodedText,
        name: elem.aliasId || "",
      },
    };

    // Call onValueTextChange to update the value (same as typing)
    onValueTextChange(syntheticEvent, elem);

    // Optionally call onTextChange (same as blur) to trigger any validation/save
    onTextChange(syntheticEvent, elem);

    // Show success notification
    setSnackbar({
      open: true,
      message: `✅ Scanned successfully! (${formatName}): ${decodedText}`,
      severity: "success",
    });

    // Close scanner
    setScannerOpen(false);
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Determine if QR scan should be shown
  const showQRScanner = elem?.qrScan === true;

  return (
    <>
      {elem.requiredfield && <span style={{ color: "red" }}>*</span>}{" "}
      <TextField
        fullWidth
        onClick={handleTextFieldClick}
        value={elem.value || ""}
        onChange={(e) => onValueTextChange(e, elem)}
        onBlur={(e) => onTextChange(e, elem)}
        type="text"
        disabled={elem?.disabled}
        required={elem.requiredfield}
        multiline={elem.fieldType === "CommentBox" ? true : false}
        maxRows={elem.fieldType === "CommentBox" ? 10 : 1}
        error={
          error &&
          (elem.value === null || elem.value === undefined || elem.value === "")
        }
        helperText={helperText}
        InputProps={{
          readOnly: isHandwritingMode,
          endAdornment: (
            <InputAdornment position="end">
              {/* QR Scanner Icon - Only show if elem.qrScan is true */}
              {showQRScanner && (
                <Tooltip title="Scan QR Code / Barcode">
                  <span>
                    <IconButton
                      onClick={handleQRScanClick}
                      edge="end"
                      color="primary"
                      disabled={elem?.disabled}
                      size="small"
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        borderRadius: 1,
                        mr: isHandwritingMode ? 0.5 : 0,
                        padding: "6px",
                        "&:hover": {
                          bgcolor: "primary.dark",
                        },
                        "&.Mui-disabled": {
                          bgcolor: "grey.300",
                          color: "grey.500",
                        },
                      }}
                    >
                      <QrCodeScannerIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              )}

              {/* Handwriting/Keyboard Icon - Show based on isHandwritingMode */}
              {/* {isHandwritingMode !== undefined && (
                <Box
                  className="input-icon-wrapper"
                  sx={{ ml: showQRScanner ? 0.5 : 0 }}
                >
                  {isHandwritingMode ? (
                    <EditIcon className="input-icon handwriting-icon" />
                  ) : (
                    <KeyboardIcon className="input-icon keyboard-icon" />
                  )}
                </Box>
              )} */}
            </InputAdornment>
          ),
          style: {
            cursor: isHandwritingMode ? "pointer" : "text",
          },
        }}
      />
      {/* QR Scanner Dialog */}
      {showQRScanner && (
        <QRScannerDialog
          open={scannerOpen}
          onClose={() => setScannerOpen(false)}
          onScanSuccess={handleScanSuccess}
          title={`Scan for ${elem.aliasId || "Field"}`}
        />
      )}
      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default InputTextBox;
