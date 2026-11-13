---
title: "How Mortgage Amortization Works: The Real Math Behind Extra Principal Payments"
description: "Learn the mortgage payment formula, why early payments are mostly interest, and how a modest extra monthly payment cuts years and tens of thousands in interest from a 30-year loan."
author: "Tanvirul Islam"
affiliation: "Department of Management Information Systems, University of Dhaka"
publishDate: "2026-11-12"
category: "Finance & Loans"
relatedTool: "/calculators/mortgage-calculator/"
relatedToolName: "Loan & Mortgage Payment Calculator"
coverImage: "/images/guides/how-mortgage-amortization-works.jpg"
coverImageAlt: "Mortgage Amortization Schedule and Principal Paydown Curve Infographic"
---

## Executive Summary

A fixed-rate mortgage uses a level monthly payment, but the split between interest and principal changes every month. Early payments are mostly interest, because interest is charged on the outstanding balance, and that balance is at its highest at the start of the loan.

For a \$350,000, 30-year fixed loan at 6.5%, the monthly principal-and-interest payment is **\$2,212.24**. Over 30 years, the borrower pays **\$446,404.05** in interest, more than the amount borrowed. Adding just **\$150 per month** in extra principal pays the loan off in 25 years and 1 month, which is 59 months early, and saves about **\$86,990** in interest.

Key takeaways:

- Interest each month equals the monthly rate times the current balance.
- Extra principal cuts the balance immediately, so it stops accruing interest for the rest of the loan.
- The earlier extra payments begin, the larger the savings.

## Core Concepts & Official Definitions

**Amortization.** Repaying a loan through scheduled payments that each cover the interest accrued since the last payment plus a portion of principal. An **amortization schedule** is the month-by-month table of that split.

**Principal (\(P\)).** The amount borrowed. **Periodic rate (\(r\)).** The annual interest rate divided by 12, expressed as a decimal. **Term (\(n\)).** The number of monthly payments, which is years multiplied by 12.

**Regulatory framework.** In the United States, mortgage disclosures fall under the Truth in Lending Act, implemented by Regulation Z and administered by the Consumer Financial Protection Bureau (CFPB). Lenders must disclose the payment amount, the annual percentage rate (APR), and the total interest percentage on the Loan Estimate and Closing Disclosure.

**Prepayment.** Paying more than the scheduled amount. Whether you may do so freely, and how the servicer applies the money, depends on your loan note.

**Tax note.** If you itemize deductions, qualified mortgage interest may be deductible under IRC §163(h), as covered in our guide to standard vs. itemized deductions. That makes the after-tax benefit of prepaying smaller than the pre-tax figures below.

Conventions differ by country. Canadian fixed-rate mortgages, for example, typically compound semi-annually, so the monthly formula in this guide is the US standard.

## The Exact Mathematical Formula & Step-by-Step Breakdown

The fixed monthly payment is:

$$M = P \times \frac{r(1+r)^n}{(1+r)^n - 1}$$

Each month follows a simple recurrence, where \(B_{k-1}\) is the balance before payment \(k\):

$$I\_k = r \times B\_{k-1} \qquad \text{Principal}\_k = M - I\_k \qquad B\_k = B\_{k-1} - (M - I\_k)$$

The balance after \(k\) payments also has a closed form:

$$B_k = P(1+r)^k - M \times \frac{(1+r)^k - 1}{r}$$

### Why Early Payments Are Mostly Interest

Because \(M\) is fixed and \(I_k = r \times B_{k-1}\), the principal portion starts small. Each payment shrinks the balance slightly, which shrinks next month's interest, which leaves slightly more for principal. The principal portion grows by exactly the monthly rate each period:

$$\text{Principal}_{k+1} = \text{Principal}_k \times (1+r)$$

This is geometric growth at a low rate, so it takes decades for principal to overtake interest.

### Payoff Time With an Extra Payment

If you add a fixed extra amount \(x\) each month, the number of payments needed becomes:

$$n' = \frac{\ln\left(\dfrac{M + x}{M + x - rP}\right)}{\ln(1+r)}$$

**Steps:** (1) convert the annual rate to a monthly rate, (2) compute \(M\), (3) generate the schedule with the interest-then-principal recurrence, (4) rerun it with the larger payment to compare.

## Comprehensive Real-World Worked Numerical Example

**Loan:** \(P = \$350{,}000\), annual rate 6.5%, 30 years.

**Step 1: Inputs.**

$$r = \frac{0.065}{12} \approx 0.0054167 \qquad n = 30 \times 12 = 360$$

**Step 2: Payment.** With \((1+r)^{360} \approx 6.99180\):

$$M = 350{,}000 \times \frac{0.0054167 \times 6.99180}{6.99180 - 1} = 350{,}000 \times 0.0063207 \approx 2{,}212.24 \quad \text{(USD/month)}$$

**Step 3: The first payment.**

$$I_1 = 0.0054167 \times 350{,}000 = 1{,}895.83 \qquad \text{Principal}_1 = 2{,}212.24 - 1{,}895.83 = 316.41 \quad \text{(USD)}$$

Interest takes **85.7%** of the first payment. After five years the borrower has paid \$132,734.40 but reduced the balance by only \$22,361.74, or 6.4% of the loan.

**Step 4: Lifetime cost.** Total interest is \$446,404.05, which is 127.5% of the amount borrowed.

### Sample Year-by-Year Amortization Table (No Extra Payments)

| Year | Interest paid | Principal paid | Interest share | Ending balance |
|---|---|---|---|---|
| 1 | \$22,634.81 | \$3,912.07 | 85.3% | \$346,087.93 |
| 2 | \$22,372.80 | \$4,174.08 | 84.3% | \$341,913.85 |
| 3 | \$22,093.28 | \$4,453.60 | 83.2% | \$337,460.25 |
| 5 | \$21,476.76 | \$5,070.12 | 80.9% | \$327,638.26 |
| 10 | \$19,535.84 | \$7,011.04 | 73.6% | \$296,716.04 |
| 15 | \$16,851.87 | \$9,695.01 | 63.5% | \$253,956.33 |
| 20 | \$13,140.48 | \$13,406.40 | 49.5% | \$194,827.42 |
| 25 | \$8,008.26 | \$18,538.62 | 30.2% | \$113,062.95 |
| 30 | \$911.38 | \$25,633.15 | 3.4% | \$0.00 |

Principal first exceeds interest in year 20. At the 15-year midpoint, only 27.4% of the loan has been repaid.

### Adding \$150 Per Month

The new payment is \$2,362.24. Applying the payoff formula gives $n' \approx 300.3$, so the loan ends with a final partial payment in month 301.

| Metric | Standard schedule | With \$150 extra per month |
|---|---|---|
| Monthly payment | \$2,212.24 | \$2,362.24 |
| Payoff time | 360 months (30 years) | 301 months (25 years 1 month) |
| Total interest | \$446,404.05 | \$359,413.78 |
| Total paid | \$796,404.05 | \$709,413.78 |
| Interest saved | n/a | **\$86,990.27** |
| Time saved | n/a | **59 months** |

The extra \$150 raises the first month's principal payment from \$316.41 to \$466.41, a 47% increase. Ending balances stay lower throughout:

| Year | Balance, standard | Balance, +\$150 per month |
|---|---|---|
| 5 | \$327,638.26 | \$317,037.18 |
| 10 | \$296,716.04 | \$271,455.64 |
| 15 | \$253,956.33 | \$208,424.71 |
| 20 | \$194,827.42 | \$121,264.46 |
| 25 | \$113,062.95 | \$737.78 |

About \$45,000 of extra payments over 25 years avoids roughly \$86,990 of interest. The gap widens over time because every dollar of principal removed also removes all the interest it would have generated in later years.

## Common Mistakes & Misconceptions

**1. Assuming the split stays constant.** The payment is level, but the interest-to-principal ratio is not. Judging equity by the monthly payment size is misleading in the first decade.

**2. Not confirming that extra money goes to principal.** Some servicers treat an extra amount as an early payment toward the next installment unless you designate it as principal-only. That saves little interest. Check your servicer's instructions.

**3. Ignoring prepayment terms.** Most loans allow prepayment, but your note governs. Read it before sending extra money.

**4. Prepaying before building a safety net.** Extra principal is locked in your home and cannot be withdrawn without refinancing or borrowing. Higher-interest debt and an emergency fund usually come first.

**5. Treating the formula as the full housing payment.** The formula gives principal and interest only. Property taxes, homeowners insurance, mortgage insurance, and HOA dues come on top.

**6. Waiting too long.** Because interest savings compound over the remaining term, the same extra amount saves much less if started in year 15 than in year 1.

## Frequently Asked Questions

**Is it better to make extra payments early or late?**
Early. A single extra \$10,000 principal payment at the very start of this loan, with the regular payment unchanged, shortens the term to 331 months and saves about \$54,712 in interest.

**Do extra payments lower my monthly payment?**
No. They shorten the term, and the required payment stays the same. Lowering the payment requires a recast or refinance, which lenders may charge for.

**Do bi-weekly payments help?**
Paying half your monthly payment every two weeks results in 26 half-payments, which equals 13 full payments per year, so one extra monthly payment. On this loan, that behaves much like adding about \$184 per month, which would end the loan in roughly 290 months. Confirm that your servicer actually applies bi-weekly payments as they arrive, since some hold them until a full payment accumulates.

**Why does the bank front-load interest?**
It is not a trick. Interest is owed on whatever you still owe, and you owe the most at the start. The schedule is the mathematically consistent way to repay a loan with equal payments.

## Try It Yourself: Interactive Tool

The [Loan & Mortgage Payment Calculator](/calculators/mortgage-calculator/) uses the same formula and schedule logic shown here. Enter your loan amount, rate, and term, then add an extra monthly payment to see your new payoff date and total interest saved.

ToolsCastle runs every calculation in your browser. Your loan details are never sent to a server or stored.

## Professional Disclaimer

This article is for educational purposes only and is not financial, tax, or legal advice. ToolsCastle calculators are mathematical estimation models and do not replace a licensed mortgage professional or financial advisor. The example assumes a fixed rate, monthly compounding, payments rounded to the cent, and extra payments applied entirely to principal. Actual loans may differ in compounding, fees, escrow, rounding, and prepayment rules. Review your loan documents and consult a qualified professional before deciding how to manage your mortgage.