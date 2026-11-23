import React from "react";
import { X, Paperclip, Timer } from "lucide-react";
import StatusBadge from "./StatusBadge";
import PriorityTag from "./PriorityTag";
import { formatDateTime, getLogbookHref } from "./formatters";
import "./DetailPanel.css";

// A performer value can be either a plain string/number (most fields)
// or a { name, type } object for Performer / Current performer, where
// type is "Individual" or "Group". This renders either shape.
function formatValue(value) {
  if (value && typeof value === "object" && "name" in value) {
    return value.type === "Group" ? `${value.name} (Group)` : value.name;
  }
  return String(value);
}

// Row tuples are [label, value] for plain fields, or [label, value, href]
// when that field (currently just "Logbook") should render as a link.
function DetailGrid({ rows }) {
  const visible = rows.filter(
    ([, v]) => v !== undefined && v !== null && v !== "" && !(v && typeof v === "object" && !v.name),
  );
  return (
    <dl className="jab-detail-grid">
      {visible.map(([label, value, href]) => (
        <div key={label} className="jab-detail-grid__item">
          <dt className="jab-detail-grid__label">{label}</dt>
          <dd className="jab-detail-grid__value">
            {href ? (
              <a className="jab-detail-grid__link" href={href}>
                {formatValue(value)}
              </a>
            ) : (
              formatValue(value)
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

// Full field dump for either a JobDetails record or an
// ActivityDetails record, opened from the "info" icon on a row.
export default function DetailPanel({ item, kind, onClose }) {
  if (!item) return null;
  const isJob = kind === "job";
  console.log("Item displayed in showDetail::",item)
  const rows = isJob
    ? [
        ["Job ID", item.jobID],
        ["Assigner", item.assigner],
        ["Approver", item.approver],
        ["Tag", item.groupId],
        ["Scheduled start", formatDateTime(item.scheduledJobStartTime)],
        ["Scheduled end", formatDateTime(item.scheduledJobEndTime)],
        ["Actual start", formatDateTime(item.actualJobStartTime)],
        ["Actual end", formatDateTime(item.actualJobEndTime)],
        
      ]
    : [
        ["Sequence", item.sequence],
        ["Performer", item.performer],
        ["Reviewer", item.approver],
        ["Logbook", item.logbook, getLogbookHref(item)],
        ["Department", item.groupOrDeptName],
        ["Scheduled start", formatDateTime(item.scheduledActivityStartTime)],
        ["Scheduled end", formatDateTime(item.scheduledActivityEndTime)],
        ["Actual start", formatDateTime(item.actualActivityStartTime)],
        ["Actual end", formatDateTime(item.actualActivityEndTime)],
        ["Duration", `${item.duration} min`],
        ["Buffer", `${item.buffer ?? 0} min`],
      ];

  return (
    <div className="jab-detail-overlay" onClick={onClose}>
      <div className="jab-detail-panel" onClick={(e) => e.stopPropagation()}>
        <div className="jab-detail-panel__header">
          <div>
            <p className="jab-detail-panel__eyebrow">{isJob ? "Job" : "Activity"}</p>
            <h3 className="jab-detail-panel__title">{isJob ? item.jobName : item.activityName}</h3>
          </div>
          <button className="jab-detail-panel__close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="jab-detail-panel__body">
          <div className="jab-detail-panel__badges">
            <StatusBadge status={isJob ? item.jobStatus : item.activityStatus} />
            {isJob && <PriorityTag priority={item.priority} />}
          </div>

          <DetailGrid rows={rows} />

          {item.remarks && (
            <div>
              <p className="jab-detail-panel__section-label">Remarks</p>
              <p className="jab-detail-panel__note">{item.remarks}</p>
            </div>
          )}

          

          {!isJob && item.delayDueToBuffer && (
            <div className="jab-detail-panel__inline-note jab-detail-panel__inline-note--warning">
              <Timer size={13} />
              Delay due to buffer: {item.delayDueToBuffer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
