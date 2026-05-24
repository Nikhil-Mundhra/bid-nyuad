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
      style={{ minHeight: "100vh", overflow: "hidden", background: "#101113", color: "#fff" }}
    >
      <section
        className="mx-auto grid min-h-screen max-w-6xl gap-10 px-5 py-8 md:grid-cols-[1fr_0.9fr] md:items-center md:px-8"
        style={{
          minHeight: "100vh",
          maxWidth: 1152,
          margin: "0 auto",
          display: "grid",
          gap: 40,
          padding: "2rem",
          alignItems: "center"
        }}
      >
        <div>
          <div
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-[#c3a6ff]"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 999,
              background: "rgba(255,255,255,0.05)",
              padding: "8px 16px",
              color: "#c3a6ff",
              fontSize: 14,
              fontWeight: 600
            }}
          >
            <Sparkles size={16} />
            NYUAD campus currency market
          </div>

          <h1
            className="mt-8 max-w-3xl text-[clamp(3.5rem,9vw,7rem)] font-black leading-[0.95] tracking-normal"
            style={{
              maxWidth: 760,
              margin: "2rem 0 0",
              fontSize: "clamp(3.5rem, 9vw, 7rem)",
              lineHeight: 0.95,
              fontWeight: 900,
              letterSpacing: 0
            }}
          >
            Trade campus value without the awkward group chat.
          </h1>

          <p
            className="mt-6 max-w-2xl text-xl leading-8 text-white/62"
            style={{ maxWidth: 672, margin: "1.5rem 0 0", color: "rgba(255,255,255,0.62)", fontSize: 20, lineHeight: "2rem" }}
          >
            Bid-NYUAD helps full-aid and partial-aid students discover live rates for Falcon, Campus, Flex, Meal Swipe, and real dirham trades.
          </p>

          <div
            className="mt-10 grid gap-3 sm:flex"
            style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 40 }}
          >
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#896ec9] px-6 py-4 text-lg font-black text-white"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                borderRadius: 12,
                background: "#896ec9",
                padding: "16px 24px",
                color: "#fff",
                fontSize: 18,
                fontWeight: 900,
                textDecoration: "none"
              }}
            >
              <LogIn size={20} />
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/14 px-6 py-4 text-lg font-black text-white"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 12,
                padding: "16px 24px",
                color: "#fff",
                fontSize: 18,
                fontWeight: 900,
                textDecoration: "none"
              }}
            >
              <UserPlus size={20} />
              Register
            </Link>
            <Link
              href="/markets?demo=guest"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3b8a82] px-6 py-4 text-lg font-black text-white"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                borderRadius: 12,
                background: "#3b8a82",
                padding: "16px 24px",
                color: "#fff",
                fontSize: 18,
                fontWeight: 900,
                textDecoration: "none"
              }}
            >
              Demo guest
              <ArrowRight size={20} />
            </Link>
          </div>

          <div
            className="mt-10 flex flex-wrap gap-3 text-sm text-white/55"
            style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 40, color: "rgba(255,255,255,0.55)", fontSize: 14 }}
          >
            {["NYU NetID OTP", "Anonymous trade chat", "Seller confirmation"].map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 999, background: "rgba(255,255,255,0.05)", padding: "8px 16px" }}
              >
                <BadgeCheck size={16} />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div
          className="relative min-h-[560px] rounded-[36px] border border-white/10 bg-[#17191c] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
          style={{
            position: "relative",
            minHeight: 560,
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 36,
            background: "#17191c",
            padding: 20,
            boxShadow: "0 24px 80px rgba(0,0,0,0.35)"
          }}
        >
          <div className="mx-auto mb-5 h-3 w-24 rounded-full bg-white/15" style={{ width: 96, height: 12, margin: "0 auto 20px", borderRadius: 999, background: "rgba(255,255,255,0.15)" }} />
          <div className="rounded-[28px] bg-[#101113] p-5" style={{ borderRadius: 28, background: "#101113", padding: 20 }}>
            <div className="flex items-center justify-between" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div className="flex items-center gap-4" style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div className="grid h-16 w-16 place-items-center rounded-full bg-white text-lg font-black text-[#8d6fd0]" style={{ display: "grid", width: 64, height: 64, placeItems: "center", borderRadius: 999, background: "#fff", color: "#8d6fd0", fontSize: 18, fontWeight: 900 }}>
                  FD
                </div>
                <div>
                  <p className="text-2xl font-black" style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Falcon / Real</p>
                  <p className="text-sm text-white/45" style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.45)", fontSize: 14 }}>Best active bid</p>
                </div>
              </div>
              <CandlestickChart color="#c3a6ff" size={32} />
            </div>

            <p className="mt-8 text-7xl font-black text-[#ef626d]" style={{ margin: "32px 0 0", color: "#ef626d", fontSize: 72, lineHeight: 1, fontWeight: 900 }}>80.00</p>
            <p className="mt-3 text-2xl font-bold text-[#ef626d]" style={{ margin: "12px 0 0", color: "#ef626d", fontSize: 24, fontWeight: 700 }}>-0.43% 1D</p>

            <div className="mt-8 h-48 overflow-hidden" style={{ marginTop: 32, height: 192, overflow: "hidden" }}>
              <svg viewBox="0 0 520 180" width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true">
                <line x1="0" x2="520" y1="90" y2="90" stroke="#6c6e73" strokeWidth="2" strokeDasharray="8 8" />
                <path d="M0 92 C40 70 58 132 92 116 C132 90 116 28 168 38 C218 50 196 110 244 98 C286 88 294 126 332 120 C378 112 376 70 420 78 C464 86 464 144 520 132" fill="none" stroke="#d94d52" strokeWidth="5" strokeLinecap="round" />
                <path d="M0 92 C40 70 58 132 92 116 C132 90 116 28 168 38 C218 50 196 110 244 98" fill="none" stroke="#4fa375" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
            <div className="rounded-2xl bg-[#896ec9] p-5 text-center text-xl font-black" style={{ borderRadius: 16, background: "#896ec9", padding: 20, textAlign: "center", fontSize: 20, fontWeight: 900 }}>BUY</div>
            <div className="rounded-2xl bg-[#3b8a82] p-5 text-center text-xl font-black" style={{ borderRadius: 16, background: "#3b8a82", padding: 20, textAlign: "center", fontSize: 20, fontWeight: 900 }}>SELL</div>
          </div>
        </div>
      </section>
    </main>
  );
}
