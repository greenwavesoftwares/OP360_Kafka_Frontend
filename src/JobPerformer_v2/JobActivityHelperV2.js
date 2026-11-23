import axios from "axios";
import dayjs from "dayjs";

// Adjust to match how your other API helpers (e.g. JobPerformerAPI) get the base URL
const BASE_URL = process.env.REACT_APP_JOBAPI ;

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Attach your auth header here, the same way your other helpers do it
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // replace with your real token source
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Fetch jobs for a performer within a date range.
 * Body matches the Java UserDataFilter POJO.
 *
 * @param {Object}   filter
 * @param {string}   filter.userId
 * @param {string}   filter.tenantId
 * @param {string[]} filter.groups
 * @param {dayjs.Dayjs} filter.start  first day of range
 * @param {dayjs.Dayjs} filter.end    last day of range
 * @returns {Promise<Array>} list of JobDetails
 */
export async function getJobsByPerformer({ userId, tenantId, groups = [], startRange, endRange }) {
  const body = {
    userId,
    tenantId: tenantId || "",
    groups,
    // Full-day bounds so the last day is included; sent as ISO timestamps for java.util.Date
    startRange: startRange,
    endRange: endRange,
  };
  console.log("Body:",body)
  try {
    // NOTE: POST, not GET. Browsers drop the body on GET requests.
    const response = await client.get("/jobactivity/performer/jobs", {params: body});
    return response.data;
  } catch (error) {
    const data = error.response?.data;
    const message =
      data?.error || data?.message ||
      (error.response ? `Request failed (${error.response.status})` : "Cannot reach the server");
    throw new Error(message);
  }
}