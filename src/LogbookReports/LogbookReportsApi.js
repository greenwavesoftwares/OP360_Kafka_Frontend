import axios from "axios"; // Import axios to make HTTP requests
import { decryptTokenId } from "../helper/AuthService"; // Import a function to decrypt token IDs
import { getCurrentUser } from "../UserModuleUpdated/helper";

// These are URLs for different parts of the application, stored in environment variables
const logbook = process.env.REACT_APP_LOGBOOK;
const userModule = process.env.REACT_APP_USERMODULE;
const job = process.env.REACT_APP_JOBAPI;

// Function to get logbook reports based on a date range and report name
export const getLogbookReportsApi = async (fromDate, toDate, reportName) => {
  try {
    // Making a GET request to the logbook API to fetch report data
    const response = await axios.get(
      `${logbook}/logbook/reportData/${decryptTokenId(
        localStorage.getItem(process.env.REACT_APP_TENANTID),
      )}?fromdate=${getFormattedDate(fromDate)}&todate=${getFormattedDate(
        toDate,
      )}&reportName=${reportName}`,
      {
        headers: {
          // Sending the user's token for authorization
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    // console.log("data : ", response.data); // Log the data received
    return response.data; // Return the report data
  } catch (error) {
    console.log(error); // Log any error that occurs
  }
};

// Function to get all logbook reports created by a specific user
export const allLogbookReportsApi = async (creator) => {
  try {
    // Making a GET request to fetch distinct report names for the creator
    const response = await axios.get(
      `${logbook}/logbook/distinctreportnames/${decryptTokenId(
        localStorage.getItem(process.env.REACT_APP_TENANTID),
      )}?creator=${creator}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Sending the user's token
        },
      },
    );
    // console.log("data : ", response.data); // Log the data received
    return response.data; // Return the list of reports
  } catch (error) {
    console.log(error); // Log any error that occurs
  }
};

// Function to format a date into a specific string format
const getFormattedDate = (date) => {
  const year = date.getFullYear(); // Get the full year
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Get the month (0-11), adding 1 to make it (1-12)
  const day = String(date.getDate()).padStart(2, "0"); // Get the day of the month
  const hours = String(date.getHours()).padStart(2, "0"); // Get hours
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Get minutes
  const seconds = String(date.getSeconds()).padStart(2, "0"); // Get seconds
  const milliseconds = String(date.getMilliseconds()).padStart(3, "0"); // Get milliseconds

  // Return the formatted date string
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
};

// Function to get transactions based on form name and version
export const getTransactionsByFormNameAndVersionApi = async (
  formName,
  version,
) => {
  try {
    // Making a GET request to fetch transactions by form name and version
    const response = await axios.get(
      `${logbook}/logbook/getTransactionsByFormNameAndVersion/${decryptTokenId(
        localStorage.getItem(process.env.REACT_APP_TENANTID),
      )}?formName=${formName}&version=${version}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Sending the user's token
        },
      },
    );
    return response.data; // Return the transactions data
  } catch (error) {
    console.error("Error fetching transactions:", error); // Log any error that occurs
  }
};

// Function to fetch all form information
export const fetchAllFormInfoApi = async () => {
  try {
    // Making a GET request to fetch all form information
    const response = await axios.get(
      `${logbook}/logbook/forminfo/${decryptTokenId(
        localStorage.getItem(process.env.REACT_APP_TENANTID),
      )}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Sending the user's token
        },
      },
    );
    // console.log("response.data : ", response.data); // Log the data received
    return response.data; // Return the form information
  } catch (error) {
    console.error(error); // Log any error that occurs
  }
};

// Function to fetch specific form information by form name
export const fetchFormInfoApi = async (formName) => {
  try {
    // Making a GET request to fetch form information based on the form name
    const response = await axios.get(
      `${logbook}/logbook/forminfo/${decryptTokenId(
        localStorage.getItem(process.env.REACT_APP_TENANTID),
      )}/${formName}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Sending the user's token
        },
      },
    );
    return response.data; // Return the form information
  } catch (error) {
    console.error(error); // Log any error that occurs
  }
};

// Function to fetch cell information based on form name and version
export const fetchCellInfoApi = async (formName, version) => {
  try {
    // Making a GET request to fetch cell information
    const response = await axios.get(
      `${logbook}/logbook/forminfo/${decryptTokenId(
        localStorage.getItem(process.env.REACT_APP_TENANTID),
      )}/${formName}/versions/${version}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Sending the user's token
        },
      },
    );
    return response.data; // Return the cell information
  } catch (error) {
    console.error(error); // Log any error that occurs
  }
};

// Function to get transactions by form name and version between specific dates
export const getTransactionsByFormnameAndVersionBetweenDates = async (
  selectedLogbook,
  selectedVersion,
  formattedFromDate,
  formattedToDate,
) => {
  try {
    // Making a GET request to fetch transactions by form name, version, and date range
    const response = await axios.get(
      `${logbook}/logbook/getTransactionsByFormnameAndVersionBetweenDates/${decryptTokenId(
        localStorage.getItem(process.env.REACT_APP_TENANTID),
      )}?formName=${selectedLogbook}&version=${selectedVersion}&fromDate=${formattedFromDate}&toDate=${formattedToDate}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Sending the user's token
        },
      },
    );
    return response.data; // Return the transactions data
  } catch (error) {
    console.error(error); // Log any error that occurs
  }
};

// Function to get form information based on name and version
export const forminfoByformNameAndVersionApi = async (formName, version) => {
  try {
    // Making a GET request to fetch form information by form name and version
    const response = await axios.get(
      `${logbook}/logbook/formInfoByformNameAndVersion/${decryptTokenId(
        localStorage.getItem(process.env.REACT_APP_TENANTID),
      )}?formName=${formName}&version=${version}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Sending the user's token
        },
      },
    );
    return response.data; // Return the form information
  } catch (error) {
    console.error(error); // Log any error that occurs
  }
};

// Function to download a PDF report based on form name, version, and date range
export const pdfDownloadApi = async (
  formName,
  version,
  fromDate,
  toDate,
  index,
) => {
  const userid = await getCurrentUser();
  try {
    // Making a GET request to download a PDF report
    const response = await axios.get(
      `${logbook}/logbook/logbookPdf/${decryptTokenId(
        localStorage.getItem(process.env.REACT_APP_TENANTID),
      )}/${userid}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Sending the user's token
        },
        params: {
          formName,
          version,
          fromDate,
          toDate,
          index,
        },
        responseType: "blob", // Specify that we want a binary file (blob)
      },
    );

    // Creating a link to download the file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url; // Set the link's URL to the blob URL
    link.setAttribute("download", `${formName}-${version}.pdf`); // Set the file name
    document.body.appendChild(link); // Add the link to the document
    link.click(); // Simulate a click to download the file
    document.body.removeChild(link); // Remove the link after downloading
    return response;
  } catch (error) {
    console.error(error); // Log any error that occurs
  }
};
// This function downloads a single PDF file based on the form name, version, and index.
export const singlePdfDownloadApi = async (
  formName,
  version,
  activityId,
  jobId,
) => {
  const userid = await getCurrentUser();
  try {
    // Send a request to get the PDF file
    const response = await axios.get(
      `${logbook}/logbook/singleLogbookPdf/${decryptTokenId(
        localStorage.getItem(process.env.REACT_APP_TENANTID),
      )}/${userid}`,
      {
        headers: {
          // Include the user's token for authorization
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          // These are the extra details we want to include in the request
          formName,
          version,
          activityId,
          jobId,
        },
        responseType: "blob", // We expect a blob (binary data) back
      },
    );
    return response; // Return the response we got from the server
  } catch (error) {
    console.error(error); // If something goes wrong, log the error
  }
};

// This function gets transaction details based on job ID and activity ID
export const getTransactionByJobidAndActivityidApi = async (
  jobId,
  activityId,
) => {
  try {
    // Send a request to get the transaction data
    const response = await axios.get(
      `${logbook}/logbook/getTransactionByJobidAndActivityid/${decryptTokenId(
        localStorage.getItem(process.env.REACT_APP_TENANTID),
      )}?jobId=${jobId}&activityId=${activityId}`,
      {
        headers: {
          // Include the user's token for authorization
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    // // Log the data we received for debugging
    // console.log("response.data : => ", response.data);
    return response.data; // Return the data we received
  } catch (error) {
    console.error(error); // Log any errors that occur
    return false; // Return false if there's an error
  }
};

// This function fetches PDF details using job ID and activity ID
export const pdfDetailsApi = async (jobId, activityId) => {
  logbookArchiveFooterDetailsApi(jobId, activityId);
  try {
    // Send a request to get PDF details
    const response = await axios.get(
      `${job}/jobs/pdfDetails/${decryptTokenId(
        localStorage.getItem(process.env.REACT_APP_TENANTID),
      )}?jobId=${jobId}&activityId=${activityId}`,
      {
        headers: {
          // Include the user's token for authorization
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    return response.data; // Return the PDF details
  } catch (error) {
    console.error(error); // Log any errors
  }
};

// This function fetches Logbook Archive footer details using job ID and activity ID
export const logbookArchiveFooterDetailsApi = async (jobId, activityId) => {
  try {
    // Send a request to get PDF details
    const response = await axios.get(
      `${logbook}/logbook/logbookArchiveFooterDetails/${decryptTokenId(
        localStorage.getItem(process.env.REACT_APP_TENANTID),
      )}?jobId=${jobId}&activityId=${activityId}`,
      {
        headers: {
          // Include the user's token for authorization
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    console.log("response.data :: :: ", response.data);
    return response.data; // Return the PDF details
  } catch (error) {
    console.error(error); // Log any errors
  }
};

// This function gets the active form information
export const getActiveFormInfoApi = async () => {
  try {
    // Send a request to get active form info
    const response = await axios.get(
      `${logbook}/logbook/activeforminfo/${decryptTokenId(
        localStorage.getItem(process.env.REACT_APP_TENANTID),
      )}`,
      {
        headers: {
          // Include the user's token for authorization
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    return response.data; // Return the active form info
  } catch (error) {
    console.error(error); // Log any errors
  }
};

// This function retrieves all users by tenant ID
export const getUsersApi = async () => {
  try {
    // Send a request to get all users
    const response = await axios.get(
      `${userModule}/usermodule/allusersbytenantid/${decryptTokenId(
        localStorage.getItem(process.env.REACT_APP_TENANTID),
      )}`,
      {
        headers: {
          // Include the user's token for authorization
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    return response.data; // Return the list of users
  } catch (error) {
    console.error(error); // Log any errors
  }
};

// This function gets user-wise reports based on the creator's ID
export const getUserWiseReportApi = async (creator) => {
  try {
    // Send a request to get user-wise report
    const response = await axios.get(
      `${logbook}/logbook/userwisereport/${decryptTokenId(
        localStorage.getItem(process.env.REACT_APP_TENANTID),
      )}?userId=${creator}`,
      {
        headers: {
          // Include the user's token for authorization
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    // console.log("response.data", response.data); // Log the report data
    return response.data; // Return the user-wise report data
  } catch (error) {
    console.error(error); // Log any errors
  }
};

// This function fetches information for a specific user-wise report
export const getUserWiseReportInfoApi = async (reportName) => {
  try {
    // Send a request to get user-wise report information
    const response = await axios.get(
      `${logbook}/logbook/userwisereportinfo/${decryptTokenId(
        localStorage.getItem(process.env.REACT_APP_TENANTID),
      )}?reportName=${reportName}`,
      {
        headers: {
          // Include the user's token for authorization
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    return response.data; // Return the report information
  } catch (error) {
    console.error(error); // Log any errors
  }
};

// This function saves the logbook configuration
export const saveLogbookConfigApi = async (
  reportName,
  reportConfig,
  reportData,
  creatorId,
  sharedUserLists,
) => {
  try {
    // Send a request to save the logbook configuration
    const response = await axios.post(
      `${logbook}/logbook/insertreport/${decryptTokenId(
        localStorage.getItem(process.env.REACT_APP_TENANTID),
      )}?reportName=${reportName}`,
      {
        reportConfig, // The configuration details of the report
        reportData, // The actual data of the report
        creatorId, // ID of the person who created the report
        sharedUserLists, // List of users the report is shared with
      },
      {
        headers: {
          // Include the user's token for authorization
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    // console.log("response : ", response); // Log the response we got back
    return response; // Return the response
  } catch (error) {
    console.error("error >: ", error); // Log any errors
  }
};

// This function updates the list of shared users for a report
export const updateSharedUserApi = async (reportName, sharedUserLists) => {
  try {
    // Send a request to update shared users for the report
    const response = await axios.post(
      `${logbook}/logbook/updateSharedUser/${decryptTokenId(
        localStorage.getItem(process.env.REACT_APP_TENANTID),
      )}?reportName=${reportName}&sharedUser=${sharedUserLists}`,
      {}, // No body data needed for this request
      {
        headers: {
          // Include the user's token for authorization
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    // console.log("response : ", response); // Log the response we got back
    return response; // Return the response
  } catch (error) {
    console.error("error >: ", error); // Log any errors
  }
};

// This function gets editable form information based on the selected city
export const getEditableFormInfoApi = async (selectedCity) => {
  try {
    // Send a request to get editable form information
    const response = await axios.get(
      `${logbook}/logbook/editableforminfo/versions/${decryptTokenId(
        localStorage.getItem(process.env.REACT_APP_TENANTID),
      )}`,
      {
        headers: {
          // Include the user's token for authorization
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          // These are the details we want to include in the request
          version: selectedCity.versionNumber,
          formName: selectedCity.formName,
        },
      },
    );
    return response.data; // Return the editable form information
  } catch (error) {
    console.error(error); // Log any errors
  }
};
