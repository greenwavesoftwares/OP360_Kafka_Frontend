import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";

const PasswordChangeForm = ({ currentUser }) => {
  const [password, setPassword] = useState("");
  const toast = useRef(null);

  const passwordSubmitHandler = () => {
    console.log(password);

    handlePasswordUpdate({ userId: currentUser.userId, password });
  };

  const handlePasswordUpdate = (user) => {
    const changePassword = async () => {
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(user),
      };

      await fetch("http://localhost:8082/usermodule/changepassword", options)
        .then((resp) => resp.json())
        .then((data) => {
          if (data.success) {
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: "Password changed successfully!",
            });
          } else {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: `Error: ${data.message}`,
            });
          }
        })
        .catch((error) => {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: `Error: ${error.message}`,
          });
        });
    };
    changePassword();
  };

  const renderChangePassword = () => {
    return (
      <div>
        <label htmlFor="password" style={{ fontSize: "2rem" }}>
          Password
        </label>
        <Password
          id="password"
          placeholder="Enter new password"
          onChange={(event) => {
            console.log(event.target.value);
            setPassword(event.target.value);
          }}
          feedback={false}
          toggleMask
        />
        <Button
          label="Confirm"
          onClick={passwordSubmitHandler}
          className="p-mt-3"
        />
      </div>
    );
  };

  return (
    <div className="p-d-flex p-jc-center">
      <Toast ref={toast} />
      <Card title="Change Password" style={{ width: "30rem" }}>
        {renderChangePassword()}
      </Card>
    </div>
  );
};

export default PasswordChangeForm;
