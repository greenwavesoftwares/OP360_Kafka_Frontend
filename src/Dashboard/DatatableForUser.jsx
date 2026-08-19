import {
  Chip,
  Container,
  Avatar as MuiAvatar,
  Tooltip as MuiTooltrip,
  Typography,
} from "@mui/material"; // Import necessary components from Material-UI
import { deepPurple } from "@mui/material/colors"; // Import a color from Material-UI colors
import { Column } from "primereact/column"; // Import Column component from PrimeReact
import { DataTable } from "primereact/datatable"; // Import DataTable component from PrimeReact
import { Dialog } from "primereact/dialog"; // Import Dialog component from PrimeReact
import React, { useState } from "react"; // Import React and useState hook
import LogbookViewTest from "../Logbook/View/LogbookViewTest"; // Import LogbookViewTest component
import TransactionTable from "./TransactionTable"; // Import TransactionTable component

// Define the main component for rendering a user data table
export default function DatatableForUser({ key, data, header, groupBy }) {
  const [selectedRow, setSelectedRow] = useState(null); // State for the selected row in the table
  const [selectedActivity, setSelectedActivity] = useState(null); // State for the selected activity
  const [displayDialog, setDisplayDialog] = useState(false); // State to control the display of the dialog
  const [activityNameClick, setactivityNameClick] = useState(false); // State to track if activity name was clicked
  const [logbookClick, setLogbookClick] = useState(false); // State to track if logbook was clicked
  console.log("user data : ", data); // Log the user data for debugging

  // Template for rendering performer avatars
  const performersBodyTemplate = (rowData) => {
    const nameOrGroup = rowData.performer; // Get the performer value from the row data

    // Split the string at the '@' and take the first part
    const namePart = nameOrGroup.split("@")[0];

    // Split the name part by '.' to get individual names
    const names = namePart.split(".");

    // Get the first letter of each name and join them
    const initials = names.map((name) => name.charAt(0).toUpperCase()).join("");

    console.log(initials); // Log the initials for debugging

    return (
      <div className="performers-avatar-container">
        {" "}
        {/* Container for the avatar */}
        <center>
          <MuiTooltrip // Tooltip for displaying the full performer name
            title={rowData.performer}
            placement="right"
          >
            <MuiAvatar // Avatar for displaying initials
              sizes="small"
              sx={{ bgcolor: deepPurple[500], width: 33, height: 33 }} // Set background color and size
            >
              <Typography sx={{ fontSize: "5" }}>{initials}</Typography>{" "}
              {/* Display initials */}
            </MuiAvatar>
          </MuiTooltrip>
        </center>
      </div>
    );
  };

  // Template for rendering activity names as clickable chips
  const activityNameBodyTemplate = (rowData) => {
    return (
      <MuiTooltrip title={rowData.activityId} placement="right">
        {" "}
        {/* Tooltip for displaying activity ID */}
        <Chip // Chip component for displaying activity name
          style={{ cursor: "pointer" }} // Set cursor to pointer for clickable effect
          onClick={() => onActivityNameClick(rowData)} // Handle click event
          label={rowData.activityName} // Display the activity name
        />
      </MuiTooltrip>
    );
  };

  // Template for rendering logbook information
  const logbookBodyTemplate = (rowData) => {
    return (
      <>
        {rowData.logBook !== " " && // Check if logBook is not empty or null
        rowData.logBook !== "" &&
        rowData.logBook !== null ? (
          <Chip // Chip component for displaying logbook name
            variant="outlined" // Set variant to outlined
            color="info" // Set color to info
            style={{ cursor: "pointer" }} // Set cursor to pointer for clickable effect
            onClick={() => onLogbookClick(rowData)} // Handle click event
            label={rowData.logBook} // Display the logbook name
          />
        ) : (
          "----" // Display placeholder if logBook is empty
        )}
      </>
    );
  };

  // Handle click event for activity name chip
  const onActivityNameClick = (rowData) => {
    setactivityNameClick(true); // Set activityNameClick state to true
    setLogbookClick(false); // Set logbookClick state to false
    setSelectedActivity({
      // Set the selected activity details
      jobName: rowData.jobId, // Set job name from row data
      activityName: rowData.activityId, // Set activity name from row data
    });
    setDisplayDialog(true); // Display the dialog
  };

  // Handle click event for logbook chip
  const onLogbookClick = (rowData) => {
    setactivityNameClick(false); // Set activityNameClick state to false
    setLogbookClick(true); // Set logbookClick state to true
    setSelectedActivity({
      // Set the selected activity details
      jobName: rowData.jobId, // Set job name from row data
      activityName: rowData.activityId, // Set activity name from row data
    });
    setDisplayDialog(true); // Display the dialog
  };

  // Template for rendering assets
  const assetsBodyTemplate = (rowData) => {
    if (rowData.assets) {
      // Check if assets are present
      return rowData.assets; // Return assets
    } else {
      return "----"; // Return placeholder if no assets
    }
  };

  // Function to render formatted date and time
  const renderDateTime = (datetime) => {
    if (isYearLessThan2000(datetime)) {
      // Check if year is less than 2000
      return "----"; // Return placeholder if true
    }

    // Parse the input format "30/09/2024 16:04:17"
    const [datePart, timePart] = datetime.split(" "); // Split date and time
    const [day, month, year] = datePart.split("/").map(Number); // Extract day, month, year
    const [hours, minutes, seconds] = timePart.split(":").map(Number); // Extract hours, minutes, seconds

    // Create a Date object
    const date = new Date(year, month - 1, day, hours, minutes, seconds); // Create date object with parsed values

    const formattedDay = String(date.getDate()).padStart(2, "0"); // Format day
    const formattedMonth = date.toLocaleString("default", { month: "short" }); // Format month as short string
    const formattedYear = String(date.getFullYear())?.slice(-2); // Get last two digits of year
    const formattedHours = String(date.getHours() % 12 || 12).padStart(2, "0"); // Format hours in 12-hour format
    const formattedMinutes = String(date.getMinutes()).padStart(2, "0"); // Format minutes
    const ampm = date.getHours() >= 12 ? "PM" : "AM"; // Determine AM or PM

    return `${formattedDay} ${formattedMonth} ${formattedYear} ${formattedHours}:${formattedMinutes} ${ampm}`; // Return formatted date and time
  };

  // Function to check if year is less than 2000
  const isYearLessThan2000 = (datetime) => {
    const year = new Date(datetime).getFullYear(); // Extract year from datetime
    return year < 2000; // Return true if year is less than 2000
  };

  // Function to render elapsed time
  const renderElapsedTime = (rowData) => {
    const elapsedTime = rowData.elapsedtime?.trim(); // Get elapsed time from row data and trim spaces
    console.log("Elapsed Time : ", elapsedTime); // Log elapsed time for debugging
    // Regular expression to validate the time format
    const timePattern = /^\d+d:\d+h:\d+m$/; // Pattern for valid elapsed time format

    if (!timePattern.test(elapsedTime)) {
      // Check if elapsed time matches the pattern
      return "----"; // Return placeholder if invalid
    } else {
      const activityStoptime = rowData.activityStoptime; // Get activity stop time

      // Extract the year from the date string
      const year = new Date(activityStoptime).getFullYear(); // Extract year from activity stop time

      // Check if the year is less than 2000
      if (year < 2000) {
        console.log("invalid"); // Log invalid year for debugging
        return "----"; // Return placeholder if year is invalid
      } else {
        console.log("valid"); // Log valid year for debugging
        return elapsedTime; // Return valid elapsed time
      }

      // Proceed with further processing if needed
    }
  };

  // Render a DataTable component to display user information with specific features
  return (
    <div className="card" style={{ marginBottom: "1rem" }}>
      {" "}
      {/* Card container for styling */}
      <Container
        maxWidth={"xl"} // Set maximum width of the container to extra large
        sx={{ padding: "0 !important", marginLeft: "1.5rem" }} // Apply styles to the container
      >
        <DataTable
          showGridlines // Enable gridlines for better visibility
          className="UserInfoTableStyle dataTableStyle HeaderColor" // Apply custom styles
          filterDisplay="menu" // Display filter options in a menu
          header={header} // Set the header content for the table
          value={data} // Set the data for the table
          stripedRows // Enable striped rows for better readability
          resizableColumns // Allow columns to be resized by the user
          columnResizeMode="fit" // Fit the resized columns to the table
          removableSort // Allow sorting to be removed
          paginator // Enable pagination for the table
          rows={5} // Set the number of rows to display per page
          //rowsPerPageOptions={[5, 10, 25, 50]} // Uncomment if dynamic row options are needed
        >
          {/* Conditional rendering of columns based on groupBy prop */}
          {groupBy === "User" && (
            <Column
              field="assets" // Field name to display
              header="Assets" // Header text for the column
              sortable // Enable sorting for this column
              body={assetsBodyTemplate} // Template function for rendering cell content
            ></Column>
          )}
          {groupBy === "Asset" && (
            <Column
              field="performer" // Field name to display
              header="User" // Header text for the column
              sortable // Enable sorting for this column
              body={performersBodyTemplate} // Template function for rendering cell content
            ></Column>
          )}
          {/* Additional columns for job name, task template, activity name, logbook, and elapsed time */}
          <Column field="jobName" header="Job Name" sortable></Column>
          <Column field="taskTemplate" header="Task Template" sortable></Column>
          <Column
            field="activityName" // Field name to display
            header="Activity Name" // Header text for the column
            body={activityNameBodyTemplate} // Template function for rendering cell content
            sortable // Enable sorting for this column
          ></Column>
          <Column
            field="logBook" // Field name to display
            header="Logbook" // Header text for the column
            body={logbookBodyTemplate} // Template function for rendering cell content
            sortable // Enable sorting for this column
          ></Column>
          <Column
            field="activityStartTime" // Field name for activity start time
            header="Activity Start Time vs Stop Time" // Header text for the column
            body={(rowData) => {
              // Custom body template for rendering start and stop times
              return (
                <>
                  <p style={{ margin: "0 0 4px 0", padding: 0 }}>
                    {renderDateTime(rowData.activityStartTime)}{" "}
                    {/* Render start time */}
                  </p>
                  <p style={{ margin: 0, padding: 0 }}>
                    {renderDateTime(rowData.activityStoptime)}{" "}
                    {/* Render stop time */}
                  </p>{" "}
                </>
              );
            }}
          ></Column>
          <Column
            header="Elapsed Time" // Header text for elapsed time column
            body={(rowData) => renderElapsedTime(rowData)} // Render elapsed time using custom function
            sortable // Enable sorting for this column
          ></Column>
        </DataTable>
      </Container>
      {/* Dialog for displaying additional information about selected activity or logbook */}
      <Dialog
        visible={displayDialog} // Control visibility based on state
        onHide={() => setDisplayDialog(false)} // Close dialog on hide
        maximizable // Allow the dialog to be maximized
        style={{ width: "50rem" }} // Set the width of the dialog
        //footer={dialogFooter} // Uncomment if custom footer is needed
      >
        <div>
          {/* Conditional rendering based on which element was clicked */}
          {activityNameClick && (
            <TransactionTable
              jobId={selectedActivity?.jobName} // Pass job name to TransactionTable
              activityId={selectedActivity?.activityName} // Pass activity name to TransactionTable
            />
          )}
          {logbookClick && (
            <LogbookViewTest
              jobId={selectedActivity?.jobName} // Pass job name to LogbookViewTest
              activityId={selectedActivity?.activityName} // Pass activity name to LogbookViewTest
            />
          )}
        </div>
      </Dialog>
    </div>
  );
}
