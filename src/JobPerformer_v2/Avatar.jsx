import { Users } from "lucide-react";
import Tooltip from "./Tooltip";
import "./Avatar.css";

const PALETTE = [
  "jab-avatar--blue",
  "jab-avatar--indigo",
  "jab-avatar--pink",
  "jab-avatar--green",
  "jab-avatar--orange",
  "jab-avatar--cyan",
];

function hashName(name = "") {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h;
}

function initialsOf(name) {
  return name
    .split(/[.\s_]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

// Renders initials for any performer / assigner / approver field
// (JobDetails.assigner, .approver, ActivityDetails.performer, etc.)
//
// A performer can be an Individual (rendered as the usual round,
// initials avatar) or a Group (rendered as a rounded-square tile
// with a people icon, since a group has no single set of initials).
export default function Avatar({ name, size = 26, type = "Individual", tooltip = true }) {
  if (!name) {
    return <span className="jab-avatar-empty">—</span>;
  }

  const isGroup = type === "Group";
  const isAssigner=type==='Assigner'
  const isApprover=type==='Approver'
  const toneClass = PALETTE[hashName(name) % PALETTE.length];

  const tip = isGroup
    ? `${name} (Group)`
    : isAssigner
      ? `Assigner: ${name}`
      : isApprover
        ? `Approver: ${name}`
        : name;

  return (
    <Tooltip content={tooltip ? tip : undefined}>
      <span
        // tabIndex so keyboard users can reach the tooltip too
        tabIndex={0}
        aria-label={tip}
        className={`jab-avatar ${toneClass} ${isGroup ? "jab-avatar--group" : ""}`}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {isGroup ? <Users size={Math.round(size * 0.55)} /> : initialsOf(name) || "?"}
      </span>
    </Tooltip>
  );
}
