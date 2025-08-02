const express = require('express');
const { getReviews, addReview } = require('../controllers/reviewController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/:productId', getReviews);
router.post('/', auth, addReview);

module.exports = router;