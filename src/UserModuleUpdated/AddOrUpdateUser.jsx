// MUI Icons
import AddCircleIcon from "@mui/icons-material/AddCircle"; // Icon for adding a new item
import CancelIcon from "@mui/icons-material/Cancel"; // Icon for cancel action
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"; // Icon for confirming success
import DeleteIcon from "@mui/icons-material/Delete"; // Icon for deleting an item
import HomeIcon from "@mui/icons-material/Home"; // Icon for home/navigation
import MergeIcon from "@mui/icons-material/Merge"; // Icon for merging items
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar"; // Icon for contacts or calendar actions
import ReplayIcon from "@mui/icons-material/Replay"; // Icon for replay/refresh actions
import SaveIcon from "@mui/icons-material/Save"; // Icon for save action
import SecurityIcon from "@mui/icons-material/Security"; // Icon for security or permission-related actions

// MUI Tabs and TabContext
import TabContext from "@mui/lab/TabContext"; // Context component to manage tabbed interfaces
import TabList from "@mui/lab/TabList"; // Component to create a list of tabs
import TabPanel from "@mui/lab/TabPanel"; // Component to display tab content
import { LoadingOutlined } from '@ant-design/icons';

// MUI Components
import {
  Button, // General button component
  Card, // Card component for content display
  Chip, // Chip component for small information or status indicators
  Container, // Layout container with padding and margin
  Divider, // Divider line to separate content
  Grid, // Grid system for layout
  IconButton, // Button with an icon
  Tooltip, // Tooltip for providing additional information on hover
  Typography, // Typography component for text
  useMediaQuery, // Hook to apply styles based on media queries
  useTheme, // Hook to access the current theme settings
} from "@mui/material";

import Box from "@mui/material/Box"; // Box component for layout and styling
import Tab from "@mui/material/Tab"; // Tab component for navigation

import dayjs from "dayjs"; // Library for handling date and time

// PrimeReact Components
import { Button as PrimeReactButton } from "primereact/button"; // PrimeReact button component
import { Column } from "primereact/column"; // PrimeReact column for data tables
import { DataTable } from "primereact/datatable"; // PrimeReact DataTable for displaying data
import { Dialog } from "primereact/dialog"; // PrimeReact dialog component for modals
import { Dropdown } from "primereact/dropdown"; // PrimeReact dropdown component for selection
import { FloatLabel } from "primereact/floatlabel"; // PrimeReact float label for input fields
import { InputNumber } from "primereact/inputnumber"; // PrimeReact component for number input
import { InputText } from "primereact/inputtext"; // PrimeReact component for text input
import { ListBox } from "primereact/listbox"; // PrimeReact ListBox component for selection
import { MultiSelect } from "primereact/multiselect"; // PrimeReact MultiSelect for multiple selections
import { ProgressBar } from "primereact/progressbar"; // PrimeReact progress bar component for progress indicators
import { ToggleButton } from "primereact/togglebutton"; // PrimeReact toggle button component

// React and React Router Hooks
import * as React from "react"; // Import all React functionality
import { useEffect, useState } from "react"; // React hooks for state and side-effects
import { useLocation, useNavigate } from "react-router-dom"; // React Router hooks for navigation and location tracking

// Custom Components
import CustomDialog from "../components/shared/confirmationDialog/dialog.component"; // Custom dialog component for confirmation dialogs
import SnackbarComponent from "../components/shared/snackbar/customSnackbar"; // Custom Snackbar component for notifications

// Helper functions for authentication and session management
import { decryptTokenId, extendTokenExpiration } from "../helper/AuthService";

// Functions for creating entities like departments, groups, and users
import { createDepartment, createGroup, createUser, getCurrentUser } from "./helper";

// UserModule API functions
import {
  checkDepartmentAssociation, // Function to check if a department has associations
  checkGroupAssociation, // Function to check if a group has associations
  deleteDepartmentById, // Function to delete a department by its ID
  deleteGroupById, // Function to delete a group by its ID
  fetchAllPageDetailsMap, // Function to fetch details for all pages
  fetchAllUsers, // Function to fetch all users
  getAllDepartmentDetails, // Function to retrieve all department details
  getAllGroupDetails, // Function to retrieve all group details
  getUserDetailsByUserID, // Function to retrieve user details by user ID
  saveMergedGroups, // Function to save merged groups
  saveNewDepartment, // Function to save a new department
  saveNewGroup, // Function to save a new group
  saveUser, // Function to save a user
  updateDepartmentDetails, // Function to update department details
  updateGroupDetails, // Function to update group details
} from "./UsermoduleApi";

import ContactPageIcon from "@mui/icons-material/ContactPage";
import VerifiedIcon from "@mui/icons-material/Verified";
import { fetchAllotedPagesByUserId } from "../CommonAPI";
import useFilteredData from "./useFilteredData";
import { Spin, TimePicker } from "antd";
import RecommendIcon from '@mui/icons-material/Recommend';
import GroupLeaderDropdown from "./GroupLeader";
import { Checkbox } from 'antd';
import { Calendar } from "primereact/calendar";
import PersonPinIcon from '@mui/icons-material/PersonPin';
import { formatDatetime } from "../JobAssign/helper";
// import IconButton from '@mui/material/IconButton';
const defaultWorkingHours=[
        dayjs("10:00", "HH:mm"),
        dayjs("18:00", "HH:mm")
      ]
const SQL_TIMEFORMAT="YYYY-MM-DD HH:mm:ss.SSS"
export default function AddOrUpdateUser() {
  const [tabValue, setTabValue] = React.useState("1"); // State for managing the current tab value
  // const [allGroups,setAllGroups]=useState([]) // Commented out state for all groups
  const [allDepartments, setAllDepartments] = useState([]); // State for storing all departments
  const [allGroupMap, setAllGroupMap] = useState([]); // State for storing mapped group data
  //  const [allDepartmentMap,setAllDepartmentMap]=useState([]) // Commented out state for department map
  const [newGroup, setNewGroup] = useState(createGroup()); // State for storing a new group object
  const [newDepartment, setNewDepartment] = useState(createDepartment()); // State for storing a new department object
  //this is used while updating group or department
  // const [updateGroupValue,setUpdateGroupValue]=useState('') // Commented out state for updating group
  // const [updateDepartmentValue,setUpdateDepartmentValue]=useState('') // Commented out state for updating department
  const [allUsers, setAllUsers] = useState([]); // State for storing all users
  const [tabValidations, setTabValidations] = useState(false); // State for managing tab validation checks

  const [editMode, setEditMode] = useState(true); // State for toggling edit mode

  const [selectedGroups, setSelectedGroups] = useState([]); // State for storing selected groups
  const [isMergeGroupActive, setIsMergeGroupActive] = useState(false); // State for tracking if group merge functionality is active

  //** For Merge Dialog */
  const [mergeGroupDialogActive, setMergeGroupDialogActive] = useState(false); // State for managing the visibility of the merge group dialog
  const [mergeGroupDetails, setMergeGroupDetails] = useState(
    createGroup("", "", "", "", true, "")
  ); // State for storing the details of the group to be merged
  const [selectedGroupUsersList, setSelectedGroupUsersList] = useState([]); // State for storing the list of users from the selected group
  const [selectedUsersToMerge, setSelectedUsersToMerge] = useState([]); // State for storing users selected to be merged

  const [confirmDialog, setConfirmDialog] = useState(false); // State for managing the confirmation dialog visibility

  const [dataAlreadyExists, setDataAlreadyExists] = useState({
    userID: false,
    group: false,
    department: false,
  }); // State for checking if data (userID, group, department) already exists

  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for controlling snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(""); // State for setting snackbar message content
  const [snackbarSeverity, setSnackbarSeverity] = useState(""); // State for setting the severity level of the snackbar (info, success, error)

  const [isGroupOrDepartmentEdit, setIsGroupOrDepartmentEdit] = useState(0); // State to track if the current edit is for a group (1) or department (2)
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for managing whether a dialog is open
  const location = useLocation(); // Hook to get the current location object
  const env_userId = process.env.REACT_APP_USERID; // Environment variable for user ID
  const env_tenantId = process.env.REACT_APP_TENANTID; // Environment variable for tenant ID
  const user = localStorage.getItem(env_userId); // Fetching the user ID from session storage
  const current_Admin = decryptTokenId(user); // Decrypting the current user ID
  const currentDate = dayjs().format(SQL_TIMEFORMAT); // Getting the current date in the specified format
  // const passwordExpiryDate = dayjs().add(90, 'day').format('YYYY-MM-DD HH:mm:ss.SSS'); // Commented out password expiry date calculation
  const encryptedTenant = localStorage.getItem(env_tenantId); // Fetching the tenant ID from session storage
  const tenant = decryptTokenId(encryptedTenant); // Decrypting the tenant ID
  const navigate = useNavigate(); // Hook to navigate between routes

  // const [globalFilter, setGlobalFilter] = useState(null); // State for managing the global filter in tables
  const theme = useTheme(); // Hook to access the current theme
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Hook to determine if the current screen size matches mobile dimensions

  //This two states are used for the search functionality
  const [groupOrDepartmentData,setGroupOrDepartmentData]=useState([])
  const { filteredSearchData, searchQuery, setSearchQuery } = useFilteredData(groupOrDepartmentData);
  const [ loading ,setLoading ] = useState(false);

  const [workingHours, setWorkingHours] = useState(defaultWorkingHours); // State for storing the working hours range

  const guestPages=["Self Job Creation","Performer"]

  const workingHoursDifference = 8; // Default working hours difference in hours


  const [userDetails, setUserDetails] = useState(
    createUser(
      "",
      "",
      "user_123",
      "",
      "",
      "",
      false,
      true,
      currentDate,
      currentDate, //! this is done when a new user is created
      current_Admin,
      null,
      "",
      true,
      90,
      null,
      null,
      tenant,
      [],
      [],
      [],
      [],
      [],
      []
    )
  ); // State for storing the user details

  /**
   * Initializes the component with a default user object and fetches all relevant data such as group and department details, and all page details.
   * If a user is passed through location state, it is used to populate the user details.
   * The user details are then processed to include the department and group details, and to fetch all page details and update the user object.
   * The user details are then set to the state.
   */
  const init = async () => {
    // console.log("Current Admin : ", current_Admin);
    // console.log("Current Tenant : ", tenant);
    // console.log("Current Date : ", currentDate);
    // console.log('Password Expiry Date : ',passwordExpiryDate)
    await extendTokenExpiration();

    // Initialize a default user object
    let current_user = createUser({
      userID: "",
      userName: "",
      password: "user_123",
      phone: "",
      g360HomePage: "",
      workFlowHomePage: "",
      g360Admin: false,
      active: true,
      createdOn: currentDate,
      modifiedOn: null, // This is set when a new user is created
      createdBy: current_Admin,
      modifiedBy: null,
      department: "",
      firstLoginRequired: true,
      passwordExpiryDuration: 90,
      passwordExpiryDate: null,
      lastLogIn: null,
      tenantId: tenant,
      group: [],
      allotedPages: [],
      g360AllottedPageList: [],
      //by default My Profile page is added
      workflowAllottedPageList: [{
        aliasName: "My Profile",
        page: "My Profile",
        pageLogo: "fa-solid fa-address-card",
        pageUrl: "/workflow/userprofile",
        sequence: "15",
        source: "Workflow",
        tenantId: null
      }
      ],
      allG360PageList: new Set(),
      allWorkflowPageList: new Set(),
      isGuest: false,
      guestValidity: [new Date(), new Date()],
    });

    // console.log("Current User", current_user);

    // If user data is passed through location state, use it
    if (location.state) {
      const data = location.state; // On row click, the user data will be populated, else default state
      // console.log("Data from State : ", location.state);
      let updatedUser = { ...data };
      delete updatedUser.avatarBgColor;
      console.log('Before Adding guestValidity : ',data)

      const newGuestValidity =  [new Date(), new Date(new Date().setDate(new Date().getDate() + 1))]
      updatedUser.guestValidity= data?.isGuest ?[new Date(updatedUser.guestStart?? new Date()),new Date(updatedUser.guestStop?? newGuestValidity[1])] : newGuestValidity // if the user is guest then the guest validity will be taken from the data else it will be set to 1 day from current date;

      current_user = updatedUser;
    }

    const groupDetails = await getAllGroupDetails(); //* fetching allGroup Details
    const departmentDetails = await getAllDepartmentDetails(); //* fetching all department details
    // console.log("Department Details : ", departmentDetails);
    // console.log("Group Details : ", groupDetails);
    const copyUserDetails = { ...current_user }; //* creating a copy of user

    // Process department details
    if (departmentDetails) {
      // const allDepartments = [];
      // setAllDepartmentMap(departmentDetails);

      // departmentDetails.forEach((data) => {
      //   allDepartments.push(data.deptName);
      // });
      // setAllDepartments(allDepartments);

      const foundDepartment = departmentDetails.find(
        (dept) => dept?.deptID?.trim() === copyUserDetails.department //* if the department ID for the current user is found , inject that department into the object
      );
      if (foundDepartment) {
        copyUserDetails.department = foundDepartment;
      }
      setAllDepartments(departmentDetails);
    }

    // Process group details
    if (groupDetails) {
      setAllGroupMap(groupDetails); //* store all the details of the group
    }

    // Fetch all page details and update user object
    const allPages = await fetchAllPageDetailsMap(); //* fetching All Pages details in Map and injecting the data into the copied user
    if (allPages) {
      copyUserDetails.allWorkflowPageList = Array.from(allPages.Op360 || []);
      copyUserDetails.allG360PageList = Array.from(allPages.G360 || []);
    }
    // console.log("Final UserDetails before Edit : ", copyUserDetails);
    if (!location.state) {
      copyUserDetails.department = new createDepartment("", "", tenant); //if the user is new then a new department object will be injected
    }
    copyUserDetails.department =
      copyUserDetails.department ?? createDepartment("", "", tenant);
      console.log('Working Hours : ',copyUserDetails?.workingHours?.split("-"));
      if (copyUserDetails?.workingHours?.split("-")) {
        const [start, end] = copyUserDetails?.workingHours?.split("-");

        const workingHours = [dayjs(start, "HH:mm"), dayjs(end, "HH:mm")];

        console.log("Splitted Working Hours  : ", workingHours);

        setWorkingHours(workingHours);
      }
      else
      {
        setWorkingHours(defaultWorkingHours)
      }

    // Finalize and set the user details
    console.log("Final User Details : ",copyUserDetails)
    setUserDetails(copyUserDetails); //*finally setting the new user with all the initial properties
  };

  /**
   * Retrieves all users from the User Module database.
   * The API request is made using Axios and the data is returned as a promise.
   * If there is an error, it is logged and the function returns null.
   * @returns {Promise<Object[]>} A promise that resolves to an array of user objects.
   * The user objects contain the following properties:
   * - userId: The unique identifier of the user.
   * - firstName: The first name of the user.
   * - lastName: The last name of the user.
   * - email: The email address of the user.
   * - departmentId: The department ID of the user.
   * - departmentName: The department name of the user.
   * - groupIds: An array of group IDs the user belongs to.
   * - groupName: An array of group names the user belongs to.
   * - allotedPages: An array of page IDs the user has access to.
   */
  const getAllUsers = async () => {
    // console.log("getAllUsers()");
    const userList = await fetchAllUsers();
    // console.log("User List from API : ", userList);
    if (userList) {
      setAllUsers(userList);
    }
  };

  //useEffect to getAllUsers() data and calling the init() function to initialize a user
  useEffect(() => {
    init();
    getAllUsers();
    userHasAdminAccess();//This is necessary to keep track of the user's access to the Admin page
    // getAllCurrentDepartments();
  }, []);


   /**
   ** Checks if the user has access to the current page based on the pages they
   * *are allowed to access, and navigates to the restricted page if they don't.
   * since this is just a component that is visible only when the user is clicking the 'Add user' button,
   *  so the user will be navigated to the restricted page if the user doesn't have access to this page
   */
   const userHasAdminAccess = async () => {
    // console.log("userHasPageAccess() called ");
    const allotedPages = await fetchAllotedPagesByUserId(); //fetch the privilege of pages which the current user has access to
    if (allotedPages) {
      const parent_path = "/workflow/admin"; // the parent path i.e parent URL
      const index = allotedPages.findIndex(
        //the index of the page is  fetched from the array
        (data) => data.toLowerCase() === parent_path
      );
      console.log('Index ? ',index)
      if (index === -1) {
        //if the  index  is not found then it will be -1, then the user will be navigated to '/restricted'
        navigate("/restricted");
      }
    }
  };


  /**
   * Validates the user details on the first tab.
   *
   * This function performs the following checks:
   * - Ensures the user ID and user name are not empty.
   * - If a phone number is provided, it must contain exactly 10 digits.
   * - Checks that a department and group are selected.
   * - Ensures the department and group arrays are not empty.
   * - Validates the format of the user ID as an email.
   *
   * @returns {boolean} Returns `true` if all validations pass, otherwise `false`.
   */
  const checkTabVablidationsforFirstTab = () => {
    // console.log("checkTabVablidationsforFirstTab() called");
    // console.log("Current User Details : ", userDetails);
    // console.log("Current Group : ", userDetails?.department?.length);

  if (
      userDetails.userID.length === 0 ||
      userDetails.userName.length === 0 ||
      (userDetails.phone &&
        userDetails.phone.toString().length > 0 &&
        userDetails.phone.toString().length !== 10) || //if the phone number is given then it must contain 10 digits or no digit at all
      !userDetails.department ||
      !userDetails.group ||
      userDetails.group.length === 0 ||
      userDetails.department.length === 0 ||
      !validateEmail(userDetails.userID) ||
      (userDetails?.department?.deptID?.length === 0)||
     (userDetails?.isGuest &&
(!userDetails?.guestValidity?.[0] || !userDetails?.guestValidity?.[1]))
      )
    {
      return false;
    }
    return true;
  };


  const filterIfGuestUser=() => { 
    console.log('filterIfGuest ',userDetails)
    if(userDetails.isGuest)
    {
      const updatedUser={...userDetails,allotedPages: userDetails.allotedPages.filter((item) => guestPages.includes(item.page))}
      console.log('Updated user for Guest : ',updatedUser)
      setUserDetails(updatedUser)
    }
   }
  /**
   * Handles the change event when the user navigates between tabs.
   *
   * This function first calls `setTabValidations(false)` to reset the tab validation state.
   * It then checks if the user is trying to navigate to the next tab.
   * If the user is on the first tab and has entered a user ID, it checks if the user ID already exists in the database.
   * If it does, it displays an error message.
   * If the user is on the last tab and has not selected a homepage, it also displays an error message.
   * If the user has not filled in all the required fields, it displays an error message and prevents the user from navigating to the next tab.
   * Otherwise, it sets the tab value to the next tab and allows the user to navigate.
   */
  const handleChange = async (event, newValue) => {
    setTabValidations(false);

    const currentTab = parseInt(tabValue);
    // if(validTab1)
    // {
    const nextTab = currentTab + 1;

    if (
      currentTab === 1 &&
      userDetails.userID.length !== 0 &&
      !location.state?.userID //* validate the user
    ) {
      // console.log("Entered for User Check ! ");
      // const allUsers = await fetchAllUsers();
      const userExists = allUsers.find(
        (data) => data.userID.toLowerCase() === userDetails.userID.toLowerCase()
      ); //* find if there any user exists with the same Id
      if (userExists) {
        const dataFound = { ...dataAlreadyExists, userID: true };
        setDataAlreadyExists(dataFound);
        setSnackbarSeverity("error");
        setSnackbarMessage("User ID already exists !");
        setSnackbarOpen(true);
        return;
      }
    }

    //otherwise reset

    const dataFound = { ...dataAlreadyExists, userID: false };
    setDataAlreadyExists(dataFound);
    const hasDataExistsTrueProperty = Object.values(dataFound).some(
      (value) => value === true
    ); //* find that any Object values consists of true property

    const validTab1 = checkTabVablidationsforFirstTab(); //* checking validations for the first tab
    // console.log("Tab 1 was valid ? ", validTab1);
    console.log("Current User Details : ", userDetails);

    // the user has assigned some pages to the user but not selected the homepage in that case an alert will be shown
    if (
      currentTab === 4 &&
      userDetails.workFlowHomePage === "" &&
      userDetails.allotedPages.length > 0
    ) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Select a Homepage !");
      setSnackbarOpen(true);
      // filterIfGuestUser()
      return;
    }

    if (validTab1 && !hasDataExistsTrueProperty) {
      // if all the validations are matched go to the next tab
      setTabValue(nextTab.toString());
    } else {
      //* else show on which fields the error is there as well as alert
      setTabValidations(true);
      setSnackbarSeverity("error");
      setSnackbarMessage("Fill the required data !");
      setSnackbarOpen(true);
      return;
    }

    filterIfGuestUser();
    // console.log("Previous Tab : ", currentTab);
    setTabValue(nextTab.toString()); //* by default go to the next tab
    // return;
    // }
    // }
  };

  /**
   * Handles input change event for user ID input field.
   * Updates the user ID in the state.
   * @param {React.SyntheticEvent} e - The event object.
   */
  const handleInputChange = (e) => {
    const { value } = e.target;
    setUserDetails((prevState) => ({
      ...prevState,
      userID: value,
    }));
  };

  /**
   * Handles the back button click.
   * If the current tab is not the first tab, then it decrements the tab value by 1.
   * @returns {void}
   */
  const handleBack = () => {
    if (parseInt(tabValue) > 1) {
      setTabValue((parseInt(tabValue) - 1).toString());
    }
  };
  /**
   * Validates the format of an email address.
   *
   * This function uses a regular expression to check if the provided email
   * address has a basic valid format. It checks for the presence of characters
   * before and after an "@" symbol, followed by a domain with a period.
   *
   * @param {string} email - The email address to be validated.
   * @returns {boolean} Returns `true` if the email address format is valid, otherwise `false`.
   */
  const validateEmail = (email) => {
    // Regular expression for basic email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Handles the save or update operation for a user.
 * If it is an existing user, then it updates the user details.
 * Otherwise, it creates a new user.
 * @returns {Promise<void>}
 */
  const handleSaveOrUpdateUser = async () => {
    setLoading(true);
    // console.log("handleSaveOrUpdateUser() called");
    const currentUser = { ...userDetails }; //will take care of department later on
    currentUser.userID = currentUser.userID.trim();
    currentUser.userName = currentUser.userName.trim();
   
    currentUser.passwordExpiryDate = dayjs()
      .add(currentUser.passwordExpiryDuration, "day")
      .format("YYYY-MM-DD"); //!adding the
    if (location.state) {
      //!i.e existing user is getting updated
      currentUser.modifiedOn = dayjs().format(SQL_TIMEFORMAT);
      currentUser.modifiedBy = current_Admin;
      if (currentUser?.modifiedOn)
        currentUser.passwordExpiryDate = dayjs(currentUser?.modifiedOn)
          .add(currentUser.passwordExpiryDuration, "day")
          .format(SQL_TIMEFORMAT);
    }

    currentUser.department =
      currentUser.department ?? createDepartment("", "", tenant);

    // console.log("Final User : ", currentUser);

    currentUser.workingHours=`${workingHours[0].format("HH:mm")}-${workingHours[1].format("HH:mm")}`;

    currentUser.guestStart=null;
    currentUser.guestStop=null;
    // currentUser.isGuest = 0;
    if(currentUser.isGuest) // Boolean Check is given in the checkbox
    {
       currentUser.isGuest = 1;
    currentUser.guestStart= `${dayjs(currentUser.guestValidity[0]).toISOString()}`
    currentUser.guestStop=`${dayjs(currentUser.guestValidity[1]).toISOString()}`
    }
    else currentUser.isGuest = 0;

    const success = await saveUser(currentUser);
    // console.log("JSON String :", JSON.stringify(currentUser));

    if (success) {
      // console.log("User has been updated successfully !");
      setSnackbarSeverity("success");
      setSnackbarMessage("Data has been saved successfully !");
      setSnackbarOpen(true);
      await delay(400);
      navigate("/workflow/admin");
    } else {
      // console.log("Error updating user");
      setSnackbarSeverity("error");
      setSnackbarMessage("Error !");
      setSnackbarOpen(true);
    }
    setLoading(false);
  };

  const handleGroupDialogOpen = () => {
    // console.log("handleDialogOpen() called");

    const new_grp = new createGroup("", "", "", "", true, tenant,getCurrentUser());
    // setUpdateGroupValue(createGroup("", "", "", "", "", ""));
    // setUpdateDepartmentValue(createDepartment('','',''))
    setNewGroup(new_grp);
    setIsGroupOrDepartmentEdit(1);
    setGroupOrDepartmentData(allGroupMap);
    setIsDialogOpen(true);
  };

/**
 * Opens the department dialog for creating or editing a department.
 *
 * This function initializes a new department object and sets the state
 * to indicate that a department is being edited. It then opens the dialog
 * for department editing.
 */

  const handleDepartmentDialogOpen = () => {
    // console.log("handleDepartmentDialogOpen() called");

    const newDepartment = new createDepartment("", "", tenant);
    setNewDepartment(newDepartment);
    setGroupOrDepartmentData(allDepartments);
    setIsGroupOrDepartmentEdit(2);
    setIsDialogOpen(true);
  };

/**
 * Handles the saving of a new group.
 *
 * This function trims and validates the group details, then checks if
 * the group already exists in the list of all groups. If it does,
 * an error message is displayed. If the group does not exist, it attempts
 * to save the new group. Upon successful save, it updates the list of all
 * groups and displays a success message. If the save fails, it displays
 * an error message.
 *
 * @async
 * @returns {Promise<void>}
 */

  const handleGroupSave = async () => {
    // console.log("handleGroupSave() called");
    const trimmedGroup = {
      ...newGroup,
      groupID:
        typeof newGroup.groupID === "string"
          ? newGroup.groupID.trim()
          : newGroup.groupID,
      groupName:
        typeof newGroup.groupName === "string"
          ? newGroup.groupName.trim()
          : newGroup.groupName,
    };
    // console.log("The new Group Object ", trimmedGroup);

    //check for group already exists or not
    const groupExists = allGroupMap.some(
      (data) =>
        data.groupID.toLowerCase() === trimmedGroup.groupID.toLowerCase() ||
        data.groupName.toLowerCase() === trimmedGroup.groupName.toLowerCase()
    );

    if (groupExists) {
      // console.log("Group already exists");
      const dataFound = { ...dataAlreadyExists, group: true };
      setDataAlreadyExists(dataFound);
      setSnackbarSeverity("error");
      setSnackbarMessage("Group ID or Name already exists !");
      setSnackbarOpen(true);
      return;
    }

    const isGroupInvolvedReason = await checkGroupAssociation(
      trimmedGroup.groupID.toLowerCase(),
      trimmedGroup.groupName
    );
    //Lets say the group is already associated with any configuration, manipulating it will disturb the configuration of other modules
    if (isGroupInvolvedReason) {
      // console.log("Group already exists");
      const dataFound = { ...dataAlreadyExists, group: true };
      setDataAlreadyExists(dataFound);
      setSnackbarSeverity("error");
      setSnackbarMessage(isGroupInvolvedReason);
      setSnackbarOpen(true);
      return;
    }
    const dataFound = { ...dataAlreadyExists, group: false };
    setDataAlreadyExists(dataFound);
    const success = await saveNewGroup(trimmedGroup);

    if (success) {
      // console.log("Group has been saved successfully !");
      // const allGroupNames = [];
      const groupDetails = await getAllGroupDetails();
      if (groupDetails) {
        // groupDetails.forEach((data) => allGroupNames.push(data.groupName));
        // console.log('Updated Group List : ',allGroupNames)

        // setAllGroups(allGroupNames);
        setAllGroupMap(groupDetails);
        setGroupOrDepartmentData(groupDetails);

        setSnackbarSeverity("success");
        setSnackbarMessage("Group has been saved successfully !");
        setSnackbarOpen(true);
        resetGrouporDepartment();
      }
      // setAllGroupMap(groupDetails);
      // setIsDialogOpen(false)
    } else {
      console.error("Error Saving Group");
      setSnackbarSeverity("error");
      setSnackbarMessage("Error !");
      setSnackbarOpen(true);
    }
  };

  /**
   * Handles the saving of a new department.
   *
   * This function trims and validates the department details, then checks if
   * the department already exists in the list of all departments. If it does,
   * an error message is displayed. If the department does not exist, it attempts
   * to save the new department. Upon successful save, it updates the list of all
   * departments and displays a success message. If the save fails, it displays
   * an error message.
   *
   * @async
   * @returns {Promise<void>}
   */
  const handleDepartmentSave = async () => {
    // console.log("handleDepartmentSave() called");
    const trimmedDepartment = {
      ...newDepartment,
      deptID:
        typeof newDepartment.deptID === "string"
          ? newDepartment.deptID.trim()
          : newDepartment.deptID,
      deptName:
        typeof newDepartment.deptName === "string"
          ? newDepartment.deptName.trim()
          : newDepartment.deptName,
    };

    // console.log("The new Department Object ", trimmedDepartment);

    //Check for Department already exists or not
    const deptExists = allDepartments.some(
      (data) =>
        data.deptID.toLowerCase() === trimmedDepartment.deptID.toLowerCase() ||
        data.deptName.toLowerCase() === trimmedDepartment.deptName.toLowerCase()
    );
    // console.log("Found Department : ", deptExists);

    if (deptExists) {
      // console.log("Department already exists");
      const dataFound = { ...dataAlreadyExists, department: true };
      setDataAlreadyExists(dataFound);

      setSnackbarSeverity("error");
      setSnackbarMessage("Department ID or Name already exists !");
      setSnackbarOpen(true);
      return;
    }

 
    const dataFound = { ...dataAlreadyExists, department: false };
    setDataAlreadyExists(dataFound);

    const success = await saveNewDepartment(trimmedDepartment);

    if (success) {
      // console.log("Department has been saved successfully !");
      const departmentDetails = await getAllDepartmentDetails();
      if (departmentDetails) {
        setAllDepartments(departmentDetails);
        setGroupOrDepartmentData(departmentDetails);
        setSnackbarSeverity("success");
        setSnackbarMessage("Department has been saved successfully !");
        setSnackbarOpen(true);
        resetGrouporDepartment();
        // setEditMode(true)
      }
      // setIsDialogOpen(false)
    } else {
      console.error("Error Saving Department");
      setSnackbarSeverity("error");
      setSnackbarMessage("Error !");
      setSnackbarOpen(true);
    }
  };

  /**
   * Handles the updating of a group row.
   * It first trims the group ID and group name of the trimmedGroup object.
   * Then it calls the updateGroupDetails function to update the group.
   * If the group is updated successfully, it resets the newGroup to its initial state,
   * fetches all the group details again, and displays a success message to the user.
   * If there is an error while updating the group, it displays an error message to the user.
   */
  const updateGroupRow = async () => {
    // console.log("updateGroupRow() called", newGroup);
    //Check for group Association , if the group is asscociated it could not be updated
   
    const trimmedGroup = {
      ...newGroup,
      groupID:
        // typeof newGroup.groupID === "string"
        //   ? newGroup.groupID.trim()
          // :
           newGroup.groupID.trim(),
      groupName:
        // typeof newGroup.groupName === "string"
        //   ? newGroup.groupName.trim()
        //   :
           newGroup.groupName.trim(),
    };

   const alreadyExists= allGroupMap.find(g=>g.groupID.toLowerCase() === trimmedGroup.groupID.toLowerCase() 
                                      && g.groupName.toLowerCase() === trimmedGroup.groupName.toLowerCase());
    if(alreadyExists)
    {
      await updateGroupData(trimmedGroup);
      return;
    }

    const isGroupInvolvedReason = await checkGroupAssociation(
      trimmedGroup.groupID,
      trimmedGroup.groupName)

    if (isGroupInvolvedReason) {
      // console.log("Group already exists");
      const dataFound = { ...dataAlreadyExists, group: true };
      setDataAlreadyExists(dataFound);
      setSnackbarSeverity("error");
      setSnackbarMessage(isGroupInvolvedReason);
      setSnackbarOpen(true);
      return;
    }
    // console.log("Trimmed Group : ",trimmedGroup)
   
  };

  const updateGroupData = async(group)=>
  {
     const success = await updateGroupDetails(group);
    if (success) {
      // console.log("Group has been saved successfully !");
      // const allGroupNames = [];
      const groupDetails = await getAllGroupDetails();
      setNewGroup(createGroup("", "", "", true, tenant));
      // console.log("Update Group : ", groupDetails);
      if (groupDetails) {
        setAllGroupMap(groupDetails);
        setGroupOrDepartmentData(groupDetails);
        setSnackbarSeverity("success");
        setSnackbarMessage("Group has been saved successfully !");
        setSnackbarOpen(true);
        resetGrouporDepartment();
      }
    } else {
      console.error("Error updating group");
      setSnackbarSeverity("error");
      setSnackbarMessage("Error !");
      setSnackbarOpen(true);
    }
  }

  /**
   * Handles the update of a department row.
   * It trims the department ID and name, checks if the department ID or name already exists,
   * and updates the department in the backend if it doesn't exist.
   * If successful, it retrieves all department details, updates the state, and displays a success message.
   * If there is an error, it displays an error message.
   */
  const handleDepartmentRowUpdate = async () => {
    // console.log("handleDepartmentRowUpdate() called");
    const trimmedDepartment = {
      ...newDepartment,
      deptID:
        typeof newDepartment.deptID === "string"
          ? newDepartment.deptID.trim()
          : newDepartment.deptID,
      deptName:
        typeof newDepartment.deptName === "string"
          ? newDepartment.deptName.trim()
          : newDepartment.deptName,
    };
    const success = await updateDepartmentDetails(trimmedDepartment);
    if (success) {
      // console.log("Department has been updated successfully !");
      const departmentDetails = await getAllDepartmentDetails();
      if (departmentDetails) {
        setAllDepartments(departmentDetails);
        setSnackbarSeverity("success");
        setSnackbarMessage("Department has been saved successfully !");
        setSnackbarOpen(true);
        resetGrouporDepartment();
      } else {
        console.error("Error getting department details");
        setSnackbarSeverity("error");
        setSnackbarMessage("Error !");
        setSnackbarOpen(true);
      }
    } else {
      setSnackbarSeverity("error");
      setSnackbarMessage("Error !");
      setSnackbarOpen(true);
    }
  };

  /**
   * Resets the group and department state to its initial state.
   * This is used to clear the fields when the user clicks on the
   * "Add New Group" or "Add New Department" buttons.
   */
  const resetGrouporDepartment = () => {
    // console.log("Reset Group or Department called ");
    setNewGroup(createGroup("", "", "", "", true, tenant,""));
    setNewDepartment(createDepartment("", "", tenant,""));
    setDataAlreadyExists({
      userID: false,
      group: false,
      department: false,
    })
    setEditMode(true);
  };

  /**
   * Handles the deletion of a group row.
   * It first checks if the group is associated with any other entities.
   * If it is, then it shows an error message. Otherwise, it deletes the group
   * and updates the state accordingly.
   */
  const deleteGroupRow = async () => {
    // console.log("deleteGroupRow() called");
    // let groupExists = false;
   const groupExistsReason = await checkGroupAssociation(newGroup.groupID,newGroup.groupName);
    if (groupExistsReason) {
      setSnackbarSeverity("error");
      setSnackbarMessage(groupExistsReason);
      setSnackbarOpen(true);
      return;
    } else {
      // console.log("Group Exists", groupExists);
      if (groupExistsReason ?? true) {
        setSnackbarSeverity("error");
        setSnackbarMessage("Error!");
        setSnackbarOpen(true);
        return;
      }
      // console.log("Group is free and can be deleted");
      const success = await deleteGroupById(newGroup);
      if (success) {
        const newGroupList = allGroupMap.filter(
          (group) => group.groupID !== newGroup.groupID
        );
        setAllGroupMap(newGroupList);
        setGroupOrDepartmentData(newGroupList);
        setSnackbarSeverity("success");
        setSnackbarMessage("Group Deleted syccessfully");
        setSnackbarOpen(true);
        resetGrouporDepartment();
      } else {
        setSnackbarSeverity("error");
        setSnackbarMessage("Error !");
        setSnackbarOpen(true);
      }
    }
  };

  /**
   * Deletes a department after checking for any existing associations.
   *
   * This function checks if the department is associated with any users
   * or other entities using `checkDepartmentAssociation`. If any associations
   * are found, an error message is shown and the deletion process is halted.
   * If no associations exist, it attempts to delete the department using
   * `deleteDepartmentById`. Upon successful deletion, it updates the list of
   * departments, displays a success message, and resets the department form.
   * If the deletion fails, an error message is displayed.
   */
  const deleteDepartmentRow = async () => {
    // console.log("deleteDepartmentRow() called");

    // let deptExists = false;
   const deptExistsReason = await checkDepartmentAssociation(newDepartment.deptID);
    if (deptExistsReason) {
      setSnackbarSeverity("error");
      setSnackbarMessage(deptExistsReason);
      setSnackbarOpen(true);
      return;
    } else {
      if (deptExistsReason ?? true) {
        setSnackbarSeverity("error");
        setSnackbarMessage("Error!");
        setSnackbarOpen(true);
        return;
      }
      // console.log("Department is free and can be deleted");
      const success = await deleteDepartmentById(newDepartment);
      if (success) {
        //* if the department is deleted then filter that dept and set the new Department List
        const newDeptList = allDepartments.filter(
          (dept) => dept.deptID !== newDepartment.deptID
        );
        setAllDepartments(newDeptList);
        setGroupOrDepartmentData(newDeptList);
        setSnackbarSeverity("success");
        setSnackbarMessage("Department deleted successfully");
        setSnackbarOpen(true);
        resetGrouporDepartment();
      } else {
        setSnackbarSeverity("error");
        setSnackbarMessage("Error !");
        setSnackbarOpen(true);
      }
    }
  };

  /**
   * Opens the merge groups dialog.
   * When this function is called, it resets the selected groups, sets the edit mode to true, and sets the new group to a default value.
   * It also sets the `isMergeGroupActive` state to true, which is used to conditionally render the merge groups dialog.
   */
  const handleMergeGroups = () =>
    //****** This is when the dialog is open ****/
    {
      // console.log("handleMergeGroups() called");
      setSelectedGroups([]);
      setEditMode(true);
      setDataAlreadyExists({
        userID: false,
        group: false,
        department: false,
      })
      setNewGroup(createGroup("", "", "", "", true, tenant));
      setIsMergeGroupActive(true);
    };

  /**
   * This function is called when the user clicks on the merge groups button.
   * It will check if the group already exists, if not it will save the new group and then merge the selected groups with the new group.
   * If the selected group already exists, it will show an error message.
   * If the merge is successful then it will show a success message and reset the selected group and users to merge.
   */
  const handleFinalMergeUsersWithGroup = async () => {
    // console.log("handleFinalMergeUsersWithGroup() called");
    console.group();
    // console.log("New Group Details to Merge : ", mergeGroupDetails);
    // console.log("Selected Groups to Merge : ", selectedGroups);
    // console.log("Selected Users to Merge : ", selectedUsersToMerge);
    console.groupEnd();

    //** First the group name or Id need to be checked then  */
    const trimmedGroup = {
      ...mergeGroupDetails,
      groupID:
        typeof mergeGroupDetails.groupID === "string"
          ? mergeGroupDetails.groupID.trim()
          : newGroup.groupID,
      groupName:
        typeof mergeGroupDetails.groupName === "string"
          ? mergeGroupDetails.groupName.trim()
          : newGroup.groupName,
    };
    // console.log("The new Group Object ", trimmedGroup);

    //check for group already exists or not
    const groupExists = allGroupMap.some(
      (data) =>
        data.groupID.toLowerCase() === trimmedGroup.groupID.toLowerCase() ||
        data.groupName.toLowerCase() === trimmedGroup.groupName.toLowerCase()
    );

    if (groupExists) {
      // console.log("Group already exists");
      // const dataFound={...dataAlreadyExists,group:true}
      // setDataAlreadyExists(dataFound)
      setSnackbarSeverity("error");
      setSnackbarMessage("Group ID or Name already exists !");
      setSnackbarOpen(true);
      return;
    }

    const isGroupInvolvedReason = await checkGroupAssociation(
      trimmedGroup.groupID.toLowerCase(),
      trimmedGroup.groupName.toLowerCase()
    );
    if (isGroupInvolvedReason) {
      // console.log("Group already exists");
      setSnackbarSeverity("error");
      setSnackbarMessage(isGroupInvolvedReason );
      setSnackbarOpen(true);
      return;
    }

    const success = await saveNewGroup(trimmedGroup); //* first the group is created and then the users are associated with the newly created groupId

    if (success) {
      // console.log("Group has been saved successfully !");
      // const allGroupNames = [];
      const groupDetails = await getAllGroupDetails();
      console.log('After the group is saved the updated groupDetails : ',groupDetails)
      if (groupDetails) {
        // groupDetails.forEach((data) => allGroupNames.push(data.groupName));
        // console.log('Updated Group List : ',allGroupNames)

        // setAllGroups(allGroupNames);
        setAllGroupMap(groupDetails);
        setGroupOrDepartmentData(groupDetails);
        //* Once the group has been saved then only the api for merging the groups would be called
        const selectedUserIds = selectedUsersToMerge.map((user) => {
          return user.userID;
        });
        const mergeSuccess = await saveMergedGroups(
          trimmedGroup.groupID,
          selectedUserIds
        );
        if (mergeSuccess) {
          setSnackbarSeverity("success");
          setSnackbarMessage("Group have been merged successfully !");
          setSnackbarOpen(true);
          setSelectedGroupUsersList([]);
          setSelectedUsersToMerge([]);
          setMergeGroupDialogActive(false);
          setIsMergeGroupActive(false);
          if (location?.state?.userID) {
            const updatedUser = await getUserDetailsByUserID(
              location?.state?.userID
            );
            if (updatedUser) {
              setUserDetails(updatedUser);
            } else {
              console.error("Error updating user Details");
              setSnackbarSeverity("error");
              setSnackbarMessage("Error !");
              setSnackbarOpen(true);
              return;
            }
          }
        } else {
          console.error("Error in merging group");
          setSnackbarSeverity("error");
          setSnackbarMessage("Error !");
          setSnackbarOpen(true);
        }

        // setSnackbarSeverity('success')
        // setSnackbarMessage('Group has been saved successfully !')
        // setSnackbarOpen(true)
        // resetGrouporDepartment();
      }
      // setAllGroupMap(groupDetails);
      // setIsDialogOpen(false)
    } else {
      console.error("Error Saving Group");
      setSnackbarSeverity("error");
      setSnackbarMessage("Error !");
      setSnackbarOpen(true);
    }
  };

  /**
   * This function renders the header of the table, which contains the search bar and the Merge Groups button.
   * If the user is in the process of merging groups, it will also show the cancel button and the button to confirm the merge.
   */
  const renderHeader = () => {
    return (
      <div
        className="table-header"
        style={{
          display: isMobile ? "grid" : "flex ",
          justifyContent: "space-between",
        }}
      >
        {/* <h5 className="mx-0 my-1">Groups</h5> */}

        <div>
          {!isMergeGroupActive && isGroupOrDepartmentEdit === 1 && (
            <Button
              variant="contained"
              color="success"
              endIcon={<MergeIcon />}
              onClick={handleMergeGroups}
            >
              Merge Groups
            </Button>
          )}
          {isMergeGroupActive && (
            <div 
            // style={{ marginLeft: "20rem" }}
            >
              {
                <IconButton
                  //  variant="contained"
                  color="success"
                  onClick={() => {
                    //* the function logic is atleast two groups need to be there while merging
                    // console.log("Clicked Merged Button");
                    //* This is the moment a new Dialog will pop up where a new Group will be added and merged API will be called
                    if (selectedGroups.length < 2) {
                      // console.log("At least 2 groups to merge");
                      setSnackbarSeverity("error");
                      setSnackbarMessage(
                        "Please select at least 2 groups to merge"
                      );
                      setSnackbarOpen(true);
                      return;
                    }

                    //
                    setMergeGroupDetails(
                      createGroup("", "", "", "", true, tenant,getCurrentUser())
                    );
                    const selectedGroupsUsersList = [];
                    const allGroupIds = selectedGroups.map((group) => {
                      return group.groupID;
                    });
                    // console.log("Group Id List ", allGroupIds);
                    // console.log("All Users : ", allUsers);
                    allUsers.forEach((user) => {
                      //*fetch all the users having matching groups
                      const found = user.group.some((group) =>
                        allGroupIds.includes(group.groupID)
                      );
                      // console.log("Found?", found);
                      if (found) {
                        selectedGroupsUsersList.push(user);
                      }
                    });

                    // console.log(
                    //   "Final User List for Selected Groups : ",
                    //   selectedGroupsUsersList
                    // );
                    setSelectedGroupUsersList(selectedGroupsUsersList);
                    setSelectedUsersToMerge(selectedGroupsUsersList);
                    setMergeGroupDialogActive(true);
                    // console.log("Selected Groups to merge : ", selectedGroups);
                  }}
                >
                  <MergeIcon />
                </IconButton>
              }
              {
                //when a user wants to cancel the merge operation
                <IconButton
                  // variant="contained"
                  color="error"
                  // endIcon={<CancelIcon />}
                  onClick={() => {
                    setIsMergeGroupActive(false);
                    setSelectedGroups([]); //resetting the selected users
                  }}
                >
                  <CancelIcon />
                </IconButton>
              }
            </div>
          )}
        </div>
        <span className="p-input-icon-right">
          <i className="pi pi-search" />
          <InputText
            type="search"
            className="p-inputtext-sm"
            onInput={(e) => setSearchQuery(e.target.value)}
            placeholder="Search.."
          />
        </span>
      </div>
    );
  };

  const header = renderHeader(); //* this is where the header is getting rendered for groups or department table



  const guestValidityInvalid =
  tabValidations &&
   (userDetails?.isGuest &&
(!userDetails?.guestValidity?.[0] || !userDetails?.guestValidity?.[1]))

  // const inactiveStyle = !userDetails.active
  // ? { backgroundColor: 'red', borderColor: 'red', color: 'white' }
  // : {};
  return (
    <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
      <div
        style={{
          background: "white",

          borderRadius: "1rem",
          boxShadow:
            "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
        }}
      >
        <TabContext value={tabValue}>
          <div
            style={{ display: "flex", alignItems: "center", padding: "0.5rem" }}
          >
            <Chip
              icon={
                <HomeIcon
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    navigate("/workflow/admin");
                  }}
                />
              }
              label={
                <Typography fontWeight="bold" sx={{ fontSize: "0.85rem" }}>
                  User Details
                </Typography>
              }
              variant="filled"
              color="info"
            />
          </div>
          {userDetails?.userID?.length === 0 && location?.state && (
              <ProgressBar
                mode="indeterminate"
                style={{ height: "6px" }}
              ></ProgressBar>
            )}
          <Divider />
          <Box sx={{ borderBottom: 1, borderColor: "divider",display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0 1rem' }}>
            
            <div>
             {tabValue !== "1" && (
            <PrimeReactButton
              // variant="outlined"
              outlined
              size="small"
              rounded
              label="Back"
              icon="pi pi-arrow-left"
              severity="secondary"
              onClick={handleBack}
              disabled={tabValue === "1"}
            />
          )}
          </div>
            <TabList>
              <Tab
                label={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <PermContactCalendarIcon fontSize="small" />
                    <div style={{ paddingLeft: ".3rem" }}>User Information</div>
                  </div>
                }
                value="1"
              />
              <Tab
                label={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <SecurityIcon fontSize="small" />
                    <div style={{ paddingLeft: ".3rem" }}>Authentication</div>
                  </div>
                }
                value="2"
              />
              <Tab
                label={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ContactPageIcon fontSize="small" />
                    <div style={{ paddingLeft: ".3rem" }}>Page Allocation</div>
                  </div>
                }
                value="3"
              />
              <Tab
                label={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <HomeIcon fontSize="small" />
                    <div style={{ paddingLeft: ".3rem" }}>HomePage</div>
                  </div>
                }
                value="4"
              />
              <Tab
                label={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <VerifiedIcon fontSize="small" />
                    <div style={{ paddingLeft: ".3rem" }}>Review & Confirm</div>
                  </div>
                }
                value="5"
              />
            </TabList>
            <div>
             {tabValue !== "5" && (
            <PrimeReactButton
              rounded
              size="small"
              label="Next"
              iconPos="right"
              icon="pi pi-arrow-right"
              // variant="outlined"
              outlined
              color="primary"
              onClick={handleChange}
              disabled={tabValue === "5" || userDetails.userID === ""}
            />
          )}

         
             {tabValue === "5" && <PrimeReactButton
                variant="contained"
                icon="pi pi-save"
                size="small"
                iconPos="left"
                severity="success"
                // sx={{ borderRadius: "2rem" }}
                // color="success"
                onClick={handleSaveOrUpdateUser}
                disabled={loading}
                // outlined
                // disabled={tabValue === "1"}
              >
                {location.state?.userID ? "Update" : "Add"} User
              </PrimeReactButton>}
              
              </div>
              {loading && (
                <Spin
                  style={{ marginLeft: "1rem" }}
                  indicator={<LoadingOutlined spin />}
                />
              )}
             
          </Box>

           
{/* <div
          style={{
            display: "flex",
            justifyContent: tabValue === "1" ? "flex-end" : "space-between",
            padding: "1rem",
          }}
        >
          {tabValue !== "1" && (
            <PrimeReactButton
              // variant="outlined"
              outlined
              size="small"
              rounded
              label="Back"
              icon="pi pi-arrow-left"
              severity="secondary"
              onClick={handleBack}
              disabled={tabValue === "1"}
            />
          )}
          {tabValue !== "5" && (
            <PrimeReactButton
              rounded
              size="small"
              label="Next"
              iconPos="right"
              icon="pi pi-arrow-right"
              // variant="outlined"
              outlined
              color="primary"
              onClick={handleChange}
              disabled={tabValue === "5" || userDetails.userID === ""}
            />
          )}

         
             {tabValue === "5" && <PrimeReactButton
                variant="contained"
                icon="pi pi-save"
                size="small"
                iconPos="left"
                severity="success"
                // sx={{ borderRadius: "2rem" }}
                // color="success"
                onClick={handleSaveOrUpdateUser}
                disabled={loading}
                // outlined
                // disabled={tabValue === "1"}
              >
                {location.state?.userID ? "Update" : "Add"} User
              </PrimeReactButton>}
              {loading && (
                <Spin
                  style={{ marginLeft: "1rem" }}
                  indicator={<LoadingOutlined spin />}
                />
              )}
            
        </div> */}
          <TabPanel value="1">
            <Container maxWidth="sm" style={{ marginTop: "1.8rem" }}>
              <Grid container spacing={2}>
                <Grid xs={12} sm={12} md={12} lg={4} xl={4}>
                  <Typography>Email Id </Typography>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={6} xl={6}>
                  <FloatLabel>
                    <InputText
                      id="userID"
                      value={userDetails.userID}
                      onChange={handleInputChange}
                      invalid={
                        (!validateEmail(userDetails.userID) &&
                          location?.state) ||
                        (tabValidations && userDetails.userID.length === 0) ||
                        dataAlreadyExists.userID
                      }
                      disabled={location.state?.userID ? true : false}
                      //  a user once created its userId cannot be changed
                    />
                    {/* <pre>{JSON.stringify(userDetails, null, 2)}</pre> */}
                    {/* {!validateEmail(userDetails.userID)||(tabValidations && userDetails.userID.length===0 )} */}
                    {/* <label for="Email Id">Email Id</label> */}
                  </FloatLabel>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={2} xl={2}>
                  {!validateEmail(userDetails.userID) && tabValidations && (
                    <small className="p-error">
                      Please enter a valid email address
                    </small>
                  )}
                </Grid>
              </Grid>

              <br />
              <Grid container spacing={2}>
                <Grid xs={12} sm={12} md={12} lg={4} xl={4}>
                  <Typography>User Name </Typography>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={8} xl={8}>
                  <FloatLabel>
                    <InputText
                      id="phone"
                      value={userDetails.userName}
                      onChange={(event) => {
                        setUserDetails((prevState) => ({
                          ...prevState,
                          userName: event.target.value,
                        }));
                      }}
                      invalid={
                        tabValidations && userDetails.userName.length === 0
                      }
                    />
                    {/* <pre>{JSON.stringify(userDetails, null, 2)}</pre> */}

                    {/* <label for="UserName">UserName</label> */}
                  </FloatLabel>
                </Grid>
              </Grid>

              {/* { 'Hello'+(userDetails.phone.length > 0 && userDetails.phone.length !== 10)+userDetails.phone.toString().length}+{typeof(userDetails.phone)} */}

              <br />
              <Grid container spacing={2}>
                <Grid xs={12} sm={12} md={12} lg={4} xl={4}>
                  <Typography>Phone Number </Typography>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={6} xl={6}>
                  {/* for writing the phone number of the user */}
                  <FloatLabel>
                    <InputText
                      id="phone"
                      type="text"
                      value={userDetails.phone}
                      invalid={
                        tabValidations &&
                        userDetails?.phone?.toString().length > 0 &&
                        userDetails?.phone?.toString().length !== 10
                      }
                      onChange={(event) => {
                        const inputValue = event.target.value;
                        const numericValue = inputValue.replace(/\D/g, ""); // Remove non-numeric characters
                        const formattedValue = numericValue.slice(0, 10); // Limit to 10 digits
                        setUserDetails((prevState) => ({
                          ...prevState,
                          phone: formattedValue,
                        }));
                      }}
                    />

                    {/* <pre>{JSON.stringify(userDetails, null, 2)}</pre> */}
                    {/* <label for="phone">Phone Number</label> */}
                  </FloatLabel>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={2} xl={2}>
                  {tabValidations &&
                    userDetails?.phone?.toString().length > 0 &&
                    userDetails?.phone?.toString().length !== 10 && (
                      <small className="p-error">10 digits are allowed</small>
                    )}
                </Grid>
              </Grid>

              <br />
              <Grid container spacing={2}>
                <Grid xs={12} sm={12} md={12} lg={4} xl={4}>
                  <Typography>User Groups </Typography>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={6} xl={6}>
                  {" "}
                  <MultiSelect
                    // style={{
                    //    maxWidth: '250px',
                    //   whiteSpace: "nowrap",
                    //   overflow: "hidden",
                    //   textOverflow: "ellipsis",
                    // }}
                    className="w-full md:w-16rem"
                    value={userDetails.group}
                    options={allGroupMap.filter((group) => group.active)}
                    onChange={(e) => {
                      setUserDetails((prevState) => ({
                        ...prevState,
                        group: e.value,
                      }));
                    }}
                    placeholder="Select Groups"
                    filter={true}
                    display="chip"
                    invalid={tabValidations && userDetails.group.length === 0}
                    optionLabel="groupName"
                    focusOnHover={false}
                  />
                </Grid>
                <Grid
                  xs={12}
                  sm={12}
                  md={12}
                  lg={2}
                  xl={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    margin: isMobile ? "0.5rem" : "",
                  }}
                >
                  <Tooltip title="Add Group" placement="right">
                    <PrimeReactButton
                      icon="pi pi-plus"
                      rounded
                      text
                      raised
                      label={isMobile ? "Add Group" : ""}
                      severity="info"
                      onClick={handleGroupDialogOpen}
                      aria-label="Notification"
                    />
                  </Tooltip>
                </Grid>
              </Grid>

              <br />
              <Grid container spacing={2}>
                <Grid xs={12} sm={12} md={12} lg={4} xl={4}>
                  <Typography>User Department </Typography>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={6} xl={6}>
                  <Dropdown
                    className="w-full md:w-16rem"
                    showClear
                    // value={allDepartments.find(
                    //   (data) => data.deptID === userDetails?.department
                    // )}
                    value={allDepartments.find(
                      (data) => data.deptID === userDetails?.department?.deptID,
                    )}
                    // value={userDetails.department}
                    onChange={(e) => {
                      setUserDetails((prevState) => ({
                        ...prevState,
                        department: e.value,
                      }));
                      // console.log("Current UserDetails : ", userDetails);
                    }}
                    filter
                    options={allDepartments}
                    placeholder="Select a department"
                    optionLabel="deptName"
                    invalid={
                      (tabValidations &&
                        userDetails?.department?.deptID?.length === 0) ||
                      (tabValidations && !userDetails?.department)
                    }
                  />
                </Grid>
                <Grid
                  xs={12}
                  sm={12}
                  md={12}
                  lg={2}
                  xl={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    margin: isMobile ? "0.5rem" : "",
                  }}
                >
                  {" "}
                  <Tooltip title="Add Departmant" placement="right">
                    <PrimeReactButton
                      icon="pi pi-plus"
                      rounded
                      text
                      raised
                      label={isMobile ? "Add Departmant" : ""}
                      severity="info"
                      onClick={handleDepartmentDialogOpen}
                      aria-label="Notification"
                    />
                  </Tooltip>
                </Grid>
              </Grid>

              <br />
              <Grid container spacing={2}>
                <Grid xs={6} sm={6} md={6} lg={4} xl={4}>
                  <Typography>G360 Admin </Typography>
                </Grid>
                <Grid xs={6} sm={6} md={6} lg={8} xl={8}>
                  <ToggleButton
                    className={`custom-toggle-button ${
                      userDetails.g360Admin
                        ? "toggle-button-active"
                        : "toggle-button-inactive"
                    }`}
                    onLabel="Yes"
                    offLabel="No"
                    onIcon="pi pi-check"
                    offIcon="pi pi-times"
                    checked={userDetails.g360Admin}
                    onChange={(e) => {
                      setUserDetails((prevState) => ({
                        ...prevState,
                        g360Admin: e.value,
                      }));
                    }}
                  />
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid xs={6} sm={6} md={6} lg={4} xl={4}>
                  <Typography>Status </Typography>
                </Grid>
                <Grid xs={6} sm={6} md={6} lg={8} xl={8}>
                  <ToggleButton
                    className={`custom-toggle-button ${
                      userDetails.active
                        ? "toggle-button-active"
                        : "toggle-button-inactive"
                    }`}
                    // style={!userDetails.active?{}:{ backgroundColor: 'red', borderColor: 'red', color: 'white' }}
                    // style={{background:'red !important'}}
                    // style={inactiveStyle}
                    onLabel="Active"
                    offLabel="Inactive"
                    onIcon="pi pi-check"
                    size="small"
                    offIcon="pi pi-times"
                    checked={userDetails.active}
                    onChange={(e) => {
                      setUserDetails((prevState) => ({
                        ...prevState,
                        active: e.value,
                      }));
                    }}
                  />
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid xs={6} sm={6} md={6} lg={4} xl={4}>
                  <Typography>Working Hours </Typography>
                </Grid>
                <Grid xs={6} sm={6} md={6} lg={8} xl={8}>
               <TimePicker.RangePicker
  showSecond={false}
  format="h:mm A"
  order={false}
  value={workingHours}
  allowClear={false}
  changeOnScroll
  needConfirm={false}
  onChange={(value, timeString) => {
    console.log("Raw value:", value);
    console.log("Formatted time:", timeString);

    if (!value || !value[0] || !value[1]) return;

    const [start, end] = value;

    let diffMinutes = end.diff(start, "minute");

    // Handle overnight ranges (e.g. 10 PM -> 2 AM)
    if (diffMinutes < 0) {
      diffMinutes += 24 * 60;
    }

    if (diffMinutes > workingHoursDifference* 60) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Working hours cannot exceed 8 hours."); 
      setSnackbarOpen(true); 
      return;
    }

    console.log("Start:", start.format("HH:mm"));
    console.log("End:", end.format("HH:mm"));
    console.log("Duration (minutes):", diffMinutes);

    setWorkingHours([start, end]);
  }}
/>
 
                </Grid>
              </Grid>
              <br />

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6} sm={6} md={6} lg={4} xl={4}>
                  <div style={{ display: "flex", alignItems: "centre" }}>
                    <Chip
                      icon={<PersonPinIcon />}
                      size={"small"}
                      label="isGuest"
                      variant="outlined"
                    />
                    <Checkbox
                      checked={userDetails?.isGuest ?? false}
                      style={{ paddingLeft: "1rem" }}
                      onChange={(e) =>{
                        const userChecked = e.target.checked;
                        setUserDetails({
                          ...userDetails,
                          isGuest: userChecked,
                          workFlowHomePage:userChecked ? userDetails.isGuest? userDetails.workFlowHomePage  : '' : {...location.state}?.workFlowHomePage
                        })
                      }}
                    />
                  </div>
                </Grid>

                {userDetails?.isGuest ? (
                  <Grid item xs={6} sm={6} md={6} lg={8} xl={8}>
                    <Calendar
                      id="guestValidity"
                      value={userDetails?.guestValidity || null}
                      onChange={(e) =>{
                        console.log('event : ',e.value)
                        setUserDetails({
                          ...userDetails,
                          guestValidity: e.value,
                          workFlowHomePage:guestPages.includes( userDetails.workFlowHomePage.page)?userDetails.workFlowHomePage : ''
                        })
                      }}
                     invalid={guestValidityInvalid}
                      dateFormat="dd/mm/yy"
                      showIcon
                      selectionMode="range"
                      showTime
                      icon="pi pi-clock"
                      hourFormat="12"
                      minDate={new Date()}
                    />
                   
                  </Grid>
                ):<></>}
                 
              </Grid>

              {/* <br /> */}

              {/********  This is Merge Group Dialog *********/}
              <Dialog
                header="Merge Group"
                visible={mergeGroupDialogActive}
                style={{ width: "40vw" }}
                onHide={() => {
                  setMergeGroupDialogActive(false);
                  setMergeGroupDetails(
                    createGroup("", "", "", "", true, tenant, ""),
                  ); //** resetting  */
                  setSelectedGroupUsersList([]);
                  setSelectedUsersToMerge([]);
                }}
              >
                <div className="p-grid p-fluid">
                  <div id="merge-groupdetails-dialog">
                    <br />

                    <FloatLabel>
                      <InputText
                        id="groupID"
                        // type="number"
                        value={mergeGroupDetails.groupID}
                        onChange={(event) => {
                          // const formattedValue = event.target.value.slice(0, 10); // Limit to 10 digits
                          setMergeGroupDetails((prevState) => ({
                            ...prevState,
                            groupID: event.target.value,
                          }));
                        }}
                        // invalid={dataAlreadyExists.group}

                        //   invalid={true}
                      />
                      {/* <pre>{JSON.stringify(userDetails, null, 2)}</pre> */}
                      <label for="groupID">Group Id</label>
                    </FloatLabel>

                    <br />
                    <FloatLabel>
                      <InputText
                        id="groupName"
                        // type="number"
                        value={mergeGroupDetails.groupName}
                        onChange={(event) => {
                          // const formattedValue = event.target.value.slice(0, 10); // Limit to 10 digits
                          setMergeGroupDetails((prevState) => ({
                            ...prevState,
                            groupName: event.target.value,
                          }));
                        }}

                        //   invalid={true}
                      />
                      {/* <pre>{JSON.stringify(userDetails, null, 2)}</pre> */}
                      <label for="groupName">Group Name</label>
                    </FloatLabel>

                    <br />
                    <FloatLabel>
                      <InputText
                        id="homePage"
                        // type="number"
                        value={mergeGroupDetails.homePage}
                        onChange={(event) => {
                          // const formattedValue = event.target.value.slice(0, 10); // Limit to 10 digits
                          setMergeGroupDetails((prevState) => ({
                            ...prevState,
                            homePage: event.target.value,
                          }));
                        }}

                        //   invalid={true}
                      />
                      {/* <pre>{JSON.stringify(userDetails, null, 2)}</pre> */}
                      <label for="homePage">HomePage</label>
                    </FloatLabel>

                    <br />
                    <FloatLabel>
                      <InputText
                        id="phoneNumber"
                        type="text"
                        value={mergeGroupDetails.phone}
                        onChange={(event) => {
                          const inputValue = event.target.value;
                          const numericValue = inputValue.replace(/\D/g, ""); // Remove non-numeric characters
                          const formattedValue = numericValue.slice(0, 10); // Limit to 10 digits

                          setMergeGroupDetails((prevState) => ({
                            ...prevState,
                            phone: formattedValue,
                          }));
                        }}

                        //   invalid={true}
                      />
                      {/* <pre>{JSON.stringify(userDetails, null, 2)}</pre> */}
                      <label for="phoneNumber">Phone Number</label>
                    </FloatLabel>
                    <br />

                    <FloatLabel className="w-full ">
                      <MultiSelect
                        value={selectedUsersToMerge}
                        onChange={(e) => setSelectedUsersToMerge(e.value)}
                        options={selectedGroupUsersList}
                        optionLabel="userName"
                        className="w-full"
                      />
                      <label htmlFor="userName">Select Users</label>
                    </FloatLabel>
                    <br />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        columnGap: "1rem",
                      }}
                    >
                      <div
                        style={{
                          margin: 0,

                          fontSize: ".9rem",
                        }}
                      >
                        Status
                      </div>
                      <ToggleButton
                        // style={!userDetails.active?{}:{ backgroundColor: 'red', borderColor: 'red', color: 'white' }}
                        // style={{background:'red !important'}}
                        // style={inactiveStyle}
                        onLabel="Active"
                        className={`custom-toggle-button ${
                          mergeGroupDetails.active
                            ? "toggle-button-active"
                            : "toggle-button-inactive"
                        }`}
                        offLabel="Inactive"
                        // onIcon="pi pi-check"
                        // offIcon="pi pi-times"
                        checked={mergeGroupDetails.active}
                        onChange={(e) => {
                          setMergeGroupDetails((prevState) => ({
                            ...prevState,
                            active: e.value,
                          }));
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "73%",
                        justifyContent: "flex-start",
                        columnGap: "1.5rem",
                      }}
                    >
                      <div
                        style={{
                          margin: 0,
                          paddingBottom: "5px",
                          fontSize: ".9rem",
                        }}
                      >
                        Group Leader
                      </div>
                      <GroupLeaderDropdown
                        value={mergeGroupDetails?.leader}
                        options={allUsers}
                        isMobile={isMobile}
                        onChange={(e) => {
                          setMergeGroupDetails((prev) => ({
                            ...prev,
                            leader: e.value,
                          }));
                        }}
                      />
                    </div>

                    <br />
                    <center>
                      {
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={handleFinalMergeUsersWithGroup}
                          disabled={
                            mergeGroupDetails.groupID.length === 0 ||
                            mergeGroupDetails.groupName.length === 0 ||
                            selectedUsersToMerge.length < 1
                          }
                        >
                          Add Users
                        </Button>
                      }
                    </center>
                  </div>
                </div>
              </Dialog>

              {/* <pre>{JSON.stringify(userDetails, null, 2)}</pre> */}
              {/********** This is Group and Department dialog  ************/}

              <Dialog
                header={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <i
                      className="pi pi-plus-circle"
                      style={{ fontSize: "1.2rem" }}
                    ></i>
                    <span>
                      Add New{" "}
                      {isGroupOrDepartmentEdit === 1 ? "Group" : "Department"}
                    </span>
                  </div>
                }
                visible={isDialogOpen}
                style={{ width: isMobile ? "95%" : "67vw" }}
                maximizable
                onHide={() => {
                  setIsDialogOpen(false);
                  setGroupOrDepartmentData([]);
                  // setUpdateGroupValue(createGroup("", "", "", "", "", ""));
                  // setUpdateDepartmentValue(createDepartment('','',''))
                  const dataFound = {
                    ...dataAlreadyExists,
                    group: false,
                    department: false,
                  }; //! in the event the user closes it in error state
                  setDataAlreadyExists(dataFound);
                  setEditMode(true);
                  setIsMergeGroupActive(false);
                  setSelectedGroups([]);
                }}
              >
                {/* Group Info */}
                {isGroupOrDepartmentEdit === 1 && (
                  <div>
                    <Container style={{ marginTop: "1.8rem" }}>
                      <Grid container spacing={2}>
                        <Grid xs={12} sm={12} md={12} lg={4} xl={4}>
                          <div
                            id="edit-group"
                            style={{
                              boxShadow: "3px 3px 3px #f4ecec",
                              marginBottom: isMobile ? "1rem" : 0,
                              borderRadius: "1rem",
                              border: "1px solid #e9e3e3",
                              display: "grid",
                              justifyItems: "center",
                              padding: "0.5rem 0",
                              marginRight: isMobile ? "" : "0.7rem",
                            }}
                          >
                            <>
                              <br />
                              {/* {updateGroupValue.groupName}
                        <Dropdown
                          value={allGroupMap.find(
                            (data) => data.groupID === updateGroupValue.groupID
                          )}
                          onChange={(e) => {
                            const selectedGroup = allGroupMap.find(
                              (data) => data.groupID === e.value.groupID
                            );
                            if (selectedGroup) {
                              setUpdateGroupValue(selectedGroup);
                              setNewGroup(selectedGroup);
                            }
// console.log("Group Event:", e.value);
// console.log("Selected Group:", selectedGroup);
                          }}
                          options={allGroupMap}
                          placeholder="Update or Delete Group"
                          optionLabel="groupName"
                        /> */}

                              {/* <br /> */}
                              {/* <br /> */}
                              <FloatLabel>
                                <InputText
                                  //className="w-5rem"
                                  id="groupID"
                                  // type="number"
                                  value={newGroup.groupID}
                                  onChange={(event) => {
                                    // const formattedValue = event.target.value.slice(0, 10); // Limit to 10 digits
                                    setNewGroup((prevState) => ({
                                      ...prevState,
                                      groupID: event.target.value,
                                    }));
                                  }}
                                  invalid={dataAlreadyExists.group}
                                  disabled={!editMode}
                                  //* the groupId is a unique identifier changing it  will remove the track of the current Group itself
                                  //   invalid={true}
                                />
                                {/* <pre>{JSON.stringify(userDetails, null, 2)}</pre> */}
                                <label for="groupID">Group Id</label>
                              </FloatLabel>
                              <br />
                              <br />
                              <FloatLabel>
                                <InputText
                                  id="groupName"
                                  // type="number"
                                  value={newGroup.groupName}
                                  onChange={(event) => {
                                    // const formattedValue = event.target.value.slice(0, 10); // Limit to 10 digits
                                    setNewGroup((prevState) => ({
                                      ...prevState,
                                      groupName: event.target.value,
                                    }));
                                  }}
                                  invalid={dataAlreadyExists.group}

                                  //   invalid={true}
                                />
                                {/* <pre>{JSON.stringify(userDetails, null, 2)}</pre> */}
                                <label for="groupName">Group Name</label>
                              </FloatLabel>
                              <br />
                              <br />
                              <FloatLabel>
                                <InputText
                                  id="homePage"
                                  // type="number"
                                  value={newGroup.homePage}
                                  onChange={(event) => {
                                    // const formattedValue = event.target.value.slice(0, 10); // Limit to 10 digits
                                    setNewGroup((prevState) => ({
                                      ...prevState,
                                      homePage: event.target.value,
                                    }));
                                  }}

                                  //   invalid={true}
                                />
                                {/* <pre>{JSON.stringify(userDetails, null, 2)}</pre> */}
                                <label for="homePage">HomePage</label>
                              </FloatLabel>
                              <br />
                              <br />
                              <FloatLabel>
                                <InputText
                                  id="phoneNumber"
                                  type="text"
                                  value={newGroup.phone}
                                  onChange={(event) => {
                                    const inputValue = event.target.value;
                                    const numericValue = inputValue.replace(
                                      /\D/g,
                                      "",
                                    ); // Remove non-numeric characters
                                    const formattedValue = numericValue.slice(
                                      0,
                                      10,
                                    ); // Limit to 10 digits
                                    setNewGroup((prevState) => ({
                                      ...prevState,
                                      phone: formattedValue,
                                    }));
                                  }}

                                  //   invalid={true}
                                />
                                {/* <pre>{JSON.stringify(userDetails, null, 2)}</pre> */}
                                <label for="phoneNumber">Phone Number</label>
                              </FloatLabel>
                              <br />
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  width: "73%",
                                  justifyContent: "flex-start",
                                  columnGap: "1.5rem",
                                }}
                              >
                                <div
                                  style={{
                                    margin: 0,
                                    paddingBottom: "5px",
                                    fontSize: ".9rem",
                                  }}
                                >
                                  Status
                                </div>
                                <ToggleButton
                                  // style={!userDetails.active?{}:{ backgroundColor: 'red', borderColor: 'red', color: 'white' }}
                                  // style={{background:'red !important'}}
                                  // style={inactiveStyle}
                                  className={`custom-toggle-button ${
                                    newGroup.active
                                      ? "toggle-button-active"
                                      : "toggle-button-inactive"
                                  }`}
                                  //className="activeBtn"
                                  onLabel="Active"
                                  offLabel="Inactive"
                                  // onIcon="pi pi-check"
                                  // offIcon="pi pi-times"
                                  checked={newGroup.active}
                                  onChange={(e) => {
                                    setNewGroup((prevState) => ({
                                      ...prevState,
                                      active: e.value,
                                    }));
                                  }}
                                />
                              </div>
                              <br />
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  width: "73%",
                                  justifyContent: "flex-start",
                                  columnGap: "1.5rem",
                                }}
                              >
                                <div
                                  style={{
                                    margin: 0,
                                    paddingBottom: "5px",
                                    fontSize: ".9rem",
                                  }}
                                >
                                  Group Leader
                                </div>
                                <div>
                                  <GroupLeaderDropdown
                                    value={newGroup?.leader}
                                    options={allUsers}
                                    isMobile={isMobile}
                                    onChange={(e) => {
                                      setNewGroup((prev) => ({
                                        ...prev,
                                        leader: e.value,
                                      }));
                                    }}
                                  />
                                  {/* <Dropdown
                                    value={newGroup?.leader ?? ""}
                                    options={allUsers}
                                    optionValue="userID"
                                    // onChange={(e) => {
                                    //   setCurrentLogbookApprover(e.value);
                                    //   // setCurrentAutoJobNAme(`Auto job created by ${e.target.value}`);
                                    // }}
                                    onChange={(e) => {
                                      setNewGroup((prevState) => ({
                                        ...prevState,
                                        leader: e.value,
                                      }));
                                    }}
                                    className="selfJobDropdownStyle"
                                    placeholder="Select Approver"
                                    style={{
                                      // height: "30px",
                                      width: isMobile ? "6rem" : "100%",
                                      maxWidth: "10rem",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
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
                                  /> */}
                                </div>
                              </div>
                              <br />
                              <center style={{ marginBottom: "0.7rem" }}>
                                {editMode && (
                                  <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    onClick={handleGroupSave}
                                    disabled={
                                      newGroup.groupID.length === 0 ||
                                      newGroup.groupName.length === 0
                                    }
                                    startIcon={<AddCircleIcon />}
                                  >
                                    Add
                                  </Button>
                                )}

                                {!editMode && (
                                  <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    onClick={updateGroupRow}
                                    sx={{ marginRight: "1rem" }}
                                    startIcon=<SaveIcon />
                                  >
                                    Update
                                  </Button>
                                )}

                                {!editMode && (
                                  <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    onClick={() => {
                                      setConfirmDialog(true);
                                    }}
                                    startIcon=<DeleteIcon />
                                  >
                                    Delete
                                  </Button>
                                )}
                                {!editMode && (
                                  <IconButton onClick={resetGrouporDepartment}>
                                    <ReplayIcon />
                                  </IconButton>
                                )}
                              </center>
                            </>
                          </div>
                        </Grid>
                        <Grid xs={12} sm={12} md={12} lg={8} xl={8}>
                          <div id="group-table">
                            {/* {"hello"+globalFilter} */}
                            <DataTable
                              paginator
                              rows={6}
                              //rowsPerPageOptions={[10, 25, 50]}
                              stripedRows
                              showGridlines={isMobile ? true : false}
                              className="UserInfoTableStyle dataTableStyle HeaderColor"
                              value={filteredSearchData}
                              // removableSort
                              header={header}
                              // globalFilter={globalFilter}
                              onRowClick={(e) => {
                                if (isMergeGroupActive) return;
                                const current_row = e.data;
                                // console.log("Event:", e);
                                const selectedGroup = allGroupMap.find(
                                  (data) =>
                                    data.groupID === current_row.groupID,
                                );

                                if (selectedGroup) {
                                  // setUpdateGroupValue(selectedGroup);
                                  setNewGroup(selectedGroup);
                                }
                                setEditMode(false);
                                console.log("Group Event:", current_row);
                                console.log("Selected Group:", selectedGroup);
                              }}
                              selectionMode={"checkbox"}
                              selection={selectedGroups}
                              onSelectionChange={(e) =>
                                setSelectedGroups(e.value)
                              }
                            >
                              {isMergeGroupActive && (
                                <Column selectionMode="multiple"></Column>
                              )}
                              <Column
                                field="groupID"
                                header="Group Id"
                                sortable
                                body={(rowData) => (
                                  <Typography>{rowData.groupID}</Typography>
                                )}
                              ></Column>
                              <Column
                                field="groupName"
                                header="Group Name"
                                body={(rowData) => (
                                  <Chip label={rowData.groupName} />
                                )}
                                sortable
                              ></Column>
                              <Column
                                field="phone"
                                header="Phone Number"
                                sortable
                              ></Column>
                              <Column
                                field="homePage"
                                header="Home page"
                                sortable
                              ></Column>
                              <Column
                                field="active"
                                header="Status"
                                sortable
                                body={(rowData) =>
                                  rowData.active ? (
                                    // <PrimeReactButton
                                    //   size="small"
                                    //   rounded
                                    //   raised
                                    //   label="Active"
                                    //   severity="success"
                                    // />
                                    <Chip
                                      size="small"
                                      label="Active"
                                      color="success"
                                    />
                                  ) : (
                                    // <PrimeReactButton
                                    //   size="small"
                                    //   label="Inactve"
                                    //   severity="danger"
                                    // />
                                    <Chip
                                      size="small"
                                      label="Inactve"
                                      color="error"
                                    />
                                  )
                                }
                              ></Column>
                            </DataTable>
                          </div>
                        </Grid>
                      </Grid>
                    </Container>
                  </div>
                )}
                {/* Department Info */}
                {isGroupOrDepartmentEdit === 2 && (
                  <Grid container spacing={2} sx={{ marginTop: "0.5rem" }}>
                    <Grid xs={12} sm={12} md={12} lg={4} xl={4}>
                      <Card
                        style={{
                          padding: "1rem",
                          border: "1px solid #e9e3e3",
                          boxShadow: "3px 3px 3px #f4ecec",
                          marginRight: "1rem",
                          display: "grid",
                          justifyItems: "center",
                          alignItems: "centers",
                          borderRadius: "1rem",
                          height: "17rem",
                        }}
                      >
                        <div id="edit-department">
                          <br />

                          <FloatLabel>
                            <InputText
                              id="deptID"
                              // type="number"
                              value={newDepartment.deptID}
                              onChange={(event) => {
                                // const formattedValue = event.target.value.slice(0, 10); // Limit to 10 digits
                                setNewDepartment((prevState) => ({
                                  ...prevState,
                                  deptID: event.target.value,
                                }));
                              }}
                              invalid={dataAlreadyExists.department}
                              disabled={!editMode} //* the deptid is a unique identifier changing it  will remove the track of the current Department itself

                              //   invalid={true}
                            />
                            {/* <pre>{JSON.stringify(userDetails, null, 2)}</pre> */}
                            <label for="deptID">Department Id</label>
                          </FloatLabel>
                          <br />
                          <FloatLabel>
                            <InputText
                              id="deptName"
                              // type="number"
                              value={newDepartment.deptName}
                              onChange={(event) => {
                                // const formattedValue = event.target.value.slice(0, 10); // Limit to 10 digits
                                setNewDepartment((prevState) => ({
                                  ...prevState,
                                  deptName: event.target.value,
                                }));
                              }}

                              //   invalid={true}
                            />
                            {/* <pre>{JSON.stringify(userDetails, null, 2)}</pre> */}
                            <label for="deptName">Department Name</label>
                          </FloatLabel>
                          <br />
                          {editMode && (
                            <Button
                              variant="contained"
                              color="success"
                              onClick={handleDepartmentSave}
                              disabled={
                                newDepartment.deptID.length === 0 ||
                                newDepartment.deptName.length === 0
                              }
                              startIcon={<AddCircleIcon />}
                              size="small"
                            >
                              Add
                            </Button>
                          )}

                          {!editMode && (
                            <Button
                              variant="contained"
                              color="success"
                              startIcon=<SaveIcon />
                              size="small"
                              sx={{ marginRight: "1rem" }}
                              onClick={handleDepartmentRowUpdate}
                            >
                              Update
                            </Button>
                          )}

                          {!editMode && (
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              startIcon=<DeleteIcon />
                              onClick={() => {
                                setConfirmDialog(true);
                              }}
                            >
                              Delete
                            </Button>
                          )}
                          {!editMode && (
                            <IconButton onClick={resetGrouporDepartment}>
                              <ReplayIcon />
                            </IconButton>
                          )}
                        </div>
                      </Card>
                    </Grid>
                    <Grid xs={12} sm={12} md={12} lg={8} xl={8}>
                      <DataTable
                        value={filteredSearchData}
                        removableSort
                        paginator
                        rows={5}
                        //rowsPerPageOptions={[5, 10, 25, 50]}
                        className="UserInfoTableStyle dataTableStyle HeaderColor"
                        header={header}
                        // globalFilter={globalFilter}
                        onRowClick={(e) => {
                          const current_row = e.data;
                          // console.log("Event:", e);
                          const selectedDepartment = allDepartments.find(
                            (data) => data.deptID === current_row.deptID,
                          );
                          if (selectedDepartment) {
                            // setUpdateGroupValue(selectedGroup);
                            setNewDepartment(selectedDepartment);
                          }
                          setEditMode(false);
                          // console.log("Group Event:", current_row);
                          console.log(
                            "Selected Department:",
                            selectedDepartment,
                          );
                        }}
                      >
                        <Column
                          field="deptID"
                          header="Department Id"
                          sortable
                        ></Column>
                        <Column
                          //field="deptName"
                          header="Department Name"
                          sortable
                          body={(rowData) => <Chip label={rowData.deptName} />}
                        ></Column>
                      </DataTable>
                    </Grid>
                  </Grid>
                )}
              </Dialog>
            </Container>
          </TabPanel>

          <TabPanel value="2">
            <div>
              <Container maxWidth="sm" style={{ marginTop: "1.8rem" }}>
                <Grid container spacing={2}>
                  <Grid xs={6} alignItems="center">
                    <Typography>
                      First Log in required password change
                    </Typography>
                  </Grid>
                  <Grid xs={6}>
                    <Typography>
                      <ToggleButton
                        className={`custom-toggle-button ${
                          userDetails.firstLoginRequired
                            ? "toggle-button-active"
                            : "toggle-button-inactive"
                        }`}
                        onLabel="Yes"
                        offLabel="No"
                        onIcon="pi pi-check"
                        offIcon="pi pi-times"
                        checked={userDetails.firstLoginRequired}
                        onChange={(e) => {
                          setUserDetails((prevState) => ({
                            ...prevState,
                            firstLoginRequired: e.value,
                          }));
                        }}
                      />
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2} alignItems="center">
                  <Grid xs={6}>
                    <Typography>Password Expiry Duration (days)</Typography>
                  </Grid>
                  <Grid xs={6}>
                    <InputNumber
                      value={userDetails.passwordExpiryDuration}
                      onValueChange={(e) => {
                        setUserDetails((prevState) => ({
                          ...prevState,
                          passwordExpiryDuration: e.value,
                        }));
                      }}
                      min={1}
                      max={365}
                      showButtons
                    />
                  </Grid>
                </Grid>
              </Container>
            </div>
          </TabPanel>

          <TabPanel value="3">
            <Container maxWidth="md" style={{ marginTop: "1.8rem" }}>
              <Grid container spacing={2}>
                <Grid xs={12} sm={12} md={12} lg={5} xl={5}>
                  <Typography sx={{ textAlign: isMobile ? "center" : "" }}>
                    OP360 Pages
                  </Typography>
                  <ListBox
                    listStyle={{ height: "250px" }}
                    filter
                    multiple
                    value={userDetails.workflowAllottedPageList.map(
                      (item) => item.page,
                    )}
                    onChange={(e) => {
                      // console.log("e.value : ", e.value);
                      setUserDetails((prevState) => {
                        const updatedDetails = {
                          ...prevState,
                          workflowAllottedPageList: e.value.map((val) =>
                            prevState.allWorkflowPageList.find(
                              (item) => item.page === val,
                            ),
                          ),
                       };

                        // Combine allotted pages from both lists and remove duplicates
                        const newAllottedPages = [
                          ...new Set([
                            ...updatedDetails.workflowAllottedPageList,
                            ...updatedDetails.g360AllottedPageList,
                          ]),
                        ];

                        // Check if the selected workflow home page has changed
                        const allotedPagesArray = e.value;
                        if (
                          !allotedPagesArray.includes(
                            prevState.workFlowHomePage,
                          )
                        ) {
                          return {
                            ...updatedDetails,
                            allotedPages: newAllottedPages,
                            workFlowHomePage: "", // Reset workFlowHomePage if it doesn't match
                          };
                        } else {
                          return {
                            ...updatedDetails,
                            allotedPages: newAllottedPages,
                          };
                        }
                      });
                    }}
                    options={
                      userDetails?.allWorkflowPageList
                        ? userDetails.isGuest
                          ? Array.from(userDetails.allWorkflowPageList)
                              .filter((item) => guestPages.includes(item.page))
                              .map((item) => item.page)
                          : Array.from(userDetails.allWorkflowPageList).map(
                              (item) => item.page,
                            )
                        : []
                    }
                    itemTemplate={(option) => {
                      const item = userDetails.allWorkflowPageList.find(
                        (item) => item.page === option,
                      );
                      return (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            <input
                              type="checkbox"
                              checked={userDetails.workflowAllottedPageList.some(
                                (selectedItem) =>
                                  selectedItem.page === item.page,
                              )}
                              readOnly
                              style={{ marginRight: "0.5rem" }}
                            />
                            {item.aliasName}
                          </div>
                          {/* <RecommendIcon color="success" fontSize="small"/> */}
                        </div>
                      );
                    }}
                  />
                </Grid>
                <Grid xs={2}></Grid>
                <Grid
                  xs={12}
                  sm={12}
                  md={12}
                  lg={5}
                  xl={5}
                  sx={{ marginTop: isMobile ? "1rem" : "" }}
                >
                  <div>
                    <Typography sx={{ textAlign: isMobile ? "center" : "" }}>
                      G360 Pages
                    </Typography>
                    <ListBox
                      filter
                      multiple
                      value={userDetails.g360AllottedPageList.map(
                        (item) => item.page,
                      )}
                      onChange={(e) => {
                        setUserDetails((prevState) => {
                          const updatedDetails = {
                            ...prevState,
                            g360AllottedPageList: e.value.map((val) => {
                              return prevState.allG360PageList.find(
                                (item) => item.page === val,
                              );
                            }),
                          };
                          const newAllottedPages = [
                            ...new Set([
                              ...updatedDetails.workflowAllottedPageList,
                              ...updatedDetails.g360AllottedPageList,
                            ]),
                          ];
                          if (prevState.g360HomePage !== e.value) {
                            return {
                              ...updatedDetails,
                              allotedPages: newAllottedPages,
                              g360HomePage: "", // Reset workFlowHomePage if it doesn't match
                            };
                          } else {
                            return {
                              ...updatedDetails,
                              allotedPages: newAllottedPages,
                            };
                          }
                        });
                      }}
                      options={
                        userDetails?.allG360PageList
                          ? Array.from(userDetails.allG360PageList).map(
                              (item) => item.page,
                            )
                          : []
                      }
                      itemTemplate={(option) => {
                        const item = userDetails.allG360PageList.find(
                          (item) => item.page === option,
                        );
                        return (
                          <div>
                            <input
                              type="checkbox"
                              checked={userDetails.g360AllottedPageList.some(
                                (selectedItem) =>
                                  selectedItem.page === item.page,
                              )}
                              readOnly
                              style={{ marginRight: "0.5rem" }}
                            />
                            {item.aliasName}
                          </div>
                        );
                      }}
                    />
                  </div>
                </Grid>
              </Grid>
            </Container>
          </TabPanel>

          <TabPanel value="4">
            <div
              style={{
                display: "grid",
                justifyItems: "stretch",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div>
                <Typography style={{ marginBottom: "0.4rem" }}>
                  OP360 Homepage
                </Typography>
                <Dropdown
                  className="w-full md:w-16rem"
                  value={userDetails.workFlowHomePage}
                  onChange={(e) => {
                    setUserDetails((prevState) => ({
                      ...prevState,
                      workFlowHomePage: e.value,
                      
                    }));
                  }}
                  filter
                  options={!userDetails.isGuest? userDetails.workflowAllottedPageList.map((item) => ({
                    label: item.aliasName,
                    value: item.page,
                  }))
                  :
                    userDetails.workflowAllottedPageList
                          .filter((item) => guestPages.includes(item.page))
                          .map((item) => ({
                           label: item.aliasName,
                           value: item.page,
                          }))
                        }
                  placeholder="Select an OP360 Homepage"
                  invalid={
                    userDetails.workFlowHomePage === "" &&
                    userDetails.allotedPages.length > 0
                  }
                />
              </div>
              <br />
              <div>
                <Typography style={{ marginBottom: "0.4rem" }}>
                  G360 Homepage
                </Typography>
                <Dropdown
                  className="w-full md:w-16rem"
                  value={userDetails.g360HomePage}
                  onChange={(e) => {
                    setUserDetails((prevState) => ({
                      ...prevState,
                      g360HomePage: e.value,
                    }));
                  }}
                  filter
                  options={userDetails.g360AllottedPageList.map((item) => ({
                    label: item.aliasName,
                    value: item.page,
                  }))}
                  placeholder="Select a G360 Homepage"
                />
              </div>
            </div>
          </TabPanel>

          <TabPanel value="5">
            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ minWidth: "170px", fontWeight: "bold" }}>Email</div>
              <div style={{ width: isMobile ? "100px" : "" }}>
               <Chip
  size="medium"
  label={
    <>
      {userDetails.userID}{" "}
      {userDetails.isGuest && <strong>(Guest)</strong>}
    </>
  }
/>
{userDetails.isGuest &&
<Chip
  size="medium"
  label={
    <>
     {userDetails?.guestValidity&& formatDatetime(userDetails.guestValidity[0]) + " to " + formatDatetime(userDetails.guestValidity[1])}
    </>
  }
/>}
              </div>
            </div>

            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ minWidth: "170px", fontWeight: "bold" }}>
                User Name
              </div>
              <div>{userDetails.userName}</div>
            </div>

            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ minWidth: "170px", fontWeight: "bold" }}>
                Phone Number
              </div>
              <div>{userDetails.phone}</div>
            </div>

            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ minWidth: "170px", fontWeight: "bold" }}>
                User Department
              </div>
              <div>{userDetails?.department?.deptName}</div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: "20px",
                columnGap: "0.5rem",
              }}
            >
              <div
                style={{
                  minWidth: "170px",
                  fontWeight: "bold",
                  marginBottom: "5px",
                }}
              >
                User Groups
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  columnGap: "0.5rem",
                  rowGap: "0.5rem",
                  width: isMobile ? "100px" : "",
                }}
              >
                {userDetails.group.map((page, index) => (
                  <Chip
                    variant="outlined"
                    color="warning"
                    key={index}
                    label={page.groupName}
                  />
                ))}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  minWidth: "170px",
                  fontWeight: "bold",
                  marginBottom: "5px",
                }}
              >
                Alloted Pages
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  columnGap: "0.5rem",
                  rowGap: "0.5rem",
                  width: isMobile ? "100px" : "",
                }}
              >
                {userDetails?.allotedPages?.map((group, index) => (
                  <Chip
                    variant="outlined"
                    color="info"
                    key={index}
                    label={group?.page}
                  />
                ))}
              </div>
            </div>

            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ minWidth: "170px", fontWeight: "bold" }}>
                Green360 Homepage
              </div>
              <div>{userDetails.g360HomePage}</div>
            </div>

            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ minWidth: "170px", fontWeight: "bold" }}>
                OP360 Homepage
              </div>
              <div>{userDetails.workFlowHomePage}</div>
            </div>

            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ minWidth: "170px", fontWeight: "bold" }}>
                Green360 Admin
              </div>
              {userDetails.g360Admin ? (
                <CheckCircleOutlineIcon style={{ color: "green" }} />
              ) : (
                <CancelIcon style={{ color: "red" }} />
              )}
            </div>

            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ minWidth: "170px", fontWeight: "bold" }}>
                Status
              </div>
              {userDetails.active ? (
                <CheckCircleOutlineIcon style={{ color: "green" }} />
              ) : (
                <CancelIcon style={{ color: "red" }} />
              )}
            </div>

              <div
              style={{
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ minWidth: "170px", fontWeight: "bold" }}>
                Working Hours
              </div>
            { `${workingHours[0].format("HH:mm")}-${workingHours[1].format("HH:mm")}`}
            </div>
            
          </TabPanel>
        </TabContext>
        {/* <pre>{JSON.stringify(userDetails, null, 2)}</pre> */}
        

        <SnackbarComponent
          openPopup={snackbarOpen}
          setOpenPopup={setSnackbarOpen}
          dialogMessage={snackbarMessage}
          snackbarSeverity={snackbarSeverity}
        />

        <div>
          <CustomDialog
            open={confirmDialog}
            setOpen={setConfirmDialog}
            proceedButtonText={"Delete"}
            cancelButtonText={"Cancel"}
            proceedButtonClick={
              isGroupOrDepartmentEdit === 1
                ? deleteGroupRow
                : isGroupOrDepartmentEdit === 2
                  ? deleteDepartmentRow
                  : undefined
            }
          />
        </div>
      </div>
    </Container>
  );
}
