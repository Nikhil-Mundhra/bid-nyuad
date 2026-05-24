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
    <main className="min-h-screen bg-[#101113] text-white" style={{ minHeight: "100vh", background: "#101113", color: "#fff" }}>
      <section className="mx-auto max-w-3xl px-5 py-8 sm:px-8" style={{ maxWidth: 768, margin: "0 auto", padding: "2rem" }}>
        <Link
          href={`/markets/${market.slug}`}
          className="inline-flex items-center gap-2 rounded-full p-2 text-white/70 hover:bg-white/10"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 999, padding: 8, color: "rgba(255,255,255,0.7)", textDecoration: "none" }}
        >
          <ArrowLeft size={24} />
          Market
        </Link>

        <div className="mt-10" style={{ marginTop: 40 }}>
          <p className="text-sm font-semibold text-[#c3a6ff]" style={{ margin: 0, color: "#c3a6ff", fontSize: 14, fontWeight: 600 }}>
            Buy bid
          </p>
          <h1 className="mt-3 text-5xl font-black leading-tight tracking-normal" style={{ margin: "12px 0 0", fontSize: "clamp(2.5rem, 8vw, 4.5rem)", lineHeight: 1.08, fontWeight: 900, letterSpacing: 0 }}>
            {market.baseCurrency.displayName} / {market.quoteCurrency.displayName}
          </h1>
          <p className="mt-4 text-lg text-white/55" style={{ margin: "16px 0 0", color: "rgba(255,255,255,0.55)", fontSize: 18 }}>
            Place a buy bid using your verified NetID session. Sellers will see it if it becomes the best active bid.
          </p>
        </div>

        {!hasSession ? (
          <div
            className="mt-8 rounded-2xl border border-[#c3a6ff]/25 bg-[#211a33] p-4 text-sm text-[#dccfff]"
            style={{ marginTop: 32, border: "1px solid rgba(195,166,255,0.25)", borderRadius: 16, background: "#211a33", padding: 16, color: "#dccfff", fontSize: 14 }}
          >
            Demo guest mode can preview this form. Login or register to submit a live bid.
          </div>
        ) : null}

        <div className="mt-8" style={{ marginTop: 32 }}>
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
