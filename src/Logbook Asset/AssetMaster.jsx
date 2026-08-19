import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
// import { styled } from "@mui/material/styles";
import {
  Box,
  Checkbox,
  Chip,
  Collapse,
  Container,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Modal,
  OutlinedInput,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  deleteAnAssetGroup,
  getAllDepartments,
  getAllGroup,
  handlePostData,
} from "./LogbookAssetApi";
import Barcode from "react-barcode";
import { getAllFormInfo } from "../Logbook/LogbookApi";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import AssetViewItem from "./AssetViewItem";
import EditAssetItem from "./EditAssetItem";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

// const handleSubmit = (event, groupName) => {
//   event.preventDefault();
//   // Handle form submission here
//   console.log(`Creating group "${groupName}"`);
// };

const handleGroupNameRoot = (
  rootNodeName,
  setData,
  setRootNodeName,
  setGroupId,
  createInitialData,
  setgroupNameState
) => {
  const rootName = rootNodeName.trim();
  if (rootName !== "") {
    const id = `M${new Date()
      .toISOString()
      .replace(/[-:T.Z]/g, "")
      .slice(0, 19)}`;
    setGroupId(id);
    setData(createInitialData(id, rootName));
    setRootNodeName("");
    setgroupNameState(true);
  }
};

// const handleRootNodeCreate = (
//   rootNodeName,
//   setData,
//   setRootNodeName,
//   createInitialData
// ) => {
//   const rootName = rootNodeName.trim();
//   if (rootName !== "") {
//     setData(createInitialData(rootName));
//     setRootNodeName("");
//   }
// };

const createInitialData = (id, rootName, level = 0) => ({
  id: id,
  label: `${id} (${rootName})`,
  node_level: level,
  assetName: rootName,
  category: null,
  icon: null,
  users: null,
  logbook: null,
  location: null,
  manufacturer: null,
  model: null,
  serialno: null,
  description: null,
  unit: null,
  capacity: null,
  children: [],
});

const handleChildNodeAdd = (
  //   childNodeName,
  selectedNode,
  setData,
  model,
  setModel,
  //   setChildNodeName,
  handleModalClose,
  setOpen,
  setAssetId,
  assetId,
  assetName,
  category,
  icon,
  department,
  groups,
  users,
  logbook,
  logbookIdListMap,
  location,
  manufacturer,
  serialno,
  description,
  unit,
  capacity,
  setAutogenId,
  setAssetName,
  setCategory,
  setIcon,
  setLogbook,
  setLogbookIdListMap,
  setLocation,
  setManufacturer,
  setSerialNo,
  setDescription,
  setUnit,
  setCapacity,
  setDepartmentChecked,
  setGroupChecked,
  setUsers,
  setDepartmentList,
  setGroupList,
  setDepartment,
  setGroups
) => {
  if (assetId.trim() !== "" && selectedNode) {
    // console.log("ChildNode", childNodeName, selectedNode);
    const formIdlist = logbook.map((itm) => logbookIdListMap.get(itm));
    const newChildNode = {
      id: assetId,
      label: assetId + " (" + assetName + ")",
      node_level: selectedNode.node_level + 1, // Calculate child nodeLevel
      assetName: assetName,
      category: category,
      icon: icon,
      users: [users],
      department: department,
      groups: groups,
      logbook: formIdlist,
      location: location,
      manufacturer: manufacturer,
      model: model,
      serialno: serialno,
      description: description,
      unit: unit,
      capacity: capacity,
      children: [],
    };

    let dataLocal;
    setData((prevData) => {
      const updatedData = JSON.parse(JSON.stringify(prevData));
      findAndAddChildNode(updatedData, selectedNode.id, newChildNode);
      dataLocal = updatedData;
      return updatedData;
    });

    // Clear input fields after adding a child node
    // setChildNodeName("");
    setAssetId("");
    setModel("");
    // setgroupNameState] = useState(false);
    // setGroupRootNodeName] = useState("");
    // setSelectedNode] = useState(null);
    // setRootNodeName] = useState("");
    setAutogenId(false);
    setAssetName("");
    setCategory("");
    setIcon("");
    setLogbook([]);
    // setLogbookIdListMap(null);
    setLocation("");
    setManufacturer("");
    setSerialNo("");
    setDescription("");
    setUnit("");
    setCapacity();
    setDepartmentChecked(false);
    setGroupChecked(false);
    setUsers("");
    // setDepartmentList([]);
    // setGroupList([]);
    setDepartment("");
    setGroups([]);
    console.log("dataLocal ", JSON.stringify(dataLocal));
    handlePostData([dataLocal]);
    setOpen(false);
  }
};

// const handleSaveAssetTree = async (data) => {
//   console.log(data);
//  //window.location.reload();
//   // handlePostData([data]);
// };

const findAndAddChildNode = (node, targetNodeId, childNode) => {
  if (node.id === targetNodeId) {
    node.children.push(childNode);
  } else if (Array.isArray(node.children)) {
    node.children.forEach((child) =>
      findAndAddChildNode(child, targetNodeId, childNode)
    );
  }
};

const handleDeleteNode = (
  selectedNode,
  setData,
  setSelectedNode,
  setgroupNameState
) => {
  if (selectedNode && selectedNode.id.split("")[0] === "M") {
    // If the selected node is the root, clear all data and hide the right panel
    deleteAnAssetGroup(selectedNode.id);
    setData(null);
    setSelectedNode(null);
    setgroupNameState(false);
  } else if (selectedNode) {
    // For other nodes, delete the selected node
    let dataLocal;
    setData((prevData) => {
      const updatedData = JSON.parse(JSON.stringify(prevData));
      findAndDeleteNode(updatedData, selectedNode.id);
      dataLocal = updatedData;
      return updatedData;
    });
    console.log("delete Data", dataLocal);
    handlePostData([dataLocal]);
    setSelectedNode(null);
  }
};

const findAndDeleteNode = (node, targetNodeId) => {
  if (node.children) {
    node.children = node.children.filter((child) => child.id !== targetNodeId);
    node.children.forEach((child) => findAndDeleteNode(child, targetNodeId));
  }
};

const handleModalOpen = (setOpen) => {
  setOpen(true);
};
const handleModalClose = (e, reason, setOpen) => {
  if (reason !== "backdropClick") {
    setOpen(false);
  }
};

const onAtuogenIdChange = (e, setAutogenId, setAssetId) => {
  const id = `A${new Date()
    .toISOString()
    .replace(/[-:T.Z]/g, "")
    .slice(0, 19)}`;

  if (e.target.checked) {
    setAssetId(id);
  } else {
    setAssetId("");
  }
  setAutogenId(e.target.checked);
};

// const handleDepartmentFilter = async (
//   e,
//   setDepartmentChecked,
//   setGroupChecked,
//   setDepartmentList
// ) => {
//   setDepartmentChecked(e.target.checked);
//   setGroupChecked(false);
//   let getAllDepartment = await getAllDepartments();
//   setDepartmentList(getAllDepartment);
// };

// const handleGroupFilter = async (
//   e,
//   setDepartmentChecked,
//   setGroupChecked,
//   setGroupList
// ) => {
//   setGroupChecked(e.target.checked);
//   setDepartmentChecked(false);
//   let getAllGrp = await getAllGroup();
//   setGroupList(getAllGrp);
// };

const handleDepartmentFilter = async (
  e,
  setDepartment,
  setLogbookList,
  setLogbook
) => {
  let data = await getAllFormInfo();
  const val = e.target.value;
  // const res = data.filter((a) => a.department.trim() === val);
  const set = new Set();
  data.forEach((form) => {
    // console.log("form", form.department);
    if (form.department.trim() === val) {
      set.add(form.formName);
    }
  });
  if (set.size > 0) {
    console.log("set test", set);
    setLogbook([...set]);
    setLogbookList([...set]);
  } else {
    setLogbook([]);
    setLogbookList([]);
  }
  console.log("logbook based on department", set);
  setDepartment(val);
};

const handleGroupFilter = async (
  e,
  setDepartmentChecked,
  setGroupChecked,
  setGroupList
) => {
  setGroupChecked(e.target.checked);
  setDepartmentChecked(false);
  let getAllGrp = await getAllGroup();
  console.log("Group : ", getAllGrp);
  setGroupList(getAllGrp);
};

const handleViewItemClick = (setViewItemModalOpen) => {
  setViewItemModalOpen(true);
};

const handleViewItemModalClose = (event, reason, setViewItemModalOpen) => {
  if (reason !== "backdropClick") {
    setViewItemModalOpen(false);
  }
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const handleLogBook = (event, setLogbook) => {
  const {
    target: { value },
  } = event;
  setLogbook(
    // On autofill we get a stringified value.
    typeof value === "string" ? value.split(",") : value
  );
  console.log("handleLogBook", value);
};

const handleGroups = async (event, setGroups) => {
  const {
    target: { value },
  } = event;
  // let data = await getAllFormInfo();

  // data.forEach((form) => {
  //   console.log("form", form.userGroup);
  // });
  setGroups(
    // On autofill we get a stringified value.
    typeof value === "string" ? value.split(",") : value
  );
};

const AssetMaster = () => {
  //   const classes = useStyles();
  const theme = useTheme();
  const [groupNameState, setgroupNameState] = useState(false);
  const [groupRootNodeName, setGroupRootNodeName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [editAsset, setEditAsset] = useState(false);
  const [data, setData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [rootNodeName, setRootNodeName] = useState("");
  //   const [childNodeName, setChildNodeName] = useState("");
  const [model, setModel] = useState("");
  const [assetId, setAssetId] = useState("");
  const [autogenId, setAutogenId] = useState(false);
  const [assetName, setAssetName] = useState("");
  const [category, setCategory] = useState("");
  const [icon, setIcon] = useState("");
  const [logbook, setLogbook] = useState([]);
  const [groups, setGroups] = useState([]);
  const [location, setLocation] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [serialno, setSerialNo] = useState("");
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("");
  const [capacity, setCapacity] = useState();
  const [departmentChecked, setDepartmentChecked] = useState(false);
  const [groupChecked, setGroupChecked] = useState(false);
  const [users, setUsers] = useState("");
  const [department, setDepartment] = useState("");
  const [departmentList, setDepartmentList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [logbookList, setLogbookList] = useState([]);
  const [logbookIdListMap, setLogbookIdListMap] = useState(null);

  const [open, setOpen] = useState(false);
  const [viewItemModalOpen, setViewItemModalOpen] = useState(false);

  useEffect(() => {
    console.log("useEffect called ");
    console.log("Data => ", data);
    // Recursively update the nodeLevel in the data
    const updateNodeLevel = (node, level) => {
      node.node_level = level;
      if (Array.isArray(node.children)) {
        node.children.forEach((child) => updateNodeLevel(child, level + 1));
      }
    };

    if (data) {
      updateNodeLevel(data, 0);
    }
  }, [data]);

  useEffect(() => {
    async function fetchLogBookList() {
      let data = await getAllFormInfo();
      // const set = new Set();
      console.log("LogbookA : ", data);
      const map = new Map();
      data.forEach((form) => {
        // set.add(form.formName);
        map.set(form.formName, form.formID);
      });
      // setLogbookList([...set]);
      setLogbookIdListMap(map);
    }
    fetchLogBookList();
  }, []);

  useEffect(() => {
    async function fetchGroupList() {
      let getAllGrp = await getAllGroup();
      setGroupList(getAllGrp);
      console.log("Ashok : ", getAllGrp);
      let getAllDepartment = await getAllDepartments();
      setDepartmentList(getAllDepartment);
    }
    fetchGroupList();
  }, []);

  console.log("remv", data);

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={nodes.label}
      onClick={() => handleNodeClick(nodes, setEditAsset, setLogbook)}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  const handleNodeClick = (node, setEditAsset, setLogbook) => {
    if (editAsset) {
      console.log("inside handleNodeClick");
      replaceLogbookWithIds(data, logbookIdListMap);
      // setData((prevData) => {
      //   return prevData;
      // });
    }
    // console.log("hello", node.logbook);
    // setLogbook(node.logbook);
    setEditAsset(false);
    setSelectedNode(node);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
  };

  const style1 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
  };

  const handleEditNode = (
    data,
    selectedNode,
    assetName,
    category,
    groups,
    department,
    logbook,
    // logbookList,
    location,
    manufacturer,
    model,
    serialno,
    description,
    unit,
    capacity,
    setEditAsset
  ) => {
    setData((prevData) => {
      findAndEditChildNode(
        prevData,
        selectedNode.id,
        data,
        selectedNode,
        assetName,
        category,
        groups,
        department,
        logbook,
        location,
        manufacturer,
        model,
        serialno,
        description,
        unit,
        capacity
      );
      return prevData;
    });

    // Clear input fields after adding a child node
    // setChildNodeName("");
    setAssetId("");
    setModel("");
    // setgroupNameState] = useState(false);
    // setGroupRootNodeName] = useState("");
    // setSelectedNode] = useState(null);
    // setRootNodeName] = useState("");
    setAutogenId(false);
    setAssetName("");
    setCategory("");
    setGroups([]);
    setDepartment("");
    setIcon("");
    setLogbook([]);
    // setLogbookIdListMap(null);
    setLocation("");
    setManufacturer("");
    setSerialNo("");
    setDescription("");
    setUnit("");
    setCapacity();
    setDepartmentChecked(false);
    setGroupChecked(false);
    setUsers("");
    setEditAsset(false);
    replaceLogbookWithIds(data, logbookIdListMap);
    console.log("data save this asset,", data);
    handlePostData([data]);
    // replaceLogbookWithKeys(data, logbookIdListMap);
  };

  const findAndEditChildNode = (
    node,
    targetNodeId,
    data,
    selectedNode,
    assetName,
    category,
    groups,
    department,
    logbook,
    location,
    manufacturer,
    model,
    serialno,
    description,
    unit,
    capacity
  ) => {
    if (node.id === targetNodeId) {
      node.assetName = assetName || node.assetName;
      node.category = category || node.category;
      node.groups = groups.length > 0 ? groups : node.groups;
      node.department = department || node.department;
      // node.logbook = logbook.length > 0 ? logbook : node.logbook;
      node.logbook = logbook || node.logbook;
      node.location = location || node.location;
      node.manufacturer = manufacturer || node.manufacturer;
      node.model = model || node.model;
      node.serialno = serialno || node.serialno;
      node.description = description || node.description;
      node.unit = unit || node.unit;
      node.capacity = capacity || node.capacity;
    } else if (Array.isArray(node.children)) {
      node.children.forEach((child) =>
        findAndEditChildNode(
          child,
          targetNodeId,
          data,
          selectedNode,
          assetName,
          category,
          groups,
          department,
          logbook,
          location,
          manufacturer,
          model,
          serialno,
          description,
          unit,
          capacity
        )
      );
    }
  };

  function replaceLogbookWithIds(data, logbookIdListMap) {
    if (Array.isArray(data.logbook)) {
      data.logbook = data.logbook.map((item) => {
        const value = [...logbookIdListMap.entries()].find(
          ([key, value]) => item === key
        );
        return value ? value[1] : item;
      });
    }
    if (data.children) {
      data.children.forEach((child) =>
        replaceLogbookWithIds(child, logbookIdListMap)
      );
    }
  }

  function replaceLogbookWithKeys(data, logbookIdListMap) {
    if (Array.isArray(data.logbook)) {
      data.logbook = data.logbook.map((item) => {
        const key = [...logbookIdListMap.entries()].find(
          ([key, value]) => item === value
        );
        return key ? key[0] : item;
      });
    }
    if (data.children) {
      data.children.forEach((child) =>
        replaceLogbookWithKeys(child, logbookIdListMap)
      );
    }
  }

  const modifyIdsOnEdit = () => {
    if (!editAsset) {
      console.log("editAsset", editAsset);
      replaceLogbookWithKeys(data, logbookIdListMap);
      setLogbook(selectedNode.logbook);
      console.log("This is working", data);
      setData(data);
      setEditAsset((bool) => !bool);
    } else {
      console.log("editAsset", editAsset);
      setAssetId("");
      setModel("");
      // setgroupNameState] = useState(false);
      // setGroupRootNodeName] = useState("");
      // setSelectedNode] = useState(null);
      // setRootNodeName] = useState("");
      setAutogenId(false);
      setAssetName("");
      setCategory("");
      setGroups([]);
      setDepartment("");
      // setIcon("");
      setLogbook([]);
      // setLogbookIdListMap(null);
      setLocation("");
      setManufacturer("");
      setSerialNo("");
      setDescription("");
      setUnit("");
      setCapacity();
      // setDepartmentChecked(false);
      // setGroupChecked(false);
      // setUsers("");
      replaceLogbookWithIds(data, logbookIdListMap);
      console.log("This is working", data);
      setData(data);
      setEditAsset((bool) => !bool);
    }
  };

  return (
    <>
      <Collapse in={!groupNameState}>
        <Box sx={{ m: "2rem 10rem" }}>
          <Paper sx={{ display: "flex" }}>
            <Box width="50%" sx={{ m: "1rem" }}>
              {/* <form onSubmit={(e) => handleSubmit(e, groupName)}> */}
              <Typography>Enter Group Name</Typography>
              <TextField
                label="Enter Group Name"
                value={groupRootNodeName}
                onChange={(e) => setGroupRootNodeName(e.target.value)}
                //   value={groupName}
                //   onChange={(event) => setGroupName(event.target.value)}
                margin="normal"
                fullWidth
                disabled={groupNameState}
              />
              <Button
                // type="submit"
                variant="contained"
                color="primary"
                fullWidth
                onClick={() =>
                  handleGroupNameRoot(
                    groupRootNodeName,
                    setData,
                    setRootNodeName,
                    setGroupId,
                    createInitialData,
                    setgroupNameState
                  )
                }
                disabled={groupNameState}
              >
                Create Group
              </Button>
              {/* </form> */}
            </Box>
            <Box
              width="50%"
              sx={{ m: "1rem", border: "1px solid grey", borderRadius: "5px" }}
            >
              <img
                src="../../assetCreation.jpg"
                alt=""
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "contain",
                }}
              />
            </Box>
          </Paper>
        </Box>
      </Collapse>
      <Box sx={{ m: "2rem 10rem" }}>
        <Paper sx={{ display: "flex" }}>
          <Box width="40%" sx={{ m: "1rem" }}>
            {data && (
              <div className="treeViewContainer">
                <Typography>Asset Tree: </Typography>
                <TreeView
                  sx={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    transition: "box-shadow 0.3s ease-in-out",
                  }}
                  aria-label="rich object"
                  defaultCollapseIcon={<ExpandMoreIcon />}
                  defaultExpanded={["root"]}
                  defaultExpandIcon={<ChevronRightIcon />}
                >
                  {renderTree(data, setSelectedNode)}
                </TreeView>
                <br />
              </div>
            )}
            {/* {data && data.children.length > 0 && (
              <Box>
                <Button
                  className="button"
                  variant="contained"
                  color="warning" // Use secondary color for delete button
                  onClick={() => handleSaveAssetTree(data)}
                >
                  Save
                </Button>
              </Box>
            )} */}
          </Box>
          <Box width="60%" sx={{ m: "1rem" }}>
            {/* {data && (
              <>
                <TextField
                  className="textInput"
                  label="Enter Parent Node Name"
                  variant="outlined"
                  fullWidth
                  value={rootNodeName}
                  onChange={(e) => setRootNodeName(e.target.value)}
                />
                <Button
                  className="button"
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    handleRootNodeCreate(
                      rootNodeName,
                      setData,
                      setRootNodeName,
                      createInitialData
                    )
                  }
                >
                  Create Root Node
                </Button>
              </>
            )} */}
            {data && (
              <>
                {selectedNode && (
                  <Box
                    sx={{
                      //   display: "flex",
                      //   justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="button">
                        {`Selected Asset: ${selectedNode.label}`}
                      </Typography>
                      <Button
                        className="button"
                        variant="contained"
                        color="error" // Use secondary color for delete button
                        onClick={() =>
                          handleDeleteNode(
                            selectedNode,
                            setData,
                            setSelectedNode,
                            setgroupNameState
                          )
                        }
                        endIcon={<DeleteIcon />}
                      >
                        Delete Asset
                      </Button>
                      <Button
                        className="button"
                        variant="contained"
                        color="success" // Use secondary color for delete button
                        onClick={() => handleModalOpen(setOpen)}
                        endIcon={<ControlPointIcon />}
                      >
                        Add Item
                      </Button>
                    </Box>
                    <br />
                    <Box>
                      {selectedNode.node_level !== 0 && !editAsset ? (
                        <Container maxWidth="md">
                          <AssetViewItem
                            selectedNode={selectedNode}
                            logbookIdListMap={logbookIdListMap}
                          />
                        </Container>
                      ) : null}
                      {selectedNode.node_level !== 0 && editAsset ? (
                        <Container maxWidth="md">
                          <EditAssetItem
                            selectedNode={selectedNode}
                            setAssetName={setAssetName}
                            setCategory={setCategory}
                            setLogbook={setLogbook}
                            logbookList={logbookList}
                            theme={theme}
                            setLocation={setLocation}
                            setManufacturer={setManufacturer}
                            setModel={setModel}
                            setSerialNo={setSerialNo}
                            setDescription={setDescription}
                            setUnit={setUnit}
                            setCapacity={setCapacity}
                            handleLogBook={handleLogBook}
                            setGroups={setGroups}
                            handleGroups={handleGroups}
                            groupList={groupList}
                            groups={groups}
                            handleDepartmentFilter={handleDepartmentFilter}
                            setDepartment={setDepartment}
                            setLogbookList={setLogbookList}
                            departmentList={departmentList}
                            logbook={logbook}
                          />
                        </Container>
                      ) : null}
                    </Box>
                    <br />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {/* <Button
                        className="button"
                        variant="contained"
                        color="primary" // Use secondary color for delete button
                        onClick={() =>
                          handleViewItemClick(setViewItemModalOpen)
                        }
                      >
                        View Item
                      </Button> */}
                      <Button
                        className="button"
                        variant="contained"
                        color="secondary"
                        onClick={
                          () => modifyIdsOnEdit()
                          // handleEditNode(
                          //   data,
                          //   selectedNode
                          //   // setData,
                          //   // setSelectedNode,
                          //   // setgroupNameState
                          // )
                        }
                      >
                        {!editAsset
                          ? "Update This Asset"
                          : "Preview this Asset"}
                      </Button>
                      {editAsset && (
                        <Button
                          className="button"
                          variant="contained"
                          color="warning" // Use secondary color for delete button
                          onClick={
                            () =>
                              handleEditNode(
                                data,
                                selectedNode,
                                assetName,
                                category,
                                groups,
                                department,
                                logbook,
                                // logbookList,
                                location,
                                manufacturer,
                                model,
                                serialno,
                                description,
                                unit,
                                capacity,
                                setEditAsset
                              )
                            // handleEditNode(
                            //   data,
                            //   selectedNode
                            //   // setData,
                            //   // setSelectedNode,
                            //   // setgroupNameState
                            // )
                          }
                        >
                          Save This Asset
                        </Button>
                      )}
                    </Box>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Paper>
      </Box>
      <Modal
        open={open}
        onClose={(e, reason) => handleModalClose(e, reason, setOpen)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        disableEscapeKeyDown
      >
        <Box sx={style}>
          <Box
            sx={{
              //   display: "flex",
              //   justifyContent: "space-between",
              maxHeight: "500px",
              width: "800px",
              overflow: "auto",
              p: 2,
            }}
          >
            <IconButton
              aria-label="close"
              onClick={() => setOpen(false)}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box>
              <Box sx={{ display: "flex", marginY: 2 }}>
                <Typography
                  variant="h6"
                  component="h4"
                  minWidth="200px"
                  alignSelf="center"
                  //   align="center"
                >
                  Asset Id
                </Typography>
                <Box width="100%">
                  <TextField
                    required
                    className="textInput"
                    label="Asset Id"
                    variant="outlined"
                    fullWidth
                    value={assetId}
                    onChange={(e) => setAssetId(e.target.value)}
                  />
                  <Checkbox
                    title={"Auto Generated Id"}
                    checked={autogenId}
                    onChange={(e) =>
                      onAtuogenIdChange(e, setAutogenId, setAssetId)
                    }
                  />
                </Box>
              </Box>
              <Box sx={{ display: "flex", marginY: 2 }}>
                <Typography
                  variant="h6"
                  component="h4"
                  minWidth="200px"
                  alignSelf="center"
                >
                  Asset Name
                </Typography>
                <TextField
                  label="Asset Name"
                  variant="outlined"
                  fullWidth
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                />
              </Box>
              <Box sx={{ display: "flex", marginY: 2 }}>
                <Typography
                  variant="h6"
                  component="h4"
                  minWidth="200px"
                  alignSelf="center"
                >
                  Category
                </Typography>
                <TextField
                  label="Category"
                  variant="outlined"
                  fullWidth
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </Box>
              <Box sx={{ display: "flex", marginY: 2 }}>
                <Typography
                  variant="h6"
                  component="h4"
                  minWidth="200px"
                  alignSelf="center"
                >
                  Icon
                </Typography>
                <FormControl fullWidth>
                  <InputLabel id="select-icon">Select icon</InputLabel>
                  <Select
                    labelId="select-icon"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    label="Select icon"
                    // disabled={elem.disabled}
                    // required={elem.requiredfield}
                    // displayEmpty={elem.displayEmpty}
                  >
                    <MenuItem value="" disabled>
                      Test
                    </MenuItem>
                    {/* {elem.drpItems.map((itm, index) => (
          <MenuItem key={index} value={itm.itemValue}>
            {itm.itemLabel}
          </MenuItem>
        ))} */}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ display: "flex", marginY: 2 }}>
                <Typography
                  variant="h6"
                  component="h4"
                  minWidth="200px"
                  alignSelf="center"
                >
                  Select Groups
                </Typography>
                <FormControl fullWidth>
                  <InputLabel id="select-groups">Select Groups</InputLabel>
                  <Select
                    labelId="select-groups"
                    label="Select Groups"
                    multiple
                    value={groups}
                    onChange={(e) => handleGroups(e, setGroups)}
                    input={
                      <OutlinedInput
                        id="select-multiple-chip"
                        label="Select Groups"
                      />
                    }
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {/* <MenuItem value="" disabled>
                      Test
                    </MenuItem> */}
                    {groupList.map((itm, index) => (
                      <MenuItem
                        key={itm}
                        value={itm}
                        style={getStyles(itm, groups, theme)}
                      >
                        <Checkbox checked={groups.indexOf(itm) > -1} />
                        <ListItemText primary={itm} />
                        {/* {itm} */}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              {/* <Box sx={{ display: "flex", marginY: 2 }}>
                <Typography
                  variant="h6"
                  component="h4"
                  minWidth="200px"
                  alignSelf="center"
                >
                  Filter By
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={departmentChecked}
                      onChange={(e) =>
                        handleDepartmentFilter(
                          e,
                          setDepartmentChecked,
                          setGroupChecked,
                          setDepartmentList
                        )
                      }
                    />
                  }
                  label="Department"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={groupChecked}
                      onChange={(e) =>
                        handleGroupFilter(
                          e,
                          setDepartmentChecked,
                          setGroupChecked,
                          setGroupList
                        )
                      }
                    />
                  }
                  label="Groups"
                />
              </Box> */}
              <Box sx={{ display: "flex", marginY: 2 }}>
                <Typography
                  variant="h6"
                  component="h4"
                  minWidth="200px"
                  alignSelf="center"
                >
                  Select Department
                </Typography>
                <FormControl fullWidth>
                  <InputLabel id="select-department">
                    Select Department
                  </InputLabel>
                  <Select
                    labelId="select-department"
                    label="Select Department"
                    value={department}
                    // onChange={(e) => setDepartment(e.target.value)}
                    onChange={(e) =>
                      handleDepartmentFilter(
                        e,
                        setDepartment,
                        setLogbookList,
                        setLogbook
                      )
                    }
                  >
                    <MenuItem value="" disabled>
                      Select
                    </MenuItem>
                    {departmentList.map((itm, index) => (
                      <MenuItem key={index} value={itm}>
                        {itm}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ display: "flex", marginY: 2 }}>
                <Typography
                  variant="h6"
                  component="h4"
                  minWidth="200px"
                  alignSelf="center"
                >
                  Select Users
                </Typography>
                <FormControl fullWidth>
                  <InputLabel id="select-users">Select Users</InputLabel>
                  <Select
                    labelId="select-users"
                    label="Select Users"
                    value={users}
                    onChange={(e) => setUsers(e.target.value)}
                  >
                    <MenuItem value="" disabled>
                      Select
                    </MenuItem>
                    {departmentChecked &&
                      departmentList.map((itm, index) => (
                        <MenuItem key={index} value={itm}>
                          {itm}
                        </MenuItem>
                      ))}
                    {groupChecked &&
                      groupList.map((itm, index) => (
                        <MenuItem key={index} value={itm}>
                          {itm}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ display: "flex", marginY: 2 }}>
                <Typography
                  variant="h6"
                  component="h4"
                  minWidth="200px"
                  alignSelf="center"
                >
                  Select Logbook
                </Typography>
                <FormControl fullWidth>
                  <InputLabel id="select-logbook">Select Logbook</InputLabel>
                  <Select
                    labelId="select-logbook"
                    label="Select Logbook"
                    multiple
                    value={logbook}
                    onChange={(e) => handleLogBook(e, setLogbook)}
                    input={
                      <OutlinedInput
                        id="select-multiple-chip"
                        label="Select Logbook"
                      />
                    }
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {/* <MenuItem value="" disabled>
                      Test
                    </MenuItem> */}
                    {logbookList.map((itm, index) => (
                      <MenuItem
                        key={itm}
                        value={itm}
                        style={getStyles(itm, logbook, theme)}
                      >
                        <Checkbox checked={logbook.indexOf(itm) > -1} />
                        <ListItemText primary={itm} />
                        {/* {itm} */}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ display: "flex", marginY: 2 }}>
                <Typography
                  variant="h6"
                  component="h4"
                  minWidth="200px"
                  alignSelf="center"
                >
                  Location
                </Typography>
                <TextField
                  label="Location"
                  variant="outlined"
                  fullWidth
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </Box>
              <Box sx={{ display: "flex", marginY: 2 }}>
                <Typography
                  variant="h6"
                  component="h4"
                  minWidth="200px"
                  alignSelf="center"
                >
                  Manufacturer
                </Typography>
                <TextField
                  label="Manufacturer"
                  variant="outlined"
                  fullWidth
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                />
              </Box>
              <Box sx={{ display: "flex", marginY: 2 }}>
                <Typography
                  variant="h6"
                  component="h4"
                  minWidth="200px"
                  alignSelf="center"
                >
                  Enter Model
                </Typography>
                <TextField
                  label="Enter Model"
                  variant="outlined"
                  fullWidth
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </Box>
              <Box sx={{ display: "flex", marginY: 2 }}>
                <Typography
                  variant="h6"
                  component="h4"
                  minWidth="200px"
                  alignSelf="center"
                >
                  Serial No
                </Typography>
                <TextField
                  label="Serial No"
                  variant="outlined"
                  fullWidth
                  value={serialno}
                  onChange={(e) => setSerialNo(e.target.value)}
                />
              </Box>
              <Box sx={{ display: "flex", marginY: 2 }}>
                <Typography
                  variant="h6"
                  component="h4"
                  minWidth="200px"
                  alignSelf="center"
                >
                  Description
                </Typography>
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Box>
              <Box sx={{ display: "flex", marginY: 2 }}>
                <Typography
                  variant="h6"
                  component="h4"
                  minWidth="200px"
                  alignSelf="center"
                >
                  Unit Of measurement
                </Typography>
                <FormControl fullWidth>
                  <InputLabel id="select-unit-of-measurement">
                    Select unit Of measurement
                  </InputLabel>
                  <Select
                    labelId="select-unit-of-measurement"
                    label="Select unit Of measurement"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  >
                    <MenuItem key="1" value="Kg">
                      Kg
                    </MenuItem>
                    <MenuItem key="2" value="Litre">
                      Litre
                    </MenuItem>
                    <MenuItem key="3" value="Length">
                      Length
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ display: "flex", marginY: 2 }}>
                <Typography
                  variant="h6"
                  component="h4"
                  minWidth="200px"
                  alignSelf="center"
                >
                  Capacity
                </Typography>
                <TextField
                  label="Capacity"
                  variant="outlined"
                  type="number"
                  fullWidth
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </Box>
              {/* <Box sx={{ display: "flex", marginY: 2 }}>
                <Typography
                  variant="h6"
                  component="h4"
                  minWidth="200px"
                  alignSelf="center"
                >
                  Enter Child Node
                </Typography>
                <TextField
                  required
                  className="textInput"
                  label="Enter Child Node"
                  variant="outlined"
                  fullWidth
                  value={childNodeName}
                  onChange={(e) => setChildNodeName(e.target.value)}
                />
              </Box> */}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                className="button"
                variant="contained"
                color="primary"
                onClick={() =>
                  handleChildNodeAdd(
                    //   childNodeName,
                    selectedNode,
                    setData,
                    model,
                    setModel,
                    //   setChildNodeName,
                    handleModalClose,
                    setOpen,
                    setAssetId,
                    assetId,
                    assetName,
                    category,
                    icon,
                    department,
                    groups,
                    users,
                    logbook,
                    logbookIdListMap,
                    location,
                    manufacturer,
                    serialno,
                    description,
                    unit,
                    capacity,
                    setAutogenId,
                    setAssetName,
                    setCategory,
                    setIcon,
                    setLogbook,
                    setLogbookIdListMap,
                    setLocation,
                    setManufacturer,
                    setSerialNo,
                    setDescription,
                    setUnit,
                    setCapacity,
                    setDepartmentChecked,
                    setGroupChecked,
                    setUsers,
                    setDepartmentList,
                    setGroupList,
                    setDepartment,
                    setGroups
                  )
                }
              >
                Add Asset
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      <Modal
        // open={viewItemModalOpen}
        open={false}
        onClose={(event, reason) =>
          handleViewItemModalClose(event, reason, setViewItemModalOpen)
        }
        disableEscapeKeyDown
        disableScrollLock
      >
        <Box sx={style1}>
          <Box
            maxWidth="xl"
            sx={{
              //   display: "flex",
              //   justifyContent: "space-between",
              maxHeight: "500px",
              width: "1000px",
              overflow: "auto",
              p: 2,
            }}
          >
            <IconButton
              aria-label="close"
              onClick={(event, reason) =>
                handleViewItemModalClose(event, reason, setViewItemModalOpen)
              }
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
              Asset Details For Group ID: {groupId} ({groupRootNodeName})
            </DialogTitle>
            <Divider />
            <Box sx={{ width: "100%" }}>
              <Grid container mt={3}>
                <Grid item xs={12}>
                  <Container maxWidth="md">
                    <AssetViewItem
                      selectedNode={selectedNode}
                      logbookIdListMap={logbookIdListMap}
                    />
                  </Container>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default AssetMaster;

const BarcodeGenerator = ({ value, width = 2, height = 50, fontSize = 18 }) => {
  return (
    <Barcode value={value} width={width} height={height} fontSize={fontSize} />
  );
};
