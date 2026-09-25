// Import CancelIcon component from Material-UI icons
import CancelIcon from '@mui/icons-material/Cancel';
// Import CheckCircleIcon component from Material-UI icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// Import various components and utilities from Material-UI
import {
  ButtonGroup,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  styled,
  tableCellClasses,
  useMediaQuery,
  useTheme
} from "@mui/material";
// Import dayjs library for date manipulation
import dayjs from "dayjs";
// Import React and useState, useEffect hooks
import React, { useEffect } from "react";
// Import API functions for availability checks
import {  getAssetAvailability, getPerformerAvailability } from "./JobAssignAPI";

// Import ContentCopyIcon component from Material-UI icons
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// Import GroupIcon component from Material-UI icons
import GroupIcon from '@mui/icons-material/Group';
// Import PersonIcon component from Material-UI icons
import PersonIcon from '@mui/icons-material/Person';
// Import TimelapseIcon component from Material-UI icons
import TimelapseIcon from '@mui/icons-material/Timelapse';
// Import WatchLaterIcon component from Material-UI icons
import WatchLaterIcon from '@mui/icons-material/WatchLater';
// Import motion component from framer-motion library
import { motion } from "framer-motion";
// Import Dropdown component from PrimeReact library
import { Dropdown, Dropdown as PrimeReactDropdown } from "primereact/dropdown";
// Import custom UsersDropdown component
// Import utility functions from helper file
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Skeleton } from 'primereact/skeleton';
import { useRef } from 'react';
import { areActivityIdsMatching, fetchCurrentActivityList, formatDatetime, formatDuration } from "./helper";
import UserValueTemplate from './UserValueTemplate';





/**
 * A styled component that customizes the appearance of TableCell.
 */
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));


/**
 * A styled component that customizes the appearance of TableRow.
 */
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));



const ActivityDetails = ({ task,currentActivityDetailsObject,setCurrentActivityDetailsObject,selectedOption,currentAssetForSelectedTask,userEditedActivityDetails,setUserEditedActivityDetails
  ,performerList, setPerformerList,approverList, setApproverList,fromdate,todate,toggleChecked,userGroupMap, allUsersData,setCopytoallperformer,copytoallperformer,validationForActivityDetails,
  setIsLoading,departmentMap,allGroupedUsersData
  ,severityText,
  setSeverityText,
  severityType,
  setSeverityType,
  snackbarOpen,
  setSnackbarOpen,
  weekdays,
  currentTotalActivityDuration
}) => {
const theme = useTheme();
// Checking if the screen size is mobile based on theme breakpoints
const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
const overlayPanelRef = useRef(null);

  
  useEffect(() => {
    console.log(
      "Selected Activity List : ",
      currentAssetForSelectedTask.activityList
    );
    // console.log("Current User Group Map : ", userGroupMap);
    const fetched_performerList = [];
    const fetched_approverList = [];
    // console.log("All Users Data : ",allUsersData)

      allUsersData.forEach((user) => {//* users who have access to 'Performer Page'  will be treated as performers
        if (user.allotedPages.some((data)=>data.page.toLowerCase()==='performer'))
        {
          fetched_performerList.push(user);
          
  }
  if (user.allotedPages.some((data)=>data.page.toLowerCase()==='activity reviewer')){//* users who have access to 'Activity reviewer' page will have the privilege to approve an activity 
          fetched_approverList.push(user);
        }

})

// setApproverList(fetched_approverList)//this is for activity reviewer

    if (
      currentAssetForSelectedTask &&
      currentAssetForSelectedTask.activityList
    ) {

      const changedJobStartTimestamp=checkActivityStartTimestamp(currentActivityDetailsObject,fromdate)
      console.log('Same Time : ',changedJobStartTimestamp)
      
      if (!changedJobStartTimestamp) {//* if the user has  edited the start time then a fresh data will be populated
        // getAllPerformerAndApprover();
// console.log("Fetched Activity List : ", currentAssetForSelectedTask);
        let updatedActivityList = fetchCurrentActivityList(//* fetching the activityList based on selected task
          currentAssetForSelectedTask.activityList,fromdate,weekdays
        );
        const finalUpdatedListWithStatus= fetchStatus(updatedActivityList,fetched_performerList,fetched_approverList)//* this will get the status of each performer;

        // console.log('Final Updated List With Status: ', finalUpdatedListWithStatus);

        // console.log("Updated Activity List : ", updatedActivityList);
      
      }
    }
    // if (toggleChecked || !toggleChecked) {
    //   let copyCurrentActivityDetails = [...currentActivityDetailsObject];
    //   console.log("Copy Current Activity Details: ", copyCurrentActivityDetails);

    //   let resetPerformerList = copyCurrentActivityDetails.map((data) => {
    //       // Update the performer value to an empty string
    //       data.performer = '';
    //       return data;  // Return the modified data object
    //   });

    //   console.log("Reset Performer List: ", resetPerformerList);
    //   setCurrentActivityDetailsObject(resetPerformerList);
    // }
  }, []);

  const checkActivityStartTimestamp = (activityList, fromDate) => {
    console.log('Current Activity List : ',activityList);
    if (activityList.length === 0) {
      console.warn("The activity list is empty.");
      return false;
    }
  
    const firstActivityStartTime = activityList[0]?.scheduledActivityStartTime;
  
    if (!firstActivityStartTime) {
      console.warn("The first activity does not have a scheduled start time.");
      return false;
    }
  
    // Parse the timestamps for comparison
    const fromDateParsed = dayjs(fromDate);
    const startTimeParsed = dayjs(firstActivityStartTime);
  
    // Compare the entire timestamp
    const isTimestampMatching = fromDateParsed.isSame(startTimeParsed);
  
    return isTimestampMatching;
  };


   const includesAnyGroup = (performerGroup, activityGroups) =>
  performerGroup.some(g => activityGroups.includes(g));

const getPerformerAndAssetStatus = async (activityList, performers,approverList) => {
  console.log('Fetched Approver List :',approverList)
  const updatedActivityList = await Promise.all(
    activityList.map(async (activity) => {

      console.log('Activities : ',activity)
      const { activityId, taskId, scheduledActivityStartTime, scheduledActivityEndTime } = activity;

      // console.log(
      // 'Current Task and Activity Id : ', activityId ,' ',taskId
      // )


      const dayjs = require("dayjs");

      // ✅ format times
      const start = dayjs(scheduledActivityStartTime).format("YYYY-MM-DD HH:mm:ss.SSS");
      const stop = dayjs(scheduledActivityEndTime).format("YYYY-MM-DD HH:mm:ss.SSS");

      // ✅ fetch performer availability once for the given window
      const allPerformerStatus = await getPerformerAvailability(start, stop, activityId, taskId);
      const flattenedPerformersStatus = allPerformerStatus ?? [].flat();

      console.log("Flattened Performer Status: ", flattenedPerformersStatus);
      console.log("Performers List: ", performers);

      
      //Why the function does 2 things because JOB API has no internal access to usermodule API.(duplicacy of logic would occur)

      const groupNamesForActivity = activity.activityUserGroupList ?? [];

      // 🔹 map results back to individual performers
      const performerArray = performers
        .filter((performer) => {
          if(groupNamesForActivity.length === 0) return true; // skip if no groups
          return includesAnyGroup(performer.group.map((group) => group.groupName), groupNamesForActivity);
        }) // only keep allowed groups
        .map((performer) => {
          const performerStatus = flattenedPerformersStatus.filter(
            (status) => status.performer === performer.userID
          );

          return {
            userName: performer.userName,
            userID: performer.userID,
            status: performerStatus.length === 0, // true if available
            performerUnavailability: performerStatus,
          };
        });

      // ✅ fetch asset availability by activityId
      const assetArray = await getAssetAvailability(start, stop, activityId, taskId);
      const flattendedAssetsWithStatus = assetArray ?? [].flat();

      console.log("Flattened Asset Status: ", flattendedAssetsWithStatus);
    const assets = activity?.assetIDList?.map((id, index) => ({
  assetID: id,
  assetName: activity.assetNameList[index]
}));

      const formattedAssets = assets?.map((asset) => {
        const performerAssetStatus = flattendedAssetsWithStatus.filter(
          (status) => status.assetID === asset.assetID
        );

        return {
          assetID: asset.assetID,
          assetName: asset.assetName,
          status: performerAssetStatus.length === 0, // true if available
          assetUnavailability: performerAssetStatus,
        };
      });

      console.log('Formatted Assets: ', formattedAssets);


      const grpWiseFilteredApprovers=approverList.filter((approver) => {
        const userGroups = approver.group.map(
          (data) => data.groupName.toLowerCase().trim()
        );
        console.log('Current Activity', activity);
        console.log('Current Usergroup : ',userGroups)
        if (activity.activityUserGroupList.length === 0) { //if no activityGroups are present then all approvers will be present
  return true; // blank → allow all
}
        return activity.activityUserGroupList
          .map(g => g.toLowerCase().trim())
          .some(g => userGroups.includes(g));
      });
      console.log('Group Wise Filtered Approvers: ', grpWiseFilteredApprovers);

      // ✅ update activity object with new lists
      return {
        ...activity,
        performerStatusList: performerArray,
        assetStatusList: formattedAssets,
        approverList: grpWiseFilteredApprovers
      };
    })
  );

  console.log('Updated Activity List with Status:', updatedActivityList);

  return updatedActivityList;
};



  const fetchStatus = async (updatedActivityList,performerList,approverList) => {
    try {
      const result = await getPerformerAndAssetStatus(updatedActivityList, performerList,approverList);
      console.log("Resolved data:", result); // Update state with resolved data
      if(result)
      {
       if(!areActivityIdsMatching(result, currentActivityDetailsObject))
       {
         setCurrentActivityDetailsObject(result);
       }
       else{
        console.log("No change in Task data , Only the time is changed");
        const updatedArray = currentActivityDetailsObject?.map((activity, index) => {
          const updatedValues = result[index]; // Assuming result is an array of the same length
          return {
            ...activity, // Keep other properties from the original activity
            assetStatusList: updatedValues.assetStatusList,
            performerStatusList: updatedValues.performerStatusList,
            scheduledActivityEndTime: updatedValues.scheduledActivityEndTime,
            scheduledActivityStartTime: updatedValues.scheduledActivityStartTime,
          };
        });
    
        // Update state with the new array
        setCurrentActivityDetailsObject(updatedArray);
       }
      }
    } catch (error) {
      console.error("Error fetching performer and asset status:", error);
    }
  };

  
  











/**
 * This function is called when the user changes the performer dropdown value in the Activity Details table.
 * It will update the currentActivityDetailsObject state with the new performer value and check the availability of the performer for the given date and time.
 * If the performer is available, it will set the available flag to true otherwise it will set it to false.
 * It will also set the userEditedActivityDetails flag to true.
 * @param {object} event - The event object from the PrimeReact dropdown component
 * @param {object} row - The current row details from the Activity Details table
 * @param {number} index - The index of the current row in the Activity Details table
 */

  const handlePerformerChange = async (event, row, index) => {
    // setIsLoading(true)
// console.log("handlePerformerChange() called ");
// console.log("Current Selected StartDate : ", fromdate);
// console.log('Current row Details : ',row)
// console.log('Current Performer Selected : ',event.target.value)
    //console.log('Formatted DateAndTime : ',dayjs(fromdate).format('YYYY-MM-DD HH:mm:ss.SSS'))
    const updatedList = [...currentActivityDetailsObject];
    const updatedObject = { ...updatedList[index] };//* create a copy of the object from activityList whose index is coming as a parameter

    //setting the values
    updatedObject.performer = event.target.value ||'';
    
      // groupOrDeptName: newValue,
      // performerType: "Group",
      // groupOrDept: true,

      updatedObject.groupOrDeptName='';
      updatedObject.performerType='Performer'
      updatedObject.groupOrDept=false
   
    let start = dayjs(updatedObject.scheduledActivityStartTime).format(
      "YYYY-MM-DD HH:mm:ss.SSS"
    );
    let stop = dayjs(updatedObject.scheduledActivityEndTime).format(
      "YYYY-MM-DD HH:mm:ss.SSS"
    );
// console.log("Formatted Start: ", start, " Formatted Stop : ", stop);
    //The performer availability is based on its user id
    // let currentPerformerUserId = event.target.value; 
    // fetching the data whether the performer is available or not for a given start and stop
    // let performerAvailabilityList = await getPerformerAvailability(
    //   start,
    //   stop,
    //   currentPerformerUserId
    // ); //The performer availability for the given time is getting checked
// console.log("Fetched Performer List : ", performerAvailabilityList);
    // if (performerAvailabilityList) {
    //   updatedObject.performerAvlReasons=performerAvailabilityList
    //   if (performerAvailabilityList.length > 0) {//* A List of reasons is returned here for which the user is unavailable
    //     updatedObject.available = false;//* hence false is injecting here when the list size is greater than 0
    //   }
    //   else
    //   {
    //     updatedObject.available = true;//* otherwise user is available
    //   }
    // }
    // else
    // {
    //   updatedObject.available = false;//* if no response is achieved then performer is unavailable by default
    // }

    updatedList[index] = updatedObject;//updating the index for which the user selected the performer
    setCurrentActivityDetailsObject(updatedList);
    // setUserEditedActivityDetails(true);
    // setIsLoading(false)
  };

/**
 * Handles the change event of the approver dropdown. Updates the currentActivityDetailsObject state
 * by updating the approver value for the given index and sets the userEditedActivityDetails state to true.
 * @param {React.ChangeEvent<HTMLSelectElement>} event - The change event of the approver dropdown.
 * @param {Object} row - The row of the activity details table for which the approver is being changed.
 * @param {Number} index - The index of the row in the currentActivityDetailsObject state.
 */
const handleApproverChange= (event, row, index) => {
  // console.log('Approver => ',event.target.value)
  const updatedList = [...currentActivityDetailsObject];
  const updatedObject = { ...updatedList[index] };
  updatedObject.approver = event.target.value || '';
  updatedList[index] = updatedObject;
  setCurrentActivityDetailsObject(updatedList)
  setUserEditedActivityDetails(true)
};

/**
 * Handles the change event of the asset dropdown in the activity details table. Updates the currentActivityDetailsObject state
 * by updating the assetName and assetId values for the given index, and sets the userEditedActivityDetails state to true.
 * If the selected asset is not null, fetches the asset availability reasons list for the given start and stop times of the activity
 * and sets the assetAvlReasons and assetAvailable values of the updatedObject accordingly.
 * @param {React.ChangeEvent<HTMLSelectElement>} event - The change event of the asset dropdown.
 * @param {Object} row - The row of the activity details table for which the asset is being changed.
 * @param {Number} index - The index of the row in the currentActivityDetailsObject state.
 */
const handleAssetChange = (event, row, index) => {
  setIsLoading(true)
  const updatedList = [...currentActivityDetailsObject];
  const updatedObject = { ...updatedList[index] };
  const selectedAssetId = event.target.value;
  console.log('Selected Asset ID : ',selectedAssetId , ' Index : ',index)
  updatedObject.assetId = selectedAssetId
  updatedObject.assetName =updatedObject.assetNameList[updatedObject.assetIDList.findIndex(asset => asset === selectedAssetId)]??'';
 
  updatedList[index] = updatedObject;
  setCurrentActivityDetailsObject(updatedList);
console.log("Current updated List : ",updatedList)
// console.log("Current Asset name list : ",row.assetNameList)
  // setUserEditedActivityDetails(true);
  setIsLoading(false)
};







/**
 * Copies the performer from the first row to all other rows in the activity table.
 * The logic is as follows:
 * 1. If the first row is of type Individuals, it will copy the performer to all other rows.
 * 2. If the first row is of type Group, it will copy the group name to all other rows.
 * The function also validates the availability of the performer for the given time and updates the activity table accordingly.
 * If there is an error in fetching the performer availability, it will show an error message.
 * If the first row is not filled, it will show an error message.
 * @returns {undefined}
 */
const handleCopyFirstRowPerformer=async()=>
{

// console.log("handleCopyFirstRowPerformer() called")
  setIsLoading(true)
// console.log("Current Activity Details ",currentActivityDetailsObject)
// console.log("Current Performer to copy : ",currentActivityDetailsObject[0].performer);



  const isfirstRowGroup=currentActivityDetailsObject[0].filterSelection==='usergroup'
  // const isfirstRowDepartment=currentActivityDetailsObject[0].filterSelection==='department'
  const isfirstRowIndividuals=currentActivityDetailsObject[0].filterSelection==='individuals'

  if(isfirstRowIndividuals)//* if the first row is of type Individuals
    {
// console.log("The first row is of type Individuals")
     
        let currentperformer=currentActivityDetailsObject[0].performer;
       
        let copyCurrentActivityDetails = [...currentActivityDetailsObject];
// console.log("Copy Current Activity Details: ", copyCurrentActivityDetails);
        let modifiedList=null;
        try{
         modifiedList = await Promise.all(
  copyCurrentActivityDetails.map(async (data) => {
    let start = dayjs(data.scheduledActivityStartTime).format("YYYY-MM-DD HH:mm:ss.SSS");
    let stop = dayjs(data.scheduledActivityEndTime).format("YYYY-MM-DD HH:mm:ss.SSS");
    // let currentPerformeruserId = currentActivityDetailsObject[0].performer;

    let performerAvailabilityList = await getPerformerAvailability(
      start, stop,data.activityId, data.taskId
    );

    if (performerAvailabilityList) {
      data.performerAvlReasons = performerAvailabilityList;
      if (performerAvailabilityList.length > 0) {
        data.available = false;
      } else {
        data.available = true;
      }
    } else {
      data.available = false;
    }

    data.performer = currentperformer;
    data.filterSelection = "individuals";
    // data.approver = currentapprover;
    data.groupOrDeptName = "";
    data.performerType = "Performer";
    data.groupOrDept = false;

    return data;
  })
);

    }
    catch(err)
    {
// console.log("Error in fetching performer availability: ", err);
      setSeverityText('Error Copying Activity ! ')
      setSeverityType('error')
      setSnackbarOpen(true)
      setIsLoading(false)
      return;
    }
      
      // console.log("Copy List:", modifiedList);        
// console.log("Updated Activities List: ", modifiedList);
        setCurrentActivityDetailsObject(modifiedList);
      
    }
    else if(isfirstRowGroup)//* if the first row is of type group
    {
// console.log("First Row Selection is group")

        const groupName=currentActivityDetailsObject[0].groupOrDeptName;//* assign the first row groupName
        let copyCurrentActivityDetails = [...currentActivityDetailsObject];
// console.log("Copy Current Activity Details: ", copyCurrentActivityDetails);
        
        const updatedList = copyCurrentActivityDetails.map((data) => {
              if(data.activityUserGroupList.includes(groupName)===false) // * the group is getting copied and if the groupName of first row is  not present in subsequent row then the data is returned in unmodified state
                return data; //!data will be returned with unmodified state
           
            data.performer=''
            data.available=false
            data.filterSelection= isfirstRowGroup?"usergroup":""
            data.groupOrDeptName= groupName
            // data.performerType= "Group"
            data.performerType= isfirstRowGroup?"Group":""
            data.groupOrDept= true
            return data; 
        })
        
// console.log("Updated List : ", updatedList);
        setCurrentActivityDetailsObject(updatedList);
        setCopytoallperformer(true);
      
    }
    
    setIsLoading(false)
  

}


/**
 * Copies the approver of the first row to all the other rows.
 * @return {void}
 */
const handleCopyFirstRowApprover=()=>
  {
// console.log('handleCopyFirstRowApprover() called')
    const currentApprover=currentActivityDetailsObject[0].approver;
    let copyCurrentActivityDetails = [...currentActivityDetailsObject];

    const updatedList = copyCurrentActivityDetails.map((data) => {
      
       
        data.approver=currentApprover;
        
        return data; 
    })
    
// console.log("Updated List : ", updatedList);
    setCurrentActivityDetailsObject(updatedList);
    
  }

/**
 * Handles the change in the filter for a given row in the activity details table.
 * 
 * @param {Object} row The current row object from the table.
 * @param {Number} index The index of the row in the table.
 * @param {String} radioValue The value of the radio button that was selected. It can be either 'usergroup', 'department', or 'individuals'.
 * 
 * This function is used to update the filter for a given row in the activity details table. It is called when the user selects a radio button in the filter column of the table.
 * It updates the currentActivityDetailsObject state with the new filter value for the given row.
 */
const handleFilterChange=(row,index,radioValue)=>
  {
    console.group()
// console.log('handleFilterChange() called')
// console.log('Current Row : ',row)
// console.log('Current Row Value : ',radioValue)
// console.log('Current User Group Map : ',allGroupedUsersData)
    console.groupEnd()
  const updatedRow={...row}

  if(radioValue==='department')//deprecated
    {
      updatedRow.groupOrDeptName= row.activityDepartment
      updatedRow.performerType= "Department"
      updatedRow.groupOrDept= true
      updatedRow.filterSelection=radioValue;//! only in case of department there is one value 
      updatedRow.performer=''

      
    }
    else if(radioValue==='usergroup')
    {
      if(updatedRow.activityUserGroupList.length>0)
      {
      updatedRow.groupOrDeptName= updatedRow.activityUserGroupList[0]
      updatedRow.performerType= "Group"
      updatedRow.groupOrDept= true
       updatedRow.performer=''
       updatedRow.filterSelection='usergroup'
    
      }
      
    }
    else{ //* if the radiovalue is not usergroup type then it will be performer by default
// console.log('User has selected individuals ! ')
    updatedRow.filterSelection=radioValue;
    updatedRow.groupOrDeptName=''
    updatedRow.performer=''
    updatedRow.groupOrDept= false
    updatedRow.performerType= ""
    }
    // updatedRow.available=false

    const updatedActivityList=[...currentActivityDetailsObject]
    updatedActivityList[index]=updatedRow;
// console.log('Updated Activity List : ',updatedActivityList)
    setCurrentActivityDetailsObject(updatedActivityList)
  
  }

 const isAssetAvailable = () => currentActivityDetailsObject.some(data => data.assetStatusList?.length > 0);
console.log('Asset Available : ', isAssetAvailable())
 


  return (
    <>
      {/* The main parent div that returns the ActivityDetails component  */}
      <div
        style={{
          display: "flex",
          justifyContent: isMobile ? "center" : "flex-end",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <div>
          <Chip
            sx={{ fontWeight: "bold" }}
            color="info"
            icon={<TimelapseIcon />}
            label={`Task Duration: ${formatDuration(
              currentTotalActivityDuration
            )}`}
          ></Chip>
        </div>
      </div>
      {/* The table that displays the activity details */}
      {currentActivityDetailsObject?.length > 0 ? (
        <TableContainer
          component={Paper}
          className="dataTableStyle"
          sx={{ mt: 2 }}
        >
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              {/* Table Headers */}
              <TableRow>
                <StyledTableCell align="center">Sequence</StyledTableCell>
                <StyledTableCell align="center">Activity Name</StyledTableCell>
                {/* <StyledTableCell align="center">User Available</StyledTableCell> */}
                <StyledTableCell align="center">Performer Type</StyledTableCell>
                <StyledTableCell align="center">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <span>Performer</span>
                    {(currentActivityDetailsObject[0].performer?.length > 0 ||
                      currentActivityDetailsObject[0].groupOrDeptName?.length >
                        0) && (
                      <div>
                        <Tooltip
                          title="Copy to all Performers"
                          placement="top-start"
                        >
                          <IconButton
                            color="primary"
                            variant="outlined"
                            onClick={handleCopyFirstRowPerformer}
                          >
                            <ContentCopyIcon />
                          </IconButton>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <span>Approver</span>
                    {currentActivityDetailsObject[0].approver.length > 0 && (
                      <div>
                        <Tooltip
                          title="Copy to all Approvers"
                          placement="top-start"
                        >
                          <IconButton
                            color="primary"
                            variant="outlined"
                            onClick={handleCopyFirstRowApprover}
                          >
                            <ContentCopyIcon />
                          </IconButton>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                </StyledTableCell>

                {isAssetAvailable() && <StyledTableCell align="center">Select Asset</StyledTableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {/* iterating currentActivityDetailsObject to populate the subsequent data  */}
              {currentActivityDetailsObject?.map((row, index) => (
                <StyledTableRow
                  key={index + 1}
                  //   {row.cellId}
                >
                  <StyledTableCell align="center" component="th" scope="row">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>{row.sequence}</span>{" "}
                      {/* Bold sequence */}
                      {/* showing the buffer if present */}
                      <Tooltip
  title={
    row.buffer === 0 ? (
      ""
    ) : (
      <div style={{ backgroundColor: "white", padding: "5px", borderRadius: "5px", color: "black" }}>
        { `Buffer: ${row.buffer} min`}
        {/* {row.buffer > 0 && row.enforceStartDuration > 0 && " | "} */}
      </div>
    )
  }
  placement="top-start"
>
                        <Chip
                          size="small"
                          color="info"
                          icon={<WatchLaterIcon />}
                          label={row.duration}
                        />
                      </Tooltip>
                    </div>
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    {row.activityName}
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    <ButtonGroup>
                      <Tooltip title="Individuals">
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleFilterChange(row, index, "individuals")
                          }
                          color={
                            row.filterSelection === "individuals"
                              ? "primary"
                              : "default"
                          }
                        >
                          <PersonIcon />
                        </IconButton>
                      </Tooltip>

                      {row.activityUserGroupList.length > 0 && (
                        <Tooltip title="Group">
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleFilterChange(row, index, "usergroup")
                            }
                            color={
                              row.filterSelection === "usergroup"
                                ? "primary"
                                : "default"
                            }
                          >
                            <GroupIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </ButtonGroup>
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      {row?.filterSelection === "individuals" && (
                        <Dropdown
                          options={row.performerStatusList}
                          value={row.performer}
                          onChange={(event) => {
                            handlePerformerChange(event, row, index);
                          }}
                          //className="w-full"
                          style={{ maxWidth: isMobile ? "160px" : "250px" }}
                          optionValue="userID"
                          placeholder="Select Performer"
                          invalid={
                            validationForActivityDetails &&
                            row.performer === "" &&
                            row?.filterSelection === "individuals"
                          }
                          // style={{
                          //   // height: "30px",
                          //   width: isMobile ? "6rem" : "10rem",
                          // }}
                          // disabled={booleanSelfApproved}
                          itemTemplate={(option) => (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              onMouseEnter={() =>
                                overlayPanelRef.current?.hide()
                              }
                            >
                              <div>
                                {row.filterSelection === "individuals" &&
                                option.status ? (
                                  <CheckCircleIcon
                                    fontSize="small"
                                    sx={{
                                      color: "#10aa1d",
                                      paddingRight: "5px",
                                    }}
                                  />
                                ) : (
                                  <div
                                    style={{ width: "10%", cursor: "pointer" }}
                                  >
                                    {/* Cancel Icon to trigger OverlayPanel */}
                                    <CancelIcon
                                      fontSize="small"
                                      sx={{ color: "red", paddingRight: "5px" }}
                                      onMouseEnter={(e) =>
                                        overlayPanelRef.current.show(e)
                                      }
                                      // onMouseLeave={() => overlayPanelRef.current.hide()}
                                    />

                                    {/* OverlayPanel Popup */}
                                    <OverlayPanel
                                      ref={overlayPanelRef}
                                      style={{
                                        width: "300px",
                                        overflow: "auto",
                                        maxHeight: "70vh",
                                      }}
                                    >
                                      <div>
                                        {option.performerUnavailablity?.map(
                                          (reason, index) => (
                                            <div
                                              key={index}
                                              style={{ marginBottom: "10px" }}
                                            >
                                              {/* Unavailable Reason */}
                                              {index === 0 && (
                                                <Chip
                                                  label={
                                                    option.userName +
                                                    " ( " +
                                                    option.userID +
                                                    " )"
                                                  }
                                                  // variant=""
                                                  color="error"
                                                  size="small"
                                                  style={{ marginBottom: 10 }}
                                                />
                                              )}{" "}
                                              <Chip
                                                variant="outlined"
                                                color="error"
                                                sx={{
                                                  fontWeight: "bold",
                                                  fontSize: ".7rem",
                                                  marginBottom: "5px",
                                                }}
                                                label="Performer busy 🡇"
                                              />
                                              {/* Job Details */}
                                              {reason.jobId && (
                                                <Chip
                                                  color="info"
                                                  sx={{
                                                    fontWeight: "bold",
                                                    fontSize: ".7rem",
                                                    marginBottom: "5px",
                                                  }}
                                                  label={`Job ID: ${reason.jobId}`}
                                                />
                                              )}
                                              {reason.actId && (
                                                <Chip
                                                  color="info"
                                                  sx={{
                                                    fontWeight: "bold",
                                                    fontSize: ".7rem",
                                                    marginBottom: "5px",
                                                  }}
                                                  label={`Activity ID: ${reason.actId}`}
                                                />
                                              )}
                                              {reason.assetId && (
                                                <Chip
                                                  color="info"
                                                  sx={{
                                                    fontWeight: "bold",
                                                    fontSize: ".7rem",
                                                    marginBottom: "5px",
                                                  }}
                                                  label={`Asset ID: ${reason.assetId}`}
                                                />
                                              )}
                                              {/* Schedule Details */}
                                              <Chip
                                                color="info"
                                                sx={{
                                                  fontWeight: "bold",
                                                  fontSize: ".7rem",
                                                  marginBottom: "5px",
                                                }}
                                                label={`Start: ${formatDatetime(
                                                  dayjs(reason.scheduleStart)
                                                )}`}
                                              />
                                              <Chip
                                                color="info"
                                                sx={{
                                                  fontWeight: "bold",
                                                  fontSize: ".7rem",
                                                  marginBottom: "5px",
                                                }}
                                                label={`Stop: ${formatDatetime(
                                                  dayjs(reason.scheduleStop)
                                                )}`}
                                              />
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </OverlayPanel>
                                  </div>
                                )}
                              </div>
                              <div style={{ fontWeight: "bold" }}>
                                {option.userName}
                              </div>
                              {/* If the view is mobile then the userID is only displayed */}
                              {isMobile ? (
                                ""
                              ) : (
                                <div>{"( " + option.userID + " )"}</div>
                              )}
                            </div>
                          )}
                          valueTemplate={(option) => (
                            <UserValueTemplate
                              option={option}
                              defaultValue={"Performer"}
                              statusVisible={true}
                            />
                          )}
                          optionLabel="userName"
                          filter
                          filterBy="userName,userID"
                          // optionLabel={"userName"}
                          clearIcon
                        />
                      )}
                      {/* department case deprecated */}
                      {row?.filterSelection?.toLowerCase() === "department" && (
                        <FormControl
                          style={{ maxWidth: isMobile ? "200px" : "" }}
                          error={
                            validationForActivityDetails &&
                            row?.filterSelection?.toLowerCase() ===
                              "department" &&
                            row.groupOrDeptName === ""
                          }
                        >
                          <InputLabel>Select Departments</InputLabel>
                          <Select
                            // labelId="demo-simple-select-label"
                            // id="demo-simple-select"
                            value={row.groupOrDeptName}
                            label="Departments"
                            // onChange={(event) => {
                            //  handleDepartmentchange(event,row,index)
                            // }}
                          >
                            {
                              row?.activityDepartment && (
                                // departmentMap.map((itm, index) =>
                                <MenuItem
                                  key={index}
                                  value={row?.groupOrDeptName}
                                  component={motion.div}
                                  whileHover={{ scale: 1.1, originX: 0 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 300,
                                  }}
                                >
                                  {row?.groupOrDeptName}
                                </MenuItem>
                              )
                              // )
                            }
                          </Select>
                        </FormControl>
                      )}
                      {/* if the filterSelection is of type group then the below field will br rendered */}
                      {row?.filterSelection?.toLowerCase() === "usergroup" && (
                        <Dropdown
                          style={{ maxWidth: isMobile ? "200px" : "" }}
                          value={row.groupOrDeptName}
                          options={row?.activityUserGroupList}
                          invalid={
                            validationForActivityDetails &&
                            row?.filterSelection?.toLowerCase() ===
                              "usergroup" &&
                            row.groupOrDeptName === ""
                          }
                          placeholder="Select Groups"
                          //  itemTemplate={null}
                          onClick={(e) => e.preventDefault()}
                        />
                      )}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Dropdown
                        options={row.approverList}
                        value={row.approver}
                        onChange={(event) => {
                          handleApproverChange(event, row, index);
                        }}
                        className="w-full"
                        optionValue="userID"
                        placeholder="Select Approver"
                        invalid={
                          validationForActivityDetails && row.approver === ""
                        }
                        style={{ maxWidth: isMobile ? "160px" : "250px" }}
                        itemTemplate={(option) => (
                          <div>
                            <span style={{ fontWeight: "bold" }}>
                              {option.userName}
                            </span>

                            {isMobile ? (
                              ""
                            ) : (
                              <span>{"( " + option.userID + " )"}</span>
                            )}
                          </div>
                        )}
                        valueTemplate={(option) => (
                          // option ? (
                          //   <div className="flex align-items-center">
                          //     <span style={{ fontWeight: "bold" }}>
                          //       {option.userName}
                          //     </span>

                          //     {isMobile ? (
                          //       ""
                          //     ) : (
                          //       <span>{"( " + option.userID + " )"}</span>
                          //     )}
                          //   </div>
                          // ) : (
                          //   <span>Select Approver</span> // Display when no option is selected
                          // )
                          <UserValueTemplate
                            option={option}
                            defaultValue={"Approver"}
                            statusVisible={false}
                          />
                        )}
                        optionLabel="userName"
                        filter
                        // optionLabel={"userName"}
                        clearIcon
                      />
                    </div>
                  </StyledTableCell>

                    {isAssetAvailable()  &&  <StyledTableCell align="center">
                    {/* Asset selection */}
                    <PrimeReactDropdown
                      className="w-full"
                      value={row.assetId}
                      onChange={(event) => handleAssetChange(event, row, index)}
                      placeholder="Select Asset"
                      filter
                      options={row.assetStatusList}
                      invalid={
                        validationForActivityDetails &&
                        row.assetName === "" &&
                        row.assetIDList.length > 0
                      }
                      optionLabel="assetName"
                      optionValue="assetID"
                      itemTemplate={(option) => (
                        <div
                          style={{ display: "flex", alignItems: "center" }}
                          onMouseEnter={() => overlayPanelRef.current?.hide()}
                        >
                          <div>
                            {/* Check if the asset is available (status is true) */}
                            {option.status ? (
                              <CheckCircleIcon
                                fontSize="small"
                                sx={{ color: "#10aa1d", paddingRight: "5px" }}
                              />
                            ) : (
                              // If not available, display the tooltip with the reasons

                              <div style={{ width: "10%", cursor: "pointer" }}>
                                <CancelIcon
                                  fontSize="small"
                                  sx={{ color: "red", paddingRight: "5px" }}
                                  onMouseEnter={(e) =>
                                    overlayPanelRef.current?.show(e)
                                  }
                                  // onMouseLeave={() => overlayPanelRef.current.hide()}
                                />

                                <OverlayPanel
                                  ref={overlayPanelRef}
                                  style={{
                                    width: "300px",
                                    overflow: "auto",
                                    maxHeight: "70vh",
                                  }}
                                >
                                  <>
                                    {/* Unavailable Reason */}
                                    {index === 0 && (
                                      <Chip
                                        label={
                                          option.assetName +
                                          " ( " +
                                          option.assetID +
                                          " )"
                                        }
                                        // variant=""
                                        color="error"
                                        size="small"
                                        style={{ marginBottom: 10 }}
                                      />
                                    )}

                                    {option.assetUnavailablity?.map(
                                      (reason, index) => (
                                        <div key={index}>
                                          <Chip
                                            color="error"
                                            sx={{
                                              fontWeight: "bold",
                                              fontSize: ".7rem",
                                            }}
                                            label="Performer busy 🡇"
                                            variant="outlined"
                                          />
                                          {reason.jobId && (
                                            <Chip
                                              color="info"
                                              sx={{
                                                fontWeight: "bold",
                                                fontSize: ".7rem",
                                              }}
                                              label={`Job ID: ${reason.jobId}`}
                                            />
                                          )}
                                          {reason.actId && (
                                            <Chip
                                              color="info"
                                              sx={{
                                                fontWeight: "bold",
                                                fontSize: ".7rem",
                                              }}
                                              label={`Activity ID: ${reason.actId}`}
                                            />
                                          )}
                                          {reason.assetId && (
                                            <Chip
                                              color="info"
                                              sx={{
                                                fontWeight: "bold",
                                                fontSize: ".7rem",
                                              }}
                                              label={`Asset ID: ${reason.assetId}`}
                                            />
                                          )}
                                          {reason.scheduleStart && (
                                            <Chip
                                              color="info"
                                              sx={{
                                                fontWeight: "bold",
                                                fontSize: ".7rem",
                                              }}
                                              label={`Start: ${formatDatetime(
                                                dayjs(reason.scheduleStart)
                                              )}`}
                                            />
                                          )}
                                          {reason.scheduleStop && (
                                            <Chip
                                              color="info"
                                              sx={{
                                                fontWeight: "bold",
                                                fontSize: ".7rem",
                                              }}
                                              label={`Stop: ${formatDatetime(
                                                dayjs(reason.scheduleStop)
                                              )}`}
                                            />
                                          )}
                                        </div>
                                      )
                                    )}
                                  </>
                                </OverlayPanel>
                              </div>

                              // </Tooltip>
                            )}
                          </div>
                          {/* Display asset name */}
                          <span style={{ fontWeight: "bold" }}>
                            {option.assetName}
                          </span>
                        </div>
                      )}
                      valueTemplate={(option) =>
                        option ? (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {/* Check if a performer with the given userID has a 'status' */}
                            {option.status ? (
                              <CheckCircleIcon
                                fontSize="small"
                                sx={{ color: "#10aa1d", paddingRight: "5px" }}
                              />
                            ) : (
                              <CancelIcon
                                fontSize="small"
                                sx={{ color: "red", paddingRight: "5px" }}
                              />
                            )}
                            {/* Display user details */}
                            <div className="flex align-items-center">
                              <span style={{ fontWeight: "bold" }}>
                                {option.assetName}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span>Select Asset</span> // Display when no option is selected
                        )
                      }
                      disabled={row.assetIDList.length === 0 || row.assetIDList.length===1} 
                      // if there is one asset it will be auto selected and disabled
                    />
                  </StyledTableCell>}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        //Skeleton loader for the table
        <div>
          <DataTable value={[...Array(5)]} className="p-datatable-striped">
            <Column
              field="code"
              style={{ width: "25%" }}
              body={<Skeleton />}
            ></Column>
            <Column
              field="name"
              style={{ width: "25%" }}
              body={<Skeleton />}
            ></Column>
            <Column
              field="category"
              style={{ width: "25%" }}
              body={<Skeleton />}
            ></Column>
            <Column
              field="quantity"
              style={{ width: "25%" }}
              body={<Skeleton />}
            ></Column>
          </DataTable>
        </div>
      )}
    </>
  );
};

export default ActivityDetails;
