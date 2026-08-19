import React, { Suspense, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import reportWebVitals from "./reportWebVitals";
import { RotatingTriangles, ThreeDots } from "react-loader-spinner";
import ErrorBoundary from "./ErrorBoundary";
import { BrowserRouter } from "react-router-dom";

// index.js
window.addEventListener("beforeinstallprompt", (e) => {
  console.log("✅ beforeinstallprompt fired!"); // if you never see this, Chrome blocked it
  e.preventDefault();
  window.__deferredInstallPrompt = e;
});

const logsVisible = process.env.REACT_APP_LOGS_ENV;
// console.log('Current ENV : ',logsVisible);
// console.log('Current PROD ENV : ',process.env.REACT_APP_PROD);
// console.log('Current PROD DEV : ',process.env.REACT_APP_DEV);
// //Disable all consoles
if (logsVisible === "production") {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}
const Loading = () => {
  useEffect(() => {
    // Remove the loader div if it exists
    const loader = document.getElementById("loader");
    if (loader) {
      loader.remove();
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <span style={{ paddingRight: "5px" }}>Welcome...</span>
      <i className="fas fa-spinner fa-spin"></i>
    </div>
  );
};

const App = React.lazy(() => import("./App")); // Lazy load your main App component
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <Suspense fallback={<Loading />}>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </Suspense>,
  //  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
