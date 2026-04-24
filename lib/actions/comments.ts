"use server";

import { revalidatePath } from "next/cache";

import { getViewerOrRedirect } from "@/lib/auth/approved-users";
import {
  commentSchema,
  reactionSchema,
  type CommentValues,
  type ReactionValues
} from "@/lib/validators/diary";

import { createNotification } from "./notifications";
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

  // Notify partner
  await createNotification({
    type: "comment",
    entryId: parsed.data.entryId,
    content: parsed.data.content
  });

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

  const { user, supabase } = await getViewerOrRedirect();
  const { entryId, emoji } = parsed.data;
  const userId = user.id;

  // Explicitly fetch the existing reaction for this user and entry
  const { data: existing, error: fetchError } = await supabase
    .from("reactions")
    .select("id, emoji")
    .eq("entry_id", entryId)
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError) {
    console.error("Fetch reaction error:", fetchError);
    return { success: false, error: fetchError.message };
  }

  let dbQuery;

  if (existing) {
    if (existing.emoji === emoji) {
      // If same emoji, we toggle it off (delete)
      dbQuery = supabase.from("reactions").delete().eq("id", existing.id);
    } else {
      // If different emoji, we update the existing reaction
      dbQuery = supabase.from("reactions").update({ emoji }).eq("id", existing.id);
    }
  } else {
    // No reaction yet, create a new one
    dbQuery = supabase.from("reactions").insert({
      entry_id: entryId,
      user_id: userId,
      emoji
    });
  }

  const { error } = await dbQuery;

  if (error) {
    console.error("Reaction action error:", error);
    return { success: false, error: error.message };
  }

  // Notify partner (only if adding/changing, not removing)
  if (!existing || existing.emoji !== emoji) {
    await createNotification({
      type: "reaction",
      entryId,
      content: emoji
    });
  }

  revalidateEntry(entryId);
  return { success: true };
}
