import CloseIcon from "@mui/icons-material/Close"; // Importing CloseIcon for closing actions in dialogs or modals
import PlayArrowIcon from "@mui/icons-material/PlayArrow"; // Importing PlayArrowIcon for play-related actions or buttons
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite"; // Importing PlayCircleFilledWhiteIcon for an alternate play button style
import StopCircleIcon from "@mui/icons-material/StopCircle"; // Importing StopCircleIcon for stop-related actions or buttons

import {
  Box, // Importing Box for flexible layout and spacing
  Chip, // Importing Chip to display small elements, such as labels or tags
  DialogContent, // Importing DialogContent to structure the content of dialog components
  DialogTitle, // Importing DialogTitle to provide a title in dialog components
  Divider, // Importing Divider for creating horizontal or vertical lines/separators
  IconButton, // Importing IconButton to create clickable icons
  Modal, // Importing Modal to create an overlay for dialog/modal content
} from "@mui/material"; // Importing from Material UI for UI components

import Button from "@mui/material/Button"; // Importing Button to create buttons for user interaction
import Paper from "@mui/material/Paper"; // Importing Paper to create containers with elevation (shadow effect)
import Stack from "@mui/material/Stack"; // Importing Stack for vertical or horizontal stacking of components
import { styled } from "@mui/material/styles"; // Importing styled for custom styling of components using Material UI's theme

import dayjs from "dayjs"; // Importing dayjs for date manipulation and formatting

import { Fragment, useEffect, useState } from "react"; // Importing Fragment for grouping JSX elements without adding extra nodes, and useEffect/useState hooks for component lifecycle and state management
import { Watch } from "react-loader-spinner"; // Importing Watch from react-loader-spinner to display a loading spinner

import { useLocation, useNavigate } from "react-router-dom"; // Importing useNavigate for programmatic navigation between routes

import { formatDatetime } from "../JobAssign/helper"; // Importing formatDatetime function from JobAssign helper to format date and time

import { formatDatetime as dateFormatForSelfJob } from "../JobPerformer/JobHelper"; // Importing formatDatetime function from JobAssign helper to format date and time

import {
  getAllCellInfoByFormNameAndVersion,
  getAllTransactions,
} from "../Logbook/LogbookApi"; // Importing API functions to get cell info and transactions from the Logbook API

import { createNewAutoJob, updateJobTime } from "./SelfJobCreationAPI"; // Importing API functions to create a new auto job and update job time from the SelfJobCreationAPI

import { createAutoJob, getLocalVariablesForSelfJob, GUEST_LOGBOOK_URL, LOGBOOK_URL, reviewerStatus, updateJobsTable } from "./SelfJobHelper"; // Importing a helper function to set local variables for the self-job creation process
import { getTenantID } from "../UserModuleUpdated/UsermoduleApi";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  // p: 4,
  borderRadius: "10px",
  maxWidth: 600,
  maxHeight: 900,
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

/**
 * PendingJobsModal is a React component that displays a modal when a job is currently
 * in progress and the user tries to start a new job. The modal displays the details of
 * the job that is currently in progress, including the job id, asset id, asset name,
 * logbook, performer, reviewer, status, start time, and end time. The modal also
 * provides options to finish the last job, continue the previous logbook, or start a
 * new job. The component is passed the following props: openPendingJobDlg, a boolean
 * indicating whether the modal should be open or closed; setOpenPendingJobDlg, a
 * function to call when the modal should be closed; pendingJobDetailsForSelectedAsset,
 * an object containing the details of the job that is currently in progress;
 * setSnackbarMessage, setSnackbarOpen, setSnackbarSeverity, currentLogbookApprover,
 * currentAutoJobName, and setMainLogbookSelection.
 * @param {object} props An object containing the props to be passed to the
 * PendingJobsModal component.
 * @returns {ReactElement} A React element representing the PendingJobsModal component.
 */
export default function PendingJobsModal({
  openPendingJobDlg,
  setOpenPendingJobDlg,
  pendingJobDetailsForSelectedAsset,
  setSnackbarMessage,
  snackbarMessage,
  setSnackbarOpen,
  snackbarOpen,
  setSnackbarSeverity,
  snackbarSeverity,
  currentLogbookApprover,
  currentAutoJobName,
  setMainLogbookSelection,
  setCurrentAssetInfo,
      setCurrentLogbookInfo,
      setCurrentAutoJobName,
      currentUser,
      allSelfJobs:pendingSelfJobs,
      setAllSelfJobs
}) {

  
  const navigate = useNavigate();
  const location = useLocation();
  const [transactionData, setTransactionData] = useState({}); //Initially a blank object , for storing the transactions of a logbook

   const iSGuestUser=location.pathname.toLowerCase().includes('guest') 

  /**
   * Fetches all transaction data for the currently selected pending job details.
   * It uses the job ID, activity ID, form name, and logbook version from the
   * pending job details to retrieve the transaction data. If the data is
   * successfully fetched, it is stored in the state.
   *
   * @returns {Promise<void>} A promise that resolves when the transaction data
   * is fetched and stored in the state.
   */
  const fetchAllTransactionsData = async () => {
    // console.log('fetchAllTransactionsData() called')
    // console.log('Current Parameters to fetch Logbook :  ',  pendingJobDetailsForSelectedAsset.jobid,
    //   pendingJobDetailsForSelectedAsset.activityid,
    //   pendingJobDetailsForSelectedAsset.formname,
    //   pendingJobDetailsForSelectedAsset.logbookversion)

    let data = await getAllTransactions(
      pendingJobDetailsForSelectedAsset.jobid,
      pendingJobDetailsForSelectedAsset.activityid,
      pendingJobDetailsForSelectedAsset.formname,
      pendingJobDetailsForSelectedAsset.logbookversion
    );
    // console.log("Current Response : ", data);
    if (data) {
      // console.log("data", data);
      setTransactionData(data);
    }
  };
  useEffect(() => {
    // console.log('useEffect() for PendingJobsModal')
    fetchAllTransactionsData();
  }, []);

  /**
   * Handles the closing of the pending job dialog.
   * If the closing is due to user interaction and not just a backdrop click,
   * it sets the modal open state to false.
   *
   * @param {Object} event - The event object
   * @param {String} reason - The reason why the modal was closed
   */
  const handleDialogClose = (event, reason) => {
    if (reason !== "backdropClick" 
      && !reviewerStatus.includes(pendingJobDetailsForSelectedAsset.status.toLowerCase())
    ) {
      setOpenPendingJobDlg(false);
      setCurrentAssetInfo({});
      setCurrentLogbookInfo({});
      setMainLogbookSelection("");
      setCurrentAutoJobName("Selfjob");

      //   handleReset()
    }
    else
    {
       setOpenPendingJobDlg(false);
    }
  };


  /* Note :  There are two events through which a logbook can be associated with self job 
    1. Through Asset Selection
    2. Through Logbook Selection [No Asset involved] if there is any asset involved then the associated logbook need to be finished first
      then only a new instance of logbook can be created.
  */

  /**
   * Updates the status of the selected pending job to 'Finished' and closes the pending job modal.
   * If the update is successful, it displays a success message and sets the main logbook selection to an empty string.
   * If the update fails, it displays an error message.
   */
  const finishLastJob = async () => {
    // console.log('finishLastJob() called')
    const updatedPayload = {...pendingJobDetailsForSelectedAsset};
    updatedPayload.activityendtime=new Date().toISOString();
    console.log("Updated Payload : ", updatedPayload);
    const success = await updateJobTime(updatedPayload);
    const updatedJobs=updateJobsTable(pendingJobDetailsForSelectedAsset.jobid,pendingSelfJobs);
    setAllSelfJobs(updatedJobs)
    if (success) {
      setSnackbarMessage("Data updated successfully !");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setOpenPendingJobDlg(false);
      setMainLogbookSelection("");
    } else {
      setSnackbarMessage("Error !");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  /**
   * Updates the pending job details in the database and creates a new auto job.
   * It is called when the user clicks the 'Continue' button in the pending job modal.
   * If the update is successful, it navigates to the logbook form page with the newly created job details.
   * If the update fails, it displays an error message.
   */
  const updateJobDetails = async () => {
    // console.log('updateJobDetails() called')
        const updatedPayload = {...pendingJobDetailsForSelectedAsset};
    updatedPayload.activityendtime=new Date().toISOString();
    console.log('Current Payload for updateJobDetails : ',updatedPayload)
    let success=false;
    if(!reviewerStatus.includes(updatedPayload.status.toLowerCase()))
    {
     success = await updateJobTime(updatedPayload);
    }
    else
    {
      success=true; //If the job is already in reviewerStatus then also we can continue with the logbook 
    }
    if (success) {
      setSnackbarMessage("Data updated successfully !");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setOpenPendingJobDlg(false);
      //Now i need to create a new instance of job and gets navigated to the logbook
      const generateJobId = "AJ" + dayjs().format("YYYYMMDDTHHmmssSSS");
      const generateActivityId = "AA" + dayjs().format("YYYYMMDDTHHmmssSSS");
      // console.log("Generated JobId : ", generateJobId);
      // console.log("Generated ActivityId : ", generateActivityId);
      // console.log('Current PendingJobDetails : ',pendingJobDetailsForSelectedAsset)
      const newAutoJob = createAutoJob(
        generateJobId,
        generateActivityId,
        // "info@greenwave.co.in", //Later on it will be changed dynamically ....
        // decryptTokenId(localStorage.getItem("username")),//Auto Job created by <> will be changed
        pendingJobDetailsForSelectedAsset.jobname,
        pendingJobDetailsForSelectedAsset.id,
        pendingJobDetailsForSelectedAsset.assetName,
        pendingJobDetailsForSelectedAsset.logbookid,
        pendingJobDetailsForSelectedAsset.formname,
        pendingJobDetailsForSelectedAsset.logbookversion,
        // "info@greenwave.co.in",
        // decryptTokenId(localStorage.getItem("username")),
        pendingJobDetailsForSelectedAsset.performer,
        pendingJobDetailsForSelectedAsset.reviewer,
        "Started"
      );

      // console.log("New Auto Job Object : ", newAutoJob);
      newAutoJob.activitystarttime=new Date().toISOString(); //Updating the time with the client machine
      const success = await createNewAutoJob(newAutoJob);
     
      // const currentTransactionData = await getAllTransactions(
      //   generateJobId,
      //   generateActivityId,
      //   pendingJobDetailsForSelectedAsset.formname,
      //   pendingJobDetailsForSelectedAsset.logbookversion
      // );
      // console.log('Current Transaction Data : ',currentTransactionData)
      // if (!currentTransactionData) {
      //   // console.error('Transaction Data fetch failed !')
      //   setSnackbarMessage("Error !");
      //   setSnackbarSeverity("error");
      //   setSnackbarOpen(true);
      //   return;
      // }
      if (success) {
        //* Setting the local variables for logbook
        // localStorage.setItem("jobId", generateJobId);
        // localStorage.setItem("activityId", generateActivityId);
        // localStorage.setItem(
        //   "formName",
        //   pendingJobDetailsForSelectedAsset.formname
        // );
        // localStorage.setItem(
        //   "versionNumber",
        //   pendingJobDetailsForSelectedAsset.logbookversion
        // );
        //Set LocalVariables
        const logbook_lv=getLocalVariablesForSelfJob(
          // A similar new job is getting created
          generateJobId,
          generateActivityId,
          pendingJobDetailsForSelectedAsset.jobname,
          pendingJobDetailsForSelectedAsset.reviewer,
          pendingJobDetailsForSelectedAsset.performer,
          pendingJobDetailsForSelectedAsset.status,
          pendingJobDetailsForSelectedAsset.remarks,
          pendingJobDetailsForSelectedAsset.formname,
          pendingJobDetailsForSelectedAsset.logbookversion,
          // ,new Date()
          dateFormatForSelfJob(new Date()),
          null,
          null,
          getTenantID(),
          currentUser?.userName ?? '',
          currentUser?.phone ?? '',
          currentUser?.department?.deptName?? '',
        );

        logbook_lv.formId=pendingJobDetailsForSelectedAsset.logbookid;
        navigate(
          iSGuestUser ? GUEST_LOGBOOK_URL : LOGBOOK_URL
          , {
          state: logbook_lv
          }
        );
      }
    } else {
      setSnackbarMessage("Error Updating data !");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const pendingJobHeaders = [
    "Job Id",
    "Job Name",
    "Asset Id",
    "Asset Name",
    "Logbook",
    "Performer",
    "Reviewer",
    "Current Status",
  ];
  const pendingJobProps = [
    "jobid",
    "jobname",
    "assetid",
    "assetname",
    "formname",
    "performer",
    "reviewer",
    "status",
  ];

  /**
   * Continues the previous logbook by retrieving the current transaction data
   * and cell information for the selected pending job. It sets the local
   * storage and local variables with the job, activity, form, and version data.
   * If the cell information is successfully fetched, it navigates to the
   * logbook form page. If the data is not found, it displays an error message.
   *
   * @async
   * @function handleContinuePreviousLogbook
   * @returns {Promise<void>} A promise that resolves when the logbook is
   * continued or an error is shown.
   */
  const handleContinuePreviousLogbook = async () => {
    // console.log("handleContinuePreviousLogbook() called ");
    // console.log('Current transaction : ',transactionData)

    // const currentData = {
    //   jobId: pendingJobDetailsForSelectedAsset.jobid,
    //   activityId: pendingJobDetailsForSelectedAsset.activityid,
    //   userId: pendingJobDetailsForSelectedAsset.performer, //userId will be the performer right
    //   formName: pendingJobDetailsForSelectedAsset.formname,
    //   versionNumber: pendingJobDetailsForSelectedAsset.logbookversion,
    //   transactionData:
    //     transactionData.length > 0
    //       ? transactionData[transactionData.length - 1]
    //       : {},
    // };
    // console.log("Current Data : ", currentData);

    // let data = await getAllCellInfoByFormNameAndVersion(
    //   // A logbook check is made  whether that logbook exists or not
    //   pendingJobDetailsForSelectedAsset.formname,
    //   pendingJobDetailsForSelectedAsset.logbookversion
    // );
    // console.log("Cell Details of Form : ", data);
    // if (data) {
      // localStorage.setItem("jobId", pendingJobDetailsForSelectedAsset.jobid);
      // localStorage.setItem(
      //   "activityId",
      //   pendingJobDetailsForSelectedAsset.activityid
      // );
      // localStorage.setItem(
      //   "formName",
      //   pendingJobDetailsForSelectedAsset.formname
      // );
      // localStorage.setItem(
      //   "versionNumber",
      //   pendingJobDetailsForSelectedAsset.logbookversion
      // );
      //Set Localvariables
     const logbook_lv= getLocalVariablesForSelfJob(
        pendingJobDetailsForSelectedAsset.jobid,
        pendingJobDetailsForSelectedAsset.activityid,
        pendingJobDetailsForSelectedAsset.jobname,
        pendingJobDetailsForSelectedAsset.reviewer,
        pendingJobDetailsForSelectedAsset.performer,
        pendingJobDetailsForSelectedAsset.status,
        pendingJobDetailsForSelectedAsset.remarks,
        pendingJobDetailsForSelectedAsset.formname,
        pendingJobDetailsForSelectedAsset.logbookversion,
        pendingJobDetailsForSelectedAsset.activitystarttime
          ? dateFormatForSelfJob(dayjs(pendingJobDetailsForSelectedAsset.activitystarttime))
          : null,
        pendingJobDetailsForSelectedAsset.activityendtime
          ?  dateFormatForSelfJob(pendingJobDetailsForSelectedAsset.activityendtime)
          : null,
        pendingJobDetailsForSelectedAsset.reviewstarttime
          ?  dateFormatForSelfJob(pendingJobDetailsForSelectedAsset.reviewstarttime)
          : null,
          getTenantID(),
          currentUser?.userName ?? '',
          currentUser?.phone ?? '',
          currentUser?.department?.deptName?? '',
      );

      logbook_lv.formId=pendingJobDetailsForSelectedAsset.logbookid;
      navigate(
        iSGuestUser ? GUEST_LOGBOOK_URL : LOGBOOK_URL
          , {
           state: logbook_lv
         }
      );
    // } else {
    //   // console.log("Logbook not found ! ");
    //   setSnackbarMessage("Logbook Not found !");
    //   setSnackbarSeverity("error");
    //   setSnackbarOpen(true);
    // }
  };

  return (
    <div>
      <Modal
        open={openPendingJobDlg}
        onClose={(event, reason) => handleDialogClose(event, reason)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        disableEscapeKeyDown
        disableScrollLock
      >
        <Box sx={style}>
          <Box
            maxWidth="xl"
            sx={{
              //   display: "flex",
              //   justifyContent: "space-between",
              // maxHeight: "500px",
              width: "35rem",
              //height:"30rem"
              // overflow: "auto",
              // p: 2,
            }}
          >
            <IconButton
              aria-label="close"
              onClick={(event, reason) => handleDialogClose(event, reason)}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon color="error" />
            </IconButton>
            <DialogTitle
              sx={{
                m: 0,
                p: 2,
                fontWeight: "bold",
                color: "blue",
                textAlign: "left",
                fontSize: "0.9rem",
                marginTop: "0.4rem",
              }}
              id="customized-dialog-title"
            >
              <Chip
                label={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ paddingRight: ".1rem" }}>
                      Asset / Workspace is busy
                    </div>
                    <Watch visible={true} height="18" width="36" />
                  </div>
                }
              />
            </DialogTitle>
            <Divider />
            <DialogContent>
              {pendingJobHeaders.map((element, index) => (
                <Fragment key={index}>
                  <Stack direction="row" spacing={4}>
                    <Stack direction="column" spacing={1} width={"150px"}>
                      <Item>{element}</Item>
                    </Stack>
                    <Stack direction="column" spacing={2}>
                      <div>
  {pendingJobDetailsForSelectedAsset[pendingJobProps[index]]?.length > 0 ? (
    <Chip
      label={pendingJobDetailsForSelectedAsset[pendingJobProps[index]]}
      sx={{
        whiteSpace: 'normal',
        height: 'auto',
        '& .MuiChip-label': {
          whiteSpace: 'normal',
          overflowWrap: 'break-word',
          textAlign: 'left',
        },
      }}
    />
  ) : (
    <Chip label="NA" />
  )}
</div>

                    </Stack>
                  </Stack>
                  <br />
                </Fragment>
              ))}

              <Stack direction="row" spacing={4}>
                <Stack direction="column" spacing={4} width={"150px"}>
                  <Item>Start Time</Item>
                </Stack>
                <Stack direction="column" spacing={4}>
                  <div style={{ marginTop: "10px" }}>
                    {/* {dayjs(
                      pendingJobDetailsForSelectedAsset.activitystarttime
                    ).format('D MMM YY h:mm A') } */}
                    <Chip
                      label={formatDatetime(
                        dayjs(
                          pendingJobDetailsForSelectedAsset.activitystarttime
                        )
                      )}
                    />
                  </div>
                </Stack>
              </Stack>
              <br />
              {
                // pendingJobDetailsForSelectedAsset.performer ===
                //   currentLogbookApprover &&
                pendingJobDetailsForSelectedAsset.status &&(
                  
                    <Stack direction="row" spacing={4} display="flex-start">
                      {/* {pendingJobDetailsForSelectedAsset?.status} */}
                   {
 !reviewerStatus.includes(pendingJobDetailsForSelectedAsset?.status?.toLowerCase()) && (
    <>
      <Button
        size="small"
        startIcon={<StopCircleIcon />}
        color="secondary"
        variant="contained"
        onClick={finishLastJob}
      >
        Finish Last
      </Button>

      <Button
        startIcon={<PlayCircleFilledWhiteIcon />}
        size="small"
        color="warning"
        variant="contained"
        onClick={handleContinuePreviousLogbook}
      >
        Continue Previous
      </Button>
    </>
  )
}
                      <Button
                        startIcon=<PlayArrowIcon />
                        size="small"
                        color="success"
                        variant="contained"
                        onClick={updateJobDetails}
                        disabled={pendingJobDetailsForSelectedAsset.assetid}
                      >
                      
                        Start New
                      </Button>
                    </Stack>
                  )
              }
            </DialogContent>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
