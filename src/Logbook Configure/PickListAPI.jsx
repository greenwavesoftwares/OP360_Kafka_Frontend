import React, { useState, useRef } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { ListBox } from "primereact/listbox";
import { Divider } from "primereact/divider";

const PickListAPI = ({
  data,
  textAreaValue,
  setTextAreaValue,
  textAreaValue2,
  setTextAreaValue2,
  depData,
  apiType,
}) => {
  // const [textAreaValue2, setTextAreaValue2] = useState(""); // State for the second text area
  const [activeTextArea, setActiveTextArea] = useState(""); // Track which text area is active

  const textAreaRef1 = useRef(null);
  const textAreaRef2 = useRef(null);
  // const apiType = "GET";

  // Extracting cellInfo from the data and formatting it for ListBox
  let listBoxData = [];
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

  // Function to handle clicking a data label
  const handleLabelClick = (value) => {
    const insertValue = ` {{${value}}} `;

    if (activeTextArea === "textArea1") {
      const { selectionStart, selectionEnd } = textAreaRef1?.current;
      const newValue =
        textAreaValue.slice(0, selectionStart) +
        insertValue +
        textAreaValue.slice(selectionEnd);
      setTextAreaValue(newValue);
      setTimeout(() => {
        textAreaRef1.current.setSelectionRange(
          selectionStart + insertValue.length,
          selectionStart + insertValue.length
        );
        textAreaRef1.current.focus();
      }, 0);
    } else if (activeTextArea === "textArea2") {
      const { selectionStart, selectionEnd } = textAreaRef2?.current;
      const newValue =
        textAreaValue2.slice(0, selectionStart) +
        insertValue +
        textAreaValue2.slice(selectionEnd);
      setTextAreaValue2(newValue);
      setTimeout(() => {
        textAreaRef2.current.setSelectionRange(
          selectionStart + insertValue.length,
          selectionStart + insertValue.length
        );
        textAreaRef2.current.focus();
      }, 0);
    }
  };

  // Function to block the Enter key in the text areas
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent adding new lines on Enter key press
    }
  };

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {/* ListBox Section */}
      <div>
        <h4>Click on cell to add in the text fields </h4>
        <ListBox
          style={{
            height: "400px",
            overflow: "scroll",
          }}
          options={listBoxData} // Use the transformed data
          filter // Enable filtering
          filterPlaceholder="Search..."
          className="ListBoxStyle"
          onChange={(e) => handleLabelClick(e.value)}
          itemTemplate={(option) => (
            <div
              style={{
                cursor: "pointer",
                padding: "10px",
                backgroundColor: "#e0f7fa", // Light blue background
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: "6px", // Rounded corners
                marginBottom: "1px", // Add spacing between items
              }}
            >
              <span>{option.label}</span>
              <i className="pi pi-angle-right" style={{ fontSize: "16px" }}></i>
            </div>
          )}
        />
      </div>

      <Divider layout="vertical" />

      {/* Text Areas Section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {/* First Text Area */}
        <div>
          <h3>API URL</h3>
          <InputTextarea
            ref={textAreaRef1}
            value={textAreaValue}
            placeholder="http://example.com/api"
            onFocus={() => setActiveTextArea("textArea1")} // Set active text area
            onChange={(e) => setTextAreaValue(e.target.value)}
            onKeyDown={handleKeyDown} // Add event listener to block the Enter key
            rows={14}
            cols={30}
            style={{
              // width: "100%",
              resize: "none",
              height: "150px",
            }}
          />
        </div>

        {/* Second Text Area */}
        {apiType !== "GET" && (
          <div>
            <h3>API Body</h3>
            <InputTextarea
              ref={textAreaRef2}
              value={textAreaValue2}
              placeholder={`{
  "username": "alice123",
  "password": "mypassword"
}
`}
              onFocus={() => setActiveTextArea("textArea2")} // Set active text area
              onChange={(e) => setTextAreaValue2(e.target.value)}
              // onKeyDown={handleKeyDown} // Add event listener to block the Enter key
              rows={14}
              cols={30}
              style={{
                width: "100%",
                resize: "none",
                height: "150px",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PickListAPI;
