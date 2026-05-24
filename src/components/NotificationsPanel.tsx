"use client";

import { RefreshCw } from "lucide-react";
import { useState } from "react";

type Notification = {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
};

export function NotificationsPanel() {
  const [userId, setUserId] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [message, setMessage] = useState("");

  async function load() {
    setMessage("Loading notifications...");
    const response = await fetch("/api/notifications", {
      headers: { "x-user-id": userId }
    });
    const result = await response.json();

    if (response.ok) {
      setNotifications(result.notifications);
      setMessage(result.notifications.length ? "" : "No notifications yet.");
    } else {
      setMessage(result.error);
    }
  }

  return (
    <section className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
      <h1 className="text-2xl font-semibold tracking-normal">Notifications</h1>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          className="focus-ring min-w-0 flex-1 rounded-md border border-ink/15 px-3 py-2"
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
          placeholder="Your user id"
        />
        <button
          className="inline-flex items-center justify-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink/90"
          onClick={load}
          disabled={!userId}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>
      <div className="mt-4 space-y-2">
        {notifications.map((notification) => (
          <article key={notification.id} className="rounded-md border border-ink/10 p-3">
            <p className="text-sm font-semibold text-ink">{notification.type.replaceAll("_", " ")}</p>
            <p className="mt-1 text-xs text-ink/60">{new Date(notification.createdAt).toLocaleString()}</p>
            <pre className="mt-2 overflow-auto rounded bg-paper p-2 text-xs text-ink/75">
              {JSON.stringify(notification.payload, null, 2)}
            </pre>
          </article>
        ))}
        {message ? <p className="text-sm text-ink/65">{message}</p> : null}
      </div>
    </section>
  );
}
