import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography, Grid, CircularProgress, Alert, Rating, TextField, Button, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';

function ProductDetailsPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const fetchProductAndReviews = async () => {
    try {
      const productResponse = await axios.get(`http://localhost:5000/api/products/${productId}`);
      setProduct(productResponse.data);

      const reviewsResponse = await axios.get(`http://localhost:5000/api/reviews/${productId}`);
      setReviews(reviewsResponse.data);
    } catch (err) {
      setError('Failed to fetch product details or reviews.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductAndReviews();
  }, [productId]);

  const handleReviewChange = (e) => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(
        'http://localhost:5000/api/reviews',
        {
          productId: productId,
          ...reviewForm
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert('Review submitted successfully!');
      setReviewForm({ rating: 0, comment: '' });
      fetchProductAndReviews();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      alert('Please log in to add items to the cart.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/cart/add',
        { product_id: product.id, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response.data.message);
      alert('Item added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Product not found.'}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box>
            <img
              src={`/images/${product.image_url}`}
              alt={product.name}
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h3" component="h1" gutterBottom>{product.name}</Typography>
          <Typography variant="h4" color="primary" gutterBottom>${product.price}</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>{product.description}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>In Stock: {product.stock}</Typography>
          <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom>Customer Reviews</Typography>
        {isLoggedIn ? (
          <Box component="form" onSubmit={handleReviewSubmit} sx={{ mb: 4 }}>
            <Typography variant="h6">Write a review</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
              <Typography component="legend" sx={{ mr: 1 }}>Rating:</Typography>
              <Rating
                name="rating"
                value={reviewForm.rating}
                onChange={(event, newValue) => { setReviewForm({ ...reviewForm, rating: newValue }); }}
              />
            </Box>
            <TextField
              name="comment"
              label="Your comment"
              multiline
              rows={4}
              fullWidth
              value={reviewForm.comment}
              onChange={handleReviewChange}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" disabled={isSubmitting || !reviewForm.comment || reviewForm.rating === 0}>
              {isSubmitting ? <CircularProgress size={24} /> : 'Submit Review'}
            </Button>
          </Box>
        ) : (
          <Alert severity="info" sx={{ mb: 4 }}>
            <Typography>Please log in to write a review.</Typography>
          </Alert>
        )}

        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{review.user_name}</Typography>
                <Rating value={review.rating} readOnly size="small" />
                <Typography variant="body2" color="text.secondary">
                  {format(new Date(review.created_at), 'MMMM d, yyyy')}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {review.comment}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1">No reviews yet. Be the first!</Typography>
        )}
      </Box>
    </Container>
  );
}

export default ProductDetailsPage;