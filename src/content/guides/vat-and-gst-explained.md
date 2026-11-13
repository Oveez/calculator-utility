---
title: "Understanding VAT & GST: Tax-Inclusive vs. Tax-Exclusive Math for Businesses"
description: "Learn how VAT and GST work, how to add tax to a net price and extract it from a gross price, why subtracting a flat percentage is wrong, and how the reverse charge works."
author: "Tanvirul Islam"
affiliation: "Department of Management Information Systems, University of Dhaka"
publishDate: "2026-11-12"
category: "Tax & Business"
relatedTool: "/tax-calculators/vat-calculator/"
relatedToolName: "Global VAT & GST Calculator"
coverImage: "/images/guides/vat-and-gst-explained.jpg"
coverImageAlt: "VAT and GST Value Added Supply Chain and Input Tax Credits Infographic"
---

## Executive Summary

Value-added tax (VAT) and goods and services tax (GST) are consumption taxes collected at every stage of a supply chain. Each business charges tax on its sales and subtracts the tax it paid on its purchases, so the final consumer bears the whole burden. The United Kingdom, EU member states, Australia, Canada, and New Zealand all use this model under different names, rates, and rules.

The skill that matters most day to day is moving correctly between **net** (tax-exclusive) and **gross** (tax-inclusive) prices:

- To **add** tax: multiply the net price by \((1 + r)\).
- To **extract** tax from a gross price: divide by \((1 + r)\). Do not multiply by \((1 - r)\).

On a £1,500 price including 20% UK VAT, the VAT is **£250**, not £300. Subtracting 20% of the gross overstates the tax and understates the net price.

## Core Concepts & Official Definitions

**Output tax and input tax.** Output tax is the VAT or GST a business charges customers. Input tax is the tax it pays suppliers. A registered business generally remits the difference.

**Tax-exclusive (net) and tax-inclusive (gross) prices.** The net price excludes tax. The gross price is what the customer pays.

**Rate classes.** *Standard-rated* supplies are taxed at the main rate. *Reduced-rated* supplies use a lower rate. *Zero-rated* supplies are taxable at 0%, and the supplier can still recover input tax. *Exempt* supplies are outside the charge, and the supplier generally cannot recover related input tax. Zero-rated and exempt are not the same thing.

**Reverse charge.** A mechanism that makes the customer, not the supplier, account for the tax. It is common for business-to-business services across borders and for certain domestic sectors, such as UK construction services.

**Authorities.** In the UK, HMRC administers VAT under the VAT Act 1994. In the EU, Directive 2006/112/EC sets the common framework, including a minimum standard rate of 15%, and each member state sets its own rates and administers its own tax. Australia's GST falls under the *A New Tax System (Goods and Services Tax) Act 1999* and is administered by the Australian Taxation Office. Canada's GST/HST falls under the *Excise Tax Act* and is administered by the Canada Revenue Agency. New Zealand's GST is administered by Inland Revenue.

**How the chain works.** A manufacturer sells to a retailer for £400 net plus £80 VAT and remits £80. The retailer sells to a consumer for £1,000 net plus £200 VAT, then remits £200 − £80 = £120. Total tax collected is £200, which is 20% of the final £1,000 price.

## The Exact Mathematical Formula & Step-by-Step Breakdown

With net price \(N\), gross price \(G\), VAT amount \(V\), and rate \(r\):

**Forward calculation (exclusive to inclusive):**

$$G = N \times (1 + r) \qquad V = N \times r$$

**Reverse extraction (inclusive to exclusive):**

$$N = \frac{G}{1 + r} \qquad V = G - \frac{G}{1+r} = G \times \frac{r}{1 + r}$$

The fraction \(\frac{r}{1+r}\) is the share of a gross price that is tax. At 20% it is \(\frac{1}{6}\), at 19% it is \(\frac{19}{119}\), at 21% it is \(\frac{21}{121}\), and at 10% it is \(\frac{1}{11}\).

**The common error.** Applying a flat percentage to a gross price:

$$N\_{\text{wrong}} = G \times (1 - r) \quad \Rightarrow \quad \text{VAT overstated by } G \times \frac{r^2}{1 + r}$$

**Net VAT payable** over a period:

$$V\_{\text{payable}} = V\_{\text{out}} - V\_{\text{in}}$$

**Reverse charge.** For a net purchase \(N\) at the buyer's local rate \(r\), with \(d\) as the deductible share of input tax (between 0 and 1):

$$V\_{\text{out}} = N \times r \qquad V\_{\text{in}} = N \times r \times d \qquad \text{Net VAT cost} = N \times r \times (1 - d)$$

If the buyer can fully recover input tax (\(d = 1\)), the reverse charge costs nothing.

**Steps:** (1) identify the correct rate class and rate, (2) decide whether your starting price is net or gross, (3) apply the matching formula, (4) round the net price and derive VAT as the difference so totals reconcile.

## Comprehensive Real-World Worked Numerical Example

### Example 1: United Kingdom (GBP, 20%)

**Adding VAT.** Net £1,250.00:

$$V = 1{,}250 \times 0.20 = 250.00 \quad (\text{GBP}) \qquad G = 1{,}250 \times 1.20 = 1{,}500.00 \quad (\text{GBP})$$

**Extracting VAT.** Gross £1,500.00:

$$N = \frac{1{,}500}{1.20} = 1{,}250.00 \quad (\text{GBP}) \qquad V = 1{,}500 \times \frac{1}{6} = 250.00 \quad (\text{GBP})$$

**The mistake.** £1,500 × 20% = £300 would give an incorrect net price of £1,200 (which is £50 too low). The formula above gives the exact overstatement as: \(1{,}500 \times \frac{0.04}{1.20} = £50.00\).

### Example 2: Germany (EUR, 19%)

**Extracting VAT.** Gross €2,380.00:

$$N = \frac{2{,}380}{1.19} = 2{,}000.00 \quad (\text{EUR}) \qquad V = 2{,}380 - 2{,}000 = 380.00 \quad (\text{EUR})$$

Check: \(2{,}380 \times \frac{19}{119} = €380.00\). The flat-percentage mistake gives €2,380 × 19% = €452.20, which overstates VAT by €72.20 and understates the net price (€1,927.80 instead of €2,000.00).

### Example 3: Reverse charge (EUR)

A German business buys €5,000 of consulting from a supplier in another EU country. Under the general B2B rule for services (Article 196 of the VAT Directive), the supplier invoices €5,000 with no VAT and marks the invoice as reverse charge. The German buyer self-assesses at 19%:

$$V_{\text{out}} = 5{,}000 \times 0.19 = 950 \quad (\text{EUR}) \qquad V_{\text{in}} = 950 \quad (\text{fully deductible})$$

The buyer pays the supplier €5,000, reports €950 as output tax and €950 as input tax in the same return, and the net VAT effect is €0.

## Standard VAT and GST Rates by Jurisdiction (2026)

| Jurisdiction | Tax name | Standard rate | Notes |
|---|---|---|---|
| United Kingdom | VAT | 20% | Reduced 5%; zero rate 0% |
| Germany | USt / MwSt | 19% | Reduced 7% |
| France | TVA | 20% | Reduced 10%, 5.5%, 2.1% |
| Italy | IVA | 22% | Reduced 10%, 5%, 4% |
| Spain | IVA | 21% | Reduced 10%, 4% |
| Netherlands | BTW | 21% | Reduced 9% |
| Ireland | VAT | 23% | Reduced 13.5%, 9%, 4.8% |
| Hungary | ÁFA | 27% | Highest standard rate in the EU |
| Luxembourg | TVA | 17% | Lowest standard rate in the EU |
| Australia | GST | 10% | Administered by the ATO |
| Canada | GST / HST | 5% federal GST | Participating provinces add HST; others add provincial tax |
| New Zealand | GST | 15% | Administered by Inland Revenue |
| Singapore | GST | 9% | Administered by IRAS |
| Japan | Consumption tax | 10% | Reduced 8% for certain items |

Rates change, so confirm the current rate with the relevant tax authority before invoicing.

## Common Mistakes & Misconceptions

**1. Subtracting a flat percentage from a gross price.** This is the most common error and it understates the net price. Always divide by \((1 + r)\).

**2. Using the wrong rate class.** A reduced-rated, zero-rated, or exempt supply is not taxed like a standard-rated one. Treating zero-rated sales as exempt can cost you the right to recover input tax.

**3. Treating VAT as a business expense.** For a registered business, VAT collected belongs to the tax authority, and input tax is generally recoverable. Counting it as revenue or cost misstates profit.

**4. Rounding inconsistently.** Rounding VAT separately per line and per invoice can create penny differences. Follow your authority's rounding rules and keep one method.

**5. Mishandling the reverse charge.** The supplier's invoice shows no VAT. The buyer must account for both output and input tax. Forgetting the output side underreports tax.

**6. Stacking taxes incorrectly.** When two taxes apply to the same net price, add the rates and use the combined rate in the formulas. This is not valid when one tax is calculated on top of another.

## Frequently Asked Questions

**How do I calculate VAT from a VAT-inclusive price?**
Divide the gross price by \((1 + r)\) to get the net price, then subtract the net price from the gross. Or multiply the gross by \(\frac{r}{1+r}\). At 20%, VAT is one-sixth of the gross price.

**What is the difference between VAT and GST?**
The mechanism is the same: tax on supplies, with credit for tax paid on purchases. The name differs by country. The UK and EU say VAT, while Australia, Canada, New Zealand, and Singapore say GST.

**What is the difference between zero-rated and exempt?**
A zero-rated supply is taxable at 0%, so the supplier can recover input tax. An exempt supply is outside the tax, so related input tax generally cannot be recovered.

**When does the reverse charge apply?**
It commonly applies to cross-border B2B services and to specified domestic sectors, such as UK construction services. The rules, scope, and invoice wording vary by country, so check your tax authority's guidance.

## Try It Yourself: Interactive Tool

The [Global VAT & GST Calculator](/tax-calculators/vat-calculator/) applies these formulas. Enter an amount, choose whether it includes tax, and set the rate to see the net price, tax amount, and gross price. It lets you test both forward addition and reverse extraction.

ToolsCastle runs every calculation in your browser. Your figures are never sent to a server or stored.

## Professional Disclaimer

This article is for educational purposes only and is not tax, legal, or accounting advice. ToolsCastle calculators are mathematical estimation models and do not replace a qualified tax adviser. Rates, thresholds, rate classifications, and reverse-charge rules differ by country and change over time. The examples are simplified and exclude registration thresholds, partial exemption, and special schemes. Confirm current rules with HMRC, the relevant EU national tax authority, the ATO, the CRA, or another competent authority before filing or invoicing.