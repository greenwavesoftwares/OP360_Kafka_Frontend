// Importing necessary libraries and components
import { library } from "@fortawesome/fontawesome-svg-core"; // FontAwesome library for icons
import { fas } from "@fortawesome/free-solid-svg-icons"; // Solid icons from FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // FontAwesomeIcon component for React
import { ExpandLess, ExpandMore } from "@mui/icons-material"; // Icons for expand/collapse functionality
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"; // Left chevron icon
import ChevronRightIcon from "@mui/icons-material/ChevronRight"; // Right chevron icon
import LogoutIcon from "@mui/icons-material/Logout"; // Logout icon
import MenuIcon from "@mui/icons-material/Menu"; // Menu icon
import { motion } from "framer-motion";
import PersonIcon from "@mui/icons-material/Person";
import KeyIcon from "@mui/icons-material/Key";
// Importing Material-UI components
import {
  Alert,
  Avatar, // Component for displaying user avatars
  Button, // Button component
  Chip, // Chip component for displaying tags
  Collapse,
  Link,
  MenuItem, // Component for collapsible content
  Badge as MuiBadge,
  Popover,
  Slide,
  Snackbar,
  TextField, // Badge component, renamed to avoid conflict
  Tooltip, // Tooltip component for displaying additional info
  useMediaQuery, // Hook for handling responsive design
} from "@mui/material";

import MuiAppBar from "@mui/material/AppBar"; // AppBar component
import Box from "@mui/material/Box"; // Box component for layout
import CssBaseline from "@mui/material/CssBaseline"; // CSS baseline for consistent styling
import Divider from "@mui/material/Divider"; // Divider component for separating content
import MuiDrawer from "@mui/material/Drawer"; // Drawer component for side navigation
import IconButton from "@mui/material/IconButton"; // Icon button component
import List from "@mui/material/List"; // List component for displaying lists
import ListItem from "@mui/material/ListItem"; // List item component
import ListItemButton from "@mui/material/ListItemButton"; // Button for list items
import ListItemIcon from "@mui/material/ListItemIcon"; // Icon for list items
import ListItemText from "@mui/material/ListItemText"; // Text for list items
import { styled, useTheme } from "@mui/material/styles"; // Styling utilities from Material-UI
import Toolbar from "@mui/material/Toolbar"; // Toolbar component
import Typography from "@mui/material/Typography"; // Typography component for text styles
import * as React from "react"; // Importing React library
import { Container } from "react-bootstrap"; // Container component from React Bootstrap
import { useLocation, useNavigate } from "react-router-dom"; // Hooks for routing
import { getActivitiesToReview } from "../ActivityReviewer/ActivityReviewerAPI"; // API call for activities
import {
  decryptTokenId,
  extendTokenExpiration,
  logout,
} from "../helper/AuthService"; // Authentication helper functions
import { fetchJobs } from "../JobPerformer/JobPerformerAPI"; // API call for fetching jobs
import { fetchJobsToReview } from "../JobReviewer/JobReviewerAPI"; // API call for jobs to review
import { allLogbookReportsApi } from "../LogbookReports/LogbookReportsApi"; // API call for logbook reports
import { getAllTaskByTenantId } from "../Task/TaskAPI"; // API call for tasks by tenant ID
import { getCurrentUser } from "../UserModuleUpdated/helper"; // Helper to get current user details'

import {
  getTenantID, // Function to get Tenant ID
  getUserDetailsByUserID, // Function to get user details by user ID
} from "../UserModuleUpdated/UsermoduleApi"; // User module API

import {
  fetchBadgeDetails,
  fetchDashboardDetails,
  getMenuDetails, // Function to get menu details
} from "./MenubarAPI"; // Menubar API functions

import MobileMenubar from "./MobileMenubar"; // Mobile menubar component
import GwWhiteLogo from "../Image/GWWhiteLogo.png"; // Importing white logo image
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { EventSourcePolyfill } from "event-source-polyfill";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { checkTenantExpiration } from "../Tenant/TenantApi";
import { userHasPageAccess } from "./MenubarHelper";

import { initializePWAInstallPrompt, installPWA } from "../pwa/installPrompt";
import InstallDesktopIcon from "@mui/icons-material/InstallDesktop";
import { isInStandaloneMode } from "../pwa/iosInstall";

// Environment variables to fetch tenant ID and user ID from session storage
const REACT_APP_TENANTID = process.env.REACT_APP_TENANTID; // Tenant ID from environment variables
const REACT_APP_USERID = process.env.REACT_APP_USERID; // User ID from environment variables

// Adding solid icons to the FontAwesome library
library.add(fas);

// Setting the width for the drawer
const drawerWidth = 240;

// Function to define styles for opened drawer
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: " hidden",
});
//CssTextfield is used in searchbar to search reports
const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "white",
  },
  "& label.MuiInputLabel-root": {
    color: "white",
  },
  "& label..MuiInputLabel-filled": {
    color: "white",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#B2BAC2",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#E0E3E7",
    },
    "&:hover fieldset": {
      borderColor: "#B2BAC2",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6F7E8C",
    },
  },
});

// Function to define styles for closed drawer
const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

// Styled component for the drawer header
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

// Styled component for the app bar
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// Styled component for the drawer
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));
/**
 * Component to render Menubar
 */
export default function MiniDrawer({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate(); //React hook to navigate to a path
  const [open, setOpen] = React.useState(false); //State to open the sidebar
  const [menuJson, SetMenuJson] = React.useState([]); //state to hold the information of the menubar
  const [openedChild, setOpenedChild] = React.useState([]); //state to open a child in the menubar
  const user = localStorage.getItem(REACT_APP_USERID); //constant to hold encrypted userid from session storage
  const tenant = localStorage.getItem(REACT_APP_TENANTID); //constant to hold encrypted tenant from session storage
  const tenantId = decryptTokenId(tenant); //decrypt tenant
  const userid = decryptTokenId(user); //decrypt user
  const token = localStorage.getItem("token");

  const [menuShow, setMenuShow] = React.useState(true); //state to show menu in expanded mode
  const [newCurrentUser, setnewCurrentUser] = React.useState(""); //state to show current user
  const [logbookReports, setLogbookReports] = React.useState(null); //state to hold all logbook reports of the current user
  const [allReportsLength, setAllReportsLength] = React.useState(0); //state to hold  the number of logbook reports of the current user
  const [filter, setFilter] = React.useState(""); //state to filter logbook reports of the current user
  const [openMenu, setOpenMenu] = React.useState(false); //state to open menu when user clicks on user name
  const menusWithModification = {
    performer: "/workflow/performer",
    reports: "/workflow/reports",
    taskReviewer: "/workflow/taskreview",
    activityReviewer: "/workflow/activityReviewer",
    jobReviewer: "/workflow/jobreviewer",
    userProfile: "/workflow/userprofile",
    admin: "/workflow/admin",
    reportview: "/workflow/reportview?selectedReport=",
    dashboardLogbook: `/workflow/logbookform?selectedLogbook=`,
  };
  const [badgeDetails, setBadgeDetails] = React.useState(null);

  const [snackBarOpen, setSnackBarOpen] = React.useState(false); // Manages whether the snackbar is visible
  const [snackbarText, setSnackbarText] = React.useState(""); // this state variable shows the text of snackbar
  const [snackbarSeverity, setsnackbarSeverity] = React.useState(""); // snackbarSeverity state variable holds the Severity of a snackbar (success, error, info etc.)
  const [subscriptionStatus, setSubscriptionStatus] = React.useState(0);
  const [dashboardLogbooks, setDashboardLogbooks] = React.useState(null);

  const [resetPage, setResetPage] = React.useState(false); // State to trigger page reset
  const handleClick = () => {
    setSnackBarOpen(true);
  };

  const [canInstall, setCanInstall] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return; // Prevents snackbar from closing on a click outside
    }
    setSnackBarOpen(false);
  };

  const handleMenuClick = (event) => {
    setOpenMenu(event.currentTarget); // Opens the menu
    //renderUserAndAdmin();
  };

  const handleCloseMenu = () => {
    setOpenMenu(false); // Closes the menu
  };

  //Logbook reports filtered based on search keywords
  const filteredLogbookreports = logbookReports?.filter((row) =>
    row?.label?.toLowerCase().includes(filter?.toLowerCase()),
  ); //filter the rows based on the input value

  //Logbook dashboard filtered based on search keywords
  const filteredlogbookdashboard = dashboardLogbooks?.filter((row) =>
    row?.label?.toLowerCase().includes(filter?.toLowerCase()),
  ); //filter the rows based on the input value

  const formatDate = (date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const fetchStatus = async () => {
    try {
      const { status, expiryDate, graceExpiry } = await checkTenantExpiration(
        decryptTokenId(localStorage.getItem(process.env.REACT_APP_TENANTID)),
      );

      console.log("status:", status);
      console.log("expiryDate:", expiryDate);
      console.log("graceExpiry:", graceExpiry);

      if (status === 3) {
        setSubscriptionStatus(3);
        handleClick();
        setSnackbarText(
          `Your subscription has expired on ${formatDate(
            expiryDate,
          )}. Please Subscribe again.`,
        );
        setsnackbarSeverity("error");
        navigate("/");
        return;
      } else if (status === 2) {
        setSubscriptionStatus(2);
        handleClick();
        setSnackbarText(
          `Your subscription expired on ${formatDate(
            expiryDate,
          )}. You are currently within the grace period and will lose access after ${formatDate(
            graceExpiry,
          )}.`,
        );
        setsnackbarSeverity("warning");
      } else if (status === 1) {
        console.log("Valid subscription, expires on:", expiryDate);
      } else {
        handleClick();
        setSnackbarText(
          "Unable to verify your subscription. Please try again.",
        );
        setsnackbarSeverity("error");
      }
    } catch (error) {
      console.error("Failed to check tenant expiration:", error);
      handleClick();
      setSnackbarText(
        "An unexpected error occurred while checking your subscription.",
      );
      setsnackbarSeverity("error");
    }
  };

  //UseEffects

  React.useEffect(() => {
    fetchAllMenuInformation();
  }, []);

  React.useEffect(() => {
    fetchStatus();
  }, []);

  React.useEffect(() => {
    // Hide button if already running as installed PWA
    const isStandalone =
      window.navigator.standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches;

    if (isStandalone) {
      setCanInstall(false);
      return;
    }

    initializePWAInstallPrompt(setCanInstall);
  }, []);

  const handleInstall = async () => {
    console.log("handleInstall called");
    await installPWA();
  };

  // if (!canInstall) return null;

  //Functions
  /**
   *
   * Function to fetch menu information
   */

  const fetchAllMenuInformation = () => {
    fetchDataFromSSE();
    fetchData();
    fetchUserDetailsByUserId();
  };
  /**
   *
   * Function to fetch user details of current user
   */

  const fetchUserDetailsByUserId = async () => {
    const userid = getCurrentUser(); //Function which returns decrypted userid from session storage
    const userdetails = await getUserDetailsByUserID(userid); //Function to fetch user details by userid
    if (!userdetails) {
      return null;
    }

    const currentuser = userdetails.userName;
    if (!currentuser) {
      const savedTenant = localStorage.getItem("savedTenant");
      localStorage.clear(); // Clear the localStorage information
      if (savedTenant) localStorage.setItem("savedTenant", savedTenant); // keep the tenant

      navigate("/"); // Navigate to the '/' page if currentuser is undefined
    } else {
      setnewCurrentUser(currentuser); //set username of the current user
    }
  };

  const fetchGroups = async () => {
    //Find encrypted current user from session storage and then decrypt it
    const user = localStorage.getItem(process.env.REACT_APP_USERID);
    const performer = decryptTokenId(user); //
    const responsedata = await getUserDetailsByUserID(performer);
    if (!responsedata) {
      return null;
    }

    const responseUserGroupName = responsedata.group; //Find the groups with which the user is associated with

    let groups = "";
    responseUserGroupName.forEach((group) => {
      groups += group.groupName + ","; // Concatenate group names with a comma
    });
    return groups;
  };

  /**
   *
   * Function to set data for the menubar
  //  */
  // const fetchDataFromWebsocket=()=>{
  //   console.log("Fetch data from websocket")
  //   const socket = new SockJS('http://localhost:8091/ws');
  //   const stompClient = new Client({
  //     webSocketFactory: () => socket,
  //     // connectHeaders: connectHeaders,
  //     onConnect: (frame) => {

  //   stompClientRef.current = stompClient;

  //       console.log('Connected: ' + frame);
  //       stompClient.subscribe('/notifications/receiveBadgeDetails', (message) => {
  //         setBadgeDetails(JSON.parse(message.body));
  //         console.log("Badge details:")
  //         console.log(JSON.parse(message.body))
  //       });

  //       handleSendRequest();
  //     },
  //     onWebSocketError: (error) => {
  //       console.error('WebSocket connection error: ' + error);
  //     },
  //     onStompError: (frame) => {
  //       console.error('STOMP error: ' + frame.body);
  //     },
  //   });
  //   stompClient.activate();
  // }
  // const handleSendRequest = () => {
  //   console.log("handleSendRequest")
  //   if (stompClientRef.current && stompClientRef.current.connected ) {
  //     stompClientRef.current.publish({
  //       destination: `/websocket/sendRequests`,
  //       body: JSON.stringify({ tenant:tenantId,
  //       token:token,
  //       performer:userid,
  //       groupList:"Admin," })
  //     }); // Clear the input after sending the message
  //     console.log("Send message")
  //   } else {
  //     console.error('WebSocket connection is not established or message is empty.');
  //   }
  // };

  const fetchDataFromSSE = async () => {
    console.log("fetchDataFromSSE");
    const groups = await fetchGroups();
    const badge=await fetchBadgeDetails(userid,groups,tenantId)
    setBadgeDetails(badge)
    // const eventSource = new EventSourcePolyfill(
    //   `${process.env.REACT_APP_USERGROUPS}/menu/stream/${userid}/${groups}/${tenantId}`,
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${localStorage.getItem("token")}`,
    //     },
    //   },
    // );

    // eventSource.onmessage = (event) => {
    //   try {
    //     const receivedData = JSON.parse(event.data);
    //     setBadgeDetails(receivedData);
    //     // console.log("Received data from SSE: ", receivedData);
    //   } catch (err) {
    //     console.error("Failed to parse SSE data:", err);
    //   }
    // };

    // eventSource.onerror = (err) => {
    //   console.error("SSE connection error:", err);
    // };

    // // Clean up on component unmount
    // return () => {
    //   console.log("Closing SSE connection.");
    //   eventSource.close();
    // };
  };

  const fetchData = async () => {
    try {
      const menuData = await getMenuDetails(); //Function which fetch data for the menubar using api call
      console.log("Menu Details : ", menuData);
      SetMenuJson(menuData?.items); //sets the data into the state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Function to handle link click
  const handleLinkClick = async (path, label, item) => {
    if (label !== "Reports" && label !== "Logbook Dashboard") {
      //If the  label is not reports then it will navigate to the respective page
      console.log("path:", path);
      console.log("Item:", item);
      console.log("Label:", label);
      if (
        item?.trim().toLowerCase() !== "report" &&
        item?.trim().toLowerCase() !== "logbook dashboard"
      )
        userHasPageAccess(path, navigate); //check user has access to that page
      if (path === window.location.pathname) {
        // navigate(0); //Navigates to the respective page
        setResetPage(true); // Resets the page state
        setTimeout(() => {
          setResetPage(false); // Resets the page state after 1 second
        }, 10);
      } else navigate(path); //Navigates to the respective pge
      setMenuShow(true);
      setOpenMenu(false); //Closes the menu which opens on username click
      setOpen(false); //closes the sidebar
      extendTokenExpiration(); //extend token whenever user visits a new page
    } else if (label === "Logbook Dashboard") {
      console.log("Logbook dashboard");
      const allDashboardLogbooks = await fetchDashboardDetails();
      console.log("All logbook dashboards:", allDashboardLogbooks);
      if (!(allDashboardLogbooks?.length > 0)) setDashboardLogbooks([]);

      setDashboardLogbooks(
        allDashboardLogbooks?.map((logbook) => ({
          label: logbook?.formname,
          path:
            menusWithModification.dashboardLogbook +
            logbook?.formname +
            "?version=" +
            logbook?.versionNumber,
          item: "Logbook Dashboard",
          version: logbook?.versionNumber,
        })),
      );
    } else {
      //Else it will render the reports of the current user
      const allreports = await allLogbookReportsApi(userid); //Function to fetch all logbook reports
      if (!(allreports?.length > 0)) setLogbookReports([]);

      const allreportsize = allreports;
      //setAllReportsLength(allreports.size());

      setLogbookReports(
        allreports?.map((report) => ({
          label: report,
          path: menusWithModification.reportview + report,
          item: "Report",
        })),
      );
    }
    if (item === "Logbook Dashboard") {
      navigate(path, {
        state: {
          [process.env.REACT_APP_VERSIONNUMBER]: dashboardLogbooks?.find(
            (obj) => obj?.label === label,
          )?.version,
          [process.env.REACT_APP_FORMNAME]: label,
        },
      });
    }
  };
  // Function to convert name to initials
  const convertToInitials = (name) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (
        parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase()
      );
    } else if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    } else {
      return "";
    }
  };
  const location = useLocation();
  // Function to render a tree of list items
  const renderTree = (items) => {
    // Map over each item in the items array
    return items.map((item, index) => {
      // Determine if the current item is selected based on the location pathname
      const isSelected = location.pathname === item.path;
      // Return a React Fragment with a unique key
      return (
        item.path !== menusWithModification.admin &&
        item.path !== menusWithModification.userProfile && (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <React.Fragment key={index}>
              {/* // Render a ListItem component */}
              <ListItem
                // Apply styles based on whether the item is selected
                sx={{
                  borderLeft: isSelected ? " 5px solid #4097FF" : "none",
                  background: isSelected ? "#4a5b64" : "inherit",
                }}
                // Add a class name for styling
                className="menuTree scrollBarHide"
              >
                {/* // Check if the item has child items */}
                {Array.isArray(item.items) &&
                  // Check if the openedChild array is not empty and if it contains the current item
                  (openedChild.length !== 0 &&
                  openedChild.some(
                    (currentitem) =>
                      currentitem.label === item.label &&
                      currentitem.parent === item.parent,
                  ) ? (
                    // If the item is already opened, render a button to close it
                    <ListItemButton
                      onClick={() => {
                        fetchStatus();
                        setOpenedChild([]);
                      }}
                    >
                      <ExpandLess />
                    </ListItemButton>
                  ) : (
                    // If the item is not opened, render a button to open it
                    <ListItemButton
                      onClick={() => {
                        fetchStatus();
                        setOpenedChild([...openedChild, item]);
                      }}
                    >
                      <ExpandMore />
                    </ListItemButton>
                  ))}
                {/* // Render a tooltip with the item label */}
                <Tooltip placement="right" title={open ? "" : item.label}>
                  {/* Anchor tag to duplicate the link in new window */}

                  {/* // Render a ListItemButton with a custom style */}
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      color: isSelected ? "#4097FF" : "",
                      marginLeft: isSelected ? "-5px" : "",
                    }}
                    // Handle click event to navigate to the item's path
                    onClick={() => {
                      fetchStatus();
                      handleLinkClick(item.path, item.label, item.item);
                    }}
                  >
                    <Link
                      href={item.path}
                      style={{ textDecoration: "none", color: "black" }}
                      onClick={(event) => {
                        event.preventDefault();
                      }}
                    >
                      {/* // Check if the item has a logo */}
                      {item.logo && (
                        // Render a ListItemIcon with a custom style
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                            alignItems: "center",
                            color: isSelected ? "#4097FF" : "",
                            width: "1rem",
                          }}
                        >
                          {/* // Render a FontAwesomeIcon with a badge based on the item label */}
                          {item.path === menusWithModification.performer ? (
                            <MuiBadge
                              badgeContent={
                                badgeDetails?.activitiesToPerformCount
                              }
                              color="info"
                              max={9999}
                            >
                              <FontAwesomeIcon color="white" icon={item.logo} />
                            </MuiBadge>
                          ) : item.path === menusWithModification.reports ? (
                            <MuiBadge
                              badgeContent={badgeDetails?.reportsCount}
                              color="info"
                              max={9999}
                            >
                              <FontAwesomeIcon color="white" icon={item.logo} />
                            </MuiBadge>
                          ) : item.path ===
                            menusWithModification.taskReviewer ? (
                            <MuiBadge
                              badgeContent={badgeDetails?.tasksToReviewCount}
                              max={9999}
                              color="info"
                            >
                              <FontAwesomeIcon color="white" icon={item.logo} />
                            </MuiBadge>
                          ) : item.path ===
                            menusWithModification.activityReviewer ? (
                            <MuiBadge
                              badgeContent={
                                badgeDetails?.activitiesToReviewCount
                              }
                              max={9999}
                              color="info"
                            >
                              <FontAwesomeIcon color="white" icon={item.logo} />
                            </MuiBadge>
                          ) : item.path ===
                            menusWithModification.jobReviewer ? (
                            <MuiBadge
                              badgeContent={badgeDetails?.jobsToReviewCount}
                              color="info"
                              max={9999}
                            >
                              <FontAwesomeIcon color="white" icon={item.logo} />
                            </MuiBadge>
                          ) : (
                            <FontAwesomeIcon color="white" icon={item.logo} />
                          )}
                        </ListItemIcon>
                      )}
                    </Link>
                    {/* // Render a ListItemText with a custom style */}
                    {open ? (
                      <Link
                        href={item.path}
                        style={{ textDecoration: "none", color: "black" }}
                        onClick={(event) => {
                          event.preventDefault();
                        }}
                      >
                        <ListItemText
                          primary={
                            // Check if the item label is one of the special cases
                            <Typography sx={{ color: "#ffffffe8" }}>
                              {item.label}
                            </Typography>
                          }
                          sx={{
                            opacity: open ? 1 : 0,
                            whiteSpace: open ? "pre-wrap" : "none",
                          }}
                        />
                      </Link>
                    ) : (
                      <ListItemText
                        primary={
                          // Check if the item label is one of the special cases
                          item.label
                        }
                        sx={{
                          opacity: open ? 1 : 0,
                          whiteSpace: open ? "pre-wrap" : "none",
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
                {/* // Check if the item has child items */}
                {Array.isArray(item.items) ? (
                  // Render a Collapse component with a custom style
                  <Collapse
                    in={openedChild.some(
                      (currentitem) =>
                        currentitem.label === item.label &&
                        currentitem.parent === item.parent,
                    )}
                    timeout="auto"
                    unmountOnExit
                  >
                    {/* // Render a Container component with a custom style */}
                    <Container style={{ marginTop: "220px" }}>
                      {/* // Render a List component with the child items */}
                      <List>{renderTree(item.items)}</List>
                    </Container>
                  </Collapse>
                ) : null}
              </ListItem>
            </React.Fragment>
          </motion.div>
        )
      );
    });
  };
  const renderUserAndAdmin = () => {
    const menuItems = menuJson;

    return (
      <Box
        sx={{
          background:
            subscriptionStatus === 2 || subscriptionStatus === 3
              ? "rgb(90, 7, 7)"
              : "#263238",
        }}
      >
        {menuItems?.map((menuItem, index) =>
          menuItem.path === menusWithModification.userProfile ? (
            <Box key={index}>
              <Link
                href={menuItem.path}
                style={{ textDecoration: "none", color: "black" }}
                onClick={(event) => {
                  event.preventDefault();

                  menuItem?.path &&
                    handleLinkClick(
                      menuItem.path,
                      menuItem.label,
                      menuItem.item,
                    );
                }}
              >
                <MenuItem
                  sx={{
                    borderLeft:
                      location.pathname === menusWithModification.userProfile
                        ? " 5px solid #4097FF"
                        : "none",
                    background:
                      location.pathname === menusWithModification.userProfile
                        ? "#4a5b64"
                        : "",
                  }}
                >
                  <ListItemIcon>
                    <FontAwesomeIcon color="white" icon={menuItem.logo} />
                  </ListItemIcon>
                  <Typography sx={{ color: "white" }}>
                    {menuItem.label}
                  </Typography>
                </MenuItem>
                <Divider
                  sx={{
                    borderColor: "#ffffff30",
                    margin: "3px 0px !important",
                  }}
                />
              </Link>
            </Box>
          ) : menuItem.path === menusWithModification.admin ? (
            <Box key={index}>
              <Link
                href={menuItem.path}
                style={{ textDecoration: "none", color: "black" }}
                onClick={(event) => {
                  event.preventDefault();
                  menuItem?.path &&
                    handleLinkClick(
                      menuItem.path,
                      menuItem.label,
                      menuItem.item,
                    );
                }}
              >
                <MenuItem
                  sx={{
                    borderLeft:
                      location.pathname === menusWithModification.admin
                        ? " 5px solid #4097FF"
                        : "none",
                    background:
                      location.pathname === menusWithModification.admin
                        ? "#4a5b64"
                        : "",
                  }}
                >
                  <ListItemIcon>
                    <FontAwesomeIcon color="white" icon={menuItem.logo} />
                  </ListItemIcon>
                  <Typography sx={{ color: "white" }}>
                    {menuItem.label}
                  </Typography>
                </MenuItem>
                <Divider
                  sx={{
                    borderColor: "#ffffff30",
                    margin: "3px 0px !important",
                  }}
                />
              </Link>
            </Box>
          ) : null,
        )}
        <MenuItem
          onClick={async () => {
            await handleLogout();
          }}
        >
          <ListItemIcon>
            <LogoutIcon sx={{ color: "white" }} fontSize="small" />
          </ListItemIcon>
          <Typography sx={{ color: "white" }}>Logout</Typography>
        </MenuItem>
      </Box>
    );
  };

  //Function to expand the sidebar
  const handleDrawerOpen = () => {
    setOpen(true);
    setMenuShow(false);
  };

  //Function to contract the sidebar
  const handleDrawerClose = () => {
    setMenuShow(true);
    setOpen(false);
    setOpenedChild([]);
  };

  //Function to logout
  const handleLogout = async () => {
    const result = await logout();
    if (result) {
      await navigate(`/`);
    }
    return result;
  };

  // Return the JSX component
  return (
    <>
      {/* Outer container with custom styles */}
      <Box sx={{ marginTop: isMobile ? "0" : "-45px", zIndex: "300" }}>
        {/* Material-UI CSS baseline */}
        <CssBaseline />

        {/* Fixed app bar with custom styles */}
        <AppBar
          position="fixed"
          open={open}
          sx={{
            zIndex: 500,
            background:
              subscriptionStatus === 2 || subscriptionStatus === 3
                ? "rgb(90, 7, 7)"
                : "#263238",
            boxShadow: "none",
          }}
          // sx={{ zIndex: 500, background: "#522424ff", boxShadow: "none" }}
        >
          {/* Mobile toolbar */}
          {isMobile && (
            <Toolbar>
              {/* Menu icon button */}
              <IconButton
                color="inherit"
                aria-label="open drawer"
                //onClick={handleDrawerOpen}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
              {/* App title */}
              <Typography
                variant="h6"
                sx={{ fontSize: "0.8rem" }}
                noWrap
                component="div"
              >
                Operations 360
              </Typography>
            </Toolbar>
          )}
        </AppBar>

        {/* Drawer component */}
        {isMobile || isTab || (
          <Drawer
            variant="permanent"
            open={open}
            className={
              subscriptionStatus === 2 || subscriptionStatus === 3
                ? "muiMeunuBarZIndexRedBG"
                : "muiMeunuBarZIndex"
            }
            sx={{
              background:
                subscriptionStatus === 2 || subscriptionStatus === 3
                  ? "rgb(90, 7, 7)"
                  : "#263238",
            }}
          >
            {/* Fixed section at the top of the drawer */}
            <div
              className="fixedSection"
              style={{
                position: "sticky",
                top: "0",
                left: "0",
                background:
                  subscriptionStatus === 2 || subscriptionStatus === 3
                    ? "rgb(90, 7, 7)"
                    : "#263238",
                zIndex: "+1",
              }}
            >
              {/* Drawer header with menu icon and close icon */}
              <DrawerHeader variant="permanent">
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginLeft: open ? "1rem" : 0,
                    }}
                  >
                    {/* <img
                      src={GwLogo}
                      alt="GwLogo"
                      style={{ width: "2.4rem", height: "2.4rem" }}
                    /> */}
                    <div>
                      <Chip
                        label="Operations360"
                        size="medium"
                        sx={{
                          backgroundColor: "#3c4a52", // Set to a light color for dark backgrounds
                          color: "white", // Text color for contrast
                          //border: "1px solid #ddd" // Optional border for emphasis
                        }}
                        avatar={
                          <img
                            src={GwWhiteLogo}
                            alt="GwLogo"
                            style={{ width: "2rem", height: "2rem" }}
                          />
                        }
                      />
                    </div>
                  </div>
                  {/* Menu icon button */}
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    //edge="start"
                    sx={{
                      marginLeft: "1.1rem",
                      //...(open && { display: "none" }),
                    }}
                  >
                    {" "}
                    {menuShow && (
                      <MenuIcon
                        sx={{
                          color: "#fff",
                          background: "#36444a",
                          padding: "0.2rem",
                          borderRadius: "50%",
                          width: "1.3em",
                          height: "1.3em",
                        }}
                      />
                    )}
                  </IconButton>
                </>
                {/* Close icon */}
                {!menuShow && (
                  <IconButton onClick={handleDrawerClose}>
                    {theme.direction === "rtl" ? (
                      <ChevronRightIcon sx={{ color: "white" }} />
                    ) : (
                      <ChevronLeftIcon sx={{ color: "white" }} />
                    )}
                  </IconButton>
                )}
              </DrawerHeader>
              {/* Divider */}
              <Divider sx={{ borderColor: "#ffffff30" }} />
            </div>
            {menuJson?.length > 0 ? (
              <>
                {/* Navigation menu list */}
                <List>
                  {menuJson &&
                    logbookReports === null &&
                    dashboardLogbooks === null &&
                    renderTree(menuJson)}
                </List>

                {/* Logbook reports list */}
                {logbookReports && (
                  <List>
                    <>
                      {/* Back button */}
                      {logbookReports && (
                        <Tooltip placement="right" title="Back To Main Menu">
                          <Button
                            onClick={() => {
                              setLogbookReports(null);
                            }}
                            // variant="contained"
                            // size="small"
                            // sx={{background:"red"}}
                          >
                            <i
                              class="fa fa-arrow-left"
                              style={{ color: "#fffffff2" }}
                              aria-hidden="true"
                            ></i>
                          </Button>
                        </Tooltip>
                      )}
                      <br />
                    </>
                    {/* Logbook report items */}
                    {logbookReports && open && logbookReports?.length > 0 && (
                      <>
                        <CssTextField
                          size="small"
                          sx={{ margin: "0.5rem" }}
                          InputProps={{ style: { color: "white" } }}
                          label="Search Reports"
                          onChange={(event) => setFilter(event.target.value)}
                          id="custom-css-outlined-input"
                        />
                      </>
                    )}
                    {logbookReports && !logbookReports?.length > 0 && open && (
                      <>
                        <Chip
                          label="No Reports Found"
                          size="small"
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "white",
                            // padding: "0px 10px",
                            margin: "0.5rem",
                          }}
                          // fullWidth
                        />
                      </>
                    )}
                    {filteredLogbookreports &&
                      filteredLogbookreports.map((itemLogbook, itemindex) => {
                        const params = new URLSearchParams(location.search); // Parse the query string
                        const selectedReport = params.get("selectedReport");
                        const isSelected = selectedReport === itemLogbook.label;
                        return (
                          <>
                            <ListItem
                              sx={{
                                borderLeft: isSelected
                                  ? " 5px solid #4097FF"
                                  : "none",
                                background: isSelected ? "#4a5b64" : "inherit",
                              }}
                            >
                              {/* Tooltip with report label */}
                              <Tooltip
                                placement="right"
                                title={open ? "" : itemLogbook.label}
                              >
                                {/* Report item button */}
                                <ListItemButton
                                  key={itemindex}
                                  sx={{
                                    minHeight: 48,
                                    justifyContent: open ? "initial" : "center",
                                    color: isSelected ? "#4097FF" : "",
                                    marginLeft: isSelected ? "-5px" : "",
                                  }}
                                  onClick={() =>
                                    handleLinkClick(
                                      itemLogbook.path,
                                      itemLogbook.label,
                                      itemLogbook.item,
                                    )
                                  }
                                >
                                  {/* Report icon */}
                                  <Link
                                    href={itemLogbook.path}
                                    style={{
                                      textDecoration: "none",
                                      color: "black",
                                    }}
                                    onClick={(event) => {
                                      event.preventDefault();
                                    }}
                                  >
                                    <ListItemIcon
                                      sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        color: isSelected ? "#4097FF" : "",
                                      }}
                                    >
                                      <FontAwesomeIcon
                                        color="white"
                                        icon="fa-solid fa-file-lines"
                                      />
                                    </ListItemIcon>
                                  </Link>
                                  {/* Report label */}
                                  {open ? (
                                    <Link
                                      href={itemLogbook.path}
                                      style={{
                                        textDecoration: "none",
                                        color: "black",
                                      }}
                                      onClick={(event) => {
                                        event.preventDefault();
                                      }}
                                    >
                                      <ListItemText
                                        primary={itemLogbook.label}
                                        sx={{
                                          opacity: open ? 1 : 0,
                                          whiteSpace: open
                                            ? "pre-wrap"
                                            : "none",
                                          color: "#ffffffe8",
                                        }}
                                      />
                                    </Link>
                                  ) : (
                                    <ListItemText
                                      primary={itemLogbook.label}
                                      sx={{
                                        opacity: open ? 1 : 0,
                                        whiteSpace: open ? "pre-wrap" : "none",
                                      }}
                                    />
                                  )}
                                </ListItemButton>
                                {/* </a> */}
                              </Tooltip>
                            </ListItem>
                          </>
                        );
                      })}
                  </List>
                )}
                {/*dashboard Logbook  list */}
                {dashboardLogbooks && (
                  <List>
                    <>
                      {/* Back button */}
                      {dashboardLogbooks && (
                        <Tooltip placement="right" title="Back To Main Menu">
                          <Button
                            onClick={() => {
                              setDashboardLogbooks(null);
                            }}
                            // variant="contained"
                            // size="small"
                            // sx={{background:"red"}}
                          >
                            <i
                              class="fa fa-arrow-left"
                              style={{ color: "#fffffff2" }}
                              aria-hidden="true"
                            ></i>
                          </Button>
                        </Tooltip>
                      )}
                      <br />
                    </>
                    {/* Logbook report items */}
                    {dashboardLogbooks &&
                      open &&
                      dashboardLogbooks?.length > 0 && (
                        <>
                          <CssTextField
                            size="small"
                            sx={{ margin: "0.5rem" }}
                            InputProps={{ style: { color: "white" } }}
                            label="Search Logbook"
                            onChange={(event) => setFilter(event.target.value)}
                            id="custom-css-outlined-input"
                          />
                        </>
                      )}
                    {dashboardLogbooks &&
                      !dashboardLogbooks?.length > 0 &&
                      open && (
                        <>
                          <Chip
                            label="No Dashboard Found"
                            size="small"
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "white",
                              // padding: "0px 10px",
                              margin: "0.5rem",
                            }}
                            // fullWidth
                          />
                        </>
                      )}
                    {filteredlogbookdashboard &&
                      filteredlogbookdashboard.map((itemLogbook, itemindex) => {
                        const params = new URLSearchParams(location.search); // Parse the query string
                        const selectedLogbook = params.get("selectedLogbook");
                        const isSelected =
                          selectedLogbook === itemLogbook.label;
                        return (
                          <>
                            <ListItem
                              sx={{
                                borderLeft: isSelected
                                  ? " 5px solid #4097FF"
                                  : "none",
                                background: isSelected ? "#4a5b64" : "inherit",
                              }}
                            >
                              {/* Tooltip with report label */}
                              <Tooltip
                                placement="right"
                                title={open ? "" : itemLogbook.label}
                              >
                                {/* Report item button */}
                                <ListItemButton
                                  key={itemindex}
                                  sx={{
                                    minHeight: 48,
                                    justifyContent: open ? "initial" : "center",
                                    color: isSelected ? "#4097FF" : "",
                                    marginLeft: isSelected ? "-5px" : "",
                                  }}
                                  onClick={() =>
                                    handleLinkClick(
                                      itemLogbook.path,
                                      itemLogbook.label,
                                      itemLogbook.item,
                                    )
                                  }
                                >
                                  {/* Logbook icon */}
                                  <Link
                                    href={itemLogbook.path}
                                    style={{
                                      textDecoration: "none",
                                      color: "black",
                                    }}
                                    onClick={(event) => {
                                      event.preventDefault();
                                    }}
                                  >
                                    <ListItemIcon
                                      sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        color: isSelected ? "#4097FF" : "",
                                      }}
                                    >
                                      <FontAwesomeIcon
                                        color="white"
                                        icon="fa-solid fa-file-lines"
                                      />
                                    </ListItemIcon>
                                  </Link>
                                  {/* Logbook label */}
                                  {open ? (
                                    <Link
                                      href={itemLogbook.path}
                                      style={{
                                        textDecoration: "none",
                                        color: "black",
                                      }}
                                      onClick={(event) => {
                                        event.preventDefault();
                                      }}
                                    >
                                      <ListItemText
                                        primary={itemLogbook.label}
                                        sx={{
                                          opacity: open ? 1 : 0,
                                          whiteSpace: open
                                            ? "pre-wrap"
                                            : "none",
                                          color: "#ffffffe8",
                                        }}
                                      />
                                    </Link>
                                  ) : (
                                    <ListItemText
                                      primary={itemLogbook.label}
                                      sx={{
                                        opacity: open ? 1 : 0,
                                        whiteSpace: open ? "pre-wrap" : "none",
                                      }}
                                    />
                                  )}
                                </ListItemButton>
                                {/* </a> */}
                              </Tooltip>
                            </ListItem>
                          </>
                        );
                      })}
                  </List>
                )}
              </>
            ) : (
              <>
                <Spin
                  indicator={<LoadingOutlined spin />}
                  style={{ padding: "1rem 1rem 1rem 1rem" }}
                />
              </>
            )}
            {/* Divider */}
            <Divider />

            {/* Fixed section at the bottom of the drawer */}
            <div
              className="fixedSection"
              style={{
                position: "sticky",
                bottom: "0",
                left: "0",
                marginTop: "auto",
                background:
                  subscriptionStatus === 2 || subscriptionStatus === 3
                    ? "rgb(90, 7, 7)"
                    : "#263238",
                zIndex: "+1",
              }}
            >
              {/* User profile and logout button */}
              <div>
                {/* Divider */}
                <Divider sx={{ borderColor: "#ffffff30" }} />
                {/* User profile button */}
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                  }}
                  onClick={handleMenuClick}
                >
                  {/* User avatar */}
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Tooltip
                      title={
                        <div style={{ display: "grid", gap: "8px" }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <PersonIcon sx={{ fontSize: "1.2rem" }} />
                            <Typography sx={{ fontSize: "0.9rem" }}>
                              {newCurrentUser}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <AccountBoxIcon sx={{ fontSize: "1.2rem" }} />
                            <Typography sx={{ fontSize: "0.9rem" }}>
                              {tenantId}
                            </Typography>
                          </Box>
                        </div>
                      }
                      placement="right"
                    >
                      <Avatar
                        sx={{
                          width: 35,
                          height: 35,
                          fontSize: "0.9rem",
                          background: "#4097FF",
                          color: "white",
                        }}
                      >
                        {convertToInitials(newCurrentUser)}
                      </Avatar>
                    </Tooltip>
                  </ListItemIcon>
                  {/* Logout button */}
                  <ListItemText
                    sx={{
                      opacity: open ? 1 : 0,
                    }}
                    primary={
                      <>
                        <Tooltip title={tenantId} placement="right">
                          <Button
                            disabled={!open}
                            size="small"
                            //startIcon={<LogoutIcon sx={{ color: "##FF4181" }} />}
                            variant="outlined"
                            sx={{
                              border: "1px solid white",
                              color: "white",
                              borderRadius: "1rem",
                              whiteSpace: "pre-line",
                              fontSize: "0.75rem",
                            }}
                          >
                            {newCurrentUser}
                          </Button>
                        </Tooltip>
                      </>
                    }
                  />
                </ListItemButton>
                <Popover
                  open={openMenu}
                  anchorEl={openMenu}
                  onClose={handleCloseMenu}
                  anchorOrigin={{
                    vertical: "center",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "center",
                    horizontal: "left",
                  }}
                  sx={{ marginTop: "1rem", boxShadow: 0 }}
                >
                  {renderUserAndAdmin()}
                </Popover>
              </div>
            </div>

            {canInstall && !isInStandaloneMode() && (
              <Tooltip title="Install App" placement="right">
                <IconButton
                  onClick={handleInstall}
                  color="inherit"
                  aria-label="open drawer"
                >
                  <InstallDesktopIcon
                    sx={{
                      color: "#fff",
                      background: "#36444a",
                      padding: "0.2rem",
                      borderRadius: "50%",
                      width: "1.3em",
                      height: "1.3em",
                    }}
                  />
                </IconButton>
              </Tooltip>
            )}
          </Drawer>
        )}
        {/* Mobile menubar */}
        {(isMobile || isTab) && <MobileMenubar />}

        {/* Main content area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: isMobile ? 2 : 3,
            transition: "margin 0.3s ease-out",
            marginLeft: open ? `${drawerWidth}px` : 0,
          }}
        >
          <DrawerHeader />

          {!resetPage ? children : <></>}
        </Box>
      </Box>
      <Snackbar
        open={snackBarOpen} // Opens the Snackbar when 'open' is true
        // autoHideDuration={3000} // Automatically hides after 3 seconds
        onClose={handleClose} // Function to close the Snackbar
        TransitionComponent={Slide} // Animation when it shows up
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Position of the Snackbar
      >
        <Alert
          onClose={handleClose} // Function to close the alert
          severity={snackbarSeverity} // The type of alert (success, error, etc.)
          variant="filled" // Makes the alert a filled color
          sx={{ width: "100%" }} // Takes full width of the Snackbar
        >
          {snackbarText} {/* The message inside the alert */}
        </Alert>
      </Snackbar>
    </>
  );
}
