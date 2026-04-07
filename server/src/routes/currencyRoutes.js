const express = require('express');
const router = express.Router();
const exchangeRateService = require('../services/exchangeRateService');

router.get('/exchange-rate', async (req, res) => {
  try {
    const rate = await exchangeRateService.getUsdToBrlRate();
    res.json({ rate });
  } catch (err) {
    console.error('[CurrencyRoute] Failed to get exchange rate:', err.message);
    res.status(500).json({ message: 'Failed to fetch exchange rate', rate: 6 });
  }
});

module.exports = router;
