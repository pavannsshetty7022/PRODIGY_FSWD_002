import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

function OrderListPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchOrders = async () => {
    if (!token) {
      setError('Please log in to view your orders.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (err) {
      setError('Failed to fetch orders.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
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
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary">You have no past orders.</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Orders
      </Typography>
      <Box>
        {orders.map((order) => (
          <Card 
            key={order.id} 
            sx={{ mb: 2, cursor: 'pointer' }} 
            component={Link} 
            to={`/orders/${order.id}`}
            style={{ textDecoration: 'none' }}
          >
            <CardContent>
              <Typography variant="h6">Order #{order.id}</Typography>
              <Typography color="text.secondary">Status: {order.status}</Typography>
              <Typography color="text.secondary">Date: {new Date(order.created_at).toLocaleDateString()}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
}

export default OrderListPage;