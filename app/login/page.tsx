import { HeartHandshake } from "lucide-react";

import { AmbientParticles } from "@/components/backgrounds/ambient-particles";
import { LoginForm } from "@/components/forms/login-form";
import { LogoMark } from "@/components/ui/logo-mark";
import { redirectIfAuthenticated } from "@/lib/auth/approved-users";

export default async function LoginPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  await redirectIfAuthenticated();
  const resolvedSearchParams = await searchParams;
  const unauthorized = resolvedSearchParams?.error === "unauthorized";

  return (
    <main className="page-shell grid min-h-screen items-center py-10">
      <AmbientParticles />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="glass-panel overflow-hidden p-8 sm:p-10">
          <LogoMark />
          <div className="mt-12 max-w-2xl space-y-6">
            <p className="text-xs uppercase tracking-[0.38em] text-parchment/45">
              Private digital diary
            </p>
            <h1 className="font-serif text-5xl text-parchment sm:text-6xl">
              A soft, secure room for memories, voice notes, and future letters.
            </h1>
            <p className="max-w-xl text-base leading-8 text-parchment/68">
              Built for exactly two people who can both write, read, remember, and
              leave little pieces of life for each other.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-black/15 p-5">
              <p className="font-serif text-2xl text-parchment">Private by default</p>
              <p className="mt-3 text-sm leading-7 text-parchment/60">
                Only approved family accounts can enter, read, and respond.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/15 p-5">
              <p className="font-serif text-2xl text-parchment">Built to keep feeling</p>
              <p className="mt-3 text-sm leading-7 text-parchment/60">
                Diary entries, memories, voice notes, and time-locked letters all live here.
              </p>
            </div>
          </div>
        </section>

        <section className="glass-panel p-8 sm:p-10">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-sm text-[#ffd9ba]">
            <HeartHandshake className="size-4" />
            Two-person access only
          </div>
          <div className="space-y-3">
            <h2 className="font-serif text-4xl text-parchment">Enter your private room</h2>
            <p className="text-sm leading-7 text-parchment/62">
              Sign in with your approved email and password, or create the account
              here the first time you use it.
            </p>
            {unauthorized ? (
              <p className="rounded-2xl border border-[#ffb8a5]/20 bg-[#ffb8a5]/10 px-4 py-3 text-sm text-[#ffd3c5]">
                This diary is restricted to the two approved family accounts.
              </p>
            ) : null}
          </div>
          <div className="mt-8">
            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}
