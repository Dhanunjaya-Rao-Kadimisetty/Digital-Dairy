import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Notification } from "@/lib/types";

export async function getNotifications(userId: string): Promise<Notification[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("notifications")
    .select("*, actor:profiles!notifications_actor_id_fkey(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }

  return data as Notification[];
}

export async function getUnreadNotificationsCount(userId: string): Promise<number> {
  const supabase = await createSupabaseServerClient();

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { head: true, count: "exact" })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) {
    return 0;
  }

  return count ?? 0;
}
