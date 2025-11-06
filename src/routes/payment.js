const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

// All payment routes require authentication
router.use(authenticate);

router.post('/process', paymentController.processPayment);
router.get('/transactions', paymentController.getTransactions);

// Webhook route (no authentication needed)
router.post('/webhook/stripe', express.raw({ type: 'application/json' }), paymentController.stripeWebhook);

module.exports = router;
