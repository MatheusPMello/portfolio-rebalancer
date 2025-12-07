// /client/src/services/rebalanceService.ts
import api from './api';

// --- Types ---
export interface RebalanceSuggestion {
  assetId: number;
  name: string;
  currency: 'BRL' | 'USD';
  currentPercentage: string;
  targetPercentage: number;
  amountToBuy: number;
}

export interface RebalanceResponse {
  contribution: number;
  mainCurrency: 'BRL' | 'USD';
  rateUsed: number;
  suggestions: RebalanceSuggestion[];
}

// --- Async Functions ---

const calculate = async (amount: number, mainCurrency: 'BRL' | 'USD'): Promise<RebalanceResponse> => {
  const response = await api.post('/rebalance', { 
    amount, 
    mainCurrency 
  });
  
  return response.data;
};

const rebalanceService = {
  calculate,
};

export default rebalanceService;