// /server/src/services/exchangeRateService.js
const axios = require('axios');

// Fallback constant in case the API is down
const FALLBACK_RATE = 6;

const exchangeRateService = {
  getUsdToBrlRate: async () => {
    try {
      console.log('Fetching real-time dollar rate...');
      
      const response = await axios.get('https://economia.awesomeapi.com.br/last/USD-BRL');
      
      const rate = parseFloat(response.data.USDBRL.bid);

      if (isNaN(rate)) {
        throw new Error('Invalid rate format received');
      }

      console.log(`Real-time rate received: R$ ${rate}`);
      return rate;

    } catch (err) {
      console.error('Failed to fetch external rate:', err.message);
      console.log(`Values will be calculated using fallback rate: R$ ${FALLBACK_RATE}`);
      return FALLBACK_RATE;
    }
  }
};

module.exports = exchangeRateService;