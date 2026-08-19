import { decryptTokenId } from "../helper/AuthService";

/**
 * Creates a user object for the User Module.
 * @param {Object} param0 - Object containing user properties.
 * @param {string} param0.userID - The unique identifier of the user.
 * @param {string} param0.userName - The username for the user.
 * @param {string} [param0.password=user_123] - The password for the user.
 * @param {string} [param0.phone=""] - The phone number of the user.
 * @param {string} [param0.g360HomePage=""] - The home page for the user in G360.
 * @param {string} [param0.workFlowHomePage=""] - The home page for the user in Workflow.
 * @param {boolean} [param0.g360Admin=false] - Whether the user is a G360 administrator.
 * @param {boolean} [param0.active=true] - Whether the user is active.
 * @param {string} [param0.createdOn=(new Date()).toISOString()] - The creation date of the user.
 * @param {string} [param0.modifiedOn=(new Date()).toISOString()] - The modification date of the user.
 * @param {string} [param0.createdBy=""] - The user who created the user.
 * @param {string} [param0.modifiedBy=""] - The user who modified the user.
 * @param {string} [param0.department=""] - The department of the user.
 * @param {boolean} [param0.firstLoginRequired=true] - Whether the user must log in for the first time.
 * @param {number} [param0.passwordExpiryDuration=0] - The duration after which the password will expire.
 * @param {string} [param0.passwordExpiryDate=null] - The date after which the password will expire.
 * @param {string} [param0.lastLogIn=null] - The date of the last login of the user.
 * @param {string} [param0.tenantId=""] - The tenant ID of the user.
 * @param {string[]} [param0.group=[]] - The groups the user belongs to.
 * @param {string[]} [param0.allotedPages=[]] - The pages the user has access to.
 * @param {string[]} [param0.g360AllottedPageList=[]] - The G360 pages the user has access to.
 * @param {string[]} [param0.workflowAllottedPageList=[]] - The Workflow pages the user has access to.
 * @param {Set<string>} [param0.allG360PageList=new Set()] - The set of all G360 pages.
 * @param {Set<string>} [param0.allWorkflowPageList=new Set()] - The set of all Workflow pages.
 * @returns {Object} The created user object.
 */
export function createUser({
  userID,
  userName,
  password,
  phone,
  g360HomePage,
  workFlowHomePage,
  g360Admin,
  active,
  createdOn,
  modifiedOn,
  createdBy,
  modifiedBy,
  department,
  firstLoginRequired,
  passwordExpiryDuration,
  passwordExpiryDate,
  lastLogIn,
  tenantId,
  group,
  allotedPages,
  g360AllottedPageList,
  workflowAllottedPageList,
  allG360PageList,
  allWorkflowPageList,
}) {
  return {
    userID: userID || "",
    userName: userName || "",
    password: password || "user_123",
    phone: phone || "",
    g360HomePage: g360HomePage || "",
    workFlowHomePage: workFlowHomePage || "",
    g360Admin: g360Admin || false,
    active: active || true,
    createdOn: createdOn,
    modifiedOn: modifiedOn,
    createdBy: createdBy || "",
    modifiedBy: modifiedBy || "",
    department: department || "",
    firstLoginRequired: firstLoginRequired || true,
    passwordExpiryDuration: passwordExpiryDuration,
    passwordExpiryDate: passwordExpiryDate,
    lastLogIn: lastLogIn || null,
    tenantId: tenantId || "",
    group: group || [],
    allotedPages: allotedPages || [],
    g360AllottedPageList: g360AllottedPageList || [],
    workflowAllottedPageList: workflowAllottedPageList || [],
    allG360PageList: allG360PageList || new Set(),
    allWorkflowPageList: allWorkflowPageList || new Set(),
  };
}

/**
 * Creates a group object with the given details.
 * @param {string} [groupID=""] - The ID of the group.
 * @param {string} [groupName=""] - The name of the group.
 * @param {string} [phone=""] - The phone number of the group.
 * @param {string} [homePage=""] - The home page of the group.
 * @param {boolean} [active=false] - The active status of the group.
 * @param {string} [tenantId=""] - The tenant ID of the group.
 * @returns {Object} The created group object.
 */
export function createGroup(
  groupID,
  groupName,
  phone,
  homePage,
  active,
  tenantId,
  groupLeader
) {
  return {
    groupID: groupID || "",
    groupName: groupName || "",
    phone: phone || "",
    homePage: homePage || "",
    active: active || false, // Set a default boolean value for 'active'
    tenantId: tenantId || "",
    groupLeader: groupLeader || "",
  };
}

/**
 * Creates a department object with the given details.
 * @param {string} [deptID=""] - The ID of the department.
 * @param {string} [deptName=""] - The name of the department.
 * @param {string} [tenantId=""] - The tenant ID of the department.
 * @returns {Object} The created department object.
 */
export function createDepartment(deptID, deptName, tenantId) {
  return {
    deptID: deptID || "",
    deptName: deptName || "",
    tenantId: tenantId || "",
  };
}

/**
 * Retrieves the currently logged in user's ID from local storage.
 * @returns {string} The decrypted user ID of the current user.
 */
export const getCurrentUser = () => {
  const env_userId = process.env.REACT_APP_USERID;

  const user = localStorage.getItem(env_userId);
  const current_Admin = decryptTokenId(user);
  return current_Admin;
};
