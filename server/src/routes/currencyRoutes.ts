import express, { type Request, type Response } from 'express';
import exchangeRateService from '../services/exchangeRateService.js';

const router = express.Router();

router.get('/exchange-rate', async (req: Request, res: Response) => {
  try {
    const rate = await exchangeRateService.getUsdToBrlRate();
    res.json({ rate });
  } catch (err: any) {
    console.error('[CurrencyRoute] Failed to get exchange rate:', err.message);
    res.status(500).json({ message: 'Failed to fetch exchange rate', rate: 6 });
  }
});

export default router;
