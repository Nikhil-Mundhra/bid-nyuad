"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BellPlus,
  ChevronUp,
  Heart,
  Link2,
  Search
} from "lucide-react";
import { useMemo, useState } from "react";
import { AcceptBidButton } from "@/components/AcceptBidButton";
import { MarketPairSelector } from "@/components/MarketPairSelector";

type BidPoint = {
  id: string;
  baseAmount: number | string;
  quoteAmount: number | string;
  rate: number | string;
  status: string;
  createdAt: string | Date;
};

type Market = {
  id: string;
  slug: string;
  baseCurrency: { displayName: string; code: string };
  quoteCurrency: { displayName: string; code: string };
  bids: BidPoint[];
};

const tabs = ["Overview", "Charts", "Depth", "Bids"];
const periodWindows = [
  { label: "1D", days: 1 },
  { label: "5D", days: 5 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "6M", days: 180 },
  { label: "1Y", days: 365 }
];

function compactCode(code: string) {
  return code
    .split("_")
    .map((part) => part[0])
    .join("");
}

function buildTrend(points: BidPoint[]) {
  const orderedPoints = orderPoints(points);
  const rates = orderedPoints.length ? orderedPoints.map((point) => Number(point.rate)) : [0.75, 0.78, 0.805];
  const first = rates[0] ?? 1;
  const min = Math.min(...rates) - 0.004;
  const max = Math.max(...rates) + 0.004;
  const range = Math.max(max - min, 0.01);

  return rates.map((rate, index) => {
    const progress = rates.length === 1 ? 0 : index / (rates.length - 1);
    return {
      x: progress * 1000,
      y: 330 - ((rate - min) / range) * 210,
      above: rate >= first
    };
  });
}

function orderPoints(points: BidPoint[]) {
  return points
    .slice()
    .sort((left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime());
}

function formatPercent(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function getPeriodMetrics(points: BidPoint[]) {
  const orderedPoints = orderPoints(points).filter((point) => Number.isFinite(Number(point.rate)) && Number(point.rate) > 0);
  const latest = orderedPoints[orderedPoints.length - 1];

  if (!latest) {
    return periodWindows.map((period) => ({ ...period, value: "0.00%", positive: false }));
  }

  const latestDate = new Date(latest.createdAt).getTime();
  const latestRate = Number(latest.rate);

  return periodWindows.map((period) => {
    const cutoff = latestDate - period.days * 24 * 60 * 60 * 1000;
    const comparison =
      orderedPoints
        .filter((point) => new Date(point.createdAt).getTime() <= cutoff)
        .at(-1) ?? orderedPoints[0];
    const comparisonRate = Number(comparison.rate);
    const change = ((latestRate - comparisonRate) / comparisonRate) * 100;

    return {
      ...period,
      value: formatPercent(change),
      positive: change >= 0
    };
  });
}

function getPeriodWindow(label: string) {
  return periodWindows.find((period) => period.label === label) ?? periodWindows[0];
}

function getPointsForPeriod(points: BidPoint[], label: string) {
  const orderedPoints = orderPoints(points);
  const latest = orderedPoints[orderedPoints.length - 1];

  if (!latest) {
    return orderedPoints;
  }

  const selected = getPeriodWindow(label);
  const cutoff = new Date(latest.createdAt).getTime() - selected.days * 24 * 60 * 60 * 1000;
  const pointsInWindow = orderedPoints.filter((point) => new Date(point.createdAt).getTime() >= cutoff);
  const comparisonPoint = orderedPoints.filter((point) => new Date(point.createdAt).getTime() < cutoff).at(-1);
  const windowPoints = comparisonPoint ? [comparisonPoint, ...pointsInWindow] : pointsInWindow;

  return windowPoints.length >= 2 ? windowPoints : orderedPoints.slice(-2);
}

function getHeadlineMove(points: BidPoint[]) {
  const orderedPoints = orderPoints(points);
  const latest = orderedPoints[orderedPoints.length - 1];
  const previous =
    orderedPoints
      .filter((point) => new Date(point.createdAt).getTime() <= new Date(latest?.createdAt ?? 0).getTime() - 24 * 60 * 60 * 1000)
      .at(-1) ?? orderedPoints[orderedPoints.length - 2];

  if (!latest || !previous) {
    return { amount: "0.00", percent: "0.00%", positive: false };
  }

  const latestPer100 = Number(latest.rate) * 100;
  const previousPer100 = Number(previous.rate) * 100;
  const amount = latestPer100 - previousPer100;
  const percent = (amount / previousPer100) * 100;

  return {
    amount: `${amount > 0 ? "+" : ""}${amount.toFixed(2)}`,
    percent: formatPercent(percent),
    positive: amount >= 0
  };
}

function pathFor(points: Array<{ x: number; y: number }>) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
}

function visibleSegments(points: Array<{ x: number; y: number }>) {
  const segments: Array<Array<{ x: number; y: number }>> = [];
  let current: Array<{ x: number; y: number }> = [];

  for (const point of points) {
    if (Number.isNaN(point.y)) {
      if (current.length > 1) {
        segments.push(current);
      }
      current = [];
    } else {
      current.push(point);
    }
  }

  if (current.length > 1) {
    segments.push(current);
  }

  return segments;
}

function TrendChart({ points }: { points: BidPoint[] }) {
  const trend = useMemo(() => buildTrend(points), [points]);
  const green = visibleSegments(trend.map((point) => ({ ...point, y: point.above ? point.y : NaN })));
  const red = visibleSegments(trend.map((point) => ({ ...point, y: point.above ? NaN : point.y })));

  return (
    <div className="relative h-[420px] overflow-hidden md:h-[500px]">
      <svg viewBox="0 0 1000 420" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
        <line x1="0" x2="1000" y1="190" y2="190" stroke="#6c6e73" strokeWidth="3" strokeDasharray="12 12" />
        {red.map((segment, index) => (
          <path
            key={`red-${index}`}
            d={pathFor(segment)}
            fill="none"
            stroke="#d94d52"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {green.map((segment, index) => (
          <path
            key={`green-${index}`}
            d={pathFor(segment)}
            fill="none"
            stroke="#4fa375"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
    </div>
  );
}

function MarketDesktopScreen({
  market,
  activeBids
}: {
  market: Market;
  activeBids: BidPoint[];
}) {
  const highestBid = activeBids[0];
  const [selectedPeriod, setSelectedPeriod] = useState("1Y");
  const headlinePrice = highestBid ? Number(highestBid.quoteAmount).toFixed(2) : "0.00";
  const periodMetrics = useMemo(() => getPeriodMetrics(market.bids), [market.bids]);
  const visiblePoints = useMemo(() => getPointsForPeriod(market.bids, selectedPeriod), [market.bids, selectedPeriod]);
  const headlineMove = useMemo(() => getHeadlineMove(market.bids), [market.bids]);
  const pairName = `${market.baseCurrency.displayName} / ${market.quoteCurrency.displayName}`;
  const buyHref = `/markets/${market.slug}/buy`;

  return (
    <main className="min-h-screen bg-[#0f1012] text-white">
      <header className="border-b border-white/8 bg-[#111315]/92">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between py-[18px] px-8">
          <Link href="/" className="text-[#c3a6ff] text-[22px] font-black no-underline">
            Bid-NYUAD
          </Link>
          <MarketPairSelector
            baseCurrencyCode={market.baseCurrency.code}
            quoteCurrencyCode={market.quoteCurrency.code}
            variant="desktop"
          />
        </div>
      </header>

      <section className="max-w-[1360px] mx-auto p-8">
        <div className="grid grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
          <div className="grid gap-6">
            <section className="border border-white/8 rounded-[24px] bg-[#15171a] p-7">
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-center gap-[18px] min-w-0">
                  <div className="grid w-[76px] h-[76px] place-items-center rounded-full bg-white text-[#8d6fd0] text-[22px] font-black">
                    {compactCode(market.baseCurrency.code)}
                  </div>
                  <div className="min-w-0">
                    <p className="m-0 text-[#c3a6ff] text-sm font-extrabold">Live campus market</p>
                    <h1 className="mt-1.5 m-0 text-[44px] leading-[1.05] font-black tracking-normal">
                      {pairName}
                    </h1>
                    <div className="flex gap-2 mt-3">
                      <span className="border border-white/15 rounded-lg py-1 px-2.5 text-white/55 text-[13px] font-bold">
                        NYUAD
                      </span>
                      <span className="border border-white/15 rounded-lg py-1 px-2.5 text-white/55 text-[13px] font-bold">
                        Campus FX
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-flex border border-white/15 rounded-full bg-[#101113] p-1">
                    <span className="rounded-full bg-[#261f3b] py-2 px-[22px] text-[#c3a6ff] text-[15px] font-black">BID</span>
                    <span className="py-2 px-[22px] text-white/40 text-[15px] font-extrabold">ASK</span>
                  </div>
                  <p className={`mt-[22px] m-0 text-[72px] leading-none font-black tracking-normal ${headlineMove.positive ? "text-[#52b57f]" : "text-[#ef626d]"}`}>
                    {headlinePrice}
                  </p>
                  <p className={`mt-2 m-0 text-[22px] font-extrabold ${headlineMove.positive ? "text-[#52b57f]" : "text-[#ef626d]"}`}>
                    {headlineMove.amount} ({headlineMove.percent}) <span className="ml-2.5 text-white/40">1D</span>
                  </p>
                </div>
              </div>
            </section>

            <section className="border border-white/8 rounded-[24px] bg-[#15171a] p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-7">
                  {tabs.map((tab, index) => (
                    <span key={tab} className={`text-lg font-black ${index === 0 ? "text-[#c3a6ff]" : "text-white/55"}`}>
                      {tab}
                    </span>
                  ))}
                </div>
                <Link href={buyHref} className="inline-flex items-center gap-2 rounded-full bg-[#211a33] py-3 px-[18px] text-[#c3a6ff] text-[15px] font-black no-underline">
                  <Link2 size={18} />
                  Place buy bid
                </Link>
              </div>
              <div className="h-[360px]">
                <TrendChart points={visiblePoints} />
              </div>
              <div className="grid grid-cols-6 gap-2.5 mt-3">
                {periodMetrics.map((period) => (
                  <button
                    key={period.label}
                    onClick={() => setSelectedPeriod(period.label)}
                    className={`border-0 rounded-[14px] p-3.5 text-center cursor-pointer ${selectedPeriod === period.label ? "bg-white/10" : "bg-white/5"}`}
                  >
                    <p className="m-0 text-white/60 text-sm font-extrabold">{period.label}</p>
                    <p className={`mt-1 m-0 text-lg font-black ${period.positive ? "text-[#52b57f]" : "text-[#ef626d]"}`}>{period.value}</p>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <aside className="grid gap-[18px]">
            <section className="border border-white/8 rounded-[24px] bg-[#15171a] p-5">
              <div className="grid grid-cols-2 gap-2.5">
                <Link href={buyHref} className="rounded-md bg-[#896ec9] py-[18px] px-4 text-white text-center text-xl font-black no-underline">
                  BUY
                </Link>
                <a href="#sell" className="rounded-md bg-[#3b8a82] py-[18px] px-4 text-white text-center text-xl font-black no-underline">
                  SELL
                </a>
              </div>
            </section>

            <section className="border border-white/8 rounded-[24px] bg-[#15171a] p-5">
              <h2 className="m-0 text-[22px] font-black">Highest active bids</h2>
              <div className="grid gap-3 mt-4">
                {activeBids.map((bid) => (
                  <article key={bid.id} className="border border-white/8 rounded-2xl bg-[#101113] p-4">
                    <p className="m-0 text-[17px] leading-[1.35] font-black">
                      {Number(bid.quoteAmount).toFixed(2)} {market.quoteCurrency.displayName}s
                    </p>
                    <p className="mt-1 m-0 text-white/55 text-sm">
                      for {Number(bid.baseAmount).toFixed(2)} {market.baseCurrency.displayName}s
                    </p>
                    <p className="mt-2 mb-3 mx-0 text-white/40 text-[13px]">Rate {Number(bid.rate).toFixed(3)}</p>
                    <AcceptBidButton bidId={bid.id} variant="dark" />
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

export function MarketMobileScreen({
  market,
  activeBids
}: {
  market: Market;
  activeBids: BidPoint[];
}) {
  const [selectedTab, setSelectedTab] = useState("Overview");
  const [selectedPeriod, setSelectedPeriod] = useState("1Y");
  const highestBid = activeBids[0];
  const headlinePrice = highestBid ? Number(highestBid.quoteAmount).toFixed(2) : "0.00";
  const periodMetrics = useMemo(() => getPeriodMetrics(market.bids), [market.bids]);
  const visiblePoints = useMemo(() => getPointsForPeriod(market.bids, selectedPeriod), [market.bids, selectedPeriod]);
  const headlineMove = useMemo(() => getHeadlineMove(market.bids), [market.bids]);
  const pairName = `${market.baseCurrency.displayName} / ${market.quoteCurrency.displayName}`;
  const buyHref = `/markets/${market.slug}/buy`;

  return (
    <>
      <div className="market-desktop-view">
        <MarketDesktopScreen market={market} activeBids={activeBids} />
      </div>
      <div className="market-mobile-view">
    <main className="min-h-screen bg-[#101113] text-white">
      <section
        className="mx-auto min-h-screen max-w-[1120px] bg-[#111315] pb-8 md:pb-12"
      >
        <div
          className="flex items-center justify-between px-5 py-8 sm:px-8"
        >
          <Link
            href="/markets"
            className="rounded-full p-2 text-white/70 hover:bg-white/10"
            title="Back"

          >
            <ArrowLeft size={34} strokeWidth={1.7} />
          </Link>
          <div className="flex items-center gap-5 text-white/70">
            <Search size={32} strokeWidth={1.7} />
            <Link href="/notifications" title="Notifications" className="inline-flex text-white/70 no-underline hover:text-white">
              <BellPlus size={32} strokeWidth={1.7} />
            </Link>
            <Heart className="fill-[#b99cff] text-[#b99cff]" size={34} strokeWidth={1.7} />
          </div>
        </div>

        <div className="px-5 sm:px-8">
          <MarketPairSelector
            baseCurrencyCode={market.baseCurrency.code}
            quoteCurrencyCode={market.quoteCurrency.code}
            variant="mobile"
          />
        </div>

        <div className="px-5 pt-12 sm:px-8 md:pt-12">
          <div className="flex items-center justify-between gap-5">
            <div className="flex min-w-0 items-center gap-5">
              <div
                className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-white text-2xl font-black text-[#8d6fd0] shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
              >
                {compactCode(market.baseCurrency.code)}
              </div>
              <div className="min-w-0">
                <h1
                  className="max-w-[560px] text-[clamp(2.1rem,7vw,4.2rem)] font-extrabold leading-[1.05] tracking-normal"
                >
                  {pairName}
                </h1>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-lg border border-white/12 px-3 py-1 text-lg text-white/42">
                    NYUAD
                  </span>
                  <span className="rounded-lg border border-white/12 px-3 py-1 text-lg text-white/42">
                    Campus FX
                  </span>
                </div>
              </div>
            </div>
            <div
              className="hidden rounded-full border border-white/12 bg-[#141518] p-1 md:flex"
            >
              <span className="rounded-full bg-[#261f3b] px-7 py-2 text-xl font-bold text-[#c3a6ff]">
                BID
              </span>
              <span className="px-7 py-2 text-xl font-medium text-white/38">
                ASK
              </span>
            </div>
          </div>

          <div className="mt-12 flex items-end justify-between gap-4">
            <div>
              <p className={`m-0 text-[clamp(4rem,12vw,7.5rem)] leading-none font-black tracking-normal ${headlineMove.positive ? "text-[#52b57f]" : "text-[#ef626d]"}`}>
                {headlinePrice}
              </p>
              <p className={`mt-5 m-0 text-[clamp(1.5rem,4vw,2.4rem)] font-semibold ${headlineMove.positive ? "text-[#52b57f]" : "text-[#ef626d]"}`}>
                {headlineMove.amount} ({headlineMove.percent}) <span className="ml-5 font-medium text-white/40">1D</span>
              </p>
            </div>
            <Link
              href={`/markets/${market.slug}`}
              className="mb-3 hidden items-center gap-3 rounded-full bg-[#211a33] px-8 py-5 text-2xl font-bold text-[#c3a6ff] md:inline-flex no-underline"

            >
              <Link2 size={28} />
              Market Chain
            </Link>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto border-b border-white/10 px-5 sm:px-8">
          <div className="flex min-w-max gap-14">
            {tabs.map((tab) => (
              <button key={tab} className={`relative pb-7 text-[clamp(1.4rem,4vw,2.4rem)] font-semibold cursor-pointer border-0 bg-transparent ${selectedTab === tab ? "text-[#c3a6ff]" : "text-white/60"}`} onClick={() => setSelectedTab(tab)}>
                {tab}
                {selectedTab === tab ? <span className="absolute inset-x-0 bottom-0 h-1.5 bg-[#c3a6ff]" /> : null}
              </button>
            ))}
          </div>
        </div>

        <TrendChart points={visiblePoints} />

        <div className="grid grid-cols-6 gap-3 px-5 sm:px-8">
          {periodMetrics.map((period) => (
            <button
              key={period.label}

              onClick={() => setSelectedPeriod(period.label)}
              className={`appearance-none border-0 rounded-2xl py-4 px-2 text-center cursor-pointer ${selectedPeriod === period.label ? "bg-white/10" : "bg-transparent"}`}
              title={`${period.label} performance`}
            >
              <span className="block text-[clamp(1.1rem,3vw,2rem)] font-semibold text-white/70">
                {period.label}
              </span>
              <span className="mt-2 block text-[clamp(1rem,3vw,1.8rem)] font-bold text-[#ef626d]">
                {period.value}
              </span>
            </button>
          ))}
        </div>

        <section className="mt-10 px-5 pb-32 sm:px-8 md:pb-0">
          <div className="rounded-[28px] border border-white/8 bg-[#17191c] p-5">
            <div className="mx-auto mb-5 h-3 w-24 rounded-full bg-white/15" />
            <div className="mb-5 hidden grid-cols-[1fr_1fr_86px] gap-3 md:grid">
              <Link href={buyHref} className="rounded-lg bg-[#896ec9] px-6 py-5 text-center text-2xl font-black text-white">
                BUY
              </Link>
              <a href="#sell" className="rounded-lg bg-[#3b8a82] px-6 py-5 text-center text-2xl font-black text-white">
                SELL
              </a>
              <button className="grid place-items-center rounded-lg border-2 border-white/16 text-white/75" title="Open bid tray">
                <ChevronUp size={38} />
              </button>
            </div>
            <div className="grid gap-3">
              <div>
                <h2 className="mb-4 text-2xl font-bold">Highest active bids</h2>
                <div className="space-y-3">
                  {activeBids.map((bid) => (
                    <article key={bid.id} className="rounded-2xl border border-white/8 bg-[#101113] p-4">
                      <p className="text-lg font-bold">
                        {Number(bid.quoteAmount).toFixed(2)} {market.quoteCurrency.displayName}s for{" "}
                        {Number(bid.baseAmount).toFixed(2)} {market.baseCurrency.displayName}s
                      </p>
                      <p className="mt-1 text-sm text-white/45">Rate {Number(bid.rate).toFixed(3)}</p>
                      <div className="mt-3">
                        <AcceptBidButton bidId={bid.id} variant="dark" />
                      </div>
                    </article>
                  ))}
                  {!activeBids.length ? <p className="text-sm text-white/50">No active bids yet.</p> : null}
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[1120px] rounded-t-[28px] border border-white/8 bg-[#1b1d20] px-5 py-6 shadow-[0_-18px_48px_rgba(0,0,0,0.35)] sm:px-8 md:hidden">
        <div className="mx-auto mb-5 h-3 w-24 rounded-full bg-white/15" />
        <div className="grid grid-cols-[1fr_1fr_86px] gap-3 mb-5 hidden md:grid">
          <Link href={buyHref} className="rounded-lg bg-[#896ec9] px-6 py-6 text-center text-2xl font-black text-white">
            BUY
          </Link>
          <a href="#sell" className="rounded-lg bg-[#3b8a82] px-6 py-6 text-center text-2xl font-black text-white">
            SELL
          </a>
          <button className="grid place-items-center rounded-lg border-2 border-white/16 text-white/75" title="Open bid tray">
            <ChevronUp size={42} />
          </button>
        </div>
      </div>
    </main>
      </div>
    </>
  );
}

export function MarketPickerScreen({ markets }: { markets: Market[] }) {
  const market = markets[0];
  const activeBids = market.bids
    .filter((bid) => bid.status === "ACTIVE")
    .slice()
    .sort((left, right) => Number(right.rate) - Number(left.rate));

  return <MarketMobileScreen market={market} activeBids={activeBids} />;
}
