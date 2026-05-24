import Link from "next/link";
import { ArrowLeft, BadgeCheck, LogIn, UserRound } from "lucide-react";
import { AccountSettingsForm } from "@/components/AccountSettingsForm";
import { getCurrentUser } from "@/lib/server/auth";

async function loadUser() {
  try {
    return await getCurrentUser();
  } catch {
    return null;
  }
}

export default async function AccountPage() {
  const user = await loadUser();

  return (
    <main style={{ minHeight: "100vh", background: "#101113", color: "#fff" }}>
      <section style={{ maxWidth: 920, margin: "0 auto", padding: "32px" }}>
        <Link
          href="/markets"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            borderRadius: 999,
            padding: 8,
            color: "rgba(255,255,255,0.7)",
            textDecoration: "none"
          }}
        >
          <ArrowLeft size={22} />
          Markets
        </Link>

        <div style={{ marginTop: 36 }}>
          <p style={{ display: "flex", alignItems: "center", gap: 8, margin: 0, color: "#c3a6ff", fontSize: 14, fontWeight: 800 }}>
            <UserRound size={16} />
            Account
          </p>
          <h1 style={{ margin: "12px 0 0", fontSize: "clamp(2.8rem, 8vw, 5rem)", lineHeight: 1, fontWeight: 900, letterSpacing: 0 }}>
            {user ? "Account settings" : "Guest preview"}
          </h1>
          <p style={{ maxWidth: 620, margin: "16px 0 0", color: "rgba(255,255,255,0.58)", fontSize: 18, lineHeight: 1.6 }}>
            Manage your NYUAD trading profile and contact details.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18, marginTop: 32 }}>
          <section style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, background: "#15171a", padding: 20 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>Profile</h2>
            {user ? (
              <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.55)", fontSize: 14 }}>NetID</p>
                <p style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>{user.netId}</p>
                <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,0.55)", fontSize: 14 }}>NYU email</p>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{user.email}</p>
                <span style={{ display: "inline-flex", width: "fit-content", alignItems: "center", gap: 8, marginTop: 8, borderRadius: 999, background: "rgba(82,181,127,0.14)", padding: "8px 12px", color: "#52b57f", fontSize: 14, fontWeight: 900 }}>
                  <BadgeCheck size={16} />
                  {user.verificationStatus}
                </span>
              </div>
            ) : (
              <div style={{ marginTop: 18 }}>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.58)", lineHeight: 1.6 }}>
                  You are browsing in demo guest mode. Login or register to manage a verified NetID account.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18 }}>
                  <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 10, background: "#896ec9", padding: "12px 16px", color: "#fff", fontWeight: 900, textDecoration: "none" }}>
                    <LogIn size={18} />
                    Login
                  </Link>
                  <Link href="/register" style={{ border: "1px solid rgba(255,255,255,0.14)", borderRadius: 10, padding: "12px 16px", color: "#fff", fontWeight: 900, textDecoration: "none" }}>
                    Register
                  </Link>
                </div>
              </div>
            )}
          </section>

          <AccountSettingsForm initialWhatsapp={user?.whatsappNumber} />
        </div>
      </section>
    </main>
  );
}
