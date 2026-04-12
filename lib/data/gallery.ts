import type { GalleryMemory, Profile } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getGalleryMemories(_profile: Profile) {
  void _profile;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("gallery_memories")
    .select("*, uploader:profiles!gallery_memories_uploaded_by_fkey(id, name, role, avatar_url)")
    .order("memory_date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const items = (data ?? []) as GalleryMemory[];
  const { data: signedData } = await supabase.storage
    .from("gallery")
    .createSignedUrls(
      items.map((item) => item.image_url),
      60 * 60
    );

  return items.map((item, index) => ({
    ...item,
    signedUrl: signedData?.[index]?.signedUrl ?? null
  }));
}
