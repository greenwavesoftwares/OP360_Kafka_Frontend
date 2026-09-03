import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { fetchHistoricalActivities } from "./JobPerformerAPI";
import SearchIcon from "@mui/icons-material/Search"; // Icon for search functionality

import DateField from "../components/shared/DateField/DateField.component";
import { Calendar } from "primereact/calendar";
import {
  Avatar,
  Badge,
  Box,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { formatDatetime } from "../JobAssign/helper";
import { deriveInitials, handleDownloadFileClick } from "./JobHelper";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { OverlayPanel } from "primereact/overlaypanel";
import LViewWithProps from "../Logbook/View/LViewWithProps";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload"; // Icon for download actions
import { useTheme } from "@mui/material";
import DateSelection from "./DateSelection";
import { ProgressBar } from "primereact/progressbar";

const ActivityHistory = ({
  performergroupList,fromDate,setFromDate,toDate,setToDate
}) => {
  const BoldTableCell = styled(TableCell)(({ theme }) => ({
    // Set the background color to black
    backgroundColor: "black",
    // Set the text color to white
    color: "white",
  }));

  const [activities, setActivities] = useState(null);
  const [modalInfo, setModalInfo] = useState(null); //state to hold modal info
  const [showLogbook, setShowLogbook] = useState(false); //state to show logbook
  const [logbookdata, setLogbookdata] = useState({}); //set the logbook data to empty object
  const [filter, setFilter] = useState("");
  const [loader,setLoader]=useState(false)
  const op = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    setLoader(true)
    fetchActivities(fromDate, toDate);
  }, [fromDate, toDate]);
  const fetchActivities = async (fromDate, toDate) => {
    if (fromDate && toDate) {
      const historicalActivities = await fetchHistoricalActivities(
        performergroupList,
        fromDate,
        toDate
      );
      console.log("fetch historical activities=>",historicalActivities)
      setActivities(historicalActivities);
    }
    setLoader(false)
  };
  const filteredRows = activities?.filter(
    (row) =>
      row.jobName?.toLowerCase().includes(filter?.toLowerCase()) ||
      row.activityName?.toLowerCase().includes(filter?.toLowerCase())
  );
  
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  }; //Function to update the filter

  return (
    <div>
      <Box>
        <Box
          sx={{
            display: "flex", //flexbox layout
            flexDirection: "row", //direction row
            justifyContent: "space-between", //the items are positioned evenly
            paddingBottom: "0.7rem",
            paddingTop: "2rem",
          }}
        >
          <DateSelection
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
          />

          <TextField
            id="search1"
            size="small"
            label="Search"
            placeholder="Search"
            value={filter}
            onChange={handleFilterChange}
            //Function called when filter is changed
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {/** */}
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }} //Textfield to filter the activities
          />
        </Box>

        <TableContainer
          className="dataTableStyle"
          sx={{ maxHeight: 600, scrollbarWidth: "none" }}
          component={Paper}
        >
          <Table stickyHeader>
            
              {!(filteredRows?.length > 0) && !loader && (
              <caption>No data available</caption>
            )}
            <TableHead>
              <TableRow>
                <BoldTableCell
                  sx={{ padding: 1 }}
                  align="center"
                  className="MuiDatatableTableHeader"
                >
                  <Typography
                    className={
                      isMobile || isTab
                        ? "MuiDatatableTableHeader-Font ellipsisText"
                        : "MuiDatatableTableHeader-Font"
                    }
                  >
                    Job Name
                  </Typography>
                </BoldTableCell>
                {/* Custom component to display table header in bold */}
                <BoldTableCell
                  sx={{ padding: 1 }}
                  align="center"
                  className="MuiDatatableTableHeader"
                >
                  <Typography
                    className={
                      isMobile || isTab
                        ? "MuiDatatableTableHeader-Font ellipsisText"
                        : "MuiDatatableTableHeader-Font"
                    }
                  >
                    Activity Name
                  </Typography>
                </BoldTableCell>{" "}
                <BoldTableCell
                  sx={{ padding: 1 }}
                  align="center"
                  className="MuiDatatableTableHeader"
                >
                  <Typography
                    className={
                      isMobile || isTab
                        ? "MuiDatatableTableHeader-Font ellipsisText"
                        : "MuiDatatableTableHeader-Font"
                    }
                  >
                    Approver
                  </Typography>
                </BoldTableCell>{" "}
                {/* Custom component to display table header in bold */}
                <BoldTableCell
                  sx={{ padding: 1, maxWidth: "250px" }}
                  align="center"
                  className="MuiDatatableTableHeader"
                >
                  <Tooltip
                    title={isMobile || isTab ? "Schedule Start vs Stop" : ""}
                    placement="top"
                  >
                    <Typography
                      className={
                        isMobile || isTab
                          ? "MuiDatatableTableHeader-Font ellipsisText"
                          : "MuiDatatableTableHeader-Font"
                      }
                    >
                      {/* Custom component to display table header in bold */}
                      Scheduled Start vs Stop
                    </Typography>
                  </Tooltip>
                </BoldTableCell>
                {/* <BoldTableCell align="center" >
                    Scheduled End Time
                  </BoldTableCell> */}
                <BoldTableCell
                  sx={{ padding: 1 }}
                  align="center"
                  className="MuiDatatableTableHeader"
                >
                  <Typography
                    className={
                      isMobile || isTab
                        ? "MuiDatatableTableHeader-Font ellipsisText"
                        : "MuiDatatableTableHeader-Font"
                    }
                  >
                    Activity Status
                  </Typography>
                </BoldTableCell>{" "}
                {/* Custom component to display table header in bold */}
                <BoldTableCell
                  sx={{ padding: 1, maxWidth: "250px" }}
                  align="center"
                  className="MuiDatatableTableHeader"
                >
                  <Tooltip
                    title={isMobile || isTab ? " Actual Start vs Stop" : ""}
                    placement="top"
                  >
                    <Typography
                      className={
                        isMobile || isTab
                          ? "MuiDatatableTableHeader-Font ellipsisText"
                          : "MuiDatatableTableHeader-Font"
                      }
                    >
                      Actual Start vs Stop
                    </Typography>
                  </Tooltip>
                </BoldTableCell>{" "}
                {/* Custom component to display table header in bold */}
                {/* <BoldTableCell align="center" className="MuiDatatableTableHeader">Actual End</BoldTableCell> */}
                <BoldTableCell
                  sx={{ padding: 1 }}
                  align="center"
                  className="MuiDatatableTableHeader"
                >
                  <Typography className="MuiDatatableTableHeader-Font">
                    Attachment
                  </Typography>
                </BoldTableCell>{" "}
                {/* Custom component to display table header in bold */}
                <BoldTableCell
                  sx={{ padding: 1 }}
                  align="center"
                  className="MuiDatatableTableHeader"
                >
                  <Typography className="MuiDatatableTableHeader-Font">
                    Remarks
                  </Typography>
                </BoldTableCell>{" "}
                {/* Custom component to display table header in bold */}
              </TableRow>
            </TableHead>
            <TableBody>
              {loader === true && (
                              <TableCell colSpan={10}>
                                <ProgressBar
                                  mode="indeterminate" // Indeterminate loading mode
                                  style={{ height: "6px" }} // Set height of the progress bar
                                />
                              </TableCell>
                            )}
              {!loader && filteredRows?.map(
                (
                  row,
                  index //iterate through the filtered rows to display the table rows
                ) =>
                  {
                    
                    return  (
                    <TableRow key={index}>
                      <TableCell
                        align="center"
                        className="MuiDatatableBodyPadding"
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                          }}
                        >
                          
                          <Tooltip
                            title={
                              <>
                                Job Name: {row.jobName} <br />
                                Job ID: {row.jobId}
                              </>
                            }
                            placement="right"
                          >
                            <Typography
                              sx={{
                                fontSize: "0.85rem",
                                fontWeight: "600",
                                whiteSpace: "pre-line",
                                maxWidth: "9rem",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                              }}
                            >
                              {row.jobName}
                            </Typography>
                          </Tooltip>
                        </div>
                      </TableCell>

                      <TableCell
                        align="center"
                        className="MuiDatatableBodyPadding"
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignContent: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Tooltip title={row.logbook} placement="right">
                            {row.logbook !== undefined &&
                            row.logbook !== null &&
                            row.logbook !== "" ? ( //activate logbook only when activity is started and logbook is not empty
                              <Chip
                                size="small"
                                color="info"
                                label={
                                  <span className="chip-multiline">
                                    {row.activityName}
                                  </span>
                                }
                                className="chip-wrapper"
                                onClick={() => {
                                  setShowLogbook(true);
                                  setLogbookdata({
                                    jobId: row.jobId,
                                    activityId: row.activityId,
                                  });
                                }}
                              />
                            ) : (
                              <Chip
                                size="small"
                                label={
                                  <span className="chip-multiline">
                                    {row.activityName}
                                  </span>
                                }
                                className="chip-wrapper"
                              />
                            )}
                          </Tooltip>
                          {row.enforce === true && (
                            <Tooltip title="Enforced" placement="right">
                              <Badge variant="dot" color="warning"></Badge>
                            </Tooltip>
                          )}
                          {/**Badge to show if activity is enforced */}
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip placement="top" title={row.approver}>
                          <Badge
                            sx={{
                              "& .MuiBadge-badge": {
                                backgroundColor: "#9c27b0",
                              },
                            }}
                            overlap="circular"
                          >
                            <Avatar
                              //sizes={10}
                              sx={{
                                bgcolor: "#9c27b0",
                                fontSize: "0.90rem",
                                width: "35px",
                                height: "35px",
                              }}
                            >
                              {
                                deriveInitials(row.approver) //function to derive initials of the approver
                              }
                            </Avatar>
                          </Badge>
                        </Tooltip>
                      </TableCell>
                      <TableCell
                        align="center"
                        className="MuiDatatableBodyPadding"
                      >
                        {/** show scheduled start and end time */}
                        {
                          <>
                            <p style={{ margin: "0 0 4px 0", padding: 0 }}>
                              {formatDatetime(row.scheduledActivityStartTime)}
                            </p>
                            <p style={{ margin: 0, padding: 0 }}>
                              {formatDatetime(row.scheduledActivityEndTime)}
                            </p>
                          </>
                        }
                      </TableCell>
                      {/**table cell to show activity status, the color of the chip is changed based on status */}
                      <TableCell
                        align="center"
                        className="MuiDatatableBodyPadding"
                      >
                        {
                          // table cell to display activity status
                          <Chip
                            label={row.actvityStatus}
                            size="small"
                            // change color based on activity status
                            color={
                              row.actvityStatus.toLowerCase() === "started"
                                ? "success"
                                : row.actvityStatus.toLowerCase() ===
                                  "review start"
                                ? "primary"
                                : row.actvityStatus.toLowerCase() ===
                                  "sent for approval"
                                ? "success"
                                : row.actvityStatus.toLowerCase() ===
                                  "rejected"
                                ? "error"
                                : "default"
                            }
                          ></Chip>
                        }
                      </TableCell>

                      {/* table cell to show actual start and end time */}
                      <TableCell
                        align="center"
                        className="MuiDatatableBodyPadding"
                      >
                        {
                          <>
                            <p style={{ margin: "0 0 4px 0", padding: 0 }}>
                              {row.actualActivityStartTime === null ||
                              row.actualActivityStartTime === undefined
                                ? "-"
                                : formatDatetime(row.actualActivityStartTime)}
                            </p>
                            <p style={{ margin: 0, padding: 0 }}>
                              {row.actualActivityEndTime === null ||
                              row.actualActivityEndTime === undefined
                                ? "-"
                                : formatDatetime(row.actualActivityEndTime)}
                            </p>
                          </>
                        }
                      </TableCell>
                      {/* Table cell to upload and down a file */}
                      <TableCell
                        align="center"
                        className="MuiDatatableBodyPadding"
                      >
                        <div>
                          {row.activityFileData && (
                            <Tooltip title="Download File" placement="top">
                              <IconButton
                                component="label"
                                variant="contained"
                                color="primary"
                                onClick={() =>
                                  handleDownloadFileClick(
                                    row.actFile
                                  )
                                }
                              >
                                <CloudDownloadIcon color="success" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </div>
                      </TableCell>
                      <TableCell
                        align="center"
                        className="MuiDatatableBodyPadding"
                      >
                        {row?.remarks?.length > 0 && (
                          <IconButton
                            onClick={(e) => {
                              setModalInfo({
                                header: "Reviewer Remarks",
                                content: row.remarks,
                              }); //set the modal info with the current remarks
                              op.current.toggle(e); //toggle the useRef variable to display the overlay panel
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
              )}

              
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <OverlayPanel ref={op}>{modalInfo?.content}</OverlayPanel>
      <Dialog
        visible={showLogbook}
        onHide={() => {
          setShowLogbook(false); //set the state to show logbook to false
          setLogbookdata({}); //set the logbook data to empty object
        }}
        maximizable
        blockScroll
        // style={{ width: isMobile || isTab ? "100%" : "" }}
      >
        <div>
          {/* Display the logbook data using custom component*/}
          <LViewWithProps
            jobId={logbookdata.jobId}
            activityId={logbookdata.activityId}
          ></LViewWithProps>
        </div>
      </Dialog>
    </div>
  );
};

export default ActivityHistory;
