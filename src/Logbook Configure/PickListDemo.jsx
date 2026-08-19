import React, { useState, useRef } from "react";
import { ListBox } from "primereact/listbox";
import { Divider } from "primereact/divider";
import LocalVariablesTab from "./LocalVariablesTab";
import MonacoScriptRunner from "../Test Ground/MonacoScriptRunner";

const PickListDemo = ({
  data,
  depData = [],
  disabledArea = false,
  expressionType,
  textAreaValue = "",
  setTextAreaValue,
}) => {
  // const [textAreaValue, setTextAreaValue] = useState("");
  const editorRef = useRef(null); // Ref to access insertAtCursor

  let listBoxData = null;
  if (data) {
    listBoxData = data
      .flatMap((item) => item.cellInfo)
      .map((cell) => ({
        label: `${cell.aliasId} (${cell.cellId})`,
        value: cell.cellId,
      }));
  } else {
    listBoxData = depData?.map((item) => ({
      label: `${item.aliasId} (${item.cellId})`,
      value: item.cellId,
    }));
  }
  const handleLabelClick = (value) => {
    editorRef.current?.insertAtCursor?.(` {{${value}}} `);
  };

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <div>
        <span className="font-bold text-sm" style={{fontSize:"0.75rem !important"}}>
          Click on dependent fields to add in the script
        </span>

        <div className=" mt-1">
          <LocalVariablesTab handleLabelClick={handleLabelClick} />
        </div>

        {listBoxData.length > 0 && (
          <ListBox
            listStyle={{ height: "38rem", width: "300px" }}
            style={{ marginTop: "1rem" }}
            options={listBoxData}
            filter
            filterPlaceholder="Search..."
            className="ListBoxStyle"
            onChange={(e) => handleLabelClick(e.value)}
          />
        )}
      </div>

      <Divider layout="vertical" />

      <div style={{ width: "100%" }}>
        {/* <span className="font-bold text-sm">
          {disabledArea
            ? "Logic Editor (return true or false)"
            : "Logic Editor"}
        </span> */}

        <MonacoScriptRunner
          ref={editorRef}
          value={textAreaValue}
          onChange={setTextAreaValue}
          expressionType={expressionType}
          disabledArea={disabledArea}
        />
      </div>
    </div>
  );
};

export default PickListDemo;
