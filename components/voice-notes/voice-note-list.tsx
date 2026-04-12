"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { VoiceNote } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export function VoiceNoteList({
  items,
  currentUserId
}: {
  items: VoiceNote[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const removeItem = (item: VoiceNote) => {
    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.from("voice_notes").delete().eq("id", item.id);

      if (error) {
        toast.error(error.message);
        return;
      }

      await supabase.storage.from("voice-notes").remove([item.audio_url]);
      toast.success("Voice note removed.");
      router.refresh();
    });
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {items.map((item) => {
        const canManage = item.uploaded_by === currentUserId;

        return (
          <article key={item.id} className="glass-panel flex flex-col gap-5 p-5">
            <div className="space-y-2">
              <p className="font-serif text-3xl text-parchment">{item.title}</p>
              <p className="text-sm text-parchment/55">{formatDateTime(item.created_at)}</p>
            </div>
            {item.signedUrl ? (
              <audio controls className="w-full">
                <source src={item.signedUrl} />
              </audio>
            ) : null}
            {item.note ? (
              <p className="text-sm leading-7 text-parchment/70">{item.note}</p>
            ) : null}
            {canManage ? (
              <button
                type="button"
                disabled={isPending}
                onClick={() => removeItem(item)}
                className="soft-button-secondary gap-2 self-start"
              >
                <Trash2 className="size-4" />
                Delete
              </button>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
