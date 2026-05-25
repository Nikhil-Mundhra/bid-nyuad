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
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <section className="mx-auto max-w-[920px] p-8">
        <Link
          href="/markets"
          className="inline-flex items-center gap-2 rounded-full p-2 text-zinc-700 dark:text-zinc-300 no-underline"
        >
          <ArrowLeft size={22} />
          Markets
        </Link>

        <div className="mt-9">
          <p className="m-0 flex items-center gap-2 text-sm font-extrabold text-violet-600 dark:text-violet-400">
            <UserRound size={16} />
            Account
          </p>
          <h1 className="mt-3 text-[clamp(2.8rem,8vw,5rem)] font-black leading-none tracking-normal">
            {user ? "Account settings" : "Guest preview"}
          </h1>
          <p className="mt-4 max-w-[620px] text-lg leading-relaxed text-zinc-900 dark:text-zinc-50/60">
            Manage your NYUAD trading profile and contact details.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[18px]">
          <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <h2 className="m-0 text-[22px] font-black">Profile</h2>
            {user ? (
              <div className="mt-[18px] grid gap-3">
                <p className="m-0 text-sm text-zinc-500 dark:text-zinc-400">NetID</p>
                <p className="m-0 text-2xl font-black">{user.netId}</p>
                <p className="mt-2.5 text-sm text-zinc-500 dark:text-zinc-400">NYU email</p>
                <p className="m-0 text-lg font-bold">{user.email}</p>
                <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-2 text-sm font-black text-emerald-600 dark:text-emerald-400">
                  <BadgeCheck size={16} />
                  {user.verificationStatus}
                </span>
              </div>
            ) : (
              <div className="mt-[18px]">
                <p className="m-0 leading-relaxed text-zinc-900 dark:text-zinc-50/60">
                  You are browsing in demo guest mode. Login or register to manage a verified NetID account.
                </p>
                <div className="mt-[18px] flex flex-wrap gap-2.5">
                  <Link href="/login" className="inline-flex items-center gap-2 rounded-lg bg-violet-600 dark:bg-violet-600 px-4 py-3 font-black text-white no-underline">
                    <LogIn size={18} />
                    Login
                  </Link>
                  <Link href="/register" className="rounded-lg border border-zinc-200 dark:border-zinc-700 px-4 py-3 font-black text-zinc-900 dark:text-zinc-50 no-underline">
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
