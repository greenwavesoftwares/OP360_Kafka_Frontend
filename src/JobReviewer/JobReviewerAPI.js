import axios from "axios";
import { decryptTokenId } from "../helper/AuthService";
import { EventSourcePolyfill } from "event-source-polyfill";

const REACT_APP_TENANTID = process.env.REACT_APP_TENANTID; //key of session storage stored in env
const REACT_APP_USERID = process.env.REACT_APP_USERID; //key of session storage stored in env

const REACT_APP_JOBAPI = process.env.REACT_APP_JOBAPI; //key of local storage stored in env

/**
 *
 * @returns jobs to review
 */
export  function fetchJobsToReviewSSE(startDate,endDate,onMessage,{ onError, onOpen } = {}) {
  // try {
    //fetch tenant and user from session storage and then decrypt it
    const tenant = localStorage.getItem(REACT_APP_TENANTID);
    const user = localStorage.getItem(REACT_APP_USERID);
    const tenantId = decryptTokenId(tenant);
    const reviewer = decryptTokenId(user);
     const token=localStorage.getItem("token")
    // const response = await axios.get(
    const url=`${REACT_APP_JOBAPI}/jobs/jobreview/${reviewer}/${tenantId}/${startDate}/${endDate}`
  //     {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );

  //   return response;
  // } catch (error) {
  //   console.log("Error in fetchJobsToReview:", error);
  // }

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
    
      eventSource.addEventListener("jobsToReview", (event) => {
        const data = JSON.parse(event.data);
        onMessage?.(data);
      });
    
      eventSource.onerror = (err) => {
        onError?.(err);
        console.log("Error in sse event:",err)
        eventSource.close();
      };
    
      return eventSource
}

export const fetchJobsToReview = async (startDate, endDate) => {
  try {
    const tenant = localStorage.getItem(REACT_APP_TENANTID);
    const user = localStorage.getItem(REACT_APP_USERID);
    const tenantId = decryptTokenId(tenant);
    const reviewer = decryptTokenId(user);
    const token = localStorage.getItem("token");

    const { data } = await axios.get(
      `${REACT_APP_JOBAPI}/jobs/jobreview/${reviewer}/${tenantId}/${startDate}/${endDate}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return data;
  } catch (err) {
    console.error("fetchJobsToReview:", err);
    throw err;
  }
};

export  function getPendingApprovalsForSelfJobSSE(onMessage,{ onError, onOpen } = {}) {
  // try {
    //fetch tenant and user from session storage and then decrypt it
    const tenant = localStorage.getItem(REACT_APP_TENANTID);
    const user = localStorage.getItem(REACT_APP_USERID);
    const tenantId = decryptTokenId(tenant);
    const userid = decryptTokenId(user);
     const token=localStorage.getItem("token")
    // const response = await axios.get(
    const url=`${REACT_APP_JOBAPI}/selfJob/pendingApprovalsSSE/${userid}/${tenantId}`
  //     {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );

  //   return response;
  // } catch (error) {
  //   console.log("Error in fetchJobsToReview:", error);
  // }

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
        onError?.(err);
        console.log("Error in sse event:",err)
        eventSource.close();
      };
    
      return eventSource
}
export const getPendingApprovalsForSelfJob = async () => {
  try {
    const tenant = localStorage.getItem(REACT_APP_TENANTID);
    const user = localStorage.getItem(REACT_APP_USERID);
    const tenantId = decryptTokenId(tenant);
    const userid = decryptTokenId(user);
    const token = localStorage.getItem("token");

    const { data } = await axios.get(
      `${REACT_APP_JOBAPI}/selfJob/pendingApprovalsSSE/${userid}/${tenantId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return data;
  } catch (err) {
    console.error("getPendingApprovalsForSelfJob:", err);
    throw err;
  }
};
/**
 * Fetch jobs which are approved based on approver
 */
export async function fetchApprovedJobsCount() {
  try {
    //fetch tenant and user from session storage and then decrypt it

    const tenant = localStorage.getItem(REACT_APP_TENANTID);
    const user = localStorage.getItem(REACT_APP_USERID);
    const tenantid = decryptTokenId(tenant);
    const reviewer = decryptTokenId(user);

    const responseApprovedCount = await axios.get(
      `${REACT_APP_JOBAPI}/jobperform/getCompletedJobCount/${tenantid}/${reviewer}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,

          "Content-Type": "application/json",
        },
      }
    );
    return responseApprovedCount;
  } catch (error) {
    console.log("Error in fetchApprovedJobsCount", error);
  }
}

export async function updateSequentialStatus(
  jobid,
  activityid,
  sequence
) {
  try {
    //fetch tenant and user from session storage and then decrypt it

    const tenant = localStorage.getItem(REACT_APP_TENANTID);
    const tenantid = decryptTokenId(tenant);

    const response = await axios.put(
      `${REACT_APP_JOBAPI}/jobs/updateSequentialStatus/${jobid}/${activityid}/${sequence}/${tenantid}`,{},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,

          "Content-Type": "application/json",
        },
      }
    );
    console.log("Job successfully updated")
    return response;
  } catch (error) {
    console.log("Error in updateSequentialStatus", error);
  }
}

export async function fetchJobDetails(
  jobid
) {
  try {
    //fetch tenant and user from session storage and then decrypt it

    const tenant = localStorage.getItem(REACT_APP_TENANTID);
    const tenantid = decryptTokenId(tenant);

    const response = await axios.get(
      `${REACT_APP_JOBAPI}/jobs/${jobid}/${tenantid}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,

          "Content-Type": "application/json",
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.log("Error in fetchJobDetails", error);
  }
}
