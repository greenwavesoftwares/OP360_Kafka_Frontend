import React, { useEffect, useState } from "react";
import ExpandableDataTable from "./ExpandableDataTable";
import DatatableForUser from "./DatatableForUser";
import { fetchAllUsers } from "../UserModuleUpdated/UsermoduleApi";

const ManufacturingTablesContainer = ({ manufacturingData, groupBy }) => {
  // Log the groupBy value to check which grouping is being used
  // console.log("Group By Table :  ", groupBy);

  // Log the manufacturing data for debugging purposes
  // console.log("Manufacturing Data : ", manufacturingData);

  const transformedData = manufacturingData?.map((item) => {
    return {
      ...item,
      // task: null,
      activityList:
        item.task?.activityList.map((activity) => ({
          actAbrv: activity.actAbrv || null,
          actFile: activity.actFile || null,
          activityFileData: activity.activityFileData || null,
          activityId: activity.activityId,
          activityName: activity.activityName,
          actualActivityEndTime: activity.actualActivityEndTime,
          actualActivityStartTime: activity.actualActivityStartTime,
          actualActvtEnd: activity.actualActvtEnd || null,
          actualActvtyStrt: activity.actualActvtyStrt || null,
          actvityBtnDisableOnCompletion: activity.actvityBtnDisableOnCompletion,
          actvityBtnDisbleForActvtOrder: activity.actvityBtnDisbleForActvtOrder,
          actvityStatus: activity.actvityStatus,
          actvtCount: activity.actvtCount,
          approver: activity.approver,
          assetAvailable: activity.assetAvailable,
          assetAvlReasons: activity.assetAvlReasons,
          assetIDList: activity.assetIDList,
          assetId: activity.assetId,
          assetName: activity.assetName,
          assetNameList: activity.assetNameList,
          available: activity.available,
          booleanForActivityStatus: activity.booleanForActivityStatus,
          buffer: activity.buffer,
          completedActivity: activity.completedActivity,
          date: activity.date,
          delayDueToBuffer: activity.delayDueToBuffer,
          disable: activity.disable,
          disableForAction: activity.disableForAction,
          duration: activity.duration,
          enforce: activity.enforce,
          getGroupOrDeptWisePerformer: activity.getGroupOrDeptWisePerformer,
          groupOrDept: activity.groupOrDept,
          groupOrDeptName: activity.groupOrDeptName,
          jobId: activity.jobId,
          logbook: activity.logbook,
          notBelongToApprover: activity.notBelongToApprover,
          notBelongToPerformer: activity.notBelongToPerformer,
          pendingActivity: activity.pendingActivity,
          performer: activity.performer,
          performerAvlReasons: activity.performerAvlReasons,
          performerType: activity.performerType,
          rejectedActivity: activity.rejectedActivity,
          remarks: activity.remarks,
          reviewerActivityStartTime: activity.reviewerActivityStartTime,
          reviewerActivityStopTime: activity.reviewerActivityStopTime,
          scheduledActivityEndTime: activity.scheduledActivityEndTime,
          scheduledActivityStartTime: activity.scheduledActivityStartTime,
          selectedAssetIdsList: activity.selectedAssetIdsList,
          selectedAssetList: activity.selectedAssetList,
          sequence: activity.sequence,
          taskId: activity.taskId,
          taskName: activity.taskName,
          weekdays: activity.weekdays,
          xPos: activity.xPos,
          yPos: activity.yPos,
        })) || [],
    };
  });

  console.log("Json Data A : ", manufacturingData);

  // Log the groupType to check the current grouping
  console.log("GroupType A : ", groupBy);

  const result = {}; // Object to hold grouped data
  const [userData, setUserData] = useState([]);
  const getAllUsers = async () => {
    const data = await fetchAllUsers();
    setUserData(data);
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  // Loop through each item in manufacturingData
  transformedData.forEach((item) => {
    let groupKey = ""; // Variable to determine the grouping key
    let userType = "";
    // Determine the grouping key based on groupType
    if (groupBy === "Task") {
      groupKey = item.task.taskName; // Group by task name
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item); // Push item to the respective group
    } else if (groupBy === "Tag") {
      groupKey = item.groupId === null ? "NA" : item.groupId; // Group by group ID
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item); // Push item to the respective group
    } else if (groupBy === "User") {
      console.log("userData : ", userData);
      // Group by each performer in the activityList
      item?.task?.activityList?.forEach((activity) => {
        userData.forEach((user) => {
          if (
            activity?.performer?.trim().toLowerCase() ===
            user?.userID?.trim().toLowerCase()
          ) {
            // console.log(user.userName)
            groupKey = user.userName;
            userType = "single";
          }
          if (!activity?.performer?.includes("@")) {
            groupKey = `${activity.performer} (group)`;
            userType = "group";
          }
        });
        // groupKey = activity.performer; // Group by performer

        if (!result[groupKey]) {
          result[groupKey] = [];
        }

        // Push the current item into the corresponding group for this performer
        result[groupKey].push(item);
      });
    } else if (groupBy === "Asset") {
      console.log("userData : ", userData);
      // Group by each performer in the activityList
      item.task.activityList.forEach((activity) => {
        // userData.forEach((user) => {
        //   if (
        //     activity?.performer?.trim().toLowerCase() ===
        //     user?.userID?.trim().toLowerCase()
        //   ) {
        //     // console.log(user.userName)
        //     groupKey = user.userName;
        //   }
        //   if (!activity?.performer?.includes("@")) {
        groupKey = activity.assetName === "" ? "NA" : activity.assetName;
        //   }
        // });
        // groupKey = activity.performer; // Group by performer

        if (!result[groupKey]) {
          result[groupKey] = [];
        }

        // Push the current item into the corresponding group for this performer
        result[groupKey].push(item);
      });
    }
  });

  // Log the final grouped result for verification
  console.log("Result fro table : ", result);

  return (
    <div>
      {/* Render ExpandableDataTable for "Task" or "Tag" groupBy */}
      {(groupBy === "Task" ||
        groupBy === "Tag" ||
        groupBy === "Asset" ||
        groupBy === "User") &&
        Object.entries(result).map(([header, data], index) => (
          <ExpandableDataTable
            key={index} // Unique key for each table
            data={data} // Data to be displayed in the table
            header={header} // Header for the table
            groupBy={groupBy} // Current grouping type
          />
        ))}

      {/* Render DatatableForUser for "Asset" or "User" groupBy */}
      {/* {(groupBy === "Asset" || groupBy === "User") &&
        Object.entries(result)?.map(([header, data], index) => (
          <DatatableForUser
            key={index} // Unique key for each table
            data={data} // Data to be displayed in the table
            header={header} // Header for the table
            groupBy={groupBy} // Current grouping type
          />
        ))} */}
    </div>
  );
};

export default ManufacturingTablesContainer;
