const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Sweepstakes = require('../models/Sweepstakes');

class AdminController {
  // Get dashboard statistics
  async getDashboardStats(req, res) {
    try {
      const totalUsers = await User.countDocuments();
      const activeUsers = await User.countDocuments({ isActive: true });
      
      const totalTransactions = await Transaction.countDocuments({ status: 'completed' });
      const totalRevenue = await Transaction.aggregate([
        { $match: { status: 'completed', type: 'purchase' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      const activeSweepstakes = await Sweepstakes.countDocuments({ status: 'active' });
      const totalPointsDistributed = await User.aggregate([
        { $group: { _id: null, total: { $sum: '$loyaltyPoints' } } }
      ]);

      // Tier distribution
      const tierDistribution = await User.aggregate([
        { $group: { _id: '$tier', count: { $count: {} } } }
      ]);

      // Recent transactions
      const recentTransactions = await Transaction.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('user', 'firstName lastName email');

      res.json({
        overview: {
          totalUsers,
          activeUsers,
          totalTransactions,
          totalRevenue: totalRevenue[0]?.total || 0,
          activeSweepstakes,
          totalPointsDistributed: totalPointsDistributed[0]?.total || 0
        },
        tierDistribution,
        recentTransactions
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({ error: 'Failed to get dashboard stats' });
    }
  }

  // Get analytics
  async getAnalytics(req, res) {
    try {
      const { startDate, endDate, metric } = req.query;
      
      const dateFilter = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);

      let result;

      switch (metric) {
      case 'revenue':
        result = await Transaction.aggregate([
          { $match: { createdAt: dateFilter, status: 'completed', type: 'purchase' } },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              total: { $sum: '$amount' },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ]);
        break;

      case 'signups':
        result = await User.aggregate([
          { $match: { createdAt: dateFilter } },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ]);
        break;

      case 'points':
        result = await Transaction.aggregate([
          { $match: { createdAt: dateFilter, pointsEarned: { $gt: 0 } } },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              totalPoints: { $sum: '$pointsEarned' },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ]);
        break;

      default:
        return res.status(400).json({ error: 'Invalid metric' });
      }

      res.json({ data: result });
    } catch (error) {
      console.error('Get analytics error:', error);
      res.status(500).json({ error: 'Failed to get analytics' });
    }
  }

  // Get all users with filters
  async getUsers(req, res) {
    try {
      const { page = 1, limit = 20, tier, search } = req.query;
      
      const query = {};
      if (tier) query.tier = tier;
      if (search) {
        query.$or = [
          { email: { $regex: search, $options: 'i' } },
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } }
        ];
      }

      const users = await User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const count = await User.countDocuments(query);

      res.json({
        users,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ error: 'Failed to get users' });
    }
  }

  // Update user (admin only)
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Don't allow password updates through this endpoint
      delete updates.password;

      const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        message: 'User updated successfully',
        user
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  }

  // Adjust user points (admin only)
  async adjustPoints(req, res) {
    try {
      const { userId, points, reason } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.loyaltyPoints += points;
      user.updateTier();
      await user.save();

      // Create adjustment transaction
      const transaction = new Transaction({
        user: userId,
        type: 'points_adjustment',
        amount: 0,
        pointsEarned: points > 0 ? points : 0,
        pointsSpent: points < 0 ? Math.abs(points) : 0,
        paymentMethod: 'card',
        status: 'completed',
        description: reason || 'Admin adjustment'
      });
      await transaction.save();

      res.json({
        message: 'Points adjusted successfully',
        user: {
          id: user._id,
          loyaltyPoints: user.loyaltyPoints,
          tier: user.tier
        }
      });
    } catch (error) {
      console.error('Adjust points error:', error);
      res.status(500).json({ error: 'Failed to adjust points' });
    }
  }
}

module.exports = new AdminController();
