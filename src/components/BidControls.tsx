"use client";

import { Send } from "lucide-react";
import { useState } from "react";

export function BidControls({
  marketId,
  baseLabel,
  quoteLabel,
  variant = "light"
}: {
  marketId: string;
  baseLabel: string;
  quoteLabel: string;
  variant?: "light" | "dark";
}) {
  const [baseAmount, setBaseAmount] = useState("100");
  const [quoteAmount, setQuoteAmount] = useState("80");
  const [message, setMessage] = useState("");

  async function submitBid(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Placing bid...");

    const response = await fetch("/api/bids", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      credentials: "same-origin",
      body: JSON.stringify({
        marketId,
        baseAmount: Number(baseAmount),
        quoteAmount: Number(quoteAmount)
      })
    });

    const result = await response.json();
    setMessage(
      response.ok
        ? `Bid placed${result.isHighest ? " and market notified." : "."}`
        : result.error ?? "Login or register before placing a live bid."
    );
  }

  const dark = variant === "dark";

  return (
    <form
      id="buy"
      onSubmit={submitBid}
      style={
        dark
          ? {
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              background: "#101113",
              padding: 16,
              color: "#fff"
            }
          : undefined
      }
      className={
        dark
          ? "rounded-2xl border border-white/8 bg-[#101113] p-4"
          : "rounded-lg border border-ink/10 bg-white p-4 shadow-soft"
      }
    >
      <h2 className="text-lg font-semibold tracking-normal" style={dark ? { margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: 0 } : undefined}>
        Place a buy bid
      </h2>
      <p className={dark ? "mt-2 text-sm text-white/50" : "mt-2 text-sm text-ink/60"}>
        Your NetID session will be used automatically.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2" style={dark ? { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginTop: 16 } : undefined}>
        <label className="text-sm">
          <span className={dark ? "font-medium text-white/60" : "font-medium text-ink/75"} style={dark ? { display: "block", marginBottom: 4, color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: 500 } : undefined}>
            {baseLabel} amount
          </span>
          <input
            style={dark ? { width: "100%", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, background: "rgba(255,255,255,0.05)", padding: "8px 12px", color: "#fff" } : undefined}
            className={
              dark
                ? "focus-ring mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white"
                : "focus-ring mt-1 w-full rounded-md border border-ink/15 px-3 py-2"
            }
            type="number"
            min="1"
            step="0.01"
            value={baseAmount}
            onChange={(event) => setBaseAmount(event.target.value)}
          />
        </label>
        <label className="text-sm">
          <span className={dark ? "font-medium text-white/60" : "font-medium text-ink/75"} style={dark ? { display: "block", marginBottom: 4, color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: 500 } : undefined}>
            {quoteLabel} offered
          </span>
          <input
            style={dark ? { width: "100%", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, background: "rgba(255,255,255,0.05)", padding: "8px 12px", color: "#fff" } : undefined}
            className={
              dark
                ? "focus-ring mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white"
                : "focus-ring mt-1 w-full rounded-md border border-ink/15 px-3 py-2"
            }
            type="number"
            min="1"
            step="0.01"
            value={quoteAmount}
            onChange={(event) => setQuoteAmount(event.target.value)}
          />
        </label>
      </div>
      <button
        className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#896ec9] px-4 py-2 text-sm font-bold text-white hover:bg-[#9678dc]"
        style={dark ? { display: "inline-flex", alignItems: "center", gap: 8, marginTop: 16, border: 0, borderRadius: 6, background: "#896ec9", padding: "8px 16px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" } : undefined}
      >
        <Send size={16} />
        Place bid
      </button>
      {message ? <p className={dark ? "mt-3 text-sm text-white/60" : "mt-3 text-sm text-ink/70"}>{message}</p> : null}
    </form>
  );
}
