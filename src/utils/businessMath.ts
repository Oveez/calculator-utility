/**
 * Business, Freelance, Creator, and Commerce math calculations.
 */

export interface FreelanceRateResult {
  targetNetIncome: number;
  totalExpenses: number;
  totalTaxes: number;
  grossAnnualRevenueNeeded: number;
  totalWorkingWeeks: number;
  totalBillableHoursPerYear: number;
  hourlyRate: number;
  dayRate: number;
  weeklyRevenue: number;
  monthlyGrossRevenue: number;
  effectiveTaxRate: number;
  takeHomePercentage: number;
}

export function calculateFreelanceRate(
  targetNetIncome = 80000,
  annualExpenses = 6000,
  taxRatePercent = 28,
  vacationWeeks = 4,
  sickDays = 10,
  billableHoursPerWeek = 25,
  platformFeePercent = 0
): FreelanceRateResult {
  const net = Math.max(0, targetNetIncome || 0);
  const exp = Math.max(0, annualExpenses || 0);
  const taxRate = Math.min(60, Math.max(0, (taxRatePercent || 28) / 100));
  const feeRate = Math.min(30, Math.max(0, (platformFeePercent || 0) / 100));

  // Required Pre-Tax Income: Net = (PreTax - Expenses) * (1 - TaxRate)
  // PreTax - Expenses = Net / (1 - TaxRate)
  // PreTax = (Net / (1 - TaxRate)) + Expenses
  const preTaxIncome = (net / Math.max(0.01, 1 - taxRate)) + exp;
  // Account for platform/payment processing fees taken from gross
  const grossAnnual = preTaxIncome / Math.max(0.01, 1 - feeRate);
  const totalTaxes = Math.max(0, (grossAnnual - exp) * taxRate);

  // Time calculations
  const totalWeeks = 52;
  const vacWeeks = Math.min(20, Math.max(0, vacationWeeks || 0));
  const sickWeeks = Math.min(10, Math.max(0, (sickDays || 0) / 5));
  const workingWeeks = Math.max(1, totalWeeks - vacWeeks - sickWeeks);

  const billableHrsPerWk = Math.min(60, Math.max(1, billableHoursPerWeek || 25));
  const totalBillableHours = workingWeeks * billableHrsPerWk;

  const hourly = totalBillableHours > 0 ? grossAnnual / totalBillableHours : 0;
  const daily = hourly * 8;
  const weekly = grossAnnual / workingWeeks;
  const monthly = grossAnnual / 12;

  return {
    targetNetIncome: net,
    totalExpenses: exp,
    totalTaxes: Math.round(totalTaxes),
    grossAnnualRevenueNeeded: Math.round(grossAnnual),
    totalWorkingWeeks: Math.round(workingWeeks * 10) / 10,
    totalBillableHoursPerYear: Math.round(totalBillableHours),
    hourlyRate: Math.round(hourly * 100) / 100,
    dayRate: Math.round(daily),
    weeklyRevenue: Math.round(weekly),
    monthlyGrossRevenue: Math.round(monthly),
    effectiveTaxRate: taxRatePercent,
    takeHomePercentage: grossAnnual > 0 ? Math.round((net / grossAnnual) * 100) : 0,
  };
}

export interface YouTubeRpmResult {
  monthlyViews: number;
  rpm: number;
  estimatedDailyEarnings: number;
  estimatedMonthlyEarnings: number;
  estimatedAnnualEarnings: number;
  cpmEquivalent: number;
  formatType: 'long_form' | 'shorts';
}

export function calculateYouTubeRpm(
  monthlyViews = 100000,
  rpm = 4.5,
  formatType: 'long_form' | 'shorts' = 'long_form'
): YouTubeRpmResult {
  const views = Math.max(0, monthlyViews || 0);
  const rate = Math.max(0, rpm || 0);

  // RPM is revenue per 1,000 views to the creator (already net of YouTube's 45% cut)
  const monthly = (views / 1000) * rate;
  const daily = monthly / 30.4167;
  const annual = monthly * 12;

  // Approximate CPM paid by advertisers (Creator gets 55% for long-form, 45% for shorts)
  const creatorShare = formatType === 'shorts' ? 0.45 : 0.55;
  const cpm = creatorShare > 0 ? rate / creatorShare : rate;

  return {
    monthlyViews: views,
    rpm: rate,
    estimatedDailyEarnings: Math.round(daily * 100) / 100,
    estimatedMonthlyEarnings: Math.round(monthly * 100) / 100,
    estimatedAnnualEarnings: Math.round(annual * 100) / 100,
    cpmEquivalent: Math.round(cpm * 100) / 100,
    formatType,
  };
}

export interface EtsyProfitResult {
  sellingPrice: number;
  buyerShipping: number;
  totalRevenue: number;
  totalCosts: number;
  listingFee: number;
  transactionFee: number;
  processingFee: number;
  offsiteAdsFee: number;
  totalEtsyFees: number;
  netProfit: number;
  profitMarginPercent: number;
  roiPercent: number;
  breakEvenPrice: number;
}

export function calculateEtsyProfit(
  itemPrice = 25,
  buyerShippingCharged = 4.99,
  itemCostOfGoods = 6,
  sellerActualShipping = 4.25,
  listingFee = 0.20,
  transactionFeeRate = 6.5,
  paymentProcessingRate = 3.0,
  paymentProcessingFlat = 0.25,
  offsiteAdsRate = 0,
  packagingAndOtherCost = 1.00
): EtsyProfitResult {
  const price = Math.max(0, itemPrice || 0);
  const shipping = Math.max(0, buyerShippingCharged || 0);
  const totalRevenue = price + shipping;

  const cogs = Math.max(0, itemCostOfGoods || 0);
  const actualShip = Math.max(0, sellerActualShipping || 0);
  const pack = Math.max(0, packagingAndOtherCost || 0);
  const baseCost = cogs + actualShip + pack;

  // Etsy Fees:
  // Listing: $0.20
  // Transaction: 6.5% of (Price + Shipping)
  // Payment: % of (Price + Shipping) + flat
  // Offsite Ads: % of (Price + Shipping)
  const lFee = listingFee;
  const tFee = totalRevenue * (transactionFeeRate / 100);
  const pFee = (totalRevenue * (paymentProcessingRate / 100)) + paymentProcessingFlat;
  const aFee = totalRevenue * (offsiteAdsRate / 100);
  const totalFees = lFee + tFee + pFee + aFee;

  const totalCosts = baseCost + totalFees;
  const netProfit = totalRevenue - totalCosts;
  const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  const roi = baseCost > 0 ? (netProfit / (baseCost + totalFees)) * 100 : 0;

  // Break-even price (assuming shipping charged equals actual shipping):
  // Rev - (COGS + Pack + lFee + pFlat + Rev*(tRate + pRate + aRate)) = 0
  const combinedFeeRate = (transactionFeeRate + paymentProcessingRate + offsiteAdsRate) / 100;
  const fixedCost = cogs + pack + lFee + paymentProcessingFlat + Math.max(0, actualShip - shipping);
  const breakEven = 1 - combinedFeeRate > 0 ? fixedCost / (1 - combinedFeeRate) : 0;

  return {
    sellingPrice: price,
    buyerShipping: shipping,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalCosts: Math.round(totalCosts * 100) / 100,
    listingFee: Math.round(lFee * 100) / 100,
    transactionFee: Math.round(tFee * 100) / 100,
    processingFee: Math.round(pFee * 100) / 100,
    offsiteAdsFee: Math.round(aFee * 100) / 100,
    totalEtsyFees: Math.round(totalFees * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
    profitMarginPercent: Math.round(margin * 100) / 100,
    roiPercent: Math.round(roi * 100) / 100,
    breakEvenPrice: Math.round(breakEven * 100) / 100,
  };
}

export interface ShopifyProfitResult {
  sellingPrice: number;
  totalRevenue: number;
  totalCosts: number;
  cogs: number;
  shippingCost: number;
  gatewayFee: number;
  adSpendPerOrder: number;
  refundAllowance: number;
  netProfitPerOrder: number;
  profitMarginPercent: number;
  monthlyOrders: number;
  monthlyNetProfit: number;
  breakEvenPrice: number;
}

export function calculateShopifyProfit(
  sellingPrice = 45,
  shippingCharged = 0,
  cogs = 12,
  actualShippingCost = 5.5,
  gatewayPercent = 2.9,
  gatewayFlat = 0.30,
  adSpendPerOrder = 14,
  refundRatePercent = 2,
  monthlyOrders = 300,
  monthlyShopifyPlanCost = 39
): ShopifyProfitResult {
  const price = Math.max(0, sellingPrice || 0);
  const shipCharged = Math.max(0, shippingCharged || 0);
  const totalRevenue = price + shipCharged;

  const costGoods = Math.max(0, cogs || 0);
  const shipCost = Math.max(0, actualShippingCost || 0);
  const adSpend = Math.max(0, adSpendPerOrder || 0);
  const refundCost = (totalRevenue * Math.max(0, refundRatePercent || 0)) / 100;
  const gatewayFee = (totalRevenue * (gatewayPercent / 100)) + gatewayFlat;

  const orderVolume = Math.max(1, monthlyOrders || 1);
  const planAmortization = (monthlyShopifyPlanCost || 0) / orderVolume;

  const totalCosts = costGoods + shipCost + gatewayFee + adSpend + refundCost + planAmortization;
  const netProfit = totalRevenue - totalCosts;
  const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  const monthlyProfit = netProfit * orderVolume;

  const variableFeeRate = (gatewayPercent + refundRatePercent) / 100;
  const fixedPerOrder = costGoods + shipCost + gatewayFlat + adSpend + planAmortization - shipCharged;
  const breakEven = 1 - variableFeeRate > 0 ? fixedPerOrder / (1 - variableFeeRate) : 0;

  return {
    sellingPrice: price,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalCosts: Math.round(totalCosts * 100) / 100,
    cogs: costGoods,
    shippingCost: shipCost,
    gatewayFee: Math.round(gatewayFee * 100) / 100,
    adSpendPerOrder: adSpend,
    refundAllowance: Math.round(refundCost * 100) / 100,
    netProfitPerOrder: Math.round(netProfit * 100) / 100,
    profitMarginPercent: Math.round(margin * 100) / 100,
    monthlyOrders: orderVolume,
    monthlyNetProfit: Math.round(monthlyProfit * 100) / 100,
    breakEvenPrice: Math.round(breakEven * 100) / 100,
  };
}

export interface CommissionResult {
  totalSales: number;
  baseSalary: number;
  totalCommission: number;
  totalEarnings: number;
  effectiveCommissionRate: number;
  tierBreakdown: Array<{
    tierLabel: string;
    bracketSales: number;
    ratePercent: number;
    commissionEarned: number;
  }>;
}

export function calculateCommission(
  totalSales = 50000,
  commissionStructure: 'flat' | 'tiered' = 'flat',
  flatRatePercent = 8,
  baseSalary = 3000,
  tiers?: Array<{ upTo: number; rate: number }>
): CommissionResult {
  const sales = Math.max(0, totalSales || 0);
  const base = Math.max(0, baseSalary || 0);

  let totalCommission = 0;
  const breakdown: CommissionResult['tierBreakdown'] = [];

  if (commissionStructure === 'flat') {
    const rate = Math.max(0, flatRatePercent || 0);
    totalCommission = sales * (rate / 100);
    breakdown.push({
      tierLabel: 'Flat Rate',
      bracketSales: sales,
      ratePercent: rate,
      commissionEarned: Math.round(totalCommission * 100) / 100,
    });
  } else {
    const tierList = tiers && tiers.length > 0 ? tiers : [
      { upTo: 10000, rate: 5 },
      { upTo: 25000, rate: 8 },
      { upTo: Infinity, rate: 12 },
    ];

    let remainingSales = sales;
    let previousLimit = 0;

    tierList.forEach((t) => {
      if (remainingSales <= 0) return;
      const bracketCapacity = t.upTo === Infinity ? remainingSales : t.upTo - previousLimit;
      const taxableInTier = Math.min(remainingSales, bracketCapacity);
      const comm = taxableInTier * (t.rate / 100);
      totalCommission += comm;

      const label = t.upTo === Infinity
        ? `Over $${previousLimit.toLocaleString()}`
        : `$${previousLimit.toLocaleString()} to $${t.upTo.toLocaleString()}`;

      breakdown.push({
        tierLabel: label,
        bracketSales: taxableInTier,
        ratePercent: t.rate,
        commissionEarned: Math.round(comm * 100) / 100,
      });

      remainingSales -= taxableInTier;
      previousLimit = t.upTo;
    });
  }

  const effectiveRate = sales > 0 ? (totalCommission / sales) * 100 : 0;

  return {
    totalSales: sales,
    baseSalary: base,
    totalCommission: Math.round(totalCommission * 100) / 100,
    totalEarnings: Math.round((base + totalCommission) * 100) / 100,
    effectiveCommissionRate: Math.round(effectiveRate * 100) / 100,
    tierBreakdown: breakdown,
  };
}

export interface RealEstateCommissionResult {
  homeSalePrice: number;
  totalCommissionRate: number;
  totalCommission: number;
  listingSideCommission: number;
  buyerSideCommission: number;
  listingAgentGross: number;
  listingBrokerShare: number;
  buyerAgentGross: number;
  buyerBrokerShare: number;
  sellerNetProceeds: number;
  mortgagePayoff: number;
  closingCosts: number;
}

export function calculateRealEstateCommission(
  homeSalePrice = 450000,
  totalCommissionPercent = 5.5,
  listingSideSharePercent = 50,
  listingAgentSplitPercent = 70,
  buyerAgentSplitPercent = 70,
  mortgagePayoff = 220000,
  otherClosingCosts = 4500
): RealEstateCommissionResult {
  const price = Math.max(0, homeSalePrice || 0);
  const totalComm = price * (Math.max(0, totalCommissionPercent || 0) / 100);

  const listSidePct = Math.max(0, Math.min(100, listingSideSharePercent || 50)) / 100;
  const buyerSidePct = 1 - listSidePct;

  const listingTotal = totalComm * listSidePct;
  const buyerTotal = totalComm * buyerSidePct;

  const listAgentSplit = Math.max(0, Math.min(100, listingAgentSplitPercent || 70)) / 100;
  const buyerAgentSplit = Math.max(0, Math.min(100, buyerAgentSplitPercent || 70)) / 100;

  const listingAgentGross = listingTotal * listAgentSplit;
  const listingBrokerShare = listingTotal * (1 - listAgentSplit);

  const buyerAgentGross = buyerTotal * buyerAgentSplit;
  const buyerBrokerShare = buyerTotal * (1 - buyerAgentSplit);

  const mortgage = Math.max(0, mortgagePayoff || 0);
  const closing = Math.max(0, otherClosingCosts || 0);
  const netProceeds = price - totalComm - mortgage - closing;

  return {
    homeSalePrice: price,
    totalCommissionRate: totalCommissionPercent,
    totalCommission: Math.round(totalComm),
    listingSideCommission: Math.round(listingTotal),
    buyerSideCommission: Math.round(buyerTotal),
    listingAgentGross: Math.round(listingAgentGross),
    listingBrokerShare: Math.round(listingBrokerShare),
    buyerAgentGross: Math.round(buyerAgentGross),
    buyerBrokerShare: Math.round(buyerBrokerShare),
    sellerNetProceeds: Math.round(netProceeds),
    mortgagePayoff: mortgage,
    closingCosts: closing,
  };
}
