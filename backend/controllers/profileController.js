const db = require('../db');

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const [users] = await db.query('SELECT id, name, phone_number, email FROM users WHERE id = ?', [userId]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = users[0];

    const [addresses] = await db.query('SELECT * FROM addresses WHERE user_id = ?', [userId]);
    user.addresses = addresses;

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching user profile.' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, email, phone_number } = req.body;

    await db.query('UPDATE users SET name = ?, email = ?, phone_number = ? WHERE id = ?', [name, email, phone_number, userId]);

    res.status(200).json({ message: 'User profile updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating user profile.' });
  }
};