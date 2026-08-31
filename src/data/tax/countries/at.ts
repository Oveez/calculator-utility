import type { CountryTaxProfile } from '../types';

export const atProfile: CountryTaxProfile = {
  id: 'austria',
  name: 'Austria',
  countryCode: 'AT',
  flagEmoji: '🇦🇹',
  defaultCurrency: 'EUR',
  defaultCurrencySymbol: '€',
  defaultTaxYear: '2025',
  availableTaxYears: ['2025'],
  hasRegionalTax: false,
  metaDescription: 'Calculate Austrian income tax (Einkommensteuer / Lohnsteuer), social insurance (SV ~18.12%), and net salary with official 2025 BMF brackets.',
  faqItems: [
    {
      question: 'What is the tax-free basic allowance (Grundfreibetrag) in Austria?',
      answer: 'For 2025, annual income up to €13,308 is taxed at 0% (Grundfreibetrag).',
    },
    {
      question: 'What are the employee social security rates in Austria?',
      answer: 'Employees contribute 18.12% to statutory social insurance (Pensionsversicherung 10.25%, Krankenversicherung 3.87%, Arbeitslosenversicherung 3.00%, and Wohnbauförderung 0.50%) up to the maximum monthly contribution base of €6,450.',
    },
  ],
  years: {
    '2025': {
      taxYear: '2025',
      currency: 'EUR',
      currencySymbol: '€',
      standardDeduction: 13308, // 0% bracket limit
      nationalBrackets: [
        { threshold: 0, upTo: 8671, rate: 0.20, label: 'Stufe 1 (20%)' }, // €13,308 to €21,979
        { threshold: 8671, upTo: 22951, rate: 0.30, label: 'Stufe 2 (30%)' }, // €21,979 to €36,259
        { threshold: 22951, upTo: 55841, rate: 0.40, label: 'Stufe 3 (40%)' }, // €36,259 to €69,149
        { threshold: 55841, upTo: 89764, rate: 0.48, label: 'Stufe 4 (48%)' }, // €69,149 to €103,072
        { threshold: 89764, upTo: 986692, rate: 0.50, label: 'Stufe 5 (50%)' }, // €103,072 to €1,000,000
        { threshold: 986692, rate: 0.55, label: 'Spitzensteuersatz (55%)' }, // Over €1,000,000
      ],
      socialContributions: [
        {
          id: 'sozialversicherung',
          name: 'Sozialversicherung Dienstnehmer (SV)',
          rate: 0.1812,
          employeeRate: 0.1812,
          capAmount: 77400, // Höchstbeitragsgrundlage annual (€6,450 * 12)
          description: '18.12% employee statutory social insurance (Pension, Health, Unemployment, Housing).',
        },
      ],
      vatConfig: {
        name: 'Umsatzsteuer (USt)',
        standardRate: 0.20, // 20%
        reducedRates: [
          { name: 'Ermäßigt 10% (food, rent, books)', rate: 0.10 },
          { name: 'Ermäßigt 13% (plants, cultural events)', rate: 0.13 },
        ],
      },
      officialSourceName: 'Bundesministerium für Finanzen (BMF)',
      officialSourceUrl: 'https://www.bmf.gv.at',
      lastVerifiedDate: '2025-01-15',
      assumptions: [
        'Single employee without children (Angestellter / Arbeiter)',
        'Standard social security contribution of 18.12% deducted before tax',
        'Official 2025 progressive inflation-adjusted EStG brackets applied',
      ],
    },
  },
};
