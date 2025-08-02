const express = require('express');
const { submitSupportForm } = require('../controllers/supportController');

const router = express.Router();

router.post('/', submitSupportForm);

module.exports = router;