"use server";

import { revalidatePath } from "next/cache";

import { getViewerOrRedirect } from "@/lib/auth/approved-users";
import {
  commentSchema,
  reactionSchema,
  type CommentValues,
  type ReactionValues
} from "@/lib/validators/diary";

import type { ActionResult } from "./auth";

function revalidateEntry(entryId: string) {
  revalidatePath("/diary");
  revalidatePath(`/diary/${entryId}`);
  revalidatePath("/dashboard");
}

export async function createCommentAction(
  values: CommentValues
): Promise<ActionResult> {
  const parsed = commentSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const { profile, supabase } = await getViewerOrRedirect();

  const { error } = await supabase.from("comments").insert({
    entry_id: parsed.data.entryId,
    user_id: profile.id,
    content: parsed.data.content
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateEntry(parsed.data.entryId);
  return { success: true };
}

export async function deleteCommentAction(
  commentId: string,
  entryId: string
): Promise<ActionResult> {
  const { profile, supabase } = await getViewerOrRedirect();
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", profile.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateEntry(entryId);
  return { success: true };
}

export async function toggleReactionAction(
  values: ReactionValues
): Promise<ActionResult> {
  const parsed = reactionSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const { profile, supabase } = await getViewerOrRedirect();
  const { entryId, emoji } = parsed.data;

  const { data: existing, error: fetchError } = await supabase
    .from("reactions")
    .select("id, emoji")
    .eq("entry_id", entryId)
    .eq("user_id", profile.id)
    .maybeSingle();

  if (fetchError) {
    return { success: false, error: fetchError.message };
  }

  const query =
    existing?.emoji === emoji
      ? supabase.from("reactions").delete().eq("id", existing.id)
      : supabase.from("reactions").upsert(
          {
            entry_id: entryId,
            user_id: profile.id,
            emoji
          },
          { onConflict: "entry_id,user_id" }
        );

  const { error } = await query;

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateEntry(entryId);
  return { success: true };
}
