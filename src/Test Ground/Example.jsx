import React, { useEffect, useRef, useState } from "react";
import { DataSet, Timeline } from "vis-timeline/standalone";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";
import "./styel.css";
const VisTimelineComponent = ({ items, groups, options }) => {
  const timelineRef = useRef(null);
  const [timeline, setTimeline] = useState(null);

  useEffect(() => {
    const container = timelineRef.current;
    const data = {
      items: new DataSet(items),
      groups: new DataSet(groups),
    };

    const newTimeline = new Timeline(container, data, options);
    setTimeline(newTimeline);

    // Cleanup on unmount
    return () => newTimeline.destroy();
  }, [items, groups, options]);

  const zoomIn = () => {
    if (timeline) {
      timeline.zoomIn();
    }
  };

  const zoomOut = () => {
    if (timeline) {
      timeline.zoomOut();
    }
  };

  const moveLeft = () => {
    if (timeline) {
      timeline.move(-0.3);
    }
  };

  const moveRight = () => {
    if (timeline) {
      timeline.move(0.3);
    }
  };

  return (
    <div>
      {/* <div className="timeline-controls">
        <button onClick={moveLeft}>Move Left</button>
        <button onClick={moveRight}>Move Right</button>
        <button onClick={zoomIn}>Zoom In</button>
        <button onClick={zoomOut}>Zoom Out</button>
      </div> */}
      <div
        ref={timelineRef}
        style={{
          height: "250px",
          border: "1px solid #5D99C3",
          borderRadius: "5px",
        }}
      ></div>
    </div>
  );
};

// Example usage
const Example = () => {
  const items = [
    { id: 1, content: "Item 1", start: "2024-08-13T07:30:19.000Z" },
    {
      id: 2,
      content: "Item 2",
      start: "2024-08-13T10:00:00.000Z",
      end: "2024-08-13T12:00:00.000Z",
    },
  ];

  const groups = [{ id: 1, content: "Group 1" }];

  const options = {
    zoomable: true,
    movable: true,
    stack: false,
    showCurrentTime: true,
    // Add custom styles or options here
  };

  return (
    <VisTimelineComponent items={items} groups={groups} options={options} />
  );
};

export default Example;
