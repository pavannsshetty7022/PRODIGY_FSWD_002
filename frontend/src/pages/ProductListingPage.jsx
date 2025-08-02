import React, { useState, useEffect } from 'react';
import { Grid, Typography, Container, Box, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

function ProductListingPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (category) {
        params.category = category;
      }
      if (sort) {
        params.sort = sort;
      }

      const response = await axios.get('http://localhost:5000/api/products', { params });
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, sort]); // This hook will now re-run whenever 'category' or 'sort' changes.

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

  // To show all categories, you can get unique categories from the fetched products
  const uniqueCategories = [...new Set(products.map(p => p.category))];

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Products
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel>Category</InputLabel>
            <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {uniqueCategories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel>Sort By</InputLabel>
            <Select value={sort} label="Sort By" onChange={(e) => setSort(e.target.value)}>
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="price_asc">Price: Low to High</MenuItem>
              <MenuItem value="price_desc">Price: High to Low</MenuItem>
              <MenuItem value="name_asc">Name: A-Z</MenuItem>
              <MenuItem value="name_desc">Name: Z-A</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Grid container spacing={4} justifyContent="center">
  {products.map((product) => (
    <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
      <ProductCard product={product} />
    </Grid>
  ))}
</Grid>
    </Container>
  );
}

export default ProductListingPage;