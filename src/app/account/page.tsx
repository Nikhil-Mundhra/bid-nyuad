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
      <section className="max-w-[920px] mx-auto p-8">
        <Link
          href="/markets"
          className="inline-flex items-center gap-2 rounded-full p-2 text-white/70 no-underline hover:text-white"
        >
          <ArrowLeft size={22} />
          Markets
        </Link>

        <div className="mt-9">
          <p className="flex items-center gap-2 m-0 text-[#c3a6ff] text-sm font-extrabold">
            <UserRound size={16} />
            Account
          </p>
          <h1 className="mt-3 m-0 text-[clamp(2.8rem,8vw,5rem)] leading-none font-black tracking-normal">
            {user ? "Account settings" : "Guest preview"}
          </h1>
          <p className="max-w-[620px] mt-4 m-0 text-white/60 text-lg leading-relaxed">
            Manage your NYUAD trading profile and contact details.
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[18px] mt-8">
          <section className="border border-white/10 rounded-2xl bg-[#15171a] p-5">
            <h2 className="m-0 text-[22px] font-black">Profile</h2>
            {user ? (
              <div className="grid gap-3 mt-[18px]">
                <p className="m-0 text-white/55 text-sm">NetID</p>
                <p className="m-0 text-2xl font-black">{user.netId}</p>
                <p className="mt-2.5 m-0 text-white/55 text-sm">NYU email</p>
                <p className="m-0 text-lg font-bold">{user.email}</p>
                <span className="inline-flex w-fit items-center gap-2 mt-2 rounded-full bg-[#52b57f]/15 py-2 px-3 text-[#52b57f] text-sm font-black">
                  <BadgeCheck size={16} />
                  {user.verificationStatus}
                </span>
              </div>
            ) : (
              <div className="mt-[18px]">
                <p className="m-0 text-white/60 leading-relaxed">
                  You are browsing in demo guest mode. Login or register to manage a verified NetID account.
                </p>
                <div className="flex flex-wrap gap-2.5 mt-[18px]">
                  <Link href="/login" className="inline-flex items-center gap-2 rounded-lg bg-[#896ec9] py-3 px-4 text-white font-black no-underline">
                    <LogIn size={18} />
                    Login
                  </Link>
                  <Link href="/register" className="border border-white/15 rounded-lg py-3 px-4 text-white font-black no-underline">
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
