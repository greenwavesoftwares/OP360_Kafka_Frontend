// import { Dialog } from "primereact/dialog";
// import { Steps } from "primereact/steps";
import { useEffect, useRef, useState } from "react";
// import AddTaskForm from "./AddTaskForm";
// import { AddActivity } from "./AddActivity";
// import { Formik, useFormik } from "formik";
import ActivityDetails from "./ActivityDetails";
import { Dropdown } from "primereact/dropdown";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
// import AddActivityDialog from "./AddActivityDialog";
// import AssetTree from "../components/shared/tree/AssetTree.component";
// import { Toast } from "primereact/toast";
// import { MultiSelect } from "primereact/multiselect";
// import TaskCreation from "./TaskCreation";
import GroupAndDepartment from "./GroupAndDepartment";
// import AddAsset from "./AddAsset";
// import ActivityCreation from "./ActivityCreation";
// import LogbookSelectionDialog from "./LogbookSelectionDialog";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Router, useNavigate, useLocation } from "react-router-dom";
import { InputNumber } from "primereact/inputnumber";
import AssetDialog from "./AssetDialog";
import { ToggleButton } from "primereact/togglebutton";
import {
  Card,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Typography,
  styled,
} from "@mui/material";
import { Tag } from "primereact/tag";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputTextarea } from "primereact/inputtextarea";
import AssetDialogForNewTask from "./AssetDialogForNewTask";
import { Toast } from "primereact/toast";
// import { Panel } from "primereact/panel";
// import { Splitter, SplitterPanel } from "primereact/splitter";
// import { Container, Row, Col } from "react-bootstrap";
import HomeIcon from "@mui/icons-material/Home";
import { decryptTokenId } from "../helper/AuthService";

export default function AddTaskFormDialog(props) {
  const [activeIndex, setActiveIndex] = useState(1);
  const [task, setTask] = useState({
    taskId: "",
  });
  const [selectedDepartmentList, setSelectedDepartmentList] = useState([]);
  const [selectedGroupList, setSelectedGroupList] = useState([]);
  const [assetGroup, setAssetGroup] = useState("");
  const toast = useRef(null);
  const [taskName, setTaskName] = useState("");
  const [reviewer, setReviewer] = useState("");
  const [activityDialogVisible, setActivityDialogVisible] = useState(false);
  const [treeData, setTreeData] = useState({});
  const [selectedNode, setSelectedNode] = useState({});
  const [taskAdded, setTaskAdded] = useState(false);
  const [description, setDescription] = useState("");
  const [logbooks, setLogbooks] = useState([]);
  const [asset, setAsset] = useState({});
  const [selectedLogbook, setSelectedLogbook] = useState("");
  const [logbookDropdownVisible, setLogbookDropdownVisible] = useState(false);
  const [clicked, setClicked] = useState(false);
  // const [groups, setGroups] = useState([]);
  // const [depts, setDepts] = useState([]);
  const [assetGroups, setAssetGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [activity, setActivity] = useState({});
  const [hour, setHour] = useState("");
  const [minutes, setMinutes] = useState("");
  const [activityName, setActivityName] = useState("");
  const [activityId, setActivityId] = useState("");
  const [buffer, setBuffer] = useState("");
  const [enforce, setEnforce] = useState(false);
  const [assetDialogVisible, setAssetDialogVisible] = useState(false);
  const [taskUpdated, setTaskUpdated] = useState(false);
  const [selectedLogbooks, setSelectedLogbooks] = useState("");
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [activities, setActivities] = useState([]);
  const [count, setCount] = useState(0);
  const [activityNodePositions, setActivityNodePositions] = useState([]);
  const [activityConnections, setActivityConnections] = useState([]);
  const [nextButtonClicked, setNextButtonClicked] = useState(false);
  const [connectionSaved, setConnectionSaved] = useState(false);
  const [nodePositionChanged, setNodePositionChanged] = useState(false);
  const [nodePositionsSaved, setNodePositionSaved] = useState(false);
  const [nodeDataCreated, setNodeDataCreated] = useState(false);
  const [editButtonClicked, setEditButtonClicked] = useState(false);
  const [duration, setDuration] = useState(0);
  const [clickedRow, setClickedRow] = useState({});
  const [hourChanged, setHourChanged] = useState(false);
  const [minChanged, setMinChanged] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState({});
  const [activitySelected, setActivitySelected] = useState(false);
  const [assetData, setAssetData] = useState([]);
  const [activityUpdated, setActivityUpdated] = useState(false);
  const [allActivitiesConnected, setAllActivitiesConnected] = useState(false);
  const [taskValid, setTaskValid] = useState(false);
  const [edges, setEdges] = useState([]);
  const [connections, setConnections] = useState([]);
  const [groups, setGroups] = useState("");
  const [department, setDepartment] = useState("");

  const stepperRef = useRef(null);
  const dataRef = useRef(null);

  const location = useLocation();

  useEffect(() => {
    console.log(location);
    // console.log('Current Reviewers : ',location.state.users)

    setUsers(location.state.users.sort());

    // setGroups(location.state.groups);

    // setDepts(location.state.depts);

    setAssetGroups(location.state.assetGroups);

    setTask(location.state.task);
  }, []);

  const confirm1 = (event) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Are you sure you want to proceed?",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
    });
  };

  useEffect(() => {
    setSelectedNode(null);
  }, []);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    let fetchLogbooksByAssetId = async () => {
      let assetName = "";

      if (selectedNode) assetName = selectedNode.assetName + "";

      console.log(assetName);
      setLogbooks("");
      if (selectedNode)
        await fetch(
          "http://localhost:8088/api/logbookbyasset/" +
            selectedNode.id +
            "/" +
            decryptTokenId(localStorage.getItem("tenantId")),
          options
        )
          .then((resp) => resp.json())
          .then((data) => {
            let logbooks = [];

            if (data) logbooks = data.map((ele) => ele.LogbookName);

            // if(logbooks && logbooks.length)
            setLogbooks(logbooks);

            console.log("logbooks", logbooks);

            if (data && data.length) {
              let groups = data[0].groups;

              let department = data[0].department;

              setGroups(groups);
              setDepartment(department);
            }

            // if(data &&  data.logbooksList && data.logbooksList.length === 0)
            // toast.current.show({severity:'error', summary: 'Error', detail:'No logbooks found for this asset', life: 3000});
          });
    };

    fetchLogbooksByAssetId();
  }, [selectedNode]);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    const fetchAssetTreeByAssetGroup = async () => {
      if (assetGroup)
        await fetch(
          "http://localhost:8088/api/assetGroups/" +
            assetGroup.groupId +
            "/" +
            decryptTokenId(localStorage.getItem("tenantId")),
          options
        )
          .then((resp) => resp.json())
          .then((data) => {
            setTreeData(data);

            console.log("tree", data[0]);

            setTreeData(data[0]);
          });
    };

    fetchAssetTreeByAssetGroup();
  }, [assetGroup]);

  const taskDraftHandler = () => {
    // if (task) {

    // alert('task adding');

    // task.taskId =
    //   "T" +
    //   new Date()
    //     .toISOString()
    //     .replace(/-/g, "")
    //     .replace(/:/g, "")
    //     .replace(/\..+/, "");

    //     // setTaskId(task.taskId);

    // task.taskName = taskName;

    // task.reviewer = reviewer.userId;

    // task.description = description;

    // task.userGroupsList = selectedGroupList.map((group) => group.groupId);

    // task.userDeptsList = selectedDepartmentList;

    // task.assetGroup = assetGroup.groupName;

    // task.status = "Not Ready";

    // // ==================FROM CONTEXT====================
    // task.creator = "subhajit.khasnobish@greenwave.co.in";

    let creationTime = new Date();

    creationTime.setHours(creationTime.getHours() + 5);
    creationTime.setMinutes(creationTime.getMinutes() + 30);

    // task.creationTime = creationTime.toISOString();

    let taskId =
      "T" +
      new Date()
        .toISOString()
        .replace(/-/g, "")
        .replace(/:/g, "")
        .replace(/\..+/, "");

    // setTaskId(taskId);

    let groupIdList = selectedGroupList.map((group) => group.groupId);

    let task = {
      taskId: taskId,
      taskName: taskName, // Shorthand property assignment, assuming taskName is defined
      reviewer: reviewer.userId,
      description: description,
      userGroupsList: groupIdList,
      userDeptsList: selectedDepartmentList,
      assetGroup: assetGroup.groupName,
      status: "Not Ready",
      creator: decryptTokenId(localStorage.getItem("username")), // Assign the creator property from context
      creationTime: creationTime,
      tenantId: decryptTokenId(localStorage.getItem("tenantId")),
    };

    setTask(task);

    // }

    console.log(task);

    const taskValidation = validateTask(task);

    if (taskValidation && taskValidation.error === "ERROR") {
      alert(taskValidation.message);

      if (toast && toast.current)
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: taskValidation.message,
          life: 3000,
        });

      return "ERROR";
    }

    if (task) setTask(task);

    console.log(task);

    addTaskHandler(task);
  };

  useEffect(() => {
    console.log(task);
  }, [task]);

  const validateTask = (task) => {
    if (task) {
      if (task.taskName === "") {
        // toast.success('Required');

        return { error: "ERROR", message: "task name is required" };
      }

      if (
        (task.taskName.charCodeAt(0) >= 32 &&
          task.taskName.charCodeAt(0) <= 47) ||
        (task.taskName.charCodeAt(0) >= 58 &&
          task.taskName.charCodeAt(0) <= 64) ||
        (task.taskName.charCodeAt(0) >= 91 && task.taskName.charCodeAt(0) <= 96)
      ) {
        return {
          error: "ERROR",
          message: "task name cannot start with space or any special character",
        };
      }

      if (!task.reviewer) {
        return { error: "ERROR", message: "task reviewer is required" };
      }

      // if (task.userDeptsList && !task.userDeptsList.length) {
      //   return {
      //     error: "ERROR",
      //     message: "task should have at least 1 department",
      //   };
      // }

      // if (!task.assetGroup) {
      //   return { error: "ERROR", message: "task should have an asset group" };
      // }

      // if (task && task.activityList && !task.activityList.length) {
      //   return {
      //     error: "ERROR",
      //     message: "task should have at least 1 activity",
      //   };
      // }
    }
  };

  //   useEffect(() => {
  //     setLogbookDropdownVisible(true);
  //   }, [selectedNode]);

  const addTaskHandler = (task) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(task),
    };

    console.log("options", options);

    const addTask = async () => {
      await fetch("http://localhost:8095/tasks/saveTask", options)
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);

          if (data && data.status_code === 200) {
            // if(toast && toast.current)
            // toast.current.show({severity:'success', summary: 'Success', detail:'Task saved', life: 3000});

            //alert("task added");
            if (toast && toast.current)
              toast.current.show({
                severity: "success",
                //summary: "success",
                detail: "Task added",
                life: 3000,
              });

            setTaskAdded(!taskAdded);

            if (data.payload) setTask(data.payload);

            setTaskUpdated(!taskUpdated);
          } else {
            if (toast && toast.current)
              toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Task already added, if you want to edit go to draft",
                life: 3000,
              });

            return;
          }
        });
    };

    addTask();
  };

  useEffect(() => {
    console.log(task);
  }, [task]);

  const addActivityHandler = () => {
    activity.creationTime = new Date();

    activity.creationTime.setHours(activity.creationTime.getHours() + 5);
    activity.creationTime.setMinutes(activity.creationTime.getMinutes() + 30);

    activity.creationTime = activity.creationTime.toISOString();

    console.log("TASK ID", task);

    console.log(selectedAssets);

    activity.taskId = task ? task.taskId : "";

    activity.activityId =
      "A" +
      new Date()
        .toISOString()
        .replace(/-/g, "")
        .replace(/:/g, "")
        .replace(/\..+/, "");
    activity.activityName = activityName;
    activity.sequence = task && task.noOfActivites ? task.noOfActivites + 1 : 1;

    let logbooks = "";

    // for (let i = 0; i < selectedLogbooks.length; i++) {
    //   if (i === selectedLogbooks.length - 1)
    //     logbooks += selectedLogbooks[i].lookbookname;
    //   else logbooks += selectedLogbooks[i].lookbookname + ",";
    // }

    activity.logbook = selectedLogbook;

    activity.groups = "";

    activity.department = "";

    let assets = "";

    if (selectedAssets) {
      for (let i = 0; i < selectedAssets.length; i++) {
        if (i === selectedAssets.length - 1) {
          assets += selectedAssets[i].assetName;
        } else {
          assets += selectedAssets[i].assetName + ",";
        }
      }
    }

    activity.asset = assets;

    let assetIds = "";

    if (selectedAssets) {
      for (let i = 0; i < selectedAssets.length; i++) {
        if (i === selectedAssets.length - 1) {
          assetIds += selectedAssets[i].assetId;
        } else {
          assetIds += selectedAssets[i].assetId + ",";
        }
      }
    }

    console.log("ASSETIDS", assetIds);

    activity.assetId = assetIds;

    activity.durationMin = hour * 60 + minutes;
    activity.activityAbrv = activityId;
    activity.buffer = buffer;
    activity.enforce = enforce;

    activity.groups = groups;
    activity.department = department;

    activity.tenantId = decryptTokenId(localStorage.getItem("tenantId"));

    const validation = validateActivity(activity);

    if (validation && validation.error === "ERROR") {
      // alert(validation.message);

      if (toast && toast.current)
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: validation.message,
          life: 3000,
        });

      return;
    }

    console.log(activity);

    setActivities(activities.concat(activity));

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(activity),
    };

    console.log(options.body);

    const addActivity = async () => {
      await fetch("http://localhost:8095/tasks/saveActivity", options)
        .then((resp) => resp.json())
        .then((data) => {
          if (data.status_code === 200) {
            setTaskUpdated(!taskUpdated);

            console.log(data);
          } else {
            console.log(data);
          }
        });
    };

    addActivity();

    setCount(0);
    setSelectedAssets([]);
    setSelectedLogbook("");
  };

  const validateActivity = (activity) => {
    if (activity) {
      if (!activity.taskId) {
        return { error: "ERROR", message: "Task is not added" };
      }

      if (activity.activityName === "") {
        return { error: "ERROR", message: "activity name is required" };
      }

      if (task && task.activityList) {
        for (let i = 0; i < task.activityList.length; i++) {
          const actvty = task.activityList[i];

          if (actvty.activityName === activity.activityName) {
            console.log(activity.activityName, activityName);

            return {
              error: "ERROR",
              message: "activity name must not be same",
            };
          }
        }
      }

      if (activity.activityAbrv === "") {
        return { error: "ERROR", message: "activity abriviation is required" };
      }

      if (activity.activityAbrv) {
        if (task && task.activityList) {
          for (let i = 0; i < task.activityList.length; i++) {
            if (task.activityList[i].activityAbrv === activity.activityAbrv)
              return {
                error: "ERROR",
                message: "activity abbreviation must not be same",
              };
          }
        }
      }

      // if (!activity.asset) {
      //   return {
      //     error: "ERROR",
      //     message: "activity must have at least 1 asset",
      //   };
      // }

      if (activity.durationMin === 0) {
        return { error: "ERROR", message: "activity must have duration" };
      }

      if (task && task.activityList) {
        task.activityList.forEach((activity) => {
          if (activityName === activity.activityName)
            return { error: "ERROR", message: "activity must not be same" };
        });
      }
      // if(activity.)
    }
  };

  useEffect(() => {
    const options = {
      //method: "GET",                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          ",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      // body: JSON.stringify(activity),
    };

    const fetchTask = async () => {
      await fetch(
        "http://localhost:8095/tasks/getTaskByTaskId?taskId=" + task.taskId,
        options
      )
        .then((resp) => resp.json())
        .then((data) => {
          console.log("TASK", data);

          if (data.payload) setTask(data.payload);
          else {
            if (useRef) setTask(useRef.current);
          }
        });
    };

    if (task) fetchTask();
  }, [taskAdded, taskUpdated]);

  const navigate = useNavigate();

  const updateTaskHandler = () => {
    setActivities(
      activities.map((activity) => {
        activity.assetName = activity.asset;
        activity.duration = activity.durationMin;

        return activity;
      })
    );

    task.activityList = activities;

    task.status = "Pending";

    const validation = validateTask(task);

    if (validation && validation.error === "ERROR") {
      // alert(validation.message);

      if (toast && toast.current)
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: validation.message,
          life: 3000,
        });

      return;
    }

    try {
      addTaskHandler(task);

      if (toast && toast.current)
        toast.current.show({
          severity: "info",
          summary: "Info",
          detail: "Task sent for approval",
          life: 3000,
        });

      navigate("/workflow/taskmaster");
    } catch (e) {
      console.log(e);
    }
  };

  const addConnections = (connections) => {
    console.log(connections);

    const saveConnections = async () => {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(connections),
      };

      await fetch(
        "http://localhost:8095/tasks/saveAllActivityConnections",
        options
      )
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data.payload);

          setActivityConnections(data.payload);

          if (data.status_code === 200) {
            setConnectionSaved(true);

            setTaskUpdated(!taskUpdated);
          }
        });
    };

    saveConnections();
  };

  //====================commented out for testing====================//

  // useEffect(() => {

  //   console.log(activityNodePositions);

  //   saveNodePositions(activityNodePositions);

  // }, [nodeDataCreated]);

  const saveNodePositions = (nodes) => {
    console.log(nodes);
    console.log(!nodes.length);

    if (nodes && !nodes.length) return;

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(nodes),
    };

    console.log(options.body);

    const saveNodes = async () => {
      await fetch("http://localhost:8095/tasks/saveActivityNodes", options)
        .then((resp) => resp.json())
        .then((data) => {
          console.log("==========DATA ", data);

          setActivityNodePositions(data.payload);

          setNodePositionSaved(data.payload === 200);
        })
        .catch((err) => console.log(err));
    };

    saveNodes();
  };

  console.log(location);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const renderAssets = (row) => {
    console.log(row);

    return row.assetNameList.map((assetName) => (
      <Tag rounded value={assetName} />
    ));
  };

  const renderDeleteButton = (rowData) => {
    return (
      <Button
        type="button"
        icon="pi pi-trash"
        onClick={() => {
          deleteActivityHandler(rowData);
        }}
      />
    );
  };

  const deleteActivityHandler = (activity) => {
    console.log(activity);

    const deleteActivity = async () => {
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      await fetch(
        "http://localhost:8095/tasks/deleteActivity?activityId=" +
          activity.activityId +
          "&taskId=" +
          task.taskId,
        options
      )
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);

          setTaskUpdated(!taskUpdated);
        });
    };

    deleteActivity();
  };

  const renderSaveButton = () => {
    return (
      <Button
        type="button"
        icon="pi pi-check"
        onClick={() => {
          let assetId = "";

          if (activity && activity.assetIDList) {
            for (let i = 0; i < activity.assetIDList.length; i++) {
              if (i === activity.assetIDList.length - 1)
                assetId += activity.assetIDList[i];
              else {
                assetId += activity.assetIDList[i] + ",";
              }
            }
          }

          let asset = "";

          if (activity && activity.assetNameList) {
            for (let i = 0; i < activity.assetNameList.length; i++) {
              if (i === activity.assetNameList.length - 1)
                asset += activity.assetNameList[i];
              else {
                asset += activity.assetNameList[i] + ",";
              }
            }
          }

          if (hourChanged && minChanged) {
            if (activity) activity.duration = hour * 60 + minutes;
          } else if (hourChanged) {
            if (activity) activity.duration = hour * 60;
          } else if (minChanged) {
            if (activity) activity.duration = minutes;
          }

          setHourChanged(false);
          setMinChanged(false);
          setHour(0);
          setMinutes(0);

          const activityDetails = {
            transactionId: "",
            creationTime: activity.creationTime,
            taskId: activity.taskId,
            activityId: activity.activityId,
            activityName: activity.activityName,
            sequence: activity.sequence,
            logbook: activity.logbook,
            asset: asset,
            durationMin: activity.duration,
            activityAbrv: activity.activityAbrv,
            buffer: activity.buffer,
            enforce: activity.enforce,
            assetId: assetId,
          };

          console.log(activityDetails);

          addActivityDetails(activityDetails);

          let nodesData = [];

          nodesData.push({
            taskId: task.taskId,
            activityId: activity.activityId,
            posX: activity.xPos,
            posY: activity.yPos,
          });

          setActivityNodePositions(nodesData);

          setNodeDataCreated(!nodeDataCreated);

          setEditButtonClicked(false);
        }}
      />
    );
  };

  const addActivityDetails = (activity) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(activity),
    };

    const addActivity = async () => {
      await fetch("http://localhost:8095/tasks/saveActivity", options)
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);

          if (data.status_code === 200) {
            setTaskUpdated(!taskUpdated);
          } else {
          }
        });
    };

    addActivity();
  };

  useEffect(() => {
    // const options = {
    //   method: "GET",
    //   headers: { "Content-Type": "application/json" },
    // };

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    const fetchAllActivityConnections = async () => {
      await fetch(
        "http://localhost:8095/tasks/getAllActivityConnectionsByTaskId?taskId=" +
          task.taskId,
        options
      )
        .then((resp) => resp.json())
        .then((data) => {
          setActivityConnections(data.payload);

          console.log(data);

          console.log(data.payload);

          const edges =
            data && data.payload
              ? data.payload.map((activityConnection) => {
                  return {
                    id:
                      "e" +
                      activityConnection.sourceId +
                      "-" +
                      activityConnection.targetId,
                    source: activityConnection.sourceId,
                    target: activityConnection.targetId,
                  };
                })
              : [];

          if (edges && edges.length) {
            setEdges(edges);
          }

          console.log(edges);
        });
    };

    if (task && task.taskId) fetchAllActivityConnections();
  }, [task, taskUpdated]);

  useEffect(() => {
    console.log(activityConnections);

    const saveConnections = async () => {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(activityConnections),
      };

      await fetch(
        "http://localhost:8095/tasks/saveAllActivityConnections",
        options
      )
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data.payload);

          // setActivityConnections(data.payload);

          if (data.status_code === 200) {
            // setConnectionSaved(true);
            // setTaskUpdated(!taskUpdated);
          }
        });
    };

    saveConnections();
  }, [activityConnections]);

  useEffect(() => {
    if (selectedActivity) {
      setActivityName(
        selectedActivity.activityName ? selectedActivity.activityName : ""
      );

      setActivityId(
        selectedActivity.activityAbrv ? selectedActivity.activityAbrv : ""
      );

      if (selectedActivity.assetNameList) {
        if (
          selectedActivity.assetNameList.length === 1 &&
          selectedActivity.assetNameList[0] === ""
        ) {
          setAssetData(null);
        } else {
          setAssetData(
            selectedActivity.assetNameList.map((assetName) => {
              return {
                assetName: assetName,
                logbook: selectedActivity.logbook,
              };
            })
          );
        }
        console.log(assetData);
      }

      let hour = Math.floor(
        selectedActivity.duration ? selectedActivity.duration / 60 : 0
      );

      setHour(hour ? hour : "");

      let mins = selectedActivity.duration ? selectedActivity.duration % 60 : 0;

      setMinutes(mins ? mins : "");

      setBuffer(selectedActivity.buffer);

      setEnforce(selectedActivity.enforce);
    }
  }, [selectedActivity]);

  // const updateActivity = () => {

  //   let assetId = "";

  //   if (selectedActivity && selectedActivity.assetIDList) {
  //     for (let i = 0; i < selectedActivity.assetIDList.length; i++) {
  //       if (i === selectedActivity.assetIDList.length - 1)
  //         assetId += selectedActivity.assetIDList[i];
  //       else {
  //         assetId += selectedActivity.assetIDList[i] + ",";
  //       }
  //     }
  //   }

  //   let asset = "";

  //   if (selectedActivity && selectedActivity.assetNameList) {
  //     for (let i = 0; i < selectedActivity.assetNameList.length; i++) {
  //       if (i === selectedActivity.assetNameList.length - 1)
  //         asset += selectedActivity.assetNameList[i];
  //       else {
  //         asset += selectedActivity.assetNameList[i] + ",";
  //       }
  //     }
  //   }

  //   let durationMin = hour * 60 + minutes;

  //   const activityDetails = {
  //     transactionId: "",
  //     creationTime: selectedActivity.creationTime,
  //     taskId: selectedActivity.taskId,
  //     activityId: selectedActivity.activityId,
  //     activityName: activityName,
  //     sequence: selectedActivity.sequence,
  //     logbook: selectedActivity.logbook,
  //     asset: asset,
  //     durationMin: durationMin,
  //     activityAbrv: activityId,
  //     buffer: buffer,
  //     enforce: enforce,
  //     assetId: assetId,
  //   };

  //   if (!activityName) {
  //     // alert('activity name is required');

  //     if (toast && toast.current)
  //       toast.current.show({
  //         severity: "error",
  //         summary: "Error",
  //         detail: "activity name is required",
  //         life: 3000,
  //       });

  //     return;
  //   }
  //   if (!activityId) {
  //     // alert('activity abbreviation is required');

  //     if (toast && toast.current)
  //       toast.current.show({
  //         severity: "error",
  //         summary: "Error",
  //         detail: "activity abbreviation is required",
  //         life: 3000,
  //       });

  //     return;
  //   }
  //   if (activityDetails && activityDetails.durationMin === 0) {
  //     // alert('activity duration is required');

  //     if (toast && toast.current)
  //       toast.current.show({
  //         severity: "error",
  //         summary: "Error",
  //         detail: "activity duration is required",
  //         life: 3000,
  //       });

  //     return;
  //   }

  //   console.log(activityDetails);

  //   let nodesData = [];

  //   nodesData.push({
  //     taskId: task.taskId,
  //     activityId: selectedActivity.activityId,
  //     posX: selectedActivity.xPos,
  //     posY: selectedActivity.yPos,
  //   });

  //   setSelectedActivity(activityDetails);

  //   const options = {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(activityDetails),
  //   };

  //   const addActivity = async () => {
  //     await fetch("http://localhost:8084/tasks/saveActivity", options)
  //       .then((resp) => resp.json())
  //       .then((data) => {
  //         console.log(data);

  //         if (data.status_code === 200) {
  //           // setTaskUpdated(!taskUpdated);

  //           setSelectedActivity(data.payload);

  //           if (data.payload && data.payload.length) {
  //             setActivityName(
  //               selectedActivity.activityName
  //                 ? selectedActivity.activityName
  //                 : ""
  //             );

  //             setActivityId(
  //               selectedActivity.activityAbrv
  //                 ? selectedActivity.activityAbrv
  //                 : ""
  //             );

  //             if (selectedActivity.assetNameList) {
  //               setAssetData(
  //                 selectedActivity.assetNameList.map((assetName) => {
  //                   return {
  //                     assetName: assetName,
  //                     logbook: selectedActivity.logbook,
  //                   };
  //                 })
  //               );

  //               console.log(assetData);
  //             }

  //             let hour = Math.floor(
  //               selectedActivity.duration ? selectedActivity.duration / 60 : 0
  //             );

  //             setHour(hour ? hour : 0);

  //             let mins = selectedActivity.duration
  //               ? selectedActivity.duration % 60
  //               : 0;

  //             setMinutes(mins ? mins : 0);

  //             setBuffer(selectedActivity.buffer);

  //             setEnforce(selectedActivity.enforce);
  //           }
  //         } else {
  //         }
  //       });
  //   };

  //   addActivity();
  // };

  const updateActivity = () => {
    let assetId = "";

    console.log(selectedAssets);

    if (selectedAssets) {
      setAssetData(
        selectedAssets.map((selectedAsset) => {
          return {
            assetName: selectedAsset.assetName,
            logbook: selectedLogbook.lookbookname,
          };
        })
      );
    }

    console.log(assetData);

    if (selectedActivity && selectedActivity.assetIDList) {
      for (let i = 0; i < selectedActivity.assetIDList.length; i++) {
        if (i === selectedActivity.assetIDList.length - 1)
          assetId += selectedActivity.assetIDList[i];
        else {
          assetId += selectedActivity.assetIDList[i] + ",";
        }
      }
    }

    if (!assetId) {
      if (selectedAssets) {
        for (let i = 0; i < selectedAssets.length; i++) {
          if (i === selectedAssets.length - 1) assetId += selectedAssets[i].id;
          else {
            assetId += selectedAssets[i].id + ",";
          }
        }
      }
    }

    let asset = "";

    // if (selectedActivity && selectedActivity.assetNameList) {
    //   for (let i = 0; i < selectedActivity.assetNameList.length; i++) {
    //     if (i === selectedActivity.assetNameList.length - 1)
    //       asset += selectedActivity.assetNameList[i];
    //     else {
    //       asset += selectedActivity.assetNameList[i] + ",";
    //     }
    //   }
    // }

    // if(!asset){

    //   if(selectedAssets){

    //      for(let i = 0;i<selectedAssets.length;i++){

    //       if (i === selectedAssets.length - 1)
    //       asset += selectedAssets[i].assetName;
    //     else {
    //       asset += selectedAssets[i].assetName + ",";
    //     }

    //   }

    //     }

    //   }

    if (assetData) {
      for (let i = 0; i < assetData.length; i++) {
        if (i === assetData.length - 1) asset += assetData[i].assetName;
        else {
          asset += assetData[i].assetName + ",";
        }
      }
    }

    console.log(asset);

    let durationMin = hour * 60 + minutes;

    const activityDetails = {
      transactionId: "",
      creationTime: selectedActivity.creationTime,
      taskId: selectedActivity.taskId,
      activityId: selectedActivity.activityId,
      activityName: activityName,
      sequence: selectedActivity.sequence,
      logbook: selectedActivity.logbook
        ? selectedActivity.logbook
        : selectedLogbook.lookbookname,
      asset: asset,
      durationMin: durationMin,
      activityAbrv: activityId,
      buffer: buffer,
      enforce: enforce,
      assetId: assetId,
    };

    console.log(activityDetails);

    if (!activityName) {
      if (toast && toast.current)
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "activity name is required",
          life: 3000,
        });

      return;
    }
    if (!activityId) {
      if (toast && toast.current)
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "activity abbreviation is required",
          life: 3000,
        });

      return;
    }
    if (activityDetails && activityDetails.durationMin === 0) {
      // alert('activity duration is required');

      if (toast && toast.current)
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "activity duration is required",
          life: 3000,
        });

      return;
    }
    if (task && task.activityList) {
      const filActs = task.activityList.filter(
        (activity) => activity.activityAbrv !== selectedActivity.activityAbrv
      );

      console.log(filActs);

      if (filActs) {
        for (let i = 0; i < filActs.length; i++) {
          if (filActs[i].activityAbrv === activityId) {
            if (toast && toast.current)
              toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "activity abbreviation should not be same",
                life: 3000,
              });

            return;
          }
        }
      }
    }

    console.log(activityDetails);

    let nodesData = [];

    nodesData.push({
      taskId: task.taskId,
      activityId: selectedActivity.activityId,
      posX: selectedActivity.xPos,
      posY: selectedActivity.yPos,
    });

    setSelectedActivity(activityDetails);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(activityDetails),
    };

    const addActivity = async () => {
      await fetch("http://localhost:8095/tasks/saveActivity", options)
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);

          if (data.status_code === 200) {
            setTaskUpdated(!taskUpdated);

            const respData = data.payload;

            console.log(respData);

            if (respData) {
              setSelectedActivity({ ...respData });
            }

            if (respData) {
              setActivityName(
                selectedActivity.activityName
                  ? selectedActivity.activityName
                  : ""
              );

              setActivityId(
                selectedActivity.activityAbrv
                  ? selectedActivity.activityAbrv
                  : ""
              );

              if (selectedActivity.assetNameList) {
                setAssetData(
                  selectedActivity.assetNameList.map((assetName) => {
                    return {
                      assetName: assetName,
                      logbook: selectedActivity.logbook,
                    };
                  })
                );

                console.log(assetData);
              }

              let hour = Math.floor(
                selectedActivity.duration ? selectedActivity.duration / 60 : 0
              );

              setHour(hour ? hour : 0);

              let mins = selectedActivity.duration
                ? selectedActivity.duration % 60
                : 0;

              setMinutes(mins ? mins : 0);

              setBuffer(selectedActivity.buffer);

              setEnforce(selectedActivity.enforce);

              setSelectedLogbook();

              setSelectedAssets();

              setSelectedNode();
            }
          } else {
          }
        });
    };

    addActivity();
  };

  // useEffect(() => {

  //   console.log(connections);

  //   checkAllconnections(connections);

  // },[connections]);

  useEffect(() => {
    console.log(activityConnections);

    if (task && task.activityList && task.activityList.length === 1) {
      setAllActivitiesConnected(true);

      return;
    } else if (
      task &&
      task.activityList &&
      task.activityList.length > 1 &&
      activityConnections &&
      activityConnections.length === 0
    ) {
      setAllActivitiesConnected(false);

      return;
    }

    checkAllconnections(activityConnections);
  }, [task, <ActivityDetails />]);

  const checkAllconnections = (connections) => {
    if (connections && connections.length) {
      let sourceList = connections.map((edgesData) => edgesData.sourceId);

      let targetList = connections.map((edgesData) => edgesData.targetId);

      console.log(sourceList, targetList);

      if (task && task.activityList) {
        for (let i = 0; i < task.activityList.length; i++) {
          console.log(task.activityList[i].activityId);

          if (
            task.activityList.length > 1 &&
            !sourceList.includes(task.activityList[i].activityId) &&
            !targetList.includes(task.activityList[i].activityId)
          ) {
            setAllActivitiesConnected(false);

            console.log(task.activityList[i]);

            // setDisconnectedNode(task.activityList[i]);

            alert("all activities should be connected");

            // if (toast && toast.current)
            //   toast.current.show({
            //     severity: "error",
            //     summary: "Error",
            //     detail: "all activities should be connected",
            //     life: 3000,
            //   });

            return;
          } else {
            // setAllActivitiesConnected(true);
          }
        }

        setAllActivitiesConnected(true);

        // console.log(disconnectedNode);
      }
    }
  };

  useEffect(() => {
    if (activitySelected) {
      setActivityName(
        activitySelected.activityName ? activitySelected.activityName : ""
      );

      setActivityId(
        activitySelected.activityAbrv ? activitySelected.activityAbrv : ""
      );

      if (activitySelected.assetNameList) {
        if (
          activitySelected.assetNameList.length === 1 &&
          activitySelected.assetNameList[0] === ""
        ) {
          setAssetData([]);
        } else {
          setAssetData(
            activitySelected.assetNameList.map((assetName) => {
              return {
                assetName: assetName,
                lookbookname: activitySelected.logbook,
              };
            })
          );
        }
        console.log(assetData);
      }

      let hour = Math.floor(
        activitySelected.duration ? activitySelected.duration / 60 : 0
      );

      setHour(hour ? hour : "");

      let mins = activitySelected.duration ? activitySelected.duration % 60 : 0;

      setMinutes(mins ? mins : "");

      setBuffer(activitySelected.buffer);

      setEnforce(activitySelected.enforce);
    }
  }, [activitySelected]);

  useEffect(() => {
    console.log(activitySelected);

    const act = activitySelected;

    setSelectedActivity(act);
  }, [activitySelected]);

  const getAllTask = async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    try {
      const response = await fetch(
        "http://localhost:8095/tasks/alltasks",
        options
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Data received : ", data);
        return data.payload;
      }
      return null;
    } catch (e) {
      console.log("Error occurred while fetching task : ", e);
    }
    //   .then((resp) => resp.json())
    //   .then((data) => {
    //     console.log("Newdata", data.payload);

    //     setAllTasks(data.payload);

    //     console.log(data.payload);

    //     setValues(data.payload);
    //   })
    //  .catch((e) => console.log('Error Occurred : ',e));
  };

  return (
    <>
      {/* <Dialog visible={props.visible} onHide={props.onHide} style={{position : 'absolute',height : '100rem',width : '60rem',textAlign : 'center'}} > */}
      <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
        <div
          //className="card flex justify-content-center"
          style={{ background: "white" }}
        >
          <Toast ref={toast} />
          <Card>
            <div>
              <div
                style={{
                  padding: "0.3rem 0.7rem",
                  display: "flex",
                  alignItems: "center",
                  columnGap: "0.3rem",
                }}
              >
                <IconButton
                  color="info"
                  onClick={() => {
                    navigate("/workflow/taskmaster");
                  }}
                  aria-label="home"
                >
                  <HomeIcon />
                </IconButton>
                {/* <Button
                  type="button"
                  icon="pi pi-home"
                  size="small"
                  rounded
                  onClick={() => {
                    navigate("/workflow/taskmaster");
                  }}
                /> */}
                <Typography sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                  Create Task
                </Typography>
              </div>
              <Divider />
              <div>
                <Stepper ref={stepperRef} orientation="vertical">
                  <StepperPanel header="Task Creation">
                    <>
                      <Grid container>
                        <Grid
                          sx={{
                            border: "1px solid divider",
                            borderColor: "divider",
                          }}
                          xs={3}
                        >
                          <Typography>Task Name</Typography>
                        </Grid>
                        <Grid xs={3}>
                          <InputText
                            value={taskName}
                            placeholder="Enter Task Name"
                            style={{ width: "200px" }}
                            onChange={(e) => {
                              setTaskName(e.target.value);
                            }}
                          />
                        </Grid>
                        <Grid xs={3}>
                          <Typography>Description</Typography>
                        </Grid>
                        <Grid xs={3}>
                          <InputTextarea
                            value={description}
                            style={{ width: "200px" }}
                            placeholder="Enter Description"
                            onChange={(e) => {
                              setDescription(e.target.value);

                              console.log(e.target.value);
                            }}
                            required
                          />
                        </Grid>
                        <Grid xs={3}>
                          <Typography>Select Reviewer</Typography>
                        </Grid>
                        <Grid xs={3}>
                          <Dropdown
                            value={reviewer}
                            placeholder="Select Reviewer"
                            options={users}
                            optionLabel="userName"
                            required
                            maxWidth={200}
                            className="dropdownSectionWidth"
                            style={{ width: "200px", maxWidth: "200px" }}
                            onChange={(e) => {
                              setReviewer(e.value);

                              console.log(e.value);
                            }}
                            filter
                          />
                        </Grid>
                        <Grid xs={3}>
                          <Typography>Select Asset Group</Typography>
                        </Grid>
                        <Grid xs={3}>
                          <Dropdown
                            options={assetGroups}
                            optionLabel="groupName"
                            style={{ width: "200px" }}
                            value={assetGroup}
                            onChange={(e) => setAssetGroup(e.value)}
                            placeholder="Select Asset Group"
                            filter
                          />
                        </Grid>
                      </Grid>
                      <br />
                      {/* <GroupAndDepartment
                        groups={groups}
                        selectedGroupList={selectedGroupList}
                        selectedDepartmentList={selectedDepartmentList}
                        setSelectedGroupList={setSelectedGroupList}
                        setSelectedDepartmentList={setSelectedDepartmentList}
                        depts={depts}
                        task={task}
                      /> */}
                      <div className="flex py-4">
                        <Button
                          size="small"
                          label="Save as Draft & Proceed"
                          icon="pi pi-arrow-right"
                          iconPos="right"
                          // onClick={() => {
                          //   let resp = taskDraftHandler();
                          //   if (resp === "ERROR") return;
                          //   if (task && dataRef) dataRef.current = task;
                          //   console.log(dataRef.current);
                          //   stepperRef.current.nextCallback();
                          // }}
                          // onClick={async() => {
                          //   const allTaskDetails= await getAllTask()
                          //   console.log('All Task Details : ',allTaskDetails)
                          //   if(allTaskDetails)
                          //     {
                          //   const isTaskAlreadyExist=allTaskDetails.find(task=>task.taskName.trim().toLowerCase()===taskName.toLowerCase())
                          //   if(isTaskAlreadyExist)
                          //     {
                          //   toast.current.show({
                          //     severity: "error",
                          //     summary: "Error",
                          //     detail: "TaskName already exists !",
                          //     life: 3000,
                          //   });
                          //   return;
                          // }
                          //     }
                          //     }
                          //   }

                          onClick={async () => {
                            const allTaskDetails = await getAllTask();
                            console.log("All Task Details : ", allTaskDetails);
                            if (allTaskDetails) {
                              const isTaskAlreadyExist = allTaskDetails.find(
                                (task) =>
                                  task.taskName.trim().toLowerCase() ===
                                  taskName.toLowerCase()
                              );
                              if (isTaskAlreadyExist) {
                                toast.current.show({
                                  severity: "error",
                                  summary: "Error",
                                  detail: "TaskName already exists !",
                                  life: 3000,
                                });
                                return;
                              }
                            }
                            let resp = taskDraftHandler();
                            if (resp === "ERROR") return;
                            if (task && dataRef) dataRef.current = task;
                            console.log(dataRef.current);
                            stepperRef.current.nextCallback();
                          }}
                        />
                      </div>

                      {/* <Button
                          label="Save Task as Draft & Proceed"
                          icon="pi pi-arrow-right"
                          iconPos="right"
                          onClick={() => {
                            let resp = taskDraftHandler();

                            if (resp === "ERROR") return;

                            if (task && dataRef) dataRef.current = task;

                            console.log(dataRef.current);

                            stepperRef.current.nextCallback();
                          }}
                        /> */}
                    </>
                  </StepperPanel>

                  {/* <StepperPanel header="Groups And Depts">
                <div className="flex flex-column h-12rem">
                    <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">


               

                    </div>
                </div>
                <div className="flex pt-4 justify-content-between"> */}

                  {/* <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} /> */}
                  {/* <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                </div>
            </StepperPanel> */}

                  {/* <StepperPanel header="Asset">
                <div className="flex flex-column h-12rem">
                    <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">


               

                    </div>
                </div>
                <div className="flex pt-4 justify-content-start">
                    <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                    <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                </div>
            </StepperPanel> */}

                  <Typography>Task : {task ? task.taskName : ""}</Typography>

                  <StepperPanel header="Activity">
                    <div>
                      <div>
                        {/* <ActivityCreation
                  setActivityDialogVisible={setActivityDialogVisible}
                  activityDialogVisible={activityDialogVisible}
                  assetGroup={assetGroup}
                  logbooks={props.logbooks}
                /> */}

                        <div>
                          <Grid container spacing={2}>
                            <Grid item xs={4}>
                              <div
                                className="leftSide"
                                style={{
                                  background: "#f7f7f7",
                                  borderRadius: "0.6rem",

                                  padding: "1rem",
                                }}
                              >
                                <Typography>Activity Name</Typography>
                                <InputText
                                  value={activityName}
                                  placeholder="Enter Activity Name"
                                  onChange={(e) => {
                                    // if(task){

                                    //     task.activityList.forEach(activity => {

                                    //         if(e.target.value === activity.activityName){

                                    //           toast.current.show({severity:'warn', summary: 'Warning', detail:'Toast already exists', life: 3000});

                                    //         }

                                    //     });

                                    // }
                                    // else
                                    setActivityName(e.target.value);
                                  }}
                                />

                                <Typography sx={{ marginTop: "0.5rem" }}>
                                  Activity Identity
                                </Typography>
                                <InputText
                                  value={activityId}
                                  placeholder="Enter Activity Identity(max 6)"
                                  onChange={(e) =>
                                    setActivityId(e.target.value)
                                  }
                                  maxLength={6}
                                />

                                <Button
                                  type="button"
                                  size="small"
                                  rounded
                                  icon="pi pi-plus-circle"
                                  style={{ marginTop: "1rem" }}
                                  label="Add Asset & Logbook"
                                  onClick={() => setAssetDialogVisible(true)}
                                  disabled={treeData && !treeData.id}
                                />

                                {/* <AssetDialogForNewTask
                                    onHide={() => setAssetDialogVisible(false)}
                                    treeData={treeData}
                                    logbooks={logbooks}
                                    selectedLogbook={selectedLogbook}
                                    setSelectedLogbook={setSelectedLogbook}
                                    setSelectedNode={setSelectedNode}
                                    assetDialogVisible={assetDialogVisible}
                                    setAssetDialogVisible={setAssetDialogVisible}
                                    selectedAssets={selectedAssets}
                                    setSelectedAssets={setSelectedAssets}
                                    activityName={activityName}
                                    count={count}
                                    setCount={setCount}
                                    assetData={assetData}
                                    setAssetData={setAssetData}
                                  /> */}

                                <AssetDialog
                                  onHide={() => setAssetDialogVisible(false)}
                                  treeData={treeData}
                                  logbooks={logbooks}
                                  selectedLogbook={selectedLogbook}
                                  setLogbooks={setLogbooks}
                                  setSelectedLogbook={setSelectedLogbook}
                                  setSelectedNode={setSelectedNode}
                                  assetDialogVisible={assetDialogVisible}
                                  setAssetDialogVisible={setAssetDialogVisible}
                                  selectedAssets={selectedAssets}
                                  setSelectedAssets={setSelectedAssets}
                                  activityName={activityName}
                                  count={count}
                                  setCount={setCount}
                                  activityUpdated={activityUpdated}
                                  assetData={assetData}
                                  setAssetData={setAssetData}
                                  selectedActivity={selectedActivity}
                                  groups={groups}
                                  department={department}
                                />

                                {assetData && assetData.length ? (
                                  <div
                                    style={{
                                      marginTop: "1rem",
                                      border: "1px solid #e9e7e7",
                                    }}
                                  >
                                    <DataTable
                                      value={assetData}
                                      style={{}}
                                      tableStyle={{ fontSize: "0.8rem" }}
                                      stripedRows
                                      header="Existing assets and logbook"
                                    >
                                      <Column
                                        field="assetName"
                                        header="Asset Name"
                                      />
                                      <Column
                                        field="logbook"
                                        header="Logbook"
                                      />
                                    </DataTable>
                                  </div>
                                ) : (
                                  <></>
                                )}
                                <Divider
                                  sx={{ marginTop: "1rem", opacity: "0.4" }}
                                />
                                <Typography
                                  // style={{
                                  //   position: "relative",
                                  //   right: "12.5rem",
                                  //   top: "3.3rem",
                                  // }}
                                  sx={{ marginTop: "1rem" }}
                                >
                                  Set Hours
                                </Typography>
                                <InputNumber
                                  inputId="minmax-buttons"
                                  value={hour}
                                  onValueChange={(e) => setHour(e.value)}
                                  mode="decimal"
                                  showButtons
                                  min={0}
                                  max={12}
                                />

                                <Typography
                                  // style={{
                                  //   position: "relative",
                                  //   right: "12.5rem",
                                  //   top: "3.3rem",
                                  // }}
                                  sx={{ marginTop: "0.5rem" }}
                                >
                                  Set Minutes
                                </Typography>
                                <InputNumber
                                  inputId="minmax-buttons"
                                  value={minutes}
                                  onValueChange={(e) => setMinutes(e.value)}
                                  mode="decimal"
                                  showButtons
                                  min={0}
                                  max={59}
                                />

                                <Typography sx={{ marginTop: "0.5rem" }}>
                                  Buffer
                                </Typography>
                                <InputNumber
                                  inputId="minmax-buttons"
                                  value={buffer}
                                  onValueChange={(e) => setBuffer(e.value)}
                                  mode="decimal"
                                  showButtons
                                  min={0}
                                  max={59}
                                />

                                <Typography sx={{ marginTop: "0.5rem" }}>
                                  Enforce
                                </Typography>

                                <div
                                  style={{
                                    position: "relative",
                                    left: "300",
                                  }}
                                >
                                  <ToggleButton
                                    checked={enforce}
                                    onIcon="pi pi-check"
                                    offIcon="pi pi-times"
                                    size="small"
                                    style={{ padding: "0.5rem" }}
                                    onChange={(e) => setEnforce(e.value)}
                                  />
                                  <Divider
                                    sx={{
                                      marginTop: "0.5rem",
                                      marginBottom: "0.5rem",
                                      opacity: "0.4",
                                    }}
                                  />

                                  {activitySelected ? (
                                    <>
                                      <Button
                                        type="button"
                                        label="Update activity"
                                        size="small"
                                        rounded
                                        onClick={() => {
                                          setActivityUpdated(!activityUpdated);

                                          updateActivity();
                                        }}
                                        style={{}}
                                      />
                                      <Button
                                        type="button"
                                        size="small"
                                        rounded
                                        label="Delete Activity"
                                        onClick={() => {
                                          deleteActivityHandler(
                                            selectedActivity
                                          );

                                          setSelectedActivity({});
                                        }}
                                        style={{}}
                                      />
                                    </>
                                  ) : (
                                    <Button
                                      key="tr"
                                      type="button"
                                      size="small"
                                      rounded
                                      icon="pi pi-plus"
                                      label="Add Activity"
                                      onClick={() => {
                                        addActivityHandler();

                                        // setActivityExists(!activityExists);
                                      }}
                                      style={{}}
                                    ></Button>
                                  )}

                                  <Button
                                    type="button"
                                    label="Reset"
                                    size="small"
                                    icon="pi pi-refresh"
                                    severity="warning"
                                    rounded
                                    onClick={() => {
                                      setActivitySelected(false);

                                      // setAssetData([]);

                                      // setSelectedActivity('');

                                      setActivityName("");

                                      setActivityId("");

                                      setSelectedAssets([]);

                                      setCount(0);

                                      // let hour = Math.floor(selectedActivity.duration / 60);

                                      setHour(0);

                                      // let mins = selectedActivity.duration % 60;

                                      setMinutes(0);

                                      setBuffer(0);

                                      setEnforce(false);
                                    }}
                                    style={{ marginLeft: "1rem" }}
                                  />
                                </div>

                                {/* <Button
                            key="tr"
                            type="button"
                            onClick={addActivityHandler}
                            label="add activity"
                            style={{ position: "relative", top: 70, right: "0rem" }}
                          >
                            <i className="pi pi-plus"></i>
                          </Button> */}
                              </div>
                            </Grid>
                            <Grid sx={{ paddingRight: "1rem" }} item xs={8}>
                              <>
                                <span style={{}}>
                                  {/* <ActivityDetails
                                    task={task}
                                    activityConnections={props.activityConnections}
                                    activityNodePositions={props.activityNodePositions}
                                  /> */}
                                  {console.log(task)}
                                  <ActivityDetails
                                    task={task}
                                    activityConnections={activityConnections}
                                    setActivityConnections={
                                      setActivityConnections
                                    }
                                    activityNodePositions={
                                      activityNodePositions
                                    }
                                    setActivityNodePositions={
                                      setActivityNodePositions
                                    }
                                    addConnections={addConnections}
                                    saveNodePositions={saveNodePositions}
                                    nextButtonClicked={nextButtonClicked}
                                    setNextButtonClicked={setNextButtonClicked}
                                    setNodePositionChanged={
                                      setNodePositionChanged
                                    }
                                    setNodePositionSaved={setNodePositionSaved}
                                    nodeDataCreated={nodeDataCreated}
                                    setNodeDataCreated={setNodeDataCreated}
                                    nodesDraggable={true}
                                    selectedActivity={selectedActivity}
                                    setSelectedActivity={setSelectedActivity}
                                    activitySelected={activitySelected}
                                    setActivitySelected={setActivitySelected}
                                    activityUpdated={activityUpdated}
                                    setActivityUpdated={setActivityUpdated}
                                    edgesUpdatable={true}
                                    setConnections={setConnections}
                                  />

                                  {/* {task && task.activityList && task.activityList.length ? <Typography>please click reset button to add a new task</Typography> : 
                                 <Typography>select an activity to update</Typography>} */}
                                </span>
                              </>
                            </Grid>
                          </Grid>
                        </div>

                        {/* <AddActivityDialog
                    visible={activityDialogVisible}
                    onHide={() => setActivityDialogVisible(false)}
                    assetGroup={assetGroup}
                    logbooks={logbooks}
                  /> */}
                        <br />

                        {/* {!editButtonClicked ? (
                  <>
                  <DataTable
                    value={task ? task.activityList : []}
                    key="activityName"
                    style={{ position: "relative", bottom: "40rem",textAlign:'center' }}
                    stripedRows
                    onRowClick={(event) => {
                      
                      setEditButtonClicked(true);

                      setClickedRow(event.data);

                      console.log(clickedRow);

                      setActivity({...event.data});

                    }}
                  >
                    <Column
                      field="sequence"
                      header="Order"
                      headerStyle={{ backgroundColor: "black", color: "white" }}
                    ></Column>
                    <Column
                      field="activityName"
                      header="Activity Name"
                      headerStyle={{ backgroundColor: "black", color: "white" }}
                    ></Column>
                    <Column
                      field="activityAbrv"
                      header="Activity Abrv"
                      headerStyle={{ backgroundColor: "black", color: "white" }}
                    ></Column>
                    <Column
                      field="logbook"
                      header="Logbook"
                      headerStyle={{ backgroundColor: "black", color: "white" }}
                    ></Column>
                    <Column
                      field="duration"
                      header="Duration"
                      headerStyle={{ backgroundColor: "black", color: "white" }}
                    ></Column>
                    <Column
                      header="Assets"
                      body={(row) => {
                        return row && row.assetNameList
                          ? row.assetNameList.map((assetName) => (
                              <Tag value={assetName} />
                            ))
                          : "";
                      }}
                      headerStyle={{ backgroundColor: "black", color: "white" }}
                    />
                      <Column
                      field=""
                      header=""
                      body={renderDeleteButton}
                      headerStyle={{ backgroundColor: "black", color: "white" }}
                    ></Column>
                  </DataTable>
                </>)
                 : 
                (<>
                  <DataTable
                    value={task ? task.activityList : []}
                    key="activityName"
                    style={{ position: "relative", bottom: "40rem" ,textAlign:'center'}}
                    stripedRows
                    onRowClick={() => {
                      
                      // setEditButtonClicked(true);

                    }}
                  >
                    <Column
                      field="sequence"
                      header="Order"
                      headerStyle={{ backgroundColor: "black", color: "white" }}
                    ></Column>
                    <Column
                      field="activityName"
                      header="Activity Name"
                      headerStyle={{ backgroundColor: "black", color: "white" }}
                    ></Column>
                    <Column
                      field="activityAbrv"
                      header="Activity Abrv"
                      headerStyle={{ backgroundColor: "black", color: "white" }}
                    ></Column>
                    <Column
                      field="logbook"
                      header="Logbook"
                      headerStyle={{ backgroundColor: "black", color: "white" }}
                    ></Column>
                    <Column
                      field="duration"
                      header="Duration(mins)"
                      headerStyle={{ backgroundColor: "black", color: "white" }}
                      body={(rowData) => {return <>
                      <InputNumber placeholder="Hour" onChange={(e) => {
                        
                        setHour(e.value);

                        setHourChanged(true);

                        // setActivity({...clickedRow,duration : e.target.value});

                        // console.log(activity);

                      }}/>
                      <InputNumber placeholder="Minutes" onChange={(e) => {
                        
                        setMinutes(e.value);

                        setMinChanged(true);

                        // setActivity({...clickedRow,duration : e.target.value});

                        // console.log(activity);

                      }}/>
                      
                      </>}}
                    ></Column>
                    <Column
                      header="Assets"
                      body={(row) => {
                        return row && row.assetNameList
                          ? row.assetNameList.map((assetName) => (
                              <Tag value={assetName} />
                            ))
                          : "";
                      }}
                      headerStyle={{ backgroundColor: "black", color: "white" }}
                    />
                      <Column
                      field=""
                      header=""
                      body={renderDeleteButton}
                      headerStyle={{ backgroundColor: "black", color: "white" }}
                    ></Column>
                      <Column
                      field=""
                      header=""
                      body={renderSaveButton}
                      headerStyle={{ backgroundColor: "black", color: "white" }}
                    ></Column>
                  </DataTable>
                </>)} */}
                      </div>
                    </div>
                    <div
                      className="pb-2 pr-3"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Button
                        label="Back"
                        severity="secondary"
                        size="small"
                        rounded
                        icon="pi pi-arrow-left"
                        onClick={() => stepperRef.current.prevCallback()}
                        style={
                          {
                            //position: "relative",
                            // bottom: "20rem",
                            // right: "38rem",
                          }
                        }
                      />
                      {console.log(task)}
                      <Button
                        label="Next"
                        size="small"
                        rounded
                        icon="pi pi-arrow-right"
                        iconPos="right"
                        disabled={!allActivitiesConnected}
                        // style={{backgroundColor : 'red'}}
                        onClick={() => {
                          setNextButtonClicked(!nextButtonClicked);
                          if (
                            task &&
                            task.activityList &&
                            !task.activityList.length
                          ) {
                            if (toast && toast.current)
                              toast.current.show({
                                severity: "error",
                                summary: "Error",
                                detail: "task should have at least 1 activity",
                                life: 3000,
                              });

                            return;
                          } else if (!allActivitiesConnected) {
                            // if (toast && toast.current)
                            //   toast.current.show({
                            //     severity: "error",
                            //     summary: "Error",
                            //     detail: "all activities should be connected",
                            //     life: 3000,
                            //   });

                            return;
                          } else if (!task) {
                            if (toast && toast.current)
                              toast.current.show({
                                severity: "error",
                                summary: "Error",
                                detail:
                                  "task is not valid, if task is saved, visit draft tasks",
                                life: 3000,
                              });

                            return;
                          } else {
                            setTimeout(() => {
                              stepperRef.current.nextCallback();
                            }, 2000);
                          }
                        }}
                        // style={{
                        //   position: "relative",
                        //   top: "50rem",
                        //   left: "50rem",
                        //   backgroundColor: "red",
                        // }}
                      />
                    </div>
                  </StepperPanel>

                  <StepperPanel header="Confirm">
                    {/* <div className="flex flex-column h-12rem"> */}
                    {/* <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium"> */}
                    {/* <Grid container spacing={2}> */}

                    {/* <Grid xs={6}> */}
                    {/* <Item> */}
                    {/* <Typography>Task Name</Typography> */}
                    {/*  */}
                    {/* </Grid> */}

                    <Container maxWidth="lg" sx={{}}>
                      <Card>
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
                            <Typography sx={{ ml: 7 }}>Task Name</Typography>
                          </Grid>
                          <Grid
                            sx={{
                              border: "1px solid #dbdbdb",
                              padding: "0.5rem",
                            }}
                            xs={6}
                          >
                            <Typography>{task ? task.taskName : ""}</Typography>
                          </Grid>

                          <Grid
                            sx={{
                              border: "1px solid #dbdbdb",
                              padding: "0.5rem",
                            }}
                            xs={6}
                          >
                            <Typography sx={{ ml: 7 }}>Description</Typography>
                          </Grid>

                          <Grid
                            sx={{
                              border: "1px solid #dbdbdb",
                              padding: "0.5rem",
                            }}
                            xs={6}
                          >
                            <Typography>
                              {task ? task.description : ""}
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
                            <Typography>{task ? task.reviewer : ""}</Typography>
                          </Grid>

                          <Grid
                            sx={{
                              border: "1px solid #dbdbdb",
                              padding: "0.5rem",
                            }}
                            xs={6}
                          >
                            <Typography sx={{ ml: 7 }}>Groups</Typography>
                          </Grid>

                          <Grid
                            sx={{
                              border: "1px solid #dbdbdb",
                              padding: "0.5rem",
                            }}
                            xs={6}
                          >
                            {task && task.userGroupsList
                              ? task.userGroupsList.map((userGroup) => {
                                  return (
                                    <Tag
                                      rounded
                                      key={userGroup}
                                      value={userGroup}
                                    />
                                  );
                                })
                              : ""}
                          </Grid>

                          <Grid
                            sx={{
                              border: "1px solid #dbdbdb",
                              padding: "0.5rem",
                            }}
                            xs={6}
                          >
                            <Typography sx={{ ml: 7 }}>Departments</Typography>
                          </Grid>

                          <Grid
                            sx={{
                              border: "1px solid #dbdbdb",
                              padding: "0.5rem",
                            }}
                            xs={6}
                          >
                            {task && task.userDeptsList
                              ? task.userDeptsList.map((userDept) => {
                                  return <Tag rounded value={userDept} />;
                                })
                              : ""}
                          </Grid>
                        </Grid>
                      </Card>
                    </Container>

                    <br />
                    <Container maxWidth="lg" sx={{ paddingLeft: 0 }}>
                      <Grid xs={12}>
                        <Card>
                          <Typography
                            sx={{
                              padding: "0.5rem 1rem",
                              background: "#e9e7e7",
                            }}
                          >
                            Activities
                          </Typography>
                          <DataTable
                            value={task ? task.activityList : ""}
                            key="activityId"
                            tableStyle={{ fontSize: "0.8rem" }}
                          >
                            <Column
                              field="sequence"
                              header="Order"
                              headerStyle={{
                                backgroundColor: "black",
                                color: "white",
                              }}
                            ></Column>
                            <Column
                              field="activityName"
                              header="Activity Name"
                              headerStyle={{
                                backgroundColor: "black",
                                color: "white",
                              }}
                            ></Column>
                            <Column
                              field="activityAbrv"
                              header="Activity Abrv"
                              headerStyle={{
                                backgroundColor: "black",
                                color: "white",
                              }}
                            ></Column>
                            <Column
                              field="logbook"
                              header="Logbook"
                              headerStyle={{
                                backgroundColor: "black",
                                color: "white",
                              }}
                            ></Column>
                            <Column
                              field="duration"
                              header="Duration"
                              headerStyle={{
                                backgroundColor: "black",
                                color: "white",
                              }}
                            ></Column>
                            <Column
                              header="Assets"
                              body={renderAssets}
                              headerStyle={{
                                backgroundColor: "black",
                                color: "white",
                              }}
                            />
                          </DataTable>
                        </Card>
                      </Grid>
                      {/* </Grid> */}
                    </Container>
                    <br />
                    <Container maxWidth="lg">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Button
                          label="Back"
                          severity="secondary"
                          size="small"
                          rounded
                          icon="pi pi-arrow-left"
                          onClick={() => stepperRef.current.prevCallback()}
                          style={{}}
                        />
                        <Button
                          label="Send For Approval"
                          size="small"
                          rounded
                          type="button"
                          onClick={updateTaskHandler}
                          icon="pi pi-arrow-right"
                          style={{}}
                        />
                        {/* </div> */}
                        {/* </div> */}
                      </div>
                    </Container>
                    <br />
                  </StepperPanel>
                </Stepper>
              </div>
            </div>
          </Card>
        </div>
      </Container>
      {/* </Dialog> */}
    </>
  );
}
