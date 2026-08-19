import React, { useState, useEffect, useRef } from 'react';
import {
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Box,
  CircularProgress,
  MenuItem,
  Typography
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { sendMessageToBot } from './chatApi'; // Import the sendMessageToBot function from the chatapi';

const logbooks = [
  { label: 'Daily Report', value: 29 },
  { label: 'Maintenance', value: 30 },
  { label: 'Inspection Q1', value: 31 },
  { label: 'Safety Check', value: 32 },
];

const ChatBotNew = () => {
  const [logbookId, setLogbookId] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! Select a logbook and ask your question.' }
  ]);
  const [messageHistory, setMessageHistory] = useState([
    { role: 'assistant', content: 'Hi! Select a logbook and ask your question.' }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !logbookId) return;

    const userMessage = { sender: 'user', text: input };
    const newUserMsgForGPT = { role: 'user', content: input };

    setMessages((prev) => [...prev, userMessage]);
    setMessageHistory((prev) => [...prev, newUserMsgForGPT]);
    setInput('');
    setLoading(true);

    try {
      const reply = await sendMessageToBot(logbookId, [...messageHistory, newUserMsgForGPT]);
      const botMessage = { sender: 'bot', text: reply };
      const gptMsg = { role: 'assistant', content: reply };

      setMessages((prev) => [...prev, botMessage]);
      setMessageHistory((prev) => [...prev, gptMsg]);
    } catch (err) {
      console.error('Error talking to bot', err);
      setMessages((prev) => [...prev, { sender: 'bot', text: '⚠️ Server error' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <Box sx={{ maxHeight: '80vh', overflowY: 'auto', marginTop: 2 }}>
      <TextField
        fullWidth
        select
        label="Select a Logbook"
        value={logbookId}
        onChange={(e) => setLogbookId(e.target.value)}
        sx={{ mb: 2 }}
      >
        {logbooks.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </TextField>

      <List sx={{ background: '#f5f5f5', height: '60vh', overflowY: 'auto' }}>
        {messages.map((msg, i) => (
          <ListItem key={i} sx={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: msg.sender === 'bot' ? 'orange' : 'blue' }}>
                {msg.sender === 'bot' ? '🤖' : '🙋‍♂️'}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={msg.text}
              sx={{
                maxWidth: '75%',
                bgcolor: msg.sender === 'user' ? '#1976d2' : '#e0e0e0',
                color: msg.sender === 'user' ? '#fff' : '#000',
                px: 2,
                py: 1,
                borderRadius: 2
              }}
            />
          </ListItem>
        ))}

        {loading && (
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'orange' }}>🤖</Avatar>
            </ListItemAvatar>
            <ListItemText>
              <Typography variant="body2">Typing...</Typography>
            </ListItemText>
          </ListItem>
        )}

        <div ref={messagesEndRef} />
      </List>

      <Box sx={{ display: 'flex', mt: 2 }}>
        <TextField
          fullWidth
          disabled={!logbookId}
          value={input}
          placeholder="Ask something..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <IconButton onClick={handleSend} disabled={!input || loading}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatBotNew;