export interface ConsumptionTaxResult {
  netAmount: number; // Amount before tax (exclusive)
  taxRatePercent: number; // e.g. 20 for 20%
  taxAmount: number; // The tax added
  grossAmount: number; // Amount after tax (inclusive)
  calculationMode: 'add_tax' | 'remove_tax';
}

export function calculateVatGst(
  amount: number,
  taxRatePercent: number,
  mode: 'add_tax' | 'remove_tax' = 'add_tax'
): ConsumptionTaxResult {
  const validAmount = Math.max(0, isNaN(amount) ? 0 : amount);
  const rateDecimal = Math.max(0, isNaN(taxRatePercent) ? 0 : taxRatePercent) / 100;

  if (mode === 'add_tax') {
    // Input is Net (Before Tax) -> Output is Gross (After Tax)
    const netAmount = validAmount;
    const taxAmount = netAmount * rateDecimal;
    const grossAmount = netAmount + taxAmount;

    return {
      netAmount,
      taxRatePercent,
      taxAmount,
      grossAmount,
      calculationMode: 'add_tax',
    };
  } else {
    // Input is Gross (Including Tax) -> Output is Net (Excluding Tax)
    const grossAmount = validAmount;
    const netAmount = rateDecimal > 0 ? grossAmount / (1 + rateDecimal) : grossAmount;
    const taxAmount = grossAmount - netAmount;

    return {
      netAmount,
      taxRatePercent,
      taxAmount,
      grossAmount,
      calculationMode: 'remove_tax',
    };
  }
}
