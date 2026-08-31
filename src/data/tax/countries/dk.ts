import type { CountryTaxProfile } from '../types';

export const dkProfile: CountryTaxProfile = {
  id: 'denmark',
  name: 'Denmark',
  countryCode: 'DK',
  flagEmoji: '🇩🇰',
  defaultCurrency: 'DKK',
  defaultCurrencySymbol: 'kr',
  defaultTaxYear: '2025',
  availableTaxYears: ['2025'],
  hasRegionalTax: true,
  regionalEntityName: 'Municipality (Kommune)',
  metaDescription: 'Calculate Danish income tax (Bundskat, Kommune, Topskat), AM-bidrag (8%), and net salary with official Skattestyrelsen 2025 rates.',
  faqItems: [
    {
      question: 'What is the AM-bidrag (Labour Market Contribution) in Denmark?',
      answer: 'AM-bidrag is a mandatory 8% flat contribution deducted from all gross employment income before calculating municipal and state income taxes.',
    },
    {
      question: 'What is the Danish Topskat threshold in 2025?',
      answer: 'Topskat is an additional 15% state tax levied on personal income after AM-bidrag that exceeds DKK 588,900 per year.',
    },
  ],
  years: {
    '2025': {
      taxYear: '2025',
      currency: 'DKK',
      currencySymbol: 'kr',
      standardDeduction: 51600, // Personfradrag
      nationalBrackets: [
        { threshold: 0, upTo: 537300, rate: 0.3696, label: 'Bundskat + Kommune (~36.96%)' }, // Base municipal + state
        { threshold: 537300, rate: 0.5196, label: 'Topskat Bracket (~51.96%)' }, // 36.96% + 15%
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
      lastVerifiedDate: '2025-01-15',
      assumptions: [
        'Adult single taxpayer living in Denmark (skattepligtig)',
        'Personfradrag applied (DKK 51,600)',
        'Standard 8% AM-bidrag deducted from gross salary',
        'Church tax (Kirkeskat ~0.88%) not included',
      ],
    },
  },
};
