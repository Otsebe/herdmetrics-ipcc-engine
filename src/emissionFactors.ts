/**
 * IPCC Tier 2 Emission Factors for Enteric Fermentation
 *
 * Sources:
 *   - Gross Energy (GE): IPCC 2006 Guidelines, Volume 4, Chapter 10, Table 10.2
 *   - Methane Conversion Factor (Ym): IPCC 2006 Guidelines, Volume 4, Chapter 10, Table 10.12
 *   - Manure Management (EF_manure): IPCC 2006 Guidelines, Volume 4, Chapter 10, Table 10A-4
 *
 * GE unit: MJ/day per head
 * Ym unit: % (fraction of gross energy converted to methane)
 * EF_manure unit: kg CH₄/head/year
 */

export type BreedKey = "dairy_cow" | "beef_cattle" | "sheep" | "goat" | "buffalo";
export type FeedKey = "grazing" | "mixed" | "feedlot" | "crop_residue";

export interface EmissionFactor {
  /** Gross energy intake (MJ/day) — IPCC Table 10.2 */
  GE: number;
  /** Methane conversion factor (%) — IPCC Table 10.12 */
  Ym: number;
  /** Manure management emission factor (kg CH₄/head/year) — IPCC Table 10A-4 */
  EF_manure: number;
  /** Human-readable label */
  label: string;
}

/**
 * Emission factors keyed by breed and feeding system.
 * Values reflect sub-Saharan Africa / southern Africa regional context.
 */
export const EMISSION_FACTORS: Record<BreedKey, Record<FeedKey, EmissionFactor>> = {
  dairy_cow: {
    grazing:      { GE: 200, Ym: 6.5, EF_manure: 8.8,  label: "Dairy cow — grazing" },
    mixed:        { GE: 220, Ym: 6.0, EF_manure: 9.2,  label: "Dairy cow — mixed" },
    feedlot:      { GE: 240, Ym: 5.5, EF_manure: 9.8,  label: "Dairy cow — feedlot" },
    crop_residue: { GE: 180, Ym: 7.0, EF_manure: 7.5,  label: "Dairy cow — crop residue" },
  },
  beef_cattle: {
    grazing:      { GE: 130, Ym: 6.5, EF_manure: 5.3,  label: "Beef cattle — grazing" },
    mixed:        { GE: 150, Ym: 6.0, EF_manure: 5.8,  label: "Beef cattle — mixed" },
    feedlot:      { GE: 170, Ym: 5.5, EF_manure: 6.2,  label: "Beef cattle — feedlot" },
    crop_residue: { GE: 110, Ym: 7.0, EF_manure: 4.6,  label: "Beef cattle — crop residue" },
  },
  sheep: {
    grazing:      { GE: 35,  Ym: 6.5, EF_manure: 0.40, label: "Sheep — grazing" },
    mixed:        { GE: 40,  Ym: 6.0, EF_manure: 0.42, label: "Sheep — mixed" },
    feedlot:      { GE: 45,  Ym: 5.5, EF_manure: 0.45, label: "Sheep — feedlot" },
    crop_residue: { GE: 30,  Ym: 7.0, EF_manure: 0.35, label: "Sheep — crop residue" },
  },
  goat: {
    grazing:      { GE: 30,  Ym: 6.5, EF_manure: 0.33, label: "Goat — grazing" },
    mixed:        { GE: 34,  Ym: 6.0, EF_manure: 0.35, label: "Goat — mixed" },
    feedlot:      { GE: 38,  Ym: 5.5, EF_manure: 0.37, label: "Goat — feedlot" },
    crop_residue: { GE: 26,  Ym: 7.0, EF_manure: 0.28, label: "Goat — crop residue" },
  },
  buffalo: {
    grazing:      { GE: 185, Ym: 6.5, EF_manure: 7.2,  label: "Buffalo — grazing" },
    mixed:        { GE: 205, Ym: 6.0, EF_manure: 7.8,  label: "Buffalo — mixed" },
    feedlot:      { GE: 225, Ym: 5.5, EF_manure: 8.3,  label: "Buffalo — feedlot" },
    crop_residue: { GE: 165, Ym: 7.0, EF_manure: 6.5,  label: "Buffalo — crop residue" },
  },
};

/**
 * Global Warming Potential of methane (CH₄) relative to CO₂ over 100 years.
 * Source: IPCC Sixth Assessment Report (AR6), 2021.
 */
export const GWP_CH4 = 27.9;

/**
 * Energy content of methane.
 * Source: IPCC 2006 Guidelines, Volume 4, Chapter 10, Equation 10.21.
 * Unit: MJ/kg CH₄
 */
export const ENERGY_CONTENT_CH4 = 55.65;
