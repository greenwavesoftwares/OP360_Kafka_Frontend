import React, { Component } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { withNavigation } from "./withNavigation"; // Import the HOC
import AutorenewIcon from "@mui/icons-material/Autorenew";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import LoginIcon from "@mui/icons-material/Login";
import { Result, Space, Tooltip } from "antd";

import ReplayIcon from "@mui/icons-material/Replay";
import {
  HomeOutlined,
  LoadingOutlined,
  RollbackOutlined,
  SettingFilled,
  SmileOutlined,
  SyncOutlined,
} from "@ant-design/icons";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by Error Boundary:", error, errorInfo);
  }

  // handleReload = () => {
  //     this.setState({ hasError: false });
  //     window.location.reload();
  //     // sessionStorage.clear();
  //     // localStorage.clear();

  // };

  handleGoBack = () => {
    this.setState({ hasError: false });
    this.props.navigate(-1); // Navigate Back
    // sessionStorage.clear();
    // localStorage.clear();
    // setTimeout(() => {
    //     window.location.reload();
    // }, 5);
  };

  handleGoHome = () => {
    this.setState({ hasError: false });
    this.props.navigate("/"); // Navigate Back
    sessionStorage.clear();
    const savedTenant = localStorage.getItem("savedTenant");
    localStorage.clear();
    if (savedTenant) localStorage.setItem("savedTenant", savedTenant);
  };

  render() {
    if (this.state.hasError) {
      return (
        //     <Box
        //     display="flex"
        //     justifyContent="center"
        //     alignItems="center"
        //     height="100vh"
        //     bgcolor="#f8f9fa"
        //     px={2}
        // >
        //     <Paper
        //         elevation={4}
        //         sx={{
        //             padding: "24px",
        //             maxWidth: "380px",
        //             textAlign: "center",
        //             borderRadius: "12px",
        //             backgroundColor: "white",
        //         }}
        //     >
        //         <ErrorOutlineIcon color="error" sx={{ fontSize: 50, mb: 1.5 }} />

        //         <Typography variant="h6" color="error" sx={{ fontWeight: "bold", mb: 1 }}>
        //             Oops! Something went wrong.
        //         </Typography>

        //         <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        //             We encountered an error. Please refresh the page or return to the homepage.
        //         </Typography>

        //         <Box display="flex" flexDirection="column" gap={1.5}>
        //             <Button
        //                 variant="contained"
        //                 color="primary"
        //                 onClick={this.handleReload}
        //                 sx={{
        //                     textTransform: "none",
        //                     borderRadius: "6px",
        //                     fontSize: "0.875rem",
        //                     fontWeight: "bold",
        //                     py: 1
        //                 }}
        //                 startIcon={<AutorenewIcon fontSize="small" />}
        //             >
        //                  Refresh Page
        //             </Button>

        //             <Button
        //                 variant="outlined"
        //                 color="secondary"
        //                 onClick={this.handleGoBack}
        //                 startIcon={<ReplyAllIcon fontSize="small" />}
        //                 sx={{
        //                     textTransform: "none",
        //                     borderRadius: "6px",
        //                     fontSize: "0.875rem",
        //                     fontWeight: "bold",
        //                     py: 1
        //                 }}
        //             >
        //                  Go Back
        //             </Button>

        //             <Button
        //                 variant="contained"
        //                 color="error"
        //                 onClick={this.handleGoHome}
        //                 startIcon={<LoginIcon fontSize="small" />}
        //                 sx={{
        //                     textTransform: "none",
        //                     borderRadius: "6px",
        //                     fontSize: "0.875rem",
        //                     fontWeight: "bold",
        //                     py: 1
        //                 }}
        //             >
        //                 Back to Login
        //             </Button>
        //         </Box>
        //     </Paper>
        // </Box>

        <Result
          status="500"
          // title="500"
          subTitle="Sorry, something went wrong."
          extra={
            <Space>
              {/* <Button type="primary"startIcon= >
                  Back Home
                </Button> */}
              <Tooltip title="Go Home">
                <HomeOutlined
                  style={{ fontSize: "16px", color: "#08c" }}
                  onClick={this.handleGoHome}
                />
              </Tooltip>
              <Tooltip title="Back">
                <RollbackOutlined
                  style={{ fontSize: "16px", color: "#08c" }}
                  onClick={() => {
                    this.handleGoBack();
                  }}
                />
              </Tooltip>
              <Tooltip title="Reload">
                <SyncOutlined
                  style={{ fontSize: "16px", color: "#08c" }}
                  onClick={() => window.location.reload()}
                />
              </Tooltip>
              {/* <Button type="primary" startIcon={<RollbackOutlined />} onClick={()=> {this.handleGoBack()}}>
                  Go Back
                </Button>
                <Button startIcon={<SyncOutlined  />}  type="primary" >
                  Refresh
                </Button> */}

              {/* <HomeOutlined />
    <SettingFilled />
    <SmileOutlined />
    <SyncOutlined spin />
    <SmileOutlined rotate={180} />
    <LoadingOutlined /> */}
            </Space>
          }
        />
      );
    }
    return this.props.children;
  }
}

export default withNavigation(ErrorBoundary);
