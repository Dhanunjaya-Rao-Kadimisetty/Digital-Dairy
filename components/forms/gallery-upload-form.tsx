"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { slugifyFilename } from "@/lib/utils";
import {
  galleryUploadSchema,
  type GalleryUploadValues
} from "@/lib/validators/storage";
import { FieldError } from "@/components/ui/field-error";

export function GalleryUploadForm({ userId }: { userId: string }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<GalleryUploadValues>({
    resolver: zodResolver(galleryUploadSchema),
    defaultValues: {
      caption: "",
      memoryDate: ""
    }
  });

  const onSubmit = form.handleSubmit((values) => {
    const file = fileRef.current?.files?.[0];

    startTransition(async () => {
      if (!file) {
        toast.error("Choose an image first.");
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const path = `${userId}/${Date.now()}-${slugifyFilename(file.name)}`;
      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false
        });

      if (uploadError) {
        toast.error(uploadError.message);
        return;
      }

      const { error } = await supabase.from("gallery_memories").insert({
        image_url: path,
        caption: values.caption,
        memory_date: values.memoryDate,
        uploaded_by: userId
      });

      if (error) {
        toast.error(error.message);
        await supabase.storage.from("gallery").remove([path]);
        return;
      }

      toast.success("Memory added to the gallery.");
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
        <label className="soft-label">Memory image</label>
        <input
          ref={fileRef}
          id="gallery-file"
          type="file"
          accept="image/*"
          className="soft-input file:mr-4 file:rounded-full file:border-0 file:bg-parchment file:px-4 file:py-2 file:text-sm file:font-semibold file:text-cedar"
        />
      </div>
      <div>
        <label className="soft-label">Caption</label>
        <input className="soft-input" {...form.register("caption")} />
        <FieldError message={form.formState.errors.caption?.message} />
      </div>
      <div>
        <label className="soft-label">Memory date</label>
        <input type="date" className="soft-input" {...form.register("memoryDate")} />
        <FieldError message={form.formState.errors.memoryDate?.message} />
      </div>
      <button type="submit" disabled={isPending} className="soft-button gap-2">
        {isPending ? <LoaderCircle className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
        Upload memory
      </button>
    </form>
  );
}

