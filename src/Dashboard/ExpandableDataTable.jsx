import {
  Avatar as MuiAvatar,
  Tooltip as MuiTooltip,
  Stack,
  Card,
  Chip,
  Typography,
} from "@mui/material";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { ProgressBar } from "primereact/progressbar";
import { Tooltip } from "primereact/tooltip";
import React, { useState, useMemo } from "react";
import TransactionTable from "./TransactionTable";
import LViewWithProps from "../Logbook/View/LViewWithProps";
import EllipsisText from "./EllipsisText";
import ActivityFlow from "../JobReviewer/ActivityFlow";
import { FilterMatchMode, FilterService } from "primereact/api";
import { InputText } from "primereact/inputtext";

// 1. Register custom filter for multi-range Progress filtering
FilterService.register("progressMultiRange", (value, filter) => {
  if (!filter || filter.length === 0) return true;
  if (value === undefined || value === null) return false;

  return filter.some((range) => {
    if (range === "0%") return value === 0;
    if (range === "1-49%") return value >= 1 && value <= 49;
    if (range === "50-99%") return value >= 50 && value <= 99;
    if (range === "100%") return value === 100;
    return false;
  });
});

// Helper for status badge colors in the filter
const getStatusColorConfig = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return { bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7" };
    case "started":
      return { bg: "#ede7f6", text: "#512da8", border: "#b39ddb" };
    case "not started":
      return { bg: "#f5f5f5", text: "#616161", border: "#e0e0e0" };
    case "rejected":
    case "aborted":
      return { bg: "#ffebee", text: "#c62828", border: "#ef9a9a" };
    case "sent for approval":
      return { bg: "#e1f5fe", text: "#0277bd", border: "#81d4fa" };
    case "review started":
      return { bg: "#fff3e0", text: "#ef6c00", border: "#ffcc80" };
    case "approved":
      return { bg: "#e0f2f1", text: "#00695c", border: "#80cbc4" };
    default:
      return { bg: "#f8f9fa", text: "#495057", border: "#dee2e6" };
  }
};

export default function ExpandableDataTable({ key, data, header, groupBy }) {
  const [expandedRows, setExpandedRows] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [activityNameClick, setactivityNameClick] = useState(false);
  const [logbookClick, setLogbookClick] = useState(false);
  const [openrow, setOpenrow] = useState(null);
  const [openrowdialog, setOpenrowdialog] = useState(false);

  // Filters setup
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    jobName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    taskTemplate: { value: null, matchMode: FilterMatchMode.CONTAINS },
    assigner: { value: null, matchMode: FilterMatchMode.CONTAINS },
    scheduledJobStartTime: { value: null, matchMode: FilterMatchMode.CONTAINS },
    jobStatus: { value: null, matchMode: FilterMatchMode.IN },
    progress: { value: null, matchMode: "progressMultiRange" },
  });

  const [globalFilterValue, setGlobalFilterValue] = useState("");

  // DYNAMIC JOB STATUS OPTIONS (Extracted from actual data)
  const dynamicJobStatusOptions = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    const unique = Array.from(
      new Set(
        data
          .map((item) => item.jobStatus)
          .filter((s) => s !== null && s !== undefined && s.trim() !== ""),
      ),
    );
    return unique.sort();
  }, [data]);

  const progressOptions = [
    { label: "0%", value: "0%", color: "#9e9e9e" },
    { label: "1% – 49%", value: "1-49%", color: "#f57c00" },
    { label: "50% – 99%", value: "50-99%", color: "#0288d1" },
    { label: "100%", value: "100%", color: "#2e7d32" },
  ];

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const clearFilter = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      jobName: { value: null, matchMode: FilterMatchMode.CONTAINS },
      taskTemplate: { value: null, matchMode: FilterMatchMode.CONTAINS },
      assigner: { value: null, matchMode: FilterMatchMode.CONTAINS },
      scheduledJobStartTime: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      jobStatus: { value: null, matchMode: FilterMatchMode.IN },
      progress: { value: null, matchMode: "progressMultiRange" },
    });
    setGlobalFilterValue("");
  };

  /* ========================================================================= */
  /*             PROFESSIONAL MULTI-SELECT FOR JOB STATUS                      */
  /* ========================================================================= */
  const JobStatusMultiFilter = ({ options }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const selectedValues = options.value || [];

    const filteredOptions = dynamicJobStatusOptions.filter((status) =>
      status.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const isAllSelected =
      dynamicJobStatusOptions.length > 0 &&
      selectedValues.length === dynamicJobStatusOptions.length;

    const toggleSelectAll = () => {
      if (isAllSelected) {
        options.filterApplyCallback(null);
      } else {
        options.filterApplyCallback([...dynamicJobStatusOptions]);
      }
    };

    const handleCheckboxChange = (status) => {
      let updated = [...selectedValues];
      if (updated.includes(status)) {
        updated = updated.filter((item) => item !== status);
      } else {
        updated.push(status);
      }
      options.filterApplyCallback(updated.length > 0 ? updated : null);
    };

    return (
      <div className="custom-filter-panel">
        <div className="filter-header-title">
          <span>Filter Status</span>
          <span className="selected-badge">
            {selectedValues.length} selected
          </span>
        </div>

        {/* Search input */}
        <div className="filter-search-box">
          <i className="pi pi-search search-icon" />
          <input
            type="text"
            placeholder="Search status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="filter-search-input"
          />
          {searchQuery && (
            <i
              className="pi pi-times clear-search"
              onClick={() => setSearchQuery("")}
            />
          )}
        </div>

        {/* Select All Toggle */}
        <div className="select-all-row" onClick={toggleSelectAll}>
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={() => {}}
            className="custom-checkbox"
          />
          <span className="select-all-label">Select All</span>
        </div>

        <div className="filter-divider" />

        {/* Options List */}
        <div className="filter-list-container">
          {filteredOptions.length === 0 ? (
            <div className="no-options">No status found</div>
          ) : (
            filteredOptions.map((status) => {
              const isChecked = selectedValues.includes(status);
              const colors = getStatusColorConfig(status);

              return (
                <div
                  key={status}
                  className={`filter-item-row ${isChecked ? "active" : ""}`}
                  onClick={() => handleCheckboxChange(status)}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="custom-checkbox"
                  />
                  <span
                    className="status-pill-badge"
                    style={{
                      backgroundColor: colors.bg,
                      color: colors.text,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <span
                      className="status-dot"
                      style={{ backgroundColor: colors.text }}
                    />
                    {status}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  /* ========================================================================= */
  /*             PROFESSIONAL MULTI-SELECT FOR PROGRESS                        */
  /* ========================================================================= */
  const ProgressMultiFilter = ({ options }) => {
    const selectedValues = options.value || [];

    const handleToggle = (rangeValue) => {
      let updated = [...selectedValues];
      if (updated.includes(rangeValue)) {
        updated = updated.filter((item) => item !== rangeValue);
      } else {
        updated.push(rangeValue);
      }
      options.filterApplyCallback(updated.length > 0 ? updated : null);
    };

    const clearAll = () => options.filterApplyCallback(null);

    return (
      <div className="custom-filter-panel">
        <div className="filter-header-title">
          <span>Progress Range</span>
          {selectedValues.length > 0 && (
            <span className="clear-link" onClick={clearAll}>
              Reset
            </span>
          )}
        </div>

        <div className="progress-options-list">
          {progressOptions.map((opt) => {
            const isChecked = selectedValues.includes(opt.value);
            return (
              <div
                key={opt.value}
                className={`progress-item-card ${isChecked ? "active" : ""}`}
                onClick={() => handleToggle(opt.value)}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}}
                  className="custom-checkbox"
                />
                <span className="progress-label">{opt.label}</span>
                <span
                  className="progress-indicator-bar"
                  style={{ backgroundColor: opt.color }}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>{header}</div>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <Button
            type="button"
            icon="pi pi-filter-slash"
            label="Clear"
            outlined
            size="small"
            onClick={clearFilter}
          />

          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Search..."
              style={{ paddingLeft: "2rem" }}
            />
          </span>
        </div>
      </div>
    );
  };

  const handleRowClick = (row) => {
    setOpenrow(row);
    setOpenrowdialog(true);
  };

  const statusActivityBodyTemplate = (rowData) => {
    return (
      <>
        {rowData.actvityStatus === "Completed" ? (
          <MuiTooltip title="Completed" placement="right">
            <Button
              icon="pi pi-check"
              rounded
              text
              raised
              style={{
                height: "2.2rem",
                width: "2.2rem",
                cursor: "default",
                boxShadow: "none",
                background: "#e3f2fd",
              }}
              aria-label="Filter"
            />
          </MuiTooltip>
        ) : rowData.actvityStatus === "Rejected" ? (
          <MuiTooltip title="Rejected" placement="right">
            <Button
              icon="pi pi-times"
              rounded
              text
              raised
              severity="danger"
              style={{
                height: "2.2rem",
                width: "2.2rem",
                cursor: "default",
                boxShadow: "none",
                background: "#fce4ec",
              }}
            />
          </MuiTooltip>
        ) : rowData.actvityStatus === "Sent For Approval" ? (
          <MuiTooltip title="Sent For Approval" placement="right">
            <Button
              icon="pi pi-send"
              rounded
              text
              raised
              severity="success"
              style={{
                height: "2.2rem",
                width: "2.2rem",
                cursor: "default",
                boxShadow: "none",
                background: "#e8f5e9",
              }}
            />
          </MuiTooltip>
        ) : rowData.actvityStatus === "Started" ? (
          <MuiTooltip title="Started" placement="right">
            <Button
              icon="pi pi-play"
              rounded
              text
              raised
              size="small"
              severity="help"
              style={{
                height: "2.2rem",
                width: "2.2rem",
                cursor: "default",
                boxShadow: "none",
                background: "#ede7f6",
              }}
            />
          </MuiTooltip>
        ) : rowData.actvityStatus === "Review Started" ? (
          <MuiTooltip title="Review Started" placement="right">
            <Button
              icon="pi pi-file-check"
              rounded
              text
              raised
              severity="secondary"
              style={{
                height: "2.2rem",
                width: "2.2rem",
                cursor: "default",
                boxShadow: "none",
                background: "#e0e0e0",
              }}
            />
          </MuiTooltip>
        ) : rowData.actvityStatus === "Not Started" ? (
          <MuiTooltip title="Not Started" placement="right">
            <Button
              icon="pi pi-stopwatch"
              rounded
              text
              raised
              severity="secondary"
              style={{
                height: "2.2rem",
                width: "2.2rem",
                cursor: "default",
                boxShadow: "none",
                background: "#e0e0e0",
              }}
            />
          </MuiTooltip>
        ) : rowData.actvityStatus === "Aborted" ? (
          <MuiTooltip title="Aborted" placement="right">
            <Button
              icon="pi pi-ban"
              rounded
              text
              raised
              severity="danger"
              style={{
                height: "2.2rem",
                width: "2.2rem",
                cursor: "default",
                boxShadow: "none",
                background: "#fce4ec",
              }}
            />
          </MuiTooltip>
        ) : null}
      </>
    );
  };

  const activityNameBodyTemplate = (jobID) => (rowData) => {
    return (
      <Chip
        disabled={
          rowData.actvityStatus.toLowerCase() === "Not Started".toLowerCase() ||
          rowData.actvityStatus.toLowerCase() === "Started".toLowerCase()
        }
        style={{ cursor: "pointer" }}
        onClick={() => onActivityNameClick(rowData, jobID)}
        icon={
          rowData.actvityStatus === "Started" ? (
            <i
              className="pi pi-spin pi-spinner"
              style={{ fontSize: "0.8rem" }}
            ></i>
          ) : rowData.actvityStatus === "Completed" ? (
            <i className="pi pi-check" style={{ fontSize: "0.8rem" }}></i>
          ) : null
        }
        size="small"
        label={rowData.activityName}
      />
    );
  };

  const isYearLessThan2000 = (datetime) => {
    const year = new Date(datetime).getFullYear();
    return year < 2000;
  };

  function formatDateTime(startTime) {
    const d = isYearLessThan2000(startTime);
    if (d) return "----";
    if (!startTime) return "---";

    let startDate;

    if (startTime.includes("T")) {
      startDate = new Date(startTime);
    } else {
      const [datePart, timePart] = startTime.split(" ");
      const [day, month, year] = datePart.split("/").map(Number);
      const [hours, minutes, seconds] = timePart.split(":").map(Number);
      startDate = new Date(year, month - 1, day, hours, minutes, seconds);
    }

    const optionsTime = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const getShortYear = (date) => date.getFullYear().toString().slice(-2);

    const formattedDate = `${startDate.getDate()} ${new Intl.DateTimeFormat(
      "en-US",
      { month: "short" },
    ).format(startDate)} ${getShortYear(startDate)}`;

    const formattedTime = new Intl.DateTimeFormat("en-US", optionsTime).format(
      startDate,
    );

    return `${formattedDate} ${formattedTime}`;
  }

  const logbookBodyTemplate = (jobID) => (rowData) => {
    return (
      <>
        {rowData?.logbook !== null &&
        rowData?.logbook !== undefined &&
        rowData?.logbook !== " " &&
        rowData?.logbook !== "" ? (
          <Chip
            size="small"
            style={{ cursor: "pointer" }}
            disabled={
              rowData.actvityStatus.toLowerCase() ===
                "Not Started".toLowerCase() ||
              rowData.actvityStatus.toLowerCase() === "Started".toLowerCase()
            }
            variant="outlined"
            color="info"
            onClick={() => onLogbookClick(rowData, jobID)}
            label={rowData.logbook}
          />
        ) : (
          "----"
        )}
      </>
    );
  };

  const getInitialsFromEmail = (email) => {
    if (!email) return "";
    const namePart = email.split("@")[0];
    const parts = namePart.split(/[._-]/);
    return parts
      .filter(Boolean)
      .map((p) => p.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  const PerformerAndApprover = (rowData) => {
    if (!rowData) return null;
    return (
      <Stack direction="row" spacing={1} justifyContent={"center"}>
        {rowData.performer && (
          <MuiTooltip title={`Performer: ${rowData.performer}`} arrow>
            <MuiAvatar
              sx={{ width: 30, height: 30, fontSize: 13, bgcolor: "#1976d2" }}
            >
              {getInitialsFromEmail(rowData.performer)}
            </MuiAvatar>
          </MuiTooltip>
        )}
        {rowData.approver && (
          <MuiTooltip title={`Approver: ${rowData.approver}`} arrow>
            <MuiAvatar
              sx={{ width: 30, height: 30, fontSize: 13, bgcolor: "#2e7d32" }}
            >
              {getInitialsFromEmail(rowData.approver)}
            </MuiAvatar>
          </MuiTooltip>
        )}
      </Stack>
    );
  };

  const ScheduleStatAndStopTime = (rowData) => (
    <>
      <p style={{ margin: "0 0 4px 0", padding: 0 }}>
        {formatDateTime(rowData.scheduledActivityStartTime)}
      </p>
      <p style={{ margin: 0, padding: 0 }}>
        {formatDateTime(rowData.scheduledActivityEndTime)}
      </p>
    </>
  );

  const activityStatAndStopTime = (rowData) => (
    <>
      <p style={{ margin: "0 0 4px 0", padding: 0 }}>
        {formatDateTime(rowData.actualActivityStartTime)}
      </p>
      <p style={{ margin: 0, padding: 0 }}>
        {formatDateTime(rowData.actualActivityEndTime)}
      </p>
    </>
  );

  const rowExpansionTemplate = (rowData, jobID) => {
    return (
      <Card>
        <DataTable stripedRows value={rowData.activityList}>
          <Column field="sequence" header="Sequence" />
          <Column
            field="activityName"
            header="Activity Name"
            body={activityNameBodyTemplate(jobID)}
          />
          <Column
            field="logbook"
            header="Logbook"
            body={logbookBodyTemplate(jobID)}
          />
          <Column
            header="Performer vs Approver"
            body={PerformerAndApprover}
            headerStyle={{ textAlign: "center" }}
            bodyStyle={{ textAlign: "center" }}
          />
          <Column
            field="assetName"
            header="Assets"
            body={assetsBodyTemplateTest}
          />
          <Column
            field="scheduledActivityStartTime"
            header="Schedule Start Time vs Stop Time"
            body={ScheduleStatAndStopTime}
          />
          <Column
            field="actualActivityStartTime"
            header="Activity Start Time vs Stop Time"
            body={activityStatAndStopTime}
          />
          <Column
            field="actvityStatus"
            header="Status"
            body={statusActivityBodyTemplate}
          />
        </DataTable>
      </Card>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <>
        {rowData.jobStatus === "Completed" ? (
          <MuiTooltip title="Completed" placement="right">
            <Button
              icon="pi pi-check"
              rounded
              text
              raised
              style={{
                height: "2.2rem",
                width: "2.2rem",
                cursor: "default",
                boxShadow: "none",
                background: "#e3f2fd",
              }}
            />
          </MuiTooltip>
        ) : rowData.jobStatus === "Rejected" ? (
          <MuiTooltip title="Rejected" placement="right">
            <Button
              icon="pi pi-times"
              rounded
              text
              raised
              severity="danger"
              style={{
                height: "2.2rem",
                width: "2.2rem",
                cursor: "default",
                boxShadow: "none",
                background: "#fce4ec",
              }}
            />
          </MuiTooltip>
        ) : rowData.jobStatus === "Sent For Approval" ? (
          <MuiTooltip title="Sent For Approval" placement="right">
            <Button
              icon="pi pi-send"
              rounded
              text
              raised
              severity="success"
              style={{
                height: "2.2rem",
                width: "2.2rem",
                cursor: "default",
                boxShadow: "none",
                background: "#e8f5e9",
              }}
            />
          </MuiTooltip>
        ) : rowData.jobStatus === "Started" ? (
          <MuiTooltip title="Started" placement="right">
            <Button
              icon="pi pi-play"
              rounded
              text
              raised
              size="small"
              severity="help"
              style={{
                height: "2.2rem",
                width: "2.2rem",
                cursor: "default",
                boxShadow: "none",
                background: "#ede7f6",
              }}
            />
          </MuiTooltip>
        ) : rowData.jobStatus === "Review Started" ? (
          <MuiTooltip title="Review Started" placement="right">
            <Button
              icon="pi pi-file-check"
              rounded
              text
              raised
              severity="secondary"
              style={{
                height: "2.2rem",
                width: "2.2rem",
                cursor: "default",
                boxShadow: "none",
                background: "#e0e0e0",
              }}
            />
          </MuiTooltip>
        ) : rowData.jobStatus === "Not Started" ? (
          <MuiTooltip title="Not Started" placement="right">
            <Button
              icon="pi pi-stopwatch"
              rounded
              text
              raised
              severity="secondary"
              style={{
                height: "2.2rem",
                width: "2.2rem",
                cursor: "default",
                boxShadow: "none",
                background: "#e0e0e0",
              }}
            />
          </MuiTooltip>
        ) : rowData.jobStatus === "Approved" ? (
          <MuiTooltip title="Approved" placement="right">
            <Button
              icon="pi pi-check-square"
              rounded
              text
              raised
              severity="secondary"
              style={{
                height: "2.2rem",
                width: "2.2rem",
                cursor: "default",
                boxShadow: "none",
                background: "#e0e0e0",
              }}
            />
          </MuiTooltip>
        ) : rowData.jobStatus === "Aborted" ? (
          <MuiTooltip title="Aborted" placement="right">
            <Button
              icon="pi pi-ban"
              rounded
              text
              raised
              severity="danger"
              style={{
                height: "2.2rem",
                width: "2.2rem",
                cursor: "default",
                boxShadow: "none",
                background: "#fce4ec",
              }}
            />
          </MuiTooltip>
        ) : null}
      </>
    );
  };

  const progressBodyTemplate = (rowData) => {
    return (
      <ProgressBar
        value={rowData.progress ?? 0}
        style={{ borderRadius: "20px", height: "1rem" }}
        showValue={true}
      />
    );
  };

  const jobStartandStoptime = (rowData) => (
    <>
      <p style={{ margin: "0 0 4px 0", padding: 0 }}>
        {formatDateTime(rowData.actualJobStartTime)}
      </p>
      <p style={{ margin: 0, padding: 0 }}>
        {formatDateTime(rowData.actualJobEndTime)}
      </p>
    </>
  );

  const AssignerTemplate = (rowData) => {
    if (!rowData) return null;
    return (
      <Stack direction="row" spacing={1} justifyContent={"center"}>
        {rowData.assigner && (
          <MuiTooltip title={`${rowData.assigner}`} arrow>
            <MuiAvatar
              sx={{ width: 30, height: 30, fontSize: 13, bgcolor: "#2e7d32" }}
            >
              {getInitialsFromEmail(rowData.assigner)}
            </MuiAvatar>
          </MuiTooltip>
        )}
      </Stack>
    );
  };

  const assetsBodyTemplateTest = (rowData) => {
    return (
      <>
        {!rowData.assetName ? (
          "----"
        ) : (
          <MuiTooltip title={rowData.assetName} placement="bottom">
            <span
              style={{ fontWeight: "600" }}
              className={`assets-tooltip-${rowData.activityId}`}
            >
              <EllipsisText text={rowData.assetName} maxWidth={"120px"} />
            </span>
          </MuiTooltip>
        )}
      </>
    );
  };

  function getCurrentStartedActivity(activityData) {
    return activityData.activityList?.find(
      (activity) => activity.actvityStatus === "Started",
    );
  }

  const currentPerformerBodyTemplate = (rowData) => {
    const currentActivity = getCurrentStartedActivity(rowData);

    const initials = currentActivity?.performer
      ?.split("@")[0]
      .split(".")
      .map((name) => name.charAt(0).toUpperCase())
      .join("");

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          columnGap: "0.25rem",
        }}
      >
        <div className="current-performer-avatar-container">
          <Tooltip
            target={`.current-performer-avatar-${rowData.jobID}`}
            position="bottom"
          >
            {currentActivity?.performer}
          </Tooltip>
          {!currentActivity?.performer?.trim() ? (
            "---- "
          ) : (
            <Avatar
              shape="circle"
              size="normal"
              label={initials ? initials : "NA"}
              className={`current-performer-avatar-${rowData.jobID}`}
              style={{
                backgroundColor: "#04888d",
                color: "#ffffff",
                width: "30px",
                height: "30px",
                fontSize: "0.8rem",
              }}
            />
          )}
        </div>
        <div>
          {!currentActivity?.assetName ? (
            " ---- "
          ) : (
            <>
              <Tooltip
                target={`.assets-tooltip-${rowData.jobID}`}
                position="bottom"
              >
                {currentActivity?.assetName}
              </Tooltip>

              <span className={`assets-tooltip-${rowData.jobID}`}>
                <EllipsisText
                  text={currentActivity?.assetName}
                  maxWidth={"80px"}
                />
              </span>
            </>
          )}
        </div>
        <div>
          {!currentActivity?.activityName ||
          currentActivity?.activityName === "Self Job" ? (
            " ----"
          ) : (
            <Chip size="small" label={currentActivity?.activityName} />
          )}
        </div>
      </div>
    );
  };

  const onActivityNameClick = (rowData, jobID) => {
    setactivityNameClick(true);
    setLogbookClick(false);
    setSelectedActivity({
      jobName: jobID,
      activityName: rowData.activityId,
    });
    setDisplayDialog(true);
  };

  const onLogbookClick = (rowData, jobID) => {
    setactivityNameClick(false);
    setLogbookClick(true);
    setSelectedActivity({
      jobName: jobID,
      activityName: rowData.activityId,
    });
    setDisplayDialog(true);
  };

  const jobNameTemplate = (rowData) => {
    const emailinitials = rowData.approver
      ?.split("@")[0]
      .split(".")
      .map((name) => name.charAt(0).toUpperCase())
      .join("");

    return (
      <div
        className="Test"
        style={{
          display: "flex",
          columnGap: "0.5rem",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          onClick={() => handleRowClick(rowData)}
          icon="pi pi-eye"
          rounded
          text
          raised
          style={{
            height: "2.2rem",
            width: "2.2rem",
            cursor: "pointer",
            boxShadow: "none",
            background: "#e3f2fd",
          }}
          aria-label="Filter"
        />
        <MuiTooltip
          title={
            <>
              <Typography>Approver : {rowData.approver}</Typography>
              <Typography>Job Name : {rowData.jobName}</Typography>
              <Typography>Job Id : {rowData.jobID}</Typography>
            </>
          }
          placement="top"
        >
          <Chip
            color={
              rowData.priority === "Normal"
                ? "success"
                : rowData.priority === "Critical"
                  ? "error"
                  : rowData.priority === "Low"
                    ? "warning"
                    : "default"
            }
            label={<EllipsisText text={rowData.jobName} maxWidth={"80px"} />}
            avatar={
              <MuiAvatar
                sx={{
                  width: 35,
                  height: 35,
                  fontSize: "0.9rem",
                  background:
                    rowData.priority === "Normal"
                      ? "#2e7d32"
                      : rowData.priority === "Critical"
                        ? "#d32f2f"
                        : rowData.priority === "Low"
                          ? "#ed6c02"
                          : "gray",
                  color: "#ffff !important",
                }}
              >
                {emailinitials ? emailinitials : "NA"}
              </MuiAvatar>
            }
            variant="outlined"
            size="medium"
          />
        </MuiTooltip>
      </div>
    );
  };

  return (
    <>
      {/* PROFESSIONAL STYLING FOR CUSTOM MULTI-SELECT FILTERS */}
      <style>{`
        .custom-filter-panel {
          padding: 0.75rem;
          min-width: 220px;
          max-width: 260px;
          background: #ffffff;
          user-select: none;
        }
        .filter-header-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          font-weight: 700;
          color: #374151;
          margin-bottom: 0.6rem;
        }
        .selected-badge {
          font-size: 11px;
          font-weight: 600;
          background-color: #e0f2fe;
          color: #0369a1;
          padding: 2px 7px;
          border-radius: 12px;
        }
        .clear-link {
          font-size: 11px;
          color: #ef4444;
          font-weight: 600;
          cursor: pointer;
        }
        .clear-link:hover {
          text-decoration: underline;
        }
        .filter-search-box {
          position: relative;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
        }
        .filter-search-box .search-icon {
          position: absolute;
          left: 8px;
          color: #9ca3af;
          font-size: 12px;
        }
        .filter-search-input {
          width: 100%;
          padding: 6px 24px 6px 26px;
          font-size: 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          outline: none;
          transition: border-color 0.2s;
        }
        .filter-search-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
        }
        .clear-search {
          position: absolute;
          right: 8px;
          color: #9ca3af;
          font-size: 10px;
          cursor: pointer;
        }
        .select-all-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 6px;
          cursor: pointer;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          color: #4b5563;
        }
        .select-all-row:hover {
          background-color: #f3f4f6;
        }
        .filter-divider {
          height: 1px;
          background-color: #e5e7eb;
          margin: 6px 0;
        }
        .filter-list-container {
          max-height: 180px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-right: 2px;
        }
        .filter-list-container::-webkit-scrollbar {
          width: 4px;
        }
        .filter-list-container::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 4px;
        }
        .filter-item-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 6px;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }
        .filter-item-row:hover {
          background-color: #f3f4f6;
        }
        .filter-item-row.active {
          background-color: #f0fdf4;
        }
        .custom-checkbox {
          width: 15px;
          height: 15px;
          cursor: pointer;
          accent-color: #2563eb;
        }
        .status-pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .no-options {
          text-align: center;
          font-size: 12px;
          color: #9ca3af;
          padding: 8px 0;
        }
        .progress-options-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .progress-item-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 8px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.15s ease;
        }
        .progress-item-card:hover {
          border-color: #93c5fd;
          background-color: #f8fafc;
        }
        .progress-item-card.active {
          border-color: #3b82f6;
          background-color: #eff6ff;
          font-weight: 600;
        }
        .progress-label {
          flex: 1;
          margin-left: 8px;
        }
        .progress-indicator-bar {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
      `}</style>

      <Card>
        <DataTable
          removableSort
          header={renderHeader()}
          value={data}
          stripedRows
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          paginator
          pagina
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          rowExpansionTemplate={(rowData) =>
            rowExpansionTemplate(rowData, rowData.jobID)
          }
          dataKey="jobID"
          className="dashboardDatatable HeaderColor primereactPaginatorStyle"
          filters={filters}
          onFilter={(e) => setFilters(e.filters)}
          filterDisplay="menu"
          globalFilterFields={[
            "jobName",
            "taskTemplate",
            "assigner",
            "scheduledJobStartTime",
            "jobStatus",
            "priority",
            "approver",
          ]}
          emptyMessage="No jobs found."
        >
          <Column expander />
          <Column
            headerStyle={{ maxWidth: "12rem !important" }}
            bodyStyle={{ maxWidth: "12rem" }}
            field="jobName"
            header="Job Name"
            body={jobNameTemplate}
          />
          {groupBy === "Tag" && (
            <Column field="taskTemplate" header="Task Template" sortable />
          )}
          <Column
            className="assigner"
            header="Assigner"
            body={AssignerTemplate}
          />
          <Column
            field="jobScheduleStartTime"
            header="Assign Time"
            body={(rowData) => formatDateTime(rowData.scheduledJobStartTime)}
            sortable
          />
          <Column
            className="dateTimeSection"
            header="Job Start Time vs Stop Time"
            body={jobStartandStoptime}
          />

          {/* Progress Column with Interactive Multi-Select Filter */}
          <Column
            field="progress"
            header="Progress"
            body={progressBodyTemplate}
            sortable
            filter
            filterElement={(options) => (
              <ProgressMultiFilter options={options} />
            )}
            showFilterMatchModes={false}
            showFilterOperator={false}
            showAddButton={false}
            showApplyButton={false}
            showClearButton={false}
          />

          <Column
            field="currentPerformer"
            header="Current Performer / Activity /Asset"
            body={currentPerformerBodyTemplate}
          />

          {/* Job Status Column with Professional Dynamic Multi-Select Filter */}
          <Column
            field="jobStatus"
            header="Job Status"
            body={statusBodyTemplate}
            filter
            filterElement={(options) => (
              <JobStatusMultiFilter options={options} />
            )}
            showFilterMatchModes={false}
            showFilterOperator={false}
            showAddButton={false}
            showApplyButton={false}
            showClearButton={false}
          />
        </DataTable>

        <Dialog
          visible={displayDialog}
          onHide={() => setDisplayDialog(false)}
          maximizable
          blockScroll
        >
          <div>
            <center>
              {activityNameClick && (
                <TransactionTable
                  jobId={selectedActivity?.jobName}
                  activityId={selectedActivity?.activityName}
                />
              )}
              {logbookClick && (
                <LViewWithProps
                  jobId={selectedActivity?.jobName}
                  activityId={selectedActivity?.activityName}
                />
              )}
            </center>
          </div>
        </Dialog>

        <Dialog
          header={openrow?.jobName}
          visible={openrowdialog}
          style={{ width: "75vw", height: "75vh" }}
          onHide={() => {
            if (!openrowdialog) return;
            setOpenrowdialog(false);
          }}
        >
          <div style={{ border: "1px solid #e0e0e0", marginTop: "1rem" }}>
            <ActivityFlow job={openrow} />
          </div>
        </Dialog>
      </Card>
      <br />
    </>
  );
}
