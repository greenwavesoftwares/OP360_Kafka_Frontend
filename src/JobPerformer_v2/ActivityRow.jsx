import React from "react";
import { Play, Pause, Square, MessageSquare, Info, UserCheck } from "lucide-react";
import Tooltip from "./Tooltip";
import StatusBadge from "./StatusBadge";
import Avatar from "./Avatar";
import { formatDateTime, getLogbookHref } from "./formatters";
import "./ActivityRow.css";

export function ActivityActions({ activity, onAdvance, isMine, }) {
  console.log("Activity:",activity)
  
  const s = (activity.activityStatus || "").toLowerCase();

  console.log("Status::",activity.activityStatus)
  if (activity.enableActivityPerformance && isMine && ["not started"].includes(s)) {
    return (
      <Tooltip content="Start activity">
        <button className="jab-activity-action jab-activity-action--start" aria-label="Start activity" onClick={() => onAdvance("Started")}>
          <Play size={12} />
        </button>
      </Tooltip>
    );
  }

  if (activity.enableActivityPerformance && isMine && ["started"].includes(s)) {
    return (
      <div className="jab-activity-action-group">
        {/* <button className="jab-activity-action jab-activity-action--pause" title="Pause activity" onClick={() => onAdvance("Paused")}>
          <Pause size={12} />
        </button> */}
        <Tooltip content="Mark complete">
          <button className="jab-activity-action jab-activity-action--complete" aria-label="Mark complete" onClick={() => onAdvance("Completed")}>
            <Square size={12} fill="currentColor" />
          </button>
        </Tooltip>
      </div>
    );
  }

  // if (s === "paused") {
  //   return (
  //     <button className="jab-activity-action jab-activity-action--start" title="Resume activity" onClick={() => onAdvance("Running")}>
  //       <Play size={12} />
  //     </button>
  //   );
  // }

  return <span className="jab-activity-action-none">—</span>;
}

// One row = one ActivityDetails record belonging to the selected job.
// `isMine` marks a row as belonging to the signed-in performer, so
// it can be visually highlighted in the list.
export default function ActivityRow({ activity, onAdvance, onShowDetail, isMine }) {
  return (
    <tr className={`jab-activity-row ${isMine ? "jab-activity-row--mine" : ""}`}>
      <td className="jab-activity-row__seq">{String(activity.sequence).padStart(2, "0")}</td>

      <td>
        <div className="jab-activity-row__name">
          {activity.activityName}
          {activity.remarks && <MessageSquare size={12} className="jab-activity-row__remark-icon" />}
        </div>
      </td>

      <td>
        <div className="jab-activity-row__people">
          <Avatar name={activity.groupOrDeptName?.length>0?activity.groupOrDeptName:activity.performer} type={activity.groupOrDeptName?.length>0?"Group":"Individual"} size={22} />
          {isMine && (
            <Tooltip content="Assigned to you">
              <span className="jab-activity-row__mine-badge">
                <UserCheck size={11} />
                You
              </span>
            </Tooltip>
          )}
        </div>
      </td>
      <td>
        <div className="jab-activity-row__people">
          <Avatar name={activity.approver} type={"Individual"} size={22} />
        </div>
      </td>

      <td className="jab-activity-row__muted">
        {activity.logbook ? (
          <a
            className="jab-activity-row__logbook-link"
            href={getLogbookHref(activity)}
            onClick={(e) => e.stopPropagation()}
          >
            {activity.logbook}
          </a>
        ) : (
          "—"
        )}
      </td>
      <td className="jab-activity-row__muted">{formatDateTime(activity.scheduledActivityStartTime)}</td>
      <td className="jab-activity-row__muted">{formatDateTime(activity.scheduledActivityEndTime)}</td>
      
      <td>
        <StatusBadge status={activity.activityStatus} />
      </td>

      <td>
        <ActivityActions activity={activity} isMine={isMine} onAdvance={(next) => onAdvance(activity, next)} />
      </td>

      <td>
        <Tooltip content="View activity details">
          <button className="jab-activity-row__detail-btn" aria-label="View activity details" onClick={() => onShowDetail(activity)}>
            <Info size={13} />
          </button>
        </Tooltip>
      </td>
    </tr>
  );
}