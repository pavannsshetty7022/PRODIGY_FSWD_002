const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/profileController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getUserProfile);
router.put('/', auth, updateUserProfile);

module.exports = router;