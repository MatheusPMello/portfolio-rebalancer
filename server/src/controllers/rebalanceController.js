// /server/src/controllers/rebalanceController.js
const Asset = require('../models/Asset');
const exchangeRateService = require('../services/exchangeRateService');

const rebalanceController = {
  calculate: async (req, res) => {
    try {
      const currentUsdRate = await exchangeRateService.getUsdToBrlRate();
      const userId = req.user.id;
      const contribution = Number(req.body.amount);

      // 1. Get the User's preferred currency
      const mainCurrency = req.body.mainCurrency || 'BRL';

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

      // 2. Normalize everything to the 'Main Currency'
      const normalizedAssets = assets.map((asset) => {
        const currentValue = Number(asset.current_value);
        let normalizedValue = currentValue;

        if (mainCurrency === 'BRL') {
          if (asset.currency === 'USD') {
            normalizedValue = currentValue * currentUsdRate;
          }
        } else if (mainCurrency === 'USD') {
          if (asset.currency === 'BRL') {
            normalizedValue = currentValue / currentUsdRate;
          }
        }

        return {
          ...asset,
          normalizedValue: normalizedValue, // This is the value in the "Main Currency"
          targetPercentage: Number(asset.target_percentage),
        };
      });

      // 3. Calculate Totals (In Main Currency)
      const totalCurrentValue = normalizedAssets.reduce(
        (sum, asset) => sum + asset.normalizedValue,
        0,
      );
      const totalFutureValue = totalCurrentValue + contribution;

      // 4. Calculate Gaps
      let totalGap = 0;

      const assetsWithGaps = normalizedAssets.map((asset) => {
        const targetValue = totalFutureValue * (asset.targetPercentage / 100);
        let difference = targetValue - asset.normalizedValue;

        if (difference < 0) difference = 0;

        totalGap += difference;

        return { ...asset, difference };
      });

      // 5. Distribute Contribution
      const suggestions = assetsWithGaps.map((asset) => {
        let amountToBuyNormalized = 0;

        if (totalGap > 0) {
          const weight = asset.difference / totalGap;
          amountToBuyNormalized = contribution * weight;
        }

        // 6. Convert BACK to Native Currency
        let finalAmountNative = amountToBuyNormalized;

        if (mainCurrency === 'BRL' && asset.currency === 'USD') {
          finalAmountNative = amountToBuyNormalized / currentUsdRate;
        } else if (mainCurrency === 'USD' && asset.currency === 'BRL') {
          finalAmountNative = amountToBuyNormalized * currentUsdRate;
        }

        return {
          assetId: asset.id,
          name: asset.name,
          currency: asset.currency,
          currentPercentage: (
            (asset.normalizedValue / totalCurrentValue) *
            100
          ).toFixed(2),
          targetPercentage: asset.targetPercentage,
          amountToBuy: Number(finalAmountNative.toFixed(2)),
        };
      });

      const finalSuggestions = suggestions.filter((s) => s.amountToBuy > 0.01);

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
