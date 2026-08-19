import React, { useEffect } from "react";
import {
  deleteAnAssetGroup,
  getAllDepartments,
  getAllGroup,
  getAssetGroupTree,
  getAssetGroupsList,
  handlePostData,
} from "./LogbookAssetApi";
import DataTable from "../components/shared/DataTable/DataTable";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Container,
  Fab,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  Typography,
  Zoom,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { TreeView } from "@mui/x-tree-view/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import Barcode from "react-barcode";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import QRCode from "react-qr-code";
import { useTheme } from "@mui/material/styles";
import { getAllFormInfo } from "../Logbook/LogbookApi";
import ModalBox from "./ModalBox.component";
import ControlPointIcon from "@mui/icons-material/ControlPoint";

const handleAddAsset = (navigate) => {
  navigate("/workflow/assetCreation");
};

const handleDelete = async (event, row, setAssetGroupList, assetGroupList) => {
  //   setAssetGroupList((prevAssetGroupList) => {
  //     prevAssetGroupList.filter((item) => item.id !== row.id);
  //   });
  deleteAnAssetGroup(row.groupId);
  setAssetGroupList(assetGroupList.filter((item) => item.id !== row.id));
};

const handleOnCellClick = async (
  params,
  setShow,
  setData,
  logbookIdListMap
) => {
  if (params.field === "groupId") {
    let assetGroupTreeData = await getAssetGroupTree(params.value);
    // Call the function to replace logbook array values
    replaceLogbookWithKeys(assetGroupTreeData[0], logbookIdListMap);
    console.log(assetGroupTreeData[0]);
    setData(assetGroupTreeData[0]);
    // console.log(assetGroupTreeData[0]);
    setShow(false);
  }
};

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
    fontWeight: personName
      ? personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
      : null,
  };
}

const handleLogBook = (event, setLogbook, logbook) => {
  const {
    target: { value },
  } = event;
  console.log(value);
  setLogbook(
    // On autofill we get a stringified value.
    typeof value === "string" ? value.split(",") : value
  );
};

const handleGroups = async (
  event,
  setGroups,
  setLogbookList,
  setLogbook,
  groups
) => {
  const {
    target: { value },
  } = event;

  // let data = await getAllFormInfo();
  // const set = new Set();
  // data?.forEach((form) => {
  //   groups.forEach((grp) => {
  //     if (form.userGroup.trim() === grp) {
  //       set.add(grp);
  //     }
  //   });
  // });

  // data.forEach((form) => {
  //   console.log("form", form.userGroup);
  // });

  setGroups(
    // On autofill we get a stringified value.
    typeof value === "string" ? value.split(",") : value
  );
};

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
  if (set) {
    setLogbook([...set]);
    setLogbookList([...set]);
  } else {
    setLogbook([]);
    setLogbookList([]);
  }
  console.log("logbook based on department", set);
  console.log("val", val);
  setDepartment(val);
};

const LogbookAsset = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [assetGroupList, setAssetGroupList] = useState([]);
  const [show, setShow] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [editAsset, setEditAsset] = useState(false);
  const [assetName, setAssetName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [serialno, setSerialNo] = useState("");
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("");
  const [capacity, setCapacity] = useState("");
  const [department, setDepartment] = useState("");
  const [departmentList, setDepartmentList] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [logbookList, setLogbookList] = useState([]);
  const [logbookIdListMap, setLogbookIdListMap] = useState(null);
  const [logbook, setLogbook] = useState([]);
  const [open, setOpen] = useState(false);

  const [data, setData] = useState({
    // id: "M20240318192438726",
    // name: "M20240318192438726 (Hello)",
    // node_level: 0,
    // children: [
    //   {
    //     id: "A20240318192445171",
    //     name: "A20240318192445171 (Asset-1)",
    //     node_level: 1,
    //     assetName: "Asset-1",
    //     category: "Cat-1",
    //     icon: "",
    //     users: "Software  ",
    //     logbook: [
    //       "Fiama Fresh with essential oil ",
    //       "Fiama Fresh Essential Oil Demo",
    //       "Fiama L&J Smooth Skin SG Bulk",
    //     ],
    //     location: "India",
    //     manufacturer: "ITC",
    //     model: "M-1234",
    //     serialno: "S-1234",
    //     description: "Desc",
    //     unit: "Length",
    //     capacity: "90KM",
    //     children: [
    //       {
    //         id: "A20240318192546244",
    //         name: "A20240318192546244 (Sub Asset - 1)",
    //         node_level: 2,
    //         assetName: "Sub Asset - 1",
    //         category: "Sub Cat - 1",
    //         icon: "",
    //         users: "Software  ",
    //         logbook: [
    //           "Fiama Fresh with essential oil ",
    //           "Fiama L&J Smooth Skin SG Bulk",
    //         ],
    //         location: "GHY",
    //         manufacturer: "ITC",
    //         model: "M-12",
    //         serialno: "S-13",
    //         description: "HIGH",
    //         unit: "Litre",
    //         capacity: "100L",
    //         children: [],
    //       },
    //     ],
    //   },
    //   {
    //     id: "A20240318192652332",
    //     name: "A20240318192652332 (Asset - 2)",
    //     node_level: 1,
    //     assetName: "Asset - 2",
    //     category: "Cat - 2",
    //     icon: "",
    //     users: "Software  ",
    //     logbook: [
    //       "Fiama Fresh Essential Oil Demo",
    //       "Fiama L&J Smooth Skin SG Bulk",
    //     ],
    //     location: "KOL",
    //     manufacturer: "KCG",
    //     model: "M-123456",
    //     serialno: "S-123456",
    //     description: "asdf",
    //     unit: "Length",
    //     capacity: "20Km",
    //     children: [],
    //   },
    // ],
  });

  const columns = [
    { field: "groupId", headerName: "Group ID", flex: 1 },
    { field: "groupName", headerName: "Group Name", flex: 1 },
    {
      field: "createdBy",
      headerName: "Created/Mofified by",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "createdOn",
      headerName: "Created/Mofified on",
      flex: 1,
    },
    {
      field: "delete",
      headerName: "",
      flex: 0.5,
      renderCell: (params) => (
        <DeleteIcon
          onClick={(event) =>
            handleDelete(event, params.row, setAssetGroupList, assetGroupList)
          }
        />
      ),
    },
    // {
    //   field: "age",
    //   headerName: "Age",
    //   type: "number",
    //   headerAlign: "left",
    //   align: "left",
    // },
    // {
    //   field: "phone",
    //   headerName: "Phone Number",
    //   flex: 1,
    // },
  ];

  useEffect(() => {
    async function fetchData() {
      let assetGroupData = await getAssetGroupsList();
      assetGroupData = assetGroupData.map((item, index) => {
        return { ...item, id: index };
      });
      setAssetGroupList(assetGroupData);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchLogBookList() {
      let data = await getAllFormInfo();
      const set = new Set();
      const map = new Map();
      data.forEach((form) => {
        set.add(form.formName);
        map.set(form.formName, form.formID);
      });
      setLogbookList([...set]);
      setLogbookIdListMap(map);
    }
    fetchLogBookList();
  }, []);

  useEffect(() => {
    async function fetchGroupList() {
      let getAllGrp = await getAllGroup();
      setGroupList(getAllGrp);
      let getAllDepartment = await getAllDepartments();
      console.log("getAllDepartment", getAllDepartment);
      setDepartmentList(getAllDepartment);
    }
    fetchGroupList();
  }, []);

  const property = {
    assetGroupList: assetGroupList,
    columns: columns,
    handleOnCellClick: (params) =>
      handleOnCellClick(params, setShow, setData, logbookIdListMap),
  };

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={nodes.label}
      onClick={() => handleNodeClick(nodes, setEditAsset)}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  const handleNodeClick = (node, setEditAsset) => {
    // console.log(node.logbook);
    setEditAsset(false);
    setData((prevData) => {
      findAndAddChildNode(prevData, node.id);
      return prevData;
    });
    setSelectedNode(node);
    console.log("LGbook : ", node);
    setLogbook(node.logbook);
  };

  const findAndAddChildNode = (node, targetNodeId) => {
    if (node.id === targetNodeId) {
      console.log("targetNode", targetNodeId);
      // node.children.push(childNode);
    } else if (Array.isArray(node.children)) {
      node.children.forEach((child) =>
        findAndAddChildNode(child, targetNodeId)
      );
    }
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
      node.logbook = logbook;
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

    setEditAsset(false);
    replaceLogbookWithIds(data, logbookIdListMap);
    console.log("data T,", data);
    handlePostData([data]);
    replaceLogbookWithKeys(data, logbookIdListMap);
  };

  const handleDeleteNode = (selectedNode, setData, setSelectedNode) => {
    if (selectedNode && selectedNode.id.split("")[0] === "M") {
      // If the selected node is the root, clear all data and hide the right panel
      deleteAnAssetGroup(selectedNode.id);
      setData(null);
      setSelectedNode(null);
    } else if (selectedNode) {
      // For other nodes, delete the selected node
      let dataLocal;
      setData((prevData) => {
        const updatedData = JSON.parse(JSON.stringify(prevData));
        findAndDeleteNode(updatedData, selectedNode.id);
        dataLocal = updatedData;
        return updatedData;
      });
      replaceLogbookWithIds(dataLocal, logbookIdListMap);
      console.log("delete Data", dataLocal);
      handlePostData([dataLocal]);
      setSelectedNode(null);
    }
  };

  const findAndDeleteNode = (node, targetNodeId) => {
    if (node.children) {
      node.children = node.children.filter(
        (child) => child.id !== targetNodeId
      );
      node.children.forEach((child) => findAndDeleteNode(child, targetNodeId));
    }
  };

  const handleModalOpen = (setOpen, data) => {
    // handlePostData([data]);
    setOpen(true);
  };

  // function getKey(val) {
  //   return [...logbookIdListMap].find(([key, value]) => val === value)[0];
  // }

  const textStyle = {
    //   color: "#cccccc",
    fontSize: "20px",
    fontWeight: 300,
    fontFamily: "Raleway, sans-serif",
    //   textAlign: "center",
    letterSpacing: "1px",
    lineHeight: "2rem",
    //   textTransform: "uppercase",
    //   textShadow: "1px 1px 2px black, 0 0 1em blue, 0 0 0.2em",
    //   width: "fit-content",
    backgroundColor: "#ccc",
    borderRadius: "10px",
    padding: "5px",
    paddingLeft: "10px",
  };

  const textStyle1 = {
    //   color: "#cccccc",
    fontSize: "20px",
    fontWeight: 300,
    fontFamily: "Raleway, sans-serif",
    textAlign: "center",
    letterSpacing: "1px",
    lineHeight: "2rem",
    //   textTransform: "uppercase",
    //   textShadow: "1px 1px 2px black, 0 0 1em blue, 0 0 0.2em",
    //   width: "fit-content",
    // backgroundColor: "#ccc",
    borderRadius: "10px",
    padding: "5px",
  };

  return (
    <Container maxWidth="lg" sx={{ padding: "0" }}>
      <>
        <Box>
          {/* <Zoom
          key={fab.color}
          in={value === index}
          timeout={transitionDuration}
          style={{
            transitionDelay: `${
              value === index ? transitionDuration.exit : 0
            }ms`,
          }}
          unmountOnExit
        > */}
          {show ? (
            <Fab
              sx={{
                position: "absolute",
                bottom: 30,
                right: 50,
                color: "white",
                background: "#3f64ca",
              }}
              aria-label="Add"
              onClick={() => handleAddAsset(navigate)}
            >
              <AddIcon />
            </Fab>
          ) : (
            <Fab
              sx={{
                position: "absolute",
                bottom: 30,
                right: 50,
                color: "white",
                background: "#3f64ca",
              }}
              aria-label="Arrow"
              onClick={() => setShow(true)}
            >
              <ArrowBackIcon />
            </Fab>
          )}
          {/* </Zoom> */}
        </Box>
        {show ? (
          <Card>
            <DataTable property={property} />
          </Card>
        ) : (
          <Box sx={{ m: "2rem 0rem" }}>
            <Paper sx={{ display: "flex" }}>
              <Box width="40%" sx={{ m: "1rem" }}>
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
              </Box>
              <Box width="60%" sx={{ m: "1rem" }}>
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
                        marginY: 2,
                        justifyContent: "space-between",
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
                            setSelectedNode
                            // setgroupNameState
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
                        onClick={() => handleModalOpen(setOpen, data)}
                        endIcon={<ControlPointIcon />}
                      >
                        Add Item
                      </Button>
                    </Box>

                    <Box>
                      <Container maxWidth="md">
                        <Grid container spacing={1}>
                          <Grid
                            item
                            container
                            xs={12}
                            spacing={0.5}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Typography>
                              <QRcodeGenerator value={selectedNode.id} />
                            </Typography>
                          </Grid>

                          <Grid item container xs={12} spacing={0.5}>
                            <Grid item xs={6}>
                              <Typography sx={textStyle}>Asset ID:</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography sx={textStyle1}>
                                {selectedNode.id}
                                {/* <BarcodeGenerator value={selectedNode.id} /> */}
                              </Typography>
                            </Grid>
                          </Grid>

                          <Grid item container xs={12} spacing={0.5}>
                            <Grid item xs={6}>
                              <Typography sx={textStyle}>
                                Asset Name:
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              {!editAsset ? (
                                <Typography sx={textStyle1}>
                                  {selectedNode.assetName}
                                </Typography>
                              ) : (
                                <TextField
                                  label="Asset Name"
                                  variant="outlined"
                                  fullWidth
                                  defaultValue={selectedNode.assetName}
                                  // value={assetName}
                                  onChange={(e) => setAssetName(e.target.value)}
                                />
                              )}
                            </Grid>
                          </Grid>

                          <Grid item container xs={12} spacing={0.5}>
                            <Grid item xs={6}>
                              <Typography sx={textStyle}>Category:</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              {!editAsset ? (
                                <Typography sx={textStyle1}>
                                  {selectedNode.category}
                                </Typography>
                              ) : (
                                <TextField
                                  label="Category"
                                  variant="outlined"
                                  fullWidth
                                  defaultValue={selectedNode.category}
                                  // value={category}
                                  onChange={(e) => setCategory(e.target.value)}
                                />
                              )}
                            </Grid>
                          </Grid>

                          <Grid item container xs={12} spacing={0.5}>
                            <Grid item xs={6}>
                              <Typography sx={textStyle}>Groups:</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              {!editAsset ? (
                                <Typography sx={textStyle1}>
                                  {selectedNode.groups
                                    ? selectedNode.groups.toString()
                                    : null}
                                </Typography>
                              ) : (
                                <FormControl fullWidth>
                                  <InputLabel id="select-groups">
                                    Select Groups
                                  </InputLabel>
                                  <Select
                                    labelId="select-groups"
                                    label="Select Groups"
                                    multiple
                                    defaultValue={selectedNode.groups || []}
                                    // value={groups}
                                    onChange={(e) =>
                                      handleGroups(
                                        e,
                                        setGroups,
                                        setLogbookList,
                                        setLogbook,
                                        groups
                                      )
                                    }
                                    input={
                                      <OutlinedInput
                                        id="select-multiple-chip"
                                        label="Select Groups"
                                      />
                                    }
                                    renderValue={(selected) => (
                                      <Box
                                        sx={{
                                          display: "flex",
                                          flexWrap: "wrap",
                                          gap: 0.5,
                                        }}
                                      >
                                        {selected.map((value) => (
                                          <Chip key={value} label={value} />
                                        ))}
                                      </Box>
                                    )}
                                    MenuProps={MenuProps}
                                  >
                                    {groupList.map((itm, index) => (
                                      <MenuItem
                                        key={itm}
                                        value={itm}
                                        style={getStyles(itm, groups, theme)}
                                      >
                                        <Checkbox
                                          checked={
                                            groups && groups.indexOf(itm) > -1
                                          }
                                        />
                                        <ListItemText primary={itm} />
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              )}
                            </Grid>
                          </Grid>

                          <Grid item container xs={12} spacing={0.5}>
                            <Grid item xs={6}>
                              <Typography sx={textStyle}>
                                Department:
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              {!editAsset ? (
                                <Typography sx={textStyle1}>
                                  {selectedNode.department}
                                </Typography>
                              ) : (
                                <FormControl fullWidth>
                                  <InputLabel id="select-department">
                                    Select Department
                                  </InputLabel>
                                  <Select
                                    labelId="select-department"
                                    label="Select Department"
                                    defaultValue={selectedNode.department}
                                    // value={department}
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
                                    <MenuItem value="">Select</MenuItem>
                                    {departmentList.map((itm, index) => (
                                      <MenuItem key={index} value={itm}>
                                        {itm}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              )}
                            </Grid>
                          </Grid>

                          <Grid item container xs={12} spacing={0.5}>
                            <Grid item xs={6}>
                              <Typography sx={textStyle}>Logbooks:</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              {!editAsset ? (
                                <Typography sx={textStyle1}>
                                  {selectedNode.logbook
                                    ? selectedNode.logbook.toString()
                                    : ""}
                                </Typography>
                              ) : (
                                <FormControl fullWidth>
                                  <InputLabel id="select-logbook">
                                    Select Logbook
                                  </InputLabel>
                                  <Select
                                    labelId="select-logbook"
                                    label="Select Logbook"
                                    multiple
                                    // defaultValue={selectedNode.logbook || []}
                                    // defaultValue={
                                    //   (logbook.length > 0
                                    //     ? logbook
                                    //     : selectedNode.logbook) || []
                                    // }
                                    value={logbook}
                                    onChange={(e) =>
                                      handleLogBook(
                                        e,
                                        setLogbook,
                                        selectedNode.logbook
                                      )
                                    }
                                    input={
                                      <OutlinedInput
                                        id="select-multiple-chip"
                                        label="Select Logbook"
                                      />
                                    }
                                    renderValue={(selected) => (
                                      <Box
                                        sx={{
                                          display: "flex",
                                          flexWrap: "wrap",
                                          gap: 0.5,
                                        }}
                                      >
                                        {selected.map((value) => (
                                          <Chip key={value} label={value} />
                                        ))}
                                      </Box>
                                    )}
                                    MenuProps={MenuProps}
                                  >
                                    {logbookList.map((itm, index) => (
                                      <MenuItem
                                        key={itm}
                                        value={itm}
                                        style={getStyles(itm, logbook, theme)}
                                      >
                                        <Checkbox
                                          checked={logbook.indexOf(itm) > -1}
                                        />
                                        <ListItemText primary={itm} />
                                        {/* {itm} */}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              )}
                            </Grid>
                          </Grid>

                          <Grid item container xs={12} spacing={0.5}>
                            <Grid item xs={6}>
                              <Typography sx={textStyle}>Location:</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              {!editAsset ? (
                                <Typography sx={textStyle1}>
                                  {selectedNode.location}
                                </Typography>
                              ) : (
                                <TextField
                                  label="Location"
                                  variant="outlined"
                                  fullWidth
                                  defaultValue={selectedNode.location}
                                  // value={location}
                                  onChange={(e) => setLocation(e.target.value)}
                                />
                              )}
                            </Grid>
                          </Grid>

                          <Grid item container xs={12} spacing={0.5}>
                            <Grid item xs={6}>
                              <Typography sx={textStyle}>
                                Manufacturer:
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              {!editAsset ? (
                                <Typography sx={textStyle1}>
                                  {selectedNode.manufacturer}
                                </Typography>
                              ) : (
                                <TextField
                                  label="Manufacturer"
                                  variant="outlined"
                                  fullWidth
                                  defaultValue={selectedNode.manufacturer}
                                  // value={manufacturer}
                                  onChange={(e) =>
                                    setManufacturer(e.target.value)
                                  }
                                />
                              )}
                            </Grid>
                          </Grid>

                          <Grid item container xs={12} spacing={0.5}>
                            <Grid item xs={6}>
                              <Typography sx={textStyle}>Model:</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              {!editAsset ? (
                                <Typography sx={textStyle1}>
                                  {selectedNode.model}
                                </Typography>
                              ) : (
                                <TextField
                                  label="Enter Model"
                                  variant="outlined"
                                  fullWidth
                                  defaultValue={selectedNode.model}
                                  // value={model}
                                  onChange={(e) => setModel(e.target.value)}
                                />
                              )}
                            </Grid>
                          </Grid>

                          <Grid item container xs={12} spacing={0.5}>
                            <Grid item xs={6}>
                              <Typography sx={textStyle}>
                                Serial Number:
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              {!editAsset ? (
                                <Typography sx={textStyle1}>
                                  {selectedNode.serialno}
                                </Typography>
                              ) : (
                                <TextField
                                  label="Serial No"
                                  variant="outlined"
                                  fullWidth
                                  defaultValue={selectedNode.serialno}
                                  // value={serialno}
                                  onChange={(e) => setSerialNo(e.target.value)}
                                />
                              )}
                            </Grid>
                          </Grid>

                          <Grid item container xs={12} spacing={0.5}>
                            <Grid item xs={6}>
                              <Typography sx={textStyle}>
                                Description:
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              {!editAsset ? (
                                <Typography sx={textStyle1}>
                                  {selectedNode.description}
                                </Typography>
                              ) : (
                                <TextField
                                  label="Description"
                                  variant="outlined"
                                  fullWidth
                                  defaultValue={selectedNode.description}
                                  // value={description}
                                  onChange={(e) =>
                                    setDescription(e.target.value)
                                  }
                                />
                              )}
                            </Grid>
                          </Grid>

                          <Grid item container xs={12} spacing={0.5}>
                            <Grid item xs={6}>
                              <Typography sx={textStyle}>Unit:</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              {!editAsset ? (
                                <Typography sx={textStyle1}>
                                  {selectedNode.unit}
                                </Typography>
                              ) : (
                                <FormControl fullWidth>
                                  <InputLabel id="select-unit-of-measurement">
                                    Select unit Of measurement
                                  </InputLabel>
                                  <Select
                                    labelId="select-unit-of-measurement"
                                    label="Select unit Of measurement"
                                    defaultValue={selectedNode.unit}
                                    // value={unit}
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
                              )}
                            </Grid>
                          </Grid>

                          <Grid item container xs={12} spacing={0.5}>
                            <Grid item xs={6}>
                              <Typography sx={textStyle}>Capacity:</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              {!editAsset ? (
                                <Typography sx={textStyle1}>
                                  {selectedNode.capacity}
                                </Typography>
                              ) : (
                                <TextField
                                  label="Capacity"
                                  variant="outlined"
                                  fullWidth
                                  defaultValue={selectedNode.capacity}
                                  // value={capacity}
                                  onChange={(e) => setCapacity(e.target.value)}
                                />
                              )}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Container>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        marginY: 2,
                        justifyContent: "space-between",
                      }}
                    >
                      <Button
                        className="button"
                        variant="contained"
                        color="secondary"
                        onClick={
                          () => setEditAsset((bool) => !bool)
                          // handleEditNode(
                          //   data,
                          //   selectedNode
                          //   // setData,
                          //   // setSelectedNode,
                          //   // setgroupNameState
                          // )
                        }
                      >
                        {!editAsset ? "Edit This Asset" : "Preview this Asset"}
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
              </Box>
            </Paper>
          </Box>
        )}
        <ModalBox
          open={open}
          setOpen={setOpen}
          data={data}
          setData={setData}
          logbookIdListMap={logbookIdListMap}
          selectedNode={selectedNode}
        />
      </>
    </Container>
  );
};

export default LogbookAsset;

const QRcodeGenerator = ({ value, size = 100 }) => {
  return (
    <QRCode
      title={value}
      // value={value}
      // // level="level"
      size={100}
      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
      value={value}
      viewBox={`0 0 256 256`}
    />
  );
};

const BarcodeGenerator = ({ value, width = 1, height = 50, fontSize = 18 }) => {
  return (
    <Barcode value={value} width={width} height={height} fontSize={fontSize} />
  );
};
