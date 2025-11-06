const express = require('express');
const router = express.Router();
const sweepstakesController = require('../controllers/sweepstakesController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Public/Customer routes
router.get('/', authenticate, sweepstakesController.getSweepstakes);
router.get('/:id', authenticate, sweepstakesController.getSweepstakesById);
router.post('/:id/enter', authenticate, sweepstakesController.enterSweepstakes);

// Admin routes
router.post('/', authenticate, isAdmin, sweepstakesController.createSweepstakes);
router.put('/:id', authenticate, isAdmin, sweepstakesController.updateSweepstakes);
router.post('/:id/select-winners', authenticate, isAdmin, sweepstakesController.selectWinners);

module.exports = router;
