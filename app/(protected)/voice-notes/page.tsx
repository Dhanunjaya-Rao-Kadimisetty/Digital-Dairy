import dynamic from "next/dynamic";
import { AudioLines, MicVocal } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";
import { SectionCard } from "@/components/ui/section-card";
import { getViewerOrRedirect } from "@/lib/auth/approved-users";
import { getVoiceNotes } from "@/lib/data/voice-notes";

const VoiceNoteForm = dynamic(
  () => import("@/components/forms/voice-note-form").then((module) => module.VoiceNoteForm),
  {
    loading: () => <div className="glass-panel h-72 animate-pulse" />
  }
);

const VoiceNoteList = dynamic(
  () => import("@/components/voice-notes/voice-note-list").then((module) => module.VoiceNoteList),
  {
    loading: () => <div className="glass-panel h-96 animate-pulse" />
  }
);

export default async function VoiceNotesPage() {
  const { profile } = await getViewerOrRedirect();
  const items = await getVoiceNotes(profile);

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Voice notes"
        title="Sometimes the voice matters more than the wording."
        description="Store recordings privately, attach a small note if you want, and listen back without exposing anything publicly."
      />

      <SectionCard className="space-y-5">
        <div className="flex items-center gap-3">
          <MicVocal className="size-5 text-[#ffd9ba]" />
          <h2 className="font-serif text-3xl text-parchment">Upload a voice note</h2>
        </div>
        <VoiceNoteForm userId={profile.id} />
      </SectionCard>

      {items.length ? (
        <VoiceNoteList items={items} currentUserId={profile.id} />
      ) : (
        <EmptyState
          icon={AudioLines}
          title="No voice notes yet"
          description="Once a recording is uploaded, it will appear here with an embedded player and its note."
        />
      )}
    </div>
  );
}
