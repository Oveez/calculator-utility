import type { CountryTaxProfile } from '../types';

export const atProfile: CountryTaxProfile = {
  id: 'austria',
  name: 'Austria',
  countryCode: 'AT',
  flagEmoji: '🇦🇹',
  defaultCurrency: 'EUR',
  defaultCurrencySymbol: '€',
  defaultTaxYear: '2026',
  availableTaxYears: ['2026', '2025'],
  hasRegionalTax: false,
  metaDescription: 'Calculate Austrian income tax (Einkommensteuer / Lohnsteuer), social insurance (SV ~18.12%), and net salary with official 2026 BMF inflation-adjusted brackets (€13,539 Grundfreibetrag).',
  faqItems: [
    {
      question: 'What is the tax-free basic allowance (Grundfreibetrag) in Austria for 2026?',
      answer: 'For 2026, annual income up to €13,539 is taxed at 0% (Grundfreibetrag adjusted for kalte Progression).',
    },
    {
      question: 'What are the employee social security rates in Austria in 2026?',
      answer: 'Employees contribute 18.12% to statutory social insurance (Pensionsversicherung 10.25%, Krankenversicherung 3.87%, Arbeitslosenversicherung 3.00%, and Wohnbauförderung 0.50%) up to the statutory Höchstbeitragsgrundlage.',
    },
  ],
  years: {
    '2026': {
      taxYear: '2026',
      currency: 'EUR',
      currencySymbol: '€',
      standardDeduction: 13539, // Grundfreibetrag 2026
      nationalBrackets: [
        { threshold: 0, upTo: 8820, rate: 0.20, label: 'Stufe 1 (20%)' }, // €13,539 to €22,359
        { threshold: 8820, upTo: 23347, rate: 0.30, label: 'Stufe 2 (30%)' }, // €22,359 to €36,886
        { threshold: 23347, upTo: 56806, rate: 0.40, label: 'Stufe 3 (40%)' }, // €36,886 to €70,345
        { threshold: 56806, upTo: 91316, rate: 0.48, label: 'Stufe 4 (48%)' }, // €70,345 to €104,855
        { threshold: 91316, upTo: 986461, rate: 0.50, label: 'Stufe 5 (50%)' }, // €104,855 to €1,000,000
        { threshold: 986461, rate: 0.55, label: 'Spitzensteuersatz (55%)' }, // Over €1,000,000
      ],
      socialContributions: [
        {
          id: 'sozialversicherung',
          name: 'Sozialversicherung Dienstnehmer (SV)',
          rate: 0.1812,
          employeeRate: 0.1812,
          capAmount: 82200, // Höchstbeitragsgrundlage annual 2026
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
      lastVerifiedDate: '2026-09-01',
      assumptions: [
        'Single employee without children (Angestellter / Arbeiter)',
        'Standard social security contribution of 18.12% deducted before tax',
        'Official 2026 progressive inflation-adjusted EStG brackets applied',
      ],
    },
    '2025': {
      taxYear: '2025',
      currency: 'EUR',
      currencySymbol: '€',
      standardDeduction: 13308,
      nationalBrackets: [
        { threshold: 0, upTo: 8671, rate: 0.20, label: 'Stufe 1 (20%)' },
        { threshold: 8671, upTo: 22951, rate: 0.30, label: 'Stufe 2 (30%)' },
        { threshold: 22951, upTo: 55841, rate: 0.40, label: 'Stufe 3 (40%)' },
        { threshold: 55841, upTo: 89764, rate: 0.48, label: 'Stufe 4 (48%)' },
        { threshold: 89764, upTo: 986692, rate: 0.50, label: 'Stufe 5 (50%)' },
        { threshold: 986692, rate: 0.55, label: 'Spitzensteuersatz (55%)' },
      ],
      socialContributions: [
        {
          id: 'sozialversicherung',
          name: 'Sozialversicherung Dienstnehmer (SV)',
          rate: 0.1812,
          employeeRate: 0.1812,
          capAmount: 77400,
        },
      ],
      vatConfig: {
        name: 'Umsatzsteuer (USt)',
        standardRate: 0.20,
      },
      officialSourceName: 'Bundesministerium für Finanzen (BMF)',
      officialSourceUrl: 'https://www.bmf.gv.at',
      lastVerifiedDate: '2025-01-15',
      assumptions: ['Single employee for 2025 tax year'],
    },
  },
};
