import React, { useEffect, useState } from "react"; // Import React and some useful tools
import { Calendar } from "primereact/calendar"; // Import a calendar component for picking dates
import { Dropdown } from "primereact/dropdown"; // Import a dropdown component for selecting options
import LogbookReportViewComponent from "./LogbookReportViewComponent"; // Import another component for showing logbook reports
import {
  fetchAllFormInfoApi, // Function to get all form information
  forminfoByformNameAndVersionApi, // Function to get form info by name and version
  getTransactionsByFormnameAndVersionBetweenDates,
  logbookArchiveFooterDetailsApi, // Function to get transactions between two dates
  pdfDownloadApi, // Function to download a PDF
} from "../../LogbookReports/LogbookReportsApi"; // API functions for logbook reports
import { getUserByTenantIdApi } from "../../Tenant/TenantApi"; // Function to get user information by tenant ID
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import {
  Alert,
  AlertTitle,
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Fab,
  Grid,
  IconButton,
  Pagination,
  Slide,
  Snackbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"; // Import Material-UI components for styling and layout
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft"; // Import left arrow icon
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight"; // Import right arrow icon
import { extendTokenExpiration } from "../../helper/AuthService"; // Function to keep the user logged in
import GetAppIcon from "@mui/icons-material/GetApp"; // Import download icon
import { Sidebar } from "primereact/sidebar"; // Import a sidebar component for filters
import SearchIcon from "@mui/icons-material/Search"; // Import search icon
import { getAllGroupDetails } from "../../UserModuleUpdated/UsermoduleApi";
//import { AnimatePresence, motion } from "framer-motion";
// This page allows the user to choose a logbook by selecting a group, logbook name, from date, and to date, and then navigate between logbooks within the selected dates.

const LogbookReportView = () => {
  // This is our main component
  const [selectedGroup, setSelectedGroup] = useState(""); // State to keep track of the selected group
  const [selectedVersion, setSelectedVersion] = useState(0); // State for selected version
  const [selectedLogbook, setSelectedLogbook] = useState(""); // State for selected logbook
  const [allFormInfo, setAllFormInfo] = useState([]); // State to store all form info
  const [fromDate, setFromDate] = useState(new Date()); // State for the starting date
  const [toDate, setToDate] = useState(new Date()); // State for the ending date
  const [transactionData, setTransactionData] = useState([]); // State to store transaction data
  const [groups, setGroups] = useState([]); // State to store available groups
  const [logbooks, setLogbooks] = useState([]); // State to store available logbooks
  const [versions, setVersions] = useState([]); // State to store available versions
  const [showDataGrid, setShowDataGrid] = useState(false); // State to show or hide the data grid
  const [currentIndex, setCurrentIndex] = useState(0); // State for the current index of the logbook data
  const [formatId, setFormatId] = useState(""); // State for format ID
  const [documentId, setDocumentId] = useState(""); // State for document ID
  const [gridData, setGridData] = useState([]); // State for grid data
  const [activityName, setActivityName] = useState(""); // State for activity name
  const [taskName, setTaskName] = useState(""); // State for task name
  const [assetName, setAssetName] = useState(""); // State for asset name

  const [jobName, setJobName] = useState(""); // State for job name
  const [performer, setPerformer] = useState(""); // State for performer name

  const [isLoading, setIsLoading] = useState(false); // State to show loading status
  const [isDelayedLoading, setIsDelayedLoading] = useState(false); // State for delayed loading
  const [isFormValid, setIsFormValid] = useState(false); // State to check if the form is valid
  const [visible, setVisible] = useState(false); // State for sidebar visibility
  const [tenentUserData, setTenentUserData] = useState(); // State for tenant user data

  const [errorOpen, setErrorOpen] = useState(false); // To control error messages
  const [snackbarText, setSnackbarText] = useState(""); // Text for snackbar messages
  const [snackbarSeverity, setsnackbarSeverity] = useState(""); // Severity level of snackbar messages
  const theme = useTheme(); // Access the current theme
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("md"));
  const [isDownloadButtonLoading, setDownloadButtonLoading] = useState(false);

  useEffect(() => {
    // This runs once when the component loads
    extendTokenExpiration(); // Keep the user logged in
  }, []);

  useEffect(() => {
    // This runs when selectedGroup changes
    fetchAllFormInfo(); // Fetch all form info
  }, [selectedGroup]);

  useEffect(() => {
    // This runs when selectedLogbook changes
    if (selectedLogbook !== "") {
      // Check if a logbook is selected
      const versions = allFormInfo
        .filter((item) => item.formName === selectedLogbook) // Find versions for the selected logbook
        .map((item) => item.versionNumber); // Get the version numbers
      const activeForm = allFormInfo.find(
        (item) => item.formName === selectedLogbook && item.isActiveForm,
      );
      const activeLogbookVersion = activeForm?.versionNumber ?? 0;
      setVersions(versions); // Set the versions in state
      setSelectedVersion(activeLogbookVersion);
    } else {
      setVersions([]); // If no logbook is selected, clear version
      setSelectedVersion("");
    }
  }, [selectedLogbook]);

  useEffect(() => {
    // This runs when transactionData or currentIndex changes
    const updateCurrentData = async () => {
      if (transactionData && transactionData.length > 0) {
        setGridData(transactionData); // Set grid data to transaction data
        const pdfDetails = async () => {
          const data = await logbookArchiveFooterDetailsApi(
            transactionData[currentIndex].jobId, // Get job ID from current transaction
            transactionData[currentIndex].activityId, // Get activity ID from current transaction
          );
          if (!data) {
            setsnackbarSeverity("error");
            setSnackbarText("Error fatching details");
            setErrorOpen(true); // Show Snackbar
            return;
          } else {
            setActivityName(data.activityName ? data.activityName : "NA"); // Set activity name
            setAssetName(data.assetName ? data.assetName : "NA"); // Set asset name
            setTaskName(data.taskName ? data.taskName : "NA"); // Set task name

            setJobName(data.jobName ? data.jobName : "NA"); // Set job name
            setPerformer(data.performer ? data.performer : "NA"); // Set perfoemer name
          }
        };
        pdfDetails(); // Call function to get PDF details
      }
    };
    updateCurrentData(); // Update current data
  }, [transactionData, currentIndex]);

  useEffect(() => {
    // Reset navigation & views when form changes
    setCurrentIndex(0);

    // This checks if the form is valid
    setIsFormValid(
      selectedGroup && selectedLogbook && selectedVersion && fromDate && toDate,
    );
  }, [selectedGroup, selectedLogbook, selectedVersion, fromDate, toDate]);

  const handleChange = (event, value) => {
    setCurrentIndex(value - 1);
  };

  const handleNext = () => {
    // This function goes to the next item in the grid
    setCurrentIndex((prevIndex) => (prevIndex + 1) % gridData.length); // Move to next index
  };

  const handlePrev = () => {
    // This function goes to the previous item in the grid
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + gridData.length) % gridData.length, // Move to previous index
    );
  };

  const fetchAllFormInfo = async () => {
    // This function fetches all form information
    const data = await fetchAllFormInfoApi(); // Get form info from API
    const uniqueGroups = new Set(); // Create a set for unique groups
    const uniqueLogbooks = new Set(); // Create a set for unique logbooks
    let GroupArray = []; // Array to store groups
    if (data) {
      setAllFormInfo(data); // Store all form info in state
      data.forEach((item) => {
        let splitGroups = item.userGroup.split(","); // Split user groups
        GroupArray.push(...splitGroups); // Add groups to the array
        if (splitGroups.includes(selectedGroup)) {
          uniqueLogbooks.add(item.formName); // Add logbook if group matches
        }
      });
      const groupname = await getAllGroupDetails(); // calling getAllGroupDetails to get all group details like groupname, groupid in form of a object
      GroupArray.forEach((item) => {
        uniqueGroups.add(item); // Add group to unique set
      });
      setLogbooks(Array.from(uniqueLogbooks).sort()); // Sort and set logbooks in state
      // setGroups(Array.from(uniqueGroups).sort()); // Sort and set groups in state
      setGroups(groupname); // set all group details object in groups variable
    } else {
      setAllFormInfo([]); // Clear all form info
      setGroups([]); // Clear groups
      setLogbooks([]); // Clear logbooks
    }
  };

  const forminfoByformNameAndVersion = async () => {
    // This function fetches form info by name and version
    const data = await forminfoByformNameAndVersionApi(
      selectedLogbook,
      selectedVersion,
    );
    if (data === null) {
      // If no data, set to "NA"
      setFormatId("NA");
      setDocumentId("NA");
    } else {
      // Otherwise, set the format ID and document ID
      setFormatId(data.formatId);
      setDocumentId(data.documentId);
    }
  };

  // This function formats a date into a string for SQL Server
  const formatDateForMSSQL = (date) => {
    const year = date.getFullYear(); // Get the full year (e.g., 2024)
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Get the month (0-11) and add 1, then pad with zero if needed (e.g., "01" for January)
    const day = String(date.getDate()).padStart(2, "0"); // Get the day of the month and pad with zero if needed (e.g., "05" for the 5th)
    const formattedDate = `${year}-${month}-${day}`; // Combine year, month, and day into a string like "2024-10-12"
    return formattedDate; // Return the formatted date
  };

  // This function handles the form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setIsLoading(true); // Set loading state to true to show a loading spinner
    setIsDelayedLoading(true); // Set delayed loading state to true
    setGridData([]);
    setTransactionData([]);
    setShowDataGrid(false);

    // Format the from and to dates for SQL
    const formattedFromDate = fromDate ? formatDateForMSSQL(fromDate) : ""; // Format fromDate if it exists
    const formattedToDate = toDate ? formatDateForMSSQL(toDate) : ""; // Format toDate if it exists

    try {
      // Call the function to get transactions between the selected dates and logbook/version
      const data = await getTransactionsByFormnameAndVersionBetweenDates(
        selectedLogbook,
        selectedVersion,
        formattedFromDate,
        formattedToDate,
      );

      // Get user data for the current tenant
      const tenentUserData = await getUserByTenantIdApi();

      // Check if tenentUserData is empty or undefined
      if (!tenentUserData) {
        setsnackbarSeverity("error");
        setSnackbarText("Tenant user data could not be retrieved.");
        setErrorOpen(true); // Show Snackbar
        return;
      }

      if (tenentUserData) {
        setTenentUserData(tenentUserData); // Save the tenant user data
      }
      setTransactionData(data); // Save the transaction data
      setVisible(false); // Hide the loading spinner or modal

      // Call a function to get additional information about the form
      forminfoByformNameAndVersion();

      // Show the data grid after a short delay
      setTimeout(() => {
        setShowDataGrid(true); // Show the data grid
        setIsDelayedLoading(false); // Set delayed loading to false
      }, 1000);
    } catch (error) {
      setsnackbarSeverity("error");
      setSnackbarText(error);
      setErrorOpen(true);
    } finally {
      setIsLoading(false); // Set loading state to false at the end
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

  // // This function generates a filename for the PDF
  // const generateFilename = (formName) => {
  //   const todaysDate = new Date(); // Get today's date
  //   const formattedDate = formatDateForMSSQL(todaysDate); // Format today's date for SQL
  //   // Get the current time and format it
  //   const formattedHour = todaysDate.toLocaleTimeString("en-US", {
  //     hour12: false,
  //     hour: "2-digit",
  //   });
  //   const formattedMinute = todaysDate.toLocaleTimeString("en-US", {
  //     hour12: false,
  //     minute: "2-digit",
  //   });
  //   const formattedSecond = todaysDate.toLocaleTimeString("en-US", {
  //     hour12: false,
  //     second: "2-digit",
  //   });
  //   // Combine the formatted hour, minute, and second into a string
  //   const formattedTime = `${formattedHour}:${formattedMinute}:${formattedSecond}`;
  //   const frmName = formName.replace(/ /g, "_"); // Replace spaces in form name with underscores
  //   // Return a filename like "FormName-2024-10-12-10:30:45.pdf"
  //   return `${frmName}-${formattedDate}-${formattedHour}:${formattedMinute}:${formattedSecond}.pdf`;
  // };

  // This function handles the export of the PDF
  const handleExportPDF = async () => {
    // Format the from and to dates for SQL
    const formattedFromDate = fromDate ? formatDateForMSSQL(fromDate) : "";
    const formattedToDate = toDate ? formatDateForMSSQL(toDate) : "";

    setDownloadButtonLoading(true);

    try {
      // Call the function to download the PDF
      const response = await pdfDownloadApi(
        selectedLogbook,
        selectedVersion,
        formattedFromDate,
        formattedToDate,
        currentIndex,
      );
      if (!response || !response.data) {
        setsnackbarSeverity("error");
        setSnackbarText("Error downloading PDF");
        setErrorOpen(true); // Show Snackbar
        setDownloadButtonLoading(false);
        return;
      } else {
        setDownloadButtonLoading(false);
        return;
      }
    } catch (error) {
      // Log errors and display Snackbar
      setsnackbarSeverity("error");
      setSnackbarText("An error occurred while downloading the PDF");
      setErrorOpen(true);
      setDownloadButtonLoading(false);
    }
  };

  return (
    // Create a container for the main content with a maximum width
    // <Container maxWidth="lg" sx={{ padding: "0" }}>
    <Container
      maxWidth="lg"
      sx={{ padding: "0", pb: isMobile || isTab ? "56px" : "0" }}
    >
      <Card sx={{ boxShadow: 3 }}>
        {/* Check if there is data in the gridData array */}
        {gridData.length > 0 && (
          // Create a grid layout for the header section
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 1,
              }}
            >
              <Pagination
                count={gridData.length}
                showFirstButton
                showLastButton
                page={currentIndex + 1}
                onChange={handleChange}
              />
            </Box>
            <Grid
              container
              sx={{
                padding: "0.5rem 1rem",
                background: "#e0e0e0", // Set the background color of the header
                alignItems: "center", // Center align items in the grid
                borderBottom: "1px solid #9e9e9e",
              }}
            >
              {/* Create a grid item for the header content */}
              <Grid
                item
                xs={12}
                display="flex"
                justifyContent="space-between" // Space out the items in the header
                alignItems="center" // Center align items vertically
              >
                {/* Display the title of the logbook view */}
                <Typography sx={{ fontSize: "1rem", fontWeight: "600" }}>
                  <span
                    style={{
                      color: "#304ffe", // Set the color for the form name
                      fontSize: "1rem",
                      fontWeight: "600",
                    }}
                  >
                    {gridData[currentIndex].formName}{" "}
                    {/* Show the name of the current form */}
                  </span>{" "}
                </Typography>

                {/* Button to export the logbook as a PDF */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    columnGap: "1rem",
                  }}
                >
                  {/* <Button
                  size="small"
                  color="success" // Set the button color to success (green)
                  variant="contained" // Make the button look solid
                  onClick={handleExportPDF} // Call function to export PDF when clicked
                  startIcon={
                    isDownloadButtonLoading ? (
                      <HourglassBottomIcon />
                    ) : (
                      <GetAppIcon />
                    )
                  } // Add an icon to the button
                  disabled={isDownloadButtonLoading}
                  sx={{
                    marginLeft: "1rem",
                    borderRadius: 4,
                    boxShadow: "none",
                  }} // Add some space to the left of the button
                >
                  {isDownloadButtonLoading ? `Please Wait` : `Export PDF`}
                </Button> */}

                  <Button
                    size="small"
                    color="success"
                    variant="contained"
                    onClick={handleExportPDF}
                    startIcon={
                      isDownloadButtonLoading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <GetAppIcon />
                      )
                    }
                    disabled={isDownloadButtonLoading}
                    sx={{
                      marginLeft: "1rem",
                      borderRadius: 4,
                      boxShadow: "none",
                    }}
                  >
                    {isDownloadButtonLoading ? "Please Wait" : "Export PDF"}
                  </Button>

                  {/* Check again if there is data in gridData for navigation buttons */}
                  {gridData.length > 0 && (
                    <div
                      style={{
                        background: "#f7f7f7", // Set a light background color
                        display: "flex", // Use flexbox layout
                        alignItems: "center", // Center align items
                        backgroundColor: "transparent",
                      }}
                    >
                      {/* Button to go to the previous logbook */}
                      <IconButton
                        disabled={currentIndex === 0} // Disable button if at the first logbook
                        onClick={handlePrev} // Call function to go to the previous logbook
                        variant="contained" // Make the button look solid
                        color="primary" // Set the button color to primary (blue)
                        size="medium" // Set the button size to large
                      >
                        <ArrowCircleLeftIcon fontSize="inherit" />{" "}
                        {/* Left arrow icon */}
                      </IconButton>
                      <>
                        <Typography>
                          {currentIndex + 1} of {gridData.length}{" "}
                        </Typography>
                      </>
                      {/* Button to go to the next logbook */}
                      <IconButton
                        disabled={currentIndex === gridData.length - 1} // Disable button if at the last logbook
                        onClick={handleNext} // Call function to go to the next logbook
                        variant="contained" // Make the button look solid
                        color="primary" // Set the button color to primary (blue)
                        size="medium" // Set the button size to large
                      >
                        <ArrowCircleRightIcon fontSize="inherit" />{" "}
                        {/* Right arrow icon */}
                      </IconButton>
                    </div>
                  )}
                </div>
              </Grid>
            </Grid>
          </>
        )}

        {/* Floating action button to open the sidebar for filtering */}
        <div>
          {isMobile || isTab || (
            <Fab
              size="small" // Set the size of the floating button to small
              color="inherit" // Use the default color for the button
              sx={{
                position: "fixed", // Fix the button to the top right of the screen
                left: "94%",
                top: "2%",
              }}
              onClick={() => {
                setVisible(true); // Set the sidebar to be visible
              }}
            >
              <SearchIcon /> {/* Add a search icon to the button */}
            </Fab>
          )}
          {/* Bottom navigation for mobile view */}
          {(isMobile || isTab) && (
            <AppBar
              position="fixed" // Fix the position at the bottom
              color="primary" // Primary color for the app bar
              sx={{ top: "auto", bottom: 0 }} // Position at the bottom
            >
              <BottomNavigation showLabels>
                {/* Navigation action for search */}
                <BottomNavigationAction
                  label="Search" // Label for the navigation action
                  onClick={() => {
                    setVisible(true); // Set the sidebar to be visible
                  }}
                  icon={<ContentPasteSearchIcon />} // Icon for the navigation action
                />
              </BottomNavigation>
            </AppBar>
          )}

          {/* Sidebar for filtering logbooks */}
          <Sidebar
            visible={visible} // Control the visibility of the sidebar
            onHide={() => setVisible(false)} // Hide the sidebar when called
            position="right" // Position the sidebar on the right
          >
            <div>
              <Divider>
                <Chip label="Filter Logbook" size="small" />{" "}
                {/* Divider with a label */}
              </Divider>
              <Grid xs={12} sx={{ padding: "1rem 0.7rem" }}>
                <Grid xs={12} sx={{ padding: "1rem 0.7rem" }}>
                  <form onSubmit={handleSubmit}>
                    {" "}
                    {/* Form for filtering logbooks */}
                    <div>
                      <label style={{ marginBottom: "1rem" }}>
                        Select Group
                        <Dropdown
                          value={selectedGroup} // Set the selected group value
                          options={groups} // Provide options for the dropdown
                          optionLabel="groupName" // show groupname as label of dropdown option
                          optionValue="groupID" // show groupID as value of dropdown option
                          onChange={(e) => setSelectedGroup(e.value)} // Update selected group when changed
                          placeholder="Select a Group" // Placeholder text
                          required // Make this field required
                          filter // Enable filtering in the dropdown
                          style={{ width: "14rem" }} // Set the width of the dropdown
                        />
                      </label>
                      <br />
                      <label>
                        Select Logbook
                        <Dropdown
                          value={selectedLogbook} // Set the selected logbook value
                          options={logbooks} // Provide options for the dropdown
                          onChange={(e) => {
                            setSelectedLogbook(e.value); // Update selected logbook when changed
                          }}
                          placeholder="Select a Logbook" // Placeholder text
                          required // Make this field required
                          filter // Enable filtering in the dropdown
                          style={{ width: "14rem" }} // Set the width of the dropdown
                        />
                      </label>
                      <label>
                        Select Version
                        <Dropdown
                          value={selectedVersion} // Set the selected version value
                          options={versions} // Provide options for the dropdown
                          onChange={(e) => {
                            setSelectedVersion(e.value); // Update selected version when changed
                          }}
                          placeholder="Select a Version" // Placeholder text
                          required // Make this field required
                          filter // Enable filtering in the dropdown
                          style={{ width: "14rem" }} // Set the width of the dropdown
                        />
                      </label>
                      <br />
                      <label>
                        From Date:
                        <Calendar
                          value={fromDate} // Set the selected from date value
                          onChange={(e) => setFromDate(e.value)} // Update from date when changed
                          dateFormat="dd-mm-yy" // Set the date format
                          placeholder="From Date" // Placeholder text
                          required // Make this field required
                        />
                      </label>
                      <br />
                      <label>
                        To Date:
                        <Calendar
                          value={toDate} // Set the selected to date value
                          onChange={(e) => setToDate(e.value)} // Update to date when changed
                          dateFormat="dd-mm-yy" // Set the date format
                          placeholder="To Date" // Placeholder text
                          required // Make this field required
                        />
                      </label>
                      <br />
                      <Button
                        variant="contained" // Make the button look solid
                        type="submit" // Specify that this is a submit button
                        size="small" // Set the button size to small
                        sx={{ marginTop: "1.2rem" }} // Add space to the top
                        disabled={!isFormValid} // Disable button if form is not valid
                      >
                        Submit
                      </Button>
                    </div>
                  </form>
                </Grid>
              </Grid>
            </div>
          </Sidebar>
        </div>
        {/* Check if the data grid should be shown and loading is not delayed */}
        {showDataGrid && !isDelayedLoading && (
          <>
            <div>
              {gridData.length !== 0 ? ( // Check if there is data in gridData
                <>
                  <Divider /> {/* Add a divider line */}
                  <div>
                    <div>
                      <center>
                        {/* <AnimatePresence>
                          <motion.div
                            key={currentIndex} // Use a unique key for animations to work properly
                            initial={{ opacity: 0, x: 100 }} // Start off-screen to the right
                            animate={{ opacity: 1, x: 0 }} // Animate to center
                            exit={{ opacity: 0, x: -100 }} // Exit off-screen to the left
                            transition={{ duration: 0.3 }} // Animation duration
                          > */}
                        {/* Display the logbook report view component with the current data */}
                        <LogbookReportViewComponent
                          gridData={gridData[currentIndex]} // Pass the current logbook data
                          formatId={formatId} // Additional props
                          documentId={documentId}
                          isLoading={isLoading} // Show loading state
                          tenentUserData={tenentUserData} // Pass tenant user data
                          taskName={taskName}
                          activityName={activityName}
                          assetName={assetName}
                          jobName={jobName}
                          performer={performer}
                        />
                        {/* </motion.div>
                        </AnimatePresence> */}
                      </center>
                    </div>

                    {gridData.length > 0 && (
                      <div
                        style={{
                          background: "#e0e0e0", // Set a light background color
                          display: "flex", // Use flexbox layout
                          justifyContent: "space-between", // Space out the items
                          alignItems: "center", // Center align items
                          borderTop: "1px solid #9e9e9e",
                        }}
                      >
                        {/* Button to go to the previous logbook */}
                        <IconButton
                          disabled={currentIndex === 0} // Disable button if at the first logbook
                          onClick={handlePrev} // Call function to go to the previous logbook
                          variant="contained" // Make the button look solid
                          color="primary" // Set the button color to primary (blue)
                          size="large" // Set the button size to large
                        >
                          <ArrowCircleLeftIcon fontSize="inherit" />{" "}
                          {/* Left arrow icon */}
                        </IconButton>

                        <Chip color="warning" label={currentIndex + 1} />
                        {/* Button to go to the next logbook */}
                        <IconButton
                          disabled={currentIndex === gridData.length - 1} // Disable button if at the last logbook
                          onClick={handleNext} // Call function to go to the next logbook
                          variant="contained" // Make the button look solid
                          color="primary" // Set the button color to primary (blue)
                          size="large" // Set the button size to large
                        >
                          <ArrowCircleRightIcon fontSize="inherit" />{" "}
                          {/* Right arrow icon */}
                        </IconButton>
                      </div>
                    )}
                  </div>
                  {/* <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      py: 1,
                    }}
                  >
                    <Pagination
                      count={gridData.length}
                      showFirstButton
                      showLastButton
                      page={currentIndex + 1}
                      onChange={handleChange}
                    />
                  </Box> */}
                </>
              ) : (
                // If there is no data, show a warning message
                <div>
                  <Alert sx={{ padding: "1.2rem" }} severity="warning">
                    <AlertTitle>Warning</AlertTitle>
                    No Logbook found between Date Range{" "}
                    {formatDateForMSSQL(fromDate)} and{" "}
                    {formatDateForMSSQL(toDate)}{" "}
                    {/* Display the selected date range */}
                  </Alert>
                </div>
              )}
            </div>
          </>
        )}
      </Card>
      {/* Snackbar for showing error messages */}
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
    </Container>
  );
};

export default LogbookReportView; // Export the component to be used in other parts of the application
