import type { CountryTaxProfile } from '../types';

export const plProfile: CountryTaxProfile = {
  id: 'poland',
  name: 'Poland',
  countryCode: 'PL',
  flagEmoji: '🇵🇱',
  defaultCurrency: 'PLN',
  defaultCurrencySymbol: 'zł',
  defaultTaxYear: '2025',
  availableTaxYears: ['2025'],
  hasRegionalTax: false,
  metaDescription: 'Calculate Polish PIT income tax (Skala podatkowa 12%/32%), ZUS social insurance (13.71%), and health insurance (9%) with official KAS / Podatki.gov.pl rates.',
  faqItems: [
    {
      question: 'What is the tax-free allowance (Kwota wolna od podatku) in Poland?',
      answer: 'The tax-free amount in Poland is 30,000 PLN per year under the progressive tax scale (12% tax reduction of 3,600 PLN).',
    },
    {
      question: 'How are ZUS and health contributions calculated in Poland?',
      answer: 'Employees on standard employment contracts (Umowa o pracę) pay 13.71% in ZUS social contributions (Pension 9.76%, Disability 1.50%, Sickness 2.45%), plus 9.00% in non-deductible health insurance (Składka zdrowotna).',
    },
  ],
  years: {
    '2025': {
      taxYear: '2025',
      currency: 'PLN',
      currencySymbol: 'zł',
      standardDeduction: 30000, // Kwota wolna od podatku
      nationalBrackets: [
        { threshold: 0, upTo: 90000, rate: 0.12, label: 'I Próg (12%)' }, // 30,000 to 120,000 PLN
        { threshold: 90000, rate: 0.32, label: 'II Próg (32%)' }, // Above 120,000 PLN
      ],
      socialContributions: [
        {
          id: 'zus_spoleczne',
          name: 'ZUS Social Contributions (Emerytalna, Rentowa, Chorobowa)',
          rate: 0.1371,
          employeeRate: 0.1371,
          capAmount: 240000, // 30x average salary annual cap
          description: '13.71% total employee ZUS social security contribution.',
        },
        {
          id: 'nfz_zdrowotna',
          name: 'Health Insurance (Składka Zdrowotna NFZ)',
          rate: 0.09,
          employeeRate: 0.09,
          description: '9.00% health insurance on earnings minus social security.',
        },
      ],
      vatConfig: {
        name: 'VAT (PTU)',
        standardRate: 0.23, // 23%
        reducedRates: [
          { name: '8% (budownictwo, transport)', rate: 0.08 },
          { name: '5% (żywność podstawowa, książki)', rate: 0.05 },
        ],
      },
      officialSourceName: 'Krajowa Administracja Skarbowa (KAS) / Ministerstwo Finansów (Podatki.gov.pl)',
      officialSourceUrl: 'https://www.podatki.gov.pl',
      lastVerifiedDate: '2025-01-15',
      assumptions: [
        'Standard full-time employment contract (Umowa o pracę)',
        'Standard tax-reducing amount (Kwota zmniejszająca podatek 3,600 zł) applied',
        'Standard employee ZUS (13.71%) and health insurance (9%) applied',
      ],
    },
  },
};
