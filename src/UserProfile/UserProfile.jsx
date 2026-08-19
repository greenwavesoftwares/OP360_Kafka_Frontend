import React, { useEffect, useRef, useState } from "react"; // Importing React along with useEffect, useRef, and useState hooks
import UserDetails from "./UserDetails"; // Importing UserDetails component
//import PasswordChangeForm from "./PasswordChange" // (Commented out) Potential import for password change form
import { Button } from "primereact/button"; // Importing Button component from PrimeReact

import { Box, Card, Chip, Container, Tab, Tabs, useMediaQuery, useTheme } from "@mui/material"; // Importing various MUI components like Box, Card, Container, Tab, and Tabs
//icon
import LockResetIcon from "@mui/icons-material/LockReset"; // Importing LockReset icon from MUI
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts"; // Importing ManageAccounts icon from MUI
import { TabContext, TabPanel } from "@mui/lab"; // Importing TabContext and TabPanel components from MUI's Lab package
import { Password } from "primereact/password"; // Importing Password component from PrimeReact for password input
import { Toast } from "primereact/toast"; // Importing Toast component from PrimeReact for showing notifications
import { useLocation, useNavigate } from "react-router-dom"; // Importing useNavigate hook from React Router to programmatically navigate between pages
import { getCurrentUser } from "../UserModuleUpdated/helper"; // Importing helper function to get the current user details
import {
  changeUserPassword,
  checkOldPassword,
  getTenantID,
  getUserDetailsByUserID,
} from "../UserModuleUpdated/UsermoduleApi"; // Importing API functions for changing user password, checking old password, getting tenant ID, and fetching user details by user ID
import { fetchAllotedPagesByUserId } from "../CommonAPI";
import { extendTokenExpiration } from "../helper/AuthService";
import LoginIcon from '@mui/icons-material/Login';

export default function UserProfile() {
  const [currentUser, setCurrentUser] = useState({}); // State to hold the current user's details, initialized as an empty object
  const toast = useRef(null); // useRef to reference the Toast component for displaying notifications
  const theme = useTheme(); // Access the current theme
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const [userId, setUserId] = useState(localStorage.getItem("username")); // (Commented out) Potential state for storing the user ID from session storage
  const [value, setValue] = useState("1"); // State to manage the current tab value, defaulting to the first tab
  const [userPassword, setUserPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  }); // State to manage the user's password, containing fields for old, new, and confirmed passwords
  const [oldPswdVerified, setOldPswdVerified] = useState(false); // State to track whether the old password has been verified, initialized as false

  const navigate = useNavigate(); // useNavigate hook to programmatically navigate between routes
  const location =useLocation();

  useEffect(() => {
    // console.log("UseEffect() called for UserHomeDashboard  ");
    // extendTokenExpiration();
    // userHasPageAccess();
    fetchUserDetails();
  }, []);

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
   * Fetches user details for the currently logged in user.
   * The API request is made using getUserDetailsByUserID from UserModuleUpdated/UsermoduleApi.
   * If the API call is successful, the user details are stored in the currentUser state.
   * @returns {void}
   */
  const fetchUserDetails = async () => {
    const userData = await getUserDetailsByUserID(getCurrentUser());
    console.log("User Details from API ", userData);
    if (userData) {
      setCurrentUser(userData);
    }
  };

  /**
   * Handles the tab change event.
   *
   * This function is triggered when the user navigates between tabs.
   * It logs the new tab value to the console and updates the state
   * with the new tab value.
   *
   * @param {Object} event - The event object associated with the tab change.
   * @param {string} newValue - The value of the newly selected tab.
   */
  const handleChange = (event, newValue) => {
    // console.log("New Value : ", newValue);
    setValue(newValue);
  };

  //   const getCurrentUser = () => {
  //     const env_userId = process.env.REACT_APP_USERID;

  //     const user = localStorage.getItem(env_userId);
  //     const current_Admin = decryptTokenId(user);
  //     return current_Admin;
  //   };

  /**
   * Verifies the user's old password.
   *
   * This asynchronous function checks if the old password entered by the user is correct.
   * If the password is verified, it shows a success toast message and updates the state to
   * indicate that the old password has been verified. If the password verification fails,
   * it displays an error toast message prompting the user to check their old password.
   *
   * @returns {Promise<void>}
   */
  const handleCheckPassword = async () => {
    const isOldPasswordVerified = await checkOldPassword(
      userPassword.oldPassword
    );
    // console.log("isOldPasswordVerified",isOldPasswordVerified);
    if (isOldPasswordVerified) {
      // console.log("Old Password is verified now the new Password Change will get invoked")

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Old Password verified !",
        life: 3000,
      });

      setOldPswdVerified(true);
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please check your old password ! ",

        life: 3000,
      });
    }
  };

  /**
   * Handles the submission of the change password form.
   * Fetches the currently logged in user's details and changes the password to the new one.
   * If the password change is successful, shows a success toast message and resets the form fields.
   * If the password change fails, shows an error toast message prompting the user to check their input.
   * @returns {Promise<void>}
   */
  const handleSubmitChangePassowrd = async () => {
    // console.log('handleSubmitChangePassowrd() called')
    const user = await getUserDetailsByUserID(getCurrentUser());
    // console.log("User Fetched before Resetting the password : ",user)
    const isPasswordChanged = await changeUserPassword({
      ...user,
      password: userPassword.newPassword,
    });
    // console.log("Response from isPasswordChange : ",isPasswordChanged)
    if (isPasswordChanged) {
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Password updated successfully",
        life: 3000,
      });
      handleReset();

      setTimeout(() => {
        navigate(`/`);
        localStorage.removeItem("lv_user.tenantId");
        localStorage.removeItem("lv_user.userID");
        localStorage.removeItem("token");
        // setValue("1");
      }, 300);
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error ! ",

        life: 3000,
      });
    }
  };

  /**
   * Resets the userPassword state and oldPswdVerified state to their initial values.
   * This function is called when the user has successfully changed their password and the form fields need to be reset.
   * @returns {void}
   */
  const handleReset = () => {
    setUserPassword({
      ...userPassword,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setOldPswdVerified(false);
  };

  // const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{padding:isMobile?"0":""}}>
      <Card sx={{ padding: "0.8rem" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Toast ref={toast} style={{ zIndex: "9999" }} />
          {/* Ensure value is set for TabContext */}
          <TabContext value={value}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="icon position tabs example"
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              <Tab
                value="1"
                sx={{ textTransform: "capitalize", minHeight: "0" }}
                icon={<ManageAccountsIcon />}
                iconPosition="start"
                label="Account Info"
              />
              <Tab
                value="2"
                sx={{ textTransform: "capitalize", minHeight: "0" }}
                icon={<LockResetIcon />}
                iconPosition="start"
                label="Change Password"
              />
            </Tabs>

            <TabPanel value="1">
              {currentUser.userID ? (
                <UserDetails
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              ) : (
                "Loading user details..."
              )}
            </TabPanel>
           { !currentUser.isGuest && <TabPanel value="2">
              {/* {userPassword.oldPassword} */}
              {!oldPswdVerified && (
                <div className="card flex justify-content-center" style={{flexDirection: "column",alignItems:"center"}}>
                  <Password
                    variant="filled"
                    value={userPassword.oldPassword}
                    onChange={(e) =>
                      setUserPassword({
                        ...userPassword,
                        oldPassword: e.target.value,
                      })
                    }
                    feedback={false}
                    tabIndex={1}
                    toggleMask
                    placeholder="Old Password"
                  />
                  &nbsp;
                  <br/>
                  <Button
                    label="Check"
                    severity="success"
                    icon="pi pi-check-circle"
                    size="small"
                    outlined
                    onClick={handleCheckPassword}
                    disabled={userPassword.oldPassword === ""}
                  />
                </div>
              )}

              {oldPswdVerified && (
                <div>

<div style={{display:"flex",justifyContent:"flex-end" ,paddingBottom:"1rem"}}>
                  <Chip size="small" color="success"   sx={{ fontSize: '0.65rem' }} icon={<LoginIcon />}  label="You will be redirected to Login page after successful password change" />
                  </div>
                  <div className="card flex justify-content-center" style={{flexDirection: "column",alignItems: "center"}}>
                    <Password
                      variant="filled"
                      value={userPassword.newPassword}
                      onChange={(e) =>
                        setUserPassword({
                          ...userPassword,
                          newPassword: e.target.value,
                        })
                      }
                      feedback={false}
                      tabIndex={2}
                      toggleMask
                      placeholder="New Password"
                    />
                    &nbsp;
                    <Password
                      variant="filled"
                      value={userPassword.confirmPassword}
                      onChange={(e) =>
                        setUserPassword({
                          ...userPassword,
                          confirmPassword: e.target.value,
                        })
                      }
                      feedback={false}
                      tabIndex={3}
                      toggleMask
                      placeholder="Confirm Password"
                    />
                    &nbsp;
                  </div>
                     
                  <div className="card flex justify-content-center">
                    <Button
                      label="Submit"
                      severity="success"
                      icon="pi pi-check-circle"
                      size="small"
                      outlined
                      onClick={handleSubmitChangePassowrd}
                      disabled={
                        userPassword.newPassword.length === 0 ||
                        userPassword.confirmPassword.length === 0 ||
                        userPassword.newPassword !==
                          userPassword.confirmPassword
                      }
                    />{" "}
                    &nbsp;
                    <Button
                      severity="info"
                      icon="pi pi-history"
                      size="small"
                      onClick={handleReset}
                      outlined
                    />
                    
                  </div>
                 
                </div>
                
              )}
            </TabPanel>
}
          </TabContext>
        </Box>
      </Card>
    </Container>
  );
}
