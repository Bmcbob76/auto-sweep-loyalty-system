const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  pointsCost: {
    type: Number,
    required: true
  },
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'all'],
    default: 'all'
  },
  category: {
    type: String,
    enum: ['discount', 'freebie', 'cashback', 'exclusive_access', 'sweepstakes_bonus'],
    required: true
  },
  value: {
    type: Number
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expirationDays: {
    type: Number,
    default: 30
  },
  stockQuantity: {
    type: Number
  },
  usageLimit: {
    type: Number,
    default: 1
  },
  imageUrl: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reward', rewardSchema);
