"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ensureApprovedProfile, isApprovedEmail } from "@/lib/auth/approved-users";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  loginSchema,
  signUpSchema,
  type LoginValues,
  type SignUpValues
} from "@/lib/validators/auth";

export type ActionResult = {
  success: boolean;
  error?: string;
  message?: string;
};

function getAuthErrorMessage(error: unknown) {
  if (error instanceof Error) {
    const message = error.message;

    if (message === "Invalid login credentials") {
      return "Invalid login credentials. If this is your first time, use Create account first.";
    }

    if (message.toLowerCase().includes("email not confirmed")) {
      return "Your email is not confirmed yet. Either verify it from your inbox, or disable email confirmation in Supabase Auth settings.";
    }

    if (
      message.toLowerCase().includes("fetch failed") ||
      message.toLowerCase().includes("enotfound")
    ) {
      return "Supabase could not be reached. Recheck NEXT_PUBLIC_SUPABASE_URL in .env.local and make sure your internet/DNS can open that project URL.";
    }

    return message;
  }

  return "Authentication failed. Please try again.";
}

export async function loginAction(values: LoginValues): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Please check your email and password."
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { success: false, error: getAuthErrorMessage(error) };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user || !isApprovedEmail(user.email)) {
    await supabase.auth.signOut();
    return {
      success: false,
      error: "This diary only allows the two approved family accounts."
    };
  }

  await ensureApprovedProfile(user);
  revalidatePath("/", "layout");

  return { success: true };
}

export async function createAccountAction(
  values: SignUpValues
): Promise<ActionResult> {
  const parsed = signUpSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Please check the form fields."
    };
  }

  if (!isApprovedEmail(parsed.data.email)) {
    return {
      success: false,
      error: "Only the two approved email addresses can create accounts here."
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3005"}/login`,
        data: {
          name: parsed.data.name
        }
      }
    });

    if (error) {
      return { success: false, error: getAuthErrorMessage(error) };
    }

    if (data.user && data.session) {
      await ensureApprovedProfile(data.user);
      revalidatePath("/", "layout");
      return { success: true, message: "Account created and signed in." };
    }

    return {
      success: true,
      message:
        "Account created. If Supabase email confirmation is enabled, verify your email first, then sign in."
    };
  } catch (error) {
    return { success: false, error: getAuthErrorMessage(error) };
  }
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
