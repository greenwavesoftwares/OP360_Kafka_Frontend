import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import NotFound from "./NotFound.component";
// import Login from "./test/Login";
import ActivityReviewer from "./ActivityReviewer/ActivityReviewer";
import JobAssign from "./JobAssign/JobAssign";
import JobPerformer from "./JobPerformer/JobPerformer";
import JobReviewer from "./JobReviewer/JobReviewer";
import AssetMaster from "./Logbook Asset/AssetMaster";
import LView from "./Logbook/View/LView";
import LogBookSelection from "./Logbook/View/LogBookSelection";
import LogbookView from "./Logbook/View/LogBookView";
import LogbookForm from "./Logbook/View/LogbookForm";
import LogbookReportView from "./Logbook/View/LogbookReportView";
import ReportConfigurator from "./LogbookReports/ReportConfigurator";
import ReportView from "./LogbookReports/ReportView";
import Menubar from "./MenuBar/Menubar";
import SelfJobCreation from "./SelfJobCreation/SelfJobCreation";
import AddTaskFormDialog from "./taskmaster/AddTaskFormDialog";
import TaskFormDialog from "./taskmaster/TaskFormDialog";
import TaskReviewer from "./taskreviewer/taskReviewer";
import BlankPage from "./test/BlankPage";
// import "font-awesome/css/font-awesome.min.css";

import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "react-toastify/dist/ReactToastify.css";
import "reactflow/dist/style.css";
// import DemoMenu from "./MenuBar/demoMenu";
import { useEffect, useState } from "react";
import TaskCreationForAdhoc from "./AdhocJob/TaskCreationForAdhoc";
import AssetCreation from "./Asset/AssetCreation";
import AssetMasterTest from "./Asset/AssetMasterTest";
import { fetchAllotedPagesByUserId } from "./CommonAPI";
import AssetOrUserTableContainer from "./Dashboard/AssetOrUserTableContainer";
import Dashboard from "./Dashboard/FilterSidebar";
import ReactCalendarTimeline from "./Dashboard/ReactCalendarTimeline";
import TimelineChartTest from "./Dashboard/TimeLineChartTest";
import FileUploadComponent from "./Logbook Configure/FileUploadComponent";
import GridPlayGround from "./Logbook Configure/GridPlayGround";
import LogbookMaster from "./Logbook Configure/LogbookMaster";
import LogbookReportViewWithPageNavigation from "./LogbookReports/LogbookReportViewWithPageNavigation";
import DeleteEdgeDrop from "./Task/DeleteEdgeDrop";
import TaskCreation from "./Task/TaskCreation";
import TaskMaster from "./Task/TaskMasterTest";
import { ActivityCarousel } from "./Test Ground/ActivityCarousel";
import Example from "./Test Ground/Example";
import Example1 from "./Test Ground/Example1";
import MessageComponent from "./Test Ground/MessageComponent";
import MyGridLayout from "./Test Ground/MyGridLayout";
import TokenComponent from "./TokenComponent";
import AddOrUpdateUser from "./UserModuleUpdated/AddOrUpdateUser";
import UserOverview from "./UserModuleUpdated/UserOverview";
import UserProfile from "./UserProfile/UserProfile";
// import { getTokenExpirationTime, hastokenExpired } from "./helper";
import { extendTokenExpiration } from "./helper/AuthService";
import ChatUI from "./Logbook/ChatNotNew/ChatUI";
import { useLocalStorage } from "react-haiku";
import { getCurrentUser } from "./UserModuleUpdated/helper";

export default function WrappedRoutes() {
  const [isNotFound, setIsNotFound] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const location = useLocation();

  // Function to decode JWT token and get expiration time (exp)
  //   const getTokenExpirationTime = (token) => {
  //     if (!token) return null;
  //     const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
  //     return payload.exp * 1000; // Expiration time in milliseconds
  // };

  // const navigateToLogin = () => {
  //   const currentTime = Date.now();
  //   const expirationTime = getTokenExpirationTime(token);
  //   console.log("Expiry Time : ", expirationTime);
  //   const timeRemaining = expirationTime - currentTime;
  //   console.log("Time remaining : ", timeRemaining);
  //   if (timeRemaining <= 30000) {
  //     const savedTenantBackup = localStorage.getItem("savedTenant");
  //     localStorage.clear();
  //     if (savedTenantBackup)
  //       localStorage.setItem("savedTenant", savedTenantBackup);
  //     navigate("/");
  //   }
  // };
  // useEffect(() => {
  //   console.log("WrappedRoutes mounted");
  //   // navigateToLogin();

  //   const handleVisibilityChange = () => {
  //     if (!document.hidden) {
  //       console.log("Doc alive");
  //       // navigateToLogin();
  //     }
  //   };

  //   // Add the visibilitychange event listener
  //   document.addEventListener("visibilitychange", handleVisibilityChange);
  //   // Check every 10 seconds to see if the token is about to expire
  //   const intervalId = setInterval(() => {
  //     const tokenExpiired = hastokenExpired();
  //     if (tokenExpiired) {
  //       // If less than or equal to 120 seconds remaining
  //       setVisible(true); // Show warning or prompt
  //       clearInterval(intervalId);
  //     } else {
  //       setVisible(false); // Hide warning if token is still valid
  //     }
  //   }, 10000); // Check every 10 seconds

  //   // Cleanup interval on component unmount
  //   return () => {
  //     clearInterval(intervalId);
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //     window.removeEventListener("storage", handleStorageChange);
  //   };
  // }, [visible]);

  /**
   * Handles the storage event, checking if the token has been updated
   * while the document is hidden (i.e., the user has switched tabs or
   * minimized the browser window). If the token has been updated, the
   * window is reloaded to reflect the new token.
   * @param {StorageEvent} event - The storage event containing the key and
   *   new and old values of the updated storage item.
   */
  const handleStorageChange = (event) => {
    console.log("Storage event detected:", event);
    //
    const token = localStorage.getItem("token");
    console.log("Current Token :", token);
    if (!token) {
      console.log("Token removed, navigating to login");
      navigate("/");
      return;
    }
    const payload = JSON.parse(atob(token?.split(".")[1])); // Decode JWT payload
    const isDifferentUser = payload.sub !== getCurrentUser(); //Checking if the user is same or not

    console.log("Payload UserName : ", payload.sub);
    console.log("Current User ", getCurrentUser());

    console.log("Same User ? ", isDifferentUser);

    if (event.key === "token" && isDifferentUser && document.hidden) {
      // debugger;
      window.location.reload();
    }
  };

  useEffect(() => {
    extendTokenExpiration();
    userHasPageAccess();
    checkForExternalUser();
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const checkForExternalUser = () => {
    const externalUserCredentials =
      process.env.REACT_APP_EXTERNALUSER_CREDENTIALS.split(",");

    console.log("External User Credentials : ", externalUserCredentials);
    if (getCurrentUser() === externalUserCredentials[0]) {
      console.log("External user logged in, navigating to restricted page");
      navigate("/restricted");
    }
  };

  const userHasPageAccess = async () => {
    console.log("userHasPageAccess() called ");
    const allotedPages = await fetchAllotedPagesByUserId(); //fetch the privilege of pages which the current user has access to
    if (allotedPages) {
      const current_path = location.pathname.toLowerCase(); // the current path i.e current URL
      console.log("Current Path : ", current_path);
      const index = allotedPages.findIndex(
        //the index of the page is  fetched from the array
        (data) => data.toLowerCase() === current_path.toLowerCase(),
      );

      const adminUrl = "/workflow/admin";
      const adminUserEditUrl = "/workflow/userdetails";

      const adminPageAccess = allotedPages.findIndex(
        //the index of the page is  fetched from the array
        (data) => data.toLowerCase() === adminUrl,
      );
      const is_current_path_report = current_path.startsWith(
        "/workflow/reportview",
      );
      const is_current_path_logbook = current_path
        .toLowerCase()
        .startsWith("/workflow/logbookform"); // Considering the user is in the logbook page and refreshes the page

      if (
        current_path.toLowerCase().startsWith(adminUserEditUrl) &&
        adminPageAccess === -1
      ) {
        navigate("/restricted");
        console.log("Navigated to restricted");
        return;
      }
      if (
        index === -1 &&
        current_path !== adminUserEditUrl &&
        !is_current_path_report &&
        !is_current_path_logbook
      ) {
        //if the  index  is not found then it will be -1, then the user will be navigated to '/restricted'
        console.log("Navigated to restricted");
        navigate("/restricted");
      }
    }
  };

  const CustomNotFound = ({ setIsNotFoundComonent }) => {
    useEffect(() => {
      console.log("CustomNotFound mounted");
      setIsNotFoundComonent(true);
    }, []);

    // Empty dependency array ensures this runs only on mount and unmount

    return (
      <div>
        <NotFound />
      </div>
    );
  };
  return (
    <div>
      {!isNotFound && (
        <Menubar>
          <TokenComponent visible={visible} setVisible={setVisible} />
          <>
            <Routes>
              {/* <Route path="/admin" element={<Admin />} /> */}
              <Route path="/admin" element={<UserOverview />} />
              <Route path="/userDetails" element={<AddOrUpdateUser />} />
              <Route path="/userprofile" element={<UserProfile />} />
              <Route path="/taskmaster" element={<TaskMaster />} />
              <Route path="/taskreview" element={<TaskReviewer />} />
              {/* <Route path="/login" element={<Login />} /> */}
              <Route path="/logbook" element={<LogBookSelection />} />
              <Route path="/logbookarchive" element={<LogbookView />} />
              <Route path="/assetCreation" element={<AssetMaster />} />
              <Route path="/assetmaster" element={<AssetMasterTest />} />

              <Route path="/jobassign" element={<JobAssign />} />
              <Route path="/adhocjob" element={<TaskCreationForAdhoc />} />
              <Route path="/edittask" element={<TaskFormDialog />} />
              <Route path="/addtask" element={<AddTaskFormDialog />} />
              <Route path="/taskcreation" element={<TaskCreation />} />
              <Route path="/MyGridLayout" element={<MyGridLayout />} />
              <Route
                path="/configurelogbookreport"
                element={<ReportConfigurator />}
              />
              {/*?*/}
              <Route path="/reportview" element={<ReportView />} />
              {/*?*/}
              <Route
                path="/logbookreportviewwithpagenavigation"
                element={<LogbookReportViewWithPageNavigation />}
              />
              <Route path="/performer" element={<JobPerformer />} />
              <Route path="/activityreviewer" element={<ActivityReviewer />} />
              <Route path="/selfjob" element={<SelfJobCreation />} />
              <Route path="/jobreviewer" element={<JobReviewer />} />
              <Route
                path="/logbookreportview"
                element={<LogbookReportView />}
              />
              <Route path="/logbookForm" element={<LogbookForm />} />
              <Route path="/lView" element={<LView />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/*"
                element={
                  <CustomNotFound setIsNotFoundComonent={setIsNotFound} />
                }
              />
              <Route path="/workflow/#" element={<BlankPage />} />
              <Route path="Asset" element={<AssetCreation />} />
              <Route path="AssetTest" element={<AssetMasterTest />} />
              <Route path="TaskTest" element={<TaskMaster />} />
              <Route path="/reactFlow" element={<DeleteEdgeDrop />} />
              <Route path="/timeline" element={<TimelineChartTest />} />
              <Route path="/example" element={<Example />} />
              <Route path="/example1" element={<Example1 />} />
              <Route
                path="/ReactCalendarTimeline"
                element={<ReactCalendarTimeline />}
              />

              <Route path="/ActivityCarousel" element={<ActivityCarousel />} />
              <Route
                path="/AssetOrUserTableContainer"
                element={<AssetOrUserTableContainer />}
              />
              <Route path="/ConfigureLogbook" element={<LogbookMaster />} />
              <Route path="/GridPlayGround" element={<GridPlayGround />} />
              <Route
                path="/FileUploadComponent"
                element={<FileUploadComponent />}
              />
              <Route path="/SocketTest" element={<MessageComponent />} />
              <Route path="/LogbookMaster" element={<LogbookMaster />} />
              <Route path="/chatbook" element={<ChatUI />} />
            </Routes>
          </>
        </Menubar>
      )}
      {isNotFound && (
        <Routes>
          <Route
            path="/*"
            element={<CustomNotFound setIsNotFoundComonent={setIsNotFound} />}
          />
        </Routes>
      )}
    </div>
  );
}
