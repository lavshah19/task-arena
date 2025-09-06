const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controller/dashboardController');
const authMiddleware = require('../middleware/auth-Middleware');
router.get('/get-dashboard-stats',authMiddleware,getDashboardStats);
module.exports = router;