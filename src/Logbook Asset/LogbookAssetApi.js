import axios from "axios"; // Import axios to make HTTP requests
import { decryptTokenId } from "../helper/AuthService"; // Import a function to decrypt token IDs

// This function gets the tenant ID.
const getTenantID = () => {
  // Getting the environment-specific tenant veriable name.
  const env_tenant = process.env.REACT_APP_TENANTID;
  // Retrieving the encrypted tenant ID from the session storage.
  const encryptedTenant = localStorage.getItem(env_tenant);
  // Decrypting the tenant ID.
  const tenant = decryptTokenId(encryptedTenant);
  // Returning the tenant ID.
  return tenant;
};

// These are URLs for different parts of the application, stored in environment variables
const asset = `${process.env.REACT_APP_ASSETAPI}`;
const userModule = `${process.env.REACT_APP_USERMODULE}`;
const task = `${process.env.REACT_APP_TASKAPI}`;

// Function to get the list of all asset groups for the current tenant.
export const getAssetGroupsList = async () => {
  try {
    const tenantId = getTenantID(); // Get the current tenant ID using the helper function.
    const response = await axios.get(`${asset}/api/assetgroups/${tenantId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Include authorization token for secure access.
      },
    });
    return response.data; // Return the list of asset groups.
  } catch (error) {
    console.error("Error fetching Asset Groups List with versions:", error); // Log the error if the request fails.
    return null; // Return null in case of an error.
  }
};

// Function to check if a specific asset group exists by its name.
export const CheckAssetGroupExists = async (groupName) => {
  try {
    const tenantId = getTenantID(); // Get the current tenant ID.
    const response = await axios.get(
      `${task}/task/checkTaskExist/${groupName}/${tenantId}`, // Send a GET request with the group name and tenant ID.
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include authorization token for secure access.
        },
      }
    );
    console.log("Check response : ", response.data); // Log the response from the server.
    return response.data; // Return whether the asset group exists.
  } catch (error) {
    console.error("Error fetching Asset Groups List with versions:", error); // Log any error that occurs.
    return false; // Return false if there was an error.
  }
};

// Function to get detailed information about an asset by its asset ID.
export const assetInfoByAssetIdApi = async (assetId) => {
  try {
    const tenantId = getTenantID(); // Get the current tenant ID.
    const response = await axios.get(
      `${asset}/api/assetInfoByAssetId/${assetId}/${tenantId}`, // Send a GET request to fetch asset details by asset ID and tenant ID.
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include authorization token for secure access.
        },
      }
    );
    console.log("response : ", response); // Log the response for debugging.
    return response.data; // Return the asset information.
  } catch (error) {
    console.error("error >: ", error); // Log the error if the request fails.
  }
};

// Function to get all departments for the current tenant.
export const getAllDepartments = async () => {
  try {
    const tenantId = getTenantID(); // Get the current tenant ID.
    const response = await axios.get(
      `${userModule}/usermodule/getalldeptartmentsbytenantid/${tenantId}`, // Send a GET request to fetch all departments for the tenant.
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include authorization token for secure access.
        },
      }
    );
    return response.data; // Return the list of departments.
  } catch (error) {
    console.error("Error fetching department list:", error); // Log any error that occurs during the request.
    return null; // Return null if there was an error.
  }
};

// Function to fetch all group names for the current tenant
export const getAllGroup = async () => {
  try {
    const tenantId = getTenantID(); // Get the tenant ID using the helper function.
    const response = await axios.get(
      `${userModule}/usermodule/getallgroupnamesbytenantid/${tenantId}`, // API call to get all group names based on tenant ID.
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include authorization token in request headers.
        },
      }
    );
    return response.data; // Return the group data received from the API.
  } catch (error) {
    console.error("Error fetching group list:", error); // Log any errors if the request fails.
    return null; // Return null if there's an error.
  }
};

// Function to fetch the asset group tree for a specific asset group by its ID
export const getAssetGroupTree = async (assetGroupId) => {
  try {
    const tenantId = getTenantID(); // Get the tenant ID using the helper function.
    const response = await axios.get(
      `${asset}/api/assetGroups/${assetGroupId}/${tenantId}`, // API call to get the asset group tree by asset group ID and tenant ID.
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include authorization token in request headers.
          "Content-type": "text/plain", // Set the content type to plain text.
        },
      }
    );
    return response.data; // Return the asset group tree data.
  } catch (error) {
    console.error("Error fetching Asset Group Tree:", error); // Log any errors if the request fails.
    return null; // Return null in case of an error.
  }
};

// Function to post (submit) data to the server
export const handlePostData = async (dataLocal) => {
  try {
    const tenantId = getTenantID(); // Get the tenant ID using the helper function.
    const response = await axios.post(
      `${asset}/api/assetgroup/${decryptTokenId(
        localStorage.getItem(process.env.REACT_APP_USERID) // Decrypt and get the user ID from session storage.
      )}/${tenantId}`, // URL for posting the data, including the user ID and tenant ID.
      dataLocal, // The data that needs to be posted (submitted).
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include authorization token in request headers.
        },
      }
    );
    console.log(response.status); // Log the response status for debugging.
    return response; // Return the full response object.
  } catch (error) {
    console.error("Error posting data:", error); // Log any errors if the request fails.
  }
};

// Function to delete an asset group by its ID
export const deleteAnAssetGroup = async (assetgroup) => {
  try {
    const tenantId = getTenantID(); // Get the tenant ID using the helper function.
    const response = await axios.delete(
      `${asset}/api/assetgroup/${assetgroup}/${tenantId}`, // API call to delete an asset group using its ID and the tenant ID.
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include authorization token in request headers.
        },
      }
    );
    console.log("response : ", response); // Log the response for debugging.
    return response; // Return the full response object.
  } catch (error) {
    console.error("Error deleting asset group:", error); // Log any errors if the request fails.
  }
};

// Function to fetch all asset groups for the current tenant
export const getAllAssetGroups = async () => {
  try {
    const tenantId = getTenantID(); // Get the tenant ID using the helper function.
    const response = await axios.get(`${asset}/api/assetgroups/${tenantId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Include authorization token in request headers.
      },
    });
    if (response.data) {
      console.log("Current response for AssetGroup : ", response.data); // Log the response data for debugging.
      return response.data; // Return the list of asset groups.
    }
  } catch (error) {
    console.error("Error fetching Asset Groups List with versions:", error); // Log any errors if the request fails.
  }
};

// Function to fetch details of a specific group by its ID
export const getGroupByGroupId = async (groupId) => {
  try {
    const tenantId = getTenantID(); // Get the tenant ID using the helper function.
    const response = await axios.get(
      `${userModule}/usermodule/getGroupByGroupId?groupId=${groupId}&tenantId=${tenantId}`, // API call to get group details by group ID and tenant ID.
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include authorization token in request headers.
        },
      }
    );
    return response.data; // Return the group details.
  } catch (error) {
    console.error("Error fetching group details:", error); // Log any errors if the request fails.
    return null; // Return null in case of an error.
  }
};

// Function to fetch active logbooks by asset ID and tenant ID
export const getActiveLogbooksByAssetId = async (assetId, tenantId) => {
  try {
    // Define the API endpoint
    const url = `${asset}/api/getactivelogbooksbyassetid/${assetId}/${tenantId}`;

    // Make the GET request
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Include authorization token in request headers.
      },
    });

    // Check if the status is 204 (No Content)
    if (response.status === 204) {
      console.log("No logbooks found for the given asset and tenant.");
      return null; // Handle no content scenario
    }

    // Log and return the response data
    console.log("Logbooks fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    // Handle errors
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error("Error fetching logbooks:", error.response.data);
      console.error("Status code:", error.response.status);
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received:", error.request);
    } else {
      // Something else caused an error
      console.error("Error setting up the request:", error.message);
    }
    throw error; // Rethrow the error if needed for further handling
  }
};
