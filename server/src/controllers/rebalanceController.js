// /server/src/controllers/rebalanceController.js
const Asset = require('../models/Asset');
const exchangeRateService = require('../services/exchangeRateService');

// 1. IMPORT THE LOGIC (The Service)
const { calculateRebalancePlan } = require('../services/rebalanceService');

const rebalanceController = {
  calculate: async (req, res) => {
    try {
      // 2. PREPARE DATA
      const currentUsdRate = await exchangeRateService.getUsdToBrlRate();
      const userId = req.user.id;
      const contribution = Number(req.body.amount);
      const mainCurrency = req.body.mainCurrency || 'BRL';

      // 3. VALIDATE
      if (!contribution || contribution <= 0) {
        return res
          .status(400)
          .json({ message: 'Please provide a valid contribution amount.' });
      }

      const assets = await Asset.findByUserId(userId);

      if (assets.length === 0) {
        return res
          .status(400)
          .json({ message: 'Add assets before rebalancing.' });
      }

      // 4. DELEGATE TO SERVICE (The "Brain")
      // Instead of 50 lines of math, we just call the function we tested
      const finalSuggestions = calculateRebalancePlan(
        contribution,
        assets,
        currentUsdRate,
        mainCurrency,
      );

      // 5. RESPOND
      res.status(200).json({
        contribution: contribution,
        mainCurrency: mainCurrency,
        rateUsed: currentUsdRate,
        suggestions: finalSuggestions,
      });
    } catch (err) {
      console.error('Rebalance Calculation Error:', err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  },
};

module.exports = rebalanceController;
