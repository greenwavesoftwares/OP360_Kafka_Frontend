import React from "react";
import GanttChart from "react-gantt-chart";

const ReactGantt = () => {
  const formatDateTime = (date) => {
    return date.toLocaleString();
  };

  const initialTasks = [
    {
      start: new Date(2020, 1, 1, 14, 0, 0),
      end: new Date(2020, 1, 1, 18, 0, 0),
      name: "Idea",
      id: "Task 0",
      type: "project",
      progress: 60,
      hideChildren: false,
      displayOrder: 1,
      styles: { progressColor: "#71d97b", progressSelectedColor: "#ff9e0d" },
    },
    {
      start: new Date(2020, 1, 1, 14, 0, 0),
      end: new Date(2020, 1, 1, 15, 0, 0),
      name: "FRS (Plan)",
      id: "Task 0_1",
      project: "Task 0",
      dependencies: ["Task 0"],
      type: "project",
      progress: 66,
      hideChildren: false,
      displayOrder: 2,
      styles: { progressColor: "#71d97b", progressSelectedColor: "#ff9e0d" },
    },
    {
      start: new Date(2020, 1, 1, 14, 30, 0),
      end: new Date(2020, 1, 1, 15, 30, 0),
      name: "FRS (Actual)",
      id: "Task 0_3",
      project: "Task 0_1",
      dependencies: ["Task 0"],
      type: "task",
      progress: 100,
      displayOrder: 3,
      styles: { progressColor: "#ffbb54", progressSelectedColor: "#ff9e0d" },
    },
    {
      start: new Date(2020, 1, 1, 15, 0, 1),
      end: new Date(2020, 1, 1, 18, 0, 0),
      name: "Development",
      id: "Task 0_2",
      project: "Task 0",
      dependencies: ["Task 0_3"],
      type: "task",
      progress: 0,
      isDisabled: true,
      displayOrder: 4,
      styles: { progressColor: "#ffbb54", progressSelectedColor: "#ff9e0d" },
    },
  ];

  return (
    <>
      <div className="Test">
        <h1>Gantt Chart Example</h1>
        <GanttChart tasks={initialTasks} />
      </div>
    </>
  );
};

export default ReactGantt;
