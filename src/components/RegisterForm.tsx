"use client";

import { BadgeCheck, Loader2, Mail, Phone, ScanText } from "lucide-react";
import { useState } from "react";

export function RegisterForm() {
  const [rawText, setRawText] = useState("NYUAD ID sample: netID abc123");
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [netId, setNetId] = useState("");
  const [attemptId, setAttemptId] = useState("");
  const [uploadedIdRef, setUploadedIdRef] = useState("");
  const [otp, setOtp] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [privateEmail, setPrivateEmail] = useState("");
  const [message, setMessage] = useState("");

  const [isExtracting, setIsExtracting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  async function extract() {
    setIsExtracting(true);
    setMessage("Reading ID...");
    try {
      const request =
        idCardFile
          ? (() => {
              const formData = new FormData();
              formData.append("idCard", idCardFile);
              return { method: "POST", body: formData };
            })()
          : {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ rawText })
            };
      const response = await fetch("/api/auth/id-upload", request);
      const result = await response.json();

      if (response.ok) {
        setNetId(result.netId);
        setUploadedIdRef(result.uploadedIdRef ?? "");
        setMessage(
          `Extracted NetID ${result.netId}${result.uploadedIdRef ? " and stored the ID upload in Supabase." : "."}`
        );
      } else {
        setMessage(result.error);
      }
    } catch (err) {
      setMessage("Failed to extract ID.");
    } finally {
      setIsExtracting(false);
    }
  }

  async function sendOtp() {
    setIsSendingOtp(true);
    setMessage("Sending OTP...");
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ netId, uploadedIdRef: uploadedIdRef || undefined })
      });
      const result = await response.json();

      if (response.ok) {
        setAttemptId(result.attemptId);
        setMessage("OTP has been sent successfully to your email.");
      } else {
        setMessage(result.error);
      }
    } catch (err) {
      setMessage("Failed to send OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  }

  async function verifyOtp() {
    setIsVerifying(true);
    setMessage("Verifying OTP...");
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ attemptId, netId, otp })
      });
      const result = await response.json();
      if (response.ok) {
        setMessage(`Verified ${result.user.email}. Add WhatsApp next.`);
      } else {
        setMessage(result.error);
        setOtp("");
      }
    } catch (err) {
      setMessage("Failed to verify OTP.");
      setOtp("");
    } finally {
      setIsVerifying(false);
    }
  }

  async function saveProfile() {
    setIsSavingProfile(true);
    setMessage("Saving profile...");
    try {
      const response = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ whatsappNumber, privateEmail })
      });
      const result = await response.json();
      setMessage(response.ok ? `Profile saved for ${result.user.netId}.` : result.error);
    } finally {
      setIsSavingProfile(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
        <h1 className="text-2xl font-semibold tracking-normal">Register</h1>
        <p className="mt-2 text-sm text-ink/70">
          Upload/OCR, NetID email verification, then WhatsApp collection.
        </p>
        <label className="mt-4 block text-sm">
          <span className="font-medium text-ink/75">NYUAD ID image</span>
          <input
            className="focus-ring mt-1 w-full rounded-md border border-ink/15 px-3 py-2"
            type="file"
            accept="image/*"
            onChange={(event) => setIdCardFile(event.target.files?.[0] ?? null)}
          />
          <span className="mt-1 block text-xs text-ink/50">
            Stored in Supabase Storage when server credentials are configured.
          </span>
        </label>
        <label className="mt-4 block text-sm">
          <span className="font-medium text-ink/75">OCR source text for local scaffold</span>
          <textarea
            className="focus-ring mt-1 min-h-28 w-full rounded-md border border-ink/15 px-3 py-2"
            value={rawText}
            onChange={(event) => setRawText(event.target.value)}
          />
        </label>
        <button
          className="mt-3 inline-flex items-center gap-2 rounded-md bg-gulf px-4 py-2 text-sm font-medium text-white hover:bg-gulf/90 disabled:opacity-50"
          onClick={extract}
          disabled={isExtracting}
        >
          {isExtracting ? <Loader2 className="animate-spin" size={16} /> : <ScanText size={16} />}
          {isExtracting ? "Extracting..." : "Extract NetID"}
        </button>
      </section>

      <section className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
        <div className="grid gap-3">
          <label className="text-sm">
            <span className="font-medium text-ink/75">NetID</span>
            <p className="focus-ring mt-1 w-full rounded-md border border-ink/15 px-3 py-2 bg-zinc-50 dark:bg-zinc-900 text-ink/75 h-10 flex items-center">
              {netId || "No NetID extracted"}
            </p>
          </label>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink/90 disabled:opacity-50"
            onClick={sendOtp}
            disabled={!netId || isSendingOtp}
          >
            {isSendingOtp ? <Loader2 className="animate-spin" size={16} /> : <Mail size={16} />}
            {isSendingOtp ? "Sending..." : "Send OTP"}
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
            className="inline-flex items-center justify-center gap-2 rounded-md bg-falcon px-4 py-2 text-sm font-medium text-white hover:bg-falcon/90 disabled:opacity-50"
            onClick={verifyOtp}
            disabled={!attemptId || otp.length !== 6 || isVerifying}
          >
            {isVerifying ? <Loader2 className="animate-spin" size={16} /> : <BadgeCheck size={16} />}
            {isVerifying ? "Verifying..." : "Verify"}
          </button>
          <label className="text-sm">
            <span className="font-medium text-ink/75">WhatsApp number (optional)</span>
            <input
              className="focus-ring mt-1 w-full rounded-md border border-ink/15 px-3 py-2"
              value={whatsappNumber}
              onChange={(event) => setWhatsappNumber(event.target.value)}
              placeholder="+971..."
            />
          </label>
          <label className="text-sm">
            <span className="font-medium text-ink/75">Private email (optional)</span>
            <input
              className="focus-ring mt-1 w-full rounded-md border border-ink/15 px-3 py-2"
              value={privateEmail}
              onChange={(event) => setPrivateEmail(event.target.value)}
              placeholder="user@example.com"
              type="email"
            />
          </label>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md bg-palm px-4 py-2 text-sm font-medium text-white hover:bg-palm/90 disabled:opacity-50"
            onClick={saveProfile}
            disabled={isSavingProfile}
          >
            {isSavingProfile ? <Loader2 className="animate-spin" size={16} /> : <Phone size={16} />}
            {isSavingProfile ? "Saving..." : "Complete Registration"}
          </button>
          {message ? <p className="rounded-md bg-paper px-3 py-2 text-sm text-ink/75">{message}</p> : null}
        </div>
      </section>
    </div>
  );
}
