import React, { useEffect, useState } from "react"; // Import React and hooks for state and effects
import {
  Alert,
  Autocomplete, // Component for auto-complete input
  Box, // Box component for layout
  Button, // Button component
  Container, // Container for layout
  FormControl, // Form control for managing form elements
  FormHelperText, // Helper text for form
  Grid, // Grid layout component
  IconButton, // Button with an icon
  InputAdornment, // Adds an icon or text to input
  InputLabel, // Label for input fields
  MenuItem, // Menu item for dropdowns
  OutlinedInput, // Input with an outline
  Select,
  Slide,
  Snackbar, // Dropdown select component
  TextField, // Text input field
  Typography, // Text typography component
} from "@mui/material"; // Material UI library for components
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Icons for showing/hiding passwords
import {
  fetchPlantDataApi,
  tenantSignUpApi,
  loginCheckBeforeTenant,
} from "./TenantApi"; // Functions for API calls
import { Card } from "primereact/card"; // Card component from PrimeReact
import { fetchAllUsers } from "../UserModuleUpdated/UsermoduleApi";
import { useNavigate } from "react-router-dom";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/en"; // optional, default locale
import "primereact/resources/themes/saga-blue/theme.css"; // theme
import "primereact/resources/primereact.min.css"; // core css
import "primeicons/primeicons.css"; // icons

// This page will allow an admin to create tenant which will assigned with a tenantID and and plant details

const Tenant = () => {
  // State to hold form data
  const [formData, setFormData] = useState({
    tenantId: "", // Unique ID for the tenant
    adminName: "", // Name of the admin
    designation: "", // Job title of the admin
    email: "", // Admin's email
    password: "", // Admin's password
    confirmPassword: "", // Password confirmation
    phoneNumber: "", // Admin's phone number
    accountOwnerCustomer: "", // Customer account owner
    accountOwnerGW: "", // GW account owner
    // homepage: "", // Homepage URL
    plantName: "", // Name of the plant
    plantID: "", // ID of the plant
    address: "", // Address of the plant
    division: "", // Division of the plant
    packageName: "", // Package name for the account
    customerName: "", // Name of the customer
    noOfUsers: "",
    poNo: "",
    startDate: "",
    expiryDate: "",
    gracePeriod: "",
  });

  // State to hold form error messages
  const [formErrors, setFormErrors] = useState({});

  const [pass, setPass] = useState("");
  const [cnfpass, setCnfpass] = useState("");

  // State to handle password visibility
  const [showPassword, setShowPassword] = useState(false);

  // State to hold the list of plants
  const [plantList, setPlantList] = useState([]);

  const [errorOpen, setErrorOpen] = useState(false); // To control error messages
  const [snackbarText, setSnackbarText] = useState(""); // Text for snackbar messages
  const [snackbarSeverity, setsnackbarSeverity] = useState(""); // Severity level of snackbar messages

  const handleClose = (event, reason) => {
    // This function hides the (Snackbar) error message when we click on it.
    if (reason === "clickaway") {
      // If we clicked away, do nothing.
      return;
    }
    setErrorOpen(false); // Otherwise, hide the (Snackbar) error message.
  };

  const handleClick = () => {
    // This function shows the error message.
    setErrorOpen(true); // Set the error message to open.
  };

  // Function to capitalize the first letter of each word
  const capitalizeWords = (str) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  // Function to remove special characters from a string
  const removeAllSpecialChar = (str) => str.replace(/[^a-zA-Z ]/g, "");

  // Function to remove numbers and special characters from a string
  const removeNumberAndSpecialChar = (str) => str.replace(/[^a-zA-Z@.]/g, "");

  // Function to convert a string to lowercase and remove spaces
  const removeSpaceAndLowerCase = (str) =>
    str.toLowerCase().replace(/\s+/g, "");

  // Function to remove everything except numbers from a string
  const removeAllExceptNumber = (str) => str.replace(/[^0-9]/g, "");

  // Function to check if the provided email is valid
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Function to validate the password based on certain rules
  const validatePassword = (password) =>
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/.test(password);

  // Sample email lists for customer and GW accounts
  const [allCustomerList, setAllCustomerList] = useState([]);

  const [allGWAdminList, setAllGWAdminList] = useState([]);

  function printAdminUserId(user) {
    const hasAdminAccess = user.allotedPages.some(
      (page) => page.page === "Admin"
    );
    if (hasAdminAccess) {
      setAllGWAdminList((prev) => [...prev, user.userID]);
    } else {
      setAllCustomerList((prev) => [...prev, user.userID]);
    }
  }

  // Predefined package names available for selection
  const packageNameList = ["Silver", "Bronze", "Gold"];

  const navigate = useNavigate();

  // Function to fetch plant data from the API
  const fetchPlantData = async () => {
    checkLogin();
    try {
      const data = await fetchPlantDataApi(); // Call API to get plant data
      console.log("plantDetails : ", data); // Log the fetched plant data

      if (!data) {
        // Null or undefined check
        return;
      }

      // Filter the plant list to remove plants with name "NA"
      const filteredPlantList = data.filter(
        (plant) => plant.plantName !== "NA"
      );
      console.log("filteredPlantList : ", filteredPlantList); // Log the filtered list

      // Set the filtered plant list in state
      setPlantList(filteredPlantList);
    } catch (error) {
      console.log(error); // Log any errors that occur
    }
  };

  // Function to fetch all users data from the API
  const fetchAllUsersData = async () => {
    checkLogin();
    try {
      const allusers = await fetchAllUsers();
      console.log("allusers ==== >> ", allusers);

      if (!allusers) {
        return;
      }

      allusers.forEach(printAdminUserId);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const checkLogin = async () => {
    const loginCheckBeforeTenantCheck = await loginCheckBeforeTenant();
    console.log("checkLogin called :: ", loginCheckBeforeTenantCheck);
    if (!loginCheckBeforeTenantCheck) {
      handleClick();
      setSnackbarText("Your Session has expired please login again");
      setsnackbarSeverity("error");

      // wait 3 seconds (3000 ms) before navigating
      setTimeout(() => {
        navigate("/"); // redirect to login page
      }, 3000);
    }
  };

  // useEffect to fetch plant data when the component mounts
  useEffect(() => {
    fetchPlantData(); // Call function to fetch plant data
    fetchAllUsersData();
  }, []); // Empty dependency array means it runs only once

  // Function to handle changes in the autocomplete input for plants
  const handleAutocompleteChange = (e, newValue) => {
    if (newValue) {
      // If a new plant is selected
      // Find the selected plant from the plant list
      const selectedPlant = plantList.find(
        (plant) => plant.plantName === newValue
      );
      console.log("selectedPlant : ", selectedPlant); // Log the selected plant

      // Update the form data with the selected plant's information
      setFormData({
        ...formData,
        tenantId: selectedPlant ? selectedPlant.plantID : "", // Set tenant ID
        plantID: selectedPlant ? selectedPlant.plantID : "", // Set plant ID
        plantName: newValue, // Set plant name
        address: selectedPlant ? selectedPlant.address : "", // Set address
        customerName: selectedPlant ? selectedPlant.customerName : "", // Set customer name
        division: selectedPlant ? selectedPlant.division : "", // Set division
      });
    } else {
      // If no plant is selected
      // Reset the form data related to plant selection
      setFormData({
        ...formData,
        tenantId: "",
        plantID: "",
        plantName: "",
        address: "",
        customerName: "",
        division: "",
      });
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    checkLogin();
    e.preventDefault(); // Prevent the default form submission behavior

    console.log("formData :_:_:_:_", formData);

    // Check if required fields are filled
    if (
      !formData.tenantId ||
      !formData.adminName ||
      !formData.email ||
      !formData.password
    ) {
      // If not, set an error message
      setFormErrors({
        ...formErrors,
        submitError: "Please fill all required fields.", // Show error message
      });
      return; // Stop further execution
    }

    try {
      // Call the API to submit the form data
      const response = await tenantSignUpApi(formData);
      if (response.status === 201) {
        const responseMessage = await response.text(); // or .json() if your backend sends JSON
        console.log("Form submitted successfully:");
        handleClick();
        setSnackbarText(responseMessage);
        setsnackbarSeverity("success");
      } else {
        const responseMessage = await response.text(); // read response text
        throw new Error(responseMessage); // trigger catch
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      handleClick();
      setSnackbarText(error.message || "Something went wrong");
      setsnackbarSeverity("error");
    }
  };

  // Render the component
  return (
    <Container
      maxWidth="lg"
      sx={{ padding: "0 !important", marginTop: "1rem" }}
    >
      <Card
        className="primeCardStyle"
        title={
          <Typography sx={{ fontWeight: 600, marginBottom: "1rem" }}>
            Tenant Creation Page
          </Typography>
        }
      >
        <form onSubmit={handleSubmit}>
          <Box noValidate>
            <Grid container spacing={2}>
              {/* This section is for selecting the plant name */}
              <Grid item xs={6}>
                <Autocomplete
                  value={formData.plantName}
                  disablePortal
                  fullWidth
                  id="plantName"
                  options={plantList.map((p) => p.plantName)} // Create a list of plant names
                  getOptionLabel={(option) => option}
                  onChange={handleAutocompleteChange} // When the plant name is selected, call the change function
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Plant Name"
                      error={formErrors.plantName} // Show error if there's an issue
                      helperText={
                        formErrors.plantName && "Plant Name must be filled"
                      }
                    />
                  )}
                />
              </Grid>
              {/* This section is for showing the Plant ID */}
              <Grid item xs={6}>
                <FormControl fullWidth error={formErrors.plantID}>
                  <InputLabel htmlFor="PlantID">PlantID</InputLabel>
                  <OutlinedInput
                    inputProps={{
                      readOnly: true, // Make this field read-only
                    }}
                    autoFocus
                    label="PlantID"
                    autoComplete="PlantID"
                    name="PlantID"
                    required
                    fullWidth
                    id="PlantID"
                    value={formData.plantID} // Display the Plant ID
                  />
                  {formErrors.plantID && (
                    <FormHelperText>Plant ID must be filled</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  inputProps={{
                    readOnly: true, // Make this field read-only
                  }}
                  required
                  fullWidth
                  autoFocus
                  name="address"
                  label="Address"
                  id="address"
                  autoComplete="address"
                  value={formData.address} // Display the address
                  error={formErrors.address} // Show error if there's an issue
                  helperText={formErrors.address && "Address must be filled"}
                />
              </Grid>
              {/* This section is for showing the division */}
              <Grid item xs={6}>
                <TextField
                  inputProps={{
                    readOnly: true, // Make this field read-only
                  }}
                  required
                  fullWidth
                  autoFocus
                  name="division"
                  label="Division"
                  id="division"
                  autoComplete="division"
                  value={formData.division} // Display the division
                  error={formErrors.division} // Show error if there's an issue
                  helperText={formErrors.division && "Division must be filled"}
                />
              </Grid>
              {/* This section is for showing the customer name */}
              <Grid item xs={6}>
                <TextField
                  inputProps={{
                    readOnly: true, // Make this field read-only
                  }}
                  required
                  fullWidth
                  autoFocus
                  name="customer"
                  label="Customer"
                  id="customer"
                  autoComplete="customer"
                  value={formData.customerName} // Display the customer name
                  error={formErrors.customerName} // Show error if there's an issue
                  helperText={
                    formErrors.customerName && "Customer Name must be filled"
                  }
                />
              </Grid>
              {/* This section is for selecting the package name */}
              <Grid item xs={6}>
                <FormControl fullWidth error={formErrors.packageName}>
                  <InputLabel id="packageName-label">packageName</InputLabel>
                  <Select
                    labelId="packageName-label"
                    label="Package Name"
                    id="packageName"
                    value={formData.packageName}
                    onChange={(e) => {
                      const selectedpackageName = e.target.value; // Get the selected package name
                      setFormData({
                        ...formData,
                        packageName: selectedpackageName, // Update the formData
                      });
                      // Check if the package name is selected
                      if (selectedpackageName !== "") {
                        setFormErrors({
                          ...formErrors,
                          packageName: false, // No error
                        });
                      } else {
                        setFormErrors({
                          ...formErrors,
                          packageName: true, // Set error if not selected
                        });
                      }
                    }}
                  >
                    <MenuItem value="">
                      <h5>Select packageName</h5>
                      {/* Default option */}
                    </MenuItem>
                    {packageNameList.map((pkg) => (
                      <MenuItem key={pkg} value={pkg}>
                        {pkg}
                        {/* Show the available package names */}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.packageName && (
                    <FormHelperText>
                      packageName must be selected // Show error if not selected
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              {/* This section is for showing the Tenant ID */}
              <Grid item xs={6}>
                <TextField
                  name="tenantId"
                  required
                  fullWidth
                  id="tenantId"
                  label="Tenant ID"
                  autoFocus
                  value={formData.plantID} // Display the Tenant ID
                  inputProps={{
                    readOnly: true, // Make this field read-only
                  }}
                  error={formErrors.tenantId} // Show error if there's an issue
                  helperText={formErrors.tenantId && "Tenant ID must be filled"}
                />
              </Grid>
              {/* This section is for entering the admin's name */}
              <Grid item xs={6}>
                <TextField
                  name="adminName"
                  required
                  fullWidth
                  id="adminName"
                  label="Admin Name"
                  value={formData.adminName} // Display the admin name
                  onBlur={(e) => {
                    setFormData({
                      ...formData,
                      adminName: capitalizeWords(e.target.value.trim()), // Capitalize the name
                    });
                  }}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      adminName: removeAllSpecialChar(e.target.value), // Remove special characters from the name
                    });
                    setFormErrors({
                      ...formErrors,
                      adminName: e.target.value.trim() === "", // Check for errors
                    });
                  }}
                  error={formErrors.adminName} // Show error if there's an issue
                  helperText={
                    formErrors.adminName && "Admin Name must be filled"
                  }
                />
              </Grid>
              {/* This section is for selecting the designation */}
              <Grid item xs={6}>
                <FormControl fullWidth error={formErrors.designation}>
                  <InputLabel id="designation-label">Salutation</InputLabel>
                  <Select
                    labelId="designation-label"
                    label="Salutation"
                    id="designation"
                    value={formData.designation} // Display the selected designation
                    onChange={(e) => {
                      const selectedDesignation = e.target.value; // Get the selected designation
                      setFormData({
                        ...formData,
                        designation: selectedDesignation, // Update the formData
                      });
                      // Check if the designation is selected
                      if (selectedDesignation !== "") {
                        setFormErrors({
                          ...formErrors,
                          designation: false, // No error
                        });
                      } else {
                        setFormErrors({
                          ...formErrors,
                          designation: true, // Set error if not selected
                        });
                      }
                    }}
                  >
                    <MenuItem value="Mr.">Mr.</MenuItem>
                    <MenuItem value="Mrs.">Mrs.</MenuItem>
                    <MenuItem value="Ms.">Ms.</MenuItem>
                    <MenuItem value="Dr.">Dr.</MenuItem>
                  </Select>
                  {formErrors.designation && (
                    <FormHelperText>Designation must be filled</FormHelperText> // Show error if not selected
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                {/* This part is for entering the email address */}
                <TextField
                  required // This means the email field must be filled
                  fullWidth // This makes the input take up the full width of the container
                  id="email" // Unique identifier for the email input
                  type="email" // This specifies that the input is for an email address
                  label="Email Address" // The label shown above the input
                  name="email" // The name of this input
                  value={formData.email} // This shows the current email value
                  // This function runs when the user finishes typing (on blur)
                  onBlur={(e) => {
                    setFormData({
                      ...formData, // Keep existing form data
                      // Clean the email by removing numbers, special characters, spaces, and making it lowercase
                      email: removeNumberAndSpecialChar(
                        removeSpaceAndLowerCase(e.target.value.trim())
                      ),
                    });
                  }}
                  // This function runs every time the user types something in the email field
                  onChange={(e) => {
                    setFormData({
                      ...formData, // Keep existing form data
                      // Clean the email as the user types
                      email: removeNumberAndSpecialChar(
                        removeSpaceAndLowerCase(e.target.value.trim())
                      ),
                    });

                    // Check if the email field is empty
                    setFormErrors({
                      ...formErrors, // Keep existing form errors
                      email: e.target.value.trim() === "", // Set error if the field is empty
                    });

                    // Check if the email is valid
                    setFormErrors({
                      ...formErrors, // Keep existing form errors
                      invalidEmailForEmailField: !isValidEmail(e.target.value), // Set error if email is invalid
                    });

                    // Log whether the email is valid or not in the console
                    console.log(
                      "isValidEmail : ",
                      isValidEmail(e.target.value)
                    );
                  }}
                  // Show an error message if there's an error
                  error={
                    formErrors.email || formErrors.invalidEmailForEmailField
                  }
                  helperText={
                    // Show helpful messages below the input
                    (formErrors.email && "Email must be filled") || // Message if email is empty
                    (formErrors.invalidEmailForEmailField &&
                      "Email is not valid") // Message if email is invalid
                  }
                />
              </Grid>
              <Grid item xs={6}>
                {/* This part is for entering the password */}
                <FormControl
                  fullWidth // Make the password input take up the full width
                  error={
                    // Show an error if there's a problem with the password
                    formErrors.password ||
                    formErrors.passwordNotMatch ||
                    formErrors.weakPassword
                  }
                >
                  <InputLabel htmlFor="password">Password</InputLabel>{" "}
                  {/* Label for password input */}
                  <OutlinedInput
                    label="Password" // The label shown for the input
                    name="password" // The name of the input
                    required // This means the password field must be filled
                    fullWidth // This makes the input take up the full width
                    id="password" // Unique identifier for the password input
                    value={pass} // This shows the current password value
                    // This function runs every time the user types something in the password field
                    onChange={(e) => {
                      const password = e.target.value; // Get the current password value
                      setPass(password); // Update the password state
                      const isPasswordValid = validatePassword(password); // Check if the password is valid

                      setFormData({
                        ...formData, // Keep existing form data
                        password: password, // Update the password in form data
                      });

                      setFormErrors({
                        ...formErrors, // Keep existing form errors
                        password: password.trim() === "", // Set error if the field is empty
                        passwordNotMatch: password !== cnfpass, // Check if passwords match
                        weakPassword: !isPasswordValid, // Set error if the password is weak
                      });

                      // Log whether the password matches the confirmation password
                      console.log(
                        "password !== cnfpass : ",
                        password !== cnfpass
                      );
                    }}
                    type={showPassword ? "text" : "password"} // Show text or password based on the state
                    endAdornment={
                      // This adds a button to show/hide the password
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility" // Describes what the button does
                          onClick={() => setShowPassword(!showPassword)} // Toggle the password visibility
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                          {/* Show/hide icon */}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {/* Show error messages if there are problems */}
                  {formErrors.password && (
                    <FormHelperText>Password must be filled</FormHelperText> // Message if password is empty
                  )}
                  {formErrors.weakPassword && (
                    <FormHelperText>
                      Password must contain at least 6 characters, including
                      uppercase, lowercase, numeric, and special characters
                    </FormHelperText> // Message if password is weak
                  )}
                  {formErrors.passwordNotMatch && (
                    <FormHelperText>Password does not match!</FormHelperText> // Message if passwords don't match
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                {/* This part is for confirming the password */}
                <TextField
                  required // This means the confirm password field must be filled
                  fullWidth // This makes the input take up the full width
                  name="confirmPassword" // The name of this input
                  label="Confirm Password" // The label shown above the input
                  type="password" // This specifies that the input is for a password
                  id="confirmPassword" // Unique identifier for the confirm password input
                  value={cnfpass} // This shows the current confirm password value
                  // This function runs every time the user types something in the confirm password field
                  onChange={(e) => {
                    const confirmPass = e.target.value; // Get the current confirm password value
                    setCnfpass(confirmPass); // Update the confirm password state
                    setFormErrors({
                      ...formErrors, // Keep existing form errors
                      confirmPassword: e.target.value.trim() === "", // Set error if the field is empty
                      passwordNotMatch: pass !== confirmPass, // Check if passwords match
                    });
                  }}
                  // Show an error if there's a problem
                  error={
                    formErrors.confirmPassword || formErrors.passwordNotMatch
                  }
                  helperText={
                    // Show helpful messages below the input
                    (formErrors.confirmPassword &&
                      "Confirm Password must be filled") || // Message if confirm password is empty
                    (formErrors.passwordNotMatch && "Password does not match!") // Message if passwords don't match
                  }
                />
              </Grid>
              <Grid item xs={6}>
                {/* This part is for entering the phone number */}
                <TextField
                  required // This means the phone number field must be filled
                  fullWidth // This makes the input take up the full width
                  name="phoneNumber" // The name of this input
                  label="Phone Number" // The label shown above the input
                  id="phoneNumber" // Unique identifier for the phone number input
                  value={formData.phoneNumber} // This shows the current phone number value
                  // This function runs when the user finishes typing (on blur)
                  onBlur={(e) => {
                    setFormData({
                      ...formData, // Keep existing form data
                      // Clean the phone number by removing spaces
                      phoneNumber: e.target.value.trim(),
                    });
                  }}
                  // This function runs every time the user types something in the phone number field
                  onChange={(e) => {
                    const isValidPhoneNumber =
                      !isNaN(e.target.value) && e.target.value.length <= 10; // Check if the phone number is valid
                    const isPhoneNumberFilled = e.target.value.trim() === ""; // Check if the field is empty
                    const isPhoneNumberLengthValid = e.target.value.length <= 9; // Check if the length is valid

                    setFormData({
                      ...formData, // Keep existing form data
                      phoneNumber: isValidPhoneNumber
                        ? removeAllExceptNumber(e.target.value) // Keep only numbers in phone number
                        : formData.phoneNumber,
                    });

                    setFormErrors({
                      ...formErrors, // Keep existing form errors
                      phoneNumber: isPhoneNumberFilled, // Set error if the field is empty
                      phoneNumberLength: isPhoneNumberLengthValid, // Set error if the number length is not valid
                    });
                  }}
                  // Show an error if there's a problem
                  error={formErrors.phoneNumber || formErrors.phoneNumberLength}
                  helperText={
                    // Show helpful messages below the input
                    (formErrors.phoneNumber && "Phone Number must be filled") || // Message if phone number is empty
                    (formErrors.phoneNumberLength &&
                      "Phone Number must be 10 digits") // Message if phone number is not valid
                  }
                />
              </Grid>
              <Grid item xs={6}>
                {/* This is a box for the Account Owner Customer email input */}
                <FormControl
                  fullWidth
                  error={
                    formErrors.accountOwnerCustomer || // Check if there is an error for the email
                    formErrors.invalidEmailForAccountOwnerCustomer // Check if the email is invalid
                  }
                >
                  {/* Autocomplete lets you pick an email from a list or type one */}
                  <Autocomplete
                    id="accountOwnerCustomer"
                    options={allCustomerList} // List of email options to choose from
                    value={formData.accountOwnerCustomer} // The current value of the email input
                    onChange={(event, newValue) => {
                      // When the email is changed (either picked or typed)
                      setFormData({
                        ...formData,
                        accountOwnerCustomer: newValue, // Update the form data with the new email
                      });
                      // Check if the new email is valid
                      if (
                        newValue !== null && // Make sure it's not empty
                        newValue !== "" && // Make sure it's not just blank
                        isValidEmail(newValue) // Check if the email is valid
                      ) {
                        setFormErrors({
                          ...formErrors,
                          accountOwnerCustomer: false, // No error for email
                          invalidEmailForAccountOwnerCustomer: false, // Email is valid
                        });
                      } else {
                        setFormErrors({
                          ...formErrors,
                          accountOwnerCustomer: true, // Set error because the email is not valid
                        });
                      }
                    }}
                    onInputChange={(event, newInputValue) => {
                      // When the user types in the email input
                      setFormData({
                        ...formData,
                        accountOwnerCustomer: newInputValue, // Update the form data with what the user typed
                      });
                      setFormErrors({
                        ...formErrors,
                        accountOwnerCustomer: false, // No error for email
                      });
                      // Check if the typed email is valid
                      setFormErrors({
                        ...formErrors,
                        invalidEmailForAccountOwnerCustomer:
                          !isValidEmail(newInputValue), // Set error if the email is not valid
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params} // Spread the params to the TextField
                        label="Account Owner Customer" // Label for the email input
                        error={
                          formErrors.accountOwnerCustomer || // Check if there's an error for the email
                          formErrors.invalidEmailForAccountOwnerCustomer // Check if the email is invalid
                        }
                        helperText={
                          (formErrors.accountOwnerCustomer &&
                            "Account Owner Customer must be filled") || // Message if the email is not filled
                          (formErrors.invalidEmailForAccountOwnerCustomer &&
                            "Account Owner Customer Email is not valid") // Message if the email is invalid
                        }
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                {/* This is a box for the Account Owner GW email input */}
                <FormControl
                  fullWidth
                  error={
                    formErrors.accountOwnerGW || // Check if there's an error for the email
                    formErrors.invalidEmailForAccountOwnerGW // Check if the email is invalid
                  }
                >
                  <Autocomplete
                    id="accountOwnerGW"
                    options={allGWAdminList} // List of email options to choose from
                    value={formData.accountOwnerGW} // The current value of the email input
                    onChange={(event, newValue) => {
                      // When the email is changed (either picked or typed)
                      setFormData({
                        ...formData,
                        accountOwnerGW: newValue, // Update the form data with the new email
                      });
                      // Check if the new email is valid
                      if (
                        newValue !== null && // Make sure it's not empty
                        newValue !== "" && // Make sure it's not just blank
                        isValidEmail(newValue) // Check if the email is valid
                      ) {
                        setFormErrors({
                          ...formErrors,
                          accountOwnerGW: false, // No error for email
                          invalidEmailForAccountOwnerGW: false, // Email is valid
                        });
                      } else {
                        setFormErrors({
                          ...formErrors,
                          accountOwnerGW: true, // Set error because the email is not valid
                        });
                      }
                    }}
                    onInputChange={(event, newInputValue) => {
                      // When the user types in the email input
                      setFormData({
                        ...formData,
                        accountOwnerGW: newInputValue, // Update the form data with what the user typed
                      });
                      setFormErrors({
                        ...formErrors,
                        accountOwnerGW: false, // No error for email
                      });
                      // Check if the typed email is valid
                      setFormErrors({
                        ...formErrors,
                        invalidEmailForAccountOwnerGW:
                          !isValidEmail(newInputValue), // Set error if the email is not valid
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params} // Spread the params to the TextField
                        label="Account Owner GW" // Label for the email input
                        error={
                          formErrors.accountOwnerGW || // Check if there's an error for the email
                          formErrors.invalidEmailForAccountOwnerGW // Check if the email is invalid
                        }
                        helperText={
                          (formErrors.accountOwnerGW &&
                            "Account Owner GW must be filled") || // Message if the email is not filled
                          (formErrors.invalidEmailForAccountOwnerGW &&
                            "Account Owner GW Email is not valid") // Message if the email is invalid
                        }
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                {/* This is a box for the Database Name input */}
                <TextField
                  required
                  fullWidth
                  name="databaseName"
                  label="Database Name"
                  id="databaseName"
                  value={formData.databaseName} // The current value of the database name input
                  onBlur={(e) => {
                    // When the user clicks away from the input
                    setFormData({
                      ...formData,
                      databaseName: e.target.value.trim(), // Update the database name with trimmed value
                    });
                  }}
                  onChange={(e) => {
                    // When the user types in the input
                    setFormData({
                      ...formData,
                      databaseName: e.target.value.trim(), // Update the form data with trimmed value
                    });
                    setFormErrors({
                      ...formErrors,
                      databaseName: e.target.value.trim() === "", // Set error if the database name is empty
                    });
                  }}
                  error={formErrors.databaseName} // Check if there's an error for the database name
                  helperText={
                    formErrors.databaseName && "Database Name must be filled" // Message if database name is not filled
                  }
                />
              </Grid>
              <Grid item xs={6}>
                {/* This is a box for the Database IP input */}
                <TextField
                  required // This input must be filled out
                  fullWidth // Make the input take up the full width of the box
                  name="databaseIP" // Name of the input
                  label="Database IP" // Label that shows what the input is for
                  id="databaseIP" // Unique ID for this input
                  value={formData.databaseIP} // Current value of the Database IP input
                  onBlur={(e) => {
                    // When the user clicks away from the input
                    setFormData({
                      ...formData,
                      databaseIP: e.target.value.trim(), // Update the form data with the trimmed value
                    });
                  }}
                  onChange={(e) => {
                    // When the user types in the input
                    setFormData({
                      ...formData,
                      databaseIP: e.target.value.trim(), // Update the form data with the trimmed value
                    });
                    // Check if the input is empty
                    setFormErrors({
                      ...formErrors,
                      databaseIP: e.target.value.trim() === "", // Set error if the input is empty
                    });
                  }}
                  error={formErrors.databaseIP} // Check if there's an error for the Database IP input
                  helperText={
                    formErrors.databaseIP && "Database IP must be filled" // Message if Database IP is not filled
                  }
                />
              </Grid>
              <Grid item xs={6}>
                {/* This is a box for the Database Username input */}
                <TextField
                  required // This input must be filled out
                  fullWidth // Make the input take up the full width of the box
                  name="databaseUsername" // Name of the input
                  label="Database Username" // Label that shows what the input is for
                  id="databaseUsername" // Unique ID for this input
                  value={formData.databaseUsername} // Current value of the Database Username input
                  onBlur={(e) => {
                    // When the user clicks away from the input
                    setFormData({
                      ...formData,
                      databaseUsername: e.target.value.trim(), // Update the form data with the trimmed value
                    });
                  }}
                  onChange={(e) => {
                    // When the user types in the input
                    setFormData({
                      ...formData,
                      databaseUsername: e.target.value.trim(), // Update the form data with the trimmed value
                    });
                    // Check if the input is empty
                    setFormErrors({
                      ...formErrors,
                      databaseUsername: e.target.value.trim() === "", // Set error if the input is empty
                    });
                  }}
                  error={formErrors.databaseUsername} // Check if there's an error for the Database Username input
                  helperText={
                    formErrors.databaseUsername &&
                    "Database Username must be filled" // Message if Database Username is not filled
                  }
                />
              </Grid>
              <Grid item xs={6}>
                {/* This is a box for the Database Password input */}
                <TextField
                  required // This input must be filled out
                  fullWidth // Make the input take up the full width of the box
                  name="databasePassword" // Name of the input
                  label="Database Password" // Label that shows what the input is for
                  id="databasePassword" // Unique ID for this input
                  type="password" // Make the input type password (hidden characters)
                  value={formData.databasePassword} // Current value of the Database Password input
                  onBlur={(e) => {
                    // When the user clicks away from the input
                    setFormData({
                      ...formData,
                      databasePassword: e.target.value.trim(), // Update the form data with the trimmed value
                    });
                  }}
                  onChange={(e) => {
                    // When the user types in the input
                    setFormData({
                      ...formData,
                      databasePassword: e.target.value.trim(), // Update the form data with the trimmed value
                    });
                    // Check if the input is empty
                    setFormErrors({
                      ...formErrors,
                      databasePassword: e.target.value.trim() === "", // Set error if the input is empty
                    });
                  }}
                  error={formErrors.databasePassword} // Check if there's an error for the Database Password input
                  helperText={
                    formErrors.databasePassword &&
                    "Database Password must be filled" // Message if Database Password is not filled
                  }
                />
              </Grid>
              <Grid item xs={6}>
                {/* This is a box for the Database Password input */}
                <TextField
                  required // This input must be filled out
                  fullWidth // Make the input take up the full width of the box
                  name="databaseDriver" // Name of the input
                  label="Database Driver" // Label that shows what the input is for
                  id="databaseDriver" // Unique ID for this input
                  // type="password" // Make the input type password (hidden characters)
                  value={formData.databaseDriver} // Current value of the Database Driver input
                  onBlur={(e) => {
                    // When the user clicks away from the input
                    setFormData({
                      ...formData,
                      databaseDriver: e.target.value.trim(), // Update the form data with the trimmed value
                    });
                  }}
                  onChange={(e) => {
                    // When the user types in the input
                    setFormData({
                      ...formData,
                      databaseDriver: e.target.value.trim(), // Update the form data with the trimmed value
                    });
                    // Check if the input is empty
                    setFormErrors({
                      ...formErrors,
                      databaseDriver: e.target.value.trim() === "", // Set error if the input is empty
                    });
                  }}
                  error={formErrors.databaseDriver} // Check if there's an error for the Database Driver input
                  helperText={
                    formErrors.databaseDriver &&
                    "Database Driver must be filled" // Message if Database Driver is not filled
                  }
                />
              </Grid>
              <Grid item xs={6}>
                {/* This function runs every time the user types something in the noOfUsers field*/}
                <TextField
                  required // This input must be filled out
                  fullWidth // Make the input take up the full width of the box
                  name="noOfUsers" // Name of the input
                  label="Number of Users" // Label that shows what the input is for
                  id="noOfUsers" // Unique ID for this input
                  // type="password" // Make the input type password (hidden characters)
                  value={formData.noOfUsers} // Current value of the Number of Users input
                  onBlur={(e) => {
                    // When the user clicks away from the input
                    setFormData({
                      ...formData,
                      noOfUsers: e.target.value.trim(), // Update the form data with the trimmed value
                    });
                  }}
                  onChange={(e) => {
                    const isValidNoOfUsers = !isNaN(e.target.value); // Check if the phone number is valid
                    const isNoOfUsersFilled = e.target.value.trim() === ""; // Check if the field is empty
                    // When the user types in the input
                    setFormData({
                      ...formData,
                      noOfUsers: isValidNoOfUsers
                        ? removeAllExceptNumber(e.target.value) // Keep only numbers in phone number
                        : formData.noOfUsers, // Update the form data with the trimmed value
                    });
                    // Check if the input is empty
                    setFormErrors({
                      ...formErrors,
                      noOfUsers: isNoOfUsersFilled, // Set error if the input is empty
                    });
                  }}
                  error={formErrors.noOfUsers} // Check if there's an error for the Number of Users input
                  helperText={
                    formErrors.noOfUsers && "Number of Users must be filled" // Message if Number of Users is not filled
                  }
                />
              </Grid>
              <Grid item xs={6}>
                {/* This is a box for the Database Password input */}
                <TextField
                  required // This input must be filled out
                  fullWidth // Make the input take up the full width of the box
                  name="poNo" // Name of the input
                  label="PO Number" // Label that shows what the input is for
                  id="poNo" // Unique ID for this input
                  // type="password" // Make the input type password (hidden characters)
                  value={formData.poNo} // Current value of the PO Number input
                  onBlur={(e) => {
                    // When the user clicks away from the input
                    setFormData({
                      ...formData,
                      poNo: e.target.value.trim(), // Update the form data with the trimmed value
                    });
                  }}
                  onChange={(e) => {
                    // When the user types in the input
                    setFormData({
                      ...formData,
                      poNo: e.target.value.trim(), // Update the form data with the trimmed value
                    });
                    // Check if the input is empty
                    setFormErrors({
                      ...formErrors,
                      poNo: e.target.value.trim() === "", // Set error if the input is empty
                    });
                  }}
                  error={formErrors.poNo} // Check if there's an error for the PO Number input
                  helperText={
                    formErrors.poNo && "PO Number must be filled" // Message if PO Number is not filled
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Start Date"
                    value={
                      formData.startDate
                        ? dayjs(formData.startDate, "DD/MM/YYYY")
                        : null
                    }
                    inputFormat="DD/MM/YYYY" // display format
                    onChange={(newValue) => {
                      const formattedForDisplay = newValue
                        ? newValue.format("DD/MM/YYYY")
                        : "";
                      setFormData({
                        ...formData,
                        startDate: formattedForDisplay, // keep display format for user
                        // startDateBackend: formattedForBackend, // send this to backend
                      });
                      setFormErrors({
                        ...formErrors,
                        startDate: !newValue,
                      });
                    }}
                    // renderInput={(params) => (
                    //   <TextField
                    //     {...params}
                    //     required
                    //     fullWidth
                    //     error={formErrors.startDate}
                    //     helperText={
                    //       formErrors.startDate && "Start Date is required"
                    //     }
                    //   />
                    // )}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: formErrors.expiryDate,
                        helperText:
                          formErrors.expiryDate && "Expiry Date is required",
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Expiry Date"
                    value={
                      formData.expiryDate
                        ? dayjs(formData.expiryDate, "DD/MM/YYYY")
                        : null
                    }
                    inputFormat="DD/MM/YYYY"
                    onChange={(newValue) => {
                      const formattedForDisplay = newValue
                        ? newValue.format("DD/MM/YYYY")
                        : "";
                      setFormData({
                        ...formData,
                        expiryDate: formattedForDisplay,
                        // expiryDateBackend: formattedForBackend,
                      });
                      setFormErrors({
                        ...formErrors,
                        expiryDate: !newValue,
                      });
                    }}
                    // renderInput={(params) => (
                    //   <TextField
                    //     {...params}
                    //     required
                    //     fullWidth
                    //     error={formErrors.expiryDate}
                    //     helperText={
                    //       formErrors.expiryDate && "Expiry Date is required"
                    //     }
                    //   />
                    // )}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: formErrors.expiryDate,
                        helperText:
                          formErrors.expiryDate && "Expiry Date is required",
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="gracePeriod"
                  name="gracePeriod"
                  label="Grace Period"
                  InputLabelProps={{ shrink: true }}
                  value={formData.gracePeriod}
                  onBlur={(e) => {
                    // When the user clicks away from the input
                    setFormData({
                      ...formData,
                      gracePeriod: e.target.value.trim(), // Update the form data with the trimmed value
                    });
                  }}
                  onChange={(e) => {
                    const isValidGracePeriod = !isNaN(e.target.value); // Check if the phone number is valid
                    const isGracePeriodFilled = e.target.value.trim() === ""; // Check if the field is empty
                    // When the user types in the input
                    setFormData({
                      ...formData,
                      gracePeriod: isValidGracePeriod
                        ? removeAllExceptNumber(e.target.value) // Keep only numbers in phone number
                        : formData.gracePeriod, // Update the form data with the trimmed value
                    });
                    // Check if the input is empty
                    setFormErrors({
                      ...formErrors,
                      gracePeriod: isGracePeriodFilled, // Set error if the input is empty
                    });
                  }}
                  error={formErrors.gracePeriod} // Check if there's an error for the Grace Period input
                  helperText={
                    formErrors.gracePeriod && "Grace Period must be filled" // Message if Grace Period is not filled
                  }
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              {/* This box centers the submit button */}
              <Button type="submit" variant="contained" color="success">
                Submit
                {/* This button sends the form data */}
              </Button>
            </Box>
          </Box>
        </form>
      </Card>
      <Snackbar
        open={errorOpen} // Open state of the snackbar
        autoHideDuration={3000} // Time to hide automatically
        onClose={handleClose} // Function to call on close
        TransitionComponent={Slide} // Transition effect
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Position of the snackbar
      >
        <Alert
          onClose={handleClose} // Function to call on close
          severity={snackbarSeverity} // Type of alert (error, success, etc.)
          variant="filled" // Filled variant of the alert
          sx={{ width: "100%" }} // Full width of the alert
        >
          {snackbarText}
          {/* Message to display */}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Tenant; // This line exports the Tenant component so it can be used in other parts of the app
