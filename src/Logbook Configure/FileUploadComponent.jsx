import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Typography, Box, IconButton, Input } from "@mui/material";
import { CloudUpload, Download, Delete } from "@mui/icons-material";

const FileUploadComponent = ({
  elem,
  byteArray,
  onFileUpload,
  fileNamePath,
  error,
}) => {
  const [file, setFile] = useState(null);
  const [showUpload, setShowUpload] = useState(true);
  useEffect(() => {
    console.log("File download byteArray : ", byteArray);
    if (byteArray) {
      // ... your existing code for setting file
      let uint8Array;

      if (typeof byteArray === "string") {
        const binaryString = atob(byteArray);
        uint8Array = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          uint8Array[i] = binaryString.charCodeAt(i);
        }
      } else if (Array.isArray(byteArray)) {
        uint8Array = new Uint8Array(byteArray);
      } else {
        console.error("Invalid file content format.");
        return;
      }

      let mimeType = "application/octet-stream";
      let fileExtension = "bin";

      if (uint8Array[0] === 0x25 && uint8Array[1] === 0x50) {
        mimeType = "application/pdf";
        fileExtension = "pdf";
      } else if (uint8Array[0] === 0xff && uint8Array[1] === 0xd8) {
        mimeType = "image/jpeg";
        fileExtension = "jpg";
      } else if (uint8Array[0] === 0x89 && uint8Array[1] === 0x50) {
        mimeType = "image/png";
        fileExtension = "png";
      }

      const blob = new Blob([uint8Array], { type: mimeType });
      const fileName = fileNamePath || `downloaded-file.${fileExtension}`;
      const fileFromProps = new File([blob], fileName, { type: mimeType });

      setFile(fileFromProps);
      setShowUpload(false);
    } else {
      // If byteArray is null, clear the file and show upload
      setFile(null);
      setShowUpload(true);
    }
  }, [byteArray, fileNamePath]);
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setShowUpload(false);

      const reader = new FileReader();
      reader.onload = (e) => {
        const byteArray = Array.from(new Uint8Array(e.target.result));
        if (onFileUpload) {
          onFileUpload(byteArray, selectedFile);
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleDownload = () => {
    if (file) {
      const blob = new Blob([file], { type: file.type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setShowUpload(true);
    if (onFileUpload) {
      onFileUpload(null, "");
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={2}>
      {showUpload && (
        <>
          {" "}
          {elem?.requiredfield && (
            <Typography component="span" color="error" sx={{ ml: 0.5 }}>
              *
            </Typography>
          )}{" "}
          <Button
            sx={{
              border:
                error &&
                (elem.value === null ||
                  elem.value === undefined ||
                  elem.value === "")
                  ? "2px solid red"
                  : "none",
            }} // Red outline when error
            component="label"
            variant="contained"
            color="primary"
            startIcon={<CloudUpload />}
          >
            {/* {elem?.requiredfield && (
            <Typography component="span" color="error" sx={{ ml: 0.5 }}>
              *
            </Typography>
          )} */}
            Upload File
            <Input
              type="file"
              onChange={handleFileChange}
              sx={{ display: "none" }}
            />
          </Button>
        </>
      )}

      {file && !showUpload && (
        <Box textAlign="center" mt={2}>
          <Typography variant="body1" fontWeight="bold">
            {file.name}
          </Typography>
          <Box display="flex" justifyContent="center" mt={1}>
            <Button
              onClick={handleDownload}
              variant="contained"
              color="success"
              startIcon={<Download />}
              sx={{ mx: 1 }}
            >
              Download
            </Button>
            <IconButton onClick={handleRemoveFile} color="error">
              <Delete />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

FileUploadComponent.propTypes = {
  byteArray: PropTypes.arrayOf(PropTypes.number),
  onFileUpload: PropTypes.func,
  fileNamePath: PropTypes.string,
};

FileUploadComponent.defaultProps = {
  byteArray: null,
  onFileUpload: null,
  fileNamePath: "",
};

export default FileUploadComponent;
