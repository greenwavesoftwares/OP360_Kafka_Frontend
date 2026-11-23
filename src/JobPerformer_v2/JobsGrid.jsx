import React from "react";
import JobCard from "./JobCard";
import "./JobsGrid.css";

// Renders job metadata only (JobDetails records) as a responsive
// card grid. Activities are intentionally not shown here — see
// ActivitiesPanel, which replaces this grid once a card is selected.
export default function JobsGrid({ jobs, selectedJobId, onSelectJob, onShowDetail }) {
  if (!jobs||jobs?.length === 0) {
    return (
      <div className="jab-jobs-grid">
        <div className="jab-jobs-grid__empty">No jobs match this search.</div>
      </div>
    );
  }

  return (
    <div className="jab-jobs-grid">
      {jobs.map((job) => (
        <JobCard
          key={job.jobID}
          job={job}
          isSelected={job.jobID === selectedJobId}
          onSelect={onSelectJob}
          onShowDetail={onShowDetail}
        />
      ))}
    </div>
  );
}
