import type { CountryTaxProfile } from '../types';

export const noProfile: CountryTaxProfile = {
  id: 'norway',
  name: 'Norway',
  countryCode: 'NO',
  flagEmoji: '🇳🇴',
  defaultCurrency: 'NOK',
  defaultCurrencySymbol: 'kr',
  defaultTaxYear: '2025',
  availableTaxYears: ['2025'],
  hasRegionalTax: false,
  metaDescription: 'Calculate Norwegian income tax (Alminnelig inntekt 22%), Trinnskatt (bracket tax), and Trygdeavgift (7.8%) with official Skatteetaten 2025 data.',
  faqItems: [
    {
      question: 'How is income tax calculated in Norway?',
      answer: 'Norway taxes income in two main layers: a flat 22% tax on general net income (alminnelig inntekt) after deductions (such as the personfradrag and minstefradrag), and a progressive bracket tax (trinnskatt) on gross salary ranging from 1.7% to 17.6%.',
    },
    {
      question: 'What is the employee National Insurance rate (Trygdeavgift) in Norway?',
      answer: 'Employees pay 7.8% Trygdeavgift on gross employment income.',
    },
  ],
  years: {
    '2025': {
      taxYear: '2025',
      currency: 'NOK',
      currencySymbol: 'kr',
      standardDeduction: 88250, // Personfradrag
      nationalBrackets: [
        { threshold: 0, upTo: 128150, rate: 0.22, label: 'Base General Tax (22%)' }, // Above Personfradrag up to Trinn 1
        { threshold: 128150, upTo: 204600, rate: 0.237, label: 'Trinn 1 (22% + 1.7%)' }, // NOK 216,400 to 292,850
        { threshold: 204600, upTo: 581750, rate: 0.260, label: 'Trinn 2 (22% + 4.0%)' }, // NOK 292,850 to 670,000
        { threshold: 581750, upTo: 849650, rate: 0.356, label: 'Trinn 3 (22% + 13.6%)' }, // NOK 670,000 to 937,900
        { threshold: 849650, upTo: 1261750, rate: 0.386, label: 'Trinn 4 (22% + 16.6%)' }, // NOK 937,900 to 1,350,000
        { threshold: 1261750, rate: 0.396, label: 'Trinn 5 (22% + 17.6%)' }, // Over NOK 1,350,000
      ],
      socialContributions: [
        {
          id: 'trygdeavgift',
          name: 'National Insurance (Trygdeavgift)',
          rate: 0.078,
          employeeRate: 0.078,
          description: '7.8% member contribution on gross salary.',
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
      officialSourceName: 'Skatteetaten (Norwegian Tax Administration)',
      officialSourceUrl: 'https://www.skatteetaten.no',
      lastVerifiedDate: '2025-01-15',
      assumptions: [
        'Class 1 single wage earner resident in Norway',
        'Personfradrag applied (NOK 88,250)',
        'Standard Trygdeavgift (7.8%) and Trinnskatt steps applied',
      ],
    },
  },
};
