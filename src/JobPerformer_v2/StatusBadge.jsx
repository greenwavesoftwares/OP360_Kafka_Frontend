import React from "react";
import "./StatusBadge.css";

// Maps both JobDetails.jobStatus and ActivityDetails.actvityStatus
// onto one consistent visual vocabulary.
const STATUS_MAP = {
  "not started": {
    label: "Not Started",
    tone: "warning",
  },
  started: {
    label: "Started",
    tone: "info",
    pulse: true,
  },
  completed: {
    label: "Completed",
    tone: "success",
  },
  rejected: {
    label: "Rejected",
    tone: "danger",
  },
  aborted: {
    label: "Aborted",
    tone: "danger",
  },
};


export default function StatusBadge({ status }) {
  const entry = STATUS_MAP[(status || "").toLowerCase()] || STATUS_MAP.pending;
  console.log("Entry::",entry)
  
  return (
    <span className={`jab-status jab-status--${entry.tone}`}>
      <span className={`jab-status__dot ${entry.pulse ? "jab-status__dot--pulse" : ""}`} />
      {entry.label}
    </span>
  );
}
