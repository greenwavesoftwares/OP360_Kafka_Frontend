import React from "react";
import "./PriorityTag.css";

// Reflects JobDetails.priority (High / Medium / Low).
const PRIORITY_MAP = {
  high: { label: "High", tone: "high" },
  medium: { label: "Medium", tone: "medium" },
  low: { label: "Low", tone: "low" },
};

export default function PriorityTag({ priority }) {
  const entry = PRIORITY_MAP[(priority || "").toLowerCase()] || PRIORITY_MAP.medium;

  return (
    <span className="jab-priority">
      <span className={`jab-priority__dot jab-priority__dot--${entry.tone}`} />
      {entry.label}
    </span>
  );
}
