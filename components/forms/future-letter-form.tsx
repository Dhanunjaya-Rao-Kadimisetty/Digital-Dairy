"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Milestone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createFutureLetterAction } from "@/lib/actions/future-letters";
import {
  futureLetterSchema,
  type FutureLetterValues
} from "@/lib/validators/future-letter";
import { FieldError } from "@/components/ui/field-error";

export function FutureLetterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<FutureLetterValues>({
    resolver: zodResolver(futureLetterSchema),
    defaultValues: {
      title: "",
      content: "",
      unlockDate: ""
    }
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await createFutureLetterAction(values);

      if (!result.success) {
        toast.error(result.error ?? "Letter couldn't be stored.");
        return;
      }

      toast.success("Future letter sealed.");
      form.reset();
      router.refresh();
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="soft-label">Letter title</label>
        <input className="soft-input" {...form.register("title")} />
        <FieldError message={form.formState.errors.title?.message} />
      </div>
      <div>
        <label className="soft-label">Unlock date</label>
        <input type="date" className="soft-input" {...form.register("unlockDate")} />
        <FieldError message={form.formState.errors.unlockDate?.message} />
      </div>
      <div>
        <label className="soft-label">Message</label>
        <textarea
          rows={8}
          className="soft-input min-h-48 resize-y"
          {...form.register("content")}
        />
        <FieldError message={form.formState.errors.content?.message} />
      </div>
      <button type="submit" disabled={isPending} className="soft-button gap-2">
        {isPending ? <LoaderCircle className="size-4 animate-spin" /> : <Milestone className="size-4" />}
        Save future letter
      </button>
    </form>
  );
}

