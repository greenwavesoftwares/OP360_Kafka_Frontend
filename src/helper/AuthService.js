// Import necessary libraries
import axios from "axios"; // Library to make HTTP requests
import AES from "crypto-js/aes"; // Library for encrypting and decrypting data
import Utf8 from "crypto-js/enc-utf8"; // Library to handle string encoding
import { getTenantID } from "../UserModuleUpdated/UsermoduleApi";
import { unSubscribe } from "../pwaServices/notificationService";

// Define the API endpoints for authentication and user module
const AUTH_API = process.env.REACT_APP_AUTHSERVICE; // Auth service URL
const USERMODULE_API = process.env.REACT_APP_USERMODULE; // User module URL

// Secret key for encrypting and decrypting data
const secretKey = process.env.REACT_APP_SECRETKEY;

// Function to decrypt an encrypted token ID
export const decryptTokenId = (encryptedTokenId) => {
  // Check if there is no token to decrypt
  if (!encryptedTokenId) return; // If there's no token, do nothing

  // Decrypt the token using the secret key
  const decryptedBytes = AES.decrypt(encryptedTokenId, secretKey);
  const decrypted = decryptedBytes.toString(Utf8); // Convert decrypted data to string

  return decrypted; // Return the decrypted token
};

// Function to encrypt a token ID
export const encryptTokenId = (value) => {
  // Encrypt the provided value using the secret key
  const encrypted = AES.encrypt(value, secretKey).toString();
  return encrypted; // Return the encrypted value
};

// Function to log in a user
export const login = async (username, password, tenantId) => {
  // console.log("tenantId while login : ", tenantId); // Log the tenant ID for debugging

  try {
    // Send a POST request to the authentication service to log in
    const response = await axios.post(`${AUTH_API}/auth/signin`, {
      username, // Send the username
      password, // Send the password
      tenantId, // Send the tenant ID
    });

    // Check if the response indicates a successful login
    if (response.status === 200) {
      const res = response.data; // Get the response data

      // Encrypt the tenant ID and username for storage
      const encryptedTenantId = AES.encrypt(res.tenantId, secretKey).toString();
      const encryptedUserName = AES.encrypt(username, secretKey).toString();

      // Store the token and encrypted values in session storage
      await localStorage.setItem("token", res.token); // Save the token
      await localStorage.setItem(
        process.env.REACT_APP_TENANTID,
        encryptedTenantId, // Save the encrypted tenant ID
      );
      await localStorage.setItem(
        process.env.REACT_APP_USERID,
        encryptedUserName, // Save the encrypted username
      );

      return res.user; // Return the user data
    } else {
      throw new Error("Failed to login"); // Throw an error if login fails
    }
  } catch (error) {
    console.error("Login error:", error); // Log the error for debugging
    return null; // Return null if there's an error
  }
};

//// Function to log out a user
// export const logout = async () => {
//   try {
//     const savedTenant = localStorage.getItem("savedTenant");

//     const userID = decryptTokenId(
//       localStorage.getItem(process.env.REACT_APP_USERID),
//     );

//     const tenantId = decryptTokenId(
//       localStorage.getItem(process.env.REACT_APP_TENANTID),
//     );

//     const subscription = await unSubscribe();

//     const deviceInfo = {
//       userAgent: navigator.userAgent,
//       platform: navigator.platform,
//       language: navigator.language,
//     };

//     const response = await fetch(`${AUTH_API}/auth/logout`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         userId: userID,
//         tenantId: tenantId,
//         subscription: subscription, // can be null
//         deviceInfo: deviceInfo,
//       }),
//     });

//     if (response.status === 200) {
//       await localStorage.clear();
//       if (savedTenant) {
//         await localStorage.setItem("savedTenant", savedTenant);
//       }
//       return true;
//     }

//     return false;
//   } catch (err) {
//     console.error("Logout error:", err);
//   } finally {
//     // window.location.href = "/";
//   }
// };

export const logout = async () => {
  // Read BOTH keys before clearing
  const savedTenant = localStorage.getItem("savedTenant");
  const tenantEnvKey = process.env.REACT_APP_TENANTID;
  const encryptedTenant = localStorage.getItem(tenantEnvKey);

  const clearStorage = () => {
    localStorage.clear();
    // Restore both if they existed
    if (savedTenant) localStorage.setItem("savedTenant", savedTenant);
    if (encryptedTenant) localStorage.setItem(tenantEnvKey, encryptedTenant);
  };

  try {
    const userID = decryptTokenId(
      localStorage.getItem(process.env.REACT_APP_USERID),
    );
    const tenantId = decryptTokenId(
      localStorage.getItem(process.env.REACT_APP_TENANTID),
    );

    // Non-blocking — won't prevent logout if it fails/times out
    let subscription = null;
    try {
      subscription = await unSubscribe();
    } catch (err) {
      console.warn("unSubscribe failed during logout (ignored):", err.message);
    }

    const deviceInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
    };

    if (navigator.onLine) {
      try {
        const response = await Promise.race([
          fetch(`${AUTH_API}/auth/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: userID,
              tenantId: tenantId,
              subscription: subscription,
              deviceInfo: deviceInfo,
            }),
          }),
          // Timeout so logout isn't stuck if localhost backend is slow/down
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("Logout request timed out")),
              4000,
            ),
          ),
        ]);

        if (!response.ok) {
          console.warn(
            `Server logout returned ${response.status}, clearing local storage anyway`,
          );
        }
      } catch (err) {
        console.warn(
          "Server logout failed (clearing local anyway):",
          err.message,
        );
      }
    } else {
      console.warn("Offline: skipping server logout call");
    }
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    // ALWAYS clear storage — this must run no matter what
    clearStorage();
  }

  return true;
};

// Function to check if a user is authenticated (logged in)
export const isAuthenticated = () => {
  const token = localStorage.getItem("token"); // Get the token from session storage
  return !!token; // Return true if there's a token, false otherwise
};

// Function to extend the token expiration time
export const extendTokenExpiration = async () => {
  console.log("extendTokenExpiration");
  const tenantId = getTenantID(); //get Tenant Id information
  try {
    const token = localStorage.getItem("token"); // Get the token from session storage

    // If there's no token, clear session storage and redirect to home
    if (!token || !tenantId) {
      // console.log('No token found ','tenantId',tenantId);

      // if (tenantId) window.location.href = `/`;
      // else window.location.href = "/";
      window.location.href = "/";

      const savedTenant = localStorage.getItem("savedTenant");
      localStorage.clear();
      if (savedTenant) localStorage.setItem("savedTenant", savedTenant);

      return;
    }

    // Send a GET request to extend the token expiration
    const response = await axios.get(`${AUTH_API}/auth/extendTokenExpiration`, {
      params: { token }, // Include the token in the request
    });

    // If the response indicates forbidden access, clear session and redirect
    if (response.status === 403) {
      window.location.href = `/`;

      const savedTenant = localStorage.getItem("savedTenant");
      localStorage.clear();
      if (savedTenant) localStorage.setItem("savedTenant", savedTenant);

      // window.location.href = "/";
      return;
    }

    // If there's no data in the response, redirect to home
    if (!response.data) {
      window.location.href = `/`;
      return;
    }

    const newToken = response.data; // Get the new token from the response
    localStorage.setItem("token", newToken); // Save the new token in session storage
  } catch (error) {
    console.error(error); // Log the error for debugging
    window.location.href = `/`; // Redirect to home on error
  }
};

// Function to update the user's password
export const passwordUpdateHandler = async (
  userId,
  oldPassword,
  newPassword,
  tenantId,
) => {
  try {
    // Send a GET request to change the user's password
    const response = await axios.get(
      `${USERMODULE_API}/usermodule/changepassworduserdashboard`,
      {
        params: {
          userId, // Include user ID
          oldPassword, // Include old password
          newPassword, // Include new password
          tenantId, // Include tenant ID
        },
        headers: {
          "Content-Type": "application/json", // Set the content type
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token for authorization
        },
      },
    );

    return response.data; // Return the response data
  } catch (error) {
    console.error("Error updating password:", error); // Log the error for debugging
  }
  return null; // Return null if there's an error
};

export const userWiseTenant = async (userId) => {
  try {
    // console.log("updateLastLogin() called : ");
    const response = await axios.get(`${AUTH_API}/auth/userWiseTenant`, {
      params: {
        userId: userId,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error in userWiseTenant:", error);
    return null;
  }
};
