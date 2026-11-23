import React, { useEffect, useRef, useState } from "react";
import Tooltip from "./Tooltip";
import { ChevronDown, Filter, X } from "lucide-react";
import { getMonthRange, isDateWithinRange } from "./formatters";
import "./ActivityFilterBar.css";

// Date-range filter shape used by the Sched. start / Sched. end columns.
// Mirrors the jobs toolbar presets (current / last / upcoming month) and
// adds a custom from/to range. preset "all" = no filter.
export const EMPTY_DATE_FILTER = { preset: "all", from: "", to: "" };

export const DATE_FILTER_PRESETS = [
  { key: "current", label: "Current month" },
  { key: "last", label: "Last month" },
  { key: "upcoming", label: "Upcoming month" },
  { key: "custom", label: "Custom" },
];

const DATE_FIELDS = ["startDate", "endDate"];

export function isDateFilterActive(f) {
  if (!f || !f.preset || f.preset === "all") return false;
  if (f.preset === "custom") return f.from !== "" || f.to !== "";
  return true;
}

// [start, end) bounds for a date filter, or null when it isn't restricting.
function getDateFilterRange(f) {
  if (!isDateFilterActive(f)) return null;
  switch (f.preset) {
    case "current":
      return getMonthRange(0);
    case "last":
      return getMonthRange(-1);
    case "upcoming":
      return getMonthRange(1);
    case "custom": {
      // Inputs are local calendar dates; "to" is inclusive, so the
      // exclusive end bound is the following midnight.
      const parse = (v) => {
        const [y, m, d] = v.split("-").map(Number);
        return new Date(y, m - 1, d);
      };
      const start = f.from ? parse(f.from) : null;
      let end = null;
      if (f.to) {
        end = parse(f.to);
        end.setDate(end.getDate() + 1);
      }
      return { start, end };
    }
    default:
      return null;
  }
}

// seq/name/performer/asset/status are searchable checkbox lists, so an empty
// array means "All". startDate/endDate are date-range filters (see EMPTY_DATE_FILTER).
export const EMPTY_ACTIVITY_FILTERS = {
  seq: [],
  name: [],
  performer: [],
  reviewer:[],
  logbook: [],
  startDate: EMPTY_DATE_FILTER,
  endDate: EMPTY_DATE_FILTER,
  durationMin: "",
  durationMax: "",
  status: [],
};

// Fields rendered as a searchable checkbox list (everything except dates).
const LIST_FIELDS = ["seq", "name", "performer","reviewer", "logbook", "status"];

export function isActivityFilterActive(filters) {
  return (
    LIST_FIELDS.some((k) => filters[k].length > 0) ||
    isDateFilterActive(filters.startDate) ||
    isDateFilterActive(filters.endDate) ||
    filters.durationMin !== "" ||
    filters.durationMax !== ""
  );
}

const getPerformerLabel = (a) => (a.groupOrDeptName?.length > 0 ? a.groupOrDeptName : a.performer || "");

// Builds the option lists for the checklists from the unfiltered activities.
// Call once in the parent and pass the result to ActivityFilterBar and to
// every ActivityFilterChip via `options`.
export function buildActivityFilterOptions(activities) {
  const uniq = (arr) => [...new Set(arr.filter((v) => v !== "" && v != null))];
  return {
    seqOptions: uniq(activities.map((a) => String(a.sequence ?? ""))).sort((x, y) => Number(x) - Number(y)),
    activityOptions: uniq(activities.map((a) => a.activityName || "")).sort((x, y) => x.localeCompare(y)),
    performerOptions: uniq(activities.map(getPerformerLabel)).sort((x, y) => x.localeCompare(y)),
    reviewerOptions:  uniq(activities.map((a)=>a.approver)).sort((x,y)=>x.localeCompare(y)),
    logbookOptions: uniq(activities.map((a) => a.logbook || "")).sort((x, y) => x.localeCompare(y)),
    statusOptions: uniq(activities.map((a) => a.activityStatus || "")).sort((x, y) => x.localeCompare(y)),
  };
}

// Applies EMPTY_ACTIVITY_FILTERS-shaped state to a list of ActivityDetails
// records. One filter field per column shown in ActivitiesPanel's table.
export function applyActivityFilters(activities, filters) {
  return activities.filter((a) => {
    if (filters.seq.length > 0 && !filters.seq.includes(String(a.sequence))) return false;
    if (filters.name.length > 0 && !filters.name.includes(a.activityName || "")) return false;
    if (filters.performer.length > 0 && !filters.performer.includes(getPerformerLabel(a))) return false;
    if (filters.logbook.length > 0 && !filters.logbook.includes(a.logbook || "")) return false;

    const startRange = getDateFilterRange(filters.startDate);
    if (startRange && !isDateWithinRange(a.scheduledActivityStartTime, startRange.start, startRange.end)) return false;
    const endRange = getDateFilterRange(filters.endDate);
    if (endRange && !isDateWithinRange(a.scheduledActivityEndTime, endRange.start, endRange.end)) return false;

    if (filters.durationMin !== "" && !(a.duration >= Number(filters.durationMin))) return false;
    if (filters.durationMax !== "" && !(a.duration <= Number(filters.durationMax))) return false;

    if (filters.status.length > 0 && !filters.status.includes(a.activityStatus || "")) return false;

    return true;
  });
}

// Whether a single field currently holds a non-default value. Drives the
// active-dot shown on that field's chip.
function isFieldActive(key, filters) {
  if (LIST_FIELDS.includes(key)) return filters[key].length > 0;
  if (DATE_FIELDS.includes(key)) return isDateFilterActive(filters[key]);
  return filters[key] !== "";
}

// One entry per filterable ActivitiesPanel column (Seq, Activity, Performer,
// Logbook, Sched. start, Sched. end, Status). Actions/detail columns
// aren't filterable so they have no entry here. `label` is used as the
// popover title — it names the field being filtered, which matches the column header it sits on.
export const ACTIVITY_FILTER_FIELDS = [
  { key: "seq", label: "Seq" },
  { key: "name", label: "Activity" },
  { key: "performer", label: "Performer" },
  { key: "reviewer", label: "Reviewer"},
  { key: "logbook", label: "Logbook" },
  { key: "startDate", label: "Sched. start" },
  { key: "endDate", label: "Sched. end" },
  { key: "status", label: "Status" },
];

// Search box (filters the visible options) + Clear + scrollable checkbox
// list. Every option toggles independently and an empty selection reads as
// "All". Selections persist even when hidden by the search text.
function ChecklistControl({ selected, allOptions, onToggle, onClear, placeholder }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const visible = q ? allOptions.filter((o) => String(o).toLowerCase().includes(q)) : allOptions;

  return (
    <div className="jab-activity-filters__checklist-wrap">
      <div className="jab-activity-filters__search-row">
        <input
          autoFocus
          type="text"
          className="jab-activity-filters__search"
          placeholder={placeholder || "Search list"}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="button"
          className="jab-activity-filters__field-clear"
          onClick={onClear}
          disabled={selected.length === 0}
        >
          Clear
        </button>
      </div>

      <div className="jab-activity-filters__checklist">
        {!q && (
          <label className="jab-activity-filters__check-row">
            <input type="checkbox" checked={selected.length === 0} onChange={onClear} />
            <span>All</span>
          </label>
        )}
        {visible.map((opt) => (
          <label key={opt} className="jab-activity-filters__check-row">
            <input type="checkbox" checked={selected.includes(opt)} onChange={() => onToggle(opt)} />
            <span>{opt}</span>
          </label>
        ))}
        {visible.length === 0 && <div className="jab-activity-filters__empty">No matches</div>}
      </div>
    </div>
  );
}

// Preset radio list (All / Current / Last / Upcoming month / Custom) with
// from/to inputs revealed for Custom, plus its own Clear button.
function DateControl({ value, onChange, name }) {
  const f = value && typeof value === "object" ? value : EMPTY_DATE_FILTER;
  const active = isDateFilterActive(f);
  const rows = [{ key: "all", label: "All" }, ...DATE_FILTER_PRESETS];

  return (
    <div className="jab-activity-filters__date-wrap">
      <div className="jab-activity-filters__checklist">
        {rows.map(({ key, label }) => (
          <label key={key} className="jab-activity-filters__check-row">
            <input
              type="radio"
              name={name}
              checked={f.preset === key}
              onChange={() => onChange({ ...f, preset: key })}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>

      {f.preset === "custom" && (
        <div className="jab-activity-filters__custom-range">
          <label>
            From
            <input type="date" value={f.from} max={f.to || undefined} onChange={(e) => onChange({ ...f, from: e.target.value })} />
          </label>
          <label>
            To
            <input type="date" value={f.to} min={f.from || undefined} onChange={(e) => onChange({ ...f, to: e.target.value })} />
          </label>
        </div>
      )}

      <button
        type="button"
        className="jab-activity-filters__field-clear"
        onClick={() => onChange(EMPTY_DATE_FILTER)}
        disabled={!active && f.preset === "all"}
      >
        Clear
      </button>
    </div>
  );
}

// Renders the actual control for a field. Shared by every place a filter
// control appears (mobile sheet, header-anchored popover) so all fields
// behave identically in both.
export function renderActivityFilterControl(key, filters, set, options) {
  const {
    seqOptions = [],
    activityOptions = [],
    performerOptions = [],
    reviewerOptions= [],
    logbookOptions = [],
    statusOptions = [],
  } = options || {};

  const toggleIn = (field) => (value) => {
    const current = filters[field];
    set(field, current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);
  };

  const listProps = {
    seq: { allOptions: seqOptions, placeholder: "Search seq" },
    name: { allOptions: activityOptions, placeholder: "Search activity" },
    performer: { allOptions: performerOptions, placeholder: "Search performer" },
    reviewer: {allOptions: reviewerOptions, placeholder: "Search reviewer"},
    logbook: { allOptions: logbookOptions, placeholder: "Search logbook" },
    status: { allOptions: statusOptions, placeholder: "Search status" },
  };

  if (LIST_FIELDS.includes(key)) {
    return (
      <ChecklistControl
        selected={filters[key]}
        onToggle={toggleIn(key)}
        onClear={() => set(key, [])}
        {...listProps[key]}
      />
    );
  }

  if (key === "startDate" || key === "endDate") {
    return <DateControl name={`jab-activity-${key}`} value={filters[key]} onChange={(v) => set(key, v)} />;
  }

  return null;
}

// Self-contained chip + popover for one filter field: owns its own open
// state and outside-click/Escape handling, so it can be dropped either
// into the mobile strip (variant="chip", shows its label as text) or
// directly inside a <th> next to a column header (variant="icon", just
// the funnel glyph + active dot to stay compact in the header row).
// `align` flips the popover to hang from the right edge of the button
// instead of the left, so headers near the right side of a wide/scrolling
// table don't push their popover off-screen.
export function ActivityFilterChip({ fieldKey, label, filters, set, options, variant = "chip", align = "left" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [floatStyle, setFloatStyle] = useState(null);
  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const fieldActive = isFieldActive(fieldKey, filters);
  const isFloating = variant === "icon"; // header-anchored chips float above the scrollable table

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setIsOpen(false);
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Header chips sit inside the table's horizontally-scrolling wrapper, so
  // an absolutely-positioned popover can get clipped by that wrapper's
  // overflow once a column filters is a few rows down. Fixing the popover
  // to the viewport (positioned from the button's own coordinates) keeps
  // it fully visible regardless of scroll position, without a portal.
  useEffect(() => {
    if (!isOpen || !isFloating || !btnRef.current) {
      setFloatStyle(null);
      return undefined;
    }
    const POPOVER_WIDTH = 220;
    const place = () => {
      const rect = btnRef.current.getBoundingClientRect();
      const left =
        align === "right"
          ? Math.max(8, rect.right - POPOVER_WIDTH)
          : Math.min(rect.left, window.innerWidth - POPOVER_WIDTH - 8);
      setFloatStyle({ position: "fixed", top: rect.bottom + 6, left, width: POPOVER_WIDTH });
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [isOpen, isFloating, align]);

  return (
    <span className="jab-activity-filters__chip-wrap" ref={wrapRef}>
      {isOpen && <div className="jab-activity-filters__backdrop" onClick={() => setIsOpen(false)} />}

      <Tooltip content={variant === "icon" && !isOpen ? `Filter by ${label}` : undefined}>
        <button
          ref={btnRef}
          type="button"
          className={`jab-activity-filters__chip jab-activity-filters__chip--${variant}${
            fieldActive ? " jab-activity-filters__chip--active" : ""
          }${isOpen ? " jab-activity-filters__chip--open" : ""}`}
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-label={variant === "icon" ? `Filter by ${label}` : undefined}
        >
          <Filter size={variant === "icon" ? 11 : 12} />
          {variant === "chip" && <span>{label}</span>}
          {fieldActive && <span className="jab-activity-filters__chip-dot" />}
        </button>
      </Tooltip>

      {isOpen && (
        <div
          className={`jab-activity-filters__popover${isFloating ? "" : ` jab-activity-filters__popover--${align}`}`}
          style={isFloating ? floatStyle || { visibility: "hidden" } : undefined}
          role="dialog"
          aria-label={`Filter by ${label}`}
        >
          <div className="jab-activity-filters__popover-header">
            <span>{label}</span>
            <button
              type="button"
              className="jab-activity-filters__popover-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
          <div className="jab-activity-filters__popover-body">
            {renderActivityFilterControl(fieldKey, filters, set, options)}
          </div>
        </div>
      )}
    </span>
  );
}

// The combined mobile filter panel: a "Filters" title, a close button, and
// every filterable field listed as its own collapsible section — tap a
// section's row to expand it and reveal its control (searchable checkbox
// list for seq/activity/performer/asset/status, date input for the dates).
// Sections open independently, same as a normal accordion.
function ActivityFiltersSheet({ filters, onChange, options, onClose }) {
  const [openKeys, setOpenKeys] = useState({});
  const set = (key, value) => onChange({ ...filters, [key]: value });
  const toggleSection = (key) => setOpenKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  const active = isActivityFilterActive(filters);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="jab-activity-filters__sheet-backdrop" onClick={onClose}>
      <div
        className="jab-activity-filters__sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Filters"
      >
        <div className="jab-activity-filters__sheet-header">
          <h3>Filters</h3>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className="jab-activity-filters__sheet-body">
          {ACTIVITY_FILTER_FIELDS.map(({ key, label }) => {
            const isOpen = !!openKeys[key];
            const fieldActive = isFieldActive(key, filters);
            return (
              <div key={key} className="jab-activity-filters__section">
                <button
                  type="button"
                  className="jab-activity-filters__section-header"
                  onClick={() => toggleSection(key)}
                  aria-expanded={isOpen}
                >
                  <span className="jab-activity-filters__section-title">
                    {label}
                    {fieldActive && <span className="jab-activity-filters__chip-dot" />}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`jab-activity-filters__chevron${isOpen ? " jab-activity-filters__chevron--open" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="jab-activity-filters__section-body">
                    {renderActivityFilterControl(key, filters, set, options)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="jab-activity-filters__sheet-footer">
          <button
            type="button"
            className="jab-activity-filters__clear"
            onClick={() => onChange(EMPTY_ACTIVITY_FILTERS)}
            disabled={!active}
          >
            <X size={12} />
            Clear filters
          </button>
          <button type="button" className="jab-activity-filters__done" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// Mobile-only filter entry point: shown below the panel header as a single
// "Filters" button that opens ActivityFiltersSheet above — this is the
// layout's sole filter control on narrow screens, since the table (and its
// own header-anchored ActivityFilterChip instances) swaps out for cards
// there. On wider screens this whole button is hidden by CSS in favor of
// those icon-only chips anchored directly in the table headers.
export default function ActivityFilterBar({
  filters,
  onChange,
  options,
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const active = isActivityFilterActive(filters);

  return (
    <div className="jab-activity-filters">
      <button
        type="button"
        className={`jab-activity-filters__trigger${active ? " jab-activity-filters__trigger--active" : ""}`}
        onClick={() => setSheetOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={sheetOpen}
      >
        <Filter size={14} />
        <span>Filters</span>
        {active && <span className="jab-activity-filters__chip-dot" />}
      </button>

      {active && (
        <button type="button" className="jab-activity-filters__clear" onClick={() => onChange(EMPTY_ACTIVITY_FILTERS)}>
          <X size={12} />
          Clear filters
        </button>
      )}

      {sheetOpen && (
        <ActivityFiltersSheet
          filters={filters}
          onChange={onChange}
          options={options}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </div>
  );
}