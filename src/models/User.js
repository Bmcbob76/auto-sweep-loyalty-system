const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
    default: 'bronze'
  },
  facebookId: {
    type: String,
    unique: true,
    sparse: true
  },
  messengerPsid: {
    type: String,
    unique: true,
    sparse: true
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  sweepstakesEntries: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      messenger: { type: Boolean, default: true }
    },
    voiceEnabled: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update tier based on points
userSchema.methods.updateTier = function() {
  if (this.loyaltyPoints >= 10000) this.tier = 'diamond';
  else if (this.loyaltyPoints >= 5000) this.tier = 'platinum';
  else if (this.loyaltyPoints >= 2500) this.tier = 'gold';
  else if (this.loyaltyPoints >= 1000) this.tier = 'silver';
  else this.tier = 'bronze';
};

module.exports = mongoose.model('User', userSchema);
