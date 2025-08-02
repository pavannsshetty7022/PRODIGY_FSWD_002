import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';

function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage('');
    setIsError(false);

    try {
      const response = await axios.post('http://localhost:5000/api/support', formData);
      setResponseMessage(response.data.message);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setIsError(true);
      setResponseMessage(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4">
          Contact Support
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 3 }}>
          Have a question or need assistance? Fill out the form below.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Your Name"
            name="name"
            autoFocus
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Your Email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="message"
            label="Your Message"
            multiline
            rows={4}
            id="message"
            value={formData.message}
            onChange={handleChange}
          />
          {responseMessage && (
            <Alert severity={isError ? "error" : "success"} sx={{ mt: 2 }}>
              {responseMessage}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Send Message'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default SupportPage;