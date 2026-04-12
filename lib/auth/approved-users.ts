import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile, Role } from "@/lib/types";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getAllowedEmails() {
  return (process.env.SUPABASE_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean)
    .map(normalizeEmail);
}

export function getRoleFromEmail(): Role {
  return "member";
}

export function isApprovedEmail(email?: string | null) {
  if (!email) {
    return false;
  }

  return getAllowedEmails().includes(normalizeEmail(email));
}

export async function ensureApprovedProfile(user: User): Promise<Profile | null> {
  if (!user.email || !isApprovedEmail(user.email)) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const nameFromAuth =
    user.user_metadata?.name ??
    user.user_metadata?.full_name ??
    user.email.split("@")[0].replace(/[._-]/g, " ");

  const payload = {
    id: user.id,
    name: String(nameFromAuth)
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" "),
    role: getRoleFromEmail(),
    avatar_url: user.user_metadata?.avatar_url ?? null
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Profile;
}

export async function getViewerOrRedirect() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await ensureApprovedProfile(user);

  if (!profile) {
    redirect("/login?error=unauthorized");
  }

  return { user, profile, supabase };
}

export async function redirectIfAuthenticated() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user && isApprovedEmail(user.email)) {
    await ensureApprovedProfile(user);
    redirect("/dashboard");
  }
}
