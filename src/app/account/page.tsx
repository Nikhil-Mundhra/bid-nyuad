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
    <main className="min-h-screen bg-[#101113] text-white">
      <section className="mx-auto max-w-[920px] p-8">
        <Link
          href="/markets"
          className="inline-flex items-center gap-2 rounded-full p-2 text-white/70 no-underline"
        >
          <ArrowLeft size={22} />
          Markets
        </Link>

        <div className="mt-9">
          <p className="m-0 flex items-center gap-2 text-sm font-extrabold text-[#c3a6ff]">
            <UserRound size={16} />
            Account
          </p>
          <h1 className="mt-3 text-[clamp(2.8rem,8vw,5rem)] font-black leading-none tracking-normal">
            {user ? "Account settings" : "Guest preview"}
          </h1>
          <p className="mt-4 max-w-[620px] text-lg leading-relaxed text-white/60">
            Manage your NYUAD trading profile and contact details.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[18px]">
          <section className="rounded-xl border border-white/10 bg-[#15171a] p-5">
            <h2 className="m-0 text-[22px] font-black">Profile</h2>
            {user ? (
              <div className="mt-[18px] grid gap-3">
                <p className="m-0 text-sm text-white/55">NetID</p>
                <p className="m-0 text-2xl font-black">{user.netId}</p>
                <p className="mt-2.5 text-sm text-white/55">NYU email</p>
                <p className="m-0 text-lg font-bold">{user.email}</p>
                <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-[#52b57f]/15 px-3 py-2 text-sm font-black text-[#52b57f]">
                  <BadgeCheck size={16} />
                  {user.verificationStatus}
                </span>
              </div>
            ) : (
              <div className="mt-[18px]">
                <p className="m-0 leading-relaxed text-white/60">
                  You are browsing in demo guest mode. Login or register to manage a verified NetID account.
                </p>
                <div className="mt-[18px] flex flex-wrap gap-2.5">
                  <Link href="/login" className="inline-flex items-center gap-2 rounded-lg bg-[#896ec9] px-4 py-3 font-black text-white no-underline">
                    <LogIn size={18} />
                    Login
                  </Link>
                  <Link href="/register" className="rounded-lg border border-white/15 px-4 py-3 font-black text-white no-underline">
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
