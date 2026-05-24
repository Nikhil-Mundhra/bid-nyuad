import { MarketPickerScreen } from "@/components/MarketMobileScreen";
import { devMarkets } from "@/lib/dev-data";
import { getMarketSummaries } from "@/lib/server/marketService";

async function loadMarkets() {
  if (!process.env.DATABASE_URL) {
    return devMarkets;
  }

  try {
    const markets = await getMarketSummaries();
    return JSON.parse(JSON.stringify(markets));
  } catch {
    return devMarkets;
  }
}

export default async function MarketsPage() {
  const markets = await loadMarkets();

  return <MarketPickerScreen markets={markets} />;
}
