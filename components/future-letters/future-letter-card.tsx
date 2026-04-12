"use client";

import { Lock, Trash2, Unlock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { deleteFutureLetterAction } from "@/lib/actions/future-letters";
import type { FutureLetter } from "@/lib/types";
import { formatFullDate, isLocked } from "@/lib/utils";
import { useCountdown } from "@/hooks/use-countdown";
import { MarkdownContent } from "@/components/shared/markdown-content";
import { StatusBadge } from "@/components/ui/status-badge";

export function FutureLetterCard({
  letter,
  currentUserId
}: {
  letter: FutureLetter;
  currentUserId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const countdown = useCountdown(letter.unlock_date);
  const locked = isLocked(letter.unlock_date);
  const canManage = letter.created_by === currentUserId;

  return (
    <article className="glass-panel space-y-5 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <StatusBadge variant={locked ? "muted" : "accent"}>
            {locked ? "Locked" : "Unlocked"}
          </StatusBadge>
          <h3 className="font-serif text-3xl text-parchment">{letter.title}</h3>
          <p className="text-sm text-parchment/55">
            Opens on {formatFullDate(letter.unlock_date)}
          </p>
        </div>
        {canManage ? (
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                const result = await deleteFutureLetterAction(letter.id);

                if (!result.success) {
                  toast.error(result.error ?? "Letter couldn't be removed.");
                  return;
                }

                toast.success("Letter removed.");
                router.refresh();
              })
            }
            className="soft-button-secondary gap-2"
          >
            <Trash2 className="size-4" />
            Delete
          </button>
        ) : null}
      </div>

      {locked ? (
        <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
          <div className="mb-3 inline-flex items-center gap-2 text-parchment">
            <Lock className="size-4" />
            <span className="font-medium">This letter is resting for now.</span>
          </div>
          <p className="text-sm leading-7 text-parchment/65">
            {countdown
              ? `${countdown.days} days, ${countdown.hours} hours, and ${countdown.minutes} minutes until it opens.`
              : "Almost there."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 text-[#ffd9ba]">
            <Unlock className="size-4" />
            <span className="text-sm uppercase tracking-[0.28em]">Open now</span>
          </div>
          <MarkdownContent content={letter.content} />
        </div>
      )}
    </article>
  );
}
