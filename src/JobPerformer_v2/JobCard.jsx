import React from "react";
import { Wrench, Info, Clock, ListChecks, Hourglass } from "lucide-react";
import Tooltip from "./Tooltip";
import StatusBadge from "./StatusBadge";
import PriorityTag from "./PriorityTag";
import ProgressBar from "./ProgressBar";
import Avatar from "./Avatar";
import "./JobCard.css";

// One card = one JobDetails record. Selecting a card is what drives
// which job's activities are shown in ActivitiesPanel — the card
// itself never reveals activities.
//
// The card only surfaces what's relevant for scanning a job at a
// glance (who's on it right now, how many activities remain) — the
// full field dump (assigner, approver, exact timestamps, etc.) lives
// one tap away in DetailPanel via the info button.
export default function JobCard({ job, isSelected, onSelect, onShowDetail }) {
  const activities = job.activities ?? [];
  const totalActivities = activities.length;
  const remaining = activities.filter((a) => a.activityStatus !== "Completed").length;

  const performer = job.currentPerformer;

  return (
    <div
      className={`jab-job-card ${isSelected ? "jab-job-card--selected" : ""}`}
      onClick={() => onSelect(job)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(job);
        }
      }}
    >
      <div className="jab-job-card__top">
        <div className="jab-job-card__title-block">
          <div className="jab-job-card__title-line">
            <span className="jab-job-card__name">{job.jobName}</span>
            {job.adhoc && <span className="jab-job-card__adhoc">Adhoc</span>}
          </div>
          <span className="jab-job-card__id">{job.jobID}</span>
        </div>

        <Tooltip content="View job details">
          <button
            className="jab-job-card__detail-btn"
            aria-label="View job details"
            onClick={(e) => {
              e.stopPropagation();
              onShowDetail(job);
            }}
          >
            <Info size={14} />
          </button>
        </Tooltip>
      </div>

      <div className="jab-job-card__badges">
        <StatusBadge status={job.jobStatus} />
        <PriorityTag priority={job.priority} />
      </div>


      <div className="jab-job-card__stats">
        <div className="jab-job-card__stat">
          <ListChecks size={13} />
          <span>
            <strong>{totalActivities}</strong> activities
          </span>
        </div>
        <div className="jab-job-card__stat">
          <Hourglass size={13} />
          <span>
            <strong>{remaining}</strong> remaining
          </span>
        </div>
        
      </div>

      <div className="jab-job-card__footer">
        <ProgressBar value={job.progress ?? 0} />
      </div>
    </div>
  );
}
