import React, { useEffect, useMemo, useState } from "react";
import { ListChecks, MousePointerClick, ArrowLeft, Wrench, UserCheck, X } from "lucide-react";
import ActivityRow from "./ActivityRow";
import ActivityCard from "./ActivityCard";
import StatusBadge from "./StatusBadge";
import PriorityTag from "./PriorityTag";
import Avatar from "./Avatar";
import Tooltip from "./Tooltip";
import ActivityFilterBar, {
  ActivityFilterChip,
  EMPTY_ACTIVITY_FILTERS,
  buildActivityFilterOptions,
  applyActivityFilters,
  isActivityFilterActive,
} from "./ActivityFilterBar";
import { isMyActivity } from "./formatters";
import "./ActivitiesPanel.css";

const COLUMNS = ["Seq", "Activity", "Performer", "Reviewer","Logbook", "Sched. start", "Sched. end", "Status", "Actions", ""];

// Which filter field (if any) a given column header owns, and which side
// its popover should hang from. Columns past the halfway point align
// their popover to the right so it doesn't overflow the table's edge.
// "Logbook" carries the "asset" filter since that's the closest visible
// column to the underlying data it searches (see ActivityFilterBar).
const COLUMN_FILTER_FIELDS = {
  Seq: { key: "seq", label: "Seq", align: "left" },
  Activity: { key: "name", label: "Activity", align: "left" },
  Performer: { key: "performer", label: "Performer", align: "left" },
  Reviewer:{key:'reviewer', label:'Reviewer',align:'left'},
  Logbook: { key: "logbook", label: "Logbook", align: "left" },
  "Sched. start": { key: "startDate", label: "Scheduled start", align: "right" },
  "Sched. end": { key: "endDate", label: "Scheduled end", align: "right" },
  Status: { key: "status", label: "Status", align: "right" },
};

// Empty state shown on first load / when no job is selected yet.
function EmptyState() {
  return (
    <div className="jab-activities-panel jab-activities-panel--empty">
      <MousePointerClick size={22} className="jab-activities-panel__empty-icon" />
      <p className="jab-activities-panel__empty-title">Select a job to see its activities</p>
      <p className="jab-activities-panel__empty-sub">Tap any card above.</p>
    </div>
  );
}

// Renders the ActivityDetails list that belongs to the selected
// JobDetails record. Nothing renders here until a job is clicked —
// once it is, this panel takes over the space the jobs grid used.
export default function ActivitiesPanel({ job, onAdvanceActivity, onShowDetail, onBack, currentPerformer }) {
  const [filters, setFilters] = useState(EMPTY_ACTIVITY_FILTERS);

  // Reset filters whenever a different job is opened, so a filter set on
  // one job can't silently hide every row of the next one.
  const jobId = job?.jobID;
  useEffect(() => {
    setFilters(EMPTY_ACTIVITY_FILTERS);
  }, [jobId]);

  // Options are derived from this job's own activities, so the lists
  // never offer choices that can't match anything in the current view.
  const filterOptions = useMemo(() => buildActivityFilterOptions(job?.activities || []), [job]);

  const filteredActivities = useMemo(() => {
    if (!job) return [];
    return applyActivityFilters(job.activities, filters);
  }, [job, filters]);

  // if (!job) return <EmptyState />;
  if(job) {
  const myCount = job.activities.filter((a) => isMyActivity(a, currentPerformer)).length;

  return (
    <div className="jab-activities-panel">
      <button className="jab-activities-panel__back" onClick={onBack}>
        <ArrowLeft size={14} />
        Back to jobs
      </button>

      <div className="jab-activities-panel__header">
        <div className="jab-activities-panel__header-main">
          <p className="jab-activities-panel__eyebrow">
            <ListChecks size={13} />
            Activities for
          </p>
          <h2 className="jab-activities-panel__title">
            {job.jobName} <span className="jab-activities-panel__id">{job.jobID}</span>
          </h2>
          <div className="jab-activities-panel__context">
            <Tooltip content="Tag">
              <div className="jab-activities-panel__instrument">
                <Wrench size={12} />
                {job.groupId}
              </div>
            </Tooltip>
            <div className="jab-activities-panel__people">
              <Tooltip content="Assigner">
                <span className="jab-activities-panel__person">
                  <Avatar name={job.assigner} type="Assigner" size={20} tooltip={false} />
                  <span>{job.assigner}</span>
                </span>
              </Tooltip>

              <span className="jab-activities-panel__arrow">→</span>

              <Tooltip content="Approver">
                <span className="jab-activities-panel__person">
                  <Avatar name={job.approver} type="Approver" size={20} tooltip={false} />
                  <span>{job.approver}</span>
                </span>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="jab-activities-panel__badges">
          <StatusBadge status={job.jobStatus} />
          <PriorityTag priority={job.priority} />
        </div>
      </div>

      {currentPerformer && job.activities.length > 0 && (
        <div className="jab-activities-panel__mine-banner">
          <UserCheck size={13} />
          {myCount > 0
            ? `${myCount} of ${job.activities.length} activities are assigned to you (${currentPerformer.name})`
            : `None of these activities are assigned to you (${currentPerformer.name})`}
        </div>
      )}

      {/* Mobile-only strip — hidden by CSS once the table (with its own
          header-anchored filter chips below) is in view. */}
      {job.activities.length > 0 && (
        <ActivityFilterBar
          filters={filters}
          onChange={setFilters}
          options={filterOptions}
        />
      )}

      {/* Desktop / wide-screen layout: full table, scrolls horizontally if needed.
          Each filterable column carries its own search/dropdown control right
          next to its label, so there's no separate filter row above the table. */}
      <div className="jab-activities-panel__scroll">
        <table>
          <thead>
            <tr>
              {COLUMNS.map((h, i) => {
                const field = COLUMN_FILTER_FIELDS[h];
                const isLastColumn = i === COLUMNS.length - 1;
                return (
                  <th key={h || `col-${i}`}>
                    <span className="jab-activities-panel__th-inner">
                      {h}
                      {field && job.activities.length > 0 && (
                        <ActivityFilterChip
                          fieldKey={field.key}
                          label={field.label}
                          filters={filters}
                          set={(key, value) => setFilters({ ...filters, [key]: value })}
                          options={filterOptions}
                          variant="icon"
                          align={field.align}
                        />
                      )}
                      {isLastColumn && isActivityFilterActive(filters) && (
                        <Tooltip content="Clear filters">
                          <button
                            type="button"
                            className="jab-activities-panel__th-clear"
                            onClick={() => setFilters(EMPTY_ACTIVITY_FILTERS)}
                            aria-label="Clear filters"
                          >
                            <X size={11} />
                          </button>
                        </Tooltip>
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filteredActivities.map((activity) => (
              <ActivityRow
                key={activity.activityId}
                activity={activity}
                isMine={isMyActivity(activity, currentPerformer)}
                onAdvance={(a, next) => onAdvanceActivity(job, a, next)}
                onShowDetail={onShowDetail}
              />
            ))}
            {job.activities.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="jab-activities-panel__no-activities">
                  This job has no activities yet.
                </td>
              </tr>
            )}
            {job.activities.length > 0 && filteredActivities.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="jab-activities-panel__no-activities">
                  No activities match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile layout: one card per activity, replaces the table below the breakpoint. */}
      <div className="jab-activities-panel__cards">
        {filteredActivities.map((activity) => (
          <ActivityCard
            key={activity.activityId}
            activity={activity}
            isMine={isMyActivity(activity, currentPerformer)}
            onAdvance={(a, next) => onAdvanceActivity(job, a, next)}
            onShowDetail={onShowDetail}
          />
        ))}
        {job.activities.length === 0 && (
          <div className="jab-activities-panel__no-activities">This job has no activities yet.</div>
        )}
        {job.activities.length > 0 && filteredActivities.length === 0 && (
          <div className="jab-activities-panel__no-activities">No activities match the current filters.</div>
        )}
      </div>
    </div>
  );
  }
  return null;
}
