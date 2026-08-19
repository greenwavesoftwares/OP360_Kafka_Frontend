import { Dialog } from "primereact/dialog";
import { useEffect, useRef, useState } from "react";
import UserDetails from "./UserDetails";
//import PasswordChangeForm from "./PasswordChange"
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import Notification from "./Notification";
import { Box, Card, Container, Tab, Tabs } from "@mui/material";
//icon
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LockResetIcon from "@mui/icons-material/LockReset";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { Message } from "primereact/message";
import { useNavigate } from "react-router-dom";
import { decryptTokenId } from "../helper/AuthService";
import {
  changeUserPassword,
  checkOldPassword,
  getUserDetailsByUserID,
} from "../UserModuleUpdated/UsermoduleApi";
import { createUser } from "../UserModuleUpdated/helper";
import { FloatLabel } from "primereact/floatlabel";

export default function UserHomeDashboard() {
  const [currentUser, setCurrentUser] = useState({});
  const [content, setContent] = useState();
  const [transactions, setTransactions] = useState([]);
  // let [password, setPassword] = useState("");
  const toast = useRef(null);

  // const [userId, setUserId] = useState(localStorage.getItem("username"));
  const [value, setValue] = useState(0);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const REACT_APP_USERMODULE=process.env.REACT_APP_USERMODULE
  const env_userId = process.env.REACT_APP_USERID;
  // const env_tenantId = process.env.REACT_APP_TENANTID;
  const user = localStorage.getItem(env_userId);
  const current_Admin = decryptTokenId(user);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const navigate = useNavigate();
  const getCurrentUser = () => {
    const env_userId = process.env.REACT_APP_USERID;

    const user = localStorage.getItem(env_userId);
    const current_Admin = decryptTokenId(user);
    return current_Admin;
  };

  // useEffect(() => {
  //   // setCurrentUser({ userId: localStorage.getItem("username") });

  //   //================GET USER ID FROM SESSION STORAGE THEN PASS IT===================//

  //   let userID = '';

  //   if (localStorage) {

  //     userID = decryptTokenId(localStorage.getItem(process.env.REACT_APP_USERID));

  //     setUserId(userID);

  //   }

  //   const fetchUserDetailsByUserId = async () => {
  //     const options = {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     };

  //     await fetch(
  //       `${REACT_APP_USERMODULE}/usermodule/userbyuseridandtenantid/`+userID+"/"+decryptTokenId(localStorage.getItem(process.env.REACT_APP_TENANTID)),
  //       options
  //     )
  //       .then((resp) => resp.json())
  //       .then((data) => {
  //         console.log("userbyuseri", data);

  //         setCurrentUser(data);

  //         console.log(currentUser);

  //         setContent(
  //           <UserDetails user={data} transactions={transactions} />
  //         );
  //       })
  //       .catch((e) => {
  //         navigate("/");
  //       });
  //   };

  //   fetchUserDetailsByUserId();
  // }, []);

  // useEffect(() => {
  //   const options = {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     },
  //   };

  //   const getTransactions = async () => {
  //     await fetch(
  //       `${REACT_APP_USERMODULE}/usermodule/gettransactionbyuserid?userId=` +
  //         userId,
  //       options
  //     )
  //       .then((resp) => resp.json())
  //       .then((data) => {
  //         console.log(data);

  //         setTransactions(data);

  //         console.log("transactions", transactions);
  //       })
  //       .catch((e) => {
  //         navigate("/");
  //       });
  //   };

  //   getTransactions();
  // }, []);

  // const passwordSubmitHandler = () => {

  //   console.log("setPassword", password);

  //   // toast.current.show({
  //   //   severity: "success",
  //   //   summary: "Password Change",
  //   //   detail: currentUser.userId,
  //   // });
  //   handlePasswordUpdate({ userId: currentUser.userId, password: password });
  // };

  // const handlePasswordUpdate = (e) => {
  //   e.preventDefault();

  //   const changePassword = async () => {
  //     const options = {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     };

  //     console.log(newPassword, confirmPassword);

  //     if (newPassword !== confirmPassword) {
  //       toast.current.show({
  //         severity: "error",
  //         summary: "Password Change",
  //         detail: "password did not match",
  //       });

  //       return;
  //     }

  //     await fetch(
  //       `http://localhost:8082/usermodule/changepassworduserdashboard?userId=${userId}&oldPassword=${oldPassword}&newPassword=${newPassword}`,
  //       options
  //     )
  //       .then((resp) => resp.json())
  //       .then((data) => {
  //         console.log("changepassword", data);

  //         console.log(data);

  //         if (data && data.status_code === 200) {
  //         } else {
  //         }
  //       })
  //       .catch((e) => {
  //         navigate("/");
  //       });
  //   };
  //   changePassword();
  // };

  // const passwordUpdateHandler = () => {
  //   const options = {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     },
  //   };
  //   const oldPassword = document.getElementById("oldPassword").value; // Ensure you have an input with id 'oldPassword'
  //   const newPassword = document.getElementById("newPassword").value; // Ensure you have an input with id 'newPassword'
  //   if (!oldPassword) {
  //     toast.current.show({
  //       severity: "error",
  //       summary: "Error",
  //       detail: "Old password is required",
  //       life: 3000,
  //     });
  //     return; // Stop execution if oldPassword is invalid
  //   }

  //   if (!newPassword) {
  //     toast.current.show({
  //       severity: "error",
  //       summary: "Error",
  //       detail: "New password is required",
  //       life: 3000,
  //     });
  //     return; // Stop execution if newPassword is invalid
  //   }

  //   console.log("userinfo", userId, oldPassword, newPassword);

  //   const update = async () => {
  //     await fetch(
  //       `${REACT_APP_USERMODULE}/usermodule/changepassworduserdashboard?userId=${userId}&oldPassword=${oldPassword}&newPassword=${newPassword}`,
  //       options
  //     )
  //       .then((resp) => resp.json())
  //       .then((data) => {
  //         console.log("=====Change=====", data);
  //         if (data.status_code == 200) {
  //           toast.current.show({
  //             severity: "success",
  //             summary: "Success",
  //             detail: "Password updated successfully",
  //             life: 3000,
  //           });
  //           setTimeout(() => {
  //             window.location.href = "/"; // Redirect to the login page
  //           }, 1000);
  //         } else {
  //           toast.current.show({
  //             severity: "error",
  //             summary: "Error",
  //             detail: "Failed to update password. Please try again",
  //             life: 3000,
  //           });
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error updating password:", error);
  //         toast.current.show({
  //           severity: "error",
  //           summary: "Error",
  //           detail: "Failed to update password",
  //           life: 3000,
  //         });
  //       });
  //   };

  //   update();
  // };
  // const handlePasswordChange = (e) => {
  //   const pswrd = e.target.value;
  //   console.log("Current input value:", pswrd);
  //   setOldPassword(pswrd);
  //   console.log("oldpassword", oldPassword);
  // };

  // useEffect(() => {
  //   console.log("Updated", newPassword); // Log after state has been updated
  // }, [newPassword]);

  useEffect(() => {
    console.log("UseEffect() called for UserHomeDashboard  ");
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    const userData = await getUserDetailsByUserID(current_Admin);
    console.log("User Details from API ", userData);
    if (userData) {
      setCurrentUser(userData);
      setContent(<UserDetails user={userData} />);
    }
  };

  const handleChangePassword = async () => {
    console.log("handleChangePassword() called ");
    console.log("Old Password : ", oldPassword);
    const isOldPasswordVerified = await checkOldPassword(oldPassword);
    console.log("isOldPasswordVerified", isOldPasswordVerified);
    if (isOldPasswordVerified) {
      console.log(
        "Old Password is verified now the new Password Change will get invoked"
      );
      if (newPassword !== confirmPassword) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Please  enter the same password in both fields",

          life: 3000,
        });
      } else {
        console.log(
          "New Password and Confirm Password are same now the API call will get invoked"
        );
        const user = createUser(getCurrentUser(), "", newPassword);
        const isPasswordChanged = changeUserPassword(user);
        if (isPasswordChanged) {
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Password updated successfully",
            life: 3000,
          });
          setConfirmPassword("");
          setNewPassword("");
          setOldPassword("");
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Please  enter the same password in both fields",

            life: 3000,
          });
        }
      }
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Old Password not matching!",

        life: 3000,
      });
    }
  };

  const renderChangePassword = () => {
    return (
      <div>
        {/* <div className="p-d-flex p-jc-center p-ai-center p-flex-column">
          <Toast ref={toast} />
          {/* <Form className="p-fluid"> */}

        {/* <div className="p-field">
              <label htmlFor="oldPassword">Old Password</label>
              <InputText
                id="oldPassword"
                value={oldPassword}
                type="password" 
                onChange={(e) => {
                 
                  setOldPassword(e.target.value);
                  
                  console.log(e.target.value);

                }}  
                toggleMask
              />
            </div>

            <div className="p-field">
              <label htmlFor="newPassword">New Password</label>
              <Password
                id="newPassword"
                value={newPassword}
                required
                onChange={(e) => setNewPassword(e.target.value)}
                promptLabel="Enter a new password"
                weakLabel="Weak"
                mediumLabel="Medium"
                strongLabel="Strong"
                toggleMask
              />
            </div>

            <div className="p-field">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <Password
                id="confirmPassword"
                value={confirmPassword}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                feedback={false}
                toggleMask
              />
            </div>

            <Button
              style={{ marginTop: "1rem" }}
              type="submit"
              label="Change Password"
              className="p-mt-2"
              onClick={handlePasswordUpdate} */}
        {/* />  */}
        {/* </Form> */}
        {/* </div> */}

        {/* <div>
          <label htmlFor="username" style={{ fontSize: "2rem" }}>
            Password
          </label>

          <InputText
            placeholder="enter new password"
            onChange={(event) => {

          //  setPassword(event.target.value);

              console.log(event.target.value);

              password = event.target.value;

              console.log(password);

            }}
          ></InputText>

          <Button label="Confirm" onClick={passwordSubmitHandler}></Button>
        </div> */}

        {/* <div
          className="card"
          style={{ display: "grid", justifyItems: "center" }}
        >
          <div className="flex flex-wrap align-items-center mb-3 mt-3 gap-2">
            <label htmlFor="oldPassword" className="p-sr-only">
              Old Password
            </label>
            {oldPassword}
            <InputText
              required
              id="oldPassword"
              placeholder="Old Password"
              // className="p-invalid mr-2 p-inputtext-sm"
              toggleMask
              value={oldPassword}
              //onChange={handlePasswordChange}
              onChange={(e) => {
                let pswrd = e.target.value;
                console.log(pswrd);

                setOldPassword(pswrd);

                // oldPassword = pswrd;
              }}
            /> */}

        {/* {oldPassword ? null : (
              <Message severity="error" text="Old password is required" />
            )} */}
        {/* </div> */}

        {/* <div className="flex flex-wrap align-items-center mb-3 gap-2">
            <label htmlFor="new password" className="p-sr-only">
              New Password
            </label>
            <InputText
              id="newPassword"
              placeholder="New Password"
              required
              // className={`mr-2 p-inputtext-sm ${
              //   newPassword ? "" : "p-invalid"
              // }`}
              onChange={(e) => {
                console.log("Event: ", e); // Logs the entire event object
                console.log("Event target value: ", e.target.value); // Logs the specific value entered
                let pswrd = e.target.value.trim();
                setNewPassword(pswrd);
              }}
              value={newPassword}
            /> */}

        {/* {newPassword ? null : (
              <Message severity="error" text="New password is required" />
            )} */}
        {/* </div> */}

        {/* <div className="flex flex-wrap align-items-center mb-3 gap-2">
            <label htmlFor="username" className="p-sr-only">
              Confirm Password
            </label>
            <InputText
              id="confirmPassword"
              placeholder="Confirm Password"
              // className={`mr-2 p-inputtext-sm ${
              //   confirmPassword ? "" : "p-invalid"
              // }`}
              onChange={(e) => {
                let pswrd = e.target.value.trim();
                setConfirmPassword(pswrd); // Setting confirmPassword state

                console.log("Confirm Password:", pswrd); // Log the trimmed value instead of the state
              }}
              value={confirmPassword}
            /> */}

        {/* {confirmPassword ? null : (
              <Message severity="error" text="Confirm password is required" />
            )} */}
        {/* </div> */}

        <FloatLabel>
          <Password
            id="oldPassword"
            value={oldPassword}
            feedback={false} // Disable password strength feedback if not needed
            invalid={oldPassword === ""}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Old Password"
          />
          <label htmlFor="oldPassword">Old Password</label>
        </FloatLabel>

        <FloatLabel>
          <Password
            id="newPassword"
            value={newPassword}
            feedback={false}
            invalid={newPassword === ""}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
          />
          <label htmlFor="newPassword">New Password</label>
        </FloatLabel>

        <FloatLabel>
          <Password
            id="confirmPassword"
            value={confirmPassword}
            feedback={false}
            invalid={confirmPassword === ""}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
          />
          <label htmlFor="confirmPassword">Confirm Password</label>
        </FloatLabel>

        <div className="flex flex-wrap align-items-center mb-3 gap-2">
          <label htmlFor="bt" className="p-sr-only">
            Submit
          </label>
          <Button
            id="bt"
            rounded
            size="small"
            icon="pi pi-lock"
            severity="success"
            placeholder="Confirm Password"
            label="Change Password"
            className="p-invalid mr-2"
            onClick={handleChangePassword}
          />

          {/* {newPassword !== confirmPassword ? null : (
              <Message severity="error" text="Passwords must match" />
            )} */}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* <Toast ref={toast} /> */}
      <Container maxWidth="lg">
        <Card sx={{ padding: "0.8rem" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Toast ref={toast} style={{ zIndex: "9999" }} />
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="icon position tabs example"
            >
              <Tab
                sx={{ textTransform: "capitalize", minHeight: "0" }}
                icon={<ManageAccountsIcon />}
                iconPosition="start"
                onClick={() =>
                  setContent(
                    <UserDetails
                      user={currentUser}
                      transactions={transactions}
                    />
                  )
                }
                label="Account Info"
              />
              <Tab
                sx={{ textTransform: "capitalize", minHeight: "0" }}
                icon={<LockResetIcon />}
                iconPosition="start"
                onClick={() => setContent(renderChangePassword)}
                label="Change Password"
              />
              <Tab
                sx={{ textTransform: "capitalize", minHeight: "0" }}
                icon={<NotificationsActiveIcon />}
                iconPosition="start"
                onClick={() => setContent(<Notification />)}
                label="Notifications"
              />
            </Tabs>
          </Box>

          {/* <Card
    onClick={() =>
      setContent(
        <UserDetails user={currentUser} transactions={transactions} />
      )
    }
    style={cardStyle}
  >
    <h2 style={{ position: "relative", bottom: 40, left: 150 }}>
      Account Info
    </h2>
    <i
      className="pi pi-user"
      style={{
        fontSize: "3rem",
        position: "relative",
        bottom: 90,
        left: 60,
      }}
    ></i>
    <p
      style={{
        position: "relative",
        bottom: 80,
        left: 150,
        fontWeight: 800,
      }}
    >
      View your account informations
    </p>
  </Card>

  <Card onClick={() => setContent(renderChangePassword)} style={cardStyle}>
    <h2 style={{ position: "relative", bottom: 40, left: 150 }}>
      Change Password
    </h2>

    <i
      className="pi pi-lock"
      style={{
        fontSize: "3rem",
        position: "relative",
        bottom: 90,
        left: 60,
      }}
    ></i>
    <p
      style={{
        position: "relative",
        bottom: 80,
        left: 150,
        fontWeight: 800,
      }}
    >
      Change your password and security key
    </p>
  </Card>

  <Card onClick={() => setContent(<Notification />)} style={cardStyle}>
    <h2 style={{ position: "relative", bottom: 40, left: 150 }}>
      Notifications
    </h2>

    <i
      className="pi pi-bell"
      style={{
        fontSize: "3rem",
        position: "relative",
        bottom: 90,
        left: 60,
      }}
    ></i>
    <p
      style={{
        position: "relative",
        bottom: 80,
        left: 150,
        fontWeight: 800,
      }}
    >
      Alerts and Notifications
    </p>
  </Card> */}

          <div>{content}</div>
        </Card>
      </Container>
    </>
  );
}
