export interface TaxBracket {
  threshold: number; // Minimum taxable income for this bracket
  upTo?: number; // Upper limit of this bracket (undefined for top bracket)
  rate: number; // Marginal tax rate in decimal (e.g. 0.22 for 22%)
  fixedAmount?: number; // Base tax accumulated from previous brackets
  label?: string; // Optional label (e.g. "Basic Rate", "Higher Rate")
}

export interface SocialContributionRule {
  id: string;
  name: string;
  rate: number; // Decimal (e.g. 0.062 for 6.2%)
  employeeRate: number; // Decimal
  employerRate?: number; // Optional employer share
  minThreshold?: number; // Earnings below this are exempt
  capAmount?: number; // Maximum wage base subject to contribution
  isDeductibleFromIncomeTax?: boolean; // Whether contribution reduces taxable income
  description?: string;
}

export interface StandardDeductionRule {
  id: string;
  name: string;
  amount: number;
  type: 'fixed' | 'percentage' | 'formula';
  percentageRate?: number;
  minAmount?: number;
  maxAmount?: number;
  description?: string;
}

export interface RegionTaxConfig {
  code: string;
  name: string;
  brackets?: TaxBracket[];
  flatRate?: number;
  additionalTaxRate?: number;
  deductionAmount?: number;
  description?: string;
}

export interface VatGstRate {
  standardRate: number; // e.g. 0.20 for 20%
  reducedRates?: { name: string; rate: number }[];
  name: string; // "VAT", "GST", "Sales Tax", "IVA", "MwSt."
}

export type FilingStatus = 'single' | 'married_joint' | 'married_separate' | 'head_of_household' | 'qualifying_widow';

export interface FilingStatusConfig {
  id: FilingStatus;
  label: string;
  standardDeduction: number;
  seniorAdditionalDeduction?: number;
  blindAdditionalDeduction?: number;
  brackets?: TaxBracket[];
  capitalGainsBrackets?: TaxBracket[];
}

export interface TaxYearData {
  taxYear: string; // e.g. "2025" or "2025/26"
  currency: string; // "USD", "EUR", "GBP", etc.
  currencySymbol: string; // "$", "€", "£", etc.
  nationalBrackets: TaxBracket[];
  standardDeduction: number;
  personalAllowance?: number;
  socialContributions: SocialContributionRule[];
  regions?: RegionTaxConfig[];
  filingStatuses?: Partial<Record<FilingStatus, FilingStatusConfig>>;
  capitalGainsBrackets?: TaxBracket[];
  vatConfig: VatGstRate;
  officialSourceName: string;
  officialSourceUrl: string;
  lastVerifiedDate: string; // YYYY-MM-DD
  assumptions: string[];
  notes?: string;
}

export interface AdvancedTaxInputs {
  taxYear?: string;
  filingStatus?: FilingStatus;
  regionCode?: string;
  primaryW2Income: number;
  spouseW2Income?: number;
  businessNetIncome?: number;
  taxableInterest?: number;
  ordinaryDividends?: number;
  qualifiedDividends?: number;
  longTermCapitalGains?: number;
  otherIncome?: number;
  numChildrenUnder17?: number;
  numOtherDependents?: number;
  taxpayerAge65OrOver?: boolean;
  spouseAge65OrOver?: boolean;
  taxpayerBlind?: boolean;
  spouseBlind?: boolean;
  preTaxRetirement401k?: number;
  traditionalIraDeduction?: number;
  hsaDeduction?: number;
  studentLoanInterest?: number;
  deductionMode?: 'auto' | 'standard' | 'itemized';
  itemizedSaltStateLocalTax?: number;
  itemizedPropertyTax?: number;
  itemizedMortgageInterest?: number;
  itemizedCharitableDonations?: number;
  itemizedMedicalDentalExpenses?: number;
  federalTaxWithheld?: number;
  stateTaxWithheld?: number;
}

export interface AdvancedTaxResult {
  totalGrossIncome: number;
  earnedIncome: number;
  investmentIncome: number;
  selfEmploymentTax: number;
  deductibleSelfEmploymentTax: number;
  totalAdjustmentsToIncome: number;
  adjustedGrossIncome: number;
  standardDeductionAmount: number;
  itemizedDeductionsTotal: number;
  itemizedSaltAllowed: number;
  itemizedMedicalAllowed: number;
  deductionUsed: 'standard' | 'itemized';
  deductionAmount: number;
  itemizedAdvantage: number;
  taxableIncome: number;
  ordinaryTaxableIncome: number;
  preferentialTaxableIncome: number;
  regularIncomeTax: number;
  preferentialCapitalGainsTax: number;
  additionalMedicareTax: number;
  netInvestmentIncomeTax: number;
  grossFederalTax: number;
  childTaxCredit: number;
  otherDependentCredit: number;
  totalTaxCredits: number;
  netFederalIncomeTax: number;
  ficaSocialSecurity: number;
  ficaMedicare: number;
  totalFicaTax: number;
  totalFederalTaxes: number;
  stateIncomeTax: number;
  stateTaxName: string;
  totalAllTaxes: number;
  totalPaymentsAndWithholdings: number;
  federalRefundOrOwed: number;
  stateRefundOrOwed: number;
  combinedRefundOrOwed: number;
  netAnnualTakeHome: number;
  netMonthlyTakeHome: number;
  netBiweeklyTakeHome: number;
  netWeeklyTakeHome: number;
  netHourlyTakeHome: number;
  effectiveFederalRate: number;
  effectiveTotalTaxRate: number;
  marginalFederalRate: number;
}

export interface CountryTaxProfile {
  id: string; // slug e.g. "us", "ca", "uk", "germany"
  name: string;
  countryCode: string; // ISO 2-letter e.g. "US", "CA", "GB"
  flagEmoji: string;
  defaultCurrency: string;
  defaultCurrencySymbol: string;
  defaultTaxYear: string;
  availableTaxYears: string[];
  hasRegionalTax: boolean;
  regionalEntityName?: string; // "State", "Province", "Autonomous Community", "Canton"
  years: Record<string, TaxYearData>;
  metaDescription: string;
  faqItems: { question: string; answer: string }[];
}

export interface BracketCalculationDetail {
  bracketRange: string;
  ratePercent: string;
  taxableInBracket: number;
  taxAmount: number;
}

export interface SocialContributionDetail {
  name: string;
  ratePercent: string;
  amount: number;
  description?: string;
}

export interface TaxCalculationResult {
  countryId: string;
  countryName: string;
  taxYear: string;
  currency: string;
  currencySymbol: string;
  grossIncome: number;
  standardDeduction: number;
  taxableIncome: number;
  nationalIncomeTax: number;
  regionalIncomeTax: number;
  totalIncomeTax: number;
  socialContributions: SocialContributionDetail[];
  totalSocialContributions: number;
  totalTaxAndDeductions: number;
  netIncomeAnnual: number;
  netIncomeMonthly: number;
  netIncomeBiweekly: number;
  netIncomeWeekly: number;
  netIncomeDaily: number;
  netIncomeHourly: number;
  effectiveTaxRate: number; // In percentage e.g. 21.4
  effectiveTotalDeductionRate: number; // Income tax + social in percent
  marginalTaxRate: number; // Top marginal income tax rate in percent
  marginalTotalRate: number; // Top marginal income tax + social rate
  bracketBreakdown: BracketCalculationDetail[];
  assumptions: string[];
  officialSourceName: string;
  officialSourceUrl: string;
  lastVerifiedDate: string;
}
