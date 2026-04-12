"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, MessageCircleMore } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createCommentAction } from "@/lib/actions/comments";
import { commentSchema, type CommentValues } from "@/lib/validators/diary";
import { FieldError } from "@/components/ui/field-error";

export function CommentForm({ entryId }: { entryId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<CommentValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      entryId,
      content: ""
    }
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await createCommentAction(values);

      if (!result.success) {
        toast.error(result.error ?? "Comment couldn't be added.");
        return;
      }

      toast.success("Comment added.");
      form.reset({ entryId, content: "" });
      router.refresh();
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input type="hidden" {...form.register("entryId")} />
      <textarea
        rows={4}
        className="soft-input min-h-28 resize-y"
        placeholder="Leave a kind note, a memory, or a little reaction in words..."
        {...form.register("content")}
      />
      <FieldError message={form.formState.errors.content?.message} />
      <button type="submit" disabled={isPending} className="soft-button gap-2">
        {isPending ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <MessageCircleMore className="size-4" />
        )}
        Add comment
      </button>
    </form>
  );
}

