import type { CountryTaxProfile } from '../types';

export const nzProfile: CountryTaxProfile = {
  id: 'new-zealand',
  name: 'New Zealand',
  countryCode: 'NZ',
  flagEmoji: '🇳🇿',
  defaultCurrency: 'NZD',
  defaultCurrencySymbol: '$',
  defaultTaxYear: '2025/26',
  availableTaxYears: ['2025/26', '2024/25'],
  hasRegionalTax: false,
  metaDescription: 'Calculate New Zealand PAYE income tax, ACC Earners’ levy, KiwiSaver, and net salary under the revised tax brackets from Inland Revenue (IRD).',
  faqItems: [
    {
      question: 'What are the updated PAYE income tax brackets in New Zealand?',
      answer: 'Effective 31 July 2024 (for the 2024/25 and 2025/26 tax years), the tax thresholds are: 10.5% up to $15,600; 17.5% from $15,601 to $53,500; 30.0% from $53,501 to $78,100; 33.0% from $78,101 to $180,000; and 39.0% for income over $180,000.',
    },
    {
      question: 'What is the ACC Earners’ levy rate in New Zealand?',
      answer: 'The ACC Earners’ levy is 1.60% (up to the maximum liable earnings threshold of $142,283), which covers non-work personal injury compensation.',
    },
  ],
  years: {
    '2025/26': {
      taxYear: '2025/26',
      currency: 'NZD',
      currencySymbol: '$',
      standardDeduction: 0,
      nationalBrackets: [
        { threshold: 0, upTo: 15600, rate: 0.105, label: '10.5% Bracket' },
        { threshold: 15600, upTo: 53500, rate: 0.175, label: '17.5% Bracket' },
        { threshold: 53500, upTo: 78100, rate: 0.30, label: '30.0% Bracket' },
        { threshold: 78100, upTo: 180000, rate: 0.33, label: '33.0% Bracket' },
        { threshold: 180000, rate: 0.39, label: '39.0% Top Bracket' },
      ],
      socialContributions: [
        {
          id: 'acc_levy',
          name: 'ACC Earners’ Levy',
          rate: 0.016,
          employeeRate: 0.016,
          capAmount: 142283,
          description: '1.60% ACC Earners’ levy for accident compensation protection.',
        },
        {
          id: 'kiwisaver',
          name: 'KiwiSaver (Standard 3% Optional)',
          rate: 0.03,
          employeeRate: 0.03,
          description: 'Default 3% employee superannuation contribution.',
        },
      ],
      vatConfig: {
        name: 'GST',
        standardRate: 0.15, // 15% GST
        reducedRates: [{ name: 'Zero-rated (exports, financial services)', rate: 0.0 }],
      },
      officialSourceName: 'Inland Revenue Department (IRD) - Te Tari Taake',
      officialSourceUrl: 'https://www.ird.govt.nz/income-tax/income-tax-for-individuals/tax-codes-and-tax-rates-for-individuals/tax-rates-for-individuals',
      lastVerifiedDate: '2025-01-15',
      assumptions: [
        'Tax resident individual using primary M tax code',
        'Standard ACC Earners’ levy (1.60%) applied up to ceiling',
        'KiwiSaver employee contribution (3%) included as standard option',
        'Does not include student loan repayments (12% over threshold) or Independent Earner Tax Credit (IETC)',
      ],
    },
    '2024/25': {
      taxYear: '2024/25',
      currency: 'NZD',
      currencySymbol: '$',
      standardDeduction: 0,
      nationalBrackets: [
        { threshold: 0, upTo: 15600, rate: 0.105, label: '10.5% Bracket' },
        { threshold: 15600, upTo: 53500, rate: 0.175, label: '17.5% Bracket' },
        { threshold: 53500, upTo: 78100, rate: 0.30, label: '30.0% Bracket' },
        { threshold: 78100, upTo: 180000, rate: 0.33, label: '33.0% Bracket' },
        { threshold: 180000, rate: 0.39, label: '39.0% Top Bracket' },
      ],
      socialContributions: [
        {
          id: 'acc_levy',
          name: 'ACC Earners’ Levy',
          rate: 0.016,
          employeeRate: 0.016,
          capAmount: 142283,
        },
      ],
      vatConfig: {
        name: 'GST',
        standardRate: 0.15,
      },
      officialSourceName: 'Inland Revenue Department (IRD)',
      officialSourceUrl: 'https://www.ird.govt.nz',
      lastVerifiedDate: '2024-07-31',
      assumptions: ['New Zealand resident individual (M tax code)'],
    },
  },
};
