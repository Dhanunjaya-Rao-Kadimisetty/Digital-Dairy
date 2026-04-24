"use server";

import { revalidatePath } from "next/cache";

import { getViewerOrRedirect } from "@/lib/auth/approved-users";
import {
  futureLetterSchema,
  type FutureLetterValues
} from "@/lib/validators/future-letter";

import { createNotification } from "./notifications";
import type { ActionResult } from "./auth";

function revalidateLetters(letterId?: string) {
  revalidatePath("/future-letters");
  revalidatePath("/dashboard");
  if (letterId) {
    revalidatePath(`/future-letters/${letterId}`);
  }
}

export async function createFutureLetterAction(
  values: FutureLetterValues
): Promise<ActionResult> {
  const parsed = futureLetterSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const { profile, supabase } = await getViewerOrRedirect();

  const { error } = await supabase.from("future_letters").insert({
    title: parsed.data.title,
    content: parsed.data.content,
    unlock_date: parsed.data.unlockDate,
    created_by: profile.id
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // Notify partner
  await createNotification({
    type: "future_letter",
    content: parsed.data.title
  });

  revalidateLetters();
  return { success: true };
}

export async function deleteFutureLetterAction(letterId: string): Promise<ActionResult> {
  const { profile, supabase } = await getViewerOrRedirect();

  const { error } = await supabase
    .from("future_letters")
    .delete()
    .eq("id", letterId)
    .eq("created_by", profile.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateLetters(letterId);
  return { success: true };
}
