import { library } from "@fortawesome/fontawesome-svg-core"; // Import the library function from Font Awesome SVG core
import { fas } from "@fortawesome/free-solid-svg-icons"; // Import the solid icons from Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import the FontAwesomeIcon component for React
import { ExpandLess, ExpandMore } from "@mui/icons-material"; // Import icons for expanding/collapsing elements from Material-UI
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"; // Import the left chevron icon from Material-UI
import ChevronRightIcon from "@mui/icons-material/ChevronRight"; // Import the right chevron icon from Material-UI
import LogoutIcon from "@mui/icons-material/Logout"; // Import the logout icon from Material-UI
import MenuIcon from "@mui/icons-material/Menu"; // Import the menu icon from Material-UI
import {
  Alert,
  Avatar, // Import Avatar component for displaying user images
  Button,
  Chip, // Import Button component for clickable buttons
  Collapse,
  Link,
  MenuItem, // Import Collapse component for expandable content
  Badge as MuiBadge,
  Popover,
  Slide,
  Snackbar,
  TextField, // Import Badge component and alias it as MuiBadge to avoid naming conflicts
  Tooltip, // Import Tooltip component for displaying additional information on hover
  useMediaQuery, // Import hook for handling media queries
} from "@mui/material"; // Import components from Material-UI

import MuiAppBar from "@mui/material/AppBar"; // Import AppBar component for the top navigation bar
import Box from "@mui/material/Box"; // Import Box component for layout and styling
import CssBaseline from "@mui/material/CssBaseline"; // Import CssBaseline for consistent baseline styles
import Divider from "@mui/material/Divider"; // Import Divider component for separating content
import Drawer from "@mui/material/Drawer"; // Import Drawer component for side navigation
import IconButton from "@mui/material/IconButton"; // Import IconButton component for buttons with icons
import List from "@mui/material/List"; // Import List component for displaying lists
import ListItem from "@mui/material/ListItem"; // Import ListItem component for individual list items
import ListItemButton from "@mui/material/ListItemButton"; // Import ListItemButton for clickable list items
import ListItemIcon from "@mui/material/ListItemIcon"; // Import ListItemIcon for icons in list items
import ListItemText from "@mui/material/ListItemText"; // Import ListItemText for text in list items
import { styled, useTheme } from "@mui/material/styles"; // Import styled function and useTheme hook for custom styling
import Toolbar from "@mui/material/Toolbar"; // Import Toolbar component for the app bar's toolbar
import Typography from "@mui/material/Typography"; // Import Typography component for text styling
import { Badge } from "primereact/badge"; // Import Badge component from PrimeReact for additional notifications
import * as React from "react"; // Import React library for building components
import { Container } from "react-bootstrap"; // Import Container component from React Bootstrap for layout
import { useLocation, useNavigate } from "react-router-dom"; // Import hooks for routing in React
import {
  decryptTokenId,
  extendTokenExpiration,
  logout,
} from "../helper/AuthService"; // Import functions for handling authentication
import { allLogbookReportsApi } from "../LogbookReports/LogbookReportsApi"; // Import API functions for logbook reports
import {
  fetchBadgeDetails,
  fetchDashboardDetails,
  //  getCurrentUser , // Commented out import for getting the current user
  getMenuDetails, // Import function for fetching menu details
  // getNotStartedJobsCount, // Import function for counting jobs that have not started
} from "./MenubarAPI"; // Import functions from MenubarAPI module

import { getAllTaskByTenantId } from "../Task/TaskAPI"; // Import function for fetching tasks by tenant ID
import { getCurrentUser } from "../UserModuleUpdated/helper"; // Import function for getting current user details

import { getActivitiesToReview } from "../ActivityReviewer/ActivityReviewerAPI"; // Import function for fetching activities to review
import { fetchJobs } from "../JobPerformer/JobPerformerAPI"; // Import function for fetching jobs for performers
import { fetchJobsToReview } from "../JobReviewer/JobReviewerAPI"; // Import function for fetching jobs to review
import {
  getTenantID,
  getUserDetailsByUserID,
} from "../UserModuleUpdated/UsermoduleApi"; // Import function for fetching user details by user ID
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { EventSourcePolyfill } from "event-source-polyfill";
import { checkTenantExpiration } from "../Tenant/TenantApi";
import { userHasPageAccess } from "./MenubarHelper";

import { initializePWAInstallPrompt, installPWA } from "../pwa/installPrompt";
import InstallMobileIcon from "@mui/icons-material/InstallMobile";
import { isIOS, isInStandaloneMode } from "../pwa/iosInstall";

const REACT_APP_TENANTID = process.env.REACT_APP_TENANTID; // Get tenant ID from environment variables
const REACT_APP_USERID = process.env.REACT_APP_USERID; // Get user ID from environment variables

library.add(fas); // Add solid icons to the Font Awesome library

const drawerWidth = 240; // Define the width of the drawer

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme }) => ({
    // Define the Main component with styles
    flexGrow: 1, // Make the main content take up available space
    padding: theme.spacing(3), // Add padding to the main content
    transition: theme.transitions.create("margin", {
      // Define transition for the main content
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`, // Set the initial margin left for the main content
    variants: [
      {
        props: ({ open }) => open, // Define a variant for when the drawer is open
        style: {
          transition: theme.transitions.create("margin", {
            // Define transition for the main content when the drawer is open
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginLeft: 0, // Set the margin left to 0 when the drawer is open
        },
      },
    ],
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  // Define the AppBar component with styles
  transition: theme.transitions.create(["margin", "width"], {
    // Define transition for the app bar
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open, // Define a variant for when the drawer is open
      style: {
        width: `calc(100% - ${drawerWidth}px)`, // Calculate the width of the app bar when the drawer is open
        marginLeft: `${drawerWidth}px`, // Set the margin left for the app bar when the drawer is open
        transition: theme.transitions.create(["margin", "width"], {
          // Define transition for the app bar when the drawer is open
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  // Define the DrawerHeader component with styles
  display: "flex", // Set the display to flex for the drawer header
  alignItems: "center", // Center the content vertically
  padding: theme.spacing(0, 1), // Add padding to the drawer header
  // necessary for content to be below app bar
  ...theme.mixins.toolbar, // Use the toolbar mixin for consistent styling
  justifyContent: "flex-end", // Justify the content to the end of the drawer header
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const navigate = useNavigate(); //React hook to navigate to a path
  const [open, setOpen] = React.useState(false); //State to open the sidebar
  const [menuJson, SetMenuJson] = React.useState([]); //state to hold the information of the menubar
  const [openedChild, setOpenedChild] = React.useState([]); //state to open a child in the menubar
  const user = localStorage.getItem(REACT_APP_USERID); //constant to hold encrypted userid from session storage
  const tenant = localStorage.getItem(REACT_APP_TENANTID); //constant to hold encrypted tenant from session storage
  const tenantId = decryptTokenId(tenant); //decrypt tenant
  const userid = decryptTokenId(user); //decrypt user
  const [menuShow, setMenuShow] = React.useState(true); //state to show menu in expanded mode
  const [newCurrentUser, setnewCurrentUser] = React.useState(""); //state to show current user
  const [logbookReports, setLogbookReports] = React.useState(null); //state to hold all logbook reports of the current user
  const [filterValue, setFilterValue] = React.useState(""); //state to filter logbook reports of the current user
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [dashboardLogbooks, setDashboardLogbooks] = React.useState(null);
  const [openMenu, setOpenMenu] = React.useState(null);
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

  const [subscriptionStatus, setSubscriptionStatus] = React.useState(0);

  const [canInstall, setCanInstall] = React.useState(false);
  // const [showIOSBanner, setShowIOSBanner] = React.useState(false);

  const [snackbarSeverity, setsnackbarSeverity] = React.useState(""); // snackbarSeverity state variable holds the Severity of a snackbar (success, error, info etc.)
  const [snackbarOpen, setSnackbarOpen] = React.useState(false); // Manages whether the snackbar is visible
  const [snackbarText, setSnackbarText] = React.useState(""); // this state variable shows the text of snackbar

  // Opens the snackbar notification
  const handleClick = () => {
    setSnackbarOpen(true);
  };

  // Closes the snackbar notification
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return; // Prevents snackbar from closing on a click outside
    }
    setSnackbarOpen(false);
  };

  //constant to hold the menu items with different behaviour
  /*
   * function to set the length of all  reports of the current user
   */

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
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

  const renderUserAndAdmin = () => {
    const menuItems = menuJson;

    return (
      <Box
        sx={{
          background:
            subscriptionStatus === 2 || subscriptionStatus === 3
              ? "rgb(117, 9, 9)"
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

  const formatDate = (date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const fetchStatus = async () => {
    try {
      const { status } = await checkTenantExpiration(
        decryptTokenId(localStorage.getItem(process.env.REACT_APP_TENANTID)),
      );

      if (status === 3) {
        setSubscriptionStatus(3);
      } else if (status === 2) {
        setSubscriptionStatus(2);
      } else {
        setSubscriptionStatus(1);
      }
    } catch (error) {}
  };

  //UseEffects
  React.useEffect(() => {
    fetchStatus();
    //Functions called in useeffects
    fetchData();
    fetchDataFromSSE();
    fetchUserDetailsByUserId();
  }, []);
  // React.useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchData();
  //   fetchActivitiesCount();
  //   taskreviewcount();
  //   activityreviewercount()
  //   jobreviewercount()
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  React.useEffect(() => {
    // if (isIOS() && !isInStandaloneMode()) {
    //   setShowIOSBanner(true);
    // }

    const isStandalone =
      window.navigator.standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches;

    if (isStandalone) {
      setCanInstall(false);
      // setShowIOSBanner(false);
      return;
    }

    initializePWAInstallPrompt(setCanInstall);
  }, []);

  const handleInstall = async () => {
    console.log("handleInstall called");
    if (isIOS()) {
      // setShowIOSBanner(true);
      handleClick();
      setSnackbarText("To install: tap Share → Add to Home Screen");
      setsnackbarSeverity("error");
      // setSnackbarText("To install: tap <strong>Share</strong>{" "} → <strong>Add to Home Screen</strong>");
      return;
    }
    await installPWA();
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
    //     console.log("Received data from SSE: ", receivedData);
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

  /**
   *
   * Function to fetch user details of current user
   */
  const fetchUserDetailsByUserId = async () => {
    // const user = localStorage.getItem(process.env.REACT_APP_USERID);
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
  //Fetch user's group based on current user
  const fetchUserGroup = async () => {
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
    // let groups = responseUserGroupName?.data;
    let userGroupList = performer?.concat(
      ",",

      groups,
    );
    return userGroupList;
  };

  /**
   *
   * Function to set data for the menubar
   */
  const fetchData = async () => {
    try {
      const menuData = await getMenuDetails(); //Function which fetch data for the menubar using api call

      SetMenuJson(menuData.items); //sets the data into the state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Function to handle link click
  // Function to handle link click
  const handleLinkClick = async (path, label, item) => {
    setAnchorEl(null);
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
      if (path === window.location.pathname)
        navigate(0); //Navigates to the respective page
      else navigate(path); //Navigates to the respective pge
      setMenuShow(true);
      setOpenMenu(false); //Closes the menu which opens on username click
      setOpen(false); //closes the sidebar
      extendTokenExpiration(); //extend token whenever user visits a new page
    } else if (label === "Logbook Dashboard") {
      console.log("Logbook dashboard");
      const allDashboardLogbooks = await fetchDashboardDetails();
      if (!(allDashboardLogbooks?.length > 0)) setDashboardLogbooks([]);
      console.log("All dashboard logbooks", allDashboardLogbooks);
      setDashboardLogbooks(
        allDashboardLogbooks?.map((logbook) => ({
          label: logbook?.formname,
          path:
            menusWithModification.dashboardLogbook +
            logbook?.formname +
            "?version=" +
            logbook?.versionNumber,
          item: "Logbook Dashboard",
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
                      setOpenedChild([]);
                    }}
                  >
                    <ExpandLess />
                  </ListItemButton>
                ) : (
                  // If the item is not opened, render a button to open it
                  <ListItemButton
                    onClick={() => {
                      setOpenedChild([...openedChild, item]);
                    }}
                  >
                    <ExpandMore />
                  </ListItemButton>
                ))}
              {/* // Render a tooltip with the item label */}
              <Tooltip placement="right" title={item.label}>
                {/* // Render a ListItemButton with a custom style */}
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    color: isSelected ? "#4097FF" : "",
                    marginLeft: isSelected ? "-5px" : "",
                  }}
                  // Handle click event to navigate to the item's path
                  onClick={() =>
                    handleLinkClick(item.path, item.label, item.item)
                  }
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
                      }}
                    >
                      {/* // Render a FontAwesomeIcon with a badge based on the item label */}
                      {item.path === menusWithModification.performer ? (
                        <MuiBadge
                          badgeContent={badgeDetails?.activitiesToPerformCount}
                          color="info"
                        >
                          <FontAwesomeIcon color="white" icon={item.logo} />
                        </MuiBadge>
                      ) : item.path === menusWithModification.reports ? (
                        <MuiBadge
                          badgeContent={badgeDetails?.reportsCount}
                          color="info"
                        >
                          <FontAwesomeIcon color="white" icon={item.logo} />
                        </MuiBadge>
                      ) : item.path === menusWithModification.taskReviewer ? (
                        <MuiBadge
                          badgeContent={badgeDetails?.tasksToReviewCount}
                          color="info"
                        >
                          <FontAwesomeIcon color="white" icon={item.logo} />
                        </MuiBadge>
                      ) : item.path ===
                        menusWithModification.activityReviewer ? (
                        <MuiBadge
                          badgeContent={badgeDetails?.activitiesToReviewCount}
                          color="info"
                        >
                          <FontAwesomeIcon color="white" icon={item.logo} />
                        </MuiBadge>
                      ) : item.path === menusWithModification.jobReviewer ? (
                        <MuiBadge
                          badgeContent={badgeDetails?.jobsToReviewCount}
                          color="info"
                        >
                          <FontAwesomeIcon color="white" icon={item.logo} />
                        </MuiBadge>
                      ) : (
                        <FontAwesomeIcon color="white" icon={item.logo} />
                      )}
                    </ListItemIcon>
                  )}
                  {/* // Render a ListItemText with a custom style */}
                  <ListItemText
                    primary={
                      // Check if the item label is one of the special cases

                      <Typography sx={{ color: "#ffffffe8" }}>
                        {item.label}
                      </Typography>
                    }
                    sx={{ opacity: open ? 1 : 0 }}
                  />
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
        )
      );
    });
  };
  //Function to expand the sidebar
  const handleDrawerOpen = () => {
    setOpen(true);
    setMenuShow(false);
  };

  const filteredLogbookreports = logbookReports?.filter((row) =>
    row?.label?.toLowerCase().includes(filterValue?.toLowerCase()),
  ); //filter the rows based on the input value
  //Function to contract the sidebar
  //Logbook dashboard filtered based on search keywords
  const filteredlogbookdashboard = dashboardLogbooks?.filter((row) =>
    row?.label?.toLowerCase().includes(filterValue?.toLowerCase()),
  ); //filter the rows based on the input value

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

  return (
    // Container box with flex display and fixed height
    <Box sx={{ display: "flex", height: "3rem" }}>
      <CssBaseline />
      {/* // App bar with fixed position and conditional styles based on 'open' state */}

      <AppBar
        position="fixed"
        open={open}
        sx={{
          background:
            subscriptionStatus === 2 || subscriptionStatus === 3
              ? "rgb(117, 9, 9)"
              : "#263238",
          boxShadow:
            "box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;",
        }}
      >
        <Toolbar>
          {/* // Drawer toggle button with conditional display based on 'open' state */}
          <IconButton
            color="primary"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                mr: 1,
              },
              open && { display: "none" },
            ]}
          >
            {menuShow && <MenuIcon sx={{ color: "white" }} />}
          </IconButton>
          {/* // App title with custom styles */}
          {!open && (
            <Typography
              sx={{
                fontSize: "0.6rem",
                background: "#e1f5fe2e",
                padding: "5px 10px",
                borderRadius: "2rem",
              }}
              variant="h6"
              noWrap
              component="div"
            >
              Operations 360
            </Typography>
          )}
          {/* // User avatar with tooltip and conditional styles */}
          <Avatar
            sx={{
              width: 28,
              height: 28,
              fontSize: "0.75rem",
              background: "#e1f5fe2e",
              color: "white",
              marginLeft: "auto",
              //marginTop:"auto"
            }}
          >
            {convertToInitials(newCurrentUser)}
          </Avatar>
          <IconButton onClick={handleAvatarClick}>
            <MoreVertIcon sx={{ color: "white" }} />
          </IconButton>
          {/* <Tooltip title="Install App">
            <IconButton
              onClick={handleInstall}
              color="inherit"
              aria-label="open drawer"
            >
              <InstallMobileIcon
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
          </Tooltip> */}

          {/* Install button — only show when available */}
          {(canInstall || (isIOS() && !isInStandaloneMode())) &&
            !isInStandaloneMode() && (
              <Tooltip title="Install App">
                <IconButton
                  onClick={handleInstall}
                  color="inherit"
                  aria-label="install app"
                >
                  <InstallMobileIcon
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

          <Popover
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            sx={{ marginTop: "0rem", marginLeft: "1rem", boxShadow: 0 }}
          >
            {renderUserAndAdmin()}
          </Popover>
          {/* // Logout button with conditional styles and click handler */}
          {/* <Button
            // disabled={!open}
            size="small"
            onClick={() => {
              handleLogout();
              navigate("/");
            }}
            startIcon={<LogoutIcon />}
            // variant="outlined"
            color="error"
          ></Button> */}
        </Toolbar>
      </AppBar>
      {/* // Drawer component with conditional styles and content */}
      <Drawer
        sx={{
          //background: "#263238",
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background:
              subscriptionStatus === 2 || subscriptionStatus === 3
                ? "rgb(117, 9, 9)"
                : "#263238",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
        //className="muiMeunuBarZIndex"
      >
        <DrawerHeader
          sx={{
            background:
              subscriptionStatus === 2 || subscriptionStatus === 3
                ? "rgb(117, 9, 9)"
                : "#263238",
            borderRight: "1px solid #646464",
          }}
        >
          {/* // Drawer close button with conditional icon based on direction */}
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon sx={{ color: "white" }} />
            ) : (
              <ChevronRightIcon sx={{ color: "white" }} />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider sx={{ borderColor: "#646464" }} />
        {/* // List of menu items with conditional rendering based on 'menuJson' and 'logbookReports' states */}
        <List
          sx={{
            background:
              subscriptionStatus === 2 || subscriptionStatus === 3
                ? "rgb(117, 9, 9)"
                : "#263238 !important",
          }}
        >
          {menuJson &&
            logbookReports === null &&
            dashboardLogbooks === null &&
            renderTree(menuJson)}
        </List>
        {logbookReports && (
          <List
            sx={{
              background:
                subscriptionStatus === 2 || subscriptionStatus === 3
                  ? "rgb(117, 9, 9)"
                  : "#263238 !important",
            }}
          >
            {logbookReports && (
              <Button
                onClick={() => {
                  setLogbookReports(null);
                }}
              >
                <i class="fa fa-arrow-left" aria-hidden="true"></i>
              </Button>
            )}
            {/* Logbook report items */}
            {logbookReports && open && logbookReports?.length > 0 && (
              <TextField
                size="small"
                sx={{ margin: "0.5rem" }}
                InputProps={{ style: { color: "white" } }}
                label="Search Reports"
                value={filterValue}
                onChange={(event) => setFilterValue(event.target.value)}
                id="custom-css-outlined-input"
              />
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
                  <ListItem
                    sx={{
                      borderLeft: isSelected ? " 5px solid #4097FF" : "none",
                      background: isSelected ? "#e9eff7" : "inherit",
                    }}
                  >
                    <Tooltip placement="right" title={itemLogbook.label}>
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
                        <ListItemText
                          primary={itemLogbook.label}
                          sx={{ opacity: open ? 1 : 0, color: "white" }}
                        />
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>
                );
              })}
          </List>
        )}
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
            {dashboardLogbooks && open && dashboardLogbooks?.length > 0 && (
              <>
                <CssTextField
                  size="small"
                  sx={{ margin: "0.5rem" }}
                  InputProps={{ style: { color: "white" } }}
                  label="Search Logbook"
                  onChange={(event) => setFilterValue(event.target.value)}
                  id="custom-css-outlined-input"
                />
              </>
            )}
            {dashboardLogbooks && !dashboardLogbooks?.length > 0 && open && (
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
                const isSelected = selectedLogbook === itemLogbook.label;
                return (
                  <>
                    <ListItem
                      sx={{
                        borderLeft: isSelected ? " 5px solid #4097FF" : "none",
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
                                  whiteSpace: open ? "pre-wrap" : "none",
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
      </Drawer>
      {/* // Main content area with conditional padding based on mobile device */}
      <Main open={open} sx={{ flexGrow: 1, p: isMobile ? 2 : 3 }}>
        <DrawerHeader />
      </Main>

      {/* iOS install banner — render just inside <AppBar> before <Toolbar>
      {showIOSBanner && (
        <div
          style={{
            background: "#1e3a4f",
            color: "#fff",
            padding: "6px 16px",
            textAlign: "center",
            fontSize: "0.8rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <span>
            To install: tap <strong>Share</strong> →{" "}
            <strong>Add to Home Screen</strong>
          </span>
          <button
            onClick={() => setShowIOSBanner(false)}
            style={{
              background: "transparent",
              border: "1px solid #fff",
              color: "#fff",
              borderRadius: 4,
              padding: "1px 7px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      )} */}

      <Snackbar
        open={snackbarOpen} // Opens the Snackbar when 'open' is true
        autoHideDuration={3000} // Automatically hides after 3 seconds
        onClose={handleClose} // Function to close the Snackbar
        TransitionComponent={Slide} // Animation when it shows up
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Position of the Snackbar
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
    </Box>
  );
}
