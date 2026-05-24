export const currencies = [
  { code: "MEAL_SWIPE", displayName: "Meal Swipe", hierarchyRank: 5 },
  { code: "FLEX_DIRHAM", displayName: "Flex Dirham", hierarchyRank: 4 },
  { code: "CAMPUS_DIRHAM", displayName: "Campus Dirham", hierarchyRank: 3 },
  { code: "FALCON_DIRHAM", displayName: "Falcon Dirham", hierarchyRank: 2 },
  { code: "REAL_DIRHAM", displayName: "Real Dirham", hierarchyRank: 1 }
] as const;

export type CurrencyCode = (typeof currencies)[number]["code"];

export function isCurrencyCode(value: string): value is CurrencyCode {
  return currencies.some((currency) => currency.code === value);
}

export function getCurrencyDisplayName(code: string) {
  return currencies.find((currency) => currency.code === code)?.displayName ?? code;
}

export function currencySlug(code: string) {
  return code.toLowerCase().replaceAll("_", "-");
}

export function marketSlug(baseCurrencyCode: string, quoteCurrencyCode: string) {
  return `${currencySlug(baseCurrencyCode)}-${currencySlug(quoteCurrencyCode)}`;
}

export function parseMarketSlug(slug: string) {
  for (const baseCurrency of currencies) {
    for (const quoteCurrency of currencies) {
      if (baseCurrency.code !== quoteCurrency.code && marketSlug(baseCurrency.code, quoteCurrency.code) === slug) {
        return {
          baseCurrencyCode: baseCurrency.code,
          quoteCurrencyCode: quoteCurrency.code
        };
      }
    }
  }

  return null;
}

export function makeEmptyMarketFromSlug(slug: string) {
  const parsed = parseMarketSlug(slug);

  if (!parsed) {
    return null;
  }

  return {
    id: slug,
    slug,
    baseCurrency: {
      code: parsed.baseCurrencyCode,
      displayName: getCurrencyDisplayName(parsed.baseCurrencyCode)
    },
    quoteCurrency: {
      code: parsed.quoteCurrencyCode,
      displayName: getCurrencyDisplayName(parsed.quoteCurrencyCode)
    },
    bids: []
  };
}

export function validateMarketPair(baseCurrencyCode: string, quoteCurrencyCode: string) {
  if (!isCurrencyCode(baseCurrencyCode) || !isCurrencyCode(quoteCurrencyCode)) {
    return { valid: false as const, error: "Unknown currency code." };
  }

  if (baseCurrencyCode === quoteCurrencyCode) {
    return { valid: false as const, error: "Choose two different currencies." };
  }

  return { valid: true as const, baseCurrencyCode, quoteCurrencyCode };
}
