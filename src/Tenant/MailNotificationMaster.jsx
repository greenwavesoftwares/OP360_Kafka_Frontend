import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMailNotificationConfig,
  saveMailNotificationConfig,
  loginCheckBeforeTenant,
} from "./MailNotificationMasterApi";
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Slide,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";

const roles = ["Performer", "Activity Reviewer", "Job Reviewer"];

const defaultNotifications = [
  {
    mailType: "Upcoming Activity Reminder Mail",
    description:
      "Sends a one-time reminder email before an activity starts to help users prepare in advance.",
    to: "Performer",
    cc: [],
    interval: 0,
    enableNotification: false,
  },
  {
    mailType: "Job Start Delay",
    description:
      "Sends notifications when a job has not started on time. Alerts are repeated at regular intervals until the job is started.",
    to: "Job Reviewer",
    cc: [],
    interval: 0,
    enableNotification: false,
  },
  {
    mailType: "Activity Start Delay",
    description:
      "Sends notifications when an activity has not started as scheduled. Reminders continue at regular intervals until the activity begins.",
    to: "Performer",
    cc: [],
    interval: 0,
    enableNotification: false,
  },
  {
    mailType: "Activity Stop Delay",
    description:
      "Sends notifications when an activity is not completed within the expected time. Alerts are repeated until the activity is finished.",
    to: "Performer",
    cc: [],
    interval: 0,
    enableNotification: false,
  },
  {
    mailType: "Activity Review Pending",
    description:
      "Sends notifications when an activity is completed but still awaiting review. Reminders continue at regular intervals until the review is completed.",
    to: "Activity Reviewer",
    cc: [],
    interval: 0,
    enableNotification: false,
  },
  {
    mailType: "Job Review Pending",
    description:
      "Sends notifications when a job is pending review after completion. Alerts are repeated until the review process is finished.",
    to: "Job Reviewer",
    cc: [],
    interval: 0,
    enableNotification: false,
  },
  {
    mailType: "Job Completion Pending",
    description:
      "Sends notifications when a job is not completed within the expected time. Reminders continue at regular intervals until the job is completed.",
    to: "Job Reviewer",
    cc: [],
    interval: 0,
    enableNotification: false,
  },
];

const minimumInterval = 15;

const MailNotificationMaster = () => {
  const navigate = useNavigate();

  const [errorOpen, setErrorOpen] = useState(false); // To control error messages
  const [snackbarText, setSnackbarText] = useState(""); // Text for snackbar messages
  const [snackbarSeverity, setsnackbarSeverity] = useState(""); // Severity level of snackbar messages

  const [mailNotifications, setMailNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [isSubmitButtonDisabled, setSubmitButtonDisabled] = useState(true);
  const [mailConfigErrors, setMailConfigErrors] = useState({});

  const [wsOpen, setWsOpen] = useState(false);
  const [wsMessage, setWsMessage] = useState("");

  const [isFromDefault, setIsFromDefault] = useState(false);

  // useEffect(() => {
  //   const socket = new SockJS("http://localhost:8086/ws");

  //   const client = new Client({
  //     webSocketFactory: () => socket,
  //     reconnectDelay: 5000,
  //   });

  //   client.onConnect = () => {
  //     console.log("Connected to WebSocket");

  //     client.subscribe("/topic/notifications", (message) => {
  //       console.log("Received:", message.body);

  //       setWsMessage(message.body);
  //       setWsOpen(true);
  //     });
  //   };

  //   client.activate();

  //   return () => {
  //     client.deactivate();
  //   };
  // }, []);

  const handleClose = (event, reason) => {
    // This function hides the (Snackbar) error message when we click on it.
    if (reason === "clickaway") {
      // If we clicked away, do nothing.
      return;
    }
    setErrorOpen(false); // Otherwise, hide the (Snackbar) error message.
  };

  const handleClick = () => {
    // This function shows the error message.
    setErrorOpen(true); // Set the error message to open.
  };

  // 🔹 Load DB data and override default if exists
  useEffect(() => {
    checkLogin();
    loadMailNotificationConfig();
  }, []);

  useEffect(() => {
    const errors = {};
    let hasError = false;

    mailNotifications.forEach((item, index) => {
      const isToInvalid =
        item.enableNotification &&
        (!item.to || (Array.isArray(item.to) && item.to.length === 0));

      const isIntervalInvalid =
        item.enableNotification &&
        (!item.interval || item.interval < minimumInterval);

      if (isToInvalid || isIntervalInvalid) {
        hasError = true;
      }

      errors[index] = {
        to: isToInvalid,
        interval: isIntervalInvalid,
      };
    });

    setMailConfigErrors(errors);
    setSubmitButtonDisabled(hasError);
  }, [mailNotifications]);

  const checkLogin = async () => {
    const loginCheckBeforeTenantCheck = await loginCheckBeforeTenant();
    console.log("checkLogin called :: ", loginCheckBeforeTenantCheck);
    if (!loginCheckBeforeTenantCheck) {
      handleClick();
      setSnackbarText("Your Session has expired please login again");
      setsnackbarSeverity("error");

      // wait 3 seconds (3000 ms) before navigating
      setTimeout(() => {
        navigate("/"); // redirect to login page
      }, 3000);
    }
  };

  const loadMailNotificationConfig = async () => {
    checkLogin();
    try {
      setLoading(true);

      const data = await getMailNotificationConfig();

      if (data && data.length > 0) {
        const formatted = data.map((item) => ({
          ...item,
          to: item.to ? item.to.split(",").map((v) => v.trim()) : [],
          cc: item.cc ? item.cc.split(",").map((v) => v.trim()) : [],
        }));

        setMailNotifications(formatted);
        setIsFromDefault(false);
      } else {
        // 👉 Fallback to defaultNotifications (DO NOT mutate original)
        const defaultFormatted = defaultNotifications.map((item) => ({
          ...item,
          to: item.to ? [item.to] : [],
          cc: item.cc || [],
        }));

        setMailNotifications(defaultFormatted);
        setIsFromDefault(true);
      }
    } catch (error) {
      console.error("Error loading notification config", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...mailNotifications];
    updated[index][field] = value;
    setMailNotifications(updated);
  };

  const handleMultiSelect = (index, options) => {
    const values = Array.from(options, (option) => option.value);
    handleChange(index, "cc", values);
  };

  const handleSubmit = async () => {
    checkLogin();
    try {
      setSaving(true);

      // const payload = mailNotifications.map((item) => ({
      //   ...item,
      //   to: item.to ? Array.isArray(item.to) ? item.to.join(",") : item.to : null,
      //   cc: item.to ? Array.isArray(item.cc) ? item.cc.join(",") : item.cc : null,
      // }));

      const formatField = (field) => {
        if (!field) return null;
        if (Array.isArray(field)) {
          return field.length > 0 ? field.join(",") : null;
        }
        return field;
      };

      const payload = mailNotifications.map((item) => ({
        ...item,
        to: formatField(item.to),
        cc: formatField(item.cc),
      }));

      const response = await saveMailNotificationConfig(payload);

      if (response === true) {
        handleClick();
        setSnackbarText("Notification configuration saved successfully!");
        setsnackbarSeverity("success");
        setIsFromDefault(false);
      } else {
        handleClick();
        setSnackbarText(
          "Error occured while saving Notification configuration!",
        );
        setsnackbarSeverity("error");
      }
    } catch (error) {
      console.error("Error saving notification config", error);
      alert("Failed to save configuration.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ padding: "1rem !important" }}>
      <Card>
        <Box noValidate>
          <Typography
            sx={{ fontSize: "2rem", fontWeight: 600, margin: "1rem" }}
          >
            Mail Notification Master Configuration
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              m: 2,
              flexWrap: "wrap", // makes it responsive on small screens
            }}
          >
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={() => navigate("/")}
            >
              Home
            </Button>

            {isFromDefault && (
              <Alert severity="info" sx={{ flexGrow: 1 }}>
                Using default configuration. Please save to persist.
              </Alert>
            )}
          </Box>

          <Grid
            container
            spacing={2}
            style={{
              padding: "0 1rem",
            }}
            alignItems="stretch"
          >
            {loading && <p>Refreshing configuration from database...</p>}

            {mailNotifications.map((item, index) => {
              const isLastItem = index === mailNotifications.length - 1;
              const isOddLength = mailNotifications.length % 2 !== 0;
              return (
                // <Grid item xs={12} md={6} key={index}>
                <Grid
                  item
                  xs={12}
                  md={isOddLength && isLastItem ? 12 : 6}
                  key={index}
                  display={"flex"}
                >
                  <Card
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      boxShadow: 3,
                      opacity: item.enableNotification ? 1 : 0.6,
                      transition: "0.3s",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {item.mailType}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {item.description}
                    </Typography>

                    {/* Enable Notification */}
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={item.enableNotification}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "enableNotification",
                              e.target.checked,
                            )
                          }
                        />
                      }
                      label="Enable Notification"
                    />

                    {/* Interval */}
                    <TextField
                      fullWidth
                      type="number"
                      label="Interval (Minutes)"
                      size="small"
                      sx={{ mt: 2 }}
                      value={item.interval}
                      disabled={!item.enableNotification}
                      inputProps={{ min: minimumInterval }}
                      error={mailConfigErrors[index]?.interval}
                      helperText={
                        mailConfigErrors[index]?.interval
                          ? `Minimum interval is ${minimumInterval} minutes`
                          : ""
                      }
                      onChange={(e) =>
                        handleChange(index, "interval", e.target.value)
                      }
                      onBlur={(e) => {
                        const cleanedValue = parseInt(e.target.value, 10);

                        handleChange(
                          index,
                          "interval",
                          isNaN(cleanedValue) ? "" : cleanedValue,
                        );
                      }}
                    />

                    {/* To Multi Select */}
                    <FormControl
                      fullWidth
                      sx={{ mt: 2 }}
                      error={mailConfigErrors[index]?.to}
                    >
                      <InputLabel>To</InputLabel>
                      <Select
                        multiple
                        value={
                          item.to
                            ? Array.isArray(item.to)
                              ? item.to
                              : [item.to]
                            : []
                        }
                        onChange={(e) =>
                          handleChange(index, "to", e.target.value)
                        }
                        input={<OutlinedInput label="To" />}
                        disabled={!item.enableNotification}
                      >
                        {roles.map((role) => (
                          <MenuItem key={role} value={role}>
                            <Checkbox
                              checked={
                                item.to
                                  ? Array.isArray(item.to)
                                    ? item.to.includes(role)
                                    : item.to === role
                                  : false
                              }
                            />
                            {role}
                          </MenuItem>
                        ))}
                      </Select>

                      {mailConfigErrors[index]?.to && (
                        <FormHelperText>
                          At least one "To" role must be selected
                        </FormHelperText>
                      )}
                    </FormControl>

                    {/* CC Multi Select */}
                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <InputLabel>CC</InputLabel>
                      <Select
                        multiple
                        value={item.cc}
                        onChange={(e) =>
                          handleChange(index, "cc", e.target.value)
                        }
                        input={<OutlinedInput label="CC" />}
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}
                          >
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                        disabled={!item.enableNotification}
                      >
                        {roles.map((role) => (
                          <MenuItem key={role} value={role}>
                            <Checkbox checked={item.cc.includes(role)} />
                            {role}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          <Box sx={{ m: 2, display: "flex", justifyContent: "center" }}>
            {/* This box centers the submit button */}
            <Button
              disabled={isSubmitButtonDisabled}
              onClick={handleSubmit}
              variant="contained"
              color="success"
            >
              {saving ? "Saving..." : "Save Configuration"}
            </Button>
          </Box>
          {/* <button
              onClick={handleSubmit}
              disabled={saving}
              style={{
                padding: "10px 25px",
                background: saving ? "#888" : "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Saving..." : "Save Configuration"}
            </button> */}
          <Snackbar
            open={errorOpen} // Open state of the snackbar
            autoHideDuration={3000} // Time to hide automatically
            onClose={handleClose} // Function to call on close
            TransitionComponent={Slide} // Transition effect
            anchorOrigin={{ vertical: "top", horizontal: "right" }} // Position of the snackbar
          >
            <Alert
              onClose={handleClose} // Function to call on close
              severity={snackbarSeverity} // Type of alert (error, success, etc.)
              variant="filled" // Filled variant of the alert
              sx={{ width: "100%" }} // Full width of the alert
            >
              {snackbarText}
              {/* Message to display */}
            </Alert>
          </Snackbar>
          <Snackbar
            open={wsOpen}
            autoHideDuration={4000}
            onClose={() => setWsOpen(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert severity="info" variant="filled">
              {wsMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Card>
    </Container>
  );
};

export default MailNotificationMaster;
