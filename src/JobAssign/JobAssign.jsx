// Importing FullCalendar day grid plugin for displaying events in a grid layout
import dayGridPlugin from "@fullcalendar/daygrid";

// Importing FullCalendar interaction plugin for enabling event interaction like drag and drop
import interactionPlugin from "@fullcalendar/interaction";

// Importing FullCalendar list plugin for displaying events in a list view
import listPlugin from "@fullcalendar/list";

// Importing the main FullCalendar component to render the calendar
import FullCalendar from "@fullcalendar/react";

// Importing FullCalendar time grid plugin for displaying events in a time-based grid
import timeGridPlugin from "@fullcalendar/timegrid";

// Importing CloseIcon from Material UI for a close button icon
import DeleteIcon from "@mui/icons-material/Delete"; // Icon for delete action

import SaveIcon from '@mui/icons-material/Save';

// import DangerousIcon from '@mui/icons-material/Dangerous';  // Icon for danger or error states
import EngineeringIcon from '@mui/icons-material/Engineering'; // Icon for engineering or technical tasks
import InfoIcon from '@mui/icons-material/Info'; // Icon for informational states
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'; // Icon for play or start actions
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges"; // Icon for indicating changes or updates


// Importing various Material UI components for layout, input, dialogs, lists, buttons, etc.
import {
  Avatar,
  Box, // A flexible box container
  Button, // Button component
  Checkbox, // Checkbox input
  Chip, // Chip component for labels or status tags
  Container, // Dialog title component
  Divider, // Divider for separating content
  Grid, IconButton, // Button component with an icon
  List, // List component to display items
  ListItem, // List item component for individual items in the list
  ListItemText, // Modal component for popups
  Snackbar, // Snackbar component for displaying alerts
  Step, // Step component for step-based progress
  StepLabel, // Label for each step
  Stepper, // Stepper component for multi-step processes
  Tooltip, // Tooltip component for providing additional information on hover
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";

import { Button as AntButton, Flex } from 'antd';
// Importing React along with useEffect and useState hooks
import React, { useEffect, useRef, useState } from "react";
// Importing additional Material UI icons for UI elements
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"; // Checkmark icon
// import EngineeringIcon from "@mui/icons-material/Engineering"; // Engineering icon
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"; // Circle icon for status indicators
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// Importing MuiAlert from Material UI to display custom alerts
import MuiAlert from "@mui/material/Alert";

// Importing ListSubheader from Material UI to create subheaders within lists
import ListSubheader from "@mui/material/ListSubheader";

//** Importing date picker components and localization provider from MUI X Date Pickers

//**Importing Day.js library for date manipulation
import dayjs from "dayjs";

//**Importing animation components from Framer Motion for handling animations
import { motion } from "framer-motion";

//** Importing spinner components for loading indicators from react-loader-spinner
import { Hourglass, RotatingLines } from "react-loader-spinner";

//** Importing API function to update job and activity data
import { updateJobAndActivity } from "../JobPerformer/JobPerformerAPI";

//** Importing helper functions for token decryption and token expiration management
import { decryptTokenId, extendTokenExpiration } from "../helper/AuthService";

//** Importing custom component to display activity details
import ActivityDetails from "./ActivityDetails";

//** Importing custom modal component for displaying events in a modal dialog
import EventModal from "./EventModal";

//** Importing API functions for handling job assignments and fetching calendar events
import {
  geAllJobsByTenant, getCalendarData, getJobsByDateAndUser, //** API to get calendar events assigned to jobs
  getOnEventClickJob, //** API to get job details when clicking on an event
  sendEmail
} from "./JobAssignAPI";

//** Importing custom component to display job details inside a modal
import JobDetailForModal from "./JobDetailsForModal";

//** Importing custom component to handle repeating jobs functionality
import RepeatJob from "./RepeatJob";

//** Importing ReactDOMServer to allow server-side rendering of React components to HTML
import ReactDOMServer from "react-dom/server";

//** Importing React Router hooks for accessing location and navigation
import { useLocation, useNavigate } from "react-router-dom";

//** Importing API to fetch allowed pages for a user by their ID
import { fetchAllotedPagesByUserId } from "../CommonAPI";

//** Importing a custom component for sending job assignment emails
import EmailJobAssign from "../Email Template/EmailJobAssign";

//** Importing API functions to fetch all users and group details
import {
  fetchAllUsers, //** API to fetch all user data
  getAllGroupDetails,
  getTenantID, //** API to fetch group details
} from "../UserModuleUpdated/UsermoduleApi";

//** Importing various helper functions for managing jobs and activities
import {
  adjustForWeekdays, //** Helper function to adjust tasks for weekdays
  createJobDetails, //** Helper function to create job details
  createTask, //** Helper function to create user dropdown list
  fetchCurrentActivityList, //** Helper function to fetch current activity list
  formatDatetime,
  generateToMailUsers
} from "./helper";

// Importing DangerousIcon from Material UI to display a warning/error icon
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Icon for indicating completion
import DangerousIcon from "@mui/icons-material/Dangerous";
import { EventSourcePolyfill } from "event-source-polyfill";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import JobOverview from "./JobOverview";
import JobOverviewForMobile from "./JobOverviewForMobile";
import { getCurrentUser } from "../UserModuleUpdated/helper";
import { useNetwork } from "react-haiku";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {  message } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { sendNotification } from "../pwa/pushNotification";
import { PoweroffOutlined, SyncOutlined } from '@ant-design/icons';

//** */ PLEASE ADD 'BETTER COMMENTS' EXTENSION FOR BETTER READABILITY

const steps = ["Job Details", "Activity Details","Job Overview","Repeat Jobs"]; //** the steps header while assigning a job through the dialog




const JobAssign = () => {
  const env_userId = process.env.REACT_APP_USERID; // Environment variable for user ID


  const [openDialog, setOpenDialog] = useState(false); // State for controlling whether the job dialog is open or not
  const [activeStep, setActiveStep] = useState(0); // State to track the current active step in a stepper component
  const [calendarEv, setCalendarEv] = useState(null); // State for storing the currently selected calendar event
  const [allAssetGroupData, setAllAssetGroupData] = useState([]); // State for storing all asset group data
  const [assetGroup, setAssetGroup] = useState(""); // State for selected asset group
  const [assetGroupList, setAssetGroupList] = useState([]); // State for storing a list of asset groups
  // const [selectedOption, setSelectedOption] = useState("");  // State for the selected option from a dropdown
  const [task, setTask] = useState({}); // State for the current task
  const [taskList, setTaskList] = useState(null); // State for storing a list of tasks
  // const [name, setName] = useState("");  // State for storing the name
  const [approver, setApprover] = useState(""); // State for storing the selected approver
  const [approverList, setApproverList] = useState([]); // State for storing the list of approvers
  const [weekdays, setWeekdays] = useState("7"); // State for managing weekdays selection (default is "7")
  const [fromdate, setFromdate] = useState(dayjs()); // State for storing the start date, default is the current date
  const [todate, setTodate] = useState(dayjs()); // State for storing the end date, default is the current date
  const [priority, setPriority] = useState(""); // State for the selected priority level
  const priorityList = [
    // State for a predefined list of priority levels
    "Critical",
    "Normal",
    "Low",
  ];

  const jobStartMin=3
  // arg.event.extendedProps.priority?.toLowerCase() ===
  // "critical"
  //   ? "#ffcdd2" //showing the priority of job
  //   : arg.event.extendedProps.priority?.toLowerCase() ===
  //     "low"
  //   ? "#bbdefb"
  //   : "#ffe0b2",

  const eventBackgroundColor={
    Critical:"#ffcdd2",
    Normal:"#ffe0b2",
    Low:"#bbdefb"
  }
  const [tag, setTag] = useState(""); // State for managing the tag field
  const [finalJob, setFinalJob] = useState({}); // State for storing the final job details

  // Modified states for additional features
  // const [taskDropdownList, setTaskDropdownList] = useState([]);  // State for storing task dropdown options
  const [toggleChecked, settoggleChecked] = React.useState(false); // State for a toggle checkbox, default is unchecked
  const [currentAssetData, setCurrentAssetData] = useState([]); // State for the current asset data
  const [severityText, setSeverityText] = useState(""); // State for storing severity message
  const [severityType, setSeverityType] = useState("info"); // State for the severity type (e.g., info, warning, error)
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for controlling whether the snackbar is open
  const [userGroupMap, setUserGroupMap] = useState({}); // State for mapping user groups
  const [currentJobName, setCurrentJobName] = useState(""); // State for storing the current job name
  const [currentTotalActivityDuration, setCurrentTotalActivityDuration] =
    useState(0); // State for total activity duration
  const [tagList, setTagList] = useState([]); // State for storing a list of tags
  const [currentAssetForSelectedTask, setCurrentAssetForSelectedTask] =
    useState({}); // State for asset data related to the selected task
  const [copytoallperformer, setCopytoallperformer] = useState(false); // State for toggling the "copy to all performer" option
  const [assetDataFromDb, setAssetDataFromDb] = useState([]); // State for storing asset data fetched from the database
  const [allGroupedUsersData, setAllGroupedUsersData] = useState([]); // State for storing grouped users' data
  const [allUsersData, setAllUsersData] = useState([]); // State for storing all users' data

  // States for Activity Details in the Activity Details Dialog
  const [currentActivityDetailsObject, setCurrentActivityDetailsObject] =
    useState([]); // State for storing the current activity details object
  const [userEditedActivityDetails, setUserEditedActivityDetails] =
    useState(false); // State for tracking if the activity details were edited by the user
  const [activityApproverList, setActivityApproverList] = useState([]); // State for storing a list of activity approvers
  const [performerList, setPerformerList] = useState([]); // State for storing a list of performers
  const [departmentMap, setDepartementMap] = useState(); // State for mapping department information

  // States for Repeat Jobs functionality
  const [repeatJobDate, setRepeatJobDate] = useState(dayjs()); // State for storing the repeat job start date
  const [repeatInterval, setRepeatInterval] = useState(0); // State for storing the repeat interval
  const [repeatHour, setRepeatHour] = useState(0); // State for storing the repeat hour value
  const [repeatMinute, setRepeatMinute] = useState(0); // State for storing the repeat minute value
  const [isRepeatChecked, setIsRepeatChecked] = useState(false); // State for tracking if the repeat job option is checked

  // States for Validation Checks
  const [validationForJobDetailsForModal, setValidationForJobDetailsForModal] =
    useState(false); // State for validating job details modal
  const [validationForActivityDetails, setValidationForActivityDetails] =
    useState(false); // State for validating activity details

  // const [validationsForRepeatJob,setValidationsForRepeatJob]=useState(false); // Commented out: might be used for repeat job validations

  // State for handling event modal clicks
  const [eventModalClick, setEventModalClick] = useState(false); // State for tracking if the event modal was clicked
  const [eventJobDetails, setEventJobDetails] = useState({}); // State for storing event job details

  // State for tracking data refresh status
  const [refreshData, setRefreshData] = useState(false); // State for refreshing data

  // State for storing current events
  const [currentEvents, setCurrentEvents] = useState([]); // State for storing the list of current events
  const [filteredEventsList, setfilteredEventsList] = useState([]); // State for storing the filtered events list

  // State for disabling the save button
  const [isSaveDisabled, setIsSaveDisabled] = useState(false); // State for disabling or enabling the save button

  // State for showing a loading indicator during processing
  const [isLoading, setIsLoading] = useState(false); // State for tracking if data is being processed

  // State for storing all jobs data
  const [allJobs, setAllJobs] = useState([]); // State for storing all jobs

  const [listEventDate, setListEventDate] = useState(new Date());

  // State for managing routing and location with React Router
  const location = useLocation(); // Hook for accessing the current location
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Getting the theme object for styling from Material-UI
  const theme = useTheme();
  // Checking if the screen size is mobile based on theme breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

   const [confirmationDialog, setConfirmationDialog] = useState(false);

   const [currentCalendarDate,setCurrentCalendarDate]=useState({month:dayjs().month()+1,year:dayjs().year()});

  //  console.log('Current Calendar Date State Changed',currentCalendarDate);

   const eventSourceRef = useRef(null); // Ref to hold the EventSource instance

  const [copyMode,setCopyMode]=useState(false); // State for managing copy mode


  //  const [messageApi, contextHolder] = message.useMessage();

  /**
   * Resets all the state variables to their initial values
   * and resets all the input fields in the job details and
   * activity details modals
   */
  const handleReset = () => {
    // method for resetting all useStates
    setActiveStep(0);
    setAssetGroup("");
    setAssetGroupList([]);
    // setSelectedOption("");
    setTask({});
    setTaskList(null);
    setApprover("");
    // setName("");
    setTag("");
    setFinalJob({});
    // setTaskDropdownList([]);
    settoggleChecked(false);
    setCurrentAssetData([]);
    setUserGroupMap({});
    setCurrentJobName("");
    setCurrentTotalActivityDuration(0);
    setTagList([]);
    setCurrentAssetForSelectedTask({});
    setCopytoallperformer(false);
    setAssetDataFromDb();
    // setAllGroupedUsersData([]);
    // setAllUsersData([]);
    setPriority("");
    setWeekdays("7");

    setCurrentActivityDetailsObject([]);
    setUserEditedActivityDetails(false);
    setActivityApproverList([]);
    setPerformerList([]);
    setDepartementMap();

    //For Repeat Jobs
    // setRepeatJobDate(dayjs());
    setRepeatInterval(0);
    setRepeatHour(0);
    setRepeatMinute(0);
    setIsRepeatChecked(false);
    setIsLoading(false);

    setValidationForJobDetailsForModal(false);
    setValidationForActivityDetails(false);
    // setValidationsForRepeatJob(false);
    setIsSaveDisabled(false);
    setEventModalClick(false);
    setCopyMode(false);
  };

/**
 * fetchAllCalendarEvents
 * To access all the calendarEvents which is visible in UI
 * @param {array} eventsList - eventsList is an array of events which is fetched from the getAllCalendarAssignedEvents API
 * @returns {void} - This function does not return any value
 */
  const fetchAllCalendarEvents =  (eventsList) => {
    // console.log('Event List : ',eventsList)
   
    //Currently all jobs are showing
    if (eventsList) {
      const calendarEvents = eventsList
        // .filter(event => event.assigner === getCurrentUser()) // Filter first
        .map(event => ({
          id: event.jobID, 
          title: event.jobName, 
          start: event.scheduledJobStartTime, 
          end: event.scheduledJobEndTime, 
          jobId: event.jobID, 
          eventStatus: event.jobStatus, 
          eventEndTime: event.scheduledJobEndTime, 
          priority: event.priority, 
          description: `Priority: ${event.priority} Job ID: ${event.jobID} JobName: ${event.jobName}`,
          adhoc: event.adhoc,
        }));

        console.log('Final Calendar Events : ',calendarEvents)
    
      setCurrentEvents(calendarEvents);
    }
    
  };
 

  /**
   ** This function fetches all the users from the user module and filters them based on
   ** if they are active or not. It then filters the active users based on if they have
   ** the "Job Reviewer" page in their allotedPages. If the user has the "Job Reviewer"
   ** page, their user details is added to the approverList array. Finally, the
   ** approverList array is set as the state of the component.
   */
  const getAllApprover = async () => {
    // console.log("getAllApprover()");
    const userList = await fetchAllUsers(); //fetching all the users
    // console.log("User List from API : ", userList);
    if (userList) {
      const activeUsers = userList.filter((user) => user.active);
      setAllUsersData(activeUsers); //only the active users would be displayed and will have access to configure
    }

    if (userList) {
      let approverList = []; //the users who have the privilege of reviewing a job will be treated as the approvers of a job
      userList
        .filter((user) => user.active)
        .forEach((user) => {
          if (
            user.allotedPages.some(
              (data) => data?.page?.toLowerCase() === "job reviewer"
            )
          )
            approverList.push(
              user //pushing the data into the approverList into a custom object
            );
        });
      // console.log("Final Approver List : ", approverList);

      setApproverList(approverList);
    }
  };

  /**
   ** This function fetches all the user groups from the user module and filters them
   ** based on if they are active or not. It then sets the allGroupedUsersData state
   ** with the active user groups.
   */
  const fetchAllUserGroupData = async () => {
    let allgroup_data = await getAllGroupDetails(); //getting details of all groups
    if (allgroup_data) {
      allgroup_data = allgroup_data.filter((group) => group.active); //only the active groups would be populated
      // console.log("All User Group Details Data : ", allgroup_data);
      setAllGroupedUsersData(allgroup_data);
    }
  };

  /**
   ** Fetches all the jobs from the job module and sets the state with the received
   ** data. The data is used to populate the list of jobs in the UI.
   * @returns {Promise<void>}
   */
  const fetchAllJobs = async () => {
    const jobs = await geAllJobsByTenant(); //fetching all the jobs information related to the current tenant
    if (jobs) {
      setAllJobs(jobs);
    }
  };
  /**
   ** Checks if the user has access to the current page based on the pages they
   * *are allowed to access, and navigates to the restricted page if they don't.
   */
  const userHasPageAccess = async () => {
    // console.log("userHasPageAccess() called ");
    const allotedPages = await fetchAllotedPagesByUserId(); //fetch the privilege of pages which the current user has access to
    if (allotedPages) {
      const current_path = location.pathname; // the current path i.e current URL
      const index = allotedPages.findIndex(
        //the index of the page is  fetched from the array
        (data) => data.toLowerCase() === current_path
      );
      if (index === -1) {
        //if the  index  is not found then it will be -1, then the user will be navigated to '/restricted'
        navigate("/restricted");
      }
    }
  };

  useEffect(() => {
    // console.log("UseEffect Main JobAssign Page")
    // fetchDepartmentMapDetails();
    fetchAllUserGroupData();
    // fetchAllCalendarEvents();
    //  fetchAllJobs();
    const now = new Date();

const year = now.getFullYear();
const month = now.getMonth() + 1; // 1-12
handleDatesSet(month, year);
    getAllApprover();
    handleFilterEvents(new Date());
  }, []);

  
  const createEventSource = () => {
    console.log('CreateEventSource called')
    const tenantId = getTenantID();
    const JOB_API = process.env.REACT_APP_JOBAPI;
    console.log('Current Calendar Date in SSE',currentCalendarDate);
    const encodedDateRange = encodeURIComponent(JSON.stringify(currentCalendarDate));
    const eventSource = new EventSourcePolyfill(`${JOB_API}/jobs/sse/user/${tenantId}?user=${getCurrentUser()}&dateRangeJson=${encodedDateRange}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
    });

    // Event listener for incoming messages
    eventSource.onmessage = (event) => {
        try {
          
            const newJobs = JSON.parse(event.data); // Assuming the server sends JSON data
            console.log("New job data received:",newJobs); // Logs the message and object
          //   console.dir(newJobs, { depth: null }); // Expands object fully
          //  console.log("New job data received:", JSON.stringify(newJobs, null, 2));
           


         if (newJobs) {
          // console.warn('Main Jobs are updated')
          const regularJobs = newJobs.filter(job => !job.adhoc || job?.jobStatus?.toLowerCase() !== 'aborted');
           fetchAllCalendarEvents(regularJobs);
          //  fetchAllCalendarEvents(newJobs);
          //  console.log('newJobs',newJobs);
            // Filter first
          setAllJobs(newJobs); // Update state with new jobs
            }
           
        } catch (error) {
            // console.error("Error parsing job data:", error);
           
        }
    };

    // Error handling for EventSource
    eventSource.onerror = (error) => {
      console.error("Error in SSE connection:", error);
      // if(eventSource)
        eventSource.close();  // Close the current connection
console.log('eventSource.readyState',eventSource.readyState)
      if (eventSource.readyState === EventSource.CONNECTING) {
        console.warn("SSE connection is trying to connect.");
    } else{
        console.warn("SSE connection is closed.");
        eventSource.close(); 
    }
      
      // Re-attempt connection after delay
      // setTimeout(createEventSource, 5000); // Reconnect after 5 seconds
  };

  console.log('Returned Emitter : ',eventSource);
    return eventSource;
};

// useEffect(() => {
   
 
//     // Function to create a new EventSource
   
 
//     const eventSource = createEventSource();
 
//     // Cleanup function to close the EventSource connection when the component unmounts
//     return () => {
// // console.log("Closing SSE connection");
//         eventSource.close();
//     };
// }, [currentCalendarDate]);

 

  /**
   ** Handles a date click event from the calendar. If the selected date is in the
   ** past, it will show an error message. Otherwise, it will open a dialog to add
   ** a new event to the calendar.
   ** @param {Object} dateselected - The selected date object from the calendar
   ** @param {Function} setSnackbarOpen - A callback function to set the snackbar
   *                                     open state
   ** @param {Function} setSeverityText - A callback function to set the snackbar
   *                                    error message
   ** @param {Function} setSeverityType - A callback function to set the snackbar
   *                                    error type
   */
  
   const handleDateClick = (
    dateselected,
    setSnackbarOpen,
    setSeverityText,
    setSeverityType
  ) => {
    
    const selectedDate = dateselected.start;
    const selectedDay = selectedDate.getDate();
    const selectedMonth = selectedDate.getMonth() + 1; // Adding 1 to get 1-indexed months
    const selectedYear = selectedDate.getFullYear();
   
    const today = dayjs();
    const currentSelectionDate = dayjs(
      `${selectedYear}-${selectedMonth}-${selectedDay}`
    );

    const isSelectedDateInPast = currentSelectionDate.isBefore(today, "day"); //whether the date selected is past is getting checked here

    const calendarApi = dateselected.view.calendar;
    setCalendarEv(dateselected); //**this is responsible for showing the current selection date by the user
    // console.log("Current isSelectedDateInPast : ", isSelectedDateInPast);

    calendarApi.unselect();

    // if (title) {
    if (isSelectedDateInPast) {
      //**if the user is selecting a date that is in past then job cannot be assigned because the date is in past
      //setOpenSnack(true);//**This is for Job can't be assigned in past
      setSeverityText("Job can't be assigned in past !");
      setSeverityType("error");
      setSnackbarOpen(true);
    } else {
      //** if the user is selecting future date or current date then else block will be executed
      setOpenDialog(true);
      setWeekdays("7");
      // if (dateselected.start.toLocaleDateString() === currentDate) {
      //   setFromdate(dayjs());
      //   setSnackbarOpen(false)
      // } else {
      //   setFromdate(dayjs(dateselected.start));
      //   setSnackbarOpen(false)
      // }
      setFromdate(new Date(dayjs(dateselected.startStr)));
      // if(dateselected.startStr===dayjs().)
      // console.log(
      //   "Is Current Date ? ",
      //   dayjs().format("YYYY-MM-DD") === dateselected.startStr
      // );
      if (dayjs().format("YYYY-MM-DD") === dateselected.startStr)
        setFromdate(new Date(dayjs().add(jobStartMin, "minute"))); //adding 2 minutes ahead of the current time because it will take sometime for the user to assign the job
      
    }
    // }
    // handleClick();
  };




  const handleDatesSet=async(month,year)=>{
    console.log("handleDatesSet() called",month,year);
    console.log('Current Calendar Date : ',currentCalendarDate)

    

    // const month = arg.end.getMonth(); // 1 = January, 12 = December
    //     const year = arg.end.getFullYear();

    // const month=arg.startStr.split('-')[1];
    //     const year=arg.startStr.split('-')[0];
    //     console.log("Month changed to:", month, year);
    //     console.log("type of month..",typeof(month))

       

        console.log('handleDatesSet ',month,year);
        setCurrentCalendarDate(null);
        const newJobs=await getCalendarData(month,year);
         setCurrentCalendarDate({...currentCalendarDate,month:month ,year:year});
          console.log('Jobs fetched on handleDatesSet : ',newJobs);
          


         
            console.log("New job data received:",newJobs); // Logs the message and object
          //   console.dir(newJobs, { depth: null }); // Expands object fully
          //  console.log("New job data received:", JSON.stringify(newJobs, null, 2));
           


         if (newJobs) {
          // console.warn('Main Jobs are updated')
          const regularJobs = newJobs.filter(job => !job.adhoc || job?.jobStatus?.toLowerCase() !== 'aborted');
           fetchAllCalendarEvents(regularJobs);
          //  fetchAllCalendarEvents(newJobs);
          //  console.log('newJobs',newJobs);
            // Filter first
          setAllJobs(newJobs); // Update state with new jobs
            }

  }

  /**
   * *Handles an event click event from the calendar. If the selected event is in the
   ** past, it will show an error message. Otherwise, it will open a dialog to edit
   ** the selected event's details.
   ** @param {Object} info - The selected event object from the calendar
   ** @param {Function} setSnackbarOpen - A callback function to set the snackbar
   *                                     open state
   ** @param {Function} setSeverityText - A callback function to set the snackbar
   *                                    error message
   ** @param {Function} setSeverityType - A callback function to set the snackbar
   *                                    error type
   ** @param {Function} setEventJobDetails - A callback function to set the event
   *                                       job details
   ** @param {Function} setEventModalClick - A callback function to set the event
   *                                       modal open state
   */
  const handleEventClick = async (info) => {
   
    message.loading('Fetching Job Details...');
    // let eventStart = dayjs(info.event.start).format("YYYY-MM-DD HH:mm:ss.SSS");
    // let eventStop = dayjs(info.event.extendedProps.eventEndTime).format(
    //   "YYYY-MM-DD HH:mm:ss.SSS"
    // );
    // console.log(
    //   "Formatted Start : ",
    //   eventStart,
    //   "  Formatted Stop : ",
    //   eventStop
    // );

    const eventJobId = info.event.extendedProps.jobId;
    const fetchedEventJob = await getOnEventClickJob(
     
      info.event.title,
      eventJobId
    );
    message.destroy();
    // fetchedEventJob.jobID=null
    if (fetchedEventJob?.jobID) {
      // console.log("Fetched Event Jobs : ", fetchedEventJob);
      // console.log("Stringified Job", JSON.stringify(fetchedEventJob));

      setEventJobDetails(fetchedEventJob);
      message.success('Success', 1.5);
      setEventModalClick(true);

    } else {
      // console.error("Error fetching details of the event !");
      // setSeverityText(`Error! `);
      // setSeverityType("error");
      message.error('Error', 1);
      // setSnackbarOpen(true);
      return;
    }
  };

  const handleCopyEvent = async () => {
    message.loading('Copying...');

    setCopyMode(true);
    const copyJobData=structuredClone(eventJobDetails);
    copyJobData.jobID='J'+dayjs().format("YYYYMMDDTHHmmssSSS")+'C' // C for Copy Job
    copyJobData.task?.activityList?.forEach((activity) => {
  activity.activityStatus = "Not Started";
});
copyJobData.jobStatus="Not Started";
    setFinalJob(copyJobData);

    
    // setTimeout(()=>setOpenDialog(true),2000);
   
          // setAssetDataFromDb(publishedTasks ?? []);
          // console.log('Current Event Job Details in Copy Mode : ',eventJobDetails)
          // const foundTask=publishedTasks.find((task)=>task.taskId===eventJobDetails?.task.taskId);
    setAssetGroup(copyJobData?.task?.assetGroup ?? "");
    setCurrentJobName(copyJobData?.jobName ?? "");
    setPriority(copyJobData?.priority ?? "");
    setTag(copyJobData?.groupId ?? "");
    setApprover(copyJobData?.approver ?? "");
    setWeekdays(copyJobData?.weekdays ?? "7");
    setCurrentAssetForSelectedTask(copyJobData?.task ?? {});
   setCurrentTotalActivityDuration(
  (new Date(copyJobData.scheduledJobEndTime) - new Date(copyJobData.scheduledJobStartTime)) / (1000 * 60) // in minutes
);

setFromdate(new Date(copyJobData.scheduledJobStartTime));
setTodate(new Date(copyJobData.scheduledJobEndTime));


    console.log('Current Start : ',new Date(eventJobDetails.scheduledJobStartTime));
    console.log('Current End : ',new Date(eventJobDetails.scheduledJobEndTime));
    // setFromdate(new Date(dayjs().add(2, "minute"))); //setting the from date 2 minutes ahead of current time
     message.destroy();
      message.success('Job Copied successfully', 2.5);
    setOpenDialog(true);
  }

  /**
   * *Handles the snackbar close event.
   ** If the snackbar was closed by a clickaway event, it does nothing.
   * *Otherwise, it sets the snackbar open state to false.
   ** @param {Object} event - The event object from the snackbar close event
   ** @param {string} reason - The reason for the snackbar close event
   */
  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  /**
   ** Handles the close event of the job dialog.
   **If the dialog was closed by a clickaway event, it does nothing.
   ** Otherwise, it sets the dialog open state to false and resets the form.
   ** @param {Object} event - The event object from the dialog close event
   ** @param {string} reason - The reason for the dialog close event
   */

  const handleDialogClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpenDialog(false);
      handleReset();
    }
  };

  /**
   ** This function prepares the final JSON object for posting, based on the current activity details.
   ** It removes unnecessary properties, creates a task object, and then constructs the final job details.
   ** @returns {Object} The final JSON object ready for posting.
   */
  const createFinalJsonForPost = () => {
    const currentCopyActivityDetailsObject = JSON.parse(
      JSON.stringify(currentActivityDetailsObject)
    );
    const updatedCopyActivityDetailsObject =
      currentCopyActivityDetailsObject.map((item) => {
        const {
          filterSelection,
          groupWiseList,
          departmentWiseList,
          // performerAvlReasons,
          ...rest
        } = item;
        return rest;
      }); //! this is necessary to remove some custom properties which was used in the ActivityDetails  page

      console.log("Updated Activity List : ",updatedCopyActivityDetailsObject)

    let currentTaskObj = createTask(
      //**  Creating Task
      null,
      //currentAssetForSelectedTask.taskName,
      // currentJobName,
      null,
      currentAssetForSelectedTask.taskId,
      null,
      null,
      null,
      null,
      null,
      null,
      // toggleChecked ? currentActivityDetailsObject : groupOrDeptTaskObj
      updatedCopyActivityDetailsObject //** injecting the activity details object */
    );

    let finalJob = createJobDetails(
      //** creating the final Job Details object */
      currentTaskObj,
      currentJobName,
      "J" + dayjs().format("YYYYMMDDTHHmmssSSS"),
      null,
      // "info@greenwave.co.in", //This wiil further be changed dynamically
      decryptTokenId(localStorage.getItem(env_userId)),
      approver,
      dayjs(fromdate).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
      dayjs(todate).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
      null,
      null,
      priority,
      tag,
      weekdays
    );
    // console.log("Final JSON for post : ", finalJob);
    return finalJob;
  };

  /**
 ** Validates the job details in the modal by checking if the required fields
 //** such as assetGroup, currentJobName, approver, and priority are not empty.
 //** If any of these fields are empty, it sets a validation flag and returns false.
 //** Otherwise, it returns true indicating the validation is successful.
 */
  const checkForValidationsJobDetailsModal = () => {
    if(copyMode) return true; //in copy mode the validations are not required because the data is already present
    if (
      assetGroup === "" ||
      !(task?.taskId ?? "") ||
      currentJobName === "" ||
      approver === "" ||
      priority === ""
    ) {
      setValidationForJobDetailsForModal(true);
      return false;
    }
    return true;
  };


  const handleEventUpdateClick = async () => {
    // console.log("handleEventUpdateClick() called");
    // console.log("Final Json to PUT : ", eventJobDetails);
        let copyEventJob = { ...eventJobDetails };
        setIsLoading(true)
    
        if (
          eventJobDetails.weekdays === "5" &&
          (dayjs(copyEventJob.scheduledJobStartTime).day() === 6 || dayjs(copyEventJob.scheduledJobStartTime).day() === 0)
        ) {
          //i.e saturday or sunday selection need to be checked
          // console.log(
          //   "User is selecting  exclude Saturday and Sunday and also selecting the from date on saturday or sunday "
          // );
          setSeverityText("Weekdays and Start Time selection is not valid !");
          setSeverityType("error");
          setSnackbarOpen(true);
          return;
        } else if (eventJobDetails.weekdays === "6" && dayjs(copyEventJob.scheduledJobStartTime).day() === 0) {
    // console.log("User is selecting Sunday and Fromdate is also Sunday !  ");
          setSeverityText("Weekdays and From Date selection is not valid !");
          setSeverityType("error");
          setSnackbarOpen(true);
          return;
        }
    
    
    // console.log("Start Time Event : ", eventJobDetails.scheduledJobStartTime);
        copyEventJob.scheduledJobStartTime = dayjs(
          eventJobDetails.scheduledJobStartTime
        ).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        copyEventJob.scheduledJobEndTime = dayjs(
          eventJobDetails.scheduledJobEndTime
        ).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    // console.log("Job Details sent for Update => ", copyEventJob);
    
        const newList=fetchCurrentActivityList(copyEventJob.task.activityList,copyEventJob.scheduledJobStartTime,copyEventJob.weekdays)
        copyEventJob.task.activityList=newList
        const success = await updateJobAndActivity(copyEventJob);
        if (success.status === 200) {
          setEventModalClick(false);
          
        const month = dayjs(copyEventJob.scheduledJobStartTime).month() + 1; // 1-12
const year = dayjs(copyEventJob.scheduledJobStartTime).year();
console.log("Month and Year to set after saving repeatable jobs : ", month, year);
        handleDatesSet(month, year);
          setSeverityText("Data Updated successfully ! ");
          setSeverityType("success");
          setSnackbarOpen(true);
          setRefreshData(!refreshData);//* toggling the refreshData to show the updated data because it will trigger the useEffect for fetching the data
          await notifyUsers(copyEventJob,"The Job Details has been updated");
        } else {
          // setEventModalClick(false);
          setSeverityText("Data Updation Failed ! ");
          setSeverityType("error");
          setSnackbarOpen(true);
          // setRefreshData(!refreshData);
        }
        // handleFilterEvents(listEventDate);
        setIsLoading(false)
      };



      const notifyUsers = async(copyEventJob, header) => {
         const toMailList = generateToMailUsers([copyEventJob],allUsersData); //*generate the toMailList users to whom the mail will be forwarded
      const emailSuccess = await  sendEmailNotificationsForAssignedJobs(
        [copyEventJob],
        [...toMailList],
        header,
      );

      console.log('Email has been sent : ',emailSuccess,toMailList)

       const notificationBody = {
  title: "Activity",
  body: header,
  url: "/workflow/performer",
};

      sendBrowserNotification(toMailList,notificationBody);


      }

  /**
   * * Handles the next button click event in the Job Assignment modal.
   * * If the activeStep is 0, it validates the job details and if valid, navigates to the next step.
   * * If the activeStep is 1, it validates the activity details and if valid, creates the final JSON object
   *  *for the job and navigates to the next step.
   *  *If the activeStep is greater than 1, it does nothing.
   */
  const handleNext = async () => {
    setValidationForJobDetailsForModal(false); //** initially making the validations as false since
    setCurrentJobName(currentJobName.trim()); //** this will remove the extra spaces in the beginning if the user is adding any and it will be reflected in the UI as well | this is necessary because if the user is adding extra spaces in the beginning then it will not be visually identifiable but it will create problem in validations and also in the database because of the extra spaces */
    //* everytime the user clicks next everytime the validations will be checked and the validations will be active if the validation check is not matched */
    setValidationForActivityDetails(false);

    if (activeStep === 0) {
      //** it signifies first tab
      // console.log("Previous Page was Job Details");
      if (dayjs().isAfter(fromdate)) {
        //** if  the current datetime is after the selected fromDate which means the user has selected a date in the past */
        // console.log("Current From Date : ", fromdate);
        // console.error("From Date should be greater than current datetime ! ");
        // console.log("From Date  should not be in past ! ");
        setSeverityText(
          "Job can't be assigned in past ! Selected Time : " +
            dayjs(fromdate).format("YYYY-MM-DD HH:mm")
        );
        setSeverityType("error"); //** indication to the user */
        setSnackbarOpen(true);
        setIsSaveDisabled(false);
        setFromdate(new Date(dayjs()));
        return;
      }
      //Saturday-Sunday Check
      //Sat-Sunday  check
      if (
        //** this is the event in which the user has selected a date which is sunday or sat while the user has selected weekdays 5 i.e exclude sat-sunday  */
        weekdays === "5" &&
        (dayjs(fromdate).day() === 6 || dayjs(fromdate).day() === 0)
      ) {
        //i.e saturday or sunday selection need to be checked
        console.log(
          "User is selecting  exclude Saturday and Sunday and also selecting the from date on saturday or sunday "
        );
        setSeverityText("Weekdays and Start Time selection is not valid !");
        setSeverityType("error");
        setSnackbarOpen(true);
        return;
      } else if (weekdays === "6" && dayjs(fromdate).day() === 0) {
        //* this is the event in which the user has selected a  date which is sunday while the weekdays contains exclude sunday
        // console.log("User is selecting Sunday and Fromdate is also Sunday !  ");
        setSeverityText("Weekdays and From Date selection is not valid !");
        setSeverityType("error");
        setSnackbarOpen(true);
        return;
      }
      //**Check for field validations

      const validFields = checkForValidationsJobDetailsModal(); //** check for validations for the first step i.e jobDetailsForModal */
      if (!validFields) {
        setSeverityText("Fill the required data ! ");
        setSeverityType("error");
        setSnackbarOpen(true);
        return;
      } else {
        const foundJobName = allJobs.some(
          //* finding any jobname that was previously used
          (data) =>
            data?.jobName?.trim()?.toLowerCase() ===
            currentJobName?.toLowerCase()?.trim()
        );
        if (foundJobName) {
          //** the jobname needs to be unique */
          setValidationForJobDetailsForModal(true);
          setSeverityText("Job Name already exists ! ");
          setSeverityType("error");
          setSnackbarOpen(true);
          return;
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1); //* if the validations for the first step is verified then go to the next step
      }
    }
    if (activeStep === 1) {
      //* this is for the second step

      const blankapprover = currentActivityDetailsObject.find(
        (data) => data.approver === ""
      ); //** finding any activity for which the approver might be left unselected */

      const blankasset = currentActivityDetailsObject.find(
        //* finding any activity asset that has been left unselected if there is any
        (data) => data.assetName === "" && data.assetIDList.length > 0
      );

      const isBlankPerformerAvailable = currentActivityDetailsObject.find(
        (data) => data?.groupOrDept === false && data.performer === ""
      ); //** finding any activity where the performer has not been selected in case of the performer type is individual */

      //* Even if the performer is unavailable it will be allowed to perform | usecase when the performer is associated with multiple projects
      if (
        isBlankPerformerAvailable || //**if any of the conditions are matched then the validation check fails so an indication will be send the user */
        // isBlankGroupOrDept ||
        blankapprover ||
        blankasset
      ) {
        setValidationForActivityDetails(true);
        setSeverityType("error");
        setSeverityText("Fill the required fields!");
        setSnackbarOpen(true);
        return;
      }

      let finalJobObj = createFinalJsonForPost(); //** creating the final Job object if all the validations are matched that will be pushed to the db */
      // console.log("Current Final Job : ", finalJobObj);
      if (finalJobObj) {
        setFinalJob(finalJobObj);
      } else {
        setSeverityText("Error !");
        setSeverityType("error");
        setSnackbarOpen(true);
        return;
      }
      console.log('Active Step proceeding')
      setActiveStep((prevActiveStep) => prevActiveStep + 1); //** proceeding to next step */
      // }
    }

    if (activeStep > 1) {
      //* this is for the third step
      setActiveStep((prevActiveStep) => prevActiveStep + 1); //** proceeding to next step */
    }

  };

  /**
   * Decrements the active step in the stepper component, allowing the user
   * to navigate to the previous step in the workflow.
   */
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  /**
   * This function is responsible for posting multiple jobs to the database
   * It takes in lastStartTime and lastStopTime as parameters
   * It first checks if the repeat checkbox was checked
   * If it was, it calculates the repeat interval and other relevant dates
   * It then enters a while loop which runs until the repeatTill date is reached
   * In each iteration of the loop, it creates a new job and adds it to an array
   * It then adjusts the start time of the next job based on the repeat interval and other factors
   * After the loop is finished, it sends an email to all the performers of the newly created jobs
   * @param {string} lastStartTime - the start time of the last scheduled job
   * @param {string} lastStopTime - the stop time of the last scheduled job
   * @returns {boolean} - true if all jobs were pushed successfully, false otherwise
   */
  const postMultipleJobs = async (lastStartTime, lastStopTime) => {
    // console.log("postMultipleJobs() => Repeat was checked !");
    const repeatInterval_value = repeatInterval;
    const repeatHour_value = repeatHour;
    const repeatMinute_value = repeatMinute;
    const repeatTill_value = dayjs(repeatJobDate).add(1, "day"); //** for adjustment in while loop i.e to include the repeat day , the day it was selected
    // console.log("WeekDay Selected : ", weekdays);
    // console.log("Last Scheduled formatted Start Time : ", lastStartTime);
    // console.log("Last Scheduled formatted Stop Time : ", lastStopTime);
    // console.log(
    //   "Repeat Interval Day : ",
    //   repeatInterval_value,
    //   " Repeat Hour : ",
    //   repeatHour_value,
    //   "Repeat Minute : ",
    //   repeatMinute_value,
    //   " Repeat Till : ",
    //   repeatTill_value
    // );
    // const jobScheduledDateTimeList = [];
    //  if(repeatInterval_value===0)//special case the job should start after current scheduledEndTime gets completed
    //  {

    //  }
    //  else
    //  {
    //console.log("Repeat Interval was greater than 0")

    let futureJobStartTime = dayjs(lastStartTime); //** the repeat Interval will be calculated from the last job starttime

    //change this if considering the start from last immediate stop
    // console.log(
    //   "JobStarttime to enter while loop => ",
    //   futureJobStartTime.format("YYYY-MM-DDTHH:mm")
    // );

    let finalRepeatableJobsArray = [];
    // let jobcount = 0;
    while (futureJobStartTime.isBefore(repeatTill_value)) {
      // console.log(
      //   "Previous futureJobStartTime : ",
      //   futureJobStartTime.format("YYYY-MM-DDTHH:mm")
      // );
      futureJobStartTime = futureJobStartTime.add(repeatInterval_value, "day");
      futureJobStartTime = futureJobStartTime.add(repeatHour_value, "hour");
      futureJobStartTime = futureJobStartTime.add(repeatMinute_value, "minute");
      // console.log(
      //   "Current Activity Total Duration : ",
      //   currentTotalActivityDuration
      // );
      // console.log("futureJobStartTime.day() : ", futureJobStartTime.day());
      // console.log(
      //   "Current futureJobStartTime : ",
      //   futureJobStartTime.format("YYYY-MM-DDTHH:mm")
      // );
      // This is the event to skip saturday or sunday
      if (weekdays === "5") {
        // Skip Saturday and Sunday
        // console.log("Weekdays 5 Check entered");
        if (futureJobStartTime.day() === 6) {
          //** i.e  if the calculated future jobstarttime is coming to Saturday and the weekday selection is 5 then need to skip 2 days
          // Saturday
          // console.log(
          //   "Current Day to skip =>  ",
          //   "Saturday",
          //   "WeekDay check =>",
          //   weekdays
          // );
          futureJobStartTime = futureJobStartTime.add(2, "day"); // Skip Saturday and Sunday
        } else if (futureJobStartTime.day() === 0) {
          // Sunday
          // console.log(
          //   "Current Day to skip =>  ",
          //   "Sunday",
          //   "WeekDay check =>",
          //   weekdays
          // );
          futureJobStartTime = futureJobStartTime.add(1, "day"); // Skip Sunday
        }
      } else if (weekdays === "6") {
        //** this is the event to skip sunday only */
        // Skip Sunday
        // console.log("Weekdays 6 Check entered");
        if (futureJobStartTime.day() === 0) {
          // Sunday
          // console.log(
          //   "Current Day to skip =>  ",
          //   "Sunday",
          //   "WeekDay check =>",
          //   weekdays
          // );
          futureJobStartTime = futureJobStartTime.add(1, "day"); // Skip Sunday
        }
      }

      // let futureJobStopTime = futureJobStartTime
      //   .clone()
      //   .add(currentTotalActivityDuration, "minute");
      // console.log(
      //   "Future Job Stop Time : ",
      //   futureJobStopTime.format("YYYY-MM-DDTHH:mm")
      // );
      // jobScheduledDateTimeList.push(
      //   futureJobStartTime.format("YYYY-MM-DDTHH:mm")
      // );
      // jobScheduledDateTimeList.push(
      //   futureJobStopTime.format("YYYY-MM-DDTHH:mm")
      // );

      if (futureJobStartTime.isBefore(repeatTill_value)) {
        // jobcount = jobcount + 1;
        await new Promise((resolve) => setTimeout(resolve, 10)); //** a delay of 10 ms is made to make the jobId unique */
        // console.log("Current Final Job :", finalJob);
        let currentnewJob = await createNewJob(
          //** creating new Job based on calculated scheduled start and stop */
          futureJobStartTime
          // futureJobStopTime
          // jobcount
        );
        // console.log("Current new Job : ", currentnewJob);
        finalRepeatableJobsArray.push(currentnewJob);
      }
      //futureJobStartTime=futureJobStopTime.clone()

      //}
    }

   
    finalRepeatableJobsArray.unshift(finalJob); //** injecting the first job created into the first index */
    finalRepeatableJobsArray = finalRepeatableJobsArray.map((job, index) => {
      const copyJob = { ...job };
      copyJob.jobName =
        copyJob.jobName +
        "_" +
        (index + 1) + //**indication  of the repeatable jobs ,lets say 3 repeatable jobs have been calculated then,<jobname>_1/3 ,<jobname>_2/3....... so on
        "/" +
        finalRepeatableJobsArray.length;
      return copyJob;
    });

    //Communicating with Db
    let pushedData = null;
    try {
      pushedData = await Promise.all(
        //it return an array of resolved promises with jobdata
        finalRepeatableJobsArray.map(async (data) => {
          try {
            const success = await updateJobAndActivity(data);
            if (success?.status === 200) {
              // console.log("Job Saved Successfully");
              return data;
            } else {
              throw new Error(`Job failed to save !`);
            }
          } catch (error) {
            // console.error("Error saving job:", error);
            throw error; // Rethrow the error to be caught in the outer catch block
          }
        })
      );
    } catch (e) {
      // console.error("Error in pushing jobs to the database:", e);
      // throw new Error("One or more jobs failed to push to the database.");
      // console.error("One or more jobs failed to push to the database.");
      return false;
    }

    // console.log("All jobs pushed successfully:", pushedData);

    // console.log(pushedData.length, finalRepeatableJobsArray?.length);
    if (pushedData.length === finalRepeatableJobsArray.length) {
      //* if the length of resolved promises is equal to the length of target repeatable jobs then all the data has been processed successfully
      //Now a mail will be send to inform the performers of the assigned jobs

      const toMailList = generateToMailUsers(finalRepeatableJobsArray,allUsersData); //*generate the toMailList users to whom the mail will be forwarded
      const emailSuccess = await sendEmailNotificationsForAssignedJobs(
        finalRepeatableJobsArray,
        [...toMailList]
      );

      
    
      // console.error('Email Service has been deactivated for repeatable jobs')
      // const emailSuccess = true;
      if (emailSuccess) {
        // console.log("All Emails have been processed successfully ! ");
        //Now notifications will be pushed to the users for the assigned jobs

       
      } else {
        // console.error("Error in sending mails");
      }

      return true; //* if the length of resolved promises is equal to the length of target repeatable jobs then all the data has been pushed to db successfully
    }
    return false; //* by default return false if none of the above data is  processed correctly
  };

  /**
   * Given an array of final repeatable jobs, this function will generate a Set of
   * unique userIds of all the performers of the activities in the jobs. The userIds
   * are determined based on the performerType of each activity, which can be either
   * "group", "department", or "individual". If the performerType is "group", the
   * userIds of all the users in the specified group are added to the Set. If the
   * performerType is "department", the userIds of all the users in the specified
   * department are added to the Set. If the performerType is "individual", the
   * userId of the specified performer is added to the Set.
   *
   * @param {Array} finalRepeatableJobsArray - The array of final repeatable jobs
   * @returns {Set} - The Set of userIds of all the performers of the activities in
   * the jobs
   */
  // const generateToMailUsers = (finalRepeatableJobsArray) => {
  //   const toMailList = new Set(); //*unique toMail users
  //   finalRepeatableJobsArray.forEach((job) => {
  //     job.task.activityList.forEach((activity) => {
  //       if (activity.performerType.toLowerCase() === "group") {
  //         //* if the activity performers type is group then all the users belonging to that group will be added
  //         // console.log("Group ! ");
  //         const performers = allUsersData
  //           .filter((user) =>
  //             user.group.some(
  //               (group) => group.groupName === activity.groupOrDeptName
  //             )
  //           )
  //           .map((user) => user.userID);

  //         performers.forEach((user) => toMailList.add(user));
  //       } else if (activity.performerType.toLowerCase() === "department") {
  //         //deprecated
  //         // console.log("Department ! ");
  //         const performers = allUsersData
  //           .find((user) =>
  //             user.department.some(
  //               (dept) => dept.deptName === activity.groupOrDeptName
  //             )
  //           )
  //           .map((user) => user.userID);

  //         performers.forEach((user) => toMailList.add(user));
  //       } else {
  //         toMailList.add(activity.performer); //by default performer will be added
  //       }
  //     });
  //   });
  //   return toMailList;
  // };

  /**
   * Send email notifications for the assigned jobs.
   *
   * @param {Array} finalRepeatableJobsArray - The array of final repeatable jobs
   * @param {Set} toMailList - The Set of userIds to whom the email notifications will be sent
   * @returns {boolean} - Returns true if the email notifications are sent successfully, otherwise false
   */
  const sendEmailNotificationsForAssignedJobs = async (
    finalRepeatableJobsArray,
    toMailList,
    header
  ) => {
    // console.log("sendEmailNotificationsForAssignedJobs() called ");
    console.log(
      "toMailList in sendEmailNotificationsForAssignedJobs",
      toMailList
    );
    const homePage = process.env.REACT_APP_PERFORMERPAGE;

    // toMailList.push("Suraj.Shaw@greenwave.co.in")

    try {
      const emailNotifications = await Promise.all(
        finalRepeatableJobsArray.map(async (data) => {
          try {
            let finalMailHtml = createHtmlString(data, homePage,header); //** generating the HTML page for sending the data in email */
            finalMailHtml = finalMailHtml
              .replace(/^<div>/, "") //**replacing the surrounding outer divs */
              .replace(/<\/div>$/, "");
            // console.log("HTML : ", finalMailHtml);
            const mailObject = {
              toMailIds: toMailList,
              messageSubject: header ?? "You have been assigned to a Job",
              htmlPage: finalMailHtml,
              emailCc:[data.approver] //** adding the approver in cc because the approver also needs to be notified about the assigned job */
            };
            const success = await sendEmail(mailObject);
            if (success?.status === 200) {
              // console.log("Email Send Successfully");
              return data;
            } else {
              throw new Error(`Email Error`);
            }
          } catch (error) {
            // console.error("Error sending mail:", error);
            throw error; // Rethrow the error to be caught in the outer catch block
          }
        })
      );

//       console.log('Notifying..')


//        const notificationBody = {
//   title: "Activity",
//   body: "You have a new activity to perform",
//   url: "/workflow/performer",
// };

// const notifications=await Promise.all(
//   [...toMailList].map(user =>
//     sendNotification(getTenantID(),user, notificationBody)
//   )
// );

// console.log('Notifications : ',notifications)
 const notificationBody = {
  title: "Activity",
  body: "You have a new activity to perform",
  url: "/workflow/performer",
};
sendBrowserNotification(toMailList, notificationBody);
      if (emailNotifications.length > 0) return true; //i.e all the emails have been processed successfully because on encountering an error it will go to the catch block
    } catch (e) {
      // console.error("Error in sending  mails :", e);
      // throw new Error("One or more jobs failed to push to the database.");
      // console.error("One or more jobs failed to push to the database.");
      return false;
    }
  };
  /**
   * Creates an HTML string from the data and forwardLink passed as arguments.
   * This function is used to create the HTML body of an email notification.
   * @param {Object} data the data to be converted to HTML
   * @param {string} forwardLink the home page link to be included in the email
   * @returns {string} HTML string
   */
  const createHtmlString = (data, forwardLink,header) => {
    // console.log("forwardLink in createHtml", forwardLink);
    const updatedData = { ...data, forwardLink: forwardLink,header: header };
    const htmlData = ReactDOMServer.renderToString(
      <EmailJobAssign data={updatedData} />
    );
    return htmlData;
  };


  const sendBrowserNotification = (toMailList,notificationBody) => {
 console.log('Notifying..')


//       s

const notifications= Promise.all(
  [...toMailList].map(user =>
    sendNotification(getTenantID(),user, notificationBody)
  )
);

  }

  /**
   * Creates a new job based on the given future job start time and stop time.
   * Copies the final job details, updates the scheduled start and end times, and generates a unique job ID.
   * Optionally performs performer availability checks for each activity in the job.
   * @param {Object} futureJobStartTime - The future start time of the job
   * @returns {Object} - Returns the newly created job with updated details
   */
  const createNewJob = async (
    futureJobStartTime
    // futureJobStopTime
    // jobcount
  ) => {
    // console.log("Current Final Job in createNewJob", finalJob);
    // console.log(
    //   "CreateNewJob() : ",
    //   futureJobStartTime.format("YYYY-MM-DDTHH:mm"),
    //   " ",
    //   futureJobStopTime.format("YYYY-MM-DDTHH:mm")
    // );
    let copyJob = JSON.parse(JSON.stringify(finalJob));
    // let current_starttime = dayjs(futureJobStartTime);

    copyJob.scheduledJobStartTime = futureJobStartTime.format(
      "YYYY-MM-DDTHH:mm:ss.SSSZ"
    );
    copyJob.jobID = "J" + dayjs().format("YYYYMMDDTHHmmssSSS");
    // copyJob.jobName = copyJob.jobName + "_" + jobcount; //*since  the jobname should be unique
    console.log(
      "copyJob after just changing the main start and stop : ",
      copyJob
    );

    const newActivityList = fetchCurrentActivityList(
      // ** scheduling the activities start and stop and injecting the new activityList
      copyJob.task.activityList,
      copyJob.scheduledJobStartTime,
      weekdays
    );
    // console.log("newActivityList:", newActivityList);
    copyJob.task.activityList = newActivityList;

    // }
    const adjustedJobEndDateTime = adjustForWeekdays(
      //
      copyJob.scheduledJobStartTime,
      currentTotalActivityDuration,
      weekdays
    ); //** this method is necessary to calculate the job endTime after adjusting the weekdays and handling all the parametes */
    copyJob.scheduledJobEndTime = adjustedJobEndDateTime.format(
      "YYYY-MM-DDTHH:mm:ss.SSSZ"
    );
    return copyJob; //* returning the copyJob
  };

  /**
   * Handles the save event for job assignments.
   * It performs validation checks, including ensuring the job and repeat dates are not in the past.
   * If repeat is enabled, it checks that a repeat interval is set and posts multiple jobs.
   * If the save is successful, it updates the UI with a success message, otherwise, it shows an error.
   * It also handles email notifications for assigned jobs.
   */
  const handleSave = async () => {
    // console.log("handleSave() called");
    setIsSaveDisabled(true);
    // setValidationsForRepeatJob(false)
    // console.log("Current Repeat Till Date ", repeatJobDate);

    if (dayjs().isAfter(fromdate)) {
      //* while saving if the selected time lies before the current datetime then an error message will be shown
      // console.log("From Date always  current datetime ! ");
      // console.log("From Date  should not be in past ! ");
      setSeverityText(
        "Job can't be assigned in past ! Selected Time : " +
          dayjs(fromdate).format("YYYY-MM-DD HH:mm")
      );
      setSeverityType("error");
      setSnackbarOpen(true);
      setIsSaveDisabled(false);
      return;
    }

    if (dayjs().isAfter(repeatJobDate) && isRepeatChecked) {
      //* similarly in case of the selected time lies before the current datetime then an error message will be shown while the repeat is checked
      // console.log("Repeat Till is current datetime ! ");
      // console.log("Repeat till can't be assigned in past ! ");
      setSeverityText(
        "Repeat till can't be assigned in past ! Repeat Till Time : " +
          repeatJobDate.format("YYYY-MM-DD HH:mm")
      );
      setSeverityType("error");
      setSnackbarOpen(true);
      setIsSaveDisabled(false);
      return;
    }

    //* this if block is for posting multiple jobs
    if (isRepeatChecked === true) {
      if (repeatHour === 0 && repeatInterval === 0 && repeatMinute === 0) {
        setSeverityText("Please select repeat interval");
        setSeverityType("error");
        setSnackbarOpen(true);
        // setValidationsForRepeatJob(true)
        setIsSaveDisabled(false);
        return;
      }

      //Posting multiple jobs
      const success = await postMultipleJobs(
        finalJob.scheduledJobStartTime,
        finalJob.scheduledJobEndTime
      ); //snackbar info is already grtting invoked in the above method

      if (success) {
        setSeverityText("Jobs saved successfully");
        setSeverityType("success");
        setSnackbarOpen(true);
        setIsSaveDisabled(false);
        setRefreshData(!refreshData);
        setOpenDialog(false);
    
        const month = dayjs(finalJob.scheduledJobStartTime).month() + 1; // 1-12
const year = dayjs(finalJob.scheduledJobStartTime).year();
console.log("Month and Year to set after saving repeatable jobs : ", month, year);
        handleDatesSet(month, year);
         handleFilterEvents(dayjs(fromdate).format("YYYY-MM-DD"));
        handleReset();
      } else {
        setSeverityText("Error !");
        setSeverityType("error");
        setSnackbarOpen(true);
        setIsSaveDisabled(false);
      }

      return; //* returning concluding the save for multiple jobs
    }
    console.log('Final Job :',finalJob);
    //* when a single job need to be processed
    const success = await updateJobAndActivity(finalJob);


        const month = dayjs(finalJob.scheduledJobStartTime).month() + 1; // 1-12
const year = dayjs(finalJob.scheduledJobStartTime).year();
console.log("Month and Year to set after saving repeatable jobs : ", month, year);
        handleDatesSet(month, year);
         handleFilterEvents(dayjs(fromdate).format("YYYY-MM-DD"));
    //const success=true
    //! MAIL SERVICE
    if (success?.status === 200) {
      //process mail
      const finalRepeatableJobsArray = [];
      finalRepeatableJobsArray.push(finalJob);
      const toMailList = generateToMailUsers(finalRepeatableJobsArray,allUsersData); //*generate the toMailList users to whom the mail will be forwarded
      const emailSuccess =  sendEmailNotificationsForAssignedJobs(
        finalRepeatableJobsArray,
        [...toMailList]
      );
      // console.error("Mail Service is deactivated");
      //const emailSuccess = true;
      // if (emailSuccess) {
        // console.log("Single Mail have been processed successfully ! ");
      // } else {
        // console.error("Error in sending mails");
      // }
      // console.log("Data has been posted successfully !");
      setSeverityText("Data saved successfully ! ");
      setSeverityType("success");
      setIsSaveDisabled(false);
      setSnackbarOpen(true);
      setOpenDialog(false);
      handleReset();
      // setRefreshData(!refreshData);
    } else {
      // console.log("Error !!! Data has not been posted successfully !");
      setSeverityText("Error !");
      setSeverityType("error");
      setIsSaveDisabled(false);
      setSnackbarOpen(true);
    }
  };

  /**
   * Handles the filtering of events based on the selected date from the date picker.
   * It takes the new selected date as the parameter and filters the events based on
   * the selected date. It compares the date of the event with the selected date and
   * if they match, it adds the event to the filteredEvents array. It then sets the
   * filteredEventsList state with the filteredEvents array and returns the
   * filteredEvents array.
   * @param {Date} newValue - The new selected date from the date picker
   * @returns {array} - The filtered events array
   */
  const handleFilterEvents = async(newValue) => {
    console.log("handleFilterEvents() called");
    console.log("Current New Value: ", newValue);
    dayjs()
    // let filteredEvents = [];
    let selectedTime = dayjs(newValue).startOf('day'); //** resetting the time to 00:00:00 for accurate comparison */
    console.log("Month: ", selectedTime.month());
    console.log("Year: ", selectedTime.year());
    console.log('Selected Date : ',selectedTime.format('YYYY-MM-DD'))
    //console.log("Date: ", selectedTime.date());

    //* iterating the currentEvents and fetching the events based on the data selected

    const filteredJobs=await getJobsByDateAndUser(getCurrentUser(),selectedTime.format('YYYY-MM-DD'));
    console.log('Filtered Jobs : ',filteredJobs)

const updatedJobs = filteredJobs
  ?.map(event => ({
    id: event.jobID,
    title: event.jobName,
    start: event.scheduledJobStartTime,
    end: event.scheduledJobEndTime,
    jobId: event.jobID,
    eventStatus: event.jobStatus,
    eventEndTime: event.scheduledJobEndTime,
    priority: event.priority,
    description: `Priority: ${event.priority} Job ID: ${event.jobID} JobName: ${event.jobName}`
  }));


    // currentEvents.forEach((data) => {
    //   //console.log("Data: ", data);
    //   let currentDate = dayjs(data.start);
    //   if (  
    //     currentDate.date() === selectedTime.date() &&
    //     currentDate.month() === selectedTime.month() &&
    //     currentDate.year() === selectedTime.year()
    //   ) {
    //     //console.log("Data found: ", data);
    //     filteredEvents.push(data);
    //   }
    // });


    // setCurrentCalendarDate({...currentCalendarDate,selectedCalendarDate:{month:selectedTime.month()+1,year:selectedTime.year()}});
    // console.log('current Calendar Date : ',currentCalendarDate)

    console.log("Current  Events: ", updatedJobs);

    setfilteredEventsList(updatedJobs);
    // return filteredJobs;
  };

  /**
   * Handles the click event on a list item in the events list. It fetches the job
   * details from the database based on the selected event and updates the
   * eventJobDetails state. If the selected event is in the past, an error message
   * is shown. It also opens the event modal to allow the user to edit the event.
   * @param {Object} data - The event data object containing the event details
   * @returns {void}
   */
  const handleListItemClick = async (data) => {
    //console.log("handleListItemClick() called");
    // console.log("Event Selected => ", data);
    //console.log(" Event Title : ", data.title); //remember this is the taskname which will be used to get data from the database
    //console.log(" Event Start : ", data.start);
    //console.log(" Event Stop : ", data.eventEndTime);
    message.loading('Fetching Job Details...');
    let eventStart = dayjs(data.start).format("YYYY-MM-DD HH:mm:ss.SSS");
    let eventStop = dayjs(data.eventEndTime).format("YYYY-MM-DD HH:mm:ss.SSS");
    //console.log(
    //   "Formatted Start : ",
    //   eventStart,
    //   "  Formatted Stop : ",
    //   eventStop
    // );

    // const currentYear = dayjs().year();
    // const currentMonth = dayjs().month() + 1; //index starts from 0 for month count
    // const currentDay = dayjs().date();
    // const currentHour = dayjs().hour();
    // const currentMinute = dayjs().minute();

    // const selectedYear = dayjs(data.start).year();
    // const selectedMonth = dayjs(data.start).month() + 1;
    // const selectedDay = dayjs(data.start).date();
    // const selectedHour = dayjs(data.start).hour();
    // const selectedMinute = dayjs(data.start).minute();

    // console.log("Current Date and Time:");
    // console.log(
    //   `Year: ${currentYear}, Month: ${currentMonth}, Day: ${currentDay}, Hour: ${currentHour}, Minute: ${currentMinute}`
    // );

    // console.log("Selected Date and Time:");
    // console.log(
    //   `Year: ${selectedYear}, Month: ${selectedMonth}, Day: ${selectedDay}, Hour: ${selectedHour}, Minute: ${selectedMinute}`
    // );

    // If eventStart is less than the current date then the job should not be allowed to update/delete
    // if (
    //   selectedYear < currentYear ||
    //   (selectedYear === currentYear &&
    //     (selectedMonth < currentMonth ||
    //       (selectedMonth === currentMonth &&
    //         (selectedDay < currentDay ||
    //           (selectedDay === currentDay &&
    //             (selectedHour < currentHour ||
    //               (selectedHour === currentHour &&
    //                 selectedMinute < currentMinute)))))))
    // ) {
    //   // const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
    //   // dayjs.extend(isSameOrBefore);

    //   // if (dayjs().isSameOrBefore(dayjs(data.start))) {
    //   console.log("Previous date was selected !");
    //   setSeverityText(`Past Job cannot be modified ! `);
    //   setSeverityType("error");
    //   setSnackbarOpen(true);
    //   return;
    // }

    //the job status which is 'Not Started' state will be able to modify
    let fetchedEventJob = await getOnEventClickJob(
      //* fetch the event details
      // eventStart,
      // eventStop,
      data.title,
      data.id
    );
    // console.log('Fetched Event Job : ',fetchedEventJob)
     message.destroy();
    //  fetchedEventJob.jobID=null
    if (fetchedEventJob?.jobID) {
      // console.log("Fetched Event Jobs : ", fetchedEventJob);
      setEventJobDetails(fetchedEventJob);
        message.success('Success', 1.5);
    } else {
      // console.log("The selected event job has no jobID !");
      // setSeverityText("Error ! ");
      // setSeverityType("error");
      // setSnackbarOpen(true);
       message.error('Error', 1);
      return; //** after encountering an error return */
    }

    setEventModalClick(true); //* after the data has been processed show the EventModal
  };

  const variants = {
    //**framer motion properties
    initial: { x: "100vw" },
    animate: { x: 0 },
    exit: { x: "-100vw", transition: { ease: "easeInOut" } },
  };

  const fadeInOutAnimation = {
    //**framer motion properties
    hidden: { opacity: 0, x: -100 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        ease: "easeInOut",
        duration: 1,
        staggerChildren: 0.6,
      },
    },
  };


/**
 * This function is called after the event component has been rendered.
 * It's used to style the event based on its priority.
 * @param {Object} info - The event component and its properties.
 * @returns {void}
 */
  const handleEventDidMount = (info) => {
    // Get event start and end times
    // const start = new Date(info.event.start);
   const  backgroundColor=
   info.event.extendedProps.priority?.toLowerCase() ===
    "critical"
      ? "#ffcdd2" //showing the priority of job
      : info.event.extendedProps.priority?.toLowerCase() ===
        "low"
      ? "#bbdefb"
      : "#ffe0b2"
  
    info.el.style.backgroundColor = backgroundColor;
    // info.el.style.border = "1px solid black";
    info.el.style.boxShadow = "1px 1px 3px 1px rgba(0, 0, 0, 0.2)";



  };
  //   // Set border color based on priority

  //Passing the props 
  const eventContent=(arg) => {
    console.log('Arg :',arg)
    return (
      <>
     
      <Box
        sx={{
          display: isMobile ? "grid" : "flex",
          alignItems: "center",
          padding: "2px 6px", // Smaller padding
          // border: ".1px solid black",
          //
          backgroundColor:
            arg.event.extendedProps.priority?.toLowerCase() ===
            "critical"
              ? eventBackgroundColor["Critical"] //showing the priority of job
              : arg.event.extendedProps.priority?.toLowerCase() ===
              eventBackgroundColor["Low"]
              ? "#bbdefb"
              : eventBackgroundColor["Normal"],
          borderRadius: "6px", // Slight rounding for a clean look
          fontSize: "0.7rem", // Smaller text for concise appearance
          // maxWidth: '1.5rem', // Limit width to prevent long overflow
          overflow: "hidden", // Ensures no overflow
          // textOverflow: 'ellipsis', // Add ellipsis for overflow
          // whiteSpace: 'nowrap', // Keep everything on one line
          cursor: "pointer",
        }}
      >
        {/* {
        arg.event.extendedProps.eventStatus.toLowerCase()==="started"?
        (
        <div style={{width:".5rem"}}>
          <LinearProgress/>
        </div>
        ):(<div>
           <FiberManualRecordIcon 
          fontSize="small" 
          sx={{ color:arg.event.extendedProps.eventStatus.toLowerCase()==="rejected"?"red":arg.event.extendedProps.eventStatus.toLowerCase()==="completed"?"green":"#1976d2"
            
            , marginRight: '4px',fontSize:'.7rem'}} 
        />
        </div>)
       } */}
        {isMobile || (
          <div>
            <FiberManualRecordIcon
              fontSize="small"
              sx={{
                color:
                  arg.event.extendedProps.priority?.toLowerCase() ===
                  "critical"
                    ? "red"
                    : arg.event.extendedProps.priority?.toLowerCase() ===
                      "low"
                    ? "blue"
                    : "orange",

                marginRight: "4px",
                fontSize: ".7rem",
              }}
            />

            {/* {arg.event.extendedProps.eventStatus.toLowerCase()} */}
          </div>
        )}
        {/* {JSON.stringify(arg)+'hello'} */}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <strong
            style={{
              color: "#333",
              fontWeight: 700,
              paddingLeft: isMobile ? "0.1rem" : ".4rem",
              paddingRight: isMobile ? "0.1rem" : ".4rem",
              whiteSpace: "nowrap",
              // wordWrap: "break-word",
              //overflowWrap: "break-word",
              textOverflow: "ellipsis",
              //fontSize: "clamp(0.8rem, 2.5vw, 1.2rem)"
              //width:"20px"
              overflow: "hidden",
            }}
          >
            {arg.event.title}
             {/* {arg.event.extendedProps?.adhoc &&  <FontAwesomeIcon color="black" icon={"fa-solid fa-clipboard-list"} />} */}
          </strong>
          
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: isMobile ? "center" : "",
          }}
        >
          {(arg.event.extendedProps.eventStatus?.toLowerCase() ===
            "rejected" || arg.event.extendedProps.eventStatus?.toLowerCase() ===
            "aborted") && (
            <Tooltip title="Job Rejected">
              <DangerousIcon
                fontSize="small"
                color="error"
                sx={{
                  width: "0.9rem",
                  height: "0.9rem",
                  marginRight: "0.2rem",
                }}
              />
            </Tooltip>
          )}
          {arg.event.extendedProps.eventStatus?.toLowerCase() ===
            "completed" && (
            <Tooltip title="Job Completed">
              <CheckCircleRoundedIcon
                fontSize="small"
                color="success"
                sx={{
                  width: "0.9rem",
                  height: "0.9rem",
                  marginRight: "0.2rem",
                }}
              />
            </Tooltip>
          )}
          {arg.event.extendedProps.eventStatus?.toLowerCase() ===
            "started" && (
            <Tooltip title="Job Started">
              {/* <LinearProgress
                sx={{
                  width: "0.5rem",
                  height: "0.5rem",
                  marginRight: "0.2rem",
                }}
              /> */}
              <div style={{ display: isMobile ? "grid" : "" }}>
                <Hourglass
                  visible={true}
                  height={isMobile ? "9" : "12"}
                  width={isMobile ? "9" : "12"}
                  colors={["green", "lightgreen"]}
                />
              </div>
            </Tooltip>
          )}
        </Box>
      </Box>
      </>
    );
  }


 // Passing as props
  const repeatJobProps = {
    fromdate,
    repeatJobDate,
    setRepeatJobDate,
    repeatInterval,
    setRepeatInterval,
    repeatHour,
    setRepeatHour,
    repeatMinute,
    setRepeatMinute,
    currentTotalActivityDuration,
    weekdays,
  };


  const jobDetailsProps = {
    assetGroup,
    assetGroupList,
    task,
    taskList,
    approver,
    approverList,
    weekdays,
    fromdate,
    todate,
    priority,
    setPriority,
    priorityList,
    tag,
    setAssetGroup,
    setAssetGroupList,
    setTask,
    setTaskList,
    setApprover,
    setApproverList,
    setWeekdays,
    setFromdate,
    setTodate,
    setTag,
    toggleChecked,
    settoggleChecked,
    currentAssetData,
    setCurrentAssetData,
    severityText,
    setSeverityText,
    severityType,
    setSeverityType,
    snackbarOpen,
    setSnackbarOpen,
    userGroupMap,
    setUserGroupMap,
    currentJobName,
    setCurrentJobName,
    currentTotalActivityDuration,
    setCurrentTotalActivityDuration,
    tagList,
    setTagList,
    currentAssetForSelectedTask,
    setCurrentAssetForSelectedTask,
    currentActivityDetailsObject,
    setCurrentActivityDetailsObject,
    assetDataFromDb,
    setAssetDataFromDb,
    allGroupedUsersData,
    setAllGroupedUsersData,
    setUserEditedActivityDetails,
    allUsersData,
    setAllUsersData,
    copytoallperformer,
    setCopytoallperformer,
    validationForJobDetailsForModal,
    setValidationForJobDetailsForModal,
    allAssetGroupData,
    setAllAssetGroupData,
    setIsLoading,
    copyMode,
    setCopyMode,
    eventJobDetails,
    setEventJobDetails,
    allJobs
  };

  const activityDetailsProps = {
    currentActivityDetailsObject, // List of activity details objects to save the job with activities to the database
    task,
    setCurrentActivityDetailsObject,
    currentAssetForSelectedTask,
    userEditedActivityDetails,
    setUserEditedActivityDetails,
    approverList: activityApproverList,
    setApproverList: setActivityApproverList,
    performerList,
    setPerformerList,
    fromdate,
    todate,
    toggleChecked,
    userGroupMap,
    allUsersData,
    copytoallperformer,
    setCopytoallperformer,
    validationForActivityDetails,
    setSeverityText,
    setSeverityType,
    setSnackbarOpen,
    severityText,
    severityType,
    snackbarOpen,
    setIsLoading,
    departmentMap,
    allGroupedUsersData,
    weekdays,
    currentTotalActivityDuration,
  };
  
  
  const eventJobProps = {
    eventJobDetails,
    setEventJobDetails,
    approverList: activityApproverList,
    setApproverList: setActivityApproverList,
    tagList,
    setTagList,
    priorityList,
    allUsersData,
    setAllUsersData,
    setEventModalClick,
    setSnackbarOpen,
    setSeverityText,
    setSeverityType,
    refreshData,
    setRefreshData,
    weekdays,
    setWeekdays,
    setIsSaveDisabled,
    confirmationDialog,
    setConfirmationDialog,
    handleEventUpdateClick,
    copyMode,
    setCopyMode,
    listEventDate,
    handleFilterEvents,
    notifyUsers,
    handleDatesSet

  };

  
  // const isOnline = useNetwork();
  
  
  return (
    <Container
      maxWidth="lg"
      sx={{
        padding: "0 !important",
        background: "white",
        boxShadow: "1px 1px 2px #9fa3a7bf",
        borderRadiusadius: "0.3rem",
      }}
    >
{/* {isOnline ? "Online": "Offline"} */}
      <>
        {/* alert for any updates or errors */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={(event, reason) => handleSnackBarClose(event, reason)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleSnackBarClose}
            severity={severityType} // You can adjust severity based on your requirement
            sx={{ width: "100%" }}
          >
            {severityText}
          </MuiAlert>
        </Snackbar>
        {isMobile && (
          <>
            <Accordion sx={{ background: "#e0e0e0", marginBottom: "0.5rem" }}>
              <AccordionSummary
                expandIcon={<ArrowDownwardIcon sx={{ color: "#607d8b" }} />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography
                  //variant="h6"
                  sx={{
                    background: "#607d8b",
                    color: "white",
                    padding: "3px 15px",
                    borderRadius: "1rem",
                    fontSize: "0.8rem",
                  }}
                >
                  Events
                </Typography>
              </AccordionSummary>
              <Divider sx={{ color: "white" }} />
              <AccordionDetails>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    columnGap: "0.5rem",
                    justifyContent: "center",
                  }}
                >
                  <Chip size="small" label="Critical Priority" color="error" />
                  <Chip size="small" label="Normal Priority" color="warning" />
                  <Chip size="small" label="Low Priority" color="info" />
                </div>

                <div style={{ padding: "7px 15px 15px 15px" }}>
                  <Typography
                    variant="caption"
                    display="block"
                    gutterBottom
                    sx={{ color: "black", fontSize: "0.8rem" }}
                  >
                    Date :
                  </Typography>

          
                 
                  <Calendar
                    value={listEventDate}
                    style={{ width: "100%" }}
                    dateFormat="dd/mm/yy"
                    className="CalenderButtonStyle"
                    showIcon
                    onChange={(e) => {
                      setListEventDate(e.value);

                      handleFilterEvents(e.value);
                    }}
                  />
                  <List>
                    <ListSubheader
                      sx={{
                        borderRadius: 2,
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                      component="div"
                      id="nested-list-subheader"
                    >
                      List of Events :
                    </ListSubheader>
                    {currentEvents
                      // .filter(
                      //   (data) =>
                      //     dayjs(data.start).date() ===
                      //       dayjs(listEventDate).date() &&
                      //     dayjs(data.start).month() ===
                      //       dayjs(listEventDate).month() &&
                      //     dayjs(data.start).year() ===
                      //       dayjs(listEventDate).year()
                      // )
                      .map((data) => (
                        <ListItem
                          key={data.id}
                          sx={{
                            backgroundColor: "#607d8b", //colors.greenAccent[500],
                            margin: "10px 0",
                            borderRadius: 2,
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            handleListItemClick(data);
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box
                                sx={{
                                  display: "grid",
                                  alignItems: "center",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    marginRight: "0.3rem",
                                    fontSize: "0.7rem",
                                    // fontWeight: "bold",
                                    color: "#ffffffeb",
                                  }}
                                >
                                  Job Name:
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: "0.7rem",
                                    whiteSpace: "pre-wrap",
                                    fontWeight: "bold",
                                    color: "white",
                                  }}
                                >
                                  {data.title}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Box
                                sx={{ display: "grid", alignItems: "center" }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    marginRight: "0.3rem",
                                    fontSize: "0.7rem",
                                    //fontWeight: "bold",
                                    // color:"black"
                                    color: "#ffffffeb",
                                  }}
                                >
                                  Start:
                                </Typography>
                                <Chip
                                  label={formatDatetime(dayjs(data.start))}
                                  size="small"
                                  sx={{
                                    fontSize: "0.7rem",
                                    height: "18px", // Adjusted height for smaller chip
                                    padding: "10px 5px", // Tighter padding
                                    backgroundColor: "#e0e0e0",
                                    color: "#333",
                                  }}
                                />
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                  </List>
                </div>
              </AccordionDetails>
            </Accordion>
          </>
        )}
        <Box
          component={motion.div}
          key={"eventsList"}
          variants={fadeInOutAnimation}
          initial="hidden"
          animate="show"
        >
          <Box display="flex" justifyContent="space-between">
            {/* CALENDAR SIDEBAR */}
            {isMobile || (
              <Box
                flex="1 1 20%"
                backgroundColor="#e0e0e0" //{colors.primary[400]}
                //p="15px"
                borderRadius="4px"
                maxHeight={"95vh"}
                overflow={"auto"}
                component={motion.div}
                variants={fadeInOutAnimation}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "15px",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      background: "#607d8b",
                      color: "white",
                      padding: "3px 15px",
                      borderRadius: "1rem",
                      fontSize: "0.8rem",
                    }}
                  >
                    Events
                  </Typography>
                      <> 

                      <AntButton
  type="primary"
   variant="outlined"
   size="small"
  icon={<SyncOutlined />}
  loading={!currentCalendarDate}
  onClick={()=>
  {
    handleDatesSet(currentCalendarDate.month,currentCalendarDate.year)
  }
}
/>

{/* <i className={!currentCalendarDate ? "pi pi-spin pi-sync": "pi pi-sync"} onClick={()=>
  {
    handleDatesSet(currentCalendarDate.month,currentCalendarDate.year)
  }
}></i> */}
</>      
                  <div>
                    <Tooltip title="Critical priority">
                      <FiberManualRecordIcon
                        fontSize="small"
                        sx={{
                          color: "red",
                          marginRight: "4px",
                          fontSize: ".7rem",
                          cursor: "pointer",
                        }}
                      />
                    </Tooltip>

                    <Tooltip title="Normal priority">
                      <FiberManualRecordIcon
                        fontSize="small"
                        sx={{
                          color: "orange",
                          marginRight: "4px",
                          fontSize: ".7rem",
                          cursor: "pointer",
                        }}
                      />
                    </Tooltip>

                    <Tooltip title="Low priority">
                      <FiberManualRecordIcon
                        fontSize="small"
                        sx={{
                          color: "blue",
                          marginRight: "4px",
                          fontSize: ".7rem",
                          cursor: "pointer",
                        }}
                      />
                    </Tooltip>
                  </div>
                
                </div>
                <Divider sx={{ borderColor: "#bdbdbd" }} />
                <div style={{ padding: "7px 15px 15px 15px" }}>
                  <Typography
                    variant="caption"
                    display="block"
                    gutterBottom
                    sx={{ color: "black", fontSize: "0.8rem" }}
                  >
                    Date :
                  </Typography>
                 
                  <Calendar
                    value={listEventDate}
                    dateFormat="dd/mm/yy"
                    className="CalenderButtonStyle"
                    showIcon
                    onChange={(e) => {
                      setListEventDate(e.value);

                      handleFilterEvents(e.value);
                    }}
                  />
                  <List>
                    <ListSubheader
                      sx={{
                        borderRadius: 2,
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                      component="div"
                      id="nested-list-subheader"
                    >
                      List of Events :
                    </ListSubheader>
                    {filteredEventsList?.map((data) => (
                        <ListItem
                          key={data.id}
                          sx={{
                            backgroundColor: "#607d8b", //colors.greenAccent[500],
                            margin: "10px 0",
                            borderRadius: 2,
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            handleListItemClick(data);
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box
                                sx={{
                                  display: "grid",
                                  alignItems: "center",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    marginRight: "0.3rem",
                                    fontSize: "0.7rem",
                                    color: "#ffffffeb",
                                    // fontWeight: "bold",
                                    //color:"black"
                                  }}
                                >
                                  Job Name:
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: "0.7rem",
                                    whiteSpace: "pre-wrap",
                                    fontWeight: "bold",
                                    color: "white",
                                  }}
                                >
                                  {data.title}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Box
                                sx={{ display: "grid", alignItems: "center" }}
                                component="span"
                              >
                                <Typography
                                  variant="caption"
                                  component="span"
                                  sx={{
                                    marginRight: "0.3rem",
                                    fontSize: "0.7rem",
                                    color: "#ffffffeb",
                                    //fontWeight: "bold",
                                    // color:"black"
                                  }}
                                >
                                  Start:
                                </Typography>
                                <Chip
                                component="span"
                                  label={formatDatetime(dayjs(data.start))}
                                  size="small"
                                  sx={{
                                    fontSize: "0.7rem",
                                    height: "18px", // Adjusted height for smaller chip
                                    padding: "10px 5px", // Tighter padding
                                    backgroundColor: "#e0e0e0",
                                    color: "#333",
                                  }}
                                />
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                  </List>
                </div>
              </Box>
            )}

            {/* CALENDAR */}
            <Box
              flex="1 1 100%"
              m="15px"
              //mr="15px"
              component={motion.div}
              variants={fadeInOutAnimation}
            >
              <FullCalendar
                themeSystem="bootstrap5"
                height="85vh"
                plugins={[
                  dayGridPlugin,
                  timeGridPlugin,
                  interactionPlugin,
                  listPlugin,
                ]}
                ref={eventSourceRef}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
                }}
                
                initialView="dayGridMonth"
                datesSet={(arg)=>{
                   const month=arg.startStr.split('-')[1];
        const year=arg.startStr.split('-')[0];
                  handleDatesSet(month,year)}}
                // editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={2}
                select={(dateselected) => {
                  handleDateClick(
                    dateselected,
                    setSnackbarOpen,
                    setSeverityText,
                    setSeverityType
                  );
                }}
                eventClick={(e) => handleEventClick(e)}
                //eventsSet={(events) => setCurrentEvents(events)}
                events={currentEvents}
                eventDidMount={handleEventDidMount} // Custom styling
                eventContent={eventContent}
                // dayCellDidMount={(info) => {
                //   const customDiv = document.createElement("div");
                //   customDiv.innerHTML = "<span style='color: red;'>📌 Note</span>"; // Custom content
                //   customDiv.style.fontSize = "12px";
                //   customDiv.style.marginTop = "5px";
                //   info.el.appendChild(customDiv); // Attach the div to the date cell
                // }}

                
              />
            </Box>
          </Box>
        </Box>
        {/* Main Modal Dialog */}
        
        <Dialog
          visible={openDialog}
          maximizable
          style={{
            maxHeight: isMobile ? "78vh" : "",
            width: isMobile ? "95vw" : "60vw",
          }}
          header={<>
          <div style={{ display: "flex" }}>
                      <EngineeringIcon fontSize="small" />
                      <div style={{ fontSize: ".7rem", fontWeight: "bold" }}>
                        Job Information
                      </div>
                      {(isLoading || !taskList) && (
                        <RotatingLines
                          visible={true}
                          height="20"
                          width="20"
                          strokeWidth="5"
                        />
                      )}
                    </div>
          </>}
          onHide={() => {
            if (!openDialog) return;
            setOpenDialog(false);
            handleReset();
          }}
        >
         
          {isMobile || (
            <Stepper activeStep={activeStep}>
              {/* showing the step label names */}
              {steps.map((label, index) => {
                // const labelProps = {};
                return (
                  <Step sx={{ mb: 2 }} key={label}>
                    <StepLabel>{label}</StepLabel>
                   
                  </Step>
                );
              })}
            </Stepper>
          )}
          {/* </motion.div> */}
          {/* <AnimatePresence mode="wait"> */}
          {/* showing the step content  IF THE activeStep ===0 then JobDetailForModal will be rendered along with the props*/}
          {activeStep === 0 && (
            <motion.div
              // key={activeStep}
              // initial={{ x: '100vw' }}
              // animate={{ x: 0 }}
              // exit={{ x: '-100vw', transition: { ease: 'easeInOut' } }}
              variants={variants}
              key={activeStep}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <React.Fragment>
                {isMobile && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <Chip
                      size="small"
                      icon={
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            width: 20,
                            height: 20,
                          }}
                        >
                          {
                            <>
                              {
                                <Typography sx={{ color: "white" }}>
                                  1
                                </Typography>
                              }
                            </>
                          }
                        </Avatar>
                      }
                      label="Job Details"
                    />
                  </div>
                )}
                <Grid container>
                  <Grid item xs={12}>
                    <Container maxWidth="md">
                      {/*  */}
                      <JobDetailForModal
                       
                        {...jobDetailsProps}
                      />
                    </Container>
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    pt: 2,
                  }}
                >
                  {/* <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
                        Back
                      </Button> */}
                  <Box sx={{ flex: "1 1 auto" }} />
                  {/* Button for going to nextStep */}
                  <motion.div
                    whileHover={{
                      scale: 1.1,
                      boxShadow: "0px 0px 8px rgb(255,255,255)",
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                    >
                      {activeStep === steps.length - 1 ? "Finish" : "Next"}
                    </Button>
                  </motion.div>
                </Box>
              </React.Fragment>
            </motion.div>
          )}
          {/* if the activeStep===1 then ActivityDetails will be rendered */}
          {activeStep === 1 && (
            <motion.div
              // key={activeStep}
              // initial={{ x: '100vw' }}
              // animate={{ x: 0 }}
              // exit={{ x: '-100vw', transition: { ease: 'easeInOut' } }}
              variants={variants}
              key={activeStep}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <React.Fragment>
                {isMobile && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <Chip
                      size="small"
                      icon={
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            width: 20,
                            height: 20,
                          }}
                        >
                          {
                            <>
                              {
                                <Typography sx={{ color: "white" }}>
                                  2
                                </Typography>
                              }
                            </>
                          }
                        </Avatar>
                      }
                      label="Activity Details"
                    />
                  </div>
                )}
                <div style={{ width: isMobile ? "92vw" : "" }}>
                  <ActivityDetails
                    
                    {...activityDetailsProps}
                  />
                </div>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    pt: 2,
                  }}
                >
                  {/* Button for going tot the previous step */}
                  <Button
                    color="info"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                    variant="contained"
                  >
                    Back
                  </Button>
                  <Box sx={{ flex: "1 1 auto" }} />

                  {/* Button for going to nextStep */}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    disabled={!currentActivityDetailsObject || (currentActivityDetailsObject?.length === 0 && activeStep === 1)}

                  >
                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                </Box>
              </React.Fragment>
            </motion.div>
          )}
         {activeStep === 2 && <>
         {isMobile?<JobOverviewForMobile 
         activityList={currentActivityDetailsObject} 
         setActivityList={setCurrentActivityDetailsObject} 
         setFinalJob={setFinalJob}
          finalJob={finalJob}
          allUsersData={allUsersData}
          weekdays={weekdays}
          setSnackbarOpen={setSnackbarOpen}
          setSeverityText={setSeverityText}
          setSeverityType={setSeverityType}
          jobStartTime={fromdate}

          />
          :
         <JobOverview 
         activityList={currentActivityDetailsObject} 
         setActivityList={setCurrentActivityDetailsObject} 
         setFinalJob={setFinalJob}
          finalJob={finalJob}
          allUsersData={allUsersData}
          weekdays={weekdays}
          setSnackbarOpen={setSnackbarOpen}
          setSeverityText={setSeverityText}
          setSeverityType={setSeverityType}
          // priorityListColor={priorityListColor}
          
          />}


          <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    pt: 2,
                  }}
                >
                  {/* Button for going tot the previous step */}
                  <Button
                    color="info"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                    variant="contained"
                  >
                    Back
                  </Button>
                  <Box sx={{ flex: "1 1 auto" }} />

                  {/* Button for going to nextStep */}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    // disabled={!currentActivityDetailsObject || (currentActivityDetailsObject?.length === 0 && activeStep === 1)}

                  >
                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                </Box></>}
          {activeStep === 3 && (
            <React.Fragment>
              {isMobile && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Chip
                    size="small"
                    icon={
                      <Avatar
                        sx={{ bgcolor: "primary.main", width: 20, height: 20 }}
                      >
                        {
                          <>
                            {<Typography sx={{ color: "white" }}>3</Typography>}
                          </>
                        }
                      </Avatar>
                    }
                    label="Repeat Jobs"
                  />
                </div>
              )}
              <Grid container>
                <Grid item xs={12}>
                  <Container maxWidth="md">
                    <Grid item xs={12}>
                      <Typography sx={{ mt: 2, mb: 1 }}>Repeat?</Typography>
                      <Checkbox
                        title="Repeat ?"
                        value={isRepeatChecked}
                        checked={isRepeatChecked}
                        onChange={(e) => {
                          setIsRepeatChecked(!isRepeatChecked);
                          // if(isRepeatChecked)
                          // {
                          //   setIsSaveDisabled(false)
                          // }
                        }}
                      />
                    </Grid>
                    {/* if isRepeatChecked is true then the RepeatJob jsx will be rendered */}
                    {/* {<JobOverview activityList={currentActivityDetailsObject} setActivityList={setCurrentActivityDetailsObject} setFinalJob={setFinalJob} finalJob={finalJob}/>} */}
                    {isRepeatChecked && (
                      <RepeatJob
                        {...repeatJobProps}
                        // validationsForRepeatJob={validationsForRepeatJob}
                      />
                    )}
                  </Container>
                </Grid>
              </Grid>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  pt: 2,
                }}
              >
                <Button
                  color="info"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                  variant="contained"
                >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                {/* button for saving the job */}

                <Tooltip
                  placement="left-end"
                  title={
                    isRepeatChecked &&
                    Number(repeatInterval) === 0 &&
                    Number(repeatMinute) === 0 &&
                    Number(repeatHour) === 0
                      ? "Please enter repeat interval"
                      : "Save Job"
                  }
                >
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleSave}
                    endIcon={<SaveIcon />}
                    disabled={
                      //disabled when all the repeat intervals are in 0 state i.e no interval is given
                      isSaveDisabled ||
                      (isRepeatChecked &&
                        Number(repeatInterval) === 0 &&
                        Number(repeatMinute) === 0 &&
                        Number(repeatHour) === 0)
                    }
                  >
                    Save
                  </Button>
                </Tooltip>
                {/* {isSaveDisabled && <CircularProgress />} */}
                {/* showing progress while the data is posted */}
                {isSaveDisabled && (
                  <RotatingLines
                    visible={true}
                    height="25"
                    width="25"
                    strokeWidth="5"
                  />
                )}
              </Box>
            </React.Fragment>
          )}
        
        </Dialog>

        {/* This is the modal when the user clicks on any calendar event or listItem click */}
        
        {/* This is the EventModal jsx */}
        <Dialog
          visible={eventModalClick}
          maximizable
          style={{
            maxHeight: isMobile ? "78vh" : "",
            width: isMobile ? "95vw" : "60vw",
          }}
          onHide={() => {
            if (!eventModalClick) return;
            setEventModalClick(false);
          }}
          header={
            <div style={{ display: "flex" }}>
              {" "}
              {eventModalClick && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center", // Ensures both elements are vertically aligned
                    flex: 1,
                   // justifyContent: "space-between", // Makes sure Job Details is on the left, and the status chip is on the right
                    marginRight: "1rem", // Space between Job Details and the buttons
                  }}
                >
                  <div style={{ display: "flex" }}>
                    {eventJobDetails?.adhoc ?  <FontAwesomeIcon   style={{paddingRight : '.5rem'}} color="black" icon={"fa-solid fa-clipboard-list"} />:<EngineeringIcon fontSize="small" />}
                    
                    <div style={{ fontSize: ".7rem", fontWeight: "bold" }}>
                      Job Details
                    </div>
                     
                      <IconButton onClick={handleCopyEvent} size="small" sx={{padding:0}}>
                                      <ContentCopyIcon fontSize="small"/>
                                      </IconButton>
                  </div>

                  <div>
                    {eventJobDetails.jobStatus &&
                    eventJobDetails.jobStatus.toLowerCase() === "started" ? (
                      <div style={{ marginLeft: "1rem" }}>
                        {" "}
                        {/* Add margin for spacing */}
                        <Chip
                          variant="contained"
                          color="success"
                          label="Job Started"
                          size="small"
                         
                          icon={<PlayCircleOutlineIcon />}
                        />
                      </div>
                    ) : (
                      <div style={{ marginLeft: "1rem" }}>
                        {" "}
                        {/* Add margin for spacing */}
                        <Chip
                          variant="contained"
                          size="small"
                          color={
                           ( eventJobDetails.jobStatus.toLowerCase() ===
                            "rejected" || eventJobDetails.jobStatus.toLowerCase() === 'aborted')
                              ? "error"
                              : eventJobDetails.jobStatus.toLowerCase() ===
                                "completed"
                              ? "success"
                              : "info"
                          }
                          label={eventJobDetails.jobStatus}
                          icon={
                           ( eventJobDetails.jobStatus.toLowerCase() ===
                            "rejected" ||eventJobDetails.jobStatus.toLowerCase() ===
                            "aborted")? (
                              <DangerousIcon />
                            ) : eventJobDetails.jobStatus.toLowerCase() ===
                              "completed" ? (
                              <CheckCircleIcon />
                            ) : (
                              <InfoIcon />
                            )
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  columnGap: "1rem",
                  justifyContent: "center",
                 // margin: "0.7rem 0rem",
                 marginRight: "1rem",
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

               
    {!isMobile && <div style={{display:"flex",columnGap:"1rem"}}>
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
                      (dayjs(eventJobDetails.scheduledJobStartTime).day() ===
                        6 ||
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
                      (dayjs(eventJobDetails.scheduledJobStartTime).day() ===
                        6 ||
                        dayjs(eventJobDetails.scheduledJobStartTime).day() ===
                          0)) ||
                    (eventJobDetails.weekdays === "6" &&
                      dayjs(eventJobDetails.scheduledJobStartTime).day() === 0)
                  }
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
                </div>}
              </div>
            </div>
          }
        >
          <EventModal
            {...eventJobProps}
          />
        </Dialog>
       
      </>
    </Container>
  );
};

export default JobAssign;
