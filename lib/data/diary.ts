import type { CommentItem, DiaryEntry, Profile, Reaction } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type DiaryFilters = {
  search?: string;
  mood?: string;
  date?: string;
};

/** Generate signed URLs for entries that have media attached. */
async function attachMediaSignedUrls(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  entries: DiaryEntry[]
): Promise<DiaryEntry[]> {
  const mediaPaths = entries
    .map((e) => e.media_url)
    .filter((url): url is string => Boolean(url));

  if (mediaPaths.length === 0) return entries;

  const { data: signedData } = await supabase.storage
    .from("diary-media")
    .createSignedUrls(mediaPaths, 60 * 60); // 1 hour

  const signedMap = new Map<string, string>();
  signedData?.forEach((item) => {
    if (item.signedUrl && item.path) {
      signedMap.set(item.path, item.signedUrl);
    }
  });

  return entries.map((entry) => ({
    ...entry,
    media_signed_url: entry.media_url ? signedMap.get(entry.media_url) ?? null : null
  }));
}

export async function getDiaryEntries(profile: Profile, filters: DiaryFilters = {}) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("diary_entries")
    .select(
      "*, author:profiles!diary_entries_author_id_fkey(id, name, role, avatar_url), comments(id), reactions(id, emoji, user_id)"
    )
    .order("created_at", { ascending: false });

  if (filters.search) {
    const safeSearch = filters.search.replace(/[%_]/g, "");
    query = query.or(`title.ilike.%${safeSearch}%,content.ilike.%${safeSearch}%`);
  }

  if (filters.mood) {
    query = query.eq("mood", filters.mood);
  }

  if (filters.date) {
    const start = new Date(filters.date);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    query = query.gte("created_at", start.toISOString()).lt("created_at", end.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const entries = (data ?? []) as DiaryEntry[];
  return attachMediaSignedUrls(supabase, entries);
}

export async function getDiaryEntryById(entryId: string, profile: Profile) {
  void profile;
  const supabase = await createSupabaseServerClient();

  const entryQuery = supabase
    .from("diary_entries")
    .select("*, author:profiles!diary_entries_author_id_fkey(id, name, role, avatar_url)")
    .eq("id", entryId);

  const [{ data: entry, error: entryError }, { data: comments, error: commentsError }, { data: reactions, error: reactionsError }] =
    await Promise.all([
      entryQuery.maybeSingle(),
      supabase
        .from("comments")
        .select("*, user:profiles!comments_user_id_fkey(id, name, role, avatar_url)")
        .eq("entry_id", entryId)
        .order("created_at", { ascending: true }),
      supabase
        .from("reactions")
        .select("*, user:profiles!reactions_user_id_fkey(id, name, role, avatar_url)")
        .eq("entry_id", entryId)
    ]);

  if (entryError) {
    throw new Error(entryError.message);
  }

  if (commentsError) {
    throw new Error(commentsError.message);
  }

  if (reactionsError) {
    throw new Error(reactionsError.message);
  }

  if (!entry) {
    return null;
  }

  const typedEntry = entry as DiaryEntry;

  // Generate signed URL for media if present
  let mediaSignedUrl: string | null = null;
  if (typedEntry.media_url) {
    const { data: signedData } = await supabase.storage
      .from("diary-media")
      .createSignedUrl(typedEntry.media_url, 60 * 60);
    mediaSignedUrl = signedData?.signedUrl ?? null;
  }

  return {
    ...typedEntry,
    media_signed_url: mediaSignedUrl,
    comments: (comments ?? []) as CommentItem[],
    reactions: (reactions ?? []) as Reaction[]
  };
}
