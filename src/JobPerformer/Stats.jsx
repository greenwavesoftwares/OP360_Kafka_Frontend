import {
  Avatar,
  Badge,
  Box,
  Chip,
  Collapse,
  Grid,
  IconButton,
  Modal,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material"; // Import Material UI components
import { green, orange, red } from "@mui/material/colors"; // Import color utilities from Material UI
import React, { useEffect, useState } from "react"; // Import React and useEffect hook
import HorizontalGraph from "./HorizontalGraph"; // Import HorizontalGraph component
import JobPieChart from "./JobPiechart"; // Import JobPieChart component
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"; // Icon for downward arrow
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"; // Icon for rightward arrow
import CancelIcon from "@mui/icons-material/Cancel";
// Styled Paper component with padding
const PaddedPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  color: theme.palette.text.secondary, // Set text color
}));

// Styled TableCell component with bold text and specific background color
const BoldTableCell = styled(TableCell)(({ theme }) => ({
  // fontWeight: 'bold', // Bold font weight (commented out)
  backgroundColor: "black", // Set background color to black
  color: "white", // Set text color to white
}));
// Main Stats component
export default function Stats({ open, setOpen, data, jobDetails }) {
  // States to manage job and activity counts
  const [pendingjobs, setPendingJobs] = useState(null); // State for pending jobs
  const [approvedjobs, setApprovedJobs] = useState(null); // State for approved jobs
  const [rejectedjobs, setRejectedJobs] = useState(null); // State for rejected jobs

  const [todaysActivities, setTodaysActivities] = useState(null); // State for today's activities
  const [approvedActivities, setApprovedActivities] = useState(null); // State for approved activities
  const [rejectedActivities, setRejectedActivities] = useState(null); // State for rejected activities
  const [openRows, setOpenRows] = useState([]); //State to  track which rows are open

  //Function to expand a job and display it's activities
  const handleRowClick = (index) => {
    const newRows = Array(jobDetails?.length).fill(false); // Create a new array to track the open/closed state of each row, initialized to false
    let newOpenRows = null;
    newOpenRows = openRows?.length === 0 ? newRows : openRows; // Initialize newOpenRows; if there are no currently open rows, use the newRows array
    newOpenRows = newOpenRows.map((row, i) => {
      return i === index ? !row : false;
    });
    setOpenRows(newOpenRows); //Set the open rows with new set of values
  };
  // Function to close the modal
  const handleClose = () => setOpen(false);

  // Function to convert object to array for horizontal graph
  const convertHorizontalGraphToArray = (obj) => {
    const convertedArray = Object.keys(obj).map((date) => ({
      date: date,
      value: obj[date],
    }));
    return convertedArray; // Return the converted array
  };

  const theme = useTheme();
  // Checking if the screen size is mobile based on theme breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("md"));
  // Function to convert object to array for pie chart
  const convertPieChartToArray = (obj) => {
    const convertedArray = Object.keys(obj).map((key) => ({
      label: key === "ontime." ? "On Time" : "Late", // Set label based on key
      value: obj[key], // Set value from object
      color: key === "ontime" ? "green" : "red", // Set color based on key
    }));
    return convertedArray; // Return the converted array
  };

  // Function to render data into state variables
  const renderdata = () => {
    if (
      data &&
      Object.keys(data).length > 0 &&
      Object.keys(data.approved).length > 0
    )
      setApprovedJobs(convertHorizontalGraphToArray(data.approved));
    // Set approved jobs data
    else setApprovedJobs(null); // Set to null if no data

    if (
      data &&
      Object.keys(data).length > 0 &&
      Object.keys(data.pending).length > 0
    )
      setPendingJobs(convertHorizontalGraphToArray(data.pending));
    // Set pending jobs data
    else setPendingJobs(null); // Set to null if no data

    if (
      data &&
      Object.keys(data).length > 0 &&
      Object.keys(data.rejected).length > 0
    )
      setRejectedJobs(convertHorizontalGraphToArray(data.rejected));
    // Set rejected jobs data
    else setRejectedJobs(null); // Set to null if no data

    if (
      data &&
      Object.keys(data).length > 0 &&
      Object.keys(data.approvedactivities).length > 0
    )
      setApprovedActivities(convertPieChartToArray(data.approvedactivities));
    // Set approved activities data
    else setApprovedActivities(null); // Set to null if no data

    if (
      data &&
      Object.keys(data).length > 0 &&
      Object.keys(data.rejectedactivities).length > 0
    )
      setRejectedActivities(convertPieChartToArray(data.rejectedactivities));
    // Set rejected activities data
    else setRejectedActivities(null); // Set to null if no data

    if (
      data &&
      Object.keys(data).length > 0 &&
      Object.keys(data.todaysactivities).length > 0
    )
      setTodaysActivities(convertPieChartToArray(data.todaysactivities));
    // Set today's activities data
    else setTodaysActivities(null); // Set to null if no data
  };

  // Use effect to render data on component mount
  useEffect(() => {
    renderdata(); // Call renderdata function
  }, [data]);

  // JSX for the modal content
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="stats-modal"
      aria-describedby="stats-modal-description"
      sx={{
        marginLeft: isMobile || isTab  ? "5%" : "10%",
        display: isMobile || isTab ? "" : "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: isMobile  || isTab ? "95%" : "80%",
        height: isMobile   || isTab ? "95%" : "95%",
        overflow: "auto",
        //marginTop: isMobile  || isTab ? "auto" : "",
      }}
    >
      <>
        <Grid container spacing={2} mt={isMobile ? 0 : 3}>
          {isMobile ? (
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <PaddedPaper elevation={3} sx={{ borderRadius: 2, padding: 1 }}>
                <Grid container xs={12}>
                  <Grid
                    item
                    xs={6}
                    sx={{
                      padding: "0.1rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <Typography
                        sx={{
                          verticalAlign: "middle",
                          background: "#02b2af",
                          padding: "5px 15px",
                          color: "white",
                          fontSize: "0.85rem",
                          borderRadius: "2rem",
                        }}
                      >
                        Stats
                      </Typography>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end !important",
                      padding: "0.1rem",
                    }}
                  >
                    <IconButton onClick={handleClose}>
                      <CancelIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </PaddedPaper>
            </Grid>
          ) : (
            ""
          )}
          {/* Pending Card */}
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4} >
            <div className="gradientsBGColorOne cardBorderRadius">
            <PaddedPaper sx={{background:"none",boxShadow:0,borderBottom:"1px solid #e0bda3"}} >
              <Grid container xs={12} >
                <Grid item xs={6} sx={{ padding: "0.1rem" }}>
                  <Typography>Pending</Typography>
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={{
                    padding: "0.1rem 0.5rem 0.1rem 0.1rem",
                    alignItems: "center",
                    alignContent: "center",
                    justifyContent: "flex-end",
                    justifyItems: "flex-end",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    columnGap="1.2rem"
                    //sx={{ width: "100%" }}
                  >
                    {/* Badges for low, normal, and critical priority jobs */}
                    <Tooltip title="Low Priority Job">
                      <Badge
                        color="info"
                        //sx={{ fontSize: "10rem" }}
                        badgeContent={data?.criticalitycount?.low}
                        showZero
                      ></Badge>
                    </Tooltip>
                    <Tooltip title="Normal Priority Job">
                      <Badge
                        color="success"
                        badgeContent={data?.criticalitycount?.normal}
                        showZero
                      ></Badge>
                    </Tooltip>
                    {/*Badge for critical priority job*/}
                    <Tooltip title="Critical Priority Job">
                      <Badge
                        color="error"
                        badgeContent={data?.criticalitycount?.critical}
                        showZero
                      ></Badge>
                    </Tooltip>
                  </Stack>
                </Grid>
              </Grid>
            </PaddedPaper>

            <PaddedPaper sx={{background:"none",boxShadow:0}}>
              <Grid container xs={12}>
                <Grid item xs={6} sx={{ padding: "0.1rem" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      //justifyContent: "space-between",
                      columnGap: "0.5rem",
                      
                    }}
                  >
                    <Typography>Job</Typography>
                    <Avatar
                      sx={{
                        bgcolor: orange[600],
                        width: 24,
                        height: 24,
                        fontSize: "0.95rem",
                        // marginLeft: 10,
                      }}
                    >
                      {data?.jobCountBasedOnStatus?.notstarted}
                    </Avatar>
                  </div>
                </Grid>
                <Grid item xs={6} sx={{ padding: "0.1rem" }}>
                  <div
                    //elevation={3}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      columnGap: "0.5rem",
                    }}
                  >
                    <Typography sx={{ marginLeft: "0.5rem" }}>
                      Activity
                    </Typography>
                    <Avatar
                      sx={{
                        bgcolor: orange[500],
                        width: 24,
                        height: 24,
                        fontSize: "0.95rem",
                        
                      }}
                    >
                      {data?.activityCountBasedOnStatus?.notstarted}
                    </Avatar>
                  </div>
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={{ padding: "0.1rem", borderRight: "1px solid #e0bda3" }}
                >
                  <HorizontalGraph dataset={pendingjobs} />
                </Grid>

                <Grid item xs={6} sx={{ padding: "0.1rem" }}>
                  <JobPieChart
                    dataset={todaysActivities}
                    label={"Today's Glance"}
                    nullvalue={"No activity to display"}
                  />
                </Grid>
              </Grid>
            </PaddedPaper>
            </div>
          </Grid>
          {/* Approved Card */}
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <div className="gradientsBGColorTwo cardBorderRadius">
            <PaddedPaper sx={{background:"none",boxShadow:0,borderBottom:"1px solid #d4dbb0"}}>
              <Grid container xs={12}>
                <Grid item xs={6} sx={{ padding: "0.1rem" }}>
                  <Typography>Approved</Typography>
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={{
                    padding: "0.1rem",
                    alignItems: "center",
                    alignContent: "center",
                    justifyContent: "flex-end",
                    justifyItems: "flex-end",
                  }}
                ></Grid>
              </Grid>
            </PaddedPaper>

            <PaddedPaper sx={{background:"none",boxShadow:0}}>
              <Grid container xs={12}>
                <Grid item xs={6} sx={{ padding: "0.1rem" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      //justifyContent: "space-between",
                      columnGap: "0.5rem",
                    }}
                  >
                    <Typography>Job</Typography>
                    <Avatar
                      sx={{
                        bgcolor: green[600],
                        width: 24,
                        height: 24,
                        fontSize: "0.95rem",
                        // marginLeft: 10,
                      }}
                    >
                      {data?.jobCountBasedOnStatus?.approved}
                    </Avatar>
                  </div>
                </Grid>
                <Grid item xs={6} sx={{ padding: "0.1rem" }}>
                  <div
                    //elevation={3}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      columnGap: "0.5rem",
                    }}
                  >
                    <Typography sx={{ marginLeft: "0.5rem" }}>
                      Activity
                    </Typography>
                    <Avatar
                      sx={{
                        bgcolor: green[500],
                        width: 24,
                        height: 24,
                        fontSize: "0.95rem",
                      }}
                    >
                      {data?.activityCountBasedOnStatus?.approved}
                    </Avatar>
                  </div>
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={{ padding: "0.1rem", borderRight: "1px solid #d4dbb0" }}
                >
                  <HorizontalGraph dataset={approvedjobs} />
                </Grid>

                <Grid item xs={6} sx={{ padding: "0.1rem" }}>
                  <JobPieChart
                    label={"Approved Activity"}
                    dataset={approvedActivities}
                    nullvalue={"No activity to display"}
                  />
                </Grid>
              </Grid>
            </PaddedPaper>
            </div>
          </Grid>
          {/* Rejected Card */}
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <div className="gradientsBGColorThree cardBorderRadius">
            <PaddedPaper sx={{background:"none",boxShadow:0,borderBottom:"1px solid #d0bebe"}}>
              <Grid container xs={12}>
                <Grid item xs={6} sx={{ padding: "0.1rem" }}>
                  <Typography>Rejected</Typography>
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={{
                    padding: "0.1rem",
                    alignItems: "center",
                    alignContent: "center",
                    justifyContent: "flex-end",
                    justifyItems: "flex-end",
                  }}
                ></Grid>
              </Grid>
            </PaddedPaper>

            <PaddedPaper sx={{background:"none",boxShadow:0,}}>
              <Grid container xs={12}>
                <Grid item xs={6} sx={{ padding: "0.1rem" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      //justifyContent: "space-between",
                      columnGap: "0.5rem",
                    }}
                  >
                    <Typography>Job</Typography>
                    <Avatar
                      sx={{
                        bgcolor: red[600],
                        width: 24,
                        height: 24,
                        fontSize: "0.95rem",
                        // marginLeft: 10,
                      }}
                    >
                      {data?.jobCountBasedOnStatus?.rejected}
                    </Avatar>
                  </div>
                </Grid>
                <Grid item xs={6} sx={{ padding: "0.1rem" }}>
                  <div
                    //elevation={3}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      columnGap: "0.5rem",
                    }}
                  >
                    <Typography sx={{ marginLeft: "0.5rem" }}>
                      Activity
                    </Typography>
                    <Avatar
                      sx={{
                        bgcolor: red[500],
                        width: 24,
                        height: 24,
                        fontSize: "0.95rem",
                      }}
                    >
                      {data?.activityCountBasedOnStatus?.rejected}
                    </Avatar>
                  </div>
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={{ padding: "0.1rem", borderRight: "1px solid #d0bebe" }}
                >
                  <HorizontalGraph dataset={rejectedjobs} />
                </Grid>

                <Grid item xs={6} sx={{ padding: "0.1rem" }}>
                  {/* Pie chart to display rejected activity */}
                  <JobPieChart
                    label={"Rejected Activity"}
                    dataset={rejectedActivities}
                    nullvalue={"No activity to display"}
                  />
                </Grid>
              </Grid>
            </PaddedPaper>
            </div>
          </Grid>
        </Grid>
        <br />
        {/* Table for displaying job details */}
        {!isMobile ? (
           <Grid container xs={12}>
            <Grid item xs={12}>
          <PaddedPaper>
            <Typography variant="h6" sx={{color:"black",textTransform:"capitalize",fontSize:"1rem",paddingBottom:"0.4rem"}}>The most recent 10 top jobs</Typography>
          <TableContainer component={Paper} sx={{ maxHeight: "35vh" }} >
            <Table stickyHeader aria-label="collapsible table">
              <TableHead>
                <TableRow >
                  <BoldTableCell  className="MuiDatatableTableHeader"></BoldTableCell >
                  <BoldTableCell align="center" sx={{color:"black"}} className="MuiDatatableTableHeader">Job Name</BoldTableCell>
                  <BoldTableCell align="center" sx={{color:"black"}}  className="MuiDatatableTableHeader">Status</BoldTableCell>
                </TableRow>
              </TableHead>
              {/* Table body to display jobs */}
              <TableBody>
                {jobDetails?.map((job, index) => (
                  <React.Fragment key={index}>
                    <TableRow key={index}>
                      <TableCell className="MuiDatatableBodyPadding">
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => handleRowClick(index)}
                        >
                          {openRows[index] ? (
                            <KeyboardArrowDownIcon />
                          ) : (
                            <KeyboardArrowRightIcon />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell align="center" className="MuiDatatableBodyPadding">{job.jobName}</TableCell>
                      <TableCell align="center" className="MuiDatatableBodyPadding">
                        <Chip
                          label={job.jobStatus}
                          size="small"
                          color={
                            job.jobStatus.toLowerCase() === "started"
                              ? "success"
                              : job.jobStatus.toLowerCase() === "completed"
                              ? "primary"
                              : job.jobStatus.toLowerCase() ===
                                "sent for approval"
                              ? "success"
                              : job.jobStatus.toLowerCase() === "rejected"
                              ? "error"
                              : "default"
                          }
                        />
                      </TableCell>
                    </TableRow>
                    {/**Subtable for displaying activities */}
                    {openRows[index] && (
                      <TableRow >
                        <TableCell colSpan={12} sx={{padding:'0'}}>
                          <Collapse
                            in={openRows[index]}
                            timeout="auto"
                            unmountOnExit
                          >
                            {/* collapsible table which contains the details of the activities
                             * for the expanded job
                             */}
                            <Box>
                              <Table size="small" aria-label="purchases">
                                <TableHead>
                                  <TableRow>
                                    <TableCell
                                      className="Expanded-MuiDatatableTableHeader"
                                      sx={{ color: "white" }}
                                      align="center"
                                    >
                                      Activity Name
                                    </TableCell>
                                    <TableCell
                                      className="Expanded-MuiDatatableTableHeader"
                                      sx={{ color: "white" }}
                                      align="center"
                                    >
                                      Status
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {job.task.activityList.map(
                                    (activity, activityIndex) => (
                                      <TableRow key={activityIndex}>
                                        <TableCell align="center">
                                          <Chip
                                          size="small"
                                            label={activity.activityName}
                                            color={
                                              activity.enforce === true
                                                ? "warning"
                                                : "default"
                                            }
                                          />
                                        </TableCell>
                                        <TableCell align="center">
                                          <Chip
                                          size="small"
                                            label={activity.actvityStatus}
                                            color={
                                              activity.actvityStatus.toLowerCase() ===
                                              "started"
                                                ? "success"
                                                : activity.actvityStatus.toLowerCase() ===
                                                  "completed"
                                                ? "primary"
                                                : activity.actvityStatus.toLowerCase() ===
                                                  "sent for approval"
                                                ? "success"
                                                : activity.actvityStatus.toLowerCase() ===
                                                  "rejected"
                                                ? "error"
                                                : "default"
                                            }
                                          />
                                        </TableCell>
                                      </TableRow>
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          </PaddedPaper>
          </Grid>
          </Grid>
        ) : (
          ""
        )}
      </>
    </Modal>
  );
}
