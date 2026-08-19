import HomeIcon from "@mui/icons-material/Home"; // Importing Home icon from Material-UI icons library for UI navigation or home button.
import { useMemo } from "react";
import { ReactFlowProvider } from "reactflow";
import {
  Avatar,
  Badge,
  Chip, // Importing Chip component for displaying small information or tags.
  CircularProgress, // Importing CircularProgress component for showing loading indicators.
  Divider, // Importing Divider component for adding visual breaks between sections.
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
} from "./TaskAPI"; // Importing task-related API functions from the TaskAPI module.

import "./taskCreation.css"; // Importing a CSS file for task creation component styling.
import TaskMaster from "./TaskMasterTest"; // Importing TaskMaster component from the TaskMasterTest module.

import { makeStyles } from "@mui/styles"; // Importing makeStyles from Material-UI's styles for custom component styling.
import "primeflex/primeflex.css"; // Importing PrimeFlex CSS for responsive design and layout.
import "primeicons/primeicons.css"; // Importing PrimeIcons CSS for using icons from PrimeReact.
import { Fieldset } from "primereact/fieldset"; // Importing Fieldset component from PrimeReact for grouping related fields.
import "primereact/resources/primereact.min.css"; // Importing PrimeReact's base CSS file.
import "primereact/resources/themes/saga-blue/theme.css"; // Importing Saga Blue theme for PrimeReact components.

import { calculateTotalDuration } from "../JobAssign/helper"; // Importing a helper function to calculate the total duration for job assignments.

import {
  // Importing functions to fetch user and group details.
  fetchAllUsers, // Function to fetch all user details.
  getAllGroupDetails, // Function to fetch all group details.
} from "../UserModuleUpdated/UsermoduleApi"; // Importing user module-related API functions from the UsermoduleApi module.
import CustomNode from "./CustomNode";
import SwitchButton from "../Logbook Configure/SwitchButton";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import ExportFlowButton from "./ExportFlowButton";

export default function TaskCreation({ dbTaskDetails }) {
  console.log("dbTaskDetails : ", dbTaskDetails);
  // Main function component for Task Creation, takes dbTaskDetails as a prop.
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
  const [showCreation, setShowCreation] = useState(true); // State to control visibility of the creation section.
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
    [],
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
    [],
  );
  const edgeTypes = useMemo(
    () => ({
      // Define edge types here if needed
    }),
    [],
  );
  // Objective: This useEffect is used to handle browser unload confirmation and fetch initial task details, group information, and logbook data from APIs.

  useEffect(() => {
    // First useEffect is for handling before unload confirmation (when the user tries to navigate away).
    const handleBeforeUnload = (event) => {
      const confirmationMessage = "Are you sure you want to leave?"; // The confirmation message shown to the user.

      event.returnValue = confirmationMessage; // Set the return value to show a confirmation dialog.
      return confirmationMessage; // Return the confirmation message.
    };

    window.addEventListener("beforeunload", handleBeforeUnload); // Add event listener for beforeunload event when the window is closing.

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload); // Cleanup by removing the beforeunload event listener when the component unmounts.
    };
  }, []); // Empty dependency array ensures this runs only once when the component mounts.

  useEffect(() => {
    // Second useEffect is for fetching data like task details, activity connections, group details, and logbook data.

    async function fetchData() {
      await extendTokenExpiration(); // Extend token expiration to maintain user session.

      let getAllGrp = await getAllGroupDetails(); // Fetch all group details from the API.
      setWithoutAssetGroupList(getAllGrp); // Set the group details without asset to state.

      let data = await getAllActiveFormInfo(); // Fetch all active form information.
      setLogbookIdListMap(data); // Set the logbook ID map with the fetched data.

      if (
        dbTaskDetails !== null &&
        dbTaskDetails !== undefined &&
        dbTaskDetails !== ""
      ) {
        // Check if dbTaskDetails is not null, undefined, or empty.

        let activityconnections = []; // Initialize an empty array for activity connections.
        activityconnections = await getActivityConnectionsFromAPI(
          // Fetch activity connections based on taskId.
          dbTaskDetails.taskId,
        );

        setTaskDetails(dbTaskDetails); // Set task details with fetched dbTaskDetails data.
        setActivityList(dbTaskDetails.activityList); // Set activity list from task details.
        setTaskName(dbTaskDetails.taskName); // Set task name from dbTaskDetails.
        setSelectedAssetGroup(dbTaskDetails.assetGroup); // Set asset group from dbTaskDetails.
        setDescription(dbTaskDetails.description); // Set task description from dbTaskDetails.
        setSelectedReviwer(dbTaskDetails.reviewer); // Set the reviewer from dbTaskDetails.

        const nodesData = dbTaskDetails.activityList?.map((activity) => ({
          id: activity.activityId, // Assign activityId to node ID.
          type: "customNode",
          data: {
            label: activity.activityName,
            sequence: activity.sequence,
            duration: activity.duration,
          }, // Set node label and sequence from activity data.
          position: { x: activity.xPos, y: activity.yPos }, // Set node position based on activity's xPos and yPos.
        }));

        setNodes(nodesData); // Set nodes with generated nodesData.

        if (activityconnections.length !== 0) {
          // If there are activity connections available.
          const linksData = activityconnections.map((connection) => ({
            id: connection.sourceId + connection.targetId, // Create a unique ID for the edge.
            source: connection.sourceId, // Set the source ID for the connection.
            target: connection.targetId, // Set the target ID for the connection.
            animated: true, // Enable animation for the connection (edge).
            data: {
              sourceName: connection.source, // Set source name for the connection.
              targetName: connection.target, // Set target name for the connection.
            },
          }));

          setEdges(linksData); // Set edges with generated linksData.
        }
      }
    }

    fetchData(); // Invoke the fetchData function to fetch initial data on component load.

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
          : taskList, // Set task list or empty array based on fetched data.
      );
    }

    fetchLogBookList(); // Invoke the fetchLogBookList function to get logbook data and tasks.

    async function getActivityConnectionsFromAPI(taskId) {
      // Function to fetch activity connections by taskId.
      const connections = await getActivityConnections(taskId); // Fetch connections based on task ID.

      const activityconnections =
        connections === null || connections === undefined || connections === ""
          ? []
          : connections; // Return empty array if connections are null/undefined/empty, else return connections.

      return activityconnections; // Return the fetched activity connections.
    }
  }, []); // Empty dependency array ensures this useEffect runs only once when the component mounts.

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
                  (item) => item.groupID === group, // Find the group by groupID.
                );
                return (
                  selectedGroups.trim() === groupByGroupId?.groupName?.trim() // Compare group names.
                );
              }),
            ).then((results) => results.some(Boolean)); // Check if any group matches the selectedGroups.

            const isInSelectedDept = false; // Placeholder for department check.

            return isInSelectedGroups || isInSelectedDept ? logbook : null; // Return logbook if it matches groups or department.
          }),
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
              }),
            ).then((results) => results.some(Boolean)); // Check if any group matches.

            const isInSelectedDept = false; // Placeholder for department check.

            return isInSelectedGroups || isInSelectedDept ? logbook : null; // Return logbook if it matches.
          }),
        );

        const validLogbooks = filteredLogbooks.filter(
          (logbook) => logbook !== null, // Filter out null logbooks.
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
      const abbrTooLong = activityAbbr.length > 6; // Check if activity abbreviation exceeds 6 characters.

      const nameExists = activityList?.some(
        (activity) =>
          activity.activityName &&
          activity.activityName.toLowerCase() === activityName.toLowerCase() &&
          activity.activityId !== selectedNodeId, // Check if activity name exists and isn't the selected node.
      );

      const abbrExists = activityList?.some(
        (activity) =>
          activity.activityAbrv &&
          activity.activityAbrv.toLowerCase() === activityAbbr.toLowerCase() &&
          activity.activityId !== selectedNodeId, // Check if activity abbreviation exists and isn't the selected node.
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
      if (!edgesUpdatable) return;
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
    [nodes, edges, setEdges, setNodes], // Dependencies to re-run this callback when they change.
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
    [nodes, edges, setEdges, setNodes], // Dependencies to re-run this callback when they change.
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
    [edges, setEdges, setNodes], // Dependencies to re-run this callback when they change.
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
    let data = await fetchAllUsers(); // Fetch all users from the API

    const currUser = getloggedInUser(); // Get the logged-in user

    const options = data
      ?.filter(
        (user) =>
          user.userID !== currUser && // Exclude the current user from the list
          user.active && // Only include active users
          user.allotedPages?.some((pageObj) => {
            return (
              pageObj.page?.toLowerCase() === "Task Reviewer".toLowerCase()
            ); // Check if the user is assigned to "Activity Reviewer"
          }),
      )
      ?.map((user) => ({
        label: `${user.userName} (${user.userID})`, // Create a label combining the user's name and ID
        value: user.userID, // Set the user's ID as the value
      }));

    setReviewOptions(options); // Set the available reviewer options
  }

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
  const handleSaveDraftTask = async () => {
    // Check if the task is already published or pending, move to the next step if true
    if (
      dbTaskDetails?.status === "Published" ||
      dbTaskDetails?.status === "Pending"
    ) {
      stepperRef.current.nextCallback(); // Proceed to the next step
      return;
    }

    // Check if the task name is empty, show an error message if true
    if (taskName === "" || taskName === undefined || taskName === null) {
      setSnackbarOpen(true); // Open the snackbar
      setSnackbarText("Task Name Should Not be Empty !"); // Set snackbar text
      setsnackbarSeverity("error"); // Set snackbar severity to error
      return;
    }

    // Check if a reviewer is selected, show an error message if not
    if (
      selectedReviwer === "" ||
      selectedReviwer === undefined ||
      selectedReviwer === null
    ) {
      setSnackbarOpen(true); // Open the snackbar
      setSnackbarText("Choose reviewer !"); // Set snackbar text
      setsnackbarSeverity("error"); // Set snackbar severity to error
      return;
    }

    // Handle case where task details are null or empty
    if (
      dbTaskDetails === null ||
      dbTaskDetails === undefined ||
      dbTaskDetails === ""
    ) {
      if (
        taskList !== undefined &&
        taskList !== null &&
        taskList !== "" &&
        taskList.length !== 0
      ) {
        // Add any logic for handling taskList if necessary
      }
    }

    // Determine taskId, either from dbTaskDetails or taskDetails, or generate a new one
    let taskId =
      dbTaskDetails?.taskId !== "" &&
      dbTaskDetails?.taskId !== undefined &&
      dbTaskDetails?.taskId !== null
        ? dbTaskDetails?.taskId
        : taskDetails?.taskId !== "" &&
            taskDetails?.taskId !== undefined &&
            taskDetails?.taskId !== null
          ? taskDetails?.taskId
          : generateTaskId(); // Generate a new task ID if none exists

    // Determine the task status, defaulting to "Not Ready"
    let status =
      dbTaskDetails?.status !== "" &&
      dbTaskDetails?.status !== undefined &&
      dbTaskDetails?.status !== null
        ? dbTaskDetails?.status
        : "Not Ready";

    // Get the logged-in user ID from session storage
    const env_userId = process.env.REACT_APP_USERID;
    const user = localStorage.getItem(env_userId);

    // Determine the task creator, using the dbTaskDetails or decrypting the logged-in user
    let creator =
      dbTaskDetails?.creator !== "" &&
      dbTaskDetails?.creator !== undefined &&
      dbTaskDetails?.creator !== null
        ? dbTaskDetails?.creator
        : decryptTokenId(user);

    // Determine the tenantId, either from dbTaskDetails or using a fallback method
    const tenantId =
      dbTaskDetails?.tenantId !== "" &&
      dbTaskDetails?.tenantId !== undefined &&
      dbTaskDetails?.tenantId !== null
        ? dbTaskDetails?.tenantId
        : getTenantID();

    // Create a new task object with all the relevant details
    const newTask = {
      creationTime: new Date(), // Set the creation time to the current date and time
      taskId: taskId, // Set the task ID
      taskName: taskName, // Set the task name
      creator:
        creator === undefined || creator === null
          ? decryptTokenId(user) // If creator is null, use the logged-in user
          : creator,
      reviewer: selectedReviwer, // Set the selected reviewer
      assetGroup: selectedAssetGroup, // Set the selected asset group
      description: description, // Set the task description
      activityList: activityList, // Set the list of activities
      status: status === undefined || status === null ? "Not Ready" : status, // Default to "Not Ready" if status is null
      tenantId:
        tenantId === undefined || tenantId === null ? getTenantID() : tenantId, // Default to a tenant ID if null
      adhocTask: false,
    };

    // Save the task through the API and handle the response status
    const apiStatus = await handleSaveTask(newTask);
    if (
      apiStatus !== null &&
      apiStatus !== undefined &&
      apiStatus !== "" &&
      (apiStatus === 200 || apiStatus === 201)
    ) {
      setTaskDetails(newTask); // Update task details with the saved task
      setSnackbarOpen(true); // Open the snackbar
      setSnackbarText("Task Save as Draft !"); // Set snackbar text
      setsnackbarSeverity(); // Set snackbar severity (default)
      stepperRef.current.nextCallback(); // Proceed to the next step in the stepper
      setActiveStep(activeStep + 1); // Move to the next active step
    } else {
      setSnackbarOpen(true); // Open the snackbar
      setSnackbarText("Database Error !"); // Set snackbar text to indicate an error
      setsnackbarSeverity("error"); // Set snackbar severity to error
    }
  };

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
        (node) => node.id === activity.activityId,
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
      assetLogbookData.filter((row) => row.assetId !== assetId),
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
          asset.assetId === selectedNode.id, // Check if asset ID matches
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
      (asset) => asset?.groups?.trim() === selectedGroups?.trim(),
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

  // Objective: Renders the header for the table with a search input field.
  const renderHeader = () => {
    return (
      <div
        className="table-header"
        style={{
          display: isMobile ? "grid" : "flex", // Adjust layout based on screen size
          justifyContent: "space-between", // Space between header and search input
          alignItems: "center", // Align items in the center
          margin: "0rem 0.8rem", // Set margin
        }}
      >
        <h4 className="mx-0 my-1">Activity Overview</h4> {/* Table title */}
        <span className="p-input-icon-left">
          {" "}
          {/* Search input with icon */}
          <i className="pi pi-search" />
          <InputText
            type="search"
            className="p-inputtext-sm"
            style={{ width: isMobile ? "80%" : "" }}
            onInput={(e) => setGlobalFilter(e.target.value)} // Set global filter on input
            placeholder="Keyword Search" // Input placeholder
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
        data: { label: activityName, sequence: 1, duration: duration },
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
        assetName: assets,
        assetId: assetIds,
        assetNameList:
          assets?.split(",") === undefined || "" ? [] : assets.split(","),
        assetIDList:
          assetIds.split(",") === undefined || "" ? [] : assetIds.split(","),
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
      };

      // Update the task details and activity list with the new activity
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
    if (visited.size === nodes.length) {
      return true;
    } else {
      return false;
    }
  };

  // Objective: Handle node click event and populate activity details for editing.
  const onNodeClick = (event, node) => {
    // Prevent any actions if the task is "Published" or "Pending"
    if (
      dbTaskDetails?.status === "Published" ||
      dbTaskDetails?.status === "Pending"
    ) {
      return;
    }

    // Reset logbook data and populate the clicked node's details
    setWithoutAssetLogbookData([]);
    setAssetLogbookData([]);
    setActivityName(node.data.label);
    setUpdatedActivityName(node.data.label);
    setSelectedNodeId(node.id);

    // Find the corresponding activity details from the activity list
    const foundActivity = activityList.find(
      (activity) => activity.activityId === node.id,
    );
    console.log("My found activity : ", foundActivity);
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
          if (foundActivity?.activityUserGroupList[0]) {
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
            return {
              ...node,
              data: {
                ...node.data,
                label: activityName,
                duration: hours * 60 + minutes,
              },
            };
          } else {
            return node;
          }
        }),
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
        assetName: assets,
        assetId: assetIds,
        assetNameList:
          assets?.split(",") === undefined || "" ? [] : assets.split(","),
        assetIDList:
          assetIds.split(",") === undefined || "" ? [] : assetIds.split(","),
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
          edge.source !== selectedNodeId && edge.target !== selectedNodeId,
      );
      setNodes(newNodes);
      setEdges(newEdges);
      setSelectedNodeId(null);

      // Update the activity list by filtering out the deleted activity
      const updatedActivityList = activityList.filter(
        (activity) => activity.activityId !== selectedNodeId,
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
      process.env.REACT_APP_USERID,
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
      withoutAssetLogbookData.filter((item) => item !== rowData),
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

  return (
    <>
      {showCreation ? ( // Check if task creation form is being shown
        <>
          <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
            {/* Main container for the card component, set to a max width and padding */}
            <div
              style={{
                background: "white", // Background color of the card
                marginLeft: isMobile ? "" : "4%", // Adjust margin based on screen size
                borderRadius: "1rem", // Rounded corners for the card
                boxShadow:
                  "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)", // Shadow effect for depth
              }}
            >
              <Card>
                <div>
                  {/* Header section of the card with title and action buttons */}
                  <div
                    style={{
                      padding: isMobile ? "" : "0.2rem 1.1rem", // Padding adjustments for mobile
                      display: "flex", // Flexbox for layout
                      justifyContent: "space-between", // Space between items
                      alignItems: "center", // Center alignment of items
                      columnGap: "0.3rem", // Gap between columns
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                      {/* Conditional rendering based on the presence of dbTaskDetails */}
                      {dbTaskDetails ? (
                        <div
                          style={{
                            display: "flex", // Flexbox for inner content
                            alignItems: "center", // Center alignment of items
                            columnGap: "0.6rem", // Gap between items
                          }}
                        >
                          <div class="fadeoutdown animation-duration-300 ">
                            {/* Tooltip for the Home icon */}
                            <Tooltip title="Home" placement="top">
                              <IconButton
                                color="info" // Color of the icon button
                                aria-label="home" // Accessibility label
                                size="large" // Size of the icon button
                                onClick={() => {
                                  setShowCreation(false); // Action on click
                                }}
                              >
                                <HomeIcon /> {/* Home icon */}
                              </IconButton>
                            </Tooltip>
                          </div>
                          <Chip label={dbTaskDetails.taskName} />{" "}
                          {/* Displays task name */}
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div class="fadeoutdown animation-duration-300 ">
                            {/* Tooltip for the Home icon when no task details are available */}
                            <Tooltip title="Home" placement="top">
                              <IconButton
                                color="info"
                                aria-label="home"
                                size="large"
                                onClick={() => {
                                  setShowCreation(false); // Action on click
                                }}
                              >
                                <HomeIcon /> {/* Home icon */}
                              </IconButton>
                            </Tooltip>
                          </div>

                          <Typography fontWeight="bold" fontSize="0.85rem">
                            Create Task {/* Display text for creating a task */}
                          </Typography>
                        </div>
                      )}
                    </Typography>
                    <div
                      style={{
                        display: "flex", // Flexbox for action buttons
                        alignItems: "center", // Center alignment of items
                        columnGap: "0.6rem", // Gap between items
                      }}
                    >
                      {activeStep === 1 ? (
                        <Button
                          rounded // Rounded button style
                          size="small" // Size of the button
                          severity="help" // Button severity type
                          icon={
                            <>
                              <PlaylistAddIcon />{" "}
                              {/* Icon for adding an activity */}
                            </>
                          }
                          onClick={() => {
                            handleOnCancelClick(); // Call cancel handler
                            setDlgVisible(true); // Show dialog for adding activity
                          }}
                        >
                          Add Activity {/* Button text */}
                        </Button>
                      ) : null}
                    </div>
                  </div>
                  <Divider />{" "}
                  {/* Divider line separating header from content */}
                  <Stepper
                    ref={stepperRef} // Reference for the stepper component
                    style={{ flexBasis: "50rem" }} // Set the flex basis for the stepper
                    orientation="horizontal" // Ensure the steps are linear
                    // orientation={isMobile ? "vertical" : "horizontal"}
                    className={
                      isMobile
                        ? "forBorderRadius MobileViewStepper"
                        : "forBorderRadius"
                    } // Class for custom styling
                    headerPosition="top"
                    activeIndex={activeStep} // Set the current active step
                  >
                    <StepperPanel header="Task Creation">
                      {/* Panel for the task creation step */}
                      <div style={{ height: "63vh" }}>
                        {/* Main content area with fixed height */}
                        <div style={formWrapperStyle}>
                          {/* Wrapper for the form styling */}
                          <form style={formStyle}>
                            {/* Form for task details */}
                            <div style={formGroupStyle}>
                              {/* Group for task name input */}
                              {isMobile || (
                                <label htmlFor="task-name" style={labelStyle}>
                                  Task Name{" "}
                                  {/* Label for the task name input */}
                                </label>
                              )}
                              <TextField
                                id="task-name" // Unique ID for the task name input
                                label="Task Name" // Input label
                                variant="outlined" // Material-UI text field variant
                                disabled={dbTaskDetails} // Disable input if task details exist
                                value={taskName} // Controlled input value
                                error={isTaskNameMatched} // Show error state if task name matches
                                helperText={
                                  isTaskNameMatched
                                    ? "Already exist in the database" // Helper text for error state
                                    : ""
                                }
                                onChange={handleChange} // Handler for input change
                              />
                            </div>
                            <div style={formGroupStyle}>
                              {/* Group for selecting asset group */}
                              {isMobile || (
                                <label
                                  htmlFor="asset-group-dropdown"
                                  style={labelStyle}
                                >
                                  Select an Asset Group{" "}
                                  {/* Label for asset group dropdown */}
                                </label>
                              )}
                              <Dropdown
                                id="asset-group-dropdown" // Unique ID for the asset group dropdown
                                value={selectedAssetGroup} // Controlled dropdown value
                                onChange={(e) => setSelectedAssetGroup(e.value)} // Update state on change
                                options={assetGroups} // Options for the dropdown
                                disabled={
                                  dbTaskDetails?.status === "Published" || // Disable dropdown based on task status
                                  dbTaskDetails?.status === "Pending"
                                    ? true
                                    : false
                                }
                                showClear // Show clear button for dropdown
                                filter // Enable filtering for dropdown options
                                variant="filled" // Dropdown variant
                                placeholder="Select an Asset Group" // Placeholder text
                                className="w-full md:w-14rem" // Responsive width classes
                              />
                            </div>
                            <div style={formGroupStyle}>
                              {/* Group for selecting reviewer */}
                              {isMobile || (
                                <label
                                  htmlFor="reviewer-dropdown"
                                  style={labelStyle}
                                >
                                  Select a Reviewer{" "}
                                  {/* Label for reviewer dropdown */}
                                </label>
                              )}
                              <Dropdown
                                id="reviewer-dropdown" // Unique ID for the reviewer dropdown
                                value={selectedReviwer} // Controlled dropdown value
                                onChange={(e) => setSelectedReviwer(e.value)} // Update state on change
                                options={reviewOptions} // Options for the dropdown
                                showClear // Show clear button for dropdown
                                filter // Enable filtering for dropdown options
                                variant="filled" // Dropdown variant
                                placeholder="Select a Reviewer" // Placeholder text
                                className="md:w-14rem sm:w-1rem" // Responsive width classes
                                disabled={
                                  dbTaskDetails?.status === "Published" || // Disable dropdown based on task status
                                  dbTaskDetails?.status === "Pending"
                                    ? true
                                    : false
                                }
                              />
                            </div>
                            <div style={formGroupStyle}>
                              {/* Group for description input */}
                              {isMobile || (
                                <label htmlFor="description" style={labelStyle}>
                                  Description{" "}
                                  {/* Label for the description input */}
                                </label>
                              )}
                              <TextField
                                id="description" // Unique ID for the description input
                                label="Description" // Input label
                                multiline // Enable multiline input
                                maxRows={4} // Maximum number of rows for the input
                                value={description} // Controlled input value
                                onChange={(e) => setDescription(e.target.value)} // Update state on change
                                className="w-full md:w-14rem" // Responsive width classes
                                disabled={
                                  dbTaskDetails?.status === "Published" || // Disable input based on task status
                                  dbTaskDetails?.status === "Pending"
                                    ? true
                                    : false
                                }
                              />
                            </div>
                          </form>
                        </div>
                      </div>
                      <div className="flex pt-4 justify-content-end">
                        {/* Footer section for buttons */}
                        <Button
                          disabled={isTaskNameMatched} // Disable button if task name is matched
                          label={
                            dbTaskDetails?.status === "Published" ||
                            dbTaskDetails?.status === "Pending"
                              ? "Next" // Button label for next step
                              : "Save as Draft & Proceed" // Button label for saving as draft
                          }
                          icon="pi pi-arrow-right" // Icon for the button
                          iconPos="right" // Position of the icon
                          size="small" // Size of the button
                          rounded // Rounded button style
                          onClick={handleSaveDraftTask} // Handler for saving draft
                        />
                      </div>
                    </StepperPanel>

                    <StepperPanel header="Activity">
                      {/* Panel for the activity step */}
                      <div>
                        <div
                          style={{ height: "62vh", backgroundColor: "#F8F8F8" }} // Set height and background color for the React Flow container
                        >
                          <ReactFlowProvider>
                            <ReactFlow
                              nodeTypes={nodeTypes}
                              nodes={nodes} // Nodes for the React Flow diagram
                              edges={edges} // Edges for the React Flow diagram
                              onNodesChange={onNodesChange} // Callback for changes to nodes
                              onEdgesChange={onEdgesChange} // Callback for changes to edges
                              snapToGrid // Enable snapping to the grid
                              onReconnect={onReconnect} // Callback for reconnecting nodes
                              onReconnectStart={onReconnectStart} // Callback for starting reconnection
                              onReconnectEnd={onReconnectEnd} // Callback for ending reconnection
                              onConnect={onConnect} // Callback for connecting nodes
                              onNodeClick={onNodeClick} // Callback for clicking on a node
                              fitView // Automatically fit the view to the nodes
                              attributionPosition="top-right" // Position for the attribution
                              nodesDraggable={
                                dbTaskDetails?.status === "Published" || // Disable dragging if task status is Published or Pending
                                dbTaskDetails?.status === "Pending"
                                  ? false
                                  : true
                              }
                              edgesUpdatable={
                                dbTaskDetails?.status === "Published" || // Disable edge updates if task status is Published or Pending
                                dbTaskDetails?.status === "Pending"
                                  ? false
                                  : true
                              }
                            >
                              <ExportFlowButton
                                fileName={
                                  dbTaskDetails?.taskName
                                    ? dbTaskDetails?.taskName
                                    : "Work-Flow"
                                } // Set the file name for exporting the flow diagram
                              />
                              <Controls />
                              {/*Render controls for the React Flow (zoom, fit, etc.) */}
                              <MiniMap />
                              {/*Render a minimap of the flow diagram */}
                              <Background /> {/* Render a background grid */}
                            </ReactFlow>
                          </ReactFlowProvider>
                        </div>
                        <div></div>
                      </div>
                      <div className="flex pt-4 justify-content-between">
                        {/* Footer section for navigation buttons */}
                        <Button
                          label="Back" // Label for the back button
                          size="small" // Size of the button
                          severity="secondary" // Severity style for the button
                          rounded // Rounded button style
                          icon="pi pi-arrow-left" // Icon for the back button
                          onClick={() => {
                            stepperRef.current.prevCallback(); // Callback to go to the previous step
                            setActiveStep(activeStep - 1); // Decrease active step index
                          }}
                        />
                        <Button
                          label={
                            dbTaskDetails?.status === "Published" || // Button label based on task status
                            dbTaskDetails?.status === "Pending"
                              ? "Next" // Label for next step
                              : "Save and Proceed" // Label for saving and proceeding
                          }
                          size="small" // Size of the button
                          icon="pi pi-arrow-right" // Icon for the next button
                          rounded // Rounded button style
                          disabled={nodes.length === 0} // Disable button if there are no nodes
                          iconPos="right" // Position of the icon
                          onClick={handleSaveDraftActivity} // Handler for saving draft activity
                        />
                      </div>
                    </StepperPanel>

                    <StepperPanel header="Confirm">
                      {/* Panel for confirming task details */}
                      <div>
                        <Container maxWidth="lg" sx={{}}>
                          <PrimeCard
                            style={{
                              marginTop: "0", // No top margin
                              padding: "0", // No padding
                              marginBottom: "1rem", // Bottom margin for spacing
                            }}
                            className={isMobile ? "noPadding" : ""}
                          >
                            <Grid
                              container
                              style={{
                                marginTop: "0", // No top margin
                                padding: "0", // No padding
                                marginLeft: "auto",
                                marginRight: "2rem",
                                marginBottom: isMobile ? 0 : "1rem", // Bottom margin for spacing
                              }}
                              //spacing={2} // Spacing between grid items
                            >
                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb", // Border for overview header
                                  padding: "0.5rem", // Padding for header
                                }}
                                xs={12} // Full width
                              >
                                <Typography fontWeight="600" fontSize="0.85rem">
                                  Task Overview{" "}
                                  {/* Title for task overview section */}
                                </Typography>
                              </Grid>
                              {/* Task Name Row */}
                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb", // Border for task name
                                  padding: "0.5rem", // Padding for task name
                                }}
                                xs={6} // Half width
                              >
                                <Typography sx={{ ml: isMobile ? 0 : 7 }}>
                                  Task Name {/* Label for task name */}
                                </Typography>
                              </Grid>
                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb", // Border for task name value
                                  padding: "0.5rem", // Padding for task name value
                                }}
                                xs={6} // Half width
                              >
                                <Typography>
                                  {taskDetails ? taskDetails.taskName : ""}{" "}
                                  {/* Display task name */}
                                </Typography>
                              </Grid>

                              {/* Description Row */}
                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb", // Border for description
                                  padding: "0.5rem", // Padding for description
                                }}
                                xs={6} // Half width
                              >
                                <Typography sx={{ ml: isMobile ? 0 : 7 }}>
                                  Description {/* Label for description */}
                                </Typography>
                              </Grid>
                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb", // Border for description value
                                  padding: "0.5rem", // Padding for description value
                                }}
                                xs={6} // Half width
                              >
                                <Typography>
                                  {taskDetails ? taskDetails.description : ""}{" "}
                                  {/* Display description */}
                                </Typography>
                              </Grid>

                              {/* Approver Row */}
                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb", // Border for approver label
                                  padding: "0.5rem", // Padding for approver label
                                }}
                                xs={6} // Half width
                              >
                                <Typography sx={{ ml: isMobile ? 0 : 7 }}>
                                  Approver {/* Label for approver */}
                                </Typography>
                              </Grid>
                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb", // Border for approver value
                                  padding: "0.5rem", // Padding for approver value
                                }}
                                xs={6} // Half width
                              >
                                <Chip
                                  label={
                                    taskDetails ? taskDetails.reviewer : ""
                                  } // Display reviewer name as a chip
                                />
                              </Grid>

                              {/* Asset Group Row */}
                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb", // Border for asset group label
                                  padding: "0.5rem", // Padding for asset group label
                                }}
                                xs={6} // Half width
                              >
                                <Typography sx={{ ml: isMobile ? 0 : 7 }}>
                                  Asset Group {/* Label for asset group */}
                                </Typography>
                              </Grid>
                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb", // Border for asset group value
                                  padding: "0.5rem", // Padding for asset group value
                                }}
                                xs={6} // Half width
                              >
                                <Typography>
                                  {taskDetails ? taskDetails.assetGroup : ""}{" "}
                                  {/* Display asset group */}
                                </Typography>
                              </Grid>

                              {/* Total Duration Row */}
                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb", // Border for total duration label
                                  padding: "0.5rem", // Padding for total duration label
                                }}
                                xs={6} // Half width
                              >
                                <Typography sx={{ ml: isMobile ? 0 : 7 }}>
                                  {/* Total Duration{" "} */}
                                  {"Total Benchmark Time"}
                                  {/* Label for total duration */}
                                </Typography>
                              </Grid>
                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb", // Border for total duration value
                                  padding: "0.5rem", // Padding for total duration value
                                }}
                                xs={6} // Half width
                              >
                                <Chip
                                  color="info" // Info color for duration chip
                                  size="small" // Small size for chip
                                  label={formatDuration(duration)} // Display formatted duration
                                />
                              </Grid>
                            </Grid>
                          </PrimeCard>
                          <div>
                            <PrimeCard
                              className="noPadding" // No padding class for card
                              style={{
                                marginTop: "0", // No top margin
                                padding: "0", // No padding
                              }}
                            >
                              <DataTable
                                paginator // Enable pagination
                                rows={10} // Default number of rows per page
                                rowsPerPageOptions={[5, 10, 25, 50]} // Options for rows per page
                                removableSort // Enable sorting of columns
                                className="UserInfoTableStyle dataTableStyle HeaderColor" // Custom styles for the table
                                stripedRows // Enable striped rows
                                value={activityList} // Data to be displayed in the table
                                header={header} // Header for the table
                                globalFilter={globalFilter} // Global filter for the table
                              >
                                {/* Table columns definition */}
                                <Column
                                  field="sequence"
                                  header="Order"
                                  sortable
                                />
                                <Column
                                  field="activityName"
                                  header="Activity Name"
                                  body={(rowData) => {
                                    return (
                                      <>
                                        <Tooltip
                                          title={
                                            rowData.enforce === true
                                              ? "Enforce"
                                              : ""
                                          }
                                          placement="right"
                                        >
                                          <Badge
                                            variant={
                                              rowData.enforce === true
                                                ? "dot"
                                                : ""
                                            }
                                            color="warning"
                                          >
                                            <Chip
                                              size="small"
                                              label={rowData.activityName}
                                            />
                                          </Badge>
                                        </Tooltip>
                                      </>
                                    );
                                  }}
                                  sortable
                                />
                                <Column
                                  field="actAbrv"
                                  header="Identifier"
                                  sortable
                                />
                                <Column
                                  header="Group"
                                  sortable
                                  body={(rowData) =>
                                    rowData?.activityUserGroupList[0]
                                  } // Display first user group from the list
                                />
                                <Column
                                  field="logbook"
                                  header="Logbook"
                                  body={(rowData) => {
                                    return (
                                      <>
                                        {rowData.logbook && (
                                          <Chip
                                            color="info"
                                            size="small"
                                            variant="outlined"
                                            label={rowData.logbook}
                                          />
                                        )}
                                      </>
                                    );
                                  }}
                                  sortable
                                />
                                <Column
                                  field="duration"
                                  // header="Duration(Minutes)"
                                  header="Benchmark Time"
                                  body={(rowData) =>
                                    formatDuration(rowData.duration)
                                  }
                                  sortable
                                />
                                <Column
                                  field="buffer"
                                  header="Buffer(Minutes)"
                                  sortable
                                />
                                {/* <Column
                                  field="enforceStartDuration"
                                  header="Enforce start(Minutes)"
                                  sortable
                                /> */}
                                {/* <Column
                                  field="enforce"
                                  header="Enforce"
                                  sortable
                                /> */}
                                <Column
                                  field="assetName"
                                  header="Asset Name"
                                  sortable
                                />
                              </DataTable>
                            </PrimeCard>
                          </div>
                        </Container>
                      </div>
                      <div className="flex pt-4 justify-content-between">
                        {/* Footer section for navigation buttons */}
                        <Button
                          label="Back" // Label for the back button
                          severity="secondary" // Severity style for the button
                          rounded // Rounded button style
                          size="small" // Size of the button
                          icon="pi pi-arrow-left" // Icon for the back button
                          onClick={() => {
                            stepperRef.current.prevCallback(); // Callback to go to the previous step
                            setActiveStep(activeStep - 1); // Decrease active step index
                          }}
                        />
                        <Button
                          label={
                            dbTaskDetails?.status === "Published" || // Button label based on task status
                            dbTaskDetails?.status === "Pending"
                              ? "Close" // Label for close button
                              : "Send for Approval" // Label for send approval button
                          }
                          icon={
                            dbTaskDetails?.status === "Published" || // Icon based on task status
                            dbTaskDetails?.status === "Pending"
                              ? "pi pi-times" // Icon for close button
                              : "pi pi-send" // Icon for send approval button
                          }
                          rounded // Rounded button style
                          severity={
                            dbTaskDetails?.status === "Published" || // Severity style based on task status
                            dbTaskDetails?.status === "Pending"
                              ? "warning" // Warning severity for close button
                              : "success" // Success severity for send approval button
                          }
                          size="small" // Size of the button
                          iconPos="right" // Position of the icon
                          onClick={handleSaveForApproval} // Handler for saving and sending for approval
                        />
                      </div>
                    </StepperPanel>
                  </Stepper>
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
                            style={{ display: "flex", alignItems: "center" }} // Flexbox for centering
                          >
                            <Chip
                              label={updatedActivityName} // Display activity name
                            />
                          </div>

                          <Tooltip title="Delete Activity" placement="right">
                            {/* Tooltip for delete button*/}
                            <Button
                              rounded // Rounded button style
                              text // Text button style
                              icon="pi pi-trash" // Trash icon
                              severity="danger" // Danger color for delete action
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
                          onClick={handleAddAssetClick} // Click handler for adding logbook and asset
                        />
                        <br />
                        <br />
                        <div>
                          {assetLogbookData?.length !== 0 && ( // Check if there are existing asset logbooks
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
                          {console.log("My ", withoutAssetLogbookData)}
                          {withoutAssetLogbookData.length !== 0 && ( // Check if there are existing groups without asset logbooks
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
                              <Tooltip title="Auto Rejected" placement="top">
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
                            <label className="font-bold block">
                              Auto Rejected
                            </label>
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
                              disabled={
                                // Disable button based on validation
                                !activityAbbr ||
                                !activityName ||
                                nameError ||
                                abbrError
                              }
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
                      // Header of the dialog with activity name
                      <>
                        Add Logbook & Asset for :
                        <Chip
                          color="success" // Chip color for success state
                          size="small" // Small size for the chip
                          label={activityName} // Label showing the activity name
                        />
                      </>
                    }
                    visible={assetDlg} // Control visibility of the dialog
                    maximizable // Allow maximizing the dialog
                    style={{ width: isMobile ? "90%" : "50vw" }} // Width based on device type
                    onHide={() => {
                      // Handler for closing the dialog
                      if (!assetDlg) return; // Prevent action if dialog is not visible
                      setAssetDlg(false); // Close the dialog
                      setSelectedGroups(""); // Reset selected groups
                    }}
                  >
                    <div>
                      <Divider sx={{ marginBottom: "0.6rem", opacity: 0.8 }} />
                      <PrimeCard className="primeCardStyle cardBodyPadding">
                        <TabView
                          activeIndex={activeIndex} // Currently active tab index
                          onTabChange={handleTabChange} // Handler for tab change
                          className="tabViewStyle" // Custom styles for tab view
                        >
                          <TabPanel
                            header="With Asset"
                            disabled={treeData === null}
                          >
                            {" "}
                            {/* Tab panel for assets */}
                            <div>
                              <PrimeCard
                                subTitle="Asset Tree" // Subtitle for the asset tree card
                                style={{ boxShadow: "none", padding: "0.5rem" }} // Card styles
                              >
                                {treeData !== null && ( // Check if treeData is available
                                  <CustomTreeView
                                    data={treeData} // Pass tree data
                                    renderTree={renderTree} // Function to render tree nodes
                                    handleNodeClick={handleNodeClick} // Handler for node click
                                    handleContextMenu={handleContextMenu} // Handler for context menu
                                  />
                                )}
                              </PrimeCard>
                              <Divider sx={{ margin: "0.5rem 0" }} />
                              <PrimeCard style={{ boxShadow: "none" }}>
                                <div
                                  style={{
                                    display: "grid", // Grid layout for dropdowns
                                    justifyItems: isMobile ? "start" : "center", // Center items in grid
                                    marginTop: "1rem", // Margin on top
                                  }}
                                >
                                  <Dropdown
                                    id="addLogbookAndAssetDropdown"
                                    value={selectedGroups} // Controlled value for group dropdown
                                    onChange={(e) => setSelectedGroups(e.value)} // Update selected groups on change
                                    options={groupList} // Options for the dropdown
                                    display="chip" // Display selected values as chips
                                    filter // Enable filtering of options
                                    showClear // Show clear button
                                    variant="filled" // Filled variant for dropdown
                                    placeholder="Select a Group" // Placeholder text
                                    className="w-25rem" // Custom width for dropdown
                                  />
                                  <br />

                                  <div
                                    className="Test1" // Class for additional styling
                                    style={{ display: "inline-flex" }} // Inline flex for dropdowns
                                  >
                                    <Dropdown
                                      id="SelectLogbookForAddLogbookAndAssetDropdown"
                                      value={selectedLogbooks} // Controlled value for logbook dropdown
                                      onChange={(e) =>
                                        setSelectedLogbooks(e.value)
                                      } // Update selected logbooks on change
                                      options={logbookOptions} // Options for the logbook dropdown
                                      disabled={loading} // Disable if loading
                                      display="chip" // Display selected values as chips
                                      filter // Enable filtering of options
                                      showClear // Show clear button
                                      variant="filled" // Filled variant for dropdown
                                      placeholder="Select a Logbook" // Placeholder text
                                      className="w-25rem" // Custom width for dropdown
                                    />
                                    {!loading ? <></> : <CircularProgress />}{" "}
                                    {/* Show loading indicator if loading */}
                                  </div>
                                  <br />

                                  <Button
                                    label="ADD" // Button label
                                    icon="pi pi-plus" // Plus icon
                                    rounded // Rounded button style
                                    size="small" // Small button size
                                    onClick={handleAddAssetLogbookClick} // Click handler for adding asset and logbook
                                  />
                                </div>
                              </PrimeCard>
                              <br />
                              <PrimeCard>
                                <DataTable
                                  removableSort // Allow removing sort functionality
                                  className="UserInfoTableStyle HeaderColor" // Custom styles for table
                                  value={assetLogbookData} // Data for the table
                                  header={header} // Header for the table
                                  globalFilter={globalFilter} // Global filter for the table
                                >
                                  <Column
                                    field="asset" // Field for asset column
                                    header="Asset" // Header for asset column
                                    sortable // Make column sortable
                                  />
                                  <Column
                                    field="logbook" // Field for logbook column
                                    header="Logbook" // Header for logbook column
                                    sortable // Make column sortable
                                  />
                                  <Column
                                    field="groups" // Field for groups column
                                    header="Group" // Header for groups column
                                    sortable // Make column sortable
                                  />
                                  <Column
                                    field="Action" // Field for action column
                                    header="Action" // Header for action column
                                    body={actionTemplate} // Template for action column
                                  />
                                </DataTable>
                              </PrimeCard>
                            </div>
                          </TabPanel>

                          <TabPanel header="Without Asset">
                            {" "}
                            {/* // Tab panel for without asset */}
                            <div>
                              <PrimeCard style={{ boxShadow: "none" }}>
                                {" "}
                                {/* // Card for dropdowns */}
                                <div
                                  style={{
                                    display: "grid", // Grid layout for dropdowns
                                    justifyItems: "center", // Center items in grid
                                    marginTop: "1rem", // Margin on top
                                  }}
                                >
                                  <Dropdown
                                    value={withoutAssetselectedGroups} // Controlled value for group dropdown
                                    onChange={(e) =>
                                      setWithoutAssetSelectedGroups(e.value)
                                    } // Update selected groups on change
                                    options={withoutAssetGroupList} // Options for the dropdown
                                    optionLabel="groupName" // Display property for dropdown options
                                    display="chip" // Display selected values as chips
                                    filter // Enable filtering of options
                                    showClear // Show clear button
                                    variant="filled" // Filled variant for dropdown
                                    placeholder="Select a Group" // Placeholder text
                                    className="w-full md:w-25rem" // Custom width for dropdown
                                  />
                                  <br />

                                  <div
                                    className="Test1" // Class for additional styling
                                    style={{ display: "inline-flex" }} // Inline flex for dropdowns
                                  >
                                    <Dropdown
                                      value={withoutAssetSelectedLogbooks} // Controlled value for logbook dropdown
                                      onChange={(e) =>
                                        setWithoutAssetSelectedLogbooks(e.value)
                                      } // Update selected logbooks on change
                                      options={withoutAssetLogbookOptions} // Options for the logbook dropdown
                                      disabled={loading} // Disable if loading
                                      display="chip" // Display selected values as chips
                                      filter // Enable filtering of options
                                      showClear // Show clear button
                                      variant="filled" // Filled variant for dropdown
                                      placeholder="Select a Logbook" // Placeholder text
                                      className="w-full md:w-25rem" // Custom width for dropdown
                                    />
                                    {!loading ? <></> : <CircularProgress />}{" "}
                                    {/* Show loading indicator if loading */}
                                  </div>
                                  <br />

                                  <Button
                                    label="ADD" // Button label
                                    icon="pi pi-plus" // Plus icon
                                    rounded // Rounded button style
                                    size="small" // Small button size
                                    onClick={
                                      handleWithoutAssetAddAssetLogbookClick
                                    } // Click handler for adding without asset
                                  />
                                  <br />
                                </div>
                              </PrimeCard>
                              {console.log(
                                "My withoutAssetLogbookData In Return : ",
                                withoutAssetLogbookData,
                              )}
                              <DataTable
                                removableSort // Allow removing sort functionality
                                className="UserInfoTableStyle HeaderColor dataTableStyle" // Custom styles for table
                                value={withoutAssetLogbookData} // Data for the table
                                header="Activity Overview" // Header for the table
                                globalFilter={null} // No global filter for this table
                              >
                                <Column
                                  field="groups" // Field for groups column
                                  header="Group" // Header for groups column
                                  sortable // Make column sortable
                                />
                                <Column
                                  field="logbook" // Field for logbook column
                                  header="Logbook" // Header for logbook column
                                  sortable // Make column sortable
                                />
                                <Column
                                  field="Action" // Field for action column
                                  header="Action" // Header for action column
                                  body={withoutAssetActionTemplate} // Template for action column
                                />
                              </DataTable>
                            </div>
                          </TabPanel>
                        </TabView>
                      </PrimeCard>
                    </div>
                  </Dialog>
                  <SnackbarComponent
                    openPopup={snackbarOpen} // Control the visibility of the snackbar
                    setOpenPopup={setSnackbarOpen} // Function to set snackbar open state
                    dialogMessage={snackbarText} // Message to display in the snackbar
                    snackbarSeverity={snackbarSeverity} // Severity level (e.g., success, error) for the snackbar
                  ></SnackbarComponent>
                  <CustomDialog
                    open={delOpen} // Control the visibility of the delete confirmation dialog
                    setOpen={setDelOpen} // Function to set delete dialog open state
                    proceedButtonText={"YES"} // Text for the proceed button
                    proceedButtonClick={deleteGroup} // Function to call on proceeding with deletion
                    cancelButtonText={"NO"} // Text for the cancel button
                  ></CustomDialog>
                  <CustomDialog
                    open={tabChangeOpen} // Control the visibility of the tab change confirmation dialog
                    setOpen={setTabChangeOpen} // Function to set tab change dialog open state
                    proceedButtonText={"YES"} // Text for the proceed button
                    proceedButtonClick={tabchange} // Function to call on proceeding with the tab change
                    cancelButtonText={"NO"} // Text for the cancel button
                  ></CustomDialog>
                </div>
              </Card>
            </div>
          </Container>
        </>
      ) : (
        <>
          <TaskMaster /> {/* Render the TaskMaster component */}
        </>
      )}
    </>
  );
}
