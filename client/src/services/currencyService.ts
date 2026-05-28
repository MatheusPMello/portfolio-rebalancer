import api from './api';

/**
 * Fetches the current USD to BRL exchange rate from the backend.
 * Falls back to 6 if the network request fails or invalid rate is returned.
 *
 * @returns A promise resolving to the USD to BRL conversion rate.
 */
export const fetchExchangeRate = async (): Promise<number> => {
  try {
    const response = await api.get<{ rate: number }>('/currency/exchange-rate');
    const rate = response.data?.rate;

    if (typeof rate !== 'number' || rate <= 0 || Number.isNaN(rate)) {
      throw new Error(`Invalid rate received: ${rate}`);
    }

    return rate;
  } catch (error) {
    console.error('Could not fetch rate, using fallback:', error);
    return 6;
  }
};
