// Import necessary components and libraries from Material UI and React
import {
  Alert,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Slide,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react"; // React allows us to create components
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined"; // Icons for search
import CloseIcon from "@mui/icons-material/Close"; // Icon for closing
import DeleteIcon from "@mui/icons-material/Delete"; // Icon for delete
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined"; // Icon for dropdown
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined"; // Icon for dropdown up
import {
  deletePlantByPlantIdApi, // Function to delete a plant by its ID
  fetchPlantDataApi, // Function to fetch plant data
  postPlantDataApi,
  loginCheckBeforeTenant, // Function to post new plant data
} from "./TenantApi"; // Import API functions from another file
import { Card } from "primereact/card"; // Card component from PrimeReact
import { useNavigate } from "react-router-dom";

// Style definitions for the components
const styles = {
  typography: {
    fontSize: "0.9rem", // Set font size
    color: "white", // Set text color to white
    fontWeight: 400, // Set font weight
  },
  jobHead: {
    backgroundColor: "#263238", // Background color for job header
    padding: "12px", // Padding for the job header
  },
  activityHead: {
    backgroundColor: "#546e7a", // Background color for activity header
  },
  tableCell: {
    padding: "10px", // Padding for table cells
  },
};

// This page will allow admin to create plant using plant details like plantName, plantID, address, customerName, division etc.

// Main component for the Plant Page
export default function PlantPage() {
  // State to store the selected plant ID
  const [selectedplantId, setSelectedplantId] = useState("");
  // State to store the list of plants
  const [plantList, setPlantList] = useState([]);
  // State to store the filtered list of plants based on search
  const [filteredPlantRows, setFilteredPlantRows] = useState(plantList);
  // State to store the search input
  const [plantSearch, setPlantSearch] = useState("");
  // State to control the delete confirmation dialog
  const [openPlantDeleteDialog, setOpenPlantDeleteDialog] = useState(false);
  // State to control the snackbar for error messages
  const [plantErrorOpen, setPlantErrorOpen] = useState(false);
  // State to store the snackbar message text
  const [snackbarText, setSnackbarText] = useState("");
  // State to store the snackbar severity (error or success)
  const [snackbarSeverity, setsnackbarSeverity] = useState("");
  // State to store the new plant data input
  const [newPlant, setNewPlant] = useState({
    plantName: "",
    plantID: "",
    address: "",
    customerName: "",
    division: "",
  });
  // State to manage form validation errors
  const [formErrors, setFormErrors] = useState({
    plantName: false,
    plantID: false,
    address: false,
    customerName: false,
    division: false,
  });
  // Variable to store the user group URL
  const UserGroup = "localhost:8086";

  // Define colors to be used
  const newColors = ["#7e57c2"];
  // Function to get color based on index
  const getColor = (index) => {
    return newColors[index % newColors.length];
  };

  // State to show or hide the form
  const [showForm, setShowForm] = useState(true);

  const navigate = useNavigate();

  const checkLogin = async () => {
    const loginCheckBeforeTenantCheck = await loginCheckBeforeTenant();
    if (!loginCheckBeforeTenantCheck) {
      handleClickSnackbar();
      setSnackbarText("Your Session has expired please login again");
      setsnackbarSeverity("error");

      // wait 3 seconds (3000 ms) before navigating
      setTimeout(() => {
        navigate("/"); // redirect to login page
      }, 3000);
    }
  };

  // useEffect is a special function that runs code when the component mounts
  useEffect(() => {
    checkLogin();
    fetchPlantData(); // Fetch plant data when the component loads
    // fetchUser(); // Fetch user data when the component loads
  }, []);

  // Function to close the snackbar
  const handleCloseSnackbar = (e, reason) => {
    if (reason === "clickaway") {
      // If the snackbar is clicked away
      return; // Exit the function
    }
    setPlantErrorOpen(false); // Close the snackbar
  };

  // Function to open the snackbar
  const handleClickSnackbar = () => {
    setPlantErrorOpen(true); // Open the snackbar
  };

  // Function to convert a string to title case (first letter of each word capitalized)
  function convertToTitleCase(str) {
    let words = str.split(/(?=[A-Z])/); // Split the string at uppercase letters
    let capitalizedWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1); // Capitalize the first letter of each word
    });
    return capitalizedWords.join(" "); // Join the words back into a string
  }

  // Function to handle changes in the plant search input
  const handlePlantSearchChange = (event) => {
    setPlantSearch(event.target.value); // Update the search state
    console.log("Search => ", event.target.value);
    const currentSearch = event.target.value; // Get the current search input
    console.log("Search => ", plantSearch);
    // If search is empty, show all plants
    if (currentSearch === "" || currentSearch.length === 0) {
      setFilteredPlantRows(plantList); // Set filtered rows to all plants
      console.log("plantList : 1 : ", plantList);
    } else {
      // Filter the plant list based on the search input
      const updatedPlantRows = [...plantList]; // Copy the current plant list
      const filteredPlantRows = updatedPlantRows.filter(
        (plant) =>
          plant.plantID
            .toLowerCase()
            .includes(currentSearch.trim().toLowerCase()) ||
          plant.plantName
            .toLowerCase()
            .includes(currentSearch.trim().toLowerCase()) ||
          plant.address
            .toLowerCase()
            .includes(currentSearch.trim().toLowerCase()) ||
          plant.customerName
            .toLowerCase()
            .includes(currentSearch.trim().toLowerCase()) ||
          plant.division
            .toLowerCase()
            .includes(currentSearch.trim().toLowerCase())
      );
      console.log("Filtered Rows => ", filteredPlantRows);
      setFilteredPlantRows(filteredPlantRows); // Update the filtered rows
      console.log("plantList : 2 : ", filteredPlantRows);
    }
  };

  // Function to fetch plant data from the server
  const fetchPlantData = async () => {
    checkLogin();
    console.log("filteredPlantList : ", `http://${UserGroup}/plants/`);
    try {
      const data = await fetchPlantDataApi(); // Fetch plant data using the API
      if (!data) {
        // Null or undefined check
        return;
      }
      console.log("plantDetails : ", data);
      const filteredPlantList = data.filter((plant) => plant.plantID !== "NA"); // Filter out plants with 'NA' ID
      console.log("filteredPlantList : ", filteredPlantList);
      setPlantList(filteredPlantList); // Update the plant list state
      setFilteredPlantRows(filteredPlantList); // Set the filtered plant rows
      console.log("plantList : 3 : ", filteredPlantList);
    } catch (error) {
      console.log(error); // Log any errors
    }
  };

  // Function to delete a plant by its ID
  async function deletePlantByplantId(e) {
    checkLogin();
    console.log("plantId : ", e); // Log the plant ID to be deleted
    try {
      const data = await deletePlantByPlantIdApi(e); // Call the API to delete the plant
      if (data) {
        console.log("e : ", e);
        console.log("data : ", data);
        // Update the plant list to remove the deleted plant
        setPlantList((prevList) =>
          prevList.filter((item) => item.plantID !== e)
        );
        setFilteredPlantRows((prevList) =>
          prevList.filter((item) => item.plantID !== e)
        );
        handleClickSnackbar(); // Open the snackbar
        setsnackbarSeverity("success"); // Set snackbar severity to success
        setSnackbarText("Plant deleted successfully"); // Set success message
        setOpenPlantDeleteDialog(false); // Close the delete confirmation dialog
      }
    } catch (error) {
      handleClickSnackbar(); // Open the snackbar
      setsnackbarSeverity("error"); // Set snackbar severity to error
      setSnackbarText("Unable to delete plant!"); // Set error message
      console.log(error); // Log any errors
    }
  }

  // Function to add a new plant to the list
  const postPlantData = async () => {
    checkLogin();
    // Create an object to store errors for the new plant's details
    const newFormErrors = {};

    // Check each detail of the new plant (like name, ID, etc.)
    Object.keys(newPlant).forEach((key) => {
      // If a detail is empty or null (meaning not filled in), mark it as an error
      if (newPlant[key] === null || newPlant[key] === "") {
        newFormErrors[key] = true; // There is an error
      } else {
        newFormErrors[key] = false; // No error
      }
    });

    // Set the errors in the form state so we can show them later
    setFormErrors(newFormErrors);

    // Loop through each detail again to check if any are empty
    for (const key in newPlant) {
      if (newPlant[key] === null || newPlant[key] === "") {
        // If a detail is empty, show a message saying it must be filled
        handleClickSnackbar(); // Show a small message at the bottom
        setSnackbarText(`${convertToTitleCase(key)} must be filled`); // Set the message to say what’s missing
        setsnackbarSeverity("error"); // Mark it as an error
        console.log(`${convertToTitleCase(key)} must be filled`); // Print it in the console for debugging
        return; // Stop the function here
      }
    }

    // Check if the plant name already exists in the list
    if (
      plantList.some(
        (p) =>
          p.plantName.toLowerCase().trim() ===
          newPlant.plantName.toLowerCase().trim()
      )
    ) {
      // If it does, show an error message
      handleClickSnackbar();
      setSnackbarText("Plant name already exist"); // Message saying name is taken
      setsnackbarSeverity("error"); // Mark it as an error
      return; // Stop the function here
    }

    // Check if the plant ID already exists in the list
    if (
      plantList.some(
        (p) =>
          p.plantID.toLowerCase().trim() ===
          newPlant.plantID.toLowerCase().trim()
      )
    ) {
      // If it does, show an error message
      handleClickSnackbar();
      setSnackbarText("Plant Id already exist"); // Message saying ID is taken
      setsnackbarSeverity("error"); // Mark it as an error
      return; // Stop the function here
    }

    // If everything is okay, try to add the new plant
    try {
      const response = await postPlantDataApi(newPlant); // Send the new plant data to the server
      if (response.ok) {
        // If the server says it’s okay
        const text = await response.text(); // Get the response text
        handleClickSnackbar(); // Show a small message at the bottom
        setSnackbarText(text); // Set the success message
        setsnackbarSeverity("success"); // Mark it as success
        // Reset the new plant details to be empty again
        setNewPlant({
          plantName: "",
          plantID: "",
          address: "",
          customerName: "",
          division: "",
        });
      } else {
        // If there was an error from the server
        const text = await response.text(); // Get the error message
        handleClickSnackbar(); // Show a small message at the bottom
        setSnackbarText(text); // Set the error message
        setsnackbarSeverity("error"); // Mark it as an error
        return; // Stop the function here
      }
      fetchPlantData(); // Refresh the list of plants to include the new one
    } catch (error) {
      // If something went wrong when trying to add the plant
      console.log(error); // Print the error in the console for debugging
    }
  };

  // Function to handle when someone wants to delete a plant
  const handlePlantDelete = (plantId) => {
    setOpenPlantDeleteDialog(true); // Open the confirmation dialog
    setSelectedplantId(plantId); // Remember which plant ID is selected for deletion
  };

  // Function to remove special characters from a string
  function removeAllSpecialChar(str) {
    // Replace any character that is not a letter, number, or space with an empty string
    var stringWithoutSpecialChars = str.replace(/[^a-zA-Z0-9\s]/g, "");
    // Replace multiple spaces with a single space
    var stringWithoutExtraSpaces = stringWithoutSpecialChars.replace(
      /\s+/g,
      " "
    );
    return stringWithoutExtraSpaces; // Return the cleaned-up string
  }

  // This is a React component that shows a form to add a new plant
  return (
    <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
      <>
        {/* A container to hold the button and title */}
        <div
          style={{
            display: "flex", // Use flexbox to arrange items in a row
            alignItems: "center", // Center items vertically
            columnGap: "1rem", // Space between columns
            rowGap: "1rem", // Space between rows
            margin: "1rem 0", // Margin around the container
          }}
        >
          {/* Button to show or hide the form */}
          <IconButton
            variant="contained"
            onClick={() => setShowForm(!showForm)} // Toggle the form visibility
            sx={{
              backgroundColor: "#77c0f1", // Button color
              borderRadius: "50px", // Round the corners of the button
            }}
          >
            {/* Show different icons based on whether the form is shown or not */}
            {showForm ? (
              <Tooltip title="Show All Plant">
                <ArrowDropUpOutlinedIcon /> {/* Icon to show plants */}
              </Tooltip>
            ) : (
              <Tooltip title="Add Plant">
                <ArrowDropDownOutlinedIcon /> {/* Icon to add a plant */}
              </Tooltip>
            )}
          </IconButton>
          {/* Title of the section */}
          <Typography sx={{ fontWeight: 600 }}>Plant Configuration</Typography>
        </div>
        {/* If the form should be shown, display it */}
        {showForm && (
          <>
            {/* Card that contains the form to add a new plant */}
            <Card
              style={{ marginBottom: "1.5rem" }} // Add space below the card
              className="primeCardStyle" // Custom styles for the card
              title={
                <Typography sx={{ fontWeight: 600, marginBottom: "0.7rem" }}>
                  Add Plant
                </Typography>
              }
            >
              <Grid container spacing={2}>
                {" "}
                {/* Create a grid layout for the form */}
                {/* Each Grid item represents a field in the form */}
                <Grid item xs={6}>
                  <TextField
                    required // This field is required
                    fullWidth={true} // Make the field take full width
                    name="plantName" // Name of the field
                    label="Plant Name" // Label shown to the user
                    id="plantName" // Unique identifier for the field
                    value={newPlant.plantName} // Current value of the field
                    onChange={(e) => {
                      // When the value changes, update the state
                      setNewPlant({
                        ...newPlant,
                        plantName: removeAllSpecialChar(e.target.value), // Clean up the input
                      });
                      // Check for errors in the input
                      setFormErrors({
                        ...formErrors,
                        plantName: e.target.value.trim() === "", // Set error if empty
                      });
                    }}
                    onBlur={(e) => {
                      // When the field loses focus, clean up the input
                      setNewPlant({
                        ...newPlant,
                        plantName: removeAllSpecialChar(e.target.value.trim()),
                      });
                    }}
                    error={formErrors.plantName} // Show error state if there's an error
                    helperText={
                      formErrors.plantName && "Plant Name must be filled" // Show helper text if there's an error
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required // This field is required
                    fullWidth={true} // Make the field take full width
                    name="plantId" // Name of the field
                    label="Plant Id" // Label shown to the user
                    id="plantId" // Unique identifier for the field
                    value={newPlant.plantID} // Current value of the field
                    onChange={(e) => {
                      // When the value changes, update the state
                      setNewPlant({
                        ...newPlant,
                        plantID: removeAllSpecialChar(
                          e.target.value.toUpperCase().trim()
                        ), // Clean up the input
                      });
                      // Check for errors in the input
                      setFormErrors({
                        ...formErrors,
                        plantID: e.target.value.trim() === "", // Set error if empty
                      });
                    }}
                    error={formErrors.plantID} // Show error state if there's an error
                    helperText={formErrors.plantID && "Plant Id must be filled"} // Show helper text if there's an error
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required // This field is required
                    fullWidth={true} // Make the field take full width
                    name="address" // Name of the field
                    label="Address" // Label shown to the user
                    id="address" // Unique identifier for the field
                    value={newPlant.address} // Current value of the field
                    onChange={(e) => {
                      // When the value changes, update the state
                      setNewPlant({ ...newPlant, address: e.target.value }); // Update address
                      // Check for errors in the input
                      setFormErrors({
                        ...formErrors,
                        address: e.target.value.trim() === "", // Set error if empty
                      });
                    }}
                    onBlur={(e) => {
                      // When the field loses focus, clean up the input
                      setNewPlant({
                        ...newPlant,
                        address: e.target.value.trim(),
                      });
                    }}
                    error={formErrors.address} // Show error state if there's an error
                    helperText={formErrors.address && "Address must be filled"} // Show helper text if there's an error
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required // This field is required
                    fullWidth={true} // Make the field take full width
                    name="customer" // Name of the field
                    label="Customer" // Label shown to the user
                    id="customer" // Unique identifier for the field
                    value={newPlant.customerName} // Current value of the field
                    onChange={(e) => {
                      // When the value changes, update the state
                      setNewPlant({
                        ...newPlant,
                        customerName: removeAllSpecialChar(e.target.value), // Clean up the input
                      });
                      // Check for errors in the input
                      setFormErrors({
                        ...formErrors,
                        customerName: e.target.value.trim() === "", // Set error if empty
                      });
                    }}
                    onBlur={(e) => {
                      // When the field loses focus, clean up the input
                      setNewPlant({
                        ...newPlant,
                        customerName: removeAllSpecialChar(
                          e.target.value.trim()
                        ),
                      });
                    }}
                    error={formErrors.customerName} // Show error state if there's an error
                    helperText={
                      formErrors.customerName && "Customer Name must be filled" // Show helper text if there's an error
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required // This field is required
                    fullWidth={true} // Make the field take full width
                    name="division" // Name of the field
                    label="Division" // Label shown to the user
                    id="division" // Unique identifier for the field
                    value={newPlant.division} // Current value of the field
                    onChange={(e) => {
                      // When the value changes, update the state
                      setNewPlant({
                        ...newPlant,
                        division: removeAllSpecialChar(e.target.value), // Clean up the input
                      });
                      // Check for errors in the input
                      setFormErrors({
                        ...formErrors,
                        division: e.target.value.trim() === "", // Set error if empty
                      });
                    }}
                    onBlur={(e) => {
                      // When the field loses focus, clean up the input
                      setNewPlant({
                        ...newPlant,
                        division: removeAllSpecialChar(e.target.value.trim()),
                      });
                    }}
                    error={formErrors.division} // Show error state if there's an error
                    helperText={
                      formErrors.division && "Division must be filled" // Show helper text if there's an error
                    }
                  />
                </Grid>
              </Grid>
              {/* Button to save the new plant */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  sx={{
                    mt: 1, // Margin on top
                    mb: 1, // Margin on bottom
                    backgroundImage:
                      "linear-gradient(to top, #0ba360 0%, #3cba92 100%);", // Background color of the button
                  }}
                  onClick={() => {
                    postPlantData(); // Call the function to add the plant
                    fetchPlantData(); // Refresh the list of plants
                  }}
                >
                  Save Plant
                  {/* Text on the button */}
                </Button>
              </div>
            </Card>
          </>
        )}
        {/* Create a card that holds the table of existing plants */}
        <Card className="primeReactCard-padding primeCardStyle">
          {/* Set up a grid to organize the content inside the card */}
          <Grid
            item
            xs={12} // Make this grid item take the full width (12 out of 12)
            display={"flex"} // Use flexbox to arrange items
            flexDirection={"column"} // Arrange items in a column (top to bottom)
            justifyContent={"center"} // Center items vertically
            alignItems={"center"} // Center items horizontally
          >
            {/* Create a container for the table */}
            <TableContainer>
              {/* Set up the actual table to display data */}
              <Table>
                {/* Create the header section of the table */}
                <TableHead>
                  {/* A row for the table header */}
                  <TableRow>
                    {/* A cell that spans 8 columns and contains a title and search bar */}
                    <TableCell
                      colSpan={8} // This cell will stretch across 8 columns
                      sx={{
                        textAlign: "center", // Center the text inside this cell
                        fontSize: "15px", // Set the text size
                        fontWeight: "bold", // Make the text bold
                      }}
                    >
                      <div
                        style={{
                          display: "flex", // Use flexbox to arrange items
                          alignItems: "center", // Center items vertically
                          justifyContent: "space-between", // Space items apart
                          padding: "0rem", // No padding around the div
                        }}
                      >
                        {/* Title of the table */}
                        <Typography sx={{ fontWeight: "600" }}>
                          Existing Plants
                        </Typography>
                        {/* A section for the search bar and clear button */}
                        <div
                          style={{
                            display: "flex", // Use flexbox for this section
                            alignItems: "center", // Center items vertically
                            justifyContent: "space-between", // Space items apart
                            columnGap: "1rem", // Space between columns
                          }}
                        >
                          <div>
                            {/* Create a form control for the search input */}
                            <FormControl fullWidth>
                              <InputLabel htmlFor="search">
                                {/* Search label with an icon */}
                                <div style={{ display: "flex" }}>
                                  <SearchOutlinedIcon
                                    style={{
                                      marginRight: "5px", // Space to the right of the icon
                                      padding: "14.5px 14px !important", // Padding around the icon
                                      height: "0.9375rem !important", // Set the height of the icon
                                    }}
                                  />
                                  Search...{" "}
                                  {/* Label text for the search input */}
                                </div>
                              </InputLabel>

                              {/* The actual input field for searching plants */}
                              <OutlinedInput
                                label="   Search..." // Label for the input
                                autoComplete="search" // Help with auto-filling
                                name="search" // Name of the input for identification
                                required // This field must be filled
                                fullWidth // Make the input take full width
                                id="search" // Unique ID for the input
                                value={plantSearch} // The current value of the search input
                                sx={{
                                  marginLeft: "5px", // Space to the left of the input
                                  width: "200px", // Set the width of the input
                                  padding: "23.5px 14px !important", // Padding around the input
                                  height: "1.1375rem !important", // Set the height of the input
                                }}
                                // Function to handle changes in the search input
                                onChange={(e) => handlePlantSearchChange(e)}
                                endAdornment={
                                  // Extra elements to appear at the end of the input
                                  <Tooltip title="Clear">
                                    {" "}
                                    {/* Tooltip that shows when hovering over the clear button */}
                                    <InputAdornment position="end">
                                      {" "}
                                      {/* Position the clear button at the end */}
                                      <IconButton
                                        variant="contained" // Button style
                                        aria-label="delete" // Accessible label
                                        size="medium" // Set the size of the button
                                        // Function to clear the search input
                                        onClick={() => {
                                          setPlantSearch(""); // Clear the search input
                                          setFilteredPlantRows(plantList); // Reset the filtered list to show all plants
                                          console.log(
                                            "plantList : 5 : ",
                                            plantList // Log the plant list for debugging
                                          );
                                        }}
                                      >
                                        <CloseIcon fontSize="inherit" />{" "}
                                        {/* Icon to show a close button */}
                                      </IconButton>
                                    </InputAdornment>
                                  </Tooltip>
                                }
                              />
                            </FormControl>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableHead>
                {/* Create the table header where we define the names of each column */}
                <TableHead>
                  <TableRow>
                    {/* Column for Plant Name */}
                    <TableCell
                      sx={{
                        fontWeight: "bold", // Make the text bold
                        fontSize: "14px", // Set the text size
                        backgroundColor: "#263238", // Dark background color
                        color: "white", // White text color
                      }}
                      align="center" // Center the text in this cell
                    >
                      Plant Name
                    </TableCell>
                    {/* Column for Plant ID */}
                    <TableCell
                      sx={{
                        fontWeight: "bold", // Make the text bold
                        fontSize: "14px", // Set the text size
                        backgroundColor: "#263238", // Dark background color
                        color: "white", // White text color
                      }}
                      align="center" // Center the text in this cell
                    >
                      Plant Id
                    </TableCell>
                    {/* Column for Address */}
                    <TableCell
                      sx={{
                        fontWeight: "bold", // Make the text bold
                        fontSize: "14px", // Set the text size
                        backgroundColor: "#263238", // Dark background color
                        color: "white", // White text color
                      }}
                      align="center" // Center the text in this cell
                    >
                      Address
                    </TableCell>

                    {/* Column for Customer Name */}
                    <TableCell
                      sx={{
                        fontWeight: "bold", // Make the text bold
                        fontSize: "14px", // Set the text size
                        backgroundColor: "#263238", // Dark background color
                        color: "white", // White text color
                      }}
                      align="center" // Center the text in this cell
                    >
                      Customer Name
                    </TableCell>
                    {/* Column for Division */}
                    <TableCell
                      sx={{
                        fontWeight: "bold", // Make the text bold
                        fontSize: "14px", // Set the text size
                        backgroundColor: "#263238", // Dark background color
                        color: "white", // White text color
                      }}
                      align="center" // Center the text in this cell
                    >
                      Division
                    </TableCell>

                    {/* Column for the Delete action */}
                    <TableCell
                      sx={{
                        fontWeight: "bold", // Make the text bold
                        fontSize: "14px", // Set the text size
                        backgroundColor: "#263238", // Dark background color
                        color: "white", // White text color
                      }}
                      align="center" // Center the text in this cell
                    >
                      Delete
                    </TableCell>
                  </TableRow>
                </TableHead>
                {/* Body of the table where we display the actual data */}
                <TableBody>
                  {/* Loop through each plant in the filtered list and create a row for it */}
                  {filteredPlantRows.map((item, index) => (
                    <TableRow key={index}>
                      {" "}
                      {/* Each row has a unique key */}
                      {/* Cell for Plant Name */}
                      <TableCell align="center">{item.plantName}</TableCell>
                      {/* Cell for Plant ID with a styled Chip */}
                      <TableCell align="center">
                        <Chip
                          variant="outlined" // Make it look outlined
                          label={item.plantID} // Show the Plant ID
                          sx={{
                            color: getColor(index), // Color based on index
                            borderColor: getColor(index), // Border color based on index
                            fontWeight: 600, // Make the text bold
                          }}
                        />
                      </TableCell>
                      {/* Cell for Address */}
                      <TableCell align="center">{item.address}</TableCell>
                      {/* Cell for Customer Name with a Chip */}
                      <TableCell align="center">
                        <Chip label={item.customerName} />{" "}
                        {/* Show customer name in a Chip */}
                      </TableCell>
                      {/* Cell for Division */}
                      <TableCell align="center">{item.division}</TableCell>
                      {/* Cell for Delete action */}
                      <TableCell align="center">
                        {/* Icon to delete the plant */}
                        <DeleteIcon
                          color="error" // Red color for error
                          style={{ cursor: "pointer" }} // Change cursor to pointer when hovering
                          onClick={() => handlePlantDelete(item.plantID)} // Call delete function when clicked
                        />
                        {/* Dialog that asks for confirmation before deleting */}
                        <Dialog
                          open={openPlantDeleteDialog} // Show dialog if open
                          onClose={() => setOpenPlantDeleteDialog(false)} // Close dialog when done
                          aria-labelledby="alert-dialog-title" // Accessibility for screen readers
                          aria-describedby="alert-dialog-description" // Accessibility for screen readers
                        >
                          <DialogTitle id="alert-dialog-title">
                            {"Delete Plant Data?"}
                            {/* Title of the dialog */}
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                              Are you sure you want to delete this Plant:{" "}
                              {selectedplantId} ?{" "}
                              {/* Show the selected plant ID */}
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            {/* Cancel button to close the dialog */}
                            <Button
                              onClick={() => setOpenPlantDeleteDialog(false)}
                              color="primary" // Primary button color
                            >
                              Cancel
                            </Button>
                            {/* Delete button that performs the deletion */}
                            <Button
                              onClick={() => {
                                deletePlantByplantId(selectedplantId); // Delete the plant by ID
                                setOpenPlantDeleteDialog(false); // Close the dialog
                              }}
                              color="error" // Red color for error
                              autoFocus // Automatically focus on this button
                            >
                              Delete
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Card>
        {/* Confirmation dialog for deletion, this is similar to the above dialog and can be removed if not needed */}
        <Dialog
          open={openPlantDeleteDialog} // Show dialog if open
          onClose={() => setOpenPlantDeleteDialog(false)} // Close dialog when done
          aria-labelledby="alert-dialog-title" // Accessibility for screen readers
          aria-describedby="alert-dialog-description" // Accessibility for screen readers
        >
          <DialogTitle id="alert-dialog-title">
            {"Delete Plant Data?"}
            {/* Title of the dialog */}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this Plant: {selectedplantId} ?{" "}
              {/* Show the selected plant ID */}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenPlantDeleteDialog(false)} // Close dialog when clicked
              color="primary" // Primary button color
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                deletePlantByplantId(selectedplantId); // Delete the plant by ID
                setOpenPlantDeleteDialog(false); // Close the dialog
              }}
              color="error" // Red color for error
              autoFocus // Automatically focus on this button
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        {/* Snackbar to show error messages to the user */}
        <Snackbar
          open={plantErrorOpen} // Show snackbar if open
          autoHideDuration={3000} // Auto-hide after 3 seconds
          onClose={handleCloseSnackbar} // Function to close snackbar
          TransitionComponent={Slide} // Use slide transition
          anchorOrigin={{ vertical: "top", horizontal: "right" }} // Position the snackbar
        >
          <Alert
            onClose={handleCloseSnackbar} // Function to close alert
            severity={snackbarSeverity} // Severity type (like error, success)
            variant="filled" // Filled variant of the alert
            sx={{ width: "100%" }} // Full width
          >
            {snackbarText}
            {/* Text to display in the alert */}
          </Alert>
        </Snackbar>
      </>
    </Container>
  );
}
