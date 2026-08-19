import { Dialog } from "primereact/dialog";
import { useEffect, useRef, useState } from "react";
// import TaskForm from "./TaskForm";
import ActivityDetails from "./ActivityDetails";
import { Form, Formik, useFormik } from "formik";
import { Toast } from "primereact/toast";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Button } from "primereact/button";
import AssetTree from "../components/shared/tree/AssetTree.component";
import AddActivityDialog from "./AddActivityDialog";
import { Router, useNavigate, useLocation } from "react-router-dom";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import AddAsset from "./AddAsset";
import LogbookSelectionDialog from "./LogbookSelectionDialog";
import { MultiStateCheckbox } from "primereact/multistatecheckbox";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { ToggleButton } from "primereact/togglebutton";
import AssetDialog from "./AssetDialog";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

import { Tag } from "primereact/tag";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import AddTaskFormDialog from "./AddTaskFormDialog";
import { Message } from "primereact/message";
import { ProgressSpinner } from "primereact/progressspinner";
import { Checkbox } from "primereact/checkbox";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import {
  Card,
  Chip,
  Container,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { decryptTokenId } from "../helper/AuthService";
// import { ToastContainer, toast } from 'react-toastify';

export default function TaskFormDialog(props) {
  const [task, setTask] = useState({});
  const [formDialogVisible, setFormDialogVisible] = useState(false);
  const toast = useRef(null);
  const [selectedGroupList, setSelectedGroupList] = useState([]);
  const [selectedDepartmentList, setSelectedDepartmentList] = useState([]);
  const [assetGroup, setAssetGroup] = useState({});
  const [assetGroups, setAssetGroups] = useState([]);
  const [activityConnections, setActivityConnections] = useState([]);
  const [activityNodePositions, setActivityNodePositions] = useState([]);
  const [treeData, setTreeData] = useState({});
  const [selectedNode, setSelectedNode] = useState({});
  const [logbooks, setLogbooks] = useState([]);
  const [asset, setAsset] = useState({});
  const [activityDialogVisible, setActivityDialogVisible] = useState(false);
  const [selectedLogbook, setSelectedLogbook] = useState("");
  const [logbookDropdownVisible, setLogbookDropdownVisible] = useState(false);
  const [nodeChanged, setNodeChanged] = useState(false);
  // const [groups, setGroups] = useState();
  // const [depts, setDepts] = useState();
  const [selectedAssetGroup, setSelectedAssetGroup] = useState({});
  const [selectedLogbooks, setSelectedLogbooks] = useState([]);
  const [activity, setActivity] = useState({});
  const [hour, setHour] = useState();
  const [minutes, setMinutes] = useState();
  const [activityName, setActivityName] = useState("");
  const [activityId, setActivityId] = useState("");
  const [buffer, setBuffer] = useState("");
  const [enforce, setEnforce] = useState(false);
  const [assetDialogVisible, setAssetDialogVisible] = useState(false);
  const [taskUpdated, setTaskUpdated] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [activities, setActivities] = useState([]);
  const [count, setCount] = useState(0);
  const [activityExists, setActivityExists] = useState(false);
  const [nextButtonClicked, setNextButtonClicked] = useState(false);
  const [connectionSaved, setConnectionSaved] = useState(false);
  const [nodePositionChanged, setNodePositionChanged] = useState(false);
  const [nodePositionsSaved, setNodePositionSaved] = useState(false);
  const [nodeDataCreated, setNodeDataCreated] = useState(false);
  const [editButtonClicked, setEditButtonClicked] = useState(false);
  const [duration, setDuration] = useState(0);
  const [clickedRow, setClickedRow] = useState({});
  const [bufferChecked, setBufferChecked] = useState(false);
  const [hourChanged, setHourChanged] = useState(false);
  const [minChanged, setMinChanged] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activitySelected, setActivitySelected] = useState(false);
  const [resetForm, setResetForm] = useState(false);
  const [assetData, setAssetData] = useState([]);
  const [activityUpdated, setActivityUpdated] = useState(false);
  const [allActivitiesConnected, setAllActivitiesConnected] = useState(false);
  const [disconnectedNode, setDisconnectedNode] = useState({});
  const [edges, setEdges] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [, forceUpdate] = useState([]);
  const [groups, setGroups] = useState("");
  const [department, setDepartment] = useState("");
  const [assetIds, setAssetIds] = useState([]);

  const stepperRef = useRef(null);

  const confirm1 = (event) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Are you sure you want to proceed?",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
    });
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  useEffect(() => {
    setTask(task);

    // setFormDialogVisible(props.visible);

    // setSelectedDepartmentList();
  }, []);

  const updateTask = () => {
    // alert(JSON.stringify(values, null, 2));

    console.log(selectedDepartmentList);

    if (task && task.userDeptsList) task.userDeptsList = selectedDepartmentList;

    if (task && task.userGroupsList)
      task.userGroupsList = selectedGroupList.map((group) => group.groupName);

    if (task && task.assetGroup) task.assetGroup = assetGroup.GroupName;

    if (task && task.status) task.status = "Pending";

    console.log(task);

    props.updateTaskHandler(task);

    // formik.resetForm();

    setSelectedGroupList([]);
    setSelectedDepartmentList([]);
    setAssetGroup({});
  };

  const resetFields = () => {
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

    setMinutes(1);

    setBuffer(0);

    setEnforce(false);
  };

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    const fetchAssetTree = async () => {
      await fetch(
        "http://localhost:8088/api/assetGroups/" +
          assetGroup.groupId +
          "/" +
          decryptTokenId(localStorage.getItem("tenantId")),
        options
      )
        .then((resp) => resp.json())
        .then((data) => {
          if (data && data.length !== 0) setTreeData(data[0]);

          console.log(data[0]);
        });
    };

    fetchAssetTree();
  }, [assetGroup]);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    const fetchLogbooks = async () => {
      if (selectedNode) {
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

            setLogbooks(logbooks);

            console.log(logbooks);

            if (data) {
              let assetIds = data.map((asset) => {
                return {
                  assetId: asset.AssetId,
                  assetName: asset.AssetName,
                };
              });

              setAssetIds(assetIds);
            }

            if (data && data.length) {
              let groups = data[0].groups;

              let department = data[0].department;

              setGroups(groups);
              setDepartment(department);
            }
          });
      }
    };

    fetchLogbooks();
  }, [selectedNode]);

  // useEffect(() => {
  //   console.log(logbookDropdownVisible);
  // }, [logbookDropdownVisible]);

  const location = useLocation();

  console.log(location);

  useEffect(() => {
    console.log("LOCATION", location);

    setTask(location.state.task);

    // setGroups(location.state.groups);

    console.log("All Grps", location.state.groups);

    // setDepts(location.state.depts);

    setAssetGroups(location.state.assetGroups);

    setActivityConnections(location.state.activityConnections);

    setEdges(location.state.edges);

    let groupIdList = [];

    if (location.state.task && location.state.task.userGroupsList) {
      location.state.task.userGroupsList.forEach((userGroup) => {
        if (location.state.groups)
          location.state.groups.forEach((group) => {
            if (group.groupId === userGroup) {
              console.log(group.groupId, group.groupId === userGroup);

              groupIdList.push(group);
            }
          });
      });

      // console.log("GROUPS", groupIdList, groups);

      // console.log('GROUPS',grps);

      setSelectedGroupList(groupIdList);
    }

    // }

    console.log(
      "DEPARTMENTS",
      location.state.depts,
      location.state.task.userDeptsList
    );

    console.log(
      "ASSETGROUPS",
      location.state.task.assetGroup,
      location.state.assetGroups
    );

    if (location.state.task)
      setSelectedDepartmentList(location.state.task.userDeptsList);

    if (location.state.assetGroups) {
      location.state.assetGroups.forEach((assetGroup) => {
        if (assetGroup.groupName === location.state.task.assetGroup) {
          setAssetGroup(assetGroup);

          console.log("DEFAULT ASSET GROUP", assetGroup);
        }
      });
    }
  }, []);

  const addActivityHandler = () => {
    activity.creationTime = new Date();

    activity.creationTime.setHours(activity.creationTime.getHours() + 5);
    activity.creationTime.setMinutes(activity.creationTime.getMinutes() + 30);

    activity.creationTime = activity.creationTime.toISOString();

    activity.taskId = task.taskId;
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

    // console.log(assetIds,selectedAssets);

    // if(assetIds && selectedAssets){

    //       selectedAssets.forEach((selectedAsset) => {

    //         assetIds.forEach(assetID => {

    //          if(assetID.AssetName === selectedAsset.assetName){

    //               assetId.push(assetID.AssetId);
    //          }

    //       });

    //     });

    // }

    // console.log(assetId);

    // let assetIDs = "";

    // if(assetId && assetId.length){

    //     for(let i = 0;i<assetId.length;i++){

    //         if(i === assetId.length - 1)
    //           assetIDs += assetId[i];

    //         else assetIDs += assetId[i] + ","
    //     }
    // }

    // console.log(assetIDs);

    activity.assetId = assetIds;

    activity.groups = groups;
    activity.department = department;
    activity.tenantId = decryptTokenId(localStorage.getItem("tenantId"));

    activity.durationMin = hour * 60 + minutes;
    activity.activityAbrv = activityId;
    activity.buffer = buffer;
    activity.enforce = enforce;

    const validation = validateActivity(activity);

    console.log(validation);

    if (validation && validation.error === "ERROR") {
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

    // setSelectedLogbook()

    console.log(activities);

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
          if (data.status_code === 200) {
            setTaskUpdated(!taskUpdated);

            return (
              <Message severity="success" text="Activity added successfully" />
            );
          } else {
          }
        });
    };

    addActivity();

    setCount(0);
    setSelectedAssets([]);
    setSelectedLogbook({});
  };

  const validateActivity = (activity) => {
    if (activity) {
      if (!activity.taskId) {
        return { error: "ERROR", message: "Task is not added" };
      }

      if (activity.activityName === "") {
        // toast.success('Required');

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
      //     message: "activity should have at least 1 asset",
      //   };
      // }

      if (activity.durationMin === 0) {
        return { error: "ERROR", message: "activity should have duration" };
      }

      if (task && task.activityList) {
        task.activityList.forEach((activity) => {
          if (activity.activityName === activityName) {
            return { error: "ERROR", message: "activity should have duration" };
          }
        });
      }
    }
  };

  const navigate = useNavigate();

  const updateTaskHandler = (data) => {
    // const activitiesList = data && data.activityList ? task.activityList.concat(activities) : [];

    //   activities.map(activity => {

    //     activity.assetName = activity.asset;
    //     activity.duration = activity.durationMin;

    //     return activity;
    // });

    data.tenantId = decryptTokenId(localStorage.getItem("tenantId"));

    console.log(data.activityList, "---------------", activities);

    if (data && data.activityList) {
      data.activityList = data.activityList.map((activity) => {
        if (activity.assetNameList) {
          let assets = "";

          for (let i = 0; i < activity.assetNameList.length; i++) {
            if (i === activity.assetNameList.length - 1) {
              assets += activity.assetNameList[i];
            } else {
              assets += activity.assetNameList[i] + ",";
            }
          }

          if (assets) activity.assetName = assets;
        }

        if (activity.assetIDList) {
          let assetId = "";

          for (let i = 0; i < activity.assetIDList.length; i++) {
            if (i === activity.assetIDList.length - 1) {
              assetId += activity.assetIDList[i];
            } else {
              assetId += activity.assetIDList[i] + ",";
            }
          }

          if (assetId) activity.assetId = assetId;
        }

        activity.durationMin = activity.duration;

        console.log(activity);

        return activity;
      });

      // data.activityList = data.activityList.concat(activities);
    }

    const validation = validateTask(data);

    if (validation && validation.error === "ERROR") {
      alert(validation.message);

      if (toast && toast.current)
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: validation.message,
          life: 1000,
        });

      return "ERROR";
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    };

    console.log(options.body);

    const updateTask = async () => {
      await fetch("http://localhost:8095/tasks/saveTask", options)
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);

          if (data.status_code === 200) {
            navigate("/workflow/taskmaster");
          }
        });
    };

    updateTask();

    // setTaskUpdated(taskUpdated === true ? false : true);
  };

  const validateTask = (task) => {
    if (task) {
      if (task.taskName === "") {
        // toast.success('Required');

        return { error: "ERROR", message: "task name is required" };
      }

      if (!task.reviewer) {
        return { error: "ERROR", message: "task reviewer is required" };
      }

      if (task.userDeptsList && !task.userDeptsList.length) {
        return {
          error: "ERROR",
          message: "task should have at least 1 department",
        };
      }

      // if (!task.assetGroup) {
      //   return { error: "ERROR", message: "task should have an asset group" };
      // }

      if (task && task.activityList && !task.activityList.length) {
        return {
          error: "ERROR",
          message: "task should have at least 1 activity",
        };
      }
    }
  };

  const firstStepUpdation = (data) => {
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    };

    console.log(data);

    const firstStepApiCall = async () => {
      await fetch(`http://localhost:8095/tasks/firstStepUpdation`, options)
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
        });
    };

    firstStepApiCall();

    setTaskUpdated(!taskUpdated);
  };

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    const fetchTask = async () => {
      if (task && task.taskId)
        await fetch(
          "http://localhost:8095/tasks/getTaskByTaskId?taskId=" + task.taskId,
          options
        )
          .then((resp) => resp.json())
          .then((data) => {
            console.log("TASKBYID", data.payload);

            setTask(data.payload);
          });
    };

    fetchTask();
  }, [taskUpdated]);

  const renderAssets = (row) => {
    // console.log(row);

    return row.assetNameList.map((assetName) => (
      <Tag rounded value={assetName} />
    ));
  };

  const addConnections = (connections) => {
    console.log(connections);

    const resp = checkAllconnections(connections);

    // if(resp === 'ERROR')
    // return;

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
          console.log(data);

          setActivityConnections(data.payload);

          if (data.status_code === 200) {
            setConnectionSaved(true);

            setTaskUpdated(!taskUpdated);
          }
        })
        .catch((e) => console.log(e));
    };

    saveConnections();
  };

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

  useEffect(
    () => {
      const saveNodePositions = (nodes) => {
        console.log(nodes);

        if (nodes) console.log(!nodes.length);

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

              setTaskUpdated(!taskUpdated);
            })
            .catch((err) => console.log(err));
        };

        saveNodes();
      };

      console.log(activityNodePositions);

      saveNodePositions(activityNodePositions);
    },
    [nodeDataCreated]
    // []
  );

  // useEffect(() => {

  //   console.log('activity positions',activityNodePositions);

  // }, [activityNodePositions]);

  console.log(activityNodePositions);

  useEffect(() => {
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
          location.state.task.taskId,
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

    fetchAllActivityConnections();
  }, [taskUpdated]);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    const fetchAllNodePositions = async () => {
      await fetch(
        "http://localhost:8095/tasks/getAllActivityNodePositionsByTaskId?taskId=" +
          location.state.task.taskId,
        options
      )
        .then((resp) => resp.json())
        .then((data) => {
          setActivityNodePositions(data.payload);

          console.log(data.payload);
        });
    };

    fetchAllNodePositions();
  }, [taskUpdated]);

  const renderSpinner = () => {
    return (
      <ProgressSpinner
        style={{
          position: "relative",
          bottom: 20,
          width: "50rem",
          height: "50rem",
        }}
        strokeWidth="8"
        fill="var(--surface-ground)"
        animationDuration="1s"
      />
    );
  };

  console.log(activityConnections);
  console.log(activityNodePositions);

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

  const handleKeyDown = (event) => {
    if (event.key === "Delete" || event.keyCode === 46) {
      // Code to execute when Delete key is pressed
      alert("Delete key pressed");
    }
  };

  const renderSaveButton = () => {
    return (
      <Button
        type="button"
        icon="pi pi-check"
        onClick={() => {
          console.log(activity);

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

          let nodesData = [];

          nodesData.push({
            taskId: task.taskId,
            activityId: activity.activityId,
            posX: activity.xPos,
            posY: activity.yPos,
          });

          if (nodesData && nodesData.length)
            setActivityNodePositions(nodesData);

          setNodeDataCreated(!nodeDataCreated);

          addActivityDetails(activityDetails);

          setNodePositionChanged(true);
          setNodePositionSaved(true);

          setEditButtonClicked(false);
        }}
      />
    );
  };

  const rowClickHandler = (event) => {
    console.log(event.data);

    setClickedRow(event.data);

    setEditButtonClicked(true);

    setActivity({ ...event.data });
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

    console.log(activity);

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

  console.log(selectedActivity);

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
          console.log(data);

          // setActivityConnections(data.payload);

          if (data.status_code === 200) {
            // setConnectionSaved(true);
            // setTaskUpdated(!taskUpdated);
          }
        });
    };

    // saveConnections();
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
          setAssetData([]);
        } else {
          setAssetData(
            selectedActivity.assetNameList.map((assetName) => {
              return {
                assetName: assetName,
                lookbookname: selectedActivity.logbook,
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

      forceUpdate();
    }
  }, [selectedActivity]);

  const updateActivity = () => {
    let assetId = "";

    console.log(selectedAssets);

    if (selectedAssets) {
      setAssetData(
        selectedAssets.map((selectedAsset) => {
          return {
            assetName: selectedAsset.assetName,
            logbook: selectedLogbook,
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
        : selectedLogbook,
      asset: asset,
      durationMin: durationMin,
      activityAbrv: activityId,
      buffer: buffer,
      enforce: enforce,
      assetId: assetId,
    };

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
            // setTaskUpdated(!taskUpdated);

            const respData = data.payload;

            setSelectedActivity({ ...respData });

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

              let hour = "";

              if (selectedActivity.duration)
                hour = Math.floor(selectedActivity.duration / 60);

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

            setDisconnectedNode(task.activityList[i]);

            // alert('all activities should be connected');

            // if (toast && toast.current)
            //   toast.current.show({
            //     severity: "error",
            //     summary: "Error",
            //     detail: "all activities should be connected",
            //     life: 1500,
            //   });

            return;
          } else {
            // setAllActivitiesConnected(true);
          }
        }

        setAllActivitiesConnected(true);

        console.log(disconnectedNode);

        console.log(allActivitiesConnected);
      }
    }
  };

  useEffect(() => {
    console.log(activityConnections);

    checkAllconnections(activityConnections);
  }, [activityConnections]);

  useEffect(() => {
    console.log(selectedActivity);

    console.log(selectedLogbook);

    setSelectedAssets(
      selectedActivity && selectedActivity.assetNameList
        ? selectedActivity.assetNameList.map((assetName) => {
            return { assetName: assetName, logbook: selectedActivity.logbook };
          })
        : null
    );
  }, [selectedActivity]);

  useEffect(() => {
    if (task && task.activityList) {
      const initialNodes = task.activityList
        ? task.activityList.map((activity) => {
            if (activity) {
              return {
                id: activity.activityId,
                position: {
                  x: Number(activity.xPos),
                  y: Number(activity.yPos),
                },
                data: {
                  label: activity.actAbrv + " (" + activity.duration + " mins)",
                },
              };
            } else return null;
          })
        : "";

      console.log(initialNodes);

      setNodes(initialNodes);
    }

    console.log(activityConnections);

    const edges =
      activityConnections && activityConnections.length
        ? activityConnections.map((activityConnection) => {
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

    forceUpdate();
  }, [task, location]);

  if (task && (task.status === "Published" || task.status === "Pending")) {
    return (
      <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
        <div style={{ textAlign: "center" }}>
          {/* <Dialog
          visible={formDialogVisible}
          onHide={props.onHide}
          style={{ height: "40rem", width: "60rem", textAlign: "center" }}
        > */}
          <>
            <Card style={{ padding: 0 }}>
              <Grid container spacing={2} sx={{ padding: "0.5rem 0.5rem" }}>
                <Grid xs={12}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <IconButton
                      type="button"
                      onClick={() => navigate("/workflow/taskmaster")}
                    >
                      <HomeIcon fontSize="medium" color="info" />
                    </IconButton>
                    <Typography
                      sx={{
                        fontSize: "1rem",
                        marginLeft: "0.2rem",
                        fontWeight: "600",
                      }}
                    >
                      {task.status} Task - {task && task.taskName}
                    </Typography>
                  </div>
                </Grid>
              </Grid>
              <Divider />

              <Grid container spacing={2} sx={{ padding: "1rem" }}>
                <Grid xs={6}>
                  <Grid container spacing={2}>
                    <Grid xs={6}>
                      <Typography sx={{ width: "120px", textAlign: "left" }}>
                        Task Name
                      </Typography>
                    </Grid>

                    <Grid xs={6}>
                      <Typography>{task ? task.taskName : ""}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid xs={6}>
                      <Typography sx={{ width: "120px", textAlign: "left" }}>
                        Description
                      </Typography>
                    </Grid>

                    <Grid xs={6}>
                      <Typography>{task ? task.description : ""}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid xs={6}>
                      <Typography sx={{ width: "120px", textAlign: "left" }}>
                        Approver
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <Chip label={task ? task.reviewer : ""} />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid xs={6}>
                      <Typography sx={{ width: "120px", textAlign: "left" }}>
                        Groups
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <div style={{ display: "grid", rowGap: "0.2rem" }}>
                        {task && task.userGroupsList
                          ? task.userGroupsList.map((userGroup) => {
                              return (
                                <Tag
                                  rounded
                                  style={{ marginRight: "0.5rem" }}
                                  key={userGroup}
                                  value={userGroup}
                                />
                              );
                            })
                          : ""}
                      </div>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid xs={6}>
                      <Typography sx={{ width: "120px", textAlign: "left" }}>
                        Departments
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      {task && task.userDeptsList
                        ? task.userDeptsList.map((userDept) => {
                            return (
                              <Tag
                                rounded
                                style={{ marginRight: "0.5rem" }}
                                value={userDept}
                              />
                            );
                          })
                        : ""}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid xs={6} sx={{ border: "1px solid #e5e7eb", padding: 0 }}>
                  <DataTable
                    value={task ? task.activityList : ""}
                    key="activityId"
                    header="Activities"
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
                </Grid>
              </Grid>
              <Divider />
              <Grid container spacing={2} sx={{ padding: "1rem" }}>
                <Grid xs={12}>
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "30rem",
                      background: "#f3f5f7",
                    }}
                  >
                    {console.log(nodes, edges)}
                    <ReactFlow
                      nodes={nodes}
                      edges={edges}
                      // onNodesChange={onNodesChange}
                      // onEdgesChange={onEdgesChange}
                      // onConnect={onConnect}
                      nodesDraggable={false}
                      edgesUpdatable={false}
                      fitView
                    >
                      {/* {console.log(selectedActivity ? selectedActivity.activityName : '')} */}
                      <Background />
                      <Controls />
                      <MiniMap />
                    </ReactFlow>
                  </div>
                </Grid>
              </Grid>
            </Card>

            {/*<TaskForm task={task}></TaskForm>*/}

            {/* <ActivityDetails
            task={task}
            activityConnections={activityConnections}
            // setActivityConnections={setActivityConnections}
            activityNodePositions={activityNodePositions}
            setActivityNodePositions={setActivityNodePositions}
            addConnections={addConnections}
            nextButtonClicked={nextButtonClicked}
            setNodePositionChanged={setNodePositionChanged}
            setNodePositionSaved={setNodePositionSaved}
            nodeDataCreated={nodeDataCreated}
            setNodeDataCreated={setNodeDataCreated}
            nodesDraggable={false}
            edgesUpdatable={false}
          /> */}
          </>
        </div>
      </Container>
    );
  } else if (
    task &&
    (task.status === "Not Ready" || task.status === "Rejected")
  ) {
    return (
      // <Dialog
      //   visible={formDialogVisible}
      //   onHide={props.onHide}
      //   style={{ height: "90rem", width: "90rem", textAlign: "center" }}
      // >

      <>
        <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
          <div
            //className="card flex justify-content-center"
            style={{ background: "white" }}
          >
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
                    onClick={() => navigate("/workflow/taskmaster")}
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
                    Edit Task {task && task.taskName}
                  </Typography>
                </div>
                <Divider />
                <div>
                  <Stepper
                    ref={stepperRef}
                    orientation="vertical"
                    onChange={(e) => {
                      // console.log('===============EVENT STEPPER',e);
                    }}
                  >
                    <StepperPanel header="Task Details">
                      <div>
                        <div>
                          <Toast ref={toast} />

                          {/* //=========================================================== */}

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
                              <Typography>
                                {task ? task.taskName : ""}
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
                              <Typography>
                                {task ? task.reviewer : ""}
                              </Typography>
                            </Grid>
                          </Grid>

                          {/* <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              columnGap: "1rem",
                              marginBottom: "1rem",
                            }}
                          >
                             <Typography sx={{ width: "150px" }}>
                            Applicable Groups
                            </Typography>
                            {console.log(selectedGroupList)}
                            <MultiSelect
                              value={selectedGroupList}
                              style={{ width: "250px" }}
                              options={groups}
                              optionLabel="groupName"
                              // optionValue="groupId"
                              required
                              onChange={(e) => {
                                setSelectedGroupList(e.value);

                                console.log(e.value);
                              }}
                            />
                          </div> */}

                          {/* <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              columnGap: "1rem",
                              marginBottom: "1rem",
                            }}
                          >
                            <Typography sx={{ width: "150px" }}>
                            Applicable Departments
                            </Typography>

                             {console.log(selectedDepartmentList, depts)} 

                             <MultiSelect
                              style={{ width: "250px" }}
                              value={selectedDepartmentList}
                              options={depts}
                              required
                              onChange={(e) => {
                                setSelectedDepartmentList(e.value);

                                console.log(e.value);
                              }}
                            />
                          </div>  */}

                          {/* <AddAsset assetGroup={assetGroup} assetGroups={assetGroups} setAssetGroup={setAssetGroup} treeData={treeData}
                          setSelectedNode={setSelectedNode}/> 
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              columnGap: "1rem",
                              marginBottom: "1rem",
                            }}
                          >  */}
                          <Typography sx={{ width: "150px" }}>
                            Select Asset group
                          </Typography>
                          <Dropdown
                            options={assetGroups}
                            style={{ width: "250px" }}
                            optionLabel="groupName"
                            value={assetGroup}
                            onChange={(e) => setAssetGroup(e.value)}
                            placeholder="Select Asset Group"
                          />
                          {/* </div> */}
                        </div>
                      </div>

                      <div className="flex pt-3 pb-3 justify-content-start">
                        <Button
                          label="Save Task & Next"
                          icon="pi pi-arrow-right"
                          size="small"
                          iconPos="right"
                          onClick={() => {
                            // if(selectedGroupList)
                            // for(let i = 0;i<selectedGroupList.length;i++){

                            //       if(i === selectedGroupList.length - 1)
                            //       groupList += selectedGroupList[i].groupId;

                            //       else
                            //       groupList += selectedGroupList[i].groupId + ',';

                            // }

                            // let deptsList = '';

                            // console.log('SELECTED DEPT',selectedDepartmentList);

                            // if(selectedDepartmentList){
                            // for(let i = 0;i<selectedDepartmentList.length;i++){

                            //     if(i === selectedDepartmentList.length - 1)
                            //     deptsList += selectedDepartmentList[i];

                            //     else
                            //     deptsList += selectedDepartmentList[i] + ',';

                            //   }
                            // }

                            const groupList = selectedGroupList.map(
                              (group) => group.groupId
                            );

                            if (
                              selectedDepartmentList &&
                              selectedDepartmentList.length &&
                              assetGroup
                            ) {
                              firstStepUpdation({
                                taskId: task.taskId,
                                userGroupsList: groupList,
                                userDeptsList: selectedDepartmentList,
                                assetGroupName: assetGroup
                                  ? assetGroup.groupName
                                  : "",
                              });

                              stepperRef.current.nextCallback();
                            } else {
                              toast.current.show({
                                severity: "error",
                                summary: "Error",
                                detail:
                                  "department and asset group selection is mandatory",
                                life: 3000,
                              });
                            }
                          }}
                        />
                      </div>
                    </StepperPanel>

                    <StepperPanel header="Logbook & Activity">
                      <div>
                        <div>
                          {console.log("selected asset ", selectedNode)}

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
                                  <div>
                                    <Typography>Activity Name</Typography>

                                    <InputText
                                      value={activityName}
                                      placeholder="Enter Activity name"
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
                                      style={{ marginTop: "1rem" }}
                                      type="button"
                                      size="small"
                                      rounded
                                      icon="pi pi-plus-circle"
                                      label="Asset & Logbook"
                                      onClick={() =>
                                        setAssetDialogVisible(true)
                                      }
                                      disabled={treeData && !treeData.id}
                                    />

                                    {console.log(selectedAssets)}

                                    <AssetDialog
                                      onHide={() => {
                                        setAssetDialogVisible(false);
                                        setLogbooks([]);
                                      }}
                                      treeData={treeData}
                                      logbooks={logbooks}
                                      selectedLogbook={selectedLogbook}
                                      setSelectedLogbook={setSelectedLogbook}
                                      setSelectedNode={setSelectedNode}
                                      assetDialogVisible={assetDialogVisible}
                                      setAssetDialogVisible={
                                        setAssetDialogVisible
                                      }
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
                                          stripedRows
                                          tableStyle={{ fontSize: "0.8rem" }}
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
                                      <>
                                        {/* {activityName} does not have assets */}
                                      </>
                                    )}
                                    <Divider
                                      sx={{ marginTop: "1rem", opacity: "0.4" }}
                                    />
                                    <Typography style={{ marginTop: "1rem" }}>
                                      Set Hours
                                    </Typography>
                                    <InputNumber
                                      inputId="minmax-buttons"
                                      value={hour}
                                      // onValueChange={(e) => setHour(e.value)}
                                      onValueChange={(e) => {
                                        if (e.value === 0) {
                                          setMinutes(1);
                                        }
                                        setHour(e.value);
                                      }}
                                      mode="decimal"
                                      showButtons
                                      min={0}
                                    />

                                    <Typography style={{ marginTop: "0.5rem" }}>
                                      Set Minutes
                                    </Typography>
                                    <InputNumber
                                      inputId="minmax-buttons"
                                      value={minutes}
                                      onValueChange={(e) => setMinutes(e.value)}
                                      mode="decimal"
                                      showButtons
                                      min={hour === 0 ? 1 : 0}
                                      max={59}
                                    />

                                    <Typography style={{ marginTop: "0.5rem" }}>
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

                                    <Typography style={{ marginTop: "0.5rem" }}>
                                      Enforce
                                    </Typography>

                                    <div>
                                      <ToggleButton
                                        checked={enforce}
                                        onChange={(e) => setEnforce(e.value)}
                                      />
                                    </div>
                                    <Divider
                                      sx={{
                                        marginTop: "0.5rem",
                                        marginBottom: "0.5rem",
                                        opacity: "0.4",
                                      }}
                                    />
                                    <Toast ref={toast} />
                                    {console.log(activitySelected)}
                                    {activitySelected ? (
                                      <>
                                        <Button
                                          type="button"
                                          label="Update Activity"
                                          size="small"
                                          rounded
                                          onClick={() => {
                                            setActivityUpdated(
                                              !activityUpdated
                                            );

                                            updateActivity();
                                          }}
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

                                          setActivityExists(!activityExists);
                                          resetFields();
                                        }}
                                      ></Button>
                                    )}

                                    <Button
                                      type="button"
                                      label="reset"
                                      size="small"
                                      icon="pi pi-refresh"
                                      severity="warning"
                                      rounded
                                      style={{ marginLeft: "1rem" }}
                                      onClick={() => {
                                        resetFields();
                                        // setActivitySelected(false);

                                        // // setAssetData([]);

                                        // // setSelectedActivity('');

                                        // setActivityName("");

                                        // setActivityId("");

                                        // setSelectedAssets([]);

                                        // setCount(0);

                                        // // let hour = Math.floor(selectedActivity.duration / 60);

                                        // setHour(0);

                                        // // let mins = selectedActivity.duration % 60;

                                        // setMinutes(0);

                                        // setBuffer(0);

                                        // setEnforce(false);
                                      }}
                                    />
                                  </div>
                                </div>
                              </Grid>
                              <Grid sx={{ paddingRight: "1rem" }} item xs={8}>
                                <span>
                                  {console.log(location.state)}
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
                                    nextButtonClicked={nextButtonClicked}
                                    setNextButtonClicked={setNextButtonClicked}
                                    setNodePositionChanged={
                                      setNodePositionChanged
                                    }
                                    setNodePositionSaved={setNodePositionSaved}
                                    nodeDataCreated={nodeDataCreated}
                                    setNodeDataCreated={setNodeDataCreated}
                                    taskUpdated={taskUpdated}
                                    nodesDraggable={true}
                                    selectedActivity={selectedActivity}
                                    setSelectedActivity={setSelectedActivity}
                                    activitySelected={activitySelected}
                                    setActivitySelected={setActivitySelected}
                                    activityUpdated={activityUpdated}
                                    setActivityUpdated={setActivityUpdated}
                                    edgesUpdatable={true}
                                  />
                                </span>
                              </Grid>
                            </Grid>
                          </div>

                          {/* <AddActivityDialog
                    visible={activityDialogVisible}
                    onHide={() => setActivityDialogVisible(false)}
                    assetGroup={assetGroup}
                    logbooks={logbooks}
                  /> */}

                          <span
                            style={{
                              background: "red",
                              width: "200rem",
                              height: "50rem",
                            }}
                          >
                            {console.log(location.state)}
                            <ActivityDetails
                              task={task}
                              activityConnections={activityConnections}
                              setActivityConnections={setActivityConnections}
                              activityNodePositions={activityNodePositions}
                              setActivityNodePositions={
                                setActivityNodePositions
                              }
                              addConnections={addConnections}
                              saveNodePositions={saveNodePositions}
                              nextButtonClicked={nextButtonClicked}
                              setNextButtonClicked={setNextButtonClicked}
                              setNodePositionChanged={setNodePositionChanged}
                              setNodePositionSaved={setNodePositionSaved}
                              nodeDataCreated={nodeDataCreated}
                              setNodeDataCreated={setNodeDataCreated}
                              taskUpdated={taskUpdated}
                              nodesDraggable={true}
                              selectedActivity={selectedActivity}
                              setSelectedActivity={setSelectedActivity}
                              activitySelected={activitySelected}
                              setActivitySelected={setActivitySelected}
                              activityUpdated={activityUpdated}
                              setActivityUpdated={setActivityUpdated}
                              edgesUpdatable={true}
                            />
                          </span>

                          {/* {editButtonClicked ?
                  (<>
                    <DataTable
                      value={task ? task.activityList : []}
                      key="activityName"
                      style={{ position: "relative", bottom: "40rem" }}
                      stripedRows
                      onRowClick={() => {
                       
                        // setEditButtonClicked(true);

                        }}
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
                        body={() => {return <>
                           <InputNumber placeholder="Hours" onChange={(e) => {

                          setHour(e.value);

                          // setActivity({...clickedRow,duration : e.value * 60});

                          setHourChanged(true);

                        }} 
                        min={0}
                        max={59}
                        showButtons/>
                       
                           <InputNumber placeholder="Minutes" onChange={(e) => {

                           setMinutes(e.value);

                           setMinChanged(true);

                          // setActivity({...clickedRow,duration : activity.duration + e.value});

                          console.log(activity.duration);

                        }} 
                        min={0}
                        max={59}
                        showButtons/>


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
                        headerStyle={{
                          backgroundColor: "black",
                          color: "white",
                        }}
                      />
                      <Column
                        field="buffer"
                        header="Buffer(mins)"
                        headerStyle={{
                          backgroundColor: "black",
                          color: "white",
                        }}  
                      ></Column>
                     <Column
                        field=""enforce
                        header="Enforce"
                        headerStyle={{
                          backgroundColor: "black",
                          color: "white",
                        }}
                        body={(row) => {

                          return <Tag value={row.enforce ? 'Yes' : 'No'}/>
                        }}
                      ></Column>
                       <Column
                        field="remarks"
                        header="Remarks"
                        headerStyle={{
                          backgroundColor: "black",
                          color: "white",
                        }}  
                      ></Column>
                       <Column
                        field=""
                        header=""
                        headerStyle={{
                          backgroundColor: "black",
                          color: "white",
                        }}
                        body={renderDeleteButton}
                      ></Column>
                       
                       <Column
                        field=""
                        header=""
                        headerStyle={{
                          backgroundColor: "black",
                          color: "white",
                        }}
                        body={renderSaveButton}
                      ></Column>
                    </DataTable>
                  </>)
                 :
                 (<>
                    <DataTable
                      value={task ? task.activityList : []}
                      key="activityName"
                      style={{ position: "relative", bottom: "40rem" }}
                      stripedRows
                      onRowClick={rowClickHandler}
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
                        body={(row) => {
                          return row && row.assetNameList
                            ? row.assetNameList.map((assetName) => (
                                <Tag value={assetName} />
                              ))
                            : "";
                        }}
                        headerStyle={{
                          backgroundColor: "black",
                          color: "white",
                        }}
                      />
                      <Column
                        field="buffer"
                        header="Buffer(mins)"
                        headerStyle={{
                          backgroundColor: "black",
                          color: "white",
                        }}
                      ></Column>
                       <Column
                        field=""enforce
                        header="Enforce"
                        headerStyle={{
                          backgroundColor: "black",
                          color: "white",
                        }}
                        body={(row) => {

                          return <Tag value={row.enforce ? 'Yes' : 'No'}/>
                        }}
                      ></Column>
                      <Column
                        field="remarks"
                        header="Remarks"
                        headerStyle={{
                          backgroundColor: "black",
                          color: "white",
                        }}
                      ></Column>
                       <Column
                        field=""
                        header=""
                        headerStyle={{
                          backgroundColor: "black",
                          color: "white",
                        }}
                        body={renderDeleteButton}
                      ></Column>
                    </DataTable>
                  </>
                )} */}

                          {/* <LogbookSelectionDialog logbooks={logbooks} selectedLogbook={selectedLogbook} setSelectedLogbook={setSelectedLogbook} visible={logbookDropdownVisible} onHide={() => setLogbookDropdownVisible(false)}/>    */}

                          {/* <Button label='Logbooks' type="button" onClick={() => setLogbookDropdownVisible(true)}/> */}
                        </div>
                      </div>
                      <br />
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
                          onClick={() => {
                            stepperRef.current.prevCallback();
                          }}
                        />

                        <Button
                          label="Save & Next"
                          icon="pi pi-arrow-right"
                          iconPos="right"
                          size="small"
                          rounded
                          disabled={
                            !allActivitiesConnected ||
                            (activityConnections &&
                              activityConnections.length === 0)
                          }
                          onClick={() => {
                            console.log(activityConnections);

                            setNextButtonClicked(!nextButtonClicked);

                            console.log(nextButtonClicked);

                            // console.log(nodePositionChanged, nodePositionsSaved);

                            // if (
                            //   nodePositionChanged &&
                            //   nodePositionsSaved
                            // ) {

                            // renderSpinner();

                            console.log(
                              nextButtonClicked,
                              allActivitiesConnected
                            );

                            console.log(activityConnections);

                            const resp =
                              checkAllconnections(activityConnections);

                            console.log(disconnectedNode);

                            setTimeout(() => {
                              // if(Object.keys(disconnectedNode) && !Object.keys(disconnectedNode).length)
                              if (stepperRef && stepperRef.current)
                                stepperRef.current.nextCallback();
                            }, 1500);
                            // }
                          }}
                        />
                      </div>
                    </StepperPanel>

                    <StepperPanel header="Confirm">
                      <Container maxWidth="lg" sx={{}}>
                        <Card>
                          <Grid container spacing={2}>
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
                                <Typography>{task.taskName}</Typography>
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
                                <Typography>{task.reviewer}</Typography>
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
                                <Typography>{task.description}</Typography>
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
                                {task.userGroupsList.map((userGroup) => {
                                  return (
                                    <Tag
                                      rounded
                                      key={userGroup}
                                      value={userGroup}
                                      style={{ marginRight: "0.5rem" }}
                                    />
                                  );
                                })}
                              </Grid>

                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb",
                                  padding: "0.5rem",
                                }}
                                xs={6}
                              >
                                <Typography sx={{ ml: 7 }}>
                                  Departments
                                </Typography>
                              </Grid>

                              <Grid
                                sx={{
                                  border: "1px solid #dbdbdb",
                                  padding: "0.5rem",
                                }}
                                xs={6}
                              >
                                {task.userDeptsList.map((userDept) => {
                                  return (
                                    <Tag
                                      rounded
                                      key={userDept}
                                      value={userDept}
                                      style={{ marginRight: "0.5rem" }}
                                    />
                                  );
                                })}
                              </Grid>
                            </Grid>
                            <br />
                            <Grid xs={12}>
                              <Typography
                                sx={{
                                  padding: "0.5rem 1rem",
                                  background: "#e9e7e7",
                                }}
                              >
                                Activities
                              </Typography>
                              <>
                                <DataTable
                                  value={task.activityList}
                                  key="activityId"
                                  tableStyle={{ fontSize: "0.8rem" }}
                                >
                                  <Column
                                    field="sequence"
                                    header="Sequence"
                                    headerStyle={{
                                      backgroundColor: "black",
                                      color: "white",
                                    }}
                                  ></Column>
                                  <Column
                                    field="activityName"
                                    header="Name"
                                    headerStyle={{
                                      backgroundColor: "black",
                                      color: "white",
                                    }}
                                  ></Column>
                                  <Column
                                    field="activityAbrv"
                                    header="Activity Identifier"
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
                                    header="Duration(minutes)"
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
                              </>
                            </Grid>
                          </Grid>
                        </Card>
                      </Container>
                      <Container maxWidth="lg">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            margin: "1rem 0",
                          }}
                        >
                          <Button
                            label="Back"
                            severity="secondary"
                            icon="pi pi-arrow-left"
                            iconPos="left"
                            size="small"
                            rounded
                            onClick={() => stepperRef.current.prevCallback()}
                          />
                          <Button
                            label="Confirm & Submit"
                            severity="success"
                            size="small"
                            rounded
                            icon="pi pi-save"
                            onClick={() => {
                              // data.activityList = activities;

                              task.status = "Pending";

                              console.log("Task================", task);

                              if (updateTaskHandler(task) === "ERROR") {
                                if (toast && toast.current)
                                  toast.current.show({
                                    severity: "error",
                                    summary: "Error",
                                    detail: "invalid task",
                                    life: 3000,
                                  });

                                console.log("Task================", task);

                                alert("error");

                                navigate("/workflow/taskmaster");

                                return;
                              }

                              alert("clicked");

                              navigate("/workflow/taskmaster");
                            }}
                          />
                        </div>
                      </Container>
                    </StepperPanel>
                  </Stepper>
                </div>

                {/* 
            <AssetTree data={treeData} setSelectedNodeFn={(node) => {
              console.log("first",node)
              setSelectedNode(node)}}/> */}

                {/* <LogbookDropDown logbooks={logbooks}/>   */}

                {/* <Button onClick={confirm1} type="Submit" label="update" /> */}
                {/* </Dialog> */}
              </div>
            </Card>
          </div>
        </Container>
      </>
    );
  }
}
