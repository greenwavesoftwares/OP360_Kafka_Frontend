import Card from "@mui/material/Card"; // Importing MUI Card component for card layout
import CardContent from "@mui/material/CardContent"; // Importing CardContent for content inside the card
import CardMedia from "@mui/material/CardMedia"; // Importing CardMedia for displaying media like images or videos in the card
import Chip from "@mui/material/Chip"; // Importing Chip component for displaying small, styled elements such as tags or labels
import Stack from "@mui/material/Stack"; // Importing Stack for flexible vertical or horizontal layout of components
import TextField from "@mui/material/TextField"; // Importing TextField component for input fields
// import scanImg from "/public/scan.jpg"; // Importing an image to use in the component from the local resources folder

import DisabledByDefaultRoundedIcon from "@mui/icons-material/DisabledByDefaultRounded"; // Importing a specific rounded icon from Material Icons library
import SendIcon from "@mui/icons-material/Send"; // Importing Send icon to indicate sending actions, typically for buttons
import {
  Box,
  Container, // Importing MUI Container component for wrapping and centering content
  Divider, // Importing Divider component for creating horizontal or vertical separators
  Grid, // Importing Grid component for responsive layouts using a 12-column grid system
  IconButton, // Importing IconButton component for clickable icons
  InputAdornment, // Importing InputAdornment for adding icons or labels inside input fields
  Tooltip, // Importing Tooltip component for displaying additional information on hover
  Typography, // Importing Typography component for styled text
  useMediaQuery, // Importing hook for checking the media query and conditionally applying styles based on screen size
} from "@mui/material"; // Importing components from Material UI core

import Button from "@mui/material/Button"; // Importing Button component for clickable buttons
import Checkbox from "@mui/material/Checkbox"; // Importing Checkbox component for creating checkable boxes
import Paper from "@mui/material/Paper"; // Importing Paper component to create surfaces with elevation
import { styled } from "@mui/material/styles"; // Importing styled utility to create custom styled components
import { Fragment, useEffect, useRef, useState } from "react"; // Importing React hooks and Fragment component
import SnackbarComponent from "../components/shared/snackbar/customSnackbar"; // Importing custom Snackbar component from shared components
import MultipleLogbookModal from "./MultipleLogbookModal"; // Importing modal for managing multiple logbooks
import PendingJobsModal from "./PendingJobsModal"; // Importing modal for displaying pending jobs
import "./SelfJob.css"; // Importing CSS styles specific to the "SelfJob" component
import {
  createNewAutoJob, getAllSelfJobs, getAllSelfJobsByUser, // Importing API function to create a new auto job
  getpendingJobDetails, // Importing API function to fetch details of pending jobs
  getPendingJobInfoforLogbook, // Importing API function to fetch pending job info for a logbook
} from "./SelfJobCreationAPI"; // Importing API functions from SelfJobCreationAPI file
//MUI Icon
import ApartmentIcon from '@mui/icons-material/Apartment';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import QrCode2OutlinedIcon from '@mui/icons-material/QrCode2Outlined';
import dayjs from "dayjs"; // Importing Day.js library for date manipulation
import { useLocation, useNavigate } from "react-router-dom"; // Importing hooks for routing: useLocation to access location object, and useNavigate for programmatic navigation
import UsersDropdown from "../components/shared/UsersDropdown/UsersDropdown.component"; // Importing a custom UsersDropdown component from shared components folder
import { decryptTokenId, extendTokenExpiration, login } from "../helper/AuthService"; // Importing authentication helper functions for token decryption and expiration extension
import SelectAssetModal from "./SelectAssetModal"; // Importing modal for selecting assets

import { createTheme } from "@mui/material/styles"; // Importing function to create a custom Material-UI theme
import { Dropdown, Dropdown as PrimeReactDropdown } from "primereact/dropdown"; // Importing Dropdown component from PrimeReact (with alias for use if needed)
import { Fieldset } from "primereact/fieldset"; // Importing Fieldset component from PrimeReact for grouping related elements
import {
  fetchAllotedPagesByUserId, // Importing function to fetch allotted pages by user ID
} from "../CommonAPI"; // Importing API functions from CommonAPI

import {
  assetInfoByAssetIdApi,
  getAllAssetGroups,
} from "../Logbook Asset/LogbookAssetApi"; // Importing API functions to fetch asset information and asset groups from Logbook Asset APIs
import {
  getAllActiveFormInfo, // Importing function to fetch all active form info
  getAllTransactions, // Importing function to fetch all transactions
} from "../Logbook/LogbookApi"; // Importing API functions from Logbook API

import {
  fetchAllUsers, getAllGroupDetails, getTenantID, // Importing function to fetch all users
  getUserDetailsByUserID, // Importing function to fetch user details by user ID
} from "../UserModuleUpdated/UsermoduleApi"; // Importing user-related API functions from updated User Module

import { createAutoJob, defaultJobNamePrefix, fn_filterLogbookApprovers, getLocalVariablesForSelfJob, getTodaysFilteredSelfJobs, GUEST_LOGBOOK_URL, JOBREVIEWER_PAGEID, LOGBOOK_URL, reviewerStatus } from "./SelfJobHelper"; // Importing helper functions for creating auto jobs and setting local variables in Self Job
import { getCurrentUser } from "../UserModuleUpdated/helper"; // Importing helper function to get the current user

// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: "center",
//   color: theme.palette.text.secondary,
// }));
import { getActiveLogbooksByAssetId } from '../Logbook Asset/LogbookAssetApi';
import { formatDatetime } from "../JobPerformer/JobHelper";
import { useSearchParams } from 'react-router-dom';
import JobsTable from "./JobsTable";

const automatedJobName=defaultJobNamePrefix;


export default function SelfJobCreation() {
  const defaultTheme = createTheme(); // Directly create the theme
  const isMobile = useMediaQuery(defaultTheme.breakpoints.down("sm")); // Use breakpoints from default theme
  /**
   * ***************************All useStates here **********************************
   */
  // const env_userID = process.env.REACT_APP_USERID;

  const navigate = useNavigate(); // Hook for programmatic navigation within the app

  const [assetIdScan, setAssetIdScan] = useState(""); // State for holding the scanned asset ID
  const [assetIdScanError, setAssetIdScanError] = useState(false); // State for handling asset ID scan error status
  const [clearVisible, setClearVisible] = useState(false); // State to control the visibility of a clear button (e.g., to clear input fields)

  // for Asset Properties
  const logbookAssetPropsName = ["Asset Name", "Asset Id"]; // Array holding the display names of asset properties
  const logbookAssetPropsValues = ["assetName", "id"]; // Array holding the corresponding property values for asset info

  // for Logbook Properties
  const logBookProps = ["Workspace Name", "Workspace Id", "Workspace Version"]; // Array holding the display names of logbook properties
  const logBookPropsValue = ["formName", "formID", "versionNumber"]; // Array holding the corresponding property values for logbook info

  const [allActiveFormsMap, setAllActiveFormsMap] = useState(null); // State to store all active forms data (mapped)

  const [snackbarOpen, setSnackbarOpen] = useState(false); // State to control the open/close status of the snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // State to store the message displayed in the snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState("info"); // State to control the severity of the snackbar (info, error, etc.)

  const [openPendingJobDlg, setOpenPendingJobDlg] = useState(false); // State to control the open/close status of the Pending Jobs modal
  const [openMultipleLogbookModal, setOpenMultipleLogbookModal] =
    useState(false); // State to control the open/close status of the Multiple Logbook modal
  const [openSelectAssetModal, setOpenSelectAssetModal] = useState(false); // State to control the open/close status of the Select Asset modal

  // const[selectedForm,setSelectedForm]=useState({}) // Placeholder for state handling selected form (commented out)

  // These are the logbook details of Selected Logbook Info
  const [currentAssetInfo, setCurrentAssetInfo] = useState({}); // State to store the current asset info for the selected asset
  const [currentLogbookInfo, setCurrentLogbookInfo] = useState({}); // State to store the current logbook info for the selected logbook

  const [multipleLogbooksDropdown, setMultipleLogbookDropdown] = useState(null); // State to store the dropdown options for multiple logbooks
  const [selectedLogbook, setSelectedLogbook] = useState(""); // State to store the selected value from the logbook dropdown

  const [
    pendingJobDetailsForSelectedAsset, // State to store pending job details related to the selected asset
    setPendingJobDetailsForSelectedAsset,
  ] = useState({});

  const [mainLogbookSelection, setMainLogbookSelection] = useState(""); // State to store the selected logbook from the main dropdown
  const logbookSelectRef = useRef(null); // useRef hook to reference the logbook selection dropdown

  const [allUsersData, setAllUsersData] = useState([]); // State to store all users data
  const [approverList, setApproverList] = useState([]); // State to store the list of approvers

  const [currentLogbookApprover, setCurrentLogbookApprover] = useState(""); // State to store the current logbook approver, will update dynamically
  const [booleanSelfApproved, setBooleanSelfApproved] = useState(true); // Boolean state indicating if the job is self-approved

  // For Select Asset Modal
  const [assetGroupList, setAssetGroupList] = useState([]); // State to store the list of asset groups
  const [selectedNode, setSelectedNode] = useState({}); // State to store the selected asset node

  // Add on
  const [currentAutoJobName, setCurrentAutoJobName] = useState(`Self job`); // State to store the auto job name, initialized with 'Self job'
  const location = useLocation(); // Hook to access the current location object for routing purposes
  const [allSelfJobs, setAllSelfJobs] = useState([]); // State to store allSelfJobs
  const [currentUser, setCurrentUser] = useState({}); // State to store the current user

  const [urlParam,_]=useSearchParams() // Hook to access and set URL search parameters

  const iSGuestUser=location.pathname.toLowerCase().includes('guest') 
  const guestTenant=urlParam.get('instance')??null;

  /**
   * Fetches all the asset groups for the tenant and updates the state 'assetGroupList' with the received data.
   * The function is called when the component mounts and when the user selects a new asset group from the dropdown.
   * The data is fetched from the API using the 'getAllAssetGroups' function.
   */
  async function fetchDataForAssetGroup() {
    let assetGroupData = await getAllAssetGroups();
    console.log("Asset Group from API : ", assetGroupData);
    // if (assetGroupData) {
    //   assetGroupData = assetGroupData.map((item, index) => {
    //     return createAssetGroupDropDown(item.groupName, item.groupId);
    //   });
    // }

    if (assetGroupData) {
      setAssetGroupList(assetGroupData);
    }
  }

  /**
   * Asynchronously fetches all active forms for the current user based on their group affiliations
   * and updates the state with the filtered forms. It retrieves the user's ID from session storage,
   * decrypts it, and fetches user details including group memberships. It then filters the list of
   * all active forms to only include those associated with the user's groups. The filtered forms
   * are stored in a map and the component's state is updated accordingly.
   */
  const fetchAllActiveForms = async () => {
    // console.log("fetchAllActiveForms() called");
    // const userID='info@greenwave.co.in'
    let userID = getCurrentUser();
    // userID = decryptTokenId(userID);
    // console.log("Current userID : ", userID);

    const userDetails = await getUserDetailsByUserID(userID);

    let currentUserGroupDetails = [];
    if (userDetails) {
      setCurrentUser(userDetails);
      currentUserGroupDetails = userDetails.group.map((data) => {
        return data.groupID;
      });
    }

    let finalFormList = [];
    let allForms = await getAllActiveFormInfo();
    // allForms=iSGuestUser ? allForms.filter(form=>form.external) : allForms

    if (allForms) {
      allForms.forEach((logbook) => {
        if (
          currentUserGroupDetails.some(
            (data) => logbook.userGroup.split(",").includes(data) //* if the logbook contains groups as of the current user groups then include those logbooks
          )
          // || userDetails.department.deptId.trim().toLowerCase() === logbook.department.trim().toLowerCase()
        ) {
          finalFormList.push(logbook);
        }
        else if(iSGuestUser && logbook.external)
        {
          finalFormList.push(logbook);
        }
      });
    }

    console.log("Final Logbook forms :", finalFormList);
    let map = new Map();
    if (finalFormList) {
      finalFormList.forEach((form) => {
        // console.log("Form : ", form);
        map.set(form.formID, form);
      });
      setAllActiveFormsMap(iSGuestUser ? new Map([...map].filter(([key, form]) => form.external)) : map);
      console.log("Form Map : ", map);
    }
    else setAllActiveFormsMap([])
  }


   

  /**
   * Asynchronously checks whether the current user has access to the page
   * they are trying to view based on their allotted pages. If the user
   * does not have access, they are redirected to a restricted page.
   * It fetches the user's allowed pages and compares the current path
   * with these pages to determine access rights.
   */
  const userHasPageAccess = async () => {
    // console.log("userHasPageAccess() called ");
    const allotedPages = await fetchAllotedPagesByUserId();
    // console.log("Alloted pages : ", allotedPages);

    if (allotedPages) {
      const current_path = location.pathname;
      const index = allotedPages
        .filter((page) => page !== null)
        .findIndex((data) => data.toLowerCase() === current_path);
      if (index === -1) {
        navigate("/restricted");
      }
    }
  };
  useEffect(() => {
    // console.log("UseEffect called");
    // extendTokenExpiration();
    // userHasPageAccess();
    // console.log('SelfJob State :',window.history)
    // fetchAllActiveForms();
    // getAllUsers();
    // fetchDataForAssetGroup();
    // fetchAllSelfJobs();
     sessionStorage.removeItem('isRefresh');
      // Start interval
    const intervalId = setInterval(checkForRegularLogin, 3000);
    guestLogin();

      // Cleanup on unmount to prevent memory leaks
    return () => clearInterval(intervalId);

  }, []);

  const checkForRegularLogin = () => {
  if (iSGuestUser && guestTenant) {
  const externalUserCredentials =
    process.env.REACT_APP_EXTERNALUSER_CREDENTIALS.split(",");

  console.log("External User Credentials : ", externalUserCredentials);

  const token = localStorage.getItem("token");

  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload

    const isDifferentUser =
      payload.sub !== externalUserCredentials[0]; // Checking if the user is same or not

    if (isDifferentUser) {
      const confirmRefresh = window.confirm(
        "A different login detected. You will be logged out from current session and the page will refresh. Do you want to continue?"
      );

      if (confirmRefresh) {
        console.log("Refreshing the page and clearing storage for new login...");
        localStorage.clear(); // optional logout cleanup
        window.location.reload();
      }
    }
  }
}
}

  const init=() => { 
    fetchAllActiveForms();
    getAllUsers();
    fetchDataForAssetGroup();
    fetchAllSelfJobs();
   }



  useEffect(() => {
    if (assetIdScan === "") {
      setClearVisible(false);
      setCurrentAssetInfo({});
      setCurrentLogbookInfo({});
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      //* a delay is created so that the response is not immediately fetched after each type
      // console.log("Current AssetId Scan : ", assetIdScan);
      updateAsset(assetIdScan);
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [assetIdScan]);


  const guestLogin=async() => { 
    console.log('Guest User : ',iSGuestUser ,'guestTenant ? ',guestTenant)
    const externalUserCredentials=process.env.REACT_APP_EXTERNALUSER_CREDENTIALS.split(',')
    console.log('External User Credentials : ',externalUserCredentials)
    // localStorage.clear();
    if(iSGuestUser && guestTenant){
      localStorage.clear();
     await login(externalUserCredentials[0],externalUserCredentials[1],guestTenant);
     console.log('login done for External User');
    }

    init();
   }


  const fetchAllSelfJobs = async () => {

    const allJobs = await getAllSelfJobsByUser(getCurrentUser());
    console.log("All Jobs : ", allJobs);
    if (allJobs) {
      // const currentUserJobs = allJobs.filter((job) => job.performer === getCurrentUser())
      setAllSelfJobs(allJobs);
      return allJobs;
    }


  }


  /**
   * Updates the asset information based on the given asset string identifier.
   * This function fetches asset details and pending job details from APIs.
   * If valid asset details are found, it updates the current asset information.
   * If there are pending jobs, it opens a dialog to display them.
   * If multiple logbooks are associated with the asset, it prepares a dropdown list for selection.
   * Handles errors by setting appropriate error states and displaying snackbar messages.
   *
   * @param {string} assetStr - The identifier string of the asset to update.
   */
  const updateAsset = async (assetStr) => {
    //setAssetIdScan(e.target.value);
    try {
      // console.log("updateAsset() called ");
      setClearVisible(true);
      const scanStr = assetStr;
      // console.log("Updated Scan Asset Id : ", scanStr);
      if (scanStr === "") return;

      //call for API
      const scanStrAssetDetails = await assetInfoByAssetIdApi(scanStr);
      // console.log("Selected Asset Details", scanStrAssetDetails);
      if (scanStrAssetDetails) {
        setCurrentAssetInfo(scanStrAssetDetails);
      }
      const pendingJobDetails = await getpendingJobDetails(scanStr);
      const logbookFormForAsset= await getActiveLogbooksByAssetId(scanStr,getTenantID());

      

      const activeLogbookIdsForAsset=logbookFormForAsset?.map(logbook=>logbook.formID)

      console.log('LogbookFormForAsset response : ',logbookFormForAsset)


      console.log('Active Logbooks for the given asset : ',logbookFormForAsset)
      // console.log("Pending Job Details : ", pendingJobDetails);

      setAssetIdScanError(false);

      if (pendingJobDetails && pendingJobDetails.jobid) {
        //This is the moment the pending job Modal will be shown
        setPendingJobDetailsForSelectedAsset(pendingJobDetails);
        setOpenPendingJobDlg(true);
      } else if (
        // scanStrAssetDetails.logbook &&
        // scanStrAssetDetails.logbook.length > 0
        activeLogbookIdsForAsset &&
        activeLogbookIdsForAsset.length > 0
      ) {
        console.log('Else If entered')
        //setOpenMultipleLogbookModal(true)
        if (activeLogbookIdsForAsset.length === 1) {
          // console.log("LogbookList Size is 1");
          const currentLogbook = activeLogbookIdsForAsset[0]; // It is returning the formId which is an integer(formID)
          // console.log("Current Logbook : ", currentLogbook);
          if (allActiveFormsMap.get(currentLogbook)) {
            // console.log(
            //   "Form Id found in map : ",
            //   allActiveFormsMap.get(currentLogbook)
            // );
            setCurrentLogbookInfo(allActiveFormsMap.get(currentLogbook)); //* if the logbooks list length is 1 then the logbook will be automatically populated
          }
        } else {
          //* otherwise length > 1
          // console.log("Logbook List size is greater than 1");
          // console.log("Currently Active Forms Map : ", allActiveFormsMap);
          // console.log(
          //   "Logbook List of the selected Asset : ",
          //   scanStrAssetDetails.logbook
          // );

          const dropdownList = [];
          activeLogbookIdsForAsset.forEach((formId) => {
            if (allActiveFormsMap.get(formId)) {
              dropdownList.push(
                // new formConstructor(
                //   allActiveFormsMap.get(formId)?.formName,
                //   formId
                // )
                allActiveFormsMap.get(formId) //* pushing the active form
              );
            }
          });
          // console.log(
          //   "New Dropdown list for Multiple Logbooks => ",
          //   dropdownList
          // );
          // console.log(allActiveFormsMap);
          // console.log("****",allActiveFormsMap.get("86"))
          setMultipleLogbookDropdown(dropdownList);
          setOpenMultipleLogbookModal(true);
        }
      } else {
        setAssetIdScanError(true);
        setSnackbarMessage("No Active Logbook found for Selected Asset");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (e) {
      setAssetIdScanError(true);
      setSnackbarMessage("Error !");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  //This are the approvers where the logbook usergroups matches with the approver groups according to a given logbook
//  const fn_filterLogbookApprovers =(formDetails)=> approverList.filter((approver) => {
//   const userGroups = approver.group.map(
//     (data) => data.groupID.toLowerCase().trim()
//   );

//   return formDetails.userGroup
//     .split(",")
//     .map(g => g.toLowerCase().trim())
//     .some(g => userGroups.includes(g));
// }); 

  // const handleAssetIdChange = debounce(updateAsset, 800); // creating a debouncing effect of 800ms

  /**
   * Handles the main logbook selection from the dropdown and fetches the
   * pending jobs for the selected logbook. If a pending job exists, it
   * navigates to the pending jobs dialog. If no pending job exists, it
   * sets the current logbook info and returns.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} e The main logbook
   * selection event
   */
  const handleMainLogbookChange = async (e) => {
    // console.log("handleMainLogbookChange() called");
    setAssetIdScan("");
    setCurrentAssetInfo({});
    setCurrentLogbookInfo({});

    const currentLogbookKey = e.target.value;
    setMainLogbookSelection(currentLogbookKey);
    // const formDetails = allActiveFormsMap.get(currentLogbookKey);
    const formDetails = currentLogbookKey;
    // console.log("formDetails", formDetails);

    const currentUser = getCurrentUser();
    const pendingLogBookFormDetails = await getPendingJobInfoforLogbook(
      //* getting info if there is any pending logbook
      formDetails.formName,
      formDetails.formID,
      formDetails.versionNumber,
      currentUser
    );
    if (!pendingLogBookFormDetails) {
      setSnackbarMessage("Error !");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    // console.log("pendingLogBookFormDetails : ", pendingLogBookFormDetails);
    if (pendingLogBookFormDetails && pendingLogBookFormDetails.jobid && !reviewerStatus.includes(pendingLogBookFormDetails.status.toLowerCase())) {
      // console.log("Pending Form Details : ", pendingLogBookFormDetails);
      setPendingJobDetailsForSelectedAsset(pendingLogBookFormDetails);
      setOpenPendingJobDlg(true);
      return;
    }

    if (formDetails) {
      setCurrentLogbookInfo(formDetails);
      const jobCountForLogbook=getTodaysFilteredSelfJobs(allSelfJobs,formDetails).length
      // console.log("Filtered SelfJobs For Current Form : ",allSelfJobs.filter(job=>job.logbookid===formDetails.formID))
      setCurrentAutoJobName(`${automatedJobName} ${formDetails.formName} - ${jobCountForLogbook+1}`)  
    }
   

    // console.log("Logbook Approvers : ", logbookApprovers);
    const approverList=filterActiveApprovers(allUsersData);
    const filteredApprovers=await fn_filterLogbookApprovers(formDetails,approverList);
    console.log('Filtered Approvers : ',filteredApprovers)
    setApproverList(filteredApprovers);


     const formGroupIds = formDetails.userGroup
        .split(",")
        // .map(g => g.toLowerCase().trim());
    
      const allGroupDetails = await getAllGroupDetails();
    
      let leader =''
    
      if(formGroupIds.length === 1)
      {
    
       leader = allGroupDetails.find(group =>
        formGroupIds.includes(group.groupID)
      )?.leader;
      console.log('Leader Found : ',leader)
      setCurrentLogbookApprover(leader??'');
      setBooleanSelfApproved(false);
    }


     const isLogbookLeaderPresent=filteredApprovers.some(approver=>approver.userID===leader)//Checking if the approver is present with the current logged in user
    if(!isLogbookLeaderPresent)  
      {
        setBooleanSelfApproved(false); setCurrentLogbookApprover('');
      }

    
      
    // else setCurrentLogbookApprover(getCurrentUser())

    //While changing the logbook have to check that
    //whether that particular user has already started any job previously with respect to that logbook
    //then it will automatically navigate to the logbook with the required data...
    //Starting new will approve the previous job and will initiate a new job whole new
  }

  /**
   * This function is used to fetch all users and filter out the active users
   * Then set the active users in the component state.
   * Also, it fetches the users who have the role of job reviewer and set them
   * in the approverList state.
   * Finally, it sets the current logbook approver based on the current user logged in
   * @returns {Promise<void>}
   */

  /**
   * This function is used to fetch all users and filter out the active users
   * Then set the active users in the component state.
   * Also, it fetches the users who have the role of job reviewer and set them
   * in the approverList state.
   * Finally, it sets the current logbook approver based on the current user logged in
   * @returns {Promise<void>}
   */
  async function getAllUsers() {
    // console.log("getAllApprover()");
    let userList = await fetchAllUsers();
    // console.log("User List from API : ", userList);
    let activeUsers;
    if (userList) {
       activeUsers = userList.filter((user) => user.active);
      setAllUsersData(activeUsers);
    }

    if (activeUsers) {
      // let approverList = [];
      // activeUsers
      //   // .filter((user) => user.active)
      //   .forEach((user) => {
      //     if (
      //       user.allotedPages.some(
      //         (data) => data.page.toLowerCase() === JOBREVIEWER_PAGEID
      //       )
      //     )
      //       approverList.push(user);
      //   });
      const filteredApprovers=filterActiveApprovers(activeUsers);
      // console.log("Current Approver List : ", approverList);
      setApproverList(filteredApprovers);
    }

    // setCurrentLogbookApprover("info@greenwave.co.in"); //Later on it wil change dynamically
    const currentUser = getCurrentUser();
    setCurrentLogbookApprover(
      // decryptTokenId(localStorage.getItem(env_userID))
      currentUser
    );
    // setCurrentAutoJobNAme(`Auto job created by ${decryptTokenId(localStorage.getItem("username"))}`)
  }


 const filterActiveApprovers =(activeUsers)=>{
  const approverList = [];
        activeUsers
        // .filter((user) => user.active)
        .forEach((user) => {
          if (
            user.allotedPages.some(
              (data) => data.page.toLowerCase() === JOBREVIEWER_PAGEID
            )
          )
            approverList.push(user);
        });
      // console.log("Current Approver List : ", approverList);
      return approverList;
 }

  /**
   * Handles the event of the self approve checkbox being changed.
   * If the checkbox is checked, the current user is set as the logbook approver.
   * If the checkbox is unchecked, the logbook approver is set to an empty string.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event of the self approve checkbox.
   */
  const handleSelfApproverChange = (event) => {
    // console.log("handleSelfApproverChange() called ", event.target.checked);
    const checked = event.target.checked;
    setBooleanSelfApproved(event.target.checked);
    if (checked) {
      // setCurrentLogbookApprover("info@greenwave.co.in"); //Later on it will change dynamically
      const currentUser = getCurrentUser();

      console.log('Current Approver List : ',approverList)

      if( !approverList.some(approver=>approver.userID===currentUser)){
        setSnackbarMessage("Current user is not in the Approver list");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
      setCurrentLogbookApprover(
        // decryptTokenId(localStorage.getItem(env_userID))
        currentUser
      );
      // setCurrentAutoJobNAme(`Auto job created by ${decryptTokenId(localStorage.getItem("username"))}`)
    } else {
      setCurrentLogbookApprover("");
    }
  };

  /**
   * Handles the event of the 'Select Asset' button being clicked. It clears the current
   * asset id and logbook selection, and opens the select asset modal dialog.
   */
  const handleSelectAssetModal = () => {
    // console.log("handleSelectAssetModal() called ");
    setAssetIdScan("");
    setMainLogbookSelection("");
    setOpenSelectAssetModal(true);
  };


  const findLastCreatedJob = (todayAutoJobsForCurrentLogbook) => {
    return todayAutoJobsForCurrentLogbook.reduce(
      (latestJob, job) =>
        job.jobname.trim().toLowerCase() ===
          currentAutoJobName.trim().toLowerCase() &&
        (!latestJob ||
          dayjs(job.activitystarttime).isAfter(
            dayjs(latestJob.activitystarttime)
          ))
          ? job
          : latestJob,
      null
    );
  };

  /**
   * Handles the event of the 'Proceed' button being clicked in the self job creation wizard.
   * It creates an auto job object with the given details, creates a new auto job in the database,
   * fetches the latest transaction data for the job and sets the local variables for the self job.
   * If the job creation is successful, it navigates to the logbook form page with the required parameters.
   * If the job creation fails, it displays an error message.
   */
  const handleFinalProceedClick = async () => {
    // const jobId = state.jobId;
    // const activityId = state.activityId;
    // const userID = state.userID;
    // const formName = state.formName;
    // const versionNumber = state.versionNumber;
    // const transactionData = state.transactionData;

    // console.log("handleFinalProceedClick() called");
    const generateJobId = "AJ" + dayjs().format("YYYYMMDDTHHmmssSSS");
    const generateActivityId = "AA" + dayjs().format("YYYYMMDDTHHmmssSSS");
    // console.log("Generated JobId : ", generateJobId);
    // console.log("Generated ActivityId : ", generateActivityId);
    const newAutoJob = createAutoJob(
      generateJobId,
      generateActivityId,
      // "info@greenwave.co.in", //Later on it will be changed dynamically ....
      // decryptTokenId(localStorage.getItem("username")),//Auto Job created by <> will be changed
      currentAutoJobName,
      currentAssetInfo.id,
      currentAssetInfo.assetName,
      currentLogbookInfo.formID,
      currentLogbookInfo.formName,
      currentLogbookInfo.versionNumber,
      // "info@greenwave.co.in",
      // decryptTokenId(localStorage.getItem(env_userID)),
      getCurrentUser(),
      currentLogbookApprover,
      "Started"
    );

    // console.log("New Auto Job Object : ", newAutoJob);
    //*fetch the lastest SelfJobs for the current user,this is to ensure the running number
    const autoJobsForCurrentUser = await fetchAllSelfJobs();
    if (autoJobsForCurrentUser) {
      const todayAutoJobsForCurrentLogbook = getTodaysFilteredSelfJobs(
        autoJobsForCurrentUser,
        {
          formID: currentLogbookInfo.formID,
          formName: currentLogbookInfo.formName,
        }
      );
      if (todayAutoJobsForCurrentLogbook) {
      
       const  jobFound=findLastCreatedJob(todayAutoJobsForCurrentLogbook);
       if (jobFound) {
        console.log("Last Job Found:", jobFound);
        const lastJobName = jobFound.jobname;
        console.log("Last JobName:", lastJobName);
      
        // Replace last number if it exists, otherwise add "- 1"
        const updatedJobName = lastJobName.replace(/(\d+)$/, (match) => parseInt(match, 10) + 1) || `${lastJobName} - 1`;
      
        newAutoJob.jobname = updatedJobName;
        console.log("New Auto Job Name:", newAutoJob.jobname);
      }
      
      }
    }
    const updatedJob={...newAutoJob};
    updatedJob.activitystarttime=new Date().toISOString();
    console.log('Updated Job : ',updatedJob)
    const success = await createNewAutoJob(updatedJob);
    // const currentTransactionData = await getAllTransactions(
    //   generateJobId,
    //   generateActivityId,
    //   currentLogbookInfo.formName,
    //   currentLogbookInfo.versionNumber
    // );
    // console.log("Current Transaction Data from API : ", currentTransactionData);
    // if (!currentTransactionData) {
    //   // console.error("Transaction Data fetch failed !");
    //   setSnackbarMessage("Error !");
    //   setSnackbarSeverity("error");
    //   setSnackbarOpen(true);
    //   return;
    // }
    if (success) {
      //* if the autojob is created successfully then setting the values for the logbook accordingly
      // localStorage.setItem("jobId", generateJobId);
      // localStorage.setItem("activityId", generateActivityId);
      // localStorage.setItem("formName", currentLogbookInfo.formName);
      // localStorage.setItem("versionNumber", currentLogbookInfo.versionNumber);
      //Setting Local Variables
      console.log('Current User : ',currentUser)
     const logbook_lv= getLocalVariablesForSelfJob(
        generateJobId,
        generateActivityId,
        currentAutoJobName,
        currentLogbookApprover,
        // decryptTokenId(localStorage.getItem(env_userID)),
        getCurrentUser(),
        "Started",
        "",
        currentLogbookInfo.formName,
        currentLogbookInfo.versionNumber,
        formatDatetime(new Date()),
        null,
        null,
        getTenantID(),
        currentUser?.userName ?? '',
        currentUser?.phone ?? '',
        currentUser?.department?.deptName?? '',

      );
      logbook_lv.formId = currentLogbookInfo.formID; // Adding formId to the logbook local variables
      

      console.log('Local Variables set for Self Job : ',logbook_lv);
      navigate(
        iSGuestUser? GUEST_LOGBOOK_URL : LOGBOOK_URL
          , {
          state: logbook_lv,
        }
      );
    } else {
      setSnackbarMessage("Error initializing Autojob ! ");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  

  console.log('Current Final Logbook Info : ',currentLogbookInfo)
  
  const updatedJobs = allSelfJobs.filter(job =>
  !reviewerStatus.includes(job?.status?.toLowerCase())
);
console.log('Updated Jobs : ',updatedJobs)
  return (
    <div>
      {openPendingJobDlg && (
        <PendingJobsModal
          openPendingJobDlg={openPendingJobDlg}
          setOpenPendingJobDlg={setOpenPendingJobDlg}
          pendingJobDetailsForSelectedAsset={pendingJobDetailsForSelectedAsset}
          snackbarSeverity={snackbarSeverity}
          setSnackbarSeverity={setSnackbarSeverity}
          snackbarOpen={snackbarOpen}
          setSnackbarOpen={setSnackbarOpen}
          snackbarMessage={snackbarMessage}
          setSnackbarMessage={setSnackbarMessage}
          currentLogbookApprover={currentLogbookApprover}
          currentAutoJobName={currentAutoJobName}
          setMainLogbookSelection={setMainLogbookSelection}
          setCurrentAssetInfo={setCurrentAssetInfo}
          setCurrentLogbookInfo={setCurrentAssetInfo}
          setCurrentAutoJobName={setCurrentAutoJobName}
          currentUser={currentUser}
          allSelfJobs={allSelfJobs}
          setAllSelfJobs={setAllSelfJobs}
        />
      )}
      <MultipleLogbookModal
        openMultipleLogbookModal={openMultipleLogbookModal}
        setOpenMultipleLogbookModal={setOpenMultipleLogbookModal}
        currentLogbookInfo={currentLogbookInfo}
        setCurrentLogbookInfo={setCurrentLogbookInfo}
        multipleLogbooksDropdown={multipleLogbooksDropdown}
        selectedLogbook={selectedLogbook}
        setSelectedLogbook={setSelectedLogbook}
        allActiveFormsMap={allActiveFormsMap}
        setPendingJobDetailsForSelectedAsset={
          setPendingJobDetailsForSelectedAsset
        }
        setOpenPendingJobDlg={setOpenPendingJobDlg}
        setCurrentAutoJobName={setCurrentAutoJobName}
        allSelfJobs={allSelfJobs}
         setCurrentLogbookApprover={setCurrentLogbookApprover}
         setApproverList={setApproverList}
        fn_filterLogbookApprovers={fn_filterLogbookApprovers}
        approverList={approverList}
        allUsersData={allUsersData}
        filterActiveApprovers = {filterActiveApprovers}
      />
      <SelectAssetModal
        openSelectAssetModal={openSelectAssetModal}
        setOpenSelectAssetModal={setOpenSelectAssetModal}
        assetGroupList={assetGroupList}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
        setCurrentAssetInfo={setCurrentAssetInfo}
        currentAssetInfo={currentAssetInfo}
        currentLogbookInfo={currentLogbookInfo}
        setCurrentLogbookInfo={setCurrentLogbookInfo}
        setOpenPendingJobDlg={setOpenPendingJobDlg}
        pendingJobDetailsForSelectedAsset={pendingJobDetailsForSelectedAsset}
        setPendingJobDetailsForSelectedAsset={
          setPendingJobDetailsForSelectedAsset
        }
        allActiveFormsMap={allActiveFormsMap}
        setCurrentAutoJobName={setCurrentAutoJobName}
        allSelfJobs={allSelfJobs}
        setApproverList={setApproverList}
        fn_filterLogbookApprovers={fn_filterLogbookApprovers}
        setCurrentLogbookApprover={setCurrentLogbookApprover}
        approverList={approverList}
      />
      <Container maxWidth="lg">
        <Grid container spacing={2} >
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <Card
              sx={{
                //width: { xs: "100%", sm: "90%", md: "27rem" },
                // width:"100%",
                height: "100%",
                //marginLeft: "45px",
                borderRadius: 2,
                boxShadow: 1,
              }}
              //elevation={2}
            >
              <div style={{ padding: "1rem 1rem 0.6rem 1rem" }}>
                <div className="flex align-items-center gap-1">
                  <QrCode2OutlinedIcon sx={{ color: "#4f46e5" }} />
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontSize: "0.85rem",
                      // padding: "0.5rem 0",
                      fontWeight: 700,
                      color: "#1e293b",
                    }}
                  >
                   Scan Barcode

                  </Typography>
                </div>

                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: "#475569",
                  }}
                >
                 Select your preferred method to identify assets
                </Typography>
              </div>
              
             
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CardMedia
                    sx={{
                      height: 280,
                      width: 280,
                      objectFit: "contain",
                      marginLeft: "auto",
                      marginRight: "auto",
                      marginTop: "1.2rem",
                    }}
                    image={"/scan.jpg"}
                    title="scanner"
                  />
                </Grid>
                <Grid item xs={12}>
                  <CardContent sx={{ textAlign: "left", margin: "0 1rem" }}>
                    <Stack direction="column" spacing={2}>
                      <div
                          className="mb-2"
                          style={{ fontWeight: "500", fontSize: "0.85rem" }}
                        >
                         Enter Asset ID
                        </div>
                      <TextField
                      style={{marginTop:0}}
                        variant="outlined"
                        label="Scan or type asset ID..."
                        size="small"
                        value={assetIdScan}
                        InputProps={{
                          endAdornment: clearVisible && (
                            <InputAdornment position="end">
                              <Tooltip title="Clear">
                                <IconButton
                                  aria-label="clear search"
                                  onClick={() => {
                                    setAssetIdScan("");
                                    setAssetIdScanError(false);
                                  }}
                                >
                                  <DisabledByDefaultRoundedIcon />
                                </IconButton>
                              </Tooltip>
                            </InputAdornment>
                          ),
                        }}
                        error={assetIdScanError}
                        onChange={(e) => {
                          setAssetIdScan(e.target.value);
                          setMainLogbookSelection("");
                          setCurrentLogbookInfo({});
                        }}
                      ></TextField>
                      <Divider align="center">
                        <span className="p-tag">Or Select Workspace</span>
                      </Divider>

                        <div
                          className="mb-2"
                          style={{ fontWeight: "500", fontSize: "0.85rem" }}
                        >
                         Select Workspace
                        </div>
                      <PrimeReactDropdown
                        value={mainLogbookSelection}
                        style={{marginTop:0}}
                        onChange={(e) => handleMainLogbookChange(e)}
                        placeholder={
                          !allActiveFormsMap ? "Loading..." : "Choose workspace"
                        }
                        filter
                        loading={!allActiveFormsMap}
                        optionLabel="formName"
                        options={Array.from(allActiveFormsMap?.values() ?? [])}
                        clearIcon
                      />
                      <Divider align="center">
                        <span className="p-tag">Or Select An Asset</span>
                      </Divider>
                      <Chip
                        label="Browse Assets"
                        variant="filled"
                        sx={{ boxShadow: 0 }}
                        color="primary"
                        onClick={handleSelectAssetModal}
                        avatar={
                          <Box
                            component="span"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              // backgroundColor: "#607d8b", // Background color for the avatar area
                              borderRadius: "50%", // Circular avatar
                              // width: "32px", // Width of the avatar
                              // height: "32px", // Height of the avatar
                            }}
                          >
                            <i
                              className="pi pi-sitemap"
                              style={{
                                fontSize: "1rem", // Icon size
                                color: "#ffffff", // Icon color
                              }}
                            ></i>
                          </Box>
                        }
                      />
                    </Stack>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <div style={{ padding: "1rem 1rem 0.6rem 1rem" }}>
                <div className="flex align-items-center gap-1">
                  <ApartmentIcon sx={{ color: "#4f46e5" }} />
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontSize: "0.85rem",
                      // padding: "0.5rem 0",
                      fontWeight: 700,
                      color: "#1e293b",
                    }}
                  >
                    Selected Workspace Info
                  </Typography>
                </div>

                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: "#475569",
                  }}
                >
                  Review and configure asset details
                </Typography>
              </div>

              <CardContent
                sx={{
                  marginLeft: "0.9rem",
                  marginTop: "0.2rem",
                  marginRight: "0.9rem",
                  padding: "0",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <div className="cardBody">
                      <div
                        className="flex align-items-center gap-2"
                        style={{ marginBottom: "0.8rem" }}
                      >
                        <ArchiveOutlinedIcon
                          sx={{
                            color: "#4f46e5",
                            background: "#dbeafe",
                            padding: ".2rem",
                            borderRadius: "0.3rem",
                          }}
                        />
                        <Typography
                          sx={{
                            textAlign: "center",
                            fontSize: "0.8rem",
                            // padding: "0.5rem 0",
                            fontWeight: 600,
                            color: "#334155",
                          }}
                        >
                          Asset Information
                        </Typography>
                      </div>

                      {logbookAssetPropsName.map((element, index) => (
                        <Fragment key={index}>
                          <Stack
                            direction="row"
                            divider={
                              <Divider orientation="vertical" flexItem />
                            }
                            spacing={2}
                            sx={{
                              background: "white",
                              marginBottom: "0.5rem",
                              borderRadius: "0.5rem",
                              padding: "0.5rem 0.5rem",
                            }}
                          >
                            <Stack
                              direction="column"
                              spacing={4}
                              width={"120px"}
                            >
                              <div
                                style={{
                                  fontWeight: "500",
                                  fontSize: "0.85rem",
                                  // marginBottom: "0.5rem",
                                }}
                              >
                                {element}
                              </div>
                            </Stack>
                            <Stack direction="column" spacing={4}>
                              <div style={{ fontSize: "0.85rem" }}>
                                {
                                  currentAssetInfo[
                                    logbookAssetPropsValues[index]
                                  ]
                                }
                              </div>
                            </Stack>
                          </Stack>
                        </Fragment>
                      ))}
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div className="cardBody">
                      <div
                        className="flex align-items-center gap-2"
                        style={{ marginBottom: "0.8rem" }}
                      >
                        <LayersOutlinedIcon
                          sx={{
                            color: "#4f46e5",
                            background: "#dbeafe",
                            padding: ".2rem",
                            borderRadius: "0.3rem",
                          }}
                        />
                        <Typography
                          sx={{
                            textAlign: "center",
                            fontSize: "0.8rem",
                            // padding: "0.5rem 0",
                            fontWeight: 600,
                            color: "#334155",
                          }}
                        >
                          Workspace Details
                        </Typography>
                      </div>

                      {logBookProps.map((element, index) => (
                        <Fragment key={index}>
                          <Stack
                            direction="row"
                            divider={
                              <Divider orientation="vertical" flexItem />
                            }
                            spacing={2}
                            sx={{
                              background: "white",
                              marginBottom: "0.5rem",
                              borderRadius: "0.5rem",
                              padding: "0.5rem 0.5rem",
                            }}
                          >
                            <Stack
                              direction="column"
                              spacing={4}
                              width={"120px"}
                            >
                              <div
                                style={{
                                  fontWeight: "500",
                                  fontSize: "0.85rem",
                                  //marginBottom: "0.5rem",
                                }}
                              >
                                {element}
                              </div>
                            </Stack>
                            <Stack direction="column" spacing={4}>
                              <div
                                style={{
                                  marginTop: "0px",
                                  fontSize: "0.85rem",
                                }}
                              >
                                {currentLogbookInfo[
                                  logBookPropsValue[index]
                                ] === null ||
                                currentLogbookInfo[logBookPropsValue[index]] ===
                                  undefined ? (
                                  ""
                                ) : (
                                  <div
                                    style={{
                                      fontSize: "0.85rem",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      maxWidth: "121px",
                                    }}
                                  >
                                    {
                                      currentLogbookInfo[
                                        logBookPropsValue[index]
                                      ]
                                    }
                                  </div>
                                )}
                              </div>
                            </Stack>
                          </Stack>
                        </Fragment>
                      ))}
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div className="cardBodyGreen">
                      <div
                        className="flex align-items-center gap-2"
                        style={{ marginBottom: "0.8rem" }}
                      >
                        <TaskAltOutlinedIcon
                          sx={{
                            color: "#07af3f",
                            background: "#e1fedbff",
                            padding: ".2rem",
                            borderRadius: "0.3rem",
                          }}
                        />
                        <Typography
                          sx={{
                            textAlign: "center",
                            fontSize: "0.8rem",
                            // padding: "0.5rem 0",
                            fontWeight: 600,
                            color: "#334155",
                          }}
                        >
                          Approver Info
                        </Typography>
                      </div>
                      <div>
                        <div
                          className="mb-2"
                          style={{ fontWeight: "500", fontSize: "0.85rem" }}
                        >
                          Select Approver
                        </div>
                        <Dropdown
                          value={currentLogbookApprover}
                          options={approverList}
                          optionValue="userID"
                          onChange={(e) => {
                            setCurrentLogbookApprover(e.value);
                            // setCurrentAutoJobNAme(`Auto job created by ${e.target.value}`);
                          }}
                          className="selfJobDropdownStyle"
                          placeholder="Select Approver"
                          style={{
                            // height: "30px",
                            width: isMobile ? "6rem" : "100%",
                          }}
                          disabled={booleanSelfApproved}
                          itemTemplate={(option) => (
                            <div>
                              <span style={{ fontWeight: "bold" }}>
                                {option.userName}
                              </span>
                              {"( " + option.userID + " )"}
                            </div>
                          )}
                          valueTemplate={(option) =>
                            option ? (
                              <div className="flex align-items-center">
                                <span style={{ fontWeight: "bold" }}>
                                  {option.userName}
                                </span>
                                {"( " + option.userID + " )"}
                              </div>
                            ) : (
                              <span>Select Approver</span> // Display when no option is selected
                            )
                          }
                          optionLabel="userName"
                          filter
                          // optionLabel={"userName"}
                          clearIcon
                        />
                      </div>
                      <div
                        className="selfJob_CheckBox"
                        style={{ margin: "0.5rem 0" }}
                      >
                        <Stack
                          direction="row"
                          divider={<Divider orientation="vertical" flexItem />}
                          spacing={2}
                          sx={{
                            background: "white",
                            //marginBottom: "0.5rem",
                            borderRadius: "0.5rem",
                            padding: "0.5rem 0.5rem",
                          }}
                        >
                          <Stack
                            direction="column"
                            spacing={4}
                            width={"120px"}
                            sx={{ padding: 0, justifyContent: "center" }}
                          >
                            <div
                              style={{ fontWeight: "500", fontSize: "0.85rem" }}
                            >
                              Self Approved
                            </div>
                          </Stack>
                          <Stack direction="column" spacing={4}>
                            <div style={{ marginTop: "0px" }}>
                              <Checkbox
                                sx={{ padding: 0 }}
                                checked={booleanSelfApproved}
                                onChange={(event) =>
                                  handleSelfApproverChange(event)
                                }
                                inputProps={{ "aria-label": "controlled" }}
                              />
                            </div>
                          </Stack>
                        </Stack>
                      </div>

                      <div className="jobNameContainer">
                        <div
                          style={{
                            fontWeight: "500",
                            fontSize: "0.85rem",
                          }}
                        >
                          Auto Job Name
                        </div>

                        <div style={{ marginTop: "0px" }}>
                          <TextField
                            disabled={
                              !(
                                currentLogbookApprover?.length > 0 &&
                                currentLogbookInfo?.formID
                              )
                            }
                            size="small"
                            style={{ width: isMobile ? "6rem" : "100%" }}
                            value={currentAutoJobName}
                            className="InputSection"
                            //label="Job Name"
                            variant="outlined"
                            onChange={(e) =>
                              setCurrentAutoJobName(e.target.value)
                            }
                            InputLabelProps={{
                              shrink: false,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </CardContent>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    sx={{ marginBottom: "0.5rem" }}
                    startIcon={<SendIcon />}
                    onClick={handleFinalProceedClick}
                    disabled={
                      !(
                        currentLogbookApprover?.length > 0 &&
                        currentLogbookInfo?.formID
                      )
                    }
                  >
                    Proceed
                  </Button>
                }
                {/* {currentLogbookApprover+'Hello'} */}
              </div>
             
            </Card>
            
          </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <JobsTable
                allSelfJobs={updatedJobs}
                currentUser={currentUser}
                setAllSelfJobs={setAllSelfJobs}
                setSnackbarMessage={setSnackbarMessage}
                setSnackbarSeverity={setSnackbarSeverity} 
                setSnackbarOpen={setSnackbarOpen} 
                 setOpenPendingJobDlg={setOpenPendingJobDlg} 
                 setMainLogbookSelection={setMainLogbookSelection}
                />
            </Grid>
         
        </Grid>
      </Container>

      <SnackbarComponent
        openPopup={snackbarOpen}
        setOpenPopup={setSnackbarOpen}
        dialogMessage={snackbarMessage}
        snackbarSeverity={snackbarSeverity}
      />
    </div>
  );
}
