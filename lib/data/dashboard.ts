import type { DashboardSnapshot, Profile } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function countRows(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  table: string
) {
  const { count, error } = await supabase
    .from(table)
    .select("*", { head: true, count: "exact" });

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

export async function getDashboardSnapshot(profile: Profile): Promise<DashboardSnapshot> {
  void profile;
  const supabase = await createSupabaseServerClient();

  const recentEntriesQuery = supabase
    .from("diary_entries")
    .select(
      "*, author:profiles!diary_entries_author_id_fkey(id, name, role, avatar_url), comments(id), reactions(id)"
    )
    .order("created_at", { ascending: false })
    .limit(4);

  const totalEntriesQuery = supabase
    .from("diary_entries")
    .select("*", { head: true, count: "exact" });

  const sharedEntriesQuery = supabase
    .from("diary_entries")
    .select("*", { head: true, count: "exact" })
    .eq("visibility", "shared");

  const [recentEntriesResponse, totalEntriesResponse, sharedEntriesResponse, memories, voiceNotes, futureLetters] =
    await Promise.all([
      recentEntriesQuery,
      totalEntriesQuery,
      sharedEntriesQuery,
      countRows(supabase, "gallery_memories"),
      countRows(supabase, "voice_notes"),
      countRows(supabase, "future_letters")
    ]);

  if (recentEntriesResponse.error) {
    throw new Error(recentEntriesResponse.error.message);
  }

  if (totalEntriesResponse.error) {
    throw new Error(totalEntriesResponse.error.message);
  }

  if (sharedEntriesResponse.error) {
    throw new Error(sharedEntriesResponse.error.message);
  }

  return {
    recentEntries: recentEntriesResponse.data ?? [],
    totalEntries: totalEntriesResponse.count ?? 0,
    sharedEntries: sharedEntriesResponse.count ?? 0,
    memories,
    voiceNotes,
    futureLetters
  };
}
