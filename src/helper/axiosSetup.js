import axios from "axios";

const AUTH_API = process.env.REACT_APP_AUTHSERVICE;
const SKEW_MS = 30 * 1000;

// ---- Session management ----
const getAccessToken = () => localStorage.getItem("token");

const saveAccessToken = (t) => {
  localStorage.setItem("token", t);
};

const clearSession = () => {
  console.error("[AUTH] Session cleared. Redirecting to login.");
  localStorage.clear();
  window.location.href = "/";
};

const isAuthCall = (url = "") => url.includes("/auth/");

// ---- Token expiry ----
function getExpiryMs(token) {
  try {
    const p = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");

    console.log(
      "getExpiryMs : token.split :-: ",
      token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"),
    );

    console.log("JSON.parse(atob(p)) : ", JSON.parse(atob(p)));

    const expiry = JSON.parse(atob(p)).exp * 1000;

    console.log("expiry : ", expiry);

    return expiry;
  } catch (error) {
    console.error("[AUTH] Failed to decode token:", error);
    return 0;
  }
}

const isFresh = (t) => {
  if (!t) {
    console.warn("[AUTH] No access token found");
    return false;
  }

  const remaining = getExpiryMs(t) - Date.now();
  const fresh = remaining > SKEW_MS;

  return fresh;
};

// ---- Refresh API ----
async function callRefresh() {
  try {
    const r = await axios.post(`${AUTH_API}/auth/refresh`, null, {
      withCredentials: true,
    });

    saveAccessToken(r.data.token);

    return r.data.token;
  } catch (e) {
    console.error("[AUTH] Refresh API failed:", {
      status: e.response?.status,
      message: e.message,
    });

    if (e.response?.status === 401) {
      console.error("[AUTH] Refresh token expired or revoked");
      clearSession();
    }

    throw e;
  }
}

// ---- Refresh locking ----
let refreshing = null;

function refreshToken(staleToken) {
  if (!refreshing) {
    const run = async () => {
      const latest = getAccessToken();

      if (isFresh(latest) && latest !== staleToken) {
        return latest;
      }

      return callRefresh();
    };

    const p = navigator.locks
      ? navigator.locks.request("op360-token-refresh", run)
      : run();

    refreshing = p.finally(() => {
      refreshing = null;
    });
  } else {
  }

  return refreshing;
}

// ---- Ensure fresh token ----
export function ensureFreshToken() {
  const current = getAccessToken();

  if (isFresh(current)) {
    return Promise.resolve(current);
  }

  console.warn("[AUTH] Access token expired or near expiry");

  return refreshToken(current);
}

// ---- REQUEST INTERCEPTOR ----
axios.interceptors.request.use(
  async (config) => {
    if (isAuthCall(config.url)) {
      config.withCredentials = true;
      return config;
    }

    const h = String(config.headers?.Authorization || "");

    if (!h.startsWith("Bearer ")) {
      return config;
    }

    try {
      const token = await ensureFreshToken();

      config.headers.Authorization = `Bearer ${token}`;
    } catch (e) {
      console.error("[AXIOS REQUEST] Token refresh failed:", e.message);
    }

    return config;
  },
  (error) => {
    console.error("[AXIOS REQUEST] Request interceptor error:", error);
    return Promise.reject(error);
  },
);

// ---- RESPONSE INTERCEPTOR ----
axios.interceptors.response.use(
  (res) => {
    return res;
  },

  async (error) => {
    const original = error.config;

    console.error("[AXIOS RESPONSE] Request failed:", {
      url: original?.url,
      status: error.response?.status,
      message: error.message,
    });

    const sent = String(original?.headers?.Authorization || "");

    if (
      error.response?.status === 401 &&
      sent.startsWith("Bearer ") &&
      !original._retried &&
      !isAuthCall(original.url)
    ) {
      console.warn("[AXIOS RESPONSE] Received 401. Attempting token refresh");

      original._retried = true;

      try {
        const token = await refreshToken(sent.slice(7));

        original.headers.Authorization = `Bearer ${token}`;

        return axios(original);
      } catch (e) {
        console.error("[AXIOS RESPONSE] Refresh and retry failed:", e.message);
      }
    }

    console.error("[AXIOS RESPONSE] Returning request error");

    return Promise.reject(error);
  },
);

// ---- TAB VISIBILITY ----
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && getAccessToken()) {
    ensureFreshToken().catch((error) => {
      console.error("[TAB] Background token refresh failed:", error);
    });
  }
});
