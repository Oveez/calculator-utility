import type { CountryTaxProfile } from '../types';

export const fiProfile: CountryTaxProfile = {
  id: 'finland',
  name: 'Finland',
  countryCode: 'FI',
  flagEmoji: '🇫🇮',
  defaultCurrency: 'EUR',
  defaultCurrencySymbol: '€',
  defaultTaxYear: '2025',
  availableTaxYears: ['2025'],
  hasRegionalTax: true,
  regionalEntityName: 'Municipality (Kunta)',
  metaDescription: 'Calculate Finnish state and municipal income tax (Valtion tulovero & Kunnallisvero), Työeläke, and take-home pay with official Vero.fi 2025 rates.',
  faqItems: [
    {
      question: 'How is income tax calculated in Finland?',
      answer: 'Finnish income tax is divided into progressive state tax (Valtionvero) and municipal tax (Kunnallisvero, averaging ~7.50% to 8.60%). State tax begins above €20,900.',
    },
    {
      question: 'What are the employee social security deductions in Finland?',
      answer: 'Employees contribute 7.15% for employment pension (Työeläkevakuutusmaksu for employees under 53), 0.79% for unemployment insurance (Työttömyysvakuutusmaksu), and ~1.52% for healthcare contributions.',
    },
  ],
  years: {
    '2025': {
      taxYear: '2025',
      currency: 'EUR',
      currencySymbol: '€',
      standardDeduction: 20900, // State tax-free threshold
      nationalBrackets: [
        { threshold: 0, upTo: 11000, rate: 0.044, label: 'Valtionvero 4.40%' }, // €20,900 to €31,900
        { threshold: 11000, upTo: 30800, rate: 0.173, label: 'Valtionvero 17.30%' }, // €31,900 to €51,700
        { threshold: 30800, upTo: 67300, rate: 0.308, label: 'Valtionvero 30.80%' }, // €51,700 to €88,200
        { threshold: 67300, upTo: 129100, rate: 0.340, label: 'Valtionvero 34.00%' }, // €88,200 to €150,000
        { threshold: 129100, rate: 0.4425, label: 'Valtionvero Top (44.25%)' }, // Over €150,000
      ],
      socialContributions: [
        {
          id: 'tyoelake',
          name: 'Pension Insurance (Työeläkemaksu)',
          rate: 0.0715,
          employeeRate: 0.0715,
          description: '7.15% employee pension contribution (under 53 years old).',
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
          rate: 0.0152,
          employeeRate: 0.0152,
          description: 'Healthcare and daily allowance insurance contribution.',
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
        standardRate: 0.255, // 25.5% (increased from 24% late 2024 / 2025)
        reducedRates: [
          { name: '14% (ruoka, ravintolapalvelut)', rate: 0.14 },
          { name: '10% (kirjat, lääkkeet)', rate: 0.10 },
        ],
      },
      officialSourceName: 'Verohallinto (Finnish Tax Administration - Vero.fi)',
      officialSourceUrl: 'https://www.vero.fi',
      lastVerifiedDate: '2025-01-15',
      assumptions: [
        'Single employee under 53 years of age',
        'State income tax scale and selected municipal tax rate applied',
        'Standard pension and unemployment insurance contributions deducted',
      ],
    },
  },
};
