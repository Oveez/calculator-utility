import type { CountryTaxProfile } from '../types';

export const krProfile: CountryTaxProfile = {
  id: 'south-korea',
  name: 'South Korea',
  countryCode: 'KR',
  flagEmoji: '🇰🇷',
  defaultCurrency: 'KRW',
  defaultCurrencySymbol: '₩',
  defaultTaxYear: '2026',
  availableTaxYears: ['2026', '2025'],
  hasRegionalTax: true,
  regionalEntityName: 'Local Government (지방소득세)',
  metaDescription: 'Calculate South Korean income tax (소득세), Local Income Tax (10%), and 4 Major Insurances (4대보험) with official 2026 National Tax Service (NTS) rates.',
  faqItems: [
    {
      question: 'What are the income tax brackets in South Korea for 2026?',
      answer: 'South Korea features 8 progressive income tax brackets: 6% (up to ₩14M), 15% (₩14M - ₩50M), 24% (₩50M - ₩88M), 35% (₩88M - ₩150M), 38% (₩150M - ₩300M), 40% (₩300M - ₩500M), 42% (₩500M - ₩1B), and 45% (above ₩1B). Local income tax adds an additional 10% of the calculated national tax.',
    },
    {
      question: 'What are the 4 Major Social Insurances (4대보험) rates in South Korea for 2026?',
      answer: 'Under the 2026 schedule, employees contribute 4.75% to National Pension (국민연금, increased from 4.5%), 3.595% to National Health Insurance (건강보험), 0.4724% to Long-Term Care, and 0.90% to Employment Insurance – totaling ~9.72%.',
    },
  ],
  years: {
    '2026': {
      taxYear: '2026',
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
          rate: 0.0475,
          employeeRate: 0.0475,
          capAmount: 76000000, // Maximum standard monthly income annualized
          description: '4.75% statutory national pension employee contribution (2026 reform).',
        },
        {
          id: 'health_care',
          name: 'Health & Long-term Care (건강보험 / 장기요양)',
          rate: 0.040674,
          employeeRate: 0.040674,
          description: '3.595% Health Insurance + 0.4724% Long-term Care Insurance.',
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
      officialSourceName: 'National Tax Service of South Korea (NTS / 국세청) & NHIS',
      officialSourceUrl: 'https://www.nts.go.kr',
      lastVerifiedDate: '2026-09-01',
      assumptions: [
        'Single resident salaried employee',
        'Basic personal allowance (₩1,500,000) applied',
        '2026 statutory 4 Major Insurances (National Pension 4.75%, Health 3.595%, Care 0.4724%, Employment 0.90%) deducted',
        'Local income tax (10% of national income tax) applied',
      ],
    },
    '2025': {
      taxYear: '2025',
      currency: 'KRW',
      currencySymbol: '₩',
      standardDeduction: 1500000,
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
          capAmount: 74040000,
        },
        {
          id: 'health_care',
          name: 'Health & Long-term Care',
          rate: 0.04004,
          employeeRate: 0.04004,
        },
        {
          id: 'employment_insurance',
          name: 'Employment Insurance',
          rate: 0.009,
          employeeRate: 0.009,
        },
      ],
      regions: [
        { code: 'local_tax_included', name: 'Standard Local Income Tax (10% of national tax)', additionalTaxRate: 0.015 },
        { code: 'national_only', name: 'National Tax Only', flatRate: 0 },
      ],
      vatConfig: {
        name: 'VAT (부가가치세)',
        standardRate: 0.10,
      },
      officialSourceName: 'National Tax Service of South Korea (NTS)',
      officialSourceUrl: 'https://www.nts.go.kr',
      lastVerifiedDate: '2025-01-15',
      assumptions: ['Single resident salaried employee for 2025'],
    },
  },
};
