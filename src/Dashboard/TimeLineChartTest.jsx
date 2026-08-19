import React from "react";
import { Chart } from "react-google-charts";
import { Panel } from "primereact/panel";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const transformData = (data) => {
  console.log("Timeline Data : ", JSON.stringify(data));
  const chartData = [
    [
      { type: "string", id: "Job" },
      { type: "string", id: "Activity" },
      { type: "date", id: "Start" },
      { type: "date", id: "End" },
    ],
  ];
  data.forEach((job) => {
    job.actvityList.forEach((activity) => {
      const startTime = new Date(activity.actualActivityStartTime);
      const endTime = new Date(activity.actualActivityEndTime);
      if (startTime.getFullYear() >= 2000 && endTime.getFullYear() >= 2000) {
        chartData.push([job.jobId, activity.activityName, startTime, endTime]);
      }
    });
  });
  return chartData;
};

const TimelineChartTest = ({ header }) => {
  const jsonData = [
    {
      jobId: "J20240813T125325263",
      jobName: "I am Testing",
      groupId: "NA",
      jobScheduleStartTime: "25/08/2024 00:00:00",
      jobScheduleStopTime: "25/08/2024 00:29:00",
      jobActualStartTime: "01/01/1900 00:00:00",
      jobActualStopTime: "01/01/1900 00:00:00",
      jobElapsedTime: "0d:0h:0m",
      progress: "100",
      priority: "Normal",
      tag: null,
      taskTemplate: "Task SR",
      activityId: "A20240807T162006338",
      activityName: "Act2",
      logBook: "80360 FiamaGBB FamilyClebrtnPck",
      performer: "Awadesh Verma",
      approver: null,
      activityStartTime: "13/08/2024 15:32:18",
      activityStoptime: "13/08/2024 15:32:20",
      scheduleActivityStartTime: null,
      scheduleActivityStopTime: null,
      currentActivity: null,
      currentPerformer: "",
      performers: "Awadesh Verma",
      sequeance: null,
      elapsedtime: null,
      standardDuration: null,
      assets: "CLS Filling,GBB Packing",
      jobstatus: "Completed",
      actvityList: [
        {
          taskId: "T20240807T161903864",
          taskName: null,
          jobId: null,
          activityId: "A20240807T161937992",
          activityName: "Act1",
          sequence: 1,
          logbook: "CL-ULB-CLSFMT-03-00",
          duration: 17,
          xPos: null,
          yPos: null,
          performer: "awadesh.verma@itc.in",
          approver: null,
          scheduledActivityStartTime: "2024-08-24T18:30:00.000+00:00",
          scheduledActivityEndTime: "2024-08-24T18:47:00.000+00:00",
          actualActivityStartTime: "2024-08-13T07:30:19.000+00:00",
          actualActivityEndTime: "2024-08-13T10:02:14.000+00:00",
          notBelongToPerformer: false,
          notBelongToApprover: false,
          actvityStatus: "Completed",
          actAbrv: null,
          available: true,
          performerAvlReasons: [],
          assetAvailable: true,
          assetAvlReasons: [],
          actualActvtyStrt: null,
          actualActvtEnd: null,
          reviewerActivityStartTime: null,
          reviewerActivityStopTime: null,
          remarks: null,
          assetId: null,
          assetName: "CLS Filling",
          assetIDList: null,
          assetNameList: null,
          groupOrDept: false,
          groupOrDeptName: null,
          performerType: null,
          getGroupOrDeptWisePerformer: null,
          completedActivity: 0,
          pendingActivity: 0,
          rejectedActivity: 0,
          date: null,
          actvtCount: 0,
          actFile: null,
          buffer: 0,
          delayDueToBuffer: null,
          enforce: false,
          booleanForActivityStatus: false,
          disable: false,
          disableForAction: false,
          selectedAssetList: null,
          selectedAssetIdsList: null,
          actvityBtnDisbleForActvtOrder: false,
          actvityBtnDisableOnCompletion: false,
        },
        {
          taskId: "T20240807T161903864",
          taskName: null,
          jobId: null,
          activityId: "A20240807T162006338",
          activityName: "Act2",
          sequence: 2,
          logbook: "80360 FiamaGBB FamilyClebrtnPck",
          duration: 12,
          xPos: null,
          yPos: null,
          performer: "awadesh.verma@itc.in",
          approver: null,
          scheduledActivityStartTime: "2024-08-24T18:47:00.000+00:00",
          scheduledActivityEndTime: "2024-08-24T18:59:00.000+00:00",
          actualActivityStartTime: "2024-08-13T10:02:18.000+00:00",
          actualActivityEndTime: "2024-08-13T10:20:20.000+00:00",
          notBelongToPerformer: false,
          notBelongToApprover: false,
          actvityStatus: "Completed",
          actAbrv: null,
          available: true,
          performerAvlReasons: [],
          assetAvailable: true,
          assetAvlReasons: [],
          actualActvtyStrt: null,
          actualActvtEnd: null,
          reviewerActivityStartTime: null,
          reviewerActivityStopTime: null,
          remarks: null,
          assetId: null,
          assetName: "GBB Packing",
          assetIDList: null,
          assetNameList: null,
          groupOrDept: false,
          groupOrDeptName: null,
          performerType: null,
          getGroupOrDeptWisePerformer: null,
          completedActivity: 0,
          pendingActivity: 0,
          rejectedActivity: 0,
          date: null,
          actvtCount: 0,
          actFile: null,
          buffer: 0,
          delayDueToBuffer: null,
          enforce: false,
          booleanForActivityStatus: false,
          disable: false,
          disableForAction: false,
          selectedAssetList: null,
          selectedAssetIdsList: null,
          actvityBtnDisbleForActvtOrder: false,
          actvityBtnDisableOnCompletion: false,
        },
      ],
      task: null,
      initial: ["Awadesh Verma"],
    },
  ];

  const data = transformData(jsonData);
  const options = {
    timeline: {
      showRowLabels: true,
      colorByRowData: true,
      showBarLabels: true,
    },
    hAxis: {
      format: "MMM dd, yyyy HH:mm:ss",
    },
  };

  return (
    <div>
      <Panel header={header} toggleable>
        <TransformWrapper
          initialScale={1}
          initialPositionX={0}
          initialPositionY={0}
        >
          {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
            <React.Fragment>
              <div>
                <button onClick={() => zoomIn()}>Zoom In</button>
                <button onClick={() => zoomOut()}>Zoom Out</button>
                <button onClick={() => resetTransform()}>Reset</button>
              </div>
              <TransformComponent>
                <Chart
                  chartType="Timeline"
                  data={data}
                  options={options}
                  legendToggle
                  aria-label="Project Timeline Chart"
                />
              </TransformComponent>
            </React.Fragment>
          )}
        </TransformWrapper>
      </Panel>
    </div>
  );
};

export default TimelineChartTest;
