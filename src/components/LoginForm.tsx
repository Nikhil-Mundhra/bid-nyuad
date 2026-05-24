"use client";

import { Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";

export function LoginForm() {
  const [netId, setNetId] = useState("");
  const [attemptId, setAttemptId] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

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

  async function verify() {
    setMessage("Verifying...");
    const response = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ attemptId, netId, otp })
    });
    const result = await response.json();
    setMessage(response.ok ? `Logged in as ${result.user.email}.` : result.error);
  }

  return (
    <section className="mx-auto max-w-xl rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
      <h1 className="text-2xl font-semibold tracking-normal">Login</h1>
      <div className="mt-4 grid gap-3">
        <label className="text-sm">
          <span className="font-medium text-ink/75">NYU NetID</span>
          <input
            className="focus-ring mt-1 w-full rounded-md border border-ink/15 px-3 py-2"
            value={netId}
            onChange={(event) => setNetId(event.target.value)}
            placeholder="abc123"
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
          onClick={verify}
          disabled={!attemptId || otp.length !== 6}
        >
          <ShieldCheck size={16} />
          Verify
        </button>
        {message ? <p className="rounded-md bg-paper px-3 py-2 text-sm text-ink/75">{message}</p> : null}
      </div>
    </section>
  );
}
