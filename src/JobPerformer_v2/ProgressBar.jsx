import React from "react";
import "./ProgressBar.css";

// Renders JobDetails.progress (0-100).
export default function ProgressBar({ value = 0 }) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="jab-progress">
      <div className="jab-progress__track">
        <div
          className={`jab-progress__fill ${clamped >= 100 ? "jab-progress__fill--done" : ""}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="jab-progress__label">{clamped}%</span>
    </div>
  );
}
