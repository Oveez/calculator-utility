import type { CountryTaxProfile } from '../types';

export const noProfile: CountryTaxProfile = {
  id: 'norway',
  name: 'Norway',
  countryCode: 'NO',
  flagEmoji: '🇳🇴',
  defaultCurrency: 'NOK',
  defaultCurrencySymbol: 'kr',
  defaultTaxYear: '2026',
  availableTaxYears: ['2026', '2025'],
  hasRegionalTax: false,
  metaDescription: 'Calculate Norwegian income tax (Alminnelig inntekt 22%), Trinnskatt (bracket tax 1–5), and Trygdeavgift (7.6%) with official Skatteetaten 2026 data.',
  faqItems: [
    {
      question: 'How is income tax calculated in Norway for 2026?',
      answer: 'Norway taxes income in two main layers: a flat 22% tax on general net income (alminnelig inntekt) after deductions (such as Personfradrag 114,540 NOK), and a progressive bracket tax (trinnskatt) on gross salary ranging from 1.7% to 17.8%.',
    },
    {
      question: 'What is the employee National Insurance rate (Trygdeavgift) in Norway for 2026?',
      answer: 'Employees pay 7.6% Trygdeavgift on gross employment income (reduced by 0.1% for 2026).',
    },
  ],
  years: {
    '2026': {
      taxYear: '2026',
      currency: 'NOK',
      currencySymbol: 'kr',
      standardDeduction: 114540, // Personfradrag 2026
      nationalBrackets: [
        { threshold: 0, upTo: 111560, rate: 0.22, label: 'Base General Tax (22%)' }, // NOK 114,540 to 226,100
        { threshold: 111560, upTo: 203760, rate: 0.237, label: 'Trinn 1 (22% + 1.7%)' }, // NOK 226,100 to 318,300
        { threshold: 203760, upTo: 610510, rate: 0.260, label: 'Trinn 2 (22% + 4.0%)' }, // NOK 318,300 to 725,050
        { threshold: 610510, upTo: 865560, rate: 0.357, label: 'Trinn 3 (22% + 13.7%)' }, // NOK 725,050 to 980,100
        { threshold: 865560, upTo: 1352660, rate: 0.388, label: 'Trinn 4 (22% + 16.8%)' }, // NOK 980,100 to 1,467,200
        { threshold: 1352660, rate: 0.398, label: 'Trinn 5 (22% + 17.8%)' }, // Over NOK 1,467,200
      ],
      socialContributions: [
        {
          id: 'trygdeavgift',
          name: 'National Insurance (Trygdeavgift)',
          rate: 0.076,
          employeeRate: 0.076,
          description: '7.6% member contribution on gross salary.',
        },
      ],
      vatConfig: {
        name: 'MVA',
        standardRate: 0.25, // 25%
        reducedRates: [
          { name: '15% (matvarer)', rate: 0.15 },
          { name: '12% (transport, kino, hotell)', rate: 0.12 },
        ],
      },
      officialSourceName: 'Skatteetaten (Norwegian Tax Administration) & Regjeringen',
      officialSourceUrl: 'https://www.skatteetaten.no',
      lastVerifiedDate: '2026-09-01',
      assumptions: [
        'Class 1 single wage earner resident in Norway',
        'Personfradrag applied (NOK 114,540)',
        'Standard Trygdeavgift (7.6%) and 2026 Trinnskatt steps applied',
      ],
    },
    '2025': {
      taxYear: '2025',
      currency: 'NOK',
      currencySymbol: 'kr',
      standardDeduction: 88250,
      nationalBrackets: [
        { threshold: 0, upTo: 128150, rate: 0.22, label: 'Base General Tax (22%)' },
        { threshold: 128150, upTo: 204600, rate: 0.237, label: 'Trinn 1 (22% + 1.7%)' },
        { threshold: 204600, upTo: 581750, rate: 0.260, label: 'Trinn 2 (22% + 4.0%)' },
        { threshold: 581750, upTo: 849650, rate: 0.356, label: 'Trinn 3 (22% + 13.6%)' },
        { threshold: 849650, upTo: 1261750, rate: 0.386, label: 'Trinn 4 (22% + 16.6%)' },
        { threshold: 1261750, rate: 0.396, label: 'Trinn 5 (22% + 17.6%)' },
      ],
      socialContributions: [
        {
          id: 'trygdeavgift',
          name: 'National Insurance (Trygdeavgift)',
          rate: 0.078,
          employeeRate: 0.078,
        },
      ],
      vatConfig: {
        name: 'MVA',
        standardRate: 0.25,
      },
      officialSourceName: 'Skatteetaten',
      officialSourceUrl: 'https://www.skatteetaten.no',
      lastVerifiedDate: '2025-01-15',
      assumptions: ['Single wage earner for 2025 tax year'],
    },
  },
};
