"use client";

import { Check } from "lucide-react";
import { useState } from "react";

export function AcceptBidButton({ bidId, variant = "light" }: { bidId: string; variant?: "light" | "dark" }) {
  const [message, setMessage] = useState("");
  const dark = variant === "dark";

  async function acceptBid() {
    setMessage("Accepting bid...");

    const response = await fetch(`/api/bids/${bidId}/accept`, {
      method: "POST",
      credentials: "same-origin"
    });

    const result = await response.json();
    setMessage(response.ok ? `Trade created: ${result.trade.id}` : result.error ?? "Login or register before accepting.");
  }

  return (
    <div className={dark ? "flex flex-wrap items-center gap-2" : "flex flex-col gap-2 sm:flex-row sm:items-center"}>
      <button
        type="button"
        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border-0 bg-emerald-600 dark:bg-emerald-600 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-500 dark:bg-emerald-500"
        onClick={acceptBid}
      >
        <Check size={16} />
        Accept
      </button>
      {message ? <span className={dark ? "text-sm text-zinc-500 dark:text-zinc-400" : "text-sm text-ink/65"}>{message}</span> : null}
    </div>
  );
}
