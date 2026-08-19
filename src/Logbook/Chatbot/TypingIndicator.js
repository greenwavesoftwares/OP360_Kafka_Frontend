// src/TypingIndicator.js
import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

const TypingIndicator = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Typography variant="body2" color="textSecondary" mt={1}>
      🤖 is typing{dots}
    </Typography>
  );
};

export default TypingIndicator;