    // Importing specific icons from Material-UI for use in the component
    import DoneIcon from "@mui/icons-material/Done"; // Icon representing completion
    import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"; // Icon for downward arrow
    import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"; // Icon for rightward arrow

    // Importing various components from Material-UI
    import {
      Avatar, // Component for displaying user avatars
      Badge, // Component for displaying notifications or status
      Chip, // Component for displaying small blocks of information
      InputAdornment, // Component for adding adornments to input fields
      Tooltip as MuiTooltip, // Tooltip component from Material-UI, renamed to MuiTooltip
      TextField, // Component for input fields
      Tooltip,
      useMediaQuery,
      useTheme, // Tooltip component from Material-UI
    } from "@mui/material";

    import StopIcon from "@mui/icons-material/Stop";
    import Box from "@mui/material/Box"; // Component for layout and spacing
    import Collapse from "@mui/material/Collapse"; // Component for collapsible elements
    import IconButton from "@mui/material/IconButton"; // Component for icon buttons
    import Paper from "@mui/material/Paper"; // Component for material design paper effect
    import Table from "@mui/material/Table"; // Component for displaying tabular data
    import TableBody from "@mui/material/TableBody"; // Component for table body
    import TableCell from "@mui/material/TableCell"; // Component for individual table cells
    import TableContainer from "@mui/material/TableContainer"; // Component for wrapping tables
    import TableHead from "@mui/material/TableHead"; // Component for table headers
    import TableRow from "@mui/material/TableRow"; // Component for individual table rows
    import Typography from "@mui/material/Typography"; // Component for text styling
    import { Button as PrimeReactButton } from "primereact/button"; // Button component from PrimeReact, renamed to PrimeReactButton
    import React, { useEffect, useState } from "react"; // Importing React and useState hook
    import LViewWithProps from "../Logbook/View/LViewWithProps"; // Importing a component for viewing logs with props
    import EngineeringIcon from "@mui/icons-material/Engineering";
    // Importing additional icons from Material-UI
    // import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'; // Icon for upward arrow, currently commented out
    import CancelIcon from "@mui/icons-material/Cancel"; // Icon for cancel action
    import GroupIcon from "@mui/icons-material/Group"; // Icon representing a group
    import PersonIcon from "@mui/icons-material/Person"; // Icon representing a person
    import SearchIcon from "@mui/icons-material/Search"; // Icon for search action
    import { useNavigate } from "react-router-dom"; // Hook for navigation in React Router
    import { delay, deriveInitials } from "../JobPerformer/JobHelper"; // Function to derive initials from a name
    import VisibilityIcon from "@mui/icons-material/Visibility";
    // Importing API function for updating job and activity
    import {
      updateJobAndActivity, // Function to update job and activity information
    } from "../JobPerformer/JobPerformerAPI";

    // Importing dialog components from PrimeReact
    import { Dialog } from "primereact/dialog"; // Dialog component for modal dialogs
    import RemarksDialog from "../ActivityReviewer/RemarksDialog"; // Dialog component for remarks
    import { formatDatetime } from "../JobAssign/helper"; // Function to format datetime
    import { decryptTokenId } from "../helper/AuthService"; // Function to decrypt token IDs
    import ActivityProgress from "./ProgressBar"; // Component for displaying activity progress
    import JobTerminationDialog from "./JobTerminationDialog";
    import ActivityFlow from "./ActivityFlow";
    import SnackbarComponent from "../components/shared/snackbar/customSnackbar";
    import { ProgressBar } from "primereact/progressbar";
    import ActivityFlowToRevertActivities from "./ActivityFlowToRevertActivities";
    import DateSelection from "../JobPerformer/DateSelection";

    // Defining styles for various components using a styles object
    const styles = {
      typography: {
        fontSize: "0.9rem", // Setting font size
        color: "white", // Setting text color to white
        fontWeight: 400, // Setting font weight
        textAlign: "center", // Center aligning text
      },
      jobHead: {
        backgroundColor: "#263238", // Setting background color for job header
        padding: "12px", // Setting padding for job header
      },
      activityHead: {
        backgroundColor: "#565b5e", // Setting background color for activity header
        padding: "7px", // Setting padding for activity header
        width: "900px", // Setting width for activity header
      },
      tableCellHeader: {
        padding: "5px", // Setting padding for table header cells
      },
      tableCell: {
        padding: "10px", // Setting padding for table cells
      },
    };
    export default function ApproveTable({
      rows, //prop to hold jobs
      filter, //prop to filter jobs
      setFilter, //prop to change filter value
      isDisabled, //prop to hold the list of disabled jobs
      setDisabled, //prop to change the list of disabled jobs
      renderTrigger, //prop to call useEffect on change
      setRenderTrigger, //prop to change render trigger
      showloader, //prop to show loader
      fromDate,
      toDate,
      setFromDate,
      setToDate
    }) {
      const [openrow, setOpenrow] = useState(null); //State to  track which rows are open
      const [openrowdialog, setOpenrowdialog] = useState(false); //State to  track which rows are open

      const [remarks, setRemarks] = useState(null); //State to hold remarks
      const [openDialog, setOpenDialog] = useState(false); //state  to track dialog visibility
      const [jobHandleConfirm, setJobHandleConfirm] = useState(null); //state to hold the job to update after confirm is clicked through popup
      const [valueHandleConfirm, setValueHandleConfirm] = useState(null); //state to hold whether the job is accepted or rejected
      const [timelineEvent, setTimelineEvent] = useState([]); //state to display timeline, currently not used
      const [showLogbook, setShowLogbook] = useState(false); //state to show logbook
      const [logbookdata, setLogbookdata] = useState({}); //state to hold logbook data
      const [confirmLabel, setConfirmLabel] = useState(null); //state to hold the label to display in  the confirm dialog
      const [terminateJob, setTerminateJob] = useState(null);
      const [openSnackbar, setOpenSnackbar] = useState(false);
      const [snackContent, setSnackContent] = useState(null);
      const [showRevertActivitiesDialog, setRevertActivitiesDialog] =
        useState(false);
      const [jobToRevertActivities, setJobToRevertActivities] = useState(null);

      const theme = useTheme();
      const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
      const isTab = useMediaQuery(theme.breakpoints.down("md"));

      const navigate = useNavigate(); //state to navigate to a given page, currently not used
      const filteredRows = rows.filter(
        (row) =>
          row?.jobName?.toLowerCase().includes(filter?.toLowerCase()) ||
          row?.task?.activityList?.some((act) =>
            act?.activityName?.toLowerCase().includes(filter?.toLowerCase())
          )
      ).sort((a, b) => {
    const getCompletion = (row) => {
      const activityList = row?.task?.activityList || [];
      if (activityList.length === 0) return 0;

      const completedCount = activityList.filter(
        (activity) => activity?.actvityStatus === "Completed"
      ).length;

      return (completedCount * 100) / activityList.length;
    };

    return getCompletion(b) - getCompletion(a); // DESC
  });; //filter rows based on input

      //Function to fetch decrypted tenant id from session storage
      const getTenantID = () => {
        const env_tenant = process.env.REACT_APP_TENANTID;
        const encryptedTenant = localStorage.getItem(env_tenant);
        const tenant = decryptTokenId(encryptedTenant);
        return tenant;
      };

      //Function to show logbook, called when a logbook is clicked
      async function handleLinkClick(row, activity) {
        setShowLogbook(true); //state to show logbook is assigned with true
        setLogbookdata({ jobID: row.jobID, activityID: activity.activityId }); //the logbook data is filled
      }
      //Function to filter jobs based on input
      const handleFilterChange = (event) => {
        setFilter(event.target.value); //change the filter value
      };

      /**
       * Function to update the job and remove the modal
       */
      const handleConfirm = () => {
        setOpenDialog(false); //state to remove remarks popup

        handleApproveReject(jobHandleConfirm, valueHandleConfirm); //function to approve/reject job
      };
      /**
       * Function to open a popup to confirm update in datebase
       */
      const handleDialogOpen = (job, approveOrRejectValue) => {
        setDisabled([...isDisabled, job]); //set the jobs to be disabled
        setOpenDialog(true); //open the remarks popup
        setJobHandleConfirm(job); //set the job whose status is updated
        setValueHandleConfirm(approveOrRejectValue); //set the value of the status, Completed,Rejected
        setConfirmLabel(
          approveOrRejectValue === "Completed" ? "Approve" : "Reject"
        ); //set the confirmation label
      };
      //Function to reset the states when a popup is closed
      const handleCancel = () => {
        setDisabled((prev) => prev.filter((item) => item !== jobHandleConfirm));
        setOpenDialog(false); //set the state which opens the popup to false
        setJobHandleConfirm(null); //set the state which holds the job to null
        setValueHandleConfirm(null); //set the value which hold the status to null
        setRemarks(null); //set the remarks to null
        setConfirmLabel(null); //set the confirmation label in the popup to null
      };
      //function to open popup to confirm whether to terminate the activity or not
      const handleTerminateJobDialog = (row) => {
        setTerminateJob(row);
      };
      //function to terminate the activity
      const handleTerminateJobConfirm = () => {
        handleApproveReject(terminateJob, "Aborted");
        console.log("Handle Terminated");
        setTerminateJob(null);
        
        setDisabled((prev) => prev.filter((item) => item !== terminateJob));
      };
      //Function to expand a job and display it's activities
      const handleRowClick = (row) => {
        console.log("Handle row click", row);
        setOpenrow(row);
        setOpenrowdialog(true);
      };

      //Function to approve or reject a job
      const handleApproveReject = async (job, approveOrRejectValue) => {
        //Update remarks, jobstatus and actual end time of the job
        const updatedJob = {
          ...job,
          remarks: remarks,
          adhoc:
            approveOrRejectValue === "Completed" && job.adhoc === true
              ? false
              : job.adhoc,
          jobStatus: approveOrRejectValue,
          actualJobEndTime: new Date(),
        }; //update the value of the job

        const response = await updateJobAndActivity(updatedJob); //call the  function to update the job and activity
        if (response?.status === 200) {
          setOpenSnackbar(true);
          setSnackContent({
            dialog:
              approveOrRejectValue === "Aborted"
                ? "Aborted Successfully"
                : "Update Successful",
            severity: "success",
          });
        } else {
          setOpenSnackbar(true);
          setSnackContent({ dialog: "Error", severity: "error" });
        }
        setRenderTrigger(renderTrigger + 1); //update the state which calls the useeffect
        setRemarks(null);
        setConfirmLabel(null);
        setDisabled((prev) => prev.filter((item) => item !== jobHandleConfirm));
      };

      const handleShowRevertActivitiesDialog = (job) => {
        setJobToRevertActivities(job);
        setRevertActivitiesDialog(true);
      };
      return (
        <Box>
          {/* Main container for the job details section */}
          <Box
            sx={{
              display: "flex", // Use flexbox for layout
            flexDirection: isMobile || isTab ? "column" : "row", // Arrange items in a row
              alignItems: "center", // Center items vertically
              justifyContent: "space-between", // Space items evenly
              marginBottom: "0.5rem", // Margin below this box
            }}
          >
            <DateSelection
                            fromDate={fromDate}
                            setFromDate={setFromDate}
                            toDate={toDate}
                            setToDate={setToDate}
                            isMob={isMobile}
              isTab={isTab}
                          />
            <TextField
              id="search1"
              size="small"
              label="Search"
              value={filter}
              onChange={handleFilterChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          {/* Table container to display the job details table */}
          <TableContainer
            //component={Paper}
            sx={{
              border: "1px solid #e0e0e0",
              boxShadow: "none",
              maxHeight: 1000,
              scrollbarWidth: "none",
            }}
            // style the table
          >
            {/* collapsible table */}
            <Table aria-label="collapsible table" stickyHeader>
              {!filteredRows?.length > 0 && !showloader && (
                <caption>No data available</caption>
              )}
              {/* Table header */}
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    className="MuiDatatableTableHeader"
                  ></TableCell>

                  <TableCell
                    align="center"
                    className="MuiDatatableTableHeader"
                    sx={{ width: "10rem" }}
                  >
                    <Typography className="MuiDatatableTableHeader-Font">
                      Job Name
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    className="MuiDatatableTableHeader"
                    sx={{ width: "10rem" }}
                  >
                    <Typography className="MuiDatatableTableHeader-Font">
                      Assigner
                    </Typography>
                  </TableCell>
                  <TableCell align="center" className="MuiDatatableTableHeader">
                    <Typography className="MuiDatatableTableHeader-Font">
                      Progress
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center" className="MuiDatatableTableHeader">
                    <Typography className="MuiDatatableTableHeader-Font">
                      Priority
                    </Typography>
                  </TableCell>
                  <TableCell align="center" className="MuiDatatableTableHeader">
                    <Typography className="MuiDatatableTableHeader-Font">
                      Weekdays
                    </Typography>
                  </TableCell>

                  <TableCell align="center" className="MuiDatatableTableHeader">
                    <Tooltip
                      title={isMobile || isTab ? "Scheduled Start vs Stop" : ""}
                      placement="top"
                    >
                      <Typography
                        className={
                          isMobile || isTab
                            ? "MuiDatatableTableHeader-Font ellipsisText"
                            : "MuiDatatableTableHeader-Font"
                        }
                      >
                        Scheduled Start vs Stop
                      </Typography>
                    </Tooltip>
                  </TableCell>

                  <TableCell align="center" className="MuiDatatableTableHeader">
                    <Typography className="MuiDatatableTableHeader-Font">
                      Status
                    </Typography>
                  </TableCell>
                  <TableCell align="center" className="MuiDatatableTableHeader">
                    <Typography
                      className={
                        isMobile || isTab
                          ? "MuiDatatableTableHeader-Font ellipsisText"
                          : "MuiDatatableTableHeader-Font"
                      }
                    >
                      Action
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              {/* Body of the table */}
              <TableBody>
                {showloader && (
                  <TableCell colSpan={10}>
                    <ProgressBar
                      mode="indeterminate" // Indeterminate loading mode
                      style={{ height: "6px" }} // Set height of the progress bar
                    />
                  </TableCell>
                )}
                {!showloader &&
                  filteredRows.map((row, index) => {
                    const isEvenRow = index % 2 === 0; //constant to check whether the current row is even
                    return (
                      <React.Fragment key={index}>
                        <TableRow
                          sx={{ "& > *": { borderBottom: "none !important" } }}
                          style={{
                            backgroundColor: isEvenRow ? "#f5f5f5" : "white", //modify thebackground color based on the row number
                            padding: "10px",
                          }}
                        >
                          <TableCell
                            sx={styles.tableCell}
                            width="10px"
                            className="MuiDatatableBodyPadding"
                          >
                            <IconButton
                              aria-label="expand row"
                              size="small"
                              onClick={() => handleRowClick(row)} //Function called to expand the row
                            >
                              <PrimeReactButton
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
                            </IconButton>
                          </TableCell>
                          <TableCell
                            sx={styles.tableCell}
                            align="center"
                            className="MuiDatatableBodyPadding"
                          >
                            <Tooltip
      title={<>Job Name: {row.jobName}
        {row.groupId?.length > 0
            &&<>  <br/>Tag Name: {row.groupId}</>}
      <br/>Job Id: {row.jobID}</>}
      placement="top">
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignContent: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "0.85rem",
                                    fontWeight: "600",
                                    whiteSpace: "pre-line",
                                    maxWidth: "9rem",
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                  }}
                                >
                                  {row.jobName}
                                </Typography>
                                {/* Show the job name in a chip */}
                                {row.task.activityList.find(
                                  (act) => act.enforce === true
                                ) && (
                                  <Tooltip title="Enforced" placement="right">
                                    <Badge variant="dot" color="warning"></Badge>
                                  </Tooltip>
                                )}
                                {/* Add a badge if any of the activity is enforced */}
                              </div>
                            </Tooltip>
                          </TableCell>
                          <TableCell align="center">
                                                  <Tooltip placement="top" title={row.assigner}>
                                                    <Badge
                                                      sx={{
                                                        "& .MuiBadge-badge": {
                                                          backgroundColor: "#ac331d",
                                                        },
                                                      }}
                                                      overlap="circular"
                                                    >
                                                      <Avatar
                                                        //sizes={10}
                                                        sx={{
                                                          backgroundColor: "#ac331d",
                                                          fontSize: "0.90rem",
                                                          width: "35px",
                                                          height: "35px",
                                                        }}
                                                      >
                                                        {
                                                          deriveInitials(row.assigner) //function to derive initials of the approver
                                                        }
                                                      </Avatar>
                                                    </Badge>
                                                  </Tooltip>
                                                </TableCell>
                          <TableCell
                            sx={styles.tableCell}
                            align="center"
                            className="MuiDatatableBodyPadding"
                          >
                            <ActivityProgress
                              activityList={row.task.activityList}
                            />
                            {/* Show the progress of the job using prime react's component*/}
                          </TableCell>
                          
                          <TableCell
                            sx={styles.tableCell}
                            align="center"
                            className="MuiDatatableBodyPadding"
                          >
                            <Chip
                              size="small"
                              sx={{ textTransform: "capitalize" }}
                              label={row.priority}
                              color={
                                row.priority.toLowerCase() === "critical"
                                  ? "error"
                                  : row.priority.toLowerCase() === "Normal"
                                  ? "info"
                                  : "warning"
                              }
                            />

                            {/* Show the priority in a chip */}
                          </TableCell>
                          <TableCell
                            sx={styles.tableCell}
                            align="center"
                            className="MuiDatatableBodyPadding"
                          >
                            <Chip
                              size="small"
                              //sx={{height:"38px"}}
                              label={
                                row.weekdays === 5
                                  ? "Except Saturday Sunday"
                                  : row.weekdays === 6
                                  ? "Except Sunday"
                                  : "All"
                              }
                            />
                          </TableCell>

                          <TableCell
                            sx={styles.tableCell}
                            align="center"
                            className="MuiDatatableBodyPadding"
                          >
                            <div>
                              <p
                                style={{
                                  margin: "0 0 4px 0",
                                  padding: 0,
                                }}
                              >
                                {/* convert date time to a given format */}
                                {formatDatetime(row.scheduledJobStartTime)}
                              </p>
                              <p style={{ margin: 0, padding: 0 }}>
                                {/* convert date time to a given format */}
                                {formatDatetime(row.scheduledJobEndTime)}
                              </p>
                            </div>
                            {/* Function to format datetime */}
                          </TableCell>

                          <TableCell
                            sx={styles.tableCell}
                            align="center"
                            className="MuiDatatableBodyPadding"
                          >
                            <>
                              {/* Display job status using prime react icons. Different icons for different status */}

                              {row.jobStatus === "Completed" ? (
                                <MuiTooltip title="Completed" placement="right">
                                  <PrimeReactButton
                                    icon="pi pi-check"
                                    rounded
                                    text
                                    raised
                                    //size="small"
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
                              ) : row.jobStatus === "Rejected" ? (
                                // display rejected using prime react icons
                                <MuiTooltip title="Rejected" placement="right">
                                  <PrimeReactButton
                                    icon="pi pi-times"
                                    rounded
                                    text
                                    raised
                                    //size="small"
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
                              ) : row.jobStatus === "Sent For Approval" ? (
                                // Display sent for approval using prime react icon
                                <MuiTooltip
                                  title="Sent For Approval"
                                  placement="right"
                                >
                                  <PrimeReactButton
                                    icon="pi pi-send"
                                    rounded
                                    text
                                    raised
                                    // size="small"
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
                              ) : row.jobStatus === "Started" ? (
                                // Display started using prime react icon
                                <MuiTooltip title="Started" placement="right">
                                  <PrimeReactButton
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
                              ) : row.jobStatus === "Review Started" ? (
                                // Display review started using prime react icon
                                <MuiTooltip
                                  title="Review Started"
                                  placement="right"
                                >
                                  <PrimeReactButton
                                    icon="pi pi-file-check"
                                    rounded
                                    text
                                    raised
                                    //size="small"
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
                              ) : row.jobStatus === "Not Started" ? (
                                // Display not started using prime react icon
                                <MuiTooltip title="Not Started" placement="right">
                                  <PrimeReactButton
                                    icon="pi pi-stopwatch"
                                    rounded
                                    text
                                    raised
                                    //size="small"
                                    //severity="secondary"
                                    style={{
                                      height: "2.2rem",
                                      width: "2.2rem",
                                      cursor: "default",
                                      boxShadow: "none",
                                      background: "#eeeeee",
                                    }}
                                  />
                                </MuiTooltip>
                              ) : (
                                ""
                              )}
                            </>
                          </TableCell>
                          <TableCell
                            sx={styles.tableCell}
                            align="center"
                            className="MuiDatatableBodyPadding"
                          >
                            {/* table cell which contains the buttons to approve or reject a job */}
                            {row.reviewStarted &&
                              row.jobStatus !== "Review Started" &&
                              row.jobStatus !== "Completed" &&
                              row.jobStatus !== "Rejected" && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    columnGap: "0.7rem",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Tooltip title="Approve" placement="top">
                                    <IconButton
                                      sx={{ background: "#e5f3e7" }}
                                      onClick={() =>
                                        handleDialogOpen(row, "Completed")
                                      }
                                      disabled={isDisabled.includes(row)}
                                    >
                                      <DoneIcon sx={{ fontSize: "1.15rem" }} />
                                    </IconButton>
                                  </Tooltip>
                                  {/* Display the button to approve the job if the job status is not completed or rejected */}
                                  <Tooltip title="Reject" placement="top">
                                    <IconButton
                                      //size="small"
                                      // variant="contained"
                                      sx={{ background: "#fff0f3" }}
                                      onClick={() =>
                                        handleDialogOpen(row, "Rejected")
                                      }
                                      disabled={isDisabled.includes(row)}
                                    >
                                      <CancelIcon
                                        sx={{
                                          color: "#ff5a5f",
                                          fontSize: "1.2rem",
                                        }}
                                      />
                                    </IconButton>
                                  </Tooltip>
                                  {/* Display the button to reject the job if the job status is not completed or rejected */}
                                </Box>
                              )}
                            {/* If actiivity status is review started then show cloud download icon to download the file */}
                            {row.jobStatus === "Started" && (
                              // <IconButton
                              //   size="small"
                              //   variant="contained"
                              //   sx={{ background: "#fff0f3" }}
                              //   onClick={() => handleTerminateJobDialog(row)}
                              // >
                              //   <StopIcon sx={{ color: "#ff5a5f" }} />
                              // </IconButton>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  columnGap: "0.7rem",
                                  justifyContent: "center",
                                }}
                              >
                                <MuiTooltip title="Abort Job" placement="right">
                                  <PrimeReactButton
                                    icon="pi pi-ban"
                                    rounded
                                    text
                                    raised
                                    severity="danger"
                                    onClick={() => handleTerminateJobDialog(row)}
                                    style={{
                                      height: "2.2rem",
                                      width: "2.2rem",
                                      cursor: "default",
                                      boxShadow: "none",
                                      background: "#fce4ec",
                                    }}
                                  />
                                </MuiTooltip>
                                <MuiTooltip
                                  title="Revert to a particular activity"
                                  placement="right"
                                >
                                  <PrimeReactButton
                                    icon="pi pi-undo"
                                    rounded
                                    text
                                    raised
                                    severity="danger"
                                    onClick={() =>
                                      handleShowRevertActivitiesDialog(row)
                                    }
                                    style={{
                                      height: "2.2rem",
                                      width: "2.2rem",
                                      cursor: "default",
                                      boxShadow: "none",
                                      background: "#fce4ec",
                                    }}
                                  />
                                </MuiTooltip>
                              </Box>
                            )}
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
              </TableBody>
            </Table>
            {/* Dialog to input remarks while approving or rejecting the job */}
            <RemarksDialog
              setOpen={setOpenDialog}
              open={openDialog}
              proceedButtonClick={handleConfirm}
              handleClose={handleCancel}
              confirmLabel={confirmLabel}
              remarks={remarks}
              setRemarks={setRemarks}
            />

            <Dialog
              visible={openrowdialog}
              onHide={() => {
                setOpenrowdialog(false);
                setOpenrow(null);
              }}
              header={
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "1rem",
                      columnGap: "0.5rem",
                    }}
                  >
                    <EngineeringIcon sx={{ fontSize: "1rem" }} />
                    <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                      {openrow?.jobName}
                    </Typography>
                  </div>
                </>
              }
              style={{ width: isMobile || isTab ? "100%" : "80%", zIndex: "100" }}
            >
              {/* collapsible table which contains the details of the activities
              * for the expanded job
              */}
              {openrow && (
                <Box sx={{ margin: 0, padding: 0 }}>
                  <Table
                    size="small"
                    aria-label="purchases"
                    sx={{ border: "1px solid #e0e0e0" }}
                  >
                    {/* Display the table headers */}
                    <TableHead>
                      <TableRow
                        style={{
                          backgroundColor: "#f5f5f5",
                          padding: "10px",
                        }}
                      >
                        <TableCell
                          sx={{
                            //...styles.activityHead,
                            ...styles.typography,
                            width: "7%",
                            //background:"blue"
                          }}
                          className="Expanded-MuiDatatableTableHeader"
                        >
                          Order
                        </TableCell>
                        <TableCell
                          sx={{
                            //...styles.activityHead,
                            ...styles.typography,
                            width: "14%",
                            //background:"blue"
                          }}
                          className="Expanded-MuiDatatableTableHeader"
                        >
                          Activity Name
                        </TableCell>
                        <TableCell
                          sx={{
                            //...styles.activityHead,
                            ...styles.typography,
                            width: "10%",
                            // background:"blue"
                          }}
                          className="Expanded-MuiDatatableTableHeader"
                        >
                          Performer
                        </TableCell>

                        <TableCell
                          sx={{
                            //...styles.activityHead,
                            ...styles.typography,
                            width: "10%",
                            // background:"blue"
                          }}
                          className="Expanded-MuiDatatableTableHeader"
                        >
                          Approver
                        </TableCell>
                        <TableCell
                          sx={{
                            //...styles.activityHead,
                            ...styles.typography,
                            //width: "10%",
                          }}
                          className="Expanded-MuiDatatableTableHeader"
                        >
                          Workspace
                        </TableCell>
                        <TableCell
                          sx={{
                            //...styles.activityHead,
                            ...styles.typography,
                            width: "26%",
                            // background:"red"
                          }}
                          className="Expanded-MuiDatatableTableHeader"
                        >
                          Scheduled Start vs Stop
                        </TableCell>

                        <TableCell
                          sx={{
                            //...styles.activityHead,
                            ...styles.typography,

                            width: "26%",
                          }}
                          className="Expanded-MuiDatatableTableHeader"
                        >
                          Actual Start vs Stop
                        </TableCell>
                        {/* <TableCell
                                      sx={{
                                        ...styles.activityHead,
                                        ...styles.typography,
                                        width: "14%",
                                      }}
                                    >
                                      Actual Stop Time
                                    </TableCell> */}
                        <TableCell
                          sx={{
                            //...styles.activityHead,
                            ...styles.typography,
                            width: "10%",
                          }}
                          className="Expanded-MuiDatatableTableHeader"
                        >
                          Status
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    {/* Display the table body */}
                    <TableBody>
                      {openrow.task.activityList.map((activity, activityIndex) => (
                        <TableRow key={activityIndex}>
                          {/* Display the sequence of the given activity */}
                          <TableCell
                            sx={{
                              ...styles.tableCell,
                            }}
                            align="center"
                          >
                            {activity.sequence}
                          </TableCell>
                          {/* Display the activity name of the given activity */}
                          <TableCell
                            sx={{
                              ...styles.tableCell,
                            }}
                            align="center"
                          >
                            <Chip
                              label={activity.activityName}
                              color={
                                activity.enforce === true ? "warning" : "default"
                              }
                            />
                          </TableCell>
                          {/* Display the performer or group or department name */}
                          <TableCell align="center">
                            <Tooltip
                              placement="top"
                              title={
                                activity.performer?.length > 0
                                  ? activity.performer
                                  : activity.groupOrDeptName
                              }
                            >
                              <Badge
                                sx={{
                                  "& .MuiBadge-badge": {
                                    backgroundColor:
                                      activity.performerType === "Performer"
                                        ? "#29b6f6"
                                        : "#ff9800",
                                  },
                                }}
                                overlap="circular"
                                badgeContent={
                                  // Show a person icon if performer type is performer
                                  activity.performerType === "Performer" ? (
                                    <PersonIcon
                                      sx={{
                                        fontSize: "0.65rem",
                                        background: "#29b6f6",
                                        color: "white",
                                      }}
                                    />
                                  ) : (
                                    // Show a group icon if performer type is group or department
                                    <GroupIcon
                                      sx={{
                                        fontSize: "0.65rem",
                                        color: "white",
                                      }}
                                    />
                                  )
                                }
                              >
                                {/* Show performer's/group's initials in an avatar*/}
                                <Avatar
                                  //sizes={10}
                                  sx={{
                                    bgcolor:
                                      activity.performerType === "Performer"
                                        ? "#29b6f6"
                                        : "#ff9800",
                                    fontSize: "0.90rem",
                                    width: "35px",
                                    height: "35px",
                                  }}
                                >
                                  {
                                    activity.performer?.length > 0
                                      ? deriveInitials(activity.performer) //function to derive initials of the performer
                                      : deriveInitials(activity.groupOrDeptName) //function to derive initials of the group
                                  }
                                </Avatar>
                              </Badge>
                            </Tooltip>
                          </TableCell>
                          {/* Table cell to show the approver of the activity  */}
                          <TableCell align="center">
                            <Tooltip placement="top" title={activity.approver}>
                              <Badge
                                sx={{
                                  "& .MuiBadge-badge": {
                                    backgroundColor: "#9c27b0",
                                  },
                                }}
                                overlap="circular"
                              >
                                <Avatar
                                  //sizes={10}
                                  sx={{
                                    bgcolor: "#9c27b0",
                                    fontSize: "0.90rem",
                                    width: "35px",
                                    height: "35px",
                                  }}
                                >
                                  {
                                    deriveInitials(activity.approver) //function to derive initials of the approver
                                  }
                                </Avatar>
                              </Badge>
                            </Tooltip>
                          </TableCell>
                          <TableCell
                            sx={{
                              ...styles.tableCell,
                            }}
                            align="center"
                          >
                            {activity.logbook?.length > 0 && (
                              <>
                                {/* view logbook if the the activity status is anything but not started */}
                                {activity.actvityStatus !== "Not Started" &&
                                activity.actvityStatus !== "Rejected" ? (
                                  <Tooltip
                                    title="Click Here to View Logbook"
                                    placement="top"
                                  >
                                    <Chip
                                      size="small"
                                      color="info"
                                      label={activity.logbook}
                                      onClick={() => {
                                        handleLinkClick(openrow, activity);
                                      }}
                                      // Function called to view logbook
                                    />
                                  </Tooltip>
                                ) : (
                                  <Chip
                                    size="small"
                                    color="default"
                                    label={activity.logbook}
                                  />
                                  // chip to display logbook
                                )}
                              </>
                            )}
                            {/* show blank if there is no logbook */}
                            {!activity.logbook?.length && <div>---</div>}
                          </TableCell>

                          <TableCell
                            sx={{
                              ...styles.tableCell,
                            }}
                            align="center"
                          >
                            <>
                              <p
                                style={{
                                  margin: "0 0 4px 0",
                                  padding: 0,
                                }}
                              >
                                {/* convert date time to a given format */}
                                {formatDatetime(
                                  activity.scheduledActivityStartTime
                                )}
                              </p>
                              <p style={{ margin: 0, padding: 0 }}>
                                {/* convert date time to a given format */}
                                {formatDatetime(activity.scheduledActivityEndTime)}
                              </p>
                            </>
                          </TableCell>
                          {/* <TableCell
                                          sx={{
                                            ...styles.tableCell,
                                          }}
                                          align="center"
                                        >
                                          {convertToDate(
                                            activity.scheduledActivityEndTime
                                          )}
                                        </TableCell> */}
                          <TableCell
                            sx={{
                              ...styles.tableCell,

                              width: "14%",
                            }}
                            align="center"
                          >
                            <>
                              <p
                                style={{
                                  margin: "0 0 4px 0",
                                  padding: 0,
                                }}
                              >
                                {/* convert date time to a given format or show - for blank datetime */}
                                {activity.actualActivityStartTime === null
                                  ? "-"
                                  : formatDatetime(
                                      activity.actualActivityStartTime
                                    )}
                              </p>
                              <p style={{ margin: 0, padding: 0 }}>
                                {/* convert date time to a given format or show - for blank datetime */}
                                {activity.actualActivityEndTime === null
                                  ? "-"
                                  : formatDatetime(activity.actualActivityEndTime)}
                              </p>
                            </>
                          </TableCell>
                          {/* <TableCell
                                          sx={{
                                            ...styles.tableCell,
                                          }}
                                          align="center"
                                        >
                                          {activity.actualActivityEndTime === null
                                            ? "-"
                                            : convertToDate(
                                                activity.actualActivityEndTime
                                              )}
                                        </TableCell> */}
                          <TableCell
                            sx={{
                              ...styles.tableCell,
                            }}
                            align="center"
                          >
                            <>
                              {/* Show activity status using primereact's button */}
                              {activity.actvityStatus === "Completed" ? (
                                <MuiTooltip title="Completed" placement="right">
                                  {/* Display  the status using tooltip*/}
                                  <PrimeReactButton
                                    icon="pi pi-check"
                                    rounded
                                    text
                                    raised
                                    //size="small"
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
                              ) : // {/* Display  the status using tooltip*/}
                              activity.actvityStatus === "Rejected" ? (
                                <MuiTooltip title="Rejected" placement="right">
                                  {/* Display  the status using tooltip*/}
                                  <PrimeReactButton
                                    icon="pi pi-times"
                                    rounded
                                    text
                                    raised
                                    //size="small"
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
                              ) : activity.actvityStatus === "Aborted" ? (
                                <MuiTooltip title="Aborted" placement="right">
                                  {/* Display  the status using tooltip*/}
                                  <PrimeReactButton
                                    icon="pi pi-ban"
                                    rounded
                                    text
                                    raised
                                    //size="small"
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
                              ) : activity.actvityStatus === "Sent For Approval" ? (
                                <MuiTooltip
                                  title="Sent For Approval"
                                  placement="right"
                                >
                                  {/* Display  the status using tooltip*/}
                                  <PrimeReactButton
                                    icon="pi pi-send"
                                    rounded
                                    text
                                    raised
                                    // size="small"
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
                              ) : // {/* Show activity status using primereact's button */}
                              activity.actvityStatus === "Started" ? (
                                <MuiTooltip title="Started" placement="right">
                                  {/* Display  the status using tooltip*/}
                                  {/* Show activity status using primereact's button */}
                                  <PrimeReactButton
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
                              ) : activity.actvityStatus === "Review Started" ? (
                                //   Display  the status using tooltip
                                //  Show activity status using primereact's button

                                <MuiTooltip
                                  title="Review Started"
                                  placement="right"
                                >
                                  <PrimeReactButton
                                    icon="pi pi-file-check"
                                    rounded
                                    text
                                    raised
                                    //size="small"
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
                              ) : activity.actvityStatus === "Not Started" ? (
                                //  Display  the status using tooltip
                                //  Show activity status using primereact's button

                                <MuiTooltip title="Not Started" placement="right">
                                  <PrimeReactButton
                                    icon="pi pi-stopwatch"
                                    rounded
                                    text
                                    raised
                                    style={{
                                      height: "2.2rem",
                                      width: "2.2rem",
                                      cursor: "default",
                                      boxShadow: "none",
                                      background: "#eeeeee",
                                    }}
                                  />
                                </MuiTooltip>
                              ) : (
                                ""
                              )}
                            </>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div style={{ border: "1px solid #e0e0e0", marginTop: "1rem" }}>
                    <ActivityFlow job={openrow} />
                  </div>
                </Box>
              )}
            </Dialog>
            <JobTerminationDialog
              row={terminateJob}
              setRow={setTerminateJob}
              handleTerminateJobConfirm={handleTerminateJobConfirm}
            />
          </TableContainer>
          {/*Dialog for showing logbook details*/}
          <Dialog
            visible={showLogbook}
            onHide={() => {
              setShowLogbook(false); //set the state to show logbook to false
              setLogbookdata({}); //set the logbook data to empty object
            }}
            maximizable
            blockScroll
            style={{ width: isMobile || isTab ? "100%" : "" }}
          >
            <div>
              {/* Display the logbook data using custom component*/}
              <LViewWithProps
                jobId={logbookdata.jobID}
                activityId={logbookdata.activityID}
              ></LViewWithProps>
            </div>
          </Dialog>
          <SnackbarComponent
            openPopup={openSnackbar}
            setOpenPopup={setOpenSnackbar}
            dialogMessage={snackContent?.dialog}
            snackbarSeverity={snackContent?.severity}
          />
          {showRevertActivitiesDialog && (
            <ActivityFlowToRevertActivities
              job={jobToRevertActivities}
              setJob={setJobToRevertActivities}
              showDialog={showRevertActivitiesDialog}
              setShowDialog={setRevertActivitiesDialog}
              setOpenSnackbar={setOpenSnackbar}
              setSnackbarContent={setSnackContent}
            />
          )}
        </Box>
      );
    }
