import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  Switch,
  Button,
  TextareaAutosize,
  IconButton,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

const fieldTypes = [
  "Text",
  "CommentBox",
  "Number",
  "Dropdown",
  "Boolean",
  "Date",
  "DateTime",
  "Time",
  "Image",
  "API",
  "Button",
  "URL",
  "File",
];

const awesomeIcons = ["fa-home", "fa-user", "fa-check", "fa-times"]; // Example icons

const FormComponent = () => {
  const [selectedCell, setSelectedCell] = useState({
    fieldType: "",
    selectedIcon: "",
    buttonKeyValue: "",
    editable: true,
    upFile: null,
    dbImage: "",
    imgHeight: 100,
    imgWidth: 100,
    datePattern: "",
    drpItems: [{ itemLabel: "", itemValue: "" }],
    minVal: 0,
    maxVal: 100,
    decimalPoints: 2,
    apiMethod: "GET",
    apiUrl: "",
    apiBody: "",
  });

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setSelectedCell((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddDropdownItem = () => {
    setSelectedCell((prevState) => ({
      ...prevState,
      drpItems: [...prevState.drpItems, { itemLabel: "", itemValue: "" }],
    }));
  };

  const handleRemoveDropdownItem = (index) => {
    const updatedItems = selectedCell.drpItems.filter((_, i) => i !== index);
    setSelectedCell((prevState) => ({
      ...prevState,
      drpItems: updatedItems,
    }));
  };

  const handleFileUpload = (event) => {
    setSelectedCell((prevState) => ({
      ...prevState,
      upFile: event.target.files[0],
    }));
  };

  const renderFields = () => {
    switch (selectedCell.fieldType) {
      case "Button":
        return (
          <>
            <InputLabel>Select Icon</InputLabel>
            <Select
              name="selectedIcon"
              value={selectedCell.selectedIcon}
              onChange={handleFieldChange}
              fullWidth
            >
              {awesomeIcons.map((icon) => (
                <MenuItem key={icon} value={icon}>
                  <i className={icon}></i> {icon}
                </MenuItem>
              ))}
            </Select>
            <TextField
              name="buttonKeyValue"
              label="Key Value"
              value={selectedCell.buttonKeyValue}
              onChange={handleFieldChange}
              fullWidth
            />
          </>
        );

      case "Image":
        return (
          <>
            <InputLabel>Choose Image</InputLabel>
            <input type="file" onChange={handleFileUpload} />
            {selectedCell.upFile && (
              <>
                <img
                  src={URL.createObjectURL(selectedCell.upFile)}
                  alt="Preview"
                  width={selectedCell.imgWidth}
                  height={selectedCell.imgHeight}
                />
                <TextField
                  name="imgHeight"
                  label="Image Height"
                  type="number"
                  value={selectedCell.imgHeight}
                  onChange={handleFieldChange}
                  fullWidth
                />
                <TextField
                  name="imgWidth"
                  label="Image Width"
                  type="number"
                  value={selectedCell.imgWidth}
                  onChange={handleFieldChange}
                  fullWidth
                />
              </>
            )}
          </>
        );

      case "Dropdown":
        return (
          <>
            <Button onClick={handleAddDropdownItem} startIcon={<Add />}>
              Add Item
            </Button>
            {selectedCell.drpItems.map((item, index) => (
              <div key={index}>
                <TextField
                  label="Item Label"
                  name={`itemLabel-${index}`}
                  value={item.itemLabel}
                  onChange={(e) => {
                    const updatedItems = [...selectedCell.drpItems];
                    updatedItems[index].itemLabel = e.target.value;
                    setSelectedCell((prevState) => ({
                      ...prevState,
                      drpItems: updatedItems,
                    }));
                  }}
                  fullWidth
                />
                <TextField
                  label="Item Value"
                  name={`itemValue-${index}`}
                  value={item.itemValue}
                  onChange={(e) => {
                    const updatedItems = [...selectedCell.drpItems];
                    updatedItems[index].itemValue = e.target.value;
                    setSelectedCell((prevState) => ({
                      ...prevState,
                      drpItems: updatedItems,
                    }));
                  }}
                  fullWidth
                />
                <IconButton onClick={() => handleRemoveDropdownItem(index)}>
                  <Delete />
                </IconButton>
              </div>
            ))}
          </>
        );

      case "Number":
        return (
          <>
            <TextField
              name="minVal"
              label="Min Value"
              type="number"
              value={selectedCell.minVal}
              onChange={handleFieldChange}
              fullWidth
            />
            <TextField
              name="maxVal"
              label="Max Value"
              type="number"
              value={selectedCell.maxVal}
              onChange={handleFieldChange}
              fullWidth
            />
            <TextField
              name="decimalPoints"
              label="Decimal Places"
              type="number"
              value={selectedCell.decimalPoints}
              onChange={handleFieldChange}
              fullWidth
            />
          </>
        );

      case "API":
        return (
          <>
            <InputLabel>API Method</InputLabel>
            <Select
              name="apiMethod"
              value={selectedCell.apiMethod}
              onChange={handleFieldChange}
              fullWidth
            >
              <MenuItem value="GET">GET</MenuItem>
              <MenuItem value="POST">POST</MenuItem>
              <MenuItem value="PUT">PUT</MenuItem>
              <MenuItem value="DELETE">DELETE</MenuItem>
            </Select>
            <TextField
              name="apiUrl"
              label="API URL"
              value={selectedCell.apiUrl}
              onChange={handleFieldChange}
              fullWidth
            />
            <TextareaAutosize
              name="apiBody"
              placeholder="API Body"
              value={selectedCell.apiBody}
              onChange={handleFieldChange}
              style={{ width: "100%", height: 100 }}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <center>
        <form>
          <InputLabel>Field Type</InputLabel>
          <Select
            name="fieldType"
            value={selectedCell.fieldType}
            onChange={handleFieldChange}
            fullWidth
          >
            {fieldTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>

          {renderFields()}

          {selectedCell.fieldType !== "Image" &&
            selectedCell.fieldType !== "API" &&
            selectedCell.fieldType !== "File" && (
              <>
                <InputLabel>Editable</InputLabel>
                <Switch
                  checked={selectedCell.editable}
                  onChange={() =>
                    setSelectedCell((prevState) => ({
                      ...prevState,
                      editable: !prevState.editable,
                    }))
                  }
                />
              </>
            )}
        </form>
      </center>
    </>
  );
};

export default FormComponent;
