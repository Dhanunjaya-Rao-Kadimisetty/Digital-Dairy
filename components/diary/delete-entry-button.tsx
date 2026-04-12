"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { deleteDiaryEntryAction } from "@/lib/actions/diary";

export function DeleteEntryButton({ entryId }: { entryId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!window.confirm("Delete this diary entry?")) {
          return;
        }

        startTransition(async () => {
          const result = await deleteDiaryEntryAction(entryId);

          if (!result.success) {
            toast.error(result.error ?? "Entry couldn't be deleted.");
            return;
          }

          toast.success("Entry deleted.");
          router.push("/diary");
          router.refresh();
        });
      }}
      className="soft-button-secondary gap-2"
    >
      <Trash2 className="size-4" />
      Delete entry
    </button>
  );
}

