import { Route, Routes } from "react-router-dom";
import "./App.css";
import NotFound from "./NotFound.component";
// import Login from "./test/Login";
import Login from "./Login/Login";

import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "react-toastify/dist/ReactToastify.css";
import "reactflow/dist/style.css";

// import WrappedRoutes from "./WrappedRoutes";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import AdminRoutes from "./AdminRoutes";
import AssetCreation from "./Asset/AssetCreation";
import EmailJobAssign from "./Email Template/EmailActivityReview";
import Restricted from "./Restricted/Restricted";
import PlantPage from "./Tenant/PlantPage";
import Tenant from "./Tenant/Tenant";
// import UserProfile from "./UserProfile/UserProfile";

import { lazy, Suspense, useEffect } from "react";
import ChatUI from "./Logbook/ChatNotNew/ChatUI.jsx";
import { Button, message, Space } from "antd";
//IMPORTANT  Import Main Css Module File
import "../src/style/main.css";
import MailNotificationMaster from "./Tenant/MailNotificationMaster.jsx";
import SelfJobCreation from "./SelfJobCreation/SelfJobCreation.jsx";
import LogbookForm from "./Logbook/View/LogbookForm.jsx";

const WrappedRoutesLazy = lazy(() => import("./WrappedRoutes.js"));
const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Spin
        indicator={<LoadingOutlined spin />}
        style={{ paddingLeft: "1rem" }}
      />
    </div>
  );
};

function App() {
  // const [messageApi, contextHolder] = message.useMessage();

  // const warning = () => {
  //   messageApi.open({
  //     type: "warning",
  //     content: "This feature is unavailable due to security reasons.",
  //   });
  // };

  useEffect(() => {
    // const handleContextMenu = (e) => {
    //   e.preventDefault();
    //   warning();
    // };

    // const handleKeyDown = (e) => {
    //   // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U (view source)
    //   if (
    //     e.keyCode === 123 || // F12
    //     (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || // Ctrl+Shift+I, Ctrl+Shift+J
    //     (e.ctrlKey && e.keyCode === 85) // Ctrl+U
    //   ) {
    //     e.preventDefault();
    //     warning();
    //   }

    //    if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
    //     console.log('Ctrl+Shift+C detected');
    //     e.preventDefault();
    //       warning();
    // }
    // };
    // const logsVisible = process.env.REACT_APP_LOGS_ENV;
    // if (logsVisible === "production") {
    //   document.addEventListener("contextmenu", handleContextMenu);
    //   document.addEventListener("keydown", handleKeyDown);
    // }

    return () => {
      // if (logsVisible === "production") {
      //   document.removeEventListener("contextmenu", handleContextMenu);
      //   document.removeEventListener("keydown", handleKeyDown);
      // }
    };
  }, []);
  return (
    <Suspense fallback={<Loader />}>
      <>
        <Routes>
          <Route path="/workflow/*" element={<WrappedRoutesLazy />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/" element={<Login />} />
          <Route path="*" element={<NotFound />} />
          <Route path="Asset" element={<AssetCreation />} />
          <Route path="restricted" element={<Restricted />} />
          <Route path="/tenant" element={<Tenant />} />
          <Route path="/plant" element={<PlantPage />} />
          {/* <Route path="/emailTemp" element={<EmailJobAssign />} /> */}
          {/* <Route path="/adhocJob" element={<AdhocJob />} /> */}
          {/* <Route path="/userProfile" element={<UserProfile />} /> */}
          {/* <Route path="usersoverview" element={<UserOverview />} /> */}
          <Route path="/chatpro" element={<ChatUI />} />
          <Route
            path="/mailNotificationMaster"
            element={<MailNotificationMaster />}
          />
          {/* External SelfJob */}
          <Route path="/guest/selfjob" element={<SelfJobCreation />} />
         <Route path="/guest/logbookForm" element={<LogbookForm />} />
        </Routes>
        {/* {contextHolder} */}
      </>
    </Suspense>
  );
}

export default App;
