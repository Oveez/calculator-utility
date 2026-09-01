import type { CountryTaxProfile } from '../types';

export const chProfile: CountryTaxProfile = {
  id: 'switzerland',
  name: 'Switzerland',
  countryCode: 'CH',
  flagEmoji: '🇨🇭',
  defaultCurrency: 'CHF',
  defaultCurrencySymbol: 'CHF',
  defaultTaxYear: '2026',
  availableTaxYears: ['2026', '2025'],
  hasRegionalTax: true,
  regionalEntityName: 'Canton',
  metaDescription: 'Calculate Swiss federal, cantonal, and municipal taxes, AHV/IV/EO, and ALV social security deductions with official 2026 Federal Tax Administration (ESTV) data.',
  faqItems: [
    {
      question: 'How is income tax structured in Switzerland for 2026?',
      answer: 'Swiss income tax is levied at three levels: Federal (Direkte Bundessteuer), Cantonal (Staatssteuer), and Municipal (Gemeindesteuer). Federal tax rates range from 0.77% to 11.5% for single persons, while cantonal/municipal taxes vary by canton.',
    },
    {
      question: 'What are mandatory 1st pillar social deductions in Switzerland in 2026?',
      answer: 'Employees contribute 5.30% for AHV/IV/EO (old age, disability, loss of income) with no income ceiling, and 1.10% for ALV (unemployment insurance) on earnings up to CHF 148,200.',
    },
  ],
  years: {
    '2026': {
      taxYear: '2026',
      currency: 'CHF',
      currencySymbol: 'CHF',
      standardDeduction: 15400, // Federal tax exemption threshold for single
      nationalBrackets: [
        { threshold: 0, upTo: 17800, rate: 0.0077, label: 'Federal 0.77%' },
        { threshold: 17800, upTo: 29700, rate: 0.0088, label: 'Federal 0.88%' },
        { threshold: 29700, upTo: 44000, rate: 0.0264, label: 'Federal 2.64%' },
        { threshold: 44000, upTo: 60600, rate: 0.0297, label: 'Federal 2.97%' },
        { threshold: 60600, upTo: 82000, rate: 0.0594, label: 'Federal 5.94%' },
        { threshold: 82000, upTo: 110500, rate: 0.0660, label: 'Federal 6.60%' },
        { threshold: 110500, upTo: 144000, rate: 0.0880, label: 'Federal 8.80%' },
        { threshold: 144000, upTo: 189100, rate: 0.1100, label: 'Federal 11.00%' },
        { threshold: 189100, rate: 0.1150, label: 'Federal Top Rate (11.50%)' },
      ],
      socialContributions: [
        {
          id: 'ahv_iv_eo',
          name: 'AHV / IV / EO (1st Pillar)',
          rate: 0.053,
          employeeRate: 0.053,
          description: '5.30% mandatory employee state pension and disability insurance.',
        },
        {
          id: 'alv',
          name: 'ALV (Unemployment Insurance)',
          rate: 0.011,
          employeeRate: 0.011,
          capAmount: 148200,
          description: '1.10% unemployment contribution up to statutory ceiling (CHF 148,200).',
        },
      ],
      regions: [
        { code: 'zh', name: 'Zürich (Est. Cantonal/Municipal ~12%)', additionalTaxRate: 0.12 },
        { code: 'ge', name: 'Geneva (Est. Cantonal/Municipal ~17%)', additionalTaxRate: 0.17 },
        { code: 'vd', name: 'Vaud (Est. Cantonal/Municipal ~16%)', additionalTaxRate: 0.16 },
        { code: 'zg', name: 'Zug (Low-tax Canton ~8%)', additionalTaxRate: 0.08 },
        { code: 'bs', name: 'Basel-Stadt (~15%)', additionalTaxRate: 0.15 },
        { code: 'fed_only', name: 'Direct Federal Tax Only', flatRate: 0 },
      ],
      vatConfig: {
        name: 'MWST / TVA',
        standardRate: 0.081, // 8.1% standard Swiss VAT
        reducedRates: [
          { name: 'Reduzierter Satz (food, books, meds)', rate: 0.026 },
          { name: 'Sondersatz (lodging)', rate: 0.038 },
        ],
      },
      officialSourceName: 'Eidgenössische Steuerverwaltung (ESTV) / Federal Tax Administration',
      officialSourceUrl: 'https://www.estv.admin.ch',
      lastVerifiedDate: '2026-09-01',
      assumptions: [
        'Single taxpayer without children (Tarif A)',
        'Standard 1st pillar social insurance contributions (AHV/IV/EO 5.3%, ALV 1.1%)',
        'Optional cantonal/communal multiplier estimated for selected canton',
      ],
    },
    '2025': {
      taxYear: '2025',
      currency: 'CHF',
      currencySymbol: 'CHF',
      standardDeduction: 15400,
      nationalBrackets: [
        { threshold: 0, upTo: 17800, rate: 0.0077, label: 'Federal 0.77%' },
        { threshold: 17800, upTo: 29700, rate: 0.0088, label: 'Federal 0.88%' },
        { threshold: 29700, upTo: 44000, rate: 0.0264, label: 'Federal 2.64%' },
        { threshold: 44000, upTo: 60600, rate: 0.0297, label: 'Federal 2.97%' },
        { threshold: 60600, upTo: 82000, rate: 0.0594, label: 'Federal 5.94%' },
        { threshold: 82000, upTo: 110500, rate: 0.0660, label: 'Federal 6.60%' },
        { threshold: 110500, upTo: 144000, rate: 0.0880, label: 'Federal 8.80%' },
        { threshold: 144000, upTo: 189100, rate: 0.1100, label: 'Federal 11.00%' },
        { threshold: 189100, rate: 0.1150, label: 'Federal Top Rate (11.50%)' },
      ],
      socialContributions: [
        {
          id: 'ahv_iv_eo',
          name: 'AHV / IV / EO (1st Pillar)',
          rate: 0.053,
          employeeRate: 0.053,
        },
        {
          id: 'alv',
          name: 'ALV (Unemployment Insurance)',
          rate: 0.011,
          employeeRate: 0.011,
          capAmount: 148200,
        },
      ],
      regions: [
        { code: 'zh', name: 'Zürich', additionalTaxRate: 0.12 },
      ],
      vatConfig: {
        name: 'MWST / TVA',
        standardRate: 0.081,
      },
      officialSourceName: 'ESTV',
      officialSourceUrl: 'https://www.estv.admin.ch',
      lastVerifiedDate: '2025-01-15',
      assumptions: ['Single taxpayer for 2025 tax year'],
    },
  },
};
