import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import * as XLSX from "xlsx";
const FileDownloadComponent = ({ byteArray, fileNamePath }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fileType, setFileType] = useState("");

  useEffect(() => {
    if (byteArray && byteArray !== "Query returned no results") {
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
        setFile(null);
        return;
      }

      let mimeType = "application/octet-stream";
      let fileExtension = "bin";

      // Detect file type by magic numbers
      if (uint8Array[0] === 0x25 && uint8Array[1] === 0x50) {
        mimeType = "application/pdf";
        fileExtension = "pdf";
      } else if (
        uint8Array[0] === 0xd0 &&
        uint8Array[1] === 0xcf &&
        uint8Array[2] === 0x11 &&
        uint8Array[3] === 0xe0
      ) {
        mimeType = "application/msword";
        fileExtension = "doc";
      } else if (uint8Array[0] === 0xff && uint8Array[1] === 0xd8) {
        mimeType = "image/jpeg";
        fileExtension = "jpg";
      } else if (uint8Array[0] === 0x89 && uint8Array[1] === 0x50) {
        mimeType = "image/png";
        fileExtension = "png";
      } else if (uint8Array[0] === 0x47 && uint8Array[1] === 0x49) {
        mimeType = "image/gif";
        fileExtension = "gif";
      } else if (uint8Array[0] === 0x50 && uint8Array[1] === 0x4b) {
        const textDecoder = new TextDecoder();
        const zipContent = textDecoder.decode(uint8Array);

        if (zipContent.includes("word/")) {
          mimeType =
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
          fileExtension = "docx";
        } else if (zipContent.includes("xl/")) {
          mimeType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
          fileExtension = "xlsx";
        } else if (zipContent.includes("ppt/")) {
          mimeType =
            "application/vnd.openxmlformats-officedocument.presentationml.presentation";
          fileExtension = "pptx";
        } else {
          mimeType = "application/zip";
          fileExtension = "zip";
        }
      } else if (
        uint8Array[0] === 0x7b || // {
        uint8Array[0] === 0x5b // [
      ) {
        mimeType = "application/json";
        fileExtension = "json";
      } else if (
        uint8Array[0] === 0x74 || // t
        uint8Array[0] === 0x54 // T
      ) {
        mimeType = "text/plain";
        fileExtension = "txt";
      }

      const blob = new Blob([uint8Array], { type: mimeType });
      const fileName =
        fileNamePath === undefined || fileNamePath === null
          ? file?.name
          : fileNamePath;
      const fileFromProps = new File([blob], fileName, { type: mimeType });

      setFile(fileFromProps);
      setFileType(mimeType);
    }
  }, [byteArray, fileNamePath]);

  const handleDownload = () => {
    if (file) {
      const blob = new Blob([file], { type: file.type });
      let fileName = file.name;

      if (!fileName.includes(".")) {
        if (file.type === "application/pdf") fileName += ".pdf";
        else if (file.type === "application/msword") fileName += ".doc";
        else if (
          file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
          fileName += ".docx";
        else if (file.type === "application/vnd.ms-excel") fileName += ".xls";
        else if (
          file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
          fileName += ".xlsx";
        else if (file.type === "image/jpeg") fileName += ".jpg";
        else if (file.type === "image/png") fileName += ".png";
        else if (file.type === "image/gif") fileName += ".gif";
        else if (file.type === "application/zip") fileName += ".zip";
        else if (file.type === "application/json") fileName += ".json";
        else if (file.type === "text/plain") fileName += ".txt";
        else fileName += ".bin";
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleView = () => {
    if (!file) return;

    // Excel preview: read as ArrayBuffer, parse, convert to HTML, open in new tab
    if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel"
    ) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const html = XLSX.utils.sheet_to_html(worksheet);

        // Open in new tab
        const newTab = window.open();
        newTab.document.write(`
        <html>
          <head>
            <title>Excel Preview</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ccc; padding: 8px; }
              th { background: #f5f5f5; }
            </style>
          </head>
          <body>
            <h2>Excel Preview: ${file.name}</h2>
            ${html}
          </body>
        </html>
      `);
        newTab.document.close();
      };
      reader.readAsArrayBuffer(file);
      return; // <--- IMPORTANT: Prevents further code from running!
    }

    // For images, pdf, text, json: show modal preview
    const blob = new Blob([file], { type: file.type });
    const url = URL.createObjectURL(blob);

    if (
      file.type.startsWith("image/") ||
      file.type === "application/pdf" ||
      file.type === "text/plain" ||
      file.type === "application/json"
    ) {
      setPreviewUrl(url);
      setShowModal(true);
    } else {
      // For other types, open in new tab (browser will handle or download)
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 1000 * 60); // cleanup after 1 min
    }
  };
  const closeModal = () => {
    setShowModal(false);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px",
      maxWidth: "300px",
      margin: "0 auto",
    },
    fileInfoContainer: {
      textAlign: "center",
    },
    fileName: {
      fontWeight: "bold",
    },
    button: {
      backgroundColor: "#28a745",
      color: "white",
      padding: "8px 16px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "14px",
      margin: "0 5px",
    },
    buttonHover: {
      backgroundColor: "#218838",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modalContent: {
      background: "#fff",
      padding: "20px",
      borderRadius: "8px",
      maxWidth: "90vw",
      maxHeight: "90vh",
      overflow: "auto",
      position: "relative",
    },
    closeBtn: {
      position: "absolute",
      top: 10,
      right: 10,
      background: "#dc3545",
      color: "#fff",
      border: "none",
      borderRadius: "50%",
      width: "30px",
      height: "30px",
      cursor: "pointer",
      fontSize: "18px",
    },
    preview: {
      maxWidth: "80vw",
      maxHeight: "70vh",
      display: "block",
      margin: "0 auto",
    },
    textPreview: {
      maxWidth: "80vw",
      maxHeight: "70vh",
      overflow: "auto",
      background: "#f8f9fa",
      padding: "10px",
      borderRadius: "4px",
      fontFamily: "monospace",
      fontSize: "14px",
      whiteSpace: "pre-wrap",
    },
  };

  // Helper to read text from blob
  const [textContent, setTextContent] = useState("");
  useEffect(() => {
    if (
      showModal &&
      previewUrl &&
      (fileType === "text/plain" || fileType === "application/json")
    ) {
      fetch(previewUrl)
        .then((res) => res.text())
        .then((txt) => setTextContent(txt));
    } else {
      setTextContent("");
    }
  }, [showModal, previewUrl, fileType]);

  return (
    <div style={styles.container}>
      {file ? (
        <div style={styles.fileInfoContainer}>
          <p>
            <span style={styles.fileName}>{file.name}</span>
          </p>
          <button
            onClick={handleDownload}
            style={styles.button}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor =
                styles.buttonHover.backgroundColor)
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = styles.button.backgroundColor)
            }
          >
            <i className="pi pi-download" style={{ marginRight: "8px" }}></i>
            Download
          </button>
          <button
            onClick={handleView}
            style={{ ...styles.button, backgroundColor: "#007bff" }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
          >
            <i className="pi pi-eye" style={{ marginRight: "8px" }}></i>
            View
          </button>
        </div>
      ) : (
        <p></p>
      )}

      {/* Modal for preview */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={closeModal}>
              &times;
            </button>
            {fileType.startsWith("image/") && (
              <img src={previewUrl} alt="Preview" style={styles.preview} />
            )}
            {fileType === "application/pdf" && (
              <iframe
                src={previewUrl}
                title="PDF Preview"
                style={styles.preview}
                width="600"
                height="500"
              />
            )}
            {(fileType === "text/plain" || fileType === "application/json") && (
              <pre style={styles.textPreview}>{textContent}</pre>
            )}
            {/* You can add more preview types here */}
          </div>
        </div>
      )}
    </div>
  );
};

FileDownloadComponent.propTypes = {
  byteArray: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.string,
  ]),
  fileNamePath: PropTypes.string,
};

FileDownloadComponent.defaultProps = {
  byteArray: null,
};

export default FileDownloadComponent;
