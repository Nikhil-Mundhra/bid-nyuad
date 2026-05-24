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
      className="border border-white/10 rounded-[20px] bg-[#15171a] p-5"
    >
      <h2 className="flex items-center gap-2.5 m-0 text-[22px] font-black">
        <Phone size={22} />
        Trading contact
      </h2>
      <p className="mt-2 m-0 text-white/55 text-sm">
        Buyers can reveal this only after an accepted trade.
      </p>
      <label className="block mt-4 text-white/65 text-sm font-bold">
        WhatsApp number
        <input
          value={whatsappNumber}
          onChange={(event) => setWhatsappNumber(event.target.value)}
          placeholder="+971..."
          className="block w-full mt-1.5 border border-white/10 rounded-lg bg-white/5 py-3 px-3.5 text-white focus-ring"
        />
      </label>
      <button
        className="inline-flex items-center gap-2 mt-4 border-0 rounded-lg bg-[#896ec9] py-3 px-4 text-white font-black cursor-pointer"
      >
        <Save size={18} />
        Save settings
      </button>
      {message ? <p className="mt-3 m-0 text-white/65 text-sm">{message}</p> : null}
    </form>
  );
}
