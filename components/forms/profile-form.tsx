"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateProfileAction } from "@/lib/actions/profile";
import type { Profile } from "@/lib/types";
import { profileSchema, type ProfileValues } from "@/lib/validators/profile";
import { FieldError } from "@/components/ui/field-error";

export function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      avatarUrl: profile.avatar_url ?? ""
    }
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await updateProfileAction(values);

      if (!result.success) {
        toast.error(result.error ?? "Profile couldn't be updated.");
        return;
      }

      toast.success("Profile updated.");
      router.refresh();
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="soft-label">Display name</label>
        <input className="soft-input" {...form.register("name")} />
        <FieldError message={form.formState.errors.name?.message} />
      </div>

      <div>
        <label className="soft-label">Avatar URL</label>
        <input className="soft-input" {...form.register("avatarUrl")} />
        <FieldError message={form.formState.errors.avatarUrl?.message} />
      </div>

      <button type="submit" disabled={isPending} className="soft-button gap-2">
        {isPending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
        Save profile
      </button>
    </form>
  );
}
