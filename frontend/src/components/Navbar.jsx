import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Slide,
  Badge, // Added Badge for cart count
  Menu, // Added Menu for user dropdown
  MenuItem, // Added MenuItem for user dropdown
  InputBase, // Added InputBase for search bar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NotificationsIcon from '@mui/icons-material/Notifications';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import axios from 'axios';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [themeMode, setThemeMode] = useState('light'); // State for theme toggle
  const [userMenuAnchor, setUserMenuAnchor] = useState(null); // State for user dropdown menu
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Set initial theme from localStorage or default
    const savedTheme = localStorage.getItem('theme') || 'light';
    setThemeMode(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    if (token) {
      const userId = localStorage.getItem('userId');
      if (userId) {
        axios.get(`http://localhost:5000/api/users/${userId}`)
          .then(response => {
            setUserName(response.data.name);
          })
          .catch(error => {
            console.error("Failed to fetch user details:", error);
          });
      }
    } else {
      setUserName('');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUserName('');
    navigate('/login');
    setUserMenuAnchor(null);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleThemeToggle = () => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}`);
      setSearchTerm('');
    }
  };

  const handleUserMenuClick = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const drawerList = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/support">
          <ListItemText primary="Support" />
        </ListItem>
        {isLoggedIn && (
          <>
            <ListItem button component={Link} to="/cart">
              <ListItemText primary="Cart" />
            </ListItem>
            <ListItem button component={Link} to="/profile">
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}
        {!isLoggedIn && (
          <ListItem button component={Link} to="/login">
            <ListItemText primary="Login" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <Slide appear={false} direction="down" in={true}>
        <AppBar position="sticky" sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          color: 'black',
          transition: 'all 0.3s',
          '&.dark-mode': {
            backgroundColor: 'rgba(30, 30, 30, 0.8)',
            color: 'white',
          },
        }} className={themeMode === 'dark' ? 'dark-mode' : ''}>
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box
              component={Link}
              to="/"
              sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            >
              <img
                src="/images/localbasket-logo.png"
                alt="LocalBasket Logo"
                style={{ height: '80px', marginRight: '10px' }}
              />
            </Box>

            {!isMobile && (
              <>
                {/* Search Bar */}
                <Box
                  component="form"
                  onSubmit={handleSearch}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    borderRadius: 2,
                    p: '2px 4px',
                    mr: 2,
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    }
                  }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1, color: 'inherit' }}
                    placeholder="Search for products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <IconButton type="submit" color="inherit">
                    <SearchIcon />
                  </IconButton>
                </Box>

                {/* Category Dropdown (Placeholder) */}
                <Button color="inherit" endIcon={<KeyboardArrowDownIcon />} sx={{ mr: 2 }}>
                    Categories
                </Button>
                
                {/* Quick Link - Top Deals */}
                <Button color="inherit" component={Link} to="/top-deals" sx={{ mr: 2 }}>
                    Top Deals
                </Button>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {/* Notification Bell */}
                  <IconButton color="inherit" sx={{ mr: 1 }}>
                    <NotificationsIcon />
                  </IconButton>

                  {/* Cart with Badge */}
                  <IconButton color="inherit" component={Link} to="/cart">
                    <Badge badgeContent={3} color="error">
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>

                  {/* User Profile Dropdown */}
                  {isLoggedIn ? (
                    <>
                      <Button
                        color="inherit"
                        aria-controls="user-menu"
                        aria-haspopup="true"
                        onClick={handleUserMenuClick}
                        endIcon={<KeyboardArrowDownIcon />}
                        sx={{ textTransform: 'none' }}
                      >
                        <PersonIcon sx={{ mr: 1 }} />
                        {userName ? `Hello, ${userName.split(' ')[0]}` : 'Profile'}
                      </Button>
                      <Menu
                        id="user-menu"
                        anchorEl={userMenuAnchor}
                        keepMounted
                        open={Boolean(userMenuAnchor)}
                        onClose={handleUserMenuClose}
                      >
                        <MenuItem onClick={() => { navigate('/profile'); handleUserMenuClose(); }}>Profile</MenuItem>
                        <MenuItem onClick={() => { navigate('/orders'); handleUserMenuClose(); }}>My Orders</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                      </Menu>
                    </>
                  ) : (
                    <Button color="inherit" component={Link} to="/login">
                      Login
                    </Button>
                  )}
                  
                  {/* Theme Toggle Button */}
                  <IconButton color="inherit" onClick={handleThemeToggle} sx={{ ml: 1 }}>
                    {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                  </IconButton>
                </Box>
              </>
            )}
          </Toolbar>
          <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
            {drawerList}
          </Drawer>
        </AppBar>
      </Slide>
      {/* Optional: Add a simple global style for dark mode */}
      <style>{`
        body[data-theme='dark'] {
          background-color: #121212;
          color: #e0e0e0;
        }
      `}</style>
    </>
  );
}

export default Navbar;