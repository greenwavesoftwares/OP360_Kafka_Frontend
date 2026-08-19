import axios from "axios";
import { decryptTokenId } from "../helper/AuthService";
import { getCurrentUser } from "../UserModuleUpdated/helper";

// const username = "user123";
// const password = "pass123";
// const encoded = btoa(username + ":" + password);

/**
 * Retrieves the tenant ID from session storage.
 * The tenant ID is first fetched as an encrypted string using the environment variable REACT_APP_TENANTID.
 * It is then decrypted using the decryptTokenId function before being returned.
 * Logs the environment tenant variable and the decrypted tenant ID for debugging purposes.
 * @returns {string} The decrypted tenant ID.
 */
const getTenantID = () => {
  const env_tenant = process.env.REACT_APP_TENANTID;
  // console.log('Tenant Varaible from env : ',env_tenant)
  const encryptedTenant = localStorage.getItem(env_tenant);
  const tenant = decryptTokenId(encryptedTenant);
  console.log('getTenantID : ',tenant)
  return tenant;
};

/*JOB API SERVER API */
const JOB_API = process.env.REACT_APP_JOBAPI;

// const tenantId=getTenantID();

/**
 * Fetches the logbooks associated with the given asset ID.
 * The API URL is constructed using the JOB_API environment variable and the asset ID.
 * The tenant ID is fetched using the getTenantID function.
 * The API request is made using Axios and the data is returned as a promise.
 * If there is an error, it is logged and the function returns null.
 * @param {string} assetId - The ID of the asset to fetch logbooks for
 * @returns {Promise<Object[]>} A promise containing an array of logbook objects
 */
 const getAssetLogbooks = async (assetId) => {
  try {
    const tenantId = getTenantID();
    // console.log('Current URL for scanStr Asset : ',`${JOB_API}/selfJob/assetlogbooks/${assetId}/${tenantId}`)
    const response = await axios.get(
      `${JOB_API}/selfJob/assetlogbooks/${assetId}/${tenantId}`,
      {
        headers: {
          //Authorization: "Basic " + encoded,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.data) {
      // console.log("Current response for AssetId: ",response.data)
      return response.data;
    }
  } catch (error) {
    // console.error("Error fetching Asset Details :", error);
    // return null;
  }
};

/**
 * Fetches the pending job details for the given asset ID.
 * Constructs the API URL using the JOB_API environment variable, asset ID, and tenant ID.
 * Makes a GET request to the API endpoint and returns the response data containing pending job details.
 * If an error occurs during the request, it logs the error message.
 *
 * @param {string} assetId - The ID of the asset to fetch pending job details for.
 * @returns {Promise<Object>} A promise containing the response data with pending job details.
 */
export const getpendingJobDetails = async (assetId) => {
  try {
    const tenantId = getTenantID();
    const response = await axios.get(
      `${JOB_API}/selfJob/pendingJobs/${assetId}/${tenantId}`,
      {
        headers: {
          //Authorization: "Basic " + encoded,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.data) {
      // console.log("Current response for pending Job: ",response.data)
      return response.data;
    }
  } catch (error) {
    // console.error("Error fetching pending Job Details :", error);
    // return null;
  }
};



/**
 * Updates the start and end times of a job in the database.
 * @param {Object} assetDetails - The asset details to be updated
 * @returns {Object} - Returns the updated job details
 */
export const updateJobTime = async (assetDetails) => {
  try {
    const tenantId = getTenantID();
    const response = await axios.put(
      `${JOB_API}/selfJob/updateJob/${tenantId}`,
      assetDetails,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.data) {
      // console.log("Current response for Update Job: ",response.data)
      return response.data;
    }
  } catch (error) {
    // console.error("Error updating job :", error);
    // return null;
  }
};

/**
 * Creates a new auto job in the database.
 * @param {Object} autojob - The auto job details to be created
 * @returns {Object} - Returns the newly created job details
 */
export const createNewAutoJob = async (autojob) => {
  try {
    const tenantId = getTenantID();
    const response = await axios.post(
      `${JOB_API}/selfJob/${tenantId}`,
      autojob,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.data) {
      // console.log("Job Posted Successfully : ",response.data)
      return response.data;
    }
  } catch (error) {
    // console.error("Error posting job :", error);
    // return null;
  }
};

/**
 * Fetches the pending job details for the given logbook.
 * The API URL is constructed using the JOB_API environment variable, the logbook name, ID, version, and the current user ID.
 * The tenant ID is fetched using the getTenantID function.
 * The API request is made using Axios and the data is returned as a promise.
 * If there is an error, it is logged and the function returns null.
 * @param {string} formname - The name of the logbook
 * @param {string} formid - The ID of the logbook
 * @param {string} version - The version number of the logbook
 * @returns {Promise<Object>} A promise containing the pending job details
 */
export const getPendingJobInfoforLogbook = async (
  formname,
  formid,
  version
) => {
  try {
    const tenantId = getTenantID();
    const user = getCurrentUser();

    // console.log('Current URL for pending Logbook : ',`${JOB_API}/selfJob/pendingJobs/${formname}/${formid}/${version}/${user}/${tenantId}`)

    const response = await axios.get(
      `${JOB_API}/selfJob/pendingJobs/${formname}/${formid}/${version}/${user}/${tenantId}`,
      {
        headers: {
          //Authorization: "Basic " + encoded,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.data) {
      // console.log("Current response for pending SelfJob Logbook: ",response.data)
      return response.data;
    }
  } catch (error) {
    // console.error("Error fetching pending SelfJob Logbook :", error);
    // return null;
  }
};

/**
 * Fetches the pending approvals for a given user ID.
 * The API URL is constructed using the JOB_API environment variable, the user ID, and the current tenant ID.
 * The tenant ID is fetched using the getTenantID function.
 * The API request is made using Axios and the data is returned as a promise.
 * If there is an error, it is logged and the function returns null.
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} A promise containing the pending approvals
 */
export const getPendingApprovalsForSelfJob = async (userId) => {
  try {
    const tenantId = getTenantID();
    // console.log('Current URL for getPendingApprovalsForSelfJob : ',`${JOB_API}/selfJob/pendingApprovals/${userId}/${tenantId}`)

    const response = await axios.get(
      `${JOB_API}/selfJob/pendingApprovals/${userId}/${tenantId}`,
      {
        headers: {
          //Authorization: "Basic " + encoded,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.data) {
      // console.log("Current response for getPendingApprovalsForSelfJob: ",response.data)
      return response.data;
    }
  } catch (error) {
    // console.error("Error fetching getPendingApprovalsForSelfJob :", error);
    // return null;
  }
};

/**
 * Updates the status of an auto job to reviewed.
 * The API URL is constructed using the JOB_API environment variable, the tenant ID, and the auto job ID.
 * The tenant ID is fetched using the getTenantID function.
 * The API request is made using Axios and the data is returned as a promise.
 * If there is an error, it is logged and the function returns null.
 * @param {Object} autojob - The auto job details to be updated
 * @returns {Promise<Object>} A promise containing the updated auto job details
 */
export const reviewForSelfAssignedJob = async (autojob) => {
  try {
    const tenantId = getTenantID();
    const response = await axios.put(
      `${JOB_API}/selfJob/review/${tenantId}`,
      autojob,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.data) {
      // console.log("Current response for Update AutoJob: ",response.data)
      return response.data;
    }
  } catch (error) {
    // console.error("Error updating AutoJob :", error);
    // return null;
  }
};


export const getAllSelfJobs = async () => {
  try {
    const tenantId = getTenantID();
    const response = await axios.get(
      `${JOB_API}/selfJob/${tenantId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.data) {
      // console.log("Current response for Update AutoJob: ",response.data)
      return response.data;
    }
  } catch (error) {
    // console.error("Error updating AutoJob :", error);
    // return null;
  }
};

export const getAllSelfJobsByUser = async (userID) => {
  try {
    const tenantId = getTenantID();
    const response = await axios.get(
      `${JOB_API}/selfJob/${userID}/${tenantId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.data) {
      // console.log("Current response for Update AutoJob: ",response.data)
      return response.data;
    }
  } catch (error) {
    // console.error("Error updating AutoJob :", error);
    // return null;
  }
};