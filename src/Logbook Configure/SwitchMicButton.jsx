import React, { useState, useEffect, useRef } from "react";
import "./SwitchButton.css";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import SnackbarComponent from "../components/shared/snackbar/customSnackbar";
import { Box, CircularProgress } from "@mui/material";

const SwitchMicButton = ({
  isPublicAccess = false,
  setIsPublicAccess,
  offLabel = "",
  onLabel = "",
  OffIcon = MicOffIcon,
  OnIcon = MicIcon,
  updatedGridDataTest,
  setGridDataTest,
  onPassiveFieldChange,
  pollObj,
  setPollObj,
}) => {
  const subscriptionKey =
    // "D4fvUDK3hnHElKGCSADuSBvZrDvzxjKgBbeVayGqW9AvxYFk3ahcJQQJ99AKACYeBjFXJ3w3AAAYACOGkbZq";
    "9sBZtAeu7ifBtsLxZepPTTovrL7k32kO7iQmeuVtT7jXWUgawedWJQQJ99BAACGhslBXJ3w3AAAYACOGP2qB";

  // const serviceRegion = "eastus";
  const serviceRegion = "centralindia";
  const [isDay, setIsDay] = useState(isPublicAccess);
  const [transcription, setTranscription] = useState("");
  const [interimResult, setInterimResult] = useState("");
  const [snackbarText, setSnackbarText] = useState("Data saved !"); // Text for the snackbar notification
  const [snackbarSeverity, setsnackbarSeverity] = useState("success"); // Severity level for the snackbar (success, error, etc.)
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Boolean to control snackbar visibility
  const [loading, setLoading] = useState(false);

  const recognizerRef = useRef(null);
  const socketRef = useRef(null);
  const idleTimer = useRef(null);

  const resetIdleTimer = () => {
    if (idleTimer.current) {
      clearTimeout(idleTimer.current);
    }
    idleTimer.current = setTimeout(() => {
      console.log("No speech detected for 2 minutes. Stopping mic...");
      stopConnectionAndMic();
      setIsPublicAccess(false);
      setIsDay(false);
    }, 1 * 60 * 2000); // 1 minutes
  };

  const stopRecognition = () => {
    if (recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync(() => {
        recognizerRef.current = null;
        setInterimResult("");
        setTranscription("");
      });
    }
  };

  const stopConnectionAndMic = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    stopRecognition();
    if (idleTimer.current) {
      clearTimeout(idleTimer.current);
    }
  };

  const startConnectionAndMic = () => {
    setLoading(true);
    const ws = new WebSocket("wss://op360.greenware.app:5000/ws");
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected.");
      startRecognition(ws);
      setLoading(false);
    };

    ws.onmessage = (message) => {
      handleWebSocketData(message.data);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      stopRecognition();
      setIsDay(false);
      setsnackbarSeverity("error"); // Clear any previous snackbar severity (might need a value)
      setSnackbarText("Error!"); // Set success message for snackbar
      setSnackbarOpen(true);
      setLoading(false);
    };

    ws.onclose = () => console.log("WebSocket closed.");
  };

  function excelReferenceToCellId(excelRef) {
    const match = excelRef.match(/^([A-Z]+)(\d+)$/);
    if (!match) {
      throw new Error("Invalid Excel reference format.");
    }
    const columnLetters = match[1];
    const row = match[2];

    let col = 0;
    for (let i = 0; i < columnLetters.length; i++) {
      col *= 26;
      col += columnLetters.charCodeAt(i) - 65 + 1;
    }

    return `_${row}_${col}`;
  }

  function transformObjectKeys(obj) {
    const transformedObj = {};
    for (const [key, value] of Object.entries(obj)) {
      const newKey = excelReferenceToCellId(key);
      transformedObj[newKey] = value;
    }
    return transformedObj;
  }

  const handleWebSocketData = async (data) => {
    console.log("Handling WebSocket data:", data); // Log WebSocket data
    try {
      const parsedData = JSON.parse(data); // Parse the WebSocket data
      const transformedData = transformObjectKeys(parsedData); // Transform the keys
      if (Object.keys(transformedData).length > 0) {
        console.log("Updated Grid Data:", updatedGridDataTest); // Log grid data update
        updatedGridDataTest = updatedGridDataTest.map((item) => ({
          ...item,
          cellData: item.cellData.map((cell) => {
            // if (
            //   (transformedData.hasOwnProperty(cell.cellId) ||
            //     transformedData.hasOwnProperty(cell.aliasId)) &&
            //   cell.editable &&
            //   cell.fieldType !== "Image" &&
            //   cell.fieldType !== "Button" &&
            //   cell.fieldType !== "File" &&
            //   cell.disabled === false
            // ) {
            //   return {
            //     ...cell,
            //     value:
            //       transformedData[cell.cellId] !== undefined
            //         ? transformedData[cell.cellId]
            //         : transformedData[cell.aliasId],
            //   };
            // }
            // return cell;
            // if (
            //   (transformedData.hasOwnProperty(cell.cellId) ||
            //     transformedData.hasOwnProperty(cell.aliasId)) &&
            //   cell.editable &&
            //   cell.fieldType !== "Image" &&
            //   cell.fieldType !== "Button" &&
            //   cell.fieldType !== "File" &&
            //   cell.disabled === false
            // ) {
            //   const updatedValue =
            //     transformedData[cell.cellId] !== undefined
            //       ? transformedData[cell.cellId]
            //       : transformedData[cell.aliasId];

            //   // Case-insensitive check for Dropdown
            //   if (cell.fieldType === "Dropdown") {
            //     const isValidDropdownValue = cell.dropDownFields?.some(
            //       (item) =>
            //         item.itemValue?.toString().toLowerCase() ===
            //         updatedValue?.toString().toLowerCase()
            //     );
            //     if (!isValidDropdownValue) {
            //       return cell; // Skip update if not valid
            //     } else {
            //       return {
            //         ...cell,
            //         value: updatedValue,
            //       };
            //     }
            //   } else {
            //     return {
            //       ...cell,
            //       value: updatedValue,
            //     };
            //   }
            // }
            // return cell;

            if (
              (transformedData.hasOwnProperty(cell.cellId) ||
                transformedData.hasOwnProperty(cell.aliasId)) &&
              cell.editable &&
              cell.fieldType !== "Image" &&
              cell.fieldType !== "Button" &&
              cell.fieldType !== "File" &&
              cell.disabled === false
            ) {
              const rawValue =
                transformedData[cell.cellId] !== undefined
                  ? transformedData[cell.cellId]
                  : transformedData[cell.aliasId];

              // Special handling for Dropdown
              if (cell.fieldType === "Dropdown") {
                const matchedOption = cell.dropDownFields?.find(
                  (item) =>
                    item.itemValue?.toString().toLowerCase() ===
                    rawValue?.toString().toLowerCase()
                );

                if (!matchedOption) {
                  return cell; // Skip update if no match
                }

                return {
                  ...cell,
                  value: matchedOption.itemValue, // Use the actual dropdown itemValue
                };
              }

              // Default case for non-Dropdown
              return {
                ...cell,
                value: rawValue,
              };
            }
            return cell;
          }),
        }));
        await setGridDataTest(updatedGridDataTest);
        // Retrieve the latest grid data after the state update
        const latestGridData = updatedGridDataTest;
        // Process each cell asynchronously
        await Promise.all(
          latestGridData.flatMap((item) =>
            item.cellData.map((cell) => {
              if (
                transformedData.hasOwnProperty(cell.cellId) ||
                transformedData.hasOwnProperty(cell.aliasId)
              ) {
                return onPassiveFieldChange(
                  cell,
                  latestGridData,
                  setGridDataTest,
                  pollObj,
                  setPollObj
                );
              }
              return null;
            })
          )
        );
      } else {
        console.log("No data to update from WebSocket.");
      }
    } catch (error) {
      console.error("Error processing WebSocket data:", error);
    }
  };
  const startRecognition = (ws) => {
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
      subscriptionKey,
      serviceRegion
    );
    speechConfig.speechRecognitionLanguage = "en-IN";
    // speechConfig.speechRecognitionLanguage = "hi-IN";
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    const speechRecognizer = new SpeechSDK.SpeechRecognizer(
      speechConfig,
      audioConfig
    );

    recognizerRef.current = speechRecognizer;
    resetIdleTimer(); // Start idle timer

    speechRecognizer.recognizing = (s, e) => {
      setInterimResult(e.result.text);
      resetIdleTimer(); // Reset idle timer on speech
    };

    speechRecognizer.recognized = (s, e) => {
      if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
        setTranscription((prev) => `${prev} ${e.result.text}`);
        setInterimResult("");
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(e.result.text);
        }
        resetIdleTimer(); // Reset timer on recognition
      }
    };

    speechRecognizer.startContinuousRecognitionAsync();
  };

  useEffect(() => {
    return () => {
      stopConnectionAndMic();
    };
  }, []);

  const toggleSwitch = () => {
    const newState = !isDay;
    if (newState) {
      setIsPublicAccess(true);
      setIsDay(true);
      startConnectionAndMic();
    } else {
      setIsPublicAccess(false);
      setIsDay(false);
      stopConnectionAndMic();
    }
  };

  return (
    <div>
      <div onClick={toggleSwitch}>
        <div>{isDay ? <OnIcon color="info" /> : <OffIcon color="error" />}</div>
      </div>
      {isDay && (
        <div className="transcription-container">
          <p>Transcription:</p>
          <div className="transcription-text">
            {transcription}{" "}
            <span className="interim-text">{interimResult}</span>
          </div>
        </div>
      )}
      <div>
        <SnackbarComponent
          openPopup={snackbarOpen} // State to control snackbar open/close
          setOpenPopup={setSnackbarOpen} // Function to update snackbar state
          dialogMessage={snackbarText} // Message to display in the snackbar
          snackbarSeverity={snackbarSeverity} // Severity level of the snackbar (e.g., success, error)
        />
        {loading && (
          <>
            {/* <LinearProgress /> */}
            <Box
              sx={{
                position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999, // Ensure it appears on top
              }}
            >
              <CircularProgress />
            </Box>
          </>
        )}
      </div>
    </div>
  );
};

export default SwitchMicButton;
