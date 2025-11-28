// /server/src/routes/rebalanceRoutes.js
const express = require('express');
const router = express.Router();
const rebalanceController = require('../controllers/rebalanceController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

// POST /api/rebalance
router.post('/', rebalanceController.calculate);

module.exports = router;