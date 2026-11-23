import React from "react";
import { MessageSquare, Info, UserCheck, Clock, Wrench } from "lucide-react";
import Tooltip from "./Tooltip";
import StatusBadge from "./StatusBadge";
import Avatar from "./Avatar";
import { ActivityActions } from "./ActivityRow";
import { formatDateTime, getLogbookHref } from "./formatters";
import "./ActivityCard.css";

// One card = one ActivityDetails record belonging to the selected
// job. This is the small-screen counterpart to ActivityRow — same
// data and actions, laid out for a single narrow column instead of
// a table row. `isMine` marks a card as belonging to the signed-in
// performer, so it can be visually highlighted in the list.
export default function ActivityCard({ activity, onAdvance, onShowDetail, isMine }) {
  const performerName = activity.groupOrDeptName?.length > 0 ? activity.groupOrDeptName : activity.performer;
  const performerType = activity.groupOrDeptName?.length > 0 ? "Group" : "Individual";

  return (
    <div className={`jab-activity-card ${isMine ? "jab-activity-card--mine" : ""}`}>
      <div className="jab-activity-card__top">
        <span className="jab-activity-card__seq">{String(activity.sequence).padStart(2, "0")}</span>
        <div className="jab-activity-card__title-block">
          <div className="jab-activity-card__name">
            {activity.activityName}
            {activity.remarks && <MessageSquare size={12} className="jab-activity-card__remark-icon" />}
          </div>
        </div>
        <Tooltip content="View activity details">
          <button className="jab-activity-card__detail-btn" aria-label="View activity details" onClick={() => onShowDetail(activity)}>
            <Info size={14} />
          </button>
        </Tooltip>
      </div>

      <div className="jab-activity-card__badges">
        <StatusBadge status={activity.activityStatus} />
        {isMine && (
          <Tooltip content="Assigned to you">
            <span className="jab-activity-card__mine-badge">
              <UserCheck size={11} />
              You
            </span>
          </Tooltip>
        )}
      </div>

      <div className="jab-activity-card__people">
        <Tooltip content={`Performer: ${performerName || "Unassigned"}`}>
          <div className="jab-activity-card__person">
            <span className="jab-activity-card__person-label">Performer</span>
            <div className="jab-activity-card__person-body">
              <Avatar name={performerName} type={performerType} size={22} tooltip={false} />
              <span className="jab-activity-card__performer-name">{performerName || "Unassigned"}</span>
              {performerType === "Group" && <span className="jab-activity-card__performer-tag">Group</span>}
            </div>
          </div>
        </Tooltip>

        <Tooltip content={`Reviewer: ${activity.approver || "Not assigned"}`}>
          <div className="jab-activity-card__person">
            <span className="jab-activity-card__person-label">Reviewer</span>
            <div className="jab-activity-card__person-body">
              <Avatar name={activity.approver} type="Individual" size={22} tooltip={false} />
              {activity.approver && <span className="jab-activity-card__performer-name">{activity.approver}</span>}
            </div>
          </div>
        </Tooltip>
      </div>

      <div className="jab-activity-card__meta">
        <div className="jab-activity-card__meta-item">
          <Wrench size={12} />
          {activity.logbook ? (
            <a
              className="jab-activity-card__logbook-link"
              href={getLogbookHref(activity)}
              onClick={(e) => e.stopPropagation()}
            >
              {activity.logbook}
            </a>
          ) : (
            <span>—</span>
          )}
        </div>
        <div className="jab-activity-card__meta-item">
          <Clock size={12} />
          <span>
            {formatDateTime(activity.scheduledActivityStartTime)} – {formatDateTime(activity.scheduledActivityEndTime)}
          </span>
        </div>
        <div className="jab-activity-card__meta-item jab-activity-card__meta-item--muted">
          <span>{activity.duration} min</span>
        </div>
      </div>

      <div className="jab-activity-card__footer">
        <ActivityActions activity={activity} isMine={isMine} onAdvance={(next) => onAdvance(activity, next)} />
      </div>
    </div>
  );
}
