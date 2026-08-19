import axios from "axios";

import { decryptTokenId } from "../helper/AuthService";

const USER_GROUP_API = process.env.REACT_APP_USERGROUPS;
//  const tenant=localStorage.getItem("tenantId");
// const tenantId = tenant?decryptTokenId(tenant):null;
const getTenantID = () => {
  const env_tenant = process.env.REACT_APP_TENANTID;
  console.log("Tenant Varaible from env : ", env_tenant);
  const encryptedTenant = localStorage.getItem(env_tenant);
  const tenant = decryptTokenId(encryptedTenant);
  console.log("Current Tenant ID : ", tenant);
  return tenant;
};
export const getSelectedOptionTask = async (selected_asset) => {
  try {
    console.log("getSelectedOptionTask() called ", selected_asset);
    console.log(
      "URL : ",
      `${USER_GROUP_API}/usergroup/jobAssetGroup/${selected_asset}/${getTenantID()} `
    );
    const response = await axios.get(
      `${USER_GROUP_API}/usergroup/jobAssetGroup/${selected_asset}/${getTenantID()} `,
      {
        headers: {
          // ////Authorization: "Basic " + encoded,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    //console.log("Current Response for Task Dropdown : ",response)
    //The current response is giving all the groups information not to the selected option so i am filtering the data and returning that response
    console.log(
      "Response Data : ",
      response.data,
      " Selected Option : ",
      selected_asset
    );
    // let selectedOptionData=response.data.filter((element)=>element.assetGroup===selected_asset)
    // console.log("Final Selected Option Data : ",selectedOptionData)
    // return selectedOptionData;
    return response.data;
  } catch (error) {
    console.error("Error for fetching the task dropdown value : ", error);
    // return null;
  }
};
