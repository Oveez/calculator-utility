/**
 * Shipping, Freight, Logistics, and Dimensional Weight Math.
 */

export interface CbmItemInput {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'm' | 'in' | 'ft';
  quantity: number;
  weightPerItemKg?: number;
}

export interface CbmCalculationResult {
  totalCbm: number;
  totalCft: number;
  totalQuantity: number;
  totalWeightKg: number;
  totalWeightLbs: number;
  containerFit: {
    container20ftPercentage: number;
    container40ftPercentage: number;
    container40hqPercentage: number;
  };
  itemBreakdown: Array<{
    cbmPerUnit: number;
    totalCbm: number;
    totalCft: number;
  }>;
}

// Convert any linear unit to meters
function toMeters(val: number, unit: 'cm' | 'm' | 'in' | 'ft'): number {
  if (unit === 'cm') return val / 100;
  if (unit === 'm') return val;
  if (unit === 'in') return val * 0.0254;
  if (unit === 'ft') return val * 0.3048;
  return val;
}

export function calculateCbm(items: CbmItemInput[]): CbmCalculationResult {
  let totalCbm = 0;
  let totalQuantity = 0;
  let totalWeightKg = 0;

  const breakdown = items.map((item) => {
    const l_m = toMeters(Math.max(0, item.length || 0), item.unit);
    const w_m = toMeters(Math.max(0, item.width || 0), item.unit);
    const h_m = toMeters(Math.max(0, item.height || 0), item.unit);
    const qty = Math.max(1, Math.floor(item.quantity || 1));

    const unitCbm = l_m * w_m * h_m;
    const rowCbm = unitCbm * qty;
    const rowCft = rowCbm * 35.3147;

    totalCbm += rowCbm;
    totalQuantity += qty;
    if (item.weightPerItemKg) {
      totalWeightKg += Math.max(0, item.weightPerItemKg) * qty;
    }

    return {
      cbmPerUnit: Math.round(unitCbm * 10000) / 10000,
      totalCbm: Math.round(rowCbm * 10000) / 10000,
      totalCft: Math.round(rowCft * 100) / 100,
    };
  });

  const totalCft = totalCbm * 35.3147;
  const totalWeightLbs = totalWeightKg * 2.20462;

  // Standard container usable volumes: 20ft ~ 28-33 CBM, 40ft ~ 58-67 CBM, 40HQ ~ 68-76 CBM
  const cap20 = 33.2;
  const cap40 = 67.7;
  const cap40hq = 76.3;

  return {
    totalCbm: Math.round(totalCbm * 10000) / 10000,
    totalCft: Math.round(totalCft * 100) / 100,
    totalQuantity,
    totalWeightKg: Math.round(totalWeightKg * 100) / 100,
    totalWeightLbs: Math.round(totalWeightLbs * 100) / 100,
    containerFit: {
      container20ftPercentage: Math.round((totalCbm / cap20) * 1000) / 10,
      container40ftPercentage: Math.round((totalCbm / cap40) * 1000) / 10,
      container40hqPercentage: Math.round((totalCbm / cap40hq) * 1000) / 10,
    },
    itemBreakdown: breakdown,
  };
}

export interface VolumetricWeightResult {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'in';
  quantity: number;
  divisor: number;
  divisorName: string;
  volumetricWeightKg: number;
  volumetricWeightLbs: number;
  actualWeightKg?: number;
  chargeableWeightKg?: number;
  isVolumeDominant?: boolean;
}

export const CARRIER_DIVISORS = {
  express_cm: { divisor: 5000, name: 'Express Courier (DHL / FedEx / UPS) cm³/5000' },
  air_freight_cm: { divisor: 6000, name: 'Standard Air Freight (IATA) cm³/6000' },
  sea_freight_cbm: { divisor: 1000, name: 'Sea Freight LCL (1 CBM = 1,000 kg)' },
  express_in_lbs: { divisor: 139, name: 'Domestic / Express Daily (in³/139 = lbs)' },
  retail_in_lbs: { divisor: 166, name: 'Domestic Retail / USPS (in³/166 = lbs)' },
};

export function calculateVolumetricWeight(
  length: number,
  width: number,
  height: number,
  unit: 'cm' | 'in' = 'cm',
  quantity = 1,
  divisorOption: 'express' | 'air_freight' | 'custom' = 'express',
  customDivisor?: number,
  actualWeightPerUnitKg?: number
): VolumetricWeightResult {
  const l = Math.max(0, length || 0);
  const w = Math.max(0, width || 0);
  const h = Math.max(0, height || 0);
  const qty = Math.max(1, quantity || 1);

  let divisor = 5000;
  let divisorName = 'Express Courier (cm³ / 5000)';

  if (unit === 'cm') {
    if (divisorOption === 'air_freight') {
      divisor = 6000;
      divisorName = 'Standard Air Freight (cm³ / 6000)';
    } else if (divisorOption === 'custom' && customDivisor) {
      divisor = customDivisor;
      divisorName = `Custom Divisor (${customDivisor})`;
    } else {
      divisor = 5000;
      divisorName = 'Express Courier (cm³ / 5000)';
    }
  } else {
    // inches
    if (divisorOption === 'air_freight') {
      divisor = 166;
      divisorName = 'Air / Retail (in³ / 166)';
    } else if (divisorOption === 'custom' && customDivisor) {
      divisor = customDivisor;
      divisorName = `Custom Divisor (${customDivisor})`;
    } else {
      divisor = 139;
      divisorName = 'Express Courier (in³ / 139)';
    }
  }

  let volKg = 0;
  let volLbs = 0;

  if (unit === 'cm') {
    volKg = ((l * w * h) / divisor) * qty;
    volLbs = volKg * 2.20462;
  } else {
    // cubic inches / divisor yields lbs
    volLbs = ((l * w * h) / divisor) * qty;
    volKg = volLbs / 2.20462;
  }

  const actKg = actualWeightPerUnitKg ? actualWeightPerUnitKg * qty : undefined;
  const chargeableKg = actKg ? Math.max(actKg, volKg) : volKg;
  const isVolDominant = actKg ? volKg > actKg : undefined;

  return {
    length: l,
    width: w,
    height: h,
    unit,
    quantity: qty,
    divisor,
    divisorName,
    volumetricWeightKg: Math.round(volKg * 100) / 100,
    volumetricWeightLbs: Math.round(volLbs * 100) / 100,
    actualWeightKg: actKg ? Math.round(actKg * 100) / 100 : undefined,
    chargeableWeightKg: Math.round(chargeableKg * 100) / 100,
    isVolumeDominant: isVolDominant,
  };
}

export interface DimensionalWeightResult {
  lengthInches: number;
  widthInches: number;
  heightInches: number;
  cubicInches: number;
  cubicFeet: number;
  dimDivisor: number;
  dimWeightLbs: number;
  actualWeightLbs: number;
  billableWeightLbs: number;
  isSubjectToDimWeight: boolean;
  appliedRuleText: string;
}

export function calculateDimensionalWeight(
  length: number,
  width: number,
  height: number,
  actualWeightLbs = 5,
  carrierPreset: 'fedex_ups_daily' | 'fedex_ups_retail' | 'usps' = 'fedex_ups_daily'
): DimensionalWeightResult {
  const l = Math.max(0, length || 0);
  const w = Math.max(0, width || 0);
  const h = Math.max(0, height || 0);
  const act = Math.max(0, actualWeightLbs || 0);

  const cuIn = l * w * h;
  const cuFt = cuIn / 1728;

  let divisor = 139;
  let ruleText = 'FedEx / UPS Daily Commercial Rates (Divisor 139)';

  if (carrierPreset === 'fedex_ups_retail') {
    divisor = 166;
    ruleText = 'FedEx / UPS Retail / Standard Rates (Divisor 166)';
  } else if (carrierPreset === 'usps') {
    divisor = 166;
    // USPS only applies DIM weight if package > 1 cubic foot (1,728 cu in) and Zones 1-9
    if (cuFt <= 1.0) {
      ruleText = 'USPS Priority Mail: Under 1 cu ft threshold. Actual weight applies!';
    } else {
      ruleText = 'USPS Priority Mail: Over 1 cu ft threshold (Divisor 166 applied).';
    }
  }

  let dimLbs = cuIn / divisor;
  if (carrierPreset === 'usps' && cuFt <= 1.0) {
    dimLbs = 0; // Not applied under 1 cu ft
  }

  // Couriers round billable weight UP to nearest whole pound
  const roundedDimLbs = Math.ceil(dimLbs);
  const roundedActLbs = Math.ceil(act);
  const billable = Math.max(roundedActLbs, roundedDimLbs);
  const isSubject = roundedDimLbs > roundedActLbs;

  return {
    lengthInches: l,
    widthInches: w,
    heightInches: h,
    cubicInches: Math.round(cuIn * 10) / 10,
    cubicFeet: Math.round(cuFt * 100) / 100,
    dimDivisor: divisor,
    dimWeightLbs: Math.round(dimLbs * 100) / 100,
    actualWeightLbs: act,
    billableWeightLbs: billable,
    isSubjectToDimWeight: isSubject,
    appliedRuleText: ruleText,
  };
}

export interface ChargeableWeightResult {
  actualGrossWeightKg: number;
  volumetricWeightKg: number;
  chargeableWeightKg: number;
  chargeableWeightLbs: number;
  chargedBasis: 'actual' | 'volumetric';
  freightCostEstimate?: number;
  ratePerKg?: number;
  explanation: string;
}

export function calculateChargeableWeight(
  actualWeightKg: number,
  lengthCm: number,
  widthCm: number,
  heightCm: number,
  quantity = 1,
  mode: 'air_standard' | 'express' | 'sea_lcl' = 'air_standard',
  ratePerKg?: number
): ChargeableWeightResult {
  const actKg = Math.max(0, actualWeightKg || 0);
  const l = Math.max(0, lengthCm || 0);
  const w = Math.max(0, widthCm || 0);
  const h = Math.max(0, heightCm || 0);
  const qty = Math.max(1, quantity || 1);

  let volKg = 0;
  if (mode === 'sea_lcl') {
    // 1 CBM = 1,000 kg (revenue ton rule)
    const cbm = (l / 100) * (w / 100) * (h / 100) * qty;
    volKg = cbm * 1000;
  } else if (mode === 'express') {
    volKg = ((l * w * h) / 5000) * qty;
  } else {
    // air_standard
    volKg = ((l * w * h) / 6000) * qty;
  }

  const chargeable = Math.max(actKg, volKg);
  const basis: 'actual' | 'volumetric' = volKg > actKg ? 'volumetric' : 'actual';
  const chargeableLbs = chargeable * 2.20462;

  const cost = ratePerKg && ratePerKg > 0 ? chargeable * ratePerKg : undefined;

  const explanation = basis === 'volumetric'
    ? `Your cargo is bulky/lightweight. Volumetric weight (${volKg.toFixed(2)} kg) exceeds actual weight (${actKg.toFixed(2)} kg), so carrier charges for ${chargeable.toFixed(2)} kg.`
    : `Your cargo is dense/heavy. Actual gross weight (${actKg.toFixed(2)} kg) exceeds volumetric weight (${volKg.toFixed(2)} kg), so carrier charges for ${chargeable.toFixed(2)} kg.`;

  return {
    actualGrossWeightKg: Math.round(actKg * 100) / 100,
    volumetricWeightKg: Math.round(volKg * 100) / 100,
    chargeableWeightKg: Math.round(chargeable * 100) / 100,
    chargeableWeightLbs: Math.round(chargeableLbs * 100) / 100,
    chargedBasis: basis,
    freightCostEstimate: cost ? Math.round(cost * 100) / 100 : undefined,
    ratePerKg,
    explanation,
  };
}

export interface ContainerCapacityResult {
  containerType: '20ft' | '40ft' | '40hq' | '45hq';
  containerName: string;
  cartonLengthCm: number;
  cartonWidthCm: number;
  cartonHeightCm: number;
  cartonWeightKg: number;
  cartonCbm: number;
  maxCartonsByVolume: number;
  realisticCartonsPacked: number;
  totalCargoWeightKg: number;
  maxContainerPayloadKg: number;
  isWeightConstrained: boolean;
  volumeUtilizationPercent: number;
  weightUtilizationPercent: number;
}

export const CONTAINER_SPECS = {
  '20ft': { name: "20' Standard Dry Container", maxCbm: 33.2, maxPayloadKg: 28080, internalL: 589, internalW: 235, internalH: 239 },
  '40ft': { name: "40' Standard Dry Container", maxCbm: 67.7, maxPayloadKg: 28600, internalL: 1203, internalW: 235, internalH: 239 },
  '40hq': { name: "40' High Cube Container", maxCbm: 76.3, maxPayloadKg: 28600, internalL: 1203, internalW: 235, internalH: 269 },
  '45hq': { name: "45' High Cube Container", maxCbm: 86.0, maxPayloadKg: 27700, internalL: 1355, internalW: 235, internalH: 269 },
};

export function calculateContainerCapacity(
  cartonLengthCm: number,
  cartonWidthCm: number,
  cartonHeightCm: number,
  cartonWeightKg = 10,
  containerType: '20ft' | '40ft' | '40hq' | '45hq' = '20ft',
  packingEfficiencyPercent = 88
): ContainerCapacityResult {
  const l = Math.max(1, cartonLengthCm || 30);
  const w = Math.max(1, cartonWidthCm || 20);
  const h = Math.max(1, cartonHeightCm || 15);
  const wt = Math.max(0.1, cartonWeightKg || 10);

  const spec = CONTAINER_SPECS[containerType] || CONTAINER_SPECS['20ft'];
  const unitCbm = (l / 100) * (w / 100) * (h / 100);

  const theoreticalCartons = unitCbm > 0 ? Math.floor(spec.maxCbm / unitCbm) : 0;
  const efficiency = Math.min(100, Math.max(50, packingEfficiencyPercent || 88)) / 100;
  const realisticCartons = Math.floor(theoreticalCartons * efficiency);

  // Check if weight payload is exceeded
  const maxCartonsByWeight = Math.floor(spec.maxPayloadKg / wt);
  const actualFittedCartons = Math.min(realisticCartons, maxCartonsByWeight);
  const totalCargoWeight = actualFittedCartons * wt;

  const totalUsedCbm = actualFittedCartons * unitCbm;
  const volUtil = (totalUsedCbm / spec.maxCbm) * 100;
  const wtUtil = (totalCargoWeight / spec.maxPayloadKg) * 100;
  const isWeightConstrained = maxCartonsByWeight < realisticCartons;

  return {
    containerType,
    containerName: spec.name,
    cartonLengthCm: l,
    cartonWidthCm: w,
    cartonHeightCm: h,
    cartonWeightKg: wt,
    cartonCbm: Math.round(unitCbm * 10000) / 10000,
    maxCartonsByVolume: theoreticalCartons,
    realisticCartonsPacked: actualFittedCartons,
    totalCargoWeightKg: Math.round(totalCargoWeight),
    maxContainerPayloadKg: spec.maxPayloadKg,
    isWeightConstrained,
    volumeUtilizationPercent: Math.round(volUtil * 10) / 10,
    weightUtilizationPercent: Math.round(wtUtil * 10) / 10,
  };
}
