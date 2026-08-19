import { Avatar, Badge, Tooltip } from "@mui/material";
import React from "react";
import { getInitials } from "./helper";
import CancelIcon from "@mui/icons-material/Cancel";
// Import CheckCircleIcon component from Material-UI icons
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

/**
 * UserValueTemplate is a component that displays the value of an option in a dropdown,
 * along with the status of the user (if available). If the option is not selected,
 * it displays a default value.
 *
 * @property {object} option - The option to display, which should have a 'userID' and a 'userName' property.
 * @property {string} defaultValue - The default value to display if no option is selected.
 * @property {boolean} statusVisible - Whether to display the status of the user.
 */
function UserValueTemplate({option,defaultValue,statusVisible}) {
  return (
    <div>
      {
        option ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              columnGap: ".5rem",
            }}
          >
            {/* Check if a performer with the given userID has a 'status' */}

            {/* Display user details */}
            <Tooltip
              title={
                <div className="flex align-items-center">
                  {/* <span style={{ fontWeight: "bold" }}>
                                    {option.userName}
                                  </span> */}
                  {
                    // !isMobile &&
                    <span
                    // style={{ marginLeft: "5px" }}
                    >
                      {"( " + option.userID + " )"}
                    </span>
                  }
                </div>
              }
            >
              <Badge
  overlap="circular"
  anchorOrigin={{ vertical: "top", horizontal: "left" }}
  badgeContent={
    statusVisible && (
      option.status ? (
        <CheckCircleIcon
          fontSize="small"
          sx={{
            color: "#10aa1d",
            paddingRight: "5px",
          }}
        />
      ) : (
        <CancelIcon
          fontSize="small"
          sx={{ color: "red", paddingRight: "5px" }}
        />
      )
    )
  }
>
  <Avatar
    sx={{
      bgcolor: "#3A6D8C",
      width: 24,
      height: 24,
      fontSize: ".7rem",
    }}
  >
    {getInitials(option.userName)}
  </Avatar>
</Badge>

            </Tooltip>
            {option.userName}
          </div>
        ) : (
          <span>Select {defaultValue}</span> // Display when no option is selected
        )
      }
    </div>
  );
}

export default UserValueTemplate;
