import React, { useEffect, useMemo, useState } from "react";
import { ChevronsUpDown, Play, CalendarClock, Check } from "lucide-react";
import Toolbar, { EMPTY_MONTH_FILTER } from "./Toolbar";
import JobsGrid from "./JobsGrid";
import ActivitiesPanel from "./ActivitiesPanel";
import DetailPanel from "./DetailPanel";
import Avatar from "./Avatar";
import { MOCK_JOBS, MOCK_ACTIVITIES, CURRENT_PERFORMER } from "./mockData";
import { getCustomRange, getMonthRange, getTodayRange, isDateWithinRange } from "./formatters";
import "./tokens.css";
import "./JobActivityBoard.css";
import { getJobsByPerformer } from "./JobActivityHelperV2";
import dayjs from "dayjs";
import { getTenantID } from "../UserModuleUpdated/UsermoduleApi";
import { fetchCurrentUser } from "../JobPerformer/JobHelper";

// Top-level page.
//
// Behavior: on load, only job metadata (JobsGrid, cards) is visible.
// Clicking a card selects it and swaps the grid out entirely for
// ActivitiesPanel — the jobs grid is hidden while a job is selected
// so only its activities table is on screen. "Back to jobs" (inside
// ActivitiesPanel) or the toolbar clears the selection and brings
// the grid back. The "info" icon on any card/row opens the full-field
// DetailPanel independently of that selection.
export default function JobActivityBoard() {
  const [jobs, setJobs] = useState(null);
  const [activityOverrides, setActivityOverrides] = useState({}); // activityId -> activityStatus
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState(EMPTY_MONTH_FILTER);
  const [detail, setDetail] = useState(null); // { kind: 'job' | 'activity', item }
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState(null)

  const jobsWithActivities = useMemo(() => {
    return jobs?.map((job) => ({
      ...job,
      activities: MOCK_ACTIVITIES.filter((a) => a.jobID === job.jobID).map((a) =>
        activityOverrides[a.activityId]
          ? { ...a, activityStatus: activityOverrides[a.activityId] }
          : a,
      ),
    }));
  }, [jobs, activityOverrides]);

  // Bounds for the active date preset, recomputed only when the preset changes rather than once per job per render.
  const monthRange = useMemo(() => {
    switch (monthFilter.preset) {
      case "today":
        return getTodayRange();
      case "current":
        return getMonthRange(0);
      case "last":
        return getMonthRange(-1);
      case "upcoming":
        return getMonthRange(1);
      case "custom":
        // No dates entered yet = no restriction.
        return monthFilter.from || monthFilter.to ? getCustomRange(monthFilter.from, monthFilter.to) : null;
      default:
        return null;
    }
  }, [monthFilter]);

  const filteredJobs = useMemo(() => {
    return jobsWithActivities?.filter((j) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        [j.jobName, j.jobID, j.instrument].some((v) => (v || "").toLowerCase().includes(q));
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Pending" && j.jobStatus === "Not Started") ||
        (statusFilter === "Running" && j.jobStatus === "Started") ||
        j.jobStatus === statusFilter;
      const matchesMonth =
        !monthRange || isDateWithinRange(j.scheduledJobStartTime, monthRange.start, monthRange.end);
      return matchesQuery && matchesStatus && matchesMonth;
    });
  }, [jobsWithActivities, query, statusFilter, monthRange]);

  const selectedJob = useMemo(() => {
    if (selectedJobId) {
      return jobsWithActivities.find((job) => job.jobID === selectedJobId) ?? null;
    }
  }, [jobsWithActivities, selectedJobId]);

  const handleAdvanceActivity = (job, activity, nextStatus) => {
    setActivityOverrides((prev) => ({ ...prev, [activity.activityId]: nextStatus }));
  };
  const mapJob = (j) => {
    const mappedJob={
  ...j,
  jobID: j.jobID,
  jobName: j.jobName,
  assigner: j.assigner,
  approver: j.approver,
  groupId: j.groupId,
  priority: j.priority,
  weekdays: j.weekdays,
  jobStatus: j.jobStatus,
  scheduledJobStartTime: j.scheduledJobStartTime,
  scheduledJobEndTime: j.scheduledJobEndTime,
  actualJobStartTime: j.actualJobStartTime,
  actualJobEndTime: j.actualJobEndTime,
}
    console.log("Job::",j)
    console.log("Mapped Job::",mappedJob)
    return mappedJob};

  useEffect(() => {
  let cancelled = false; // ignore stale responses if the filter changes mid-request

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      // No preset selected = no restriction, so use a wide window
      const start = monthRange ? dayjs(monthRange.start).format("YYYY-MM-DD HH:MM") : dayjs().subtract(12, "month");
      const end = monthRange ? dayjs(monthRange.end).format("YYYY-MM-DD HH:MM") : dayjs().add(12, "month");
      const userId=fetchCurrentUser()
      const tenantId=getTenantID()
      const filterObj={
        userId: userId,
        tenantId: tenantId,
        groups: [],            // fill in if you have the user's groups
        startRange:start,
        endRange:end,
      }
      console.log("On month range change start::",start)
      console.log("On month range change end::",end)
      console.log("Object to fetch data::",filterObj)

      const data = await getJobsByPerformer(filterObj);
      console.log("Data::",data)
      if (!cancelled) setJobs((data || []).map(mapJob));
    } catch (e) {
      if (!cancelled) {
        setJobs([]);
        setError(e.message);
      }
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  load();
  return () => { cancelled = true; };
}, [monthRange]);
  
  return (
    <div className="jab-scope jab-board">
      <div className="jab-board__inner">
        

        {!selectedJob && (
          <>
            <Toolbar
              query={query}
              onQueryChange={setQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              monthFilter={monthFilter}
              onMonthFilterChange={setMonthFilter}
            />

            <JobsGrid
              jobs={filteredJobs}
              selectedJobId={selectedJobId}
              onSelectJob={(job) => setSelectedJobId(job.jobID)}
              onShowDetail={(job) => setDetail({ kind: "job", item: job })}
            />
          </>
        )}

        <ActivitiesPanel
          job={selectedJob}
          onAdvanceActivity={handleAdvanceActivity}
          onShowDetail={(activity) =>
            setDetail({ kind: "activity", item: activity })
          }
          onBack={() => setSelectedJobId(null)}
          currentPerformer={CURRENT_PERFORMER}
        />
      </div>

      {detail && (
        <DetailPanel
          item={detail.item}
          kind={detail.kind}
          onClose={() => setDetail(null)}
        />
      )}
    </div>
  );
}