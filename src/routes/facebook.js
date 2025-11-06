const express = require('express');
const router = express.Router();
const facebookController = require('../controllers/facebookController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Webhook verification (GET)
router.get('/webhook', facebookController.verifyWebhook);

// Webhook events (POST)
router.post('/webhook', facebookController.handleWebhook);

// Admin routes
router.post('/group/post', authenticate, isAdmin, facebookController.postToGroup);

module.exports = router;
