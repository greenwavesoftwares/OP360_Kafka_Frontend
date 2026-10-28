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
import { getTenantID } from "../UserModuleUpdated/UsermoduleApi";
import SnackbarComponent from "../components/shared/snackbar/customSnackbar";

// ─── VALUE TYPE DETECTION ───
// Detects what kind of data elem.value contains
const detectValueType = (value) => {
  if (value === null || value === undefined || value === "") return "empty";

  if (value instanceof Blob || value instanceof File) return "blob";

  if (value instanceof Uint8Array || value instanceof ArrayBuffer)
    return "byteArray";

  if (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((b) => typeof b === "number" && b >= 0 && b <= 255)
  )
    return "byteArray";

  if (typeof value === "string") {
    if (value.startsWith("data:")) return "dataUri";

    // UUID pattern → MinIO key
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(value.trim())) return "minioKey";

    // Long base64 string
    const cleaned = value.replace(/\s/g, "");
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (cleaned.length > 100 && base64Regex.test(cleaned)) return "base64";

    // Fallback → treat as MinIO key
    return "minioKey";
  }

  return "empty";
};

const getFileFromByteArray = async (byteArray, fileNamePath) => {
  let uint8Array;

  try {
    if (typeof byteArray === "string") {
      const cleanedString = byteArray.replace(/\s/g, "");

      if (!cleanedString) {
        return { file: null, mimeType: "", fileExtension: "" };
      }

      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      const isBase64 =
        base64Regex.test(cleanedString) && cleanedString.length % 4 === 0;

      if (isBase64) {
        try {
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
          const encoder = new TextEncoder();
          uint8Array = encoder.encode(byteArray);
        }
      } else {
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
          console.warn("Unknown string format for byteArray");
          return { file: null, mimeType: "", fileExtension: "" };
        }
      }
    } else if (Array.isArray(byteArray)) {
      uint8Array = new Uint8Array(byteArray);
    } else if (byteArray instanceof Uint8Array) {
      uint8Array = byteArray;
    } else if (byteArray instanceof ArrayBuffer) {
      uint8Array = new Uint8Array(byteArray);
    } else {
      console.warn("Unsupported byteArray type:", typeof byteArray);
      return { file: null, mimeType: "", fileExtension: "" };
    }

    if (!uint8Array || uint8Array.length === 0) {
      return { file: null, mimeType: "", fileExtension: "" };
    }

    let mimeType = "application/octet-stream";
    let fileExtension = "bin";

    if (uint8Array[0] === 0x25 && uint8Array[1] === 0x50) {
      mimeType = "application/pdf";
      fileExtension = "pdf";
    } else if (
  uint8Array[0] === 0xd0 &&
  uint8Array[1] === 0xcf &&
  uint8Array[2] === 0x11 &&
  uint8Array[3] === 0xe0
) {
  const headerString = new TextDecoder("utf-8", { fatal: false }).decode(
    uint8Array.slice(0, 2000),
  );
  const lowerPath = fileNamePath?.toLowerCase() || "";

  if (
    headerString.includes("IPM.Note") ||
    headerString.includes("Microsoft Outlook") ||
    lowerPath.endsWith(".msg")
  ) {
    mimeType = "application/vnd.ms-outlook";
    fileExtension = "msg";
  } else if (
    headerString.includes("Workbook") ||
    headerString.includes("Book") ||
    lowerPath.endsWith(".xls")
  ) {
    mimeType = "application/vnd.ms-excel";
    fileExtension = "xls";
  } else {
    mimeType = "application/msword";
    fileExtension = "doc";
  }
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
    } else if (
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
    } else if (uint8Array[0] === 0x7b || uint8Array[0] === 0x5b) {
      mimeType = "application/json";
      fileExtension = "json";
    } else if (uint8Array[0] === 0x74 || uint8Array[0] === 0x54) {
      mimeType = "text/plain";
      fileExtension = "txt";
    }

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
      }
       else if (lowerPath.endsWith(".xls")) {          // ← NEW
        mimeType = "application/vnd.ms-excel";           // ← NEW
        fileExtension = "xls";                           // ← NEW
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

// ─── HELPER: Convert any value type to a processable format ───
const convertValueToByteArray = async (value) => {
  const type = detectValueType(value);

  switch (type) {
    case "blob": {
      const arrayBuffer = await value.arrayBuffer();
      return Array.from(new Uint8Array(arrayBuffer));
    }
    case "byteArray":
      return Array.isArray(value) ? value : Array.from(new Uint8Array(value));
    case "dataUri": {
      const base64Part = value.split(",")[1] || value;
      const cleaned = base64Part.replace(/-/g, "+").replace(/_/g, "/");
      const binary = atob(cleaned);
      return Array.from({ length: binary.length }, (_, i) =>
        binary.charCodeAt(i),
      );
    }
    case "base64": {
      const cleaned = value.replace(/\s/g, "").replace(/-/g, "+").replace(/_/g, "/");
      const binary = atob(cleaned);
      return Array.from({ length: binary.length }, (_, i) =>
        binary.charCodeAt(i),
      );
    }
    default:
      return null;
  }
};

// ─── HELPER: Convert any value type to base64 string ───
const convertValueToBase64 = async (value) => {
  const type = detectValueType(value);

  switch (type) {
    case "dataUri":
      return value; // Already a data URI
    case "base64":
      return `data:application/octet-stream;base64,${value}`;
    case "blob": {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(value);
      });
    }
    case "byteArray": {
      const bytes = Array.isArray(value) ? value : Array.from(new Uint8Array(value));
      const binary = bytes.map((b) => String.fromCharCode(b)).join("");
      return `data:application/octet-stream;base64,${btoa(binary)}`;
    }
    default:
      return null;
  }
};

const FileCellComponent = ({
  elem,
  byteArray, // ← DEPRECATED: kept for backward compat, but elem.value is primary
  onFileUpload,
  onValueChange,
  fileNamePath,
  error,
  editable,
  apiBaseUrl = "http://localhost:8094",
}) => {
  const [snackbarText, setSnackbarText] = useState("Unsupported File !");
  const [snackbarSeverity, setsnackbarSeverity] = useState("Error");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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
  const [isLocalFile, setIsLocalFile] = useState(false);
  const [excelSheets, setExcelSheets] = useState([]);
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);
  const [isEmailPreview, setIsEmailPreview] = useState(false);
  const [emailData, setEmailData] = useState(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [activeEmailTab, setActiveEmailTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const excelPreviewRef = useRef(null);

  // Sync cellValue with elem.value
  useEffect(() => {
    setCellValue(elem?.value || null);
  }, [elem?.value]);

  useEffect(() => {
    setIsDesktop(isDesktopDevice());
  }, []);

  const getDisplayLabel = () => {
    if (!cellValue) return "";

    const valueType = detectValueType(cellValue);

    // If it's actual file data, show the file name
    if (["blob", "byteArray", "base64", "dataUri"].includes(valueType)) {
      if (fileNamePath || elem?.imagePath) {
        return (fileNamePath || elem?.imagePath).split("/").pop();
      }
      return "Attached File";
    }

    // If it's a string (MinIO key or other)
    if (typeof cellValue === "string") {
      const value = String(cellValue);
      const uuidRegex =
        /^[0-9a-f]{4,8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{8,12}/i;
      const lastDotIndex = value.lastIndexOf(".");

      if (lastDotIndex !== -1) {
        const extension = value.substring(lastDotIndex + 1);
        const validExtRegex = /^[a-z0-9]{2,5}$/i;
        if (!validExtRegex.test(extension)) return "No file";
        if (uuidRegex.test(value)) return `attachment.${extension}`;
        return value;
      }

      if (uuidRegex.test(value)) return "attachment";
      return "No file";
    }

    return "No file";
  };

  const isValidFileReference = () => {
    if (!cellValue) return false;
    const label = getDisplayLabel();
    return label !== "No file" && label !== "";
  };

  const hasValue =
    cellValue !== null && cellValue !== undefined && cellValue !== "";

  const showUpload = !file && !hasValue && editable;

  // ─── MAIN SYNC EFFECT: Process elem.value into a File object ───
  useEffect(() => {
    const processValue = async () => {
      const valueType = detectValueType(elem?.value);

      // Empty → reset
      if (valueType === "empty") {
        setFile(null);
        setFileType("");
        setIsLocalFile(false);
        return;
      }

      // MinIO key → don't auto-fetch, let user click the button
      if (valueType === "minioKey") {
        setFile(null);
        setFileType("");
        setIsLocalFile(false);
        return;
      }

      // Blob / ByteArray / Base64 / DataUri → parse into File
      if (
        ["blob", "byteArray", "base64", "dataUri"].includes(valueType)
      ) {
        try {
          let rawBytes = elem.value;

          // For base64/dataUri, strip the prefix before passing to getFileFromByteArray
          if (valueType === "dataUri") {
            rawBytes = elem.value.split(",")[1] || elem.value;
          }

          const { file: parsedFile, mimeType } = await getFileFromByteArray(
            rawBytes,
            elem?.imagePath || fileNamePath,
          );

          if (parsedFile) {
            setFile(parsedFile);
            setFileType(mimeType);
            setIsLocalFile(true);

            if (mimeType.startsWith("image/")) {
              const url = URL.createObjectURL(parsedFile);
              setPreviewUrl(url);
            }
          }
        } catch (error) {
          console.error("Error parsing elem.value:", error);
        }
      }
    };

    processValue();
  }, [elem?.value, elem?.imagePath, fileNamePath]);

  // Text/JSON preview fetch
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

  // Excel preview
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

            return {
              name: sheetName,
              html,
              rowCount: range.e.r - range.s.r + 1,
              colCount: range.e.c - range.s.c + 1,
            };
          });

          setExcelSheets(sheets);
          setExcelLoading(false);
        } catch (err) {
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

  // Email preview
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
          setEmailError("Failed to parse email file: " + err.message);
          setEmailLoading(false);
        }
      };

      parseEmail();
    }
  }, [showModal, isEmailPreview, file]);

  // Image preview URL
  useEffect(() => {
    if (!file) return;
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, [file]);

  const handleCameraCapture = async (event) => {
    const capturedFile = event.target.files?.[0];
    if (!capturedFile) return;

    try {
      setIsUploading(true);

      const arrayBuffer = await capturedFile.arrayBuffer();
      const byteArray = Array.from(new Uint8Array(arrayBuffer));
      const base64String = btoa(
        byteArray.map((b) => String.fromCharCode(b)).join(""),
      );

      setFile(capturedFile);
      setFileType(capturedFile.type);
      setIsLocalFile(true);
      setCellValue(base64String);

      if (elem) {
        elem.value = base64String; // ← ONLY value, no fileContent
        elem.imagePath = capturedFile.name;
      }

      if (onValueChange) onValueChange(base64String);
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

  const parseEmlFile = async (arrayBuffer) => {
    try {
      const parser = new PostalMime();
      const email = await parser.parse(arrayBuffer);

      setEmailData({
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
      });
      setEmailLoading(false);
    } catch (err) {
      throw new Error("EML parsing failed: " + err.message);
    }
  };

  const startCamera = async () => {
    try {
      setCameraOpen(true);
      await new Promise((r) => setTimeout(r, 100));

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      mediaStreamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;

      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;
      await video.play();
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
    const isMobile =
      /android|iphone|ipad|ipod|opera mini|iemobile|mobile/i.test(ua);
    return !isMobile;
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    if (video.videoWidth === 0) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      async (blob) => {
        if (!blob) return;

        const capturedFile = new File([blob], `capture_${Date.now()}.jpg`, {
          type: "image/jpeg",
        });

        try {
          setIsUploading(true);

          const arrayBuffer = await capturedFile.arrayBuffer();
          const byteArray = Array.from(new Uint8Array(arrayBuffer));
          const base64String = btoa(
            byteArray.map((b) => String.fromCharCode(b)).join(""),
          );

          setFile(capturedFile);
          setFileType(capturedFile.type);
          setIsLocalFile(true);
          setCellValue(base64String);

          if (elem) {
            elem.value = base64String; // ← ONLY value
            elem.imagePath = capturedFile.name;
          }

          if (onValueChange) onValueChange(base64String);
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
      0.9,
    );
  };

  const parseMsgFile = async (arrayBuffer) => {
    try {
      const msgReader = new MsgReader(arrayBuffer);
      const msgData = msgReader.getFileData();

      setEmailData({
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
      });
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
          if (addr.address)
            return addr.name ? `${addr.name} <${addr.address}>` : addr.address;
          return "";
        })
        .filter(Boolean)
        .join(", ");
    }
    if (typeof addresses === "object")
      return addresses.text || addresses.address || "";
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
        if (r.email) return r.name ? `${r.name} <${r.email}>` : r.email;
        return r.name || "";
      })
      .filter(Boolean)
      .join(", ");
  };

  const downloadEmailAttachment = (attachment) => {
    if (!attachment.content) return;

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

  const fetchFile = async (minioKey) => {
    try {
      setIsLoading(true);
      const tenantId = getTenantID();

      const response = await fetch(
        `${process.env.REACT_APP_LOGBOOK}/logbook/file?minio_key=${encodeURIComponent(minioKey)}&tenantId=${tenantId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const fileName = getDisplayLabel();
      const fetchedFile = new File([blob], fileName, { type: blob.type });

      setFile(fetchedFile);
      setFileType(blob.type);
      setIsLocalFile(true);

      if (blob.type.startsWith("image/")) {
        setPreviewUrl(url);
        return;
      }

      handlePreviewFromBlob(fetchedFile, blob.type, url);
    } catch (err) {
      console.error("Error fetching file:", err);
      alert("Error fetching file: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

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

  // ─── FILE UPLOAD: Sets elem.value to base64 string only ───
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    try {
      setIsUploading(true);

      const arrayBuffer = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(selectedFile);
      });

      const byteArray = Array.from(new Uint8Array(arrayBuffer));
      const base64String = btoa(
        byteArray.map((b) => String.fromCharCode(b)).join(""),
      );

      setFile(selectedFile);
      setFileType(selectedFile.type);
      setIsLocalFile(true);
      setCellValue(base64String);

      if (elem) {
        elem.value = base64String; // ← ONLY value, no fileContent
        elem.imagePath = selectedFile.name;
      }

      if (onValueChange) onValueChange(base64String);
      if (onFileUpload) onFileUpload(base64String, selectedFile);

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
      fileName += "." + (extMap[file.type] || "bin");
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

  const handleDeleteFile = async () => {
    try {
      setIsLoading(true);

      setCellValue(null);
      setFile(null);
      setIsLocalFile(false);
      setFileType("");

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      if (elem) {
        elem.value = null; // ← Clear value only
      }

      if (onValueChange) onValueChange(null);
      if (onFileUpload) onFileUpload(null, null);

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

    if (previewUrl && !fileType.startsWith("image/")) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSheetChange = (event, newValue) => setActiveSheetIndex(newValue);
  const handleEmailTabChange = (event, newValue) =>
    setActiveEmailTab(newValue);

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
      border-collapse: collapse; width: 100%; min-width: 600px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 13px;
    }
    .excel-table-container th, .excel-table-container td {
      border: 1px solid #d0d0d0; padding: 6px 10px; text-align: left; white-space: nowrap;
    }
    .excel-table-container th {
      background-color: #f0f0f0; font-weight: 600; position: sticky; top: 0; z-index: 1;
    }
    .excel-table-container tr:nth-child(even) { background-color: #f9f9f9; }
    .excel-table-container tr:hover { background-color: #e8f4fc; }
    .excel-table-container td:first-child { background-color: #f5f5f5; font-weight: 500; }
  `;

  const renderApiFileButton = () => {
    const label = getDisplayLabel();
    const minioKey = cellValue;

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

  const renderLocalFileInfo = () => {
    if (fileType.startsWith("image/") && previewUrl) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          gap={1}
          textAlign="center"
        >
          <img
            src={previewUrl}
            alt="preview"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
              borderRadius: "6px",
              border: "1px solid #ddd",
              cursor: "pointer",
            }}
            onClick={handleView}
          />
          <Box display="flex" justifyContent="center" gap={1} mt={1}>
            <IconButton size="small" onClick={handleDownload}>
              <Download />
            </IconButton>
            {editable && (
              <IconButton
                size="small"
                color="error"
                onClick={handleDeleteFile}
              >
                <Delete />
              </IconButton>
            )}
          </Box>
        </Box>
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
          >
            Download
          </Button>
          <Button
            size="small"
            onClick={handleView}
            variant="contained"
            color="info"
            startIcon={<Visibility />}
          >
            View
          </Button>
          {editable && (
            <IconButton
              onClick={handleDeleteFile}
              color="error"
              size="small"
            >
              <Delete />
            </IconButton>
          )}
        </Box>
      </Box>
    );
  };

  // Determine if value is a MinIO key (for showing fetch button)
  const valueType = detectValueType(cellValue);
  const isMinioKey = valueType === "minioKey";

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      {/* Case 1: Has local file */}
      {file && renderLocalFileInfo()}

      {/* Case 2: No local file but value is a MinIO key */}
      {!file && hasValue && isMinioKey && (
        <>{isValidFileReference() ? renderApiFileButton() : null}</>
      )}

      {/* Case 2b: No local file, has value, but not MinIO key and not parsed yet */}
      {!file && hasValue && !isMinioKey && valueType !== "empty" && (
        <Typography variant="body2" color="textSecondary">
          Processing file...
        </Typography>
      )}

      {/* Case 3: No file, no value, editable */}
      {showUpload && (
        <>
          {elem?.requiredfield && (
            <Typography component="span" color="error">
              *
            </Typography>
          )}
          <Box display="flex" gap={1}>
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

      {/* Case 4: Not editable, no value, no file */}
      {!file && !hasValue && !editable && (
        <Typography variant="body2" color="textSecondary">
          No file
        </Typography>
      )}

      <div>
        <SnackbarComponent
          openPopup={snackbarOpen}
          setOpenPopup={setSnackbarOpen}
          dialogMessage={snackbarText}
          snackbarSeverity={snackbarSeverity}
        />
      </div>

      <Dialog
        header="Capture Image"
        visible={cameraOpen}
        onHide={stopCamera}
        modal
        style={{ width: "600px" }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
        >
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
            <Button variant="contained" color="success" onClick={capturePhoto}>
              📸 Capture
            </Button>
            <Button variant="outlined" color="error" onClick={stopCamera}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Preview Modal - (unchanged, keeping same structure) */}
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
                  }}
                />
              )}

            {fileType === "application/pdf" &&
              !isExcelPreview &&
              !isEmailPreview && (
                <iframe
                  src={previewUrl}
                  title="PDF Preview"
                  style={{ width: "100%", height: "80vh", border: "none" }}
                />
              )}

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

            {/* Excel & Email previews remain the same as original */}
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
                        padding: "8px 16px",
                        backgroundColor: "#217346",
                        color: "white",
                      }}
                    >
                      <Typography variant="body2">
                        📊 {excelSheets.length} Sheet
                        {excelSheets.length > 1 ? "s" : ""}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, overflow: "auto" }}>
                      <style>{excelTableStyles}</style>
                      <div
                        className="excel-table-container"
                        dangerouslySetInnerHTML={{
                          __html: excelSheets[activeSheetIndex]?.html || "",
                        }}
                      />
                    </Box>
                    <Tabs
                      value={activeSheetIndex}
                      onChange={handleSheetChange}
                      variant="scrollable"
                      scrollButtons="auto"
                    >
                      {excelSheets.map((sheet, index) => (
                        <Tab key={index} label={sheet.name} />
                      ))}
                    </Tabs>
                  </>
                )}
              </Box>
            )}

            {isEmailPreview && emailData && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "75vh",
                  backgroundColor: "#f5f5f5",
                }}
              >
                {/* Email preview content - same as original */}
                <Box
                  sx={{
                    backgroundColor: "#1976d2",
                    color: "white",
                    padding: "12px 16px",
                  }}
                >
                  <Typography variant="h6">Email Preview</Typography>
                </Box>
                <Paper sx={{ m: 2, p: 2 }}>
                  <Typography variant="h6">{emailData.subject}</Typography>
                  <Typography>From: {emailData.from}</Typography>
                  <Typography>To: {emailData.to}</Typography>
                  <Typography>Date: {emailData.date}</Typography>
                </Paper>
                <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
                  {emailData.bodyHtml ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: emailData.bodyHtml }}
                    />
                  ) : (
                    <pre>{emailData.bodyText}</pre>
                  )}
                </Box>
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