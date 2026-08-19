import React from "react";

import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Chip,
  DialogContent,
  DialogTitle,
  IconButton,
  Modal,
} from "@mui/material";
import { Dropdown as PrimeReactDropdown } from "primereact/dropdown";
import { getPendingJobInfoforLogbook } from "./SelfJobCreationAPI";
import { defaultJobNamePrefix, getTodaysFilteredSelfJobs } from "./SelfJobHelper";
import { getCurrentUser } from "../UserModuleUpdated/helper";

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

const automatedJobName=defaultJobNamePrefix;
/**
 * MultipleLogbookModal is a React component that displays a modal dialog when
 * the user has multiple logbooks associated with the scanned asset. The modal
 * displays a dropdown with the list of logbooks and allows the user to select
 * one of them. If the user selects a logbook, the component fetches the
 * pending job details for the selected logbook from the API and updates the
 * pending job details state. If there is a pending job for the selected
 * logbook, it opens the pending job dialog. If there is no pending job for the
 * selected logbook, it updates the current logbook information state.
 *
 * @param {boolean} openMultipleLogbookModal - A boolean indicating whether the
 * modal should be open or closed.
 * @param {function} setOpenMultipleLogbookModal - A function to call when the
 * modal should be closed.
 * @param {object} currentLogbookInfo - The current logbook information.
 * @param {function} setCurrentLogbookInfo - A function to call when the current
 * logbook information should be updated.
 * @param {array} multipleLogbooksDropdown - The list of logbooks to be displayed
 * in the dropdown.
 * @param {string} selectedLogbook - The currently selected logbook.
 * @param {function} setSelectedLogbook - A function to call when the selected
 * logbook should be updated.
 * @param {function} setPendingJobDetailsForSelectedAsset - A function to call
 * when the pending job details for the selected logbook should be updated.
 * @param {function} setOpenPendingJobDlg - A function to call when the pending
 * job dialog should be opened.
 */
export default function MultipleLogbookModal({
  openMultipleLogbookModal,
  setOpenMultipleLogbookModal,
  // currentLogbookInfo,
  setCurrentLogbookInfo,
  multipleLogbooksDropdown,
  selectedLogbook,
  setSelectedLogbook,
  // allActiveFormsMap,
  setPendingJobDetailsForSelectedAsset,
  setOpenPendingJobDlg,
  setCurrentAutoJobName,
  allSelfJobs,
  fn_filterLogbookApprovers,
  setCurrentLogbookApprover,
  setApproverList,
  approverList,
  filterActiveApprovers,allUsersData

}) {
  // const env_userId=process.env.REACT_APP_USERID;

  /**
   * Handles the closing of the multiple logbook modal dialog.
   * If the closing is due to user interaction and not just a backdrop click,
   * it sets the modal open state to false and resets the selected logbook to empty string.
   * @param {Object} event - The event object
   * @param {String} reason - The reason why the modal was closed
   */
  const handleDialogClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpenMultipleLogbookModal(false);
      setSelectedLogbook("");
      //   handleReset()
    }
  };

  /**
   * Handles the logbook selection change event in the multiple logbook modal dialog.
   * Sets the selected logbook state with the selected logbook, fetches the
   * pending job details for the selected logbook from the API and updates the
   * pending job details state. If there is a pending job for the selected
   * logbook, it opens the pending job dialog. If there is no pending job for the
   * selected logbook, it updates the current logbook information state.
   * @param {Object} e - The event object
   */
  const handleLogbookChange = async (e) => {
    // console.log('handleLogbookChange() called')
    setSelectedLogbook(e.target.value);
    const key = e.target.value;
    // const formDetails=allActiveFormsMap.get(key)
    const formDetails = e.target.value;
    // console.log('formDetails',formDetails)
    if (formDetails) {
      //Check for any pending job exists for this logbook or not !

      setCurrentLogbookInfo(formDetails);

      // const currentUser=decryptTokenId(localStorage.getItem(env_userId))
      const pendingLogBookFormDetails = await getPendingJobInfoforLogbook(
        formDetails.formName,
        formDetails.formID,
        formDetails.versionNumber
      );
      // console.log('pendingLogBookFormDetails : ',pendingLogBookFormDetails )
      if (pendingLogBookFormDetails && pendingLogBookFormDetails.jobid) {
        // console.log("Pending Form Details : ",pendingLogBookFormDetails)
        setPendingJobDetailsForSelectedAsset(pendingLogBookFormDetails);
        setCurrentLogbookInfo({})
        
        setOpenPendingJobDlg(true);
        return;
      }


   const jobCountForLogbook=getTodaysFilteredSelfJobs(allSelfJobs,formDetails).length
        // console.log("Filtered SelfJobs For Current Form : ",allSelfJobs.filter(job=>job.logbookid===formDetails.formID))
        setCurrentAutoJobName(`${automatedJobName} ${formDetails.formName} - ${jobCountForLogbook+1}`) 
    }

 const approverList=filterActiveApprovers(allUsersData);
    const updatedApproverList=await fn_filterLogbookApprovers(formDetails,approverList);
        setApproverList(updatedApproverList);
        const isLogbookGroupPresent=updatedApproverList.some(approver=>approver.userID===getCurrentUser())
        if(!isLogbookGroupPresent)  setCurrentLogbookApprover('');
  };

  return (
    <div>
      <Modal
        open={openMultipleLogbookModal}
        onClose={(event, reason) => handleDialogClose(event, reason)}
        // aria-labelledby="modal-title"
        // aria-describedby="modal-description"
        disableEscapeKeyDown
        disableScrollLock
        sx={{ zIndex: 500 }}
      >
        <Box sx={style}>
          <Box
            maxWidth="xl"
            sx={{
              //   display: "flex",
              //   justifyContent: "space-between",
              // maxHeight: "500px",
               width: "500px",
               overflow: "auto",
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
              <CloseIcon />
            </IconButton>
            <DialogTitle
              sx={{
                fontWeight: "bold",
                textAlign: "left",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
              id="customized-dialog-title"
            >
              <Chip
                color="info"
                label="Multiple logbooks found for scanned asset :"
                icon={<i className="pi pi-book"></i>} // Adding the icon inside the Chip
              />
            </DialogTitle>
            {/* <br/> */}
            <DialogContent>
             
              <PrimeReactDropdown
                value={selectedLogbook}
                onChange={(e) => handleLogbookChange(e)}
                placeholder="Select Workspace"
                filter
                optionLabel="formName"
                options={multipleLogbooksDropdown}
              />

              {/* {selectedLogbook} */}
            </DialogContent>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
