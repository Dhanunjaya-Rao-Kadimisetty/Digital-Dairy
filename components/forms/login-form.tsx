"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, LockKeyhole, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createAccountAction, loginAction } from "@/lib/actions/auth";
import {
  loginSchema,
  signUpSchema,
  type LoginValues,
  type SignUpValues
} from "@/lib/validators/auth";
import { FieldError } from "@/components/ui/field-error";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [isPending, startTransition] = useTransition();
  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const onLoginSubmit = loginForm.handleSubmit((values) => {
    startTransition(async () => {
      const result = await loginAction(values);

      if (!result.success) {
        toast.error(result.error ?? "Unable to sign in.");
        return;
      }

      toast.success("Welcome back.");
      router.push("/dashboard");
      router.refresh();
    });
  });

  const onSignUpSubmit = signUpForm.handleSubmit((values) => {
    startTransition(async () => {
      const result = await createAccountAction(values);

      if (!result.success) {
        toast.error(result.error ?? "Unable to create account.");
        return;
      }

      toast.success(result.message ?? "Account created.");
      if (!result.message?.includes("verify your email")) {
        router.push("/dashboard");
        router.refresh();
      }
    });
  });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2 rounded-full border border-white/10 bg-black/20 p-1">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`rounded-full px-4 py-3 text-sm ${
            mode === "login" ? "bg-white/10 text-parchment" : "text-parchment/55"
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`rounded-full px-4 py-3 text-sm ${
            mode === "signup" ? "bg-white/10 text-parchment" : "text-parchment/55"
          }`}
        >
          Create account
        </button>
      </div>

      {mode === "login" ? (
        <form onSubmit={onLoginSubmit} className="space-y-5">
          <div>
            <label className="soft-label" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              className="soft-input"
              {...loginForm.register("email")}
            />
            <FieldError message={loginForm.formState.errors.email?.message} />
          </div>

          <div>
            <label className="soft-label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              className="soft-input"
              {...loginForm.register("password")}
            />
            <FieldError message={loginForm.formState.errors.password?.message} />
          </div>

          <button type="submit" disabled={isPending} className="soft-button w-full gap-2">
            {isPending ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <LockKeyhole className="size-4" />
            )}
            Enter the diary
          </button>
        </form>
      ) : (
        <form onSubmit={onSignUpSubmit} className="space-y-5">
          <div>
            <label className="soft-label" htmlFor="signup-name">
              Display name
            </label>
            <input
              id="signup-name"
              className="soft-input"
              {...signUpForm.register("name")}
            />
            <FieldError message={signUpForm.formState.errors.name?.message} />
          </div>

          <div>
            <label className="soft-label" htmlFor="signup-email">
              Approved email
            </label>
            <input
              id="signup-email"
              type="email"
              className="soft-input"
              {...signUpForm.register("email")}
            />
            <FieldError message={signUpForm.formState.errors.email?.message} />
          </div>

          <div>
            <label className="soft-label" htmlFor="signup-password">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              className="soft-input"
              {...signUpForm.register("password")}
            />
            <FieldError message={signUpForm.formState.errors.password?.message} />
          </div>

          <div>
            <label className="soft-label" htmlFor="signup-confirm-password">
              Confirm password
            </label>
            <input
              id="signup-confirm-password"
              type="password"
              className="soft-input"
              {...signUpForm.register("confirmPassword")}
            />
            <FieldError message={signUpForm.formState.errors.confirmPassword?.message} />
          </div>

          <button type="submit" disabled={isPending} className="soft-button w-full gap-2">
            {isPending ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <UserPlus className="size-4" />
            )}
            Create approved account
          </button>
        </form>
      )}
    </div>
  );
}
