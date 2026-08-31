export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  currencySymbol: string = '$',
  minimumFractionDigits: number = 0
): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return `${currencySymbol}0`;
  }

  try {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: minimumFractionDigits,
      maximumFractionDigits: 2,
    }).format(amount);
    return formatted;
  } catch (e) {
    // Fallback if currency code is unusual
    const parts = amount.toFixed(minimumFractionDigits).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${currencySymbol}${parts}`;
  }
}

export function formatPercent(rate: number, decimalPlaces: number = 1): string {
  if (isNaN(rate) || rate === null || rate === undefined) {
    return '0.0%';
  }
  return `${rate.toFixed(decimalPlaces)}%`;
}

export function formatNumber(value: number): string {
  if (isNaN(value)) return '0';
  return new Intl.NumberFormat('en-US').format(Math.round(value));
}
