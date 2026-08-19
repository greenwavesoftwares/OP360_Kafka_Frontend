import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container } from "@mui/material";
import React from "react";

const BlankPage = () => {
  return (
    <>
      <Container maxWidth="lg" sx={{ padding: "0 !important" }}>
        <h1>Upcoming.....</h1>
        <FontAwesomeIcon icon="fa-solid fa-calendar-check" />
      </Container>
    </>
  );
};
export default BlankPage;
