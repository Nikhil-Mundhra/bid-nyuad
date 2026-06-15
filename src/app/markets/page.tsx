import { MarketPickerScreen } from "@/components/MarketMobileScreen";
import { devMarkets } from "@/lib/dev-data";
import { getMarketSummaries } from "@/lib/server/marketService";
import { serialize } from "@/lib/serialize";

async function loadMarkets() {
  if (!process.env.DATABASE_URL) {
    return devMarkets;
  }

  try {
    const markets = await getMarketSummaries();
    return serialize(markets);
  } catch {
    return devMarkets;
  }
}

export default async function MarketsPage() {
  const markets: any = await loadMarkets();

  return <MarketPickerScreen markets={markets} />;
}
