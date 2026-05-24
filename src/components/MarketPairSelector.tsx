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
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: isMobile ? "flex-end" : "flex-start",
        gap: isMobile ? 6 : 10,
        maxWidth: "100%"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? 5 : 8,
          maxWidth: "100%",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14,
          background: isMobile ? "rgba(0,0,0,0.55)" : "#101113",
          padding: isMobile ? 6 : 8,
          backdropFilter: "blur(10px)"
        }}
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
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: isMobile ? 16 : 18, fontWeight: 900 }}>/</span>
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
          style={{
            border: 0,
            borderRadius: 10,
            background: isApplying ? "rgba(195,166,255,0.35)" : "#896ec9",
            color: "#fff",
            cursor: isApplying ? "wait" : "pointer",
            fontSize: isMobile ? 12 : 14,
            fontWeight: 900,
            padding: isMobile ? "10px 12px" : "11px 18px"
          }}
        >
          {isApplying ? "Applying" : "Apply"}
        </button>
        <Link
          href="/account"
          title="Account"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: isMobile ? 0 : 8,
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10,
            background: "#281f3d",
            color: "#c3a6ff",
            minWidth: isMobile ? 40 : 100,
            padding: isMobile ? "10px 11px" : "10px 14px",
            fontSize: 14,
            fontWeight: 900,
            textDecoration: "none"
          }}
        >
          <UserRound size={isMobile ? 17 : 18} />
          {isMobile ? null : "Account"}
        </Link>
      </div>
      {message ? (
        <p style={{ flexBasis: "100%", margin: 0, color: "#ef626d", fontSize: 12, fontWeight: 800, textAlign: isMobile ? "right" : "left" }}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
