import { faFilter } from "@fortawesome/free-solid-svg-icons"; // Importing FontAwesome icon for filter functionality
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Importing FontAwesomeIcon component to use FontAwesome icons
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch"; // Importing MUI icon for search functionality
import {
  AppBar, // MUI component for creating app bar
  BottomNavigation, // MUI component for bottom navigation bar
  BottomNavigationAction, // MUI component for bottom navigation actions
  Box, // MUI component for box layout
  Checkbox, // MUI component for checkbox input
  Chip, // MUI component for chips (small, clickable elements)
  Container, // MUI component for container layout
  Divider, // MUI component for adding dividers between elements
  Fab, // MUI component for floating action button
  ListItemText, // MUI component for displaying text inside list items
  OutlinedInput, // MUI component for input fields with outlined borders
  useMediaQuery, // MUI hook for media queries to detect screen sizes
  useTheme, // MUI hook to access the theme (for breakpoints, colors, etc.)
} from "@mui/material"; // Importing MUI components and hooks for UI functionality
import CircularProgress from "@mui/material/CircularProgress"; // Importing MUI component for displaying a circular loading indicator
import FormControl from "@mui/material/FormControl"; // MUI component for form control, wrapping inputs
import InputLabel from "@mui/material/InputLabel"; // MUI component for input labels
import MenuItem from "@mui/material/MenuItem"; // MUI component for select menu items
import Select from "@mui/material/Select"; // MUI component for select (dropdown) inputs
import { Button } from "primereact/button"; // Importing PrimeReact button component
import { Calendar } from "primereact/calendar"; // Importing PrimeReact calendar component
import { Sidebar } from "primereact/sidebar"; // Importing PrimeReact sidebar component
import React, { useEffect, useState } from "react"; // Importing React, useEffect, and useState hooks for component state and lifecycle
import { useLocation, useNavigate } from "react-router-dom"; // Importing hooks from React Router for navigation and location tracking
import { fetchAllotedPagesByUserId } from "../CommonAPI"; // Importing API function to fetch allotted pages by user ID
import AssetOrUserTableContainer from "./AssetOrUserTableContainer"; // Importing custom component to display asset or user data in a table
import { fetchLogbooksAndAssets } from "./DashboardAPI"; // Importing API function to fetch logbooks and assets data
import ManufacturingTablesContainer from "./ManufacturingTablesContainer"; // Importing custom component for manufacturing-related tables
import TimelineContainer from "./TimelineContainer"; // Importing custom component for displaying timeline data
import "./styles.css"; // Importing custom CSS styles for the dashboard
import { extendTokenExpiration } from "../helper/AuthService";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function Dashboard() {
  const [visible, setVisible] = useState(false); // State for controlling sidebar visibility
  // const [fromDate, setFromDate] = useState(new Date()); // State to store the selected "from" date
  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 365); // Subtract 365 days
    return date;
  });

  const [toDate, setToDate] = useState(new Date()); // State to store the selected "to" date
  const [groupBy, setGroupBy] = useState("Task"); // State to store the grouping option (default: "Task")
  const [logbooks, setLogbooks] = useState([]); // State to store fetched logbooks
  const [selectedLogbook, setSelectedLogbook] = useState([]); // State to store selected logbooks
  const [selectAllLogbook, setSelectAllLogbook] = useState(false); // State to control "select all" logbooks option
  const [assets, setAssets] = useState([]); // State to store fetched assets
  const [selectedAsset, setSelectedAsset] = useState([]); // State to store selected assets
  const [selectAllAsset, setSelectAllAsset] = useState(false); // State to control "select all" assets option
  const [taskOrTagData, setTaskOrTagData] = useState(null); // State to store task or tag data
  const [assetOrUserData, setAssetOrUserData] = useState(null); // State to store asset or user data

  const [originalTaskOrTagData, setOriginalTaskOrTagData] = useState(""); // State to store original task or tag data before modifications
  const [originalAssetOrUserData, setOriginalAssetOrUserData] = useState(""); // State to store original asset or user data before modifications

  const [loading, setLoading] = useState(false); // State to control loading indicator visibility
  const [cardData, setCardData] = useState(""); // State to store card data
  const [isTabularClick, setIsTebularClick] = useState(true); // State to control whether the tabular view is selected
  const [isCardClick, setIsCardClick] = useState(false); // State to control whether the card view is selected
  const [isTimelineClick, setIsTimelineClick] = useState(false); // State to control whether the timeline view is selected

  const [containerSize, setContainerSize] = useState("lg"); // State to set the container size (default: "large")
  const tenantId = localStorage.getItem("tenantId"); // Retrieve tenantId from session storage
  const currentPathName = useLocation().pathname; // Get the current path using the location hook
  const navigate = useNavigate(); // Hook for programmatic navigation
  // //console.log("tenantId : ", tenantId); // Log the tenant ID for debugging purposes (commented out)
  const theme = useTheme(); // Access the current theme
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if the current screen size is mobile using breakpoints from the theme

  useEffect(() => {
    fetchAllotedPages(); // Fetches allotted pages for the user to check access permissions
  }, []); // Dependency array is empty, so this effect runs only once on mount

  // Function to fetch the pages allotted to the user by their ID
  // If the user is not allowed to access the current page, they are redirected to the restricted page
  const fetchAllotedPages = async () => {
    await extendTokenExpiration(); //function to extend  the token expiration time

    const allotedPages = await fetchAllotedPagesByUserId(); // Fetch allotted pages from the API
    if (!allotedPages.includes(currentPathName)) navigate("/restricted"); // Redirect to restricted page if current path is not in the allotted pages
  };

  useEffect(() => {
    setLoading(true); // Show loading spinner while data is being fetched

    // Fetches logbooks, assets, and other related data based on the selected date range and grouping option
    fetchLogbooksAndAssets(fromDate, toDate, groupBy)
      .then(
        ([logbooksData, assetsData, tabularDataResponse, cardDataResponse]) => {
          // Handle the fetched logbooks data
          if (Array.isArray(logbooksData)) {
            setLogbooks(logbooksData); // Set the logbooks state with the fetched logbooks data
            setSelectAllLogbook(true); // Enable "select all" option for logbooks
            setSelectedLogbook(logbooksData); // Set selected logbooks to all fetched logbooks
            setCardData(cardDataResponse); // Set the card data response
          } else {
            console.error(
              "Logbooks data received is not an array:",
              logbooksData,
            ); // Log error if the logbooks data is not an array
          }

          // Handle the fetched assets data
          if (Array.isArray(assetsData)) {
            setAssets(assetsData); // Set the assets state with the fetched assets data
            setSelectAllAsset(true); // Enable "select all" option for assets
            setSelectedAsset(assetsData); // Set selected assets to all fetched assets
            setCardData(cardDataResponse); // Set the card data response
          } else {
            console.error("Assets data received is not an array:", assetsData); // Log error if the assets data is not an array
          }

          // Handle the data for grouping by task or tag
          if (groupBy === "Task" || groupBy === "Tag") {
            setTaskOrTagData(tabularDataResponse); // Set the task or tag data based on the tabular data response
            setOriginalTaskOrTagData(tabularDataResponse); // Store original task or tag data for reference
            setAssetOrUserData(); // Clear asset or user data when grouping by task or tag
            setAssetOrUserData([]); // Set asset or user data to an empty array to avoid undefined values
          }

          // Handle the data for grouping by user or asset
          if (groupBy === "User" || groupBy === "Asset") {
            setTaskOrTagData([]); // Clear task or tag data when grouping by user or asset
            setOriginalAssetOrUserData(tabularDataResponse); // Store original asset or user data for reference
            setOriginalTaskOrTagData(); // Clear original task or tag data when grouping by user or asset
            setAssetOrUserData(tabularDataResponse); // Set asset or user data based on the tabular data response
          }

          setLoading(false); // Hide loading spinner once data fetching is complete
          setVisible(false); // Close the sidebar after fetching data
        },
      )
      .catch((error) => {
        console.error("Error fetching data:", error); // Log any error that occurs during data fetching
        setLoading(false); // Hide loading spinner in case of an error
      });
  }, [fromDate, toDate, groupBy]); // Effect depends on fromDate, toDate, and groupBy, so it runs when any of these values change

  // Function to update table data based on the selected logbooks and assets
  const updateTableData = () => {
    console.log("Selected Logbooks: ", selectedLogbook); // Log the selected logbooks
    console.log("Selected Assets : ", selectedAsset); // Log the selected assets

    let finalTaskData = {}; // Initialize the final task data object
    let finalAssetData = {}; // Initialize the final asset data object

    // If both logbooks and assets are selected
    if (selectedLogbook.length > 0 && selectedAsset.length > 0) {
      // Check if the original task or tag data exists
      if (originalTaskOrTagData) {
        // Loop through each task in the original task or tag data
        for (const currentTask in originalTaskOrTagData) {
          if (originalTaskOrTagData.hasOwnProperty(currentTask)) {
            const currentJobList = originalTaskOrTagData[currentTask]; // Get the list of jobs for the current task
            //console.log("currentTask:", currentTask); // Log the current task
            //console.log("currentJobList:", currentJobList); // Log the current job list

            let updatedJobList = []; // Initialize the updated job list

            // Loop through each job in the current job list
            currentJobList?.forEach((currentjob) => {
              let currentJobActivityList = []; // Initialize the current job activity list

              //console.log("Current Job : ", currentjob); // Log the current job

              // Loop through each activity in the job's activity list
              currentjob?.actvityList?.forEach((currentActivity) => {
                // If the logbook of the current activity is selected
                if (selectedLogbook.includes(currentActivity.logbook)) {
                  const itemsArray = currentActivity.assetName
                    .split(",")
                    .map((item) => item.trim()); // Split the asset names into an array and trim whitespace

                  // Check if any asset in the current activity matches the selected assets
                  if (itemsArray.some((item) => selectedAsset.includes(item))) {
                    currentJobActivityList.push(currentActivity); // Add the current activity to the list if it matches
                  }
                }
              });

              // If there are any activities left in the list, update the job list
              if (currentJobActivityList.length === 0) {
                return;
              }
              const updatedJob = {
                ...currentjob,
                actvityList: currentJobActivityList, // Update the job with the filtered activity list
              };
              updatedJobList.push(updatedJob); // Add the updated job to the updated job list
            });

            // If there are any updated jobs, add them to the final task data
            if (updatedJobList.length > 0)
              finalTaskData = {
                ...finalTaskData,
                [currentTask]: updatedJobList,
              };
          }
        }
      }

      //console.log("Final Task : ", finalTaskData); // Log the final task data
      setTaskOrTagData(finalTaskData); // Update the task or tag data state with the final task data

      // Check if the original asset or user data exists
      if (originalAssetOrUserData) {
        // Loop through each task in the original asset or user data
        for (const currentTask in originalAssetOrUserData) {
          if (originalAssetOrUserData.hasOwnProperty(currentTask)) {
            const currentJobList = originalAssetOrUserData[currentTask]; // Get the list of jobs for the current task

            let updatedJobList = []; // Initialize the updated job list

            // Loop through each job in the current job list
            currentJobList?.forEach((currentjob) => {
              ////console.log("Current Job : ", currentjob); // Log the current job
              //console.log("currentjob.logbook : ", currentjob.logBook); // Log the logbook of the current job

              // If the logbook of the current job is selected
              if (selectedLogbook.includes(currentjob.logBook)) {
                const itemsArray = currentjob.assets
                  .split(",")
                  .map((item) => item.trim()); // Split the assets into an array and trim whitespace
                //console.log("Item array : ", itemsArray); // Log the item array

                // Check if any asset in the current job matches the selected assets
                if (itemsArray.some((item) => selectedAsset.includes(item))) {
                  updatedJobList.push(currentjob); // Add the job to the updated job list if it matches
                }
              }
            });

            //console.log("updatedJobList : ", updatedJobList); // Log the updated job list

            // If there are any updated jobs, add them to the final asset data
            if (updatedJobList.length > 0)
              finalAssetData = {
                ...finalAssetData,
                [currentTask]: updatedJobList,
              };
          }
        }
      }

      //console.log("Final Asset : ", finalAssetData); // Log the final asset data
      setAssetOrUserData(finalAssetData); // Update the asset or user data state with the final asset data
    }

    setVisible(false); // Hide the sidebar after updating the table data
  };

  // Function to handle "select all" checkbox change for logbooks
  const handleSelectAllLogbookChange = (event) => {
    setSelectAllLogbook(event.target.checked); // Set the "select all" state for logbooks
    setSelectedLogbook(event.target.checked ? logbooks : []); // If checked, select all logbooks; otherwise, deselect all
  };

  // Function to handle individual logbook selection change
  const handleSelectLogbookChange = (event) => {
    setSelectedLogbook(event.target.value); // Set the selected logbooks based on user input
    setSelectAllLogbook(false); // Disable "select all" when individual logbooks are selected
  };

  // Function to handle "select all" checkbox change for assets
  const handleSelectAllAssetChange = (event) => {
    setSelectAllAsset(event.target.checked); // Set the "select all" state for assets
    setSelectedAsset(event.target.checked ? assets : []); // If checked, select all assets; otherwise, deselect all
  };

  // Function to handle individual asset selection change
  const handleSelectAssetChange = (event) => {
    setSelectedAsset(event.target.value); // Set the selected assets based on user input
    setSelectAllAsset(false); // Disable "select all" when individual assets are selected
  };

  // Function to handle click event for the card view
  const handleCardClick = () => {
    setContainerSize("lg"); // Set the container size to large
    setIsCardClick(true); // Enable card view
    setIsTimelineClick(false); // Disable timeline view
    setIsTebularClick(false); // Disable tabular view
    setVisible(false); // Hide the sidebar
  };

  // Function to handle click event for the timeline view
  const handleTimelineClick = () => {
    setContainerSize("lg"); // Set the container size to large
    setIsCardClick(false); // Disable card view
    setIsTimelineClick(true); // Enable timeline view
    setIsTebularClick(false); // Disable tabular view
    setVisible(false); // Hide the sidebar
  };

  // Function to handle click event for the tabular view
  const handleTabularClick = () => {
    setContainerSize("lg"); // Set the container size to large
    setIsCardClick(false); // Disable card view
    setIsTimelineClick(false); // Disable timeline view
    setIsTebularClick(true); // Enable tabular view
    setVisible(false); // Hide the sidebar
  };

  // Function to handle form submission and update table data
  const handleSubmit = () => {
    updateTableData(); // Call the updateTableData function to process the data
  };

  // Render the main component
  return (
    <div className="card flex justify-content-center">
      {/* Sidebar component for filtering options */}
      <Sidebar
        visible={visible} // Control visibility of the sidebar
        onHide={() => setVisible(false)} // Hide sidebar on close
        position="right" // Position the sidebar on the right
      >
        <div>
          <div className="flex-auto" style={{ marginTop: "0.7rem" }}>
            {/* Date selection for the From Date */}
            <label htmlFor="fromDate" className="font-bold block mb-2">
              From Date
            </label>
            <Calendar
              id="fromDate"
              showButtonBar
              showIcon
              dateFormat="dd/mm/yy"
              value={fromDate} // Set the current value of fromDate
              onChange={(e) => {
                setFromDate(e.value); // Update fromDate state
                // Adjust toDate if it's earlier than the selected fromDate
                if (e.value > toDate) {
                  setToDate(e.value);
                }
              }}
              variant="outlined"
            />

            {/* Date selection for the To Date */}
            <label htmlFor="toDate" className="font-bold block mb-2">
              To Date
            </label>
            <Calendar
              dateFormat="dd/mm/yy"
              id="toDate"
              showButtonBar
              value={toDate} // Set the current value of toDate
              onChange={(e) => {
                setToDate(e.value); // Update toDate state
                // Adjust fromDate if it's later than the selected toDate
                if (e.value < fromDate) {
                  setFromDate(e.value);
                }
              }}
              showIcon
            />
          </div>

          {/* Divider for view selection */}
          <Divider sx={{ margin: "1rem 0rem" }}>
            <Chip label="View" size="small" />
          </Divider>

          {/* Buttons for selecting the view type */}
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Button
              severity={isCardClick ? "Primary" : "secondary"}
              style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}
              onClick={handleCardClick} // Call handleCardClick on button click
            >
              Card
            </Button>
            {false && (
              <Button
                severity={isTimelineClick ? "Primary" : "secondary"}
                style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}
                onClick={handleTimelineClick} // Call handleTimelineClick on button click
              >
                Timeline
              </Button>
            )}
            <Button
              severity={isTabularClick ? "Primary" : "secondary"}
              style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}
              onClick={handleTabularClick} // Call handleTabularClick on button click
            >
              Tabular
            </Button>
          </div>

          {/* Divider for additional filtering options */}
          <Divider sx={{ margin: "1rem 0rem" }}>
            <Chip label="Additional Filter" size="small" />
          </Divider>

          <div>
            <div className="p-field">
              {/* Group By selection dropdown */}
              <label htmlFor="group-by-dropdown" className="p-d-block">
                Group By
              </label>
              <span></span>
              <Dropdown
                filter
                id="group-by-dropdown"
                value={groupBy}
                options={["Task", "Tag", "User", "Asset"]}
                onChange={(e) => setGroupBy(e.value)} // Update state with selected value
                placeholder="Select a group"
                className="p-inputwrapper-sm w-full"
              />
            </div>
            <br />

            {/* Logbook selection dropdown */}
            {/* <div className="p-field">
              <label htmlFor="logbook-multiselect" className="p-d-block">
                Select Logbook
              </label>
              <MultiSelect
                id="logbook-multiselect"
                value={selectedLogbook}
                options={logbooks.map((logbook) => ({
                  label: logbook,
                  value: logbook,
                }))}
                onChange={(e) => setSelectedLogbook(e.value)} // Update selected logbooks
                placeholder="Select Logbook"
                display="chip" // Chips for selected items
                className="p-multiselect-sm w-full"
                // itemTemplate={(option) => (
                //   <div className="p-d-flex p-ai-center">
                //     <Checkbox
                //       checked={selectedLogbook.includes(option.value)} // Check for inclusion in selectedLogbook
                //       className="p-mr-2"
                //     />
                //     <span>{option.label}</span>
                //   </div>
                // )}
              ></MultiSelect>
            </div> */}

            {/* <FormControl fullWidth size="small">
              <InputLabel id="logbook-label">Select Logbook</InputLabel>
              <Select
                labelId="logbook-label"
                id="logbook-select"
                multiple
                value={selectedLogbook} // Set the selected logbooks
                onChange={handleSelectLogbookChange} // Call handler on change
                input={<OutlinedInput label="Select Logbook" />}
                renderValue={(selected) => {
                  const displayedValues = selected.slice(0, 2); // Limit displayed logbooks
                  return (
                    <>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {displayedValues.map((value, index) => (
                          <Chip key={value} label={value} />
                        ))}
                        {selected.length > 2 ? (
                          <Chip label={`+${selected.length - 2}`} />
                        ) : (
                          ""
                        )}
                      </Box>
                    </>
                  );
                }}
              >
                {/* Checkbox for selecting all logbooks */}
            {/* <MenuItem>
                  <Checkbox
                    checked={selectAllLogbook} // Check if all logbooks are selected
                    onChange={handleSelectAllLogbookChange} // Call handler on change
                  />
                  <ListItemText primary="Select All" />
                </MenuItem>

                {/* Logbook options */}
            {/* {logbooks.map((option) => (
                  <MenuItem key={option} value={option}>
                    <Checkbox checked={selectedLogbook.indexOf(option) > -1} />
                    <ListItemText primary={option} />
                  </MenuItem>
                ))} */}
            {/* </Select> */}
            {/* </FormControl>  */}
            <br />
            <br />
            {/* Asset selection dropdown */}
            {/* <FormControl fullWidth size="small">
              <InputLabel id="asset-label">Select Asset</InputLabel>
              <Select
                labelId="asset-label"
                id="asset-select"
                multiple
                value={selectedAsset} // Set the selected assets
                onChange={handleSelectAssetChange} // Call handler on change
                input={<OutlinedInput label="Select Asset" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {/* Checkbox for selecting all assets */}
            {/* <MenuItem>
                  <Checkbox
                    checked={selectAllAsset} // Check if all assets are selected
                    onChange={handleSelectAllAssetChange} // Call handler on change
                  />
                  <ListItemText primary="Select All" />
                </MenuItem>

                {/* Asset options */}
            {/* {assets.map((option) => (
                  <MenuItem key={option} value={option}>
                    <Checkbox checked={selectedAsset.indexOf(option) > -1} />
                    <ListItemText primary={option} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
            {/* <div className="p-field">
              <label htmlFor="asset-multiselect" className="p-d-block">
                Select Asset
              </label>
              <MultiSelect
                id="asset-multiselect"
                value={selectedAsset}
                options={assets.map((asset) => ({
                  label: asset,
                  value: asset,
                }))}
                onChange={(e) => setSelectedAsset(e.value)} // Update selected assets
                placeholder="Select Asset"
                display="chip" // Display selected assets as chips
                className="p-multiselect-sm w-full"
                // itemTemplate={(option) => (
                //   <div className="p-d-flex p-ai-center">
                //     <Checkbox
                //       checked={selectedAsset.includes(option.value)} // Check for inclusion in selectedAsset
                //       className="p-mr-2"
                //     />
                //     <span>{option.label}</span>
                //   </div>
                // )}
              >
                {/* <div className="p-multiselect-header">
          <Checkbox
            checked={selectedAsset.length === assets.length} // Check if all assets are selected
            onChange={(e) => handleSelectAllChange(e.checked)} // Handle Select All
            className="p-mr-2"
          />
          <label>Select All</label>
        </div> */}
            {/* </MultiSelect> */}
            {/* </div> */}
            <br />
            <br />
            {/* Submit button to apply filters */}
            {/* <Button
              size="small"
              label="Submit"
              style={{ padding: "0.5rem 0.7rem", fontSize: "0.8rem" }}
              icon={
                <FontAwesomeIcon
                  style={{ marginRight: "0.2rem" }}
                  icon={faFilter}
                />
              }
              onClick={handleSubmit} // Call handleSubmit on click
            /> */}
          </div>
        </div>
      </Sidebar>

      {/* Conditional rendering based on mobile view */}
      {isMobile || (
        <div>
          {/* Floating action button for search */}
          <Fab
            size="small"
            sx={{
              position: "fixed", // Position the button fixed
              left: "94%", // Position from the left
              top: "0.5%", // Position from the top
            }}
            onClick={() => {
              // Set sidebar visibility to true on click
              setVisible(true);
            }}
          >
            <i className="pi pi-search" style={{ color: "green" }} />{" "}
            {/* Search icon */}
          </Fab>
        </div>
      )}

      {/* Bottom navigation for mobile view */}
      {isMobile && (
        <AppBar
          position="fixed" // Fix the position at the bottom
          color="primary" // Primary color for the app bar
          sx={{ top: "auto", bottom: 0 }} // Position at the bottom
        >
          <BottomNavigation showLabels>
            {/* Navigation action for search */}
            <BottomNavigationAction
              label="Search" // Label for the navigation action
              onClick={() => {
                // Set sidebar visibility to true on click
                setVisible(true);
              }}
              icon={<ContentPasteSearchIcon />} // Icon for the navigation action
            />
          </BottomNavigation>
        </AppBar>
      )}

      <Container
        // Dynamically set the max width of the container based on containerSize state
        maxWidth={containerSize}
        sx={{ padding: "0 !important", margin: "25px 50px" }} // Custom margin and padding
      >
        {/* Conditionally render loading spinner if the loading state is true */}
        {loading ? (
          <div className="spinner-container">
            {/* Display CircularProgress component while data is loading */}
            <Spin
              size="large"
              indicator={<LoadingOutlined spin />}
              style={{ paddingLeft: "1rem" }}
            />
          </div>
        ) : (
          <>
            {/* Render tables if the tabular view is active (isTabularClick is true) */}
            {isTabularClick && (
              <>
                {/* Check if taskOrTagData exists and pass it to the ManufacturingTablesContainer */}
                {taskOrTagData && (
                  <div>
                    <ManufacturingTablesContainer
                      manufacturingData={taskOrTagData}
                      groupBy={groupBy} // Pass the selected groupBy option
                    />
                  </div>
                )}
                {/* Check if assetOrUserData exists and pass it to the ManufacturingTablesContainer */}
                {assetOrUserData && (
                  <div>
                    <ManufacturingTablesContainer
                      manufacturingData={assetOrUserData}
                      groupBy={groupBy} // Pass the selected groupBy option
                    />
                  </div>
                )}
              </>
            )}

            {/* Render timeline view if the timeline is active (isTimelineClick is true) */}
            {isTimelineClick && (
              <>
                {/* Check if taskOrTagData exists and pass it to the TimelineContainer */}
                {taskOrTagData && (
                  <div>
                    {/* <TimelineContainer
                      manufacturingData={taskOrTagData}
                      groupBy={groupBy} // Pass the selected groupBy option
                    /> */}
                    {/* <centre>
                      <h2>Under Progress</h2>
                    </centre> */}
                  </div>
                )}
                {/* Check if assetOrUserData exists and pass it to the TimelineContainer */}
                {assetOrUserData && (
                  <div>
                    {/* <TimelineContainer
                      manufacturingData={assetOrUserData}
                      groupBy={groupBy} // Pass the selected groupBy option
                    /> */}
                    {/* <centre>
                      <h2>Under Progress</h2>
                    </centre> */}
                  </div>
                )}
              </>
            )}

            {/* Render card view if the card view is active (isCardClick is true) */}
            {isCardClick && (
              <>
                {/* Check if cardData exists and pass it to the AssetOrUserTableContainer */}
                {cardData && (
                  <div>
                    <AssetOrUserTableContainer
                      jsonData={cardData}
                      groupType={groupBy} // Pass the selected groupType option
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Container>
    </div>
  );
}
