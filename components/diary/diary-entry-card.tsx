import Link from "next/link";
import { MessageCircle, Sparkles } from "lucide-react";

import type { DiaryEntry } from "@/lib/types";
import { formatFullDate, fromNow } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";

export function DiaryEntryCard({ entry }: { entry: DiaryEntry }) {
  const commentCount = entry.comments?.length ?? 0;
  const reactionCount = entry.reactions?.length ?? 0;

  return (
    <Link
      href={`/diary/${entry.id}`}
      className="glass-panel group flex h-full flex-col justify-between p-5 transition hover:-translate-y-1 hover:bg-white/10"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge variant="accent">{entry.mood}</StatusBadge>
          <StatusBadge>{entry.visibility}</StatusBadge>
        </div>

        <div>
          <h3 className="font-serif text-3xl text-parchment">{entry.title}</h3>
          <p className="mt-3 line-clamp-4 text-sm leading-7 text-parchment/65">
            {entry.content}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-3 text-sm text-parchment/50">
          <span>{formatFullDate(entry.created_at)}</span>
          <span className="text-parchment/25">•</span>
          <span>{fromNow(entry.created_at)}</span>
        </div>
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
    </Link>
  );
}

