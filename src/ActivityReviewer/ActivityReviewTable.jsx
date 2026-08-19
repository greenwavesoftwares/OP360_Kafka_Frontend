// Importing Material-UI icons for various functionalities
import CloseIcon from "@mui/icons-material/Close"; // Icon for closing actions
import CloudDownloadIcon from "@mui/icons-material/CloudDownload"; // Icon for download actions
import DoneIcon from "@mui/icons-material/Done"; // Icon to indicate completion
import GroupIcon from "@mui/icons-material/Group"; // Icon representing a group of people
import PersonIcon from "@mui/icons-material/Person"; // Icon representing a single person
import SearchIcon from "@mui/icons-material/Search"; // Icon for search functionality
import StopIcon from "@mui/icons-material/Stop";
// Importing custom components and API functions
import EmailJobReview from "../Email Template/EmailJobReview"; // Component for reviewing email activity
import EmailRejectedActivity from "../Email Template/EmailRejectedActivity"; // Component for reviewing email activity

import { sendEmail } from "../JobAssign/JobAssignAPI"; // Function to send emails related to job assignments

// Importing Material-UI components for UI elements
import {
  Avatar,
  Backdrop, // Component for user avatars
  Badge, // Component for displaying notifications or counts
  Button, // Standard button component
  Chip,
  CircularProgress, // Component for displaying small blocks of information
  InputAdornment, // Component for adding adornments to inputs
  Tooltip as MuiTooltip, // Tooltip component for additional information on hover
  TextField, // Component for text input fields
  Tooltip,
  useMediaQuery,
  useTheme, // Tooltip component (imported as a different name)
} from "@mui/material";

// Importing additional Material-UI components for layout and structure
import Box from "@mui/material/Box"; // Component for layout and spacing
import IconButton from "@mui/material/IconButton"; // Button component for icons
import Paper from "@mui/material/Paper"; // Component for a paper-like surface
import Table from "@mui/material/Table"; // Component for displaying tabular data
import TableBody from "@mui/material/TableBody"; // Component for table body
import TableCell from "@mui/material/TableCell"; // Component for individual table cells
import TableContainer from "@mui/material/TableContainer"; // Component for containing tables
import TableHead from "@mui/material/TableHead"; // Component for table header
import TableRow from "@mui/material/TableRow"; // Component for table rows
import Typography from "@mui/material/Typography"; // Component for displaying text

import ReactDOMServer from "react-dom/server"; // For server-side rendering of React components

// Importing PrimeReact button component
import { Button as PrimeReactButton } from "primereact/button"; // Button component from PrimeReact

// Importing React and hooks
import React, { useEffect, useRef, useState } from "react"; // React library and hooks for state and refs
import { useLocation, useNavigate } from "react-router-dom"; // Hook for navigation in React Router

// Importing utility functions for job handling
import {
  addJobDetailsInLocalStorage,
  addLocalVariablesForJob, delay, // Function to add job details to local storage
  deriveInitials,
  emailPerformerForNextActivities,
  fetchCurrentUser,
  saveUnsavedTransaction,
  sendEmailNotificationsToReviewJob, // Function to derive initials from a name
} from "../JobPerformer/JobHelper";

// Importing API functions for job-related operations
import {
  downloadFileFromMinIO,
  getJobDetailsBasedOnJobId, // Function to fetch job details by job ID
  updateJobAndActivity, // Function to update job and activity information
} from "../JobPerformer/JobPerformerAPI";

// Importing PrimeReact panel component
import { Panel } from "primereact/panel"; // Panel component from PrimeReact

// Importing helper function for formatting datetime
import { formatDatetime } from "../JobAssign/helper"; // Function to format datetime values

// Importing API functions for logbook operations
import {
  getAllActiveFormInfo, // Function to get all active form information
  getAllTransactions, // Function to get all transactions
} from "../Logbook/LogbookApi";

// Importing authentication service function
import { decryptTokenId } from "../helper/AuthService"; // Function to decrypt token IDs

// Importing API function for updating job status
import { updateJobStatus } from "./ActivityReviewerAPI"; // Function to update job status

// Importing RemarksDialog component for displaying remarks
import RemarksDialog from "./RemarksDialog"; // Component for displaying remarks dialog
import { geAllJobsByTenant } from "../JobAssign/JobAssignAPI";
import { OverlayPanel } from "primereact/overlaypanel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SnackbarComponent from "../components/shared/snackbar/customSnackbar";
import ActivityTerminationDialog from "./ActivityTerminationDialog";

import { ProgressBar } from "primereact/progressbar"; // Progress bar for showing loading state
import "./ActivityReviewer.css";
import { fetchAllUsers } from "../UserModuleUpdated/UsermoduleApi";
import DateSelection from "../JobPerformer/DateSelection";
import { sendNotification } from "../pwa/pushNotification";
import { fetchJobDetails } from "../JobReviewer/JobReviewerAPI";
// Defining styles for various components
const styles = {
  typography: {
    fontSize: "0.9rem", // Font size for typography
    color: "white", // Text color
    fontWeight: 400, // Font weight
  },
  jobHead: {
    backgroundColor: "#263238", // Background color for job header
    padding: "12px", // Padding for job header
  },
  activityHead: {
    backgroundColor: "#546e7a", // Background color for activity header
  },
  tableCell: {
    padding: "10px", // Padding for table cells
  },
};

export default function ActivityReviewTable({
  rows, //prop to hold jobs, whose activities are to be reviewed
  filter, //prop to filter activities
  setFilter, //prop to change filter
  isDisabled, //prop to disable button for a few rows
  setDisabled, //prop to change the list of disabled rows
  renderTrigger, //prop to call useEffect on change
  setRenderTrigger, //prop to change render trigger,
  showloader, //prop to show loader,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
}) {
  const [remarks, setRemarks] = useState(null); //State to store remarks of a given activity
  const [openDialog, setOpenDialog] = useState(false); //State to open popup
  const [jobHandleConfirm, setJobHandleConfirm] = useState(null); //state to hold the job whose activities are to be updated
  const [activityHandleConfirm, setActivityHandleConfirm] = useState(null); //state to hold the activities to be updated
  const [valueHandleConfirm, setValueHandleConfirm] = useState(null); //state to hold the approved or rejected status of an activity
  const [confirmLabel, setConfirmLabel] = useState(null); //state to hold the label of the confirmation popup
  const [modalInfo, setModalInfo] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackContent, setSnackContent] = useState(null);
  const [terminateActivity, setTerminateActivity] = useState(null);
  const [showLoadingBackdrop, setLoadingBackdrop] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("md"));
  const op = useRef(null);
  const location = useLocation();
  const navigate = useNavigate(); //React hook to navigate to a given page
  //function to fetch decrypted tenant from local storage
  const getTenantID = () => {
    const env_tenant = process.env.REACT_APP_TENANTID;
    const encryptedTenant = localStorage.getItem(env_tenant);
    const tenant = decryptTokenId(encryptedTenant);
    return tenant;
  };
  const currentuser = fetchCurrentUser();
  //Function to store the filter in the state
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  }; // First, filter rows based on jobName and activityName in task list
  let filteredRows = rows.filter(
    (row) =>
      row?.jobName?.toLowerCase().includes(filter?.toLowerCase()) ||
      row?.task?.activityList?.some((act) =>
        act?.activityName?.toLowerCase().includes(filter?.toLowerCase()),
      ),
  );

  // Further filter activities based on the activity name
  filteredRows = filteredRows.map((row) => {
    // Filter the activities within each task
    if (
      !row?.jobName?.toLowerCase().includes(filter?.toLowerCase()) &&
      row?.task?.activityList
    ) {
      row.task.activityList = row.task.activityList.filter((act) =>
        act?.activityName?.toLowerCase().includes(filter?.toLowerCase()),
      );
    }
    return row;
  });

  //function to open popup to confirm whether to terminate the activity or not
  const handleTerminateActivityDialog = (row, activity) => {
    setTerminateActivity({ activity: activity, job: row });
  };
  //function to terminate the activity
  const handleTerminateActivityConfirm = () => {
    handleApproveReject(
      terminateActivity.job,
      terminateActivity.activity,
      "Aborted",
    );
    setTerminateActivity(null);
  };
  //Function called when activities to be reviewed is confirmed
  const handleConfirm = () => {
    handleApproveReject(
      jobHandleConfirm,
      activityHandleConfirm,
      valueHandleConfirm,
    ); //Call the  function to approve or reject the activities
    //reset the states needed in the popup
    setOpenDialog(false);
    setJobHandleConfirm(null);
    setActivityHandleConfirm(null);
    setValueHandleConfirm(null);
    setConfirmLabel(null);
    setRemarks(null);
  };
  //reset the states when the popup is canceled using this function
  const handleCancel = () => {
    setOpenDialog(false);
    setJobHandleConfirm(null);
    setActivityHandleConfirm(null);
    setValueHandleConfirm(null);
    setRemarks(null);
    setConfirmLabel(null);
  };
  //Function to navigate to logbook form
  async function handleLinkClick(row, activity) {
    setLoadingBackdrop(true);
    // Retrieve the item from localStorage and parse it into an object
    let notDisabledApprovedReject = JSON.parse(
      localStorage.getItem("notDisabledApprovedReject"),
    ) || { notDisabledApprovedReject: [] };

    // Ensure the array is initialized properly
    notDisabledApprovedReject =
      notDisabledApprovedReject?.length > 0 ? notDisabledApprovedReject : [];

    // Add the new object to the array
    notDisabledApprovedReject = [
      ...notDisabledApprovedReject,
      { jobId: row.jobID, activityId: activity.activityId },
    ];

    // Update localStorage with the modified object
    localStorage.setItem(
      "notDisabledApprovedReject",
      JSON.stringify(notDisabledApprovedReject),
    );
    if (activity.logbook === null || activity.logbook === "") return;
    const activeForms = await getAllActiveFormInfo(); //fetches all active forms
    let version = 0;
    let formId = null;
    activeForms.map((obj) => {
      if (
        obj.formName.trim().toLowerCase() ===
        activity.logbook.trim().toLowerCase()
      ) {
        version = obj.versionNumber;
        formId = obj.formID;
      }
    }); //finds the version of current  logbook form

    const logbooktransaction = await getAllTransactions(
      row.jobID,
      activity.activityId,
      activity.logbook,
      version,
    ); //function to fetch the transctions made in  the logbook

    const jobdetails = await getJobDetailsBasedOnJobId(
      row.jobID,
      getTenantID(),
    ); //Function to fetch job information based on  job id

    const jobInfo = await addLocalVariablesForJob(
      jobdetails,
      activity,
      version,
      currentuser,
      location.pathname,
    ); //Function to store information of the job in local storage
    jobInfo.formId = formId;
    console.log("Formid:", formId);
    setLoadingBackdrop(false);
    navigate("/workflow/LogbookForm", {
      state: jobInfo,
    });

    // navigate({pathname:"/LogbookForm",
    //   state: "Hello"
    // });
  }
  /**
   * 
   * @param {*} job 
   * @param {*} activity 
   * @param {*} value 
   * Function to confirm whether to approve or reject  the activity

   */

  const handleDialogOpen = (job, activity, value) => {
    const notDisabledApprovedReject = JSON.parse(
      localStorage.getItem("notDisabledApprovedReject"),
    );

    const isApprovedReject = notDisabledApprovedReject?.some(
      (obj) =>
        obj.jobId === job.jobID && obj.activityId === activity.activityId,
    );

    if (
      !isApprovedReject &&
      !(
        activity.logbook === null ||
        activity.logbook === undefined ||
        activity.logbook.length === 0
      )
    ) {
      setOpenSnackbar(true);
      setSnackContent({
        dialog: "Logbook review is still pending",
        severity: "error",
      });

      return;
    }

    setOpenDialog(true); //set the state to open the dialog box
    setJobHandleConfirm(job); //set the state which holds the job whose activity is to be updated
    setActivityHandleConfirm(activity); //set the state which holds the activities whose  status is to be updated
    setValueHandleConfirm(value); //set the status of the activity
    setConfirmLabel(value === "Completed" ? "Approve" : "Reject"); //set the confirmation label
  };

  /**
   *
   * @param {*} job
   * @param {*} activity
   * Function called when review is to be started for a given activity
   */
  const handleReview = async (job, activity) => {
    setDisabled([...isDisabled, activity]); //Add the  activity to the disabled array, so that the user doesnt press the same button more than once
    let updatedActivity = {
      ...activity,
      reviewerActivityStartTime: new Date(),
      actvityStatus: "Review Started",
    }; //modify the activity
    const updatedJob = {
      ...job,
      task: {
        ...job.task,
        activityList: [{ ...updatedActivity }], //add the activity to update
      },
    }; //modify the job with the  updated activity

    const response = await updateJobAndActivity(updatedJob); //function to update to database
    if (response?.status === 200) {
      setOpenSnackbar(true);
      setSnackContent({ dialog: "Update Successful", severity: "success" });
    } else {
      setOpenSnackbar(true);
      setSnackContent({ dialog: "Error", severity: "error" });
    }
    // console.log("Prior to delay")
    // await delay(4000)
    setRemarks(null); //reset the remarks
    // setDisabled((prev) => prev.filter((item) => item !== activity));
    setRenderTrigger(renderTrigger+1)
  };

  const handleApproveReject = async (job, activity, approveOrRejectValue) => {
    setDisabled([...isDisabled, activity]); //Add the  activity to the disabled array, so that the user doesnt press the same button more than once
    
    const savedTransaction = await saveUnsavedTransaction(
      { jobid: job.jobID, activityId: activity.activityId },
      setOpenSnackbar,
      setSnackContent,
    );
    if (savedTransaction === false) {setDisabled((prev) => prev.filter((item) => item !== activity));
  ;
  return;}

    let updatedActivity = {
      ...activity,
      //reviewerActivityStartTime:currentDate,
      reviewerActivityStopTime: new Date(), //add the time from when  the review started
      actvityStatus: approveOrRejectValue, //add the activity status of the current activity
      remarks: remarks != null ? remarks : activity.remarks, //add the remarks given for the current activity
      actualActivityStartTime:
        approveOrRejectValue === "Rejected"
          ? null
          : activity.actualActivityStartTime, //add the activity start time
      actualActivityEndTime:
        approveOrRejectValue === "Rejected"
          ? null
          : activity.actualActivityEndTime, //add the activity end time
    };
    const updatedJob = {
      ...job,
      task: {
        ...job.task,
        activityList: [{ ...updatedActivity }],
      },
    };
    //update the job with the given activity
    const response = await updateJobAndActivity(updatedJob);
    approveOrRejectValue === "Completed" && (await updateJobStatus(job.jobID)); //call the function which updates the job status when all activities are approved
    if (approveOrRejectValue === "Rejected") {
      
          
      
    const jobInfo = await fetchJobDetails(job.jobID); //Function call to fetch all jobs
            
      const mailIdList = await rejectedActivityMailIds(updatedActivity);
      console.log("mail ids:", mailIdList);
      sendEmailNotificationsForRejectedActivities(
        [jobInfo],
        [...mailIdList],
      );
    }
    //Send mail to reviewer if the job status is Sent For Approval
    if (approveOrRejectValue === "Completed") {
      const jobInfo = await fetchJobDetails(job.jobID); //Function call to fetch all jobs
          
      const approver = jobInfo.approver; //add the approver
      await emailPerformerForNextActivities(jobInfo);
      if (jobInfo.jobStatus === "Sent For Approval")
        sendEmailNotificationsToReviewJob(
          [jobInfo],
          [approver],
        ); //function called to send mail to reviewer
    }
    if (approveOrRejectValue === "Rejected") {
      let notDisabledApprovedReject = JSON.parse(
        localStorage.getItem("notDisabledApprovedReject"),
      );
      //jobId: row.jobID, activityId: activity.activityId
      notDisabledApprovedReject = notDisabledApprovedReject.filter(
        (obj) =>
          obj.jobId !== job.jobID && obj.activityId !== activity.activityId,
      );
      console.log("Not disabled approved reject:", notDisabledApprovedReject);
      // Update localStorage with the modified object
      localStorage.setItem(
        "notDisabledApprovedReject",
        JSON.stringify(notDisabledApprovedReject),
      );
    }

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
    // setDisabled((prev) => prev.filter((item) => item !== activity));
  
    setRenderTrigger(renderTrigger + 1); //update the trigger which call a useEffect on change
  };
  const rejectedActivityMailIds = async (activity) => {
    const toMailList = new Set(); //*unique toMail users

    const allUsersData = await fetchAllUsers();
    console.log("aCTIVITY FOR REJECTED MAIL", activity);
    if (activity.performerType.toLowerCase() === "group") {
      //* if the activity performers type is group then all the users belonging to that group will be added
      // console.log("Group ! ");
      const performers = allUsersData
        .filter((user) =>
          user.group.some(
            (group) => group.groupName === activity.groupOrDeptName,
          ),
        )
        .map((user) => user.userID);

      performers.forEach((user) => toMailList.add(user));
    } else {
      toMailList.add(activity.performer); //by default performer will be added
    }
    console.log("To mail list:", toMailList);
    return toMailList;
  };
  const sendEmailNotificationsForRejectedActivities = async (
    jobsToMail,
    toMailList,
  ) => {
    try {
      const homePage = process.env.REACT_APP_HOME;

      const emailNotifications = await Promise.all(
        jobsToMail.map(async (data) => {
          try {
            let finalMailHtml = createHtmlStringForRejectedActivities(
              data,
              homePage,
            );
            // Remove the outer <div> tags from the HTML string
            finalMailHtml = finalMailHtml
              .replace(/^<div>/, "")
              .replace(/<\/div>$/, "");
            // Create the mail object with the html string and mail list
            const mailObject = {
              toMailIds: toMailList,
              messageSubject: "Job",
              htmlPage: finalMailHtml,
            };
            const notificationBody = {
              title: "Job Reperform Pending",

              body: `Your have a rejected activity ${data.task.activityList[0].activityName} to re-perform`,

              url: "/workflow/performer",
            };
            console.log("notificationBody ::: ", notificationBody);
            console.log("To Mail ids:::", toMailList[0]);
            const tenant=getTenantID()
            let notificationsuccess=null
            try {
              for (const mailid of toMailList)
                notificationsuccess = await sendNotification(
                  tenant,
                  mailid,
                  notificationBody,
                );
            } catch (e) {
              console.error("Error in send notification:", notificationsuccess);
            }
            // Call the sendEmail function to send the mail
            const success = await sendEmail(mailObject);
            if (success?.status === 200) {
              return data;
            } else {
              throw new Error(`Email Error: ${JSON.stringify(data)}`);
            }
          } catch (error) {
            console.error("Error sending mail:", error);
            throw error; // Rethrow the error to be caught in the outer catch block
          }
        }),
      );
      if (emailNotifications.length > 0) return true;
    } catch (e) {
      console.error("Error in sending  mails :", e);
      return false;
    }
  }; /**
   * Function to create the HTML string for the email notifications
   * @param {object} data - Job data
   * @param {string} forwardLink - The link to be forwarded to the reviewer
   * @returns {string} - The HTML string for the email notification
   */
  const createHtmlStringForRejectedActivities = (data, forwardLink) => {
    const updatedData = { ...data, forwardLink: forwardLink };
    // Render the EmailActivityReview component to a string using ReactDomServer
    const htmlData = ReactDOMServer.renderToString(
      <EmailRejectedActivity data={updatedData} />,
    );
    return htmlData;
  };
  
  

  //Function called when a blob is downloaded
  const handleDownloadBlob = async (key) => {
    try {
      const response = await downloadFileFromMinIO(key);

      // ✅ get filename from backend
      const disposition = response.headers["content-disposition"];
      let filename = key.substring(key.indexOf("_") + 1);

      if (disposition) {
        const match = disposition.match(/filename="?(.+)"?/);
        if (match?.[1]) filename = match[1];
      }

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");

      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("File download error", err);
    }
  };

  // Example usage:
  // handleDownloadBlob(base64Data, 'filename.pdf');
  const ref = useRef(null);

  return (
    /*
     This component renders a table that displays the activities to be reviewed.
     The table is searchable and it also has a filter by job id.
     The table also has a status column which displays the status of the activity.
     The table also has a remarks column which displays the remarks of the activity.
     The table also has an action column which displays the action that can be taken on the activity.
     The actions are approve, reject and start review.
     The component also has a dialog which pops up when the user clicks on the start review button.
     The dialog asks the user to confirm whether they want to start the review or not.
    */
    <Box>
      <Panel
        className="tabViewStyle forBorderRadius noPadding HeaderStyle"
        ref={ref}
        style={{ padding: "0" }}
        header={
          <Box
            sx={{
              display: "flex", //flexbox layout
              flexDirection: isMobile || isTab ? "column" : "row",
              justifyContent: "space-between", //the items are positioned evenly
              paddingBottom: "0.7rem",
              paddingTop: "2rem",
              gap: !(isMobile || isTab) ? 35 : 0,
              padding: "0.5rem 0rem",
            }}
          >
            <Box sx={{ paddingLeft: "10px", flexShrink: 0 }}>
              <DateSelection
                fromDate={fromDate}
                setFromDate={setFromDate}
                toDate={toDate}
                setToDate={setToDate}
                isMob={isMobile}
                isTab={isTab}
              />
            </Box>

            <TextField
              size="small"
              id="search1"
              label="Search"
              value={filter}
              placeholder="Search"
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
        }
      >
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: 560, //set the max height of the table container
            border: "1px solid #e0e0e0", //set the border details of the table
            boxShadow: "none",

            borderRadius: 0,
          }}
        >
          <Table aria-label="table">
            {/* Table head of the  table */}
            {!showloader && !filteredRows?.length > 0 && (
              <caption>No data available</caption>
            )}
            <TableHead className="table-head">
              <TableRow>
                <TableCell
                  align="center"
                  className="MuiDatatableTableHeader"
                  sx={{ width: "8rem" }}
                >
                  <Typography className="MuiDatatableTableHeader-Font">
                    Job Name
                  </Typography>
                </TableCell>
                <TableCell
                  align="center"
                  className="MuiDatatableTableHeader"
                  sx={{ width: "8rem" }}
                >
                  <Typography
                    className={
                      isMobile || isTab
                        ? "MuiDatatableTableHeader-Font ellipsisText"
                        : "MuiDatatableTableHeader-Font"
                    }
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    Activity Name
                  </Typography>
                </TableCell>
                <TableCell
                  align="center"
                  className="MuiDatatableTableHeader"
                  sx={{ width: "8rem" }}
                >
                  <Typography
                    className="MuiDatatableTableHeader-Font"
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    Performer
                  </Typography>
                </TableCell>

                <TableCell
                  align="center"
                  className="MuiDatatableTableHeader"
                  sx={{ width: "20rem" }}
                >
                  <Tooltip
                    title={
                      isMobile || isTab
                        ? "Scheduled Start Time vs Stop Time"
                        : ""
                    }
                    placement="top"
                  >
                    <Typography
                      className={
                        isMobile || isTab
                          ? "MuiDatatableTableHeader-Font ellipsisText"
                          : "MuiDatatableTableHeader-Font"
                      }
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      Scheduled Start vs Stop
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell
                  align="center"
                  className="MuiDatatableTableHeader"
                  sx={{ width: "12.5rem" }}
                >
                  <Tooltip
                    title={isMobile || isTab ? "Actual Start vs Stop Time" : ""}
                    placement="top"
                  >
                    <Typography
                      className={
                        isMobile || isTab
                          ? "MuiDatatableTableHeader-Font ellipsisText"
                          : "MuiDatatableTableHeader-Font"
                      }
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      Actual Start vs Stop
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell
                  align="center"
                  className="MuiDatatableTableHeader"
                  sx={{ width: "8rem", border: "none" }}
                >
                  <Typography
                    className="MuiDatatableTableHeader-Font"
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    Status
                  </Typography>
                </TableCell>
                <TableCell
                  align="center"
                  className="MuiDatatableTableHeader"
                  sx={{ width: "8rem", border: "none" }}
                >
                  <Typography
                    className="MuiDatatableTableHeader-Font"
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    Attachment
                  </Typography>
                </TableCell>
                <TableCell
                  align="center"
                  className="MuiDatatableTableHeader"
                  sx={{ width: "8rem", border: "none" }}
                >
                  <Typography className="MuiDatatableTableHeader-Font">
                    Remarks
                  </Typography>
                </TableCell>
                <TableCell
                  align="center"
                  className="MuiDatatableTableHeader"
                  sx={{ width: "8rem", border: "none" }}
                >
                  <Typography className="MuiDatatableTableHeader-Font">
                    Action
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {showloader && (
                <TableCell colSpan={10}>
                  <ProgressBar
                    mode="indeterminate" // Indeterminate loading mode
                    style={{ height: "6px" }} // Set height of the progress bar
                  />
                </TableCell>
              )}
              {/* iterate through filtered rows to find  the matching row and display the data in the table body */}
              {!showloader &&
                filteredRows.map((row, index) => {
                  return (
                    <React.Fragment key={index}>
                      {/* iterate through each activity in the row to display it in the table row */}
                      {row.task.activityList.map((activity, activityIndex) => {
                        return (
                          <TableRow key={activityIndex}>
                            <TableCell
                              align="center"
                              className="MuiDatatableBodyPadding"
                            >
                              <Tooltip
                                title={
                                  <>
                                    Job Name: {row.jobName}
                                    <br />
                                    Job Id: {row.jobID}
                                  </>
                                }
                                placement="top"
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
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              align="center"
                              className="MuiDatatableBodyPadding"
                            >
                              <Tooltip title={activity.logbook}>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                  }}
                                >
                                  {/* if the activity status is review started then activate the logbook, if there is an active logbook present */}
                                  {activity.actvityStatus ===
                                    "Review Started" &&
                                  activity.logbook !== null &&
                                  activity.logbook !== "" ? (
                                    <Chip
                                      label={activity.activityName}
                                      color="info"
                                      size="medium"
                                      onClick={() => {
                                        handleLinkClick(row, activity);
                                      }}
                                    ></Chip>
                                  ) : (
                                    <Chip
                                      size="medium"
                                      label={activity.activityName}
                                    ></Chip>
                                  )}
                                  {/* if the activity is enforced then display a badge */}
                                  {activity.enforce === true && (
                                    <Tooltip title="Enforced" placement="right">
                                      <Badge
                                        color="warning"
                                        variant="dot"
                                      ></Badge>
                                    </Tooltip>
                                  )}
                                </div>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              align="center"
                              className="MuiDatatableBodyPadding"
                            >
                              <Tooltip
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
                                    activity.performerType === "Performer" ? (
                                      <PersonIcon
                                        sx={{
                                          fontSize: "0.65rem",
                                          background: "#29b6f6",
                                          color: "white",
                                        }}
                                      />
                                    ) : (
                                      <GroupIcon
                                        sx={{
                                          fontSize: "0.65rem",
                                          color: "white",
                                        }}
                                      />
                                    )
                                  }
                                >
                                  {/* Display the initial of the performer or group name in Avatar */}
                                  <Avatar
                                    sx={{
                                      bgcolor:
                                        activity.performerType === "Performer"
                                          ? "#29b6f6"
                                          : "#ff9800",
                                    }}
                                    style={{
                                      width: "30px",
                                      height: "30px",
                                      fontSize: "0.85rem",
                                    }}
                                  >
                                    {activity.performer?.length > 0
                                      ? deriveInitials(activity.performer)
                                      : deriveInitials(
                                          activity.groupOrDeptName,
                                        )}
                                  </Avatar>
                                </Badge>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              align="center"
                              className="MuiDatatableBodyPadding"
                              style={{ minWidth: 150 }}
                            >
                              {/* Scheduled Start and End Time */}
                              <>
                                <p style={{ margin: "0 0 4px 0", padding: 0 }}>
                                  {formatDatetime(
                                    activity.scheduledActivityStartTime,
                                  )}
                                </p>
                                <p style={{ margin: "", padding: 0 }}>
                                  {formatDatetime(
                                    activity.scheduledActivityEndTime,
                                  )}
                                </p>
                              </>
                            </TableCell>

                            <TableCell
                              align="center"
                              className="MuiDatatableBodyPadding"
                              style={{ minWidth: 150 }}
                            >
                              {/* Actual Start and End Time */}
                              {/* If activity.actualActivityStartTime or activity.actualActivityEndTime is null, show "---" */}
                              {/* Otherwise, format the datetime and display it */}
                              <>
                                <p style={{ margin: "0 0 4px 0", padding: 0 }}>
                                  {activity.actualActivityStartTime === null
                                    ? "---"
                                    : formatDatetime(
                                        activity.actualActivityStartTime,
                                      )}
                                </p>
                                <p style={{ margin: "0 0 4px 0", padding: 0 }}>
                                  {activity.actualActivityEndTime === null
                                    ? "---"
                                    : formatDatetime(
                                        activity.actualActivityEndTime,
                                      )}
                                </p>
                              </>
                            </TableCell>

                            <TableCell
                              align="center"
                              className="MuiDatatableBodyPadding"
                            >
                              {/*
                          Display the activity status as a button with a background color based on the status

                          The colors are as follows:
                          Completed: light blue
                          Rejected: light pink
                          Sent For Approval: light green
                          Started: light yellow
                          Review Started: light gray
                          Not Started: light gray
                          */}
                              <>
                                {activity.actvityStatus === "Completed" ? (
                                  /* This condition checks if the activity status is "Completed", if yes then 
                            it displays a button with a check icon and a light blue background color*/
                                  <MuiTooltip
                                    title="Completed"
                                    placement="right"
                                  >
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
                                        background: "#f7f6f7",
                                      }}
                                      aria-label="Filter"
                                    />
                                  </MuiTooltip>
                                ) : activity.actvityStatus === "Rejected" ? (
                                  // Tooltip for indicating "Rejected" status
                                  <MuiTooltip
                                    title="Rejected"
                                    placement="right"
                                  >
                                    {/* Button with a "times" icon to represent rejection */}
                                    <PrimeReactButton
                                      icon="pi pi-times" // Icon for rejection
                                      rounded // Button with rounded corners
                                      text // Text-styled button
                                      raised // Elevated button appearance
                                      severity="danger" // Indicates danger or error
                                      style={{
                                        height: "2.2rem", // Button height
                                        width: "2.2rem", // Button width
                                        cursor: "default", // Default cursor style
                                        boxShadow: "none", // No shadow
                                        background: "#f7f6f7", // Light pink background color
                                      }}
                                    />
                                  </MuiTooltip>
                                ) : //If the activity status is Sent For Approval display one type of icon in activity status
                                activity.actvityStatus ===
                                  "Sent For Approval" ? (
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
                                        background: "#f7f6f7",
                                      }}
                                    />
                                  </MuiTooltip>
                                ) : activity.actvityStatus === "Started" ? (
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
                                        background: "#f7f6f7",
                                      }}
                                    />
                                  </MuiTooltip>
                                ) : //If the activity status is Review Started display one type of icon in activity status

                                activity.actvityStatus === "Review Started" ? (
                                  <MuiTooltip
                                    title="Review Started"
                                    placement="right"
                                  >
                                    <PrimeReactButton
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
                                        background: "#f7f6f7",
                                      }}
                                    />
                                  </MuiTooltip>
                                ) : //If the activity status is Not Started display one type of icon in activity status

                                activity.actvityStatus === "Not Started" ? (
                                  <MuiTooltip
                                    title="Not Started"
                                    placement="right"
                                  >
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
                                        background: "#f7f6f7",
                                      }}
                                    />
                                  </MuiTooltip>
                                ) : (
                                  ""
                                )}
                              </>
                            </TableCell>
                            <TableCell
                              align="center"
                              className="MuiDatatableBodyPadding"
                            >
                              {/* If activity status is review started then show cloud download icon to download the file */}
                              {activity.actvityStatus === "Review Started" &&
                                activity.actFile !== null &&
                                activity.actFile !== undefined && (
                                  <IconButton
                                    variant="contained"
                                    onClick={() =>
                                      handleDownloadBlob(activity.actFile)
                                    }
                                  >
                                    <CloudDownloadIcon color="success" />
                                  </IconButton>
                                )}
                            </TableCell>
                            <TableCell
                              align="center"
                              className="MuiDatatableBodyPadding"
                            >
                              {activity.remarks && (
                                <IconButton
                                  onClick={(e) => {
                                    setModalInfo({
                                      header: "Reviewer Remarks",
                                      content: activity.remarks,
                                    });
                                    op.current.toggle(e);
                                  }}
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              )}
                            </TableCell>
                            <TableCell
                              align="center"
                              className="MuiDatatableBodyPadding"
                            >
                              {/* Button to start review if activity is sent for approval */}
                              {activity.actvityStatus ===
                                "Sent For Approval" && (
                                <Button
                                  variant="contained"
                                  color="info"
                                  size="small"
                                  onClick={() => handleReview(row, activity)}
                                  disabled={isDisabled.includes(activity)} //disable those activities which are in isDisabled array
                                >
                                  <Typography fontSize="10px">
                                    Start Review
                                  </Typography>
                                </Button>
                              )}
                              {/* Buttons to approve or reject if activity is in review started status */}
                              {activity.actvityStatus === "Review Started" && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                  }}
                                >
                                  <Tooltip title="Approve">
                                    <IconButton
                                      variant="contained"
                                      color="success"
                                      onClick={() => {
                                        handleDialogOpen(
                                          row,
                                          activity,
                                          "Completed",
                                        ); // function to open dialog to confirm acceptance
                                      }}
                                      disabled={isDisabled.includes(activity)}
                                    >
                                      <DoneIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Reject">
                                    <IconButton
                                      color="error"
                                      onClick={() => {
                                        handleDialogOpen(
                                          row,
                                          activity,
                                          "Rejected",
                                        ); // function to open dialog to confirm rejection
                                      }}
                                      disabled={isDisabled.includes(activity)}
                                    >
                                      <CloseIcon />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              )}
                              {/* If actiivity status is review started then show cloud download icon to download the file */}
                              {activity.actvityStatus === "Started" && (
                                <MuiTooltip
                                  title="Abort Activity"
                                  placement="right"
                                >
                                  <PrimeReactButton
                                    icon="pi pi-ban"
                                    rounded
                                    text
                                    raised
                                    severity="danger"
                                    onClick={() =>
                                      handleTerminateActivityDialog(
                                        row,
                                        activity,
                                      )
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
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
            </TableBody>
          </Table>
          {/*Custom component to add remarks when an activity is to be updated */}
          <RemarksDialog
            setOpen={setOpenDialog}
            open={openDialog}
            proceedButtonClick={handleConfirm}
            handleClose={handleCancel}
            confirmLabel={confirmLabel}
            remarks={remarks}
            setRemarks={setRemarks}
          />
          <ActivityTerminationDialog
            row={terminateActivity}
            setRow={setTerminateActivity}
            handleTerminateActivityConfirm={handleTerminateActivityConfirm}
          />
        </TableContainer>
        {showLoadingBackdrop && (
          <Backdrop
            sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
            open={showLoadingBackdrop}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
      </Panel>
      {/* Panel to display information on hover or on click */}
      <OverlayPanel ref={op}>{modalInfo?.content}</OverlayPanel>
      <SnackbarComponent
        openPopup={openSnackbar}
        setOpenPopup={setOpenSnackbar}
        snackbarSeverity={snackContent?.severity}
        dialogMessage={snackContent?.dialog}
      />
    </Box>
  );
}
