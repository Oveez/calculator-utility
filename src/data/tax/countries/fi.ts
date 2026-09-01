import type { CountryTaxProfile } from '../types';

export const fiProfile: CountryTaxProfile = {
  id: 'finland',
  name: 'Finland',
  countryCode: 'FI',
  flagEmoji: '🇫🇮',
  defaultCurrency: 'EUR',
  defaultCurrencySymbol: '€',
  defaultTaxYear: '2026',
  availableTaxYears: ['2026', '2025'],
  hasRegionalTax: true,
  regionalEntityName: 'Municipality (Kunta)',
  metaDescription: 'Calculate Finnish state and municipal income tax (Valtion tulovero & Kunnallisvero), Työeläke (7.30%), and take-home pay with official Vero.fi 2026 rates.',
  faqItems: [
    {
      question: 'How is income tax calculated in Finland for 2026?',
      answer: 'Finnish income tax is divided into progressive state tax (Valtionvero) and municipal tax (Kunnallisvero, averaging ~7.50% to 8.60%). State tax begins above €22,000 in 2026.',
    },
    {
      question: 'What are the employee social security deductions in Finland for 2026?',
      answer: 'Employees contribute 7.30% for employment pension (Työeläkevakuutusmaksu), 0.79% for unemployment insurance, and ~1.10% for healthcare contributions.',
    },
  ],
  years: {
    '2026': {
      taxYear: '2026',
      currency: 'EUR',
      currencySymbol: '€',
      standardDeduction: 22000, // State tax-free threshold 2026
      nationalBrackets: [
        { threshold: 0, upTo: 10600, rate: 0.190, label: 'Valtionvero 19.00%' }, // €22,000 to €32,600
        { threshold: 10600, upTo: 18100, rate: 0.3025, label: 'Valtionvero 30.25%' }, // €32,600 to €40,100
        { threshold: 18100, upTo: 30100, rate: 0.3325, label: 'Valtionvero 33.25%' }, // €40,100 to €52,100
        { threshold: 30100, rate: 0.375, label: 'Valtionvero Top (37.50%)' }, // Over €52,100
      ],
      socialContributions: [
        {
          id: 'tyoelake',
          name: 'Pension Insurance (Työeläkemaksu)',
          rate: 0.073,
          employeeRate: 0.073,
          description: '7.30% employee pension contribution.',
        },
        {
          id: 'tyottomyys',
          name: 'Unemployment (Työttömyysvakuutus)',
          rate: 0.0079,
          employeeRate: 0.0079,
          description: '0.79% statutory unemployment insurance contribution.',
        },
        {
          id: 'sairaus',
          name: 'Health Insurance (Sairausvakuutus)',
          rate: 0.011,
          employeeRate: 0.011,
          description: '1.10% healthcare insurance contribution.',
        },
      ],
      regions: [
        { code: 'helsinki', name: 'Helsinki (5.30% Municipal)', additionalTaxRate: 0.053 },
        { code: 'national_avg', name: 'National Average Municipal (~7.50%)', additionalTaxRate: 0.075 },
        { code: 'tampere', name: 'Tampere (7.60% Municipal)', additionalTaxRate: 0.076 },
        { code: 'turku', name: 'Turku (8.10% Municipal)', additionalTaxRate: 0.081 },
      ],
      vatConfig: {
        name: 'ALV',
        standardRate: 0.255, // 25.5%
        reducedRates: [
          { name: '14% (ruoka, ravintolapalvelut)', rate: 0.14 },
          { name: '10% (kirjat, lääkkeet)', rate: 0.10 },
        ],
      },
      officialSourceName: 'Verohallinto (Finnish Tax Administration - Vero.fi)',
      officialSourceUrl: 'https://www.vero.fi',
      lastVerifiedDate: '2026-09-01',
      assumptions: [
        'Single resident employee',
        'State income tax scale and selected municipal tax rate applied',
        '2026 pension (TyEL 7.30%) and unemployment insurance contributions deducted',
      ],
    },
    '2025': {
      taxYear: '2025',
      currency: 'EUR',
      currencySymbol: '€',
      standardDeduction: 20900,
      nationalBrackets: [
        { threshold: 0, upTo: 11000, rate: 0.044, label: 'Valtionvero 4.40%' },
        { threshold: 11000, upTo: 30800, rate: 0.173, label: 'Valtionvero 17.30%' },
        { threshold: 30800, upTo: 67300, rate: 0.308, label: 'Valtionvero 30.80%' },
        { threshold: 67300, upTo: 129100, rate: 0.340, label: 'Valtionvero 34.00%' },
        { threshold: 129100, rate: 0.4425, label: 'Valtionvero Top (44.25%)' },
      ],
      socialContributions: [
        {
          id: 'tyoelake',
          name: 'Pension Insurance (Työeläkemaksu)',
          rate: 0.0715,
          employeeRate: 0.0715,
        },
        {
          id: 'tyottomyys',
          name: 'Unemployment (Työttömyysvakuutus)',
          rate: 0.0079,
          employeeRate: 0.0079,
        },
        {
          id: 'sairaus',
          name: 'Health Insurance (Sairausvakuutus)',
          rate: 0.0152,
          employeeRate: 0.0152,
        },
      ],
      regions: [
        { code: 'national_avg', name: 'National Average Municipal (~7.50%)', additionalTaxRate: 0.075 },
      ],
      vatConfig: {
        name: 'ALV',
        standardRate: 0.255,
      },
      officialSourceName: 'Verohallinto (Vero.fi)',
      officialSourceUrl: 'https://www.vero.fi',
      lastVerifiedDate: '2025-01-15',
      assumptions: ['Single employee for 2025 tax year'],
    },
  },
};
