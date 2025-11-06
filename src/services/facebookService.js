const axios = require('axios');
const User = require('../models/User');

class FacebookService {
  constructor() {
    this.pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
    this.verifyToken = process.env.FACEBOOK_VERIFY_TOKEN;
    this.apiUrl = 'https://graph.facebook.com/v18.0';
  }

  // Verify webhook
  verifyWebhook(mode, token, challenge) {
    if (mode === 'subscribe' && token === this.verifyToken) {
      return challenge;
    }
    return null;
  }

  // Handle incoming messages
  async handleMessage(senderId, message) {
    try {
      // Find or create user based on messenger PSID
      let user = await User.findOne({ messengerPsid: senderId });
      
      const messageText = message.text ? message.text.toLowerCase() : '';

      // AI-powered response logic
      let response;
      if (messageText.includes('points') || messageText.includes('balance')) {
        response = await this.getPointsBalance(user);
      } else if (messageText.includes('rewards')) {
        response = await this.getAvailableRewards(user);
      } else if (messageText.includes('sweepstakes')) {
        response = await this.getSweepstakesInfo();
      } else if (messageText.includes('help')) {
        response = this.getHelpMessage();
      } else {
        response = this.getWelcomeMessage();
      }

      await this.sendMessage(senderId, response);
    } catch (error) {
      console.error('Handle message error:', error);
      await this.sendMessage(senderId, { text: 'Sorry, something went wrong. Please try again later.' });
    }
  }

  // Send message to user
  async sendMessage(recipientId, message) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/me/messages`,
        {
          recipient: { id: recipientId },
          message
        },
        {
          params: { access_token: this.pageAccessToken }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  }

  // Get points balance
  async getPointsBalance(user) {
    if (!user) {
      return { 
        text: 'Please register your account first to check your points balance.' 
      };
    }
    
    return {
      text: `Your current balance:\n💎 Points: ${user.loyaltyPoints}\n🏆 Tier: ${user.tier.toUpperCase()}\n💰 Total Spent: $${user.totalSpent.toFixed(2)}`
    };
  }

  // Get available rewards
  async getAvailableRewards(user) {
    const Reward = require('../models/Reward');
    const rewards = await Reward.find({ 
      isActive: true,
      $or: [
        { tier: 'all' },
        { tier: user ? user.tier : 'bronze' }
      ]
    }).limit(5);

    let text = '🎁 Available Rewards:\n\n';
    rewards.forEach(reward => {
      text += `• ${reward.name} - ${reward.pointsCost} points\n`;
    });
    text += '\nVisit our portal to redeem!';

    return { text };
  }

  // Get sweepstakes info
  async getSweepstakesInfo() {
    const Sweepstakes = require('../models/Sweepstakes');
    const activeSweepstakes = await Sweepstakes.find({ status: 'active' }).limit(3);

    let text = '🎰 Active Sweepstakes:\n\n';
    activeSweepstakes.forEach(sweep => {
      text += `• ${sweep.title}\n  Prize: ${sweep.prizes[0]?.name}\n  Ends: ${sweep.endDate.toLocaleDateString()}\n\n`;
    });

    return { text };
  }

  // Welcome message
  getWelcomeMessage() {
    return {
      text: 'Welcome to our Loyalty & Sweepstakes System! 🎉\n\nCommands:\n• "points" - Check balance\n• "rewards" - View rewards\n• "sweepstakes" - Active contests\n• "help" - Get help'
    };
  }

  // Help message
  getHelpMessage() {
    return {
      text: 'Available Commands:\n\n• "points" or "balance" - Check your points\n• "rewards" - View available rewards\n• "sweepstakes" - See active sweepstakes\n• "tier" - Check your loyalty tier\n\nNeed more help? Visit our website or contact support.'
    };
  }

  // Post to Facebook Group
  async postToGroup(groupId, message) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${groupId}/feed`,
        {
          message
        },
        {
          params: { access_token: this.pageAccessToken }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Post to group error:', error);
      throw error;
    }
  }

  // Announce sweepstakes winner
  async announceSweepstakesWinner(groupId, winnerName, prize) {
    const message = `🎉 WINNER ANNOUNCEMENT 🎉\n\nCongratulations to ${winnerName}!\n\nYou've won: ${prize}\n\nThank you to everyone who participated!`;
    return this.postToGroup(groupId, message);
  }
}

module.exports = new FacebookService();
