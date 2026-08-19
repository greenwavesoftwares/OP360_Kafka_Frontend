import axios from "axios"; // Importing axios for making HTTP requests
import { decryptTokenId } from "../helper/AuthService"; // Importing a function to decrypt token IDs
import { getCurrentUser } from "../UserModuleUpdated/helper"; // Importing a function to get the current user

// Function to retrieve the tenant ID from session storage and decrypt it
const getTenantID = () => {
  const env_tenant = process.env.REACT_APP_TENANTID; // Retrieve tenant ID from environment variables
  const encryptedTenant = localStorage.getItem(env_tenant); // Get encrypted tenant ID from session storage
  const tenant = decryptTokenId(encryptedTenant); // Decrypt the tenant ID
  // console.log("Current Tenant ID : ", tenant); // Log the current tenant ID
  return tenant; // Return the decrypted tenant ID
};

// Function to save task details to the server
export const handleSaveTask = async (dataLocal) => {
  try {
    // console.log("dataLocal for Post : ", dataLocal); // Log the data being sent
    // console.log("dataLocal for Post as JSON : ", JSON.stringify(dataLocal)); // Log the JSON string of the data
    const tenantId = getTenantID(); // Retrieve the tenant ID
    const response = await axios.post(
      `${process.env.REACT_APP_TASKAPI}/task/saveTaskDetails/${tenantId}`, // Construct the API URL
      dataLocal, // Data to be sent in the request body
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Set the authorization header
        },
      }
    );
    // console.log("status : ", response.status); // Log the response status
    return response.status; // Return the response status
  } catch (error) {
    console.error("Error posting data:", error); // Log any errors that occur
  }
};

// Function to save activity connections to the server
export const handleSaveActivityConnections = async (dataLocal) => {
  try {
    // console.log("dataLocal : ", dataLocal); // Log the data being sent
    const tenantId = getTenantID(); // Retrieve the tenant ID
    const response = await axios.post(
      `${process.env.REACT_APP_TASKAPI}/task/saveActivityConnection/${tenantId}`, // Construct the API URL
      dataLocal, // Data to be sent in the request body
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Set the authorization header
        },
      }
    );
    // console.log("status : ", response.status); // Log the response status
    return response.status; // Return the response status
  } catch (error) {
    console.error("Error posting data:", error); // Log any errors that occur
  }
};

// Function to fetch activity connections based on task ID
export const getActivityConnections = async (taskId) => {
  // !need to import later on
  try {
    const tenantId = getTenantID(); // Retrieve the tenant ID
    // console.log(
    //   "Connect : ",
    //   `${process.env.REACT_APP_TASKAPI}/task/acivityConnections/${taskId}/${tenantId}`
    // ); // Log the API URL

    const response = await axios.get(
      `${process.env.REACT_APP_TASKAPI}/task/acivityConnections/${taskId}/${tenantId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Set the authorization header
        },
      }
    );
    if (response.data) {
      // console.log("ConnectionList  : ", response.data); // Log the fetched connection list
      return response.data; // Return the connection list
    }
  } catch (error) {
    console.error("Error fetching Asset Groups List with versions:", error); // Log any errors that occur
    // return null;
  }
};

// Function to fetch all tasks for the current tenant
export const getAllTaskByTenantId = async () => {
  // !need to import later on
  try {
    const tenantId = getTenantID(); // Retrieve the tenant ID
    const loggedInuser = getCurrentUser(); // Get the current logged-in user
    // console.log(
    //   "getAllTaskByTenantId : ",
    //   `${process.env.REACT_APP_TASKAPI}/task/alltask/${loggedInuser}/${tenantId}`
    // ); // Log the API URL

    const response = await axios.get(
      `${process.env.REACT_APP_TASKAPI}/task/alltask/${loggedInuser}/${tenantId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Set the authorization header
        },
      }
    );
    if (response.data) {
      // console.log("ConnectionList  : ", response.data); // Log the fetched connection list
      return response.data; // Return the connection list
    }
  } catch (error) {
    console.error("Error fetching Asset Groups List with versions:", error); // Log any errors that occur
    // return null;
  }
};

// Function to check if a task ID exists
export const CheckTaskIdExists = async (taskId) => {
  try {
    const tenantId = getTenantID(); // Retrieve the tenant ID
    // console.log(
    //   "Api URL JobCheck : ",
    //   `${process.env.REACT_APP_TASKAPI}/task/checkJobExist/${taskId}/${tenantId}`
    // ); // Log the API URL
    const response = await axios.get(
      `${process.env.REACT_APP_TASKAPI}/task/checkJobExist/${taskId}/${tenantId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Set the authorization header
        },
      }
    );
    // console.log("Check response : ", response.data); // Log the response data
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error fetching Asset Groups List with versions:", error); // Log any errors that occur
    return null; // Return null in case of error
  }
};

// Function to delete a task by sending the task data to the server
export const deleteATask = async (task) => {
  // console.log("MyTask : ", task); // Log the task being deleted
  try {
    const tenantId = getTenantID(); // Retrieve the tenant ID
    const response = await axios.delete(
      `${process.env.REACT_APP_TASKAPI}/task/deleteTask/${tenantId}`, // Construct the API URL
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Set the authorization header
        },
        data: task, // Data to be sent in the request body
      }
    );
    // console.log("response delete  : ", response.status); // Log the response status
    return response; // Return the response
  } catch (error) {
    console.error("Error posting data:", error); // Log any errors that occur
  }
};
