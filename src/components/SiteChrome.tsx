"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LineChart, LogIn, UserPlus } from "lucide-react";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const immersive = pathname === "/" || pathname.startsWith("/markets");

  return (
    <div className="min-h-screen">
      {!immersive ? (
        <header className="border-b border-white/10 bg-[#111315]">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/markets" className="text-xl font-semibold tracking-normal text-[#c3a6ff]">
              Bid-NYUAD
            </Link>
            <div className="flex items-center gap-1">
              <Link className="rounded-md p-2 text-white/75 hover:bg-white/10" href="/markets" title="Markets">
                <LineChart size={20} />
              </Link>
              <Link className="rounded-md p-2 text-white/75 hover:bg-white/10" href="/notifications" title="Notifications">
                <Bell size={20} />
              </Link>
              <Link className="rounded-md p-2 text-white/75 hover:bg-white/10" href="/login" title="Login">
                <LogIn size={20} />
              </Link>
              <Link className="rounded-md p-2 text-white/75 hover:bg-white/10" href="/register" title="Register">
                <UserPlus size={20} />
              </Link>
            </div>
          </nav>
        </header>
      ) : null}
      {children}
    </div>
  );
}
