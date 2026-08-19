// File: TimelineChart.js
import { Panel } from "primereact/panel"; // Importing the Panel component from PrimeReact for UI structure
import React, { useRef } from "react"; // Importing React and useRef hook
import { Chart } from "react-google-charts"; // Importing Chart component for rendering Google Charts

// Function to transform raw data into the format suitable for the Google Timeline chart
const transformData = (data) => {
  // Initializing the chart data with column headers
  const chartData = [
    [
      { type: "string", id: "Job" }, // Job ID column
      { type: "string", id: "Activity" }, // Activity name column
      { type: "date", id: "Start" }, // Start date column
      { type: "date", id: "End" }, // End date column
    ],
  ];

  // Iterating through each job in the provided data
  data.forEach((job) => {
    // Iterating through each activity associated with the job
    job.actvityList.forEach((activity) => {
      const startTime = new Date(activity.actualActivityStartTime); // Parsing the start time
      const endTime = new Date(activity.actualActivityEndTime); // Parsing the end time

      // Check if both startTime and endTime are in the year 2000 or later
      if (startTime.getFullYear() >= 2000 && endTime.getFullYear() >= 2000) {
        // Adding the job ID, activity name, and start/end times to the chart data
        chartData.push([job.jobId, activity.activityName, startTime, endTime]);
      }
    });
  });

  return chartData; // Returning the transformed chart data
};

// TimelineChart component that renders the timeline chart
const TimelineChart = ({ key, jsonData, header, groupBy }) => {
  const ref = useRef(null); // Reference for the chart component
  const data = transformData(jsonData); // Transforming the raw JSON data

  // Options for customizing the timeline chart
  const options = {
    timeline: {
      showRowLabels: true, // Display row labels
      colorByRowData: true, // Color rows by their data
      ShowChartTwoTone: true, // Setting for chart display (may need to verify)
      showBarLabels: true, // Show labels on bars
    },
    hAxis: {
      format: "MMM dd, yyyy HH:mm:ss", // Formatting for horizontal axis dates
    },
    //avoidOverlappingGridLines: false, // (Commented out) Optional setting to avoid grid line overlap
  };

  return (
    <div>
      {/* Panel component to encapsulate the chart with a header */}
      <Panel header={header} toggleable>
        {/* Chart component rendering the Timeline chart */}
        <Chart
          chartType="Timeline" // Specifying the chart type as Timeline
          data={data} // Data to be displayed in the chart
          options={options} // Chart customization options
          // width="100%" // Uncomment to set width to 100%
          // height="500px" // Uncomment to set height to 500px
          legendToggle // Enables toggling the legend
          aria-label="Project Timeline Chart" // Accessibility label for the chart
        />
      </Panel>
    </div>
  );
};

export default TimelineChart; // Exporting the component for use in other parts of the application
