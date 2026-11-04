// Import the axios library for making HTTP requests
import axios from "axios";

// Import the decryptTokenId function from the AuthService helper module
import { EventSourcePolyfill } from "event-source-polyfill";
import { decryptTokenId } from "../helper/AuthService";

// Define environment variables for tenant ID, user ID, task API, job API, and user module
const REACT_APP_TENANTID = process.env.REACT_APP_TENANTID; // Tenant ID environment variable
const REACT_APP_USERID = process.env.REACT_APP_USERID; // User ID environment variable
const REACT_APP_JOBAPI = process.env.REACT_APP_JOBAPI; // Job API environment variable

// Export an async function to get the last 10 job details for a given user list
// export async function getLast10JobDetails(userlist) {
//   try {
//     // Get the tenant ID from session storage
//     const tenant = localStorage.getItem(REACT_APP_TENANTID);

//     // Decrypt the tenant ID using the decryptTokenId function
//     const tenantid = decryptTokenId(tenant);

//     // Make a GET request to the job API to retrieve the last 10 job details
//     const response = await axios.get(
//       `${REACT_APP_JOBAPI}/jobperform/lasttenjobs/${tenantid}/${userlist}`,
//       {
//         // Set the headers for the request
//         headers: {
//           "Content-Type": "application/json", // Set the content type to JSON
//           Authorization: `Bearer ${localStorage.getItem("token")}`, // Set the authorization token
//         },
//       }
//     );

//     // Return the response data
//     return response.data;
//   } catch (error) {
//     // Log any errors that occur during the request
//     console.error("Error in getLast10JobDetails", error);
//   }
// }

// // Export an async function to get the performer stats for a given user list
// export async function getPerformerStats(userlist) {
//   try {
//     // Get the tenant ID from session storage
//     const tenant = localStorage.getItem(REACT_APP_TENANTID);

//     // Decrypt the tenant ID using the decryptTokenId function
//     const tenantid = decryptTokenId(tenant);

//     // Make a GET request to the job API to retrieve the performer stats
//     const response = await axios.get(
//       `${REACT_APP_JOBAPI}/jobperform/performerstats/${tenantid}/${userlist}`,
//       {
//         // Set the headers for the request
//         headers: {
//           "Content-Type": "application/json", // Set the content type to JSON
//           Authorization: `Bearer ${localStorage.getItem("token")}`, // Set the authorization token
//         },
//       }
//     );

//     // Return the response data
//     return response.data;
//   } catch (error) {
//     // Log any errors that occur during the request
//     console.error("Error in getPerformerStats", error);
//   }
// }

// Export an async function to fetch historical activities for a given user and the groups associated with the user
export async function fetchHistoricalActivities(
  performergrouplist,
  fromDate,
  toDate
) {
  
  try {
    console.log("Performer group list::",performergrouplist)
    // Get the tenant ID from session storage
    const tenant = localStorage.getItem(REACT_APP_TENANTID);

    // Get the user ID from session storage
    const user = localStorage.getItem(REACT_APP_USERID);

    // Decrypt the tenant ID and user ID using the decryptTokenId function
    const tenantid = decryptTokenId(tenant);
    const performer = decryptTokenId(user);

    // Make a GET request to the job API to retrieve the jobs
    const response = await axios.get(
      `${REACT_APP_JOBAPI}/jobperform/historicaldata/${tenantid}/${performergrouplist}/${fromDate}/${toDate}`,
      {
        // Set the headers for the request
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Set the authorization token
          "Content-Type": "application/json", // Set the content type to JSON
        },
      }
    );

    // Return the response
    return response.data;
  } catch (error) {
    // Log any errors that occur during the request
    console.error("Error in fetchJobs:", error);
  }
}
export const getAllJobsDataBasedOnPerformerAndTimeRangeSSE = (
  tenantid,
  userlist,
  startdate,
  enddate,
  onMessage,
  { onError, onOpen } = {}
) => {
  const token = localStorage.getItem("token");

  const url = `${REACT_APP_JOBAPI}/jobperform/sse/${tenantid}/${userlist}/${startdate}/${enddate}/allJobs`;

  const eventSource = new EventSourcePolyfill(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "text/event-stream", // 🔥 REQUIRED
    },
    heartbeatTimeout: 120000,
  });

  eventSource.onopen = () => {
    onOpen?.();
  };

  eventSource.addEventListener("allJobs", (event) => {
    const data = JSON.parse(event.data);
    onMessage?.(data);
  });

  eventSource.onerror = (err) => {
    
    console.log("Inside onError")
    onError?.(err);
    eventSource.close();
  };

  return eventSource
};
export const fetchJobsSSE = (
  tenantid,
  userlist,
  tabValue,
  startdate,
  enddate,
  onMessage,
  { onError, onOpen } = {}
) => {
  const token = localStorage.getItem("token");

  const url =
    `${REACT_APP_JOBAPI}/jobperform/sse/` +
    `${tenantid}/${userlist}/${tabValue}/${startdate}/${enddate}`;

  const eventSource = new EventSourcePolyfill(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "text/event-stream", // 🔥 REQUIRED
    },
    heartbeatTimeout: 120000,
  });

  eventSource.onopen = () => {
    onOpen?.();
  };

  eventSource.addEventListener("jobs", (event) => {
    const data = JSON.parse(event.data);
    onMessage?.(data);
  });

  eventSource.onerror = (err) => {
    onError?.(err);
    eventSource.close();
  };

  return eventSource
};
export const getAllJobsDataBasedOnPerformerAndTimeRange = async (
  tenantid,
  userlist,
  startdate,
  enddate
) => {
  try {
    const token = localStorage.getItem("token");

    const { data } = await axios.get(
      `${REACT_APP_JOBAPI}/jobperform/${tenantid}/${userlist}/${startdate}/${enddate}/allJobs`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return data;
  } catch (err) {
    console.error("getAllJobsDataBasedOnPerformerAndTimeRange:", err);
    throw err;
  }
};

export const fetchJobs = async (
  tenantid,
  userlist,
  tabValue,
  startdate,
  enddate
) => {
  try {
    const token = localStorage.getItem("token");

    const { data } = await axios.get(
      `${REACT_APP_JOBAPI}/jobperform/${tenantid}/${userlist}/${tabValue}/${startdate}/${enddate}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return data;
  } catch (err) {
    console.error("fetchJobs:", err);
    throw err;
  }
};
// Export an async function to update a job and activity
export async function updateJobAndActivity(job) {
  try {
    // Get the tenant ID from session storage
    const tenant = localStorage.getItem(REACT_APP_TENANTID);

    // Get the user ID from session storage
    const user = localStorage.getItem(REACT_APP_USERID);

    // Decrypt the tenant ID and user ID using the decryptTokenId function
    const tenantid = decryptTokenId(tenant);
    const performer = decryptTokenId(user);

    console.log("Job to be posted : ", job);
    console.log(
      "Job API URL : ",
      `${REACT_APP_JOBAPI}/jobs/addUpdateJobDetails/${tenantid}`
    );

    // Make a PUT request to the job API to update the job and activity
    const response = await axios.put(
      `${REACT_APP_JOBAPI}/jobs/addUpdateJobDetails/${tenantid}`,
      job,
      {
        // Set the headers for the request
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Set the authorization token
        },
      }
    );

    // Return the response
    return response;
  } catch (error) {
    // Log any errors that occur during the request
    console.error("Error in updateJobandActivity:", error);
  }
}

// Export an async function to update the activity status
export async function updateActivityStatus(activity, tenantId) {
  try {
    // Make a PUT request to the job API to update the activity status
    const response = await axios.put(
      `${REACT_APP_JOBAPI}/jobperform/updateactivitystatus/${tenantId}`,
      activity,
      {
        // Set the headers for the request
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Set the authorization token
        },
      }
    );

    // Return the response
    return response;
  } catch (error) {
    // Log any errors that occur during the request
    console.error("Error in updateActivityStatus:", error);
  }
}

// Export an async function to get job details based on the job ID
export async function getJobDetailsBasedOnJobId(jobid, tenantid) {
  try {
    // Make a GET request to the job API to retrieve the job details
    const response = await axios.get(
      `${REACT_APP_JOBAPI}/jobperform/getJobDetailsBasedOnJobId/${jobid}/${tenantid}`,
      {
        // Set the headers for the request
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Set the authorization token
          "Content-Type": "application/json", // Set the content type to JSON
        },
      }
    );

    // Return the response data
    return response.data;
  } catch (error) {
    // Log any errors that occur during the request
    console.log(error);
  }
}

// Export an async function to update enforced activities details
export async function updateEnforcedActivitiesDetails() {
  // Get the tenant ID from session storage
  const tenant = localStorage.getItem(REACT_APP_TENANTID);

  // Decrypt the tenant ID using the decryptTokenId function
  const tenantid = decryptTokenId(tenant);

  try {
    // Make a PUT request to the job API to update the enforced activities details
    const response = await axios.put(
      `${REACT_APP_JOBAPI}/jobperform/updateEnforcedActivitiesDetails/${tenantid}`,
      {}, // Request body is empty if there's no data to send
      {
        // Set the headers for the request
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Set the authorization token
        },
      }
    );

    // Return the response
    return response;
  } catch (error) {
    // Log any errors that occur during the request
    console.error("Error in updateEnforcedActivitiesDetails:", error);
    throw error; // Optionally rethrow the error if you want to handle it further up the call stack
  }
}
export async function sendMailForNextActivities(jobid) {
  // Get the tenant ID from session storage
  const tenant = localStorage.getItem(REACT_APP_TENANTID);

  // Decrypt the tenant ID using the decryptTokenId function
  const tenantid = decryptTokenId(tenant);
  const token = localStorage.getItem("token");
  const requestbody = { tenantid, token, jobid };
  console.log("rEQUEST BODY:" + requestbody);
  try {
    const response = axios.post(
      `${REACT_APP_JOBAPI}/jobperform/sendMailForNextActivities`,
      requestbody, // Request body is empty if there's no data to send
      {
        // Set the headers for the request
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Set the authorization token
        },
      }
    );

    // Return the response
    return response;
  } catch (e) {
    console.error("Error in sendMailForNextActivities");
    throw e;
  }
}
export async function uploadFile(file, jobid, activityid) {
  // Get the tenant ID from session storage
  const tenant = localStorage.getItem(REACT_APP_TENANTID);

  // Decrypt the tenant ID using the decryptTokenId function
  const tenantid = decryptTokenId(tenant);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("jobid", jobid);
  formData.append("activityid", activityid);
  formData.append("tenantid", tenantid);
  try { 
    return axios.post(`${REACT_APP_JOBAPI}/jobperform/uploadFile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Set the authorization token
      },
    });
  } catch (e) {
    console.error("Error in uploadFile");
    throw e;
  }
}
export async function uploadFileToMinIO(file) {
  const tenant = localStorage.getItem(REACT_APP_TENANTID);
  const tenantid = decryptTokenId(tenant);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("tenantid", tenantid);

  try {
    const response = await axios.post(
      `${REACT_APP_JOBAPI}/jobperform/uploadFiletoMinIO`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // Backend returns { key: "uuid_filename.ext" }
    const key = response?.data?.key;

    if (!key) {
      throw new Error("Upload succeeded but no key returned from server");
    }

    return key;
  } catch (e) {
    console.error("Error in uploadFileToMinIO:", e);
    throw e;
  }
}

export async function downloadFileFromMinIO(key) {
  // Get the tenant ID from session storage
  const tenant = localStorage.getItem(REACT_APP_TENANTID);

  // Decrypt the tenant ID using the decryptTokenId function
  const tenantid = decryptTokenId(tenant);
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `${REACT_APP_JOBAPI}/jobperform/download`,
      {
        params: {
          miniokey: key,
          tenant: tenantid,
        },
        responseType: "blob", // ✅ REQUIRED for file download
        headers: {
          Authorization: `Bearer ${token}`, // ✅ proper auth
        },
      }
    );

    // Return the response
    return response;
  } catch (e) {
    console.error("Error in downLoadFile");
    throw e;
  }
}

export async function deleteFileFromMinIO(minioKey) {
  const tenant = localStorage.getItem(REACT_APP_TENANTID);
  const tenantid = decryptTokenId(tenant);

  try {
    const response = await axios.post(
      `${REACT_APP_JOBAPI}/jobperform/deleteFileFromMinIO`,
      null,
      {
        params: {
          minioKey: minioKey,
          tenantid: tenantid,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return response.data;
  } catch (e) {
    console.error("Error in deleteFileFromMinIO:", e);
    throw e;
  }
}
