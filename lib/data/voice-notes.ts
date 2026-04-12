import type { Profile, VoiceNote } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getVoiceNotes(_profile: Profile) {
  void _profile;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("voice_notes")
    .select("*, uploader:profiles!voice_notes_uploaded_by_fkey(id, name, role, avatar_url)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const items = (data ?? []) as VoiceNote[];
  const { data: signedData } = await supabase.storage
    .from("voice-notes")
    .createSignedUrls(
      items.map((item) => item.audio_url),
      60 * 60
    );

  return items.map((item, index) => ({
    ...item,
    signedUrl: signedData?.[index]?.signedUrl ?? null
  }));
}
