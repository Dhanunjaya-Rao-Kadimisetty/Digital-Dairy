"use server";

import { revalidatePath } from "next/cache";
import { getViewerOrRedirect } from "@/lib/auth/approved-users";
import { getPartnerProfile } from "@/lib/data/profile";
import type { NotificationType } from "@/lib/types";
import type { ActionResult } from "./auth";

export async function createNotification({
  type,
  entryId,
  content
}: {
  type: NotificationType;
  entryId?: string;
  content?: string;
}) {
  try {
    const { profile, supabase } = await getViewerOrRedirect();
    const partner = await getPartnerProfile(profile.id);

    if (!partner) return { success: false, error: "No partner found to notify." };

    const { error } = await supabase.from("notifications").insert({
      user_id: partner.id,
      actor_id: profile.id,
      type,
      entry_id: entryId,
      content,
      is_read: false
    });

    if (error) {
      console.error("Failed to create notification:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Notification action error:", error);
    return { success: false, error: "Internal error" };
  }
}

export async function markNotificationAsRead(id: string): Promise<ActionResult> {
  const { profile, supabase } = await getViewerOrRedirect();

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id)
    .eq("user_id", profile.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function markAllNotificationsAsRead(): Promise<ActionResult> {
  const { profile, supabase } = await getViewerOrRedirect();

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", profile.id)
    .eq("is_read", false);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
