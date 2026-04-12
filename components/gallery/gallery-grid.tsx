"use client";

import Image from "next/image";
import { Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { GalleryMemory } from "@/lib/types";
import { formatFullDate } from "@/lib/utils";

export function GalleryGrid({
  items,
  currentUserId
}: {
  items: GalleryMemory[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<GalleryMemory | null>(null);
  const [isPending, startTransition] = useTransition();

  const removeItem = (item: GalleryMemory) => {
    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.from("gallery_memories").delete().eq("id", item.id);

      if (error) {
        toast.error(error.message);
        return;
      }

      await supabase.storage.from("gallery").remove([item.image_url]);
      toast.success("Memory removed.");
      router.refresh();
    });
  };

  return (
    <>
      <div className="columns-1 gap-5 space-y-5 md:columns-2 xl:columns-3">
        {items.map((item) => {
          const canManage = item.uploaded_by === currentUserId;

          return (
            <article
              key={item.id}
              className="glass-panel relative mb-5 break-inside-avoid overflow-hidden"
            >
              <button
                className="block w-full text-left"
                onClick={() => setSelected(item)}
                type="button"
              >
                {item.signedUrl ? (
                  <Image
                    src={item.signedUrl}
                    alt={item.caption}
                    width={900}
                    height={700}
                    className="h-auto w-full object-cover"
                  />
                ) : null}
              </button>
              <div className="space-y-3 p-5">
                <p className="font-serif text-2xl text-parchment">{item.caption}</p>
                <div className="flex items-center justify-between gap-3 text-sm text-parchment/55">
                  <span>{formatFullDate(item.memory_date)}</span>
                  {canManage ? (
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => removeItem(item)}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 hover:bg-white/10"
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelected(null)}
          role="presentation"
        >
          <div
            className="glass-panel relative max-h-[90vh] w-full max-w-5xl overflow-hidden"
            onClick={(event) => event.stopPropagation()}
            role="presentation"
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-black/30 p-2 text-parchment"
            >
              <X className="size-4" />
            </button>
            {selected.signedUrl ? (
              <Image
                src={selected.signedUrl}
                alt={selected.caption}
                width={1600}
                height={1200}
                className="max-h-[75vh] w-full object-contain"
              />
            ) : null}
            <div className="p-6">
              <p className="font-serif text-3xl text-parchment">{selected.caption}</p>
              <p className="mt-2 text-sm text-parchment/60">
                {formatFullDate(selected.memory_date)}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
