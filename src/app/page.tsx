import Link from "next/link";
import { ArrowRight, BadgeCheck, CandlestickChart, LogIn, Sparkles, UserPlus } from "lucide-react";
import { redirect } from "next/navigation";
import { hasSessionCookie } from "@/lib/server/auth";

export default function Home() {
  if (hasSessionCookie()) {
    redirect("/markets");
  }

  return (
    <main
      className="min-h-screen overflow-hidden bg-[#101113] text-white"
    >
      <section
        className="mx-auto grid min-h-screen max-w-6xl gap-10 px-5 py-8 md:grid-cols-[1fr_0.9fr] md:items-center md:px-8"
      >
        <div>
          <div
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-[#c3a6ff]"
          >
            <Sparkles size={16} />
            NYUAD campus currency market
          </div>

          <h1
            className="mt-8 max-w-3xl text-[clamp(3.5rem,9vw,7rem)] font-black leading-[0.95] tracking-normal"
          >
            Trade campus value without the awkward group chat.
          </h1>

          <p
            className="mt-6 max-w-2xl text-xl leading-8 text-white/62"
          >
            Bid-NYUAD helps full-aid and partial-aid students discover live rates for Falcon, Campus, Flex, Meal Swipe, and real dirham trades.
          </p>

          <div
            className="mt-10 grid gap-3 sm:flex"
          >
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#896ec9] px-6 py-4 text-lg font-black text-white"
            >
              <LogIn size={20} />
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/14 px-6 py-4 text-lg font-black text-white"
            >
              <UserPlus size={20} />
              Register
            </Link>
            <Link
              href="/markets?demo=guest"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3b8a82] px-6 py-4 text-lg font-black text-white"
            >
              Demo guest
              <ArrowRight size={20} />
            </Link>
          </div>

          <div
            className="mt-10 flex flex-wrap gap-3 text-sm text-white/55"
          >
            {["NYU NetID OTP", "Anonymous trade chat", "Seller confirmation"].map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2"
              >
                <BadgeCheck size={16} />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div
          className="relative min-h-[560px] rounded-[36px] border border-white/10 bg-[#17191c] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
        >
          <div className="mx-auto mb-5 h-3 w-24 rounded-full bg-white/15" />
          <div className="rounded-[28px] bg-[#101113] p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-white text-lg font-black text-[#8d6fd0]">
                  FD
                </div>
                <div>
                  <p className="text-2xl font-black">Falcon / Real</p>
                  <p className="text-sm text-white/45">Best active bid</p>
                </div>
              </div>
              <CandlestickChart color="#c3a6ff" size={32} />
            </div>

            <p className="mt-8 text-7xl font-black text-[#ef626d]">80.00</p>
            <p className="mt-3 text-2xl font-bold text-[#ef626d]">-0.43% 1D</p>

            <div className="mt-8 h-48 overflow-hidden">
              <svg viewBox="0 0 520 180" width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true">
                <line x1="0" x2="520" y1="90" y2="90" stroke="#6c6e73" strokeWidth="2" strokeDasharray="8 8" />
                <path d="M0 92 C40 70 58 132 92 116 C132 90 116 28 168 38 C218 50 196 110 244 98 C286 88 294 126 332 120 C378 112 376 70 420 78 C464 86 464 144 520 132" fill="none" stroke="#d94d52" strokeWidth="5" strokeLinecap="round" />
                <path d="M0 92 C40 70 58 132 92 116 C132 90 116 28 168 38 C218 50 196 110 244 98" fill="none" stroke="#4fa375" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#896ec9] p-5 text-center text-xl font-black">BUY</div>
            <div className="rounded-2xl bg-[#3b8a82] p-5 text-center text-xl font-black">SELL</div>
          </div>
        </div>
      </section>
    </main>
  );
}
