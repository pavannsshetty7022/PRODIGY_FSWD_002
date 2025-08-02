import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Card, CardContent, Grid, CardMedia } from '@mui/material';
import axios from 'axios';

function OrderDetailsPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!token) {
        setError('You must be logged in to view order details.');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrder(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch order details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, token]);

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

  if (!order) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5">Order not found.</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Order #{order.id}
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box>
            <Typography variant="h6">Status: {order.status}</Typography>
            <Typography variant="h6">Order Date: {new Date(order.created_at).toLocaleDateString()}</Typography>
            <Typography variant="h5" sx={{ mt: 3 }}>Order Items</Typography>
            {order.items.map((item) => (
              <Card key={item.product_id} sx={{ display: 'flex', mb: 2 }}>
                <CardMedia
                  component="img"
                  sx={{ width: 100 }}
                  image={`/images/${item.image_url}`}
                  alt={item.name}
                />
                <CardContent>
                  <Typography component="div" variant="h6">{item.name}</Typography>
                  <Typography variant="subtitle1" color="text.secondary">Price: ${item.price}</Typography>
                  <Typography variant="subtitle1" color="text.secondary">Quantity: {item.quantity}</Typography>
                  <Typography variant="subtitle1" color="primary">Total: ${(item.price * item.quantity).toFixed(2)}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Order Summary
            </Typography>
            <Typography variant="h6">
              Total Items: {order.items.reduce((sum, item) => sum + item.quantity, 0)}
            </Typography>
            <Typography variant="h6">
              Final Total: ${order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default OrderDetailsPage;