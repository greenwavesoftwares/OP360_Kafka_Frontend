import React from "react";
import "./Grid.css"; // Import the grid CSS file
// import React from 'react';
import { Grid, Paper, Box } from "@mui/material";

const obj = [
  {
    formId: 0,
    cellInfo: [
      {
        rowNum: 0,
        colNum: 0,
        cellId: "_1_1",
        aliasId: "AS Details",
        rowSpan: 1,
        colsSpan: 2,
      },
    ],
  },
  {
    formId: 0,
    cellInfo: [
      {
        rowNum: 0,
        colNum: 0,
        cellId: "_2_1",
        aliasId: "name",
        rowSpan: 1,
        colsSpan: 1,
      },
      {
        rowNum: 0,
        colNum: 1,
        cellId: "_2_2",
        aliasId: "Ashok",
        rowSpan: 1,
        colsSpan: 1,
      },
    ],
  },
  {
    formId: 0,
    cellInfo: [
      {
        rowNum: 0,
        colNum: 0,
        cellId: "_3_1",
        aliasId: "age",
        rowSpan: 1,
        colsSpan: 1,
      },
      {
        rowNum: 0,
        colNum: 1,
        cellId: "_3_2",
        aliasId: "100",
        rowSpan: 1,
        colsSpan: 1,
      },
    ],
  },
  {
    formId: 0,
    cellInfo: [
      {
        rowNum: 0,
        colNum: 0,
        cellId: "_4_1",
        aliasId: "add",
        rowSpan: 1,
        colsSpan: 1,
      },
      {
        rowNum: 0,
        colNum: 1,
        cellId: "_4_2",
        aliasId: "kol",
        rowSpan: 1,
        colsSpan: 1,
      },
    ],
  },
];

const FormGrid = ({ data }) => {
  // Calculate the maximum colspan (this will represent 100% width)
  const maxColSpan = Math.max(
    ...data.flatMap((item) => item.cellInfo.map((cell) => cell.colsSpan))
  );

  return (
    <Box sx={{ width: "100%", padding: "2px" }}>
      <Grid container spacing={1}>
        {data.map((form, formIndex) =>
          form.cellInfo.map((cell, cellIndex) => (
            <Grid
              item
              key={`${formIndex}-${cellIndex}`}
              xs={12 * (cell.colsSpan / maxColSpan)} // Dynamic width based on colsSpan
              sx={{
                gridRow: `span ${cell.rowSpan}`, // Handle rowspan
                padding: "1px",
              }}
            >
              <Paper
                elevation={3}
                sx={{ padding: "20px", textAlign: "center" }}
              >
                {/* Display aliasId or cellId */}
                {cell.aliasId || cell.cellId}
              </Paper>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default function GridTest() {
  return <FormGrid data={obj} />;
}
