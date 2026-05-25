"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-8 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <p>© {new Date().getFullYear()} Bid-NYUAD. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link href="/about" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
            About
          </Link>
          <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
