import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Box, Typography } from "@mui/material";

const chartSetting = {
  width: 250,
  height: 180,
};

const valueFormatter = (value) => `${value} Jobs`;

/**
 * A horizontal bar chart to display job data.
 * @param {{dataset: any[]}} props The dataset for the chart, should be an array of objects with date and value
 * @returns {JSX.Element} The horizontal bar chart
 */
export default function HorizontalGraph({ dataset }) {
  return (
    <>
      {dataset && (
        <Box
          // Full width and height with a max height of 125px
          sx={{
            width: "100%",
            height: 125,
            display: "flex",
            alignItems: "center",
          }}
        >
          <BarChart
            // The dataset
            dataset={dataset}
            // The y-axis is the date, and the x-axis is the value
            yAxis={[{ scaleType: "band", dataKey: "date" }]}
            series={[{ dataKey: "value", valueFormatter }]}
            // The chart is horizontal
            layout="horizontal"
            // The chart should be 100% of the width
            {...chartSetting}
            sx={{ width: "100%" }}
          />
        </Box>
      )}

      {!dataset && (
        <Box
          // Center the text
          sx={{
            height: 125,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography>No Job in the past 7 days</Typography>
        </Box>
      )}
    </>
  );
}

