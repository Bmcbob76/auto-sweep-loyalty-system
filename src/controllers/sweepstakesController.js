const Sweepstakes = require('../models/Sweepstakes');
const loyaltyService = require('../services/loyaltyService');

class SweepstakesController {
  // Get all sweepstakes
  async getSweepstakes(req, res) {
    try {
      const { status } = req.query;
      const query = status ? { status } : {};

      const sweepstakes = await Sweepstakes.find(query)
        .sort({ startDate: -1 })
        .populate('winners.user', 'firstName lastName email');

      res.json({ sweepstakes });
    } catch (error) {
      console.error('Get sweepstakes error:', error);
      res.status(500).json({ error: 'Failed to get sweepstakes' });
    }
  }

  // Get single sweepstakes
  async getSweepstakesById(req, res) {
    try {
      const { id } = req.params;
      const sweepstakes = await Sweepstakes.findById(id)
        .populate('entries.user', 'firstName lastName')
        .populate('winners.user', 'firstName lastName email');

      if (!sweepstakes) {
        return res.status(404).json({ error: 'Sweepstakes not found' });
      }

      // Don't expose all entries to non-admin users
      if (req.userRole !== 'admin') {
        const userEntry = sweepstakes.entries.find(
          e => e.user._id.toString() === req.userId.toString()
        );
        res.json({
          sweepstakes: {
            ...sweepstakes.toObject(),
            entries: undefined,
            totalEntries: sweepstakes.entries.length,
            userEntry: userEntry || null
          }
        });
      } else {
        res.json({ sweepstakes });
      }
    } catch (error) {
      console.error('Get sweepstakes by ID error:', error);
      res.status(500).json({ error: 'Failed to get sweepstakes' });
    }
  }

  // Enter sweepstakes
  async enterSweepstakes(req, res) {
    try {
      const { id } = req.params;
      const { entryCount = 1 } = req.body;

      const result = await loyaltyService.enterSweepstakes(req.userId, id, entryCount);

      res.json({
        message: 'Successfully entered sweepstakes',
        ...result
      });
    } catch (error) {
      console.error('Enter sweepstakes error:', error);
      res.status(400).json({ error: error.message || 'Failed to enter sweepstakes' });
    }
  }

  // Admin: Create sweepstakes
  async createSweepstakes(req, res) {
    try {
      const sweepstakes = new Sweepstakes(req.body);
      
      // Set status based on dates
      const now = new Date();
      if (sweepstakes.startDate > now) {
        sweepstakes.status = 'upcoming';
      } else if (sweepstakes.endDate < now) {
        sweepstakes.status = 'ended';
      } else {
        sweepstakes.status = 'active';
      }

      await sweepstakes.save();

      res.status(201).json({
        message: 'Sweepstakes created successfully',
        sweepstakes
      });
    } catch (error) {
      console.error('Create sweepstakes error:', error);
      res.status(500).json({ error: 'Failed to create sweepstakes' });
    }
  }

  // Admin: Select winners
  async selectWinners(req, res) {
    try {
      const { id } = req.params;
      const winners = await loyaltyService.selectWinners(id);

      res.json({
        message: 'Winners selected successfully',
        winners
      });
    } catch (error) {
      console.error('Select winners error:', error);
      res.status(500).json({ error: 'Failed to select winners' });
    }
  }

  // Admin: Update sweepstakes
  async updateSweepstakes(req, res) {
    try {
      const { id } = req.params;
      const sweepstakes = await Sweepstakes.findByIdAndUpdate(id, req.body, { new: true });

      if (!sweepstakes) {
        return res.status(404).json({ error: 'Sweepstakes not found' });
      }

      res.json({
        message: 'Sweepstakes updated successfully',
        sweepstakes
      });
    } catch (error) {
      console.error('Update sweepstakes error:', error);
      res.status(500).json({ error: 'Failed to update sweepstakes' });
    }
  }
}

module.exports = new SweepstakesController();
