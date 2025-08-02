import React, { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, Button, Box, CardActionArea, IconButton, Modal, Backdrop, Fade, Badge } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaStar, FaPlus, FaMinus, FaEye } from 'react-icons/fa';
import './ProductCard.css';

function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [openModal, setOpenModal] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to add items to the cart.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/cart/add',
        { product_id: product.id, quantity: quantity }, // Use the quantity state
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

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleQuickViewOpen = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenModal(true);
  };

  const handleQuickViewClose = () => {
    setOpenModal(false);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          color={i <= rating ? '#ffc107' : '#e4e5e9'}
        />
      );
    }
    return stars;
  };

  const isInStock = product.stock > 0;

  return (
    <Card className="product-card">
      <CardActionArea component={Link} to={`/products/${product.id}`} className="card-media-wrapper">
        <CardMedia
          component="img"
          image={`/images/${product.image_url}`}
          alt={product.name}
          className="product-image"
        />
        <IconButton className="wishlist-icon">
          <FaHeart />
        </IconButton>
        <IconButton className="quick-view-icon" onClick={handleQuickViewOpen}>
          <FaEye />
        </IconButton>
      </CardActionArea>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div" className="product-title">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" className="product-description">
          {product.description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          {renderStars(product.rating)}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="h6" color="primary" className="product-price">
            ${product.price}
          </Typography>
          <Badge
            className={`stock-badge ${isInStock ? 'in-stock' : 'out-of-stock'}`}
          >
            {isInStock ? `In Stock: ${product.stock}` : 'Out of Stock'}
          </Badge>
        </Box>
      </CardContent>

      <CardActions sx={{ mt: 'auto', flexDirection: 'column' }}>
        <Box className="quantity-selector">
          <IconButton onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
            <FaMinus />
          </IconButton>
          <Typography variant="body1">{quantity}</Typography>
          <IconButton onClick={() => handleQuantityChange(1)}>
            <FaPlus />
          </IconButton>
        </Box>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={handleAddToCart}
          disabled={!isInStock}
          sx={{ mt: 1, width: '100%' }}
        >
          Add to Cart
        </Button>
      </CardActions>
      
      {/* Quick View Modal */}
      <Modal
        aria-labelledby="quick-view-title"
        aria-describedby="quick-view-description"
        open={openModal}
        onClose={handleQuickViewClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
            <Typography id="quick-view-title" variant="h6" component="h2">
              {product.name}
            </Typography>
            <Typography id="quick-view-description" sx={{ mt: 2 }}>
              {product.description}
            </Typography>
            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
              Price: ${product.price}
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </Card>
  );
}

export default ProductCard;