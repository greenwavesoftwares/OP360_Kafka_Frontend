// Importing necessary plugins for FullCalendar functionality
import dayGridPlugin from "@fullcalendar/daygrid"; // Plugin for day grid view
import interactionPlugin from "@fullcalendar/interaction"; // Plugin for interaction features (drag, drop)
import listPlugin from "@fullcalendar/list"; // Plugin for list view
import FullCalendar from "@fullcalendar/react"; // Main FullCalendar component
import timeGridPlugin from "@fullcalendar/timegrid"; // Plugin for time grid view

// Importing Material UI icons for UI elements
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"; // Icon for calendar month
import InfoIcon from "@mui/icons-material/Info"; // Icon for information
import TableChartIcon from "@mui/icons-material/TableChart"; // Icon for table chart

// Importing components from Material UI for layout and styling
import { TabContext, TabList, TabPanel } from "@mui/lab"; // Tab components for navigation

// Importing various Material UI components
import {
  AppBar,
  Badge,
  BottomNavigation,
  BottomNavigationAction, // Component for displaying badges
  Box, // Component for layout
  Chip, // Component for displaying chips
  Container, // Floating action button
  Grid, // Component for grid layout
  IconButton, // Button component with an icon
  Paper, // Component for paper-like surfaces
  Tab, // Tab component
  Tooltip, // Component for tooltips
  Typography, // Component for text
  styled, // Utility for styled components
  useMediaQuery,
  useTheme,
} from "@mui/material";

// Importing OverlayPanel from PrimeReact for overlay functionality
import { OverlayPanel } from "primereact/overlaypanel";

// Importing React and hooks for component functionality
import { useEffect, useRef, useState } from "react"; // React and hooks for state and lifecycle management

// Importing hooks from react-router-dom for navigation and location management
import { useLocation, useNavigate } from "react-router-dom";

// Importing API functions for fetching data related to user and jobs
import { fetchAllotedPagesByUserId } from "../CommonAPI"; // Function to fetch allotted pages for a user
import {
  getTenantID,
  getUserDetailsByUserID,
} from "../UserModuleUpdated/UsermoduleApi"; // Function to get user details by ID
import { getCurrentUser } from "../UserModuleUpdated/helper"; // Function to get current user information
import { decryptTokenId } from "../helper/AuthService"; // Functions for token management

// Importing custom components for displaying activity details and stats
import ActivityDetailTable from "./ActivityDetailTable"; // Component for displaying activity details in a table
import {
  fetchJobs,
  getAllJobsDataBasedOnPerformerAndTimeRange,
} from "./JobPerformerAPI"; // API functions for job performer related actions

// import Stats from "./Stats"; // Component for displaying statistics
import dayjs from "dayjs";
import ActivityHistory from "./ActivityHistory";
import JobPerformSekeleton from "./JobPerformSkeleton";
import "./Performer.css";
import { getData } from "../Logbook/OfflineLogbook/indexedDb";

const PaddedPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  // textAlign: "center",
  color: theme.palette.text.secondary,
}));

const JobPerformer = () => {
  //Env variable to find the keys in session storage
  const REACT_APP_USERID = process.env.REACT_APP_USERID;

  const currentPathName = useLocation().pathname; //React hook to find path name
  const navigate = useNavigate(); //React hook to navigate to a page
  //State to hold
  const [showCalendar, setshowCalendar] = useState(true); //State to toggle between calendar and tabular view
  const [tabvalue, setTabvalue] = useState("2"); //State  to hold tab value
  const [activityDetails, setActivityDetails] = useState({
    current: [],
    upcoming: [],
    enforced: [],
    reviewed: [],
    calendarData: [],
    all: [],
  }); //state to hold activity details of current date
  const [jobData, setJobData] = useState(null); //state to hold all job details
  const [dateBasedRows, setDateBasedRows] = useState([]); //state to hold date based rows,i.e. the activity details of a selected date
  const [selectedDate, setSelectedDate] = useState(null); //state to hold the selected date
  const [filter, setFilter] = useState(""); //state to hold filter value
  const [selectedCalendarTabularDetails, setSelectedCalendarTabularDetails] =
    useState(null);
  const [showpipispinner, setShowpipispinner] = useState(true); //state to show spinner when data is loading,currently unused
  const [isDisabledButton, setDisabledButton] = useState([]); //state to hold the row  of the start/stop button which is disabled
  const [uploadFileDisabled, setUploadFileDisabled] = useState([]); //state to hold the row  of the file upload button which is disabled
  const [tableType, setTableType] = useState("Individual"); //state to hold the table type of tabular view
  const [customDialogContent, setCustomDialogContent] = useState(""); //state to  hold the content of custom dialog
  const [renderTrigger, setRenderTrigger] = useState(0); //State to call use effect on change of a given activity row
  const op = useRef(null); //Overlay panel to give info about current, upcoming and enforced activities
  const user = localStorage.getItem(REACT_APP_USERID); //Encrypted User taken from session storage
  const performer = decryptTokenId(user); //Decrypted user
  const [allJobsForTenant, setAllJobsForTenant] = useState(null);
  const [groupDetails, setGroupDetails] = useState(null);
  const [valueBottomNavigation, setBottomNavigation] = useState(0);
  const theme = useTheme();
  // Checking if the screen size is mobile based on theme breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("md"));
  const jobsEventSourceRef = useRef(null);
  const allJobsEventSourceRef = useRef(null);
  const allJobsRef = useRef(null);
  const loggedInUserRef = useRef(null);
  const responseUserGroupNameRef = useRef(null);
  const [loader, setLoader] = useState(0); //loader on date change for tab view
  const [activityCount,setActivityCount]=useState({enforced:0,executable:0,queued:0,reviewed:0,})
  //state to hold badge count for different category of activities in the child component Activity Detail Table

  /**
   *
   * Function called when a date is clicked or on interval call
   */
  const handleDateClick = (obj) => {
    let match = activityDetails?.calendarData?.find((dateObj) => {
      // Compare the date strings to find a match
      return compareDates(
        new Date(dateObj.date),
        new Date(obj?.dateStr ?? obj),
        "===",
      );
    }); //checks whether activities are present on a clicked  date or not

    if (!match) {
      setDateBasedRows([]);
      // setshowCalendar(true);

      setTabvalue(
        activityDetails?.enforced?.length > 0
          ? "1"
          : activityDetails?.current?.length > 0
            ? "2"
            : activityDetails?.upcoming?.length > 0
              ? "3"
              : activityDetails?.reviewed?.length > 0
                ? "4"
                : "2",
      );
      setSelectedDate(null);
    } //If match is not found then everything is reset to default state and calendar view

    /**
     * If match is found then all activity of the selected date are filtered
     */
    if (match) {
      let matchingObjects = activityDetails?.all.filter((activity) =>
        compareDates(
          new Date(activity.scheduledStartTime),
          new Date(match.date),
          "===",
        ),
      );
      const date = obj?.dateStr ?? obj; //condition to store date for both date click and calendar event click
      const formattedDate =
        typeof date === "string" ? date : dayjs(date).format("YYYY-MM-DD");
      setSelectedDate(formattedDate);
      setDateBasedRows(matchingObjects); //sets date based rows
      setshowCalendar(false); //toggle offs  the calendar view
    }
  };
  /**
   * functions to set enforced,upcoming and reviewed  activity details
   */

  const handleSetReviewedActivities = (activities) => {
    setActivityDetails((prev) => ({
      ...prev,
      reviewed: activities,
    }));
  };

  const handleSetUpcomingActivities = (activities) => {
    setActivityDetails((prev) => ({
      ...prev,
      upcoming: activities,
    }));
  };
  const handleSetEnforcedActivities = (activities) => {
    setActivityDetails((prev) => ({
      ...prev,
      enforced: activities,
    }));
  };
  const handleSetCalendarTabularDetails = (rangeStart, rangeEnd, tabValue) => {
    console.log("Start Date:", rangeStart.toDate());
    setSelectedCalendarTabularDetails({
      startDate: new Date(rangeStart),
      endDate: new Date(rangeEnd),
      tabValue: tabValue,
    });
  };

  const handleDateSet = (args) => {
    const monthStart = dayjs(args.view.currentStart).startOf("month").valueOf();
    const monthEnd = dayjs(args.view.currentStart).endOf("month").valueOf();

    setSelectedCalendarTabularDetails((prev) => {
      // FIRST TIME → allow set
      if (!prev) {
        return {
          startDate: new Date(monthStart),
          endDate: new Date(monthEnd),
          tabValue: 0,
        };
      }

      // SAME → prevent update
      if (
        prev.startDate?.getTime() === monthStart &&
        prev.endDate?.getTime() === monthEnd
      ) {
        return prev;
      }

      // DIFFERENT → update
      return {
        startDate: new Date(monthStart),
        endDate: new Date(monthEnd),
        tabValue: 0,
      };
    });
  };
  const handleSetStartDate = (rangeStart) => {
    setSelectedCalendarTabularDetails((prev) => ({
      ...prev,
      startDate: new Date(rangeStart),
    }));
  };
  const handleSetEndDate = (rangeEnd) => {
    setSelectedCalendarTabularDetails((prev) => ({
      ...prev,
      endDate: new Date(rangeEnd),
    }));
  };
  const handleSetCurrentActivities = (activities) => {
    setActivityDetails((prev) => ({
      ...prev,
      current: activities,
    }));
  };

  //Function called when a date is clicked
  const handleCalendarEventClick = (inf) => {
    setTableType(
      inf.event.extendedProps.performerType === "Performer"
        ? "Individual"
        : inf.event.extendedProps.performerType,
    ); //Sets  the table type based on performer type of the activity
    //check whether the activity is performed by an individual or a group
    inf.event.extendedProps.performerType === undefined ||
    inf.event.extendedProps.performerType === null
      ? handleDateClick(inf.event.start)
      : handleDateClick(inf.event.extendedProps.date);
  };
  /**
   * Function to fetch data for the current month
   */
  const fetchDataForTheGivenMonth = (tabValue) => {
    handleSetCalendarTabularDetails(
      dayjs().startOf("month"),
      dayjs().endOf("month"),
      tabValue,
    );
  };
  /**
   *
   * Function called on interval to filter date based rows if a date is selected
   */
  const handleSetDateBasedRows = (allActivityDetails) => {
    if (
      selectedDate === null ||
      selectedDate === undefined ||
      selectedDate === ""
    ) {
      return;
    } //If a date is not selected then exit from the function

    let matchingObjects = allActivityDetails.filter((activity) => {
      return compareDates(
        new Date(activity.scheduledStartTime),
        new Date(selectedDate),
        "===",
      );
    });
    if (matchingObjects) {
      setDateBasedRows(matchingObjects);
      //  selectedDateFromSessionStorage&& sessionStorage.removeItem(([process.env.REACT_APP_SELECTEDDATEINPERFORMER]));
    } //If data is found then update the date based rows
  };
  const compareDates = (date1, date2, operator) => {
    return operator === ">"
      ? new Date(date1.setHours(0, 0, 0, 0)).getTime() >
          new Date(date2.setHours(0, 0, 0, 0)).getTime()
      : operator === "<"
        ? new Date(date1.setHours(0, 0, 0, 0)).getTime() <
          new Date(date2.setHours(0, 0, 0, 0)).getTime()
        : operator === "==="
          ? new Date(date1.setHours(0, 0, 0, 0)).getTime() ===
            new Date(date2.setHours(0, 0, 0, 0)).getTime()
          : "Invalid input";
  };
  /**
   * Function to fetch data based on sse
   */
  const fetchData = async () => {
    try {
      const loggedInUser = getCurrentUser();
      loggedInUserRef.current = loggedInUser; // ✅ ADD
      const tenantid = getTenantID();
      const responsedata = await getUserDetailsByUserID(loggedInUser);
      const responseUserGroupName = responsedata.group;
      responseUserGroupNameRef.current = responseUserGroupName; // ✅ ADD
      setGroupDetails(responsedata.group);

      let groups = "";
      responseUserGroupName.forEach((group) => {
        groups += group.groupName + ",";
      });

      let userlist = performer?.concat(",", groups);
      console.log("Closing SSE", new Date());
      const allJobsRequested=await getAllJobsDataBasedOnPerformerAndTimeRange(
          tenantid,
          userlist,
          dayjs(selectedCalendarTabularDetails.startDate).format("YYYY-MM-DD"),
          dayjs(selectedCalendarTabularDetails.endDate).format("YYYY-MM-DD"))
          allJobsRef.current = allJobsRequested
      setAllJobsForTenant(allJobsRequested)
      const jobsToPerform=await fetchJobs(
        tenantid,
        userlist,
        selectedCalendarTabularDetails.tabValue,
        dayjs(selectedCalendarTabularDetails.startDate).format("YYYY-MM-DD"),
        dayjs(selectedCalendarTabularDetails.endDate).format("YYYY-MM-DD"))
        setJobData(jobsToPerform)
        processFetchedJobs(jobsToPerform)
        console.log("Jobs To Perform:",jobsToPerform)
      /**
       * Needed For SSE
      */
      // await jobsEventSourceRef?.current?.close();
      // await allJobsEventSourceRef?.current?.close();

      /* ================= ALL JOBS SSE ================= */
    //   console.log("Creating SSE", new Date());
    //   allJobsEventSourceRef.current =
    //     await getAllJobsDataBasedOnPerformerAndTimeRangeSSE(
    //       tenantid,
    //       userlist,
    //       dayjs(selectedCalendarTabularDetails.startDate).format("YYYY-MM-DD"),
    //       dayjs(selectedCalendarTabularDetails.endDate).format("YYYY-MM-DD"),
    //       (allJobDetailsTenant) => {
    //         console.log("All jobs SSE arrived");

    //         allJobsRef.current = allJobDetailsTenant; // ✅ ADD
    //         setAllJobsForTenant(allJobDetailsTenant); // UI only
    //       },
    //     );
    //   console.log("After fetching performable activities");
    //   /* ================= PERFORMABLE DATA SSE ================= */
    //   jobsEventSourceRef.current = fetchJobsSSE(
    //     tenantid,
    //     userlist,
    //     selectedCalendarTabularDetails.tabValue,
    //     dayjs(selectedCalendarTabularDetails.startDate).format("YYYY-MM-DD"),
    //     dayjs(selectedCalendarTabularDetails.endDate).format("YYYY-MM-DD"),
    //     (data) => {
    //       console.log("Fetching performable jobs");
    //       setJobData(data);
    //       // process only when both are available
    //       if (jobsEventSourceRef.current && allJobsRef.current) {
    //         console.log("Both SSE data received");

    //         processFetchedJobs(data);
    //       }
    //     },
    //   );
    } catch (error) {
      console.error("error in fetch data", error);
    }
  };

  //Function to process the data fetched from the given sse
  const processFetchedJobs = async (data) => {
    console.log("Processing fetched data");
    const allJobDetailsTenant = allJobsRef.current;
    const allJobs = structuredClone(allJobDetailsTenant);
    setAllJobsForTenant(allJobs); //Set all jobs for the given tenant
    setJobData(data); //Set the job

    //reset the details
    let upcomingActivity = [];
    let currentActivity = [];
    let allActivities = [];
    let enforcedActivity = [];
    let calenderDetails = [];
    let reviewedActivities = [];

    //iterate through the fetch job
    data.forEach((item) => {
      const jobname = item.jobName; //fetch the job name
      const jobid = item.jobID; //fetch the job id
      const currentJob = allJobDetailsTenant.find((job) => job.jobID === jobid); //Fetch  all information of the current job
      item.task.activityList.forEach((activity) => {
        //iterate through the activity list
        const activityName = activity.activityName; //fetch the activity name
        const logbook = activity.logbook; //fetch the activity id
        const scheduledStartTime = activity.scheduledActivityStartTime; //fetch  the scheduled start time
        const scheduledEndTime = activity.scheduledActivityEndTime; //fetch the scheduled end time
        const activityActualstart = activity.actualActivityStartTime; //fetch the actual start time
        const activityActualend = activity.actualActivityEndTime; //fetch the actual end time
        const activityId = activity.activityId; //fetch the activity id
        const activityStatus = activity.actvityStatus; //fetch the activity status
        const previousActivityList =
          activity?.sequence > 1
            ? currentJob?.task?.activityList?.filter(
                (act) => act?.sequence === activity.sequence - 1,
              )
            : []; //Fetch all activities of previous sequence, needed to disable activities with buffer
        let expectedStartTime = null;
        expectedStartTime =
          previousActivityList &&
          previousActivityList.reduce((maxTime, act) => {
            const endTime = new Date(act.actualActivityEndTime);
            return maxTime === null || endTime > maxTime ? endTime : maxTime;
          }, null); //Expected start time of a buffered activity, before which the activity is disabled

        expectedStartTime =
          expectedStartTime &&
          activity.buffer &&
          new Date(expectedStartTime.getTime() + activity.buffer * 60000);
        new Date(scheduledStartTime); //Format date
        // ✅ Proper await usage

        //Update the current activity
        const jobDetail = {
          jobname: jobname,
          jobid: jobid,
          //modify the scheduled stop time in given format
          activityName: activityName,
          approver: activity.approver,
          activityId: activityId,
          assigner: item.assigner,
          performerType: activity.performerType,
          logbook: logbook,
          remarks: activity.remarks,
          activityStatus: activityStatus,
          activityActualstart: activityActualstart,
          activityActualend: activityActualend,
          scheduledStartTime: scheduledStartTime,
          scheduledEndTime: scheduledEndTime,
          //Datetimes to display in ui
          approver: activity.approver,
          actFile: activity.actFile,
          performer: activity.performer,
          // attachmentData: activity.activityFileData,
          enforce: activity.enforce,
          enforceStart: activity.enforceStart,
          expectedStartTimeForBuffer: expectedStartTime, //start time for buffered activities
          durationToStart:
            expectedStartTime &&
            expectedStartTime?.getTime() > new Date().getTime()
              ? Math.floor(
                  (expectedStartTime?.getTime() - new Date().getTime()) / 1000,
                )
              : 0, //countdown time to start an activity
          sequence: activity.sequence,
          enableActivityPerformance: activity.enableActivityPerformance,
          [process.env.REACT_APP_ERRORMSG]: activity.logbookTransactionErrorMsg,
          [process.env.REACT_APP_ERRORBY]: activity.logbookTransactionErrorBy,
        };
        //Add the current activity to allactivities
        allActivities.push(jobDetail);
        if (
          activityStatus === "Review Started" ||
          activityStatus === "Sent For Approval"
        ) {
          //If an activity is getting reviewed then keep it in a separate tab
          reviewedActivities.push(jobDetail);
        } else {
          if (activity.enableActivityPerformance === true) {
            currentActivity.push(jobDetail); //activities that are scheduled to start in the current date
          }
          if (activity.enforce === true)
            //add the enforced activities
            enforcedActivity.push(jobDetail);
          if (activity.enableActivityPerformance === false) {
            //activities that are scheduled to start in upcoming dates
            //add the upcoming activities
            upcomingActivity.push(jobDetail);
          }
        }
        //Update the calenderdetails array with current activity
        calenderDetails.push({
          title: activityName, //Title of the event

          extendedProps: {
            //Additional properties to be added in the calender details
            performerType: activity.performerType, //Performer  type of the activity, whether individual or group

            jobname: jobname,
            activityname: activityName,
            date: dayjs(activity.scheduledActivityStartTime).format(
              "YYYY-MM-DD",
            ), //format the starttime to display in the calendar
          },
          date: dayjs(activity.scheduledActivityStartTime).format("YYYY-MM-DD"), //format the stop time to display in the calendar
          //color of the calendar event
          color:
            activityStatus === "Not Started"
              ? "blue"
              : activityStatus === "Sent For Approval"
                ? "orange"
                : activityStatus === "Started" || activityStatus === "Completed"
                  ? "green"
                  : activityStatus === "Review Started"
                    ? "orange"
                    : "red",
        });
      });
    });
    

// SECOND PASS ONLY FOR ERROR UPDATE
await Promise.all(
  currentActivity.map(async (jobDetail) => {
    const errorData = await getData(
      jobDetail.jobid,
      jobDetail.activityId
    );

    jobDetail[process.env.REACT_APP_ERRORMSG] =
      errorData?.errorMsg ||
      jobDetail[
        process.env.REACT_APP_ERRORMSG
      ] ||
      "";

    jobDetail[process.env.REACT_APP_ERRORBY] =
      errorData?.errorBy ||
      jobDetail[
        process.env.REACT_APP_ERRORBY
      ] ||
      "";
  })
);
console.log("current activity:",currentActivity)
setBadgeValue(
      {current: currentActivity,
      upcoming: upcomingActivity,
      enforced: enforcedActivity,
      reviewed: reviewedActivities,
      all: allActivities})
    setActivityDetails({
      current: currentActivity,
      upcoming: upcomingActivity,
      enforced: enforcedActivity,
      reviewed: reviewedActivities,
      all: allActivities,
      calendarData: calenderDetails,
    });
    setLoader(0);
  };

  //Wrap all functions to be called in useEffect
  const handleUseeffectFunctions = async () => {
    // await extendTokenExpiration(); //function to extend  the token expiration time
    await fetchData(); //Function to fetch datea
    setShowpipispinner(false);
  };
  //Function to fetch the pages alloted to the user and navigate to restricted page if the current page is not alloted
  const fetchAllotedPages = async () => {
    try {
      const allotedPages = await fetchAllotedPagesByUserId();
      if (!allotedPages?.includes(currentPathName)) navigate("/restricted");
    } catch (e) {
      console.error(e);
    }
  };

 
  //Function to close all existing sse connections for page exit and change in time range
  // const closeSSE = () => {
  //   jobsEventSourceRef.current?.close();
  //   allJobsEventSourceRef.current?.close();
  // };
  const toggleCalendarTabular = () => {
    const newValue = !showCalendar;
    setshowCalendar(newValue);
    if (newValue === true) {
      setDateBasedRows([]);
      setSelectedDate(null);
    }
    if (newValue === false) {
      const tabval =
        activityDetails?.enforced?.length > 0
          ? "1"
          : activityDetails?.current?.length > 0
            ? "2"
            : activityDetails?.upcoming?.length > 0
              ? "3"
              : activityDetails?.reviewed?.length > 0
                ? "4"
                : "2";
      setTabvalue(tabval);
    }
    console.log(
      "selected calendar start date:",
      selectedCalendarTabularDetails.startDate.getTime(),
    );
    console.log("Dayjs start date:", dayjs().startOf("month").valueOf());

    if (
      !(
        selectedCalendarTabularDetails.startDate.getTime() ===
          dayjs().startOf("month").valueOf() &&
        selectedCalendarTabularDetails.endDate.getTime() ===
          dayjs().endOf("month").valueOf()
      )
    ) {
      console.log("Inside if");
      fetchDataForTheGivenMonth(0);
    }
  };
  /**
   * 
   * @param {*} activityInfo
   * Function to calculate activity length for different activity types
   */
  const setBadgeValue=(activityInfo)=>{
    const enforcedCount=performableActivitiesLength(activityInfo?.enforced)
    const executableCount=performableActivitiesLength(activityInfo?.current)
    const queuedCount=performableActivitiesLength(activityInfo?.upcoming)
    const reviewedCount=performableActivitiesLength(activityInfo?.reviewed)

    setActivityCount({enforced:enforcedCount,queued:queuedCount,reviewed:reviewedCount,executable:executableCount})
}
/**
 * 
 * @param {*} activityList 
 * Function to calculate activity length based on date range
 */
const performableActivitiesLength=(activityList)=>{
  const count=activityList?.filter((activity) => {
      const activityTime = new Date(activity.scheduledStartTime);

      const from = selectedCalendarTabularDetails.startDate
        ? new Date(new Date(selectedCalendarTabularDetails.startDate).setHours(0, 0, 0, 0))
        : null;
      const to = selectedCalendarTabularDetails.endDate
        ? new Date(new Date(selectedCalendarTabularDetails.endDate).setHours(23, 59, 59, 999))
        : null;
      return (!from || activityTime >= from) && (!to || activityTime <= to);
    })?.length
    return count;
}
const handleUseEffectFunctionsOnTringger=async()=>{
  await handleUseeffectFunctions()
  setDisabledButton([])
  setUploadFileDisabled([])
}
  
  /**
   * UseEffect to fetch data on page render
   */
  useEffect(() => {
    const key = process.env.REACT_APP_SELECTEDDATEINPERFORMER;
    const date = sessionStorage.getItem(key);
    const tabkey = process.env.REACT_APP_TABVALUE;
    const tabval = sessionStorage.getItem(tabkey);
    setLoader(1);
    if (!date && !tabval) {
      fetchDataForTheGivenMonth(0);
    }
    let mounted = true;
    if (!mounted) return;
    if (date) {
      handleSetCalendarTabularDetails(dayjs(date), dayjs(date), 0);
      setSelectedDate(date);
      setshowCalendar(false);
      sessionStorage.removeItem(key);
    } else {
      if (tabval) {
        fetchDataForTheGivenMonth(0);
        setTabvalue(tabval);
        setshowCalendar(false);
        sessionStorage.removeItem(tabkey);
      }
    }

    fetchAllotedPages();

    // return () => {
    //   closeSSE();
    // };
  }, []);
  /**
   * UseEffect to fetch data for a particular data
   */
  useEffect(() => {
    if (!selectedDate) return;
    if (activityDetails?.all?.length === 0) return;

    handleSetDateBasedRows(activityDetails?.all);
  }, [selectedDate, activityDetails]);
  /**
   * useEffect called when an activity is updated,handled through renderTrigger
   **/

  useEffect(() => {
    handleUseEffectFunctionsOnTringger();
  }, [renderTrigger]);
  
  /**
   * UseEffect called to fetch data for a different date rangeu
   */
  useEffect(() => {
    setLoader(1);
    console.log("Change in calendar details:", selectedCalendarTabularDetails);
    handleUseeffectFunctions();
  }, [selectedCalendarTabularDetails]);

  //Component to be dispayed on ui
  return (
    <div>
      {/* Grid to wrap the calendar and tab */}
      {showpipispinner && <JobPerformSekeleton />}
      {!showpipispinner && (
        <div>
          <Grid container>
            <Grid item xs={12}>
              <Container
                maxWidth="lg"
                sx={{ padding: isMobile || isTab ? 0 : "" }}
              >
                <Grid container spacing={1} mt={isMobile || isTab ? 1 : 0}>
                  <Grid item xs={12}>
                    {!isMobile && !isTab && (
                      <PaddedPaper
                        elevation={3}
                        sx={{ padding: "0.2rem 0.8rem" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          {/* Chip to show the selected date */}
                          {!showCalendar && (
                            <Chip
                              size="small"
                              label={<>Jobs To Perform {selectedDate}</>}
                            />
                          )}
                          {showCalendar && (
                            <Chip size="small" label="Calendar View" />
                          )}
                          <Box
                            className="tooltipbox"
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <Tooltip
                              title="Calendar View On/Off"
                              placement="top"
                            >
                              {/* Toggle button to switch between calendar view and tabular view */}
                              <IconButton
                                color="primary"
                                onClick={toggleCalendarTabular}
                                aria-label="toggle calendar/table view"
                              >
                                {showCalendar ? (
                                  <TableChartIcon />
                                ) : (
                                  <CalendarMonthIcon />
                                )}
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </PaddedPaper>
                    )}

                    {(isMobile || isTab) && ( // Check if on mobile device
                      <AppBar
                        position="fixed" // Fix position at the bottom
                        color="primary" // Set color of the AppBar
                        sx={{ top: "auto", bottom: 0 }} // Position at the bottom
                      >
                        <BottomNavigation
                          showLabels
                          value={valueBottomNavigation}
                          onChange={(event, newValue) => {
                            setBottomNavigation(newValue);
                          }}
                        >
                          <BottomNavigationAction
                            label={showCalendar ? "Calendar" : "Tabular"}
                            icon={
                              showCalendar ? (
                                <CalendarMonthIcon />
                              ) : (
                                <TableChartIcon />
                              )
                            }
                            onClick={toggleCalendarTabular}
                          />
                        </BottomNavigation>
                      </AppBar>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <PaddedPaper
                      elevation={3}
                      // sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <Box sx={{ width: "100%", typography: "body1" }}>
                        {/* Render calendar when show calendar is true */}
                        {showCalendar ? (
                          <Box>
                            <FullCalendar
                              themeSystem="bootstrap5"
                              eventBackgroundColor="red"
                              // Show jobname as event title and activity name in tooltip
                              eventContent={(inf) => (
                                <Tooltip
                                  title={inf.event.extendedProps.activityname}
                                  style={{
                                    cursor: "pointer",
                                    zIndex: "10000000000 !important",
                                  }}
                                >
                                  {inf.event.extendedProps.jobname}
                                </Tooltip>
                              )}
                              height="auto"
                              plugins={[
                                dayGridPlugin, // For month view
                                timeGridPlugin, // For week/day views
                                interactionPlugin, // For user interaction capabilities (selecting, dragging)
                                listPlugin, // For list view of events
                              ]}
                              // Define the toolbar layout and buttons for navigation and view selection
                              headerToolbar={{
                                left: "prev,next today", // Navigation buttons
                                center: "title", // Center title of the current view
                                right:
                                  "dayGridMonth,timeGridWeek,timeGridDay,listMonth", // View selection buttons
                              }}
                              initialView="dayGridMonth" // Set the initial view to month view
                              selectMirror={true} // Enable mirror selection for better user experience
                              dayMaxEvents={1} // Allow the display of "more" when there are too many events in a day
                              eventClick={(event) =>
                                handleCalendarEventClick(event)
                              } //Function called on calendar event click
                              events={activityDetails?.calendarData} //show the events by using the state calendardata
                              dateClick={handleDateClick} //function called on dateclick
                              datesSet={handleDateSet}
                              contentHeight="auto"
                            />
                          </Box>
                        ) : (
                          <Box>
                            {/* render tabular view when date based rows is blank and showcalendar is false */}
                            {dateBasedRows.length === 0 ||
                            selectedDate === null ||
                            selectedDate === undefined ? (
                              <Box>
                                <TabContext value={tabvalue}>
                                  <Box
                                    sx={{
                                      borderBottom: 1,
                                      borderColor: "divider",
                                    }}
                                  >
                                    <TabList
                                      onChange={(event, newValue) =>
                                        setTabvalue(newValue)
                                      }
                                      //visibleScrollbar
                                      variant="scrollable"
                                      scrollButtons="auto"
                                      aria-label="scrollable auto tabs example"
                                    >
                                      {/* tab to show enforced activities */}
                                      <Tab
                                        label={
                                          <div
                                            style={{
                                              display: "flex",
                                              flexDirection: "row",
                                              marginLeft: 1,
                                            }}
                                          >
                                            <Badge
                                              badgeContent={
                                                activityCount.enforced
                                              }
                                              color="info"
                                              max={9999}
                                            >
                                              <Typography className="tab-label">
                                                {/* Icon button to display the definition of icon button on click */}
                                                <IconButton
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    op.current.toggle(e);

                                                    setCustomDialogContent(
                                                      "The job having an enforced activity will get rejected if the activity is not stopped within scheduled duration",
                                                    );
                                                  }}
                                                  onMouseEnter={(e) => {
                                                    //display the definition of current activity on click
                                                    e.stopPropagation(); //Prevents the click event from propagating to the parent
                                                    op.current.toggle(e);

                                                    setCustomDialogContent(
                                                      "The job having an enforced activity will get rejected if the activity is not stopped within scheduled duration",
                                                    );
                                                  }}
                                                  onMouseLeave={(e) =>
                                                    op.current.toggle(e)
                                                  }
                                                >
                                                  <InfoIcon className="tab-info" />
                                                </IconButton>{" "}
                                                Enforced Activities
                                              </Typography>
                                            </Badge>
                                          </div>
                                        }
                                        value="1"
                                      />

                                      {/* tab to show current activities */}
                                      <Tab
                                        label={
                                          <Badge
                                            badgeContent={
                                              activityCount.executable
                                            } //add length of current activities  in the badge
                                            color="info"
                                            max={9999}
                                          >
                                            <Typography className="tab-label">
                                              <IconButton
                                                onClick={(e) => {
                                                  //display the definition of current activity on click
                                                  e.stopPropagation();
                                                  op.current.toggle(e);

                                                  setCustomDialogContent(
                                                    "The activities currently enabled for execution.",
                                                  );
                                                }}
                                                onMouseEnter={(e) => {
                                                  //display the definition of current activity on click
                                                  e.stopPropagation();
                                                  op.current.toggle(e);

                                                  setCustomDialogContent(
                                                    "The activities currently enabled for execution.",
                                                  );
                                                }}
                                                onMouseLeave={(e) =>
                                                  op.current.toggle(e)
                                                }
                                              >
                                                <InfoIcon className="tab-info" />
                                              </IconButton>
                                              Executable Activities
                                            </Typography>
                                          </Badge>
                                        }
                                        value="2"
                                      />
                                      {/* tab to show upcoming' activities */}

                                      <Tab
                                        label={
                                          <Badge
                                            badgeContent={
                                              activityCount.queued
                                            }
                                            color="info"
                                            max={9999}
                                          >
                                            <Typography className="tab-label">
                                              <IconButton
                                                onClick={(e) => {
                                                  //display the definition of upcoming activity on click
                                                  e.stopPropagation();
                                                  op.current.toggle(e);

                                                  setCustomDialogContent(
                                                    "The activities that will be activated later.",
                                                  );
                                                }}
                                                onMouseEnter={(e) => {
                                                  e.stopPropagation();
                                                  op.current.toggle(e);

                                                  setCustomDialogContent(
                                                    "The activities that will be activated later.",
                                                  );
                                                }}
                                                onMouseLeave={(e) =>
                                                  op.current.toggle(e)
                                                }
                                              >
                                                <InfoIcon className="tab-info" />
                                              </IconButton>
                                              Queued Activities
                                            </Typography>
                                          </Badge>
                                        }
                                        value="3"
                                      />
                                      {/* tab to show enforced activities */}

                                      <Tab
                                        label={
                                          <Badge
                                            badgeContent={
                                              activityCount.reviewed
                                            }
                                            color="info"
                                            max={9999}
                                          >
                                            <Typography className="tab-label">
                                              <IconButton
                                                onClick={(e) => {
                                                  //display the definition of upcoming activity on click
                                                  e.stopPropagation();
                                                  op.current.toggle(e);

                                                  setCustomDialogContent(
                                                    "The activities whose review is in progress",
                                                  );
                                                }}
                                                onMouseEnter={(e) => {
                                                  //display the definition of current activity on click
                                                  e.stopPropagation();
                                                  op.current.toggle(e);

                                                  setCustomDialogContent(
                                                    "The activities whose review is in progress",
                                                  );
                                                }}
                                                onMouseLeave={(e) =>
                                                  op.current.toggle(e)
                                                }
                                              >
                                                <InfoIcon className="tab-info" />
                                              </IconButton>
                                              Activities Getting Reviewed
                                            </Typography>
                                          </Badge>
                                        }
                                        value="4"
                                      />

                                      <Tab
                                        label={
                                          <Typography className="tab-label">
                                            <IconButton
                                              onClick={(e) => {
                                                //display the definition of upcoming activity on click
                                                e.stopPropagation();
                                                op.current.toggle(e);

                                                setCustomDialogContent(
                                                  "The activities that were completed or aborted in the past. Data shown based on date selection.",
                                                );
                                              }}
                                              onMouseEnter={(e) => {
                                                //display the definition of current activity on click
                                                e.stopPropagation();
                                                op.current.toggle(e);

                                                setCustomDialogContent(
                                                  "The activities that were completed or aborted in the past. Data shown based on date selection.",
                                                );
                                              }}
                                              onMouseLeave={(e) =>
                                                op.current.toggle(e)
                                              }
                                            >
                                              <InfoIcon className="tab-info" />
                                            </IconButton>
                                            Historical Activities
                                          </Typography>
                                        }
                                        value="5"
                                      />
                                    </TabList>
                                  </Box>
                                  {/* tab panel of enforced activities */}
                                  <TabPanel value="1" sx={{ padding: 0 }}>
                                    <ActivityDetailTable
                                      tableType={tableType}
                                      setTableType={setTableType}
                                      setRenderTrigger={setRenderTrigger}
                                      renderTrigger={renderTrigger}
                                      filter={filter}
                                      setFilter={setFilter}
                                      activityDetails={
                                        activityDetails?.enforced
                                      }
                                      setActivityDetails={
                                        handleSetEnforcedActivities
                                      }
                                      jobDetails={jobData}
                                      isDisabled={isDisabledButton}
                                      setDisabled={setDisabledButton}
                                      uploadFileDisabled={uploadFileDisabled}
                                      setUploadFileDisabled={
                                        setUploadFileDisabled
                                      }
                                      allJobDetailsForTenant={allJobsForTenant}
                                      groupDetails={groupDetails}
                                      performer={performer}
                                      tabValue={1}
                                      fromDate={
                                        selectedCalendarTabularDetails.startDate
                                      }
                                      toDate={
                                        selectedCalendarTabularDetails.endDate
                                      }
                                      setFromDate={handleSetStartDate}
                                      setToDate={handleSetEndDate}
                                      loader={loader}
                                      
                                    />
                                  </TabPanel>
                                  {/* tab panel of current activities */}
                                  <TabPanel value="2" sx={{ padding: 0 }}>
                                    <ActivityDetailTable
                                      tableType={tableType}
                                      setTableType={setTableType}
                                      filter={filter}
                                      renderTrigger={renderTrigger}
                                      setRenderTrigger={setRenderTrigger}
                                      setFilter={setFilter}
                                      activityDetails={activityDetails?.current}
                                      setActivityDetails={
                                        handleSetCurrentActivities
                                      }
                                      jobDetails={jobData}
                                      isDisabled={isDisabledButton}
                                      setDisabled={setDisabledButton}
                                      uploadFileDisabled={uploadFileDisabled}
                                      setUploadFileDisabled={
                                        setUploadFileDisabled
                                      }
                                      allJobDetailsForTenant={allJobsForTenant}
                                      groupDetails={groupDetails}
                                      performer={performer}
                                      tabValue={2}
                                      fromDate={
                                        selectedCalendarTabularDetails.startDate
                                      }
                                      toDate={
                                        selectedCalendarTabularDetails.endDate
                                      }
                                      setFromDate={handleSetStartDate}
                                      setToDate={handleSetEndDate}
                                      loader={loader}
                                      
                                    />
                                  </TabPanel>

                                  {/* tab panel of upcoming activities */}
                                  <TabPanel value="3" sx={{ padding: 0 }}>
                                    <ActivityDetailTable
                                      tableType={tableType}
                                      setTableType={setTableType}
                                      setRenderTrigger={setRenderTrigger}
                                      renderTrigger={renderTrigger}
                                      filter={filter}
                                      setFilter={setFilter}
                                      activityDetails={
                                        activityDetails?.upcoming
                                      }
                                      setActivityDetails={
                                        handleSetUpcomingActivities
                                      }
                                      jobDetails={jobData}
                                      isDisabled={isDisabledButton}
                                      setDisabled={setDisabledButton}
                                      uploadFileDisabled={uploadFileDisabled}
                                      setUploadFileDisabled={
                                        setUploadFileDisabled
                                      }
                                      allJobDetailsForTenant={allJobsForTenant}
                                      groupDetails={groupDetails}
                                      performer={performer}
                                      tabValue={3}
                                      fromDate={
                                        selectedCalendarTabularDetails.startDate
                                      }
                                      toDate={
                                        selectedCalendarTabularDetails.endDate
                                      }
                                      setFromDate={handleSetStartDate}
                                      setToDate={handleSetEndDate}
                                      loader={loader}
                                      
                                    />
                                  </TabPanel>
                                  {/* tab panel of activities getting reviewed */}
                                  <TabPanel value="4" sx={{ padding: 0 }}>
                                    <ActivityDetailTable
                                      tableType={tableType}
                                      setTableType={setTableType}
                                      setRenderTrigger={setRenderTrigger}
                                      renderTrigger={renderTrigger}
                                      filter={filter}
                                      setFilter={setFilter}
                                      activityDetails={
                                        activityDetails?.reviewed
                                      }
                                      setActivityDetails={
                                        handleSetReviewedActivities
                                      }
                                      jobDetails={jobData}
                                      isDisabled={isDisabledButton}
                                      setDisabled={setDisabledButton}
                                      uploadFileDisabled={uploadFileDisabled}
                                      setUploadFileDisabled={
                                        setUploadFileDisabled
                                      }
                                      allJobDetailsForTenant={allJobsForTenant}
                                      groupDetails={groupDetails}
                                      performer={performer}
                                      tabValue={4}
                                      fromDate={
                                        selectedCalendarTabularDetails.startDate
                                      }
                                      toDate={
                                        selectedCalendarTabularDetails.endDate
                                      }
                                      setFromDate={handleSetStartDate}
                                      setToDate={handleSetEndDate}
                                      loader={loader}
                                      
                                    />
                                  </TabPanel>

                                  <TabPanel value="5" sx={{ padding: 0 }}>
                                    <ActivityHistory
                                      fromDate={
                                        selectedCalendarTabularDetails.startDate
                                      }
                                      toDate={
                                        selectedCalendarTabularDetails.endDate
                                      }
                                      setFromDate={handleSetStartDate}
                                      setToDate={handleSetEndDate}
                                    />
                                  </TabPanel>
                                </TabContext>
                              </Box>
                            ) : (
                              // render when a date is clicked and there are activities present on that date
                              <Box>
                                <ActivityDetailTable
                                  tableType={tableType}
                                  setTableType={setTableType}
                                  setRenderTrigger={setRenderTrigger}
                                  renderTrigger={renderTrigger}
                                  filter={filter}
                                  setFilter={setFilter}
                                  activityDetails={dateBasedRows}
                                  setActivityDetails={setDateBasedRows}
                                  jobDetails={jobData}
                                  isDisabled={isDisabledButton}
                                  setDisabled={setDisabledButton}
                                  uploadFileDisabled={uploadFileDisabled}
                                  setUploadFileDisabled={setUploadFileDisabled}
                                  allJobDetailsForTenant={allJobsForTenant}
                                  groupDetails={groupDetails}
                                  performer={performer}
                                  selectedDate={selectedDate}
                                />
                              </Box>
                            )}
                          </Box>
                        )}
                      </Box>
                    </PaddedPaper>
                  </Grid>
                </Grid>
              </Container>
            </Grid>
          </Grid>
          {/* Overlay panel to display the explanation of the tabs*/}
          <OverlayPanel ref={op}>
            <div>{customDialogContent}</div>
          </OverlayPanel>
        </div>
      )}
    </div>
  );
};

export default JobPerformer;
