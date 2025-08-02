const express = require('express');
const { createOrder, getUserOrders, getOrderDetails } = require('../controllers/orderController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createOrder);
router.get('/', auth, getUserOrders);
router.get('/:orderId', auth, getOrderDetails);

module.exports = router;