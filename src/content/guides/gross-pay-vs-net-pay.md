---
title: "Gross Pay vs. Net Pay: Understanding Payroll Taxes, FICA, and Take-Home Salary"
description: "How gross pay becomes net pay: FICA, the Social Security wage base, Medicare, pre-tax deductions, and a full 2026 paycheck breakdown from annual salary to hourly take-home."
author: "Tanvirul Islam"
affiliation: "Department of Management Information Systems, University of Dhaka"
publishDate: "2026-11-12"
category: "Tax & Finance"
relatedTool: "/tax-calculators/salary-to-hourly/"
relatedToolName: "Salary and Hourly Paycheck Calculator"
coverImage: "/images/guides/gross-pay-vs-net-pay.jpg"
coverImageAlt: "Gross Pay vs Net Pay Paycheck Deduction Waterfall Infographic"
---

## Executive Summary

**Gross pay** is the amount stated in your employment contract before anything is removed. **Net pay** is the amount that reaches your bank account. Between the two sit mandatory deductions (income tax withholding, Social Security, and Medicare) and voluntary deductions (retirement contributions, health insurance premiums, HSA and FSA contributions).

For a 2026 single filer earning a \$72,000 salary, with typical benefit elections and an illustrative 4% state income tax, annual net pay is about **\$50,774.60**, which is **70.5%** of gross. That works out to roughly \$1,952.87 per bi-weekly paycheck, or \$24.41 per hour.

Key takeaways:

- Employees pay FICA at a combined 7.65% (6.2% Social Security plus 1.45% Medicare) on most wages.
- Social Security tax stops at \$184,500 of wages in 2026. Medicare tax has no cap.
- Pre-tax deductions always reduce income tax, but only some of them also reduce FICA.

## Core Concepts & Official Definitions

**Gross pay.** Total compensation before deductions. Under IRC §3121(a), "wages" for FICA purposes generally means all pay for employment.

**Net pay.** Gross pay minus all taxes and deductions withheld.

**FICA.** The Federal Insurance Contributions Act (IRC §3101 et seq.) funds Social Security (OASDI) and Medicare (HI). The employee pays 6.2% for OASDI on wages up to the annual wage base, which the Social Security Administration sets at \$184,500 for 2026. The employee also pays 1.45% for Medicare on all wages. The employer pays a matching amount.

**Additional Medicare Tax.** An extra 0.9% on wages above \$200,000, under IRC §3101(b)(2). Employers withhold it above that level, and there is no employer match.

**Income tax withholding.** Under IRC §3402, employers withhold federal income tax based on your Form W-4 and the IRS tables in Publication 15-T. Withholding is a prepayment, not your final liability.

**Pre-tax deductions.** Traditional 401(k) deferrals reduce wages for income tax but not for FICA. Benefits offered through a Section 125 cafeteria plan (health premiums, health FSA, payroll HSA contributions) reduce both.

Other countries follow the same gross-to-net structure. HMRC administers PAYE and National Insurance in the UK, and the CRA administers payroll deductions in Canada. This guide covers US federal payroll rules only.

## The Exact Mathematical Formula & Step-by-Step Breakdown

Let \(G\) be gross pay, \(S_{125}\) the Section 125 deductions, \(K\) the traditional 401(k) deferral, and \(D\) the standard deduction. The wages used for each tax are:

$$W_{\text{FICA}} = G - S_{125} \qquad W_{\text{FIT}} = G - S_{125} - K$$

The FICA taxes are:

$$T_{SS} = 0.062 \times \min\bigl(W_{\text{FICA}},\; 184{,}500\bigr)$$

$$T_{Med} = 0.0145 \times W_{\text{FICA}}$$

$$T_{AMT} = 0.009 \times \max\bigl(0,\; W_{\text{FICA}} - 200{,}000\bigr)$$

Federal income tax applies the progressive bracket function to taxable income: \(T_{FIT} = f(W_{\text{FIT}} - D)\). Net pay is then:

$$\text{Net} = G - K - S_{125} - T_{FIT} - T_{SS} - T_{Med} - T_{AMT} - T_{state}$$

To convert to other pay frequencies, divide by the number of periods \(n\) (26 bi-weekly, 24 semi-monthly, 12 monthly), or divide by annual hours for an hourly rate:

$$\text{Hourly} = \frac{\text{Annual amount}}{h \times 52}, \quad h = 40 \Rightarrow 2{,}080 \text{ hours}$$

The most Social Security tax any employee pays in 2026 is \(0.062 \times 184{,}500 = \$11{,}439\).

**Steps:** (1) subtract Section 125 items to get FICA wages, (2) subtract the 401(k) as well to get income tax wages, (3) compute FICA, (4) compute federal and state income tax, (5) subtract everything from gross.

## Mandatory vs. Voluntary Deductions

| Deduction | Type | Reduces income tax wages? | Reduces FICA wages? | 2026 limit or rate |
|---|---|---|---|---|
| Federal income tax | Mandatory | n/a | n/a | Progressive, 10%–37% |
| Social Security | Mandatory | No | n/a | 6.2% up to \$184,500 |
| Medicare | Mandatory | No | n/a | 1.45%, no cap |
| Additional Medicare | Mandatory | No | n/a | 0.9% over \$200,000 |
| Traditional 401(k) | Voluntary | Yes | No | \$24,500 |
| Health insurance premium | Voluntary | Yes | Yes | Set by plan |
| HSA (via payroll) | Voluntary | Yes | Yes | \$4,400 self / \$8,750 family |
| Health FSA | Voluntary | Yes | Yes | \$3,400 |

State income tax is mandatory in most states, and the rules and rates vary widely by state.

## Comprehensive Real-World Worked Numerical Example

**Assumptions:** single filer, tax year 2026, \$72,000 salary, standard deduction of \$16,100. Elections are a 6% traditional 401(k) deferral (\$4,320), a \$2,400 annual health premium, and a \$1,200 payroll HSA contribution. The state tax is an illustrative flat 4%, not a real state's rate.

**Step 1: Wage bases.**

$$S_{125} = 2{,}400 + 1{,}200 = 3{,}600 \qquad W_{\text{FICA}} = 72{,}000 - 3{,}600 = 68{,}400$$

$$W_{\text{FIT}} = 68{,}400 - 4{,}320 = 64{,}080$$

**Step 2: FICA.**

$$T_{SS} = 0.062 \times 68{,}400 = 4{,}240.80 \qquad T_{Med} = 0.0145 \times 68{,}400 = 991.80$$

Total FICA is \$5,232.60. Wages are far below \$184,500, so the cap does not apply, and below \$200,000, so no Additional Medicare Tax applies.

**Step 3: Federal income tax** (2026 single brackets, as covered in our guide to progressive tax brackets).

$$x = 64{,}080 - 16{,}100 = 47{,}980 \quad \text{(taxable income)}$$

$$T_{FIT} = 0.10 \times 12{,}400 + 0.12 \times (47{,}980 - 12{,}400) = 1{,}240 + 4{,}269.60 = 5{,}509.60 \quad \text{(USD)}$$

**Step 4: State tax.** \(0.04 \times 64{,}080 = \$2{,}563.20\)

**Step 5: Net pay.**

$$\text{Net} = 72{,}000 - 4{,}320 - 3{,}600 - 5{,}232.60 - 5{,}509.60 - 2{,}563.20 = 50{,}774.60 \quad \text{(USD)}$$

That is 70.5% of gross. Total deductions are \$21,225.40, of which \$7,920 is voluntary and builds retirement or health savings.

### Paycheck Frequency Breakdown

| Frequency | Periods per year | Gross per period | Net per period |
|---|---|---|---|
| Annual | 1 | \$72,000.00 | \$50,774.60 |
| Monthly | 12 | \$6,000.00 | \$4,231.22 |
| Semi-monthly | 24 | \$3,000.00 | \$2,115.61 |
| Bi-weekly | 26 | \$2,769.23 | \$1,952.87 |
| Weekly | 52 | \$1,384.62 | \$976.43 |
| Hourly (2,080 hrs) | 2,080 | \$34.62 | \$24.41 |

On a bi-weekly schedule you receive 26 paychecks, so two months each year contain three. Budget from the monthly figure (\$4,231.22), not from the larger bi-weekly check.

## Common Mistakes & Misconceptions

**1. Assuming a 401(k) lowers FICA.** Traditional 401(k) deferrals reduce income tax wages only. Social Security and Medicare are still calculated on the full amount.

**2. Treating withholding as the final tax bill.** Withholding is an estimate based on your W-4. Your actual liability is settled on your return, which produces a refund or a balance due.

**3. Ignoring the Social Security cap.** Social Security tax stops at \$184,500 of wages, so high earners see a raise in take-home pay late in the year. Medicare tax continues without a cap.

**4. Converting pay frequencies incorrectly.** Multiplying a bi-weekly check by 2 gives 24 periods, but there are 26. The correct monthly figure is the bi-weekly amount times 26, divided by 12.

**5. Forgetting the employer's share.** Your employer pays a further 7.65% in FICA on your wages. It is a real cost of employing you, though it never appears on your paycheck. Self-employed workers pay both halves (15.3%) themselves.

## Frequently Asked Questions

**Why is my take-home pay so much lower than my salary?**
Payroll taxes and income tax withholding take a large share, and voluntary deductions such as retirement contributions and insurance premiums take more. In the example above, taxes were \$13,305.40 and voluntary deductions were \$7,920, which together reduce \$72,000 to about \$50,775.

**Do high earners stop paying Social Security tax?**
Yes, once their wages pass the \$184,500 wage base in 2026, Social Security tax stops for the rest of the year. The maximum is \$11,439. Medicare tax continues on all wages.

**Who pays the Additional Medicare Tax?**
Only the employee. Employers must withhold 0.9% on wages above \$200,000, but they do not match it. Your final liability threshold depends on filing status.

**How do I convert an annual salary to an hourly rate?**
Divide by annual hours worked. For a standard 40-hour week, that is $40 \times 52 = 2{,}080$ hours, so \$72,000 gross is \$34.62 per hour. Net hourly pay is calculated the same way from net pay.

## Try It Yourself: Interactive Tool

The [Salary and Hourly Paycheck Calculator](/tax-calculators/salary-to-hourly/) converts a salary into annual, monthly, semi-monthly, bi-weekly, weekly, and hourly amounts using the same logic shown above. Enter your pay and your pay frequency to see gross and estimated take-home figures side by side.

ToolsCastle runs every calculation in your browser. Your income and deduction figures are not sent to a server or stored.

## Professional Disclaimer

This article is for educational purposes only and is not tax, legal, or financial advice. ToolsCastle calculators are mathematical estimation models and do not replace a payroll professional or certified tax advisor. The worked example uses 2026 federal figures, assumes a single filer with the standard deduction, and uses a hypothetical 4% state tax and example benefit elections. Actual paychecks depend on your Form W-4, employer payroll system, state and local taxes, and benefit plan terms. Tax limits change annually, so confirm current figures with the IRS (irs.gov), the Social Security Administration (ssa.gov), or a qualified professional.

