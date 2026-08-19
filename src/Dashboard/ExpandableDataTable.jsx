import {
  Avatar as MuiAvatar,
  Tooltip as MuiTooltip,
  Stack,
} from "@mui/material"; // Importing Material UI Avatar and Tooltip components
import { Avatar } from "primereact/avatar"; // Importing PrimeReact Avatar component
import { Button } from "primereact/button"; // Importing PrimeReact Button component
import { Column } from "primereact/column"; // Importing PrimeReact Column component (used in DataTable)
import { DataTable } from "primereact/datatable"; // Importing PrimeReact DataTable component
import { Dialog } from "primereact/dialog"; // Importing PrimeReact Dialog component
import { ProgressBar } from "primereact/progressbar"; // Importing PrimeReact ProgressBar component
import { Tag } from "primereact/tag"; // Importing PrimeReact Tag component
import { Tooltip } from "primereact/tooltip"; // Importing PrimeReact Tooltip component
import React, { useState } from "react"; // Importing React and useState hook for state management
import TransactionTable from "./TransactionTable"; // Importing custom TransactionTable component
import { Card, Chip, Typography } from "@mui/material"; // Importing Material UI components: Card, Chip, Typography
import LViewWithProps from "../Logbook/View/LViewWithProps"; // Importing custom LViewWithProps component from Logbook
import EllipsisText from "./EllipsisText"; // Importing custom EllipsisText component
import StopIcon from "@mui/icons-material/Stop";
import ActivityFlow from "../JobReviewer/ActivityFlow";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputText } from "primereact/inputtext";
// Objective: Defines the ExpandableDataTable component, managing expandable rows and status display in a DataTable
export default function ExpandableDataTable({ key, data, header, groupBy }) {
  const [expandedRows, setExpandedRows] = useState(null); // Manages the state for rows that are expanded in the DataTable
  const [selectedActivity, setSelectedActivity] = useState(null); // Manages the state for the currently selected activity
  const [displayDialog, setDisplayDialog] = useState(false); // Manages the state to control the visibility of the Dialog
  const [activityNameClick, setactivityNameClick] = useState(false); // Manages state to track if an activity name was clicked
  const [logbookClick, setLogbookClick] = useState(false); // Manages state to track if the logbook was clicked
  const [openrow, setOpenrow] = useState(null);
  const [openrowdialog, setOpenrowdialog] = useState(false); //State to  track which rows are open
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    jobName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    taskTemplate: { value: null, matchMode: FilterMatchMode.CONTAINS },
    assigner: { value: null, matchMode: FilterMatchMode.CONTAINS },
    scheduledJobStartTime: { value: null, matchMode: FilterMatchMode.CONTAINS },
    jobStatus: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const clearFilter = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      jobName: { value: null, matchMode: FilterMatchMode.CONTAINS },
      taskTemplate: { value: null, matchMode: FilterMatchMode.CONTAINS },
      assigner: { value: null, matchMode: FilterMatchMode.CONTAINS },
      scheduledJobStartTime: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      jobStatus: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue("");
  };
  const renderHeader = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>{header}</div>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <Button
            type="button"
            icon="pi pi-filter-slash"
            label="Clear"
            outlined
            size="small"
            onClick={clearFilter}
          />

          {/* Simple search input with icon inside */}
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Search..."
              style={{ paddingLeft: "2rem" }}
            />
          </span>
        </div>
      </div>
    );
  };
  const handleRowClick = (row) => {
    console.log("Handle row click", row);
    setOpenrow(row);
    setOpenrowdialog(true);
  };
  // Objective: Renders status icons with tooltips based on the activity status for each row in the DataTable
  const statusActivityBodyTemplate = (rowData) => {
    return (
      <>
        {rowData.actvityStatus === "Completed" ? ( // If the activity status is "Completed"
          <MuiTooltip title="Completed" placement="right">
            {" "}
            {/* Tooltip for the "Completed" status */}
            <Button
              icon="pi pi-check" // Check icon for completed status
              rounded // Button is rounded
              text // Text button style (no background color)
              raised // Raised button style
              style={{
                height: "2.2rem", // Button height
                width: "2.2rem", // Button width
                cursor: "default", // Default cursor (not clickable)
                boxShadow: "none", // No shadow on button
                background: "#e3f2fd", // Light blue background color
              }}
              aria-label="Filter" // Accessibility label for screen readers
            />
          </MuiTooltip>
        ) : rowData.actvityStatus === "Rejected" ? ( // If the activity status is "Rejected"
          <MuiTooltip title="Rejected" placement="right">
            {" "}
            {/* Tooltip for the "Rejected" status */}
            <Button
              icon="pi pi-times" // Cross icon for rejected status
              rounded
              text
              raised
              severity="danger" // Red color indicating danger/severity
              style={{
                height: "2.2rem",
                width: "2.2rem",
                cursor: "default",
                boxShadow: "none",
                background: "#fce4ec", // Light pink background for rejected status
              }}
            />
          </MuiTooltip>
        ) : rowData.actvityStatus === "Sent For Approval" ? ( // If the activity status is "Sent For Approval"
          <MuiTooltip title="Sent For Approval" placement="right">
            {" "}
            {/* Tooltip for the "Sent For Approval" status */}
            <Button
              icon="pi pi-send" // Send icon for approval
              rounded
              text
              raised
              severity="success" // Green color indicating success
              style={{
                height: "2.2rem",
                width: "2.2rem",
                cursor: "default",
                boxShadow: "none",
                background: "#e8f5e9", // Light green background for approval status
              }}
            />
          </MuiTooltip>
        ) : rowData.actvityStatus === "Started" ? ( // If the activity status is "Started"
          <MuiTooltip title="Started" placement="right">
            {" "}
            {/* Tooltip for the "Started" status */}
            <Button
              icon="pi pi-play" // Play icon for started status
              rounded
              text
              raised
              size="small" // Button size small for a compact look
              severity="help" // Blue color indicating progress/help
              style={{
                height: "2.2rem",
                width: "2.2rem",
                cursor: "default",
                boxShadow: "none",
                background: "#ede7f6", // Light purple background for started status
              }}
            />
          </MuiTooltip>
        ) : rowData.actvityStatus === "Review Started" ? ( // If the activity status is "Review Started"
          <MuiTooltip title="Review Started" placement="right">
            {" "}
            {/* Tooltip for the "Review Started" status */}
            <Button
              icon="pi pi-file-check" // File-check icon for review status
              rounded
              text
              raised
              severity="secondary" // Gray color indicating review/neutral state
              style={{
                height: "2.2rem",
                width: "2.2rem",
                cursor: "default",
                boxShadow: "none",
                background: "#e0e0e0", // Gray background for review started
              }}
            />
          </MuiTooltip>
        ) : rowData.actvityStatus === "Not Started" ? ( // If the activity status is "Not Started"
          <MuiTooltip title="Not Started" placement="right">
            {" "}
            {/* Tooltip for the "Not Started" status */}
            <Button
              icon="pi pi-stopwatch" // Stopwatch icon for not started status
              rounded
              text
              raised
              severity="secondary" // Gray color indicating neutral state
              style={{
                height: "2.2rem",
                width: "2.2rem",
                cursor: "default",
                boxShadow: "none",
                background: "#e0e0e0", // Gray background for not started
              }}
            />
          </MuiTooltip>
        ) : rowData.actvityStatus === "Aborted" ? ( // If the activity status is "Not Started"
          <MuiTooltip title="Aborted" placement="right">
            <Button
              icon="pi pi-ban"
              rounded
              text
              raised
              severity="danger"
              style={{
                height: "2.2rem",
                width: "2.2rem",
                cursor: "default",
                boxShadow: "none",
                background: "#fce4ec",
              }}
            />
          </MuiTooltip>
        ) : (
          "" // If no recognized status, render nothing
        )}
      </>
    );
  };

  const activityNameBodyTemplate = (jobID) => (rowData) => {
    // Objective: Renders a chip component with an activity name and an icon based on the activity status
    return (
      <Chip
        disabled={
          rowData.actvityStatus.toLowerCase() === "Not Started".toLowerCase() ||
          rowData.actvityStatus.toLowerCase() === "Started".toLowerCase()
        } // Disable chip if the activity status is "Not Started" or "Started"
        style={{ cursor: "pointer" }} // Add pointer cursor for better UX
        onClick={() => onActivityNameClick(rowData, jobID)} // Trigger function when chip is clicked
        icon={
          rowData.actvityStatus === "Started" ? (
            <i
              className="pi pi-spin pi-spinner"
              style={{ fontSize: "0.8rem" }}
            ></i> // Show a spinner icon if the activity is "Started"
          ) : rowData.actvityStatus === "Completed" ? (
            <i className="pi pi-check" style={{ fontSize: "0.8rem" }}></i> // Show a checkmark if the activity is "Completed"
          ) : (
            ""
          )
        }
        size="small" // Set chip size to small
        label={rowData.activityName} // Set chip label to the activity name
      />
    );
  };

  const isYearLessThan2000 = (datetime) => {
    // Objective: Checks if the provided datetime is before the year 2000
    const year = new Date(datetime).getFullYear();
    return year < 2000; // Return true if year is less than 2000, else false
  };

  function formatDateTime(startTime) {
    // Objective: Formats a given datetime string into a readable date and time format
    const d = isYearLessThan2000(startTime); // Check if year is less than 2000
    if (d) {
      return "----"; // Return placeholder if the year is before 2000
    }
    if (!startTime) {
      return "---"; // Return placeholder if no start time is provided
    }

    let startDate;

    if (startTime.includes("T")) {
      startDate = new Date(startTime); // If the datetime includes "T", treat it as ISO format
    } else {
      // If not ISO format, parse custom format "dd/MM/yyyy hh:mm:ss"
      const [datePart, timePart] = startTime.split(" ");
      const [day, month, year] = datePart.split("/").map(Number);
      const [hours, minutes, seconds] = timePart.split(":").map(Number);
      startDate = new Date(year, month - 1, day, hours, minutes, seconds); // Create new Date object from parsed values
    }

    const optionsTime = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Format time as 12-hour with AM/PM
    };

    const getShortYear = (date) => date.getFullYear().toString().slice(-2); // Extract last two digits of the year

    const formattedDate = `${startDate.getDate()} ${new Intl.DateTimeFormat(
      "en-US",
      { month: "short" },
    ).format(startDate)} ${getShortYear(startDate)}`; // Format date as "dd MMM yy"

    const formattedTime = new Intl.DateTimeFormat("en-US", optionsTime).format(
      startDate,
    ); // Format time as "hh:mm AM/PM"

    return `${formattedDate} ${formattedTime}`; // Combine formatted date and time
  }

  const logbookBodyTemplate = (jobID) => (rowData) => {
    // Objective: Renders a chip for the logbook, or a placeholder if no logbook is available
    return (
      <>
        {rowData?.logbook !== null &&
        rowData?.logbook !== undefined &&
        rowData?.logbook !== " " &&
        rowData?.logbook !== "" ? ( // Check if logbook data is not null, undefined, or an empty string
          <Chip
            size="small" // Set chip size to small
            style={{ cursor: "pointer" }} // Add pointer cursor for better UX
            disabled={
              rowData.actvityStatus.toLowerCase() ===
                "Not Started".toLowerCase() ||
              rowData.actvityStatus.toLowerCase() === "Started".toLowerCase()
            } // Disable chip if activity status is "Not Started" or "Started"
            variant="outlined" // Set chip to outlined style
            color="info" // Set chip color to info (blue)
            onClick={() => onLogbookClick(rowData, jobID)} // Trigger logbook click function on chip click
            label={rowData.logbook} // Set chip label to the logbook name
          />
        ) : (
          "----" // Return placeholder if no logbook data is available
        )}
      </>
    );
  };
  const getInitialsFromEmail = (email) => {
    if (!email) return "";

    const namePart = email.split("@")[0];
    const parts = namePart.split(/[._-]/);

    return parts
      .filter(Boolean)
      .map((p) => p.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  const PerformerAndApprover = (rowData) => {
    // console.log("Rowdata PerformerAndApprover : ", rowData);
    // console.log("performer : ", rowData.performer);
    // console.log("approver : ", rowData.approver);
    // console.log(
    //   "Get Initials Performer : ",
    //   getInitialsFromEmail(rowData.performer),
    // );
    // console.log(
    //   "Get Initials Approver : ",
    //   getInitialsFromEmail(rowData.approver),
    // );
    if (!rowData) return null;

    return (
      <Stack direction="row" spacing={1} justifyContent={"center"}>
        {rowData.performer && (
          <MuiTooltip title={`Performer: ${rowData.performer}`} arrow>
            <MuiAvatar
              sx={{ width: 30, height: 30, fontSize: 13, bgcolor: "#1976d2" }}
            >
              {getInitialsFromEmail(rowData.performer)}
            </MuiAvatar>
          </MuiTooltip>
        )}

        {rowData.approver && (
          <MuiTooltip title={`Approver: ${rowData.approver}`} arrow>
            <MuiAvatar
              sx={{ width: 30, height: 30, fontSize: 13, bgcolor: "#2e7d32" }}
            >
              {getInitialsFromEmail(rowData.approver)}
            </MuiAvatar>
          </MuiTooltip>
        )}
      </Stack>
    );
  };

  const ScheduleStatAndStopTime = (rowData) => {
    // Objective: Displays scheduled start and end times for an activity
    return (
      <>
        <p style={{ margin: "0 0 4px 0", padding: 0 }}>
          {formatDateTime(rowData.scheduledActivityStartTime)}{" "}
          {/* Format and display the scheduled start time */}
        </p>
        <p style={{ margin: 0, padding: 0 }}>
          {formatDateTime(rowData.scheduledActivityEndTime)}{" "}
          {/* Format and display the scheduled end time */}
        </p>
      </>
    );
  };

  const activityStatAndStopTime = (rowData) => {
    // Objective: Displays actual start and end times for an activity
    return (
      <>
        <p style={{ margin: "0 0 4px 0", padding: 0 }}>
          {formatDateTime(rowData.actualActivityStartTime)}{" "}
          {/* Format and display the actual start time */}
        </p>
        <p style={{ margin: 0, padding: 0 }}>
          {formatDateTime(rowData.actualActivityEndTime)}{" "}
          {/* Format and display the actual end time */}
        </p>
      </>
    );
  };

  // Objective: Render the expansion template for a row in the DataTable, displaying detailed information about activities in a card layout
  const rowExpansionTemplate = (rowData, jobID) => {
    console.log("Row data from expnasion : ", rowData);
    return (
      <Card>
        <DataTable
          className="HeaderColorExpandable" // Custom class for header color
          stripedRows // Enable striped rows for better readability
          value={rowData.activityList} // Use the activity list from row data
        >
          <Column field="sequence" header="Sequence" /> {/* Sequence column */}
          <Column
            field="activityName"
            header="Activity Name"
            body={activityNameBodyTemplate(jobID)} // Custom body template for activity name
          />
          <Column
            field="logbook"
            header="Logbook"
            body={logbookBodyTemplate(jobID)} // Custom body template for logbook
          />
          <Column
            header="Performer vs Approver"
            body={PerformerAndApprover} // Custom body template for scheduled start and stop times
            headerStyle={{ textAlign: "center" }}
            bodyStyle={{ textAlign: "center" }}
          />
          <Column
            field="assetName"
            header="Assets"
            body={assetsBodyTemplateTest} // Custom body template for assets
          />
          <Column
            field="scheduledActivityStartTime"
            header="Schedule Start Time vs Stop Time"
            body={ScheduleStatAndStopTime} // Custom body template for scheduled start and stop times
          />
          <Column
            field="actualActivityStartTime"
            header="Activity Start Time vs Stop Time"
            body={activityStatAndStopTime} // Custom body template for actual start and stop times
          />
          <Column
            field="actvityStatus"
            header="Status"
            body={statusActivityBodyTemplate} // Custom body template for activity status
          />
        </DataTable>
      </Card>
    );
  };

  // Objective: Render the status button based on the job status with tooltips for additional information
  const statusBodyTemplate = (rowData) => {
    return (
      <>
        {rowData.jobStatus === "Completed" ? (
          <MuiTooltip title="Completed" placement="right">
            <Button
              icon="pi pi-check"
              rounded
              text
              raised
              style={{
                height: "2.2rem",
                width: "2.2rem",
                cursor: "default",
                boxShadow: "none",
                background: "#e3f2fd",
              }}
              aria-label="Filter"
            />
          </MuiTooltip>
        ) : rowData.jobStatus === "Rejected" ? (
          <MuiTooltip title="Rejected" placement="right">
            <Button
              icon="pi pi-times"
              rounded
              text
              raised
              severity="danger"
              style={{
                height: "2.2rem",
                width: "2.2rem",
                cursor: "default",
                boxShadow: "none",
                background: "#fce4ec",
              }}
            />
          </MuiTooltip>
        ) : rowData.jobStatus === "Sent For Approval" ? (
          <MuiTooltip title="Sent For Approval" placement="right">
            <Button
              icon="pi pi-send"
              rounded
              text
              raised
              severity="success"
              style={{
                height: "2.2rem",
                width: "2.2rem",
                cursor: "default",
                boxShadow: "none",
                background: "#e8f5e9",
              }}
            />
          </MuiTooltip>
        ) : rowData.jobStatus === "Started" ? (
          <MuiTooltip title="Started" placement="right">
            <Button
              icon="pi pi-play"
              rounded
              text
              raised
              size="small"
              severity="help"
              style={{
                height: "2.2rem",
                width: "2.2rem",
                cursor: "default",
                boxShadow: "none",
                background: "#ede7f6",
              }}
            />
          </MuiTooltip>
        ) : rowData.jobStatus === "Review Started" ? (
          <MuiTooltip title="Review Started" placement="right">
            <Button
              icon="pi pi-file-check"
              rounded
              text
              raised
              severity="secondary"
              style={{
                height: "2.2rem",
                width: "2.2rem",
                cursor: "default",
                boxShadow: "none",
                background: "#e0e0e0",
              }}
            />
          </MuiTooltip>
        ) : rowData.jobStatus === "Not Started" ? (
          <MuiTooltip title="Not Started" placement="right">
            <Button
              icon="pi pi-stopwatch"
              rounded
              text
              raised
              severity="secondary"
              style={{
                height: "2.2rem",
                width: "2.2rem",
                cursor: "default",
                boxShadow: "none",
                background: "#e0e0e0",
              }}
            />
          </MuiTooltip>
        ) : rowData.jobStatus === "Review Started" ? (
          <MuiTooltip title="Review Started" placement="right">
            <Button
              icon="pi pi-file-check"
              rounded
              text
              raised
              severity="secondary"
              style={{
                height: "2.2rem",
                width: "2.2rem",
                cursor: "default",
                boxShadow: "none",
                background: "#e0e0e0",
              }}
            />
          </MuiTooltip>
        ) : rowData.jobStatus === "Approved" ? (
          <MuiTooltip title="Approved" placement="right">
            <Button
              icon="pi pi-check-square"
              rounded
              text
              raised
              severity="secondary"
              style={{
                height: "2.2rem",
                width: "2.2rem",
                cursor: "default",
                boxShadow: "none",
                background: "#e0e0e0",
              }}
            />
          </MuiTooltip>
        ) : rowData.jobStatus === "Aborted" ? (
          <MuiTooltip title="Aborted" placement="right">
            <Button
              icon="pi pi-ban"
              rounded
              text
              raised
              severity="danger"
              style={{
                height: "2.2rem",
                width: "2.2rem",
                cursor: "default",
                boxShadow: "none",
                background: "#fce4ec",
              }}
            />
          </MuiTooltip>
        ) : (
          ""
        )}
      </>
    );
  };

  // Objective: Render a progress bar showing the current progress of a job
  const progressBodyTemplate = (rowData) => {
    const activityList = rowData.activityList;
    const progress = () => {
      return Math.ceil(
        (activityList.filter(
          (activity) => activity.actvityStatus === "Completed",
        ).length *
          100) /
          activityList.length,
      );
    };
    console.log("Progress first ", rowData.jobName, progress());
    return (
      <ProgressBar
        value={progress() ? progress() : 0}
        style={{ borderRadius: "20px", height: "1rem" }} // Custom style for the progress bar
        showValue={true} // Display the progress value
      />
    );
  };

  // Objective: Display the actual start and stop times of a job in a formatted manner
  const jobStartandStoptime = (rowData) => {
    return (
      <>
        <p style={{ margin: "0 0 4px 0", padding: 0 }}>
          {formatDateTime(rowData.actualJobStartTime)}{" "}
          {/* Format and display the start time */}
        </p>
        <p style={{ margin: 0, padding: 0 }}>
          {formatDateTime(rowData.actualJobEndTime)}{" "}
          {/* Format and display the stop time */}
        </p>{" "}
      </>
    );
  };

  const AssignerTemplate = (rowData) => {
    // console.log("Rowdata PerformerAndApprover : ", rowData);
    // console.log("performer : ", rowData.performer);
    // console.log("approver : ", rowData.approver);
    // console.log(
    //   "Get Initials Performer : ",
    //   getInitialsFromEmail(rowData.performer),
    // );
    // console.log(
    //   "Get Initials Approver : ",
    //   getInitialsFromEmail(rowData.approver),
    // );
    if (!rowData) return null;

    return (
      <Stack direction="row" spacing={1} justifyContent={"center"}>
        {rowData.approver && (
          <MuiTooltip title={`${rowData.assigner}`} arrow>
            <MuiAvatar
              sx={{ width: 30, height: 30, fontSize: 13, bgcolor: "#2e7d32" }}
            >
              {getInitialsFromEmail(rowData.assigner)}
            </MuiAvatar>
          </MuiTooltip>
        )}
      </Stack>
    );
  };

  // Objective: Render the assets information with a tooltip for the asset name
  const assetsBodyTemplateTest = (rowData) => {
    return (
      <>
        {rowData.assetName === null ||
        rowData.assetName === undefined ||
        rowData.assetName === "" ? ( // Check if assetName is null or undefined
          "----" // Display placeholder if assetName is not available
        ) : (
          <MuiTooltip title={rowData.assetName} placement="bottom">
            {" "}
            {/* Tooltip to show the full asset name */}
            <span
              style={{ fontWeight: "600" }} // Style to make the asset name bold
              className={`assets-tooltip-${rowData.activityId}`} // Dynamic class name for tooltip targeting
            >
              <EllipsisText
                text={rowData.assetName} // Component to truncate asset name with ellipsis
                maxWidth={"120px"} // Set maximum width for truncation
              ></EllipsisText>
            </span>
          </MuiTooltip>
        )}
      </>
    );
  };

  // Objective: Retrieve the currently started activity from the activity list
  function getCurrentStartedActivity(activityData) {
    return activityData.activityList?.find(
      // Find the first activity with status "Started"
      (activity) => activity.actvityStatus === "Started",
    );
  }

  // Objective: Render the current performer information and related details
  const currentPerformerBodyTemplate = (rowData) => {
    const currentActivity = getCurrentStartedActivity(rowData); // Get the current started activity

    // Extract initials from the performer's email address
    const initials = currentActivity?.performer
      ?.split("@")[0] // Split the email at "@" and take the first part (name)
      .split(".") // Split the name at "." to get individual name parts
      .map((name) => name.charAt(0).toUpperCase()) // Get the first character of each name part and convert to uppercase
      .join(""); // Join the initials into a single string

    return (
      <>
        <div
          style={{
            display: "flex", // Use flexbox for layout
            justifyContent: "center", // Center items horizontally
            alignContent: "center", // Center items vertically
            alignItems: "center", // Align items in the center of the flex container
            columnGap: "0.25rem", // Add space between columns
          }}
        >
          <div className="current-performer-avatar-container">
            {" "}
            {/* Container for the performer's avatar */}
            <Tooltip
              target={`.current-performer-avatar-${rowData.jobID}`} // Target the avatar for tooltip
              position="bottom" // Position of the tooltip
            >
              {currentActivity?.performer} {/* Display the performer's name */}
            </Tooltip>
            {currentActivity?.performer === null ||
            currentActivity?.performer === " " ||
            currentActivity?.performer === undefined ? ( // Check if performer is null, empty, or undefined
              "---- " // Display placeholder if performer is not available
            ) : (
              <Avatar
                shape="circle" // Avatar shape
                size="normal" // Avatar size
                label={initials ? initials : "NA"} // Display initials or "NA" if none
                className={`current-performer-avatar-${rowData.jobID}`} // Dynamic class name for targeting
                style={{
                  backgroundColor: "#04888d", // Background color for the avatar
                  color: "#ffffff", // Text color for initials
                  width: "30px", // Width of the avatar
                  height: "30px", // Height of the avatar
                  fontSize: "0.8rem", // Font size for initials
                }}
              />
            )}
          </div>
          <div>
            {currentActivity?.assetName === undefined ||
            currentActivity?.assetName === null ||
            currentActivity?.assetName === "" ? ( // Check if assetName is undefined
              " ---- " // Display placeholder if assetName is not available
            ) : (
              <>
                <Tooltip
                  target={`.assets-tooltip-${rowData.jobID}`} // Target the asset name for tooltip
                  position="bottom" // Position of the tooltip
                >
                  {currentActivity?.assetName}{" "}
                  {/* Display the asset name in tooltip */}
                </Tooltip>

                <span className={`assets-tooltip-${rowData.jobID}`}>
                  {" "}
                  {/* Span for the asset name with tooltip targeting */}
                  <EllipsisText
                    text={currentActivity?.assetName} // Component to truncate asset name with ellipsis
                    maxWidth={"80px"} // Set maximum width for truncation
                  ></EllipsisText>
                </span>
              </>
            )}
          </div>
          <div>
            {currentActivity?.activityName === null ||
            currentActivity?.activityName === " " ||
            currentActivity?.activityName === undefined ||
            currentActivity?.activityName === "Self Job" ? ( // Check if activityName is null, empty, or undefined
              " ----" // Display placeholder if activityName is not available
            ) : (
              <Chip size="small" label={currentActivity?.activityName} /> // Render a chip with the activity name
            )}
          </div>
        </div>
      </>
    );
  };

  // Objective: Handle the click event for the activity name
  const onActivityNameClick = (rowData, jobID) => {
    setactivityNameClick(true); // Set state to indicate that the activity name has been clicked
    setLogbookClick(false); // Reset the logbook click state
    setSelectedActivity({
      // Update the selected activity state with job and activity identifiers
      jobName: jobID,
      activityName: rowData.activityId,
    });
    setDisplayDialog(true); // Set state to display the dialog
  };

  // Objective: Handle the click event for the logbook
  const onLogbookClick = (rowData, jobID) => {
    setactivityNameClick(false); // Reset the activity name click state
    setLogbookClick(true); // Set state to indicate that the logbook has been clicked
    setSelectedActivity({
      // Update the selected activity state with job and activity identifiers
      jobName: jobID,
      activityName: rowData.activityId,
    });
    setDisplayDialog(true); // Set state to display the dialog
  };

  // Objective: Render the job name template with tooltip and chip
  const jobNameTemplate = (rowData) => {
    // Extract initials from the approver's email address
    const emailinitials = rowData.approver
      ?.split("@")[0] // Split the email at "@" and take the first part (name)
      .split(".") // Split the name at "." to get individual name parts
      .map((name) => name.charAt(0).toUpperCase()) // Get the first character of each name part and convert to uppercase
      .join(""); // Join the initials into a single string

    return (
      <div
        className="Test" // CSS class for styling
        style={{
          display: "flex", // Use flexbox for layout
          columnGap: "0.5rem", // Space between columns
          justifyContent: "center", // Center items horizontally
          alignItems: "center", // Center items vertically
        }}
      >
        {/* <div style={{ border: "1px solid #e0e0e0", marginTop: "1rem" }}>
          <ActivityFlow job={rowData}></ActivityFlow>
        </div> */}

        <Button
          onClick={() => handleRowClick(rowData)}
          icon="pi pi-eye"
          rounded
          text
          raised
          //size="small"
          style={{
            height: "2.2rem",
            width: "2.2rem",
            cursor: "pointer",
            boxShadow: "none",
            background: "#e3f2fd",
          }}
          aria-label="Filter"
        />
        <MuiTooltip // Tooltip to show additional information on hover
          title={
            // Content of the tooltip
            <>
              <Typography>Approver : {rowData.approver}</Typography>
              {/* Approver's email */}
              <Typography>Job Name : {rowData.jobName}</Typography>
              {/* Job name */}
              <Typography>Job Id : {rowData.jobID}</Typography>
              {/* Job ID */}
            </>
          }
          placement="top" // Tooltip position
        >
          <Chip // Material-UI chip component to display job name and priority
            color={
              // Set the color based on the job's priority
              rowData.priority === "Normal" // Check priority and set corresponding color
                ? "success" // Green for normal priority
                : rowData.priority === "Critical" // Check for critical priority
                  ? "error" // Red for critical priority
                  : rowData.priority === "Low" // Check for low priority
                    ? "warning" // Orange for low priority
                    : "default" // Default color for unrecognized priorities
            }
            label={
              // Label for the chip
              <EllipsisText // Component to truncate job name with ellipsis
                text={rowData.jobName} // Job name text
                maxWidth={"80px"} // Set maximum width for truncation
              ></EllipsisText>
            }
            avatar={
              // Avatar for the chip to show initials
              <MuiAvatar // Material-UI Avatar component
                sx={{
                  width: 35, // Width of the avatar
                  height: 35, // Height of the avatar
                  fontSize: "0.9rem", // Font size for initials
                  // Set background color based on priority
                  background:
                    rowData.priority === "Normal" // Check priority and set corresponding background color
                      ? "#2e7d32" // Dark green for normal
                      : rowData.priority === "Critical" // Check for critical priority
                        ? "#d32f2f" // Dark red for critical
                        : rowData.priority === "Low" // Check for low priority
                          ? "#ed6c02" // Orange for low
                          : "gray", // Gray for unrecognized priorities
                  color: "#ffff !important", // Text color for initials, with high specificity
                }}
              >
                {emailinitials ? emailinitials : "NA"}{" "}
                {/* Display initials or "NA" if none available */}
              </MuiAvatar>
            }
            variant="outlined" // Chip variant
            size="medium"
          />
        </MuiTooltip>
      </div>
    );
  };

  // Objective: Render the main component structure
  return (
    <>
      <Card>
        {" "}
        {/* Material-UI Card component for styling */}
        <DataTable
          removableSort
          header={renderHeader()}
          value={data}
          stripedRows
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          paginator
          rows={5}
          rowExpansionTemplate={(rowData) =>
            rowExpansionTemplate(rowData, rowData.jobID)
          }
          dataKey="jobID"
          className="dashboardDatatable HeaderColor primereactPaginatorStyle"
          /* ✅ Correct filter props */
          filters={filters}
          onFilter={(e) => setFilters(e.filters)}
          filterDisplay="row"
          globalFilterFields={[
            "jobName",
            "taskTemplate",
            "assigner",
            "scheduledJobStartTime",
            "jobStatus",
            "priority",
            "approver",
          ]}
          emptyMessage="No jobs found."
        >
          <Column expander /> {/* Column for the row expander icon */}
          <Column
            headerStyle={{ maxWidth: "12rem !important" }} // Style for the header cell to limit max width
            bodyStyle={{ maxWidth: "12rem" }} // Style for the body cell to limit max width
            field="jobName" // Field in the data corresponding to this column
            header="Job Name" // Header text for the column
            body={jobNameTemplate} // Template function to render the body content for this column
          />
          {groupBy === "Tag" && ( // Conditional rendering based on the grouping option
            <Column field="taskTemplate" header="Task Template" sortable /> // Column for task template, sortable
          )}
          <Column
            className="assigner" // CSS class for styling the column
            header="Assigner" // Header text for the column
            body={AssignerTemplate} // Template function to render job start and stop time content
          />
          <Column
            field="jobScheduleStartTime" // Field in the data corresponding to this column
            header="Assign Time" // Header text for the column
            body={(rowData) => formatDateTime(rowData.scheduledJobStartTime)} // Format and render job schedule start time
            sortable // Enable sorting for this column
          />
          <Column
            className="dateTimeSection" // CSS class for styling the column
            header="Job Start Time vs Stop Time" // Header text for the column
            body={jobStartandStoptime} // Template function to render job start and stop time content
          />
          <Column
            field="progress" // Field in the data corresponding to this column
            header="Progress" // Header text for the column
            body={progressBodyTemplate} // Template function to render progress content
          />
          <Column
            field="currentPerformer" // Field in the data corresponding to this column
            header="Current Performer / Activity /Asset" // Header text for the column
            body={currentPerformerBodyTemplate} // Template function to render current performer information
          />
          <Column
            field="jobstatus" // Field in the data corresponding to this column
            header="Job Status" // Header text for the column
            body={statusBodyTemplate} // Template function to render job status
          />
        </DataTable>
        <Dialog
          visible={displayDialog} // Control visibility of the dialog based on state
          onHide={() => setDisplayDialog(false)} // Function to execute when the dialog is hidden
          maximizable // Allow the dialog to be maximized
          blockScroll // Prevent background scrolling when the dialog is open
        >
          <div>
            <center>
              {" "}
              {/* Center the content of the dialog */}
              {activityNameClick && ( // Conditionally render based on activity name click state
                <TransactionTable
                  jobId={selectedActivity?.jobName} // Pass jobID from selected activity
                  activityId={selectedActivity?.activityName} // Pass activityId from selected activity
                />
              )}
              {logbookClick && ( // Conditionally render based on logbook click state
                <LViewWithProps
                  jobId={selectedActivity?.jobName} // Pass jobID from selected activity
                  activityId={selectedActivity?.activityName} // Pass activityId from selected activity
                ></LViewWithProps>
              )}
            </center>
          </div>
        </Dialog>
        <Dialog
          header={openrow?.jobName} // Set the header of the dialog to the job name of the selected row
          visible={openrowdialog}
          // maximizable
          style={{ width: "75vw", height: "75vh" }}
          onHide={() => {
            if (!openrowdialog) return;
            setOpenrowdialog(false);
          }}
        >
          <div style={{ border: "1px solid #e0e0e0", marginTop: "1rem" }}>
            <ActivityFlow job={openrow} />
          </div>
        </Dialog>
      </Card>
      <br /> {/* Add a line break after the card */}
    </>
  );
}
