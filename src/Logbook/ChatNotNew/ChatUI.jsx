// src/ChatBot.js
import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  TextField,
  IconButton,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Box,
  Button,
  Card,
} from "@mui/material";
import ReactMarkdown from "react-markdown";

import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

import { Dropdown } from "primereact/dropdown";

import { sendMessageToBot } from "./chatApi";
import { getAllActiveFormInfo } from "../LogbookApi";
import { getUserDetailsByUserID } from "../../UserModuleUpdated/UsermoduleApi";
import { getCurrentUser } from "../../UserModuleUpdated/helper";
import { m } from "framer-motion";
import TypingIndicator from "./TypingIndicator";
import { Navigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
const ChatUI = () => {
  const [newCurrentUser, setnewCurrentUser] = React.useState(""); //state to show current user
  const [logbookOptions, setLogbookOptions] = useState([]);
  const [logbookId, setLogbookId] = useState(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcription, setTranscription] = useState("");
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", content: "Hi! How can I help you today? 🤖" },
  ]);

  // Load chat history from localStorage
  useEffect(() => {
    console.log("logbookId", logbookId);
    const saved = localStorage.getItem(`chatbot_messages_${logbookId}`);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([
        { sender: "bot", text: "Hi! How can I help you today? 🤖" },
      ]);
    }
  }, [logbookId]);
  useEffect(() => {
    fetchAllActiveForms();
    fetchUserDetailsByUserId();
  }, []);
  const fetchUserDetailsByUserId = async () => {
    const userid = getCurrentUser(); //Function which returns decrypted userid from session storage
    const userdetails = await getUserDetailsByUserID(userid); //Function to fetch user details by userid
    if (!userdetails) {
      return null;
    }

    const currentuser = userdetails.userName;
    if (!currentuser) {
      const savedTenant = localStorage.getItem("savedTenant");
      localStorage.clear(); // Clear the localStorage information
      if (savedTenant) localStorage.setItem("savedTenant", savedTenant); //keep the tenant

      Navigate("/"); // Navigate to the '/' page if currentuser is undefined
    } else {
      setnewCurrentUser(currentuser); //set username of the current user
    }
  };
  const fetchAllActiveForms = async () => {
    // console.log("fetchAllActiveForms() called");
    // const userID='info@greenwave.co.in'
    let userID = getCurrentUser();
    // userID = decryptTokenId(userID);
    // console.log("Current userID : ", userID);

    const userDetails = await getUserDetailsByUserID(userID);

    let currentUserGroupDetails = [];
    if (userDetails) {
      // setCurrentUser(userDetails);
      currentUserGroupDetails = userDetails.group.map((data) => {
        return data.groupID;
      });
    }

    let finalFormList = [];
    const allForms = await getAllActiveFormInfo();

    if (allForms) {
      allForms.forEach((logbook) => {
        if (
          currentUserGroupDetails.some(
            (data) => logbook.userGroup.split(",").includes(data), //* if the logbook contains groups as of the current user groups then include those logbooks
          )
          // || userDetails.department.deptId.trim().toLowerCase() === logbook.department.trim().toLowerCase()
        ) {
          finalFormList.push(logbook);
        }
      });
    }

    setLogbookOptions(finalFormList);
    // // console.log("Final Logbook forms :", finalFormList);
    // let map = new Map();
    // if (finalFormList) {
    //   finalFormList.forEach((form) => {
    //     // console.log("Form : ", form);
    //     map.set(form.formID, form);
    //   });

    //   console.log("My logbook map : ", map);
    //   // setAllActiveFormsMap(map);
    //   // console.log("Form Map : ", map);
    // }
  };
  const convertToInitials = (name) => {
    console.log("Name init : ", name);
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (
        parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase()
      );
    } else if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    } else {
      return "";
    }
  };
  // Save chat to localStorage and scroll
  useEffect(() => {
    if (logbookId) {
      localStorage.setItem(
        `chatbot_messages_${logbookId}`,
        JSON.stringify(messages),
      );
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, logbookId]);

  const handleSend = async () => {
    if (!input.trim() || !logbookId) return;

    const messageToSend = input.trim();
    setInput("");

    const userMessage = { role: "user", content: messageToSend };

    // Add user's message to messages
    setMessages((prev) => [...prev, { sender: "user", text: messageToSend }]);

    // Show "Analysing..." bot message
    setMessages((prev) => [
      ...prev,
      { sender: "analysing", text: "🔍 Analysing..." },
    ]);

    // Optional: update typing state
    setIsTyping(true);

    // Update chat history
    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory);

    // Get bot response
    await fetchBotResponse(logbookId, updatedHistory);
  };
  // const fetchBotResponse = async (logbookId, history) => {
  //   let streamedMessage = "";

  //   try {
  //     const reply = await sendMessageToBot(logbookId, history);

  //     const chunks = reply.split(""); // Simulate streaming by characters
  //     for (let i = 0; i < chunks.length; i++) {
  //       streamedMessage += chunks[i];
  //       setMessages((prev) => {
  //         const last = prev[prev.length - 1];
  //         const updated = [...prev];
  //         if (last?.sender === "streaming") updated.pop();
  //         return [...updated, { sender: "streaming", text: streamedMessage }];
  //       });
  //       await new Promise((res) => setTimeout(res, 20));
  //     }

  //     setMessages((prev) => {
  //       const updated = [...prev];
  //       if (updated[updated.length - 1]?.sender === "streaming") {
  //         updated.pop();
  //       }
  //       return [...updated, { sender: "bot", text: streamedMessage }];
  //     });

  //     const botMessage = { role: "assistant", content: streamedMessage };
  //     setChatHistory((prev) => [...prev, botMessage]);
  //   } catch (err) {
  //     const errMsg = err.message || "Connection failed.";
  //     setMessages((prev) => [...prev, { sender: "bot", text: errMsg }]);
  //     setChatHistory((prev) => [
  //       ...prev,
  //       { role: "assistant", content: errMsg },
  //     ]);
  //   }

  //   setIsTyping(false);
  // };
  const fetchBotResponse = async (logbookId, history) => {
    let streamedMessage = "";

    try {
      const reply = await sendMessageToBot(logbookId, history);

      // 🔥 Remove the "Analysing..." message
      setMessages((prev) => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];

        // Remove only if it's analysing
        if (lastMsg?.sender === "analysing") {
          updated.pop();
        }

        return updated;
      });

      const chunks = reply.split("");

      // 📤 Simulate streaming response
      for (let i = 0; i < chunks.length; i++) {
        streamedMessage += chunks[i];

        setMessages((prev) => {
          const updated = [...prev];

          if (updated[updated.length - 1]?.sender === "streaming") {
            updated.pop(); // Replace if already streaming
          }

          return [...updated, { sender: "streaming", text: streamedMessage }];
        });

        await new Promise((res) => setTimeout(res, 2));
      }

      // 💬 Push final bot message
      setMessages((prev) => {
        const updated = [...prev];

        if (updated[updated.length - 1]?.sender === "streaming") {
          updated.pop();
        }

        return [...updated, { sender: "bot", text: streamedMessage }];
      });

      // Save bot response in history
      const botMessage = { role: "assistant", content: streamedMessage };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (err) {
      const errMsg = err.message || "Connection failed.";

      // Clean up potential leftover "analysing" message
      setMessages((prev) => {
        const updated = [...prev];
        if (updated[updated.length - 1]?.sender === "analysing") {
          updated.pop();
        }
        return updated;
      });

      setMessages((prev) => [...prev, { sender: "bot", text: errMsg }]);

      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: errMsg },
      ]);
    }

    setIsTyping(false);
  };
  const handleClearChat = () => {
    if (logbookId) {
      localStorage.removeItem(`chatbot_messages_${logbookId}`);
    }
    setMessages([{ sender: "bot", text: "Hi! How can I help you today? 🤖" }]);
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser does not support Speech Recognition 😢");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setTranscription("Listening...");
    };

    recognition.onend = () => {
      setListening(false);
      setTranscription("");
    };

    recognition.onerror = (event) => {
      console.error("Speech error:", event.error);
      setListening(false);
      if (event.error === "not-allowed") alert("Microphone blocked.");
    };

    recognition.onresult = async (event) => {
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript && logbookId) {
        setTranscription("");
        setInput("");

        const userMessage = { role: "user", content: finalTranscript };
        const updatedHistory = [...chatHistory, userMessage];

        // 🍌 Add user message to the UI
        setMessages((prev) => [
          ...prev,
          { sender: "user", text: finalTranscript },
        ]);

        // 🍊 Show "Analysing..." message just like text input
        setMessages((prev) => [
          ...prev,
          { sender: "analysing", text: "🔍 Analysing..." },
        ]);

        setIsTyping(true);
        setChatHistory(updatedHistory);

        await fetchBotResponse(logbookId, updatedHistory);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ display: "flex", flexDirection: "column", marginTop: "0rem" }}
    >
      <Card>
        <div
          style={{
            background: "white",
            borderRadius: "8px 8px 0 0",
            //padding: "0.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #eaeef2",
              padding: "0.5rem 1rem",
            }}
          >
            <Typography sx={{ fontSize: "1.15rem" }} align="center">
              🤖 ChatBook
            </Typography>
            <Avatar
              sx={{
                width: 30,
                height: 30,
                background: "#DDEEE6",
                color: "black",
              }}
            >
              <Avatar
                sx={{
                  width: 35,
                  height: 35,
                  fontSize: "0.9rem",
                  background: "#4097FF",
                  color: "white",
                }}
              >
                {console.log("initaials : ", convertToInitials(newCurrentUser))}
                {convertToInitials(newCurrentUser)}
              </Avatar>
            </Avatar>
          </div>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.5rem",
            }}
          >
            <Dropdown
              value={logbookId}
              onChange={(e) => setLogbookId(e.value)}
              options={logbookOptions}
              optionLabel="formName"
              optionValue="formID"
              placeholder="Select Logbook"
              style={{ width: "200px" }}
            />
            <Button
              size="small"
              variant="contained"
              sx={{
                background: "#ff5722",
                boxShadow: "none",
                borderRadius: "2rem",
              }}
              onClick={handleClearChat}
              startIcon={<DeleteIcon />}
            >
              Clear Chat
            </Button>
          </Box>
        </div>
        <Paper
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            height: "65vh !important",
            // mb: 2,
            p: 2,
            bgcolor: "#EAEEF2",
            boxShadow: "none",
          }}
        >
          <List>
            {messages.map((msg, i) => (
              <ListItem
                key={i}
                sx={{
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                  flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: msg.sender === "bot" ? "#ffa726" : "#26c6da",
                    }}
                  >
                    {msg.sender === "bot" ||
                    msg.sender === "streaming" ||
                    msg.sender === "analysing"
                      ? "🤖"
                      : "👤"}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  disableTypography
                  sx={{
                    maxWidth: "100%",
                    bgcolor: msg.sender === "user" ? "#1976d2" : "#FFFFFF",
                    color: msg.sender === "user" ? "#fff" : "#000",
                    px: 2,
                    py: 1,
                    borderRadius:
                      msg.sender === "user"
                        ? "1.2rem 1.2rem 0rem 1.2rem"
                        : "1.2rem 1.2rem 1.2rem 0rem",
                    ml: msg.sender === "bot" ? 1 : 0,
                    mr: msg.sender === "user" ? 1 : 0,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    // margin: "0.3rem"
                  }}
                >
                  {msg.sender === "bot" ||
                  msg.sender === "streaming" ||
                  msg.sender === "analysing" ? (
                    <div style={{ color: "#000" }}>
                      {msg.sender === "analysing" ? (
                        <TypingIndicator text="Analysing" />
                      ) : (
                        <ReactMarkdown
                          components={{
                            p: ({ node, ...props }) => (
                              <p style={{ margin: "0.1rem" }} {...props} />
                            ),
                            li: ({ node, ...props }) => (
                              <li style={{ marginBottom: "8px" }} {...props} />
                            ),
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      )}
                    </div>
                  ) : (
                    msg.text
                  )}
                </ListItemText>
              </ListItem>
            ))}
          </List>
          <div ref={messagesEndRef} />
        </Paper>

        {transcription && (
          <Box sx={{ height: 35, width: "100%" }}>
            <DotLottieReact
              src="https://lottie.host/f0da09fd-3f53-4cb2-84bb-230ca093b217/UhOT3YE1ti.lottie"
              loop
              autoplay
            />
          </Box>
        )}

        <Box
          display="flex"
          gap={1}
          sx={{ background: "white", padding: "0.4rem" }}
        >
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder={
              logbookId
                ? "Type a message or use mic..."
                : "Select logbook to chat..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={!logbookId}
          />
          <IconButton
            onClick={startListening}
            color={listening ? "error" : "primary"}
            disabled={!logbookId}
            sx={{ background: "#eceff1", color: "#607d8b" }}
          >
            {listening ? <MicOffIcon /> : <MicIcon />}
          </IconButton>
          <IconButton
            onClick={handleSend}
            sx={{ background: "#e0f7fa", color: "#0097a7" }}
            disabled={!logbookId}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Card>
    </Container>
  );
};

export default ChatUI;
