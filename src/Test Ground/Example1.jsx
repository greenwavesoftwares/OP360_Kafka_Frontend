import React from "react";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";

const ReactCalendarTimeline = ({ items, groups }) => {
  return (
    <div>
      {/* <div className="timeline-controls">
        <button onClick={() => timelineRef.current.zoomIn()}>Zoom In</button>
        <button onClick={() => timelineRef.current.zoomOut()}>Zoom Out</button>
        <button onClick={() => timelineRef.current.move(-0.3)}>
          Move Left
        </button>
        <button onClick={() => timelineRef.current.move(0.3)}>
          Move Right
        </button>
      </div> */}
      <Timeline
        groups={groups}
        items={items}
        defaultTimeStart={new Date()}
        defaultTimeEnd={new Date(Date.now() + 24 * 60 * 60 * 1000)}
        canMove={true}
        canResize={true}
        itemHeight={50}
        sidebarWidth={150}
      />
    </div>
  );
};

// Example usage
const Example1 = () => {
  const items = [
    {
      id: 1,
      group: 1,
      title: "Item 1",
      start_time: new Date("2024-08-13T07:30:19.000Z"),
      end_time: new Date("2024-08-13T10:00:00.000Z"),
    },
    {
      id: 2,
      group: 1,
      title: "Item 2",
      start_time: new Date("2024-08-13T10:00:00.000Z"),
      end_time: new Date("2024-08-13T12:00:00.000Z"),
    },
  ];

  const groups = [{ id: 1, title: "Group 1" }];

  return <ReactCalendarTimeline items={items} groups={groups} />;
};

export default Example1;
