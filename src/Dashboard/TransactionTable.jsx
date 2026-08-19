import React, { useState, useEffect } from "react"; // Importing React and hooks
import { DataTable } from "primereact/datatable"; // Importing DataTable component from PrimeReact
import { Column } from "primereact/column"; // Importing Column component for DataTable
import { decryptTokenId } from "../helper/AuthService"; // Importing a utility function for decrypting token

// TransactionTable component that fetches and displays transaction data in a table format
export default function TransactionTable({ jobId, activityId }) {
  const [data, setData] = useState([]); // State for storing transaction data
  const [loading, setLoading] = useState(true); // State for loading status

  // Effect to fetch transaction data when jobId or activityId changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tenantId = getTenantID(); // Retrieve the tenant ID
        console.log(
          "Transaction API : ",
          `${process.env.REACT_APP_DASHBOARDAPI}/dashboard/fetchTransaction/${tenantId}?jobId=${jobId}&activityId=${activityId}`
        );

        // Fetching transaction data from the API
        const response = await fetch(
          `${process.env.REACT_APP_DASHBOARDAPI}/dashboard/fetchTransaction/${tenantId}?jobId=${jobId}&activityId=${activityId}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              // Authorization: `Bearer ${token}`, // (Commented out) Token for authorization if needed
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Token retrieved from session storage
            },
          }
        );

        // Parsing JSON response
        const jsonData = await response.json();
        setData(jsonData); // Updating state with fetched data
        setLoading(false); // Setting loading to false
      } catch (error) {
        console.error("Error fetching data:", error); // Logging any errors
        setLoading(false); // Setting loading to false in case of an error
      }
    };

    fetchData(); // Calling the fetchData function
  }, [jobId, activityId]); // Dependency array to re-fetch data when jobId or activityId changes

  // Function to retrieve and decrypt the tenant ID from session storage
  const getTenantID = () => {
    const encryptedTenant = localStorage.getItem(
      process.env.REACT_APP_TENANTID
    ); // Retrieving encrypted tenant ID
    const tenant = decryptTokenId(encryptedTenant); // Decrypting the tenant ID
    console.log("Current Tenant ID : ", tenant); // Logging the current tenant ID
    return tenant; // Returning the tenant ID
  };

  // Loading state while fetching data
  if (loading) {
    return <div>Loading...</div>; // Loading message
  }

  return (
    <div className="datatable">
      {/* DataTable component displaying transaction data */}
      <DataTable
        showGridlines // Showing gridlines in the table
        value={data} // Data to be displayed
        removableSort // Allowing columns to be sorted
        className="UserInfoTableStyle dataTableStyle HeaderColor" // Custom styles
      >
        <Column sortable field="transactionid" header="Transaction ID" />{" "}
        {/* Column for Transaction ID */}
        <Column field="remarks" header="Remarks" /> {/* Column for Remarks */}
        <Column field="userRemaks" header="User Remarks" />{" "}
        {/* Column for User Remarks */}
      </DataTable>
    </div>
  );
}
