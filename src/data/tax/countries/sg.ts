import type { CountryTaxProfile } from '../types';

export const sgProfile: CountryTaxProfile = {
  id: 'singapore',
  name: 'Singapore',
  countryCode: 'SG',
  flagEmoji: '🇸🇬',
  defaultCurrency: 'SGD',
  defaultCurrencySymbol: '$',
  defaultTaxYear: '2026',
  availableTaxYears: ['2026', '2025'],
  hasRegionalTax: false,
  metaDescription: 'Calculate Singapore individual resident income tax, employee CPF contributions ($8,000/mo cap), and take-home pay with official IRAS / CPF Board 2026 data.',
  faqItems: [
    {
      question: 'What are the individual income tax rates in Singapore for 2026?',
      answer: 'Singapore uses a progressive resident tax system starting at 0% for the first SGD 20,000, progressing up to a top marginal rate of 24% for chargeable income exceeding SGD 1,000,000.',
    },
    {
      question: 'What is the employee Central Provident Fund (CPF) rate and wage ceiling in Singapore for 2026?',
      answer: 'Singapore citizens and permanent residents aged 55 and below contribute 20% of their monthly wage to CPF, subject to the statutory monthly Ordinary Wage (OW) ceiling of $8,000 ($96,000 annualized).',
    },
  ],
  years: {
    '2026': {
      taxYear: '2026',
      currency: 'SGD',
      currencySymbol: '$',
      standardDeduction: 0,
      nationalBrackets: [
        { threshold: 0, upTo: 20000, rate: 0.00, label: 'First $20k (0%)' },
        { threshold: 20000, upTo: 30000, rate: 0.02, label: 'Next $10k (2%)' },
        { threshold: 30000, upTo: 40000, rate: 0.035, label: 'Next $10k (3.5%)' },
        { threshold: 40000, upTo: 80000, rate: 0.07, label: 'Next $40k (7%)' },
        { threshold: 80000, upTo: 120000, rate: 0.115, label: 'Next $40k (11.5%)' },
        { threshold: 120000, upTo: 160000, rate: 0.15, label: 'Next $40k (15%)' },
        { threshold: 160000, upTo: 200000, rate: 0.18, label: 'Next $40k (18%)' },
        { threshold: 200000, upTo: 240000, rate: 0.19, label: 'Next $40k (19%)' },
        { threshold: 240000, upTo: 280000, rate: 0.195, label: 'Next $40k (19.5%)' },
        { threshold: 280000, upTo: 320000, rate: 0.20, label: 'Next $40k (20%)' },
        { threshold: 320000, upTo: 500000, rate: 0.22, label: 'Next $180k (22%)' },
        { threshold: 500000, upTo: 1000000, rate: 0.23, label: 'Next $500k (23%)' },
        { threshold: 1000000, rate: 0.24, label: 'Above $1M (24%)' },
      ],
      socialContributions: [
        {
          id: 'cpf',
          name: 'Central Provident Fund (CPF Employee Share)',
          rate: 0.20,
          employeeRate: 0.20,
          capAmount: 96000, // Monthly ordinary wage ceiling annualized ($8,000 * 12)
          description: '20% employee CPF contribution for citizens/PRs aged 55 and below (capped at $8,000/month).',
        },
      ],
      vatConfig: {
        name: 'GST',
        standardRate: 0.09, // 9% Goods & Services Tax
        reducedRates: [{ name: 'Zero-rated (international services, exports)', rate: 0.0 }],
      },
      officialSourceName: 'Inland Revenue Authority of Singapore (IRAS) & Central Provident Fund (CPF)',
      officialSourceUrl: 'https://www.iras.gov.sg',
      lastVerifiedDate: '2026-09-01',
      assumptions: [
        'Tax resident individual for the Year of Assessment (YA)',
        'Singapore Citizen / Permanent Resident aged 55 or below for standard 20% CPF rate (cap $8,000/mo)',
        'Does not include personal tax relief deductions (e.g. earned income, NSman, SRS)',
      ],
    },
    '2025': {
      taxYear: '2025',
      currency: 'SGD',
      currencySymbol: '$',
      standardDeduction: 0,
      nationalBrackets: [
        { threshold: 0, upTo: 20000, rate: 0.00, label: 'First $20k (0%)' },
        { threshold: 20000, upTo: 30000, rate: 0.02, label: 'Next $10k (2%)' },
        { threshold: 30000, upTo: 40000, rate: 0.035, label: 'Next $10k (3.5%)' },
        { threshold: 40000, upTo: 80000, rate: 0.07, label: 'Next $40k (7%)' },
        { threshold: 80000, upTo: 120000, rate: 0.115, label: 'Next $40k (11.5%)' },
        { threshold: 120000, upTo: 160000, rate: 0.15, label: 'Next $40k (15%)' },
        { threshold: 160000, upTo: 200000, rate: 0.18, label: 'Next $40k (18%)' },
        { threshold: 200000, upTo: 240000, rate: 0.19, label: 'Next $40k (19%)' },
        { threshold: 240000, upTo: 280000, rate: 0.195, label: 'Next $40k (19.5%)' },
        { threshold: 280000, upTo: 320000, rate: 0.20, label: 'Next $40k (20%)' },
        { threshold: 320000, upTo: 500000, rate: 0.22, label: 'Next $180k (22%)' },
        { threshold: 500000, upTo: 1000000, rate: 0.23, label: 'Next $500k (23%)' },
        { threshold: 1000000, rate: 0.24, label: 'Above $1M (24%)' },
      ],
      socialContributions: [
        {
          id: 'cpf',
          name: 'Central Provident Fund (CPF Employee Share)',
          rate: 0.20,
          employeeRate: 0.20,
          capAmount: 88800,
        },
      ],
      vatConfig: {
        name: 'GST',
        standardRate: 0.09,
      },
      officialSourceName: 'IRAS',
      officialSourceUrl: 'https://www.iras.gov.sg',
      lastVerifiedDate: '2025-01-15',
      assumptions: ['Tax resident individual for 2025'],
    },
  },
};
