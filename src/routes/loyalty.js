const express = require('express');
const router = express.Router();
const loyaltyController = require('../controllers/loyaltyController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Customer routes
router.get('/info', authenticate, loyaltyController.getLoyaltyInfo);
router.get('/rewards', authenticate, loyaltyController.getRewards);
router.post('/rewards/redeem', authenticate, loyaltyController.redeemReward);

// Admin routes
router.post('/rewards', authenticate, isAdmin, loyaltyController.createReward);
router.put('/rewards/:id', authenticate, isAdmin, loyaltyController.updateReward);

module.exports = router;
