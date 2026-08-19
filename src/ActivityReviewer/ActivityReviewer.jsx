// Importing necessary components from Material-UI for UI elements
import { Container, useMediaQuery, useTheme } from "@mui/material";

// Importing Paper component for creating a paper-like surface
import Paper from "@mui/material/Paper";

// Importing TabPanel and TabView from PrimeReact for tabbed navigation

// Importing React library for building user interfaces
import * as React from "react";

// Importing useState hook for managing state in functional components
import { useState } from "react";

// Importing hooks for routing and navigation
import { useLocation, useNavigate } from "react-router-dom";

// Importing API functions for fetching data related to user pages
import { fetchAllotedPagesByUserId } from "../CommonAPI";

// Importing API function for fetching pending approvals for self job creation

// Importing helper functions for token management and authentication
import { decryptTokenId, extendTokenExpiration } from "../helper/AuthService";

// Importing ActivityReviewTable component for displaying activity reviews
import ActivityReviewTable from "./ActivityReviewTable";

// Importing API function for fetching activities to review
import dayjs from "dayjs";
import {
  getActivitiesToReview
} from "./ActivityReviewerAPI";

export default function ActivityReviewer() {
  const currentPathName = useLocation().pathname; //Fetch the current url using React Hook
  const navigate = useNavigate(); //React hook to navigate to a given page
  const [jobs, setJobs] = useState([]); //Jobs whose activities are to be reviewed
  const REACT_APP_TENANTID = process.env.REACT_APP_TENANTID; //env variable to store keys of session storage
  const REACT_APP_USERID = process.env.REACT_APP_USERID; //env variable to store keys of session storage

  const user = localStorage.getItem(REACT_APP_USERID); //fetch current user from session storage
  const reviewer = decryptTokenId(user); //decrypt it
  const [filter, setFilter] = useState(""); //State to store the filtered activities to review
  const [showloader, setshowloader] = useState(true); //State to  show or hide the spinner
  const [isDisabled, setDisabled] = useState([]); //state to hold the rows whose buttons are disabled
  const [renderTrigger, setRenderTrigger] = useState(0); //state to render useEffect when  changed
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("md"));
  const allJobsEventSourceRef = React.useRef(null);
  const [dateRange, setDateRange] = useState({ fromDate: null, toDate: null });
  //Function to fetch the pages alloted to the user and navigate to restricted page if the current page is not alloted
  const fetchAllotedPages = async () => {
    try {
      const allotedPages = await fetchAllotedPagesByUserId();
      if (!allotedPages?.includes(currentPathName)) navigate("/restricted");
    } catch (e) {
      console.error(e);
    }
  };
  const handleSetFromDate = (rangeStart) => {
    setDateRange((prev) => ({
      ...prev,
      fromDate: new Date(rangeStart),
    }));
    console.log(
      "After pushing selected date:",
      dayjs(rangeStart).format("YYYY-MM-DD")
    );
  };
  const handleSetToDate = (rangeEnd) => {
    setDateRange((prev) => ({
      ...prev,
      toDate: new Date(rangeEnd),
    }));
  };
  //Function to count the activities to  be reviewed and self jobs to be reviewed
  /**
   * Function to fetch data
   * */
  const fetchData = async () => {
    try {
      // await allJobsEventSourceRef?.current?.close();
      if (dateRange.fromDate !== null && dateRange.toDate !== null) {
     //for sse
    //  allJobsEventSourceRef.current = getActivitiesToReviewSSE(
    //       reviewer,
    //       dayjs(dateRange.fromDate).format("YYYY-MM-DD"),
    //       dayjs(dateRange.toDate).format("YYYY-MM-DD"),
    //       (data) => {
    //         setJobs(data); // UI only
    //         setshowloader(false)
    //         console.log("Data in sse:", data);
    //       }
    //     );
    //   }
      
        const data=await getActivitiesToReview(
          reviewer,
          dayjs(dateRange.fromDate).format("YYYY-MM-DD"),
          dayjs(dateRange.toDate).format("YYYY-MM-DD"),
        )
            setJobs(data); // UI only
            setshowloader(false)
            console.log("Data in sse:", data);
          
      }
      // const response = await getActivitiesToReview(reviewer); //Fetch activities to review from api call
      // const data = response.data;
      // setJobs(data); //store the response in job
    } catch (error) {
      console.log("Error in reviewer fetch data", error);
    }
  };
  //Functions to be called  in useEffect
  const handleSetDateRange = (rangeStart, rangeEnd) => {

    console.log("Start Date:", rangeStart.toDate());
    setDateRange({
      fromDate: new Date(rangeStart),
      toDate: new Date(rangeEnd),
    });
  };
  const handleUseeffectFunctions = async () => {
    await extendTokenExpiration(); //Function called to extend token expiration time
    await fetchData(); //Function to fetch data
  };
  // //Functions to be called when a row is update
  const handleRenderUseEffectOnTrigger = async () => {
    await handleUseeffectFunctions();
    setDisabled([]); //reset the list which contains the activities whose buttons are disabled
  };
  // //Function to merge all functions called on useEffect in initial render
  const functionCalledOnRender = async () => {
    await fetchAllotedPages(); //Function called to fetch alloted pages
    // await handleUseeffectFunctions(); //function called to fetch data
  };

  // const closeSSE = () => {
  //     allJobsEventSourceRef.current?.close();
  // };

  //USeeffect called on interval
  React.useEffect(() => {
    handleSetDateRange(dayjs().startOf("month"), dayjs().endOf("month"));
    functionCalledOnRender();
    // return () => {
    //   closeSSE();
    // };
    // const interval = setInterval(() => {
    //   handleUseeffectFunctions();
    // }, 5000);
    // return () => clearInterval(interval);
  }, []);
  //useeffect called when an activity or self  job is updated
  React.useEffect(() => {
    handleRenderUseEffectOnTrigger();
    // return () => {
    //   closeSSE();
    // };
  }, [renderTrigger]);

  React.useEffect(() => {
    setshowloader(true)
    handleUseeffectFunctions();
    
  }, [dateRange]);

  return (
    <>
      {/* Display spinner when data is still loading */}

      <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
        <Paper elevation={1}>
          {/*Component to render to review activities */}
          <ActivityReviewTable
            showloader={showloader}
            renderTrigger={renderTrigger}
            setRenderTrigger={setRenderTrigger}
            filter={filter}
            setFilter={setFilter}
            rows={jobs}
            isDisabled={isDisabled}
            setDisabled={setDisabled}
            fromDate={dateRange.fromDate}
            toDate={dateRange.toDate}
            setFromDate={handleSetFromDate}
            setToDate={handleSetToDate}
          />
        </Paper>
      </Container>
    </>
  );
}
