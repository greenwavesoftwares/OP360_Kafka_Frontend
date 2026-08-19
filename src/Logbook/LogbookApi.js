import axios from "axios";
import { decryptTokenId } from "../helper/AuthService";

const username = "user123";
const password = "pass123";
const encoded = btoa(username + ":" + password);

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


//Added by Ashok
export const getFileFromMinIO = async (minio_key) => {
  // Get the tenant ID using the helper function
  const tenantId = getTenantID();
  try {
    // Make an API request to the backend to get form information for the given tenant
    const response = await axios.get(
      `${process.env.REACT_APP_LOGBOOK}/logbook/file`, // API endpoint with tenant-specific path
      {
        params: {
          minio_key:minio_key,
          // Pass the required parameters in the request
          tenantId: tenantId,
        },
        headers: {
          // Send the authorization token in the request headers to ensure secure access
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    // Return the data from the API response
    return response;
  } catch (error) {
    // If there's an error during the API call, log it for debugging purposes
    console.error("Error fetching form info with versions:", error);
    return null; // Return null to indicate the operation failed
  }
};

// Function to fetch all form information (including versions) for the current tenant
export const getAllFormInfo = async () => {
  // Get the tenant ID using the helper function
  const tenantId = getTenantID();
  try {
    // Make an API request to the backend to get form information for the given tenant
    const response = await axios.get(
      `${process.env.REACT_APP_LOGBOOK}/logbook/forminfo/${tenantId}`, // API endpoint with tenant-specific path
      {
        headers: {
          // Send the authorization token in the request headers to ensure secure access
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    // Return the data from the API response
    return response.data;
  } catch (error) {
    // If there's an error during the API call, log it for debugging purposes
    console.error("Error fetching form info with versions:", error);
    return null; // Return null to indicate the operation failed
  }
};

// Function to fetch only the active form information for the current tenant
export const getAllActiveFormInfo = async () => {
  try {
    // Get the tenant ID using the helper function
    const tenantId = getTenantID();
    console.log(`${process.env.REACT_APP_LOGBOOK}/logbook/activeforminfo/${tenantId}`)
    // Make an API request to get active form information for the given tenant
    const response = await axios.get(
      `${process.env.REACT_APP_LOGBOOK}/logbook/activeforminfo/${tenantId}`, // API endpoint for active forms
      {
        headers: {
          // Send the authorization token in the request headers for secure access
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    // Return the active form data from the API response
    return response.data;
  } catch (error) {
    // Log the error if the API call fails
    console.error("Error fetching active form info:", error);
    return null; // Return null to indicate the operation failed
  }
};

// Function to retrieve all transaction details for a selected form
export const getAllTransactions = async (
  jobId, // ID of the specific job
  activityId, // ID of the specific activity
  selectedFormName, // Name of the selected form
  selectedVersion // Version of the selected form
) => {
  // Log the form and transaction details for debugging purposes
  console.log("Selected Form Details:", selectedFormName, selectedVersion);
  console.log("Details:", jobId, activityId);

  // Get the tenant ID using the helper function
  const tenantId = getTenantID();

  try {
    // Make an API request to get all transactions related to the selected form and tenant
    const response = await axios.get(
      `${process.env.REACT_APP_LOGBOOK}/logbook/forminfo/getalltransactions/${tenantId}`, // API endpoint for transactions
      {
        params: {
          // Pass the necessary parameters for the query, such as jobId, activityId, form name, and version
          jobId: jobId,
          activityId: activityId,
          formName: selectedFormName,
          formVersion: selectedVersion,
        },
        headers: {
          // Send the authorization token in the request headers for secure access
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    // Return the transaction data from the API response
    return response.data;
  } catch (error) {
    // Log the error if the API call fails
    console.error("Error fetching logbook transactions:", error);
    return null; // Return null to indicate the operation failed
  }
};

// Function to fetch cell information based on form name and version number for a specific tenant
export const getAllCellInfoByFormNameAndVersion = async (
  formName,
  versionNumber
) => {
  // Retrieve the tenant ID
  const tenantId = getTenantID();

  // Construct the API URL dynamically using form name, version number, and tenant ID
  const url = `${process.env.REACT_APP_LOGBOOK}/logbook/forminfo/${formName}/versions/${versionNumber}/${tenantId}`;

  // Log the URL for debugging purposes
  console.log("url Form => ", url);

  try {
    // Make a GET request to the server to retrieve cell info data for the specified form and version
    const response = await axios.get(url, {
      headers: {
        // Include the authorization token in the request headers to ensure the user is authenticated
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    // Return the retrieved data
    return response.data;
  } catch (error) {
    // Log the error if the request fails and return null
    console.error("Error fetching forminfo with versions:", error);
    return null;
  }
};

// Function to run a query and get results based on a provided request body
export const getQueryResult = async (body) => {
  // Retrieve the tenant ID
  const tenantId = getTenantID();

  try {
    // Make a POST request to the server, sending the request body as the query
    const response = await axios.post(
      `${process.env.REACT_APP_LOGBOOK}/logbook/forminfo/getdropdownforquery/${tenantId}`,
      body, // The request body, which contains the query parameters
      {
        headers: {
          // Authorization token for secure access and specifying content type as plain text
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-type": "text/plain",
        },
      }
    );
    // Return the data from the server response
    return response.data;
  } catch (error) {
    // Log the error if the request fails and return null
    console.error("Error fetching dropdowns from SQL:", error);
    return null;
  }
};

// Function to run a query for global cell updates based on a request body
export const getQueryResultForGlobalCellUpdate = async (body) => {
  // Retrieve the tenant ID
  const tenantId = getTenantID();

  try {
    // Make a POST request to the server, sending the query for global cell updates
    const response = await axios.post(
      `${process.env.REACT_APP_LOGBOOK}/logbook/forminfo/getqueryresultforglobalcellupdate/${tenantId}`,
      body, // The request body containing the query details
      {
        headers: {
          // Authorization token and specifying content type as plain text
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-type": "text/plain",
        },
      }
    );
    // Return the data from the server response
    console.log("Response of Global Cell Update : ", response.data);
    return response.data;
  } catch (error) {
    // Log the error if the request fails and return null
    console.error(
      `Error fetching getqueryresultforglobalcellupdate() for SQL : ${body}`,
      error
    );
    return null;
  }
};

// Function to fetch the edit history of a specific cell in the logbook
export const getCellEditHistory = async (cellId, jobId, activityId) => {
  // Log the input parameters for debugging
  console.log(cellId, jobId, activityId);

  // Retrieve the tenant ID
  const tenantId = getTenantID();

  try {
    // Make a GET request to retrieve the cell edit history based on tenant, cellId, jobId, and activityId
    const response = await axios.get(
      `${process.env.REACT_APP_LOGBOOK}/logbook/forminfo/getcelledithistory/${tenantId}`,
      {
        params: {
          // Pass the required parameters in the request
          cellId: cellId,
          jobId: jobId,
          activityId: activityId,
        },
        headers: {
          // Include the authorization token in the request headers
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    // Return the cell edit history data
    return response.data;
  } catch (error) {
    // Log the error if the request fails and return null
    console.error("Error fetching CellEdited History", error);
    return null;
  }
};

// Function to save a transaction in the system
export const SaveTransaction = async (requestBody) => {
  // Add the tenant ID to the request body before sending it to the server
  requestBody.tenantid = getTenantID();

  // Log the transaction data for debugging
  // console.log("SaveTransaction::", JSON.stringify(requestBody));

  try {
    // Make a POST request to save the transaction data on the server
    const response = await axios.post(
      `${process.env.REACT_APP_LOGBOOK}/logbook/forminfo/savetransaction`,
      requestBody, // The transaction data to be saved
      {
        headers: {
          // Authorization token and specify the content type to accept JSON responses
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      }
    );

    // Return the status of the server response (e.g., success)
    return response.status;
  } catch (error) {
    // Log the error if the transaction save fails and return null
    console.error("Error saving transaction data.", error);
    return error;
  }
};


export const SaveTransactionToMongo = async (requestBody) => {
  
  try {
    const response = await axios.post(`${process.env.REACT_APP_MONGODBAPI}/api/chat/logbook/data`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Response:', response.data);
    return response.status;
  } catch (error) {
    console.error('Error posting data:', error);
    return null
  }
};

export const SaveLogbookMetaInfoToMongo = async (requestBody) => {
  
  try {
    const response = await axios.post(`${process.env.REACT_APP_MONGODBAPI}/api/chat/metainfo`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Response:', response.data);
    return response.status;
  } catch (error) {
    console.error('Error posting data:', error);
    return null
  }
};

// Function to fetch form information based on the form name for a specific tenant
export const getFormInfoByFormName = async (formName) => {
  // Retrieve the tenant ID
  const tenant = getTenantID();

  // Construct the URL dynamically using the form name and tenant ID
  const url = `${process.env.REACT_APP_LOGBOOK}/logbook/forminfo/${formName}/${tenant}`;

  try {
    // Make a GET request to retrieve the form information from the server
    const response = await axios.get(url, {
      headers: {
        // Include the authorization token in the request headers
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    // Return the form information data
    return response.data;
  } catch (error) {
    // Log the error if the request fails and return null
    console.error("Error fetching form info with formName:", error);
    return null;
  }
};

export const getRestData = async (url) => {
  console.log("getRestData", url);
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: "Basic " + encoded,
      },
    });
    console.log("response for api : ", response.data);
    // return Object.values(response.data)[0];
    return response.data;
  } catch (error) {
    console.error("Error fetching Rest Data", error);
    return null;
  }
};

//added for save transaction file as blob
export const handleSaveTransactionAttachment = async (dataLocal) => {
  try {
    // console.log("dataLocal for Post : ", dataLocal); // Log the data being sent
    // console.log("dataLocal for Post as JSON : ", JSON.stringify(dataLocal)); // Log the JSON string of the data
    const tenantId = getTenantID(); // Retrieve the tenant ID
    const response = await axios.post(
      `${process.env.REACT_APP_LOGBOOK}/logbook/saveTransactionAttachment/${tenantId}`, // Construct the API URL
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

export const getAttachmentsByTransactionId = async (transactionId) => {
  // !need to import later on
  try {
    const tenantId = getTenantID(); // Retrieve the tenant ID
    // console.log(
    //   "Connect : ",
    //   `${process.env.REACT_APP_TASKAPI}/task/acivityConnections/${taskId}/${tenantId}`
    // ); // Log the API URL

    const response = await axios.get(
      `${process.env.REACT_APP_LOGBOOK}/logbook/getTransactionAttachment/${transactionId}/${tenantId}`,
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

export const getTransactionAttachmentFromCellIdAndTransactionId = async (
  transactionId,
  cellId
) => {
  // !need to import later on
  try {
    const tenantId = getTenantID(); // Retrieve the tenant ID

    const response = await axios.get(
      `${process.env.REACT_APP_LOGBOOK}/logbook/getTransactionAttachmentFromCellIdAndTransactionId/${transactionId}/${cellId}/${tenantId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Set the authorization header
        },
      }
    );
    if (response.data) {
      return response.data; // Return the connection list
    }
  } catch (error) {
    console.error("Error fetching Asset Groups List with versions:", error); // Log any errors that occur
    // return null;
  }
};

// http://localhost:8079/logbook/customReportColumnMapping/Dryer Loading version 2 test/ITCITDOP360
export const customReportColumnMapping = async (reportName) => {
  // !need to import later on
  try {
    const tenantId = getTenantID(); // Retrieve the tenant ID

    const response = await axios.get(
      `${process.env.REACT_APP_LOGBOOK}/logbook/customReportColumnMapping/${reportName}/${tenantId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Set the authorization header
        },
      }
    );
    if (response.data) {
      return response.data; // Return the connection list
    }
  } catch (error) {
    console.error("Error fetching Asset Groups List with versions:", error); // Log any errors that occur
    // return null;
  }
};
//http://localhost:8079/logbook/forminfo/getAllRequiredCellIds/Material Indent/versions/1/GREENWAVE
export const getAllRequiredCellIds = async (formname,version) => {
  // !need to import later on
  try {
    const tenantId = getTenantID(); // Retrieve the tenant ID

    const response = await axios.get(
      `${process.env.REACT_APP_LOGBOOK}/logbook/forminfo/getAllRequiredCellIds/${formname}/versions/${version}/${tenantId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Set the authorization header
        },
      }
    );
    if (response.data) {
      console.log("Required cellid:",response.data)
      return response.data; // Return the connection list
    }
  } catch (error) {
    console.error("Error fetching getAllRequiredCellIdsAsset Groups List with versions:", error); // Log any errors that occur
    // return null;
  }
};

