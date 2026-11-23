import React, { useEffect, useState } from "react";
import ExpandableDataTable from "./ExpandableDataTable";
import DatatableForUser from "./DatatableForUser";
import { fetchAllUsers } from "../UserModuleUpdated/UsermoduleApi";

const ManufacturingTablesContainer = ({ manufacturingData, groupBy }) => {
  const transformedData =
    manufacturingData?.map((item) => {
      const activityList = item.task?.activityList || [];

      // Calculate progress numeric value (0 to 100) for filtering and sorting
      const completedCount = activityList.filter(
        (activity) => activity.actvityStatus === "Completed",
      ).length;
      const progressValue =
        activityList.length > 0
          ? Math.ceil((completedCount * 100) / activityList.length)
          : 0;

      return {
        ...item,
        progress: progressValue, // Attach calculated numeric progress
        activityList:
          activityList.map((activity) => ({
            actAbrv: activity.actAbrv || null,
            actFile: activity.actFile || null,
            activityFileData: activity.activityFileData || null,
            activityId: activity.activityId,
            activityName: activity.activityName,
            actualActivityEndTime: activity.actualActivityEndTime,
            actualActivityStartTime: activity.actualActivityStartTime,
            actualActvtEnd: activity.actualActvtEnd || null,
            actualActvtyStrt: activity.actualActvtyStrt || null,
            actvityBtnDisableOnCompletion:
              activity.actvityBtnDisableOnCompletion,
            actvityBtnDisbleForActvtOrder:
              activity.actvityBtnDisbleForActvtOrder,
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
    }) || [];

  const result = {}; // Object to hold grouped data
  const [userData, setUserData] = useState([]);

  const getAllUsers = async () => {
    const data = await fetchAllUsers();
    setUserData(data);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Grouping logic
  transformedData.forEach((item) => {
    let groupKey = "";
    if (groupBy === "Task") {
      groupKey = item.task?.taskName || "NA";
      if (!result[groupKey]) result[groupKey] = [];
      result[groupKey].push(item);
    } else if (groupBy === "Tag") {
      groupKey = item.groupId === null ? "NA" : item.groupId;
      if (!result[groupKey]) result[groupKey] = [];
      result[groupKey].push(item);
    } else if (groupBy === "User") {
      item?.task?.activityList?.forEach((activity) => {
        userData.forEach((user) => {
          if (
            activity?.performer?.trim().toLowerCase() ===
            user?.userID?.trim().toLowerCase()
          ) {
            groupKey = user.userName;
          }
          if (!activity?.performer?.includes("@")) {
            groupKey = `${activity.performer} (group)`;
          }
        });
        if (!result[groupKey]) result[groupKey] = [];
        result[groupKey].push(item);
      });
    } else if (groupBy === "Asset") {
      item?.task?.activityList?.forEach((activity) => {
        groupKey = activity.assetName === "" ? "NA" : activity.assetName;
        if (!result[groupKey]) result[groupKey] = [];
        result[groupKey].push(item);
      });
    }
  });

  return (
    <div>
      {(groupBy === "Task" ||
        groupBy === "Tag" ||
        groupBy === "Asset" ||
        groupBy === "User") &&
        Object.entries(result).map(([header, data], index) => (
          <ExpandableDataTable
            key={index}
            data={data}
            header={header}
            groupBy={groupBy}
          />
        ))}
    </div>
  );
};

export default ManufacturingTablesContainer;
