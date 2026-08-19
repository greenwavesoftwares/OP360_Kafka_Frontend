import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { ToggleButton } from "primereact/togglebutton";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Chip, Divider, Grid } from "@mui/material";

import { FileUpload } from "primereact/fileupload";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import DropdownTable from "./DropdownTable"; // Import the DropdownTable component
import ClearIcon from "@mui/icons-material/Clear";

import { FloatLabel } from "primereact/floatlabel";
import FileUploadComponent from "./FileUploadComponent";
import { TabPanel, TabView } from "primereact/tabview";
import { InputSwitch } from "primereact/inputswitch";
import { Fieldset } from "primereact/fieldset";
import { Avatar } from "primereact/avatar";
import { SelectButton } from "primereact/selectbutton";
import { Accordion, AccordionTab } from "primereact/accordion";
import "./FormDesign.css";
import PickListDemo from "./PickListDemo";
import SnackbarComponent from "../components/shared/snackbar/customSnackbar";
import PickListAPI from "./PickListAPI";
import ApiRequestForm from "./ApiRequestForm";
import { getCurrentUser } from "../UserModuleUpdated/helper";
import CellCssBuilder from "./CellCssBuilder";
import { Dialog } from "primereact/dialog";
import PickListDemoWithoutInternet from "./PickListDemoWithoutInternet";
import PickListDemoWithCssEditor from "./PickListDemoWithCssEditor";
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
const FormDesign = ({
  tableForm,
  cell,
  setClickedCell,
  setVisible,
  clickedCellForIcon,
  setClickedCellForIcon,
  setShowCheckbox,
  setSwitchStates,
  setToggledCell,
  setSelectedCells,
  selectedCells,
  depDataList,
  setResultArray,
  setWithToggle,
}) => {
  const isOnline = useNetworkStatus();
  console.log("isOnline : ", isOnline);
  console.log("result array : ", depDataList);
  console.log("My Slected Cells : ", selectedCells);
  const fileUploadRef = useRef(null);
  const [showCssDialog, setShowCssDialog] = useState(false);
  const [cssDraft, setCssDraft] = useState(""); // local draft for dialog
  // const [showCssDialog, setShowCssDialog] = useState(false);
  // States and their setters
  const [cellName, setCellName] = useState("");
  const [cellContext, setCellContext] = useState("");
  // const [fieldType, setFieldType] = useState("Text");
  const [isJsonValid, setIsJsonValid] = useState(false);
  const [editable, setEditable] = useState(false);
  const [required, setRequired] = useState(false);
  const [qrScan, setQrScan] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const options = ["SQL", "Expression"];
  const buttonOptions = ["SQL", "Expression", "Rest API"];
  const globalCellOptions = ["SQL", "Rest API"];

  const [globalCellExpType, setGlobalCellExpType] = useState(options[0]);
  const [buttonType, setButtonType] = useState(options[0]);
  const [depExpressionType, setDepExpressionType] = useState(options[0]);
  const [pollStopExpType, setPollStopExpType] = useState(options[0]);
  const [pollStartExpType, setPollStartExpType] = useState(options[0]);
  const [colSpan, setColSpan] = useState(1);
  const [rowSpan, setRowSpan] = useState(1);
  const [valueExpression, setValueExpression] = useState("");
  const [pollStopExpressionLogic, setPollStopExpressionLogic] = useState("");
  const [pollStartExpressionLogic, setPollStartExpressionLogic] = useState("");
  const [cellUpdateSQL, setCellUpdateSQL] = useState("");
  const [desableExp, setDesableExp] = useState("");
  const [disabledExpType, setDisabledExpType] = useState(options[0]);
  const [conditionalCssExpression, setConditionalCssExpression] = useState("");
  const [conditionalCssExpType, setConditionalCssExpType] = useState(
    options[1],
  );
  const [buttonLogic, setButtonLogic] = useState("");
  const [cellCSS, setCellCSS] = useState("");
  const [selectedFieldType, setSelectedFieldType] = useState(null);
  const [snackbarText, setSnackbarText] = useState("Data saved !"); // Text for the snackbar notification
  const [snackbarSeverity, setsnackbarSeverity] = useState("success"); // Severity level for the snackbar (success, error, etc.)
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Boolean to control snackbar visibility
  const loggedInUser = getCurrentUser();
  const [formValues, setFormValues] = useState({
    // minVal: cell.numMinVal || -999, // Default value for minVal
    // maxVal: cell.numMaxVal || 999,
    // datepattern: "dd/MM/yyyy",
  });
  const [imagePreview, setImagePreview] = useState(null); // State for image preview

  // Field types
  const fieldTypes = [
    { label: "Text", value: "Text" },
    { label: "Number", value: "Number" },
    { label: "Date", value: "Date" },
    { label: "CommentBox", value: "CommentBox" },
    { label: "Dropdown", value: "Dropdown" },
    { label: "Boolean", value: "Boolean" },
    { label: "DateTime", value: "DateTime" },
    { label: "Button", value: "Button" },
    { label: "URL", value: "URL" },
    { label: "File", value: "File" },
    { label: "Time", value: "Time" },
    { label: "REST API", value: "API" },
    { label: "Image", value: "Image" },
  ];

  useEffect(() => {
    if (cell) {
      setCellName(cell.aliasId || "");
      setCellContext(cell.context || cell.aliasId || "");
      setSelectedFieldType(cell.fieldType || null);
      setEditable(cell.editable || false);
      setRequired(cell.requiredfield || false);
      setQrScan(cell.qrScan || false);
      setColSpan(cell.colSpan || 1);
      setRowSpan(cell.rowSpan || 1);
      setCellCSS(cell.cellCSS || "");
      setDesableExp(cell.disableExpressionLogic || "");
      setConditionalCssExpression(cell.conditionalCssExpression || "");
      setCellUpdateSQL(cell.globalExpressionLogic || "");
      setValueExpression(cell.depExpressionLogic || "");
      setDepExpressionType(cell.depExpressionType || "SQL");
      setDisabledExpType(cell.disabledExpType || "SQL");
      setConditionalCssExpType(cell.conditionalCssExpType || "Expression");
      setPollStartExpType(cell.pollStartExpType || "SQL");
      setPollStopExpType(cell.pollStopExpType || "SQL");
      setPollStartExpressionLogic(cell.pollStartExpressionLogic || "");
      setPollStopExpressionLogic(cell.pollStopExpressionLogic || "");
      setAutoRefresh(cell.autoRefresh || false);
      setGlobalCellExpType(cell.globalCellExpType || "SQL"); //added for global cell exp type
      setButtonType(cell.buttonType || "SQL");
      setButtonLogic(cell.buttonLogic || "");
      setFormValues({
        value: cell.value || "",
        minVal: cell.minVal !== null ? cell.minVal : -999.0,
        maxVal: cell.maxVal !== null ? cell.maxVal : 999.0,
        datepattern: cell.datePattern || "dd/MM/yyyy",
        imgHeight: cell.imgHeight !== null ? cell.imgHeight : 30,
        imgWidth: cell.imgWidth !== null ? cell.imgWidth : 30,
        apiUrl: cell.apiUrl || "",
        apiBody: cell.apiBody || "",
        apiMethod: cell.apiMethod || null,
        buttonKey: cell.buttonKeyValue || "",
        selectedIcon: cell.buttonIcon || null,
        decimalPoints: cell.decimalPoints || 2,
        numDecimalPoint:
          cell.numDecimalPoint !== null ? cell.numDecimalPoint : 0,
        dbColName: cell.dbColName || "",
        // depExpressionLogic: cell.depExpressionLogic || "",
        imagePath: cell.imagePath || "",
        componentCss: cell.componentCss || "",
        saveSql: cell.saveSql || "",
        ajaxUpdateStr: cell.ajaxUpdateStr || "",
        // autoRefresh: cell.autoRefresh || false,
        pollInterval: cell.pollInterval !== null ? cell.pollInterval : 1,
        versionNumber: cell.versionNumber || 0,
        expressionField: cell.expressionField || false,
        disableExpressionLogic: cell.disableExpressionLogic || null,
        // disabledExpType: cell.disabledExpType || false,
        pollStartExpType: cell.pollStartExpType || false,
        pollStartExpression: cell.pollStartExpression || null,
        pollStopExpType: cell.pollStopExpType || false,
        pollStopExpression: cell.pollStopExpression || null,
        buttonArguments: cell.buttonArguments || "",
        buttonLogic: cell.buttonLogic || "",
        buttonClassName: cell.buttonClassName || "",
        buttonType: cell.buttonType || "",
        globalExpressionLogic: cell.globalExpressionLogic || "",
        fileContent: cell.fileContent || null,
        dropDownFields: cell.dropDownFields || [],
        dependentFields: cell.dependentFields || [],
        url: cell.url || "",
        // depExpressionType: cell.depExpressionType || depExpressionType || "SQL",
        // disabledExpType: cell.disabledExpType || disabledExpType || "SQL",
      });

      // Convert fileContent to Base64 if it exists and set as imagePreview
      if (cell.fileContent && cell.fieldType === "Image") {
        // Convert Base64 string back to a usable format for image preview
        setImagePreview(`data:image/*;base64,${cell.fileContent}`);
      } else if (cell.imagePath && cell.fieldType === "Image") {
        // Fallback to imagePath if available (assume it's a valid image URL or path)
        setImagePreview(cell.imagePath);
      } else {
        // Optionally handle a default or blank state
        setImagePreview(null);
      }
    }
  }, [cell]);

  // Handlers for updating state
  const handleCellContextChange = (e) => setCellContext(e.target.value);
  const handleCellNameChange = (e) => setCellName(e.target.value);
  // const handleFieldTypeChange = (e) => setFieldType(e.value);
  const handleEditableChange = (e) => setEditable(e.value);
  const handleRequiredChange = (e) => setRequired(e.value);
  const handleIsQrScanChange = (e) => setQrScan(e.value);
  const handleAutoRefreshChange = (e) => setAutoRefresh(e.value);
  const handleDepExpressionTypeChnage = (e) => {
    console.log("value : ", e.value);
    setDepExpressionType(e.value);
  };
  const handleDisabledExpressionTypeChange = (e) => setDisabledExpType(e.value);
  const handleConditionalCssExpTypeChange = (e) =>
    setConditionalCssExpType(e.value);
  const handleGlobalExpressionTypeChange = (e) => setGlobalCellExpType(e.value);
  const handleButtonExpressionTypeChange = (e) => setButtonType(e.value);
  const handleColSpanChange = (e) => setColSpan(e.value);
  const handleRowSpanChange = (e) => setRowSpan(e.value);
  const handleValueExpressionChange = (e) => setValueExpression(e.target.value);
  const handleCellUpdateSQLChange = (e) => setCellUpdateSQL(e.target.value);
  const handleDesableExpChange = (e) => setDesableExp(e.target.value);

  const handleConditionalCssExpressionChange = (e) =>
    setConditionalCssExpression(e.target.value);
  const handlebuttonLogicChange = (e) => setButtonLogic(e.target.value);
  const handleCellCSSChange = (e) => setCellCSS(e.target.value);
  const handleFieldChange = (e) => {
    setSelectedFieldType(e.value);
    setEditable(true);
    setFormValues({
      ...formValues,
      datepattern:
        cell.datePattern !== null &&
        cell.datePattern !== undefined &&
        cell.datePattern === ""
          ? cell.datePattern
          : e.value === "DateTime"
            ? "dd/MM/yyyy hh:mm"
            : "dd/MM/yyyy",
    });
    // setFormValues({
    //   // minVal: -999, // Default value for minVal
    //   // maxVal: 999,
    //   // datepattern: "dd/MM/yyyy",
    // });
  };
  // Function to update Dropdown items

  const updateDropdownItems = (newItems) => {
    setFormValues({ ...formValues, dropDownFields: newItems });
  };
  // const validateJson = () => {
  //   try {
  //     JSON.parse(formValues.apiBody);
  //     setIsJsonValid(true);
  //     setsnackbarSeverity(); // Clear any previous snackbar severity (might need a value)
  //     setSnackbarText("Valid JSON"); // Set success message for snackbar
  //     setSnackbarOpen(true);
  //     console.log("JSON Valid");
  //   } catch (error) {
  //     setIsJsonValid(false);
  //     setsnackbarSeverity("error"); // Clear any previous snackbar severity (might need a value)
  //     setSnackbarText("Invalid JSON"); // Set success message for snackbar
  //     setSnackbarOpen(true);
  //   }
  // };
  // const handleImageUpload = (e) => {
  //   const file = e.files[0];
  //   const reader = new FileReader();

  //   // Extract and store the image name with extension
  //   // const imageNameWithExtension = file.name;
  //   // console.log("Image name : ", imageNameWithExtension);
  //   // setFormValues({ ...formValues, imagePath: imageNameWithExtension });

  //   reader.onload = (event) => {
  //     setImagePreview(event.target.result); // Set image preview URL
  //     const imageNameWithExtension = file.name;
  //     console.log("Image name : ", imageNameWithExtension);
  //     setFormValues({
  //       ...formValues,
  //       imagePath: imageNameWithExtension,
  //       image: file,
  //     });

  //     // setFormValues({ ...formValues, image: file });
  //   };
  //   reader.readAsDataURL(file);
  // };
  const handleImageUpload = (e) => {
    const file = e.files[0];
    const reader = new FileReader();
    console.log("My file in image : ", file);
    reader.onload = (event) => {
      const base64String = event.target.result; // Base64 string
      setFormValues({
        ...formValues,
        image: file,
        fileContent: base64String.split(",")[1], // Store Base64 string in formValues
        imagePath: file.name, // Store the file name with extension
      });
      setImagePreview(base64String); // Set image preview
    };

    reader.readAsDataURL(file); // Read file as a Base64 encoded string
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormValues({ ...formValues, fileContent: null });
    // Clear the file input field if using PrimeReact's FileUpload ref
    if (fileUploadRef && fileUploadRef.current) {
      fileUploadRef.current.clear();
    }
  };

  // Save cell details and dropDownFields
  const saveCellDetails = () => {
    // console.log("My file content : ", formValues.fileContent);
    // console.log("Length : ", formValues.fileContent?.length);
    // debugger;
    // if (!cellName?.trim()) {
    //   setsnackbarSeverity("error"); // Clear any previous snackbar severity (might need a value)
    //   setSnackbarText("Cell Name Should not be blank"); // Set success message for snackbar
    //   setSnackbarOpen(true);
    //   return;
    // }
    const updatedCell = {
      ...cell,
      value: formValues.value || cell.value,
      url: formValues.url || cell.url | "",
      aliasId: cellName,
      context: cellContext || cell.context || cellName || cell.aliasId,
      colSpan: colSpan !== undefined ? colSpan : cell.colSpan,
      rowSpan: rowSpan !== undefined ? rowSpan : cell.rowSpan,
      fieldType: selectedFieldType || cell.fieldType,
      editable: editable, //!== undefined ? editable : cell.editable,
      qrScan: qrScan !== undefined ? qrScan : cell.qrScan,
      requiredfield: required !== undefined ? required : cell.requiredfield,
      cellCSS: cellCSS || cell.cellCSS,
      dropDownFields: formValues.dropDownFields, // Save dropDownFields
      maxVal: formValues.maxVal,
      minVal: formValues.minVal,
      decimalPoints: formValues.decimalPoints || 2,
      datePattern: formValues.datepattern,
      buttonKeyValue: formValues.buttonKey,
      apiBody: formValues.apiBody,
      apiMethod: formValues.apiMethod,
      apiUrl: formValues.apiUrl,
      imagePath: formValues.imagePath, // Save image name with extension
      imgHeight: formValues.imgHeight, // Save imgHeight
      imgWidth: formValues.imgWidth, // Save imgWidth
      fileContent: formValues.fileContent, // Save image as byte array
      globalExpressionLogic: globalCellExpType === "SQL" ? cellUpdateSQL : "",
      buttonLogic: buttonType !== "Rest API" ? buttonLogic : "",
      depExpressionLogic: valueExpression,
      disableExpressionLogic: desableExp,
      conditionalCssExpression: conditionalCssExpression,
      buttonType: buttonType || "SQL", //added for button type
      globalCellExpType: globalCellExpType || "SQL", //added for global cell exp type in pojo or DB
      depExpressionType: depExpressionType || "SQL",
      disabledExpType: disabledExpType || "SQL",
      conditionalCssExpType: conditionalCssExpType || "Expression",
      pollStartExpType: pollStartExpType || "SQL",
      pollStopExpType: pollStopExpType || "SQL",
      pollStopExpressionLogic: pollStopExpressionLogic,
      pollStartExpressionLogic: pollStartExpressionLogic,
      autoRefresh: autoRefresh,
      pollInterval: formValues.pollInterval || 1,
    };

    setClickedCell(updatedCell);
    setClickedCellForIcon(updatedCell);
    console.log("Updated Cell : ", updatedCell);
    // debugger;
    setVisible(false);
    // setClickedCell(null);
    // setToggledCell(null);
    setSwitchStates({});
    setShowCheckbox(false);
    // setSelectedCells(new Set());
    setResultArray([]);
    // setClickedCell(null);
    setWithToggle(false);
  };
  const handleFileUpload = (byteArray, fileName) => {
    console.log("byte Array : ", byteArray);
    console.log("My file Name : ", fileName?.name);
    setFormValues({
      ...formValues,
      fileContent: byteArray, // Save byte array to state
      imagePath: fileName?.name, // Save file name
    });
  };
  const renderDynamicField = () => {
    switch (selectedFieldType) {
      case "Text":
        return (
          <>
            {/* <InputText
            value={formValues.text}
            onChange={(e) =>
              setFormValues({ ...formValues, text: e.target.value })
            }
          /> */}
          </>
        );
      case "CommentBox":
        return (
          <></>
          // <InputTextarea
          //   value={formValues.comment}
          //   onChange={(e) =>
          //     setFormValues({ ...formValues, comment: e.target.value })
          //   }
          // />
        ); // Corrected

      case "Number":
        return (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <div
                className="p-field"
                style={{ width: "25%", textAlign: "left" }}
              >
                <label htmlFor="Min Value">Min Value</label>
              </div>
              <div style={{ width: "65%" }}>
                <InputNumber
                  id="Min Value"
                  value={formValues.minVal}
                  onValueChange={(e) => {
                    console.log(e);
                    setFormValues({ ...formValues, minVal: e.value });
                  }}
                  placeholder="Default : -999.0"
                  // mode="decimal"
                  showButtons
                  // min={-999.0}
                  // max={998.00}
                  minFractionDigits={2}
                  maxFractionDigits={formValues.decimalPoints}
                  useGrouping={false}
                  // mode="decimal"
                  // showButtons
                  // min={0}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <div
                className="p-field"
                style={{ width: "25%", textAlign: "left" }}
              >
                <label htmlFor="Min Value">Max Value</label>
              </div>
              <div style={{ width: "65%" }}>
                <InputNumber
                  id="Max Value"
                  value={formValues.maxVal}
                  onValueChange={(e) =>
                    setFormValues({ ...formValues, maxVal: e.value })
                  }
                  placeholder="Default : 999.0"
                  showButtons
                  minFractionDigits={2}
                  maxFractionDigits={formValues.decimalPoints}
                  useGrouping={false}
                  // min={-998}
                  // max={999}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <div
                className="p-field"
                style={{ width: "25%", textAlign: "left" }}
              >
                <label htmlFor="DecimalPoints">Decimal Places</label>
              </div>
              <div style={{ width: "65%" }}>
                {/* <InputNumber
                  id="DecimalPoints"
                  value={formValues.decimalPoints}
                  onValueChange={(e) =>
                    setFormValues({ ...formValues, decimalPoints: e.value })
                  }
                  placeholder="Default : 2"
                  showButtons
                  useGrouping={false}
                  // minFractionDigits={2}
                  // maxFractionDigits={formValues.decimalPoints}
                  // min={-998}
                  // max={999}
                /> */}
                <InputNumber
                  id="DecimalPoints"
                  value={formValues.decimalPoints}
                  onValueChange={(e) => {
                    // Ensure decimalPoints is always >= 2
                    let newDecimalPoints = Math.max(Math.round(e.value), 2); // Ensure value is >= 2
                    setFormValues({
                      ...formValues,
                      decimalPoints: newDecimalPoints,
                    });
                  }}
                  placeholder="Default : 2"
                  showButtons
                  useGrouping={false}
                  min={2} // Ensure no negative values are allowed
                  max={20} // Ensure max value is 20
                  // minFractionDigits={2}
                  maxFractionDigits={Math.max(formValues.decimalPoints, 2)} // Ensure maxFractionDigits is >= 2
                />
              </div>
            </div>
          </>
        );
      case "Dropdown":
        return (
          <>
            {valueExpression.trim() === "" && (
              <DropdownTable
                items={formValues.dropDownFields}
                setItems={updateDropdownItems}
              />
            )}
          </>
        );
      case "Boolean":
        return (
          <></>
          // <ToggleButton
          //   checked={formValues.booleanValue}
          //   onChange={(e) =>
          //     setFormValues({ ...formValues, booleanValue: e.value })
          //   }
          // />
        );
      case "Date":
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <div
              className="p-field"
              style={{ width: "25%", textAlign: "left" }}
            >
              <label htmlFor="Date Format">Date Format</label>
            </div>
            <div style={{ width: "65%" }}>
              <InputText
                id="Date Format"
                value={formValues.datepattern}
                onChange={(e) =>
                  setFormValues({ ...formValues, datepattern: e.target.value })
                }
                placeholder="default : dd/MM/yyyy"
              />
            </div>
          </div>
        );
      case "DateTime":
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <div
              className="p-field"
              style={{ width: "25%", textAlign: "left" }}
            >
              <label htmlFor="Datetime Format">Datetime Format</label>
            </div>
            <div style={{ width: "65%" }}>
              <InputText
                id="Datetime Format"
                value={formValues.datepattern}
                onChange={(e) =>
                  setFormValues({ ...formValues, datepattern: e.target.value })
                }
                placeholder="default : dd/MM/yyyy hh:mm"
              />
            </div>
          </div>
        );
      case "Time":
        return (
          <></>
          // <Calendar
          //   value={formValues.date}
          //   onChange={(e) => setFormValues({ ...formValues, date: e.value })}
          //   showTime={selectedFieldType === "DateTime"}
          // />
        );
      case "Image":
        return (
          <>
            {/* Conditionally render FileUpload if no file is uploaded */}
            {!imagePreview && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <div style={{ width: "25%", textAlign: "left" }}></div>
                <div
                  className="p-field"
                  style={{ width: "65%", textAlign: "left" }}
                >
                  <FileUpload
                    // ref={fileUploadRef}
                    auto
                    mode="basic"
                    accept="image/*"
                    maxFileSize={1000000}
                    customUpload
                    uploadHandler={handleImageUpload}
                  />
                </div>
              </div>
            )}

            {/* Conditionally render image preview and controls */}
            {imagePreview && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <div style={{ width: "25%", textAlign: "left" }}>
                  <h5>Image Preview:</h5>
                </div>
                <div
                  className="p-field"
                  style={{ width: "65%", textAlign: "left" }}
                >
                  <div
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <img
                      src={imagePreview}
                      alt="Uploaded"
                      style={{
                        width: formValues.imgWidth
                          ? `${formValues.imgWidth}px`
                          : "auto",
                        height: formValues.imgHeight
                          ? `${formValues.imgHeight}px`
                          : "auto",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                      }}
                    />
                    <ClearIcon
                      onClick={handleRemoveImage}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "3px",
                        cursor: "pointer",
                        fontSize: "24px",
                        color: "#f00",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <div
                className="p-field"
                style={{ width: "25%", textAlign: "left" }}
              >
                <label htmlFor="Min Value">Image Height</label>
              </div>
              <div style={{ width: "65%" }}>
                <InputNumber
                  id="image height"
                  value={formValues.imgHeight}
                  onValueChange={(e) =>
                    setFormValues({ ...formValues, imgHeight: e.value })
                  }
                  showButtons
                  // placeholder="Image Height"
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <div
                className="p-field"
                style={{ width: "25%", textAlign: "left" }}
              >
                <label>Image Width</label>
              </div>
              <div style={{ width: "65%" }}>
                <InputNumber
                  value={formValues.imgWidth}
                  onValueChange={(e) =>
                    setFormValues({ ...formValues, imgWidth: e.value })
                  }
                  placeholder="Image Width"
                  showButtons
                />
              </div>
            </div>
          </>
        );
      case "File":
        return (
          <>
            {valueExpression.trim() === "" && (
              <FileUploadComponent
                byteArray={
                  selectedFieldType === "File" ? formValues.fileContent : null
                }
                fileNamePath={formValues.imagePath}
                onFileUpload={handleFileUpload}
              />
            )}
          </>
        );
      case "API":
        return (
          <>
            <ApiRequestForm
              formValues={formValues}
              setFormValues={setFormValues}
              // validateJson={validateJson}
              depDataList={depDataList}
              cell={cell}
            ></ApiRequestForm>
          </>
        );
      case "Button":
        return (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <div
                className="p-field"
                style={{ width: "25%", textAlign: "left" }}
              >
                <label htmlFor="Button">Icon</label>
              </div>
              <div style={{ width: "65%" }}>
                <Dropdown
                  value={formValues.selectedIcon}
                  options={[
                    { label: "Icon1", value: "Icon1" },
                    { label: "Icon2", value: "Icon2" },
                  ]}
                  onChange={(e) =>
                    setFormValues({ ...formValues, selectedIcon: e.value })
                  }
                  disabled={true}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <div
                className="p-field"
                style={{ width: "25%", textAlign: "left" }}
              >
                <label htmlFor="Min Value">Button Key</label>
              </div>
              <div style={{ width: "65%" }}>
                <InputText
                  value={formValues.buttonKey}
                  onChange={(e) =>
                    setFormValues({ ...formValues, buttonKey: e.target.value })
                  }
                  placeholder="Button Key"
                />
              </div>
            </div>
          </>
        );
      case "URL":
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <div
              className="p-field"
              style={{ width: "25%", textAlign: "left" }}
            >
              <label htmlFor="Min Value">URL</label>
            </div>
            <div style={{ width: "65%" }}>
              <InputText
                value={formValues.url}
                onChange={(e) =>
                  setFormValues({ ...formValues, url: e.target.value })
                }
                placeholder="Enter URL"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-fluid">
      {/* Basic Section */}
      <TabView className="tabViewStyleWithPadding">
        <TabPanel
          header={
            <>
              <i
                className="pi pi-check-circle"
                style={{ marginRight: "0.5rem", fontSize: "0.8rem" }}
              ></i>
              <span style={{ fontSize: "0.9rem" }}>Basic</span>
            </>
          }
        >
          {/* <Divider>
            <Chip label="Basic" size="medium" />
          </Divider> */}
          {/* <Grid container spacing={2}></Grid> */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <div
              className="p-field"
              style={{ width: "25%", textAlign: "left" }}
            >
              <label htmlFor="cellName">Cell Name</label>
            </div>
            <div className="p-field" style={{ width: "65%" }}>
              {/* <label htmlFor="cellName">Cell Name</label> */}
              <InputText
                id="cellName"
                value={cellName}
                onChange={handleCellNameChange}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <div
              className="p-field"
              style={{ width: "25%", textAlign: "left" }}
            >
              <label htmlFor="cellContext">Cell Description</label>
            </div>
            <div className="p-field" style={{ width: "65%" }}>
              {/* <label htmlFor="cellName">Cell Name</label> */}
              <InputTextarea
                id="cellContext"
                value={cellContext}
                onChange={handleCellContextChange}
                rows={1}
                autoResize
                // cols={30}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <div style={{ width: "25%", textAlign: "left" }}>
              <label htmlFor="fieldType">Field Type</label>
            </div>
            <div className="p-field" style={{ width: "65%" }}>
              <Dropdown
                filter
                value={selectedFieldType}
                options={fieldTypes}
                onChange={handleFieldChange}
                placeholder="Select Field Type"
              />
            </div>
          </div>
          <div className="form-field">{renderDynamicField()}</div>
          {!(
            selectedFieldType === "Button" ||
            selectedFieldType === "Image" ||
            selectedFieldType === "API"
          ) && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <div
                  className="p-field"
                  style={{ width: "25%", textAlign: "left" }}
                >
                  <label htmlFor="editable">Editable</label>
                </div>
                <div className="p-field" style={{ width: "65%" }}>
                  <InputSwitch
                    id="editable"
                    checked={editable}
                    onChange={handleEditableChange}
                    // onLabel="Yes"
                    // offLabel="No"
                  />
                </div>
              </div>
              {editable && (
                <>
                  {(selectedFieldType === "Text" ||
                    selectedFieldType === "CommentBox") && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        // marginBottom: "10px",
                      }}
                    >
                      <div
                        className="p-field"
                        style={{ width: "25%", textAlign: "left" }}
                      >
                        <label htmlFor="qrScan">Enable QR Scan ?</label>
                      </div>
                      <div className="p-field" style={{ width: "65%" }}>
                        <InputSwitch
                          id="qrScan"
                          checked={qrScan}
                          onChange={handleIsQrScanChange}
                          // onLabel="Yes"
                          // offLabel="No"
                        />
                      </div>
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      // marginBottom: "10px",
                    }}
                  >
                    <div
                      className="p-field"
                      style={{ width: "25%", textAlign: "left" }}
                    >
                      <label htmlFor="required">Required Field?</label>
                    </div>
                    <div className="p-field" style={{ width: "65%" }}>
                      <InputSwitch
                        id="required"
                        checked={required}
                        onChange={handleRequiredChange}
                        // onLabel="Yes"
                        // offLabel="No"
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </TabPanel>
        <TabPanel
          header={
            <>
              <i
                className="pi pi-cog"
                style={{ marginRight: "0.5rem", fontSize: "0.8rem" }}
              ></i>
              <span style={{ fontSize: "0.9rem" }}>Advanced</span>
            </>
          }
        >
          {/* <div className="p-field">
            <label htmlFor="colSpan">ColSpan</label>
            <InputNumber
              // disabled={true}
              id="colSpan"
              value={colSpan}
              onValueChange={handleColSpanChange}
              min={1}
              mode="decimal"
              showButtons
              max={100}
            />
          </div>
          <div className="p-field">
            <label htmlFor="rowSpan">RowSpan</label>
            <InputNumber
              // disabled={true}
              id="rowSpan"
              value={rowSpan}
              onValueChange={handleRowSpanChange}
              min={1}
              mode="decimal"
              showButtons
              max={100}
            />
          </div> */}

          <div>
            {/* {selectedFieldType !== "Image" && ( */}
            <>
              {selectedFieldType !== "URL" && (
                <Accordion
                  className="custom-accordion"
                  // activeIndex={0}
                >
                  {/* Button Logic */}
                  {selectedFieldType === "Button" && (
                    <AccordionTab
                      header={
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "0.9rem",
                          }}
                        >
                          <i
                            className="pi pi-lightbulb"
                            style={{ marginRight: "10px" }}
                          />
                          Button Configuration
                        </div>
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "1rem",
                          padding: "1rem",
                          borderRadius: "8px",
                          background: "#f9f9f9",
                        }}
                      >
                        <div
                          className="card flex justify-content-start"
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <SelectButton
                            style={{
                              width: "25rem", // Reduced width for a smaller area
                              borderRadius: "4px",
                            }}
                            value={buttonType}
                            onChange={handleButtonExpressionTypeChange}
                            options={buttonOptions}
                            className="p-button-raised SelectButtonStyle"
                          />
                        </div>
                        {buttonType !== "Rest API" && (
                          <div className="p-field">
                            {/* {
                              //cell?.dependent === true &&
                              depDataList?.length !== 0 && ( */}
                            {isOnline ? (
                              <PickListDemo
                                depData={depDataList}
                                textAreaValue={buttonLogic}
                                setTextAreaValue={setButtonLogic}
                                expressionType={buttonType}
                              ></PickListDemo>
                            ) : (
                              <PickListDemoWithoutInternet
                                depData={depDataList}
                                textAreaValue={buttonLogic}
                                setTextAreaValue={setButtonLogic}
                                expressionType={buttonType}
                              ></PickListDemoWithoutInternet>
                            )}

                            {/* )
                            } */}
                            {/* {depDataList?.length === 0 && (
                              <InputTextarea
                                value={buttonLogic}
                                onChange={handlebuttonLogicChange}
                                placeholder="Write your button configuration logic here"
                                rows={5}
                                style={{
                                  borderRadius: "8px",
                                  border: "1px solid #ddd",
                                  boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                                }}
                              />
                            )} */}
                          </div>
                        )}
                        {buttonType === "Rest API" && (
                          <>
                            <ApiRequestForm
                              formValues={formValues}
                              setFormValues={setFormValues}
                              // validateJson={validateJson}
                              cell={cell}
                              depDataList={depDataList}
                            ></ApiRequestForm>
                          </>
                        )}
                      </div>
                    </AccordionTab>
                  )}
                  {/* Configure Value Expression */}
                  {selectedFieldType !== "Button" && (
                    <AccordionTab
                      header={
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "0.9rem",
                          }}
                        >
                          {selectedFieldType === "Dropdown" ? (
                            <>
                              <i
                                className="pi pi-list"
                                style={{ marginRight: "10px" }}
                              />
                              Dropdown SQL
                            </>
                          ) : (
                            <>
                              <i
                                className="pi pi-sliders-h"
                                style={{ marginRight: "10px" }}
                              />
                              Configure Value
                            </>
                          )}
                        </div>
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "1rem",
                          padding: "1rem",
                          borderRadius: "8px",
                          background: "#f9f9f9",
                        }}
                      >
                        {selectedFieldType !== "Dropdown" && (
                          <div
                            className="card flex justify-content-start"
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <SelectButton
                              style={{
                                width: "12rem", // Reduced width for a smaller area
                                borderRadius: "4px",
                              }}
                              value={depExpressionType}
                              onChange={(e) => {
                                setDepExpressionType(e.value);
                              }}
                              options={options}
                              className="p-button-raised SelectButtonStyle"
                            />
                          </div>
                        )}
                        <div className="p-field">
                          {/* {depDataList?.length === 0 && (
                            <InputTextarea
                              value={valueExpression}
                              onChange={handleValueExpressionChange}
                              placeholder="Write your query here (avoid newlines)"
                              rows={5}
                              style={{
                                borderRadius: "8px",
                                border: "1px solid #ddd",
                                boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                              }}
                            />
                          )} */}
                          {/* {
                            //cell?.dependent === true &&
                            depDataList?.length !== 0 && ( */}
                          {isOnline ? (
                            <PickListDemo
                              depData={depDataList}
                              textAreaValue={valueExpression}
                              setTextAreaValue={setValueExpression}
                              expressionType={depExpressionType}
                            ></PickListDemo>
                          ) : (
                            <PickListDemoWithoutInternet
                              depData={depDataList}
                              textAreaValue={valueExpression}
                              setTextAreaValue={setValueExpression}
                              expressionType={depExpressionType}
                            ></PickListDemoWithoutInternet>
                          )}

                          {/* )
                          } */}
                        </div>
                      </div>
                    </AccordionTab>
                  )}

                  {/* Configure All Cell Update SQL */}
                  {selectedFieldType !== "Button" && (
                    <AccordionTab
                      header={
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "0.9rem",
                          }}
                        >
                          <i
                            className="pi pi-database"
                            style={{ marginRight: "10px" }}
                          />
                          {`Global cell update (logic configuration for 'onChange' event to update
                          other cells)`}
                        </div>
                      }
                    >
                      <div
                        style={{
                          padding: "1rem",
                          background: "#f9f9f9",
                          borderRadius: "8px",
                        }}
                      >
                        <div
                          className="card flex justify-content-start"
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginBottom: "10px",
                          }}
                        >
                          <SelectButton
                            style={{
                              width: "12rem", // Reduced width for a smaller area
                              borderRadius: "4px",
                            }}
                            value={globalCellExpType}
                            onChange={handleGlobalExpressionTypeChange}
                            options={globalCellOptions}
                            className="p-button-raised SelectButtonStyle"
                          />
                        </div>
                        {globalCellExpType === "SQL" && (
                          <div className="p-field">
                            {/* {depDataList?.length === 0 && (
                              <InputTextarea
                                value={cellUpdateSQL}
                                onChange={handleCellUpdateSQLChange}
                                placeholder="Write SQL query here"
                                rows={5}
                                style={{
                                  borderRadius: "8px",
                                  border: "1px solid #ddd",
                                  boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                                }}
                              />
                            )} */}
                            {/* {
                              //cell?.dependent === true &&
                              depDataList?.length !== 0 && ( */}
                            {isOnline ? (
                              <PickListDemo
                                depData={depDataList}
                                textAreaValue={cellUpdateSQL}
                                setTextAreaValue={setCellUpdateSQL}
                                expressionType={globalCellExpType}
                              ></PickListDemo>
                            ) : (
                              <PickListDemoWithoutInternet
                                depData={depDataList}
                                textAreaValue={cellUpdateSQL}
                                setTextAreaValue={setCellUpdateSQL}
                                expressionType={globalCellExpType}
                              ></PickListDemoWithoutInternet>
                            )}

                            {/* )
                            } */}
                          </div>
                        )}
                        {globalCellExpType === "Rest API" && (
                          <>
                            <ApiRequestForm
                              formValues={formValues}
                              setFormValues={setFormValues}
                              // validateJson={validateJson}
                              cell={cell}
                              depDataList={depDataList}
                            ></ApiRequestForm>
                          </>
                        )}
                      </div>
                    </AccordionTab>
                  )}
                  {/* Disabled Condition */}
                  <AccordionTab
                    className="accordionTabStyle"
                    header={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "0.9rem",
                        }}
                      >
                        <i
                          className="pi pi-ban"
                          style={{ marginRight: "10px" }}
                        />
                        Disabled Condition
                      </div>
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        padding: "1rem",
                        borderRadius: "8px",
                        background: "#f9f9f9",
                      }}
                    >
                      <div
                        className="card flex justify-content-start"
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <SelectButton
                          style={{
                            width: "12rem", // Reduced width for a smaller area
                            borderRadius: "4px",
                            padding: "0.2rem",
                          }}
                          value={disabledExpType}
                          onChange={handleDisabledExpressionTypeChange}
                          options={options}
                          className="p-button-raised SelectButtonStyle"
                        />
                      </div>
                      {/* {depDataList?.length === 0 && (
                        <div className="p-field">
                          <InputTextarea
                            value={desableExp}
                            onChange={handleDesableExpChange}
                            placeholder="Write your disabled condition here"
                            rows={5}
                            style={{
                              borderRadius: "8px",
                              border: "1px solid #ddd",
                              boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                            }}
                          />
                        </div>
                      )} */}
                      {/* {
                        //cell?.dependent === true &&
                        depDataList?.length !== 0 && ( */}
                      {isOnline ? (
                        <PickListDemo
                          depData={depDataList}
                          textAreaValue={desableExp}
                          setTextAreaValue={setDesableExp}
                          disabledArea={true}
                          expressionType={disabledExpType}
                        ></PickListDemo>
                      ) : (
                        <PickListDemoWithoutInternet
                          depData={depDataList}
                          textAreaValue={desableExp}
                          setTextAreaValue={setDesableExp}
                          disabledArea={true}
                          expressionType={disabledExpType}
                        ></PickListDemoWithoutInternet>
                      )}

                      {/* )
                      } */}
                    </div>
                  </AccordionTab>
                  <AccordionTab
                    className="accordionTabStyle"
                    header={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "0.9rem",
                        }}
                      >
                        <i
                          className="pi pi-palette"
                          style={{ marginRight: "10px" }}
                        />
                        Conditional Custom CSS
                      </div>
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        padding: "1rem",
                        borderRadius: "8px",
                        background: "#f9f9f9",
                      }}
                    >
                      {/* <div
                        className="card flex justify-content-start"
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <SelectButton
                          style={{
                            width: "12rem", // Reduced width for a smaller area
                            borderRadius: "4px",
                            padding: "0.2rem",
                          }}
                          value={conditionalCssExpType}
                          onChange={handleConditionalCssExpTypeChange}
                          options={options}
                          className="p-button-raised SelectButtonStyle"
                        />
                      </div> */}

                      {
                        // isOnline ? (
                        //   <PickListDemo
                        //     depData={depDataList}
                        //     textAreaValue={desableExp}
                        //     setTextAreaValue={setDesableExp}
                        //     disabledArea={true}
                        //     expressionType={disabledExpType}
                        //   ></PickListDemo>
                        // ) : (
                        <PickListDemoWithCssEditor
                          depData={depDataList}
                          textAreaValue={conditionalCssExpression}
                          setTextAreaValue={setConditionalCssExpression}
                          disabledArea={true}
                          expressionType={conditionalCssExpType}
                        ></PickListDemoWithCssEditor>
                        // )
                      }

                      {/* )
                      } */}
                    </div>
                  </AccordionTab>
                </Accordion>
              )}
            </>
            {/* )} */}
          </div>

          {/* Auto Refresh Field Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <div style={{ width: "25%", textAlign: "left" }}>
              <label htmlFor="autoRefresh">Auto Refresh Field?</label>
            </div>
            <div className="p-field" style={{ width: "65%" }}>
              <ToggleButton
                className="SelectButtonStyle"
                id="autoRefresh"
                checked={autoRefresh}
                onChange={handleAutoRefreshChange}
                onLabel="Yes"
                offLabel="No"
              />
            </div>
          </div>
          {autoRefresh && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <div
                  className="p-field"
                  style={{ width: "25%", textAlign: "left" }}
                >
                  <label htmlFor="Min Value">
                    {" "}
                    {`Refresh Interval (Seconds)`}
                  </label>
                </div>
                <div style={{ width: "65%" }}>
                  <InputNumber
                    id="Min Value"
                    value={formValues.pollInterval}
                    onValueChange={(e) =>
                      setFormValues({ ...formValues, pollInterval: e.value })
                    }
                    placeholder="Default : 1"
                    // mode="decimal"
                    showButtons
                    min={1}
                    // max={998}
                  />
                </div>
              </div>
              <div>
                <Accordion className="custom-accordion">
                  {/* Configure Value Expression */}
                  <AccordionTab
                    header={
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <i
                          className="pi pi-play-circle"
                          style={{ marginRight: "10px" }}
                        />
                        Start Condition
                      </div>
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        padding: "1rem",
                        borderRadius: "8px",
                        background: "#f9f9f9",
                      }}
                    >
                      <div
                        className="card flex justify-content-start"
                        style={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <SelectButton
                          style={{
                            width: "15rem", // Reduced width for a smaller area
                            borderRadius: "4px",
                          }}
                          value={pollStartExpType}
                          onChange={(e) => setPollStartExpType(e.value)}
                          options={options}
                          className="p-button-raised"
                        />
                      </div>
                      <div className="p-field">
                        {/* <InputTextarea
                          value={pollStartExpressionLogic}
                          onChange={(e) =>
                            setPollStartExpressionLogic(e.target.value)
                          }
                          placeholder="Write your query here (avoid newlines)"
                          rows={5}
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                          }}
                        /> */}

                        {/* {cell.dependentFields && (
                          <PickListDemo
                            depData={cell.dependentFields}
                            textAreaValue={valueExpression}
                            setTextAreaValue={setValueExpression}
                          ></PickListDemo>
                        )} */}

                        {/* {depDataList?.length === 0 && (
                          <InputTextarea
                            value={pollStartExpressionLogic}
                            onChange={(e) =>
                              setPollStartExpressionLogic(e.target.value)
                            }
                            placeholder="Write your query here (avoid newlines)"
                            rows={5}
                            style={{
                              borderRadius: "8px",
                              border: "1px solid #ddd",
                              boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                            }}
                          />
                        )}
                        {
                          //cell?.dependent === true &&
                          depDataList?.length !== 0 && ( */}

                        {isOnline ? (
                          <PickListDemo
                            depData={depDataList}
                            textAreaValue={pollStartExpressionLogic}
                            setTextAreaValue={setPollStartExpressionLogic}
                            expressionType={pollStartExpType}
                          ></PickListDemo>
                        ) : (
                          <PickListDemoWithoutInternet
                            depData={depDataList}
                            textAreaValue={pollStartExpressionLogic}
                            setTextAreaValue={setPollStartExpressionLogic}
                            expressionType={pollStartExpType}
                          ></PickListDemoWithoutInternet>
                        )}

                        {/* )
                        } */}
                      </div>
                    </div>
                  </AccordionTab>

                  {/* Disabled Condition */}
                  <AccordionTab
                    header={
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <i
                          className="pi pi-stop-circle"
                          style={{ marginRight: "10px" }}
                        />
                        Stop Condition
                      </div>
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        padding: "1rem",
                        borderRadius: "8px",
                        background: "#f9f9f9",
                      }}
                    >
                      <div
                        className="card flex justify-content-start"
                        style={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <SelectButton
                          style={{
                            width: "15rem", // Reduced width for a smaller area
                            borderRadius: "4px",
                          }}
                          value={pollStopExpType}
                          onChange={(e) => setPollStopExpType(e.value)}
                          options={options}
                          className="p-button-raised"
                        />
                      </div>
                      <div className="p-field">
                        {/* <InputTextarea
                          value={pollStartExpressionLogic}
                          onChange={(e) =>
                            setPollStartExpressionLogic(e.target.value)
                          }
                          placeholder="Write your query here (avoid newlines)"
                          rows={5}
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                          }}
                        /> */}

                        {/* {cell.dependentFields && (
                          <PickListDemo
                            depData={cell.dependentFields}
                            textAreaValue={valueExpression}
                            setTextAreaValue={setValueExpression}
                          ></PickListDemo>
                        )} */}

                        {/* {depDataList?.length === 0 && (
                          <InputTextarea
                            value={pollStartExpressionLogic}
                            onChange={(e) =>
                              setPollStartExpressionLogic(e.target.value)
                            }
                            placeholder="Write your query here (avoid newlines)"
                            rows={5}
                            style={{
                              borderRadius: "8px",
                              border: "1px solid #ddd",
                              boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                            }}
                          />
                        )}
                        {
                          //cell?.dependent === true &&
                          depDataList?.length !== 0 && ( */}
                        {isOnline ? (
                          <PickListDemo
                            depData={depDataList}
                            textAreaValue={pollStopExpressionLogic}
                            setTextAreaValue={setPollStopExpressionLogic}
                            expressionType={pollStopExpType}
                          ></PickListDemo>
                        ) : (
                          <PickListDemoWithoutInternet
                            depData={depDataList}
                            textAreaValue={pollStopExpressionLogic}
                            setTextAreaValue={setPollStopExpressionLogic}
                            expressionType={pollStopExpType}
                          ></PickListDemoWithoutInternet>
                        )}

                        {/* )
                        } */}
                      </div>
                    </div>
                  </AccordionTab>
                </Accordion>
              </div>
            </>
          )}
          {/* Cell CSS Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ width: "25%", textAlign: "left" }}>
              <h4>Cell CSS</h4>
            </div>
            <div className="p-field" style={{ width: "65%" }}>
              <Button
                label="Edit CSS"
                icon="pi pi-cog"
                onClick={() => {
                  setCssDraft(cellCSS); // initialize with current value
                  setShowCssDialog(true);
                }}
                className="p-button-outlined"
              />
              <InputText
                value={cellCSS}
                readOnly
                style={{ width: "100%", marginTop: 8 }}
                placeholder="text-align:center;"
              />
            </div>
          </div>
        </TabPanel>
      </TabView>
      <div className="p-field">
        {(tableForm?.publicAccess === true ||
          (tableForm?.publicAccess === false &&
            loggedInUser?.trim() === tableForm?.userId?.trim()) ||
          tableForm === null) && (
          <Button size="small" label="OK" onClick={saveCellDetails} />
        )}
      </div>
      <div>
        <SnackbarComponent
          openPopup={snackbarOpen} // State to control snackbar open/close
          setOpenPopup={setSnackbarOpen} // Function to update snackbar state
          dialogMessage={snackbarText} // Message to display in the snackbar
          snackbarSeverity={snackbarSeverity} // Severity level of the snackbar (e.g., success, error)
        />
      </div>
      <Dialog
        header="Cell CSS Builder"
        visible={showCssDialog}
        style={{ width: "50vw", minWidth: 400 }}
        onHide={() => setShowCssDialog(false)}
        modal
      >
        <CellCssBuilder value={cssDraft} onChange={setCssDraft} />
        <div style={{ marginTop: 16, textAlign: "right" }}>
          <Button
            label="OK"
            icon="pi pi-check"
            onClick={() => {
              setCellCSS(cssDraft); // save to parent
              setShowCssDialog(false);
            }}
            autoFocus
          />
        </div>
      </Dialog>
    </div>
  );
};

export default FormDesign;
