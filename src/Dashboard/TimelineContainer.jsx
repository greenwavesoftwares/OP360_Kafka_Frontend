import React from "react";
import TimelineChart from "./TimelineChart";

const TimelineContainer = ({ manufacturingData, groupBy }) => {
  // Log the current grouping type for debugging
  // console.log("Group By timeline : ", groupBy);

  // // Log the manufacturing data received
  // console.log("Manufacturing Data : ", manufacturingData);

  return (
    <div>
      {/* Check if the grouping is by Task or Tag */}
      {(groupBy === "Task" || groupBy === "Tag") &&
        Object.entries(manufacturingData).map(([header, data], index) => (
          <TimelineChart
            key={index} // Use index as a key for each TimelineChart
            jsonData={data} // Pass the data for the chart
            header={header} // Pass the header for display
            groupBy={groupBy} // Pass the groupBy prop for context
          />
        ))}

      {/* Check if the grouping is by Asset or User */}
      {(groupBy === "Asset" || groupBy === "User") &&
        Object.entries(manufacturingData).map(([header, data], index) => (
          <TimelineChart
            key={index} // Use index as a key for each TimelineChart
            jsonData={data} // Pass the data for the chart
            header={header} // Pass the header for display
            groupBy={groupBy} // Pass the groupBy prop for context
          />
        ))}
    </div>
  );
};

export default TimelineContainer;
