import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardMedia, CardContent, Button, Box, IconButton, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

const fetchCartItems = async () => {
    if (!token) {
        setError('Please log in to view your cart.');
        setLoading(false);
        return;
    }

    try {
        const response = await axios.get('http://localhost:5000/api/cart', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setCartItems(response.data);
    } catch (err) {
        setError('Failed to fetch cart items.');
        console.error(err);
    } finally {
        setLoading(false);
    }
};

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await axios.put(
        'http://localhost:5000/api/cart/update',
        { product_id: productId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCartItems();
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await axios.delete(
        'http://localhost:5000/api/cart/remove',
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { product_id: productId }
        }
      );
      fetchCartItems();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    try {
      await axios.post(
        'http://localhost:5000/api/orders',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

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

  if (cartItems.length === 0) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary">Your cart is empty.</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Shopping Cart
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {cartItems.map(item => (
            <Card key={item.product_id} sx={{ display: 'flex', mb: 2 }}>
              <CardMedia
                component="img"
                sx={{ width: 100 }}
                image={`/images/${item.image_url}`}
                alt={item.name}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Typography component="div" variant="h6">{item.name}</Typography>
                  <Typography variant="subtitle1" color="text.secondary" component="div">
                    ${item.price}
                  </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                  <IconButton onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)} size="small">
                    <RemoveIcon />
                  </IconButton>
                  <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                  <IconButton onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)} size="small">
                    <AddIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleRemoveItem(item.product_id)} sx={{ ml: 'auto' }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Card>
          ))}
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Cart Summary
            </Typography>
            <Typography variant="h6">
              Total: ${calculateTotal()}
            </Typography>
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleCheckout}>
              Checkout
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CartPage;