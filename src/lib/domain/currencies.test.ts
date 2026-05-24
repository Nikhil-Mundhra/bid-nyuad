import { describe, expect, it } from "vitest";
import { makeEmptyMarketFromSlug, marketSlug, parseMarketSlug, validateMarketPair } from "./currencies";

describe("currency domain", () => {
  it("builds and parses market slugs for fixed currency pairs", () => {
    const slug = marketSlug("FALCON_DIRHAM", "REAL_DIRHAM");

    expect(slug).toBe("falcon-dirham-real-dirham");
    expect(parseMarketSlug(slug)).toEqual({
      baseCurrencyCode: "FALCON_DIRHAM",
      quoteCurrencyCode: "REAL_DIRHAM"
    });
  });

  it("creates an empty market model from a valid slug", () => {
    expect(makeEmptyMarketFromSlug("meal-swipe-real-dirham")).toMatchObject({
      id: "meal-swipe-real-dirham",
      slug: "meal-swipe-real-dirham",
      baseCurrency: { code: "MEAL_SWIPE", displayName: "Meal Swipe" },
      quoteCurrency: { code: "REAL_DIRHAM", displayName: "Real Dirham" },
      bids: []
    });
  });

  it("rejects same-currency and unknown pairs", () => {
    expect(validateMarketPair("REAL_DIRHAM", "REAL_DIRHAM")).toEqual({
      valid: false,
      error: "Choose two different currencies."
    });
    expect(validateMarketPair("DINING_DOLLAR", "REAL_DIRHAM")).toEqual({
      valid: false,
      error: "Unknown currency code."
    });
  });
});
