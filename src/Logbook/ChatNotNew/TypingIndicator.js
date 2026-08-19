import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const TypingIndicator = ({ text = "Analysing" }) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.span
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.2, repeat: Infinity }}
      style={{
        fontStyle: "italic",
        fontWeight: 500,
        color: "#555",
        display: "inline-block",
      }}
    >
     {text==='Analysing'&&( `🔍 ${text}`)}
      {text==='Listening'&&( `🎙️ ${text}`)}
      {dots}
    </motion.span>
  );
};

export default TypingIndicator;