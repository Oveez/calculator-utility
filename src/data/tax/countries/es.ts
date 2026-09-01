import type { CountryTaxProfile } from '../types';

export const esProfile: CountryTaxProfile = {
  id: 'spain',
  name: 'Spain',
  countryCode: 'ES',
  flagEmoji: '🇪🇸',
  defaultCurrency: 'EUR',
  defaultCurrencySymbol: '€',
  defaultTaxYear: '2026',
  availableTaxYears: ['2026', '2025'],
  hasRegionalTax: true,
  regionalEntityName: 'Autonomous Community',
  metaDescription: 'Calculate Spanish IRPF income tax, Seguridad Social employee contributions, and net take-home salary with official 2026 Agencia Tributaria & Seguridad Social rates.',
  faqItems: [
    {
      question: 'How is IRPF calculated in Spain for 2026?',
      answer: 'IRPF consists of a state portion (gravamen estatal) and an autonomous community portion (gravamen autonómico). Baseline combined rates range from 19% on income up to €12,450 to 47% on income over €300,000.',
    },
    {
      question: 'What is the Spanish Mínimo Personal in 2026?',
      answer: 'The general personal and family minimum (Mínimo personal y familiar) is €5,550 for individual taxpayers under 65, which acts as the basic tax-exempt threshold.',
    },
    {
      question: 'What is the maximum Social Security contribution base in Spain for 2026?',
      answer: 'For 2026, the maximum monthly contribution base (Base máxima de cotización) is €5,101.20 (€61,214.40 annually), on which employees pay ~6.47% to 6.50% in standard contributions.',
    },
  ],
  years: {
    '2026': {
      taxYear: '2026',
      currency: 'EUR',
      currencySymbol: '€',
      standardDeduction: 5550, // Mínimo personal general
      nationalBrackets: [
        { threshold: 0, upTo: 6900, rate: 0.19, label: 'Tramo 1 (19%)' }, // €5,550 to €12,450
        { threshold: 6900, upTo: 14650, rate: 0.24, label: 'Tramo 2 (24%)' }, // €12,450 to €20,200
        { threshold: 14650, upTo: 29650, rate: 0.30, label: 'Tramo 3 (30%)' }, // €20,200 to €35,200
        { threshold: 29650, upTo: 54450, rate: 0.37, label: 'Tramo 4 (37%)' }, // €35,200 to €60,000
        { threshold: 54450, upTo: 294450, rate: 0.45, label: 'Tramo 5 (45%)' }, // €60,000 to €300,000
        { threshold: 294450, rate: 0.47, label: 'Tramo 6 (47%)' }, // Over €300,000
      ],
      socialContributions: [
        {
          id: 'seguridad_social',
          name: 'Seguridad Social (Trabajador)',
          rate: 0.0647,
          employeeRate: 0.0647,
          capAmount: 61214.40, // Base máxima anual 2026 (€5,101.20 * 12)
          description: 'Contingencias comunes (4.70%) + Desempleo (1.55%) + Formación (0.10%) + MEI (0.12%).',
        },
      ],
      regions: [
        { code: 'general', name: 'General State/Regional Baseline', flatRate: 0 },
        { code: 'madrid', name: 'Comunidad de Madrid (Lower regional scale)', additionalTaxRate: -0.015 },
        { code: 'catalonia', name: 'Cataluña (Slightly higher top scale)', additionalTaxRate: 0.015 },
        { code: 'andalucia', name: 'Andalucía', flatRate: 0 },
        { code: 'valencia', name: 'Comunidad Valenciana', additionalTaxRate: 0.01 },
      ],
      vatConfig: {
        name: 'IVA',
        standardRate: 0.21, // 21%
        reducedRates: [
          { name: 'Reducido (10%)', rate: 0.10 },
          { name: 'Superreducido (4%)', rate: 0.04 },
        ],
      },
      officialSourceName: 'Agencia Estatal de Administración Tributaria (AEAT) & Seguridad Social',
      officialSourceUrl: 'https://sede.agenciatributaria.gob.es',
      lastVerifiedDate: '2026-09-01',
      assumptions: [
        'Single individual under 65 years with no dependent children',
        'Standard employee contract (Régimen General de la Seguridad Social)',
        'Mínimo personal general applied (€5,550)',
      ],
    },
    '2025': {
      taxYear: '2025',
      currency: 'EUR',
      currencySymbol: '€',
      standardDeduction: 5550,
      nationalBrackets: [
        { threshold: 0, upTo: 6900, rate: 0.19, label: 'Tramo 1 (19%)' },
        { threshold: 6900, upTo: 14650, rate: 0.24, label: 'Tramo 2 (24%)' },
        { threshold: 14650, upTo: 29650, rate: 0.30, label: 'Tramo 3 (30%)' },
        { threshold: 29650, upTo: 54450, rate: 0.37, label: 'Tramo 4 (37%)' },
        { threshold: 54450, upTo: 294450, rate: 0.45, label: 'Tramo 5 (45%)' },
        { threshold: 294450, rate: 0.47, label: 'Tramo 6 (47%)' },
      ],
      socialContributions: [
        {
          id: 'seguridad_social',
          name: 'Seguridad Social (Trabajador)',
          rate: 0.0647,
          employeeRate: 0.0647,
          capAmount: 56646,
        },
      ],
      regions: [
        { code: 'general', name: 'General State/Regional Baseline', flatRate: 0 },
      ],
      vatConfig: {
        name: 'IVA',
        standardRate: 0.21,
      },
      officialSourceName: 'Agencia Estatal de Administración Tributaria (AEAT)',
      officialSourceUrl: 'https://sede.agenciatributaria.gob.es',
      lastVerifiedDate: '2025-01-15',
      assumptions: ['Single individual under 65 for 2025 tax year'],
    },
  },
};
