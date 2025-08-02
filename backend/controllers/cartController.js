const db = require('../db');

exports.getCartItems = async (req, res) => {
    const userId = req.user.userId;

    try {
        const [cartItems] = await db.query(
            `SELECT c.product_id, c.quantity, p.name, p.price, p.image_url
             FROM cart c
             JOIN products p ON c.product_id = p.id
             WHERE c.user_id = ?`,
            [userId]
        );
        res.status(200).json(cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching cart items.' });
    }
};

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { product_id, quantity = 1 } = req.body;

    const [existingItem] = await db.query(
      'SELECT quantity FROM cart WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    );

    if (existingItem.length > 0) {
      const newQuantity = existingItem[0].quantity + quantity;
      await db.query(
        'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
        [newQuantity, userId, product_id]
      );
    } else {
      await db.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, product_id, quantity]
      );
    }

    res.status(201).json({ message: 'Product added to cart successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding to cart.' });
  }
};

exports.updateCartItem = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { product_id, quantity } = req.body;

        if (quantity <= 0) {
            await db.query('DELETE FROM cart WHERE user_id = ? AND product_id = ?', [userId, product_id]);
        } else {
            await db.query('UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?', [quantity, userId, product_id]);
        }

        res.status(200).json({ message: 'Cart updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating cart.' });
    }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { product_id } = req.body;

    await db.query('DELETE FROM cart WHERE user_id = ? AND product_id = ?', [userId, product_id]);

    res.status(200).json({ message: 'Product removed from cart.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error removing from cart.' });
  }
};