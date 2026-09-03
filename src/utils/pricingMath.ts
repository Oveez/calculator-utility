/**
 * Handmade, Product, Sticker, and Break-Even Pricing Mathematics.
 */

export interface StickerPricingResult {
  batchQuantity: number;
  totalBatchCost: number;
  costPerSticker: number;
  recommendedRetailPrice: number;
  wholesalePrice: number;
  profitPerSticker: number;
  profitMarginPercent: number;
  markupMultiple: number;
  bulkPricingTiers: Array<{
    quantityTier: number;
    unitPrice: number;
    discountPercent: number;
    totalPrice: number;
    profitPerUnit: number;
  }>;
}

export function calculateStickerPricing(
  batchQuantity = 100,
  sheetCost = 1.20,
  stickersPerSheet = 12,
  inkCostPerSheet = 0.35,
  laminateCostPerSheet = 0.45,
  laborMinutes = 45,
  laborRatePerHour = 20,
  packagingPerSticker = 0.15,
  marketplaceFeePercent = 9.5,
  targetMarginPercent = 55
): StickerPricingResult {
  const qty = Math.max(1, batchQuantity || 100);
  const perSheet = Math.max(1, stickersPerSheet || 12);
  const sheetsNeeded = Math.ceil(qty / perSheet);

  const materialsCost = sheetsNeeded * (sheetCost + inkCostPerSheet + laminateCostPerSheet);
  const laborCost = (Math.max(0, laborMinutes || 0) / 60) * Math.max(0, laborRatePerHour || 0);
  const packagingTotal = qty * Math.max(0, packagingPerSticker || 0);

  const totalProductionCost = materialsCost + laborCost + packagingTotal;
  const costPerUnit = totalProductionCost / qty;

  // Selling Price with target margin & fee percentage:
  // Price - Cost - (Price * Fee%) = Price * Margin%
  // Price * (1 - Fee% - Margin%) = Cost
  // Price = Cost / (1 - Fee% - Margin%)
  const feeFraction = Math.min(0.4, Math.max(0, marketplaceFeePercent / 100));
  const marginFraction = Math.min(0.85, Math.max(0.1, targetMarginPercent / 100));
  const denom = Math.max(0.05, 1 - feeFraction - marginFraction);
  const retailPrice = costPerUnit / denom;

  const wholesale = costPerUnit * 2.0; // Standard 2x wholesale markup
  const actualProfit = retailPrice - costPerUnit - (retailPrice * feeFraction);
  const actualMargin = retailPrice > 0 ? (actualProfit / retailPrice) * 100 : 0;
  const markup = costPerUnit > 0 ? retailPrice / costPerUnit : 1;

  // Bulk pricing discount curve
  const tiers = [1, 5, 10, 25, 50, 100];
  const bulkPricingTiers = tiers.map((tierQty) => {
    let discount = 0;
    if (tierQty >= 100) discount = 0.40;
    else if (tierQty >= 50) discount = 0.30;
    else if (tierQty >= 25) discount = 0.20;
    else if (tierQty >= 10) discount = 0.15;
    else if (tierQty >= 5) discount = 0.10;

    const unitPrice = Math.max(wholesale, retailPrice * (1 - discount));
    const totalPrice = unitPrice * tierQty;
    const profit = unitPrice - costPerUnit - (unitPrice * feeFraction);

    return {
      quantityTier: tierQty,
      unitPrice: Math.round(unitPrice * 100) / 100,
      discountPercent: Math.round(discount * 100),
      totalPrice: Math.round(totalPrice * 100) / 100,
      profitPerUnit: Math.round(profit * 100) / 100,
    };
  });

  return {
    batchQuantity: qty,
    totalBatchCost: Math.round(totalProductionCost * 100) / 100,
    costPerSticker: Math.round(costPerUnit * 100) / 100,
    recommendedRetailPrice: Math.round(retailPrice * 100) / 100,
    wholesalePrice: Math.round(wholesale * 100) / 100,
    profitPerSticker: Math.round(actualProfit * 100) / 100,
    profitMarginPercent: Math.round(actualMargin * 10) / 10,
    markupMultiple: Math.round(markup * 10) / 10,
    bulkPricingTiers,
  };
}

export interface HandmadePricingResult {
  productType: string;
  materialsCost: number;
  laborCost: number;
  overheadCost: number;
  packagingCost: number;
  totalUnitCost: number;
  wholesalePrice: number;
  suggestedRetailPrice: number;
  netProfitRetail: number;
  profitMarginPercent: number;
}

export const HANDMADE_PRESETS: Record<string, { name: string; mat: number; hours: number; rate: number; overhead: number; pack: number }> = {
  custom: { name: 'Custom Craft', mat: 8.00, hours: 0.75, rate: 22, overhead: 2.50, pack: 1.50 },
  candle: { name: 'Scented Candle', mat: 4.50, hours: 0.35, rate: 20, overhead: 1.75, pack: 1.25 },
  jewelry: { name: 'Handmade Jewelry', mat: 9.00, hours: 0.85, rate: 25, overhead: 2.00, pack: 2.00 },
  crochet: { name: 'Crochet / Knitted Item', mat: 12.00, hours: 2.5, rate: 18, overhead: 3.00, pack: 1.00 },
  soap: { name: 'Artisan Soap / Skincare', mat: 2.20, hours: 0.20, rate: 20, overhead: 1.00, pack: 0.80 },
  sticker: { name: 'Art Prints / Stickers', mat: 1.50, hours: 0.15, rate: 22, overhead: 0.75, pack: 0.50 },
};

export function calculateHandmadePricing(
  materialsCost = 8.00,
  laborHours = 0.75,
  laborRatePerHour = 22,
  overheadPerUnit = 2.50,
  packagingPerUnit = 1.50,
  wholesaleMarkupMultiplier = 2.0,
  retailMarkupMultiplier = 2.0,
  productType = 'custom'
): HandmadePricingResult {
  const mat = Math.max(0, materialsCost || 0);
  const labor = Math.max(0, laborHours || 0) * Math.max(0, laborRatePerHour || 0);
  const overhead = Math.max(0, overheadPerUnit || 0);
  const pack = Math.max(0, packagingPerUnit || 0);

  const totalCost = mat + labor + overhead + pack;
  const wMult = Math.max(1.1, wholesaleMarkupMultiplier || 2.0);
  const rMult = Math.max(1.1, retailMarkupMultiplier || 2.0);

  const wholesale = totalCost * wMult;
  const retail = wholesale * rMult; // Standard formula: Wholesale * 2 = Total Cost * 4

  const netProfit = retail - totalCost;
  const margin = retail > 0 ? (netProfit / retail) * 100 : 0;

  return {
    productType,
    materialsCost: mat,
    laborCost: Math.round(labor * 100) / 100,
    overheadCost: overhead,
    packagingCost: pack,
    totalUnitCost: Math.round(totalCost * 100) / 100,
    wholesalePrice: Math.round(wholesale * 100) / 100,
    suggestedRetailPrice: Math.round(retail * 100) / 100,
    netProfitRetail: Math.round(netProfit * 100) / 100,
    profitMarginPercent: Math.round(margin * 10) / 10,
  };
}

export interface BreakEvenResult {
  fixedCosts: number;
  variableCostPerUnit: number;
  sellingPricePerUnit: number;
  contributionMarginPerUnit: number;
  contributionMarginRatio: number;
  breakEvenUnits: number;
  breakEvenRevenue: number;
  targetSalesUnits?: number;
  targetSalesRevenue?: number;
  profitAtTargetVolume?: number;
  marginOfSafetyUnits?: number;
  marginOfSafetyPercent?: number;
}

export function calculateBreakEven(
  monthlyFixedCosts = 2500,
  variableCostPerUnit = 12,
  sellingPricePerUnit = 35,
  targetUnitsToSell?: number
): BreakEvenResult {
  const fixed = Math.max(0, monthlyFixedCosts || 0);
  const variable = Math.max(0, variableCostPerUnit || 0);
  const price = Math.max(0.01, sellingPricePerUnit || 0.01);

  const cmPerUnit = Math.max(0, price - variable);
  const cmRatio = price > 0 ? cmPerUnit / price : 0;

  const beUnits = cmPerUnit > 0 ? Math.ceil(fixed / cmPerUnit) : 0;
  const beRevenue = beUnits * price;

  let targetUnits: number | undefined;
  let targetRevenue: number | undefined;
  let targetProfit: number | undefined;
  let marginOfSafetyUnits: number | undefined;
  let marginOfSafetyPct: number | undefined;

  if (targetUnitsToSell && targetUnitsToSell > 0) {
    targetUnits = targetUnitsToSell;
    targetRevenue = targetUnits * price;
    targetProfit = (targetUnits * cmPerUnit) - fixed;
    marginOfSafetyUnits = targetUnits - beUnits;
    marginOfSafetyPct = targetUnits > 0 ? (marginOfSafetyUnits / targetUnits) * 100 : 0;
  }

  return {
    fixedCosts: fixed,
    variableCostPerUnit: variable,
    sellingPricePerUnit: price,
    contributionMarginPerUnit: Math.round(cmPerUnit * 100) / 100,
    contributionMarginRatio: Math.round(cmRatio * 1000) / 10,
    breakEvenUnits: beUnits,
    breakEvenRevenue: Math.round(beRevenue * 100) / 100,
    targetSalesUnits: targetUnits,
    targetSalesRevenue: targetRevenue ? Math.round(targetRevenue * 100) / 100 : undefined,
    profitAtTargetVolume: targetProfit !== undefined ? Math.round(targetProfit * 100) / 100 : undefined,
    marginOfSafetyUnits,
    marginOfSafetyPercent: marginOfSafetyPct !== undefined ? Math.round(marginOfSafetyPct * 10) / 10 : undefined,
  };
}
