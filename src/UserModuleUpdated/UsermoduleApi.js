import axios from "axios";
import { decryptTokenId } from "../helper/AuthService";
import { getCurrentUser } from "./helper";

const User_API = process.env.REACT_APP_USERMODULE;
/**
 * Retrieves the tenant ID from session storage.
 * The tenant ID is first fetched as an encrypted string using the environment variable REACT_APP_TENANTID.
 * It is then decrypted using the decryptTokenId function before being returned.
 * Logs the environment tenant variable and the decrypted tenant ID for debugging purposes.
 * @returns {string} The decrypted tenant ID. If the tenant ID is not present in session storage, an empty string is returned.
 */

export const getTenantID = () => {
  const env_tenant = process.env.REACT_APP_TENANTID;
  // console.log("Tenant Varaible from env : ", env_tenant);
  const encryptedTenant = localStorage.getItem(env_tenant);
  if (encryptedTenant) {
    const tenant = decryptTokenId(encryptedTenant);
    // console.log("Current Tenant ID : ", tenant);
    return tenant;
  }
  return "";
};

/**
 * Retrieves all users for the current tenant ID.
 * @returns {Promise<Object[]>} A promise that resolves to an array of user objects.
 * The user objects contain the following properties:
 * - userId: The unique identifier of the user.
 * - firstName: The first name of the user.
 * - lastName: The last name of the user.
 * - email: The email address of the user.
 * - departmentId: The department ID of the user.
 * - departmentName: The department name of the user.
 * - groupIds: An array of group IDs the user belongs to.
 * - groupName: An array of group names the user belongs to.
 * - allotedPages: An array of page IDs the user has access to.
 * If an error occurs while fetching the users, the promise is rejected with an error object.
 */
export const fetchAllUsers = async (isExternal=false) => {
  try {
    // console.log("fetchAllUsers() called : ");
    const response = await axios.get(
      `${User_API}/usermodule/allusers/${getTenantID()}`,
      {
        headers: {
          ////Authorization: "Basic " + encoded,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    // console.log("Current Response for All Users : ", response);
    if (response.status === 200) {
      // console.log("Current response for All Users  : ", response.data);
      // let approverList=[];
      // response.data.forEach(user=>{if(
      //   user.allotedPages.includes("JobReviewer"))
      //   approverList.push(user.userId
      //     )})
      // console.log("Current response for All Approvers  : ",approverList)

      return isExternal?response.data:response.data.filter(user=>user.isGuest !== -1);
    }
  } catch (error) {
    // console.error("Error fetching Approver List:", error);
    // return null;
  }
};

/**
 * Retrieves all group details for the current tenant ID.
 * @returns {Promise<Object[]>} A promise that resolves to an array of group objects.
 * The group objects contain the following properties:
 * - groupId: The unique identifier of the group.
 * - groupName: The name of the group.
 * - description: The description of the group.
 * - groupType: The type of the group.
 * - usermodule: An array of user IDs that belong to the group.
 * If an error occurs while fetching the group details, the promise is rejected with an error object.
 */
export const getAllGroupDetails = async () => {
  // console.log("getAllGroupDetails() called ");
  try {
    const response = await axios.get(
      `${User_API}/usermodule/allgroups/${getTenantID()}`,
      {
        headers: {
          ////Authorization: "Basic " + encoded,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    // console.log("Current Response for getAllGroupDetails : ", response);
    if (response.status === 200) {
      // console.log("Current response for getAllGroupDetails  : ", response.data);
      // let approverList=[];
      // response.data.forEach(user=>{if(
      //   user.allotedPages.includes("JobReviewer"))
      //   approverList.push(user.userId
      //     )})
      // console.log("Current response for All Approvers  : ",approverList)

      return response.data;
    }
  } catch (error) {
    // console.error("Error fetching getAllGroupDetails:", error);
    // return null;
  }
};

/**
 * Retrieves all department details for the current tenant ID.
 * @returns {Promise<Object[]>} A promise that resolves to an array of department objects.
 * The department objects contain the following properties:
 * - departmentId: The unique identifier of the department.
 * - departmentName: The name of the department.
 * - description: The description of the department.
 * If an error occurs while fetching the department details, the promise is rejected with an error object.
 */
export const getAllDepartmentDetails = async () => {
  try {
    const response = await axios.get(
      `${User_API}/usermodule/alldepartments/${getTenantID()}`,
      {
        headers: {
          ////Authorization: "Basic " + encoded,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    // console.log("Current Response for All Departments : ", response);
    if (response.status === 200) {
      // console.log("Current response for All Departments  : ", response.data);
      // let approverList=[];
      // response.data.forEach(user=>{if(
      //   user.allotedPages.includes("JobReviewer"))
      //   approverList.push(user.userId
      //     )})
      // console.log("Current response for All Approvers  : ",approverList)

      return response.data;
    }
  } catch (error) {
    // console.error("Error fetching getAllDepartmentDetails:", error);
    // return null;
  }
};

/**
 * Retrieves all pages for the current tenant ID.
 * @returns {Promise<Object[]>} A promise that resolves to an array of page objects.
 * The page objects contain the following properties:
 * - pageId: The unique identifier of the page.
 * - pageName: The name of the page.
 * - description: The description of the page.
 * If an error occurs while fetching the page details, the promise is rejected with an error object.
 */

export const fetchAllPageDetails = async () => {
  try {
    const response = await axios.get(
      `${User_API}/usermodule/pages/${getTenantID()}`,
      {
        headers: {
          ////Authorization: "Basic " + encoded,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    // console.log("Current Response for All Pages : ", response);
    if (response.status === 200) {
      // console.log("Current response for All Pages  : ", response.data);
      // let approverList=[];
      // response.data.forEach(user=>{if(
      //   user.allotedPages.includes("JobReviewer"))
      //   approverList.push(user.userId
      //     )})
      // console.log("Current response for All Approvers  : ",approverList)

      return response.data;
    }
  } catch (error) {
    // console.error("Error fetching Pages List:", error);
    // return null;
  }
};

/**
 * Retrieves a map of all pages for the current tenant ID.
 * The API request is made using Axios and the data is returned as a promise.
 * If there is an error, it is logged and the function returns null.
 * @returns {Promise<Object[]>} A promise that resolves to an array of page map objects.
 * The page map objects contain details about pages and their associations.
 */
export const fetchAllPageDetailsMap = async () => {
  try {
    const response = await axios.get(
      `${User_API}/usermodule/pagesMap/${getTenantID()}`,
      {
        headers: {
          ////Authorization: "Basic " + encoded,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    // console.log("Current Response for All Pages map : ", response);
    if (response.status === 200) {
      // console.log("Current response for All Pages map : ", response.data);
      // let approverList=[];
      // response.data.forEach(user=>{if(
      //   user.allotedPages.includes("JobReviewer"))
      //   approverList.push(user.userId
      //     )})
      // console.log("Current response for All Approvers  : ",approverList)

      return response.data;
    }
  } catch (error) {
    // console.error("Error fetching Pages List map:", error);
    // return null;
  }
};

/**
 * Checks if a group exists for the current tenant ID.
 * The API request is made using Axios and the data is returned as a promise.
 * If there is an error, it is logged and the function returns null.
 * @param {string} groupId - The unique identifier of the group to be checked.
 * @returns {Promise<Object[]>} A promise that resolves to an array of group objects.
 * The group objects contain details about groups and their associations.
 */

export const checkGroupAssociation = async (groupId,groupName) => {
  try {
    // console.log('URL : ',`${User_API}/usermodule/checkgroupexists/${getTenantID()}?groupId=${groupId}`)
    const response = await axios.get(
      `${User_API}/usermodule/groups/${groupId}/${groupName}/${getTenantID()}`,
      {
        headers: {
          ////Authorization: "Basic " + encoded,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        // params:{
        //   groupId:groupId
        // }
      }
    );
    // console.log(" Response for Group Association ?  : ", response);
    if (response.status === 200) {
      // console.log("Data Response for Group Association  : ", response.data);
      // let approverList=[];
      // response.data.forEach(user=>{if(
      //   user.allotedPages.includes("JobReviewer"))
      //   approverList.push(user.userId
      //     )})
      // console.log("Current response for All Approvers  : ",approverList)
      console.log(response.data)
      // if(response.data.length>0)
      // {
      return response.data.length > 0 ? response.data:false;//Blank String means there is no reason and the group can be modified
      // }
    }
  } catch (error) {
    // console.error("Error fetching Group Association:", error);
    // return null;
  }
};

/**
 * Checks if a department exists for the current tenant ID.
 * The API request is made using Axios and the data is returned as a promise.
 * If there is an error, it is logged and the function returns null.
 * @param {string} deptId - The unique identifier of the department to be checked.
 * @returns {Promise<Object[]>} A promise that resolves to an array of department objects.
 * The department objects contain details about departments and their associations.
 */
export const checkDepartmentAssociation = async (deptId) => {
  try {
    const response = await axios.get(
      `${User_API}/usermodule/departments/${deptId}/${getTenantID()}`,
      {
        headers: {
          ////Authorization: "Basic " + encoded,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        // params:{
        //   deptId:deptId
        // }
      }
    );
    // console.log(" Response for Department association ?  : ", response);
    if (response.status === 200) {
      console.log(
        "Data Response for Department Association  : ",
        response.data
      );
      // let approverList=[];
      // response.data.forEach(user=>{if(
      //   user.allotedPages.includes("JobReviewer"))
      //   approverList.push(user.userId
      //     )})
      // console.log("Current response for All Approvers  : ",approverList)

      return response.data.length>0 ? response.data:false;//Blank String means there is no reason and the department can be modified
    }
  } catch (error) {
    // console.error("Error fetching Department Association:", error);
    // return null;
  }
};

/**
 * Retrieves user details for the given user ID and current tenant ID.
 * The API request is made using Axios and the data is returned as a promise.
 * If there is an error, it is logged and the function returns null.
 * @param {string} userId - The unique identifier of the user to be retrieved.
 * @returns {Promise<Object[]>} A promise that resolves to an array of user objects.
 * The user objects contain the following properties:
 * - userId: The unique identifier of the user.
 * - firstName: The first name of the user.
 * - lastName: The last name of the user.
 * - email: The email address of the user.
 * - departmentId: The department ID of the user.
 * - departmentName: The department name of the user.
 * - groupIds: An array of group IDs the user belongs to.
 * - groupName: An array of group names the user belongs to.
 * - allotedPages: An array of page IDs the user has access to.
 */
export const getUserDetailsByUserID = async (userId,isExternal=false) => {
  try {
    const response = await axios.get(
      `${User_API}/usermodule/${userId}/${getTenantID()}`,
      {
        headers: {
          ////Authorization: "Basic " + encoded,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    // console.log(" Response for User  : ", response);
    if (response.status === 200) {
      // console.log("User Details  : ", response.data);
      // let approverList=[];
      // response.data.forEach(user=>{if(
      //   user.allotedPages.includes("JobReviewer"))
      //   approverList.push(user.userId
      //     )})
      // console.log("Current response for All Approvers  : ",approverList)
      if(!isExternal && response.data.isGuest === -1){
        return null
      }
      return response.data;
    }
  } catch (error) {
    // console.error("Error fetching User Details:", error);
    // return null;
  }
};

/**
 * Retrieves all transaction logs for the given user ID and current tenant ID.
 * The API request is made using Axios and the data is returned as a promise.
 * If there is an error, it is logged and the function returns null.
 * @param {string} userId The unique identifier of the user.
 * @returns {Promise<Object[]>} A promise that resolves to an array of transaction log objects.
 * The transaction log objects contain details about the transactions.
 */
export const getTransactionsDataByUserId = async (userId) => {
  try {
    const tenantId = getTenantID();
    const response = await axios.get(
      `${User_API}/usermodule/logs/${userId}/${getTenantID()}`,
      {
        headers: {
          ////Authorization: "Basic " + encoded,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        // params:{
        //   userId:userId,
        //   tenantId:tenantId
        // }
      }
    );
    // console.log(" Response for Transaction  : ", response);
    if (response.status === 200) {
      // console.log("User Transaction Details  : ", response.data);
      // let approverList=[];
      // response.data.forEach(user=>{if(
      //   user.allotedPages.includes("JobReviewer"))
      //   approverList.push(user.userId
      //     )})
      // console.log("Current response for All Approvers  : ",approverList)

      return response.data;
    }
  } catch (error) {
    // console.error("Error fetching User Transaction Details:", error);
    // return null;
  }
};

/**
 * Saves a user to the User Module database.
 * The API request is made using Axios and the data is returned as a promise.
 * If there is an error, it is logged and the function returns null.
 * @param {Object} userDetails The user details object
 * @returns {Promise<Object>} A promise that resolves to an array of user objects.
 * The user objects contain the following properties:
 * - userId: The unique identifier of the user.
 * - firstName: The first name of the user.
 * - lastName: The last name of the user.
 * - email: The email address of the user.
 * - departmentId: The department ID of the user.
 * - departmentName: The department name of the user.
 * - groupIds: An array of group IDs the user belongs to.
 * - groupName: An array of group names the user belongs to.
 * - allotedPages: An array of page IDs the user has access to.
 */

export const saveUser = async (userDetails) => {
  try {
    // const userDetails1={...userDetails,active:"true"}
    // console.log('UserDetails : ',userDetails1)
    const response = await axios.post(`${User_API}/usermodule/`, userDetails, {
      headers: {
        ////Authorization: "Basic " + encoded,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    // console.log("Current Response for saveUser : ", response);
    if (response.status === 200) {
      // console.log("Current response for All Users  : ",response.data)
      // let approverList=[];
      // response.data.forEach(user=>{if(
      //   user.allotedPages.includes("JobReviewer"))
      //   approverList.push(user.userId
      //     )})
      // console.log("Current response for All Approvers  : ",approverList)
      // console.log("User has been updated or created");

      return true;
    }
  } catch (error) {
    // console.error("Error fetching saveUser:", error);
    // return null;
  }
};

/**
 * Creates a new group with the given details.
 * @param {Object} group - The group details to be saved.
 * @returns {Promise<Boolean>} A promise that resolves to true if the group is created successfully.
 */
export const saveNewGroup = async (group) => {
  try {
    const response = await axios.post(`${User_API}/usermodule/groups`, group, {
      headers: {
        ////Authorization: "Basic " + encoded,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    // console.log("Current Response for saveNewGroup : ", response);
    if (response.status === 200) {
      // console.log("Current response for All usermodule  : ",response.data)
      // let approverList=[];
      // response.data.forEach(user=>{if(
      //   user.allotedPages.includes("JobReviewer"))
      //   approverList.push(user.userId
      //     )})
      // console.log("Current response for All Approvers  : ",approverList)
      // console.log("saveNewGroup success");

      return true;
    }
  } catch (error) {
    // console.error("Error in saveNewGroup:", error);
    // return null;
  }
};

/**
 * Creates a new department with the given details.
 * @param {Object} department - The department details to be saved.
 * @returns {Promise<Boolean>} A promise that resolves to true if the department is created successfully.
 */
export const saveNewDepartment = async (department) => {
  try {
    const response = await axios.post(
      `${User_API}/usermodule/departments`,
      department,
      {
        headers: {
          ////Authorization: "Basic " + encoded,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    // console.log("Current Response for saveNewDepartment : ", response);
    if (response.status === 200) {
      // console.log("Current response for All Users  : ",response.data)
      // let approverList=[];
      // response.data.forEach(user=>{if(
      //   user.allotedPages.includes("JobReviewer"))
      //   approverList.push(user.userId
      //     )})
      // console.log("Current response for All Approvers  : ",approverList)
      // console.log("saveNewDepartment success");

      return true;
    }
  } catch (error) {
    // console.error("Error fetching saveNewDepartment : ", error);
    // return null;
  }
};

/**
 * Updates the details of an existing department.
 * Sends a PUT request with the updated department details to the server.
 * If the update is successful, logs a success message and returns true.
 * If an error occurs, logs the error message.
 * @param {Object} department - The department details to be updated.
 * @returns {Promise<Boolean>} A promise that resolves to true if the department is updated successfully.
 */
export const updateDepartmentDetails = async (department) => {
  try {
    const response = await axios.put(
      `${User_API}/usermodule/departments`,
      department,
      {
        headers: {
          ////Authorization: "Basic " + encoded,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    // console.log("Department that was updated : ", response);
    if (response.status === 200) {
      // console.log("Current response for All usermodule  : ",response.data)
      // let approverList=[];
      // response.data.forEach(user=>{if(
      //   user.allotedPages.includes("JobReviewer"))
      //   approverList.push(user.userId
      //     )})
      // console.log("Current response for All Approvers  : ",approverList)
      // console.log("Department has been updated or created");

      return true;
    }
  } catch (error) {
    // console.error("Error Updating department:", error);
    // return null;
  }
};

/**
 * Updates the details of an existing group.
 * Sends a PUT request with the updated group details to the server.
 * If the update is successful, logs a success message and returns true.
 * If an error occurs, logs the error message.
 * @param {Object} group - The group details to be updated.
 * @returns {Promise<Boolean>} A promise that resolves to true if the group is updated successfully.
 */
export const updateGroupDetails = async (group) => {
  try {
    const response = await axios.put(`${User_API}/usermodule/groups`, group, {
      headers: {
        ////Authorization: "Basic " + encoded,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    // console.log("Group was updated : ", response);
    if (response.status === 200) {
      // console.log("Current response for All Users  : ",response.data)
      // let approverList=[];
      // response.data.forEach(user=>{if(
      //   user.allotedPages.includes("JobReviewer"))
      //   approverList.push(user.userId
      //     )})
      // console.log("Current response for All Approvers  : ",approverList)
      // console.log("Group has been updated");

      return true;
    }
  } catch (error) {
    // console.error("Error Updating Group:", error);
    // return null;
  }
};

/**
 * Deletes a group by its ID.
 * Sends a DELETE request with the group ID and the tenant ID to the server.
 * If the deletion is successful, logs a success message and returns the response data.
 * If an error occurs, logs the error message.
 * @param {Object} group - The group details to be deleted.
 * @returns {Promise<Object>} A promise that resolves to the response data if the deletion is successful.
 */
export const deleteGroupById = async (group) => {
  // console.log("The group that will be deleted : ", group);
  try {
    const response = await axios.delete(`${User_API}/usermodule/groups`, {
      headers: {
        ////Authorization: "Basic " + encoded,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      // params:{
      //   groupId:groupId
      // }
      data: group,
    });
    // console.log(" Response for Group Deleted ?  : ", response);
    if (response.status === 200) {
      // console.log("Data  Response for Group   : ", response.data);
      // let approverList=[];
      // response.data.forEach(user=>{if(
      //   user.allotedPages.includes("JobReviewer"))
      //   approverList.push(user.userId
      //     )})
      // console.log("Current response for All Approvers  : ",approverList)

      return response.data;
    }
  } catch (error) {
    // console.error("Error deleting group:", error);
    // return null;
  }
};

/**
 * Deletes a department by its ID.
 * Sends a DELETE request with the department ID and the tenant ID to the server.
 * If the deletion is successful, logs a success message and returns the response data.
 * If an error occurs, logs the error message.
 * @param {Object} dept - The department details to be deleted.
 * @returns {Promise<Object>} A promise that resolves to the response data if the deletion is successful.
 */

export const deleteDepartmentById = async (dept) => {
  try {
    const response = await axios.delete(`${User_API}/usermodule/departments`, {
      headers: {
        ////Authorization: "Basic " + encoded,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: dept,
      // params:{
      //   deptId:deptId
      // }
    });
    // console.log(" Response for Department Deleted ?  : ", response);
    if (response.status === 200) {
      // console.log("Data payload Response for Department   : ", response.data);
      // let approverList=[];
      // response.data.forEach(user=>{if(
      //   user.allotedPages.includes("JobReviewer"))
      //   approverList.push(user.userId
      //     )})
      // console.log("Current response for All Approvers  : ",approverList)

      return response.data;
    }
  } catch (error) {
    // console.error("Error deleting Department:", error);
    // return null;
  }
};

/**
 * Merges the given group with the given list of users.
 * Sends a POST request with the group ID, the list of users and the tenant ID to the server.
 * If the merge is successful, logs a success message and returns true.
 * If an error occurs, logs the error message.
 * @param {string} groupID - The ID of the group to merge with.
 * @param {Array<string>} userIdList - The list of user IDs to merge with the group.
 * @returns {Promise<Boolean>} A promise that resolves to true if the merge is successful.
 */
export const saveMergedGroups = async (groupID, userIdList) => {
  try {
    const tenant = getTenantID();
    const mergeData = {
      groupID: groupID,
      usersList: userIdList,
      tenantId: tenant,
    };

    // console.log("Created Object for mergeData : ", mergeData);
    const response = await axios.post(
      `${User_API}/usermodule/mergeGroups`,
      mergeData,
      {
        headers: {
          ////Authorization: "Basic " + encoded,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    // console.log("Current Response for Merged Group Save : ", response);
    if (response.status === 200) {
      // console.log("Current response for All Users  : ",response.data)
      // let approverList=[];
      // response.data.forEach(user=>{if(
      //   user.allotedPages.includes("JobReviewer"))
      //   approverList.push(user.userId
      //     )})
      // console.log("Current response for All Approvers  : ",approverList)
      // console.log("Group has been merged successfully !");

      return true;
    }
  } catch (error) {
    // console.error("Error merging Group:", error);
    // return null;
  }
};

/**
 * This function is used to change the password of a user
 * @param {Object} user - The user object with the new password
 * @returns {Promise<Object>} - The updated user object
 */
export const changeUserPassword = async (user) => {
  try {
    const env_userId = process.env.REACT_APP_USERID;
    const currentUser = decryptTokenId(localStorage.getItem(env_userId));
    const updatedUser = { ...user, modifiedBy: currentUser };
    const tenantId = getTenantID();
    const response = await axios.put(
      `${User_API}/usermodule/password`,
      updatedUser,
      {
        headers: {
          ////Authorization: "Basic " + encoded,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        // ,params:{
        //   userId:userId,
        //   tenantId:tenantId
        // }
      }
    );
    // console.log(" Response for Change Password : ", response);
    if (response.status === 200) {
      // console.log("Response for Change Password Data: ", response.data);
      // let approverList=[];
      // response.data.forEach(user=>{if(
      //   user.allotedPages.includes("JobReviewer"))
      //   approverList.push(user.userId
      //     )})
      // console.log("Current response for All Approvers  : ",approverList)

      return response.data;
    }
  } catch (error) {
    // console.error("Error fetching User Change Password  Details:", error);
    // return null;
  }
};

/**
 * This function is used to check the old password of a user
 * @param {string} oldPassword - The old password of the user
 * @returns {Promise<Object>} - The response from the server
 */
export const checkOldPassword = async (oldPassword) => {
  try {
    // console.log("checkOldPassword() called : ");
    const response = await axios.get(
      `${User_API}/usermodule/password/${getCurrentUser()}/${getTenantID()}/${oldPassword}`,
      {
        headers: {
          ////Authorization: "Basic " + encoded,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    // console.log("Current Response for checkOldPassword : ", response);
    if (response.status === 200) {
      // console.log("Current response for checkOldPassword  : ", response.data);
      // let approverList=[];
      // response.data.forEach(user=>{if(
      //   user.allotedPages.includes("JobReviewer"))
      //   approverList.push(user.userId
      //     )})
      // console.log("Current response for All Approvers  : ",approverList)

      return response.data;
    }
  } catch (error) {
    // console.error("Error in  checkOldPassword:", error);
    // return null;
  }
};

/**
 * Updates the last login time for a user.
 * @param {Object} user - The user object with the new last login time
 * @returns {Promise<Object>} - The updated user object
 */
export const updateLastLogin = async (user) => {
  try {
    // console.log("updateLastLogin() called : ");
    const response = await axios.put(`${User_API}/usermodule/login`, user, {
      headers: {
        ////Authorization: "Basic " + encoded,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    // console.log("Current Response for updateLastLogin : ", response);
    if (response.status === 200) {
      // console.log("Current response for updateLastLogin  : ", response.data);
      // let approverList=[];
      // response.data.forEach(user=>{if(
      //   user.allotedPages.includes("JobReviewer"))
      //   approverList.push(user.userId
      //     )})
      // console.log("Current response for All Approvers  : ",approverList)

      return response.data;
    }
  } catch (error) {
    // console.error("Error in  updateLastLogin:", error);
    // return null;
  }
};



