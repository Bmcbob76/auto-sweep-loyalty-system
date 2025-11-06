const mongoose = require('mongoose');

const sweepstakesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  prizes: [{
    name: String,
    value: Number,
    quantity: Number
  }],
  entryMethod: {
    type: String,
    enum: ['points', 'purchase', 'both', 'free'],
    default: 'points'
  },
  entryCost: {
    points: { type: Number, default: 0 },
    amount: { type: Number, default: 0 }
  },
  entries: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    entryCount: {
      type: Number,
      default: 1
    },
    entryDate: {
      type: Date,
      default: Date.now
    }
  }],
  winners: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    prize: String,
    announcedAt: Date
  }],
  status: {
    type: String,
    enum: ['upcoming', 'active', 'ended', 'winners_announced'],
    default: 'upcoming'
  },
  isAutomatic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Method to add entry
sweepstakesSchema.methods.addEntry = function(userId, count = 1) {
  const existingEntry = this.entries.find(e => e.user.toString() === userId.toString());
  if (existingEntry) {
    existingEntry.entryCount += count;
  } else {
    this.entries.push({ user: userId, entryCount: count });
  }
};

module.exports = mongoose.model('Sweepstakes', sweepstakesSchema);
