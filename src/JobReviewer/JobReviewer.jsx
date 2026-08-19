// Importing necessary components and libraries
import {
  Badge,
  Box, // A wrapper component for layout
  Container, // A responsive fixed-width container
  Grid, // A grid layout component for responsive design
  Paper, // A component that provides a material design paper effect
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"; // Importing Material-UI components
import React, { useEffect, useState } from "react"; // Importing React and hooks for managing component lifecycle and state
import { useLocation, useNavigate } from "react-router-dom"; // Importing hooks for routing and navigation
import { fetchAllotedPagesByUserId } from "../CommonAPI"; // Function to fetch allotted pages based on user ID
import { decryptTokenId, extendTokenExpiration } from "../helper/AuthService"; // Functions for token management
import { getPendingApprovalsForSelfJob } from "../SelfJobCreation/SelfJobCreationAPI";
import ApprovedTable from "./ApproveTable"; // Importing the component for displaying approved items
import { fetchJobsToReview} from "./JobReviewerAPI"; // Function to fetch jobs that need review
import SelfJobTable from "./SelfJobTable";
// Importing TabPanel and TabView from PrimeReact for tabbed navigation
import dayjs from "dayjs";
import { TabPanel, TabView } from "primereact/tabview";
import { getCurrentUser } from "../UserModuleUpdated/helper";

// Styled component for Paper with padding
const PaddedPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2), // Applying padding from theme
  color: theme.palette.text.secondary, // Setting text color from theme
}));
const JobReviewer = () => {
  const REACT_APP_TENANTID = process.env.REACT_APP_TENANTID; //constant to store encrypted tenant from session storage
  const REACT_APP_USERID = process.env.REACT_APP_USERID; //constant to store encrypted tenant from userid
  const [selfjobfilter, setSelfjobfilter] = useState(""); //state to store filter of self jobs
  const [selfjobs, setSelfJobs] = useState([]); //Self jobs to be reviewed
  const [isJobReviewer, setIsJobReviewer] = useState(0); //state to change tabs from activities to review and  self jobs to review
  const [jobs, setJobs] = useState([]); //state to store all jobs
  const [filter, setFilter] = useState(""); //state to store filtered jobs
  const currentPathName = useLocation().pathname; //React hook to fetch current path
  const navigate = useNavigate(); //React hook to navigate to a path
  // const reviewer='info@greenwave.co.in'
  const user = localStorage.getItem(REACT_APP_USERID); //fetch user from session storeage
  const reviewer = decryptTokenId(user); //decrypt user
  const [showloader, setshowloader] = useState(true); //state to show spinner before data load
  const [isDisabled, setDisabled] = useState([]); //state to disable a row when a button is clicked for that row
  const [renderTrigger, setRenderTrigger] = useState(0); //state to render useeffect when a row is updated
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("md"));
  const allJobsToReview = React.useRef(null);
  const selfJobsToReview=React.useRef(null)
  const [dateRange, setDateRange] = useState({ fromDate: null, toDate: null });
  //Function to fetch the pages alloted to the user and navigate to restricted page if the current page is not alloted
  const fetchAllotedPages = async () => {
    try {
      const allotedPages = await fetchAllotedPagesByUserId();
      if (!allotedPages?.includes(currentPathName)) navigate("/restricted");
    } catch (e) {
      console.error("Error in fetching alloted pages", e);
    }
  };
  const countJobsAndSelfJobs = () => {
    let selfjobcount = selfjobs?.length; //Length of self jobs to be reviewed
    let jobcount = jobs?.length;
    //find the length of jobs to reviewed from the state jobs
    return { jobcount, selfjobcount }; //Wrap the counts in an object
  };
  //Functions to be called  in useEffect
  const handleSetDateRange = (rangeStart, rangeEnd) => {
    console.log("Start Date:", rangeStart.toDate());
    setDateRange({
      fromDate: new Date(rangeStart),
      toDate: new Date(rangeEnd),
    });
  };
  const handleSetFromDate = (rangeStart) => {
    setDateRange((prev) => ({
      ...prev,
      fromDate: new Date(rangeStart),
    }));
    console.log(
      "After pushing selected date:",
      dayjs(rangeStart).format("YYYY-MM-DD"),
    );
  };
  const handleSetToDate = (rangeEnd) => {
    setDateRange((prev) => ({
      ...prev,
      toDate: new Date(rangeEnd),
    }));
  };

  /**
   * Function to fetch data to review jobs
   */
  const fetchData = async () => {
    try {
      console.log("Fetch data")
      // await selfJobsToReview?.current?.close()
      const user=getCurrentUser()
      const selfJobsToReviewRequested= await getPendingApprovalsForSelfJob(user)
          
            setSelfJobs(selfJobsToReviewRequested)
            
      // selfJobsToReview.current= await getPendingApprovalsForSelfJob(
      //     (data) => {
      //       //Function which calls an api to fetch data from db
           
      //       setSelfJobs(data)
      //       setshowloader(false)
      //     },
      //   );
      
      // await allJobsToReview?.current?.close();
      if (dateRange.fromDate !== null && dateRange.toDate !== null) {
        const allJobsToReviewRequested= await fetchJobsToReview(dayjs(dateRange.fromDate).format("YYYY-MM-DD"),
          dayjs(dateRange.toDate).format("YYYY-MM-DD"),
          )
          let jobDetails = allJobsToReviewRequested.map((job) => ({
              ...job,
              reviewStarted: isReviewStarted(job),
            }));

            setJobs(jobDetails);
            setshowloader(false)
            //For sse
        // allJobsToReview.current =  fetchJobsToReviewSSE(
        //   dayjs(dateRange.fromDate).format("YYYY-MM-DD"),
        //   dayjs(dateRange.toDate).format("YYYY-MM-DD"),
          
        //   (data) => {
        //     //Function which calls an api to fetch data from db
        //     let jobDetails = data.map((job) => ({
        //       ...job,
        //       reviewStarted: isReviewStarted(job),
        //     }));

        //     setJobs(jobDetails);
        //     setshowloader(false)
        //   },
        // );
      }
      setshowloader(false)
    } catch (error) {
      console.log("Error in fetchData", error);
    }
  };
  /**
   * Checks if all activities of a job have been reviewed
   * @param {Object} row - The job to check
   * @returns {Boolean} True if all activities have been reviewed, false otherwise
   */
  const isReviewStarted = (row) => {
    // Check if all activities have been reviewed
    const check = row.task.activityList.every((activity) => {
      return (
        activity.actvityStatus === "Completed" ||
        activity.actvityStatus === "Aborted"
      );
    });

    return check; // Return the result
  };

  //Function wrapped to be called in use effect
  const handleUseeffectFunctions = async () => {
    await extendTokenExpiration(); //function to extend token

    await fetchData(); //Function to fetch data
  };
  // const closeSSE = () => {
  //   allJobsToReview.current?.close();
  //   selfJobsToReview.current?.close()
  // };
  
  React.useEffect(() => {
    handleSetDateRange(dayjs().startOf("month"), dayjs().endOf("month"));
    fetchAllotedPages();
    // handleUseeffectFunctions();
    // return () => {
    //   closeSSE();
    // };
  }, []);
  //Useeffect called when a row is updated for job details array
  useEffect(() => {
    handleUseeffectFunctions();
    setDisabled([]); //Reset the rows whose start/stop buttons are disabled
    
  }, [renderTrigger]);
  useEffect(() => {
    setshowloader(true)
    handleUseeffectFunctions();
    setDisabled([]); //Reset the rows whose start/stop buttons are disabled
    console.log("After date is changed:");
    
  }, [dateRange]);
  //Return the component to be displayed
  return (
    <div>
      <>
        {/* Container which wraps the jobs to review */}
        <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
          <Grid container columnSpacing={2}></Grid>
          <Grid container mt={isMobile || isTab ? 0 : 3}>
            <Grid item xs={12}>
              <TabView
                activeIndex={isJobReviewer}
                onTabChange={(e) => setIsJobReviewer(e.index)}
                className="tabViewStyle noPadding"
              >
                <TabPanel
                  header={
                    <Badge
                      badgeContent={countJobsAndSelfJobs().jobcount}
                      color="info"
                    >
                      <Typography>Jobs To Review</Typography>
                    </Badge>
                  }
                >
                  <PaddedPaper elevation={3} sx={{ padding: "0.5rem" }}>
                    <Box sx={{ width: "100%", typography: "body1" }}>
                      {/* Component which contains the jobs to review */}
                      <ApprovedTable
                        renderTrigger={renderTrigger}
                        setRenderTrigger={setRenderTrigger}
                        filter={filter}
                        setFilter={setFilter}
                        rows={jobs}
                        isDisabled={isDisabled}
                        setDisabled={setDisabled}
                        showloader={showloader}
                        fromDate={dateRange.fromDate}
                        toDate={dateRange.toDate}
                        setFromDate={handleSetFromDate}
                        setToDate={handleSetToDate}
                      />
                    </Box>
                  </PaddedPaper>
                </TabPanel>
                <TabPanel
                  header={
                    <Badge
                      badgeContent={countJobsAndSelfJobs().selfjobcount}
                      color="info"
                    >
                      <Typography>Self Jobs To Review</Typography>
                      {/*Header of self job tab */}
                    </Badge>
                  }
                >
                  <Paper elevation={1}>
                    {/*Component to render to review self jobs */}
                    <SelfJobTable
                      renderTrigger={renderTrigger}
                      setRenderTrigger={setRenderTrigger}
                      filter={selfjobfilter}
                      setFilter={setSelfjobfilter}
                      rows={selfjobs}
                      isDisabled={isDisabled}
                      setDisabled={setDisabled}
                      showloader={showloader}
                    />
                  </Paper>
                </TabPanel>
              </TabView>
            </Grid>
          </Grid>
        </Container>
      </>
      {/* )} */}
    </div>
  );
};

export default JobReviewer;
