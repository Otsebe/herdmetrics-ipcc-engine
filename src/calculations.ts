/**
 * HerdMetrics — IPCC Tier 2 Methane Calculation Engine
 *
 * Implements enteric fermentation and manure management methane estimation
 * using the IPCC Tier 2 methodology.
 *
 * Core formula (IPCC 2006, Vol. 4, Ch. 10, Equation 10.21):
 *
 *   EF_enteric (kg CH₄/head/year) = (GE × Ym) / 55.65
 *
 * Where:
 *   GE  = Gross energy intake (MJ/head/day)
 *   Ym  = Methane conversion factor (% of GE)
 *   55.65 = Energy content of methane (MJ/kg CH₄)
 */

import {
  EMISSION_FACTORS,
  GWP_CH4,
  ENERGY_CONTENT_CH4,
  type BreedKey,
  type FeedKey,
} from "./emissionFactors";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HerdInput {
  /** Livestock breed category */
  breed: BreedKey;
  /** Feeding system type */
  feedType: FeedKey;
  /** Number of animals in the herd */
  herdSize: number;
}

export interface EmissionResult {
  /** Per-animal annual enteric CH₄ (kg CH₄/head/year) */
  entericPerAnimalAnnual: number;
  /** Per-animal annual manure CH₄ (kg CH₄/head/year) */
  manurePerAnimalAnnual: number;
  /** Total annual CH₄ for full herd — enteric + manure (kg CH₄/year) */
  totalAnnualKgCH4: number;
  /** Total monthly CH₄ for full herd (kg CH₄/month) */
  totalMonthlyKgCH4: number;
  /** CO₂ equivalent — full herd annual (tonnes CO₂e/year) */
  totalAnnualTonnesCO2e: number;
  /** Descriptive label of the breed + feed combination used */
  label: string;
}

export interface ReductionResult {
  /** Reduced monthly CH₄ output after intervention (kg CH₄/month) */
  reducedMonthlyKgCH4: number;
  /** Monthly CH₄ saved (kg CH₄/month) */
  monthlySavingKgCH4: number;
  /** Percentage reduction applied */
  reductionPercent: number;
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validateInput(input: HerdInput): void {
  if (!EMISSION_FACTORS[input.breed]) {
    throw new Error(`Unknown breed: "${input.breed}"`);
  }
  if (!EMISSION_FACTORS[input.breed][input.feedType]) {
    throw new Error(`Unknown feed type: "${input.feedType}"`);
  }
  if (!Number.isInteger(input.herdSize) || input.herdSize < 1) {
    throw new Error(`herdSize must be a positive integer, got: ${input.herdSize}`);
  }
}

// ─── Core calculation ─────────────────────────────────────────────────────────

/**
 * Calculates methane emissions for a herd using IPCC Tier 2 methodology.
 *
 * @param input - Breed, feed type, and herd size
 * @returns Detailed emission results per animal and for the full herd
 */
export function calculateEmissions(input: HerdInput): EmissionResult {
  validateInput(input);

  const { GE, Ym, EF_manure, label } = EMISSION_FACTORS[input.breed][input.feedType];

  // IPCC Equation 10.21: EF = (GE × Ym/100 × 365) / 55.65
  const entericPerAnimalAnnual = (GE * (Ym / 100) * 365) / ENERGY_CONTENT_CH4;

  // Total annual for full herd (enteric + manure)
  const totalAnnualKgCH4 =
    (entericPerAnimalAnnual + EF_manure) * input.herdSize;

  // Monthly total
  const totalMonthlyKgCH4 = totalAnnualKgCH4 / 12;

  // CO₂ equivalent (convert kg to tonnes)
  const totalAnnualTonnesCO2e = (totalAnnualKgCH4 * GWP_CH4) / 1000;

  return {
    entericPerAnimalAnnual: Math.round(entericPerAnimalAnnual * 100) / 100,
    manurePerAnimalAnnual: EF_manure,
    totalAnnualKgCH4: Math.round(totalAnnualKgCH4 * 100) / 100,
    totalMonthlyKgCH4: Math.round(totalMonthlyKgCH4 * 100) / 100,
    totalAnnualTonnesCO2e: Math.round(totalAnnualTonnesCO2e * 100) / 100,
    label,
  };
}

// ─── Reduction estimate ───────────────────────────────────────────────────────

/**
 * Estimates the methane reduction achievable from a feed intervention.
 *
 * @param baseline - Emission result from calculateEmissions()
 * @param reductionPercent - Expected reduction (e.g. 20 for 20%)
 * @returns Reduced output and monthly saving
 */
export function estimateReduction(
  baseline: EmissionResult,
  reductionPercent: number
): ReductionResult {
  if (reductionPercent < 0 || reductionPercent > 100) {
    throw new Error(`reductionPercent must be between 0 and 100, got: ${reductionPercent}`);
  }

  const factor = 1 - reductionPercent / 100;
  const reducedMonthlyKgCH4 =
    Math.round(baseline.totalMonthlyKgCH4 * factor * 100) / 100;
  const monthlySavingKgCH4 =
    Math.round((baseline.totalMonthlyKgCH4 - reducedMonthlyKgCH4) * 100) / 100;

  return {
    reducedMonthlyKgCH4,
    monthlySavingKgCH4,
    reductionPercent,
  };
}
