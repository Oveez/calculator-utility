import type { CountryTaxProfile } from '../types';

export const krProfile: CountryTaxProfile = {
  id: 'south-korea',
  name: 'South Korea',
  countryCode: 'KR',
  flagEmoji: '🇰🇷',
  defaultCurrency: 'KRW',
  defaultCurrencySymbol: '₩',
  defaultTaxYear: '2025',
  availableTaxYears: ['2025'],
  hasRegionalTax: true,
  regionalEntityName: 'Local Government (지방소득세)',
  metaDescription: 'Calculate South Korean income tax (소득세), Local Income Tax (10%), and 4 Major Insurances (4대보험) with official National Tax Service (NTS) rates.',
  faqItems: [
    {
      question: 'What are the income tax brackets in South Korea?',
      answer: 'South Korea features 8 progressive income tax brackets: 6% (up to ₩14M), 15% (₩14M - ₩50M), 24% (₩50M - ₩88M), 35% (₩88M - ₩150M), 38% (₩150M - ₩300M), 40% (₩300M - ₩500M), 42% (₩500M - ₩1B), and 45% (above ₩1B). Local income tax adds an additional 10% of the calculated national tax.',
    },
    {
      question: 'What are the 4 Major Social Insurances (4대보험) in South Korea?',
      answer: 'Employees contribute 4.5% to National Pension (국민연금), 3.545% to National Health Insurance (건강보험), 0.459% to Long-Term Care (장기요양보험), and 0.90% to Employment Insurance (고용보험) – totaling ~9.40%.',
    },
  ],
  years: {
    '2025': {
      taxYear: '2025',
      currency: 'KRW',
      currencySymbol: '₩',
      standardDeduction: 1500000, // Basic personal allowance (기본공제)
      nationalBrackets: [
        { threshold: 0, upTo: 14000000, rate: 0.06, label: '6% Bracket' },
        { threshold: 14000000, upTo: 50000000, rate: 0.15, label: '15% Bracket' },
        { threshold: 50000000, upTo: 88000000, rate: 0.24, label: '24% Bracket' },
        { threshold: 88000000, upTo: 150000000, rate: 0.35, label: '35% Bracket' },
        { threshold: 150000000, upTo: 300000000, rate: 0.38, label: '38% Bracket' },
        { threshold: 300000000, upTo: 500000000, rate: 0.40, label: '40% Bracket' },
        { threshold: 500000000, upTo: 1000000000, rate: 0.42, label: '42% Bracket' },
        { threshold: 1000000000, rate: 0.45, label: '45% Top Bracket' },
      ],
      socialContributions: [
        {
          id: 'national_pension',
          name: 'National Pension (국민연금)',
          rate: 0.045,
          employeeRate: 0.045,
          capAmount: 74040000, // Maximum standard monthly income annualized
          description: '4.50% statutory national pension contribution.',
        },
        {
          id: 'health_care',
          name: 'Health & Long-term Care (건강보험 / 장기요양)',
          rate: 0.04004,
          employeeRate: 0.04004,
          description: '3.545% Health Insurance + 0.459% Long-term Care Insurance.',
        },
        {
          id: 'employment_insurance',
          name: 'Employment Insurance (고용보험)',
          rate: 0.009,
          employeeRate: 0.009,
          description: '0.90% unemployment protection contribution.',
        },
      ],
      regions: [
        { code: 'local_tax_included', name: 'Standard Local Income Tax (10% of national tax)', additionalTaxRate: 0.015 },
        { code: 'national_only', name: 'National Tax Only', flatRate: 0 },
      ],
      vatConfig: {
        name: 'VAT (부가가치세)',
        standardRate: 0.10, // 10%
        reducedRates: [{ name: 'Zero-rated / Exempt (fresh food, public transport)', rate: 0.0 }],
      },
      officialSourceName: 'National Tax Service of South Korea (NTS / 국세청)',
      officialSourceUrl: 'https://www.nts.go.kr',
      lastVerifiedDate: '2025-01-15',
      assumptions: [
        'Single resident salaried employee',
        'Basic personal allowance (₩1,500,000) applied',
        'Statutory 4 Major Insurances (~9.40%) deducted',
        'Local income tax (10% of national income tax) applied',
      ],
    },
  },
};
