"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { MarketChart } from "@/components/MarketChart";

type MarketSummary = {
  id: string;
  slug: string;
  baseCurrency: { displayName: string; code: string };
  quoteCurrency: { displayName: string; code: string };
  bids: Array<{
    id: string;
    baseAmount: number | string;
    quoteAmount: number | string;
    rate: number | string;
    status: string;
    createdAt: string | Date;
  }>;
};

export function MarketCarousel({ markets }: { markets: MarketSummary[] }) {
  const [index, setIndex] = useState(0);
  const market = markets[index] ?? markets[0];

  const highestBid = useMemo(() => {
    return market?.bids
      .filter((bid) => bid.status === "ACTIVE")
      .slice()
      .sort((left, right) => Number(right.rate) - Number(left.rate))[0];
  }, [market]);

  if (!market) {
    return <p className="text-sm text-ink/70">No markets are available yet.</p>;
  }

  return (
    <section className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-palm">Live market</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-normal text-ink">
            {market.baseCurrency.displayName} / {market.quoteCurrency.displayName}
          </h1>
          {highestBid ? (
            <p className="mt-2 text-sm text-ink/70">
              Best active bid: {Number(highestBid.quoteAmount).toFixed(2)} {market.quoteCurrency.displayName}s for{" "}
              {Number(highestBid.baseAmount).toFixed(2)} {market.baseCurrency.displayName}s
            </p>
          ) : (
            <p className="mt-2 text-sm text-ink/70">No active bids yet.</p>
          )}
        </div>
        <div className="flex gap-1">
          <button
            className="rounded-md border border-ink/10 p-2 hover:bg-ink/5"
            onClick={() => setIndex((current) => (current - 1 + markets.length) % markets.length)}
            title="Previous market"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            className="rounded-md border border-ink/10 p-2 hover:bg-ink/5"
            onClick={() => setIndex((current) => (current + 1) % markets.length)}
            title="Next market"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
      <div className="mt-4">
        <MarketChart points={market.bids} />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {markets.map((item, itemIndex) => (
          <button
            key={item.id}
            className={`h-2.5 w-8 rounded-full ${itemIndex === index ? "bg-falcon" : "bg-ink/15"}`}
            onClick={() => setIndex(itemIndex)}
            title={`${item.baseCurrency.displayName} / ${item.quoteCurrency.displayName}`}
          />
        ))}
        <Link
          href={`/markets/${market.slug}`}
          className="ml-auto rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink/90"
        >
          Open market
        </Link>
      </div>
    </section>
  );
}
