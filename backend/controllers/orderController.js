const db = require('../db');

exports.createOrder = async (req, res) => {
    const userId = req.user.userId;

    try {
        const [cartItems] = await db.query(
            'SELECT c.product_id, c.quantity, p.price FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?',
            [userId]
        );

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty. Cannot create an order.' });
        }

        const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

        // Assuming a temporary delivery_address_id for now
        const deliveryAddressId = 1;

        const [orderResult] = await db.query(
            'INSERT INTO orders (user_id, status, total_amount, delivery_address_id) VALUES (?, ?, ?, ?)',
            [userId, 'Pending', totalAmount, deliveryAddressId]
        );
        const orderId = orderResult.insertId;

        // Corrected: Include the price in the order_items insert
        const orderItemsValues = cartItems.map(item => [orderId, item.product_id, item.quantity, item.price]);

        await db.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?', [orderItemsValues]);

        await db.query('DELETE FROM cart WHERE user_id = ?', [userId]);

        res.status(201).json({ message: 'Order created successfully!', orderId });
    } catch (error) {
        console.error('Server error creating order:', error);
        res.status(500).json({ message: 'Server error creating order.' });
    }
};

exports.getUserOrders = async (req, res) => {
    const userId = req.user.userId;

    try {
        // Removed the reference to the non-existent 'created_at' column
        const [orders] = await db.query('SELECT id, status FROM orders WHERE user_id = ? ORDER BY id DESC', [userId]);
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching orders.' });
    }
};

exports.getOrderDetails = async (req, res) => {
  const userId = req.user.userId;
  const { orderId } = req.params;

  try {
    const [orders] = await db.query('SELECT id, status, created_at FROM orders WHERE id = ? AND user_id = ?', [orderId, userId]);

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const [orderItems] = await db.query(
      `SELECT
        oi.product_id,
        p.name,
        p.price,
        p.image_url,
        oi.quantity
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?`,
      [orderId]
    );

    const orderDetails = {
      ...orders[0],
      items: orderItems,
    };

    res.status(200).json(orderDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching order details.' });
  }
};