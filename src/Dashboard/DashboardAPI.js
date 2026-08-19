import { decryptTokenId } from "../helper/AuthService"; // Importing a utility function for decrypting token

// Function to format a Date object into a string (YYYY-MM-DD)
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based, hence the +1
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // Returning formatted date string
};

// Function to retrieve and decrypt the tenant ID from session storage
const getTenantID = () => {
  const env_tenant = process.env.REACT_APP_TENANTID; // Retrieving tenant ID from environment variables
  const encryptedTenant = localStorage.getItem(env_tenant); // Retrieving encrypted tenant ID from session storage
  const tenant = decryptTokenId(encryptedTenant); // Decrypting the tenant ID
  console.log("Current Tenant ID : ", tenant); // Logging the current tenant ID
  return tenant; // Returning the tenant ID
};

// Function to fetch data from a given URL
const fetchData = async (url) => {
  return await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json", // Accepting JSON response
      // Authorization: `Bearer ${token}`, // (Commented out) Token for authorization if needed
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Token retrieved from session storage
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok"); // Handling network errors
      }
      return response.json(); // Returning parsed JSON response
    })
    .catch((error) => {
      console.error("Error fetching data:", error); // Logging any errors
    });
};

// Function to fetch logbooks and assets based on the provided date range and grouping criteria
export const fetchLogbooksAndAssets = (fromDate, toDate, groupBy) => {
  const tenantId = getTenantID(); // Retrieve the tenant ID
  const formattedFromDate = formatDate(fromDate); // Format the start date
  const formattedToDate = formatDate(toDate); // Format the end date

  console.log(
    "asset : ",
    `${process.env.REACT_APP_DASHBOARDAPI}/dashboard/assests/${tenantId}?fromDate=${formattedFromDate}&toDate=${formattedToDate}`
  );

  // Fetching logbooks and assets concurrently
  const logbooksPromise = fetchData(
    `${process.env.REACT_APP_DASHBOARDAPI}/dashboard/logbooks/${tenantId}?fromDate=${formattedFromDate}&toDate=${formattedToDate}`
  );
  const assetsPromise = fetchData(
    `${process.env.REACT_APP_DASHBOARDAPI}/dashboard/assests/${tenantId}?fromDate=${formattedFromDate}&toDate=${formattedToDate}`
  );

  let tabularDataPromises = []; // Array to hold tabular data promises
  let cardDataPromises = []; // Array to hold card data promises

  // Fetching all jobs for card display
  cardDataPromises.push(
    fetchData(
      `${process.env.REACT_APP_JOBAPI}/jobs/allJobsForCard/${tenantId}?fromDate=${formattedFromDate}&toDate=${formattedToDate}`
    )
  );

  // Fetching data based on the specified grouping criteria
  if (groupBy === "Task") {
    tabularDataPromises.push(
      fetchData(
        `${process.env.REACT_APP_JOBAPI}/jobs/allJobsForCard/${tenantId}?fromDate=${formattedFromDate}&toDate=${formattedToDate}`
      )
    );
  } else if (groupBy === "Tag") {
    tabularDataPromises.push(
      fetchData(
        `${process.env.REACT_APP_JOBAPI}/jobs/allJobsForCard/${tenantId}?fromDate=${formattedFromDate}&toDate=${formattedToDate}`
      )
    );
  } else if (groupBy === "User") {
    tabularDataPromises.push(
      fetchData(
        `${process.env.REACT_APP_JOBAPI}/jobs/allJobsForCard/${tenantId}?fromDate=${formattedFromDate}&toDate=${formattedToDate}`
      )
    );
  } else if (groupBy === "Asset") {
    tabularDataPromises.push(
      fetchData(
        `${process.env.REACT_APP_JOBAPI}/jobs/allJobsForCard/${tenantId}?fromDate=${formattedFromDate}&toDate=${formattedToDate}`
      )
    );
  }

  // Returning promises for all fetch operations
  return Promise.all([
    logbooksPromise,
    assetsPromise,
    ...tabularDataPromises,
    ...cardDataPromises,
  ]);
};
