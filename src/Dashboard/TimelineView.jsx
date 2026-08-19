import React from "react";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import moment from "moment";
import { Panel } from "primereact/panel";
import { Container } from "@mui/material";

// Sample data
// const jsonData = [
//   {
//     jobId: "J20240813T125325263",
//     jobName: "I am Testing",
//     task: {
//       actvityList: [
//         {
//           activityId: "A20240807T161937992",
//           activityName: "Act1",
//           scheduleActivityStartTime: "2024-08-13T05:01:18.000+00:00",
//           scheduleActivityEndTime: "2024-08-13T10:22:20.000+00:00",
//           actualActivityStartTime: "2024-08-13T07:30:19.000+00:00",
//           actualActivityEndTime: "2024-08-13T10:02:14.000+00:00",
//         },
//         {
//           activityId: "A20240807T162006338",
//           activityName: "Act2",
//           scheduleActivityStartTime: "2024-08-13T08:01:18.000+00:00",
//           scheduleActivityEndTime: "2024-08-13T12:22:20.000+00:00",
//           actualActivityStartTime: "2024-08-13T10:02:18.000+00:00",
//           actualActivityEndTime: "2024-08-13T10:20:20.000+00:00",
//         },
//         {
//           activityId: "A20240807T162006339",
//           activityName: "Act3",
//           scheduleActivityStartTime: "2024-08-13T08:01:18.000+00:00",
//           scheduleActivityEndTime: "2024-08-13T20:22:20.000+00:00",
//           actualActivityStartTime: "2024-08-13T07:30:19.000+00:00",
//           actualActivityEndTime: "2024-08-13T10:02:14.000+00:00",
//         },
//       ],
//     },
//   },
//   {
//     jobId: "J20240813T125325244",
//     jobName: "I am Testing 1",
//     task: {
//       actvityList: [
//         {
//           activityId: "A20240807T161937992",
//           activityName: "Act1",
//           scheduleActivityStartTime: "2024-08-13T05:01:18.000+00:00",
//           scheduleActivityEndTime: "2024-08-13T10:22:20.000+00:00",
//           actualActivityStartTime: "2024-08-13T07:30:19.000+00:00",
//           actualActivityEndTime: "2024-08-13T10:02:14.000+00:00",
//         },
//         {
//           activityId: "A20240807T162006338",
//           activityName: "Act2",
//           scheduleActivityStartTime: "2024-08-13T08:01:18.000+00:00",
//           scheduleActivityEndTime: "2024-08-13T12:22:20.000+00:00",
//           actualActivityStartTime: "2024-08-13T10:02:18.000+00:00",
//           actualActivityEndTime: "2024-08-13T10:20:20.000+00:00",
//         },
//         {
//           activityId: "A20240807T162006339",
//           activityName: "Act3",
//           scheduleActivityStartTime: "2024-08-13T08:01:18.000+00:00",
//           scheduleActivityEndTime: "2024-08-13T20:22:20.000+00:00",
//           actualActivityStartTime: "2024-08-13T07:30:19.000+00:00",
//           actualActivityEndTime: "2024-08-13T10:02:14.000+00:00",
//         },
//       ],
//     },
//   },
// ];

const TimelineView = ({ jsonData }) => {
  return (
    <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
      {jsonData.map((job) => {
        // Create groups and items per job
        const groups = [];
        const items = [];
        let groupId = 1;

        job.task.actvityList.forEach((activity) => {
          const actualStart = moment(activity.actualActivityStartTime);
          const actualEnd = moment(activity.actualActivityEndTime);
          const actualDuration = moment
            .duration(actualEnd.diff(actualStart))
            .humanize();

          const scheduledStart = moment(activity.scheduleActivityStartTime);
          const scheduledEnd = moment(activity.scheduleActivityEndTime);
          const scheduledDuration = moment
            .duration(scheduledEnd.diff(scheduledStart))
            .humanize();

          // Create a new group for each activity
          groups.push({
            id: groupId,
            title: `${activity.activityName}`,
          });

          // Add the scheduled time item
          items.push({
            id: `scheduled-${activity.activityId}`,
            group: groupId,
            title: `${activity.activityName} (Scheduled: ${scheduledDuration})`,
            start_time: scheduledStart.toDate(),
            end_time: scheduledEnd.toDate(),
            itemProps: {
              style: {
                background: "lightblue",
                borderColor: "blue",
              },
            },
          });

          // Add the actual time item
          items.push({
            id: activity.activityId,
            group: groupId,
            title: `${activity.activityName} (Actual: ${actualDuration})`,
            start_time: actualStart.toDate(),
            end_time: actualEnd.toDate(),
            itemProps: {
              style: {
                background: "lightgreen",
                borderColor: "green",
              },
            },
          });

          groupId += 1; // Increment groupId for the next activity
        });

        return (
          <Panel header={job.jobName} toggleable key={job.jobId}>
            <Timeline
              groups={groups}
              items={items}
              defaultTimeStart={moment().startOf("day").toDate()}
              defaultTimeEnd={moment().endOf("day").toDate()}
              canMove
              canResize
              itemHeightRatio={0.75} // Adjust height ratio for visual clarity
              sidebarWidth={150}
              lineHeight={50}
              stackItems={false} // Disable stacking to force separate lines
              itemRenderer={({
                item,
                itemContext,
                getItemProps,
                getResizeProps,
              }) => {
                return (
                  <div
                    {...getItemProps({
                      style: {
                        background: itemContext.selected
                          ? "yellow"
                          : item.itemProps.style.background,
                        color: "black",
                        borderRadius: 4,
                        border: `1px solid ${item.itemProps.style.borderColor}`,
                        boxShadow: "0 2px 3px rgba(0,0,0,0.2)",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        height: "100%", // Ensure full height usage for visual clarity
                      },
                    })}
                  >
                    <div style={{ padding: "4px 8px" }}>
                      {itemContext.title}
                    </div>
                  </div>
                );
              }}
            />
          </Panel>
        );
      })}
    </Container>
  );
};

export default TimelineView;
