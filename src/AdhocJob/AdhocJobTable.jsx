import React, { useEffect, useState } from 'react'
import { geAllJobsByTenant } from '../JobAssign/JobAssignAPI';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Badge, Button, Chip, Container, Fab, Tooltip } from '@mui/material';
import { ProgressBar } from 'primereact/progressbar';
import { Progress } from 'antd';


export default function AdhocJobTable({setdbTaskDetails,setJobDetails,setActivityList,setTaskDetails,adhocJobs,setShowCreation,filteredTasksByAssetGroup,setSelectedReviwer,setDescription,setSelectedAssetGroup,setTaskName
  ,setTaskFromExistingTask,setJobStartDate,getJobStatusColor,setActiveStep, setSnackbarOpen,handleReset,refreshJobs,processDbRequest
}) {
  // const [adhocJobs,setAdhocJobs]=useState([])
  const [globalFilter, setGlobalFilter] = useState(null);
  // const [showCreation, setShowCreation] = useState(true);


  useEffect(()=>
  {
    console.log("useEffect() for Adhoc Job called")
    setActiveStep(0)
    handleReset();
    // fetchAllJobs();


  },[])

  // const fetchAllJobs = async () => {
  //   let jobs = await geAllJobsByTenant();
   
  //   if (jobs) {
  //     jobs=jobs.filter(job=>job.adhoc)
  //     console.log('Filtered Jobs : ',jobs)
  //     setAdhocJobs(jobs);
  //   }
  // };




  const renderHeader = () => {
    return (
       <div style={{display:'flex',justifyContent:"space-between",alignItems:"center"}}>
      <span className="p-input-icon-right">
      <i className="pi pi-search" />
      <InputText
        type="search"
        className="p-inputtext-sm"
        onInput={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search.."
      />
    </span>
    { !(typeof processDbRequest === 'number' && !isNaN(processDbRequest)) &&
<Chip label="Refresh Data" 
size='small'
style={{marginLeft:'1rem',cursor:'pointer'}}
onClick={()=>{refreshJobs()}}
icon={<i className="pi pi-refresh" style= {{"fontSize":'.9rem'}}></i>}
color="info" />}

{/* <div style={{display:'flex',justifyContent:"flex-end",alignItems:"center"}}> */}
{ typeof processDbRequest === 'number' && !isNaN(processDbRequest) && (
  <Progress  type="circle" percent={processDbRequest} size={30} strokeWidth={12}/>
)}
{/* </div> */}


  </div>
);
};
  const header = renderHeader();


  const handleRowClick = (rowData) => {
    // if (typeof processDbRequest === 'number') {
    //   // if (processDbRequest) {
    //     console.log("Process is running, please wait for it to finish.");
    //   //   return;
    //   // }
    
    // // } else if (typeof processDbRequest !== 'number') {
    // //   // Not a valid progress state — exit just to be safe
    // //   return;
    // }

    const selectedJob = rowData.data;
    console.log("Row Data : ", selectedJob);
    setJobDetails(selectedJob);
    const foundTask=filteredTasksByAssetGroup?.find(task => task.taskId === selectedJob.task.activityList[0].taskId);
    console.log("Found Task : ,", foundTask);
    if(!foundTask) {
      console.log("No task found for this job");
      return;
    }

    console.log('Found Task TaskId : ',foundTask.taskId)
    console.log('Found Job TaskId : ',selectedJob.task.activityList[0].taskId)
    console.log('Previous activityList : ',foundTask.activityList)
    const selectedActivityList = foundTask.activityList;
    const updatedTask={...foundTask,activityList:selectedActivityList}
    
console.log('All Tasks : ',filteredTasksByAssetGroup)
console.log('Comparison : ',selectedActivityList)

console.log('Current Updated Task : ',updatedTask)
console.log('Selected Job : ',selectedJob)
// const updatedActivityWithJobTime = updatedTask.activityList.map((activity, index) => {
//   return {
//     ...activity,
//     scheduledActivityStartTime:selectedJob.task.activityList.find((prevActivity) => prevActivity.activityId === activity.activityId)?.scheduledActivityStartTime || null,
//     scheduledActivityEndTime:selectedJob.task.activityList.find((prevActivity) => prevActivity.activityId === activity.activityId)?.scheduledActivityEndTime || null,
//   }});

const updatedActivityWithJobTime = updatedTask.activityList.map((activity) => {
  const matchedActivity = selectedJob.task.activityList.find(
    (prevActivity) => prevActivity.activityId === activity.activityId
  );

  if (!matchedActivity) return { ...activity };

  // Create a shallow copy excluding xPos and yPos
  const { xPos, yPos, actAbrv,...restMatchedActivity } = matchedActivity;

  return {
    ...activity,
    ...restMatchedActivity, // overwrite all matching keys except xPos, yPos
  };
});


      updatedTask.activityList = updatedActivityWithJobTime;

      console.log('Updated Activities with timing : ',updatedActivityWithJobTime)

    console.log('Updated Task from row data : ',updatedTask)
    setdbTaskDetails(updatedTask);
    setTaskDetails(updatedTask);
    setActivityList(updatedTask.activityList);
    
    setSelectedReviwer(foundTask.reviewer);
    setDescription(foundTask.description);
    setSelectedAssetGroup(foundTask.assetGroup);
    
    console.log("Task Data:", {
      reviewer: foundTask.reviewer,
      description: foundTask.description,
      assetGroup: foundTask.assetGroup
    });
    
    setTaskName(foundTask.taskName)
    setTaskFromExistingTask(updatedTask)
    setJobStartDate(selectedJob.task.activityList[0].scheduledActivityStartTime)
    setSnackbarOpen(false);
    setShowCreation(true);
    // setdbTaskDetails(rowData.dbTaskDetails);

  }

  // const getJobStatusColor = (status) => {
  //   const normalized = status.toLowerCase();
  //   if (normalized === 'started' || normalized === 'completed') return 'success';
  //   if (normalized === 'not started' || normalized === 'aborted') return 'error';
  //   return 'primary';
  // };
  

 


  return (
    <div>
 <Container maxWidth="lg">
<DataTable
emptyMessage={adhocJobs? 'No Adhoc Jobs Found' :<ProgressBar mode="indeterminate" style={{ height: '6px' }}/>}
 className="UserInfoTableStyle HeaderColor"
 style={{fontSize:".9rem",cursor:'pointer'}}
  value={adhocJobs}
  removableSort
  paginator
  rows={5}
  rowsPerPageOptions={[5, 10, 25, 50]}
  header={header}
  globalFilter={globalFilter}
  onRowClick={handleRowClick}
>
<Column field="jobID" header="Job Id" sortable></Column>
  <Column field="jobName" header="Job Name" sortable></Column>
  <Column field="approver" header="Approver" sortable></Column>
  <Column
    header="Status"
    field='jobStatus'
    body={(rowData) => {
      return (
        <Chip size='small' label={rowData.jobStatus} color={getJobStatusColor(rowData.jobStatus)}></Chip>
      );

    }}
    sortable
  ></Column>
</DataTable>
{/* <Tooltip title="Add Job" placement="top">
          <Fab
            size="large"
            variant="extended"
            color="secondary"
            aria-label="add"
            sx={{ position: "fixed", left: "94%", bottom: "5%" }}
            // onClick={() => navigate("/workflow/userDetails")}
          >
            
            <i className="pi pi-user-plus"></i>

            <Badge
              //badgeContent={overviewTableData.length}
              color="primary"
            ></Badge>
          </Fab>
        </Tooltip> */}

        </Container>
    </div>
    
  )
}
