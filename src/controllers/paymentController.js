const paymentService = require('../services/paymentService');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class PaymentController {
  // Process payment
  async processPayment(req, res) {
    try {
      const { amount, paymentMethod, paymentData, description } = req.body;
      const userId = req.userId;

      let result;

      switch (paymentMethod) {
        case 'stripe':
          result = await paymentService.processStripePayment(userId, amount, description);
          break;
        case 'paypal':
          result = await paymentService.processPayPalPayment(userId, amount, description);
          break;
        case 'square':
          result = await paymentService.processSquarePayment(userId, amount, paymentData.sourceId, description);
          break;
        case 'chime':
        case 'cashapp':
        case 'venmo':
        case 'zelle':
          result = await paymentService.processAlternativePayment(userId, amount, paymentMethod, paymentData, description);
          break;
        case 'crypto':
          result = await paymentService.processCryptoPayment(userId, amount, paymentData.currency, description);
          break;
        default:
          return res.status(400).json({ error: 'Invalid payment method' });
      }

      res.json({
        message: 'Payment initiated',
        transaction: result.transaction,
        paymentIntent: result.paymentIntent || result.payment
      });
    } catch (error) {
      console.error('Process payment error:', error);
      res.status(500).json({ error: 'Payment processing failed' });
    }
  }

  // Stripe webhook
  async stripeWebhook(req, res) {
    try {
      const sig = req.headers['stripe-signature'];
      let event;

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        return res.status(400).json({ error: 'Webhook signature verification failed' });
      }

      await paymentService.handleStripeWebhook(event);
      res.json({ received: true });
    } catch (error) {
      console.error('Stripe webhook error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  // Get user transactions
  async getTransactions(req, res) {
    try {
      const Transaction = require('../models/Transaction');
      const { page = 1, limit = 20 } = req.query;

      const transactions = await Transaction.find({ user: req.userId })
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const count = await Transaction.countDocuments({ user: req.userId });

      res.json({
        transactions,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      });
    } catch (error) {
      console.error('Get transactions error:', error);
      res.status(500).json({ error: 'Failed to get transactions' });
    }
  }
}

module.exports = new PaymentController();
