"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LineChart, LogIn, UserPlus } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Footer } from "./Footer";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const immersive = pathname === "/" || pathname.startsWith("/markets");

  return (
    <div className="flex min-h-screen flex-col">
      {!immersive ? (
        <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/markets" className="text-xl font-semibold tracking-normal text-violet-600 dark:text-violet-400">
              Bid-NYUAD
            </Link>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <Link className="rounded-md p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800" href="/markets" title="Markets">
                <LineChart size={20} />
              </Link>
              <Link className="rounded-md p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800" href="/notifications" title="Notifications">
                <Bell size={20} />
              </Link>
              <Link className="rounded-md p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800" href="/login" title="Login">
                <LogIn size={20} />
              </Link>
              <Link className="rounded-md p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800" href="/register" title="Register">
                <UserPlus size={20} />
              </Link>
            </div>
          </nav>
        </header>
      ) : null}
      <main className="flex-1">{children}</main>
      {!immersive ? <Footer /> : null}
    </div>
  );
}
