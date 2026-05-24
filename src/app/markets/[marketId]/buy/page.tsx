import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BidControls } from "@/components/BidControls";
import { devMarkets } from "@/lib/dev-data";
import { makeEmptyMarketFromSlug } from "@/lib/domain/currencies";
import { getMarketDetail } from "@/lib/server/marketService";
import { hasSessionCookie } from "@/lib/server/auth";

async function loadMarket(marketId: string) {
  if (!process.env.DATABASE_URL) {
    return devMarkets.find((market) => market.id === marketId || market.slug === marketId) ?? makeEmptyMarketFromSlug(marketId) ?? devMarkets[0];
  }

  try {
    const market = await getMarketDetail(marketId);
    if (market) {
      return JSON.parse(JSON.stringify(market));
    }
  } catch {
    // Fall through to seeded UI data.
  }

  return devMarkets.find((market) => market.id === marketId || market.slug === marketId) ?? makeEmptyMarketFromSlug(marketId) ?? devMarkets[0];
}

export default async function BuyBidPage({ params }: { params: { marketId: string } }) {
  const market = await loadMarket(params.marketId);
  const hasSession = hasSessionCookie();

  return (
    <main className="min-h-screen bg-[#101113] text-white">
      <section className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
        <Link
          href={`/markets/${market.slug}`}
          className="inline-flex items-center gap-2 rounded-full p-2 text-white/70 hover:bg-white/10 no-underline"
        >
          <ArrowLeft size={24} />
          Market
        </Link>

        <div className="mt-10">
          <p className="m-0 text-sm font-semibold text-[#c3a6ff]">
            Buy bid
          </p>
          <h1 className="mt-3 text-[clamp(2.5rem,8vw,4.5rem)] font-black leading-[1.08] tracking-normal">
            {market.baseCurrency.displayName} / {market.quoteCurrency.displayName}
          </h1>
          <p className="mt-4 text-lg text-white/55">
            Place a buy bid using your verified NetID session. Sellers will see it if it becomes the best active bid.
          </p>
        </div>

        {!hasSession ? (
          <div
            className="mt-8 rounded-2xl border border-[#c3a6ff]/25 bg-[#211a33] p-4 text-sm text-[#dccfff]"
          >
            Demo guest mode can preview this form. Login or register to submit a live bid.
          </div>
        ) : null}

        <div className="mt-8">
          <BidControls
            marketId={market.id}
            baseLabel={market.baseCurrency.displayName}
            quoteLabel={market.quoteCurrency.displayName}
            variant="dark"
          />
        </div>
      </section>
    </main>
  );
}
