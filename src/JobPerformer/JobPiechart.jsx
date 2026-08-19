import * as React from "react";
import Box from "@mui/material/Box";
import { PieChart } from "@mui/x-charts/PieChart";
import { Typography, colors } from "@mui/material";

export default function JobPieChart({ dataset, label, nullvalue }) {
  const [itemData, setItemData] = React.useState();

  // Use dataset directly as the combinedData
  const combinedData = dataset;

  // Configure the series for the DoughnutChart
  const series = [
    {
      innerRadius: 20, // Set the innerRadius to create a doughnut chart
      outerRadius: 40,
      id: "series-1",
      data: combinedData,
    },
  ];

  return (
    <Box>
      {/* Checks whether all dataset values are null or undefined, and if so, returns a default value */}
      {dataset?.every((obj) => obj.value === 0) && (
        <Box
          sx={{
            height: 122,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography>{nullvalue}</Typography>
        </Box>
      )}
      {/* If not all values are null or undefined, render the PieChart */}
      {dataset?.length > 0 && !dataset.every((obj) => obj.value === 0) && (
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <PieChart
            series={series}
            width={200} // Adjust width and height as per your requirement
            height={100}
            margin={{ bottom: 10, left: 10, right: 10, top: 10 }}
            slotProps={{
              legend: { hidden: true },
            }}
            onItemClick={(event, d) => setItemData(d)}
          />
          <Typography align="center">{label}</Typography>
        </Box>
      )}
    </Box>
  );
}
