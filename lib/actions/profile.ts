"use server";

import { revalidatePath } from "next/cache";

import { getViewerOrRedirect } from "@/lib/auth/approved-users";
import { profileSchema, type ProfileValues } from "@/lib/validators/profile";

import type { ActionResult } from "./auth";

export async function updateProfileAction(
  values: ProfileValues
): Promise<ActionResult> {
  const parsed = profileSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const { profile, supabase } = await getViewerOrRedirect();

  const { error } = await supabase
    .from("profiles")
    .update({
      name: parsed.data.name,
      avatar_url: parsed.data.avatarUrl || null
    })
    .eq("id", profile.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  revalidatePath("/", "layout");
  return { success: true };
}
