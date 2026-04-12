"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  createDiaryEntryAction,
  updateDiaryEntryAction
} from "@/lib/actions/diary";
import { diaryMoods, visibilityOptions } from "@/lib/constants";
import type { DiaryEntry } from "@/lib/types";
import {
  diaryEntrySchema,
  type DiaryEntryValues
} from "@/lib/validators/diary";
import { FieldError } from "@/components/ui/field-error";

export function DiaryEntryForm({ entry }: { entry?: DiaryEntry }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<DiaryEntryValues>({
    resolver: zodResolver(diaryEntrySchema),
    defaultValues: {
      title: entry?.title ?? "",
      content: entry?.content ?? "",
      mood: (entry?.mood as DiaryEntryValues["mood"]) ?? "Hopeful",
      visibility: entry?.visibility ?? "shared"
    }
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = entry
        ? await updateDiaryEntryAction(entry.id, values)
        : await createDiaryEntryAction(values);

      if (!result.success) {
        toast.error(result.error ?? "We couldn't save that entry.");
        return;
      }

      toast.success(entry ? "Entry updated." : "Entry created.");
      if (!entry) {
        form.reset({ title: "", content: "", mood: "Hopeful", visibility: "shared" });
      }
      router.refresh();
    });
  });

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

      <button type="submit" disabled={isPending} className="soft-button gap-2">
        {isPending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
        {entry ? "Save changes" : "Publish entry"}
      </button>
    </form>
  );
}
