// Importing specific icons from Material-UI for use in the application
import CloseIcon from "@mui/icons-material/Close"; // Icon for closing actions
import DoneIcon from "@mui/icons-material/Done"; // Icon for indicating completion or success
import SearchIcon from "@mui/icons-material/Search"; // Icon for search functionality

// Importing components from Material-UI for building user interfaces
import {
  Avatar, // Component for displaying user images or initials
  Button, // Standard button component for user interactions
  Chip, // Component for displaying small blocks of information
  InputAdornment, // Component for adding adornments to input fields (like icons)
  TextField, // Component for user input fields
  Tooltip // Component for displaying informative tooltips on hover
} from "@mui/material";

import Box from "@mui/material/Box"; // A wrapper component for layout and styling
import IconButton from "@mui/material/IconButton"; // Button component for icons
import Paper from "@mui/material/Paper"; // Component that provides a material design paper effect
import Table from "@mui/material/Table"; // Component for displaying tabular data
import TableBody from "@mui/material/TableBody"; // Component for the body of the table
import TableCell from "@mui/material/TableCell"; // Component for individual cells in the table
import TableContainer from "@mui/material/TableContainer"; // Component for wrapping the table
import TableHead from "@mui/material/TableHead"; // Component for the header of the table
import TableRow from "@mui/material/TableRow"; // Component for individual rows in the table
import Typography from "@mui/material/Typography"; // Component for displaying text with styles
import { deepPurple } from "@mui/material/colors"; // Color palette for theming

// Importing components from PrimeReact for additional UI features
import { Panel } from "primereact/panel"; // Component for collapsible panels

// Importing React and hooks for building functional components
import React, { useRef, useState } from "react"; // React library and hooks for state management and references

// Importing hooks from React Router for navigation
import { useNavigate } from "react-router-dom"; // Hook for programmatic navigation

// Importing API functions for handling job-related actions
import { reviewForSelfAssignedJob } from "../SelfJobCreation/SelfJobCreationAPI"; // API call for reviewing jobs
import { getLocalVariablesForSelfJob, setLocalVariablesForSelfJob } from "../SelfJobCreation/SelfJobHelper"; // Helper function for setting local job variables

// Importing a dialog component for displaying remarks
import RemarksDialog from "../ActivityReviewer/RemarksDialog"; // Component for showing remarks in a dialog

// Importing utility functions for job-related operations
import { delay, deriveInitials } from "../JobPerformer/JobHelper"; // Function to derive initials from names
import { formatDatetime } from "../JobAssign/helper"; // Function for formatting date and time
import { ProgressBar } from "primereact/progressbar";

const styles = {
  typography: {
    fontSize: "0.9rem",
    color: "white",
    fontWeight: 400,
  },
  jobHead: {
    backgroundColor: "#263238",
    padding: "12px",
  },
  activityHead: {
    backgroundColor: "#546e7a",
  },
  tableCell: {
    padding: "10px",
  },
};

export default function SelfJobTable({
  rows,//property to hold the self jobs to review
  filter,//property to hold the filter
  setFilter,//property to set the filter
  showloader,
  renderTrigger,
  setRenderTrigger,
  isDisabled,
  setDisabled
}) {
  const [remarks, setRemarks] = useState(null);//state to add remarks for a self job
  const [openDialog, setOpenDialog] = useState(false);//state to open dialog when a self job is to be reviewed
  const [jobHandleConfirm, setJobHandleConfirm] = useState(null);//state to hold the job
  const [activityHandleConfirm, setActivityHandleConfirm] = useState(null);
  const [valueHandleConfirm, setValueHandleConfirm] = useState(null);//state to hold the status of the job
  const [confirmLabel,setConfirmLabel]=useState(null)//state to hold the label of confirmation popup
  
  const navigate = useNavigate();//react hook to navigate to a given pages
  /*Function to set filter */
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };
  const filteredRows = rows?.filter((row) => row.jobname?.toLowerCase().includes(filter?.toLowerCase())
    );//update the filtered rows based on filter change

  //Function to handle confirm  button click for popup
  const handleConfirm = () => {
    setDisabled([...isDisabled, jobHandleConfirm]); //set the jobs to be disabled
            
    handleApproveReject(
      jobHandleConfirm,
      activityHandleConfirm,
      valueHandleConfirm
    );
    //reset the states used in the popup
    setOpenDialog(false);
    setJobHandleConfirm(null);
    setActivityHandleConfirm(null);
    setValueHandleConfirm(null);
    setConfirmLabel(null)
    setRemarks(null)
  };
  //function to reset the states used in popup
  const handleCancel=()=>{
     setDisabled((prev) => prev.filter((item) => item !== jobHandleConfirm));
           
    setOpenDialog(false);
    setJobHandleConfirm(null);
    setActivityHandleConfirm(null);
    setValueHandleConfirm(null);
    setRemarks(null)
    setConfirmLabel(null)
  }
  //Function to redirect to logbook
  async function handleLinkClick(row) {
    const lv=getLocalVariablesForSelfJob(
      row.jobid,
      row.activityid,
      row.jobname,
      row.reviewer,
      row.performer,
      row.status,
      row.remarks,
      row.formname,
      row.logbookversion,
      row.activitystarttime,
      row.activityendtime,
      row.reviewstarttime
    );//call function to fetch details of the self  job into local storage
    lv.formId=row.logbookid;
    console.log("Logbook row:",row)
    console.log("Logbook view:",lv)
    navigate("/workflow/LogbookForm",{state:lv});//navigate to logbook

    
  }
  //Function called to open a dialog which wll confirm if the user wants to update the job
  const handleDialogOpen = (job,  value) => {
    setOpenDialog(true);//state to open the dialog box
    setJobHandleConfirm(job);//state to  hold the job details to be confirmed
    setValueHandleConfirm(value);//state to hold the status
    setConfirmLabel(value==='Approved'?'Approve':"Reject")//state to hold the confirmation label
  };
  
  
  /**
   * 
   * @param {*} obj 
   * Function called when review is started for a given self job
   */
  const handleReview = async(obj) => {
    setDisabled([...isDisabled, obj]); //set the jobs to be disabled
    
    console.log("Handle Review")
    let updatedRow = {
      ...obj,
      remarks: remarks,//add remarks for the given self job
      reviewstarttime: new Date(),//add review start time
      status: "Review Started",//add the status
    };
    await reviewForSelfAssignedJob(updatedRow);//function called to  update the self job details in the database
    // await delay(4000)
    setDisabled((prev) => prev.filter((item) => item !== obj));
  
    setRenderTrigger(renderTrigger+1)
    setRemarks(null);//reset the remarks
  };
  /**
   * Function called when a self job is to be approved or rejected
   */
  const handleApproveReject = async () => {
    setDisabled([...isDisabled, jobHandleConfirm]); //set the jobs to be disabled
        
    let updatedRow = {
      ...jobHandleConfirm,//fetch other details of the self job from the state
      remarks: remarks,//add remarks in the self job
      reviewendtime: new Date(),//add reviewer end time in the self job
      status: valueHandleConfirm,//add the status  of the self job
      
    };
    console.log("Job To Review:",updatedRow)
    await reviewForSelfAssignedJob(updatedRow);//function called to update job in database
    setRenderTrigger(renderTrigger+1)
    // await delay(4000)
     setDisabled((prev) => prev.filter((item) => item !== jobHandleConfirm));
               
  };
  const ref = useRef(null);//react hook to directly access a DOM element in your JSX

  return (
    <Box>{/**Box to wrap the self job table */}
      {/* Panel to minimize or maximize the self  job table */}
      <Panel
      className="tabViewStyle forBorderRadius noPadding HeaderStyle"
        ref={ref}
        header={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              width: "100%",
              padding: "0.5rem 0rem",
              marginLeft:"0.5rem",
            }}
          >
            <TextField
              size="small"
              id="search1"
              label="Search"
              value={filter}
              placeholder="Search"
              onChange={handleFilterChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        }
        
      >
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: 1000,
            border: "1px solid #e0e0e0",
            boxShadow: "none",scrollbarWidth: 'none'
          }}
        >
          <Table aria-label="table" stickyHeader>
            {/* Table header */}
            {!filteredRows?.length>0&& !showloader&&
            <caption>No data available</caption>
            }
            <TableHead>
              <TableRow sx={{ width: "max-content" }}>
                <TableCell align="center" className="MuiDatatableTableHeader">
                  <Typography className="MuiDatatableTableHeader-Font">
                    Job Name
                  </Typography>
                </TableCell>
                <TableCell align="center" className="MuiDatatableTableHeader">
                  <Typography className="MuiDatatableTableHeader-Font">
                    Logbook
                  </Typography>
                </TableCell>

                <TableCell align="center" className="MuiDatatableTableHeader">
                  <Typography className="MuiDatatableTableHeader-Font">
                    Performer
                  </Typography>
                </TableCell>
                <TableCell align="center" className="MuiDatatableTableHeader">
                  <Typography className="MuiDatatableTableHeader-Font">
                    Start Time
                  </Typography>
                </TableCell>

                <TableCell align="center" className="MuiDatatableTableHeader"> 
                  <Typography className="MuiDatatableTableHeader-Font">
                    End Time
                  </Typography>
                </TableCell>
                <TableCell align="center" className="MuiDatatableTableHeader">
                  <Typography className="MuiDatatableTableHeader-Font">
                    Remarks
                  </Typography>
                </TableCell>
                <TableCell align="center" className="MuiDatatableTableHeader">
                  <Typography className="MuiDatatableTableHeader-Font">
                    Action
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {showloader&&
              <TableCell colSpan={10}>
              <ProgressBar
                      mode="indeterminate" // Indeterminate loading mode
                      style={{ height: "6px" }} // Set height of the progress bar
                    />
                    </TableCell>
                    }
              {/* iterate through the self jobs to render the table */}
              {!showloader&&filteredRows?.map((row, index) => {
                return (
                  <React.Fragment key={index}>
                    <TableRow key={index}>
                      <TableCell align="center">
                        <Tooltip title={row.jobid}>
                          <Chip label={row.jobname} />
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        {/* activate the logbook to view when review is started */}
                        {row.status.trim().toLowerCase() ===
                          "review started" && (
                          <Chip
                            sx={{ fontSize: "0.9rem", fontWeight: 400 }} color="primary"
                            onClick={() => {
                              handleLinkClick(row);
                            }} label={row.formname}
                          />
                        )}
                        {/* if the review is not started then just display the logbook name */}
                        {row.status.trim().toLowerCase() !==
                          "review started" && (
                          <Chip
                            sx={{ fontSize: "0.9rem", fontWeight: 400 }}
                            label={row.formname}
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                      <div style={{display:"grid",justifyItems:"center"}}>
                        {/* tooltip to display performer name on hover */}
                        <Tooltip title={row.performer}>
                          <Avatar
                            sx={{
                              bgcolor: deepPurple[500],
                            }}
                            style={{
                              width: "30px",
                              height: "30px",
                              fontSize: "0.85rem",
                            }}
                          >
                            {/* function called to find the initials from a userid */}
                            {deriveInitials(row.performer)}
                          </Avatar>
                        </Tooltip>
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        {/* function called to format date time*/}
                        {formatDatetime(row.activitystarttime)}
                      </TableCell>
                      <TableCell align="center">
                        {/* function called to format date time*/}
                        {formatDatetime(row.activityendtime)}
                      </TableCell>
                      <TableCell align="center">
                        
                          <Typography>{row.remarks}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        {/* If the status of the activity is Sent for approval then write the button name as start review */}
                        {row.status.trim().toLowerCase() ===
                          "sent for approval" && (
                          <Button
                            variant="contained"
                            color="info"
                            size="small"
                            onClick={() => handleReview(row)}
                            disabled={isDisabled.includes(row)}
                            // disabled={isDisabled.includes(activity)}
                          >
                            <Typography fontSize="10px">
                              Start Review
                            </Typography>
                          </Button>
                        )}
                        {/* If the status of the activity is review started then keep buttons for approve and reject */}
                        
                        {row.status.trim().toLowerCase() ===
                          "review started" && (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <Tooltip title="Approve">
                              <IconButton
                                variant="contained"
                                color="success"
                                disabled={isDisabled.includes(row)}
                                onClick={() =>
                                  handleDialogOpen(row, "Approved")
                                }
                                // disabled={isDisabled.includes(activity)}
                              >
                                <DoneIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject">
                              <IconButton
                                color="error"
                                onClick={() =>
                                  handleDialogOpen(row, "Rejected")
                                }
                                // disabled={isDisabled.includes(activity)}
                              >
                                <CloseIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
          {/*Custom Component to input remarks while confirming update */}
          <RemarksDialog
            setOpen={setOpenDialog}
            open={openDialog}
            proceedButtonClick={handleConfirm}
            handleClose={handleCancel}
            confirmLabel={confirmLabel}
            remarks={remarks}
            setRemarks={setRemarks}
          />
          
          </TableContainer>
      </Panel>
    </Box>
  );
}
