import axios from "axios";
import { decryptTokenId } from "../helper/AuthService";

const userGroup = process.env.REACT_APP_USERGROUPS;

export const getMailNotificationConfig = async () => {
  try {
    // Making a GET request to the userGroup API to fetch Mail Notifications
    const response = await axios.get(
      `${userGroup}/users/mailNotificationMaster/${decryptTokenId(localStorage.getItem(process.env.REACT_APP_TENANTID))}`,
      {
        headers: {
          // Sending the user's token for authorization
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    // console.log("data : ", response.data); // Log the data received
    return response.data; // Return the Mail Notifications
  } catch (error) {
    console.log(error); // Log any error that occurs
  }
};

export const saveMailNotificationConfig = async (mailNotificationConfig) => {
  try {
    // Making a POST request to the userGroup API to Update or Insert Mail Notifications
    const response = await axios.post(
      `${userGroup}/users/mailNotificationMaster/${decryptTokenId(localStorage.getItem(process.env.REACT_APP_TENANTID))}`,
      mailNotificationConfig,
      {
        headers: {
          // Sending the user's token for authorization
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    console.log("data : ", response.data); // Log the data received
    return response.data; // Return the Mail Notifications
  } catch (error) {
    console.log(error); // Log any error that occurs
  }
};

export const loginCheckBeforeTenant = async () => {
  try {
    console.log(
      "Signing up user at:",
      `${userGroup}/users/user/${localStorage.getItem("savedTenant")}`,
    ); // Show where we're signing up
    const response = await fetch(
      `${userGroup}/users/user/${localStorage.getItem("savedTenant")}`,
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
