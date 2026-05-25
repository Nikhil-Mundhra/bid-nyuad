"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserRound } from "lucide-react";
import { FormEvent, useState } from "react";
import { currencies, marketSlug, validateMarketPair } from "@/lib/domain/currencies";

type MarketPairSelectorProps = {
  baseCurrencyCode: string;
  quoteCurrencyCode: string;
  variant?: "desktop" | "mobile";
};

export function MarketPairSelector({
  baseCurrencyCode,
  quoteCurrencyCode,
  variant = "desktop"
}: MarketPairSelectorProps) {
  const router = useRouter();
  const [baseCode, setBaseCode] = useState(baseCurrencyCode);
  const [quoteCode, setQuoteCode] = useState(quoteCurrencyCode);
  const [message, setMessage] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const isMobile = variant === "mobile";

  async function onApply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const submittedBaseCode = String(formData.get("baseCurrencyCode") ?? baseCode);
    const submittedQuoteCode = String(formData.get("quoteCurrencyCode") ?? quoteCode);
    setBaseCode(submittedBaseCode);
    setQuoteCode(submittedQuoteCode);

    const validation = validateMarketPair(submittedBaseCode, submittedQuoteCode);
    if (!validation.valid) {
      setMessage(validation.error);
      return;
    }

    setIsApplying(true);
    try {
      const response = await fetch("/api/markets/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseCurrencyCode: submittedBaseCode, quoteCurrencyCode: submittedQuoteCode })
      });

      if (response.ok) {
        const payload = (await response.json()) as { market?: { slug?: string } };
        router.push(`/markets/${payload.market?.slug ?? marketSlug(submittedBaseCode, submittedQuoteCode)}`);
      } else {
        router.push(`/markets/${marketSlug(submittedBaseCode, submittedQuoteCode)}`);
      }
    } catch {
      router.push(`/markets/${marketSlug(submittedBaseCode, submittedQuoteCode)}`);
    } finally {
      setIsApplying(false);
    }
  }

  const selectClassName = `border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 font-extrabold outline-none ${
    isMobile ? "min-w-[88px] max-w-[96px] py-2 pl-2 pr-[22px] text-xs" : "min-w-[170px] max-w-[220px] py-2.5 pl-3 pr-[34px] text-sm"
  }`;

  return (
    <form
      onSubmit={onApply}
      className={`flex max-w-full flex-wrap items-center ${isMobile ? "gap-1.5 justify-end" : "gap-2.5 justify-start"}`}
    >
      <div
        className={`flex max-w-full items-center rounded-xl border border-zinc-200 dark:border-zinc-800 backdrop-blur-md ${
          isMobile ? "gap-1.5 bg-zinc-200 dark:bg-zinc-800 p-1.5" : "gap-2 bg-white dark:bg-zinc-950 p-2"
        }`}
      >
        <select
          aria-label="Base currency"
          name="baseCurrencyCode"
          value={baseCode}
          onChange={(event) => setBaseCode(event.target.value)}
          className={selectClassName}
        >
          {currencies.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.displayName}
            </option>
          ))}
        </select>
        <span className={`font-black text-zinc-900 dark:text-zinc-50/50 ${isMobile ? "text-base" : "text-lg"}`}>/</span>
        <select
          aria-label="Quote currency"
          name="quoteCurrencyCode"
          value={quoteCode}
          onChange={(event) => setQuoteCode(event.target.value)}
          className={selectClassName}
        >
          {currencies.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.displayName}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={isApplying}
          className={`rounded-lg font-black text-zinc-900 dark:text-zinc-50 ${
            isApplying ? "cursor-wait bg-violet-300 dark:bg-violet-700/50" : "cursor-pointer bg-violet-600 dark:bg-violet-600"
          } ${isMobile ? "px-3 py-2.5 text-xs" : "px-[18px] py-[11px] text-sm"}`}
        >
          {isApplying ? "Applying" : "Apply"}
        </button>
        <Link
          href="/account"
          title="Account"
          className={`inline-flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-violet-200 dark:bg-violet-900/50 font-black text-violet-600 dark:text-violet-400 no-underline ${
            isMobile ? "min-w-[40px] px-[11px] py-2.5 text-sm gap-0" : "min-w-[100px] gap-2 px-[14px] py-2.5 text-sm"
          }`}
        >
          <UserRound size={isMobile ? 17 : 18} />
          {isMobile ? null : "Account"}
        </Link>
      </div>
      {message ? (
        <p className={`basis-full m-0 font-extrabold text-rose-600 dark:text-rose-400 text-xs ${isMobile ? "text-right" : "text-left"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
