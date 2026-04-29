import { notFound } from "next/navigation";
import { Film } from "lucide-react";

import { CommentThread } from "@/components/diary/comment-thread";
import { DeleteEntryButton } from "@/components/diary/delete-entry-button";
import { ReactionBar } from "@/components/diary/reaction-bar";
import { CommentForm } from "@/components/forms/comment-form";
import { DiaryEntryForm } from "@/components/forms/diary-entry-form";
import { MarkdownContent } from "@/components/shared/markdown-content";
import { PageIntro } from "@/components/ui/page-intro";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getViewerOrRedirect } from "@/lib/auth/approved-users";
import { getDiaryEntryById } from "@/lib/data/diary";
import { formatDateTime } from "@/lib/utils";

function isVideoMedia(url: string) {
  return /\.(mp4|webm|mov|avi|mkv)$/i.test(url);
}

export default async function DiaryEntryDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { profile } = await getViewerOrRedirect();
  const { id } = await params;
  const entry = await getDiaryEntryById(id, profile);

  if (!entry) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Diary detail"
        title={entry.title}
        description={`Written ${formatDateTime(entry.created_at)}. ${
          entry.updated_at !== entry.created_at ? "Updated later, with care." : "Saved as-is."
        }`}
        action={
          <div className="flex flex-wrap gap-3">
            <StatusBadge variant="accent">{entry.mood}</StatusBadge>
            <StatusBadge>{entry.visibility}</StatusBadge>
          </div>
        }
      />

      <SectionCard className="space-y-6">
        <MarkdownContent content={entry.content} />

        {/* Attached Media */}
        {entry.media_signed_url && entry.media_url && (
          <div className="border-t border-white/10 pt-6">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-parchment/45">
              Attachment
            </p>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
              {isVideoMedia(entry.media_url) ? (
                <video
                  controls
                  preload="metadata"
                  className="max-h-[520px] w-full rounded-2xl"
                  playsInline
                >
                  <source src={entry.media_signed_url} />
                  Your browser does not support this video.
                </video>
              ) : (
                <img
                  src={entry.media_signed_url}
                  alt="Diary attachment"
                  className="max-h-[520px] w-full object-contain"
                />
              )}
            </div>
          </div>
        )}

        <div className="border-t border-white/10 pt-6">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-parchment/45">
            Reactions
          </p>
          <ReactionBar
            entryId={entry.id}
            reactions={entry.reactions ?? []}
            currentUserId={profile.id}
          />
        </div>
      </SectionCard>

      {profile.id === entry.author_id ? (
        <SectionCard className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-parchment/45">
                Writer tools
              </p>
              <h2 className="mt-3 font-serif text-3xl text-parchment">
                Refine or remove this page.
              </h2>
            </div>
            <DeleteEntryButton entryId={entry.id} />
          </div>
          <DiaryEntryForm entry={entry} userId={profile.id} />
        </SectionCard>
      ) : null}

      <SectionCard className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-parchment/45">Comments</p>
          <h2 className="mt-3 font-serif text-3xl text-parchment">
            Small responses can live here too.
          </h2>
        </div>

        <CommentForm entryId={entry.id} />
        <CommentThread
          comments={entry.comments ?? []}
          currentUserId={profile.id}
          entryId={entry.id}
        />
      </SectionCard>
    </div>
  );
}
