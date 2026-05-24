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
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center" style={dark ? { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 } : undefined}>
      <button
        type="button"
        className="inline-flex items-center justify-center gap-2 rounded-md bg-[#3b8a82] px-3 py-2 text-sm font-bold text-white hover:bg-[#449d94]"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          border: 0,
          borderRadius: 6,
          background: "#3b8a82",
          padding: "8px 12px",
          color: "#fff",
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer"
        }}
        onClick={acceptBid}
      >
        <Check size={16} />
        Accept
      </button>
      {message ? <span className={dark ? "text-sm text-white/55" : "text-sm text-ink/65"}>{message}</span> : null}
    </div>
  );
}
