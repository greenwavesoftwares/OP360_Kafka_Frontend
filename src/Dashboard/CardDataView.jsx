import CircleIcon from "@mui/icons-material/Circle"; // Importing Circle icon from Material UI Icons
import DangerousIcon from "@mui/icons-material/Dangerous"; // Importing Dangerous icon from Material UI Icons
import DescriptionIcon from "@mui/icons-material/Description"; // Importing Description icon from Material UI Icons
import HistoryIcon from "@mui/icons-material/History"; // Importing History icon from Material UI Icons
import NotStartedOutlinedIcon from "@mui/icons-material/NotStartedOutlined"; // Importing NotStartedOutlined icon from Material UI Icons
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline"; // Importing PlayCircleOutline icon from Material UI Icons
import ScheduleIcon from "@mui/icons-material/Schedule"; // Importing Schedule icon from Material UI Icons
import TimerOffOutlinedIcon from "@mui/icons-material/TimerOffOutlined"; // Importing TimerOffOutlined icon from Material UI Icons

// Importing Material UI components used in the component
import {
  Grid, // Importing Grid for layout structure
  Avatar as MuiAvatar, // Importing Avatar and aliasing it as MuiAvatar to avoid conflicts
  Tooltip as MuiTooltip, // Importing Tooltip and aliasing it as MuiTooltip for clarity
  Typography, // Importing Typography for text styling
  useMediaQuery, // Importing useMediaQuery to manage responsiveness
  useTheme, // Importing useTheme to use the current theme
} from "@mui/material";

import Chip from "@mui/material/Chip"; // Importing Chip for rendering chips

import { Gauge, gaugeClasses } from "@mui/x-charts"; // Importing Gauge component and gauge classes from MUI x-charts for rendering gauges

import moment from "moment"; // Importing moment.js for handling date formatting

// Importing PrimeFlex and PrimeIcons for layout and icons
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";

// Importing PrimeReact components for rendering UI elements
import { Carousel } from "primereact/carousel"; // Importing Carousel from PrimeReact for showing a carousel of items
import { DataView, DataViewLayoutOptions } from "primereact/dataview"; // Importing DataView and DataViewLayoutOptions for flexible layout of data
import { Dialog } from "primereact/dialog"; // Importing Dialog from PrimeReact for showing a modal dialog
import { Panel } from "primereact/panel"; // Importing Panel from PrimeReact for collapsible panels

// Importing PrimeReact styles for the theme
import "primereact/resources/primereact.css"; // Importing PrimeReact core styles
import "primereact/resources/themes/lara-light-indigo/theme.css"; // Importing a specific PrimeReact theme (Lara Light Indigo)

import React, { useState } from "react"; // Importing React and useState hook for managing component state

import LViewWithProps from "../Logbook/View/LViewWithProps"; // Importing a custom component (LViewWithProps) from another module

// Component for displaying data in a card-like view with optional grid and list layout
export default function CardDataView({ products, header, userType }) {
  console.log("Products : ", products);
  console.log("Header : ", header);
  const [layout, setLayout] = useState("grid"); // State for managing the layout (grid or list)
  const theme = useTheme(); // Using theme hook to access current theme
  const [selectedActivity, setSelectedActivity] = useState(null); // State for storing the currently selected activity
  const [displayDialog, setDisplayDialog] = useState(false); // State for controlling the visibility of the dialog
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Using useMediaQuery to check if the screen width matches a mobile breakpoint

  function formatDateTime(startTime) {
    if (!startTime) {
      return "---"; // Return '---' if startTime is null or undefined
    }
    const startDate = new Date(startTime); // Convert startTime to a Date object
    const optionsTime = {
      hour: "2-digit", // Format hours as two digits (12-hour format)
      minute: "2-digit", // Format minutes as two digits
    };
    const getShortYear = (date) => date.getFullYear().toString().slice(-2); // Function to get the last two digits of the year
    const formattedDate = `${startDate.getDate()} ${new Intl.DateTimeFormat(
      "en-US",
      { month: "short" } // Format the month as a short string (e.g., Jan, Feb)
    ).format(startDate)} ${getShortYear(startDate)}`; // Format the date in "DD Mon YY" format
    const formattedTime = new Intl.DateTimeFormat("en-US", optionsTime).format(
      startDate // Format the time in "HH:MM" (12-hour format with AM/PM)
    );

    return `${formattedDate} ${formattedTime}`; // Combine formatted date and time and return as a string
  }

  const getInitials = (email) => {
    if (!email) {
      return "NA"; // Return 'NA' if email is null or undefined
    }
    const namePart = email?.split("@")[0]; // Split the email at '@' and take the first part (username)
    const nameParts = namePart?.split("."); // Split the username at '.' to separate the first and last name
    const initials = nameParts
      .map((part) => part.charAt(0).toUpperCase()) // Take the first letter of each part and convert to uppercase
      .join(""); // Join the initials together
    return initials; // Return the initials
  };

  const onLogbookClick = (activityId, jobId) => {
    console.log("activityId", activityId); // Log the clicked activityId to the console
    console.log("jobId", jobId); // Log the clicked jobId to the console
    setSelectedActivity({
      jobId: jobId, // Set the selected jobId in the state
      activityId: activityId, // Set the selected activityId in the state
    });
    setDisplayDialog(true); // Set the displayDialog state to true to open the dialog
  };

  const activityTemplate = (activity) => {
    // Objective: Calculate time difference and duration between scheduled and actual activity times, considering weekends and weekdays.

    const scheduledTime = moment(activity.scheduledActivityStartTime); // Create a moment object for the scheduled activity start time
    const actualTime = activity.actualActivityStartTime
      ? moment(activity.actualActivityStartTime) // If actualActivityStartTime exists, create a moment object for it
      : moment(); // If actualActivityStartTime is null, use the current time

    // Objective: Calculate the actual duration of the activity in minutes
    let actActualdDuration = Math.floor(
      (new Date(activity.actualActivityEndTime) - // Subtract actual activity start time from actual activity end time
        new Date(activity.actualActivityStartTime)) /
        (1000 * 60) // Convert the difference from milliseconds to minutes
    );

    // Objective: Check if the scheduled activity start and end times fall on a weekend
    const actActualWeekendData = checkWeekend(
      activity.scheduledActivityStartTime, // Pass the scheduled start time to checkWeekend function
      activity.scheduledActivityEndTime // Pass the scheduled end time to checkWeekend function
    );
    console.log("ACT weekendData : ", actActualWeekendData); // Log the weekend data information to the console

    // Objective: Adjust the actual duration based on weekends (if there are Sundays or Saturdays in the activity)
    if (activity.weekdays === 6 && actActualWeekendData.hasSunday) {
      actActualdDuration =
        actActualdDuration - actActualWeekendData.sundayCount * 1440; // Subtract total Sunday duration (in minutes) if weekdays are 6 and Sunday is present
    }
    if (activity.weekdays === 5) {
      if (actActualWeekendData.hasSunday) {
        actActualdDuration =
          actActualdDuration - actActualWeekendData.sundayCount * 1440; // Subtract total Sunday duration (in minutes) if weekdays are 5 and Sunday is present
      }
      if (actActualWeekendData.hasSaturday) {
        actActualdDuration =
          actActualdDuration - actActualWeekendData.saturdayCount * 1440; // Subtract total Saturday duration (in minutes) if weekdays are 5 and Saturday is present
      }
    }

    // Objective: Calculate the difference between actual and scheduled activity start times in minutes
    const differenceInMinutes = actualTime.diff(scheduledTime, "minutes"); // Calculate time difference between actual and scheduled times in minutes

    // Objective: Determine the status of the activity based on the time difference and format the difference message
    let status; // Variable to store the status of the activity (ontime, early, or late)
    let differenceMessage; // Variable to store the message showing the time difference

    if (differenceInMinutes === 0) {
      status = "ontime"; // If the difference is 0, set the status to "ontime"
      differenceMessage = "On Time"; // Set the difference message to "On Time"
    } else if (differenceInMinutes < 0) {
      status = "early"; // If the difference is negative, the activity is early
      const minute = `${Math.abs(differenceInMinutes)}`; // Get the absolute value of the negative difference
      differenceMessage = formatDuration(minute); // Format the minute difference as a duration string
    } else {
      status = "late"; // If the difference is positive, the activity is late
      const minute = `${Math.abs(differenceInMinutes)}`; // Get the absolute value of the positive difference
      differenceMessage = formatDuration(minute); // Format the minute difference as a duration string
    }

    return (
      <div className="activity-item">
        <div
          style={{
            borderRadius: "0.5rem",
            boxShadow: "1",
          }}
        >
          <Grid container spacing={1}>
            <Grid item xs={12} className="activity-header">
              {/* Create a Grid item that spans 12 columns and applies the "activity-header" class */}
              <div
                style={{
                  display: "flex", // Use flexbox layout
                  alignItems: "center", // Vertically align items in the center
                  columnGap: "0.5rem", // Set a gap of 0.5rem between columns
                  justifyContent: "space-between", // Distribute space between flex items
                  borderBottom: "1px solid #bcaeae", // Add a bottom border with a light gray color
                  borderTop: "1px solid #d6d4d4", // Add a top border with a slightly darker gray color
                  background: "#e2e1e1", // Set a light gray background color
                  padding: "0.7rem", // Add padding of 0.7rem around the content
                }}
              >
                {/* Tooltip to display the activityName on hover */}
                <MuiTooltip title={activity.activityName} placement="top">
                  <div style={{display:'flex',maxWidth:"65%",alignItems:"center"}}>
                  <Typography
                    sx={{
                      fontWeight: "600",
                      fontSize: "0.8rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "80%",
                      //background:"red"
                    }}
                  >
                    {/* Display the activityName in bold and smaller font size */}
                    
                     {activity.activityName}  
                     </Typography>
                     <div>
                    {/* Check the activity status and conditionally display an icon based on the status */}
                    {activity.actvityStatus === "Started" ? (
                      <i
                        className="pi pi-spin pi-spinner" // PrimeIcons spinner to indicate "Started" status
                        style={{
                          fontSize: "0.8rem", // Set the font size of the icon
                          marginLeft: "0.5rem", // Add a margin to the left of the icon
                          color: "#ffecb3", // Set the icon color to a light yellow
                          background: "#ff8f00", // Set the background to an orange shade
                          padding: "0.2rem", // Add padding around the icon
                          borderRadius: "50%", // Make the icon circular
                          fontWeight: 600, // Set the font weight to bold
                        }}
                      ></i>
                    ) : activity.actvityStatus === "Completed" ||
                      activity.actvityStatus === "Approved" ? (
                      <i
                        className="pi pi-check" // PrimeIcons checkmark to indicate "Completed" status
                        style={{
                          fontSize: "0.8rem", // Set the font size of the icon
                          marginLeft: "0.5rem", // Add a margin to the left of the icon
                          color: "#2e7d32", // Set the icon color to green
                          background: "#c8e6c9", // Set the background to light green
                          padding: "0.2rem", // Add padding around the icon
                          borderRadius: "50%", // Make the icon circular
                          fontWeight: 600, // Set the font weight to bold
                        }}
                      ></i>
                    ) : new Date(activity?.scheduledActivityStartTime) <
                      new Date() ? (
                      <i
                        className="pi pi-spin pi-cog" // PrimeIcons cog to indicate an ongoing process if scheduled time has passed
                        style={{
                          fontSize: "0.8rem", // Set the font size of the icon
                          marginLeft: "0.5rem", // Add a margin to the left of the icon
                          padding: "0.2rem", // Add padding around the icon
                          borderRadius: "50%", // Make the icon circular
                          fontWeight: 600, // Set the font weight to bold
                        }}
                      ></i>
                    ) : (
                      "" // If no conditions match, display nothing
                    )}
                  </div>
                  </div>
                </MuiTooltip>

                {/* Tooltip to display the activity status (on time, early, late) */}
                <MuiTooltip title={status} placement="top">
                  <Chip
                    label={`${differenceMessage}`} // Display the time difference message as the Chip label
                    size="small" // Set the size of the Chip to small
                    color={
                      status === "ontime"
                        ? "success" // Green Chip for on-time activities
                        : status === "early"
                        ? "info" // Blue Chip for early activities
                        : status === "late"
                        ? "error" // Red Chip for late activities
                        : "warning" // Yellow Chip for any other cases
                    }
                    icon={
                      status === "ontime" ? (
                        <ScheduleIcon /> // Use a schedule icon for on-time status
                      ) : status === "early" ? (
                        <HistoryIcon /> // Use a history icon for early status
                      ) : status === "late" ? (
                        <TimerOffOutlinedIcon /> // Use a timer-off icon for late status
                      ) : (
                        <NotStartedOutlinedIcon /> // Use a not-started icon for any other cases
                      )
                    }
                  />
                </MuiTooltip>
              </div>
            </Grid>

            <Grid item xs={12}>
              {/* Create a Grid item that spans 12 columns */}
              <Grid container spacing={1}>
                {/* Create a Grid container with 1rem spacing between items */}
                <Grid container xs={12}>
                  {/* Create a nested Grid container spanning 12 columns */}
                  <Grid
                    justifyContent="center"
                    alignItems="center"
                    container
                    xs={12}
                    sx={{ background: "#eeeeee", marginBottom: "0.5rem" }}
                  >
                    {/* Create a Grid container that centers its content and applies background and margin */}
                    <Typography
                      sx={{
                        fontSize: "0.75rem", // Set font size to 0.75rem
                        margin: "0.2rem 0", // Set top and bottom margin to 0.2rem
                        fontWeight: "600", // Set font weight to 600 (bold)
                      }}
                    >
                      Start Time {/* Display the "Start Time" label */}
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    xs={6}
                    // sx={{ marginBottom: "0.5rem" }}
                    sx={{
                      paddingBottom: "0.5rem", // Set bottom padding
                      borderRight: "1px solid #e5e7eb", // Set right border
                    }}
                  >
                    {/* Create a Grid container for the "Schedule" label */}
                    <Typography sx={{ fontSize: "0.75rem", fontWeight: "500" }}>
                      Schedule {/* Display the "Schedule" label */}
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    xs={6}
                    sx={{ marginBottom: "0.5rem" }}
                  >
                    {/* Create a Grid container for displaying the scheduled activity start time */}
                    <Typography textAlign="center" sx={{ fontSize: "0.75rem" }}>
                      {formatDateTime(activity.scheduledActivityStartTime)}
                      {/* Format and display the scheduled start time */}
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    xs={6}
                    // sx={{ marginBottom: "0.5rem" }}
                    sx={{
                      paddingBottom: "0.5rem", // Set bottom padding
                      borderRight: "1px solid #e5e7eb", // Set right border
                    }}
                  >
                    {/* Create a Grid container for the "Actual" label */}
                    <Typography sx={{ fontSize: "0.75rem", fontWeight: "500" }}>
                      Actual {/* Display the "Actual" label */}
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    xs={6}
                    sx={{ marginBottom: "0.5rem" }}
                  >
                    {/* Create a Grid container for displaying the actual activity start time */}
                    <Typography textAlign="center" sx={{ fontSize: "0.75rem" }}>
                      {formatDateTime(activity.actualActivityStartTime)}
                      {/* Format and display the actual start time */}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container xs={12}>
                  {/* Create another nested Grid container for "Duration" section */}
                  <Grid
                    justifyContent="center"
                    alignItems="center"
                    container
                    xs={12}
                    sx={{ background: "#eeeeee", marginBottom: "0.5rem" }}
                  >
                    {/* Create a Grid container that centers its content and applies background and margin */}
                    <Typography
                      sx={{
                        fontSize: "0.75rem", // Set font size to 0.75rem
                        margin: "0.2rem 0", // Set top and bottom margin to 0.2rem
                        fontWeight: "600", // Set font weight to 600 (bold)
                      }}
                    >
                      Duration {/* Display the "Duration" label */}
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    xs={6}
                    //sx={{ marginBottom: "0.5rem" }}
                    sx={{
                      paddingBottom: "0.5rem", // Set bottom padding
                      borderRight: "1px solid #e5e7eb", // Set right border
                    }}
                  >
                    {/* Create a Grid container for the "Benchmark" label */}
                    <Typography sx={{ fontSize: "0.75rem", fontWeight: "500" }}>
                      Benchmark {/* Display the "Benchmark" label */}
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    xs={6}
                    sx={{ marginBottom: "0.5rem" }}
                  >
                    {/* Create a Grid container for displaying the scheduled duration */}
                    <Typography textAlign="center" sx={{ fontSize: "0.75rem" }}>
                      {isNaN || activity?.scheduledActivityStartTime === null
                        ? formatDuration(activity?.duration)
                        : "----"}
                      {/* Format and display the benchmark duration or show dashes if unavailable */}
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    xs={6}
                    // sx={{ marginBottom: "0.5rem", borderRight: "1px solid #e5e7eb" }}
                    sx={{
                      paddingBottom: "0.5rem", // Set bottom padding
                      borderRight: "1px solid #e5e7eb", // Set right border
                    }}
                  >
                    {/* Create a Grid container for the "Actual" label */}
                    <Typography sx={{ fontSize: "0.75rem", fontWeight: "500" }}>
                      Actual {/* Display the "Actual" label */}
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    xs={6}
                    sx={{ marginBottom: "0.5rem" }}
                  >
                    {/* Create a Grid container for displaying the actual duration */}
                    <Typography textAlign="center" sx={{ fontSize: "0.75rem" }}>
                      {activity.actualActivityEndTime === null
                        ? "----"
                        : formatDuration(actActualdDuration)}
                      {/* Format and display the actual duration or show dashes if unavailable */}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  xs={12}
                  sx={{ margin: "0.7rem 0" }}
                >
                  {/* Create a centered Grid container for "Asset Name" and "Logbook" section */}
                  <div style={{ display: "flex", columnGap: "1rem" }}>
                    {/* Create a flexbox div with 1rem gap between items */}
                    <MuiTooltip title="Asset Name" placement="top">
                      {/* Tooltip to display "Asset Name" on hover */}
                      <Chip
                        size="small" // Set the Chip size to small
                        color="info" // Set Chip color to info (blue)
                        label={
                          activity.assetName === null ||
                          activity.assetName === undefined ||
                          activity.assetName === ""
                            ? "NA" // If asset name is unavailable, display "NA"
                            : activity.assetName
                        }
                      />
                    </MuiTooltip>

                    {activity.logbook && (
                      <MuiTooltip title={activity.logbook} placement="top">
                        {/* Tooltip to display logbook info on hover */}
                        <DescriptionIcon
                          style={{ cursor: "pointer" }} // Make the icon clickable
                          onClick={() =>
                            onLogbookClick(activity.activityId, activity.jobId)
                          }
                          // On click, trigger the logbook click handler
                        />
                      </MuiTooltip>
                    )}
                  </div>
                </Grid>

                <Grid item xs={6}>
                  {/* Create a Grid item for the performer avatar */}
                  <div
                    style={{
                      display: "grid", // Use grid layout for items
                      justifyItems: "center", // Center items horizontally
                      rowGap: "0.4rem", // Set gap between rows
                      marginBottom: "1rem", // Add bottom margin
                    }}
                  >
                    <MuiTooltip title={activity.performer} placement="top">
                      {/* Tooltip to display performer name on hover */}
                      <MuiAvatar
                        style={{
                          backgroundColor: "#43a047", // Set avatar background color to green
                          color: "#ffffff", // Set text color to white
                          width: 32, // Set avatar width to 32px
                          height: 32, // Set avatar height to 32px
                          fontSize: "1.15rem", // Set font size to 1.15rem
                        }}
                        shape="circle" // Set the avatar shape to circular
                      >
                        {getInitials(activity.performer)}
                        {/* Display the performer's initials */}
                      </MuiAvatar>
                    </MuiTooltip>
                    <Typography sx={{ fontSize: "0.65rem", color: "#43a047" }}>
                      Performer {/* Display the "Performer" label */}
                    </Typography>
                  </div>
                </Grid>

                <Grid item xs={6}>
                  {/* Create a Grid item for the approver avatar */}
                  <div
                    style={{
                      display: "grid", // Use grid layout for items
                      justifyItems: "center", // Center items horizontally
                      rowGap: "0.4rem", // Set gap between rows
                      marginBottom: "1rem", // Add bottom margin
                    }}
                  >
                    <MuiTooltip title={activity.approver} placement="top">
                      {/* Tooltip to display approver name on hover */}
                      <MuiAvatar
                        style={{
                          backgroundColor: "#ff1744", // Set avatar background color to red
                          color: "#ffffff", // Set text color to white
                          width: 32, // Set avatar width to 32px
                          height: 32, // Set avatar height to 32px
                          fontSize: "1.15rem", // Set font size to 1.15rem
                        }}
                        shape="circle" // Set the avatar shape to circular
                      >
                        {getInitials(activity.approver)}
                        {/* Display the approver's initials */}
                      </MuiAvatar>
                    </MuiTooltip>
                    <Typography sx={{ fontSize: "0.65rem", color: "#ff1744" }}>
                      Approver {/* Display the "Approver" label */}
                    </Typography>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  };

  const activityTemplateForListView = (activity) => {
    // Objective: Calculate the duration and status of an activity, adjusting for weekend days and handling early, late, or on-time statuses.

    // Create a moment object for the scheduled activity start time
    const scheduledTime = moment(activity.scheduledActivityStartTime);

    // Create a moment object for the actual activity start time
    const actualTime = moment(activity.actualActivityStartTime);

    // Calculate the difference between actual start time and scheduled start time in minutes
    const differenceInMinutes = actualTime.diff(scheduledTime, "minutes");

    // Calculate the actual duration of the activity in minutes
    let actActualdDuration = Math.floor(
      (new Date(activity.actualActivityEndTime) - // Get the difference between end and start time in milliseconds
        new Date(activity.actualActivityStartTime)) /
        (1000 * 60) // Convert milliseconds to minutes
    );

    // Call a function to check if the scheduled time falls on a weekend
    const actActualWeekendData = checkWeekend(
      activity.scheduledActivityStartTime, // Pass scheduled start time to the weekend check
      activity.scheduledActivityEndTime // Pass scheduled end time to the weekend check
    );

    // Log the weekend data for debugging purposes
    console.log("ACT weekendData : ", actActualWeekendData);

    // Check if weekdays value is 6 (i.e., work week is Monday-Saturday) and the weekend contains a Sunday
    if (activity.weekdays === 6 && actActualWeekendData.hasSunday) {
      // Deduct the duration for each Sunday (1440 minutes in a day)
      actActualdDuration =
        actActualdDuration - actActualWeekendData.sundayCount * 1440;
    }

    // Check if weekdays value is 5 (i.e., work week is Monday-Friday)
    if (activity.weekdays === 5) {
      // Deduct time if weekend includes Sunday
      if (actActualWeekendData.hasSunday) {
        actActualdDuration =
          actActualdDuration - actActualWeekendData.sundayCount * 1440;
      }
      // Deduct time if weekend includes Saturday
      if (actActualWeekendData.hasSaturday) {
        actActualdDuration =
          actActualdDuration - actActualWeekendData.saturdayCount * 1440;
      }
    }

    // Declare variables to store activity status and time difference message
    let status;
    let differenceMessage;

    // Check if the activity started on time (i.e., no difference between scheduled and actual start time)
    if (differenceInMinutes === 0) {
      status = "ontime"; // Set status as "ontime"
      differenceMessage = "On Time"; // Message indicating the activity started on time
    }
    // Check if the activity started earlier than scheduled
    else if (differenceInMinutes < 0) {
      status = "early"; // Set status as "early"
      const minutes = Math.abs(differenceInMinutes); // Get the absolute difference in minutes
      differenceMessage = formatDuration(minutes); // Format the early start time difference
    }
    // Check if the activity started later than scheduled
    else {
      status = "late"; // Set status as "late"
      const minutes = Math.abs(differenceInMinutes); // Get the absolute difference in minutes
      differenceMessage = formatDuration(minutes); // Format the late start time difference
    }

    return (
      <div className="activity-item">
        <div
          style={{
            borderRadius: "0.5rem",
            boxShadow: "1",
          }}
        >
          <Grid container spacing={1}>
            {/*Grid item representing the header of the activity */}
            <Grid item xs={12} className="activity-header">
              {/* Div container for layout styling of the activity header */}
              <div
                style={{
                  display: "flex", // Use flexbox for alignment
                  alignItems: "center", // Center items vertically
                  columnGap: "0.5rem", // Space between items in a column
                  justifyContent: "space-between", // Distribute space between items
                  borderBottom: "1px solid #bcaeae", // Bottom border style
                  borderTop: "1px solid #d6d4d4", // Top border style
                  background: "#e2e1e1", // Background color of the header
                  padding: "0.7rem", // Padding around the content
                }}
              >
                {/* Tooltip showing the activity ID when hovering over the activity name */}
                <MuiTooltip title={activity.activityId} placement="top">
                  <Typography sx={{ fontWeight: "600", fontSize: "0.8rem" }}>
                    {activity.activityName} {/* Display the activity name */}
                    {/* Conditional rendering for activity status icons */}
                    {activity.actvityStatus === "Started" ? ( // Check if activity status is "Started"
                      <i
                        className="pi pi-spin pi-spinner" // Icon indicating that the activity is in progress
                        style={{
                          fontSize: "0.8rem", // Font size for the icon
                          marginLeft: "0.5rem", // Left margin for spacing
                          color: "#ffecb3", // Icon color for "Started"
                          background: "#ff8f00", // Background color for the icon
                          padding: "0.2rem", // Padding around the icon
                          borderRadius: "50%", // Make the icon circular
                          fontWeight: 600, // Font weight for the icon
                        }}
                      ></i>
                    ) : activity.actvityStatus === "Completed" ||
                      activity.actvityStatus === "Approved" ? (
                      // Check if activity status is "Completed"
                      <i
                        className="pi pi-check" // Icon indicating that the activity is completed
                        style={{
                          fontSize: "0.8rem", // Font size for the icon
                          marginLeft: "0.5rem", // Left margin for spacing
                          color: "#2e7d32", // Icon color for "Completed"
                          background: "#c8e6c9", // Background color for the icon
                          padding: "0.2rem", // Padding around the icon
                          borderRadius: "50%", // Make the icon circular
                          fontWeight: 600, // Font weight for the icon
                        }}
                      ></i>
                    ) : new Date(activity?.scheduledActivityStartTime) <
                      new Date() ? ( // Check if the scheduled start time is in the past
                      <i
                        className="pi pi-spin pi-cog" // Icon indicating that the activity is pending
                        style={{
                          fontSize: "0.8rem", // Font size for the icon
                          marginLeft: "0.5rem", // Left margin for spacing
                          padding: "0.2rem", // Padding around the icon
                          borderRadius: "50%", // Make the icon circular
                          fontWeight: 600, // Font weight for the icon
                        }}
                      ></i>
                    ) : (
                      "" // Render nothing if none of the conditions are met
                    )}
                    {/* Uncomment if you want to display the activity status text */}
                    {/* {activity.actvityStatus} */}
                  </Typography>
                </MuiTooltip>

                {/* Chip displaying the status message and icon */}
                <Chip
                  label={`${differenceMessage}`} // Display the formatted difference message
                  size="small" // Set the size of the chip
                  color={
                    // Determine the chip color based on activity status
                    status === "ontime" // If on time, use success color
                      ? "success"
                      : status === "early" // If early, use info color
                      ? "info"
                      : status === "late" // If late, use error color
                      ? "error"
                      : "warning" // Default to warning color
                  }
                  icon={
                    // Determine the icon based on activity status
                    status === "ontime" ? ( // If on time, show schedule icon
                      <ScheduleIcon />
                    ) : status === "early" ? ( // If early, show history icon
                      <HistoryIcon />
                    ) : status === "late" ? ( // If late, show timer off icon
                      <TimerOffOutlinedIcon />
                    ) : (
                      // Default icon for not started
                      <NotStartedOutlinedIcon />
                    )
                  }
                />
              </div>
            </Grid>

            {/* Main Grid container for the activity details */}
            <Grid item xs={12}>
              <Grid container spacing={1}>
                {" "}
                {/* Container for spacing between inner Grid items */}
                <Grid container xs={8}>
                  {" "}
                  {/* Container taking 8 out of 12 columns for activity details */}
                  <Grid container xs={12}>
                    {" "}
                    {/* Inner container for organizing content */}
                    {/* Header for Start Time section */}
                    <Grid
                      justifyContent="center" // Center the content horizontally
                      alignItems="center" // Center the content vertically
                      container
                      xs={12} // Full width of the parent container
                      sx={{ background: "#eeeeee", marginBottom: "0.5rem" }} // Background color and bottom margin
                    >
                      <Typography
                        sx={{
                          fontSize: "0.75rem", // Font size for the header
                          margin: "0.2rem 0", // Margin for spacing
                          fontWeight: "600", // Font weight for boldness
                        }}
                      >
                        Start Time
                      </Typography>
                    </Grid>
                    {/* Schedule label for scheduled start time */}
                    <Grid
                      container
                      direction="row" // Arrange items in a row
                      justifyContent="center" // Center the content horizontally
                      alignItems="center" // Center the content vertically
                      xs={6} // Half width of the parent container
                      // sx={{ marginBottom: "0.5rem" }} // Bottom margin for spacing
                      sx={{
                        paddingBottom: "0.5rem", // Set bottom padding
                        borderRight: "1px solid #e5e7eb", // Set right border
                      }}
                    >
                      <Typography
                        sx={{ fontSize: "0.75rem", fontWeight: "500" }} // Font size and weight for the label
                      >
                        Schedule
                      </Typography>
                    </Grid>
                    {/* Display the formatted scheduled start time */}
                    <Grid
                      container
                      direction="row" // Arrange items in a row
                      justifyContent="center" // Center the content horizontally
                      alignItems="center" // Center the content vertically
                      xs={6} // Half width of the parent container
                      //sx={{ marginBottom: "0.5rem" }} // Bottom margin for spacing
                    >
                      <Typography
                        textAlign="center" // Center align the text
                        sx={{ fontSize: "0.75rem" }} // Font size for the text
                      >
                        {formatDateTime(activity.scheduledActivityStartTime)}{" "}
                        {/* Format and display scheduled start time */}
                      </Typography>
                    </Grid>
                    {/* Actual label for actual start time */}
                    <Grid
                      container
                      direction="row" // Arrange items in a row
                      justifyContent="center" // Center the content horizontally
                      alignItems="center" // Center the content vertically
                      xs={6} // Half width of the parent container
                      sx={{
                        paddingBottom: "0.5rem", // Set bottom padding
                        borderRight: "1px solid #e5e7eb", // Set right border
                      }}
                    >
                      <Typography
                        sx={{ fontSize: "0.75rem", fontWeight: "500" }} // Font size and weight for the label
                      >
                        Actual
                      </Typography>
                    </Grid>
                    {/* Display the formatted actual start time */}
                    <Grid
                      container
                      direction="row" // Arrange items in a row
                      justifyContent="center" // Center the content horizontally
                      alignItems="center" // Center the content vertically
                      xs={6} // Half width of the parent container
                      sx={{ marginBottom: "0.5rem" }} // Bottom margin for spacing
                    >
                      <Typography
                        textAlign="center" // Center align the text
                        sx={{ fontSize: "0.75rem" }} // Font size for the text
                      >
                        {formatDateTime(activity.actualActivityStartTime)}{" "}
                        {/* Format and display actual start time */}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container xs={12}>
                    {" "}
                    {/* Another inner container for Duration section */}
                    {/* Header for Duration section */}
                    <Grid
                      justifyContent="center" // Center the content horizontally
                      alignItems="center" // Center the content vertically
                      container
                      xs={12} // Full width of the parent container
                      sx={{ background: "#eeeeee", marginBottom: "0.5rem" }} // Background color and bottom margin
                    >
                      <Typography
                        sx={{
                          fontSize: "0.75rem", // Font size for the header
                          margin: "0.2rem 0", // Margin for spacing
                          fontWeight: "600", // Font weight for boldness
                        }}
                      >
                        Duration
                      </Typography>
                    </Grid>
                    {/* Benchmark label for scheduled duration */}
                    <Grid
                      container
                      direction="row" // Arrange items in a row
                      justifyContent="center" // Center the content horizontally
                      alignItems="center" // Center the content vertically
                      xs={6} // Half width of the parent container
                      //sx={{ marginBottom: "0.5rem" }} // Bottom margin for spacing
                      sx={{
                        paddingBottom: "0.5rem", // Set bottom padding
                        borderRight: "1px solid #e5e7eb", // Set right border
                      }}
                    >
                      <Typography
                        sx={{ fontSize: "0.75rem", fontWeight: "500" }} // Font size and weight for the label
                      >
                        Benchmark
                      </Typography>
                    </Grid>
                    {/* Display the benchmark duration or placeholder if start time is null */}
                    <Grid
                      container
                      direction="row" // Arrange items in a row
                      justifyContent="center" // Center the content horizontally
                      alignItems="center" // Center the content vertically
                      xs={6} // Half width of the parent container
                      sx={{ marginBottom: "0.5rem" }} // Bottom margin for spacing
                    >
                      <Typography
                        textAlign="center" // Center align the text
                        sx={{ fontSize: "0.75rem" }} // Font size for the text
                      >
                        {activity.scheduledActivityStartTime === null
                          ? "----" // Display placeholder if scheduled start time is null
                          : formatDuration(activity?.duration)}{" "}
                        {/* Format and display duration */}
                      </Typography>
                    </Grid>
                    {/* Actual label for actual duration */}
                    <Grid
                      container
                      direction="row" // Arrange items in a row
                      justifyContent="center" // Center the content horizontally
                      alignItems="center" // Center the content vertically
                      xs={6} // Half width of the parent container
                      // sx={{ marginBottom: "0.5rem" }} // Bottom margin for spacing
                      sx={{
                        paddingBottom: "0.5rem", // Set bottom padding
                        borderRight: "1px solid #e5e7eb", // Set right border
                      }}
                    >
                      <Typography
                        sx={{ fontSize: "0.75rem", fontWeight: "500" }} // Font size and weight for the label
                      >
                        Actual
                      </Typography>
                    </Grid>
                    {/* Display the actual duration or placeholder if end time is null */}
                    <Grid
                      container
                      direction="row" // Arrange items in a row
                      justifyContent="center" // Center the content horizontally
                      alignItems="center" // Center the content vertically
                      xs={6} // Half width of the parent container
                      sx={{ marginBottom: "0.5rem" }} // Bottom margin for spacing
                    >
                      <Typography
                        textAlign="center" // Center align the text
                        sx={{ fontSize: "0.75rem" }} // Font size for the text
                      >
                        {activity.actualActivityEndTime === null
                          ? "----" // Display placeholder if actual end time is null
                          : formatDuration(actActualdDuration)}{" "}
                        {/* Format and display actual duration */}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container xs={4}>
                  {" "}
                  {/* Container taking 4 out of 12 columns for additional details */}
                  <Grid
                    container
                    direction="column" // Arrange items in a column
                    justifyContent="center" // Center the content vertically
                    alignItems="center" // Center the content horizontally
                    xs={12} // Full width of the parent container
                    sx={{ margin: "0.7rem 0" }} // Margin for spacing
                  >
                    {/* Container for displaying asset name and logbook icon */}
                    <div
                      style={{
                        display: "flex", // Use flexbox for layout
                        alignItems: "center", // Center items vertically
                        justifyItems: "center", // Center items horizontally
                        columnGap: "0.5rem", // Space between items in a column
                      }}
                    >
                      {/* Tooltip for asset name displayed as a chip */}
                      <MuiTooltip title="Asset Name" placement="top">
                        <Chip
                          size="small" // Size of the chip
                          color="info" // Color of the chip
                          label={
                            // Display asset name or "NA" if it is not available
                            activity.assetName === null ||
                            activity.assetName === undefined ||
                            activity.assetName === ""
                              ? "NA" // Placeholder for missing asset name
                              : activity.assetName
                          }
                        />
                      </MuiTooltip>
                      {/* Conditional rendering for logbook icon if available */}
                      {activity.logbook && (
                        <MuiTooltip title={activity.logbook} placement="top">
                          <DescriptionIcon
                            style={{ cursor: "pointer" }} // Change cursor to pointer on hover
                            onClick={() =>
                              onLogbookClick(
                                // Click event handler to open logbook
                                activity.activityId,
                                activity.jobId
                              )
                            }
                          />
                        </MuiTooltip>
                      )}
                    </div>
                  </Grid>
                  {/* Container for displaying performer details */}
                  <Grid item xs={12}>
                    <div
                      style={{
                        display: "grid", // Use grid layout for performer details
                        justifyItems: "center", // Center items horizontally
                        rowGap: "0.4rem", // Space between rows
                        marginBottom: "1rem", // Bottom margin for spacing
                      }}
                    >
                      {/* Tooltip for performer avatar */}
                      <MuiTooltip title={activity.performer} placement="top">
                        <MuiAvatar
                          style={{
                            backgroundColor: "#43a047", // Background color for performer avatar
                            color: "#ffffff", // Font color for performer initials
                            width: 32, // Width of the avatar
                            height: 32, // Height of the avatar
                            fontSize: "1.15rem", // Font size for initials
                          }}
                          shape="circle" // Shape of the avatar
                        >
                          {getInitials(activity.performer)}{" "}
                          {/* Get initials for performer */}
                        </MuiAvatar>
                      </MuiTooltip>
                      <Typography
                        sx={{ fontSize: "0.72rem", color: "#43a047" }} // Font size and color for performer label
                      >
                        Performer
                      </Typography>
                    </div>
                  </Grid>
                  {/* Container for displaying reviewer details */}
                  <Grid item xs={12}>
                    <div
                      style={{
                        display: "grid", // Use grid layout for reviewer details
                        justifyItems: "center", // Center items horizontally
                        rowGap: "0.4rem", // Space between rows
                        marginBottom: "1rem", // Bottom margin for spacing
                      }}
                    >
                      {/* Tooltip for reviewer avatar */}
                      <MuiTooltip title={activity.approver} placement="top">
                        <MuiAvatar
                          style={{
                            backgroundColor: "#ff1744", // Background color for reviewer avatar
                            color: "#ffffff", // Font color for reviewer initials
                            width: 32, // Width of the avatar
                            height: 32, // Height of the avatar
                            fontSize: "1.15rem", // Font size for initials
                          }}
                          shape="circle" // Shape of the avatar
                        >
                          {getInitials(activity.approver)}{" "}
                          {/* Get initials for reviewer */}
                        </MuiAvatar>
                      </MuiTooltip>
                      <Typography
                        sx={{ fontSize: "0.72rem", color: "#ff1744" }} // Font size and color for reviewer label
                      >
                        Reviewer
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  };
  /**
   * Checks if the provided date range includes weekends (Saturday and Sunday)
   * and counts the occurrences of each.
   *
   * @param {string|Date} startDate - The start date of the range.
   * @param {string|Date} endDate - The end date of the range.
   * @returns {Object} - An object containing boolean flags for Saturday and Sunday presence,
   *                     and counts of each.
   */
  function checkWeekend(startDate, endDate) {
    const date = new Date(startDate); // Convert startDate to a Date object
    const date1 = new Date(endDate); // Convert endDate to a Date object
    let hasSaturday = false; // Flag to indicate if Saturday is present
    let hasSunday = false; // Flag to indicate if Sunday is present
    let saturdayCount = 0; // Counter for the number of Saturdays
    let sundayCount = 0; // Counter for the number of Sundays

    // Loop through each day from startDate to endDate
    for (let d = date; d <= date1; d.setDate(d.getDate() + 1)) {
      const day = d.getDay(); // Get the day of the week (0-6)
      if (day === 6) {
        // Check if it's Saturday (6)
        hasSaturday = true; // Set flag for Saturday presence
        saturdayCount++; // Increment Saturday counter
      }
      if (day === 0) {
        // Check if it's Sunday (0)
        hasSunday = true; // Set flag for Sunday presence
        sundayCount++; // Increment Sunday counter
      }
    }

    // Return an object with flags and counts for Saturdays and Sundays
    return { hasSaturday, hasSunday, saturdayCount, sundayCount };
  }

  /**
   * Returns a color code based on the priority level.
   *
   * @param {string} priority - The priority level (e.g., "Critical", "Normal").
   * @returns {string} - A color code representing the priority.
   */
  const getpriorityColor = (priority) => {
    switch (
      priority // Check the priority level
    ) {
      case "Critical": // If priority is Critical
        return "error"; // Return error color code
      case "Normal": // If priority is Normal
        return "success"; // Return success color code
      default: // For any other priority
        return "info"; // Return info color code
    }
  };

  /**
   * Extracts initials from the provided email address.
   *
   * @param {string} email - The email address from which to extract initials.
   * @returns {string} - The initials derived from the email.
   */
  /**
   * Generates tooltip text for the current performer.
   *
   * @param {string} currentPerformer - The name of the current performer.
   * @returns {string} - Tooltip text for the current performer.
   */
  /**
   * Formats a duration in minutes into a human-readable string of days, hours, and minutes.
   *
   * @param {number} minutes - The duration in minutes to format.
   * @returns {string} - A formatted string representing the duration.
   */
  function formatDuration(minutes) {
    console.log("minutes : ", minutes); // Log the duration in minutes for debugging
    const days = Math.floor(minutes / 1440); // Calculate the number of full days
    const hours = Math.floor((minutes % 1440) / 60); // Calculate the number of full hours remaining
    const mins = minutes % 60; // Calculate the remaining minutes

    // Return a formatted string with days, hours, and minutes
    return `${days > 0 ? `${days}d ` : ""}${
      hours > 0 ? `${hours}h ` : ""
    }${mins}m`;
  }

  const listItem = (product, index) => {
    // Constant for the number of milliseconds in one minute
    const MS_IN_A_MINUTE = 1000 * 60;

    // Calculate the scheduled duration in minutes by finding the difference between
    // the scheduled job end and start times, and converting from milliseconds to minutes
    let scheduledDuration = Math.floor(
      (new Date(product.scheduledJobEndTime) - // Convert scheduledJobEndTime to a Date object
        new Date(product.scheduledJobStartTime)) / // Convert scheduledJobStartTime to a Date object
        MS_IN_A_MINUTE // Divide the difference by milliseconds in a minute
    );

    // Check for weekends within the scheduled job time range
    const schedulWeekendData = checkWeekend(
      product.scheduledJobStartTime, // Start time of the scheduled job
      product.scheduledJobEndTime // End time of the scheduled job
    );
    console.log("weekendData : ", schedulWeekendData); // Log the weekend data for debugging

    // Adjust the scheduled duration if the job is scheduled for a Saturday and includes Sundays
    if (product.weekdays === 6 && schedulWeekendData.hasSunday) {
      scheduledDuration =
        scheduledDuration - schedulWeekendData.sundayCount * 1440; // Subtract Sunday minutes (1440 minutes in a day)
    }

    // Further adjust the scheduled duration if the job is scheduled for a Friday
    if (product.weekdays === 5) {
      if (schedulWeekendData.hasSunday) {
        scheduledDuration =
          scheduledDuration - schedulWeekendData.sundayCount * 1440; // Subtract Sunday minutes
      }
      if (schedulWeekendData.hasSaturday) {
        scheduledDuration =
          scheduledDuration - schedulWeekendData.saturdayCount * 1440; // Subtract Saturday minutes
      }
    }

    // Calculate the actual duration in minutes similar to the scheduled duration
    let actualDuration = Math.floor(
      (new Date(product.actualJobEndTime) - // Convert actualJobEndTime to a Date object
        new Date(product.actualJobStartTime)) / // Convert actualJobStartTime to a Date object
        MS_IN_A_MINUTE // Divide the difference by milliseconds in a minute
    );

    // Check for weekends within the actual job time range
    const actualWeekendData = checkWeekend(
      product.actualJobStartTime, // Start time of the actual job
      product.actualJobEndTime // End time of the actual job
    );

    // Adjust the actual duration if the job is executed on a Saturday and includes Sundays
    if (product.weekdays === 6 && actualWeekendData.hasSunday) {
      actualDuration = actualDuration - actualWeekendData.sundayCount * 1440; // Subtract Sunday minutes
    }

    // Further adjust the actual duration if the job is executed on a Friday
    if (product.weekdays === 5) {
      if (actualWeekendData.hasSunday) {
        actualDuration = actualDuration - actualWeekendData.sundayCount * 1440; // Subtract Sunday minutes
      }
      if (actualWeekendData.hasSaturday) {
        actualDuration =
          actualDuration - actualWeekendData.saturdayCount * 1440; // Subtract Saturday minutes
      }
    }

    // Calculate the difference between actual and scheduled durations
    const durationDifference = actualDuration - scheduledDuration;

    // Log the duration difference for debugging
    console.log("job datetime: ", durationDifference);
    let status = ""; // Variable to hold the job status
    let differenceMessage = "N"; // Variable for the message related to the duration difference

    // Determine the status based on the duration difference and actual job end time
    if (!isNaN(durationDifference) && product.actualJobEndTime) {
      if (durationDifference === 0) {
        // If durations are equal
        status = "ontime"; // Set status to on time
        differenceMessage = "on time"; // Set message for on time
      } else if (durationDifference < 0) {
        // If actual duration is less than scheduled
        status = "early"; // Set status to early
        differenceMessage = `${formatDuration(
          Math.abs(durationDifference) // Format the duration difference as positive
        )} early.`; // Set message indicating how early
      } else {
        // If actual duration is greater than scheduled
        status = "late"; // Set status to late
        differenceMessage = `${formatDuration(
          Math.abs(durationDifference) // Format the duration difference as positive
        )} late.`; // Set message indicating how late
      }
    } else {
      // If duration difference is NaN or actual job end time is not available
      if (product?.jobStatus === "Not Started") {
        status = "Not Started"; // Set status for not started job
        differenceMessage = "Not Started"; // Set message for not started job
      }
      if (product?.jobStatus === "Started") {
        status = "Started"; // Set status for started job
        differenceMessage = "Started"; // Set message for started job
      }
      if (product?.jobStatus === "Sent For Approval") {
        status = "Sent For Approval"; // Set status for job sent for approval
        differenceMessage = "Sent For Approval"; // Set message for sent for approval
      }
      if (product?.jobStatus === "Completed") {
        status = "Completed"; // Set status for completed job
        differenceMessage = "Completed"; // Set message for completed job
      }
      if (product?.jobStatus === "Rejected") {
        status = "Rejected"; // Set status for rejected job
        differenceMessage = "Rejected"; // Set message for rejected job
      }
    }

    // Count the number of completed activities from the task's activity list
    const completedActivityCount = product?.task?.activityList?.filter(
      (activity) =>
        activity.actvityStatus === "Completed" ||
        activity.actvityStatus === "Approved" // Filter for completed activities
    ).length;

    // Calculate the percentage of completed activities
    const completedPercent = Math.floor(
      (100 * completedActivityCount) / product?.task?.activityList?.length // Calculate percentage based on total activities
    );

    // Get the current date and time
    const now = new Date();

    // Count the number of past activities based on their scheduled end time
    const pastActivitiesCount = product?.task?.activityList?.filter(
      (activity) => new Date(activity.scheduledActivityEndTime) <= now // Filter for activities that have ended
    ).length;

    // Calculate the percentage of past activities
    const pastActivitiesPercent = Math.floor(
      (100 * pastActivitiesCount) / product?.task?.activityList?.length // Calculate percentage based on total activities
    );

    return (
      <div className="col-12 p-1" key={product.jobID}>
        <div
          className="product-grid-item"
          style={{
            border: "1px solid #f0ebeb",
            borderRadius: "8px",
            padding: "0.5em",
            backgroundColor: "white",
          }}
        >
          <div
            className="new-Card-style"
            style={{
              borderRadius: "8px",
            }}
          >
            <Grid container spacing={1}>
              {/*This component renders a grid layout that displays a user's avatar and job information.
     It includes job priority, job name, job ID, and job status with corresponding icons.*/}

              <Grid
                container // Container for the main grid layout
                direction="column" // Align child items in a column
                justifyContent="center" // Center items vertically
                alignItems="center" // Center items horizontally
                item // Indicates this is a grid item
                xs={2} // Takes 2 out of 12 grid columns on extra-small screens
              >
                {/* Uncommented Avatar component that displays the user's avatar with a tooltip */}
                {/* <Avatar
    label={avatarLabel}
    style={{
      backgroundColor: "#2196F3", // Set background color
      color: "#ffffff", // Set text color
    }}
    shape="circle" // Set avatar shape to circle
    data-pr-tooltip={tooltipText} // Set tooltip text
  /> */}

                {/* Tooltip for displaying the approver's name on hover */}
                <MuiTooltip title={product?.approver} placement="top">
                  {/* Avatar displaying the initials of the approver */}
                  <MuiAvatar
                    style={{
                      backgroundColor: "#2196F3", // Set background color for the avatar
                      color: "#ffffff", // Set color for the avatar text
                      width: 32, // Set width of the avatar
                      height: 32, // Set height of the avatar
                      fontSize: "1.05rem", // Set font size for initials
                    }}
                    shape="circle" // Set shape of the avatar to circle
                  >
                    {getInitials(product?.approver)}{" "}
                    {/* Function to get initials from the approver's name*/}
                  </MuiAvatar>
                </MuiTooltip>
              </Grid>

              <Grid item xs={10}>
                {" "}
                {/* Grid item taking 10 out of 12 columns on extra-small screens*/}
                <Grid
                  container // Container for job information
                  sx={{
                    background: "#f5f5f5", // Set background color for the job info container
                    borderRadius: "2rem", // Round the corners of the container
                    margin: "0.5rem 0.5rem 0.5rem 0rem", // Set margin for the container
                    padding: "0.5rem", // Set padding for the container
                  }}
                >
                  <Grid
                    container // Inner grid for displaying job details
                    direction="row" // Align child items in a row
                    justifyContent="space-between" // Space out items evenly
                    alignItems="center" // Center items vertically
                    xs={6} // Takes 6 out of 12 grid columns on extra-small screens
                  >
                    <div
                      style={{
                        display: "flex", // Use flexbox for layout
                        alignItems: "center", // Center items vertically within the div
                        marginLeft: "0.5rem", // Set left margin
                        columnGap: "0.5rem", // Set gap between child elements
                      }}
                    >
                      {/* Circle icon representing the job priority */}
                      <CircleIcon
                        fontSize="14px" // Set font size of the icon
                        color={getpriorityColor(product.priority)} // Get color based on job priority
                      />

                      {/* Tooltip for displaying the job ID on hover */}
                      <MuiTooltip title={product.jobID} placement="top">
                        <Typography
                          sx={{
                            fontWeight: "600", // Set font weight to bold
                            fontSize: "0.8rem", // Set font size
                            width: "18rem", // Set fixed width
                          }}
                        >
                          {product.jobName} {/* Display the job name*/}
                        </Typography>
                      </MuiTooltip>
                    </div>
                  </Grid>

                  <Grid item xs={6}>
                    {" "}
                    {/* Grid item taking 6 out of 12 columns on extra-small screens*/}
                    <div
                      style={{
                        display: "flex", // Use flexbox for layout
                        justifyContent: "flex-end", // Align items to the right
                        marginRight: "0.5rem", // Set right margin
                      }}
                    >
                      {/* Conditionally render Chip component if durationDifference is a number */}
                      {!isNaN(durationDifference) && (
                        <Chip
                          label={`${differenceMessage}`} // Display the difference message
                          size="small" // Set the size of the chip
                          color={
                            // Set the color of the chip based on job status
                            status === "ontime"
                              ? "success" // Green for on time
                              : status === "early"
                              ? "info" // Blue for early
                              : status === "late"
                              ? "error" // Red for late
                              : status === "Not Started"
                              ? "info" // Blue for not started
                              : status === "Started"
                              ? "success" // Green for started
                              : "warning" // Default warning color
                          }
                          icon={
                            // Set the icon based on job status
                            status === "ontime" ? (
                              <ScheduleIcon /> // Schedule icon for on time
                            ) : status === "early" ? (
                              <HistoryIcon /> // History icon for early
                            ) : status === "late" ? (
                              <TimerOffOutlinedIcon /> // Timer icon for late
                            ) : status === "Not Started" ? (
                              <NotStartedOutlinedIcon /> // Not started icon
                            ) : status === "Started" ? (
                              <PlayCircleOutlineIcon /> // Play icon for started
                            ) : status === "Rejected" ? (
                              <DangerousIcon /> // Dangerous icon for rejected
                            ) : (
                              "" // Default empty icon
                            )
                          }
                        />
                      )}
                    </div>
                  </Grid>
                </Grid>
              </Grid>

              {/* This component renders two grid items: one for a vertical carousel displaying activities 
 and another for job information, including start times, durations, and a gauge for progress. */}

              <Grid item xs={6}>
                {" "}
                {/* Grid item taking 6 out of 12 columns on extra-small screens */}
                <div
                  style={{
                    background: "#f5f5f5", // Set background color for the activity container
                    borderRadius: "0.5rem", // Round the corners of the container
                    // Set box shadow for elevation effect
                    boxShadow:
                      "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
                  }}
                >
                  {/* Carousel component to display a list of activities */}
                  <Carousel
                    value={
                      product.task // Check if product.task exists
                        ? [...product.task.activityList].sort((a, b) => {
                            // Sort activities based on status and sequence
                            if (
                              a.actvityStatus === "Started" &&
                              b.actvityStatus !== "Started"
                            ) {
                              return -1; // 'a' comes first if its status is 'Started'
                            } else if (
                              a.actvityStatus !== "Started" &&
                              b.actvityStatus === "Started"
                            ) {
                              return 1; // 'b' comes first if its status is 'Started'
                            }
                            return a.sequence - b.sequence; // Sort by sequence if both are in the same status
                          })
                        : [] // Return an empty array if product.task is not defined
                    }
                    itemTemplate={activityTemplateForListView} // Template for each activity item
                    numVisible={1} // Show one item at a time
                    numScroll={1} // Scroll one item at a time
                    showIndicators={false} // Disable indicators for the carousel
                    verticalViewPortHeight="240px" // Set height for the vertical viewport
                    orientation="vertical" // Set carousel orientation to vertical
                  />
                </div>
              </Grid>

              <Grid item xs={6}>
                {" "}
                {/* Another grid item taking 6 out of 12 columns on extra-small screens  */}
                <div
                  style={{
                    background: "#f5f5f5", // Set background color for the job info container
                    borderRadius: "0.5rem", // Round the corners of the container
                    marginTop: "0.5rem", // Set top margin
                    // Set box shadow for elevation effect
                    boxShadow:
                      "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
                  }}
                >
                  <div
                    style={{
                      borderRadius: "0.5rem", // Round the corners of the inner container
                      boxShadow: "1", // Set box shadow for inner container
                    }}
                  >
                    <Grid container spacing={1}>
                      {" "}
                      {/* Grid container for job information  */}
                      <Grid item xs={12} className="activity-header">
                        <div
                          style={{
                            display: "flex", // Use flexbox for layout
                            alignItems: "center", // Center items vertically
                            marginTop: "1.6rem", // Set top margin
                            columnGap: "0.5rem", // Set gap between child elements
                            justifyContent: "center", // Center items horizontally
                            borderBottom: "1px solid #bcaeae", // Set bottom border
                            borderTop: "1px solid #d6d4d4", // Set top border
                            background: "#e2e1e1", // Set background color for the header
                            padding: "0.85rem", // Set padding for the header
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: "600", // Set font weight to bold
                              fontSize: "0.8rem", // Set font size
                              textAlign: "center", // Center text
                            }}
                          >
                            Job Information
                            {/* Header text for job information  */}
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item xs={8}>
                        {" "}
                        {/* Job information section taking 8 out of 12 columns  */}
                        <Grid container spacing={1}>
                          {" "}
                          {/* Container for displaying job details */}
                          <Grid container xs={12}>
                            {" "}
                            {/* Full-width container for start time section */}
                            <Grid
                              justifyContent="center" // Center items horizontally
                              alignItems="center" // Center items vertically
                              container
                              xs={12} // Full-width
                              sx={{
                                background: "#eeeeee", // Set background color for the label
                                marginLeft: "0.5rem", // Set left margin
                                marginBottom: "0.5rem", // Set bottom margin
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "0.75rem", // Set font size for label
                                  margin: "0.2rem 0", // Set margin for label
                                  fontWeight: "600", // Set font weight to bold
                                }}
                              >
                                Start Time {/* Label for start time */}
                              </Typography>
                            </Grid>
                            {/* Expected Start Time */}
                            <Grid
                              container
                              direction="row"
                              justifyContent="center" // Center items horizontally
                              alignItems="center" // Center items vertically
                              xs={6} // Half-width
                              sx={{
                                paddingBottom: "0.5rem", // Set bottom padding
                                borderRight: "1px solid #e5e7eb", // Set right border
                              }}
                            >
                              <Typography
                                sx={{ fontSize: "0.75rem", fontWeight: "500" }} // Set font size and weight
                              >
                                Expected {/* Label for expected start time */}
                              </Typography>
                            </Grid>
                            <Grid
                              container
                              direction="row"
                              justifyContent="center" // Center items horizontally
                              alignItems="center" // Center items vertically
                              xs={6} // Half-width
                              sx={{ paddingBottom: "0.5rem" }} // Set bottom padding
                            >
                              <Typography
                                textAlign="center" // Center text
                                sx={{ fontSize: "0.75rem" }} // Set font size
                              >
                                {formatDateTime(product.scheduledJobStartTime)}{" "}
                                {/* Display expected start time  */}
                              </Typography>
                            </Grid>
                            {/* Actual Start Time */}
                            <Grid
                              container
                              direction="row"
                              justifyContent="center" // Center items horizontally
                              alignItems="center" // Center items vertically
                              xs={6} // Half-width
                              sx={{
                                paddingBottom: "0.5rem", // Set bottom padding
                                borderRight: "1px solid #e5e7eb", // Set right border
                              }}
                            >
                              <Typography
                                sx={{ fontSize: "0.75rem", fontWeight: "500" }} // Set font size and weight
                              >
                                Actual {/* Label for actual start time */}
                              </Typography>
                            </Grid>
                            <Grid
                              container
                              direction="row"
                              justifyContent="center" // Center items horizontally
                              alignItems="center" // Center items vertically
                              xs={6} // Half-width
                              sx={{ marginBottom: "0.5rem" }} // Set bottom margin
                            >
                              <Typography
                                textAlign="center" // Center text
                                sx={{ fontSize: "0.75rem" }} // Set font size
                              >
                                {formatDateTime(product.actualJobStartTime)}{" "}
                                {/* Display actual start time  */}
                              </Typography>
                            </Grid>
                          </Grid>
                          {/* Duration Section */}
                          <Grid container xs={12}>
                            {" "}
                            {/* Full-width container for duration section */}
                            <Grid
                              justifyContent="center" // Center items horizontally
                              alignItems="center" // Center items vertically
                              container
                              xs={12} // Full-width
                              sx={{
                                background: "#eeeeee", // Set background color for the label
                                marginLeft: "0.5rem", // Set left margin
                                marginBottom: "0.5rem", // Set bottom margin
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "0.75rem", // Set font size for label
                                  margin: "0.2rem 0", // Set margin for label
                                  fontWeight: "600", // Set font weight to bold
                                }}
                              >
                                Duration {/* Label for duration */}
                              </Typography>
                            </Grid>
                            {/* Expected Duration */}
                            <Grid
                              container
                              direction="row"
                              justifyContent="center" // Center items horizontally
                              alignItems="center" // Center items vertically
                              xs={6} // Half-width
                              sx={{
                                paddingBottom: "0.5rem", // Set bottom padding
                                borderRight: "1px solid #e5e7eb", // Set right border
                              }}
                            >
                              <Typography
                                sx={{ fontSize: "0.75rem", fontWeight: "500" }} // Set font size and weight
                              >
                                Expected {/* Label for expected duration */}
                              </Typography>
                            </Grid>
                            <Grid
                              container
                              direction="row"
                              justifyContent="center" // Center items horizontally
                              alignItems="center" // Center items vertically
                              xs={6} // Half-width
                              sx={{ paddingBottom: "0.5rem" }} // Set bottom padding
                            >
                              <Typography
                                textAlign="center" // Center text
                                sx={{ fontSize: "0.75rem" }} // Set font size
                              >
                                {isNaN ||
                                product?.scheduledJobStartTime === null // Check if the value is NaN or scheduledJobStartTime is null
                                  ? formatDuration(scheduledDuration) // Display expected duration
                                  : "----"}{" "}
                                {/* Fallback display if conditions are not met  */}
                              </Typography>
                            </Grid>
                            {/* Actual Duration */}
                            <Grid
                              container
                              direction="row"
                              justifyContent="center" // Center items horizontally
                              alignItems="center" // Center items vertically
                              xs={6} // Half-width
                              sx={{
                                paddingBottom: "0.5rem", // Set bottom padding
                                borderRight: "1px solid #e5e7eb", // Set right border
                              }}
                            >
                              <Typography
                                sx={{ fontSize: "0.75rem", fontWeight: "500" }} // Set font size and weight
                              >
                                Actual {/* Label for actual duration */}
                              </Typography>
                            </Grid>
                            <Grid
                              container
                              direction="row"
                              justifyContent="center" // Center items horizontally
                              alignItems="center" // Center items vertically
                              xs={6} // Half-width
                              sx={{ marginBottom: "0.5rem" }} // Set bottom margin
                            >
                              <Typography
                                textAlign="center" // Center text
                                sx={{ fontSize: "0.75rem" }} // Set font size
                              >
                                {product.actualJobEndTime === null // Check if actualJobEndTime is null
                                  ? "----" // Fallback display if null
                                  : formatDuration(actualDuration)}{" "}
                                {/* Display actual duration  */}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                        {/* Spacer grid item  */}
                      </Grid>
                      <Grid
                        container
                        direction="column"
                        justifyContent="center" // Center items vertically
                        alignItems="center" // Center items horizontally
                        xs={4} // Occupy 4 out of 12 columns
                        //sx={{background:"green"}}
                      >
                        <div
                          style={{
                            position: "relative", // Set relative positioning for inner elements
                            width: "150", // Set width for the gauge container
                            height: "150", // Set height for the gauge container
                            marginLeft: "-7rem", // Set left margin
                            marginTop: "-8rem", // Set top margin
                          }}
                        >
                          {/* Gauge for past activities percentage */}
                          <div
                            style={{
                              position: "absolute", // Set absolute positioning for the gauge
                              top: "0", // Align to the top
                              left: "0", // Align to the left
                              zIndex: 2, // Set z-index to place above other elements
                            }}
                          >
                            <Gauge
                              width={150} // Set width for the gauge
                              height={150} // Set height for the gauge
                              innerRadius="90%" // Set inner radius to create a donut effect
                              value={pastActivitiesPercent} // Set the value to display
                              startAngle={0} // Set start angle for the gauge
                              endAngle={180} // Set end angle for the gauge
                              sx={(theme) => ({
                                [`& .${gaugeClasses.valueArc}`]: {
                                  fill: "#ff5722", // Set fill color for the gauge
                                },
                                "& .MuiGauge-valueText": {
                                  display: "none", // Hide the value text
                                },
                              })}
                            />
                          </div>

                          {/* Gauge for completed percentage */}
                          <div
                            style={{
                              position: "absolute", // Set absolute positioning for the gauge
                              top: "20px", // Align to the top
                              left: "10px", // Align to the left
                              zIndex: 2, // Set z-index to place above other elements
                            }}
                          >
                            <Gauge
                              width={110} // Set width for the gauge
                              height={110} // Set height for the gauge
                              innerRadius="90%" // Set inner radius to create a donut effect
                              value={completedPercent} // Set the value to display
                              startAngle={0} // Set start angle for the gauge
                              endAngle={180} // Set end angle for the gauge
                              sx={(theme) => ({
                                [`& .${gaugeClasses.valueArc}`]: {
                                  fill: "#40c4ff", // Set fill color for the gauge
                                },
                                "& .MuiGauge-valueText": {
                                  display: "none", // Hide the value text
                                },
                              })}
                            />
                          </div>

                          {/* Displaying the comparison of completed vs past activities */}
                          <div
                            style={{
                              position: "absolute", // Set absolute positioning for the text
                              top: "44px", // Align to the middle
                              left: "25px", // Align to the left
                              zIndex: 2, // Set z-index to place above other elements
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "0.85rem", // Set font size for the comparison text
                                marginBottom: "0.5rem", // Set bottom margin
                              }}
                            >
                              {completedPercent} vs {pastActivitiesPercent}{" "}
                              {/* Show completed vs past activities percentage  */}
                            </Typography>
                          </div>
                        </div>
                      </Grid>
                      <Grid sx={{ padding: "0.57rem" }} container xs={12}>
                        <Grid item xs={8}></Grid>
                        <Grid item xs={4}>
                          <Typography
                            sx={{ fontSize: "0.75rem", textAlign: "center" }}
                          >
                            Actual vs Plan
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid sx={{ padding: "0.57rem" }} item xs={12}></Grid>
                    </Grid>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    );
  };
  const gridItem = (product) => {
    // This section calculates the scheduled duration of a job while accounting for weekends.
    // It also checks the status of the job based on actual completion time and scheduled time.

    let scheduledDuration = Math.floor(
      // Calculate the scheduled duration in minutes
      (new Date(product.scheduledJobEndTime) -
        new Date(product.scheduledJobStartTime)) /
        (1000 * 60) // Convert milliseconds to minutes
    );

    // Check if the scheduled job start and end times fall on weekends
    const schedulWeekendData = checkWeekend(
      product.scheduledJobStartTime,
      product.scheduledJobEndTime
    );

    // Adjust scheduled duration for Sunday if job starts on a Saturday
    if (product.weekdays === 6 && schedulWeekendData.hasSunday) {
      // Subtract the count of Sundays in the duration, converting days to minutes (1440 minutes in a day)
      scheduledDuration =
        scheduledDuration - schedulWeekendData.sundayCount * 1440;
    }

    // Adjust scheduled duration for Saturday and Sunday if job starts on a Friday
    if (product.weekdays === 5) {
      if (schedulWeekendData.hasSunday) {
        // Subtract Sundays from scheduled duration
        scheduledDuration =
          scheduledDuration - schedulWeekendData.sundayCount * 1440;
      }
      if (schedulWeekendData.hasSaturday) {
        // Subtract Saturdays from scheduled duration
        scheduledDuration =
          scheduledDuration - schedulWeekendData.saturdayCount * 1440;
      }
    }

    // Calculate the actual duration of the job in minutes
    let actualDuration = Math.floor(
      (new Date(product.actualJobEndTime) -
        new Date(product.actualJobStartTime)) /
        (1000 * 60) // Convert milliseconds to minutes
    );

    // Check if the actual job start and end times fall on weekends
    const actualWeekendData = checkWeekend(
      product.actualJobStartTime,
      product.actualJobEndTime
    );

    // Adjust actual duration for Sunday if job starts on a Saturday
    if (product.weekdays === 6 && actualWeekendData.hasSunday) {
      actualDuration = actualDuration - actualWeekendData.sundayCount * 1440;
    }

    // Adjust actual duration for Saturday and Sunday if job starts on a Friday
    if (product.weekdays === 5) {
      if (actualWeekendData.hasSunday) {
        // Subtract Sundays from actual duration
        actualDuration = actualDuration - actualWeekendData.sundayCount * 1440;
      }
      if (actualWeekendData.hasSaturday) {
        // Subtract Saturdays from actual duration
        actualDuration =
          actualDuration - actualWeekendData.saturdayCount * 1440;
      }
    }

    // Calculate the difference between actual and scheduled duration
    const durationDifference = actualDuration - scheduledDuration;
    let status = ""; // Initialize status variable to hold job status
    let differenceMessage = ""; // Initialize message variable to explain status difference

    // Determine job status based on duration difference and actual end time
    if (!isNaN(durationDifference) && product.actualJobEndTime) {
      if (durationDifference === 0) {
        status = "ontime"; // Status is on time if there's no difference
        differenceMessage = "on time"; // Message indicates on time
      } else if (durationDifference < 0) {
        status = "early"; // Status is early if actual duration is less than scheduled
        const minute = `${Math.abs(durationDifference)}`; // Get absolute difference in minutes
        differenceMessage = formatDuration(minute); // Format duration for message
      } else {
        status = "late"; // Status is late if actual duration is more than scheduled
        const minute = `${Math.abs(durationDifference)}`; // Get absolute difference in minutes
        differenceMessage = formatDuration(minute); // Format duration for message
      }
    } else {
      // Assign status based on the job status if actual end time is not available
      if (product?.jobStatus === "Not Started") {
        status = "Not Started"; // Status indicates job hasn't started
        differenceMessage = "Not Started"; // Message indicates not started
      }
      if (product?.jobStatus === "Started") {
        status = "Started"; // Status indicates job is in progress
        differenceMessage = "Started"; // Message indicates started
      }
      if (product?.jobStatus === "Sent For Approval") {
        status = "Sent For Approval"; // Status indicates job is awaiting approval
        differenceMessage = "Sent For Approval"; // Message indicates awaiting approval
      }
      if (product?.jobStatus === "Completed") {
        status = "Completed"; // Status indicates job is completed
        differenceMessage = "Completed"; // Message indicates completed
      }
      if (product?.jobStatus === "Rejected") {
        status = "Rejected"; // Status indicates job has been rejected
        differenceMessage = "Rejected"; // Message indicates rejected
      }
    }

    // Calculate the count of completed activities in the task
    const completedActivityCount = product?.task?.activityList?.filter(
      (activity) =>
        activity.actvityStatus === "Completed" ||
        activity.actvityStatus === "Approved" // Filter for completed activities
    ).length;

    // Calculate the percentage of completed activities
    const completedPercent = Math.floor(
      (100 * completedActivityCount) / product?.task?.activityList?.length // Calculate percentage based on total activities
    );

    // Get the current date and time for comparison with past activities
    const now = new Date();
    // Calculate the count of past activities that have ended
    const pastActivitiesCount = product?.task?.activityList?.filter(
      (activity) => new Date(activity.scheduledActivityEndTime) <= now // Filter for past activities
    ).length;

    // Calculate the percentage of past activities
    const pastActivitiesPercent = Math.floor(
      (100 * pastActivitiesCount) / product?.task?.activityList?.length // Calculate percentage based on total activities
    );

    return (
      <div
        className="xl:col-6 lg:col-6 md:col-6 sm:col-12 p-1"
        key={product.jobID}
      >
        <div
          className="product-grid-item"
          style={{
            border: "1px solid #f0ebeb",
            borderRadius: "8px",
            padding: "0.5em",

            width: isMobile ? "100%" : "",
          }}
        >
          <div
            className="new-Card-style"
            style={{
              borderRadius: "8px",
            }}
          >
            <Grid container spacing={1}>
              {/* This component renders a job card displaying information about the job, including the approver, job name, priority, and status.
    It uses Material-UI Grid, Tooltip, Avatar, Typography, and Chip components for layout and styling. */}

              <Grid
                container
                direction="column" // Arrange child components in a column
                justifyContent="center" // Center child components vertically
                alignItems="center" // Center child components horizontally
                item
                xs={2} // Take up 2 columns in the grid layout
              >
                {/* Tooltip to show the approver's name on hover */}
                <MuiTooltip title={product?.approver} placement="top">
                  <MuiAvatar
                    style={{
                      backgroundColor: "#2196F3", // Set avatar background color
                      color: "#ffffff", // Set avatar text color
                      width: 32, // Set avatar width
                      height: 32, // Set avatar height
                      fontSize: "1.05rem", // Set font size for initials
                    }}
                    shape="circle" // Ensure the avatar is circular
                  >
                    {getInitials(product?.approver)}{" "}
                    {/* Display initials of the approver*/}
                  </MuiAvatar>
                </MuiTooltip>
              </Grid>

              <Grid item xs={10}>
                {" "}
                {/* Take up 10 columns in the grid layout */}
                <Grid
                  container
                  sx={{
                    background: "#f5f5f5", // Set background color
                    borderRadius: "2rem", // Round corners of the container
                    margin: "0.5rem 0.5rem 0.5rem 0rem", // Set margin
                    padding: "0.5rem", // Set padding
                  }}
                >
                  <Grid
                    container
                    direction="row" // Arrange child components in a row
                    justifyContent="space-between" // Space out child components
                    alignItems="center" // Align child components vertically
                    xs={6} // Take up 6 columns in the grid layout
                  >
                    <div
                      style={{
                        display: "flex", // Use flexbox layout
                        alignItems: "center", // Center items vertically
                        marginLeft: "0.5rem", // Set left margin
                        columnGap: "0.5rem", // Set gap between columns
                      }}
                    >
                      {/* Display priority icon based on the job priority */}
                      <MuiTooltip title={product.priority} placement="top">
                        <CircleIcon
                          fontSize="14px" // Set icon font size
                          color={getpriorityColor(product.priority)} // Get color based on priority
                        />
                      </MuiTooltip>
                      {/* Tooltip to show the job ID on hover */}
                      <MuiTooltip title={product.jobID} placement="top">
                        <Typography
                          sx={{
                            fontWeight: "600", // Set font weight
                            fontSize: "0.8rem", // Set font size
                            width: "auto", // Set width for the job name
                          }}
                        >
                          {product.jobName} {/* Display job name */}
                        </Typography>
                      </MuiTooltip>
                    </div>
                  </Grid>
                  <Grid
                    container
                    xs={6}
                    direction="column" // Arrange child components in a column
                    justifyContent="center" // Center child components vertically
                    alignItems="center" // Center child components horizontally
                  >
                    {" "}
                    {/*Take up 6 columns in the grid layout*/}
                    <div
                      style={{
                        display: "flex", // Use flexbox layout
                        justifyContent: "flex-end", // Align items to the end of the container
                        marginRight: "0.5rem", // Set right margin
                      }}
                    >
                      {
                        // Tooltip to show job status on hover
                        <MuiTooltip title={product.jobStatus} placement="top">
                          <Chip
                            label={`${differenceMessage}`} // Display duration difference message
                            size="small" // Set chip size
                            color={
                              // Set chip color based on job status
                              status === "ontime"
                                ? "success" // Color for on-time status
                                : status === "early"
                                ? "info" // Color for early status
                                : status === "late" //|| "Rejected"
                                ? "error" // Color for late status
                                : status === "Not Started"
                                ? "info" // Color for not started status
                                : status === "Started"
                                ? "success"
                                : status === "Rejected"
                                ? "error"
                                : "warning" // Default color for other statuses
                            }
                            icon={
                              // Set chip icon based on job status
                              status === "ontime" ? (
                                <ScheduleIcon /> // Icon for on-time status
                              ) : status === "early" ? (
                                <HistoryIcon /> // Icon for early status
                              ) : status === "late" ? (
                                <TimerOffOutlinedIcon /> // Icon for late status
                              ) : status === "Not Started" ? (
                                <NotStartedOutlinedIcon /> // Icon for not started status
                              ) : status === "Started" ? (
                                <PlayCircleOutlineIcon /> // Icon for started status
                              ) : status === "Rejected" ? (
                                <DangerousIcon /> // Icon for rejected status
                              ) : (
                                "" // Default if no status matches
                              )
                            }
                          />
                        </MuiTooltip>
                      }
                    </div>
                  </Grid>
                </Grid>
              </Grid>

              {/* This component displays job-related information, including a carousel of activities and a summary of job details.
 It uses Material-UI Grid, Carousel, and Typography components for layout and styling. */}

              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                {" "}
                {/* Take up 6 columns in the grid layout*/}
                <div
                  style={{
                    background: "#f5f5f5", // Set background color for the activity carousel
                    borderRadius: "0.5rem", // Round corners of the carousel
                    boxShadow:
                      "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)", // Set shadow for depth
                  }}
                >
                  <Carousel
                    value={
                      product.task // Check if the product has a task
                        ? [...product.task.activityList].sort((a, b) => {
                            // Sort activity list based on activity status and sequence
                            if (
                              a.actvityStatus === "Started" &&
                              b.actvityStatus !== "Started"
                            ) {
                              return -1; // 'a' comes first if it's started
                            } else if (
                              a.actvityStatus !== "Started" &&
                              b.actvityStatus === "Started"
                            ) {
                              return 1; // 'b' comes first if it's started
                            }
                            return a.sequence - b.sequence; // Sorting by sequence for other cases
                          })
                        : [] // Default to an empty array if no task is present
                    }
                    itemTemplate={activityTemplate} // Template for rendering each item in the carousel
                    numVisible={1} // Show one item at a time
                    numScroll={1} // Scroll one item at a time
                    showIndicators={false} // Hide carousel indicators
                    verticalViewPortHeight="345px" // Set vertical height of the viewport
                    orientation="vertical" // Set carousel orientation to vertical
                  />
                </div>
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                {" "}
                {/* Take up 6 columns in the grid layout */}
                <div
                  style={{
                    background: "#f5f5f5", // Set background color for the job information box
                    borderRadius: "0.5rem", // Round corners of the box
                    marginTop: "0.4rem", // Set top margin
                    boxShadow:
                      "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)", // Set shadow for depth
                  }}
                >
                  <div
                    style={{
                      borderRadius: "0.5rem", // Round corners of the inner container
                      boxShadow: "1", // Set shadow for depth
                    }}
                  >
                    <Grid container spacing={1}>
                      {" "}
                      {/* Container for job information */}
                      <Grid item xs={12} className="activity-header">
                        {" "}
                        {/* Header for job information */}
                        <div
                          style={{
                            display: "flex", // Use flexbox for layout
                            alignItems: "center", // Center items vertically
                            marginTop: "1.6rem", // Set top margin
                            columnGap: "0.5rem", // Set gap between columns
                            justifyContent: "center", // Center items horizontally
                            borderBottom: "1px solid #bcaeae", // Set bottom border
                            borderTop: "1px solid #d6d4d4", // Set top border
                            background: "#e2e1e1", // Set background color
                            padding: "0.85rem", // Set padding
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: "600", // Set font weight
                              fontSize: "0.8rem", // Set font size
                              textAlign: "center", // Center text
                            }}
                          >
                            Job Information {/*Job Information Title */}
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        {" "}
                        {/* Main content area for job details */}
                        <Grid container spacing={1}>
                          {" "}
                          {/* Container for job details*/}
                          <Grid container xs={12}>
                            {" "}
                            {/* Container for Start Time*/}
                            <Grid
                              justifyContent="center"
                              alignItems="center"
                              container
                              xs={12}
                              sx={{
                                background: "#eeeeee", // Set background color
                                marginLeft: "0.5rem", // Set left margin
                                marginBottom: "0.5rem", // Set bottom margin
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "0.75rem", // Set font size
                                  margin: "0.2rem 0", // Set margin
                                  fontWeight: "600", // Set font weight
                                }}
                              >
                                Start Time {/* Label for Start Time */}
                              </Typography>
                            </Grid>
                            {/* Expected Start Time */}
                            <Grid
                              container
                              direction="row"
                              justifyContent="center"
                              alignItems="center"
                              xs={6}
                              sx={{
                                paddingBottom: "0.5rem", // Set bottom padding
                                borderRight: "1px solid #e5e7eb", // Set right border
                              }}
                            >
                              <Typography
                                sx={{ fontSize: "0.75rem", fontWeight: "500" }} // Typography for label
                              >
                                Expected {/* Expected label */}
                              </Typography>
                            </Grid>
                            <Grid
                              container
                              direction="row"
                              justifyContent="center"
                              alignItems="center"
                              xs={6}
                              sx={{ paddingBottom: "0.5rem" }} // Bottom padding for the value
                            >
                              <Typography
                                textAlign="center" // Center text
                                sx={{ fontSize: "0.75rem" }} // Typography for expected time value
                              >
                                {formatDateTime(product.scheduledJobStartTime)}{" "}
                                {/* Display formatted expected start time */}
                              </Typography>
                            </Grid>
                            {/* Actual Start Time */}
                            <Grid
                              container
                              direction="row"
                              justifyContent="center"
                              alignItems="center"
                              xs={6}
                              sx={{
                                paddingBottom: "0.5rem", // Set bottom padding
                                borderRight: "1px solid #e5e7eb", // Set right border
                              }}
                            >
                              <Typography
                                sx={{ fontSize: "0.75rem", fontWeight: "500" }} // Typography for label
                              >
                                Actual {/* Actual label */}
                              </Typography>
                            </Grid>
                            <Grid
                              container
                              direction="row"
                              justifyContent="center"
                              alignItems="center"
                              xs={6}
                              sx={{ marginBottom: "0.5rem" }} // Bottom margin for the value
                            >
                              <Typography
                                textAlign="center" // Center text
                                sx={{ fontSize: "0.75rem" }} // Typography for actual time value
                              >
                                {formatDateTime(product.actualJobStartTime)}{" "}
                                {/*Display formatted actual start time*/}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid container xs={12}>
                            {" "}
                            {/* Container for Duration */}
                            <Grid
                              justifyContent="center"
                              alignItems="center"
                              container
                              xs={12}
                              sx={{
                                background: "#eeeeee", // Set background color
                                marginLeft: "0.5rem", // Set left margin
                                marginBottom: "0.5rem", // Set bottom margin
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "0.75rem", // Set font size
                                  margin: "0.2rem 0", // Set margin
                                  fontWeight: "600", // Set font weight
                                }}
                              >
                                Duration {/* Label for duration */}
                              </Typography>
                            </Grid>
                            {/* Expected Duration */}
                            <Grid
                              container
                              direction="row"
                              justifyContent="center"
                              alignItems="center"
                              xs={6}
                              sx={{
                                paddingBottom: "0.5rem", // Set bottom padding
                                borderRight: "1px solid #e5e7eb", // Set right border
                              }}
                            >
                              <Typography
                                sx={{ fontSize: "0.75rem", fontWeight: "500" }} // Typography for label
                              >
                                Expected {/* Expected label */}
                              </Typography>
                            </Grid>
                            <Grid
                              container
                              direction="row"
                              justifyContent="center"
                              alignItems="center"
                              xs={6}
                              sx={{ paddingBottom: "0.5rem" }} // Bottom padding for the value
                            >
                              <Typography
                                textAlign="center" // Center text
                                sx={{ fontSize: "0.75rem" }} // Typography for expected duration value
                              >
                                {product.scheduledJobStartTime === null
                                  ? "----" // Display placeholder if start time is null
                                  : formatDuration(scheduledDuration)}{" "}
                                {/* Display formatted expected duration */}
                              </Typography>
                            </Grid>
                            {/* Actual Duration */}
                            <Grid
                              container
                              direction="row"
                              justifyContent="center"
                              alignItems="center"
                              xs={6}
                              sx={{
                                paddingBottom: "0.5rem", // Set bottom padding
                                borderRight: "1px solid #e5e7eb", // Set right border
                              }}
                            >
                              <Typography
                                sx={{ fontSize: "0.75rem", fontWeight: "500" }} // Typography for label
                              >
                                Actual {/* Actual label */}
                              </Typography>
                            </Grid>
                            <Grid
                              container
                              direction="row"
                              justifyContent="center"
                              alignItems="center"
                              xs={6}
                              sx={{ marginBottom: "0.5rem" }} // Bottom margin for the value
                            >
                              <Typography
                                textAlign="center" // Center text
                                sx={{ fontSize: "0.75rem" }} // Typography for actual duration value
                              >
                                {product.actualJobEndTime === null
                                  ? "----" // Display placeholder if end time is null
                                  : formatDuration(actualDuration)}{" "}
                                {/* Display formatted actual duration */}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          direction="column"
                          justifyContent="center"
                          alignItems="center"
                          xs={12} // Full width for the gauge section
                        >
                          <div
                            style={{
                              position: "relative", // Set position relative for child elements
                              width: isMobile ? "85px" : "122px", // Set width based on device
                              height: isMobile ? "85px" : "122px", // Set height based on device
                              marginLeft: "3rem", // Set left margin
                              marginTop: "0.2rem", // Set top margin
                            }}
                          >
                            {/* Gauge for past activities percentage */}
                            <div
                              style={{
                                position: "absolute", // Absolute positioning for overlay
                                top: "0", // Align to top
                                left: "0", // Align to left
                                zIndex: 2, // Set stacking order
                              }}
                            >
                              <Gauge
                                width={isMobile ? 80 : 122} // Set width based on device
                                height={isMobile ? 80 : 122} // Set height based on device
                                innerRadius="90%" // Set inner radius for the gauge
                                value={pastActivitiesPercent} // Display past activities percentage
                                startAngle={0} // Start angle for gauge
                                endAngle={180} // End angle for gauge
                                sx={(theme) => ({
                                  [`& .${gaugeClasses.valueArc}`]: {
                                    fill: "#ff5722", // Color for past activities gauge
                                  },
                                  "& .MuiGauge-valueText": {
                                    display: "none", // Hide value text
                                  },
                                })}
                              />
                            </div>

                            {/* Gauge for completed percentage */}
                            <div
                              style={{
                                position: "absolute", // Absolute positioning for overlay
                                top: isMobile ? "13px" : "19px", // Adjust top position based on device
                                left: isMobile ? "7px" : "10px", // Adjust left position based on device
                                zIndex: 2, // Set stacking order
                              }}
                            >
                              <Gauge
                                width={isMobile ? 55 : 85} // Set width based on device
                                height={isMobile ? 55 : 85} // Set height based on device
                                innerRadius="90%" // Set inner radius for the gauge
                                value={completedPercent} // Display completed percentage
                                startAngle={0} // Start angle for gauge
                                endAngle={180} // End angle for gauge
                                sx={(theme) => ({
                                  [`& .${gaugeClasses.valueArc}`]: {
                                    fill: "#40c4ff", // Color for completed gauge
                                  },
                                  "& .MuiGauge-valueText": {
                                    display: "none", // Hide value text
                                  },
                                })}
                              />
                            </div>

                            {/* Displaying the comparison of completed vs past activities */}
                            <div
                              style={{
                                position: "absolute", // Absolute positioning for overlay
                                top: isMobile ? "34px" : "54px", // Adjust top position based on device
                                left: isMobile ? "-10px" : "0px", // Adjust left position based on device
                                zIndex: 2, // Set stacking order
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "0.7rem", // Set font size for the comparison
                                  marginBottom: "0.5rem", // Set bottom margin
                                }}
                              >
                                {completedPercent} vs {pastActivitiesPercent}{" "}
                                {/*Display comparison*/}
                              </Typography>
                            </div>
                          </div>

                          <Typography
                            sx={{ fontSize: "0.75rem", margin: "0.52rem 0" }} // Typography for the Actual vs Plan label
                          >
                            Actual vs Plan {/* Label for Actual vs Plan*/}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    );
  };

  // This function returns a template for displaying a product item based on the specified layout.
  // It accepts a product object and determines the appropriate template to use (list or grid).
  const itemTemplate = (product) => {
    // Check if the product is not defined; if so, return nothing.
    if (!product) {
      return; // Early exit if no product is provided
    }

    // Determine the layout type and return the corresponding item template.
    if (layout === "list") {
      // If the layout is "list", return the list item template for the product.
      return listItem(product);
    } else if (layout === "grid") {
      // If the layout is "grid", return the grid item template for the product.
      return gridItem(product);
    }
  };

  // This functional component renders a card containing a panel that displays a DataView of products.
  // It includes a header, layout options, and a dialog for viewing selected activities.
  return (
    <div className="card">
      {/* Panel component to wrap the DataView */}
      <Panel
        style={{ padding: "0" }} // Set padding to zero for the panel
        className="col-12 panelContant" // Custom CSS class for styling
        header={<div>{header === " " ? "Self Assigned Job" : header}</div>} // Conditional header display
        toggleable // Enables toggling of the panel
      >
        {/* DataView component to display products in a specified layout */}
        <DataView
          style={{
            borderLeft: "1px solid #ccc", // Left border styling
            borderRight: "1px solid #ccc", // Right border styling
            padding: "0", // No padding for the DataView
          }}
          value={products} // The data source for the DataView
          layout={layout} // The layout type (list or grid)
          itemTemplate={itemTemplate} // Template for rendering individual items
          header={
            // Header for the DataView
            <div
              style={{
                display: "flex", // Flexbox layout for header
                justifyContent: "space-between", // Space between header elements
                alignItems: "center", // Center align items vertically
              }}
            >
              <>
                {/* Chip components for priority levels */}
                <div className="card flex flex-wrap gap-2 ml-1">
                  <Chip
                    label="Low" // Chip label
                    color="info" // Chip color
                    variant="outlined" // Outlined variant of the chip
                    size="small" // Small chip size
                    icon={<CircleIcon />} // Icon for the chip
                  />
                  <Chip
                    label="Normal" // Chip label
                    color="success" // Chip color
                    variant="outlined" // Outlined variant of the chip
                    size="small" // Small chip size
                    icon={<CircleIcon />} // Icon for the chip
                  />
                  <Chip
                    label="Critical" // Chip label
                    color="error" // Chip color
                    variant="outlined" // Outlined variant of the chip
                    size="small" // Small chip size
                    icon={<CircleIcon />} // Icon for the chip
                  />
                </div>
              </>

              {/* Conditional rendering for mobile layout */}
              {isMobile ? (
                <>
                  <div className="flex justify-content-end">
                    {/* Icon for changing layout on mobile */}
                    <i
                      className="pi pi-th-large" // PrimeIcons class for the icon
                      style={{
                        fontSize: "1rem", // Font size for the icon
                        marginRight: "1rem", // Right margin
                        background: "#0288d1", // Background color
                        padding: "0.3rem", // Padding for the icon
                        color: "white", // Text color
                        borderRadius: "5px", // Rounded corners
                      }}
                    ></i>
                  </div>
                </>
              ) : (
                // DataView layout options for non-mobile layout
                <DataViewLayoutOptions
                  layout={layout} // Current layout state
                  onChange={(e) => setLayout(e.value)} // Update layout on change
                />
              )}
            </div>
          }
        />
      </Panel>

      {/* Dialog component for displaying additional information */}
      <Dialog
        visible={displayDialog} // Dialog visibility state
        onHide={() => setDisplayDialog(false)} // Close dialog handler
        maximizable // Allows the dialog to be maximized
        blockScroll // Prevents scrolling of the background when the dialog is open
      >
        <div>
          {/* Component for viewing job and activity details */}
          <LViewWithProps
            jobId={selectedActivity?.jobId} // Job ID passed as a prop
            activityId={selectedActivity?.activityId} // Activity ID passed as a prop
          ></LViewWithProps>
        </div>
      </Dialog>
    </div>
  );
}
