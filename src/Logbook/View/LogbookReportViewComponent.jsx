// Importing React and necessary hooks to create our component.
import React, { useEffect, useState } from "react";

// Importing components from Material UI to help build our UI easily.
import {
  Grid, // This helps us create a layout with rows and columns.
  Paper, // This creates a nice card-like container for our content.
  Typography, // This is for displaying text with different styles.
  Divider, // This creates a line to separate different parts of the UI.
  Button, // This is a clickable button for user actions.
  CircularProgress,
  Alert,
  Snackbar,
  Slide, // This shows a spinning circle to indicate loading.
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { extendTokenExpiration } from "../../helper/AuthService"; // This helps keep the user's session active.
import {
  getAllCellInfoByFormNameAndVersion,
  getAttachmentsByTransactionId,
} from "../LogbookApi"; // This gets data based on the form name and version.
import { formatDatetime } from "../../JobAssign/helper"; // This formats date and time into a nice readable format.
import { AnimatePresence, motion } from "framer-motion";
import FileCellComponent from "../../Logbook Configure/FileCellComponent";

// This component will display multiple logbooks according to various parameters like gridData, formatId, documentId, taskName, activityName, assetName etc.

// Here we start defining our functional component.
// A functional component is a piece of code that returns some UI to be displayed on the screen.
export default function LogbookReportViewComponent({
  gridData, // This holds the data for the report.
  formatId, // This is the ID of the format we're using.
  documentId, // This is the ID of the document we're working with.
  isLoading, // This shows if the data is still loading.
  tenentUserData, // This holds user data for the tenant.
  taskName, // This is the name of the task.
  activityName, // This is the name of the activity.
  assetName, // This is the name of the asset.
  jobName,
  performer,
  handleExportPDF, // This is a function to export the report as a PDF.
}) {
  // State variables to hold our data and loading status.
  const [colTot, setColTot] = useState(); // This will hold the total number of columns.
  const [cellData, setCellData] = useState([]); // This will hold the cell data we get from our API.
  const [showDataGrid, setShowDataGrid] = useState(false); // This shows or hides the data grid.

  const [errorOpen, setErrorOpen] = useState(false); // To control error messages
  const [snackbarText, setSnackbarText] = useState(""); // Text for snackbar messages
  const [snackbarSeverity, setsnackbarSeverity] = useState(""); // Severity level of snackbar messages
  const [attachmentData, setAttachmentData] = useState(null);

  const [gridProperties, setGridPropertes] = useState({
    maxColNum: 0,
    occupiedGrid: [],
  });

  useEffect(() => {
    // This runs when the component mounts and when gridData changes.
    extendTokenExpiration(); // Keeps the user's session active.

    async function fetchData() {
      const files = await getAttachmentsByTransactionId(gridData.transactionId);
      setAttachmentData(files);
      setShowDataGrid(true); // Show loading indicator.
      let data = await getAllCellInfoByFormNameAndVersion(
        gridData.formName, // Get data for the specific form name.
        gridData.formversion, // Get data for the specific form version.
      );
      if (!data) {
        setsnackbarSeverity("error");
        setSnackbarText("Error fatching details");
        setErrorOpen(true); // Show Snackbar
        return;
      } else {
        setCellData(data); // Save the data we got into state.
        // Calculate the total number of columns from the data.
        const maxCol = Math.max(
          ...data?.flatMap((item) => item.cellData.map((cell) => cell.colNum)),
        );
        setColTot(() => maxCol);
        setShowDataGrid(false); // Hide loading indicator.
        fillCell(data);
      }
    }
    fetchData(); // Call the function to fetch data.
  }, [gridData.formName, gridData.formversion, gridData]); // Run when form name or version changes.

  const fillCell = (logData) => {
    if (logData) {
      const allCells = logData.flatMap((item) =>
        Array.isArray(item.cellData) ? item.cellData : [],
      );

      // Compute max col considering colSpan
      const maxColNum = Math.max(
        ...allCells.map((cell) => {
          const colNum = parseInt(cell.colNum, 10) || 0;
          const colSpan = parseInt(cell.colSpan, 10) || 1;
          return colNum + colSpan - 1;
        }),
      );

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
          // Mark cells as occupied based on their rowNum and colNum
          for (let i = 0; i < cell.rowSpan; i++) {
            for (let j = 0; j < cell.colSpan; j++) {
              const rowIndex = cell.rowNum - 1 + i;
              const colIndex = cell.colNum - 1 + j;

              // Check if the indices are within bounds
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

  const handleClose = (event, reason) => {
    // This function hides the (Snackbar) error message when we click on it.
    if (reason === "clickaway") {
      // If we clicked away, do nothing.
      return;
    }
    setErrorOpen(false); // Otherwise, hide (Snackbar) the error message.
  };

  const containerStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${colTot}, 1fr)`, // Create a grid with 'colTot' columns.
    gap: "2px", // Space between grid items.
    overflowX: "auto", // Enable horizontal scrolling
    overflowY: "hidden", // Prevent vertical scroll (optional)
    width: "100%", // Make sure container takes full width
  };

  // This function converts CSS strings to MUI styles.
  const convertCssStringToMuiStyles = (cssString) => {
    if (!cssString) {
      return {}; // If no CSS, return an empty object.
    }
    const cssArray = cssString.split(";").map((style) => style.trim()); // Split the CSS string into an array of styles.
    const muiStyles = {}; // Create an empty object for MUI styles.

    cssArray.forEach((style) => {
      const [property, value] = style.split(":").map((part) => part.trim()); // Split each style into property and value.
      if (property && value) {
        // Convert CSS property to camelCase format.
        const camelCaseProperty = property.replace(
          /-([a-z])/g,
          (match, letter) => letter.toUpperCase(),
        );
        muiStyles[camelCaseProperty] = value; // Assign the value to the camelCase property.
      }
    });

    return muiStyles; // Return the converted MUI styles.
  };

  const renderContent = (elem) => {
    const cellValue = gridData?.logbookData?.[elem.cellId]?.value;

    // ---- Image ----
    if (elem.fieldType === "Image") {
      return (
        <img
          src={`data:image/png;base64,${elem.fileContent}`}
          height={elem.imgHeight}
          width={elem.imgWidth}
          alt="logo"
        />
      );
    }

    // ---- Boolean ----
    if (elem.fieldType === "Boolean") {
      const val = String(cellValue).toLowerCase();
      return val === "true" ? <CheckCircleIcon /> : <CancelIcon />;
    }

    if (elem.fieldType === "File") {
      const file = attachmentData.find((file) => file.cellId === elem.cellId);
      console.log("File in logbook view : ", file);
      if (!file?.fileContent) {
        elem.fileContent = null;
        // file.fileContent = null;
        // file.fileName = null;
        elem.value = cellValue; // not recommended, but valid
      } else {
        elem.fileContent = file?.fileContent ?? null;
      }

      return (
        <FileCellComponent
          elem={elem}
          byteArray={file?.fileContent ?? cellValue}
          fileNamePath={file?.fileName}
        />
      );
    }

    // ---- Editable Text ----
    if (elem.editable) {
      return cellValue ?? "";
    }

    // ---- Non-editable Text ----
    if (elem.fieldType === "Text") {
      if (elem.dependent && (cellValue == null || cellValue === "")) {
        return "";
      }
      return cellValue ?? elem.aliasId;
    }
    if (elem.fieldType === "Number") {
      if (elem.dependent && (cellValue == null || cellValue === "")) {
        return 0;
      }
      return cellValue ?? 0;
    }

    // ---- Button ----
    if (elem.fieldType === "Button") {
      return (
        <Button variant="contained" disabled>
          {elem.aliasId}
        </Button>
      );
    }

    return null;
  };

  return (
    <div>
      <AnimatePresence>
        {" "}
        {/* Wrap the component content with AnimatePresence */}
        <motion.div
          key={gridData?.jobId} // Key should change for each unique view to re-trigger animation
          initial={{ opacity: 0, x: 100 }} // Start off-screen to the right
          animate={{ opacity: 1, x: 0 }} // Animate to the center
          // exit={{ opacity: 0, x: -100 }} // Exit off-screen to the left
          // transition={{ duration: 0.3, ease: "easeOut" }} // Animation duration
        >
          {!showDataGrid ? ( // Show data grid if not loading.
            <div>
              <Divider sx={{ opacity: 1 }} /> {/* Horizontal line divider */}
              <Grid
                container
                sx={{ padding: "0.5rem 0.7rem", background: "#eeeeee" }}
              >
                {/* Displaying report metadata */}
                <Grid item xs={6} md={3} lg={3}>
                  <Typography>
                    <span style={{ fontWeight: "600" }}>Version Number:</span>{" "}
                    <span>{gridData.formversion}</span>
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3} lg={3}>
                  <Typography>
                    {" "}
                    <span style={{ fontWeight: "600" }}>Format Id:</span>{" "}
                    {formatId}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3} lg={3}>
                  <Typography>
                    {" "}
                    <span style={{ fontWeight: "600" }}>Document Id:</span>{" "}
                    {documentId}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3} lg={3}>
                  <Typography>
                    <span style={{ fontWeight: "600" }}>Timestamp:</span>
                    {gridData?.transactionTimestamp
                      ? formatDatetime(gridData.transactionTimestamp) // Format the timestamp.
                      : ""}
                  </Typography>
                </Grid>
              </Grid>
              <Divider /> {/* Another horizontal line divider */}
              <div>
                {isLoading ? ( // Show loading indicator if data is still loading.
                  <div>Loading...</div>
                ) : (
                  <div>
                    <Grid style={containerStyle}>
                      {/* //Show the grid of cell data */}
                      {cellData.map((item) =>
                        item.cellData.map((elem) => (
                          <Paper
                            key={elem.cellId} // Unique key for each cell
                            // style={{
                            //   padding: "1rem", // Space inside the cell
                            //   fontSize: "0.8rem", // Font size
                            //   gridColumn: `span ${elem.colSpan}`, // Span across columns
                            //   gridRow: `span ${elem.rowSpan}`, // Span across rows
                            //   ...convertCssStringToMuiStyles(elem.cellCSS), // Apply styles from cellCSS
                            //   display: "flex", // Use flexbox to center content
                            //   justifyContent: "center", // Center horizontally
                            //   alignItems: "center", // Center vertically
                            // }}
                            sx={{
                              padding: "0.8rem",
                              fontSize: "0.8rem",
                              gridColumn: `span ${elem.colSpan}`,
                              gridRow: `span ${elem.rowSpan}`,
                              alignContent: "center",
                              ...convertCssStringToMuiStyles(elem.cellCSS),
                            }}
                          >
                            {renderContent(elem)}
                          </Paper>
                        )),
                      )}
                      {/* // Render the content of the cell */}
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
                                  // backgroundColor: "red", // Light background for empty cells
                                  boxShadow: 2,
                                }}
                              />
                            );
                          }
                          return null; // Return null for occupied spaces
                        }),
                      )}
                    </Grid>

                    <div
                      className="footer" // Footer section of the report
                      style={{
                        display: "flex", // Use flexbox for layout
                        justifyContent: "space-between", // Space out left and right sections
                        width: "100%", // Full width
                        padding: "1rem", // Space inside the footer
                        background: "#eeeeee",
                      }}
                    >
                      <div
                        className="FooterLeftSide" // Left side of the footer
                        style={{
                          marginRight: "auto",
                          textAlign: "left",
                          width: "50%",
                        }}
                      >
                        <Typography sx={{ fontSize: "0.9rem" }}>
                          <span style={{ fontWeight: "600" }}>
                            Plant Name :
                          </span>{" "}
                          {tenentUserData?.plantName || "NA"}
                        </Typography>
                        <Typography sx={{ fontSize: "0.9rem" }}>
                          <span style={{ fontWeight: "600" }}>Address :</span>{" "}
                          {tenentUserData?.address || "NA"}
                        </Typography>
                        <Typography sx={{ fontSize: "0.9rem" }}>
                          <span style={{ fontWeight: "600" }}>Division:</span>{" "}
                          {tenentUserData?.division || "NA"}
                        </Typography>
                        <Typography sx={{ fontSize: "0.9rem" }}>
                          <span style={{ fontWeight: "600" }}>Phone:</span>{" "}
                          {tenentUserData?.phoneNumber || "0000"}
                        </Typography>
                        <Typography sx={{ fontSize: "0.9rem" }}>
                          <span style={{ fontWeight: "600" }}>Email:</span>{" "}
                          {tenentUserData?.email || "NA"}
                        </Typography>
                      </div>
                      <div
                        className="FooterRightSide" // Right side of the footer
                        style={{
                          marginRight: "auto",
                          textAlign: "left",
                          width: "50%",
                        }}
                      >
                        <Typography sx={{ fontSize: "0.9rem" }}>
                          <span style={{ fontWeight: "600" }}>Task Name :</span>{" "}
                          {taskName}
                        </Typography>
                        <Typography sx={{ fontSize: "0.9rem" }}>
                          <span style={{ fontWeight: "600" }}>Job Name:</span>{" "}
                          {jobName}
                        </Typography>
                        <Typography sx={{ fontSize: "0.9rem" }}>
                          <span style={{ fontWeight: "600" }}>
                            Activity Name:
                          </span>{" "}
                          {activityName}
                        </Typography>
                        <Typography sx={{ fontSize: "0.9rem" }}>
                          <span style={{ fontWeight: "600" }}>Asset:</span>{" "}
                          {assetName}
                        </Typography>

                        <Typography sx={{ fontSize: "0.9rem" }}>
                          <span style={{ fontWeight: "600" }}>Performer:</span>{" "}
                          {performer}
                        </Typography>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Divider /> {/* Another horizontal line divider */}
              {handleExportPDF !== undefined && handleExportPDF !== null && (
                <div>
                  <br></br>
                  <Button variant="contained" onClick={handleExportPDF}>
                    Export PDF {/* Button to export the report as a PDF */}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <CircularProgress></CircularProgress> {/* Show loading spinner */}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <Snackbar
        open={errorOpen} // Open state of the snackbar
        autoHideDuration={3000} // Time to hide automatically
        onClose={handleClose} // Function to call on close
        TransitionComponent={Slide} // Transition effect
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Position of the snackbar
      >
        <Alert
          onClose={handleClose} // Function to call on close
          severity={snackbarSeverity} // Type of alert (error, success, etc.)
          variant="filled" // Filled variant of the alert
          sx={{ width: "100%" }} // Full width of the alert
        >
          {snackbarText}
          {/* Message to display */}
        </Alert>
      </Snackbar>
    </div>
  );
}
