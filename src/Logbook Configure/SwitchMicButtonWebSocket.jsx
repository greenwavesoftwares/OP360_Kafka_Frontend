import React, { useState } from "react";
import "./SwitchButton.css";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

const SwitchMicButton = ({
  isPublicAccess = false,
  setIsPublicAccess,
  offLabel = "Mic OFF",
  onLabel = "Mic ON",
  OffIcon = MicOffIcon,
  OnIcon = MicIcon,
}) => {
  const [isDay, setIsDay] = useState(isPublicAccess);
  const [mediaStream, setMediaStream] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [audioURL, setAudioURL] = useState(null); // To store the download link

  const API_URL = "http://192.168.68.68:5000/transcription";

  const toggleSwitch = async () => {
    const newState = !isDay;
    setIsPublicAccess(newState);
    setIsDay(newState);

    if (newState) {
      try {
        console.log("Requesting microphone access...");
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setMediaStream(stream);

        const mediaRecorder = new MediaRecorder(stream);
        setRecorder(mediaRecorder);

        const chunks = [];
        mediaRecorder.ondataavailable = (event) => {
          chunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          console.log("Recording saved as WebM blob.");
          setAudioURL(URL.createObjectURL(blob)); // Set download link

          try {
            // Decode and process PCM data
            const arrayBuffer = await blob.arrayBuffer();
            const audioContext = new AudioContext();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            // Log original audio parameters
            console.log("Original Sample Rate:", audioBuffer.sampleRate);
            console.log("Number of Channels:", audioBuffer.numberOfChannels);

            // Resample to 16 kHz
            const resampledBuffer = audioContext.createBuffer(
              1,
              audioBuffer.duration * 16000,
              16000
            );
            resampledBuffer.copyToChannel(audioBuffer.getChannelData(0), 0);

            // Convert to PCM Float32
            const pcmData = resampledBuffer.getChannelData(0);

            // Trim silence
            const trimmedPCM = trimSilence(pcmData, 0.01);
            console.log("Trimmed PCM Data Length:", trimmedPCM.length);

            // Convert to Int16
            const pcmInt16 = new Int16Array(trimmedPCM.length);
            for (let i = 0; i < trimmedPCM.length; i++) {
              pcmInt16[i] = Math.max(-1, Math.min(1, trimmedPCM[i])) * 0x7fff;
            }

            // Create WAV header
            const wavHeader = createWavHeader({
              sampleRate: 16000,
              numChannels: 1,
              byteRate: 32000, // sampleRate * numChannels * bytesPerSample
              blockAlign: 2, // numChannels * bytesPerSample
              bitsPerSample: 16,
              dataSize: pcmInt16.length * 2,
            });

            // Combine header and PCM data
            const wavBlob = new Blob([wavHeader, pcmInt16.buffer], {
              type: "audio/wav",
            });
            console.log("WAV Blob Size (bytes):", wavBlob.size);

            // Send WAV data to the server
            const response = await fetch(API_URL, {
              method: "POST",
              headers: { "Content-Type": "audio/wav" },
              body: wavBlob,
            });

            if (response.ok) {
              const transcriptionText = await response.text();
              console.log("Transcription received:", transcriptionText);
              setTranscription((prev) => `${prev}\n${transcriptionText}`);
            } else {
              console.error("Server responded with:", response.status);
            }
          } catch (error) {
            console.error("Error processing audio data:", error);
          }
        };

        // Function to create a WAV header
        const createWavHeader = ({
          sampleRate,
          numChannels,
          byteRate,
          blockAlign,
          bitsPerSample,
          dataSize,
        }) => {
          const header = new ArrayBuffer(44);
          const view = new DataView(header);

          // RIFF chunk descriptor
          view.setUint32(0, 0x52494646, false); // "RIFF"
          view.setUint32(4, 36 + dataSize, true); // File size - 8 bytes
          view.setUint32(8, 0x57415645, false); // "WAVE"

          // fmt subchunk
          view.setUint32(12, 0x666d7420, false); // "fmt "
          view.setUint32(16, 16, true); // Subchunk size (16 for PCM)
          view.setUint16(20, 1, true); // Audio format (1 for PCM)
          view.setUint16(22, numChannels, true); // Number of channels
          view.setUint32(24, sampleRate, true); // Sample rate
          view.setUint32(28, byteRate, true); // Byte rate
          view.setUint16(32, blockAlign, true); // Block align
          view.setUint16(34, bitsPerSample, true); // Bits per sample

          // data subchunk
          view.setUint32(36, 0x64617461, false); // "data"
          view.setUint32(40, dataSize, true); // Data size

          return header;
        };

        mediaRecorder.start();
        console.log("Microphone enabled and recording started.");
      } catch (error) {
        console.error("Failed to enable the microphone:", error.message);
      }
    } else {
      console.log("Disabling microphone...");

      // Stop recording
      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
        console.log("Recording stopped.");
      }

      // Stop microphone stream
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
        setMediaStream(null);
      }
    }
  };

  // Function to trim silence from PCM data
  const trimSilence = (pcmData, threshold) => {
    let startIndex = 0;
    let endIndex = pcmData.length - 1;

    // Find the first index above the threshold
    while (
      startIndex < pcmData.length &&
      Math.abs(pcmData[startIndex]) <= threshold
    ) {
      startIndex++;
    }

    // Find the last index above the threshold
    while (endIndex > startIndex && Math.abs(pcmData[endIndex]) <= threshold) {
      endIndex--;
    }

    // Return the trimmed data
    return pcmData.slice(startIndex, endIndex + 1);
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
      <div>
        <h3>Live Transcription:</h3>
        <p>{transcription}</p>
      </div>
      {audioURL && (
        <div>
          <h3>Download Audio:</h3>
          <a href={audioURL} download="recording.webm">
            Download Recorded Audio
          </a>
        </div>
      )}
    </div>
  );
};

export default SwitchMicButton;
