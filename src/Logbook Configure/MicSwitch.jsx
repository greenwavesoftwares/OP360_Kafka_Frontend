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
}) => {};

export default MicSwitch;
