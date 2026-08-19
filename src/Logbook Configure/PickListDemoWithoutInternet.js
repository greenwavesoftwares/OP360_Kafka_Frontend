import React, { useState, useRef, useEffect } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { ListBox } from "primereact/listbox";
import { Divider } from "primereact/divider";
import { TreeSelect } from "primereact/treeselect";
import LocalVariablesTab from "./LocalVariablesTab";
 
// CustomComponent that accepts a list of data objects
const PickListDemoWithoutInternet = ({
  data,
  textAreaValue,
  setTextAreaValue,
  depData,
  disabledArea,
}) => {
  // State to manage the text area value
 
  const textAreaRef = useRef(null);
  // const [nodes, setNodes] = useState(null);
  // const [selectedNodeKey, setSelectedNodeKey] = useState(null);
  // Extracting cellInfo from the data and formatting it for ListBox
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
    console.log("My Value : ", value);
    value = ` {{${value}}} `;
    const { selectionStart, selectionEnd } = textAreaRef?.current;
    console.log("My TextArea Value : ", textAreaValue);
    if (textAreaValue === null) {
      setTextAreaValue(value);
    } else {
      const newValue =
        textAreaValue.slice(0, selectionStart) +
        value +
        textAreaValue.slice(selectionEnd);
      setTextAreaValue(newValue);
      setTimeout(() => {
        textAreaRef.current.setSelectionRange(
          selectionStart + value.length,
          selectionStart + value.length
        );
        textAreaRef.current.focus();
      }, 0);
    }
  };
 
  // Function to block the Enter key in the textarea
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent adding new lines on Enter key press
    }
  };
 
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <div>
        <span className="font-bold text-sm">
          Click on dependent fields to add in the SQL
        </span>
 
        <LocalVariablesTab
          handleLabelClick={handleLabelClick}
        ></LocalVariablesTab>
        {depData?.length !== 0 && (
          <ListBox
            listStyle={{ height: "398px", width: "300px" }}
            style={{
              //maxHeight: "400px", // Set the height to match the ListBox
              //overflow: "scroll",
              marginTop: "1rem",
            }}
            options={listBoxData} // Use the transformed data
            filter // Enable filtering
            filterPlaceholder="Search..."
            className="ListBoxStyle newlistboxStyleforgap"
            onChange={(e) => handleLabelClick(e.value)}
            itemTemplate={(option) => (
              <div
                style={{
                  cursor: "pointer",
                  padding: "11px",
                  backgroundColor: "#e0f7fa", // Light blue background
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderRadius: "6px", // Rounded corners
                  marginBottom: "1px", // Add spacing between items
                }}
              >
                <span>{option.label}</span>
                <i
                  className="pi pi-angle-right"
                  style={{ fontSize: "16px" }}
                ></i>{" "}
                {/* PrimeReact right arrow icon */}
              </div>
            )}
            //style={{ width: "250px", maxHeight: "400px", overflow: "auto" }} // Set max height and enable scrolling
          />
        )}
      </div>
      <Divider layout="vertical" />
      <div style={{ width: "100%" }}>
        <span>
          {disabledArea === true ? (
            <span className="font-bold text-sm">{`Logic Editor (return true or false)`}</span>
          ) : (
            <span className="font-bold text-sm">{`Logic Editor`}</span>
          )}
        </span>
        <InputTextarea
          ref={textAreaRef}
          value={textAreaValue}
          placeholder="Please don't use newline in the query. Make sure the query is in a single line."
          onChange={(e) => setTextAreaValue(e.target.value)}
          // onKeyDown={handleKeyDown} // Add event listener to block the Enter key
          rows={28}
          // cols={30}
          style={{
            minWidth: "100%",
            resize: "none",
            height: "470px", // Set the height to match the ListBox
            // backgroundColor: "red",
            marginTop: "1rem",
          }}
        />
      </div>
    </div>
  );
};
 
export default PickListDemoWithoutInternet;