const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');

const router = express.Router();

router.post('/register', [
    body('fullName').notEmpty().withMessage('Full Name is required.'),
    body('email').isEmail().withMessage('Please enter a valid email address.'),
    body('phone_number').isLength({ min: 10, max: 15 }).withMessage('Phone number must be between 10 and 15 digits.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
], register);

router.post('/login', [
    body('phone_number').isLength({ min: 10, max: 15 }).withMessage('Phone number must be between 10 and 15 digits.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
], login);

module.exports = router;