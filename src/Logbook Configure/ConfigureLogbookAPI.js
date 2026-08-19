import axios from "axios";
import { getCurrentUser } from "../UserModuleUpdated/helper";
import { getTenantID } from "../UserModuleUpdated/UsermoduleApi";

export const getFormDetailbyFormName = async (formName) => {
    // !need to import later on
    try {
      const tenantId = getTenantID() // Retrieve the tenant ID
    //   const loggedInuser = getCurrentUser(); // Get the current logged-in user
    //  console.log("link : ",`${process.env.REACT_APP_LOGBOOK}/logbook/formDetails/${tenantId}?formName=${formName}`)
      const response = await axios.get(
        `${process.env.REACT_APP_LOGBOOK}/logbook/formDetails/${tenantId}?formName=${formName}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Set the authorization header
          },
        }
      );
    //   console.log("Response data : ",response)
      if (response.data) {
        // console.log("ConnectionList  : ", response.data); // Log the fetched connection list
        return response.data; // Return the connection list
      }
    } catch (error) {
      console.error("Error fetching Form details by the Name:", error); // Log any errors that occur
      // return null;
    }
  };

  
 export const saveLogbook = async (datalocal,isUpdate) => {
    // const file = new FormData();
    // file.append("file", invfile);
    const tenantId = getTenantID();
    console.log(
      "link save form : ",
      `${process.env.REACT_APP_LOGBOOK}/logbook/saveForm/${tenantId}?isUpdate=${isUpdate}`
    );
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_LOGBOOK}/logbook/saveForm/${tenantId}?isUpdate=${isUpdate}`,
        datalocal,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // const sheetList = Object.keys(response.data);
      // setAllSheet(response.data);
      // setSheetList(sheetList); // Set the sheet list from response
      console.log("Save API Response : ", response.data);
      // console.log("Keys : ", sheetList);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  export const updateFormActiveStatus = async (datalocal,isDeactivateOtherVersion) => {
    // const file = new FormData();
    // file.append("file", invfile);
    const tenantId = getTenantID();
    console.log(
      "link save form : ",
      `${process.env.REACT_APP_LOGBOOK}/logbook/updateStatus/${tenantId}?isDeactivateOtherVersion=${isDeactivateOtherVersion}`
    );
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_LOGBOOK}/logbook/updateStatus/${tenantId}?isDeactivateOtherVersion=${isDeactivateOtherVersion}`,
        datalocal,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // const sheetList = Object.keys(response.data);
      // setAllSheet(response.data);
      // setSheetList(sheetList); // Set the sheet list from response
      console.log("Save API Response : ", response.data);
      // console.log("Keys : ", sheetList);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };