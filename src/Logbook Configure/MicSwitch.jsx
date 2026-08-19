import React, { useState } from "react";
import "./SwitchButton.css";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

const MicSwitch = ({
  isPublicAccess = false,
  setIsPublicAccess,
  offLabel = "Mic OFF",
  onLabel = "Mic ON",
  OffIcon = MicOffIcon,
  OnIcon = MicIcon,
}) => {
  const subscriptionKey =
    "D4fvUDK3hnHElKGCSADuSBvZrDvzxjKgBbeVayGqW9AvxYFk3ahcJQQJ99AKACYeBjFXJ3w3AAAYACOGkbZq";
  const serviceRegion = "eastus";
  const [isDay, setIsDay] = useState(isPublicAccess);
  const [recognizer, setRecognizer] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [interimResult, setInterimResult] = useState("");

  const startRecognition = () => {
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
      subscriptionKey,
      serviceRegion
    );
    speechConfig.speechRecognitionLanguage = "en-IN"; // Set the recognition language

    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    const speechRecognizer = new SpeechSDK.SpeechRecognizer(
      speechConfig,
      audioConfig
    );

    setRecognizer(speechRecognizer);

    // Capture interim results
    speechRecognizer.recognizing = (s, e) => {
      setInterimResult(e.result.text);
    };

    // Capture final results
    speechRecognizer.recognized = (s, e) => {
      if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
        const finalText = e.result.text;
        setTranscription((prev) => `${prev} ${finalText}`);
        setInterimResult(""); // Clear interim results
      } else if (e.result.reason === SpeechSDK.ResultReason.NoMatch) {
        console.log("No speech recognized.");
      }
    };

    // Handle errors
    speechRecognizer.canceled = (s, e) => {
      if (e.reason === SpeechSDK.CancellationReason.Error) {
        console.error(`Speech recognition canceled: ${e.errorDetails}`);
        if (e.errorDetails.includes("Quota exceeded")) {
          alert(
            "Speech recognition quota exceeded. Please check your subscription or try again later."
          );
        }
      }
    };

    // Start continuous recognition
    speechRecognizer.startContinuousRecognitionAsync(
      () => console.log("Speech recognition started."),
      (error) => console.error("Error starting recognition:", error)
    );
  };

  const stopRecognition = () => {
    if (recognizer) {
      recognizer.stopContinuousRecognitionAsync(() => {
        console.log("Recognition stopped.");
        setRecognizer(null);
        setInterimResult("");
        setTranscription("");
      });
    }
  };

  const toggleSwitch = () => {
    const newState = !isDay;
    console.log("Toggle state:", newState);
    setIsPublicAccess(newState);
    setIsDay(newState);

    if (newState) {
      startRecognition();
    } else {
      stopRecognition();
    }
  };

  return (
    <div>
      <div
        className={`switch-container ${isDay ? "night" : "day"}`}
        onClick={toggleSwitch}
      >
        <div className="switch-ball">{isDay ? <OnIcon /> : <OffIcon />}</div>
        <span className={`switch-label ${isDay ? "label-day" : "label-night"}`}>
          {isDay ? onLabel : offLabel}
        </span>
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
    </div>
  );
};

export default MicSwitch;
