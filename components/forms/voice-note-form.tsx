"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, MicVocal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { slugifyFilename } from "@/lib/utils";
import { voiceNoteSchema, type VoiceNoteValues } from "@/lib/validators/storage";
import { createNotification } from "@/lib/actions/notifications";
import { FieldError } from "@/components/ui/field-error";

export function VoiceNoteForm({ userId }: { userId: string }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<VoiceNoteValues>({
    resolver: zodResolver(voiceNoteSchema),
    defaultValues: {
      title: "",
      note: ""
    }
  });

  const onSubmit = form.handleSubmit((values) => {
    const file = fileRef.current?.files?.[0];

    startTransition(async () => {
      if (!file) {
        toast.error("Choose an audio file first.");
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const path = `${userId}/${Date.now()}-${slugifyFilename(file.name)}`;
      const { error: uploadError } = await supabase.storage
        .from("voice-notes")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false
        });

      if (uploadError) {
        toast.error(uploadError.message);
        return;
      }

      const { error } = await supabase.from("voice_notes").insert({
        audio_url: path,
        title: values.title,
        note: values.note || null,
        uploaded_by: userId
      });

      if (error) {
        toast.error(error.message);
        await supabase.storage.from("voice-notes").remove([path]);
        return;
      }

      // Notify partner
      await createNotification({
        type: "voice_note",
        content: values.title
      });

      toast.success("Voice note saved.");
      form.reset();
      if (fileRef.current) {
        fileRef.current.value = "";
      }
      router.refresh();
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="soft-label">Audio file</label>
        <input
          ref={fileRef}
          id="voice-file"
          type="file"
          accept="audio/*"
          className="soft-input file:mr-4 file:rounded-full file:border-0 file:bg-parchment file:px-4 file:py-2 file:text-sm file:font-semibold file:text-cedar"
        />
      </div>
      <div>
        <label className="soft-label">Title</label>
        <input className="soft-input" {...form.register("title")} />
        <FieldError message={form.formState.errors.title?.message} />
      </div>
      <div>
        <label className="soft-label">Optional note</label>
        <textarea className="soft-input min-h-32 resize-y" {...form.register("note")} />
        <FieldError message={form.formState.errors.note?.message} />
      </div>
      <button type="submit" disabled={isPending} className="soft-button gap-2">
        {isPending ? <LoaderCircle className="size-4 animate-spin" /> : <MicVocal className="size-4" />}
        Upload voice note
      </button>
    </form>
  );
}
