import React, { useEffect, useState } from "react";
import CardDataView from "./CardDataView";
import { fetchAllUsers } from "../UserModuleUpdated/UsermoduleApi";

const AssetOrUserTableContainer = ({ jsonData, groupType }) => {
  // Log the incoming JSON data for debugging purposes
  console.log("Json Data A : ", jsonData);

  // Log the groupType to check the current grouping
  console.log("GroupType A : ", groupType);

  const result = {}; // Object to hold grouped data
  const [userData, setUserData] = useState([]);
  const getAllUsers = async () => {
    const data = await fetchAllUsers();
    setUserData(data);
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  // Loop through each item in jsonData
  jsonData.forEach((item) => {
    let groupKey = ""; // Variable to determine the grouping key
    let userType = "";
    // Determine the grouping key based on groupType
    if (groupType === "Task") {
      groupKey = item.task.taskName; // Group by task name
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item); // Push item to the respective group
    } else if (groupType === "Tag") {
      groupKey = item.groupId === null ? "NA" : item.groupId; // Group by group ID
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item); // Push item to the respective group
    } else if (groupType === "User") {
      console.log("userData : ", userData);
      // Group by each performer in the activityList
      item.task.activityList.forEach((activity) => {
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
    } else if (groupType === "Asset") {
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
  console.log("Result : ", result);

  return (
    <div>
      {/* Render CardDataView for each group */}
      {Object.entries(result).map(([header, data]) => (
        <CardDataView header={header} products={data} key={header} /> // Adding key for each CardDataView
      ))}
    </div>
  );
};

export default AssetOrUserTableContainer;

// jsonData = {
//   "Low Job Test 12-08-24": [
//     {
//       jobId: "J20240812T104936321",
//       jobName: "Job tested by Ashok (12-08-24)",
//       priority: "Low",
//       intPriority: 1,
//       plannedProgress: 100,
//       progress: 100,
//       asset: "NA",
//       workStatus: "Late",
//       statusMsg: "6013 Minutes",
//       currentPerformer: "NA",
//       currentActivity: "NA",
//       performers: [],
//       groupId: "Low Job Test 12-08-24",
//       task: {
//         activityList: [
//           {
//             actAbrv: null,
//             actFile: null,
//             activityFileData: null,
//             activityId: "A20240807T161937992",
//             activityName: "Act1",
//             scheduledActivityEndTime: "2024-08-12T05:37:11.000+00:00",
//             scheduledActivityStartTime: "2024-08-12T05:20:11.000+00:00",
//             taskId: "T20240807T161903864",
//             taskName: "Task SR",
//           },
//           {
//             actAbrv: null,
//             actFile: null,
//             activityFileData: null,
//             activityId: "A20240807T162006338",
//             activityName: "Act2",
//             scheduledActivityEndTime: "2024-08-12T05:49:11.000+00:00",
//             scheduledActivityStartTime: "2024-08-12T05:37:11.000+00:00",
//             taskId: "T20240807T161903864",
//             taskName: "Task SR",
//           },
//         ],
//         assetGroup: "ITC PCPB ULUBERIA",
//         noOfActivites: 0,
//         statusTransition: 0,
//         taskId: "T20240807T161903864",
//         taskName: "Task SR",
//       },
//     },
//   ],
//   "Critical Job Test 12-08-24": [
//     {
//       jobId: "J20240812T112254488",
//       jobName: "Critical Job tested by Ashok (12-08-24)",
//       priority: "Critical",
//       intPriority: 3,
//       plannedProgress: 100,
//       progress: 100,
//       asset: "NA",
//       workStatus: "Late",
//       statusMsg: "5978 Minutes",
//       currentPerformer: "NA",
//       currentActivity: "NA",
//       performers: [],
//       groupId: "Critical Job Test 12-08-24",
//       task: {
//         activityList: [
//           {
//             actAbrv: null,
//             actFile: null,
//             activityFileData: null,
//             activityId: "A20240807T161937992",
//             activityName: "Act1",
//             scheduledActivityEndTime: "2024-08-12T06:12:54.000+00:00",
//             scheduledActivityStartTime: "2024-08-12T05:55:54.000+00:00",
//             taskId: "T20240807T161903864",
//             taskName: "Task SR",
//           },
//           {
//             actAbrv: null,
//             actFile: null,
//             activityFileData: null,
//             activityId: "A20240807T162006338",
//             activityName: "Act2",
//             scheduledActivityEndTime: "2024-08-12T06:24:54.000+00:00",
//             scheduledActivityStartTime: "2024-08-12T06:12:54.000+00:00",
//             taskId: "T20240807T161903864",
//             taskName: "Task SR",
//           },
//         ],
//         assetGroup: "ITC PCPB ULUBERIA",
//         noOfActivites: 0,
//         statusTransition: 0,
//         taskId: "T20240807T161903864",
//         taskName: "Task SR1",
//       },
//     },
//   ],
// };
