// Importing necessary React hooks and libraries
import { useEffect, useRef, useState } from "react"; // useEffect for lifecycle methods, useState for state management
import ReactDOMServer from "react-dom/server"; // For server-side rendering of React components

// Importing custom components and API functions
import EmailActivityReview from "../Email Template/EmailActivityReview"; // Component for reviewing email activity
import { geAllJobsByTenant, sendEmail } from "../JobAssign/JobAssignAPI"; // Function to send emails related to job assignments

// Importing icons from Material-UI for UI elements
import CloudDownloadIcon from "@mui/icons-material/CloudDownload"; // Icon for download functionality
import CloudUploadIcon from "@mui/icons-material/CloudUpload"; // Icon for upload functionality
import SaveAsIcon from "@mui/icons-material/SaveAs";
import SearchIcon from "@mui/icons-material/Search"; // Icon for search functionality
import VisibilityIcon from "@mui/icons-material/Visibility";
import LinearProgress from "@mui/material/LinearProgress";
import { Button as PrimeReactButton } from "primereact/button"; // Button component from PrimeReact, renamed to PrimeReactButton
import { Modal as AntdModal } from "antd";
import {
  delay,
  deriveInitials,
  emailPerformerForNextActivities,
  fetchCurrentUser,
  handleDownloadFileClick,
  saveUnsavedTransaction,
  sendEmailNotificationsToReviewJob,
} from "./JobHelper"; // Function to derive initials from a name
// Importing Material-UI components for building the user interface
import {
  Avatar,
  Backdrop,
  Badge, // Component for displaying notifications
  Box, // A wrapper component that provides spacing
  Button, // Group of buttons
  Chip,
  CircularProgress, // Component for displaying small blocks of information
  IconButton, // Button with an icon
  InputAdornment, // Component for adding adornments to input fields
  Modal, // Component for modal dialogs
  Paper, // Material design paper component
  Table, // Table component for displaying data in tabular form
  TableBody, // Body section of the table
  TableCell, // Individual cell in a table
  TableContainer, // Container for the table
  TableHead, // Head section of the table
  TableRow, // Row in the table
  TextField, // Input field component
  Tooltip, // Component for displaying tooltips
  Typography,
  useMediaQuery, // Component for text styling
  useTheme,
} from "@mui/material"; // Importing Material-UI components
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { formatDatetime } from "../JobAssign/helper"; // Helper function to format datetime

// Importing styled-components for custom styling
import { styled } from "@mui/material/styles"; // Function for creating styled components

// Importing PrimeReact styles for additional UI components
import "primereact/resources/primereact.css"; // CSS for PrimeReact components
import "primereact/resources/themes/lara-light-indigo/theme.css"; // Theme for PrimeReact components

// Importing hooks from React Router for navigation and location handling
import { useLocation, useNavigate } from "react-router-dom"; // Hooks for routing

// Importing API functions related to job and activity management
import { updateJobStatus } from "../ActivityReviewer/ActivityReviewerAPI"; // Function to update the status of a job
import {
  getAllActiveFormInfo,
  getAllCellInfoByFormNameAndVersion, getAllRequiredCellIds, // Function to retrieve all active form information
  getAllTransactions,
  getAttachmentsByTransactionId, // Function to retrieve all transactions
  getQueryResultForGlobalCellUpdate,
  SaveTransaction,
} from "../Logbook/LogbookApi"; // API for logbook-related functions
// Importing custom components and helper functions
// import CountDownTimer from "../components/CountdownTimer/CountDownTimer"; // Component for displaying a countdown timer
import ConfirmationDialog from "../components/shared/dialog/dialog.component"; // Component for rendering custom dialog modals

// Importing authentication helper functions
import { decryptTokenId } from "../helper/AuthService"; // Function to decrypt a token ID for authentication purposes

// Importing job-related helper functions
import { addLocalVariablesForJob } from "./JobHelper"; // Function to add job details to local storage for persistence

// Importing API functions related to job management
import { OverlayPanel } from "primereact/overlaypanel";
import SnackbarComponent from "../components/shared/snackbar/customSnackbar";
import ActivityFlowForUpcomingActivities from "./ActivityFlowForUpcomingActivities";
import DateSelection from "./DateSelection";
import {
  getJobDetailsBasedOnJobId, // Function to retrieve job details based on a specific job ID
  updateJobAndActivity,
  uploadFile,
} from "./JobPerformerAPI"; // API for job performer-related functions
import ErrorIcon from "@mui/icons-material/Error";
import { ProgressBar } from "primereact/progressbar";
import { deleteData, getData } from "../Logbook/OfflineLogbook/indexedDb";
import dayjs from "dayjs";
import { sendNotification } from "../pwa/pushNotification";
import { fetchJobDetails } from "../JobReviewer/JobReviewerAPI";

export default function ActivityDetailTable({
  activityDetails, //prop to hold activity details
  filter, //prop to filter activity details
  setFilter, //prop to change filter
  jobDetails, //prop to hold job details
  isDisabled, //prop to hold the row of disabled jobs
  setDisabled, //prop to change the row of disabled jobs
  uploadFileDisabled, //prop to hold the rows which has disabled upload file button
  setUploadFileDisabled, //prop to change the rows which has disabled upload file button
  renderTrigger, //prop to hold a property which will trigger re-render of useEffect
  setRenderTrigger, //prop to change render trigger
  allJobDetailsForTenant, //prop to Fetch all job details for tenanat,
  groupDetails,
  performer,
  selectedDate,
  tabValue,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  loader,
}) {
  const [fileContent, setFileContent] = useState(null); //State to store file content
  const [fileUrl, setFileUrl] = useState(null); //state to store file url
  const [openModal, setOpenModal] = useState(false); //state to open modal
  const location = useLocation(); //React hook to find current location
  // States to display confirmation dialog for stop button in groups
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false); //state to show confirmation dialog
  const [confirmationRow, setConfirmationRow] = useState(null); //state to hold confirmation row
  const [modalInfo, setModalInfo] = useState(null); //state to hold modal info
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackContent, setSnackContent] = useState(null);
  const [showUpcomingActivities, setshowUpcomingActivities] = useState(false);
  const [jobToShowUpcomingActivities, setJobToShowUpcomingActivities] =
    useState(null);
  const [currentSequence, setCurrentSequence] = useState(null);
  const [showLoadingBackdrop, setLoadingBackdrop] = useState(false);
  const currentuser = fetchCurrentUser();
  const op = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("md"));

  // const [expectedUpcomingActivities,setExpectedUpcomingActivities]=useState(null)
  const navigate = useNavigate(); //React hook to navigate to a page
  const filteredRows = activityDetails
    .filter(
      (row) =>
        row.jobname?.toLowerCase().includes(filter?.toLowerCase()) ||
        row.activityName?.toLowerCase().includes(filter?.toLowerCase()),
    )
    .filter((activity) => {
      const activityTime = new Date(activity.scheduledStartTime);

      const from = fromDate
        ? new Date(new Date(fromDate).setHours(0, 0, 0, 0))
        : null;
      const to = toDate
        ? new Date(new Date(toDate).setHours(23, 59, 59, 999))
        : null;
      return (!from || activityTime >= from) && (!to || activityTime <= to);
    })
    .sort(
      (row1, row2) =>
        row2.enableActivityPerformance - row1.enableActivityPerformance,
    );

  /**
   * Function to fetch tenant from session storage
   */
  const getTenantID = () => {
    const env_tenant = process.env.REACT_APP_TENANTID;
    const encryptedTenant = localStorage.getItem(env_tenant);
    const tenant = decryptTokenId(encryptedTenant);
    return tenant;
  };
  async function fetchFormIDAndVersion(formname) {
    const activeForms = await getAllActiveFormInfo(); //Fetches all active forms
    let version = 0;
    let formId = null;
    activeForms?.map((obj) => {
      if (obj.formName.trim().toLowerCase() === formname)
        version = obj.versionNumber;
      formId = obj.formID;
    }); //Find the version of the logbook associated with the current activity
    return { version, formId };
  }
  //Function called when a started activity is clicked
  async function handleLinkClick(row) {
    setLoadingBackdrop(true);

    const lv_info = await fetch_lv_info(row);
    // console.log("Lv info:",lv_info)
    selectedDate?.length > 0 &&
      sessionStorage.setItem(
        [process.env.REACT_APP_SELECTEDDATEINPERFORMER],
        selectedDate,
      );
    tabValue > 0 &&
      sessionStorage.setItem([process.env.REACT_APP_TABVALUE], tabValue);
    setLoadingBackdrop(false);
    navigate("/workflow/LogbookForm", { state: lv_info }); //navigate to the logbook page
  }
  const fetch_lv_info = async (job) => {
    const tenantId = getTenantID();
    // console.log("Job:", job);
    const jobdetails = await getJobDetailsBasedOnJobId(job.jobid, tenantId); //Function to fetch  job details based on job id
    const formDetails = await fetchFormIDAndVersion(
      job.logbook.trim().toLowerCase(),
    );
    const formId = formDetails.formId;
    const version = formDetails.version;

    let lvInfo = await addLocalVariablesForJob(
      jobdetails,
      job,
      version,
      currentuser,
      location.pathname,
      selectedDate,
    ); //Function to add all neccessary details into the local storage

    lvInfo = {
      ...lvInfo,

      groupType: job.performerType,
      approver: job.approver,
      formId: formId,
    };
    return lvInfo;
  };
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  }; //Function to update the filter

  /**
   * Function called when a file is uploaded for an activity1
   */
  const handleFileUpload = async (event, rowData) => {
    try {
      const file = event.target.files?.[event.target.files.length - 1];
      if (!file) return;

      // disable upload button for this row (avoid duplicates)
      setUploadFileDisabled((prev) => [
        ...prev,
        { jobid: rowData.jobid, activityId: rowData.activityId },
      ]);
      const response = await uploadFile(
        file,
        rowData.jobid,
        rowData.activityId,
      );
      console.log("Upload file");
      if (response?.status === 200) {
        setOpenSnackbar(true);
        setSnackContent({
          dialog: "File Upload Successful",
          severity: "success",
        });
      } else {
        setOpenSnackbar(true);
        setSnackContent({ dialog: "Error", severity: "error" });
      }

      setRenderTrigger(renderTrigger + 1);
    } catch (err) {
      console.error("File upload failed", err);
      setOpenSnackbar(true);
      setSnackContent({ dialog: "Error", severity: "error" });
    } 
  };

  //function called when start/stop button is clicked
  const handleStartButtonClick = async (data) => {
    if (
      !(
        data.activityStatus === "Not Started" ||
        data.activityStatus === "Rejected"
      )
    ) {
      const savedTransaction = await saveUnsavedTransaction(
        data,
        setOpenSnackbar,
        setSnackContent,
      );
      if (savedTransaction === false) return;
    }
    setDisabled([...isDisabled, data]);
    let startTime =
      data.activityActualstart !== "-" && data.activityActualstart !== null
        ? data.activityActualstart
        : null; //parse the activity start time
    let stopTime =
      data.activityActualend !== "-" && data.activityActualend !== null
        ? data.activityActualend
        : null; //parse the activity stop time

    //if(startedActivity.some((activity)=>(compareObjects(data,activity)))){
    if (data.activityStatus === "Started") stopTime = new Date();
    //Update starttime or stop time based on activity status
    else startTime = new Date();
    let foundJob = null;
    jobDetails.forEach((job) => {
      if (job.jobID === data.jobid) {
        // Filter the activity list to keep only the activity with the matching ID
        const matchingActivity = job.task.activityList
          .map((activity) => {
            if (activity.activityId === data.activityId) {
              return {
                ...activity,
                actualActivityStartTime: startTime,
                actualActivityEndTime: stopTime,
                actvityStatus:
                  data.activityStatus === "Not Started" ||
                  data.activityStatus === "Rejected"
                    ? "Started"
                    : data.performer.toLowerCase().trim() ===
                        data.approver.toLowerCase().trim()
                      ? "Completed"
                      : "Sent For Approval",
                startedBy:
                  activity.groupOrDept &&
                  (data.activityStatus === "Not Started" ||
                    data.activityStatus === "Rejected")
                    ? performer
                    : activity.groupOrDept && data.activityStatus === "Started"
                      ? activity.startedBy
                      : "",
                stoppedBy:
                  activity.groupOrDept && data.activityStatus === "Started"
                    ? performer
                    : "",
                activityFileData:
                  fileContent != null
                    ? Array.from(fileContent)
                    : activity.activityFileData,
              };
            } else return null;
          })
          .filter((activity) => activity !== null);
        // If a matching activity is found, update the job object with the filtered activity list
        if (matchingActivity.length > 0) {
          //Checks whether the job consists the activity to update,if yes then store  the job in foundJob

          job.task.activityList = matchingActivity; //add the activity found in the job
          job.actualJobStartTime =
            job.jobStatus === "Not Started"
              ? new Date()
              : job.actualJobStartTime; //update the actual job start time based on job status
          job.jobStatus =
            job.jobStatus === "Not Started" ? "Started" : job.jobStatus; //update the job status based on the actual job status
          foundJob = job;
          console.log("Found job", job);
        }
      }
    });
    /*
     * Block to check whether required is present or not, and to execute the save query on stop button click
     */
    if (
      (foundJob?.task?.activityList[0]?.actvityStatus === "Completed" ||
        foundJob?.task?.activityList[0]?.actvityStatus ===
          "Sent For Approval") &&
      data?.logbook?.trim().length > 0
    ) {
      const activeForms = await getAllActiveFormInfo(); //Fetches all active forms
      let version = 0;
      let currentLogbookDetails = null;
      activeForms.map((obj) => {
        if (
          obj.formName.trim().toLowerCase() ===
          data.logbook.trim().toLowerCase()
        ) {
          version = obj.versionNumber;
          currentLogbookDetails = obj;
          // console.log("Current logbook:", currentLogbookDetails);
        }
      });
      const requiredCells = await getAllRequiredCellIds(
        data.logbook,
        version,
      );
      console.log("Data logbook",data.logbook,version)
      console.log("required cells:",requiredCells)
      const logbooktransaction = await getAllTransactions(
        data.jobid,
        data.activityId,
        data.logbook,
        version,
      );

      //checks whether the logbook contains required fields
      const requiredUnfilled =
        requiredCells?.length>0 &&
        //if the logbook contains required field then it checks whether the required fields are filled or not
        // and whether the value is not Blob_File
        (logbooktransaction[0]?.logbookData === undefined ||
          logbooktransaction[0]?.logbookData === null ||
          Object.values(logbooktransaction[0]?.logbookData)?.some((obj) => {
            const isEmpty =
              obj?.value === null ||
              obj?.value === undefined ||
              obj?.value?.length === 0;

            return obj?.requiredfield === true && isEmpty;
          }));

      if (requiredUnfilled) {
        setOpenSnackbar(true);
        setSnackContent({
          dialog: "Fill the required fields",
          severity: "error",
        });
        setDisabled([]);
        return;
      }
      //Call function to execute save query
      //Call function to execute save query
      const saveResponse = await executeSaveQuery(
        currentLogbookDetails,
        logbooktransaction,
        data,
      );
      if (saveResponse === null) {
        setOpenSnackbar(true);
        setSnackContent({
          dialog: "Error in Save Sql",
          severity: "error",
        });
        // await delay(4000);
        setDisabled([]);
        return;
      }
    }

    setFileContent(null); //reset the filecontent

    const response = await updateJobAndActivity(foundJob); //function to update job and activity  details in database
    await updateJobStatus(foundJob.jobID); //function to update job status
    //Next block of code to mail activity reviewer
    if (
      foundJob &&
      foundJob.task.activityList[0].actvityStatus.toLowerCase() ===
        "Sent For Approval".toLowerCase()
    ) {
      //check whether the activity is sent for approval
      const approver = foundJob.task.activityList[0].approver; //add the approver
      const emailSuccess = await sendEmailNotificationsToReviewActivities(
        [foundJob],
        [approver],
      );
      // Example button click
    }
    await emailPerformerForNextActivities(foundJob);
    if (response?.status === 200) {
      setOpenSnackbar(true);
      setSnackContent({ dialog: "Update Successful", severity: "success" });
    } else {
      setOpenSnackbar(true);
      setSnackContent({ dialog: "Error", severity: "error" });
    }

    console.log("Prior to sending mail to reviewer");
    foundJob.task.activityList[0].actvityStatus.toLowerCase() ===
      "Completed".toLowerCase() && (await updateJobStatus(foundJob.jobID)); //call the function which updates the job status when all activities are approved

    const jobToMailReviewer = await fetchJobDetails(foundJob.jobID); //Function call to fetch all jobs
    
    const approver = jobToMailReviewer.approver;
    if (jobToMailReviewer.jobStatus === "Sent For Approval") {
      await sendEmailNotificationsToReviewJob([jobToMailReviewer], [approver]); //function called to send mail to reviewer
    }
    console.log("Completed");
    setRenderTrigger((renderTrigger) => renderTrigger + 1);
    // setDisabled((prev) => prev.filter((item) => item !== data));
  };

  const handleShowUpcomingActivitiesDialog = (jobid, sequence) => {
    const job = allJobDetailsForTenant?.find((job) => job.jobID === jobid);
    // console.log("Job sent for activity flow:",job)
    setJobToShowUpcomingActivities(job);
    setCurrentSequence(sequence);
    setshowUpcomingActivities(true);
  };
  const executeSaveQuery = async (
    currentLogbookDetails,
    logbooktransaction,
    job,
  ) => {
    /**
     * Block to execute the save query
     */
    console.log("Inside save sql");

    const saveSql = currentLogbookDetails?.saveSQL;
    const transactionData = logbooktransaction[0]?.logbookData;
    console.log("save sql ", saveSql);
    if (!saveSql || saveSql.length === 0) {
      return;
    }
    console.log("Save sql:", saveSql);
    const lvDetails = await fetch_lv_info(job);
    console.log("Before replace");
    const generatedQuery = saveSql.replace(
      /\{\s*\{\s*([^}]+?)\s*\}\s*\}/g,
      /** matches plaeholders like {{key}} and key could be any value except }]+
       *
       * /g signifies all possible {{key}} in the string
       * and not just the first one should be replaced */
      (match, rawKey) => {
        console.log("Inside replace");
        console.log("match:", match);
        console.log("rawkey:", rawKey);
        const key = rawKey?.trim();
        const isTransactionKey = /^_(\d+)_(\d+)$/.test(key);
        /**
        The Regex Pattern: /^_(\d+)_(\d+)$/^ and $: 
        These are anchors. ^ marks the start of the string and $ marks the end. 
        This ensures the entire string must match the pattern with no extra characters 
        before or after. \d marks digits from 0-9.
        .test() matches whether the key matches with the pattern.

        Checks whether the key is in _1_2 kind of format
        */
        // 1. If transactionData is missing or key does not exist → keep original
        if (
          !key.startsWith("lv_") &&
          (!transactionData ||
            !Object.prototype.hasOwnProperty.call(transactionData, key))
        ) {
          console.log("Inside first check");
          return match;
        }

        const value = transactionData?.[key]?.value;

        // 2. If value is null / undefined / empty → return SQL null
        if (
          !key.startsWith("lv_") &&
          (value === null || value === undefined || value === "")
        ) {
          console.log("Inside second check");
          return null;
        }
        /**
         * wraps the string with quotes, and replaces all single quotes with double quotes ''
         * O'Brien → 'O''Brien'
         */
        // 3. If key is in {{_1_2}} format (transaction key)
        if (isTransactionKey) {
          console.log("Inside third check");
          if (typeof value === "string") {
            return `'${value.replace(/'/g, "''")}'`; // escape single quotes
          }
          return value;
        }

        // 4. If key starts with "lv_" → use lvDetails
        console.log("Prior to keys starting with lv");
        if (key.startsWith("lv_")) {
          const lvValue = lvDetails[key];
          console.log("Lv_Value:", lvValue);
          if (typeof lvValue === "string") {
            /**
             * wraps the string with quotes, and replaces all single quotes with double quotes ''
             * O'Brien → 'O''Brien'
             */
            return `'${lvValue.replace(/'/g, "''")}'`;
          }
          return lvValue;
        }

        // 5. Fallback → keep original placeholder
        return match;
      },
    );
    console.log("Prior to sql response");
    const sqlResult = await getQueryResultForGlobalCellUpdate(generatedQuery);

    return sqlResult;
  };

  /**
   * Function to send email notifications to activity reviewers
   * @param {array} jobsToMail - Array of objects containing job details
   * @param {array} toMailList - Array of email addresses to send the notifications to
   * @returns {boolean} - True if all emails were sent successfully, false otherwise
   */
  const sendEmailNotificationsToReviewActivities = async (
    jobsToMail,
    toMailList,
  ) => {
    try {
      const homePage = process.env.REACT_APP_HOME;

      const emailNotifications = await Promise.all(
        jobsToMail.map(async (data) => {
          try {
            let finalMailHtml = createHtmlString(data, homePage);
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
            // Call the sendEmail function to send the mail
            let success, notificationsuccess;
            try {
              success = await sendEmail(mailObject);
            } catch (e) {
              console.error("Error in mail");
            }
            const tenant = getTenantID();
            const notificationBody = {
              title: "Activity Review Pending",

              body: `You have an activity ${data.task.activityList[0].activityName} pending for review`,

              url: "/workflow/activityReviewer",
            };
            console.log("notificationBody ::: ", notificationBody);
            console.log("To Mail ids:::", toMailList[0]);
            try {
              notificationsuccess = await sendNotification(
                tenant,
                toMailList[0],
                notificationBody,
              );
            } catch (e) {
              console.error("Error in send notification:", notificationsuccess);
            }
            if (success?.status === 200) {
              return data;
            } else {
              console.error("Email object", mailObject);
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
  };
  /**
   * Function to create the HTML string for the email notifications
   * @param {object} data - Job data
   * @param {string} forwardLink - The link to be forwarded to the reviewer
   * @returns {string} - The HTML string for the email notification
   */
  const createHtmlString = (data, forwardLink) => {
    // Create a copy of the job data and add the forward link to it
    const updatedData = { ...data, forwardLink: forwardLink };
    // Render the EmailActivityReview component to a string using ReactDomServer
    const htmlData = ReactDOMServer.renderToString(
      <EmailActivityReview data={updatedData} />,
    );

    // Return the rendered HTML string
    return htmlData;
  };

  // Define a styled component for a bold table cell
  const BoldTableCell = styled(TableCell)(({ theme }) => ({
    // Set the background color to black
    backgroundColor: "black",
    // Set the text color to white
    color: "white",
  }));

  /**
   * Function called when modal is closed
   */
  const handleCloseModal = () => {
    setOpenModal(false);
    setFileUrl(null);
  };
  //React hook rendered on change of activityDetails array

  // Function to display confirmation dialog for stop button in groups
  const handleProceed = () => {
    handleStartButtonClick(confirmationRow); //Function called to start or stop the activity
    setOpenConfirmPopup(false); //close the confirmation popup
    setConfirmationRow(null); //set the confirmation row to null,
  };

  return (
    <Box sx={{ padding: "0rem" }}>
      {/*This Box component is used to display the activity details table. It doesn't have any padding.*/}
      <Box
        sx={{
          display: "flex", //flexbox layout
          flexDirection: isMobile || isTab ? "column" : "row",
          justifyContent: "space-between", //the items are positioned evenly
          paddingBottom: "0.7rem",
          paddingTop: "2rem",
        }}
      >
        {!selectedDate && (
          <DateSelection
            isMob={isMobile}
            isTab={isTab}
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
          />
        )}
        <TextField
          id="search1"
          size="small"
          label="Search"
          placeholder="Search"
          value={filter}
          onChange={handleFilterChange}
          //Function called when filter is changed
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {/** */}
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }} //Textfield to filter the activities
        />
      </Box>

      {/*         
         Box rendered when neither individual nor groups are selected
         this table contains the columns as below
         - job name
         - activity name
         - scheduled start vs stop time
         - activity status
         - actual start vs stop time
         - attachment
         - remarks
         - action button
         the table is filtered based on the input value provided in the search bar
         */}
      <Box>
        <TableContainer
          className="dataTableStyle"
          sx={{ maxHeight: 600, scrollbarWidth: "none" }}
          component={Paper}
        >
          <Table stickyHeader>
            {!(filteredRows?.length > 0) && !loader && (
              <caption>No data available</caption>
            )}
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  className="MuiDatatableTableHeader"
                ></TableCell>
                <BoldTableCell
                  sx={{ padding: 1 }}
                  align="center"
                  className="MuiDatatableTableHeader"
                >
                  <Typography
                    className={
                      isMobile || isTab
                        ? "MuiDatatableTableHeader-Font ellipsisText"
                        : "MuiDatatableTableHeader-Font"
                    }
                  >
                    Job Name
                  </Typography>
                </BoldTableCell>
                {/* Custom component to display table header in bold */}
                <BoldTableCell
                  sx={{ padding: 1 }}
                  align="center"
                  className="MuiDatatableTableHeader"
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
                </BoldTableCell>{" "}
                <BoldTableCell
                  sx={{ padding: 1 }}
                  align="center"
                  className="MuiDatatableTableHeader"
                >
                  <Typography
                    className={
                      isMobile || isTab
                        ? "MuiDatatableTableHeader-Font ellipsisText"
                        : "MuiDatatableTableHeader-Font"
                    }
                  >
                    Approver
                  </Typography>
                </BoldTableCell>{" "}
                <BoldTableCell
                  sx={{ padding: 1 }}
                  align="center"
                  className="MuiDatatableTableHeader"
                >
                  <Typography
                    className={
                      isMobile || isTab
                        ? "MuiDatatableTableHeader-Font ellipsisText"
                        : "MuiDatatableTableHeader-Font"
                    }
                  >
                    Assigner
                  </Typography>
                </BoldTableCell>{" "}
                {/* Custom component to display table header in bold */}
                <BoldTableCell
                  sx={{ padding: 1, maxWidth: "250px" }}
                  align="center"
                  className="MuiDatatableTableHeader"
                >
                  <Tooltip
                    title={isMobile || isTab ? "Schedule Start vs Stop" : ""}
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
                      {/* Custom component to display table header in bold */}
                      Scheduled Start vs Stop
                    </Typography>
                  </Tooltip>
                </BoldTableCell>
                {/* <BoldTableCell align="center" >
                    Scheduled End Time
                  </BoldTableCell> */}
                <BoldTableCell
                  sx={{ padding: 1 }}
                  align="center"
                  className="MuiDatatableTableHeader"
                >
                  <Typography
                    className={
                      isMobile || isTab
                        ? "MuiDatatableTableHeader-Font ellipsisText"
                        : "MuiDatatableTableHeader-Font"
                    }
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    Activity Status
                  </Typography>
                </BoldTableCell>{" "}
                {/* Custom component to display table header in bold */}
                <BoldTableCell
                  sx={{ padding: 1, maxWidth: "250px" }}
                  align="center"
                  className="MuiDatatableTableHeader"
                >
                  <Tooltip
                    title={isMobile || isTab ? " Actual Start vs Stop" : ""}
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
                </BoldTableCell>{" "}
                {/* Custom component to display table header in bold */}
                {/* <BoldTableCell align="center" className="MuiDatatableTableHeader">Actual End</BoldTableCell> */}
                <BoldTableCell
                  sx={{ padding: 1 }}
                  align="center"
                  className="MuiDatatableTableHeader"
                >
                  <Typography className="MuiDatatableTableHeader-Font">
                    Attachment
                  </Typography>
                </BoldTableCell>{" "}
                {/* Custom component to display table header in bold */}
                <BoldTableCell
                  sx={{ padding: 1 }}
                  align="center"
                  className="MuiDatatableTableHeader"
                >
                  <Typography className="MuiDatatableTableHeader-Font">
                    Remarks
                  </Typography>
                </BoldTableCell>{" "}
                {/* Custom component to display table header in bold */}
                <BoldTableCell
                  sx={{ padding: 1 }}
                  align="center"
                  className="MuiDatatableTableHeader"
                >
                  <Typography className="MuiDatatableTableHeader-Font">
                    Action
                  </Typography>
                </BoldTableCell>{" "}
                {/* Custom component to display table header in bold */}
              </TableRow>
            </TableHead>
            <TableBody>
              {loader === 1 && (
                <TableCell colSpan={11}>
                  <ProgressBar
                    mode="indeterminate" // Indeterminate loading mode
                    style={{ height: "6px" }} // Set height of the progress bar
                  />
                </TableCell>
              )}
              {!loader &&
                filteredRows.map(
                  (
                    row,
                    index, //iterate through the filtered rows to display the table rows
                  ) => (
                    <TableRow key={index}>
                      <TableCell
                        align="center"
                        className="MuiDatatableBodyPadding"
                        width="10px"
                      >
                        <Tooltip title="View activity flow for this particular job">
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() =>
                              handleShowUpcomingActivitiesDialog(
                                row.jobid,
                                row.sequence,
                              )
                            } //Function called to expand the row
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
                        </Tooltip>
                      </TableCell>
                      <TableCell
                        align="center"
                        className="MuiDatatableBodyPadding"
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                          }}
                        >
                          <Tooltip
                            title={
                              <>
                                Job Name: {row.jobname} <br />
                                Job ID: {row.jobid}
                              </>
                            }
                            placement="right"
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
                              {row.jobname}
                            </Typography>
                          </Tooltip>
                        </div>
                      </TableCell>

                      <TableCell
                        align="center"
                        className="MuiDatatableBodyPadding"
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignContent: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Tooltip title={row.logbook} placement="right">
                            {row.activityStatus === "Started" &&
                            row.logbook !== undefined &&
                            row.logbook !== null &&
                            row.logbook !== "" ? ( //activate logbook only when activity is started and logbook is not empty
                              <Chip
                                size="small"
                                color="info"
                                label={
                                  <span className="chip-multiline">
                                    {row.activityName}
                                    {row.logbookTransactionErrorMsg?.length >
                                      0 && (
                                      <Tooltip
                                        title={
                                          <>
                                            Error Message:
                                            {row.logbookTransactionErrorMsg}
                                            <br />
                                            Error By:
                                            {row.logbookTransactionErrorBy}
                                          </>
                                        }
                                      >
                                        <ErrorIcon />
                                      </Tooltip>
                                    )}
                                    {row[process.env.REACT_APP_ERRORMSG]
                                      ?.length > 0 && (
                                      <Tooltip
                                        title={
                                          <>
                                            Unsaved transaction by{" "}
                                            {row[process.env.REACT_APP_ERRORBY]}{" "}
                                            due to{" "}
                                            {
                                              row[
                                                process.env.REACT_APP_ERRORMSG
                                              ]
                                            }
                                          </>
                                        }
                                      >
                                        <ReportProblemIcon color="error" />
                                      </Tooltip>
                                    )}
                                  </span>
                                }
                                className="chip-wrapper"
                                onClick={() => {
                                  handleLinkClick(row); //function to show logbook
                                }}
                              ></Chip>
                            ) : (
                              <Chip
                                size="small"
                                label={
                                  <span className="chip-multiline">
                                    {row.activityName}
                                  </span>
                                }
                                className="chip-wrapper"
                              />
                            )}
                          </Tooltip>
                          {row.enforce === true && (
                            <Tooltip title="Enforced" placement="right">
                              <Badge variant="dot" color="warning"></Badge>
                            </Tooltip>
                          )}
                          {/**Badge to show if activity is enforced */}
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip placement="top" title={row.approver}>
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
                                deriveInitials(row.approver) //function to derive initials of the approver
                              }
                            </Avatar>
                          </Badge>
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
                        align="center"
                        className="MuiDatatableBodyPadding"
                      >
                        {/** show scheduled start and end time */}
                        {
                          <>
                            <p style={{ margin: "0 0 4px 0", padding: 0 }}>
                              {formatDatetime(row.scheduledStartTime)}
                            </p>
                            <p style={{ margin: 0, padding: 0 }}>
                              {formatDatetime(row.scheduledEndTime)}
                            </p>
                          </>
                        }
                      </TableCell>
                      {/**table cell to show activity status, the color of the chip is changed based on status */}
                      <TableCell
                        align="center"
                        className="MuiDatatableBodyPadding"
                      >
                        {
                          // table cell to display activity status
                          <Chip
                            label={row.activityStatus}
                            size="small"
                            // change color based on activity status
                            color={
                              row.activityStatus.toLowerCase() === "started"
                                ? "success"
                                : row.activityStatus.toLowerCase() ===
                                    "review start"
                                  ? "primary"
                                  : row.activityStatus.toLowerCase() ===
                                      "sent for approval"
                                    ? "success"
                                    : row.activityStatus.toLowerCase() ===
                                        "rejected"
                                      ? "error"
                                      : "default"
                            }
                          ></Chip>
                        }
                      </TableCell>

                      {/* table cell to show actual start and end time */}
                      <TableCell
                        align="center"
                        className="MuiDatatableBodyPadding"
                      >
                        {
                          <>
                            <p style={{ margin: "0 0 4px 0", padding: 0 }}>
                              {row.activityActualstart === null ||
                              row.activityActualstart === undefined
                                ? "-"
                                : formatDatetime(row.activityActualstart)}
                            </p>
                            <p style={{ margin: 0, padding: 0 }}>
                              {row.activityActualend === null ||
                              row.activityActualend === undefined
                                ? "-"
                                : formatDatetime(row.activityActualend)}
                            </p>
                          </>
                        }
                      </TableCell>
                      {/* Table cell to upload and down a file */}
                      <TableCell
                        align="center"
                        className="MuiDatatableBodyPadding"
                      >
                        {row.activityStatus === "Started" && (
                          <div>
                            {uploadFileDisabled?.some(
                              (obj) =>
                                obj.jobid === row.jobid &&
                                obj.activityId === row.activityId,
                            ) ? (
                              <div>
                                <LinearProgress />
                              </div>
                            ) : (
                              <div>
                                <Tooltip
                                  title={
                                    row.actFile ? "Change File" : "Upload File"
                                  }
                                  placement="top"
                                >
                                  {/*Change button label based on file existence*/}

                                  <IconButton
                                    component="label"
                                    variant="contained"
                                    color="info"
                                  >
                                    {/* change the upload icons based on what is uploaded */}
                                    {row.actFile ? (
                                      <SaveAsIcon color="success" />
                                    ) : (
                                      <CloudUploadIcon color="primary" />
                                    )}
                                    <input
                                      type="file"
                                      style={{ display: "none" }}
                                      onChange={(e) => {
                                        handleFileUpload(e, row); //Function called to upload the file
                                      }}
                                    />
                                  </IconButton>
                                </Tooltip>

                                {row.actFile &&
                                  row.activityStatus === "Started" && (
                                    <Tooltip
                                      title="Download File"
                                      placement="top"
                                    >
                                      <IconButton
                                        component="label"
                                        variant="contained"
                                        color="primary"
                                        onClick={() =>
                                          handleDownloadFileClick(row.actFile)
                                        }
                                      >
                                        <CloudDownloadIcon color="primary" />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                              </div>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell
                        align="center"
                        className="MuiDatatableBodyPadding"
                      >
                        {row?.remarks?.length > 0 && (
                          <IconButton
                            onClick={(e) => {
                              setModalInfo({
                                header: "Reviewer Remarks",
                                content: row.remarks,
                              }); //set the modal info with the current remarks
                              op.current.toggle(e); //toggle the useRef variable to display the overlay panel
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        )}
                      </TableCell>
                      {/* Table cell to show buttons to start or stop the activity */}
                      <TableCell
                        align="center"
                        className="MuiDatatableBodyPadding"
                      >
                        <div>
                          <Button
                            variant="contained"
                            size="small"
                            color={
                              row.activityStatus === "Started"
                                ? "error"
                                : "success"
                            }
                            onClick={() => {
                              //function to show popup if an activity of a group is started
                              if (
                                row.activityStatus === "Started" &&
                                row.performerType === "Group"
                              ) {
                                setOpenConfirmPopup(true); //display confirm popup for activities performed by group
                                setConfirmationRow(row); //update the state which holds the row data
                              } else handleStartButtonClick(row); //directly call the function to start/stop the activity
                            }}
                            disabled={
                              //disable those rows whose activities are already submitted to the reviewer
                              isDisabled.some(
                                (isDisabledRow) =>
                                  row.activityId === isDisabledRow.activityId &&
                                  row.jobid === isDisabledRow.jobid,
                              ) ||
                              row.enableActivityPerformance === false ||
                              row.activityStatus === "Sent For Approval" || //disable button if activity is sent for approval
                              row.activityStatus === "Review Started" || //disable button if activity is getting reviewed
                              row.activityStatus === "Completed" || //disable button if activity is approved
                              (!row.enforceStart &&
                                row.expectedStartTimeForBuffer &&
                                row.expectedStartTimeForBuffer?.getTime() >
                                  new Date().getTime()) || //disable button during buffer time
                              (row.enforceStart &&
                                new Date(row.scheduledStartTime).getTime() >
                                  new Date().getTime())
                            }
                          >
                            <>
                              {row.activityStatus === "Started" ? (
                                <Typography sx={{ fontSize: "0.85rem" }}>
                                  Stop
                                </Typography>
                              ) : (
                                <Typography sx={{ fontSize: "0.85rem" }}>
                                  Start
                                </Typography>
                              )}
                            </>
                          </Button>
                          {/* <CountDownTimer duration={row.durationToStart} /> */}
                          {/**timer for buffered activities*/}
                        </div>
                      </TableCell>
                    </TableRow>
                  ),
                )}
            </TableBody>
          </Table>
        </TableContainer>
        {showLoadingBackdrop && (
          <Backdrop
            sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
            open={showLoadingBackdrop}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
      </Box>

      {/*
      Modal to display file preview
      - open: boolean to indicate if the modal is open or not
      - onClose: function to call when the modal is closed
      - aria-labelledby and aria-describedby: accessibility attributes
      - Box component with styles for the modal
      - If a fileUrl is provided, display it in an iframe for preview
      */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "50%",
            height: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          {fileUrl && (
            <iframe
              src={fileUrl}
              title="File Preview"
              width="100%"
              height="100%"
            />
          )}
        </Box>
      </Modal>
      {/* custom dialog to show confirmation popup */}
      <ConfirmationDialog
        open={openConfirmPopup}
        setOpen={setOpenConfirmPopup}
        proceedButtonText={"Proceed"}
        proceedButtonClick={handleProceed}
        cancelButtonText={"Cancel"}
        content={
          "This particular activity was started by someone in the group. Are you sure you wish to stop this activity?"
        }
      />
      {/* Overlay panel to show information to the user */}
      <OverlayPanel ref={op}>{modalInfo?.content}</OverlayPanel>
      <SnackbarComponent
        openPopup={openSnackbar}
        setOpenPopup={setOpenSnackbar}
        dialogMessage={snackContent?.dialog}
        snackbarSeverity={snackContent?.severity}
      />
      {showUpcomingActivities && (
        <ActivityFlowForUpcomingActivities
          job={jobToShowUpcomingActivities}
          setJob={setJobToShowUpcomingActivities}
          showDialog={showUpcomingActivities}
          setShowDialog={setshowUpcomingActivities}
          groupDetails={groupDetails}
          currentSequence={currentSequence}
          performer={performer}
        />
      )}
    </Box>
  );
}
