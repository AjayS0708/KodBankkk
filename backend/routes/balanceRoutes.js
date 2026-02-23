const express = require('express');
const { checkBalance } = require('../controllers/balanceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/check-balance', protect, checkBalance);

module.exports = router;
