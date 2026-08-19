import dayjs from "dayjs";
import { decryptTokenId } from "../helper/AuthService";
import { downloadFileFromMinIO, sendMailForNextActivities } from "./JobPerformerAPI";
import { Modal as AntdModal, Button } from "antd";
import { deleteData, getData } from "../Logbook/OfflineLogbook/indexedDb";
import { SaveTransaction } from "../Logbook/LogbookApi";
import { getTenantID } from "../UserModuleUpdated/UsermoduleApi";
import EmailJobReview from "../Email Template/EmailJobReview";
import { sendEmail } from "../JobAssign/JobAssignAPI";
import { sendNotification } from "../pwa/pushNotification";

import ReactDOMServer from "react-dom/server"; // For server-side rendering of React components
/**
 * Function to add job details in localStorage with hardcoded keys
 * This function takes in an object details with the job details
 * and stores them in localStorage with the corresponding keys
 * @param {Object} details - Object with job details
 */
export async  function addLocalVariablesForJob(details,activity,version,currentuser,loc,selectedDate) {
  // Retrieve environment variables for keys
  const jobNameKey = process.env.REACT_APP_JOBNAME;
  const jobIdKey = process.env.REACT_APP_JOBID;
  const assignerKey = process.env.REACT_APP_ASSIGNER;
  const approverKey = process.env.REACT_APP_APPROVER;
  const scheduledJobStartTimeKey = process.env.REACT_APP_SCHEDULEDJOBSTARTTIME;
  const scheduledJobEndTimeKey = process.env.REACT_APP_SCHEDULEDJOBENDTIME;
  const actualJobStartTimeKey = process.env.REACT_APP_ACTUALJOBSTARTTIME;
  const actualJobEndTimeKey = process.env.REACT_APP_ACTUALJOBENDTIME;
  const reviewerIntimationTimeKey = process.env.REACT_APP_REVIEWERINTIMATIONTIME;
  const priorityKey = process.env.REACT_APP_PRIORITY;
  const instrumentKey = process.env.REACT_APP_INSTRUMENT;
  const groupIdKey = process.env.REACT_APP_GROUPID;
  const remarksKey = process.env.REACT_APP_REMARKS;
  const jobStatusKey = process.env.REACT_APP_JOBSTATUS;
  const priorityColorKey = process.env.REACT_APP_PRIORITYCOLOR;
  const awaitingTimeKey = process.env.REACT_APP_AWATINGTIME;
  const progressKey = process.env.REACT_APP_PROGRESS;
  const weekdaysKey = process.env.REACT_APP_WEEKDAYS;
  const currentActivityNameKey = process.env.REACT_APP_CURRENTACTIVITYNAME;
  const fileNameKey = process.env.REACT_APP_FILENAME;
  const performerListsKey = process.env.REACT_APP_PERFORMERLISTS;
  const activityListsKey = process.env.REACT_APP_ACTIVITYLISTS;
  const scheduledActivityStart=process.env.REACT_APP_SCHEDULEDACTIVITYSTARTTIME
  const scheduledActivityEnd=process.env.REACT_APP_SCHEDULEDACTIVITYENDTIME
  const actualActivityStart=process.env.REACT_APP_ACTUALACTIVITYSTARTTIME
  const actualActivityEnd=process.env.REACT_APP_ACTUALACTIVITYENDTIME
  const currentPerformerKey = process.env.REACT_APP_CURRENTPERFORMER;
  const currentLoc=process.env.REACT_APP_LOCATION;
  const errorData=await getData(details.jobID ,activity.activityId);

  console.log("Error data in addLocalVariables for job:",errorData)
  return {
    [jobNameKey]: details.jobName || '',
    [jobIdKey]: details.jobID || '',
    [assignerKey]: details.assigner || '',
    [approverKey]: details.approver || '',
    [scheduledJobStartTimeKey]: formatDatetime(details.scheduledJobStartTime) ,
    [scheduledJobEndTimeKey]: formatDatetime(details.scheduledJobEndTime),
    [actualJobStartTimeKey]: formatDatetime(details.actualJobStartTime),
    [actualJobEndTimeKey]: formatDatetime(details.actualJobEndTime) ,
    [reviewerIntimationTimeKey]: formatDatetime(details.reviewerIntimationTime),
    [priorityKey]: details.priority || '',
    [instrumentKey]: details.instrument || '',
    [groupIdKey]: details.groupId || '',
    [remarksKey]: details.remarks || '',
    [jobStatusKey]: details.jobStatus || '',
    [priorityColorKey]: details.priorityColor || '',
    [awaitingTimeKey]: details.awatingTime || '',
    [progressKey]: details.progress || '',
    [weekdaysKey]: details.weekdays || '',
    [currentActivityNameKey]: details.currentActivityName || '',
    [currentPerformerKey]: details.currentPerformer || '',
    [fileNameKey]: details.fileName || '',
    [performerListsKey]: details.performerLists || '',
    [activityListsKey]: details.activitylists || '',
    [process.env.REACT_APP_ACTIVITYID]: activity.activityId, //Store the activity id into the local storage
    [process.env.REACT_APP_FORMNAME]: activity.logbook, //store the logbook into the local storage
    [process.env.REACT_APP_VERSIONNUMBER]: version ,//store the version of the logbook into the session storage
    [scheduledActivityStart]:formatDatetime(activity.scheduledStartTime),
    [scheduledActivityEnd]:formatDatetime(activity.scheduledEndTime) ,
    [actualActivityStart]:formatDatetime(activity.activityActualstart) ,
    [actualActivityEnd]:formatDatetime(activity.activityActualend) ,
    [currentLoc]:loc,
    [process.env.REACT_APP_USERID]:currentuser,
    [process.env.REACT_APP_SELECTEDDATEINPERFORMER]:selectedDate,
    [process.env.REACT_APP_ERRORBY]:errorData?.errorBy || activity[process.env.REACT_APP_ERRORBY] || ''
    ,[process.env.REACT_APP_ERRORMSG]:errorData?.errorMsg || activity[process.env.REACT_APP_ERRORMSG] || ''
    ,[process.env.REACT_APP_ISERROR]:((errorData?.error || (activity[process.env.REACT_APP_ERRORMSG] && activity[process.env.REACT_APP_ERRORMSG].length>0) && 1) )
 
     };
}
export function formatDatetime(datetime){
  return dayjs(datetime).format('YYYY-MM-DD HH:mm:ss') ==='Invalid Date'? null:dayjs(datetime).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * Derive initials from a given userid or group name
 * @param {string} str - user id or group name
 * @returns {string} - Initials of the given string
 */
export function deriveInitials (str){
  if (str === undefined || str === null || str === "") return;//returns if the param is undefined
  str=str.split("@")[0]//Fetch the string before the @
  let list = str.split(".");//further split the string based on .
  let initials = (
    list.length > 1 ? list[0][0] + list[1][0] : list[0][0]
  ).toUpperCase();//find the first letter of the strings and convert it to upper case
  return initials;
};


/**
 * Fetches the current user's ID from local storage.
 * @returns {string} The decrypted user ID of the current user.
 */
export const fetchCurrentUser = () => {
  const env_userId = process.env.REACT_APP_USERID;

  const user = localStorage.getItem(env_userId);
  const current_User = decryptTokenId(user);
  return current_User;
};
//Function to check  the signature of a file
  const checkSignature = (byteArray, signature) => {
    for (let i = 0; i < signature.length; i++) {
      //Itereate through the bytearray
      if (byteArray[i] !== signature[i]) {
        //check whether the  byte matches the signature

        return false;
      }
    }
    return true;
    //return true or false based on  whether the signature matches or not
  };
  /**
   * Function to download file
   */
  const downloadFile = (byteArray, fileName, mimeType) => {
    const blob = new Blob([byteArray], { type: mimeType });

    // Create URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName); // Set the download attribute with the desired file name

    // Append the link to the body
    document.body.appendChild(link);

    // Programmatically click the link to trigger the download
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  export async function emailPerformerForNextActivities(job){
    try{
    if(job && job.task.activityList[0].actvityStatus.toLowerCase() ===
        "Completed".toLowerCase()){
          
          const response=await sendMailForNextActivities(job.jobID)
          
          if(response?.status===200)
            console.log("Email sent successfully")
          else
            console.error("Email unsuccessful")
          
        }
      }catch(e){
        console.error("Error in sending mail")
      }
  }
  export async function handleDownloadFileClick(key)  {
    try {
      const response = await downloadFileFromMinIO(key);

      let filename = key.substring(key.indexOf("_") + 1);

     
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");

      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("File download error", err);
    }
  };
  
    export async function saveUnsavedTransaction(
  data,
  setOpenSnackbar,
  setSnackContent
) {
  const currentUser = fetchCurrentUser();

  const showErrorSnackbar = (dialog) => {
    setOpenSnackbar(true);

    setSnackContent({
      dialog,
      severity: "error",
    });
  };

  const existingErrorMsg =
    data?.[process.env.REACT_APP_ERRORMSG];

  const existingErrorBy =
    data?.[process.env.REACT_APP_ERRORBY];

  const isAnotherUserSaving =
    existingErrorMsg?.length > 0 &&
    existingErrorBy &&
    existingErrorBy.toLowerCase() !==
      currentUser.toLowerCase();

  if (isAnotherUserSaving) {
    showErrorSnackbar(
      "Logbook Transaction is not saved. Kindly wait for the transaction to be saved by the given user."
    );

    return false;
  }

  try {
    const errordata = await getData(
      data.jobid,
      data.activityId
    );

    const hasUnsavedTransaction =
      errordata &&
      errordata?.errorMsg &&
      errordata.errorMsg.length > 0;

    if (!hasUnsavedTransaction) {
      return true;
    }

    const { savedAt, payload } = errordata;

    return new Promise((resolve) => {
      const closeModal = (modal, result) => {
        modal.destroy();
        resolve(result);
      };

      const modal = AntdModal.confirm({
        title: "Unsaved Transaction Found",

        content: `Do you want to restore the unsaved data logged at ${dayjs(
          savedAt
        ).format("YYYY-MM-DD HH:mm")} and save it to transactions?`,

        centered: true,

        closable: true,

        onCancel: () => {
          resolve(false);
        },

        footer: [
          <div
            key="footer-buttons"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
            }}
          >
            <Button
              danger
              onClick={async () => {
                try {
                  await deleteData(
                    data.jobid,
                    data.activityId
                  );

                  closeModal(modal, true);
                } catch (error) {
                  console.error(
                    "Failed to delete previous transaction:",
                    error
                  );

                  closeModal(modal, false);
                }
              }}
            >
              Close with Previous Transaction
            </Button>

            <Button
              type="primary"
              onClick={async () => {
                try {
                  const transactionSavedStatus =
                    await SaveTransaction(
                      payload
                    );

                  if (
                    transactionSavedStatus !== 200
                  ) {
                    showErrorSnackbar(
                      "Logbook Transaction is not saved. Kindly save the transaction manually by navigating to the Logbook."
                    );

                    closeModal(modal, false);
                    return;
                  }

                  await deleteData(
                    data.jobid,
                    data.activityId
                  );

                  closeModal(modal, true);
                } catch (error) {
                  console.error(
                    "Restore transaction failed:",
                    error
                  );

                  showErrorSnackbar(
                    "Failed to restore transaction."
                  );

                  closeModal(modal, false);
                }
              }}
            >
              Restore
            </Button>
          </div>,
        ],
      });
    });
  } catch (error) {
    console.error(
      "Error while validating unsaved transaction:",
      error
    );

    showErrorSnackbar(
      "Unable to verify unsaved transaction."
    );

    return false;
  }
}

/**
   * Function to send email notifications to activity reviewers
   * @param {array} jobsToMail - Array of objects containing job details
   * @param {array} toMailList - Array of email addresses to send the notifications to
   * @returns {boolean} - True if all emails were sent successfully, false otherwise
   */
  export async function sendEmailNotificationsToReviewJob  (
    jobsToMail,
    toMailList,
  )  {
    try {
      console.log("Inside send mail performer")
      console.log("Jobs to mail:",jobsToMail)
      const homePage = process.env.REACT_APP_HOME;

      const emailNotifications = await Promise.all(
        jobsToMail.map(async (data) => {
          let notificationsuccess=null
          const tenant=getTenantID()
          
          try {
            const notificationBody = {
                          title: "Job Review Pending",
            
                          body: `Your have a job ${data.jobName} pending for review`,
            
                          url: "/workflow/jobReviewer",
                        }
                        console.log('notificationBody ::: ', notificationBody)
                        console.log("To Mail ids:::",toMailList[0])
                        try{
                         notificationsuccess=await sendNotification(tenant, toMailList[0],notificationBody );}
                        catch(e){
                          console.error("Error in send notification:",notificationsuccess)
                        }
            let finalMailHtml = createHtmlString(data, homePage);
            // Remove the outer <div> tags from the HTML string
            finalMailHtml = finalMailHtml
              .replace(/^<div>/, "")
              .replace(/<\/div>$/, "");
            // Create the mail object with the html string and mail list
            const mailObject = {
              toMailIds: toMailList,
              messageSubject: "Job",
              htmlPage: finalMailHtml,
            };
            // Call the sendEmail function to send the mail
            const success = await sendEmail(mailObject);
            if (success?.status === 200) {
              return data;
            } else {
              throw new Error(`Email Error: ${JSON.stringify(data)}`);
            }
          } catch (error) {
            console.error("Error sending mail:", error);
            throw error; // Rethrow the error to be caught in the outer catch block
          }
        }),
      );
      if (emailNotifications.length > 0) return true;
    } catch (e) {
      console.error("Error in sending  mails :", e);
      return false;
    }
  };
  /**
     * Function to create the HTML string for the email notifications
     * @param {object} data - Job data
     * @param {string} forwardLink - The link to be forwarded to the reviewer
     * @returns {string} - The HTML string for the email notification
     */
    export function createHtmlString (data, forwardLink)  {
      const updatedData = { ...data, forwardLink: forwardLink };
      // Render the EmailActivityReview component to a string using ReactDomServer
      const htmlData = ReactDOMServer.renderToString(
        <EmailJobReview data={updatedData} />,
      );
      return htmlData;
    };

    export function delay(interval){
       // delay for 10 seconds
      return new Promise((resolve) => setTimeout(resolve, interval));

    }