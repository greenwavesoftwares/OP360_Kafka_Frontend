import dayjs from "dayjs";
import React from "react";

function EmailJobAssign(
  //   {
  //   jobId,
  //   jobName,
  //   jobStartTime,
  //   jobEndTime,
  //   activityName,
  //   activityID,
  // }
  data,
  header,
) {
  const emailData = data;

  console.log("emailData.data : ", emailData.data);

  // const emailData.data = [
  //   {
  //     activityWaitingTime: 0,
  //     activitylists: "",
  //     actualJobEndTime: null,
  //     actualJobStartTime: null,
  //     adhoc: false,
  //     approver: "awadesh.verma@itc.in",
  //     assigner: "awadesh.verma@itc.in",
  //     awatingTime: null,
  //     completedJob: 0,
  //     currentActivityName: null,
  //     currentPerformer: null,
  //     end: null,
  //     fileName: null,
  //     groupId: "Demo Job Testing",
  //     instrument: null,
  //     jobCount: 0,
  //     jobID: "J20240823T141654331",
  //     jobName: "Job_2308_2",
  //     jobRemainingTime: 0,
  //     jobStatus: "Not Started",
  //     pendingJob: 0,
  //     performerLists: "",
  //     priority: "Critical",
  //     priorityColor: null,
  //     progress: null,
  //     rejectedjob: 0,
  //     remarks: null,
  //     reviewerIntimationTime: null,
  //     scheduledJobEndTime: "2024-09-11T22:18:00.000+00:00",
  //     scheduledJobStartTime: "2024-09-11T18:30:00.000+00:00",
  //     start: null,
  //     task: {
  //       activityList: [
  //         {
  //           actAbrv: null,
  //           actFile: null,
  //           activityFileData: null,
  //           activityId: "A20240822T164903015",
  //           activityName: "Activity_1",
  //           actualActivityEndTime: null,
  //           actualActivityStartTime: null,
  //           actualActvtEnd: null,
  //           actualActvtyStrt: null,
  //           actvityBtnDisableOnCompletion: false,
  //           actvityBtnDisbleForActvtOrder: false,
  //           actvityStatus: "Not Started",
  //           actvtCount: 0,
  //           approver: "awadesh.verma@itc.in",
  //           assetAvailable: true,
  //           assetAvlReasons: [],
  //           assetIDList: null,
  //           assetId: "A20240822101700698",
  //           assetName: "GBB Asset 1",
  //           assetNameList: null,
  //           available: true,
  //           booleanForActivityStatus: false,
  //           buffer: 0,
  //           completedActivity: 0,
  //           date: null,
  //           delayDueToBuffer: null,
  //           disable: false,
  //           disableForAction: false,
  //           duration: 12,
  //           enforce: false,
  //           getGroupOrDeptWisePerformer: null,
  //           groupOrDept: true,
  //           groupOrDeptName: "GBB MFG",
  //           jobId: null,
  //           logbook: "Container Washing Logbook",
  //           notBelongToApprover: false,
  //           notBelongToPerformer: false,
  //           pendingActivity: 0,
  //           performer: "",
  //           performerAvlReasons: [],
  //           performerType: "Group",
  //           rejectedActivity: 0,
  //           remarks: null,
  //           reviewerActivityStartTime: null,
  //           reviewerActivityStopTime: null,
  //           scheduledActivityEndTime: "2024-09-11T18:42:00.000+00:00",
  //           scheduledActivityStartTime: "2024-09-11T18:30:00.000+00:00",
  //           selectedAssetIdsList: null,
  //           selectedAssetList: null,
  //           sequence: 1,
  //           taskId: "T20240822T164809250",
  //           taskName: "Job_2308_2",
  //           xPos: null,
  //           yPos: null,
  //         },
  //         {
  //           actAbrv: null,
  //           actFile: null,
  //           activityFileData: null,
  //           activityId: "A20240822T165042240",
  //           activityName: "Activity_5",
  //           actualActivityEndTime: null,
  //           actualActivityStartTime: null,
  //           actualActvtEnd: null,
  //           actualActvtyStrt: null,
  //           actvityBtnDisableOnCompletion: false,
  //           actvityBtnDisbleForActvtOrder: false,
  //           actvityStatus: "Not Started",
  //           actvtCount: 0,
  //           approver: "awadesh.verma@itc.in",
  //           assetAvailable: true,
  //           assetAvlReasons: [],
  //           assetIDList: null,
  //           assetId: "",
  //           assetName: "",
  //           assetNameList: null,
  //           available: true,
  //           booleanForActivityStatus: false,
  //           buffer: 0,
  //           completedActivity: 0,
  //           date: null,
  //           delayDueToBuffer: null,
  //           disable: false,
  //           disableForAction: false,
  //           duration: 60,
  //           enforce: false,
  //           getGroupOrDeptWisePerformer: null,
  //           groupOrDept: false,
  //           groupOrDeptName: "",
  //           jobId: null,
  //           logbook: "JobModified",
  //           notBelongToApprover: false,
  //           notBelongToPerformer: false,
  //           pendingActivity: 0,
  //           performer: "awadesh.verma@itc.in",
  //           performerAvlReasons: [],
  //           performerType: "Performer",
  //           rejectedActivity: 0,
  //           remarks: null,
  //           reviewerActivityStartTime: null,
  //           reviewerActivityStopTime: null,
  //           scheduledActivityEndTime: "2024-09-11T19:42:00.000+00:00",
  //           scheduledActivityStartTime: "2024-09-11T18:42:00.000+00:00",
  //           selectedAssetIdsList: null,
  //           selectedAssetList: null,
  //           sequence: 2,
  //           taskId: "T20240822T164809250",
  //           taskName: "Job_2308_2",
  //           xPos: null,
  //           yPos: null,
  //         },
  //         {
  //           actAbrv: null,
  //           actFile: null,
  //           activityFileData: null,
  //           activityId: "A20240822T164952598",
  //           activityName: "Activity_3",
  //           actualActivityEndTime: null,
  //           actualActivityStartTime: null,
  //           actualActvtEnd: null,
  //           actualActvtyStrt: null,
  //           actvityBtnDisableOnCompletion: false,
  //           actvityBtnDisbleForActvtOrder: false,
  //           actvityStatus: "Not Started",
  //           actvtCount: 0,
  //           approver: "awadesh.verma@itc.in",
  //           assetAvailable: true,
  //           assetAvlReasons: [],
  //           assetIDList: null,
  //           assetId: "",
  //           assetName: "",
  //           assetNameList: null,
  //           available: true,
  //           booleanForActivityStatus: false,
  //           buffer: 0,
  //           completedActivity: 0,
  //           date: null,
  //           delayDueToBuffer: null,
  //           disable: false,
  //           disableForAction: false,
  //           duration: 12,
  //           enforce: false,
  //           getGroupOrDeptWisePerformer: null,
  //           groupOrDept: false,
  //           groupOrDeptName: "",
  //           jobId: null,
  //           logbook: null,
  //           notBelongToApprover: false,
  //           notBelongToPerformer: false,
  //           pendingActivity: 0,
  //           performer: "awadesh.verma@itc.in",
  //           performerAvlReasons: [],
  //           performerType: "Performer",
  //           rejectedActivity: 0,
  //           remarks: null,
  //           reviewerActivityStartTime: null,
  //           reviewerActivityStopTime: null,
  //           scheduledActivityEndTime: "2024-09-11T19:54:00.000+00:00",
  //           scheduledActivityStartTime: "2024-09-11T19:42:00.000+00:00",
  //           selectedAssetIdsList: null,
  //           selectedAssetList: null,
  //           sequence: 3,
  //           taskId: "T20240822T164809250",
  //           taskName: "Job_2308_2",
  //           xPos: null,
  //           yPos: null,
  //         },
  //         {
  //           actAbrv: null,
  //           actFile: null,
  //           activityFileData: null,
  //           activityId: "A20240822T165018596",
  //           activityName: "Activity_4",
  //           actualActivityEndTime: null,
  //           actualActivityStartTime: null,
  //           actualActvtEnd: null,
  //           actualActvtyStrt: null,
  //           actvityBtnDisableOnCompletion: false,
  //           actvityBtnDisbleForActvtOrder: false,
  //           actvityStatus: "Not Started",
  //           actvtCount: 0,
  //           approver: "awadesh.verma@itc.in",
  //           assetAvailable: true,
  //           assetAvlReasons: [],
  //           assetIDList: null,
  //           assetId: "",
  //           assetName: "",
  //           assetNameList: null,
  //           available: true,
  //           booleanForActivityStatus: false,
  //           buffer: 0,
  //           completedActivity: 0,
  //           date: null,
  //           delayDueToBuffer: null,
  //           disable: false,
  //           disableForAction: false,
  //           duration: 12,
  //           enforce: false,
  //           getGroupOrDeptWisePerformer: null,
  //           groupOrDept: false,
  //           groupOrDeptName: "",
  //           jobId: null,
  //           logbook: "FormModified",
  //           notBelongToApprover: false,
  //           notBelongToPerformer: false,
  //           pendingActivity: 0,
  //           performer: "awadesh.verma@itc.in",
  //           performerAvlReasons: [],
  //           performerType: "Performer",
  //           rejectedActivity: 0,
  //           remarks: null,
  //           reviewerActivityStartTime: null,
  //           reviewerActivityStopTime: null,
  //           scheduledActivityEndTime: "2024-09-11T20:06:00.000+00:00",
  //           scheduledActivityStartTime: "2024-09-11T19:54:00.000+00:00",
  //           selectedAssetIdsList: null,
  //           selectedAssetList: null,
  //           sequence: 4,
  //           taskId: "T20240822T164809250",
  //           taskName: "Job_2308_2",
  //           xPos: null,
  //           yPos: null,
  //         },
  //         {
  //           actAbrv: null,
  //           actFile: null,
  //           activityFileData: null,
  //           activityId: "A20240822T164931801",
  //           activityName: "Activity_2",
  //           actualActivityEndTime: null,
  //           actualActivityStartTime: null,
  //           actualActvtEnd: null,
  //           actualActvtyStrt: null,
  //           actvityBtnDisableOnCompletion: false,
  //           actvityBtnDisbleForActvtOrder: false,
  //           actvityStatus: "Not Started",
  //           actvtCount: 0,
  //           approver: "awadesh.verma@itc.in",
  //           assetAvailable: true,
  //           assetAvlReasons: [],
  //           assetIDList: null,
  //           assetId: "A20240822101901233",
  //           assetName: "HC asset",
  //           assetNameList: null,
  //           available: true,
  //           booleanForActivityStatus: false,
  //           buffer: 0,
  //           completedActivity: 0,
  //           date: null,
  //           delayDueToBuffer: null,
  //           disable: false,
  //           disableForAction: false,
  //           duration: 12,
  //           enforce: false,
  //           getGroupOrDeptWisePerformer: null,
  //           groupOrDept: true,
  //           groupOrDeptName: "HC MFG",
  //           jobId: null,
  //           logbook: "Container Washing Logbook",
  //           notBelongToApprover: false,
  //           notBelongToPerformer: false,
  //           pendingActivity: 0,
  //           performer: "",
  //           performerAvlReasons: [],
  //           performerType: "Group",
  //           rejectedActivity: 0,
  //           remarks: null,
  //           reviewerActivityStartTime: null,
  //           reviewerActivityStopTime: null,
  //           scheduledActivityEndTime: "2024-09-11T20:18:00.000+00:00",
  //           scheduledActivityStartTime: "2024-09-11T20:06:00.000+00:00",
  //           selectedAssetIdsList: null,
  //           selectedAssetList: null,
  //           sequence: 5,
  //           taskId: "T20240822T164809250",
  //           taskName: "Job_2308_2",
  //           xPos: null,
  //           yPos: null,
  //         },
  //         {
  //           actAbrv: null,
  //           actFile: null,
  //           activityFileData: null,
  //           activityId: "A20240822T165112273",
  //           activityName: "Activity_6",
  //           actualActivityEndTime: null,
  //           actualActivityStartTime: null,
  //           actualActvtEnd: null,
  //           actualActvtyStrt: null,
  //           actvityBtnDisableOnCompletion: false,
  //           actvityBtnDisbleForActvtOrder: false,
  //           actvityStatus: "Not Started",
  //           actvtCount: 0,
  //           approver: "awadesh.verma@itc.in",
  //           assetAvailable: true,
  //           assetAvlReasons: [],
  //           assetIDList: null,
  //           assetId: "",
  //           assetName: "",
  //           assetNameList: null,
  //           available: true,
  //           booleanForActivityStatus: false,
  //           buffer: 0,
  //           completedActivity: 0,
  //           date: null,
  //           delayDueToBuffer: null,
  //           disable: false,
  //           disableForAction: false,
  //           duration: 120,
  //           enforce: false,
  //           getGroupOrDeptWisePerformer: null,
  //           groupOrDept: false,
  //           groupOrDeptName: "",
  //           jobId: null,
  //           logbook: "UserModified",
  //           notBelongToApprover: false,
  //           notBelongToPerformer: false,
  //           pendingActivity: 0,
  //           performer: "awadesh.verma@itc.in",
  //           performerAvlReasons: [],
  //           performerType: "Performer",
  //           rejectedActivity: 0,
  //           remarks: null,
  //           reviewerActivityStartTime: null,
  //           reviewerActivityStopTime: null,
  //           scheduledActivityEndTime: "2024-09-11T22:18:00.000+00:00",
  //           scheduledActivityStartTime: "2024-09-11T20:18:00.000+00:00",
  //           selectedAssetIdsList: null,
  //           selectedAssetList: null,
  //           sequence: 6,
  //           taskId: "T20240822T164809250",
  //           taskName: "Job_2308_2",
  //           xPos: null,
  //           yPos: null,
  //         },
  //       ],
  //       assetGroup: "Demo Asset",
  //       noOfActivites: 0,
  //       statusTransition: 0,
  //       taskId: "T20240822T164809250",
  //       taskName: "Demo Task",
  //       userDeptsList: [],
  //       userGroupsList: [],
  //     },
  //     weekdays: 5,
  //   },
  // ];
  console.log("emailData.data", emailData.data.task.activityList.length);
  console.log("forwardLink : ", emailData.data.forwardLink);
  const repeat = emailData.data.task.activityList.length;
  let activityDateSection = emailData.data.task.activityList
    .map(
      (activity) => `
    <table
            align="center"
            border="0"
            cellpadding="0"
            cellspacing="0"
            class="row row-9"
            width="100%"
          >
            <tbody>
              <tr>
                <td>
                  <table
                    align="center"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    class="row-content tstyle"
                    style="
                      background-color: #fbfbfb;
                      color: #000000;
                      width: 680px;
                    "
                    width="680"
                  >
                    <tbody>
                      <tr>
                        <td
                          class="column column-1"
                          style="
                            font-weight: 400;
                            text-align: left;
                            padding-left: 35px;
                            padding-right: 20px;
                            vertical-align: top;
                            border-top: 0px;
                            border-right: 0px;
                            border-bottom: 0px;
                            border-left: 0px;
                            padding-top: 5px;
                            padding-bottom: 5px;
                          "
                          width="15%"
                        >
                        <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="image_block block-2"
                        width="100%"
                      >
                        <tr>
                          <td
                            class="pad"
                            style="
                              width: 100%;
                              padding-right: 0px;
                              padding-left: 0px;
                              padding-top: 5px;
                            "
                          >
                            <div
                              align="center"
                              class="alignment"
                              style="line-height: 10px"
                            >
                              <img
                                alt=""
                                src="https://raw.githubusercontent.com/pranab-greenwave/pranab-greenwave/main/man.png"
                                style="
                                  display: block;
                                  height: auto;
                                  border: 0;
                                  width: 40px;
                                  max-width: 100%;
                                "
                                width="130"
                              />
                            </div>
                          </td>
                        </tr>
                      </table>
                          
                          
                        </td>
                        <td
                          class="column column-1"
                          style="
                            font-weight: 400;
                            text-align: left;
                            padding-left: 20px;
                            padding-right: 20px;
                            vertical-align: top;
                            border-top: 0px;
                            border-right: 0px;
                            border-bottom: 0px;
                            border-left: 0px;
                            padding-top: 12px;
                            padding-bottom: 5px;
                          "
                          width="85%"
                        >
                        
                          
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="heading_block block-4"
                            width="100%"
                          >
                            <tr>
                              <td
                                class="pad"
                                style="
                                  padding-bottom: 5px;
                                  text-align: center;
                                  width: 100%;
                                "
                              >
                                <h1
                                  style="
                                    margin: 0;
                                    color: #7f848f;
                                    font-family: 'Cabin', Arial,
                                      'Helvetica Neue', Helvetica, sans-serif;
                                    font-size: 12px;
                                    font-weight: 700;
                                    letter-spacing: 1px;
                                    text-align: left;
                                    margin-top: 0;
                                    margin-bottom: 0;
                                  "
                                >
                                  <span class="tinyMce-placeholder"
                                    >Acitivity Name : ${activity.activityName}</span
                                  >
                                </h1>
                              </td>
                            </tr>
                            
                           <tr>
                              <td
                                class="pad"
                                style="
                                  padding-bottom: 5px;
                                  text-align: center;
                                  width: 100%;
                                "
                              >
                                <h1
                                  style="
                                    margin: 0;
                                    color: #7f848f;
                                    font-family: 'Cabin', Arial,
                                      'Helvetica Neue', Helvetica, sans-serif;
                                    font-size: 12px;
                                    font-weight: 700;
                                    letter-spacing: 1px;
                                    text-align: left;
                                    margin-top: 0;
                                    margin-bottom: 0;
                                  "
                                >
                                  <span class="tinyMce-placeholder"
                                    >Performer Name :${activity.groupOrDept ? activity.groupOrDeptName : activity.performer}</span
                                  >
                                </h1>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
  `,
    )
    .join("");

  const demoHtml = `<!DOCTYPE html>
<html
  lang="en"
>
</body>
</html>
  <head>
    <title>Job Assigned</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- google font link -->
    <link
      href="https://fonts.googleapis.com/css?family=Cabin"
      rel="stylesheet"
      type="text/css"
    />
    <!-- icon -->
    <script
      src="https://kit.fontawesome.com/823adb53b6.js"
      crossorigin="anonymous"
    ></script>
    <!-- end -->
    
  </head>
  <body
    style="
      background-color: #f2f2f2;
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: none;
      text-size-adjust: none;
    "
  >
    <table
      border="0"
      cellpadding="0"
      cellspacing="0"
      class="container"
      style="
        background-color: #f2f2f2;
      "
      width="100%"
    >
      <tbody>
        <tr>
          <td>
            <!-- Top Header Space -->
            <table
              align="center"
              border="0"
              cellpadding="0"
              cellspacing="0"
              class="row row-1"
              width="100%"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      class="row-content tstyle"
                      style="
                        width: 680px;
                      "
                      width="680"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column column-1"
                            style="
                              font-weight: 400;
                              text-align: left;
                              vertical-align: top;
                              padding-top: 7px;
                              padding-bottom: 5px;
                              border-top: 0px;
                              border-right: 0px;
                              border-bottom: 0px;
                              border-left: 0px;
                            "
                            width="100%"
                          >
                            <div
                              class="spacer_block"
                              style="
                                height: 20px;
                                line-height: 20px;
                                font-size: 1px;
                              "
                            ></div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- Header Name and Company Logo -->
            <!-- start -->
            <table
              align="center"
              border="0"
              cellpadding="0"
              cellspacing="0"
              class="row row-3"
              width="100%"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      class="row-content"
                      style="
                        background-color: #fbfbfb;
                        color: #000000;
                        width: 680px;
                        border-bottom: 0.4rem solid #f2f2f2;
                      "
                      width="680"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column column-1"
                            style="
                              font-weight: 400;
                              text-align: left;
                              padding-left: 20px;
                              vertical-align: middle;
                              border-top: 0px;
                              border-right: 0px;
                              border-bottom: 0px;
                              border-left: 0px;
                            "
                            width="83.3%"
                          >
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="heading_block block-2"
                              width="100%"
                            >
                              <!-- top left side text -->
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    width: 100%;
                                    text-align: center;
                                    padding-top: 5px;
                                  "
                                >
                                  <h2
                                    style="
                                      margin: 0;
                                      color: #524F96;
                                      font-size: 1.25rem;
                                      font-family: Cabin, Arial, Helvetica Neue,
                                        Helvetica, sans-serif;
                                      text-align: left;
                                      font-weight: 600;
                                      margin-top: 0;
                                      margin-bottom: 0;
                                    "
                                  >
                                    <strong>Operations360</strong>
                                  </h2>
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td
                            class="column column-2"
                            style="
                              font-weight: 400;
                              text-align: left;
                              vertical-align: top;
                              border-top: 0px;
                              border-right: 0px;
                              border-bottom: 0px;
                              border-left: 0px;
                            "
                            width="16.666666666666668%"
                          >
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="image_block block-2"
                              width="100%"
                            >
                              <!-- GW logo -->
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    width: 100%;
                                    padding-right: 0px;
                                    padding-left: 0px;
                                    padding-top: 5px;
                                    padding-bottom: 5px;
                                  "
                                >
                                  <div
                                    align="center"
                                    class="alignment"
                                    style="line-height: 10px"
                                  >
                                    <img
                                      class="gw-logo"
                                      src="https://raw.githubusercontent.com/pranab-greenwave/pranab-greenwave/main/logo.png"
                                      style="
                                        display: block;
                                        height: auto;
                                        border: 0;
                                        width: 35% ;
                                      "
                                      width="50"
                                    />
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- end -->
            <!-- column 2 btn, text & Image -->
            <!-- start column 2  -->
            <table
            align="center"
            border="0"
            cellpadding="0"
            cellspacing="0"
            class="row row-5"
            width="100%"
          >
            <tbody>
              <tr>
                <td>
                  <table
                    align="center"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    class="row-content tstyle"
                    style="
                      background-color: #fbfbfb;
                      color: #000000;
                      width: 680px;
                    "
                    width="680"
                  >
                    <!-- col 2 left side text -->
                    <tbody>
                      <tr class="reverse">
                        <td
                          class="column column-1 first"
                          style="
                            font-weight: 400;
                            text-align: left;
                            padding-left: 25px;
                            vertical-align: top;
                            border-top: 0px;
                            border-right: 0px;
                            border-bottom: 0px;
                            border-left: 0px;
                            vertical-align: middle;
                          "
                          width="50%"
                        >
                          <div class="border">
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="heading_block block-3"
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-bottom: 10px;
                                    padding-left: 5px;
                                    padding-right: 5px;
                                    padding-top: 5px;
                                    text-align: center;
                                    width: 100%;
                                  "
                                >
                                  <h1
                                    style="
                                      margin: 0;
                                      color: #2f2e41;
                                      direction: ltr;
                                      font-family: 'Cabin', Arial,
                                        'Helvetica Neue', Helvetica,
                                        sans-serif;
                                      font-size: 1.1rem;
                                      font-weight: 400;
                                      letter-spacing: 1px;
                                      line-height: 120%;
                                      text-align: left;
                                      margin-top: 0;
                                      margin-bottom: 0;
                                    "
                                  >
                                    <strong class="main-text">${emailData.data.header}</strong>
                                  </h1>
                                </td>
                              </tr>
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-bottom: 5px;
                                    padding-left: 5px;
                                    padding-right: 5px;
                                    padding-top: 5px;
                                    text-align: center;
                                    width: 100%;
                                  "
                                >
                                  <p
                                    style="
                                      margin: 0;
                                      color: #2f2e41;
                                      direction: ltr;
                                      font-family: 'Cabin', Arial,
                                        'Helvetica Neue', Helvetica,
                                        sans-serif;
                                      font-size: 0.75rem;
                                      font-weight: 400;
                                      letter-spacing: 1px;
                                      text-align: left;
                                      margin-top: 0;
                                      margin-bottom: 0;
                                      white-space: nowrap;
                                      overflow: hidden;
                                      text-overflow: ellipsis;
                                      max-width: 250px;
                                    "
                                  >
                                   <strong class="main-text" style="background-color: #e4e3f4; color: black; padding: 5px;border-radius: 10px;">
                                        Job Name : ${emailData.data.jobName}
                                    </strong>

                                  </p>
                                </td>
                              </tr>
                            </table>
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="paragraph_block block-4"
                              style="
                                word-break: break-word;padding-top: 15px;padding-left: 5px;
                              "
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                 padding: 0px;"
                                >
                                 <a href=${emailData.data.forwardLink} target="_blank" style="
                                    
                                    ">
                                    Open Activity</a>
                                </td>
                              </tr>
                            </table>
                          </div>
                        </td>
                        <td
                          class="column column-2 last"
                          style="
                            font-weight: 400;
                            text-align: left;
                            vertical-align: top;
                            border-top: 0px;
                            border-right: 0px;
                            border-bottom: 0px;
                            border-left: 0px;
                          "
                          width="50%"
                        >
                          <div class="border">
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="image_block block-2"
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-bottom: 25px;
                                    padding-left: 0px;
                                    padding-right: 0px;
                                    padding-top: 20px;
                                    width: 100%;
                                  "
                                >
                                  <div
                                    align="center"
                                    class="alignment"
                                    style="line-height: 10px"
                                  >
                                    <img
                                      alt=""
                                      class="fullMobileWidth"
                                      src="https://raw.githubusercontent.com/pranab-greenwave/pranab-greenwave/main/Job%20Assigned_Right_Side_Image.png"
                                      style="
                                        display: block;
                                        height: auto;
                                        border: 0;
                                        width: 262px;
                                        max-width: 100%;
                                      "
                                      width="282"
                                    />
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
            <!-- End column 2 -->
            <table
              align="center"
              border="0"
              cellpadding="0"
              cellspacing="0"
              class="row row-6"
              width="100%"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      class="row-content tstyle"
                      style="
                        background-color: none;
                        color: #000000;
                        width: 680px;
                      "
                      width="680"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column column-1"
                            style="
                              font-weight: 400;
                              text-align: left;
                              vertical-align: top;
                              padding-top: 0px;
                              padding-bottom: 0px;
                              border-top: 0px;
                              border-right: 0px;
                              border-bottom: 0px;
                              border-left: 0px;
                            "
                            width="100%"
                          >
                            <div
                              class="spacer_block"
                              style="
                                height: 10px;
                                line-height: 10px;
                                font-size: 1px;
                              "
                            >
                               
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
   
            <table
              align="center"
              border="0"
              cellpadding="0"
              cellspacing="0"
              class="row row-8"
              style="
                background-size: auto;
              "
              width="100%"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      class="row-content tstyle"
                      style="
                        background-color: #fbfbfb;
                        color: #000000;
                        background-size: auto;
                        width: 680px;
                      "
                      width="680"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column column-1"
                            style="
                              font-weight: 400;
                              text-align: left;
                              border-bottom: 0px solid #ffffff;
                              border-left: 0px solid #ffffff;
                              border-right: 0px solid #ffffff;
                              border-top: 0px solid #ffffff;
                              padding-left: 0px;
                              padding-right: 0px;
                              vertical-align: top;
                              padding-top: 10px;
                              padding-bottom: 8px;
                              border-bottom: 2px solid #0000000f;
                            "
                            width="100%"
                          >
                            <table
                              border="0"
                              cellpadding="5"
                              cellspacing="0"
                              class="heading_block block-1"
                              width="100%"
                            >
                              <tr>
                                <td class="pad">
                                  <h1
                                    style="
                                      margin: 0;
                                      color: #2f2e41;
                                      direction: ltr;
                                      font-family: 'Cabin', Arial,
                                        'Helvetica Neue', Helvetica, sans-serif;
                                      font-size: 0.9rem;
                                      font-weight: 400;
                                      letter-spacing: 1px;
                                      line-height: 120%;
                                      text-align: left;
                                      margin-top: 0;
                                      margin-bottom: 0;
                                      text-align: center;
                                    "
                                  >
                                    <strong>Job Details</strong>
                                  </h1>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              border="0"
              cellpadding="0"
              cellspacing="0"
              class="row row-9"
              width="100%"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      class="row-content tstyle"
                      style="
                        background-color: #fbfbfb;
                        color: #000000;
                        width: 680px;
                      "
                      width="680"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column column-1"
                            style="
                              font-weight: 400;
                              text-align: left;
                              padding-left: 20px;
                              padding-right: 20px;
                              vertical-align: top;
                              border-top: 0px;
                              border-right: 0px;
                              border-bottom: 0px;
                              border-left: 0px;
                              padding-top: 5px;
                            "
                            width="25%"
                          >
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="image_block block-2"
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    width: 100%;
                                    padding-right: 0px;
                                    padding-left: 0px;
                                    padding-top: 5px;
                                  "
                                >
                                  <div
                                    align="center"
                                    class="alignment"
                                    style="line-height: 10px"
                                  >
                                    <img
                                      alt=""
                                      src="https://raw.githubusercontent.com/pranab-greenwave/pranab-greenwave/main/name-tag.png"
                                      style="
                                        display: block;
                                        height: auto;
                                        border: 0;
                                        width: 90px;
                                        max-width: 100%;
                                      "
                                      width="130"
                                    />
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="heading_block block-3"
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-bottom: 10px;
                                    padding-top: 10px;
                                    text-align: center;
                                    width: 100%;
                                  "
                                >
                                  <h1
                                    style="
                                      margin: 0;
                                      color: #979faf;
                                      font-family: 'Cabin', Arial,
                                        'Helvetica Neue', Helvetica, sans-serif;
                                      font-size: 12px;
                                      font-weight: 700;
                                      letter-spacing: 1px;
                                      text-align: center;
                                      margin-top: 0px;
                                      margin-bottom: 0;
                                    "
                                  >
                                  Job Id
                                  </h1>
                                </td>
                              </tr>
                            </table>
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="heading_block block-4"
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-bottom: 5px;
                                    text-align: center;
                                    width: 100%;
                                  "
                                >
                                  <h1
                                    style="
                                      margin: 0;
                                      color: #7f848f;
                                      font-family: 'Cabin', Arial,
                                        'Helvetica Neue', Helvetica, sans-serif;
                                      font-size: 12px;
                                      font-weight: 700;
                                      letter-spacing: 1px;
                                      text-align: center;
                                      margin-top: 0;
                                      margin-bottom: 0;
                                    "
                                  >
                                    <span class="tinyMce-placeholder"
                                      >
                                      <strong class="main-text" style="color: black; padding: 2px;">
                                      ${emailData.data.jobID}
                                      </strong>
                                      </span
                                    >
                                  </h1>
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td
                            class="column column-2"
                            style="
                              font-weight: 400;
                              text-align: left;
                              padding-left: 20px;
                              padding-right: 20px;
                              vertical-align: top;
                              border-top: 0px;
                              border-right: 0px;
                              border-bottom: 0px;
                              border-left: 0px;
                              padding-top: 5px;
                            "
                            width="25%"
                          >
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="image_block block-2"
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    width: 100%;
                                    padding-right: 0px;
                                    padding-left: 0px;
                                    padding-top: 5px;
                                  "
                                >
                                  <div
                                    align="center"
                                    class="alignment"
                                    style="line-height: 10px"
                                  >
                                    <img
                                      alt=""
                                      src="https://raw.githubusercontent.com/pranab-greenwave/pranab-greenwave/main/document.png"
                                      style="
                                        display: block;
                                        height: auto;
                                        border: 0;
                                        width: 90px;
                                        max-width: 100%;
                                      "
                                      width="130"
                                    />
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="heading_block block-3"
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-bottom: 10px;
                                    padding-top: 10px;
                                    text-align: center;
                                    width: 100%;
                                  "
                                >
                                  <h1
                                    style="
                                      margin: 0;
                                      color: #979faf;
                                      direction: ltr;
                                      font-family: 'Cabin', Arial,
                                        'Helvetica Neue', Helvetica, sans-serif;
                                      font-size: 12px;
                                      font-weight: 700;
                                      letter-spacing: 1px;
                                      line-height: 120%;
                                      text-align: center;
                                      margin-top: 0;
                                      margin-bottom: 0;
                                    "
                                  >
                                  Job Name
                                  </h1>
                                </td>
                              </tr>
                            </table>
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="heading_block block-4"
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-bottom: 20px;
                                    text-align: center;
                                    width: 100%;
                                  "
                                >
                                  <h1
                                    style="
                                      margin: 0;
                                      color: #7f848f;
                                      direction: ltr;
                                      font-family: 'Cabin', Arial,
                                        'Helvetica Neue', Helvetica, sans-serif;
                                      font-size: 12px;
                                      font-weight: 700;
                                      letter-spacing: 1px;
                                      line-height: 120%;
                                      text-align: center;
                                      margin-top: 0;
                                      margin-bottom: 0;
                                    "
                                  >
                                    <span class="tinyMce-placeholder"
                                      >${emailData.data.jobName}</span
                                    >
                                  </h1>
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td
                            class="column column-3"
                            style="
                              font-weight: 400;
                              text-align: left;
                              padding-left: 20px;
                              padding-right: 20px;
                              vertical-align: top;
                              border-top: 0px;
                              border-right: 0px;
                              border-bottom: 0px;
                              border-left: 0px;
                              padding-top: 5px;
                            "
                            width="25%"
                          >
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="image_block block-2"
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    width: 100%;
                                    padding-right: 0px;
                                    padding-left: 0px;
                                    padding-top: 5px;
                                  "
                                >
                                  <div
                                    align="center"
                                    class="alignment"
                                    style="line-height: 10px"
                                  >
                                    <img
                                      alt=""
                                      src="https://raw.githubusercontent.com/pranab-greenwave/pranab-greenwave/main/clock.png"
                                      style="
                                        display: block;
                                        height: auto;
                                        border: 0;
                                        width: 90px;
                                        max-width: 100%;
                                      "
                                      width="130"
                                    />
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="heading_block block-3"
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-bottom: 10px;
                                    padding-top: 10px;
                                    text-align: center;
                                    width: 100%;
                                  "
                                >
                                  <h1
                                    style="
                                      margin: 0;
                                      color: #979faf;
                                      direction: ltr;
                                      font-family: 'Cabin', Arial,
                                        'Helvetica Neue', Helvetica, sans-serif;
                                      font-size: 12px;
                                      font-weight: 700;
                                      letter-spacing: 1px;
                                      line-height: 120%;
                                      text-align: center;
                                      margin-top: 0;
                                      margin-bottom: 0;
                                    "
                                  >
                                  Job Start Date
                                  </h1>
                                </td>
                              </tr>
                            </table>
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="heading_block block-4"
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-bottom: 20px;
                                    text-align: center;
                                    width: 100%;
                                  "
                                >
                                  <h1
                                    style="
                                      margin: 0;
                                      color: #7f848f;
                                      direction: ltr;
                                      font-family: 'Cabin', Arial,
                                        'Helvetica Neue', Helvetica, sans-serif;
                                      font-size: 12px;
                                      font-weight: 700;
                                      letter-spacing: 1px;
                                      line-height: 120%;
                                      text-align: center;
                                      margin-top: 0;
                                      margin-bottom: 0;
                                    "
                                  >
                                    <span class="tinyMce-placeholder"
                                      >${dayjs(emailData.data.scheduledJobStartTime).format("D MMM YY h:mm A")}
                                    </span>
                                  </h1>
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td
                            class="column column-4"
                            style="
                              font-weight: 400;
                              text-align: left;
                              padding-left: 20px;
                              padding-right: 20px;
                              vertical-align: top;
                              border-top: 0px;
                              border-right: 0px;
                              border-bottom: 0px;
                              border-left: 0px;
                              padding-top: 5px;
                            "
                            width="25%"
                          >
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="image_block block-2"
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    width: 100%;
                                    padding-right: 0px;
                                    padding-left: 0px;
                                    padding-top: 5px;
                                  "
                                >
                                  <div
                                    align="center"
                                    class="alignment"
                                    style="line-height: 10px"
                                  >
                                    <img
                                      alt=""
                                      src="https://raw.githubusercontent.com/pranab-greenwave/pranab-greenwave/main/calendar.png"
                                      style="
                                        display: block;
                                        height: auto;
                                        border: 0;
                                        width: 90px;
                                        max-width: 100%;
                                      "
                                      width="130"
                                    />
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="heading_block block-3"
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-bottom: 10px;
                                    padding-top: 10px;
                                    text-align: center;
                                    width: 100%;
                                  "
                                >
                                  <h1
                                    style="
                                      margin: 0;
                                      color: #979faf;
                                      direction: ltr;
                                      font-family: 'Cabin', Arial,
                                        'Helvetica Neue', Helvetica, sans-serif;
                                      font-size: 12px;
                                      font-weight: 700;
                                      letter-spacing: 1px;
                                      line-height: 120%;
                                      text-align: center;
                                      margin-top: 0;
                                      margin-bottom: 0;
                                    "
                                  >
                                  Job End Date 
                                  </h1>
                                </td>
                              </tr>
                            </table>
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="heading_block block-4"
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-bottom: 20px;
                                    text-align: center;
                                    width: 100%;
                                  "
                                >
                                  <h1
                                    style="
                                      margin: 0;
                                      color: #7f848f;
                                      direction: ltr;
                                      font-family: 'Cabin', Arial,
                                        'Helvetica Neue', Helvetica, sans-serif;
                                      font-size: 12px;
                                      font-weight: 700;
                                      letter-spacing: 1px;
                                      line-height: 120%;
                                      text-align: center;
                                      margin-top: 0;
                                      margin-bottom: 0;
                                    "
                                  >
                                    <span class="tinyMce-placeholder">
                                      ${dayjs(emailData.data.scheduledJobEndTime).format("D MMM YY h:mm A")}
                                    </span>
                                  </h1>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
              <table
            align="center"
            border="0"
            cellpadding="0"
            cellspacing="0"
            class="row row-10"
            width="100%"
          >
            <tbody>
              <tr>
                <td>
                  <table
                    align="center"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    class="row-content tstyle"
                    style="
                      color: #000000;
                      width: 680px;
                    "
                    width="680"
                  >
                    <tbody>
                      <tr>
                        <td
                          class="column column-1"
                          style="
                            font-weight: 400;
                            text-align: left;
                            vertical-align: top;
                            padding-top: 0px;
                            padding-bottom: 0px;
                            border-top: 0px;
                            border-right: 0px;
                            border-bottom: 0px;
                            border-left: 0px;
                            padding-top: 5px;
                          "
                          width="100%"
                        >
                          <div
                            class="spacer_block"
                            style="
                              height: 5px;
                              line-height: 5px;
                              font-size: 1px;
                      font: optional;
                            "
                          >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
            <table
            align="center"
            border="0"
            cellpadding="0"
            cellspacing="0"
            class="row row-8"
            style="
              background-size: auto;
            "
            width="100%"
          >
            <tbody>
              <tr>
                <td>
                  <table
                    align="center"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    class="row-content tstyle"
                    style="
                      background-color: #fbfbfb;
                      color: #000000;
                      background-size: auto;
                      width: 680px;
                    "
                    width="680"
                  >
                    <tbody>
                      <tr>
                        <td
                          class="column column-1"
                          style="
                            font-weight: 400;
                            text-align: left;
                            border-bottom: 0px solid #ffffff;
                            border-left: 0px solid #ffffff;
                            border-right: 0px solid #ffffff;
                            border-top: 0px solid #ffffff;
                            padding-left: 0px;
                            padding-right: 0px;
                            vertical-align: top;
                            padding-top: 10px;
                            padding-bottom: 8px;
                            border-bottom: 2px solid #0000000f;
                          "
                          width="100%"
                        >
                          <table
                            border="0"
                            cellpadding="5"
                            cellspacing="0"
                            class="heading_block block-1"
                            width="100%"
                          >
                            <tr>
                              <td class="pad">
                                <h1
                                  style="
                                    margin: 0;
                                    color: #2f2e41;
                                    direction: ltr;
                                    font-family: 'Cabin', Arial,
                                      'Helvetica Neue', Helvetica, sans-serif;
                                    font-size: 0.75rem;
                                    font-weight: 400;
                                    letter-spacing: 1px;
                                    line-height: 120%;
                                    text-align: left;
                                    margin-top: 0;
                                    margin-bottom: 0;
                                    text-align: center;
                                  "
                                >
                                  <strong>Acitivity Details</strong>
                                </h1>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table
            align="center"
            border="0"
            cellpadding="0"
            cellspacing="0"
            class="row row-9"
            width="100%"
          >
            <tbody>
              <tr>
                <td>
                  ${activityDateSection}
                </td>
              </tr>
            </tbody>
          </table>
            <table
              align="center"
              border="0"
              cellpadding="0"
              cellspacing="0"
              class="row row-10"
              width="100%"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      class="row-content tstyle"
                      style="
                        color: #000000;
                        width: 680px;
                      "
                      width="680"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column column-1"
                            style="
                              font-weight: 400;
                              text-align: left;
                              vertical-align: top;
                              padding-top: 0px;
                              padding-bottom: 0px;
                              border-top: 0px;
                              border-right: 0px;
                              border-bottom: 0px;
                              border-left: 0px;
                              padding-top: 5px;
                            "
                            width="100%"
                          >
                            <div
                              class="spacer_block"
                              style="
                                height: 20px;
                                line-height: 20px;
                                font-size: 1px;
                        font: optional;
                              "
                            >
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- End -->
    <!-- css style -->
    <style>
      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        padding: 0;
      }

      #MessageViewBody a {
        color: inherit;
        text-decoration: none;
      }

      p {
        line-height: inherit;
      }

      .desktop_hide,
      .desktop_hide table {
        display: none;
        max-height: 0px;
        overflow: hidden;
      }

      @media (max-width: 700px) {
        .fullMobileWidth,
        .row-content {
          width: 100% !important;
        }
        .bg-hide{
          background-image: none !important;
        }
        .fullMobileWidth{
          width: 90% !important;
        }
        .mobile_hide {
          display: none;
        }

        .tstyle .column {
          width: 100%;
          display: block;
        }

        .mobile_hide {
          min-height: 0;
          max-height: 0;
          max-width: 0;
          overflow: hidden;
          font-size: 0px;
        }

        .desktop_hide,
        .desktop_hide table {
          display: table !important;
          max-height: none !important;
        }

        .reverse {
          display: table;
          width: 100%;
        }

        .reverse .column.first {
          display: block !important;
          padding: 0.6rem !important;
        }
        .gw-logo{
          width: 25% !important;
        }

        .reverse .column.last {
          display: table-header-group !important;
        }

        .row-5 td.column.first > table {
          padding-left: 25px;
          padding-right: 0;
        }

        .row-5 td.column.first .border,
        .row-5 td.column.last .border {
          border-top: 0;
          border-right: 0px;
          border-bottom: 0;
          border-left: 0;
        }

        .row-5 td.column.last > table {
          padding-left: 0;
          padding-right: 0;
        }
      }
    </style>
  </body>
</html>
`;

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: demoHtml }} />
    </>
  );
}

export default EmailJobAssign;
