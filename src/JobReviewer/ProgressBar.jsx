import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

/**
 * A component that displays a progress bar for a given list of activities.
 * The progress is calculated as the percentage of activities that have a status of "Completed"
 *
 * @param {Array} activityList - The list of activities to show progress for
 * @returns {JSX.Element} A JSX element representing a progress bar
 */
export default function ActivityProgress({ activityList }) {
  /**
   * Calculates the progress as the percentage of activities that have a status of "Completed"
   * @returns {number} The progress value from 0 to 100
   */
  const progress = () => {
    return Math.ceil(
      (activityList.filter((activity) => activity.actvityStatus === "Completed")
        .length *
        100) /
        activityList.length,
    )
      ? Math.ceil(
          (activityList.filter(
            (activity) => activity.actvityStatus === "Completed",
          ).length *
            100) /
            activityList.length,
        )
      : 0;
  };

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={progress()}
        sx={{ color: "primary.main" }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ color: "text.secondary" }}
        >
          {`${progress()}%`}
        </Typography>
      </Box>
    </Box>
  );
}
