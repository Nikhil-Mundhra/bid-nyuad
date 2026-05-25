import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeCheck, CandlestickChart, LogIn, Sparkles, UserPlus, Zap, CheckCircle2, TrendingUp } from "lucide-react";
import { redirect } from "next/navigation";
import { hasSessionCookie } from "@/lib/server/auth";

export default function Home() {
  if (hasSessionCookie()) {
    redirect("/markets");
  }

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      {/* Hero Section */}
      <section className="relative mx-auto grid min-h-[90vh] max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-8">
        <div className="z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/50 px-4 py-2 text-sm font-semibold text-violet-600 dark:text-violet-400 shadow-sm">
            <Sparkles size={16} />
            NYUAD campus currency market
          </div>

          <h1 className="mt-8 max-w-3xl text-[clamp(3rem,8vw,5.5rem)] font-black leading-[1.05] tracking-tight">
            Trade campus value without the awkward group chat.
          </h1>

          <p className="mt-6 max-w-2xl text-xl leading-8 text-zinc-600 dark:text-zinc-400">
            Bid-NYUAD helps full-aid and partial-aid students discover live rates for Falcon, Campus, Flex, Meal Swipe, and real dirham trades.
          </p>

          <div className="mt-10 grid gap-4 sm:flex sm:items-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 transition-colors px-6 py-4 text-lg font-black text-white shadow-lg shadow-violet-600/20"
            >
              <LogIn size={20} />
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors px-6 py-4 text-lg font-black text-zinc-900 dark:text-zinc-50"
            >
              <UserPlus size={20} />
              Register
            </Link>
            <Link
              href="/markets?demo=guest"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition-colors px-6 py-4 text-lg font-black text-white shadow-lg shadow-emerald-600/20"
            >
              Demo guest
              <ArrowRight size={20} />
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap gap-3 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
            {["NYU NetID OTP", "Anonymous trade chat", "Seller confirmation"].map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 rounded-full bg-zinc-100 dark:bg-zinc-800/50 px-4 py-2 border border-zinc-200 dark:border-zinc-800"
              >
                <BadgeCheck size={16} className="text-violet-600 dark:text-violet-400" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mt-10 lg:mt-0 lg:h-full w-full min-h-[500px] flex items-center justify-center">
          {/* Background image container */}
          <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-2xl">
            <Image
              src="/images/image.jpg"
              alt="NYUAD Campus"
              fill
              className="object-cover object-center scale-105 hover:scale-100 transition-transform duration-1000"
              priority
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-900/40 via-transparent to-black/20" />
          </div>

          {/* Floating Widget */}
          <div className="relative z-20 w-full max-w-sm translate-y-8 translate-x-4 lg:translate-x-12 rounded-[24px] border border-white/20 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl p-6 shadow-[0_32px_64px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-violet-100 dark:bg-violet-900/50 text-lg font-black text-violet-700 dark:text-violet-400">
                  FD
                </div>
                <div>
                  <p className="text-xl font-black m-0">Falcon / AED</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Live Exchange Rate</p>
                </div>
              </div>
              <CandlestickChart className="text-violet-600 dark:text-violet-400" size={28} />
            </div>

            <div className="flex items-end gap-3">
              <p className="text-6xl font-black text-rose-600 dark:text-rose-400 leading-none">0.80</p>
              <p className="text-xl font-bold text-rose-600 dark:text-rose-400 mb-1">AED</p>
            </div>

            <div className="mt-6 flex gap-2">
               <div className="flex-1 rounded-xl bg-violet-600/10 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400 p-3 text-center font-bold">
                 Buying Power +20%
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advertisement Section */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 lg:p-12 shadow-xl border border-zinc-200 dark:border-zinc-800">
            <div className="order-2 lg:order-1 space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 dark:bg-rose-500/20 px-4 py-2 text-sm font-bold text-rose-600 dark:text-rose-400">
                <Zap size={16} />
                Maximize Your Falcons
              </div>

              <h2 className="text-4xl md:text-5xl font-black leading-tight">
                Buy the tech you want.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-rose-600">
                  Pay 20% less.
                </span>
              </h2>

              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Why pay full retail price? By leveraging the Falcon/AED exchange rate, your money goes further. An expensive 3,300 AED iPhone can be yours for just 3,600 Falcons.
              </p>

              <div className="bg-zinc-50 dark:bg-zinc-950 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Retail Price</p>
                    <p className="text-2xl font-black line-through text-zinc-400">3,300 AED</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-1">With Falcons</p>
                    <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">2,880 AED</p>
                    <p className="text-xs font-medium text-emerald-600/80 dark:text-emerald-400/80 mt-1">@ 0.8 conversion rate</p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900 dark:text-zinc-50">Total Savings</span>
                    <span className="text-xl font-black text-rose-600 dark:text-rose-400">420 AED</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative w-full aspect-square md:aspect-[4/3] lg:aspect-square rounded-[2rem] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              <Image
                src="/images/refurb-landing-og-202408.jpeg"
                alt="Apple Devices"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bookstore Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 items-center">
            <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800">
              <Image
                src="/images/bookstore.jpeg"
                alt="NYUAD Bookstore"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="font-black text-2xl drop-shadow-md">NYUAD Bookstore</p>
                <p className="text-white/80 font-medium">Campus Center</p>
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-black leading-tight">
                Real world utility.<br />
                Right on campus.
              </h2>

              <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Falcons aren&apos;t just numbers on a screen. Use your traded Falcons directly at the NYUAD Bookstore for textbooks, supplies, merch, and everyday essentials.
              </p>

              <ul className="space-y-4">
                {[
                  "Buy textbooks and course materials at a discount",
                  "Stock up on NYUAD apparel and merchandise",
                  "Purchase electronics and daily necessities",
                  "Seamlessly spend your traded balance"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-lg font-medium text-zinc-800 dark:text-zinc-200">
                    <CheckCircle2 className="text-emerald-500 shrink-0" size={24} />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <Link
                  href="/markets"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 px-8 py-4 text-lg font-black text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white transition-colors"
                >
                  Start Trading Now
                  <TrendingUp size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
