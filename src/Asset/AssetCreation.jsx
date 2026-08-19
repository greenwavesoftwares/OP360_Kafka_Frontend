// Import necessary libraries and components
import AddCircleIcon from "@mui/icons-material/AddCircle"; // Import icon for adding
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined"; // Import icon for canceling
import Box from "@mui/material/Box"; // Import Box component from Material UI
import dayjs from "dayjs"; // Import dayjs for date handling
import React, { useEffect, useRef, useState } from "react"; // Import React and hooks
import "./styles.css"; // Import custom styles
import DeleteIcon from "@mui/icons-material/Delete"; // Import delete icon
import HomeIcon from "@mui/icons-material/Home"; // Import home icon
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined"; // Import save icon
import CircularProgress from "@mui/material/CircularProgress"; // Import circular progress indicator
import Typography from "@mui/material/Typography"; // Import typography component
import { TreeItem } from "@mui/x-tree-view/TreeItem"; // Import TreeItem for tree view
import {
  Card, // MUI component for creating a card layout
  Checkbox, // MUI component for checkbox input
  Chip, // MUI component for displaying small blocks of information
  Container, // MUI component for a responsive fixed width container
  Divider, // MUI component for dividing content
  FormControl,
  Grid, // MUI component for grouping form elements
  IconButton, // MUI component for clickable icon buttons
  InputAdornment, // MUI component for adding adornments to inputs
  InputLabel, // MUI component for labeling input fields
  OutlinedInput, // MUI component for an outlined input field
  Stack, // MUI component for stacking elements in a vertical or horizontal direction
  Tooltip,
  useMediaQuery,
  useTheme, // MUI component for displaying informative tooltips
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"; // Icon for showing information
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import EditIcon from '@mui/icons-material/Edit';
import { Dialog } from "primereact/dialog"; // Import Dialog component from PrimeReact
import { Dropdown } from "primereact/dropdown"; // Import Dropdown component from PrimeReact
import CustomButton from "../components/shared/button/button.component"; // Import custom button component
import CustomDialog from "../components/shared/dialog/dialog.component"; // Import custom dialog component
import SnackbarComponent from "../components/shared/snackbar/customSnackbar"; // Import custom Snackbar component
import Textfield from "../components/shared/textfield/textfield.component"; // Import custom text field component
import CustomTreeView from "../components/shared/tree/tree.component"; // Import custom tree view component
import { MultiSelect } from "primereact/multiselect"; // Import MultiSelect component from PrimeReact
// import QRCode from "react-qr-code"; // Import QR code component
import { QRCodeSVG } from "qrcode.react";
import PeopleIcon from "@mui/icons-material/People";
import {
  CheckAssetGroupExists, // Import function to check if asset group exists
  deleteAnAssetGroup, // Import function to delete asset group
  getAllDepartments, // Import function to get all departments
  getAssetGroupTree, // Import function to get asset group tree
  getGroupByGroupId, // Import function to get group by group ID
  handlePostData, // Import function to handle post data
} from "../Logbook Asset/LogbookAssetApi"; // Import API functions from Logbook Asset API
import { getAllActiveFormInfo } from "../Logbook/LogbookApi"; // Import function to get all active form info
import { getAllGroupDetails } from "../UserModuleUpdated/UsermoduleApi"; // Import function to get all group details
import AssetMasterTest from "./AssetMasterTest"; // Import AssetMasterTest component
export default function AssetCreation({
  assetGroupId, // ID of the asset group
  assetGroupName, // Name of the asset group
  allAssetGroups, // List of all asset groups
}) {
  const [showCreation, setShowCreation] = useState(false); // State to control visibility of creation form
  const [loading, setLoading] = useState(false); // State to indicate loading status
  const [isAssetAssociated, setIsAssetAssociated] = useState(false); // State to check if asset is associated
  const [snackbarText, setSnackbarText] = useState("Data saved !"); // Snackbar message text
  const [snackbarSeverity, setsnackbarSeverity] = useState("success"); // Severity level for snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State to control snackbar visibility
  const [categoryError, setCategoryError] = useState(false); // State to indicate category errors
  const [isError, setIsError] = useState(false); // State to indicate general errors
  const [selectedNode, setSelectedNode] = useState(null); // State to store selected node
  const [childNodeName, setChildNodeName] = useState(""); // Name of the child node
  const [childNodeId, setChildNodeId] = useState(""); // ID of the child node
  const [rootNodeName, setRootNodeName] = useState(""); // Name of the root node
  const [data, setData] = useState(null); // State to store data
  const [make, setMake] = useState(""); // State to store the make of the asset
  const [model, setModel] = useState(""); // State to store the model of the asset
  const [capacity, setCapacity] = useState(0); // State to store capacity
  const [description, setDescription] = useState(""); // State to store asset description
  const [warrantyEndDate, setwarrantyEndDate] = useState(dayjs()); // State to store warranty end date
  const [supportEndDate, setSupportEndDate] = useState(dayjs()); // State to store support end date
  const [selectedImage, setSelectedImage] = useState(null); // State to store selected image
  const [postDataStatus, setPostDataStatus] = useState(null); // State to store status of posted data
  const [selectedImageBytes, setSelectedImageBytes] = useState(null); // State to store bytes of the selected image
  const [selectedCategory, setSelectedCategory] = useState(""); // State to store selected category
  const [showAddItemButton, setShowAddItemButton] = useState(false); // State to control visibility of add item button
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 }); // State to store position of button
  const [clickedNode, setClickedNode] = useState(null); // State to store the clicked node
  const [visible, setVisible] = useState(false); // State to control visibility of a dialog/modal
  const [isEditing, setIsEditing] = useState(false); // To track if the node is being edited
  const [isEditingMake, setIsEditingMake] = useState(false); // To track if the make is being edited
  const [isEditingModel, setIsEditingModel] = useState(false); // To track if the model is being edited
  const [isEditingSerialNo, setIsEditingSerialNo] = useState(false); // To track if the serial number is being edited
  const [isEditingCapacity, setIsEditingCapacity] = useState(false); // To track if the capacity is being edited
  const [isEditingLocation, setIsEditingLocation] = useState(false); // To track if the location is being edited
  const [isEditingGroups, setIsEditingGroups] = useState(false); // To track if groups are being edited
  const [isEditingLogbooks, setIsEditingLogbooks] = useState(false); // To track if logbooks are being edited
  const [isEditingDescription, setIsEditingDescription] = useState(false); // To track if the description is being edited
  const [isEditingWarrantyDate, setIsEditingWarrantyDate] = useState(false); // To track if the warranty date is being edited
  const [isEditingSupportDate, setIsEditingSupportDate] = useState(false); // To track if the support date is being edited
  const [isEditingImageFile, setIsEditingImageFile] = useState(false); // To track if the image file is being edited
  const [isEditingCatagory, setIsEditingCatagory] = useState(false); // To track if the category is being edited
  const [isEditingUnit, setIsEditingUnit] = useState(false); // To track if the unit is being edited
  const [isEditingDepertment, setIsEditingDepertment] = useState(false); // To track if the department is being edited
  const [plantDetails, setPlantDetails] = useState([]); // State to store plant details
  const [editedName, setEditedName] = useState(""); // State to store edited name
  const [editedMake, setEditedMake] = useState(""); // State to store edited make
  const [editedModel, setEditedModel] = useState(""); // State to store edited model
  const [editedCapacity, setEditedCapacity] = useState(0); // State to store edited capacity
  const [editedLocation, setEditedLocation] = useState(""); // State to store edited location
  const [editedDescription, setEditedDescription] = useState(""); // State to store edited description
  const [editedSerialNo, setEditedSerialNo] = useState(""); // State to store edited serial number
  const [editedGroups, setEditedGroups] = useState([]); // State to store edited groups
  const [editedLogbooks, setEditedLogbooks] = useState([]); // State to store edited logbooks
  const [editedWarrantyDate, setEditedWarrantyDate] = useState(dayjs()); // State to store edited warranty date
  const [editedSupportDate, setEditedSupportDate] = useState(dayjs()); // State to store edited support date
  const [editedImageBytes, setEditedImageBytes] = useState(null); // State to store edited image bytes
  const [editedImage, setEditedImage] = useState(null); // State to store edited image
  const [editedCategory, setEditedCategory] = useState(""); // State to store edited category
  const [editedUnit, setEditedUnit] = useState(""); // State to store edited unit
  const [editedDepertment, setEditedDepertment] = useState(""); // State to store edited department
  const [open, setOpen] = useState(false); // State to control visibility of a dialog/modal
  const [delOpen, setDelOpen] = useState(false); // State to control visibility of delete confirmation dialog
  const [departmentList, setDepartmentList] = useState([]); // State to store list of departments
  const [groupList, setGroupList] = useState([]); // State to store list of groups
  const [selectedGroups, setSelectedGroups] = useState([]); // State to store selected groups
  const [selectedLogbooks, setSelectedLogbooks] = useState([]); // State to store selected logbooks
  const [selectedLogbooksLocal, setSelectedLogbooksLocal] = useState(null); // State to store local logbooks
  const [logbookOptions, setLogbookOptions] = useState([]); // State to store options for logbooks
  const [selectedDept, setSelectedDept] = useState(""); // State to store selected department
  const [autogenId, setAutogenId] = useState(true); // State to indicate if ID should be auto-generated
  const [disabledText, setDisabledText] = useState(false); // State to disable text inputs
  const [selectedUnit, setSelectedUnit] = useState(""); // State to store selected unit
  const [location, setLocation] = useState(""); // State to store location
  const [serialno, setSerialNo] = useState(""); // State to store serial number
  const [loader, setLoader] = useState(true); // State to control loading indicator
  const debounceTimeout = useRef(null); // Ref to store debounce timeout
  const [isAssetNameMatched, setIsAssetNameMatched] = useState(false); // State to check if asset name matches
  const [logbookIdListMap, setLogbookIdListMap] = useState([]); // State to store mapping of logbook IDs
  const theme = useTheme(); // detect the theme
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // using theme to detect the screen resolution

  useEffect(() => {
    // Objective: Fetch the group list and department details, check if the asset group exists,
    // and set the corresponding state values based on the fetched data and assetGroupId.

    async function fetchGroupList() {
      // Fetch all group details asynchronously
      let getAllGrp = await getAllGroupDetails();

      // Map the retrieved group details to extract group names
      getAllGrp = getAllGrp.map((group) => group.groupName);
      console.log("FInal Grps : ", getAllGrp); // Log the final group names

      // Set the group list state with the fetched group names
      setGroupList(getAllGrp);

      // Fetch all departments asynchronously
      let getAllDepartment = await getAllDepartments();
      setDepartmentList(getAllDepartment); // Set the department list state with the fetched departments

      // Check if assetGroupId is not empty, undefined, or null
      console.log("My assetGroupId : ", assetGroupId);
      if (!assetGroupId) {
        return;
      }
      if (
        assetGroupId !== "" ||
        assetGroupId !== undefined ||
        assetGroupId !== null
      ) {
        console.log("assetGroupId ", assetGroupId); // Log the assetGroupId
        setLoader(true); // Set loading state to true
        const apiData = await getAssetGroupTree(assetGroupId); // Fetch asset group tree data
        console.log("APIDATA : ", apiData); // Log the API data

        if (apiData[0].id === null) {
          //   setsnackbarSeverity("error"); // Set snackbar severity to error
          // setSnackbarText("Please enter a Asset name !"); // Set snackbar message
          // setSnackbarOpen(true); // Open snackbar
          // setLoader(true);
          // setShowCreation(true);
          apiData[0].id = assetGroupId;
          apiData[0].assetName = assetGroupName;
          // return; // Exit if the first item's id is null
          setData(apiData[0]);
        }
        setData(apiData[0]); // Set the data state with the fetched API data
        setLoader(false); // Set loading state to false
        const result = await CheckAssetGroupExists(assetGroupName); // Check if the asset group exists
        // setIsAssetAssociated(result); // Set the asset association state
        setIsAssetAssociated(false);
      } else {
        setData(null); // Reset data state if assetGroupId is not valid
        setLoader(false); // Set loading state to false
      }
    }
    async function fetchLogBookList() {
      // Objective: Fetch all active form information for logbooks and update the logbookIdListMap state with the retrieved data.

      let data = await getAllActiveFormInfo(); // Fetch all active form information asynchronously
      setLogbookIdListMap(data); // Update the state with the fetched logbook data

      console.log("Logbook data : ", data); // Log the retrieved logbook data
    }
    fetchLogBookList();

    fetchGroupList(); // Invoke the function to fetch group list
    onAtuogenIdChange(); // Trigger the autogen ID change function
  }, []);
  useEffect(() => {
    // Objective: Update the node level in the data whenever the data changes,
    // ensuring that the tree structure reflects the correct hierarchy.

    console.log("useEffect called "); // Log when the effect is triggered
    console.log("Data => ", data); // Log the current data

    // Recursively update the nodeLevel in the data
    const updateNodeLevel = (node, level) => {
      node.node_level = level; // Set the current node's level
      if (Array.isArray(node.children)) {
        node.children.forEach((child) => updateNodeLevel(child, level + 1)); // Recursively update child nodes
      }
    };

    if (data) {
      updateNodeLevel(data, 0); // Update the levels starting from the root node
    }
  }, [data]); // Effect depends on data changes

  async function filterLogBookListForedited() {
    // Objective: Filter the logbook list based on edited groups and department criteria,
    // and update the state with valid logbooks and their corresponding options.

    setEditedLogbooks([]); // Clear the edited logbooks state
    const filteredLogbooks = await Promise.all(
      logbookIdListMap.map(async (logbook) => {
        const userGroups = logbook.userGroup
          ? logbook.userGroup.split(",").map((group) => group.trim()) // Split user groups by comma and trim whitespace
          : [];
        const isInEditedGroups = await Promise.all(
          userGroups.map(
            async (group) =>
              (editedGroups.length !== 0 && editedGroups !== null
                ? editedGroups
                : selectedNode?.groups !== null
                ? selectedNode?.groups
                : []
              ).includes(await getGroupByGroupId(group)) // Check if the group is included in the edited groups or selected node's groups
          )
        ).then((results) => results.some(Boolean)); // Determine if any group matches

        const isInEditedDepertment =
          logbook.department?.trim() ===
          (editedDepertment !== "" && editedDepertment !== null
            ? editedDepertment // Check if the department matches the edited department
            : selectedNode?.department !== null
            ? selectedNode?.department
            : "");

        return isInEditedGroups || isInEditedDepertment ? logbook : null; // Return the logbook if it matches either condition
      })
    );

    const validLogbooks = filteredLogbooks.filter(
      (logbook) => logbook !== null // Filter out null values from the results
    );

    console.log("Filter", validLogbooks); // Log the filtered logbooks

    const options = validLogbooks?.map((logbook) => ({
      label: logbook.formName, // Create options for each logbook with label and value
      value: logbook.formID,
    }));

    setEditedLogbooks(options?.map((option) => option.value)); // Update the edited logbooks state with the values
    const test = options?.map((option) => option.value); // Extract values for testing
    console.log("Test", test); // Log the test values

    if (test?.length !== 0) {
      setSelectedNode({ ...selectedNode, logbook: test }); // Update the selected node with the filtered logbooks
    }

    setLogbookOptions(options); // Update the logbook options state

    console.log("Filter Logbook:", validLogbooks); // Log the valid logbooks
  }

  function isAssetNamePresent(assetList, selectedAssetName) {
    // Objective: Check if the selected asset name exists in the asset list,
    // and update the state to reflect whether a match is found.

    const normalizedSelectedTaskName = selectedAssetName.trim().toLowerCase(); // Normalize the selected asset name for comparison
    for (let asset of assetList) {
      if (asset.groupName.trim().toLowerCase() === normalizedSelectedTaskName) {
        // Compare with each asset's group name
        setIsAssetNameMatched(true); // Set the state to true if a match is found
        return true; // Return true indicating a match
      }
    }
    setIsAssetNameMatched(false); // Set the state to false if no match is found
    return false; // Return false indicating no match
  }

  const handleChange = (e) => {
    // Objective: Handle the change event for the input field,
    // updating the root node name and triggering a check for asset name presence.

    const { value } = e.target; // Extract the input value from the event
    setRootNodeName(value); // Update the root node name state
    if (assetGroupId !== undefined || assetGroupId !== null) {
      // Check if assetGroupId is valid
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current); // Clear previous timeout if it exists
      }

      debounceTimeout.current = setTimeout(() => {
        isAssetNamePresent(allAssetGroups, value); // Check if the asset name is present after a delay
      }, 500); // Adjust the delay as needed
    }
  };

  const handleEdit = async (property) => {
    // Objective: Handle the edit operation for the specified field of the selected node,
    // updating relevant state variables to reflect the current values and trigger the editing mode.

    switch (property) {
      case "Name":
        setEditedName(selectedNode.assetName); // Set the edited name from the selected node
        setIsEditing(true); // Enable editing mode for the name
        break;
      case "Make":
        setEditedMake(selectedNode.make); // Set the edited make from the selected node
        setIsEditingMake(true); // Enable editing mode for the make
        break;
      case "Model":
        setEditedModel(selectedNode.model); // Set the edited model from the selected node
        setIsEditingModel(true); // Enable editing mode for the model
        break;
      case "SerialNo":
        setEditedSerialNo(selectedNode.serialno); // Set the edited serial number from the selected node
        setIsEditingSerialNo(true); // Enable editing mode for the serial number
        break;
      case "Capacity":
        setEditedCapacity(selectedNode.capacity); // Set the edited capacity from the selected node
        setIsEditingCapacity(true); // Enable editing mode for the capacity
        break;
      case "Location":
        setEditedLocation(selectedNode.location); // Set the edited location from the selected node
        setIsEditingLocation(true); // Enable editing mode for the location
        break;
      case "Description":
        setEditedDescription(selectedNode.description); // Set the edited description from the selected node
        setIsEditingDescription(true); // Enable editing mode for the description
        break;
      // Uncomment for warranty and support date editing
      // case "WarrantyDate":
      //   setEditedWarrantyDate(dayjs());
      //   setIsEditingWarrantyDate(true);
      //   break;
      // case "SupportDate":
      //   setEditedSupportDate(dayjs());
      //   setIsEditingSupportDate(true);
      //   break;
      case "ImageFile":
        setEditedImageBytes(selectedNode.image_file); // Set the edited image bytes from the selected node
        setIsEditingImageFile(true); // Enable editing mode for the image file
        break;
      case "Catagory":
        setEditedCategory(selectedNode.category); // Set the edited category from the selected node
        setIsEditingCatagory(true); // Enable editing mode for the category
        break;
      case "Unit":
        setEditedUnit(selectedNode.unit); // Set the edited unit from the selected node
        setIsEditingUnit(true); // Enable editing mode for the unit
        break;
      case "Department":
        // Uncomment to filter logbook list for editing
        // await filterLogBookListForEdit();

        setEditedDepertment(selectedNode.department); // Set the edited department from the selected node
        setIsEditingDepertment(true); // Enable editing mode for the department
        break;
      case "Groups":
        // Uncomment to filter user group list for editing
        // await filterUserGroupListForedited();
        console.log("DB Group : ", selectedNode?.groups); // Log the groups from the selected node
        setEditedGroups(selectedNode?.groups); // Set the edited groups from the selected node
        setIsEditingGroups(true); // Enable editing mode for the groups
        break;
      case "logbook":
        await filterLogBookListForedited(); // Fetch the logbook list for editing
        setEditedLogbooks(selectedNode.logbook); // Set the edited logbooks from the selected node
        setIsEditingLogbooks(true); // Enable editing mode for the logbooks
        break;
      default:
        break; // Do nothing for unrecognized properties
    }
  };

  const handleSaveName = async (property) => {
    // Objective: Save the edited asset name and other properties of the selected node.
    // Validate the input, update the state, and handle the post request to save the changes.

    let selNode = selectedNode; // Reference to the currently selected node
    let localData; // Variable to hold updated data

    // Check if edited name is empty when editing the "Name" property
    if (!editedName && property === "Name") {
      setsnackbarSeverity("error"); // Set snackbar severity to error
      setSnackbarText("Please enter a Asset name !"); // Set snackbar message
      setSnackbarOpen(true); // Open snackbar
      return; // Exit function if name is not provided
    }

    if (selectedNode) {
      // Create a deep copy of the current data
      const updatedData = JSON.parse(JSON.stringify(data));

      // Call function to find and edit the selected node
      findAndEditNode(
        property,
        updatedData,
        selectedNode.id,
        editedName,
        editedMake,
        editedModel,
        editedSerialNo,
        editedCapacity,
        editedLocation,
        editedDescription,
        editedWarrantyDate,
        editedSupportDate,
        editedImageBytes,
        editedCategory,
        editedUnit,
        editedDepertment,
        editedGroups,
        editedLogbooks
      );

      localData = updatedData; // Assign updated data to local variable

      // Make a POST request to save the updated data
      const success = await handlePostData([localData]);
      console.log("success ?", success); // Log the response from the post request

      if (success?.status === 200) {
        // Update state if the request was successful
        setData(updatedData); // Update data state with modified data
        handleCancelNameEdit(property); // Call function to cancel the editing mode
      }
    }
    console.log(selNode); // Log the selected node for debugging
  };

  const handleCancelNameEdit = (property) => {
    // Objective: Cancel the editing mode for the specified property
    // and update the corresponding editing state variables.

    console.log("cancel property= ", property); // Log the property being canceled
    switch (property) {
      case "Name":
        setIsEditing(false); // Stop editing for Name
        return;
      case "Make":
        setIsEditingMake(false); // Stop editing for Make
        return;
      case "Model":
        setIsEditingModel(false); // Stop editing for Model
        return;
      case "SerialNo":
        setIsEditingSerialNo(false); // Stop editing for Serial Number
        return;
      case "Capacity":
        setIsEditingCapacity(false); // Stop editing for Capacity
        return;
      case "Location":
        setIsEditingLocation(false); // Stop editing for Location
        return;
      case "Description":
        setIsEditingDescription(false); // Stop editing for Description
        return;
      case "WarrantyDate":
        setIsEditingWarrantyDate(false); // Stop editing for Warranty Date
        return;
      case "SupportDate":
        setIsEditingSupportDate(false); // Stop editing for Support Date
        return;
      case "ImageFile":
        setIsEditingImageFile(false); // Stop editing for Image File
        return;
      case "Catagory":
        setIsEditingCatagory(false); // Stop editing for Category
        return;
      case "Unit":
        setIsEditingUnit(false); // Stop editing for Unit
        return;
      case "Department":
        console.log("Singh : ", selectedLogbooksLocal.logbook); // Log current logbook state
        setIsEditingDepertment(false); // Stop editing for Department
        return;
      case "Groups":
        setIsEditingGroups(false); // Stop editing for Groups
        return;
      case "logbook":
        setIsEditingLogbooks(false); // Stop editing for Logbook
        return;
      default:
        break;
    }

    // Reset all editing states if no specific property matched
    setIsEditingMake(false);
    setIsEditingModel(false);
    setIsEditingCapacity(false);
    setIsEditingDescription(false);
    setIsEditingSupportDate(false);
    setIsEditingWarrantyDate(false);
    setIsEditingImageFile(false);
    setIsEditingCatagory(false);
    setIsEditingGroups(false);
    setIsEditingSerialNo(false);
    setIsEditingLocation(false);
    setIsEditingDepertment(false);
    setIsEditingLogbooks(false);
    setIsEditingUnit(false);
  };

  const findAndEditNode = (
    property,
    node,
    targetNodeId,
    editedValue,
    editedMake1,
    editedModel1,
    editedSerialNo1,
    editedCapacity1,
    editedLocation1,
    editedDescription1,
    editedWarrantyDate1,
    editedSupportDate1,
    editedImageBytes1,
    editedCategory1,
    editedUnit1,
    editedDepertment1,
    editedGroups1,
    editedLogbooks1
  ) => {
    // Objective: Recursively find the node with the specified ID and update its properties
    // based on the edited values provided for the given property.

    console.log("serial : ", editedSerialNo1); // Log the edited serial number for debugging
    if (node.id === targetNodeId) {
      switch (property) {
        case "Name":
          node.assetName = editedValue; // Update asset name
          setSelectedNode(node); // Set the selected node to the updated node
          break;
        case "Make":
          node.make = editedMake1; // Update make
          setSelectedNode(node); // Set the selected node to the updated node
          break;
        case "Model":
          node.model = editedModel1; // Update model
          setSelectedNode(node); // Set the selected node to the updated node
          break;
        case "SerialNo":
          node.serialno = editedSerialNo1; // Update serial number
          setSelectedNode(node); // Set the selected node to the updated node
          break;
        case "Capacity":
          node.capacity = editedCapacity1; // Update capacity
          setSelectedNode(node); // Set the selected node to the updated node
          break;
        case "Location":
          node.location = editedLocation1; // Update location
          setSelectedNode(node); // Set the selected node to the updated node
          break;
        case "Description":
          node.description = editedDescription1; // Update description
          setSelectedNode(node); // Set the selected node to the updated node
          break;
        case "ImageFile":
          node.image_file = Array.from(editedImageBytes1); // Update image file
          setSelectedNode(node); // Set the selected node to the updated node
          break;
        case "Catagory":
          node.category = editedCategory1; // Update category
          setSelectedNode(node); // Set the selected node to the updated node
          break;
        case "Unit":
          node.unit = editedUnit1; // Update unit
          setSelectedNode(node); // Set the selected node to the updated node
          break;
        case "Department":
          node.department = editedDepertment1; // Update department
          node.logbook = selectedNode.logbook; // Maintain logbook reference
          setSelectedNode(node); // Set the selected node to the updated node
          break;
        case "Groups":
          console.log("EDITED : ", editedGroups1); // Log edited groups for debugging
          node.groups = editedGroups1; // Update groups
          node.logbook = selectedNode.logbook; // Maintain logbook reference
          setSelectedNode(node); // Set the selected node to the updated node
          break;
        case "logbook":
          node.logbook = editedLogbooks1; // Update logbook
          setSelectedNode(node); // Set the selected node to the updated node
          break;
        default:
          break;
      }
    } else if (Array.isArray(node.children)) {
      // Recursively search through child nodes
      node.children.forEach((child) =>
        findAndEditNode(
          property,
          child,
          targetNodeId,
          editedValue,
          editedMake1,
          editedModel1,
          editedSerialNo1,
          editedCapacity1,
          editedLocation1,
          editedDescription1,
          editedWarrantyDate1,
          editedSupportDate1,
          editedImageBytes1,
          editedCategory1,
          editedUnit1,
          editedDepertment1,
          editedGroups1,
          editedLogbooks1
        )
      );
    }
  };

  const createInitialData = (rootName, level = 0) => {
    // Objective: Create and return a new data object representing a node
    // with a unique ID, asset name, node level, and an empty children array.

    return {
      id: `M${new Date()
        .toISOString()
        .replace(/[-:T.Z]/g, "")
        .slice(0, 19)}`, // Generate a unique ID based on the current date and time
      assetName: rootName, // Set the asset name to the provided root name
      node_level: level, // Set the node level to the specified level
      children: [], // Initialize an empty array for child nodes
    };
  };

  // const getAllNodeIds = (nodes) => {
  //   console.log("Traversing nodes...");
  //   console.log("Data structure:", nodes);

  //   const nodeIds = [];

  //   const traverse = (node) => {
  //     console.log("Node ID:", node.id);
  //     nodeIds.push(node.id);
  //     if (Array.isArray(node.children)) {
  //       node.children.forEach((child) => traverse(child));
  //     }
  //   };

  //   if (Array.isArray(nodes)) {
  //     nodes.forEach((node) => {
  //       console.log("Parent Node:", node);
  //       traverse(node);
  //     });
  //   } else {
  //     console.log("Parent Node:", nodes);
  //     traverse(nodes);
  //   }

  //   console.log("All node IDs:", nodeIds);
  //   return nodeIds;
  // };

  // console.log("Data:", data);

  const renderTree = (nodes) => (
    // Objective: Render a tree structure using the TreeItem component,
    // recursively rendering child nodes if they exist.
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={nodes.assetName}
      onClick={() => handleNodeClick(nodes)} // Handle left click on the node
      onContextMenu={(e) => handleContextMenu(e, nodes)} // Handle right-click context menu
    >
      {Array.isArray(nodes.children)
        ? nodes.children?.map((node) => renderTree(node)) // Recursively render child nodes
        : null}
    </TreeItem>
  );

  const handleNodeClick = (node) => {
    // Objective: Handle the left click event on a node,
    // logging the node's name and setting it as the selected node.
    console.log("left click ", node.assetName);
    console.log("SelNode : ", node);
    setSelectedNode(node); // Set the clicked node as the selected node
    setSelectedLogbooksLocal(node); // Set local state with the selected node
    setClickedNode(node); // Track the clicked node
    setShowAddItemButton(false); // Hide the add item button
  };

  const handleContextMenu = (event, node) => {
    // Objective: Handle the right-click context menu event on a node,
    // preventing the default menu from appearing and showing a custom menu.
    console.log("Right click ", node.assetName);

    event.preventDefault(); // Prevent the default context menu
    event.stopPropagation(); // Stop the event from propagating
    setSelectedNode(node); // Set the clicked node as the selected node
    setShowAddItemButton(true); // Show the add item button
    setButtonPosition({ x: event.clientX, y: event.clientY }); // Set the button position
  };

  const handleClickOutsideNode = () => {
    // Objective: Hide the add item button when clicking outside of a node.
    setShowAddItemButton(false); // Hide the add item button
  };

  const handleRootNodeCreate = () => {
    // Objective: Create a new root node with the specified name,
    // ensuring the name is not empty before setting the data.
    const rootName = rootNodeName.trim();
    if (rootName !== "") {
      setData(createInitialData(rootName)); // Create initial data for the root node
      setRootNodeName(""); // Clear the input for the root node name
    }
  };

  const handleChildNodeAdd = async () => {
    // Function to handle adding a child node under the selected parent node in the tree structure.

    if (childNodeId.trim() === "") {
      // Check if the 'childNodeId' is an empty string or only contains whitespace.
      // If true, set error messages and display a notification to the user that an Asset ID is required.
      setsnackbarSeverity("error"); // Set the severity of the snackbar (notification) to "error".
      setSnackbarText("Please enter a Asset ID !"); // Display a relevant error message in the snackbar.
      setSnackbarOpen(true); // Open the snackbar to show the error message.
      setCategoryError(true); // Set the category error flag to true, indicating a validation issue with the asset category.
      setIsError(true); // Set the global error flag to true, indicating a validation error occurred.
      return; // Exit the function early, preventing further execution.
    }

    if (childNodeName.trim() === "") {
      // Check if the 'childNodeName' is an empty string or only contains whitespace.
      // If true, set error messages and display a notification to the user that an Asset name is required.
      setsnackbarSeverity("error"); // Set the snackbar severity to "error".
      setSnackbarText("Please enter a Asset name !"); // Display an error message indicating the Asset name is required.
      setSnackbarOpen(true); // Open the snackbar to display the error message.
      setCategoryError(true); // Set the category error flag to true.
      setIsError(true); // Set the global error flag to true.
      return; // Exit the function early.
    }

    console.log("selectedImageBytes => ", selectedImageBytes);
    // Log the 'selectedImageBytes' to the console for debugging purposes.

    let img_file = null;
    // Initialize 'img_file' as null, which will hold the file representation of the selected image.

    if (selectedImageBytes != null) {
      // Check if 'selectedImageBytes' contains a valid value (i.e., it's not null).
      img_file = Array.from(selectedImageBytes);
      // If a file has been selected, convert the 'selectedImageBytes' into an array format that can be processed further.
    }

    if (childNodeName.trim() !== "" && selectedNode) {
      // Proceed if the 'childNodeName' is not empty and a 'selectedNode' is available in the tree.

      const parentNodeId =
        (selectedNode.id === selectedNode.id.charAt(0)) === "M"
          ? selectedNode.assetName
          : selectedNode.id;
      // Determine the parent node's ID. If the selected node's ID starts with "M", use the 'assetName' as the ID.
      // Otherwise, use the node's 'id' as the parent node's identifier.

      const newChildNodeId = childNodeId?.trim();
      // Trim the 'childNodeId' to remove any excess whitespace and assign it as the new child node ID.

      const selectedNodeIdParts = parentNodeId.split("/");
      // Split the 'parentNodeId' string using "/" as the delimiter. This divides the ID into parts for further comparison.

      const nodeNameAlreadyExists = selectedNodeIdParts.some(
        (part) => part.toLowerCase() === childNodeName.trim().toLowerCase()
      );
      // Check if any part of the parent node's ID matches the 'childNodeName' (case-insensitive).
      // This prevents duplicate node names within the same branch of the tree.

      if (nodeNameAlreadyExists) {
        // If a match is found (i.e., the node name already exists), display an error message.
        setsnackbarSeverity("error"); // Set the snackbar severity to "error".
        setSnackbarText("Asset name already exists in this branch");
        // Display a message indicating that the asset name is a duplicate within the current branch.
        setSnackbarOpen(true); // Open the snackbar to show the error message.
        setCategoryError(true); // Set the category error flag to true.
        setIsError(true); // Set the global error flag to true.
        return; // Exit the function early, preventing the new node from being added.
      }

      if (
        selectedNode.children.some(
          (child) =>
            child.assetName.toLowerCase() === childNodeName.trim().toLowerCase()
        )
      ) {
        // Check if the selected node's children contain a node with the same name (case-insensitive).
        // A parent node cannot have more than one child node with the same asset name.

        setsnackbarSeverity("error"); // Set the snackbar severity to "error".
        setSnackbarText(
          "A parent node cannot have more than one child Asset with the same name."
        );
        // Display a message informing the user that duplicate child names are not allowed.
        setSnackbarOpen(true); // Open the snackbar to show the error message.
        setCategoryError(true); // Set the category error flag to true.
        setIsError(true); // Set the global error flag to true.
        return; // Exit the function early, preventing the addition of the duplicate node.
      }

      // Construct the new child node object with all relevant properties, including metadata and relationships.
      const newChildNode = {
        id: newChildNodeId, // Assign the trimmed child node ID.
        assetName: childNodeName, // Assign the child node's name.
        node_level: selectedNode.node_level + 1, // Set the node level to one higher than the parent node's level.
        make, // Pass the 'make' property (likely pre-defined elsewhere in the code).
        model, // Pass the 'model' property.
        capacity, // Pass the 'capacity' property.
        description, // Pass the 'description' of the node.
        location, // Pass the 'location' information.
        unit: selectedUnit, // Assign the currently selected unit to the node.
        serialno, // Pass the 'serialno' (serial number) field.
        warranty_end_date: warrantyEndDate.format("YYYY-MM-DD"), // Format and assign the 'warranty_end_date' as a string.
        warranty_support_end_date: supportEndDate.format("YYYY-MM-DD"), // Format and assign the 'warranty_support_end_date' as a string.
        category: selectedCategory, // Assign the selected category for the asset.
        groups: selectedGroups, // Pass the array of selected groups.
        department: selectedDept, // Pass the selected department.
        logbook: selectedLogbooks, // Pass the array of selected logbooks.
        image_file: img_file, // Assign the image file (if available) to the node.
        children: [], // Initialize an empty array for potential child nodes.
      };

      let dataLocal;
      // Declare 'dataLocal', which will hold the updated tree structure after the child node is added.

      setData((prevData) => {
        const updatedData = JSON.parse(JSON.stringify(prevData));
        // Create a deep copy of the previous tree data to avoid mutating the original state.

        findAndAddChildNode(updatedData, selectedNode.id, newChildNode);
        // Find the selected node in the tree and add the new child node to its 'children' array.

        dataLocal = updatedData;
        // Assign the updated tree structure to 'dataLocal' for further use.

        return updatedData;
        // Update the component's state with the modified tree structure.
      });

      // After successfully updating the tree data locally, send the updated structure to the backend via an API call.
      const response = await handlePostData([dataLocal]);
      // Make an asynchronous request to post the updated tree data.

      if (response?.status === 200) {
        // If the response from the server is successful (HTTP 200 status code):
        setChildNodeName(""); // Clear the child node name input field.
        setMake(""); // Clear the 'make' field.
        setModel(""); // Clear the 'model' field.
        setCapacity(0); // Reset the capacity to 0.
        setwarrantyEndDate(dayjs()); // Reset the warranty end date to the current date.
        setSupportEndDate(dayjs()); // Reset the support end date to the current date.
        setSelectedImage(null); // Clear the selected image.
        setSelectedImageBytes(); // Clear the image byte data.
        setDescription(""); // Clear the description field.
        setChildNodeId(""); // Clear the child node ID field.
        setSelectedDept(""); // Clear the selected department.
        setSelectedGroups([]); // Reset the selected groups to an empty array.
        setSelectedUnit(""); // Clear the selected unit.
        setSerialNo(""); // Clear the serial number field.
        setLocation(""); // Clear the location field.
        setAutogenId(false); // Reset the 'AutogenId' flag to false.
        setVisible(false); // Hide the form or modal for adding child nodes.

        setsnackbarSeverity("success"); // Set the snackbar severity to "success" for a positive notification.
        setSnackbarText("Asset added Successfully");
        // Display a success message indicating that the asset was added successfully.
        setSnackbarOpen(true); // Open the snackbar to show the success message.
        setCategoryError(false); // Reset the category error flag.
      } else {
        // If the response from the server is not successful:
        setsnackbarSeverity("error"); // Set the snackbar severity to "error".
        setSnackbarText("Error !");
        // Display an error message indicating that an issue occurred during the asset addition.
        setSnackbarOpen(true); // Open the snackbar to show the error message.
      }
    }
  };

  const findAndAddChildNode = (node, targetNodeId, childNode) => {
    // Recursive function to search through a tree structure and add a new child node to the correct parent node.

    if (node.id === targetNodeId) {
      // Check if the current node's 'id' matches the 'targetNodeId' where the new child node should be added.
      // If the IDs match, we have found the correct parent node.

      node.children.push(childNode);
      // Add the new 'childNode' to the 'children' array of the current node (i.e., the target parent node).
    } else if (Array.isArray(node.children)) {
      // If the current node's 'children' property is an array, continue searching through the tree.
      // This check ensures the node has children to search through.

      node.children.forEach((child) =>
        findAndAddChildNode(child, targetNodeId, childNode)
      );
      // Use 'forEach' to loop through each child node in the 'children' array.
      // For each child, call 'findAndAddChildNode' recursively, passing the child as the new 'node'.
      // This allows the function to traverse deeper into the tree structure until it finds the target node.
    }
  };

  const handleDialogOpen = () => {
    // Function to open the delete confirmation dialog when the user intends to delete a node

    setDelOpen(true);
    // Set the state variable `delOpen` to `true`, which controls the visibility of the delete confirmation dialog.
    // This triggers the UI to display the dialog asking the user to confirm their delete action.
  };

  const handleDeleteNode = async () => {
    // Function triggered when the user confirms deletion of a node

    if (selectedNode && selectedNode.id.charAt(0) === "M") {
      // Check if the selected node is the root node by looking at the first character of the node ID ("M" for root).
      // If the node is a root node, special handling is needed since it may represent an entire asset group.

      if (selectedNode.children.length === 0) {
        // If the root node doesn't have any child nodes, proceed with clearing data as it's a simple delete.

        setsnackbarSeverity();
        // Sets the severity of the snackbar (notification) to default.

        setSnackbarText("Asset Deleted Successfully");
        // Displays a message in the snackbar to inform the user that the asset was deleted.

        setSnackbarOpen(true);
        // Opens the snackbar to show the message.

        setCategoryError(true);
        // Optionally used to indicate that there was a category-related error or to trigger some category-related handling.

        setData(null);
        // Clear all asset data since the root node (and thus the entire structure) is being deleted.

        setSelectedNode(null);
        // Clear the selected node, as there's nothing left to select.

        setDelOpen(false);
        // Close the delete confirmation dialog since the operation was completed.

        return;
        // Exit the function as the deletion is completed for this case.
      }

      // If the root node has children, handle deletion with an API call.
      const success = await deleteAnAssetGroup(selectedNode.id);
      // Call the `deleteAnAssetGroup` function to delete the asset group from the backend.

      console.log("delete status ", success.status);
      // Log the status of the delete operation for debugging.

      if (success === 200) {
        // If the backend confirms successful deletion, proceed with the following actions:

        setsnackbarSeverity();
        // Sets the severity of the snackbar (notification) to default.

        setSnackbarText("Asset Deleted Successfully");
        // Displays a success message in the snackbar.

        setSnackbarOpen(true);
        // Opens the snackbar to show the message.

        setCategoryError(true);
        // Optionally used for category-related handling.

        setData(null);
        // Clear all asset data since the root node (and thus the entire structure) is being deleted.

        setSelectedNode(null);
        // Clear the selected node.

        setDelOpen(false);
        // Close the delete confirmation dialog.
      } else {
        // If the delete operation failed (success is false):

        setsnackbarSeverity("error");
        // Set the severity of the snackbar to "error" to indicate a problem.

        setSnackbarText("Failed To Delete");
        // Show an error message in the snackbar.

        setCategoryError(true);
        // Optionally used to handle category-related errors.

        setSnackbarOpen(true);
        // Open the snackbar to show the error message.
      }
    } else if (selectedNode) {
      // If the selected node is not a root node:

      let localData;
      // Declare a local variable to hold the updated data after the node is deleted.

      const setDataPromise = new Promise((resolve, reject) => {
        // Create a new promise to ensure the data is updated before performing any further actions.

        setData((prevData) => {
          // Update the state data (tree structure) by creating a deep copy of the previous data.

          const updatedData = JSON.parse(JSON.stringify(prevData));
          // Create a deep copy of the previous data to avoid mutating the original state directly.

          findAndDeleteNode(updatedData, selectedNode.id);
          // Call the `findAndDeleteNode` function to recursively search and delete the selected node from the tree.

          localData = updatedData;
          // Store the updated tree structure in the local variable `localData`.

          resolve();
          // Resolve the promise to indicate the data has been successfully updated.

          return updatedData;
          // Return the updated tree data, which becomes the new state.
        });
      });

      setDataPromise.then(() => {
        // Once the promise resolves (i.e., data is updated), proceed with posting the updated data to the backend.

        handlePostData([localData]);
        // Call the `handlePostData` function to post the updated tree structure (after deletion) to the backend.
      });

      setSelectedNode(null);
      // Clear the selected node after deletion.

      setDelOpen(false);
      // Close the delete confirmation dialog.
    }
  };

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setSelectedImage(reader.result);

  //       const dataUrl = reader.result;
  //       const base64String = dataUrl.split(",")[1];
  //       const byteCharacters = atob(base64String);
  //       const byteNumbers = new Array(byteCharacters?.length);
  //       for (let i = 0; i < byteCharacters?.length; i++) {
  //         byteNumbers[i] = byteCharacters.charCodeAt(i);
  //       }
  //       const byteArray = new Uint8Array(byteNumbers);
  //       setSelectedImageBytes(byteArray);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // const handleEditImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setEditedImage(reader.result);

  //       const dataUrl = reader.result;
  //       const base64String = dataUrl.split(",")[1];
  //       const byteCharacters = atob(base64String);
  //       const byteNumbers = new Array(byteCharacters?.length);
  //       for (let i = 0; i < byteCharacters?.length; i++) {
  //         byteNumbers[i] = byteCharacters.charCodeAt(i);
  //       }
  //       const byteArray = new Uint8Array(byteNumbers);
  //       setEditedImageBytes(byteArray);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  // function arrayBufferToBase64(buffer) {
  //   let binary = "";
  //   const bytes = new Uint8Array(buffer);
  //   for (let i = 0; i < bytes.byteLength; i++) {
  //     binary += String.fromCharCode(bytes[i]);
  //   }
  //   return btoa(binary);
  // }

  const findAndDeleteNode = (node, targetNodeId) => {
    // Function to locate and delete a node by its 'targetNodeId' from a tree structure.

    if (node.children) {
      // Check if the current node has any children.

      node.children = node.children.filter(
        // Filter out any child nodes whose id matches the 'targetNodeId'.
        (child) => child.id !== targetNodeId
      );

      // If children are still present, recursively call the function to continue searching deeper in the tree.
      node.children.forEach((child) => findAndDeleteNode(child, targetNodeId));
    }
  };

  const handleClick = () => {
    // Function to handle a click event that triggers the visibility of the dialog and calls 'onAtuogenIdChange()'.

    setVisible(true);
    // Set the visibility state `visible` to true to show the UI component (likely a dialog).

    onAtuogenIdChange();
    // Call the function to handle the auto-generation of an ID when the component becomes visible.
  };

  const onAtuogenIdChange = (e) => {
    // Function to handle the auto-generation of an ID when a checkbox is checked or unchecked.

    const id = `A${new Date()
      .toISOString()
      .replace(/[-:T.Z]/g, "")
      .slice(0, 19)}`;
    // Create an auto-generated ID using the current timestamp, prefixed with 'A'.

    if (e?.target?.checked) {
      // If the checkbox is checked (true):

      setChildNodeId(id);
      // Set the child node's ID to the newly generated ID.

      setDisabledText(true);
      // Disable the text input field since the ID is being auto-generated.

      setAutogenId(e?.target?.checked);
      // Update the `autogenId` state to reflect that auto-generation is enabled (true).
    } else {
      // If the checkbox is unchecked (false):

      if (autogenId === true) {
        // If `autogenId` was previously true, ensure that a new ID is generated again.

        setChildNodeId(id);
        // Set the child node's ID to the newly generated ID.

        setDisabledText(true);
        // Keep the text input disabled.

        setAutogenId(true);
        // Ensure `autogenId` remains true.
      }

      setDisabledText(false);
      // Re-enable the text input field so the user can manually enter an ID.

      setChildNodeId("");
      // Clear the child node's ID since auto-generation is disabled.

      setAutogenId(e?.target?.checked);
      // Update the `autogenId` state to reflect that auto-generation is now disabled (false).
    }
  };

  // const QRcodeGenerator = ({ value, size = 100 }) => {
  //   // QRcodeGenerator is a functional component that generates a QR code based on a provided value.
  //   // The 'value' is the text or data you want to encode into the QR code.
  //   // The 'size' is an optional parameter that sets the size of the QR code (default is 100).
  //   console.log("Value : ", value);

  //   return (
  //     // The return statement renders the QRCode component that generates the actual QR code.

  //     // <QRCode
  //     //   title={1234}
  //     //   // The 'title' attribute is set to the 'value', which provides context or a description of the QR code.

  //     //   size={size}
  //     //   // The 'size' property defines the size of the QR code. It defaults to 100 but can be overridden by passing a custom value.

  //     //   style={{ height: "auto", maxWidth: "100%", width: "100%" }}
  //     //   // The 'style' ensures that the QR code will be responsive.
  //     //   // 'height: auto' allows the height to adjust automatically to preserve the aspect ratio.
  //     //   // 'maxWidth: 100%' ensures the QR code won't exceed the width of its container.
  //     //   // 'width: 100%' allows it to fill the width of its container for better scalability.

  //     //   value={String(1234)}
  //     //   // The 'value' property is the actual data or text that will be encoded in the QR code.

  //     //   viewBox={`0 0 256 256`}
  //     //   // The 'viewBox' is set to a 256x256 canvas, which is the default canvas size for many QR codes.

  //     //   errorCorrectLevel="H"
  //     // />
  //   );
  // };
  const QRcodeGenerator = ({ value, size = 100 }) => {
    console.log("Value : ", value);

    return (
      <div style={{ height: "10px", maxWidth: "100%", width: "100%" }}>
        <QRCodeSVG
          title={String(value)} // Use dynamic value passed as prop
          size={size}
          // style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={String(value)} // Ensure the value is a string
          // viewBox={`0 0 256 256`}
          // Set the error correction level and ensure typeNumber is handled correctly
          level="H" // Set error correction level to 'H' (highest)
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        />
        <br />
      </div>
    );
  };
  return (
    <>
      {/* The Fragment allows grouping multiple elements without adding extra nodes to the DOM. */}

      {!showCreation ? (
        // Conditional rendering based on the 'showCreation' state.
        // If 'showCreation' is false, render the following container.

        <Container maxWidth="lg" className="noPadding-sm">
          {/* The 'Container' component provides a responsive fixed width. 
              'maxWidth="lg"' sets the maximum width for larger screens.
              The 'className' 'noPadding-sm' applies additional styling for smaller devices. */}

          {loader && assetGroupId ? (
            // Conditional rendering for the loader based on 'loader' and 'assetGroupId' states.
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* A div centered using CSS transforms to display the loading indicator. */}
              <CircularProgress
              // 'CircularProgress' displays a circular loading spinner.
              // The 'mode' prop is commented out, implying default behavior.
              // Inline styles for additional customization can be added if needed.
              ></CircularProgress>
            </div>
          ) : (
            // If not loading, render the card containing asset group information.

            <Card
              sx={{
                boxShadow:
                  "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;",
                borderRadius: 3,
              }}
            >
              {/* The 'Card' component from Material-UI provides a flexible and customizable container. 
                  'sx' prop allows using the system for styling, where 'boxShadow: 2' adds shadow,
                  and 'borderRadius: 2' rounds the corners of the card. */}
              {/* Card Header */}
              <div
                style={{
                  display: isMobile ? "grid" : "flex",
                  alignItems: isMobile ? "" : "center",
                  justifyContent: "space-between",
                  padding: "0.5rem 0.8rem",
                  background: "#eeeeee",
                  justifyItems: isMobile ? "center" : "",
                  rowGap: isMobile ? "0.4rem" : "",
                  //background:"red"
                }}
              >
                {/* This div creates a flex container for aligning the child elements. */}

                <div
                  style={{
                    display: "contents",
                    //alignItems: "center",
                    //justifyContent: "space-between",
                  }}
                >
                  {/* Another flex container for the back button. */}
                  {/* Card Header */}
                  <div>
                    <Tooltip title="Back" placement="top">
                      {/* The 'Tooltip' component shows a message when the user hovers over the element. 
                        The 'title' prop specifies the tooltip text, 
                        and 'placement' determines where it appears relative to the target. */}

                      <Chip
                        color="info"
                        label={
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              columnGap: "0.3rem",
                            }}
                          >
                            {/* A nested div to display an icon and text in a row. */}
                            <HomeIcon fontSize="small" />
                            {/* 'HomeIcon' represents the icon component from Material-UI with a small size. */}

                            {assetGroupName === "" ||
                            assetGroupName === null ||
                            assetGroupName === undefined
                              ? "Create An Asset"
                              : assetGroupName}
                            {/* Conditional rendering to display either a default message or the actual asset group name. */}
                          </div>
                        }
                        onClick={() => {
                          // The 'onClick' event handler sets the 'showCreation' state to true when clicked.
                          setShowCreation(true);
                        }}
                      />
                    </Tooltip>
                  </div>
                  <div>
                    <div
                      style={{
                        display: "flex", // Flex layout for buttons
                        columnGap: "0.8rem", // Gap between buttons
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.8rem", // Font size for the text
                          fontWeight: "600", // Font weight for boldness
                          display: "grid", // Use grid layout for the text
                          justifyItems: "center", // Center items horizontally
                          alignItems: "center", // Center items vertically
                        }}
                      >
                        {selectedNode ? (
                          // Check if a node is selected
                          <div
                            style={{
                              display: "flex", // Flex layout for the chip
                              justifyItems: "center", // Center items horizontally
                              alignItems: "center", // Center items vertically
                            }}
                          >
                            <Chip
                              size="large" // Size of the chip
                              sx={{
                                fontSize: "0.8rem", // Font size for the chip text
                                fontWeight: "600", // Font weight for boldness
                                background: "#455a64",
                                color: "#ffffff",
                              }}
                              label={
                                selectedNode
                                  ? `Selected Asset: ${selectedNode.assetName}`
                                  : // Display selected asset name
                                    "Select an Asset" // Fallback message if no asset is selected
                              }
                            />
                          </div>
                        ) : (
                          <>Select an Asset</> // Message when no asset is selected
                        )}
                      </Typography>

                      <div
                        id="delete-selected-node" // ID for the delete button container
                        style={{ display: "flex" }}
                      >
                        {!isAssetAssociated && (
                          // Only show delete button if asset is not associated
                          <CustomButton
                            className="button noShadow" // Custom button styling
                            variant="contained" // Button variant
                            size={"small"} // Small size for the button
                            color="error" // Use error color for delete button
                            //onClick={handleDeleteNode} // Uncomment to attach delete handler
                            endIcon={<DeleteIcon />} // Icon to show at the end of the button
                            onClick={handleDialogOpen} // Function to open confirmation dialog
                            buttontext={"Delete Asset"} // Button text
                          ></CustomButton>
                        )}
                      </div>
                      <div
                        id="add-new-node" // ID for the add button container
                        style={{ display: "flex" }}
                      >
                        {!isAssetAssociated && (
                          // Only show add button if asset is not associated
                          <CustomButton
                            className="button" // Custom button styling
                            size={"small"} // Small size for the button
                            variant="contained" // Button variant
                            color="secondary" // Use secondary color for add button
                            //onClick={handleDeleteNode} // Uncomment to attach delete handler
                            onClick={handleClick} // Function to handle adding new item
                            endIcon={<AddCircleIcon />} // Icon to show at the end of the button
                            buttontext={"Add Item"} // Button text
                          ></CustomButton>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Divider />
              {/* The 'Divider' component visually separates content within the card. */}

              <div className="split-screen" onClick={handleClickOutsideNode}>
                {/* The outer div serves as a container for the split-screen layout.
      The 'onClick' event handler triggers 'handleClickOutsideNode' function when this area is clicked. */}

                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    flexDirection: isMobile ? "column" : "",
                  }}
                >
                  {/* This div uses flexbox to arrange its child elements horizontally and takes up the full width of its parent. */}

                  <div
                    className="left-panel"
                    style={{
                      width: isMobile ? "100%" : "45%",
                      height: "39rem",
                      position: "relative",
                    }}
                  >
                    {/* The left panel is designated for creating or displaying the device tree. */}

                    <div id="create-device-tree">
                      {/* The inner div acts as a container for the components related to creating the device tree. */}

                      {data === null && (
                        // Conditional rendering that checks if 'data' is null to display input fields for creating an asset group.
                        <>
                          <Textfield
                            className="textInput"
                            label="Enter Asset Group Name"
                            variant="outlined"
                            value={rootNodeName}
                            onChange={handleChange}
                            // Handles changes to the input field, updating 'rootNodeName' state.
                            style={{
                              marginTop: "0.6rem",
                              marginLeft: "2%",
                              width: isMobile ? "90%" : "360px",
                            }}
                            error={isAssetNameMatched}
                            helperText={
                              isAssetNameMatched
                                ? "Group Name Already Exist"
                                : ""
                            }
                            // Displays an error message if 'isAssetNameMatched' is true.
                          />
                          <br />
                          <CustomButton
                            style={{
                              marginLeft: "2%",
                              width: isMobile ? "90%" : "360px",
                              marginTop: "0.2rem",
                            }}
                            className="button"
                            disabled={isAssetNameMatched || rootNodeName === ""}
                            variant="contained"
                            color="primary"
                            onClick={handleRootNodeCreate}
                            buttontext={"Create Asset Group"}
                            // The button for creating the asset group, which is disabled if the name already exists or is empty.
                          ></CustomButton>
                          <br />
                          <br />
                        </>
                      )}

                      {data !== null && (
                        // Conditional rendering that checks if 'data' is not null to display the tree view.
                        <div className="treeViewContainer">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          ></div>
                          {/* This empty div could be a placeholder for additional elements like headers or controls. */}
                          {console.log("My tree data : ", data)}
                          <CustomTreeView
                            data={data}
                            renderTree={renderTree}
                            handleNodeClick={handleNodeClick}
                            handleContextMenu={handleContextMenu}
                            // The 'CustomTreeView' component displays the hierarchical tree structure using the provided data and handlers for interactions.
                          />
                          <br />
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`right-panel ${data === null ? "hidden" : ""}`}
                    style={{
                      width: isMobile ? "100%" : "55%",
                      height: "39rem",
                      position: "relative",
                      overflow: "auto",
                    }}
                  >
                    {/* The outer div represents the right panel of the layout. 
      It conditionally applies the "hidden" class if 'data' is null, 
      effectively hiding this panel when there’s no data to display. */}

                    {data !== null && selectedNode && (
                      // This conditional rendering ensures the contents within the block are displayed
                      // only if 'data' is not null and 'selectedNode' exists.
                      <>
                        <div>
                          <Dialog
                            header={
                              <>
                                <Typography>
                                  Create Asset for :{" "}
                                  <span
                                    style={{
                                      background: "#9e9e9e",
                                      color: "white",
                                      padding: "0.2rem 1rem",
                                      borderRadius: "1rem",
                                    }}
                                  >
                                    {selectedNode.assetName}
                                  </span>
                                </Typography>
                              </>
                            }
                            visible={visible}
                            maximizable
                            style={{ width: isMobile ? "90%" : "50vw" }}
                            onHide={() => setVisible(false)}
                          >
                            {/* The Dialog component serves as a modal pop-up for creating an asset. 
              It shows the name of the selected node in the header. 
              It is controlled by the 'visible' state and can be maximized. 
              The 'onHide' function closes the dialog when triggered. */}

                            <Divider sx={{ opacity: "0.8" }} />
                            <br />
                            <center>
                              <Box
                                sx={{
                                  minWidth: 10,
                                  maxWidth: 500,
                                }}
                              >
                                {childNodeId && (
                                  // Conditional rendering to display the QR code generator if 'childNodeId' exists.
                                  <div
                                    style={{ height: "100px", width: "100px" }}
                                  >
                                    <QRcodeGenerator value={childNodeId} />
                                    <br />
                                    {/* The QRcodeGenerator component is called with the value of 'childNodeId' 
                      to generate a QR code. */}
                                  </div>
                                )}
                                <br />
                                <br />
                                <div style={{ display: "flex" }}>
                                  <Textfield
                                    required
                                    className="textInput"
                                    label="Asset ID"
                                    variant="outlined"
                                    fullWidth
                                    disabled={disabledText}
                                    value={childNodeId}
                                    onChange={(e) =>
                                      setChildNodeId(e.target.value)
                                    }
                                    // The Textfield for entering the asset ID.
                                    // It is disabled based on 'disabledText' state.
                                  />
                                  <Checkbox
                                    title={"Auto Generated Id"}
                                    checked={autogenId}
                                    onChange={(e) => onAtuogenIdChange(e)}
                                    // Checkbox to toggle auto-generation of the asset ID.
                                  />
                                </div>

                                <br />

                                <Textfield
                                  required
                                  className="textInput"
                                  label="Asset Name"
                                  variant="outlined"
                                  fullWidth
                                  value={childNodeName}
                                  onChange={(e) =>
                                    setChildNodeName(e.target.value)
                                  }
                                  // Textfield for the asset name.
                                  // It updates the 'childNodeName' state.
                                />

                                <br />
                                <br />

                                <Textfield
                                  //required
                                  className="textInput"
                                  label="Make"
                                  variant="outlined"
                                  fullWidth
                                  value={make}
                                  onChange={(e) => setMake(e.target.value)}
                                  // Textfield for the asset make.
                                  // It updates the 'make' state.
                                />
                                <br />
                                <br />
                                <Textfield
                                  //required
                                  className="textInput"
                                  label="Model"
                                  variant="outlined"
                                  fullWidth
                                  value={model}
                                  onChange={(e) => setModel(e.target.value)}
                                  // Textfield for the asset model.
                                  // It updates the 'model' state.
                                />
                                <br />
                                <br />
                                <Textfield
                                  //required
                                  className="textInput"
                                  label="Serial No."
                                  variant="outlined"
                                  fullWidth
                                  value={serialno}
                                  onChange={(e) => setSerialNo(e.target.value)}
                                  // Textfield for the asset's serial number.
                                  // It updates the 'serialno' state.
                                />
                                <br />
                                <br />
                                <div
                                  className="Test1"
                                  style={{ display: "inline-flex" }}
                                >
                                  <MultiSelect
                                    value={selectedGroups}
                                    onChange={(e) => setSelectedGroups(e.value)}
                                    options={groupList}
                                    disabled={loading}
                                    display="chip"
                                    filter
                                    fullWidth
                                    placeholder="Select Groups"
                                    style={{
                                      width: isMobile ? "100%" : "31.5rem",
                                    }}
                                    // MultiSelect component for selecting groups associated with the asset.
                                    // It updates the 'selectedGroups' state and is disabled if 'loading' is true.
                                  />
                                  {!loading ? <></> : <CircularProgress />}
                                  {/* Displays a loading spinner if 'loading' is true. */}
                                </div>

                                <br />
                                <br />

                                <Dropdown
                                  value={selectedCategory}
                                  onChange={(e) => setSelectedCategory(e.value)}
                                  options={["Area", "Building", "Equipment"]}
                                  showClear
                                  filter
                                  variant="filled"
                                  placeholder="Select a Category"
                                  style={{
                                    width: isMobile ? "100%" : "31.5rem",
                                  }}
                                  // Dropdown for selecting the asset category.
                                  // It updates the 'selectedCategory' state.
                                />

                                <br />
                                <br />

                                <Dropdown
                                  value={selectedUnit}
                                  onChange={(e) => setSelectedUnit(e.value)}
                                  options={["KG", "Litre", "Pound", "Metre"]}
                                  showClear
                                  filter
                                  variant="filled"
                                  placeholder="Select a unit"
                                  style={{
                                    width: isMobile ? "100%" : "31.5rem",
                                  }}
                                  // Dropdown for selecting the unit of measurement for the asset.
                                  // It updates the 'selectedUnit' state.
                                />
                                <br />
                                <br />

                                <Textfield
                                  //required
                                  className="textInput"
                                  label="Capacity"
                                  variant="outlined"
                                  fullWidth
                                  type="number"
                                  value={capacity}
                                  onChange={(e) => setCapacity(e.target.value)}
                                  // Textfield for entering the asset's capacity.
                                  // It updates the 'capacity' state.
                                />
                                <br />
                                <br />
                                <Textfield
                                  //required
                                  className="textInput"
                                  label="Location"
                                  variant="outlined"
                                  fullWidth
                                  multiline
                                  maxRows={4}
                                  value={location}
                                  onChange={(e) => setLocation(e.target.value)}
                                  // Textfield for entering the asset's location.
                                  // It updates the 'location' state and allows multiline input.
                                />

                                <br />
                                <br />
                                <Textfield
                                  // required
                                  className="textInput"
                                  label="Description"
                                  variant="outlined"
                                  fullWidth
                                  multiline
                                  maxRows={4}
                                  value={description}
                                  onChange={(e) =>
                                    setDescription(e.target.value)
                                  }
                                  // Textfield for entering a description of the asset.
                                  // It updates the 'description' state and is not required.
                                />
                                <br />
                                <br />

                                <br />
                                <CustomButton
                                  className="button"
                                  variant="contained"
                                  color="primary"
                                  onClick={handleChildNodeAdd}
                                  buttontext={"Add Asset"}
                                  startIcon={<AddCircleIcon />}
                                  // CustomButton to trigger the addition of the asset.
                                  // It calls the 'handleChildNodeAdd' function and includes an icon.
                                />
                              </Box>
                              <br />
                            </center>
                          </Dialog>
                        </div>

                        {selectedNode && (
                          // Check if a node is selected and its ID does not start with "M"
                          <div
                            className="clicked-node"
                            style={{
                              width: "100%",
                              position: "absolute",
                              top: 0,
                            }}
                          >
                            {/* Container for the clicked node */}
                            <Card sx={{ boxShadow: 0 }}>
                              {/* Card component to display node details */}
                              <div>
                                {/* <Typography
                                  sx={{
                                    fontSize: "0.8rem", // Font size for the text
                                    fontWeight: "600", // Font weight for boldness
                                    display: "grid", // Use grid layout for the text
                                    justifyItems: "center", // Center items horizontally
                                    alignItems: "center", // Center items vertically
                                  }}
                                >
                                  {selectedNode ? (
                                    // Check if a node is selected
                                    <div
                                      style={{
                                        display: "flex", // Flex layout for the chip
                                        justifyItems: "center", // Center items horizontally
                                        alignItems: "center", // Center items vertically
                                      }}
                                    >
                                      <Chip
                                        size="large" // Size of the chip
                                        sx={{
                                          fontSize: "0.8rem", // Font size for the chip text
                                          fontWeight: "600", // Font weight for boldness
                                        }}
                                        label={
                                          selectedNode
                                            ? `Selected Asset: ${selectedNode.assetName}`
                                            : // Display selected asset name
                                              "Select an Asset" // Fallback message if no asset is selected
                                        }
                                      />
                                    </div>
                                  ) : (
                                    <>Select an Asset</> // Message when no asset is selected
                                  )}
                                </Typography> */}

                                {/* <div
                                  style={{
                                    display: "flex", // Flex layout for buttons
                                    columnGap: "0.5rem", // Gap between buttons
                                  }}
                                >
                                  <div
                                    id="delete-selected-node" // ID for the delete button container
                                    style={{ display: "flex" }}
                                  >
                                    {!isAssetAssociated && (
                                      // Only show delete button if asset is not associated
                                      <CustomButton
                                        className="button" // Custom button styling
                                        variant="contained" // Button variant
                                        size={"small"} // Small size for the button
                                        color="error" // Use error color for delete button
                                        //onClick={handleDeleteNode} // Uncomment to attach delete handler
                                        endIcon={<DeleteIcon />} // Icon to show at the end of the button
                                        onClick={handleDialogOpen} // Function to open confirmation dialog
                                        buttontext={"Delete Asset"} // Button text
                                      ></CustomButton>
                                    )}
                                  </div>
                                  <div
                                    id="add-new-node" // ID for the add button container
                                    style={{ display: "flex" }}
                                  >
                                    {!isAssetAssociated && (
                                      // Only show add button if asset is not associated
                                      <CustomButton
                                        className="button" // Custom button styling
                                        size={"small"} // Small size for the button
                                        variant="contained" // Button variant
                                        color="secondary" // Use secondary color for add button
                                        //onClick={handleDeleteNode} // Uncomment to attach delete handler
                                        onClick={handleClick} // Function to handle adding new item
                                        endIcon={<AddCircleIcon />} // Icon to show at the end of the button
                                        buttontext={"Add Item"} // Button text
                                      ></CustomButton>
                                    )}
                                  </div>
                                </div> */}
                              </div>

                              {/* Divider with slight opacity */}
                              <div
                                className="Card-Components" // CSS class for styling the card component
                                style={{
                                  padding: "0.6rem", // Padding around the card
                                  overflow: "auto", // Enable scrolling if content overflows
                                  //background:"blue"
                                }}
                              >
                                {selectedNode.id && (
                                  <>
                                    <div
                                      style={{
                                        display: "grid", // Use grid layout for centering items
                                        justifyItems: "center", // Center items horizontally in the grid
                                        alignItems: "center", // Center items vertically in the grid
                                        //background:"red",
                                        padding: "0.5rem",
                                        overflow: "auto",
                                      }}
                                    >
                                     
                                    
                                    </div>

                                    <div className="topHeader">
                                      <div
                                        className="rounded-2xl shadow-lg p-2 mb-3 border border-slate-200"
                                        style={{
                                          background: "#f5f5f7ed",
                                          borderRadius: "0.5rem",
                                        }}
                                      >
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                            <div
                                              style={{
                                                marginLeft: "0.6rem",
                                                marginTop: "1rem",
                                              }}
                                            >
                                              <div className="flex items-center space-x-3 mb-2">
                                                <div
                                                  className="p-2 rounded-lg"
                                                  style={{
                                                    borderRadius: "0.5rem",
                                                    display: "grid",
                                                    alignItems: "center",
                                                    justifyItems: "center",
                                                    background: "#dbeafe",
                                                  }}
                                                >
                                                  <i
                                                    className="pi pi-box"
                                                    style={{
                                                      color: "#2563eb",
                                                      fontSize: "1.8rem",
                                                    }}
                                                  ></i>
                                                </div>
                                                <div
                                                  style={{
                                                    marginLeft: "0.5rem",
                                                  }}
                                                >
                                                  <Typography
                                                    style={{
                                                      fontWeight: "bold",
                                                      marginBottom: "0px",
                                                      textAlign: "left",
                                                    }}
                                                  >
                                                    {selectedNode.id === "" ||
                                                    selectedNode.id ===
                                                      undefined ||
                                                    selectedNode.id === null
                                                      ? "NA"
                                                      : selectedNode.id}
                                                  </Typography>

                                                  <Typography
                                                    className="text-slate-500 text-sm"
                                                    sx={{
                                                      color: "#64748b",
                                                    }}
                                                  >
                                                    Asset Details
                                                  </Typography>
                                                </div>
                                              </div>
                                              <div
                                                style={{
                                                  //padding: "0.5rem 0.7rem",
                                                  //position: "absolute",
                                                  //bottom: 0,
                                                  //background:"red",
                                                  display: "flex",
                                                  //justifyContent: "flex-end",
                                                }}
                                              >
                                                {!isAssetAssociated && (
                                                  // Conditional rendering to display the asset group ID only if it exists.

                                                  <Chip
                                                    icon={<DriveFileRenameOutlineIcon sx={{}} />} // Icon for the Chip
                                                    size="small" // Set Chip size
                                                    label="Edit the selected asset" // Tooltip text
                                                    style={{
                                                      background: "none",

                                                      color: "#64748b",
                                                    }}
                                                  />
                                                )}
                                              </div>
                                            </div>
                                          </div>

                                          {/* QR Code */}
                                          <div
                                            className="bg-gradient-to-br from-slate-50 to-slate-100  rounded-xl"
                                            style={{
                                              border: "1px solid #e2e8f0",
                                              //border: 1px solid rgb(230 238 249);
                                              padding: "0.5rem 1rem",
                                              borderRadius: "0.5rem",
                                              background: "#f4f7fa",
                                              boxShadow: "1px 1px 2px #efdfdf"
                                            }}
                                          >
                                            <div className="rounded-lg shadow-sm">
                                              <div
                                                style={{
                                                  height: "70px", // Fixed height for QR code container
                                                  width: "70px", // Fixed width for QR code container
                                                }}
                                              >
                                                <QRcodeGenerator
                                                  value={selectedNode.id} // Pass the selected node's ID to the QR code generator
                                                />
                                              </div>
                                            </div>
                                            <Typography className="text-xs text-slate-600 text-center font-medium mt-1">
                                              Scan Asset
                                            </Typography>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                                <Grid
                                  container
                                  spacing={0}
                                  className="CarddGap"
                                >
                                  <Grid
                                    item
                                    xs={5}
                                    className="LableCard"
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <Typography
                                      style={{
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Name : {/* Label for the asset name */}
                                    </Typography>
                                  </Grid>

                                  <Grid
                                    item
                                    xs={7}
                                    // sx={{ display: "flex", background: "blue" }}
                                    className="LableCardRightSide"
                                  >
                                    <div>
                                      {isEditing && !isAssetAssociated ? (
                                        // Conditional rendering based on editing state and asset association
                                        <>
                                          <FormControl fullWidth>
                                            <InputLabel htmlFor="EditNodeName">
                                              Edit Name
                                            </InputLabel>
                                            <OutlinedInput
                                              autoFocus // Automatically focus on this input
                                              autoComplete="Edit Name" // Autocomplete behavior
                                              name="Edit Name" // Name for the input field
                                              required // Make this field required
                                              fullWidth // Full width of the parent container
                                              id="EditNodeName" // Unique ID for the input field
                                              label="Edit Name" // Label displayed for the input
                                              value={editedName} // Value controlled by state
                                              onChange={(e) =>
                                                setEditedName(e.target.value)
                                              } // Update state on input change
                                              endAdornment={
                                                <>
                                                  <Tooltip title="Save">
                                                    {" "}
                                                    {/* Tooltip for save button */}
                                                    <InputAdornment position="end">
                                                      <IconButton
                                                        onClick={() =>
                                                          handleSaveName("Name")
                                                        } // Save the edited name
                                                        edge="end"
                                                      >
                                                        <SaveOutlinedIcon color="success" />{" "}
                                                        {/* Icon for save action */}
                                                      </IconButton>
                                                    </InputAdornment>
                                                  </Tooltip>

                                                  <Tooltip title="Cancel">
                                                    {" "}
                                                    {/* Tooltip for cancel button */}
                                                    <InputAdornment position="end">
                                                      <IconButton
                                                        onClick={() =>
                                                          handleCancelNameEdit(
                                                            "Name"
                                                          )
                                                        } // Cancel editing the name
                                                        edge="end"
                                                      >
                                                        <CancelOutlinedIcon color="error" />{" "}
                                                        {/* Icon for cancel action */}
                                                      </IconButton>
                                                    </InputAdornment>
                                                  </Tooltip>
                                                </>
                                              }
                                            />
                                          </FormControl>
                                        </>
                                      ) : (
                                        // Render this section if not editing
                                        <>
                                          <div
                                            className="value-comp" // CSS class for value display component
                                            onClick={() => handleEdit("Name")} // Allow clicking to edit
                                          >
                                            {selectedNode.assetName === "" // Display name or fallback to "NA"
                                              ? "NA"
                                              : selectedNode.assetName}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </Grid>
                                </Grid>
                                <Grid
                                  container
                                  spacing={0}
                                  className="CarddGap"
                                >
                                  <Grid
                                    item
                                    xs={5}
                                    className="LableCard"
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <Typography
                                      style={{
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Make : {/* Label for the asset name */}
                                    </Typography>
                                  </Grid>

                                  <Grid
                                    item
                                    xs={7}
                                    // sx={{ display: "flex", background: "blue" }}
                                    className="LableCardRightSide"
                                  >
                                    <div>
                                      {isEditingMake && !isAssetAssociated ? (
                                        // Conditional rendering based on editing state and asset association
                                        <>
                                          <FormControl fullWidth>
                                            <InputLabel htmlFor="EditNodeMake">
                                              Edit Make
                                            </InputLabel>{" "}
                                            {/* Label for the input field */}
                                            <OutlinedInput
                                              autoFocus // Automatically focus on this input when rendered
                                              autoComplete="Edit Make" // Autocomplete behavior
                                              name="Edit Make" // Name attribute for the input field
                                              required // Make this field required
                                              fullWidth // Input takes full width of its container
                                              id="EditNodeMake" // Unique ID for the input field
                                              label="Edit Make" // Label displayed for the input
                                              value={editedMake} // Controlled value from state
                                              onChange={(e) =>
                                                setEditedMake(e.target.value)
                                              } // Update state on input change
                                              endAdornment={
                                                <>
                                                  <Tooltip title="Save">
                                                    {" "}
                                                    {/* Tooltip for save button */}
                                                    <InputAdornment position="end">
                                                      <IconButton
                                                        onClick={() =>
                                                          handleSaveName("Make")
                                                        } // Save the edited make
                                                        edge="end"
                                                      >
                                                        <SaveOutlinedIcon color="success" />{" "}
                                                        {/* Icon for save action */}
                                                      </IconButton>
                                                    </InputAdornment>
                                                  </Tooltip>

                                                  <Tooltip title="Cancel">
                                                    {" "}
                                                    {/* Tooltip for cancel button */}
                                                    <InputAdornment position="end">
                                                      <IconButton
                                                        onClick={() =>
                                                          handleCancelNameEdit(
                                                            "Make"
                                                          )
                                                        } // Cancel editing the make
                                                        edge="end"
                                                      >
                                                        <CancelOutlinedIcon color="error" />{" "}
                                                        {/* Icon for cancel action */}
                                                      </IconButton>
                                                    </InputAdornment>
                                                  </Tooltip>
                                                </>
                                              }
                                            />
                                          </FormControl>
                                        </>
                                      ) : (
                                        // Render this section if not in editing mode
                                        <>
                                          <div
                                            className="value-comp" // CSS class for value display component
                                            onClick={() => handleEdit("Make")} // Allow clicking to edit
                                          >
                                            {selectedNode.make === "" || // Check for empty, undefined, or null make value
                                            selectedNode.make === undefined ||
                                            selectedNode.make === null
                                              ? "NA" // Display "NA" if no make is available
                                              : selectedNode.make}{" "}
                                            {/* Otherwise, display the asset make  */}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </Grid>
                                </Grid>
                                <Grid
                                  container
                                  spacing={0}
                                  className="CarddGap"
                                >
                                  <Grid
                                    item
                                    xs={5}
                                    className="LableCard"
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <Typography
                                      style={{
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Model : {/* Label for the asset name */}
                                    </Typography>
                                  </Grid>

                                  <Grid
                                    item
                                    xs={7}
                                    // sx={{ display: "flex", background: "blue" }}
                                    className="LableCardRightSide"
                                  >
                                    <div>
                                      {isEditingModel && !isAssetAssociated ? (
                                        // Check if in editing mode and asset is not associated
                                        <>
                                          <FormControl fullWidth>
                                            <InputLabel htmlFor="EditNodeModel">
                                              Edit Model
                                            </InputLabel>{" "}
                                            {/* Label for input field */}
                                            <OutlinedInput
                                              autoFocus // Automatically focus when rendered
                                              autoComplete="Edit Model" // Autocomplete behavior
                                              name="Edit Model" // Name for input field
                                              required // Field is required
                                              fullWidth // Input takes full width
                                              id="EditNodeModel" // Unique ID for the input
                                              label="Edit Model" // Label displayed for the input
                                              value={editedModel} // Controlled value from state
                                              onChange={(e) =>
                                                setEditedModel(e.target.value)
                                              } // Update state on input change
                                              endAdornment={
                                                <>
                                                  <Tooltip title="Save">
                                                    {" "}
                                                    {/* Tooltip for save button */}
                                                    <InputAdornment position="end">
                                                      <IconButton
                                                        onClick={() =>
                                                          handleSaveName(
                                                            "Model"
                                                          )
                                                        } // Save the edited model
                                                        edge="end"
                                                      >
                                                        <SaveOutlinedIcon color="success" />{" "}
                                                        {/* Save icon */}
                                                      </IconButton>
                                                    </InputAdornment>
                                                  </Tooltip>

                                                  <Tooltip title="Cancel">
                                                    {" "}
                                                    {/* Tooltip for cancel button */}
                                                    <InputAdornment position="end">
                                                      <IconButton
                                                        onClick={() =>
                                                          handleCancelNameEdit(
                                                            "Model"
                                                          )
                                                        } // Cancel editing the model
                                                        edge="end"
                                                      >
                                                        <CancelOutlinedIcon color="error" />{" "}
                                                        {/* Cancel icon */}
                                                      </IconButton>
                                                    </InputAdornment>
                                                  </Tooltip>
                                                </>
                                              }
                                            />
                                          </FormControl>
                                        </>
                                      ) : (
                                        // Render this section if not in editing mode
                                        <>
                                          <div
                                            className="value-comp" // CSS class for displaying the model value
                                            onClick={() => handleEdit("Model")} // Click to edit
                                          >
                                            {selectedNode.model === "" || // Check for empty, undefined, or null model value
                                            selectedNode.model === undefined ||
                                            selectedNode.model === null
                                              ? "NA" // Display "NA" if no model is available
                                              : selectedNode.model}{" "}
                                            {/* Otherwise, display the asset model  */}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </Grid>
                                </Grid>
                                <Grid
                                  container
                                  spacing={0}
                                  className="CarddGap"
                                >
                                  <Grid
                                    item
                                    xs={5}
                                    className="LableCard"
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <Typography
                                      style={{
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Serial No :
                                    </Typography>
                                  </Grid>

                                  <Grid
                                    item
                                    xs={7}
                                    // sx={{ display: "flex", background: "blue" }}
                                    className="LableCardRightSide"
                                  >
                                    <div>
                                      {isEditingSerialNo &&
                                      !isAssetAssociated ? (
                                        // Check if in editing mode and asset is not associated
                                        <>
                                          <FormControl fullWidth>
                                            <InputLabel htmlFor="EditNodeSerialNo">
                                              Edit Serial No
                                            </InputLabel>{" "}
                                            {/* Label for input field */}
                                            <OutlinedInput
                                              autoFocus // Automatically focus when rendered
                                              autoComplete="Edit Serial No" // Autocomplete behavior
                                              name="Edit Serial No" // Name for input field
                                              required // Field is required
                                              fullWidth // Input takes full width
                                              id="EditNodeSerialNo" // Unique ID for the input
                                              label="Edit Serial No" // Label displayed for the input
                                              value={editedSerialNo} // Controlled value from state
                                              onChange={(e) =>
                                                setEditedSerialNo(
                                                  e.target.value
                                                )
                                              } // Update state on input change
                                              endAdornment={
                                                <>
                                                  <Tooltip title="Save">
                                                    {" "}
                                                    {/* Tooltip for save button */}
                                                    <InputAdornment position="end">
                                                      <IconButton
                                                        onClick={() =>
                                                          handleSaveName(
                                                            "SerialNo"
                                                          )
                                                        } // Save the edited serial number
                                                        edge="end"
                                                      >
                                                        <SaveOutlinedIcon color="success" />{" "}
                                                        {/* Save icon */}
                                                      </IconButton>
                                                    </InputAdornment>
                                                  </Tooltip>

                                                  <Tooltip title="Cancel">
                                                    {" "}
                                                    {/* Tooltip for cancel button */}
                                                    <InputAdornment position="end">
                                                      <IconButton
                                                        onClick={() =>
                                                          handleCancelNameEdit(
                                                            "SerialNo"
                                                          )
                                                        } // Cancel editing the serial number
                                                        edge="end"
                                                      >
                                                        <CancelOutlinedIcon color="error" />{" "}
                                                        {/* Cancel icon */}
                                                      </IconButton>
                                                    </InputAdornment>
                                                  </Tooltip>
                                                </>
                                              }
                                            />
                                          </FormControl>
                                        </>
                                      ) : (
                                        // Render this section if not in editing mode
                                        <>
                                          <div
                                            className="value-comp" // CSS class for displaying the serial number value
                                            onClick={() =>
                                              handleEdit("SerialNo")
                                            } // Click to edit
                                          >
                                            {selectedNode.serialno === "" || // Check for empty, undefined, or null serial number value
                                            selectedNode.serialno ===
                                              undefined ||
                                            selectedNode.serialno === null
                                              ? "NA" // Display "NA" if no serial number is available
                                              : selectedNode.serialno}{" "}
                                            {/* Otherwise, display the asset serial number  */}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </Grid>
                                </Grid>
                                <Grid
                                  container
                                  spacing={0}
                                  className="CarddGap"
                                >
                                  <Grid
                                    item
                                    xs={5}
                                    className="LableCard"
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <Typography
                                      style={{
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Category :
                                    </Typography>
                                  </Grid>

                                  <Grid
                                    item
                                    xs={7}
                                    // sx={{ display: "flex", background: "blue" }}
                                    className="LableCardRightSide"
                                  >
                                    <div>
                                      {isEditingCatagory &&
                                      !isAssetAssociated ? (
                                        // Check if in editing mode and asset is not associated
                                        <>
                                          <Dropdown
                                            value={editedCategory} // Controlled value from state
                                            onChange={(e) =>
                                              setEditedCategory(e.value)
                                            } // Update state on category change
                                            options={[
                                              "Area", // Option 1
                                              "Building", // Option 2
                                              "Equipment", // Option 3
                                            ]}
                                            showClear // Option to clear selection
                                            filter // Enable filtering of options
                                            variant="filled" // Style variant for the dropdown
                                            placeholder="Select a Category" // Placeholder text
                                            className="w-full md:w-14rem" // Width classes
                                          />

                                          <Tooltip title="Save">
                                            {" "}
                                            {/* Tooltip for save button */}
                                            <IconButton
                                              onClick={() =>
                                                handleSaveName("Catagory")
                                              } // Save the edited category
                                              edge="end"
                                            >
                                              <SaveOutlinedIcon color="success" />{" "}
                                              {/* Save icon */}
                                            </IconButton>
                                          </Tooltip>

                                          <Tooltip title="Cancel">
                                            {" "}
                                            {/* Tooltip for cancel button */}
                                            <IconButton
                                              onClick={() =>
                                                handleCancelNameEdit("Catagory")
                                              } // Cancel editing the category
                                              edge="end"
                                            >
                                              <CancelOutlinedIcon color="error" />{" "}
                                              {/* Cancel icon */}
                                            </IconButton>
                                          </Tooltip>
                                        </>
                                      ) : (
                                        // Render this section if not in editing mode
                                        <>
                                          <div
                                            className="value-comp" // CSS class for displaying the category value
                                            onClick={() =>
                                              handleEdit("Catagory")
                                            } // Click to edit
                                          >
                                            {selectedNode.category === "" || // Check for empty, undefined, or null category value
                                            selectedNode.category ===
                                              undefined ||
                                            selectedNode.category === null
                                              ? "NA" // Display "NA" if no category is available
                                              : selectedNode.category}{" "}
                                            {/* Otherwise, display the selected category  */}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </Grid>
                                </Grid>
                                <Grid
                                  container
                                  spacing={0}
                                  className="CarddGap"
                                >
                                  <Grid
                                    item
                                    xs={5}
                                    className="LableCard"
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <Typography
                                      style={{
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Groups :
                                    </Typography>
                                  </Grid>

                                  <Grid
                                    item
                                    xs={7}
                                    // sx={{ display: "flex", background: "blue" }}
                                    className="LableCardRightSide"
                                  >
                                    <div>
                                      {isEditingGroups && !isAssetAssociated ? (
                                        // Check if in editing mode and asset is not associated
                                        <>
                                          <MultiSelect
                                            value={editedGroups} // Controlled value from state
                                            onChange={(e) =>
                                              setEditedGroups(e.value)
                                            } // Update state on groups change
                                            options={groupList} // Options for the multi-select
                                            // optionLabel="name" // Uncomment to use 'name' property for labels (if needed)
                                            display="chip" // Display selected options as chips
                                            filter // Enable filtering of options
                                            placeholder="Select Groups" // Placeholder text
                                            className="w-full md:w-20rem" // Width classes
                                          />

                                          <Tooltip title="Save">
                                            {" "}
                                            {/* Tooltip for save button */}
                                            <IconButton
                                              onClick={() =>
                                                handleSaveName("Groups")
                                              } // Save the edited groups
                                              edge="end"
                                            >
                                              <SaveOutlinedIcon color="success" />{" "}
                                              {/* Save icon */}
                                            </IconButton>
                                          </Tooltip>

                                          <Tooltip title="Cancel">
                                            {" "}
                                            {/* Tooltip for cancel button */}
                                            <IconButton
                                              onClick={() =>
                                                handleCancelNameEdit("Groups")
                                              } // Cancel editing the groups
                                              edge="end"
                                            >
                                              <CancelOutlinedIcon color="error" />{" "}
                                              {/* Cancel icon */}
                                            </IconButton>
                                          </Tooltip>
                                        </>
                                      ) : (
                                        // Render this section if not in editing mode
                                        <>
                                          <div
                                            className="value-comp" // CSS class for displaying the groups value
                                            onClick={() => handleEdit("Groups")} // Click to edit
                                          >
                                            {selectedNode.groups?.length ===
                                            0 ? (
                                              "NA" // Display "NA" if no groups are available
                                            ) : (
                                              <div
                                                style={{
                                                  display: "flex", // Flex layout for chips
                                                  columnGap: "0.5rem", // Gap between chips
                                                  rowGap: "0.5rem", // Gap between rows of chips
                                                  flexWrap: "wrap", // Wrap chips to the next line if needed
                                                  flexDirection: "row", // Row direction
                                                }}
                                              >
                                                {selectedNode.groups?.map(
                                                  (option, index) => (
                                                    <Chip
                                                      avatar={<PeopleIcon />}
                                                      size="small" // Size of the chip
                                                      //color="success"
                                                      //variant="outlined"
                                                      key={index} // Unique key for each chip
                                                      label={option} // Display label for each group
                                                    />
                                                  )
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </Grid>
                                </Grid>
                                <Grid
                                  container
                                  spacing={0}
                                  className="CarddGap"
                                >
                                  <Grid
                                    item
                                    xs={5}
                                    className="LableCard"
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <Typography
                                      style={{
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Unit :
                                    </Typography>
                                  </Grid>

                                  <Grid
                                    item
                                    xs={7}
                                    // sx={{ display: "flex", background: "blue" }}
                                    className="LableCardRightSide"
                                  >
                                    <div>
                                      {/* Conditionally rendering the unit editing section */}
                                      {isEditingUnit && !isAssetAssociated ? (
                                        <>
                                          <Dropdown
                                            value={editedUnit} // Current selected unit
                                            onChange={(e) =>
                                              setEditedUnit(e.value)
                                            } // Update the selected unit on change
                                            options={[
                                              "KG",
                                              "Litre",
                                              "Pound",
                                              "Metre",
                                            ]} // Available unit options
                                            showClear
                                            filter
                                            variant="filled"
                                            placeholder="Select a unit"
                                            className="w-full md:w-14rem"
                                          />
                                          <Tooltip title="Save">
                                            <IconButton
                                              onClick={() =>
                                                handleSaveName("Unit")
                                              } // Save the edited unit
                                              edge="end"
                                            >
                                              <SaveOutlinedIcon color="success" />
                                            </IconButton>
                                          </Tooltip>

                                          <Tooltip title="Cancel">
                                            <IconButton
                                              onClick={() =>
                                                handleCancelNameEdit("Unit")
                                              } // Cancel the edit
                                              edge="end"
                                            >
                                              <CancelOutlinedIcon color="error" />
                                            </IconButton>
                                          </Tooltip>
                                        </>
                                      ) : (
                                        <>
                                          <div
                                            className="value-comp"
                                            onClick={() => handleEdit("Unit")} // Trigger edit on click
                                          >
                                            {selectedNode.unit === "" ||
                                            selectedNode.unit === undefined ||
                                            selectedNode.unit === null
                                              ? "NA" // Display "NA" if unit is not set
                                              : selectedNode.unit}{" "}
                                            {/*Display the current unit */}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </Grid>
                                </Grid>
                                <Grid
                                  container
                                  spacing={0}
                                  className="CarddGap"
                                >
                                  <Grid
                                    item
                                    xs={5}
                                    className="LableCard"
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <Typography
                                      style={{
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Capacity :
                                    </Typography>
                                  </Grid>

                                  <Grid
                                    item
                                    xs={7}
                                    // sx={{ display: "flex", background: "blue" }}
                                    className="LableCardRightSide"
                                  >
                                    <div>
                                      {/* Conditionally rendering the capacity editing section */}
                                      {isEditingCapacity &&
                                      !isAssetAssociated ? (
                                        <>
                                          <FormControl fullWidth>
                                            <InputLabel htmlFor="EditNodeName">
                                              Edit Capacity
                                            </InputLabel>
                                            <OutlinedInput
                                              autoFocus
                                              autoComplete="Edit Capacity"
                                              name="Edit Capacity"
                                              required
                                              type="number"
                                              fullWidth
                                              id="EditNodeName"
                                              label="Edit Capacity"
                                              value={editedCapacity} // Current capacity value
                                              onChange={(e) =>
                                                setEditedCapacity(
                                                  e.target.value
                                                )
                                              } // Update the capacity on change
                                              endAdornment={
                                                <>
                                                  <Tooltip title="Save">
                                                    <InputAdornment position="end">
                                                      <IconButton
                                                        onClick={() =>
                                                          handleSaveName(
                                                            "Capacity"
                                                          )
                                                        } // Save the edited capacity
                                                        edge="end"
                                                      >
                                                        <SaveOutlinedIcon color="success" />
                                                      </IconButton>
                                                    </InputAdornment>
                                                  </Tooltip>

                                                  <Tooltip title="Cancel">
                                                    <InputAdornment position="end">
                                                      <IconButton
                                                        onClick={() =>
                                                          handleCancelNameEdit(
                                                            "Capacity"
                                                          )
                                                        } // Cancel the edit
                                                        edge="end"
                                                      >
                                                        <CancelOutlinedIcon color="error" />
                                                      </IconButton>
                                                    </InputAdornment>
                                                  </Tooltip>
                                                </>
                                              }
                                            />
                                          </FormControl>
                                        </>
                                      ) : (
                                        <>
                                          <div
                                            className="value-comp"
                                            onClick={() =>
                                              handleEdit("Capacity")
                                            } // Trigger edit on click
                                          >
                                            {selectedNode.capacity ?? 0}{" "}
                                            {/*Display current capacity or 0 if not set*/}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </Grid>
                                </Grid>
                                <Grid
                                  container
                                  spacing={0}
                                  className="CarddGap"
                                >
                                  <Grid
                                    item
                                    xs={5}
                                    className="LableCard"
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <Typography
                                      style={{
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Location :
                                    </Typography>
                                  </Grid>

                                  <Grid
                                    item
                                    xs={7}
                                    // sx={{ display: "flex", background: "blue" }}
                                    className="LableCardRightSide"
                                  >
                                    <div>
                                      {/* Conditionally rendering the location editing section */}
                                      {isEditingLocation &&
                                      !isAssetAssociated ? (
                                        <>
                                          <FormControl fullWidth>
                                            <InputLabel htmlFor="EditNodeName">
                                              Edit Location
                                            </InputLabel>
                                            <OutlinedInput
                                              autoFocus
                                              autoComplete="Edit Location"
                                              name="Edit Location"
                                              required
                                              fullWidth
                                              id="EditNodeName"
                                              label="Edit Location"
                                              value={editedLocation} // Current location value
                                              onChange={(e) =>
                                                setEditedLocation(
                                                  e.target.value
                                                )
                                              } // Update the location on change
                                              endAdornment={
                                                <>
                                                  <Tooltip title="Save">
                                                    <InputAdornment position="end">
                                                      <IconButton
                                                        onClick={() =>
                                                          handleSaveName(
                                                            "Location"
                                                          )
                                                        } // Save the edited location
                                                        edge="end"
                                                      >
                                                        <SaveOutlinedIcon color="success" />
                                                      </IconButton>
                                                    </InputAdornment>
                                                  </Tooltip>

                                                  <Tooltip title="Cancel">
                                                    <InputAdornment position="end">
                                                      <IconButton
                                                        onClick={() =>
                                                          handleCancelNameEdit(
                                                            "Location"
                                                          )
                                                        } // Cancel the edit
                                                        edge="end"
                                                      >
                                                        <CancelOutlinedIcon color="error" />
                                                      </IconButton>
                                                    </InputAdornment>
                                                  </Tooltip>
                                                </>
                                              }
                                            />
                                          </FormControl>
                                        </>
                                      ) : (
                                        <>
                                          <div
                                            className="value-comp"
                                            onClick={() =>
                                              handleEdit("Location")
                                            } // Trigger edit on click
                                          >
                                            {selectedNode.location === ""
                                              ? "NA"
                                              : selectedNode.location}
                                            {/*Display "NA" if location is not set*/}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </Grid>
                                </Grid>

                                <Grid
                                  container
                                  spacing={0}
                                  className="CarddGap"
                                >
                                  <Grid
                                    item
                                    xs={5}
                                    className="LableCard"
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <Typography
                                      style={{
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Description :
                                    </Typography>
                                  </Grid>

                                  <Grid
                                    item
                                    xs={7}
                                    // sx={{ display: "flex", background: "blue" }}
                                    className="LableCardRightSide"
                                  >
                                    <div>
                                      {/* Conditionally rendering the description editing section */}
                                      {isEditingDescription &&
                                      !isAssetAssociated ? (
                                        <>
                                          <FormControl fullWidth>
                                            <InputLabel htmlFor="EditNodeName">
                                              Edit Description
                                            </InputLabel>
                                            <OutlinedInput
                                              autoFocus
                                              autoComplete="Edit Description"
                                              name="Edit Description"
                                              required
                                              fullWidth
                                              id="EditNodeName"
                                              label="Edit Description"
                                              value={editedDescription} // Current description value
                                              onChange={(e) =>
                                                setEditedDescription(
                                                  e.target.value
                                                )
                                              } // Update the description on change
                                              endAdornment={
                                                <>
                                                  <Tooltip title="Save">
                                                    <InputAdornment position="end">
                                                      <IconButton
                                                        onClick={() =>
                                                          handleSaveName(
                                                            "Description"
                                                          )
                                                        } // Save the edited description
                                                        edge="end"
                                                      >
                                                        <SaveOutlinedIcon color="success" />
                                                      </IconButton>
                                                    </InputAdornment>
                                                  </Tooltip>

                                                  <Tooltip title="Cancel">
                                                    <InputAdornment position="end">
                                                      <IconButton
                                                        onClick={() =>
                                                          handleCancelNameEdit(
                                                            "Description"
                                                          )
                                                        } // Cancel the edit
                                                        edge="end"
                                                      >
                                                        <CancelOutlinedIcon color="error" />
                                                      </IconButton>
                                                    </InputAdornment>
                                                  </Tooltip>
                                                </>
                                              }
                                            />
                                          </FormControl>
                                        </>
                                      ) : (
                                        <>
                                          <div
                                            className="value-comp"
                                            onClick={() =>
                                              handleEdit("Description")
                                            } // Trigger edit on click
                                          >
                                            {selectedNode.description === "" ||
                                            selectedNode.description ===
                                              undefined ||
                                            selectedNode.description === null
                                              ? "NA" // Display "NA" if description is not set
                                              : selectedNode.description}{" "}
                                            {/* Display the current description */}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </Grid>
                                </Grid>
                                <div
                                  className="selection-card" // CSS class for styling the selection card
                                  style={{
                                    display: "none", // Use grid layout for the card
                                    // marginLeft: "3rem", // Margin to the left of the card
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex", // Use flex layout for the inner container
                                      alignItems: "center", // Center items vertically
                                      columnGap: "1rem", // Gap between columns
                                      marginBottom: "15px", // Bottom margin for spacing
                                      background: "red",
                                    }}
                                  >
                                    <div style={{ marginBottom: "0px" }}>
                                      <Typography
                                        style={{
                                          fontWeight: "bold", // Bold text for the label
                                          marginBottom: "0px", // Remove bottom margin
                                          textAlign: "left", // Left-align the label
                                        }}
                                      >
                                        Name: {/* Label for the asset name */}
                                      </Typography>
                                    </div>

                                    <div>
                                      {isEditing && !isAssetAssociated ? (
                                        // Conditional rendering based on editing state and asset association
                                        <>
                                          <FormControl fullWidth>
                                            <InputLabel htmlFor="EditNodeName">
                                              Edit Name
                                            </InputLabel>
                                            <OutlinedInput
                                              autoFocus // Automatically focus on this input
                                              autoComplete="Edit Name" // Autocomplete behavior
                                              name="Edit Name" // Name for the input field
                                              required // Make this field required
                                              fullWidth // Full width of the parent container
                                              id="EditNodeName" // Unique ID for the input field
                                              label="Edit Name" // Label displayed for the input
                                              value={editedName} // Value controlled by state
                                              onChange={(e) =>
                                                setEditedName(e.target.value)
                                              } // Update state on input change
                                              endAdornment={
                                                <>
                                                  <Tooltip title="Save">
                                                    {" "}
                                                    {/* Tooltip for save button */}
                                                    <InputAdornment position="end">
                                                      <IconButton
                                                        onClick={() =>
                                                          handleSaveName("Name")
                                                        } // Save the edited name
                                                        edge="end"
                                                      >
                                                        <SaveOutlinedIcon color="success" />{" "}
                                                        {/* Icon for save action */}
                                                      </IconButton>
                                                    </InputAdornment>
                                                  </Tooltip>

                                                  <Tooltip title="Cancel">
                                                    {" "}
                                                    {/* Tooltip for cancel button */}
                                                    <InputAdornment position="end">
                                                      <IconButton
                                                        onClick={() =>
                                                          handleCancelNameEdit(
                                                            "Name"
                                                          )
                                                        } // Cancel editing the name
                                                        edge="end"
                                                      >
                                                        <CancelOutlinedIcon color="error" />{" "}
                                                        {/* Icon for cancel action */}
                                                      </IconButton>
                                                    </InputAdornment>
                                                  </Tooltip>
                                                </>
                                              }
                                            />
                                          </FormControl>
                                        </>
                                      ) : (
                                        // Render this section if not editing
                                        <>
                                          <div
                                            className="value-comp" // CSS class for value display component
                                            onClick={() => handleEdit("Name")} // Allow clicking to edit
                                          >
                                            {selectedNode.assetName === "" // Display name or fallback to "NA"
                                              ? "NA"
                                              : selectedNode.assetName}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      display: "flex", // Use flex layout for the container
                                      alignItems: "center", // Align items vertically in the center
                                      columnGap: "1rem", // Space between columns
                                      marginBottom: "15px", // Bottom margin for spacing
                                    }}
                                  >
                                    <div style={{ marginBottom: "0px" }}>
                                      <Typography
                                        style={{
                                          fontWeight: "bold", // Bold text for the label
                                          marginBottom: "0px", // Remove bottom margin
                                          textAlign: "left", // Left-align the label
                                        }}
                                      >
                                        Make: {/* Label for the asset make */}
                                      </Typography>
                                    </div>

                                    <div>
                                      {isEditingMake && !isAssetAssociated ? (
                                        // Conditional rendering based on editing state and asset association
                                        <>
                                          <FormControl fullWidth>
                                            <InputLabel htmlFor="EditNodeMake">
                                              Edit Make
                                            </InputLabel>{" "}
                                            {/* Label for the input field */}
                                            <OutlinedInput
                                              autoFocus // Automatically focus on this input when rendered
                                              autoComplete="Edit Make" // Autocomplete behavior
                                              name="Edit Make" // Name attribute for the input field
                                              required // Make this field required
                                              fullWidth // Input takes full width of its container
                                              id="EditNodeMake" // Unique ID for the input field
                                              label="Edit Make" // Label displayed for the input
                                              value={editedMake} // Controlled value from state
                                              onChange={(e) =>
                                                setEditedMake(e.target.value)
                                              } // Update state on input change
                                              endAdornment={
                                                <>
                                                  <Tooltip title="Save">
                                                    {" "}
                                                    {/* Tooltip for save button */}
                                                    <InputAdornment position="end">
                                                      <IconButton
                                                        onClick={() =>
                                                          handleSaveName("Make")
                                                        } // Save the edited make
                                                        edge="end"
                                                      >
                                                        <SaveOutlinedIcon color="success" />{" "}
                                                        {/* Icon for save action */}
                                                      </IconButton>
                                                    </InputAdornment>
                                                  </Tooltip>

                                                  <Tooltip title="Cancel">
                                                    {" "}
                                                    {/* Tooltip for cancel button */}
                                                    <InputAdornment position="end">
                                                      <IconButton
                                                        onClick={() =>
                                                          handleCancelNameEdit(
                                                            "Make"
                                                          )
                                                        } // Cancel editing the make
                                                        edge="end"
                                                      >
                                                        <CancelOutlinedIcon color="error" />{" "}
                                                        {/* Icon for cancel action */}
                                                      </IconButton>
                                                    </InputAdornment>
                                                  </Tooltip>
                                                </>
                                              }
                                            />
                                          </FormControl>
                                        </>
                                      ) : (
                                        // Render this section if not in editing mode
                                        <>
                                          <div
                                            className="value-comp" // CSS class for value display component
                                            onClick={() => handleEdit("Make")} // Allow clicking to edit
                                          >
                                            {selectedNode.make === "" || // Check for empty, undefined, or null make value
                                            selectedNode.make === undefined ||
                                            selectedNode.make === null
                                              ? "NA" // Display "NA" if no make is available
                                              : selectedNode.make}{" "}
                                            {/* Otherwise, display the asset make  */}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      display: "flex", // Use flex layout for alignment
                                      alignItems: "center", // Center items vertically
                                      columnGap: "1rem", // Space between label and input
                                      marginBottom: "15px", // Bottom margin for spacing
                                    }}
                                  >
                                    <div style={{ marginBottom: "0px" }}>
                                      <Typography
                                        style={{
                                          fontWeight: "bold", // Bold text for the label
                                          marginBottom: "0px", // Remove bottom margin
                                          textAlign: "left", // Left-align the label
                                        }}
                                      >
                                        Model: {/* Label for the model input */}
                                      </Typography>
                                    </div>
                                    <div>
                                      {isEditingModel && !isAssetAssociated ? (
                                        // Check if in editing mode and asset is not associated
                                        <>
                                          <FormControl fullWidth>
                                            <InputLabel htmlFor="EditNodeModel">
                                              Edit Model
                                            </InputLabel>{" "}
                                            {/* Label for input field */}
                                            <OutlinedInput
                                              autoFocus // Automatically focus when rendered
                                              autoComplete="Edit Model" // Autocomplete behavior
                                              name="Edit Model" // Name for input field
                                              required // Field is required
                                              fullWidth // Input takes full width
                                              id="EditNodeModel" // Unique ID for the input
                                              label="Edit Model" // Label displayed for the input
                                              value={editedModel} // Controlled value from state
                                              onChange={(e) =>
                                                setEditedModel(e.target.value)
                                              } // Update state on input change
                                              endAdornment={
                                                <>
                                                  <Tooltip title="Save">
                                                    {" "}
                                                    {/* Tooltip for save button */}
                                                    <InputAdornment position="end">
                                                      <IconButton
                                                        onClick={() =>
                                                          handleSaveName(
                                                            "Model"
                                                          )
                                                        } // Save the edited model
                                                        edge="end"
                                                      >
                                                        <SaveOutlinedIcon color="success" />{" "}
                                                        {/* Save icon */}
                                                      </IconButton>
                                                    </InputAdornment>
                                                  </Tooltip>

                                                  <Tooltip title="Cancel">
                                                    {" "}
                                                    {/* Tooltip for cancel button */}
                                                    <InputAdornment position="end">
                                                      <IconButton
                                                        onClick={() =>
                                                          handleCancelNameEdit(
                                                            "Model"
                                                          )
                                                        } // Cancel editing the model
                                                        edge="end"
                                                      >
                                                        <CancelOutlinedIcon color="error" />{" "}
                                                        {/* Cancel icon */}
                                                      </IconButton>
                                                    </InputAdornment>
                                                  </Tooltip>
                                                </>
                                              }
                                            />
                                          </FormControl>
                                        </>
                                      ) : (
                                        // Render this section if not in editing mode
                                        <>
                                          <div
                                            className="value-comp" // CSS class for displaying the model value
                                            onClick={() => handleEdit("Model")} // Click to edit
                                          >
                                            {selectedNode.model === "" || // Check for empty, undefined, or null model value
                                            selectedNode.model === undefined ||
                                            selectedNode.model === null
                                              ? "NA" // Display "NA" if no model is available
                                              : selectedNode.model}{" "}
                                            {/* Otherwise, display the asset model  */}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      display: "flex", // Use flex layout for alignment
                                      alignItems: "center", // Center items vertically
                                      columnGap: "1rem", // Space between label and input
                                      marginBottom: "15px", // Bottom margin for spacing
                                    }}
                                  >
                                    <div style={{ marginBottom: "0px" }}>
                                      <Typography
                                        style={{
                                          fontWeight: "bold", // Bold text for the label
                                          marginBottom: "0px", // Remove bottom margin
                                          textAlign: "left", // Left-align the label
                                        }}
                                      >
                                        Serial No:{" "}
                                        {/* Label for the serial number input */}
                                      </Typography>
                                    </div>
                                    <div>
                                      {isEditingSerialNo &&
                                      !isAssetAssociated ? (
                                        // Check if in editing mode and asset is not associated
                                        <>
                                          <FormControl fullWidth>
                                            <InputLabel htmlFor="EditNodeSerialNo">
                                              Edit Serial No
                                            </InputLabel>{" "}
                                            {/* Label for input field */}
                                            <OutlinedInput
                                              autoFocus // Automatically focus when rendered
                                              autoComplete="Edit Serial No" // Autocomplete behavior
                                              name="Edit Serial No" // Name for input field
                                              required // Field is required
                                              fullWidth // Input takes full width
                                              id="EditNodeSerialNo" // Unique ID for the input
                                              label="Edit Serial No" // Label displayed for the input
                                              value={editedSerialNo} // Controlled value from state
                                              onChange={(e) =>
                                                setEditedSerialNo(
                                                  e.target.value
                                                )
                                              } // Update state on input change
                                              endAdornment={
                                                <>
                                                  <Tooltip title="Save">
                                                    {" "}
                                                    {/* Tooltip for save button */}
                                                    <InputAdornment position="end">
                                                      <IconButton
                                                        onClick={() =>
                                                          handleSaveName(
                                                            "SerialNo"
                                                          )
                                                        } // Save the edited serial number
                                                        edge="end"
                                                      >
                                                        <SaveOutlinedIcon color="success" />{" "}
                                                        {/* Save icon */}
                                                      </IconButton>
                                                    </InputAdornment>
                                                  </Tooltip>

                                                  <Tooltip title="Cancel">
                                                    {" "}
                                                    {/* Tooltip for cancel button */}
                                                    <InputAdornment position="end">
                                                      <IconButton
                                                        onClick={() =>
                                                          handleCancelNameEdit(
                                                            "SerialNo"
                                                          )
                                                        } // Cancel editing the serial number
                                                        edge="end"
                                                      >
                                                        <CancelOutlinedIcon color="error" />{" "}
                                                        {/* Cancel icon */}
                                                      </IconButton>
                                                    </InputAdornment>
                                                  </Tooltip>
                                                </>
                                              }
                                            />
                                          </FormControl>
                                        </>
                                      ) : (
                                        // Render this section if not in editing mode
                                        <>
                                          <div
                                            className="value-comp" // CSS class for displaying the serial number value
                                            onClick={() =>
                                              handleEdit("SerialNo")
                                            } // Click to edit
                                          >
                                            {selectedNode.serialno === "" || // Check for empty, undefined, or null serial number value
                                            selectedNode.serialno ===
                                              undefined ||
                                            selectedNode.serialno === null
                                              ? "NA" // Display "NA" if no serial number is available
                                              : selectedNode.serialno}{" "}
                                            {/* Otherwise, display the asset serial number  */}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      display: "flex", // Use flex layout for alignment
                                      alignItems: "center", // Center items vertically
                                      columnGap: "1rem", // Space between label and input
                                      marginBottom: "15px", // Bottom margin for spacing
                                    }}
                                  >
                                    <div style={{ marginBottom: "0px" }}>
                                      <Typography
                                        style={{
                                          fontWeight: "bold", // Bold text for the label
                                          marginBottom: "0px", // Remove bottom margin
                                          textAlign: "left", // Left-align the label
                                        }}
                                      >
                                        Category:{" "}
                                        {/* Label for the category input */}
                                      </Typography>
                                    </div>
                                    <div>
                                      {isEditingCatagory &&
                                      !isAssetAssociated ? (
                                        // Check if in editing mode and asset is not associated
                                        <>
                                          <Dropdown
                                            value={editedCategory} // Controlled value from state
                                            onChange={(e) =>
                                              setEditedCategory(e.value)
                                            } // Update state on category change
                                            options={[
                                              "Area", // Option 1
                                              "Building", // Option 2
                                              "Equipment", // Option 3
                                            ]}
                                            showClear // Option to clear selection
                                            filter // Enable filtering of options
                                            variant="filled" // Style variant for the dropdown
                                            placeholder="Select a Category" // Placeholder text
                                            className="w-full md:w-14rem" // Width classes
                                          />

                                          <Tooltip title="Save">
                                            {" "}
                                            {/* Tooltip for save button */}
                                            <IconButton
                                              onClick={() =>
                                                handleSaveName("Catagory")
                                              } // Save the edited category
                                              edge="end"
                                            >
                                              <SaveOutlinedIcon color="success" />{" "}
                                              {/* Save icon */}
                                            </IconButton>
                                          </Tooltip>

                                          <Tooltip title="Cancel">
                                            {" "}
                                            {/* Tooltip for cancel button */}
                                            <IconButton
                                              onClick={() =>
                                                handleCancelNameEdit("Catagory")
                                              } // Cancel editing the category
                                              edge="end"
                                            >
                                              <CancelOutlinedIcon color="error" />{" "}
                                              {/* Cancel icon */}
                                            </IconButton>
                                          </Tooltip>
                                        </>
                                      ) : (
                                        // Render this section if not in editing mode
                                        <>
                                          <div
                                            className="value-comp" // CSS class for displaying the category value
                                            onClick={() =>
                                              handleEdit("Catagory")
                                            } // Click to edit
                                          >
                                            {selectedNode.category === "" || // Check for empty, undefined, or null category value
                                            selectedNode.category ===
                                              undefined ||
                                            selectedNode.category === null
                                              ? "NA" // Display "NA" if no category is available
                                              : selectedNode.category}{" "}
                                            {/* Otherwise, display the selected category  */}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      display: "flex", // Use flex layout for alignment
                                      alignItems: "center", // Center items vertically
                                      columnGap: "1rem", // Space between label and input
                                    }}
                                  >
                                    <div style={{ marginBottom: "0px" }}>
                                      <Typography
                                        style={{
                                          fontWeight: "bold", // Bold text for the label
                                          marginBottom: "0px", // Remove bottom margin
                                          textAlign: "left", // Left-align the label
                                        }}
                                      >
                                        Groups:{" "}
                                        {/* Label for the groups input */}
                                      </Typography>
                                    </div>
                                    <div>
                                      {isEditingGroups && !isAssetAssociated ? (
                                        // Check if in editing mode and asset is not associated
                                        <>
                                          <MultiSelect
                                            value={editedGroups} // Controlled value from state
                                            onChange={(e) =>
                                              setEditedGroups(e.value)
                                            } // Update state on groups change
                                            options={groupList} // Options for the multi-select
                                            // optionLabel="name" // Uncomment to use 'name' property for labels (if needed)
                                            display="chip" // Display selected options as chips
                                            filter // Enable filtering of options
                                            placeholder="Select Groups" // Placeholder text
                                            className="w-full md:w-20rem" // Width classes
                                          />

                                          <Tooltip title="Save">
                                            {" "}
                                            {/* Tooltip for save button */}
                                            <IconButton
                                              onClick={() =>
                                                handleSaveName("Groups")
                                              } // Save the edited groups
                                              edge="end"
                                            >
                                              <SaveOutlinedIcon color="success" />{" "}
                                              {/* Save icon */}
                                            </IconButton>
                                          </Tooltip>

                                          <Tooltip title="Cancel">
                                            {" "}
                                            {/* Tooltip for cancel button */}
                                            <IconButton
                                              onClick={() =>
                                                handleCancelNameEdit("Groups")
                                              } // Cancel editing the groups
                                              edge="end"
                                            >
                                              <CancelOutlinedIcon color="error" />{" "}
                                              {/* Cancel icon */}
                                            </IconButton>
                                          </Tooltip>
                                        </>
                                      ) : (
                                        // Render this section if not in editing mode
                                        <>
                                          <div
                                            className="value-comp" // CSS class for displaying the groups value
                                            onClick={() => handleEdit("Groups")} // Click to edit
                                          >
                                            {selectedNode.groups?.length ===
                                            0 ? (
                                              "NA" // Display "NA" if no groups are available
                                            ) : (
                                              <div
                                                style={{
                                                  display: "flex", // Flex layout for chips
                                                  columnGap: "0.5rem", // Gap between chips
                                                  rowGap: "0.5rem", // Gap between rows of chips
                                                  flexWrap: "wrap", // Wrap chips to the next line if needed
                                                  flexDirection: "row", // Row direction
                                                }}
                                              >
                                                {selectedNode.groups?.map(
                                                  (option, index) => (
                                                    <Chip
                                                      size="small" // Size of the chip
                                                      key={index} // Unique key for each chip
                                                      label={option} // Display label for each group
                                                    />
                                                  )
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      display: "flex", // Placeholder for additional content
                                      alignItems: "center", // Center items vertically
                                      columnGap: "1rem", // Space between elements
                                      marginBottom: "15px", // Bottom margin for spacing
                                    }}
                                  ></div>

                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      columnGap: "1rem",
                                      marginBottom: "15px",
                                    }}
                                  >
                                    <div style={{ marginBottom: "0px" }}>
                                      <Typography
                                        style={{
                                          fontWeight: "bold",
                                          marginBottom: "0px",
                                          textAlign: "left",
                                        }}
                                      >
                                        Unit:
                                      </Typography>
                                    </div>
                                    <div>
                                      {/* Conditionally rendering the unit editing section */}
                                      {isEditingUnit && !isAssetAssociated ? (
                                        <>
                                          <Dropdown
                                            value={editedUnit} // Current selected unit
                                            onChange={(e) =>
                                              setEditedUnit(e.value)
                                            } // Update the selected unit on change
                                            options={[
                                              "KG",
                                              "Litre",
                                              "Pound",
                                              "Metre",
                                            ]} // Available unit options
                                            showClear
                                            filter
                                            variant="filled"
                                            placeholder="Select a unit"
                                            className="w-full md:w-14rem"
                                          />
                                          <Tooltip title="Save">
                                            <IconButton
                                              onClick={() =>
                                                handleSaveName("Unit")
                                              } // Save the edited unit
                                              edge="end"
                                            >
                                              <SaveOutlinedIcon color="success" />
                                            </IconButton>
                                          </Tooltip>

                                          <Tooltip title="Cancel">
                                            <IconButton
                                              onClick={() =>
                                                handleCancelNameEdit("Unit")
                                              } // Cancel the edit
                                              edge="end"
                                            >
                                              <CancelOutlinedIcon color="error" />
                                            </IconButton>
                                          </Tooltip>
                                        </>
                                      ) : (
                                        <>
                                          <div
                                            className="value-comp"
                                            onClick={() => handleEdit("Unit")} // Trigger edit on click
                                          >
                                            {selectedNode.unit === "" ||
                                            selectedNode.unit === undefined ||
                                            selectedNode.unit === null
                                              ? "NA" // Display "NA" if unit is not set
                                              : selectedNode.unit}{" "}
                                            {/*Display the current unit */}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      columnGap: "1rem",
                                      marginBottom: "15px",
                                    }}
                                  >
                                    <div style={{ marginBottom: "0px" }}>
                                      <Typography
                                        style={{
                                          fontWeight: "bold",
                                          marginBottom: "0px",
                                          textAlign: "left",
                                        }}
                                      >
                                        Capacity:
                                      </Typography>
                                    </div>
                                    <div>
                                      {/* Conditionally rendering the capacity editing section */}
                                      {isEditingCapacity &&
                                      !isAssetAssociated ? (
                                        <>
                                          <FormControl fullWidth>
                                            <InputLabel htmlFor="EditNodeName">
                                              Edit Capacity
                                            </InputLabel>
                                            <OutlinedInput
                                              autoFocus
                                              autoComplete="Edit Capacity"
                                              name="Edit Capacity"
                                              required
                                              type="number"
                                              fullWidth
                                              id="EditNodeName"
                                              label="Edit Capacity"
                                              value={editedCapacity} // Current capacity value
                                              onChange={(e) =>
                                                setEditedCapacity(
                                                  e.target.value
                                                )
                                              } // Update the capacity on change
                                              endAdornment={
                                                <>
                                                  <Tooltip title="Save">
                                                    <InputAdornment position="end">
                                                      <IconButton
                                                        onClick={() =>
                                                          handleSaveName(
                                                            "Capacity"
                                                          )
                                                        } // Save the edited capacity
                                                        edge="end"
                                                      >
                                                        <SaveOutlinedIcon color="success" />
                                                      </IconButton>
                                                    </InputAdornment>
                                                  </Tooltip>

                                                  <Tooltip title="Cancel">
                                                    <InputAdornment position="end">
                                                      <IconButton
                                                        onClick={() =>
                                                          handleCancelNameEdit(
                                                            "Capacity"
                                                          )
                                                        } // Cancel the edit
                                                        edge="end"
                                                      >
                                                        <CancelOutlinedIcon color="error" />
                                                      </IconButton>
                                                    </InputAdornment>
                                                  </Tooltip>
                                                </>
                                              }
                                            />
                                          </FormControl>
                                        </>
                                      ) : (
                                        <>
                                          <div
                                            className="value-comp"
                                            onClick={() =>
                                              handleEdit("Capacity")
                                            } // Trigger edit on click
                                          >
                                            {selectedNode.capacity ?? 0}{" "}
                                            {/*Display current capacity or 0 if not set*/}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      columnGap: "1rem",
                                      marginBottom: "15px",
                                    }}
                                  >
                                    <div style={{ marginBottom: "0px" }}>
                                      <Typography
                                        style={{
                                          fontWeight: "bold",
                                          marginBottom: "0px",
                                          textAlign: "left",
                                        }}
                                      >
                                        Location:
                                      </Typography>
                                    </div>
                                    <div>
                                      {/* Conditionally rendering the location editing section */}
                                      {isEditingLocation &&
                                      !isAssetAssociated ? (
                                        <>
                                          <FormControl fullWidth>
                                            <InputLabel htmlFor="EditNodeName">
                                              Edit Location
                                            </InputLabel>
                                            <OutlinedInput
                                              autoFocus
                                              autoComplete="Edit Location"
                                              name="Edit Location"
                                              required
                                              fullWidth
                                              id="EditNodeName"
                                              label="Edit Location"
                                              value={editedLocation} // Current location value
                                              onChange={(e) =>
                                                setEditedLocation(
                                                  e.target.value
                                                )
                                              } // Update the location on change
                                              endAdornment={
                                                <>
                                                  <Tooltip title="Save">
                                                    <InputAdornment position="end">
                                                      <IconButton
                                                        onClick={() =>
                                                          handleSaveName(
                                                            "Location"
                                                          )
                                                        } // Save the edited location
                                                        edge="end"
                                                      >
                                                        <SaveOutlinedIcon color="success" />
                                                      </IconButton>
                                                    </InputAdornment>
                                                  </Tooltip>

                                                  <Tooltip title="Cancel">
                                                    <InputAdornment position="end">
                                                      <IconButton
                                                        onClick={() =>
                                                          handleCancelNameEdit(
                                                            "Location"
                                                          )
                                                        } // Cancel the edit
                                                        edge="end"
                                                      >
                                                        <CancelOutlinedIcon color="error" />
                                                      </IconButton>
                                                    </InputAdornment>
                                                  </Tooltip>
                                                </>
                                              }
                                            />
                                          </FormControl>
                                        </>
                                      ) : (
                                        <>
                                          <div
                                            className="value-comp"
                                            onClick={() =>
                                              handleEdit("Location")
                                            } // Trigger edit on click
                                          >
                                            {selectedNode.location === ""
                                              ? "NA"
                                              : selectedNode.location}
                                            {/*Display "NA" if location is not set*/}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      columnGap: "1rem",
                                      marginBottom: "15px",
                                    }}
                                  >
                                    <div style={{ marginBottom: "0px" }}>
                                      <Typography
                                        style={{
                                          fontWeight: "bold",
                                          marginBottom: "0px",
                                          textAlign: "left",
                                        }}
                                      >
                                        Description:
                                      </Typography>
                                    </div>

                                    <div>
                                      {/* Conditionally rendering the description editing section */}
                                      {isEditingDescription &&
                                      !isAssetAssociated ? (
                                        <>
                                          <FormControl fullWidth>
                                            <InputLabel htmlFor="EditNodeName">
                                              Edit Description
                                            </InputLabel>
                                            <OutlinedInput
                                              autoFocus
                                              autoComplete="Edit Description"
                                              name="Edit Description"
                                              required
                                              fullWidth
                                              id="EditNodeName"
                                              label="Edit Description"
                                              value={editedDescription} // Current description value
                                              onChange={(e) =>
                                                setEditedDescription(
                                                  e.target.value
                                                )
                                              } // Update the description on change
                                              endAdornment={
                                                <>
                                                  <Tooltip title="Save">
                                                    <InputAdornment position="end">
                                                      <IconButton
                                                        onClick={() =>
                                                          handleSaveName(
                                                            "Description"
                                                          )
                                                        } // Save the edited description
                                                        edge="end"
                                                      >
                                                        <SaveOutlinedIcon color="success" />
                                                      </IconButton>
                                                    </InputAdornment>
                                                  </Tooltip>

                                                  <Tooltip title="Cancel">
                                                    <InputAdornment position="end">
                                                      <IconButton
                                                        onClick={() =>
                                                          handleCancelNameEdit(
                                                            "Description"
                                                          )
                                                        } // Cancel the edit
                                                        edge="end"
                                                      >
                                                        <CancelOutlinedIcon color="error" />
                                                      </IconButton>
                                                    </InputAdornment>
                                                  </Tooltip>
                                                </>
                                              }
                                            />
                                          </FormControl>
                                        </>
                                      ) : (
                                        <>
                                          <div
                                            className="value-comp"
                                            onClick={() =>
                                              handleEdit("Description")
                                            } // Trigger edit on click
                                          >
                                            {selectedNode.description === "" ||
                                            selectedNode.description ===
                                              undefined ||
                                            selectedNode.description === null
                                              ? "NA" // Display "NA" if description is not set
                                              : selectedNode.description}{" "}
                                            {/* Display the current description */}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </div>
                        )}

                        <br></br>

                        <br />

                        {showAddItemButton && ( // Check if the Add Item button should be shown
                          <div
                            style={{
                              position: "absolute", // Position the button absolutely
                              top: buttonPosition.y, // Set the vertical position based on buttonPosition.y
                              left: buttonPosition.x, // Set the horizontal position based on buttonPosition.x
                              zIndex: 9999, // Set a high z-index to ensure it appears above other elements
                            }}
                          >
                            {/* Additional content for the button can be added here */}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <CustomDialog
                  open={delOpen} // Control the visibility of the dialog based on delOpen state
                  setOpen={setDelOpen} // Function to set the open state of the dialog
                  proceedButtonText={"YES"} // Text for the proceed button
                  proceedButtonClick={handleDeleteNode} // Function to call when the proceed button is clicked
                  cancelButtonText={"NO"} // Text for the cancel button
                ></CustomDialog>

                <SnackbarComponent
                  openPopup={snackbarOpen} // Control the visibility of the snackbar based on snackbarOpen state
                  setOpenPopup={setSnackbarOpen} // Function to set the open state of the snackbar
                  dialogMessage={snackbarText} // Message to display in the snackbar
                  snackbarSeverity={snackbarSeverity} // Severity level of the snackbar (e.g., success, error)
                ></SnackbarComponent>
              </div>
            </Card>
          )}
        </Container>
      ) : (
        // If 'showCreation' is true, render the following componet (AssetMasterTest).
        <div>
          <AssetMasterTest></AssetMasterTest>
        </div>
      )}
    </>
  );
}
