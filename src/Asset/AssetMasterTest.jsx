// Importing Material-UI icons and components
import AddIcon from "@mui/icons-material/Add"; // Icon for adding new items
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"; // Icon for showing information

// Importing Material-UI components
import {
  AppBar,
  Avatar,
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Card,
  CardContent, // For showing a small count on a component
  Chip, // For displaying a small piece of information
  Container, // For layout purposes
  Fab,
  Grid, // Floating action button component
  Tooltip,
  Typography, // For showing additional information on hover
  useMediaQuery, // For responsive design handling
  useTheme, // For accessing the theme properties
} from "@mui/material";

// Importing PrimeReact components
import { Button } from "primereact/button"; // Button component from PrimeReact
import { Column } from "primereact/column"; // Column component for DataTable
import { DataTable } from "primereact/datatable"; // DataTable component for displaying tabular data
import { InputText } from "primereact/inputtext"; // Input field component

// Importing React hooks and routing components
import React, { useEffect, useState } from "react"; // React library and hooks
import { useLocation, useNavigate } from "react-router-dom"; // For routing and navigation

// Importing API functions
import { fetchAllotedPagesByUserId } from "../CommonAPI"; // Fetching allotted pages by user ID
import {
  CheckAssetGroupExists, // Check if an asset group exists
  deleteAnAssetGroup, // Function to delete an asset group
  getAssetGroupsList, // Function to get a list of asset groups
} from "../Logbook Asset/LogbookAssetApi"; // API functions for asset groups

// Importing custom components
import CustomDialog from "../components/shared/dialog/dialog.component"; // Custom dialog component
import SnackbarComponent from "../components/shared/snackbar/customSnackbar"; // Snackbar for notifications
import AssetCreation from "./AssetCreation"; // Component for asset creation

// Importing PrimeReact progress bar component
import { ProgressBar } from "primereact/progressbar"; // Progress bar for showing loading state
import "./assetStyle.css"; // CSS styles for the component
import ControlPointIcon from "@mui/icons-material/ControlPoint";
// Defining the AssetMasterTest functional component
const AssetMasterTest = () => {
  // State hooks for managing different states in the component
  const [snackbarText, setSnackbarText] = useState("Data saved !"); // Text for the snackbar notification
  const [snackbarSeverity, setsnackbarSeverity] = useState("success"); // Severity level for the snackbar (success, error, etc.)
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Boolean to control snackbar visibility
  const [showCreation, setShowCreation] = useState(false); // Boolean to control asset creation dialog visibility
  const [assetGroupId, setAssetGroupId] = useState(""); // State to hold the asset group ID
  const [assetGroupName, setAssetGroupName] = useState(""); // State to hold the asset group name
  const [delOpen, setDelOpen] = useState(false); // Boolean to control delete confirmation dialog visibility
  const currentPathName = useLocation().pathname; // Getting the current pathname from the router
  const navigate = useNavigate(); // Function for navigation
  const [groups, setGroups] = useState([]); // State to hold the list of asset groups
  const [loader, setLoader] = useState(); // State to control loader visibility
  const [globalFilter, setGlobalFilter] = useState(null); // State for managing global filter in the DataTable
  const theme = useTheme(); // Accessing the theme object for styling
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if the screen size is mobile

  // Using useEffect to perform side effects in the this component
  useEffect(() => {
    // Log message to indicate that the useEffect hook has been called
    console.log("UseEffect Called");

    // Defining an asynchronous function to fetch asset groups
    async function fetchAssetAllGroups() {
      setLoader(true); // Set loader to true to indicate loading state
      let data = await getAssetGroupsList(); // Fetching the list of asset groups asynchronously
      setGroups(data); // Updating the state with the fetched asset groups data
      setLoader(false); // Set loader to false to indicate loading has finished
      console.log("Asset Group data : ", data); // Log the fetched asset groups data
    }

    // Calling the fetchAssetAllGroups function to execute the data fetching
    fetchAssetAllGroups();

    // Function call to fetchAllotedPages ( fetches pages allotted to the user)
    fetchAllotedPages();
  }, []); // Empty dependency array means this effect runs only once after the initial render

  // Function to fetch the pages allotted to the current user
  const fetchAllotedPages = async () => {
    // Await the result of fetching allotted pages by user ID
    const allotedPages = await fetchAllotedPagesByUserId();

    // Check if the current pathname is not included in the allotted pages
    if (!allotedPages?.includes(currentPathName)) {
      // Navigate to the restricted page if the current path is not allowed
      navigate("/restricted");
    }
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

  // Function to render the header of the DataTable
  const renderHeader = () => {
    return (
      <div
        className="table-header" // CSS class for styling the header
        style={{
          display: isMobile ? "grid" : "flex", // Use grid layout on mobile, flex on larger screens
          justifyContent: "space-between", // Space out the children evenly
          alignItems: "center", // Center items vertically
          margin: "0rem 0.8rem", // Set margin around the header
        }}
      >
        <h4 className="mx-0 my-1">Manage Asset Groups</h4>{" "}
        {/* Header title for the section */}
        <span className="p-input-icon-left">
          {" "}
          {/* Container for the search input */}
          <i className="pi pi-search" /> {/* Search icon */}
          <InputText
            type="search" // Input type for searching
            className="p-inputtext-sm" // CSS class for styling the input
            onInput={(e) => setGlobalFilter(e.target.value)} // Update global filter state on input change
            placeholder="Keyword Search" // Placeholder text for the input field
          />
        </span>
      </div>
    );
  };

  // Function to delete an asset group
  const deleteGroup = async () => {
    // Await the result of deleting an asset group by ID
    const success = await deleteAnAssetGroup(assetGroupId);

    // Log the status of the delete operation
    console.log("delete status ", success);

    // Check if the delete operation was successful
    if (success?.status === 200) {
      setsnackbarSeverity(); // Clear any previous snackbar severity (might need a value)
      setSnackbarText("Asset Deleted Successfully"); // Set success message for snackbar
      setSnackbarOpen(true); // Open the snackbar to show the message

      setDelOpen(false); // Close the delete confirmation dialog
      // Update the groups state by filtering out the deleted group
      setGroups(groups.filter((group) => group.groupId !== assetGroupId));
    } else {
      setsnackbarSeverity("error"); // Set error severity for snackbar
      setSnackbarText("Failed To Delete"); // Set failure message for snackbar
      setSnackbarOpen(true); // Open the snackbar to show the message
    }
  };

  // Function to render a template for group IDs in a DataTable
  const groupIdTemplate = (rowData) => {
    return (
      <Chip // Using the Chip component from Material-UI
        style={{ cursor: "pointer" }} // Set cursor to pointer for hover effect
        variant="outlined" // Outline variant for the Chip
        size="small"
        color="info" // Color for the Chip
        onClick={() => {
          // Function to handle click event on the Chip
          // console.log("Suraj ", rowData.groupId); // (Optional) Log the group ID (commented out)
          setAssetGroupId(rowData.groupId); // Set the selected asset group ID
          setAssetGroupName(rowData.groupName); // Set the selected asset group name
          setShowCreation(true); // Show the asset creation dialog
        }}
        label={rowData.groupName} // Display the group ID as the label of the Chip
      />
    );
  };

  // ActionButton component to render delete action for asset groups
  const ActionButton = ({ rowData }) => {
    // console.log("rowData?.groupName : ::: ", rowData); // (Optional) Log the row data for debugging
    // const [isAssetAssociated, setIsAssetAssociated] = useState(true); // State to track if the asset is associated
    const [isAssetAssociated, setIsAssetAssociated] = useState(false); // State to track if the asset is associated

    // useEffect to fetch asset association status when the group name changes
    useEffect(() => {
      const fetchData = async () => {
        // console.log("rowData?.groupName ->  ", rowData?.groupName); // (Optional) Log the group name for debugging
        const result = await CheckAssetGroupExists(rowData?.groupName); // Check if the asset group exists with any task or not
        // console.log("setIsAssetAssociated ", result); // (Optional) Log the result of the check
        // setIsAssetAssociated(result); // Update state based on the result
        setIsAssetAssociated(false);
      };

      fetchData(); // Call the fetchData function to execute the check
    }, [rowData?.groupName]); // Dependency array to trigger effect on group name change

    // If isAssetAssociated is null, return nothing or a loader (optional)
    if (isAssetAssociated === null) {
      return null; // While loading, return nothing
    }

    // Render delete button or disabled button based on asset association status
    return !isAssetAssociated ? (
      <Tooltip title="Delete Asset">
        {" "}
        {/* Tooltip for delete action */}
        <Button
          icon="pi pi-trash" // Icon for the delete button
          className="p-button-danger disabledFocus" // CSS classes for styling
          rounded // Rounded style for the button
          text // Text button style
          outlined
          raised={isMobile?false:true} // Raised button style
          onClick={() => {
            // Function to handle button click
            console.log("Asset GroupId ", rowData.groupId); // Log the group ID (for debugging)
            setAssetGroupId(rowData.groupId); // Set the asset group ID for deletion
            setDelOpen(true); // Open the delete confirmation dialog
          }}
        />
      </Tooltip>
    ) : (
      <Tooltip title="The Asset Is Already Associated With The Task">
        {" "}
        {/* Tooltip for disabled button */}
        <Badge badgeContent=" " variant={<></>}>
          {" "}
          {/* Badge component to wrap the button */}
          <Button
            icon="pi pi-trash" // Icon for the delete button
            className="p-button-secondary disabledFocus" // CSS classes for styling
            rounded // Rounded style for the button
            text // Text button style
            raised // Raised button style
            disabled={true} // Disable the button
            // onClick={() => { // (Optional) Uncomment to enable click action
            //   setAssetGroupId(rowData.groupId); // Set the asset group ID
            //   setAssetGroupName(rowData.groupName); // Set the asset group name
            //   setShowCreation(true); // Show the asset creation dialog
            // }}
          />
        </Badge>
      </Tooltip>
    );
  };

  // Call the renderHeader function to create the header for the DataTable
  const header = renderHeader();

  return (
    <>
      {/* Check if the creation dialog is not shown */}
      {!showCreation ? (
        <Container
          maxWidth="lg"
          sx={{
            padding: "0 !important",
          }}
        >
          {" "}
          {/* Main container for the data table */}
          <div>
            {!isMobile && (
              <DataTable
                removableSort // Allow sorting to be removed
                stripedRows // Apply striped row styles
                size="normal" // Set table size
                emptyMessage={
                  // Message displayed when there are no rows
                  loader ? ( // Show loader if data is being fetched
                    <ProgressBar
                      mode="indeterminate" // Indeterminate loading mode
                      style={{ height: "6px" }} // Set height of the progress bar
                    />
                  ) : (
                    "No Data Available" // Message when no data is available
                  )
                }
                value={groups} // Data source for the table
                header={header} // Header for the table
                footer={
                  // Footer content for the table
                  <Chip
                    icon={<InfoOutlinedIcon />} // Icon for the Chip
                    size="small" // Set Chip size
                    label="Click on Group Name to View/Modify Asset" // Tooltip text
                  />
                }
                className="UserInfoTableStyle dataTableStyle HeaderColor" // CSS classes for styling
                globalFilter={globalFilter} // Global filter for searching
                // paginator // Uncomment to enable pagination
                rows={10} // Number of rows to display
              >
                {/* Column definitions for the DataTable */}
                {/* <Column
                field="groupName" // Data field for this column
                header="Group Name" // Column header text
                sortable // Enable sorting for this column
              /> */}
                <Column
                  field="groupName" // Data field for this column
                  header="Group Name" // Column header text
                  body={groupIdTemplate} // Custom body rendering using groupIdTemplate
                  sortable // Enable sorting for this column
                />
                <Column
                  field="createdBy" // Data field for this column
                  header="Created By" // Column header text
                  sortable // Enable sorting for this column
                  body={(rowData) => (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyItems: "center",
                          padding: "0.2rem",
                          alignItems: "center",
                          justifyContent: "center",
                          columnGap: "0.5rem",
                        }}
                      >
                        {/* <Avatar
                        style={{
                          backgroundColor: "#78909c",
                          color: "#ffffff",
                          width: 30,
                          height: 30,
                          fontSize: "1rem",
                        }}
                        shape="circle" 
                      >
                        
                        {getInitials(rowData.createdBy)}
                      </Avatar> */}
                        {rowData.createdBy}
                      </div>
                    </>
                  )}
                />
                <Column
                  field="createdOn" // Data field for this column
                  header="Created On" // Column header text
                  sortable // Enable sorting for this column
                />
                <Column
                  field="Action" // Data field for this column
                  header="Action" // Column header text
                  body={(rowData) => <ActionButton rowData={rowData} />} // Custom body rendering using ActionButton
                />
              </DataTable>
            )}
            {isMobile && (
              <div className="cards-wrapper">
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
                      margin: "0.6rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    Manage Asset Groups
                  </Typography>
                </Grid>
                {groups.length > 0 ? (
                  groups.map((group, index) => (
                    <div key={index} className="card">
                      <>
                        <Grid
                          container
                          spacing={1}
                          sx={{ marginBottom: "1rem" }}
                        >
                          <Grid item xs={12} sm={6} md={4} lg={3}>
                            <Card
                              style={{
                                borderRadius: "10px",
                                height: "100%",
                                background: "",
                                boxShadow: 9,
                              }}
                            >
                              <CardContent sx={{ padding: "0 !important" }}>
                                <>
                                  <Grid
                                    container
                                    xs={12}
                                    sx={{
                                      padding: "0.5rem",
                                      background: "#EFF3EA",
                                    }}
                                  >
                                    <Grid xs={9} sx={{ display: "flex" }}>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          columnGap: "0.5rem",
                                        }}
                                      >
                                        <Avatar
                                          style={{
                                            backgroundColor: "#2196F3", // Avatar background color
                                            color: "#ffffff", // Avatar text color
                                            width: 32, // Avatar width
                                            height: 32, // Avatar height
                                            fontSize: "0.9rem", // Avatar font size
                                          }}
                                          shape="circle" // Making avatar circular
                                        >
                                          {getInitials(group.createdBy)}
                                          {/*Function to get initials from creatorName */}
                                        </Avatar>
                                        <div style={{ display: "grid" }}>
                                          <Typography
                                            variant="boby1"
                                            sx={{
                                              fontWeight: 600,
                                              fontSize: "0.85rem",
                                              color: "#424242",
                                            }}
                                          >
                                            {groupIdTemplate(group)}
                                          </Typography>
                                          <Typography
                                            variant="boby1"
                                            sx={{
                                              fontSize: "0.65rem",
                                              color: "#616161",
                                              marginLeft: "0.5rem",
                                            }}
                                          >
                                            Group Name
                                          </Typography>
                                        </div>
                                      </div>
                                    </Grid>
                                    <Grid
                                      xs={3}
                                      container
                                      sx={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <ActionButton rowData={group} />
                                    </Grid>
                                  </Grid>

                                  <div
                                    className="card-content"
                                    style={{ padding: "0.5rem 1.2rem" }}
                                  >
                                    <div
                                      className="card-field"
                                      style={{ marginBottom: "0.4rem" }}
                                    >
                                      <strong>Created By:</strong>{" "}
                                      {group.createdBy}
                                    </div>
                                    <div className="card-field">
                                      <strong>Created On:</strong>{" "}
                                      {group.createdOn}
                                    </div>
                                  </div>
                                </>
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                      </>
                    </div>
                  ))
                ) : (
                  <Typography variant="body2">No Data Available</Typography>
                )}
              </div>
            )}
            {/* Floating action button for adding assets */}
            {!isMobile && (
              <Tooltip title="Add Asset" placement="left">
                {/* Tooltip for the button */}
                <Fab
                  color="primary" // Button color
                  aria-label="add" // Accessibility label
                  style={{
                    // Inline styles for positioning
                    position: "fixed", // Fixed position on the screen
                    bottom: 50, // Distance from the bottom of the viewport
                    right: 50, // Distance from the right of the viewport
                    animation: "fadeIn 0.5s ease-in-out", // Animation effect for the button
                  }}
                  onClick={() => {
                    // Function to handle button click
                    // console.log("Suraj ", rowData.groupId); // (Optional) Log the group ID for debugging
                    setAssetGroupId(null); // Reset asset group ID for new creation
                    setShowCreation(true); // Show the asset creation dialog
                  }}
                >
                  <AddIcon /> {/* Icon for the add button */}
                </Fab>
              </Tooltip>
            )}
            {/* For Mobile  */}
            {isMobile && ( // Check if on mobile device
              <AppBar
                position="fixed" // Fix position at the bottom
                color="primary" // Set color of the AppBar
                sx={{ top: "auto", bottom: 0 }} // Position at the bottom
              >
                <BottomNavigation showLabels>
                  <BottomNavigationAction
                    label="Add Asset" // Label for the button
                    icon={<ControlPointIcon size="small" color="primary" />} // Icon for the button
                    onClick={() => {
                      // Function to handle button click
                      // console.log("Suraj ", rowData.groupId); // (Optional) Log the group ID for debugging
                      setAssetGroupId(null); // Reset asset group ID for new creation
                      setShowCreation(true); // Show the asset creation dialog
                    }}
                  />
                </BottomNavigation>
              </AppBar>
            )}

            {/* Custom dialog for confirming deletion */}
            <CustomDialog
              open={delOpen} // State to control dialog open/close
              setOpen={setDelOpen} // Function to update dialog state
              proceedButtonText={"YES"} // Text for the proceed button
              proceedButtonClick={deleteGroup} // Function to call on proceed
              cancelButtonText={"NO"} // Text for the cancel button
            />

            {/* Snackbar component for notifications */}
            <SnackbarComponent
              openPopup={snackbarOpen} // State to control snackbar open/close
              setOpenPopup={setSnackbarOpen} // Function to update snackbar state
              dialogMessage={snackbarText} // Message to display in the snackbar
              snackbarSeverity={snackbarSeverity} // Severity level of the snackbar (e.g., success, error)
            />
          </div>
        </Container>
      ) : (
        // If showCreation is true, render AssetCreation component
        <div>
          <AssetCreation
            assetGroupId={assetGroupId} // Pass asset group ID to AssetCreation
            assetGroupName={assetGroupName} // Pass asset group name to AssetCreation
            allAssetGroups={groups} // Pass all asset groups to AssetCreation
          />
        </div>
      )}
    </>
  );
};

export default AssetMasterTest; // Export the AssetMasterTest component as the default export for this module
