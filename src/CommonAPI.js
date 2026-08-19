import axios from "axios";
import { decryptTokenId } from "./helper/AuthService";

const REACT_APP_TENANTID = process.env.REACT_APP_TENANTID;
const REACT_APP_USERID = process.env.REACT_APP_USERID;

export async function fetchAllotedPagesByUserId() {
  try {
    const tenant = localStorage.getItem(REACT_APP_TENANTID);
    const user = localStorage.getItem(REACT_APP_USERID);
    const tenantid = decryptTokenId(tenant);
    const userid = decryptTokenId(user);

    const response = await axios.get(
      `${process.env.REACT_APP_USERGROUPS}/users/getAllotedPagesByUserIdTenantId/${userid}/${tenantid}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,

          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error in fetchAllotedPagesByUserId", error);
  }
}
