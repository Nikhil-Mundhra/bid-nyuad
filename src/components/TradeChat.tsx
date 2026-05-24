"use client";

import { CheckCircle2, MessageSquare, PhoneForwarded, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Message = {
  id: string;
  body: string;
  type: string;
  senderAlias: string;
  isMine: boolean;
  createdAt: string;
};

export function TradeChat({ tradeId }: { tradeId: string }) {
  const [userId, setUserId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("");

  const loadMessages = useCallback(async () => {
    if (!userId) {
      return;
    }

    const response = await fetch(`/api/trades/${tradeId}/messages`, {
      headers: { "x-user-id": userId }
    });
    const result = await response.json();

    if (response.ok) {
      setMessages(result.messages);
    } else {
      setStatus(result.error);
    }
  }, [tradeId, userId]);

  useEffect(() => {
    void loadMessages();
    const interval = window.setInterval(() => void loadMessages(), 5000);
    return () => window.clearInterval(interval);
  }, [loadMessages]);

  async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch(`/api/trades/${tradeId}/messages`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-user-id": userId
      },
      body: JSON.stringify({ body })
    });
    const result = await response.json();

    if (response.ok) {
      setBody("");
      setStatus("Message sent.");
      await loadMessages();
    } else {
      setStatus(result.error);
    }
  }

  async function revealWhatsapp() {
    const response = await fetch(`/api/trades/${tradeId}/reveal-whatsapp`, {
      method: "POST",
      headers: { "x-user-id": userId }
    });
    const result = await response.json();
    setStatus(response.ok ? "WhatsApp revealed in chat." : result.error);
    await loadMessages();
  }

  async function confirmSeller(successful: boolean) {
    const response = await fetch(`/api/trades/${tradeId}/confirm-seller`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-user-id": userId
      },
      body: JSON.stringify({ successful, failureReason: successful ? undefined : "Seller marked failure." })
    });
    const result = await response.json();
    setStatus(response.ok ? `Trade ${result.trade.status.toLowerCase()}.` : result.error);
    await loadMessages();
  }

  return (
    <section className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Anonymous trade chat</h1>
          <p className="mt-2 text-sm text-ink/70">Messages poll every five seconds.</p>
        </div>
        <MessageSquare className="text-gulf" size={28} />
      </div>
      <label className="mt-4 block text-sm">
        <span className="font-medium text-ink/75">Your user id</span>
        <input
          className="focus-ring mt-1 w-full rounded-md border border-ink/15 px-3 py-2"
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
          placeholder="Buyer or seller user id"
        />
      </label>
      <div className="mt-4 min-h-64 space-y-2 rounded-lg bg-paper p-3">
        {messages.length ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-md px-3 py-2 text-sm ${message.isMine ? "ml-auto bg-gulf text-white" : "bg-white text-ink"}`}
            >
              <p className="text-xs opacity-75">{message.senderAlias}</p>
              <p>{message.body}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-ink/65">Enter your user id to load messages.</p>
        )}
      </div>
      <form onSubmit={sendMessage} className="mt-3 flex gap-2">
        <input
          className="focus-ring min-w-0 flex-1 rounded-md border border-ink/15 px-3 py-2"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Write a message"
        />
        <button className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white" disabled={!userId || !body}>
          Send
        </button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          className="inline-flex items-center gap-2 rounded-md border border-ink/15 px-3 py-2 text-sm hover:bg-ink/5"
          onClick={revealWhatsapp}
          disabled={!userId}
        >
          <PhoneForwarded size={16} />
          Reveal WhatsApp
        </button>
        <button
          className="inline-flex items-center gap-2 rounded-md border border-palm/30 px-3 py-2 text-sm text-palm hover:bg-palm/5"
          onClick={() => confirmSeller(true)}
          disabled={!userId}
        >
          <CheckCircle2 size={16} />
          Successful
        </button>
        <button
          className="inline-flex items-center gap-2 rounded-md border border-falcon/30 px-3 py-2 text-sm text-falcon hover:bg-falcon/5"
          onClick={() => confirmSeller(false)}
          disabled={!userId}
        >
          <XCircle size={16} />
          Failed
        </button>
      </div>
      {status ? <p className="mt-3 text-sm text-ink/70">{status}</p> : null}
    </section>
  );
}
