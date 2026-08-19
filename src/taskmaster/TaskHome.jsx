import Card from "@mui/material/Card";
import { useContext, useEffect, useState } from "react";

import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Knob } from "primereact/knob";

import TaskFormDialog from "./TaskFormDialog";
import { Ripple } from "primereact/ripple";
import AddTaskFormDialog from "./AddTaskFormDialog";
import { Button } from "primereact/button";
import MyContext from "./MyContext";
import { DataTable } from "primereact/datatable";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import {
  Avatar,
  Chip,
  Container,
  Divider,
  Fab,
  Grid,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ProgressBar } from "primereact/progressbar";
//
import "primereact/resources/themes/saga-blue/theme.css"; // Import a theme
import "primereact/resources/primereact.min.css"; // Core CSS
import "primeicons/primeicons.css"; // Icons
import "primeflex/primeflex.css"; // Flex utilities (optional)
import TouchRipple from "@mui/material/ButtonBase/TouchRipple";
import { Gauge, gaugeClasses } from "@mui/x-charts";
import { decryptTokenId } from "../helper/AuthService";

export default function TaskHome() {
  const [allTasks, setAllTasks] = useState([]);
  const [publishedTasks, setAllPublishedTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [draftTasks, setDraftTasks] = useState([]);
  const [rejectedTasks, setRejectedTasks] = useState([]);
  const [values, setValues] = useState([]);
  const [selectedTask, setSelectedTask] = useState({});
  const [rejectedCardStyle, setRejectedCardStyle] = useState({});
  const [allCardStyle, setAllCardStyle] = useState({});
  const [publishCardStyle, setPublishCardStyle] = useState({});
  const [pendingCardStyle, setPendingCardStyle] = useState({});
  const [draftStyle, setDraftStyle] = useState({});
  const [taskDialogVisible, setTaskDialogVisible] = useState(false);
  const [addTaskFormDialogVisible, setAddTaskFormDialogVisible] =
    useState(false);
  const [allGroups, setAllGroups] = useState([]);
  const [allDepts, setAllDepts] = useState([]);
  const [allAssetGroups, setAllAssetGroups] = useState([]);
  const [activityConnections, setActivityConnections] = useState([]);
  const [users, setUsers] = useState([]);
  const [taskUpdated, setTaskUpdated] = useState(false);
  const [activityNodePositions, setActivityNodePositions] = useState([]);
  const [taskAdded, setTaskAdded] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskId, setTaskId] = useState("");
  const [edges, setEdges] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  let options = {
    state: {
      task: {},
      groups: allGroups,
      depts: allDepts,
      assetGroups: allAssetGroups,
      activityConnections: activityConnections,
    },
  };

  const newColors = ["#ff6f00", "#0097a7"];

  useEffect(() => {
    const fetchAllTasks = async () => {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      await fetch("http://localhost:8095/tasks/alltasks", options)
        .then((resp) => resp.json())
        .then((data) => {
          console.log("Newdata", data.payload);

          setAllTasks(data.payload);

          console.log(data.payload);

          setValues(data.payload);
          setDataLoading(false);
        });
      // .catch((e) => navigate("/"));
    };
    setDataLoading(true);
    fetchAllTasks();
  }, [taskUpdated]);

  useEffect(() => {
    if (!allTasks) {
      setAllTasks([]);
    }

    if (allTasks !== null) {
      console.log("Inside The If : ", allTasks);
      const published = allTasks.filter((task) => task.status === "Published");
      console.log(published);
      setAllPublishedTasks(published);
      setPendingTasks(allTasks.filter((task) => task.status === "Pending"));
      setDraftTasks(allTasks.filter((task) => task.status === "Not Ready"));
      setRejectedTasks(allTasks.filter((task) => task.status === "Rejected"));
    }
  }, [allTasks]);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    const fetchData = async () => {
      await fetch(
        "http://localhost:8082/usermodule/allusersbytenantid/" +
          decryptTokenId(localStorage.getItem("tenantId")),
        options
      )
        .then((resp) => resp.json())
        .then((data) => {
          if (data) {
            console.log(data.payload);

            // data.payload.sort((a,b) => a.userName.charAt(0) - b.userName.charAt(0));

            setUsers(data.payload);
          }

          // console.log(rows);
        });
      // .catch(e => navigate('/'));
    };

    fetchData();
  }, []);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    const fetchAllGroups = async () => {
      await fetch(
        "http://localhost:8082/usermodule/getallgroupdetails/" +
          decryptTokenId(localStorage.getItem("tenantId")),
        options
      )
        .then((resp) => resp.json())
        .then((data) => {
          if (data) setAllGroups(data.payload);

          console.log("userGroups", allGroups);
        });
      // .catch(e => navigate('/'));
    };

    fetchAllGroups();
  }, []);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    const fetchAllDepts = async () => {
      await fetch(
        "http://localhost:8082/usermodule/getalldeptartments",
        options
      )
        .then((resp) => resp.json())
        .then((data) => {
          if (data) {
            setAllDepts(data.payload);

            console.log("user dept", allDepts);
          }
        });
      // .catch(e => navigate('/'));
    };

    fetchAllDepts();
  }, []);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    const fetchAllAssetGroups = async () => {
      await fetch(
        "http://localhost:8088/api/assetgroups/" +
          decryptTokenId(localStorage.getItem("tenantId")),
        options
      )
        .then((resp) => resp.json())
        .then((data) => {
          setAllAssetGroups(data);

          console.log(data);
        });
      // .catch(e => navigate('/'));
    };

    fetchAllAssetGroups();
  }, []);

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
          taskId,
        options
      )
        .then((resp) => resp.json())
        .then((data) => {
          setActivityConnections(data.payload);

          // if (options.state) options.state.activityConnections = data.payload;

          console.log(data);

          console.log(data.payload);

          if (options && options.state) options.state.edges = data.payload;
        });
      // .catch(e => navigate('/'));
    };

    fetchAllActivityConnections();
  }, [taskId]);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    const fetchAllNodePositions = async () => {
      if (selectedTask)
        await fetch(
          "http://localhost:8095/tasks/getAllActivityNodePositionsByTaskId?taskId=" +
            selectedTask.taskId,
          options
        )
          .then((resp) => resp.json())
          .then((data) => {
            setActivityNodePositions(data.payload);

            console.log(data.payload);
          });
      // .catch(e => navigate('/'));
    };

    fetchAllNodePositions();
  }, [selectedTask]);

  const updateTaskHandler = (data) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const updateTask = async () => {
      await fetch("http://localhost:8095/tasks/saveTask", options)
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
        });
      // .catch(e => navigate('/'));
    };

    updateTask();

    setTaskUpdated(taskUpdated === true ? false : true);
  };

  const addTaskHandler = (task) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    };

    console.log("options", options);

    const addTask = async () => {
      await fetch("http://localhost:8095/tasks/saveTask", options)
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
        });
      // .catch(e => navigate('/'));
    };

    addTask();

    setTaskUpdated(taskUpdated === true ? false : true);
  };

  //initialize card style

  useEffect(() => {
    setAllCardStyle({
      height: 100,
      width: "33%",
      margin: 20,
      backgroundColor: "#eeeeee",
      color: "black",
    });

    setPublishCardStyle({
      height: 100,
      width: "33%",
      margin: 20,
      backgroundColor: "#eeeeee",
      color: "black",
    });

    setPendingCardStyle({
      height: 100,
      width: "33%",
      margin: 20,
      backgroundColor: "#eeeeee",
      color: "black",
    });

    setDraftStyle({
      height: 100,
      width: "33%",
      margin: 20,
      backgroundColor: "#eeeeee",
      color: "black",
    });

    setRejectedCardStyle({
      height: 100,
      width: "33%",
      margin: 20,
      backgroundColor: "#eeeeee",
      color: "black",
    });
  }, [allTasks]);

  const allTaskClickHandler = () => {
    setValues(allTasks);

    setAllCardStyle({
      ...allCardStyle,
      backgroundColor: "#1c1936",
      color: "white",
    });

    setPublishCardStyle({
      ...publishCardStyle,
      backgroundColor: "#eeeeee",
      color: "black",
    });

    setPendingCardStyle({
      ...pendingCardStyle,
      backgroundColor: "#eeeeee",
      color: "black",
    });

    setDraftStyle({
      ...draftStyle,
      backgroundColor: "#eeeeee",
      color: "black",
    });

    setRejectedCardStyle({
      ...rejectedCardStyle,
      backgroundColor: "#eeeeee",
      color: "black",
    });
  };

  const allPublishedClickHandler = () => {
    setValues(publishedTasks);

    setAllCardStyle({
      ...allCardStyle,
      backgroundColor: "#eeeeee",
      color: "black",
    });

    setPublishCardStyle({
      ...publishCardStyle,
      backgroundColor: "#26a03a",
      color: "white",
    });

    setPendingCardStyle({
      ...pendingCardStyle,
      backgroundColor: "#eeeeee",
      color: "black",
    });

    setDraftStyle({
      ...draftStyle,
      backgroundColor: "#eeeeee",
      color: "black",
    });

    setRejectedCardStyle({
      ...rejectedCardStyle,
      backgroundColor: "#eeeeee",
      color: "black",
    });
  };

  const allPendingClickHandler = () => {
    setValues(pendingTasks);

    setAllCardStyle({
      ...allCardStyle,
      backgroundColor: "#eeeeee",
      color: "black",
    });

    setPublishCardStyle({
      ...publishCardStyle,
      backgroundColor: "#eeeeee",
      color: "black",
    });

    setPendingCardStyle({
      ...pendingCardStyle,
      backgroundColor: "#394e97",
      color: "white",
    });

    setDraftStyle({
      ...draftStyle,
      backgroundColor: "#eeeeee",
      color: "black",
    });

    setRejectedCardStyle({
      ...rejectedCardStyle,
      backgroundColor: "#eeeeee",
      color: "black",
    });
  };

  const allDraftClickHandler = () => {
    setValues(draftTasks);

    setAllCardStyle({
      ...allCardStyle,
      backgroundColor: "#eeeeee",
      color: "black",
    });

    setPublishCardStyle({
      ...publishCardStyle,
      backgroundColor: "#eeeeee",
      color: "black",
    });

    setPendingCardStyle({
      ...pendingCardStyle,
      backgroundColor: "#eeeeee",
      color: "black",
    });

    setDraftStyle({
      ...draftStyle,
      backgroundColor: "#97800c",
      color: "white",
    });

    setRejectedCardStyle({
      ...rejectedCardStyle,
      backgroundColor: "#eeeeee",
      color: "black",
    });
  };

  const allrejectedClickHandler = () => {
    setValues(rejectedTasks);

    setAllCardStyle({
      ...allCardStyle,
      backgroundColor: "#eeeeee",
      color: "black",
    });

    setPublishCardStyle({
      ...publishCardStyle,
      backgroundColor: "#eeeeee",
      color: "black",
    });

    setPendingCardStyle({
      ...pendingCardStyle,
      backgroundColor: "#eeeeee",
      color: "black",
    });

    setDraftStyle({
      ...draftStyle,
      backgroundColor: "#eeeeee",
      color: "black",
    });

    setRejectedCardStyle({
      ...rejectedCardStyle,
      backgroundColor: "#EF4444",
      color: "white",
    });
  };

  const renderDepartment = (rowData) => {
    const departments = rowData.userDeptsList;

    return departments.map((department) => (
      <div style={{ marginBottom: "0.3rem" }}>
        <Chip
          variant="outlined"
          color="primary"
          size="small"
          key={department}
          rounded
          label={department}
        ></Chip>
      </div>
    ));
  };
  const renderSatus = (rowData) => {
    const allUserStatus = rowData.status;
    console.log("statsuData", allUserStatus);
    return (
      <>
        <Tag
          rounded
          style={{ fontWeight: "600" }}
          value={allUserStatus}
          severity={
            allUserStatus === "Published"
              ? "success"
              : allUserStatus === "Pending"
              ? "info"
              : allUserStatus === "Not Ready" || allUserStatus === "Rejected"
              ? "danger"
              : ""
          }
        ></Tag>
      </>
    );
    // return allUserStatus.map((status, index) => (
    //   console.log("statusInfo",status)

    //));
  };

  const renderGroup = (rowData) => {
    const groups = rowData.userGroupsList;
    console.log("groupData", groups);

    return groups.map((group) => (
      <div style={{ marginBottom: "0.3rem" }}>
        <Chip key={group} size="small" label={group}></Chip>
      </div>
    ));
  };

  const cretetorInfo = (rowData) => {
    const backgroundColor = newColors[0];
    console.log(`checkColor ${backgroundColor}`);
    const creatorName = rowData.creator;
    if (creatorName === "" || creatorName === null) {
      return "";
    }

    // const creatorNameFullNAme=(rowData.creator) ? null  : (rowData.creator).split("@",1);
    const creatorNameParts = creatorName.charAt(0).toUpperCase();

    //const creatorNameLastName = rowData.creator.split("@", 1)[0].split(".")[1];

    const creationTime = rowData.creationTime;
    console.log(
      "cretetorInfo",
      // creatorNameFirstName,
      // creatorNameLastName,
      creatorNameParts,
      creatorName,
      creationTime
    );
    return (
      <>
        <div
          style={{
            display: "flex",
            columnGap: "1rem",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <>
            {/* <Avatar
              sizes=""
              sx={{
                bgcolor: "#0097a7",
                fontSize: "0.95rem",
                width: 32,
                height: 32,
              }}
            >
              {creatorNameParts}
            </Avatar> */}
          </>
          <div style={{ display: "grid", justifyItems: "center" }}>
            <Typography>{creatorName}</Typography>
            <Chip size="small" label={creationTime} />
          </div>
        </div>
      </>
    );
  };
  const navigate = useNavigate();

  const onRowClickHandler = (event) => {
    setSelectedTask(event.data);

    console.log(event.data);

    setTaskId(event.data.taskId);

    // setTaskDialogVisible(true);

    //  fetchAllActivityConnections(event.data.taskId);

    setTimeout(() => {
      options.state = {
        task: event.data,
        groups: allGroups,
        depts: allDepts,
        assetGroups: allAssetGroups,
        edges: edges,
      };

      navigate("/workflow/edittask", options);
    }, 1500);
  };

  console.log(activityConnections);
  console.log(taskId);
  console.log(selectedTask);

  useEffect(() => {
    setTaskId(selectedTask ? selectedTask.taskId : "");

    console.log(taskId);
  }, [selectedTask]);

  useEffect(() => {
    const fetchAllActivityConnections = (taskId) => {
      const option = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const fetchActivityConnections = async () => {
        console.log(selectedTask);

        if (selectedTask && selectedTask.taskId) {
          await fetch(
            "http://localhost:8095/tasks/getAllActivityConnectionsByTaskId?taskId=" +
              selectedTask.taskId,
            option
          )
            .then((resp) => resp.json())
            .then((data) => {
              setActivityConnections(data.payload);

              console.log(data);

              console.log(data.payload);

              console.log(data.payload);

              console.log(activityConnections);
            });
          // .catch(e => navigate('/'));
        }
      };

      fetchActivityConnections();
    };

    fetchAllActivityConnections();
  }, [selectedTask]);

  const addTaskNavigationHandler = () => {
    const options = {
      state: {
        users: users,
        groups: allGroups,
        depts: allDepts,
        assetGroups: allAssetGroups,
        task: {
          taskId: "",
          taskName: "", // Shorthand property assignment, assuming taskName is defined
          reviewer: "",
          description: "",
          userGroupsList: [],
          userDeptsList: [],
          assetGroup: "",
          status: "",
          creator: "", // Assign the creator property from context
          creationTime: "",
        },
      },
    };

    navigate("/workflow/addtask", options);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ padding: "0 !important", background: "white" }}
    >
      <span
        style={{
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
          position: "static",
        }}
      >
        <Card
          className="card1 p-ripple shadow-2"
          style={allCardStyle}
          onClick={allTaskClickHandler}
        >
          <Grid container>
            <Grid xs={12}>
              <Typography sx={{ padding: "0.2rem 0" }}>All Tasks</Typography>
            </Grid>
            <Divider />
            <Grid
              sx={{ background: "white" }}
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              xs={12}
            >
              {/* <Knob
                style={{ margin: "0.2rem 0" }}
                value={allTasks ? allTasks.length : 0}
                max={allTasks ? allTasks.length : 0}
                valueColor="#757575"
                size={70}
                disabled
              /> */}
              <Gauge
                width={70}
                height={70}
                sx={(theme) => ({
                  [`& .${gaugeClasses.valueArc}`]: {
                    fill: "#9e9e9e",
                  },
                })}
                value={allTasks ? allTasks.length : 0}
                valueMax={allTasks ? allTasks.length : 0}
              />
            </Grid>
          </Grid>
          <Ripple
            pt={{
              root: { style: { background: "rgba(75, 175, 80, 0.3)" } },
            }}
          />
        </Card>

        <Card
          className="card2 p-ripple shadow-2"
          style={publishCardStyle}
          onClick={allPublishedClickHandler}
        >
          <Grid container>
            <Grid
              //sx={{ background: "#eeeeee" }}
              xs={12}
            >
              <Typography sx={{ padding: "0.2rem 0" }}>
                Published Tasks
              </Typography>
            </Grid>
            <Divider />
            <Grid
              sx={{ background: "white" }}
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              xs={12}
            >
              {/* <Knob
                style={{ margin: "0.2rem 0" }}
                value={publishedTasks ? publishedTasks.length : 0}
                max={allTasks ? allTasks.length : 0}
                valueColor="#43a047"
                size={70}
                disabled
              /> */}
              <Gauge
                width={70}
                height={70}
                sx={(theme) => ({
                  [`& .${gaugeClasses.valueArc}`]: {
                    fill: "#43a047",
                  },
                })}
                value={publishedTasks ? publishedTasks.length : 0}
                valueMax={allTasks ? allTasks.length : 0}
              />
            </Grid>
          </Grid>
        </Card>

        <Card
          className="card3 p-ripple shadow-2"
          style={pendingCardStyle}
          onClick={allPendingClickHandler}
        >
          <Grid container>
            <Grid xs={12}>
              <Typography sx={{ padding: "0.2rem 0" }}>
                Pending Tasks
              </Typography>
            </Grid>
            <Divider />
            <Grid
              sx={{ background: "white" }}
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              xs={12}
            >
              {/* <Knob
                style={{ margin: "0.2rem 0" }}
                value={pendingTasks ? pendingTasks.length : 0}
                max={allTasks ? allTasks.length : 0}
                valueColor="#0288d1"
                size={70}
                disabled
              /> */}
              <Gauge
                width={70}
                height={70}
                sx={(theme) => ({
                  [`& .${gaugeClasses.valueArc}`]: {
                    fill: "#0288d1",
                  },
                })}
                value={pendingTasks ? pendingTasks.length : 0}
                valueMax={allTasks ? allTasks.length : 0}
              />
            </Grid>
          </Grid>
        </Card>

        <Card
          className="card4 p-ripple shadow-2"
          style={draftStyle}
          onClick={allDraftClickHandler}
        >
          <Grid container>
            <Grid xs={12}>
              <Typography sx={{ padding: "0.2rem 0" }}>Draft Tasks</Typography>
            </Grid>
            <Divider />
            <Grid
              sx={{ background: "white" }}
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              xs={12}
            >
              {/* <Knob
                style={{ margin: "0.2rem 0" }}
                value={draftTasks ? draftTasks.length : 0}
                max={allTasks ? allTasks.length : 0}
                valueColor="#ffd600"
                size={70}
                disabled
              /> */}
              <Gauge
                width={70}
                height={70}
                sx={(theme) => ({
                  [`& .${gaugeClasses.valueArc}`]: {
                    fill: "#ffd600",
                  },
                })}
                value={draftTasks ? draftTasks.length : 0}
                valueMax={allTasks ? allTasks.length : 0}
              />
            </Grid>
          </Grid>
        </Card>

        <Card
          className="card5 p-ripple shadow-2"
          style={rejectedCardStyle}
          onClick={allrejectedClickHandler}
        >
          <Grid container>
            <Grid xs={12}>
              <Typography sx={{ padding: "0.2rem 0" }}>
                Rejected Tasks
              </Typography>
            </Grid>
            <Divider />
            <Grid
              sx={{ background: "white" }}
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              xs={12}
            >
              {/* <Knob
                style={{ margin: "0.2rem 0" }}
                value={rejectedTasks ? rejectedTasks.length : 0}
                max={allTasks ? allTasks.length : 0}
                valueColor="#f44336"
                size={70}
                disabled
              /> */}
              <Gauge
                width={70}
                height={70}
                sx={(theme) => ({
                  [`& .${gaugeClasses.valueArc}`]: {
                    fill: "#f44336",
                  },
                })}
                value={rejectedTasks ? rejectedTasks.length : 0}
                valueMax={allTasks ? allTasks.length : 0}
              />
            </Grid>
          </Grid>
        </Card>
      </span>

      {/* <InputText value={taskName} placeholder="Enter task name to filter" onChange={(e) => {
       
       setTaskName(e.target.value);

       console.log(e.target.value);

       if(taskName)
       setValues(values.filter(value => value.taskName.includes(e.target.value)));
      
       else setValues(allTasks);
        
      }}/> */}

      <DataTable
        //size="small"
        className="UserInfoTableStyle"
        showGridlines
        value={values}
        dataKey="taskId"
        stripedRows="true"
        header={
          <>
            <h4 style={{ fontSize: "1rem", padding: "0.4rem 0", margin: 0 }}>
              Task Information
            </h4>
          </>
        }
        selectionMode="single"
        paginator
        rows={10}
        emptyMessage={
          dataLoading ? (
            <ProgressBar
              mode="indeterminate"
              style={{ height: "6px" }}
            ></ProgressBar>
          ) : (
            "No Data Available "
          )
        }
        // loading
        //   </>

        selection={selectedTask}
        onSelectionChange={(e) => setSelectedTask(e.value)}
        onRowClick={onRowClickHandler}
        tableStyle={{ fontSize: "0.8rem" }}
      >
        <Column
          field="taskName"
          bodyStyle={{
            fontSize: "0.8rem",
            minWidth: "6rem",
          }}
          sortable
          header="Task Name"
        ></Column>
        {/* <Column field="creator" sortable header="Creator"></Column> */}
        <Column body={cretetorInfo} sortable header="Creator Info"></Column>
        {/* <Column field="creationTime" sortable header="Creation Time"></Column> */}
        <Column
          field="hourMinutes"
          sortable
          header="Total Duration(H:M)"
        ></Column>
        <Column field="noOfActivites" header="Activities"></Column>
        <Column header="Department" body={renderDepartment}></Column>
        <Column header="Group" body={renderGroup}></Column>
        <Column field="description" header="Description"></Column>
        <Column
          bodyStyle={{
            fontSize: "0.8rem",
            minWidth: "6rem",
          }}
          body={renderSatus}
          sortable
          header="Status"
        ></Column>
        <Column field="assetGroup" header="Asset Group"></Column>
        <Column field="reviewer" sortable header="Reviewer"></Column>
      </DataTable>

      {/* <TaskFormDialog task={selectedTask} groups={allGroups} depts={allDepts} assetGroups={allAssetGroups}
       activityConnections={activityConnections} activityNodePositions={activityNodePositions} visible={taskDialogVisible} onHide={() => {
        
        setTaskDialogVisible(false);

        setSelectedTask(null);

        }}
       updateTaskHandler={updateTaskHandler} logbooks={[]}/>  */}

      {/*========/==========THIS IS FOR ADDING A NEW TASK}==========/===========*/}

      {/* <Button
        id=""
        onClick={addTaskNavigationHandler}
        style={{
          position: "relative",
          // left: "90rem",
          // top: "40rem",
          backgroundColor: "#002db3",
        }}
      >
        <i className="pi pi-plus-circle"></i>
      </Button> */}
      <Fab
        size="small"
        onClick={addTaskNavigationHandler}
        sx={{
          position: "fixed",
          left: "94%",
          top: "86%",
        }}
        color="primary"
        aria-label="add"
      >
        <AddIcon />
      </Fab>

      {/* <AddTaskFormDialog visible={addTaskFormDialogVisible} onHide={() => setAddTaskFormDialogVisible(false)} users={users} groups={allGroups} depts={allDepts} assetGroups={allAssetGroups} addTaskHandler={addTaskHandler}
       logbooks={[]}  activityConnections={activityConnections} activityNodePositions={activityNodePositions}/> */}
    </Container>
  );
}
