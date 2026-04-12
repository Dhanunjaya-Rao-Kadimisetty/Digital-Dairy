import dynamic from "next/dynamic";
import Link from "next/link";
import { BookHeart, Filter, Search } from "lucide-react";

import { DiaryEntryCard } from "@/components/diary/diary-entry-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";
import { SectionCard } from "@/components/ui/section-card";
import { diaryMoods } from "@/lib/constants";
import { getViewerOrRedirect } from "@/lib/auth/approved-users";
import { getDiaryEntries } from "@/lib/data/diary";

const DiaryEntryForm = dynamic(
  () => import("@/components/forms/diary-entry-form").then((module) => module.DiaryEntryForm),
  {
    loading: () => <div className="glass-panel h-80 animate-pulse" />
  }
);

export default async function DiaryPage({
  searchParams
}: {
  searchParams?: Promise<{ q?: string; mood?: string; date?: string }>;
}) {
  const { profile } = await getViewerOrRedirect();
  const filters = (await searchParams) ?? {};
  const entries = await getDiaryEntries(profile, {
    search: filters.q,
    mood: filters.mood,
    date: filters.date
  });

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Diary"
        title="Pages you can come back to."
        description="Search by title or memory, filter by mood or date, and keep every written moment in one quiet place."
      />

      <SectionCard className="space-y-5">
        <form className="grid gap-4 lg:grid-cols-[1.5fr_0.7fr_0.7fr_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-parchment/35" />
            <input
              name="q"
              defaultValue={filters.q}
              className="soft-input pl-11"
              placeholder="Search title or content..."
            />
          </div>
          <select name="mood" defaultValue={filters.mood ?? ""} className="soft-input">
            <option value="" className="bg-[#2b1712]">
              All moods
            </option>
            {diaryMoods.map((mood) => (
              <option key={mood} value={mood} className="bg-[#2b1712]">
                {mood}
              </option>
            ))}
          </select>
          <input type="date" name="date" defaultValue={filters.date} className="soft-input" />
          <button className="soft-button gap-2">
            <Filter className="size-4" />
            Filter
          </button>
        </form>
      </SectionCard>

      <SectionCard className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-parchment/45">
            New entry
          </p>
          <h2 className="mt-3 font-serif text-3xl text-parchment">Write what matters today.</h2>
        </div>
        <DiaryEntryForm />
      </SectionCard>

      {entries.length ? (
        <section className="grid gap-5 lg:grid-cols-2">
          {entries.map((entry) => (
            <DiaryEntryCard key={entry.id} entry={entry} />
          ))}
        </section>
      ) : (
        <EmptyState
          icon={BookHeart}
          title="Nothing matched this search"
          description="Try a softer filter, a different date, or come back after the next entry is written."
          action={
            <Link href="/diary" className="soft-button-secondary">
              Clear filters
            </Link>
          }
        />
      )}
    </div>
  );
}
