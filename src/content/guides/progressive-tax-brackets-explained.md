---
title: "The Mechanics of Progressive Income Tax: Marginal vs. Effective Rates Explained"
description: "How progressive tax brackets work, why a higher bracket never cuts your take-home pay, and how marginal and effective rates are calculated, with a full 2026 worked example."
author: "Tanvirul Islam"
affiliation: "Department of Management Information Systems, University of Dhaka"
publishDate: "2026-11-12"
category: "Tax & Finance"
relatedTool: "/us-income-tax-calculator/"
relatedToolName: "US Income Tax Calculator"
coverImage: "/images/guides/progressive-tax-brackets-explained.jpg"
coverImageAlt: "Progressive vs Marginal Income Tax Brackets Flow Infographic"
---

## Executive Summary

The US federal income tax is both **progressive** and **marginal**. Progressive means the rate rises as income rises. Marginal means each rate applies only to the slice of income that falls inside its bracket, not to your entire income.

This is why "moving into a higher bracket" cannot, by itself, reduce your take-home pay. When your income crosses a bracket threshold, only the dollars above that threshold are taxed at the higher rate. Every dollar below it is taxed exactly as before.

For tax year 2026, a single filer with \$85,000 of gross wages and the standard deduction owes **\$9,870** in federal income tax. Their **marginal rate is 22%**, but their **effective rate is only 11.61%** of gross income.

Key takeaways:

- Taxable income, not gross income, determines your bracket.
- The standard deduction for a single filer in 2026 is \$16,100.
- Marginal rate answers "what is the tax on my next dollar?" Effective rate answers "what share of my income did I actually pay?"
- A raise always increases net pay under bracket mechanics alone.

## Core Concepts & Official Definitions

**Gross income.** Under Internal Revenue Code (IRC) §61, gross income covers all income from whatever source derived, including wages, interest, and business income.

**Taxable income.** Under IRC §63, taxable income is gross income minus allowable deductions. Most taxpayers subtract either the **standard deduction** (IRC §63(c)) or their itemized deductions, whichever is larger.

**Tax bracket.** A bracket is a range of taxable income taxed at one statutory rate. Congress sets the rate structure in IRC §1. The IRS adjusts the dollar thresholds for inflation every year. The 2026 figures were published in Revenue Procedure 2025-32 and apply to returns filed in 2027. The One Big Beautiful Bill Act (Public Law 119-21) made the seven-rate structure of 10%, 12%, 22%, 24%, 32%, 35%, and 37% permanent.

**Marginal tax rate.** The statutory rate applied to the last dollar of taxable income, meaning the rate of the highest bracket you reach.

**Effective tax rate.** Total tax divided by income. This is an analytical ratio, not a statutory term. You can measure it against gross income or against taxable income, so always state which one you use.

Other countries use the same logic. HMRC in the United Kingdom taxes income in bands, and the Canada Revenue Agency (CRA) applies federal brackets to taxable income. In each system a higher band changes the rate only on the income inside that band. This guide covers US federal income tax only.

## The Exact Mathematical Formula & Step-by-Step Breakdown

Let \(G\) be gross income, \(D\) the deduction, and \(x\) taxable income:

$$x = \max(0,\; G - D)$$

The tax function is piecewise linear. With bracket floors \(b_0 = 0 < b_1 < \dots < b_6\) and rates \(r_1, \dots, r_7\), tax on taxable income \(x\) is:

$$T(x) = \sum_{i=1}^{7} r\_i \cdot \max\bigl(0,\; \min(x,\, b\_i) - b\_{i-1}\bigr), \qquad b\_7 = \infty$$

Each term measures how much of your income sits inside bracket \(i\), then multiplies it by that bracket's rate. If your income reaches bracket \(k\), the formula collapses to a shortcut, which is how the IRS tax tables are built:

$$T(x) = T(b\_{k-1}) + r\_k \,(x - b\_{k-1})$$

The two rates are then:

$$\text{Marginal rate} = r\_k \quad \text{where } b\_{k-1} < x \le b\_k$$

$$\text{Effective rate (on gross)} = \frac{T(x)}{G} \qquad \text{Effective rate (on taxable)} = \frac{T(x)}{x}$$

**Step by step:**

1. Subtract the deduction from gross income to get \(x\).
2. Find which bracket contains \(x\).
3. Tax each bracket's slice at its own rate, from the bottom up.
4. Add the slices to get \(T(x)\).
5. Divide \(T(x)\) by gross income for the effective rate.

### 2026 Federal Brackets, Single Filers

| Rate | Taxable income range | Width of bracket | Maximum tax within bracket | Cumulative tax at top of bracket |
|---|---|---|---|---|
| 10% | \$0 – \$12,400 | \$12,400 | \$1,240 | \$1,240 |
| 12% | \$12,401 – \$50,400 | \$38,000 | \$4,560 | \$5,800 |
| 22% | \$50,401 – \$105,700 | \$55,300 | \$12,166 | \$17,966 |
| 24% | \$105,701 – \$201,775 | \$96,075 | \$23,058 | \$41,024 |
| 32% | \$201,776 – \$256,225 | \$54,450 | \$17,424 | \$58,448 |
| 35% | \$256,226 – \$640,600 | \$384,375 | \$134,531.25 | \$192,979.25 |
| 37% | Over \$640,600 | Unbounded | n/a | n/a |

The cumulative column is useful because it lets you skip the lower brackets. For any income in the 22% bracket, tax equals \$5,800 plus 22% of the amount above \$50,400.

## Comprehensive Real-World Worked Numerical Example

**Profile:** a single filer with \$85,000 of wages in tax year 2026 who takes the standard deduction.

**Step 1: Taxable income.**

$$x = 85{,}000 - 16{,}100 = 68{,}900 \quad \text{(taxable income)}$$

**Step 2: Locate the bracket.** \$68,900 falls between \$50,401 and \$105,700, so the filer is in the 22% bracket.

**Step 3: Tax each slice.**

| Bracket Tier | Taxable Slice in Bracket | Rate | Calculation | Tax Assessed |
|---|---|---|---|---|
| **10% bracket** | \$0 – \$12,400 | 10% | `0.10 × $12,400` | **\$1,240.00** |
| **12% bracket** | \$12,401 – \$50,400 | 12% | `0.12 × ($50,400 − $12,400)` | **\$4,560.00** |
| **22% bracket** | \$50,401 – \$68,900 | 22% | `0.22 × ($68,900 − $50,400)` | **\$4,070.00** |

**Step 4: Total tax.**

$$T(68{,}900) = 1{,}240 + 4{,}560 + 4{,}070 = 9{,}870 \quad \text{(USD)}$$

**Shortcut check:** $5,800 + (0.22 × $18,500) = **$9,870**. ✓

**Step 5: Effective rates.**

$$\text{Effective rate (on gross)} = \frac{9{,}870}{85{,}000} \approx 11.61\% \qquad \text{Effective rate (on taxable)} = \frac{9{,}870}{68{,}900} \approx 14.32\%$$

Federal income tax therefore takes about 11.6 cents of every gross dollar, even though the marginal rate is 22%. Before payroll taxes, state tax, or credits, the filer keeps \$85,000 − \$9,870 = **\$75,130**.

### Stress-Testing the "Higher Bracket" Myth

**Test 1: a raise within the same bracket.** Suppose a \$5,000 raise lifts gross pay to \$90,000.

$$x = 90{,}000 - 16{,}100 = 73{,}900$$

$$T(73{,}900) = 5{,}800 + 0.22 \times (73{,}900 - 50{,}400) = 5{,}800 + 5{,}170 = 10{,}970 \quad \text{(USD)}$$

Tax rises by \$1,100 (22% of \$5,000). Net pay rises by \$3,900.

**Test 2: a raise that crosses a bracket threshold.** With the \$16,100 deduction, the 22% bracket begins at gross pay of \$66,500, because $50,400 + $16,100 = $66,500.

| Gross income | Taxable income | Federal tax | Net after federal tax |
|---|---|---|---|
| \$66,500 | \$50,400 | \$5,800 | \$60,700 |
| \$67,500 | \$51,400 | \$6,020 | \$61,480 |

The filer crossed into a higher bracket and still gained \$780 on a \$1,000 raise. Only the extra \$1,000 was taxed at 22%, and the first \$66,500 of pay was not re-taxed at the higher rate.

## Marginal vs. Effective Rate Across Income Levels

The table applies the 2026 single-filer schedule and the \$16,100 standard deduction to different gross incomes.

| Gross income | Taxable income | Federal tax | Marginal rate | Effective rate (on gross) |
|---|---|---|---|---|
| \$40,000 | \$23,900 | \$2,620 | 12% | 6.55% |
| \$60,000 | \$43,900 | \$5,020 | 12% | 8.37% |
| **\$85,000** | **\$68,900** | **\$9,870** | **22%** | **11.61%** |
| \$120,000 | \$103,900 | \$17,570 | 22% | 14.64% |
| \$150,000 | \$133,900 | \$24,734 | 24% | 16.49% |
| \$250,000 | \$233,900 | \$51,304 | 32% | 20.52% |

The effective rate rises more slowly than the marginal rate and always stays below it. A jump in marginal rate from 22% to 24% between \$120,000 and \$150,000 moves the effective rate only from 14.64% to 16.49%.

## Common Mistakes & Misconceptions

**1. Believing a raise can lower net pay.** This is the most common error, and the arithmetic above disproves it. Bracket mechanics alone cannot produce a pay cut.

**2. Applying the marginal rate to all income.** An \$85,000 earner does not owe 22% of \$85,000 (\$18,700). The actual bill is \$9,870, roughly half of that.

**3. Confusing gross and taxable income.** Brackets apply to taxable income. At \$85,000 of gross pay, the \$16,100 deduction means the filer is evaluated at \$68,900, not \$85,000.

**4. Treating federal income tax as the whole burden.** Employee payroll taxes (Social Security at 6.2% and Medicare at 1.45%) are separate and are not part of the bracket calculation. State and local income taxes are also separate.

**5. Judging tax by a bonus check.** Employers often withhold on bonuses at the flat 22% supplemental rate. That is only withholding. Your actual liability is settled on your return using the progressive schedule, so a large bonus withholding does not mean the bonus was taxed at 22% in the end.

## Frequently Asked Questions

**Can I ever take home less money by earning more?**
Not because of tax brackets. Real "cliffs" do exist elsewhere, though. Some credits, deductions, and subsidies phase out as income rises, which can make the *effective* rate on an extra dollar higher than the bracket rate suggests. That is a separate issue from the bracket schedule, and it affects specific situations, not taxpayers in general.

**What is the marginal rate for a single filer earning \$85,000 in 2026?**
It is 22%. Taxable income of \$68,900 sits in the \$50,401 – \$105,700 bracket. The filer would reach the 24% bracket only after taxable income passes \$105,700, which means about \$36,800 more in gross pay.

**Should I take the standard deduction or itemize?**
Choose whichever produces the lower tax. For a single filer in 2026, itemizing helps only if allowable itemized deductions (for example mortgage interest, state and local taxes within the legal cap, and charitable gifts) exceed \$16,100.

**Do these brackets apply to my 2026 paycheck or my 2025 return?**
The figures here are for tax year 2026, which you file in 2027. A 2025 return uses different thresholds and a \$15,750 single standard deduction. The rates themselves did not change.

## Try It Yourself: Interactive Tool

Reading the formula is useful, but trying your own numbers makes the idea concrete. The [US Income Tax Calculator](/us-income-tax-calculator/) applies the same piecewise schedule shown above. Enter your gross income and filing status, and it returns your taxable income, your total tax, your marginal rate, and your effective rate. You can also raise your income by a few thousand dollars and watch your take-home pay rise.

All calculations on ToolsCastle run entirely in your browser. Your figures are never sent to a server or stored.

## Professional Disclaimer

This article is for educational purposes only and does not constitute tax, legal, or financial advice. ToolsCastle calculators are mathematical estimation models and do not replace a certified tax professional. Figures are based on IRS Revenue Procedure 2025-32 for tax year 2026 and are limited to federal income tax for a single filer using the standard deduction. They exclude payroll taxes, state and local taxes, credits, and special deductions. Tax law changes frequently, so verify current figures with the IRS (irs.gov) or a qualified tax professional before making financial decisions.

