import Link from "next/link";
import { Film, ImageIcon, MessageCircle, Sparkles, UserRound } from "lucide-react";

import type { DiaryEntry } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { DiaryDate } from "./diary-date";

function isVideoMedia(url: string) {
  return /\.(mp4|webm|mov|avi|mkv)$/i.test(url);
}

export function DiaryEntryCard({ entry }: { entry: DiaryEntry }) {
  const commentCount = entry.comments?.length ?? 0;
  const reactionCount = entry.reactions?.length ?? 0;
  const hasMedia = !!entry.media_url;
  const isVideo = hasMedia && isVideoMedia(entry.media_url!);

  return (
    <Link
      href={`/diary/${entry.id}`}
      className="glass-panel group flex h-full flex-col justify-between overflow-hidden transition hover:-translate-y-1 hover:bg-white/10"
    >
      {/* Media thumbnail */}
      {hasMedia && entry.media_signed_url && (
        <div className="relative h-48 w-full overflow-hidden bg-black/30">
          {isVideo ? (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cedar/80 to-ink/60">
              <div className="flex size-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                <Film className="size-6 text-gold" />
              </div>
            </div>
          ) : (
            <img
              src={entry.media_signed_url}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          {/* Media indicator badge */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs text-parchment/70 backdrop-blur-sm">
            {isVideo ? <Film className="size-3" /> : <ImageIcon className="size-3" />}
            {isVideo ? "Video" : "Photo"}
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge variant="accent">{entry.mood}</StatusBadge>
              <StatusBadge>{entry.visibility}</StatusBadge>
            </div>
            {entry.author && (
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
                <UserRound className="size-3" />
                {entry.author.name}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-serif text-3xl text-parchment">{entry.title}</h3>
            <p className="mt-3 line-clamp-4 text-sm leading-7 text-parchment/65">
              {entry.content}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <DiaryDate date={entry.created_at} />

          <div className="flex items-center gap-4 text-sm text-parchment/55">
            <span className="inline-flex items-center gap-2">
              <MessageCircle className="size-4" />
              {commentCount}
            </span>
            <span className="inline-flex items-center gap-2">
              <Sparkles className="size-4" />
              {reactionCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
