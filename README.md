# HerdMetrics — IPCC Tier 2 Methane Estimation Engine

![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript&logoColor=white)
![IPCC](https://img.shields.io/badge/Methodology-IPCC%20Tier%202-2E7D32?style=flat)
![Tests](https://img.shields.io/badge/Tests-Jest-C21325?style=flat&logo=jest&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat)

> A strictly-typed TypeScript engine that calculates monthly methane (CH₄) emissions from livestock herds using the internationally recognised **IPCC Tier 2 methodology**, and estimates the reduction achievable through evidence-based feed interventions such as *Moringa oleifera* supplementation.

This module is the scientific core of the **HerdMetrics** mobile application — a climate tech tool designed to help Botswana's cattle farmers understand and reduce their herd's greenhouse gas footprint.

---

## The Science

### IPCC Tier 2 Formula

Enteric fermentation — the digestive process in ruminants — is the largest source of agricultural methane in Botswana, accounting for over 70% of the country's agricultural greenhouse gas emissions.

The engine implements **IPCC Equation 10.21** from the *2006 IPCC Guidelines for National Greenhouse Gas Inventories, Volume 4, Chapter 10*:

```
EF_enteric (kg CH₄/head/year) = (GE × Ym × 365) / 55.65
```

| Variable | Description | Source |
|---|---|---|
| `GE` | Gross energy intake (MJ/head/day) | IPCC Table 10.2 |
| `Ym` | Methane conversion factor (% of GE) | IPCC Table 10.12 |
| `55.65` | Energy content of methane (MJ/kg CH₄) | IPCC Equation 10.21 |

Manure management emissions are added from **IPCC Table 10A-4**, and total outputs are converted to CO₂ equivalent using a GWP of **27.9** (IPCC AR6, 2021).

### Feed Interventions

Research by ILRI and peer-reviewed agronomists across sub-Saharan Africa shows that incorporating *Moringa oleifera* leaf meal at 3–5% of dry matter intake reduces enteric methane by **15–30%** while improving feed digestibility. The `estimateReduction()` function models this directly.

---

## Sample Output

**Input:** 50 beef cattle (Brahman), open grazing

```
Enteric CH₄ per animal:   55.40 kg CH₄/head/year
Monthly herd output:      252.92 kg CH₄/month
Annual herd output:       3,035 kg CH₄/year
CO₂ equivalent:           84.68 tonnes CO₂e/year
```

**With 20% Moringa supplementation:**

```
Reduced monthly output:   202.34 kg CH₄/month
Monthly saving:            50.58 kg CH₄/month
```

---

## Project Structure

```
herdmetrics-ipcc-engine/
├── src/
│   ├── emissionFactors.ts      # IPCC Tables 10.2, 10.12, 10A-4 as typed constants
│   ├── calculations.ts         # Tier 2 formula engine and reduction estimator
│   └── calculations.test.ts    # Jest unit tests validated against IPCC reference values
├── package.json
├── tsconfig.json
└── README.md
```

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Clone the repo
git clone https://github.com/[your-username]/herdmetrics-ipcc-engine.git
cd herdmetrics-ipcc-engine

# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

---

## Usage

```typescript
import { calculateEmissions, estimateReduction } from "./src/calculations";

// Calculate emissions for a herd
const result = calculateEmissions({
  breed: "beef_cattle",
  feedType: "grazing",
  herdSize: 50,
});

console.log(`Monthly CH₄: ${result.totalMonthlyKgCH4} kg`);
console.log(`Annual CO₂e: ${result.totalAnnualTonnesCO2e} tonnes`);

// Estimate impact of Moringa supplementation (20% reduction)
const reduced = estimateReduction(result, 20);
console.log(`Monthly saving: ${reduced.monthlySavingKgCH4} kg CH₄`);
```

**Supported breeds:** `dairy_cow` · `beef_cattle` · `sheep` · `goat` · `buffalo`

**Supported feed types:** `grazing` · `mixed` · `feedlot` · `crop_residue`

---

## References

- IPCC (2006). *2006 IPCC Guidelines for National Greenhouse Gas Inventories, Volume 4: Agriculture, Forestry and Other Land Use, Chapter 10: Emissions from Livestock and Manure Management.* IGES, Japan.
- IPCC (2021). *Sixth Assessment Report (AR6) — Climate Change 2021: The Physical Science Basis.* GWP values, Chapter 7.
- Woodward, S.L. et al. (2004). Levels of nitrate and tannin in feeds and their effects on methane production in vitro. *Australian Journal of Experimental Agriculture.*
- Tan, H.Y. et al. (2011). Effects of condensed tannins from *Leucaena leucocephala* on methane production. *Animal Feed Science and Technology.*

---

## Part of the HerdMetrics Project

This engine powers the **HerdMetrics** mobile application — an Android-first React Native app built for Botswana's cattle farmers, developed as part of the Climathon Botswana climate innovation challenge.

> Full application repository: [github.com/[your-username]/herdmetrics](https://github.com/[your-username]/herdmetrics)
