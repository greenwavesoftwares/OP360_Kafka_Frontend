import HomeIcon from "@mui/icons-material/Home"; // Importing Home icon from Material-UI icons library for UI navigation or home button.
import { useMemo } from "react";
import {
  Avatar,
  Badge,
  ButtonGroup,
  Chip, // Importing Chip component for displaying small information or tags.
  CircularProgress, // Importing CircularProgress component for showing loading indicators.
  Divider, Fab, // Importing Divider component for adding visual breaks between sections.
  Grid, // Importing Grid component for grid-based layouts.
  IconButton, // Importing IconButton component for clickable icons.
  TextField, // Importing TextField component for input fields.
  Tooltip, // Importing Tooltip component for adding hover tooltips to elements.
  Typography, // Importing Typography component for text styling.
  useMediaQuery, // Importing useMediaQuery hook for responsive design and media queries.
  useTheme, // Importing useTheme hook for accessing theme settings.
} from "@mui/material"; // Importing these components from Material-UI's core library.
import "primeicons/primeicons.css"; // Importing PrimeIcons CSS for using PrimeReact icons in the application.
import { Card as PrimeCard } from "primereact/card"; // Importing PrimeReact's Card component, renamed as PrimeCard to avoid conflicts with Bootstrap's Card.
import { Dropdown } from "primereact/dropdown"; // Importing Dropdown component from PrimeReact for creating dropdowns in forms or UI elements.
import "primereact/resources/primereact.min.css"; // Importing the base PrimeReact CSS styles for using its components.
import "primereact/resources/themes/saga-blue/theme.css"; // Importing the Saga Blue theme for PrimeReact to style the components.
import { Stepper } from "primereact/stepper"; // Importing Stepper component from PrimeReact to create step-by-step navigation or process flow.
import { StepperPanel } from "primereact/stepperpanel"; // Importing StepperPanel from PrimeReact to define individual steps within the Stepper.
import React, { useCallback, useEffect, useRef, useState } from "react"; // Importing React and React hooks (useCallback, useEffect, useRef, useState) for managing component states, lifecycle, and callbacks.
import { Card, Container } from "react-bootstrap"; // Importing Card and Container components from React Bootstrap for layout and card-based UI elements.

import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd"; // Importing PlaylistAddIcon from Material-UI icons for adding items to a playlist or similar actions.
import { TreeItem } from "@mui/x-tree-view"; // Importing TreeItem component from Material-UI's x-tree-view for creating hierarchical tree views.
import { Button } from "primereact/button"; // Importing Button component from PrimeReact for interactive buttons.
import { Column } from "primereact/column"; // Importing Column component from PrimeReact for defining table columns.
import { DataTable } from "primereact/datatable"; // Importing DataTable component from PrimeReact for creating data tables.
import { Dialog } from "primereact/dialog"; // Importing Dialog component from PrimeReact for modal or popup dialogs.
import { InputNumber } from "primereact/inputnumber"; // Importing InputNumber component from PrimeReact for numeric input fields.
import { InputText } from "primereact/inputtext"; // Importing InputText component from PrimeReact for text input fields.
import { Sidebar } from "primereact/sidebar"; // Importing Sidebar component from PrimeReact for creating side navigation or panels.
import { TabPanel, TabView } from "primereact/tabview"; // Importing TabPanel and TabView components from PrimeReact for tabbed interfaces.
import { ToggleButton } from "primereact/togglebutton"; // Importing ToggleButton component from PrimeReact for toggle buttons.
import InfoIcon from "@mui/icons-material/Info";
import ReactFlow, { // Importing ReactFlow for visualizing flow diagrams with nodes and edges.
  Background, // Importing Background component from ReactFlow for grid or background visuals.
  Controls, // Importing Controls component from ReactFlow for zoom and pan controls.
  MiniMap, // Importing MiniMap component from ReactFlow to provide an overview of the flow chart.
  addEdge, // Importing addEdge function from ReactFlow to add edges between nodes.
  reconnectEdge, // Importing reconnectEdge function from ReactFlow to reconnect existing edges.
  useEdgesState, // Importing useEdgesState hook from ReactFlow to manage edge state.
  useNodesState, // Importing useNodesState hook from ReactFlow to manage node state.
} from "reactflow"; // Importing all necessary components from the ReactFlow library.

import CustomDialog from "../components/shared/dialog/dialog.component"; // Importing a custom dialog component for shared use across the application.
import SnackbarComponent from "../components/shared/snackbar/customSnackbar"; // Importing a custom Snackbar component for showing notifications.
import CustomTreeView from "../components/shared/tree/tree.component"; // Importing a custom tree view component for hierarchical data visualization.

import { decryptTokenId, extendTokenExpiration } from "../helper/AuthService"; // Importing helper functions for decrypting token IDs and extending token expiration from an AuthService helper file.
import {
  // Importing multiple API functions related to Logbook asset management.
  getAssetGroupTree, // Function to fetch the asset group tree structure.
  getAssetGroupsList, // Function to fetch the list of asset groups.
} from "../Logbook Asset/LogbookAssetApi"; // Importing asset group-related API functions from the Logbook asset API.

import { getAllActiveFormInfo } from "../Logbook/LogbookApi"; // Importing a function to fetch all active form information from the Logbook API.

import {
  // Importing various task-related API functions.
  getActivityConnections, // Function to get activity connections.
  getAllTaskByTenantId, // Function to get all tasks based on tenant ID.
  handleSaveActivityConnections, // Function to save activity connections.
  handleSaveTask, // Function to save a task.
} from "../Task/TaskAPI" // Importing task-related API functions from the TaskAPI module.

import "../Task/taskCreation.css"; // Importing a CSS file for task creation component styling.
// import TaskMaster from "./TaskMasterTest"; // Importing TaskMaster component from the TaskMasterTest module.
import { makeStyles } from "@mui/styles"; // Importing makeStyles from Material-UI's styles for custom component styling.
import "primeflex/primeflex.css"; // Importing PrimeFlex CSS for responsive design and layout.
import "primeicons/primeicons.css"; // Importing PrimeIcons CSS for using icons from PrimeReact.
import { Fieldset } from "primereact/fieldset"; // Importing Fieldset component from PrimeReact for grouping related fields.
import "primereact/resources/primereact.min.css"; // Importing PrimeReact's base CSS file.
import "primereact/resources/themes/saga-blue/theme.css"; // Importing Saga Blue theme for PrimeReact components.

import { calculateTotalDuration, createJobDetails, fetchCurrentActivityList, formatDatetime, generateToMailUsers } from "../JobAssign/helper"; // Importing a helper function to calculate the total duration for job assignments.

import {
  // Importing functions to fetch user and group details.
  fetchAllUsers, // Function to fetch all user details.
  getAllGroupDetails, // Function to fetch all group details.
} from "../UserModuleUpdated/UsermoduleApi"; // Importing user module-related API functions from the UsermoduleApi module.
import SwitchButton from "../Logbook Configure/SwitchButton";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import AdhocJobTable from "./AdhocJobTable";
import { Progress, Spin } from "antd";
import { SelectButton } from "primereact/selectbutton";
import UserValueTemplate from "../JobAssign/UserValueTemplate";
import { Calendar } from "primereact/calendar";
import dayjs from "dayjs";
import { LoadingOutlined } from '@ant-design/icons';
import { getCurrentUser } from "../UserModuleUpdated/helper";
import { geAllAdhocJobsByAssignerAndTenant, geAllAdhocJobsByTenant, geAllJobsByTenant, sendEmail } from "../JobAssign/JobAssignAPI";
import CustomNode from "../Task/CustomNode";
import { updateJobAndActivity } from "../JobPerformer/JobPerformerAPI";
import EmailJobAssign from "../Email Template/EmailJobAssign";

//** Importing ReactDOMServer to allow server-side rendering of React components to HTML
import ReactDOMServer from "react-dom/server";

export default function TaskCreationForAdhoc() {
 const stepperRef = useRef(null); // Declares a ref for the stepper component.
   const [dlgVisible, setDlgVisible] = useState(false); // State for controlling visibility of a dialog.
   const [assetDlg, setAssetDlg] = useState(false); // State for controlling visibility of an asset dialog.
   const [buttonShow, setButtonShow] = useState(true); // State to show or hide buttons.
   const [checked, setChecked] = useState(false); // State to manage checkbox checked status.
   const [isTaskNameMatched, setIsTaskNameMatched] = useState(false); // State to check if task name matches.
   const [selectedNode, setSelectedNode] = useState(null); // State to store the selected node from a flow diagram or tree.
   const [taskName, setTaskName] = useState(""); // State to store the task name input by the user.
   const [activityName, setActivityName] = useState(""); // State to store the activity name input by the user.
   const [updatedActivityName, setUpdatedActivityName] = useState(""); // State to store the updated activity name.
   const [activityAbbr, setActivityAbbr] = useState(""); // State to store the abbreviation for an activity.
   const [description, setDescription] = useState(""); // State to store the description of the task or activity.
   const [selectedReviwer, setSelectedReviwer] = useState(""); // State to store the selected reviewer.
   const [selectedAssetGroup, setSelectedAssetGroup] = useState(""); // State to store the selected asset group.
   const [snackbarText, setSnackbarText] = useState("Data saved !"); // State to set the text for a snackbar notification.
   const [snackbarSeverity, setsnackbarSeverity] = useState("success"); // State to set the severity (type) of snackbar notification (e.g., success, error).
   const [snackbarOpen, setSnackbarOpen] = useState(false); // State to control whether the snackbar is open or closed.
   const [minutes, setMinutes] = useState(0); // State to store the input minutes value.
   const [hours, setHours] = useState(0); // State to store the input hours value.
   const [buffer, setBuffer] = useState(0); // State to store buffer time for the task or activity.
   const [enforceStartDuration, setEnforceStartDuration] = useState(0); // State to store buffer time for the task or activity.
   const [taskTotalDuration, setTaskTotalDuration] = useState(0); // State to store the total calculated duration of the task.
   const [assetGroups, setAssetGroups] = useState([]); // State to store the list of asset groups.
   const [taskList, setTaskList] = useState([]); // State to store the list of tasks.
   const [logbookOptions, setLogbookOptions] = useState([]); // State to store logbook options for dropdowns or selectors.
   const [allActiveLogbooks, setAllActiveLogbooks] = useState([]); // State to store all active logbooks.
   const [allGroups, setAllGroups] = useState([]); // State to store the list of all groups.
   const [selectedLogbooks, setSelectedLogbooks] = useState(""); // State to store the selected logbooks.
   const [globalFilter, setGlobalFilter] = useState(null); // State to store the global filter for searching or filtering data.
   const [reviewOptions, setReviewOptions] = useState([]); // State to store reviewer options for dropdowns or selectors.
   const [assetId, setAssetId] = useState(""); // State to store the selected asset ID.
   const [delOpen, setDelOpen] = useState(false); // State to control whether the delete confirmation dialog is open or closed.
   const [tabChangeOpen, setTabChangeOpen] = useState(false); // State to control whether the tab change confirmation dialog is open or closed.
  //  const [showCreation, setShowCreation] = useState(true); // State to control visibility of the creation section.
   const [loading, setLoading] = useState(false); // State to control loading state, useful for showing loaders.
   const [assetLogbookData, setAssetLogbookData] = useState([]); // State to store logbook data related to assets.
   const [withoutAssetLogbookData, setWithoutAssetLogbookData] = useState([]); // State to store logbook data without assets.
   const [taskDetails, setTaskDetails] = useState(null); // State to store the details of a specific task.
   const [activityList, setActivityList] = useState([]); // State to store the list of activities.
   const [activityDepartment, setActivityDepartment] = useState(""); // State to store the department associated with the activity.
 
   const [groupList, setGroupList] = useState([]); // State to store the list of groups.
   const [withoutAssetGroupList, setWithoutAssetGroupList] = useState([]); // State to store the list of groups without assets.
   const [withoutAssetselectedGroups, setWithoutAssetSelectedGroups] =
     useState(""); // State to store the selected groups without assets.
   const [withoutAssetSelectedLogbooks, setWithoutAssetSelectedLogbooks] =
     useState(""); // State to store the selected logbooks without assets.
   const [withoutAssetLogbookOptions, setWithoutAssetLogbookOptions] = useState(
     []
   ); // State to store logbook options without assets.
   const [selectedGroups, setSelectedGroups] = useState(""); // State to store the selected groups.
   const [activeStep, setActiveStep] = useState(0); // State to control the current active step in a stepper component.
   const [logbookIdListMap, setLogbookIdListMap] = useState([]); // State to store the map of logbook IDs.
   const [activeIndex, setActiveIndex] = useState(1); // State to control the active index in a tab view or stepper.
 
   const [initXpos, setInitXpos] = useState(0); // State to store the initial X position for graphical components.
   const [initYpos, setInitYpos] = useState(0); // State to store the initial Y position for graphical components.
   const [treeData, setTreeData] = useState(null); // State to store data for a tree view component.
 
   const [selectedNodeId, setSelectedNodeId] = useState(null); // State to store the ID of the selected node in a graph or tree view.
 
   const [nodes, setNodes, onNodesChange] = useNodesState([]); // State to manage the nodes in a flow diagram, with hooks to update nodes.
   const [edges, setEdges, onEdgesChange] = useEdgesState([]); // State to manage the edges in a flow diagram, with hooks to update edges.
   const reconnectDone = useRef(true); // Ref to track whether edge reconnection is completed.
   const debounceTimeout = useRef(null); // Ref for managing debounce timeouts.
   const [nameError, setNameError] = useState(false); // State to track whether there's an error in the task name.
   const [abbrError, setAbbrError] = useState(false); // State to track whether there's an error in the activity abbreviation.
 
   const [isPublicAccess, setIsPublicAccess] = useState(false);
 
   const theme = useTheme(); // Hook to access the current theme settings.
   const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Hook to detect if the screen size is mobile based on the theme's breakpoints.
 
   const nodeTypes = useMemo(
     () => ({
       customNode: CustomNode,
     }),
     []
   );
   const edgeTypes = useMemo(
     () => ({
       // Define edge types here if needed
     }),
     []
   );

/*************************************************  Adhoc Job States**********************************************/
// This is the the bit that is controlling the taskCreation Tabs and the AdhocJob Table
  const [showCreation, setShowCreation] = useState(false);
  // const [existingAddhocJobs, setExistingAddhocJobs] = useState([]); //The Jobs that will be visible in the Addhoc Table
  const options = ['New Task','Import Existing Task'];
  const [isExistingPublishedTask, setIsExistingPublishedTask] = useState(options[0]);
  const [dbTaskDetails,setdbTaskDetails] = useState(null); //Why two states because these module has already dependencies for dbTaskDetails
  const [taskFromExistingTask,setTaskFromExistingTask] = useState({}); //This is the task that will be used to create the new task
  const [jobDetails,setJobDetails] = useState(null);
  const [filteredTasksByAssetGroup,setFilteredTasksByAssetGroup] = useState([]);
  const [processDbRequest,setProcessDbRequest] = useState(false);
  const [allUsers,setAllUsers]=useState([]);
  const [jobStartDate,setJobStartDate]=useState(new Date());
  const [adhocJobs,setAdhocJobs]=useState(null)

  const ADHOC_TASK_STATUS="Adhoc"

/**********************************************************************************************************/

const handleReset=() => {
  //defined by ashok
  setJobDetails(null);
  setdbTaskDetails(null);
  setSelectedReviwer('');
  setTaskDetails(null);
  setActivityList([]);
  setTaskName("");
  setDescription("");
  setTaskName('')
  setTaskFromExistingTask(null);
  setJobStartDate(new Date());
  setActiveStep(0);
  setNodes([]);
  setEdges([]);
  setAssetLogbookData([]);
  setWithoutAssetLogbookData([]);

  //defined by me
  setIsExistingPublishedTask(options[0]);
  setSelectedAssetGroup("");
  setProcessDbRequest(false);
  setSnackbarOpen(false);
  // setShowCreation(false);
}

const disableFirstTab=()=>
{
  return isTaskNameMatched || (selectedAssetGroup ?? true) || (selectedReviwer ?? true)
}


const handleNextTab = async() => {
  //set the activityDetails
  // setTaskDetails(taskFromExistingTask??{});
  // setActivityList(taskFromExistingTask.activityList??[]);

  console.log('Current Task from Existing Task : ',taskFromExistingTask);
  console.log('Current Task Details : ',taskDetails);
// if(taskFromExistingTask?.taskId === taskDetails?.taskId)
// {
//   stepperRef.current.nextCallback();
//   setActiveStep(activeStep + 1);
//   return;
// }

setProcessDbRequest(true);

console.log('Current Task from Existing Task : ',taskFromExistingTask);
let updatedTaskFromExistingTask = taskFromExistingTask?.taskId === taskDetails?.taskId ? taskDetails : taskFromExistingTask;

if(!taskFromExistingTask?.taskId )//a new Task is getting created and the user has not selected from the existing task
{
    const newTask = {
      creationTime: new Date(), // Set the creation time to the current date and time
      taskId: generateTaskId(), // Set the task ID
      taskName: taskName, // Set the task name
      creator:getCurrentUser(), // Set the creator to the current user
      reviewer: selectedReviwer, // Set the selected reviewer
      assetGroup: selectedAssetGroup, // Set the selected asset group
      description: description, // Set the task description
      activityList: activityList??[], // Set the list of activities
      status:ADHOC_TASK_STATUS,// A seperate Tab for Adhoc will be in view in Task Master 
      tenantId:getTenantID(),
      adhocTask:true
    };
    updatedTaskFromExistingTask = newTask;
}
const success=await processTaskInformation(updatedTaskFromExistingTask??{});
setProcessDbRequest(false);
  if(!success)
  {
    setsnackbarSeverity("error");
    setSnackbarText("Failed To Create Task");
    setSnackbarOpen(true);
   
    return;
  }

  //Previously that would have saved the Task though the Addhoc Job has not been created yet...
  stepperRef.current.nextCallback();
  setActiveStep(activeStep + 1);

  
}

  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     // Customize the message to show in the confirmation dialog
  //     const confirmationMessage = "Are you sure you want to leave?";

  //     // Set the confirmation message
  //     event.returnValue = confirmationMessage; // Standard
  //     return confirmationMessage; // For older browsers
  //   };

  //   // Add event listener
  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   // Cleanup event listener on component unmount
  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);

  // useEffect(() => {
  //   console.log('useEffect ActivityList : ',activityList)
  // },[activityList])

  // useEffect(() => {
  //   console.log('useEffect Edges : ',edges)
  // },[edges])


  // useEffect(() => {
  //   console.log('useEffect Current Nodes : ',nodes)
  // },[nodes])


  useEffect(() => {

   
    
    fetchData();
    fetchAllTaskData();
    fetchAllJobs();
    fetchLogBookList();
    console.log('Current Window States : ',window.history.state);
    // fetchAllAddhocJobs();
  }, []);

  async function fetchData() {
    console.log('Fetch Data called :')
    await extendTokenExpiration();
    // let getAllDepartment = await getAllDepartments();
    // setDepartmentList(getAllDepartment);
    //let getAllGrp = await getAllGroup();
    let getAllGrp = await getAllGroupDetails();
    setWithoutAssetGroupList(getAllGrp);
    let data = await getAllActiveFormInfo();
    setLogbookIdListMap(data);
    if (
      dbTaskDetails !== null &&
      dbTaskDetails !== undefined &&
      dbTaskDetails !== ""
    ) 

    {
      let activityconnections = [];
      activityconnections = await getActivityConnectionsFromAPI(
        dbTaskDetails.taskId
      );
      // setIsTaskNameMatched(true);
      setTaskDetails(dbTaskDetails);
      setActivityList(dbTaskDetails.activityList);
      setTaskName(dbTaskDetails.taskName);
      setSelectedAssetGroup(dbTaskDetails.assetGroup);
      setDescription(dbTaskDetails.description);
      setSelectedReviwer(dbTaskDetails.reviewer);

      console.log('Current Selected Asset Group :',dbTaskDetails.assetGroup)
      console.log('Current Reviewer :',dbTaskDetails.reviewer);
      console.log('Current Description :',dbTaskDetails.description);

      console.log('Activity List',dbTaskDetails.activityList)
      const nodesData = dbTaskDetails.activityList?.map((activity) => ({
        id: activity.activityId,
        type:"customNode",
        data: { label: activity.activityName, sequence: activity.sequence ,duration:activity.duration },
        position: { x: activity.xPos, y: activity.yPos },
      }));

      setNodes(nodesData);
      console.log("AShok : ", activityconnections);
      if (activityconnections.length !== 0) {
        const linksData = activityconnections.map((connection) => ({
          id: connection.sourceId + connection.targetId,
          source: connection.sourceId,
          target: connection.targetId,
          animated: true,
          data: {
            sourceName: connection.source,
            targetName: connection.target,
          },
        }));

        console.log("linksData : ", linksData);

        setEdges(linksData);
      }
    }
  }


  const fetchAllJobs = async () => {
    let jobs = await geAllAdhocJobsByAssignerAndTenant(getCurrentUser());
   
    // if (jobs) {
    //   jobs=jobs.filter(job=>job.adhoc)
    //   console.log('Filtered Jobs : ',jobs)
      setAdhocJobs(jobs??[]);
    // }
  };


  // const  fetchAllAddhocJobs=async()=>
  // {

  //   const allJobs=await geAllJobsByTenant();
  //   console.log('All Jobs : ',allJobs)
  //   const addhocJobs=allJobs?.filter(job=>job.addhoc)
  //   console.log('All Addhoc Jobs : ',addhocJobs)
  //   // setExistingAddhocJobs(addhocJobs);
  // }


  const checkForAssetGroupSelection = () => {
    if(!activityList || activityList.length === 0) return true; //preserve previous asset selections if any
    console.log('Current Selected Asset Group : ',selectedAssetGroup)
    const isValidAssetSelected=selectedAssetGroup ===taskFromExistingTask?.assetGroup;
    console.warn('Returning isValidAssetSelected',isValidAssetSelected)
    if(jobDetails) return true;
    return selectedAssetGroup ? isValidAssetSelected : false;  
  };
  


  const processTaskInformation = async (taskDetails) => {
    console.log('processTaskInformation taskDetails:', taskDetails);
    console.log('processTaskInformation activityList:', activityList);
  
    // if (!taskDetails && !activityList) return true;

    // if(!taskFromExistingTask || Object.keys(taskFromExistingTask??{}).length === 0)
    //   return true;

    const selectedAssetGroup = checkForAssetGroupSelection();
  
    try {
      let activityconnections = [];
      if (taskDetails && taskDetails.taskId) {
        console.log('Current Task ID : ',taskDetails.taskId )
        activityconnections = await getActivityConnectionsFromAPI(taskDetails.taskId);
      }
  
      console.log('Activity Connections Data:', activityconnections);

      const taskDetailsWithoutAsset=taskDetails?.activityList?.map((activity) => {
        return resetAssetInformation(activity);
      })

      console.log('Task Details without Asset:', taskDetailsWithoutAsset);
  
      // Merge taskDetails.activityList with existing activityList
      let updatedActivityList = [];
      if (taskDetails.activityList && activityList) {
        const existingActivitiesMap = new Map(activityList.map((act) => [act.activityId, act]));
        
        updatedActivityList = taskDetails.activityList.map((activity) => {
          if (!activity.actvityStatus?.trim()) {
            activity.actvityStatus = "Not Started";
          }
          if (existingActivitiesMap.has(activity.activityId)) {
            
            // Preserve existing (user-modified) activity
            const modifiedActivity={ ...activity, ...existingActivitiesMap.get(activity.activityId) };
            
            return !selectedAssetGroup ? resetAssetInformation(modifiedActivity):modifiedActivity;
          }
          return !selectedAssetGroup ? resetAssetInformation(activity):activity; // New activity from API
        });
      } else {
        updatedActivityList = !selectedAssetGroup ? taskDetailsWithoutAsset: taskDetails.activityList ||[];
      }
  
      setActivityList(updatedActivityList);

      console.log('Updated Activity List in processTaskInfo:', updatedActivityList);
  
      // Merge nodes
      const nodesData = updatedActivityList?.map((activity) => ({
        id: activity.activityId,
        type: "customNode",
        data: { label: activity.activityName, sequence: activity.sequence,duration:activity.duration },
        position: { x: activity.xPos, y: activity.yPos },
      }));

      console.log('Nodes Data:', nodesData);
  
      if (nodesData && nodes && nodesData.length > 0) {
        const existingNodesMap = new Map(nodes.map((node) => [node.id, node]));
  
        const mergedNodes = nodesData.map((node) => {
          if (existingNodesMap.has(node.id)) {
            // Preserve user-modified node data (position, label, etc.)
            return { ...node, ...existingNodesMap.get(node.id) };
          }
          return node;
        });
  
        setNodes(mergedNodes);
      } else {
        setNodes(nodesData || []);
      }
  
      console.log('Ashok activity connections:', activityconnections);
  
      // Set edges
      if (activityconnections.length !== 0) {
        const linksData = activityconnections?.map((connection) => ({
          id: connection.sourceId + connection.targetId,
          source: connection.sourceId,
          target: connection.targetId,
          animated: true,
          data: {
            sourceName: connection.source,
            targetName: connection.target,
          },
        }));
  
        console.log('linksData:', linksData);
        setEdges((prevEdges) => {
          const existingIds = new Set(prevEdges.map(edge => edge.id));
      
          const newUniqueLinks = linksData.filter(link => !existingIds.has(link.id));

          console.log('Previous Edges Data:', prevEdges);
          console.log('new UniqueLinks:', newUniqueLinks);
      
          return [...prevEdges, ...newUniqueLinks];
        });

        console.log('Updated Links Data:', [...edges, ...linksData]);
  
        // Special case if dbTaskDetails is not set (new ad-hoc job)
        console.log('Current dbTaskDetails:', dbTaskDetails);
  
        // if (!dbTaskDetails) {
        //   console.log('Previous Activity List:', taskDetails.activityList);
        //   const newActivityList = fetchCurrentActivityList(taskDetails.activityList, new Date(), 7);
         
  
        //   console.log('New Activity List for new Job:', newActivityList);
  
        //   // setActivityList(newActivityList.map((activity) => ({
        //   //   ...activity,
        //   //   assetId: '',
        //   //   assetName: '',
        //   // })));
        // }
      }

      // if(!selectedAssetGroup)
      //   taskDetails.assetGroup='';


      setTaskDetails(taskDetails);
  
      return true;
    } catch (error) {
      console.log('Error processing Task Information:', error);
      return false;
    }
  };
  

  const resetAssetInformation = (activity) => {
    return {...activity, assetId: '', assetName: '',logbook:'',assetNameList:[],assetIDList:[],activityUserGroupList:[]};
  }
  


 

  const fetchAllTaskData=async()=>
  {
    // const allAssetGroup_data = await getSelectedOptionTask('Task'); //This particular API is returning all Task ,The API need to be refactored
    const allAssetGroup_data = await getAllTaskByTenantId();
    
    setFilteredTasksByAssetGroup((allAssetGroup_data?.filter(task=>task?.status?.toLowerCase() === "published" || task?.status?.toLowerCase() === "adhoc")) ?? []);
  }

  // Objective: This useEffect is used to handle browser unload confirmation and fetch initial task details, group information, and logbook data from APIs.

  // useEffect(() => {
  //   // First useEffect is for handling before unload confirmation (when the user tries to navigate away).
  //   const handleBeforeUnload = (event) => {
  //     const confirmationMessage = "Are you sure you want to leave?"; // The confirmation message shown to the user.

  //     event.returnValue = confirmationMessage; // Set the return value to show a confirmation dialog.
  //     return confirmationMessage; // Return the confirmation message.
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload); // Add event listener for beforeunload event when the window is closing.

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload); // Cleanup by removing the beforeunload event listener when the component unmounts.
  //   };
  // }, []); // Empty dependency array ensures this runs only once when the component mounts.

  // useEffect(() => {
  //   // Second useEffect is for fetching data like task details, activity connections, group details, and logbook data.

  //   async function fetchData() {
  //     await extendTokenExpiration(); // Extend token expiration to maintain user session.

  //     let getAllGrp = await getAllGroupDetails(); // Fetch all group details from the API.
  //     setWithoutAssetGroupList(getAllGrp); // Set the group details without asset to state.

  //     let data = await getAllActiveFormInfo(); // Fetch all active form information.
  //     setLogbookIdListMap(data); // Set the logbook ID map with the fetched data.

  //     if (
  //       dbTaskDetails !== null &&
  //       dbTaskDetails !== undefined &&
  //       dbTaskDetails !== ""
  //     ) {
  //       // Check if dbTaskDetails is not null, undefined, or empty.

  //       let activityconnections = []; // Initialize an empty array for activity connections.
  //       activityconnections = await getActivityConnectionsFromAPI(
  //         // Fetch activity connections based on taskId.
  //         dbTaskDetails.taskId
  //       );

  //       setTaskDetails(dbTaskDetails); // Set task details with fetched dbTaskDetails data.
  //       setActivityList(dbTaskDetails.activityList); // Set activity list from task details.
  //       setTaskName(dbTaskDetails.taskName); // Set task name from dbTaskDetails.
  //       setSelectedAssetGroup(dbTaskDetails.assetGroup); // Set asset group from dbTaskDetails.
  //       setDescription(dbTaskDetails.description); // Set task description from dbTaskDetails.
  //       setSelectedReviwer(dbTaskDetails.reviewer); // Set the reviewer from dbTaskDetails.

  //       const nodesData = dbTaskDetails.activityList?.map((activity) => ({
  //         id: activity.activityId, // Assign activityId to node ID.
  //         // type: "customNode",
  //         data: { label: activity.activityName, sequence: activity.sequence }, // Set node label and sequence from activity data.
  //         position: { x: activity.xPos, y: activity.yPos }, // Set node position based on activity's xPos and yPos.
  //       }));

  //       setNodes(nodesData); // Set nodes with generated nodesData.

  //       if (activityconnections.length !== 0) {
  //         // If there are activity connections available.
  //         const linksData = activityconnections.map((connection) => ({
  //           id: connection.sourceId + connection.targetId, // Create a unique ID for the edge.
  //           source: connection.sourceId, // Set the source ID for the connection.
  //           target: connection.targetId, // Set the target ID for the connection.
  //           animated: true, // Enable animation for the connection (edge).
  //           data: {
  //             sourceName: connection.source, // Set source name for the connection.
  //             targetName: connection.target, // Set target name for the connection.
  //           },
  //         }));

  //         setEdges(linksData); // Set edges with generated linksData.
  //       }
  //     }
  //   }

  //   fetchData(); // Invoke the fetchData function to fetch initial data on component load.

  //   async function fetchLogBookList() {
  //     // Function to fetch logbook list and related group/task details.
  //     let data = await getAllActiveFormInfo(); // Fetch all active logbook information.
  //     setAllActiveLogbooks(data); // Set all active logbooks to state.

  //     let groups = await getAllGroupDetails(); // Fetch all group details.
  //     setAllGroups(groups); // Set all groups to state.

  //     const taskList = await getAllTaskByTenantId(); // Fetch all tasks by tenant ID.
  //     setTaskList(
  //       taskList === null || taskList === undefined || taskList === ""
  //         ? []
  //         : taskList // Set task list or empty array based on fetched data.
  //     );
  //   }

  //   fetchLogBookList(); // Invoke the fetchLogBookList function to get logbook data and tasks.

    
  // }, []); // Empty dependency array ensures this useEffect runs only once when the component mounts.



    async function fetchLogBookList() {
      // Function to fetch logbook list and related group/task details.
      let data = await getAllActiveFormInfo(); // Fetch all active logbook information.
      setAllActiveLogbooks(data); // Set all active logbooks to state.

      let groups = await getAllGroupDetails(); // Fetch all group details.
      setAllGroups(groups); // Set all groups to state.

      const taskList = await getAllTaskByTenantId(); // Fetch all tasks by tenant ID.
      setTaskList(
        taskList === null || taskList === undefined || taskList === ""
          ? []
          : taskList // Set task list or empty array based on fetched data.
      );
    }


  async function getActivityConnectionsFromAPI(taskId) {
    // Function to fetch activity connections by taskId.
    const connections = await getActivityConnections(taskId); // Fetch connections based on task ID.

    const activityconnections =
      connections === null || connections === undefined || connections === ""
        ? []
        : connections; // Return empty array if connections are null/undefined/empty, else return connections.

    return activityconnections; // Return the fetched activity connections.
  }

  // Objective: Fetches asset groups and user data for review when the component is mounted.
  useEffect(() => {
    fetchAssetAllGroups(); // Fetch all asset groups when the component is mounted.
    fetchAllUsersForReview(); // Fetch all users available for review when the component is mounted.
  }, []); // Empty dependency array ensures this effect runs only once, when the component mounts.

  // Objective: Fetches the asset tree whenever the selected asset group changes.
  // Params: selectedAssetGroup (state) - the currently selected asset group.
  useEffect(() => {
    fetchAssetTree(); // Fetch the asset tree based on the newly selected asset group.
  }, [selectedAssetGroup]); // Runs this effect whenever `selectedAssetGroup` changes.

  // Objective: This useEffect is used to filter group details based on the selected node and update the group list accordingly.
  // useEffect(() => {
  //   if (isPublicAccess) {
  //     setEnforceStartDuration(0);
  //   } else {
  //     setBuffer(0);
  //   }
  // }, [isPublicAccess]); // Runs this effect whenever `selectedAssetGroup` changes.

  useEffect(() => {
    async function filterGroupsById() {
      setSelectedGroups(""); // Clear the selected groups.
      setSelectedLogbooks(""); // Clear the selected logbooks.
      setLogbookOptions([]); // Clear logbook options.
      const groupNames = selectedNode?.groups ? selectedNode.groups : []; // Get group names from selected node or set to an empty array if undefined.

      setGroupList(groupNames); // Set the group list with the selected node's groups.
    }

    filterGroupsById(); // Call the function to filter groups when the selectedNode changes.
  }, [selectedNode]); // Runs when the selectedNode changes.

  // Objective: This useEffect is used to filter logbooks based on the selected groups and set the logbook options.

  useEffect(() => {
    async function filterLogBookList() {
      if (selectedGroups) {
        // Check if selectedGroups is set.
        setSelectedLogbooks(""); // Clear the selected logbooks.
        setLoading(true); // Set loading to true while logbooks are being filtered.

        const filteredLogbooks = await Promise.all(
          // Filter logbooks based on user groups.
          allActiveLogbooks?.map(async (logbook) => {
            const userGroups = logbook.userGroup
              ? logbook.userGroup.split(",").map((group) => group.trim())
              : []; // Split the userGroup string into an array and trim spaces.

            const isInSelectedGroups = await Promise.all(
              userGroups.map(async (group) => {
                const groupByGroupId = allGroups.find(
                  (item) => item.groupID === group // Find the group by groupID.
                );
                return (
                  selectedGroups.trim() === groupByGroupId?.groupName?.trim() // Compare group names.
                );
              })
            ).then((results) => results.some(Boolean)); // Check if any group matches the selectedGroups.

            const isInSelectedDept = false; // Placeholder for department check.

            return isInSelectedGroups || isInSelectedDept ? logbook : null; // Return logbook if it matches groups or department.
          })
        );

        const validLogbooks = filteredLogbooks.filter(Boolean); // Filter out null values.

        const options = validLogbooks.map((logbook) => ({
          label: logbook.formName, // Set logbook form name as label.
          value: logbook.formName, // Set logbook form name as value.
        }));

        setLogbookOptions(options); // Set logbook options with valid logbooks.
        setLoading(false); // Set loading to false when filtering is done.
      }
    }

    filterLogBookList(); // Call the function to filter logbooks when selectedGroups or related dependencies change.
  }, [selectedGroups, allActiveLogbooks, allGroups, selectedNode?.department]); // Runs when any of the dependencies change.

  // Objective: This useEffect is used to filter logbooks when the selected groups without assets change and set corresponding logbook options.

  useEffect(() => {
    async function filterLogBookList() {
      if (
        withoutAssetselectedGroups !== "" && // Ensure the selected group without assets is not empty.
        withoutAssetselectedGroups !== null &&
        withoutAssetselectedGroups !== undefined
      ) {
        setWithoutAssetSelectedLogbooks(""); // Clear selected logbooks for groups without assets.
        setLoading(true); // Set loading to true while filtering logbooks.

        const filteredLogbooks = await Promise.all(
          allActiveLogbooks.map(async (logbook) => {
            const userGroups = logbook.userGroup
              ? logbook.userGroup.split(",").map((group) => group.trim())
              : []; // Split the userGroup string into an array and trim spaces.

            const isInSelectedGroups = await Promise.all(
              userGroups.map(async (group) => {
                return withoutAssetselectedGroups.groupID?.trim() === group; // Check if group matches selected groups without assets.
              })
            ).then((results) => results.some(Boolean)); // Check if any group matches.

            const isInSelectedDept = false; // Placeholder for department check.

            return isInSelectedGroups || isInSelectedDept ? logbook : null; // Return logbook if it matches.
          })
        );

        const validLogbooks = filteredLogbooks.filter(
          (logbook) => logbook !== null // Filter out null logbooks.
        );

        const options = validLogbooks?.map((logbook) => ({
          label: logbook.formName, // Set logbook form name as label.
          value: logbook.formName, // Set logbook form name as value.
        }));

        setWithoutAssetLogbookOptions(options); // Set logbook options for groups without assets.
        setLoading(false); // Set loading to false after filtering is done.
      }
    }

    filterLogBookList(); // Call the function to filter logbooks when withoutAssetselectedGroups changes.
  }, [withoutAssetselectedGroups]); // Runs when withoutAssetselectedGroups changes.

  // Objective: This useEffect is used to validate activity name and abbreviation, and set error states for invalid entries.

  useEffect(() => {
    const handler = setTimeout(() => {
      const abbrTooLong = activityAbbr?.length > 6; // Check if activity abbreviation exceeds 6 characters.

      const nameExists = activityList?.some(
        (activity) =>
          activity.activityName &&
          activity.activityName.toLowerCase() === activityName.toLowerCase() &&
          activity.activityId !== selectedNodeId // Check if activity name exists and isn't the selected node.
      );

      const abbrExists = activityList?.some(
        (activity) =>
          activity.activityAbrv &&
          activity.activityAbrv.toLowerCase() === activityAbbr.toLowerCase() &&
          activity.activityId !== selectedNodeId // Check if activity abbreviation exists and isn't the selected node.
      );

      setNameError(nameExists); // Set error if name already exists.
      setAbbrError(abbrExists || abbrTooLong); // Set error if abbreviation exists or is too long.
    }, debounceTimeout); // Delay the validation with debounceTimeout.

    return () => {
      clearTimeout(handler); // Clear the timeout when component unmounts or dependencies change.
    };
  }, [activityName, activityAbbr, activityList]); // Runs when activityName, activityAbbr, or activityList changes.

  // Objective: Calculates the node sequences based on the edges and assigns levels to each node in the graph.
  // Params: nodes (array) - the list of nodes in the graph, edges (array) - the list of edges connecting the nodes.
  const calculateNodeSequences = (nodes, edges) => {
    const nodeLevels = {}; // Object to store the sequence level of each node.
    const queue = []; // Queue for processing nodes in topological order.

    nodes.forEach((node) => {
      // For each node, check if it has any incoming edges.
      const hasIncomingEdges = edges.some((edge) => edge.target === node.id);
      if (!hasIncomingEdges) {
        // If no incoming edges, it's a root node.
        nodeLevels[node.id] = 1; // Set level 1 for root nodes.
        queue.push(node.id); // Add the root node to the queue.
      }
    });

    while (queue.length > 0) {
      // Process nodes until queue is empty.
      const currentNodeId = queue.shift(); // Get the current node ID.
      const currentLevel = nodeLevels[currentNodeId]; // Get the current node's level.

      edges.forEach((edge) => {
        // For each edge, check if the source is the current node.
        if (edge.source === currentNodeId) {
          nodeLevels[edge.target] = currentLevel + 1; // Set target node's level to source node's level + 1.
          queue.push(edge.target); // Add target node to the queue for further processing.
        }
      });
    }

    const newNodes = nodes.map((node) => ({
      // Map through nodes and update their data with the calculated sequence.
      ...node,
      data: {
        ...node.data,
        sequence: nodeLevels[node.id] || "", // Assign the sequence level or empty string if undefined.
      },
    }));

    return newNodes; // Return the updated nodes with sequences.
  };

  // Objective: Checks if adding a new edge creates a cycle in the directed graph.
  // Params: nodes (array) - list of nodes, edges (array) - list of edges, newEdge (object) - the edge to check for cycle.
  const hasCycle = (nodes, edges, newEdge) => {
    const { source, target } = newEdge; // Destructure the source and target of the new edge.
    const graph = {}; // Graph object to represent the node connections.

    nodes.forEach((node) => {
      graph[node.id] = []; // Initialize an empty array for each node's adjacency list.
    });

    edges.forEach((edge) => {
      graph[edge.source]?.push(edge.target); // Add existing edges to the graph.
    });

    graph[source].push(target); // Add the new edge to the graph.

    const visited = new Set(); // Set to keep track of visited nodes.
    const stack = new Set(); // Set to keep track of the recursion stack.

    const dfs = (node) => {

      if (!Array.isArray(graph[node])) {
        return false; // Or handle it as needed
      }
      
      // Depth-first search to detect cycles.
      if (!visited.has(node)) {
        // If the node has not been visited yet.
        visited.add(node); // Mark the node as visited.
        stack.add(node); // Add the node to the recursion stack.

        for (const neighbor of graph[node]) {
          // Traverse through neighbors.
          if (!visited.has(neighbor) && dfs(neighbor)) {
            // If neighbor hasn't been visited, recursively call DFS.
            return true; // If a cycle is detected, return true.
          } else if (stack.has(neighbor)) {
            // If the neighbor is already in the stack, there's a cycle.
            return true;
          }
        }
      }

      stack.delete(node); // Remove the node from the recursion stack when finished.
      return false; // Return false if no cycle is found.
    };

    return dfs(source); // Start DFS from the source node of the new edge.
  };

  // Objective: Callback function that handles node connections (when a new edge is added).
  // Params: params (object) - connection parameters including source and target nodes.
  const edgesUpdatable =
    dbTaskDetails?.status !== "Published" &&
    dbTaskDetails?.status !== "Pending";

  const onConnect = useCallback(
    (params) => {
      // if (!edgesUpdatable) return;
      const sourceNode = nodes.find((node) => node.id === params.source); // Find the source node from the nodes array.
      const targetNode = nodes.find((node) => node.id === params.target); // Find the target node from the nodes array.
      const newEdge = {
        // Create a new edge object with additional data.
        ...params,
        animated: true, // Make the edge animated.
        data: {
          sourceName: sourceNode?.data.label || "", // Assign source node's label to edge data.
          targetName: targetNode?.data.label || "", // Assign target node's label to edge data.
        },
      };

      if (hasCycle(nodes, edges, newEdge)) {
        // Check if adding this edge creates a cycle.
        return; // If a cycle is detected, do not add the edge.
      }

      const newEdges = addEdge(newEdge, edges); // Add the new edge to the edges array.
      setEdges(newEdges); // Update the edges state.
      setNodes((nds) => calculateNodeSequences(nds, newEdges)); // Recalculate node sequences based on the new edges.
    },
    [nodes, edges, setEdges, setNodes] // Dependencies to re-run this callback when they change.
  );

  // Objective: Marks the start of the reconnection process by setting a flag.
  const onReconnectStart = useCallback(() => {
    reconnectDone.current = false; // Set the reconnection flag to false when reconnection starts.
  }, []); // No dependencies.

  // Objective: Callback function that handles reconnections (when an existing edge is reconnected).
  // Params: oldEdge (object) - the edge being reconnected, newConnection (object) - the new connection parameters.
  const onReconnect = useCallback(
    (oldEdge, newConnection) => {
      reconnectDone.current = true; // Set the reconnection flag to true after reconnection.
      const sourceNode = nodes.find((node) => node.id === newConnection.source); // Find the source node from the new connection.
      const targetNode = nodes.find((node) => node.id === newConnection.target); // Find the target node from the new connection.
      const newEdge = {
        // Create a new edge object with additional data.
        ...newConnection,
        animated: true, // Make the edge animated.
        data: {
          sourceName: sourceNode?.data.label || "", // Assign source node's label to edge data.
          targetName: targetNode?.data.label || "", // Assign target node's label to edge data.
        },
      };

      if (hasCycle(nodes, edges, newEdge)) {
        // Check if the new edge creates a cycle.
        return; // If a cycle is detected, do not reconnect the edge.
      }

      const newEdges = reconnectEdge(oldEdge, newEdge, edges); // Reconnect the edge with the new connection.
      setEdges(newEdges); // Update the edges state.
      setNodes((nds) => calculateNodeSequences(nds, newEdges)); // Recalculate node sequences based on the new edges.
    },
    [nodes, edges, setEdges, setNodes] // Dependencies to re-run this callback when they change.
  );

  // Objective: Callback function that handles the end of reconnection (removes old edges if reconnection was not completed).
  // Params: edge (object) - the edge that was attempted to be reconnected.
  const onReconnectEnd = useCallback(
    (_, edge) => {
      if (!reconnectDone.current) {
        // Check if reconnection was not done.
        const newEdges = edges.filter((e) => e.id !== edge.id); // Filter out the old edge from the edges array.
        setEdges(newEdges); // Update the edges state without the old edge.
        setNodes((nds) => calculateNodeSequences(nds, newEdges)); // Recalculate node sequences based on the updated edges.
      }
      reconnectDone.current = true; // Set the reconnection flag to true after the process is completed.
    },
    [edges, setEdges, setNodes] // Dependencies to re-run this callback when they change.
  );

  // Objective: Fetches the asset tree for the selected asset group.
  // Params: selectedAssetGroup (state) - the currently selected asset group.
  async function fetchAssetTree() {
    if (
      selectedAssetGroup !== "" && // Check if selectedAssetGroup is not an empty string
      selectedAssetGroup !== null && // Check if selectedAssetGroup is not null
      selectedAssetGroup !== undefined // Check if selectedAssetGroup is not undefined
    ) {
      let data = await getAssetGroupTree(selectedAssetGroup); // Fetch the asset tree data using selectedAssetGroup

      if (data) {
        setTreeData(data[0]); // Set the tree data if fetched successfully
      } else {
        setTreeData(null); // Set treeData to null if no data is returned
      }
    } else {
      setTreeData(null); // Set treeData to null if selectedAssetGroup is invalid
    }
  }

  // Objective: Fetches all available asset groups.
  async function fetchAssetAllGroups() {
    let data = await getAssetGroupsList(); // Fetch the list of asset groups
    const groupNames = data?.map((group) => group.groupName); // Extract group names from the fetched data

    if (groupNames) {
      setAssetGroups(groupNames); // Set assetGroups state with the fetched group names
    } else {
      setAssetGroups([]); // Set assetGroups to an empty array if no group names are returned
    }
  }

  // Objective: Retrieves the currently logged-in user's information from session storage.
  const getloggedInUser = () => {
    const loggedInUser = process.env.REACT_APP_USERID; // Retrieve the user ID from environment variables

    const encryptedUser = localStorage.getItem(loggedInUser); // Get the encrypted user information from session storage
    const User = decryptTokenId(encryptedUser); // Decrypt the user token

    return User; // Return the decrypted user ID
  };

  // Objective: Fetches all users who are available to be reviewers.
  // Filters out the current user and selects users with the "Activity Reviewer" page assigned.
  async function fetchAllUsersForReview() {
    let data = await fetchAllUsers();
    console.log("data of all users : ", data);
    setAllUsers(data??[].filter((user) => user.active)??[]);
    const currUser = getloggedInUser();

    const options = data
      ?.filter(
        (user) =>
          user.userID !== currUser &&
          user.allotedPages?.some((pageObj) => {
            return pageObj.page === "Job Reviewer";
          })
      )
      ?.map((user) => ({
        label: `${user.userName} (${user.userID})`,
        value: user.userID,
      }));

    console.log("Reviewer List:", options);

    setReviewOptions(options);
  }

  const getJobStatusColor = (status) => {
    const normalized = status?.toLowerCase() ?? '';
    if (normalized === 'started' || normalized === 'completed') return 'success';
    if (normalized === 'not started' || normalized === 'aborted' || normalized === 'rejected') return 'error';
    return 'primary';
  };

  // Objective: Recursively renders a tree structure of asset nodes.
  // Params: nodes (object) - the current asset node being rendered.
  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id} // Assign a unique key to the TreeItem based on node ID
      nodeId={nodes.id} // Set the node's ID as the nodeId for the TreeItem
      label={nodes.assetName} // Display the asset name as the label for the TreeItem
      onClick={() => handleNodeClick(nodes)} // Handle click events on the TreeItem
      onContextMenu={(e) => handleContextMenu(e, nodes)} // Handle right-click context menu events
    >
      {Array.isArray(nodes.children) // Check if the node has children
        ? nodes.children?.map((node) => renderTree(node)) // Recursively render child nodes
        : null}
    </TreeItem>
  );

  // Objective: Generates a unique task ID based on the current date and time.
  const generateTaskId = () => {
    const date = new Date(); // Create a new Date object
    const year = date.getFullYear(); // Get the current year
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Get the current month, padded to 2 digits
    const day = String(date.getDate()).padStart(2, "0"); // Get the current day, padded to 2 digits
    const hours = String(date.getHours()).padStart(2, "0"); // Get the current hours, padded to 2 digits
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Get the current minutes, padded to 2 digits
    const seconds = String(date.getSeconds()).padStart(2, "0"); // Get the current seconds, padded to 2 digits
    const milliseconds = String(date.getMilliseconds()).padStart(3, "0"); // Get the current milliseconds, padded to 3 digits

    return `T${year}${month}${day}T${hours}${minutes}${seconds}${milliseconds}`; // Return the formatted task ID
  };

  // Objective: Generates a unique activity ID based on the current date and time.
  const generateActivityId = () => {
    const date = new Date(); // Create a new Date object
    const year = date.getFullYear(); // Get the current year
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Get the current month, padded to 2 digits
    const day = String(date.getDate()).padStart(2, "0"); // Get the current day, padded to 2 digits
    const hours = String(date.getHours()).padStart(2, "0"); // Get the current hours, padded to 2 digits
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Get the current minutes, padded to 2 digits
    const seconds = String(date.getSeconds()).padStart(2, "0"); // Get the current seconds, padded to 2 digits
    const milliseconds = String(date.getMilliseconds()).padStart(3, "0"); // Get the current milliseconds, padded to 3 digits

    return `A${year}${month}${day}T${hours}${minutes}${seconds}${milliseconds}`; // Return the formatted activity ID
  };

  // Objective: Handles the click event on a tree node, updating the selected node state.
  // Params: node (object) - the node that was clicked.
  const handleNodeClick = (node) => {
    setSelectedNode(node); // Set the selected node state to the clicked node
  };

  // Objective: Handles the right-click context menu event on a node, selecting the node.
  // Params: event (object) - the context menu event, node (object) - the clicked node.
  const handleContextMenu = (event, node) => {
    event.preventDefault(); // Prevent the default right-click menu
    event.stopPropagation(); // Stop the event from propagating to parent elements
    setSelectedNode(node); // Set the selected node state to the clicked node
  };

  // Objective: Saves the current task as a draft, performing various validations and creating a new task if necessary.
  // const handleSaveDraftTask = async () => {
  //   // Check if the task is already published or pending, move to the next step if true
  //   if (
  //     dbTaskDetails?.status === "Published" ||
  //     dbTaskDetails?.status === "Pending"
  //   ) {
  //     stepperRef.current.nextCallback(); // Proceed to the next step
  //     return;
  //   }

  //   // Check if the task name is empty, show an error message if true
  //   if (taskName === "" || taskName === undefined || taskName === null) {
  //     setSnackbarOpen(true); // Open the snackbar
  //     setSnackbarText("Task Name Should Not be Empty !"); // Set snackbar text
  //     setsnackbarSeverity("error"); // Set snackbar severity to error
  //     return;
  //   }

  //   // Check if a reviewer is selected, show an error message if not
  //   if (
  //     selectedReviwer === "" ||
  //     selectedReviwer === undefined ||
  //     selectedReviwer === null
  //   ) {
  //     setSnackbarOpen(true); // Open the snackbar
  //     setSnackbarText("Choose reviewer !"); // Set snackbar text
  //     setsnackbarSeverity("error"); // Set snackbar severity to error
  //     return;
  //   }

  //   // Handle case where task details are null or empty
  //   if (
  //     dbTaskDetails === null ||
  //     dbTaskDetails === undefined ||
  //     dbTaskDetails === ""
  //   ) {
  //     if (
  //       taskList !== undefined &&
  //       taskList !== null &&
  //       taskList !== "" &&
  //       taskList.length !== 0
  //     ) {
  //       // Add any logic for handling taskList if necessary
  //     }
  //   }

  //   // Determine taskId, either from dbTaskDetails or taskDetails, or generate a new one
  //   let taskId =
  //     dbTaskDetails?.taskId !== "" &&
  //     dbTaskDetails?.taskId !== undefined &&
  //     dbTaskDetails?.taskId !== null
  //       ? dbTaskDetails?.taskId
  //       : taskDetails?.taskId !== "" &&
  //         taskDetails?.taskId !== undefined &&
  //         taskDetails?.taskId !== null
  //       ? taskDetails?.taskId
  //       : generateTaskId(); // Generate a new task ID if none exists

  //   // Determine the task status, defaulting to "Not Ready"
  //   let status =
  //     dbTaskDetails?.status !== "" &&
  //     dbTaskDetails?.status !== undefined &&
  //     dbTaskDetails?.status !== null
  //       ? dbTaskDetails?.status
  //       : "Not Ready";

  //   // Get the logged-in user ID from session storage
  //   const env_userId = process.env.REACT_APP_USERID;
  //   const user = localStorage.getItem(env_userId);

  //   // Determine the task creator, using the dbTaskDetails or decrypting the logged-in user
  //   let creator =
  //     dbTaskDetails?.creator !== "" &&
  //     dbTaskDetails?.creator !== undefined &&
  //     dbTaskDetails?.creator !== null
  //       ? dbTaskDetails?.creator
  //       : decryptTokenId(user);

  //   // Determine the tenantId, either from dbTaskDetails or using a fallback method
  //   const tenantId =
  //     dbTaskDetails?.tenantId !== "" &&
  //     dbTaskDetails?.tenantId !== undefined &&
  //     dbTaskDetails?.tenantId !== null
  //       ? dbTaskDetails?.tenantId
  //       : getTenantID();

  //   // Create a new task object with all the relevant details
  //   const newTask = {
  //     creationTime: new Date(), // Set the creation time to the current date and time
  //     taskId: taskId, // Set the task ID
  //     taskName: taskName, // Set the task name
  //     creator:
  //       creator === undefined || creator === null
  //         ? decryptTokenId(user) // If creator is null, use the logged-in user
  //         : creator,
  //     reviewer: selectedReviwer, // Set the selected reviewer
  //     assetGroup: selectedAssetGroup, // Set the selected asset group
  //     description: description, // Set the task description
  //     activityList: activityList, // Set the list of activities
  //     status: status === undefined || status === null ? "Not Ready" : status, // Default to "Not Ready" if status is null
  //     tenantId:
  //       tenantId === undefined || tenantId === null ? getTenantID() : tenantId, // Default to a tenant ID if null
  //       addhocTask:true
  //   };

  //   // Save the task through the API and handle the response status
  //   const apiStatus = await handleSaveTask(newTask);
  //   if (
  //     apiStatus !== null &&
  //     apiStatus !== undefined &&
  //     apiStatus !== "" &&
  //     (apiStatus === 200 || apiStatus === 201)
  //   ) {
  //     setTaskDetails(newTask); // Update task details with the saved task
  //     setSnackbarOpen(true); // Open the snackbar
  //     setSnackbarText("Task Save as Draft !"); // Set snackbar text
  //     setsnackbarSeverity(); // Set snackbar severity (default)
  //     stepperRef.current.nextCallback(); // Proceed to the next step in the stepper
  //     setActiveStep(activeStep + 1); // Move to the next active step
  //   } else {
  //     setSnackbarOpen(true); // Open the snackbar
  //     setSnackbarText("Database Error !"); // Set snackbar text to indicate an error
  //     setsnackbarSeverity("error"); // Set snackbar severity to error
  //   }
  // };

  // Objective: Checks if the task name is already present in the taskList.
  // Params: taskList (array) - list of tasks, selectedTaskName (string) - the task name to check.
  function isTaskNamePresent(taskList, selectedTaskName) {
    const normalizedSelectedTaskName = selectedTaskName.trim().toLowerCase(); // Normalize the selected task name
    for (let task of taskList) {
      if (task.taskName.trim().toLowerCase() === normalizedSelectedTaskName) {
        // Check if any task in the list matches
        setIsTaskNameMatched(true); // Set the task name matched flag to true
        return true;
      }
    }
    setIsTaskNameMatched(false); // Set the task name matched flag to false if no match
    return false;
  }

  // Objective: Handles the change event for the task name input and debounces the task name validation.
  const handleChange = (e) => {
    const { value } = e.target; // Get the value from the event
    setTaskName(value); // Update the task name state
    if (dbTaskDetails === null || dbTaskDetails === undefined) {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current); // Clear the existing timeout to debounce
      }

      debounceTimeout.current = setTimeout(() => {
        isTaskNamePresent(taskList, value); // Call task name validation after 500ms delay
      }, 500);
    }
  };

  // Objective: Saves the draft activity, validating connections, updating positions, and saving activities and edges.
  const handleSaveDraftActivity = async () => {
    // Check if the task is already published or pending, proceed to the next step if true
    if (
      dbTaskDetails?.status === "Published" ||
      dbTaskDetails?.status === "Pending"
    ) {
      stepperRef.current.nextCallback(); // Move to the next step
      return;
    }

    // Check if the activity list is empty, show an error message if true
    if (activityList?.length === 0) {
      setSnackbarText("Create at least one activity !"); // Set snackbar text for error
      setsnackbarSeverity("error"); // Set snackbar severity to error
      setSnackbarOpen(true); // Open the snackbar
      return;
    }

    // Check if all nodes are connected, show an error message if not
    let cnnection = checkConnections();
    if (!cnnection) {
      setSnackbarOpen(true); // Open the snackbar
      setSnackbarText("All nodes should be connected with any node"); // Set snackbar text for error
      setsnackbarSeverity("error"); // Set snackbar severity to error
      return;
    }

    setActiveStep(activeStep + 1); // Move to the next step

    // Update the activity list with node positions and sequences
    const updatedActivityList = activityList.map((activity) => {
      const matchingNode = nodes.find(
        (node) => node.id === activity.activityId
      );

      if (matchingNode) {
        return {
          ...activity,
          sequence: matchingNode.data.sequence, // Set the sequence from the node data
          xPos: matchingNode.position.x, // Set the x position from the node
          yPos: matchingNode.position.y, // Set the y position from the node
        };
      }

      return activity; // Return the activity unchanged if no matching node found
    });

    setActivityList(updatedActivityList); // Update the state with the modified activity list
    setTaskDetails({
      ...taskDetails,
      activityList: updatedActivityList, // Update the task details with the updated activity list
    });

    // Prepare the edges list with task and connection details
    let edgesList = [];

    edges.forEach((edge) => {
      const newEdge = {
        taskId: taskDetails.taskId, // Set the task ID
        sourceId: edge.source, // Set the source node ID
        source: edge.data.sourceName, // Set the source node name
        targetId: edge.target, // Set the target node ID
        target: edge.data.targetName, // Set the target node name
        tenantId: getTenantID(), // Set the tenant ID
      };
      edgesList = [...edgesList, newEdge]; // Add the new edge to the list
    });

    // Create the parsed task object for saving
    const parsed = {
      ...taskDetails,
      activityList: updatedActivityList, // Include the updated activity list
    };

    // Calculate the total duration of all activities
    const totalDuration = calculateTotalDuration(updatedActivityList);

    setTaskTotalDuration(totalDuration); // Update the total duration state

    // If no edges are present, set default empty values
    if (edgesList.length === 0) {
      edgesList = [
        {
          taskId: null, // Set taskId to null if no edges
          sourceId: null, // Set sourceId to null
          source: null, // Set source to null
          targetId: null, // Set targetId to null
          target: null, // Set target to null
        },
      ];
    }

    // Save the activity connections to the backend
    const apiStatus1 = await handleSaveActivityConnections(edgesList);

    // Save the task with the updated activity list
    const apiStatus = await handleSaveTask(parsed);

    // Check if both API calls were successful
    if (
      apiStatus !== null &&
      apiStatus !== undefined &&
      apiStatus !== "" &&
      (apiStatus === 200 || apiStatus === 201) &&
      apiStatus1 !== null &&
      apiStatus1 !== undefined &&
      apiStatus1 !== "" &&
      (apiStatus1 === 200 || apiStatus1 === 201)
    ) {
      setSnackbarOpen(true); // Open the snackbar
      setSnackbarText("Activities Saved Successfully"); // Set snackbar text for success
      setsnackbarSeverity("success"); // Set snackbar severity to success

      stepperRef.current.nextCallback(); // Move to the next step in the stepper
    }
  };

  // Objective: Handles the click event for adding an asset, with validations for activity name and abbreviation.
  const handleAddAssetClick = () => {
    // Validate if activity name is empty, show an error if true
    if (
      activityName === "" ||
      activityName === undefined ||
      activityName === null
    ) {
      setSnackbarOpen(true); // Open the snackbar
      setSnackbarText("Activity Name Should Not be Empty !"); // Set snackbar text for error
      setsnackbarSeverity("error"); // Set snackbar severity to error
      return;
    }

    // Validate if activity abbreviation or selected reviewer is empty, show an error if true
    if (
      activityAbbr === "" ||
      activityAbbr === undefined ||
      selectedReviwer === null
    ) {
      setSnackbarOpen(true); // Open the snackbar
      setSnackbarText("Activity Abbreviation should not be empty !"); // Set snackbar text for error
      setsnackbarSeverity("error"); // Set snackbar severity to error
      return;
    }

    setAssetDlg(true); // Open the asset dialog
  };

  // Objective: Deletes a group from asset logbook data and shows a success message.
  const deleteGroup = async () => {
    setsnackbarSeverity("success"); // Set snackbar severity to success
    setSnackbarText("Row Deleted Successfully"); // Set snackbar text for success
    setSnackbarOpen(true); // Open the snackbar

    // Filter out the row with the assetId and update the state
    setAssetLogbookData(
      assetLogbookData.filter((row) => row.assetId !== assetId)
    );
    setDelOpen(false); // Close the delete confirmation dialog
  };

  // Objective: Retrieves the tenant ID by decrypting it from the session storage.
  const getTenantID = () => {
    const env_tenant = process.env.REACT_APP_TENANTID; // Get the tenant ID from environment variables
    const encryptedTenant = localStorage.getItem(env_tenant); // Get the encrypted tenant ID from session storage
    const tenant = decryptTokenId(encryptedTenant); // Decrypt the tenant ID

    return tenant; // Return the tenant ID
  };

  // Objective: Handles the click event for adding an asset logbook, with validations for groups and duplicate entries.
  const handleAddAssetLogbookClick = () => {
    // Validate if a group is selected, show an error if false
    // if (!selectedGroups) {
    //   setSnackbarOpen(true); // Open the snackbar
    //   setSnackbarText("Please select a group !"); // Set snackbar text for error
    //   setsnackbarSeverity("error"); // Set snackbar severity to error
    //   return;
    // }

    // Prepare the new asset logbook object
    const newAssetLogbook = {
      assetId: selectedNode.id, // Set the asset ID from the selected node
      logbook: selectedLogbooks === undefined ? "" : selectedLogbooks, // Set logbook
      asset: selectedNode.assetName, // Set asset name
      groups: selectedGroups, // Set selected group
      department: selectedNode.department, // Set department
    };

    // Add the new asset logbook if the logbook data is empty
    if (assetLogbookData?.length === 0) {
      setAssetLogbookData([...assetLogbookData, newAssetLogbook]); // Update asset logbook data
      setSnackbarOpen(true); // Open the snackbar
      setSnackbarText("Added successfully"); // Set snackbar text for success
      setsnackbarSeverity("success"); // Set snackbar severity to success

      // Reset the selected values
      setSelectedLogbooks("");
      setSelectedGroups();
      setSelectedNode(null);

      return;
    }

    // Check if the asset already exists in the logbook data
    if (
      assetLogbookData?.length !== 0 &&
      assetLogbookData !== undefined &&
      assetLogbookData !== null
    ) {
      const assetExists = assetLogbookData?.some(
        (asset) =>
          asset.asset === selectedNode.assetName && // Check if asset name matches
          asset.assetId === selectedNode.id // Check if asset ID matches
      );

      // Show an error if the asset is already added
      if (assetExists) {
        setSnackbarOpen(true); // Open the snackbar
        setSnackbarText("Asset already added"); // Set snackbar text for error
        setsnackbarSeverity("error"); // Set snackbar severity to error
        return;
      }
    }

    // Check if the group already exists in the logbook data
    const userGroup = assetLogbookData?.some(
      (asset) => asset?.groups?.trim() === selectedGroups?.trim()
    );

    // Check if the logbook already exists in the logbook data
    const logbookExists = assetLogbookData?.some((asset) => {
      return (
        (asset?.logbook === undefined || asset?.logbook === null
          ? false
          : asset?.logbook) ===
        (selectedLogbooks === undefined || selectedLogbooks === null
          ? false
          : selectedLogbooks)
      );
    });

    // Add the logbook if the group and logbook match the selected values
    if (userGroup) {
      if (logbookExists) {
        setAssetLogbookData([...assetLogbookData, newAssetLogbook]); // Update asset logbook data
        setSelectedLogbooks(""); // Reset logbook
        setSelectedGroups(); // Reset group
        setSelectedNode(null); // Reset selected node
        setSnackbarOpen(true); // Open the snackbar
        setSnackbarText("Added successfully"); // Set snackbar text for success
        setsnackbarSeverity("success"); // Set snackbar severity to success
      } else {
        // Show an error if the logbook does not match
        setSnackbarOpen(true);
        setSnackbarText("Logbook should be same");
        setsnackbarSeverity("error");
      }
    } else {
      // Show an error if the group does not match
      setSnackbarText("Group Should be same");
      setsnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

  const handleFromDateChange = (date) => {
    if(!date) return;
    console.log('Date changed : ',date)
    setProcessDbRequest(true); // start processing
  
    const selectedDate = dayjs(date);
    const currentJobStart = dayjs(jobStartDate);
  
    console.log("Date:", selectedDate.format('YYYY-MM-DD HH:mm:ss'));
    console.log("JobStartDate:", currentJobStart.format('YYYY-MM-DD HH:mm:ss'));
  
    // if (currentJobStart.isBefore(selectedDate)) {
    //   console.warn('Current JobStartTime is less than current datetime');
    //   console.info('Modifying dates with current time');
      
    //   setJobStartDate(selectedDate.toDate()); // always set a Date object
    //   setActivityList(fetchCurrentActivityList(activityList, currentJobStart.toDate(), 7));
    //   return;
    // } 
    // console.log('Changing to default datetime : ')
    // else {
    //   console.log('')
      setJobStartDate(selectedDate.toDate());
      setActivityList(fetchCurrentActivityList(activityList, selectedDate.toDate(), 7));
    // }
  
    setProcessDbRequest(false); // done
  };
  

  // Objective: Renders the header for the table with a search input field.
  const renderHeader = () => {
    return (
      <div
        className="table-header"
        style={{
          display: isMobile ? "grid" : "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "0rem 0.8rem",
        }}
      >
        {/* <h5 className="mx-0 my-1">Manage Groups</h5> */}
        <h4 className="mx-0 my-1">Job Overview</h4>
        
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            className="p-inputtext-sm"
            onInput={(e) => setGlobalFilter(e.target.value)}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };

  // Header component for the table
  const header = renderHeader();

  // Objective: Handle adding a new node and updating the relevant activity details.
  const addNode = () => {
    // Check if the activity name is empty, undefined, or null
    if (
      activityName?.trim() === "" ||
      activityName?.trim() === undefined ||
      activityName?.trim() === null
    ) {
      setSnackbarOpen(true);
      setSnackbarText("Activity Name Should Not be Empty !");
      setsnackbarSeverity("error");
      return;
    }

    // Check if the activity abbreviation is empty, undefined, or null
    if (
      activityAbbr?.trim() === "" ||
      activityAbbr?.trim() === undefined ||
      activityAbbr?.trim() === null
    ) {
      setSnackbarOpen(true);
      setSnackbarText("Activity Abbreviation Should Not be Empty !");
      setsnackbarSeverity("error");
      return;
    }

    const duration = hours * 60 + minutes;

    // Check if the duration is zero
    if (duration === 0) {
      setSnackbarOpen(true);
      setSnackbarText("Duration can't be Zero (0) ");
      setsnackbarSeverity("error");
      return;
    }

    let activityId = "";

    // Check if an activity ID already exists in the activity list
    if (
      activityList.activityId !== null &&
      activityList.activityId !== undefined
    ) {
      activityId = activityList.activityId;
    } else {
      activityId = generateActivityId();
    }

    const x = initXpos + 10;
    const y = initYpos + 10;

    setInitXpos(x);
    setInitYpos(y);

    // If the activity name and ID are valid, create a new node
    if (activityName?.trim() && activityId?.trim()) {
      const newNode = {
        id: activityId,
        type: "customNode",
        data: { label: activityName, sequence: 1 ,duration: duration},
        position: { x: x, y: y },
      };

      setNodes((nds) => [...nds, newNode]);

      const assets =
        assetLogbookData.length !== 0
          ? assetLogbookData.map((asset) => asset.asset).join(",")
          : "";

      const assetIds =
        assetLogbookData.length !== 0
          ? assetLogbookData.map((asset) => asset.assetId).join(",")
          : "";

      const activityLogbook =
        assetLogbookData?.length > 0 ? assetLogbookData[0].logbook : "";

      const withoutAssetactivityGroup =
        withoutAssetLogbookData?.length > 0
          ? withoutAssetLogbookData[0]?.groups
          : "";

      const withoutAssetactivityLogbook =
        withoutAssetLogbookData?.length > 0
          ? withoutAssetLogbookData[0]?.logbook
          : "";

      const activityGroups = Array.isArray(assetLogbookData[0]?.groups)
        ? assetLogbookData[0]?.groups
        : typeof assetLogbookData[0]?.groups === "string"
        ? assetLogbookData[0]?.groups.split(", ")
        : [];

      // Define the new activity with all the relevant details
      const newActivity = {
        taskId: taskDetails.taskId,
        actAbrv: activityAbbr,
        activityId: newNode.id,
        activityName: newNode.data.label,
        xPos: newNode.position.x,
        yPos: newNode.position.y,
        sequence: newNode.data.sequence,
        assetName: '',
        assetId: '',
        assetIDList: assetIds ? assetIds.split(','):[],
        assetNameList:assetIds  ? assets.split(","):[],  
        logbook:
          activityLogbook === null ||
          activityLogbook === undefined ||
          activityLogbook === ""
            ? withoutAssetactivityLogbook
            : activityLogbook,
        enforce: checked,
        buffer: buffer,
        enforceStartDuration: enforceStartDuration,
        duration: duration,
        minutes: minutes,
        hours: hours,
        assetLogbookData: assetLogbookData,
        withoutAssetLogbookData: withoutAssetLogbookData,
        userDept: "",
        userGroup:
          activityGroups === null ||
          activityGroups === undefined ||
          activityGroups === "" ||
          activityGroups?.length === 0
            ? withoutAssetactivityGroup
            : activityGroups === ""
            ? ""
            : activityGroups?.join(),
        activityUserGroupList:
          activityGroups === null ||
          activityGroups === undefined ||
          activityGroups === "" ||
          activityGroups?.length === 0
            ? [withoutAssetactivityGroup]
            : activityGroups === "" ||
              activityGroups === null ||
              activityGroups === undefined
            ? []
            : activityGroups,
        tenantId: getTenantID(),
        creationTime: new Date(),
        actvityStatus: "Not Started",
      };

      // Update the task details and activity list with the new activity
      console.log("New Activity : ", newActivity);
      console.log('Set Task Details : ', {
        ...taskDetails,
        activityList: [...taskDetails.activityList, newActivity],
      });
      setTaskDetails({
        ...taskDetails,
        activityList: [...taskDetails.activityList, newActivity],
      });
      setActivityList([...activityList, newActivity]);
    }

    // Reset form fields after adding the node
    setActivityAbbr("");
    setActivityName("");
    setHours(0);
    setMinutes(0);
    setBuffer(0);
    setIsPublicAccess(false);
    setEnforceStartDuration(0);
    setAssetLogbookData([]);
    setWithoutAssetLogbookData([]);
    setSelectedLogbooks("");
    handleOnCancelClick();
  };

  // Objective: Check if all nodes are connected within the graph.
  const checkConnections = () => {
    // If only one node exists, it's trivially connected.
    console.log('Current Nodes : ',nodes)
    console.log('Activity Details : ',activityList)
    if (nodes.length === 1) {
      return true;
    }

    const visited = new Set();
    const queue = [nodes[0]?.id];

    // Perform a breadth-first search to visit all nodes connected by edges
    while (queue.length > 0) {
      const currentNodeId = queue.shift();
      if (!visited.has(currentNodeId)) {
        visited.add(currentNodeId);
        edges.forEach((edge) => {
          // Add connected nodes to the queue if not visited
          if (edge.source === currentNodeId && !visited.has(edge.target)) {
            queue.push(edge.target);
          } else if (
            edge.target === currentNodeId &&
            !visited.has(edge.source)
          ) {
            queue.push(edge.source);
          }
        });
      }
    }



    // If all nodes are visited, the graph is connected
    console.log('Visited Nodes : ',visited)
    console.log('All Nodes : ',nodes)
    if (visited.size === nodes.length) {
      return true;
    } else {
      return false;
    }
  };

  // Objective: Handle node click event and populate activity details for editing.
  const onNodeClick = (event, node) => {
    // Prevent any actions if the task is "Published" or "Pending"
    // if (
    //   dbTaskDetails?.status === "Published" ||
    //   dbTaskDetails?.status === "Pending"
    // ) {
    //   return;
    // }

    // Reset logbook data and populate the clicked node's details
    setWithoutAssetLogbookData([]);
    setAssetLogbookData([]);
    setActivityName(node.data.label);
    setUpdatedActivityName(node.data.label);
    setSelectedNodeId(node.id);

    // Find the corresponding activity details from the activity list
    const foundActivity = activityList.find(
      (activity) => activity.activityId === node.id
    );

    if (foundActivity) {
      // console.log("My Found Activity : ", foundActivity);
      // console.log("withoutAssetLogbookData : ", withoutAssetLogbookData);
      // Populate the activity abbreviation and other properties for editing
      setActivityAbbr(foundActivity.actAbrv);
      setActivityName(foundActivity.activityName);

      setMinutes(foundActivity.duration % 60);
      setBuffer(foundActivity.buffer);
      setIsPublicAccess(foundActivity?.enforceStartDuration > 0 ? true : false);
      setEnforceStartDuration(foundActivity.enforceStartDuration);
      setChecked(foundActivity.enforce);
      setHours(Math.floor(foundActivity.duration / 60));
      setDlgVisible(true);
      setButtonShow(false);

      // Set asset logbook data, if available
      if (
        foundActivity.assetLogbookData !== null &&
        foundActivity.assetLogbookData !== undefined
      ) {
        setAssetLogbookData(foundActivity.assetLogbookData);
      } else {
        // Map asset details if available
        const assetLogbookData = foundActivity
          ? foundActivity?.assetIDList?.map((assetId, index) => ({
              assetId: assetId,
              logbook: foundActivity.logbook,
              asset: foundActivity.assetNameList[index],
              groups: foundActivity?.activityUserGroupList[0],
              department: foundActivity.userDept,
            }))
          : [];

        // Check if asset data is available, otherwise set an empty array
        if (assetLogbookData?.length > 0) {
          if (assetLogbookData[0].assetId !== "") {
            setAssetLogbookData(assetLogbookData);
          } else {
            setAssetLogbookData([]);
          }
        } else {
          setAssetLogbookData(assetLogbookData);
        }
      }

      // Set logbook data for activities without assets, if applicable
      if (
        foundActivity.withoutAssetLogbookData !== null &&
        foundActivity.withoutAssetLogbookData !== undefined
      ) {
        setWithoutAssetLogbookData(foundActivity.withoutAssetLogbookData);
      } else {
        // Handle the case where no asset data exists but user groups are defined
        if (
          (foundActivity.assetId === "" ||
            foundActivity.assetId === null ||
            foundActivity.assetId === undefined) &&
          foundActivity?.activityUserGroupList[0] !== ""
        ) {
          let WithoutAssetLogbookData = [];
         if( foundActivity?.activityUserGroupList[0] )
         {
          WithoutAssetLogbookData = [
            {
              groups: foundActivity?.activityUserGroupList[0],
              logbook: foundActivity.logbook,
            },
          ];
        }

          if (WithoutAssetLogbookData.length > 0) {
            setWithoutAssetLogbookData(WithoutAssetLogbookData);
          } else {
            setWithoutAssetLogbookData([]);
          }
        }
      }
    }
  };

  // Objective: Update the name and details of a selected node in the graph.
  const updateNodeName = () => {
    // Proceed if a node is selected
    if (selectedNodeId) {
      let tempNode = null;

      // Update the node's label and store the node temporarily
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNodeId) {
            tempNode = node;
            return { ...node, data: { ...node.data, label: activityName,duration: hours * 60 + minutes } };
          } else {
            return node;
          }
        })
      );

      // Extract asset details for the updated activity
      const assets =
        assetLogbookData.length !== 0
          ? assetLogbookData.map((asset) => asset.asset).join(",")
          : "";

      const assetIds =
        assetLogbookData.length !== 0
          ? assetLogbookData.map((asset) => asset.assetId).join(",")
          : "";

      const activityLogbook =
        assetLogbookData?.length > 0 ? assetLogbookData[0].logbook : "";

      const duration = hours * 60 + minutes;

      const withoutAssetactivityGroup =
        withoutAssetLogbookData?.length > 0
          ? withoutAssetLogbookData[0]?.groups
          : "";

      const withoutAssetactivityLogbook =
        withoutAssetLogbookData?.length > 0
          ? withoutAssetLogbookData[0]?.logbook
          : "";

      // Determine the activity groups
      const activityGroups = Array.isArray(assetLogbookData[0]?.groups)
        ? assetLogbookData[0]?.groups
        : typeof assetLogbookData[0]?.groups === "string"
        ? assetLogbookData[0]?.groups.split(", ")
        : [];

      // Create an updated activity object with new details
      const updatedActivity = {
        taskId: taskDetails.taskId,
        actAbrv: activityAbbr,
        activityId: selectedNodeId,
        activityName: activityName,
        xPos: tempNode !== null ? tempNode.position.x : 0,
        yPos: tempNode !== null ? tempNode.position.y : 0,
        sequence: tempNode !== null ? tempNode.data.sequence : 1,
        assetName: '',
        assetId: '',
        assetIDList: assetIds ? assetIds.split(','):[],
        assetNameList:assets  ? assets.split(","):[],
        logbook:
          activityLogbook === null ||
          activityLogbook === undefined ||
          activityLogbook === ""
            ? withoutAssetactivityLogbook
            : activityLogbook,
        enforce: checked,
        buffer: buffer,
        enforceStartDuration: enforceStartDuration,
        duration: duration,
        minutes: minutes,
        hours: hours,
        assetLogbookData: assetLogbookData,
        withoutAssetLogbookData: withoutAssetLogbookData,
        userDept: activityDepartment,
        userGroup:
          activityGroups === null ||
          activityGroups === undefined ||
          activityGroups === "" ||
          activityGroups?.length === 0
            ? withoutAssetactivityGroup
            : activityGroups?.join(),
        activityUserGroupList:
          activityGroups === null ||
          activityGroups === undefined ||
          activityGroups === "" ||
          activityGroups?.length === 0
            ? [withoutAssetactivityGroup]
            : activityGroups,
        tenantId: getTenantID(),
        creationTime: new Date(),
      };

      // Update the activity list with the modified activity
      const updatedActivityList = activityList.map((activity) => {
        if (activity.activityId === selectedNodeId) {
          return { ...activity, ...updatedActivity };
        }
        return activity;
      });

      setActivityList(updatedActivityList);
      handleOnCancelClick();
    }
  };

  // Objective: Delete a selected node from the graph and update the activity list accordingly.
  const deleteNode = () => {
    // Proceed if a node is selected
    if (selectedNodeId) {
      // Remove the selected node and its edges from the state
      const newNodes = nodes.filter((node) => node.id !== selectedNodeId);
      const newEdges = edges.filter(
        (edge) =>
          edge.source !== selectedNodeId && edge.target !== selectedNodeId
      );
      setNodes(newNodes);
      setEdges(newEdges);
      setSelectedNodeId(null);

      // Update the activity list by filtering out the deleted activity
      const updatedActivityList = activityList.filter(
        (activity) => activity.activityId !== selectedNodeId
      );

      setActivityList(updatedActivityList);
      setTaskDetails({ ...taskDetails, activityList: updatedActivityList });
      handleOnCancelClick();
    }
  };
  // Objective: Handle the saving of task details for approval based on user role.
  const handleSaveForApproval = async () => {
    // Check if the task is already published or pending; if so, prevent further action
    if (
      dbTaskDetails?.status === "Published" ||
      dbTaskDetails?.status === "Pending"
    ) {
      setShowCreation(false);
      return;
    }

    // Retrieve and decrypt the logged-in user ID from session storage
    const loggedInUserIncrpited = localStorage.getItem(
      process.env.REACT_APP_USERID
    );
    const loggedInUser = decryptTokenId(loggedInUserIncrpited);

    // Prepare updated data based on the logged-in user's role
    let updatedData = {};
    if (loggedInUser?.toLowerCase() === taskDetails.reviewer?.toLowerCase()) {
      updatedData = { ...taskDetails, status: "Published" };
    } else {
      updatedData = { ...taskDetails, status: "Pending" };
    }

    // Call the API to save the task details and check the response status
    const apiStatus = await handleSaveTask(updatedData);

    if (
      apiStatus !== null &&
      apiStatus !== undefined &&
      apiStatus !== "" &&
      (apiStatus === 200 || apiStatus === 201)
    ) {
      // Show success message if the API call was successful
      setSnackbarOpen(true);
      setSnackbarText("Approval Sent Successfully");
      setsnackbarSeverity("success");

      // Reset task details and close the creation form
      setTaskDetails();
      setActivityList([]);
      setShowCreation(false);
    } else {
      // Show error message if the API call failed
      setSnackbarOpen(true);
      setSnackbarText("Database Error !");
      setsnackbarSeverity("error");
    }
  };

  // Objective: Reset the activity form fields and states when canceling.
  const handleOnCancelClick = () => {
    // Reset all related state variables to their initial values
    setActivityAbbr("");
    setActivityName("");
    setHours(0);
    setMinutes(0);
    setBuffer(0);
    setIsPublicAccess(false);
    setEnforceStartDuration(0);
    setAssetLogbookData([]);
    setSelectedLogbooks("");
    setChecked();
    setButtonShow(true);
    setUpdatedActivityName("");
    setWithoutAssetLogbookData([]);
    setSelectedGroups("");
    setWithoutAssetSelectedGroups("");
  };


  const handleNextSecondStep =  () => {
    // if (
    //   dbTaskDetails?.status === "Published" ||
    //   dbTaskDetails?.status === "Pending"
    // ) {
    //   console.log("Published Task passed");
    //   stepperRef.current.nextCallback();
    //   return;
    // }
    if (activityList?.length === 0) {
      setSnackbarText("Create atleast one activity !");
      setsnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    let cnnection = checkConnections();
    if (!cnnection) {
      setSnackbarOpen(true);
      setSnackbarText("All nodes should be connected with any node");
      setsnackbarSeverity("error");
      return;
    }
    setActiveStep(activeStep + 1);
    console.log("AllISWEll2 : ", activityList);
    console.log("AllISWEll 3 : ", taskDetails);
    console.log("NodeLIst : ", nodes);
    const updatedActivityList = activityList.map((activity) => {
      const matchingNode = nodes.find(
        (node) => node.id === activity.activityId
      );

      if (matchingNode) {
        return {
          ...activity,
          sequence: matchingNode.data.sequence,
          xPos: matchingNode.position.x,
          yPos: matchingNode.position.y,
        };
      }

      return activity;
    });
    console.log("ACtivity Sequence : ", updatedActivityList);
    setActivityList(updatedActivityList);
    setTaskDetails({
      ...taskDetails,
      activityList: updatedActivityList,
      reviewer: selectedReviwer
    });
    console.log("Modified Task ", {
      ...taskDetails,
      activityList: updatedActivityList,
    });

    // console.log(
    //   "posted data : ",
    //   json.stringify(
    //     json.parse({
    //       ...taskDetails,
    //       activityList: updatedActivityList,
    //     })
    //   )
    // );

    let edgesList = [];

    edges.forEach((edge) => {
      const newEdge = {
        taskId: taskDetails.taskId,
        sourceId: edge.source,
        source: edge.data.sourceName,
        targetId: edge.target,
        target: edge.data.targetName,
        tenantId: getTenantID(),
      };
      edgesList = [...edgesList, newEdge];
    });

    console.log("EdgesList : ", edgesList);

    console.log(
      "EdgesList Strigyfy : ",
      JSON.stringify({
        edgesList,
      })
    );
    console.log(
      "Final JSON",
      JSON.stringify({
        ...taskDetails,
        activityList: updatedActivityList,
      })
    );
    const parsed = {
      ...taskDetails,
      activityList: updatedActivityList,
    };

    const sequenceDurationMap = updatedActivityList.reduce((acc, activity) => {
      const { sequence, duration } = activity;
      if (!acc[sequence] || acc[sequence] < duration) {
        acc[sequence] = duration;
      }
      return acc;
    }, {});

    const totalDuration = Object.values(sequenceDurationMap).reduce(
      (sum, duration) => sum + duration,
      0
    );
    console.log("Task Total Duration : ", totalDuration);

    setTaskTotalDuration(totalDuration);

    console.log("New Json : ", parsed);
    

    const scheduledStart=activityList[0]?.scheduledActivityStartTime?? new Date();
    console.log('Current Task Details : ',taskDetails);
    console.log('Current Activity List : ',updatedActivityList);
    console.log('Schedule Start of first Activity: ',scheduledStart);
    const calculatedActivityList=fetchCurrentActivityList(updatedActivityList,scheduledStart,7);
    console.log('Calculated Activity List : ',calculatedActivityList);
    setActivityList(calculatedActivityList);


    // const now = new Date();

    // if(!dbTaskDetails)
    //   setJobStartDate(new Date(now.getTime() + 5 * 60 * 1000));
    // const apiStatus1 = await handleSaveActivityConnections(edgesList);
    // // await handleSaveTask(parsed);
    // const apiStatus = await handleSaveTask(parsed);
    // if (
    //   apiStatus !== null &&
    //   apiStatus !== undefined &&
    //   apiStatus !== "" &&
    //   (apiStatus === 200 || apiStatus === 201) &&
    //   apiStatus1 !== null &&
    //   apiStatus1 !== undefined &&
    //   apiStatus1 !== "" &&
    //   (apiStatus1 === 200 || apiStatus1 === 201)
    // ) {
    //   setSnackbarOpen(true);
    //   setSnackbarText("Acvities Saved Successfully");
    //   setsnackbarSeverity("success");

      stepperRef.current.nextCallback();
    // }
  };


  // Objective: Render an action button for deleting an asset in a row.
  const actionTemplate = (rowData) => {
    return (
      <Button
        icon="pi pi-trash"
        className="p-button-danger"
        rounded
        size="small"
        text
        raised
        onClick={() => {
          setAssetId(rowData.assetId); // Set the selected asset ID for deletion
          setDelOpen(true); // Open the deletion confirmation dialog
        }}
      />
    );
  };

  // Styling for the form groups based on mobile or desktop layout
  const formGroupStyle = {
    display: isMobile ? "grid" : "flex",
    alignItems: "center",
    marginBottom: "1rem",
  };

  const labelStyle = {
    marginRight: "2rem",
    width: "150px",
    fontSize: "0.95rem",
  };

  const formWrapperStyle = {
    display: "flex",
    justifyContent: "center",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: isMobile ? "center" : "",
    width: isMobile ? "11rem" : "",
  };

  // Objective: Handle tab change events based on asset logbook data availability.
  const handleTabChange = (e) => {
    const currentIndex = activeIndex === 1 ? 0 : 1;
    if (currentIndex === 1) {
      // If switching to the second tab, check if there is data available
      if (assetLogbookData?.length !== 0) {
        setTabChangeOpen(true); // Open confirmation dialog if data exists
      } else {
        setActiveIndex(e.index); // Switch to the selected tab
      }
    } else {
      // If switching to the first tab, check if there is data available
      if (withoutAssetLogbookData?.length !== 0) {
        setTabChangeOpen(true); // Open confirmation dialog if data exists
      } else {
        setActiveIndex(e.index); // Switch to the selected tab
      }
    }
  };

  // Objective: Handle tab change and clear the corresponding logbook data.
  const tabchange = () => {
    const currentIndex = activeIndex === 1 ? 0 : 1;
    if (currentIndex === 0) {
      // Clear data when switching to the first tab
      setWithoutAssetLogbookData([]);
      setActiveIndex(currentIndex); // Set the active index to the first tab
    } else {
      // Clear data when switching to the second tab
      setAssetLogbookData([]);
      setActiveIndex(currentIndex); // Set the active index to the second tab
    }
  };

  // Objective: Handle the addition of logbook data for without asset groups.
  const handleWithoutAssetAddAssetLogbookClick = () => {
    // Check if a group has been selected
    if (!withoutAssetselectedGroups) {
      setSnackbarOpen(true);
      setSnackbarText("Please select a group !");
      setsnackbarSeverity("error");
      return;
    }

    // Prepare new logbook data if a group is selected
    const newData = {
      groups: withoutAssetselectedGroups?.groupName,
      logbook: withoutAssetSelectedLogbooks,
    };

    // Check if logbook data is empty, allowing for a new entry
    if (withoutAssetLogbookData?.length === 0) {
      setWithoutAssetLogbookData([...withoutAssetLogbookData, newData]); // Add new logbook data

      setSnackbarOpen(true);
      setSnackbarText("Added successfully !");
      setsnackbarSeverity("success");
      setWithoutAssetSelectedGroups(""); // Clear selected groups
      setWithoutAssetSelectedLogbooks(""); // Clear selected logbooks
      return;
    } else {
      // Show an error message if trying to add more than one group
      setSnackbarOpen(true);
      setSnackbarText("Only one group is allowed !");
      setsnackbarSeverity("error");
      setWithoutAssetSelectedGroups(""); // Clear selected groups
      setWithoutAssetSelectedLogbooks(""); // Clear selected logbooks
    }
  };

  // Objective: Handle the deletion of a specific logbook entry.
  const handleDelete = (rowData) => {
    // Filter out the rowData from the without asset logbook data
    setWithoutAssetLogbookData(
      withoutAssetLogbookData.filter((item) => item !== rowData)
    );
  };

  // Objective: Format a duration given in minutes into a string representation.
  function formatDuration(minutes) {
    const days = Math.floor(minutes / 1440); // Calculate days
    const hours = Math.floor((minutes % 1440) / 60); // Calculate hours
    const mins = minutes % 60; // Calculate remaining minutes

    // Return a formatted string with days, hours, and minutes
    return `${days > 0 ? `${days}d ` : ""}${
      hours > 0 ? `${hours}h ` : ""
    }${mins}m`;
  }

  // Determine the duration based on the task status.
  const duration =
    dbTaskDetails?.status === "Published" || dbTaskDetails?.status === "Pending"
      ? dbTaskDetails?.hourMinutes
      : taskTotalDuration;

  // Objective: Render an action button for deleting a logbook entry in a row.
  const withoutAssetActionTemplate = (rowData) => {
    return (
      <Button
        icon="pi pi-trash"
        className="p-button-danger"
        onClick={() => handleDelete(rowData)} // Call handleDelete with the specific row data
      />
    );
  };

  const copyPerformer = () => {
    const selectedPerformer = activityList[0]?.performer;
    const updatedActivityList = activityList.map((activity) => {
     
        return {
          ...activity,
          performer: selectedPerformer,
        };
      
     
    })

    setActivityList(updatedActivityList);
    setTaskDetails({
      ...taskDetails,
      activityList: updatedActivityList,
    });
  }

  const copyApprover =()=>
  {

    const selectedApprover = activityList[0]?.approver;
    const updatedActivityList = activityList.map((activity) => {
     
        return {
          ...activity,
          approver: selectedApprover,
        };
      
     
    })

    setActivityList(updatedActivityList);
    setTaskDetails({
      ...taskDetails,
      activityList: updatedActivityList,
    });
  }


    const createHtmlString = (data, forwardLink) => {
      // console.log("forwardLink in createHtml", forwardLink);
      const updatedData = { ...data, forwardLink: forwardLink };
      const htmlData = ReactDOMServer.renderToString(
        <EmailJobAssign data={updatedData} />
      );
      return htmlData;
    };

   const sendEmailNotificationsForAssignedJobs = async (
      finalRepeatableJobsArray,
      toMailList,
      approver,

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
              let finalMailHtml = createHtmlString(data, homePage); //** generating the HTML page for sending the data in email */
              finalMailHtml = finalMailHtml
                .replace(/^<div>/, "") //**replacing the surrounding outer divs */
                .replace(/<\/div>$/, "");
              // console.log("HTML : ", finalMailHtml);
              const mailObject = {
                toMailIds: toMailList,
                messageSubject: "You have been assigned to a Job",
                htmlPage: finalMailHtml,
                emailCc:approver ? [approver] : [],
              };
              console.log("Mail Object : ", mailObject);
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
        if (emailNotifications.length > 0) return true; //i.e all the emails have been processed successfully because on encountering an error it will go to the catch block
      } catch (e) {
        // console.error("Error in sending  mails :", e);
        // throw new Error("One or more jobs failed to push to the database.");
        // console.error("One or more jobs failed to push to the database.");
        return false;
      }
    };


  const handleSaveTaskAndJob =  async() => {
    console.log('Current Task Details : ',taskDetails);
    console.log('Current Job Details : ',jobDetails);
    console.log('Current Activity List : ',activityList);
    console.log('Current dbTaskDetails : ',dbTaskDetails);
    console.log('Selected Reviewer : ',selectedReviwer);

    if(dayjs(jobStartDate).isBefore(dayjs()) &&  !jobDetails)//This is the moment where we are creating a new Adhoc Job
    {
      setSnackbarText("Job Start Date should be in future !");
      setsnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // select performer and approver both if selected ,anyone of them for any activity
    const invalidActivity = activityList.find(activity => {
      const hasOnlyOneRole =
        !activity.groupOrDept &&
        ((activity.performer && !activity.approver) || (!activity.performer && activity.approver));
    
      const isGroupOrDeptIncomplete =
        activity.groupOrDept &&
        (!activity.groupOrDeptName || !activity.approver);
    
      return hasOnlyOneRole || isGroupOrDeptIncomplete;
    });
    
    
    
    

    console.log('Is Blank Performer or Approver : ',invalidActivity);

    if (invalidActivity) {
      setSnackbarText("Both Performer and Approver should be selected !");
      setsnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    

    setProcessDbRequest(true)
    // return;
  
    // const finalJobDetails =  {...jobDetails,activityList:activityList,taskDetails:taskDetails};
  
    const finalTaskDetails={...taskDetails,activityList:activityList};
    finalTaskDetails.creationTime = null;//because getDate() is called in the backend
    finalTaskDetails.taskName= taskName;
    finalTaskDetails.reviewer=selectedReviwer;
    finalTaskDetails.description=description;
  
    let finalJob = null;
    if(!dbTaskDetails)//This is the moment where we are creating a new Addhoc Job
    {
      console.warn("New JobDetails entry is being created");
      const generatedTaskId = generateTaskId();
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const activitiesWithGeneratedTaskId = [];
for (const activity of activityList) {
  await delay(10); // wait 10ms before generating next ID
  console.log(`Generating activityId at: ${Date.now()} ms`);

  activitiesWithGeneratedTaskId.push({
    ...activity,
    taskId: generatedTaskId,
    taskName: taskName,
    performer: activity.performer ?? '',
    approver: activity.approver ?? '',
   
    // activityId: generateActivityId(),
  });
}


      const jobScheduledJobEndTime=activitiesWithGeneratedTaskId[activitiesWithGeneratedTaskId?.length-1]?.scheduledActivityEndTime || null;
      finalJob=createJobDetails(
        //** creating the final Job Details object */
        {...taskDetails,activityList:activitiesWithGeneratedTaskId,taskId:generatedTaskId},
        taskName,
        "J" + dayjs().format("YYYYMMDDTHHmmssSSS"),
        null,
        // "info@greenwave.co.in", //This wiil further be changed dynamically
       getCurrentUser(),
        selectedReviwer,
        dayjs(jobStartDate).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
       jobScheduledJobEndTime,
        null,
        null,
        "low",
        description,
        7,
        null,
        true
      );
      
  
      finalTaskDetails.taskId = generatedTaskId;
      finalTaskDetails.activityList = activitiesWithGeneratedTaskId;
      finalTaskDetails.adhocTask = true;// will change to adhoc

      
    }
    else //This is the moment where the user is updating the existing Job
    {
      finalJob=jobDetails;
      finalJob.task.activityList=activityList;
    }
    finalJob.adhoc=true;
   

    // Prepare the edges list with task and connection details
    let edgesList = [];

    edges.forEach((edge) => {
      const newEdge = {
        taskId: finalTaskDetails.taskId, // Set the task ID
        sourceId: edge.source, // Set the source node ID
        source: edge.data.sourceName, // Set the source node name
        targetId: edge.target, // Set the target node ID
        target: edge.data.targetName, // Set the target node name
        tenantId: getTenantID(), // Set the tenant ID
      };
      edgesList = [...edgesList, newEdge]; // Add the new edge to the list
    });




    const {
  finalTaskDetails: taskPayload,
  edgesList: edgesPayload,
  finalJob: jobPayload
} = await asyncprepareFinalPayloadForDb({
  finalTaskDetails,
  edgesList,
  finalJob
});




// return

   const updatedEdgesList= !dbTaskDetails?edgesPayload:edgesList

   const updatedJob= !dbTaskDetails?jobPayload:finalJob
   

   const updatedTask= !dbTaskDetails?taskPayload:finalTaskDetails

   updatedJob.adhoc=true;
   updatedTask.adhocTask=true;


   console.group("Final Job and Task Details : ");
    console.log('EdgesList for Db: ', updatedEdgesList);
 console.log('Final Task : ',updatedTask);
    console.log('Final Job :',updatedJob);
    
    console.groupEnd();

    //Call for API

    const saveTask = await handleSaveTask(updatedTask);
    console.log('Save Task Status : ',saveTask);
    //Saving Activity Connections 
    const saveConnections = await handleSaveActivityConnections(updatedEdgesList);

    console.log('Save Connections Status : ',saveConnections);


    
    

    if(saveConnections && saveTask)
    {
      const saveJob = await updateJobAndActivity(updatedJob);
      if(saveJob)
      {

      console.log('Save Job Status : ',saveJob);
      let updatedAdhocJobs;
      const index = adhocJobs.findIndex((job) => job.jobID === updatedJob.jobID);
      
      if (index !== -1) {
        // Replace existing job
        updatedAdhocJobs = adhocJobs.map((job) =>
          job.jobID === updatedJob.jobID ? { ...job, ...updatedJob } : job
        );
      } else {
        // Add new job
        updatedAdhocJobs = [...adhocJobs, updatedJob];
      }
      await fetchAllTaskData();
      console.log('Updated Adhoc Jobs : ',updatedAdhocJobs);      
      setAdhocJobs(updatedAdhocJobs);
      setSnackbarText("Data saved successfully !");
      setsnackbarSeverity("success");
      setSnackbarOpen(true);

      setTimeout(() => {  
        setShowCreation(false); 
      }, 500);

      const toMailList=generateToMailUsers([finalJob],allUsers);

      const success=sendEmailNotificationsForAssignedJobs(
        [finalJob],
       [...toMailList]
        // finalJob.task.reviewerEmail
      );

      if(success) console.log("Email(s) sent successfully !");
      else console.error("Error in sending Email(s) !");
    }
      
      
    }
    else
    {
      console.error("Task and connections not saved successfully so skipping Job creation !");
      setSnackbarText("Error !");
      setsnackbarSeverity("error");
      setSnackbarOpen(true);
    }

    setProcessDbRequest(false);



   }



   const asyncprepareFinalPayloadForDb = async({
  finalTaskDetails,
  edgesList,
  finalJob
}) => {

  console.log('Preparation of new payload as new job is getting created !')
  // ===============================
  // 🔑 SINGLE SOURCE OF TRUTH
  // ===============================
  const activityIdMap = {};

  const getMappedActivityId = (oldId) => {
    if (!activityIdMap[oldId]) {
      activityIdMap[oldId] = generateActivityId();
    }
    return activityIdMap[oldId];
  };

  // ===============================
  // 🔹 UPDATE TASK ACTIVITIES
  // ===============================
const updatedActivityList = [];

for (const activity of finalTaskDetails?.activityList || []) {
  await new Promise(resolve => setTimeout(resolve, 1));

  updatedActivityList.push({
    ...activity,
    oldActivityId: activity.activityId,
    activityId: getMappedActivityId(activity.activityId)
  });
}


  const updatedFinalTaskDetails = {
    ...finalTaskDetails,
    activityList: updatedActivityList
  };

  // ===============================
  // 🔹 UPDATE EDGES FOR DB
  // ===============================
  const updatedEdgesList =
    edgesList?.map(edge => ({
      ...edge,
      sourceId: getMappedActivityId(edge.sourceId),
      targetId: getMappedActivityId(edge.targetId)
    })) || [];

  // ===============================
  // 🔹 UPDATE FINAL JOB (IF NEEDED)
  // ===============================
const updatedFinalJob = {
  ...finalJob,
  task: {
    ...finalJob.task,
    activityList: updatedActivityList
  }
};

  // ===============================
  // 🔹 DEBUG LOGS (OPTIONAL)
  // ===============================
  console.log("ActivityIdMap:", activityIdMap);
  console.log("EdgesList for Db:", updatedEdgesList);
  console.log("Final Task:", updatedFinalTaskDetails);
  console.log("Final Job:", updatedFinalJob);

  // ===============================
  // 🔹 READY-TO-PUSH PAYLOAD
  // ===============================
  return {
    activityIdMap,
    finalTaskDetails: updatedFinalTaskDetails,
    edgesList: updatedEdgesList,
    finalJob: updatedFinalJob
  };
};


   const fetchAllData = async () => {
    try {
      console.time('fetchAllData');
  
      const [data, tasks, jobs, logs] = await Promise.all([
        // (async () => { console.time('fetchData'); const r = await fetchData(); console.timeEnd('fetchData'); return r; })(),
        (async () => { console.time('fetchAllTaskData'); const r = await fetchAllTaskData(); console.timeEnd('fetchAllTaskData'); return r; })(),
        (async () => { console.time('fetchAllJobs'); const r = await fetchAllJobs(); console.timeEnd('fetchAllJobs'); return r; })(),
        (async () => { console.time('fetchLogBookList'); const r = await fetchLogBookList(); console.timeEnd('fetchLogBookList'); return r; })()
      ]);
  
      console.timeEnd('fetchAllData');
      return true;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  
   

  const refreshJobs = async () => {
    setProcessDbRequest(50);
    const success = await fetchAllData();
    // setSnackbarOpen(true);

    console.log('Success in fetching data : ',success);
    
  
    // Only reset or update if necessary
    if (success) {
      // Assuming setAdhocJobs is used to update the fetched data
      // setAdhocJobs(fetchedJobsData); // Update with the actual data after fetching.
      
      // Snackbar notification
      // setSnackbarText("Data refreshed successfully !");
      // setsnackbarSeverity("success");
      // setSnackbarOpen(true);

      setProcessDbRequest(100);
      setTimeout(() => {
        setProcessDbRequest(false);
      }, 1000);
    } else {
      setSnackbarText("Error in refreshing data !");
      setsnackbarSeverity("error");
      setSnackbarOpen(true);
      setProcessDbRequest(false);
    }
  };
  

   const performerDropdown = (rowData) => {
    const fetched_performerList = allUsers.filter(
      (user) =>
        user.allotedPages.some((data) => data.page.toLowerCase() === "performer") &&
        user.active
    );
  
    return (
      <>
      {/* {rowData.actvityStatus}
      {( rowData?.actvityStatus?.toLowerCase()?.trim() !== "not started") +"zhpjsfg"} */}
        {rowData?.filterSelection?.toLowerCase() === "individuals" && 
        
        <Dropdown
          options={fetched_performerList}
          value={rowData.performer}
          disabled={rowData?.actvityStatus?.toLowerCase()?.trim() !== "not started"  || processDbRequest}
          // disabled={rowData.actvityStatus === 'Started'}
          onChange={(e) => {
            console.log("Current Row Data:", rowData);
            setActivityList((prevActivityList) =>
              prevActivityList.map((act) =>
                act.activityId === rowData.activityId
                  ? { ...act, performer: e.value }
                  : act
              )
            );
          }}
          optionValue="userID"
          placeholder="Select Performer"
          className="w-full"
          itemTemplate={(option) => (
            <div>
              <span style={{ fontWeight: "bold" }}>{option.userName}</span>
              {!isMobile && <span>{` ( ${option.userID} )`}</span>}
            </div>
          )}
          valueTemplate={(option) => (
            <UserValueTemplate
              option={option}
              defaultValue={"Performer"}
              statusVisible={false}
            />
          )}
          optionLabel="userName"
          filter
          clearIcon
        />}
  
        {rowData?.filterSelection?.toLowerCase() === "usergroup" && (
          <Dropdown
            style={{ maxWidth: isMobile ? "200px" : "" }}
            disabled={rowData?.actvityStatus?.toLowerCase()?.trim() !== "not started"}
            value={rowData.groupOrDeptName}
            options={rowData?.activityUserGroupList}
            onClick={(e) => e.preventDefault()}
            // invalid={
              
            //   rowData?.filterSelection?.toLowerCase() === "usergroup" &&
            //   rowData.groupOrDeptName === ""
            // }
            placeholder="Select Groups"
            
          />
        )}
      </>
    );
  };
  

  const approverDropdown = (rowData) => {

    const fetchedApproverList= [];
      allUsers.forEach((user) => {//* users who have access to 'Performer Page'  will be treated as performers
        if (user.allotedPages.some((data)=>data.page.toLowerCase()==='activity reviewer' && user.active))
        {
          fetchedApproverList.push(user);         
  }});

  console.log('rowData : ',rowData);
    return (
      <Dropdown
                  options={fetchedApproverList}
                  value={rowData.approver}
                  // onChange={(event) => setApprover(event.target.value)
                  // }
                  disabled={rowData?.actvityStatus?.toLowerCase()?.trim() !== "not started" || processDbRequest}
                  optionValue='userID'
                  placeholder="Select Approver"
                  // invalid={validationForActivityDetails && row.approver === ""}
                  // disabled={assetGroup === ""}
                   className="w-full"
                  //  invalid={validationForJobDetailsForModal && approver === ""}
                  // style={{
                  //   // height: "30px",
                  //   width: isMobile ? "6rem" : "10rem",
                  // }}
                  // disabled={booleanSelfApproved}

                  onChange={(e) => {
                    console.log('Current Row Data:', rowData);
                    setActivityList((prevActivityList) => {
                      return prevActivityList.map((act) => {
                        if (act.activityId === rowData.activityId) {
                          
                          return {
                            ...act,
                            approver: e.value,
                           
                          };
                        }
                        return act;
                      });
                    });
                  }}
                  itemTemplate={(option) => (
                    <div>
                      <span style={{ fontWeight: "bold" }}>
                        {option.userName}
                      </span>
                      {isMobile?"":<span>
                      {"( " + option.userID + " )"}
                      </span>}
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
    );
  }


  const handleFilterChange = (row, radioValue) => {
    if (row.filterSelection === radioValue) return;
    console.group();
    // console.log('handleFilterChange() called');
    // console.log('Current Row : ', row);
    // console.log('Current Row Value : ', radioValue);
    // console.log('Current User Group Map : ', allGroupedUsersData);
    console.groupEnd();
  
    const updatedRow = { ...row };
  
    if (radioValue === 'usergroup') {
      if (updatedRow.activityUserGroupList.length > 0) {
        updatedRow.groupOrDeptName = updatedRow?.activityUserGroupList?.length > 0 ? updatedRow.activityUserGroupList[0]:'';
        updatedRow.performerType = 'Group';
        updatedRow.groupOrDept = true;
        updatedRow.performer = '';
        updatedRow.filterSelection = 'usergroup';
      }
    } else {
      // Default to individuals
      updatedRow.filterSelection = radioValue;
      updatedRow.groupOrDeptName = '';
      updatedRow.performer = '';
      updatedRow.groupOrDept = false;
      updatedRow.performerType = 'individuals';
    }
  
    const updatedActivityList = activityList.map(activity =>
      activity.activityId === updatedRow.activityId ? updatedRow : activity
    );
  
    setActivityList(updatedActivityList);
  };


  const resetActivityStatus = (task) => {
    const updatedActivityList = task?.activityList?.map((activity) => {
      return {
        ...activity,
        actvityStatus: "Not Started", // Resetting the activity status to "Not Started"
      };
    });

    console.log("Reset Activity Status Called : ", updatedActivityList);

    return {
      ...task,
      activityList: updatedActivityList,
    };
  };

  
  
    
  

  const iconStyle = { fontSize: '1rem',padding: '0 0.5rem 0 0',cursor: 'pointer' };



  return (
    <>
      {showCreation ? (
        <>
          <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
            <div
              style={{
                background: "white",
                marginLeft: isMobile ? "" : "4%",
                borderRadius: "1rem",
                boxShadow:
                  "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
              }}
            >
              <Card>
                <div>
                  <div
                    style={{
                      padding: isMobile ? "" : "0.2rem 1.1rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      columnGap: "0.3rem",
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                      {dbTaskDetails ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            columnGap: "0.6rem",
                          }}
                        >
                          <div class="fadeoutdown animation-duration-300 ">
                            <Tooltip title="Home" placement="top">
                              <IconButton
                                color="info"
                                aria-label="home"
                                size="large"
                                onClick={() => {
                                  
                                  setShowCreation(!showCreation);
                                }}
                              >
                                <HomeIcon />
                              </IconButton>
                            </Tooltip>
                          </div>
                          {/* <Typography fontWeight="bold" fontSize="0.85rem">
                            Task Name{" "}
                          </Typography> */}
                          <Chip label={dbTaskDetails.taskName} />
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div class="fadeoutdown animation-duration-300 ">
                            <Tooltip title="Home" placement="top">
                              <IconButton
                                color="info"
                                aria-label="home"
                                size="large"
                                onClick={() => {
                                  setShowCreation(false);
                                  handleReset();
                                }}
                              >
                                <HomeIcon />
                              </IconButton>
                            </Tooltip>
                          </div>

                          <Typography fontWeight="bold" fontSize="0.85rem">
                            Create Task{" "}
                          </Typography>
                        </div>
                      )}
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        columnGap: "0.6rem",
                      }}
                    >
                    {/* {activeStep} */}
                      {activeStep === 1 ? (
                        <Button
                          rounded
                          size="small"
                          severity="help"
                          icon={
                            <>
                              <PlaylistAddIcon />
                            </>
                          }
                          onClick={() => {
                            handleOnCancelClick();
                            setDlgVisible(true);
                          }}
                        >
                          Add Activity
                        </Button>
                      ) : null}
                    </div>
                  </div>
                  <Divider />
                  <Stepper
                    ref={stepperRef}
                    style={{ flexBasis: "50rem" }}
                    linear
                    className="forBorderRadius"
                    activeIndex={activeStep}
                  >
                    <StepperPanel header="Task Creation">
                      <div
                        //  className="flex flex-column h-12rem"
                        style={{ height: "63vh" }}
                      >
                        {/* <center> */}
                        {/* <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium"> */}

                        <div style={formWrapperStyle}>
                          <form style={formStyle}>
{/* Task Name is not mapped here everytime a Job is create that becomes a new Task then importing for which Task ? thats why this particular field is not visible  */}
                            {!jobDetails && (
                              <SelectButton
                                className={`custom-toggle-button`}
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  paddingBottom: "1rem",
                                }}
                                value={isExistingPublishedTask}
                                allowEmpty={false}
                                onChange={(e) =>{
                                  setIsExistingPublishedTask(e.value);
                                  console.log("Current Selection",e.value);
                                  // if(e.value===options[1]){
                                    setTaskFromExistingTask(null);
                                    setTaskDetails(null);
                                    setActivityList(null);
                                    setNodes([]);
                                  // }
                                  
                                }
                                }
                                options={options}
                              />
                            )}

                            <div style={formGroupStyle}>
                              <label htmlFor="task-name" style={labelStyle}>
                              {<i className="pi pi-briefcase
" style={iconStyle}></i>}
                                Job Name
                              </label>
                              <TextField
                                id="task-name"
                                label="Job Name"
                                variant="outlined"
                                disabled={dbTaskDetails}
                                value={taskName}
                                // onChange={(e) => setTaskName(e.target.value)}
                                error={isTaskNameMatched}
                                helperText={
                                  isTaskNameMatched
                                    ? "Already exist in the database"
                                    : ""
                                }
                                onChange={handleChange}
                              />
                            </div>
                            { isExistingPublishedTask === options[1] && !dbTaskDetails &&<div style={formGroupStyle}>
                              <label
                                htmlFor="asset-group-dropdown"
                                style={labelStyle}
                              >
                                {<i className="pi pi-file-import" style={iconStyle}></i>}
                               Imported Task
                               
                              </label>

                              <Dropdown
                                className="w-full md:w-14rem"
                                value={taskFromExistingTask}
                                onChange={(e) => {
                                  console.log('taskFromExistingTask : ',filteredTasksByAssetGroup);
                                  console.log('Current e.value : ',e.value);
                                  // setTaskFromExistingTask(e.value);
                                  const updatedTask=resetActivityStatus(e.value);
                                  setTaskFromExistingTask(updatedTask);
                                  // setTaskDetails(null);
                                  // setActivityList(null);
                                  const foundAssetGroup = e?.value?.assetGroup?? ''
                                  console.log('foundAssetGroup : ',foundAssetGroup);
                                  console.log('taskFromExistingTask : ',e.value);
                                  setSelectedAssetGroup(foundAssetGroup);
                                }}
                                optionLabel="taskName"
                                // optionValue=
                                placeholder="Import..."
                                filter
                                options={
                                  // !selectedAssetGroup
                                  //   ? filteredTasksByAssetGroup
                                  //   : filteredTasksByAssetGroup.filter(task => task.assetGroup === selectedAssetGroup)
                                  filteredTasksByAssetGroup?.map(task=>{
                                    if(task?.taskId===taskFromExistingTask?.taskId) 
                                      return {...taskFromExistingTask}
                                    return {...task}
                                  })
                                }
                                showClear={taskFromExistingTask}
                                disabled={dbTaskDetails}
                              />
                            </div>}
                            <div style={formGroupStyle}>
                              <label
                                htmlFor="asset-group-dropdown"
                                style={labelStyle}
                              >
                                {/* Select an Asset Group {selectedAssetGroup} */}
                                {<i className="pi pi-sitemap
" style={iconStyle}></i>}
                                Select an Asset Group 
                              </label>
                              <Dropdown
                                id="asset-group-dropdown"
                                value={selectedAssetGroup}
                                onChange={(e) =>{ 
                                  setSelectedAssetGroup(e.value)
                                  // setTaskFromExistingTask(null);
                                  // setTaskDetails(null);
                                  // setActivityList(null);
                                }}
                                options={assetGroups}
                                // disabled={
                                //   dbTaskDetails?.status === "Published" ||
                                //   dbTaskDetails?.status === "Pending"
                                //     ? true
                                //     : false
                                // }
                                disabled={dbTaskDetails}
                                showClear
                                filter
                                variant="filled"
                                placeholder="Select an Asset Group"
                                className="w-full md:w-14rem"
                              />
                            </div>


                         


                            <div style={formGroupStyle}>
                              <label
                                htmlFor="reviewer-dropdown"
                                style={labelStyle}
                              >
                                {<i className="pi pi-verified" style={iconStyle }></i>}
                                Select a Reviewer
                              </label>
                              <Dropdown
                                id="reviewer-dropdown"
                                value={selectedReviwer}
                                onChange={(e) => setSelectedReviwer(e.value)}
                                options={reviewOptions}
                                // showClear
                                filter
                                variant="filled"
                                placeholder="Select a Reviewer"
                                className="w-full md:w-14rem"
                                disabled={
                                  dbTaskDetails?.status === "Published" ||
                                  dbTaskDetails?.status === "Pending"
                                    ? true
                                    : false
                                }
                                valueTemplate={(option) =>
                    
                                  <UserValueTemplate
                                  option={allUsers?.find(user => user?.userID === option?.value) ??null}
                                 
                                  defaultValue={"Reviewer"}
                                  statusVisible={false}
                                  />
                                }
                              />
                            </div>
                            <div style={formGroupStyle}>
                              <label htmlFor="description" style={labelStyle}>
                              {<i className="pi pi-pen-to-square
" style={iconStyle}></i>}
                                Description 
                                {/* {'Helo'+description} */}
                              </label>
                              <TextField
                                id="description"
                                label="Description"
                                multiline
                                maxRows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full md:w-14rem"
                                disabled={
                                  dbTaskDetails?.status === "Published" ||
                                  dbTaskDetails?.status === "Pending"
                                    ? true
                                    : false
                                }
                              />
                            </div>
                          </form>
                        </div>
                        {/* </center> */}
                        {/* </div> */}
                      </div>
                       <div className="flex pt-4 justify-content-end" style={{alignItems:'center'}}>
                        {/* {isTaskNameMatched+'Hello'}
                        {selectedAssetGroup+"Hello"}
                        {selectedReviwer+"Hello"} */}
                        <Button
                        disabled={isTaskNameMatched  || !selectedReviwer || !taskName || (!taskFromExistingTask && isExistingPublishedTask === options[1])}

                          label={
                            // dbTaskDetails?.status === "Published" ||
                            // dbTaskDetails?.status === "Pending"
                            //   ? "Next"
                            //   : "Save as Draft & Proceed"
                            "Next"
                          }
                          icon="pi pi-arrow-right"
                          iconPos="right"
                          size="small"
                          rounded
                          onClick={handleNextTab}
                        />
                        {processDbRequest && <Spin indicator={<LoadingOutlined spin />}  style={{paddingLeft:'1rem'}}/>}
                      </div>
                    </StepperPanel>
                    <StepperPanel header="Activity">
                      <div>
                        <div
                          // className="flex flex-column h-12rem"
                          style={{ height: "62vh", backgroundColor: "#F8F8F8" }}
                        >
                          {/* <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium"> */}
                          <ReactFlow
                            nodeTypes={nodeTypes}
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            snapToGrid
                            onReconnect={onReconnect}
                            onReconnectStart={onReconnectStart}
                            onReconnectEnd={onReconnectEnd}
                            onConnect={onConnect}
                            onNodeClick={onNodeClick}
                            fitView
                            attributionPosition="top-right"
                            // nodesDraggable={
                            //   dbTaskDetails?.status === "Published" ||
                            //   dbTaskDetails?.status === "Pending"
                            //     ? false
                            //     : true
                            // }
                            // edgesUpdatable={
                            //   dbTaskDetails?.status === "Published" ||
                            //   dbTaskDetails?.status === "Pending"
                            //     ? true
                            //     : true
                            // }
                          >
                            <Controls />
                            <MiniMap />
                            <Background />
                          </ReactFlow>
                          {/* </div> */}
                        </div>
                        <div>
                          {/* <Fab
                            color="primary"
                            aria-label="add"
                            //className="fab-animation"
                            style={{
                              position: "fixed",
                              bottom: "15%",
                              right: 16,
                              animation: "fadeIn 0.5s ease-in-out",
                            }}
                            onClick={() => setDlgVisible(true)}
                          >
                            <AddIcon />
                          </Fab> */}
                        </div>
                      </div>
                      <div className="flex pt-4 justify-content-between">
                        <Button
                          label="Back"
                          size="small"
                          severity="secondary"
                          rounded
                          icon="pi pi-arrow-left"
                          onClick={() => {
                            stepperRef.current.prevCallback();
                            setActiveStep(activeStep - 1);
                          }}
                        />
                        <Button
                          // label={
                          //   dbTaskDetails?.status === "Published" ||
                          //   dbTaskDetails?.status === "Pending"
                          //     ? "Next"
                          //     : "Save and Proceed"
                          // }
                          label="Next"
                          size="small"
                          icon="pi pi-arrow-right"
                          rounded
                          iconPos="right"
                          // onClick={handleSaveDraftActivity}
                          onClick={() =>handleNextSecondStep()}
                        />
                      </div>
                    </StepperPanel>
                    <StepperPanel header="Confirm">
                      <div
                      //  className="flex flex-column h-12rem"
                      // style={{ height: "65vh" }}
                      >
                        <Container maxWidth="lg" sx={{}}>
                          <PrimeCard
                            style={{
                              marginTop: "0",
                              padding: "0",
                              marginBottom: "1rem",
                            }}
                          >
                            <Grid
                              container
                              style={{
                                marginTop: "0",
                                padding: "0",
                                marginBottom: "1rem",
                              }}
                              spacing={2}
                            >
                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb",
                                  padding: "0.5rem",
                                }}
                                xs={12}
                              >
                                <Typography fontWeight="600" fontSize="0.85rem">
                                  Task Overview
                                </Typography>
                              </Grid>
                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb",
                                  padding: "0.5rem",
                                }}
                                xs={6}
                              >
                                <Typography sx={{ ml: isMobile ? 0 : 7 }}>
                                  Task Name
                                </Typography>
                              </Grid>
                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb",
                                  padding: "0.5rem",
                                }}
                                xs={6}
                              >
                                <Typography>
                                  {taskName}
                                </Typography>
                              </Grid>

                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb",
                                  padding: "0.5rem",
                                }}
                                xs={6}
                              >
                                <Typography sx={{ ml: isMobile ? 0 : 7 }}>
                                  Description
                                </Typography>
                              </Grid>

                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb",
                                  padding: "0.5rem",
                                }}
                                xs={6}
                              >
                                <Typography>
                                  {/* {taskDetails ? taskDetails.description : ""} */}
                                  {description}
                                </Typography>
                              </Grid>

                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb",
                                  padding: "0.5rem",
                                }}
                                xs={6}
                              >
                                <Typography sx={{ ml: isMobile ? 0 : 7 }}>
                                  Approver
                                </Typography>
                              </Grid>

                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb",
                                  padding: "0.5rem",
                                }}
                                xs={6}
                              >
                                <>
                                  <Chip
                                    label={
                                      taskDetails ? taskDetails.reviewer : ""
                                    }
                                  />
                                </>
                              </Grid>
                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb",
                                  padding: "0.5rem",
                                }}
                                xs={6}
                              >
                                <Typography sx={{ ml: isMobile ? 0 : 7 }}>
                                  Asset Group
                                </Typography>
                              </Grid>

                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb",
                                  padding: "0.5rem",
                                }}
                                xs={6}
                              >
                                <Typography>
                                  {taskDetails ? taskDetails.assetGroup : ""}
                                </Typography>
                              </Grid>

                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb",
                                  padding: "0.5rem",
                                }}
                                xs={6}
                              >
                                <Typography sx={{ ml: isMobile ? 0 : 7 }}>
                                  Total Duration
                                </Typography>
                              </Grid>

                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb",
                                  padding: "0.5rem",
                                }}
                                xs={6}
                              >
                                {/* const totalDuration = 
                                activityList.reduce((accumulator, activity) 
                                => accumulator + activity.duration, 0) */}

                                <Chip
                                  color="info"
                                  size="small"
                                  // label={
                                  //   <>
                                  //     dbTaskDetails?.status === "Published" ||
                                  //     dbTaskDetails?.status === "Pending" ?
                                  //     dbTaskDetails?.hourMinutes :
                                  //     taskTotalDuration
                                  //   </>
                                  // }
                                  label={formatDuration(duration)}
                                />
                              </Grid>
                            </Grid>
                          </PrimeCard>
                          <div>
                              <PrimeCard
                              className="noPadding"
                              style={{
                                marginTop: "0",
                                padding: "0",
                              }}
                            >
                              <DataTable
                              
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                removableSort
                                style={{fontSize:".8rem"}}
                                className="UserInfoTableStyle dataTableStyle"
                                stripedRows
                                disabled={processDbRequest}
                                // tableStyle={{ minWidth: "50rem" }}
                                value={activityList}
                                header={header}
                                globalFilter={globalFilter}
                              >
                                <Column
                                  field="sequence"
                                  header="Order"
                                  sortable
                                  // style={{ width: "25%" }}
                                />
                                <Column
                                  field="activityName"
                                  header="Activity Name"
                                  sortable
                                  //style={{ width: "25%" }}
                                />
                                {/* <Column
                                  field="actAbrv"
                                  header="Identifier"
                                  sortable
                                  //style={{ width: "25%" }}
                                />
                                <Column
                                  header="Group"
                                  sortable
                                  body={(rowData) =>
                                    rowData?.activityUserGroupList[0]
                                  }
                                  //style={{ width: "25%" }}
                                /> */}
                                {/*<Column
                                  field="logbook"
                                  header="Logbook"
                                  body={groupIdTemplate}
                                  sortable
                                  style={{ width: "25%" }}
                                />*/}

                                <Column
                                  field="duration"
                                  header="Duration(Minutes)"
                                  sortable
                                  //style={{ width: "25%" }}
                                />

                                {/* 
                                <Column
                                  field="buffer"
                                  header="Buffer(Minutes)"
                                  sortable
                                  //style={{ width: "25%" }}
                                />
                                <Column
                                  field="enforce"
                                  header="Enforce"
                                  sortable
                                  //style={{ width: "25%" }}
                                /> */}

<Column
  header="Scheduled Start"
  sortable
  body={(rowData) => {
    return (
      <div>
        {formatDatetime(rowData.scheduledActivityStartTime)}
      </div>
    );
  }}
/>


<Column
                                  // field="scheduledActivityEndTime"
                                  header="Scheduled End"
                                  sortable
                                  body={(rowData) => {
                                    return (
                                      <div>
                                        {formatDatetime(rowData.scheduledActivityEndTime)}
                                      </div>
                                    );
                                  }}
                                  //style={{ width: "25%" }}
                                />

<Column
  header="Select Asset"
  sortable
  body={(rowData) => {
    const assetNames = rowData?.assetNameList || [];
    const assetIds = rowData?.assetIDList || [];

    const options = assetNames.map((name, index) => ({
      assetName: name,
      assetId: assetIds[index]
    }));

    return (
      <>
      {/* {rowData.assetId} */}
      <Dropdown
        optionLabel="assetName"
        optionValue="assetId"
        options={options}
        value={rowData.assetId}
        placeholder="Select Asset"
        disabled={rowData.assetIDList.length === 0 || rowData.assetIDList.length===1 || rowData?.actvityStatus?.toLowerCase()?.trim() !== "not started"  || processDbRequest}
        // disabled={rowData => rowData?.actvityStatus?.toLowerCase()?.trim() !== "not started"}
        onChange={(e) => {
          console.log("Event : ",e)
          setActivityList((prevActivityList) => {
            const updatedList = prevActivityList.map((act) => {
              const index = act.assetIDList.findIndex(id => id === e.value);
              if (act.activityId === rowData.activityId) {
                return {
                  ...act,
                  assetId: e.value,
                  assetName: index !== -1 ? act.assetNameList[index]:null,
                };
              }
              return act;
            });
            console.log('Updated List : ',updatedList)
            return updatedList; // This was missing
          });
        }}
        
      />
      </>
    );
  }}
/>

<Column
                                  // field="performer"
                                  header="Performer Type"
                                  
                                  body={(row) => (
                                    <ButtonGroup
                                    
                                    >
                                      <Tooltip title="Individuals">
                                        <IconButton
                                        disabled={row?.actvityStatus?.toLowerCase()?.trim() !== "not started"  || processDbRequest}
                                          size="small"
                                          onClick={() => handleFilterChange(row, "individuals")}
                                          color={
                                            row.filterSelection === "individuals" ? "primary" : "default"
                                          }
                                        >
                                          <PersonIcon />
                                        </IconButton>
                                      </Tooltip>
                                  
                                      {row.activityUserGroupList?.filter(g=>g.length>0).length > 0 && (
                                        <Tooltip title="Group">
                                          <IconButton
                                          disabled={row?.actvityStatus?.toLowerCase()?.trim() !== "not started" || processDbRequest}
                                            size="small"
                                            onClick={() => handleFilterChange(row, "usergroup")}
                                            color={
                                              row.filterSelection === "usergroup" ? "primary" : "default"
                                            }
                                          >
                                            <GroupIcon />
                                          </IconButton>
                                        </Tooltip>
                                      )}
                                    </ButtonGroup>
                                  )}
                                  
                                  
                                  //style={{ width: "25%" }}
                                />

                                <Column
                                  // field="performer"
                                  header={<>Performer {activityList?.length>0 && activityList[0]?.performer &&<i className="pi pi-copy" style={iconStyle} onClick={copyPerformer}></i>}</>}
                                  
                                  body={performerDropdown}
                                  // disabled={rowData => rowData?.actvityStatus?.toLowerCase()?.trim() !== "not started"}
                                  //style={{ width: "25%" }}
                                />

                                <Column
                                  // field="performer"
                                  header={<>Approver {activityList?.length>0 && activityList[0]?.approver &&  <i onClick={copyApprover} className="pi pi-copy" style={iconStyle}></i>}</>}
                                  // sortable
                                  body={approverDropdown}
                                  // disabled={rowData => rowData?.actvityStatus?.toLowerCase()?.trim() !== "not started"}
                                  //style={{ width: "25%" }}
                                />
                                 <Column
                                  field="actvityStatus"
                                  header="Status"
                                  sortable
                                  body={(rowData) => {
                                        return (
                                          <Chip size='small' label={rowData.actvityStatus} color={getJobStatusColor(rowData.actvityStatus)}></Chip>
                                        );
                                  
                                      }}
                                  // body={approverDropdown}
                                  //style={{ width: "25%" }}
                                />
                              </DataTable>

                              
                            </PrimeCard>
                          </div>
                        </Container>
                      </div>
                      <div className="flex pt-4 justify-content-between">
                        <Button
                          label="Back"
                          severity="secondary"
                          rounded
                          size="small"
                          disabled={processDbRequest}
                          icon="pi pi-arrow-left"
                          onClick={() => {
                            stepperRef.current.prevCallback();
                            setActiveStep(activeStep - 1);
                          }}
                        />
                        <div>
                         {!assetDlg &&
           <Calendar
                          showIcon
                          id="calendar-12h"
                          dateFormat="dd/mm/yy"
                          value={new Date(dayjs(jobStartDate))}
                          onChange={(e) => {
                            console.log(e.value)

                            
                           
                            handleFromDateChange(e.value);}}
                        
                          disabled={jobDetails || processDbRequest}
                          showTime
                          hourFormat="12"
                          minDate={new Date()}  
                          style={{ padding: "0 1.5rem 0 0" }}                      
                        />}
                        <Button
                        disabled={processDbRequest}
                          label={
                            !dbTaskDetails
                              ? "Create Job"
                              : "Update Job"
                          }
                          // icon={
                          //   dbTaskDetails?.status === "Published" ||
                          //   dbTaskDetails?.status === "Pending"
                          //     ? "pi pi-times"
                          //     : "pi pi-send"
                          // }
                          rounded
                          // severity={
                          //   dbTaskDetails?.status === "Published" ||
                          //   dbTaskDetails?.status === "Pending"
                          //     ? "warning"
                          //     : "success"
                          // }
                          size="small"
                          iconPos="right"
                           onClick={handleSaveTaskAndJob}
                          //onClick={() => stepperRef.current.nextCallback()}
                          // onClick={}
                        />
                         {processDbRequest && <Spin indicator={<LoadingOutlined spin />}  style={{paddingLeft:'1rem'}}/>}
                        </div>

                      </div>
                    </StepperPanel>
                  </Stepper>

                  {/* <Dialog
                header="Activity Creation"
                visible={dlgVisible}
                maximizable
                style={{ width: "50vw" }}
                onHide={() => {
                  if (!dlgVisible) return;
                  setDlgVisible(false);
                }}
              > */}
                    <Sidebar
                                      className="SidebarHeader"
                                      header={
                                        updatedActivityName && (
                                          <div
                                            style={{
                                              display: "flex", // Flexbox layout for header
                                              alignItems: "center", // Center alignment for items
                                              width: "100%", // Full width
                                              justifyContent: "space-between", // Space between items
                                            }}
                                          >
                                            <div
                                              className="font-bold" // Bold font for the activity name
                                              style={{ display: "flex", alignItems: "center" ,justifyContent:"space-between" }} // Flexbox for centering
                                            >
                                              <Chip
                                                label={updatedActivityName} // Display activity name
                                              />
                                              <Chip 
                                              label={activityList?.find(activity=> activity?.activityId === selectedNodeId)?.actvityStatus}
                                              color={getJobStatusColor(activityList?.find(activity=> activity?.activityId === selectedNodeId)?.actvityStatus)}
                                              size="small"
                                              />
                                              
                                            </div>
                  
                                            <Tooltip title="Delete Activity" placement="right">
                                              {/* Tooltip for delete button*/}
                                              <Button
                                                rounded // Rounded button style
                                                text // Text button style
                                                icon="pi pi-trash" // Trash icon
                                                severity="danger" // Danger color for delete action
                                                disabled={activityList?.find(activity => activity?.activityId === selectedNodeId)?.actvityStatus?.toLowerCase() !== "not started"}

                                                onClick={deleteNode} // Click handler for deleting the activity
                                              ></Button>
                                            </Tooltip>
                                          </div>
                                        )
                                      }
                                      visible={dlgVisible} // Control visibility of sidebar
                                      position="right" // Sidebar positioned on the right
                                      style={{ padding: 0, width: isMobile ? "90%" : "28rem" }} // Width of the sidebar
                                      onHide={() => {
                                        // Handler for closing the sidebar
                                        if (!dlgVisible) return; // Prevent action if dialog is not visible
                                        setDlgVisible(false); // Close the sidebar
                                      }}
                                    >
                                      <center>
                                        <div>
                                          <br />
                                          <Badge
                                            badgeContent={
                                              <>
                                                <Tooltip title="Activity Name" placement="top">
                                                  <InfoIcon
                                                    sx={{ color: "#607d8b" }}
                                                    fontSize="small"
                                                  />
                                                </Tooltip>
                                              </>
                                            }
                                          >
                                            <TextField
                                              id="outlined-basic"
                                              style={{ marginTop: "10px" }} // Margin on top
                                              label="Activity Name" // Label for input
                                              variant="outlined" // Outlined variant for input
                                              required // Mark as required
                                              error={nameError} // Show error state if nameError is true
                                              value={activityName} // Controlled value for input
                                              onChange={(e) => setActivityName(e.target.value)} // Update activity name on change
                                              helperText={
                                                // Helper text for error messages
                                                nameError
                                                  ? "This activity name already exists." // Error message for existing name
                                                  : ""
                                              }
                                            />
                                          </Badge>
                                          <br />
                                          <br />
                                          <Badge
                                            badgeContent={
                                              <>
                                                <Tooltip
                                                  title={
                                                    <span>
                                                      Set an activity indicator related to the
                                                      activity name, <br />
                                                      with an identifier name of up to 6
                                                      characters.
                                                    </span>
                                                  }
                                                  placement="top"
                                                >
                                                  <InfoIcon
                                                    sx={{ color: "#607d8b" }}
                                                    fontSize="small"
                                                  />
                                                </Tooltip>
                                              </>
                                            }
                                          >
                                            <TextField
                                              id="outlined-basic"
                                              style={{ marginTop: "10px" }} // Margin on top
                                              label="Activity Identifier" // Label for identifier input
                                              variant="outlined" // Outlined variant for input
                                              required // Mark as required
                                              error={abbrError} // Show error state if abbrError is true
                                              value={activityAbbr} // Controlled value for input
                                              onChange={(e) => setActivityAbbr(e.target.value)} // Update activity abbreviation on change
                                              helperText={
                                                // Helper text for error messages
                                                abbrError
                                                  ? activityAbbr.length > 6
                                                    ? "Abbreviation cannot exceed 6 characters." // Error message for length violation
                                                    : "This abbreviation already exists." // Error message for existing abbreviation
                                                  : ""
                                              }
                                            />
                                          </Badge>
                                          <br />
                                          <br />
                                          <Button
                                            label="Add Logbook & Asset" // Button label
                                            rounded // Rounded button style
                                            size="small" // Small button size
                                            severity="help" // Help color for the button
                                           disabled={
  selectedNodeId &&
  activityList?.find(activity => activity?.activityId === selectedNodeId)?.actvityStatus?.toLowerCase() !== "not started" &&
  activityList?.length > 0
}

                                            onClick={handleAddAssetClick} // Click handler for adding logbook and asset
                                          />
                                          <br />
                                          <br />
                                          <div>
                                            {assetLogbookData?.length > 0 && ( // Check if there are existing asset logbooks
                                              <DataTable
                                                showGridlines // Show gridlines in the table
                                                className="UserInfoTableStyle dataTableStyle" // Custom styles for table
                                                value={assetLogbookData} // Data for the table
                                                header={"Existing Assets and Logbooks"} // Table header
                                              >
                                                <Column
                                                  field="asset"
                                                  header="Asset" // Asset column
                                                  sortable
                                                />
                  
                                                <Column
                                                  field="groups"
                                                  header="Group" // Group column
                                                  sortable
                                                />
                  
                                                <Column
                                                  field="logbook"
                                                  header="Logbook" // Logbook column
                                                  sortable // Sortable column
                                                />
                                              </DataTable>
                                            )}
                                            {/* {withoutAssetLogbookData.length} */}
                                            {withoutAssetLogbookData.length>0 && ( // Check if there are existing groups without asset logbooks
                                              <DataTable
                                                showGridlines // Show gridlines in the table
                                                className="UserInfoTableStyle dataTableStyle" // Custom styles for table
                                                value={withoutAssetLogbookData} // Data for the table
                                                header={"Existing Groups and Logbooks"} // Table header
                                              >
                                                <Column
                                                  field="groups"
                                                  header="Group" // Group column
                                                  sortable
                                                />
                  
                                                <Column
                                                  field="logbook"
                                                  header="Logbook" // Logbook column
                                                  sortable // Sortable column
                                                />
                                              </DataTable>
                                            )}
                                          </div>
                                          <Badge
                                            badgeContent={
                                              <>
                                                <Tooltip
                                                  title={
                                                    <span>
                                                      Set a duration <br /> for the activity
                                                    </span>
                                                  }
                                                  placement="top"
                                                >
                                                  <InfoIcon
                                                    sx={{ color: "#607d8b" }}
                                                    fontSize="small"
                                                  />
                                                </Tooltip>
                                              </>
                                            }
                                          >
                                            <Fieldset
                                              className="fieldSetStyle" // Custom styles for fieldset
                                              style={{ marginTop: "0.5rem" }} // Margin on top
                                              legend="Duration" // Legend for the fieldset
                                            >
                                              <div
                                                style={{
                                                  display: "flex", // Flexbox layout for duration inputs
                                                  alignItems: "center", // Center alignment for items
                                                  columnGap: "1rem", // Gap between columns
                                                  justifyContent: "space-between", // Space between items
                                                }}
                                              >
                                                <div>
                                                  <label
                                                    htmlFor="minmax-buttons" // Label for hours input
                                                    className="font-bold block" // Bold font style
                                                    style={{
                                                      fontSize: "0.9rem", // Font size
                                                      marginBottom: "0.5rem", // Margin on bottom
                                                    }}
                                                  >
                                                    Hours
                                                  </label>
                                                  <InputNumber
                                                    className="widthSet" // Custom width for input
                                                    inputStyle={{ width: "100px" }} // Input width
                                                    inputId="minmax-buttons" // Input ID
                                                    variant="filled" // Filled variant for input
                                                    value={hours} // Controlled value for hours
                                                    onValueChange={(e) => setHours(e.value)} // Update hours on change
                                                    mode="decimal" // Decimal mode for input
                                                    showButtons // Show increment/decrement buttons
                                                    min={0} // Minimum value
                                                    max={8760} // Maximum value (hours in a year)
                                                  />
                                                </div>
                                                <div>
                                                  <label
                                                    htmlFor="minmax-buttons" // Label for minutes input
                                                    className="font-bold block" // Bold font style
                                                    style={{
                                                      fontSize: "0.9rem", // Font size
                                                      marginBottom: "0.5rem", // Margin on bottom
                                                    }}
                                                  >
                                                    Minutes
                                                  </label>
                                                  <InputNumber
                                                    required // Mark as required
                                                    className="widthSet" // Custom width for input
                                                    inputStyle={{ width: "100px" }} // Input width
                                                    inputId="minmax-buttons" // Input ID
                                                    value={minutes} // Controlled value for minutes
                                                    onValueChange={(e) => {
                                                      const newValue = e.value; // New value from input
                                                      if (newValue > 59) {
                                                        // Limit minutes to 59 max
                                                        setMinutes(59);
                                                      } else if (newValue < 1) {
                                                        // Set minimum minutes to 0
                                                        setMinutes(0);
                                                      } else {
                                                        setMinutes(newValue); // Update minutes
                                                      }
                                                    }}
                                                    mode="decimal" // Decimal mode for input
                                                    showButtons // Show increment/decrement buttons
                                                    min={0} // Minimum value
                                                    max={59} // Maximum value (minutes)
                                                  />
                                                </div>
                                              </div>
                                            </Fieldset>
                                          </Badge>
                                          <br />
                                          <br />
                                          {/* <SwitchButton
                                            isPublicAccess={isPublicAccess}
                                            setIsPublicAccess={setIsPublicAccess}
                                            offLabel="Buffer"
                                            onLabel="Enforce"
                                            OffIcon={AccessTimeIcon}
                                            OnIcon={AccessAlarmIcon}
                                            setBuffer={setBuffer}
                                            setEnforceStartDuration={setEnforceStartDuration}
                                          /> */}
                                          <Badge
                                            badgeContent={
                                              <>
                                                <Tooltip
                                                  title={
                                                    <span>
                                                      Set a buffer time for <br /> a particular
                                                      activity
                                                    </span>
                                                  }
                                                  placement="top"
                                                >
                                                  <InfoIcon
                                                    sx={{ color: "#607d8b" }}
                                                    fontSize="small"
                                                  />
                                                </Tooltip>
                                              </>
                                            }
                                          >
                                            <Fieldset
                                              className="fieldSetStyle" // Custom styles for fieldset
                                              style={{ marginTop: "0.5rem" }} // Margin on top
                                              legend="Buffer(minutes)" // Legend for the fieldset
                                            >
                                              <div className="flex-auto">
                                                <InputNumber
                                                  inputStyle={{ width: "100%" }} // Full width input
                                                  inputId="minmax-buttons" // Input ID
                                                  value={buffer} // Controlled value for buffer
                                                  onValueChange={(e) => setBuffer(e.value)} // Update buffer on change
                                                  mode="decimal" // Decimal mode for input
                                                  showButtons // Show increment/decrement buttons
                                                  min={0} // Minimum value
                                                  // max={100} // Maximum value
                                                />
                                              </div>
                                            </Fieldset>
                                          </Badge>
                                          {/* {isPublicAccess && (
                                            <>
                                            <Badge  badgeContent={<>
                                            <Tooltip title="buffer" placement="top">
                                            <InfoIcon sx={{color:"#607d8b"}} fontSize="small" />
                                            </Tooltip>
                                            </>}>
                                              <Fieldset
                                                className="fieldSetStyle" // Custom styles for fieldset
                                                style={{ marginTop: "0.5rem" }} // Margin on top
                                                legend="Enforce(minutes)" // Legend for the fieldset
                                              >
                                                <div className="flex-auto">
                                                  <InputNumber
                                                    inputStyle={{ width: "100%" }} // Full width input
                                                    inputId="minmax-buttons" // Input ID
                                                    value={enforceStartDuration} // Controlled value for enforce
                                                    onValueChange={(e) =>
                                                      setEnforceStartDuration(e.value)
                                                    } // Update enforce on change
                                                    mode="decimal" // Decimal mode for input
                                                    showButtons // Show increment/decrement buttons
                                                    min={0} // Minimum value
                                                    // max={100} // Maximum value
                                                  />
                                                </div>
                                              </Fieldset>
                                              </Badge>
                                            </>
                                          )} */}
                                          <br /> <br />
                                          <Badge
                                            badgeContent={
                                              <>
                                                <Tooltip title="Enforce" placement="top">
                                                  <InfoIcon
                                                    sx={{ color: "#607d8b" }}
                                                    fontSize="small"
                                                  />
                                                </Tooltip>
                                              </>
                                            }
                                          >
                                            <div
                                              style={{
                                                display: "flex", // Flexbox layout for toggle
                                                alignItems: "center", // Center alignment for items
                                                columnGap: "1rem", // Gap between columns
                                                justifyContent: "center", // Center alignment for container
                                              }}
                                            >
                                              <label className="font-bold block">Enforce</label>
                                              <ToggleButton
                                                onLabel="Yes" // Label for the toggle when on
                                                offLabel="No" // Label for the toggle when off
                                                size="small" // Small toggle button size
                                                onIcon="pi pi-check" // Icon when toggle is on
                                                offIcon="pi pi-times" // Icon when toggle is off
                                                checked={checked} // Control checked state
                                                onChange={(e) => setChecked(e.value)} // Update checked state on change
                                                // className="w-6rem" // Custom width for toggle button
                                                className={
                                                  checked
                                                    ? "toggle-button-activeNew "
                                                    : "toggle-button-inactiveNew"
                                                }
                                              />
                                            </div>
                                          </Badge>
                                          <br />
                                          <br />
                                          {buttonShow ? ( // Conditional rendering based on buttonShow state
                                            <Button
                                              label="Add Activity" // Button label
                                              icon="pi pi-check" // Check icon
                                              severity="success" // Success color for button
                                              rounded // Rounded button style
                                              disabled={
                                                // Disable button based on validation
                                                !activityAbbr ||
                                                !activityName ||
                                                nameError ||
                                                abbrError
                                              }
                                              onClick={addNode} // Click handler for adding activity
                                            />
                                          ) : (
                                            <div
                                              style={{
                                                display: "flex", // Flexbox layout for action buttons
                                                columnGap: "0.8rem", // Gap between buttons
                                                alignItems: "center", // Center alignment for items
                                                justifyContent: "center", // Center alignment for container
                                              }}
                                            >
                                              <Button
                                                label="Update" // Button label for update
                                                icon="pi pi-file-edit" // Edit icon
                                                rounded // Rounded button style
                                                size="small" // Small button size
                                                severity="success" // Success color for button
                                                // disabled={
                                                //   // Disable button based on validation
                                                //   !activityAbbr ||
                                                //   !activityName ||
                                                //   nameError ||
                                                //   abbrError
                                                // }
                                                disabled={activityList?.find(activity => activity?.activityId === selectedNodeId)?.actvityStatus?.toLowerCase() !== "not started"}

                                                onClick={updateNodeName} // Click handler for updating activity
                                              ></Button>
                                              <Button
                                                label="Cancel" // Button label for cancel
                                                icon="pi pi-times" // Cancel icon
                                                rounded // Rounded button style
                                                size="small" // Small button size
                                                severity="help" // Help color for button
                                                onClick={handleOnCancelClick} // Click handler for cancelling action
                                              ></Button>
                                            </div>
                                          )}
                                        </div>
                                      </center>
                                    </Sidebar>
                  <Dialog
                    header={
                      <>
                        Add Logbook & Asset for :{" "}
                        <Chip
                          color="success"
                          size="small"
                          label={activityName}
                        />
                      </>
                    }
                    visible={assetDlg}
                    maximizable
                    style={{ width: isMobile ? "90%" : "50vw" }}
                    onHide={() => {
                      if (!assetDlg) return;
                      setAssetDlg(false);
                      setSelectedGroups("");
                    }}
                  >
                    <div>
                      <Divider sx={{ marginBottom: "0.6rem", opacity: 0.8 }} />
                      <PrimeCard className="primeCardStyle cardBodyPadding">
                        <TabView
                          activeIndex={activeIndex}
                          onTabChange={handleTabChange}
                          className="tabViewStyle"
                        >
                          <TabPanel header="With Asset">
                            <div>
                              {" "}
                              <PrimeCard
                                // title="Advanced Card"
                                subTitle="Asset Tree"
                                // className="md:w-24rem"
                                style={{ boxShadow: "none", padding: "0.5rem" }}
                              >
                                {treeData !== null && (
                                  <CustomTreeView
                                    data={treeData}
                                    renderTree={renderTree}
                                    handleNodeClick={handleNodeClick}
                                    handleContextMenu={handleContextMenu}
                                  />
                                )}
                              </PrimeCard>
                              <Divider sx={{ margin: "0.5rem 0" }} />
                              <PrimeCard
                                //   className="md:w-24rem"
                                style={{ boxShadow: "none" }}
                              >
                                <div
                                  style={{
                                    display: "grid",
                                    justifyItems: "center",
                                    marginTop: "1rem",
                                  }}
                                >
                                  <Dropdown
                                    //emptyMessage=""
                                    value={selectedGroups}
                                    onChange={(e) => setSelectedGroups(e.value)}
                                    options={groupList}
                                    // disabled={loading}
                                    // optionLabel="name"
                                    display="chip"
                                    filter
                                    showClear
                                    variant="filled"
                                    placeholder="Select a Group"
                                    className="w-25rem"
                                  />
                                  <br></br>

                                  <div
                                    className="Test1"
                                    style={{ display: "inline-flex" }}
                                  >
                                    <Dropdown
                                      //emptyMessage=""
                                      value={selectedLogbooks}
                                      onChange={(e) =>
                                        setSelectedLogbooks(e.value)
                                      }
                                      options={logbookOptions}
                                      disabled={loading}
                                      // optionLabel="name"
                                      display="chip"
                                      filter
                                      showClear
                                      variant="filled"
                                      placeholder="Select a Logbook"
                                      className="w-25rem"
                                    />
                                    {!loading ? <></> : <CircularProgress />}
                                  </div>
                                  <br></br>

                                  <Button
                                    label="ADD"
                                    icon="pi pi-plus"
                                    rounded
                                    size="small"
                                    onClick={handleAddAssetLogbookClick}
                                  />
                                </div>
                              </PrimeCard>
                              <br></br>
                              <PrimeCard>
                                <DataTable
                                  removableSort
                                  className="UserInfoTableStyle HeaderColor"
                                  // tableStyle={{ minWidth: "50rem" }}
                                  value={assetLogbookData}
                                  header={header}
                                  globalFilter={globalFilter}
                                >
                                  <Column
                                    field="asset"
                                    header="Asset"
                                    sortable
                                    // style={{ width: "25%" }}
                                  />
                                  <Column
                                    field="logbook"
                                    header="Logbook"
                                    // body={groupIdTemplate}
                                    sortable
                                    // style={{ width: "25%" }}
                                  />
                                  <Column
                                    field="groups"
                                    header="Group"
                                    sortable
                                    //style={{ width: "25%" }}
                                  />
                                  {/* <Column
                            field="department"
                            header="Department"
                            sortable
                            //style={{ width: "25%" }}
                          /> */}
                                  <Column
                                    field="Action"
                                    header="Action"
                                    body={actionTemplate}
                                  />
                                </DataTable>
                              </PrimeCard>
                            </div>
                          </TabPanel>

                          <TabPanel header="Without Asset">
                            <div>
                              {" "}
                              <PrimeCard
                                style={{ boxShadow: "none" }}
                                //   className="md:w-24rem"
                              >
                                <div
                                  style={{
                                    display: "grid",
                                    justifyItems: "center",
                                    marginTop: "1rem",
                                  }}
                                >
                                  {/* <Dropdown
                                    //emptyMessage=""
                                    value={selectedDept}
                                    onChange={(e) => setSelectedDept(e.value)}
                                    options={departmentList}
                                    // disabled={loading}
                                    // optionLabel="name"
                                    display="chip"
                                    filter
                                    showClear
                                    variant="filled"
                                    placeholder="Select a Department"
                                    className="w-full md:w-25rem"
                                  />
                                  <br></br>
                                  <br></br> */}
                                  <Dropdown
                                    //emptyMessage=""
                                    value={withoutAssetselectedGroups}
                                    onChange={(e) =>
                                      setWithoutAssetSelectedGroups(e.value)
                                    }
                                    options={withoutAssetGroupList}
                                    // disabled={loading}
                                    optionLabel="groupName"
                                    display="chip"
                                    filter
                                    showClear
                                    variant="filled"
                                    placeholder="Select a Group"
                                    className="w-full md:w-25rem"
                                  />
                                  <br></br>

                                  <div
                                    className="Test1"
                                    style={{ display: "inline-flex" }}
                                  >
                                    <Dropdown
                                      value={withoutAssetSelectedLogbooks}
                                      onChange={(e) =>
                                        setWithoutAssetSelectedLogbooks(e.value)
                                      }
                                      options={withoutAssetLogbookOptions}
                                      disabled={loading}
                                      display="chip"
                                      filter
                                      showClear
                                      variant="filled"
                                      placeholder="Select a Logbook"
                                      className="w-full md:w-25rem"
                                    />
                                    {!loading ? <></> : <CircularProgress />}
                                  </div>
                                  <br></br>

                                  <Button
                                    label="ADD"
                                    icon="pi pi-plus"
                                    rounded
                                    size="small"
                                    onClick={
                                      handleWithoutAssetAddAssetLogbookClick
                                    }
                                  />
                                  <br></br>
                                </div>
                              </PrimeCard>
                              <DataTable
                                removableSort
                                className="UserInfoTableStyle HeaderColor dataTableStyle"
                                value={withoutAssetLogbookData}
                                header="Activity Overview"
                                globalFilter={null}
                              >
                                <Column
                                  field="groups"
                                  header="Group"
                                  sortable
                                />
                                <Column
                                  field="logbook"
                                  header="Logbook"
                                  sortable
                                />
                                <Column
                                  field="Action"
                                  header="Action"
                                  body={withoutAssetActionTemplate}
                                />
                              </DataTable>
                            </div>
                          </TabPanel>
                        </TabView>
                      </PrimeCard>
                    </div>
                  </Dialog>
                  <SnackbarComponent
                    openPopup={snackbarOpen}
                    setOpenPopup={setSnackbarOpen}
                    dialogMessage={snackbarText}
                    snackbarSeverity={snackbarSeverity}
                  ></SnackbarComponent>
                  <CustomDialog
                    open={delOpen}
                    setOpen={setDelOpen}
                    proceedButtonText={"YES"}
                    proceedButtonClick={deleteGroup}
                    cancelButtonText={"NO"}
                  ></CustomDialog>

                  <CustomDialog
                    open={tabChangeOpen}
                    setOpen={setTabChangeOpen}
                    proceedButtonText={"YES"}
                    proceedButtonClick={tabchange}
                    cancelButtonText={"NO"}
                  ></CustomDialog>
                </div>
              </Card>
            </div>
          </Container>
        </>
      ) : (
        <>
          <AdhocJobTable 
          adhocJobs={adhocJobs} 
          dbTaskDetails={dbTaskDetails} 
          setdbTaskDetails={setdbTaskDetails}  
          jobDetails={jobDetails} 
          setJobDetails={setJobDetails}
          taskFromExistingTask={taskFromExistingTask}
          setTaskDetails={setTaskDetails}
          setActivityList={setActivityList}
          filteredTasksByAssetGroup={filteredTasksByAssetGroup}
          setShowCreation={setShowCreation}
          setTaskName={setTaskName}
          setSelectedAssetGroup={setSelectedAssetGroup}
          setSelectedReviwer={setSelectedReviwer}
          setDescription={setDescription}
          setTaskFromExistingTask={setTaskFromExistingTask}
          setJobStartDate={setJobStartDate}
          getJobStatusColor={getJobStatusColor}
          setActiveStep={setActiveStep}
          setSnackbarOpen={setSnackbarOpen}
          handleReset={handleReset}
          refreshJobs={refreshJobs}
          processDbRequest={processDbRequest}
          />
         
           {/* <SnackbarComponent
                    openPopup={snackbarOpen}
                    setOpenPopup={setSnackbarOpen}
                    dialogMessage={snackbarText}
                    snackbarSeverity={snackbarSeverity}
                  ></SnackbarComponent> */}
          <Tooltip title="Create New" placement="top">
            <Fab
              size="large"
              variant="extended"
              color="secondary"
              aria-label="add"
              sx={{ position: "fixed", left: "94%", bottom: "5%" }}
              onClick={() => {
                handleReset();
                setShowCreation(true);
                
              }}
            >
              <i className="pi pi-plus-circle"></i>

              <Badge
                //badgeContent={overviewTableData.length}
                color="primary"
              ></Badge>
            </Fab>
          </Tooltip>
        </>
      )}
    </>
  );
}
