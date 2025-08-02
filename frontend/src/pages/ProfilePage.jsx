import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, CircularProgress, Alert, Button } from '@mui/material';
import axios from 'axios';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You are not logged in.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch profile.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="warning">No user data found.</Alert>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Profile
      </Typography>
      <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
        <Typography variant="h6" component="p">
          Name: {user.name}
        </Typography>
        <Typography variant="h6" component="p" sx={{ mt: 2 }}>
          Phone: {user.phone_number}
        </Typography>
        {user.email && (
            <Typography variant="h6" component="p" sx={{ mt: 2 }}>
              Email: {user.email}
            </Typography>
        )}
        {user.addresses.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Addresses
            </Typography>
            {user.addresses.map((address, index) => (
              <Box key={index} sx={{ p: 2, border: '1px solid #f0f0f0', borderRadius: '4px', mt: 1 }}>
                <Typography>{address.address_line_1}, {address.address_line_2 && `${address.address_line_2}, `}{address.city} - {address.pincode}</Typography>
                <Typography>Landmark: {address.landmark}</Typography>
              </Box>
            ))}
          </Box>
        )}
        <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={() => navigate('/orders')}
        >
            View My Orders
        </Button>
      </Box>
    </Container>
  );
}

export default ProfilePage;