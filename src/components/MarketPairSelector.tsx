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

  const selectStyle = {
    minWidth: isMobile ? 88 : 170,
    maxWidth: isMobile ? 96 : 220,
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10,
    background: "#15171a",
    color: "#fff",
    padding: isMobile ? "9px 22px 9px 8px" : "10px 34px 10px 12px",
    fontSize: isMobile ? 12 : 14,
    fontWeight: 800,
    outline: "none"
  };

  return (
    <form
      onSubmit={onApply}
      className={`flex flex-wrap items-center max-w-full ${isMobile ? "justify-end gap-1.5" : "justify-start gap-2.5"}`}
    >
      <div
        className={`flex items-center max-w-full border border-white/8 rounded-xl ${isMobile ? "gap-1.5 bg-black/55 p-1.5 backdrop-blur-md" : "gap-2 bg-[#101113] p-2 backdrop-blur-md"}`}
      >
        <select
          aria-label="Base currency"
          name="baseCurrencyCode"
          value={baseCode}
          onChange={(event) => setBaseCode(event.target.value)}
          style={selectStyle}
        >
          {currencies.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.displayName}
            </option>
          ))}
        </select>
        <span className={`text-white/50 font-black ${isMobile ? "text-base" : "text-lg"}`}>/</span>
        <select
          aria-label="Quote currency"
          name="quoteCurrencyCode"
          value={quoteCode}
          onChange={(event) => setQuoteCode(event.target.value)}
          style={selectStyle}
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
          className={`border-0 rounded-lg text-white font-black ${isApplying ? "bg-[#c3a6ff]/35 cursor-wait" : "bg-[#896ec9] cursor-pointer"} ${isMobile ? "text-xs py-2.5 px-3" : "text-sm py-[11px] px-[18px]"}`}
        >
          {isApplying ? "Applying" : "Apply"}
        </button>
        <Link
          href="/account"
          title="Account"
          className={`inline-flex items-center justify-center border border-white/10 rounded-lg bg-[#281f3d] text-[#c3a6ff] font-black no-underline ${isMobile ? "gap-0 min-w-[40px] py-2.5 px-[11px]" : "gap-2 min-w-[100px] py-2.5 px-[14px] text-sm"}`}
        >
          <UserRound size={isMobile ? 17 : 18} />
          {isMobile ? null : "Account"}
        </Link>
      </div>
      {message ? (
        <p className={`basis-full m-0 text-[#ef626d] text-xs font-extrabold ${isMobile ? "text-right" : "text-left"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
