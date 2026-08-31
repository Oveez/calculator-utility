export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  popular?: boolean;
}

export const popularCurrencies: string[] = [
  'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY',
  'INR', 'SGD', 'NZD', 'HKD', 'KRW', 'MXN', 'BRL', 'SEK',
  'NOK', 'DKK', 'PLN', 'ZAR', 'AED', 'SAR', 'BDT', 'TRY',
  'THB', 'IDR', 'MYR', 'PHP', 'VND', 'EGP'
];

export const allCurrencies: Record<string, CurrencyInfo> = {
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', popular: true },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', popular: true },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', popular: true },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', popular: true },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: '$', flag: '🇨🇦', popular: true },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: '$', flag: '🇦🇺', popular: true },
  CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭', popular: true },
  CNY: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', popular: true },
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', popular: true },
  SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: '$', flag: '🇸🇬', popular: true },
  NZD: { code: 'NZD', name: 'New Zealand Dollar', symbol: '$', flag: '🇳🇿', popular: true },
  HKD: { code: 'HKD', name: 'Hong Kong Dollar', symbol: '$', flag: '🇭🇰', popular: true },
  KRW: { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷', popular: true },
  MXN: { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽', popular: true },
  BRL: { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', popular: true },
  SEK: { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪', popular: true },
  NOK: { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴', popular: true },
  DKK: { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰', popular: true },
  PLN: { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱', popular: true },
  ZAR: { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦', popular: true },
  AED: { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪', popular: true },
  SAR: { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦', popular: true },
  BDT: { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', flag: '🇧🇩', popular: true },
  TRY: { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷', popular: true },
  THB: { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭', popular: true },
  IDR: { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩', popular: true },
  MYR: { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾', popular: true },
  PHP: { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭', popular: true },
  VND: { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳', popular: true },
  EGP: { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', flag: '🇪🇬', popular: true },
  ILS: { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪', flag: '🇮🇱' },
  CLP: { code: 'CLP', name: 'Chilean Peso', symbol: '$', flag: '🇨🇱' },
  COP: { code: 'COP', name: 'Colombian Peso', symbol: '$', flag: '🇨🇴' },
  ARS: { code: 'ARS', name: 'Argentine Peso', symbol: '$', flag: '🇦🇷' },
  CZK: { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿' },
  HUF: { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', flag: '🇭🇺' },
  RON: { code: 'RON', name: 'Romanian Leu', symbol: 'lei', flag: '🇷🇴' },
  BGN: { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв', flag: '🇧🇬' },
  QAR: { code: 'QAR', name: 'Qatari Riyal', symbol: 'QR', flag: '🇶🇦' },
  KWD: { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KD', flag: '🇰🇼' },
  BHD: { code: 'BHD', name: 'Bahraini Dinar', symbol: 'BD', flag: '🇧🇭' },
  OMR: { code: 'OMR', name: 'Omani Rial', symbol: 'RO', flag: '🇴🇲' },
  PKR: { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', flag: '🇵🇰' },
  LKR: { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs', flag: '🇱🇰' },
  NGN: { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬' },
  KES: { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪' },
  GHS: { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', flag: '🇬🇭' },
  TWD: { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$', flag: '🇹🇼' },
  ISK: { code: 'ISK', name: 'Icelandic Krona', symbol: 'kr', flag: '🇮🇸' },
  PEN: { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', flag: '🇵🇪' },
  UAH: { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴', flag: '🇺🇦' }
};

// Built-in baseline rates (USD base) to ensure immediate offline operation
export const baselineExchangeRates: Record<string, number> = {
  USD: 1.0,
  EUR: 0.9250,
  GBP: 0.7725,
  JPY: 154.60,
  CAD: 1.3850,
  AUD: 1.5420,
  CHF: 0.8840,
  CNY: 7.2450,
  INR: 86.40,
  SGD: 1.3420,
  NZD: 1.6950,
  HKD: 7.7800,
  KRW: 1395.0,
  MXN: 20.350,
  BRL: 5.7500,
  SEK: 10.650,
  NOK: 10.950,
  DKK: 6.9000,
  PLN: 4.0250,
  ZAR: 18.250,
  AED: 3.6725,
  SAR: 3.7500,
  BDT: 121.50,
  TRY: 35.80,
  THB: 34.20,
  IDR: 16150.0,
  MYR: 4.450,
  PHP: 58.20,
  VND: 25400.0,
  EGP: 50.40,
  ILS: 3.620,
  CLP: 975.0,
  COP: 4350.0,
  ARS: 1040.0,
  CZK: 23.60,
  HUF: 382.0,
  RON: 4.60,
  BGN: 1.81,
  QAR: 3.64,
  KWD: 0.308,
  BHD: 0.376,
  OMR: 0.385,
  PKR: 278.5,
  LKR: 295.0,
  NGN: 1520.0,
  KES: 129.5,
  GHS: 15.6,
  TWD: 32.6,
  ISK: 138.5,
  PEN: 3.75,
  UAH: 41.5
};

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number> = baselineExchangeRates
): number {
  if (fromCurrency === toCurrency) return amount;
  const fromRate = rates[fromCurrency] || 1.0;
  const toRate = rates[toCurrency] || 1.0;
  const inUSD = amount / fromRate;
  return inUSD * toRate;
}

export function getExchangeRate(
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number> = baselineExchangeRates
): number {
  if (fromCurrency === toCurrency) return 1.0;
  const fromRate = rates[fromCurrency] || 1.0;
  const toRate = rates[toCurrency] || 1.0;
  return toRate / fromRate;
}
