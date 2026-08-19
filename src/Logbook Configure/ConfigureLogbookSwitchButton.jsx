import React, { useState } from "react";
import { Space, Switch } from "antd";


function ConfigureLogbookSwitchButton({
  isPublicAccess = false,
  setIsPublicAccess,
  offLabel = "OFF",
  onLabel = "ON",
}) {
  const [isDay, setIsDay] = useState(isPublicAccess);


  console.log("ConfigureLogbookSwitchButton_toggle", isDay);
  const toggleSwitch = () => {
    //console.log("ConfigureLogbookSwitchButton_toggle", !isDay);
    setIsPublicAccess(!isDay);
    setIsDay(!isDay);
  };
  return (
    <>
      <Space vertical>
        <Switch
          onClick={toggleSwitch}
          checkedChildren={onLabel}
          unCheckedChildren={offLabel}
          checked={isDay}
        />
        
      </Space>
    </>
  );
}

export default ConfigureLogbookSwitchButton;
