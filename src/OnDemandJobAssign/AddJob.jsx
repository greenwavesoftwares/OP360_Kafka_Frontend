import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Router, useNavigate, useLocation } from "react-router-dom";
import GroupAndDepartment from "../taskmaster/GroupAndDepartment";
import { MultiSelect } from "primereact/multiselect";

export default function AddJob() {
  const stepperRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [depts, setDepts] = useState([]);
  const [assetGroups, setAssetGroups] = useState([]);
  const [job, setJob] = useState({});
  const [task, setTask] = useState({});
  const [selectedGroupList, setSelectedGroupList] = useState([]);
  const [selectedDepartmentList, setSelectedDepartmentList] = useState([]);
  const [jobName, setJobName] = useState("");
  const [description, setDescription] = useState("");
  const [reviewer, setReviewer] = useState("");
  const [assetGroup, setAssetGroup] = useState({});

  const location = useLocation();

  useEffect(() => {
    console.log(location.state);

    setUsers(location.state.users);

    setGroups(location.state.groups);

    setDepts(location.state.depts);

    setAssetGroups(location.state.assetGroups);
  }, []);

  /// ADD JOB WILL CREATE A NEW JOB AS WELL AS A NEW TASK
  const addJob = () => {

    task.taskId =
      "T" +
      new Date()
        .toISOString()
        .replace(/-/g, "")
        .replace(/:/g, "")
        .replace(/\..+/, "");
    task.taskName = jobName;
    task.reviewer = reviewer.userId;
    task.description = description;
    task.userGroupsList = selectedGroupList.map((group) => group.groupId);
    task.userDeptsList = selectedDepartmentList;
    task.assetGroup = assetGroup.groupName;
    task.status = "Not Ready";
    // ==================FROM CONTEXT====================
    task.creator = "subhajit.khasnobish@greenwave.co.in";
    let creationTime = new Date();
    creationTime.setHours(creationTime.getHours() + 5);
    creationTime.setMinutes(creationTime.getMinutes() + 30);
    task.creationTime = creationTime.toISOString();

    const taskValidation = validateTask(task);

    if (taskValidation && taskValidation.error === "ERROR") {
      alert(taskValidation.message);

      return "ERROR";
    }

    console.log(task);

    addTaskHandler(task);

    setTask({
      taskId:
        "T" +
        new Date()
          .toISOString()
          .replace(/-/g, "")
          .replace(/:/g, "")
          .replace(/\..+/, ""),
      taskName: jobName,
      reviewer: reviewer.userId,
      description: description,
      userGroupsList: selectedGroupList.map((group) => group.groupId),
      userDeptsList: selectedDepartmentList,
      assetGroup: assetGroup.groupName,
      status: "Not Ready",
      creator: "subhajit.khasnobish@greenwave.co.in", //FROM CONTEXT
      creationTime: creationTime.toISOString()
    });


    job.task = task;
    job.jobID =
      "J" +
      new Date()
        .toISOString()
        .replace(/-/g, "")
        .replace(/:/g, "")
        .replace(/\..+/, "");
    job.jobName = jobName;
    job.remarks = description;
    job.approver = reviewer.userId;
    job.scheduledJobStartTime = new Date().toISOString();
    job.scheduledJobEndTime = new Date().toISOString();
    job.priority = "Normal";
    job.jobStatus = "Not Started";
    job.adhoc = false;

    setJob({
      task: task,
      jobID:
        "J" +
        new Date()
          .toISOString()
          .replace(/-/g, "")
          .replace(/:/g, "")
          .replace(/\..+/, ""),
      jobName: jobName,
      remarks: description,
      approver: reviewer.userId,
      scheduledJobStartTime: new Date().toISOString(),
      scheduledJobEndTime: new Date().toISOString(),
      priority: "Normal",
      jobStatus: "Not Started",
      adhoc: false
    });

    console.log(job);

    setJob(job);

    addJobHandler(job);

  };

  const addJobHandler = (job) => {


    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job),
    };

    console.log(options.body);

    const addJobDetails = async () => {
     await fetch("http://localhost:8099/jobs/addJob", options)
        .then((resp) => resp.json())
        .then((data) => {

          console.log('================',data);

        })
        .catch(err => {

            console.log(err);

        });

    };

    addJobDetails();
  };

  const validateTask = (task) => {
    if (task) {
      if (task.taskName === "") {
        // toast.success('Required');

        return { error: "ERROR", message: "job name is required" };
      }

      if (!task.reviewer) {
        return { error: "ERROR", message: "job reviewer is required" };
      }

      if (task.userDeptsList && !task.userDeptsList.length) {
        return {
          error: "ERROR",
          message: "job should have at least 1 department",
        };
      }

      if (!task.assetGroup) {
        return { error: "ERROR", message: "job should have an asset group" };
      }

      if (task && task.activityList && !task.activityList.length) {
        return {
          error: "ERROR",
          message: "job should have at least 1 activity",
        };
      }
    }
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
      await fetch("http://localhost:8084/tasks/saveTask", options)
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
        });
    };

    addTask();

    // setTaskUpdated(taskUpdated === true ? false : true);
  };

  return (
    <>
      <div className="card flex justify-content-center">
        <Stepper ref={stepperRef} style={{ flexBasis: "50rem" }}>
          <StepperPanel header="Job Creation">
            <div className="flex flex-column h-12rem">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                <Container style={{ fontSize: "1rem" }}>
                  <Row>
                    <Col style={{ position: "relative", left: "25rem" }}>
                      <span>
                        <label
                          style={{
                            position: "relative",
                            right: "12rem",
                            top: "3rem",
                            fontSize: "1.1rem",
                          }}
                        >
                          Job Name
                        </label>
                      </span>

                      <InputText
                        value={jobName}
                        placeholder="Enter task name"
                        onChange={(e) => {
                          setJobName(e.target.value);

                          // console.log(e.target.value);
                        }}
                        style={{
                          position: "relative",
                          right: "5.5rem",
                          top: "3rem",
                          fontSize: "1.1rem",
                        }}
                      />

                      <span>
                        <h3
                          style={{
                            position: "relative",
                            right: "12rem",
                            top: "3rem",
                          }}
                        >
                          Description
                        </h3>
                      </span>
                      <InputTextarea
                        value={description}
                        placeholder="Enter description"
                        onChange={(e) => {
                          setDescription(e.target.value);

                          console.log(e.target.value);
                        }}
                        required
                      />

                      <br />

                      <span>
                        <h3
                          style={{
                            position: "relative",
                            right: "12rem",
                            top: "3rem",
                          }}
                        >
                          Select Reviewer
                        </h3>
                      </span>
                      <Dropdown
                        value={reviewer}
                        placeholder="Select reviewer"
                        options={users}
                        optionLabel="userName"
                        required
                        onChange={(e) => {
                          setReviewer(e.value);

                          console.log(e.value);
                        }}
                      />
                    </Col>

                    <Col
                      style={{
                        position: "relative",
                        left: "70rem",
                        bottom: "21.3rem",
                      }}
                    >
                      {/* <GroupAndDepartment
                        groups={groups}
                        selectedGroupList={selectedGroupList}
                        selectedDepartmentList={selectedDepartmentList}
                        setSelectedGroupList={setSelectedGroupList}
                        setSelectedDepartmentList={setSelectedDepartmentList}
                        depts={depts}
                        task={""}
                        style={{position : 'relative',top : '20rem'}}
                      /> */}

                      <span>
                        <label
                          style={{
                            position: "relative",
                            right: "14rem",
                            top: "20rem",
                            fontSize: "1.2rem",
                          }}
                        >
                          Select groups
                        </label>
                      </span>

                      <MultiSelect
                        value={selectedGroupList}
                        options={groups}
                        optionLabel="groupName"
                        placeholder="Select groups"
                        onChange={(e) => {
                          setSelectedGroupList(e.value);

                          console.log(e.value);
                        }}
                        style={{
                          position: "relative",
                          right: "12rem",
                          top: "20rem",
                          fontSize: "1.2rem",
                        }}
                      />

                      <span>
                        <label
                          style={{
                            position: "relative",
                            right: "35rem",
                            top: "13rem",
                            fontSize: "1.2rem",
                          }}
                        >
                          Select depts
                        </label>
                      </span>

                      <MultiSelect
                        value={selectedDepartmentList}
                        options={depts}
                        placeholder="Select departments"
                        onChange={(e) => {
                          setSelectedDepartmentList(e.value);

                          console.log(selectedDepartmentList);
                        }}
                        style={{
                          position: "relative",
                          right: "34rem",
                          top: "13rem",
                          fontSize: "1.2rem",
                        }}
                      />

                      {console.log(selectedDepartmentList)}

                      {/* 
<AddAsset assetGroup={assetGroup} assetGroups={assetGroups} setAssetGroup={setAssetGroup} treeData={treeData}
               setSelectedNode={setSelectedNode}/>  */}

                      <h3
                        style={{
                          position: "relative",
                          right: "15rem",
                          top: "3rem",
                        }}
                      >
                        Select Asset Group
                      </h3>
                      <Dropdown
                        options={assetGroups}
                        optionLabel="groupName"
                        value={assetGroup}
                        onChange={(e) => setAssetGroup(e.value)}
                        placeholder="Select Asset Group"
                      />
                      {/* </Panel> */}
                    </Col>
                  </Row>

                  {/* <Button label="Add" type="button" onClick={taskDraftHandler} style={{position : 'relative',top : 15}}/> */}
                </Container>
              </div>
            </div>
            <div className="flex pt-4 justify-content-end">
              <Button
                label="Add Job"
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={() => {
                  const response = addJob();

                  if (response === "ERROR") return;

                  stepperRef.current.nextCallback();
                }}
              />
            </div>
          </StepperPanel>

          <StepperPanel header="Header II">
            <div className="flex flex-column h-12rem">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                {/* ======================Content HERE================== */}

                

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
                label="Next"
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={() => stepperRef.current.nextCallback()}
              />
            </div>
          </StepperPanel>

          <StepperPanel header="Header III">
            <div className="flex flex-column h-12rem">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                {/* =============CONTENT HERE================ */}
              </div>
            </div>
            <div className="flex pt-4 justify-content-start">
              <Button
                label="Back"
                severity="secondary"
                icon="pi pi-arrow-left"
                onClick={() => stepperRef.current.prevCallback()}
              />
            </div>
          </StepperPanel>
        </Stepper>
      </div>
    </>
  );
}
