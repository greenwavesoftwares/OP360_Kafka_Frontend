import React, { useMemo } from "react";
import { motion } from "framer-motion";
import Typography from "@mui/material/Typography";
import Greenwavelogo from "../Image/gw-logo.png";

const GreenwaveComponent = () => {
  const text = ""//"by Greenwave Solutions Pvt Ltd";

  // Animation variants for each letter
  const letterAnimation = {
    hidden: { opacity: 0, x: 20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        delay: i * 0.1, // Stagger each letter's animation
      },
    }),
  };

  // Memoized rendering of the animated component
  return useMemo(
    () => (
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {/* Animated Text */}
        <Typography sx={{ fontSize: "0.75rem", paddingLeft: ".15rem" }}>
          {text.split("").map((char, index) => (
            <motion.span
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              exit="hidden"
              // variants={letterAnimation}
              style={{ display: "inline-block" }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </Typography>

        {/* Animated Logo */}
        <motion.a
          href="https://www.greenwave.co.in"
          target="_blank"
          // initial={{ opacity: 0, scale: 0 }}
          animate={{
            // opacity: 1,
            // scale: 1,
            // transition: { duration: 0.5, ease: "easeInOut", delay: text.length * 0.1 },
          }}
        >
          {/* <img
            style={{ width: "30px", height: "30px" }}
            src={"/gw-logo.png"}
            alt="Greenwave Logo"
          /> */}
        </motion.a>
      </div>
    ),
    [text.length] // Dependencies: recompute only if text length changes
  );
};

export default GreenwaveComponent;
