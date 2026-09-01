import type { CountryTaxProfile } from '../types';

export const ieProfile: CountryTaxProfile = {
  id: 'ireland',
  name: 'Ireland',
  countryCode: 'IE',
  flagEmoji: '🇮🇪',
  defaultCurrency: 'EUR',
  defaultCurrencySymbol: '€',
  defaultTaxYear: '2026',
  availableTaxYears: ['2026', '2025'],
  hasRegionalTax: false,
  metaDescription: 'Calculate Irish PAYE income tax, Universal Social Charge (USC), and PRSI with official 2026 Revenue Commissioners rates, standard cut-off (€44,000), and USC tiers.',
  faqItems: [
    {
      question: 'What is the 2026 Standard Rate Cut-Off Point in Ireland?',
      answer: 'For a single individual in 2026, the standard rate cut-off point is €44,000. Income up to €44,000 is taxed at the 20% standard rate, and any balance is taxed at the 40% higher rate.',
    },
    {
      question: 'What are the 2026 USC (Universal Social Charge) rates in Ireland?',
      answer: 'USC rates for 2026 are: 0.5% on the first €12,012; 2.0% on €12,012 to €28,700; 3.0% on €28,700 to €70,044; and 8.0% on all balance above €70,044.',
    },
    {
      question: 'What is the employee PRSI rate in Ireland in 2026?',
      answer: 'Class A Employee PRSI (Pay Related Social Insurance) is 4.20% on weekly earnings over €352.',
    },
  ],
  years: {
    '2026': {
      taxYear: '2026',
      currency: 'EUR',
      currencySymbol: '€',
      standardDeduction: 20000, // Equivalent value of €4,000 tax credits (€2,000 Personal + €2,000 PAYE) at 20%
      nationalBrackets: [
        { threshold: 0, upTo: 24000, rate: 0.20, label: 'Standard Rate (20%)' }, // €20,000 to €44,000
        { threshold: 24000, rate: 0.40, label: 'Higher Rate (40%)' }, // Over €44,000
      ],
      socialContributions: [
        {
          id: 'usc',
          name: 'Universal Social Charge (USC)',
          rate: 0.035, // Blended effective baseline
          employeeRate: 0.035,
          description: 'Progressive USC (0.5% to €12k, 2% to €28.7k, 3% to €70k, 8% above).',
        },
        {
          id: 'prsi',
          name: 'PRSI (Class A)',
          rate: 0.042,
          employeeRate: 0.042,
          minThreshold: 18304,
          description: '4.20% Pay Related Social Insurance on earnings over threshold.',
        },
      ],
      vatConfig: {
        name: 'VAT',
        standardRate: 0.23, // 23%
        reducedRates: [
          { name: 'Reduced rate (tourism, hospitality, electricity)', rate: 0.135 },
          { name: 'Second reduced rate', rate: 0.09 },
        ],
      },
      officialSourceName: 'Revenue Commissioners (Irish Tax and Customs)',
      officialSourceUrl: 'https://www.revenue.ie',
      lastVerifiedDate: '2026-09-01',
      assumptions: [
        'Single person claiming standard Single Person Tax Credit (€2,000) and Employee Tax Credit (€2,000)',
        'Class A PRSI contributor (4.20%)',
        'Standard rate cut-off point of €44,000 applied',
      ],
    },
    '2025': {
      taxYear: '2025',
      currency: 'EUR',
      currencySymbol: '€',
      standardDeduction: 20000,
      nationalBrackets: [
        { threshold: 0, upTo: 24000, rate: 0.20, label: 'Standard Rate (20%)' },
        { threshold: 24000, rate: 0.40, label: 'Higher Rate (40%)' },
      ],
      socialContributions: [
        {
          id: 'usc',
          name: 'Universal Social Charge (USC)',
          rate: 0.035,
          employeeRate: 0.035,
        },
        {
          id: 'prsi',
          name: 'PRSI (Class A)',
          rate: 0.041,
          employeeRate: 0.041,
          minThreshold: 18304,
        },
      ],
      vatConfig: {
        name: 'VAT',
        standardRate: 0.23,
      },
      officialSourceName: 'Revenue Commissioners',
      officialSourceUrl: 'https://www.revenue.ie',
      lastVerifiedDate: '2025-01-15',
      assumptions: ['Single person for 2025 tax year'],
    },
  },
};
