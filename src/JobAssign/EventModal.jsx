import React, { useEffect, useState } from "react";  // React hooks for component lifecycle and state management

import CheckCircleIcon from "@mui/icons-material/CheckCircle";  // Icon for indicating completion
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from "@mui/icons-material/Delete";  // Icon for delete action
import {
  Chip,  // Component to display tags or status chips
  FormControl,  // Component for form control elements
  FormControlLabel,  // Label for form controls
  FormLabel,  // Label for forms
  Grid,  // Grid layout component
  IconButton,  // Button for icons (e.g., delete, edit)
  InputLabel,  // Label for inputs
  MenuItem,  // Dropdown menu item
  Paper,  // Material UI paper component for layout
  Radio,  // Radio button component
  RadioGroup,  // Group of radio buttons
  Select,  // Select dropdown component
  Table,  // Table component for displaying data
  TableBody,  // Table body component
  TableCell,  // Table cell component
  TableContainer,  // Container for the table
  TableHead,  // Table header component
  TableRow,  // Table row component
  TextField,  // Text input field component
  Tooltip,  // Tooltip component for displaying hints
  Typography,  // Typography component for text and headings
  styled,  // Utility to create custom styled components
  tableCellClasses,  useMediaQuery,  // Table cell styling utility
  useTheme
} from "@mui/material";  // Material UI components for UI layout and controls

import Autocomplete from "@mui/material/Autocomplete";  // Autocomplete input field for suggestions
import Button from "@mui/material/Button";  // Button component
import LinearProgress from "@mui/material/LinearProgress";  // Linear progress bar component for loading states
import dayjs from "dayjs";  // Utility for date manipulation
import { motion } from "framer-motion";  // Animation library for adding motion effects
import { Hourglass, RotatingLines } from "react-loader-spinner";  // Components for loading spinners
import CustomDialog from "../components/shared/confirmationDialog/dialog.component";  // Custom dialog component for confirmation prompts
import { updateJobAndActivity } from "../JobPerformer/JobPerformerAPI";  // API call to update job and activity details
import {
  deleteJobDetails,  // API call to delete job details
  getAllGroupId,  // API call to get all group IDs
  getOnEventClickJob
} from "./JobAssignAPI";  // Importing job assignment API methods
// import { fetchAllUsers } from "../Admin/UserModuleAPi";  // API call to fetch all users (currently commented out)

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";  // Rounded version of the CheckCircle icon
import CloseIcon from "@mui/icons-material/Close";  // Icon for closing actions
import DangerousIcon from '@mui/icons-material/Dangerous';  // Icon for danger or error states
import EngineeringIcon from '@mui/icons-material/Engineering';  // Icon for engineering or technical tasks
import InfoIcon from '@mui/icons-material/Info';  // Icon for informational states
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';  // Icon for play or start actions
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";  // Icon for indicating changes or updates
import TimelapseIcon from '@mui/icons-material/Timelapse';  // Icon for indicating time-related actions

import { Calendar } from "primereact/calendar";  // PrimeReact calendar component for date selection
import { fetchAllUsers, getTenantID } from "../UserModuleUpdated/UsermoduleApi";  // API call to fetch all users from updated user module
import { adjustForWeekdays, calculateTotalDuration, fetchCurrentActivityList, formatDuration } from "./helper";  // Helper functions for job scheduling and duration calculations
import { Dropdown } from "primereact/dropdown";// PrimeReact dropdown component for selecting options
import { EventSourcePolyfill } from "event-source-polyfill"; // EventSource polyfill for real-time updates
import UserValueTemplate from "./UserValueTemplate"; //Custom template for user dropdown
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


// Styled components for custom table cell and row
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
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function EventModal({
  eventJobDetails,
  setEventJobDetails,
  approverList,
  priorityList,
  tagList,
  setAllUsersData,
  setApproverList,
  setTagList,
  setEventModalClick,
  setSnackbarOpen,
  setSeverityText,
  setSeverityType,
  refreshData,
  setRefreshData,
  setIsSaveDisabled,
  confirmationDialog,
  setConfirmationDialog,
  handleEventUpdateClick,allUsersData,
  listEventDate,
  handleFilterEvents,
  copyMode,
  setCopyMode,
  notifyUsers,
  handleDatesSet
  // weekdays,
  // setWeekdays
}) {


  const [isLoading, setIsLoading] = useState(false);
  const [eventFromDateChange, setEventFromDateChange] = useState(null);
  const [totalEventActivityDuration,setTotalEventActvityDuration]=useState(0)

  // const [eventToDate,setEventToDate]=useState(null) // State for storing the end date, default is the current dateToDate]
  // Getting the theme object for styling from Material-UI
  const theme = useTheme();
  // Checking if the screen size is mobile based on theme breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


//   useEffect(() => {
//     const tenantId = getTenantID();
//     const JOB_API = process.env.REACT_APP_JOBAPI;
//     // console.log('Event : ',eventJobDetails)
 
//     // Function to create a new EventSource
//     const createEventSource = () => {
//       if (
//         eventJobDetails.jobStatus.toLowerCase() !== 'completed' &&
//         eventJobDetails.jobStatus.toLowerCase() !== 'rejected'  &&
//         eventJobDetails.jobStatus.toLowerCase() !== 'not started'
//       ){
//       //  const eventStart = dayjs(
//       //               eventJobDetails.scheduledJobStartTime
//       //             ).format("YYYY-MM-DD HH:mm:ss.SSS");
//       //             const eventStop = dayjs(
//       //               eventJobDetails.scheduledJobEndTime
//       //             ).format("YYYY-MM-DD HH:mm:ss.SSS");
//       //             console.log("Event Start : ",eventStart,"Event Stop : ",eventStop)
// // console.log("Job Name : ",eventJobDetails.jobName,"Job ID : ",eventJobDetails.jobID)
//         const eventSource = new EventSourcePolyfill(`${JOB_API}/jobassign/sse/${tenantId}?jobId=${eventJobDetails.jobID}`, {
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem("token")}`
//             },
//         });
 
//         // Event listener for incoming messages
//         eventSource.onmessage = (event) => {
//             try {
//                 const updatedJob = JSON.parse(event.data); // Assuming the server sends JSON data
// // console.log("New job data received:", updatedJob);
//                 if(updatedJob)
//                 {
//                   // console.warn('Job is updating')
//                   setEventJobDetails(updatedJob);
//                 }
//                 // fetchAllCalendarEvents(newJobs)
//                 // setAllJobs(newJobs); // Update state with new jobs

               
//             } catch (error) {
// // console.error("Error parsing job data:", error);
               
//             }
//         };
 
//         // Error handling for EventSource
//         eventSource.onerror = (error) => {
// // console.error("Error in SSE connection:", error);
//           // if(eventSource)
//           //   eventSource.close();  // Close the current connection
// // console.log('eventSource.readyState',eventSource.readyState)
//           if (eventSource.readyState === EventSource.CONNECTING) {
//             console.warn("SSE connection is trying to connect.");
//         } else{
//             console.warn("SSE connection is closed.");
//             eventSource.close(); 
//         }
          
//           // Re-attempt connection after delay
//           // setTimeout(createEventSource, 5000); // Reconnect after 5 seconds
//       };
 
//         return eventSource;
//     }
//     };
 
//     const eventSource = createEventSource();
 
//     // Cleanup function to close the EventSource connection when the component unmounts
//     return () => {
// // console.log("Closing SSE connection");
//         if(eventSource)
//           eventSource.close();
//     };
//   }, [eventJobDetails.jobStatus]); // Re-run effect when jobStatus changes


/**
 * Asynchronously fetches all users and filters them based on if they have the "Job Reviewer" page in their allotedPages.
 * If the user has the "Job Reviewer" page, their user id is added to the approverList array.
 * Finally, the approverList array is set as the state of the component.
 */
  async function getAllApprover() {
// console.log("getAllApprover()");
    let userList = await fetchAllUsers();
// console.log("User List from API : ", userList);
    // if(userList)
    // {
    // setAllUsersData(userList)
    // }

    if (userList) {
      let approverList = [];
      userList.forEach((user) => {
        if (
          user.allotedPages.some(
            (data) => data.page.toLowerCase() === "job reviewer"
          ) && user.active
        )
          approverList.push(user);
      });
      //The same state is being used ( both for 'job reviewer' && 'activity reviewer' )in the activityDetails tab ( because in both cases they are treated as approvers (job or activity )) an, by the time it gets mounted in the job Assign Tab the data will change once again 
      setApproverList(approverList);
    }
  }
/**
 * Fetches a list of group IDs from the API and sets the tagList state 
 * with the fetched data. 
 */
  async function fetchTagList() {
// console.log("fetchTagList() called");
    let groupList = await getAllGroupId();
// console.log(" GroupId from API : ", groupList);
    if (groupList) {
      setTagList(groupList);
    }
  }


/**
 * Asynchronously handles the deletion of an event job.
 * Sets the loading state, formats the job start and end times, and sends a request to delete the job.
 * Displays a success or error message based on the outcome and refreshes the data.
 */
  const handleEventDeleteClick = async () => {
    setIsLoading(true)

// console.log("handleEventDeleteClick() called");
// console.log("Final Json to Delete : ", eventJobDetails);
    let copyEventJob = { ...eventJobDetails };
// console.log("Start Time Event : ", eventJobDetails.scheduledJobStartTime);
    copyEventJob.scheduledJobStartTime = dayjs(
      eventJobDetails.scheduledJobStartTime
    ).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    copyEventJob.scheduledJobEndTime = dayjs(
      eventJobDetails.scheduledJobEndTime
    ).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
// console.log("Job Details sent for delete => ", copyEventJob);

    const success = await deleteJobDetails(eventJobDetails);
    notifyUsers(eventJobDetails,`The Job ${eventJobDetails?.jobName??''} has been deleted`)
    if (success) {
      setEventModalClick(false);
      setSeverityText("Data deleted successfully ! ");
      setSeverityType("success");
      setSnackbarOpen(true);
      setRefreshData(!refreshData);
      
        const month = dayjs(eventJobDetails.scheduledJobStartTime).month() + 1; // 1-12
const year = dayjs(eventJobDetails.scheduledJobStartTime).year();
console.log("Month and Year to set after saving repeatable jobs : ", month, year);
        handleDatesSet(month, year);
    } else {
      // setEventModalClick(false);
      setSeverityText("Error ! ");
      setSeverityType("error");
      setSnackbarOpen(true);
      // setRefreshData(!refreshData); //Poll is added so no need to change this state
    }
    setIsLoading(false)
    handleFilterEvents(listEventDate);
  };

 

/**
 * Handles the change of start date in the event creation form.
 * Asynchronously adjusts the end date of the event based on the total activity duration.
 * Checks if the selected date is in the past and displays an error message if it is.
 * If the selected date is valid, updates the activity list and end date of the job.
 * @param {Date} newvalue - The new start date selected by the user.
 */
  const handleFromDateChange = async (newvalue) => {
// console.log("handleFromDateChange() called ");
// console.log("The changed datetime() is : ", newvalue);

    // const currentTime = dayjs();
    const selectedTime = dayjs(newvalue);

    const finalToDate=adjustForWeekdays(selectedTime,totalEventActivityDuration,eventJobDetails.weekdays)
// console.log('Final To date : ',finalToDate.format('D MMM YY h:mm A'))
    setEventJobDetails({...eventJobDetails,scheduledJobStartTime:selectedTime,scheduledJobEndTime:finalToDate})
    // setEventFromDateChange(selectedTime)
    // setEventToDate(finalToDate)


  };


/**
 * Handles the change of weekdays in the event creation form.
 * Asynchronously adjusts the end date of the event based on the total activity duration and the selected weekdays.
 * Updates the activity list and end date of the job.
 * @param {Event} event The change event of the weekdays dropdown
 */
  const handleWeekdaysChange=(event)=>
  {
// console.log('handleWeekdaysChange() called ! '+event.target.value)
    const updatedWeekdays=event.target.value
    // setWeekdays(updatedWeekdays)
// console.log("Current FromDate Value : ",dayjs(eventFromDateChange).format('D MMM YY h:mm A'))
   const updatedToDate=dayjs(eventFromDateChange).add(totalEventActivityDuration,'minute')
// console.log("After adding duration : ",updatedToDate.format('D MMM YY h:mm A'))
// console.log('Current Total Activity Duration : ',totalEventActivityDuration)
    const finalToDate=adjustForWeekdays(updatedToDate,updatedWeekdays)
// console.log("After adjusting todate with weekdays : ",finalToDate.format('D MMM YY h:mm A'))
    setEventJobDetails({...eventJobDetails,scheduledJobStartTime:eventFromDateChange,scheduledJobEndTime:finalToDate,weekdays:updatedWeekdays})


  }

  

  useEffect(() => {
// console.log("UseEffect() called for EventModal");
    // fetchDataForAssetGroup();
    getAllApprover();//this is responsible for fetching users who are going to approve the  job
    fetchTagList();
    const parsedEventJobDetails = JSON.parse(JSON.stringify(eventJobDetails));
    // setCopyPrevEventJobDetails(parsedEventJobDetails)
    setEventFromDateChange(parsedEventJobDetails.scheduledJobStartTime);
    const total_activity_duration=calculateTotalDuration(parsedEventJobDetails?.task.activityList)
// console.log('duration :', total_activity_duration)
    setTotalEventActvityDuration(total_activity_duration)
    // fetchAllUserData();
  }, []);

/**
 * Handles the closing of the event job modal.
 * If the closing is due to user interaction and not just a backdrop click,
 * it sets the event modal click state to false, enables the save button and
 * resets the form.
 * @param {Object} event - The event object
 * @param {String} reason - The reason why the modal was closed
 */
    const handleEventDialogClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setEventModalClick(false);
      setIsSaveDisabled(false);
      // handleReset()
    }
  };

  return (
    <>
    {/* Parent div for the modal */}
      {/* <div
        style={{
          position: "fixed",
          top: 10,
          left: 4,
          display: "none",
          alignItems: "center",
          justifyContent: "space-between", // Ensures space between Job Details and buttons
          zIndex: 2,
          backgroundColor: "white", // Optional: background color for better visibility
          borderRadius: "8px", // Optional: rounded corners for a better look
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Optional: subtle shadow for better visibility
          padding: "0.5rem", // Optional: padding for better spacing
          width: "98%", // Adjust width based on your needs or parent container
        }}
      >
        
        <div>
          <Tooltip title="Close">
            <IconButton
              size="small"
              aria-label="close"
              onClick={(event, reason) => handleEventDialogClose(event, reason)}
              sx={{
                color: "red",
              }}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div> */}

      <motion.div
        key="modal"
      
      >
        <div>
          <CustomDialog
            open={confirmationDialog}
            setOpen={setConfirmationDialog}
            proceedButtonText={"Delete"}
            cancelButtonText={"Cancel"}
            proceedButtonClick={handleEventDeleteClick}
          />
        

          <Grid container spacing={2} sx={{ padding: 0 }} maxWidth="xl">
          
            

            <Grid item xs={12} sx={{ marginTop: "1.4rem" }}>
              <FormControl required disabled fullWidth>
                <InputLabel id="demo-simple-select-required-label">
                  Asset Group
                </InputLabel>
                <Select
                  id="asset-event-modal"
                  label="Asset Group"
                  value={eventJobDetails && eventJobDetails.task.assetGroup}
                >
                  <MenuItem
                    key={eventJobDetails && eventJobDetails.task.assetGroup}
                    value={eventJobDetails && eventJobDetails.task.assetGroup}
                  >
                    {eventJobDetails && eventJobDetails.task.assetGroup}
                  </MenuItem>
                  {/* Since this will be in disabled state the MenuItem list need not have to be iterated */}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth disabled>
                <InputLabel htmlFor="taskSelect">Task</InputLabel>
                <Select
                  fullWidth
                  label="Task"
                  value={eventJobDetails && eventJobDetails.task.taskName}
                  // this is the taskname inside the task object
                >
                  <MenuItem
                    key={eventJobDetails && eventJobDetails.task.taskName}
                    value={eventJobDetails && eventJobDetails.task.taskName}
                  >
                    {eventJobDetails && eventJobDetails.task.taskName}
                    {/* This will be jobname later i.e eventJobDetails.jobName */}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                id="outlined-basic"
                label="JobName"
                variant="outlined"
                fullWidth
                disabled
                defaultValue={eventJobDetails && eventJobDetails.jobName} //This will be later converted to Jobname
                //onChange={(e)=>{setCurrentJobName(e.target.value)}}
                //error={validationForJobDetailsForModal&&currentJobName===''}
              />
            </Grid>

            <Grid item xs={12}>
             

              <Dropdown
                options={approverList}
                value={
                  approverList.length > 0
                    ? eventJobDetails && eventJobDetails.approver
                    : ""
                }
                disabled={
                  eventJobDetails.jobStatus === null ||
                  (eventJobDetails.jobStatus &&
                    eventJobDetails.jobStatus.toLowerCase() !== "not started")
                }
                onChange={(event) => {
                  setEventJobDetails({
                    ...eventJobDetails,
                    approver: event.target.value,
                  });
                }}
                optionValue="userID"
                placeholder="Select Approver"
                className="w-full"
                // style={{
                //   // height: "30px",
                //   width: isMobile ? "6rem" : "10rem",
                // }}
                // disabled={booleanSelfApproved}
                itemTemplate={(option) => (
                  <div>
                    <span style={{ fontWeight: "bold" }}>
                      {option.userName}
                    </span>

                    {isMobile ? "" : <span>{"( " + option.userID + " )"}</span>}
                  </div>
                )}
                valueTemplate={(option) =>
              
                  <UserValueTemplate
                  option={option}
                  defaultValue={"Approver"}
                  statusVisible={false}
                  />
                }
                optionLabel="userName"
                filter
                // optionLabel={"userName"}
                clearIcon
              />
            </Grid>

            <Grid item xs={12}>
              {/* <div>
            {dayjs(eventJobDetails.scheduledJobStartTime).format('D MMM YY h:mm A')+"weekdays"+eventJobDetails.weekdays}
            </div> */}
              <FormControl
              disabled
                error={
                  (eventJobDetails.weekdays === "5" &&
                    (dayjs(eventJobDetails.scheduledJobStartTime).day() === 6 ||
                      dayjs(eventJobDetails.scheduledJobStartTime).day() ===
                        0)) ||
                  (eventJobDetails.weekdays === "6" &&
                    dayjs(eventJobDetails.scheduledJobStartTime).day() === 0)
                }
              >
                <FormLabel id="demo-controlled-radio-buttons-group">
                  Weekdays
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={eventJobDetails.weekdays.toString()}
                  onChange={(event) => {
                    // const updatedWeekdays=event.target.value
                    // setWeekdays(updatedWeekdays)

                    // setEventJobDetails({...eventJobDetails,weekdays:updatedWeekdays})
                    handleWeekdaysChange(event);
                  }}
                >
                  <FormControlLabel
                    value="5"
                    control={<Radio />}
                    label="Exclude Sat-Sun"
                  />
                  <FormControlLabel
                    value="6"
                    control={<Radio />}
                    label="Exclude Sunday"
                  />
                  <FormControlLabel value="7" control={<Radio />} label="All" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={6}
              sx={{
                display: "flex",
                alignItems: "center",
                columnGap: "1rem",
                justifyContent: "flex-start",
              }}
            >
              {/* <div>{eventJobDetails.scheduledJobStartTime}</div> */}
              <Typography sx={{ fontWeight: 500 }}>Start Time</Typography>
              <Calendar
                showIcon
                id="calendar-12h"
                dateFormat="dd/mm/yy"
                value={new Date(dayjs(eventFromDateChange))}
                onChange={(e) => {
                  setEventFromDateChange(e.value);
                  handleFromDateChange(e.value);
                }}
                disabled={
                  eventJobDetails.jobStatus === null ||
                  (eventJobDetails.jobStatus &&
                    eventJobDetails.jobStatus.toLowerCase() !== "not started")
                }
                showTime
                hourFormat="12"
                minDate={new Date()}
                invalid={
                  (eventJobDetails.weekdays === "5" &&
                    (dayjs(eventJobDetails.scheduledJobStartTime).day() === 6 ||
                      dayjs(eventJobDetails.scheduledJobStartTime).day() ===
                        0)) ||
                  (eventJobDetails.weekdays === "6" &&
                    dayjs(eventJobDetails.scheduledJobStartTime).day() === 0)
                }
                disabledDays={
                  eventJobDetails.weekdays === "5"
                    ? [0, 6]
                    : eventJobDetails.weekdays === "6"
                    ? [0]
                    : []
                }
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={6}
              sx={{
                display: "flex",
                alignItems: "center",
                columnGap: "1rem",
                justifyContent: "flex-end",
              }}
            >
              <>
                <Typography sx={{ fontWeight: 500 }}>End Time</Typography>
                <Calendar
                  showIcon
                  id="calendar-12h"
                  dateFormat="dd/mm/yy"
                  value={new Date(dayjs(eventJobDetails.scheduledJobEndTime))}
                  showTime
                  hourFormat="12"
                  disabled
                />
              </>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-required-label">
                  Priority
                </InputLabel>
                <Select
                  labelId="demo-simple-select-required-label"
                  id="demo-simple-select-required"
                  label="Priority"
                  value={eventJobDetails.priority}
                  disabled={
                    eventJobDetails.jobStatus === null ||
                    (eventJobDetails.jobStatus &&
                      eventJobDetails.jobStatus.toLowerCase() !== "not started")
                  }
                  //defaultValue={priority || "Critical"}
                  // onChange={(event) => setPriority(event.target.value)}
                  onChange={(event) => {
                    setEventJobDetails({
                      ...eventJobDetails,
                      priority: event.target.value,
                    });
                  }}
                  style={{
                    color:
                    eventJobDetails.priority.toLowerCase() === "critical"
                        ? "#B80000"
                        : eventJobDetails.priority.toLowerCase() === "normal"
                        ? "#610C9F"
                        : "#1B3C73",
                    fontWeight: "bold",
                  }}
                  
                  //   disabled={elem.disabled}
                >
                  {priorityList.map((itm, index) => (
                    <MenuItem
                      key={index}
                      value={itm}
                      // component={motion.div}
                      // whileHover={{ scale: 1.1, originX: 0 }}
                      // transition={{ type: "spring", stiffness: 300 }}
                      style={{
                        color:
                        itm.toLowerCase() === "critical"
                            ? "#B80000"
                            : itm.toLowerCase() === "normal"
                            ? "#610C9F"
                            : "#1B3C73",
                        fontWeight: "bold",
                      }}
                    >
                      {itm}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                id="job-Tag"
                freeSolo
                options={tagList.map((option) => option)}
                clearIcon={false}
                disabled={
                  eventJobDetails.jobStatus === null ||
                  (eventJobDetails.jobStatus &&
                    eventJobDetails.jobStatus.toLowerCase() !== "not started")
                }
                value={eventJobDetails.groupId ? eventJobDetails.groupId : ""}
                onChange={(event, newValue) => {
                  setEventJobDetails({
                    ...eventJobDetails,
                    groupId: newValue, //check
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="TAG ( Group Id )"
                    value={
                      eventJobDetails.groupId ? eventJobDetails.groupId : ""
                    }
                    onChange={(event) => {
                      setEventJobDetails({
                        ...eventJobDetails,
                        groupId: event.target.value, //check
                      });
                    }}
                  />
                )}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: isMobile ? "center" : "flex-end",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <Chip
                  sx={{ fontWeight: "bold" }}
                  color="info"
                  icon={<TimelapseIcon />}
                  label={`Task Duration: ${formatDuration(
                    totalEventActivityDuration
                  )}`}
                ></Chip>
              </div>
            </Grid>

            <Grid item xs={12}>
              <TableContainer
                className="dataTableStyle"
                component={Paper}
                sx={{ mt: 1 }}
              >
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      {/* <StyledTableCell align="center">Sequence</StyledTableCell> */}
                      <StyledTableCell align="center">Sequence</StyledTableCell>
                      <StyledTableCell align="center">
                        Activity Name
                      </StyledTableCell>
                      {/* <StyledTableCell align="center">
                        User Available
                      </StyledTableCell> */}
                      <StyledTableCell align="center">
                        Performer
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Approver
                      </StyledTableCell>
                      {/* <StyledTableCell align="center">
                        Asset Available
                      </StyledTableCell> */}
                      <StyledTableCell align="center">
                        Select Asset
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {eventJobDetails.task.activityList.map((row, index) => (
                      <StyledTableRow key={index + 1}>
                        {/* <StyledTableCell
                          align="center"
                          component="th"
                          scope="row"
                        >
                          {index + 1}
                        </StyledTableCell> */}
                        <StyledTableCell align="center">
                          <div style={{ fontWeight: "bold" }}>
                            {row.sequence}
                          </div>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              columnGap: "0.5rem",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                placeItems: "flex-start",
                                alignItems: "center",
                              }}
                            >
                              <div>
                                {row.actvityStatus.toLowerCase() ===
                                  "started" && (
                                  <div
                                    style={{
                                      marginTop: "0.3rem",
                                      marginRight: "0.2rem",
                                    }}
                                  >
                                    <Tooltip title="Started">
                                      <div>
                                        <Hourglass
                                          visible={true}
                                          height="12"
                                          width="12"
                                          colors={["green", "lightgreen"]}
                                        />
                                      </div>
                                    </Tooltip>
                                  </div>
                                )}

                                {row.actvityStatus.toLowerCase() ===
                                  "rejected" && (
                                  <Tooltip title="Rejected">
                                    <DangerousIcon
                                      fontSize="small"
                                      color="error"
                                      sx={{
                                        width: "0.9rem",
                                        height: "0.9rem",
                                        marginRight: "0.2rem",
                                        marginTop: "0.3rem",
                                      }}
                                    />
                                  </Tooltip>
                                )}
                                {row.actvityStatus
                                  .toLowerCase()
                                  .toLowerCase() === "completed" && (
                                  <Tooltip title="Completed">
                                    <CheckCircleRoundedIcon
                                      fontSize="small"
                                      color="success"
                                      sx={{
                                        width: "0.9rem",
                                        height: "0.9rem",
                                        marginTop: "0.3rem",
                                        marginRight: "0.2rem",
                                      }}
                                    />
                                  </Tooltip>
                                )}
                              </div>
                            </div>

                            <Chip color="primary" label={row.activityName} />
                          </div>
                        </StyledTableCell>
                        {/* <StyledTableCell align="center">
                        {
                          (row.available && (
                    <CheckCircleIcon sx={{ color: "#4477CE" }} />
                  )) || 
                  <CancelIcon  sx={{ color: "red" }} 
                  />}
                        </StyledTableCell> */}

                        <StyledTableCell align="center">
                          {row.groupOrDept === false && (
                     
                      <Dropdown
                      placeholder="Select Performer"
                      // options={performerList}
                      value={row.performer}
                      disabled
                     optionValue="userID"
                         optionLabel="userName"
                      options={allUsersData.filter(user => 
                        user.allotedPages.some(data => data.page.toLowerCase() === 'performer')
                      )}
                      valueTemplate={(option) =>
                        <UserValueTemplate
                          option={option}
                          defaultValue={"Performer"}
                          statusVisible={false}
                          />}
                      />
                          )}

                          {row.groupOrDept === true && (
                            <FormControl required fullWidth disabled>
                              <InputLabel id="demo-simple-select-required-label">
                                {row.performerType?.toLowerCase() === "group"
                                  ? "Select Group"
                                  : "Select Department"}
                              </InputLabel>
                              <Select
                                size="small"
                                // labelId="demo-simple-select-required-label"
                                // id="demo-simple-select-required"
                                label={
                                  row.performerType?.toLowerCase() === "group"
                                    ? "Select Group"
                                    : "Select Department"
                                }
                                value={row.groupOrDeptName}
                                // onChange={(event) => {
                                //   handlePerformerChange(event, row, index);
                                // }}
                                title={
                                  row.performerType?.toLowerCase() === "group"
                                    ? "Select Group"
                                    : "Select Department"
                                }
                                //   disabled={elem.disabled}
                                required={true}
                                fullWidth
                              
                              >
                               
                                <MenuItem
                                  key={row.groupOrDeptName}
                                  value={row.groupOrDeptName}
                                >
                                  {row.groupOrDeptName}
                                </MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                        <Dropdown
                      placeholder="Select Approver"
                      // options={performerList}
                      value={row.approver}
                      disabled
                      options={allUsersData.filter(user => 
                        user.allotedPages.some(data => data.page.toLowerCase() === 'activity reviewer')
                  
                      )}
                        optionValue="userID"
                         optionLabel="userName"
                      valueTemplate={(option) =>
                        <UserValueTemplate
                          option={option}
                          defaultValue={"Approver"}
                          statusVisible={false}
                          />}
                      />
                        </StyledTableCell>

                      
                        <StyledTableCell align="center">
                          
                           <Dropdown
                      placeholder="Select Asset"
                      // options={performerList}
                      value={row.assetName}
                      disabled
                      options={[row.assetName]
                      }
                      />
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            {/* {tag} */}
          </Grid>

          {/* For Mobile View        */}
          {isMobile && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                columnGap: "1rem",
                justifyContent: "center",
                margin: "0.7rem 0rem",
              }}
            >
              {isLoading && (
                <RotatingLines
                  visible={true}
                  height="20"
                  width="20"
                  strokeWidth="5"
                />
              )}

              {/* <motion.div
      whileHover={{
        scale: 1.1,
        boxShadow: "0px 0px 8px rgb(255, 255, 255)",
      }}
    > */}
              <Button
                variant="contained"
                onClick={handleEventUpdateClick}
                disabled={
                  isLoading || // The component is disabled if the data is still loading.
                  eventJobDetails.jobStatus === null || // Disabled if the job status is not set (null).
                  (eventJobDetails.jobStatus &&
                    eventJobDetails.jobStatus.toLowerCase() !==
                      "not started") ||
                  // Disabled if job status is present and not "not started".

                  (eventJobDetails.weekdays === "5" &&
                    (dayjs(eventJobDetails.scheduledJobStartTime).day() === 6 ||
                      dayjs(eventJobDetails.scheduledJobStartTime).day() ===
                        0)) ||
                  // Disabled if the job is supposed to run on weekdays ("5") but the scheduled start time falls on a Saturday (6) or Sunday (0).

                  (eventJobDetails.weekdays === "6" &&
                    dayjs(eventJobDetails.scheduledJobStartTime).day() === 0)
                  // Disabled if the job is set to run on "weekdays + Saturday" ("6") but the scheduled start time falls on a Sunday (0).
                }
                startIcon={<PublishedWithChangesIcon />}
              >
                Update
              </Button>
              {/* </motion.div> */}

              {/* <motion.div
      whileHover={{
        scale: 1.1,
        boxShadow: "0px 0px 8px rgb(255, 255, 255)",
      }}
    > */}
              <Button
                onClick={() => {
                  setConfirmationDialog(true);
                }}
                variant="contained"
                sx={{
                  background: "red",
                  "&:hover": {
                    background: "darkred", // Change to the desired hover color
                  },
                }}
                disabled={
                  isLoading ||
                  eventJobDetails.jobStatus === null ||
                  (eventJobDetails.jobStatus &&
                    eventJobDetails.jobStatus.toLowerCase() !==
                      "not started") ||
                  (eventJobDetails.weekdays === "5" &&
                    (dayjs(eventJobDetails.scheduledJobStartTime).day() === 6 ||
                      dayjs(eventJobDetails.scheduledJobStartTime).day() ===
                        0)) ||
                  (eventJobDetails.weekdays === "6" &&
                    dayjs(eventJobDetails.scheduledJobStartTime).day() === 0)
                }
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            </div>
          )}
      
        </div>
      </motion.div>
    </>
  );
}
