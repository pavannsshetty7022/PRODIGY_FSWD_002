const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password, phone_number } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.query(
  'INSERT INTO users (name, email, password_hash, phone_number) VALUES (?, ?, ?, ?)',
  [fullName, email, hashedPassword, phone_number]
);
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email or phone number already registered.' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { phone_number, password } = req.body;

  try {
    const [users] = await db.query('SELECT * FROM users WHERE phone_number = ?', [phone_number]);
    const user = users[0];

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Logged in successfully!', token, userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};