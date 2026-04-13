import type { Profile } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getProfileSnapshot(profile: Profile) {
  const supabase = await createSupabaseServerClient();

  const [entries, comments, reactions] = await Promise.all([
    supabase
      .from("diary_entries")
      .select("*", { head: true, count: "exact" })
      .eq("author_id", profile.id),
    supabase.from("comments").select("*", { head: true, count: "exact" }).eq("user_id", profile.id),
    supabase
      .from("reactions")
      .select("*", { head: true, count: "exact" })
      .eq("user_id", profile.id)
  ]);

  if (entries.error) {
    throw new Error(entries.error.message);
  }

  if (comments.error) {
    throw new Error(comments.error.message);
  }

  if (reactions.error) {
    throw new Error(reactions.error.message);
  }

  return {
    entries: entries.count ?? 0,
    comments: comments.count ?? 0,
    reactions: reactions.count ?? 0
  };
}

export async function getPartnerProfile(currentUserId: string): Promise<Profile | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .neq("id", currentUserId)
    .limit(1)
    .single();

  if (error) {
    return null;
  }

  return data as Profile;
}

