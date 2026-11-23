// Import a function to help decrypt the token from session storage
import { decryptTokenId } from "../helper/AuthService";

// Get some important URLs from environment variables
const UserGroup = process.env.REACT_APP_USERGROUPS; // URL for user groups
const Logbook = process.env.REACT_APP_LOGBOOK; // URL for the logbook
const AUTH_API = process.env.REACT_APP_AUTHSERVICE; // Auth service URL

// Function to fetch plant data from the server
export const fetchPlantDataApi = async () => {
  console.log("Getting plant list from:", `${UserGroup}/plants/`); // Show where we're fetching from
  try {
    // Make a request to get plant data
    const response = await fetch(`${UserGroup}/plants/`, {
      method: "GET", // We're getting information
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Include our token to access the data
        "Content-Type": "application/json", // We're asking for JSON data
      },
    });

    // If the response status is 403, it means we don't have permission
    if (response.status === 403) {
      return; // Just return if we can't access the data
    }

    // Convert the response to JSON format
    const data = await response.json();
    console.log("Plant details received:", data); // Show the plant details we received
    return data; // Return the plant data
  } catch (error) {
    console.log("Error while fetching plant data:", error); // Log any errors
  }
};

// Function to sign up a new user
export const tenantSignUpApi = async (formData) => {
  try {
    console.log("Signing up user at:", `${UserGroup}/users/user/signup`); // Show where we're signing up
    console.log("User data being submitted:", formData); // Show the data we're sending
    const response = await fetch(`${UserGroup}/users/user/signup`, {
      method: "POST", // We're sending data
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Include our token for access
        "Content-Type": "application/json", // We're sending JSON data
      },
      body: JSON.stringify(formData), // Convert the data to JSON format
    });
    return response; // Return the response from the server
  } catch (error) {
    console.error("Error during signup:", error); // Log any errors
  }
};

export const loginCheckBeforeTenant = async () => {
  try {
    console.log(
      "Signing up user at:",
      `${UserGroup}/users/user/${localStorage.getItem("savedTenant")}`,
    ); // Show where we're signing up
    const response = await fetch(
      `${UserGroup}/users/user/${localStorage.getItem("savedTenant")}`,
      {
        method: "GET", // We're sending data
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include our token for access
          "Content-Type": "application/json", // We're sending JSON data
        },
      },
    );
    if (response.ok) {
      console.log("response --> ", response);
      //response from the server
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error during loginCheckBeforeTenant page:", error); // Log any errors
  }
};

// Function to get user data based on a tenant ID
export const getUserByTenantIdApi = async () => {
  try {
    // Create the URL to fetch user data using a decrypted tenant ID
    const url = `${Logbook}/logbook/user/${decryptTokenId(
      localStorage.getItem(process.env.REACT_APP_TENANTID), // Get and decrypt the tenant ID from session storage
    )}`;
    console.log("Fetching user data from:", url); // Show the URL we're fetching from

    // Make a request to get user data
    const response = await fetch(url, {
      method: "GET", // We're getting information
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Include our token for access
        "Content-Type": "application/json", // We're asking for JSON data
      },
    });

    // Check if the response is okay (status 200)
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`); // Throw an error if not okay
    }

    // Convert the response to JSON format
    const data = await response.json();
    console.log("User details received:", data); // Show the user details we received
    return data; // Return the user data
  } catch (error) {
    console.error("Error fetching user data:", error); // Log any errors
  }
};

// Function to delete a plant by its ID
export const deletePlantByPlantIdApi = async (selectedplantId) => {
  console.log("Deleting plant with ID:", selectedplantId); // Show which plant we're deleting
  try {
    // Make a request to delete the plant
    const response = await fetch(
      `${UserGroup}/plants/plant?plantId=${selectedplantId}`, // Use the plant ID in the URL
      {
        method: "DELETE", // We're deleting something
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include our token for access
          "Content-Type": "application/json", // We're sending JSON data
        },
      },
    );

    // Return true if the response is okay (successful deletion)
    const data = await response.ok;
    return data; // Return the result of the deletion
  } catch (error) {
    console.log("Error while deleting plant:", error); // Log any errors
  }
};

// Function to post new plant data to the server
export const postPlantDataApi = async (newPlant) => {
  console.log("Posting new plant data:", newPlant); // Show the new plant data we're sending
  try {
    // Make a request to add the new plant
    const response = await fetch(`${UserGroup}/plants/plant`, {
      method: "POST", // We're sending data
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Include our token for access
        "Content-Type": "application/json", // We're sending JSON data
      },
      body: JSON.stringify(newPlant), // Convert the new plant data to JSON format
    });
    return response; // Return the response from the server
  } catch (error) {
    console.log("Error while posting plant data:", error); // Log any errors
  }
};

export const checkTenantExpiration = async (tenant) => {
  try {
    console.log(
      "Signing up user at:",
      `${AUTH_API}/auth/checkTenantExpiration/${tenant}`,
    ); // Show where we're signing up
    const response = await fetch(
      `${AUTH_API}/auth/checkTenantExpiration/${tenant}`,
      {
        method: "GET", // We're getting data
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include our token for access
          "Content-Type": "application/json", // We're getting JSON data
        },
      },
    );
    if (response.ok) {
      const data = await response.json();
      console.log("Tenant expiration response --> ", data);
      //response from the server
      // Parse expiryDate (backend sends dd/MM/yyyy format)
      const [day, month, year] = data.expiryDate.split("/");
      const expiryDate = new Date(`${year}-${month}-${day}`); // yyyy-MM-dd
      const gracePeriod = parseInt(data.gracePeriod, 10);

      // Today without time
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // expiryDate + gracePeriod
      const graceExpiry = new Date(expiryDate);
      graceExpiry.setDate(graceExpiry.getDate() + gracePeriod);

      console.log("expiryDate :: ", expiryDate);
      console.log("gracePeriod :: ", gracePeriod);
      console.log("graceExpiry :: ", graceExpiry);

      // Determine status
      let status = 1; // default valid
      if (expiryDate < today) {
        if (graceExpiry < today) {
          console.log("return 3 :::: expired + grace over");
          status = 3; // expired + grace over
        } else {
          console.log("return 2 :::: expired but within grace");
          status = 2; // expired but within grace
        }
      }
      return {
        status,
        expiryDate,
        graceExpiry,
      };
    }
    return {
      status: 0,
      expiryDate: null,
      graceExpiry: null,
    };
  } catch (error) {
    console.error("Error during loginCheckBeforeTenant page:", error); // Log any errors
    return {
      status: 0,
      expiryDate: null,
      graceExpiry: null,
    };
  }
};
