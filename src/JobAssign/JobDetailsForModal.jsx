import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import React, { useEffect } from "react";

import Autocomplete from "@mui/material/Autocomplete";
import dayjs from "dayjs";
import { Calendar } from "primereact/calendar";
import { Dropdown, Dropdown as PrimeReactDropdown } from "primereact/dropdown";
// import { memo } from "react";
import {
  getAllAssetGroups
} from "../Logbook Asset/LogbookAssetApi";
import { getSelectedOptionTask } from "../userhome/UserGroupAPI";
import { adjustForWeekdays, calculateTotalDuration } from "./helper";
import { getAllGroupId } from "./JobAssignAPI";
import UserValueTemplate from "./UserValueTemplate";
import { getAllTaskByTenantId } from "../Task/TaskAPI";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import  "./jobassign.css";




//*The function  which will be finally returned
const JobDetailForModal = ({
  assetGroup,
  assetGroupList,
  selectedOption,
  task,
  taskList,
  name,
  approver,
  approverList,
  weekdays,
  fromdate,
  todate,
  priority,
  priorityList,
  tag,
  setAssetGroup,
  setAssetGroupList,
  setSelectedOption,
  setTask,
  setTaskList,
  setName,
  setApprover,
  setApproverList,
  setWeekdays,
  setFromdate,
  setTodate,
  setPriority,
  setTag,
  toggleChecked,
  settoggleChecked,
  // currentAssetData,
  // setCurrentAssetData,
  // severityText,
  setSeverityText,
  severityType,
  setSeverityType,
  snackbarOpen,
  setSnackbarOpen,
  userGroupMap,
  setUserGroupMap,
  currentJobName,
  setCurrentJobName,
  currentTotalActivityDuration,
  setCurrentTotalActivityDuration,
  tagList,
  setTagList,
  // setTaskDropdownList,
  taskDropdownList,
  currentAssetForSelectedTask,
  setCurrentAssetForSelectedTask,
  currentActivityDetailsObject,
  setCurrentActivityDetailsObject,
  assetDataFromDb,
  setAssetDataFromDb,
  allGroupedUsersData,
  setAllGroupedUsersData,
  setUserEditedActivityDetails,
  allUsersData,
  setAllUsersData,
  setCopytoallperformer,
  copytoallperformer,
  validationForJobDetailsForModal,
  setValidationForJobDetailsForModal,
  setIsLoading,
  copyMode,
  setCopMode,
  eventJobDetails,
  setEventJobDetails,
  allJobs
}) => {
  
  // Getting the theme object for styling from Material-UI
  const theme = useTheme();
  // Checking if the screen size is mobile based on theme breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const PUBLISHED_STATUS_NORMALIZED = "published";
  const ADHOC_STATUS_NORMALIZED = "adhoc";


  const isNoAssetAvailable = assetGroupList?.length === 1 && assetGroupList[0] === "All";

/**
 * Fetches the asset groups from the API and sets the assetGroupList state
 * to the fetched data. The data is first mapped to only include the groupName
 * property of each object. The "All" option is also added to the beginning of
 * the array.
 */
  async function fetchDataForAssetGroup() {
    let assetGroupData = await getAllAssetGroups();//* get all asset groups data
// console.log("Asset Group from API : ", assetGroupData);
    if (assetGroupData) {
      assetGroupData = assetGroupData.map((item, index) => {
        return item.groupName;
      });
    }

    if (assetGroupData) {
      assetGroupData.unshift("All");//* Adding 'All' indicates all task related to all AssetGroups

      setAssetGroupList(assetGroupData);
    }
  }

/**
 * Fetches a list of group IDs from the API and sets the tagList state 
 * with the fetched data. 
 */
  async function fetchTagList() {
// console.log("fetchTagList() called");
    let groupList = await getAllGroupId();
// console.log(" GroupId from API : ", groupList);
    if (groupList) {
      setTagList(groupList);
    }
  }

  async function fetchAllTaskData() {
    console.log("fetchTagList() called");
    let taskList = await getAllTaskByTenantId();
    console.log('Task List from API fetchAllTaskData: ',taskList)
    if (taskList) {
      const publishedTasks = taskList
        .filter(
          (task) =>
            task?.status.toLowerCase() === PUBLISHED_STATUS_NORMALIZED &&
            task?.status.toLowerCase() !== ADHOC_STATUS_NORMALIZED,
          //  || task?.status.toLowerCase() === "adhoc"
        )
        .map((task) => ({
          ...task,
          activityList:
            task.activityList?.map((activity) => ({
              ...activity,
              assetId: "",
              assetName: "",
            })) ?? [],
        })); // Filter tasks with status "PUBLISHED"
      console.log(" Tasks from API : ", taskList);
      setTaskList(publishedTasks ?? []);
      // if(copyMode)
      //   {
      //     setAssetDataFromDb(publishedTasks ?? []);
      //     console.log('Current Event Job Details in Copy Mode : ',eventJobDetails)
      // if(eventJobDetails?.task.taskId)
      // {
      // const foundTask=publishedTasks.find((task)=>task.taskId===eventJobDetails?.task.taskId);
      // setAssetDataFromDb(publishedTasks ?? []);
      // setTask(foundTask??{});

      // }
    }
  }

 
 
  /**
   * Handles the change event of the task dropdown in the job assign modal. Sets the currentActivityDetailsObject state
   * to an empty array, sets the userEditedActivityDetails state to false, sets the copytoallperformer state to false, and
   * sets the task state to the selected value. If the selected value does not match any task in the assetDataFromDb list,
   * logs an error message to the console. If the selected value matches a task in the assetDataFromDb list, sets the currentAssetForSelectedTask
   * state to the matching object, calculates the total activity duration of the activityList in the matching object using the
   * calculateTotalDuration helper function, and sets the currentTotalActivityDuration state to the calculated total activity duration.
   */
  const handleTaskChange = (event) => {
    //event.stopPropagation();
// console.log("handleTaskChange : ", event);
    // if(!event?.value?.taskName)
    //   return;
    // console.log("Selected value:", event.target.value);
// console.log("Selected value:", event.value);
    const currentTask = event.target.value?.taskName;

    console.log('Current TaskName  event.value: ',event.value)
    // console.log('Current TaskName  event.target.value: ',event.target.value)

    setIsLoading(true);

    setCurrentActivityDetailsObject([]); // If the user is changing the task then related activities will change
    setUserEditedActivityDetails(false);// indicates the user has edited or altered the activity Details step, to keep track of changes
    setCopytoallperformer(false); //resetting the copytoallperformer


console.log("Current Asset Data : ", assetDataFromDb);
//  const isNoAssetAvailable = assetGroupList?.length === 1 && assetGroupList[0] === "All";

   const foundTask =  taskList?.find(task => task?.taskName === currentTask)

   
console.log('Found Task : ',foundTask)

if(isNoAssetAvailable)
{
  setAssetGroup('All')
}
   

    if (foundTask) {
// console.log("Current Asset Data : ", currentAssetData);
      setCurrentAssetForSelectedTask(foundTask);//* this indicates the selected Task related to an AssetGroup and if there is no AssetGroup then select 'All' to get Task having no assetGroups 

      const total_activity_duration=calculateTotalDuration(foundTask.activityList);//* calculate the totalActivity Duration for the given task
      setCurrentTotalActivityDuration(total_activity_duration);
// console.log("Current Task  : ",event.target.value );
       //* setting the task object
      setTask(event.target.value);
    } else {
      console.error("Task not Found !");
    }

    setIsLoading(false);
  };

  
  useEffect(() => {
console.log("UseEffect() called for JobDetailForModal");
    fetchDataForAssetGroup();
    // getAllApprover();
    fetchTagList();
    fetchAllTaskData();
    // setFromdate(new Date())
    // fetchAllUserData();
  }, []);

  useEffect(() => {
    const adjustedDateTime=adjustForWeekdays(fromdate,currentTotalActivityDuration,weekdays)
  
    // Update state
    setTodate(new Date(adjustedDateTime));
    setCopytoallperformer(false);
    // performerAndAssetReset(); // Uncomment if needed
    // setCurrentActivityDetailsObject([]); // Uncomment if needed
    // setUserEditedActivityDetails(false); // Uncomment if needed
  }, [currentTotalActivityDuration, setTodate, fromdate, weekdays,setWeekdays]);
  
  

/**
 * Asynchronously handles the change event of the asset dropdown in the job assign modal. 
 * Sets the isLoading state to true, resets the assetGroup and task states, fetches data for the selected asset, 
 * filters the asset data based on the selected asset, updates the assetDataFromDb state accordingly, and 
 * resets other relevant states. Displays an error message if no task is found for the selected asset. 
 * Finally, sets the assetGroup state to the selected asset and performs necessary state updates.
 */
  const handleAssetChange = async (event) => {
// console.log("handleAssetChange() called => ", event.target.value);
//* the main assetGroup is getting changed hence the task will reset too
    setIsLoading(true);//indication that data is getting fetched from db

    setAssetGroup("");
    setTask({});
    setCurrentTotalActivityDuration(0)


   

    const selected_asset = event.target.value;
    // let allAssetGroup_data = await getSelectedOptionTask(event.target.value); //*This particular API is returning all assets so need to filter,The API need to be refactored
    // const allAssetGroup_data=taskList??[];
// console.log("Asset Data from DB :  ", allAssetGroup_data);

console.log('Selected Asset : ',selected_asset,' Task List :  ',taskList)

    if (event?.target?.value?.toLowerCase() === "all") {//* if all is selected then all the assets will be shown
      setAssetDataFromDb(taskList);
    } else {
      let selectedAssetData = null;
      if (taskList) {//* all the Task belonging to the same assetGroup is getting filtered here
        selectedAssetData = taskList.filter(
          (element) => element.assetGroup === selected_asset
        );
// console.log("Final Selected AssetGroup Data : ", selectedAssetData);
        // console.log("Asset Data from DB :  ",assetGroup_data)
      }
      if (selectedAssetData) {
        setAssetDataFromDb(selectedAssetData);
        if (selectedAssetData.length === 0) {//* if for a selected asset Group no Task is found then an error is shown showing No Task found for the selected AssetGroup
          setSeverityText("No Task found !");
          setSeverityType("error");
          setSnackbarOpen(true);
        }
      }
    }
    
    setAssetGroup(event.target.value);//*set the current selected Asset
    
    setCurrentActivityDetailsObject([]); // If the user is changing the task then related activities will change
    setUserEditedActivityDetails(false); //indicates the user is now going to give a new set of data
    // setCopytoallperformer(false); //

    setIsLoading(false);

    
  };

/**
 * Resets the performer information in the current activity details.
 * This function is typically invoked when the user toggles an option that
 * disables the performer dropdown, ensuring that no previous values are retained
 * in the disabled state. It updates each activity detail object by setting the
 * performer field to an empty string, and then updates the state with the modified list.
 */

  const performerReset = () =>
    //When the user is toggling the performer is getting reset because at any given time if the group is selected then performer dropdown is diabled and i don't want to show previous setvalues in diabled state
    {
      let copyCurrentActivityDetails = [...currentActivityDetailsObject];
      // console.log(
      //   "Copy Current Activity Details: ",
      //   copyCurrentActivityDetails
      // );

      let resetList = copyCurrentActivityDetails.map((data) => {//* resetting all the performers to all the activities to ""
        // Update the performer value to an empty string
        data.performer = "";
        //  data.assetName=''
        // data.assetId=''
        // data.assetname
        return data; // Return the modified data object
      });

// console.log("Reset Performer List: ", resetList);
      setCurrentActivityDetailsObject(resetList);
    };

/**
 * Resets both the performer and asset information in the current activity details.
 * This function is typically invoked to ensure that any previously set performer 
 * and asset values are cleared, which is necessary when validating asset availability
 * for the user. It updates each activity detail object by setting the performer, 
 * assetName, and assetId fields to empty strings, and then updates the state with 
 * the modified list.
 */
  const performerAndAssetReset = () =>
    // The asset need to be reset because whether that particular asset is available for that user or not need to be validated
    {
      let copyCurrentActivityDetails = [...currentActivityDetailsObject];
      // console.log(
      //   "Copy Current Activity Details: ",
      //   copyCurrentActivityDetails
      // );

      let resetList = copyCurrentActivityDetails.map((data) => {//resetting both performer and asset
        // Update the performer value to an empty string
        data.performer = "";
        data.assetName = "";
        data.assetId = "";
        return data; // Return the modified data object
      });

// console.log("Reset Performer List: ", resetList);
      setCurrentActivityDetailsObject(resetList);
    };

  const handleChange = (event) => {
    settoggleChecked(event.target.checked);
    performerAndAssetReset(); // The asset need to be reset too because the user might toggle this  and if a performer is not selected yet
   
  };

/**
 * Handles the change event of the from date in the job assign modal. Sets the isLoading state to true,
 * validates if the selected time is in the past, and if so, displays an error message and resets the from date
 * to the current datetime. Finally, sets the from date state to the selected value, resets the activity details
 * if the user has previously selected a task, and sets the userEditedActivityDetails state to false.
 * @param {Date} newValue The newly selected date and time
 * @param {function} setFromDate The function to set the from date state
 */
  const handleFromDateChange = (newValue, setFromDate) => {
    if(!newValue) return;
// console.log("handleFromDateChange() called => ", newValue);
    setIsLoading(true);
    
    setFromDate(newValue);
   
    setIsLoading(false);
  };

  

  // const taskOptions = isNoAssetAvailable ? taskList : null;;
  return (
    <>
    {/* Parent div component */}
      <Grid container spacing={2}>
        {/* <Grid item xs={12}>
        <Typography>Your details</Typography>
      </Grid> */}

        <Grid item xs={12} >
         


{/* Selection of Asset Group */}
{/* {copyMode+'hello'} */}
          <PrimeReactDropdown
            className="w-full"
            value={isNoAssetAvailable?'All': assetGroup}
            onChange={(e) => handleAssetChange(e)}
            placeholder="Asset Group"
            filter
            disabled={!taskList || copyMode}
            options={assetGroupList}
            invalid={validationForJobDetailsForModal && assetGroup === ""}
          />
        </Grid>
       

        <Grid item xs={12}>
          
        {/* Selection of Task */}
        {/* {task?.taskId+'hello'}{assetDataFromDb?.length+'hello'}{taskList?.length+'hello'}{'hi'+eventJobDetails?.jobID} */}
          <PrimeReactDropdown
            className="w-full"
            value={copyMode ?  taskList?.find((task)=>task?.taskId === eventJobDetails?.task?.taskId):task}
            onChange={(e) => handleTaskChange(e)}
            optionLabel="taskName"
            placeholder="Select Task"
            filter
            dropdownIcon="pi pi-chevron-down"
            options={isNoAssetAvailable ? taskList: copyMode?taskList:assetDataFromDb}
            disabled={isNoAssetAvailable ? false:(assetGroup === "" || !taskList || copyMode)}
            invalid={!copyMode && validationForJobDetailsForModal && Object.keys(task).length===0}
          />
          {/* {Object.keys(task).length+'hello'} */}
        </Grid>

       

        {/* Job Name field */}
        <Grid item xs={12}>
          {/* <TextField
            id="outlined-basic"
            label="JobName"
            variant="outlined"
            fullWidth
            disabled={assetGroup === ""}
            value={currentJobName}
            onChange={(e) => {
              setCurrentJobName(e.target.value);
            }}
            error={validationForJobDetailsForModal && currentJobName === ""}
          /> */}

          {/* <FloatLabel> */}
          {/* All selection is always there in Asset Group filter */}
    <InputText id="JobName" value={currentJobName} placeholder="Enter Job Name" onChange={(e) => {
              setCurrentJobName(e.target.value);
            }} invalid ={  allJobs?.some(
          //* finding any jobname that was previously used
          (data) =>
            data?.jobName?.trim()?.toLowerCase() ===
            currentJobName?.toLowerCase()?.trim()
        ) || (validationForJobDetailsForModal && currentJobName === "")} disabled={assetGroup === "" && !copyMode} className="w-full"/>
    {/* <label htmlFor="JobName">JobName</label> */}
{/* </FloatLabel> */}
{/* {allJobs?.length+'hi'} */}
        </Grid>
      

        <Grid item xs={12}>
         

<Dropdown
                  options={approverList}
                  value={approver}
                  onChange={(event) => setApprover(event.target.value)
                  }
                  optionValue='userID'
                  placeholder="Select Approver"
                  // invalid={validationForActivityDetails && row.approver === ""}
                  disabled={assetGroup === "" && !copyMode}
                   className="w-full"
                   invalid={validationForJobDetailsForModal && approver === ""}
                  // style={{
                  //   // height: "30px",
                  //   width: isMobile ? "6rem" : "10rem",
                  // }}
                  // disabled={booleanSelfApproved}
                  itemTemplate={(option) => (
                    <div>
                      <span style={{ fontWeight: "bold" }}>
                        {option.userName}
                      </span>
                      {isMobile?"":<span>
                      {"( " + option.userID + " )"}
                      </span>}
                    </div>
                  )}
                  valueTemplate={(option) =>
                    
                    <UserValueTemplate
                    option={option}
                    defaultValue={"Approver"}
                    statusVisible={false}
                    />
                  }
                  optionLabel="userName"
                  filter
                  filterBy="userName,userID"
                  // optionLabel={"userName"}
                  clearIcon
                  />

        </Grid>
{/* Weekday Selection */}
        <Grid item xs={12}>
          <FormControl disabled={assetGroup === "" && !copyMode} error={ 
              (weekdays === "5" && (dayjs(fromdate).day() === 6 || dayjs(fromdate).day() === 0)) || 
              (weekdays === "6" && dayjs(fromdate).day() === 0)
            }>
              <Tooltip sx={{cursor:"pointer"}} title="Specifies the days when the job will be performed" placement="top-start">
            <FormLabel id="demo-controlled-radio-buttons-group">
              Weekdays
            </FormLabel>
            </Tooltip>
            <RadioGroup
              row
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={weekdays}
              onChange={(event) =>{ 
// console.log("Weekdays Value Changed")
                setWeekdays(event.target.value)}}
            >
              <FormControlLabel
                value="5"
                control={<Radio />}
                label="Exclude Sat-Sun"
              />
              <FormControlLabel
                value="6"
                control={<Radio />}
                label="Exclude Sunday"
              />
              <FormControlLabel value="7" control={<Radio />} label="All" />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid
          item
          xs={12} sm={12}
          md={6} lg={6}
          sx={{
            display: "flex",
            alignItems: "center",
            columnGap: "1rem",
            justifyContent: "flex-start",
          }}
        >
          
          <Typography sx={{ fontWeight: 500 }}>Start Time</Typography>
          {/* From Date Selection */}
          <Calendar
            showIcon
            id="calendar-12h"
            dateFormat="dd/mm/yy"
            value={fromdate}
            onChange={(e) => handleFromDateChange(e.value, setFromdate)}
            showTime
            hourFormat="12"
            disabled={task === ""}
            minDate={new Date()}
            // className="small-calendar"
            invalid={ 
              (weekdays === "5" && (dayjs(fromdate).day() === 6 || dayjs(fromdate).day() === 0)) || 
              (weekdays === "6" && dayjs(fromdate).day() === 0) || dayjs().isAfter(fromdate)
            }
  //            pt={{
  //   panel: { style: { transform: "translateY(-4rem)" } }
  // }}
            disabledDays={
              weekdays === "5" ? [0, 6] : 
              weekdays === "6" ? [0] : 
              []
            }
            
          />
        </Grid>

        <Grid
          item
          xs={12} sm={12}
          md={6} lg={6}
          sx={{
            display: "flex",
            alignItems: "center",
            columnGap: "1rem",
            justifyContent: "flex-end",
          }}
        >
          <>
           
            <Typography sx={{ fontWeight: 500 }}>End Time</Typography>
            {/* To Date Selection */}
            <Calendar
              showIcon
              id="calendar-12h"
              dateFormat="dd/mm/yy"
              value={todate}
              disabled
              showTime
              hourFormat="12"
            />
          </>
        </Grid>

        <Grid item xs={12}>
        <Dropdown
    id="priority-dropdown"
    value={priority}
    options={priorityList}
    invalid={validationForJobDetailsForModal && priority === ""}
    onChange={(e) => setPriority(e.value)}
    placeholder="Select a Priority"
    // style={{
    //   color:
    //     priority.toLowerCase() === "critical"
    //       ? "#B80000"
    //       : priority.toLowerCase() === "normal"
    //       ? "#610C9F"
    //       : "#1B3C73",
    //   fontWeight: "bold",
    // }}

    valueTemplate={(option) => (
option ?
      <span
        style={{
          color:
            option.toLowerCase() === "critical"
              ? "#B80000"
              : option.toLowerCase() === "normal"
              ? "#610C9F"
              : "#1B3C73",
          fontWeight: "bold",
        }}
      >
        {option}
      </span> :<div>Select a Priority</div>
    )}
    className="w-full"
   
    itemTemplate={(option) => (
      <span
        style={{
          color:
            option.toLowerCase() === "critical"
              ? "#B80000"
              : option.toLowerCase() === "normal"
              ? "#610C9F"
              : "#1B3C73",
          fontWeight: "bold",
        }}
      >
        {option}
      </span>
    )}
  />
        </Grid>

        <Grid item xs={12}>
          {/* Tag selection i.e GroupId selection optional field */}
          <Autocomplete
            id="job-Tag"
            freeSolo
            options={tagList.map((option) => option)}
            clearIcon={false}
            value={tag}
            onChange={(event, newValue) => {
              if (newValue) {
                setTag(newValue);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="TAG( Group Id )"
                // error={validationForJobDetailsForModal&&tag===''}
                value={tag}
                onChange={(event) => {
// console.log(event.target.value);
                  setTag(event.target.value);
                }}
              />
            )}
          />
        </Grid>
        {/* {tag} */}
      </Grid>
      
    </>
  );
};

export default JobDetailForModal;
