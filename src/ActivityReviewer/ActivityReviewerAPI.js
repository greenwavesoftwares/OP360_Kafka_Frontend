import axios from "axios";
import { decryptTokenId } from "../helper/AuthService";
import { EventSourcePolyfill } from "event-source-polyfill";

//Env variable to store keys for data stored in local storage and session storage
const REACT_APP_TENANTID = process.env.REACT_APP_TENANTID;
const REACT_APP_JOBAPI = process.env.REACT_APP_JOBAPI;

/**
 *
 * @param {*} reviewer
 * @returns activities to review
 */
export function getActivitiesToReviewSSE(reviewer,startdate,enddate,onMessage,{ onError, onOpen } = {}) {
  // try {
    //Fetch tenant from session storage and  decrypt it
    const tenant = localStorage.getItem(REACT_APP_TENANTID);
    const tenantId = decryptTokenId(tenant);
    const token=localStorage.getItem("token")
  console.log("Start date sse: ",startdate)
  //   const response = await axios.get(
  //     `${REACT_APP_JOBAPI}/jobs/activityreview/${reviewer}/${tenantId}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,

  //         "Content-Type": "application/json",
  //       },
  //     }
  //   ); //Fetch data from api call
  //   return response; //return the response
  // } catch (error) {
  //   console.log("Error in getActivitiesToReview:", error); //Log the error
  // }

  const url = `${REACT_APP_JOBAPI}/jobs/activityreview/${reviewer}/${tenantId}/${startdate}/${enddate}`;
  
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
  
    eventSource.addEventListener("activitiesToReview", (event) => {
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
export const getActivitiesToReview = async (reviewer, startdate, enddate) => {
  try {
    const tenant = localStorage.getItem(REACT_APP_TENANTID);
    const tenantId = decryptTokenId(tenant);
    const token = localStorage.getItem("token");

    const { data } = await axios.get(
      `${REACT_APP_JOBAPI}/jobs/activityreview/${reviewer}/${tenantId}/${startdate}/${enddate}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return data;
  } catch (err) {
    console.error("getActivitiesToReview:", err);
    throw err;
  }
};
//function to update job status when all activities in the the job are approved
export async function updateJobStatus(jobid) {
  try {
    const requestBody = { jobID: jobid, actualJobEndTime: new Date() };
    const tenant = localStorage.getItem(REACT_APP_TENANTID);
    const tenantId = decryptTokenId(tenant); //Fetch tenant from session storage and then decrypt it
    const response = await axios.put(
      `${REACT_APP_JOBAPI}/jobperform/updatejobstatus/${jobid}/${tenantId}`,
      requestBody, // Empty body if not needed
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Correct header setup
          "Content-Type": "application/json",
        },
      }
    );
    return response; //Return the response
  } catch (error) {
    console.error("Error in updateJobStatus()", error); //log the error
  }
}
