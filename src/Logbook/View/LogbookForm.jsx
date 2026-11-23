import {
  Alert,
  Badge,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  LinearProgress,
  Modal,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  styled,
  tableCellClasses,
} from "@mui/material";
import * as XLSX from "xlsx-js-style";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Button as PrimeButton } from "primereact/button";
import WarningIcon from "@mui/icons-material/Warning";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import { Button as PrimeReactButton } from "primereact/button";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";
import { updateJobStatus } from "../../ActivityReviewer/ActivityReviewerAPI";

import DateField from "../../components/shared/DateField/DateField.component";
import DateTimeField from "../../components/shared/DateField/DateTimeField.component";
import TimeField from "../../components/shared/DateField/TimeField.component";
import Dropdown from "../../components/shared/Dropdown/Dropdown.component";
import Image from "../../components/shared/Image/Image.component";
import Label from "../../components/shared/Label/Label.component";
import LabelApi from "../../components/shared/LabelApi/LabelApi.component";
import NumberBox from "../../components/shared/NumberBox/NumberBox.component";
import InputTextBox from "../../components/shared/TextBox/InputTextBox.component";
import {
  decryptTokenId,
  extendTokenExpiration,
} from "../../helper/AuthService";
import {
  sendMailForNextActivities,
  updateActivityStatus,
} from "../../JobPerformer/JobPerformerAPI";
import { updateJobTime } from "../../SelfJobCreation/SelfJobCreationAPI";
import {
  SaveTransactionToMongo,
  SaveTransaction,
  getAllCellInfoByFormNameAndVersion,
  getAllTransactions,
  getAttachmentsByTransactionId,
  getCellEditHistory,
  getFormInfoByFormName,
  getQueryResult,
  getQueryResultForGlobalCellUpdate,
  getRestData,
  handleSaveTransactionAttachment,
} from "../LogbookApi";
import LogbookSkeleton from "./LogbookSkeleton";
import FileDownloadComponent from "../../Logbook Configure/FileDownloadComponent";
import SwitchButton from "../../Logbook Configure/SwitchButton";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import SwitchMicButton from "../../Logbook Configure/SwitchMicButton";
import FileUploadComponent from "../../Logbook Configure/FileUploadComponent";
import SnackbarComponent from "../../components/shared/snackbar/customSnackbar";
import ScrollToTop from "react-scroll-to-top";

import CustomScrollBottom from "../../Logbook Configure/CustomScrollBottom";
import { Affix } from "antd";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputTextarea } from "primereact/inputtextarea";
import { Paginator } from "primereact/paginator";
import FileCellComponent from "../../Logbook Configure/FileCellComponent";
import { emailPerformerForNextActivities } from "../../JobPerformer/JobHelper";
import HandwritingToggle from "../../Logbook Configure/HandwritingToggle";
import axios from "axios";
import {
  deleteData,
  getData,
  saveData,
  saveGridData,
} from "../OfflineLogbook/indexedDb";
import RestoreNotification from "../OfflineLogbook/RestoreNotification";
import {
  useIsFirstRender,
  useNetworkState,
  useVisibilityChange,
} from "@uidotdev/usehooks";
import { formatDatetime } from "../../JobAssign/helper";
import TipsAndUpdatesRoundedIcon from "@mui/icons-material/TipsAndUpdatesRounded";
import { getCurrentUser } from "../../UserModuleUpdated/helper";

let transactionObjDb = {};

function deepEqual(obj1, obj2, path = "") {
  console.log("Obj 1 : ", obj1);
  console.log("Obj 2 : ", obj2);
  // Same reference / primitive
  if (obj1 === obj2) {
    return true;
  }

  // Treat null and undefined as equivalent
  if (obj1 == null && obj2 == null) {
    return true;
  }

  // One is null/undefined
  if (obj1 == null || obj2 == null) {
    console.log(`Change detected at "${path}"`);
    console.log("Object 1:", obj1);
    console.log("Object 2:", obj2);

    return false;
  }

  // Primitive values
  if (typeof obj1 !== "object" || typeof obj2 !== "object") {
    console.log(`Change detected at "${path}"`);
    console.log("Object 1:", obj1);
    console.log("Object 2:", obj2);

    return false;
  }

  // Arrays
  if (Array.isArray(obj1) || Array.isArray(obj2)) {
    if (!Array.isArray(obj1) || !Array.isArray(obj2)) {
      console.log(`Change detected at "${path}"`);
      console.log("Object 1:", obj1);
      console.log("Object 2:", obj2);

      return false;
    }

    if (obj1.length !== obj2.length) {
      console.log(`Array length changed at "${path}"`);
      console.log("Object 1 length:", obj1.length);
      console.log("Object 2 length:", obj2.length);

      return false;
    }

    for (let i = 0; i < obj1.length; i++) {
      const currentPath = `${path}[${i}]`;

      if (!deepEqual(obj1[i], obj2[i], currentPath)) {
        return false; // Early exit
      }
    }

    return true;
  }

  // Compare union of keys
  const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

  for (const key of keys) {
    const currentPath = path ? `${path}.${key}` : key;

    const value1 = obj1[key];
    const value2 = obj2[key];

    // Missing property and null/undefined are considered equal
    if (value1 == null && value2 == null) {
      continue;
    }

    if (!deepEqual(value1, value2, currentPath)) {
      return false; // Early exit
    }
  }

  return true;
}

function LogbookForm({ logData }) {
  console.log("LogbookForm History State : ", window.history.state);
  console.log("Hii i am Logbook Form");
  console.log("logdata : ", logData);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [offlineData, setOfflineData] = useState({});
  const isOnline = useNetworkState();
  console.log("isOnline : ", isOnline);

  const { search } = useLocation();

  const queryParts = search.substring(1).split("?");

  const selectedLogbookPart = queryParts[0]; // e.g., "selectedLogbook=RFP%20Dashboard"

  const versionPart = queryParts[1]; // e.g., "version=1"

  const querySelectedLogbook = new URLSearchParams(selectedLogbookPart).get(
    "selectedLogbook",
  );
  const queryVersion = versionPart
    ? new URLSearchParams(versionPart).get("version")
    : null;

  console.log("Selected Logbook:", querySelectedLogbook);
  console.log("Version:", queryVersion);
  let { state } = useLocation();

  if (logData) state = {};
  const [isProcessing, setIsProcessing] = useState(false);
  console.log("state", state);
  console.log("My logData : ", logData);
  const isTransactionError = state?.[process.env.REACT_APP_ISERROR] ?? false;
  const errorMsg = state?.[process.env.REACT_APP_ERRORMSG] ?? "";
  const errorBy = state?.[process.env.REACT_APP_ERRORBY] ?? "";
  const jobId = state?.[process.env.REACT_APP_JOBID] ?? "";
  const activityId = state?.[process.env.REACT_APP_ACTIVITYID] ?? "";

  const formName =
    state?.[process.env.REACT_APP_FORMNAME] ?? querySelectedLogbook ?? null;
  const versionNumber =
    state?.[process.env.REACT_APP_VERSIONNUMBER] ?? queryVersion ?? null;

  const [gridDataTest, setGridDataTest] = useState([]); //to store the overall JSOn Structure of the Logbook
  const [colTot, setColTot] = useState(); //total column  number of the Logbook
  const [open, setOpen] = useState(false);
  const [cellObj, setCellObj] = useState({});
  const [remarkDiag, setRemarkDiag] = useState(false);
  const [cellHistoryRows, setCellHistoryRows] = useState([]);
  const [cellChanges, setCellChanges] = useState([]);
  const [newTransacData, setNewTransacData] = useState({});
  const [newTransacDataTest, setNewTransacDataTest] = useState({}); //to store the transaction data

  const [transactionData, setTransactionData] = useState({}); //to store the transaction data
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [pageRemarksTable, setPageRemarksTable] = React.useState(0);
  const [rowsPerPageTable, setRowsPerPageTable] = React.useState(10);
  const [gridProperties, setGridPropertes] = useState({
    maxColNum: 0,
    occupiedGrid: [],
  });
  const [selectedFileContent, setSelectedFileContent] = useState(null);
  const [isPublicAccess, setIsPublicAccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isHandwritingMode, setIsHandwritingMode] = useState(false);
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [currentEditingCell, setCurrentEditingCell] = useState(null);
  const [snackbarText, setSnackbarText] = useState("Data saved !"); // Text for the snackbar notification
  const [snackbarSeverity, setsnackbarSeverity] = useState("success"); // Severity level for the snackbar (success, error, etc.)
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Boolean to control snackbar visibility

  const [sqlErrorList, setsqlErrorList] = useState([]);

  const [isProcessingHandwriting, setIsProcessingHandwriting] = useState(false);
  const [ocrError, setOcrError] = useState(null);
  const [ocrSuccess, setOcrSuccess] = useState(false);
  const [pollObj, setPollObj] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [openError, setOpenError] = useState(false);
  const firstRenderComplete = useRef(false);

  const gridDataRef = useRef([]);

  const navigationType = useNavigationType();
  console.log("Navigation Type : ", navigationType);
  const pageRefresh = sessionStorage.getItem("isRefresh") === "true";
  if (
    navigationType === "POP" &&
    !querySelectedLogbook &&
    !queryVersion &&
    !pageRefresh
  )
    navigate(-1);

  let customCss = "text-align: center; ";

  const fetchCellData = async (formName, versionNumber) => {
    return await getAllCellInfoByFormNameAndVersion(formName, versionNumber);
  };

  useEffect(() => {
    if (sqlErrorList.length > 0) {
      setCurrentIndex(0);
      setOpenError(true);
    }
  }, [sqlErrorList]);

  useEffect(() => {
    gridDataRef.current = gridDataTest;

    if (firstRenderComplete.current) {
      const latestTransaction = getLatestTransactions(
        "_",
        gridDataRef.current,
        setRemarkDiag,
        setCellChanges,
        setNewTransacData,
        setTransactionData,
        jobId,
        activityId,
        formName,
        versionNumber,
        userId,
        true,
      );

      console.log("Latest transaction log : ", latestTransaction);

      const isSameObj = deepEqual(
        transactionObjDb,
        latestTransaction.logbookData,
      );
      if (!isSameObj)
        saveData(jobId, activityId, latestTransaction, "Data saved locally");
    }
  }, [gridDataTest, firstRenderComplete]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      console.log("Before unload event triggered ! ", event);

      sessionStorage.setItem("isRefresh", "true");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);

      console.log("First Render ? ", firstRenderComplete);

      if (
        jobId &&
        activityId &&
        navigationType !== "POP" &&
        firstRenderComplete.current
      ) {
        handleSaveTransaction(
          "_",
          gridDataRef.current,
          setRemarkDiag,
          setCellChanges,
          setNewTransacData,
          setTransactionData,
          jobId,
          activityId,
          formName,
          versionNumber,
          userId,
        );
      }
    };
  }, []);

  const handleSaveTransaction = async (
    e,
    gridDataTest1,
    setRemarkDiag,
    setCellChanges,
    setNewTransacData,
    setTransactionData,
    jobId,
    activityId,
    formName,
    versionNumber,
    userId,
    refresh = false,
    isButtonClick = false,
  ) => {
    let gridDataTest = gridDataRef.current;

    setLoading(true);
    setIsProcessing(true);

    const tId = `T${new Date()
      .toISOString()
      .replace(/[-:T.Z]/g, "")
      .slice(0, 19)}`;

    const newCellObj = {};
    const newCellObjTest = {};
    console.log("GridData in The Transaction : ", gridDataTest);
    gridDataTest.forEach((item) => {
      item.cellData.forEach((cell) => {
        if (
          cell.cellId !== null &&
          cell.fieldType !== "File" &&
          cell.fieldType !== "Dropdown"
        ) {
          newCellObj[cell.cellId] = {
            remarks: cell.remarks || "NA",
            value: cell.value,
            disabled: cell.disabled,
            requiredfield: cell.requiredfield,
          };
        } else if (cell.fieldType === "File") {
          newCellObj[cell.cellId] = {
            remarks: cell.remarks || "NA",
            value: cell.value,
            disabled: cell.disabled,
            requiredfield: cell.requiredfield,
          };
        } else if (cell.fieldType === "Dropdown") {
          newCellObj[cell.cellId] = {
            remarks: cell.remarks || "NA",
            value: cell.value,
            disabled: cell.disabled,
            requiredfield: cell.requiredfield,
            dropDownFields: cell.dropDownFields,
          };
        }

        if (cell.context) {
          newCellObjTest[cell.context] =
            cell.fieldType === "File" ? cell.value || cell.value : cell.value;
        }
      });
    });

    console.log("NewCellObj:", newCellObj);
    console.log("ContextObj:", newCellObjTest);

    let data = await getAllTransactions(
      jobId,
      activityId,
      formName,
      versionNumber,
    );

    const lastTransaction = data?.length > 0 ? data[data.length - 1] : {};
    setTransactionData(lastTransaction);

    const cellValChanges = {};
    let rows = [];

    Object.keys(newCellObj).forEach((key) => {
      const oldVal = lastTransaction?.logbookData?.[key]?.value || "";

      if (newCellObj[key].value && oldVal !== newCellObj[key].value) {
        cellValChanges[key] = {
          oldValue: oldVal,
          newValue: newCellObj[key].value,
          remarks: "NA",
          requiredfield: newCellObj[key].requiredfield || false,
        };

        rows.push(
          createCellChangesData(key, oldVal, newCellObj[key].value, "NA"),
        );
      }
    });

    console.log("Changes:", rows);

    setCellChanges(rows);
    setNewTransacData(newCellObj);
    setNewTransacDataTest(newCellObjTest);

    const blobFileList = [];

    for (const key in newCellObj) {
      if (newCellObj[key].value === "Blob_File") {
        const cellInfo = {
          cellId: key,
          value: "Blob_File",
          transactionId: tId,
          jobId,
          activityId,
          formName,
          formversion: versionNumber,
        };

        for (const sheet of gridDataTest) {
          for (const cell of sheet.cellData) {
            if (cell.cellId === key) {
              cellInfo.aliasId = cell.aliasId;

              const { byteArray, fileExtension } = normalizeToByteArray(
                cell.value,
                cell.imagePath,
              );

              cellInfo.value = byteArray;
              cellInfo.fileExtension = fileExtension;
              cellInfo.fileName = cell.imagePath || `file.${fileExtension}`;

              break;
            }
          }
        }

        blobFileList.push(cellInfo);
      }
    }

    console.log("Blob List:", blobFileList);

    const transactionObj = {
      transactionId: tId,
      jobId,
      activityId,
      formName,
      formversion: versionNumber,
      logbookData: newCellObj,
      userId,
      role: "NA",
      transactionTimestamp: new Date(),
      userRemarks: "NA",
    };

    console.log("TransactionObj:", transactionObj);

    let status = 500;
    console.log(
      "Deep Equal Method called at 538",
      transactionObjDb,
      transactionObj,
    );
    const isSameObj = deepEqual(transactionObjDb, transactionObj.logbookData);
    if (isOnline.online && !isSameObj) {
      status = await SaveTransaction(transactionObj);
    }
    const status1 = 200; // await handleSaveTransactionAttachment(blobFileList);
    console.log("Status : ", status);

    if (status === 200 && status1 === 200) {
      setsnackbarSeverity("success");
      setSnackbarText("Transaction Saved");

      deleteData(jobId, activityId);
      if (isButtonClick) {
        navigate(-1);
      }
    } else {
      setsnackbarSeverity("error");
      setSnackbarText("Database Error");
      const isSameObj = deepEqual(transactionObjDb, transactionObj.logbookData);
      if (!isSameObj)
        saveData(
          jobId,
          activityId,
          transactionObj,
          status?.message || "Error saving transaction",
          true,
        );
    }

    setRemarkDiag(false);
    setLoading(false);
    setIsProcessing(false);
    console.log("handleSaveTransaction Completed ! ");
  };

  const getLatestTransactions = (
    e,
    gridDataTest1,
    setRemarkDiag,
    setCellChanges,
    setNewTransacData,
    setTransactionData,
    jobId,
    activityId,
    formName,
    versionNumber,
    userId,
    refresh = false,
  ) => {
    let gridDataTest = gridDataRef.current;
    console.log(
      "Grid Data ref in handleSaveIndexedDbBeforeRefresh:",
      gridDataTest,
    );

    setLoading(true);
    setIsProcessing(true);

    const tId = `T${new Date()
      .toISOString()
      .replace(/[-:T.Z]/g, "")
      .slice(0, 19)}`;

    const newCellObj = {};
    const newCellObjTest = {};
    console.log("GridData in The Transaction : ", gridDataTest);
    gridDataTest.forEach((item) => {
      item.cellData.forEach((cell) => {
        if (
          cell.cellId !== null &&
          cell.fieldType !== "File" &&
          cell.fieldType !== "Dropdown"
        ) {
          newCellObj[cell.cellId] = {
            remarks: cell.remarks || "NA",
            value: cell.value,
            disabled: cell.disabled,
            requiredfield: cell.requiredfield,
          };
        } else if (cell.fieldType === "File") {
          newCellObj[cell.cellId] = {
            remarks: cell.remarks || "NA",
            value: cell.value || cell.value,
            disabled: cell.disabled,
            requiredfield: cell.requiredfield,
          };
        } else if (cell.fieldType === "Dropdown") {
          newCellObj[cell.cellId] = {
            remarks: cell.remarks || "NA",
            value: cell.value,
            disabled: cell.disabled,
            requiredfield: cell.requiredfield,
            dropDownFields: cell.dropDownFields,
          };
        }

        if (cell.context) {
          newCellObjTest[cell.context] =
            cell.fieldType === "File" ? cell.value || cell.value : cell.value;
        }
      });
    });

    console.log("NewCellObj:", newCellObj);
    console.log("ContextObj:", newCellObjTest);

    const lastTransaction = {}; //data?.length > 0 ? data[data.length - 1] : {};
    setTransactionData(lastTransaction);

    const cellValChanges = {};
    let rows = [];

    Object.keys(newCellObj).forEach((key) => {
      const oldVal = lastTransaction?.logbookData?.[key]?.value || "";

      if (newCellObj[key].value && oldVal !== newCellObj[key].value) {
        cellValChanges[key] = {
          oldValue: oldVal,
          newValue: newCellObj[key].value,
          remarks: "NA",
          requiredfield: newCellObj[key].requiredfield || false,
        };

        rows.push(
          createCellChangesData(key, oldVal, newCellObj[key].value, "NA"),
        );
      }
    });

    console.log("Changes:", rows);

    setCellChanges(rows);
    setNewTransacData(newCellObj);
    setNewTransacDataTest(newCellObjTest);

    const blobFileList = [];

    for (const key in newCellObj) {
      if (newCellObj[key].value === "Blob_File") {
        const cellInfo = {
          cellId: key,
          value: "Blob_File",
          transactionId: tId,
          jobId,
          activityId,
          formName,
          formversion: versionNumber,
        };

        for (const sheet of gridDataTest) {
          for (const cell of sheet.cellData) {
            if (cell.cellId === key) {
              cellInfo.aliasId = cell.aliasId;

              const { byteArray, fileExtension } = normalizeToByteArray(
                cell.value,
                cell.imagePath,
              );

              cellInfo.value = byteArray;
              cellInfo.fileExtension = fileExtension;
              cellInfo.fileName = cell.imagePath || `file.${fileExtension}`;

              break;
            }
          }
        }

        blobFileList.push(cellInfo);
      }
    }

    console.log("Blob List:", blobFileList);

    const transactionObj = {
      transactionId: tId,
      jobId,
      activityId,
      formName,
      formversion: versionNumber,
      logbookData: newCellObj,
      userId,
      role: "NA",
      transactionTimestamp: new Date(),
      userRemarks: "NA",
    };

    console.log("TransactionObj:", transactionObj);

    setRemarkDiag(false);
    setLoading(false);
    setIsProcessing(false);

    console.log("handleSaveIndexedDbBeforeRefresh Completed ! ");
    return transactionObj;
  };

  const handleCloseError = () => {
    setOpenError(false);
    if (currentIndex < sqlErrorList.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setOpenError(true);
      }, 300); // Delay between snackbars
    }
  };

  function cellIdToExcelReference(cellId) {
    const parts = cellId.split("_"); // Assuming the format is '_row_column'

    const row = parts[1]; // Row number
    let col = parseInt(parts[2]); // Column number (convert to integer)

    let columnLetter = "";
    while (col > 0) {
      col--; // Adjusting to 0-based index
      columnLetter = String.fromCharCode((col % 26) + 65) + columnLetter; // Insert the letter at the beginning
      col = Math.floor(col / 26); // Reassign col to handle cases like AA, AB, etc.
    }

    return columnLetter + row;
  }

  const getTenantID = () => {
    const env_tenant = process.env.REACT_APP_TENANTID;
    console.log("Tenant Varaible from env : ", env_tenant);
    const encryptedTenant = localStorage.getItem(env_tenant);
    const tenant = decryptTokenId(encryptedTenant);
    console.log("Current Tenant ID : ", tenant);

    const userId = decryptTokenId(
      localStorage.getItem(process.env.REACT_APP_USERID),
    );
    console.log("userId", userId);
    return { tenant, userId };
  };
  const userId = getTenantID().userId;

  const onBooleanChange = async (
    e,
    elem,
    gridDataTest,
    setGridDataTest,
    pollObj,
    setPollObj,
  ) => {
    try {
      setIsProcessing(true); // ← Prevent re-renders during async operations
      setLoading(true);

      console.log("🟢 onBooleanChange triggered for:", elem.cellId);
      const newValue = e.target.checked;
      console.log("🟢 Checkbox value:", newValue);

      let updatedGridDataTest = gridDataTest.map((item) => ({
        ...item,
        cellData: item.cellData.map((cell) =>
          cell.cellId === elem.cellId ? { ...cell, value: newValue } : cell,
        ),
      }));

      console.log("📦 Step 1: Updated boolean value to:", newValue);
      if (elem.conditionalCssExpression?.trim()) {
        try {
          const logic = await findSQL(
            elem.conditionalCssExpression,
            elem,
            updatedGridDataTest,
          );

          console.log("Logic and cell Id and csstype", logic, elem);
          if (elem.conditionalCssExpType === "Expression") {
            customCss = customCss + executeLogic(logic);
          } else {
            const res = await getQueryResultForGlobalCellUpdate(logic);
            const val = Object.values(res)[0];
            customCss = val;
          }
          console.log(
            "Final Cell with custom css in text Field",
            elem,
            customCss,
          );
          elem.cellCSS = customCss;

          updatedGridDataTest = updatedGridDataTest.map((form) => ({
            ...form,
            cellData: form.cellData.map((cell) =>
              cell.cellId === elem.cellId
                ? { ...cell, cellCSS: customCss }
                : cell,
            ),
          }));
          console.log("Final Cell after update the css", elem);
        } catch (error) {
          console.error(
            `❌ Failed to resolve disabled for ${elem.cellId}`,
            error,
          );
        }
      }

      if (elem.globalExpressionLogic?.trim()) {
        try {
          console.log("🌐 [Step 2] Processing global expression");

          const sql = await findSQL(
            elem.globalExpressionLogic,
            elem,
            updatedGridDataTest,
          );

          console.log("🌐 [Step 2] Global expression SQL:", sql);

          const sqlResult = await getQueryResultForGlobalCellUpdate(sql);
          console.log("🌐 [Step 2] SQL Result:", sqlResult);

          const changedCells = [];

          updatedGridDataTest = updatedGridDataTest.map((form) => ({
            ...form,
            cellData: form.cellData.map((cell) => {
              const newVal =
                sqlResult?.[cell.cellId] ?? sqlResult?.[cell.aliasId];

              if (newVal !== undefined) {
                const isFile = ["Image", "File"].includes(cell.fieldType);
                const hasChanged = isFile
                  ? cell.value !== newVal
                  : cell.value !== newVal;

                if (hasChanged) {
                  console.log(
                    "🌐 [Step 2] Cell changed:",
                    cell.cellId,
                    "from",
                    isFile ? cell.value : cell.value,
                    "to",
                    newVal,
                  );
                  changedCells.push({ ...cell }); // Clone to avoid reference issues

                  return isFile
                    ? { ...cell, value: newVal }
                    : { ...cell, value: newVal };
                }
              }

              return cell;
            }),
          }));

          console.log(
            "📦 Step 2: Applied global expressions, changed cells:",
            changedCells.length,
          );

          for (const changed of changedCells) {
            console.log(
              "🔄 [Step 2] Running passive update for:",
              changed.cellId,
            );

            try {
              const passiveResult = await onPassiveFieldChange(
                changed,
                updatedGridDataTest,
                () => {}, // Don't update state yet
                pollObj,
                setPollObj,
                [elem.cellId],
              );

              if (Array.isArray(passiveResult)) {
                updatedGridDataTest = passiveResult;
                console.log(
                  "✅ [Step 2] Passive update completed for:",
                  changed.cellId,
                );
              }
            } catch (passiveError) {
              console.error(
                "❌ [Step 2] Passive update failed for:",
                changed.cellId,
                passiveError,
              );
            }
          }

          console.log("📦 Step 3: Passive updates complete");
        } catch (error) {
          console.error("❌ [Step 2] Error in global expression logic:", error);
        }
      }

      if (
        Array.isArray(elem.dependentFields) &&
        elem.dependentFields.length > 0
      ) {
        console.log(
          "📌 [Step 4] Processing",
          elem.dependentFields.length,
          "dependent fields SEQUENTIALLY",
        );

        for (let i = 0; i < elem.dependentFields.length; i++) {
          const dependentItem = elem.dependentFields[i];

          console.log(
            `🔄 [Step 4] [${i + 1}/${
              elem.dependentFields.length
            }] Processing dependent field:`,
            dependentItem.cellId,
          );

          try {
            const depResult = await onDependentCellUpdate(
              dependentItem,
              updatedGridDataTest, // ← Use the latest data
              () => {}, // ← Don't update state yet
              [elem.cellId],
              false, // ← Mark as NOT top level
            );

            if (Array.isArray(depResult)) {
              updatedGridDataTest = depResult; // ← Use the result immediately
              console.log(
                `✅ [Step 4] [${i + 1}/${
                  elem.dependentFields.length
                }] Dependent field updated:`,
                dependentItem.cellId,
              );
            } else {
              console.error(
                "⚠️ [Step 4] Dependent update returned invalid data for:",
                dependentItem.cellId,
              );
            }
          } catch (error) {
            console.error(
              `❌ [Step 4] Error processing dependent field ${dependentItem.cellId}:`,
              error,
            );
          }
        }

        console.log("📦 Step 4: All dependent fields processed");
      }

      if (elem.disableExpressionLogic?.trim()) {
        console.log(
          "🔒 [Step 5] Processing disable expression for:",
          elem.cellId,
        );

        try {
          const isExpr = elem.disabledExpType === "Expression";

          const disableVal = isExpr
            ? await (async () => {
                const expr = await findSQL(
                  elem.disableExpressionLogic,
                  elem,
                  updatedGridDataTest,
                );
                console.log("🔒 [Step 5] Disable expression:", expr);
                try {
                  const result = eval(expr);
                  console.log("🔒 [Step 5] Disable expression result:", result);
                  return result;
                } catch (evalError) {
                  console.error("🔒 [Step 5] Eval error:", evalError);
                  return false;
                }
              })()
            : await (async () => {
                const sql = await findSQL(
                  elem.disableExpressionLogic, // ← Fixed: was elem.depExpressionLogic
                  elem,
                  updatedGridDataTest,
                );
                console.log("🔒 [Step 5] Disable SQL:", sql);
                const sqlRes = await getQueryResultForGlobalCellUpdate(sql);
                console.log("🔒 [Step 5] Disable SQL Result:", sqlRes);
                return sqlRes ? Object.values(sqlRes)[0] : 0;
              })();

          const isDisabled =
            disableVal === 1 || disableVal === "1" || disableVal === true;

          console.log("🔒 [Step 5] Checkbox will be disabled:", isDisabled);

          updatedGridDataTest = updatedGridDataTest.map((form) => ({
            ...form,
            cellData: form.cellData.map((cell) =>
              cell.cellId === elem.cellId
                ? { ...cell, disabled: isDisabled }
                : cell,
            ),
          }));

          console.log("📦 Step 5: Disable logic applied");
        } catch (error) {
          console.error(
            "❌ [Step 5] Error in disable expression logic:",
            error,
          );
        }
      }

      try {
        console.log("⏱️ [Step 6] Processing polling logic");

        for (const item of pollObj ?? []) {
          const { cell } = item;
          if (!cell?.cellId) continue;

          try {
            if (cell.pollStartExpType === "Expression") {
              const startExp = await findSQL(
                cell.pollStartExpressionLogic,
                cell,
                updatedGridDataTest,
              );
              const stopExp = cell.pollStopExpressionLogic
                ? await findSQL(
                    cell.pollStopExpressionLogic,
                    cell,
                    updatedGridDataTest,
                  )
                : "false";

              const shouldStart = eval(startExp);
              const shouldStop = eval(stopExp);

              if (shouldStart) {
                setPollObj((prevPolls) =>
                  prevPolls.map((poll) =>
                    poll.cell.cellId === cell.cellId
                      ? {
                          ...poll,
                          autoRefresh: true,
                          pollInterval: cell.pollInterval,
                        }
                      : poll,
                  ),
                );
              }

              if (shouldStop) {
                setPollObj((prevPolls) =>
                  prevPolls.map((poll) =>
                    poll.cell.cellId === cell.cellId
                      ? { ...poll, autoRefresh: false }
                      : poll,
                  ),
                );
              }
            }

            if (cell.pollStartExpType === "SQL") {
              const startSQL = await findSQL(
                cell.pollStartExpressionLogic,
                cell,
                updatedGridDataTest,
              );
              const stopSQL = cell.pollStopExpressionLogic
                ? await findSQL(
                    cell.pollStopExpressionLogic,
                    cell,
                    updatedGridDataTest,
                  )
                : null;

              const startRes =
                await getQueryResultForGlobalCellUpdate(startSQL);
              const stopRes = stopSQL
                ? await getQueryResultForGlobalCellUpdate(stopSQL)
                : null;

              const shouldStart = ["1", 1, "true", true].includes(
                Object.values(startRes ?? {})[0],
              );
              const shouldStop = stopRes
                ? ["1", 1, "true", true].includes(Object.values(stopRes)[0])
                : false;

              if (shouldStart) {
                setPollObj((prevPolls) =>
                  prevPolls.map((poll) =>
                    poll.cell.cellId === cell.cellId
                      ? {
                          ...poll,
                          autoRefresh: true,
                          pollInterval: cell.pollInterval,
                        }
                      : poll,
                  ),
                );
              }

              if (shouldStop) {
                setPollObj((prevPolls) =>
                  prevPolls.map((poll) =>
                    poll.cell.cellId === cell.cellId
                      ? { ...poll, autoRefresh: false }
                      : poll,
                  ),
                );
              }
            }
          } catch (pollError) {
            console.error(
              "❌ [Step 6] Error processing poll for cell:",
              cell.cellId,
              pollError,
            );
          }
        }

        console.log("📦 Step 6: Polling logic complete");
      } catch (error) {
        console.error("❌ [Step 6] Error in polling logic:", error);
      }

      console.log("💾 [FINAL] About to update state with all changes");

      const finalGridData = updatedGridDataTest.map((form) => ({
        ...form,
        cellData: form.cellData.map((c) => ({
          ...c,

          dropDownFields: c.dropDownFields ? [...c.dropDownFields] : [],
        })),
      }));

      console.log("💾 [FINAL] Calling setGridDataTest");
      setGridDataTest(finalGridData);

      console.log("✅ onBooleanChange complete for:", elem.cellId);
    } catch (error) {
      console.error("❌ Error in onBooleanChange:", error);
      console.error("❌ Error stack:", error.stack);

      alert(
        `Error processing checkbox change: ${error.message}\n\nCheck console for details.`,
      );
    } finally {
      setLoading(false);
      setIsProcessing(false); // ← Allow re-renders again
    }
  };

  const onDateChange = async (
    e,
    elem,
    gridDataTest,
    setGridDataTest,
    pollObj,
    setPollObj,
  ) => {
    try {
      setIsProcessing(true); // ← Prevent re-renders during async operations
      setLoading(true);

      console.log("📅 onDateChange triggered for:", elem.cellId);
      console.log("📅 Date picker event:", e);

      let formattedDate = "";
      if (elem.fieldType === "Date") {
        formattedDate = dayjs(new Date(e.value)).format("YYYY-MM-DD");
        console.log("📅 Formatted date:", formattedDate);
      }

      let updatedGridDataTest = gridDataTest.map((item) => ({
        ...item,
        cellData: item.cellData.map((cell) => {
          if (cell.cellId === elem.cellId) {
            return {
              ...cell,
              value: formattedDate,
            };
          }
          return cell;
        }),
      }));

      console.log("📦 Step 1: Updated date value to:", formattedDate);
      if (elem.conditionalCssExpression?.trim()) {
        try {
          const logic = await findSQL(
            elem.conditionalCssExpression,
            elem,
            updatedGridDataTest,
          );

          console.log("Logic and cell Id and csstype", logic, elem);
          if (elem.conditionalCssExpType === "Expression") {
            customCss = customCss + executeLogic(logic);
          } else {
            const res = await getQueryResultForGlobalCellUpdate(logic);
            const val = Object.values(res)[0];
            customCss = val;
          }
          console.log(
            "Final Cell with custom css in text Field",
            elem,
            customCss,
          );
          elem.cellCSS = customCss;

          updatedGridDataTest = updatedGridDataTest.map((form) => ({
            ...form,
            cellData: form.cellData.map((cell) =>
              cell.cellId === elem.cellId
                ? { ...cell, cellCSS: customCss }
                : cell,
            ),
          }));
          console.log("Final Cell after update the css", elem);
        } catch (error) {
          console.error(
            `❌ Failed to resolve disabled for ${elem.cellId}`,
            error,
          );
        }
      }

      if (elem.globalExpressionLogic?.trim()) {
        try {
          console.log("🌐 [Step 2] Processing global expression");

          const sql = await findSQL(
            elem.globalExpressionLogic,
            elem,
            updatedGridDataTest,
          );

          console.log("🌐 [Step 2] Global expression SQL:", sql);

          const sqlResult = await getQueryResultForGlobalCellUpdate(sql);
          console.log("🌐 [Step 2] SQL Result:", sqlResult);

          const changedCells = [];
          updatedGridDataTest = updatedGridDataTest.map((form) => ({
            ...form,
            cellData: form.cellData.map((cell) => {
              const newVal =
                sqlResult?.[cell.cellId] ?? sqlResult?.[cell.aliasId];

              if (newVal !== undefined) {
                const isFile = ["Image", "File"].includes(cell.fieldType);
                const hasChanged = isFile
                  ? cell.value !== newVal
                  : cell.value !== newVal;

                if (hasChanged) {
                  console.log(
                    "🌐 [Step 2] Cell changed:",
                    cell.cellId,
                    "from",
                    isFile ? cell.value : cell.value,
                    "to",
                    newVal,
                  );
                  changedCells.push({ ...cell }); // Clone to avoid reference issues

                  return isFile
                    ? { ...cell, value: newVal }
                    : { ...cell, value: newVal };
                }
              }
              return cell;
            }),
          }));

          console.log(
            "📦 Step 2: Applied global expressions, changed cells:",
            changedCells.length,
          );

          for (const changed of changedCells) {
            console.log(
              "🔄 [Step 2] Running passive update for:",
              changed.cellId,
            );

            try {
              const passiveResult = await onPassiveFieldChange(
                changed,
                updatedGridDataTest,
                () => {}, // Don't update state yet
                pollObj,
                setPollObj,
                [elem.cellId],
              );

              if (Array.isArray(passiveResult)) {
                updatedGridDataTest = passiveResult;
                console.log(
                  "✅ [Step 2] Passive update completed for:",
                  changed.cellId,
                );
              }
            } catch (passiveError) {
              console.error(
                "❌ [Step 2] Passive update failed for:",
                changed.cellId,
                passiveError,
              );
            }
          }

          console.log("📦 Step 3: Passive updates complete");
        } catch (error) {
          console.error("❌ [Step 2] Error in global expression logic:", error);
        }
      }

      if (
        Array.isArray(elem.dependentFields) &&
        elem.dependentFields.length > 0
      ) {
        console.log(
          "📌 [Step 4] Processing",
          elem.dependentFields.length,
          "dependent fields SEQUENTIALLY",
        );

        for (let i = 0; i < elem.dependentFields.length; i++) {
          const itm = elem.dependentFields[i];

          console.log(
            `🔄 [Step 4] [${i + 1}/${
              elem.dependentFields.length
            }] Processing dependent field:`,
            itm.cellId,
          );

          try {
            const depResult = await onDependentCellUpdate(
              itm,
              updatedGridDataTest, // ← Use the latest data
              () => {}, // ← Don't update state yet
              [elem.cellId],
              false, // ← Mark as NOT top level
            );

            if (Array.isArray(depResult)) {
              updatedGridDataTest = depResult; // ← Use the result immediately
              console.log(
                `✅ [Step 4] [${i + 1}/${
                  elem.dependentFields.length
                }] Dependent field updated:`,
                itm.cellId,
              );
            } else {
              console.error(
                "⚠️ [Step 4] Dependent update returned invalid data for:",
                itm.cellId,
              );
            }
          } catch (error) {
            console.error(
              `❌ [Step 4] Error processing dependent field ${itm.cellId}:`,
              error,
            );
          }
        }

        console.log("📦 Step 4: All dependent fields processed");
      }

      if (elem.disableExpressionLogic?.trim()) {
        console.log(
          "🔒 [Step 5] Processing disable expression for:",
          elem.cellId,
        );

        try {
          const isExpr = elem.disabledExpType === "Expression";

          const disableVal = isExpr
            ? await (async () => {
                const expr = await findSQL(
                  elem.disableExpressionLogic,
                  elem,
                  updatedGridDataTest,
                );
                console.log("🔒 [Step 5] Disable expression:", expr);
                try {
                  const result = eval(expr);
                  console.log("🔒 [Step 5] Disable expression result:", result);
                  return result;
                } catch (evalError) {
                  console.error("🔒 [Step 5] Eval error:", evalError);
                  return false;
                }
              })()
            : await (async () => {
                const sql = await findSQL(
                  elem.disableExpressionLogic,
                  elem,
                  updatedGridDataTest,
                );
                console.log("🔒 [Step 5] Disable SQL:", sql);
                const res = await getQueryResultForGlobalCellUpdate(sql);
                console.log("🔒 [Step 5] Disable SQL Result:", res);
                return res ? Object.values(res)[0] : 0;
              })();

          const isDisabled =
            disableVal === 1 || disableVal === "1" || disableVal === true;

          console.log("🔒 [Step 5] Date field will be disabled:", isDisabled);

          updatedGridDataTest = updatedGridDataTest.map((form) => ({
            ...form,
            cellData: form.cellData.map((cell) =>
              cell.cellId === elem.cellId
                ? { ...cell, disabled: isDisabled }
                : cell,
            ),
          }));

          console.log("📦 Step 5: Disable logic applied");
        } catch (error) {
          console.error(
            "❌ [Step 5] Error in disable expression logic:",
            error,
          );
        }
      }

      try {
        console.log("⏱️ [Step 6] Processing polling logic");

        for (const item of pollObj ?? []) {
          const cell = item.cell;
          if (!cell?.cellId) continue;

          try {
            const shouldStart = async () => {
              if (cell.pollStartExpType === "Expression") {
                const exp = await findSQL(
                  cell.pollStartExpressionLogic,
                  cell,
                  updatedGridDataTest,
                );
                return eval(exp);
              } else {
                const sql = await findSQL(
                  cell.pollStartExpressionLogic,
                  cell,
                  updatedGridDataTest,
                );
                const sqlRes = await getQueryResultForGlobalCellUpdate(sql);
                return ["1", 1, "true", true].includes(
                  Object.values(sqlRes)[0],
                );
              }
            };

            const shouldStop = async () => {
              if (!cell.pollStopExpressionLogic?.trim()) return false;

              const logic = await findSQL(
                cell.pollStopExpressionLogic,
                cell,
                updatedGridDataTest,
              );

              if (cell.pollStartExpType === "Expression") {
                return eval(logic);
              } else {
                const stopRes = await getQueryResultForGlobalCellUpdate(logic);
                return ["1", 1, "true", true].includes(
                  Object.values(stopRes)[0],
                );
              }
            };

            const start = await shouldStart();
            const stop = await shouldStop();

            setPollObj((prevPolls) =>
              prevPolls.map((poll) =>
                poll.cell.cellId === cell.cellId
                  ? {
                      ...poll,
                      autoRefresh: stop ? false : start,
                      pollInterval: start
                        ? cell.pollInterval
                        : poll.pollInterval,
                    }
                  : poll,
              ),
            );
          } catch (pollError) {
            console.error(
              "❌ [Step 6] Error processing poll for cell:",
              cell.cellId,
              pollError,
            );
          }
        }

        console.log("📦 Step 6: Polling logic complete");
      } catch (error) {
        console.error("❌ [Step 6] Error in polling logic:", error);
      }

      console.log("💾 [FINAL] About to update state with all changes");

      const finalGridData = updatedGridDataTest.map((form) => ({
        ...form,
        cellData: form.cellData.map((c) => ({
          ...c,

          dropDownFields: c.dropDownFields ? [...c.dropDownFields] : [],
        })),
      }));

      console.log("💾 [FINAL] Calling setGridDataTest");
      setGridDataTest(finalGridData);

      console.log("✅ onDateChange complete for:", elem.cellId);
    } catch (error) {
      console.error("❌ Error in onDateChange:", error);
      console.error("❌ Error stack:", error.stack);

      alert(
        `Error processing date change: ${error.message}\n\nCheck console for details.`,
      );
    } finally {
      setLoading(false);
      setIsProcessing(false); // ← Allow re-renders again
    }
  };

  const onDateTimeChange = async (
    e,
    elem,
    gridDataTest,
    setGridDataTest,
    pollObj,
    setPollObj,
  ) => {
    try {
      setIsProcessing(true); // ← Prevent re-renders during async operations
      setLoading(true);

      console.log("🕐 onDateTimeChange triggered for:", elem.cellId);
      console.log("🕐 DateTime picker event:", e);

      if (!e?.value || !gridDataTest) {
        console.warn("⚠️ Invalid datetime input or gridData");
        return;
      }

      const dayjsObj = dayjs(e.value); // PrimeReact provides Date object

      if (!dayjsObj.isValid()) {
        console.warn("❌ Invalid date/time selected");
        return;
      }

      const displayFormat = "DD-MM-YYYY hh:mm:ss A";
      const storageFormat = "YYYY-MM-DD HH:mm:ss";

      const formattedDisplay = dayjsObj.format(displayFormat);
      const formattedStorage = dayjsObj.format(storageFormat);

      console.log("🕐 Formatted display:", formattedDisplay);
      console.log("🕐 Formatted storage:", formattedStorage);

      let updatedGridDataTest = gridDataTest.map((form) => ({
        ...form,
        cellData: form.cellData.map((cell) =>
          cell.cellId === elem.cellId
            ? {
                ...cell,
                value: formattedStorage,
                displayValue: formattedDisplay,
              }
            : cell,
        ),
      }));

      console.log("📦 Step 1: Updated datetime value to:", formattedStorage);
      if (elem.conditionalCssExpression?.trim()) {
        try {
          const logic = await findSQL(
            elem.conditionalCssExpression,
            elem,
            updatedGridDataTest,
          );

          console.log("Logic and cell Id and csstype", logic, elem);
          if (elem.conditionalCssExpType === "Expression") {
            customCss = customCss + executeLogic(logic);
          } else {
            const res = await getQueryResultForGlobalCellUpdate(logic);
            const val = Object.values(res)[0];
            customCss = val;
          }
          console.log(
            "Final Cell with custom css in text Field",
            elem,
            customCss,
          );
          elem.cellCSS = customCss;

          updatedGridDataTest = updatedGridDataTest.map((form) => ({
            ...form,
            cellData: form.cellData.map((cell) =>
              cell.cellId === elem.cellId
                ? { ...cell, cellCSS: customCss }
                : cell,
            ),
          }));
          console.log("Final Cell after update the css", elem);
        } catch (error) {
          console.error(
            `❌ Failed to resolve disabled for ${elem.cellId}`,
            error,
          );
        }
      }

      if (elem.globalExpressionLogic?.trim()) {
        try {
          console.log("🌐 [Step 2] Processing global expression");

          const sql = await findSQL(
            elem.globalExpressionLogic,
            elem,
            updatedGridDataTest,
          );

          console.log("🌐 [Step 2] Global expression SQL:", sql);

          const sqlResult = await getQueryResultForGlobalCellUpdate(sql);
          console.log("🌐 [Step 2] SQL Result:", sqlResult);

          const changedCells = [];

          updatedGridDataTest = updatedGridDataTest.map((form) => ({
            ...form,
            cellData: form.cellData.map((cell) => {
              const newVal =
                sqlResult?.[cell.cellId] ?? sqlResult?.[cell.aliasId];

              if (newVal !== undefined) {
                const isFile = ["Image", "File"].includes(cell.fieldType);
                const hasChanged = isFile
                  ? cell.value !== newVal
                  : cell.value !== newVal;

                if (hasChanged) {
                  console.log(
                    "🌐 [Step 2] Cell changed:",
                    cell.cellId,
                    "from",
                    isFile ? cell.value : cell.value,
                    "to",
                    newVal,
                  );
                  changedCells.push({ ...cell }); // Clone to avoid reference issues

                  return isFile
                    ? { ...cell, value: newVal }
                    : { ...cell, value: newVal };
                }
              }

              return cell;
            }),
          }));

          console.log(
            "📦 Step 2: Applied global expressions, changed cells:",
            changedCells.length,
          );

          for (const changed of changedCells) {
            console.log(
              "🔄 [Step 2] Running passive update for:",
              changed.cellId,
            );

            try {
              const passiveResult = await onPassiveFieldChange(
                changed,
                updatedGridDataTest,
                () => {}, // Don't update state yet
                pollObj,
                setPollObj,
                [elem.cellId],
              );

              if (Array.isArray(passiveResult)) {
                updatedGridDataTest = passiveResult;
                console.log(
                  "✅ [Step 2] Passive update completed for:",
                  changed.cellId,
                );
              }
            } catch (passiveError) {
              console.error(
                "❌ [Step 2] Passive update failed for:",
                changed.cellId,
                passiveError,
              );
            }
          }

          console.log("📦 Step 3: Passive updates complete");
        } catch (error) {
          console.error("❌ [Step 2] Error in global expression logic:", error);
        }
      }

      if (
        Array.isArray(elem.dependentFields) &&
        elem.dependentFields.length > 0
      ) {
        console.log(
          "📌 [Step 4] Processing",
          elem.dependentFields.length,
          "dependent fields SEQUENTIALLY",
        );

        for (let i = 0; i < elem.dependentFields.length; i++) {
          const dep = elem.dependentFields[i];

          console.log(
            `🔄 [Step 4] [${i + 1}/${
              elem.dependentFields.length
            }] Processing dependent field:`,
            dep.cellId,
          );

          try {
            const depResult = await onDependentCellUpdate(
              dep,
              updatedGridDataTest, // ← Use the latest data
              () => {}, // ← Don't update state yet
              [elem.cellId],
              false, // ← Mark as NOT top level
            );

            if (Array.isArray(depResult)) {
              updatedGridDataTest = depResult; // ← Use the result immediately
              console.log(
                `✅ [Step 4] [${i + 1}/${
                  elem.dependentFields.length
                }] Dependent field updated:`,
                dep.cellId,
              );
            } else {
              console.error(
                "⚠️ [Step 4] Dependent update returned invalid data for:",
                dep.cellId,
              );
            }
          } catch (error) {
            console.error(
              `❌ [Step 4] Error processing dependent field ${dep.cellId}:`,
              error,
            );
          }
        }

        console.log("📦 Step 4: All dependent fields processed");
      }

      if (elem.disableExpressionLogic?.trim()) {
        console.log(
          "🔒 [Step 5] Processing disable expression for:",
          elem.cellId,
        );

        try {
          const isExpression = elem.disabledExpType === "Expression";

          const disableVal = isExpression
            ? await (async () => {
                const expr = await findSQL(
                  elem.disableExpressionLogic,
                  elem,
                  updatedGridDataTest,
                );
                console.log("🔒 [Step 5] Disable expression:", expr);
                try {
                  const result = eval(expr);
                  console.log("🔒 [Step 5] Disable expression result:", result);
                  return result;
                } catch (evalError) {
                  console.error("🔒 [Step 5] Eval error:", evalError);
                  return false;
                }
              })()
            : await (async () => {
                const sql = await findSQL(
                  elem.disableExpressionLogic, // ← Fixed: was elem.depExpressionLogic
                  elem,
                  updatedGridDataTest,
                );
                console.log("🔒 [Step 5] Disable SQL:", sql);
                const res = await getQueryResultForGlobalCellUpdate(sql);
                console.log("🔒 [Step 5] Disable SQL Result:", res);
                return res ? Object.values(res)[0] : 0;
              })();

          const isDisabled =
            disableVal === 1 || disableVal === "1" || disableVal === true;

          console.log(
            "🔒 [Step 5] DateTime field will be disabled:",
            isDisabled,
          );

          updatedGridDataTest = updatedGridDataTest.map((form) => ({
            ...form,
            cellData: form.cellData.map((cell) =>
              cell.cellId === elem.cellId
                ? { ...cell, disabled: isDisabled }
                : cell,
            ),
          }));

          console.log("📦 Step 5: Disable logic applied");
        } catch (error) {
          console.error(
            "❌ [Step 5] Error in disable expression logic:",
            error,
          );
        }
      }

      try {
        console.log("⏱️ [Step 6] Processing polling logic");

        for (const item of pollObj ?? []) {
          const cell = item.cell;
          if (!cell?.cellId) continue;

          try {
            const shouldStart = async () => {
              if (cell.pollStartExpType === "Expression") {
                const exp = await findSQL(
                  cell.pollStartExpressionLogic,
                  cell,
                  updatedGridDataTest,
                );
                return eval(exp);
              } else {
                const sql = await findSQL(
                  cell.pollStartExpressionLogic,
                  cell,
                  updatedGridDataTest,
                );
                const sqlRes = await getQueryResultForGlobalCellUpdate(sql);
                return ["1", 1, "true", true].includes(
                  Object.values(sqlRes)[0],
                );
              }
            };

            const shouldStop = async () => {
              if (!cell.pollStopExpressionLogic?.trim()) return false;

              const logic = await findSQL(
                cell.pollStopExpressionLogic,
                cell,
                updatedGridDataTest,
              );

              if (cell.pollStartExpType === "Expression") {
                return eval(logic);
              } else {
                const stopRes = await getQueryResultForGlobalCellUpdate(logic);
                return ["1", 1, "true", true].includes(
                  Object.values(stopRes)[0],
                );
              }
            };

            const start = await shouldStart();
            const stop = await shouldStop();

            setPollObj((prevPolls) =>
              prevPolls.map((poll) =>
                poll.cell.cellId === cell.cellId
                  ? {
                      ...poll,
                      autoRefresh: stop ? false : start,
                      pollInterval: start
                        ? cell.pollInterval
                        : poll.pollInterval,
                    }
                  : poll,
              ),
            );
          } catch (pollError) {
            console.error(
              "❌ [Step 6] Error processing poll for cell:",
              cell.cellId,
              pollError,
            );
          }
        }

        console.log("📦 Step 6: Polling logic complete");
      } catch (error) {
        console.error("❌ [Step 6] Error in polling logic:", error);
      }

      console.log("💾 [FINAL] About to update state with all changes");

      const finalGridData = updatedGridDataTest.map((form) => ({
        ...form,
        cellData: form.cellData.map((c) => ({
          ...c,

          dropDownFields: c.dropDownFields ? [...c.dropDownFields] : [],
        })),
      }));

      console.log("💾 [FINAL] Calling setGridDataTest");
      setGridDataTest(finalGridData);

      console.log("✅ onDateTimeChange complete for:", elem.cellId);
    } catch (error) {
      console.error("❌ Error in onDateTimeChange:", error);
      console.error("❌ Error stack:", error.stack);

      alert(
        `Error processing datetime change: ${error.message}\n\nCheck console for details.`,
      );
    } finally {
      setLoading(false);
      setIsProcessing(false); // ← Allow re-renders again
    }
  };
  const onCommentChange = (e, elem, gridDataTest, setGridDataTest) => {
    setGridDataTest((prevArray) => {
      return prevArray.map((item) => ({
        ...item,
        cellData: item.cellData.map((cell) => {
          if (cell.cellId === elem.cellId) {
            return {
              ...cell,
              value: e.target.value,
            };
          }
          return cell;
        }),
      }));
    });
  };

  const onNumberChange = async (
    e,
    elem,
    gridDataTest,
    setGridDataTest,
    pollObj,
    setPollObj,
  ) => {
    try {
      setIsProcessing(true); // ← Prevent re-renders during async operations
      setLoading(true);

      console.log("🔢 onNumberChange triggered for:", elem.cellId);
      const newValue = e.target.value ? Number(e.target.value) : 0;

      let updatedGridDataTest = gridDataTest.map((form) => ({
        ...form,
        cellData: form.cellData.map((cell) =>
          cell.cellId === elem.cellId ? { ...cell, value: newValue } : cell,
        ),
      }));

      console.log("📦 Step 1: Updated number value to:", newValue);

      if (elem.conditionalCssExpression?.trim()) {
        try {
          const logic = await findSQL(
            elem.conditionalCssExpression,
            elem,
            updatedGridDataTest,
          );

          console.log("Logic and cell Id and csstype", logic, elem);
          if (elem.conditionalCssExpType === "Expression") {
            customCss = customCss + executeLogic(logic);
          } else {
            const res = await getQueryResultForGlobalCellUpdate(logic);
            const val = Object.values(res)[0];
            customCss = val;
          }
          console.log(
            "Final Cell with custom css in text Field",
            elem,
            customCss,
          );
          elem.cellCSS = customCss;

          updatedGridDataTest = updatedGridDataTest.map((form) => ({
            ...form,
            cellData: form.cellData.map((cell) =>
              cell.cellId === elem.cellId
                ? { ...cell, cellCSS: customCss }
                : cell,
            ),
          }));
          console.log("Final Cell after update the css", elem);
        } catch (error) {
          console.error(
            `❌ Failed to resolve disabled for ${elem.cellId}`,
            error,
          );
        }
      }

      if (elem.globalExpressionLogic?.trim()) {
        try {
          console.log("🌐 [Step 2] Processing global expression");

          const sql = await findSQL(
            elem.globalExpressionLogic,
            elem,
            updatedGridDataTest,
          );

          console.log("🌐 [Step 2] Global expression SQL:", sql);

          const sqlResult = await getQueryResultForGlobalCellUpdate(sql);
          console.log("🌐 [Step 2] SQL Result:", sqlResult);

          const changedCells = [];
          updatedGridDataTest = updatedGridDataTest.map((form) => ({
            ...form,
            cellData: form.cellData.map((cell) => {
              const newVal =
                sqlResult?.[cell.cellId] ?? sqlResult?.[cell.aliasId];

              if (newVal !== undefined) {
                const isFile = ["Image", "File"].includes(cell.fieldType);
                const hasChanged = isFile
                  ? cell.value !== newVal
                  : cell.value !== newVal;

                if (hasChanged) {
                  console.log(
                    "🌐 [Step 2] Cell changed:",
                    cell.cellId,
                    "from",
                    isFile ? cell.value : cell.value,
                    "to",
                    newVal,
                  );
                  changedCells.push({ ...cell }); // Clone to avoid reference issues

                  return isFile
                    ? { ...cell, value: newVal }
                    : { ...cell, value: newVal };
                }
              }
              return cell;
            }),
          }));

          console.log(
            "📦 Step 2: Applied global expressions, changed cells:",
            changedCells.length,
          );

          for (const changed of changedCells) {
            console.log(
              "🔄 [Step 2] Running passive update for:",
              changed.cellId,
            );

            try {
              const passiveResult = await onPassiveFieldChange(
                changed,
                updatedGridDataTest,
                () => {}, // Don't update state yet
                pollObj,
                setPollObj,
                [elem.cellId],
              );

              if (Array.isArray(passiveResult)) {
                updatedGridDataTest = passiveResult;
                console.log(
                  "✅ [Step 2] Passive update completed for:",
                  changed.cellId,
                );
              }
            } catch (passiveError) {
              console.error(
                "❌ [Step 2] Passive update failed for:",
                changed.cellId,
                passiveError,
              );
            }
          }

          console.log("📦 Step 3: Passive updates complete");
        } catch (error) {
          console.error("❌ [Step 2] Error in global expression logic:", error);
        }
      }

      if (
        Array.isArray(elem.dependentFields) &&
        elem.dependentFields.length > 0
      ) {
        console.log(
          "📌 [Step 4] Processing",
          elem.dependentFields.length,
          "dependent fields SEQUENTIALLY",
        );

        for (let i = 0; i < elem.dependentFields.length; i++) {
          const depField = elem.dependentFields[i];

          console.log(
            `🔄 [Step 4] [${i + 1}/${
              elem.dependentFields.length
            }] Processing dependent field:`,
            depField.cellId,
          );

          try {
            const depResult = await onDependentCellUpdate(
              depField,
              updatedGridDataTest, // ← Use the latest data
              () => {}, // ← Don't update state yet
              [elem.cellId],
              false, // ← Mark as NOT top level
            );

            if (Array.isArray(depResult)) {
              updatedGridDataTest = depResult; // ← Use the result immediately
              console.log(
                `✅ [Step 4] [${i + 1}/${
                  elem.dependentFields.length
                }] Dependent field updated:`,
                depField.cellId,
              );
            } else {
              console.error(
                "⚠️ [Step 4] Dependent update returned invalid data for:",
                depField.cellId,
              );
            }
          } catch (error) {
            console.error(
              `❌ [Step 4] Error processing dependent field ${depField.cellId}:`,
              error,
            );
          }
        }

        console.log("📦 Step 4: All dependent fields processed");
      }

      if (elem.disableExpressionLogic?.trim()) {
        console.log(
          "🔒 [Step 5] Processing disable expression for:",
          elem.cellId,
        );

        try {
          const isExpr = elem.disabledExpType === "Expression";

          const disableVal = isExpr
            ? await (async () => {
                const expr = await findSQL(
                  elem.disableExpressionLogic,
                  elem,
                  updatedGridDataTest,
                );
                console.log("🔒 [Step 5] Disable expression:", expr);
                try {
                  const result = eval(expr);
                  console.log("🔒 [Step 5] Disable expression result:", result);
                  return result;
                } catch (evalError) {
                  console.error("🔒 [Step 5] Eval error:", evalError);
                  return false;
                }
              })()
            : await (async () => {
                const sql = await findSQL(
                  elem.disableExpressionLogic, // ← Fixed: was elem.depExpressionLogic
                  elem,
                  updatedGridDataTest,
                );
                console.log("🔒 [Step 5] Disable SQL:", sql);
                const res = await getQueryResultForGlobalCellUpdate(sql);
                console.log("🔒 [Step 5] Disable SQL Result:", res);
                return res ? Object.values(res)[0] : 0;
              })();

          const isDisabled =
            disableVal === 1 || disableVal === "1" || disableVal === true;

          console.log("🔒 [Step 5] Number field will be disabled:", isDisabled);

          updatedGridDataTest = updatedGridDataTest.map((form) => ({
            ...form,
            cellData: form.cellData.map((cell) =>
              cell.cellId === elem.cellId
                ? { ...cell, disabled: isDisabled }
                : cell,
            ),
          }));

          console.log("📦 Step 5: Disable logic applied");
        } catch (error) {
          console.error(
            "❌ [Step 5] Error in disable expression logic:",
            error,
          );
        }
      }

      try {
        console.log("⏱️ [Step 6] Processing polling logic");

        for (const item of pollObj ?? []) {
          const cell = item.cell;
          if (!cell?.cellId) continue;

          try {
            const shouldStart = async () => {
              if (cell.pollStartExpType === "Expression") {
                const exp = await findSQL(
                  cell.pollStartExpressionLogic,
                  cell,
                  updatedGridDataTest,
                );
                return eval(exp);
              } else {
                const sql = await findSQL(
                  cell.pollStartExpressionLogic,
                  cell,
                  updatedGridDataTest,
                );
                const sqlRes = await getQueryResultForGlobalCellUpdate(sql);
                return ["1", 1, "true", true].includes(
                  Object.values(sqlRes)[0],
                );
              }
            };

            const shouldStop = async () => {
              if (!cell.pollStopExpressionLogic?.trim()) return false;

              const logic = await findSQL(
                cell.pollStopExpressionLogic,
                cell,
                updatedGridDataTest,
              );

              if (cell.pollStartExpType === "Expression") {
                return eval(logic);
              } else {
                const stopRes = await getQueryResultForGlobalCellUpdate(logic);
                return ["1", 1, "true", true].includes(
                  Object.values(stopRes)[0],
                );
              }
            };

            const start = await shouldStart();
            const stop = await shouldStop();

            setPollObj((prevPolls) =>
              prevPolls.map((poll) =>
                poll.cell.cellId === cell.cellId
                  ? {
                      ...poll,
                      autoRefresh: stop ? false : start,
                      pollInterval: start
                        ? cell.pollInterval
                        : poll.pollInterval,
                    }
                  : poll,
              ),
            );
          } catch (pollError) {
            console.error(
              "❌ [Step 6] Error processing poll for cell:",
              cell.cellId,
              pollError,
            );
          }
        }

        console.log("📦 Step 6: Polling logic complete");
      } catch (error) {
        console.error("❌ [Step 6] Error in polling logic:", error);
      }

      console.log("💾 [FINAL] About to update state with all changes");

      const finalGridData = updatedGridDataTest.map((form) => ({
        ...form,
        cellData: form.cellData.map((c) => ({
          ...c,

          dropDownFields: c.dropDownFields ? [...c.dropDownFields] : [],
        })),
      }));

      console.log("💾 [FINAL] Calling setGridDataTest");
      setGridDataTest(finalGridData);

      console.log("✅ onNumberChange complete for:", elem.cellId);
    } catch (error) {
      console.error("❌ Error in onNumberChange:", error);
      console.error("❌ Error stack:", error.stack);

      alert(
        `Error processing number change: ${error.message}\n\nCheck console for details.`,
      );
    } finally {
      setLoading(false);
      setIsProcessing(false); // ← Allow re-renders again
    }
  };
  const onValueNumberChange = (e, elem, gridDataTest, setGridDataTest) => {
    console.log("Elem for number : ", elem);
    let value = e.target.value;

    if (elem.decimalPoints !== undefined && elem.decimalPoints > 0) {
      const regex = new RegExp(`^\\d*(\\.\\d{0,${elem.decimalPoints}})?$`);
      if (!regex.test(value)) {
        return;
      }
    }

    const updatedGridDataTest = gridDataTest.map((item) => ({
      ...item,
      cellData: item.cellData.map((cell) =>
        cell.cellId === elem.cellId ? { ...cell, value: value } : cell,
      ),
    }));

    setGridDataTest(updatedGridDataTest); // Immediate updates for real-time feedback
  };

  const executeLogic = (logic) => {
    try {
      const transformedLogic = logic.replace(
        /`([\s\S]*?)`/g,
        (_, content) => `{
        if(!__result){
          __result = \`${content}\`;
        }
      }`,
      );

      const fn = new Function(`
      "use strict";
      let __result = '';
      ${transformedLogic}
      return __result;
    `);

      console.log("result of css logic : ", fn().trim());
      return fn().trim();
    } catch (e) {
      console.error("Execution error:", e);
      return "";
    }
  };

  const onTextChange = async (
    e,
    elem,
    gridDataTest,
    setGridDataTest,
    pollObj,
    setPollObj,
  ) => {
    try {
      setIsProcessing(true);
      setLoading(true);

      console.log("📝 onTextChange triggered for:", elem.cellId);
      const newValue = e.target.value;

      let updatedGridDataTest = gridDataTest.map((form) => ({
        ...form,
        cellData: form.cellData.map((cell) =>
          cell.cellId === elem.cellId ? { ...cell, value: newValue } : cell,
        ),
      }));
      console.log(
        "📦 Step 1: Updated current cell value:",
        updatedGridDataTest,
      );
      console.log(
        "Elem in Text change : ",
        elem,
        " condtion : ",
        elem.conditionalCssExpression?.trim(),
      );
      if (elem.conditionalCssExpression?.trim()) {
        try {
          const logic = await findSQL(
            elem.conditionalCssExpression,
            elem,
            updatedGridDataTest,
          );

          console.log("Logic and cell Id and csstype", logic, elem);
          if (elem.conditionalCssExpType === "Expression") {
            customCss = customCss + executeLogic(logic);
          } else {
            const res = await getQueryResultForGlobalCellUpdate(logic);
            const val = Object.values(res)[0];
            customCss = val;
          }
          console.log(
            "Final Cell with custom css in text Field",
            elem,
            customCss,
          );
          elem.cellCSS = customCss;

          updatedGridDataTest = updatedGridDataTest.map((form) => ({
            ...form,
            cellData: form.cellData.map((cell) =>
              cell.cellId === elem.cellId
                ? { ...cell, cellCSS: customCss }
                : cell,
            ),
          }));
          console.log("Final Cell after update the css", elem);
        } catch (error) {
          console.error(
            `❌ Failed to resolve disabled for ${elem.cellId}`,
            error,
          );
        }
      }

      if (elem.globalExpressionLogic?.trim()) {
        const sql = await findSQL(
          elem.globalExpressionLogic,
          elem,
          updatedGridDataTest,
        );
        const sqlResult = await getQueryResultForGlobalCellUpdate(sql);
        console.log("🌐 [Global Expression SQL]", sql);
        console.log("🧩 Result =>", sqlResult);

        const changedCells = [];
        updatedGridDataTest = updatedGridDataTest.map((form) => ({
          ...form,
          cellData: form.cellData.map((cell) => {
            const newVal =
              sqlResult?.[cell.cellId] ?? sqlResult?.[cell.aliasId];
            if (newVal !== undefined) {
              const isFile = ["Image", "File"].includes(cell.fieldType);
              const hasChanged = isFile
                ? cell.value !== newVal
                : cell.value !== newVal;

              if (hasChanged) {
                changedCells.push({ ...cell }); // Clone to avoid reference issues
                return {
                  ...cell,
                  ...(isFile ? { value: newVal } : { value: newVal }),
                };
              }
            }
            return cell;
          }),
        }));
        console.log(
          "📦 Step 2: Applied global expressions:",
          updatedGridDataTest,
        );

        for (const changed of changedCells) {
          console.log("🔄 Running passive update for:", changed.cellId);
          const passiveResult = await onPassiveFieldChange(
            changed,
            updatedGridDataTest,
            () => {}, // Don't update state yet
            pollObj,
            setPollObj,
            [elem.cellId],
          );

          if (Array.isArray(passiveResult)) {
            updatedGridDataTest = passiveResult;
          }
        }
        console.log(
          "📦 Step 3: Passive updates complete:",
          updatedGridDataTest,
        );
      }

      if (
        Array.isArray(elem.dependentFields) &&
        elem.dependentFields.length > 0
      ) {
        console.log(
          "🔄 Processing",
          elem.dependentFields.length,
          "dependent fields",
        );

        for (const dep of elem.dependentFields) {
          console.log("🔄 Processing dependent field:", dep.cellId);

          const depResult = await onDependentCellUpdate(
            dep,
            updatedGridDataTest, // ← Pass the latest data
            () => {}, // ← Don't update state yet
            [elem.cellId],
            false, // ← Mark as NOT top level
          );

          if (Array.isArray(depResult)) {
            updatedGridDataTest = depResult;
            console.log("✅ Dependent field updated:", dep.cellId);
          }
        }

        console.log(
          "📦 Step 4: All dependent fields processed:",
          updatedGridDataTest,
        );
      }

      if (elem.disableExpressionLogic?.trim()) {
        console.log("🔒 Processing disable expression for:", elem.cellId);
        const isExpr = elem.disabledExpType === "Expression";

        const disableVal = isExpr
          ? eval(
              await findSQL(
                elem.disableExpressionLogic,
                elem,
                updatedGridDataTest,
              ),
            )
          : await (async () => {
              const sql = await findSQL(
                elem.disableExpressionLogic,
                elem,
                updatedGridDataTest,
              );
              console.log("🔒 Disable SQL:", sql);
              const sqlRes = await getQueryResultForGlobalCellUpdate(sql);
              console.log("🔒 Disable SQL Result:", sqlRes);
              return sqlRes ? Object.values(sqlRes)[0] : 0;
            })();

        const isDisabled =
          disableVal === 1 || disableVal === "1" || disableVal === true;
        console.log("🔒 Field will be disabled:", isDisabled);

        updatedGridDataTest = updatedGridDataTest.map((form) => ({
          ...form,
          cellData: form.cellData.map((cell) =>
            cell.cellId === elem.cellId
              ? { ...cell, disabled: isDisabled }
              : cell,
          ),
        }));
        console.log("📦 Step 5: Disable logic applied:", updatedGridDataTest);
      }

      for (const item of pollObj) {
        const { cell } = item;
        if (!cell?.cellId) continue;

        const shouldStart = async () => {
          if (cell.pollStartExpType === "Expression") {
            const exp = await findSQL(
              cell.pollStartExpressionLogic,
              cell,
              updatedGridDataTest,
            );
            return eval(exp);
          }

          const sql = await findSQL(
            cell.pollStartExpressionLogic,
            cell,
            updatedGridDataTest,
          );
          const sqlRes = await getQueryResultForGlobalCellUpdate(sql);
          const result = sqlRes ? Object.values(sqlRes)[0] : 0;
          return result === 1 || result === "1" || result === true;
        };

        const shouldStop = async () => {
          if (!cell.pollStopExpressionLogic) return false;

          const expOrSql = await findSQL(
            cell.pollStopExpressionLogic,
            cell,
            updatedGridDataTest,
          );

          if (cell.pollStartExpType === "Expression") {
            return eval(expOrSql);
          } else {
            const sqlRes = await getQueryResultForGlobalCellUpdate(expOrSql);
            const result = sqlRes ? Object.values(sqlRes)[0] : 0;
            return result === 1 || result === "1" || result === true;
          }
        };

        const start = await shouldStart();
        const stop = await shouldStop();

        setPollObj((prevState) =>
          prevState.map((poll) =>
            poll.cell.cellId === cell.cellId
              ? {
                  ...poll,
                  autoRefresh: stop ? false : start,
                  pollInterval: start ? cell.pollInterval : poll.pollInterval,
                }
              : poll,
          ),
        );
      }

      console.log(
        "💾 Final state update with all changes:",
        updatedGridDataTest,
      );
      setGridDataTest(
        updatedGridDataTest.map((form) => ({
          ...form,
          cellData: form.cellData.map((c) => ({ ...c })),
        })),
      );

      console.log("✅ onTextChange complete for:", elem.cellId);
    } catch (error) {
      console.error("❌ Error in onTextChange:", error);
      console.error("Stack:", error.stack);
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  };

  const onValueTextChange = async (e, elem, gridDataTest, setGridDataTest) => {
    const updatedGridDataTest = gridDataTest.map((item) => ({
      ...item,
      cellData: item.cellData.map((cell) =>
        cell.cellId === elem.cellId ? { ...cell, value: e.target.value } : cell,
      ),
    }));
    console.log(
      "upadetd gridDataTest  in onValueTextChange : ",
      updatedGridDataTest,
    );
    await setGridDataTest(updatedGridDataTest); // Update state without async/await for real-time typing
  };

  const onCellValueChange2 = async (e, elem, gridDataTest, setGridDataTest) => {
    if (elem.fieldType === "Dropdown") {
      let updatedGridDataTest = gridDataTest.map((item) => ({
        ...item,
        cellData: item.cellData.map((cell) => {
          if (cell.cellId === elem.cellId) {
            return {
              ...cell,
              value: e.target.value,
            };
          }
          return cell;
        }),
      }));
      setGridDataTest(updatedGridDataTest);

      if (elem.globalExpressionLogic) {
        const sql = await findSQL(
          elem.globalExpressionLogic,
          elem,
          updatedGridDataTest,
        );
        const sqltest = await getQueryResultForGlobalCellUpdate(sql);

        updatedGridDataTest = updatedGridDataTest.map((item) => ({
          ...item,
          cellData: item.cellData.map((cell) => {
            if (
              sqltest.hasOwnProperty(cell.cellId) ||
              sqltest.hasOwnProperty(cell.aliasId)
            ) {
              return {
                ...cell,
                value:
                  sqltest[cell.cellId] !== undefined
                    ? sqltest[cell.cellId]
                    : sqltest[cell.aliasId],
              };
            }
            return cell;
          }),
        }));
        setGridDataTest(updatedGridDataTest);
      }
      if (elem.dependentFields) {
        elem.dependentFields.map(async (item, index) => {
          if (item.depExpressionLogic) {
            const sql = await findSQL(
              item.depExpressionLogic,
              item,
              updatedGridDataTest,
            );
            const sqlres = await getQueryResultForGlobalCellUpdate(sql);
            updatedGridDataTest = updatedGridDataTest.map((i) => ({
              ...i,
              cellData: i.cellData.map((cell) => {
                if (cell.cellId === item.cellId) {
                  return {
                    ...cell,
                    value: Object.values(sqlres)[0],
                  };
                }
                return cell;
              }),
            }));
            setGridDataTest(updatedGridDataTest);
          }
        });
      }
    }
  };

  const processDependentFields = async (dependentFields, updatedGridData) => {
    console.log("DepeFields in processDependentFields: ", dependentFields);
    for (const item of dependentFields) {
      try {
        if (item.depExpressionLogic) {
          const sql = await findSQL(
            item.depExpressionLogic,
            item,
            updatedGridData,
          );
          console.log("Dropdown Sql:", sql);

          const sqlres =
            item.fieldType === "Dropdown"
              ? await getQueryResult(sql)
              : await getQueryResultForGlobalCellUpdate(sql);

          updatedGridData = updatedGridData.map((i) => ({
            ...i,
            cellData: i.cellData.map((cell) => {
              if (cell.cellId === item.cellId) {
                return item.fieldType === "Dropdown"
                  ? { ...cell, dropDownFields: sqlres }
                  : {
                      ...cell,
                      value: sqlres ? Object.values(sqlres)[0] : " ",
                    };
              }
              return cell;
            }),
          }));

          console.log("My Item in Dropdown : ", item);
          if (item.dependentFields) {
            updatedGridData = await processDependentFields(
              item.dependentFields,
              updatedGridData,
            );
          }
        }

        if (item.disableExpressionLogic) {
          if (item.disabledExpType === "Expression") {
            console.log("Expression is true: ", item);
            let exp = await findSQL(
              item.disableExpressionLogic,
              item,
              updatedGridData,
            );
            console.log("final disable exp item : ", item);
            console.log("final disable exp : ", exp);
            let expop = eval(exp);

            console.log("my expop : ", expop);
            console.log(
              "my expop status : ",
              expop === "1" || expop ? true : false,
            );
            item.disabled = expop === "1" || expop ? true : false;
            const updatedData = updatedGridData?.map((form) => ({
              ...form,
              cellData: form.cellData.map(
                (c) =>
                  c.cellId === item.cellId
                    ? {
                        ...c,
                        disabled: expop === "1" || expop ? true : false,
                      } // Update the object with the new cellName
                    : c, // Keep the original object if condition is not met
              ),
            }));
            console.log("final updated data : ", updatedData);

            updatedGridData = updatedData;
          } else {
            let disableSql = item.disableExpressionLogic.trim();
            console.log("disable sql : ", disableSql);
            if (disableSql.length) {
              let sql = await findSQL(
                item.disableExpressionLogic,
                item,
                updatedGridData,
              );
              console.log("outer final sql is : ", sql);
              let sqlRes = await getQueryResultForGlobalCellUpdate(sql);
              console.log("my new sqlRes : ", sqlRes);
              let disabled = sqlRes ? Object.values(sqlRes)[0] : 0;
              console.log("disabled : ", disabled);
              item.disabled =
                disabled === 1 ||
                disabled === "1" ||
                disabled === "true" ||
                disabled === true;
              console.log(
                "disabeled status : ",
                disabled === 1 ||
                  disabled === "1" ||
                  disabled === "true" ||
                  disabled === true,
              );
              console.log("final item : ", item);
              const updatedData = updatedGridData?.map((form) => ({
                ...form,
                cellData: form.cellData.map(
                  (c) =>
                    c.cellId === item.cellId
                      ? {
                          ...c,
                          disabled:
                            disabled === 1 ||
                            disabled === "1" ||
                            disabled === "true" ||
                            disabled === "" ||
                            disabled === true,
                        } // Update the object with the new cellName
                      : c, // Keep the original object if condition is not met
                ),
              }));
              console.log("final updated data : ", updatedData);

              updatedGridData = updatedData;
            }
          }
        }
      } catch (error) {
        console.error("Error processing dependent field:", item, error);
      }
    }

    return updatedGridData;
  };

  // ----------------------------------------------------
  // EXCEL EXPORT HELPERS
  // ----------------------------------------------------

  // 1. Helper to extract display value based on field type
  // Helper to extract display value with fallback to aliasId if value is not present
  const getExcelCellDisplayValue = (elem) => {
    if (!elem) return "";

    // Fallback if value is missing/empty
    const fallback =
      elem.aliasId !== null && elem.aliasId !== undefined
        ? String(elem.aliasId)
        : "";

    switch (elem.fieldType) {
      case "Boolean":
        if (elem.value === true || elem.value === "true" || elem.value === 1) {
          return "Yes";
        }
        if (
          elem.value === false ||
          elem.value === "false" ||
          elem.value === 0
        ) {
          return "No";
        }
        return fallback;

      case "Dropdown":
        if (
          elem.value !== null &&
          elem.value !== undefined &&
          elem.value !== ""
        ) {
          const matchedOption = elem.dropDownFields?.find(
            (opt) =>
              String(opt.itemValue).toLowerCase() ===
              String(elem.value).toLowerCase(),
          );
          return matchedOption?.itemLabel || String(elem.value);
        }
        return fallback;

      case "File":
        return elem.imagePath || (elem.value ? "Attached File" : fallback);

      case "Image":
        return elem.imagePath || fallback || "Image";

      case "Button":
        return elem.buttonKeyValue || elem.aliasId || "Button";

      case "URL":
        return elem.url || elem.value || fallback;

      case "Number":
        if (
          elem.value !== null &&
          elem.value !== undefined &&
          elem.value !== ""
        ) {
          const num = Number(elem.value);
          return isNaN(num) ? String(elem.value) : num;
        }
        return fallback;

      default:
        if (
          elem.value !== null &&
          elem.value !== undefined &&
          elem.value !== ""
        ) {
          return String(elem.value);
        }
        return fallback;
    }
  };

  // 2. Helper to parse CSS string to xlsx-js-style format
  const parseCssToExcelStyle = (cssString, isHeader = false) => {
    const style = {
      font: {
        name: "Calibri",
        sz: 11,
        color: { rgb: "000000" },
        bold: isHeader,
      },
      alignment: {
        vertical: "center",
        horizontal: "center",
        wrapText: true,
      },
      border: {
        top: { style: "thin", color: { rgb: "CCCCCC" } },
        bottom: { style: "thin", color: { rgb: "CCCCCC" } },
        left: { style: "thin", color: { rgb: "CCCCCC" } },
        right: { style: "thin", color: { rgb: "CCCCCC" } },
      },
    };

    if (!cssString) return style;

    const rules = cssString.split(";");
    rules.forEach((rule) => {
      const [prop, val] = rule.split(":").map((s) => s?.trim()?.toLowerCase());
      if (!prop || !val) return;

      // Text Alignment
      if (prop === "text-align") {
        if (["left", "center", "right"].includes(val)) {
          style.alignment.horizontal = val;
        }
      }

      // Font Weight
      if (prop === "font-weight" && (val === "bold" || parseInt(val) >= 600)) {
        style.font.bold = true;
      }

      // Font Color (Hex)
      if (prop === "color" && val.startsWith("#")) {
        const hex = val.replace("#", "").toUpperCase();
        if (hex.length === 6) style.font.color = { rgb: hex };
      }

      // Background Color (Hex)
      if (
        (prop === "background-color" || prop === "background") &&
        val.startsWith("#")
      ) {
        const hex = val.replace("#", "").toUpperCase();
        if (hex.length === 6) {
          style.fill = {
            patternType: "solid",
            fgColor: { rgb: hex },
          };
        }
      }
    });

    return style;
  };

  // 3. Main Export Handler
  const handleDownloadGridExcel = () => {
    try {
      const currentGrid = gridDataRef.current?.length
        ? gridDataRef.current
        : gridDataTest;

      if (!currentGrid || currentGrid.length === 0) {
        setsnackbarSeverity("error");
        setSnackbarText("No grid data available to download");
        setSnackbarOpen(true);
        return;
      }

      const allCells = currentGrid.flatMap((row) => row.cellData || []);

      if (allCells.length === 0) {
        setsnackbarSeverity("error");
        setSnackbarText("No cell data found");
        setSnackbarOpen(true);
        return;
      }

      // Calculate max row and max column
      let maxRow = 1;
      let maxCol = 1;

      allCells.forEach((cell) => {
        const r =
          (parseInt(cell.rowNum, 10) || 1) +
          (parseInt(cell.rowSpan, 10) || 1) -
          1;
        const c =
          (parseInt(cell.colNum, 10) || 1) +
          (parseInt(cell.colSpan, 10) || 1) -
          1;
        if (r > maxRow) maxRow = r;
        if (c > maxCol) maxCol = c;
      });

      const worksheet = {};
      const merges = [];
      const colWidths = Array(maxCol).fill(16); // Default column width

      // Initialize blank cells with borders across the whole grid
      for (let r = 0; r < maxRow; r++) {
        for (let c = 0; c < maxCol; c++) {
          const cellAddress = XLSX.utils.encode_cell({ r, c });
          worksheet[cellAddress] = {
            v: "",
            t: "s",
            s: {
              border: {
                top: { style: "thin", color: { rgb: "E0E0E0" } },
                bottom: { style: "thin", color: { rgb: "E0E0E0" } },
                left: { style: "thin", color: { rgb: "E0E0E0" } },
                right: { style: "thin", color: { rgb: "E0E0E0" } },
              },
            },
          };
        }
      }

      // Populate each grid cell
      allCells.forEach((cell) => {
        const rowStart = (parseInt(cell.rowNum, 10) || 1) - 1;
        const colStart = (parseInt(cell.colNum, 10) || 1) - 1;
        const rowSpan = parseInt(cell.rowSpan, 10) || 1;
        const colSpan = parseInt(cell.colSpan, 10) || 1;
        const rowEnd = rowStart + rowSpan - 1;
        const colEnd = colStart + colSpan - 1;

        const rawVal = getExcelCellDisplayValue(cell);
        const isNumber = typeof rawVal === "number";
        const cellStyle = parseCssToExcelStyle(cell.cellCSS, !cell.editable);

        // Handle Merges if cell spans multiple rows or columns
        if (rowSpan > 1 || colSpan > 1) {
          merges.push({
            s: { r: rowStart, c: colStart },
            e: { r: rowEnd, c: colEnd },
          });

          // Apply style across all cells in merge block for clean borders
          for (let r = rowStart; r <= rowEnd; r++) {
            for (let c = colStart; c <= colEnd; c++) {
              const addr = XLSX.utils.encode_cell({ r, c });
              worksheet[addr] = {
                v: r === rowStart && c === colStart ? rawVal : "",
                t: isNumber && r === rowStart && c === colStart ? "n" : "s",
                s: cellStyle,
              };
            }
          }
        } else {
          const cellAddress = XLSX.utils.encode_cell({
            r: rowStart,
            c: colStart,
          });
          worksheet[cellAddress] = {
            v: rawVal,
            t: isNumber ? "n" : "s",
            s: cellStyle,
          };
        }

        // Adjust column width for content
        const textLen = String(rawVal || "").length;
        if (textLen > colWidths[colStart]) {
          colWidths[colStart] = Math.min(Math.max(textLen + 4, 16), 50);
        }
      });

      // Set worksheet range, merges, and column widths
      worksheet["!ref"] = XLSX.utils.encode_range({
        s: { r: 0, c: 0 },
        e: { r: maxRow - 1, c: maxCol - 1 },
      });
      worksheet["!merges"] = merges;
      worksheet["!cols"] = colWidths.map((w) => ({ wch: w }));

      // Create workbook and download file
      const workbook = XLSX.utils.book_new();
      const sheetTitle = (formName || "Logbook").substring(0, 31);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetTitle);

      const fileName = `${formName || "Logbook"}_v${versionNumber || "1"}_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      setsnackbarSeverity("success");
      setSnackbarText("Excel downloaded successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.error(
        "❌ [handleDownloadGridExcel] Error downloading Excel:",
        error,
      );
      setsnackbarSeverity("error");
      setSnackbarText("Failed to generate Excel file");
      setSnackbarOpen(true);
    }
  };

  const handleRefreshDropdown = async (elem) => {
    try {
      console.log(
        "🔄 [handleRefreshDropdown] Refreshing dropdown for:",
        elem.cellId,
      );

      if (!elem.depExpressionLogic?.trim()) {
        console.warn(
          "⚠️ [handleRefreshDropdown] No depExpressionLogic for:",
          elem.cellId,
        );
        return;
      }

      // Resolve the SQL query with current grid values
      const sql = await findSQL(
        elem.depExpressionLogic,
        elem,
        gridDataRef.current,
      );

      console.log("🔄 [handleRefreshDropdown] Resolved SQL:", sql);

      // Fetch fresh dropdown options
      const freshOptions = await getQueryResult(sql);

      console.log(
        "🔄 [handleRefreshDropdown] Fresh options fetched:",
        freshOptions,
      );

      // Update only this cell's dropDownFields and clear its value
      setGridDataTest((prevGrid) =>
        prevGrid.map((form) => ({
          ...form,
          cellData: form.cellData.map((cell) =>
            cell.cellId === elem.cellId
              ? {
                  ...cell,
                  dropDownFields: Array.isArray(freshOptions)
                    ? freshOptions
                    : [],
                  value: "", // Clear selected value
                }
              : cell,
          ),
        })),
      );

      console.log(
        "✅ [handleRefreshDropdown] Dropdown refreshed for:",
        elem.cellId,
      );
    } catch (error) {
      console.error(
        "❌ [handleRefreshDropdown] Error refreshing dropdown:",
        error,
      );
      setsnackbarSeverity("error");
      setSnackbarText("Error refreshing dropdown options");
      setSnackbarOpen(true);
    }
  };
  const onCellValueChange = async (
    e,
    elem,
    gridDataTest,
    setGridDataTest,
    pollObj,
    setPollObj,
  ) => {
    try {
      setIsProcessing(true);
      setLoading(true);

      console.log("🟣 onCellValueChange triggered for:", elem.cellId);
      const newValue = e.target.value !== undefined ? e.target.value : "";
      console.log("🟣 New value:", newValue);

      let updatedGridDataTest = gridDataTest.map((form) => ({
        ...form,
        cellData: form.cellData.map((cell) =>
          cell.cellId === elem.cellId ? { ...cell, value: newValue } : cell,
        ),
      }));

      console.log("📦 Step 1: Updated dropdown value to:", newValue);
      console.log(
        "📦 Step 1: Current dropdown fields:",
        updatedGridDataTest.flatMap((f) =>
          f.cellData
            .filter((c) => c.fieldType === "Dropdown")
            .map((c) => ({
              cellId: c.cellId,
              count: c.dropDownFields?.length || 0,
            })),
        ),
      );

      if (elem.conditionalCssExpression?.trim()) {
        try {
          const logic = await findSQL(
            elem.conditionalCssExpression,
            elem,
            updatedGridDataTest,
          );

          console.log("Logic and cell Id and csstype", logic, elem);
          if (elem.conditionalCssExpType === "Expression") {
            customCss = customCss + executeLogic(logic);
          } else {
            const res = await getQueryResultForGlobalCellUpdate(logic);
            const val = Object.values(res)[0];
            customCss = val;
          }
          console.log(
            "Final Cell with custom css in text Field",
            elem,
            customCss,
          );
          elem.cellCSS = customCss;

          updatedGridDataTest = updatedGridDataTest.map((form) => ({
            ...form,
            cellData: form.cellData.map((cell) =>
              cell.cellId === elem.cellId
                ? { ...cell, cellCSS: customCss }
                : cell,
            ),
          }));
          console.log("Final Cell after update the css", elem);
        } catch (error) {
          console.error(
            `❌ Failed to resolve disabled for ${elem.cellId}`,
            error,
          );
        }
      }

      if (elem.globalExpressionLogic?.trim()) {
        try {
          console.log("🌐 [Step 2] Processing global expression");

          const sql = await findSQL(
            elem.globalExpressionLogic,
            elem,
            updatedGridDataTest,
          );

          console.log("🌐 [Step 2] Global expression SQL:", sql);

          const sqlResult = await getQueryResultForGlobalCellUpdate(sql);
          console.log("🌐 [Step 2] SQL Result:", sqlResult);

          const changedCells = [];

          updatedGridDataTest = updatedGridDataTest.map((form) => ({
            ...form,
            cellData: form.cellData.map((cell) => {
              const newVal =
                sqlResult?.[cell.cellId] ?? sqlResult?.[cell.aliasId];

              if (newVal !== undefined) {
                const isFile = ["File", "Image"].includes(cell.fieldType);
                const hasChanged = isFile
                  ? cell.value !== newVal
                  : cell.value !== newVal;

                if (hasChanged) {
                  console.log(
                    "🌐 [Step 2] Cell changed:",
                    cell.cellId,
                    "from",
                    isFile ? cell.value : cell.value,
                    "to",
                    newVal,
                  );
                  changedCells.push({ ...cell });

                  return isFile
                    ? { ...cell, value: newVal }
                    : { ...cell, value: newVal };
                }
              }
              return cell;
            }),
          }));

          console.log(
            "📦 Step 2: Applied global expressions, changed cells:",
            changedCells.length,
          );

          for (const changed of changedCells) {
            console.log(
              "🔄 [Step 2] Running passive update for:",
              changed.cellId,
            );

            try {
              const passiveResult = await onPassiveFieldChange(
                changed,
                updatedGridDataTest,
                () => {},
                pollObj,
                setPollObj,
                [elem.cellId],
              );

              if (Array.isArray(passiveResult)) {
                updatedGridDataTest = passiveResult;
                console.log(
                  "✅ [Step 2] Passive update completed for:",
                  changed.cellId,
                );
              }
            } catch (passiveError) {
              console.error(
                "❌ [Step 2] Passive update failed for:",
                changed.cellId,
                passiveError,
              );
            }
          }

          console.log("📦 Step 3: Passive updates complete");
        } catch (error) {
          console.error("❌ [Step 2] Error in global expression logic:", error);
        }
      }

      if (elem.dependentFields?.length > 0) {
        console.log(
          "📌 [Step 4] Processing",
          elem.dependentFields.length,
          "dependent fields SEQUENTIALLY",
        );

        for (let i = 0; i < elem.dependentFields.length; i++) {
          const dep = elem.dependentFields[i];

          console.log(
            `🔄 [Step 4] [${i + 1}/${
              elem.dependentFields.length
            }] Processing dependent field:`,
            dep.cellId,
          );

          const beforeState = updatedGridDataTest.flatMap((f) =>
            f.cellData
              .filter((c) => c.fieldType === "Dropdown")
              .map((c) => ({
                cellId: c.cellId,
                count: c.dropDownFields?.length || 0,
              })),
          );
          console.log(
            `🔄 [Step 4] BEFORE processing ${dep.cellId}, dropdown fields:`,
            beforeState,
          );

          try {
            const result = await onDependentCellUpdate(
              dep,
              updatedGridDataTest,
              () => {},
              [elem.cellId],
              false,
            );

            console.log(`🔄 [Step 4] Result received for ${dep.cellId}:`, {
              isArray: Array.isArray(result),
              length: result?.length,
              type: typeof result,
            });

            if (Array.isArray(result) && result.length > 0) {
              updatedGridDataTest = result;

              const afterState = updatedGridDataTest.flatMap((f) =>
                f.cellData
                  .filter((c) => c.fieldType === "Dropdown")
                  .map((c) => ({
                    cellId: c.cellId,
                    count: c.dropDownFields?.length || 0,
                    sample: c.dropDownFields?.[0],
                  })),
              );
              console.log(
                `✅ [Step 4] [${i + 1}/${
                  elem.dependentFields.length
                }] AFTER processing ${dep.cellId}, dropdown fields:`,
                afterState,
              );
            } else {
              console.error(
                `❌ [Step 4] Invalid result from onDependentCellUpdate for ${dep.cellId}:`,
                result,
              );
            }
          } catch (error) {
            console.error(
              `❌ [Step 4] Error processing dependent field ${dep.cellId}:`,
              error,
            );
            console.error(`❌ [Step 4] Error stack:`, error.stack);
          }
        }

        console.log("📦 Step 4: All dependent fields processed");

        const finalDependentState = updatedGridDataTest.flatMap((f) =>
          f.cellData
            .filter((c) => c.fieldType === "Dropdown")
            .map((c) => ({
              cellId: c.cellId,
              count: c.dropDownFields?.length || 0,
              hasFields: !!c.dropDownFields,
              isArray: Array.isArray(c.dropDownFields),
            })),
        );
        console.log(
          "📦 Step 4: Final dropdown state after all dependents:",
          finalDependentState,
        );
      }

      if (elem.disableExpressionLogic?.trim()) {
        console.log(
          "🔒 [Step 5] Processing disable expression for:",
          elem.cellId,
        );

        try {
          const isExpression = elem.disabledExpType === "Expression";

          const evaluatedDisabled = isExpression
            ? await (async () => {
                const expr = await findSQL(
                  elem.disableExpressionLogic,
                  elem,
                  updatedGridDataTest,
                );
                console.log("🔒 [Step 5] Disable expression:", expr);
                try {
                  const result = eval(expr);
                  console.log("🔒 [Step 5] Disable expression result:", result);
                  return result;
                } catch (evalError) {
                  console.error("🔒 [Step 5] Eval error:", evalError);
                  return false;
                }
              })()
            : await (async () => {
                const sql = await findSQL(
                  elem.disableExpressionLogic,
                  elem,
                  updatedGridDataTest,
                );
                console.log("🔒 [Step 5] Disable SQL:", sql);
                const res = await getQueryResultForGlobalCellUpdate(sql);
                console.log("🔒 [Step 5] Disable SQL Result:", res);
                return res ? Object.values(res)[0] : false;
              })();

          const isDisabled =
            evaluatedDisabled === 1 ||
            evaluatedDisabled === "1" ||
            evaluatedDisabled === true;

          console.log("🔒 [Step 5] Dropdown will be disabled:", isDisabled);

          updatedGridDataTest = updatedGridDataTest.map((form) => ({
            ...form,
            cellData: form.cellData.map((cell) => {
              if (cell.cellId === elem.cellId) {
                return {
                  ...cell,
                  disabled: isDisabled,
                };
              }
              return cell;
            }),
          }));

          console.log("📦 Step 5: Disable logic applied");

          const afterDisableState = updatedGridDataTest.flatMap((f) =>
            f.cellData
              .filter((c) => c.fieldType === "Dropdown")
              .map((c) => ({
                cellId: c.cellId,
                count: c.dropDownFields?.length || 0,
              })),
          );
          console.log(
            "📦 Step 5: Dropdown fields after disable logic:",
            afterDisableState,
          );
        } catch (error) {
          console.error(
            "❌ [Step 5] Error in disable expression logic:",
            error,
          );
        }
      }

      try {
        console.log("⏱️ [Step 6] Processing polling logic");

        for (const item of pollObj ?? []) {
          const cell = item.cell;
          if (!cell?.cellId) continue;

          try {
            if (cell.pollStartExpType === "Expression") {
              const startExp = await findSQL(
                cell.pollStartExpressionLogic,
                cell,
                updatedGridDataTest,
              );
              const stopExp = cell.pollStopExpressionLogic
                ? await findSQL(
                    cell.pollStopExpressionLogic,
                    cell,
                    updatedGridDataTest,
                  )
                : "false";

              const shouldStart = eval(startExp);
              const shouldStop = eval(stopExp);

              if (shouldStart) {
                setPollObj((prev) =>
                  prev.map((poll) =>
                    poll.cell.cellId === cell.cellId
                      ? {
                          ...poll,
                          autoRefresh: true,
                          pollInterval: cell.pollInterval,
                        }
                      : poll,
                  ),
                );
              }

              if (shouldStop) {
                setPollObj((prev) =>
                  prev.map((poll) =>
                    poll.cell.cellId === cell.cellId
                      ? {
                          ...poll,
                          autoRefresh: false,
                        }
                      : poll,
                  ),
                );
              }
            }

            if (cell.pollStartExpType === "SQL") {
              const startSql = await findSQL(
                cell.pollStartExpressionLogic,
                cell,
                updatedGridDataTest,
              );
              const stopSql = cell.pollStopExpressionLogic
                ? await findSQL(
                    cell.pollStopExpressionLogic,
                    cell,
                    updatedGridDataTest,
                  )
                : null;

              const startRes =
                await getQueryResultForGlobalCellUpdate(startSql);
              const stopRes = stopSql
                ? await getQueryResultForGlobalCellUpdate(stopSql)
                : null;

              const shouldStart = ["1", 1, "true", true].includes(
                Object.values(startRes ?? {})[0],
              );
              const shouldStop = stopRes
                ? ["1", 1, "true", true].includes(Object.values(stopRes)[0])
                : false;

              if (shouldStart) {
                setPollObj((prev) =>
                  prev.map((poll) =>
                    poll.cell.cellId === cell.cellId
                      ? {
                          ...poll,
                          autoRefresh: true,
                          pollInterval: cell.pollInterval,
                        }
                      : poll,
                  ),
                );
              }

              if (shouldStop) {
                setPollObj((prev) =>
                  prev.map((poll) =>
                    poll.cell.cellId === cell.cellId
                      ? {
                          ...poll,
                          autoRefresh: false,
                        }
                      : poll,
                  ),
                );
              }
            }
          } catch (pollError) {
            console.error(
              "❌ [Step 6] Error processing poll for cell:",
              cell.cellId,
              pollError,
            );
          }
        }

        console.log("📦 Step 6: Polling logic complete");
      } catch (error) {
        console.error("❌ [Step 6] Error in polling logic:", error);
      }

      console.log("💾 [FINAL] ========================================");
      console.log("💾 [FINAL] Preparing final state update");

      const beforeCloneState = updatedGridDataTest.flatMap((f) =>
        f.cellData
          .filter((c) => c.fieldType === "Dropdown")
          .map((c) => ({
            cellId: c.cellId,
            count: c.dropDownFields?.length || 0,
            isArray: Array.isArray(c.dropDownFields),
            sample: c.dropDownFields?.[0],
          })),
      );
      console.log("💾 [FINAL] Dropdown fields BEFORE clone:", beforeCloneState);

      const finalGridData = updatedGridDataTest.map((form) => ({
        ...form,
        cellData: form.cellData.map((c) => {
          const clonedCell = {
            ...c,
            dropDownFields: Array.isArray(c.dropDownFields)
              ? [...c.dropDownFields]
              : [],
            dependentFields: Array.isArray(c.dependentFields)
              ? [...c.dependentFields]
              : [],
          };

          if (c.fieldType === "Dropdown" && c.dropDownFields?.length > 0) {
            console.log(
              "💾 [FINAL] Cloning dropdown cell:",
              c.cellId,
              "with",
              c.dropDownFields.length,
              "options",
            );
          }

          return clonedCell;
        }),
      }));

      const afterCloneState = finalGridData.flatMap((f) =>
        f.cellData
          .filter((c) => c.fieldType === "Dropdown")
          .map((c) => ({
            cellId: c.cellId,
            count: c.dropDownFields?.length || 0,
            isArray: Array.isArray(c.dropDownFields),
            sample: c.dropDownFields?.[0],
          })),
      );
      console.log("💾 [FINAL] Dropdown fields AFTER clone:", afterCloneState);

      console.log("💾 [FINAL] About to call setGridDataTest");
      console.log("💾 [FINAL] Call stack:");
      console.trace();

      setGridDataTest(finalGridData);

      console.log("✅ [FINAL] setGridDataTest called successfully");
      console.log("✅ [FINAL] ========================================");
      console.log("✅ onCellValueChange complete for:", elem.cellId);
    } catch (error) {
      console.error("❌ Error in onCellValueChange:", error);
      console.error("❌ Error message:", error.message);
      console.error("❌ Error stack:", error.stack);

      alert(
        `Error processing dropdown change: ${error.message}\n\nCheck console for details.`,
      );
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  };
  const test = async (elem, setGridDataTest) => {
    if (elem.depExpressionLogic !== "" && elem.depExpressionLogic !== null) {
      const res = await getQueryResult(elem.depExpressionLogic);

      setGridDataTest((prevArray) => {
        return prevArray.map((item) => ({
          ...item,
          cellData: item.cellData.map((cell) => {
            if (cell.cellId === elem.cellId) {
              return {
                ...cell,
                dropDownFields: res,
              };
            }
            return cell;
          }),
        }));
      });

      console.log(res);
    }
  };

  function toHexForSQLServer(input) {
    if (Array.isArray(input)) {
      return (
        "0x" +
        input
          .map((byte) => {
            let hex = byte.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
          })
          .join("")
          .toUpperCase()
      );
    }

    if (typeof input === "string") {
      let base64 = input.replace(/-/g, "+").replace(/_/g, "/");

      while (base64.length % 4 !== 0) {
        base64 += "=";
      }

      try {
        const raw = atob(base64); // base64 → binary string
        let result = "0x";

        for (let i = 0; i < raw.length; i++) {
          let hex = raw.charCodeAt(i).toString(16);
          if (hex.length === 1) hex = "0" + hex;
          result += hex;
        }

        return result.toUpperCase();
      } catch (e) {
        console.error("Invalid Base64 string:", e);
        return null;
      }
    }

    console.error("Unsupported input type:", typeof input, input);
    return null;
  }

  async function findSQL(sql, elem, gridData) {
    try {
      console.log("🔍 [findSQL] Original SQL:", sql);

      if (!sql || !gridData) {
        console.warn("⚠️ [findSQL] Missing sql or gridData");
        return sql || "";
      }

      const regex = /\{\s*\{\s*([^}]+?)\s*\}\s*\}/g;
      let processedSQL = sql;
      let match;
      const matches = [];

      while ((match = regex.exec(sql)) !== null) {
        matches.push({
          fullMatch: match[0], // e.g., "{ { _4_5 } }"
          cellId: match[1].trim(), // e.g., "_4_5"
          index: match.index,
        });
      }

      console.log(
        "🔍 [findSQL] Found",
        matches.length,
        "placeholders:",
        matches.map((m) => m.cellId),
      );

      for (const matchInfo of matches) {
        const { fullMatch, cellId } = matchInfo;

        console.log("🔍 [findSQL] Processing placeholder:", cellId);

        const cellValue = await findCellValue(cellId, elem, gridData);

        // console.log("🔍 [findSQL] Found value for", cellId, ":", cellValue);

        const escapedPlaceholder = fullMatch.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&",
        );
        const replacementRegex = new RegExp(escapedPlaceholder, "g");

        processedSQL = processedSQL.replace(replacementRegex, cellValue);

        // console.log("🔍 [findSQL] After replacing", cellId, ":", processedSQL);
      }

      // console.log("✅ [findSQL] Final processed SQL:", processedSQL);
      return processedSQL;
    } catch (error) {
      console.error("❌ [findSQL] Error:", error);
      console.error("❌ [findSQL] Stack:", error.stack);
      return sql || "";
    }
  }

  function findCellValue(cellId, elem, gridData) {
    console.log("🔎 [findCellValue] Looking for:", cellId);

    if (cellId.startsWith("lv_")) {
      console.log("🔎 [findCellValue] State variable:", cellId);
      const value = state[cellId];
      console.log("🔎 [findCellValue] State value:", value);
      return value ? `'${value}'` : "null";
    }

    for (let rowNum = 0; rowNum < gridData?.length; rowNum++) {
      const rowData = gridData[rowNum];

      for (let colNum = 0; colNum < rowData?.cellData?.length; colNum++) {
        const cell = rowData.cellData[colNum];
        const cid = cell.cellId?.trim();
        const aid = cell.aliasId?.trim();

        if (cid === cellId.trim() || aid === cellId.trim()) {
          console.log("✅ [findCellValue] Found matching cell:", cell.cellId);

          const val = cell.value;
          const fieldType = cell.fieldType;

          if (fieldType === "File" || fieldType === "Image") {
            if (!cell.value || cell.value === "" || cell.value === null) {
              return "null";
            }
            // const hexValue = toHexForSQLServer(cell.value);
            return `'${cell.value}'` || cell.value;
          }
          if (fieldType === "Number") {
            if (val === null || val === undefined || val === "") {
              console.log("🔎 [findCellValue] Number is empty, returning null");
              return "null";
            }
            const numValue = Number(val);
            console.log("🔎 [findCellValue] Number value:", numValue);
            return numValue;
          }

          if (val === null || val === undefined || val === "") {
            console.log("🔎 [findCellValue] Value is empty, returning null");
            return "null";
          }

          const escapedValue = val.toString().replaceAll("'", "''");
          const quotedValue = `'${escapedValue}'`;
          console.log("🔎 [findCellValue] String value:", quotedValue);
          return quotedValue;
        }
      }
    }

    console.warn("⚠️ [findCellValue] Cell not found:", cellId);
    return "null";
  }
  const handleSave = async (
    e,
    gridDataTest,
    setRemarkDiag,
    transactionData,
    setCellChanges,
    setNewTransacData,
    setTransactionData,
    jobId,
    activityId,
    formName,
    versionNumber,
  ) => {
    e.preventDefault();

    const newCellObj = {};
    gridDataTest.forEach((item) => {
      item.cellData.forEach((cell) => {
        if (
          cell.cellId !== null &&
          cell.fieldType !== "File" &&
          cell.fieldType !== "Dropdown"
        ) {
          newCellObj[cell.cellId] = {
            ...(newCellObj[cell.cellId] || {}),
            remarks: cell.remarks || "NA",
            value: cell.value,
            disabled: cell.disabled,
            requiredfield: cell.requiredfield,
          };
        } else if (cell.fieldType === "File") {
          newCellObj[cell.cellId] = {
            ...(newCellObj[cell.cellId] || {}),
            remarks: cell.remarks || "NA",
            value: cell.value || cell.value,
            disabled: cell.disabled,
            requiredfield: cell.requiredfield,
          };
        } else if (cell.fieldType === "Dropdown") {
          newCellObj[cell.cellId] = {
            ...(newCellObj[cell.cellId] || {}),
            remarks: cell.remarks || "NA",
            value: cell.value,
            disabled: cell.disabled,
            requiredfield: cell.requiredfield,
            dropDownFields: cell.dropDownFields,
          };
        }
      });
    });

    const newCellObjTest = {};

    gridDataTest.forEach((item) => {
      item.cellData.forEach((cell) => {
        if (cell.context) {
          newCellObjTest[cell.context] =
            cell.fieldType === "File" ? cell.value || cell.value : cell.value;
        }
      });
    });
    console.log("My NewCellObj Test : ", newCellObjTest);
    console.log("newCellObj =>", newCellObj);

    let data = await getAllTransactions(
      jobId,
      activityId,
      formName,
      versionNumber,
    );

    console.log("data Transaction => ", data);
    const dataCheck = data?.length > 0 ? data[data.length - 1] : {};
    setTransactionData(dataCheck);

    const newCellObjKeys = Object.keys(newCellObj);

    const cellValChanges = {};
    let rows = [];

    if (Object.keys(dataCheck).length !== 0) {
      newCellObjKeys.forEach((item, index) => {
        if (
          newCellObj[item].value &&
          dataCheck.logbookData[item].value !== newCellObj[item].value
        ) {
          cellValChanges[item] = {
            ...(cellValChanges[item] || {}),
            oldValue: dataCheck.logbookData[item].value,
            newValue: newCellObj[item].value,
            remarks: "NA",
            requiredfield: newCellObj[item].requiredfield
              ? newCellObj[item].requiredfield
              : false,
          };
        }
      });

      Object.keys(cellValChanges).forEach((item) => {
        rows.push(
          createCellChangesData(
            item,
            cellValChanges[item].oldValue,
            cellValChanges[item].newValue,
            cellValChanges[item].remarks,
          ),
        );
      });
    } else {
      newCellObjKeys.forEach((item, index) => {
        if (newCellObj[item].value) {
          cellValChanges[item] = {
            ...(cellValChanges[item] || {}),
            oldValue: "",
            newValue: newCellObj[item].value,

            remarks: "NA",
            requiredfield: newCellObj[item].requiredfield
              ? newCellObj[item].requiredfield
              : false,
          };
        }
      });

      Object.keys(cellValChanges).forEach((item) => {
        rows.push(
          createCellChangesData(
            item,
            cellValChanges[item].oldValue,
            cellValChanges[item].newValue,
            cellValChanges[item].remarks,
          ),
        );
      });
    }

    console.log("My rows : ", rows);
    console.log("My tracnsaction rows : ", newCellObj);
    setCellChanges(rows);
    setNewTransacData(newCellObj);
    setNewTransacDataTest(newCellObjTest);

    setRemarkDiag(true);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },

    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  function createData(transactionId, timestamp, userid, value, reason) {
    return { transactionId, timestamp, userid, value, reason };
  }

  const handleOpen = async (
    e,
    setOpen,
    setCellObj,
    elem,
    setCellHistoryRows,
    jobId,
    activityId,
  ) => {
    setOpen(true);
    setCellObj(elem);
    let cell_history = await getCellEditHistory(elem.cellId, jobId, activityId);
    console.log("cell_history => ", cell_history);
    let rows = [];
    cell_history.forEach((item, index) => {
      rows.push(
        createData(
          item.transactionId,
          item.timestamp,
          item.userid,
          item.value,
          item.reason,
        ),
      );
    });
    setCellHistoryRows(rows);
  };

  const handleClose = (e, setOpen) => {
    setOpen(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",

    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const onRemarksChange = (e, row, setCellChanges) => {
    setCellChanges((prevArray) => {
      return prevArray.map((item) => {
        if (item.cellId === row.cellId) {
          return { ...item, remarks: e.target.value };
        }
        return item;
      });
    });
  };

  const handleRemarkClose = (e, setRemarkDiag) => {
    setRemarkDiag(false);
  };

  function createCellChangesData(cellId, oldValue, newValue, remarks) {
    return { cellId, oldValue, newValue, remarks };
  }

  function detectFileType(byteArray) {
    if (!byteArray || byteArray.length < 4) return "bin";

    const hex = byteArray
      .slice(0, 8)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (hex.startsWith("89504e47")) return "png";
    if (hex.startsWith("ffd8ffe0") || hex.startsWith("ffd8ffe1")) return "jpeg";
    if (hex.startsWith("25504446")) return "pdf";
    if (hex.startsWith("504b0304")) {
      return "zip-based";
    }
    if (hex.startsWith("52617221")) return "rar";
    if (hex.startsWith("d0cf11e0")) return "doc"; // Old Office (DOC, XLS, PPT)
    if (hex.startsWith("efbbbf") || hex.startsWith("0efbbbf")) return "txt"; // UTF-8 w/ BOM

    return "bin"; // fallback
  }

  function normalizeToByteArray(input, fileName = "") {
    let fileExtension = "";

    if (typeof input === "string" && input.startsWith("data:")) {
      const mimeMatch = input.match(/^data:([\w\/\-\.]+);base64,/);
      if (mimeMatch) {
        const mimeType = mimeMatch[1];
        fileExtension = mimeType.split("/")[1]; // e.g., "png"
      }
      input = input.replace(/^data:[^,]+,/, ""); // remove data prefix
    }

    if (typeof input === "string") {
      let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
      while (base64.length % 4 !== 0) base64 += "=";

      try {
        const binary = atob(base64);
        const byteArray = [];

        for (let i = 0; i < binary.length; i++) {
          byteArray.push(binary.charCodeAt(i));
        }

        if (!fileExtension) {
          const detected = detectFileType(byteArray);

          if (detected === "zip-based") {
            if (
              binary.includes("[Content_Types].xml") &&
              binary.includes("word/")
            ) {
              fileExtension = "docx";
            } else if (binary.includes("xl/")) {
              fileExtension = "xlsx";
            } else if (binary.includes("ppt/")) {
              fileExtension = "pptx";
            } else {
              fileExtension = "zip";
            }
          } else {
            fileExtension = detected;
          }
        }

        return { byteArray, fileExtension };
      } catch (e) {
        console.error("Invalid base64 input:", e);
        return { byteArray: null, fileExtension: "" };
      }
    }

    if (Array.isArray(input)) {
      if (!fileExtension) {
        fileExtension = detectFileType(input);
      }
      return { byteArray: input, fileExtension };
    }

    console.error("Unsupported input type:", typeof input, input);
    return { byteArray: null, fileExtension: "" };
  }

  const handleSaveAsDraft = async (
    e,
    cellChanges,
    setRemarkDiag,
    jobId,
    activityId,
    formName,
    versionNumber,
    userId,
    newTransacData,
  ) => {
    if (isOnline.online) {
      setLoading(true);
      setIsProcessing(true);
    } // console.log(cellChanges);

    const tId = `T${new Date()
      .toISOString()
      .replace(/[-:T.Z]/g, "")
      .slice(0, 19)}`;

    cellChanges.forEach((key) => {
      newTransacData[key.cellId].remarks = key.remarks;
    });

    const userRemarks = "NA";

    console.log("My newTransacData data in saveDraft : ", newTransacData);

    const blobFileList = [];

    for (const key in newTransacData) {
      if (newTransacData[key].value === "Blob_File") {
        const cellInfo = {
          cellId: key,
          value: "Blob_File",
          transactionId: tId,
          jobId: jobId,
          activityId: activityId,
          formName: formName,
          formversion: versionNumber,
        };

        console.log("Grid Data Test : ", gridDataTest);
        for (const sheet of gridDataTest) {
          for (const cell of sheet.cellData) {
            if (cell.cellId === key) {
              console.log("My Cell for file");
              cellInfo.aliasId = cell.aliasId;

              const { byteArray, fileExtension } = normalizeToByteArray(
                cell.value,
                cell.imagePath,
              );

              cellInfo.value = byteArray;
              cellInfo.fileExtension = fileExtension;
              cellInfo.fileName = cell.imagePath || `file.${fileExtension}`;

              break;
            }
          }
        }

        blobFileList.push(cellInfo);
      }
    }

    console.log("My Blob List for draft : ", blobFileList);

    const obj = {
      transactionId: tId,
      jobId: jobId,
      activityId: activityId,
      formName: formName,
      formversion: versionNumber,
      logbookData: newTransacData,

      userId: userId,
      role: "NA",

      transactionTimestamp: new Date(),

      userRemarks: userRemarks,
    };
    console.log("My Transaction OBJ : ", obj);

    if (!isOnline.online) {
      console.info("Offline mode: Saving transaction locally");
      const isSameObj = deepEqual(transactionObjDb, obj.logbookData);
      if (!isSameObj) {
        await saveData(obj.jobId, obj.activityId, obj);
        console.log("Offline data stored successfully");
        setSnackbarText("Data saved locally");
        setsnackbarSeverity("success");
      }

      return;
    }

    let status = null;
    console.log("Deep Equal Method called at 4409", transactionObjDb, obj);
    const isSameObj = deepEqual(transactionObjDb, obj);
    if (!isSameObj) {
      status = await SaveTransaction(obj); //save the transaction to DB as draft
    }
    const status1 = 200; //await handleSaveTransactionAttachment(blobFileList);
    if (status === 200 && status1 === 200) {
      setLoading(false);
      setIsProcessing(false);
      setsnackbarSeverity("success"); // Clear any previous snackbar severity (might need a value)
      setSnackbarText("Transaction Saved"); // Set success message for snackbar
      setSnackbarOpen(true);
    } else {
      setLoading(false);
      setIsProcessing(false);
      setsnackbarSeverity("error"); // Clear any previous snackbar severity (might need a value)
      setSnackbarText("Database Error"); // Set success message for snackbar
      setSnackbarOpen(true);
    }
    console.log(status);
    console.log(status1);
    setRemarkDiag(false);
    setLoading(false);
    setIsProcessing(false);
  };

  function checkRequiredFields(gridData) {
    for (let row of gridData) {
      for (let cell of row.cellData) {
        if (
          cell.requiredfield &&
          cell.editable &&
          (cell.value === null || cell.value === "" || cell.value === undefined)
        ) {
          return true; // Return true if condition is met
        }
      }
    }
    return false; // Return false if no such condition is found
  }

  const handleSaveClose = async (
    e,
    gridDataTest,
    cellChanges,
    setRemarkDiag,
    jobId,
    activityId,
    formName,
    versionNumber,
    userId,
    newTransacData,
    navigate,
  ) => {
    setIsProcessing(true);
    setLoading(true);
    let newErrors = {};

    gridDataTest.forEach((row) => {
      row.cellData.forEach((cell) => {
        if (cell.requiredfield) {
          if (
            cell.fieldType !== "File" &&
            (cell.value === "" ||
              cell.value === null ||
              cell.value === undefined)
          ) {
            newErrors[cell.cellId] = "This field cannot be empty"; // Set error message
          }

          if (
            cell.fieldType === "File" &&
            (cell.value === "" ||
              cell.value === null ||
              cell.value === undefined) &&
            (!cell.value || cell.value.length === 0)
          ) {
            newErrors[cell.cellId] = "A file must be uploaded"; // Set error message for file
          }
        }
      });
    });

    if (Object.keys(newErrors).length > 0) {
      setLoading(false);
      setIsProcessing(false);
      console.log("New Error : ", newErrors);
      setErrors(newErrors); // Update errors state to trigger re-render
      setRemarkDiag(false);
      setsnackbarSeverity("error"); // Set snackbar severity to "error"
      setSnackbarText("Please fill the required fields or upload a file"); // Set snackbar message
      setSnackbarOpen(true);
      return;
    } else {
      const tId = `T${new Date()
        .toISOString()
        .replace(/[-:T.Z]/g, "")
        .slice(0, 19)}`;

      cellChanges.forEach((key) => {
        newTransacData[key.cellId].remarks = key.remarks;
      });

      const userRemarks = cellChanges.reduce(
        (acc, { cellId, oldValue, newValue }) => {
          if (!oldValue && newValue !== null)
            return acc + `You have entered ${newValue} in cell id ${cellId} `;
          else if (oldValue !== newValue)
            return (
              acc +
              `data updated from ${oldValue} to ${newValue} in cell id ${cellId} `
            );
          else {
            const errorObj = {
              id: cellId, // Auto-increment ID
              value: `${cellId} : @error in expression or logic`, // Example value
            };

            setsqlErrorList((prevArr) =>
              Array.isArray(prevArr) ? [...prevArr, errorObj] : [errorObj],
            );
            return "@error";
          }
        },
        "",
      );
      console.log(userRemarks);

      const obj = {
        logbookId: state.formId,
        transactionId: tId,
        jobId: jobId,
        activityId: activityId,
        formName: formName,
        formversion: versionNumber,
        logbookData: newTransacData,

        userId: userId,
        role: "NA",

        transactionTimestamp: new Date(),

        userRemarks: "NA",
      };
      const objMongo = {
        logbookId: state.formId,
        transactionId: tId,
        jobId: jobId,
        activityId: activityId,
        formName: formName,
        formversion: versionNumber,
        logbookData: newTransacDataTest,

        userId: userId,
        role: "NA",

        transactionTimestamp: new Date(),

        userRemarks: "NA",
      };
      const blobFileList = [];

      for (const key in newTransacData) {
        if (newTransacData[key].value === "Blob_File") {
          const cellInfo = {
            cellId: key,
            value: "Blob_File",
            transactionId: tId,
            jobId: jobId,
            activityId: activityId,
            formName: formName,
            formversion: versionNumber,
          };

          for (const sheet of gridDataTest) {
            for (const cell of sheet.cellData) {
              if (cell.cellId === key) {
                console.log("My Cell for file");
                cellInfo.aliasId = cell.aliasId;

                const { byteArray, fileExtension } = normalizeToByteArray(
                  cell.value,
                  cell.imagePath,
                );

                cellInfo.value = byteArray;
                cellInfo.fileExtension = fileExtension;
                cellInfo.fileName = cell.imagePath || `file.${fileExtension}`;

                break;
              }
            }
          }

          blobFileList.push(cellInfo);
        }
      }

      console.log("My Blob List for close : ", blobFileList);
      console.log("My Obj of transaction : ", objMongo);
      console.log("Deep Equal Method called at 4609", transactionObjDb, obj);
      const isSameObj = deepEqual(transactionObjDb, obj);
      let status = null;
      if (!isSameObj) {
        status = await SaveTransaction(obj); //api calling to save the transaction history
      }
      const mongoApiStatus = 200;

      const status1 = 200; //await handleSaveTransactionAttachment(blobFileList);
      console.log(status);
      if (status === 200 && status1 === 200 && mongoApiStatus === 200) {
        const formInfo = await getFormInfoByFormName(formName);
        console.log("formInfo", formInfo);
        const activeForm = formInfo.filter(
          (form) => form.isActiveForm === true,
        )[0];
        console.log("activeForm : ", activeForm);
        if (activeForm?.saveSQL) {
          const executableSQL = await findSQL(
            activeForm.saveSQL,
            null,
            gridDataTest,
          );

          console.log("executableSQL", executableSQL);
          if (executableSQL) {
            const saveSQLResult =
              await getQueryResultForGlobalCellUpdate(executableSQL);
            console.log("saveSQLResult : ", saveSQLResult);

            if (saveSQLResult === null) {
              console.log("saveSQLResult is null");

              setIsProcessing(false);
              setLoading(false);
              setsnackbarSeverity("error"); // Clear any previous snackbar severity (might need a value)
              setSnackbarText("Error in Save SQL"); // Set success message for snackbar
              setSnackbarOpen(true);
              return;
            }
          }
        }

        console.log("first job : ", jobId.substring(0, 2) === "AJ");
        if (jobId.substring(0, 2) === "AJ") {
          const autoJob = {
            jobid: jobId,
            activityid: activityId,
          };
          autoJob.activityendtime = new Date().toISOString();
          console.log("autoJob", autoJob);
          const success = await updateJobTime(autoJob); //update the status for the auto job and activity as 'success' and change the update time
          console.log("Success ? ", success);
        }

        const approver = state["approver"];
        const location = state[process.env.REACT_APP_LOCATION];
        const groupType = state["groupType"];

        if (jobId[0] === "J" && location === "/workflow/performer") {
          const tenantid = getTenantID().tenant;
          const activity = {
            actualActivityEndTime: new Date(),
            actvityStatus:
              approver.toLowerCase().trim() === userId.toLowerCase().trim() &&
              groupType !== "Group"
                ? "Completed"
                : "Sent For Approval",
            jobId: jobId,
            activityId: activityId,
          };
          const res = await updateActivityStatus(activity, tenantid); //update the status for the activity by the api calling
          try {
            if (activity.actvityStatus === "Completed") {
              const response = await sendMailForNextActivities(jobId);
              if (response?.status === 200)
                console.log("Email sent successfully");
              else console.error("Email unsuccessful");
            }
          } catch (e) {
            console.error("Error in sending mail");
          }
          const jobStatus = await updateJobStatus(jobId); //update the status for the job by the api calling
          console.log("res => ", res);
        }

        setRemarkDiag(false);
        sessionStorage.setItem("saveClose", "true");
        navigate(-1); //navigate to the previous page
      } else {
        setIsProcessing(false);
        setLoading(false);
        setsnackbarSeverity("error"); // Clear any previous snackbar severity (might need a value)
        setSnackbarText("Databse Error"); // Set success message for snackbar
        setSnackbarOpen(true);
        return;
      }
      setIsProcessing(false);
      setLoading(false);
    }
  };
  const sendSql = async (sql) => {
    // try {
    //   const res = await axios.post(
    //     `http://localhost:8094/api/sql/execute`,
    //     sql,
    //     { headers: { "Content-Type": "text/plain" } },
    //   );
    //   console.log("Process Sql data : ", res.data);
    // } catch (err) {
    //   console.log("❌ Error: " + err.message);
    // }
  };

  const onDependentCellUpdate = async (
    itm,
    updatedGridDataTest1,
    setGridDataTest = () => {},
    path = [],
    isTopLevel = false, // ← Changed default to false
  ) => {
    const id = itm?.cellId;
    console.log(
      "🚀 [ENTER] onDependentCellUpdate called for:",
      id,
      "| Stack path:",
      path.join(" → "),
      "| Top Level:",
      isTopLevel,
    );

    if (isTopLevel) {
      setLoading(true);
    }

    try {
      if (!updatedGridDataTest1 || !Array.isArray(updatedGridDataTest1)) {
        console.error(
          "❌ Invalid grid data passed to onDependentCellUpdate!",
          updatedGridDataTest1,
        );
        return [];
      }

      if (!id) {
        console.error("❌ Missing cellId in itm", itm);
        return updatedGridDataTest1;
      }

      if (path.includes(id)) {
        const fullPath = [...path, id].join(" -> ");

        console.error("⚠️ Circular dependency detected:", fullPath);
        return updatedGridDataTest1;
      }

      const nextPath = [...path, id];

      const updatedGridDataTest = deepClone(updatedGridDataTest1);

      for (const item of updatedGridDataTest) {
        for (const element of item.cellData) {
          if (element.cellId !== id) continue;

          console.log(
            "📝 [STACK DEPTH:",
            path.length,
            "] Processing element:",
            element.cellId,
          );

          if (element.disableExpressionLogic?.trim()) {
            console.log(
              "🔒 [STACK DEPTH:",
              path.length,
              "] Processing disable expression for:",
              element.cellId,
            );

            const disableSQL = await findSQL(
              element.disableExpressionLogic,
              element,
              updatedGridDataTest,
            );
            // console.log(
            //   "🔒 [STACK DEPTH:",
            //   path.length,
            //   "] Disable SQL =>",
            //   disableSQL,
            // );

            let evaluatedDisabled;

            if (element.disabledExpType === "Expression") {
              try {
                evaluatedDisabled = eval(disableSQL);
                console.log(
                  "🔒 [STACK DEPTH:",
                  path.length,
                  "] Expression-based disable result:",
                  evaluatedDisabled,
                );
              } catch (evalError) {
                console.error(
                  "❌ [STACK DEPTH:",
                  path.length,
                  "] Eval error:",
                  evalError,
                );
                evaluatedDisabled = false;
              }
            } else {
              console.log(
                "🔒 [STACK DEPTH:",
                path.length,
                "] SQL-based disable for:",
                element.cellId,
              );

              let disableRes;
              try {
                disableRes =
                  await getQueryResultForGlobalCellUpdate(disableSQL);
                console.log(
                  "🔒 [STACK DEPTH:",
                  path.length,
                  "] SQL disable result:",
                  disableRes,
                );
                evaluatedDisabled = disableRes
                  ? Object.values(disableRes)[0]
                  : false;
              } catch (error) {
                console.error(
                  "❌ [STACK DEPTH:",
                  path.length,
                  "] SQL query failed:",
                  error,
                );
                evaluatedDisabled = false;
              }
            }

            const isDisabled =
              evaluatedDisabled === 1 ||
              evaluatedDisabled === "1" ||
              evaluatedDisabled === true;

            element.disabled = isDisabled;

            console.log(
              "✅ [STACK DEPTH:",
              path.length,
              "] Disable logic applied for:",
              element.cellId,
              "| Disabled:",
              element.disabled,
            );

            if (element.disabled === true && isDisabled === true) {
              console.warn(
                "⛔ [STACK DEPTH:",
                path.length,
                "] Cell is disabled and disable logic is true. Stopping execution for:",
                element.cellId,
              );
              return updatedGridDataTest;
            }
          } else {
            console.log(
              "⏭️ [STACK DEPTH:",
              path.length,
              "] No disable expression for:",
              element.cellId,
            );
          }
          console.log(
            "updatedGridDataTest in ondepcellupdate : ",
            element,
            updatedGridDataTest,
          );
          if (["Image", "File"].includes(element.fieldType)) {
            console.log(
              "🖼️ [STACK DEPTH:",
              path.length,
              "] Processing Image/File field:",
              element.cellId,
            );
            const sql = await findSQL(
              element.depExpressionLogic,
              element,
              updatedGridDataTest,
            );
            const sqlRes = await getQueryResultForGlobalCellUpdate(sql);
            element.value = sqlRes ? Object.values(sqlRes)[0] : element.value;

            element.imagePath = sqlRes
              ? Object.keys(sqlRes)[0]
              : element.imagePath;
            console.log(
              "✅ [STACK DEPTH:",
              path.length,
              "] Image/File processed for:",
              element.cellId,
            );
          } else if (element.fieldType === "API") {
            console.log(
              "🌐 [STACK DEPTH:",
              path.length,
              "] Processing API field:",
              element.cellId,
            );
            const { pollStartExpType } = element;

            if (pollStartExpType === "Expression") {
              const expression = await findSQL(
                element.pollStartExpressionLogic,
                element,
                updatedGridDataTest,
              );
              const shouldRun = eval(expression);
              if (shouldRun) {
                const api = await findSQL(
                  element.apiUrl,
                  element,
                  updatedGridDataTest,
                );
                const restData = await getRestData(api);
                element.value = restData;
              }
            } else if (pollStartExpType === "SQL") {
              const sql = await findSQL(
                element.pollStartExpressionLogic,
                element,
                updatedGridDataTest,
              );
              const sqlRes = await getQueryResultForGlobalCellUpdate(sql);
              const result = Object.values(sqlRes)[0];
              const shouldRun =
                result === 1 ||
                result === "1" ||
                result === "true" ||
                result === true;

              if (shouldRun) {
                const api = await findSQL(
                  element.apiUrl,
                  element,
                  updatedGridDataTest,
                );
                const restData = await getRestData(api);
                element.value = restData;
              }
            }
            console.log(
              "✅ [STACK DEPTH:",
              path.length,
              "] API field processed for:",
              element.cellId,
            );
          } else {
            console.log(
              "🔧 [STACK DEPTH:",
              path.length,
              "] Processing dependency logic for:",
              element.cellId,
            );

            if (element.depExpressionLogic?.trim()) {
              const sql = await findSQL(
                element.depExpressionLogic,
                element,
                updatedGridDataTest,
              );

              if (element.fieldType === "Dropdown") {
                console.log(
                  "🔽 [DROPDOWN] Processing dropdown:",
                  element.cellId,
                );
                console.log("🔽 [DROPDOWN] SQL:", sql);

                let sqlRes;
                try {
                  console.log("🔽 [DROPDOWN] About to call getQueryResult...");

                  sqlRes = await getQueryResult(sql);

                  console.log(
                    "🔽 [DROPDOWN] ✅ getQueryResult completed successfully",
                  );
                  console.log("🔽 [DROPDOWN] SQL Result:", sqlRes);
                  console.log(
                    "🔽 [DROPDOWN] Result count:",
                    Array.isArray(sqlRes) ? sqlRes.length : 0,
                  );
                } catch (error) {
                  console.error(
                    "❌ [DROPDOWN] getQueryResult failed for",
                    element.cellId,
                  );
                  console.error("❌ [DROPDOWN] Error:", error);
                  console.error("❌ [DROPDOWN] Error message:", error.message);
                  console.error("❌ [DROPDOWN] Error stack:", error.stack);
                  console.error("❌ [DROPDOWN] SQL that failed:", sql);

                  sqlRes = []; // Default to empty array on error
                }

                element.dropDownFields = Array.isArray(sqlRes) ? sqlRes : [];

                console.log(
                  "🔽 [DROPDOWN] Updated dropDownFields count:",
                  element.dropDownFields.length,
                );
                console.log("🔽 [DROPDOWN] Final element:", {
                  cellId: element.cellId,
                  fieldType: element.fieldType,
                  dropDownFieldsCount: element.dropDownFields.length,
                  value: element.value,
                });
              } else if (element.fieldType === "Number") {
                if (element.depExpressionType === "Expression") {
                  element.value = eval(sql);
                } else {
                  const sqlRes = await getQueryResultForGlobalCellUpdate(sql);
                  element.value = Object.values(sqlRes)[0];
                }
              } else {
                if (element.depExpressionType === "Expression") {
                  element.value = eval(sql);
                } else {
                  const sqlRes = await getQueryResultForGlobalCellUpdate(sql);
                  element.value = sqlRes ? Object.values(sqlRes)[0] : null;
                }
              }
              console.log(
                "✅ [STACK DEPTH:",
                path.length,
                "] Dependency logic completed for:",
                element.cellId,
              );
            }

            if (element.conditionalCssExpression?.trim()) {
              try {
                const logic = await findSQL(
                  element.conditionalCssExpression,
                  element,
                  updatedGridDataTest,
                );

                console.log("Logic and cell Id and csstype", logic, element);
                if (element.conditionalCssExpType === "Expression") {
                  console.log(
                    "executeLogic in dep cell upadate : ",
                    logic,
                    executeLogic(logic),
                  );
                  customCss = customCss + executeLogic(logic);
                } else {
                  const res = await getQueryResultForGlobalCellUpdate(logic);
                  const val = Object.values(res)[0];
                  customCss = val;
                }
                console.log(
                  "Final Cell with custom css in text Field",
                  element,
                  customCss,
                );
                element.cellCSS = customCss;

                console.log("Final Cell after update the css", element);
              } catch (error) {
                console.error(
                  `❌ Failed to resolve disabled for ${element.cellId}`,
                  error,
                );
              }
            }

            if (
              element.fieldType !== "Button" &&
              element.globalExpressionLogic
            ) {
              console.log(
                "🌍 [STACK DEPTH:",
                path.length,
                "] Processing global expression for:",
                element.cellId,
              );
              const sql = await findSQL(
                element.globalExpressionLogic,
                element,
                updatedGridDataTest,
              );
              const sqlResult = await getQueryResultForGlobalCellUpdate(sql);

              const changedCells = [];

              for (const form of updatedGridDataTest) {
                form.cellData = form.cellData.map((cell) => {
                  const newVal =
                    sqlResult?.[cell.cellId] ?? sqlResult?.[cell.aliasId];

                  if (newVal !== undefined) {
                    changedCells.push({ ...cell, newValue: newVal });

                    return {
                      ...cell,
                      ...(["File", "Image"].includes(cell.fieldType)
                        ? { value: newVal }
                        : { value: newVal }),
                    };
                  }

                  return cell;
                });
              }

              console.log(
                "🌍 [STACK DEPTH:",
                path.length,
                "] Changed cells count:",
                changedCells.length,
              );

              for (const changedCell of changedCells) {
                console.log(
                  "🌍 [STACK DEPTH:",
                  path.length,
                  "] Calling onPassiveFieldChange for:",
                  changedCell.cellId,
                );

                const updatedData = await onPassiveFieldChange(
                  changedCell,
                  updatedGridDataTest,
                  () => {}, // Don't update state in nested calls
                  pollObj,
                  setPollObj,
                  nextPath,
                );

                if (Array.isArray(updatedData)) {
                  updatedGridDataTest.splice(
                    0,
                    updatedGridDataTest.length,
                    ...updatedData,
                  );
                }

                console.log(
                  "✅ [STACK DEPTH:",
                  path.length,
                  "] onPassiveFieldChange completed for:",
                  changedCell.cellId,
                );
              }
            }

            console.log(
              "🔄 [STACK DEPTH:",
              path.length,
              "] Checking dependent fields for:",
              element.cellId,
            );

            if (Array.isArray(element.dependentFields)) {
              console.log(
                "🔄 [STACK DEPTH:",
                path.length,
                "] Processing",
                element.dependentFields.length,
                "dependent fields for:",
                element.cellId,
              );

              for (const dep of element.dependentFields) {
                if (!dep?.cellId || dep?.cellId === element.cellId) continue;

                console.log(
                  "🔄 [STACK DEPTH:",
                  path.length,
                  "] Recursively calling for dependent:",
                  dep.cellId,
                  "triggered by:",
                  element.cellId,
                );

                const result = await onDependentCellUpdate(
                  dep,
                  updatedGridDataTest, // ← Pass the current updated data
                  () => {},
                  nextPath,
                  false, // ← Always false for recursive calls
                );

                if (Array.isArray(result)) {
                  updatedGridDataTest.splice(
                    0,
                    updatedGridDataTest.length,
                    ...result,
                  );
                } else {
                  console.warn(
                    "⚠️ [STACK DEPTH:",
                    path.length,
                    "] Dependent update failed for:",
                    dep.cellId,
                  );
                }

                console.log(
                  "✅ [STACK DEPTH:",
                  path.length,
                  "] Completed recursive call for:",
                  dep.cellId,
                );
              }
            } else {
              console.log(
                "⏭️ [STACK DEPTH:",
                path.length,
                "] No dependent fields for:",
                element.cellId,
              );
            }
          }

          break;
        }
      }

      console.log("🔍 [RETURN CHECK] About to return data for:", id);

      const dropdownCheck = updatedGridDataTest.flatMap((f) =>
        f.cellData
          .filter((c) => c.fieldType === "Dropdown")
          .map((c) => ({
            cellId: c.cellId,
            dropDownCount: c.dropDownFields?.length || 0,
          })),
      );
      console.log(
        "🔍 [RETURN CHECK] Dropdown fields in return data:",
        dropdownCheck,
      );
      console.log("updatedGridDataTest at last : ", updatedGridDataTest);
      return updatedGridDataTest;
    } catch (error) {
      console.error("❌ Error:", error);
      return updatedGridDataTest1 ?? [];
    } finally {
      if (isTopLevel) {
        console.log("🏁 [FINALLY] Cleaning up (top level) for:", id);
        setLoading(false);
      }
    }
  };
  function deepClone(obj) {
    if (!obj) return [];
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (e) {
      console.error("❌ deepClone failed:", e, obj);
      return [];
    }
  }

  const onPassiveFieldChange = async (
    cell,
    updatedGridDataTest1,
    _setGridDataTest = () => {},
    pollObj,
    setPollObj,
    path = [],
  ) => {
    setLoading(true);

    try {
      console.log("📣 Passive change triggered for:", cell.cellId);

      if (!Array.isArray(updatedGridDataTest1)) {
        console.warn(
          "❌ Invalid grid data in passive field change:",
          updatedGridDataTest1,
        );
        return updatedGridDataTest1 ?? [];
      }

      const id = cell.cellId;
      if (!id) {
        console.error("❌ Missing cellId in cell:", cell);
        return updatedGridDataTest1;
      }

      if (path.includes(id)) {
        const fullPath = [...path, id].join(" -> ");
        console.warn(
          "🌀 Circular dependency in onPassiveFieldChange:",
          fullPath,
        );
        return updatedGridDataTest1;
      }

      const nextPath = [...path, id]; // track recursion

      let updatedGridDataTest = deepClone(updatedGridDataTest1);

      if (cell.disableExpressionLogic?.trim()) {
        console.log(
          "🔒 [Passive] Processing disable expression for:",
          cell.cellId,
        );

        try {
          const isExpression = cell.disabledExpType === "Expression";

          let evaluatedDisabled;

          if (isExpression) {
            const expr = await findSQL(
              cell.disableExpressionLogic,
              cell,
              updatedGridDataTest,
            );
            console.log("🔒 [Passive] Disable expression:", expr);

            try {
              evaluatedDisabled = eval(expr);
              console.log(
                "🔒 [Passive] Disable expression result:",
                evaluatedDisabled,
              );
            } catch (evalError) {
              console.error("🔒 [Passive] Eval error:", evalError);
              evaluatedDisabled = false;
            }
          } else {
            const sql = await findSQL(
              cell.disableExpressionLogic,
              cell,
              updatedGridDataTest,
            );
            console.log("🔒 [Passive] Disable SQL:", sql);

            try {
              const res = await getQueryResultForGlobalCellUpdate(sql);
              console.log("🔒 [Passive] Disable SQL Result:", res);
              evaluatedDisabled = res ? Object.values(res)[0] : false;
            } catch (sqlError) {
              console.error("🔒 [Passive] SQL error:", sqlError);
              evaluatedDisabled = false;
            }
          }

          const isDisabled =
            evaluatedDisabled === 1 ||
            evaluatedDisabled === "1" ||
            evaluatedDisabled === true;

          console.log("🔒 [Passive] Cell will be disabled:", isDisabled);

          updatedGridDataTest = updatedGridDataTest.map((form) => ({
            ...form,
            cellData: form.cellData.map((c) => {
              if (c.cellId === cell.cellId) {
                return {
                  ...c,
                  disabled: isDisabled,
                };
              }
              return c;
            }),
          }));

          console.log("✅ [Passive] Disable logic applied for:", cell.cellId);

          if (cell.disabled === true && isDisabled === true) {
            console.warn(
              "⛔ [Passive] Cell is disabled and disable logic is true. Stopping execution for:",
              cell.cellId,
            );
            return updatedGridDataTest;
          }
        } catch (error) {
          console.error(
            "❌ [Passive] Error in disable expression logic:",
            error,
          );
        }
      }

      if (cell.conditionalCssExpression?.trim()) {
        try {
          const logic = await findSQL(
            cell.conditionalCssExpression,
            cell,
            updatedGridDataTest,
          );

          console.log("Logic and cell Id and csstype", logic, cell);
          if (cell.conditionalCssExpType === "Expression") {
            customCss = customCss + executeLogic(logic);
          } else {
            const res = await getQueryResultForGlobalCellUpdate(logic);
            const val = Object.values(res)[0];
            customCss = val;
          }
          console.log(
            "Final Cell with custom css in text Field",
            cell,
            customCss,
          );
          cell.cellCSS = customCss;

          updatedGridDataTest = updatedGridDataTest.map((form) => ({
            ...form,
            cellData: form.cellData.map((cell1) =>
              cell1.cellId === cell.cellId
                ? { ...cell1, cellCSS: customCss }
                : cell1,
            ),
          }));
          console.log("Final Cell after update the css", cell);
        } catch (error) {
          console.error(
            `❌ Failed to resolve disabled for ${cell.cellId}`,
            error,
          );
        }
      }

      if (cell.fieldType !== "Button" && cell.globalExpressionLogic) {
        console.log(
          "🌐 [Passive] Processing global expression for:",
          cell.cellId,
        );

        const sql = await findSQL(
          cell.globalExpressionLogic,
          cell,
          updatedGridDataTest,
        );
        const sqltest = await getQueryResultForGlobalCellUpdate(sql);

        console.log("🌐 Passive Expression SQL =>", sql);
        console.log("🧩 Passive SQL Result =>", sqltest);

        const changedCells = [];

        updatedGridDataTest.forEach((form) => {
          form.cellData.forEach((c) => {
            const newVal = sqltest?.[c.cellId] ?? sqltest?.[c.aliasId];
            if (newVal !== undefined) {
              console.log("My New Cell Value =>", newVal);
              const isFile = c.fieldType === "File" || c.fieldType === "Image";

              const hasChanged = isFile
                ? c.value !== newVal
                : c.value !== newVal;

              if (hasChanged) {
                if (isFile) {
                  c.value = newVal;
                } else c.value = newVal;
                console.log("🌐 [Passive] Changed cell:", c.cellId);
                changedCells.push(c);
              }
            }
          });
        });

        console.log("🌐 [Passive] Changed cells count:", changedCells.length);

        console.log(
          "Updated Grid Data in passive cell =>",
          updatedGridDataTest,
        );
        _setGridDataTest(
          updatedGridDataTest.map((row) => ({
            ...row,
            cellData: row.cellData.map((c) => ({ ...c })),
          })),
        );

        for (const changed of changedCells) {
          if (changed.cellId === id) continue; // avoid self

          console.log(
            "🔄 [Passive] Recursively calling for changed cell:",
            changed.cellId,
          );

          updatedGridDataTest = await onPassiveFieldChange(
            changed,
            updatedGridDataTest,
            _setGridDataTest,
            pollObj,
            setPollObj,
            nextPath,
          );
        }
      }

      if (cell.dependentFields?.length > 0) {
        console.log(
          "🔄 [Passive] Processing",
          cell.dependentFields.length,
          "dependent fields for:",
          cell.cellId,
        );

        for (const dependent of cell.dependentFields) {
          if (!dependent?.cellId || dependent.cellId === cell.cellId) continue;

          console.log(
            "🔄 [Passive] Calling onDependentCellUpdate for:",
            dependent.cellId,
          );

          const result = await onDependentCellUpdate(
            dependent,
            updatedGridDataTest,
            undefined,
            nextPath,
            false,
          );

          if (Array.isArray(result)) {
            updatedGridDataTest = result;
            console.log(
              "✅ [Passive] Dependent update completed for:",
              dependent.cellId,
            );
          } else {
            console.warn(
              `⚠️ Failed dependent update from ${cell.cellId} → ${dependent.cellId}`,
            );
          }
        }
      }

      if (pollObj && setPollObj) {
        try {
          console.log(
            "⏱️ [Passive] Processing polling logic for:",
            cell.cellId,
          );

          for (const item of pollObj ?? []) {
            const pollCell = item.cell;
            if (!pollCell?.cellId) continue;

            if (pollCell.cellId !== cell.cellId) continue;

            try {
              if (pollCell.pollStartExpType === "Expression") {
                const startExp = await findSQL(
                  pollCell.pollStartExpressionLogic,
                  pollCell,
                  updatedGridDataTest,
                );
                const stopExp = pollCell.pollStopExpressionLogic
                  ? await findSQL(
                      pollCell.pollStopExpressionLogic,
                      pollCell,
                      updatedGridDataTest,
                    )
                  : "false";

                const shouldStart = eval(startExp);
                const shouldStop = eval(stopExp);

                if (shouldStart) {
                  setPollObj((prev) =>
                    prev.map((poll) =>
                      poll.cell.cellId === pollCell.cellId
                        ? {
                            ...poll,
                            autoRefresh: true,
                            pollInterval: pollCell.pollInterval,
                          }
                        : poll,
                    ),
                  );
                }

                if (shouldStop) {
                  setPollObj((prev) =>
                    prev.map((poll) =>
                      poll.cell.cellId === pollCell.cellId
                        ? {
                            ...poll,
                            autoRefresh: false,
                          }
                        : poll,
                    ),
                  );
                }
              }

              if (pollCell.pollStartExpType === "SQL") {
                const startSql = await findSQL(
                  pollCell.pollStartExpressionLogic,
                  pollCell,
                  updatedGridDataTest,
                );
                const stopSql = pollCell.pollStopExpressionLogic
                  ? await findSQL(
                      pollCell.pollStopExpressionLogic,
                      pollCell,
                      updatedGridDataTest,
                    )
                  : null;

                const startRes =
                  await getQueryResultForGlobalCellUpdate(startSql);
                const stopRes = stopSql
                  ? await getQueryResultForGlobalCellUpdate(stopSql)
                  : null;

                const shouldStart = ["1", 1, "true", true].includes(
                  Object.values(startRes ?? {})[0],
                );
                const shouldStop = stopRes
                  ? ["1", 1, "true", true].includes(Object.values(stopRes)[0])
                  : false;

                if (shouldStart) {
                  setPollObj((prev) =>
                    prev.map((poll) =>
                      poll.cell.cellId === pollCell.cellId
                        ? {
                            ...poll,
                            autoRefresh: true,
                            pollInterval: pollCell.pollInterval,
                          }
                        : poll,
                    ),
                  );
                }

                if (shouldStop) {
                  setPollObj((prev) =>
                    prev.map((poll) =>
                      poll.cell.cellId === pollCell.cellId
                        ? {
                            ...poll,
                            autoRefresh: false,
                          }
                        : poll,
                    ),
                  );
                }
              }
            } catch (pollError) {
              console.error(
                "❌ [Passive] Error processing poll for cell:",
                pollCell.cellId,
                pollError,
              );
            }
          }

          console.log("✅ [Passive] Polling logic complete for:", cell.cellId);
        } catch (error) {
          console.error("❌ [Passive] Error in polling logic:", error);
        }
      }

      console.log(
        "✅ [Passive] Passive field change complete for:",
        cell.cellId,
      );
      return updatedGridDataTest;
    } catch (error) {
      console.error("❌ Error in onPassiveFieldChange:", error);
      console.error("❌ Error stack:", error.stack);
      return updatedGridDataTest1 ?? [];
    } finally {
      setLoading(false);
    }
  };
  const onPassiveFieldChangeDep = async (
    cell,
    updatedGridDataTest,
    setGridDataTest,
    pollObj,
    setPollObj,
  ) => {
    console.log("Inside the passive value");
    console.log("passive value cell  : ", cell);
    if (cell.dependentFields) {
      cell.dependentFields.forEach(
        async (itm, idx) =>
          await onDependentCellUpdate(
            cell,

            updatedGridDataTest,
            setGridDataTest,
          ),
      );
    }
  };

  const handleButtonClick = async (
    e,
    elem,
    gridDataTest,
    setGridDataTest,
    pollObj,
    setPollObj,
  ) => {
    try {
      setIsProcessing(true);
      setLoading(true);

      console.log("🔘 handleButtonClick triggered for:", elem.cellId);

      let updatedGridDataTest = [...gridDataTest];

      if (elem.buttonLogic || elem.buttonType === "Rest API") {
        if (elem.buttonType === "SQL" && elem.buttonLogic) {
          console.log("📊 Processing SQL Button");
          const sql = await findSQL(
            elem.buttonLogic,
            elem,
            updatedGridDataTest,
          );
          console.log("🔍 SQL Query:", sql);

          const sqlResult = await getQueryResultForGlobalCellUpdate(sql);
          console.log("🧩 SQL Result:", sqlResult);

          if (sqlResult || sqlResult === "") {
            const changedCells = [];

            updatedGridDataTest = updatedGridDataTest.map((form) => ({
              ...form,
              cellData: form.cellData.map((cell) => {
                const key = sqlResult.hasOwnProperty(cell.cellId)
                  ? cell.cellId
                  : sqlResult.hasOwnProperty(cell.aliasId)
                    ? cell.aliasId
                    : null;

                if (key !== null) {
                  const newValue = sqlResult[key];
                  const isFile = ["Image", "File"].includes(cell.fieldType);
                  const hasChanged = isFile
                    ? cell.value !== newValue
                    : cell.value !== newValue;

                  if (hasChanged) {
                    changedCells.push({ ...cell });
                  }

                  return {
                    ...cell,
                    value: newValue,
                    ...(isFile && { value: newValue }),
                  };
                }
                return cell;
              }),
            }));

            console.log("📦 Step 1: SQL results applied:", updatedGridDataTest);

            for (const changed of changedCells) {
              console.log("🔄 Running passive update for:", changed.cellId);
              const passiveResult = await onPassiveFieldChange(
                changed,
                updatedGridDataTest,
                () => {}, // Don't update state yet
                pollObj,
                setPollObj,
                [elem.cellId],
              );

              if (Array.isArray(passiveResult)) {
                updatedGridDataTest = passiveResult;
              }
            }
            console.log(
              "📦 Step 2: Passive updates complete:",
              updatedGridDataTest,
            );
          } else {
            setsnackbarSeverity("error"); // Clear any previous snackbar severity (might need a value)
            setSnackbarText("Error In Query"); // Set success message for snackbar
            setSnackbarOpen(true);
            return;
          }
        } else if (elem.buttonType === "Expression" && elem.buttonLogic) {
          console.log("🧮 Processing Expression Button");
          const sql = await findSQL(
            elem.buttonLogic,
            elem,
            updatedGridDataTest,
          );
          console.log("🔍 Expression:", sql);

          const cellValue = eval(sql);
          console.log("🧩 Expression Result:", cellValue);

          const changedCells = [];

          updatedGridDataTest = updatedGridDataTest.map((form) => ({
            ...form,
            cellData: form.cellData.map((cell) => {
              if (Array.isArray(cell.dependentFields)) {
                const isDependentOnButton = cell.dependentFields.some(
                  (dep) => dep.cellId === elem.cellId,
                );

                if (isDependentOnButton && cell.value !== cellValue) {
                  changedCells.push({ ...cell });
                  return { ...cell, value: cellValue };
                }
              }
              return cell;
            }),
          }));

          console.log(
            "📦 Step 1: Expression result applied:",
            updatedGridDataTest,
          );

          for (const changed of changedCells) {
            console.log("🔄 Running passive update for:", changed.cellId);
            const passiveResult = await onPassiveFieldChange(
              changed,
              updatedGridDataTest,
              () => {},
              pollObj,
              setPollObj,
              [elem.cellId],
            );

            if (Array.isArray(passiveResult)) {
              updatedGridDataTest = passiveResult;
            }
          }
          console.log(
            "📦 Step 2: Passive updates complete:",
            updatedGridDataTest,
          );
        } else if (elem.buttonType === "Rest API" && elem.apiUrl) {
          console.log("🌐 Processing REST API Button");
          const apiUrl = await findSQL(elem.apiUrl, elem, updatedGridDataTest);
          const cleanedUrl = apiUrl.replace(/'([^']*)'/g, "$1");
          console.log("🔗 API URL:", cleanedUrl);

          const apiResult = await getRestData(cleanedUrl);
          console.log("🧩 API Result:", apiResult);

          if (apiResult === "" || apiResult) {
            const changedCells = [];

            updatedGridDataTest = updatedGridDataTest.map((form) => ({
              ...form,
              cellData: form.cellData.map((cell) => {
                const key = apiResult.hasOwnProperty(cell.cellId)
                  ? cell.cellId
                  : apiResult.hasOwnProperty(cell.aliasId)
                    ? cell.aliasId
                    : null;

                if (key !== null) {
                  const newValue = apiResult[key];
                  const isFile = ["Image", "File"].includes(cell.fieldType);
                  const hasChanged = isFile
                    ? cell.value !== newValue
                    : cell.value !== newValue;

                  if (hasChanged) {
                    changedCells.push({ ...cell });
                  }

                  return {
                    ...cell,
                    value: newValue,
                    ...(isFile && { value: newValue }),
                  };
                }
                return cell;
              }),
            }));

            console.log("📦 Step 1: API results applied:", updatedGridDataTest);

            for (const changed of changedCells) {
              console.log("🔄 Running passive update for:", changed.cellId);
              const passiveResult = await onPassiveFieldChange(
                changed,
                updatedGridDataTest,
                () => {},
                pollObj,
                setPollObj,
                [elem.cellId],
              );

              if (Array.isArray(passiveResult)) {
                updatedGridDataTest = passiveResult;
              }
            }
            console.log(
              "📦 Step 2: Passive updates complete:",
              updatedGridDataTest,
            );
          } else {
            setsnackbarSeverity("error"); // Clear any previous snackbar severity (might need a value)
            setSnackbarText("Error In API"); // Set success message for snackbar
            setSnackbarOpen(true);
            return;
          }
        }
      }

      if (elem.disableExpressionLogic?.trim()) {
        console.log(
          "🔒 Processing disable expression for button:",
          elem.cellId,
        );
        const isExpr = elem.disabledExpType === "Expression";

        const disableVal = isExpr
          ? eval(
              await findSQL(
                elem.disableExpressionLogic,
                elem,
                updatedGridDataTest,
              ),
            )
          : await (async () => {
              const sql = await findSQL(
                elem.disableExpressionLogic,
                elem,
                updatedGridDataTest,
              );
              console.log("🔒 Disable SQL:", sql);
              const sqlRes = await getQueryResultForGlobalCellUpdate(sql);
              console.log("🔒 Disable SQL Result:", sqlRes);
              return sqlRes ? Object.values(sqlRes)[0] : 0;
            })();

        const isDisabled =
          disableVal === 1 || disableVal === "1" || disableVal === true;
        console.log("🔒 Button will be disabled:", isDisabled);

        updatedGridDataTest = updatedGridDataTest.map((form) => ({
          ...form,
          cellData: form.cellData.map((cell) =>
            cell.cellId === elem.cellId
              ? { ...cell, disabled: isDisabled }
              : cell,
          ),
        }));
        console.log("📦 Step 3: Disable logic applied:", updatedGridDataTest);
      }
      if (
        Array.isArray(elem.dependentFields) &&
        elem.dependentFields.length > 0
      ) {
        console.log(
          "🔄 Processing",
          elem.dependentFields.length,
          "dependent fields",
        );

        for (const dep of elem.dependentFields) {
          console.log("🔄 Processing dependent field:", dep.cellId);

          const depResult = await onDependentCellUpdate(
            dep,
            updatedGridDataTest, // ← Pass the latest data
            () => {}, // ← Don't update state yet
            [elem.cellId],
            false, // ← Mark as NOT top level
          );

          if (Array.isArray(depResult)) {
            updatedGridDataTest = depResult;
            console.log("✅ Dependent field updated:", dep.cellId);
          }
        }

        console.log(
          "📦 Step 4: All dependent fields processed:",
          updatedGridDataTest,
        );
      }

      for (const item of pollObj) {
        const { cell } = item;
        if (!cell?.cellId) continue;

        const shouldStart = async () => {
          if (cell.pollStartExpType === "Expression") {
            const exp = await findSQL(
              cell.pollStartExpressionLogic,
              cell,
              updatedGridDataTest,
            );
            return eval(exp);
          }

          const sql = await findSQL(
            cell.pollStartExpressionLogic,
            cell,
            updatedGridDataTest,
          );
          const sqlRes = await getQueryResultForGlobalCellUpdate(sql);
          const result = sqlRes ? Object.values(sqlRes)[0] : 0;
          return result === 1 || result === "1" || result === true;
        };

        const shouldStop = async () => {
          if (!cell.pollStopExpressionLogic) return false;

          const expOrSql = await findSQL(
            cell.pollStopExpressionLogic,
            cell,
            updatedGridDataTest,
          );

          if (cell.pollStartExpType === "Expression") {
            return eval(expOrSql);
          } else {
            const sqlRes = await getQueryResultForGlobalCellUpdate(expOrSql);
            const result = sqlRes ? Object.values(sqlRes)[0] : 0;
            return result === 1 || result === "1" || result === true;
          }
        };

        const start = await shouldStart();
        const stop = await shouldStop();

        setPollObj((prevState) =>
          prevState.map((poll) =>
            poll.cell.cellId === cell.cellId
              ? {
                  ...poll,
                  autoRefresh: stop ? false : start,
                  pollInterval: start ? cell.pollInterval : poll.pollInterval,
                }
              : poll,
          ),
        );
      }

      console.log(
        "💾 Final state update with all changes:",
        updatedGridDataTest,
      );
      setGridDataTest(
        updatedGridDataTest.map((form) => ({
          ...form,
          cellData: form.cellData.map((c) => ({ ...c })),
        })),
      );

      console.log("✅ handleButtonClick complete for:", elem.cellId);
      setsnackbarSeverity("success"); // Clear any previous snackbar severity (might need a value)
      setSnackbarText("Done"); // Set success message for snackbar
      setSnackbarOpen(true);
    } catch (error) {
      setsnackbarSeverity("error"); // Clear any previous snackbar severity (might need a value)
      setSnackbarText("Error In Query Or Expression"); // Set success message for snackbar
      setSnackbarOpen(true);
      console.error("❌ Error in handleButtonClick:", error);
      console.error("Stack:", error.stack);
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  };

  const handleDownloadButton = async (
    e,
    elem,
    gridDataTest,
    setGridDataTest,
    pollObj,
    setPollObj,
  ) => {
    const sqlTest =
      "Select TOP 1 file_content FROM [Support_360].[dbo].[application_ticket_details] " +
      "Where ticket_number = 'A20240529T125809321'";

    const sqlTestResult = await getQueryResultForGlobalCellUpdate(sqlTest);

    const blobString = Object.values(sqlTestResult[0])[0];

    if (blobString === undefined) return;

    const byteCharacters = atob(blobString);

    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    if (checkSignature(byteArray, [0x50, 0x4b, 0x03, 0x04])) {
      console.log("ZIP");
      downloadFile(byteArray, "archive.zip", "application/zip");
    } else if (
      checkSignature(
        byteArray,
        [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
      )
    ) {
      console.log("PNG");
      downloadFile(byteArray, "image.png", "image/png");
    } else if (checkSignature(byteArray, [0xff, 0xd8, 0xff])) {
      console.log("JPEG");
      downloadFile(byteArray, "image.jpg", "image/jpeg");
    } else if (checkSignature(byteArray, [0x25, 0x50, 0x44, 0x46])) {
      console.log("PDF");
      downloadFile(byteArray, "document.pdf", "application/pdf");
    } else if (checkSignature(byteArray, [0x50, 0x4b, 0x03, 0x04])) {
      console.log("Excel");
      downloadFile(
        byteArray,
        "spreadsheet.xlsx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
    } else if (checkSignature(byteArray, [0x50, 0x4b, 0x03, 0x04])) {
      console.log("Word");
      downloadFile(
        byteArray,
        "document.docx",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      );
    } else {
      console.log("Unknown");
      downloadFile(byteArray, "file", "application/octet-stream");
    }
  };

  const checkSignature = (byteArray, signature) => {
    for (let i = 0; i < signature.length; i++) {
      if (byteArray[i] !== signature[i]) {
        return false;
      }
    }
    return true;
  };

  const downloadFile = (byteArray, fileName, mimeType) => {
    const blob = new Blob([byteArray], { type: mimeType });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName); // Set the download attribute with the desired file name

    document.body.appendChild(link);

    link.click();

    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  const handleChangePage = (event, newPage, setPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event, setRowsPerPage, setPage) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangePageRemarksTable = (event, newPage, setPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPageRemarksTable = (
    event,
    setRowsPerPage,
    setPage,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    fetchData();
  }, [formName, versionNumber]);

  async function fetchData() {
    try {
      setIsProcessing(true);
      setLoading(true);
      extendTokenExpiration();

      let data = logData
        ? JSON.parse(JSON.stringify(logData))
        : await getAllCellInfoByFormNameAndVersion(formName, versionNumber);
      console.log("My Data Ashok : ", data);
      if (!Array.isArray(data)) {
        console.warn("❌ Invalid form definition");
        return;
      }

      const maxCol = Math.max(
        ...data.flatMap((row) => row.cellData.map((cell) => cell.colNum)),
      );

      const transactions = await getAllTransactions(
        jobId,
        activityId,
        formName,
        versionNumber,
      );
      const latestTransaction =
        Array.isArray(transactions) && transactions.length > 0
          ? transactions.at(-1)
          : null;
      const attachments = [];

      setTransactionData(latestTransaction || {});

      transactionObjDb = latestTransaction?.logbookData || {};

      data = await resolveDepExpressions(data);
      data = await resolveDependentFields(data, setGridDataTest);

      data = await resolveApiFields(data);
      data = await resolveDisabledExpressions(data);
      // data = await resolveCustomCssExpressions(data);
      await resolvePolling(data, setPollObj); // polling helper populates pollObj

      data = applyTransactionData(data, latestTransaction, attachments);
      data = await resolveCustomCssExpressions(data);
      setGridDataTest(data);
      setColTot(() => maxCol);
      fillCell(data);
      const offlineEntry = await getData(jobId, activityId);
      console.log("Offline Entry Found ? ", offlineEntry);

      if (offlineEntry && offlineEntry.refresh) {
        restoreOfflineTransactions(data, offlineEntry.payload);
      } else if (offlineEntry) {
        setOfflineData({ ...offlineEntry, confirmation: true });
      }

      console.log("✅ Form fetch complete");
    } catch (error) {
      console.error("❌ Error in fetchData():", error);
    } finally {
      setLoading(false);
      setIsProcessing(false);
      firstRenderComplete.current = true;
    }
  }

  const restoreOfflineTransactions = async (gridData, transactions) => {
    let data = applyTransactionData(gridData, transactions, []);
    data = await resolveCustomCssExpressions(data);

    setGridDataTest(data);

    fillCell(data);
  };
  function applyTransactionData(data, transactionData, attachments = []) {
    if (!transactionData?.logbookData) return data;
    console.log("Current Transactions : ", data);
    return data.map((form) => ({
      ...form,
      cellData: form.cellData.map((cell) => {
        const logVal = transactionData.logbookData[cell.cellId];
        if (!logVal) return cell;

        return {
          ...cell,
          value: logVal.value ?? cell.value,
          disabled: logVal.disabled ?? cell.disabled,
          dropDownFields: logVal.dropDownFields ?? cell.dropDownFields,
        };
      }),
    }));
  }
  async function resolvePolling(data, setPollObj) {
    const pollConfigs = [];

    for (const row of data) {
      for (const cell of row.cellData) {
        if (!cell.autoRefresh || !cell.pollStartExpressionLogic?.trim())
          continue;

        try {
          let shouldStart = false;
          if (cell.pollStartExpType === "Expression") {
            const expr = await findSQL(
              cell.pollStartExpressionLogic,
              cell,
              data,
            );
            shouldStart = !!eval(expr);
          } else {
            const sql = await findSQL(
              cell.pollStartExpressionLogic,
              cell,
              data,
            );
            const res = await getQueryResultForGlobalCellUpdate(sql);
            const val = Object.values(res)[0];
            shouldStart =
              val === 1 || val === "1" || val === true || val === "true";
          }

          let shouldStop = false;
          if (cell.pollStopExpressionLogic?.trim()) {
            if (cell.pollStopExpType === "Expression") {
              const expr = await findSQL(
                cell.pollStopExpressionLogic,
                cell,
                data,
              );
              shouldStop = !!eval(expr);
            } else {
              const sql = await findSQL(
                cell.pollStopExpressionLogic,
                cell,
                data,
              );
              const res = await getQueryResultForGlobalCellUpdate(sql);
              const val = Object.values(res)[0];
              shouldStop =
                val === 1 || val === "1" || val === true || val === "true";
            }
          }

          pollConfigs.push({
            cell,
            autoRefresh: shouldStart && !shouldStop,
            pollInterval: shouldStart ? cell.pollInterval : null,
          });
        } catch (error) {
          console.error(`❌ Polling logic error @ ${cell.cellId}:`, error);
        }
      }
    }

    if (typeof setPollObj === "function") {
      setPollObj(pollConfigs);
    }
  }
  const dependentCallsFromUseEffect = async (data) => {
    for (const item of data) {
      for (const element of item.cellData) {
        if (element.dependentFields) {
          console.log("dependent Present");

          await Promise.all(
            element.dependentFields.map(
              async (itm) =>
                await onDependentCellUpdate(itm, data, setGridDataTest),
            ),
          );
        }
      }
    }

    setGridDataTest(data); // Ensure this is not overwriting the async updates above
  };

  const fillCell = (logData) => {
    console.log("in cell Fill : ", logData);
    if (logData) {
      const allCells = logData.flatMap((item) =>
        Array.isArray(item.cellData) ? item.cellData : [],
      );

      const maxColNum = Math.max(
        ...allCells.map((cell) => {
          const colNum = parseInt(cell.colNum, 10) || 0;
          const colSpan = parseInt(cell.colSpan, 10) || 1;
          return colNum + colSpan - 1;
        }),
      );

      console.log("maxColNum", maxColNum);

      const maxRowNum = Math.max(
        ...allCells.map((cell) => {
          const rowNum = parseInt(cell.rowNum, 10) || 0;
          const rowSpan = parseInt(cell.rowSpan, 10) || 1;
          return rowNum + rowSpan - 1;
        }),
      );

      const occupiedGrid = Array.from({ length: maxRowNum }, () =>
        Array(maxColNum).fill(false),
      );

      logData.forEach((form) => {
        form.cellData.forEach((cell) => {
          for (let i = 0; i < cell.rowSpan; i++) {
            for (let j = 0; j < cell.colSpan; j++) {
              const rowIndex = cell.rowNum - 1 + i;
              const colIndex = cell.colNum - 1 + j;

              if (rowIndex < maxRowNum && colIndex < maxColNum) {
                occupiedGrid[rowIndex][colIndex] = true;
              }
            }
          }
        });
      });

      setGridPropertes({
        ...gridProperties,
        occupiedGrid: occupiedGrid,
        maxColNum: maxColNum,
      });
    }
  };

  const handleDownloadButton1 = (fileContent) => {
    setSelectedFileContent(fileContent);
  };
  const containerStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${colTot}, 1fr)`,
    gap: "2px",
    position: "relative",
    height: "100px", // Set an appropriate height
    marginTop: "3rem",
  };

  const convertCssStringToMuiStyles = (cssString) => {
    if (!cssString) {
      return {};
    }
    const cssArray = cssString.split(";").map((style) => style.trim());
    const muiStyles = {};

    cssArray.forEach((style) => {
      const [property, value] = style.split(":").map((part) => part.trim());
      if (property && value) {
        const camelCaseProperty = property.replace(
          /-([a-z])/g,
          (match, letter) => letter.toUpperCase(),
        );
        muiStyles[camelCaseProperty] = value;
      }
    });

    return muiStyles;
  };

  const createFile = (byteArray) => {
    if (!byteArray) return; // Prevent infinite loops

    let mimeType = "application/octet-stream"; // Default MIME type
    let fileName = "uploaded-file"; // Default file name

    if (byteArray[0] === 0x25 && byteArray[1] === 0x50) {
      mimeType = "application/pdf";
      fileName += ".pdf";
    } else if (byteArray[0] === 0x50 && byteArray[1] === 0x4b) {
      mimeType = "application/zip";
      fileName += ".zip";

      const byteString = String.fromCharCode(...byteArray);

      if (byteString.includes("word/document.xml")) {
        mimeType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        fileName = "uploaded-file.docx";
      } else if (byteString.includes("xl/workbook.xml")) {
        mimeType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        fileName = "uploaded-file.xlsx";
      }
    } else if (byteArray[0] === 0xd0 && byteArray[1] === 0xcf) {
      mimeType = "application/msword";
      fileName += ".doc";
    } else if (byteArray[0] === 0xff && byteArray[1] === 0xd8) {
      mimeType = "image/jpeg";
      fileName += ".jpg";
    } else if (byteArray[0] === 0x89 && byteArray[1] === 0x50) {
      mimeType = "image/png";
      fileName += ".png";
    }

    const blob = new Blob([new Uint8Array(byteArray)], { type: mimeType });
    const newFile = new File([blob], fileName, { type: mimeType });

    return newFile;
  };

  const handleDownloadTest = async (elem, gridDataTest, setGridDataTest) => {
    console.log("My elem for download : ", elem);
    if (elem.depExpressionLogic) {
      let sql = await findSQL(elem.depExpressionLogic, elem, gridDataTest);
      console.log("file SQL : ", sql);
      let sqlRes = await getQueryResultForGlobalCellUpdate(sql);
      console.log("file sql Reslut", sqlRes);

      if (sqlRes) {
        const file = createFile(Object.values(sqlRes)[0]);
        if (file) {
          console.log("File for download:", file); // Debugging to check the file object

          const blob = new Blob([file], { type: file.type });

          let fileName = file.name; // Declare fileName with 'let' since we might modify it

          if (!fileName.includes(".")) {
            if (file.type === "application/pdf") {
              fileName += ".pdf";
            } else if (file.type === "application/msword") {
              fileName += ".doc";
            } else if (
              file.type ===
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ) {
              fileName += ".docx";
            } else if (
              file.type === "application/vnd.ms-excel" ||
              file.type === "application/excel" ||
              file.type === "application/x-excel" ||
              file.type === "application/x-msexcel"
            ) {
              fileName += ".xls";
            } else if (
              file.type ===
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ) {
              fileName += ".xlsx";
            } else if (file.type === "image/jpeg") {
              fileName += ".jpg";
            } else if (file.type === "image/png") {
              fileName += ".png";
            } else if (file.type === "image/gif") {
              fileName += ".gif";
            } else if (file.type === "application/zip") {
              fileName += ".zip";
            } else {
              fileName += ".bin"; // Default fallback
            }
          }

          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = fileName; // Set the download filename
          a.click();
          URL.revokeObjectURL(url); // Cleanup
        }
      }
    } else {
      const file = createFile(elem?.value);
      if (file) {
        console.log("File for download:", file); // Debugging to check the file object

        const blob = new Blob([file], { type: file.type });

        let fileName = file.name; // Declare fileName with 'let' since we might modify it

        if (!fileName.includes(".")) {
          if (file.type === "application/pdf") {
            fileName += ".pdf";
          } else if (file.type === "application/msword") {
            fileName += ".doc";
          } else if (
            file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ) {
            fileName += ".docx";
          } else if (
            file.type === "application/vnd.ms-excel" ||
            file.type === "application/excel" ||
            file.type === "application/x-excel" ||
            file.type === "application/x-msexcel"
          ) {
            fileName += ".xls";
          } else if (
            file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ) {
            fileName += ".xlsx";
          } else if (file.type === "image/jpeg") {
            fileName += ".jpg";
          } else if (file.type === "image/png") {
            fileName += ".png";
          } else if (file.type === "image/gif") {
            fileName += ".gif";
          } else if (file.type === "application/zip") {
            fileName += ".zip";
          } else {
            fileName += ".bin"; // Default fallback
          }
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName; // Set the download filename
        a.click();
        URL.revokeObjectURL(url); // Cleanup
      }
    }
    const handleFileUpload = (byteArray, fileName) => {
      console.log("byte Array : ", byteArray);
      console.log("My file Name : ", fileName);
    };
  };

  async function resolveDepExpressions(data) {
    if (!Array.isArray(data)) return data;

    for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      const row = data[rowIndex];

      for (let cellIndex = 0; cellIndex < row.cellData.length; cellIndex++) {
        const cell = row.cellData[cellIndex];

        if (!cell.depExpressionLogic?.trim()) continue;

        try {
          const sql = await findSQL(cell.depExpressionLogic, cell, data);

          if (cell.fieldType === "Dropdown") {
            const result = await getQueryResult(sql);
            cell.dropDownFields = Array.isArray(result) ? result : [];
            console.log(`✅ [${cell.cellId}] Dropdown updated:`, result);
          } else if (cell.fieldType === "Image" || cell.fieldType === "File") {
            const result = await getQueryResultForGlobalCellUpdate(sql);
            const fileContent = Object.values(result)[0] ?? null;
            cell.value = fileContent;

            cell.imagePath = fileContent ? Object.keys(result)[0] : ""; // Optional: replace with custom logic

            console.log(`✅ [${cell.cellId}] File/Image content set`);
          } else if (cell.fieldType === "Number") {
            if (cell.depExpressionType === "Expression") {
              cell.value = eval(sql);
            } else {
              const result = await getQueryResultForGlobalCellUpdate(sql);
              cell.value = Object.values(result)[0] ?? null;
            }

            console.log(`✅ [${cell.cellId}] Number value:`, cell.value);
          } else {
            if (cell.depExpressionType === "Expression") {
              cell.value = eval(sql);
            } else {
              const result = await getQueryResultForGlobalCellUpdate(sql);
              cell.value = Object.values(result)[0] ?? null;
            }

            console.log(`✅ [${cell.cellId}] Value:`, cell.value);
          }
        } catch (error) {
          console.error(`❌ [${cell.cellId}] depExpression error:`, error);
          cell.value = "@error_dep";
        }
      }
    }

    return data;
  }

  async function resolveDependentFields(data, setGridDataTest = () => {}) {
    if (!Array.isArray(data)) return data;

    for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      const row = data[rowIndex];

      for (let cellIndex = 0; cellIndex < row.cellData.length; cellIndex++) {
        const cell = row.cellData[cellIndex];

        if (
          !Array.isArray(cell.dependentFields) ||
          cell.dependentFields.length === 0
        )
          continue;

        for (const dep of cell.dependentFields) {
          if (!dep || !dep.cellId || dep.cellId === cell.cellId) continue;

          try {
            const updatedData = await onDependentCellUpdate(
              dep,
              data,
              setGridDataTest,
              [cell.cellId], // path to prevent circular
            );

            if (Array.isArray(updatedData)) {
              data = updatedData; // ✅ update data for next iteration
            }

            console.log(
              `🔁 Resolved dependent field: ${dep.cellId} ← ${cell.cellId}`,
            );
          } catch (error) {
            console.error(
              `❌ Error resolving dependent field ${dep.cellId}:`,
              error,
            );
          }
        }
      }
    }

    return data;
  }
  async function resolveDependentFields(data, setGridDataTest = () => {}) {
    if (!Array.isArray(data)) return data;

    for (let row of data) {
      for (let cell of row.cellData) {
        if (
          !Array.isArray(cell.dependentFields) ||
          cell.dependentFields.length === 0
        )
          continue;

        for (const dep of cell.dependentFields) {
          if (!dep?.cellId || dep.cellId === cell.cellId) continue;

          try {
            const updatedData = await onDependentCellUpdate(
              dep,
              data,
              setGridDataTest,
              [cell.cellId], // prevent circular
            );

            if (Array.isArray(updatedData)) {
              data = updatedData;
            }
          } catch (error) {
            console.error(
              `❌ Error resolving dependent field [${dep.cellId}]:`,
              error,
            );
          }
        }
      }
    }

    return data;
  }
  async function resolveGlobalExpressions(data) {
    for (let row of data) {
      for (let cell of row.cellData) {
        if (!cell.globalExpressionLogic?.trim()) continue;
        if (cell.value) continue; // Skip if already has value

        try {
          const sql = await findSQL(cell.globalExpressionLogic, cell, data);
          const result = await getQueryResultForGlobalCellUpdate(sql);
          const value = result?.[cell.cellId] ?? result?.[cell.aliasId] ?? null;

          if (value !== undefined && value !== null) {
            if (["Image", "File"].includes(cell.fieldType)) {
              cell.imagePath = "";
            } else {
              cell.value = value;
            }
          }
        } catch (error) {
          console.error(
            `❌ [${cell.cellId}] globalExpressionLogic error:`,
            error,
          );
        }
      }
    }

    return data;
  }
  async function resolveApiFields(data) {
    for (let row of data) {
      for (let cell of row.cellData) {
        if (cell.globalCellExpType === "SQL") continue; // not applicable
        if (!cell.apiUrl) continue;

        try {
          const api = await findSQL(cell.apiUrl, cell, data);
          const res = await getRestData(api);

          cell.value = res?.[cell.cellId] ?? res?.[cell.aliasId] ?? res ?? null;
        } catch (error) {
          console.error(`❌ Failed API call for [${cell.cellId}]`, error);
        }
      }
    }

    return data;
  }
  async function resolveDisabledExpressions(data) {
    for (let row of data) {
      for (let cell of row.cellData) {
        if (!cell.disableExpressionLogic?.trim()) continue;

        try {
          const logic = await findSQL(cell.disableExpressionLogic, cell, data);

          let isDisabled = false;

          if (cell.disabledExpType === "Expression") {
            isDisabled = !!eval(logic);
          } else {
            const res = await getQueryResultForGlobalCellUpdate(logic);
            const val = Object.values(res)[0];
            isDisabled =
              val === 1 || val === "1" || val === true || val === "true";
          }

          cell.disabled = isDisabled;
        } catch (error) {
          console.error(
            `❌ Failed to resolve disabled for ${cell.cellId}`,
            error,
          );
        }
      }
    }

    return data;
  }
  async function resolveCustomCssExpressions(data) {
    for (let row of data) {
      for (let cell of row.cellData) {
        if (!cell.conditionalCssExpression?.trim()) continue;

        try {
          const logic = await findSQL(
            cell.conditionalCssExpression,
            cell,
            data,
          );

          customCss = cell.cellCSS;
          console.log("Logic and cell Id and csstype", logic, cell);
          if (cell.conditionalCssExpType === "Expression") {
            customCss = customCss + executeLogic(logic);
          } else {
            const res = await getQueryResultForGlobalCellUpdate(logic);
            const val = Object.values(res)[0];
            customCss = customCss + val;
          }
          console.log("Final Cell with custom css", cell, customCss);
          cell.cellCSS = customCss;
          console.log("Final Cell after update the css", cell);
        } catch (error) {
          console.error(
            `❌ Failed to resolve disabled for ${cell.cellId}`,
            error,
          );
        }
      }
    }

    return data;
  }
  async function resolveAllInOrder(data, setGridDataTest = () => {}) {
    if (!Array.isArray(data)) return [];

    data = await resolveDepExpressions(data);
    data = await resolveDependentFields(data, setGridDataTest);

    data = await resolveApiFields(data);
    data = await resolveDisabledExpressions(data);

    return data;
  }

  const handleFileUpload = async (
    byteArray,
    file,
    elem,
    gridDataTest,
    setGridDataTest,
    pollObj,
    setPollObj,
  ) => {
    try {
      setIsProcessing(true);
      setLoading(true);

      console.log("📂 handleFileUpload triggered for:", elem.cellId);

      const fileName = file?.name ?? "";

      // Step 1: Update the uploaded file cell.
      let updatedGridDataTest = gridDataTest.map((form) => ({
        ...form,
        cellData: form.cellData.map((cell) =>
          cell.cellId === elem.cellId
            ? {
                ...cell,
                value: byteArray,
                imagePath: fileName,
              }
            : cell,
        ),
      }));

      console.log("📁 File uploaded:", {
        cellId: elem.cellId,
        fileName,
        byteArrayLength: byteArray?.length,
      });

      // Step 2: Process conditional CSS.
      if (elem.conditionalCssExpression?.trim()) {
        try {
          const logic = await findSQL(
            elem.conditionalCssExpression,
            elem,
            updatedGridDataTest,
          );

          let customCss = "";

          if (elem.conditionalCssExpType === "Expression") {
            customCss = executeLogic(logic);
          } else {
            const res = await getQueryResultForGlobalCellUpdate(logic);
            customCss = Object.values(res ?? {})[0] ?? "";
          }

          // Update the cell CSS without mutating elem.
          updatedGridDataTest = updatedGridDataTest.map((form) => ({
            ...form,
            cellData: form.cellData.map((cell) =>
              cell.cellId === elem.cellId
                ? { ...cell, cellCSS: customCss }
                : cell,
            ),
          }));

          console.log("🎨 Conditional CSS applied:", customCss);
        } catch (error) {
          console.error(
            `❌ Failed to resolve conditional CSS for ${elem.cellId}`,
            error,
          );
        }
      }

      // Step 3: Process global expressions.
      if (elem.globalExpressionLogic?.trim()) {
        const sql = await findSQL(
          elem.globalExpressionLogic,
          elem,
          updatedGridDataTest,
        );

        const sqlResult = await getQueryResultForGlobalCellUpdate(sql);

        console.log("🌐 Global Expression SQL:", sql);
        console.log("🧩 Global Expression Result:", sqlResult);

        const changedCells = [];

        updatedGridDataTest = updatedGridDataTest.map((form) => ({
          ...form,
          cellData: form.cellData.map((cell) => {
            const newVal =
              sqlResult?.[cell.cellId] ?? sqlResult?.[cell.aliasId];

            if (newVal !== undefined && cell.value !== newVal) {
              changedCells.push({ ...cell });

              return {
                ...cell,
                value: newVal,
              };
            }

            return cell;
          }),
        }));

        // Step 4: Process passive updates sequentially.
        for (const changed of changedCells) {
          console.log("🔄 Running passive update for:", changed.cellId);

          const passiveResult = await onPassiveFieldChange(
            changed,
            updatedGridDataTest,
            () => {},
            pollObj,
            setPollObj,
            [elem.cellId],
          );

          if (Array.isArray(passiveResult)) {
            updatedGridDataTest = passiveResult;
          }
        }
      }

      // Step 5: Process dependent fields sequentially.
      if (
        Array.isArray(elem.dependentFields) &&
        elem.dependentFields.length > 0
      ) {
        for (const dep of elem.dependentFields) {
          console.log("🔄 Processing dependent field:", dep.cellId);

          const depResult = await onDependentCellUpdate(
            dep,
            updatedGridDataTest,
            () => {},
            [elem.cellId],
            false,
          );

          if (Array.isArray(depResult)) {
            updatedGridDataTest = depResult;
          }
        }
      }

      // Step 6: Evaluate the disable expression.
      if (elem.disableExpressionLogic?.trim()) {
        const isExpr = elem.disabledExpType === "Expression";

        const disableVal = isExpr
          ? eval(
              await findSQL(
                elem.disableExpressionLogic,
                elem,
                updatedGridDataTest,
              ),
            )
          : await (async () => {
              const sql = await findSQL(
                elem.disableExpressionLogic,
                elem,
                updatedGridDataTest,
              );

              const sqlRes = await getQueryResultForGlobalCellUpdate(sql);

              return sqlRes ? Object.values(sqlRes)[0] : 0;
            })();

        const isDisabled =
          disableVal === 1 || disableVal === "1" || disableVal === true;

        updatedGridDataTest = updatedGridDataTest.map((form) => ({
          ...form,
          cellData: form.cellData.map((cell) =>
            cell.cellId === elem.cellId
              ? { ...cell, disabled: isDisabled }
              : cell,
          ),
        }));

        console.log("🔒 Disable expression applied:", isDisabled);
      }

      // Step 7: Evaluate polling start/stop expressions.
      for (const item of pollObj ?? []) {
        const { cell } = item;

        if (!cell?.cellId) continue;

        const shouldStart = async () => {
          if (!cell.pollStartExpressionLogic?.trim()) {
            return false;
          }

          const expOrSql = await findSQL(
            cell.pollStartExpressionLogic,
            cell,
            updatedGridDataTest,
          );

          if (cell.pollStartExpType === "Expression") {
            return Boolean(eval(expOrSql));
          }

          const sqlRes = await getQueryResultForGlobalCellUpdate(expOrSql);

          const result = sqlRes ? Object.values(sqlRes)[0] : 0;

          return result === 1 || result === "1" || result === true;
        };

        const shouldStop = async () => {
          if (!cell.pollStopExpressionLogic?.trim()) {
            return false;
          }

          const expOrSql = await findSQL(
            cell.pollStopExpressionLogic,
            cell,
            updatedGridDataTest,
          );

          // Use the stop expression's type when available.
          const stopType = cell.pollStopExpType ?? cell.pollStartExpType;

          if (stopType === "Expression") {
            return Boolean(eval(expOrSql));
          }

          const sqlRes = await getQueryResultForGlobalCellUpdate(expOrSql);

          const result = sqlRes ? Object.values(sqlRes)[0] : 0;

          return result === 1 || result === "1" || result === true;
        };

        const start = await shouldStart();
        const stop = await shouldStop();

        setPollObj((prevState) =>
          prevState.map((poll) =>
            poll.cell.cellId === cell.cellId
              ? {
                  ...poll,
                  autoRefresh: stop ? false : start,
                  pollInterval: start ? cell.pollInterval : poll.pollInterval,
                }
              : poll,
          ),
        );
      }

      // Step 8: Commit the final state once all processing is complete.
      const finalGridDataTest = updatedGridDataTest.map((form) => ({
        ...form,
        cellData: form.cellData.map((cell) => ({
          ...cell,
        })),
      }));

      setGridDataTest(finalGridDataTest);

      console.log(
        "✅ File upload and all dependent processing complete:",
        elem.cellId,
      );
    } catch (error) {
      console.error("❌ Error in handleFileUpload:", error);
      console.error("Stack:", error?.stack);
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  };

  const sendHandwritingToOCR = async (imageData, cellId) => {
    try {
      setIsProcessingHandwriting(true);

      const base64Image = imageData.split(",")[1];

      const binaryString = atob(base64Image);

      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const imageBlob = new Blob([bytes], { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("cell_id", cellId);
      formData.append("file", imageBlob, `${cellId}_handwriting.jpg`);

      console.log("=== Sending to OCR API ===");
      console.log("Byte array length:", bytes.length);
      console.log("Blob size:", imageBlob.size);
      console.log("Cell ID:", cellId);
      console.log("Filename:", `${cellId}_handwriting.jpg`);
      console.log("==========================");

      const response = await fetch(
        "https://op360.greenware.app:5000/handwriting",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status}: ${errorText}`);
      }

      const result = await response.json();
      const recognizedText = result[cellId] || "";

      console.log("OCR Result:", result);

      return {
        success: true,
        text: recognizedText,
        cellId: cellId,
        fullResponse: result,
      };
    } catch (error) {
      console.error("OCR API Error:", error);
      return {
        success: false,
        error: error.message,
        cellId: cellId,
      };
    } finally {
      setIsProcessingHandwriting(false);
    }
  };

  const handleToggleChange = (isOn) => {
    setIsHandwritingMode(isOn);
    if (!isOn && isCanvasOpen) {
      setIsCanvasOpen(false);
      setCurrentEditingCell(null);
    }
  };

  const handleTextFieldClick = (elem) => {
    if (isHandwritingMode && !isCanvasOpen) {
      setCurrentEditingCell(elem);
      setIsCanvasOpen(true);
    }
  };

  const handleCanvasCancel = () => {
    setIsCanvasOpen(false);
    setCurrentEditingCell(null);
    setOcrError(null);
  };

  const handleHandwritingComplete = async (handwritingData) => {
    if (!currentEditingCell) {
      console.error("No current editing cell");
      return;
    }

    try {
      const ocrResult = await sendHandwritingToOCR(
        handwritingData.imageData,
        currentEditingCell.cellId,
      );

      if (ocrResult.success) {
        const updatedGridData = gridDataTest.map((item) => ({
          ...item,
          cellData: item.cellData.map((cell) => {
            if (cell.cellId === currentEditingCell.cellId) {
              return {
                ...cell,
                value: ocrResult.text, // Set the OCR text directly
              };
            }
            return cell;
          }),
        }));

        setGridDataTest(updatedGridData);

        try {
          const storageKey = `handwriting_${currentEditingCell.cellId}_${handwritingData.timestamp}`;
          localStorage.setItem(
            storageKey,
            JSON.stringify({
              image: handwritingData.imageData,
              recognizedText: ocrResult.text,
              cellId: currentEditingCell.cellId,
              cellName: currentEditingCell.aliasId,
              timestamp: handwritingData.timestamp,
              ocrData: ocrResult.data,
            }),
          );
        } catch (e) {
          console.warn("Could not save handwriting data to localStorage:", e);
        }

        setOcrSuccess(true);
        console.log("OCR Success:", {
          cellId: currentEditingCell.cellId,
          recognizedText: ocrResult.text,
        });
      } else {
        setOcrError(`OCR Failed: ${ocrResult.error}`);
        console.error("OCR Error:", ocrResult.error);
      }
    } catch (error) {
      console.error("Error processing handwriting:", error);
      setOcrError(`Error: ${error.message}`);
    } finally {
      setIsCanvasOpen(false);

      setCurrentEditingCell(null);
    }
  };

  const handleCloseSnackbar = () => {
    setOcrError(null);
    setOcrSuccess(false);
  };

  const handleValueChange = (newValue, elem, gridDataTest, setGridDataTest) => {
    const updatedGridData = gridDataTest.map((row) =>
      row.map((cell) => {
        if (cell.cellId === elem.cellId) {
          return {
            ...cell,
            value: newValue, // Set to null when deleted
            fileContent: null, // Clear file content
            imagePath: null, // Clear image path
          };
        }
        return cell;
      }),
    );

    setGridDataTest(updatedGridData);
  };

  const isSameUserTransaction = transactionData.userId === getCurrentUser;
  return gridDataTest?.length > 0 ? (
    <>
      {console.log("Grid Data in Return : ", gridDataTest)}
      {!Object.keys(logData ?? {}).length > 0 && (
        <ScrollToTop color="blue" smooth />
      )}

      <div style={{ marginLeft: "3rem" }}>
        <Container maxWidth="xl" sx={{ padding: "0" }}>
          <div>
            {offlineData?.confirmation && (
              <RestoreNotification
                title="Previous Session Found"
                description={
                  !isSameUserTransaction
                    ? `Warning: Restoring the data saved at ${formatDatetime(offlineData.savedAt)} will override your current unsaved data. Do you want to continue?`
                    : `Warning: This will override your current data with the data saved by ${transactionData.userId} at ${formatDatetime(transactionData.transactionTimestamp)}. Do you want to continue?`
                }
                onConfirm={() => {
                  restoreOfflineTransactions(
                    gridDataRef.current,
                    offlineData.payload,
                  );
                }}
                showOnMount={true}
              />
            )}
            {!Object.keys(logData ?? {}).length > 0 && (
              <Box
                sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}
              >
                <i
                  className="pi pi-arrow-circle-left"
                  onClick={() => {
                    navigate(-1, { replace: true });
                  }}
                  style={{
                    paddingRight: ".45rem",
                    cursor: "pointer",
                    fontSize: "1.2rem",
                  }}
                />

                <Badge
                  badgeContent={
                    isTransactionError ? (
                      <Tooltip
                        title={
                          <span>
                            Error Msg: {errorMsg} <br />
                            Error By: {errorBy}
                          </span>
                        }
                        placement="top"
                      >
                        <WarningIcon color="error" fontSize="medium" />
                      </Tooltip>
                    ) : null
                  }
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      bgcolor: "primary.light",
                      color: "primary.contrastText",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "16px",
                      display: "inline-block",
                    }}
                  >
                    {formName}
                  </Typography>
                </Badge>
                {versionPart && selectedLogbookPart && (
                  <>
                    {/* Download Excel Icon Button */}
                    <Tooltip title="Download Excel" placement="top">
                      <IconButton
                        onClick={handleDownloadGridExcel}
                        size="small"
                        sx={{
                          bgcolor: "primary.light",
                          color: "primary.contrastText",
                          p: "4px",
                          "&:hover": {
                            bgcolor: "primary.main",
                            color: "white",
                          },
                        }}
                      >
                        <DownloadForOfflineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </Box>
            )}
            {!(versionPart && selectedLogbookPart) && (
              <>
                <Affix>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                    }}
                  >
                    <SwitchMicButton
                      isPublicAccess={isPublicAccess}
                      setIsPublicAccess={setIsPublicAccess}
                      offLabel="Mic OFF (Beta)"
                      onLabel="Mic ON (Beta)"
                      OffIcon={MicOffIcon}
                      OnIcon={MicIcon}
                      updatedGridDataTest={gridDataTest}
                      setGridDataTest={setGridDataTest}
                      onPassiveFieldChange={onPassiveFieldChange}
                      pollObj={pollObj}
                      setPollObj={setPollObj}
                    />

                    {!isPublicAccess && (
                      <HandwritingToggle
                        isHandwritingMode={isHandwritingMode}
                        isCanvasOpen={isCanvasOpen}
                        currentEditingCell={currentEditingCell}
                        onToggleChange={handleToggleChange}
                        onCanvasOpen={() => setIsCanvasOpen(true)}
                        onCanvasClose={() => setIsCanvasOpen(false)}
                        onHandwritingComplete={handleHandwritingComplete}
                        onCanvasCancel={handleCanvasCancel}
                      />
                    )}

                    {!isOnline.online && (
                      <Box mt={1}>
                        <Chip
                          icon={
                            <TipsAndUpdatesRoundedIcon
                              sx={{ color: "#f57c00" }}
                            />
                          } // custom icon color
                          label="You're currently offline. Don't worry, your changes are safe and will be synced."
                          size="medium"
                          sx={{
                            backgroundColor: "#fff3e0",
                            color: "#e65100",
                            border: "1px solid #f57c00",
                            fontWeight: 500,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: "8px",
                          }}
                        />
                      </Box>
                    )}
                  </div>
                </Affix>
              </>
            )}
          </div>
          {isProcessingHandwriting && (
            <Box
              sx={{
                position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10000,
              }}
            >
              <CircularProgress size={60} sx={{ color: "#fff" }} />
              <p
                style={{
                  color: "#fff",
                  marginTop: "20px",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                Processing Handwriting...
              </p>
              <p
                style={{
                  color: "#ddd",
                  marginTop: "8px",
                  fontSize: "14px",
                }}
              >
                Converting your writing to text
              </p>
            </Box>
          )}

          <Snackbar
            open={ocrSuccess}
            autoHideDuration={4000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="success"
              sx={{ width: "100%" }}
            >
              Handwriting successfully converted to text!
            </Alert>
          </Snackbar>

          <Snackbar
            open={!!ocrError}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="error"
              sx={{ width: "100%" }}
            >
              {ocrError}
            </Alert>
          </Snackbar>

          {isProcessing && (
            <>
              <Box
                sx={{
                  position: "fixed",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 9999, // Ensure it appears on top
                }}
              >
                <CircularProgress />
              </Box>
            </>
          )}
          {Object.keys(logData ?? {}).length === 0 && <CustomScrollBottom />}
          <div id="logbook">
            {logData === undefined && <></>}
            <Grid style={containerStyle}>
              {gridDataTest.map((item, index) =>
                item.cellData.map((elem, ind) => (
                  <Paper
                    key={elem.cellId}
                    sx={{
                      padding: "0.8rem",
                      fontSize: "0.8rem",
                      gridColumn: `span ${elem.colSpan}`,
                      gridRow: `span ${elem.rowSpan}`,
                      alignContent: "center",

                      ...convertCssStringToMuiStyles(elem.cellCSS),
                    }}
                  >
                    {Object.keys(transactionData).length !== 0 &&
                      elem.editable &&
                      elem.fieldType !== "Image" &&
                      elem.fieldType !== "Button" &&
                      elem.fieldType !== "File" && <></>}

                    {elem.editable &&
                      elem.fieldType !== "Image" &&
                      elem.fieldType !== "Button" &&
                      elem.fieldType !== "File" &&
                      elem.disabled === false &&
                      isPublicAccess && (
                        <span
                          style={{
                            color: "red",
                            fontSize: "15px",
                            fontWeight: "bold",
                          }}
                        >
                          {cellIdToExcelReference(elem.cellId)}
                        </span>
                      )}
                    {elem.fieldType === "Image" && (
                      <Image
                        elem={elem}
                        height={elem.imgHeight}
                        width={elem.imgWidth}
                      />
                    )}

                    {elem.fieldType === "File" && elem.editable === false && (
                      <FileCellComponent
                        elem={elem}
                        onFileUpload={(byteArray, file) =>
                          handleFileUpload(
                            byteArray,
                            file,
                            elem,
                            gridDataTest,
                            setGridDataTest,
                          )
                        }
                        onValueChange={(newValue) =>
                          handleValueChange(
                            newValue,
                            elem,
                            gridDataTest,
                            setGridDataTest,
                          )
                        }
                        byteArray={elem.value}
                        fileNamePath={elem.imagePath}
                        error={errors[elem.cellId]}
                        editable={elem.editable}
                      />
                    )}

                    {elem.fieldType === "File" && elem.editable === true && (
                      <div>
                        <FileCellComponent
                          elem={elem}
                          onFileUpload={(byteArray, file) =>
                            handleFileUpload(
                              byteArray,
                              file,
                              elem, // This should refer to the clicked elem
                              gridDataTest,
                              setGridDataTest,
                            )
                          }
                          byteArray={elem.value}
                          fileNamePath={elem.imagePath}
                          error={errors[elem.cellId]}
                          editable={elem.editable}
                        />
                      </div>
                    )}

                    {elem.fieldType === "Button" && (
                      <Button
                        disabled={elem.disabled}
                        variant="contained"
                        color="primary"
                        onClick={(e) =>
                          handleButtonClick(
                            e,
                            elem,
                            gridDataTest,
                            setGridDataTest,
                            pollObj,
                            setPollObj,
                          )
                        }
                      >
                        {elem.buttonKeyValue || elem.aliasId}
                      </Button>
                    )}
                    {!elem.editable &&
                      elem.fieldType !== "Image" &&
                      elem.fieldType !== "Button" &&
                      elem.fieldType !== "API" && (
                        <Label
                          elem={elem}
                          pollObj={pollObj}
                          setPollObj={setPollObj}
                          gridDataTest={gridDataTest}
                          setGridDataTest={setGridDataTest}
                          findSQL={findSQL}
                          getQueryResultForGlobalCellUpdate={
                            getQueryResultForGlobalCellUpdate
                          }
                          onDependentCellUpdate={onDependentCellUpdate}
                          onPassiveFieldChange={onPassiveFieldChange}
                        />
                      )}
                    {elem.fieldType === "API" && (
                      <LabelApi
                        elem={elem}
                        pollObj={pollObj}
                        setPollObj={setPollObj}
                        gridDataTest={gridDataTest}
                        setGridDataTest={setGridDataTest}
                        findSQL={findSQL}
                        getQueryResultForGlobalCellUpdate={
                          getQueryResultForGlobalCellUpdate
                        }
                      />
                    )}
                    {elem.editable &&
                      (elem.fieldType === "Text" ||
                        elem.fieldType === "CommentBox") && (
                        <>
                          <div style={{ transform: "scale(0.7)" }}>
                            {isHandwritingMode ? (
                              <EditIcon fontSize="small" />
                            ) : (
                              <></>
                            )}
                          </div>

                          <InputTextBox
                            isHandwritingMode={isHandwritingMode}
                            handleTextFieldClick={() =>
                              handleTextFieldClick(elem)
                            }
                            elem={elem}
                            onTextChange={(e) =>
                              onTextChange(
                                e,
                                elem,
                                gridDataTest,
                                setGridDataTest,
                                pollObj,
                                setPollObj,
                              )
                            }
                            onValueTextChange={(e) =>
                              onValueTextChange(
                                e,
                                elem,
                                gridDataTest,
                                setGridDataTest,
                              )
                            }
                            gridDataTest={gridDataTest}
                            setGridDataTest={setGridDataTest}
                            error={errors[elem.cellId] !== undefined}
                            helperText={errors[elem.cellId]}
                          />
                        </>
                      )}

                    {elem.fieldType === "URL" && (
                      <>
                        {console.log(
                          "Elem url :",
                          elem.url,
                          "Elem Type :",
                          elem.fieldType,
                          "Elem CellId :",
                          elem.cellId,
                        )}
                        <PrimeButton
                          iconPos="right"
                          icon={"pi pi-external-link"}
                          label={elem.url}
                          link
                          onClick={() =>
                            window.open(`http://${elem.url}`, "_blank")
                          }
                        />
                      </>
                    )}
                    {elem.editable && elem.fieldType === "Number" && (
                      <>
                        <div>
                          <div style={{ transform: "scale(0.7)" }}>
                            {isHandwritingMode ? (
                              <EditIcon fontSize="small" />
                            ) : (
                              <></>
                            )}
                          </div>

                          <NumberBox
                            isHandwritingMode={isHandwritingMode}
                            handleTextFieldClick={() =>
                              handleTextFieldClick(elem)
                            }
                            label={elem.aliasId}
                            value={elem.value}
                            disabled={isProcessing || elem.disabled} // ← Add isProcessing check
                            onNumberChange={(e) =>
                              onNumberChange(
                                e,
                                elem,
                                gridDataTest,
                                setGridDataTest,
                                pollObj, // ← ADD THIS
                                setPollObj, // ← ADD THIS
                              )
                            }
                            required={elem.requiredfield}
                            max={elem.maxVal}
                            min={elem.minVal}
                            onValueNumberChange={(e) =>
                              onValueNumberChange(
                                e,
                                elem,
                                gridDataTest,
                                setGridDataTest,
                              )
                            }
                            error={errors[elem.cellId] !== undefined}
                            helperText={errors[elem.cellId]}
                          />
                        </div>
                      </>
                    )}
                    {elem.editable && elem.fieldType === "Dropdown" && (
                      <Dropdown
                        updatedGridDataTest={gridDataTest}
                        setGridDataTest={setGridDataTest}
                        findSQL={findSQL}
                        elem={elem}
                        error={errors[elem.cellId] !== undefined}
                        helperText={errors[elem.cellId]}
                        onCellValueChange={(e) =>
                          onCellValueChange(
                            e,
                            elem,
                            gridDataTest,
                            setGridDataTest,
                            pollObj,
                            setPollObj,
                          )
                        }
                        onRefreshDropdown={() => handleRefreshDropdown(elem)} // ← ADD THIS
                      />
                    )}
                    {elem.editable && elem.fieldType === "Date" && (
                      <DateField
                        elem={elem}
                        onDateChange={(e) =>
                          onDateChange(
                            e,
                            elem,
                            gridDataTest,
                            setGridDataTest,
                            pollObj, // ← ADD THIS
                            setPollObj, // ← ADD THIS
                          )
                        }
                        setGridDataTest={setGridDataTest}
                        gridDataTest={gridDataTest}
                        error={errors[elem.cellId] !== undefined}
                        helperText={errors[elem.cellId]}
                        disabled={isProcessing || elem.disabled} // ← ADD THIS
                      />
                    )}
                    {elem.editable && elem.fieldType === "DateTime" && (
                      <DateTimeField
                        elem={elem}
                        onDateTimeChange={(e) =>
                          onDateTimeChange(
                            e,
                            elem,
                            gridDataTest,
                            setGridDataTest,
                            pollObj, // ← ADD THIS
                            setPollObj, // ← ADD THIS
                          )
                        }
                        error={errors[elem.cellId] !== undefined}
                        helperText={errors[elem.cellId]}
                        disabled={isProcessing || elem.disabled} // ← ADD THIS
                      />
                    )}
                    {elem.fieldType === "Time" && <TimeField elem={elem} />}

                    {elem.editable && elem.fieldType === "Boolean" && (
                      <Checkbox
                        title={elem.aliasId}
                        checked={elem.value || false}
                        onChange={(e) =>
                          onBooleanChange(
                            e,
                            elem,
                            gridDataTest,
                            setGridDataTest,
                            pollObj, // ← ADD THIS
                            setPollObj, // ← ADD THIS
                          )
                        }
                        required={elem.requiredfield}
                        disabled={
                          isProcessing || !elem.editable || elem.disabled
                        } // ← ADD isProcessing
                      />
                    )}
                  </Paper>
                )),
              )}
              {gridProperties?.occupiedGrid.map((row, rowIndex) =>
                row.map((isOccupied, colIndex) => {
                  if (!isOccupied) {
                    return (
                      <Paper
                        key={`empty-${rowIndex}-${colIndex}`}
                        elevation={0} // No shadow for empty cells
                        sx={{
                          gridColumn: `span ${colIndex + 1}`,
                          gridRow: `span ${rowIndex + 1}`,
                          gridColumnStart: colIndex + 1,
                          gridRowStart: rowIndex + 1,
                          padding: "35px",
                          textAlign: "center",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          position: "relative",
                          border: "2px",

                          boxShadow: 2,
                        }}
                      />
                    );
                  }
                  return null; // Return null for occupied spaces
                }),
              )}
              {false &&
                logData === undefined &&
                !(versionPart && selectedLogbookPart) && (
                  <div style={{ margin: "1rem 0" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<CheckCircleIcon />}
                      onClick={async (e) =>
                        handleSave(
                          e,
                          gridDataTest,
                          setRemarkDiag,
                          transactionData,
                          setCellChanges,
                          setNewTransacData,
                          setTransactionData,
                          jobId,
                          activityId,
                          formName,
                          versionNumber,
                        )
                      }
                    >
                      Save
                    </Button>
                  </div>
                )}

              <div
                style={{
                  margin: "1rem 0",
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                }}
              >
                {/* <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<FileDownloadIcon />}
                  onClick={handleDownloadGridExcel}
                >
                  Download Excel
                </Button> */}
                {isTransactionError && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CheckCircleIcon />}
                    onClick={(e) =>
                      handleSaveTransaction(
                        "_",
                        gridDataTest,
                        setRemarkDiag,
                        setCellChanges,
                        setNewTransacData,
                        setTransactionData,
                        jobId,
                        activityId,
                        formName,
                        versionNumber,
                        userId,
                        false,
                        true,
                      )
                    }
                  >
                    Save Manually
                  </Button>
                )}
              </div>
            </Grid>
          </div>
          <br />

          <Modal
            open={open}
            onClose={(e) => handleClose(e, setOpen)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            disableScrollLock={true}
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Change History for {cellObj.aliasId} {cellObj.cellId}
              </Typography>

              <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 440 }}>
                <Table
                  stickyHeader
                  sx={{ minWidth: 700 }}
                  aria-label="customized table"
                >
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>TransactionId</StyledTableCell>
                      <StyledTableCell align="right">Timestamp</StyledTableCell>
                      <StyledTableCell align="right">User</StyledTableCell>
                      <StyledTableCell align="right">Value</StyledTableCell>
                      <StyledTableCell align="right">
                        Change Reason
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cellHistoryRows
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      )
                      .map((row) => (
                        <StyledTableRow key={row.transactionId}>
                          <StyledTableCell component="th" scope="row">
                            {row.transactionId}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {row.timestamp}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {row.userid}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {row.value}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {row.reason}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={cellHistoryRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) =>
                  handleChangePage(event, newPage, setPage)
                }
                onRowsPerPageChange={(event) =>
                  handleChangeRowsPerPage(event, setRowsPerPage, setPage)
                }
              />
            </Box>
          </Modal>

          <Dialog
            header="Confirm Changes"
            visible={remarkDiag}
            style={{ width: "80vw" }}
            modal
            onHide={() => setRemarkDiag(false)}
          >
            <div sx={style}>
              {!isOnline.online && (
                <Box mt={1}>
                  <Chip
                    icon={
                      <TipsAndUpdatesRoundedIcon sx={{ color: "#f57c00" }} />
                    } // custom icon color
                    label="You're currently offline. Don't worry, your changes are safe and will be synced."
                    size="medium"
                    sx={{
                      backgroundColor: "#fff3e0",
                      color: "#e65100",
                      border: "1px solid #f57c00",
                      fontWeight: 500,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "8px",
                    }}
                  />
                </Box>
              )}

              <div
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Button
                  style={{ marginRight: "10px" }}
                  variant="contained"
                  color="primary"
                  onClick={(e) =>
                    handleSaveAsDraft(
                      e,

                      cellChanges,
                      setRemarkDiag,
                      jobId,
                      activityId,
                      formName,
                      versionNumber,
                      userId,
                      newTransacData,
                    )
                  }
                >
                  Save as Draft
                </Button>

                {isOnline.online && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) =>
                      handleSaveClose(
                        e,
                        gridDataTest,

                        cellChanges,
                        setRemarkDiag,
                        jobId,
                        activityId,
                        formName,
                        versionNumber,
                        userId,
                        newTransacData,
                        navigate,
                      )
                    }
                  >
                    Save & Close
                  </Button>
                )}
              </div>
            </div>
          </Dialog>
          <div>
            <SnackbarComponent
              openPopup={snackbarOpen} // State to control snackbar open/close
              setOpenPopup={setSnackbarOpen} // Function to update snackbar state
              dialogMessage={snackbarText} // Message to display in the snackbar
              snackbarSeverity={snackbarSeverity} // Severity level of the snackbar (e.g., success, error)
            />
          </div>
          {console.log("My sqlErrorList : ", sqlErrorList)}
          {sqlErrorList.length > 0 && (
            <SnackbarComponent
              openPopup={openError}
              setOpenPopup={setOpenError}
              dialogMessage={sqlErrorList[currentIndex].value}
              snackbarSeverity="error"
              onCloseOverride={handleCloseError}
            />
          )}
        </Container>
      </div>
      <br />
    </>
  ) : (
    <div>
      <LogbookSkeleton />
    </div>
  );
}

export default LogbookForm;
