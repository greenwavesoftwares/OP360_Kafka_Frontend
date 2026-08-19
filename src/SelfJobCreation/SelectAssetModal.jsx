import React, { useState } from "react"; // Importing React and useState hook for managing component state

import CloseIcon from "@mui/icons-material/Close"; // Importing CloseIcon from Material UI for closing actions (e.g., closing modal/dialog)
import InfoIcon from "@mui/icons-material/Info"; // Importing InfoIcon from Material UI to display information or details
import {
  Box, // Importing Box component for flexible layout and spacing
  Chip, // Importing Chip component for displaying small elements like labels or tags
  DialogContent, // Importing DialogContent for structuring the content of a dialog box
  DialogTitle, // Importing DialogTitle to display the title of a dialog box
  IconButton, // Importing IconButton for clickable icons
  Modal, // Importing Modal component to create modals (overlays with content)
  useMediaQuery, // Importing useMediaQuery hook to apply conditional styling based on screen size
  useTheme, // Importing useTheme hook to access the Material UI theme
} from "@mui/material"; // Importing components from Material UI core

import Divider from "@mui/material/Divider"; // Importing Divider component for creating horizontal/vertical separators
import { Dropdown as PrimeReactDropdown } from "primereact/dropdown"; // Importing Dropdown component from PrimeReact with alias to avoid conflicts

import { getActiveLogbooksByAssetId, getAssetGroupTree } from "../Logbook Asset/LogbookAssetApi"; // Importing API function to fetch asset group tree from Logbook Asset API
import AssetTree from "../components/shared/tree/AssetTree.component"; // Importing custom AssetTree component for displaying asset hierarchy/tree
import { decryptTokenId } from "../helper/AuthService"; // Importing helper function to decrypt token ID from AuthService
import {
  getpendingJobDetails, // Importing API function to fetch details of pending jobs
  getPendingJobInfoforLogbook, // Importing API function to fetch pending job info for logbook
} from "./SelfJobCreationAPI"; // Importing API functions from SelfJobCreationAPI for job-related details
import { getCurrentUser } from "../UserModuleUpdated/helper";
import {   defaultJobNamePrefix, getTodaysFilteredSelfJobs } from "./SelfJobHelper";
import { getAllGroupDetails, getTenantID } from "../UserModuleUpdated/UsermoduleApi";
import { LoadingOutlined } from '@ant-design/icons';
import {  Spin } from 'antd';
import { useLocation } from "react-router-dom";


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
  maxWidth: 900,
  maxHeight: 900,
};

const automatedJobName=defaultJobNamePrefix;
export default function SelectAssetModal({
  openSelectAssetModal,
  setOpenSelectAssetModal,
  assetGroupList,
  selectedNode,
  setSelectedNode,
  setCurrentAssetInfo,
  // currentAssetInfo,
  // currentLogbookInfo,
  setCurrentLogbookInfo,
  setOpenPendingJobDlg,
  // pendingJobDetailsForSelectedAsset,
  setPendingJobDetailsForSelectedAsset,
  allActiveFormsMap,
  allSelfJobs,setCurrentAutoJobName,
  fn_filterLogbookApprovers,
  setApproverList,
  setCurrentLogbookApprover,
  approverList,
}) {
  const env_userId = process.env.REACT_APP_USERID;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedAsset, setSelectedAsset] = useState("");
  const [assetTreeData, setAssetTreeData] = useState(null);
  const [selectedLogbook, setSelectedLogbook] = useState("");
  const [logbookDropdownList, setLogbookDropdownList] = useState({status:null,data:null});
  // const [firstRender, setFirstRender] = useState(false);
  const location=useLocation();
  const iSGuestUser=location.pathname.toLowerCase().includes('guest') 

  /**
   * Handles the change event of the asset dropdown in the select asset modal dialog.
   * Sets the selected asset state with the selected asset, fetches the asset group tree
   * for the selected asset and updates the asset tree data state.
   * @param {Event} e - Event object containing the target value (selected asset)
   * @returns {Promise<void>}
   */
  const handleSelectAssetGroupchange = async (e) => {
    // console.log("handleSelectAssetchange() called ", e.target.value);
    setSelectedAsset(e.target.value);
    setLogbookDropdownList([]);
    let currentAssetValue = e.target.value.groupId;
    const treeData = await getAssetGroupTree(currentAssetValue);
    // console.log("Tree data from API : ", treeData[0]);
    if (treeData) {
      setAssetTreeData(treeData[0]);
    }
  };
  /**
   * Handles the closing of the select asset modal dialog.
   * If the closing is due to user interaction and not just a backdrop click,
   * it sets the modal open state to false.
   *
   * @param {Object} event - The event object
   * @param {String} reason - The reason why the modal was closed
   */
  const handleDialogClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpenSelectAssetModal(false);
    }
  };

  /**
   * Handles the node selection event in the select asset modal dialog.
   * Sets the first render state to true, fetches the asset details from the API
   * and updates the current asset information state.
   * If there are pending jobs for the selected asset, it opens the pending job
   * dialog. If there is only one logbook associated with the asset, it updates
   * the current logbook information state and if there are pending jobs for the
   * selected logbook, it navigates to the pending job dialog.
   * If there are multiple logbooks associated with the asset, it fetches the
   * active forms for the logbooks, updates the logbook dropdown list state and
   * closes the select asset modal dialog.
   *
   * @param {Object} node - The selected node in the asset tree
   */
  const handleNodeSelection = async (node) => {
    setLogbookDropdownList({...logbookDropdownList,status:'pending',data:null});
    // console.log("handleNodeSelection() called ", node);
    // const logbookAssetPropsValues=["aliasName","nodeName"]
    //aliasName is the node.assetName and nodeName is the node.id
    setCurrentLogbookInfo({});//Resetting the current logbook info
    // setFirstRender(true);
    const assetId = node.id;
    setSelectedLogbook("");
    // const scanStrAssetDetails = await getAssetLogbooks(assetId);
    
    //*Selected node is the Asset itself
    const scanStrAssetDetails = node;

    console.log("Selected Asset Details : ", scanStrAssetDetails);
    

 let logbookFormForAsset= await getActiveLogbooksByAssetId(assetId,getTenantID());
logbookFormForAsset=iSGuestUser ? logbookFormForAsset?.filter(logbook=>logbook.external):logbookFormForAsset;
 const activeLogbookIdsForAsset=logbookFormForAsset?.map(logbook=>logbook.formID)
 scanStrAssetDetails.logbook = activeLogbookIdsForAsset??[];

    if (scanStrAssetDetails) {
      setCurrentAssetInfo(scanStrAssetDetails);
    }
    const pendingJobDetails = await getpendingJobDetails(assetId);
    // console.log("Pending Job Details : ", pendingJobDetails);

    //setAssetIdScanError(false)
     setLogbookDropdownList({...logbookDropdownList,status:null,data:null});
    if (
      pendingJobDetails &&
      pendingJobDetails.assetid &&
      pendingJobDetails.jobid
    ) {
      //This is the moment the pending job Modal will be shown
      setPendingJobDetailsForSelectedAsset(pendingJobDetails);
      setOpenPendingJobDlg(true);
      setLogbookDropdownList({...logbookDropdownList,status:null,data:null});
    } else if (
      scanStrAssetDetails.logbook &&
      scanStrAssetDetails.logbook.length > 0
    ) {
       setLogbookDropdownList({...logbookDropdownList,status:null,data:null});
      //setOpenMultipleLogbookModal(true)
      if (scanStrAssetDetails.logbook.length === 1) {
        // console.log("LogbookList Size is 1");
        const currentLogbook = scanStrAssetDetails.logbook[0];
        // console.log("Current Logbook : ", currentLogbook);
        // console.log("Current Active Forms Map : ", allActiveFormsMap);
        if (allActiveFormsMap.get(currentLogbook)) {
          console.log(
            "Form Id found in map : ",
            allActiveFormsMap.get(currentLogbook)
          );
          setCurrentLogbookInfo(allActiveFormsMap.get(currentLogbook));
          const formDetails = allActiveFormsMap.get(currentLogbook);
          const currentUser = getCurrentUser();
          const pendingLogBookFormDetails = await getPendingJobInfoforLogbook(
            formDetails.formName,
            formDetails.formID,
            formDetails.versionNumber,
            currentUser
          );
          console.log(
            "pendingLogBookFormDetails : ",
            pendingLogBookFormDetails
          );
          if (pendingLogBookFormDetails && pendingLogBookFormDetails.jobid) {
            // console.log("Pending Form Details : ", pendingLogBookFormDetails);
            setPendingJobDetailsForSelectedAsset(pendingLogBookFormDetails);
            setOpenSelectAssetModal(false);
            setOpenPendingJobDlg(true);
            return;
          }
          // console.log("Selected Logbook : ", currentLogbook);
          setOpenSelectAssetModal(false);
           setLogbookDropdownList({...logbookDropdownList,status:null,data:null});
          // setSelectedForm(allActiveFormsMap.get(currentLogbook))
        }
      } else {
        // console.log("Logbook List size is greater than 1");
        // console.log("allActiveFormsMap : ", allActiveFormsMap);
        let newDropdownList = [];
        scanStrAssetDetails.logbook.forEach((formId) => {
          // console.log("Current formId : ", formId);
          console.log(
            "allActiveFormsMap?.has(formId): ",
            allActiveFormsMap?.has(formId)
          );

          if (allActiveFormsMap?.has(formId)) {
            let activeform = allActiveFormsMap.get(formId);
            newDropdownList.push(activeform);
          }
        });

        console.log(
          "New Dropdown list for Multiple Logbooks => ",
          newDropdownList
        );
        // console.log(allActiveFormsMap);
        if (newDropdownList) {
          setLogbookDropdownList({...logbookDropdownList,status:'loaded',data:newDropdownList});
        }
        // console.log("****",allActiveFormsMap.get("86"))
      }
    }
    else{
        setLogbookDropdownList({...logbookDropdownList,status:'loaded',data:[]});
    }
  };

  /**
   * Handles the logbook dropdown change event in the select asset modal dialog.
   * Sets the selected logbook state with the selected logbook, fetches the
   * pending job details for the selected logbook from the API and updates the
   * pending job details state. If there is a pending job for the selected
   * logbook, it opens the pending job dialog. If there is no pending job for the
   * selected logbook, it updates the current logbook information state.
   * @param {Object} e - The event object
   */
  const handleLogbookDropdownChange = async (e) => {
    // console.log("Current Event : ", e);
    // console.log("handleLogbookDropdwonChange() called ", e.target.value);
    setSelectedLogbook(e.target.value);
    const key = e.target.value.formID;
    const formDetails = allActiveFormsMap.get(key);
    // console.log("formDetails", formDetails);


    //  This check is not required as for asset association separate instance  of logbook is created
    //  and hence no need to check for pending job

    
    // const currentUser = decryptTokenId(localStorage.getItem(env_userId));
    // const pendingLogBookFormDetails = await getPendingJobInfoforLogbook(
    //   formDetails.formName,
    //   formDetails.formID,
    //   formDetails.versionNumber,
    //   currentUser
    // );
    // // console.log("pendingLogBookFormDetails : ", pendingLogBookFormDetails);
    // if (pendingLogBookFormDetails && pendingLogBookFormDetails.jobid) {
    //   // console.log("Pending Form Details : ", pendingLogBookFormDetails);
    //   setPendingJobDetailsForSelectedAsset(pendingLogBookFormDetails);
    //   setOpenPendingJobDlg(true);
    //   return;
    // }

    if (formDetails) {
      setCurrentLogbookInfo(formDetails);
     const jobCountForLogbook=getTodaysFilteredSelfJobs(allSelfJobs,formDetails).length
          // console.log("Filtered SelfJobs For Current Form : ",allSelfJobs.filter(job=>job.logbookid===formDetails.formID))
          setCurrentAutoJobName(`${automatedJobName} ${formDetails.formName} - ${jobCountForLogbook+1}`) 
    }

    const updatedApproverList=await fn_filterLogbookApprovers(formDetails,approverList);
    setApproverList(updatedApproverList);
    const isLogbookGroupPresent=updatedApproverList.some(approver=>approver.userID===getCurrentUser())
    if(!isLogbookGroupPresent)  setCurrentLogbookApprover('');
    //   setCurrentLogbookApprover(getCurrentUser());
    // }else
   
  };

  return (
    <div>
      <Modal
        open={openSelectAssetModal}
        onClose={(event, reason) => handleDialogClose(event, reason)}
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
              maxHeight: "500px",
              width: isMobile ? "100%" : "800px",
              overflow: "auto",
              p: 1,
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
                m: 0,
                p: 2,
                fontSize: "1rem",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
              }}
              id="customized-dialog-title"
            >
              {/* <div style={{fontWeight:"bold"}}>
              Select Asset and Logbook : 
              </div> */}
              <Chip
                label=" Select Asset and Workspace "
                icon={
                  <i className="pi pi-sitemap" style={{ fontSize: "1rem" }}></i>
                }
              />
              
            </DialogTitle>
            <Divider />

            <DialogContent>
            
              <PrimeReactDropdown
                value={selectedAsset}
                onChange={(e) => handleSelectAssetGroupchange(e)}
                placeholder="Select AssetGroup"
                filter
                optionLabel="groupName"
                // optionValue="groupId"
                options={assetGroupList}
              />
              <br />

              {assetTreeData && (
                <AssetTree
                  data={assetTreeData}
                  setSelectedNodeFn={async (node) => {
                    //setSelectedNode is a function right ...
                    // console.log("selected node", node);
                    setLogbookDropdownList([]);
                    setSelectedNode(node);
                    handleNodeSelection(node);
                  }}
                />
              )}
              <br />
              <br />

              {logbookDropdownList.status==='loaded' && logbookDropdownList.data.length > 0 && (
               
                <PrimeReactDropdown
                  value={selectedLogbook}
                  onChange={(e) => handleLogbookDropdownChange(e)}
                  placeholder="Select Workspace"
                  filter
                  optionLabel="formName"
                  options={logbookDropdownList.data}
                />
              )}
              <br />

              {logbookDropdownList.status==='loaded' &&
                logbookDropdownList.data.length === 0 &&
                 (
                  <Chip
                    icon={<InfoIcon />}
                    label="No Workspace Found for Current Selection"
                  />
                )}


                {logbookDropdownList.status==='pending' &&  logbookDropdownList.data===null &&
                  <Spin indicator={<LoadingOutlined spin />} size="small" /> }
                 


            </DialogContent>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
