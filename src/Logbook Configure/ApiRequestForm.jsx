import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import PickListAPI from "./PickListAPI";
import SnackbarComponent from "../components/shared/snackbar/customSnackbar";

const ApiRequestForm = ({ formValues, setFormValues, cell, depDataList }) => {
  const [buttonState, setButtonState] = useState("question"); // State to manage button icon
  const [snackbarText, setSnackbarText] = useState("Data saved !"); // Text for the snackbar notification
  const [snackbarSeverity, setsnackbarSeverity] = useState("success"); // Severity level for the snackbar (success, error, etc.)
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Boolean to control snackbar visibility

  const validateJson = () => {
    try {
      JSON.parse(formValues.apiBody); // Validate JSON
      setButtonState("check"); // If valid, show check icon
      console.log("JSON is valid");
      setsnackbarSeverity(); // Clear any previous snackbar severity (might need a value)
      setSnackbarText("Valid JSON"); // Set success message for snackbar
      setSnackbarOpen(true);
      console.log("JSON Valid");
    } catch (error) {
      setButtonState("times"); // If invalid, show cross icon
      console.log("JSON is invalid");
      setsnackbarSeverity("error"); // Clear any previous snackbar severity (might need a value)
      setSnackbarText("Invalid JSON"); // Set success message for snackbar
      setSnackbarOpen(true);
    }
  };

  const handleInputChange = (e) => {
    setFormValues({
      ...formValues,
      apiBody: e.target.value,
    });
    setButtonState("question"); // Reset button to "?" when user types
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div className="p-field" style={{ width: "25%", textAlign: "left" }}>
          <label htmlFor="select Request Type">select Request Type</label>
        </div>
        <div style={{ width: "65%" }}>
          <Dropdown
            options={[
              { label: "GET", value: "GET" },
              { label: "POST", value: "POST" },
              { label: "PUT", value: "PUT" },
              { label: "DELETE", value: "DELETE" },
            ]}
            value={formValues.apiMethod}
            onChange={(e) =>
              setFormValues({ ...formValues, apiMethod: e.value })
            }
            showClear
            placeholder="Request Type"
          />
        </div>
      </div>
      {/* for API URL and BODY without Dependent Fields */}
      {(cell?.dependent === null || cell?.dependent === false) &&
        formValues.apiMethod && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "40px",
              }}
            >
              <div
                className="p-field"
                style={{ width: "25%", textAlign: "left" }}
              >
                <label htmlFor="API URL">API URL</label>
              </div>
              <div style={{ width: "65%" }}>
                <InputTextarea
                  value={formValues.apiUrl}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      apiUrl: e.target.value,
                    })
                  }
                  placeholder="API URL"
                />
              </div>
            </div>
            {formValues.apiMethod !== null &&
              formValues.apiMethod !== "GET" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    className="p-field"
                    style={{ width: "25%", textAlign: "left" }}
                  >
                    <label htmlFor="API Body">API Body</label>
                  </div>
                  <div
                    style={{
                      position: "relative", // For positioning the button
                      display: "flex",
                      flexDirection: "column",
                      width: "65%",
                    }}
                  >
                    <InputTextarea
                      value={formValues.apiBody}
                      onChange={handleInputChange}
                      placeholder="API Body"
                      style={{
                        paddingRight: "50px", // Space for button
                      }}
                    />
                    {/* Dynamic Button */}
                    <Button
                      icon={`pi pi-${buttonState}`} // Dynamically set icon
                      onClick={validateJson}
                      label="check"
                      iconPos="right"
                      className={` p-button-sm ${
                        buttonState === "check"
                          ? "p-button-success"
                          : buttonState === "times"
                          ? "p-button-danger"
                          : ""
                      }`} // Success or error styling
                      style={{
                        position: "absolute",
                        top: "-33px", // Align with top of textarea
                        right: "5px", // Space from right edge
                        width: "80px",
                        height: "30px",
                        padding: "0",
                        textTransform:"capitalize"
                      }}
                    />
                  </div>
                </div>
              )}
          </div>
        )}

      {/* {cell?.dependentFields !== null &&
              cell?.dependentFields?.length !== 0 &&
              formValues.apiMethod === "GET" && (
                <div>
                  <PickListDemo
                    textAreaValue={formValues.apiUrl}
                    setTextAreaValue={(value) =>
                      setFormValues({ ...formValues, apiUrl: value })
                    }
                    depData={cell?.dependentFields}
                  ></PickListDemo>
                </div>
              )} */}

      {/* for API URL and BODY without Dependent Fields */}
      {cell?.dependent === true && formValues.apiMethod !== null && (
        <div>
          <PickListAPI
            textAreaValue={formValues.apiUrl}
            setTextAreaValue={(value) =>
              setFormValues({ ...formValues, apiUrl: value })
            }
            textAreaValue2={formValues.apiBody}
            setTextAreaValue2={(value) =>
              setFormValues({ ...formValues, apiBody: value })
            }
            depData={depDataList}
            apiType={formValues.apiMethod}
          ></PickListAPI>
        </div>
      )}
      <br></br>
      {/* <div>
        {formValues.apiMethod !== null && formValues.apiMethod !== "GET" && (
          <Button
            icon="pi pi-check"
            label="Check JSON"
            onClick={validateJson}
            className="p-button-success"
          />
        )}
      </div> */}
      {/* <br></br> */}
      {/* Corrected */}
      <div>
        <SnackbarComponent
          openPopup={snackbarOpen} // State to control snackbar open/close
          setOpenPopup={setSnackbarOpen} // Function to update snackbar state
          dialogMessage={snackbarText} // Message to display in the snackbar
          snackbarSeverity={snackbarSeverity} // Severity level of the snackbar (e.g., success, error)
        />
      </div>
    </>
  );
};

export default ApiRequestForm;
