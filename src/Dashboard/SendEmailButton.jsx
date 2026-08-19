import React from "react";
import emailjs from "@emailjs/browser";
import styled from "styled-components";

// npm i @emailjs/browser

const SendEmailButton = () => {
  const sendEmail = () => {
    const templateParams = {
      from_name: "Ashok",
      subject: "Greetings",
      to_email: "suraj.shaw@greenwave.co.in",
      message: "Hey There Good Morning Buddy",
    };

    emailjs
      .send(
        "service_iv3q5u9",
        "template_xniijjn",
        templateParams,
        "TrAsUCJ0wVvWAw9zm"
      )
      .then(
        (result) => {
          console.log(result.text);
          alert("Message sent successfully!");
        },
        (error) => {
          console.log(error.text);
          alert("Failed to send message, please try again.");
        }
      );
  };

  return <StyledButton onClick={sendEmail}>Send Mail</StyledButton>;
};

export default SendEmailButton;

// Styles
const StyledButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background: rgb(249, 105, 14);
  color: white;
  border: none;
  border-radius: 5px;

  &:hover {
    background: rgb(200, 85, 12);
  }
`;
