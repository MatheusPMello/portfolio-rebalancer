// /client/src/services/rebalanceService.ts
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/rebalance';

// 1. Define the shapes of the data
export interface RebalanceSuggestion {
  assetId: number;
  name: string;
  currency: string;
  currentPercentage: string;
  targetPercentage: number;
  amountToBuy: number;
}

export interface RebalanceResponse {
  contribution: number;
  mainCurrency: 'BRL' | 'USD';
  suggestions: RebalanceSuggestion[];
}

// 2. Helper for Auth Header (Same as assetService)
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// 3. The Function
const calculate = async (amount: number, mainCurrency: 'BRL' | 'USD'): Promise<RebalanceResponse> => {
  const response = await axios.post(
    API_URL, 
    { amount, mainCurrency }, 
    getAuthConfig()
  );
  return response.data;
};

const rebalanceService = {
  calculate,
};

export default rebalanceService;