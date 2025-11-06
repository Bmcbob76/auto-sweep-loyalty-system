const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Reward = require('../models/Reward');
const Sweepstakes = require('../models/Sweepstakes');
const cron = require('node-cron');

class LoyaltyService {
  // Award points for purchase
  async awardPoints(userId, amount, transactionId) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      // Calculate points (1 point per dollar, with tier bonuses)
      let pointsMultiplier = 1;
      switch (user.tier) {
      case 'silver': pointsMultiplier = 1.1; break;
      case 'gold': pointsMultiplier = 1.25; break;
      case 'platinum': pointsMultiplier = 1.5; break;
      case 'diamond': pointsMultiplier = 2; break;
      }

      const pointsEarned = Math.floor(amount * pointsMultiplier);
      user.loyaltyPoints += pointsEarned;
      user.totalSpent += amount;
      
      // Check and update tier
      const oldTier = user.tier;
      user.updateTier();
      await user.save();

      // Update transaction
      if (transactionId) {
        await Transaction.findByIdAndUpdate(transactionId, {
          pointsEarned,
          status: 'completed'
        });
      }

      // Check if tier changed
      const tierUpgrade = oldTier !== user.tier;

      return {
        pointsEarned,
        totalPoints: user.loyaltyPoints,
        tier: user.tier,
        tierUpgrade
      };
    } catch (error) {
      console.error('Award points error:', error);
      throw error;
    }
  }

  // Redeem reward
  async redeemReward(userId, rewardId) {
    try {
      const user = await User.findById(userId);
      const reward = await Reward.findById(rewardId);

      if (!user) throw new Error('User not found');
      if (!reward || !reward.isActive) throw new Error('Reward not available');
      if (user.loyaltyPoints < reward.pointsCost) {
        throw new Error('Insufficient points');
      }

      // Check tier eligibility
      if (reward.tier !== 'all' && reward.tier !== user.tier) {
        throw new Error('Tier requirement not met');
      }

      // Deduct points
      user.loyaltyPoints -= reward.pointsCost;
      await user.save();

      // Create transaction
      const transaction = new Transaction({
        user: userId,
        type: 'reward_redemption',
        amount: reward.value || 0,
        pointsSpent: reward.pointsCost,
        paymentMethod: 'card',
        status: 'completed',
        description: `Redeemed: ${reward.name}`,
        metadata: { rewardId: reward._id }
      });
      await transaction.save();

      // Update reward stock if applicable
      if (reward.stockQuantity !== undefined) {
        reward.stockQuantity -= 1;
        if (reward.stockQuantity <= 0) {
          reward.isActive = false;
        }
        await reward.save();
      }

      return {
        success: true,
        reward,
        remainingPoints: user.loyaltyPoints,
        transaction
      };
    } catch (error) {
      console.error('Redeem reward error:', error);
      throw error;
    }
  }

  // Enter sweepstakes
  async enterSweepstakes(userId, sweepstakesId, entryCount = 1) {
    try {
      const user = await User.findById(userId);
      const sweepstakes = await Sweepstakes.findById(sweepstakesId);

      if (!user) throw new Error('User not found');
      if (!sweepstakes) throw new Error('Sweepstakes not found');
      if (sweepstakes.status !== 'active') {
        throw new Error('Sweepstakes not active');
      }

      const totalPointsCost = sweepstakes.entryCost.points * entryCount;
      const totalAmountCost = sweepstakes.entryCost.amount * entryCount;

      // Check if user has enough points
      if (sweepstakes.entryMethod === 'points' || sweepstakes.entryMethod === 'both') {
        if (user.loyaltyPoints < totalPointsCost) {
          throw new Error('Insufficient points');
        }
        user.loyaltyPoints -= totalPointsCost;
      }

      // Add entries
      sweepstakes.addEntry(userId, entryCount);
      user.sweepstakesEntries += entryCount;

      await user.save();
      await sweepstakes.save();

      // Create transaction if points were used
      if (totalPointsCost > 0) {
        const transaction = new Transaction({
          user: userId,
          type: 'sweepstakes_entry',
          amount: totalAmountCost,
          pointsSpent: totalPointsCost,
          paymentMethod: 'card',
          status: 'completed',
          description: `Entered: ${sweepstakes.title} (${entryCount} entries)`,
          metadata: { sweepstakesId: sweepstakes._id }
        });
        await transaction.save();
      }

      return {
        success: true,
        entriesAdded: entryCount,
        totalEntries: sweepstakes.entries.find(e => 
          e.user.toString() === userId.toString()
        )?.entryCount || 0,
        remainingPoints: user.loyaltyPoints
      };
    } catch (error) {
      console.error('Enter sweepstakes error:', error);
      throw error;
    }
  }

  // Select random winners
  async selectWinners(sweepstakesId) {
    try {
      const sweepstakes = await Sweepstakes.findById(sweepstakesId).populate('entries.user');
      if (!sweepstakes) throw new Error('Sweepstakes not found');

      const winners = [];
      const allEntries = [];

      // Create weighted pool of entries
      sweepstakes.entries.forEach(entry => {
        for (let i = 0; i < entry.entryCount; i++) {
          allEntries.push(entry.user);
        }
      });

      // Select winners for each prize
      sweepstakes.prizes.forEach(prize => {
        for (let i = 0; i < prize.quantity; i++) {
          if (allEntries.length === 0) break;

          const randomIndex = Math.floor(Math.random() * allEntries.length);
          const winner = allEntries[randomIndex];
          
          winners.push({
            user: winner._id,
            prize: prize.name,
            announcedAt: new Date()
          });

          // Remove winner from pool (optional - remove if multiple wins allowed)
          allEntries.splice(randomIndex, 1);
        }
      });

      sweepstakes.winners = winners;
      sweepstakes.status = 'winners_announced';
      await sweepstakes.save();

      return winners;
    } catch (error) {
      console.error('Select winners error:', error);
      throw error;
    }
  }

  // Automated tier check and upgrade notifications
  checkTierUpgrades() {
    // This would be called periodically or after point updates
    return async (userId) => {
      const user = await User.findById(userId);
      const oldTier = user.tier;
      user.updateTier();
      
      if (oldTier !== user.tier) {
        await user.save();
        // Send notification (email, messenger, etc.)
        return { upgraded: true, newTier: user.tier };
      }
      return { upgraded: false };
    };
  }

  // Initialize automated tasks
  initializeAutomation() {
    // Daily check for sweepstakes that need winner selection
    cron.schedule('0 0 * * *', async () => {
      console.log('Running daily sweepstakes check...');
      const endedSweepstakes = await Sweepstakes.find({
        status: 'active',
        endDate: { $lt: new Date() },
        isAutomatic: true
      });

      for (const sweepstakes of endedSweepstakes) {
        sweepstakes.status = 'ended';
        await sweepstakes.save();
        
        // Auto-select winners if enabled
        if (sweepstakes.isAutomatic) {
          await this.selectWinners(sweepstakes._id);
        }
      }
    });

    // Check for upcoming sweepstakes
    cron.schedule('0 0 * * *', async () => {
      console.log('Checking upcoming sweepstakes...');
      const upcomingSweepstakes = await Sweepstakes.find({
        status: 'upcoming',
        startDate: { $lte: new Date() }
      });

      for (const sweepstakes of upcomingSweepstakes) {
        sweepstakes.status = 'active';
        await sweepstakes.save();
      }
    });

    console.log('Loyalty automation initialized');
  }
}

module.exports = new LoyaltyService();
