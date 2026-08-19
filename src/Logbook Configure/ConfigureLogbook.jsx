import DescriptionIcon from "@mui/icons-material/Description";
import GroupIcon from "@mui/icons-material/Group";
import ImageIcon from "@mui/icons-material/Image";
import PersonIcon from "@mui/icons-material/Person";
import { Dropdown } from "primereact/dropdown"; // Import Dropdown
import { FileUpload } from "primereact/fileupload";
import React, { useEffect, useRef, useState, version } from "react";
import BookIcon from "@mui/icons-material/MenuBook";
import HomeIcon from "@mui/icons-material/Home"; // Import home icon
import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Container,
  Tooltip,
} from "@mui/material";
import { Divider, Flex, Progress } from "antd";
import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Panel } from "primereact/panel";
import ScrollToTop from "react-scroll-to-top";
import CustomDialog from "../components/shared/dialog/dialog.component";
import SnackbarComponent from "../components/shared/snackbar/customSnackbar";
import { extendTokenExpiration } from "../helper/AuthService";
import {
  getAllCellInfoByFormNameAndVersion,
  SaveLogbookMetaInfoToMongo,
} from "../Logbook/LogbookApi";
import LogbookForm from "../Logbook/View/LogbookForm";
import { getCurrentUser } from "../UserModuleUpdated/helper";
import {
  getTenantID,
  getUserDetailsByUserID,
} from "../UserModuleUpdated/UsermoduleApi";
import { getFormDetailbyFormName, saveLogbook } from "./ConfigureLogbookAPI";
import CustomScrollBottom from "./CustomScrollBottom";
import DocumentForm from "./DocumentForm";
import ExcelDownloader from "./ExcelDownloader";
import FormGrid from "./FormGrid";
import LogbookMaster from "./LogbookMaster";
import PickListDemo from "./PickListDemo";
import SwitchButton from "./SwitchButton";
import { ToggleButton } from "primereact/togglebutton";
import ButtonStyle from "../style/components/Button/Button.module.css";
import DialogStyle from "../style/components/Dialog/Dialog.module.css";
import infoButton from "../style/components/Button/infoButton.module.css";
import ConfigureLogbookSwitchButton from "./ConfigureLogbookSwitchButton";
import { motion } from "framer-motion";
import PickListDemoWithoutInternet from "./PickListDemoWithoutInternet";
function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(false);

  const checkInternet = async () => {
    try {
      // lightweight request
      await fetch("https://www.google.com/favicon.ico", {
        mode: "no-cors",
        cache: "no-store",
      });
      setIsOnline(true);
    } catch (error) {
      setIsOnline(false);
    }
  };

  useEffect(() => {
    const updateOnline = () => checkInternet();
    const updateOffline = () => setIsOnline(false);

    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOffline);

    // initial check
    checkInternet();

    return () => {
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOffline);
    };
  }, []);

  return isOnline;
}
const ConfigureLogbook = ({ tableForm, setTableForm }) => {
  console.log("tableForm : ", tableForm);
   const isOnline = useNetworkStatus();
   console.log("isOnline : ",isOnline)
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const toast = useRef(null);
  const [snackbarText, setSnackbarText] = useState("Data saved !"); // Text for the snackbar notification
  const [snackbarSeverity, setsnackbarSeverity] = useState("success"); // Severity level for the snackbar (success, error, etc.)
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Boolean to control snackbar visibility
  const [showCreation, setShowCreation] = useState(false); // State to control visibility of creation form
  const [imageData, setImageData] = useState(null);
  const fileName = "matser";
  const [loadingPercentage, setLoadingPercentage] = useState(0);

  const [sheetList, setSheetList] = useState([]); // State for storing sheet list
  const [selectedSheet, setSelectedSheet] = useState(null); // State for selected sheet
  const [allSheet, setAllSheet] = useState(null);
  const [sheetDetails, setSheetDetails] = useState([]);
  const [logTblQuery, setLogTblQuery] = useState("SELECT 1");
  const [department, setDepartment] = useState("");
  const [group, setGroup] = useState([]); // Change initial state to an array for multiselect
  const [documentId, setDocumentId] = useState("");
  const [formatID, setformatID] = useState("");
  const [textAreaValue, setTextAreaValue] = useState("");
  const [logData, setLogData] = useState([]);
  const [existingForm, setExistingForm] = useState(null);
  const [isExcelUpload, setIsExcelUpload] = useState(false);
  const [isViewLogbook, setIsViewLogbook] = useState(false);
  const [verChnageOpen, setVerChnageOpen] = useState(false);
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [delOpen, setDelOpen] = useState(false); // Boolean to control delete confirmation dialog visibility
  const [isPublicAccess, setIsPublicAccess] = useState(false);
  const [dashboardType, setDashboardType] = useState(false);
  const [external, setExternal] = useState(false);

  const loggedInUser = getCurrentUser();
  const [excelLoading, setExcelLoading] = useState(0);

  const invoiceUploadHandler = async ({ files, options }) => {
    const [file] = files;

    if (!file) return;

    const isExcel =
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel";

    const isJSON = file.type === "application/json";

    // Added image type check
    const isImage = file.type.startsWith("image/");

    if (!isExcel && !isJSON && !isImage) {
      alert("Only Excel, JSON, or Image files are supported.");
      if (options && options.clear) {
        options.clear();
      }
      return;
    }

    // If JSON file, just log it and return
    if (isJSON) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          console.log(
            "Uploaded JSON content:",
            jsonData,
            Object.keys(jsonData),
          );
          // setAllSheet(jsonData);
          // setSheetList(Object.keys(jsonData));
          // if (Object.keys(jsonData).length === 1) {
          //   setSelectedSheet(Object.keys(jsonData)[0]);
          // }

          // console.log(jsonData[Object.keys(jsonData)[0]]);
          setSheetDetails(jsonData?.formModel);
          setSelectedSheet(jsonData?.formName);
          setDocumentId(jsonData?.documentId);
          setDepartment(jsonData?.department);
          setGroup(jsonData?.group);
          setformatID(jsonData?.formatID);
          setTextAreaValue(jsonData?.saveSQL);
          setExcelLoading(100);
          setIsFileUploaded(true);
        } catch (err) {
          console.error("Invalid JSON file:", err);
        }
      };
      reader.readAsText(file);

      if (options && options.clear) {
        options.clear();
      }
      return;
    }

    // If Image file, log some info and return
    if (isImage) {
      console.log("Image uploaded:", file); // Simple log of the file object
      await handleImageUpload(file);
      return;
    }

    // If Excel, continue the upload process
    setExcelLoading(50);
    uploadInvoice(file);
  };
  const uploadInvoice = async (invfile) => {
    const file = new FormData();
    file.append("file", invfile);
    setExcelLoading(70);
    let fieldTypes = {};
    try {
      const response = await axios.post(
        "https://op360.greenware.app:5000/upload_excel/",
        file,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("Data type Data : ", response.data);
      fieldTypes = response.data.results;
    } catch (error) {
      console.error("Upload failed:", error);
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_LOGBOOK}/logbook/uploadExcelFile`,
        file,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const sheetList = Object.keys(response.data);
      console.log("Upload Excel Only sheetList : ", sheetList);

      if (sheetList.length === 0) {
        console.log("Upload Excel Only");

        setExcelLoading(0);
        setsnackbarSeverity("error");
        setSnackbarText("invalid file");
        setSnackbarOpen(true);
        // setSheetList([]);
        // setSelectedSheet(null);
        // setSheetDetails([]);
        // setDelOpen(false);
        return;
      }
      const mainSheetData = response?.data;
      const updatedSheetDetails = updateSheetDetails(mainSheetData, fieldTypes);
      console.log(updatedSheetDetails);
      // setAllSheet(response.data);
      // setAllSheet(mainSheetData);
      setAllSheet(updatedSheetDetails);

      setSheetList(sheetList); // Set the sheet list from response
      if (sheetList.length === 1) {
        setSelectedSheet(sheetList[0]);
      }
      console.log("log Response : ", response.data);
      console.log("Keys : ", sheetList);
      setExcelLoading(100);
      setTimeout(() => {
        setIsFileUploaded(true);
        setExcelLoading(0);
      }, 200);
    } catch (error) {
      console.log(error);
    }
  };
  //Without exception
  // function updateSheetDetails(sheetDetails, fieldTypes) {
  //   for (const sheetKey in sheetDetails) {
  //     if (sheetDetails.hasOwnProperty(sheetKey)) {
  //       sheetDetails[sheetKey].forEach((form) => {
  //         form.cellInfo.forEach((cell) => {
  //           const fieldTypeObj = fieldTypes[sheetKey]?.[cell.cellId];
  //           if (fieldTypeObj && fieldTypeObj.datatype) {
  //             const type = fieldTypeObj.datatype;
  //             cell.fieldType = type;
  //             cell.editable = true;
  //             if (type === "DateTime") {
  //               cell.datePattern = "dd/MM/yyyy hh:mm";
  //             }
  //           }
  //         });
  //       });
  //     }
  //   }
  //   return sheetDetails;
  // }

  //with Exception
  function updateSheetDetails(sheetDetails, fieldTypes) {
    for (const sheetKey in sheetDetails) {
      if (sheetDetails.hasOwnProperty(sheetKey)) {
        sheetDetails[sheetKey].forEach((form) => {
          form.cellInfo.forEach((cell) => {
            const fieldTypeObj = fieldTypes[sheetKey]?.[cell.cellId];
            if (fieldTypeObj) {
              // Check if Exception exists
              // if (fieldTypeObj.Exception?.trim()) {
              //   console.log(fieldTypeObj.Exception); // Print the exception message
              //   console.log(
              //     "My Exception : ",
              //     fieldTypes[sheetKey]?.[cell.cellId],
              //     fieldTypeObj,
              //     fieldTypeObj.Exception
              //   );
              //   // setsnackbarSeverity("error");
              //   // setSnackbarText(`Exception : ${fieldTypeObj.Exception}`);
              //   // setSnackbarOpen(true);
              //   return; // Exit the function early
              // }

              const type = fieldTypeObj.datatype;
              cell.fieldType = type;
              cell.editable = true;
              cell.exception = fieldTypeObj.Exception;
              cell.context = fieldTypeObj.Explanation;
              cell.aliasId = "";
              if (type === "DateTime") {
                cell.datePattern = "dd/MM/yyyy hh:mm";
              }
            }
          });
        });
      }
    }
    return sheetDetails;
  }

  useEffect(() => {
    extendTokenExpiration();
    getCellDetailsByFormNameandVersion();
  }, []);

  useEffect(() => {
    console.log("Updated Sheet Details:", sheetDetails);
  }, [sheetDetails]);

  useEffect(() => {
    if (allSheet && selectedSheet != null && allSheet[selectedSheet]) {
      console.log("Second useEffect called");
      const qwerty = allSheet[selectedSheet].flatMap((form) =>
        form.cellInfo.map((cell) => cell.cellId),
      );
      // Log the result
      // console.error("qwerty ::: ", qwerty);

      const parsedCells = qwerty.map((cell) => {
        const [_, row, col] = cell.split("_").map(Number); // Extract row and column as numbers
        // console.log("{ row, col } ::: ", { row, col });
        return { row, col };
      });
      console.log("parsedCells ::: ", parsedCells);
      if (parsedCells?.length === 0) {
        setsnackbarSeverity("error");
        setSnackbarText("No Cell Found");
        setSnackbarOpen(true);
        return;
      }
      // Calculate the first row number and the minimum column number
      const firstRow = parsedCells[0].row; // Row number of the first element
      // console.log("firstRow ::: ", firstRow);
      const firstCol = Math.min(...parsedCells.map((cell) => cell.col)); // Minimum column value
      // console.log("firstCol ::: ", firstCol);
      // Transform the cell array based on new logic
      const transformedArray = parsedCells.map((cell) => {
        const newRow = cell.row + 1 - firstRow; // Subtract first row number
        const newCol = cell.col + 1 - firstCol; // Subtract minimum column value
        // console.log("cell.row ::: ", cell.row, " ::: newRow ::: ", newRow);
        // console.log("cell.col ::: ", cell.col, " ::: newCol ::: ", newCol);
        // console.log("---------------------------------------");
        return `_${newRow}_${newCol}`; // Rebuild the cellId
      });

      // console.log("transformedArray : : ", transformedArray);
      compactArray(transformedArray);

      let tempSheetDetails = allSheet[selectedSheet];

      let transformedIndex = 0; // To track the transformed cellIds
      tempSheetDetails.forEach((form) => {
        form.cellInfo.forEach((cell) => {
          cell.rowNum = getRowNumFromCellId(transformedArray[transformedIndex]);
          cell.colNum = getColNumFromCellId(transformedArray[transformedIndex]);
          cell.cellId = transformedArray[transformedIndex];
          transformedIndex++;
        });
      });
      setSheetDetails(tempSheetDetails);
      console.log("Sheet Name : ", selectedSheet);
      console.log("Sheet Details initalis : ", allSheet[selectedSheet]);
      setDepartment("");
      setTextAreaValue("");
      setGroup([]);
      setDocumentId("");
      setformatID("");
      setDisable(false);
      setExistingForm(null);
      getFormdetailsByFormName(selectedSheet);
      console.log("Second useEffect completed");
    }
  }, [selectedSheet, allSheet]);
  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Compacts an array of cell IDs by normalizing the row and column numbers.
   *
   * The input array is expected to contain strings of the form "_<row>_<col>".
   * The function will update the input array in place, replacing each cell ID
   * with a new ID that is compacted based on the minimum and maximum row and
   * column values.
   *
   * @param {string[]} inputArray - The array of cell IDs to compact.
   */
  /*******  8f25fa71-d14e-43c7-8931-7dfaeda1fc59  *******/
  function compactArray(inputArray) {
    // Parse the input to extract row and column numbers
    const parsedArray = inputArray.map((item) => {
      const [row, col] = item.slice(1).split("_").map(Number);
      return { row, col };
    });

    // Extract unique rows and columns
    const uniqueRows = [...new Set(parsedArray.map((item) => item.row))].sort(
      (a, b) => a - b,
    );
    const uniqueCols = [...new Set(parsedArray.map((item) => item.col))].sort(
      (a, b) => a - b,
    );

    // Create maps to normalize rows and columns
    const rowMap = new Map(
      uniqueRows.map((value, index) => [value, index + 1]),
    );
    const colMap = new Map(
      uniqueCols.map((value, index) => [value, index + 1]),
    );

    // Update the input array in place
    inputArray.forEach((item, index) => {
      const [row, col] = item.slice(1).split("_").map(Number);
      const newRow = rowMap.get(row);
      const newCol = colMap.get(col);
      inputArray[index] = `_${newRow}_${newCol}`;
    });
  }
  function getRowNumFromCellId(inputString) {
    const parts = inputString.split("_"); // Split the string by "_"
    // console.error("Number(parts[1]) ::: ", Number(parts[1]));
    return Number(parts[1]); // Convert the second part to a number and return
  }

  function getColNumFromCellId(inputString) {
    const parts = inputString.split("_"); // Split the string by "_"
    // console.error("Number(parts[2]) ::: ", Number(parts[2]));
    return Number(parts[2]); // Convert the second part to a number and return
  }

  const updateLoadingPercentage = (progress) => {
    return new Promise((resolve) => {
      setLoadingPercentage((prev) => {
        const newProgress = Math.max(prev, progress);
        console.log("Updated Progress: ", newProgress);
        resolve(); // Resolve once state update is queued
        return newProgress;
      });
    });
  };

  const getCellDetailsByFormNameandVersion = async () => {
    if (tableForm !== null) {
      console.log("First UseEffect called");

      let isFetching = true;
      const timeouts = [];

      // Smooth transition from 0% → 50%
      timeouts.push(
        setTimeout(() => isFetching && setLoadingPercentage(20), 200),
      );
      timeouts.push(
        setTimeout(() => isFetching && setLoadingPercentage(35), 400),
      );
      timeouts.push(
        setTimeout(() => isFetching && setLoadingPercentage(50), 600),
      );

      // Fetch data
      const AllCellData = await getAllCellInfoByFormNameAndVersion(
        tableForm.formName,
        tableForm.versionNumber,
      );

      isFetching = false;
      timeouts.forEach(clearTimeout); // Cancel pending timeouts if API was fast

      console.log("Initial Table sheet data: ", AllCellData);

      if (!AllCellData || AllCellData.length === 0) {
        setsnackbarSeverity("error");
        setSnackbarText("No Cell Found");
        setSnackbarOpen(true);
        setLoadingPercentage(100);
        setTimeout(() => setLoadingPercentage(0), 200);
        return;
      }

      let updatedData = [];
      setLoadingPercentage((prev) => Math.max(prev, 50));

      for (let i = 0; i < AllCellData.length; i++) {
        const { cellData, ...rest } = AllCellData[i];
        updatedData.push({ ...rest, cellInfo: cellData });

        const progress = 50 + Math.floor(((i + 1) / AllCellData.length) * 40);

        await updateLoadingPercentage(progress); // Ensure state update is processed

        await new Promise((resolve) => setTimeout(resolve, 90)); // Add delay for UI refresh

        console.log("Next Loop started");
      }

      console.log("Table sheet data: ", updatedData);
      console.log("Actual Object: ", tableForm);

      const group_array = tableForm?.userGroup?.split(",");

      setDepartment(tableForm?.department);
      setTextAreaValue(tableForm?.saveSQL);
      setGroup(group_array);
      setDocumentId(tableForm?.documentId);
      setformatID(tableForm?.formatID);
      setDisable(true);
      setExistingForm(tableForm);
      setSheetDetails(updatedData);
      setSelectedSheet(tableForm?.formName);
      setIsPublicAccess(tableForm?.publicAccess);
      setDashboardType(tableForm?.dashboardType);
      setExternal(tableForm?.external);

      // Smoothly transition to 100% after completion
      setTimeout(() => {
        setLoadingPercentage((prev) => (prev < 100 ? 100 : prev));
      }, 100);

      setTimeout(() => {
        setLoadingPercentage(0);
      }, 5000);

      console.log("First useEffect completed");
    }
  };

  const getFormdetailsByFormName = async (selectedSheet) => {
    const form = await getFormDetailbyFormName(selectedSheet);
    console.log("form data : ", form);
    if (form) {
      const group_array = form?.userGroup?.split(",");
      console.log("Group Array ", form?.userGroup?.split(","));
      setDepartment(form?.department);
      setTextAreaValue(form?.saveSQL);
      setGroup(group_array);
      setDocumentId(form?.documentId);
      setformatID(form?.formatID);
      setDisable(true);
      setExistingForm(form);
    }
  };
  const handleImageUpload = async (file) => {
    setExcelLoading(10);

    const formData = new FormData();
    formData.append("file", file);
    setExcelLoading(20);
    // console.log("FprmData : ", formData);
    try {
      const response = await axios.post(
        "https://op360.greenware.app:5000/upload-image/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("My Image Response:", response.data);
      setExcelLoading(40);
      // Convert base64 content to Blob and create a File object
      const byteCharacters = atob(response.data.content);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
      }

      const blob = new Blob(byteArrays, {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      setExcelLoading(50);
      const reconstructedFile = new File([blob], response.data.filename, {
        type: blob.type,
      });
      setExcelLoading(60);
      // Pass to the uploadInvoice function
      await uploadInvoice(reconstructedFile);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleSave = async () => {
    // console.log('Ashok :',existingForm)
    // setLogData([]);

    if (existingForm) {
      if (
        existingForm?.formName.trim().toLowerCase() ===
        selectedSheet?.trim().toLowerCase()
      ) {
        setVerChnageOpen(true);
        console.log("Matched");
      }
    } else {
      await handleChangeVersion();
    }

    // console.log("Final Sheet Details: ", sheetDetails);
    // const loggedinuserDetails = await getUserDetailsByUserID(getCurrentUser());
    // // console.log("details : ", loggedinuserDetails);
    // const formObject = {
    //   formID: 0,
    //   formName: selectedSheet,
    //   userId: getCurrentUser(),
    //   saveSQL: textAreaValue,
    //   tableSQL: logTblQuery,
    //   deleteSQL: "",
    //   creationDate: new Date().toISOString(), // Current date-time in ISO format
    //   createdUser: loggedinuserDetails.userName,
    //   department: department,
    //   userGroup: group?.join(),
    //   documentId: documentId,
    //   formatID: formatID,
    //   versionNumber: 1,
    //   isActiveForm: true,
    //   tenantId: getTenantID(),
    //   cellInfo: sheetDetails.flatMap((form) => form.cellInfo),
    // };

    // console.log("Final Form Object:", formObject);

    // const sheetDetails1 = reverseProcess(formObject);

    // console.log("Reverse Form Object :", sheetDetails1);
    // setSheetDetails(sheetDetails1);

    // const response = await saveLogbook(formObject);
    // if (response?.status === 200) {
    //   setsnackbarSeverity(); // Clear any previous snackbar severity (might need a value)
    //   setSnackbarText("Logbook Saved Successfully"); // Set success message for snackbar
    //   setSnackbarOpen(true); // Open the snackbar to show the message
    // } else {
    //   setsnackbarSeverity("error"); // Clear any previous snackbar severity (might need a value)
    //   setSnackbarText("Database Error"); // Set success message for snackbar
    //   setSnackbarOpen(true);
    // }
  };
  // function reverseProcess(formObject) {
  //   const cellInfoGroups = {};

  //   // Group cells by row numbers or other specific properties
  //   formObject.cellInfo.forEach((cell) => {
  //     const key = `formId_${cell.rowNum}`; // Use rowNum, formID, or another criterion for grouping

  //     if (!cellInfoGroups[key]) {
  //       cellInfoGroups[key] = {
  //         formID: formObject.formID,
  //         formName: formObject.formName,
  //         userId: formObject.userId,
  //         saveSQL: formObject.saveSQL,
  //         tableSQL: formObject.tableSQL,
  //         deleteSQL: formObject.deleteSQL,
  //         creationDate: formObject.creationDate,
  //         createdUser: formObject.createdUser,
  //         department: formObject.department,
  //         userGroup: formObject.userGroup,
  //         documentId: formObject.documentId,
  //         formatID: formObject.formatID,
  //         versionNumber: formObject.versionNumber,
  //         isActiveForm: formObject.isActiveForm,
  //         tenantId: formObject.tenantId,
  //         cellInfo: [],
  //       };
  //     }

  //     cellInfoGroups[key].cellInfo.push(cell);
  //   });

  //   // Convert the object into an array format
  //   return Object.values(cellInfoGroups);
  // }
  const handleDelete = () => {
    // Reset states
    setIsFileUploaded(false); // Show the file upload component
    setSheetList([]);
    setSelectedSheet(null);
    setSheetDetails([]);
    setDelOpen(false);
  };
  const handleChangeVersion = async () => {
    setLoading(true);
    // Reset states
    console.log("Version Changed");
    console.log("Final Sheet Details: ", sheetDetails);
    const loggedinuserDetails = await getUserDetailsByUserID(getCurrentUser());
    // console.log("details : ", loggedinuserDetails);
    const formObject = {
      formID: existingForm?.formID || 0,
      formName: selectedSheet?.trim(),
      userId: existingForm?.userId || getCurrentUser(),
      saveSQL: textAreaValue,
      tableSQL: logTblQuery,
      deleteSQL: "",
      creationDate: new Date().toISOString(), // Current date-time in ISO format
      createdUser: existingForm?.createdUser || loggedinuserDetails.userName,
      department: department,
      userGroup: group?.join(),
      documentId: documentId,
      formatID: formatID,
      versionNumber: existingForm?.versionNumber + 1 || 1,
      isActiveForm: false,
      tenantId: getTenantID(),
      publicAccess: isPublicAccess,
      dashboardType: dashboardType,
      external: external,
      modifiedBy: getCurrentUser(),
      cellInfo: sheetDetails.flatMap((form) => form.cellInfo),
    };

    const cellData = {};
    formObject.cellInfo.forEach((cell) => {
      cellData[cell.cellId] = cell.context || cell.aliasId;
    });

    // Destructure and rebuild the object with dynamic logbookId = formID
    const { cellInfo, formID, ...rest } = formObject;
    const response = await saveLogbook(formObject, false);
    console.log("Save Logbook Response : ", response.data);

    const finalOutput = {
      ...rest,

      data: cellData,
      logbookId: response.data.formID, // <- dynamic assignment
      formID: response.data.formID,
      versionNumber: response.data.versionNumber,
    };

    console.log("My finalOutput : ", finalOutput);

    console.log("Final Form Object versionchange:", formObject);
    const mongoApiStatus = 200; //await SaveLogbookMetaInfoToMongo(finalOutput);

    if (response?.status === 200 && mongoApiStatus === 200) {
      setsnackbarSeverity(); // Clear any previous snackbar severity (might need a value)
      setSnackbarText("Logbook Saved Successfully"); // Set success message for snackbar
      setSnackbarOpen(true); // Open the snackbar to show the message
      // setExistingForm(formObject);
      setExistingForm({
        ...formObject,
        formID: response.data.formID,
        versionNumber: response.data.versionNumber,
      });
      setLoading(false);
    } else {
      setsnackbarSeverity("error"); // Clear any previous snackbar severity (might need a value)
      setSnackbarText("Database Error"); // Set success message for snackbar
      setSnackbarOpen(true);
      setLoading(false);
    }
  };
  const handleDontChangeVersion = async () => {
    setLoading(true);
    // Reset states
    console.log("Version Not Change : ", group);
    // console.log("Version Changed");
    console.log("Final Sheet Details: ", sheetDetails);
    const loggedinuserDetails = await getUserDetailsByUserID(getCurrentUser());
    // console.log("details : ", loggedinuserDetails);
    const formObject = {
      formID: existingForm?.formID,
      formName: selectedSheet?.trim(),
      userId: existingForm?.userId || getCurrentUser(),
      saveSQL: textAreaValue,
      tableSQL: logTblQuery,
      deleteSQL: "",
      creationDate: new Date().toISOString(), // Current date-time in ISO format
      createdUser: existingForm?.createdUser || loggedinuserDetails.userName,
      department: department,
      userGroup: group?.join(),
      documentId: documentId,
      formatID: formatID,
      versionNumber: existingForm?.versionNumber,
      isActiveForm: existingForm?.isActiveForm || false,
      publicAccess: isPublicAccess,
      dashboardType: dashboardType,
      external: external,
      modifiedBy: getCurrentUser(),
      tenantId: getTenantID(),
      cellInfo: sheetDetails.flatMap((form) => form.cellInfo),
    };

    const cellData = {};
    formObject.cellInfo.forEach((cell) => {
      cellData[cell.cellId] = cell.aliasId;
    });

    // Create the final output object excluding 'cellInfo' and including 'Data'
    const { cellInfo, ...rest } = formObject;
    const finalOutput = {
      ...rest,
      Data: cellData,
    };

    console.log("My finalOutput Don't : ", finalOutput);

    console.log("Final Form Object:", formObject);

    // const mongoApiStatus = SaveLogbookMetaInfoToMongo(finalOutput);
    const response = await saveLogbook(formObject, true);
    console.log("Last Form Object : ", response.data);
    if (response?.status === 200) {
      setsnackbarSeverity(); // Clear any previous snackbar severity (might need a value)
      setSnackbarText("Logbook Saved Successfully"); // Set success message for snackbar
      setSnackbarOpen(true); // Open the snackbar to show the message
      setExistingForm(formObject);
      setLoading(false);
    } else {
      setsnackbarSeverity("error"); // Clear any previous snackbar severity (might need a value)
      setSnackbarText("Database Error"); // Set success message for snackbar
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  // configure logbook header section
  const headerTemplate = (options) => {
    const className = `${options.className} justify-content-space-between`;

    return (
      <>
        <div
          className={className}
          style={{ background: "#dbe0e9", padding: "0.6rem 0.9rem" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              columnGap: "0.5rem",
            }}
          >
            <span
              style={{
                backgroundColor: "#3f51b5",
                color: "white",
                padding: "0.25rem 0.6rem",
                borderRadius: "6px",
                fontSize: "0.72rem",
              }}
            >
              V {existingForm?.versionNumber || 1}
            </span>
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                {selectedSheet}
              </div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "#6b7280",
                }}
              >
                <span style={{ fontSize: "0.7rem" }}>
                  From ID : {existingForm?.formID || 0}
                </span>
                <span
                  style={{
                    background: isPublicAccess ? "#1976d2" : "#605e5e",
                    fontSize: "0.65rem",
                    marginLeft: "0.5rem",
                    padding: "0.2rem 0.5rem",
                    color: "white",
                    borderRadius: "5px",
                  }}
                >
                  {isPublicAccess ? "Public" : "Only Me"}
                </span>
              </div>
            </div>
          </div>

          <div>
            {/* Red delete icon */}
            {/* <Tooltip title={"Delete Logbook"}>
            <button
              onClick={() => {
                setDelOpen(true);
              }}
              className="p-panel-header-icon p-link mr-3"
              style={{
                color: "red",
                border: "1px solid #fa7979",
                borderRadius: "50%",
                padding: "5px",
              }}
              // onClick={handleDelete}
            >
              <span className="pi pi-trash"></span>
            </button>
          </Tooltip> */}

            {/* Colorful rectangular View Logbook button */}
            <ExcelDownloader
              selectedSheet={selectedSheet}
              data={sheetDetails}
            ></ExcelDownloader>

            <Button
              size="small"
              icon="pi pi-download"
              className={infoButton.infoButton}
              label="Json"
              onClick={() => {
                const wrappedData = {
                  formId: existingForm?.formID || 0,
                  formName: selectedSheet,
                  department: department,
                  documentId: documentId,
                  group: group,
                  formatID: formatID,
                  saveSQL: textAreaValue,
                  formModel: sheetDetails,
                };
                const jsonString = JSON.stringify(wrappedData, null, 2);
                const blob = new Blob([jsonString], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = `${selectedSheet}_${existingForm?.formID || 0}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            />
            <button
              className="p-button p-link mr-4"
              onClick={() => {
                setLogData([]);

                const updatedSheetDetails = sheetDetails.map((sheet) => {
                  // Create a new object with cellData and nullify cellInfo
                  const newSheet = { ...sheet, cellData: sheet.cellInfo };
                  newSheet.cellInfo = null;
                  return newSheet;
                });

                console.log(
                  "updatedSheetDetails with cell data : ",
                  updatedSheetDetails,
                );
                setLogData(updatedSheetDetails);
                setIsViewLogbook(true);
              }}
              style={{
                backgroundColor: "#28a745", // Green background (you can change the color)
                color: "white", // White text color
                padding: "0.4rem 0.8rem", // Padding for the button
                borderRadius: "2rem", // Rectangular shape with slightly rounded corners
                border: "none", // No border
                cursor: "pointer", // Pointer cursor on hover
                fontSize: "0.85rem",
              }}
              // onClick={handleViewLogbook}
            >
              <i className="pi pi-eye" style={{ marginRight: "8px" }}></i>
              View Logbook
            </button>

            {/* Existing toggler element */}
            {options.togglerElement}
          </div>
        </div>
      </>
    );
  };
  const documentHeaderTemplate = (options) => {
    console.log("My Current User : ", loggedInUser);
    const className = `${options.className} justify-content-space-between`;

    return (
      <>
        {/* old header */}
        {/* <div
          className={className}
          style={{ background: "#DBE0E9", padding: "0.4rem 1.25rem" }}
        >
          <div className="flex align-items-center gap-2">
            <HomeIcon
              style={{ cursor: "pointer" }}
              color="primary"
              onClick={() => {
               
                setShowCreation(true);
              }}
            />
            <span
              className="font-bold"
              style={{ fontSize: "0.87rem" }}
            >{`Document Information for ${selectedSheet}`}</span>
          </div>

          <div className="flex align-items-center gap-2">
           
            {(tableForm?.publicAccess === true ||
              (tableForm?.publicAccess === false &&
                loggedInUser?.trim() === tableForm?.userId?.trim()) ||
              tableForm === null) && (
              <ToggleButton
                size={"small"}
                onLabel="Dashboard Type"
                offLabel="Dashboard Type"
                onIcon="pi pi-check"
                offIcon="pi pi-times"
                checked={dashboardType}
                onChange={(e) => setDashboardType(e.value)}
                className="loogBookToggleButtonStyle"
              />
            )}
            <Button
              size="small"
             
              label="Json {...}"
              className="p-button-raised p-button-secondary"
              style={{ backgroundColor: "#003366" }}
              onClick={() => {
                const wrappedData = {
                  formId: existingForm?.formID || 0,
                  formName: selectedSheet,
                  department: department,
                  documentId: documentId,
                  group: group,
                  formatID: formatID,
                  saveSQL: textAreaValue,
                  formModel: sheetDetails,
                };
                const jsonString = JSON.stringify(wrappedData, null, 2);
                const blob = new Blob([jsonString], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = `${selectedSheet}_${existingForm?.formID || 0}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            />
            <ExcelDownloader
              selectedSheet={selectedSheet}
              data={sheetDetails}
            ></ExcelDownloader>

            {(tableForm?.publicAccess === true ||
              (tableForm?.publicAccess === false &&
                loggedInUser?.trim() === tableForm?.userId?.trim()) ||
              tableForm === null) && (
              <SwitchButton
                isPublicAccess={isPublicAccess}
                setIsPublicAccess={setIsPublicAccess}
                offLabel="Only Me"
                onLabel="Public"
                OffIcon={PersonIcon}
                OnIcon={GroupIcon}
              />
            )}

           
            {options.togglerElement}
          </div>
        </div> */}

        {/* new header */}

        <div
          style={{
            background: "#DBE0E9",
            padding: "0.6rem 0.9rem",
            borderRadius: "0.4rem 0.4rem 0 0",
          }}
        >
          {/* TOP ROW */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* left side info section */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                columnGap: "0.5rem",
              }}
            >
              <HomeIcon
                style={{
                  cursor: "pointer",
                  background: "#3f51b5",
                  width: "1.8rem",
                  height: "1.8rem",
                  borderRadius: "1rem",
                  padding: "4px",
                  color: "white",
                }}
                onClick={() => {
                  setShowCreation(true);
                }}
              />
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  Configure Logbook{/* {selectedSheet} */}
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "#6b7280",
                  }}
                >
                  Manage dashboard preferences, export data, and control access
                  settings.
                </div>
              </div>
            </div>

            {/* Right Side -  Export Button */}
            <div className="flex align-items-center gap-2">
              {(tableForm?.publicAccess === true ||
                (tableForm?.publicAccess === false &&
                  loggedInUser?.trim() === tableForm?.userId?.trim()) ||
                tableForm === null) && (
                <ToggleButton
                  size={"small"}
                  onLabel="External Type"
                  offLabel="External Type"
                  onIcon="pi pi-th-large"
                  offIcon="pi pi-table"
                  checked={external}
                  onChange={(e) => setExternal(e.value)}
                  className="loogBookToggleButtonStyle"
                  style={{
                    boxShadow: "none",
                    padding: "0.4rem 0.8rem", // Padding for the button
                    borderRadius: "2rem", // Rectangular shape with slightly rounded corners
                  }}
                />
              )}
              <div
                style={{
                  width: "1px",
                  height: "24px",
                  background: "#bcc5d5",
                }}
              />
              {(tableForm?.publicAccess === true ||
                (tableForm?.publicAccess === false &&
                  loggedInUser?.trim() === tableForm?.userId?.trim()) ||
                tableForm === null) && (
                <ToggleButton
                  size={"small"}
                  onLabel="Dashboard Type"
                  offLabel="Dashboard Type"
                  onIcon="pi pi-th-large"
                  offIcon="pi pi-table"
                  checked={dashboardType}
                  onChange={(e) => setDashboardType(e.value)}
                  className="loogBookToggleButtonStyle"
                  style={{ boxShadow: "none" }}
                />
              )}

              <div
                style={{
                  width: "1px",
                  height: "24px",
                  background: "#bcc5d5",
                }}
              />
              {/* {(tableForm?.publicAccess === true ||
                (tableForm?.publicAccess === false &&
                  loggedInUser?.trim() === tableForm?.userId?.trim()) ||
                tableForm === null) && (
                <SwitchButton
                  isPublicAccess={isPublicAccess}
                  setIsPublicAccess={setIsPublicAccess}
                  offLabel="Only Me"
                  onLabel="Public"
                  OffIcon={PersonIcon}
                  OnIcon={GroupIcon}
                />
              )} */}
              {(tableForm?.publicAccess === true ||
                (tableForm?.publicAccess === false &&
                  loggedInUser?.trim() === tableForm?.userId?.trim()) ||
                tableForm === null) && (
                <ConfigureLogbookSwitchButton
                  isPublicAccess={isPublicAccess}
                  setIsPublicAccess={setIsPublicAccess}
                  offLabel="Only Me"
                  onLabel="Public"
                />
              )}

              {options.togglerElement}
            </div>
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      {!showCreation ? (
        <Container maxWidth="lg">
          <div className="mx-0 lg:mx-5">
            {/* {sheetDetails.length === 0 && tableForm !== null && (
            <div
              style={{
                display: "flex",
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress size="3rem" />
            </div>
          )} */}
            {loadingPercentage > 0 && (
              <Progress
                percent={loadingPercentage}
                strokeColor={{ from: "#0D92F4", to: "#6EC207" }}
                size={["100%"]}
                status={loadingPercentage === 100 ? "success" : "active"}
              />
            )}

            {!isFileUploaded && tableForm === null ? (
              // Show file upload component if no file uploaded

              <>
                {/* <SwitchButton
                offLabel="Upload Excel "
                onLabel="Upload Image "
                isPublicAccess={isExcelUpload}
                setIsPublicAccess={setIsExcelUpload}
                OnIcon={ImageIcon}
                OffIcon={DescriptionIcon}
              ></SwitchButton>
              <br></br> <br></br> */}
                {/* <CustomizedSwitches
                checked={isExcelUpload}
                setChecked={setIsExcelUpload}
              ></CustomizedSwitches>
              <br></br> */}

                <>
                  <div className="mx-0 lg:mx-5">
                    <Flex
                      align="center"
                      wrap
                      gap={30}
                      className={ButtonStyle.primeReactButton}
                    >
                      <FileUpload
                        name="invoice"
                        accept=".xlsx, .xls, .json, image/*, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/json"
                        customUpload={true}
                        uploadHandler={invoiceUploadHandler}
                        mode={excelLoading > 0 ? "basic" : "advanced"}
                        // chooseLabel="Upload Excel, JSON, or Image"
                        className="w-full"
                        style={{ width: "100%" }}
                        chooseLabel="Upload Excel or Image"
                      />
                      {excelLoading > 0 && (
                        <Progress
                          type="circle"
                          size={20}
                          status={excelLoading === 100 ? "success" : "active"}
                          percent={excelLoading}
                        />
                        // <>
                        //   {/* <LinearProgress /> */}
                        //   <Box
                        //     sx={{
                        //       position: "fixed",
                        //       top: "0",
                        //       left: "0",
                        //       width: "100%",
                        //       height: "100%",
                        //       backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
                        //       display: "flex",
                        //       justifyContent: "center",
                        //       alignItems: "center",
                        //       zIndex: 9999, // Ensure it appears on top
                        //     }}
                        //   >
                        //     <CircularProgress />
                        //   </Box>
                        // </>
                      )}
                    </Flex>
                  </div>
                </>
              </>
            ) : (
              // Show the main content after file upload
              <div>
                {/* Dropdown for selecting sheet */}
                {sheetList.length > 0 && isFileUploaded && (
                  <div className="mt-3">
                    <Dropdown
                      id="sheetDropdown"
                      value={selectedSheet}
                      options={sheetList.map((sheet) => ({
                        label: sheet,
                        value: sheet,
                      }))}
                      onChange={(e) => setSelectedSheet(e.value)}
                      placeholder="Select a Sheet"
                      filter
                    />
                  </div>
                )}

                <br></br>
                {sheetDetails.length > 0 && (
                  <>
                    <div className="configureLogbook-Content">
                      <Panel
                        toggleable
                        // header={`Document Information for ${selectedSheet}`}
                        headerTemplate={documentHeaderTemplate}
                      >
                        <motion.div
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.9 }}
                        >
                          <ScrollToTop
                            width="20"
                            height="20"
                            style={{
                              borderRadius: "50%",
                              padding: "10px",
                              backgroundColor: "#ffffff",
                              color: "#1976d2",
                              border: "1px solid rgba(25,118,210,0.2)",
                              boxShadow:
                                "rgb(163 148 148 / 12%) 0px 2px 10px 0px !important",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                            }}
                            // smooth
                          />
                        </motion.div>

                        <DocumentForm
                          department={department}
                          setDepartment={setDepartment}
                          group={group}
                          setGroup={setGroup}
                          documentId={documentId}
                          setDocumentId={setDocumentId}
                          formatID={formatID}
                          setformatID={setformatID}
                          disable={disable}
                        ></DocumentForm>
                      </Panel>
                      <br></br>
                      <Panel
                        toggleable
                        headerTemplate={headerTemplate}
                        className="panelStye"
                      >
                        <div
                          className="LogbookGridStyle"
                          style={{ overflow: "auto" }}
                        >
                          <CustomScrollBottom />
                          <FormGrid
                            tableForm={tableForm}
                            sheetDetails={sheetDetails}
                            setSheetDetails={setSheetDetails}
                          />
                        </div>
                      </Panel>
                      <br></br>
                      {/*<Panel
                        toggleable={true}
                        collapsed={true}
                        header={`Logbook Table Query`}
                        // headerTemplate={documentHeaderTemplate}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                          }}
                        >
                          <InputTextarea
                            autoResize
                            placeholder="Table Data Query"
                            value={logTblQuery}
                            onChange={(e) => setLogTblQuery(e.target.value)}
                            rows={3}
                            cols={30}
                            style={{ width: "100%" }} // Make the textarea full width
                          />
                          <br />
                          <Button
                            label="Execute" // Button label
                            className="p-button p-link mr-4" // Use PrimeReact's built-in class for default styling
                            style={{
                              backgroundColor: "#008866", // Desired button color
                              color: "white", // White text color
                              padding: "10px 20px", // Padding for the button
                              borderRadius: "5px", // Rectangular shape with slightly rounded corners
                              border: "none", // No border
                              cursor: "pointer", // Pointer cursor on hover
                              alignSelf: "flex-start", // Align button to the left
                            }}
                            // onClick={handleViewLogbook} // Uncomment and implement your click handler
                          />
                        </div>
                      </Panel>
                      <br></br> */}
                      <Panel
                        toggleable={true}
                        collapsed={true}
                        header={
                          <span className="font-bold text-sm">
                            Logbook Save Query
                          </span>
                        }
                        className="LogbookGridStyle"
                      >
                        {/* <h3> Below Mic is just for testing</h3> */}
                        {/* <MicSwitch
                      isPublicAccess={false}
                      setIsPublicAccess={setIsPublicAccess}
                      offLabel="Mic OFF"
                      onLabel="Mic ON"
                      OffIcon={MicOffIcon}
                      OnIcon={MicIcon}
                      // updatedGridDataTest={gridDataTest}
                      // setGridDataTest={setGridDataTest}
                    /> */}
                        {/* <PickListDemo
                          // depData={sheetDetails}
                          data={sheetDetails}
                          textAreaValue={textAreaValue}
                          setTextAreaValue={setTextAreaValue}
                        ></PickListDemo> */}
                        {isOnline ? (
                          <PickListDemo
                            // depData={sheetDetails}
                            data={sheetDetails}
                            textAreaValue={textAreaValue}
                            setTextAreaValue={setTextAreaValue}
                          ></PickListDemo>
                        ) : (
                          <PickListDemoWithoutInternet
                            // depData={sheetDetails}
                             data={sheetDetails}
                            textAreaValue={textAreaValue}
                            setTextAreaValue={setTextAreaValue}
                          ></PickListDemoWithoutInternet>
                        )}
                        {/* <PickListAPI
                  data={sheetDetails}
                  textAreaValue={textAreaValue}
                  setTextAreaValue={setTextAreaValue}
                ></PickListAPI> */}
                      </Panel>

                      <br></br>
                      {(tableForm?.publicAccess === true ||
                        (tableForm?.publicAccess === false &&
                          loggedInUser?.trim() === tableForm?.userId?.trim()) ||
                        tableForm === null) && (
                        <Button
                          onClick={handleSave}
                          size="small"
                          label="Save" // Button label
                          icon="pi pi-save"
                          disabled={
                            !department ||
                            !documentId ||
                            !group?.length > 0 ||
                            !formatID
                          }
                          className="p-button p-link" // Use PrimeReact's built-in class for default styling
                          style={{
                            backgroundColor: "#4169e1", // Desired button color
                            color: "white", // White text color
                            padding: "10px 20px", // Padding for the button
                            borderRadius: "5px", // Rectangular shape with slightly rounded corners
                            border: "none", // No border
                            cursor: "pointer", // Pointer cursor on hover
                            alignSelf: "flex-start", // Align button to the left
                          }}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
            <div>
              <SnackbarComponent
                openPopup={snackbarOpen} // State to control snackbar open/close
                setOpenPopup={setSnackbarOpen} // Function to update snackbar state
                dialogMessage={snackbarText} // Message to display in the snackbar
                snackbarSeverity={snackbarSeverity} // Severity level of the snackbar (e.g., success, error)
              />
            </div>
            <div className={DialogStyle.dialogHeader}>
              <Dialog
                header={
                  <Chip
                    label={selectedSheet}
                    color="primary"
                    variant="outlined"
                    size="small"
                    icon={<BookIcon />}
                  />
                }
                visible={isViewLogbook}
                maximizable
                maskClassName="zindexforDailog"
                maskStyle={{ zIndex: "310 !important" }}
                style={{ width: "90%", height: "90%", margin: "auto" }}
                onHide={() => {
                  if (!isViewLogbook) return;
                  setTimeout(() => setIsViewLogbook(false), 2000);
                }}
              >
                <br></br>
                <LogbookForm logData={logData}></LogbookForm>

                <br></br>
              </Dialog>
              {/* {logData?.length > 0 && <LogbookForm logData={logData}></LogbookForm>} */}

              <CustomDialog
                open={delOpen} // State to control dialog open/close
                setOpen={setDelOpen} // Function to update dialog state
                proceedButtonText={"YES"} // Text for the proceed button
                proceedButtonClick={handleDelete} // Function to call on proceed
                cancelButtonText={"NO"} // Text for the cancel button
                // content={"Do you want to chnage the version number ?"}
              />
              <CustomDialog
                open={verChnageOpen} // State to control dialog open/close
                setOpen={setVerChnageOpen} // Function to update dialog state
                proceedButtonText={"YES"} // Text for the proceed button
                proceedButtonClick={handleChangeVersion} // Function to call on proceed
                cancelButtonText={"NO"} // Text for the cancel button
                notProceedButtonClick={handleDontChangeVersion}
                content={"Do you want to change the version number ?"}
              />

              <>
                {loading && (
                  <Box
                    sx={{
                      position: "fixed",
                      top: "0",
                      left: "0",
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(245, 238, 238, 0.5)", // Semi-transparent background
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 9999, // Ensure it appears on top
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}
              </>
            </div>
          </div>
        </Container>
      ) : (
        // If 'showCreation' is true, render the following componet (AssetMasterTest).
        <div>
          <LogbookMaster></LogbookMaster>
        </div>
      )}
    </>
  );
};

export default ConfigureLogbook;
