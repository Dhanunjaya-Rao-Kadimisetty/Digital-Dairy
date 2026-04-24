"use server";

import { revalidatePath } from "next/cache";

import { getViewerOrRedirect } from "@/lib/auth/approved-users";
import { diaryEntrySchema, type DiaryEntryValues } from "@/lib/validators/diary";

import { createNotification } from "./notifications";
import type { ActionResult } from "./auth";

function revalidateDiaryViews(entryId?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/diary");
  if (entryId) {
    revalidatePath(`/diary/${entryId}`);
  }
}

export async function createDiaryEntryAction(
  values: DiaryEntryValues
): Promise<ActionResult> {
  const parsed = diaryEntrySchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const { profile, supabase } = await getViewerOrRedirect();

  const { data, error } = await supabase
    .from("diary_entries")
    .insert({
      title: parsed.data.title,
      content: parsed.data.content,
      mood: parsed.data.mood,
      visibility: parsed.data.visibility,
      author_id: profile.id
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  // Notify partner
  if (parsed.data.visibility === "shared") {
    await createNotification({
      type: "diary_entry",
      entryId: data.id,
      content: parsed.data.title
    });
  }

  revalidateDiaryViews();
  return { success: true };
}

export async function updateDiaryEntryAction(
  entryId: string,
  values: DiaryEntryValues
): Promise<ActionResult> {
  const parsed = diaryEntrySchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const { profile, supabase } = await getViewerOrRedirect();

  const { error } = await supabase
    .from("diary_entries")
    .update({
      title: parsed.data.title,
      content: parsed.data.content,
      mood: parsed.data.mood,
      visibility: parsed.data.visibility,
      updated_at: new Date().toISOString()
    })
    .eq("id", entryId)
    .eq("author_id", profile.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateDiaryViews(entryId);
  return { success: true };
}

export async function deleteDiaryEntryAction(entryId: string): Promise<ActionResult> {
  const { profile, supabase } = await getViewerOrRedirect();

  const { error } = await supabase
    .from("diary_entries")
    .delete()
    .eq("id", entryId)
    .eq("author_id", profile.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateDiaryViews(entryId);
  return { success: true };
}
