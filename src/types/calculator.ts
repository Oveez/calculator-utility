export type CalculatorInputType = 'number' | 'range' | 'text' | 'textarea' | 'select' | 'date' | 'datetime-local';
export type CalculatorInputColSpan = 'full' | 'half' | 'third' | 'quarter';
export type CalculatorInputTier = 'basic' | 'advanced' | 'extended';

export interface CalculatorInputOption {
  label: string;
  value: string;
}

export interface CalculatorInput {
  id: string;
  label: string;
  type: CalculatorInputType;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  placeholder?: string;
  defaultValue?: string | number;
  options?: CalculatorInputOption[];
  // Responsive layout & progressive disclosure extensions
  colSpan?: CalculatorInputColSpan;
  tier?: CalculatorInputTier;
  helpText?: string;
  tooltip?: string;
  prefix?: string;
  suffix?: string;
  required?: boolean;
  errorMessage?: string;
}

export interface CalculatorFaqItem {
  question: string;
  answer: string;
}

export interface CalculatorExample {
  title: string;
  description: string;
  values: Record<string, number | string>;
  result?: string;
}

export interface CalculatorContent {
  intro: string;
  howItWorks: string;
  formulaExplanation: string;
  examples: CalculatorExample[];
}

export interface CalculatorParameterInfo {
  id?: string;
  name: string;
  description: string;
  type?: string;
  defaultValue?: string;
  whyItMatters?: string;
  typicalRange?: string;
  unit?: string;
}

export interface CalculatorMetric {
  id: string;
  label: string;
  value: number | string;
  formattedValue?: string;
  unit?: string;
  badge?: string;
  description?: string;
}

export interface CalculatorBreakdownItem {
  label: string;
  value: number;
  formattedValue: string;
  percentage?: number;
  color?: string;
}

export interface CalculatorChartDataset {
  label: string;
  data: number[];
  color?: string;
}

export interface CalculatorChartConfig {
  type: 'donut' | 'pie' | 'bar' | 'line';
  title?: string;
  labels: string[];
  datasets: CalculatorChartDataset[];
  summaryText?: string;
}

export interface CalculatorTableConfig {
  title?: string;
  headers: string[];
  rows: Array<Array<string | number>>;
  summaryRow?: Array<string | number>;
  maxInitialRows?: number;
}

export interface CalculatorDetailedResult {
  primary: {
    label: string;
    value: number | string;
    formattedValue: string;
    unit?: string;
    subtext?: string;
  };
  secondary?: CalculatorMetric[];
  breakdown?: CalculatorBreakdownItem[];
  chart?: CalculatorChartConfig;
  table?: CalculatorTableConfig;
  warnings?: string[];
  notes?: string[];
}

export type CalculatorFormulaResult = number | string | CalculatorDetailedResult;

export type CalculatorResultFormatter<T = any> = (value: T) => string;

export interface CalculatorConfig<T = any> {
  metaTitle?: string;
  slug: string;
  title: string;
  category: string;
  metaDescription: string;
  inputs: CalculatorInput[];
  formula: (values: Record<string, number | string>) => T;
  resultFormat: CalculatorResultFormatter<T>;
  faq: CalculatorFaqItem[];
  relatedSlugs: string[];
  content: CalculatorContent;
  parametersGuide?: CalculatorParameterInfo[];
}


export interface BreadcrumbItem {
  label: string;
  href?: string;
}

