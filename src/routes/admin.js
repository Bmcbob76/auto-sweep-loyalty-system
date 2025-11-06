const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, isAdmin } = require('../middleware/auth');

// All admin routes require admin authentication
router.use(authenticate, isAdmin);

router.get('/dashboard', adminController.getDashboardStats);
router.get('/analytics', adminController.getAnalytics);
router.get('/users', adminController.getUsers);
router.put('/users/:id', adminController.updateUser);
router.post('/points/adjust', adminController.adjustPoints);

module.exports = router;
