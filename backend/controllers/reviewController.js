const db = require('../db');

exports.getReviews = async (req, res) => {
  const { productId } = req.params;
  try {
    const [reviews] = await db.query(
      `SELECT
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        u.name AS user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC`,
      [productId]
    );
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching reviews.' });
  }
};

exports.addReview = async (req, res) => {
  const userId = req.user.userId;
  const { productId, rating, comment } = req.body;

  try {
    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required.' });
    }

    const [result] = await db.query(
      'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)',
      [userId, productId, rating, comment]
    );

    res.status(201).json({ message: 'Review added successfully!', reviewId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding review.' });
  }
};