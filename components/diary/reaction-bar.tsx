"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { toggleReactionAction } from "@/lib/actions/comments";
import { reactionOptions } from "@/lib/constants";
import type { Reaction } from "@/lib/types";

type ReactionBarProps = {
  entryId: string;
  reactions: Reaction[];
  currentUserId: string;
};

export function ReactionBar({
  entryId,
  reactions,
  currentUserId
}: ReactionBarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const grouped = reactionOptions.map((emoji) => {
    const count = reactions.filter((reaction) => reaction.emoji === emoji).length;
    const active = reactions.some(
      (reaction) => reaction.emoji === emoji && reaction.user_id === currentUserId
    );
    return { emoji, count, active };
  });

  return (
    <div className="flex flex-wrap gap-3">
      {grouped.map((item) => (
        <button
          key={item.emoji}
          type="button"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              const result = await toggleReactionAction({
                entryId,
                emoji: item.emoji
              });

              if (!result.success) {
                toast.error(result.error ?? "Reaction failed.");
                return;
              }

              router.refresh();
            })
          }
          className={`rounded-full border px-4 py-2 text-sm transition ${
            item.active
              ? "border-gold/35 bg-gold/15 text-parchment"
              : "border-white/10 bg-white/8 text-parchment/70 hover:bg-white/10"
          }`}
        >
          <span className="mr-2">{item.emoji}</span>
          {item.count}
        </button>
      ))}
    </div>
  );
}

