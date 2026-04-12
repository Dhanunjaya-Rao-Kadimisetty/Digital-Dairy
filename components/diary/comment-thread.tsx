"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { deleteCommentAction } from "@/lib/actions/comments";
import type { CommentItem } from "@/lib/types";
import { formatDateTime, getInitials } from "@/lib/utils";

export function CommentThread({
  comments,
  currentUserId,
  entryId
}: {
  comments: CommentItem[];
  currentUserId: string;
  entryId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (!comments.length) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-black/10 px-5 py-6 text-sm text-parchment/60">
        No comments yet. The first response can live here.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const canDelete = comment.user_id === currentUserId;

        return (
          <article key={comment.id} className="rounded-3xl border border-white/10 bg-black/20 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-full bg-white/10 font-semibold text-parchment">
                  {getInitials(comment.user?.name ?? "Member")}
                </div>
                <div>
                  <p className="font-medium text-parchment">{comment.user?.name ?? "Member"}</p>
                  <p className="text-xs uppercase tracking-[0.24em] text-parchment/45">
                    {formatDateTime(comment.created_at)}
                  </p>
                </div>
              </div>
              {canDelete ? (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    startTransition(async () => {
                      const result = await deleteCommentAction(comment.id, entryId);

                      if (!result.success) {
                        toast.error(result.error ?? "Comment couldn't be removed.");
                        return;
                      }

                      toast.success("Comment removed.");
                      router.refresh();
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-sm text-parchment/65 hover:bg-white/10"
                >
                  <Trash2 className="size-4" />
                  Delete
                </button>
              ) : null}
            </div>
            <p className="mt-4 text-sm leading-7 text-parchment/70">{comment.content}</p>
          </article>
        );
      })}
    </div>
  );
}
