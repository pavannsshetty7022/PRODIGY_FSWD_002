import React from 'react';
import { Box, Typography } from '@mui/material';

function HeroSection() {
  return (
    <Box
      sx={{
        width: '100%',
        height: '400px',
        position: 'relative',
        textAlign: 'center',
        color: 'white',
        overflow: 'hidden',
      }}
    >
      <img
        src="/images/hero-image.jpg"
        alt="Hero Section"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(50%)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          Welcome to LocalBasket
        </Typography>
        <Typography variant="h5" sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          Your one-stop shop for local products.
        </Typography>
      </Box>
    </Box>
  );
}

export default HeroSection;