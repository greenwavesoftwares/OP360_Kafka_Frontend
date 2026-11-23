// Shared across row/detail components so every Date field from
// JobDetails / ActivityDetails renders consistently.
// True when `activity` is assigned to `currentPerformer` — either as
// the named individual (performer) or as the group/department that
// currently owns the row (groupOrDeptName). Used to highlight "my"
// activities in the Activities view.
export function isMyActivity(activity, currentPerformer) {
  if (!activity || !currentPerformer?.name) return false;
  if (currentPerformer.type === "Group") {
    return activity.groupOrDeptName === currentPerformer.name;
  }
  return activity.performer === currentPerformer.name;
}

// Where the "Logbook" cell/field should link to. Prefers an explicit
// logbookUrl on the record (e.g. once the real backend supplies one);
// otherwise falls back to a logbook-detail route keyed by the logbook
// code itself. Returns null when there's no logbook to link to, so
// callers can fall back to plain "—" text.
export function getLogbookHref(activity) {
  if (!activity) return null;
  if (activity.logbookUrl) return activity.logbookUrl;
  if (!activity.logbook) return null;
  return `/logbook/${encodeURIComponent(activity.logbook)}`;
}

// [start, end) Date bounds for today (local time, midnight to midnight).
export function getTodayRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return { start, end };
}

// [start, end) Date bounds for the calendar month `offsetFromCurrent`
// months away from today (0 = this month, -1 = last month, 1 = next
// month). Used by the jobs toolbar's "Current / Last / Upcoming month"
// filter.
export function getMonthRange(offsetFromCurrent) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + offsetFromCurrent, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offsetFromCurrent + 1, 1);
  return { start, end };
}

// [start, end) Date bounds for a custom from/to range of "YYYY-MM-DD"
// strings (local time). "to" is inclusive, so the exclusive end bound is
// the following midnight. Either side can be empty to leave it open.
export function getCustomRange(from, to) {
  const parse = (v) => {
    const [y, m, d] = v.split("-").map(Number);
    return new Date(y, m - 1, d);
  };
  const start = from ? parse(from) : null;
  let end = null;
  if (to) {
    end = parse(to);
    end.setDate(end.getDate() + 1);
  }
  return { start, end };
}

// True when `value` (a date/datetime string) falls within [start, end).
// Either bound can be null to leave that side open.
export function isDateWithinRange(value, start, end) {
  if (!value) return false;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return false;
  if (start && d < start) return false;
  if (end && d >= end) return false;
  return true;
}

export function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}