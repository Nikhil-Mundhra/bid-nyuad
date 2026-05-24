"use client";

import { BadgeCheck, Mail, Phone, ScanText } from "lucide-react";
import { useState } from "react";

export function RegisterForm() {
  const [rawText, setRawText] = useState("NYUAD ID sample: netID abc123");
  const [netId, setNetId] = useState("");
  const [attemptId, setAttemptId] = useState("");
  const [otp, setOtp] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [message, setMessage] = useState("");

  async function extract() {
    setMessage("Reading ID...");
    const response = await fetch("/api/auth/id-upload", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ rawText })
    });
    const result = await response.json();

    if (response.ok) {
      setNetId(result.netId);
      setMessage(`Extracted NetID ${result.netId}.`);
    } else {
      setMessage(result.error);
    }
  }

  async function sendOtp() {
    setMessage("Sending OTP...");
    const response = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ netId })
    });
    const result = await response.json();

    if (response.ok) {
      setAttemptId(result.attemptId);
      setMessage(`OTP sent to ${result.to}${result.delivered ? "." : " in console dev mode."}`);
    } else {
      setMessage(result.error);
    }
  }

  async function verifyOtp() {
    setMessage("Verifying OTP...");
    const response = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ attemptId, netId, otp })
    });
    const result = await response.json();
    setMessage(response.ok ? `Verified ${result.user.email}. Add WhatsApp next.` : result.error);
  }

  async function saveWhatsapp() {
    setMessage("Saving WhatsApp...");
    const response = await fetch("/api/auth/whatsapp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ whatsappNumber })
    });
    const result = await response.json();
    setMessage(response.ok ? `WhatsApp saved for ${result.user.netId}.` : result.error);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
        <h1 className="text-2xl font-semibold tracking-normal">Register</h1>
        <p className="mt-2 text-sm text-ink/70">
          Upload/OCR, NetID email verification, then WhatsApp collection.
        </p>
        <label className="mt-4 block text-sm">
          <span className="font-medium text-ink/75">OCR source text for local scaffold</span>
          <textarea
            className="focus-ring mt-1 min-h-28 w-full rounded-md border border-ink/15 px-3 py-2"
            value={rawText}
            onChange={(event) => setRawText(event.target.value)}
          />
        </label>
        <button
          className="mt-3 inline-flex items-center gap-2 rounded-md bg-gulf px-4 py-2 text-sm font-medium text-white hover:bg-gulf/90"
          onClick={extract}
        >
          <ScanText size={16} />
          Extract NetID
        </button>
      </section>

      <section className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
        <div className="grid gap-3">
          <label className="text-sm">
            <span className="font-medium text-ink/75">NetID</span>
            <input
              className="focus-ring mt-1 w-full rounded-md border border-ink/15 px-3 py-2"
              value={netId}
              onChange={(event) => setNetId(event.target.value)}
            />
          </label>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink/90"
            onClick={sendOtp}
            disabled={!netId}
          >
            <Mail size={16} />
            Send OTP
          </button>
          <label className="text-sm">
            <span className="font-medium text-ink/75">OTP</span>
            <input
              className="focus-ring mt-1 w-full rounded-md border border-ink/15 px-3 py-2"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              maxLength={6}
            />
          </label>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md bg-falcon px-4 py-2 text-sm font-medium text-white hover:bg-falcon/90"
            onClick={verifyOtp}
            disabled={!attemptId || otp.length !== 6}
          >
            <BadgeCheck size={16} />
            Verify
          </button>
          <label className="text-sm">
            <span className="font-medium text-ink/75">WhatsApp number</span>
            <input
              className="focus-ring mt-1 w-full rounded-md border border-ink/15 px-3 py-2"
              value={whatsappNumber}
              onChange={(event) => setWhatsappNumber(event.target.value)}
              placeholder="+971..."
            />
          </label>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md bg-palm px-4 py-2 text-sm font-medium text-white hover:bg-palm/90"
            onClick={saveWhatsapp}
            disabled={!whatsappNumber}
          >
            <Phone size={16} />
            Save WhatsApp
          </button>
          {message ? <p className="rounded-md bg-paper px-3 py-2 text-sm text-ink/75">{message}</p> : null}
        </div>
      </section>
    </div>
  );
}
