import api from './api';

export const fetchExchangeRate = async (): Promise<number> => {
  try {
    const response = await api.get<{ rate: number }>('/currency/exchange-rate');
    const rate = response.data?.rate;

    if (typeof rate !== 'number' || rate <= 0 || Number.isNaN(rate)) {
      throw new Error(`Invalid rate received: ${rate}`);
    }

    return rate;
  } catch (error) {
    console.error("Could not fetch rate, using fallback:", error);
    return 6;
  }
};