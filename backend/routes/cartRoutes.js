
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController'); 
const auth = require('../middleware/auth');

router.get('/', auth, cartController.getCartItems);
router.post('/add', auth, cartController.addToCart);
router.put('/update', auth, cartController.updateCartItem); // This line should now match the controller function
router.delete('/remove', auth, cartController.removeFromCart);

module.exports = router;