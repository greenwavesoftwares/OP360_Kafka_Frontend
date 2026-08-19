import axios from "axios";
import { decryptTokenId } from "../helper/AuthService";
import { getCurrentUser } from "../UserModuleUpdated/helper";

// const username = "user123";
// const password = "pass123";
// const encoded = btoa(username + ":" + password);

/**
 * This function returns the tenant ID from the session storage
 * The tenant ID is first fetched from the environment variable REACT_APP_TENANTID
 * and then decrypted using the decryptTokenId function from AuthService
 * The decrypted tenant ID is then returned
 * @returns {string} The decrypted tenant ID
 */
const getTenantID = () => {
  const env_tenant = process.env.REACT_APP_TENANTID;
  // console.log('Tenant Varaible from env : ',env_tenant)
  const encryptedTenant = localStorage.getItem(env_tenant);
  const tenant = decryptTokenId(encryptedTenant);
  // console.log('Current Tenant ID : ',tenant)
  return tenant;
};

// const tenantId=getTenantID();

const JOB_API = process.env.REACT_APP_JOBAPI; //* getting the port from where the endpoints of API will be processed
const MAIL_API = process.env.REACT_APP_MAILAPI;

/**
 * This function makes a GET request to the job assign API to retrieve the list of group IDs
 * The tenant ID is fetched from the environment variable REACT_APP_TENANTID and decrypted using the decryptTokenId function from AuthService
 * The decrypted tenant ID is then used as a parameter in the GET request
 * The response data is then returned
 * @returns {Array} The list of group IDs
 */
export const getAllGroupId = async () => {
  try {
    const tenantId = getTenantID();
    const response = await axios.get(`${JOB_API}/jobassign/tags/${tenantId}`, {
      headers: {
        ////Authorization: "Basic " + encoded,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.data) {
      // console.log("Current response for Group ID : ",response.data)
      return response.data;
    }
  } catch (error) {
    // console.error("Error fetching  GroupID List :", error);
    // return null;
  }
};


export const getPerformerAvailability = async (start, stop,activityId,taskId) => {
  try {
    const tenantId = getTenantID();

    console.log('Start : ',start
    )
    console.log('Stop : ',stop
    )
    // console.log('getPerformerAvailability()')
    console.log('Current Performer URL : ',`${JOB_API}/jobassign/performer/availability/${tenantId}?start=${start}&stop=${stop}&activityId=${activityId}&taskId=${taskId}`)
    const response = await fetch(
      `${JOB_API}/jobassign/performer/availability/${tenantId}?start=${start}&stop=${stop}&activityId=${activityId}&taskId=${taskId}`,
      {
        method: "GET",
        headers: {
          ////Authorization: "Basic " + encoded,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    // console.log('Response : ',response)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (response.ok) {
      // console.log("Current response for Performer Availability : ", data);
      return data;
    }
  } catch (error) {
    // console.error("Error fetching Performer Availability List", error);
    // return null;
  }
};

/**
 * This function retrieves the availability of an asset within a specified time frame.
 * It makes a GET request to the job assign API to check the availability of the asset.
 * The availability is checked based on the start and stop times along with the asset ID.
 * If the response is successful, the data containing the asset availability is returned.
 * If there is an HTTP error during the request, an error is thrown.
 * If there is an error fetching the asset availability, it is logged and null is returned.
 */
export const getAssetAvailability = async (start, stop, activityId,taskId) => {
  try {
    // console.log('getPerformerAvailability()')
const tenantId = getTenantID();
    console.log('Current Asset URL : ',`${JOB_API}/jobassign/asset/availability/${tenantId}?start=${start}&stop=${stop}&activityId=${activityId}&taskId=${taskId}`)
    
    const response = await fetch(
      `${JOB_API}/jobassign/asset/availability/${tenantId}?start=${start}&stop=${stop}&activityId=${activityId}&taskId=${taskId}`,
      {
        method: "GET",
        headers: {
          ////Authorization: "Basic " + encoded,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    // console.log('Response : ',response)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (response.ok) {
      // console.log("Current response for Performer Availability : ", data);
      return data;
    }
  } catch (error) {
    // console.error("Error fetching Performer Availability List", error);
    // return null;
  }
};

/**
 * This function retrieves the list of events for a given user ID.
 * It makes a GET request to the job assign API with the user ID as a parameter.
 * The response data is then returned.
 * @param {string} userId The ID of the user to retrieve events for
 * @returns {Object} The list of events for the user
 */
export const getAllCalendarAssignedEvents = async (userId) => {
  try {
    const tenantId = getTenantID();
    const response = await axios.get(
      `${JOB_API}/jobassign/events/${tenantId}?userId=${userId}`,
      {
        headers: {
          //Authorization: "Basic " + encoded,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.data) {
      // console.log("Current response for Calendar Events  : ",response.data)
      return response.data;
    }
  } catch (error) {
    // console.error("Error fetching Calendar Events:", error);
    // return null;
  }
};

/**
 * Retrieves the job details for the given start, stop, jobname, and jobId.
 * It makes a GET request to the job assign API with the given parameters.
 * The response data is then returned.
 * @param {string} start The start time for the event
 * @param {string} stop The stop time for the event
 * @param {string} jobname The name of the job
 * @param {string} jobId The ID of the job
 * @returns {Object} The job details for the given event
 */
export const getOnEventClickJob = async (jobname, jobId) => {
  //taskname will later be converted to jobname
  try {
    // console.log('getOnEventClickJob() called ')
    const tenantId = getTenantID();
    const response = await axios.get(
      `${JOB_API}/jobassign/jobdetails/${tenantId}`,
      {
        headers: {
          //Authorization: "Basic " + encoded,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {  jobname: jobname, jobId: jobId },
      }
    );
    if (response.data) {
      console.log("Current response for Calendar Click Job  : ",response.data)
      return response.data;
    }
  } catch (error) {
    // console.error("Error fetching Calendar JobDetails:", error);
    return null;
  }
};

/**
 * Deletes the job details for the given job.
 * It makes a DELETE request to the job assign API with the given job details.
 * If the response is successful, it returns true. Otherwise, it returns false.
 * @param {Object} job - The job details to delete
 * @returns {boolean} True if the job details are deleted successfully, False otherwise
 */
export const deleteJobDetails = async (job) => {
  // console.log("Job Details to Detete: ",job)
  try {
    const tenantId = getTenantID();
    const response = await axios.delete(
      `${JOB_API}/jobassign/deletejobs/${tenantId}`,

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: job,
      }
    );
    // console.log('Current Response for delete : ',response)
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    // console.error("Error occurred while deleting job details:", error);
    return false;
  }
};

/**
 * Retrieves all job details for a given tenant.
 * It makes a GET request to the job API with the tenant ID as a parameter.
 * The response data is then returned.
 * @returns {Object} The list of all job details for the given tenant
 */
export const geAllJobsByTenant = async () => {
  //taskname will later be converted to jobname
  try {
    // console.log('getOnEventClickJob() called ')
    const tenantId = getTenantID();
    const response = await axios.get(`${JOB_API}/jobs/allJobs/${tenantId}`, {
      headers: {
        //Authorization: "Basic " + encoded,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      // params: { start: start, stop: stop,jobname:jobname }
    });
    
    if (response.data) {
      // console.log("Current response for All Jobs  : ",response)
      return response.data;
    }
  } catch (error) {
    // console.error("Error fetching All JobDetails:", error);
    
    throw error
  }
};

/**
 * Sends email notifications using the provided mail properties.
 * It makes a POST request to the mail API with the given mail properties.
 * If the response is successful, it returns the response object. Otherwise, it returns null.
 * @param {Object} mailProperties The properties of the mail to be sent
 * @returns {Object} The response object if the email is sent successfully, null otherwise
 */
export const sendEmail = async (mailProperties) => {
  // console.log("sendEmail: ",mailProperties)
  try {
    const tenantId = getTenantID();
    // console.log(" Stringified Mail  : ",JSON.stringify(mailProperties))
    const response = await axios.post(
      `${MAIL_API}/mail/notifications`,
      mailProperties,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      return response;
    } else {
      return null;
    }
  } catch (error) {
    // console.error("Error occurred while sending mail : ", error);
    return false;
  }
};



export const getJobsByDateAndUser = async (user,date) => {
  try {
    const tenantId = getTenantID();

    
    const response = await fetch(
      `${JOB_API}/jobs/user/${tenantId}?user=${getCurrentUser()}&date=${date}`,
      {
        method: "GET",
        headers: {
          ////Authorization: "Basic " + encoded,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    // console.log('Response : ',response)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (response.ok) {
      // console.log("Current response for Performer Availability : ", data);
      return data;
    }
  } catch (error) {
    // console.error("Error fetching Performer Availability List", error);
    // return null;
  }
};




export const geAllAdhocJobsByTenant = async () => {
  //taskname will later be converted to jobname
  try {
    // console.log('getOnEventClickJob() called ')
    const tenantId = getTenantID();
    const response = await axios.get(`${JOB_API}/adhoc/allJobs/${tenantId}`, {
      headers: {
        //Authorization: "Basic " + encoded,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      // params: { start: start, stop: stop,jobname:jobname }
    });
    
    if (response.data) {
      // console.log("Current response for All Jobs  : ",response)
      return response.data;
    }
  } catch (error) {
    // console.error("Error fetching All JobDetails:", error);
    return null;
  }
};


export const geAllAdhocJobsByAssignerAndTenant = async (assigner) => {
  //taskname will later be converted to jobname
  try {
    // console.log('getOnEventClickJob() called ')
    const tenantId = getTenantID();
    const response = await axios.get(`${JOB_API}/adhoc/allJobs/${assigner}/${tenantId}`, {
      headers: {
        //Authorization: "Basic " + encoded,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      // params: { start: start, stop: stop,jobname:jobname }
    });
    
    if (response.data) {
      // console.log("Current response for All Jobs  : ",response)
      return response.data;
    }
  } catch (error) {
    // console.error("Error fetching All JobDetails:", error);
    return null;
  }
};



export const getCalendarData = async (month,year) => {
  try {
    // const encodedDateRange = encodeURIComponent(
    //   JSON.stringify(calendarData)
    // );

    const tenantId = getTenantID();

    const response = await axios.get(
      `${JOB_API}/jobs/calendar/${tenantId}`,
      {
        params: {
          user: getCurrentUser(),
          month: month,
          year: year,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    return null;
  }
};




