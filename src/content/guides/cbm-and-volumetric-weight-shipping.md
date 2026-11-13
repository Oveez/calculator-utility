---
title: "CBM and Volumetric Weight in Freight Shipping: How Carriers Calculate Chargeable Weight"
description: "Learn how CBM, dimensional divisors, and volumetric weight determine chargeable weight in air and ocean freight, with a worked e-commerce box example."
author: "Tanvirul Islam"
affiliation: "Department of Management Information Systems, University of Dhaka"
publishDate: "2026-11-12"
category: "Logistics & Shipping"
relatedTool: "/shipping-calculators/cbm-calculator/"
relatedToolName: "CBM & Cargo Shipping Calculator"
coverImage: "/images/guides/cbm-and-volumetric-weight-shipping.jpg"
coverImageAlt: "CBM and Volumetric Weight in Freight Shipping Infographic"
---

## Executive Summary

A freight carrier sells **space and lifting capacity**, not just kilograms. A box of pillows can fill a whole shelf of an aircraft while weighing almost nothing, so carriers bill the greater of the shipment's **actual (gross) weight** and its **volumetric weight**. That larger figure is the **chargeable weight**.

Three reference points cover most international freight:

- Express couriers typically convert volume at **5,000 cm³ per kg**, so 1 m³ is 200 kg.
- IATA air cargo rules use **6,000 cm³ per kg**, so 1 m³ is about 166.67 kg.
- LCL ocean freight uses **1 CBM = 1,000 kg**, billed on whichever of weight or volume is greater.

A 60 × 45 × 40 cm carton weighing 8.5 kg is billed as **21.6 kg** by an express courier. That is more than two and a half times its actual weight.

## Core Concepts & Official Definitions

**CBM (cubic meter).** The volume of cargo in cubic meters: length × width × height, each in meters. Measure the outer dimensions of the packed carton, including padding.

**Gross weight.** The actual weight of the goods plus packaging.

**Volumetric (dimensional) weight.** A weight equivalent calculated from volume using a **divisor** or conversion factor.

**Chargeable weight.** The weight the carrier bills. For air freight, it is the greater of gross and volumetric weight. The International Air Transport Association (IATA) Cargo Tariff (TACT) rules define chargeable weight and set the standard international volumetric factor of 6,000 cm³ per kg.

**Revenue ton, or W/M (weight or measure).** In LCL ocean freight, the unit billed is the greater of 1 metric ton (1,000 kg) or 1 cubic meter. Ocean carriers publish their own tariffs, so surcharges and minimums vary.

**Density.** Gross weight divided by volume (kg/m³). If a shipment's density is below the carrier's reference density, volume decides the charge.

**"Cubing out" vs. "weighing out."** Light cargo fills a vehicle's space before reaching its weight limit. Dense cargo reaches the weight limit first. Volumetric pricing protects the carrier's revenue in the first case.

**Customs note.** Volumetric weight is a commercial billing measure. Customs declarations use actual gross and net weights.

## The Exact Mathematical Formula & Step-by-Step Breakdown

**Cubic meters:**

$$\text{CBM} = L_m \times W_m \times H_m = \frac{L_{cm} \times W_{cm} \times H_{cm}}{1{,}000{,}000}$$

**Volumetric weight (air):**

$$\text{Volumetric weight (kg)} = \frac{L_{cm} \times W_{cm} \times H_{cm}}{\text{divisor}}, \quad \text{divisor} = 5{,}000 \text{ or } 6{,}000$$

The same result in terms of CBM:

$$\text{Volumetric weight} = \text{CBM} \times 200 \ (5{,}000) \quad \text{or} \quad \text{CBM} \times 166.67 \ (6{,}000)$$

**Chargeable weight:**

$$\text{Chargeable weight} = \max(\text{Gross weight},\ \text{Volumetric weight})$$

**LCL ocean:**

$$\text{Revenue tons} = \max\left(\frac{\text{Gross weight (kg)}}{1{,}000},\ \text{CBM}\right)$$

**Break-even density.** The crossover happens when density equals the reference density:

$$\rho^{*} = \frac{1{,}000{,}000}{\text{divisor}} \ \text{kg/m}^3 = 200 \ (5{,}000) \quad \text{or} \quad 166.67 \ (6{,}000)$$

For ocean LCL, $\rho^{*} = 1{,}000$ kg/m³.

**Steps:** (1) measure the outer carton in cm, (2) compute volume in cm³, (3) divide by the carrier's divisor, (4) compare with gross weight, (5) bill the larger, after the carrier's rounding rule.

## Comprehensive Real-World Worked Numerical Example

An e-commerce seller ships two cartons.

| | Box A (bulky, light) | Box B (compact, dense) |
|---|---|---|
| Outer size | 60 × 45 × 40 cm | 30 × 25 × 20 cm |
| Volume | 108,000 cm³ = 0.108 CBM | 15,000 cm³ = 0.015 CBM |
| Gross weight | 8.5 kg | 12.0 kg |
| Density | 78.7 kg/m³ | 800 kg/m³ |
| Volumetric weight at 5,000 | 21.6 kg | 3.0 kg |
| Volumetric weight at 6,000 | 18.0 kg | 2.5 kg |
| Chargeable, express courier (5,000) | **21.6 kg**, billed as 22.0 kg | **12.0 kg** |
| Chargeable, IATA basis (6,000) | **18.0 kg** | **12.0 kg** |
| LCL revenue tons | 0.108 (measure) | 0.015 (measure) |

**Box A, step by step:**

$$\text{CBM} = 0.60 \times 0.45 \times 0.40 = 0.108 \qquad \text{Volumetric} = \frac{60 \times 45 \times 40}{5{,}000} = \frac{108{,}000}{5{,}000} = 21.6 \text{ kg}$$

Because $21.6 > 8.5$, volumetric weight is chargeable. Many carriers round up to the next 0.5 kg, giving 22.0 kg.

**Box B, step by step:**

$$\text{Volumetric} = \frac{30 \times 25 \times 20}{5{,}000} = 3.0 \text{ kg} < 12.0 \text{ kg}$$

Gross weight is chargeable.

**Illustrative cost.** At a hypothetical express rate of \$4.50 per kg, Box A costs $22.0 \times \$4.50 = \$99.00$, against \$38.25 if billed on its actual 8.5 kg. That is about 159% more. Box B costs $12.0 \times \$4.50 = \$54.00$.

**Ocean contrast.** Box B is heavy by air standards but light by ocean standards: 800 kg/m³ is below 1,000, so LCL bills it on volume. Only goods denser than 1,000 kg/m³, such as metal parts, are billed on weight in LCL. For 50 cartons like Box A, the cargo is $50 \times 0.108 = 5.4$ CBM and weighs 425 kg. At an illustrative \$70 per W/M, it is billed 5.4 revenue tons, or \$378.00.

**Right-sizing.** Repacking Box A into a 50 × 40 × 35 cm carton gives $\frac{70{,}000}{5{,}000} = 14.0$ kg, which cuts chargeable weight by 7.6 kg, or 35.2%.

## Comparing Conversion Standards

| Mode | Common conversion | Reference density | Billing rule |
|---|---|---|---|
| Express courier (air) | 5,000 cm³ per kg | 200 kg/m³ | Greater of gross and volumetric, usually per package |
| IATA air cargo | 6,000 cm³ per kg | 166.67 kg/m³ | Greater of gross and volumetric, usually per consignment |
| LCL ocean | 1 CBM = 1,000 kg | 1,000 kg/m³ | Greater of tonnes or CBM (W/M) |
| FCL ocean | Priced per container | n/a | Container size, not CBM or weight |
| Road freight | Varies by carrier and country | Often roughly 250–333 kg/m³ | Check the carrier's tariff |

## Common Mistakes & Misconceptions

**1. Mixing units.** Entering centimeters into a formula that expects meters is off by a factor of 1,000,000. Convert once, then check the result.

**2. Using product size instead of carton size.** Carriers measure the outermost dimensions, including padding, pallets, and any bulging.

**3. Using the wrong divisor.** The 5,000 and 6,000 conventions give different results, 21.6 kg versus 18.0 kg for Box A. Confirm your carrier's divisor in its rate card.

**4. Assuming the scale weight is what you pay.** For light, bulky goods, volume sets the bill.

**5. Ignoring rounding and minimums.** Carriers round dimensions up and often round chargeable weight to the next 0.5 or 1 kg, and many apply minimum charges.

**6. Overestimating container capacity.** Nominal CBM is not usable space. Stacking limits and gaps between cartons reduce what actually fits.

## Frequently Asked Questions

**Why do carriers charge by volume instead of weight only?**
Aircraft and containers fill up by space before they reach weight limits when cargo is light. Charging on the greater of weight and volume keeps pricing proportional to the capacity each shipment uses.

**Should I use 5,000 or 6,000 as the divisor?**
Use your carrier's. Express couriers commonly use 5,000. IATA air cargo uses 6,000. Check the rate card or contract.

**How do I convert inches and pounds?**
For volumetric weight in pounds, divide cubic inches by about 139 (equivalent to 5,000 cm³/kg) or about 166 (equivalent to 6,000 cm³/kg). For CBM, multiply cubic inches by 0.0000163871.

**How can I reduce chargeable weight?**
Right-size cartons, remove empty space, use compressible packaging, and consolidate small packages where the carrier's rules allow. Re-check dimensions after any repacking.

## Try It Yourself: Interactive Tool

The [CBM & Cargo Shipping Calculator](/shipping-calculators/cbm-calculator/) applies these formulas. Enter your carton dimensions, quantity, and gross weight, then choose a divisor to see CBM, volumetric weight, and the chargeable weight your carrier is likely to bill.

ToolsCastle runs every calculation in your browser. Your shipment details are never sent to a server or stored.

## Professional Disclaimer

This article is for educational purposes only and is not logistics, legal, or customs advice. ToolsCastle calculators are mathematical estimation models and do not replace carrier quotes. Divisors, rounding rules, minimum charges, and surcharges differ by carrier, lane, and contract. The dollar rates in the examples are illustrative, not market rates. Confirm all terms with your carrier or freight forwarder before shipping.