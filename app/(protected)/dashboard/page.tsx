import Link from "next/link";
import {
  BookHeart,
  Clock3,
  GalleryVertical,
  Headphones,
  LockKeyhole
} from "lucide-react";

import { AmbientParticles } from "@/components/backgrounds/ambient-particles";
import { DiaryEntryCard } from "@/components/diary/diary-entry-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";
import { SectionCard } from "@/components/ui/section-card";
import { StatCard } from "@/components/ui/stat-card";
import { getViewerOrRedirect } from "@/lib/auth/approved-users";
import { getDashboardSnapshot } from "@/lib/data/dashboard";
import { getPartnerProfile } from "@/lib/data/profile";
import { PartnerStatus } from "@/components/dashboard/partner-status";

export default async function DashboardPage() {
  const { profile } = await getViewerOrRedirect();
  const snapshot = await getDashboardSnapshot(profile);
  const partner = await getPartnerProfile(profile.id);

  return (
    <div className="space-y-6">
      <AmbientParticles />
      <PageIntro
        eyebrow="Home"
        title="Your shared archive of feeling."
        description="A private place to write, remember, listen back, and leave small pieces of today for a future version of home."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href="/diary" className="soft-button">
              Open diary
            </Link>
            <Link href="/future-letters" className="soft-button-secondary">
              Future letters
            </Link>
          </div>
        }
      />

      {partner && (
        <div className="max-w-xs">
          <PartnerStatus profile={partner} />
        </div>
      )}


      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Entries"
          value={snapshot.totalEntries}
          detail="Written pages currently visible in this private space."
          icon={BookHeart}
        />
        <StatCard
          label="Shared"
          value={snapshot.sharedEntries}
          detail="Entries available for both of you to revisit together."
          icon={Clock3}
        />
        <StatCard
          label="Memories"
          value={snapshot.memories}
          detail="Captured gallery moments tucked into the archive."
          icon={GalleryVertical}
        />
        <StatCard
          label="Voice + letters"
          value={snapshot.voiceNotes + snapshot.futureLetters}
          detail="Voice notes and sealed future letters waiting nearby."
          icon={Headphones}
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-parchment/45">
                Recent pages
              </p>
              <h2 className="mt-3 font-serif text-3xl text-parchment">
                The latest things you’ve felt or kept.
              </h2>
            </div>
            <Link href="/diary" className="text-sm text-parchment/60 hover:text-parchment">
              See all entries
            </Link>
          </div>

          {snapshot.recentEntries.length ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {snapshot.recentEntries.map((entry) => (
                <DiaryEntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={BookHeart}
              title="No entries yet"
              description="Once the first diary entry is written, it will show up here with mood, time, and reactions."
              action={
                <Link href="/diary" className="soft-button">
                  Write the first entry
                </Link>
              }
            />
          )}
        </SectionCard>

        <SectionCard className="space-y-5">
          <p className="text-xs uppercase tracking-[0.3em] text-parchment/45">Quick routes</p>
          <div className="grid gap-4">
            <Link
              href="/gallery"
              className="rounded-3xl border border-white/10 bg-black/15 p-5 transition hover:bg-white/10"
            >
              <GalleryVertical className="size-5 text-[#ffd9ba]" />
              <p className="mt-4 font-serif text-2xl text-parchment">Memory gallery</p>
              <p className="mt-2 text-sm leading-7 text-parchment/60">
                Browse images, captions, and moments worth keeping in view.
              </p>
            </Link>
            <Link
              href="/voice-notes"
              className="rounded-3xl border border-white/10 bg-black/15 p-5 transition hover:bg-white/10"
            >
              <Headphones className="size-5 text-[#ffd9ba]" />
              <p className="mt-4 font-serif text-2xl text-parchment">Voice notes</p>
              <p className="mt-2 text-sm leading-7 text-parchment/60">
                Listen to feelings exactly as they were spoken and saved.
              </p>
            </Link>
            <Link
              href="/future-letters"
              className="rounded-3xl border border-white/10 bg-black/15 p-5 transition hover:bg-white/10"
            >
              <LockKeyhole className="size-5 text-[#ffd9ba]" />
              <p className="mt-4 font-serif text-2xl text-parchment">Future letters</p>
              <p className="mt-2 text-sm leading-7 text-parchment/60">
                Messages that stay sealed until a chosen date finally arrives.
              </p>
            </Link>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
