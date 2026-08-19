import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';

const StreamingText = ({ fullText, onDone, typingSpeed = 20 }) => {
  const [output, setOutput] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setOutput(prev => prev + fullText.charAt(i));
      i++;
      if (i >= fullText.length) {
        clearInterval(interval);
        onDone(); // notify parent to insert into full chat state
      }
    }, typingSpeed);
    return () => clearInterval(interval);
  }, [fullText, onDone, typingSpeed]);

  return (
    <Typography
      sx={{
        px: 2,
        py: 1,
        bgcolor: '#eeeeee',
        color: '#000',
        borderRadius: 2,
        display: 'inline-block',
        fontFamily: 'Roboto Mono',
        whiteSpace: 'pre-wrap',
      }}
    >
      {output}
    </Typography>
  );
};

export default StreamingText;