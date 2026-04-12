import dynamic from "next/dynamic";
import { ClockArrowUp, Mailbox } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";
import { SectionCard } from "@/components/ui/section-card";
import { getViewerOrRedirect } from "@/lib/auth/approved-users";
import { getFutureLetters } from "@/lib/data/future-letters";

const FutureLetterCard = dynamic(
  () =>
    import("@/components/future-letters/future-letter-card").then(
      (module) => module.FutureLetterCard
    ),
  {
    loading: () => <div className="glass-panel h-80 animate-pulse" />
  }
);

const FutureLetterForm = dynamic(
  () =>
    import("@/components/forms/future-letter-form").then((module) => module.FutureLetterForm),
  {
    loading: () => <div className="glass-panel h-72 animate-pulse" />
  }
);

export default async function FutureLettersPage() {
  const { profile } = await getViewerOrRedirect();
  const letters = await getFutureLetters(profile);

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Future letters"
        title="Messages meant for another day."
        description="Seal letters with an unlock date, let the countdown run quietly in the background, and read them only when their time arrives."
      />

      <SectionCard className="space-y-5">
        <div className="flex items-center gap-3">
          <ClockArrowUp className="size-5 text-[#ffd9ba]" />
          <h2 className="font-serif text-3xl text-parchment">Seal a new letter</h2>
        </div>
        <FutureLetterForm />
      </SectionCard>

      {letters.length ? (
        <div className="grid gap-5">
          {letters.map((letter) => (
            <FutureLetterCard
              key={letter.id}
              letter={letter}
              currentUserId={profile.id}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Mailbox}
          title="No future letters yet"
          description="The first sealed letter will appear here with its countdown and unlock state."
        />
      )}
    </div>
  );
}
