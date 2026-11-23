import React, { useEffect, useRef, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import "./Toolbar.css";

const STATUS_FILTERS = ["All", "Running", "Pending", "Completed", "Rejected", "Aborted"];

// Presets for the "Filters" popover, keyed against JobDetails.scheduledJobStartTime.
export const MONTH_FILTER_PRESETS = [
  { key: "today", label: "Today" },
  { key: "current", label: "Current month" },
  { key: "last", label: "Last month" },
  { key: "upcoming", label: "Upcoming month" },
  { key: "custom", label: "Custom" },
];

export const EMPTY_MONTH_FILTER = { preset: "all", from: "", to: "" };

// Defensive: works for undefined, null, or a well-formed filter object,
// so a parent that hasn't been updated to pass monthFilter yet can't
// crash this (or anything that imports this helper).
export function isMonthFilterActive(monthFilter) {
  if (!monthFilter || !monthFilter.preset || monthFilter.preset === "all") return false;
  // A custom range with neither date filled in isn't restricting anything yet.
  if (monthFilter.preset === "custom") return !!(monthFilter.from || monthFilter.to);
  return true;
}

export default function Toolbar({
  query,
  onQueryChange,
  statusFilter,
  onStatusFilterChange,
  monthFilter,
  onMonthFilterChange,
}) {
  // Normalized once, up front, so every reference below — state reads,
  // handlers, JSX — is guaranteed a real object even if the parent passes
  // undefined/null/omits the prop entirely (e.g. not updated yet).
  const safeMonthFilter = monthFilter && typeof monthFilter === "object" ? monthFilter : EMPTY_MONTH_FILTER;
  console.log("Safe month filter::",safeMonthFilter)
  const safeOnMonthFilterChange =
    typeof onMonthFilterChange === "function"
      ? onMonthFilterChange
      : () => {
          // Loud on purpose: silently no-op-ing here is exactly what makes a
          // disconnected parent look like "the filter doesn't work" with zero
          // error and zero visual feedback. If you see this, whatever renders
          // <Toolbar> isn't passing onMonthFilterChange (and probably not
          // monthFilter either) — wire both through from the parent's state.
          console.warn(
            "[Toolbar] onMonthFilterChange prop is missing or not a function — " +
              "month filter clicks are being silently ignored.",
          );
        };

  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef(null);
  const active = isMonthFilterActive(safeMonthFilter);

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

  const selectPreset = (key) => safeOnMonthFilterChange({ ...safeMonthFilter, preset: key });
  const setCustomDate = (field, value) => safeOnMonthFilterChange({ ...safeMonthFilter, preset: "custom", [field]: value });
  const clearMonthFilter = () => safeOnMonthFilterChange(EMPTY_MONTH_FILTER);

  return (
    <div className="jab-toolbar">
      <div className="jab-toolbar__search">
        <Search size={14} className="jab-toolbar__search-icon" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by job, ID or instrument"
          className="jab-toolbar__input"
        />
      </div>

      <div className="jab-toolbar__filters">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => onStatusFilterChange(s)}
            className={`jab-toolbar__filter ${statusFilter === s ? "jab-toolbar__filter--active" : ""}`}
          >
            {s}
          </button>
        ))}
      </div>

      <span className="jab-toolbar__more-wrap" ref={wrapRef}>
        <button
          type="button"
          className={`jab-toolbar__more${active ? " jab-toolbar__more--active" : ""}`}
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
        >
          <SlidersHorizontal size={13} />
          Filters
          {active && <span className="jab-toolbar__more-dot" />}
        </button>

        {isOpen && (
          <div className="jab-toolbar__popover" role="dialog" aria-label="Filter by scheduled date">
            <div className="jab-toolbar__popover-header">
              <span>Scheduled date</span>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Close">
                <X size={14} />
              </button>
            </div>

            <div className="jab-toolbar__popover-body">
              <label className="jab-toolbar__radio-row">
                <input
                  type="radio"
                  name="jab-month-filter"
                  className="jab-toolbar__radio-input"
                  checked={safeMonthFilter.preset === "all"}
                  onChange={() => selectPreset("all")}
                />
                <span
                  className={`jab-toolbar__radio-dot${
                    safeMonthFilter.preset === "all" ? " jab-toolbar__radio-dot--checked" : ""
                  }`}
                  aria-hidden="true"
                />
                <span>All</span>
              </label>

              {MONTH_FILTER_PRESETS.map(({ key, label }) => (
                <label key={key} className="jab-toolbar__radio-row">
                  <input
                    type="radio"
                    name="jab-month-filter"
                    className="jab-toolbar__radio-input"
                    checked={safeMonthFilter.preset === key}
                    onChange={() => selectPreset(key)}
                  />
                  <span
                    className={`jab-toolbar__radio-dot${
                      safeMonthFilter.preset === key ? " jab-toolbar__radio-dot--checked" : ""
                    }`}
                    aria-hidden="true"
                  />
                  <span>{label}</span>
                </label>
              ))}

              {safeMonthFilter.preset === "custom" && (
                <div className="jab-toolbar__custom-range">
                  <label>
                    From
                    <input
                      type="date"
                      value={safeMonthFilter.from || ""}
                      max={safeMonthFilter.to || undefined}
                      onChange={(e) => setCustomDate("from", e.target.value)}
                    />
                  </label>
                  <label>
                    To
                    <input
                      type="date"
                      value={safeMonthFilter.to || ""}
                      min={safeMonthFilter.from || undefined}
                      onChange={(e) => setCustomDate("to", e.target.value)}
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="jab-toolbar__popover-footer">
              <button
                type="button"
                className="jab-toolbar__clear"
                onClick={clearMonthFilter}
                disabled={!active && safeMonthFilter.preset === "all"}
              >
                <X size={12} />
                Clear
              </button>
            </div>
          </div>
        )}
      </span>
    </div>
  );
}