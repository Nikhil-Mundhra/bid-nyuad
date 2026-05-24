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
      className={
        dark
          ? "rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 text-zinc-900 dark:text-zinc-50"
          : "rounded-lg border border-ink/10 bg-white p-4 shadow-soft"
      }
    >
      <h2 className={dark ? "m-0 text-lg font-semibold tracking-normal" : "text-lg font-semibold tracking-normal"}>
        Place a buy bid
      </h2>
      <p className={dark ? "mt-2 text-sm text-zinc-900 dark:text-zinc-50/50" : "mt-2 text-sm text-ink/60"}>
        Your NetID session will be used automatically.
      </p>
      <div className={dark ? "mt-4 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3" : "mt-4 grid gap-3 sm:grid-cols-2"}>
        <label className="text-sm">
          <span className={dark ? "mb-1 block text-sm font-medium text-zinc-900 dark:text-zinc-50/60" : "font-medium text-ink/75"}>
            {baseLabel} amount
          </span>
          <input
            className={
              dark
                ? "focus-ring mt-1 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white/5 px-3 py-2 text-zinc-900 dark:text-zinc-50"
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
          <span className={dark ? "mb-1 block text-sm font-medium text-zinc-900 dark:text-zinc-50/60" : "font-medium text-ink/75"}>
            {quoteLabel} offered
          </span>
          <input
            className={
              dark
                ? "focus-ring mt-1 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white/5 px-3 py-2 text-zinc-900 dark:text-zinc-50"
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
        className={dark ? "mt-4 inline-flex cursor-pointer items-center gap-2 rounded-md border-0 bg-violet-600 dark:bg-violet-600 px-4 py-2 text-sm font-bold text-white hover:bg-violet-500 dark:bg-violet-500" : "mt-4 inline-flex items-center gap-2 rounded-md bg-violet-600 dark:bg-violet-600 px-4 py-2 text-sm font-bold text-zinc-900 dark:text-zinc-50 hover:bg-violet-500 dark:bg-violet-500"}
      >
        <Send size={16} />
        Place bid
      </button>
      {message ? <p className={dark ? "mt-3 text-sm text-zinc-900 dark:text-zinc-50/60" : "mt-3 text-sm text-ink/70"}>{message}</p> : null}
    </form>
  );
}
