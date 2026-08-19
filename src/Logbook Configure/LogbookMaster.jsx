import React, { useEffect, useState } from "react";
import Badge from "@mui/material/Badge";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  Container,
  Typography,
  Paper,
  Box,
  Tooltip,
  Fab,
  Avatar,
  LinearProgress,
} from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";
import {
  getAllCellInfoByFormNameAndVersion,
  getAllFormInfo,
} from "../Logbook/LogbookApi";
import { SpeedDial } from "primereact/speeddial";
import { Chip as MuiChip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ConfigureLogbook from "./ConfigureLogbook";
import { updateFormActiveStatus } from "./ConfigureLogbookAPI";
import SnackbarComponent from "../components/shared/snackbar/customSnackbar";
import { Tag } from "primereact/tag";
import { Chip } from "primereact/chip";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { ProgressBar } from "primereact/progressbar";
import { Dialog } from "primereact/dialog";
import LogbookForm from "../Logbook/View/LogbookForm";
import SwitchButton from "./SwitchButton";
import MicToggle from "./MicToggle";
import { styled, useTheme } from "@mui/material/styles";
//CSS
import "../style/components/DataTable/DataTable.css";
import infoCard from "../style/components/Card/InformationCard.module.css";
import card from "../style/components/Card/card.module.css";
import infoButton from "../style/components/Button/infoButton.module.css";
import DialogStyle from "../style/components/Dialog/Dialog.module.css";
//Icon
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";

const LogbookMaster = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTab = useMediaQuery(theme.breakpoints.down("md"));
  const [showCreation, setShowCreation] = useState(false);
  const [allForms, setAllForms] = useState([]);
  const [tableForm, setTableForm] = useState(null);
  const [snackbarText, setSnackbarText] = useState("Data saved !"); // Text for the snackbar notification
  const [snackbarSeverity, setsnackbarSeverity] = useState("success"); // Severity level for the snackbar (success, error, etc.)
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Boolean to control snackbar visibility
  const [isViewLogbook, setIsViewLogbook] = useState(false);
  const [loader, setLoader] = useState(false);
  const [logData, setLogData] = useState([]);

  const [rowId, setRowId] = useState(false);
  const [logbookFormName, setLogbookFormName] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoader(true);
    getAllForms();
  }, []);

  const getAllForms = async () => {
    const allForms = await getAllFormInfo();
    if (allForms) {
      setAllForms(allForms);
    }
    setLoader(false);
  };
  // Function to get initials from an email address
  const getInitials = (email) => {
    if (!email) {
      // Check if email is not provided
      return "NA"; // Return 'NA' if no email
    }
    const namePart = email?.split("@")[0]; // Get the part of email before '@'
    const nameParts = namePart?.split(" "); // Split the name part by '.'
    const initials = nameParts
      .map((part) => part.charAt(0).toUpperCase()) // Get the first character of each part and convert to uppercase
      .join(""); // Join the initials together
    return initials; // Return the initials
  };

  // Render the "Status" column with colored labels
  const activeStatusBodyTemplate = (rowData) => (
    <>
      <MuiChip
        label={rowData.isActiveForm ? "Active" : "Inactive"}
        icon={
          rowData.isActiveForm ? (
            <PersonOutlineOutlinedIcon />
          ) : (
            <PersonOffOutlinedIcon />
          )
        }
        size="small"
        className={`${rowData.isActiveForm ? "activeChipStyle" : "inActiveChipStyle"}`}
        style={{ fontSize: "0.85rem" }}
      />
    </>
  );
  const departmentBodyTemplate = (rowData) => (
    <>
      <Tooltip title={rowData.department} placement="top">
        <MuiChip
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "8rem",
            backgroundColor: "#f0f3f7",
            color: "#1e40af",
            fontSize: "0.85rem !important",
          }}
          size="small"
          icon={
            <SupervisorAccountOutlinedIcon
              sx={{
                color: "#1e40af !important",
                // fontSize: "0.9rem !important",
              }}
            />
          }
          label={rowData.department ?? "NA"}
        />
      </Tooltip>
    </>
  );
  const createInfoBodyTemplate = (rowData) => (
    <div
      style={{
        display: "flex",
        columnGap: "0.5rem",
        alignItems: "center",
        marginLeft: "0rem",
        justifyContent: "center",
        margin: "2px 0",
      }}
    >
      <div>
        <Tooltip
          placement="top"
          title={
            <>
              <Typography>{rowData.userId}</Typography>
            </>
          }
        >
          <Avatar
            sizes=""
            sx={{
              // marginLeft: "auto",
              // bgcolor: "#0097a7",
              // fontSize: "0.95rem",
              // width: 32,
              // height: 32,
              backgroundColor: "#44a5f9",
              color: "rgb(255, 255, 255)",
              width: "1.8rem",
              height: "1.8rem",
              fontSize: "0.75rem",
            }}
          >
            {getInitials(rowData.createdUser)}
          </Avatar>
        </Tooltip>
      </div>
      <div style={{ display: "grid", justifyItems: "start" }}>
        <Typography
          sx={{
            textAlign: "left",
            fontSize: "0.82rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "10rem",
            textTransform: "capitalize",
          }}
        >
          {rowData.createdUser}
        </Typography>

        <Typography
          sx={{
            textAlign: "left",
            fontSize: "0.75rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "10rem",
            color: "#6b7280",
            textTransform: "lowercase",
          }}
        >
          {rowData.userId}
        </Typography>
      </div>
    </div>
  );

  // Render the "View" column with an eye icon
  const editBodyTemplate = (rowData) => (
    <>
      {/* <Button
      icon="pi pi-pencil"
      rounded
      text
      style={{ background: "#e3f2fd" }}
      className="p-button-rounded p-button-info"
      onClick={() => {
        console.log("Form data : ", rowData);
        setTableForm(rowData);
        setShowCreation(true);
      }}
    /> */}
      <i
        className="pi pi-pencil"
        style={{
          background: "#f0f5f9",
          padding: "0.5rem",
          borderRadius: "50%",
          color: " #0876c1",
          fontSize: "0.9rem",
          cursor: "pointer",
        }}
        onClick={() => {
          console.log("Form data : ", rowData);
          setTableForm(rowData);
          setShowCreation(true);
        }}
      ></i>
    </>
  );
  // const viewBodyTemplate = async (rowData) => (
  //   <Button
  //     icon="pi pi-eye"
  //     rounded
  //     text
  //     style={{ background: "#e3f2fd" }}
  //     className="p-button-rounded p-button-info"
  //     onClick={async () => {
  //       console.log("Form data : ", rowData);

  //       if (rowData !== null) {
  //         const AllCellData = await getAllCellInfoByFormNameAndVersion(
  //           rowData.formName,
  //           rowData.versionNumber
  //         );
  //         if (AllCellData) {
  //           setLogData([]);

  //           const updatedSheetDetails = AllCellData.map((sheet) => {
  //             // Create a new object with cellData and nullify cellInfo
  //             const newSheet = { ...sheet, cellData: sheet.cellInfo };
  //             newSheet.cellInfo = null;
  //             return newSheet;
  //           });

  //           console.log(
  //             "updatedSheetDetails with cell data : ",
  //             updatedSheetDetails
  //           );
  //           setLogData(updatedSheetDetails);
  //           setIsViewLogbook(true);
  //         }
  //         console.log("inital Table sheet data : ", AllCellData);
  //         if (AllCellData === null || AllCellData.length === 0) {
  //           setsnackbarSeverity("error"); // Clear any previous snackbar severity (might need a value)
  //           setSnackbarText("No Cell Found"); // Set success message for snackbar
  //           setSnackbarOpen(true);

  //           return;
  //         }

  //         // setTableForm(rowData);
  //         // setShowCreation(true);
  //       }
  //     }}
  //   />
  // );

  // Render the "Action" column with an InputSwitch

  const viewBodyTemplate = (rowData) => (
    <Button
      icon={
        loading && rowData.formID === rowId
          ? "pi pi-spin pi-spinner-dotted"
          : "pi pi-eye"
      }
      rounded
      text
      size="small"
      // style={{ background: "#e3f2fd" }}
      className="p-button-rounded p-button-info"
      onClick={() => handleViewButtonClick(rowData)} // no need for async here
    />
  );

  const handleViewButtonClick = async (rowData) => {
    setLoading(true);
    setRowId(rowData.formID);
    setLogbookFormName(rowData.formName);
    console.log("Form data: ", rowData);

    if (rowData === null) {
      console.log("No row data provided.");
      return;
    }

    try {
      const allCellData = await fetchCellData(
        rowData.formName,
        rowData.versionNumber,
      );

      console.log("My name : ", allCellData);

      if (!allCellData || allCellData.length === 0) {
        handleEmptyCellData();
        return;
      }

      // const updatedSheetDetails = formatSheetData(allCellData);
      // console.log(
      //   "Updated sheet details with cell data: ",
      //   updatedSheetDetails
      // );

      setLogData(allCellData);
      setIsViewLogbook(true);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching or processing cell data: ", error);
      handleError(error);
    }
  };

  // Function to fetch all cell data based on form name and version
  const fetchCellData = async (formName, versionNumber) => {
    return await getAllCellInfoByFormNameAndVersion(formName, versionNumber);
  };

  // Function to handle the case when no cell data is found
  const handleEmptyCellData = () => {
    setsnackbarSeverity("error");
    setSnackbarText("No Cell Found");
    setSnackbarOpen(true);
  };

  // Function to format the sheet data
  const formatSheetData = (allCellData) => {
    return allCellData.map((sheet) => {
      // Create a new object with cellData and nullify cellInfo
      const newSheet = { ...sheet, cellData: sheet.cellInfo };
      newSheet.cellInfo = null;
      return newSheet;
    });
  };

  // Function to handle errors and display messages
  const handleError = (error) => {
    setsnackbarSeverity("error");
    setSnackbarText(`Error: ${error.message || "An unknown error occurred"}`);
    setSnackbarOpen(true);
  };

  const actionBodyTemplate = (rowData) => {
    const handleToggle = async (checked) => {
      // If toggled to true, deactivate other versions of the same formName

      if (checked) {
        const updateResponse = await updateFormActiveStatus(rowData, checked);
        if (updateResponse?.status === 200) {
          setAllForms((prevData) =>
            prevData.map((item) =>
              item.formName === rowData.formName
                ? { ...item, isActiveForm: item.formID === rowData.formID }
                : item,
            ),
          );
          setsnackbarSeverity(); // Clear any previous snackbar severity (might need a value)
          setSnackbarText("Status Updated Successfully"); // Set success message for snackbar
          setSnackbarOpen(true);
        } else {
          setsnackbarSeverity("Error"); // Clear any previous snackbar severity (might need a value)
          setSnackbarText("Database Error"); // Set success message for snackbar
          setSnackbarOpen(true);
        }
      } else {
        // If toggled to false, simply update the current item
        console.log("Checked in else : ", checked);
        console.log("Rowdata in else : ", rowData);
        const updateResponse = await updateFormActiveStatus(rowData, checked);
        if (updateResponse?.status === 200) {
          setAllForms((prevData) =>
            prevData.map((item) =>
              item.formID === rowData.formID
                ? { ...item, isActiveForm: false }
                : item,
            ),
          );
          setsnackbarSeverity(); //reset to default snackbar severity (might need a value)
          setSnackbarText("Status Updated Successfully"); // Set success message for snackbar
          setSnackbarOpen(true);
        } else {
          setsnackbarSeverity("error"); // reset to default snackbar severity (might need a value)
          setSnackbarText("Database Error"); // Set success message for snackbar
          setSnackbarOpen(true);
        }
      }
    };

    return (
      <InputSwitch
        checked={rowData.isActiveForm}
        onChange={(e) => handleToggle(e.value)}
      />
    );
  };

  //Table Header
  const header = (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "0rem 0.4rem",
      }}
    >
      <h4 className="tableHeaderFont">Manage Logbooks</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          className="p-inputtext-sm inputSection"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Keyword Search"
        />
      </span>
    </Box>
  );
  const rowsPerPageOptions = [5, 10, 20, allForms?.length].filter(
    (option) => option <= allForms?.length,
  );
  return (
    <>
      {!showCreation ? (
        <>
          <Container maxWidth="lg">
            <div className="mx-0 lg:mx-5">
              <div className={infoCard.infoCard}>
                <div className="flex items-center justify-content-between align-items-center w-full align-items-center">
                  <div className="flex items-center gap-3">
                    <div className={infoCard.blueIcon}>
                      <AutoStoriesIcon />
                    </div>
                    <div>
                      <h1 className={infoCard.Header}>Configure Logbook</h1>
                      <p className={infoCard.subHeader}>
                        View and manage all your logbook entries in one place
                      </p>
                    </div>
                  </div>

                  <Button
                    className={infoButton.infoButton}
                    icon="pi pi-plus"
                    size="small"
                    onClick={() => {
                      // Function to handle button click
                      // setAssetGroupId(null); // Reset asset group ID for new creation
                      setShowCreation(true); // Show the asset creation dialog
                    }}
                  >
                    Add Logbook
                  </Button>
                </div>
              </div>
              <div className={`${card.contentCard} mt-2`}>
                <>
                  <DataTable
                    size="small"
                    className="tableHeader tableRowHeader tableOddRowColor contentAlignment dataTableBodyPadding dataTablePaginator dataTableBody paginatorDropDownStyle"
                    value={allForms}
                    paginator
                    removableSort
                    showGridlines
                    stripedRows
                    globalFilter={globalFilter}
                    header={header}
                    rows={Math.min(15, allForms.length)} // Default rows per page
                    rowsPerPageOptions={rowsPerPageOptions} // Adjusted dynamically
                    responsiveLayout="scroll"
                    //currentPageReportTemplate="Showing {first} to {last} of {totalRecords} records"
                    paginatorTemplate=" PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    emptyMessage={
                      loader ? (
                        <>
                          <LinearProgress />
                        </>
                      ) : (
                        "No Data Available"
                      )
                    }
                  >
                    {/* <Column
                      body={viewBodyTemplate}
                      header="View"
                      headerStyle={{ textAlign: "center" }}
                      bodyStyle={{
                        minWidth: "2rem", // Set minimum width for the column
                        textAlign: "center",
                      }}
                    ></Column> */}
                    <Column
                      field="userId"
                      header="Created By"
                      headerStyle={{ textAlign: "center" }}
                      body={createInfoBodyTemplate}
                      bodyStyle={{
                        minWidth: "12rem", // Set minimum width for the column
                      }}
                    ></Column>

                    <Column
                      field="formID"
                      header="Form ID"
                      sortable
                      headerStyle={{ textAlign: "center" }}
                      bodyStyle={{
                        minWidth: "3rem", // Set minimum width for the column
                        textAlign: "center",
                      }}
                    ></Column>
                    <Column
                      field="formName"
                      header="Form Name"
                      sortable
                      headerStyle={{ textAlign: "center", Width: "10rem" }}
                      bodyStyle={{
                        maxWidth: "7rem", // Set minimum width for the column
                        textAlign: "center",
                      }}
                      body={(rowData) => (
                        <div className="flex align-items-center justify-content-center gap-1 mx-2">
                          {loading && rowData.formID === rowId ? (
                            <i className="pi pi-spin pi-spinner"></i>
                          ) : (
                            ""
                          )}

                          <Tooltip title={rowData.formName} placement="top">
                            <span
                              style={{
                                fontSize: "0.85rem",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                width: "10rem",
                                textTransform: "capitalize",
                                cursor: "pointer",
                              }}
                              onClick={() => handleViewButtonClick(rowData)} // no need for async here
                            >
                              {rowData.formName}
                            </span>
                          </Tooltip>
                          {/* <Badge value={rowData.versionNumber} style={{ marginLeft: '10px' }} />  */}
                          {/* <Tooltip title={rowData.formName} placement="top">
                            <Badge
                              badgeContent={rowData.versionNumber}
                              color="primary"
                            >
                              <MuiChip
                                //color={rowData.isActiveForm ? "success" : "error"}
                                size="small"
                                variant="outlined"
                                sx={{ maxWidth: "8rem" }}
                                label={rowData.formName}
                              />
                            </Badge>
                          </Tooltip> */}
                        </div>
                      )}
                    ></Column>
                    {/* <Column
                      field="department"
                      header="Department"
                      headerStyle={{ textAlign: "center" }}
                      body={departmentBodyTemplate}
                    ></Column> */}
                    {/* <Column
                      field="versionNumber"
                      header="Version"
                      headerStyle={{ textAlign: "center" }}
                      bodyStyle={{
                        minWidth: "5rem", // Set minimum width for the column
                        textAlign: "center",
                      }}
                    ></Column> */}

                    <Column
                      field="documentId"
                      header="Document ID"
                      headerStyle={{ textAlign: "center" }}
                    ></Column>

                    <Column
                      field="formatID"
                      header="Format ID"
                      headerStyle={{ textAlign: "center" }}
                    ></Column>

                    <Column
                      field="isActiveForm"
                      header="Status"
                      body={activeStatusBodyTemplate}
                      sortable
                      headerStyle={{ textAlign: "center" }}
                      bodyStyle={{
                        minWidth: "5rem", // Set minimum width for the column
                        textAlign: "center",
                      }}
                    ></Column>

                    <Column
                      body={editBodyTemplate}
                      header="Edit"
                      headerStyle={{ textAlign: "center" }}
                      bodyStyle={{
                        minWidth: "5rem", // Set minimum width for the column
                        textAlign: "center",
                      }}
                    ></Column>
                    <Column
                      body={actionBodyTemplate}
                      header="Action"
                      bodyStyle={{
                        minWidth: "5rem", // Set minimum width for the column
                        textAlign: "center",
                      }}
                      headerStyle={{ textAlign: "center" }}
                    ></Column>
                  </DataTable>
                </>
                {/* <Tooltip title="Add Logbook" placement="left">
                 
                  <Fab
                    color="primary" 
                    aria-label="add" 
                    style={{
                     
                      position: "fixed", 
                      bottom: 50, 
                      right: 50,
                      animation: "fadeIn 0.5s ease-in-out", 
                      zIndex: "20",
                    }}
                    onClick={() => {
                      setShowCreation(true); 
                    }}
                  >
                    <AddIcon /> 
                  </Fab>
                </Tooltip> */}
                <div>
                  <SnackbarComponent
                    openPopup={snackbarOpen} // State to control snackbar open/close
                    setOpenPopup={setSnackbarOpen} // Function to update snackbar state
                    dialogMessage={snackbarText} // Message to display in the snackbar
                    snackbarSeverity={snackbarSeverity} // Severity level of the snackbar (e.g., success, error)
                  />
                </div>

                <Dialog
                  header={logbookFormName ?? ""}
                  visible={isViewLogbook}
                  maximizable
                  maskClassName={isTab ? "" : "zindexforDailog"}
                  maskStyle={{ zIndex: "310 !important" }}
                  style={{ width: "90%", height: "90%", margin: "auto" }}
                  onHide={() => {
                    if (!isViewLogbook) return;
                    setIsViewLogbook(false);
                  }}
                  className={`${DialogStyle.dialogHeader} ${DialogStyle.dialogContent}`}
                >
                  <div>
                    <LogbookForm logData={logData}></LogbookForm>
                  </div>
                </Dialog>
              </div>
            </div>
          </Container>
        </>
      ) : (
        <div>
          <ConfigureLogbook tableForm={tableForm} setTableForm={setTableForm} />
        </div>
      )}
    </>
  );
};

export default LogbookMaster;
