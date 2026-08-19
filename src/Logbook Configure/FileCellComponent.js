import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import PostalMime from "postal-mime";
import MsgReader from "msgreader";
import { Dialog } from "primereact/dialog";
import {
  Button,
  IconButton,
  Typography,
  Box,
  Input,
  Tabs,
  Tab,
  Divider,
  Chip,
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  CloudUpload,
  Download,
  Delete,
  Visibility,
  Email,
  Person,
  Subject,
  CalendarToday,
  AttachFile,
  Close,
} from "@mui/icons-material";
import { downloadFileFromMinIO } from "../JobPerformer/JobPerformerAPI";
// import { deleteFileFromMinIO, getFileFromMinIO, uploadFileToMinIO } from "../Logbook/LogbookApi";
import { getTenantID } from "../UserModuleUpdated/UsermoduleApi";
import SnackbarComponent from "../components/shared/snackbar/customSnackbar";

const getFileFromByteArray = async (byteArray, fileNamePath) => {
  let uint8Array;

  try {
    if (typeof byteArray === "string") {
      // Check if it's a valid base64 string
      // Remove any whitespace and check if it looks like base64
      const cleanedString = byteArray.replace(/\s/g, "");

      // Check if string is empty
      if (!cleanedString) {
        return { file: null, mimeType: "", fileExtension: "" };
      }

      // Try to detect if it's base64 encoded
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      const isBase64 =
        base64Regex.test(cleanedString) && cleanedString.length % 4 === 0;

      if (isBase64) {
        try {
          // Handle URL-safe base64 (replace - with + and _ with /)
          const standardBase64 = cleanedString
            .replace(/-/g, "+")
            .replace(/_/g, "/");

          const binaryString = atob(standardBase64);
          uint8Array = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            uint8Array[i] = binaryString.charCodeAt(i);
          }
        } catch (e) {
          console.error("Base64 decode error:", e);
          // If base64 decode fails, try treating it as raw string
          const encoder = new TextEncoder();
          uint8Array = encoder.encode(byteArray);
        }
      } else {
        // Not base64, treat as raw string or try other formats
        // Check if it's a comma-separated byte string like "72,101,108,108,111"
        if (byteArray.includes(",")) {
          const byteValues = byteArray
            .split(",")
            .map((b) => parseInt(b.trim(), 10));
          if (byteValues.every((b) => !isNaN(b) && b >= 0 && b <= 255)) {
            uint8Array = new Uint8Array(byteValues);
          } else {
            return { file: null, mimeType: "", fileExtension: "" };
          }
        } else {
          // Unknown string format
          console.warn("Unknown string format for byteArray");
          return { file: null, mimeType: "", fileExtension: "" };
        }
      }
    } else if (Array.isArray(byteArray)) {
      // Handle array of numbers
      uint8Array = new Uint8Array(byteArray);
    } else if (byteArray instanceof Uint8Array) {
      // Already Uint8Array
      uint8Array = byteArray;
    } else if (byteArray instanceof ArrayBuffer) {
      // ArrayBuffer
      uint8Array = new Uint8Array(byteArray);
    } else {
      console.warn("Unsupported byteArray type:", typeof byteArray);
      return { file: null, mimeType: "", fileExtension: "" };
    }

    // Validate uint8Array
    if (!uint8Array || uint8Array.length === 0) {
      return { file: null, mimeType: "", fileExtension: "" };
    }

    let mimeType = "application/octet-stream";
    let fileExtension = "bin";

    // PDF
    if (uint8Array[0] === 0x25 && uint8Array[1] === 0x50) {
      mimeType = "application/pdf";
      fileExtension = "pdf";
    }
    // DOC (OLE Compound Document)
    else if (
      uint8Array[0] === 0xd0 &&
      uint8Array[1] === 0xcf &&
      uint8Array[2] === 0x11 &&
      uint8Array[3] === 0xe0
    ) {
      const headerString = new TextDecoder("utf-8", { fatal: false }).decode(
        uint8Array.slice(0, 2000)
      );
      if (
        headerString.includes("IPM.Note") ||
        headerString.includes("Microsoft Outlook") ||
        fileNamePath?.toLowerCase().endsWith(".msg")
      ) {
        mimeType = "application/vnd.ms-outlook";
        fileExtension = "msg";
      } else {
        mimeType = "application/msword";
        fileExtension = "doc";
      }
    }
    // JPEG
    else if (uint8Array[0] === 0xff && uint8Array[1] === 0xd8) {
      mimeType = "image/jpeg";
      fileExtension = "jpg";
    }
    // PNG
    else if (uint8Array[0] === 0x89 && uint8Array[1] === 0x50) {
      mimeType = "image/png";
      fileExtension = "png";
    }
    // GIF
    else if (uint8Array[0] === 0x47 && uint8Array[1] === 0x49) {
      mimeType = "image/gif";
      fileExtension = "gif";
    }
    // ZIP or Office OpenXML
    else if (uint8Array[0] === 0x50 && uint8Array[1] === 0x4b) {
      try {
        const zip = await JSZip.loadAsync(uint8Array);
        const files = Object.keys(zip.files);

        if (files.some((f) => f.startsWith("word/"))) {
          mimeType =
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
          fileExtension = "docx";
        } else if (files.some((f) => f.startsWith("xl/"))) {
          mimeType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
          fileExtension = "xlsx";
        } else if (files.some((f) => f.startsWith("ppt/"))) {
          mimeType =
            "application/vnd.openxmlformats-officedocument.presentationml.presentation";
          fileExtension = "pptx";
        } else {
          mimeType = "application/zip";
          fileExtension = "zip";
        }
      } catch (e) {
        mimeType = "application/zip";
        fileExtension = "zip";
      }
    }
    // EML detection
    else if (
      uint8Array[0] === 0x46 &&
      uint8Array[1] === 0x72 &&
      uint8Array[2] === 0x6f &&
      uint8Array[3] === 0x6d
    ) {
      mimeType = "message/rfc822";
      fileExtension = "eml";
    } else if (
      uint8Array[0] === 0x52 &&
      uint8Array[1] === 0x65 &&
      uint8Array[2] === 0x63 &&
      uint8Array[3] === 0x65
    ) {
      mimeType = "message/rfc822";
      fileExtension = "eml";
    } else if (
      uint8Array[0] === 0x4d &&
      uint8Array[1] === 0x49 &&
      uint8Array[2] === 0x4d &&
      uint8Array[3] === 0x45
    ) {
      mimeType = "message/rfc822";
      fileExtension = "eml";
    }
    // JSON
    else if (uint8Array[0] === 0x7b || uint8Array[0] === 0x5b) {
      mimeType = "application/json";
      fileExtension = "json";
    }
    // Text
    else if (uint8Array[0] === 0x74 || uint8Array[0] === 0x54) {
      mimeType = "text/plain";
      fileExtension = "txt";
    }

    // Check file extension from path as fallback
    if (fileNamePath) {
      const lowerPath = fileNamePath.toLowerCase();
      if (lowerPath.endsWith(".eml")) {
        mimeType = "message/rfc822";
        fileExtension = "eml";
      } else if (lowerPath.endsWith(".msg")) {
        mimeType = "application/vnd.ms-outlook";
        fileExtension = "msg";
      } else if (lowerPath.endsWith(".pdf")) {
        mimeType = "application/pdf";
        fileExtension = "pdf";
      } else if (lowerPath.endsWith(".docx")) {
        mimeType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        fileExtension = "docx";
      } else if (lowerPath.endsWith(".xlsx")) {
        mimeType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        fileExtension = "xlsx";
      } else if (lowerPath.endsWith(".jpg") || lowerPath.endsWith(".jpeg")) {
        mimeType = "image/jpeg";
        fileExtension = "jpg";
      } else if (lowerPath.endsWith(".png")) {
        mimeType = "image/png";
        fileExtension = "png";
      }
    }

    let rawName = fileNamePath?.split("/").pop() || "Attachment";
    rawName = rawName.replace(/\.[^/.]+$/, "");

    const fileName = `${rawName}.${fileExtension}`;

    const blob = new Blob([uint8Array], { type: mimeType });
    const file = new File([blob], fileName, { type: mimeType });

    return { file, mimeType, fileExtension };
  } catch (error) {
    console.error("Error in getFileFromByteArray:", error);
    return { file: null, mimeType: "", fileExtension: "" };
  }
};

const FileCellComponent = ({
  elem,
  byteArray,
  onFileUpload,
  onValueChange,
  fileNamePath,
  error,
  editable,
  apiBaseUrl = "http://localhost:8094",
}) => {
  console.log("Elem in Filecell component : ", elem);
    const [snackbarText, setSnackbarText] = useState("Unsupported File !"); // Text for the snackbar notification
    const [snackbarSeverity, setsnackbarSeverity] = useState("Error"); // Severity level for the snackbar (success, error, etc.)
    const [snackbarOpen, setSnackbarOpen] = useState(false); // Boolean to control snackbar visibility
  
  const [file, setFile] = useState(null);
  const [cellValue, setCellValue] = useState(elem?.value || null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fileType, setFileType] = useState("");
  const [textContent, setTextContent] = useState("");
  const [isExcelPreview, setIsExcelPreview] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);
  const [excelError, setExcelError] = useState("");
const cameraInputRef = useRef(null);
const [cameraOpen, setCameraOpen] = useState(false);
const videoRef = useRef(null);
const canvasRef = useRef(null);
let mediaStreamRef = useRef(null);
const [isDesktop, setIsDesktop] = useState(true);

  // Track if file is from local upload (not from API)
  const [isLocalFile, setIsLocalFile] = useState(false);

  // Excel sheets state
  const [excelSheets, setExcelSheets] = useState([]);
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);

  // Email preview state
  const [isEmailPreview, setIsEmailPreview] = useState(false);
  const [emailData, setEmailData] = useState(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [activeEmailTab, setActiveEmailTab] = useState(0);
  // ─── Snackbar state ───
  // const [snackbarText, setSnackbarText] = useState("Unsupported File !");
  // const [snackbarSeverity, setsnackbarSeverity] = useState("Error");
  // const [snackbarOpen, setSnackbarOpen] = useState(false);
  // API fetch state
  const [isLoading, setIsLoading] = useState(false);
const [isUploading, setIsUploading] = useState(false);
  const excelPreviewRef = useRef(null);

  // Sync cellValue with elem.value when it changes
  useEffect(() => {
    setCellValue(elem?.value || null);
  }, [elem?.value]);

  // Determine the display label from cellValue
  // const getDisplayLabel = () => {
  //   if (!cellValue) return "";
  //   const value = String(cellValue);
  //   const underscoreIndex = value.indexOf("_");
  //   return underscoreIndex !== -1
  //     ? value.substring(underscoreIndex + 1)
  //     : value;
  // };

  const isValidFileReference = () => {
  if (!cellValue) return false;
  
  const label = getDisplayLabel();
  return label !== "No file" && label !== "";
};
const getDisplayLabel = () => {
  if (!cellValue) return "";

  const value = String(cellValue);
  
  // UUID regex (with or without extension)
  const uuidRegex = /^[0-9a-f]{4,8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{8,12}/i;
  
  const lastDotIndex = value.lastIndexOf(".");
  
  // Case 1: Has extension
  if (lastDotIndex !== -1) {
    const extension = value.substring(lastDotIndex + 1);
    
    // Validate extension (should be 2-5 chars, alphanumeric)
    const validExtRegex = /^[a-z0-9]{2,5}$/i;
    if (!validExtRegex.test(extension)) {
      return "No file";
    }
    
    // If it's a UUID → show as attachment.ext
    if (uuidRegex.test(value)) {
      return `attachment.${extension}`;
    }
    
    return value;
  }
  
  // Case 2: No extension at all
  // If it looks like a UUID/MinIO key → show as "attachment"
  if (uuidRegex.test(value)) {
    return "attachment";
  }
  
  // Otherwise → no file
  return "No file";
};

  // Check if cellValue has a value
  const hasValue =
    cellValue !== null && cellValue !== undefined && cellValue !== "";

  // Determine if we should show upload (no file AND no value AND editable)
  const showUpload = !file && !hasValue && editable;

  // Initialize file from byteArray
  // useEffect(() => {
  //   if (byteArray && (Array.isArray(byteArray) ? byteArray.length > 0 : true)) {
  //     (async () => {
  //       try {
  //         const { file: parsedFile, mimeType } = await getFileFromByteArray(
  //           byteArray,
  //           fileNamePath
  //         );
  //         if (parsedFile) {
  //           setFile(parsedFile);
  //           setFileType(mimeType);
  //           setIsLocalFile(true);
  //         }
  //       } catch (error) {
  //         console.error("Error parsing byteArray:", error);
  //       }
  //     })();
  //   }
  // }, [byteArray, fileNamePath]);
  // Sync file state with byteArray and value
useEffect(() => {
  setIsDesktop(isDesktopDevice());
}, []);
useEffect(() => {
  if (file) return;
  if (!cellValue) return;
  if (elem?.fileContent && elem.fileContent.trim() !== "") return;

  // Requirement: if no extension, don't fetch
  if (getDisplayLabel() === "No file") return;

  if (!isImageFile(cellValue)) return;

  fetchFile(cellValue);
}, [cellValue, elem?.fileContent]); // ✅ add elem?.fileContent to deps
// Sync file state with byteArray and value
useEffect(() => {
  // ✅ If fileContent is present, it takes priority → skip byteArray processing
  if (elem?.fileContent && elem.fileContent.trim() !== "") return;

  // Case 1: Nothing exists → reset everything
  if (!byteArray && !elem?.value) {
    setFile(null);
    setFileType("");
    setIsLocalFile(false);
    return;
  }

  const isRealByteArray =
    byteArray &&
    (
      byteArray instanceof Uint8Array ||
      byteArray instanceof ArrayBuffer ||
      Array.isArray(byteArray)
    );

  const isMinioKeyString =
    typeof byteArray === "string" &&
    byteArray === elem?.value;

  if (isRealByteArray) {
    (async () => {
      try {
        const { file: parsedFile, mimeType } =
          await getFileFromByteArray(byteArray, fileNamePath);

        if (parsedFile) {
          setFile(parsedFile);
          setFileType(mimeType);
          setIsLocalFile(true);
        }
      } catch (error) {
        console.error("Error parsing byteArray:", error);
      }
    })();
  } else if (isMinioKeyString) {
    setFile(null);
    setFileType("");
    setIsLocalFile(false);
  } else {
    console.warn("Unsupported byteArray format");
    setFile(null);
    setFileType("");
    setIsLocalFile(false);
  }

}, [byteArray, fileNamePath, elem?.value, elem?.fileContent]); // ✅ add elem?.fileContent
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

    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [showModal, previewUrl, fileType]);

  // Excel preview effect
  useEffect(() => {
    if (showModal && isExcelPreview && file) {
      setExcelLoading(true);
      setExcelError("");
      setExcelSheets([]);
      setActiveSheetIndex(0);

      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });

          const sheets = workbook.SheetNames.map((sheetName, index) => {
            const worksheet = workbook.Sheets[sheetName];
            const html = XLSX.utils.sheet_to_html(worksheet, {
              id: `sheet-${index}`,
              editable: false,
            });

            const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
            const rowCount = range.e.r - range.s.r + 1;
            const colCount = range.e.c - range.s.c + 1;

            return {
              name: sheetName,
              html: html,
              rowCount: rowCount,
              colCount: colCount,
            };
          });

          setExcelSheets(sheets);
          setExcelLoading(false);
        } catch (err) {
          console.error("Error parsing Excel:", err);
          setExcelError("Failed to parse Excel file: " + err.message);
          setExcelLoading(false);
        }
      };

      reader.onerror = () => {
        setExcelError("Failed to read file");
        setExcelLoading(false);
      };

      reader.readAsArrayBuffer(file);
    }
  }, [showModal, isExcelPreview, file]);

  // Email preview effect
  useEffect(() => {
    if (showModal && isEmailPreview && file) {
      setEmailLoading(true);
      setEmailError("");
      setEmailData(null);
      setActiveEmailTab(0);

      const parseEmail = async () => {
        try {
          const arrayBuffer = await file.arrayBuffer();

          if (
            file.type === "application/vnd.ms-outlook" ||
            file.name.toLowerCase().endsWith(".msg")
          ) {
            await parseMsgFile(arrayBuffer);
          } else {
            await parseEmlFile(arrayBuffer);
          }
        } catch (err) {
          console.error("Error parsing email:", err);
          setEmailError("Failed to parse email file: " + err.message);
          setEmailLoading(false);
        }
      };

      parseEmail();
    }
  }, [showModal, isEmailPreview, file]);
  useEffect(() => {
  if (!file) return;

  if (file.type.startsWith("image/")) {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }
}, [file]);
// Add this effect after your existing useEffects

useEffect(() => {
  // If fileContent exists in elem → parse it directly (skip MinIO)
  if (elem?.fileContent && elem.fileContent.trim() !== "") {
    (async () => {
      try {
        const { file: parsedFile, mimeType } = await getFileFromByteArray(
          elem.fileContent,        // base64 string from elem
          elem.imagePath || elem.value || fileNamePath  // use imagePath or value as filename hint
        );

        if (parsedFile) {
          setFile(parsedFile);
          setFileType(mimeType);
          setIsLocalFile(true);

          // If it's an image → generate preview URL immediately
          if (mimeType.startsWith("image/")) {
            const url = URL.createObjectURL(parsedFile);
            setPreviewUrl(url);
          }
        }
      } catch (error) {
        console.error("Error parsing fileContent:", error);
      }
    })();
  }
}, [elem?.fileContent]);
const handleCameraCapture = async (event) => {
  const capturedFile = event.target.files?.[0];
  if (!capturedFile) return;

  try {
    setIsUploading(true);

    // 1) Read as ArrayBuffer → byte array
    const arrayBuffer = await capturedFile.arrayBuffer();
    const byteArray = Array.from(new Uint8Array(arrayBuffer));

    // 2) Convert to base64 for fileContent
    const base64String = btoa(
      byteArray.map((b) => String.fromCharCode(b)).join("")
    );

    // 3) Update local state
    setFile(capturedFile);
    setFileType(capturedFile.type);
    setIsLocalFile(true);
    setCellValue(byteArray); // ← byte array as value

    // 4) Update elem
    if (elem) {
      elem.value = byteArray;          // ← byte array for backend
      elem.fileContent = base64String; // ← base64 for frontend preview
      elem.imagePath = capturedFile.name;
    }

    // 5) Notify parent
    if (onValueChange) onValueChange(byteArray);
    if (onFileUpload) onFileUpload(base64String, capturedFile);

    setSnackbarText("Photo uploaded successfully!");
    setsnackbarSeverity("success");
    setSnackbarOpen(true);

  } catch (error) {
    console.error("Camera upload error:", error);
    setSnackbarText("Photo upload failed: " + error.message);
    setsnackbarSeverity("error");
    setSnackbarOpen(true);
  } finally {
    setIsUploading(false);
  }
};
  // Parse EML file
  const parseEmlFile = async (arrayBuffer) => {
    try {
      const parser = new PostalMime();
      const email = await parser.parse(arrayBuffer);

      const emailInfo = {
        from: email.from?.text || email.from?.address || "Unknown",
        to: formatAddressList(email.to),
        cc: formatAddressList(email.cc),
        bcc: formatAddressList(email.bcc),
        subject: email.subject || "(No Subject)",
        date: email.date ? new Date(email.date).toLocaleString() : "Unknown",
        bodyText: email.text || "",
        bodyHtml: email.html || "",
        attachments: (email.attachments || []).map((att) => ({
          filename: att.filename || "Attachment",
          contentType: att.mimeType || "application/octet-stream",
          size: att.content?.length || 0,
          content: att.content,
        })),
        headers: email.headers || [],
      };

      setEmailData(emailInfo);
      setEmailLoading(false);
    } catch (err) {
      throw new Error("EML parsing failed: " + err.message);
    }
  };
const startCamera = async () => {
  try {
    // Open dialog first so video element exists
    setCameraOpen(true);

    await new Promise((r) => setTimeout(r, 100)); // allow render

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true, // ⬅️ IMPORTANT: don't force environment on laptops
      audio: false,
    });

    mediaStreamRef.current = stream;

    const video = videoRef.current;
    if (!video) {
      console.error("Video element not ready");
      return;
    }

    video.srcObject = stream;
    video.muted = true;      // ⬅️ REQUIRED for autoplay
    video.playsInline = true;

    await video.play();      // ⬅️ VERY IMPORTANT
  } catch (err) {
    console.error("Camera error:", err);
    alert("Unable to access camera. Please check permissions.");
    stopCamera();
  }
};

const stopCamera = () => {
  if (mediaStreamRef.current) {
    mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
  }
  setCameraOpen(false);
};
const isDesktopDevice = () => {
  const ua = navigator.userAgent || navigator.vendor || window.opera;

  // Mobile detection
  const isMobile =
    /android|iphone|ipad|ipod|opera mini|iemobile|mobile/i.test(ua);

  // Touch-based laptops are still laptops → allow capture
  return !isMobile;
};

// const capturePhoto = () => {
//   const video = videoRef.current;
//   const canvas = canvasRef.current;

//   if (!video || !canvas) {
//     alert("Camera not ready");
//     return;
//   }

//   if (video.videoWidth === 0) {
//     alert("Camera stream not ready yet");
//     return;
//   }

//   canvas.width = video.videoWidth;
//   canvas.height = video.videoHeight;

//   const ctx = canvas.getContext("2d");
//   ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//   canvas.toBlob((blob) => {
//     if (!blob) return;

//     const file = new File([blob], `capture_${Date.now()}.jpg`, {
//       type: "image/jpeg",
//     });

//     setFile(file);
//     setFileType(file.type);
//     setIsLocalFile(true);

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const byteArray = Array.from(new Uint8Array(e.target.result));
//       onFileUpload?.(byteArray, file);
//     };
//     reader.readAsArrayBuffer(file);

//     stopCamera();
//   }, "image/jpeg", 0.9);
// };

  // Parse MSG file
  
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) {
      alert("Camera not ready");
      return;
    }
    if (video.videoWidth === 0) {
      alert("Camera stream not ready yet");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

canvas.toBlob(
  async (blob) => {
    if (!blob) return;

    const capturedFile = new File(
      [blob],
      `capture_${Date.now()}.jpg`,
      { type: "image/jpeg" }
    );

    try {
      setIsUploading(true);

      // 1) Read as ArrayBuffer → byte array
      const arrayBuffer = await capturedFile.arrayBuffer();
      const byteArray = Array.from(new Uint8Array(arrayBuffer));

      // 2) Convert to base64 for fileContent
      const base64String = btoa(
        byteArray.map((b) => String.fromCharCode(b)).join("")
      );

      // 3) Update local state
      setFile(capturedFile);
      setFileType(capturedFile.type);
      setIsLocalFile(true);
      setCellValue(byteArray); // ← byte array as value

      // 4) Update elem
      if (elem) {
        elem.value = byteArray;          // ← byte array for backend
        elem.fileContent = base64String; // ← base64 for frontend preview
        elem.imagePath = capturedFile.name;
      }

      // 5) Notify parent
      if (onValueChange) onValueChange(byteArray);
      if (onFileUpload) onFileUpload(base64String, capturedFile);

      setSnackbarText("Photo captured & uploaded!");
      setsnackbarSeverity("success");
      setSnackbarOpen(true);

    } catch (error) {
      console.error("Capture upload error:", error);
      setSnackbarText("Capture upload failed: " + error.message);
      setsnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsUploading(false);
      stopCamera();
    }
  },
  "image/jpeg",
  0.9
);
  };
  
  const parseMsgFile = async (arrayBuffer) => {
    try {
      const msgReader = new MsgReader(arrayBuffer);
      const msgData = msgReader.getFileData();

      const emailInfo = {
        from: msgData.senderEmail
          ? `${msgData.senderName || ""} <${msgData.senderEmail}>`
          : msgData.senderName || "Unknown",
        to: formatMsgRecipients(msgData.recipients, "to"),
        cc: formatMsgRecipients(msgData.recipients, "cc"),
        bcc: formatMsgRecipients(msgData.recipients, "bcc"),
        subject: msgData.subject || "(No Subject)",
        date: msgData.messageDeliveryTime
          ? new Date(msgData.messageDeliveryTime).toLocaleString()
          : msgData.clientSubmitTime
          ? new Date(msgData.clientSubmitTime).toLocaleString()
          : "Unknown",
        bodyText: msgData.body || "",
        bodyHtml: msgData.bodyHTML || "",
        attachments: (msgData.attachments || []).map((att) => ({
          filename: att.fileName || att.name || "Attachment",
          contentType: att.mimeType || "application/octet-stream",
          size: att.contentLength || att.content?.length || 0,
          content: att.content,
          attachmentIndex: att.attachmentIndex,
        })),
        headers: [],
        importance: msgData.importance,
        messageClass: msgData.messageClass,
      };

      setEmailData(emailInfo);
      setEmailLoading(false);
    } catch (err) {
      throw new Error("MSG parsing failed: " + err.message);
    }
  };

  const formatAddressList = (addresses) => {
    if (!addresses) return "";
    if (Array.isArray(addresses)) {
      return addresses
        .map((addr) => {
          if (typeof addr === "string") return addr;
          if (addr.text) return addr.text;
          if (addr.address) {
            return addr.name ? `${addr.name} <${addr.address}>` : addr.address;
          }
          return "";
        })
        .filter(Boolean)
        .join(", ");
    }
    if (typeof addresses === "object") {
      return addresses.text || addresses.address || "";
    }
    return String(addresses);
  };

  const formatMsgRecipients = (recipients, type) => {
    if (!recipients || !Array.isArray(recipients)) return "";

    return recipients
      .filter((r) => {
        if (type === "to") return !r.recipType || r.recipType === 1;
        if (type === "cc") return r.recipType === 2;
        if (type === "bcc") return r.recipType === 3;
        return false;
      })
      .map((r) => {
        if (r.email) {
          return r.name ? `${r.name} <${r.email}>` : r.email;
        }
        return r.name || "";
      })
      .filter(Boolean)
      .join(", ");
  };

  const downloadEmailAttachment = (attachment) => {
    if (!attachment.content) {
      alert("Attachment content not available");
      return;
    }

    let blob;
    if (attachment.content instanceof Uint8Array) {
      blob = new Blob([attachment.content], { type: attachment.contentType });
    } else if (attachment.content instanceof ArrayBuffer) {
      blob = new Blob([new Uint8Array(attachment.content)], {
        type: attachment.contentType,
      });
    } else {
      blob = new Blob([attachment.content], { type: attachment.contentType });
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = attachment.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Fetch file from API using minio_key
  const fetchFile = async (minioKey) => {
    try {
      setIsLoading(true);
  const tenantId = getTenantID();
      // const response = await fetch(
      //   `${apiBaseUrl}/api/files/file?minio_key=${encodeURIComponent(minioKey)}`
      // );
    //   const response = await axios.get(
    //   `${process.env.REACT_APP_LOGBOOK}/logbook/file`, // API endpoint with tenant-specific path
    //   {
    //     params: {
    //       minio_key:minioKey,
    //       // Pass the required parameters in the request
    //       tenantId: tenantId,
    //     },
    //     headers: {
    //       // Send the authorization token in the request headers to ensure secure access
    //       Authorization: `Bearer ${localStorage.getItem("token")}`,
    //     },
    //   }
    // );

     const response = await fetch(`${process.env.REACT_APP_LOGBOOK}/logbook/file?minio_key=${encodeURIComponent(minioKey)}&tenantId=${tenantId}`,
    {
       
        headers: {
          // Send the authorization token in the request headers to ensure secure access
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    // const response = await getFileFromMinIO(minioKey);
      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }

      const blob = await response.blob();
const url = URL.createObjectURL(blob);

let detectedType = blob.type;
const fileName = getDisplayLabel();

const fetchedFile = new File([blob], fileName, { type: detectedType });

setFile(fetchedFile);
setFileType(detectedType);
setIsLocalFile(true);

// ✅ If image → do NOT open dialog automatically
if (detectedType.startsWith("image/")) {
  setPreviewUrl(url);
  return;
}

// Non-image → keep old behavior
handlePreviewFromBlob(fetchedFile, detectedType, url);
    } catch (err) {
      console.error("Error fetching file:", err);
      alert("Error fetching file: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle preview from fetched blob
  const handlePreviewFromBlob = (fetchedFile, mimeType, blobUrl) => {
    const fileName = fetchedFile.name.toLowerCase();

    if (
      mimeType === "message/rfc822" ||
      mimeType === "application/vnd.ms-outlook" ||
      fileName.endsWith(".eml") ||
      fileName.endsWith(".msg")
    ) {
      setIsEmailPreview(true);
      setIsExcelPreview(false);
      setShowModal(true);
      return;
    }

    if (
      mimeType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      mimeType === "application/vnd.ms-excel" ||
      fileName.endsWith(".xlsx") ||
      fileName.endsWith(".xls")
    ) {
      setIsExcelPreview(true);
      setIsEmailPreview(false);
      setShowModal(true);
      return;
    }

    if (
      mimeType.startsWith("image/") ||
      mimeType === "application/pdf" ||
      mimeType === "text/plain" ||
      mimeType === "application/json"
    ) {
      setPreviewUrl(blobUrl);
      setIsExcelPreview(false);
      setIsEmailPreview(false);
      setShowModal(true);
    } else {
      window.open(blobUrl, "_blank");
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    }
  };

  // Handle file selection from upload
  // const handleFileChange = (event) => {
  //   const selectedFile = event.target.files[0];
  //   if (!selectedFile) return;

  //   setFile(selectedFile);
  //   setFileType(selectedFile.type);
  //   setIsLocalFile(true);

  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     const byteArray = Array.from(new Uint8Array(e.target.result));
  //     if (onFileUpload) onFileUpload(byteArray, selectedFile);
  //   };
  //   reader.readAsArrayBuffer(selectedFile);
  // };
const handleFileChange = async (event) => {
  const selectedFile = event.target.files[0];
  if (!selectedFile) return;

  try {
    setIsUploading(true);

    // 1) Read file as ArrayBuffer → convert to byte array (array of numbers)
    const arrayBuffer = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(selectedFile);
    });

    // 2) Convert ArrayBuffer to byte array (array of numbers) ← backend expects this
    const byteArray = Array.from(new Uint8Array(arrayBuffer));

    // 3) Convert to base64 for fileContent (frontend preview)
    const base64String = btoa(
      byteArray.map((b) => String.fromCharCode(b)).join("")
    );

    // 4) Update local state
    setFile(selectedFile);
    setFileType(selectedFile.type);
    setIsLocalFile(true);
    setCellValue(byteArray); // ← byte array as value

    // 5) Update elem object
    if (elem) {
      elem.value = byteArray;          // ← byte array for backend
      elem.fileContent = base64String; // ← base64 for frontend preview (untouched by backend)
      elem.imagePath = selectedFile.name; // ← original filename
    }

    // 6) Notify parent
    if (onValueChange) onValueChange(byteArray);
    if (onFileUpload) onFileUpload(base64String, selectedFile);

    // 7) Success snackbar
    setSnackbarText("File uploaded successfully!");
    setsnackbarSeverity("success");
    setSnackbarOpen(true);

  } catch (error) {
    console.error("Upload error:", error);
    setSnackbarText("File upload failed: " + error.message);
    setsnackbarSeverity("error");
    setSnackbarOpen(true);
  } finally {
    setIsUploading(false);
    event.target.value = "";
  }
};

  const handleDownload = () => {
    if (!file) return;

    const blob = new Blob([file], { type: file.type });
    let fileName = file.name;

    if (!fileName.includes(".")) {
      const extMap = {
        "application/pdf": "pdf",
        "application/msword": "doc",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          "docx",
        "application/vnd.ms-excel": "xls",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
          "xlsx",
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/gif": "gif",
        "application/zip": "zip",
        "application/json": "json",
        "text/plain": "txt",
        "message/rfc822": "eml",
        "application/vnd.ms-outlook": "msg",
      };
      const ext = extMap[file.type] || "bin";
      fileName += "." + ext;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };
const isImageFile = (fileName) => {
  if (!fileName) return false;

  const ext = fileName.split(".").pop()?.toLowerCase();

  return ["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(ext);
};
  // Handle delete - sets cell.value to null and clears file
  // const handleDeleteFile = () => {
  //   setCellValue(null);
  //   setFile(null);
  //   setIsLocalFile(false);
  //   setFileType("");

  //   if (elem) {
  //     elem.value = null;
  //   }

  //   if (onValueChange) {
  //     onValueChange(null);
  //   }

  //   if (onFileUpload) {
  //     onFileUpload(null, null);
  //   }
  //   setPreviewUrl(null);
  // };
 const handleDeleteFile = async () => {
    try {
      setIsLoading(true);

      // 1) Delete from MinIO if we have a key
      if (cellValue) {
        const tenantId = getTenantID();
        // await deleteFileFromMinIO(cellValue, tenantId);
      }

      // 2) Clear all local state
      setCellValue(null);
      setFile(null);
      setIsLocalFile(false);
      setFileType("");

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      // 3) Update elem object
      if (elem) {
        elem.value = null;
      }

      // 4) Notify parent
      if (onValueChange) onValueChange(null);
      if (onFileUpload) onFileUpload(null, null);

      // 5) Success snackbar
      setSnackbarText("File deleted successfully!");
      setsnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Delete error:", error);
      setSnackbarText("File deletion failed: " + error.message);
      setsnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCloseModal = () => {
  setShowModal(false);
  setIsExcelPreview(false);
  setIsEmailPreview(false);
  setExcelSheets([]);
  setActiveSheetIndex(0);
  setExcelError("");
  setEmailData(null);
  setEmailError("");

  // Only revoke previewUrl for non-image files
  if (previewUrl && !fileType.startsWith("image/")) {
    URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  }
};

  const handleSheetChange = (event, newValue) => {
    setActiveSheetIndex(newValue);
  };

  const handleEmailTabChange = (event, newValue) => {
    setActiveEmailTab(newValue);
  };

  const handleView = () => {
    if (!file) return;

    if (
      file.type === "message/rfc822" ||
      file.type === "application/vnd.ms-outlook" ||
      file.name.toLowerCase().endsWith(".eml") ||
      file.name.toLowerCase().endsWith(".msg")
    ) {
      setIsEmailPreview(true);
      setIsExcelPreview(false);
      setFileType(file.type);
      setShowModal(true);
      return;
    }

    if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel" ||
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".xls")
    ) {
      setIsExcelPreview(true);
      setIsEmailPreview(false);
      setFileType(file.type);
      setShowModal(true);
      return;
    }

    const blob = new Blob([file], { type: file.type });
    const url = URL.createObjectURL(blob);

    if (
      file.type.startsWith("image/") ||
      file.type === "application/pdf" ||
      file.type === "text/plain" ||
      file.type === "application/json"
    ) {
      setPreviewUrl(url);
      setFileType(file.type);
      setIsExcelPreview(false);
      setIsEmailPreview(false);
      setShowModal(true);
    } else {
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const excelTableStyles = `
    .excel-table-container table {
      border-collapse: collapse;
      width: 100%;
      min-width: 600px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 13px;
    }
    .excel-table-container th,
    .excel-table-container td {
      border: 1px solid #d0d0d0;
      padding: 6px 10px;
      text-align: left;
      white-space: nowrap;
    }
    .excel-table-container th {
      background-color: #f0f0f0;
      font-weight: 600;
      position: sticky;
      top: 0;
      z-index: 1;
    }
    .excel-table-container tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    .excel-table-container tr:hover {
      background-color: #e8f4fc;
    }
    .excel-table-container td:first-child {
      background-color: #f5f5f5;
      font-weight: 500;
    }
  `;

  // Render API file button (for when cellValue has value but no local file)
const renderApiFileButton = () => {
  const label = getDisplayLabel();
  const minioKey = cellValue;

  // ✅ If fileContent is present, file should already be loaded → don't show API button
  if (elem?.fileContent && elem.fileContent.trim() !== "") return null;

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => fetchFile(minioKey)}
        disabled={isLoading}
        startIcon={
          isLoading ? <CircularProgress size={16} /> : <Visibility />
        }
        sx={{
          textTransform: "none",
          maxWidth: "200px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {isLoading ? "Loading..." : label}
      </Button>

      {editable && (
        <IconButton
          onClick={handleDeleteFile}
          color="error"
          size="small"
          title="Delete file and upload new"
        >
          <Close />
        </IconButton>
      )}
    </Box>
  );
};

  // Render local file info (for uploaded or fetched files)
  const renderLocalFileInfo = () => {
    const isOctetStream = file.type === "application/octet-stream";
if (fileType.startsWith("image/") && previewUrl) {
  return (
    <>
    <Box  display="flex" justifyContent="center" gap={1}  textAlign="center">
      <img
        src={previewUrl}
        alt="preview"
        style={{
          width: "80px",
          height: "80px",
          objectFit: "cover",
          borderRadius: "6px",
          border: "1px solid #ddd",
          cursor: "pointer"
        }}
        onClick={handleView}
      />

      <Box display="flex" justifyContent="center" gap={1} mt={1}>
        <IconButton size="small" onClick={handleDownload}>
          <Download />
        </IconButton>

        {editable && (
          <IconButton size="small" color="error" onClick={handleDeleteFile}>
            <Delete />
          </IconButton>
        )}
      </Box>
    </Box>
    
    
</>
  );
}
    return (
      <Box textAlign="center">
        <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
          {file.name}
        </Typography>

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={1}
        >
          <Button
            size="small"
            onClick={handleDownload}
            variant="contained"
            color="success"
            startIcon={<Download />}
            disabled={isOctetStream}
          >
            Download
          </Button>

          <Button
            size="small"
            onClick={handleView}
            variant="contained"
            color="info"
            startIcon={<Visibility />}
            disabled={isOctetStream}
          >
            View
          </Button>

          {editable && (
            <IconButton
              onClick={handleDeleteFile}
              color="error"
              size="small"
              title="Delete file"
            >
              <Delete />
            </IconButton>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" >
      {/* Case 1: Has local file (uploaded or fetched) - show file info */}
      {file && renderLocalFileInfo()}

{/* Case 2: No local file but cellValue exists */}
{!file && hasValue && (
  <>
    {isValidFileReference() ? (
      renderApiFileButton()
    ) : (
      <Typography variant="body2" color="textSecondary">
        No file
      </Typography>
    )}
  </>
)}

      {/* Case 3: No file, no value, editable - show upload button */}
    {showUpload && (
  <>
    {elem?.requiredfield && (
      <Typography component="span" color="error">
        *
      </Typography>
    )}

    <Box display="flex" gap={1}>
      {/* Upload button (always visible) */}
      <Button
        component="label"
        variant="contained"
        color="primary"
        startIcon={<CloudUpload />}
        disabled={elem?.disabled}
      >
        Upload
        <Input
          type="file"
          onChange={handleFileChange}
          sx={{ display: "none" }}
          disabled={elem?.disabled}
        />
      </Button>

      {/* Capture button → ONLY on desktop/laptop */}
      {isDesktop && (
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<Visibility />}
          onClick={startCamera}
        >
          Capture
        </Button>
      )}
    </Box>
  </>
)}
 <div>
            <SnackbarComponent
              openPopup={snackbarOpen} // State to control snackbar open/close
              setOpenPopup={setSnackbarOpen} // Function to update snackbar state
              dialogMessage={snackbarText} // Message to display in the snackbar
              snackbarSeverity={snackbarSeverity} // Severity level of the snackbar (e.g., success, error)
            />
          </div>
<Dialog
  header="Capture Image"
  visible={cameraOpen}
  onHide={stopCamera}
  modal
  style={{ width: "600px" }}
>
  <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
   <video
  ref={videoRef}
  autoPlay
  muted
  playsInline
  style={{
    width: "100%",
    height: "auto",
    minHeight: "300px",
    backgroundColor: "#000",
    borderRadius: 8,
  }}
/>

    <canvas ref={canvasRef} style={{ display: "none" }} />

    <Box display="flex" gap={2}>
      <Button
        variant="contained"
        color="success"
        onClick={capturePhoto}
      >
        📸 Capture
      </Button>

      <Button
        variant="outlined"
        color="error"
        onClick={stopCamera}
      >
        Cancel
      </Button>
    </Box>
  </Box>
</Dialog>


     {/* Case 4: Not editable and no value and no file - show placeholder */}
{!file && !hasValue && !editable && (
  <Typography variant="body2" color="textSecondary">
    No file
  </Typography>
)}

      {/* Preview Modal */}
      {showModal && (
        <Dialog
          header={`File Preview - ${file?.name || getDisplayLabel()}`}
          visible={showModal}
          onHide={handleCloseModal}
          modal
          dismissableMask
          resizable
          maximizable
          style={{
            width: isExcelPreview || isEmailPreview ? "90vw" : "auto",
            maxWidth: "95vw",
          }}
          contentStyle={{ padding: "0" }}
        >
          <div style={{ minHeight: 200 }}>
            {/* Image Preview */}
            {fileType.startsWith("image/") &&
              !isExcelPreview &&
              !isEmailPreview && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "70vh",
                    display: "block",
                    margin: "0 auto",
                    // padding: "10px",
                  }}
                />
              )}

            {/* PDF Preview */}
            {fileType === "application/pdf" &&
              !isExcelPreview &&
              !isEmailPreview && (
                <iframe
                  src={previewUrl}
                  title="PDF Preview"
                  style={{
                    width: "100%",
                    height: "80vh",
                    border: "none",
                  }}
                />
              )}

            {/* Text/JSON Preview */}
            {(fileType === "text/plain" || fileType === "application/json") &&
              !isExcelPreview &&
              !isEmailPreview && (
                <pre
                  style={{
                    maxWidth: "100%",
                    maxHeight: "70vh",
                    overflow: "auto",
                    background: "#f8f9fa",
                    padding: 10,
                    borderRadius: 4,
                    margin: "10px",
                  }}
                >
                  {textContent}
                </pre>
              )}

            {/* Excel Preview */}
            {isExcelPreview && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "75vh",
                  backgroundColor: "#fff",
                }}
              >
                {excelLoading && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      color: "#666",
                    }}
                  >
                    <CircularProgress sx={{ color: "#217346" }} />
                    <Typography sx={{ mt: 2 }}>
                      Loading Excel preview...
                    </Typography>
                  </Box>
                )}

                {excelError && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      color: "red",
                    }}
                  >
                    <Typography>❌ {excelError}</Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleDownload}
                      startIcon={<Download />}
                      sx={{ mt: 2 }}
                    >
                      Download File Instead
                    </Button>
                  </Box>
                )}

                {!excelLoading && !excelError && excelSheets.length > 0 && (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 16px",
                        backgroundColor: "#217346",
                        color: "white",
                      }}
                    >
                      <Typography variant="body2">
                        📊 {excelSheets.length} Sheet
                        {excelSheets.length > 1 ? "s" : ""} |{" "}
                        {excelSheets[activeSheetIndex]?.rowCount} Rows ×{" "}
                        {excelSheets[activeSheetIndex]?.colCount} Columns
                      </Typography>
                      <Typography variant="body2">
                        Sheet: {activeSheetIndex + 1} of {excelSheets.length}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        flex: 1,
                        overflow: "auto",
                        backgroundColor: "#fff",
                      }}
                    >
                      <style>{excelTableStyles}</style>
                      <div
                        className="excel-table-container"
                        dangerouslySetInnerHTML={{
                          __html: excelSheets[activeSheetIndex]?.html || "",
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        borderTop: "1px solid #d0d0d0",
                        backgroundColor: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {excelSheets.length > 5 && (
                        <Box sx={{ display: "flex", px: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() =>
                              setActiveSheetIndex((prev) =>
                                Math.max(0, prev - 1)
                              )
                            }
                            disabled={activeSheetIndex === 0}
                          >
                            ◀
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() =>
                              setActiveSheetIndex((prev) =>
                                Math.min(excelSheets.length - 1, prev + 1)
                              )
                            }
                            disabled={
                              activeSheetIndex === excelSheets.length - 1
                            }
                          >
                            ▶
                          </IconButton>
                        </Box>
                      )}

                      <Tabs
                        value={activeSheetIndex}
                        onChange={handleSheetChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                          minHeight: "36px",
                          "& .MuiTab-root": {
                            minHeight: "36px",
                            textTransform: "none",
                            fontSize: "13px",
                            fontWeight: 400,
                            color: "#333",
                            backgroundColor: "#e0e0e0",
                            borderRight: "1px solid #c0c0c0",
                            borderTop: "1px solid #c0c0c0",
                            marginRight: "2px",
                            borderRadius: "4px 4px 0 0",
                            padding: "6px 16px",
                            "&.Mui-selected": {
                              backgroundColor: "#fff",
                              color: "#217346",
                              fontWeight: 600,
                              borderBottom: "2px solid #217346",
                            },
                            "&:hover": {
                              backgroundColor: "#f5f5f5",
                            },
                          },
                          "& .MuiTabs-indicator": {
                            display: "none",
                          },
                        }}
                      >
                        {excelSheets.map((sheet, index) => (
                          <Tab
                            key={index}
                            label={
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <span>📄</span>
                                <span>{sheet.name}</span>
                              </Box>
                            }
                          />
                        ))}
                      </Tabs>

                      <Box
                        sx={{
                          px: 1,
                          color: "#666",
                          cursor: "default",
                          fontSize: "18px",
                        }}
                      >
                        ⊕
                      </Box>
                    </Box>
                  </>
                )}
              </Box>
            )}

            {/* Email Preview */}
            {isEmailPreview && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "75vh",
                  backgroundColor: "#f5f5f5",
                }}
              >
                {emailLoading && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      color: "#666",
                    }}
                  >
                    <CircularProgress />
                    <Typography sx={{ mt: 2 }}>
                      Loading email preview...
                    </Typography>
                  </Box>
                )}

                {emailError && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      color: "red",
                    }}
                  >
                    <Typography>❌ {emailError}</Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleDownload}
                      startIcon={<Download />}
                      sx={{ mt: 2 }}
                    >
                      Download File Instead
                    </Button>
                  </Box>
                )}

                {!emailLoading && !emailError && emailData && (
                  <>
                    <Box
                      sx={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Email />
                      <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        Email Preview
                      </Typography>
                      {file?.name?.toLowerCase().endsWith(".msg") && (
                        <Chip
                          label="MSG"
                          size="small"
                          sx={{
                            backgroundColor: "rgba(255,255,255,0.2)",
                            color: "white",
                            ml: 1,
                          }}
                        />
                      )}
                      {file?.name?.toLowerCase().endsWith(".eml") && (
                        <Chip
                          label="EML"
                          size="small"
                          sx={{
                            backgroundColor: "rgba(255,255,255,0.2)",
                            color: "white",
                            ml: 1,
                          }}
                        />
                      )}
                    </Box>

                    <Paper
                      elevation={0}
                      sx={{
                        margin: "16px",
                        marginBottom: "8px",
                        padding: "16px",
                        borderRadius: "8px",
                        backgroundColor: "#fff",
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Subject
                          sx={{ color: "#666", mr: 1, mt: 0.5, fontSize: 20 }}
                        />
                        <Box>
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            display="block"
                          >
                            Subject
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {emailData.subject}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          mb: 1.5,
                        }}
                      >
                        <Person
                          sx={{ color: "#666", mr: 1, mt: 0.5, fontSize: 20 }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            display="block"
                          >
                            From
                          </Typography>
                          <Typography variant="body2">
                            {emailData.from}
                          </Typography>
                        </Box>
                      </Box>

                      {emailData.to && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            mb: 1.5,
                            ml: 3.5,
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              display="block"
                            >
                              To
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ wordBreak: "break-word" }}
                            >
                              {emailData.to}
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      {emailData.cc && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            mb: 1.5,
                            ml: 3.5,
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              display="block"
                            >
                              CC
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ wordBreak: "break-word" }}
                            >
                              {emailData.cc}
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          ml: 3.5,
                        }}
                      >
                        <CalendarToday
                          sx={{ color: "#666", mr: 1, mt: 0.5, fontSize: 16 }}
                        />
                        <Box>
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            display="block"
                          >
                            Date
                          </Typography>
                          <Typography variant="body2">
                            {emailData.date}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>

                    <Box sx={{ px: 2 }}>
                      <Tabs
                        value={activeEmailTab}
                        onChange={handleEmailTabChange}
                        sx={{
                          "& .MuiTab-root": {
                            textTransform: "none",
                            fontWeight: 500,
                          },
                        }}
                      >
                        <Tab label="📝 Body" />
                        <Tab
                          label={`📎 Attachments (${
                            emailData.attachments?.length || 0
                          })`}
                        />
                      </Tabs>
                    </Box>

                    <Box
                      sx={{
                        flex: 1,
                        overflow: "auto",
                        margin: "0 16px 16px 16px",
                        backgroundColor: "#fff",
                        borderRadius: "0 0 8px 8px",
                        border: "1px solid #e0e0e0",
                        borderTop: "none",
                      }}
                    >
                      {activeEmailTab === 0 && (
                        <Box sx={{ p: 2 }}>
                          {emailData.bodyHtml ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: emailData.bodyHtml,
                              }}
                              style={{
                                fontFamily: "Arial, sans-serif",
                                fontSize: "14px",
                                lineHeight: "1.6",
                              }}
                            />
                          ) : emailData.bodyText ? (
                            <pre
                              style={{
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                                fontFamily: "Arial, sans-serif",
                                fontSize: "14px",
                                lineHeight: "1.6",
                                margin: 0,
                              }}
                            >
                              {emailData.bodyText}
                            </pre>
                          ) : (
                            <Typography
                              color="textSecondary"
                              sx={{ fontStyle: "italic" }}
                            >
                              No email body content available
                            </Typography>
                          )}
                        </Box>
                      )}

                      {activeEmailTab === 1 && (
                        <Box sx={{ p: 2 }}>
                          {emailData.attachments &&
                          emailData.attachments.length > 0 ? (
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                              }}
                            >
                              {emailData.attachments.map(
                                (attachment, index) => (
                                  <Paper
                                    key={index}
                                    elevation={0}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      padding: "12px 16px",
                                      backgroundColor: "#f9f9f9",
                                      border: "1px solid #e0e0e0",
                                      borderRadius: "8px",
                                      "&:hover": {
                                        backgroundColor: "#f0f0f0",
                                      },
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                      }}
                                    >
                                      <AttachFile sx={{ color: "#666" }} />
                                      <Box>
                                        <Typography
                                          variant="body2"
                                          sx={{ fontWeight: 500 }}
                                        >
                                          {attachment.filename}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          color="textSecondary"
                                        >
                                          {attachment.contentType} •{" "}
                                          {formatFileSize(attachment.size)}
                                        </Typography>
                                      </Box>
                                    </Box>
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      startIcon={<Download />}
                                      onClick={() =>
                                        downloadEmailAttachment(attachment)
                                      }
                                      disabled={!attachment.content}
                                    >
                                      Download
                                    </Button>
                                  </Paper>
                                )
                              )}
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                py: 4,
                                color: "#999",
                              }}
                            >
                              <AttachFile sx={{ fontSize: 48, mb: 1 }} />
                              <Typography>No attachments</Typography>
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>
                  </>
                )}
              </Box>
            )}
          </div>
        </Dialog>
      )}
    </Box>
  );
};

FileCellComponent.propTypes = {
  elem: PropTypes.object,
  byteArray: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.string,
    PropTypes.instanceOf(Uint8Array),
    PropTypes.instanceOf(ArrayBuffer),
  ]),
  onFileUpload: PropTypes.func,
  onValueChange: PropTypes.func,
  fileNamePath: PropTypes.string,
  error: PropTypes.bool,
  editable: PropTypes.bool,
  apiBaseUrl: PropTypes.string,
};

FileCellComponent.defaultProps = {
  byteArray: null,
  onFileUpload: null,
  onValueChange: null,
  fileNamePath: "",
  error: false,
  editable: false,
  apiBaseUrl: "http://localhost:8094",
};

export default FileCellComponent;