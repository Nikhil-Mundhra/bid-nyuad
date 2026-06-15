import { MarketMobileScreen } from "@/components/MarketMobileScreen";
import { devMarkets } from "@/lib/dev-data";
import { makeEmptyMarketFromSlug } from "@/lib/domain/currencies";
import { getMarketDetail } from "@/lib/server/marketService";
import { serialize } from "@/lib/serialize";

async function loadMarket(marketId: string) {
  if (!process.env.DATABASE_URL) {
    return devMarkets.find((market) => market.id === marketId || market.slug === marketId) ?? makeEmptyMarketFromSlug(marketId) ?? devMarkets[0];
  }

  try {
    const market = await getMarketDetail(marketId);
    if (market) {
      return serialize(market);
    }
  } catch {
    // Fall through to seeded UI data.
  }

  return devMarkets.find((market) => market.id === marketId || market.slug === marketId) ?? makeEmptyMarketFromSlug(marketId) ?? devMarkets[0];
}

export default async function MarketDetailPage({ params }: { params: { marketId: string } }) {
  const market: any = await loadMarket(params.marketId);
  const activeBids = market.bids
    .filter((bid: { status: string }) => bid.status === "ACTIVE")
    .slice()
    .sort((left: { rate: any }, right: { rate: any }) => Number(right.rate) - Number(left.rate));

  return <MarketMobileScreen market={market} activeBids={activeBids} />;
}
