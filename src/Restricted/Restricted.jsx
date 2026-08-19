import React from "react";
import { Chip, Typography, Box } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import ReplyIcon from "@mui/icons-material/Reply";
import { Link, useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import { Button, Result, Space } from "antd";

export default function Restricted() {
  const navigate = useNavigate();
  const savedTenantBackup = localStorage.getItem("savedTenant");
  return (
    //     <Box
    //       display="flex"
    //       flexDirection="column"
    //       alignItems="center"
    //       justifyContent="center"
    //       minHeight="100vh"
    //       bgcolor="#f0f0f0"
    //     >
    //       {/* <Typography variant="h4" fontStyle={"italic"} gutterBottom>
    //         Restricted Access
    //       </Typography> */}
    //       <Chip
    //         icon={<LockIcon />}
    //         label="Restricted Access"
    //         color="error"
    //         variant="filled"
    //         sx={{ fontSize: '1.2rem', padding: '10px 20px' }}
    //       />
    //        <div
    //         style={{
    //           display: "flex",
    //           justifyContent: "center",
    //           alignItems: "center",
    //           fontSize: "1.4rem",
    //         }}
    //       >
    //        <Link
    //   to="/"
    //   style={{
    //     margin: "14px",
    //     padding: "8px 16px",
    //     textAlign: "center",
    //     color: "white",
    //     backgroundColor: "#5CB338",
    //     borderRadius: "10px",
    //     textDecoration: "none",
    //     fontWeight: "100",
    //     display: "inline-flex",
    //     alignItems: "center",
    //     gap: "8px",
    //     cursor: "pointer",
    //   }}
    // >
    //   <LoginIcon fontSize="small" />
    //   Back to Login Page
    // </Link>

    //       </div>
    //     </Box>

    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <Space>
          <Button
            type="primary"
            onClick={() => {
              localStorage.clear();
              if (savedTenantBackup) {
                localStorage.setItem("savedTenant", savedTenantBackup);
              }
              navigate("/");
            }}
          >
            Back Login
          </Button>
          {/* <Button type="primary" onClick={()=>navigate(-1)}>Go Back</Button> */}
        </Space>
      }
    />
  );
}
