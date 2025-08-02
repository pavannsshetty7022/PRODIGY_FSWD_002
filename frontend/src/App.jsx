import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import OrderListPage from './pages/OrderListPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import SupportPage from './pages/SupportPage';
import PrivateRoutes from './components/PrivateRoutes';

function App() {
  return (
    <Router>
      <Box>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <ProductListingPage />
              </>
            }
          />
          <Route path="/products/:productId" element={<ProductDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/support" element={<SupportPage />} />

          <Route element={<PrivateRoutes />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrderListPage />} />
            <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
          </Route>
        </Routes>
      </Box>
    </Router>
  );
}

export default App;