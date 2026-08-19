import React from "react";
import { Carousel } from "primereact/carousel";
import { Card } from "primereact/card";

export function ActivityCarousel() {
  const activityCardDate = [
    {
      activityWaitingTime: 0,
      activitylists: "",
      actualJobEndTime: null,
      actualJobStartTime: null,
      adhoc: false,
      approver: "awadesh.verma@itc.in",
      assigner: "awadesh.verma@itc.in",
      awatingTime: null,
      completedJob: 0,
      currentActivityName: null,
      currentPerformer: null,
      end: null,
      fileName: null,
      groupId: null,
      instrument: null,
      jobCount: 0,
      jobID: "J20240813T121447687",
      jobName: "job 1",
      jobRemainingTime: 0,
      jobStatus: "Started",
      pendingJob: 0,
      performerLists: "",
      priority: "Low",
      priorityColor: null,
      progress: null,
      rejectedjob: 0,
      remarks: null,
      reviewerIntimationTime: null,
      scheduledJobEndTime: "2024-08-18T18:59:00.000+00:00",
      scheduledJobStartTime: "2024-08-18T18:30:00.000+00:00",
      start: null,
      task: {
        activityList: [
          {
            actAbrv: null,
            actFile: null,
            activityFileData: null,
            activityId: "A20240807T161937992",
            activityName: "Act1",
            actualActivityEndTime: "2024-08-13T06:45:55.000+00:00",
            actualActivityStartTime: "2024-08-13T06:45:33.000+00:00",
            actualActvtEnd: null,
            actualActvtyStrt: null,
            actvityBtnDisableOnCompletion: false,
            actvityBtnDisbleForActvtOrder: false,
            actvityStatus: "Started",
            actvtCount: 0,
            approver: "awadesh.verma@itc.in",
            assetAvailable: true,
            assetAvlReasons: [],
            assetIDList: null,
            assetId: null,
            assetName: "CLS Filling",
            assetNameList: null,
            available: true,
            booleanForActivityStatus: false,
            buffer: 0,
            completedActivity: 0,
            date: null,
            delayDueToBuffer: null,
            disable: false,
            disableForAction: false,
            duration: 17,
            enforce: false,
            getGroupOrDeptWisePerformer: null,
            groupOrDept: false,
            groupOrDeptName: "",
            jobId: null,
            logbook: "CL-ULB-CLSFMT-03-00",
            notBelongToApprover: false,
            notBelongToPerformer: false,
            pendingActivity: 0,
            performer: "awadesh.verma@itc.in",
            performerAvlReasons: [],
            performerType: "Performer",
            rejectedActivity: 0,
            remarks: null,
            reviewerActivityStartTime: null,
            reviewerActivityStopTime: null,
            scheduledActivityEndTime: "2024-08-18T18:47:00.000+00:00",
            scheduledActivityStartTime: "2024-08-18T18:30:00.000+00:00",
            selectedAssetIdsList: null,
            selectedAssetList: null,
            sequence: 1,
            taskId: "T20240807T161903864",
            taskName: null,
            xPos: null,
            yPos: null,
          },
          {
            actAbrv: null,
            actFile: null,
            activityFileData: null,
            activityId: "A20240807T162006338",
            activityName: "Act2",
            actualActivityEndTime: "2024-08-13T06:46:02.000+00:00",
            actualActivityStartTime: "2024-08-13T06:45:58.000+00:00",
            actualActvtEnd: null,
            actualActvtyStrt: null,
            actvityBtnDisableOnCompletion: false,
            actvityBtnDisbleForActvtOrder: false,
            actvityStatus: "Stop",
            actvtCount: 0,
            approver: "awadesh.verma@itc.in",
            assetAvailable: true,
            assetAvlReasons: [],
            assetIDList: null,
            assetId: null,
            assetName: "GBB Packing",
            assetNameList: null,
            available: true,
            booleanForActivityStatus: false,
            buffer: 0,
            completedActivity: 0,
            date: null,
            delayDueToBuffer: null,
            disable: false,
            disableForAction: false,
            duration: 12,
            enforce: false,
            getGroupOrDeptWisePerformer: null,
            groupOrDept: false,
            groupOrDeptName: "",
            jobId: null,
            logbook: "80360 FiamaGBB FamilyClebrtnPck",
            notBelongToApprover: false,
            notBelongToPerformer: false,
            pendingActivity: 0,
            performer: "awadesh.verma@itc.in",
            performerAvlReasons: [],
            performerType: "Performer",
            rejectedActivity: 0,
            remarks: null,
            reviewerActivityStartTime: null,
            reviewerActivityStopTime: null,
            scheduledActivityEndTime: "2024-08-18T18:59:00.000+00:00",
            scheduledActivityStartTime: "2024-08-18T18:47:00.000+00:00",
            selectedAssetIdsList: null,
            selectedAssetList: null,
            sequence: 2,
            taskId: "T20240807T161903864",
            taskName: null,
            xPos: null,
            yPos: null,
          },
          {
            actAbrv: null,
            actFile: null,
            activityFileData: null,
            activityId: "A20240807T162006338",
            activityName: "Act3",
            actualActivityEndTime: "2024-08-13T06:46:02.000+00:00",
            actualActivityStartTime: "2024-08-13T06:45:58.000+00:00",
            actualActvtEnd: null,
            actualActvtyStrt: null,
            actvityBtnDisableOnCompletion: false,
            actvityBtnDisbleForActvtOrder: false,
            actvityStatus: "Started",
            actvtCount: 0,
            approver: "awadesh.verma@itc.in",
            assetAvailable: true,
            assetAvlReasons: [],
            assetIDList: null,
            assetId: null,
            assetName: "GBB Packing",
            assetNameList: null,
            available: true,
            booleanForActivityStatus: false,
            buffer: 0,
            completedActivity: 0,
            date: null,
            delayDueToBuffer: null,
            disable: false,
            disableForAction: false,
            duration: 12,
            enforce: false,
            getGroupOrDeptWisePerformer: null,
            groupOrDept: false,
            groupOrDeptName: "",
            jobId: null,
            logbook: "80360 FiamaGBB FamilyClebrtnPck",
            notBelongToApprover: false,
            notBelongToPerformer: false,
            pendingActivity: 0,
            performer: "awadesh.verma@itc.in",
            performerAvlReasons: [],
            performerType: "Performer",
            rejectedActivity: 0,
            remarks: null,
            reviewerActivityStartTime: null,
            reviewerActivityStopTime: null,
            scheduledActivityEndTime: "2024-08-18T18:59:00.000+00:00",
            scheduledActivityStartTime: "2024-08-18T18:47:00.000+00:00",
            selectedAssetIdsList: null,
            selectedAssetList: null,
            sequence: 3,
            taskId: "T20240807T161903864",
            taskName: null,
            xPos: null,
            yPos: null,
          },
        ],
        noOfActivites: 0,
        statusTransition: 0,
        taskId: "T20240807T161903864",
        userDeptsList: [],
        userGroupsList: [],
      },
      weekdays: 5,
    },
  ];
  const activityList = activityCardDate[0]?.task?.activityList || [];

  // Sorting the activity list to ensure completed activities come first
  const reorderedActivityList = [...activityList].sort((a, b) => {
    if (a.actvityStatus === "Stop" && b.actvityStatus !== "Stop") {
      return -1;
    } else if (a.actvityStatus !== "Stop" && b.actvityStatus === "Stop") {
      return 1;
    }
    return 0;
  });

  // Template for rendering each activity in the carousel
  const activityTemplate = (activity) => {
    return (
      <Card
        title={activity.activityName}
        subTitle={`Asset: ${activity.assetName}`}
      >
        <p>
          <strong>Performer:</strong> {activity.performer}
        </p>
        <p>
          <strong>Status:</strong> {activity.actvityStatus}
        </p>
        <p>
          <strong>Duration:</strong> {activity.duration} minutes
        </p>
        <p>
          <strong>Scheduled Start:</strong>{" "}
          {new Date(activity.scheduledActivityStartTime).toLocaleString()}
        </p>
        <p>
          <strong>Scheduled End:</strong>{" "}
          {new Date(activity.scheduledActivityEndTime).toLocaleString()}
        </p>
      </Card>
    );
  };

  return (
    <Carousel
      value={reorderedActivityList} // Use reorderedActivityList instead of activityList
      itemTemplate={activityTemplate}
      numVisible={1}
      numScroll={1}
      //autoplayInterval={3000}
    />
  );
}
