import { Container, Divider, Typography } from "@mui/material";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import { decryptTokenId } from "../helper/AuthService";
import CustomNode from "../Task/CustomNode";
import { getAllTaskByTenantId } from "../Task/TaskAPI";
import TaskDetailsDialog from "./TaskDetailsDialog";
import { formatDatetime } from "../JobAssign/helper";

export default function TaskReviewer() {
  const [allTasks, setAllTasks] = useState([]);
  const [taskUpdated, setTaskUpdated] = useState(false);
  const [approver, setApprover] = useState("");
  const [approved, setApproved] = useState(false);
  const [approveDisabled, setApproveDisabled] = useState(false);
  const [rejectDisabled, setRejectDisabled] = useState(false);
  const [selectedTask, setSelectedTask] = useState({});
  const [activityConnections, setActivityConnections] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [reviewDialogVisible, setReviewDialogVisible] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [rowToggler, setRowToggler] = useState(false);
  const [taskDialogVisible, setTaskDialogVisible] = useState(false);
  const [activityNodePositions, setActivityNodePositions] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const nodeTypes = {
    customNode: CustomNode,
  };
  const toast = useRef(null);

  useEffect(() => {
    const fetchAllTasks = async () => {
      // setDataLoading(true);

      const userId = localStorage.getItem(process.env.REACT_APP_USERID);
      console.log("Current User : ", decryptTokenId(userId));

      const data = await getAllTaskByTenantId();
      console.log("Task data::", data);

      if (data) {
        const tasks = data.filter(
          (task) =>
            task.reviewer.toLowerCase() ===
              decryptTokenId(userId).toLowerCase() && task.status === "Pending",
        );

        console.log("Filtered Task : ", tasks);
        setAllTasks(tasks);
      }

      setDataLoading(false);
    };

    fetchAllTasks();
  }, []);

  const getTenantID = () => {
    const env_tenant = process.env.REACT_APP_TENANTID;
    const encryptedTenant = localStorage.getItem(env_tenant);
    const tenant = decryptTokenId(encryptedTenant);
    console.log("Current Tenant ID : ", tenant);
    return tenant;
  };
  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    const fetchAllActivityConnections = async () => {
      const tenantId = getTenantID();
      await fetch(
        `${process.env.REACT_APP_TASKAPI}/task/acivityConnections/${selectedTask.taskId}/${tenantId}`,
        options,
      )
        .then((resp) => resp.json())
        .then((data) => {
          setActivityConnections(data);

          console.log(data);
        })
        .catch((e) => console.log(e));
    };

    if (selectedTask) fetchAllActivityConnections();
  }, [selectedTask]);

  useEffect(() => {
    if (selectedTask && selectedTask.activityList) {
      const initialNodes = selectedTask.activityList
        ? selectedTask.activityList.map((activity) => {
            if (activity) {
              return {
                id: activity.activityId,
                type: "customNode",
                position: {
                  x: Number(activity.xPos),
                  y: Number(activity.yPos),
                },
                data: {
                  label:
                    activity.activityName + " (" + activity.duration + " mins)",
                  // <>
                  //   <p>{activity.activityName}</p>
                  //   <p
                  //     style={{
                  //       width: "100%",
                  //       background: "red",
                  //       display: "flex",
                  //     }}
                  //   >
                  //     {activity.duration} Min
                  //   </p>
                  // </>
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
  }, [selectedTask, activityConnections]);

  const renderApproveTag = (rowData) => {
    return (
      <Tag
        type="button"
        label="Approve"
        onClick={() => {
          rowData.status = "Published";

          let publishTime = new Date();

          publishTime.setHours(publishTime.getHours() + 5);
          publishTime.setMinutes(publishTime.getMinutes() + 30);

          rowData.publishTime = publishTime;
          // alert(rowData.taskId);
        }}
        style={{ height: 40, width: 80 }}
        value="Approve"
      />
    );
  };

  const renderRejectTag = (rowData) => {
    return (
      <Tag
        type="button"
        label="Reject"
        onClick={() => {
          rowData.status = "Not Ready";

          setRejectDisabled(true);

          // alert(rowData.taskId);
        }}
        disabled={true}
        style={{ height: 40, width: 80 }}
        value="Reject"
      />
    );
  };

  const rowClickHandler = (event) => {
    setSelectedTask(event.data);

    console.log(event.data);

    if (toast && toast.current)
      toast.current.show({
        severity: "info",
        summary: "Info",
        detail: `Selected task is ${event.data.taskName}`,
        life: 2000,
      });

    setTaskDialogVisible(true);
  };

  const approveRejectHandler = (task) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(task),
    };

    const updateTask = async () => {
      await fetch(`${process.env.REACT_APP_TASKAPI}/tasks/updateTask`, options)
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);

          setSelectedTask(task);
        });
    };

    updateTask();
  };

  const tasksTable = (
    <Container
      maxWidth="lg"
      sx={{ padding: "0 !important", background: "white" }}
    >
      <Toast ref={toast} />
      <div style={{ border: " 1px solid #e5e7eb" }}>
        <DataTable
          paginator
          rows={10}
          value={allTasks}
          dataKey="taskId"
          stripedRows
          header={<div style={{ padding: "0.5rem 0" }}>Review Tasks</div>}
          onRowClick={rowClickHandler}
          emptyMessage={
            dataLoading ? (
              <ProgressBar
                mode="indeterminate"
                style={{ height: "6px" }}
              ></ProgressBar>
            ) : (
              "No Data Available"
            )
          }
          tableStyle={{ fontSize: "0.8rem" }}
          className="UserInfoTableStyle HeaderColor"
          selectionMode="single"
          // selection={selectedTask}
          // onSelectionChange={(e) => setSelectedTask(e.value)}
        >
          {/* <Column body={renderAccordionForApproveOrReject}></Column> */}

          <Column field="taskId" header="Task ID"></Column>
          <Column field="taskName" header="Task Name"></Column>
          <Column
            field="creationTime"
            header="Creation Time"
            body={(rowData) => formatDatetime(rowData.creationTime)}
          ></Column>
          <Column field="creator" header="Creator"></Column>
          <Column
            field="hourMinutes"
            style={{ width: "10rem" }}
            header="Total Duration"
          ></Column>
          {/* <Column field="reviewer" header="Task Reviewer"></Column> */}

          {/* <Column field="taskId" header='Approve' body={renderApproveTag}></Column>
      <Column field="taskId" header='Reject' body={renderRejectTag}></Column> */}
        </DataTable>
      </div>
    </Container>
  );

  if (taskDialogVisible === false) return tasksTable;
  else {
    return (
      <Container
        maxWidth="lg"
        sx={{ padding: "0 !important", background: "white" }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            icon="pi pi-home"
            rounded
            text
            severity="info"
            onClick={() => setTaskDialogVisible(false)}
          />

          <Typography
            style={{
              textAlign: "center",
              fontSize: "0.8rem",
              fontWeight: "600",
            }}
          >
            Task Details
          </Typography>
        </div>
        <Divider />

        <TaskDetailsDialog
          task={selectedTask}
          visible={taskDialogVisible}
          setTaskDialogVisible={setTaskDialogVisible}
        />

        {/* {activityConnections && <ActivityDetails
          task={selectedTask}
          activityConnections={activityConnections}
          setActivityConnections={setActivityConnections}
          activityNodePositions={activityNodePositions}
          setActivityNodePositions={setActivityNodePositions}
          // addConnections={addConnections}
          // nextButtonClicked={nextButtonClicked}
          // setNextButtonClicked={setNextButtonClicked}
          // setNodePositionChanged={setNodePositionChanged}
          // setNodePositionSaved={setNodePositionSaved}
          // nodeDataCreated={nodeDataCreated}
          // setNodeDataCreated={setNodeDataCreated}
          taskUpdated={taskUpdated}
          nodesDraggable={false}
          // selectedActivity={selectedActivity}
          // setSelectedActivity={setSelectedActivity}
          // activitySelected={activitySelected}
          // setActivitySelected={setActivitySelected}
          // activityUpdated={activityUpdated}
          // setActivityUpdated={setActivityUpdated}
          edgesUpdatable={false}
        /> } */}

        <div
          style={{
            width: "100%",
            height: "30rem",
            background: "#dddddd",
            //borderRadius: "0.6rem",
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
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
      </Container>
    );
  }
}
