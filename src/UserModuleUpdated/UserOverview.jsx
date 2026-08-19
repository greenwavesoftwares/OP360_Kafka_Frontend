// MUI Icons
import PersonAddIcon from "@mui/icons-material/PersonAdd"; // Icon used for adding a person
import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';
// MUI Components
import {
  AppBar, // Top navigation bar component
  Avatar, // Component for displaying user images or initials
  Badge, // Component for displaying a badge with a count or status
  BottomNavigation, // Bottom navigation component for mobile interfaces
  BottomNavigationAction, // Actions within BottomNavigation component
  Card, // Container component for displaying content in a card layout
  Chip, // Component for displaying small blocks of text or filters
  Container, // Wrapper for content with margin/padding
  Fab, // Floating action button for primary actions
  IconButton, // Button component for icons
  Tab, // Tab component for navigation
  Typography, // Text component for various text elements
  useMediaQuery
} from "@mui/material";

import KeyIcon from '@mui/icons-material/Key';
import { styled, useTheme } from "@mui/material/styles"; // Styling and theming for MUI components
// PrimeReact Components
import { Button } from "primereact/button"; // Button component from PrimeReact
import { Column } from "primereact/column"; // Column component used in DataTable
import { DataTable } from "primereact/datatable"; // Table component for displaying data
import { Toast } from "primereact/toast"; // Toast component for displaying notifications

import { useEffect, useRef, useState } from "react"; // React hooks for component lifecycle and state management

// import "../Admin/css/Admin.css"; 
import "./Admin.css"// CSS file for admin-specific styles

import AdminButton from "../components/shared/tag/AdminButton"; // Custom admin button component

// MUI Tooltip
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip"; // Tooltip component for displaying info on hover

// PrimeReact ProgressBar
import { ProgressBar } from "primereact/progressbar"; // Progress bar component for displaying task progress

import { useLocation, useNavigate } from "react-router-dom"; // React Router hook for programmatic navigation

// Helper functions for authentication
import { extendTokenExpiration } from "../helper/AuthService";

// MUI Tab components
import { TabContext, TabList } from "@mui/lab"; // Tab components from Material UI Lab for handling tabbed navigation

import dayjs from "dayjs"; // Day.js library for date manipulation

// PrimeReact Dialog
import { Dialog } from "primereact/dialog"; // Dialog component for modals or popups

// PrimeReact FloatLabel
import { FloatLabel } from "primereact/floatlabel"; // Floating label component for inputs

// PrimeReact InputText
import { InputText } from "primereact/inputtext"; // Input component for text fields

// PrimeReact Password
import { Password } from "primereact/password"; // Input component for password fields

import { formatDatetime } from "../JobAssign/helper"; // Custom helper function for formatting dates

// Component for expanding rows in a table
import RowExpansionTemplate from "./RowExpansionTemplate";

// API functions for user management
import { fetchAllotedPagesByUserId } from "../CommonAPI";
import {
  changeUserPassword,
  fetchAllUsers,
  getTransactionsDataByUserId,
} from "./UsermoduleApi";
import useFilteredData from "./useFilteredData";


export default function UserOverview() {
  const [rows, setRows] = useState([]); // State to hold table rows data which is responsible for showing the count
  const theme = useTheme(); // Accesses the current theme object
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Checks if the current screen size is mobile
  const [loader, setLoader] = useState(); // State to control loader visibility
  const toast = useRef(null); // Reference to Toast component for notifications

  const newColors = ["#ff6f00", "#0097a7"]; // Array of custom colors for UI elements
  // const [rowSelectionMode, setRowSelectionMode] = useState("single"); // (Commented out) State to control row selection mode

  //added by Suraj
  const navigate = useNavigate(); // Hook for navigation using react-router-dom

  const [changePassowordDialogvisible, setChangePassowordDialogVisible] =
    useState(false); // State to control visibility of change password dialog
  const [changePasswordData, setChangePasswordData] = useState({
    userData: {}, // Object to hold user data for changing password
    passwordData: "", // Field for new password input
    confirmPasswordData: "", // Field for confirming new password
  });
  // const [changePasswordDialogData,setChangePasswordDialogData]=useState({}) // (Commented out) State to hold dialog data for password change

  const [transactionsDialog, setTransactionsDialog] = useState(false); // State to control visibility of transactions dialog
  const [transactionsDialogData, setTransactionsDialogData] = useState({}); // State to hold data for displaying in the transactions dialog
  const [transactionsUser, setTransactionsUser] = useState(""); //State for holding current selected user transactions

  const [expandedRows, setExpandedRows] = useState(null); // State to control expanded rows in the DataTable
  const [globalFilter, setGlobalFilter] = useState(null); // State for global filter input value for table search

  const [filteredRows, setFilteredRows] = useState([]); // State to hold filtered rows data i.e active and inactive users
  const [currentTab, setCurrentTab] = useState("1"); // State to control the currently active tab

  const env_userId = process.env.REACT_APP_USERID;

  const location = useLocation(); // Hook for accessing the current location
  const { filteredSearchData, searchQuery, setSearchQuery } = useFilteredData(filteredRows,'AdminSearch');

  useEffect(() => {
    userHasPageAccess();
    /**
     * Asynchronously fetches all users and updates the state with modified user data.
     * - Displays a loading indicator while fetching data.
     * - Retrieves the current user's ID from session storage.
     * - Fetches user data using the `fetchAllUsers` API function.
     * - Displays an error toast if fetching fails.
     * - Modifies the fetched user data to include avatar background colors.
     * - Filters and sets active users to the table's state.
     * - Stops the loading indicator once data processing is complete.
     */
    const fetchData = async () => {
      setLoader(true);

      // const currentUser = decryptTokenId(localStorage.getItem(env_userId));
      const responseData = await fetchAllUsers();
      if (!responseData) {
        //* if the response is not achieved then show the user an alert
        toast.current.show({ severity: "error", summary: "Error", life: 3000 });
        setLoader(false);
        return;
      }
      const modifiedPayload = responseData.map((row, idx) => {
        //* adding colors based on odd - even row
        row = { ...row, avatarBgColor: newColors[idx % 2] };
        return row;
      });

      // console.log("Modified Rows : ", modifiedPayload);
      setRows(modifiedPayload);
      const activeUsers = modifiedPayload.filter((user) => user.active && !user?.isGuest); //* filtering active users
      setFilteredRows(activeUsers); //* because initial tab is 1 i.e activeUsers
      // console.log("userDate", responseData);
      setLoader(false);
    };
    // extendTokenExpiration();
    fetchData();
  }, []);

  

  // const header = renderHeader();

  /**
   * Called when a user is unselected from the table.
   * Displays a warning toast message indicating that a user has been unselected.
   * The toast message displays the name of the unselected user.
   * @param {object} event - The event object emitted by the DataTable component.
   * @param {object} event.data - The data for the unselected user.
   */
  const onRowUnselect = (event) => {
    toast.current.show({
      severity: "warn",
      summary: "User Unselected",
      detail: `Name: ${event.data.name}`,
      life: 3000,
    });
  };


  /**
   ** Checks if the user has access to the current page based on the pages they
   * *are allowed to access, and navigates to the restricted page if they don't.
   */
   const userHasPageAccess = async () => {
    // console.log("userHasPageAccess() called ");
    const allotedPages = await fetchAllotedPagesByUserId(); //fetch the privilege of pages which the current user has access to
    if (allotedPages) {
      const current_path = location.pathname; // the current path i.e current URL
      const index = allotedPages.findIndex(
        //the index of the page is  fetched from the array
        (data) => data.toLowerCase() === current_path
      );
      if (index === -1) {
        //if the  index  is not found then it will be -1, then the user will be navigated to '/restricted'
        navigate("/restricted");
      }
    }
  };


  /**
   * Called when a user is selected from the table.
   * Displays an info toast message indicating that a user has been selected.
   * The toast message displays the name of the selected user.
   * Also navigates to the user details page with the selected user's data as state.
   * @param {object} event - The event object emitted by the DataTable component.
   * @param {object} event.data - The data for the selected user.
   */
  const onRowSelect = (event) => {
    toast.current.show({
      severity: "info",
      summary: "User Selected",
      detail: `Name: ${event.data.userName}`,
      life: 3000,
    });
    // console.log("Current Event : ", event);
    navigate("/workflow/userDetails", { state: event.data });
  };

  /**
   * Renders an admin button for a user row in the user overview table.
   * If the user is a G360 admin, the button displays the text "G360 Admin".
   * The button is displayed with a green background if the user is an admin, and gray otherwise.
   * @param {object} rowData - The data for the user row.
   * @returns {JSX.Element} The rendered admin button component.
   */
  const renderAdminButton = (rowData) => {
    // console.log(rowData);

    return (
      <AdminButton
        text={rowData.g360Admin ? "G360 Admin" : null}
        adminStatus={rowData.g360Admin}
      ></AdminButton>
    );
  };

  //*For  Logs of the user i.e transactionData
  const renderTransactionLogButton = (rowData) => {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", columnGap:".3rem" }}>
      <Button
        // label="Log"
        rounded
        outlined
        icon="pi pi-file" // Add the PrimeIcon for a lock
        severity="info"
        onClick={() => handleTransactions(rowData)}
      />
          {transactionsUser && !transactionsDialog && transactionsUser.split("(")[1].replace(")", "").trim() === rowData.userID && <Spin indicator={<LoadingOutlined spin />} size="small" />}  
        {transactionsDialog && transactionsUser.split("(")[1].replace(")", "").trim() === rowData.userID && <i className="pi pi-check-circle" style={{ color: 'green' }}></i> } </div>
    );
  };

  /**
   * Handles the click event for the "Log" button in the user overview table.
   * Retrieves the transactions data for the selected user using the `getTransactionsDataByUserId` API function.
   * Formats the transaction data to include the timestamp in the "D MMM YY h:mm A" format.
   * Sets the `transactionsDialogData` state with the formatted transactions data.
   * Sets the `transactionsDialog` state to true, which opens the transactions dialog.
   * @param {object} rowData - The data for the selected user row.
   */
  const handleTransactions = async (rowData) => {
    // console.log(rowData); // This will log the entire row data related to the button
    setTransactionsUser(rowData.userName + " ( " + rowData.userID + " ) ");
    console.log('Current Username :',rowData.userName + " ( " + rowData.userID + " ) ")
    const userTransactions = await getTransactionsDataByUserId(rowData.userID);
    
    // console.log(userTransactions);

    if (userTransactions) {
      const formattedTransactions = userTransactions.map((transaction) => {
        return {
          ...transaction,
          // timestamp: dayjs(transaction.timestamp).format("D MMM YY h:mm A"), // Formats the timestamp to AM/PM
          timestamp: formatDatetime(dayjs(transaction.timestamp)), //* modifying the datetime stamp tp make it more readable
        };
      });

      // console.log("Transactions Data : ", formattedTransactions);
      setTransactionsDialogData(formattedTransactions);
      setTransactionsDialog(true);
    }
  };

  /**
   * A template function for the row expansion in the user overview table.
   * The function takes in the data for the row and returns a RowExpansionTemplate component with the data.
   * This template is used by the DataTable component to render the expanded rows.
   * @param {object} data - The data for the row.
   * @returns A RowExpansionTemplate component with the data.
   */
  const rowExpansionTemplate = (data) => {
    return <RowExpansionTemplate data={data} />;
  };

  // const allowExpansion = (rowData) => {
  //   return rowData.orders?.length > 0;
  // };

  //*for change password
  const renderChangePassword = (rowData) => {
    return (
      <>
        <Button
          outlined
          rounded
         
          size="small"
          icon="pi pi-key"
          severity="warning"
          onClick={() => changePasswordClickHandler(rowData)} 
          
        />
        
      </>
    );
  };
  /**
   * Handles the click event for changing a user's password.
   * Logs the event and updates the state with the user's data
   * for whom the password change is initiated. Opens the change
   * password dialog to allow the user to input the new password.
   * @param {object} rowData - The data of the user whose password is to be changed.
   */
  const changePasswordClickHandler = (rowData) => {
    // console.log("change password clicked : ", rowData);
    setChangePasswordData({ ...changePasswordData, userData: rowData });
    setChangePassowordDialogVisible(true);
    console.log("ResetButtonClick")
  };

  /**
   * Handles the submission of the change password form.
   * Checks if the password and confirm password fields are filled and match.
   * If the form is valid, calls the changeUserPassword API with the updated user data.
   * Shows a toast message based on the response of the API call.
   * If the password change is successful, updates the state with the new user data.
   * Closes the change password dialog.
   * @returns {Promise<void>}
   */
  const handlePasswordChange = async () => {
    // console.log("handlePasswordChange() called : ", changePasswordData);
    if (
      changePasswordData.passwordData === "" ||
      changePasswordData.confirmPasswordData === ""
    ) {
      //* if any of the fields is empty thrown an alert
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Fill the required data !",
        life: 3000,
      });
      return;
    }
    if (
      changePasswordData.passwordData !== changePasswordData.confirmPasswordData
    ) {
      //* if the passoword and confirmPassword is not same give an alert to the user
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Password does not match !",
        life: 3000,
      });
      return;
    }
    const updatedpassword = changePasswordData.passwordData; //* fetch the passwordData
    const updatedUser = {
      ...changePasswordData.userData,
      password: updatedpassword,
    };
    // console.log("Final Updated User : ", updatedUser);//* creating the user object to push into the database
    const userData = await changeUserPassword(updatedUser);
    if (userData) {
      //* if the password is changed successfully show a success alert and close the dialog and reset the changePassword field
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Password changed successfully!",
        life: 3000,
      });
      setChangePassowordDialogVisible(false);
      setChangePasswordData({
        userData: {},
        passwordData: "",
        confirmPasswordData: "",
      });
    } else {
      //* if error occurs show error alert
      toast.current.show({ severity: "error", summary: "Error", life: 3000 });
    }
  };

  //this is responsible for showing the groups in tooltip
  const renderGroups = (rowData) => {
    const groups = rowData?.group[0]?.groupName;
    const fullGroupData = rowData.group?.map((group) => group.groupName); //*fetching the groupName
    let groupsStr = fullGroupData.join(","); //* concatinating it with ','
    let groupArray = fullGroupData.length;
    // console.log(`arrayLength${groupArray}`);
    return (
      <>
        <Tooltip
          title={groupsStr} // Tooltip title is set to the value of groupsStr
          slotProps={{
            // Defining custom slot properties for Tooltip
            popper: {
              sx: {
                // Custom styling for the popper element based on its placement
                [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                  {
                    marginTop: "0px", // Removes top margin when the tooltip is placed at the bottom
                  },
                [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
                  {
                    marginBottom: "0px", // Removes bottom margin when the tooltip is placed at the top
                  },
                [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]:
                  {
                    marginLeft: "0px", // Removes left margin when the tooltip is placed on the right
                  },
                [`&.${tooltipClasses.popper}[data-popper-placement*="left"] .${tooltipClasses.tooltip}`]:
                  {
                    marginRight: "0px", // Removes right margin when the tooltip is placed on the left
                  },
              },
            },
          }}
          placement="right" // Sets the tooltip placement to the right of the element
        >
          {groupArray > 1 ? ( // Checks if the groupArray has more than one element
            <div>
              <IconButton sx={{ padding: 0 }}>
                {" "}
                {/* IconButton with no padding */}
                <Badge
                  anchorOrigin={{
                    vertical: "top", // Badge is anchored at the top-right corner
                    horizontal: "right",
                  }}
                  badgeContent={groupArray} // Sets the badge content to the groupArray value
                  color="secondary" // Badge color is set to secondary
                >
                  <Chip  label={groups} variant="outlined" />{" "}
                  {/* Displays the groups label inside a Chip component */}
                </Badge>
              </IconButton>
            </div>
          ) : (
            <Chip label={groups} variant="outlined" /> // If groupArray is 1 or less, just displays a Chip with groups label
          )}
        </Tooltip>
      </>
    );
  };

 const StyledBadge = styled(Badge, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ theme, active }) => ({
  '& .MuiBadge-dot': {
    backgroundColor:
      active === undefined
        ? theme.palette.primary.main   // blue (default)
        : active
        ? '#059212'                    // green
        : 'red',                       // red
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
  '& .MuiBadge-dot::after': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    content: '""',
  },
}));
  

  /**
   * Converts a full name into initials.
   *
   * @param {string} name - The full name to be converted.
   * @returns {string} - The initials of the given name. If the name contains two
   * or more parts, returns the first character of the first two parts. If it
   * contains only one part, returns the first character of that part. Returns an
   * empty string for an empty or invalid name.
   */
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

  const formatWorkingHours = (hours) => {
  if (!hours) return "";

  const [start, end] = hours.split("-");

  const startFormatted = dayjs(`2000-01-01 ${start}`).format("h:mm A");
  const endFormatted = dayjs(`2000-01-01 ${end}`).format("h:mm A");

  return `${startFormatted} - ${endFormatted}`;
};

  /**
   * Renders the user information section for a given row of data.
   * This section includes a tooltip with a styled badge, an avatar
   * displaying the user's initials, and the user's name with an admin
   * button if applicable.
   *
   * @param {object} rowData - The data for the user row, including:
   *   - {boolean} active - Indicates if the user is active.
   *   - {string} userName - The name of the user.
   *   - {string} avatarBgColor - The background color for the user's avatar.
   * @returns {JSX.Element} The rendered user information component.
   */
  const userInfo = (rowData) => {
    const backgroundColor = newColors[0];
    // console.log(`checkColor ${backgroundColor}`);

    // newColors.forEach((itm, idx) => console.log("SERESRES",itm));

    return (
      <>
        <div
          style={{
            display: "flex",
            columnGap: "1rem",
            alignItems: "center",
            marginLeft: "2rem",
          }}
        >
          <>
            <Tooltip placement="bottom">
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                variant="dot"
                active={rowData.active}
              >
                <Avatar
                  sizes=""
                  sx={{
                    marginLeft: "auto",
                    bgcolor: rowData.avatarBgColor,
                    fontSize: "0.95rem",
                    width: 32,
                    height: 32,
                  }}
                  variant="outlined"
                >
                  {/* calling the convertToInitials() with the username to format it in the badge (refer convertToInitials() function) */}
                  {convertToInitials(rowData.userName)}
                </Avatar>
              </StyledBadge>
            </Tooltip>
          </>
          <div style={{ display: "grid", justifyItems: "start" }}>
            <Typography sx={{ fontSize: "0.9rem" }}>
              {rowData.userName}
            </Typography>
            {/* if the user is a G360 Admin render that data here */}
            {renderAdminButton(rowData)}
          </div>
        </div>
      </>
    );
  };

  // if the tab is changed to inactive users then fetch the users who are inactive same for active users tab
  const handleTabChange = (event, newValue) => {
    // console.log('handleTabChange')
    setLoader(true); //showing the loader while the data is getting processed
    if (newValue === "2") {
      // console.log("Current Tab is Inactive Users")
      const inactiveUsers = rows.filter((user) => !user.active && !user.isGuest); //filtering inactive users
      setFilteredRows(inactiveUsers);
      setCurrentTab(newValue);
      setLoader(false);
      return;
    }

    if(newValue === "3"){
      // console.log("Current Tab is Guest Users")
      const guestUsers = rows.filter((user) => user?.isGuest); //filtering guest users
      setFilteredRows(guestUsers);
      setCurrentTab(newValue);
      setLoader(false);
      return;
    }

    const activeUsers = rows.filter((user) => user.active); //* filtering active users
    setFilteredRows(activeUsers);
    setCurrentTab(newValue);
    setLoader(false);
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
        <div className="Admin">
          <Toast ref={toast} style={{ zIndex: "9999" }} />
          {/* <Card>
          <CurrentUserStatus
            className="currentUserStatus"
            usersCount={rows.length}
          ></CurrentUserStatus>
        </Card> */}

          <Card>
            <DataTable
              value={filteredSearchData}
              paginator
              stripedRows
              showGridlines={isMobile ? true : false}
              rows={10}
              rowsPerPageOptions={[10, 15, 25, 50]}
              emptyMessage={
                loader ? (
                  <ProgressBar
                    mode="indeterminate"
                    style={{ height: "6px" }}
                  ></ProgressBar>
                ) : (
                  "No Data Available"
                )
              }
              
              header={
                <>
                  <div
                    style={{
                      display: isMobile ? "" : "flex",
                      alignItems: "center",
                      // justifyContent: "flex-end",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* <Typography
                    sx={{ fontWeight: 600, fontSize: isMobile ? "0.8rem" : "" }}
                  >
                    Edit Existing User
                  </Typography> */}

                    <TabContext value={currentTab}>
                      <TabList onChange={handleTabChange} centered>
                        <Tab
                          label={
                            <Badge
                              badgeContent={
                                rows.filter((user) => user.active  && !user.isGuest).length
                              }
                              color="success"
                              sx={{ ".MuiBadge-badge": { fontSize: "0.5rem" } }} // Adjust badge font size
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginRight: ".9rem",
                                }}
                              >
                                <StyledBadge
                                  overlap="circular"
                                  anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                  }}
                                  variant="dot"
                                  active={true}
                                />
                                <span style={{ marginLeft: ".7rem" }}>
                                  Active Users
                                </span>
                              </div>
                            </Badge>
                          }
                          value="1"
                          sx={{ textTransform: "none", fontWeight: 600 }} // Custom styling for the tab
                        />

                        <Tab
                          label={
                            <Badge
                              badgeContent={
                                rows.filter((user) => !user.active && !user.isGuest).length
                              }
                              color="error"
                              sx={{ ".MuiBadge-badge": { fontSize: "0.5rem" } }} // Adjust badge font size
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginRight: ".9rem",
                                }}
                              >
                                <StyledBadge
                                  overlap="circular"
                                  anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                  }}
                                  variant="dot"
                                  active={false}
                                />
                                <span style={{ marginLeft: ".7rem" }}>
                                  Inactive Users
                                </span>
                              </div>
                            </Badge>
                          }
                          value="2"
                          sx={{ textTransform: "none", fontWeight: 600 }} // Custom styling for the tab
                        />
                         <Tab
                          label={
                            <Badge
                              badgeContent={
                                rows.filter((user) => user?.isGuest)?.length
                              }
                              color="secondary"
                              sx={{ ".MuiBadge-badge": { fontSize: "0.5rem" } }} // Adjust badge font size
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginRight: ".9rem",
                                }}
                              >
                                <StyledBadge
                                  overlap="circular"
                                  anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                  }}
                                  variant="dot"
                                  // active={false}
                                />
                                <span style={{ marginLeft: ".7rem" }}>
                                  Guest Users
                                </span>
                              </div>
                            </Badge>
                          }
                          value="3"
                          sx={{ textTransform: "none", fontWeight: 600 }} // Custom styling for the tab
                        />

                      </TabList>
                    </TabContext>
                    <div
                      style={{
                        display: isMobile ? "grid" : "flex",
                        alignItems: "center",
                        justifyItems: "center",
                      }}
                    >
                      {/* <CurrentUserStatus
                      className="currentUserStatus"
                      usersCount={rows.filter((user) => user.active).length}
                    ></CurrentUserStatus> */}
                      <div>
                        <span className="p-input-icon-left">
                          <i className="pi pi-search" />
                          <InputText
                            type="search"
                            size=""
                            className="p-inputtext-sm"
                            onInput={(e) => setSearchQuery(e.target.value)}
                            placeholder="Keyword Search"
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              }
              // selectionMode={rowSelectionMode}
              selectionMode={"single"}
              // stripedRows="true"
              // selection={selectedUser}
              // onSelectionChange={(e) => setSelectedUser(e.value)}
              // dataKey="userId"
              onRowClick={onRowSelect}
              onRowUnselect={onRowUnselect}
              metaKeySelection={true}
              size={"small"}
              className="UserInfoTableStyle HeaderColor"
              //tableStyle={{ fontSize: "0.9rem" }}
            >
              <Column
                sortable
                header={<span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
    <i className="pi pi-user"></i>
    User Name
  </span>}
                body={userInfo}
                headerStyle={{
                  fontSize: "0.8rem",
                  width: "20rem",
                }}               
                field="userName"
                bodyStyle={{ textAlign: "center" }}
              ></Column>
              <Column
                //headerStyle={{ fontSize: "0.8rem", width: "20rem" }}
                sortable
                field="userID"
                header={<span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
    <i className="pi pi-envelope"></i>
   Email
  </span>}
                bodyStyle={{ textAlign: "center",fontSize:'.9rem' }}
              ></Column>
              {/* <Column
              headerStyle={{ fontSize: "0.8rem" }}
              field="userName"
              header="Name"
              
              bodyStyle={{ textAlign: "center" }}
            ></Column> */}
              <Column
                headerStyle={{
                  fontSize: "0.8rem",
                  width: "20rem",
                }}
                sortable
                field="phone"
                header={<span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
    <i className="pi pi-phone"></i>
   Phone
  </span>}
                bodyStyle={{ textAlign: "center",fontSize:'.9rem' }}
              ></Column>
              <Column
                headerStyle={{
                  fontSize: "0.75rem",
                  width: "12rem",
                }}
                field="group"
                header={<span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
    <i className="pi pi-users"></i>
   Group
  </span>}
                body={renderGroups}
                bodyStyle={{ textAlign: "center" }}
                sortable
              ></Column>
               <Column
                headerStyle={{
                  fontSize: "0.75rem",
                  width: "12rem",
                }}
                field="workingHours"
                header={<span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
    <i className="pi pi-clock"></i>
   Working Hours
  </span>}
                style={{fontSize:'.8rem'}}
                // body={renderGroups}
                body={(rowData) => formatWorkingHours(rowData.workingHours)}
                bodyStyle={{ textAlign: "center" }}
                sortable
              ></Column>
              {/* <Column
              headerStyle={{ fontSize: "0.8rem" }}
              field="g360Admin"
              header="G360Admin"
              bodyStyle={{ textAlign: "center" }}
              body={renderAdminButton}
            ></Column> */}
              {/* <Column
              headerStyle={{ fontSize: "0.8rem" }}
              field="active"
              header="Status"
              bodyStyle={{ textAlign: "center" }}
              body={renderStatusButton}
            ></Column> */}

              <Column
                headerStyle={{
                  fontSize: "0.75rem",
                  width: "12rem",
                }}
                header={<span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
    <i className="pi pi-lock"></i>
   Password
  </span>}
                bodyStyle={{ textAlign: "center" }}
                body={renderChangePassword}
              ></Column>

              <Column
                headerStyle={{
                  fontSize: "0.8rem",
                  width: "8rem",
                }}
                header={<span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
    <i className="pi pi-file"></i>
  Logs
  </span>}
                bodyStyle={{ textAlign: "center" }}
                body={renderTransactionLogButton}
              ></Column>
            </DataTable>
          </Card>

          {/* <Button style={buttonStyle} label="" onClick={() => setVisible(true)}>
          <i className="pi pi-user-plus"></i>
        </Button> */}
          {isMobile || (
            <Tooltip title="Add User" placement="top">
              <Fab
                size="large"
                variant="extended"
                color="secondary"
                aria-label="add"
                sx={{ position: "fixed", left: "94%", bottom: "5%" }}
                onClick={() => navigate("/workflow/userDetails")}
              >
                {/* <AddIcon /> */}
                <i className="pi pi-user-plus"></i>

                <Badge
                  //badgeContent={overviewTableData.length}
                  color="primary"
                ></Badge>
              </Fab>
            </Tooltip>
          )}
         

        
          {/* Change Password Dialog */}

          <Dialog
            header={
              <>
                Change Password:
                <Chip
                  label={
                    changePasswordData.userData.userName +
                    " ( " +
                    changePasswordData.userData.userID +
                    " )"
                  }
                  variant="filled"
                  color="primary"
                  size="small"
                  style={{ marginLeft: 8 }}
                />
              </>
            }
            visible={changePassowordDialogvisible}
            style={{ width: isMobile ? "95%" : "50vw" }}
            onHide={() => {
              if (!changePassowordDialogvisible) return;
              setChangePasswordData({
                userData: {},
                passwordData: "",
                confirmPasswordData: "",
              });
              setChangePassowordDialogVisible(false);
            }}
          >
            <div>
              <br />
              <FloatLabel>
                <Password
                  value={changePasswordData.passwordData}
                  // invalid={changePasswordData.passwordData === ""}
                  onChange={(e) =>
                    setChangePasswordData({
                      ...changePasswordData,
                      passwordData: e.target.value,
                    })
                  }
                  toggleMask
                />
                <label htmlFor="passwordData"> New Password</label>
              </FloatLabel>
              <br />
              <FloatLabel>
                <Password
                  invalid={
                    // changePasswordData.passwordData === "" ||
                    changePasswordData.passwordData !==
                      changePasswordData.confirmPasswordData
                  }
                  value={changePasswordData.confirmPasswordData}
                  onChange={(e) =>
                    setChangePasswordData({
                      ...changePasswordData,
                      confirmPasswordData: e.target.value,
                    })
                  }
                  toggleMask
                />
                <label htmlFor="confirmPasswordData">Confirm Password</label>
              </FloatLabel>
              <br />
              <Button
                label="Save"
                severity="success"
                icon="pi pi-save"
                onClick={handlePasswordChange}
                disabled={changePasswordData.passwordData === "" ||
                  changePasswordData.confirmPasswordData === "" ||
                  changePasswordData.passwordData !==
                    changePasswordData.confirmPasswordData}
              />
            </div>
          </Dialog>

          {/* TransactionsDialog */}
          <Dialog
            visible={transactionsDialog}
            maximizeIcon
            minimizeIcon
            style={{ width:isMobile?"95%" :"70vw",height:isMobile?"70%" :"40rem" }}
            onHide={() => {
              if (!transactionsDialog) return;
              setTransactionsDialog(false);
              setTransactionsUser("");
            }}
            header=<div style={{display:"flex",columnGap:"0.7rem"}}>
                    Transactions 
                    <Chip
                      size="small"
                      color="info"
                      label={`${transactionsUser}`}
                    />
                  </div>
          >
            <div>
              <DataTable
                className="UserInfoTableStyle dataTableStyle HeaderColor"
                value={transactionsDialogData}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
                dataKey="transaction_id"
               
                // header="Transactions"
                stripedRows
              >
                <Column expander />
                <Column
                  field="transaction_id"
                  header="Transaction ID"
                  sortable
                />
                <Column field="timestamp" header="Time" sortable />
                <Column body={(rowData)=><Chip label={rowData.modified_by}/>} header="Modified By"  />
                <Column  style={{ width: '20rem' }} field="data" header="Information Modified"  />
              </DataTable>
            </div>
          </Dialog>
        </div>
      </Container>
      {isMobile && (
        <AppBar
          position="fixed"
          color="primary"
          sx={{ top: "auto", bottom: 0 }}
        >
          <BottomNavigation showLabels>
            <BottomNavigationAction
              label="Add User"
              onClick={() => navigate("/workflow/userDetails")}
              icon={<PersonAddIcon color="primary" />}
            />
          </BottomNavigation>
        </AppBar>
      )}
    </>
  );
}
