"use client";

import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
import { useEffect, useState } from "react";

import { LogoMark } from "@/components/ui/logo-mark";
import { publicConfig } from "@/lib/public-config";
import { PersonPortrait } from "@/components/landing/person-portrait";

export function LandingExperience({ entryHref }: { entryHref: string }) {
  const [showSplash, setShowSplash] = useState(true);
  const intro = publicConfig.intro;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSplash(false);
    }, intro.durationMs);

    return () => window.clearTimeout(timer);
  }, [intro.durationMs]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatePresence>
        {showSplash ? (
          <m.section
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.7 } }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-[#160d0b]/95 px-4"
          >
            <div className="glass-panel w-full max-w-4xl px-8 py-12 text-center sm:px-12">
              <div className="mb-10 flex justify-center">
                <LogoMark />
              </div>
              <div className="grid gap-8 sm:grid-cols-2">
                <PersonPortrait
                  name={intro.personOneName}
                  image={intro.personOneImage}
                  accent="linear-gradient(135deg, rgba(255, 219, 198, 0.45), rgba(118, 65, 52, 0.7))"
                />
                <PersonPortrait
                  name={intro.personTwoName}
                  image={intro.personTwoImage}
                  accent="linear-gradient(135deg, rgba(243, 212, 183, 0.45), rgba(68, 35, 28, 0.7))"
                />
              </div>
              <div className="mt-10 space-y-2">
                <p className="font-serif text-3xl text-parchment sm:text-4xl">
                  {intro.quoteLineOne}
                </p>
                <p className="text-base text-parchment/70 sm:text-lg">{intro.quoteLineTwo}</p>
              </div>
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowSplash(false)}
                  className="soft-button-secondary"
                >
                  Skip intro
                </button>
              </div>
            </div>
          </m.section>
        ) : null}
      </AnimatePresence>

      <m.main
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: showSplash ? 0 : 1, y: showSplash ? 24 : 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="page-shell grid min-h-screen items-center py-10"
      >
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="glass-panel p-8 sm:p-10">
            <LogoMark />
            <div className="mt-12 space-y-6">
              <p className="text-xs uppercase tracking-[0.38em] text-parchment/45">
                Shared private diary
              </p>
              <h1 className="font-serif text-5xl text-parchment sm:text-6xl">
                A living place for letters, memories, voice notes, and ordinary days.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-parchment/68">
                Built for the two of you to write at any time, revisit old feelings,
                and keep life in one quiet place that stays yours.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href={entryHref} className="soft-button">
                Enter diary
              </Link>
              <Link href="/login" className="soft-button-secondary">
                Sign in or create account
              </Link>
            </div>
          </section>

          <section className="glass-panel p-8 sm:p-10">
            <div className="grid gap-6">
              <div className="rounded-[2rem] border border-white/10 bg-black/15 p-6">
                <p className="font-serif text-2xl text-parchment">Two people, both writers</p>
                <p className="mt-3 text-sm leading-7 text-parchment/62">
                  Both approved accounts can write diary entries, upload photos, store
                  voice notes, and leave future letters.
                </p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-black/15 p-6">
                <p className="font-serif text-2xl text-parchment">Dynamic after deployment</p>
                <p className="mt-3 text-sm leading-7 text-parchment/62">
                  Once it is on Vercel, anything you write or upload is stored in Supabase
                  and can be added anytime from anywhere you sign in.
                </p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-black/15 p-6">
                <p className="font-serif text-2xl text-parchment">Private and warm</p>
                <p className="mt-3 text-sm leading-7 text-parchment/62">
                  Shared entries are visible to both of you. Private entries stay with the
                  person who wrote them.
                </p>
              </div>
            </div>
          </section>
        </div>
      </m.main>
    </div>
  );
}
