"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, LoaderCircle, Save, X, Film, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  createDiaryEntryAction,
  updateDiaryEntryAction
} from "@/lib/actions/diary";
import { diaryMoods, visibilityOptions } from "@/lib/constants";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { slugifyFilename } from "@/lib/utils";
import type { DiaryEntry } from "@/lib/types";
import {
  diaryEntrySchema,
  type DiaryEntryValues
} from "@/lib/validators/diary";
import { FieldError } from "@/components/ui/field-error";

function isVideoFile(name: string) {
  const path = name.split("?")[0];
  return /[\.-](mp4|webm|mov|avi|mkv)$/i.test(path);
}

export function DiaryEntryForm({
  entry,
  userId
}: {
  entry?: DiaryEntry;
  userId?: string;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [keepExistingMedia, setKeepExistingMedia] = useState(!!entry?.media_url);

  const form = useForm<DiaryEntryValues>({
    resolver: zodResolver(diaryEntrySchema),
    defaultValues: {
      title: entry?.title ?? "",
      content: entry?.content ?? "",
      mood: (entry?.mood as DiaryEntryValues["mood"]) ?? "Hopeful",
      visibility: entry?.visibility ?? "shared"
    }
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFileName(file.name);
    setKeepExistingMedia(false);

    // Generate preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }

  function clearFile() {
    if (fileRef.current) fileRef.current.value = "";
    setPreview(null);
    setSelectedFileName(null);
    setKeepExistingMedia(false);
  }

  const onSubmit = form.handleSubmit((values) => {
    const file = fileRef.current?.files?.[0];

    startTransition(async () => {
      let mediaUrl: string | null | undefined;

      // Upload file to Supabase Storage if a new file was selected
      if (file) {
        const supabase = createSupabaseBrowserClient();
        const ownerId = userId ?? "anonymous";
        const path = `${ownerId}/${Date.now()}-${slugifyFilename(file.name)}`;
        const { error: uploadError } = await supabase.storage
          .from("diary-media")
          .upload(path, file, {
            cacheControl: "3600",
            upsert: false
          });

        if (uploadError) {
          toast.error(`Upload failed: ${uploadError.message}`);
          return;
        }

        mediaUrl = path;
      } else if (!keepExistingMedia) {
        // User cleared the media
        mediaUrl = null;
      } else {
        // Keep existing (undefined = don't touch the column)
        mediaUrl = undefined;
      }

      const result = entry
        ? await updateDiaryEntryAction(entry.id, values, mediaUrl)
        : await createDiaryEntryAction(values, mediaUrl);

      if (!result.success) {
        toast.error(result.error ?? "We couldn't save that entry.");
        return;
      }

      toast.success(entry ? "Entry updated." : "Entry created.");
      if (!entry) {
        form.reset({ title: "", content: "", mood: "Hopeful", visibility: "shared" });
        clearFile();
      }
      router.refresh();
    });
  });

  const hasMedia = selectedFileName || (keepExistingMedia && entry?.media_url);

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="soft-label" htmlFor="title">
          Title
        </label>
        <input id="title" className="soft-input" {...form.register("title")} />
        <FieldError message={form.formState.errors.title?.message} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="soft-label" htmlFor="mood">
            Mood
          </label>
          <select id="mood" className="soft-input" {...form.register("mood")}>
            {diaryMoods.map((mood) => (
              <option key={mood} value={mood} className="bg-[#2b1712]">
                {mood}
              </option>
            ))}
          </select>
          <FieldError message={form.formState.errors.mood?.message} />
        </div>

        <div>
          <label className="soft-label" htmlFor="visibility">
            Visibility
          </label>
          <select id="visibility" className="soft-input" {...form.register("visibility")}>
            {visibilityOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-[#2b1712]">
                {option.label}
              </option>
            ))}
          </select>
          <FieldError message={form.formState.errors.visibility?.message} />
        </div>
      </div>

      <div>
        <label className="soft-label" htmlFor="content">
          Entry
        </label>
        <textarea
          id="content"
          rows={10}
          className="soft-input min-h-56 resize-y"
          {...form.register("content")}
        />
        <FieldError message={form.formState.errors.content?.message} />
      </div>

      {/* Photo / Video Upload (Optional) */}
      <div>
        <label className="soft-label">
          Photo / Video <span className="text-parchment/30">(optional)</span>
        </label>

        {hasMedia ? (
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-4">
            <button
              type="button"
              onClick={clearFile}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-1.5 text-parchment/70 backdrop-blur-sm transition hover:bg-black/80 hover:text-parchment"
            >
              <X className="size-4" />
            </button>

            {/* New file preview */}
            {preview && (
              <div className="flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 rounded-xl object-contain"
                />
              </div>
            )}

            {/* Video file indicator */}
            {selectedFileName && !preview && isVideoFile(selectedFileName) && (
              <div className="flex items-center gap-3 text-parchment/65">
                <div className="flex size-14 items-center justify-center rounded-xl bg-white/5">
                  <Film className="size-6 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-medium text-parchment/80">{selectedFileName}</p>
                  <p className="text-xs text-parchment/40">Video attached</p>
                </div>
              </div>
            )}

            {/* Non-video, non-previewable file */}
            {selectedFileName && !preview && !isVideoFile(selectedFileName) && (
              <div className="flex items-center gap-3 text-parchment/65">
                <div className="flex size-14 items-center justify-center rounded-xl bg-white/5">
                  <ImageIcon className="size-6 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-medium text-parchment/80">{selectedFileName}</p>
                  <p className="text-xs text-parchment/40">Image attached</p>
                </div>
              </div>
            )}

            {/* Existing media from entry */}
            {!selectedFileName && keepExistingMedia && entry?.media_signed_url && (
              <div className="flex items-center gap-3 text-parchment/65">
                {entry.media_url && isVideoFile(entry.media_url) ? (
                  <div className="flex size-14 items-center justify-center rounded-xl bg-white/5">
                    <Film className="size-6 text-gold" />
                  </div>
                ) : (
                  <img
                    src={entry.media_signed_url}
                    alt="Current attachment"
                    className="max-h-48 rounded-xl object-contain"
                  />
                )}
                <p className="text-xs text-parchment/40">Current attachment</p>
              </div>
            )}
          </div>
        ) : (
          <label
            htmlFor="diary-media-file"
            className="group flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-white/10 bg-black/10 px-6 py-8 transition hover:border-gold/30 hover:bg-black/20"
          >
            <div className="flex size-12 items-center justify-center rounded-full bg-white/5 transition group-hover:bg-gold/10">
              <ImagePlus className="size-5 text-parchment/40 transition group-hover:text-gold" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-parchment/60 transition group-hover:text-parchment/80">
                Click to attach a photo or video
              </p>
              <p className="mt-1 text-xs text-parchment/30">
                JPG, PNG, WebP, GIF, MP4, WebM, MOV — no size limit
              </p>
            </div>
          </label>
        )}

        <input
          ref={fileRef}
          id="diary-media-file"
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <button type="submit" disabled={isPending} className="soft-button gap-2">
        {isPending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
        {entry ? "Save changes" : "Publish entry"}
      </button>
    </form>
  );
}
