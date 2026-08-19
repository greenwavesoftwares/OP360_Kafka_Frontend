import React, { useEffect, useState } from "react";
import { Calendar } from "primereact/calendar"; // Calendar component to select dates
import { Button } from "primereact/button"; // Button component for actions like search
import { useLocation, useNavigate } from "react-router-dom"; // Hook to get the current route information
import {
  allLogbookReportsApi,
  getLogbookReportsApi,
} from "./LogbookReportsApi"; // API functions for fetching logbook reports
import { decryptTokenId, extendTokenExpiration } from "../helper/AuthService"; // Helper functions for token management
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Chip,
  Container,
  Divider,
  Fab,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"; // Material-UI components for layout and styling
import { Sidebar } from "primereact/sidebar"; // Sidebar component for extra UI elements
import SearchIcon from "@mui/icons-material/Search"; // Search icon for the button
import LogbookReportsTable from "./LogbookReportsTable"; // Custom table component for logbook reports
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch"; // Importing MUI icon for search functionality
// This page shows menu for choosing fromdatetime and todatetime with spefic reportname in its url, it will show report if present within fromdatetime and todatetime

export default function ReportView() {
  // Decrypt the username from the session storage (this is who created the reports)
  const creator = decryptTokenId(localStorage.getItem("username"));

  const navigate = useNavigate();

  // States to manage data and user selections
  const [allLogbookReportNames, setAllLogbookReportNames] = useState([]); // Stores all distinct logbook report names
  const [fromDate, setFromDate] = useState(new Date()); // From date for filtering reports
  const [toDate, setToDate] = useState(new Date()); // To date for filtering reports
  const [reportName, setReportName] = useState(null); // Stores the selected report name from dropdown
  const [allLogbookReports, setAllLogbookReports] = useState([]); // Stores the fetched logbook reports data
  const [visible, setVisible] = useState(false); // Controls the visibility of the sidebar
  const location = useLocation(); // Retrieves the current location (used to track URL params)
  const urlParams = new URLSearchParams(location.search); // Parses URL search parameters
  const theme = useTheme(); // Access the current theme
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if the current screen size is mobile using breakpoints from the theme
  // Utility function to format the date into a specific string format (YYYY-MM-DD HH:mm:ss.SSS)
  const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

    // Returns the date in the desired format
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  // useEffect hook that runs once when the component is mounted
  useEffect(() => {
    // Extends the token expiration time whenever the component is loaded
    extendTokenExpiration();
    // Fetches all distinct logbook reports when the component loads
    fetchAllLogbookReports();
  }, []);

  // useEffect hook that watches for changes in the URL parameters
  useEffect(() => {
    // Get the selected report from URL parameters (if any)
    const selectedReport = urlParams.get("selectedReport");
    if (selectedReport) {
      // If a report is selected, set it in the state and reset the current report data
      setReportName(selectedReport);
      setAllLogbookReports([]);
    }
  }, [location.search]); // Triggers whenever the location's search parameters (URL) change

  // Function to fetch reports based on selected filters (report name, from date, to date)
  const getLogbookReports = async () => {
    const response = await getLogbookReportsApi(fromDate, toDate, reportName); // Fetch reports with API call
    setAllLogbookReports(response); // Store the fetched data
    setVisible(false); // Hide the sidebar after the search
  };

  // Function to fetch all distinct logbook report names created by the current user
  const fetchAllLogbookReports = async () => {
    try {
      const data = allLogbookReportsApi(creator); // Fetch the report names using the creator's ID
      setAllLogbookReportNames(data); // Store the report names in state
    } catch (error) {}
  };

  return (
    <>
      <div>
        {/* Floating Action Button (FAB) for triggering the sidebar */}
        {isMobile || (
          <Fab
            size="small"
            color="inherit"
            sx={{
              position: "fixed", // Places the button at a fixed position on the screen
              left: "94%", // Positioned on the right side of the screen
              top: "5%", // Positioned near the top of the screen
            }}
            onClick={() => {
              console.log("visible ", visible); // Logs the current state of sidebar visibility
              setVisible(true); // Opens the sidebar when clicked
            }}
          >
            <SearchIcon /> {/* Search icon inside the button */}
          </Fab>
        )}
        {/* Bottom navigation for mobile view */}
        {isMobile && (
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
                  console.log("visible ", visible); // Logs the current state of sidebar visibility
                  setVisible(true); // Opens the sidebar when clicked
                }}
                icon={<ContentPasteSearchIcon />} // Icon for the navigation action
              />
            </BottomNavigation>
          </AppBar>
        )}

        {/* Sidebar component that slides in from the right side of the screen */}
        <Sidebar
          visible={visible} // Controls the visibility of the sidebar
          onHide={() => setVisible(false)} // Closes the sidebar when the "onHide" event occurs
          position="right" // Positions the sidebar on the right side of the screen
        >
          <div>
            {/* Divider with a chip displaying the selected report name */}
            <Divider color="info">
              <Chip
                color="info"
                variant="outlined"
                label={reportName} // Displays the current report name
                size="small"
              />
            </Divider>

            {/* A form-like layout for selecting dates and submitting the filter */}
            <div style={{ display: "grid", justifyItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  columnGap: "0.5rem", // Adds space between label and input
                }}
              >
                <label
                  htmlFor="reportViewName"
                  className="font-bold block mb-2"
                ></label>{" "}
                {/* Empty label */}
              </div>

              {/* Date picker for selecting 'From Date' */}
              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="fromDate" className="font-bold block">
                  <Typography>From Date</Typography>{" "}
                  {/* Label for the 'From Date' picker */}
                </label>
                <Calendar
                  placeholder="From Date" // Placeholder text in the calendar input
                  id="fromDate"
                  value={fromDate} // Binds the selected date to the state 'fromDate'
                  onChange={(e) => {
                    setFromDate(e.value); // Updates 'fromDate' when a new date is selected
                    console.log("fromDate : ", e.value); // Logs the selected 'fromDate' for debugging
                  }}
                  showTime // Allows time selection in addition to date
                  hourFormat="24" // 24-hour format for time selection
                  showButtonBar // Displays additional buttons (like clear or today)
                  dateFormat="dd-mm-yy" // Custom date format
                />
              </div>

              {/* Date picker for selecting 'To Date' */}
              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="toDate" className="font-bold block">
                  <Typography>To Date</Typography>{" "}
                  {/* Label for the 'To Date' picker */}
                </label>
                <Calendar
                  placeholder="To Date"
                  id="toDate"
                  value={toDate} // Binds the selected date to the state 'toDate'
                  onChange={(e) => {
                    setToDate(e.value); // Updates 'toDate' when a new date is selected
                    console.log("toDate : ", e.value); // Logs the selected 'toDate' for debugging
                  }}
                  showTime
                  hourFormat="24"
                  showButtonBar
                  dateFormat="dd-mm-yy"
                />
              </div>

              {/* Submit button to fetch reports based on the selected filters */}
              <div className="flex justify-center">
                <Button
                  label="Submit" // Button label
                  rounded // Button has rounded edges
                  severity={!toDate || !fromDate ? "secondary" : "info"} // Changes color based on whether dates are selected
                  icon="pi pi-check" // Checkmark icon on the button
                  disabled={!toDate || !fromDate} // Disables the button if no dates are selected
                  size="small"
                  onClick={() => {
                    getLogbookReports(); // Fetches the filtered logbook reports when clicked
                  }}
                />
              </div>
            </div>
          </div>
        </Sidebar>
      </div>

      {/* Main container for displaying the logbook report table */}
      <Container
        maxWidth="lg" // Maximum width of the container (large size)
        sx={{ padding: "0 !important", background: "white" }} // Removes padding and sets a white background
      >
        {/* If there are reports available, display the table; otherwise show 'No Data Present' */}
        {allLogbookReports ? (
          allLogbookReports.length > 0 ? (
            <>
              {/* Header section for the report view with a title and selected report name */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between", // Spaces the title and report name apart
                  padding: "0.3rem 1rem", // Adds padding around the elements
                }}
              >
                <Typography sx={{ padding: "0.8rem 1rem", fontWeight: "600" }}>
                  Logbook Report View {/* Title */}
                </Typography>
                <Chip color="default" label={reportName} />{" "}
                {/* Chip displaying the report name */}
              </div>
              <Divider /> {/* Line divider between header and the table */}
              {/* Custom table component to show the logbook reports */}
              <LogbookReportsTable
                reportName={reportName}
                allLogbookReports={allLogbookReports}
              />
            </>
          ) : (
            // If no data is present, show a message in the center
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Typography variant="h5" color={"red"}>
                No Data Present {/* Error message if there are no reports */}
              </Typography>
            </Box>
          )
        ) : (
          navigate("/restricted")
        )}
      </Container>
    </>
  );
}
