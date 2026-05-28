import { type Request, type Response } from 'express';
import { Asset } from '../models/Asset.js';
import exchangeRateService from '../services/exchangeRateService.js';
import { calculateRebalancePlan } from '../services/rebalanceService.js';

export const rebalanceController = {
  calculate: async (req: Request, res: Response): Promise<any> => {
    try {
      // 1. PREPARE DATA
      const currentUsdRate = await exchangeRateService.getUsdToBrlRate();
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const contribution = Number(req.body.amount);
      const mainCurrency = (req.body.mainCurrency || 'BRL') as 'BRL' | 'USD';

      // 2. VALIDATE
      if (!contribution || contribution <= 0 || Number.isNaN(contribution)) {
        return res.status(400).json({ message: 'Please provide a valid contribution amount.' });
      }

      const assets = await Asset.findByUserId(userId);

      if (assets.length === 0) {
        return res.status(400).json({ message: 'Add assets before rebalancing.' });
      }

      // 3. DELEGATE TO SERVICE (The "Brain")
      const finalSuggestions = calculateRebalancePlan(
        contribution,
        assets,
        currentUsdRate,
        mainCurrency,
      );

      // 4. RESPOND
      res.status(200).json({
        contribution: contribution,
        mainCurrency: mainCurrency,
        rateUsed: currentUsdRate,
        suggestions: finalSuggestions,
      });
    } catch (err: any) {
      console.error('Rebalance Calculation Error:', err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  },
};
