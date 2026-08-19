import LogbookReportViewComponent from "./LogbookReportViewComponent";
import {
  forminfoByformNameAndVersionApi,
  getTransactionByJobidAndActivityidApi,
  logbookArchiveFooterDetailsApi,
  singlePdfDownloadApi,
} from "../../LogbookReports/LogbookReportsApi";
import { Alert, Chip, Slide, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { getUserByTenantIdApi } from "../../Tenant/TenantApi";

// This component displays a single logbook based on parameters like jobId and activityId
const LViewWithProps = ({ jobId, activityId }) => {
  // State to store transaction data, error status, and display conditions
  const [transactionData, setTransactionData] = useState();
  const [error, setError] = useState(false);
  const [showDataGrid, setShowDataGrid] = useState(false);

  // State to store format, document IDs, and grid data
  const [formatId, setFormatId] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [gridData, setGridData] = useState([]);

  // State to store task, activity, and asset names, along with tenant user data
  const [activityName, setActivityName] = useState("");
  const [taskName, setTaskName] = useState("");
  const [assetName, setAssetName] = useState("");
  const [tenentUserData, setTenentUserData] = useState();

  const [jobName, setJobName] = useState(""); // State for job name
  const [performer, setPerformer] = useState(""); // State for performer name

  const [errorOpen, setErrorOpen] = useState(false); // To control error messages
  const [snackbarText, setSnackbarText] = useState(""); // Text for snackbar messages
  const [snackbarSeverity, setsnackbarSeverity] = useState(""); // Severity level of snackbar messages

  const [isLoading, setIsLoading] = useState(false); // State to show loading status

  // useEffect to fetch transaction data when jobId and activityId are provided
  useEffect(() => {
    setIsLoading(true);
    if (jobId && activityId) {
      const fetchTransactionData = async () => {
        try {
          // Fetch transaction data using jobId and activityId
          const data = await getTransactionByJobidAndActivityidApi(
            jobId,
            activityId,
          );

          if (data) {
            // Fetch tenant user data
            const tenentUserData = await getUserByTenantIdApi();

            // Check if tenentUserData is empty or undefined
            if (!tenentUserData) {
              setError(true);
              setsnackbarSeverity("error");
              setSnackbarText("Tenant user data could not be retrieved.");
              setErrorOpen(true); // Show Snackbar
              return;
            }

            if (tenentUserData) {
              setTenentUserData(tenentUserData); // Save the tenant user data
            }

            // Set transaction data and handle errors
            setTransactionData(data);

            // Call a function to get additional information about the form
            forminfoByformNameAndVersion(data);

            // Show the data grid after a short delay
            setTimeout(() => {
              setShowDataGrid(true); // Show the data grid
            }, 1000);
          } else {
            setsnackbarSeverity("error");
            setSnackbarText("No Transaction Found");
            setErrorOpen(true);
            setShowDataGrid(false);
            return;
          }
        } catch (error) {
          setsnackbarSeverity("error");
          setSnackbarText(error);
          setErrorOpen(true);
        } finally {
          setIsLoading(false); // Set loading state to false at the end
        }
      };
      fetchTransactionData();
    }
  }, [jobId, activityId]); // Dependency array to trigger this when jobId or activityId changes

  // useEffect to update grid data and fetch related PDF details once transaction data is available
  useEffect(() => {
    const updateCurrentData = async () => {
      if (transactionData) {
        setGridData(transactionData); // Set grid data to transaction data
        const pdfDetails = async () => {
          const data = await logbookArchiveFooterDetailsApi(
            transactionData.jobId, // Get job ID from current transaction
            transactionData.activityId, // Get activity ID from current transaction
          );
          if (!data) {
            setsnackbarSeverity("error");
            setSnackbarText("Error fatching details");
            setErrorOpen(true); // Show Snackbar
            return;
          } else {
            setActivityName(data.activityName ? data.activityName : "NA"); // Set activity name
            setAssetName(data.assetName ? data.assetName : "NA"); // Set asset name
            setTaskName(data.taskName ? data.taskName : "NA"); // Set task name

            setJobName(data.jobName ? data.jobName : "NA"); // Set job name
            setPerformer(data.performer ? data.performer : "NA"); // Set perfoemer name
          }
        };
        pdfDetails(); // Call function to get PDF details
      }
    };
    updateCurrentData(); // Call the function to update current data
  }, [transactionData]); // Dependency array to trigger this when transactionData changes

  const forminfoByformNameAndVersion = async (transactionData) => {
    // This function fetches form info by name and version
    const data = await forminfoByformNameAndVersionApi(
      transactionData.formName,
      transactionData.formversion,
    );
    if (data === null) {
      // If no data, set to "NA"
      setFormatId("NA");
      setDocumentId("NA");
    } else {
      // Otherwise, set the format ID and document ID
      setFormatId(data?.formatId);
      setDocumentId(data?.documentId);
    }
  };

  // Function to handle exporting the logbook data as a PDF
  const handleExportPDF = async () => {
    try {
      // Fetch PDF data from the API using form name and version
      const response = await singlePdfDownloadApi(
        gridData.formName,
        gridData.formversion,
        gridData.activityId,
        gridData.jobId,
      );

      // Generate a custom filename for the downloaded PDF
      const fileName = generateFilename(gridData.formName);
      const blob = new Blob([response.data], { type: "application/pdf" }); // Create a Blob object for the PDF data
      const url = window.URL.createObjectURL(blob); // Create a URL for the Blob
      const link = document.createElement("a"); // Create a link element for downloading the file
      link.href = url;

      // Set the download attribute with the generated filename
      link.setAttribute("download", fileName);
      document.body.appendChild(link); // Append the link to the document
      link.click(); // Programmatically click the link to start download

      window.URL.revokeObjectURL(url); // Revoke the object URL after download
      document.body.removeChild(link); // Remove the link element from the document
    } catch (error) {
      setsnackbarSeverity("error");
      setSnackbarText("Error downloading PDF : ", error);
      setErrorOpen(true); // Show Snackbar
    }
  };

  const handleClose = (event, reason) => {
    // This function hides the (Snackbar) error message when we click on it.
    if (reason === "clickaway") {
      // If we clicked away, do nothing.
      return;
    }
    setErrorOpen(false); // Otherwise, hide (Snackbar) the error message.
  };

  // Function to generate a unique filename for the PDF
  const generateFilename = (formName) => {
    const todaysDate = new Date(); // Get today's date
    const formattedDate = formatDateForMSSQL(todaysDate); // Format the date for SQL server

    // Format the current time (hour, minute, and second)
    const formattedHour = todaysDate.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
    });
    const formattedMinute = todaysDate.toLocaleTimeString("en-US", {
      hour12: false,
      minute: "2-digit",
    });
    const formattedSecond = todaysDate.toLocaleTimeString("en-US", {
      hour12: false,
      second: "2-digit",
    });

    // Combine hour, minute, and second into a time string
    const formattedTime = `${formattedHour}:${formattedMinute}:${formattedSecond}`;

    // Replace spaces in the form name with underscores
    const frmName = formName.replace(/ /g, "_");

    // Return a filename in the format: "FormName-2024-10-12-10:30:45.pdf"
    return `${frmName}-${formattedDate}-${formattedTime}.pdf`;
  };

  // Function to format a date into a string compatible with SQL Server
  const formatDateForMSSQL = (date) => {
    const year = date.getFullYear(); // Get the full year
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month and pad with zero if necessary
    const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with zero if necessary
    const formattedDate = `${year}-${month}-${day}`; // Format as "YYYY-MM-DD"
    return formattedDate;
  };

  return (
    <div>
      {showDataGrid && (
        <>
          <div>
            {gridData && (
              <>
                {/* Render the LogbookReportViewComponent with necessary props */}
                <LogbookReportViewComponent
                  gridData={gridData} // Pass the current logbook data
                  formatId={formatId} // Additional props
                  documentId={documentId}
                  isLoading={isLoading} // Show loading state
                  tenentUserData={tenentUserData} // Pass tenant user data
                  taskName={taskName}
                  activityName={activityName}
                  assetName={assetName}
                  jobName={jobName}
                  performer={performer}
                  handleExportPDF={handleExportPDF} // PDF export handler
                />
              </>
            )}
          </div>
        </>
      )}
      {/* Display error message if no transaction data is found */}
      {error && <Chip label={<h3>No Transaction Found</h3>}></Chip>}
      <Snackbar
        open={errorOpen} // Open state of the snackbar
        autoHideDuration={3000} // Time to hide automatically
        onClose={handleClose} // Function to call on close
        TransitionComponent={Slide} // Transition effect
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Position of the snackbar
      >
        <Alert
          onClose={handleClose} // Function to call on close
          severity={snackbarSeverity} // Type of alert (error, success, etc.)
          variant="filled" // Filled variant of the alert
          sx={{ width: "100%" }} // Full width of the alert
        >
          {snackbarText}
          {/* Message to display */}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LViewWithProps;
