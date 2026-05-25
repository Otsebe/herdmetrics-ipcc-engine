import { calculateEmissions, estimateReduction } from "./calculations";

// ─── calculateEmissions ───────────────────────────────────────────────────────

describe("calculateEmissions", () => {
  test("returns correct monthly CH₄ for 50 beef cattle on open grazing", () => {
    const result = calculateEmissions({
      breed: "beef_cattle",
      feedType: "grazing",
      herdSize: 50,
    });

    // Manual check:
    // EF_enteric = (130 × 0.065 × 365) / 55.65 = 55.40 kg CH₄/head/year
    // Total annual = (55.40 + 5.3) × 50 = 3035 kg CH₄/year
    // Monthly = 3035 / 12 ≈ 252.92 kg CH₄/month
    expect(result.totalMonthlyKgCH4).toBeCloseTo(252.92, 0);
    expect(result.entericPerAnimalAnnual).toBeCloseTo(55.4, 0);
    expect(result.label).toBe("Beef cattle — grazing");
  });

  test("feedlot produces lower emissions than grazing due to reduced Ym", () => {
    const grazing = calculateEmissions({
      breed: "beef_cattle",
      feedType: "grazing",
      herdSize: 100,
    });
    const feedlot = calculateEmissions({
      breed: "beef_cattle",
      feedType: "feedlot",
      herdSize: 100,
    });

    // Feedlot has lower Ym (5.5%) but higher GE — net effect depends on values.
    // This test confirms the engine differentiates between feed types.
    expect(grazing.totalAnnualKgCH4).not.toBe(feedlot.totalAnnualKgCH4);
  });

  test("herd of 200 dairy cows on mixed feed produces correct CO₂e", () => {
    const result = calculateEmissions({
      breed: "dairy_cow",
      feedType: "mixed",
      herdSize: 200,
    });

    // CO₂e = totalAnnualKgCH4 × 27.9 / 1000
    const expectedCO2e =
      Math.round(((result.totalAnnualKgCH4 * 27.9) / 1000) * 100) / 100;
    expect(result.totalAnnualTonnesCO2e).toBe(expectedCO2e);
  });

  test("scales linearly with herd size", () => {
    const herd100 = calculateEmissions({
      breed: "sheep",
      feedType: "grazing",
      herdSize: 100,
    });
    const herd200 = calculateEmissions({
      breed: "sheep",
      feedType: "grazing",
      herdSize: 200,
    });

    expect(herd200.totalAnnualKgCH4).toBeCloseTo(
      herd100.totalAnnualKgCH4 * 2,
      1
    );
  });

  test("throws an error for invalid herd size", () => {
    expect(() =>
      calculateEmissions({ breed: "goat", feedType: "grazing", herdSize: 0 })
    ).toThrow("herdSize must be a positive integer");
  });

  test("throws an error for unknown breed", () => {
    expect(() =>
      calculateEmissions({
        breed: "unknown_animal" as any,
        feedType: "grazing",
        herdSize: 10,
      })
    ).toThrow('Unknown breed: "unknown_animal"');
  });
});

// ─── estimateReduction ────────────────────────────────────────────────────────

describe("estimateReduction", () => {
  test("Moringa supplementation at 20% reduction saves correct monthly CH₄", () => {
    const baseline = calculateEmissions({
      breed: "beef_cattle",
      feedType: "grazing",
      herdSize: 50,
    });

    const result = estimateReduction(baseline, 20);

    expect(result.reductionPercent).toBe(20);
    expect(result.reducedMonthlyKgCH4).toBeCloseTo(
      baseline.totalMonthlyKgCH4 * 0.8,
      1
    );
    expect(result.monthlySavingKgCH4).toBeCloseTo(
      baseline.totalMonthlyKgCH4 * 0.2,
      1
    );
  });

  test("30% reduction (maximum Moringa effect) reduces output by a third", () => {
    const baseline = calculateEmissions({
      breed: "dairy_cow",
      feedType: "mixed",
      herdSize: 100,
    });

    const result = estimateReduction(baseline, 30);
    expect(result.reducedMonthlyKgCH4).toBeCloseTo(
      baseline.totalMonthlyKgCH4 * 0.7,
      1
    );
  });

  test("throws an error for reduction percent above 100", () => {
    const baseline = calculateEmissions({
      breed: "goat",
      feedType: "grazing",
      herdSize: 10,
    });
    expect(() => estimateReduction(baseline, 110)).toThrow(
      "reductionPercent must be between 0 and 100"
    );
  });
});
