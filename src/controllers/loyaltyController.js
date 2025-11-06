const loyaltyService = require('../services/loyaltyService');
const Reward = require('../models/Reward');
const User = require('../models/User');

class LoyaltyController {
  // Get user's loyalty info
  async getLoyaltyInfo(req, res) {
    try {
      const user = await User.findById(req.userId).select('-password');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        points: user.loyaltyPoints,
        tier: user.tier,
        totalSpent: user.totalSpent,
        sweepstakesEntries: user.sweepstakesEntries,
        tierBenefits: this.getTierBenefits(user.tier)
      });
    } catch (error) {
      console.error('Get loyalty info error:', error);
      res.status(500).json({ error: 'Failed to get loyalty info' });
    }
  }

  // Get tier benefits
  getTierBenefits(tier) {
    const benefits = {
      bronze: { multiplier: 1, description: 'Base tier - 1x points' },
      silver: { multiplier: 1.1, description: 'Silver tier - 1.1x points' },
      gold: { multiplier: 1.25, description: 'Gold tier - 1.25x points' },
      platinum: { multiplier: 1.5, description: 'Platinum tier - 1.5x points' },
      diamond: { multiplier: 2, description: 'Diamond tier - 2x points' }
    };
    return benefits[tier] || benefits.bronze;
  }

  // Get available rewards
  async getRewards(req, res) {
    try {
      const user = await User.findById(req.userId);
      const { category, tier } = req.query;

      const query = { isActive: true };
      if (category) query.category = category;
      if (tier) {
        query.$or = [{ tier: 'all' }, { tier }];
      } else {
        query.$or = [{ tier: 'all' }, { tier: user.tier }];
      }

      const rewards = await Reward.find(query).sort({ pointsCost: 1 });

      res.json({
        rewards,
        userPoints: user.loyaltyPoints,
        userTier: user.tier
      });
    } catch (error) {
      console.error('Get rewards error:', error);
      res.status(500).json({ error: 'Failed to get rewards' });
    }
  }

  // Redeem reward
  async redeemReward(req, res) {
    try {
      const { rewardId } = req.body;
      const result = await loyaltyService.redeemReward(req.userId, rewardId);

      res.json({
        message: 'Reward redeemed successfully',
        ...result
      });
    } catch (error) {
      console.error('Redeem reward error:', error);
      res.status(400).json({ error: error.message || 'Failed to redeem reward' });
    }
  }

  // Admin: Create reward
  async createReward(req, res) {
    try {
      const reward = new Reward(req.body);
      await reward.save();

      res.status(201).json({
        message: 'Reward created successfully',
        reward
      });
    } catch (error) {
      console.error('Create reward error:', error);
      res.status(500).json({ error: 'Failed to create reward' });
    }
  }

  // Admin: Update reward
  async updateReward(req, res) {
    try {
      const { id } = req.params;
      const reward = await Reward.findByIdAndUpdate(id, req.body, { new: true });

      if (!reward) {
        return res.status(404).json({ error: 'Reward not found' });
      }

      res.json({
        message: 'Reward updated successfully',
        reward
      });
    } catch (error) {
      console.error('Update reward error:', error);
      res.status(500).json({ error: 'Failed to update reward' });
    }
  }
}

module.exports = new LoyaltyController();
