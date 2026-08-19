import React, { useEffect, useRef, useState, useCallback } from "react";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Avatar } from "primereact/avatar";
import { InputText } from "primereact/inputtext";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Chip,
  Container,
  Divider,
  IconButton,
  Slide,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  getActiveFormInfoApi,
  getEditableFormInfoApi,
  getUserWiseReportApi,
  getUserWiseReportInfoApi,
  saveLogbookConfigApi,
  updateSharedUserApi,
} from "./LogbookReportsApi";
import { decryptTokenId, extendTokenExpiration } from "../helper/AuthService";
import { ProgressBar } from "primereact/progressbar";
import { fetchAllUsers } from "../UserModuleUpdated/UsermoduleApi";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import HomeIcon from "@mui/icons-material/Home";
import { FloatLabel } from "primereact/floatlabel";

export default function ReportConfigurator() {
  const creator = decryptTokenId(
    localStorage.getItem(process.env.REACT_APP_USERID),
  );

  const [selectedLogbookInfo, setSelectedLogbookInfo] = useState(null);
  const [selectedCells, setSelectedCells] = useState([]);
  const [form, setForm] = useState();
  const [cellData, setCellData] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [user, setUser] = useState([]);
  const [availableReport, setAvailableReport] = useState([]);
  const [loader, setLoader] = useState();
  const [showReportConfig, setShowReportConfig] = useState(false);
  const [showReportConfigWithData, setShowReportConfigWithData] =
    useState(false);
  const [editedReportAliasIds, setEditedReportAliasIds] = useState({});
  const [reportName, setReportName] = useState("");
  const [
    selectedAvailableReportSharedUser,
    setSelectedAvailableReportSharedUser,
  ] = useState([]);
  const [reportConfig, setReportConfig] = useState({
    formId: 0,
    reportName: "",
    formName: "",
    versionNumber: 0,
    creator: "",
    sharedUser: "",
    cellId: "",
    reportAliasId: "",
    formAliasId: "",
  });
  const [reportData, setReportData] = useState([]);
  const [errorOpen, setErrorOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarSeverity, setsnackbarSeverity] = useState("");
  const [columnLoading, setColumnLoading] = useState(false);
  const [hasEmptyFields, setHasEmptyFields] = useState(false);
  const [hasDuplicatePresent, setHasDuplicatePresent] = useState(false);
  const [
    inputDuplicateAndEmptyFieldErrors,
    setInputDuplicateAndEmptyFieldErrors,
  ] = useState([]);

  // FIX: Use a ref to track the previous value of selectedAvailableReportSharedUser
  // to prevent the useEffect from triggering on every render.
  const prevSharedUserRef = useRef(null);

  const resetAllStates = useCallback(() => {
    setSelectedLogbookInfo(null);
    setSelectedCells([]);
    setCellData([]);
    setDialogVisible(false);
    setSelectedUsers([]);
    setShowReportConfig(false);
    setShowReportConfigWithData(false);
    setEditedReportAliasIds({});
    setReportName("");
    setSelectedAvailableReportSharedUser([]);
    prevSharedUserRef.current = null; // Reset the ref too
    setReportConfig({
      formId: 0,
      reportName: "",
      formName: "",
      versionNumber: 0,
      creator: "",
      sharedUser: "",
      cellId: "",
      reportAliasId: "",
      formAliasId: "",
    });
    setReportData([]);
    setHasEmptyFields(false);
    setHasDuplicatePresent(false);
    setInputDuplicateAndEmptyFieldErrors([]);
  }, []);

  const handleClose = useCallback((event, reason) => {
    if (reason === "clickaway") return;
    setErrorOpen(false);
  }, []);

  const handleClick = useCallback(() => {
    setErrorOpen(true);
  }, []);

  const fetchData = useCallback(async () => {
    const data = await getActiveFormInfoApi();
    setForm(data || undefined);
  }, []);

  const fetchUser = useCallback(async () => {
    const data = await fetchAllUsers();
    const activeUsers = data.filter((u) => u.active === true);
    const activeUsersWithoutCreator = activeUsers.filter(
      (u) => u.userID !== creator,
    );
    setUser(activeUsersWithoutCreator);
  }, [creator]);

  const fetchUserWiseReport = useCallback(async () => {
    setLoader(true);
    if (creator) {
      const data = await getUserWiseReportApi(creator);
      setAvailableReport(data);
    } else {
      setAvailableReport([]);
    }
    setLoader(false);
  }, [creator]);

  useEffect(() => {
    extendTokenExpiration();
    fetchData();
    fetchUser();
    fetchUserWiseReport();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // FIX: Guard the effect so it only runs when selectedAvailableReportSharedUser
  // actually changes (by value), not on every render. This prevents the
  // selectedUsers update from triggering an infinite loop.
  useEffect(() => {
    const current = JSON.stringify(selectedAvailableReportSharedUser);
    if (current === prevSharedUserRef.current) return;
    prevSharedUserRef.current = current;

    if (
      selectedAvailableReportSharedUser &&
      selectedAvailableReportSharedUser.length > 0
    ) {
      setSelectedUsers(
        selectedAvailableReportSharedUser.map((u) => ({ userID: u })),
      );
    }
  }, [selectedAvailableReportSharedUser]);

  // FIX: The logbook fetch effect previously had no cleanup and could cause
  // state updates on an unmounted component or stale closures. Added an
  // isCancelled flag to safely abort the async operation.
  useEffect(() => {
    if (!selectedLogbookInfo) {
      setCellData([]);
      return;
    }

    let isCancelled = false;
    setColumnLoading(true);

    const fetchCellData = async () => {
      try {
        const data = await getEditableFormInfoApi(selectedLogbookInfo);
        if (isCancelled) return;

        if (!data || data.length === 0) {
          setsnackbarSeverity("error");
          setSnackbarText("No data found for the selected logbook.");
          setErrorOpen(true);
          setShowReportConfig(false);
          setShowReportConfigWithData(false);
        } else {
          setCellData(data);
        }
      } catch (error) {
        if (isCancelled) return;
        console.error("Error fetching cell data:", error);
        setsnackbarSeverity("error");
        setSnackbarText("Failed to load data for the selected logbook.");
        setErrorOpen(true);
        setShowReportConfig(false);
        setShowReportConfigWithData(false);
      } finally {
        if (!isCancelled) setColumnLoading(false);
      }
    };

    fetchCellData();

    return () => {
      isCancelled = true;
    };
  }, [selectedLogbookInfo]);

  const saveLogbookConfig = useCallback(async () => {
    if (!reportName || reportName.trim() === "") {
      setSnackbarText("ReportName Cells must be selected !");
      setsnackbarSeverity("error");
      setErrorOpen(true);
      return;
    }
    if (!reportData || reportData.length === 0) {
      setSnackbarText("ReportData must be selected !");
      setsnackbarSeverity("error");
      setErrorOpen(true);
      return;
    }
    if (!selectedUsers) {
      setSnackbarText("Users must be selected !");
      setsnackbarSeverity("error");
      setErrorOpen(true);
      return;
    }
    if (selectedCells.length === 0) {
      setSnackbarText("Cells must be selected !");
      setsnackbarSeverity("error");
      setErrorOpen(true);
      return;
    }
    if (!reportConfig) {
      setSnackbarText("ReportConfig must be filled !");
      setsnackbarSeverity("error");
      setErrorOpen(true);
      return;
    }
    if (hasEmptyFields) {
      setSnackbarText("All Report AliasId fields must be filled !");
      setsnackbarSeverity("error");
      setErrorOpen(true);
      return;
    }
    if (hasDuplicatePresent) {
      setSnackbarText("Duplicate values are not allowed !");
      setsnackbarSeverity("error");
      setErrorOpen(true);
      return;
    }

    const emailSet = new Set();
    emailSet.add(creator);
    if (Array.isArray(selectedUsers)) {
      selectedUsers.forEach((u) => emailSet.add(u.userID));
    } else if (
      selectedUsers &&
      typeof selectedUsers === "object" &&
      selectedUsers.userID
    ) {
      emailSet.add(selectedUsers.userID);
    }
    const sharedUserListString = Array.from(emailSet).join(",");

    if (!sharedUserListString) {
      setSnackbarText("Selected users must be filled");
      setsnackbarSeverity("error");
      setErrorOpen(true);
      return;
    }

    // FIX: Don't call setReportConfig mid-save and then immediately use the
    // new value — state updates are async. Build the final config object locally
    // and pass it directly to the API.
    const finalReportConfig = {
      ...reportConfig,
      sharedUser: sharedUserListString,
    };

    const data = await saveLogbookConfigApi(
      reportName.trim().replace(/\s+/g, " "),
      finalReportConfig,
      reportData,
      creator,
      sharedUserListString,
    );

    if (!data || data.length === 0) {
      setsnackbarSeverity("error");
      setSnackbarText("Error ! Report configuration cannot be saved.");
      setErrorOpen(true);
      return;
    }

    if (data.status === 200) {
      setSnackbarText(`${data.data}`);
      setsnackbarSeverity("success");
      setErrorOpen(true);
      setShowReportConfig(true);
      fetchUserWiseReport();
      resetAllStates();
    } else {
      setSnackbarText(`${data.data}`);
      setsnackbarSeverity("error");
      setErrorOpen(true);
    }
  }, [
    reportName,
    reportData,
    selectedUsers,
    selectedCells,
    reportConfig,
    hasEmptyFields,
    hasDuplicatePresent,
    creator,
    fetchUserWiseReport,
    resetAllStates,
  ]);

  const getInitials = useCallback((email) => {
    if (!email) return "NA";
    const namePart = email.split("@")[0];
    const nameParts = namePart.split(".");
    return nameParts.map((part) => part.charAt(0).toUpperCase()).join("");
  }, []);

  const updateSharedUsers = useCallback(
    async (name, sharedUsers) => {
      const data = await updateSharedUserApi(name, sharedUsers);
      fetchUserWiseReport();

      if (showReportConfigWithData) {
        resetAllStates();
        if (data.status === 200) {
          setSnackbarText(`${data.data}`);
          setsnackbarSeverity("success");
          setErrorOpen(true);
        } else {
          setSnackbarText(`${data.data}`);
          setsnackbarSeverity("error");
          setErrorOpen(true);
        }
      }
    },
    [fetchUserWiseReport, showReportConfigWithData, resetAllStates],
  );

  const fetchUserWiseReportInfo = useCallback(async (name) => {
    try {
      const data = await getUserWiseReportInfoApi(name);

      if (!data || data.length === 0) {
        setsnackbarSeverity("error");
        setSnackbarText("No data found for the specified report.");
        setErrorOpen(true);
        return;
      }

      setSelectedAvailableReportSharedUser(data[0]?.sharedUser.split(","));

      const initialSelectedCells = data.map((cell) => ({
        cellId: cell.cellId,
        reportAliasId: cell.reportAliasId,
        aliasId: cell.formAliasId,
        fieldType: cell.fieldType,
      }));

      setReportName(name);
      setSelectedCells([...initialSelectedCells]);
    } catch (error) {
      console.error("Error fetching report info: ", error);
      setSnackbarText("Failed to fetch report information.");
      setsnackbarSeverity("error");
      setErrorOpen(true);
    }
  }, []);

  // FIX: Extract the checkbox onChange handler into a stable useCallback so it
  // isn't recreated on every render, which was causing child re-renders that
  // fed back into parent state updates.
  const handleCellCheckboxChange = useCallback(
    (cell, checked) => {
      const timestampObject = {
        cellId: "timestamp",
        reportAliasId: "Timestamp",
        aliasId: "timestamp",
        fieldType: "timeStamp",
      };

      setSelectedCells((prev) => {
        let updated = checked
          ? [...prev, cell]
          : prev.filter((c) => c.cellId !== cell.cellId);

        const withTimestamp =
          updated.length > 0
            ? [
                timestampObject,
                ...updated.filter((c) => c.cellId !== "timestamp"),
              ]
            : [];

        // Derive reportData from the new cells inside the same updater to avoid
        // stale closure issues.
        const newReportData = withTimestamp
          .filter((c) => c.cellId !== "timestamp")
          .map((c) => ({
            cellId: c.cellId,
            reportAliasId: editedReportAliasIds[c.cellId] || c.aliasId,
            formAliasId: c.aliasId,
            fieldType: c.fieldType,
          }));

        // Schedule the reportData update asynchronously to avoid batching issues.
        setTimeout(() => setReportData(newReportData), 0);

        return withTimestamp;
      });
    },
    [editedReportAliasIds],
  );

  // FIX: Extract the alias input onChange handler to avoid recreating it in
  // every render pass, which was contributing to the update-depth problem.
  const handleAliasChange = useCallback((rowData, newValue) => {
    setEditedReportAliasIds((prev) => {
      const updated = {
        ...prev,
        [rowData.cellId]: newValue === "" ? rowData.cellId : newValue,
      };

      const allValues = Object.values(updated);
      const isDuplicate = allValues.filter((v) => v === newValue).length > 1;

      setHasDuplicatePresent(isDuplicate);

      setSelectedCells((cells) => {
        const newReportData = cells.map((cell) => ({
          cellId: cell.cellId,
          reportAliasId: updated[cell.cellId] || cell.aliasId,
          formAliasId: cell.aliasId,
          fieldType: cell.fieldType,
        }));
        setReportData(newReportData);

        const isAnyFieldEmpty = cells.some((cell) => {
          if (!Object.prototype.hasOwnProperty.call(updated, cell.cellId))
            return false;
          const v = updated[cell.cellId];
          return v === "" || v === undefined;
        });
        setHasEmptyFields(isAnyFieldEmpty);

        setInputDuplicateAndEmptyFieldErrors((prevErrors) => {
          if (isDuplicate || isAnyFieldEmpty) {
            return [...new Set([...prevErrors, rowData.cellId])];
          }
          return prevErrors.filter((id) => id !== rowData.cellId);
        });

        return cells; // no change to cells themselves
      });

      return updated;
    });
  }, []);

  const renderCellValue = useCallback((fieldType) => {
    switch (fieldType) {
      case "timeStamp":
        return new Date().toISOString().slice(0, 19).replace("T", " ");
      case "DateTime":
        return "2023-01-01 00:00:00";
      case "Date":
        return "2023-01-01";
      case "Boolean":
        return "true";
      case "API":
        return "api";
      case "Number":
        return 12345;
      case "Text":
      default:
        return "abc xyz";
    }
  }, []);

  return (
    <>
      <Container maxWidth="lg" sx={{ padding: "0" }}>
        <Box sx={{ padding: "0", boxShadow: 1 }}>
          {!showReportConfig && (
            <div style={{ border: "1px solid #e5e7eb" }}>
              <DataTable
                value={availableReport}
                header={
                  <div style={{ padding: "0.5rem 0" }}>Available Reports</div>
                }
                dataKey="id"
                tableStyle={{ fontSize: "0.8rem" }}
                className="UserInfoTableStyle HeaderColor"
                stripedRows
                emptyMessage={
                  loader ? (
                    <ProgressBar
                      mode="indeterminate"
                      style={{ height: "6px" }}
                    />
                  ) : (
                    "No Data Available"
                  )
                }
                footer={
                  <Chip
                    icon={<InfoOutlinedIcon />}
                    size="small"
                    sx={{ opacity: "0.9" }}
                    label="Click the Report Name to View Details"
                  />
                }
              >
                <Column
                  field="reportName"
                  header="Report Name"
                  body={(rowData) => (
                    <Chip
                      color="info"
                      variant="outlined"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        fetchUserWiseReportInfo(rowData.reportName);
                        setShowReportConfig(true);
                        setShowReportConfigWithData(true);
                        const logbookInfo = {
                          formName: rowData.formName,
                          versionNumber: rowData.versionNumber,
                          formID: rowData.formID,
                        };
                        setSelectedLogbookInfo(logbookInfo);
                        setReportConfig((prev) => ({
                          ...prev,
                          formId: rowData.formID,
                          formName: rowData.formName,
                          versionNumber: rowData.versionNumber,
                          creator: creator,
                        }));
                      }}
                      label={rowData.reportName}
                    />
                  )}
                />
                <Column field="formName" header="Form Name" />
                <Column
                  field="versionNumber"
                  header="Form Version"
                  body={(rowData) => <Chip label={rowData.versionNumber} />}
                />
                <Column field="creator" header="Creator" />
                <Column
                  field="sharedUser"
                  header="Shared User"
                  body={(rowData) => {
                    const names = rowData.sharedUser.split(",").map((email) => {
                      const nameParts = email.split("@")[0].trim().split(".");
                      const initials = nameParts
                        .map((part) => part.charAt(0).toUpperCase())
                        .join("");
                      return {
                        initials,
                        fullName: nameParts
                          .map(
                            (part) =>
                              part.charAt(0).toUpperCase() + part.slice(1),
                          )
                          .join(" "),
                      };
                    });

                    const maxVisibleAvatars = 2;
                    const visibleNames = names.slice(0, maxVisibleAvatars);
                    const remainingNames = names.slice(maxVisibleAvatars);
                    const remainingUserNames = remainingNames
                      .map((n) => n.fullName)
                      .join(", ");

                    return (
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {visibleNames.map((name, index) => (
                          <Tooltip
                            title={name.fullName}
                            key={`${index}_tooltip${name.fullName}`}
                          >
                            <div style={{ display: "flex" }}>
                              <span style={{ display: "inline-flex" }}>
                                <Avatar
                                  style={{
                                    backgroundColor: "#26a69a",
                                    color: "#ffffff",
                                    marginLeft: "0.3rem",
                                  }}
                                  key={`${index}_avatar${name.fullName}`}
                                  label={name.initials}
                                  className={name.initials}
                                  shape="circle"
                                />
                              </span>
                            </div>
                          </Tooltip>
                        ))}
                        {remainingNames.length > 0 && (
                          <Tooltip title={remainingUserNames}>
                            <span style={{ display: "inline-flex" }}>
                              <Avatar
                                shape="circle"
                                style={{
                                  backgroundColor: "#26a69a",
                                  color: "#ffffff",
                                  marginLeft: "0.3rem",
                                }}
                                label={`+${remainingNames.length}`}
                              />
                            </span>
                          </Tooltip>
                        )}
                      </div>
                    );
                  }}
                />
              </DataTable>
              <div style={{ position: "absolute", right: "5%", bottom: "5%" }}>
                <Button
                  icon="pi pi-plus"
                  rounded
                  severity="info"
                  aria-label="Add"
                  onClick={() => setShowReportConfig(true)}
                />
              </div>
            </div>
          )}

          {showReportConfig && (
            <Container
              maxWidth="lg"
              sx={{
                padding: "0 !important",
                background: "white",
                boxShadow: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.5rem 0.5rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    aria-label="home"
                    onClick={() => {
                      setShowReportConfig(false);
                      fetchUserWiseReport();
                      resetAllStates();
                    }}
                  >
                    <HomeIcon color="primary" />
                  </IconButton>
                  <Typography
                    sx={{
                      padding: "0.2rem 0.2rem",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                    }}
                  >
                    Select Active Logbook
                  </Typography>
                </div>
                <div>
                  {!showReportConfigWithData && (
                    <Dropdown
                      variant="filled"
                      value={selectedLogbookInfo}
                      filter
                      onChange={(e) => {
                        setSelectedCells([]);
                        setSelectedLogbookInfo(e.value);
                        setReportConfig((prev) => ({
                          ...prev,
                          formId: e.value.formID,
                          formName: e.value.formName,
                          versionNumber: e.value.versionNumber,
                          creator: creator,
                        }));
                      }}
                      options={form}
                      optionLabel="formName"
                      placeholder="Select Active Logbook"
                    />
                  )}
                </div>
              </div>
              <Divider />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.5rem 0.7rem",
                }}
              >
                {selectedLogbookInfo && (
                  <>
                    <Chip
                      sx={{ marginRight: "0.7rem" }}
                      label={`Logbook Name: ${selectedLogbookInfo.formName}`}
                    />
                    <Chip
                      size="medium"
                      label={`Logbook Version: ${selectedLogbookInfo.versionNumber}`}
                    />
                  </>
                )}
              </div>

              <Accordion defaultExpanded disableGutters>
                <AccordionSummary
                  expandIcon={
                    <ArrowDownwardIcon
                      sx={{
                        background: "#7f939c",
                        borderRadius: "50%",
                        padding: "3px",
                        color: "white",
                      }}
                    />
                  }
                  aria-controls="panel1-content"
                  id="panel1-header"
                  sx={{
                    background: "#DBE0E9",
                    margin: "0 !important",
                    boxShadow: 0,
                  }}
                >
                  <Typography sx={{ fontWeight: "600" }}>
                    Select Columns
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: 0 }}>
                  {columnLoading ? (
                    <ProgressBar
                      mode="indeterminate"
                      style={{ height: "6px" }}
                    />
                  ) : (
                    <div
                      className="grid-container"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "auto auto",
                        padding: "0.8rem 1rem",
                      }}
                    >
                      {cellData.map((cell, index) => (
                        <div key={index} style={{ paddingBottom: "10px" }}>
                          {showReportConfigWithData ? (
                            <Checkbox
                              inputId={cell.cellId}
                              checked={selectedCells.some(
                                (c) => c.cellId === cell.cellId,
                              )}
                              disabled
                            />
                          ) : (
                            <Checkbox
                              inputId={cell.cellId}
                              checked={selectedCells.some(
                                (c) => c.cellId === cell.cellId,
                              )}
                              onChange={(e) =>
                                handleCellCheckboxChange(cell, e.checked)
                              }
                            />
                          )}
                          <label htmlFor={cell.cellId}>
                            {" "}
                            {cell.aliasId}, {cell.cellId}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </AccordionDetails>
              </Accordion>

              {selectedCells.length > 0 && (
                <Accordion defaultExpanded disableGutters>
                  <AccordionSummary
                    expandIcon={
                      <ArrowDownwardIcon
                        sx={{
                          background: "#7f939c",
                          borderRadius: "50%",
                          padding: "3px",
                          color: "white",
                        }}
                      />
                    }
                    aria-controls="panel1-content"
                    id="panel1-header"
                    sx={{
                      background: "#DBE0E9",
                      margin: "0 !important",
                      boxShadow: 0,
                    }}
                  >
                    <Typography sx={{ fontWeight: "600" }}>
                      Selected Cells
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ padding: 0 }}>
                    <DataTable
                      value={selectedCells.filter(
                        (c) => c.cellId !== "timestamp",
                      )}
                      tableStyle={{ fontSize: "0.8rem" }}
                      className="UserInfoTableStyle"
                    >
                      <Column field="cellId" header="CellId" />
                      <Column field="aliasId" header="Form AliasId" />
                      {showReportConfigWithData ? (
                        <Column field="reportAliasId" header="Report AliasId" />
                      ) : (
                        <Column
                          field="reportAliasId"
                          header="Report AliasId"
                          body={(rowData) => (
                            <InputText
                              key={rowData.cellId}
                              type="text"
                              value={
                                editedReportAliasIds[rowData.cellId] !==
                                undefined
                                  ? editedReportAliasIds[rowData.cellId]
                                  : `${rowData.aliasId}(${rowData.cellId})`
                              }
                              onChange={(e) =>
                                handleAliasChange(rowData, e.target.value)
                              }
                              style={{
                                border:
                                  inputDuplicateAndEmptyFieldErrors.includes(
                                    rowData.cellId,
                                  )
                                    ? "1px solid red"
                                    : "1px solid #ccc",
                                backgroundColor:
                                  inputDuplicateAndEmptyFieldErrors.includes(
                                    rowData.cellId,
                                  )
                                    ? "#ffe6e6"
                                    : "white",
                                width: "100%",
                                fontSize: "0.8rem",
                              }}
                            />
                          )}
                        />
                      )}
                    </DataTable>
                  </AccordionDetails>
                </Accordion>
              )}

              <Accordion defaultExpanded disableGutters>
                <AccordionSummary
                  expandIcon={
                    <ArrowDownwardIcon
                      sx={{
                        background: "#7f939c",
                        borderRadius: "50%",
                        padding: "3px",
                        color: "white",
                      }}
                    />
                  }
                  aria-controls="panel1-content"
                  id="panel1-header"
                  sx={{
                    background: "#DBE0E9",
                    margin: "0 !important",
                    boxShadow: 0,
                  }}
                >
                  <Typography sx={{ fontWeight: "600" }}>
                    Report Preview
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: 0 }}>
                  <DataTable
                    value={[selectedCells]}
                    tableStyle={{ fontSize: "0.8rem" }}
                    className="UserInfoTableStyle"
                  >
                    {selectedCells.length > 0 &&
                      selectedCells.map((key, index) => (
                        <Column
                          key={index}
                          field={key.aliasId}
                          header={
                            showReportConfigWithData
                              ? key.reportAliasId
                              : editedReportAliasIds[key.cellId] || key.aliasId
                          }
                          body={(rowData) => (
                            <>
                              {Array.from({ length: 5 }).map(
                                (_, repeatIndex) => (
                                  <div key={`${index}-${repeatIndex}`}>
                                    {renderCellValue(rowData[index]?.fieldType)}
                                  </div>
                                ),
                              )}
                            </>
                          )}
                        />
                      ))}
                  </DataTable>
                </AccordionDetails>
              </Accordion>

              <Dialog
                header="User Information"
                visible={dialogVisible}
                maximizable
                modal
                onHide={() => setDialogVisible(false)}
                footer={() => (
                  <div style={{ alignItems: "center" }}>
                    <Button
                      label="Ok"
                      size="small"
                      raised
                      rounded
                      icon="pi pi-check"
                      onClick={() => {
                        const emailSet = new Set();
                        emailSet.add(creator);
                        if (selectedUsers && selectedUsers.length > 0) {
                          selectedUsers.forEach((u) => emailSet.add(u.userID));
                        } else {
                          setSnackbarText("No user selected");
                          setsnackbarSeverity("error");
                          setErrorOpen(true);
                        }
                        const selectedUserEmails =
                          Array.from(emailSet).join(",");
                        updateSharedUsers(reportName, selectedUserEmails);
                        setDialogVisible(false);
                      }}
                    />
                  </div>
                )}
              >
                <DataTable
                  value={user}
                  selectionMode={"checkbox"}
                  selection={selectedUsers}
                  onSelectionChange={(e) => setSelectedUsers(e.value)}
                  dataKey="userID"
                  tableStyle={{ fontSize: "0.8rem" }}
                  stripedRows
                  className="UserInfoTableStyle HeaderColor"
                >
                  <Column
                    key="selectionColumn"
                    selectionMode="multiple"
                    headerStyle={{ width: "3rem" }}
                  />
                  <Column
                    filter
                    filterPlaceholder="Search by name"
                    style={{ minWidth: "12rem" }}
                    body={(rowData) => (
                      <div
                        style={{
                          display: "flex",
                          justifyItems: "start",
                          columnGap: "0.5rem",
                          alignItems: "center",
                        }}
                      >
                        <Avatar
                          style={{
                            backgroundColor: "#546e7a",
                            color: "#ffffff",
                            width: 30,
                            height: 30,
                            fontSize: "0.7rem",
                          }}
                          shape="circle"
                        >
                          {getInitials(rowData.userID)}
                        </Avatar>
                        {rowData.userID}
                      </div>
                    )}
                    header="User ID"
                  />
                </DataTable>
              </Dialog>

              <div
                style={{
                  padding: "0.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  columnGap: "0.5rem",
                  alignItems: "center",
                  marginTop: "1rem",
                }}
              >
                <div
                  style={{
                    padding: "0.5rem",
                    display: "flex",
                    columnGap: "0.5rem",
                  }}
                >
                  <FloatLabel>
                    <InputText
                      className="p-inputtext-sm"
                      id="reportName"
                      disabled={showReportConfigWithData}
                      value={reportName}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setReportName(newValue);
                        setReportConfig((prev) => ({
                          ...prev,
                          reportName: newValue,
                        }));
                      }}
                    />
                    <label htmlFor="reportName">Report Name</label>
                  </FloatLabel>
                  <Button
                    label="Share"
                    aria-label="Share"
                    size="small"
                    rounded
                    icon="pi pi-share-alt"
                    onClick={() => setDialogVisible(true)}
                  />
                </div>
                <div>
                  {!showReportConfigWithData && (
                    <Button
                      label="Save Report"
                      aria-label="Save Report"
                      size="small"
                      severity="success"
                      rounded
                      icon="pi pi-save"
                      onClick={saveLogbookConfig}
                    />
                  )}
                </div>
              </div>
            </Container>
          )}

          <Snackbar
            open={errorOpen}
            autoHideDuration={3000}
            onClose={handleClose}
            TransitionComponent={Slide}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={handleClose}
              severity={snackbarSeverity}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {snackbarText}
            </Alert>
          </Snackbar>
        </Box>
      </Container>
      <br />
    </>
  );
}
