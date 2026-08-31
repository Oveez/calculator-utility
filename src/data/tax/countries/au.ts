import type { CountryTaxProfile } from '../types';

export const auProfile: CountryTaxProfile = {
  id: 'au',
  name: 'Australia',
  countryCode: 'AU',
  flagEmoji: '🇦🇺',
  defaultCurrency: 'AUD',
  defaultCurrencySymbol: '$',
  defaultTaxYear: '2024-25',
  availableTaxYears: ['2024-25', '2025-26'],
  hasRegionalTax: false,
  metaDescription: 'Calculate Australian income tax, Medicare levy, and take-home pay under the official ATO revised Stage 3 tax cuts (effective from 1 July 2024).',
  faqItems: [
    {
      question: 'What are the Stage 3 tax rates in Australia from 1 July 2024?',
      answer: 'The revised Stage 3 tax cuts established the following resident rates: 0% up to $18,200; 16% from $18,201 to $45,000; 30% from $45,001 to $135,000; 37% from $135,001 to $190,000; and 45% above $190,000.',
    },
    {
      question: 'What is the Medicare Levy in Australia?',
      answer: 'The Medicare Levy is 2.0% of your taxable income, which helps fund the public healthcare system. Low-income earners receive relief via phase-in thresholds.',
    },
  ],
  years: {
    '2024-25': {
      taxYear: '2024-25',
      currency: 'AUD',
      currencySymbol: '$',
      standardDeduction: 0, // Tax-free threshold is integrated in first bracket
      nationalBrackets: [
        { threshold: 0, upTo: 18200, rate: 0.00, label: 'Tax-Free Threshold' },
        { threshold: 18200, upTo: 45000, rate: 0.16, label: '16% Bracket' },
        { threshold: 45000, upTo: 135000, rate: 0.30, label: '30% Bracket' },
        { threshold: 135000, upTo: 190000, rate: 0.37, label: '37% Bracket' },
        { threshold: 190000, rate: 0.45, label: '45% Top Bracket' },
      ],
      socialContributions: [
        {
          id: 'medicare_levy',
          name: 'Medicare Levy',
          rate: 0.02,
          employeeRate: 0.02,
          minThreshold: 26000, // Phase-in relief threshold for single individuals
          description: '2% of taxable income to fund Medicare (with low-income relief).',
        },
      ],
      vatConfig: {
        name: 'GST',
        standardRate: 0.10, // 10% Goods and Services Tax
        reducedRates: [{ name: 'GST-free supplies (basic food, medical)', rate: 0.0 }],
      },
      officialSourceName: 'Australian Taxation Office (ATO)',
      officialSourceUrl: 'https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents',
      lastVerifiedDate: '2024-07-01',
      assumptions: [
        'Australian resident for tax purposes for the full financial year',
        'Standard Medicare Levy (2.0%) applied above threshold',
        'Does not include Medicare Levy Surcharge (private health insurance), HELP/HECS student debt, or Superannuation Guarantee contributions (paid by employer 11.5% - 12%)',
      ],
    },
    '2025-26': {
      taxYear: '2025-26',
      currency: 'AUD',
      currencySymbol: '$',
      standardDeduction: 0,
      nationalBrackets: [
        { threshold: 0, upTo: 18200, rate: 0.00, label: 'Tax-Free Threshold' },
        { threshold: 18200, upTo: 45000, rate: 0.16, label: '16% Bracket' },
        { threshold: 45000, upTo: 135000, rate: 0.30, label: '30% Bracket' },
        { threshold: 135000, upTo: 190000, rate: 0.37, label: '37% Bracket' },
        { threshold: 190000, rate: 0.45, label: '45% Top Bracket' },
      ],
      socialContributions: [
        {
          id: 'medicare_levy',
          name: 'Medicare Levy',
          rate: 0.02,
          employeeRate: 0.02,
          minThreshold: 26000,
        },
      ],
      vatConfig: {
        name: 'GST',
        standardRate: 0.10,
      },
      officialSourceName: 'Australian Taxation Office (ATO)',
      officialSourceUrl: 'https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents',
      lastVerifiedDate: '2025-01-15',
      assumptions: ['Australian resident for tax purposes (Stage 3 structure ongoing)'],
    },
  },
};
