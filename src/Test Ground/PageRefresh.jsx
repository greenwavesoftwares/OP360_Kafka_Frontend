import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

function useConfirmationOnNavigation(message) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPromptVisible, setIsPromptVisible] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = message;
    };

    const handleRouteChange = (event) => {
      if (isPromptVisible) {
        const userConfirmed = window.confirm(message);
        if (userConfirmed) {
          setIsPromptVisible(false);
          return;
        } else {
          event.preventDefault();
          return;
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    const unlisten = navigate.listen((location, action) => {
      handleRouteChange({ preventDefault: () => {} });
    });

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      unlisten();
    };
  }, [isPromptVisible, message, navigate]);

  return (showPrompt) => setIsPromptVisible(showPrompt);
}

function Home() {
  const prompt = useConfirmationOnNavigation("Are you sure you want to leave?");

  useEffect(() => {
    prompt(true);
    return () => prompt(false);
  }, [prompt]);

  return (
    <div>
      <h1>Home Page</h1>
      <p>
        Try navigating away or refreshing the page to see the confirmation
        dialog.
      </p>
      <Link to="/about">Go to About Page</Link>
    </div>
  );
}

function About() {
  const prompt = useConfirmationOnNavigation("Are you sure you want to leave?");

  useEffect(() => {
    prompt(true);
    return () => prompt(false);
  }, [prompt]);

  return (
    <div>
      <h1>About Page</h1>
      <p>
        Try navigating away or refreshing the page to see the confirmation
        dialog.
      </p>
      <Link to="/">Go to Home Page</Link>
    </div>
  );
}

function PageRefresh() {
  return <></>;
}

export default PageRefresh;
