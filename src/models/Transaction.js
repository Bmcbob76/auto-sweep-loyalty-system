const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['purchase', 'reward_redemption', 'points_adjustment', 'sweepstakes_entry'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  pointsSpent: {
    type: Number,
    default: 0
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'square', 'chime', 'cashapp', 'venmo', 'zelle', 'crypto', 'card'],
    required: true
  },
  paymentId: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  description: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index for efficient queries
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ status: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
