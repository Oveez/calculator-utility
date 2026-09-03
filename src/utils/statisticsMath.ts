/**
 * High-precision statistical calculations running client-side.
 */

// Abramowitz and Stegun approximation for standard normal error function erf(x)
export function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  const absX = Math.abs(x);

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return sign * y;
}

// Standard normal cumulative distribution function Φ(z)
export function standardNormalCdf(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

// Critical Z value lookup for standard confidence levels
export function getCriticalZ(confidenceLevel: number): number {
  const cl = confidenceLevel > 1 ? confidenceLevel / 100 : confidenceLevel;
  const alpha = 1 - cl;
  const p = 1 - alpha / 2;

  // Approximate inverse normal CDF (Acklam's algorithm or accurate closed values)
  if (Math.abs(cl - 0.90) < 0.005) return 1.644853;
  if (Math.abs(cl - 0.95) < 0.005) return 1.959964;
  if (Math.abs(cl - 0.98) < 0.005) return 2.326348;
  if (Math.abs(cl - 0.99) < 0.005) return 2.575829;
  if (Math.abs(cl - 0.999) < 0.0005) return 3.290527;

  // Rational approximation for general inverse CDF (Beasley-Springer-Moro)
  return inverseNormalCdf(p);
}

// Rational approximation for inverse standard normal CDF
export function inverseNormalCdf(p: number): number {
  const safeP = Math.max(1e-9, Math.min(1 - 1e-9, p));
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.383577518672690e2, -3.066479806614716e1, 2.506628277459239e0];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838e0, -2.549732539343734e0, 4.374664141464968e0, 2.938163982698783e0];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996e0, 3.754408661907416e0];

  const q = safeP - 0.5;
  if (Math.abs(q) <= 0.42) {
    const r = q * q;
    return q * (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1.0);
  } else {
    const r = safeP < 0.5 ? safeP : 1.0 - safeP;
    const s = Math.log(-Math.log(r));
    let x = c[0] + s * (c[1] + s * (c[2] + s * (c[3] + s * (c[4] + s * c[5]))));
    const denom = 1.0 + s * (d[0] + s * (d[1] + s * (d[2] + s * d[3])));
    x = x / denom;
    return safeP < 0.5 ? -x : x;
  }
}

// Student's t distribution CDF approximation (Hill's algorithm)
export function studentTCdf(t: number, df: number): number {
  if (df <= 0) return 0.5;
  if (df === 1) {
    return 0.5 + (Math.atan(t) / Math.PI);
  }
  if (df >= 100) {
    return standardNormalCdf(t);
  }

  // Regularized incomplete beta function approximation for Student-t
  const x = df / (df + t * t);
  const prob = 0.5 * incompleteBeta(df / 2, 0.5, x);
  return t >= 0 ? 1 - prob : prob;
}

// Continued fraction for incomplete beta function I_x(a, b)
function incompleteBeta(a: number, b: number, x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;

  // Symmetrical transformation
  if (x > (a + 1) / (a + b + 2)) {
    return 1 - incompleteBeta(b, a, 1 - x);
  }

  const lbeta = logGamma(a) + logGamma(b) - logGamma(a + b);
  const front = Math.exp(Math.log(x) * a + Math.log(1 - x) * b - lbeta) / a;

  // Lentz's method for continued fraction
  let f = 1;
  let c = 1;
  let d = 0;
  const maxIterations = 200;
  const eps = 1e-12;

  for (let m = 1; m <= maxIterations; m++) {
    const m2 = 2 * m;
    let numerator = (m * (b - m) * x) / ((a + m2 - 1) * (a + m2));
    d = 1 + numerator * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + numerator / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    f *= c * d;

    numerator = -((a + m) * (a + b + m) * x) / ((a + m2) * (a + m2 + 1));
    d = 1 + numerator * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + numerator / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    const delta = c * d;
    f *= delta;

    if (Math.abs(delta - 1) < eps) break;
  }

  return front * (f - 1);
}

// Lanczos approximation for log-gamma ln(Γ(z))
function logGamma(z: number): number {
  const g = 7;
  const p = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.138571095836524, 9.9843695780195716e-6, 1.5056327351493116e-7
  ];

  if (z < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * z)) - logGamma(1 - z);
  }

  z -= 1;
  let x = p[0];
  for (let i = 1; i < g + 2; i++) {
    x += p[i] / (z + i);
  }

  const t = z + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

// -------------------------------------------------------------
// 1. Sample Size Calculator (Cochran + FPC)
// -------------------------------------------------------------
export interface SampleSizeResult {
  sampleSize: number;
  unadjustedSampleSize: number;
  criticalZ: number;
  marginOfErrorFraction: number;
  proportion: number;
  populationSize?: number;
  fpcFactor?: number;
  comparisonMatrix: Array<{
    confidence: number;
    moe1: number;
    moe3: number;
    moe5: number;
    moe10: number;
  }>;
}

export function calculateSampleSize(
  confidenceLevel = 95,
  marginOfErrorPercent = 5,
  expectedProportion = 50,
  populationSize?: number
): SampleSizeResult {
  const z = getCriticalZ(confidenceLevel);
  const p = Math.max(0.01, Math.min(0.99, (expectedProportion || 50) / 100));
  const e = Math.max(0.001, (marginOfErrorPercent || 5) / 100);

  // Cochran's initial sample size: n0 = (Z^2 * p * (1 - p)) / e^2
  const n0 = (z * z * p * (1 - p)) / (e * e);
  let finalN = n0;
  let fpcFactor: number | undefined;

  const N = populationSize && populationSize > 0 ? populationSize : undefined;
  if (N) {
    // Finite population correction: n = n0 / (1 + (n0 - 1) / N)
    finalN = n0 / (1 + (n0 - 1) / N);
    fpcFactor = finalN / n0;
  }

  const comparisonConfidences = [90, 95, 99];
  const comparisonMatrix = comparisonConfidences.map((conf) => {
    const compZ = getCriticalZ(conf);
    const getCompN = (moePct: number) => {
      const compE = moePct / 100;
      const raw = (compZ * compZ * p * (1 - p)) / (compE * compE);
      return N ? Math.ceil(raw / (1 + (raw - 1) / N)) : Math.ceil(raw);
    };

    return {
      confidence: conf,
      moe1: getCompN(1),
      moe3: getCompN(3),
      moe5: getCompN(5),
      moe10: getCompN(10),
    };
  });

  return {
    sampleSize: Math.ceil(finalN),
    unadjustedSampleSize: Math.ceil(n0),
    criticalZ: Math.round(z * 10000) / 10000,
    marginOfErrorFraction: e,
    proportion: p,
    populationSize: N,
    fpcFactor: fpcFactor ? Math.round(fpcFactor * 1000) / 1000 : undefined,
    comparisonMatrix,
  };
}

// -------------------------------------------------------------
// 2. Margin of Error Calculator
// -------------------------------------------------------------
export interface MarginOfErrorResult {
  marginOfErrorPercent: number;
  marginOfErrorFraction: number;
  criticalZ: number;
  sampleSize: number;
  proportion: number;
  lowerBoundPercent: number;
  upperBoundPercent: number;
  populationSize?: number;
  fpcApplied: boolean;
}

export function calculateMarginOfError(
  sampleSize: number,
  confidenceLevel = 95,
  observedProportion = 50,
  populationSize?: number
): MarginOfErrorResult {
  const n = Math.max(1, sampleSize || 100);
  const z = getCriticalZ(confidenceLevel);
  const p = Math.max(0.001, Math.min(0.999, (observedProportion || 50) / 100));

  let moe = z * Math.sqrt((p * (1 - p)) / n);
  let fpcApplied = false;

  const N = populationSize && populationSize > n ? populationSize : undefined;
  if (N) {
    moe *= Math.sqrt((N - n) / (N - 1));
    fpcApplied = true;
  }

  const moePercent = moe * 100;
  const pPercent = p * 100;

  return {
    marginOfErrorPercent: Math.round(moePercent * 100) / 100,
    marginOfErrorFraction: moe,
    criticalZ: Math.round(z * 10000) / 10000,
    sampleSize: n,
    proportion: p,
    lowerBoundPercent: Math.max(0, Math.round((pPercent - moePercent) * 100) / 100),
    upperBoundPercent: Math.min(100, Math.round((pPercent + moePercent) * 100) / 100),
    populationSize: N,
    fpcApplied,
  };
}

// -------------------------------------------------------------
// 3. Confidence Interval Calculator
// -------------------------------------------------------------
export interface ConfidenceIntervalResult {
  mode: 'mean' | 'proportion';
  confidenceLevel: number;
  pointEstimate: number;
  marginOfError: number;
  lowerBound: number;
  upperBound: number;
  criticalValue: number;
  distributionUsed: 'Z' | 't';
  degreesOfFreedom?: number;
}

export function calculateConfidenceIntervalMean(
  sampleMean: number,
  sampleSize: number,
  standardDeviation: number,
  confidenceLevel = 95,
  isPopulationSigmaKnown = false
): ConfidenceIntervalResult {
  const n = Math.max(2, sampleSize || 30);
  const mean = sampleMean || 0;
  const s = Math.max(0.0001, standardDeviation || 1);
  const df = n - 1;

  let criticalValue = 0;
  let dist: 'Z' | 't' = 'Z';

  if (isPopulationSigmaKnown || n >= 1000) {
    criticalValue = getCriticalZ(confidenceLevel);
    dist = 'Z';
  } else {
    // For Student-t, critical value = inverse t approximation using rational approximation
    const zCrit = getCriticalZ(confidenceLevel);
    criticalValue = zCrit + (zCrit * zCrit * zCrit + zCrit) / (4 * df);
    dist = 't';
  }

  const standardError = s / Math.sqrt(n);
  const moe = criticalValue * standardError;

  return {
    mode: 'mean',
    confidenceLevel,
    pointEstimate: Math.round(mean * 1000) / 1000,
    marginOfError: Math.round(moe * 1000) / 1000,
    lowerBound: Math.round((mean - moe) * 1000) / 1000,
    upperBound: Math.round((mean + moe) * 1000) / 1000,
    criticalValue: Math.round(criticalValue * 1000) / 1000,
    distributionUsed: dist,
    degreesOfFreedom: dist === 't' ? df : undefined,
  };
}

export function calculateConfidenceIntervalProportion(
  observedSuccesses: number,
  sampleSize: number,
  confidenceLevel = 95
): ConfidenceIntervalResult {
  const n = Math.max(1, sampleSize || 100);
  const x = Math.min(n, Math.max(0, observedSuccesses || 50));
  const p = x / n;
  const z = getCriticalZ(confidenceLevel);

  const se = Math.sqrt((p * (1 - p)) / n);
  const moe = z * se;

  return {
    mode: 'proportion',
    confidenceLevel,
    pointEstimate: Math.round(p * 10000) / 10000,
    marginOfError: Math.round(moe * 10000) / 10000,
    lowerBound: Math.max(0, Math.round((p - moe) * 10000) / 10000),
    upperBound: Math.min(1, Math.round((p + moe) * 10000) / 10000),
    criticalValue: Math.round(z * 1000) / 1000,
    distributionUsed: 'Z',
  };
}

// -------------------------------------------------------------
// 4. Z-Score Calculator
// -------------------------------------------------------------
export interface ZScoreResult {
  rawScore: number;
  mean: number;
  standardDeviation: number;
  zScore: number;
  percentile: number;
  leftTailProbability: number;
  rightTailProbability: number;
  twoTailedProbability: number;
  betweenNegZandZ: number;
}

export function calculateZScore(
  rawScore: number,
  mean = 0,
  standardDeviation = 1
): ZScoreResult {
  const sd = Math.max(0.000001, standardDeviation || 1);
  const z = (rawScore - mean) / sd;
  const leftTail = standardNormalCdf(z);
  const rightTail = 1 - leftTail;
  const twoTailed = 2 * (1 - standardNormalCdf(Math.abs(z)));
  const between = 1 - twoTailed;

  return {
    rawScore,
    mean,
    standardDeviation: sd,
    zScore: Math.round(z * 10000) / 10000,
    percentile: Math.round(leftTail * 10000) / 100,
    leftTailProbability: Math.round(leftTail * 10000) / 10000,
    rightTailProbability: Math.round(rightTail * 10000) / 10000,
    twoTailedProbability: Math.round(twoTailed * 10000) / 10000,
    betweenNegZandZ: Math.round(between * 10000) / 10000,
  };
}

// -------------------------------------------------------------
// 5. T-Score Calculator
// -------------------------------------------------------------
export interface TScoreResult {
  sampleMean: number;
  hypothesizedMean: number;
  sampleSd: number;
  sampleSize: number;
  degreesOfFreedom: number;
  tStatistic: number;
  pValueOneTailed: number;
  pValueTwoTailed: number;
  standardizedPsychometricTScore: number;
}

export function calculateTScore(
  sampleMean: number,
  hypothesizedMean: number,
  sampleSd: number,
  sampleSize: number
): TScoreResult {
  const n = Math.max(2, sampleSize || 10);
  const df = n - 1;
  const sd = Math.max(0.0001, sampleSd || 1);
  const se = sd / Math.sqrt(n);
  const t = (sampleMean - hypothesizedMean) / se;

  const leftTail = studentTCdf(t, df);
  const rightTail = 1 - leftTail;
  const pOneTailed = Math.min(leftTail, rightTail);
  const pTwoTailed = Math.min(1, 2 * pOneTailed);

  // Psychometric standardized T-score: T = 50 + 10 * Z
  const zApprox = t / Math.sqrt(df / Math.max(1, df - 2));
  const psychometricT = 50 + 10 * (Number.isFinite(zApprox) ? zApprox : t);

  return {
    sampleMean,
    hypothesizedMean,
    sampleSd: sd,
    sampleSize: n,
    degreesOfFreedom: df,
    tStatistic: Math.round(t * 10000) / 10000,
    pValueOneTailed: Math.round(pOneTailed * 10000) / 10000,
    pValueTwoTailed: Math.round(pTwoTailed * 10000) / 10000,
    standardizedPsychometricTScore: Math.round(psychometricT * 100) / 100,
  };
}

// -------------------------------------------------------------
// 6. P-Value Calculator
// -------------------------------------------------------------
export interface PValueResult {
  testType: 'z' | 't';
  testStatistic: number;
  degreesOfFreedom?: number;
  hypothesisType: 'two_tailed' | 'left_tailed' | 'right_tailed';
  significanceLevel: number;
  pValue: number;
  isSignificant: boolean;
  decisionText: string;
}

export function calculatePValue(
  testType: 'z' | 't',
  testStatistic: number,
  hypothesisType: 'two_tailed' | 'left_tailed' | 'right_tailed' = 'two_tailed',
  degreesOfFreedom = 10,
  alpha = 0.05
): PValueResult {
  const stat = testStatistic || 0;
  const df = Math.max(1, degreesOfFreedom || 10);

  let leftTail = 0;
  if (testType === 'z') {
    leftTail = standardNormalCdf(stat);
  } else {
    leftTail = studentTCdf(stat, df);
  }

  const rightTail = 1 - leftTail;

  let pValue = 0;
  if (hypothesisType === 'left_tailed') {
    pValue = leftTail;
  } else if (hypothesisType === 'right_tailed') {
    pValue = rightTail;
  } else {
    pValue = 2 * Math.min(leftTail, rightTail);
  }

  pValue = Math.min(1, Math.max(0, pValue));
  const isSignificant = pValue < alpha;

  return {
    testType,
    testStatistic: Math.round(stat * 10000) / 10000,
    degreesOfFreedom: testType === 't' ? df : undefined,
    hypothesisType,
    significanceLevel: alpha,
    pValue: Math.round(pValue * 10000) / 10000,
    isSignificant,
    decisionText: isSignificant
      ? `Statistically Significant (p = ${pValue.toFixed(4)} < α = ${alpha}). Reject the null hypothesis (H₀).`
      : `Not Statistically Significant (p = ${pValue.toFixed(4)} ≥ α = ${alpha}). Fail to reject the null hypothesis (H₀).`,
  };
}

// -------------------------------------------------------------
// 7. Standard Error Calculator
// -------------------------------------------------------------
export interface StandardErrorResult {
  mode: 'mean' | 'proportion';
  standardError: number;
  sampleSize: number;
  margin95: number;
  populationCorrectionFactor?: number;
}

export function calculateStandardErrorMean(
  standardDeviation: number,
  sampleSize: number,
  populationSize?: number
): StandardErrorResult {
  const s = Math.max(0, standardDeviation || 0);
  const n = Math.max(1, sampleSize || 1);
  let sem = s / Math.sqrt(n);
  let fpc: number | undefined;

  if (populationSize && populationSize > n) {
    fpc = Math.sqrt((populationSize - n) / (populationSize - 1));
    sem *= fpc;
  }

  return {
    mode: 'mean',
    standardError: Math.round(sem * 10000) / 10000,
    sampleSize: n,
    margin95: Math.round(1.959964 * sem * 10000) / 10000,
    populationCorrectionFactor: fpc ? Math.round(fpc * 1000) / 1000 : undefined,
  };
}

export function calculateStandardErrorProportion(
  proportion: number,
  sampleSize: number
): StandardErrorResult {
  const p = Math.max(0.001, Math.min(0.999, (proportion > 1 ? proportion / 100 : proportion) || 0.5));
  const n = Math.max(1, sampleSize || 100);
  const sep = Math.sqrt((p * (1 - p)) / n);

  return {
    mode: 'proportion',
    standardError: Math.round(sep * 10000) / 10000,
    sampleSize: n,
    margin95: Math.round(1.959964 * sep * 10000) / 10000,
  };
}

// -------------------------------------------------------------
// 8. A/B Test Sample Size Calculator
// -------------------------------------------------------------
export interface ABTestResult {
  baselineConversionRate: number;
  mdePercent: number;
  mdeAbsolute: number;
  expectedVariantConversion: number;
  statisticalPower: number;
  significanceLevel: number;
  sampleSizePerVariant: number;
  totalSampleSize: number;
  variantsCount: number;
  estimatedDaysToRun?: number;
  dailyTraffic?: number;
}

export function calculateABTestSampleSize(
  baselineConversionPercent = 5,
  minimumDetectableEffectPercent = 10,
  mdeType: 'relative' | 'absolute' = 'relative',
  statisticalPower = 80,
  confidenceLevel = 95,
  numberOfVariants = 2,
  dailyTrafficPerVariant?: number
): ABTestResult {
  const p1 = Math.max(0.001, Math.min(0.99, (baselineConversionPercent || 5) / 100));
  const alpha = 1 - ((confidenceLevel || 95) / 100);
  const power = (statisticalPower || 80) / 100;

  const zAlpha = inverseNormalCdf(1 - alpha / 2);
  const zBeta = inverseNormalCdf(power);

  let delta = 0;
  let p2 = 0;
  if (mdeType === 'relative') {
    delta = p1 * ((minimumDetectableEffectPercent || 10) / 100);
    p2 = p1 + delta;
  } else {
    delta = (minimumDetectableEffectPercent || 1) / 100;
    p2 = p1 + delta;
  }

  p2 = Math.min(0.999, Math.max(0.001, p2));
  const pPooled = (p1 + p2) / 2;

  // Formula for sample size per variant:
  // n = [ Z_(alpha/2) * sqrt(2 * p_bar * (1 - p_bar)) + Z_beta * sqrt(p1*(1-p1) + p2*(1-p2)) ]^2 / delta^2
  const term1 = zAlpha * Math.sqrt(2 * pPooled * (1 - pPooled));
  const term2 = zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2));
  const nPerVariant = Math.ceil(Math.pow(term1 + term2, 2) / Math.pow(delta, 2));

  const variants = Math.max(2, numberOfVariants || 2);
  const totalSample = nPerVariant * variants;

  let estimatedDays: number | undefined;
  if (dailyTrafficPerVariant && dailyTrafficPerVariant > 0) {
    estimatedDays = Math.ceil(nPerVariant / dailyTrafficPerVariant);
  }

  return {
    baselineConversionRate: Math.round(p1 * 10000) / 100,
    mdePercent: minimumDetectableEffectPercent,
    mdeAbsolute: Math.round(delta * 10000) / 100,
    expectedVariantConversion: Math.round(p2 * 10000) / 100,
    statisticalPower,
    significanceLevel: Math.round(alpha * 10000) / 100,
    sampleSizePerVariant: nPerVariant,
    totalSampleSize: totalSample,
    variantsCount: variants,
    estimatedDaysToRun: estimatedDays,
    dailyTraffic: dailyTrafficPerVariant,
  };
}
