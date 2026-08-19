// Importing axios library for making HTTP requests
import axios from "axios";

// Importing decryptTokenId function from AuthService helper
import { decryptTokenId } from "../helper/AuthService";

// Defining environment variables
const REACT_APP_TENANTID = process.env.REACT_APP_TENANTID;
const REACT_APP_USERID = process.env.REACT_APP_USERID;
const REACT_APP_USERGROUPS = process.env.REACT_APP_USERGROUPS;

// Function to get menu details
export async function getMenuDetails() {
  try {
    // Getting tenant and user IDs from session storage
    const tenant = localStorage.getItem(REACT_APP_TENANTID);
    const user = localStorage.getItem(REACT_APP_USERID);

    // Decrypting tenant and user IDs
    const tenantid = decryptTokenId(tenant);
    const userid = decryptTokenId(user);

    // Making GET request to get menu details
    const response = await axios.get(
      `${REACT_APP_USERGROUPS}/menu/${userid}/${tenantid}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("Error in menubar:", error);
  }
}
export async function fetchDashboardDetails(){
  try{
    
    const tenant = localStorage.getItem(REACT_APP_TENANTID);
    const tenantid = decryptTokenId(tenant);
    const response=await axios.get(
      `${REACT_APP_USERGROUPS}/menu/fetchDashboardDetails/${tenantid}`,
      {
        headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    )
    return response.data;
  }
  catch(e){
    console.error("Error in fetchDashboardDetails:",e)
  }
}
export async function fetchBadgeDetails(userid,groups,tenantId) {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_USERGROUPS}/menu/badge/${userid}/${groups}/${tenantId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return data
    } catch (err) {
      console.error("Failed to fetch badge details:", err);
    }
  };