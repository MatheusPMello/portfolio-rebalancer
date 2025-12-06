// /server/src/services/rebalanceService.js

/**
 * Calculates the rebalancing plan.
 * Pure logic: Input -> Math -> Output.
 */
const calculateRebalancePlan = (contribution, assets, usdRate, mainCurrency) => {
  
  // 1. Normalize all assets to the 'Main Currency'
  const normalizedAssets = assets.map(asset => {
    const currentValue = Number(asset.current_value);
    let normalizedValue = currentValue;

    // Convert Native -> Main
    if (mainCurrency === 'BRL' && asset.currency === 'USD') {
        normalizedValue = currentValue * usdRate;
    } 
    else if (mainCurrency === 'USD' && asset.currency === 'BRL') {
        normalizedValue = currentValue / usdRate;
    }

    return {
      ...asset,
      normalizedValue,
      targetPercentage: Number(asset.target_percentage)
    };
  });

  // 2. Calculate Totals
  const totalCurrentValue = normalizedAssets.reduce((sum, a) => sum + a.normalizedValue, 0);
  const totalFutureValue = totalCurrentValue + contribution;

  // 3. Calculate Gaps (How far off are we?)
  let totalGap = 0;
  
  const assetsWithGaps = normalizedAssets.map(asset => {
    const targetValue = totalFutureValue * (asset.targetPercentage / 100);
    let difference = targetValue - asset.normalizedValue;
    
    // "Buy Only" Logic: If negative gap, ignore it (don't sell)
    if (difference < 0) difference = 0;
    
    totalGap += difference;
    return { ...asset, difference };
  });

  // 4. Distribute the Contribution
  const suggestions = assetsWithGaps.map(asset => {
    let amountToBuyNormalized = 0;

    if (totalGap > 0) {
       // Weight: This asset represents X% of the total gap
       const weight = asset.difference / totalGap;
       amountToBuyNormalized = contribution * weight;
    }

    // 5. Convert BACK to Native Currency (for the User)
    let finalAmountNative = amountToBuyNormalized;

    if (mainCurrency === 'BRL' && asset.currency === 'USD') {
      finalAmountNative = amountToBuyNormalized / usdRate;
    }
    else if (mainCurrency === 'USD' && asset.currency === 'BRL') {
      finalAmountNative = amountToBuyNormalized * usdRate;
    }

    return {
      assetId: asset.id,
      name: asset.name,
      currency: asset.currency, 
      currentPercentage: totalCurrentValue > 0 ? ((asset.normalizedValue / totalCurrentValue) * 100).toFixed(2) : '0.00',
      targetPercentage: asset.targetPercentage,
      amountToBuy: Number(finalAmountNative.toFixed(2))
    };
  });

  return suggestions.filter(s => s.amountToBuy > 0.01);
};

module.exports = { calculateRebalancePlan };