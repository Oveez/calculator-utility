import type { CountryTaxProfile } from '../types';

export const dkProfile: CountryTaxProfile = {
  id: 'denmark',
  name: 'Denmark',
  countryCode: 'DK',
  flagEmoji: '🇩🇰',
  defaultCurrency: 'DKK',
  defaultCurrencySymbol: 'kr',
  defaultTaxYear: '2026',
  availableTaxYears: ['2026', '2025'],
  hasRegionalTax: true,
  regionalEntityName: 'Municipality (Kommune)',
  metaDescription: 'Calculate Danish income tax (Bundskat, Mellemskat, Topskat), AM-bidrag (8%), and net salary under the official 2026 Skattestyrelsen tax reform.',
  faqItems: [
    {
      question: 'What is the Danish tax reform structure for 2026?',
      answer: 'From 2026, Denmark implemented its tax reform featuring Personfradrag of 54,100 DKK, base Bundskat + Kommune (~36.91%), Mellemskat (7.5% on income over 641,200 DKK), and Topskat (7.5% over 777,900 DKK).',
    },
    {
      question: 'What is the AM-bidrag (Labour Market Contribution) in Denmark?',
      answer: 'AM-bidrag is a mandatory 8% flat contribution deducted from all gross employment income before calculating municipal and state income taxes.',
    },
  ],
  years: {
    '2026': {
      taxYear: '2026',
      currency: 'DKK',
      currencySymbol: 'kr',
      standardDeduction: 54100, // Personfradrag 2026
      nationalBrackets: [
        { threshold: 0, upTo: 587100, rate: 0.3691, label: 'Bundskat + Kommune (~36.91%)' }, // Base municipal + state up to Mellemskat
        { threshold: 587100, upTo: 723800, rate: 0.4441, label: 'Mellemskat Bracket (~44.41%)' }, // 36.91% + 7.5%
        { threshold: 723800, rate: 0.5191, label: 'Topskat Bracket (~51.91%)' }, // 44.41% + 7.5%
      ],
      socialContributions: [
        {
          id: 'am_bidrag',
          name: 'Labour Market Contribution (AM-bidrag)',
          rate: 0.08,
          employeeRate: 0.08,
          description: '8% statutory flat contribution on gross employment earnings.',
        },
      ],
      regions: [
        { code: 'copenhagen', name: 'København (~23.60%)', additionalTaxRate: -0.013 },
        { code: 'national_avg', name: 'National Average Kommune (~24.90%)', flatRate: 0 },
        { code: 'aarhus', name: 'Aarhus (~24.50%)', additionalTaxRate: -0.004 },
        { code: 'odense', name: 'Odense (~25.50%)', additionalTaxRate: 0.006 },
      ],
      vatConfig: {
        name: 'Moms',
        standardRate: 0.25, // 25%
        reducedRates: [{ name: 'Zero-rated (newspapers)', rate: 0.0 }],
      },
      officialSourceName: 'Skattestyrelsen (Danish Tax Agency)',
      officialSourceUrl: 'https://skat.dk',
      lastVerifiedDate: '2026-09-01',
      assumptions: [
        'Adult single taxpayer living in Denmark (skattepligtig)',
        'Personfradrag applied (DKK 54,100)',
        'Standard 8% AM-bidrag deducted from gross salary',
        '2026 tax reform scales (Mellemskat & Topskat) applied',
      ],
    },
    '2025': {
      taxYear: '2025',
      currency: 'DKK',
      currencySymbol: 'kr',
      standardDeduction: 51600,
      nationalBrackets: [
        { threshold: 0, upTo: 537300, rate: 0.3696, label: 'Bundskat + Kommune (~36.96%)' },
        { threshold: 537300, rate: 0.5196, label: 'Topskat Bracket (~51.96%)' },
      ],
      socialContributions: [
        {
          id: 'am_bidrag',
          name: 'Labour Market Contribution (AM-bidrag)',
          rate: 0.08,
          employeeRate: 0.08,
        },
      ],
      regions: [
        { code: 'national_avg', name: 'National Average Kommune (~24.90%)', flatRate: 0 },
      ],
      vatConfig: {
        name: 'Moms',
        standardRate: 0.25,
      },
      officialSourceName: 'Skattestyrelsen',
      officialSourceUrl: 'https://skat.dk',
      lastVerifiedDate: '2025-01-15',
      assumptions: ['Single taxpayer for 2025 tax year'],
    },
  },
};
