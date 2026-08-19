import { IconButton } from "@mui/material";
import { Affix } from "antd";
import React, { useEffect, useState } from "react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { motion } from "framer-motion";
import DownArrow from "./DownArrow";

export default function CustomScrollBottom() {
  const [visible, setVisible] = useState(false);

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Affix>
      {visible && (
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
          style={{
            position: "fixed",
            right: "2.8rem", // slightly above top button
            top: "1rem",
            zIndex: 1000,
          }}
        >
          <div onClick={scrollToBottom}>
            <DownArrow />
          </div>
        </motion.div>
      )}
    </Affix>
  );
}
