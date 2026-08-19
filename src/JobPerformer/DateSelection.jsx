import { Calendar } from "primereact/calendar";
import { useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import { IconButton, Tooltip } from "@mui/material";

export default function DateSelection({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  isMob,
  isTab,
}) {
  const today = new Date();
  const [active, setActive] = useState("month");

  const applyPreset = (type) => {
    setActive(type);

    switch (type) {
      case "today":
        setFromDate(today);
        setToDate(today);
        break;
      case "month":
        setFromDate(new Date(today.getFullYear(), today.getMonth(), 1));
        setToDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
        break;
      case "3months":
        setFromDate(new Date(today.getFullYear(), today.getMonth() - 3, today.getDate()));
        setToDate(today);
        break;
      case "upcoming3months":
        setFromDate(today);
        setToDate(new Date(today.getFullYear(), today.getMonth() + 3, today.getDate()));
        break;
      case "year":
        setFromDate(new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()));
        setToDate(today);
        break;
      case "custom":
        const from = new Date(today);
        const to = new Date(today);
        from.setMonth(from.getMonth() - 3);
        to.setMonth(to.getMonth() + 3);
        setFromDate(from);
        setToDate(to);
        break;
    }
  };

  // ── Re-applies the currently active preset with a fresh "today" ──
  const handleRefresh = () => {
  if (active === "custom") {
    // dates are already set by the user — just trigger parent re-fetch
    // by calling setFromDate/setToDate with the same values
    setFromDate(fromDate);
    setToDate(toDate);
  } else {
    applyPreset(active);
  }
};

  const buttonStyle = (type) => ({
    padding: "6px 14px",
    borderRadius: "20px",
    border: active === type ? "1px solid #3B82F6" : "1px solid #E5E7EB",
    background: active === type ? "#EFF6FF" : "#fff",
    color: active === type ? "#2563EB" : "#374151",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: active === type ? "600" : "500",
  });

  return (
    <div
      style={{
        background: "#ffffff",
        padding: "16px",
        borderRadius: "10px",
        border: "1px solid #E5E7EB",
      }}
    >
      {/* Preset buttons + Refresh */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          alignItems: "center",
          marginBottom: active === "custom" ? "16px" : "0px",
        }}
      >
        <button style={buttonStyle("today")} onClick={() => applyPreset("today")}>Today</button>
        <button style={buttonStyle("month")} onClick={() => applyPreset("month")}>Current Month</button>
        <button style={buttonStyle("3months")} onClick={() => applyPreset("3months")}>Last 3 Months</button>
        <button style={buttonStyle("upcoming3months")} onClick={() => applyPreset("upcoming3months")}>Upcoming 3 Months</button>
        <button style={buttonStyle("year")} onClick={() => applyPreset("year")}>Last 1 Year</button>
        <button style={buttonStyle("custom")} onClick={() => applyPreset("custom")}>Custom</button>

        {/* ── REFRESH ── */}
        <Tooltip title={`Refresh — reapply "${active}"`}>
          <IconButton
            size="small"
            onClick={handleRefresh}
            sx={{
              border: "1px solid #E5E7EB",
              borderRadius: "20px",
              padding: "5px 10px",
              color: "#374151",
              "&:hover": {
                borderColor: "#3B82F6",
                color: "#2563EB",
                background: "#EFF6FF",
              },
            }}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>

      {/* Show calendars ONLY when custom selected */}
      {active === "custom" && (
        <div
          style={{
            display: "flex",
            flexDirection: isMob || isTab ? "column" : "row",
            gap: "14px",
            marginTop: "10px",
          }}
        >
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "12px", color: "#6B7280" }}>From Date</label>
            <Calendar
              value={fromDate}
              onChange={(e) => setFromDate(e.value)}
              showIcon
              dateFormat="dd/mm/yy"
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "12px", color: "#6B7280" }}>To Date</label>
            <Calendar
              value={toDate}
              minDate={fromDate}
              onChange={(e) => setToDate(e.value)}
              showIcon
              dateFormat="dd/mm/yy"
              style={{ width: "100%" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}