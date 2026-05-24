"use client";

import { Phone, Save } from "lucide-react";
import { useState } from "react";

export function AccountSettingsForm({ initialWhatsapp }: { initialWhatsapp?: string | null }) {
  const [whatsappNumber, setWhatsappNumber] = useState(initialWhatsapp ?? "");
  const [message, setMessage] = useState("");

  async function saveWhatsapp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Saving...");

    const response = await fetch("/api/auth/whatsapp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ whatsappNumber })
    });
    const result = await response.json();

    setMessage(response.ok ? "WhatsApp number saved." : result.error ?? "Login before updating account settings.");
  }

  return (
    <form
      onSubmit={saveWhatsapp}
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        background: "#15171a",
        padding: 20
      }}
    >
      <h2 style={{ display: "flex", alignItems: "center", gap: 10, margin: 0, fontSize: 22, fontWeight: 900 }}>
        <Phone size={22} />
        Trading contact
      </h2>
      <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.55)", fontSize: 14 }}>
        Buyers can reveal this only after an accepted trade.
      </p>
      <label style={{ display: "block", marginTop: 18, color: "rgba(255,255,255,0.65)", fontSize: 14, fontWeight: 700 }}>
        WhatsApp number
        <input
          value={whatsappNumber}
          onChange={(event) => setWhatsappNumber(event.target.value)}
          placeholder="+971..."
          style={{
            display: "block",
            width: "100%",
            marginTop: 6,
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 10,
            background: "rgba(255,255,255,0.05)",
            padding: "12px 14px",
            color: "#fff"
          }}
        />
      </label>
      <button
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          marginTop: 16,
          border: 0,
          borderRadius: 10,
          background: "#896ec9",
          padding: "12px 16px",
          color: "#fff",
          fontWeight: 900,
          cursor: "pointer"
        }}
      >
        <Save size={18} />
        Save settings
      </button>
      {message ? <p style={{ margin: "12px 0 0", color: "rgba(255,255,255,0.65)", fontSize: 14 }}>{message}</p> : null}
    </form>
  );
}
