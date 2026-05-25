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
      className="rounded-[20px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5"
    >
      <h2 className="m-0 flex items-center gap-2.5 text-[22px] font-black">
        <Phone size={22} />
        Trading contact
      </h2>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Buyers can reveal this only after an accepted trade.
      </p>
      <label className="mt-[18px] block text-sm font-bold text-zinc-900 dark:text-zinc-50/65">
        WhatsApp number
        <input
          value={whatsappNumber}
          onChange={(event) => setWhatsappNumber(event.target.value)}
          placeholder="+971..."
          className="mt-1.5 block w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/5 p-3 text-zinc-900 dark:text-zinc-50"
        />
      </label>
      <button
        className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-violet-600 dark:bg-violet-600 px-4 py-3 font-black text-white"
      >
        <Save size={18} />
        Save settings
      </button>
      {message ? <p className="mt-3 text-sm text-zinc-900 dark:text-zinc-50/65">{message}</p> : null}
    </form>
  );
}
