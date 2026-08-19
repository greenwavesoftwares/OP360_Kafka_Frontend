import {
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { Column } from "primereact/column";
import { styled } from "@mui/material/styles";
import { Tag } from "primereact/tag";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import ActivityDetails from "../taskmaster/ActivityDetails";
import { Button } from "primereact/button";
import { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { decryptTokenId } from "../helper/AuthService";
import { InputText } from "primereact/inputtext";
import TaskReviewer from "./taskReviewer";
import { Publish } from "@mui/icons-material";

export default function TaskDetailsDialog(props) {
  const { task, visible, onHide, setTaskDialogVisible, taskDialogVisible } =
    props;
  const toast = useRef(null);

  const [visibleRemarks, setVisibleRemarks] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleRejectClick = () => {
    setVisibleRemarks(true);
  };

  const handleYesClick = () => {
    console.log(inputValue);
    task.status = "Rejected";
    task.remarks = inputValue;
    // task = { ...task, status: "Rejected", remarks: inputValue };
    console.log("Updated Task : ", task);
    updateTaskStatus(task);
    setVisibleRemarks(false);
    // navigate("/workflow/taskreview");
    setTaskDialogVisible(false);
  };

  const handleNoClick = () => {
    setVisibleRemarks(false);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const navigate = useNavigate();
  const getTenantID = () => {
    const env_tenant = process.env.REACT_APP_TENANTID;
    const encryptedTenant = localStorage.getItem(env_tenant);
    const tenant = decryptTokenId(encryptedTenant);
    console.log("Current Tenant ID : ", tenant);
    return tenant;
  };
  const fetchUpdateTaskStatus = async (task) => {
    console.log("Calling Inside the Update : ");
    const tenantId = getTenantID();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_TASKAPI}/task/updateStatusOrRemarks/${tenantId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(task),
        }
      );
      console.log("After update:" + response.ok);
      if (response.ok) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      return false;
    }
  };
  function formatDuration(rowData) {
    const minutes = rowData.duration; // Get total minutes from rowData
    const days = Math.floor(minutes / 1440); // Calculate total days
    const hours = Math.floor((minutes % 1440) / 60); // Calculate remaining hours after extracting days
    const mins = minutes % 60; // Calculate remaining minutes after extracting hours

    // Return formatted duration string, including days, hours, and minutes
    return `${days > 0 ? `${days}d ` : ""}${
      hours > 0 ? `${hours}h ` : ""
    }${mins}m`;
  }
  // Update task status function
  const updateTaskStatus = (task) => {
    console.log(task);
    const status = fetchUpdateTaskStatus(task);
    if (status !== undefined && status === true) setTaskDialogVisible(false);
    return status;
  };
  const handleApproveClick = async (task, updateTaskStatus) => {
    task.status = "Published";
    const status = await updateTaskStatus(task);
    console.log("return Status : ", status);

    if (status === true && status !== undefined) {
      setTaskDialogVisible(false);
    }
  };
  const renderAssets = (row) => {
    // console.log(row);
    return row && row.assetNameList
      ? row.assetNameList.map(
          (assetName) => assetName && <Tag value={assetName} />
        )
      : "";
  };

  return visible ? (
    <Container
      maxWidth="lg"
      sx={{ padding: "0 !important", background: "white" }}
    >
      <Toast ref={toast} />

      <Grid container style={{ padding: "0 2rem", margin: "1rem 0" }}>
        <Grid xs={6}>
          <Typography style={{ padding: "0.3rem" }}>Task Name</Typography>
        </Grid>

        <Grid xs={6}>
          <Typography style={{ padding: "0.3rem" }}>
            {task ? task.taskName : ""}
          </Typography>
        </Grid>

        <Grid xs={6}>
          <Typography style={{ padding: "0.3rem" }}>Approver</Typography>
        </Grid>

        <Grid xs={6}>
          <Typography style={{ padding: "0.3rem" }}>
            {task ? task.reviewer : ""}
          </Typography>
        </Grid>

        <Grid xs={6}>
          <Typography style={{ padding: "0.3rem" }}>Description</Typography>
        </Grid>

        <Grid xs={6}>
          <Typography style={{ padding: "0.3rem" }}>
            {task ? task.description : ""}
          </Typography>
        </Grid>

        {/* <Grid xs={6}>
          <Typography style={{ padding: "0.3rem" }}>Groups</Typography>
        </Grid>

        <Grid xs={6}>
          {task && task.userGroupsList
            ? task.userGroupsList.map((userGroup) => {
                return (
                  <Chip
                    rounded
                    color="info"
                    size="small"
                    style={{ marginRight: "0.3rem" }}
                    key={userGroup}
                    label={userGroup}
                  />
                );
              })
            : ""}
        </Grid>

        <Grid xs={6}>
          <Typography style={{ padding: "0.3rem" }}>Departments</Typography>
        </Grid>

        <Grid xs={6}>
          {task && task.userDeptsList
            ? task.userDeptsList.map((userDept) => {
                return (
                  <Chip
                    rounded
                    size="small"
                    style={{ marginRight: "0.3rem", fontSize: "0.8rem" }}
                    key={userDept}
                    label={userDept}
                  />
                );
              })
            : ""}
       
        </Grid> */}
      </Grid>

      <Grid container style={{ padding: "0rem", marginTop: "1rem" }}>
        <Grid xs={12}>
          <>
            <DataTable
              tableStyle={{ fontSize: "0.8rem", border: "1px solid #e5e7eb" }}
              value={task && task.activityList}
              key="activityId"
              paginator
              rows={10}
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
                field="logbook"
                header="Logbook"
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
              <Column
                header="Groups"
                // field="userGroup"
                // body={renderAssets}
                headerStyle={{
                  backgroundColor: "black",
                  color: "white",
                }}
                body={(rowData) => rowData?.activityUserGroupList[0]}
              />
              <Column
                field="duration"
                header="Duration"
                headerStyle={{
                  backgroundColor: "black",
                  color: "white",
                }}
                body={formatDuration}
              ></Column>
            </DataTable>
          </>

          {/* <ActivityDetails task={task} activityConnections={activityConnections}/> */}
        </Grid>
      </Grid>
      <Grid container style={{ padding: "0 2rem", margin: "1.2rem 0" }}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          xs={12}
        >
          {/* <Typography style={{ textAlign: "center" }}>Activities</Typography> */}

          <Button
            type="button"
            label="Approve"
            size="small"
            icon="pi pi-check"
            severity="success"
            rounded
            style={{ marginRight: "1rem" }}
            // onClick={async () => {
            //   task.status = "Published";
            //   const status = await updateTaskStatus(task);
            //   if (status === true && status !== undefined) {
            //     setTaskDialogVisible(false);
            //   }
            // }}
            onClick={() => handleApproveClick(task, updateTaskStatus)}
          />

          {/* <Button
            type="button"
            label="Reject"
            severity="danger"
            icon="pi pi-times"
            size="small"
            rounded
            onClick={() => {
              task.status = "Rejected";

              updateTaskStatus(task);

              navigate("/workflow/taskreview");
            }}
          /> */}
          <Button
            type="button"
            label="Reject"
            severity="danger"
            icon="pi pi-times"
            size="small"
            rounded
            onClick={handleRejectClick}
          />
          <Dialog
            header="Confirm Rejection"
            visible={visibleRemarks}
            onHide={handleNoClick}
          >
            <div>
              <p>Are you sure you want to reject this task?</p>
              <InputText
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter reason for rejection"
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "1rem",
              }}
            >
              <Button
                label="No"
                icon="pi pi-times"
                onClick={handleNoClick}
                className="p-button-text"
              />
              <Button
                label="Yes"
                icon="pi pi-check"
                onClick={handleYesClick}
                className="p-button-danger"
                disabled={inputValue?.length === 0}
              />
            </div>
          </Dialog>
        </Grid>
      </Grid>
    </Container>
  ) : (
    <>{/* <TaskReviewer></TaskReviewer> */}</>
  );
}
