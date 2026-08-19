// Importing Card component from Material-UI for card UI elements
import Card from "@mui/material/Card";
// Importing React hooks for managing component state and side effects
import { useEffect, useState } from "react";
// Importing Column component from PrimeReact for table column representation
import { Column } from "primereact/column";
// Importing Tag component from PrimeReact for displaying tags
import { Tag } from "primereact/tag";
// Importing Ripple effect for UI elements from PrimeReact
import { Ripple } from "primereact/ripple";
// Importing Button component from PrimeReact for button UI elements
import { Button } from "primereact/button";
import { Button as MUIButton } from "@mui/material";
// Importing AddIcon from Material-UI for add button icon
import AddIcon from "@mui/icons-material/Add";
// Importing InfoOutlinedIcon from Material-UI for info icon
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
// Importing NoteAddIcon from Material-UI for note add icon
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import GroupsIcon from "@mui/icons-material/Groups";
// Importing AppBar component from Material-UI for top app bar
import {
  AppBar,
  // Importing Avatar component from Material-UI for user profile image
  Avatar,
  // Importing Badge component from Material-UI for displaying notifications
  Badge,
  // Importing BottomNavigation component from Material-UI for bottom navigation bar
  BottomNavigation,
  // Importing BottomNavigationAction component from Material-UI for actions in bottom navigation
  BottomNavigationAction,
  CardContent,
  // Importing Chip component from Material-UI for displaying small pieces of information
  Chip,
  CircularProgress,
  // Importing Container component from Material-UI for responsive layout
  Container,
  // Importing Divider component from Material-UI for visual separation
  Divider,
  // Importing Fab (Floating Action Button) component from Material-UI for floating action buttons
  Fab,
  // Importing Grid component from Material-UI for responsive grid layout
  Grid,
  // Importing Tooltip component from Material-UI for tooltips
  Tooltip,
  // Importing Typography component from Material-UI for text styles
  Typography,
  // Importing useMediaQuery hook from Material-UI for responsive design
  useMediaQuery,
  // Importing useTheme hook from Material-UI to access theme
  useTheme,
} from "@mui/material";
// Importing Gauge component and its classes from X-Charts for creating gauge charts
import { Gauge, gaugeClasses } from "@mui/x-charts";
// Importing PrimeFlex CSS for responsive utility classes
import "primeflex/primeflex.css";
// Importing PrimeIcons CSS for using PrimeReact icons
import "primeicons/primeicons.css";
// Importing DataTable component from PrimeReact for displaying data in table format
import { DataTable } from "primereact/datatable";
// Importing InputText component from PrimeReact for text input fields
import { InputText } from "primereact/inputtext";
// Importing ProgressBar component from PrimeReact for displaying progress bars
import { ProgressBar } from "primereact/progressbar";
// Importing PrimeReact core CSS for styling components
import "primereact/resources/primereact.min.css";
// Importing theme CSS for PrimeReact components
import "primereact/resources/themes/saga-blue/theme.css";
// Importing useLocation and useNavigate hooks from React Router for navigation
import { useLocation, useNavigate } from "react-router-dom";
// Importing API function to fetch allotted pages based on user ID
import { fetchAllotedPagesByUserId } from "../CommonAPI";
// Importing CustomDialog component for displaying dialogs
import CustomDialog from "../components/shared/dialog/dialog.component";
// Importing SnackbarComponent for displaying snack bar notifications
import SnackbarComponent from "../components/shared/snackbar/customSnackbar";
// Importing functions for token management from AuthService helper
import { decryptTokenId, extendTokenExpiration } from "../helper/AuthService";
// Importing API functions related to task management
import {
  CheckTaskIdExists,
  deleteATask,
  getActivityConnections,
  getAllTaskByTenantId,
} from "./TaskAPI";
// Importing TaskCreation component for creating tasks
import TaskCreation from "./TaskCreation";
import { ScrollTop } from "primereact/scrolltop";
//MUI Icons
import LayersIcon from '@mui/icons-material/Layers';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ArticleIcon from '@mui/icons-material/Article';
import CancelIcon from '@mui/icons-material/Cancel';
import { BorderLeft, Layers } from "@mui/icons-material";

// Exporting TaskMaster component as the default export
export default function TaskMaster() {
  // State to store all tasks fetched from the API
  const [allTasks, setAllTasks] = useState([]);
  // State to store tasks that are published
  const [publishedTasks, setAllPublishedTasks] = useState([]);
  // State to store tasks that are pending
  const [pendingTasks, setPendingTasks] = useState([]);
  // State to store draft tasks
  const [draftTasks, setDraftTasks] = useState([]);
  // State to store tasks that have been rejected
  const [rejectedTasks, setRejectedTasks] = useState([]);
  // State to store miscellaneous values (could be for form inputs or other data)
  const [values, setValues] = useState([]);
  // State to store the selected task for viewing or editing
  const [selectedTask, setSelectedTask] = useState({});
  // State to manage styles for rejected task cards
  const [rejectedCardStyle, setRejectedCardStyle] = useState({});
  // State to manage styles for all task cards
  const [allCardStyle, setAllCardStyle] = useState({});
  // State to manage styles for published task cards
  const [publishCardStyle, setPublishCardStyle] = useState({});
  // State to manage styles for pending task cards
  const [pendingCardStyle, setPendingCardStyle] = useState({});
  // State to manage styles for draft tasks
  const [draftStyle, setDraftStyle] = useState({});
  // State to store all asset groups fetched from the API
  const [allAssetGroups, setAllAssetGroups] = useState([]);
  // State to store activity connections related to tasks
  const [activityConnections, setActivityConnections] = useState([]);
  // State to store the ID of the current task being processed
  const [taskId, setTaskId] = useState("");
  // State to store the task that is to be deleted
  const [taskForDelete, setTaskForDelete] = useState(null);
  // State to manage loading state for data fetching
  const [dataLoading, setDataLoading] = useState(false);
  // State to control visibility of the task creation dialog
  const [showCreation, setShowCreation] = useState(false);
  // State to store details of the current task being viewed or edited
  const [taskDetails, setTaskDetails] = useState(null);
  // State to manage global filter for the task list
  const [globalFilter, setGlobalFilter] = useState(null);
  // State to manage the text for the snackbar notification
  const [snackbarText, setSnackbarText] = useState("Data saved !");
  // State to manage the severity level of the snackbar notification
  const [snackbarSeverity, setsnackbarSeverity] = useState("success");
  // State to control the open/close state of the snackbar notification
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  // State to control the open/close state of the delete confirmation dialog
  const [delOpen, setDelOpen] = useState(false);
  // Getting the current path name from the React Router
  const currentPathName = useLocation().pathname;
  // Getting the theme object for styling from Material-UI
  const theme = useTheme();
  // Checking if the screen size is mobile based on theme breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Function to retrieve the tenant ID from session storage and decrypt it
  const getTenantID = () => {
    // Getting the tenant ID from environment variables
    const env_tenant = process.env.REACT_APP_TENANTID;
    // Retrieving the encrypted tenant ID from session storage
    const encryptedTenant = localStorage.getItem(env_tenant);
    // Decrypting the tenant ID
    const tenant = decryptTokenId(encryptedTenant);

    return tenant; // Returning the decrypted tenant ID
  };

  // useEffect hook to manage the "beforeunload" event for the window
  useEffect(() => {
    // Event handler for before unloading the page
    const handleBeforeUnload = (event) => {
      const confirmationMessage = "Are you sure you want to leave?"; // Message to display on page unload

      event.returnValue = confirmationMessage; // Setting the return value for the event
      return confirmationMessage; // Returning the confirmation message
    };

    // Adding the beforeunload event listener to the window
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup function to remove the event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []); // Empty dependency array to run once on mount

  // useEffect hook to fetch allotted pages for the user on component mount
  useEffect(() => {
    fetchAllotedPages(); // Calling the function to fetch allotted pages
  }, []); // Empty dependency array to run once on mount

  // Function to fetch the pages allotted to the user based on their ID
  const fetchAllotedPages = async () => {
    await extendTokenExpiration(); // Extending the token expiration
    const allotedPages = await fetchAllotedPagesByUserId(); // Fetching allotted pages for the user
    // If the current path is not in allotted pages, navigate to the restricted page
    if (!allotedPages?.includes(currentPathName)) navigate("/restricted");
  };

  // useEffect hook to fetch all tasks when the component mounts
  useEffect(() => {
    const fetchAllTasks = async () => {
      // Function to fetch all tasks by tenant ID
      setDataLoading(true);
      const data = await getAllTaskByTenantId(); // Fetching tasks from the API

      setAllTasks(data); // Setting the fetched tasks to state
      setValues(data); // Setting the fetched tasks to values state
      setDataLoading(false); // Indicating that data loading is complete
    };
    fetchAllTasks(); // Calling the function to fetch all tasks
  }, []); // Empty dependency array to run once on mount

  console.log('datatable_loader',dataLoading);
  // useEffect hook to update task states based on the fetched tasks
  useEffect(() => {
    // If allTasks is null or undefined, reset to an empty array
    if (!allTasks) {
      setAllTasks([]);
    }

    // If allTasks is not null, filter tasks by their status
    if (allTasks !== null) {
      const published = allTasks?.filter((task) => task.status === "Published"); // Filtering published tasks

      setAllPublishedTasks(published); // Setting published tasks to state
      setPendingTasks(allTasks?.filter((task) => task.status === "Pending")); // Filtering pending tasks
      setDraftTasks(allTasks?.filter((task) => task.status === "Not Ready")); // Filtering draft tasks
      setRejectedTasks(allTasks?.filter((task) => task.status === "Rejected")); // Filtering rejected tasks
    }
  }, [allTasks]); // Dependency on allTasks to trigger when it changes

  // useEffect hook to fetch all asset groups when the component mounts
  useEffect(() => {
    // Defining options for the fetch request including headers
    const options = {
      method: "GET", // Method for the fetch request
      headers: {
        "Content-Type": "application/json", // Setting content type for the request
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Including token for authorization
      },
    };

    // Function to fetch all asset groups by tenant ID
    const fetchAllAssetGroups = async () => {
      const tenantId = getTenantID(); // Getting the tenant ID
      await fetch(
        `${process.env.REACT_APP_ASSETAPI}/api/assetgroups/${tenantId}`, // Fetching asset groups by tenant ID
        options // Including request options
      )
        .then((resp) => resp.json()) // Converting response to JSON
        .then((data) => {
          setAllAssetGroups(data); // Setting the fetched asset groups to state
        });
    };

    fetchAllAssetGroups(); // Calling the function to fetch asset groups
  }, []); // Empty dependency array to run once on mount

  // useEffect hook to set styles for different task cards
  useEffect(() => {
    // Setting styles for all task cards
    setAllCardStyle({
      height: 93, // Height of the card
      width: isMobile ? "100%" : "33%", // Width based on mobile view
      color: "black", // Text color
      borderLeft:'6px solid #00838f',
      borderRadius:'0.5rem'
    });

    // Setting styles for published task cards
    setPublishCardStyle({
      height: 93, // Height of the card
      width: isMobile ? "100%" : "33%", // Width based on mobile view
      margin: '0 0 0  20px',  // Margin around the card
      color: "black", // Text color
      borderLeft:'6px solid white',
      borderRadius:'0.5rem'
    });

    // Setting styles for pending task cards
    setPendingCardStyle({
      height: 93, // Height of the card
      width: isMobile ? "100%" : "33%", // Width based on mobile view
      margin: '0 0 0  20px', // Margin around the card
      color: "black", // Text color
       //borderLeft:'6px solid #00838f',
      borderRadius:'0.5rem'
    });

    // Setting styles for draft task cards
    setDraftStyle({
      height: 93, // Height of the card
      width: isMobile ? "100%" : "33%", // Width based on mobile view
        margin: '0 0 0  20px', // Margin around the card
  
      color: "black", // Text color
       //borderLeft:'6px solid #00838f',
      borderRadius:'0.5rem'
    });

    // Setting styles for rejected task cards
    setRejectedCardStyle({
      height: 93, // Height of the card
      width: isMobile ? "100%" : "33%", // Width based on mobile view
      margin: '0 0 0  20px', // Margin around the card
  
      color: "black", // Text color
       //borderLeft:'6px solid #00838f',
      borderRadius:'0.5rem'
    });
  }, [allTasks]); // Dependency on allTasks to trigger when it changes

  // Function to handle click on "All Tasks" button
  const allTaskClickHandler = () => {
    setValues(allTasks); // Setting the values state to all tasks

    // Updating styles for all tasks card
    setAllCardStyle({
      ...allCardStyle, // Retaining existing styles
      backgroundColor: "white", // Changing background color
      color: "black", // Changing text color
      borderLeft:'6px solid #00838f',
    });

    // Updating styles for published tasks card
    setPublishCardStyle({
      ...publishCardStyle, // Retaining existing styles
      backgroundColor: "white", // Changing background color
      color: "black", // Changing text color
      borderLeft:'6px solid white',
    });

    // Updating styles for pending tasks card
    setPendingCardStyle({
      ...pendingCardStyle, // Retaining existing styles
      backgroundColor: "white", // Changing background color
      color: "black", // Changing text color
      borderLeft:'6px solid white',
    });

    // Updating styles for draft tasks card
    setDraftStyle({
      ...draftStyle, // Retaining existing styles
      backgroundColor: "white", // Changing background color
      color: "black", // Changing text color
      borderLeft:'6px solid white',
    });

    // Updating styles for rejected tasks card
    setRejectedCardStyle({
      ...rejectedCardStyle, // Retaining existing styles
      backgroundColor: "white", // Changing background color
      color: "black", // Changing text color
      borderLeft:'6px solid white',
    });
  };

  // Function to handle click on "Published Tasks" button
  const allPublishedClickHandler = () => {
    setValues(publishedTasks); // Setting the values state to published tasks

    // Updating styles for all tasks card
    setAllCardStyle({
      ...allCardStyle, // Retaining existing styles
      backgroundColor: "white", // Changing background color
      color: "black", // Changing text color
      borderLeft:'6px solid white',
    });

    // Updating styles for published tasks card
    setPublishCardStyle({
      ...publishCardStyle, // Retaining existing styles
      backgroundColor: "white", // Changing background color
      color: "black", // Changing text color
      borderLeft:'6px solid #26a03a',
    });

    // Updating styles for pending tasks card
    setPendingCardStyle({
      ...pendingCardStyle, // Retaining existing styles
      backgroundColor: "white", // Changing background color
      color: "black", // Changing text color
      borderLeft:'6px solid white',
    });

    // Updating styles for draft tasks card
    setDraftStyle({
      ...draftStyle, // Retaining existing styles
     backgroundColor: "white", // Changing background color
      color: "black", // Changing text color
      borderLeft:'6px solid white',
    });

    // Updating styles for rejected tasks card
    setRejectedCardStyle({
      ...rejectedCardStyle, // Retaining existing styles
      backgroundColor: "white", // Changing background color
      color: "black", // Changing text color
      borderLeft:'6px solid white',
    });
  };

  // Function to handle click on "Pending Tasks" button
  const allPendingClickHandler = () => {
    setValues(pendingTasks); // Setting the values state to pending tasks

    // Updating styles for all tasks card
    setAllCardStyle({
      ...allCardStyle, // Retaining existing styles
      backgroundColor: "white", // Changing background color
      color: "black", // Changing text color
      borderLeft:'6px solid white',
    });

    // Updating styles for published tasks card
    setPublishCardStyle({
      ...publishCardStyle, // Retaining existing styles
      backgroundColor: "white", // Changing background color
      color: "black", // Changing text color
      borderLeft:'6px solid white',
    });

    // Updating styles for pending tasks card
    setPendingCardStyle({
      ...pendingCardStyle, // Retaining existing styles
      backgroundColor: "white", // Changing background color
      color: "black", // Changing text color
      borderLeft:'6px solid #fa941c',
    });

    // Updating styles for draft tasks card
    setDraftStyle({
      ...draftStyle, // Retaining existing styles
      backgroundColor: "white", // Changing background color
      color: "black", // Changing text color
      borderLeft:'6px solid white',
    });

    // Updating styles for rejected tasks card
    setRejectedCardStyle({
      ...rejectedCardStyle, // Retaining existing styles
     backgroundColor: "white", // Changing background color
      color: "black", // Changing text color
      borderLeft:'6px solid white',
    });
  };

  // Function to handle click on "Draft Tasks" button
  const allDraftClickHandler = () => {
    setValues(draftTasks); // Setting the values state to draft tasks

    // Updating styles for all tasks card
    setAllCardStyle({
      ...allCardStyle, // Retaining existing styles
      backgroundColor: "white", // Changing background color
      color: "black", // Changing text color
      borderLeft:'6px solid white',
    });

    // Updating styles for published tasks card
    setPublishCardStyle({
      ...publishCardStyle, // Retaining existing styles
     backgroundColor: "white", // Changing background color
      color: "black", // Changing text color
      borderLeft:'6px solid white',
    });

    // Updating styles for pending tasks card
    setPendingCardStyle({
      ...pendingCardStyle, // Retaining existing styles
      backgroundColor: "white", // Changing background color
      color: "black", // Changing text color
      borderLeft:'6px solid white',
    });

    // Updating styles for draft tasks card
    setDraftStyle({
      ...draftStyle, // Retaining existing styles
      backgroundColor: "white", // Changing background color
      color: "black", // Changing text color
      borderLeft:'6px solid #7e8da2',
    });

    // Updating styles for rejected tasks card
    setRejectedCardStyle({
      ...rejectedCardStyle, // Retaining existing styles
      backgroundColor: "white", // Changing background color
      color: "black", // Changing text color
      borderLeft:'6px solid white',
    });
  };

  // Function to handle click on "Rejected Tasks" button
  const allrejectedClickHandler = () => {
    setValues(rejectedTasks); // Setting the values state to rejected tasks

    // Updating styles for all tasks card
    setAllCardStyle({
      ...allCardStyle, // Retaining existing styles
      backgroundColor: "white", // Changing background color
      color: "black", // Changing text color
      borderLeft:'6px solid white',
    });

    // Updating styles for published tasks card
    setPublishCardStyle({
      ...publishCardStyle, // Retaining existing styles
      backgroundColor: "white", // Changing background color
      color: "black", // Changing text color
      borderLeft:'6px solid white',
    });

    // Updating styles for pending tasks card
    setPendingCardStyle({
      ...pendingCardStyle, // Retaining existing styles
     backgroundColor: "white", // Changing background color
      color: "black", // Changing text color
      borderLeft:'6px solid white',
    });

    // Updating styles for draft tasks card
    setDraftStyle({
      ...draftStyle, // Retaining existing styles
     backgroundColor: "white", // Changing background color
      color: "black", // Changing text color
      borderLeft:'6px solid white',
    });

    // Updating styles for rejected tasks card
    setRejectedCardStyle({
      ...rejectedCardStyle, // Retaining existing styles
      backgroundColor: "white", // Changing background color
      color: "black", // Changing text color
      borderLeft:'6px solid #ec374c',
    });
  };

  // Function to render the status badge for a task
  const renderSatus = (rowData) => {
    const allUserStatus = rowData.status; // Extracting the status from rowData

    return (
      <>
        {/* Conditional rendering based on the presence of remarks */}
        {rowData?.remarks ? (
          <Badge
            badgeContent={
              // Badge to show remarks as a tooltip
              <Tooltip title={`Remarks : ${rowData?.remarks}`} placement="top">
                <InfoOutlinedIcon className="iconStyle" />{" "}
                {/* Icon to indicate */}
                {/* remarks */}
              </Tooltip>
            }
          >
            <Tag
              rounded // Styling for rounded tag
              style={{ fontWeight: "600", fontSize: "0.72rem" }} // Custom styles for tag
              value={allUserStatus} // Setting the tag value to the user status
              severity={
                // Conditional severity based on the task status
                allUserStatus === "Published"
                  ? "success"
                  : allUserStatus === "Pending"
                  ? "info"
                  : allUserStatus === "Not Ready" ||
                    allUserStatus === "Rejected"
                  ? "danger"
                  : ""
              }
            ></Tag>
          </Badge>
        ) : (
          // If there are no remarks, render only the tag
          <Tag
            rounded // Styling for rounded tag
            style={{ fontWeight: "600", fontSize: "0.72rem" }} // Custom styles for tag
            value={allUserStatus} // Setting the tag value to the user status
            severity={
              // Conditional severity based on the task status
              allUserStatus === "Published"
                ? "success"
                : allUserStatus === "Pending"
                ? "info"
                : allUserStatus === "Not Ready" || allUserStatus === "Rejected"
                ? "danger"
                : ""
            }
          ></Tag>
        )}
      </>
    );
  };

  // Function to render the task name with an optional description
  const taskNameTemplate = (rowData) => {
    return (
      <>
        {/* Conditional rendering based on the presence of a description */}
        {rowData?.description ? (
          <Badge
            badgeContent={
              // Badge to show description as a tooltip
              <Tooltip title={rowData.description} placement="top">
                <InfoOutlinedIcon className="iconStyle" />{" "}
                {/* Icon to indicate  description*/}
              </Tooltip>
            }
          >
            <Tooltip title={rowData.taskId} placement="top">
              {" "}
              {/* Tooltip for taskId */}
              <Typography sx={{ fontWeight: "600", fontSize: "0.9rem" }}>
                {" "}
                {/* Styling for task name */}
                {rowData.taskName} {/* Displaying the task name */}
              </Typography>
            </Tooltip>
          </Badge>
        ) : (
          // If there is no description, render only the task name
          <Tooltip title={rowData.taskId} placement="top">
            {" "}
            {/* Tooltip for taskId */}
            <Typography sx={{ fontWeight: "600", fontSize: "0.9rem" }}>
              {" "}
              {/* Styling for task name */}
              {rowData.taskName} {/* Displaying the task name */}
            </Typography>
          </Tooltip>
        )}
      </>
    );
  };

  // Function to render creator information including avatar and creation time
  const cretetorInfo = (rowData) => {
    const creatorName = rowData.creator; // Extracting creator name from rowData
    if (creatorName === "" || creatorName === null) {
      return ""; // Returning empty if creator name is not available
    }

    const creationTime = rowData.creationTime; // Extracting creation time from rowData

    return (
      <>
        <div
          style={{
            display: "flex", // Using flexbox for layout
            columnGap: "1rem", // Adding gap between items
            alignItems: "center", // Aligning items vertically centered
            justifyContent: "center", // Centering items horizontally
          }}
        >
          <></>
          <div
            style={{
              display: "grid", // Using grid layout for inner content
              justifyItems: "center", // Centering items in the grid
              padding: "0.2rem", // Adding padding around the content
            }}
          >
            <Badge
              badgeContent={
                // Badge to show creation time as a tooltip
                <Tooltip title={creationTime} placement="top">
                  <InfoOutlinedIcon className="iconStyle" sx={{fontSize:"0.5rem"}}/>{" "}
                  {/* Icon to indicate creation time */}
                </Tooltip>
              }
            >
              <Tooltip title={creatorName} placement="top">
                {" "}
                {/* Tooltip for creator name */}
                <Avatar
                  style={{
                    backgroundColor: "#D1EFFF", // Avatar background color
                       // background-color: #65d6ad1a;
                    color: "#206BD8",
                    // border: "1px solid rgb(101, 214, 173)",
                    //color: "#ffffff", // Avatar text color
                    width: 32, // Avatar width
                    height: 32, // Avatar height
                    fontSize: "0.9rem", // Avatar font size
                  }}
                  shape="circle" // Making avatar circular
                >
                  {getInitials(creatorName)}{" "}
                  {/*Function to get initials from creatorName */}
                </Avatar>
              </Tooltip>
            </Badge>
          </div>
        </div>
      </>
    );
  };

  // Function to render reviewer information including avatar
  const reviewerInfo = (rowData) => {
    const creatorName = rowData.reviewer; // Extracting reviewer name from rowData
    if (creatorName === "" || creatorName === null) {
      return ""; // Returning empty if reviewer name is not available
    }

    return (
      <>
        <div
          style={{
            display: "flex", // Using flexbox for layout
            columnGap: "1rem", // Adding gap between items
            alignItems: "center", // Aligning items vertically centered
            justifyContent: "center", // Centering items horizontally
          }}
        >
          <></>
          <div
            style={{
              display: "grid", // Using grid layout for inner content
              justifyItems: "center", // Centering items in the grid
              padding: "0.2rem", // Adding padding around the content
            }}
          >
            <Tooltip title={creatorName} placement="top">
              {" "}
              {/* Tooltip for reviewer name */}
              <Avatar
                style={{
                    backgroundColor: "#FFF5F5", // Avatar background color
                       // background-color: #65d6ad1a;
                    color: "#CF1124",
                    // border: "1px solid rgb(101, 214, 173)",
                    //color: "#ffffff", // Avatar text color
                    width: 32, // Avatar width
                    height: 32, // Avatar height
                    fontSize: "0.9rem", // Avatar font size
                  }}
                shape="circle" // Making avatar circular
              >
                {getInitials(creatorName)}{" "}
                {/* Function to get initials from reviewer name */}
              </Avatar>
            </Tooltip>
          </div>
        </div>
      </>
    );
  };

  // Hook to navigate between pages
  const navigate = useNavigate();

  // Function to handle row click event
  const onRowClickHandler = (event) => {
    console.log("onRowClickHandlerDesktop",event);
    setSelectedTask(event.data); // Setting the selected task data
    setTaskDetails(event.data); // Setting the task details
    setShowCreation(true); // Triggering the display of the creation form

    setTaskId(event.data.taskId); // Setting the task ID from the clicked row data
  };

  // Effect to fetch all activity connections based on the selected task
  useEffect(() => {
    const fetchAllActivityConnections = (taskId) => {
      // Function to fetch activity connections for a given taskId
      if (selectedTask && selectedTask.taskId) {
        // Check if a selected task exists and has a valid taskId
        const data = getActivityConnections(selectedTask.taskId); // Fetch activity connections using taskId
        setActivityConnections(data); // Update state with fetched activity connections
        setTaskId(selectedTask ? selectedTask.taskId : ""); // Set taskId from selected task
      }
    };

    fetchAllActivityConnections(); // Call the function to fetch activity connections
  }, [selectedTask]); // Dependency on selectedTask

  // ActionButton component to handle actions on each row of the table
  const ActionButton = ({ rowData }) => {
    const [isAssetAssociated, setIsAssetAssociated] = useState(true); // State to track if an asset is associated

    useEffect(() => {
      // Effect to fetch data when rowData's taskId changes
      const fetchData = async () => {
        const result = await CheckTaskIdExists(rowData?.taskId); // Check if taskId exists

        setIsAssetAssociated(
          // Set isAssetAssociated based on the result or task status
          result ||
            rowData?.status === "Published" ||
            rowData?.status === "Pending"
        );
      };

      fetchData(); // Call the fetchData function
    }, [rowData?.taskId]); // Dependency on rowData's taskId

    if (isAssetAssociated === null) {
      // Check if isAssetAssociated is null
      return null; // Return null if the value is null
    }

    // Return delete button if asset is not associated
    return !isAssetAssociated ? (
      <Button
        icon="pi pi-trash" // Trash icon for delete action
        className="p-button-danger disabledFocus" // Danger button styling
        rounded
        text
        raised={isMobile ? false : true}
        size="small"
         style={{
          width: "1.4rem",
          height: "2.2rem",
          boxShadow: "none",
          border: "1px solid #e9bfb4ff",
        }}
        label={isMobile ? "Delete" : ""}
        onClick={() => {
          // Handle click to set task for deletion
          setTaskForDelete(rowData); // Set the task to be deleted
          setDelOpen(true); // Open delete confirmation dialog
        }}
      />
    ) : (
      // Return view button if asset is associated
      <Button
        icon="pi pi-eye" // Eye icon for view action
        className="p-button-info disabledFocus" // Info button styling
        rounded
        text
        raised={isMobile ? false : true}
        size="small"
        label={isMobile ? "View" : ""}
        style={{
          width: "1.4rem",
          height: "2.2rem",
          boxShadow: "none",
          border: "1px solid #b4c5e9",
        }}
        onClick={() => {
          // Handle click to view task details
          console.log("ActionButton eye");
          setSelectedTask(rowData); // Set the selected task
          setTaskDetails(rowData); // Set task details for display
          setShowCreation(true); // Trigger display of creation form

          setTaskId(rowData.taskId); // Set taskId from rowData
        }}
      />
    );
  };

  // Function to get initials from an email address
  const getInitials = (email) => {
    if (!email) {
      // Check if email is not provided
      return "NA"; // Return 'NA' if no email
    }
    const namePart = email?.split("@")[0]; // Get the part of email before '@'
    const nameParts = namePart?.split("."); // Split the name part by '.'
    const initials = nameParts
      .map((part) => part.charAt(0).toUpperCase()) // Get the first character of each part and convert to uppercase
      .join(""); // Join the initials together
    return initials; // Return the initials
  };

  // Function to render the header for the tasks table
  const renderHeader = () => {
    return (
      <div
        className="table-header" // Header styling
        style={{
          display: isMobile ? "grid" : "flex ", // Grid layout for mobile, flex for desktop
          justifyContent: "space-between", // Space out items in header
          alignItems: "center", // Center items vertically
          margin: "0rem 0.8rem", // Margin around the header
        }}
      >
        <h4 className="mx-0 my-1">Manage Tasks</h4> {/* Title for the header */}
        <span className="p-input-icon-right">
          {" "}
          {/* Container for search input */}
          <i className="pi pi-search" /> {/* Search icon */}
          <InputText
            type="search" // Input type as search
            className="p-inputtext-sm" // Styling for input
            onInput={(e) => setGlobalFilter(e.target.value)} // Update global filter on input
            placeholder="Keyword Search" // Placeholder text for input
          />
        </span>
      </div>
    );
  };

  // Function to format duration from total minutes into a readable string
  function formatDuration(rowData) {
    const minutes = rowData.hourMinutes; // Get total minutes from rowData
    const days = Math.floor(minutes / 1440); // Calculate total days
    const hours = Math.floor((minutes % 1440) / 60); // Calculate remaining hours after extracting days
    const mins = minutes % 60; // Calculate remaining minutes after extracting hours

    // Return formatted duration string, including days, hours, and minutes
    return `${days > 0 ? `${days}d ` : ""}${
      hours > 0 ? `${hours}h ` : ""
    }${mins}m`;
  }

  // Function to delete a task
  const deleteTask = async () => {
    const success = await deleteATask(taskForDelete); // Attempt to delete the specified task

    if (success?.status === 200 || success?.status === 201) {
      // Check for successful deletion
      setAllTasks(
        // Update allTasks state to remove deleted task
        allTasks.filter((task) => task.taskId !== taskForDelete?.taskId)
      );
      setValues(values.filter((task) => task.taskId !== taskForDelete?.taskId)); // Update values state similarly
      setDelOpen(false); // Close the delete confirmation dialog
      setsnackbarSeverity(); // Set snackbar severity for success (default behavior)
      setSnackbarText("Task Deleted Successfully"); // Set success message
      setSnackbarOpen(true); // Open snackbar to display success message
    } else {
      // Handle failure case
      setsnackbarSeverity("error"); // Set snackbar severity to error
      setSnackbarText("Failed To Delete"); // Set error message
      setSnackbarOpen(true); // Open snackbar to display error message
    }
  };

  const header = renderHeader(); // Call renderHeader function to get the table header

  // Main render function for the component
  return (
    <>
      {!showCreation ? ( // Check if task creation form is not being shown
        <>
          <Container
            maxWidth="lg" // Set maximum width for the container
            sx={{
              padding: "0 !important", // Remove default padding
              //background: "white", // Set background color to white
              // boxShadow: 2, // Apply shadow for elevation
              borderRadius: 2, // Round corners of the container
            }}
          >
            <span
              style={{
                display: "flex", // Use flexbox for layout
                justifyContent: "center", // Center content horizontally
                textAlign: "center", // Center text
                position: "static", // Static position for the container
                flexWrap: isMobile || isTablet ? "wrap" : "", // Wrap content if on mobile
              }}
            >
              {/* Card for All Tasks */}
              <Card
                className="card1 p-ripple shadow-1" // Apply class for styles and ripple effect
                style={allCardStyle} // Apply custom card styles
                onClick={allTaskClickHandler} // Handle click to view all tasks
              >
                <Grid
                  container
                  direction="row"
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  {/* <Grid
                  sx={{ background: "white" }} // Set background to white
                  container
                  direction="row" // Set direction to row for layout
                  justifyContent="center" // Center content horizontally
                  alignItems="center" // Center content vertically
                  xs={12}
                >
                  <Gauge // Display gauge for the number of all tasks
                    width={70}
                    height={70}
                    sx={(theme) => ({
                      [`& .${gaugeClasses.valueArc}`]: {
                        fill: "#807c7cff", // Set color for the gauge arc
                      },
                    })}
                    value={allTasks ? allTasks.length : 0} // Set current value to number of all tasks
                    valueMax={allTasks ? allTasks.length : 0} // Set max value to number of all tasks
                  />
                </Grid> */}
                  <Grid
                    item
                    xs={5}
                    container
                    direction="row"
                    sx={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Layers
                      style={{
                        padding: "0.5rem",
                        background: " #00838f",
                        color: "white",
                        fontSize: " 2.8rem",
                        borderRadius: "0.8rem",
                      }}
                    />
                  </Grid>
                  <Grid item xs={7}>
                    <Grid container xs={12}>
                      <Typography
                        sx={{
                          fontSize: "1.5rem",
                          color: "#0f172a",
                          fontWeight: 700,
                        }}
                      >
                        {allTasks ? allTasks.length : 0}
                      </Typography>
                    </Grid>
                    <Grid container xs={12}>
                      All Tasks{" "}
                    </Grid>
                  </Grid>
                </Grid>
                <Ripple
                  pt={{
                    root: { style: { background: "rgba(75, 175, 80, 0.3)" } },
                  }}
                />{" "}
                {/*  Add ripple effect */}
              </Card>

              {/* Card for Published Tasks */}
              <Card
               className="card2 p-ripple shadow-1" // Apply class for styles and ripple effect
                style={publishCardStyle} // Apply custom card styles
                onClick={allPublishedClickHandler} // Handle click to view published tasks
              >
                <Grid
                  container
                  direction="row"
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                
                  <Grid
                    item
                    xs={5}
                    container
                    direction="row"
                    sx={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CheckCircleIcon
                      style={{
                        padding: "0.5rem",
                        background: "linear-gradient(to bottom right, #10b981, #0d9488)",
                        color: "white",
                        fontSize: " 2.8rem",
                        borderRadius: "0.8rem",
                      }}
                    />
                  </Grid>
                  <Grid item xs={7}>
                    <Grid container xs={12}>
                      <Typography
                        sx={{
                          fontSize: "1.5rem",
                          color: "#0f172a",
                          fontWeight: 700,
                        }}
                      >
                       {publishedTasks ? publishedTasks.length : 0}
                      </Typography>
                    </Grid>
                    <Grid container xs={12}>
                     Published 
                    </Grid>
                  </Grid>
                </Grid>
                <Ripple
                  pt={{
                    root: { style: { background: "rgba(75, 175, 80, 0.3)" } },
                  }}
                />{" "}
                {/*  Add ripple effect */}
              </Card>
              {/* Card for Pending Tasks */}
              <Card
                className="card3 p-ripple shadow-1" // Apply class for styles and ripple effect
                style={pendingCardStyle} // Apply custom card styles
                onClick={allPendingClickHandler} // Handle click to view pending tasks
              >
               <Grid
                  container
                  direction="row"
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                
                  <Grid
                    item
                    xs={5}
                    container
                    direction="row"
                    sx={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ScheduleIcon
                      className="bg-gradient-to-br from-amber-400 to-orange-500"
                      style={{
                        padding: "0.5rem",
                        background: "linear-gradient(to bottom right, #fbbf24, #f97316)",
                        color: "white",
                        fontSize: " 2.8rem",
                        borderRadius: "0.8rem",
                      }}
                    />
                  </Grid>
                  <Grid item xs={7}>
                    <Grid container xs={12}>
                      <Typography
                        sx={{
                          fontSize: "1.5rem",
                          color: "#0f172a",
                          fontWeight: 700,
                        }}
                      >
                       {pendingTasks ? pendingTasks.length : 0}
                      </Typography>
                    </Grid>
                    <Grid container xs={12}>
                     Pending 
                    </Grid>
                  </Grid>
                </Grid>
              </Card>

              {/* Card for Draft Tasks */}
              <Card
                className="card4 p-ripple shadow-1" // Apply class for styles and ripple effect
                style={draftStyle} // Apply custom card styles
                onClick={allDraftClickHandler} // Handle click to view draft tasks
              >
               

                <Grid
                  container
                  direction="row"
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                
                  <Grid
                    item
                    xs={5}
                    container
                    direction="row"
                    sx={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ArticleIcon
                      style={{
                        padding: "0.5rem",
                        background: "linear-gradient(to bottom right, #94a3b8, #475569)",
                        color: "white",
                        fontSize: " 2.8rem",
                        borderRadius: "0.8rem",
                      }}
                    />
                  </Grid>
                  <Grid item xs={7}>
                    <Grid container xs={12}>
                      <Typography
                        sx={{
                          fontSize: "1.5rem",
                          color: "#0f172a",
                          fontWeight: 700,
                        }}
                      >
                       {draftTasks ? draftTasks.length : 0}
                      </Typography>
                    </Grid>
                    <Grid container xs={12}>
                     Draft 
                    </Grid>
                  </Grid>
                </Grid>
              </Card>

              {/* Card for Rejected Tasks */}
              <Card
                className="card5 p-ripple shadow-1" // Apply class for styles and ripple effect
                style={rejectedCardStyle} // Apply custom card styles
                onClick={allrejectedClickHandler} // Handle click to view rejected tasks
              >
               
                <Grid
                  container
                  direction="row"
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                
                  <Grid
                    item
                    xs={5}
                    container
                    direction="row"
                    sx={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CancelIcon
                      style={{
                        padding: "0.5rem",
                        background: "linear-gradient(to bottom right, #f43f5e, #dc2626)",
                        color: "white",
                        fontSize: " 2.8rem",
                        borderRadius: "0.8rem",
                      }}
                    />
                  </Grid>
                  <Grid item xs={7}>
                    <Grid container xs={12}>
                      <Typography
                        sx={{
                          fontSize: "1.5rem",
                          color: "#0f172a",
                          fontWeight: 700,
                        }}
                      >
                       {rejectedTasks ? rejectedTasks.length : 0}
                      </Typography>
                    </Grid>
                    <Grid container xs={12}>
                     Rejected 
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            </span>
           <br/>

            {/* DataTable for displaying tasks */}
            {isMobile || (
              <div>
                <Card
                className="card4 p-ripple shadow-1"
                >
              <DataTable
                size="small" // Set size of the DataTable
                className="UserInfoTableStyle HeaderColor" // Apply custom styles
                value={values} // Set data source for the table
                dataKey="taskId" // Unique key for the rows
                stripedRows="true" // Enable striped row effect
                header={header} // Set table header
                globalFilter={globalFilter} // Set global filter for the table
                selectionMode="single" // Enable single row selection
                paginator // Enable pagination
                rows={5} // Set number of rows per page
                style={{ borderRadius: 2 }} // Apply border radius to the table
                emptyMessage={
                  // Message displayed when no data is available
                  dataLoading ? (
                    <ProgressBar
                      mode="indeterminate" // Set progress bar mode
                      style={{ height: "6px" }} // Set height for progress bar
                    ></ProgressBar>
                  ) : (
                    "No Data Available " // Message for no data
                  )
                }
                selection={selectedTask} // Set currently selected task
                onSelectionChange={(e) => setSelectedTask(e.value)} // Handle task selection change
                onRowClick={onRowClickHandler} // Handle row click event
                removableSort // Enable sortable columns
              >
                <Column
                  field="taskName" // Field name for the column
                  bodyStyle={{
                    minWidth: "6rem", // Set minimum width for the column
                  }}
                  sortable // Enable sorting for this column
                  header="Task Name" // Set column header
                  body={taskNameTemplate} // Set custom body for the column
                ></Column>
                <Column
                  body={cretetorInfo} // Set custom body for creator info
                  bodyStyle={{
                    minWidth: "6.5rem", // Set minimum width for the column
                  }}
                  header="Creator Info" // Set column header
                ></Column>
                <Column
                  field="hourMinutes" // Field name for the column
                  sortable // Enable sorting for this column
                  // header="Total Duration(Min)" // Set column header
                  header="Benchmark Time"
                  body={formatDuration} // Set custom body for duration
                ></Column>
                <Column
                  field="noOfActivites"
                  header="Activities"
                  sortable
                ></Column>
                <Column
                  bodyStyle={{
                    minWidth: "6rem", // Set minimum width for the column
                  }}
                  body={renderSatus} // Set custom body for status
                  header="Status" // Set column header
                ></Column>
                <Column
                  body={(rowData) => (
                    <>
                      {rowData.assetGroup && (
                        <Chip size="small" label={rowData.assetGroup} />
                      )}{" "}
                    </> // Display asset group as a chip
                  )}
                  header="Asset Group" // Set column header
                ></Column>
                <Column
                  header="Reviewer" // Set column header
                  body={reviewerInfo} // Set custom body for reviewer info
                  bodyStyle={{
                    minWidth: "6.5rem", // Set minimum width for the column
                  }}
                ></Column>
                <Column
                  field="Action" // Field name for the action column
                  header="Action" // Set column header
                  body={(rowData) => <ActionButton rowData={rowData} />} // Render action button
                />
              </DataTable>
              </Card>
              </div>
            )}
            {/* <br /> */}
            {isMobile && (
              <>
                <Grid container spacing={2} sx={{ marginBottom: "3.5rem" }}>
                  <Grid
                    container
                    xs={12}
                    justifyContent="center"
                    alignItems="center"
                    alignContent="center"
                  >
                    <Typography
                      sx={{
                        textAlign: "center",
                        fontWeight: 600,
                        color: "#455a64",
                        marginTop: "0.7rem",
                      }}
                    >
                      Manage Tasks
                    </Typography>
                  </Grid>
                  {dataLoading ? (
                    <Grid
                      item
                      xs={12}
                      style={{ textAlign: "center", paddingTop: "1rem" }}
                    >
                      <CircularProgress />
                    </Grid>
                  ) : values.length > 0 ? (
                    values.map((rowData) => (
                      <>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          lg={3}
                          key={rowData.taskId}
                        >
                          <Card
                            style={{
                              borderRadius: "8px",
                              height: "100%",
                              background: "",
                              boxShadow: 9,
                            }}
                          >
                            <CardContent sx={{ padding: "0 !important" }}>
                              <Grid container>
                                <Grid
                                  container
                                  xs={12}
                                  sx={{
                                    padding: "0.5rem",
                                    background: "#cfd8dc",
                                  }}
                                  onClick={() => {
                                    onRowClickHandler({ data: rowData });
                                    console.log("onRowClickHandler", rowData);
                                  }}
                                >
                                  <Grid xs={8}>
                                    <div style={{ display: "grid" }}>
                                      <Typography
                                        variant="boby1"
                                        sx={{
                                          fontWeight: 600,
                                          fontSize: "0.85rem",
                                          color: "#424242",
                                        }}
                                      >
                                        {rowData.taskName}
                                      </Typography>
                                      <Typography
                                        variant="boby1"
                                        sx={{
                                          fontSize: "0.65rem",
                                          color: "#616161",
                                        }}
                                      >
                                        {rowData.taskId}
                                      </Typography>
                                    </div>
                                  </Grid>
                                  <Grid
                                    xs={4}
                                    container
                                    sx={{
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Chip
                                      color={
                                        // Conditional severity based on the task status
                                        rowData.status === "Published"
                                          ? "success"
                                          : rowData.status === "Pending"
                                          ? "info"
                                          : rowData.status === "Not Ready" ||
                                            rowData.status === "Rejected"
                                          ? "error"
                                          : ""
                                      }
                                      size="small"
                                      label={rowData.status}
                                    />
                                  </Grid>
                                </Grid>
                                <Grid xs={12}>
                                  <Divider orientation="horizontal" />
                                </Grid>
                                <Grid container xs={8}>
                                  <Grid
                                    container
                                    xs={12}
                                    sx={{ padding: "0.5rem 0.5rem 0 0.5rem" }}
                                  >
                                    <Grid
                                      xs={12}
                                      container
                                      sx={{
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Typography
                                        variant="boby1"
                                        sx={{
                                          textAlign: "center",
                                          fontSize: "0.75rem",
                                          padding: "0.1rem 0",
                                          fontWeight: 600,
                                          color: "#616161",
                                        }}
                                      >
                                        Creator Info :
                                      </Typography>
                                    </Grid>
                                    <Grid
                                      container
                                      justifyContent="center"
                                      alignItems="center"
                                      xs={2}
                                    >
                                      <Avatar
                                        style={{
                                          backgroundColor: "#2196F3", // Avatar background color
                                          color: "#ffffff", // Avatar text color
                                          width: 25, // Avatar width
                                          height: 25, // Avatar height
                                          fontSize: "0.7rem", // Avatar font size
                                        }}
                                        shape="circle" // Making avatar circular
                                      >
                                        {getInitials(rowData.creator)}{" "}
                                        {/*Function to get initials from creatorName */}
                                      </Avatar>
                                    </Grid>
                                    <Grid
                                      xs={10}
                                      container
                                      sx={{
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: "grid",
                                          justifyItems: "start",
                                        }}
                                      >
                                        <Typography
                                          variant="boby1"
                                          sx={{
                                            textAlign: "center",
                                            fontSize: "0.75rem",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            width: "-webkit-fill-available",
                                          }}
                                        >
                                          {rowData.creator}
                                        </Typography>
                                        <Typography
                                          variant="textSecondary"
                                          sx={{
                                            textAlign: "center",
                                            fontSize: "0.65rem",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                          }}
                                        >
                                          {rowData.creationTime}
                                        </Typography>
                                      </div>
                                    </Grid>
                                  </Grid>
                                  <Grid
                                    container
                                    xs={12}
                                    sx={{ padding: "0 0.5rem 0.5rem 0.5rem" }}
                                  >
                                    <Grid
                                      xs={12}
                                      container
                                      sx={{
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Typography
                                        variant="boby1"
                                        sx={{
                                          textAlign: "center",
                                          fontSize: "0.75rem",
                                          padding: "0.1rem 0",
                                          fontWeight: 600,
                                          color: "#616161",
                                        }}
                                      >
                                        Reviwer Info :
                                      </Typography>
                                    </Grid>
                                    <Grid
                                      container
                                      justifyContent="center"
                                      alignItems="center"
                                      xs={2}
                                    >
                                      <Avatar
                                        style={{
                                          backgroundColor: "#009688", // Avatar background color
                                          color: "#ffffff", // Avatar text color
                                          width: 25, // Avatar width
                                          height: 25, // Avatar height
                                          fontSize: "0.7rem", // Avatar font size
                                          paddingTop: "1px",
                                        }}
                                        shape="circle" // Making avatar circular
                                      >
                                        {getInitials(rowData.reviewer)}{" "}
                                        {/*Function to get initials from creatorName */}
                                      </Avatar>
                                    </Grid>
                                    <Grid
                                      xs={10}
                                      container
                                      sx={{
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                      }}
                                    >
                                      <div style={{ display: "grid" }}>
                                        <Typography
                                          variant="boby1"
                                          sx={{
                                            textAlign: "center",
                                            fontSize: "0.75rem",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                          }}
                                        >
                                          {rowData.reviewer}
                                        </Typography>
                                        <Typography
                                          variant="textSecondary"
                                          sx={{
                                            textAlign: "center",
                                            fontSize: "0.65rem",
                                          }}
                                        >
                                          {/* {rowData.creationTime} */}
                                        </Typography>
                                      </div>
                                    </Grid>
                                  </Grid>
                                </Grid>

                                <Grid
                                  xs={3}
                                  container
                                  justifyContent="center"
                                  alignItems="center"
                                  alignContent="center"
                                  sx={{ margin: "0.5rem", rowGap: "0.2rem" }}
                                >
                                  <Grid
                                    container
                                    justifyContent="center"
                                    alignItems="center"
                                    alignContent="center"
                                    sx={{ rowGap: "0.2rem" }}
                                    xs={12}
                                  >
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                      sx={{
                                        textAlign: "center",
                                        fontSize: "0.75rem",
                                      }}
                                    >
                                      Total Duration
                                    </Typography>
                                    <div
                                      style={{
                                        display: "grid",
                                        justifyItems: "center",
                                      }}
                                    >
                                      <Chip
                                        size="small"
                                        label={rowData.hourMinutes}
                                      />
                                    </div>
                                  </Grid>
                                  <Grid
                                    container
                                    justifyContent="center"
                                    alignItems="center"
                                    alignContent="center"
                                    sx={{ rowGap: "0.2rem" }}
                                    xs={12}
                                  >
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                      sx={{
                                        textAlign: "center",
                                        fontSize: "0.75rem",
                                      }}
                                    >
                                      No of Activites
                                    </Typography>
                                    <div
                                      style={{
                                        display: "grid",
                                        justifyItems: "center",
                                      }}
                                    >
                                      <Chip
                                        size="small"
                                        label={rowData.noOfActivites}
                                      />
                                    </div>
                                  </Grid>
                                  <Grid
                                    container
                                    justifyContent="center"
                                    alignItems="center"
                                    alignContent="center"
                                    sx={{
                                      rowGap: "0.2rem",
                                      marginTop: "0.2rem",
                                    }}
                                    xs={12}
                                  >
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                      sx={{
                                        textAlign: "center",
                                        fontSize: "0.75rem",
                                      }}
                                    >
                                      Asset Group
                                    </Typography>
                                    <div
                                      style={{
                                        display: "grid",
                                        justifyItems: "center",
                                      }}
                                    >
                                      {rowData.assetGroup === "" ||
                                      rowData.assetGroup === null ||
                                      rowData.assetGroup === undefined ? (
                                        <Chip
                                          label="NA"
                                          size="small"
                                          //style={{ marginTop: "8px" }}
                                        />
                                      ) : (
                                        <Chip
                                          sx={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                          }}
                                          label={rowData.assetGroup}
                                          size="small"
                                          icon={<GroupsIcon />}
                                          // style={{ marginTop: "8px" }}
                                        />
                                      )}
                                    </div>
                                  </Grid>
                                </Grid>

                                <Grid xs={12}>
                                  <Divider orientation="horizontal" />
                                </Grid>
                                <Grid
                                  container
                                  sx={{ padding: "0.15rem 1rem" }}
                                  xs={12}
                                  justifyContent="center"
                                  alignItems="center"
                                >
                                  <ActionButton rowData={rowData} />
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>
                      </>
                    ))
                  ) : (
                    <Grid
                      item
                      xs={12}
                      style={{ textAlign: "center", padding: "1rem" }}
                    >
                      <Typography variant="body2">No Data Available</Typography>
                    </Grid>
                  )}
                </Grid>
                <ScrollTop style={{ marginBottom: "3rem" }} />
              </>
            )}
            {isMobile && ( // Check if on mobile device
              <AppBar
                position="fixed" // Fix position at the bottom
                color="primary" // Set color of the AppBar
                sx={{ top: "auto", bottom: 0 }} // Position at the bottom
              >
                <BottomNavigation showLabels>
                  <BottomNavigationAction
                    label="Add New Task" // Label for the button
                    icon={<NoteAddIcon size="small" color="primary" />} // Icon for the button
                    onClick={() => {
                      setShowCreation(true); // Set to show task creation form
                    }}
                  />
                </BottomNavigation>
              </AppBar>
            )}

            {/* Floating action button for adding new task */}
            {isMobile || (
              <Tooltip title="Add New Task" placement="top">
                <Fab
                  color="primary" // Set color for the Fab
                  aria-label="add" // Aria label for accessibility
                  size="medium" // Set size of the Fab
                  style={{
                    position: "fixed", // Fix position
                    bottom: 50, // Position from bottom
                    right: 50, // Position from right
                    animation: "fadeIn 0.5s ease-in-out", // Fade-in animation
                  }}
                  onClick={() => {
                    setShowCreation(true); // Set to show task creation form
                  }}
                >
                  <AddIcon /> {/*  Add icon for the Fab */}
                </Fab>
              </Tooltip>
            )}
            {/* Custom dialog for confirmation */}
            <CustomDialog
              open={delOpen} // Control dialog open state
              setOpen={setDelOpen} // Function to set dialog open state
              proceedButtonText={"YES"} // Text for proceed button
              proceedButtonClick={deleteTask} // Function to call on proceed button click
              cancelButtonText={"NO"} // Text for cancel button
            ></CustomDialog>
            {/* Snackbar for notifications */}
            <SnackbarComponent
              openPopup={snackbarOpen} // Control snackbar open state
              setOpenPopup={setSnackbarOpen} // Function to set snackbar open state
              dialogMessage={snackbarText} // Message to display in snackbar
              snackbarSeverity={snackbarSeverity} // Severity level for snackbar
            ></SnackbarComponent>
          </Container>
        </>
      ) : (
        <>
          <div>
            <TaskCreation dbTaskDetails={taskDetails}></TaskCreation>{" "}
            {/* <h2>Hello World</h2> */}
            {/* Render task creation component */}
          </div>
        </>
      )}
    </>
  );
}
