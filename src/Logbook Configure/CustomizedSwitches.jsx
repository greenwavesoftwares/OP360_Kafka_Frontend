import React, { useState } from "react";
import { InputSwitch } from "primereact/inputswitch";
import "./CustomSwitch.css"; // Import your custom CSS file

export default function CustomizedSwitches({ checked, setChecked }) {
  //   const [checked, setChecked] = useState(false);

  return (
    <div className="card flex ">
      <div className="flex align-items-center">
        {/* ON Label with icon */}
        <span
          className={`mr-2 ${checked ? "text-gray-500" : "text-black"}`}
          style={{ pointerEvents: checked ? "auto" : "none" }}
        >
          <i
            className={`pi pi-file-excel ${
              checked ? "text-gray-500" : "text-black"
            }`}
          ></i>
          <span style={{ fontWeight: "bolder", margin: "5px" }}>Excel</span>
        </span>
        <InputSwitch
          checked={checked}
          onChange={(e) => setChecked(e.value)}
          className={checked ? "custom-switch-on" : "custom-switch-off"}
        />
        {/* OFF Label with icon */}
        <div style={{ display: "flex" }}>
          <span
            className={`ml-2 ${!checked ? "text-gray-500" : "text-black"}`}
            style={{ pointerEvents: !checked ? "auto" : "none" }}
          >
            <i
              className={`pi pi-image ${
                !checked ? "text-gray-500" : "text-black"
              }`}
            ></i>
            <span style={{ fontWeight: "bolder", margin: "5px" }}>
              Image (BETA)
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
