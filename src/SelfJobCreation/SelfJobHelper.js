import dayjs from "dayjs";
import { getCurrentUser } from "../UserModuleUpdated/helper";
import { getAllGroup } from "../Logbook Asset/LogbookAssetApi";
import { getAllGroupDetails } from "../UserModuleUpdated/UsermoduleApi";


/**
 * Sets the local variables for a given self job.
 * This function takes in the relevant parameters and sets them in localStorage using the
 * corresponding environment variables.
 * @param {string} jobId - The job ID
 * @param {string} activityId - The activity ID
 * @param {string} jobName - The job name
 * @param {string} reviewer - The reviewer ID
 * @param {string} performer - The performer ID
 * @param {string} status - The status of the job
 * @param {string} remarks - The remarks for the job
 * @param {string} formName - The name of the form
 * @param {string} formVersion - The version of the form
 * @param {string} jobstarttime - The actual job start time
 * @param {string} jobendtime - The actual job end time
 * @param {string} reviewerstarttime - The reviewer start time
 * @param {string} tenant - The tenant ID
 * @param {string} userName - The username
 * @param {string} userPhone - The user phone number
 * @param {string} userDept - The user department
 * @returns {Object} An object with the local variables set
 */
export function getLocalVariablesForSelfJob(
  jobId,
  activityId,
  jobName,
  reviewer,
  performer,
  status,
  remarks,
  formName,
  formVersion,
  jobstarttime,
  jobendtime,
  reviewerstarttime,
  tenant,
  userName,
  userPhone,
  userDept
) {
  const env_jobId_key = process.env.REACT_APP_JOBID;
  const env_activityId_key = process.env.REACT_APP_ACTIVITYID;
  const env_jobname_key = process.env.REACT_APP_JOBNAME;
  const env_approver_key = process.env.REACT_APP_APPROVER;
  const env_status_key = process.env.REACT_APP_JOBSTATUS;
  const env_remarks_key = process.env.REACT_APP_REMARKS;
  const env_formName_key = process.env.REACT_APP_FORMNAME;
  const env_formVersion_key = process.env.REACT_APP_VERSIONNUMBER;
  const env_performer_key = process.env.REACT_APP_CURRENTPERFORMER;
  const env_jobstart_time = process.env.REACT_APP_ACTUALACTIVITYSTARTTIME;
  const env_jobstop_time = process.env.REACT_APP_ACTUALACTIVITYENDTIME;
  const env_reviewer_starttime = process.env.REACT_APP_REVIEWERINTIMATIONTIME;
  const env_currentuser = process.env.REACT_APP_CURRENTPERFORMER;
  const env_tenantId = process.env.REACT_APP_TENANTID;
  const env_currentUserName = process.env.REACT_APP_USERNAME;
  const env_userPhone = process.env.REACT_APP_PHONE;
  const env_userDept= process.env.REACT_APP_USERDEPARTMENT;
  const env_userID= process.env.REACT_APP_USERID;

  // Return the object
  const finalObject = {
      [env_jobId_key]: jobId ?? '',
      [env_activityId_key]: activityId ?? '',
      [env_jobname_key]: jobName ?? '',
      [env_approver_key]: reviewer ?? '',
      [env_status_key]: status ?? '',
      [env_remarks_key]: remarks ?? '',
      [env_formName_key]: formName ?? '',
      [env_formVersion_key]: formVersion ?? '',
      
      [env_jobstart_time]: jobstarttime ?? '',
      [env_jobstop_time]: jobendtime ?? '',
      [env_reviewer_starttime]: reviewerstarttime ?? '',
      [env_currentuser]: reviewerstarttime ?? '',
      [env_reviewer_starttime]: reviewerstarttime ?? '',
      [env_reviewer_starttime]: reviewerstarttime ?? '',
      [env_reviewer_starttime]: reviewerstarttime ?? '',
      [env_tenantId]: tenant ?? '',
      [env_currentUserName]: userName ?? '',
      [env_userPhone]: userPhone ?? '',
      [env_userDept]: userDept ?? '',
      [env_userID]: getCurrentUser() ?? '',
      [env_performer_key]: performer ?? '',
  };

  console.log('Final Object : ',finalObject);
  return finalObject;
}

//Not used
export function setLocalVariablesForSelfJob()
{

}






/**
 * Creates an object for auto-created jobs based on the parameters provided.
 * The 'activityid', 'assetid', and 'assetname' parameters are optional and default to null if not provided.
 * The 'jobname' parameter is used as-is without any prefix.
 * The object has the following keys: jobid, activityid, jobname, assetid, assetname, logbookid, formname, logbookversion, performer, reviewer, and status.
 * @param {string} jobid - ID of the job
 * @param {string} [activityid] - ID of the activity
 * @param {string} jobname - Name of the job
 * @param {string} [assetid] - ID of the asset
 * @param {string} [assetname] - Name of the asset
 * @param {string} logbookid - ID of the logbook
 * @param {string} formname - Name of the form
 * @param {string} logbookversion - Version number of the logbook
 * @param {string} performer - ID of the performer
 * @param {string} reviewer - ID of the reviewer
 * @param {string} status - Status of the job
 * @returns {Object} Object with the above keys
 */
export function createAutoJob(
    jobid,
    activityid,
    jobname,
    assetid,
    assetname,
    logbookid,
    formname,
    logbookversion,
    performer,
    reviewer,
    status
  ) {
    return {
      jobid: jobid,
      activityid: activityid !== undefined ? activityid : null,
      // jobname: "Auto job created by " + jobname,
      jobname: jobname,
      assetid: assetid !== undefined ? assetid : null,
      assetname: assetname !== undefined ? assetname : null,
      logbookid: logbookid,
      formname: formname,
      logbookversion: logbookversion,
      performer: performer,
      reviewer: reviewer,
      //activitystarttime: activitystarttime,
      status: status,
    };
  }


export const fn_filterLogbookApprovers = async (formDetails, approverList) => {
  console.log("Form Details in fn_filterLogbookApprovers: ", formDetails);
   console.log("Approver List in fn_filterLogbookApprovers: ", approverList);
  const formGroupIds = formDetails.userGroup
    .split(",")
    // .map(g => g.toLowerCase().trim());

  // const allGroupDetails = await getAllGroupDetails();

  // const leadersOfFormGroups = allGroupDetails
  //   .filter(group =>
  //     formGroups.includes(group.groupID.toLowerCase().trim())
  //   )
    // .map(group => group.leader);

  return approverList.filter(approver =>{
    const approverGroupIds = approver.group.map(g => g.groupID);
    return approverGroupIds.some(groupId => formGroupIds.includes(groupId));
  }
  );

  

};

  export const reviewerStatus = ['sent for approval','rejected', 'approved','review started'];

  export const getTodaysFilteredSelfJobs = (allSelfJobs, formDetails) => {
    
  
    const logbookJobsForCurrentUser = allSelfJobs.filter(job => isTodayLogbookJob(job, formDetails));
  
    console.log("Logbook Jobs:", logbookJobsForCurrentUser);
    return logbookJobsForCurrentUser;
  };

  const isTodayLogbookJob = (job, formDetails) => {
    const currentDate = dayjs().format("YYYY-MM-DD"); // Get today's date in "YYYY-MM-DD" format

    return  job?.logbookid === formDetails?.formID &&
            // job.performer === getCurrentUser() &&
            dayjs(job.activitystarttime).format("YYYY-MM-DD") === currentDate;
  
  }


export  const updateJobsTable= (selfJobId,allSelfJobs) => { 
  return allSelfJobs.filter(job => job.jobid !== selfJobId);
    
  }


  export const defaultJobNamePrefix="SelfJob created with";

export const LOGBOOK_URL = "/workflow/LogbookForm"; // Redirect URL for logbook form
export const JOBREVIEWER_PAGEID = "job reviewer"; // Page Id for job reviewer page
export const GUEST_LOGBOOK_URL = "/guest/LogbookForm"; // Redirect URL for guest logbook form






  