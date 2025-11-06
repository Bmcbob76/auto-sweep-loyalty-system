const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Transaction = require('../models/Transaction');
const User = require('../models/User');

class PaymentService {
  // Stripe Payment
  async processStripePayment(userId, amount, description) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        description,
        metadata: { userId }
      });

      const transaction = await this.createTransaction({
        user: userId,
        type: 'purchase',
        amount,
        paymentMethod: 'stripe',
        paymentId: paymentIntent.id,
        description,
        status: 'pending'
      });

      return { paymentIntent, transaction };
    } catch (error) {
      console.error('Stripe payment error:', error);
      throw error;
    }
  }

  // PayPal Payment
  async processPayPalPayment(userId, amount, description) {
    // PayPal SDK implementation
    try {
      const transaction = await this.createTransaction({
        user: userId,
        type: 'purchase',
        amount,
        paymentMethod: 'paypal',
        description,
        status: 'pending'
      });

      return { transaction };
    } catch (error) {
      console.error('PayPal payment error:', error);
      throw error;
    }
  }

  // Square Payment
  async processSquarePayment(userId, amount, sourceId, description) {
    const { paymentsApi } = require('../config/square');
    
    try {
      const response = await paymentsApi.createPayment({
        sourceId,
        amountMoney: {
          amount: Math.round(amount * 100),
          currency: 'USD'
        },
        idempotencyKey: require('crypto').randomUUID()
      });

      const transaction = await this.createTransaction({
        user: userId,
        type: 'purchase',
        amount,
        paymentMethod: 'square',
        paymentId: response.result.payment.id,
        description,
        status: 'completed'
      });

      return { payment: response.result.payment, transaction };
    } catch (error) {
      console.error('Square payment error:', error);
      throw error;
    }
  }

  // Generic payment processor for alternative methods
  async processAlternativePayment(userId, amount, method, paymentData, description) {
    try {
      // Placeholder for Chime, CashApp, Venmo, Zelle integration
      // These would require their respective API implementations
      const transaction = await this.createTransaction({
        user: userId,
        type: 'purchase',
        amount,
        paymentMethod: method,
        description,
        status: 'pending',
        metadata: paymentData
      });

      return { transaction };
    } catch (error) {
      console.error(`${method} payment error:`, error);
      throw error;
    }
  }

  // Crypto Payment
  async processCryptoPayment(userId, amount, currency, description) {
    try {
      // Placeholder for crypto payment gateway (Coinbase Commerce, BitPay, etc.)
      const transaction = await this.createTransaction({
        user: userId,
        type: 'purchase',
        amount,
        paymentMethod: 'crypto',
        description,
        status: 'pending',
        metadata: { currency }
      });

      return { transaction };
    } catch (error) {
      console.error('Crypto payment error:', error);
      throw error;
    }
  }

  // Create transaction and award points
  async createTransaction(transactionData) {
    const transaction = new Transaction(transactionData);
    await transaction.save();
    return transaction;
  }

  // Complete transaction and award points
  async completeTransaction(transactionId) {
    try {
      const transaction = await Transaction.findById(transactionId);
      if (!transaction) throw new Error('Transaction not found');

      transaction.status = 'completed';
      
      // Calculate loyalty points (1 point per dollar spent)
      const pointsEarned = Math.floor(transaction.amount);
      transaction.pointsEarned = pointsEarned;

      await transaction.save();

      // Update user points and tier
      const user = await User.findById(transaction.user);
      user.loyaltyPoints += pointsEarned;
      user.totalSpent += transaction.amount;
      user.updateTier();
      await user.save();

      return { transaction, user };
    } catch (error) {
      console.error('Complete transaction error:', error);
      throw error;
    }
  }

  // Webhook handler for Stripe
  async handleStripeWebhook(event) {
    try {
      switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const transaction = await Transaction.findOne({ paymentId: paymentIntent.id });
        if (transaction) {
          await this.completeTransaction(transaction._id);
        }
        break;
      }
        
      case 'payment_intent.payment_failed': {
        const failedIntent = event.data.object;
        await Transaction.findOneAndUpdate(
          { paymentId: failedIntent.id },
          { status: 'failed' }
        );
        break;
      }
        
      default:
        console.log('Unhandled webhook event type:', event.type);
        break;
      }
    } catch (error) {
      console.error('Stripe webhook error:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService();
