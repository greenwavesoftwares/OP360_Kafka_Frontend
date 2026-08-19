import React, { useCallback, useEffect } from "react";
import "./LoginPage.css";
// Importing React library, along with 'useEffect' hook, which allows performing side effects in the component.
import LoginIcon from "@mui/icons-material/Login";
import {
  Button,
  Container,
  Grid,
  Card,
  TextField,
  Typography,
  Box,
  Alert,
  Snackbar,
  Slide,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  Checkbox,
  Tooltip,
  InputAdornment,
  IconButton,
} from "@mui/material";
// import { motion } from "framer-motion";
import { Visibility, VisibilityOff } from "@mui/icons-material";
// Importing various Material UI components:
// - Button: Material UI button component for clickable actions.
// - Container: A wrapper to manage the layout and spacing of child components.
// - Grid: Component to create a grid layout (used to organize the page structure).
// - Card: Used for displaying content inside a card layout.
// - TextField: Input field component for text inputs like username and password.
// - IconButton: A button for icons, often used for UI elements.
// - Typography: For managing text and headings in Material UI.
// - Box: A simple div-like component for layout purposes.
// - Alert: Displays a message inside a box with varying levels of severity (info, error, success).
// - Snackbar: Provides notifications as popups on the screen.
// - Slide: Handles transition animation for Snackbar.
// - Dialog: A modal window component for user interactions.
// - DialogActions, DialogContent, DialogContentText, DialogTitle: Subcomponents of Dialog used to manage the content, title, and actions inside the dialog box.

// import loginImage from "../Image/bg-login.png"; // Importing the login background image used for visual elements.

import debounce from "lodash.debounce";

import CloseIcon from "@mui/icons-material/Close";

// import Operations360logo from "../Image/logo.png"; // Importing the logo of the application to be displayed on the login page.
// import Greenwavelogo from "../Image/gw-logo.png";
import { useState } from "react"; // Importing 'useState' hook from React to manage component-level state variables.

// Importing helper functions from an external AuthService file:
import {
  decryptTokenId, // - decryptTokenId: A function to decrypt stored tokens, used to pre-fill login data.
  login,
  userWiseTenant, // - login: Function to handle the actual login process by interacting with backend APIs.
} from "../helper/AuthService";

// Importing hooks from 'react-router-dom' for navigation and working with routes:
import {
  useLocation, // - useLocation: Allows access to the current URL and query parameters.
  useNavigate, // - useNavigate: Used to navigate programmatically to different routes in the application.
} from "react-router-dom";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Importing 'FontAwesomeIcon' component for using FontAwesome icons in the UI.

import { useTheme } from "@mui/material/styles"; // Importing 'useTheme' from Material UI to access the theme object for responsive design and custom styling.

import useMediaQuery from "@mui/material/useMediaQuery"; // Importing 'useMediaQuery' to create media queries in the component, often used for responsive design (e.g., checking if the screen is mobile-sized).

// Importing functions from the UserModule API:
import {
  changeUserPassword, // - changeUserPassword: Function to change the user’s password, called when the password is expired or during the first login.
  fetchAllPageDetails, // - fetchAllPageDetails: Used to fetch all available pages to route the user to the correct home page after login.
  updateLastLogin, // - updateLastLogin: Updates the last login time of the user after a successful login.
} from "../UserModuleUpdated/UsermoduleApi";

import { InputText } from "primereact/inputtext"; // Importing 'InputText' from PrimeReact library, used for input fields like passwords.

// import { RotatingLines } from "react-loader-spinner"; // Importing 'RotatingLines' component from 'react-loader-spinner' to display a loading spinner when login is in progress.

import { Dropdown } from "primereact/dropdown";
import GreenwaveComponent from "./GreenwaveComponent";
import MaximizeWindow from "./MaximizeWindow";

import GreenwaveLogoPNG from "../Image/gw-logo.png";
import { checkTenantExpiration } from "../Tenant/TenantApi";
import { initPushNotifications } from "../pwa/initPushNotifications";
import SplashScreen from "./SplashScreen";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// This component handles user login for the application
function Login() {
  const [username, setUsername] = useState(""); // This username state variable holds username of the user
  const [password, setPassword] = useState(""); // This password state variable holds password of the user
  const [snackbarSeverity, setsnackbarSeverity] = useState(""); // snackbarSeverity state variable holds the Severity of a snackbar (success, error, info etc.)
  const [open, setOpen] = useState(false); // Manages whether the snackbar is visible
  const [snackbarText, setSnackbarText] = useState(""); // this state variable shows the text of snackbar
  const [loading, setLoading] = useState(false); // Shows loading spinner when login is in progress
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] =
    useState(false); // Manages password change dialog visibility
  const navigate = useNavigate(); // Helps navigate to different pages

  const [loggedInUser, setLoggedInUser] = useState(null); // Holds the information of a currently logged-in user

  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  // States for tenant selection dialog
  const [tenantDialogOpen, setTenantDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // States for tenent and multiple tenants(if present)
  const [tenant, setTenant] = useState(
    localStorage.getItem("savedTenant")
      ? localStorage.getItem("savedTenant")
      : null,
  );
  const [multipleTenants, setMultipleTenants] = useState([]);

  // const [showDropdown, setShowDropdown] = useState(true);

  const theme = useTheme(); // detect the theme
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // using theme to detect the screen resolution

  // Get URL parameters (like tenantId) from the page location
  const location = useLocation();
  // const urlParams = new URLSearchParams(location.search);

  const [isChecked, setIsChecked] = useState(true);

  const [oneTenantPresent, setOneTenantPresent] = useState(false);

  // At the top of Login(), add:
  const [splashVisible, setSplashVisible] = useState(true);
  const [splashError, setSplashError] = useState("");

  const handleTenantCheck = useCallback(
    debounce(async (username) => {
      const savedTenant = localStorage.getItem("savedTenant");
      const userWiseTenants = await userWiseTenant(username);

      if (userWiseTenants) {
        if (userWiseTenants.length === 0) {
          setTenantDialogOpen(true);
          setMultipleTenants([]);
          handleClick();
          setSnackbarText(`No Tenant found for Email : ${username}`);
          setsnackbarSeverity("error");
          return;
        } else {
          setMultipleTenants(userWiseTenants);
          setTenantDialogOpen(true);
        }

        // If only one tenant is available, select it & save it automatically
        if (userWiseTenants.length === 1) {
          const singleTenant = userWiseTenants[0];
          setTenant(singleTenant);
          setMultipleTenants([singleTenant]);
          localStorage.setItem("savedTenant", singleTenant);
          setTenantDialogOpen(true); // Close the dialog since there's no need for selection
          return;
        }

        if (savedTenant) {
          setTenantDialogOpen(false);
          return;
        }
      } else {
        handleClick();
        setSnackbarText(`No Tenant found for the Email : ${username}`);
        setsnackbarSeverity("error");
      }
    }, 600),
    [],
  );

  // useEffect(() => {
  //   const timer = setTimeout(() => setSplashVisible(false), 2000); // 2s splash
  //   return () => clearTimeout(timer);
  // }, []);

  // const [savedTenant, setSavedTenant] = useState(
  //   localStorage.getItem("savedTenant")
  // );

  // const handleTenantExpiration = async () => {
  //   try {
  //     await checkTenantExpiration();
  //   } catch (error) {
  //     console.error("Error handling tenant expiration:", error);
  //   }
  // };

  // console.log("useEffect triggered → calling handleTenantExpiration");
  // handleTenantExpiration();

  // useEffect runs when the component mounts, checking for tenant ID and session data
  useEffect(() => {
    // check If the session storage has a password, decrypt it to pre-fill username and password fields of the login form
    if (localStorage.getItem(process.env.REACT_APP_PASSWORD)) {
      setUsername(
        decryptTokenId(localStorage.getItem(process.env.REACT_APP_USERID)),
      ); // setting the username
      setPassword(
        decryptTokenId(localStorage.getItem(process.env.REACT_APP_PASSWORD)),
      ); //setting the password
    }
  }, [location.search]); // Only re-run the effect when the search string changes

  // NEW: Redirect to homepage if user is already logged in with a valid token
  useEffect(() => {
    console.log("useEffect called");

    const checkExistingSession = async () => {
      const token = localStorage.getItem("token"); // or whatever key stores your JWT
      const savedUser = localStorage.getItem(process.env.REACT_APP_USERID);
      const savedTenant = localStorage.getItem("savedTenant");

      // No session — don't show splash at all, stay on login
      if (!token || !savedUser || !savedTenant) {
        setSplashVisible(false);
        return; // No session, stay on login page
      }

      // Valid session tokens exist — show splash while validating
      setSplashVisible(true);

      try {
        // Validate token by fetching pages (uses the token internally via your API interceptors)
        const allPages = await fetchAllPageDetails();

        if (allPages && allPages.length > 0) {
          // Token is valid — get the stored homepage or fall back to profile
          const workFlowHomePage = localStorage.getItem(
            process.env.REACT_APP_HOMEPAGE,
          ); // adjust key as needed
          const requiredPage = allPages.find(
            (data) =>
              workFlowHomePage &&
              data.page.toLowerCase() === workFlowHomePage.toLowerCase(),
          )?.pageUrl;

          setSplashVisible(false);
          navigate(requiredPage || "/workflow/userprofile", { replace: true });
        } else {
          // Pages returned empty — likely a soft API failure
          setSplashError("Failed to load session. Please log in again.");
          setTimeout(() => setSplashVisible(false), 2500); // Let user read the error
        }
      } catch (error) {
        // Token is invalid/expired — clear storage and stay on login page
        console.warn("Session validation failed, clearing storage:", error);
        setSplashError(
          "Connection error. Please check your network and try again.",
        );
        setTimeout(() => setSplashVisible(false), 2500);
        const savedTenantBackup = localStorage.getItem("savedTenant");
        localStorage.clear();
        if (savedTenantBackup)
          localStorage.setItem("savedTenant", savedTenantBackup);
      }
    };

    checkExistingSession();
  }, []); // Runs only once on mount

  useEffect(() => {
    return () => {
      handleTenantCheck.cancel(); // Cancel debounce on component unmount
    };
  }, [handleTenantCheck]);

  // Opens the snackbar notification
  const handleClick = () => {
    setOpen(true);
  };

  // Closes the snackbar notification
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return; // Prevents snackbar from closing on a click outside
    }
    setOpen(false);
  };

  // Method to validate input fields and show error notification if needed
  const validateLoginInput = (username, password) => {
    if (!username || !password) {
      handleClick();
      setSnackbarText("Email and password are required.");
      setsnackbarSeverity("error");
      return false;
    }
    return true;
  };

  // Method to call the login API
  const performLogin = async (username, password, tenantId) => {
    const savedTenant = localStorage.getItem("savedTenant");

    if (savedTenant) {
      localStorage.clear();
      localStorage.setItem("savedTenant", savedTenant);
    } else {
      localStorage.clear();
    }

    return await login(username, password, tenantId);
  };

  // Method to check password expiry and handle first login requirements
  const checkPasswordExpiry = (loggedIn) => {
    const today = new Date();
    const formattedToday = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
    const todayDate = new Date(formattedToday);
    const expiryDate = new Date(loggedIn.passwordExpiryDate);

    return todayDate >= expiryDate || loggedIn.firstLoginRequired;
  };

  // Method to navigate to the user-specific page or default profile
  const navigateToHomePage = async (loggedIn) => {
    // if (checkTenantExpirationCheck === 3) {
    //   handleClick();
    //   setSnackbarText(
    //     "Your license has expired. Please renew it to continue using the service"
    //   );
    //   setsnackbarSeverity("error");
    //   return;
    // }
    const allPages = await fetchAllPageDetails();
    const requiredPage = allPages?.find(
      (data) =>
        data.page.toLowerCase() === loggedIn.workFlowHomePage.toLowerCase(),
    )?.pageUrl;

    if (requiredPage) {
      localStorage.setItem(process.env.REACT_APP_HOMEPAGE, requiredPage);
      navigate(requiredPage, { replace: true });
      await updateLastLogin(loggedIn);
    } else {
      localStorage.setItem(
        process.env.REACT_APP_HOMEPAGE,
        "/workflow/userprofile",
      );
      navigate("/workflow/userprofile");
    }
  };

  // Method to handle login error
  const handleLoginError = () => {
    handleClick();
    setSnackbarText("Failed to login. Check Email and password and Tenant ID");
    setsnackbarSeverity("error");
  };

  const formatDate = (date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  // Main handleLogin function, now broken down into smaller methods
  const handleLogin = async (username, password, tenantId) => {
    if (!validateLoginInput(username, password)) return;

    setLoading(true);

    if (tenant && tenant !== null) {
      const loggedInObject = await performLogin(username, password, tenant);

      if (loggedInObject && loggedInObject !== null) {
        console.log("useEffect triggered → calling handleTenantExpiration");
        const { status, expiryDate, graceExpiry } =
          await checkTenantExpiration(tenant);
        if (status === 3) {
          console.log("expired + grace over");
          handleClick();
          setSnackbarText(
            `Your subscription has expired on ${formatDate(
              expiryDate,
            )}. Please Subscribe again.`,
          );
          setsnackbarSeverity("error");
          setLoading(false);
          return;
        } else if (status === 0) {
          console.log("error occured while checking tenant expiry");
          handleClick();
          setSnackbarText(
            `An unexpected error occurred while checking your subscription.`,
          );
          setsnackbarSeverity("error");
          setLoading(false);
          return;
        }
        localStorage.setItem("savedTenant", tenant);

        setLoggedInUser(loggedInObject);
        if (status === 2) {
          console.log("expired but within grace");
          handleClick();
          setSnackbarText(
            `Your subscription expired on ${formatDate(
              expiryDate,
            )}. You are currently within the grace period and will lose access after ${formatDate(
              graceExpiry,
            )}.`,
          );
          setsnackbarSeverity("error");
        }
        if (checkPasswordExpiry(loggedInObject)) {
          setChangePasswordDialogOpen(true);
        } else {
          const response = await initPushNotifications(loggedInObject);
          console.log("pushnotification response :: ", response);
          await navigateToHomePage(loggedInObject);
        }
      } else {
        handleLoginError();
      }
    } else {
      handleLoginError();
    }

    setLoading(false);
  };

  // Fetch user-wise tenants and show a dropdown if multiple tenants are present
  const fetchUserWiseTenant = async () => {
    const userWiseTenants = await userWiseTenant(username);
    if (userWiseTenants && userWiseTenants.length > 0) {
      if (userWiseTenants.length === 1) {
        setTenantDialogOpen(true);
        const tenantId = userWiseTenants[0];
        setMultipleTenants([userWiseTenants[0]]);
        localStorage.removeItem("savedTenant");
        setTenant(tenantId);
        setOneTenantPresent(true);
      } else {
        // If multiple tenants are found, show tenant selection dialog
        setTenantDialogOpen(true);
        setMultipleTenants(userWiseTenants);
      }
    } else {
      handleClick();
      setSnackbarText(`No Tenant found for Email : ${username}`);
      setsnackbarSeverity("error");
    }
  };

  // Render the change password dialog if required
  const renderChangePassword = (loggedInUser) => (
    <Dialog
      open={changePasswordDialogOpen}
      onClose={() => setChangePasswordDialogOpen(false)}
      aria-labelledby="form-dialog-title"
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: 3, p: 1 }, // Material UI style if using MUI
      }}
    >
      <DialogTitle className="py-2">Change Password</DialogTitle>

      <DialogContent>
        <DialogContentText className="mb-3 text-gray-700">
          {loggedInUser?.firstLoginRequired
            ? "This is your first login. Please set a new password."
            : "Your password has expired. Please set a new password."}
        </DialogContentText>

        {/* New Password Field */}
        <div className="mb-4">
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            New Password
          </label>
          <InputText
            type="password"
            id="newPassword"
            placeholder="Enter new password"
            required
            className={`w-full p-inputtext-sm ${
              newPassword && confirmPassword && newPassword !== confirmPassword
                ? "p-invalid"
                : ""
            }`}
            onChange={(e) => setNewPassword(e.target.value.trim())}
            value={newPassword}
          />
        </div>

        {/* Confirm Password Field */}
        <div className="mb-1">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 "
          >
            Confirm Password
          </label>
          <InputText
            type="password"
            id="confirmPassword"
            placeholder="Re-enter new password"
            required
            className={`w-full p-inputtext-sm ${
              newPassword && confirmPassword && newPassword !== confirmPassword
                ? "p-invalid"
                : ""
            }`}
            onChange={(e) => setConfirmPassword(e.target.value.trim())}
            value={confirmPassword}
          />
        </div>
      </DialogContent>

      <DialogActions className="px-4 py-2">
        <Button
          onClick={() => setChangePasswordDialogOpen(false)}
          color="error"
          variant="contained"
          size="small"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={async () => {
            const updatedLoggedInUser = {
              ...loggedInUser,
              password: confirmPassword,
            };
            const response = await changeUserPassword(updatedLoggedInUser);
            if (response) {
              navigate(`/`);
            } else {
              handleClick();
              setSnackbarText("Error Changing password");
              setsnackbarSeverity("error");
              return;
            }
            setChangePasswordDialogOpen(false);
            setNewPassword("");
            setConfirmPassword("");
            handleClick();
            setSnackbarText("Successfully changed password !");
            setsnackbarSeverity("success");
          }}
          color="primary"
          disabled={
            !newPassword || !confirmPassword || newPassword !== confirmPassword
          }
        >
          Change Password
        </Button>
      </DialogActions>
    </Dialog>
  );

  // const handleTenantCheck = useCallback(
  //   debounce(
  //     // Function to check and handle tenant-related logic, debounced to prevent excessive calls
  //     async (username) => {
  //       const savedTenant = localStorage.getItem("savedTenant"); // Retrieve any saved tenant from local storage

  //       const userWiseTenants = await userWiseTenant(username); // Fetch tenants associated with the username

  //       if (userWiseTenants) {
  //         // If tenants are found
  //         if (userWiseTenants.length === 0) {
  //           // No tenants found
  //           setTenantDialogOpen(true); // Open tenant dialog
  //           setMultipleTenants([]); // Reset the tenant list
  //           handleClick(); // Trigger a UI action, such as opening a snackbar
  //           setSnackbarText(`No Tenant found for Email : ${username}`); // Set error message text
  //           setsnackbarSeverity("error"); // Set snackbar severity to error
  //           return; // Exit the function
  //         } else {
  //           // Tenants found
  //           setMultipleTenants(userWiseTenants); // Update the tenant list
  //           setTenantDialogOpen(true); // Open tenant dialog
  //         }

  //         if (savedTenant) {
  //           // If a tenant is already saved
  //           setTenantDialogOpen(false); // Close tenant dialog
  //           return; // Exit the function
  //         }
  //       } else {
  //         // If no tenants are found for the username
  //         handleClick(); // Trigger a UI action, such as opening a snackbar
  //         setSnackbarText(`No Tenant found for the Email : ${username}`); // Set error message text
  //         setsnackbarSeverity("error"); // Set snackbar severity to error
  //       }
  //     },
  //     600 // Debounce delay in 600 milliseconds, prevents rapid repeated calls (1000 = 1 second)
  //   ),
  //   [] // Dependency array, ensures stable reference for the function
  // );

  // Trigger debounced tenant check on username change
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    // if (emailRegex.test(value)) handleTenantCheck(value); // Call debounced function with the new value
    handleTenantCheck(value); // Call debounced function with the new value
  };

  // The main component that returns a login form layout
  return (
    // A container with a maximum width of "lg" and no padding
    <div
      className="background-image"
      style={
        {
          //display:isMobile?"none":"block"
        }
      }
    >
      <SplashScreen visible={splashVisible} error={splashError} />
      <div>
        <img
          src={GreenwaveLogoPNG}
          alt="Greenwave Logo"
          className="gwLogoStyle"
        />
      </div>
      <Container maxWidth="lg" sx={{ padding: "0" }}>
        <MaximizeWindow />
        <Box>
          {/* A box that centers the login form in the middle of the screen */}
          <Box
            sx={{
              position: "absolute", // Makes the box position absolute to the screen
              top: "50%", // Moves the box halfway down the screen
              left: "50%", // Moves the box halfway across the screen
              transform: "translate(-50%, -50%)", // Centers the box perfectly
              width: isMobile ? "90%" : "70%", // Sets the width based on whether it's on mobile or not
              borderRadius: 3,
              boxShadow: isMobile ? 2 : "",
            }}
          >
            {/* A grid layout to arrange items horizontally */}
            <Grid
              container
              sx={{
                background: "none", // Sets the background color to white
                boxShadow: 0, // Adds a shadow around the grid
              }}
              spacing={0} // No space between grid items
            >
              {/* First half of the grid - the login form */}
              <Grid item xs={12} sm={8}>
                {/* A card to hold the form */}
              </Grid>

              {/* Second half of the grid - an image shown only on non-mobile screens */}

              <Grid item xs={12} sm={4}>
                {/* A card to hold the form */}
                <Card sx={{ boxShadow: 0, padding: 2, borderRadius: 2 }}>
                  {" "}
                  {/* No shadow on this card and padding of 3 */}
                  {/* Another grid inside the card for aligning content */}
                  <Grid container>
                    {/* The company logo at the top */}
                    <Grid
                      // sx={{ mb: 1.5, mt: 1.5,display:"flex",alignItems: 'center',columnGap:"1rem", justifyContent: 'center' }}
                      item
                      xs={12}
                    ></Grid>

                    {/* Welcome text */}
                    <Grid
                      sx={{ display: "grid", alignItems: "center" }} // Centers the text
                      item
                      xs={12}
                    >
                      <img
                        style={{ width: "35px", height: "35px" }}
                        src={"/logo.png"} // Source of the company logo
                        alt="Operations360 Logo" // No alternate text
                      />

                      <Box
                        sx={{
                          textAlign: "left",
                          display: "flex",
                          alignItems: "left",
                          columnGap: "1rem",
                          marginTop: "0.8rem",
                          //justifyItems: "center",
                          //justifyContent: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "1.3rem",
                            color: "#499CF6",
                            fontWeight: "600",
                          }}
                        >
                          Operations360™
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  {/* The login form */}
                  <form>
                    <TextField
                      fullWidth
                      label="Email"
                      variant="outlined"
                      margin="normal"
                      size="small"
                      value={username}
                      onChange={handleUsernameChange} // Use debounced function on change
                      InputLabelProps={{ shrink: true }}
                    />
                    {/* Combined tenant selection dropdown or text field */}
                    {tenantDialogOpen ? (
                      // Display Dropdown when tenantDialogOpen is true
                      multipleTenants?.length > 1 ? (
                        <Dropdown
                          placeholder="Select a Tenant"
                          defaultValue={null}
                          value={tenant}
                          options={[
                            ...multipleTenants.map((tenant) => ({
                              label: tenant,
                              value: tenant,
                            })),
                          ]}
                          onChange={(e) => {
                            const selectedTenant = e.value;
                            setTenant(selectedTenant);
                            setTenantDialogOpen(false); // Close dropdown and switch to Chip
                            // localStorage.setItem("savedTenant", selectedTenant);
                          }}
                          className="p-mt-2 p-dropdown"
                          style={{ width: "100%", marginTop: "0.55rem" }}
                        />
                      ) : multipleTenants?.length === 1 ? (
                        <>
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-star"
                            marginTop="0.55rem"
                          >
                            <Typography whiteSpace={"nowrap"}>
                              Tenant :{" "}
                            </Typography>
                            <Chip
                              label={`${multipleTenants[0]}`}
                              variant="outlined"
                              size="small"
                              sx={{ padding: 0, margin: 0, marginLeft: "10px" }}
                            />
                          </Box>
                        </>
                      ) : (
                        ""
                      )
                    ) : (
                      // Display Chip and Save Tenant checkbox when tenantDialogOpen is false
                      tenant &&
                      !oneTenantPresent && (
                        <>
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-star"
                            marginTop="0.55rem"
                            //background="red"
                          >
                            <Typography
                              fontSize={".95rem"}
                              whiteSpace={"nowrap"}
                            >
                              Tenant :{" "}
                            </Typography>
                            <Chip
                              label={tenant}
                              variant="outlined"
                              size="small"
                              sx={{ marginLeft: "10px" }}
                              onClick={async () => {
                                await fetchUserWiseTenant();
                                if (multipleTenants?.length > 0) {
                                  setTenantDialogOpen(true);
                                }
                              }}
                              onDelete={async () => {
                                localStorage.removeItem("savedTenant");
                                setTenant(null); // Remove the chip by clearing the tenant state
                                await fetchUserWiseTenant();
                                if (multipleTenants?.length > 0) {
                                  setTenantDialogOpen(true);
                                }
                              }}
                              deleteIcon={<CloseIcon />}
                            />
                          </Box>
                          <Tooltip title="Save This Tenant">
                            <Checkbox
                              sx={{
                                "& .MuiSvgIcon-root": { fontSize: 15 },
                                display: "none",
                              }}
                              checked={isChecked}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setIsChecked(checked); // Update checkbox state
                                if (checked) {
                                  localStorage.setItem("savedTenant", tenant); // Save tenant if checked
                                }
                              }}
                            />
                          </Tooltip>
                        </>
                      )
                    )}

                    {/* Input field for entering the password */}
                    <TextField
                      fullWidth
                      label="Password" // The label above the input
                      type={showPassword ? "text" : "password"} // Toggles between text and password types
                      variant="outlined"
                      margin="normal"
                      size="small"
                      value={password} // Binds to the password state
                      onChange={(e) => setPassword(e.target.value)} // Updates password when typing
                      InputLabelProps={{ shrink: true }} // Forces the label to stay above
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              aria-label="toggle password visibility"
                              style={{
                                padding: 2, // Reduce padding to make the button more compact
                                fontSize: "0.8rem", // Adjust icon size
                              }}
                              onMouseDown={() => setShowPassword(true)} // Show password when holding
                              onMouseUp={() => setShowPassword(false)} // Hide password when released
                              onMouseLeave={() => setShowPassword(false)} // Hide password if the mouse leaves the button
                              onTouchStart={() => setShowPassword(true)} // Show password when touched (Mobile)
                              onTouchEnd={() => setShowPassword(false)} // Hide password when touch ends (Mobile)
                            >
                              {showPassword ? (
                                <Visibility fontSize="small" />
                              ) : (
                                <VisibilityOff fontSize="small" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          // When "Enter" is pressed, it triggers login
                          handleLogin(username, password, tenant);
                        }
                      }}
                    />

                    {/* The login button */}
                    <Button
                      variant="contained" // The button is solid
                      // Makes the button take full width
                      size="small" // Medium size button
                      disabled={loading} // Disables the button if loading is true
                      sx={{
                        mb: 3,
                        mt: 2, // Adds margins around the button
                        padding: "0.4rem 1.7rem",
                        borderRadius: "2rem",
                        boxShadow: "none",
                        // cursor: loading ? "none" : "pointer", // Sets cursor to 'none' when loading is true, otherwise 'pointer'
                      }}
                      onClick={async () => {
                        if (username && (!tenant || tenant == null)) {
                          handleClick();
                          setSnackbarText("Select a Tenant");
                          setsnackbarSeverity("error");
                          // Call fetchUserWiseTenant if username is filled
                          fetchUserWiseTenant();
                        }
                        // const userTenant = await userWiseTenant(username);
                        if (multipleTenants?.length === 1) {
                          if (tenant && tenant !== null) {
                            setTenant(tenant);
                            handleLogin(
                              username,
                              password,
                              tenant,
                              // urlParams.get("tenant")
                            ); // Triggers the login function
                          }
                        } else {
                          if (tenant && tenant !== null) {
                            setTenant(tenant);
                            handleLogin(
                              username,
                              password,
                              tenant,
                              // urlParams.get("tenant")
                            ); // Triggers the login function
                          }
                        }
                      }}
                      //autoFocus
                      endIcon={<LoginIcon />}
                    >
                      Log In
                      {/* Button text */}
                      {/* A loading spinner inside the button when loading is true */}
                      {loading && (
                        <i className="pi pi-spin pi-spinner-dotted"></i>
                      )}
                    </Button>
                  </form>
                  {/* Social icon to visit the company's website */}
                  <Box
                    sx={{
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      columnGap: "1rem",
                      justifyItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <GreenwaveComponent />
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* A pop-up message (Snackbar) that shows up when something happens */}
        <Snackbar
          open={open} // Opens the Snackbar when 'open' is true
          autoHideDuration={3000} // Automatically hides after 3 seconds
          onClose={handleClose} // Function to close the Snackbar
          TransitionComponent={Slide} // Animation when it shows up
          anchorOrigin={{ vertical: "top", horizontal: "right" }} // Position of the Snackbar
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
        {/* Logs the logged-in user to the console */}
        {/* Renders a "Change Password" form if the user is logged in */}
        {renderChangePassword(loggedInUser)}
      </Container>
    </div>
  );
}

export default Login;
