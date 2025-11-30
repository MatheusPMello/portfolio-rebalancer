// /server/src/routes/rebalanceRoutes.js
const express = require('express');
const router = express.Router();
const rebalanceController = require('../controllers/rebalanceController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.post('/', rebalanceController.calculate);

module.exports = router;
