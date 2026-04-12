import type { FutureLetter, Profile } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getFutureLetters(_profile: Profile) {
  void _profile;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("future_letters")
    .select("*, author:profiles!future_letters_created_by_fkey(id, name, role, avatar_url)")
    .order("unlock_date", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as FutureLetter[];
}
