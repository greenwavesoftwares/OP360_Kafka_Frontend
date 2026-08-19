import React, { useState } from "react";
import "./SwitchButton.css";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";

const SwitchButton = ({
  isPublicAccess = false,
  setIsPublicAccess,
  offLabel = "OFF", // Default label for the day
  onLabel = "ON", // Default label for the night
  OffIcon = GroupIcon,
  OnIcon = PersonIcon,
}) => {
  console.log("My public Access : ", isPublicAccess);
  const [isDay, setIsDay] = useState(isPublicAccess);

  const toggleSwitch = () => {
    console.log("My toggle : ", !isDay);
    setIsPublicAccess(!isDay);
    setIsDay(!isDay);
  };

  return (
    <div
      className={`switch-container ${isDay ? "night" : "day"}`}
      onClick={toggleSwitch}
    >
      <div className="switch-ball">
        {isDay ? (
          <>
            <OnIcon></OnIcon>
          </>
        ) : (
          <>
            <OffIcon></OffIcon>
          </>
        )}
      </div>
      <span className={`switch-label ${isDay ? "label-day" : "label-night"}`}>
        {isDay ? onLabel : offLabel}
      </span>
    </div>
  );
};

export default SwitchButton;
