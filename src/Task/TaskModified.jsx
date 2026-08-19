import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Fab,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Card, Container } from "react-bootstrap";
import { Card as PrimeCard } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Steps } from "primereact/steps";
import { Await, Navigate, json } from "react-router-dom";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import HomeIcon from "@mui/icons-material/Home";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import "./taskCreation.css";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Sidebar } from "primereact/sidebar";
import { InputNumber } from "primereact/inputnumber";
import { ToggleButton } from "primereact/togglebutton";
import CustomTreeView from "../components/shared/tree/tree.component";
import { TreeItem } from "@mui/x-tree-view";
import SnackbarComponent from "../components/shared/snackbar/customSnackbar";
import {
  getAllDepartments,
  getAllGroup,
  getAssetGroupTree,
  getAssetGroupsList,
  getGroupByGroupId,
} from "../Logbook Asset/LogbookAssetApi";
import { fetchAllUsers, getAllGroupDetails } from "../Admin/UserModuleAPi";
import ActivityFlow from "./ActivityFlow";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  reconnectEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import { MultiSelect } from "primereact/multiselect";
import { getAllActiveFormInfo } from "../Logbook/LogbookApi";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import CustomDialog from "../components/shared/dialog/dialog.component";
import { decryptTokenId } from "../helper/AuthService";
import {
  getActivityConnections,
  getAllTaskByTenantId,
  getTaskBytaskId,
  handleSaveActivityConnections,
  handleSaveTask,
} from "./TaskAPI";
import { connect } from "formik";
import { TabPanel, TabView } from "primereact/tabview";
import TaskMaster from "./TaskMasterTest";
import { animate } from "framer-motion";

export default function TaskCreation({ dbTaskDetails }) {
  const stepperRef = useRef(null);
  const [dlgVisible, setDlgVisible] = useState(false);
  const [assetDlg, setAssetDlg] = useState(false);
  const [buttonShow, setButtonShow] = useState(true);
  const [checked, setChecked] = useState(false);
  const [isTaskNameMatched, setIsTaskNameMatched] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [activityName, setActivityName] = useState("");
  const [activityAbbr, setActivityAbbr] = useState("");
  const [description, setDescription] = useState("");
  const [selectedReviwer, setSelectedReviwer] = useState("");
  const [selectedAssetGroup, setSelectedAssetGroup] = useState("");
  const [snackbarText, setSnackbarText] = useState("Data saved !");
  const [snackbarSeverity, setsnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [buffer, setBuffer] = useState(0);
  const [assetGroups, setAssetGroups] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [logbookOptions, setLogbookOptions] = useState([]);
  const [allActiveLogbooks, setAllActiveLogbooks] = useState([]);
  const [selectedLogbooks, setSelectedLogbooks] = useState("");
  const [globalFilter, setGlobalFilter] = useState(null);
  const [reviewOptions, setReviewOptions] = useState([]);
  const [assetId, setAssetId] = useState("");
  const [delOpen, setDelOpen] = useState(false);
  const [showCreation, setShowCreation] = useState(true);
  const [loading, setLoading] = useState(false);
  const [assetLogbookData, setAssetLogbookData] = useState([]);
  const [withoutAssetLogbookData, setWithoutAssetLogbookData] = useState([]);
  const [taskDetails, setTaskDetails] = useState(null);
  const [activityList, setActivityList] = useState([]);
  const [allAssets, setAllAssets] = useState("");
  const [allAssetIds, setAllAssetIds] = useState("");
  const [activityLogbook, setActivityLogbook] = useState("");
  const [activityDepartment, setActivityDepartment] = useState("");
  const [activityGroups, setActivityGroups] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [withoutAssetGroupList, setWithoutAssetGroupList] = useState([]);
  const [withoutAssetselectedGroups, setWithoutAssetSelectedGroups] =
    useState("");
  const [withoutAssetSelectedLogbooks, setWithoutAssetSelectedLogbooks] =
    useState("");
  const [withoutAssetLogbookOptions, setWithoutAssetLogbookOptions] = useState(
    []
  );
  const [selectedGroups, setSelectedGroups] = useState("");
  const [departmentList, setDepartmentList] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [logbookIdListMap, setLogbookIdListMap] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [flowNode, setFlowNode] = useState("");
  const [treeData, setTreeData] = useState(null);

  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reconnectDone = useRef(true);

  useEffect(() => {
    async function fetchData() {
      // let getAllDepartment = await getAllDepartments();
      // setDepartmentList(getAllDepartment);
      //let getAllGrp = await getAllGroup();
      let getAllGrp = await getAllGroupDetails();
      setWithoutAssetGroupList(getAllGrp);
      let data = await getAllActiveFormInfo();
      setLogbookIdListMap(data);
      if (
        dbTaskDetails !== null &&
        dbTaskDetails !== undefined &&
        dbTaskDetails !== ""
      ) {
        let activityconnections = [];
        activityconnections = await getActivityConnectionsFromAPI(
          dbTaskDetails.taskId
        );
        setIsTaskNameMatched(true);
        setTaskDetails(dbTaskDetails);
        setActivityList(dbTaskDetails.activityList);
        setTaskName(dbTaskDetails.taskName);
        setSelectedAssetGroup(dbTaskDetails.assetGroup);
        setDescription(dbTaskDetails.description);
        setSelectedReviwer(dbTaskDetails.reviewer);

        const nodesData = dbTaskDetails.activityList?.map((activity) => ({
          id: activity.activityId,
          data: { label: activity.activityName, sequence: activity.sequence },
          position: { x: activity.xPos, y: activity.yPos },
        }));

        setNodes(nodesData);
        console.log("AShok : ", activityconnections);
        if (activityconnections.length !== 0) {
          const linksData = activityconnections.map((connection) => ({
            id: connection.sourceId + connection.targetId,
            source: connection.sourceId,
            target: connection.targetId,
            animated: true,
            data: {
              sourceName: connection.source,
              targetName: connection.target,
            },
          }));

          setEdges(linksData);
        }
      }
    }

    fetchData();

    async function getActivityConnectionsFromAPI(taskId) {
      const connections = await getActivityConnections(taskId);
      return connections;
    }
  }, []);

  // useEffect(() => {
  //   async function getDistinctUserGroupNames() {
  //     if (
  //       selectedDept !== "" &&
  //       selectedDept !== null &&
  //       selectedDept !== undefined
  //     ) {
  //       console.log("Inside the Condition : ", logbookIdListMap);
  //       setLoading(true);
  //       // setSelectedGroups([]);
  //       const userGroups = logbookIdListMap
  //         ?.filter(
  //           (item) =>
  //             item.department.trim().toLowerCase() ===
  //             selectedDept.toLowerCase()
  //         )
  //         .map((item) => item.userGroup)
  //         .reduce((acc, userGroup) => {
  //           userGroup
  //             .split(",")
  //             .forEach((group) => acc.add(group.trim().toLowerCase()));
  //           return acc;
  //         }, new Set());

  //       const groupNamesPromises = [...userGroups]?.map(async (groupId) => {
  //         console.log("LgBook USERgrp ID : ", groupId);
  //         const response = await getGroupByGroupId(groupId);
  //         console.log("From API : ", response ? response.groupName : null);
  //         return response ? response.groupName : null;
  //       });

  //       const groupNames = await Promise.all(groupNamesPromises);
  //       setLoading(false);
  //       return [...new Set(groupNames?.filter((name) => name !== null))];
  //     }
  //   }

  //   getDistinctUserGroupNames().then((groupNames) => {
  //     console.log("KOLKATA : ", groupNames);
  //     setGroupList(groupNames);
  //   });
  // }, [selectedDept]);

  useEffect(() => {
    console.log("Node Deatils : ", nodes);
  }, [nodes]);

  useEffect(() => {
    console.log("Edge Details : ", edges);
  }, [edges]);

  useEffect(() => {
    async function fetchLogBookList() {
      let data = await getAllActiveFormInfo();
      setAllActiveLogbooks(data);

      const taskList = await getAllTaskByTenantId();
      console.log("Task List : ", taskList);
      setTaskList(taskList);
    }
    fetchLogBookList();
  }, []);

  useEffect(() => {
    async function filterGroupsById() {
      setSelectedGroups("");
      setSelectedLogbooks("");
      setLogbookOptions([]);
      const groupNames = selectedNode?.groups ? selectedNode.groups : [];

      //console.log(selectedFormNames);
      setGroupList(groupNames);
    }

    filterGroupsById();
  }, [selectedNode]);

  useEffect(() => {
    //   async function filterLogbooksById() {
    //     if(selectedGroups!==""&&selectedGroups!==null&&selectedGroups!==undefined){
    //     setSelectedLogbooks([]);
    //     const selectedFormNames = allActiveLogbooks
    //       .filter((logbook) => {selectedNode?.department?.trim()===logbook?.department?.trim()
    //         && logbook?.userGroup?.includes(selectedGroups?.trim())
    //       })
    //       .map((logbook) => logbook.formName);

    //     //console.log(selectedFormNames);
    //     setLogbookOptions(selectedFormNames);
    //   }
    // }
    //   filterLogbooksById();

    async function filterLogBookList() {
      // console.log("AllisWell : ", logbookIdListMap);
      if (
        selectedGroups !== "" &&
        selectedGroups !== null &&
        selectedGroups !== undefined
      ) {
        setSelectedLogbooks("");
        setLoading(true);
        const filteredLogbooks = await Promise.all(
          allActiveLogbooks.map(async (logbook) => {
            const userGroups = logbook.userGroup
              ? logbook.userGroup.split(",").map((group) => group.trim())
              : [];
            console.log("userGroups array:", userGroups);

            const isInSelectedGroups = await Promise.all(
              userGroups.map(async (group) => {
                const groupByGroupIds = await getGroupByGroupId(group);
                const groupByGroupId = groupByGroupIds?.groupName
                  ? groupByGroupIds.groupName
                  : "";
                console.log(
                  "Group Names : ",
                  groupByGroupId ? groupByGroupId : ""
                );
                // console.log("Suraj:", group);
                // console.log("Ashok : ", logbook);
                // console.log("groupByGroupId : ", groupByGroupId);
                // console.log("selectedGroups : ", selectedGroups);
                // console.log("check : ", selectedGroups.includes(groupByGroupId));
                return selectedGroups.includes(groupByGroupId);
              })
            ).then((results) => results.some(Boolean));
            console.log("LAST ATTEMPT : ", selectedNode?.department);
            const isInSelectedDept =
              logbook.department?.trim() === selectedNode?.department?.trim() ||
              logbook.department?.trim() === selectedDept?.trim();
            // console.log("UserGroupName:", isInSelectedGroups);
            // console.log("UserDeptName:", isInSelectedDept);
            console.log(
              "LastLogbook",
              isInSelectedGroups && isInSelectedDept ? logbook : null
            );

            return isInSelectedGroups && isInSelectedDept ? logbook : null;
          })
        );

        console.log("ABCD : ", filteredLogbooks);

        const validLogbooks = filteredLogbooks.filter(
          (logbook) => logbook !== null
        );

        console.log("Filter", validLogbooks);

        const options = validLogbooks?.map((logbook) => ({
          label: logbook.formName,
          value: logbook.formName,
        }));

        setSelectedLogbooks(options?.map((option) => option.value));

        console.log("Lpgbook options ", options);

        setLogbookOptions(options);
        setLoading(false);
      }
    }
    filterLogBookList();
  }, [selectedGroups]);

  useEffect(() => {
    //   async function filterLogbooksById() {
    //     if(selectedGroups!==""&&selectedGroups!==null&&selectedGroups!==undefined){
    //     setSelectedLogbooks([]);
    //     const selectedFormNames = allActiveLogbooks
    //       .filter((logbook) => {selectedNode?.department?.trim()===logbook?.department?.trim()
    //         && logbook?.userGroup?.includes(selectedGroups?.trim())
    //       })
    //       .map((logbook) => logbook.formName);

    //     //console.log(selectedFormNames);
    //     setLogbookOptions(selectedFormNames);
    //   }
    // }
    //   filterLogbooksById();

    async function filterLogBookList() {
      // console.log("AllisWell : ", logbookIdListMap);
      if (
        withoutAssetselectedGroups !== "" &&
        withoutAssetselectedGroups !== null &&
        withoutAssetselectedGroups !== undefined
      ) {
        console.log("Group Object : ", withoutAssetselectedGroups);
        setWithoutAssetSelectedLogbooks("");
        setLoading(true);
        const filteredLogbooks = await Promise.all(
          allActiveLogbooks.map(async (logbook) => {
            const userGroups = logbook.userGroup
              ? logbook.userGroup.split(",").map((group) => group.trim())
              : [];
            console.log("userGroups array:", userGroups);

            const isInSelectedGroups = await Promise.all(
              userGroups.map(async (group) => {
                // const groupByGroupIds =
                //   withoutAssetselectedGroups?.groupName === group;

                // const groupByGroupId = groupByGroupIds?.groupName
                //   ? groupByGroupIds?.groupName
                //   : "";
                // console.log(
                //   "Group Names : ",
                //   groupByGroupId ? groupByGroupId : ""
                // );
                // console.log("Suraj:", group);
                // console.log("Ashok : ", logbook);
                // console.log("groupByGroupId : ", groupByGroupId);
                // console.log("selectedGroups : ", selectedGroups);
                console.log("grup Id lg : ", group);
                console.log(
                  "check : ",
                  withoutAssetselectedGroups.groupId.includes(group)
                );
                return withoutAssetselectedGroups.groupId.includes(group);
              })
            ).then((results) => results.some(Boolean));
            console.log("LAST ATTEMPT : ", selectedNode?.department);
            const isInSelectedDept =
              logbook.department?.trim() === selectedNode?.department?.trim() ||
              logbook.department?.trim() === selectedDept?.trim();
            // console.log("UserGroupName:", isInSelectedGroups);
            // console.log("UserDeptName:", isInSelectedDept);
            console.log(
              "LastLogbook",
              isInSelectedGroups || isInSelectedDept ? logbook : null
            );

            return isInSelectedGroups || isInSelectedDept ? logbook : null;
          })
        );

        console.log("ABCD : ", filteredLogbooks);

        const validLogbooks = filteredLogbooks.filter(
          (logbook) => logbook !== null
        );

        console.log("Filter", validLogbooks);

        const options = validLogbooks?.map((logbook) => ({
          label: logbook.formName,
          value: logbook.formName,
        }));

        // setWithoutAssetSelectedLogbooks(options?.map((option) => option.value));

        console.log("Lpgbook options ", options);

        setWithoutAssetLogbookOptions(options);
        setLoading(false);
      }
    }
    filterLogBookList();
  }, [withoutAssetselectedGroups]);

  useEffect(() => {
    if (
      assetLogbookData?.length !== 0 &&
      assetLogbookData !== undefined &&
      assetLogbookData !== null
    ) {
      const assets = assetLogbookData.map((asset) => asset.asset).join(", ");
      const assetIds = assetLogbookData
        .map((asset) => asset.assetId)
        .join(", ");
      setAllAssets(assets);
      setAllAssetIds(assetIds);

      if (assetLogbookData.length > 0) {
        setActivityLogbook(assetLogbookData[0]?.logbook);
        setActivityDepartment(assetLogbookData[0]?.department);
        setActivityGroups(
          Array.isArray(assetLogbookData[0].groups)
            ? assetLogbookData[0].groups
            : assetLogbookData[0].groups.split(", ")
        );
      }
    }
  }, [assetLogbookData]);

  const calculateNodeSequences = (nodes, edges) => {
    const nodeLevels = {};
    const queue = [];

    // Find all root nodes (nodes with no incoming edges)
    nodes.forEach((node) => {
      const hasIncomingEdges = edges.some((edge) => edge.target === node.id);
      if (!hasIncomingEdges) {
        nodeLevels[node.id] = 1;
        queue.push(node.id);
      }
    });

    // Perform BFS to assign levels
    while (queue.length > 0) {
      const currentNodeId = queue.shift();
      const currentLevel = nodeLevels[currentNodeId];

      edges.forEach((edge) => {
        if (edge.source === currentNodeId) {
          nodeLevels[edge.target] = currentLevel + 1;
          queue.push(edge.target);
        }
      });
    }

    // Update nodes with their sequence levels
    const newNodes = nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        sequence: nodeLevels[node.id] || "",
      },
    }));

    return newNodes;
  };

  const onConnect = useCallback(
    (params) => {
      const sourceNode = nodes.find((node) => node.id === params.source);
      const targetNode = nodes.find((node) => node.id === params.target);
      const newEdge = {
        ...params,
        animated: true,
        data: {
          sourceName: sourceNode?.data.label || "",
          targetName: targetNode?.data.label || "",
        },
      };
      const newEdges = addEdge(newEdge, edges);
      setEdges(newEdges);
      setNodes((nds) => calculateNodeSequences(nds, newEdges));
    },
    [nodes, edges, setEdges, setNodes]
  );

  const onReconnectStart = useCallback(() => {
    reconnectDone.current = false;
  }, []);

  const onReconnect = useCallback(
    (oldEdge, newConnection) => {
      reconnectDone.current = true;
      const sourceNode = nodes.find((node) => node.id === newConnection.source);
      const targetNode = nodes.find((node) => node.id === newConnection.target);
      const newEdge = {
        ...newConnection,
        animated: true,
        data: {
          sourceName: sourceNode?.data.label || "",
          targetName: targetNode?.data.label || "",
        },
      };
      const newEdges = reconnectEdge(oldEdge, newEdge, edges);
      setEdges(newEdges);
      setNodes((nds) => calculateNodeSequences(nds, newEdges));
    },
    [nodes, edges, setEdges, setNodes]
  );

  const onReconnectEnd = useCallback(
    (_, edge) => {
      if (!reconnectDone.current) {
        const newEdges = edges.filter((e) => e.id !== edge.id);
        setEdges(newEdges);
        setNodes((nds) => calculateNodeSequences(nds, newEdges));
      }
      reconnectDone.current = true;
    },
    [edges, setEdges, setNodes]
  );

  useEffect(() => {
    console.log("UseEffect Called");

    fetchAssetAllGroups();
    fetchAllUsersForReview();
  }, []);

  useEffect(() => {
    console.log("UseEffect Called");
    fetchAssetTree();
  }, [selectedAssetGroup]);
  async function fetchAssetTree() {
    if (
      selectedAssetGroup !== "" &&
      selectedAssetGroup !== null &&
      selectedAssetGroup !== undefined
    ) {
      let data = await getAssetGroupTree(selectedAssetGroup);
      console.log("selectedAssetGroup : ", selectedAssetGroup);
      console.log("TreeData : ", data[0]);
      setTreeData(data[0]);
    }
  }
  async function fetchAssetAllGroups() {
    let data = await getAssetGroupsList();
    const groupNames = data?.map((group) => group.groupName);
    //console.log("Ashok : ", groupNames);
    setAssetGroups(groupNames);
    // console.log("Asset Group data : ", data);
  }

  async function fetchAllUsersForReview() {
    let data = await fetchAllUsers();
    const options = data?.map((user) => ({
      label: user.userName,
      value: user.userId,
    }));
    setReviewOptions(options);
  }
  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={nodes.assetName}
      onClick={() => handleNodeClick(nodes)}
      onContextMenu={(e) => handleContextMenu(e, nodes)}
    >
      {Array.isArray(nodes.children)
        ? nodes.children?.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  const generateTaskId = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

    return `T${year}${month}${day}T${hours}${minutes}${seconds}${milliseconds}`;
  };
  const generateActivityId = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

    return `A${year}${month}${day}T${hours}${minutes}${seconds}${milliseconds}`;
  };
  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  const handleContextMenu = (event, node) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedNode(node);
  };
  const handleSaveDraftTask = async () => {
    if (taskName === "" || taskName === undefined || taskName === null) {
      setSnackbarOpen(true);
      setSnackbarText("Task Name Should Not be Empty !");
      setsnackbarSeverity("error");
      return;
    }
    if (
      selectedReviwer === "" ||
      selectedReviwer === undefined ||
      selectedReviwer === null
    ) {
      setSnackbarOpen(true);
      setSnackbarText("Choose reviewer !");
      setsnackbarSeverity("error");
      return;
    }

    console.log("dbTaskDetails : ", dbTaskDetails);
    if (
      dbTaskDetails === null ||
      dbTaskDetails === undefined ||
      dbTaskDetails === ""
    ) {
      console.log("sdbtask details true");

      if (
        taskList !== undefined &&
        taskList !== null &&
        taskList !== "" &&
        taskList.length !== 0
      ) {
        const isTaskNameMatched = isTaskNamePresent(taskList, taskName);
        console.log("isTaskNameMatched : ", isTaskNameMatched);
        if (isTaskNameMatched !== undefined) {
          if (isTaskNameMatched === true) {
            // setIsTaskNameMatched(false);
            setSnackbarOpen(true);
            setSnackbarText("Task Name Already Exist !");
            setsnackbarSeverity("error");
            return;
          } else setIsTaskNameMatched(true);
        }
      }
    }

    let taskId =
      dbTaskDetails?.taskId !== "" ||
      dbTaskDetails?.taskId !== undefined ||
      dbTaskDetails?.taskId !== null
        ? dbTaskDetails?.taskId
        : generateTaskId();
    let status =
      dbTaskDetails?.status !== "" ||
      dbTaskDetails?.status !== undefined ||
      dbTaskDetails?.status !== null
        ? dbTaskDetails?.status
        : "Not Ready";

    const user = localStorage.getItem("username");

    let creator =
      dbTaskDetails?.creator !== "" ||
      dbTaskDetails?.creator !== undefined ||
      dbTaskDetails?.creator !== null
        ? dbTaskDetails?.creator
        : decryptTokenId(user);

    const tenantId =
      dbTaskDetails?.tenantId !== "" ||
      dbTaskDetails?.tenantId !== undefined ||
      dbTaskDetails?.tenantId !== null
        ? dbTaskDetails?.tenantId
        : getTenantID();

    const newTask = {
      creationTime: new Date(),
      taskId:
        taskId === undefined || taskId === null ? generateTaskId() : taskId,
      taskName: taskName,
      creator:
        creator === undefined || creator === null
          ? decryptTokenId(user)
          : creator,
      reviewer: selectedReviwer,
      assetGroup: selectedAssetGroup,
      description: description,
      activityList: activityList,
      status: status === undefined || status === null ? "Not Ready" : status,
      tenantId:
        tenantId === undefined || tenantId === null ? getTenantID() : tenantId,
    };
    // setTaskDetails({
    //   taskId: taskId,
    //   taskName: taskName,
    //   reviewer: selectedReviwer,
    //   assetGroup: selectedAssetGroup,
    //   description: description,
    //   activityList: activityList,
    //   status: "Not Ready",
    // });
    console.log("NewTask : ", newTask);

    if (isTaskNameMatched) {
      console.log("No DB transaction ");
      stepperRef.current.nextCallback();
      return;
    }
    //  await handleSaveTask(newTask);
    const apiStatus = await handleSaveTask(newTask);
    if (
      apiStatus !== null &&
      apiStatus !== undefined &&
      apiStatus !== "" &&
      apiStatus === 200
    ) {
      setTaskDetails(newTask);

      stepperRef.current.nextCallback();
    } else {
      setSnackbarOpen(true);
      setSnackbarText("Databas Error !");
      setsnackbarSeverity("error");
    }
  };
  function isTaskNamePresent(taskList, selectedTaskName) {
    for (let task of taskList) {
      if (task.taskName === selectedTaskName) {
        return true;
      }
    }
    return false;
  }
  const handleSaveDraftActivity = async () => {
    let cnnection = checkConnections();
    if (!cnnection) {
      setSnackbarOpen(true);
      setSnackbarText("All nodes should be connected with any node");
      setsnackbarSeverity("error");
      return;
    }

    console.log("AllISWEll2 : ", activityList);
    console.log("AllISWEll 3 : ", taskDetails);
    console.log("NodeLIst : ", nodes);
    const updatedActivityList = activityList.map((activity) => {
      const matchingNode = nodes.find(
        (node) => node.id === activity.activityId
      );

      if (matchingNode) {
        return {
          ...activity,
          sequence: matchingNode.data.sequence,
          xPos: matchingNode.position.x,
          yPos: matchingNode.position.y,
        };
      }

      return activity;
    });
    console.log("ACtivity Sequence : ", updatedActivityList);
    setActivityList(updatedActivityList);
    setTaskDetails({
      ...taskDetails,
      activityList: updatedActivityList,
    });
    console.log("Modified Task ", {
      ...taskDetails,
      activityList: updatedActivityList,
    });

    // console.log(
    //   "posted data : ",
    //   json.stringify(
    //     json.parse({
    //       ...taskDetails,
    //       activityList: updatedActivityList,
    //     })
    //   )
    // );

    let edgesList = [];

    edges.forEach((edge) => {
      const newEdge = {
        taskId: taskDetails.taskId,
        sourceId: edge.source,
        source: edge.data.sourceName,
        targetId: edge.target,
        target: edge.data.targetName,
        tenantId: getTenantID(),
      };
      edgesList = [...edgesList, newEdge];
    });

    console.log("EdgesList : ", edgesList);

    console.log(
      "Final JSON",
      JSON.stringify({
        ...taskDetails,
        activityList: updatedActivityList,
      })
    );
    const parsed = {
      ...taskDetails,
      activityList: updatedActivityList,
    };

    console.log("New Json : ", parsed);
    const apiStatus1 = await handleSaveActivityConnections(edgesList);

    // await handleSaveTask(parsed);
    const apiStatus = await handleSaveTask(parsed);
    if (
      apiStatus !== null &&
      apiStatus !== undefined &&
      apiStatus !== "" &&
      apiStatus === 200 &&
      apiStatus1 !== null &&
      apiStatus1 !== undefined &&
      apiStatus1 !== "" &&
      apiStatus1 === 200
    ) {
      setSnackbarOpen(true);
      setSnackbarText("Acvities Saved Successfully");
      setsnackbarSeverity("success");

      stepperRef.current.nextCallback();
    }
  };

  const deleteGroup = async () => {
    // const success = await deleteAnAssetGroup(assetGroupId);
    // console.log("delete status ", success);
    // if (success === true) {
    setsnackbarSeverity("success");
    setSnackbarText("Row Deleted Successfully");
    setSnackbarOpen(true);

    setAssetLogbookData(
      assetLogbookData.filter((row) => row.assetId !== assetId)
    );
    setDelOpen(false);
    // } else {
    //   setsnackbarSeverity("error");
    //   setSnackbarText("Failed To Delete");

    //   setSnackbarOpen(true);
    // }
  };
  const handleAddAssetClick = () => {
    if (
      activityName === "" ||
      activityName === undefined ||
      activityName === null
    ) {
      setSnackbarOpen(true);
      setSnackbarText("Activity Name Should Not be Empty !");
      setsnackbarSeverity("error");
      return;
    }
    if (
      activityAbbr === "" ||
      activityAbbr === undefined ||
      selectedReviwer === null
    ) {
      setSnackbarOpen(true);
      setSnackbarText("Activity Abbreviation should not be empty !");
      setsnackbarSeverity("error");
      return;
    }

    setAssetDlg(true);
  };

  const getTenantID = () => {
    const encryptedTenant = localStorage.getItem("tenantId");
    const tenant = decryptTokenId(encryptedTenant);
    console.log("Current Tenant ID : ", tenant);
    return tenant;
  };

  const handleAddNode = () => {
    if (activityName.trim() && activityAbbr.trim()) {
      setFlowNode({ id: activityAbbr, name: activityName });

      setActivityAbbr("");
      setActivityName();
    }
  };

  const handleAddAssetLogbookClick = () => {
    const newAssetLogbook = {
      assetId: selectedNode.id,
      logbook: selectedLogbooks === undefined ? "" : selectedLogbooks,
      asset: selectedNode.assetName,
      // groups: selectedNode.groups,
      groups: selectedGroups,
      department: selectedNode.department,
    };

    if (assetLogbookData?.length === 0) {
      console.log("newAssetLogbook : ", newAssetLogbook);
      setAssetLogbookData([...assetLogbookData, newAssetLogbook]);
      setSnackbarOpen(true);
      setSnackbarText("Added successfully");
      setsnackbarSeverity("success");
      return;
    }
    if (
      assetLogbookData?.length !== 0 &&
      assetLogbookData !== undefined &&
      assetLogbookData !== null
    ) {
      const assetExists = assetLogbookData?.some(
        (asset) =>
          asset.asset === selectedNode.assetName &&
          asset.assetId === selectedNode.id
      );
      if (assetExists) {
        setSnackbarOpen(true);
        setSnackbarText("Asset already added");
        setsnackbarSeverity("error");
        return;
      }
    }

    const logbookExists = assetLogbookData.some(
      (asset) =>
        asset.logbook ===
        (selectedLogbooks === undefined ? "" : selectedLogbooks)
    );
    if (logbookExists) {
      setAssetLogbookData([...assetLogbookData, newAssetLogbook]);

      setSnackbarOpen(true);
      setSnackbarText("Added successfully");
      setsnackbarSeverity("success");
    } else {
      setSnackbarOpen(true);
      setSnackbarText("Logbook should be same");
      setsnackbarSeverity("error");
    }
    console.log("AssetLogbook : ", newAssetLogbook);
  };
  const renderHeader = () => {
    return (
      <div className="table-header">
        {/* <h5 className="mx-0 my-1">Manage Groups</h5> */}
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            onInput={(e) => setGlobalFilter(e.target.value)}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };
  const header = renderHeader();
  const addNode = () => {
    if (
      activityName === "" ||
      activityName === undefined ||
      activityName === null
    ) {
      setSnackbarOpen(true);
      setSnackbarText("Activity Name Should Not be Empty !");
      setsnackbarSeverity("error");
      return;
    }

    // if (assetLogbookData?.length === 0) {
    //   setSnackbarOpen(true);
    //   setSnackbarText("Please add atleast one Asset !");
    //   setsnackbarSeverity("error");
    //   return;
    // }
    const duration = hours * 60 + minutes;
    if (duration === 0) {
      setSnackbarOpen(true);
      setSnackbarText("Duration can't be Zero (0) ");
      setsnackbarSeverity("error");
      return;
    }
    // if (
    //   activityAbbr === "" ||
    //   activityAbbr === undefined ||
    //   selectedReviwer === null
    // ) {
    //   setSnackbarOpen(true);
    //   setSnackbarText("Activity Abbreviation should not be empty !");
    //   setsnackbarSeverity("error");
    //   return;
    // }

    console.log("AllISWEll : ", taskDetails);

    let activityId = "";

    if (
      activityList.activityId !== null &&
      activityList.activityId !== undefined
    ) {
      console.log("DB activity ID : ", activityList.activityId);
      activityId = activityList.activityId;
    } else {
      activityId = generateActivityId();
      console.log("Auto Generate activity ID : ", activityId);
    }

    if (activityName?.trim() && activityId?.trim()) {
      const newNode = {
        id: activityId,
        data: { label: activityName, sequence: 1 },
        position: { x: Math.random() * 400, y: Math.random() * 400 },
      };

      setNodes((nds) => [...nds, newNode]);

      console.log("Object : ", assetLogbookData);
      const assets =
        assetLogbookData.length !== 0
          ? assetLogbookData.map((asset) => asset.asset).join(",")
          : "";
      console.log("Assets : ", assets);
      const assetIds =
        assetLogbookData.length !== 0
          ? assetLogbookData.map((asset) => asset.assetId).join(",")
          : "";
      console.log("Assets ID : ", assetIds);
      const activityLogbook =
        assetLogbookData?.length > 0 ? assetLogbookData[0].logbook : "";
      console.log("logbook : ", activityLogbook);

      const withoutAssetactivityGroup =
        withoutAssetLogbookData?.length > 0
          ? withoutAssetLogbookData[0]?.groups
          : "";
      console.log("withou asset Groups : ", withoutAssetactivityGroup);

      const withoutAssetactivityLogbook =
        withoutAssetLogbookData?.length > 0
          ? withoutAssetLogbookData[0]?.logbook
          : "";
      console.log("withou asset logbook : ", withoutAssetactivityLogbook);

      const newActivity = {
        taskId: taskDetails.taskId,
        activityAbrv: activityAbbr,
        activityId: newNode.id,
        activityName: newNode.data.label,
        xPos: newNode.position.x,
        yPos: newNode.position.y,
        sequence: newNode.data.sequence,
        assetName: assets,
        assetId: assetIds,
        logbook:
          activityLogbook === null ||
          activityLogbook === undefined ||
          activityLogbook === ""
            ? withoutAssetactivityLogbook
            : activityLogbook,
        enforce: checked,
        buffer: buffer,
        duration: duration,
        minutes: minutes,
        hours: hours,
        assetLogbookData: assetLogbookData,
        withouAssetLogbookData: withoutAssetLogbookData,
        userDept: activityDepartment,
        userGroup:
          activityGroups.length === 0
            ? withoutAssetactivityGroup
            : activityGroups.join(),
        tenantId: getTenantID(),
        creationTime: new Date(),
      };
      console.log("Ashok : ", newActivity);
      // setTaskDetails({...taskDetails,taskDetails.activityList:newActivity);
      setTaskDetails({
        ...taskDetails,
        activityList: [...taskDetails.activityList, newActivity], // Assuming activityList is an array
      });
      setActivityList([...activityList, newActivity]);
      // setActivityAbbr();
      // setActivityName();
    }
    setActivityAbbr("");
    setActivityName("");
    setHours(0);
    setMinutes(0);
    setBuffer(0);
    setAssetLogbookData([]);
    setWithoutAssetLogbookData([]);
    setSelectedLogbooks("");
  };
  const checkConnections = () => {
    if (nodes.length === 1) {
      console.log("No need to check");
      return true;
    }

    const visited = new Set();
    const queue = [nodes[0].id];

    while (queue.length > 0) {
      const currentNodeId = queue.shift();
      if (!visited.has(currentNodeId)) {
        visited.add(currentNodeId);
        edges.forEach((edge) => {
          if (edge.source === currentNodeId && !visited.has(edge.target)) {
            queue.push(edge.target);
          } else if (
            edge.target === currentNodeId &&
            !visited.has(edge.source)
          ) {
            queue.push(edge.source);
          }
        });
      }
    }

    if (visited.size === nodes.length) {
      console.log("All nodes are connected");
      return true;
    } else {
      console.log("All nodes should be connected with any node");
      return false;
    }
  };

  const onNodeClick = (event, node) => {
    setActivityName(node.data.label);
    setSelectedNodeId(node.id);
    console.log(`Node clicked: ${node.id}, Name: ${node.data.label}`);
    const foundActivity = activityList.find(
      (activity) => activity.activityId === node.id
    );
    console.log("Activity Founded : ", foundActivity);
    if (foundActivity) {
      setActivityAbbr(foundActivity.activityAbrv);
      setActivityName(foundActivity.activityName);

      console.log("Duartion Test : ", foundActivity.duration);
      setMinutes(foundActivity.duration % 60);
      setBuffer(foundActivity.buffer);
      setHours(Math.floor(foundActivity.duration / 60));
      setDlgVisible(true);
      setButtonShow(false);

      if (
        foundActivity.assetLogbookData !== null &&
        foundActivity.assetLogbookData !== undefined
      ) {
        setAssetLogbookData(foundActivity.assetLogbookData);
      } else {
        const assetLogbookData = foundActivity
          ? foundActivity.assetIDList.map((assetId, index) => ({
              assetId: assetId,
              logbook: foundActivity.logbook,
              asset: foundActivity.assetNameList[index],
              groups: [foundActivity.userGroup],
              department: foundActivity.userDept,
            }))
          : [];

        if (assetLogbookData.length > 0) {
          // console.log(" first if ", assetLogbookData);
          if (assetLogbookData[0].assetId !== "") {
            // console.log("Inside If : ", assetLogbookData);

            setAssetLogbookData(assetLogbookData);
          } else {
            // console.log("Inside if else");
            setAssetLogbookData([]);
          }
        } else {
          // console.log("Inside Else: ", assetLogbookData);
          setAssetLogbookData(assetLogbookData);
        }
      }

      // if (
      //   foundActivity.withouAssetLogbookData !== null &&
      //   foundActivity.withouAssetLogbookData !== undefined
      // ) {
      //   setWithoutAssetLogbookData(foundActivity.withouAssetLogbookData);
      // } else {
      //   let WithoutAssetLogbookData = [];
      //    WithoutAssetLogbookData = activityList.map((activity) => ({
      //     groups: activity.userGroup,
      //     logbook: activity.logbook,
      //   }));

      //   if (WithoutAssetLogbookData.length > 0) {
      //     // console.log(" first if ", assetLogbookData);
      //     if (assetLogbookData[0].assetId !== "") {
      //       // console.log("Inside If : ", assetLogbookData);

      //       setAssetLogbookData(assetLogbookData);
      //     } else {
      //       // console.log("Inside if else");
      //       setAssetLogbookData([]);
      //     }
      //   } else {
      //     // console.log("Inside Else: ", assetLogbookData);
      //     setAssetLogbookData(assetLogbookData);
      //   }
      // }
    }
  };

  const updateNodeName = () => {
    if (selectedNodeId) {
      let tempNode = null;
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNodeId) {
            tempNode = node;
            return { ...node, data: { ...node.data, label: activityName } };
          } else {
            return node;
          }
        })
      );
      console.log("Temp Node : ", tempNode);
      const assets =
        assetLogbookData.length !== 0
          ? assetLogbookData.map((asset) => asset.asset).join(",")
          : "";
      console.log("Assets : ", assets);
      const assetIds =
        assetLogbookData.length !== 0
          ? assetLogbookData.map((asset) => asset.assetId).join(",")
          : "";
      console.log("Assets ID : ", assetIds);
      const activityLogbook =
        assetLogbookData?.length > 0 ? assetLogbookData[0].logbook : "";
      console.log("logbook : ", activityLogbook);
      const duration = hours + minutes + buffer;
      const updatedActivity = {
        taskId: taskDetails.taskId,
        activityAbrv: activityAbbr,
        activityId: selectedNodeId,
        activityName: activityName,
        xPos: tempNode !== null ? tempNode.position.x : 0,
        yPos: tempNode !== null ? tempNode.position.y : 0,
        sequence: tempNode !== null ? tempNode.data.sequence : 1,
        assetName: assets,
        assetId: assetIds,
        logbook: activityLogbook,
        enforce: checked,
        buffer: buffer,
        duration: duration,
        minutes: minutes,
        hours: hours,
        assetLogbookData: assetLogbookData,
        userDept: activityDepartment,
        userGroup: activityGroups.join(),
        tenantId: getTenantID(),
        creationTime: new Date(),
      };

      const updatedActivityList = activityList.map((activity) => {
        if (activity.activityId === selectedNodeId) {
          return { ...activity, ...updatedActivity };
        }
        return activity;
      });

      console.log("updated Act : ", updatedActivityList);
      setActivityList(updatedActivityList);
      handleOnCancelClick();
    }
  };

  const handleSaveForApproval = async () => {
    const updatedData = { ...taskDetails, status: "Pending" };
    console.log("status chnage : ", updatedData);

    const apiStatus = await handleSaveTask(updatedData);
    if (
      apiStatus !== null &&
      apiStatus !== undefined &&
      apiStatus !== "" &&
      apiStatus === 200
    ) {
      // setTaskDetails({ ...taskDetails, status: "Pending" });
      setSnackbarOpen(true);
      setSnackbarText("Approval Sented Successfully");
      setsnackbarSeverity("success");

      setTaskDetails();
      setActivityList();
      setShowCreation(false);
    } else {
      setSnackbarOpen(true);
      setSnackbarText("Databas Error !");
      setsnackbarSeverity("error");
    }
  };

  const handleOnCancelClick = () => {
    setActivityAbbr("");
    setActivityName("");
    setHours(0);
    setMinutes(0);
    setBuffer(0);
    setAssetLogbookData([]);
    setSelectedLogbooks("");
    setChecked();
    setButtonShow(true);
  };
  const actionTemplate = (rowData) => {
    return (
      <Button
        icon="pi pi-trash"
        className="p-button-danger"
        onClick={() => {
          //console.log("Suraj ", rowData.Id);
          setAssetId(rowData.assetId);
          setDelOpen(true);
        }}
      />
    );
  };
  const formGroupStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",
  };

  const labelStyle = {
    marginRight: "2rem",
    width: "150px", // adjust this width as needed
  };

  const formWrapperStyle = {
    display: "flex",
    justifyContent: "center",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };
  const handleTabChange = (e) => {
    console.log("Tab is Change");
    setActiveIndex(e.index);
  };

  const handleWithoutAssetAddAssetLogbookClick = () => {
    if (!withoutAssetselectedGroups) {
      setSnackbarOpen(true);
      setSnackbarText("Please selcet a group !");
      setsnackbarSeverity("error");
      return;
    }

    if (withoutAssetselectedGroups) {
      const newData = {
        groups: withoutAssetselectedGroups?.groupName,
        logbook: withoutAssetSelectedLogbooks,
      };

      if (withoutAssetLogbookData?.length === 0) {
        setWithoutAssetLogbookData([...withoutAssetLogbookData, newData]);

        setSnackbarOpen(true);
        setSnackbarText("added successfully !");
        setsnackbarSeverity("success");
        setWithoutAssetSelectedGroups(null);
        setWithoutAssetSelectedLogbooks("");
        return;
      }

      const groupExists = withoutAssetLogbookData.some(
        (asset) =>
          asset?.groups ===
          (withoutAssetselectedGroups?.groupName === undefined ||
          withoutAssetselectedGroups?.groupName === null
            ? ""
            : withoutAssetselectedGroups?.groupName)
      );

      if (groupExists) {
        setSnackbarOpen(true);
        setSnackbarText("Group should  not be same");
        setsnackbarSeverity("error");
        return;
      }

      const logbookExists = withoutAssetLogbookData.some(
        (asset) =>
          asset?.logbook ===
          (withoutAssetSelectedLogbooks === undefined ||
          withoutAssetSelectedLogbooks === null
            ? ""
            : withoutAssetSelectedLogbooks)
      );

      if (logbookExists) {
        setWithoutAssetLogbookData([...withoutAssetLogbookData, newData]);

        setSnackbarOpen(true);
        setSnackbarText("added successfully !");
        setsnackbarSeverity("success");
        setWithoutAssetSelectedGroups(null);
        setWithoutAssetSelectedLogbooks("");
      } else {
        setSnackbarOpen(true);
        setSnackbarText("Logbook should be same");
        setsnackbarSeverity("error");
        return;
      }

      setWithoutAssetLogbookData([...withoutAssetLogbookData, newData]);
      setSnackbarOpen(true);
      setSnackbarText("added successfully !");
      setsnackbarSeverity("success");
      setWithoutAssetSelectedGroups(null);
      setWithoutAssetSelectedLogbooks("");
    }
  };

  // Function to handle deleting a logbook
  const handleDelete = (rowData) => {
    setWithoutAssetLogbookData(
      withoutAssetLogbookData.filter((item) => item !== rowData)
    );
  };

  // Action template for the delete button
  const withoutAssetActionTemplate = (rowData) => {
    return (
      <Button
        icon="pi pi-trash"
        className="p-button-danger"
        onClick={() => handleDelete(rowData)}
      />
    );
  };
  return (
    <>
      {showCreation ? (
        <>
          <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
            <div
              style={{
                background: "white",
                marginLeft: "4%",
                borderRadius: "1rem",
                boxShadow:
                  "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
              }}
            >
              <Card>
                <div>
                  <div
                    style={{
                      padding: "0.4rem 0.7rem",
                      display: "flex",
                      alignItems: "center",
                      columnGap: "0.3rem",
                    }}
                  >
                    <IconButton
                      color="info"
                      aria-label="home"
                      onClick={() => {
                        setShowCreation(false);
                      }}
                    >
                      <HomeIcon />
                    </IconButton>

                    <Typography sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                      {dbTaskDetails ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            columnGap: "0.6rem",
                          }}
                        >
                          <Typography>Edit Task </Typography>
                          <Chip label={dbTaskDetails.taskName} />
                        </div>
                      ) : (
                        "Create Task"
                      )}
                    </Typography>
                  </div>
                  <Divider />
                  <Stepper
                    ref={stepperRef}
                    style={{ flexBasis: "50rem" }}
                    linear
                    className="forBorderRadius"
                  >
                    <StepperPanel header="Task Creation">
                      <div
                        //  className="flex flex-column h-12rem"
                        style={{ height: "63vh" }}
                      >
                        {/* <center> */}
                        {/* <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium"> */}
                        <div style={formWrapperStyle}>
                          <form style={formStyle}>
                            <div style={formGroupStyle}>
                              <label htmlFor="task-name" style={labelStyle}>
                                Task Name
                              </label>
                              <TextField
                                id="task-name"
                                label="Task Name"
                                variant="outlined"
                                disabled={isTaskNameMatched}
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                              />
                            </div>
                            <div style={formGroupStyle}>
                              <label
                                htmlFor="asset-group-dropdown"
                                style={labelStyle}
                              >
                                Select an Asset Group
                              </label>
                              <Dropdown
                                id="asset-group-dropdown"
                                value={selectedAssetGroup}
                                onChange={(e) => setSelectedAssetGroup(e.value)}
                                options={assetGroups}
                                showClear
                                filter
                                variant="filled"
                                placeholder="Select an Asset Group"
                                className="w-full md:w-14rem"
                              />
                            </div>
                            <div style={formGroupStyle}>
                              <label
                                htmlFor="reviewer-dropdown"
                                style={labelStyle}
                              >
                                Select a Reviewer
                              </label>
                              <Dropdown
                                id="reviewer-dropdown"
                                value={selectedReviwer}
                                onChange={(e) => setSelectedReviwer(e.value)}
                                options={reviewOptions}
                                showClear
                                filter
                                variant="filled"
                                placeholder="Select a Reviewer"
                                className="w-full md:w-14rem"
                              />
                            </div>
                            <div style={formGroupStyle}>
                              <label htmlFor="description" style={labelStyle}>
                                Description
                              </label>
                              <TextField
                                id="description"
                                label="Description"
                                multiline
                                maxRows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                              />
                            </div>
                          </form>
                        </div>
                        {/* </center> */}
                        {/* </div> */}
                      </div>
                      <div className="flex pt-4 justify-content-end">
                        <Button
                          label="Save as Draft & Proceed"
                          icon="pi pi-arrow-right"
                          iconPos="right"
                          rounded
                          onClick={handleSaveDraftTask}
                        />
                      </div>
                    </StepperPanel>
                    <StepperPanel header="Activity">
                      <div>
                        <div
                          // className="flex flex-column h-12rem"
                          style={{ height: "62vh", backgroundColor: "#F8F8F8" }}
                        >
                          {/* <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium"> */}
                          <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            snapToGrid
                            onReconnect={onReconnect}
                            onReconnectStart={onReconnectStart}
                            onReconnectEnd={onReconnectEnd}
                            onConnect={onConnect}
                            onNodeClick={onNodeClick}
                            fitView
                            attributionPosition="top-right"
                          >
                            <Controls />
                            <MiniMap />
                            <Background />
                          </ReactFlow>
                          {/* </div> */}
                        </div>
                        <div>
                          <Fab
                            color="primary"
                            aria-label="add"
                            //className="fab-animation"
                            style={{
                              position: "fixed",
                              bottom: "15%",
                              right: 16,
                              animation: "fadeIn 0.5s ease-in-out",
                            }}
                            onClick={() => setDlgVisible(true)}
                          >
                            <AddIcon />
                          </Fab>
                        </div>
                      </div>
                      <div className="flex pt-4 justify-content-between">
                        <Button
                          label="Back"
                          severity="secondary"
                          icon="pi pi-arrow-left"
                          onClick={() => stepperRef.current.prevCallback()}
                        />
                        <Button
                          label="Save and Proceed"
                          icon="pi pi-arrow-right"
                          iconPos="right"
                          onClick={handleSaveDraftActivity}
                          //onClick={() => stepperRef.current.nextCallback()}
                        />
                      </div>
                    </StepperPanel>
                    <StepperPanel header="Confirm">
                      <div
                      //  className="flex flex-column h-12rem"
                      // style={{ height: "65vh" }}
                      >
                        <Container maxWidth="lg" sx={{}}>
                          <PrimeCard>
                            <Grid
                              container
                              style={{
                                marginTop: "0",
                              }}
                              sx={{ mt: 1 }}
                              spacing={2}
                            >
                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb",
                                  padding: "0.5rem",
                                }}
                                xs={6}
                              >
                                <Typography sx={{ ml: 7 }}>
                                  Task Name
                                </Typography>
                              </Grid>
                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb",
                                  padding: "0.5rem",
                                }}
                                xs={6}
                              >
                                <Typography>
                                  {taskDetails ? taskDetails.taskName : ""}
                                </Typography>
                              </Grid>

                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb",
                                  padding: "0.5rem",
                                }}
                                xs={6}
                              >
                                <Typography sx={{ ml: 7 }}>
                                  Description
                                </Typography>
                              </Grid>

                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb",
                                  padding: "0.5rem",
                                }}
                                xs={6}
                              >
                                <Typography>
                                  {taskDetails ? taskDetails.description : ""}
                                </Typography>
                              </Grid>

                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb",
                                  padding: "0.5rem",
                                }}
                                xs={6}
                              >
                                <Typography sx={{ ml: 7 }}>Approver</Typography>
                              </Grid>

                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb",
                                  padding: "0.5rem",
                                }}
                                xs={6}
                              >
                                <Typography>
                                  {taskDetails ? taskDetails.reviewer : ""}
                                </Typography>
                              </Grid>
                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb",
                                  padding: "0.5rem",
                                }}
                                xs={6}
                              >
                                <Typography sx={{ ml: 7 }}>
                                  Asset Group
                                </Typography>
                              </Grid>

                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb",
                                  padding: "0.5rem",
                                }}
                                xs={6}
                              >
                                <Typography>
                                  {taskDetails ? taskDetails.assetGroup : ""}
                                </Typography>
                              </Grid>

                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb",
                                  padding: "0.5rem",
                                }}
                                xs={6}
                              >
                                <Typography sx={{ ml: 7 }}>
                                  Total Duration
                                </Typography>
                              </Grid>

                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb",
                                  padding: "0.5rem",
                                }}
                                xs={6}
                              >
                                {/* const totalDuration = 
                                activityList.reduce((accumulator, activity) 
                                => accumulator + activity.duration, 0) */}

                                <Typography>
                                  {taskDetails
                                    ? taskDetails.activityList.reduce(
                                        (total, activity) =>
                                          (total += activity.duration),
                                        0
                                      )
                                    : ""}
                                </Typography>
                              </Grid>
                            </Grid>
                          </PrimeCard>
                          <div>
                            <PrimeCard>
                              <DataTable
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                removableSort
                                // tableStyle={{ minWidth: "50rem" }}
                                value={activityList}
                                header={header}
                                globalFilter={globalFilter}
                              >
                                <Column
                                  field="sequence"
                                  header="Order"
                                  sortable
                                  // style={{ width: "25%" }}
                                />
                                <Column
                                  field="activityName"
                                  header="Activity Name"
                                  sortable
                                  //style={{ width: "25%" }}
                                />
                                <Column
                                  field="activityAbrv"
                                  header="Activity Abrv"
                                  sortable
                                  //style={{ width: "25%" }}
                                />
                                <Column
                                  field="logbook"
                                  header="Logbook"
                                  // body={groupIdTemplate}
                                  sortable
                                  // style={{ width: "25%" }}
                                />

                                <Column
                                  field="duration"
                                  header="Duration"
                                  sortable
                                  //style={{ width: "25%" }}
                                />

                                <Column
                                  field="assetName"
                                  header="Asset Name"
                                  sortable
                                  //style={{ width: "25%" }}
                                />
                              </DataTable>
                            </PrimeCard>
                          </div>
                        </Container>
                      </div>
                      <div className="flex pt-4 justify-content-between">
                        <Button
                          label="Back"
                          severity="secondary"
                          icon="pi pi-arrow-left"
                          onClick={() => stepperRef.current.prevCallback()}
                        />
                        <Button
                          label="Send for Approval"
                          icon="pi pi-arrow-right"
                          iconPos="right"
                          onClick={handleSaveForApproval}
                          //onClick={() => stepperRef.current.nextCallback()}
                        />
                      </div>
                    </StepperPanel>
                  </Stepper>

                  {/* <Dialog
                header="Activity Creation"
                visible={dlgVisible}
                maximizable
                style={{ width: "50vw" }}
                onHide={() => {
                  if (!dlgVisible) return;
                  setDlgVisible(false);
                }}
              > */}
                  <Sidebar
                    header={"Activity Creation For : " + taskName}
                    visible={dlgVisible}
                    position="right"
                    onHide={() => {
                      if (!dlgVisible) return;
                      setDlgVisible(false);
                    }}
                  >
                    <center>
                      <div>
                        <br></br>
                        <TextField
                          id="outlined-basic"
                          label="Activity Name"
                          variant="outlined"
                          value={activityName}
                          onChange={(e) => setActivityName(e.target.value)}
                        />
                        <br></br>
                        <br></br>
                        <TextField
                          id="outlined-basic"
                          label="Activity Abbreviation"
                          variant="outlined"
                          value={activityAbbr}
                          onChange={(e) => setActivityAbbr(e.target.value)}
                        />
                        <br></br>
                        <br></br>
                        <Button
                          label="Add Logbook & Asset"
                          text
                          raised
                          //onClick={() => setAssetDlg(true)}
                          onClick={handleAddAssetClick}
                        />
                        <br></br>
                        <br></br>
                        <div>
                          {assetLogbookData?.length !== 0 && (
                            <DataTable
                              value={assetLogbookData}
                              header={"Existing Assets and Logbooks"}
                            >
                              <Column
                                field="asset"
                                header="Asset"
                                sortable
                                // style={{ width: "25%" }}
                              />
                              <Column
                                field="logbook"
                                header="Logbook"
                                // body={groupIdTemplate}
                                sortable
                                // style={{ width: "25%" }}
                              />
                            </DataTable>
                          )}
                          {withoutAssetLogbookData?.length !== 0 && (
                            <DataTable
                              value={withoutAssetLogbookData}
                              header={"Existing Assets and Logbooks"}
                            >
                              <Column
                                field="groups"
                                header="Group"
                                sortable
                                // style={{ width: "25%" }}
                              />
                              <Column
                                field="logbook"
                                header="Logbook"
                                // body={groupIdTemplate}
                                sortable
                                // style={{ width: "25%" }}
                              />
                            </DataTable>
                          )}
                        </div>
                        <br></br>
                        <br></br>
                        <div className="flex-auto">
                          <label
                            htmlFor="minmax-buttons"
                            className="font-bold block mb-2"
                          >
                            Set Hours
                          </label>
                          <InputNumber
                            inputId="minmax-buttons"
                            value={hours}
                            onValueChange={(e) => setHours(e.value)}
                            mode="decimal"
                            showButtons
                            min={0}
                            max={8760}
                          />
                          <br></br>
                          <br></br>
                          <label
                            htmlFor="minmax-buttons"
                            className="font-bold block mb-2"
                          >
                            Set Minutes
                          </label>
                          <InputNumber
                            inputId="minmax-buttons"
                            value={minutes}
                            onValueChange={(e) => {
                              const newValue = e.value;
                              if (newValue > 59) {
                                setMinutes(59);
                              } else if (newValue < 1) {
                                setMinutes(0);
                              } else {
                                setMinutes(newValue);
                              }
                            }}
                            mode="decimal"
                            showButtons
                            min={0}
                            max={59}
                          />
                          <br></br>
                          <br></br>
                          <label
                            htmlFor="minmax-buttons"
                            className="font-bold block mb-2"
                          >
                            Buffer
                          </label>
                          <InputNumber
                            inputId="minmax-buttons"
                            value={buffer}
                            onValueChange={(e) => setBuffer(e.value)}
                            mode="decimal"
                            showButtons
                            min={0}
                            max={100}
                          />
                        </div>
                        <br></br>
                        <ToggleButton
                          onLabel="Yes"
                          offLabel="No"
                          onIcon="pi pi-check"
                          offIcon="pi pi-times"
                          checked={checked}
                          onChange={(e) => setChecked(e.value)}
                          className="w-9rem"
                        />
                        <br></br>
                        <br></br>
                        {buttonShow ? (
                          <Button
                            label="Add Activity"
                            icon="pi pi-check"
                            severity="success"
                            onClick={addNode}
                          />
                        ) : (
                          <div>
                            <Button
                              label="Update"
                              icon="pi pi-file-edit"
                              severity="info"
                              onClick={updateNodeName}
                            ></Button>
                            <Button
                              label="Cancel"
                              icon="pi pi-times"
                              severity="help"
                              onClick={handleOnCancelClick}
                            ></Button>
                            <Button
                              label="Delete"
                              icon="pi pi-trash"
                              severity="warning"
                              // onClick={updateNodeName}
                            ></Button>
                          </div>
                        )}
                      </div>
                    </center>
                    {/* </Dialog> */}
                  </Sidebar>
                  <Dialog
                    header={"Add Logbook & Asset for : " + activityName}
                    visible={assetDlg}
                    maximizable
                    style={{ width: "50vw" }}
                    onHide={() => {
                      if (!assetDlg) return;
                      setAssetDlg(false);
                      setSelectedGroups("");
                    }}
                  >
                    <div>
                      <Divider sx={{ marginBottom: "0.6rem", opacity: 0.8 }} />

                      <PrimeCard>
                        <TabView
                          activeIndex={activeIndex}
                          onTabChange={handleTabChange}
                        >
                          <TabPanel header="With Asset">
                            <div>
                              {" "}
                              <PrimeCard
                                // title="Advanced Card"
                                subTitle="Asset Tree"
                                // className="md:w-24rem"
                              >
                                {treeData !== null && (
                                  <CustomTreeView
                                    data={treeData}
                                    renderTree={renderTree}
                                    handleNodeClick={handleNodeClick}
                                    handleContextMenu={handleContextMenu}
                                  />
                                )}
                              </PrimeCard>
                              <br></br>
                              <PrimeCard
                              //   className="md:w-24rem"
                              >
                                <div>
                                  <Dropdown
                                    //emptyMessage=""
                                    value={selectedGroups}
                                    onChange={(e) => setSelectedGroups(e.value)}
                                    options={groupList}
                                    // disabled={loading}
                                    // optionLabel="name"
                                    display="chip"
                                    filter
                                    showClear
                                    variant="filled"
                                    placeholder="Select a Group"
                                    className="w-full md:w-25rem"
                                  />
                                  <br></br>
                                  <br></br>
                                  <div
                                    className="Test1"
                                    style={{ display: "inline-flex" }}
                                  >
                                    <Dropdown
                                      //emptyMessage=""
                                      value={selectedLogbooks}
                                      onChange={(e) =>
                                        setSelectedLogbooks(e.value)
                                      }
                                      options={logbookOptions}
                                      disabled={loading}
                                      // optionLabel="name"
                                      display="chip"
                                      filter
                                      showClear
                                      variant="filled"
                                      placeholder="Select a Logbook"
                                      className="w-full md:w-25rem"
                                    />
                                    {!loading ? <></> : <CircularProgress />}
                                  </div>
                                  <br></br>
                                  <br></br>
                                  <Button
                                    label="ADD"
                                    icon="pi pi-plus"
                                    onClick={handleAddAssetLogbookClick}
                                  />
                                </div>
                              </PrimeCard>
                              <br></br>
                              <DataTable
                                removableSort
                                // tableStyle={{ minWidth: "50rem" }}
                                value={assetLogbookData}
                                header={header}
                                globalFilter={globalFilter}
                              >
                                <Column
                                  field="asset"
                                  header="Asset"
                                  sortable
                                  // style={{ width: "25%" }}
                                />
                                <Column
                                  field="logbook"
                                  header="Logbook"
                                  // body={groupIdTemplate}
                                  sortable
                                  // style={{ width: "25%" }}
                                />
                                <Column
                                  field="groups"
                                  header="Group"
                                  sortable
                                  //style={{ width: "25%" }}
                                />
                                {/* <Column
                                  field="department"
                                  header="Department"
                                  sortable
                                  //style={{ width: "25%" }}
                                /> */}
                                <Column
                                  field="Action"
                                  header="Action"
                                  body={actionTemplate}
                                />
                              </DataTable>
                            </div>
                          </TabPanel>

                          <TabPanel header="Without Asset">
                            <div>
                              {" "}
                              <PrimeCard
                              //   className="md:w-24rem"
                              >
                                <div>
                                  {/* <Dropdown
                                    //emptyMessage=""
                                    value={selectedDept}
                                    onChange={(e) => setSelectedDept(e.value)}
                                    options={departmentList}
                                    // disabled={loading}
                                    // optionLabel="name"
                                    display="chip"
                                    filter
                                    showClear
                                    variant="filled"
                                    placeholder="Select a Department"
                                    className="w-full md:w-25rem"
                                  />
                                  <br></br>
                                  <br></br> */}
                                  <Dropdown
                                    //emptyMessage=""
                                    value={withoutAssetselectedGroups}
                                    onChange={(e) =>
                                      setWithoutAssetSelectedGroups(e.value)
                                    }
                                    options={withoutAssetGroupList}
                                    // disabled={loading}
                                    optionLabel="groupName"
                                    display="chip"
                                    filter
                                    showClear
                                    variant="filled"
                                    placeholder="Select a Group"
                                    className="w-full md:w-25rem"
                                  />
                                  <br></br>
                                  <br></br>
                                  <div
                                    className="Test1"
                                    style={{ display: "inline-flex" }}
                                  >
                                    <Dropdown
                                      value={withoutAssetSelectedLogbooks}
                                      onChange={(e) =>
                                        setWithoutAssetSelectedLogbooks(e.value)
                                      }
                                      options={withoutAssetLogbookOptions}
                                      disabled={loading}
                                      display="chip"
                                      filter
                                      showClear
                                      variant="filled"
                                      placeholder="Select a Logbook"
                                      className="w-full md:w-25rem"
                                    />
                                    {!loading ? <></> : <CircularProgress />}
                                  </div>
                                  <br></br>
                                  <br></br>
                                  <Button
                                    label="ADD"
                                    icon="pi pi-plus"
                                    onClick={
                                      handleWithoutAssetAddAssetLogbookClick
                                    }
                                  />
                                </div>
                              </PrimeCard>
                              <br></br>
                              <DataTable
                                removableSort
                                value={withoutAssetLogbookData}
                                header="Your Table Header"
                                globalFilter={null}
                              >
                                <Column
                                  field="groups"
                                  header="Group"
                                  sortable
                                />
                                <Column
                                  field="logbook"
                                  header="Logbook"
                                  sortable
                                />
                                <Column
                                  field="Action"
                                  header="Action"
                                  body={withoutAssetActionTemplate}
                                />
                              </DataTable>
                            </div>
                          </TabPanel>
                        </TabView>
                      </PrimeCard>
                    </div>
                  </Dialog>
                  <SnackbarComponent
                    openPopup={snackbarOpen}
                    setOpenPopup={setSnackbarOpen}
                    dialogMessage={snackbarText}
                    snackbarSeverity={snackbarSeverity}
                  ></SnackbarComponent>
                  <CustomDialog
                    open={delOpen}
                    setOpen={setDelOpen}
                    proceedButtonText={"YES"}
                    proceedButtonClick={deleteGroup}
                    cancelButtonText={"NO"}
                  ></CustomDialog>
                </div>
              </Card>
            </div>
          </Container>
        </>
      ) : (
        <>
          <TaskMaster></TaskMaster>
        </>
      )}
    </>
  );
}
